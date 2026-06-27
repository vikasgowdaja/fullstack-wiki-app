# Application Template: [Project Name]

**Template:** Copy this file and fill in all sections for each deployed application.  
**File Name:** `APP-[ProjectName].md` (e.g., `APP-NextJS-Blog.md`)  
**Add Link:** Update [README.md](README.md) with link to this application

---

## 1. Project Overview

| Property | Value |
|----------|-------|
| **Project Name** | [To be filled] |
| **Description** | [Brief description of what this application does] |
| **Repository URL** | [GitHub/GitLab URL] |
| **Repository Branch** | main / master / production |
| **Owner/Team** | [Team or person responsible] |
| **Contact Email** | [owner@example.com] |
| **Technology Stack** | [e.g., Node.js, React, MongoDB] |
| **Environment** | Development / Staging / Production |
| **Domain** | [primary-domain.com] |
| **Subdomain** | [api.primary-domain.com] (if applicable) |
| **Live URL** | [https://primary-domain.com] |
| **Version** | [e.g., 1.0.0] |
| **Deployed Date** | [2026-06-25] |
| **Last Updated** | [2026-06-25] |
| **Status** | Active / Staging / Development / Archived |

---

## 2. Architecture Diagram

```mermaid
graph TB
    Internet["🌐 Internet"]
    DNS["🔍 DNS"]
    Nginx["Nginx\nReverse Proxy\n:80 :443"]
    Frontend["Frontend\nReact/Vue\nPort 3000"]
    Backend["Backend\nNode.js/Express\nPort 3001"]
    Database[("Database\nMongoDB\nPort 27017")]
    Redis["Redis Cache\nPort 6379\n(if used)"]
    GitHub["GitHub Actions\nCI/CD"]
    
    Internet -->|example.com| DNS
    DNS -->|A Record| Nginx
    Nginx -->|HTTP/HTTPS| Frontend
    Nginx -->|API Proxy| Backend
    Backend -->|Query| Database
    Backend -->|Cache| Redis
    GitHub -->|Deploy| Backend
    GitHub -->|Deploy| Frontend
    
    style Nginx fill:#f9f,stroke:#333,stroke-width:2px
    style Frontend fill:#bbf,stroke:#333,stroke-width:2px
    style Backend fill:#bfb,stroke:#333,stroke-width:2px
    style Database fill:#fb9,stroke:#333,stroke-width:2px
    style Redis fill:#fbb,stroke:#333,stroke-width:2px
```

---

## 3. Infrastructure & Deployment

### VPS Allocation

| Resource | Value | Details |
|----------|-------|---------|
| **Port (HTTP)** | 3000 | Frontend listening port |
| **Port (API)** | 3001 | Backend API port |
| **Nginx Port** | 80/443 | Public access |
| **Deployed Path** | /home/apps/[project-name]/ | Application directory |
| **Process Manager** | PM2 / Docker | How app is managed |
| **Database Port** | 27017 | MongoDB default |
| **Cache Port** | 6379 | Redis (if used) |

### Deployment Method

- [ ] PM2 (Node.js process manager)
- [ ] Docker Compose
- [ ] Standalone (systemd service)
- [ ] Other: ________________

---

## 4. Folder Structure

```
/home/apps/[project-name]/
├── client/                      # Frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .env.local
│   ├── .env.production
│   └── build/                   # Built files (generated)
│
├── server/                      # Backend application
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── index.js
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   └── logs/                    # Application logs
│
├── docker-compose.yml           # Docker services (if using Docker)
├── .env                         # Root environment variables
├── .env.example                 # Template for environment variables
├── README.md                    # Application README
├── pm2.config.js               # PM2 ecosystem file (if using PM2)
├── .gitignore
└── deploy.sh                    # Deployment script (optional)
```

---

## 5. Environment Variables

### Server Environment Variables

| Variable | Purpose | Required | Default | Type | Example |
|----------|---------|----------|---------|------|---------|
| `PORT` | Backend server port | Yes | 3000 | Number | 3001 |
| `NODE_ENV` | Environment | Yes | development | String | production |
| `MONGODB_URI` | Database connection | Yes | - | String | mongodb://localhost:27017/dbname |
| `JWT_SECRET` | JWT signing key | Yes | - | String | [KEEP SECRET] |
| `JWT_EXPIRY` | JWT expiration time | No | 7d | String | 7d |
| `CORS_ORIGIN` | Allowed origins | No | * | String | https://example.com |
| `REDIS_URL` | Redis connection | No | - | String | redis://localhost:6379 |
| `MAIL_SERVICE` | Email service | No | - | String | gmail / sendgrid |
| `MAIL_USER` | Email username | No | - | String | [Keep secret] |
| `MAIL_PASS` | Email password | No | - | String | [Keep secret] |
| `LOG_LEVEL` | Logging level | No | info | String | debug / info / warn / error |
| `API_KEY` | Third-party API key | No | - | String | [Keep secret] |

### Frontend Environment Variables

| Variable | Purpose | Required | Default | Type | Example |
|----------|---------|----------|---------|------|---------|
| `REACT_APP_API_URL` | Backend API URL | Yes | - | String | http://localhost:3001 |
| `REACT_APP_ENV` | Environment | No | development | String | production |
| `REACT_APP_VERSION` | App version | No | - | String | 1.0.0 |
| `REACT_APP_NAME` | App name | No | - | String | MyApp |

### .env File Template

```bash
# Backend (.env in server/)

# Server Configuration
PORT=3001
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/[database-name]

# JWT
JWT_SECRET=[LONG_RANDOM_STRING_KEEP_SECRET]
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=https://example.com,https://www.example.com

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Email (optional)
MAIL_SERVICE=gmail
MAIL_USER=[your-email@gmail.com]
MAIL_PASS=[app-specific-password]

# Logging
LOG_LEVEL=info

# API Keys (keep secret)
EXTERNAL_API_KEY=[KEEP_SECRET]
```

### Environment Management

```bash
# Load environment from .env
node -r dotenv/config index.js

# Check if environment variables are set
env | grep MONGODB_URI

# Set environment variable temporarily
export NODE_ENV=production
node index.js

# Permanently set (add to ~/.bashrc or ~/.profile)
echo 'export NODE_ENV=production' >> ~/.bashrc
source ~/.bashrc
```

---

## 6. Database

### Database Configuration

| Property | Value |
|----------|-------|
| **Provider** | MongoDB / PostgreSQL / MySQL |
| **Host** | localhost / [IP] |
| **Port** | 27017 / 5432 / 3306 |
| **Database Name** | [database-name] |
| **Username** | [db-user] |
| **Connection String** | mongodb://user:pass@localhost:27017/dbname |

### Collections/Tables

```javascript
// MongoDB Collections (Example)
db.users
  - _id (ObjectId)
  - email (String, unique)
  - password (String, hashed)
  - createdAt (Date)
  - updatedAt (Date)

db.posts
  - _id (ObjectId)
  - title (String)
  - content (String)
  - author (ObjectId, ref: User)
  - createdAt (Date)
```

### Database Connection

```javascript
// MongoDB with Mongoose
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));
```

### Backup Procedure

```bash
# MongoDB Backup
mongodump --uri="mongodb://localhost:27017/dbname" --out=/home/backups/mongodb/

# PostgreSQL Backup
pg_dump -U username -d dbname > /home/backups/postgresql/dbname-backup.sql

# MySQL Backup
mysqldump -u username -p dbname > /home/backups/mysql/dbname-backup.sql

# Automated daily backup (cron)
0 2 * * * mongodump --uri="mongodb://localhost:27017/dbname" --out=/home/backups/mongodb/$(date +\%Y\%m\%d)
```

### Restore Procedure

```bash
# MongoDB Restore
mongorestore --uri="mongodb://localhost:27017/dbname" /home/backups/mongodb/

# PostgreSQL Restore
psql -U username -d dbname < /home/backups/postgresql/dbname-backup.sql

# MySQL Restore
mysql -u username -p dbname < /home/backups/mysql/dbname-backup.sql
```

---

## 7. Deployment Steps

### Prerequisites
- [ ] Git repository cloned
- [ ] Node.js/npm installed
- [ ] Database set up and running
- [ ] Environment variables created
- [ ] Domain name configured
- [ ] SSL certificate obtained

### Step-by-Step Deployment

#### 1. Clone Repository

```bash
cd /home/apps/
git clone [REPOSITORY_URL] [project-name]
cd [project-name]
```

#### 2. Install Dependencies

```bash
# Backend
cd server
npm install
cd ..

# Frontend
cd client
npm install
cd ..
```

#### 3. Configure Environment Variables

```bash
# Server environment
cp server/.env.example server/.env
nano server/.env  # Edit with your values

# Frontend environment
cp client/.env.local.example client/.env.local
nano client/.env.local  # Edit with your values
```

#### 4. Build Application

```bash
# Build frontend
cd client
npm run build
cd ..

# Backend runs in development or production mode
# (No build step needed for Express apps)
```

#### 5. Start Application

**Option A: Using PM2**

```bash
# Install PM2 globally (if not already)
npm install -g pm2

# Create PM2 configuration file: pm2.config.js
cat > pm2.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'backend',
      script: './server/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend',
      script: 'npm start',
      cwd: './client',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

# Start with PM2
pm2 start pm2.config.js

# Save PM2 state (auto-restart on reboot)
pm2 save
pm2 startup
```

**Option B: Using Docker Compose**

```bash
# Create docker-compose.yml (if not exists)
# See Docker section below

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### 6. Verify Application

```bash
# Backend health check
curl http://localhost:3001/api/health

# Frontend health check
curl http://localhost:3000

# Check PM2 status
pm2 status
pm2 logs
```

#### 7. Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/example.com.conf
```

**See section 10: Reverse Proxy Configuration**

#### 8. Configure SSL Certificate

```bash
# Request SSL certificate
sudo certbot certonly --nginx -d example.com -d www.example.com

# This updates Nginx config automatically
```

#### 9. Configure Firewall

```bash
# Allow required ports through firewall
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS

# Check firewall status
sudo ufw status
```

#### 10. Restart Services

```bash
# Reload Nginx
sudo systemctl reload nginx

# Restart application
pm2 restart backend
pm2 restart frontend

# Or with Docker
docker-compose restart
```

---

## 8. Reverse Proxy Configuration (Nginx)

### File Location
`/etc/nginx/sites-available/example.com.conf`

### Complete Nginx Configuration

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;
    
    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
    
    # Frontend Routes
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # API Routes
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # API timeout (for long-running requests)
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

---

## 9. SSL/TLS Configuration

### Let's Encrypt Setup

```bash
# Install Certbot (if not already installed)
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificate with Nginx plugin
sudo certbot certonly --nginx -d example.com -d www.example.com

# Or manual verification
sudo certbot certonly --manual -d example.com
```

### SSL Certificate Files

```
/etc/letsencrypt/live/example.com/
├── cert.pem          # Public certificate
├── chain.pem         # Intermediate certificates
├── fullchain.pem     # cert.pem + chain.pem (use in Nginx)
└── privkey.pem       # Private key
```

### Certificate Renewal

```bash
# Manual renewal
sudo certbot renew --cert-name example.com

# Automatic renewal (already set in cron)
# Certbot automatically adds to crontab

# Verify cron job exists
sudo crontab -l | grep certbot

# Manual renewal dry-run (test)
sudo certbot renew --dry-run

# Force renewal (for testing)
sudo certbot renew --force-renewal
```

### Verify Certificate

```bash
# Check certificate details
sudo openssl x509 -in /etc/letsencrypt/live/example.com/cert.pem -text -noout

# Check expiry date
sudo openssl x509 -in /etc/letsencrypt/live/example.com/cert.pem -noout -dates

# Check from domain
echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 10. PM2 Configuration & Management

### PM2 Ecosystem File

**File:** `pm2.config.js` (in root of project)

```javascript
module.exports = {
  apps: [
    {
      name: 'backend',
      script: './server/index.js',
      instances: 2,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M'
    }
  ]
};
```

### PM2 Commands

```bash
# Start application
pm2 start pm2.config.js

# Start specific app
pm2 start server/index.js --name "backend"

# View all processes
pm2 list
pm2 status

# View logs
pm2 logs                    # All logs
pm2 logs backend            # Specific app
pm2 logs backend --tail 50  # Last 50 lines
pm2 logs backend --lines 100 --stream  # Stream logs

# Restart application
pm2 restart backend
pm2 restart all

# Stop application
pm2 stop backend
pm2 stop all

# Delete application
pm2 delete backend
pm2 delete all

# Reload (0 downtime restart)
pm2 reload backend
pm2 reload all

# Auto-restart on server reboot
pm2 save
pm2 startup

# View ecosystem file status
pm2 show backend
```

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Web UI (dashboard)
pm2 web
# Access at: http://localhost:9615

# Get PM2 Plus subscription (optional cloud monitoring)
# pm2 link [access_key] [secret_key]
```

---

## 11. Docker Configuration (if applicable)

### Docker Compose File

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: [project-name]-backend
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      PORT: 3001
      MONGODB_URI: mongodb://mongo:27017/[dbname]
    depends_on:
      - mongo
      - redis
    volumes:
      - ./server:/app
      - /app/node_modules
    networks:
      - app-network
    restart: unless-stopped

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: [project-name]-frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://backend:3001
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

  mongo:
    image: mongo:latest
    container_name: [project-name]-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
      - mongo-config:/data/configdb
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: [project-name]-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network
    restart: unless-stopped

volumes:
  mongo-data:
  mongo-config:
  redis-data:

networks:
  app-network:
    driver: bridge
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View running containers
docker-compose ps
docker ps

# View logs
docker-compose logs -f           # All logs
docker-compose logs -f backend   # Specific service
docker logs container-name       # Container logs

# Restart service
docker-compose restart backend

# Rebuild image
docker-compose build --no-cache

# Execute command in container
docker-compose exec backend npm test
docker exec container-name ls -la

# Remove containers and volumes
docker-compose down -v

# View network
docker network ls
docker network inspect [network-name]
```

---

## 12. GitHub Actions (CI/CD)

### Workflow File

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main
      - production
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd server && npm install
          cd ../client && npm install
      
      - name: Run tests
        run: cd server && npm test

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /home/apps/[project-name]
            git pull origin main
            cd server && npm install && cd ..
            cd client && npm install && npm run build && cd ..
            pm2 restart backend
            pm2 restart frontend
```

### GitHub Secrets

Add these secrets in GitHub Settings > Secrets:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | [IP or domain] |
| `VPS_USER` | [SSH user] |
| `VPS_SSH_KEY` | [Private SSH key] |
| `DB_PASSWORD` | [Database password] |

---

## 13. Monitoring

### Application Health Checks

```bash
# Backend health check
curl -s http://localhost:3001/api/health | jq .

# Frontend check
curl -s http://localhost:3000 | head -20

# API response time
time curl http://localhost:3001/api/endpoint
```

### System Resource Monitoring

```bash
# Real-time CPU/Memory
top -u [user]
htop

# Disk usage
df -h
du -sh /home/apps/[project-name]/*

# Memory usage
free -h

# Network connections
netstat -tulpn | grep 3001
ss -tulpn | grep LISTEN
```

### Log Monitoring

```bash
# Application logs
pm2 logs backend
pm2 logs frontend

# Nginx logs
tail -f /var/log/nginx/example.com.access.log
tail -f /var/log/nginx/example.com.error.log

# System logs
sudo tail -f /var/log/syslog
sudo journalctl -u backend -f

# Docker logs
docker-compose logs -f
docker logs container-name -f
```

### Performance Metrics

| Metric | Threshold | Current |
|--------|-----------|---------|
| CPU Usage | < 80% | [Monitor] |
| Memory Usage | < 80% | [Monitor] |
| Disk Usage | < 90% | [Monitor] |
| Response Time | < 500ms | [Monitor] |
| Error Rate | < 1% | [Monitor] |

---

## 14. Troubleshooting

### Common Problems

| Problem | Cause | Resolution |
|---------|-------|-----------|
| **Port already in use** | Another process on same port | `sudo fuser -k 3001/tcp` |
| **Nginx won't start** | Config error or port conflict | `sudo nginx -t` then `sudo systemctl start nginx` |
| **SSL certificate expired** | Renewal failed | `sudo certbot renew --force-renewal` |
| **MongoDB connection failed** | Database not running | `sudo systemctl start mongodb` or check URI |
| **PM2 process crashed** | Out of memory or error | `pm2 logs backend` to check error |
| **Frontend shows blank** | Backend API not responding | Check backend health: `curl http://localhost:3001` |
| **High memory usage** | Memory leak in application | Check logs, restart with `pm2 restart backend` |
| **GitHub Action deployment failed** | SSH key or credentials invalid | Verify GitHub secrets are correct |
| **CORS errors** | CORS not configured properly | Update `CORS_ORIGIN` in backend .env |
| **Slow response times** | Database query slow or overload | Check database indexes, consider caching |

### Debug Mode

```bash
# Backend debug logging
NODE_DEBUG=* node server/index.js

# PM2 debug
pm2 start server/index.js --name backend -- --debug

# Nginx debug
sudo systemctl stop nginx
sudo nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
```

---

## 15. Security Checklist

- [ ] SSH hardened (key-based authentication only)
- [ ] Firewall properly configured
- [ ] SSL/TLS certificates installed and valid
- [ ] Environment variables not committed to repository
- [ ] Database credentials stored in `.env`
- [ ] API keys not exposed in frontend
- [ ] CORS origin whitelist configured
- [ ] Nginx security headers enabled
- [ ] Fail2Ban protecting SSH
- [ ] Regular backups scheduled
- [ ] Log monitoring enabled
- [ ] HTTPS redirect enabled

---

## 16. Deployment Checklist

Before deploying to production:

- [ ] Code review completed
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Domain/DNS working
- [ ] SSL certificate valid
- [ ] Nginx configuration tested
- [ ] Firewall rules updated
- [ ] PM2/Docker configuration ready
- [ ] Health checks passing
- [ ] Monitoring enabled
- [ ] Rollback plan documented

---

## 17. Rollback Procedure

### Rollback to Previous Version

```bash
# Option 1: Using Git
cd /home/apps/[project-name]
git log --oneline -10  # Check recent commits
git revert HEAD        # Revert last commit
git push origin main

# Option 2: Manual rollback
git checkout [commit-hash]
npm install
npm run build
pm2 restart backend
pm2 restart frontend
```

### Database Rollback

```bash
# See DISASTER-RECOVERY.md for database restore procedures
```

---

## 18. Change Log

Track all changes to this application here.

| Date | Author | Description | Reason | Rollback |
|------|--------|-------------|--------|----------|
| 2026-06-25 | DevOps | Initial deployment | First release | N/A |

---

## Quick Reference Commands

```bash
# View status
pm2 status
docker ps
curl http://localhost:3001/api/health

# View logs
pm2 logs backend
docker-compose logs -f

# Restart
pm2 restart backend
docker-compose restart backend

# Deploy
git pull origin main
pm2 restart backend

# Backup database
mongodump --uri="mongodb://localhost:27017/dbname" --out=/home/backups/

# Check firewall
sudo ufw status
```

---

**Last Updated:** 2026-06-25  
**Version:** 1.0.0  
**Status:** [Active / Staging / Development]  
**Next Review:** [Schedule date]
