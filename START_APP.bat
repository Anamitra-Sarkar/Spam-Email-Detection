@echo off
echo Starting Spam Email Detection System...

start "Backend Server" cmd /k "python -m uvicorn backend_server:app --reload --port 8000"
timeout /t 5

start "Frontend App" cmd /k "cd frontend_vite && npm run dev"

echo System started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
pause
