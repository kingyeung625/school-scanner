# 快速啟動指南

## 本地運行

### 1. 安裝依賴

```bash
cd streamlit_app
pip install -r requirements.txt
```

### 2. 運行應用

```bash
streamlit run app.py
```

應用將自動在瀏覽器中打開 `http://localhost:8501`

## 部署到 Streamlit Cloud

### 步驟 1: 準備 GitHub 倉庫

1. 確保所有文件已提交到 GitHub
2. 確保 CSV 文件路徑正確（`../attached_assets/database_school_info_*.csv`）

### 步驟 2: 連接到 Streamlit Cloud

1. 訪問 https://share.streamlit.io/
2. 使用 GitHub 帳號登錄
3. 點擊 "New app"
4. 選擇：
   - **Repository**: 你的 GitHub 倉庫
   - **Branch**: main (或你的主分支)
   - **Main file path**: `streamlit_app/app.py`
5. 點擊 "Deploy"

### 步驟 3: 配置（如果需要）

如果 CSV 文件不在預期位置，可能需要調整 `app.py` 中的路徑：

```python
csv_path = Path(__file__).parent.parent / "attached_assets" / "database_school_info_1763020452726.csv"
```

## 故障排除

### 問題：找不到 CSV 文件

**解決方案**：
1. 檢查 CSV 文件路徑是否正確
2. 確保文件已提交到 GitHub（如果使用 Streamlit Cloud）
3. 檢查文件權限

### 問題：依賴安裝失敗

**解決方案**：
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 問題：應用運行緩慢

**解決方案**：
- 首次加載會較慢（需要解析 CSV）
- 後續訪問會使用緩存，速度更快

## 功能說明

### 篩選功能

- **學校名稱搜索**：直接搜索學校名稱
- **區域**：選擇學校所在區域
- **校網**：選擇小一學校網
- **辦學團體**：選擇辦學團體（按學校數量排序）
- **資助類型**：資助、官立、私立、直資
- **學生性別**：男女、男、女
- **宗教**：基督教、天主教、佛教等
- **教學語言**：中文、中英文等
- **關聯學校**：一條龍、直屬、聯繫
- **課業安排**：下午導修、小一不設測考等
- **學校特色**：通過標籤或關鍵詞搜索

### 比較功能

1. 在學校列表中勾選 "比較" 複選框（最多 4 所）
2. 點擊 "比較已選" 按鈕
3. 在比較視圖中查看詳細信息

### 詳細信息

點擊 "詳細資料" 按鈕查看學校的完整信息，包括：
- 基本資料
- 設施
- 聯絡方式
- 收費
- 其他信息

## 技術細節

- **框架**: Streamlit 1.28+
- **數據處理**: Pandas
- **雙語支持**: opencc-python-reimplemented
- **排序**: 自定義排序（校網 + 筆劃數）


