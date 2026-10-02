@echo off
chcp 65001 > nul
echo ========================================================
echo   Подготовка репозитория 12week-planner для GitHub
echo ========================================================
echo.
git init
git add .
git commit -m "Initial commit for 12-week planner mobile app"
git branch -M main
echo.
echo Репозиторий инициализирован локально!
echo Чтобы отправить на GitHub, убедитесь, что вы создали репозиторий 12week-planner на github.com,
echo а затем выполните команды:
echo.
echo   git remote add origin https://github.com/louiseelgin525-design/12week-planner.git
echo   git push -u origin main
echo.
pause
