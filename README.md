# Production Deployment Wiki

Welcome to the authoritative infrastructure and deployment documentation for all VPS-hosted applications. This wiki serves as the single source of truth for infrastructure, configurations, deployment procedures, and troubleshooting.

---

## 📚 Table of Contents

### Core Documentation
- [Infrastructure Overview](INFRASTRUCTURE.md) - VPS specifications, OS, packages, and core setup
- [Port Registry](PORT-REGISTRY.md) - All ports, services, and allocation tracking
- [Domain Registry](DOMAIN-REGISTRY.md) - All domains, SSL, and DNS configuration
- [Changelog](CHANGELOG.md) - History of all infrastructure changes

### Application Documentation
Use the [Application Template](APP-TEMPLATE.md) to document new applications. Each application gets its own markdown file.

**Deployed Applications:**
- (To be added as applications are deployed)

### Infrastructure & Security
- [Security Checklist](SECURITY-CHECKLIST.md) - Security baseline and hardening procedures
- [Disaster Recovery](DISASTER-RECOVERY.md) - Backup, restore, and recovery procedures

---

## 🚀 Quick Reference

### Common Commands

**SSH Access**
```bash
ssh [SSH_USER]@[PUBLIC_IP]
```

**View Running Applications**
```bash
# PM2 Applications
pm2 list

# Docker Containers
docker ps -a

# All Listening Ports
sudo netstat -tulpn | grep LISTEN
```

**View Logs**
```bash
# PM2 Logs
pm2 logs [app-name]

# System Logs
sudo tail -f /var/log/syslog

# Nginx Logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

**Firewall Status**
```bash
sudo ufw status
sudo ufw status verbose
```

---

## 📋 Key Registries

| Type | Status | Document |
|------|--------|----------|
| Ports | Tracking | [PORT-REGISTRY.md](PORT-REGISTRY.md) |
| Domains | Tracking | [DOMAIN-REGISTRY.md](DOMAIN-REGISTRY.md) |
| Infrastructure | Documented | [INFRASTRUCTURE.md](INFRASTRUCTURE.md) |
| Changes | Maintained | [CHANGELOG.md](CHANGELOG.md) |

---

## 🔐 Security Guidelines

- ✅ Never commit secrets or API keys
- ✅ Always use `.env` files for sensitive data
- ✅ Enable SSL/TLS for all domains
- ✅ Keep SSH hardened and use key-based authentication
- ✅ Maintain regular backups
- ✅ Monitor firewall and fail2ban logs
- ✅ Review security checklist regularly

See [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md) for complete guidelines.

---

## 📝 Update Policy

**When infrastructure changes occur:**

1. Identify which sections are affected
2. Update only the relevant sections
3. Add entry to [CHANGELOG.md](CHANGELOG.md)
4. Preserve previous information (mark as deprecated if needed)
5. Never rewrite entire documents unnecessarily

**Update triggers:**
- New application deployed
- Port allocated
- Domain added or changed
- SSL certificate renewed or added
- Nginx configuration changed
- Environment variables modified
- Infrastructure scaled or changed
- Security updates applied
- Disaster recovery drill completed

---

## ✅ Validation Checklist

Before deploying any new application or change:

- [ ] Check for port conflicts in [PORT-REGISTRY.md](PORT-REGISTRY.md)
- [ ] Check domain availability in [DOMAIN-REGISTRY.md](DOMAIN-REGISTRY.md)
- [ ] Verify SSL certificate requirements
- [ ] Validate Nginx configuration
- [ ] Check PM2 or Docker conflicts
- [ ] Verify firewall rules
- [ ] Confirm environment variables are set
- [ ] Identify all dependencies
- [ ] Review security checklist
- [ ] Plan rollback strategy

---

## 🏗️ Creating New Application Documentation

1. **Copy [APP-TEMPLATE.md](APP-TEMPLATE.md)**
2. **Name the file:** `APP-[ProjectName].md`
3. **Fill in all sections** with project-specific information
4. **Add link** to this README
5. **Register ports** in [PORT-REGISTRY.md](PORT-REGISTRY.md)
6. **Register domains** in [DOMAIN-REGISTRY.md](DOMAIN-REGISTRY.md)
7. **Add changelog entry** to [CHANGELOG.md](CHANGELOG.md)

---

## 📊 Infrastructure Dashboard

**Current Status:**
```
VPS Status: [To be configured]
Total Applications: [To be updated]
Active Domains: [To be updated]
Ports In Use: [To be updated]
SSL Certificates: [To be updated]
Last Backup: [To be updated]
```

---

## 🔗 External Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Docker Documentation](https://docs.docker.com/)
- [UFW Firewall Guide](https://help.ubuntu.com/community/UFW)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 👥 Contributing

This wiki is a living document. When making changes:

1. Keep sections organized and searchable
2. Use consistent formatting
3. Include examples and explanations
4. Document commands with descriptions
5. Maintain version history in changelog
6. Never delete deprecated information—mark it instead

---

**Last Updated:** 2026-06-25  
**Version:** 1.0.0  
**Maintained By:** DevOps Team
