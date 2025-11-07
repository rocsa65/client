# GitHub Container Registry Setup Guide

## Problem
You're seeing this error:
```
ERROR: failed to push ghcr.io/rocsa65/client:dev-latest: denied: installation not allowed to Create organization package
```

## Root Cause
GitHub Container Registry requires specific permissions to be enabled for your repository and personal access token.

## Solution Steps

### 1. Enable GitHub Container Registry Permissions

#### Option A: Repository Settings (Recommended)
1. Go to your GitHub repository: `https://github.com/rocsa65/client`
2. Click on **Settings** tab
3. Scroll down to **Actions** section in the left sidebar
4. Click on **General**
5. Scroll to **Workflow permissions**
6. Select **Read and write permissions**
7. Check ✅ **Allow GitHub Actions to create and approve pull requests**
8. Click **Save**

#### Option B: Organization Settings (If applicable)
If you're using an organization account:
1. Go to `https://github.com/organizations/rocsa65/settings/actions`
2. Under **Actions permissions**
3. Select **Allow all actions and reusable workflows**
4. Under **Workflow permissions**
5. Select **Read and write permissions**
6. Check ✅ **Allow GitHub Actions to create and approve pull requests**

### 2. Enable Package Permissions

1. Go to your GitHub profile: `https://github.com/settings/packages`
2. Under **Package creation**, ensure **Public** is allowed
3. OR go to your repository settings and check package permissions

### 3. Manual Package Creation (Alternative)
If the automatic creation still fails, you can create the package manually:

1. Go to `https://github.com/rocsa65?tab=packages`
2. Click **Create a new package**
3. Choose **Container registry**
4. Name it `client`
5. Set visibility to **Public**
6. Link it to your repository `rocsa65/client`

### 4. Verify Your Personal Access Token (If needed)
If you're still having issues, check that your personal access token has the right scopes:

1. Go to `https://github.com/settings/tokens`
2. Your token should have these scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `repo` (if repository is private)

## What I've Fixed in the Workflows

✅ **Enabled permissions in development.yml**
```yaml
permissions:
  contents: read          # Read repository content
  packages: write         # Write to GitHub Container Registry
  pull-requests: write   # Comment on PRs
```

✅ **Updated package visibility API calls**
- Now tries both organization and user endpoints
- Handles both personal and organization repositories

✅ **Improved error handling**
- Continues even if package visibility setting fails

## Testing the Fix

1. **Commit and push these changes**:
   ```bash
   git add .
   git commit -m "fix: enable GitHub Container Registry permissions"
   git push origin development
   ```

2. **Monitor the workflow**:
   - Go to `https://github.com/rocsa65/client/actions`
   - Check that the `docker-build` job completes successfully
   - Verify package is created at `https://github.com/rocsa65/client/pkgs/container/client`

## Expected Outcome

After these changes, your workflow should:
- ✅ Build Docker images successfully
- ✅ Push to `ghcr.io/rocsa65/client:dev-latest`
- ✅ Automatically set package visibility to public
- ✅ Complete all CI/CD stages without errors

## If You Still Have Issues

1. **Check repository settings** as described above
2. **Verify your account has package permissions**
3. **Create the package manually** and then retry the workflow
4. **Contact me** if you need help with organization-specific permissions

The key fix was enabling the `packages: write` permission in the workflow, which was commented out in the development workflow.