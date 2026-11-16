@echo off
cd /d "%~dp0"
if not exist "server.js" (
  echo Missing server.js. Extract the entire ZIP before running multiplayer.
  pause
  exit /b 1
)
set "YF_NODE="
where node >nul 2>nul
if not errorlevel 1 set "YF_NODE=node"
if not defined YF_NODE if exist "%ProgramFiles%\nodejs\node.exe" set "YF_NODE=%ProgramFiles%\nodejs\node.exe"
if not defined YF_NODE (
  echo Node.js is required for multiplayer. You can play solo by running PLAY-YOUTH-FIGHTER.cmd.
  pause
  exit /b 1
)
echo After the server starts, open http://localhost:8080 in Chrome or Edge.
"%YF_NODE%" server.js
pause
