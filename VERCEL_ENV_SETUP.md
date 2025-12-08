# Vercel Environment Variables Setup Guide

## 🔴 CRITICAL: All these environment variables MUST be set in Vercel Dashboard

Your backend is failing because environment variables are not configured in Vercel. Follow these steps:

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
1. Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **JobFlow** project
3. Click on **Settings** (gear icon)
4. Click on **Environment Variables** in the left sidebar

### 2. Add Each Environment Variable

Click **Add New** for each variable below and add them:

#### Required Environment Variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `MONGO_URI` | `mongodb+srv://admin:admin@jobflowproject.pnfk4zk.mongodb.net/JOb_PORTAL?retryWrites=true&w=majority&appName=jobflowProject` | MongoDB connection string |
| `JWT_SECRET_KEY` | `fsfdgdrgrdgrdgrdyakjvkjhfrejgeoirfgrejgvie` | Secret key for JWT tokens |
| `JWT_EXPIRE` | `7d` | JWT token expiration time |
| `COOKIE_EXPIRE` | `7` | Cookie expiration in days |
| `CLOUDINARY_CLOUD_NAME` | `damzplhdi` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `539167313655194` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `3T1xSpju25enAsStTJyATu9i88M` | Cloudinary API secret |
| `SMTP_SERVICE` | `gmail` | Email service provider |
| `SMTP_MAIL` | `gargyashi6396@gmail.com` | Email address for sending emails |
| `SMTP_PASSWORD` | `ytjj mndv yqgp ztfb` | Gmail app password |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server host |
| `SMTP_PORT` | `465` | SMTP server port |
| `FRONTEND_URL` | `https://your-frontend-domain.vercel.app` | Your frontend URL (update with your actual domain) |
| `NODE_ENV` | `production` | Node environment (optional, Vercel sets this) |

### 3. Environment Selection

For each variable, make sure to select:
- ✅ **Production**
- ✅ **Preview** (optional, for testing)
- ✅ **Development** (optional, for local testing)

### 4. After Adding Variables

1. **Redeploy your application**:
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**

OR

2. **Push a new commit** to trigger a new deployment

## 🔍 How to Verify Environment Variables Are Set

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. You should see all the variables listed above
3. Check that they're enabled for **Production**

## ⚠️ Important Notes

1. **Never commit `.env` files** to Git - they contain sensitive information
2. **Update FRONTEND_URL** with your actual Vercel frontend domain
3. **Gmail App Password**: If `SMTP_PASSWORD` stops working, generate a new app password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

## 🐛 Troubleshooting

### Backend still not working?

1. **Check Vercel Logs**:
   - Go to **Deployments** → Click on latest deployment → **Functions** tab
   - Check for error messages

2. **Verify Database Connection**:
   - Check if `MONGO_URI` is correct
   - Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

3. **Test API Endpoint**:
   - Visit: `https://your-domain.vercel.app/api/v1/users/getuser`
   - Should return a response (even if error, means backend is running)

4. **Check Environment Variables**:
   - Make sure all variables are set
   - Check for typos in variable names
   - Ensure no extra spaces in values

## 📝 Quick Copy-Paste Values

Copy these exact values (update FRONTEND_URL with your domain):

```
MONGO_URI=mongodb+srv://admin:admin@jobflowproject.pnfk4zk.mongodb.net/JOb_PORTAL?retryWrites=true&w=majority&appName=jobflowProject
JWT_SECRET_KEY=fsfdgdrgrdgrdgrdyakjvkjhfrejgeoirfgrejgvie
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLOUDINARY_CLOUD_NAME=damzplhdi
CLOUDINARY_API_KEY=539167313655194
CLOUDINARY_API_SECRET=3T1xSpju25enAsStTJyATu9i88M
SMTP_SERVICE=gmail
SMTP_MAIL=gargyashi6396@gmail.com
SMTP_PASSWORD=ytjj mndv yqgp ztfb
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
FRONTEND_URL=https://your-actual-frontend-domain.vercel.app
NODE_ENV=production
```

## ✅ After Setup

Once all variables are set and you've redeployed:
1. Test your API: `https://your-domain.vercel.app/api/v1/users/getuser`
2. Check Vercel function logs for any errors
3. Test frontend-backend connection

