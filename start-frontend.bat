@echo off
title Financial RAG Frontend Server
echo ========================================
echo    Financial RAG Frontend Server
echo ========================================
echo.
echo Starting frontend on http://localhost:3000
echo Press Ctrl+C to stop the server
echo ========================================
cd /d "%~dp0frontend"
npm start
