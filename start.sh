#!/bin/bash
# Quick Start Script for Spam Email Detection Full Stack App
# This script starts both backend and frontend servers

echo "=========================================="
echo " SPAM EMAIL DETECTION - FULL STACK APP"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed"
    echo "Please install Python 3.10+ and try again"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 14+ and try again"
    exit 1
fi

echo "[1/4] Checking Python dependencies..."
if ! python3 -c "import fastapi" &> /dev/null; then
    echo "Installing Python dependencies..."
    pip3 install -r requirements.txt
fi

echo ""
echo "[2/4] Checking frontend dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "[3/4] Starting Backend Server..."
echo "Backend will run on http://localhost:8000"
echo ""
python3 backend_server.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

echo ""
echo "[4/4] Starting Frontend Server..."
echo "Frontend will run on http://localhost:3000"
echo ""
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo " SERVERS STARTED SUCCESSFULLY!"
echo "=========================================="
echo ""
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
