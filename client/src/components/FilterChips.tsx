import { useState } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FilterState } from '@shared/school-schema';

interface FilterChipsProps {
  category: keyof FilterState;
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onRemove: (value: string) => void;
  searchable?: boolean;
  columns?: number;
}

export default function FilterChips({
  category,
  label,
  options,
  selectedValues,
  onToggle,
  onRemove,
  searchable = false,
  columns = 1,
}: FilterChipsProps) {
  const { convertText, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Show chips directly if there are 10 or fewer options, otherwise use popover
  const showDirectChips = options.length <= 10;
  const maxVisibleChips = 8;
  const visibleOptions = showDirectChips ? options : options.slice(0, maxVisibleChips);
  const hasMoreOptions = !showDirectChips && options.length > maxVisibleChips;

  const filteredOptions = searchable && searchTerm
    ? options.filter(option =>
        convertText(option).toLowerCase().includes(convertText(searchTerm).toLowerCase())
      )
    : options;

  const gridClass = columns === 2 
    ? 'grid grid-cols-2 gap-2' 
    : 'flex flex-wrap gap-2';

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3 flex-wrap">
        <span className="text-sm font-medium text-foreground min-w-fit pt-1">
          {label}:
        </span>
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Selected chips */}
          {selectedValues.map((value) => (
            <Badge
              key={value}
              variant="default"
              className="cursor-pointer gap-1 pl-2 pr-1 py-1 hover:bg-primary/90"
              onClick={() => onRemove(value)}
            >
              <span>{convertText(value)}</span>
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {/* Direct chips for small option sets */}
          {showDirectChips && visibleOptions.map((option) => {
            const isSelected = selectedValues.includes(option);
            return (
              <Badge
                key={option}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2 transition-colors"
                onClick={() => onToggle(option)}
              >
                {convertText(option)}
              </Badge>
            );
          })}
          {/* Popover for selecting more options (when there are many options or searchable) */}
          {(!showDirectChips || searchable) && (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                >
                  <span>{searchable || hasMoreOptions ? (language === 'tc' ? '更多' : '更多') : (language === 'tc' ? '選擇' : '选择')}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
              <div className="space-y-3">
                {searchable && (
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={language === 'tc' ? `搜尋${label}...` : `搜索${label}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-7 pl-7 text-xs"
                    />
                  </div>
                )}
                <div className={gridClass}>
                  {filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option);
                    return (
                      <Button
                        key={option}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          onToggle(option);
                          if (!searchable) {
                            setIsOpen(false);
                          }
                        }}
                      >
                        {convertText(option)}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          )}
        </div>
      </div>
    </div>
  );
}

