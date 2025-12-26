@echo off
chcp 65001 >nul
title 香港小學選校器 - Node.js 版本

echo ========================================
echo 香港小學選校器 - Node.js 版本
echo ========================================
echo.

REM 切換到腳本所在目錄
cd /d "%~dp0"

REM 檢查 Node.js 是否安裝
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 未檢測到 Node.js！
    echo.
    echo 請先安裝 Node.js:
    echo 下載地址: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [信息] 檢測到 Node.js 版本:
node --version
echo.

REM 檢查 npm 是否可用
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 未檢測到 npm！
    pause
    exit /b 1
)

echo [信息] 檢測到 npm 版本:
npm --version
echo.

REM 檢查並停止可能已運行的服務器（端口 5000）
echo [信息] 檢查端口 5000 是否被占用...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo [警告] 發現端口 5000 已被進程 %%a 占用
    echo [信息] 正在嘗試停止該進程...
    taskkill /F /PID %%a >nul 2>&1
    if %errorlevel% equ 0 (
        echo [成功] 已停止進程 %%a
        timeout /t 2 /nobreak >nul
    ) else (
        echo [警告] 無法停止進程 %%a，可能需要手動關閉
    )
)
echo.

REM 檢查 node_modules 是否存在
if not exist "node_modules" (
    echo [警告] 未檢測到 node_modules，正在安裝依賴...
    echo 這可能需要幾分鐘時間，請耐心等待...
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo.
        echo [錯誤] 依賴安裝失敗！
        echo 請檢查網絡連接或稍後再試
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [成功] 依賴安裝完成！
    echo.
) else (
    echo [信息] 檢測到 node_modules 目錄
    echo.
)

REM 檢查 TypeScript 編譯錯誤
echo [信息] 正在檢查代碼錯誤...
npm run check >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 發現 TypeScript 編譯錯誤，但將繼續啟動服務器
    echo 如果應用無法正常運行，請檢查終端中的錯誤信息
    echo.
) else (
    echo [成功] 代碼檢查通過
    echo.
)

echo ========================================
echo 正在啟動開發服務器...
echo ========================================
echo.
echo 服務器地址: http://localhost:5000
echo.
echo 提示：
echo - 瀏覽器將在服務器啟動後自動打開
echo - 如果瀏覽器未自動打開，請手動訪問 http://localhost:5000
echo - 按 Ctrl+C 可以停止應用
echo.
echo ========================================
echo.

REM 在後台啟動瀏覽器（延遲 8 秒，給服務器足夠的啟動時間）
start "" cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:5000"

REM 運行開發服務器（前台運行，這樣可以看到日誌）
npm run dev

REM 如果應用關閉，顯示提示
echo.
echo ========================================
echo 應用已關閉
echo ========================================
echo.
echo 如果遇到問題：
echo 1. 檢查端口 5000 是否被其他程序占用
echo 2. 確認 Node.js 和 npm 已正確安裝
echo 3. 嘗試刪除 node_modules 並重新運行此腳本
echo.
pause
