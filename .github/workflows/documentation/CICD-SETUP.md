# GitHub Actions CI/CD Pipeline Setup# GitHub Actions CI/CD Pipeline Setup



This repository uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD) across three environments.This repository uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD) across three environments:



## 🚀 Current Implementation- **Development**: Optimized deployments on merged PRs to `development` branch

- **Staging**: Comprehensive deployments on merged PRs to `staging` branch  

### Three-Branch Strategy- **Production**: Full production deployments on merged PRs to `production` branch

- **development**: Feature development and testing

- **staging**: Pre-production testing and integration  ## 🚀 Optimized Pipeline Overview

- **production**: Live production releases

### Key Pipeline Strategy

### Pipeline Architecture**Docker images are built and published ONLY when PRs are merged**, not on every commit. This provides:

**Docker images are built and published ONLY when PRs are merged**, providing:- ✅ **Resource efficiency**: No unnecessary Docker builds

- ✅ **Resource efficiency**: No unnecessary Docker builds during PR validation- ✅ **Cleaner registry**: Only production-ready images

- ✅ **Cleaner registry**: Only production-ready images- ✅ **Faster feedback**: PR validation without Docker overhead

- ✅ **Faster feedback**: Quick PR validation without Docker overhead- ✅ **Cost optimization**: Reduced GitHub Actions usage

- ✅ **Cost optimization**: Reduced GitHub Actions usage

### Development Pipeline (`development.yml`)

## 📋 Current Pipeline Stages**On Pull Request:**

- Run tests with coverage

### Development Pipeline (`development.yml`)- Build application verification

**On Pull Request:**- PR status comment with merge preview

- Run unit tests with coverage- **NO Docker building or deployment**

- Build application verification

- PR status check**On Merge (Push to development):**

- Run tests with coverage

**On Merge to development:**- Build application

- Run unit tests with coverage- Build Docker image (separate from publish)

- Build application- Publish Docker image to GitHub Container Registry

- Build Docker image- Deploy to development environment

- Publish to GitHub Container Registry (`dev-latest`, `dev-{commit}`)

**Focus**: Fast PR feedback, efficient resource usage

### Staging Pipeline (`staging.yml`)  

**On Pull Request:**### Staging Pipeline (`staging.yml`)

- Run unit and integration tests**On Pull Request:**

- Security scanning (npm audit)- Run full test suite including E2E tests

- Build verification- Security scanning (npm audit)

- Build application verification

**On Merge to staging:**- **NO Docker building or deployment**

- Run unit and integration tests

- Security scanning (npm audit)**On Merge (Push to staging):**

- Build application- Run full test suite including E2E tests

- Build and publish Docker image (`staging-latest`, `staging-{commit}`)- Security scanning (npm audit)

- Build application

### Production Pipeline (`production.yml`)- Build and publish Docker image

**On Pull Request:**- Deploy to staging environment

- Comprehensive testing (unit + integration)- Run smoke tests

- Security audits

- Build quality verification**Focus**: Quality assurance, security validation, pre-production testing



**On Merge to production:**### Production Pipeline (`production.yml`)

- Comprehensive testing**On Pull Request:**

- Security audits- Comprehensive pre-deployment checks

- Production build- Security audits

- Build and publish Docker image (`latest`, `prod-{commit}`, `v{build}`)- Build quality verification

- Create GitHub release- **NO Docker building or deployment**



## 🔧 Setup Requirements**On Merge (Push to production):**

- Comprehensive pre-deployment checks

### Repository Settings- Security audits

Required permissions in GitHub Actions:- Build with production optimizations

```yaml- Build and publish Docker image with versioning

permissions:- Deploy to production with environment protection

  contents: read          # Read repository content- Health checks and smoke tests

  packages: write         # Write to GitHub Container Registry- Create GitHub release with automated tagging

  pull-requests: write   # Comment on PRs- Post-deployment verification

```

**Focus**: Maximum safety, monitoring, automated release management

### Branch Protection Rules

Set up protection for all three branches:## 📋 Required Secrets and Configuration

- Require pull request reviews

- Require status checks to pass### GitHub Container Registry (Automatic)

- Require branches to be up to date```

- Include administrators# No additional secrets needed - using GITHUB_TOKEN automatically

# GitHub Container Registry (ghcr.io) is used for public Docker images

### Environment Configuration```

1. Go to `Settings > Environments`

2. Create environments: `development`, `staging`, `production`### Workflow Permissions (Required)

3. Add protection rules for staging/production as neededThe workflows require these permissions (already configured):

```yaml

## 🐳 Container Registrypermissions:

  contents: read          # Read repository content

### GitHub Container Registry (GHCR)  packages: write         # Write to GitHub Container Registry

- **Registry**: `ghcr.io`  pull-requests: write   # Comment on PRs

- **Authentication**: Uses `GITHUB_TOKEN` automatically  issues: write          # Create deployment issues (production)

- **Visibility**: Public packages (configurable)  deployments: write     # Create deployment statuses (production)

```

### Image Tagging Strategy

```### Environment URLs (When You Have APIs)

Development: ghcr.io/owner/repo:dev-latest, dev-{commit-sha}```

Staging:     ghcr.io/owner/repo:staging-latest, staging-{commit-sha}  # Add these when you have backend APIs deployed:

Production:  ghcr.io/owner/repo:latest, prod-{commit-sha}, v{build-number}# DEV_API_URL=https://api-dev.yourapp.com

```# STAGING_API_URL=https://api-staging.yourapp.com

# PROD_API_URL=https://api.yourapp.com

## 🚀 Workflow Usage

# These are for health checks after deployment:

### Feature Development# STAGING_URL=https://staging.yourapp.com

```bash# PROD_URL=https://yourapp.com

# Create feature branch```

git checkout -b feature/new-feature development

# Make changes, commit, push### Security Scanning

git push -u origin feature/new-feature```

# Create PR to development → triggers tests only# Currently using npm audit (built-in, no token required)

```# For advanced security scanning, add:

# SNYK_TOKEN=your-snyk-token (optional)

### Staging Promotion```

```bash

# Create PR from development to staging## 🛡️ Environment Protection Rules

# Merge → triggers full staging pipeline with Docker build

```Set up environment protection rules in GitHub (`Settings > Environments`):



### Production Release### Development Environment

```bash- No protection rules needed

# Create PR from staging to production  - Automatic deployments

# Merge → triggers production pipeline with release creation

```### Staging Environment

- Optional: Required reviewers

## 📊 Pipeline Benefits- Optional: Wait timer (e.g., 5 minutes)



### Performance Metrics### Production Environment

- **Development PRs**: ~2 minutes (tests only)- **Required reviewers**: Add senior developers/DevOps team

- **Staging Pipeline**: ~5 minutes (tests + Docker build)- **Wait timer**: 10-15 minutes for manual verification

- **Production Pipeline**: ~7 minutes (full validation + release)- **Deployment branches**: Restrict to `production` branch only



### Resource Efficiency## 🔧 Setup Instructions

- 50%+ reduction in GitHub Actions usage

- Faster developer feedback loop### 1. Create the Branch Structure

- Cleaner container registry```bash

- Strategic resource allocation# Create and push development branch

git checkout -b development

## 🔍 Monitoringgit push -u origin development



### Pipeline Status# Create and push staging branch

- Monitor in GitHub Actions tabgit checkout -b staging

- Each job shows detailed execution logsgit push -u origin staging

- Failed pipelines prevent deployment

- PR status checks provide clear feedback# Create and push production branch (or rename main/master)

git checkout -b production

### Artifactsgit push -u origin production

- **Development**: 7 days retention```

- **Staging**: 30 days retention

- **Production**: 90 days retention### 2. Configure Branch Protection

Go to `Settings > Branches` and add protection rules:

### Docker Images

- Available at GitHub Packages**Development Branch:**

- Public access configured- ✅ **Require pull request reviews before merging**

- Tagged with commit SHA for rollback- ✅ **Require status checks to pass**

- ✅ **Require branches to be up to date**

## 🛡️ Security Features- ✅ **Include administrators**



### Automated Security**Staging Branch:**

- **npm audit**: Dependency vulnerability scanning- ✅ **Require pull request reviews before merging**

- **Package visibility**: Controlled public access- ✅ **Require status checks to pass**

- **Permissions**: Minimal required permissions- ✅ **Require branches to be up to date**

- **Environment protection**: Required reviews for production- ✅ **Require conversation resolution**

- ✅ **Include administrators**

### Best Practices

- All external dependencies are scanned**Production Branch:**

- Docker images use minimal base images- ✅ **Require pull request reviews before merging**

- No secrets in Docker images- ✅ **Dismiss stale reviews when new commits are pushed**

- Environment-specific configurations- ✅ **Require status checks to pass**

- ✅ **Require branches to be up to date**

## 📚 Customization- ✅ **Require conversation resolution**

- ✅ **Include administrators**

### Adding New Steps- ✅ **Restrict pushes to specific people/teams** (optional)

1. Edit appropriate workflow file in `.github/workflows/`

2. Consider whether step should run on PR or only on merge> 🛡️ **Result**: Direct pushes to protected branches are **blocked**. All changes must go through Pull Requests with required approvals.

3. Test in development environment first

4. Follow existing job dependency structure### 3. Set Up Environments

1. Go to `Settings > Environments`

### Environment Variables2. Create environments: `development`, `staging`, `production`

- **Workflow level**: Define in `env` section3. Configure protection rules as described above

- **Repository level**: Add in Settings > Secrets

- **Environment level**: Configure in Environment settings### 4. Add Required Secrets

1. Go to `Settings > Secrets and variables > Actions`

## 🎯 Current Status2. Add all the secrets listed above



### ✅ Implemented## 📱 Optimized Workflow Usage

- Three-branch CI/CD strategy

- Automated testing in pipelines### Development Workflow (Optimized)

- Docker containerization```bash

- GitHub Container Registry integration# Feature development

- Automated releases for productiongit checkout development

git pull origin development

### 🔄 Available Enhancementsgit checkout -b feature/new-feature

- Health check endpoints# ... make changes ...

- Blue-green deploymentsgit add .

- Advanced monitoringgit commit -m "Add new feature"

- Infrastructure as Codegit push -u origin feature/new-feature

- Multi-stage deployments

# Create PR to development branch

This CI/CD setup provides a solid foundation for reliable, automated software delivery with room for future enhancements as the project grows.# 1. Go to GitHub and create Pull Request
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