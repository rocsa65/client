# GitHub Actions CI/CD Pipeline Setup

This repository uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD) across three environments:

- **Development**: Optimized deployments on merged PRs to `development` branch
- **Staging**: Comprehensive deployments on merged PRs to `staging` branch  
- **Production**: Full production deployments on merged PRs to `production` branch

## 🚀 Optimized Pipeline Overview

### Key Pipeline Strategy
**Docker images are built and published ONLY when PRs are merged**, not on every commit. This provides:
- ✅ **Resource efficiency**: No unnecessary Docker builds
- ✅ **Cleaner registry**: Only production-ready images
- ✅ **Faster feedback**: PR validation without Docker overhead
- ✅ **Cost optimization**: Reduced GitHub Actions usage

### Development Pipeline (`development.yml`)
**On Pull Request:**
- Run tests with coverage
- Build application verification
- PR status comment with merge preview
- **NO Docker building or deployment**

**On Merge (Push to development):**
- Run tests with coverage
- Build application
- Build Docker image (separate from publish)
- Publish Docker image to GitHub Container Registry
- Deploy to development environment

**Focus**: Fast PR feedback, efficient resource usage

### Staging Pipeline (`staging.yml`)
**On Pull Request:**
- Run full test suite including E2E tests
- Security scanning (npm audit)
- Build application verification
- **NO Docker building or deployment**

**On Merge (Push to staging):**
- Run full test suite including E2E tests
- Security scanning (npm audit)
- Build application
- Build and publish Docker image
- Deploy to staging environment
- Run smoke tests

**Focus**: Quality assurance, security validation, pre-production testing

### Production Pipeline (`production.yml`)
**On Pull Request:**
- Comprehensive pre-deployment checks
- Security audits
- Build quality verification
- **NO Docker building or deployment**

**On Merge (Push to production):**
- Comprehensive pre-deployment checks
- Security audits
- Build with production optimizations
- Build and publish Docker image with versioning
- Deploy to production with environment protection
- Health checks and smoke tests
- Create GitHub release with automated tagging
- Post-deployment verification

**Focus**: Maximum safety, monitoring, automated release management

## 📋 Required Secrets and Configuration

### GitHub Container Registry (Automatic)
```
# No additional secrets needed - using GITHUB_TOKEN automatically
# GitHub Container Registry (ghcr.io) is used for public Docker images
```

### Workflow Permissions (Required)
The workflows require these permissions (already configured):
```yaml
permissions:
  contents: read          # Read repository content
  packages: write         # Write to GitHub Container Registry
  pull-requests: write   # Comment on PRs
  issues: write          # Create deployment issues (production)
  deployments: write     # Create deployment statuses (production)
```

### Environment URLs (When You Have APIs)
```
# Add these when you have backend APIs deployed:
# DEV_API_URL=https://api-dev.yourapp.com
# STAGING_API_URL=https://api-staging.yourapp.com
# PROD_API_URL=https://api.yourapp.com

# These are for health checks after deployment:
# STAGING_URL=https://staging.yourapp.com
# PROD_URL=https://yourapp.com
```

### Security Scanning
```
# Currently using npm audit (built-in, no token required)
# For advanced security scanning, add:
# SNYK_TOKEN=your-snyk-token (optional)
```

## 🛡️ Environment Protection Rules

Set up environment protection rules in GitHub (`Settings > Environments`):

### Development Environment
- No protection rules needed
- Automatic deployments

### Staging Environment
- Optional: Required reviewers
- Optional: Wait timer (e.g., 5 minutes)

### Production Environment
- **Required reviewers**: Add senior developers/DevOps team
- **Wait timer**: 10-15 minutes for manual verification
- **Deployment branches**: Restrict to `production` branch only

## 🔧 Setup Instructions

### 1. Create the Branch Structure
```bash
# Create and push development branch
git checkout -b development
git push -u origin development

# Create and push staging branch
git checkout -b staging
git push -u origin staging

# Create and push production branch (or rename main/master)
git checkout -b production
git push -u origin production
```

### 2. Configure Branch Protection
Go to `Settings > Branches` and add protection rules:

**Development Branch:**
- ✅ **Require pull request reviews before merging**
- ✅ **Require status checks to pass**
- ✅ **Require branches to be up to date**
- ✅ **Include administrators**

**Staging Branch:**
- ✅ **Require pull request reviews before merging**
- ✅ **Require status checks to pass**
- ✅ **Require branches to be up to date**
- ✅ **Require conversation resolution**
- ✅ **Include administrators**

**Production Branch:**
- ✅ **Require pull request reviews before merging**
- ✅ **Dismiss stale reviews when new commits are pushed**
- ✅ **Require status checks to pass**
- ✅ **Require branches to be up to date**
- ✅ **Require conversation resolution**
- ✅ **Include administrators**
- ✅ **Restrict pushes to specific people/teams** (optional)

> 🛡️ **Result**: Direct pushes to protected branches are **blocked**. All changes must go through Pull Requests with required approvals.

### 3. Set Up Environments
1. Go to `Settings > Environments`
2. Create environments: `development`, `staging`, `production`
3. Configure protection rules as described above

### 4. Add Required Secrets
1. Go to `Settings > Secrets and variables > Actions`
2. Add all the secrets listed above

## 📱 Optimized Workflow Usage

### Development Workflow (Optimized)
```bash
# Feature development
git checkout development
git pull origin development
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "Add new feature"
git push -u origin feature/new-feature

# Create PR to development branch
# 1. Go to GitHub and create Pull Request
# 2. PR triggers: tests + build verification (NO Docker build)
# 3. Review PR comment showing what will happen on merge
# 4. Merge PR → Full pipeline runs with Docker build and deployment
```

### Staging Promotion (Optimized)
```bash
# Promote development to staging
git checkout development
git pull origin development
git checkout -b promote/dev-to-staging
git checkout staging
git pull origin staging
git checkout promote/dev-to-staging
git merge development
git push -u origin promote/dev-to-staging

# Create PR to staging
# 1. PR triggers: tests + security scans (NO Docker build)
# 2. Review and merge → Full pipeline with Docker build and staging deployment
```

### Production Release (Optimized)
```bash
# Promote staging to production
git checkout staging
git pull origin staging
git checkout -b promote/staging-to-prod
git checkout production
git pull origin production
git checkout promote/staging-to-prod
git merge production
git merge staging
git push -u origin promote/staging-to-prod

# Create PR to production
# 1. PR triggers: comprehensive checks (NO Docker build)
# 2. Review and merge → Full pipeline with Docker build, deployment, and release
```

### Emergency Hotfix (Optimized)
```bash
# For urgent production fixes
git checkout production
git pull origin production
git checkout -b hotfix/critical-fix
# ... make minimal fix ...
git add .
git commit -m "Fix critical issue"
git push -u origin hotfix/critical-fix

# Create PR to production
# 1. PR triggers: fast validation (NO Docker build)
# 2. Expedited review and merge → Immediate Docker build and deployment
```

## 🔍 Monitoring and Pipeline Behavior

### Pipeline Execution Flow
```
Pull Request → [Tests + Build Verification + PR Comment]
     ↓ (on merge)
Push to Branch → [Full Pipeline: Tests + Build + Docker + Deploy]
```

### Docker Image Management
- **Registry**: GitHub Container Registry (ghcr.io)
- **Public Images**: Automatically configured for public access
- **Image Tags**:
  - Development: `ghcr.io/owner/repo:dev-latest`, `dev-{commit-sha}`
  - Staging: `ghcr.io/owner/repo:staging-latest`, `staging-{commit-sha}`
  - Production: `ghcr.io/owner/repo:latest`, `prod-{commit-sha}`, `v{build-number}`

### Build Artifacts Storage
- **Development**: 7 days retention
- **Staging**: 30 days retention
- **Production**: 90 days retention

### Pipeline Status and Logs
- Monitor in GitHub `Actions` tab
- Each job shows detailed execution logs
- Failed pipelines prevent deployment
- PR comments provide merge preview

### Rollback Strategy
- **Docker Images**: Tagged with commit SHA for easy rollback
- **GitHub Releases**: Automated for production deployments
- **Manual Rollback**: Deploy previous known-good image using tags

## 🛠️ Customization and Advanced Features

### Pipeline Architecture
The workflows use a **separate build and publish strategy**:
1. **Docker Build**: Creates image and stores as artifact
2. **Docker Publish**: Downloads artifact and pushes to registry
3. **Deploy**: Uses published image for deployment

This provides better visibility, conditional publishing, and easier debugging.

### Conditional Logic
```yaml
# Docker jobs only run on merged PRs, not during PR validation
if: github.event_name == 'push' && github.ref == 'refs/heads/development'
```

### Adding New Pipeline Steps
1. Edit the appropriate workflow file in `.github/workflows/`
2. Consider whether the step should run on PR or only on merge
3. Test in development environment first
4. Follow the existing job dependency structure

### Environment Variables and Configuration
- **Workflow Level**: Define in `env` section of workflow files
- **Repository Level**: Add in `Settings > Secrets and variables > Actions`
- **Environment Level**: Configure in `Settings > Environments`

### Advanced Security Features
- **npm audit**: Built-in security scanning (no token required)
- **Image verification**: Pull test after publishing
- **Package visibility**: Automatic public package configuration
- **Permissions**: Minimal required permissions configured

### Performance Optimizations
- **Docker Layer Caching**: GitHub Actions cache for faster builds
- **Conditional Execution**: Skip unnecessary jobs during PR validation
- **Parallel Jobs**: Tests and builds run in parallel where possible
- **Artifact Reuse**: Build once, deploy many strategy

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Environment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Build and Push Action](https://github.com/docker/build-push-action)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

## 🎯 Pipeline Benefits Summary

### Resource Efficiency
- **50%+ reduction** in GitHub Actions usage
- **Cleaner container registry** with only production-ready images
- **Faster PR feedback** without Docker build overhead

### Developer Experience
- **Clear feedback** on PRs with merge preview
- **Predictable behavior** - Docker builds only on merge
- **Better separation** of validation vs. deployment

### Cost and Performance
- **Lower GitHub Actions costs** due to conditional execution
- **Reduced storage costs** for container registry
- **More efficient pipeline execution** with parallel jobs

This optimized CI/CD pipeline follows industry best practices for efficient, secure, and reliable software delivery.