@echo off
cd /d "%~dp0"

echo === Iniciando repositório Git do backend ===

git init
git add .
git commit -m "feat: garagem-pro-tire-search backend inicial"

echo.
echo === Repositório criado com sucesso! ===
echo.
echo Próximo passo:
echo 1. Crie um repositório VAZIO no GitHub chamado: garagem-tire-backend
echo    (sem README, sem .gitignore — deixar tudo desmarcado)
echo.
echo 2. Volte aqui e rode o comando abaixo substituindo SEU_USUARIO:
echo    git remote add origin https://github.com/SEU_USUARIO/garagem-tire-backend.git
echo    git branch -M main
echo    git push -u origin main
echo.
pause
