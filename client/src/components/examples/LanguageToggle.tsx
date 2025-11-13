import LanguageToggle from '../LanguageToggle';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function LanguageToggleExample() {
  return (
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  );
}
