# Disaster Recovery

Complete backup, restoration, and disaster recovery procedures for VPS infrastructure and all hosted applications. This ensures data integrity and minimal downtime in case of failure.

---

## Recovery Objectives

| Metric | Target | Current Status |
|--------|--------|-----------------|
| **RTO** (Recovery Time Objective) | 2 hours | [To be set] |
| **RPO** (Recovery Point Objective) | 1 day | [To be set] |
| **Data Retention** | 30 days minimum | [To be configured] |
| **Backup Frequency** | Daily | [To be configured] |
| **Test Frequency** | Monthly | [To be scheduled] |

---

## Backup Strategy

### What Gets Backed Up

| Component | Frequency | Retention | Location |
|-----------|-----------|-----------|----------|
| Application Code | Per deployment | Indefinite | GitHub + local backup |
| Databases | Daily | 30 days | /home/backups/databases/ |
| Configuration Files | Per change | 7 days | /home/backups/configs/ |
| SSL Certificates | Per renewal | 1 year | /etc/letsencrypt/ |
| System Config | Weekly | 4 weeks | /home/backups/system/ |

### What Does NOT Need Backup

- `node_modules/` (can be reinstalled)
- Build artifacts (can be regenerated)
- Temporary files
- System cache
- Log files (archived separately)

---

## Automated Backup Setup

### Create Backup User

```bash
# Create dedicated backup user
sudo useradd -m -s /bin/bash backup
sudo usermod -aG docker backup  # If using Docker
```

### Master Backup Script

**File:** `/usr/local/bin/backup-all.sh`

```bash
#!/bin/bash

# Comprehensive backup script for all applications and system

set -e  # Exit on error

BACKUP_ROOT="/home/backups"
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$BACKUP_DATE"
LOG_FILE="/var/log/backup-$BACKUP_DATE.log"

# Color output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting backup at $(date)" | tee $LOG_FILE

# Create backup directory
mkdir -p $BACKUP_DIR
cd $BACKUP_DIR

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Function to handle errors
error_exit() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a $LOG_FILE
    exit 1
}

# ==================== MONGODB BACKUP ====================
log "Backing up MongoDB databases..."
if command -v mongodump &> /dev/null; then
    mongodump --out=$BACKUP_DIR/mongodb/ 2>&1 | tee -a $LOG_FILE || error_exit "MongoDB backup failed"
    log "MongoDB backup completed"
else
    log "MongoDB not installed, skipping..."
fi

# ==================== PostgreSQL BACKUP ====================
log "Backing up PostgreSQL databases..."
if command -v pg_dump &> /dev/null; then
    sudo -u postgres pg_dumpall > $BACKUP_DIR/postgres-all.sql 2>&1 || error_exit "PostgreSQL backup failed"
    log "PostgreSQL backup completed"
else
    log "PostgreSQL not installed, skipping..."
fi

# ==================== MySQL BACKUP ====================
log "Backing up MySQL databases..."
if command -v mysqldump &> /dev/null; then
    mysqldump -u root -p$MYSQL_ROOT_PASSWORD --all-databases > $BACKUP_DIR/mysql-all.sql 2>&1 || error_exit "MySQL backup failed"
    log "MySQL backup completed"
else
    log "MySQL not installed, skipping..."
fi

# ==================== APPLICATION FILES ====================
log "Backing up application files..."
tar -czf $BACKUP_DIR/apps.tar.gz /home/apps/ 2>&1 | tee -a $LOG_FILE || error_exit "Application backup failed"
log "Application files backup completed"

# ==================== CONFIGURATION FILES ====================
log "Backing up configuration files..."
mkdir -p $BACKUP_DIR/configs
sudo cp -r /etc/nginx/ $BACKUP_DIR/configs/
sudo cp -r /etc/letsencrypt/ $BACKUP_DIR/configs/
sudo cp -r /etc/ssh/ $BACKUP_DIR/configs/
log "Configuration files backup completed"

# ==================== SSL CERTIFICATES ====================
log "Backing up SSL certificates..."
sudo cp -r /etc/letsencrypt/live/ $BACKUP_DIR/ssl-certs/
log "SSL certificates backup completed"

# ==================== COMPRESS BACKUP ====================
log "Compressing backup..."
cd $BACKUP_ROOT
tar -czf backup-$BACKUP_DATE.tar.gz $BACKUP_DATE/ 2>&1 | tee -a $LOG_FILE

# ==================== CALCULATE SIZE ====================
BACKUP_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
log "Backup size: $BACKUP_SIZE"

# ==================== CLEANUP OLD BACKUPS ====================
log "Cleaning up backups older than 30 days..."
find $BACKUP_ROOT -maxdepth 1 -type d -mtime +30 -exec rm -rf {} \; 2>&1 | tee -a $LOG_FILE

# ==================== ENCRYPT SENSITIVE DATA ====================
log "Encrypting sensitive backup data..."
gpg --symmetric --cipher-algo AES256 $BACKUP_DIR/postgres-all.sql 2>/dev/null || true
gpg --symmetric --cipher-algo AES256 $BACKUP_DIR/mysql-all.sql 2>/dev/null || true

# ==================== VERIFY BACKUP ====================
log "Verifying backup integrity..."
if [ -f backup-$BACKUP_DATE.tar.gz ]; then
    tar -tzf backup-$BACKUP_DATE.tar.gz > /dev/null 2>&1 && log "Backup verified successfully" || error_exit "Backup verification failed"
else
    error_exit "Backup archive not found"
fi

# ==================== BACKUP TO REMOTE STORAGE ====================
log "Uploading backup to remote storage..."
# Example: Upload to S3, rsync to remote server, etc.
# rsync -avz backup-$BACKUP_DATE.tar.gz backup@remote-server:/backups/
# aws s3 cp backup-$BACKUP_DATE.tar.gz s3://my-backup-bucket/

log "Backup completed successfully at $(date)"
echo -e "${GREEN}Backup process finished${NC}" | tee -a $LOG_FILE

# Send notification (optional)
# mail -s "VPS Backup Report: $BACKUP_DATE" admin@example.com < $LOG_FILE
```

### Set Permissions and Schedule

```bash
# Make script executable
sudo chmod +x /usr/local/bin/backup-all.sh

# Create cron job (run daily at 2 AM)
sudo crontab -e

# Add line:
0 2 * * * /usr/local/bin/backup-all.sh

# Verify cron job
sudo crontab -l

# View backup logs
sudo tail -f /var/log/backup-*.log
```

---

## Individual Service Backups

### MongoDB Backup & Restore

#### Backup

```bash
# Simple backup
mongodump --out=/home/backups/mongodb-$(date +%Y%m%d)/

# Backup specific database
mongodump --db=myapp_db --out=/home/backups/myapp-$(date +%Y%m%d)/

# Backup with compression
mongodump --archive=/home/backups/mongodb-$(date +%Y%m%d).archive --gzip

# Backup with authentication
mongodump --uri="mongodb://user:pass@localhost:27017" --out=/home/backups/
```

#### Restore

```bash
# Restore all databases
mongorestore /home/backups/mongodb-20260625/

# Restore specific database
mongorestore --db=myapp_db /home/backups/mongodb-20260625/myapp_db/

# Restore from archive
mongorestore --archive=/home/backups/mongodb-20260625.archive --gzip

# Restore with drop (replace existing data)
mongorestore --drop /home/backups/mongodb-20260625/

# Verify restoration
mongo myapp_db
db.collection.count()
```

### PostgreSQL Backup & Restore

#### Backup

```bash
# Backup single database
pg_dump -U postgres -d myapp_db > /home/backups/myapp-$(date +%Y%m%d).sql

# Backup all databases
sudo -u postgres pg_dumpall > /home/backups/postgres-all-$(date +%Y%m%d).sql

# Backup with compression
pg_dump -U postgres -d myapp_db | gzip > /home/backups/myapp-$(date +%Y%m%d).sql.gz

# Backup in custom format (for faster restore)
pg_dump -U postgres -d myapp_db -Fc -f /home/backups/myapp-$(date +%Y%m%d).dump
```

#### Restore

```bash
# Restore from SQL file
psql -U postgres -d myapp_db < /home/backups/myapp-20260625.sql

# Restore from compressed file
gunzip -c /home/backups/myapp-20260625.sql.gz | psql -U postgres -d myapp_db

# Restore from custom format dump
pg_restore -U postgres -d myapp_db /home/backups/myapp-20260625.dump

# Restore and create database if not exists
createdb -U postgres myapp_db
psql -U postgres -d myapp_db < /home/backups/myapp-20260625.sql
```

### MySQL Backup & Restore

#### Backup

```bash
# Backup single database
mysqldump -u root -p myapp_db > /home/backups/myapp-$(date +%Y%m%d).sql

# Backup all databases
mysqldump -u root -p --all-databases > /home/backups/mysql-all-$(date +%Y%m%d).sql

# Backup with compression
mysqldump -u root -p myapp_db | gzip > /home/backups/myapp-$(date +%Y%m%d).sql.gz
```

#### Restore

```bash
# Restore single database
mysql -u root -p myapp_db < /home/backups/myapp-20260625.sql

# Restore all databases
mysql -u root -p < /home/backups/mysql-all-20260625.sql

# Restore from compressed file
gunzip -c /home/backups/myapp-20260625.sql.gz | mysql -u root -p myapp_db
```

---

## Application & Code Backup

### Application Files Backup

```bash
# Backup all applications
tar -czf /home/backups/apps-$(date +%Y%m%d).tar.gz /home/apps/

# Backup specific application
tar -czf /home/backups/myapp-$(date +%Y%m%d).tar.gz /home/apps/myapp/

# Backup excluding node_modules
tar --exclude='node_modules' --exclude='.git' \
    -czf /home/backups/myapp-$(date +%Y%m%d).tar.gz /home/apps/myapp/

# Verify archive
tar -tzf /home/backups/apps-20260625.tar.gz | head
```

### Application Restoration

```bash
# Restore all applications (WARNING: overwrites existing)
tar -xzf /home/backups/apps-20260625.tar.gz -C /

# Restore to temporary location first
mkdir /tmp/restore
tar -xzf /home/backups/apps-20260625.tar.gz -C /tmp/restore

# Restore specific application
tar -xzf /home/backups/apps-20260625.tar.gz -C / home/apps/myapp/
```

---

## Configuration Backup

### Nginx Configuration Backup

```bash
# Backup current configuration
sudo tar -czf /home/backups/nginx-config-$(date +%Y%m%d).tar.gz /etc/nginx/

# List contents
tar -tzf /home/backups/nginx-config-20260625.tar.gz

# Restore (be careful!)
sudo tar -xzf /home/backups/nginx-config-20260625.tar.gz -C /
sudo systemctl restart nginx
```

### SSH Configuration Backup

```bash
# Backup SSH configuration
sudo tar -czf /home/backups/ssh-config-$(date +%Y%m%d).tar.gz /etc/ssh/

# Backup authorized_keys
cp ~/.ssh/authorized_keys /home/backups/authorized_keys-$(date +%Y%m%d)
```

### SSL Certificates Backup

```bash
# Backup Let's Encrypt certificates
sudo tar -czf /home/backups/letsencrypt-$(date +%Y%m%d).tar.gz /etc/letsencrypt/

# List certificates
sudo certbot certificates

# Copy specific certificate
sudo cp -r /etc/letsencrypt/live/example.com /home/backups/example.com-cert-$(date +%Y%m%d)
```

---

## Remote Backup Storage

### Backup to Remote Server (rsync)

```bash
# Setup SSH key for backup user
sudo -u backup ssh-keygen -t ed25519 -N "" -f /home/backup/.ssh/id_ed25519

# Add to remote server's authorized_keys
# Then backup via rsync

# Add to cron (after main backup)
0 3 * * * rsync -avz -e ssh /home/backups/ backup@remote-server:/backups/vps/ --delete
```

### Backup to AWS S3

```bash
# Install AWS CLI
sudo apt install awscli -y

# Configure AWS credentials
aws configure

# Backup to S3
aws s3 cp /home/backups/backup-20260625.tar.gz s3://my-bucket/backups/

# List backups in S3
aws s3 ls s3://my-bucket/backups/

# Download from S3
aws s3 cp s3://my-bucket/backups/backup-20260625.tar.gz /tmp/

# Add to cron (after main backup)
0 3 * * * aws s3 cp /home/backups/ s3://my-bucket/backups/ --recursive
```

---

## Backup Verification

### Monthly Restoration Test

**Schedule:** First Monday of each month

#### Test Procedure

```bash
#!/bin/bash
# test-restore.sh

echo "Starting monthly restoration test..."
echo "Date: $(date)" > /tmp/restore-test.log

# 1. Verify latest backup exists
LATEST_BACKUP=$(ls -t /home/backups/backup-*.tar.gz 2>/dev/null | head -1)
if [ -z "$LATEST_BACKUP" ]; then
    echo "ERROR: No backup found" | tee -a /tmp/restore-test.log
    exit 1
fi
echo "Testing with: $LATEST_BACKUP" | tee -a /tmp/restore-test.log

# 2. Extract to test location
TEST_DIR="/tmp/restore-test-$(date +%Y%m%d)"
mkdir -p $TEST_DIR
tar -xzf $LATEST_BACKUP -C $TEST_DIR || exit 1
echo "Extraction successful" | tee -a /tmp/restore-test.log

# 3. Verify database backup
if [ -d "$TEST_DIR/mongodb" ]; then
    echo "MongoDB backup verified" | tee -a /tmp/restore-test.log
fi

# 4. Verify file integrity
if [ -f "$TEST_DIR/apps.tar.gz" ]; then
    tar -tzf $TEST_DIR/apps.tar.gz > /dev/null && \
    echo "Application backup verified" | tee -a /tmp/restore-test.log
fi

# 5. Report results
echo "Restoration test completed" | tee -a /tmp/restore-test.log
mail -s "Monthly Backup Test Report $(date +%Y-%m-%d)" admin@example.com < /tmp/restore-test.log

# 6. Cleanup
rm -rf $TEST_DIR
```

### Backup Health Check

```bash
#!/bin/bash
# backup-health-check.sh

echo "=== Backup Health Report ===" > /tmp/backup-health.txt
echo "Date: $(date)" >> /tmp/backup-health.txt

echo "" >> /tmp/backup-health.txt
echo "Latest backups:" >> /tmp/backup-health.txt
ls -lh /home/backups/ | tail -10 >> /tmp/backup-health.txt

echo "" >> /tmp/backup-health.txt
echo "Total backup size:" >> /tmp/backup-health.txt
du -sh /home/backups/ >> /tmp/backup-health.txt

echo "" >> /tmp/backup-health.txt
echo "Available disk space:" >> /tmp/backup-health.txt
df -h / >> /tmp/backup-health.txt

echo "" >> /tmp/backup-health.txt
echo "Backup jobs in cron:" >> /tmp/backup-health.txt
crontab -l | grep backup >> /tmp/backup-health.txt || echo "No backup jobs found"

cat /tmp/backup-health.txt
```

---

## Disaster Recovery Scenarios

### Scenario 1: Single Application Fails

**Impact:** One application down  
**RTO:** 15 minutes

#### Recovery Steps

```bash
# 1. Check application status
pm2 status appname
docker ps | grep appname

# 2. Check logs for errors
pm2 logs appname
docker logs appname

# 3. Restart application
pm2 restart appname
docker-compose restart appname

# 4. If restart fails, restore from backup
# 4a. Backup current database
mongodump --out=/home/backups/mongodb-pre-restore/

# 4b. Restore from backup
mongorestore --drop /home/backups/mongodb-20260625/

# 5. Restart and verify
pm2 restart appname
curl http://localhost:3001/api/health
```

### Scenario 2: Database Corruption

**Impact:** Cannot access application data  
**RTO:** 30 minutes

#### Recovery Steps

```bash
# 1. Verify database is not responding
mongo --eval "db.adminCommand('ping')"

# 2. Stop application to prevent further damage
pm2 stop backend
docker stop myapp-mongo

# 3. Create emergency backup of corrupted data
mongodump --out=/home/backups/mongodb-corrupted-$(date +%Y%m%d)/

# 4. Restore from clean backup
mongorestore --drop /home/backups/mongodb-20260625/

# 5. Verify data integrity
mongo mydb
db.collection.count()
db.collection.findOne()

# 6. Restart application
pm2 restart backend
docker start myapp-mongo

# 7. Run health checks
curl http://localhost:3001/api/health

# 8. Notify users if data loss occurred
```

### Scenario 3: VPS Disk Full

**Impact:** Application crashes, cannot log in  
**RTO:** 1 hour

#### Recovery Steps

```bash
# 1. Free up disk space
sudo rm -rf /var/log/*.gz  # Remove compressed old logs
sudo apt clean
sudo apt autoclean

# 2. Clear old backups
find /home/backups -mtime +7 -delete

# 3. Clear docker images
docker image prune -a

# 4. Check disk space again
df -h

# 5. If still full, restore from backup to new VPS
# See "Scenario 5: Server Migration"
```

### Scenario 4: SSL Certificate Expired

**Impact:** HTTPS connections fail  
**RTO:** 5 minutes

#### Recovery Steps

```bash
# 1. Check certificate status
sudo certbot status

# 2. Immediately renew certificate
sudo certbot renew --force-renewal

# 3. Verify renewal
sudo openssl x509 -in /etc/letsencrypt/live/example.com/cert.pem -noout -dates

# 4. Reload Nginx
sudo systemctl reload nginx

# 5. Verify HTTPS
curl -I https://example.com
```

### Scenario 5: Server Migration

**Impact:** Complete server relocation  
**RTO:** 4 hours  
**RPO:** 1 day

#### Recovery Steps

```bash
# On NEW VPS:

# 1. Install OS and basic packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm nginx git docker.io postgresql

# 2. Restore configuration files
sudo tar -xzf /path/to/nginx-config-20260625.tar.gz -C /

# 3. Restore applications
tar -xzf /path/to/apps-20260625.tar.gz -C /

# 4. Restore databases
mongorestore /path/to/mongodb-20260625/
sudo -u postgres psql < /path/to/postgres-all-20260625.sql

# 5. Reinstall dependencies
cd /home/apps/myapp/
npm install

# 6. Configure environment
cp .env.example .env
nano .env  # Update with new IPs/domains if needed

# 7. Start services
pm2 start pm2.config.js
sudo systemctl start nginx

# 8. Update DNS to point to new server
# In domain registrar, change A record to new VPS IP

# 9. Verify connectivity
curl -I http://example.com
curl -I https://example.com

# 10. Monitor for issues
pm2 logs
tail -f /var/log/nginx/error.log
```

### Scenario 6: Ransomware Attack

**Impact:** Data encrypted, system unusable  
**RTO:** 2 hours

#### Recovery Steps

```bash
# 1. IMMEDIATELY ISOLATE the server
# Disconnect from network / disable network interface
sudo ifconfig eth0 down

# 2. Boot into single-user mode (if possible)
# Reboot and select single-user mode in boot menu

# 3. From external machine, restore entire VPS from backup
# Option A: From backup server
ssh backup-server
rsync -avz /backups/vps-clean-20260625/ root@192.168.1.100:/

# Option B: Restore from cloud backup
aws s3 cp s3://backup-bucket/full-vps-20260625.tar.gz /tmp/
tar -xzf /tmp/full-vps-20260625.tar.gz -C /

# 4. Verify restoration
ssh root@vps "pm2 status"
ssh root@vps "curl http://localhost:3001/api/health"

# 5. Reconnect to network and monitor
ssh root@vps
# Monitor all logs and application health

# 6. Investigate breach
# Change all passwords
# Review recent access logs
# Patch security vulnerabilities
```

---

## Backup Checklist

### Weekly Backup Verification

```
Date: __________
Verified By: __________

- [ ] Latest backup completed successfully
- [ ] Backup size is reasonable (not 0 bytes)
- [ ] Backup can be extracted without errors
- [ ] All expected files are present
- [ ] Database backups are valid
- [ ] Configuration files are backed up
- [ ] No errors in backup logs
- [ ] Remote backup uploaded successfully
- [ ] Disk space on backup partition is adequate

Issues Found: ___________

Actions Taken: ___________
```

### Monthly Restoration Test

```
Date: __________
Tested By: __________

- [ ] Retrieved latest backup
- [ ] Extracted to temporary location
- [ ] Verified all files intact
- [ ] Tested database restore
- [ ] Verified data integrity
- [ ] Confirmed restore time
- [ ] Cleaned up temporary files
- [ ] Documented restore procedure

Restore Time: ___________
Issues Found: ___________
Improvements Needed: ___________
```

---

## Backup Monitoring Dashboard

### Key Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Last Backup | Within 24h | [Auto-check] | [ ] |
| Backup Size | > 0 bytes | [Auto-check] | [ ] |
| Backup Age | < 30 days | [Auto-check] | [ ] |
| Test Status | Monthly | [To schedule] | [ ] |
| Recovery Time | < 2 hours | [To document] | [ ] |

### Create Backup Monitoring Script

```bash
#!/bin/bash
# backup-monitor.sh

echo "=== Backup Monitoring Report ===" > /tmp/backup-monitor.txt
echo "Date: $(date)" >> /tmp/backup-monitor.txt

# Check latest backup
LATEST=$(ls -t /home/backups/backup-*.tar.gz 2>/dev/null | head -1)
if [ -z "$LATEST" ]; then
    echo "CRITICAL: No backup found!" >> /tmp/backup-monitor.txt
    mail -s "CRITICAL: Backup System Failure" admin@example.com < /tmp/backup-monitor.txt
    exit 1
fi

# Check backup age
BACKUP_AGE=$(( ($(date +%s) - $(stat -c %Y "$LATEST")) / 86400 ))
echo "Latest backup: $LATEST" >> /tmp/backup-monitor.txt
echo "Backup age: $BACKUP_AGE days" >> /tmp/backup-monitor.txt

if [ $BACKUP_AGE -gt 1 ]; then
    echo "WARNING: Backup older than 1 day!" >> /tmp/backup-monitor.txt
fi

# Check backup size
BACKUP_SIZE=$(stat -c %s "$LATEST")
if [ $BACKUP_SIZE -lt 1000000 ]; then
    echo "WARNING: Backup suspiciously small!" >> /tmp/backup-monitor.txt
fi

echo "Backup size: $(numfmt --to=iec-i --suffix=B $BACKUP_SIZE)" >> /tmp/backup-monitor.txt

# Check disk space
DISK_FREE=$(df /home/backups | tail -1 | awk '{print $4}')
echo "Disk free: $(numfmt --to=iec-i --suffix=B $DISK_FREE)" >> /tmp/backup-monitor.txt

if [ $DISK_FREE -lt 10000000 ]; then
    echo "WARNING: Low disk space on backup partition!" >> /tmp/backup-monitor.txt
fi

cat /tmp/backup-monitor.txt
```

---

## Disaster Recovery Plan Summary

| Scenario | RTO | RPO | Priority | Owner |
|----------|-----|-----|----------|-------|
| Single app failure | 15m | 0 | P1 | App Team |
| Database corruption | 30m | 1h | P1 | DBA |
| Disk full | 1h | 30m | P2 | SysAdmin |
| SSL expired | 5m | 0 | P2 | SysAdmin |
| Server migration | 4h | 1d | P3 | DevOps |
| Ransomware | 2h | 1d | P1 | Security |

---

**Last Updated:** 2026-06-25  
**Version:** 1.0.0  
**Last Backup:** Not yet  
**Last Test:** Not yet  
**Next Test Due:** 2026-07-25  
**Maintained By:** DevOps Team
