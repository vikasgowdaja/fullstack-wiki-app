# Getting Started with Your Deployment Wiki

This guide will help you get started with your production deployment wiki.

---

## 📋 What You Have

A complete, professional-grade deployment documentation system with:

### Core Documentation Files
1. **README.md** - Wiki index and overview
2. **INFRASTRUCTURE.md** - VPS specs, OS config, system resources
3. **PORT-REGISTRY.md** - All port allocations and tracking
4. **DOMAIN-REGISTRY.md** - All domains, DNS, and SSL certificates
5. **APP-TEMPLATE.md** - Template for documenting each application
6. **CHANGELOG.md** - Complete history of infrastructure changes
7. **SECURITY-CHECKLIST.md** - Security baseline and hardening procedures
8. **DISASTER-RECOVERY.md** - Backup and recovery procedures
9. **QUICK-REFERENCE.md** - Fast-access command reference
10. **.gitignore** - Prevent accidental commits of sensitive data

---

## 🚀 Getting Started (First 30 Minutes)

### Step 1: Initialize Git Repository

```bash
cd /path/to/wiki
git init
git add .
git commit -m "Initial deployment wiki setup"
git remote add origin https://github.com/yourusername/wiki.git
git push -u origin main
```

### Step 2: Fill in VPS Information

Edit [INFRASTRUCTURE.md](INFRASTRUCTURE.md) and add:
- VPS provider and plan details
- OS version and specs
- CPU, RAM, Disk information
- Public IP address
- Installed packages versions

```bash
# Quick way to gather VPS info
echo "=== VPS Info ===" > /tmp/vps-info.txt
echo "Kernel: $(uname -r)" >> /tmp/vps-info.txt
echo "CPU: $(grep -c processor /proc/cpuinfo) cores" >> /tmp/vps-info.txt
echo "RAM: $(free -h | grep Mem)" >> /tmp/vps-info.txt
echo "Disk: $(df -h /)" >> /tmp/vps-info.txt
echo "OS: $(lsb_release -d)" >> /tmp/vps-info.txt
cat /tmp/vps-info.txt
```

### Step 3: Update Port Registry

Edit [PORT-REGISTRY.md](PORT-REGISTRY.md) and add your current active ports:

```bash
# Find all listening ports
sudo netstat -tulpn | grep LISTEN
```

### Step 4: Update Domain Registry

Edit [DOMAIN-REGISTRY.md](DOMAIN-REGISTRY.md) and add your domains:

```bash
# List current domains
ls /etc/nginx/sites-enabled/
sudo certbot certificates
```

### Step 5: Set Up Your First Application

1. Copy [APP-TEMPLATE.md](APP-TEMPLATE.md) to `APP-[YourAppName].md`
2. Fill in all 18 sections with your application details
3. Add link to README.md under "Deployed Applications"
4. Update PORT-REGISTRY.md with your app's ports
5. Update DOMAIN-REGISTRY.md with your app's domain

---

## 📝 Common Wiki Usage Tasks

### Deploy a New Application

```
1. Create APP-[AppName].md from APP-TEMPLATE.md
2. Document all 18 sections
3. Register ports in PORT-REGISTRY.md
4. Register domain in DOMAIN-REGISTRY.md
5. Add changelog entry in CHANGELOG.md
6. Add application link to README.md
7. Commit and push to Git
```

### Record Infrastructure Change

```bash
# Edit CHANGELOG.md
# Add entry with: Date, Author, Category, Title, Description, Affected Systems, Rollback Plan
# Example:
# - Category: Deployment
# - Title: Deployed MyApp v1.0.0
# - Description: New Node.js application deployed with MongoDB
# - Affected Systems: Backend, Database, Nginx
```

### Update Security Status

```bash
# Edit SECURITY-CHECKLIST.md
# 1. Run through checklist quarterly
# 2. Mark completed items
# 3. Document any issues
# 4. Add changelog entry if changes made
```

### Test Disaster Recovery

```bash
# Monthly procedure:
# 1. Run backup: /usr/local/bin/backup-all.sh
# 2. Test restore from backup
# 3. Verify application works after restore
# 4. Document test results
# 5. Update DISASTER-RECOVERY.md with findings
```

---

## 🔄 Update Workflow

### When Deploying

```bash
# 1. Update application documentation
nano APP-[AppName].md

# 2. Update registries if ports/domains changed
nano PORT-REGISTRY.md
nano DOMAIN-REGISTRY.md

# 3. Add changelog entry
nano CHANGELOG.md

# 4. Commit changes
git add .
git commit -m "Deploy: [AppName] v1.0.0"
git push
```

### When Making Infrastructure Changes

```bash
# 1. Make the change on VPS
sudo [command]

# 2. Document in appropriate file
# - If port change: PORT-REGISTRY.md
# - If SSL/domain: DOMAIN-REGISTRY.md
# - If infrastructure: INFRASTRUCTURE.md
# - Everything else: CHANGELOG.md

# 3. Commit documentation change
git add [modified-files]
git commit -m "Update: [description]"
git push
```

### When Infrastructure Fails

```bash
# 1. Use QUICK-REFERENCE.md to troubleshoot
# 2. Check DISASTER-RECOVERY.md for recovery procedures
# 3. Document what happened and how you fixed it
# 4. Add entry to CHANGELOG.md
# 5. Commit and push
```

---

## 📊 Wiki Statistics

Once populated, your wiki will track:

- **5+ Applications** with complete documentation
- **15+ Ports** with allocation and usage
- **5+ Domains** with SSL and DNS status
- **100+ Change Log Entries** over time
- **16 Security Checklist Items** to verify
- **6 Disaster Recovery Scenarios** ready to execute

---

## 🔐 Important: Keep Secrets Secure

### ✅ SAFE to commit to Git:
- Architecture diagrams
- Process documentation
- Nginx configuration (without secrets)
- Port mappings
- DNS records (if using DNS provider)
- General procedures

### ❌ NEVER commit to Git:
- Passwords
- API keys
- Private SSH keys
- Database credentials
- JWT secrets
- Any `.env` files with real values

### How to Handle Secrets:

```bash
# Reference secret in documentation WITHOUT THE VALUE
# Example (GOOD):
JWT_SECRET=[See 1Password vault]
MONGODB_PASSWORD=[Stored in secure location]

# Example (BAD - DO NOT DO):
JWT_SECRET=abc123defg456
MONGODB_PASSWORD=MyPassword123

# Use .env.example instead:
cp .env .env.example
# Remove all values from .env.example
nano .env.example
# Commit .env.example but NOT .env
```

---

## 📅 Wiki Maintenance Schedule

### Daily
- Monitor application health (reference from QUICK-REFERENCE.md)
- Check logs for errors

### Weekly
- Verify latest backup completed (see DISASTER-RECOVERY.md)
- Review system resources (disk, memory, CPU)

### Monthly
- Test disaster recovery procedure
- Security checklist review
- Update CHANGELOG.md with recent changes

### Quarterly
- Full security audit (SECURITY-CHECKLIST.md)
- Review and update INFRASTRUCTURE.md
- Review PORT-REGISTRY.md and DOMAIN-REGISTRY.md

### Annually
- External security penetration testing
- Archive old documentation
- Update all contact information

---

## 💡 Pro Tips

### 1. Keep Wiki in Version Control
```bash
# Every change is tracked
git log --oneline
git show [commit-hash]
```

### 2. Use Wiki as Deployment Checklist
Print [APP-TEMPLATE.md](APP-TEMPLATE.md) when deploying new apps.

### 3. Set Calendar Reminders
- Monthly: Test backup restore (every 1st Monday)
- Quarterly: Security audit (every first day of quarter)
- Annually: Penetration testing

### 4. Create Team Notifications
```bash
#!/bin/bash
# Send wiki update to team
mail -s "Wiki Updated: $1" team@company.com << EOF
Check latest documentation update:
https://github.com/yourorg/wiki/commit/[latest-commit]
EOF
```

### 5. Generate PDF for Printing
```bash
# Using pandoc to convert to PDF
pandoc README.md -o wiki.pdf
pandoc QUICK-REFERENCE.md -o quick-ref.pdf
```

---

## 🔗 Integration with Other Tools

### GitHub Wiki
Push this wiki to GitHub and enable GitHub Wiki feature for web viewing.

### GitHub Projects
Track application deployments as GitHub issues/projects.

### GitHub Actions
Use wiki as documentation for CI/CD workflows.

### Slack Integration
Post wiki updates to Slack channel:
```bash
# Add to post-commit hook
curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"Wiki updated: $1\"}" \
  $SLACK_WEBHOOK_URL
```

### Status Page
Link to wiki from status page for transparency.

---

## 📱 Mobile Access

Keep documentation accessible on mobile:

### Option 1: GitHub Mobile App
- View wiki in GitHub mobile app
- Get notifications on updates

### Option 2: Google Drive
- Upload markdown as Google Docs
- Share with team
- Access anywhere

### Option 3: Notion
- Import markdown to Notion
- Create collaborative workspace
- Share links

---

## 🎓 Team Onboarding

Use this wiki to onboard new team members:

1. **Day 1:** Provide access to wiki
2. **Week 1:** Have new member read:
   - README.md
   - QUICK-REFERENCE.md
   - APP-TEMPLATE.md
3. **Week 2:** Have new member review:
   - INFRASTRUCTURE.md
   - SECURITY-CHECKLIST.md
4. **Week 3:** Walk through deployment procedure using APP documentation

### Create Onboarding Checklist
```
New Team Member Onboarding:
- [ ] Read README.md
- [ ] Read QUICK-REFERENCE.md
- [ ] SSH access configured
- [ ] Can view logs: pm2 logs, docker logs
- [ ] Reviewed SECURITY-CHECKLIST.md
- [ ] Shadowed deployment process
- [ ] Performed test deployment
- [ ] Reviewed disaster recovery procedure
```

---

## 🚨 Emergency Mode

If critical incident occurs:

1. **Use QUICK-REFERENCE.md** for immediate troubleshooting
2. **Check DISASTER-RECOVERY.md** for recovery procedures
3. **Reference CHANGELOG.md** to see similar incidents
4. **Follow SECURITY-CHECKLIST.md** to verify system integrity
5. **Document incident** with full details in CHANGELOG.md

---

## 📈 Growth Path

Your wiki will grow with:

| Month | Additions |
|-------|-----------|
| Month 1 | 1-2 applications, basic infrastructure |
| Month 3 | 5+ applications, security procedures established |
| Month 6 | 10+ applications, full automation setup |
| Year 1 | Complete infrastructure documentation, proven disaster recovery |

---

## ❓ Common Questions

### Q: How often should I update the wiki?
**A:** As needed when infrastructure changes. At minimum: weekly review, monthly full update.

### Q: Can I share this with the team?
**A:** Yes! Push to GitHub and share the repository. Use appropriate access controls.

### Q: What if I make a mistake in documentation?
**A:** That's normal! Git tracks all changes. Use `git log` to see history and `git revert` if needed.

### Q: How do I handle outdated information?
**A:** Mark as deprecated in CHANGELOG.md. Don't delete history—mark it as deprecated or archived.

### Q: Should I keep this updated when busy?
**A:** Yes! Outdated documentation is worse than no documentation. Set 30-minute weekly review window.

---

## 🎯 Next Steps

1. ✅ **Complete INFRASTRUCTURE.md** - Add your VPS details
2. ✅ **Complete PORT-REGISTRY.md** - Document current ports
3. ✅ **Complete DOMAIN-REGISTRY.md** - Document current domains
4. ✅ **Create first APP file** - APP-[YourApp].md from template
5. ✅ **Set up automated backups** - Follow DISASTER-RECOVERY.md
6. ✅ **Run security audit** - Follow SECURITY-CHECKLIST.md
7. ✅ **Push to GitHub** - Make it version controlled
8. ✅ **Set calendar reminders** - Monthly, quarterly, annually

---

## 📞 Support

For questions or improvements:

1. Review other wiki files for similar documented procedures
2. Check QUICK-REFERENCE.md for commands
3. Search CHANGELOG.md for similar situations
4. Consult external documentation links in README.md

---

## 📄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-06-25 | Initial wiki creation |

---

**Welcome to your production deployment wiki!**

This is your private infrastructure encyclopedia. Keep it updated, keep it secure, and it will be invaluable during deployments and emergencies.

Good luck! 🚀

---

**Started:** 2026-06-25  
**Status:** Ready for first deployment  
**Owner:** DevOps Team  
**Backup Location:** [To be configured]
