# Simple Deployment Guide

## ✅ Current Minimal Configuration

I've removed the buildCommand that was causing errors. Now you have the simplest possible `vercel.json`:

```json
{
  "version": 2,
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
  ]
}
```

## 🚀 Option 1: Deploy Frontend Separately (EASIEST)

### Step 1: Deploy Frontend as Separate Project
1. Go to Vercel Dashboard → **Add New Project**
2. Connect your repository
3. In **Configure Project**:
   - **Root Directory**: Set to `frontend`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: Leave empty (auto-detected)
   - **Output Directory**: Leave empty (auto-detected)
4. Click **Deploy**

### Step 2: Deploy Backend (Current Project)
Your current `vercel.json` handles backend. Just deploy:
```bash
git add vercel.json
git commit -m "Minimal backend config"
git push
```

### Step 3: Connect Frontend to Backend
1. In your **Frontend Project** → **Settings** → **Environment Variables**
2. Add: `VITE_API_BASE_URL` = `https://your-backend-domain.vercel.app`
3. Redeploy frontend

## 🚀 Option 2: Single Project with Root Directory (SIMPLE)

### Step 1: Set Root Directory in Vercel Dashboard
1. Go to Vercel Dashboard → Your Project → **Settings** → **General**
2. Set **Root Directory** to `frontend`
3. Save

### Step 2: Update vercel.json for Backend API
Since root is `frontend`, backend needs to be referenced differently:

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/../backend/index.js"
    }
  ]
}
```

But this might not work well. **Option 1 (separate projects) is recommended.**

## 🚀 Option 3: Add Simple Build Command (IF NEEDED)

If you want everything in one project, add this minimal build command:

```json
{
  "version": 2,
  "buildCommand": "npm install --prefix frontend && npm run build --prefix frontend",
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
  ]
}
```

## ✅ Recommended: Option 1 (Separate Projects)

**Why?**
- ✅ Frontend auto-detects and builds easily
- ✅ Backend deploys independently  
- ✅ No complex build commands
- ✅ Easier to debug
- ✅ Can scale independently

**Current Setup:**
- **Backend**: Current project with minimal `vercel.json` ✅
- **Frontend**: Create new Vercel project with root = `frontend` ✅

## 📝 Summary

**Current `vercel.json`** (for backend):
- ✅ Minimal configuration
- ✅ No buildCommand (removed)
- ✅ Only backend serverless function
- ✅ API routing configured

**Next Steps:**
1. Deploy backend with current config ✅
2. Create separate frontend project in Vercel Dashboard
3. Set root directory to `frontend`
4. Deploy!

