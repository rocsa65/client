# 🌍 Public Docker Images with GitHub Container Registry

The project is configured to use **GitHub Container Registry (GHCR)** with public access for maximum simplicity and collaboration.

## 🚀 **How It Works**

### **Automatic & Simple**:
- ✅ **No secrets needed** - Uses `GITHUB_TOKEN` automatically
- ✅ **No Docker Hub account required**
- ✅ **No manual organization setup**
- ✅ **Free unlimited public images**
- ✅ **Anyone can pull images without authentication**

## 📦 **Your Public Images**

### **Image Locations**:
```
ghcr.io/rocsa65/client:latest          # Production
ghcr.io/rocsa65/client:staging-latest  # Staging  
ghcr.io/rocsa65/client:dev-latest      # Development
```

### **Versioned Images**:
```
ghcr.io/rocsa65/client:v1              # Production release v1
ghcr.io/rocsa65/client:prod-abc123     # Production from commit abc123
ghcr.io/rocsa65/client:dev-abc123      # Development from commit abc123
```

## 🔓 **Making Images Public**

### **✅ Automatic (All Environments)**
ALL workflows are configured to automatically make packages public! 

**What happens:**
1. **Any push**: Package is created (initially private)
2. **All workflows**: Automatically make package public
3. **All subsequent pushes**: Package stays public

**Applies to:**
- ✅ **Development builds**: `dev-latest`, `dev-{commit}`
- ✅ **Staging builds**: `staging-latest`, `staging-{commit}`
- ✅ **Production builds**: `latest`, `prod-{commit}`, `v{version}`

### **📋 One-Time Setup Required**:
1. **Repository must be public** (GitHub requirement)
2. **Push code to any branch** to trigger workflows
3. **That's it!** - Automation handles the rest

### **🔧 Manual Override (If Needed)**
If you need to manually control visibility:

#### **Step 1: Repository Must Be Public**
Your GitHub repository needs to be public for images to be public:
1. Go to your repository on GitHub
2. Click **Settings** 
3. Scroll to **Danger Zone**
4. Click **Change repository visibility**
5. Select **Make public**

#### **Step 2: Configure Package Visibility** 
After the first image is pushed:
1. Go to your GitHub profile
2. Click **Packages** tab
3. Find `client` package
4. Click on it
5. Go to **Package settings**
6. Under **Danger Zone** → **Change package visibility**
7. Select **Public**

## 👥 **What Anyone Can Do Now**

### **Pull Images (No Authentication Required)**:
```bash
# Anyone can pull your images
docker pull ghcr.io/rocsa65/client:latest
docker pull ghcr.io/rocsa65/client:dev-latest

# Run the application
docker run -p 3000:80 ghcr.io/rocsa65/client:latest
```

### **Use in Docker Compose**:
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    image: ghcr.io/rocsa65/client:latest
    ports:
      - "3000:80"
  
  frontend-dev:
    image: ghcr.io/rocsa65/client:dev-latest
    ports:
      - "3001:80"
```

### **Use in Kubernetes**:
```yaml
# kubernetes-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myfinance-client
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myfinance-client
  template:
    metadata:
      labels:
        app: myfinance-client
    spec:
      containers:
      - name: client
        image: ghcr.io/rocsa65/client:latest
        ports:
        - containerPort: 80
```

## 🤝 **Team Collaboration**

### **For Repository Collaborators**:
Anyone you add as a collaborator to your GitHub repository can:
- ✅ Push code changes
- ✅ Trigger CI/CD pipelines  
- ✅ Their Pull Requests will build and test automatically
- ✅ Access private images (if repo becomes private later)

### **For Contributors (Fork & PR)**:
Anyone can:
- ✅ Fork your repository
- ✅ Create Pull Requests
- ✅ Their PR builds will create temporary images
- ✅ Pull public images for local development

## 📋 **Required Setup (One-Time)**

### **GitHub Repository Settings**:
1. Repository must be **public**
2. Actions must be **enabled**
3. No additional secrets needed (GITHUB_TOKEN is automatic)

### **No Docker Hub Required**:
- ❌ No Docker Hub account needed
- ❌ No DOCKER_USERNAME secret
- ❌ No DOCKER_PASSWORD secret  
- ❌ No organization setup

## 🔍 **Monitoring Your Images**

### **View Published Packages**:
1. Go to your GitHub profile
2. Click **Packages** tab
3. See all your published images
4. View download statistics
5. Manage package settings

### **Image URLs**:
Your public images are available at:
- **GitHub**: `https://github.com/rocsa65/client/pkgs/container/client`
- **Registry**: `ghcr.io/rocsa65/client`

## 🚀 **Usage Examples**

### **Quick Start for Anyone**:
```bash
# 1. Pull and run latest production version
docker run -p 3000:80 ghcr.io/rocsa65/client:latest

# 2. View the app at http://localhost:3000
```

### **All Environments Available**:
```bash
# Production (stable)
docker run -p 3000:80 ghcr.io/rocsa65/client:latest

# Staging (pre-production)
docker run -p 3001:80 ghcr.io/rocsa65/client:staging-latest

# Development (latest features)
docker run -p 3002:80 ghcr.io/rocsa65/client:dev-latest
```

### **Specific Version**:
```bash
# Use a specific production version
docker run -p 3000:80 ghcr.io/rocsa65/client:v5

# Use a specific commit
docker run -p 3000:80 ghcr.io/rocsa65/client:prod-abc123def
```

## 💡 **Benefits of This Approach**

| Feature | Benefit |
|---------|---------|
| **Simplicity** | Zero configuration, automatic authentication |
| **Cost** | Completely free for public images |
| **Access** | Anyone can use your images without signup |
| **Integration** | Native GitHub integration |
| **Reliability** | Backed by GitHub's infrastructure |
| **Visibility** | Clear package management in GitHub UI |
| **Collaboration** | Automatic access for repository collaborators |

## 🔒 **Security Notes**

### **Public Images Are Safe Because**:
- Images contain only **built application code** (HTML, CSS, JS)
- **No source code** in the images
- **No secrets** or environment variables in images
- Anyone can see your repository anyway (it's public)

### **Best Practices**:
- Never include secrets in Dockerfile
- Use build-time arguments for configuration
- Keep sensitive data in environment variables at runtime

## 🎯 **Perfect for Open Source**

This setup is ideal for:
- ✅ Open source projects
- ✅ Demo applications  
- ✅ Educational projects
- ✅ Public tools and utilities
- ✅ Community-driven development

Your images are now **publicly accessible**, **zero-configuration**, and **completely free**! 🎉