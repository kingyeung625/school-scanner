import SchoolCard from '../SchoolCard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { mockSchools } from '@/lib/mockSchools';

export default function SchoolCardExample() {
  const handleViewDetails = (school: any) => {
    console.log('View details:', school);
  };

  const handleToggleSelect = (school: any) => {
    console.log('Toggle select:', school);
  };

  return (
    <LanguageProvider>
      <div className="p-6 max-w-sm">
        <SchoolCard
          school={mockSchools[0]}
          onViewDetails={handleViewDetails}
          isSelected={false}
          onToggleSelect={handleToggleSelect}
        />
      </div>
    </LanguageProvider>
  );
}
