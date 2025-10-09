#!/bin/bash

# E2E Test Runner Script
# Ensures clean environment before running Playwright tests

set -e

echo "🧪 HVAC Canvas E2E Test Runner"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
  local port=$1
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
    return 0 # Port is in use
  else
    return 1 # Port is free
  fi
}

# Function to kill process on port
kill_port() {
  local port=$1
  echo -e "${YELLOW}Checking port $port...${NC}"
  
  if check_port $port; then
    echo -e "${YELLOW}Port $port is in use. Killing process...${NC}"
    lsof -ti :$port | xargs kill -9 2>/dev/null || true
    sleep 1
    
    if check_port $port; then
      echo -e "${RED}Failed to kill process on port $port${NC}"
      exit 1
    else
      echo -e "${GREEN}✓ Port $port is now free${NC}"
    fi
  else
    echo -e "${GREEN}✓ Port $port is free${NC}"
  fi
}

# Parse arguments
HEADED=false
UI_MODE=false
DEBUG=false
SPECIFIC_TEST=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --headed)
      HEADED=true
      shift
      ;;
    --ui)
      UI_MODE=true
      shift
      ;;
    --debug)
      DEBUG=true
      shift
      ;;
    --test)
      SPECIFIC_TEST="$2"
      shift 2
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Usage: $0 [--headed] [--ui] [--debug] [--test <test-file>]"
      exit 1
      ;;
  esac
done

# Step 1: Clean up existing dev server
echo ""
echo "Step 1: Cleaning up existing dev server..."
kill_port 5173

# Step 2: Check Playwright installation
echo ""
echo "Step 2: Checking Playwright installation..."
if ! npx playwright --version >/dev/null 2>&1; then
  echo -e "${RED}Playwright not found. Installing...${NC}"
  npm install -D @playwright/test
fi
echo -e "${GREEN}✓ Playwright is installed${NC}"

# Step 3: Check browser installation
echo ""
echo "Step 3: Checking browser installation..."
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
  echo -e "${YELLOW}Browsers not found. Installing...${NC}"
  npx playwright install chromium
else
  echo -e "${GREEN}✓ Browsers are installed${NC}"
fi

# Step 4: Run tests
echo ""
echo "Step 4: Running E2E tests..."
echo ""

# Build command based on options
CMD="npx playwright test"

if [ "$HEADED" = true ]; then
  CMD="$CMD --headed"
  echo -e "${YELLOW}Running in headed mode (browser visible)${NC}"
fi

if [ "$UI_MODE" = true ]; then
  CMD="npx playwright test --ui"
  echo -e "${YELLOW}Running in UI mode (interactive)${NC}"
fi

if [ "$DEBUG" = true ]; then
  CMD="DEBUG=pw:api $CMD"
  echo -e "${YELLOW}Running with debug logs${NC}"
fi

if [ -n "$SPECIFIC_TEST" ]; then
  CMD="$CMD $SPECIFIC_TEST"
  echo -e "${YELLOW}Running specific test: $SPECIFIC_TEST${NC}"
else
  CMD="$CMD --reporter=list"
fi

echo ""
echo "Command: $CMD"
echo ""

# Run the tests
if eval $CMD; then
  echo ""
  echo -e "${GREEN}================================${NC}"
  echo -e "${GREEN}✓ All tests passed!${NC}"
  echo -e "${GREEN}================================${NC}"
  exit 0
else
  EXIT_CODE=$?
  echo ""
  echo -e "${RED}================================${NC}"
  echo -e "${RED}✗ Some tests failed${NC}"
  echo -e "${RED}================================${NC}"
  echo ""
  echo "View detailed report:"
  echo "  open playwright-report/index.html"
  echo ""
  exit $EXIT_CODE
fi

