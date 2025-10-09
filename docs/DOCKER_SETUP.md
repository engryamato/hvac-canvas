# 🐳 Docker Setup Guide for HVAC Canvas Application

This guide provides comprehensive instructions for running the HVAC Canvas application using Docker.

## 📋 Prerequisites

- **Docker Desktop** installed and running
- **Git** (for cloning the repository)
- **Node.js 18+** (optional, for local development)

## 🏗️ Project Structure

```
hvac-canvas/
├── Dockerfile                 # Multi-stage Docker configuration
├── docker-compose.yml        # Docker Compose services
├── docker-scripts.sh         # Management scripts
├── .dockerignore             # Docker ignore rules
├── package.json              # Node.js dependencies
└── src/                      # Application source code
```

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd hvac-canvas
chmod +x docker-scripts.sh
```

### 2. Development Environment
```bash
# Build development image
./docker-scripts.sh dev-build

# Start development server with hot reload
./docker-scripts.sh dev-start

# View logs
./docker-scripts.sh dev-logs

# Stop development environment
./docker-scripts.sh dev-stop
```

**Development URL:** http://localhost:5174

### 3. Production Environment
```bash
# Build production image
./docker-scripts.sh prod-build

# Start production server
./docker-scripts.sh prod-start

# Stop production environment
./docker-scripts.sh prod-stop
```

**Production URL:** http://localhost:80

## 🛠️ Available Commands

### Docker Script Commands
| Command | Description |
|---------|-------------|
| `dev-build` | Build development image |
| `dev-start` | Start development environment |
| `dev-stop` | Stop development environment |
| `dev-logs` | Show development logs |
| `prod-build` | Build production image |
| `prod-start` | Start production environment |
| `prod-alt` | Start production on port 8080 |
| `prod-stop` | Stop production environment |
| `status` | Show container status |
| `clean` | Clean up Docker resources |
| `rebuild` | Rebuild all images from scratch |

### NPM Script Commands
| Command | Description |
|---------|-------------|
| `npm run docker:dev` | Start development environment |
| `npm run docker:dev:build` | Build development image |
| `npm run docker:dev:stop` | Stop development environment |
| `npm run docker:dev:logs` | Show development logs |
| `npm run docker:prod` | Start production environment |
| `npm run docker:prod:build` | Build production image |
| `npm run docker:prod:stop` | Stop production environment |
| `npm run docker:clean` | Clean up Docker resources |
| `npm run docker:status` | Show container status |

## 🏭 Environment Details

### Development Environment
- **Base Image:** Node.js 18 Alpine
- **Port:** 5174
- **Features:**
  - Hot reload enabled
  - Source code mounted as volumes
  - Development dependencies included
  - Vite dev server with HMR

### Production Environment
- **Base Image:** Nginx Alpine
- **Port:** 80 (or 8080 for alternative)
- **Features:**
  - Optimized static build
  - Gzip compression enabled
  - Security headers configured
  - SPA routing support
  - Health checks included

## 📁 Docker Configuration Files

### Dockerfile
Multi-stage build with four stages:
1. **Base:** Common Node.js setup
2. **Development:** Dev server with hot reload
3. **Build:** Production build stage
4. **Production:** Nginx serving optimized files

### docker-compose.yml
Services defined:
- `hvac-canvas-dev`: Development with volume mounts
- `hvac-canvas-prod`: Production on port 80
- `hvac-canvas-prod-alt`: Production on port 8080

### .dockerignore
Excludes unnecessary files:
- `node_modules`
- Build artifacts
- Git files
- Documentation
- IDE files

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :5174  # or :80

# Stop conflicting containers
docker stop $(docker ps -q)

# Or use alternative port
./docker-scripts.sh prod-alt  # Uses port 8080
```

#### 2. Build Failures
```bash
# Clean Docker cache and rebuild
./docker-scripts.sh clean
./docker-scripts.sh rebuild
```

#### 3. Permission Issues
```bash
# Make script executable
chmod +x docker-scripts.sh

# Fix Docker permissions (if needed)
sudo usermod -aG docker $USER
```

#### 4. Hot Reload Not Working
- Ensure source files are properly mounted
- Check that the development container is running
- Verify file changes are being detected

### Logs and Debugging
```bash
# View container logs
./docker-scripts.sh dev-logs
docker-compose logs -f hvac-canvas-dev

# Check container status
./docker-scripts.sh status
docker ps

# Inspect container
docker exec -it hvac-canvas-dev sh
```

## 🔒 Security Considerations

### Production Security Features
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Gzip compression
- Static file caching
- Non-root user execution
- Minimal attack surface

### Development Security
- Source code mounted read-only
- Isolated network
- No production secrets

## 🚀 Deployment Options

### Local Development
```bash
./docker-scripts.sh dev-start
```

### Local Production Testing
```bash
./docker-scripts.sh prod-start
```

### CI/CD Pipeline
```bash
# Build and test
docker build --target development .
docker build --target production .

# Run tests in container
docker run --rm hvac-canvas-dev npm test
```

## 📊 Performance

### Development
- **Build Time:** ~5-10 seconds
- **Startup Time:** ~2-3 seconds
- **Hot Reload:** < 1 second

### Production
- **Build Time:** ~30-60 seconds
- **Image Size:** ~50MB (optimized)
- **Startup Time:** < 1 second

## 🔄 Maintenance

### Regular Tasks
```bash
# Update dependencies
npm update
./docker-scripts.sh rebuild

# Clean up unused resources
./docker-scripts.sh clean
docker system prune -a

# Update base images
docker pull node:18-alpine
docker pull nginx:alpine
```

### Monitoring
```bash
# Check resource usage
docker stats

# View container health
docker inspect hvac-canvas-prod | grep Health
```

## 📝 Additional Notes

- The application is a React + TypeScript + Vite SPA
- No backend services required
- All data is client-side only
- Supports modern browsers
- Mobile-responsive design

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Docker logs
3. Ensure Docker Desktop is running
4. Verify port availability
5. Contact the development team

---

**Happy Dockerizing!** 🐳✨
