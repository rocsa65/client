# GitHub Actions CI/CD Pipeline Setup

This repository uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD) across three environments:

- **Development**: Fast feedback on feature development  
- **Staging**: Comprehensive testing with manual Docker publish approval
- **Production**: Full production deployments with manual Docker publish approval

## 🚀 Pipeline Overview

### Development Pipeline (`development.yml`)

**Triggered on:**
- Push to `development`, `feature/*`, `hotfix/*` branches
- Pull requests to `development` branch

**Pipeline Stages:**
1. **📦 Build Application** - Builds React app and runs security audit
2. **🧪 Unit Tests** - Runs unit tests with code coverage
3. **✅ Build Verification** - Final build verification with artifacts (7-day retention)
4. **💬 PR Feedback** - Updates PR with comprehensive status

**Focus**: Fast feedback for developers, no Docker builds



### Staging Pipeline (`staging.yml`)

**Triggered on:**
- Push to `staging` branch
- Pull requests to `staging` branch

**Pipeline Stages:**
1. **📦 Build Application** - Builds React app and runs security audit
2. **🧪 Unit Tests** - Runs unit tests with code coverage
3. **🔗 Integration Tests** - Runs integration tests with coverage
4. **✅ Build Verification** - Final build verification with artifacts (7-day retention)
5. **⏸️ Docker Publish Approval** - **Manual approval gate** (only on merge)
6. **🐳 Docker Build & Publish** - Builds and publishes to GHCR (only after approval)
7. **� PR Feedback** - Updates PR with comprehensive status

**Docker Tags**: `staging-latest`, `staging-{commit-sha}`

**Focus**: Quality assurance with controlled Docker publishing



### Production Pipeline (`production.yml`)

**Triggered on:**
- Push to `production` branch
- Pull requests to `production` branch
- Manual workflow dispatch

**Pipeline Stages:**
1. **📦 Build Application** - Builds production-ready React app
2. **🧪 Unit Tests** - Runs unit tests with code coverage
3. **🔗 Integration Tests** - Runs comprehensive integration tests
4. **✅ Build Verification** - Final build verification with artifacts (30-day retention)
5. **💬 PR Feedback** - Updates PR with deployment information
6. **⏸️ Docker Publish Approval** - **Manual approval gate** (only on merge)
7. **🐳 Docker Build & Publish** - Builds and publishes with versioning (only after approval)

**Docker Tags**: `latest`, `v{build-number}`, `{commit-sha}`, `prod-{timestamp}`

**Focus**: Maximum safety with manual control over Docker publishing



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

## � Required Setup

### 1. Environment Configuration

Create two environments in GitHub (`Settings > Environments`):

**staging-docker-publish**
- Required reviewers: Add team members who should approve staging Docker builds
- Wait timer: 1 minute minimum (GitHub requirement)
- Deployment branches: Restrict to `staging` branch only

**production-docker-publish**
- Required reviewers: Add senior developers/DevOps team
- Wait timer: 1 minute minimum
- Deployment branches: Restrict to `production` branch only

> ⚠️ **Important**: Without environment protection rules, Docker build stage will wait indefinitely for approval!

### 2. Workflow Permissions

The workflows require these permissions (already configured):

```yaml
permissions:
  contents: read          # Read repository content
  packages: write         # Write to GitHub Container Registry
  pull-requests: write   # Comment on PRs
```

### 3. Branch Protection Rules

Go to `Settings > Branches` and add protection rules:

**Development Branch:**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date

**Staging Branch:**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require conversation resolution

**Production Branch:**
- ✅ Require pull request reviews before merging (2+ reviewers recommended)
- ✅ Dismiss stale reviews when new commits are pushed
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ✅ Include administrators

## 🐳 Container Registry

### GitHub Container Registry (GHCR)
- **Registry**: `ghcr.io`
- **Authentication**: Uses `GITHUB_TOKEN` automatically
- **Visibility**: Public packages (configured automatically)
- **Access**: Available at `https://github.com/OWNER/REPO/pkgs/container/PACKAGE`

### Image Tagging Strategy
```
Staging:     ghcr.io/owner/repo:staging-latest, staging-{commit-sha}
Production:  ghcr.io/owner/repo:latest, v{build-number}, {commit-sha}, prod-{timestamp}
```

## 🚀 Workflow Usage

### Feature Development
```bash
# Create feature branch from development
git checkout development
git pull origin development
git checkout -b feature/new-feature

# Make changes, test locally
npm test
npm run build

# Commit and push
git add .
git commit -m "feat: add new feature"
git push -u origin feature/new-feature

# Create PR to development
# Pipeline runs: Build → Unit Tests → Build Verification → PR Feedback
# NO Docker build during PR validation
```

### Staging Promotion
```bash
# Create PR from development to staging
git checkout development
git pull origin development
git checkout -b promote/dev-to-staging
git checkout staging
git pull origin staging
git checkout promote/dev-to-staging
git merge development
git push -u origin promote/dev-to-staging

# Create PR to staging
# After merge, pipeline runs and waits at Docker Publish Approval stage
# Go to Actions tab → Click "Review deployments" → Approve
# Docker image is built and published to GHCR
```

### Production Release
```bash
# Create PR from staging to production
git checkout staging
git pull origin staging
git checkout -b promote/staging-to-prod
git checkout production
git pull origin production
git checkout promote/staging-to-prod
git merge staging
git push -u origin promote/staging-to-prod

# Create PR to production
# After merge, pipeline runs and waits at Docker Publish Approval stage
# Go to Actions tab → Click "Review deployments" → Approve
# Docker image is built, published, and tagged with multiple versions
```

## ⏸️ Manual Docker Publish Approval

### How It Works

1. **PR Validation**: When you create a PR, only tests and build verification run
2. **Merge to Branch**: After merge, pipeline runs all stages
3. **Approval Gate**: Pipeline pauses at "Docker Publish Approval" stage
4. **Review Button**: In GitHub Actions UI, you'll see a "Review deployments" button
5. **Approve**: Click button, review, and approve to proceed
6. **Docker Build**: After approval, Docker image is built and published

### Approval Process

**In GitHub Actions UI:**
```
1. Go to Actions tab
2. Click on the running workflow
3. See "Docker Publish Approval" job waiting
4. Click "Review deployments" button
5. Review details
6. Click "Approve and deploy"
7. Docker build proceeds automatically
```

### Who Can Approve?

- Users/teams configured as "Required reviewers" in environment settings
- Anyone with write access (if using wait timer without required reviewers)

## 📊 Pipeline Benefits

### Resource Efficiency
- **No unnecessary Docker builds** during PR validation
- **Manual control** over when Docker images are published
- **Cleaner registry** with only approved, production-ready images

### Security & Control
- **Explicit approval required** before publishing Docker images
- **Audit trail** of who approved each Docker publish
- **Prevent accidental publishes** from untested code

### Developer Experience  
- **Fast PR feedback** (2-3 minutes) without waiting for Docker builds
- **Clear separation** between validation and deployment
- **Predictable workflow** - know when Docker builds will occur

## 🔍 Monitoring

### Pipeline Status
- Monitor in GitHub `Actions` tab
- Each stage shows detailed execution logs
- Failed stages prevent progression
- PR comments provide comprehensive status updates

### Build Artifacts
- **Development**: 7 days retention
- **Staging**: 7 days retention  
- **Production**: 30 days retention

### Docker Images
- Available at GitHub Packages
- Tagged with commit SHA for rollback capability
- Public access configured automatically
- Clickable links in pipeline summary

## 🛡️ Security Features

### Automated Security
- **npm audit**: Dependency vulnerability scanning
- **Package visibility**: Controlled public access
- **Minimal permissions**: Only required permissions granted
- **Environment protection**: Manual approval for critical stages

### Best Practices
- All dependencies scanned before Docker build
- Docker images use optimized Nginx base
- No secrets in Docker images
- Environment-specific configurations managed securely

## 📚 Customization

### Adding New Pipeline Steps

1. Edit the appropriate workflow file in `.github/workflows/`
2. Consider stage placement (before or after approval)
3. Test in development environment first
4. Follow existing job dependency structure

### Environment Variables
- **Workflow level**: Define in `env` section of workflow files
- **Repository level**: Add in `Settings > Secrets and variables > Actions`
- **Environment level**: Configure in `Settings > Environments`

## 🎯 Current Status

### ✅ Implemented
- Multi-stage pipeline architecture
- Manual Docker publish approval gates
- Automated testing in all environments
- GitHub Container Registry integration
- Comprehensive PR feedback with update/create logic
- Clickable links to Docker images and commits

### 🔄 Available Enhancements
- Health check endpoints after deployment
- Blue-green deployments
- Advanced monitoring and alerting
- Infrastructure as Code integration
- Multi-region deployments

---

This CI/CD setup provides a solid foundation for reliable, controlled software delivery with explicit approval gates for critical deployment stages.