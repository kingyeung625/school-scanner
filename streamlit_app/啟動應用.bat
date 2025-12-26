@echo off
chcp 65001 >nul
echo ========================================
echo 香港小學選校器 - Streamlit 版本
echo ========================================
echo.

REM 切換到腳本所在目錄
cd /d "%~dp0"

REM 檢查 streamlit 是否可用
python -c "import streamlit" >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 未檢測到 streamlit！
    echo.
    echo 正在嘗試安裝 streamlit...
    python -m pip install streamlit pandas opencc-python-reimplemented
    if %errorlevel% neq 0 (
        echo.
        echo [錯誤] 安裝失敗！
        echo 請手動運行: python -m pip install -r requirements.txt
        pause
        exit /b 1
    )
    echo.
    echo [成功] 安裝完成！
    echo.
)

echo 正在啟動應用...
echo 瀏覽器將自動打開 http://localhost:8501
echo.
echo 按 Ctrl+C 可以停止應用
echo ========================================
echo.

REM 使用 python -m streamlit 而不是直接 streamlit
python -m streamlit run app.py

pause

