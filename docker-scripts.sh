#!/bin/bash

# HVAC Canvas Docker Management Scripts
# Usage: ./docker-scripts.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Development commands
dev_build() {
    print_status "Building development image..."
    docker-compose build hvac-canvas-dev
    print_success "Development image built successfully!"
}

dev_start() {
    print_status "Starting development environment..."
    docker-compose --profile dev up -d
    print_success "Development environment started!"
    print_status "Application available at: http://localhost:5174"
    print_status "Use 'docker-compose logs -f hvac-canvas-dev' to view logs"
}

dev_stop() {
    print_status "Stopping development environment..."
    docker-compose --profile dev down
    print_success "Development environment stopped!"
}

dev_logs() {
    print_status "Showing development logs (Ctrl+C to exit)..."
    docker-compose logs -f hvac-canvas-dev
}

# Production commands
prod_build() {
    print_status "Building production image..."
    docker-compose build hvac-canvas-prod
    print_success "Production image built successfully!"
}

prod_start() {
    print_status "Starting production environment..."
    docker-compose --profile prod up -d
    print_success "Production environment started!"
    print_status "Application available at: http://localhost:80"
}

prod_start_alt() {
    print_status "Starting production environment on port 8080..."
    docker-compose --profile prod-alt up -d
    print_success "Production environment started!"
    print_status "Application available at: http://localhost:8080"
}

prod_stop() {
    print_status "Stopping production environment..."
    docker-compose --profile prod down
    docker-compose --profile prod-alt down
    print_success "Production environment stopped!"
}

# Utility commands
clean() {
    print_status "Cleaning up Docker resources..."
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    print_success "Cleanup completed!"
}

rebuild() {
    print_status "Rebuilding all images..."
    docker-compose build --no-cache
    print_success "All images rebuilt!"
}

status() {
    print_status "Docker container status:"
    docker-compose ps
}

# Help function
show_help() {
    echo "HVAC Canvas Docker Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Development Commands:"
    echo "  dev-build     Build development image"
    echo "  dev-start     Start development environment (http://localhost:5174)"
    echo "  dev-stop      Stop development environment"
    echo "  dev-logs      Show development logs"
    echo ""
    echo "Production Commands:"
    echo "  prod-build    Build production image"
    echo "  prod-start    Start production environment (http://localhost:80)"
    echo "  prod-alt      Start production environment (http://localhost:8080)"
    echo "  prod-stop     Stop production environment"
    echo ""
    echo "Utility Commands:"
    echo "  status        Show container status"
    echo "  clean         Clean up Docker resources"
    echo "  rebuild       Rebuild all images from scratch"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev-start     # Start development with hot reload"
    echo "  $0 prod-start    # Start production build"
    echo "  $0 clean         # Clean up everything"
}

# Main script logic
case "$1" in
    dev-build)
        check_docker
        dev_build
        ;;
    dev-start)
        check_docker
        dev_start
        ;;
    dev-stop)
        check_docker
        dev_stop
        ;;
    dev-logs)
        check_docker
        dev_logs
        ;;
    prod-build)
        check_docker
        prod_build
        ;;
    prod-start)
        check_docker
        prod_start
        ;;
    prod-alt)
        check_docker
        prod_start_alt
        ;;
    prod-stop)
        check_docker
        prod_stop
        ;;
    status)
        check_docker
        status
        ;;
    clean)
        check_docker
        clean
        ;;
    rebuild)
        check_docker
        rebuild
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        print_error "No command specified."
        show_help
        exit 1
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
