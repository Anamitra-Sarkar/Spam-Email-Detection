@echo off
REM Quick Start Script for Spam Email Detection Full Stack App
REM This script starts both backend and frontend servers

echo ==========================================
echo  SPAM EMAIL DETECTION - FULL STACK APP
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 14+ and try again
    pause
    exit /b 1
)

echo [1/4] Checking Python dependencies...
pip show fastapi >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Python dependencies...
    pip install -r requirements.txt
)

echo.
echo [2/4] Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo [3/4] Starting Backend Server...
echo Backend will run on http://localhost:8000
echo.
start "Backend Server" cmd /k "python backend_server.py"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Starting Frontend Server...
echo Frontend will run on http://localhost:3000
echo.
cd frontend
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo ==========================================
echo  SERVERS STARTED SUCCESSFULLY!
echo ==========================================
echo.
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
echo Press any key to open the application...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo To stop the servers, close both terminal windows
echo.
pause
