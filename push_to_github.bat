@echo off
cd /d "%~dp0"

echo === Fazendo push do backend para o GitHub ===

git init
git add .
git commit -m "feat: garagem-pro-tire-search backend inicial" 2>nul || echo (commit ja existe, continuando...)
git remote add origin https://github.com/dstechno95-cell/garagem-tire-backend.git 2>nul || git remote set-url origin https://github.com/dstechno95-cell/garagem-tire-backend.git
git branch -M main
git push -u origin main

echo.
echo === Push concluido! ===
echo Acesse: https://github.com/dstechno95-cell/garagem-tire-backend
echo.
pause
