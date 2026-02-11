# Vercel Deployment Guide

This guide will help you deploy both the frontend and backend of your Gantt Chart application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you don't have one
2. **GitHub/GitLab/Bitbucket Account**: Your code should be in a Git repository
3. **Node.js**: Version 20.0.0 or higher (as specified in package.json)

## Project Structure

```
ganttchart/
├── api/                    # Vercel serverless functions (backend)
│   └── [...path].ts       # Catch-all API route
├── server/                 # Express backend source code
├── src/                   # React frontend source code
├── public/                # Static assets including gantt.umd.js
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json
```

## Step-by-Step Deployment Instructions

### Step 1: Prepare Your Codebase

1. **Ensure `index.html` is in the root directory**
   - ✅ File should exist at `index.html` (root level, same as `vite.config.ts`)
   - ❌ NOT in `public/` folder - Vite requires it in the root
   - The root `index.html` references `gantt.umd.js` which will be served from `public/`

2. **Ensure `gantt.umd.js` is in the `public/` folder**
   - ✅ File should exist at `public/gantt.umd.js`
   - This file will be automatically copied to `dist/` during build

3. **Verify build configuration**
   - The `vite.config.ts` is already configured correctly
   - Vite will automatically copy files from `public/` to `dist/` during build

### Step 2: Install Dependencies

Since Vercel needs access to both frontend and backend dependencies, we need to ensure all dependencies are available. The root `package.json` should include all necessary dependencies.

**Note**: If your backend dependencies are only in `server/package.json`, you may need to merge them or install them separately. For now, Vercel will install dependencies from the root `package.json`.

### Step 3: Set Up Environment Variables

Before deploying, you need to configure environment variables in Vercel:

#### Frontend Environment Variables:
- `VITE_API_URL` - Your API URL (will be set automatically after first deployment)

#### Backend Environment Variables:
- `DATAVERSE_ENVIRONMENT_URL` - Your Dataverse environment URL
- `DATAVERSE_TENANT_ID` - Azure AD tenant ID
- `DATAVERSE_CLIENT_ID` - Azure AD client ID
- `DATAVERSE_CLIENT_SECRET` - Azure AD client secret
- `DATAVERSE_TABLE_NAME` - Dataverse table name (default: `eppm_projecttasks`)
- `DATAVERSE_PROJECT_ID` - Project ID filter (optional)
- `DATAVERSE_TASK_ASSIGNMENTS_TABLE` - Task assignments table (optional)
- `DATAVERSE_PROJECTS_TABLE` - Projects table (optional)
- `PORT` - Server port (optional, defaults to 3001)

### Step 4: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"

2. **Import Your Repository**
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your `ganttchart` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Select "Vite" or "Other"
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all the environment variables listed in Step 3
   - Make sure to add them for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked about environment variables, add them or set them later in the dashboard

4. **For Production Deployment**
   ```bash
   vercel --prod
   ```

### Step 5: Configure API URL

After the first deployment:

1. **Get Your Deployment URL**
   - Your frontend will be deployed at: `https://your-project.vercel.app`
   - Your API will be available at: `https://your-project.vercel.app/api`

2. **Update Environment Variable**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add/Update `VITE_API_URL` with: `https://your-project.vercel.app/api`
   - Redeploy the project for the change to take effect

### Step 6: Verify Deployment

1. **Check Frontend**
   - Visit `https://your-project.vercel.app`
   - Verify that `gantt.umd.js` loads correctly
   - Check browser console for any errors

2. **Check Backend API**
   - Visit `https://your-project.vercel.app/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

3. **Test Gantt Chart**
   - Login to your application
   - Verify that the Gantt chart loads and displays data

## Troubleshooting

### Issue: `gantt.umd.js` not loading

**Solution**:
1. Check that `gantt.umd.js` exists in `public/` folder
2. Verify the file is copied to `dist/` after build
3. Check browser console for 404 errors
4. Ensure the file path in `public/index.html` is correct: `./gantt.umd.js`

### Issue: API routes returning 404

**Solution**:
1. Verify `api/[...path].ts` exists in the root directory
2. Check Vercel function logs in the dashboard
3. Ensure all backend dependencies are installed
4. Check that environment variables are set correctly

### Issue: CORS errors

**Solution**:
1. The CORS configuration in `api/[...path].ts` should handle this
2. Verify `VITE_API_URL` is set correctly
3. Check that the API URL matches your deployment URL

### Issue: Build fails

**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version is 20.0.0 or higher
4. Check for TypeScript errors

### Issue: Environment variables not working

**Solution**:
1. Ensure variables are set in Vercel dashboard
2. Variables must be prefixed with `VITE_` for frontend access
3. Redeploy after adding/changing environment variables
4. Check that variables are set for the correct environment (Production/Preview/Development)

## Important Notes

1. **Bryntum UMD File**: The `gantt.umd.js` file is included in your repository and will be served from the `public/` folder. No Bryntum credentials are needed.

2. **Serverless Functions**: The backend is deployed as Vercel serverless functions. Each API request may have a cold start delay (usually < 1 second).

3. **File Upload Limits**: Vercel has a 4.5MB request body limit for serverless functions on the Hobby plan. For larger files, consider upgrading or using a different storage solution.

4. **Function Timeout**: Serverless functions have a maximum execution time of 10 seconds on Hobby plan, 60 seconds on Pro plan. The configuration sets maxDuration to 30 seconds.

5. **Environment Variables**: Never commit sensitive environment variables to Git. Always use Vercel's environment variable settings.

## Alternative: Separate Frontend and Backend Deployments

If you prefer to deploy frontend and backend separately:

### Frontend Only:
- Deploy the root directory as a static site
- Set `VITE_API_URL` to your backend URL

### Backend Only:
- Deploy the `server/` directory as a separate Vercel project
- Configure it as a Node.js project
- Update frontend's `VITE_API_URL` to point to the backend URL

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] `gantt.umd.js` loads without errors
- [ ] API health check returns success
- [ ] Authentication works
- [ ] Gantt chart displays data
- [ ] CRUD operations work (Create, Read, Update, Delete)
- [ ] File import/export works (if applicable)
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] No console errors in browser

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Check Vercel function logs for backend errors
4. Verify all environment variables are set
5. Ensure `gantt.umd.js` is accessible

## Next Steps

After successful deployment:
1. Set up a custom domain (optional)
2. Configure automatic deployments from Git
3. Set up monitoring and error tracking
4. Configure preview deployments for pull requests
