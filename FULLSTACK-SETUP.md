# Wiki Manager - Fullstack Setup & Deployment Guide

Complete guide to set up, develop, and deploy the Wiki Manager MERN stack application.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Running Locally](#running-locally)
4. [Database Setup](#database-setup)
5. [Configuration](#configuration)
6. [API Documentation](#api-documentation)
7. [Docker Deployment](#docker-deployment)
8. [Hostinger VPS Deployment](#hostinger-vps-deployment)
9. [Troubleshooting](#troubleshooting)

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- MongoDB 5.0+
- Git
- Docker & Docker Compose (for containerized deployment)
- Postman or cURL (for API testing)

### Installation Steps

#### 1. Clone Repository

```bash
git clone https://github.com/your-org/wiki-manager.git
cd wiki-manager
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/wiki-manager
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env.local` file:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Project Structure

```
wiki-manager/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── index.js           # Server entry point
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── WikiPage.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── wikiController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── wiki.js
│   │   │   ├── user.js
│   │   │   └── search.js
│   │   └── middleware/
│   │       ├── auth.js
│   │       └── errorHandler.js
│   ├── .env.example
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── WikiViewPage.js
│   │   │   ├── WikiEditorPage.js
│   │   │   ├── SearchPage.js
│   │   │   └── AdminPage.js
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   └── styles/
│   │       └── index.css
│   ├── public/
│   │   └── index.html
│   ├── .env.local
│   ├── package.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml          # Multi-container orchestration
└── FULLSTACK-SETUP.md         # This file
```

## Running Locally

### Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or start local MongoDB service
mongod
```

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on http://localhost:3001
Connected to MongoDB
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!
You can now view the app in the browser at http://localhost:3000
```

### Access Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## Database Setup

### MongoDB Installation

#### On Ubuntu/Debian:
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Using Docker:
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secure-password \
  mongo:7.0
```

### Create Database & Collections

```bash
# Connect to MongoDB
mongosh

# Create database
use wiki-manager

# Create users collection with indexes
db.createCollection("users")
db.users.createIndex({ email: 1 }, { unique: true })

# Create wiki pages collection with indexes
db.createCollection("wikipages")
db.wikipages.createIndex({ slug: 1 }, { unique: true })
db.wikipages.createIndex({ title: "text", content: "text", tags: "text" })
```

## Configuration

### Environment Variables

#### Backend (.env)

```env
# Server
NODE_ENV=development|production
PORT=3001

# Database
MONGODB_URI=mongodb://user:password@host:27017/wiki-manager

# Authentication
JWT_SECRET=very-secure-random-secret-key-min-32-chars
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://wiki.example.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Email (for future notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logging
LOG_LEVEL=debug|info|warn|error
```

#### Frontend (.env.local)

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development|production
```

### Secure Configuration for Production

```bash
# Generate secure JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate secure password for MongoDB
openssl rand -base64 32
```

## API Documentation

### Authentication Endpoints

```bash
# Register
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "department": "Backend"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

# Get Current User
GET /api/auth/me
Authorization: Bearer <token>
```

### Wiki Endpoints

```bash
# Create Page
POST /api/wiki
Authorization: Bearer <token>
{
  "title": "Infrastructure Setup",
  "content": "# Setup Guide\n...",
  "category": "infrastructure",
  "tags": ["docker", "setup"]
}

# List Pages
GET /api/wiki?limit=10&skip=0&sort=-updatedAt

# Get Page by Slug
GET /api/wiki/page/infrastructure-setup

# Update Page
PUT /api/wiki/:id
Authorization: Bearer <token>
{
  "content": "Updated content",
  "description": "Fixed typos"
}

# Delete Page
DELETE /api/wiki/:id
Authorization: Bearer <token>

# Full-Text Search
GET /api/search?q=kubernetes

# Search by Category
GET /api/search/category/deployment
```

### Admin Endpoints

```bash
# List Users
GET /api/users
Authorization: Bearer <admin-token>

# Get User
GET /api/users/:id
Authorization: Bearer <admin-token>

# Update User
PUT /api/users/:id
Authorization: Bearer <admin-token>
{
  "role": "editor",
  "isActive": true
}

# Deactivate User
POST /api/users/:id/deactivate
Authorization: Bearer <admin-token>
```

## Docker Deployment

### Build Images

```bash
# Build backend image
docker build -t wiki-manager-backend:latest ./backend

# Build frontend image
docker build -t wiki-manager-frontend:latest ./frontend
```

### Docker Compose

Create or use existing `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: wiki-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    networks:
      - wiki-network

  backend:
    build: ./backend
    container_name: wiki-backend
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      PORT: 3001
      MONGODB_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/wiki-manager
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRE: 7d
      FRONTEND_URL: http://localhost:3000
    depends_on:
      - mongodb
    networks:
      - wiki-network
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: wiki-frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001/api
    depends_on:
      - backend
    networks:
      - wiki-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: wiki-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - wiki-network
    restart: unless-stopped

volumes:
  mongodb_data:

networks:
  wiki-network:
    driver: bridge
```

### Run Containers

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (deletes data!)
docker-compose down -v
```

## Hostinger VPS Deployment

### Prerequisites

- Ubuntu 20.04+ VPS
- SSH access
- Domain name configured

### Step 1: SSH into VPS

```bash
ssh root@your-vps-ip
```

### Step 2: Update System

```bash
apt update && apt upgrade -y
apt install -y curl wget git nodejs npm nginx mongodb
```

### Step 3: Clone Repository

```bash
cd /var/www
git clone https://github.com/your-org/wiki-manager.git
cd wiki-manager
```

### Step 4: Install Dependencies

```bash
# Backend
cd backend
npm install --production

# Frontend
cd ../frontend
npm install
npm run build
```

### Step 5: Configure Environment

```bash
# Backend
cp .env.example backend/.env
nano backend/.env
# Update with production values

# Frontend
echo "REACT_APP_API_URL=https://api.your-domain.com" > frontend/.env.local
```

### Step 6: Start Services

```bash
# Backend (using PM2)
npm install -g pm2
cd backend
pm2 start "npm start" --name "wiki-backend"
pm2 save
pm2 startup

# Frontend (served by Nginx)
cd ../frontend
npm run build
```

### Step 7: Configure Nginx

Create `/etc/nginx/sites-available/wiki`:

```nginx
upstream backend {
    server localhost:3001;
}

server {
    listen 80;
    server_name wiki.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name wiki.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/wiki.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wiki.your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    # Frontend
    location / {
        root /var/www/wiki-manager/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/wiki /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 8: Setup SSL Certificate

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot certonly --nginx -d wiki.your-domain.com
```

### Step 9: Setup MongoDB

```bash
# Create admin user
mongosh
use admin
db.createUser({
  user: "wikiadmin",
  pwd: "strong-password",
  roles: ["root"]
})

# Create wiki database
use wiki-manager
db.createUser({
  user: "wikiuser",
  pwd: "database-password",
  roles: ["dbOwner"]
})
```

### Step 10: Monitor Services

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs wiki-backend

# Restart service
pm2 restart wiki-backend
```

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB status
systemctl status mongod

# View MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
systemctl restart mongod

# Connect to MongoDB
mongosh "mongodb://user:password@localhost:27017/wiki-manager"
```

### Backend Won't Start

```bash
# Check logs
npm run dev 2>&1 | head -50

# Verify port is free
lsof -i :3001

# Verify environment variables
cat .env

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Build Issues

```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Build again
npm run build

# Check build folder
ls -la build/
```

### CORS Issues

Verify backend CORS configuration:
```javascript
// backend/src/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### JWT Token Issues

```bash
# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env
JWT_SECRET=<new-secret>

# Restart backend
pm2 restart wiki-backend
```

### Memory Issues

```bash
# Check memory usage
free -h

# Increase Node.js memory
pm2 restart wiki-backend --max-memory-restart 500M
```

## Maintenance

### Regular Backups

```bash
# Backup MongoDB
mongodump --out /backups/wiki-$(date +%Y%m%d)

# Backup via Docker
docker exec wiki-mongodb mongodump --out /data/backup
```

### Update Dependencies

```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd frontend
npm update
npm audit fix
```

### Monitor Disk Space

```bash
# Check usage
df -h

# Clean up old logs
find /var/log -type f -name "*.log" -mtime +30 -delete
```

## Performance Optimization

### Database Indexes

```bash
# Already created indexes for:
# - users: email (unique)
# - wikipages: slug (unique), title/content/tags (text search)

# Add additional indexes for better query performance
db.wikipages.createIndex({ category: 1, createdAt: -1 })
db.users.createIndex({ role: 1 })
```

### Caching Strategy

```javascript
// Consider adding Redis for session caching
// Cache wiki page content for 24 hours
// Cache search results for 1 hour
```

### Load Balancing

For production with high traffic:
```bash
# Run multiple backend instances with PM2
pm2 start "npm start" -i 4 --name "wiki-backend"
```

## Security Checklist

- [ ] Update default JWT_SECRET to 32+ character random string
- [ ] Update MongoDB admin password
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure firewall rules
- [ ] Set up rate limiting on API endpoints
- [ ] Enable CORS only for allowed domains
- [ ] Regular security audits (npm audit, snyk)
- [ ] Keep dependencies updated
- [ ] Enable MongoDB authentication
- [ ] Set up log monitoring
- [ ] Configure backup retention policy
- [ ] Implement API request logging

## Support & Documentation

- Backend API: See [backend/README.md](./backend/README.md)
- Frontend: See [frontend/README.md](./frontend/README.md)
- Issues: Create GitHub issue with detailed description
- Email: support@your-domain.com

## License

MIT License - See LICENSE file

---

**Last Updated**: 2024
**Status**: Production Ready
