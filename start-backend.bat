@echo off
title Financial RAG Backend Server
echo ========================================
echo    Financial RAG Backend Server
echo ========================================
echo.
echo Starting backend on http://localhost:8001
echo Press Ctrl+C to stop the server
echo ========================================
cd /d "%~dp0backend"
python -m uvicorn simple_main:app --reload --host 0.0.0.0 --port 8001
