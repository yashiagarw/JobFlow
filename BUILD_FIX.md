# Build Error Fix: ENOENT package.json

## 🔴 Problem
```
npm error path /vercel/path0/backend/frontend/package.json
npm error errno -2
npm error enoent Could not read package.json
```

This error occurs because npm is looking for `frontend/package.json` in the wrong location (`backend/frontend/package.json`).

## ✅ Solution Applied

### Option 1: Build Script (Current)
Created `build.sh` script that explicitly changes directories:

```bash
#!/bin/bash
set -e
cd backend && npm install
cd ../frontend && npm install && npm run build
```

**vercel.json:**
```json
"buildCommand": "bash build.sh"
```

### Option 2: Alternative Inline Command
If the script doesn't work, use this inline command:

```json
"buildCommand": "(cd backend && npm install) && (cd frontend && npm install && npm run build)"
```

## 📋 Steps to Deploy

### Step 1: Commit Changes
```bash
git add vercel.json build.sh
git commit -m "Fix: Add build script for proper directory handling"
git push
```

### Step 2: Verify Build Script is Executable
The build script should be executable (already done with `chmod +x`).

### Step 3: Monitor Deployment
1. Go to Vercel Dashboard → Deployments
2. Watch the build logs
3. You should see:
   - ✅ "Installing backend dependencies..."
   - ✅ "Installing frontend dependencies..."
   - ✅ "Building frontend..."
   - ✅ "Build completed successfully!"

## 🐛 If Build Script Doesn't Work

### Try Alternative 1: Inline Command
Update `vercel.json`:
```json
"buildCommand": "(cd backend && npm install) && (cd frontend && npm install && npm run build)"
```

### Try Alternative 2: Explicit Paths
```json
"buildCommand": "npm --prefix ./backend install && npm --prefix ./frontend install && npm --prefix ./frontend run build"
```

### Try Alternative 3: Use installCommand Separately
```json
"installCommand": "cd backend && npm install && cd ../frontend && npm install",
"buildCommand": "cd frontend && npm run build"
```

## 🔍 Debugging

### Check Build Logs
1. Go to Vercel Dashboard → Latest Deployment
2. Click on the build
3. Look for:
   - Which directory commands are executing from
   - Any path-related errors
   - npm install output

### Verify File Structure
Make sure your project structure is:
```
JobFlow/
├── backend/
│   ├── package.json
│   └── index.js
├── frontend/
│   ├── package.json
│   └── ...
├── vercel.json
└── build.sh
```

### Test Locally
Test the build script locally:
```bash
bash build.sh
```

Should complete without errors.

## ✅ Expected Behavior

After fix:
1. ✅ Backend dependencies install successfully
2. ✅ Frontend dependencies install successfully  
3. ✅ Frontend builds successfully
4. ✅ Backend serverless function is created
5. ✅ Deployment completes

## 📝 Current Configuration

**vercel.json:**
```json
{
  "version": 2,
  "buildCommand": "bash build.sh",
  "outputDirectory": "frontend/dist",
  "builds": [
    {
      "src": "backend/index.js",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/backend/index.js"
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**build.sh:**
```bash
#!/bin/bash
set -e
echo "Installing backend dependencies..."
cd backend && npm install
cd ..
echo "Installing frontend dependencies..."
cd frontend && npm install
echo "Building frontend..."
npm run build
cd ..
echo "Build completed successfully!"
```

## 🎯 Root Cause

The `--prefix` flag in npm looks for the directory relative to the current working directory. In Vercel's build environment:
- The working directory might not be what we expect
- Using `cd` commands explicitly ensures we're in the right directory
- A build script provides better error handling and logging

