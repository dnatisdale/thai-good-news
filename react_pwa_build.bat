@echo off
REM --- Build and Deploy React PWA with Logging and Git Setup Guide ---

set LOGFILE=build_deploy_log.txt

IF NOT EXIST package.json (
  echo ❌ package.json not found. Please run this script inside your React project folder. >> %LOGFILE%
  pause
  exit /b
)

REM Step 1: Install dependencies
echo Installing dependencies with legacy-peer-deps... >> %LOGFILE%
npm install --legacy-peer-deps >> %LOGFILE% 2>&1

REM Step 2: Run development server
echo. >> %LOGFILE%
echo Starting development server at http://localhost:3000 ... >> %LOGFILE%
start cmd /k "npm start"

REM Step 3: Build the production-ready PWA
echo. >> %LOGFILE%
echo Building production version... >> %LOGFILE%
npm run build >> %LOGFILE% 2>&1

REM Step 4: Git Setup Instructions
echo. >> %LOGFILE%
echo === Git Setup for Windows === >> %LOGFILE%
echo If 'git' is not recognized, install Git from: https://git-scm.com/download/win >> %LOGFILE%
echo Restart CMD after installing Git. >> %LOGFILE%
echo Then run these commands in your project folder: >> %LOGFILE%
echo 1. git init >> %LOGFILE%
echo 2. git add . >> %LOGFILE%
echo 3. git commit -m "Initial commit of Thai: Good News PWA" >> %LOGFILE%
echo 4. git branch -M main >> %LOGFILE%
echo 5. git remote add origin https://github.com/dnatisdale/thai-good-news.git >> %LOGFILE%
echo 6. git push -u origin main >> %LOGFILE%

echo. >> %LOGFILE%
echo ======================================= >> %LOGFILE%
echo ✅ Development server is running. >> %LOGFILE%
echo ✅ Production build is in the 'build' folder. >> %LOGFILE%
echo. >> %LOGFILE%
echo === Deployment Options === >> %LOGFILE%
echo 1. Deploy to Netlify: >> %LOGFILE%
echo    a) Go to https://www.netlify.com/ >> %LOGFILE%
echo    b) Drag and drop the 'build' folder. >> %LOGFILE%
echo    c) OR connect via GitHub after pushing the project. >> %LOGFILE%
echo. >> %LOGFILE%
echo 2. Deploy to Vercel: >> %LOGFILE%
echo    a) Install Vercel CLI: npm install -g vercel >> %LOGFILE%
echo    b) Run 'vercel' in this directory. >> %LOGFILE%
echo    c) Follow the prompts. >> %LOGFILE%
echo ======================================= >> %LOGFILE%
echo ✅ Your PWA will be installable on smartphones! >> %LOGFILE%
pause
