# Quick Start: Deploy to Vercel

## Pre-Deployment Checklist

- [x] ✅ `index.html` exists in **root directory** (not in `public/`)
- [x] ✅ `gantt.umd.js` exists in `public/` folder
- [x] ✅ `vercel.json` configured
- [x] ✅ `api/[...path].ts` created for backend
- [x] ✅ Backend dependencies added to root `package.json`
- [ ] ⏳ Environment variables configured in Vercel
- [ ] ⏳ Repository pushed to Git

## Quick Deployment Steps

### 1. Push to Git
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables (see below)
5. Click **Deploy**

### 3. Set Environment Variables

**Frontend:**
```
VITE_API_URL=https://your-project.vercel.app/api
```

**Backend:**
```
DATAVERSE_ENVIRONMENT_URL=your-dataverse-url
DATAVERSE_TENANT_ID=your-tenant-id
DATAVERSE_CLIENT_ID=your-client-id
DATAVERSE_CLIENT_SECRET=your-client-secret
DATAVERSE_TABLE_NAME=eppm_projecttasks
DATAVERSE_PROJECT_ID=your-project-id (optional)
```

### 4. Verify Deployment

- Frontend: `https://your-project.vercel.app`
- API Health: `https://your-project.vercel.app/api/health`
- API Tasks: `https://your-project.vercel.app/api/tasks/load`

## Important Notes

1. **gantt.umd.js**: Already included, no Bryntum credentials needed ✅
2. **API Routes**: Backend is deployed as serverless functions at `/api/*`
3. **Path Handling**: Express routes are mounted at `/tasks`, accessible via `/api/tasks`
4. **Environment Variables**: Must be set in Vercel dashboard, not in `.env` files

## Troubleshooting

**Build fails?**
- Check Node.js version (needs 20.0.0+)
- Verify all dependencies in root `package.json`
- Check build logs in Vercel dashboard

**API returns 404?**
- Verify `api/[...path].ts` exists
- Check function logs in Vercel dashboard
- Ensure environment variables are set

**gantt.umd.js not loading?**
- Verify file exists in `public/` folder
- Check browser console for 404 errors
- Ensure file is copied to `dist/` after build

## Need Help?

See `VERCEL_DEPLOYMENT.md` for detailed instructions.
