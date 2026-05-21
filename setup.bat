@echo off
title Financial RAG Setup
echo ========================================
echo    Financial RAG Application Setup
echo ========================================
echo.

echo [1/6] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)
echo Python found successfully

echo.
echo [2/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js found successfully

echo.
echo [3/6] Creating Python virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created
) else (
    echo Virtual environment already exists
)

echo.
echo [4/6] Activating virtual environment and installing backend dependencies...
call "%~dp0venv\Scripts\activate.bat"

echo Installing backend dependencies from requirements.txt...
pip install -r "%~dp0requirements.txt"
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root requirements. Trying backend-specific requirements...
    pip install -r "%~dp0backend\requirements.txt"
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)

echo.
echo [5/6] Installing frontend dependencies...
cd /d "%~dp0frontend"
echo Installing npm packages...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd /d "%~dp0"

echo.
echo [6/6] Setting up environment variables...
if not exist "%~dp0backend\.env" (
    echo Creating .env file from template...
    echo GROQ_API_KEY=your_groq_api_key_here > "%~dp0backend\.env"
    echo JWT_SECRET=change-this-to-a-long-random-secret-string >> "%~dp0backend\.env"
    echo.
    echo IMPORTANT: Edit backend\.env and fill in your values:
    echo   - GROQ_API_KEY: Get your free key from https://console.groq.com/
    echo   - JWT_SECRET:   Change to a long random secret string
) else (
    echo .env file already exists
    echo Checking for required keys...
    findstr /C:"JWT_SECRET" "%~dp0backend\.env" >nul 2>&1
    if %errorlevel% neq 0 (
        echo Adding missing JWT_SECRET to .env...
        echo JWT_SECRET=change-this-to-a-long-random-secret-string >> "%~dp0backend\.env"
        echo WARNING: Please update JWT_SECRET in backend\.env with a secure value!
    )
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env and set your GROQ_API_KEY and JWT_SECRET
echo 2. Run start-all.bat to start both servers
echo 3. Open http://localhost:3000 in your browser
echo.
echo Available commands:
echo - setup.bat        : Install all dependencies
echo - start-all.bat    : Start backend + frontend together
echo - start-backend.bat: Start only the backend server
echo - start-frontend.bat: Start only the frontend server
echo.
echo Press any key to exit...
pause >nul
