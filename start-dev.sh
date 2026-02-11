#!/bin/bash

echo "========================================"
echo "Starting Backend and Frontend Servers"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "server/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd server
    npm install
    cd ..
    echo ""
fi

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo ""
fi

echo "Starting Backend Server..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

sleep 3

echo "Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Both servers are starting..."
echo "========================================"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
