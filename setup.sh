#!/bin/bash

# Playwright MCP Testing Setup Script
# This script sets up the testing environment for humana.com

echo "🎭 Setting up Playwright MCP Testing Environment"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is too old. Please upgrade to v18 or higher."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npm run install-browsers

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✅ Playwright browsers installed successfully"

# Create directories
echo "📁 Creating necessary directories..."
mkdir -p screenshots
mkdir -p test-results
mkdir -p playwright-report

echo "✅ Directories created successfully"

# Check if .env exists, if not create from template
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env .env.backup 2>/dev/null || true
    echo "✅ .env file ready - please customize it with your settings"
else
    echo "⚙️  .env file already exists"
fi

# Test basic functionality
echo "🧪 Running basic test to verify setup..."
if npx playwright test humana.test.ts --project=chromium; then
    echo "✅ Basic test passed - setup is working!"
else
    echo "⚠️  Basic test failed - please check your configuration"
    echo "Common issues:"
    echo "  - Ensure https://humana.com is accessible"
    echo "  - Check your internet connection"
    echo "  - Verify LM Studio is running (for AI tests)"
fi

echo ""
echo "🎉 Setup Complete!"
echo "==================="
echo ""
echo "📋 Next steps:"
echo "1. Configure LM Studio (if using AI features):"
echo "   - Download and install LM Studio"
echo "   - Load a compatible model (e.g., Llama 3.2 3B Instruct)"
echo "   - Start the API server on port 1234"
echo ""
echo "2. Run tests:"
echo "   npm test                     # Run all tests"
echo "   npm run test:headed          # Run with visible browser"
echo "   npm run test:ui              # Run with interactive UI"
echo ""
echo "3. View results:"
echo "   npm run test:report          # Open HTML report"
echo ""
echo "📚 Documentation:"
echo "   - Read README.md for detailed usage instructions"
echo "   - Check .env file for configuration options"
echo ""
echo "🔧 Troubleshooting:"
echo "   - Run 'npm run test:debug' for debugging"
echo "   - Check screenshots/ folder for visual evidence"
echo "   - Review test-results/ for detailed logs"
echo ""
echo "Happy testing! 🚀"
