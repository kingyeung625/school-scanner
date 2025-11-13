import { useState } from 'react';
import ComparisonView from '../ComparisonView';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { mockSchools } from '@/lib/mockSchools';

export default function ComparisonViewExample() {
  const [schools, setSchools] = useState(mockSchools.slice(0, 3));

  const handleClose = () => {
    console.log('Close comparison view');
  };

  const handleRemove = (school: any) => {
    setSchools(prev => prev.filter(s => s.id !== school.id));
  };

  return (
    <LanguageProvider>
      <ComparisonView schools={schools} onClose={handleClose} onRemove={handleRemove} />
    </LanguageProvider>
  );
}
