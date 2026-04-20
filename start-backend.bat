@echo off
title Financial RAG Backend Server
echo ========================================
echo    Financial RAG Backend Server
echo ========================================
echo.

echo [1/4] Checking virtual environment...
if not exist "%~dp0venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first to create the virtual environment.
    pause
    exit /b 1
)

echo [2/4] Activating virtual environment...
call "%~dp0venv\Scripts\activate.bat"

echo [3/4] Checking backend dependencies...
cd /d "%~dp0backend"
python -c "import uvicorn" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing backend dependencies...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)

echo [4/4] Starting backend server...
echo Starting backend on http://localhost:8000
echo Press Ctrl+C to stop the server
echo ========================================
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
