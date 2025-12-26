try:
    from opencc import OpenCC
    _cc_tc_to_sc = OpenCC('t2s')
    _cc_sc_to_tc = OpenCC('s2t')
    _has_opencc = True
except ImportError:
    # 如果 opencc 未安裝，使用簡單的映射
    _cc_tc_to_sc = None
    _cc_sc_to_tc = None
    _has_opencc = False

def convert_text(text: str, target_lang: str = 'sc') -> str:
    """轉換文本（繁體 ↔ 簡體）
    
    Args:
        text: 要轉換的文本
        target_lang: 目標語言 ('sc' = 簡體, 'tc' = 繁體)
    
    Returns:
        轉換後的文本
    """
    if not text:
        return text
    
    if not _has_opencc:
        # 如果 opencc 未安裝，返回原文本
        return text
    
    try:
        if target_lang == 'sc':
            return _cc_tc_to_sc.convert(text)
        elif target_lang == 'tc':
            return _cc_sc_to_tc.convert(text)
    except Exception as e:
        print(f"Error converting text: {e}")
        return text
    
    return text

def get_language() -> str:
    """獲取當前語言設置（從 session state 讀取）"""
    # 這個函數將在 app.py 中通過參數傳遞
    return 'tc'


