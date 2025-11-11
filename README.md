# MyFinance Client

[![Development CI/CD](https://github.com/rocsa65/client/actions/workflows/development.yml/badge.svg?branch=development)](https://github.com/rocsa65/client/actions/workflows/development.yml)
[![Staging CI/CD](https://github.com/rocsa65/client/actions/workflows/staging.yml/badge.svg?branch=staging)](https://github.com/rocsa65/client/actions/workflows/staging.yml)
[![Production CI/CD](https://github.com/rocsa65/client/actions/workflows/production.yml/badge.svg?branch=production)](https://github.com/rocsa65/client/actions/workflows/production.yml)

A React-based financial management application with automated CI/CD pipelines.

## 🚀 Current Implementation Status

### ✅ Implemented Features
- **React Application**: Modern React 19 with TypeScript
- **Multi-Stage CI/CD Pipelines**: Structured workflows with clear stages
- **Manual Docker Approval**: Controlled image publishing for staging/production
- **GitHub Actions**: Automated testing and deployment
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API integration testing (staging/production)
- **Docker Support**: Containerized application with Nginx
- **GitHub Container Registry**: Automated image publishing to GHCR
- **PR Feedback**: Automatic updates with pipeline status

### 🔄 Planned Enhancements
- **UI Tests**: Cypress end-to-end testing
- **Health Check Endpoints**: Application monitoring
- **Blue-Green Deployment**: Zero-downtime deployments
- **Infrastructure Repository**: Separate infrastructure management

## 📋 CI/CD Pipeline

### Pipeline Architecture

All workflows follow a structured, multi-stage approach:

**Development Pipeline:**
1. 📦 Build Application
2. 🧪 Unit Tests
3. ✅ Build Verification
4. 💬 PR Feedback

**Staging Pipeline:**
1. 📦 Build Application
2. 🧪 Unit Tests
3. 🔗 Integration Tests
4. ✅ Build Verification
5. ⏸️ **Docker Publish Approval** (manual gate)
6. 🐳 Docker Build & Publish to GHCR
7. 💬 PR Feedback

**Production Pipeline:**
1. 📦 Build Application
2. 🧪 Unit Tests
3. 🔗 Integration Tests
4. ✅ Build Verification
5. 💬 PR Feedback
6. ⏸️ **Docker Publish Approval** (manual gate)
7. 🐳 Docker Build & Publish with versioning

### Manual Approval Gates

For staging and production environments:
- **Docker builds require manual approval** before publishing
- Prevents accidental deployments
- Provides explicit control over image publishing
- Approval via "Review deployments" button in GitHub Actions UI

### Branch Strategy
- **development**: Feature development and fast feedback
- **staging**: Pre-production testing with manual Docker publish control
- **production**: Live production releases with manual Docker publish control

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Testing**: Jest, React Testing Library
- **Build**: React Scripts (Create React App)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Registry**: GitHub Container Registry (ghcr.io)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (for containerization)

### Installation

```bash
# Clone the repository
git clone https://github.com/rocsa65/client.git
cd client

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Starts development server on http://localhost:3000 |
| `npm test` | Runs tests in interactive watch mode |
| `npm run test:unit` | Runs unit tests with coverage |
| `npm run test:integration` | Runs integration tests with coverage |
| `npm run test:coverage` | Runs all tests with coverage report |
| `npm run build` | Creates production build in `build/` folder |

### Docker Usage

```bash
# Build image
docker build -t myfinance-client .

# Run container
docker run -p 3000:80 myfinance-client
```

## 📁 Project Structure

```
src/
├── pages/           # Application pages
├── tests/           # Test files
│   ├── unit/        # Unit tests
│   └── integration/ # Integration tests
├── utils/           # Utility functions
├── App.tsx          # Main application component
└── index.tsx        # Application entry point
```

## 🔧 Development Workflow

### Feature Development
```bash
# Create feature branch from development
git checkout development
git pull origin development
git checkout -b feature/your-feature-name

# Make changes and test
npm test
npm run build

# Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name

# Create pull request to development branch
# Pipeline runs: Build → Unit Tests → Build Verification → PR Feedback
```

### Staging Promotion
```bash
# Merge development → staging
# After merge, pipeline runs and pauses at Docker Publish Approval
# Go to GitHub Actions → Click "Review deployments" → Approve
# Docker image is built and published to GHCR
```

### Production Release
```bash
# Merge staging → production
# After merge, pipeline runs comprehensive tests
# Then pauses at Docker Publish Approval
# Go to GitHub Actions → Click "Review deployments" → Approve  
# Docker image is built with multiple version tags
```

## 📊 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Utility function testing
- Coverage reporting

### Integration Tests
- API integration tests
- Cross-component interaction tests
- E2E critical path testing

## 🐳 Docker Deployment

The application is containerized and published to GitHub Container Registry with manual approval:

**Staging Images:**
```bash
# Pull latest staging image (after approval)
docker pull ghcr.io/rocsa65/client:staging-latest

# Or pull specific commit version
docker pull ghcr.io/rocsa65/client:staging-{commit-sha}

# Run container
docker run -p 80:80 ghcr.io/rocsa65/client:staging-latest
```

**Production Images:**
```bash
# Pull latest production image (after approval)
docker pull ghcr.io/rocsa65/client:latest

# Or pull specific version
docker pull ghcr.io/rocsa65/client:v{build-number}

# Run container
docker run -p 80:80 ghcr.io/rocsa65/client:latest
```

**Image Tags:**
- Staging: `staging-latest`, `staging-{commit-sha}`
- Production: `latest`, `v{build-number}`, `{commit-sha}`, `prod-{timestamp}`

## 📚 Documentation

- **CI/CD Setup**: See `.github/workflows/documentation/CICD-SETUP.md`
- **Testing Strategy**: See `.github/workflows/documentation/TESTING-STRATEGY.md`
- **Integration Testing**: See `.github/workflows/documentation/INTEGRATION-TESTING-GUIDE.md`
- **Container Registry**: See `.github/workflows/documentation/GITHUB-CONTAINER-REGISTRY-SETUP.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch from `development`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Create a pull request

## 🔗 Related Repositories

- **Backend API**: [rocsa65/server](https://github.com/rocsa65/server) (when available)
- **Infrastructure**: [rocsa65/myfinance-infrastructure](https://github.com/rocsa65/myfinance-infrastructure) (planned)

## 📈 Roadmap

### Phase 1 (Current) ✅
- ✅ Multi-stage pipeline architecture
- ✅ GitHub Actions CI/CD with manual approval gates
- ✅ Unit and integration testing
- ✅ Docker containerization with GHCR
- ✅ Automated PR feedback

### Phase 2 (Next)
- [ ] UI test automation (Cypress)
- [ ] Health check endpoints
- [ ] Enhanced monitoring and alerting
- [ ] Performance testing

### Phase 3 (Future)
- [ ] Blue-green deployments
- [ ] Infrastructure as Code
- [ ] Multi-region support
- [ ] Advanced security scanning

## 🆘 Troubleshooting

### Common Issues

**Tests failing locally:**
```bash
npm run test:unit -- --verbose
```

**Build issues:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Docker build fails:**
```bash
docker system prune -f
docker build --no-cache -t myfinance-client .
```

## 📄 License

This project is licensed under the MIT License.

## 🏗️ Built With Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

For more information about available scripts and configuration, see the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).