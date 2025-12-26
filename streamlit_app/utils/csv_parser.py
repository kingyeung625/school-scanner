import pandas as pd
from pathlib import Path
from typing import List, Dict, Any
import re

def load_schools(csv_path: Path) -> List[Dict[str, Any]]:
    """加載並解析 CSV 文件"""
    try:
        # 讀取 CSV 文件
        df = pd.read_csv(csv_path, encoding='utf-8')
        
        # 清理數據：將 NaN 和空值轉換為 '-'
        df = df.fillna('-')
        df = df.replace('', '-')
        
        # 轉換為字典列表
        schools = df.to_dict('records')
        
        # 清理和處理數據
        for i, school in enumerate(schools):
            # 添加 ID
            school['id'] = str(i + 1)
            
            # 清理所有字段：去除 HTML 標籤
            for key, value in school.items():
                if isinstance(value, str):
                    # 移除 HTML 標籤
                    value = re.sub(r'<[^>]+>', '', value)
                    # 處理辦學團體：移除 <br> 標籤
                    if key == '辦學團體':
                        value = re.sub(r'<br\s*/?>', '', value, flags=re.IGNORECASE)
                    # 處理特殊室等字段：移除所有 HTML
                    if key in ['特別室', '其他學校設施', '支援有特殊教育需要學生的設施']:
                        value = re.sub(r'<[^>]+>', '', value)
                    # 清理空白
                    value = value.strip()
                    # 空值或只有空白則設為 '-'
                    if not value or value == '':
                        value = '-'
                    school[key] = value
        
        # 過濾掉沒有學校名稱的記錄
        valid_schools = [
            school for school in schools
            if school.get('學校名稱') and str(school.get('學校名稱')).strip() != '' and str(school.get('學校名稱')).strip() != '-'
        ]
        
        return valid_schools
        
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return []


