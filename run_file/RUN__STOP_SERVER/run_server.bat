@echo off
echo Starting XAMPP Apache and MySQL...

:: Start XAMPP Apache
start "" "C:\xampp\xampp_start.exe"

:: Optional: wait a few seconds to ensure services are started
timeout /t 5 /nobreak >nul

echo Starting Laravel Backend...

:: Change to backend directory
cd /d C:\xampp\htdocs\ETSA\backend

:: Start Laravel server in new CMD window
start "" cmd /k "php artisan serve --host=192.168.101.109 --port=8000"

:: Wait a bit
timeout /t 3 /nobreak >nul

echo Starting React Frontend...

:: Change to frontend directory
cd /d C:\xampp\htdocs\ETSA\frontend

:: Start React app in new CMD window
start "" cmd /k "npm start"

echo All services are starting...
pause
