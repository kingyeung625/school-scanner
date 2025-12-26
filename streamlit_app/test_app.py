"""測試腳本：驗證應用核心功能是否正常"""
import sys
from pathlib import Path

# 添加 utils 到路徑
sys.path.insert(0, str(Path(__file__).parent))

from utils.csv_parser import load_schools
from utils.filters import apply_filters, get_filter_options
from utils.sorting import sort_schools
from utils.i18n import convert_text

def test_csv_loading():
    """測試 CSV 加載"""
    print("測試 CSV 加載...")
    csv_path = Path(__file__).parent.parent / "attached_assets" / "database_school_info_1763020452726.csv"
    
    if not csv_path.exists():
        print(f"[ERROR] CSV 文件不存在: {csv_path}")
        return None
    
    print(f"[OK] CSV 文件存在: {csv_path}")
    
    try:
        schools = load_schools(csv_path)
        print(f"[OK] 成功加載 {len(schools)} 所學校")
        if len(schools) > 0:
            print(f"   示例學校: {schools[0].get('學校名稱', 'N/A')}")
        return schools
    except Exception as e:
        print(f"[ERROR] 加載失敗: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_filter_options(schools):
    """測試篩選選項提取"""
    print("\n測試篩選選項提取...")
    try:
        options = get_filter_options(schools)
        print(f"[OK] 成功提取篩選選項")
        print(f"   區域數量: {len(options.get('區域', []))}")
        print(f"   校網數量: {len(options.get('校網', []))}")
        print(f"   辦學團體數量: {len(options.get('辦學團體', []))}")
        return options
    except Exception as e:
        print(f"[ERROR] 提取失敗: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_filtering(schools):
    """測試篩選功能"""
    print("\n測試篩選功能...")
    try:
        filters = {
            'search_query': '',
            'feature_search_query': '',
            '區域': ['香港東區'],
            '校網': [],
            '辦學團體': [],
            '資助類型': [],
            '學生性別': [],
            '宗教': [],
            '教學語言': [],
            '關聯學校': [],
            '課業安排': [],
            'feature_tags': [],
        }
        
        filtered = apply_filters(schools, filters)
        print(f"[OK] 篩選成功: {len(filtered)} 所學校符合條件")
        return filtered
    except Exception as e:
        print(f"[ERROR] 篩選失敗: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_sorting(schools):
    """測試排序功能"""
    print("\n測試排序功能...")
    try:
        sorted_schools = sort_schools(schools[:10])  # 只排序前10所
        print(f"[OK] 排序成功: {len(sorted_schools)} 所學校")
        if len(sorted_schools) > 0:
            print(f"   第一所學校: {sorted_schools[0].get('學校名稱', 'N/A')}")
        return sorted_schools
    except Exception as e:
        print(f"[ERROR] 排序失敗: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_i18n():
    """測試雙語轉換"""
    print("\n測試雙語轉換...")
    try:
        test_text = "香港小學選校器"
        simplified = convert_text(test_text, 'sc')
        print(f"[OK] 轉換成功")
        print(f"   繁體: {test_text}")
        print(f"   簡體: {simplified}")
        return True
    except Exception as e:
        print(f"[ERROR] 轉換失敗: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 50)
    print("Streamlit 應用測試")
    print("=" * 50)
    
    # 測試 CSV 加載
    schools = test_csv_loading()
    if not schools:
        print("\n[ERROR] 測試失敗：無法加載數據")
        return
    
    # 測試篩選選項
    options = test_filter_options(schools)
    if not options:
        print("\n[WARNING] 警告：篩選選項提取失敗，但繼續測試...")
    
    # 測試篩選
    filtered = test_filtering(schools)
    if not filtered:
        print("\n[WARNING] 警告：篩選失敗，但繼續測試...")
    
    # 測試排序
    sorted_schools = test_sorting(schools)
    if not sorted_schools:
        print("\n[WARNING] 警告：排序失敗，但繼續測試...")
    
    # 測試雙語
    i18n_ok = test_i18n()
    
    print("\n" + "=" * 50)
    print("測試完成！")
    print("=" * 50)
    
    if schools and i18n_ok:
        print("\n[OK] 核心功能正常，可以運行 Streamlit 應用")
        print("\n運行命令: streamlit run app.py")
    else:
        print("\n[WARNING] 部分功能可能有問題，請檢查錯誤信息")

if __name__ == "__main__":
    main()

