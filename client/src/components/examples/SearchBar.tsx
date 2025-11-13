import { useState } from 'react';
import SearchBar from '../SearchBar';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function SearchBarExample() {
  const [search, setSearch] = useState('');

  return (
    <LanguageProvider>
      <div className="p-6 max-w-md">
        <SearchBar value={search} onChange={setSearch} />
      </div>
    </LanguageProvider>
  );
}
