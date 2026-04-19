@echo off
title Financial RAG Application Launcher
echo ========================================
echo    Financial RAG Application
echo ========================================
echo.

echo [1/3] Starting Backend Server...
start "Financial RAG Backend" /min cmd /c "cd /d \"%~dp0backend\" && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/3] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend Server...
start "Financial RAG Frontend" cmd /c "cd /d \"%~dp0frontend\" && npm start"

echo.
echo ========================================
echo    Servers Starting...
echo ========================================
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:3000
echo.

echo Waiting for frontend to be ready...
timeout /t 10 /nobreak >nul

echo Opening application in browser...
start http://localhost:3000

echo.
echo ========================================
echo Application is running!
echo ========================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
