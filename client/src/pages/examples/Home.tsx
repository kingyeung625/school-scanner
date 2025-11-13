import Home from '../Home';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function HomeExample() {
  return (
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  );
}
