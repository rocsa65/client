# MyFinance Client

[![Development CI/CD](https://github.com/rocsa65/client/actions/workflows/development.yml/badge.svg?branch=development)](https://github.com/rocsa65/client/actions/workflows/development.yml)
[![Staging CI/CD](https://github.com/rocsa65/client/actions/workflows/staging.yml/badge.svg?branch=staging)](https://github.com/rocsa65/client/actions/workflows/staging.yml)
[![Production CI/CD](https://github.com/rocsa65/client/actions/workflows/production.yml/badge.svg?branch=production)](https://github.com/rocsa65/client/actions/workflows/production.yml)

A React-based financial management application with automated CI/CD pipelines.

## 🚀 Current Implementation Status

### ✅ Implemented Features
- **React Application**: Modern React 19 with TypeScript
- **Three-Branch Strategy**: development → staging → production
- **GitHub Actions CI/CD**: Automated testing and deployment pipelines
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API integration testing
- **Docker Support**: Containerized application
- **GitHub Container Registry**: Automated image publishing

### 🔄 Planned Enhancements
- **UI Tests**: Cypress end-to-end testing
- **Health Check Endpoints**: Application monitoring
- **Jenkins Orchestration**: Local container setup
- **Blue-Green Deployment**: Zero-downtime deployments
- **Infrastructure Repository**: Separate infrastructure management

## 📋 Current CI/CD Pipeline

### Branch Strategy
- **development**: Feature development and testing
- **staging**: Pre-production testing and integration
- **production**: Live production releases

### Automated Workflows
1. **Development**: Unit tests → Build → Deploy to dev environment
2. **Staging**: Unit tests → Integration tests → Security scan → Build → Deploy to staging
3. **Production**: Comprehensive testing → Build → Docker publish → Deploy to production

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
# Create feature branch
git checkout -b feature/your-feature-name development

# Make changes and test
npm test

# Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name

# Create pull request to development branch
```

### Release Process
```bash
# Merge development → staging (triggers staging pipeline)
git checkout staging
git merge development
git push origin staging

# After testing, merge staging → production (triggers production pipeline)
git checkout production
git merge staging
git push origin production
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

The application is automatically containerized and published to GitHub Container Registry:

```bash
# Pull latest image
docker pull ghcr.io/rocsa65/client:latest

# Run production container
docker run -p 80:80 ghcr.io/rocsa65/client:latest
```

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

### Phase 1 (Current)
- ✅ Basic React application
- ✅ GitHub Actions CI/CD
- ✅ Multi-environment deployment

### Phase 2 (Next)
- [ ] UI test automation (Cypress)
- [ ] Health check endpoints
- [ ] Enhanced monitoring

### Phase 3 (Future)
- [ ] Jenkins orchestration
- [ ] Blue-green deployments
- [ ] Infrastructure as Code
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