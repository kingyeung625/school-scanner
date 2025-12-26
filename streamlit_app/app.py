import streamlit as st
import pandas as pd
from pathlib import Path
import sys
from typing import List, Dict, Any

# 添加 utils 目錄到路徑
sys.path.append(str(Path(__file__).parent / "utils"))

from csv_parser import load_schools
from filters import apply_filters, get_filter_options
from sorting import sort_schools
from i18n import convert_text

# 頁面配置
st.set_page_config(
    page_title="香港小學選校器",
    page_icon="🏫",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 熱門標籤
POPULAR_TAGS = [
    'STEAM',
    'AI/人工智能',
    '愉快/Happy School',
    '關愛',
    '兩文三語/英語教育',
    '中華文化',
    '電子學習',
    '創意',
    '自主學習',
    '音樂',
    '體育',
    '藝術'
]

# 固定篩選選項
FIXED_FILTER_OPTIONS = {
    '資助類型': ['資助', '官立', '私立', '直資'],
    '學生性別': ['男女', '男', '女'],
    '宗教': ['基督教', '天主教', '佛教', '道教', '伊斯蘭教', '不適用'],
    '教學語言': ['中文', '中文及英文', '中文（包括：普通話）', '中文（包括：普通話）及英文'],
    '關聯學校': ['一條龍', '直屬', '聯繫'],
    '課業安排': ['下午安排導修時間', '小一不設測考', '小一上學期以評估代替測考'],
}

# 初始化 session state
if 'schools' not in st.session_state:
    st.session_state.schools = []
if 'language' not in st.session_state:
    st.session_state.language = 'tc'  # 'tc' = 繁體, 'sc' = 簡體
if 'filter_open' not in st.session_state:
    st.session_state.filter_open = True
if 'selected_schools' not in st.session_state:
    st.session_state.selected_schools = []
if 'detail_school' not in st.session_state:
    st.session_state.detail_school = None
if 'show_comparison' not in st.session_state:
    st.session_state.show_comparison = False

# 加載數據
@st.cache_data
def load_data():
    """加載學校數據"""
    # 嘗試多個可能的路徑
    possible_paths = [
        Path(__file__).parent.parent / "attached_assets" / "database_school_info_1763020452726.csv",
        Path("attached_assets") / "database_school_info_1763020452726.csv",
        Path(__file__).parent / "data" / "database_school_info_1763020452726.csv",
    ]
    
    csv_path = None
    for path in possible_paths:
        if path.exists():
            csv_path = path
            break
    
    if not csv_path:
        st.error(f"找不到 CSV 文件。請檢查以下路徑：")
        for path in possible_paths:
            st.write(f"- {path.absolute()}")
        return []
    
    return load_schools(csv_path)

def get_text(key: str, tc: str, sc: str = None) -> str:
    """獲取雙語文本"""
    if st.session_state.language == 'tc':
        return tc
    else:
        return sc or convert_text(tc, 'sc')

def render_filter_section(schools: List[Dict[str, Any]], filter_options: Dict[str, List[str]]):
    """渲染篩選區域"""
    lang = st.session_state.language
    
    # 使用 expander 實現可摺疊
    with st.expander(
        get_text("filter", "篩選條件", "筛选条件"),
        expanded=st.session_state.filter_open
    ):
        # 1. 搜尋學校名稱
        search_query = st.text_input(
            get_text("school_name", "學校名稱:", "学校名称:"),
            value=st.session_state.get('search_query', ''),
            key='input_search_name',
            placeholder=get_text("search_school_name", "搜索學校名稱...", "搜索学校名称...")
        )
        st.session_state.search_query = search_query
        
        st.divider()
        
        # 2. 區域
        region_options = filter_options.get('區域', [])
        selected_regions = st.multiselect(
            get_text("region", "區域", "区域"),
            options=region_options,
            default=st.session_state.get('filters_區域', []),
            key='filter_區域'
        )
        st.session_state.filters_區域 = selected_regions
        
        # 3. 校網
        school_net_options = filter_options.get('校網', [])
        selected_nets = st.multiselect(
            get_text("school_net", "校網", "校网"),
            options=school_net_options,
            default=st.session_state.get('filters_校網', []),
            key='filter_校網'
        )
        st.session_state.filters_校網 = selected_nets
        
        # 4. 辦學團體
        sponsoring_body_options = filter_options.get('辦學團體', [])
        selected_bodies = st.multiselect(
            get_text("sponsoring_body", "辦學團體", "办学团体"),
            options=sponsoring_body_options,
            default=st.session_state.get('filters_辦學團體', []),
            key='filter_辦學團體'
        )
        st.session_state.filters_辦學團體 = selected_bodies
        
        # 5. 資助類型
        funding_options = FIXED_FILTER_OPTIONS['資助類型']
        selected_funding = st.multiselect(
            get_text("funding_type", "資助類型", "资助类型"),
            options=funding_options,
            default=st.session_state.get('filters_資助類型', []),
            key='filter_資助類型'
        )
        st.session_state.filters_資助類型 = selected_funding
        
        # 6. 學生性別
        gender_options = FIXED_FILTER_OPTIONS['學生性別']
        selected_gender = st.multiselect(
            get_text("student_gender", "學生性別", "学生性别"),
            options=gender_options,
            default=st.session_state.get('filters_學生性別', []),
            key='filter_學生性別'
        )
        st.session_state.filters_學生性別 = selected_gender
        
        # 7. 宗教
        religion_options = FIXED_FILTER_OPTIONS['宗教']
        selected_religion = st.multiselect(
            get_text("religion", "宗教", "宗教"),
            options=religion_options,
            default=st.session_state.get('filters_宗教', []),
            key='filter_宗教'
        )
        st.session_state.filters_宗教 = selected_religion
        
        # 8. 教學語言
        language_options = FIXED_FILTER_OPTIONS['教學語言']
        selected_language = st.multiselect(
            get_text("teaching_language", "教學語言", "教学语言"),
            options=language_options,
            default=st.session_state.get('filters_教學語言', []),
            key='filter_教學語言'
        )
        st.session_state.filters_教學語言 = selected_language
        
        # 9. 關聯學校
        linked_options = FIXED_FILTER_OPTIONS['關聯學校']
        selected_linked = st.multiselect(
            get_text("linked_schools", "關聯學校", "关联学校"),
            options=linked_options,
            default=st.session_state.get('filters_關聯學校', []),
            key='filter_關聯學校'
        )
        st.session_state.filters_關聯學校 = selected_linked
        
        # 10. 課業安排
        homework_options = FIXED_FILTER_OPTIONS['課業安排']
        selected_homework = st.multiselect(
            get_text("homework_arrangement", "課業安排:", "课业安排:"),
            options=homework_options,
            default=st.session_state.get('filters_課業安排', []),
            key='filter_課業安排'
        )
        st.session_state.filters_課業安排 = selected_homework
        
        st.divider()
        
        # 11. 學校特色
        st.write(get_text("school_features", "學校特色:", "学校特色:"))
        feature_search_query = st.text_input(
            "",
            value=st.session_state.get('feature_search_query', ''),
            key='input_search_features',
            placeholder=get_text("search_features", "搜索學校特色...", "搜索学校特色..."),
            label_visibility="collapsed"
        )
        st.session_state.feature_search_query = feature_search_query
        
        # 熱門標籤
        selected_tags = st.session_state.get('selected_tags', [])
        tag_cols = st.columns(4)
        for i, tag in enumerate(POPULAR_TAGS):
            col_idx = i % 4
            with tag_cols[col_idx]:
                tag_display = convert_text(tag, st.session_state.language)
                is_selected = tag in selected_tags
                if st.button(
                    tag_display,
                    key=f'tag_{tag}',
                    use_container_width=True,
                    type="primary" if is_selected else "secondary"
                ):
                    if is_selected:
                        selected_tags.remove(tag)
                    else:
                        selected_tags.append(tag)
                    st.session_state.selected_tags = selected_tags
                    st.rerun()
        
        # 清除所有篩選
        if st.button(get_text("clear_all", "清除所有篩選", "清除所有筛选"), use_container_width=True):
            st.session_state.search_query = ''
            st.session_state.feature_search_query = ''
            st.session_state.filters_區域 = []
            st.session_state.filters_校網 = []
            st.session_state.filters_辦學團體 = []
            st.session_state.filters_資助類型 = []
            st.session_state.filters_學生性別 = []
            st.session_state.filters_宗教 = []
            st.session_state.filters_教學語言 = []
            st.session_state.filters_關聯學校 = []
            st.session_state.filters_課業安排 = []
            st.session_state.selected_tags = []
            st.rerun()

def has_any_filter() -> bool:
    """檢查是否有任何篩選條件"""
    if st.session_state.get('search_query', '').strip():
        return True
    if st.session_state.get('feature_search_query', '').strip():
        return True
    if st.session_state.get('filters_區域', []):
        return True
    if st.session_state.get('filters_校網', []):
        return True
    if st.session_state.get('filters_辦學團體', []):
        return True
    if st.session_state.get('filters_資助類型', []):
        return True
    if st.session_state.get('filters_學生性別', []):
        return True
    if st.session_state.get('filters_宗教', []):
        return True
    if st.session_state.get('filters_教學語言', []):
        return True
    if st.session_state.get('filters_關聯學校', []):
        return True
    if st.session_state.get('filters_課業安排', []):
        return True
    if st.session_state.get('selected_tags', []):
        return True
    return False

def render_school_card(school: Dict[str, Any], index: int):
    """渲染學校卡片"""
    lang = st.session_state.language
    school_name = convert_text(str(school.get('學校名稱', '')), lang)
    
    with st.container():
        col1, col2 = st.columns([1, 0.2])
        
        with col1:
            st.subheader(school_name)
            
            # 基本信息
            info_cols = st.columns(3)
            with info_cols[0]:
                region = convert_text(str(school.get('區域', '-')), lang)
                st.write(f"**{get_text('region', '區域', '区域')}:** {region}")
            with info_cols[1]:
                school_net = str(school.get('小一學校網', '-'))
                st.write(f"**{get_text('school_net', '校網', '校网')}:** {school_net}")
            with info_cols[2]:
                school_type = convert_text(str(school.get('學校類別1', '-')), lang)
                st.write(f"**{get_text('type', '類型', '类型')}:** {school_type}")
            
            # 更多信息
            more_cols = st.columns(3)
            with more_cols[0]:
                gender = convert_text(str(school.get('學生性別', '-')), lang)
                st.write(f"**{get_text('gender', '性別', '性别')}:** {gender}")
            with more_cols[1]:
                religion = convert_text(str(school.get('宗教', '-')), lang)
                st.write(f"**{get_text('religion', '宗教', '宗教')}:** {religion}")
            with more_cols[2]:
                teaching_lang = convert_text(str(school.get('教學語言', '-')), lang)
                st.write(f"**{get_text('language', '教學語言', '教学语言')}:** {teaching_lang}")
        
        with col2:
            # 比較複選框
            is_selected = any(s.get('id') == school.get('id') for s in st.session_state.selected_schools)
            if st.checkbox(
                get_text("compare", "比較", "比较"),
                value=is_selected,
                key=f'compare_{school.get("id")}'
            ):
                if not is_selected and len(st.session_state.selected_schools) < 4:
                    st.session_state.selected_schools.append(school)
            else:
                if is_selected:
                    st.session_state.selected_schools = [
                        s for s in st.session_state.selected_schools
                        if s.get('id') != school.get('id')
                    ]
            
            # 詳細資料按鈕
            if st.button(
                get_text("details", "詳細資料", "详细资料"),
                key=f'details_{school.get("id")}',
                use_container_width=True
            ):
                st.session_state.detail_school = school
                st.rerun()
        
        st.divider()

def render_comparison_view():
    """渲染比較視圖"""
    schools = st.session_state.selected_schools
    lang = st.session_state.language
    
    st.title(get_text("comparison", "學校比較", "学校比较"))
    
    if st.button(get_text("back", "返回", "返回")):
        st.session_state.show_comparison = False
        st.rerun()
    
    if len(schools) == 0:
        st.warning(get_text("no_schools_selected", "請選擇要比較的學校", "请选择要比较的学校"))
        return
    
    # 使用 tabs 顯示每所學校
    tabs = st.tabs([convert_text(str(s.get('學校名稱', '')), lang) for s in schools])
    
    for i, tab in enumerate(tabs):
        with tab:
            school = schools[i]
            render_school_detail(school, show_back=False)
    
    # 移除按鈕
    st.divider()
    st.write(get_text("remove_from_comparison", "從比較中移除:", "从比较中移除:"))
    remove_cols = st.columns(len(schools))
    for i, col in enumerate(remove_cols):
        with col:
            if st.button(
                get_text("remove", "移除", "移除"),
                key=f'remove_{schools[i].get("id")}',
                use_container_width=True
            ):
                st.session_state.selected_schools = [
                    s for s in st.session_state.selected_schools
                    if s.get('id') != schools[i].get('id')
                ]
                if len(st.session_state.selected_schools) == 0:
                    st.session_state.show_comparison = False
                st.rerun()

def render_school_detail(school: Dict[str, Any], show_back: bool = True):
    """渲染學校詳細信息"""
    lang = st.session_state.language
    school_name = convert_text(str(school.get('學校名稱', '')), lang)
    
    if show_back:
        st.title(school_name)
        if st.button(get_text("back", "返回", "返回")):
            st.session_state.detail_school = None
            st.rerun()
    else:
        st.header(school_name)
    
    # 使用 tabs 組織信息
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        get_text("basic_info", "基本資料", "基本资料"),
        get_text("facilities", "設施", "设施"),
        get_text("contact", "聯絡", "联络"),
        get_text("fees", "收費", "收费"),
        get_text("other", "其他", "其他")
    ])
    
    with tab1:
        st.write(f"**{get_text('region', '區域', '区域')}:** {convert_text(str(school.get('區域', '-')), lang)}")
        st.write(f"**{get_text('school_net', '校網', '校网')}:** {str(school.get('小一學校網', '-'))}")
        st.write(f"**{get_text('type', '類型', '类型')}:** {convert_text(str(school.get('學校類別1', '-')), lang)}")
        st.write(f"**{get_text('gender', '性別', '性别')}:** {convert_text(str(school.get('學生性別', '-')), lang)}")
        st.write(f"**{get_text('religion', '宗教', '宗教')}:** {convert_text(str(school.get('宗教', '-')), lang)}")
        st.write(f"**{get_text('language', '教學語言', '教学语言')}:** {convert_text(str(school.get('教學語言', '-')), lang)}")
        st.write(f"**{get_text('sponsoring_body', '辦學團體', '办学团体')}:** {convert_text(str(school.get('辦學團體', '-')), lang)}")
    
    with tab2:
        st.write(f"**{get_text('special_rooms', '特別室', '特别室')}:** {convert_text(str(school.get('特別室', '-')), lang)}")
        st.write(f"**{get_text('other_facilities', '其他學校設施', '其他学校设施')}:** {convert_text(str(school.get('其他學校設施', '-')), lang)}")
        st.write(f"**{get_text('sen_facilities', '支援有特殊教育需要學生的設施', '支援有特殊教育需要学生的设施')}:** {convert_text(str(school.get('支援有特殊教育需要學生的設施', '-')), lang)}")
    
    with tab3:
        st.write(f"**{get_text('address', '地址', '地址')}:** {convert_text(str(school.get('學校地址', '-')), lang)}")
        st.write(f"**{get_text('phone', '電話', '电话')}:** {str(school.get('學校電話', '-'))}")
        st.write(f"**{get_text('email', '電郵', '电邮')}:** {str(school.get('學校電郵', '-'))}")
        st.write(f"**{get_text('website', '網址', '网址')}:** {str(school.get('學校網址', '-'))}")
    
    with tab4:
        st.write(f"**{get_text('tuition', '學費', '学费')}:** {str(school.get('學費', '-'))}")
        st.write(f"**{get_text('other_fees', '其他收費', '其他收费')}:** {str(school.get('其他收費_費用', '-'))}")
    
    with tab5:
        st.write(f"**{get_text('philosophy', '辦學宗旨', '办学宗旨')}:** {convert_text(str(school.get('辦學宗旨', '-')), lang)}")
        st.write(f"**{get_text('school_style', '校風', '校风')}:** {convert_text(str(school.get('校風', '-')), lang)}")

# 主應用
def main():
    # 標題和語言切換
    col1, col2 = st.columns([3, 1])
    with col1:
        st.title("🏫 " + get_text("app_title", "香港小學選校器", "香港小学选校器"))
    with col2:
        lang = st.radio(
            "",
            ["繁體", "簡體"],
            horizontal=True,
            index=0 if st.session_state.language == 'tc' else 1,
            key='lang_selector'
        )
        st.session_state.language = 'tc' if lang == "繁體" else 'sc'
    
    # 加載學校數據
    if not st.session_state.schools:
        with st.spinner(get_text("loading", "正在加載學校數據...", "正在载入学校数据...")):
            st.session_state.schools = load_data()
            if st.session_state.schools:
                st.success(f"✅ {get_text('loaded', '已加載', '已载入')} {len(st.session_state.schools)} {get_text('schools', '所學校', '所学校')}")
    
    if not st.session_state.schools:
        st.error(get_text("error_loading", "無法加載學校數據", "无法载入学校数据"))
        return
    
    # 獲取篩選選項
    filter_options = get_filter_options(st.session_state.schools)
    
    # 側邊欄：篩選條件
    with st.sidebar:
        render_filter_section(st.session_state.schools, filter_options)
    
    # 主內容區域
    if st.session_state.show_comparison:
        render_comparison_view()
    elif st.session_state.detail_school:
        render_school_detail(st.session_state.detail_school)
    else:
        # 檢查是否有篩選條件
        has_filter = has_any_filter()
        
        if not has_filter:
            st.info(get_text("no_filter", "請輸入搜尋條件或選擇篩選器", "请输入搜索条件或选择筛选器"))
            return
        
        # 應用篩選
        filters = {
            'search_query': st.session_state.get('search_query', ''),
            'feature_search_query': st.session_state.get('feature_search_query', ''),
            '區域': st.session_state.get('filters_區域', []),
            '校網': st.session_state.get('filters_校網', []),
            '辦學團體': st.session_state.get('filters_辦學團體', []),
            '資助類型': st.session_state.get('filters_資助類型', []),
            '學生性別': st.session_state.get('filters_學生性別', []),
            '宗教': st.session_state.get('filters_宗教', []),
            '教學語言': st.session_state.get('filters_教學語言', []),
            '關聯學校': st.session_state.get('filters_關聯學校', []),
            '課業安排': st.session_state.get('filters_課業安排', []),
            'feature_tags': st.session_state.get('selected_tags', []),
        }
        
        filtered_schools = apply_filters(st.session_state.schools, filters)
        sorted_schools = sort_schools(filtered_schools)
        
        # 顯示結果數量
        st.write(f"**{len(sorted_schools)} {get_text('schools_found', '所學校符合條件', '所学校符合条件')}**")
        
        # 比較按鈕
        if st.session_state.selected_schools:
            col1, col2 = st.columns([1, 4])
            with col1:
                if st.button(
                    get_text("compare_selected", f"比較已選 ({len(st.session_state.selected_schools)})", f"比较已选 ({len(st.session_state.selected_schools)})"),
                    use_container_width=True
                ):
                    st.session_state.show_comparison = True
                    st.rerun()
        
        # 顯示學校列表
        for i, school in enumerate(sorted_schools):
            render_school_card(school, i)

if __name__ == "__main__":
    main()

