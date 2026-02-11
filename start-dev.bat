@echo off
echo ========================================
echo Starting Backend and Frontend Servers
echo ========================================
echo.

REM Check if node_modules exists
if not exist "server\node_modules" (
    echo Installing backend dependencies...
    cd server
    call npm install
    cd ..
    echo.
)

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    echo.
)

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window (servers will keep running)
pause >nul
