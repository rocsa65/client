# GitHub Actions CI/CD Pipeline Setup

This repository uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD) across three environments:

- **Development**: Automatic deployments on pushes to `development` branch
- **Staging**: Automatic deployments on pushes to `staging` branch  
- **Production**: Automatic deployments on pushes to `production` branch

## 🚀 Pipeline Overview

### Development Pipeline (`development.yml`)
- **Triggers**: Push to `development` branch, PRs to `development`
- **Steps**:
  - Run tests with coverage
  - Build application
  - Build and push Docker image
  - Deploy to development environment
- **Focus**: Fast feedback, basic quality checks

### Staging Pipeline (`staging.yml`)
- **Triggers**: Push to `staging` branch
- **Steps**:
  - Run full test suite including E2E tests
  - Security scanning (npm audit + Snyk)
  - Build application
  - Build and push Docker image
  - Deploy to staging environment
  - Run smoke tests
  - Team notifications
- **Focus**: Quality assurance, security, pre-production validation

### Production Pipeline (`production.yml`)
- **Triggers**: Push to `production` branch, manual trigger
- **Steps**:
  - Comprehensive pre-deployment checks
  - Security audits
  - Build with production optimizations
  - Build and push Docker image with versioning
  - Deploy to production with approval gates
  - Health checks and smoke tests
  - Create GitHub release
  - Team notifications
- **Focus**: Maximum safety, monitoring, rollback capabilities

## 📋 Required Secrets

Add these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Docker Registry (Not Needed - Using GitHub Container Registry)
```
# No secrets needed - using GITHUB_TOKEN automatically
# DOCKER_USERNAME=your-dockerhub-username
# DOCKER_PASSWORD=your-dockerhub-password-or-token
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

### Security (Optional)
```
# Removed SNYK_TOKEN - using npm audit instead
# Add SNYK_TOKEN=your-snyk-token if you want advanced security scanning
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

## 📱 Workflow Usage

### Development Workflow (with Branch Protection)
```bash
# Feature development - CANNOT push directly to development
git checkout development
git pull origin development
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "Add new feature"
git push -u origin feature/new-feature

# Create PR to development branch (REQUIRED)
# 1. Go to GitHub and create Pull Request
# 2. Ensure CI checks pass
# 3. Self-review and merge PR (development pipeline runs automatically)
```

### Staging Workflow (with Branch Protection)
```bash
# Promote development to staging - CANNOT push directly
git checkout development
git pull origin development
git checkout -b promote/dev-to-staging
git checkout staging
git pull origin staging
git checkout promote/dev-to-staging
git merge development
git push -u origin promote/dev-to-staging

# Create PR from promote/dev-to-staging to staging (REQUIRED)
# 1. Create Pull Request on GitHub
# 2. Ensure CI checks pass
# 3. Self-review and merge PR (staging pipeline runs automatically)
```

### Production Workflow (with Branch Protection)
```bash
# Promote staging to production - CANNOT push directly  
git checkout staging
git pull origin staging
git checkout -b promote/staging-to-prod
git checkout production
git pull origin production
git checkout promote/staging-to-prod
git merge production
git merge staging
git push -u origin promote/staging-to-prod

# Create PR from promote/staging-to-prod to production (REQUIRED)
# 1. Create Pull Request on GitHub
# 2. Ensure all checks pass
# 3. Self-review and merge PR (production pipeline runs with approval gates)
```

### Emergency Hotfix Workflow
```bash
# For urgent production fixes
git checkout production
git pull origin production
git checkout -b hotfix/critical-fix
# ... make minimal fix ...
git add .
git commit -m "Fix critical issue"
git push -u origin hotfix/critical-fix

# Create PR to production (expedited review)
# Self-review and merge for urgent fixes
```

## 🔍 Monitoring and Troubleshooting

### Pipeline Status
- Check pipeline status in the `Actions` tab
- Each environment has different success criteria
- Failed pipelines prevent deployment

### Logs and Artifacts
- Build artifacts are stored for different periods:
  - Development: 7 days
  - Staging: 30 days
  - Production: 90 days

### Rollback Strategy
- Use GitHub releases for production rollbacks
- Docker images are tagged with commit SHA and version numbers
- Manual rollback: deploy previous known-good image

## 🛠️ Customization

### Adding New Steps
1. Edit the appropriate workflow file in `.github/workflows/`
2. Follow the existing job structure
3. Test in development first

### Environment Variables
Add environment-specific variables in:
- Workflow files (`env` section)
- GitHub repository secrets
- Environment-specific secrets

### Deployment Targets
Update deployment steps based on your infrastructure:
- Kubernetes clusters
- Cloud services (AWS, Azure, GCP)
- Traditional servers
- Serverless platforms

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Environment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Docker Build and Push Action](https://github.com/docker/build-push-action)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)