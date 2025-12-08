#!/bin/bash
set -e  # Exit on any error

# Get the script directory (project root)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Current directory: $(pwd)"
echo "Installing backend dependencies..."
cd "$SCRIPT_DIR/backend"
npm install

echo "Installing frontend dependencies..."
cd "$SCRIPT_DIR/frontend"
npm install

echo "Building frontend..."
npm run build

echo "Build completed successfully!"

