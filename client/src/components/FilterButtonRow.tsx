import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterButtonRowProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export default function FilterButtonRow({
  label,
  options,
  selectedValues,
  onToggle,
}: FilterButtonRowProps) {
  const { convertText } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
      <div className="flex-shrink-0">
        <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
          {label}:
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 flex-1">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return (
            <Button
              key={option}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs sm:text-sm"
              onClick={() => onToggle(option)}
            >
              {convertText(option)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

