import { useState, useMemo, useEffect, Fragment, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import LanguageToggle from '@/components/LanguageToggle';
import SearchBar from '@/components/SearchBar';
import FilterSearchBar from '@/components/FilterSearchBar';
import FilterSearchBarWithInput from '@/components/FilterSearchBarWithInput';
import FilterButtonRow from '@/components/FilterButtonRow';
import ActiveFilters from '@/components/ActiveFilters';
import SchoolListItem from '@/components/SchoolListItem';
import SchoolListItemSkeleton from '@/components/SchoolListItemSkeleton';
import ComparisonBar from '@/components/ComparisonBar';
import SchoolDetail from '@/components/SchoolDetail';
import ComparisonView from '@/components/ComparisonView';
import AdBanner from '@/components/AdBanner';
import { Search, FilterX, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { convertToSimplified } from '@/lib/i18n';
import { loadSchools } from '@/lib/csvParser';
import { extractSchoolNetNumber, compareNamesByStrokes } from '@/lib/strokeSort';
import type { FilterState, School } from '@shared/school-schema';
import logoImage from '@/assets/01-logo.jpg';

// Popular feature tags based on CSV data analysis
// Note: For bilingual tags (e.g., "愉快/Happy School"), the part before "/" is used for searching
const POPULAR_TAGS = [
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
];


// Tag keyword mapping - defines which keywords to search for each tag
// Most tags search for themselves, but some tags search for multiple keywords (OR logic)
const TAG_KEYWORDS: Record<string, string[]> = {
  '兩文三語/英語教育': ['兩文三語', '英語學習', '英語活動'],
  'AI/人工智能': ['AI', '人工智能'],
  // All other tags search for themselves (extracted before "/" for bilingual tags)
};

export default function Home() {
  const { t, convertText, language } = useLanguage();
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    區域: [],
    校網: [],
    資助類型: [],
    學生性別: [],
    宗教: [],
    教學語言: [],
    關聯學校: [],
    辦學團體: [],
    課業安排: [],
    searchQuery: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [featureSearchQuery, setFeatureSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
  const [detailSchool, setDetailSchool] = useState<School | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load schools from CSV
  const loadSchoolsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const schools = await loadSchools();
      if (schools.length === 0) {
        throw new Error(language === 'tc' 
          ? '未能載入學校資料，請檢查網絡連接或稍後再試' 
          : '未能载入学校资料，请检查网络连接或稍后再试');
      }
      setAllSchools(schools);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load schools:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  }, [language]);

  // Load schools on mount
  useEffect(() => {
    loadSchoolsData();
  }, [loadSchoolsData]);

  // Dynamically calculate and sort sponsoring bodies by school count
  const sortedSponsoringBodies = useMemo(() => {
    // Extract all sponsoring bodies and count schools
    const bodyCounts: Record<string, number> = {};
    
    allSchools.forEach(school => {
      const sponsoringBody = school.辦學團體?.trim();
      if (sponsoringBody && sponsoringBody !== '-' && sponsoringBody !== '—' && sponsoringBody !== '－') {
        // Handle multiple sponsoring bodies (separated by comma or 、)
        const bodies = sponsoringBody.split(/[,、]/).map(b => b.trim());
        bodies.forEach(body => {
          if (body) {
            bodyCounts[body] = (bodyCounts[body] || 0) + 1;
          }
        });
      }
    });
    
    // Convert to array and sort
    const bodyArray = Object.keys(bodyCounts);
    
    return bodyArray.sort((a, b) => {
      // 1. Sort by school count (descending)
      const countA = bodyCounts[a];
      const countB = bodyCounts[b];
      if (countA !== countB) {
        return countB - countA; // Descending order
      }
      
      // 2. If counts are equal, sort by stroke count
      return compareNamesByStrokes(a, b);
    });
  }, [allSchools]);

  // Filter schools based on search and filter criteria
  const filteredSchools = useMemo(() => {
    return allSchools.filter((school) => {
      // Helper to normalize and lowercase any text for matching
      const normalizeAndLower = (text: string) => {
        if (!text) return '';
        return convertToSimplified(text).toLowerCase();
      };

      // Search by school name only (bidirectional TC/SC matching)
      if (searchQuery) {
        const query = convertToSimplified(searchQuery).toLowerCase();
        const nameMatch = normalizeAndLower(school.學校名稱).includes(query);
        
        if (!nameMatch) {
          return false;
        }
      }


      // Feature search query
      if (featureSearchQuery) {
        const query = convertToSimplified(featureSearchQuery).toLowerCase();
        
        const philosophyMatch = school.辦學宗旨 ? normalizeAndLower(school.辦學宗旨).includes(query) : false;
        const teachingStrategyMatch = school.學習和教學策略 ? normalizeAndLower(school.學習和教學策略).includes(query) : false;
        const schoolFeaturesMatch = school.學校特色_其他 ? normalizeAndLower(school.學校特色_其他).includes(query) : false;
        
        if (!philosophyMatch && !teachingStrategyMatch && !schoolFeaturesMatch) {
          return false;
        }
      }


      // Tag-based filtering (學校特色)
      if (selectedTags.length > 0) {
        const combinedText = [
          school.辦學宗旨 || '',
          school.學習和教學策略 || '',
          school.學校特色_其他 || ''
        ].join(' ');
        
        const normalizedCombined = normalizeAndLower(combinedText);
        
        // Check if ALL selected tags are present in the combined text
        const hasAllTags = selectedTags.every(tag => {
          // Check if this tag has multiple search keywords
          if (TAG_KEYWORDS[tag]) {
            // Multi-keyword tag: match if ANY keyword is found (OR logic)
            return TAG_KEYWORDS[tag].some(keyword => 
              normalizedCombined.includes(normalizeAndLower(keyword))
            );
          } else {
            // Single keyword tag: extract Chinese part before "/" for bilingual tags
            const searchTerm = tag.includes('/') ? tag.split('/')[0].trim() : tag;
            return normalizedCombined.includes(normalizeAndLower(searchTerm));
          }
        });
        
        if (!hasAllTags) {
          return false;
        }
      }

      // Filter by region (區域) - with proper trimming and empty value handling
      if (filters.區域.length > 0) {
        const schoolRegion = school.區域?.trim() || '';
        // Handle empty values or special markers
        if (!schoolRegion || schoolRegion === '-' || schoolRegion === '') {
          return false;
        }
        // Use some() for comparison, ensuring both sides are trimmed
        const hasMatch = filters.區域.some(filterRegion => 
          filterRegion.trim() === schoolRegion
        );
        if (!hasMatch) {
          return false;
        }
      }
      
      if (filters.資助類型.length > 0 && !filters.資助類型.includes(school.學校類別1)) {
        return false;
      }
      
      if (filters.學生性別.length > 0 && !filters.學生性別.includes(school.學生性別)) {
        return false;
      }
      
      if (filters.宗教.length > 0 && school.宗教 && !filters.宗教.includes(school.宗教)) {
        return false;
      }
      
      if (filters.教學語言.length > 0 && school.教學語言 && !filters.教學語言.includes(school.教學語言)) {
        return false;
      }
      
      // Filter by school network (校網) - handle multi-district codes like "11/12"
      if (filters.校網.length > 0) {
        if (!school.小一學校網 || school.小一學校網 === '/' || school.小一學校網.trim() === '') {
          return false;
        }
        const schoolNetworks = school.小一學校網.split('/').map(n => n.trim());
        const hasMatch = schoolNetworks.some(network => filters.校網.includes(network));
        if (!hasMatch) {
          return false;
        }
      }
      
      // Filter by linked schools (關聯學校) - matches 一條龍/直屬/聯繫
      if (filters.關聯學校.length > 0) {
        let hasLinkedSchool = false;
        
        for (const linkedType of filters.關聯學校) {
          if (linkedType === '一條龍' && school.一條龍中學 && school.一條龍中學 !== '-') {
            hasLinkedSchool = true;
            break;
          }
          if (linkedType === '直屬' && school.直屬中學 && school.直屬中學 !== '-') {
            hasLinkedSchool = true;
            break;
          }
          if (linkedType === '聯繫' && school.聯繫中學 && school.聯繫中學 !== '-') {
            hasLinkedSchool = true;
            break;
          }
        }
        
        if (!hasLinkedSchool) {
          return false;
        }
      }
      
      // Filter by sponsoring body (辦學團體)
      if (filters.辦學團體.length > 0) {
        // Treat empty strings, dashes, and other placeholders as missing data
        const sponsoringBody = school.辦學團體?.trim();
        if (!sponsoringBody || sponsoringBody === '-' || sponsoringBody === '—' || sponsoringBody === '－') {
          return false;
        }
        
        // Handle multiple sponsoring bodies separated by comma or 、
        const bodies = sponsoringBody.split(/[,、]/).map(b => b.trim());
        const hasMatch = bodies.some(body => filters.辦學團體.includes(body));
        
        if (!hasMatch) {
          return false;
        }
      }
      
      // Filter by homework arrangement (課業安排)
      if (filters.課業安排.length > 0) {
        // 下午安排導修時間
        if (filters.課業安排.includes('下午安排導修時間')) {
          const hasAfternoonTutorial = school.按校情靈活編排時間表_盡量在下午安排導修時段_讓學生能在教師指導下完成部分家課 === '是';
          if (!hasAfternoonTutorial) {
            return false;
          }
        }
        
        // 小一不設測考
        if (filters.課業安排.includes('小一不設測考')) {
          const noTest = (school.全年全科測驗次數_一年級 === '0' || school.全年全科測驗次數_一年級 === '-' || !school.全年全科測驗次數_一年級);
          const noExam = (school.全年全科考試次數_一年級 === '0' || school.全年全科考試次數_一年級 === '-' || !school.全年全科考試次數_一年級);
          if (!(noTest && noExam)) {
            return false;
          }
        }
        
        // 小一上學期以評估代替測考
        if (filters.課業安排.includes('小一上學期以評估代替測考')) {
          const hasAlternativeAssessment = school.小一上學期以多元化的進展性評估代替測驗及考試 === '是';
          if (!hasAlternativeAssessment) {
            return false;
          }
        }
      }
      
      return true;
    }).sort((a, b) => {
      // 1. First sort by school network number (ascending)
      const netA = extractSchoolNetNumber(a.小一學校網);
      const netB = extractSchoolNetNumber(b.小一學校網);
      if (netA !== netB) {
        return netA - netB;
      }
      
      // 2. Then sort by school name character by character by stroke count (ascending)
      return compareNamesByStrokes(a.學校名稱, b.學校名稱);
    });
  }, [allSchools, filters, searchQuery, featureSearchQuery, selectedTags, language]);

  const handleToggleSelect = (school: School) => {
    setSelectedSchools(prev => {
      const isSelected = prev.some(s => s.id === school.id);
      if (isSelected) {
        return prev.filter(s => s.id !== school.id);
      } else if (prev.length < 4) {
        return [...prev, school];
      }
      return prev;
    });
  };

  const handleViewDetails = (school: School) => {
    setDetailSchool(school);
  };

  const handleCompare = () => {
    setShowComparison(true);
  };

  const handleRemoveFromComparison = (school: School) => {
    setSelectedSchools(prev => prev.filter(s => s.id !== school.id));
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };


  const handleFilterToggle = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category] as string[];
    const isSelected = currentValues.includes(value);
    const newValues = isSelected
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setFilters({ ...filters, [category]: newValues });
  };

  const handleFilterRemove = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.filter(v => v !== value);
    setFilters({ ...filters, [category]: newValues });
  };

  const clearAllFilters = () => {
    setFilters({
      區域: [],
      校網: [],
      資助類型: [],
      學生性別: [],
      宗教: [],
      教學語言: [],
      關聯學校: [],
      辦學團體: [],
      課業安排: [],
      searchQuery: '',
    });
    setSearchQuery('');
    setFeatureSearchQuery('');
    setSelectedTags([]);
    setIsFilterOpen(true); // 自動展開篩選器
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'searchQuery' && Array.isArray(value) && value.length > 0
  );

  // Check if there is any filter condition applied
  const hasAnyFilter = 
    (searchQuery?.trim() || '').length > 0 ||
    (featureSearchQuery?.trim() || '').length > 0 ||
    selectedTags.length > 0 ||
    filters.區域.length > 0 ||
    filters.校網.length > 0 ||
    filters.資助類型.length > 0 ||
    filters.學生性別.length > 0 ||
    filters.宗教.length > 0 ||
    filters.教學語言.length > 0 ||
    filters.關聯學校.length > 0 ||
    filters.辦學團體.length > 0 ||
    filters.課業安排.length > 0;

  // Auto-expand filter when all filters are cleared
  useEffect(() => {
    if (!hasAnyFilter) {
      setIsFilterOpen(true);
    }
  }, [hasAnyFilter]);

  const filterOptions = {
    區域: ['香港東區', '香港南區', '灣仔區', '中西區', '九龍城區', '觀塘區', '深水埗區', '油尖旺區', '黃大仙區', '沙田區', '大埔區', '北區', '元朗區', '屯門區', '荃灣區', '葵青區', '離島區', '西貢區'],
    校網: ['11', '12', '14', '16', '18', '31', '32', '34', '35', '40', '41', '43', '45', '46', '48', '62', '65', '66', '70', '72', '74', '80', '81', '83', '84', '88', '89', '91', '95', '97', '98'],
    資助類型: ['資助', '官立', '私立', '直資'],
    學生性別: ['男女', '男', '女'],
    宗教: ['基督教', '天主教', '佛教', '道教', '伊斯蘭教', '不適用'],
    教學語言: ['中文', '中文及英文', '中文（包括：普通話）', '中文（包括：普通話）及英文'],
    關聯學校: ['一條龍', '直屬', '聯繫'],
    辦學團體: sortedSponsoringBodies,
    課業安排: ['下午安排導修時間', '小一不設測考', '小一上學期以評估代替測考'],
  };

  if (showComparison) {
    return (
      <ComparisonView
        schools={selectedSchools}
        onClose={() => setShowComparison(false)}
        onRemove={handleRemoveFromComparison}
      />
    );
  }

  if (detailSchool) {
    return <SchoolDetail school={detailSchool} onClose={() => setDetailSchool(null)} />;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header - 簡化版 */}
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-5">
              <a 
                href="https://www.hk01.com/zone/23/%E6%95%99%E8%82%B2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
                data-testid="link-logo"
              >
                <img 
                  src={logoImage} 
                  alt="01教育 Logo" 
                  className="h-16 md:h-20 lg:h-24 w-auto"
                  data-testid="img-logo"
                />
              </a>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-app-title">
                {t.appTitle}
              </h1>
            </div>
            <LanguageToggle />
          </div>
          
          {/* 活動篩選器（簡化版） */}
          {hasAnyFilter && (
            <div className="mt-2">
              <ActiveFilters
                filters={filters}
                onRemove={handleFilterRemove}
                onClearAll={clearAllFilters}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            {/* 篩選器區域 */}
            <div className="mb-4">
              <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <CollapsibleContent>
                  <div className="border rounded-lg p-3 md:p-4 bg-card shadow-sm">
                    <div className="space-y-3">
                      {/* 單欄項目：學校名稱、區域、校網、辦學團體、學校特色 */}
                      {/* 1. 搜尋學校名稱 */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap w-20 sm:w-24">
                          {language === 'tc' ? '學校名稱:' : '学校名称:'}
                        </span>
                        <div className="flex-1">
                          <SearchBar 
                            value={searchQuery} 
                            onChange={setSearchQuery}
                            placeholder={language === 'tc' ? '搜索學校名稱...' : '搜索学校名称...'}
                            data-testid="input-search-name"
                          />
                        </div>
                      </div>

                      {/* 2. 區域 */}
                      <FilterSearchBarWithInput
                        label={t.region}
                        options={filterOptions.區域}
                        selectedValues={filters.區域}
                        onToggle={(value) => handleFilterToggle('區域', value)}
                        onRemove={(value) => handleFilterRemove('區域', value)}
                        placeholder={language === 'tc' ? '請輸入或選擇區域...' : '请输入或选择区域...'}
                      />

                      {/* 3. 校網 */}
                      <FilterSearchBarWithInput
                        label={t.schoolNet}
                        options={filterOptions.校網}
                        selectedValues={filters.校網}
                        onToggle={(value) => handleFilterToggle('校網', value)}
                        onRemove={(value) => handleFilterRemove('校網', value)}
                        placeholder={language === 'tc' ? '請輸入或選擇校網...' : '请输入或选择校网...'}
                      />

                      {/* 4. 辦學團體 */}
                      <FilterSearchBarWithInput
                        label={convertText('辦學團體')}
                        options={filterOptions.辦學團體}
                        selectedValues={filters.辦學團體}
                        onToggle={(value) => handleFilterToggle('辦學團體', value)}
                        onRemove={(value) => handleFilterRemove('辦學團體', value)}
                        placeholder={language === 'tc' ? '請輸入或選擇辦學團體...' : '请输入或选择办学团体...'}
                      />

                      {/* 11. 學校特色 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap w-20 sm:w-24">
                            {language === 'tc' ? '學校特色:' : '学校特色:'}
                          </span>
                          <div className="flex-1">
                            <SearchBar 
                              value={featureSearchQuery} 
                              onChange={setFeatureSearchQuery}
                              placeholder={language === 'tc' ? '搜索學校特色...' : '搜索学校特色...'}
                              data-testid="input-search-features"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-20 sm:ml-24">
                          {POPULAR_TAGS.map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer hover-elevate active-elevate-2 text-xs"
                              onClick={() => handleToggleTag(tag)}
                              data-testid={`tag-${tag}`}
                            >
                              {convertText(tag)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* 多欄項目：其他可多選的篩選器 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {/* 5. 資助類型 */}
                        <FilterButtonRow
                          label={convertText('資助類型')}
                          options={filterOptions.資助類型}
                          selectedValues={filters.資助類型}
                          onToggle={(value) => handleFilterToggle('資助類型', value)}
                        />

                        {/* 6. 學生性別 */}
                        <FilterButtonRow
                          label={convertText('學生性別')}
                          options={filterOptions.學生性別}
                          selectedValues={filters.學生性別}
                          onToggle={(value) => handleFilterToggle('學生性別', value)}
                        />

                        {/* 7. 宗教 */}
                        <FilterButtonRow
                          label={convertText('宗教')}
                          options={filterOptions.宗教}
                          selectedValues={filters.宗教}
                          onToggle={(value) => handleFilterToggle('宗教', value)}
                        />

                        {/* 8. 教學語言 */}
                        <FilterButtonRow
                          label={convertText('教學語言')}
                          options={filterOptions.教學語言}
                          selectedValues={filters.教學語言}
                          onToggle={(value) => handleFilterToggle('教學語言', value)}
                        />

                        {/* 9. 關聯學校 */}
                        <FilterButtonRow
                          label={convertText('關聯學校')}
                          options={filterOptions.關聯學校}
                          selectedValues={filters.關聯學校}
                          onToggle={(value) => handleFilterToggle('關聯學校', value)}
                        />

                        {/* 10. 課業安排 */}
                        <FilterButtonRow
                          label={language === 'tc' ? '課業安排' : '课业安排'}
                          options={filterOptions.課業安排}
                          selectedValues={filters.課業安排}
                          onToggle={(value) => handleFilterToggle('課業安排', value)}
                        />
                      </div>

                      {/* 立即搜尋按鈕 */}
                      <div className="pt-1">
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => {
                            setIsFilterOpen(false);
                            setTimeout(() => {
                              if (resultsRef.current) {
                                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }}
                          data-testid="button-search-now"
                        >
                          {language === 'tc' ? '立即搜尋' : '立即搜索'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
                
                {/* 當摺疊時顯示展開按鈕 */}
                {!isFilterOpen && (
                  <div className="py-3">
                    <Button
                      className="w-full"
                      variant="default"
                      size="lg"
                      onClick={() => setIsFilterOpen(true)}
                      data-testid="button-show-filters"
                    >
                      {language === 'tc' ? '展開篩選' : '展开筛选'}
                    </Button>
                  </div>
                )}
              </Collapsible>
            </div>

            {/* 學校列表區域 */}
            <div ref={resultsRef}>
              {hasAnyFilter && (
                <div className="mb-6">
                  <p className="text-muted-foreground" data-testid="text-schools-count">
                    {filteredSchools.length} {t.schoolsFound}
                  </p>
                </div>
              )}

              {error ? (
                <div className="text-center py-16">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-destructive/10 p-4">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                  </div>
                  <p className="text-xl font-medium mb-2 text-destructive">
                    {language === 'tc' ? '載入失敗' : '载入失败'}
                  </p>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {error.message || (language === 'tc' 
                      ? '無法載入學校資料，請檢查網絡連接或稍後再試' 
                      : '无法载入学校资料，请检查网络连接或稍后再试')}
                  </p>
                  <Button
                    variant="default"
                    onClick={loadSchoolsData}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {language === 'tc' ? '重試' : '重试'}
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="border rounded-md overflow-hidden">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <SchoolListItemSkeleton key={index} />
                  ))}
                </div>
              ) : !hasAnyFilter ? (
                <div className="text-center py-16">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-muted p-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xl font-medium mb-2">
                    {language === 'tc' ? '請輸入搜尋條件或選擇篩選器' : '请输入搜索条件或选择筛选器'}
                  </p>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {language === 'tc' 
                      ? '您可以透過搜尋學校名稱、特色，或使用篩選器來尋找學校' 
                      : '您可以通过搜索学校名称、特色，或使用筛选器来寻找学校'}
                  </p>
                </div>
              ) : filteredSchools.length === 0 ? (
                <div className="text-center py-16">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-muted p-4">
                      <FilterX className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xl font-medium mb-2">{t.noSchools}</p>
                  <p className="text-muted-foreground mb-6">{t.noSchoolsDesc}</p>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="gap-2"
                  >
                    <FilterX className="h-4 w-4" />
                    {language === 'tc' ? '清除所有篩選' : '清除所有筛选'}
                  </Button>
                </div>
              ) : (
                <>
                  {/* Ad banner before first school */}
                  <div className="mb-6 flex justify-center">
                    <AdBanner />
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    {filteredSchools.map((school, index) => (
                      <Fragment key={school.id}>
                        <SchoolListItem
                          school={school}
                          onViewDetails={handleViewDetails}
                          isSelected={selectedSchools.some(s => s.id === school.id)}
                          onToggleSelect={handleToggleSelect}
                        />
                        {/* Insert ad after every 10th school */}
                        {(index + 1) % 10 === 0 && index < filteredSchools.length - 1 && (
                          <div className="border-t p-4 flex justify-center bg-muted/20">
                            <AdBanner />
                          </div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </>
              )}
              
              {/* Disclaimer footer */}
              <div className="mt-8 pt-4 border-t text-center">
                <p className="text-xs text-muted-foreground">
                  {convertText('以上資料取自《小學概覽》2025，只供參考，所有資訊應以學校官方公布作準')}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Comparison bar */}
      <ComparisonBar
        selectedSchools={selectedSchools}
        onRemove={handleRemoveFromComparison}
        onClear={() => setSelectedSchools([])}
        onCompare={handleCompare}
      />
    </div>
  );
}
