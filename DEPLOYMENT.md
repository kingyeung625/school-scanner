# 部署指南

本指南將幫助您將選校器應用部署到線上運行。

## 項目結構

- **前端**: React + Vite (位於 `client/` 目錄)
- **後端**: Express + Node.js (位於 `server/` 目錄)
- **數據文件**: CSV 文件位於 `attached_assets/` 目錄

## 部署前準備

### 1. 構建項目

在本地先測試構建：

```bash
npm run build
```

這會：
- 構建前端到 `dist/public/`
- 構建後端到 `dist/index.js`

### 2. 測試生產環境

```bash
npm start
```

訪問 `http://localhost:5000` 確認一切正常。

## 部署方案

### 方案 1: Railway (推薦) ⭐

Railway 非常適合 Node.js 全棧應用，設置簡單。

#### 步驟：

1. **註冊 Railway 帳號**
   - 訪問 https://railway.app
   - 使用 GitHub 登錄

2. **創建新項目**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇您的倉庫

3. **配置環境變量**
   - 在項目設置中添加：
     - `NODE_ENV=production`
     - `PORT` (Railway 會自動提供，但可以手動設置)

4. **部署**
   - Railway 會自動檢測 `package.json` 並運行構建
   - 確保構建命令是：`npm run build`
   - 啟動命令是：`npm start`

5. **配置構建和啟動命令**
   - 在 Railway 項目設置中：
     - Build Command: `npm run build`
     - Start Command: `npm start`

6. **訪問應用**
   - Railway 會提供一個 `.railway.app` 域名
   - 也可以綁定自定義域名

---

### 方案 2: Render

Render 也對 Node.js 應用有很好的支持。

#### 步驟：

1. **註冊 Render 帳號**
   - 訪問 https://render.com
   - 使用 GitHub 登錄

2. **創建 Web Service**
   - 點擊 "New +" → "Web Service"
   - 連接您的 GitHub 倉庫

3. **配置服務**
   - **Name**: 給服務起個名字
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: 選擇免費或付費計劃

4. **環境變量**
   - 添加 `NODE_ENV=production`
   - `PORT` 會自動設置

5. **部署**
   - 點擊 "Create Web Service"
   - Render 會自動構建和部署

---

### 方案 3: Fly.io

Fly.io 適合需要全球部署的應用。

#### 步驟：

1. **安裝 Fly CLI**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **登錄 Fly.io**
   ```bash
   fly auth login
   ```

3. **初始化項目**
   ```bash
   fly launch
   ```
   - 選擇應用名稱
   - 選擇區域
   - 不要部署數據庫（如果提示）

4. **創建 `fly.toml` 配置文件**
   在項目根目錄創建 `fly.toml`:
   ```toml
   app = "your-app-name"
   primary_region = "hkg"  # 或選擇其他區域

   [build]
     builder = "paketobuildpacks/builder:base"

   [http_service]
     internal_port = 5000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
     processes = ["app"]

   [[services]]
     http_checks = []
     internal_port = 5000
     processes = ["app"]
     protocol = "tcp"
     script_checks = []
   ```

5. **部署**
   ```bash
   fly deploy
   ```

---

### 方案 4: 傳統 VPS (DigitalOcean, AWS EC2, 等)

如果您有自己的服務器，可以手動部署。

#### 步驟：

1. **準備服務器**
   - 安裝 Node.js (v18 或更高版本)
   - 安裝 npm

2. **上傳代碼**
   ```bash
   # 使用 git
   git clone <your-repo-url>
   cd school_scanner_crusor
   
   # 或使用 scp/rsync 上傳文件
   ```

3. **安裝依賴和構建**
   ```bash
   npm install
   npm run build
   ```

4. **使用 PM2 運行（推薦）**
   ```bash
   # 安裝 PM2
   npm install -g pm2
   
   # 啟動應用
   pm2 start dist/index.js --name school-scanner
   
   # 設置開機自啟
   pm2 startup
   pm2 save
   ```

5. **配置 Nginx 反向代理（可選）**
   創建 `/etc/nginx/sites-available/school-scanner`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   啟用配置：
   ```bash
   sudo ln -s /etc/nginx/sites-available/school-scanner /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 重要注意事項

### 1. 確保 CSV 文件被包含

確保 `attached_assets/` 目錄中的 CSV 文件被包含在部署中。這些文件需要：
- 在 Git 倉庫中（如果使用 Git 部署）
- 或在構建時複製到正確位置

### 2. 環境變量

生產環境需要設置：
- `NODE_ENV=production`
- `PORT` (通常由平台自動提供)

### 3. 端口配置

應用默認使用端口 5000，但大多數平台會通過環境變量 `PORT` 提供端口。

### 4. 靜態文件路徑

確保 `attached_assets` 目錄在生產環境中可訪問。服務器配置中已經設置了：
```javascript
app.use('/attached_assets', express.static(path.resolve(import.meta.dirname, '../attached_assets')));
```

---

## 推薦方案

對於初學者，我推薦使用 **Railway** 或 **Render**，因為：
- ✅ 設置簡單
- ✅ 自動構建和部署
- ✅ 免費計劃可用
- ✅ 自動 HTTPS
- ✅ 易於管理

---

## 部署後檢查清單

- [ ] 應用可以正常訪問
- [ ] CSV 數據文件可以正常加載
- [ ] 搜索和篩選功能正常
- [ ] 學校詳情頁面正常顯示
- [ ] 比較功能正常
- [ ] 移動設備響應式正常

---

## 故障排除

### 問題：構建失敗

**解決方案**：
- 檢查 Node.js 版本（需要 v18+）
- 確保所有依賴都正確安裝
- 檢查構建日誌中的錯誤信息

### 問題：CSV 文件無法加載

**解決方案**：
- 確認 `attached_assets/` 目錄在部署中
- 檢查文件路徑是否正確
- 查看瀏覽器控制台的網絡請求

### 問題：端口錯誤

**解決方案**：
- 確保使用環境變量 `PORT`
- 檢查平台的自動端口配置

---

## 需要幫助？

如果遇到問題，請檢查：
1. 平台部署日誌
2. 瀏覽器控制台錯誤
3. 服務器日誌

祝部署順利！🎉




