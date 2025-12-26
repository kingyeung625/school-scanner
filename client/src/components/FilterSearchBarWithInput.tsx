import { useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterSearchBarWithInputProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
}

export default function FilterSearchBarWithInput({
  label,
  options,
  selectedValues,
  onToggle,
  onRemove,
  placeholder,
}: FilterSearchBarWithInputProps) {
  const { convertText, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const filteredOptions = inputValue
    ? options.filter(option =>
        convertText(option).toLowerCase().includes(convertText(inputValue).toLowerCase())
      )
    : options;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap w-20 sm:w-24">
          {label}:
        </span>
        <div className="flex-1 space-y-1.5">
          {/* Selected values as badges */}
          {selectedValues.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedValues.map((value) => (
                <Badge
                  key={value}
                  variant="default"
                  className="gap-1 pl-2 pr-1 py-1"
                >
                  <span>{convertText(value)}</span>
                  <button
                    onClick={() => onRemove(value)}
                    className="hover-elevate rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <div className="relative w-full cursor-pointer">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (!isOpen) setIsOpen(true);
                  }}
                  placeholder={placeholder || (language === 'tc' ? '請輸入或選擇...' : '请输入或选择...')}
                  className="pl-10 pr-10 h-10 cursor-text"
                  onClick={() => setIsOpen(true)}
                />
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-1.5">
              <div className="border rounded-md bg-card p-2.5 space-y-1.5 max-h-64 overflow-y-auto">
                {/* Options list */}
                <div className="flex flex-wrap gap-1.5">
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
                          setInputValue('');
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
    </div>
  );
}




