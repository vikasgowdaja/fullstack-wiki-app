# Security Checklist

Production-grade security baseline and hardening procedures for VPS infrastructure. Follow this checklist during initial setup and review periodically (at least quarterly).

---

## Security Checklist Status

| Category | Items | Completed | Last Reviewed |
|----------|-------|-----------|--------------|
| SSH Hardening | 5 | [ ] | - |
| Firewall | 4 | [ ] | - |
| SSL/TLS | 3 | [ ] | - |
| System | 4 | [ ] | - |
| Application | 5 | [ ] | - |
| Database | 4 | [ ] | - |
| Monitoring | 3 | [ ] | - |
| Backup | 3 | [ ] | - |
| **TOTAL** | **31** | **[ ]** | **-** |

---

## 1. SSH Security

### ✅ SSH Hardening Checklist

- [ ] Change SSH port from default 22
- [ ] Disable root login
- [ ] Disable password authentication (use keys only)
- [ ] Enable X11 forwarding: No
- [ ] Disable empty password login
- [ ] Limit connection attempts with Fail2Ban

### SSH Configuration

**File:** `/etc/ssh/sshd_config`

```bash
# View current SSH configuration
sudo cat /etc/ssh/sshd_config | grep -v "^#\|^$"

# Edit SSH configuration
sudo nano /etc/ssh/sshd_config
```

### SSH Hardening Steps

#### Step 1: Change SSH Port (Optional but Recommended)

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Change line:
# Port 22
# To:
Port 2222

# Update firewall
sudo ufw delete allow 22/tcp
sudo ufw allow 2222/tcp

# Restart SSH
sudo systemctl restart ssh

# Verify
sudo netstat -tulpn | grep ssh
```

#### Step 2: Disable Root Login

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Change:
# PermitRootLogin yes
# To:
PermitRootLogin no

# Restart SSH
sudo systemctl restart ssh
```

#### Step 3: Disable Password Authentication

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Ensure these settings:
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
UsePAM no

# Restart SSH
sudo systemctl restart ssh
```

#### Step 4: Disable X11 Forwarding

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Ensure:
X11Forwarding no

# Restart SSH
sudo systemctl restart ssh
```

#### Step 5: Setup SSH Key-Based Authentication

```bash
# Generate SSH key pair (on local machine, if not done)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Create .ssh directory on server
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add public key to authorized_keys
echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Test key-based login
ssh -i /path/to/private/key user@server

# Verify password auth is disabled
ssh -o PubkeyAuthentication=no user@server  # Should fail
```

### SSH Best Practices

```bash
# Monitor SSH login attempts
sudo tail -f /var/log/auth.log | grep "sshd"

# Check currently connected users
who
w

# Kill unauthorized SSH session
sudo pkill -u username

# View SSH public key fingerprint
ssh-keygen -lf ~/.ssh/id_ed25519.pub
```

---

## 2. Firewall Configuration

### ✅ Firewall Checklist

- [ ] Enable UFW firewall
- [ ] Set default policies (deny incoming, allow outgoing)
- [ ] Allow only necessary ports
- [ ] Enable logging
- [ ] Review rules regularly

### UFW Setup

```bash
# Check current status
sudo ufw status

# Enable firewall
sudo ufw enable

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (CRITICAL - do before enable!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow custom application ports
sudo ufw allow 3001/tcp
sudo ufw allow 3000/tcp

# View all rules
sudo ufw status verbose
sudo ufw status numbered

# Disable firewall (for debugging)
sudo ufw disable

# Reset firewall (DANGER!)
sudo ufw reset
```

### Firewall Rules

#### Current Active Rules

| Port | Protocol | Service | Status |
|------|----------|---------|--------|
| 22 | TCP | SSH | Allow |
| 80 | TCP | HTTP | Allow |
| 443 | TCP | HTTPS | Allow |

#### Allow Access from Specific IP

```bash
# Allow SSH only from office IP
sudo ufw allow from 203.0.113.0/24 to any port 22

# Allow database access from app server only
sudo ufw allow from 192.168.1.100 to any port 27017

# View rules
sudo ufw status numbered

# Delete rule by number
sudo ufw delete 1
```

### Firewall Logging

```bash
# Enable logging
sudo ufw logging on

# Set logging level
sudo ufw logging medium  # Options: off, low, medium, high

# View firewall logs
sudo tail -f /var/log/ufw.log

# View recent blocked connections
sudo grep "BLOCK" /var/log/ufw.log | tail -20
```

---

## 3. SSL/TLS Security

### ✅ SSL/TLS Checklist

- [ ] Use Let's Encrypt certificates
- [ ] Enable automatic renewal
- [ ] Use strong cipher suites
- [ ] Redirect HTTP to HTTPS
- [ ] Enable HSTS header

### SSL Certificate Setup

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot certonly --nginx -d example.com -d www.example.com

# List certificates
sudo certbot certificates

# Check certificate expiry
sudo certbot show example.com

# Manual renewal
sudo certbot renew
```

### SSL Configuration in Nginx

```nginx
# Recommended Nginx SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS header (force HTTPS)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Certificate
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### SSL Certificate Monitoring

```bash
# Create monitor script
cat > /usr/local/bin/check-ssl.sh << 'EOF'
#!/bin/bash
for cert in /etc/letsencrypt/live/*/cert.pem; do
    expiry=$(openssl x509 -in $cert -noout -enddate | cut -d= -f2)
    days=$(($(date -d "$expiry" +%s) - $(date +%s)))
    days=$((days / 86400))
    if [ $days -lt 30 ]; then
        echo "WARNING: Certificate expiring in $days days: $cert"
    fi
done
EOF

chmod +x /usr/local/bin/check-ssl.sh

# Add to cron (check daily)
0 9 * * * /usr/local/bin/check-ssl.sh >> /var/log/ssl-check.log 2>&1
```

---

## 4. System Security

### ✅ System Security Checklist

- [ ] Keep system updated
- [ ] Disable unnecessary services
- [ ] Set file permissions correctly
- [ ] Configure sudo access
- [ ] Enable SELinux (if applicable)

### System Updates

```bash
# Update package lists
sudo apt update

# Upgrade all packages
sudo apt upgrade -y

# Automate security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Disable Unnecessary Services

```bash
# List running services
systemctl list-units --type=service --all

# Disable unnecessary services
sudo systemctl disable bluetooth.service
sudo systemctl disable cups.service
sudo systemctl stop bluetooth.service

# Enable only required services
sudo systemctl enable ssh
sudo systemctl enable nginx
```

### File Permissions

```bash
# Secure home directory
chmod 700 ~

# Secure .ssh directory
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_rsa

# Secure system files
sudo chmod 644 /etc/passwd
sudo chmod 000 /etc/shadow

# Application directories
sudo chown -R appuser:appuser /home/apps/app-name
sudo chmod 750 /home/apps/app-name
```

### Sudo Access Control

```bash
# Edit sudoers file (SAFELY)
sudo visudo

# Allow user to run specific commands without password
# Add to sudoers:
username ALL=(ALL) NOPASSWD:/usr/bin/systemctl restart nginx

# Require password for all sudo commands
Defaults use_pty
Defaults log_file="/var/log/sudo.log"
```

---

## 5. Application Security

### ✅ Application Security Checklist

- [ ] Never commit secrets to repository
- [ ] Use environment variables for sensitive data
- [ ] Validate and sanitize all input
- [ ] Use HTTPS for all communications
- [ ] Implement CORS properly
- [ ] Use parameterized database queries
- [ ] Hash passwords with bcrypt/argon2
- [ ] Implement rate limiting
- [ ] Add CSRF protection

### Environment Variables

```bash
# Good: Use .env file
cat .env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/db
JWT_SECRET=your-secret-key

# Bad: Hard-coded in code
const JWT_SECRET = "your-secret-key";  # DON'T DO THIS

# .env file permissions
chmod 600 .env

# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### Input Validation Example

```javascript
// Good: Validate and sanitize input
const express = require('express');
const validator = require('express-validator');

app.post('/api/user', [
  // Validate email format
  validator.body('email').isEmail().normalizeEmail(),
  // Validate password length
  validator.body('password').isLength({ min: 8 }),
], (req, res) => {
  // ...
});

// Bad: Accept any input
app.post('/api/user', (req, res) => {
  const { email, password } = req.body;  // No validation
  // ...
});
```

### Rate Limiting

```javascript
// Use express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Stricter limit for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

app.post('/api/login', loginLimiter, (req, res) => {
  // ...
});
```

### CORS Configuration

```javascript
// Secure CORS setup
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','),  // Whitelist domains
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Bad: Allow all origins
app.use(cors());  // DON'T DO THIS IN PRODUCTION
```

---

## 6. Database Security

### ✅ Database Security Checklist

- [ ] Use strong authentication
- [ ] Restrict network access
- [ ] Enable encryption
- [ ] Regular backups
- [ ] Monitor access logs
- [ ] Use parameterized queries
- [ ] Principle of least privilege
- [ ] Regularly patch database

### MongoDB Security

```bash
# Enable authentication
mongo > use admin
mongo > db.createUser({
  user: "admin",
  pwd: "strong_password",
  roles: ["root"]
})

# Create application user
mongo > db.createUser({
  user: "app_user",
  pwd: "app_password",
  roles: [
    { role: "readWrite", db: "app_database" }
  ]
})

# Connection string with auth
mongodb://app_user:app_password@localhost:27017/app_database

# Enable authentication in config
auth = true
security:
  authorization: enabled
```

### PostgreSQL Security

```bash
# Create restricted user
sudo -u postgres createuser app_user -W

# Create database owned by user
sudo -u postgres createdb app_database -O app_user

# Grant minimal privileges
sudo -u postgres psql
GRANT CONNECT ON DATABASE app_database TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

### Parameterized Queries

```javascript
// Good: Parameterized query (prevents SQL injection)
db.collection('users').findOne({ email: userInput });

// Good: MongoDB aggregation with validation
db.collection('users').aggregate([
  { $match: { email: validatedEmail } }
]);

// Bad: String concatenation (SQL injection vulnerability)
db.collection('users').find(`{ email: "${userInput}" }`);
```

---

## 7. Monitoring & Logging

### ✅ Monitoring Checklist

- [ ] Enable audit logging
- [ ] Monitor system resources
- [ ] Monitor failed login attempts
- [ ] Monitor firewall blocks
- [ ] Setup alerts for anomalies

### System Logging

```bash
# View system logs
sudo tail -f /var/log/syslog
sudo journalctl -f

# View specific service logs
sudo journalctl -u nginx -f
sudo journalctl -u ssh -f

# View authentication logs
sudo tail -f /var/log/auth.log

# View firewall logs
sudo tail -f /var/log/ufw.log

# Archive logs for retention
sudo logrotate -f /etc/logrotate.conf
```

### Monitor Failed SSH Attempts

```bash
# Current failed attempts
sudo grep "Failed password" /var/log/auth.log | wc -l

# Attempts from specific IP
sudo grep "Failed password" /var/log/auth.log | grep "192.168.1.100"

# Create alert script
cat > /usr/local/bin/check-ssh-failures.sh << 'EOF'
#!/bin/bash
FAILURES=$(sudo grep "$(date +%b\ %d)" /var/log/auth.log | grep "Failed password" | wc -l)
if [ $FAILURES -gt 10 ]; then
    echo "Alert: $FAILURES SSH failures detected today"
fi
EOF
```

### Fail2Ban Setup

```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Create local config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit configuration
sudo nano /etc/fail2ban/jail.local

# Sample configuration
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

# Start service
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Check banned IPs
sudo fail2ban-client status sshd

# Unban IP
sudo fail2ban-client set sshd unbanip 192.168.1.100
```

---

## 8. Backup & Disaster Recovery

### ✅ Backup Checklist

- [ ] Automate backup process
- [ ] Test backup restoration
- [ ] Store backups off-site
- [ ] Encrypt sensitive backups
- [ ] Document recovery procedure

### Automated Backups

```bash
# Create backup script
cat > /usr/local/bin/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup databases
mongodump --out=$BACKUP_DIR/mongodb
pg_dump mydb > $BACKUP_DIR/mydb.sql

# Backup application files
tar -czf $BACKUP_DIR/apps.tar.gz /home/apps/

# Encrypt sensitive files
gpg --symmetric $BACKUP_DIR/mydb.sql

# Cleanup old backups (keep 30 days)
find /home/backups -type f -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x /usr/local/bin/backup.sh

# Add to cron (daily at 2 AM)
0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
```

### Test Restoration

```bash
# Monthly restoration test (schedule in calendar)
# 1. Restore to test server
# 2. Verify data integrity
# 3. Test application functionality
# 4. Document results

# Example restore
mongorestore --drop /home/backups/20260625/mongodb
psql testdb < /home/backups/20260625/mydb.sql
```

---

## 9. Security Audit

### Quarterly Security Audit

- [ ] Review SSH access logs
- [ ] Check firewall rules
- [ ] Verify SSL certificates
- [ ] Check failed login attempts
- [ ] Review user accounts and permissions
- [ ] Verify backups are working
- [ ] Update packages
- [ ] Check for security vulnerabilities

### Security Scanning

```bash
# Check for known vulnerabilities in packages
sudo apt install needrestart -y
sudo needrestart -r l

# Scan for security issues
sudo apt install -y apt-listchanges
sudo apt install -y debian-security-support

# Network vulnerability scan
sudo apt install nmap -y
nmap -sV localhost

# Check open ports
sudo ss -tulpn
```

### Generate Security Report

```bash
#!/bin/bash
# security-report.sh

echo "=== Security Report ===" > security-report.txt
echo "Date: $(date)" >> security-report.txt

echo "" >> security-report.txt
echo "=== System Updates ===" >> security-report.txt
sudo apt update && apt list --upgradable >> security-report.txt

echo "" >> security-report.txt
echo "=== SSH Configuration ===" >> security-report.txt
sudo grep "^[^#]" /etc/ssh/sshd_config >> security-report.txt

echo "" >> security-report.txt
echo "=== Firewall Rules ===" >> security-report.txt
sudo ufw status >> security-report.txt

echo "" >> security-report.txt
echo "=== Failed SSH Attempts (Last 7 days) ===" >> security-report.txt
sudo grep "Failed password" /var/log/auth.log | grep "$(date -d '7 days ago' +%b)" | wc -l >> security-report.txt

echo "" >> security-report.txt
echo "=== SSL Certificates ===" >> security-report.txt
sudo certbot certificates >> security-report.txt

echo "Report generated: security-report.txt"
```

---

## 10. Incident Response

### Security Incident Response Plan

#### If Compromised:

1. **Isolate System**
   ```bash
   sudo ufw enable
   sudo systemctl restart ssh
   ```

2. **Check for Backdoors**
   ```bash
   # Check sudoers
   sudo cat /etc/sudoers
   
   # Check SSH authorized_keys
   cat ~/.ssh/authorized_keys
   
   # Check cron jobs
   crontab -l
   sudo crontab -l
   
   # Check running processes
   ps aux
   ```

3. **Review Logs**
   ```bash
   # Recent logins
   sudo lastlog
   sudo who
   
   # Failed login attempts
   sudo grep "Failed" /var/log/auth.log | tail -20
   
   # SSH activity
   sudo grep "sshd" /var/log/auth.log | tail -30
   ```

4. **Change Credentials**
   ```bash
   # Change SSH keys
   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519
   
   # Change user password
   passwd
   
   # Change database passwords
   # (After restoring from clean backup)
   ```

5. **Restore from Backup**
   ```bash
   # If seriously compromised, restore entire system
   # from known good backup
   ```

---

## Security Checklist Template

### Regular Review Schedule

- **Weekly:** Review SSH and firewall logs
- **Monthly:** Perform security audit
- **Quarterly:** Full security assessment
- **Annually:** Penetration testing (if budget allows)

### Monthly Security Checklist

```
Date: ___________
Reviewed By: ___________

SSH Security:
- [ ] Check for unauthorized keys in ~/.ssh/authorized_keys
- [ ] Review SSH logs for failed attempts
- [ ] Verify no password authentication attempts

Firewall:
- [ ] Review firewall logs
- [ ] Verify unnecessary ports are not open
- [ ] Check rate limiting is functioning

SSL/TLS:
- [ ] Verify all certificates are valid
- [ ] Check expiry dates
- [ ] Ensure HTTPS redirect is working

System:
- [ ] Run system updates
- [ ] Check available disk space
- [ ] Review system logs for errors

Application:
- [ ] Check application logs for errors
- [ ] Verify environment variables are secure
- [ ] Check for exposed secrets

Database:
- [ ] Verify backup completed successfully
- [ ] Check database access logs
- [ ] Ensure authentication is enabled

Issues Found:
[List any security issues]

Actions Taken:
[List remediation steps]

Next Review Date: ___________
```

---

## Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Ubuntu Server Security](https://ubuntu.com/server/docs)
- [Linux Security Hardening](https://hostinger.com/tutorials/linux-security)

### Tools
- [Fail2Ban](https://www.fail2ban.org/wiki/index.php/Main_Page) - Intrusion prevention
- [Nmap](https://nmap.org/) - Network scanner
- [OpenSSL](https://www.openssl.org/) - SSL/TLS testing
- [Lynis](https://cisofy.com/lynis/) - Security audit tool

---

## Emergency Contacts

| Contact | Role | Phone | Email |
|---------|------|-------|-------|
| - | Security Lead | - | - |
| - | Backup Admin | - | - |
| - | Network Admin | - | - |

---

**Last Updated:** 2026-06-25  
**Version:** 1.0.0  
**Review Schedule:** Quarterly  
**Last Reviewed:** Not yet  
**Next Review Due:** 2026-09-25
