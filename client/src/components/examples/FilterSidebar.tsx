import { useState } from 'react';
import FilterSidebar from '../FilterSidebar';
import { LanguageProvider } from '@/contexts/LanguageContext';
import type { FilterState } from '@shared/school-schema';

export default function FilterSidebarExample() {
  const [filters, setFilters] = useState<FilterState>({
    區域: [],
    學校類別1: [],
    學生性別: [],
    宗教: [],
    教學語言: [],
    校網: [],
    師資: [],
    searchQuery: '',
  });

  return (
    <LanguageProvider>
      <div className="h-screen">
        <FilterSidebar filters={filters} onFilterChange={setFilters} />
      </div>
    </LanguageProvider>
  );
}
