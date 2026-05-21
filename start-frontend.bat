@echo off
title Financial RAG Frontend Server
echo ========================================
echo    Financial RAG Frontend Server
echo ========================================
echo.

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo Node.js %%v found

echo [2/3] Checking frontend dependencies...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo node_modules not found. Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo Frontend dependencies installed successfully
) else (
    echo Frontend dependencies already installed
)

echo [3/3] Starting frontend server...
echo.
echo ========================================
echo Frontend running at http://localhost:3000
echo Press Ctrl+C to stop the server
echo ========================================
echo.
npm start
