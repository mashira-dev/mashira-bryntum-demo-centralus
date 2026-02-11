# Quick Run Instructions

## 🚀 Fastest Way to Run (Windows)

Double-click: **`start-dev.bat`**

This will:
- Install dependencies if needed
- Start backend server in one window
- Start frontend server in another window
- Open both automatically

## 🚀 Fastest Way to Run (Linux/Mac)

```bash
chmod +x start-dev.sh
./start-dev.sh
```

## 📋 Manual Method (Step by Step)

### Terminal 1 - Backend

```bash
cd server
npm install          # First time only
npm run dev
```

**Wait for:** `🚀 Server is running on http://localhost:3001`

### Terminal 2 - Frontend

```bash
npm install          # First time only
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

### Open Browser

Go to: **http://localhost:5173**

## ✅ Verify It's Working

1. Backend terminal shows: "Server is running"
2. Frontend terminal shows: "Local: http://localhost:5173"
3. Browser opens and shows Gantt chart
4. No errors in browser console (F12)

## 🛑 To Stop

- **Backend**: Press `Ctrl + C` in Terminal 1
- **Frontend**: Press `Ctrl + C` in Terminal 2
- **Or**: Close the terminal windows

## ❌ Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org

### "Port already in use"
- Close other applications using ports 3001 or 5173
- Or change ports in configuration

### "Cannot find module"
- Run `npm install` in both directories

### Backend won't start
- Check `server/.env` file exists
- Verify Dataverse credentials are correct

### Frontend can't connect
- Make sure backend is running first
- Check backend URL in browser console

## 📚 More Details

See `HOW_TO_RUN.md` for detailed instructions and troubleshooting.
