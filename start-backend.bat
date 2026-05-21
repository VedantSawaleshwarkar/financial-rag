@echo off
title Financial RAG Backend Server
echo ========================================
echo    Financial RAG Backend Server
echo ========================================
echo.

echo [1/5] Checking virtual environment...
if not exist "%~dp0venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first to create the virtual environment.
    pause
    exit /b 1
)

echo [2/5] Checking backend .env file...
if not exist "%~dp0backend\.env" (
    echo ERROR: backend\.env not found!
    echo Please run setup.bat first and configure your API keys.
    pause
    exit /b 1
)

echo [3/5] Activating virtual environment...
call "%~dp0venv\Scripts\activate.bat"

echo [4/5] Checking backend dependencies...
python -c "import uvicorn, fastapi, groq" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing backend dependencies...
    pip install -r "%~dp0requirements.txt"
    if %errorlevel% neq 0 (
        echo Trying backend-specific requirements...
        pip install -r "%~dp0backend\requirements.txt"
        if %errorlevel% neq 0 (
            echo ERROR: Failed to install backend dependencies
            pause
            exit /b 1
        )
    )
) else (
    echo Backend dependencies already installed
)

echo [5/5] Starting backend server...
cd /d "%~dp0backend"
echo.
echo ========================================
echo Backend running at http://localhost:8000
echo API Docs at     http://localhost:8000/docs
echo Press Ctrl+C to stop the server
echo ========================================
echo.
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
