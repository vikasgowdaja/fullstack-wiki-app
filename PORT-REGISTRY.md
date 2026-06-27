# Port Registry

Complete tracking of all TCP/UDP ports allocated and in use on the VPS infrastructure. Prevents port conflicts and enables quick reference for all running services.

---

## Port Allocation Summary

| Status | Count | Ports |
|--------|-------|-------|
| Reserved/System | - | 0-1023 (requires sudo) |
| **In Use** | 0 | [See table below] |
| **Available** | Many | [See recommendations] |
| **Total VPS Range** | 65535 | 1-65535 |

---

## Active Ports

| Port | Protocol | Service | Application | Owner | Status | Last Updated | Notes |
|------|----------|---------|-------------|-------|--------|--------------|-------|
| 22 | TCP | SSH | System | root | Active | 2026-06-25 | SSH access - Never expose to untrusted networks |
| 80 | TCP | HTTP | Nginx | root | Active | 2026-06-25 | Web traffic - Reverse proxy |
| 443 | TCP | HTTPS | Nginx | root | Active | 2026-06-25 | Secure web traffic - Reverse proxy |
| 9615 | TCP | PM2 Plus | PM2 (optional) | root | Inactive | 2026-06-25 | PM2 Web UI - Only enable if monitoring needed |

---

## Available Port Ranges

### Development Ports (3000-3999)
Good for development and staging applications.

| Port | Status | Recommended For |
|------|--------|-----------------|
| 3000 | Available | Backend/API Development |
| 3001 | Available | Frontend Development |
| 3002 | Available | Microservice #1 |
| 3003 | Available | Microservice #2 |
| 3004-3999 | Available | Additional services |

### Testing Ports (4000-4999)
Reserved for testing environments.

| Port | Status | Recommended For |
|------|--------|-----------------|
| 4000-4999 | Available | Testing applications |

### Database Ports (5000-6000)
Standard ports for databases.

| Port | Database | Status | Notes |
|------|----------|--------|-------|
| 5432 | PostgreSQL | Available | PostgreSQL default |
| 5433 | PostgreSQL | Available | PostgreSQL alternative |
| 3306 | MySQL | Available | MySQL default |
| 3307 | MySQL | Available | MySQL alternative |
| 5984 | CouchDB | Available | CouchDB default |
| 6379 | Redis | Available | Redis default |
| 27017 | MongoDB | Available | MongoDB default |
| 27018 | MongoDB | Available | MongoDB alternative |

### Custom Application Ports (6000-8000)
For custom applications and services.

| Port | Status | Recommended For |
|------|--------|-----------------|
| 6000-8000 | Available | Custom applications |

### Utility Ports (8000-9000)
For monitoring, admin panels, and utilities.

| Port | Service | Status | Recommended For |
|------|---------|--------|-----------------|
| 8080 | HTTP Alt | Available | Alternative web server |
| 8443 | HTTPS Alt | Available | Alternative HTTPS |
| 8888 | Admin | Available | Admin panels |
| 8889 | Monitoring | Available | Monitoring dashboards |
| 9000 | Utilities | Available | Development utilities |

### Reserved High Ports (49152-65535)
Ephemeral port range - avoid assigning to services.

---

## Port Allocation Rules

### ✅ DO:
- Always check for conflicts before assigning
- Document purpose and owner for every port
- Use standard ports when possible (80, 443, 3306, 5432, etc.)
- Use ports in recommended ranges for similar services
- Keep related services near each other (e.g., 3000-3999 for app services)
- Update this registry immediately after allocation
- Include owner contact information

### ❌ DON'T:
- Use ports below 1024 without `sudo`
- Assign duplicate ports to different services
- Use random ports without documentation
- Forget to add to firewall rules
- Leave ports open in firewall unnecessarily
- Use ephemeral port range (49152-65535)

---

## Port Conflict Resolution

### Check if Port is In Use

```bash
# Check specific port
sudo netstat -tulpn | grep :PORT
sudo lsof -i :PORT
ss -tulpn | grep :PORT

# List all listening ports
sudo netstat -tulpn
sudo lsof -i -P -n
ss -tulpn

# Find which process uses a port
sudo fuser PORT/tcp
sudo fuser PORT/tcp -v
```

### Kill Process Using Port

```bash
# Identify process using port
sudo lsof -i :PORT

# Kill by PID
kill -9 PID

# Kill by service name
sudo systemctl stop [service-name]
sudo systemctl restart [service-name]

# Kill by port (single command)
sudo fuser -k PORT/tcp
```

---

## Docker Port Mapping

When using Docker, ports on host are mapped to container ports.

### Example Docker Compose Mapping

```yaml
services:
  backend:
    ports:
      - "3001:3000"  # Host:Container
    environment:
      PORT: 3000

  frontend:
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
```

### Docker Port Rules

| Host Port | Container Port | Notes |
|-----------|----------------|-------|
| [Host] | [Container] | Add as services are deployed |

---

## Nginx Reverse Proxy Ports

Nginx listens on standard web ports and proxies to backend ports.

```nginx
# HTTP traffic on port 80
server {
    listen 80;
    server_name domain.com;
    location / {
        proxy_pass http://localhost:3001;  # Backend on 3001
    }
}

# HTTPS traffic on port 443
server {
    listen 443 ssl http2;
    server_name domain.com;
    location / {
        proxy_pass http://localhost:3001;
    }
}
```

**Rule:** Backend applications should run on non-standard ports (3000+), with Nginx proxying from 80/443.

---

## Firewall Port Rules

### Current Firewall Configuration

```bash
# View current rules
sudo ufw status verbose

# Example rules to implement
sudo ufw allow 22/tcp          # SSH
sudo ufw allow 80/tcp          # HTTP
sudo ufw allow 443/tcp         # HTTPS
sudo ufw allow 3001/tcp        # Specific app
```

### Open/Close Port Commands

```bash
# Allow port
sudo ufw allow PORT

# Allow port from specific IP
sudo ufw allow from 192.168.1.0/24 to any port PORT

# Allow port range
sudo ufw allow 3000:3100/tcp

# Deny port
sudo ufw deny PORT

# Delete rule
sudo ufw delete allow PORT

# View rule number and delete
sudo ufw status numbered
sudo ufw delete 1  # Delete rule #1
```

---

## Port Monitoring

### Monitor Port Activity

```bash
# Real-time port monitoring
watch -n 1 'netstat -tulpn'

# Continuous TCP connections
tcpdump -i any -n port PORT

# Monitor specific service
ss -tulpn | grep :3001

# Monitor all connections to port
netstat -tulpn | grep LISTEN
```

### Health Check

```bash
# Check if port is responding
curl -v http://localhost:3001

# Check with nc (netcat)
nc -zv localhost 3001

# Check with telnet
telnet localhost 3001

# Port scan with nmap
nmap localhost
```

---

## Network Address Translation (NAT) Ports

If behind a firewall or NAT:

| External Port | Internal Port | Service | Notes |
|---------------|---------------|---------|-------|
| [External] | [Internal] | [Service] | Add as needed |

---

## Deprecated/Reserved Ports

| Port | Reason | Deprecated Date | Notes |
|------|--------|-----------------|-------|
| (none yet) | | | |

---

## Port Allocation Recommendations

### For a New Microservice

**Suggested port:** 3XXX (next available in 3000+ range)

**Example allocation for new app:**
```
Backend API: 3001
Background Worker: 3002
Webhook Handler: 3003
Admin Panel: 3004
Cache: 6379
Database: 27017
```

### For a Database

**Suggested port:** Standard database port
- MongoDB: 27017
- PostgreSQL: 5432
- MySQL: 3306
- Redis: 6379

### For Admin/Monitoring

**Suggested port:** 8000+
- Admin Dashboard: 8080
- Metrics/Monitoring: 8888
- Health Checks: 8889

---

## Quick Add Template

When adding a new service, copy this template and fill in:

```markdown
| [NEW-PORT] | TCP | [SERVICE] | [APP-NAME] | [OWNER] | [ACTIVE/INACTIVE] | 2026-06-25 | [NOTES] |
```

**Before adding:**
1. Check existing ports (use: `sudo netstat -tulpn`)
2. Confirm no conflicts
3. Update firewall if needed
4. Update this registry
5. Inform team

---

## Troubleshooting

### "Address already in use"

```bash
# Find which process uses the port
sudo lsof -i :PORT
sudo netstat -tulpn | grep :PORT

# Stop the process
sudo systemctl stop [service]

# Or kill the process
kill -9 [PID]
```

### "Permission denied" (Port < 1024)

```bash
# Ports below 1024 require root/sudo
sudo [command]

# Solution: Use port > 1024 or run with sudo
# Recommended: Use port 3000+ and proxy through Nginx on 80/443
```

### Port Already Allocated to Another Service

1. Check [PORT-REGISTRY.md](PORT-REGISTRY.md) for conflicts
2. Change one service to different port
3. Update documentation
4. Restart affected services
5. Test connectivity

---

## Commands Reference

```bash
# Show all listening ports
sudo ss -tulpn
sudo netstat -tulpn
sudo lsof -i -P -n

# Show connections to specific port
sudo lsof -i :PORT
sudo netstat -tulpn | grep :PORT

# Show process using port
sudo fuser PORT/tcp -v

# Kill process on port
sudo fuser -k PORT/tcp
kill -9 [PID]

# Test if port is open
curl http://localhost:PORT
telnet localhost PORT
nc -zv localhost PORT

# Check firewall for port
sudo ufw status | grep PORT
```

---

**Last Updated:** 2026-06-25  
**Version:** 1.0.0  
**Total Active Ports:** 3 (SSH, HTTP, HTTPS)  
**Ports Available:** 65532
