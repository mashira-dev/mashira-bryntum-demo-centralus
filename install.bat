@echo off
echo 🚀 Installing Bryntum Gantt with Dataverse Integration
echo ==================================================

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ❌ Backend installation failed
    exit /b 1
)
echo ✅ Backend dependencies installed

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd ..
call npm install
if errorlevel 1 (
    echo ❌ Frontend installation failed
    exit /b 1
)
echo ✅ Frontend dependencies installed

REM Check for .env file
echo.
echo 🔍 Checking configuration...
if not exist "server\.env" (
    echo ⚠️  server\.env file not found
    echo 📝 Creating server\.env from .env.example...
    if exist "server\.env.example" (
        copy server\.env.example server\.env
        echo ✅ Created server\.env - Please update it with your Dataverse credentials
    ) else (
        echo ❌ server\.env.example not found
    )
) else (
    echo ✅ server\.env file exists
)

echo.
echo ✨ Installation complete!
echo.
echo Next steps:
echo 1. Update server\.env with your Dataverse credentials
echo 2. Start backend: cd server ^&^& npm run dev
echo 3. Start frontend: npm run dev
echo.
