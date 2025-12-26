from typing import List, Dict, Any
import re

def extract_school_net_number(school_net: str) -> int:
    """提取校網編號（從 "11/12" 格式中提取第一個數字）"""
    if not school_net or str(school_net).strip() == '' or str(school_net) == '/':
        return 999  # 沒有校網的學校排在最後
    
    # 提取第一個數字
    match = re.search(r'\d+', str(school_net))
    if match:
        return int(match.group())
    
    return 999

def get_stroke_count(char: str) -> int:
    """獲取字符筆劃數近似值（使用 Unicode 編碼點）"""
    if not char:
        return 0
    # 使用 Unicode 編碼點作為筆劃數的近似值
    # 這對於中文字符來說是一個合理的近似
    return ord(char)

def compare_names_by_strokes(name_a: str, name_b: str) -> int:
    """按筆劃數比較學校名稱（逐字符比較）"""
    name_a = str(name_a) if name_a else ''
    name_b = str(name_b) if name_b else ''
    
    min_len = min(len(name_a), len(name_b))
    
    # 逐字符比較
    for i in range(min_len):
        strokes_a = get_stroke_count(name_a[i])
        strokes_b = get_stroke_count(name_b[i])
        if strokes_a != strokes_b:
            return strokes_a - strokes_b
    
    # 如果前面的字符都相同，較短的排在前面
    return len(name_a) - len(name_b)

def sort_schools(schools: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """排序學校：先按校網編號（升序），再按學校名稱筆劃（升序）"""
    def sort_key(school: Dict[str, Any]) -> tuple:
        # 第一優先級：校網編號
        net_num = extract_school_net_number(school.get('小一學校網', ''))
        
        # 第二優先級：學校名稱（用於筆劃排序）
        school_name = str(school.get('學校名稱', ''))
        
        # 返回排序鍵
        return (net_num, school_name)
    
    # 使用穩定的排序算法
    return sorted(schools, key=sort_key)


