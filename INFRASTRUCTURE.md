# Infrastructure Overview

Centralized documentation of all VPS infrastructure specifications, packages, and system configuration.

---

## VPS Specifications

| Property | Value | Notes |
|----------|-------|-------|
| **Provider** | To be documented | (Hostinger, DigitalOcean, AWS EC2, etc.) |
| **Plan/Instance Type** | To be documented | |
| **OS** | To be documented | (Ubuntu 20.04 LTS, Ubuntu 22.04 LTS, etc.) |
| **CPU Cores** | To be documented | |
| **RAM (GB)** | To be documented | |
| **Disk Storage (GB)** | To be documented | |
| **Public IP Address** | To be documented | Store securely |
| **SSH User** | To be documented | Primary user for SSH access |
| **SSH Port** | 22 | Change from default for security |
| **Region/Datacenter** | To be documented | |
| **Backup Provider** | To be documented | (Native backups, cPanel, etc.) |

---

## Operating System Configuration

### Kernel & System
```
Kernel Version: [To be documented]
Hostname: [To be documented]
Timezone: [To be documented]
Locale: [To be documented]
```

### System User
```bash
# View primary user
whoami

# View sudo permissions
sudo visudo -c

# View user groups
id [username]
```

---

## Network Configuration

### Network Interface
```
Primary Interface: [To be documented]
IPv4 Address: [To be documented]
IPv4 Gateway: [To be documented]
IPv4 Netmask: [To be documented]
DNS Primary: [To be documented]
DNS Secondary: [To be documented]
```

### View Network Configuration
```bash
# View network interfaces
ip addr show

# View routing table
ip route show

# View DNS configuration
cat /etc/resolv.conf

# View network statistics
netstat -i
```

---

## Firewall Configuration

### UFW Status
```
Status: [Active/Inactive]
Default Incoming: [Deny]
Default Outgoing: [Allow]
Default Routed: [Disabled]
```

### Firewall Rules

| Rule # | Port | Protocol | Action | Source | Description |
|--------|------|----------|--------|--------|-------------|
| 1 | 22 | TCP | Allow | 0.0.0.0/0 | SSH Access |
| 2 | 80 | TCP | Allow | 0.0.0.0/0 | HTTP |
| 3 | 443 | TCP | Allow | 0.0.0.0/0 | HTTPS |
| (Add more as needed) | | | | | |

### UFW Commands
```bash
# Check status
sudo ufw status verbose

# View numbered rules
sudo ufw status numbered

# Reset firewall (DANGER)
sudo ufw reset

# Enable/disable
sudo ufw enable
sudo ufw disable

# Add rule
sudo ufw allow [port]/tcp
sudo ufw allow from [IP] to any port [port]

# Remove rule
sudo ufw delete allow [port]/tcp
```

---

## Installed Packages

### Essential System Packages

| Package | Version | Purpose | Install Date |
|---------|---------|---------|--------------|
| curl | To document | HTTP client | |
| wget | To document | File downloader | |
| git | To document | Version control | |
| build-essential | To document | C/C++ compiler and tools | |
| python3 | To document | Python runtime | |
| htop | To document | System monitoring | |
| net-tools | To document | Network utilities | |

### Runtime Environments

| Software | Version | Purpose | Install Date |
|----------|---------|---------|--------------|
| Node.js | To document | JavaScript runtime | |
| npm | To document | Node package manager | |
| Docker | To document | Container runtime | |
| Docker Compose | To document | Container orchestration | |

### Web Server & Proxy

| Software | Version | Purpose | Install Date |
|----------|---------|---------|--------------|
| Nginx | To document | Reverse proxy & web server | |
| OpenSSL | To document | SSL/TLS encryption | |
| Certbot | To document | Let's Encrypt automation | |

### Application Managers

| Software | Version | Purpose | Install Date |
|----------|---------|---------|--------------|
| PM2 | To document | Node.js process manager | |

### Database & Cache

| Software | Version | Purpose | Install Date |
|----------|---------|---------|--------------|
| MongoDB | To document | NoSQL database (if used) | |
| PostgreSQL | To document | SQL database (if used) | |
| Redis | To document | In-memory cache (if used) | |
| MySQL | To document | MySQL database (if used) | |

### Monitoring & Security

| Software | Version | Purpose | Install Date |
|----------|---------|---------|--------------|
| Fail2Ban | To document | Brute-force protection | |
| Supervisor | To document | Process supervisor (if used) | |

### Package Installation Log

```bash
# Update package manager
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Install specific package
sudo apt install -y [package-name]

# List installed packages
apt list --installed | grep [package-name]

# Remove package
sudo apt remove [package-name]

# View package details
apt show [package-name]

# Search for package
apt search [package-name]
```

---

## Directory Structure

### Production Application Directory

```
/home/
├── apps/
│   ├── app-1/
│   │   ├── client/
│   │   ├── server/
│   │   ├── docker-compose.yml
│   │   ├── .env
│   │   └── README.md
│   ├── app-2/
│   │   └── [similar structure]
│   └── [more applications]
├── backups/
│   ├── databases/
│   ├── configs/
│   └── [backup archives]
└── [system users]

/etc/
├── nginx/
│   ├── nginx.conf
│   ├── sites-available/
│   │   ├── app-1.conf
│   │   └── app-2.conf
│   └── sites-enabled/
│       ├── app-1 -> ../sites-available/app-1.conf
│       └── app-2 -> ../sites-available/app-2.conf
└── letsencrypt/
    └── live/
        ├── domain-1.com/
        └── domain-2.com/

/var/log/
├── nginx/
│   ├── error.log
│   └── access.log
├── syslog
└── fail2ban.log
```

---

## System Resources

### CPU
```bash
# View CPU info
cat /proc/cpuinfo

# View CPU usage in real-time
top
htop

# View CPU load average
uptime
```

### Memory
```bash
# View memory usage
free -h
free -m

# View detailed memory info
cat /proc/meminfo

# View swap
swapon -s
```

### Disk
```bash
# View disk usage
df -h

# View detailed disk usage
du -sh /home/apps/*

# Check inode usage
df -i

# Find large files
find / -type f -size +1G 2>/dev/null
```

### System Performance
```bash
# System load and uptime
uptime

# View processes
ps aux
ps aux | grep node

# View services status
systemctl status

# View network connections
netstat -tulpn
ss -tulpn
```

---

## SSH Configuration

### SSH Details
| Setting | Value |
|---------|-------|
| SSH Port | To be documented |
| Root Login | Disabled (Recommended) |
| Password Authentication | Disabled (Recommended) |
| Key-based Authentication | Enabled (Recommended) |
| X11 Forwarding | Disabled (Recommended) |

### SSH Server Configuration
```bash
# SSH config location
/etc/ssh/sshd_config

# Restart SSH service
sudo systemctl restart ssh

# View SSH logs
sudo tail -f /var/log/auth.log
```

### Add SSH Key
```bash
# Create .ssh directory if not exists
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add public key
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Test SSH connection
ssh -i /path/to/private/key [user]@[host]
```

---

## Service Management

### Core Services

| Service | Status | Port | Command |
|---------|--------|------|---------|
| SSH | [Active/Inactive] | 22 | `systemctl status ssh` |
| Nginx | [Active/Inactive] | 80,443 | `systemctl status nginx` |
| Docker | [Active/Inactive] | - | `systemctl status docker` |

### View Services
```bash
# List all services
systemctl list-units --type=service

# Check service status
systemctl status [service-name]

# Start service
sudo systemctl start [service-name]

# Stop service
sudo systemctl stop [service-name]

# Restart service
sudo systemctl restart [service-name]

# Enable on boot
sudo systemctl enable [service-name]

# Disable on boot
sudo systemctl disable [service-name]

# View service logs
sudo journalctl -u [service-name] -f
```

---

## Scheduled Tasks (Cron)

### System Cron Jobs

| Task | Schedule | Command | Purpose |
|------|----------|---------|---------|
| System Updates | Weekly | `apt update && apt upgrade` | Keep system patched |
| Backup Database | Daily | [Backup command] | Database backup |
| SSL Renewal | Monthly | `certbot renew` | Auto-renew certificates |
| (Add more as needed) | | | |

### View Cron Jobs
```bash
# View current user cron
crontab -l

# View system cron
sudo crontab -l

# Edit current user cron
crontab -e

# Edit system cron
sudo crontab -e

# View cron logs
sudo tail -f /var/log/syslog | grep CRON
```

---

## System Monitoring

### Uptime
```bash
# Check uptime
uptime

# View system boot time
sudo last reboot

# View last logins
last
```

### Check System Health
```bash
# Check disk space
df -h

# Check inodes
df -i

# Check memory
free -h

# Check swap
swapon -s

# Check temperature (if supported)
sensors

# Check system logs for errors
sudo tail -50 /var/log/syslog | grep -i error
```

---

## Backup & Recovery

### Current Backup Strategy
```
Backup Location: [To be documented]
Backup Schedule: [To be documented]
Retention Period: [To be documented]
Last Backup Date: [To be documented]
Last Verified: [To be documented]
```

See [DISASTER-RECOVERY.md](DISASTER-RECOVERY.md) for complete backup procedures.

---

## Performance Optimization

### Current Optimizations Implemented

- [ ] TCP/IP tuning
- [ ] Nginx caching
- [ ] Gzip compression
- [ ] Redis caching (if applicable)
- [ ] Database indexing (if applicable)
- [ ] CDN integration (if applicable)

### Monitoring Tools

| Tool | Purpose | Access |
|------|---------|--------|
| htop | System resources | Command line |
| PM2 Web UI | Application monitoring | http://localhost:9615 (if enabled) |
| Docker stats | Container monitoring | `docker stats` |

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed infrastructure change history.

---

**Last Updated:** 2026-06-25  
**Version:** 1.0.0  
**Status:** [To be documented]  
**Next Review:** [To be scheduled]
