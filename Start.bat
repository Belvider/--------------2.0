@echo off
title PineApple Learning Portal
color 0A

echo.
echo  ============================================
echo   PineApple Learning Portal - Starting...
echo  ============================================
echo.

:: Paths
set NODE=%USERPROFILE%\node22\node.exe
set NPX=%USERPROFILE%\node22\npx.cmd
set PGBIN=%USERPROFILE%\pgsql\bin
set PGDATA=%USERPROFILE%\pgdata
set APP=%~dp0

:: Check Node.js
if not exist "%NODE%" (
  echo  [ERROR] Node.js not found at %NODE%
  pause & exit /b 1
)

:: Check PostgreSQL
if not exist "%PGBIN%\pg_ctl.exe" (
  echo  [ERROR] PostgreSQL not found at %PGBIN%
  pause & exit /b 1
)

:: Start PostgreSQL
echo  [1/3] Starting PostgreSQL...
"%PGBIN%\pg_ctl.exe" -D "%PGDATA%" status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  "%PGBIN%\pg_ctl.exe" -D "%PGDATA%" -l "%PGDATA%\server.log" start >nul 2>&1
  timeout /t 3 /nobreak >nul
  echo        PostgreSQL started.
) else (
  echo        PostgreSQL already running.
)

:: Wait for PostgreSQL to be ready
:pg_wait
"%PGBIN%\psql.exe" -U postgres -c "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  timeout /t 1 /nobreak >nul
  goto pg_wait
)

echo  [2/3] PostgreSQL ready.
echo  [3/3] Starting Next.js dev server...
echo.
echo  ============================================
echo   App running at: http://localhost:3000
echo   Press Ctrl+C to stop
echo  ============================================
echo.

:: Set environment variables
set DATABASE_URL=postgresql://postgres@localhost:5432/learning_portal
set DIRECT_URL=postgresql://postgres@localhost:5432/learning_portal
:: JWT_SECRET is loaded from the private .env file by Next.js.
set NEXT_PUBLIC_APP_NAME=Портал Навчання
set NEXT_PUBLIC_APP_URL=http://localhost:3000
set PATH=%USERPROFILE%\node22;%PGBIN%;%PATH%

:: Start Next.js
cd /d "%APP%"
"%USERPROFILE%\node22\node_modules\.bin\next.cmd" dev 2>&1

pause
