#!/bin/bash

echo "🚀 Installing Bryntum Gantt with Dataverse Integration"
echo "=================================================="

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ..
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Check for .env file
echo ""
echo "🔍 Checking configuration..."
if [ ! -f "server/.env" ]; then
    echo "⚠️  server/.env file not found"
    echo "📝 Creating server/.env from .env.example..."
    if [ -f "server/.env.example" ]; then
        cp server/.env.example server/.env
        echo "✅ Created server/.env - Please update it with your Dataverse credentials"
    else
        echo "❌ server/.env.example not found"
    fi
else
    echo "✅ server/.env file exists"
fi

echo ""
echo "✨ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your Dataverse credentials"
echo "2. Start backend: cd server && npm run dev"
echo "3. Start frontend: npm run dev"
echo ""
