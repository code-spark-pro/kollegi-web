@echo off
cd /d "%~dp0"
set "YANDEX=C:\Program Files\Yandex\YandexBrowser\Application\browser.exe"

if not exist "%YANDEX%" (
  echo Yandex Browser was not found.
  echo Open this address manually: http://127.0.0.1:8080/index.html
  pause
  exit /b 1
)

echo Starting Kollegi server...
start "Kollegi server" /min python -m http.server 8080 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" "%YANDEX%" "http://127.0.0.1:8080/index.html"

echo Site:  http://127.0.0.1:8080/index.html
echo Admin: http://127.0.0.1:8080/admin.html
