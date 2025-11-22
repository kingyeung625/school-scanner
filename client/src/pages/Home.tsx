import { useState, useMemo, useEffect } from 'react';
import { Menu, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageToggle from '@/components/LanguageToggle';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import SchoolListItem from '@/components/SchoolListItem';
import ComparisonBar from '@/components/ComparisonBar';
import SchoolDetail from '@/components/SchoolDetail';
import ComparisonView from '@/components/ComparisonView';
import { useLanguage } from '@/contexts/LanguageContext';
import { convertToSimplified } from '@/lib/i18n';
import { loadSchools } from '@/lib/csvParser';
import type { FilterState, School } from '@shared/school-schema';
import logoImage from '@/assets/01-logo.jpg';

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
      // Search in school name AND special features (bidirectional TC/SC matching)
      if (searchQuery) {
        // Normalize to Simplified Chinese for language-agnostic comparison
        // This allows TC users to search with SC characters and vice versa
        const query = convertToSimplified(searchQuery).toLowerCase();
        
        // Helper to normalize and lowercase any text for matching
        const normalizeAndLower = (text: string) => {
          if (!text) return '';
          return convertToSimplified(text).toLowerCase();
        };
        
        const nameMatch = normalizeAndLower(school.學校名稱).includes(query);
        const featuresMatch = school.特別室 ? normalizeAndLower(school.特別室).includes(query) : false;
        const facilitiesMatch = school.其他學校設施 ? normalizeAndLower(school.其他學校設施).includes(query) : false;
        
        if (!nameMatch && !featuresMatch && !facilitiesMatch) {
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
  }, [allSchools, filters, searchQuery, language]);

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
                  size="icon"
                  className="md:hidden"
                  data-testid="button-mobile-filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[300px]">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onClose={() => setMobileFiltersOpen(false)}
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
          
          <div className="max-w-2xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
              <div className="border rounded-md overflow-hidden">
                {filteredSchools.map((school) => (
                  <SchoolListItem
                    key={school.id}
                    school={school}
                    onViewDetails={handleViewDetails}
                    isSelected={selectedSchools.some(s => s.id === school.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            )}
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
