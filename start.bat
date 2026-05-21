@echo off
REM Accountant Hub — one-click local launcher (Windows)
REM Opens two windows: Laravel API (port 8000) and Next.js Web (port 3000)

setlocal
set ROOT=%~dp0
set TOOLS=%ROOT%tools

echo.
echo === Accountant Hub — starting both servers ===
echo  - API  : http://127.0.0.1:8000
echo  - Web  : http://localhost:3000
echo.

REM Launch Laravel API in a new window
start "Accountant Hub — API"  cmd /k "set PATH=%TOOLS%;%TOOLS%\php;%PATH% && cd /d %ROOT%api && php artisan serve --host=127.0.0.1 --port=8000"

REM Launch Next.js in another new window
start "Accountant Hub — Web"  cmd /k "cd /d %ROOT%web && npm run dev"

echo Both servers are launching in their own windows.
echo Once they say "Ready", open: http://localhost:3000
echo.
echo Demo login:
echo    accountant@demo.com  /  password123
echo.
pause
