@echo off
:: ============================================================
:: start_frontend.bat — Starts the Vite dev server (port 5173)
:: Run this in a SEPARATE terminal from start_backend.bat
:: ============================================================

echo [1/3] Changing to frontend directory...
cd /d "%~dp0lostfound_frontend"

echo [2/3] Installing Node dependencies...
npm install

echo [3/3] Starting Vite dev server on http://localhost:5173 ...
npm run dev

pause
