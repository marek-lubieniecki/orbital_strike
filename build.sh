#!/bin/bash

# Build script for Orbit Strike
echo "🚀 Building Orbit Strike for production..."

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Build the project
echo "🔨 Building modular version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Built files are in the 'dist' directory"
    echo ""
    echo "🌐 To preview the build:"
    echo "   npm run preview"
    echo ""
    echo "📤 To deploy to GitLab Pages:"
    echo "   git add ."
    echo "   git commit -m 'Update build'"
    echo "   git push origin main"
else
    echo "❌ Build failed!"
    exit 1
fi