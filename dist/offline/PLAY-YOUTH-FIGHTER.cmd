@echo off
setlocal
cd /d "%~dp0"
if not exist "Youth-Fighter.html" (
  echo Extract the whole ZIP first, then run this launcher from the extracted folder.
  pause
  exit /b 1
)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "%~dp0Youth-Fighter.html"
  exit /b 0
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" "%~dp0Youth-Fighter.html"
  exit /b 0
)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%~dp0Youth-Fighter.html"
  exit /b 0
)
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
  start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" "%~dp0Youth-Fighter.html"
  exit /b 0
)
echo Open Chrome or Edge, press Ctrl+O, and choose Youth-Fighter.html in this folder.
pause
