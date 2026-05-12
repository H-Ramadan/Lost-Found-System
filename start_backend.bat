@echo off
:: ============================================================
:: start_backend.bat — Starts the Flask backend (port 5000)
:: Run this in a separate terminal window from the project root.
:: ============================================================

echo [1/3] Changing to backend directory...
cd /d "%~dp0lostfound_backend"

echo [2/3] Checking for virtual environment...
if exist venv\Scripts\python.exe (
    echo Using virtual environment...
    set PYTHON_CMD=venv\Scripts\python.exe
    set PIP_CMD=venv\Scripts\pip.exe
) else (
    echo Virtual environment not found, falling back to system python...
    set PYTHON_CMD=python
    set PIP_CMD=pip
)

echo [2/3] Installing Python dependencies...
%PIP_CMD% install -r requirements.txt

echo [3/3] Starting Flask server on http://localhost:5000 ...
%PYTHON_CMD% app.py

pause
