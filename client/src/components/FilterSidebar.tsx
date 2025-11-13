import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FilterState } from '@shared/school-schema';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
}

const filterOptions = {
  區域: ['香港東區', '九龍城區', '沙田區', '大埔區', '北區', '元朗區', '屯門區', '觀塘區', '深水埗區', '油尖旺區', '黃大仙區', '荃灣區', '葵青區', '離島區', '西貢區', '南區', '灣仔區', '中西區'],
  學校類別1: ['資助', '官立', '私立', '直資'],
  學生性別: ['男女', '男', '女'],
  宗教: ['基督教', '天主教', '佛教', '不適用'],
  教學語言: ['中文', '中文及英文', '中文（包括：普通話）', '中文（包括：普通話）及英文'],
  校網: ['11', '12', '14', '16', '18', '31', '32', '34', '35', '40', '41', '43', '45', '46', '48', '62', '65', '66', '70', '72', '74', '80', '81', '83', '84', '88', '89', '91', '95', '97', '98'],
  師資: ['100%已培訓', '90%或以上已培訓', '80%或以上已培訓', '50%或以上碩士'],
};

export default function FilterSidebar({ filters, onFilterChange, onClose }: FilterSidebarProps) {
  const { t, convertText } = useLanguage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    區域: true,
    學校類別1: true,
    學生性別: true,
    宗教: true,
    教學語言: true,
    校網: false,
    師資: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (category: keyof FilterState, value: string, checked: boolean) => {
    if (category === 'searchQuery') return;
    
    const currentValues = filters[category] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFilterChange({ ...filters, [category]: newValues });
  };

  const clearFilters = () => {
    onFilterChange({
      區域: [],
      學校類別1: [],
      學生性別: [],
      宗教: [],
      教學語言: [],
      校網: [],
      師資: [],
      searchQuery: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => 
    Array.isArray(v) ? v.length > 0 : v !== ''
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-base font-semibold">{t.filters}</h2>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {Object.entries(filterOptions).map(([category, options]) => (
            <Collapsible
              key={category}
              open={openSections[category]}
              onOpenChange={() => toggleSection(category)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 hover-elevate active-elevate-2 rounded-md" data-testid={`button-toggle-${category}`}>
                <span className="font-medium text-xs">
                  {(t as any)[category] || convertText(category)}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform ${openSections[category] ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-1.5 pl-2">
                {options.map((option) => {
                  const isChecked = (filters[category as keyof FilterState] as string[])?.includes(option);
                  return (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${category}-${option}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(category as keyof FilterState, option, checked as boolean)
                        }
                        data-testid={`checkbox-${category}-${option}`}
                      />
                      <Label
                        htmlFor={`${category}-${option}`}
                        className="text-xs cursor-pointer leading-tight"
                      >
                        {convertText(option)}
                      </Label>
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>

      {hasActiveFilters && (
        <div className="p-3 border-t">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
            size="sm"
            data-testid="button-clear-filters"
          >
            {t.clearFilters}
          </Button>
        </div>
      )}
    </div>
  );
}
