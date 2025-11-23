import { useState, useMemo, useEffect, Fragment } from 'react';
import { Menu, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageToggle from '@/components/LanguageToggle';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import SchoolListItem from '@/components/SchoolListItem';
import ComparisonBar from '@/components/ComparisonBar';
import SchoolDetail from '@/components/SchoolDetail';
import ComparisonView from '@/components/ComparisonView';
import AdBanner from '@/components/AdBanner';
import { useLanguage } from '@/contexts/LanguageContext';
import { convertToSimplified } from '@/lib/i18n';
import { loadSchools } from '@/lib/csvParser';
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
  const [filters, setFilters] = useState<FilterState>({
    區域: [],
    校網: [],
    資助類型: [],
    學生性別: [],
    宗教: [],
    教學語言: [],
    關聯學校: [],
    searchQuery: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [featureSearchQuery, setFeatureSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
  const [detailSchool, setDetailSchool] = useState<School | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Load schools from CSV on mount
  useEffect(() => {
    loadSchools().then(schools => {
      setAllSchools(schools);
      setIsLoading(false);
    });
  }, []);

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

      // Feature search in 3 specific fields: 辦學宗旨, 學習和教學策略, 學校特色_其他
      if (featureSearchQuery) {
        const query = convertToSimplified(featureSearchQuery).toLowerCase();
        
        const philosophyMatch = school.辦學宗旨 ? normalizeAndLower(school.辦學宗旨).includes(query) : false;
        const teachingStrategyMatch = school.學習和教學策略 ? normalizeAndLower(school.學習和教學策略).includes(query) : false;
        const schoolFeaturesMatch = school.學校特色_其他 ? normalizeAndLower(school.學校特色_其他).includes(query) : false;
        
        if (!philosophyMatch && !teachingStrategyMatch && !schoolFeaturesMatch) {
          return false;
        }
      }

      // Tag-based filtering
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
      
      if (filters.區域.length > 0 && !filters.區域.includes(school.區域)) {
        return false;
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
      
      return true;
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
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="md:hidden gap-2"
                  data-testid="button-mobile-filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>{language === 'tc' ? '篩選' : '筛选'}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[300px]">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-3 flex-1">
              <img 
                src={logoImage} 
                alt="01教育 Logo" 
                className="h-10 md:h-12 w-auto"
                data-testid="img-logo"
              />
              <h1 className="text-2xl md:text-3xl font-semibold" data-testid="text-app-title">
                {t.appTitle}
              </h1>
            </div>
            
            <LanguageToggle />
          </div>
          
          <div className="max-w-2xl space-y-3">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder={language === 'tc' ? '搜索學校名稱...' : '搜索学校名称...'}
              data-testid="input-search-name"
            />
            <SearchBar 
              value={featureSearchQuery} 
              onChange={setFeatureSearchQuery}
              placeholder={language === 'tc' ? '搜索學校特色或設施...' : '搜索学校特色或设施...'}
              data-testid="input-search-features"
            />
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => handleToggleTag(tag)}
                  data-testid={`tag-${tag}`}
                >
                  {convertText(tag)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop filters */}
        <aside className="hidden md:block w-72 border-r bg-background">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </aside>

        {/* School list */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 pb-32">
            <div className="mb-6">
              <p className="text-muted-foreground" data-testid="text-schools-count">
                {filteredSchools.length} {t.schoolsFound}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-xl font-medium mb-2">{language === 'tc' ? '載入中...' : '载入中...'}</p>
                <p className="text-muted-foreground">{language === 'tc' ? '正在載入學校資料' : '正在载入学校资料'}</p>
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl font-medium mb-2">{t.noSchools}</p>
                <p className="text-muted-foreground">{t.noSchoolsDesc}</p>
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
