# Frontend Deployment Fix

## ✅ Current Simple Configuration

I've simplified the configuration. Vercel should **automatically install backend dependencies** when building the serverless function.

### Current `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
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

## 🎯 How It Works

1. **Frontend Build**: `buildCommand` installs frontend deps and builds
2. **Backend Function**: Vercel automatically installs backend dependencies when it sees `backend/package.json` next to `backend/index.js`
3. **Routing**: API calls go to backend, everything else goes to frontend

## 🚀 Deploy

```bash
git add vercel.json
git commit -m "Simplify frontend deployment"
git push
```

## 🐛 If Backend Dependencies Still Don't Install

If Vercel doesn't auto-install backend dependencies, try this alternative:

### Option 1: Use npm --prefix (if cd doesn't work)

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

### Option 2: Separate Projects (Simplest)

Deploy frontend and backend as **separate Vercel projects**:

1. **Frontend Project**:
   - Set Root Directory to `frontend` in Vercel Dashboard
   - No `vercel.json` needed (Vercel auto-detects Vite)

2. **Backend Project**:
   - Set Root Directory to `backend` in Vercel Dashboard  
   - No `vercel.json` needed (Vercel auto-detects Node.js)

3. **Update Frontend API Config**:
   - Set `VITE_API_BASE_URL` to your backend URL in frontend project's environment variables

## ✅ Expected Result

After deployment:
- ✅ Frontend builds successfully
- ✅ Backend function is created
- ✅ API routes work: `/api/v1/users/getuser`
- ✅ Frontend routes work: `/`, `/jobs`, etc.

