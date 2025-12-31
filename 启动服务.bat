@echo off
chcp 65001 >nul
echo ========================================
echo   城小二项目启动脚本
echo ========================================
echo.

echo [1] 启动后端服务...
start "后端服务" cmd /k "cd /d "%~dp0chengxiaoer-backend test" && npm start"

timeout /t 2 >nul

echo [2] 启动管理后台...
start "管理后台" cmd /k "cd /d "%~dp0chengxiaoer-admin" && npm run dev"

echo.
echo ========================================
echo   服务已启动！
echo   后端: http://localhost:3000
echo   管理后台: http://localhost:5173
echo ========================================
echo.
echo 按任意键关闭此窗口...
pause >nul
