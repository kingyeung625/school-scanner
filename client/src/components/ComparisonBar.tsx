import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { School } from '@shared/school-schema';

interface ComparisonBarProps {
  selectedSchools: School[];
  onRemove: (school: School) => void;
  onClear: () => void;
  onCompare: () => void;
}

export default function ComparisonBar({ selectedSchools, onRemove, onClear, onCompare }: ComparisonBarProps) {
  const { t, convertText } = useLanguage();

  if (selectedSchools.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">
                {t.comparing} {selectedSchools.length} {selectedSchools.length === 1 ? '' : ''}{t.schoolsFound}
              </span>
              {selectedSchools.length >= 4 && (
                <Badge variant="secondary" className="text-xs">
                  {t.maxComparison}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSchools.map((school) => (
                <Badge
                  key={school.id}
                  variant="default"
                  className="gap-1 py-1.5"
                  data-testid={`badge-selected-${school.id}`}
                >
                  <span className="max-w-[200px] truncate">
                    {convertText(school.學校名稱)}
                  </span>
                  <button
                    onClick={() => onRemove(school)}
                    className="hover-elevate active-elevate-2 rounded-sm"
                    data-testid={`button-remove-comparison-${school.id}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={onClear}
              className="flex-1 md:flex-none"
              data-testid="button-clear-comparison"
            >
              {t.clearComparison}
            </Button>
            <Button
              onClick={onCompare}
              disabled={selectedSchools.length < 2}
              className="flex-1 md:flex-none"
              data-testid="button-compare-schools"
            >
              {t.compareSchools}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
