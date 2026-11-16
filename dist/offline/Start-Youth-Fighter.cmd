@echo off
cd /d "%~dp0"
if not exist "server.js" (
  echo Missing server.js. Extract the entire ZIP before running multiplayer.
  pause
  exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required for multiplayer. You can play solo by running PLAY-YOUTH-FIGHTER.cmd.
  pause
  exit /b 1
)
echo After the server starts, open http://localhost:8080 in Chrome or Edge.
node server.js
pause
