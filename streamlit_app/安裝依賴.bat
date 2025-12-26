@echo off
chcp 65001 >nul
title 安裝 Streamlit 依賴

echo ========================================
echo 安裝 Streamlit 應用依賴
echo ========================================
echo.

REM 檢查 Python 是否可用
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 未檢測到 Python！
    echo 請先安裝 Python 3.8 或更高版本
    echo 下載地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [信息] 檢測到 Python 版本:
python --version
echo.

echo [信息] 正在安裝依賴包...
echo 這可能需要幾分鐘時間，請耐心等待...
echo.

REM 升級 pip
echo [步驟 1/3] 升級 pip...
python -m pip install --upgrade pip
echo.

REM 安裝依賴
echo [步驟 2/3] 安裝 streamlit、pandas、opencc...
python -m pip install streamlit pandas opencc-python-reimplemented
if %errorlevel% neq 0 (
    echo.
    echo [錯誤] 安裝失敗！
    echo.
    echo 請嘗試手動安裝:
    echo   python -m pip install streamlit
    echo   python -m pip install pandas
    echo   python -m pip install opencc-python-reimplemented
    pause
    exit /b 1
)
echo.

REM 驗證安裝
echo [步驟 3/3] 驗證安裝...
python -c "import streamlit; print('Streamlit 版本:', streamlit.__version__)" 2>nul
if %errorlevel% neq 0 (
    echo [錯誤] Streamlit 安裝驗證失敗！
    pause
    exit /b 1
)

python -c "import pandas; print('Pandas 版本:', pandas.__version__)" 2>nul
python -c "import opencc; print('OpenCC 已安裝')" 2>nul

echo.
echo ========================================
echo [成功] 所有依賴已安裝完成！
echo ========================================
echo.
echo 現在可以運行 "啟動應用.bat" 來啟動應用
echo.
pause


