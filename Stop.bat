@echo off
title PineApple Portal - Stopping
color 0C

echo.
echo  Stopping PineApple Learning Portal...
echo.

set PGBIN=%USERPROFILE%\pgsql\bin
set PGDATA=%USERPROFILE%\pgdata

:: Stop Node.js
echo  [1/2] Stopping Next.js...
taskkill /f /im node.exe >nul 2>&1
echo        Done.

:: Stop PostgreSQL
echo  [2/2] Stopping PostgreSQL...
"%PGBIN%\pg_ctl.exe" -D "%PGDATA%" stop >nul 2>&1
echo        Done.

echo.
echo  Portal stopped successfully.
timeout /t 2 /nobreak >nul
