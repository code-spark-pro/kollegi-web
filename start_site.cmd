@echo off
cd /d "%~dp0"
echo Starting Kollegi...
start "Kollegi server" /min python -m http.server 8080 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8080/index.html"
echo Site:  http://127.0.0.1:8080/index.html
echo Admin: http://127.0.0.1:8080/admin.html
