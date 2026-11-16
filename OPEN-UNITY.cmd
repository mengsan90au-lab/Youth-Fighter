@echo off
setlocal
cd /d "%~dp0"
if not exist "UnityProject\Assets\Scripts\YouthFighterPrototype.cs" (
  echo Extract the full game ZIP first. The UnityProject folder is missing.
  pause
  exit /b 1
)
echo Youth Fighter native project: %~dp0UnityProject
echo Read UNITY-START-HERE.md for the exact setup steps.
for /d %%D in ("%ProgramFiles%\Unity\Hub\Editor\6000.6.*") do (
  if exist "%%~D\Editor\Unity.exe" (
    start "" "%%~D\Editor\Unity.exe" -projectPath "%~dp0UnityProject"
    exit /b 0
  )
)
if exist "%ProgramFiles%\Unity Hub\Unity Hub.exe" (
  echo In Hub: Wait for Unity 6.6 to finish installing, then Projects - Add - Add project from disk.
  echo Select the UnityProject folder shown above.
  start "" "%ProgramFiles%\Unity Hub\Unity Hub.exe"
  pause
  exit /b 0
)
echo Unity Hub was not found in its normal installation folder.
echo Opening Unity's official download page. Install Hub, sign in, and follow UNITY-START-HERE.md.
start "" "https://unity.com/download"
pause
