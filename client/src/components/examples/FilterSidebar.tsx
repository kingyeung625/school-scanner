import { useState } from 'react';
import FilterSidebar from '../FilterSidebar';
import { LanguageProvider } from '@/contexts/LanguageContext';
import type { FilterState } from '@shared/school-schema';

export default function FilterSidebarExample() {
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

  return (
    <LanguageProvider>
      <div className="h-screen">
        <FilterSidebar filters={filters} onFilterChange={setFilters} />
      </div>
    </LanguageProvider>
  );
}
