import SchoolDetail from '../SchoolDetail';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { mockSchools } from '@/lib/mockSchools';

export default function SchoolDetailExample() {
  const handleClose = () => {
    console.log('Close detail view');
  };

  return (
    <LanguageProvider>
      <SchoolDetail school={mockSchools[0]} onClose={handleClose} />
    </LanguageProvider>
  );
}
