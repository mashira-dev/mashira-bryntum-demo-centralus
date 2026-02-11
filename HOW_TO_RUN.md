# How to Run Backend and Frontend

## Prerequisites

Make sure you have:
- ✅ Node.js >= 20.0.0 installed
- ✅ All dependencies installed (run `npm install` in both directories)
- ✅ Backend `.env` file configured with Dataverse credentials

## Method 1: Run Separately (Recommended for Development)

### Step 1: Start Backend Server

Open **Terminal 1** (or Command Prompt):

```bash
cd server
npm run dev
```

**Expected Output:**
```
🚀 Server is running on http://localhost:3001
📊 Dataverse Environment: https://orgab553a6a.crm8.dynamics.com
📋 Table Name: eppm_projecttasks
```

**Keep this terminal open!** The backend must stay running.

### Step 2: Start Frontend Server

Open **Terminal 2** (new terminal/command prompt):

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 3: Open Browser

Navigate to: **http://localhost:5173** (or the port shown in Terminal 2)

## Method 2: Run Both with npm Scripts

### Option A: Using concurrently (if installed)

Create a script in root `package.json`:

```json
{
  "scripts": {
    "dev:all": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "npm run dev"
  }
}
```

Then run:
```bash
npm run dev:all
```

### Option B: Using separate terminals manually

1. **Terminal 1** - Backend:
```bash
cd server
npm run dev
```

2. **Terminal 2** - Frontend:
```bash
npm run dev
```

## Method 3: Using npm-run-all

Install npm-run-all globally:
```bash
npm install -g npm-run-all
```

Then run:
```bash
npm-run-all --parallel dev:server dev:client
```

## Verification Checklist

### Backend is Running ✅
- [ ] Terminal shows "Server is running on http://localhost:3001"
- [ ] No error messages about Dataverse connection
- [ ] Can access: http://localhost:3001/health (should return `{"status":"ok"}`)

### Frontend is Running ✅
- [ ] Terminal shows Vite server URL (usually http://localhost:5173)
- [ ] No compilation errors
- [ ] Browser opens automatically or can navigate manually

### Integration Works ✅
- [ ] Browser console shows no CORS errors
- [ ] Gantt chart loads (may be empty if no data)
- [ ] Network tab shows API calls to `/api/tasks`

## Troubleshooting

### Backend won't start

**Error: Port already in use**
```bash
# Find process using port 3001
# Windows:
netstat -ano | findstr :3001

# Linux/Mac:
lsof -i :3001

# Kill the process or change PORT in server/.env
```

**Error: Cannot find module**
```bash
cd server
npm install
```

**Error: Dataverse authentication failed**
- Check `.env` file exists in `server/` directory
- Verify all credentials are correct
- Ensure no extra spaces or quotes in `.env` file

### Frontend won't start

**Error: Port already in use**
- Vite will automatically use next available port
- Or specify port: `npm run dev -- --port 3000`

**Error: Cannot connect to backend**
- Verify backend is running on port 3001
- Check `VITE_API_URL` in root `.env` (if exists)
- Verify CORS is enabled (already configured)

**Error: Module not found**
```bash
npm install
```

### Both running but not connecting

1. **Check backend is accessible:**
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok","message":"Server is running"}
   ```

2. **Check API endpoint:**
   ```bash
   curl http://localhost:3001/api/tasks
   # Should return JSON with tasks data
   ```

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

## Quick Commands Reference

### Backend Only
```bash
cd server
npm run dev          # Development mode (with hot reload)
npm run build        # Build for production
npm start            # Run production build
```

### Frontend Only
```bash
npm run dev          # Development mode
npm run build        # Build for production
npm run preview      # Preview production build
```

### Both Together (Windows PowerShell)
```powershell
# Terminal 1
cd server; npm run dev

# Terminal 2 (new window)
npm run dev
```

### Both Together (Linux/Mac)
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2 (new tab)
npm run dev
```

## Production Deployment

### Backend Production
```bash
cd server
npm run build
npm start
```

### Frontend Production
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

## Stopping the Servers

- **Backend**: Press `Ctrl + C` in Terminal 1
- **Frontend**: Press `Ctrl + C` in Terminal 2

## Next Steps After Running

1. ✅ Verify both servers are running
2. ✅ Open browser to frontend URL
3. ✅ Check browser console for errors
4. ✅ Try creating a task in Gantt chart
5. ✅ Verify task appears in Dataverse

## Need Help?

- Check `QUICKSTART.md` for initial setup
- Check `SETUP.md` for detailed configuration
- Review error messages in terminal and browser console
- Verify Dataverse credentials and table structure
