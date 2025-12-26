import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FilterState } from '@shared/school-schema';

interface ActiveFiltersProps {
  filters: FilterState;
  onRemove: (category: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  const { t, convertText, language } = useLanguage();

  const getActiveFilterChips = () => {
    const chips: { category: keyof FilterState; value: string; label: string }[] = [];
    Object.entries(filters).forEach(([category, values]) => {
      if (category !== 'searchQuery' && Array.isArray(values)) {
        values.forEach(value => {
          chips.push({
            category: category as keyof FilterState,
            value,
            label: `${(t as any)[category] || convertText(category)}: ${convertText(value)}`,
          });
        });
      }
    });
    return chips;
  };

  const activeChips = getActiveFilterChips();

  if (activeChips.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/30 rounded-md border">
      <span className="text-sm font-medium text-muted-foreground min-w-fit">
        {language === 'tc' ? '已選篩選：' : '已选筛选：'}
      </span>
      <div className="flex items-center gap-2 flex-wrap flex-1">
        {activeChips.map((chip, idx) => (
          <Badge
            key={`${chip.category}-${chip.value}-${idx}`}
            variant="secondary"
            className="text-xs pl-2 pr-1 py-1 gap-1 cursor-pointer hover:bg-secondary/80"
            onClick={() => onRemove(chip.category, chip.value)}
          >
            <span>{chip.label}</span>
            <X className="h-3 w-3" />
          </Badge>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs h-7"
        data-testid="button-clear-all-filters"
      >
        {language === 'tc' ? '清除所有' : '清除所有'}
      </Button>
    </div>
  );
}

