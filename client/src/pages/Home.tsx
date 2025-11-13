import { useState, useMemo } from 'react';
import { Menu, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageToggle from '@/components/LanguageToggle';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import SchoolCard from '@/components/SchoolCard';
import ComparisonBar from '@/components/ComparisonBar';
import SchoolDetail from '@/components/SchoolDetail';
import ComparisonView from '@/components/ComparisonView';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockSchools } from '@/lib/mockSchools';
import type { FilterState, School } from '@shared/school-schema';

export default function Home() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({
    區域: [],
    學校類別1: [],
    學生性別: [],
    宗教: [],
    教學語言: [],
    searchQuery: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
  const [detailSchool, setDetailSchool] = useState<School | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // TODO: remove mock functionality - replace with real data from API
  const filteredSchools = useMemo(() => {
    return mockSchools.filter((school) => {
      if (searchQuery && !school.學校名稱.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (filters.區域.length > 0 && !filters.區域.includes(school.區域)) {
        return false;
      }
      
      if (filters.學校類別1.length > 0 && !filters.學校類別1.includes(school.學校類別1)) {
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
      
      return true;
    });
  }, [filters, searchQuery]);

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
            
            <h1 className="text-2xl md:text-3xl font-semibold flex-1" data-testid="text-app-title">
              {t.appTitle}
            </h1>
            
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

            {filteredSchools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl font-medium mb-2">{t.noSchools}</p>
                <p className="text-muted-foreground">{t.noSchoolsDesc}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSchools.map((school) => (
                  <SchoolCard
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
