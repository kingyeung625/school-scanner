# 香港小學選校器 - Streamlit 版本啟動腳本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "香港小學選校器 - Streamlit 版本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "正在啟動應用..." -ForegroundColor Yellow
Write-Host ""

# 切換到腳本所在目錄
Set-Location $PSScriptRoot

# 運行 Streamlit
streamlit run app.py


