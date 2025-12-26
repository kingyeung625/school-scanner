@echo off
chcp 65001 >nul
title 安裝 Node.js 依賴

echo ========================================
echo 安裝 Node.js 應用依賴
echo ========================================
echo.

REM 切換到腳本所在目錄
cd /d "%~dp0"

REM 檢查 Node.js 是否安裝
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 未檢測到 Node.js！
    echo.
    echo 請先安裝 Node.js 18 或更高版本
    echo 下載地址: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [信息] 檢測到 Node.js 版本:
node --version
echo.

REM 檢查 npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 未檢測到 npm！
    pause
    exit /b 1
)

echo [信息] 檢測到 npm 版本:
npm --version
echo.

echo [信息] 正在安裝依賴包...
echo 這可能需要幾分鐘時間，請耐心等待...
echo.

REM 安裝依賴
npm install

if %errorlevel% neq 0 (
    echo.
    echo [錯誤] 安裝失敗！
    echo.
    echo 請嘗試:
    echo   1. 檢查網絡連接
    echo   2. 清除緩存: npm cache clean --force
    echo   3. 刪除 node_modules 和 package-lock.json 後重新安裝
    pause
    exit /b 1
)

echo.
echo ========================================
echo [成功] 所有依賴已安裝完成！
echo ========================================
echo.
echo 現在可以運行 "啟動應用_NodeJS.bat" 來啟動應用
echo.
pause


