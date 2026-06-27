# Quick Reference Guide

Fast-access command reference and troubleshooting tips for common VPS operations. Print this and keep nearby.

---

## VPS Quick Access

| Command | Purpose |
|---------|---------|
| `ssh [user]@[IP]` | Connect via SSH |
| `sudo su -` | Switch to root (avoid if possible) |
| `exit` | Logout |
| `uptime` | Check system uptime |
| `hostname` | View server name |

---

## System Information

```bash
# View system specs
lsb_release -a              # OS version
uname -a                    # Kernel info
cat /proc/cpuinfo           # CPU info
free -h                     # Memory
df -h                       # Disk space
```

---

## Common Commands

### View Applications Status

```bash
pm2 list                    # All PM2 apps
pm2 status                  # Show status
docker ps                   # Running containers
docker ps -a                # All containers
systemctl list-units        # All services
```

### View Logs

```bash
pm2 logs [app]              # Application logs
docker logs [container]     # Container logs
tail -f /var/log/syslog     # System logs
tail -f /var/log/nginx/error.log   # Nginx errors
```

### Manage Services

```bash
# Start/Stop/Restart
pm2 restart [app]           # Restart PM2 app
docker-compose restart      # Restart containers
sudo systemctl restart nginx # Restart Nginx
systemctl restart ssh       # Restart SSH

# Auto-start
pm2 save                    # Save PM2 state
pm2 startup                 # Enable auto-start
systemctl enable [service]  # Enable service auto-start
```

---

## Firewall

```bash
sudo ufw status             # View firewall status
sudo ufw allow [port]       # Allow port
sudo ufw deny [port]        # Block port
sudo ufw delete allow [port] # Remove rule
```

---

## Network Troubleshooting

```bash
ping google.com             # Test connectivity
curl http://localhost:3001  # Test local service
curl -I https://example.com # Check HTTPS
netstat -tulpn              # View listening ports
ss -tulpn                   # Alternative to netstat
lsof -i :3001               # Find process on port
sudo fuser -k 3001/tcp      # Kill process on port
```

---

## Database Commands

### MongoDB

```bash
mongo                       # Connect to MongoDB
show dbs                    # List databases
use mydb                    # Switch database
db.collection.find()        # Query collection
db.collection.count()       # Count documents
db.collection.drop()        # Delete collection
db.dropDatabase()           # Delete database
```

### PostgreSQL

```bash
psql -U postgres            # Connect as postgres user
\l                          # List databases
\c dbname                   # Connect to database
\dt                         # List tables
SELECT * FROM table;        # Query table
\q                          # Exit
```

### MySQL

```bash
mysql -u root -p            # Connect to MySQL
SHOW DATABASES;             # List databases
USE dbname;                 # Select database
SHOW TABLES;                # List tables
SELECT * FROM table;        # Query table
EXIT;                       # Exit
```

---

## Git Operations

```bash
git status                  # View changes
git pull origin main        # Get latest code
git log --oneline -5        # View recent commits
git checkout [branch]       # Switch branch
git commit -m "message"     # Commit changes
git push origin [branch]    # Push changes
```

---

## PM2 Essential Commands

```bash
pm2 start app.js            # Start app
pm2 restart appname         # Restart app
pm2 stop appname            # Stop app
pm2 delete appname          # Delete app
pm2 logs appname            # View logs
pm2 monit                   # Real-time monitoring
pm2 save                    # Save state
pm2 startup                 # Enable auto-start on reboot
pm2 start pm2.config.js     # Start from config file
```

---

## Docker Essential Commands

```bash
docker ps                   # List running containers
docker ps -a                # List all containers
docker images               # List images
docker run -d --name name image:tag  # Run container
docker exec -it name bash   # Enter container
docker logs name            # View logs
docker stop name            # Stop container
docker start name           # Start container
docker rm name              # Delete container
docker-compose up -d        # Start with docker-compose
docker-compose down         # Stop with docker-compose
docker-compose logs -f      # View docker-compose logs
```

---

## Nginx

```bash
sudo nginx -t               # Test configuration
sudo systemctl restart nginx # Restart Nginx
sudo systemctl reload nginx  # Reload Nginx (no downtime)
sudo tail -f /var/log/nginx/error.log   # Error logs
sudo tail -f /var/log/nginx/access.log  # Access logs
```

---

## SSL Certificate

```bash
sudo certbot certificates   # List certificates
sudo certbot renew          # Renew certificates
openssl x509 -in /etc/letsencrypt/live/domain/cert.pem -noout -dates  # Check expiry
curl -I https://example.com # Check SSL loads
```

---

## Performance Monitoring

```bash
top                         # Real-time system usage
htop                        # Better top
free -h                     # Memory usage
df -h                       # Disk usage
du -sh /home/apps/*         # Directory sizes
netstat -i                  # Network stats
ps aux | grep node          # Find node processes
```

---

## Important Directories

| Path | Purpose |
|------|---------|
| `/home/apps/` | Application files |
| `/etc/nginx/` | Nginx configuration |
| `/etc/letsencrypt/` | SSL certificates |
| `/var/log/` | System logs |
| `/home/backups/` | Backup files |

---

## Emergency Procedures

### If System is Unresponsive

1. **Check if services are running**
   ```bash
   pm2 status
   docker ps
   systemctl status
   ```

2. **Check disk space (most common issue)**
   ```bash
   df -h
   # If full, delete old logs/backups
   sudo rm -rf /var/log/*.gz
   ```

3. **Check memory**
   ```bash
   free -h
   # If low, restart services
   pm2 restart all
   ```

4. **Check network**
   ```bash
   ping google.com
   sudo ufw status
   ```

### If Application Crashes

1. **Check logs**
   ```bash
   pm2 logs appname
   docker logs container
   ```

2. **Restart application**
   ```bash
   pm2 restart appname
   docker-compose restart appname
   ```

3. **Check port conflicts**
   ```bash
   sudo lsof -i :3001
   ```

4. **Check database connection**
   ```bash
   mongo localhost:27017
   psql -U user -d dbname -c "SELECT 1"
   ```

### If Out of Disk Space

```bash
# 1. Find large files
find / -type f -size +1G 2>/dev/null

# 2. Delete old backups
find /home/backups -mtime +30 -delete

# 3. Clear logs
sudo truncate -s 0 /var/log/*.log
sudo rm -rf /var/log/*.gz

# 4. Clear docker
docker image prune -a
docker volume prune

# 5. Clear cache
sudo apt clean
sudo apt autoclean
```

---

## Password Reset

### SSH Key Issues

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host
```

### Database Password Reset

```bash
# MongoDB - Reset root password
use admin
db.changeUserPassword("admin", "newpassword")

# PostgreSQL - Reset user password
sudo -u postgres psql
\password username

# MySQL - Reset root password (requires restart)
sudo systemctl stop mysql
sudo mysqld_safe --skip-grant-tables &
mysql -u root
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
```

---

## Backup & Recovery Quick Commands

```bash
# Backup database
mongodump --out=/home/backups/mongo-$(date +%Y%m%d)/

# Backup application
tar -czf /home/backups/app-$(date +%Y%m%d).tar.gz /home/apps/myapp/

# List backups
ls -lh /home/backups/

# Test backup restore
tar -tzf backup-file.tar.gz

# Full system backup
/usr/local/bin/backup-all.sh
```

---

## Performance Optimization Quick Tips

```bash
# Enable gzip in Nginx
gzip on;
gzip_types text/plain text/css application/json;

# Enable caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
proxy_cache my_cache;

# Limit connections
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req zone=general burst=20;

# Enable HTTP/2
listen 443 ssl http2;
```

---

## Useful Aliases (Add to ~/.bashrc)

```bash
# Add to ~/.bashrc then run: source ~/.bashrc

alias la='ls -la'
alias cd..='cd ..'
alias ll='ls -l'
alias ps-node='ps aux | grep node'
alias log-nginx='tail -f /var/log/nginx/error.log'
alias log-pm2='pm2 logs'
alias df-app='du -sh /home/apps/*'
alias port-check='sudo lsof -i -P -n'
alias backup='sudo /usr/local/bin/backup-all.sh'
alias status='pm2 status && docker ps'
```

---

## One-Liner Helpful Commands

```bash
# Kill all node processes
pkill -f node

# Find and kill process on specific port
kill $(lsof -t -i :3001)

# Upload to S3
aws s3 cp file.txt s3://bucket/

# Download from S3
aws s3 cp s3://bucket/file.txt .

# SSH without password prompt
ssh -o StrictHostKeyChecking=no user@host

# SCP file to server
scp -r /local/path user@host:/remote/path

# Monitor file in real-time
watch -n 1 'tail -20 /var/log/syslog'

# Compress and backup in one command
tar czf - /home/apps/ | ssh user@backup-server 'cat > /backups/apps.tar.gz'

# Find files modified in last 24 hours
find /home/apps -type f -mtime -1

# Check SSL expiry (all certs)
for cert in /etc/letsencrypt/live/*/cert.pem; do echo "=== $cert ===" && openssl x509 -in $cert -noout -dates; done
```

---

## Useful Resources

- [Ubuntu Server Docs](https://ubuntu.com/server/docs)
- [Nginx Docs](https://nginx.org/en/docs/)
- [PM2 Docs](https://pm2.keymetrics.io/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Let's Encrypt Docs](https://letsencrypt.org/docs/)
- [Docker Docs](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## Emergency Contact

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Primary Admin | - | - | - |
| Backup Admin | - | - | - |
| Security Lead | - | - | - |

---

## Print This!

You can print this page (A4 or Letter) and keep it near your desk or monitor. Update with your specific IPs, domains, and contact information.

---

**Last Updated:** 2026-06-25  
**Version:** 1.0.0  
**For Full Documentation:** See [README.md](README.md)
