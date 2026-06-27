# Domain Registry

Complete tracking of all domains, subdomains, SSL certificates, and DNS configurations hosted on this VPS infrastructure.

---

## Domain Summary

| Status | Count | Details |
|--------|-------|---------|
| **Active Domains** | 0 | Primary production domains |
| **Staging Domains** | 0 | Staging/testing domains |
| **Development Domains** | 0 | Local development domains |
| **Deprecated Domains** | 0 | No longer in use |
| **Redirected Domains** | 0 | Redirects to active domains |
| **Total SSL Certs** | 0 | Let's Encrypt certificates |

---

## Active Domains

| Domain | Application | SSL | Expiry Date | Status | Nginx Config | Owner | Last Updated | Notes |
|--------|-------------|-----|-------------|--------|--------------|-------|--------------|-------|
| (none) | - | - | - | - | - | - | - | Add domains here |

---

## Domain Details Template

When adding a new domain, include complete information:

```markdown
| example.com | App Name | Let's Encrypt | 2026-12-25 | Active | /etc/nginx/sites-enabled/example.conf | Owner Name | 2026-06-25 | Primary production domain |
```

---

## SSL Certificate Management

### Active Certificates

| Domain | Issuer | Issue Date | Expiry Date | Days Left | Auto Renew | Status | Last Renewed |
|--------|--------|-----------|------------|-----------|-----------|--------|--------------|
| (none) | - | - | - | - | - | - | - |

### Let's Encrypt Certificate Commands

```bash
# List all certificates
sudo certbot certificates

# Obtain new certificate for domain
sudo certbot certonly --nginx -d example.com

# Renew specific certificate
sudo certbot renew --cert-name example.com

# Renew all certificates
sudo certbot renew

# Dry run renewal (test)
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal

# Delete certificate
sudo certbot delete --cert-name example.com
```

### Certificate Renewal Automation

```bash
# Add cron job for automatic renewal
sudo crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * /usr/bin/certbot renew --quiet

# Verify cron is set
sudo crontab -l

# View renewal logs
sudo tail -f /var/log/letsencrypt/renew.log
```

### Certificate File Locations

```bash
# Certificate files location
/etc/letsencrypt/live/[domain.com]/

# Files in that directory
cert.pem          # The certificate
chain.pem         # The certificate chain
fullchain.pem     # cert + chain (use in Nginx)
privkey.pem       # Private key

# Example Nginx configuration
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

### Check Certificate Details

```bash
# View certificate info
openssl x509 -in /etc/letsencrypt/live/domain.com/cert.pem -text -noout

# Check expiry date
openssl x509 -in /etc/letsencrypt/live/domain.com/cert.pem -noout -dates

# Verify certificate matches key
openssl x509 -noout -modulus -in /etc/letsencrypt/live/domain.com/cert.pem | openssl md5
openssl rsa -noout -modulus -in /etc/letsencrypt/live/domain.com/privkey.pem | openssl md5

# Check certificate from domain
echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
```

### SSL Certificate Renewal Issues

| Problem | Cause | Resolution |
|---------|-------|-----------|
| Certificate expired | Renewal failed or missed | Run `certbot renew --force-renewal` immediately |
| Renewal failed | Port 80 not accessible | Check firewall, check Nginx config |
| Nginx won't start | Certificate path invalid | Check paths in Nginx config, verify certificate exists |
| Too many requests | Exceeded renewal limit | Wait 1 week, check Let's Encrypt rate limits |
| DNS validation failed | DNS record incorrect | Verify DNS A record points to VPS IP |

---

## DNS Configuration

### DNS Records Required

For each domain, ensure these DNS records are configured:

| Record Type | Name | Value | Status | Notes |
|-------------|------|-------|--------|-------|
| A | example.com | [VPS_IP] | Active | Root domain points to VPS |
| A | www | [VPS_IP] | Active | www subdomain |
| CNAME | api | example.com | (if needed) | API subdomain |
| CNAME | admin | example.com | (if needed) | Admin panel subdomain |
| MX | - | - | (if email) | Mail exchange records if using email |
| TXT | - | - | (if needed) | SPF, DKIM, DMARC records if email |

### Verify DNS Resolution

```bash
# Check A record
nslookup example.com
dig example.com
host example.com

# Check specific record type
nslookup -type=A example.com
dig A example.com

# Check all records
dig example.com ANY

# Trace DNS resolution
nslookup -type=A example.com 8.8.8.8

# Check propagation
dig example.com @8.8.8.8
```

---

## Subdomains

### Active Subdomains

| Subdomain | Application | DNS | SSL | Status | Nginx Location | Notes |
|-----------|-------------|-----|-----|--------|-----------------|-------|
| - | - | - | - | - | - | Add subdomains here |

### DNS Setup for Subdomains

```bash
# Example: api.example.com

# Option 1: A record (if on same server)
api.example.com  A  [VPS_IP]

# Option 2: CNAME record (if using CDN or another server)
api.example.com  CNAME  example.com.
```

### Nginx Configuration for Subdomains

```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;
    
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Domain Status Reference

### Active ✅
- Domain is registered and in use
- DNS properly configured
- SSL certificate valid
- Nginx reverse proxy configured
- Application running

### Staging 🟡
- Used for testing/pre-release
- May use self-signed or wildcard SSL
- Separate environment
- Not for production traffic

### Development 🔵
- Local development domain
- May use local DNS or hosts file
- HTTP only (no SSL required)
- Not exposed to internet

### Deprecated ⚠️
- No longer in active use
- Kept for reference/history
- Should be marked with deprecation date
- May be kept for redirect purposes

### Redirected 🔄
- Redirects to another active domain
- Nginx configured with redirect
- SSL may be maintained for redirect
- Example: old-domain.com → new-domain.com

### Removed ❌
- No longer hosted
- Domain registration may be expired
- DNS records removed
- Kept in archive for reference

---

## Nginx Domain Configuration

### Nginx Configuration Directory

```
/etc/nginx/sites-available/
├── example.com.conf
├── api.example.com.conf
└── [other domains]

/etc/nginx/sites-enabled/
├── example.com -> ../sites-available/example.com.conf
├── api.example.com -> ../sites-available/api.example.com.conf
└── [other domains]
```

### Basic Nginx Configuration Template

```nginx
# File: /etc/nginx/sites-available/example.com.conf

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

### Enable Nginx Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/example.com.conf

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# View enabled sites
ls -la /etc/nginx/sites-enabled/
```

---

## Domain Troubleshooting

### Domain Not Resolving

```bash
# Check if DNS is set correctly
nslookup example.com
dig example.com

# Check DNS propagation
dig example.com @8.8.8.8

# If not resolving, check:
1. Domain registrar DNS settings
2. DNS A record points to correct IP
3. Wait 24-48 hours for propagation

# Force DNS cache flush (OS dependent)
# Linux: sudo systemd-resolve --flush-caches
# macOS: sudo dscacheutil -flushcache
```

### SSL Certificate Not Loading

```bash
# Check certificate exists
ls -la /etc/letsencrypt/live/example.com/

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/example.com/cert.pem -text -noout

# Check expiry
openssl x509 -in /etc/letsencrypt/live/example.com/cert.pem -noout -dates

# Check if Nginx config is correct
sudo nginx -t

# Check if certificate matches key
# Should have same output
openssl x509 -noout -modulus -in /etc/letsencrypt/live/example.com/cert.pem | openssl md5
openssl rsa -noout -modulus -in /etc/letsencrypt/live/example.com/privkey.pem | openssl md5

# If expired, renew
sudo certbot renew --force-renewal
```

### Nginx Not Proxying Domain

```bash
# Check Nginx configuration
sudo nginx -t

# Check if site is enabled
ls -la /etc/nginx/sites-enabled/ | grep example

# Reload Nginx
sudo systemctl reload nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Test localhost proxy
curl -H "Host: example.com" http://localhost
```

### SSL Mixed Content Error

Check browser console for insecure content warnings. Ensure all resources use HTTPS:

```nginx
# In Nginx config, force HTTPS for all assets
location / {
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    proxy_pass http://localhost:3000;
}
```

---

## Domain Expiration Monitoring

### Check Domain Expiration

```bash
# Check when domain expires
whois example.com | grep "Expir"

# Using online tools
# https://whois.icann.org/
# https://www.domaintools.com/
```

### Calendar Reminders

| Domain | Registrar | Registration Date | Expiry Date | Renew Before | Status |
|--------|-----------|-------------------|-------------|--------------|--------|
| (none) | - | - | - | - | - |

**Recommendation:** Set calendar reminders 3 months before expiry.

---

## Domain Migration

If migrating domain to this VPS:

1. ✅ Ensure DNS A record points to new VPS IP
2. ✅ Obtain SSL certificate for domain
3. ✅ Configure Nginx for domain
4. ✅ Test domain resolves correctly
5. ✅ Test SSL certificate loads
6. ✅ Test application is accessible
7. ✅ Verify DNS propagation (24-48 hours)
8. ✅ Update documentation
9. ✅ Set up SSL renewal monitoring

---

## Batch Domain Management

### List All Domains on VPS

```bash
# List Nginx enabled sites
ls /etc/nginx/sites-enabled/

# List Let's Encrypt certificates
sudo certbot certificates

# List all domains being proxied
grep -r "server_name" /etc/nginx/sites-enabled/
```

### Health Check All Domains

```bash
# Test all domains with curl
for domain in example.com api.example.com; do
    echo "Testing $domain..."
    curl -I https://$domain
done

# Test SSL certificates
for domain in example.com api.example.com; do
    echo "Checking $domain SSL..."
    openssl s_client -servername $domain -connect $domain:443 </dev/null | openssl x509 -noout -dates
done
```

---

## Commands Reference

```bash
# Domain/DNS checks
nslookup domain.com
dig domain.com
host domain.com
whois domain.com

# Certificate checks
sudo certbot certificates
sudo certbot show domain.com
openssl x509 -in /etc/letsencrypt/live/domain.com/cert.pem -text -noout

# Nginx config
sudo nginx -t
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/error.log

# SSL renewal
sudo certbot renew
sudo certbot renew --force-renewal --cert-name domain.com

# Check domain connectivity
curl -I https://domain.com
curl -v https://domain.com
```

---

**Last Updated:** 2026-06-25  
**Version:** 1.0.0  
**Total Domains:** 0  
**Active Certificates:** 0  
**Renewal Due:** None
