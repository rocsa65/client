# GitHub Actions CI/CD Pipeline Setup

This repository uses GitHub Actions for Continuous Integration (CI) and Docker image publishing across three environments:

- **Development**: Fast feedback on feature development  
- **Staging**: Comprehensive testing with manual Docker publish approval
- **Production**: Full testing with manual Docker publish approval

**Note**: This pipeline focuses on building, testing, and publishing Docker images. **Deployment is handled separately by the MyFinance-Infrastructure repository**, which pulls these images and deploys them to the appropriate environments.

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
6. **🐳 Docker Build & Publish** - Builds and publishes to GHCR for backup/versioning (only after approval)
7. **💬 PR Feedback** - Updates PR with comprehensive status

**Docker Tags**: `staging-latest`, `staging-{commit-sha}`

**Focus**: Quality assurance with controlled Docker image publishing for backup purposes



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
5. **💬 PR Feedback** - Updates PR with image information
6. **⏸️ Docker Publish Approval** - **Manual approval gate** (only on merge)
7. **🐳 Docker Build & Publish** - Builds and publishes with versioning for backup (only after approval)

**Docker Tags**: `latest`, `v{build-number}`, `{commit-sha}`, `prod-{timestamp}`

**Focus**: Maximum safety with manual control over Docker image publishing

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
# 4. Merge PR → Full pipeline runs (tests + build verification)
# Note: Docker images published for backup purposes only
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
# 2. Review and merge → Full pipeline with Docker image build and publish to GHCR
# 3. MyFinance-Infrastructure pipeline handles actual deployment using published image
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
# 2. Review and merge → Full pipeline with Docker image build and publish to GHCR
# 3. MyFinance-Infrastructure pipeline handles actual deployment using published image
```

### Emergency Hotfix (Optimized)
```bash
# For urgent production fixes
git checkout staging
git pull origin staging
git checkout -b hotfix/critical-fix
# ... make minimal fix ...
git add .
git commit -m "Fix critical issue"
git push -u origin hotfix/critical-fix

# Create PR to staging
# 1. PR triggers: fast validation (NO Docker build)
# 2. Expedited review and merge → Staging pipeline builds and publishes Docker image
# 3. MyFinance-Infrastructure pipeline handles actual deployment to staging and production
```

## 🔍 Monitoring and Pipeline Behavior

### Pipeline Execution Flow
```
Pull Request → [Tests + Build Verification + PR Comment]
     ↓ (on merge)
Push to Branch → [Full Pipeline: Tests + Build + Docker Publish to GHCR (optional)]
```

Note: The client repository only builds and publishes Docker images. Deployment is handled by the MyFinance-Infrastructure repository.

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
- Failed pipelines prevent Docker image publishing
- PR comments provide merge preview

### Deployment Process
- **Client Repository**: Builds, tests, and publishes Docker images to GHCR
- **Infrastructure Repository**: Pulls images from GHCR and deploys to environments
- **Separation of Concerns**: Code changes are independent from deployment operations

### Rollback Strategy
- **Docker Images**: Tagged with commit SHA for easy rollback
- **GitHub Releases**: Automated for production deployments
- **Manual Rollback**: Deploy previous known-good image using tags

## 🛠️ Customization and Advanced Features

### Pipeline Architecture
The workflows use a **build, test, and publish strategy**:
1. **Build & Test**: Validates code quality and functionality
2. **Docker Build**: Creates optimized container image
3. **Docker Publish**: Pushes image to GHCR for backup and versioning
4. **Deployment**: Handled separately by MyFinance-Infrastructure repository

This separation provides:
- Clear separation between CI (this repo) and CD (infrastructure repo)
- Images are versioned and stored for rollback capability
- Deployment can be triggered independently from code changes

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

## 🏗️ Application Architecture

### Frontend Container Setup

The client container is configured as a **static file server only**:

**Docker Image Structure:**
- **Base**: `nginx:alpine` (lightweight production server)
- **Content**: Static React build files served from `/usr/share/nginx/html`
- **Port**: 80 (HTTP)
- **Health Check**: Built-in endpoint monitoring

**Important Configuration Details:**

1. **No API Proxy in Client Container**
   - The client nginx configuration does NOT proxy `/api` calls
   - Client serves static files only (HTML, CSS, JS)
   - Browser makes API calls directly to `/api` endpoints
   - Main infrastructure nginx handles proxying to backend containers

2. **API Configuration**
   ```typescript
   // src/utils/api.ts
   const API_BASE_URL = process.env.REACT_APP_API_URL || '';
   // Endpoints are called with full path: '/api/Account'
   // Result: '' + '/api/Account' = '/api/Account'
   ```

3. **Environment Variables**
   - All `.env` files have `REACT_APP_API_URL` commented out
   - Application uses relative paths: `/api/*`
   - Local development uses proxy in `package.json` for CORS handling
   - Production relies on main nginx reverse proxy

4. **Local Development Proxy**
   ```json
   // package.json (removed during Docker build)
   "proxy": "http://localhost:5024"
   ```
   - Only used during `npm start` for local development
   - Automatically removed during Docker build process
   - Not present in production containers

### Deployment Flow

**Request Flow in Production:**
```
Browser → Client Container (nginx:80) → Static Files (HTML/CSS/JS)
Browser → /api/* → Main Nginx Proxy → Backend Container
```

**Request Flow in Local Development:**
```
Browser → React Dev Server (localhost:3000) → Static Files
Browser → /api/* → Dev Server Proxy → Backend (localhost:5024)
```

### Docker Build Process

The Dockerfile uses multi-stage build:

1. **Build Stage**: Node.js builds React application
   - Installs dependencies
   - **Removes proxy from package.json** (not needed in production)
   - Runs production build
   
2. **Production Stage**: Nginx serves static files
   - Copies build artifacts
   - Configures nginx for SPA routing
   - No API proxy configuration
   - Includes health checks

## 🚀 Workflow Usage

**Important**: These workflows build, test, and publish Docker images. **Deployment is handled by the MyFinance-Infrastructure repository**, which pulls the published images and deploys them to the appropriate environments.

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
# MyFinance-Infrastructure pipeline handles deployment using the published image
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
# MyFinance-Infrastructure pipeline handles deployment using the published image
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
- **Cleaner registry** with only approved, tested images
- **Separation of concerns**: Build/test in client repo, deploy in infrastructure repo

### Security & Control
- **Explicit approval required** before publishing Docker images
- **Audit trail** of who approved each Docker publish
- **Prevent accidental publishes** from untested code

### Developer Experience  
- **Fast PR feedback** (2-3 minutes) without waiting for Docker builds
- **Clear separation** between code validation and deployment
- **Predictable workflow** - know when Docker images will be published
- **Independent operations** - code changes don't trigger deployments directly

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
- Separation of CI (this repo) and CD (infrastructure repo)

### 🔄 Available Enhancements
- Automated image vulnerability scanning
- Performance testing before image publish
- Automated changelog generation
- Integration with infrastructure repo for auto-deployment triggers
- Multi-architecture image builds (ARM, AMD64)

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Double `/api/api/` in API Calls

**Symptom**: API calls fail with 404, logs show `/api/api/Account` instead of `/api/Account`

**Cause**: API_BASE_URL is set to `/api` but endpoints already include `/api`

**Solution**: 
- Ensure `API_BASE_URL` is empty string (`''`)
- Endpoints should include full path: `/api/Account`
- Check `.env` files - all `REACT_APP_API_URL` should be commented out

```typescript
// ✅ CORRECT
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
apiRequest('/api/Account'); // Results in: '/api/Account'

// ❌ WRONG
const API_BASE_URL = '/api';
apiRequest('/api/Account'); // Results in: '/api/api/Account'
```

#### 2. CORS Errors in Local Development

**Symptom**: Browser shows CORS policy errors when calling API

**Cause**: Missing or incorrect proxy configuration in `package.json`

**Solution**:
- Verify `package.json` has: `"proxy": "http://localhost:5024"`
- Ensure backend is running on the correct port (5024)
- Restart React dev server after changing proxy

#### 3. API Calls Fail in Production

**Symptom**: Works locally but fails in Docker deployment

**Cause**: Environment variables pointing to localhost in production

**Solution**:
- Ensure all `.env.*` files use relative paths, not `localhost`
- Client container should NOT proxy API calls
- Verify main infrastructure nginx is configured to proxy `/api`
- Check Docker network configuration

#### 4. Client Container Proxying API Calls

**Symptom**: API calls go to wrong backend or fail

**Cause**: nginx.conf in client container has `/api/` location block

**Solution**:
- Remove `/api/` proxy block from client `nginx.conf`
- Client should only serve static files
- Let main infrastructure nginx handle API routing
- Rebuild Docker image after changes

#### 5. Build Fails During Docker Build

**Symptom**: `npm run build` fails in Dockerfile

**Cause**: 
- Dependencies not installed correctly
- Outdated lock file
- Test failures blocking build

**Solution**:
```dockerfile
# Use npm ci for reproducible builds
RUN npm ci

# Ensure tests pass locally first
npm test

# Check for audit issues
npm audit
```

#### 6. Health Check Failing

**Symptom**: Container starts but health check fails

**Cause**: 
- Port not exposed correctly
- Nginx not serving on port 80
- Missing curl in container

**Solution**:
- Verify `EXPOSE 80` in Dockerfile
- Ensure nginx.conf listens on port 80
- Check `curl` is installed: `RUN apk add --no-cache curl`

#### 7. Static Files Not Loading

**Symptom**: Blank page or 404 for JS/CSS files

**Cause**:
- Build files not copied correctly
- Wrong nginx root directory
- Permissions issues

**Solution**:
```dockerfile
# Verify build output location
COPY --from=builder /app/build /usr/share/nginx/html

# Check nginx configuration
root /usr/share/nginx/html;

# Verify permissions
RUN chown -R nextjs:nodejs /usr/share/nginx/html
```

### Debugging Tips

**Check API Configuration:**
```bash
# In running container
cat /usr/share/nginx/html/static/js/main.*.js | grep -o "API_BASE_URL"

# Should not show localhost URLs in production
```

**Verify Environment Variables:**
```bash
# Check what's built into the image
docker run --rm <image-name> env | grep REACT_APP

# Should be empty or use relative paths
```

**Test Health Check:**
```bash
# Test health check endpoint
curl http://localhost/

# Should return HTML
```

**View Nginx Logs:**
```bash
# In running container
docker logs <container-name>

# Check for 404s or proxy errors
```

---

This CI/CD setup provides a solid foundation for reliable, controlled software delivery with explicit approval gates for critical deployment stages.