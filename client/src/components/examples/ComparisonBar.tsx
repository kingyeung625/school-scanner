import { useState } from 'react';
import ComparisonBar from '../ComparisonBar';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { mockSchools } from '@/lib/mockSchools';

export default function ComparisonBarExample() {
  const [selected, setSelected] = useState(mockSchools.slice(0, 2));

  const handleRemove = (school: any) => {
    setSelected(prev => prev.filter(s => s.id !== school.id));
  };

  const handleClear = () => {
    setSelected([]);
  };

  const handleCompare = () => {
    console.log('Comparing schools:', selected);
  };

  return (
    <LanguageProvider>
      <div className="h-screen relative">
        <div className="p-6">
          <p className="text-muted-foreground">Comparison bar shown at bottom</p>
        </div>
        <ComparisonBar
          selectedSchools={selected}
          onRemove={handleRemove}
          onClear={handleClear}
          onCompare={handleCompare}
        />
      </div>
    </LanguageProvider>
  );
}
