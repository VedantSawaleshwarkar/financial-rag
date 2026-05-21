@echo off
title Financial RAG Application Launcher
echo ========================================
echo    Financial RAG Application
echo ========================================
echo.

echo Checking virtual environment...
if not exist "%~dp0venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first to set up the project.
    pause
    exit /b 1
)

echo Checking backend .env file...
if not exist "%~dp0backend\.env" (
    echo ERROR: backend\.env not found!
    echo Please run setup.bat first and configure your API keys.
    pause
    exit /b 1
)

echo.
echo [1/3] Starting Backend Server (with venv)...
start "Financial RAG Backend" cmd /k "call \"%~dp0venv\Scripts\activate.bat\" && cd /d \"%~dp0backend\" && echo Backend starting on http://localhost:8000 && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/3] Waiting for backend to initialize...
timeout /t 7 /nobreak >nul

echo [3/3] Starting Frontend Server...
start "Financial RAG Frontend" cmd /k "cd /d \"%~dp0frontend\" && echo Frontend starting on http://localhost:3000 && npm start"

echo.
echo ========================================
echo    Servers Starting...
echo ========================================
echo Backend API:    http://localhost:8000
echo Frontend App:   http://localhost:3000
echo API Docs:       http://localhost:8000/docs
echo.

echo Waiting for frontend to be ready...
timeout /t 12 /nobreak >nul

echo Opening application in browser...
start http://localhost:3000

echo.
echo ========================================
echo    Application is running!
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Both server windows are open. Close them to stop the servers.
echo Press any key to close this launcher window...
pause >nul
