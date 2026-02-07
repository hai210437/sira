@echo off
chcp 65001 >nul
echo ==========================================
echo  SIRA Website - Docker Build und Push
echo ==========================================
echo.

:: Backend bauen
echo [1/4] 🔨 Backend Docker Image wird gebaut...
cd "%~dp0sira\backend"
docker build -t davdocker70807/sirawebsite-backend:latest .
if %errorlevel% neq 0 (
    echo ❌ Backend Build fehlgeschlagen!
    pause
    exit /b 1
)
echo ✅ Backend Image gebaut!
echo.

:: Backend pushen
echo [2/4] ⬆️  Backend wird zu Docker Hub gepusht...
docker push davdocker70807/sirawebsite-backend:latest
if %errorlevel% neq 0 (
    echo ❌ Backend Push fehlgeschlagen!
    pause
    exit /b 1
)
echo ✅ Backend gepusht!
echo.

:: Frontend bauen
echo [3/4] 🔨 Frontend Docker Image wird gebaut...
cd "%~dp0sira\frontend"
docker build -t davdocker70807/sirawebsite-frontend:latest .
if %errorlevel% neq 0 (
    echo ❌ Frontend Build fehlgeschlagen!
    pause
    exit /b 1
)
echo ✅ Frontend Image gebaut!
echo.

:: Frontend pushen
echo [4/4] ⬆️  Frontend wird zu Docker Hub gepusht...
docker push davdocker70807/sirawebsite-frontend:latest
if %errorlevel% neq 0 (
    echo ❌ Frontend Push fehlgeschlagen!
    pause
    exit /b 1
)
echo ✅ Frontend gepusht!
echo.

echo ==========================================
echo  ✅ Fertig! Beide Images sind auf Docker Hub
echo ==========================================
echo.
echo Nächster Schritt:
echo - Gehe zu Portainer
echo - Update den Stack (Pull and redeploy)
echo.
pause
