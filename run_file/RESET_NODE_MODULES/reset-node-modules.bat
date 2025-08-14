@echo off
set PROJECT_DIR=C:\xampp\htdocs\ETSA\my-app

echo 🧹 Removing node_modules and package-lock.json...
rmdir /s /q "%PROJECT_DIR%\node_modules"
del /f /q "%PROJECT_DIR%\package-lock.json"

echo 🧼 Cleaning npm cache...
cd /d "%PROJECT_DIR%"
npm cache clean --force

echo 📦 Reinstalling packages...
npm install

echo ✅ Done!
pause
