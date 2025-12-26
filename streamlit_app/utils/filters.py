from typing import List, Dict, Any
import re

def apply_filters(
    schools: List[Dict[str, Any]],
    filters: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """應用所有篩選條件
    
    Args:
        schools: 學校列表
        filters: 篩選條件字典
    
    Returns:
        篩選後的學校列表
    """
    filtered = schools
    
    # 學校名稱搜索
    if filters.get('search_query'):
        query = str(filters['search_query']).lower().strip()
        if query:
            filtered = [
                s for s in filtered 
                if query in str(s.get('學校名稱', '')).lower()
            ]
    
    # 學校特色搜索
    if filters.get('feature_search_query'):
        query = str(filters['feature_search_query']).lower().strip()
        if query:
            filtered = [
                s for s in filtered 
                if _matches_feature_search(s, query)
            ]
    
    # 區域篩選
    if filters.get('區域') and len(filters['區域']) > 0:
        filtered = [
            s for s in filtered 
            if str(s.get('區域', '')).strip() in filters['區域']
        ]
    
    # 校網篩選
    if filters.get('校網') and len(filters['校網']) > 0:
        filtered = [
            s for s in filtered 
            if _matches_network(s, filters['校網'])
        ]
    
    # 辦學團體篩選
    if filters.get('辦學團體') and len(filters['辦學團體']) > 0:
        filtered = [
            s for s in filtered 
            if _matches_sponsoring_body(s, filters['辦學團體'])
        ]
    
    # 資助類型篩選
    if filters.get('資助類型') and len(filters['資助類型']) > 0:
        filtered = [
            s for s in filtered 
            if str(s.get('學校類別1', '')).strip() in filters['資助類型']
        ]
    
    # 學生性別篩選
    if filters.get('學生性別') and len(filters['學生性別']) > 0:
        filtered = [
            s for s in filtered 
            if str(s.get('學生性別', '')).strip() in filters['學生性別']
        ]
    
    # 宗教篩選
    if filters.get('宗教') and len(filters['宗教']) > 0:
        filtered = [
            s for s in filtered 
            if str(s.get('宗教', '')).strip() in filters['宗教']
        ]
    
    # 教學語言篩選
    if filters.get('教學語言') and len(filters['教學語言']) > 0:
        filtered = [
            s for s in filtered 
            if str(s.get('教學語言', '')).strip() in filters['教學語言']
        ]
    
    # 關聯學校篩選
    if filters.get('關聯學校') and len(filters['關聯學校']) > 0:
        filtered = [
            s for s in filtered 
            if _matches_linked_schools(s, filters['關聯學校'])
        ]
    
    # 課業安排篩選
    if filters.get('課業安排') and len(filters['課業安排']) > 0:
        filtered = [
            s for s in filtered 
            if _matches_homework_arrangement(s, filters['課業安排'])
        ]
    
    # 學校特色標籤篩選
    if filters.get('feature_tags') and len(filters['feature_tags']) > 0:
        filtered = [
            s for s in filtered 
            if _matches_feature_tags(s, filters['feature_tags'])
        ]
    
    return filtered

def _matches_network(school: Dict, networks: List[str]) -> bool:
    """檢查學校是否匹配校網"""
    school_net = str(school.get('小一學校網', '')).strip()
    if not school_net or school_net == '/' or school_net == '-':
        return False
    
    # 處理多校網格式，如 "11/12"
    school_networks = [n.strip() for n in school_net.split('/')]
    return any(net in school_networks for net in networks)

def _matches_sponsoring_body(school: Dict, bodies: List[str]) -> bool:
    """檢查學校是否匹配辦學團體"""
    body = str(school.get('辦學團體', '')).strip()
    if not body or body in ['-', '—', '－', '']:
        return False
    
    # 處理多個辦學團體（用逗號或、分隔）
    school_bodies = re.split(r'[,、]', body)
    school_bodies = [b.strip() for b in school_bodies if b.strip()]
    
    return any(b in school_bodies for b in bodies)

def _matches_linked_schools(school: Dict, linked_types: List[str]) -> bool:
    """檢查學校是否匹配關聯學校類型"""
    for linked_type in linked_types:
        if linked_type == '一條龍':
            if school.get('一條龍中學') and str(school.get('一條龍中學', '')).strip() not in ['-', '', '—', '－']:
                return True
        elif linked_type == '直屬':
            if school.get('直屬中學') and str(school.get('直屬中學', '')).strip() not in ['-', '', '—', '－']:
                return True
        elif linked_type == '聯繫':
            if school.get('聯繫中學') and str(school.get('聯繫中學', '')).strip() not in ['-', '', '—', '－']:
                return True
    return False

def _matches_homework_arrangement(school: Dict, arrangements: List[str]) -> bool:
    """檢查學校是否匹配課業安排"""
    for arr in arrangements:
        if arr == '下午安排導修時間':
            field_value = str(school.get('按校情靈活編排時間表_盡量在下午安排導修時段_讓學生能在教師指導下完成部分家課', '')).strip()
            if field_value != '是':
                return False
        elif arr == '小一不設測考':
            test = str(school.get('全年全科測驗次數_一年級', '')).strip()
            exam = str(school.get('全年全科考試次數_一年級', '')).strip()
            if test not in ['0', '-', '', '—', '－'] or exam not in ['0', '-', '', '—', '－']:
                return False
        elif arr == '小一上學期以評估代替測考':
            field_value = str(school.get('小一上學期以多元化的進展性評估代替測驗及考試', '')).strip()
            if field_value != '是':
                return False
    return True

def _matches_feature_tags(school: Dict, tags: List[str]) -> bool:
    """檢查學校是否匹配特色標籤"""
    # 定義標籤關鍵詞映射
    tag_keywords = {
        '兩文三語/英語教育': ['兩文三語', '英語學習', '英語活動'],
        'AI/人工智能': ['AI', '人工智能'],
    }
    
    # 收集所有文本字段用於搜索
    search_fields = [
        '學校特色_其他',
        '學習和教學策略',
        '小學教育課程更新重點的發展',
        '共通能力的培養',
        '正確價值觀_態度和行為的培養',
        '全校參與照顧學生的多樣性',
        '辦學宗旨',
        '校風',
    ]
    
    # 構建搜索文本
    search_text = ' '.join([
        str(school.get(field, '')) for field in search_fields
    ]).lower()
    
    # 檢查每個標籤
    for tag in tags:
        # 獲取該標籤的關鍵詞
        keywords = tag_keywords.get(tag, [tag.split('/')[0]])
        
        # 檢查是否有任何關鍵詞出現在搜索文本中
        found = any(kw.lower() in search_text for kw in keywords)
        if not found:
            return False
    
    return True

def _matches_feature_search(school: Dict, query: str) -> bool:
    """檢查學校是否匹配特色搜索關鍵詞"""
    # 搜索的字段
    search_fields = [
        '學校特色_其他',
        '學習和教學策略',
        '小學教育課程更新重點的發展',
        '共通能力的培養',
        '正確價值觀_態度和行為的培養',
        '全校參與照顧學生的多樣性',
        '辦學宗旨',
        '校風',
    ]
    
    # 構建搜索文本
    search_text = ' '.join([
        str(school.get(field, '')) for field in search_fields
    ]).lower()
    
    return query in search_text

def get_filter_options(schools: List[Dict[str, Any]]) -> Dict[str, List[str]]:
    """從學校數據中提取所有可用的篩選選項"""
    options = {
        '區域': set(),
        '校網': set(),
        '資助類型': set(),
        '學生性別': set(),
        '宗教': set(),
        '教學語言': set(),
        '辦學團體': set(),
    }
    
    for school in schools:
        # 區域
        region = str(school.get('區域', '')).strip()
        if region and region not in ['-', '', '—', '－']:
            options['區域'].add(region)
        
        # 校網
        school_net = str(school.get('小一學校網', '')).strip()
        if school_net and school_net not in ['-', '', '/', '—', '－']:
            networks = [n.strip() for n in school_net.split('/') if n.strip()]
            options['校網'].update(networks)
        
        # 資助類型
        school_type = str(school.get('學校類別1', '')).strip()
        if school_type and school_type not in ['-', '', '—', '－']:
            options['資助類型'].add(school_type)
        
        # 學生性別
        gender = str(school.get('學生性別', '')).strip()
        if gender and gender not in ['-', '', '—', '－']:
            options['學生性別'].add(gender)
        
        # 宗教
        religion = str(school.get('宗教', '')).strip()
        if religion and religion not in ['-', '', '—', '－']:
            options['宗教'].add(religion)
        
        # 教學語言
        language = str(school.get('教學語言', '')).strip()
        if language and language not in ['-', '', '—', '－']:
            options['教學語言'].add(language)
        
        # 辦學團體
        body = str(school.get('辦學團體', '')).strip()
        if body and body not in ['-', '', '—', '－']:
            bodies = re.split(r'[,、]', body)
            for b in bodies:
                b = b.strip()
                if b:
                    options['辦學團體'].add(b)
    
    # 轉換為列表並排序
    result = {}
    for key, value_set in options.items():
        sorted_list = sorted(list(value_set))
        result[key] = sorted_list
    
    # 辦學團體需要特殊排序：按學校數量降序，然後按名稱排序
    if '辦學團體' in result:
        body_counts = {}
        for school in schools:
            body = str(school.get('辦學團體', '')).strip()
            if body and body not in ['-', '', '—', '－']:
                bodies = re.split(r'[,、]', body)
                for b in bodies:
                    b = b.strip()
                    if b:
                        body_counts[b] = body_counts.get(b, 0) + 1
        
        # 按數量降序，然後按名稱排序
        result['辦學團體'] = sorted(
            result['辦學團體'],
            key=lambda x: (-body_counts.get(x, 0), x)
        )
    
    return result

