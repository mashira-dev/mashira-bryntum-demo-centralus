# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

- ✅ Node.js >= 20.0.0 installed
- ✅ Dataverse environment access
- ✅ App registration with client secret

## Step 1: Install Dependencies

### Windows
```bash
install.bat
```

### Linux/Mac
```bash
chmod +x install.sh
./install.sh
```

### Manual Installation
```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

## Step 2: Configure Backend

1. Navigate to `server` directory
2. Create `.env` file (or copy from `.env.example`)
3. Add your Dataverse credentials:

```env
PORT=3001
DATAVERSE_ENVIRONMENT_URL=https://orgab553a6a.crm8.dynamics.com
DATAVERSE_TENANT_ID=cf50b276-a7b3-4cd0-bd1f-a3a13316b1a5
DATAVERSE_CLIENT_ID=d7cedaf0-7f7e-4779-9985-37d8ac9fb8c0
DATAVERSE_CLIENT_SECRET=UVu8Q~X~oW9YsKw62ilL-yr1U-JxaNqLmut9TdAh
DATAVERSE_TABLE_NAME=eppm_projecttasks
```

## Step 3: Start Backend

```bash
cd server
npm run dev
```

Wait for: `🚀 Server is running on http://localhost:3001`

## Step 4: Start Frontend

Open a **new terminal**:

```bash
npm run dev
```

## Step 5: Open Browser

Navigate to: `http://localhost:5173` (or the port shown)

## Verify It Works

1. ✅ Backend shows "Server is running"
2. ✅ Frontend loads without errors
3. ✅ Gantt chart displays (may be empty if no data)
4. ✅ Browser console shows no errors

## First Task Creation

1. Right-click on the Gantt chart
2. Select "Add Task" or use the toolbar
3. Enter task name and dates
4. Task should save to Dataverse automatically

## Troubleshooting

### Backend won't start
- Check `.env` file exists and has correct values
- Verify Node.js version: `node --version` (should be >= 20)
- Check port 3001 is not in use

### Frontend can't connect
- Ensure backend is running
- Check `VITE_API_URL` in root `.env` (optional)
- Verify CORS is enabled (already configured)

### No data showing
- Check Dataverse table has records
- Verify table name matches `.env`
- Check browser console for API errors
- Test backend directly: `curl http://localhost:3001/api/tasks`

### Authentication errors
- Verify credentials in `.env`
- Check app registration permissions
- Ensure admin consent granted

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed setup
- Read [DATAVERSE_FIELD_MAPPING.md](./DATAVERSE_FIELD_MAPPING.md) for field customization
- Read [README.md](./README.md) for full documentation

## Need Help?

1. Check browser console for errors
2. Check backend terminal for errors
3. Verify Dataverse table structure
4. Review field mapping documentation
