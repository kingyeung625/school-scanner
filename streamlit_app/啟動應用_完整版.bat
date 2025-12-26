@echo off
chcp 65001 >nul
title 香港小學選校器 - Streamlit 版本

echo ========================================
echo 香港小學選校器 - Streamlit 版本
echo ========================================
echo.

REM 切換到腳本所在目錄
cd /d "%~dp0"

REM 檢查是否在正確的目錄
if not exist "app.py" (
    echo [錯誤] 找不到 app.py 文件！
    echo 請確保此 bat 文件在 streamlit_app 目錄中。
    pause
    exit /b 1
)

REM 檢查 streamlit 是否已安裝（使用 python -m 方式）
python -c "import streamlit" >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 未檢測到 streamlit，正在嘗試安裝...
    echo.
    python -m pip install streamlit pandas opencc-python-reimplemented
    if %errorlevel% neq 0 (
        echo.
        echo [錯誤] 依賴安裝失敗！
        echo 請手動運行: python -m pip install -r requirements.txt
        pause
        exit /b 1
    )
    echo.
    echo [成功] 依賴安裝完成！
    echo.
)

REM 檢查 CSV 文件是否存在
if not exist "..\attached_assets\database_school_info_1763020452726.csv" (
    echo [警告] 未找到 CSV 數據文件
    echo 請確保 CSV 文件在正確的位置
    echo.
)

echo 正在啟動應用...
echo 瀏覽器將自動打開 http://localhost:8501
echo.
echo 按 Ctrl+C 可以停止應用
echo ========================================
echo.

REM 運行 Streamlit 應用（使用 python -m 方式）
python -m streamlit run app.py

REM 如果應用關閉，顯示提示
echo.
echo ========================================
echo 應用已關閉
echo ========================================
pause

