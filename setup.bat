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
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo [5/6] Installing frontend dependencies...
cd frontend
echo Installing npm packages...
npm install
cd ..

echo.
echo [6/6] Setting up environment variables...
if not exist "backend\.env" (
    echo Creating .env file template...
    echo # Groq API Key - Get your key from https://console.groq.com/ > backend\.env
    echo GROQ_API_KEY=your_groq_api_key_here >> backend\.env
    echo.
    echo IMPORTANT: Edit backend\.env and add your Groq API key
    echo Get your free API key from: https://console.groq.com/
) else (
    echo .env file already exists
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env and add your Groq API key
echo 2. Run start-all.bat to start the application
echo 3. Open http://localhost:3000 in your browser
echo.
echo Available commands:
echo - setup.bat: Install all dependencies
echo - start-all.bat: Start both backend and frontend servers
echo.
echo Press any key to exit...
pause >nul
