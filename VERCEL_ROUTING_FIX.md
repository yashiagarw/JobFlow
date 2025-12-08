# Vercel 404 NOT_FOUND Error - Routing Fix

## 🔴 Problem
Getting `404: NOT_FOUND` / `DEPLOYMENT_NOT_FOUND` when accessing API endpoints like:
- `https://your-domain.vercel.app/api/v1/users/getuser`

## ✅ Fixes Applied

### 1. Updated vercel.json Configuration
- Added backend dependency installation to build command
- Changed routing to use `rewrites` (more reliable than `routes` for API proxying)
- Ensured backend function is properly built

### 2. Key Changes Made

**Before:**
```json
"buildCommand": "npm install --prefix frontend && npm run build --prefix frontend"
```

**After:**
```json
"buildCommand": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend"
```

**Why:** Backend dependencies (Express, Mongoose, etc.) need to be installed for the serverless function to work!

## 📋 Steps to Resolve

### Step 1: Verify vercel.json
Make sure your `vercel.json` matches the updated configuration with:
- Backend dependency installation
- Proper `rewrites` configuration
- Correct `builds` setup

### Step 2: Redeploy
1. Commit and push the updated `vercel.json`
2. OR manually redeploy in Vercel Dashboard:
   - Go to **Deployments** → Latest deployment → **⋯** → **Redeploy**

### Step 3: Check Build Logs
After redeploying, check the build logs:
1. Go to **Deployments** → Latest deployment
2. Click on the build
3. Verify you see:
   - ✅ "Installing backend dependencies..."
   - ✅ "Installing frontend dependencies..."
   - ✅ "Building frontend..."
   - ✅ "Building backend function..."

### Step 4: Check Function Logs
1. Go to **Deployments** → Latest deployment → **Functions** tab
2. Look for `backend/index.js` function
3. Check for any errors

### Step 5: Test API Endpoint
Try accessing:
- `https://your-domain.vercel.app/api/v1/users/getuser`
- Should return a response (even if error, means backend is running)

## 🐛 If Still Not Working

### Check 1: Verify Backend Function Exists
1. Go to Vercel Dashboard → Your Project → **Functions** tab
2. You should see `backend/index.js` listed
3. If not, the build might have failed

### Check 2: Verify Environment Variables
Make sure all environment variables are set (see `VERCEL_ENV_SETUP.md`):
- `MONGO_URI`
- `JWT_SECRET_KEY`
- etc.

### Check 3: Check Function Logs
1. Go to **Deployments** → Latest deployment → **Functions**
2. Click on `backend/index.js`
3. Check **Logs** tab for errors

### Check 4: Test Root Endpoint
Try: `https://your-domain.vercel.app/`
- Should return JSON: `{"success": true, "message": "Server is running successfully! 🚀"}`
- If this works but `/api/*` doesn't, it's a routing issue

### Check 5: Alternative - Use API Folder Structure
If the current approach still doesn't work, you can create an `api` folder:

1. Create `api/index.js` at project root:
```javascript
export { default } from '../backend/index.js';
```

2. Update `vercel.json`:
```json
{
  "version": 2,
  "buildCommand": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
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

## 🔍 Debugging Commands

### Check if function is deployed:
```bash
# In Vercel CLI
vercel ls
vercel inspect [deployment-url]
```

### Test locally with Vercel:
```bash
vercel dev
# Then test: http://localhost:3000/api/v1/users/getuser
```

## ✅ Expected Behavior After Fix

1. **Build succeeds** with backend dependencies installed
2. **Function appears** in Vercel Functions tab
3. **API endpoints work**: `/api/v1/users/getuser` returns response
4. **No 404 errors** for API routes

## 📝 Current vercel.json Structure

```json
{
  "version": 2,
  "buildCommand": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
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

## 🎯 Most Likely Cause

The **#1 reason** for this error is: **Backend dependencies not installed during build**

The fix ensures `npm install --prefix backend` runs before building, so all Express, Mongoose, and other backend dependencies are available to the serverless function.

