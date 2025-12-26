import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterSearchBarProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  placeholder?: string;
}

export default function FilterSearchBar({
  label,
  options,
  selectedValues,
  onToggle,
  placeholder,
}: FilterSearchBarProps) {
  const { convertText, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = searchTerm
    ? options.filter(option =>
        convertText(option).toLowerCase().includes(convertText(searchTerm).toLowerCase())
      )
    : options;

  const displayValue = selectedValues.length > 0
    ? selectedValues.map(v => convertText(v)).join(', ')
    : placeholder || (language === 'tc' ? '請選擇...' : '请选择...');

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground whitespace-nowrap min-w-fit">
          {label}:
        </span>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex-1">
          <CollapsibleTrigger asChild>
            <div className="relative w-full cursor-pointer">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={displayValue}
                readOnly
                placeholder={placeholder || (language === 'tc' ? '請選擇...' : '请选择...')}
                className="pl-10 pr-10 h-12 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="border rounded-md bg-card p-3 space-y-2 max-h-64 overflow-y-auto">
              {/* Search input inside dropdown */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={language === 'tc' ? '搜尋...' : '搜索...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 h-8 text-xs"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {/* Options list */}
              <div className="flex flex-wrap gap-2">
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <Button
                      key={option}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle(option);
                        setSearchTerm(''); // 清除搜尋詞
                        // 如果選項較少，選擇後自動關閉（可選）
                        if (options.length <= 5) {
                          setTimeout(() => setIsOpen(false), 100);
                        }
                      }}
                    >
                      {convertText(option)}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

