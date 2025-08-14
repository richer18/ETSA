@echo off
echo Stopping Laravel server, React app, and XAMPP...

:: Kill Laravel artisan serve (php artisan serve)
taskkill /f /im php.exe >nul 2>&1

:: Kill React development server (runs under node.exe)
taskkill /f /im node.exe >nul 2>&1

:: Kill any running npm processes
taskkill /f /im npm.cmd >nul 2>&1

:: Stop XAMPP Apache and MySQL via control panel (xampp_stop.exe)
start "" "C:\xampp\xampp_stop.exe"

echo All servers attempted to stop.
pause
