import { useState } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import type { FilterState } from '@shared/school-schema';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const filterOptions = {
  學生性別: ['男女', '男', '女'],
  宗教: ['基督教', '天主教', '佛教', '道教', '伊斯蘭教', '不適用'],
  教學語言: ['中文', '中文及英文', '中文（包括：普通話）', '中文（包括：普通話）及英文'],
  關聯學校: ['一條龍', '直屬', '聯繫'],
  辦學團體: ['天主教香港教區', '聖公宗（香港）小學監理委員會有限公司', '政府', '保良局', '中華基督教會香港區會', '東華三院', '嘉諾撒仁愛女修會', '基督教香港信義會', '香港佛教聯合會', '耶穌寶血女修會', '鮑思高慈幼會', '香港浸信會聯會', '香港九龍塘基督教中華宣道會', '香港道教聯合會', '香港路德會有限公司', '香港基督教循道衞理聯合教會', '順德聯誼總會', '救世軍', '仁濟醫院', '九龍樂善堂', '香海正覺蓮社', '基督教香港崇真會', '嗇色園', '鳳溪公立學校', '香港天主教方濟會會長', '香港喇沙修士會', '香港五邑工商總會', '青松觀有限公司', '無玷聖母獻主會', '港澳信義會有限公司'],
};

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const { t, convertText, language } = useLanguage();
  const isMobile = useIsMobile();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    學生性別: !isMobile,
    宗教: false,
    教學語言: false,
    關聯學校: false,
    辦學團體: false,
  });

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({
    辦學團體: '',
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

  const removeFilter = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.filter(v => v !== value);
    onFilterChange({ ...filters, [category]: newValues });
  };

  const filterOptionsBySearch = (options: string[], searchTerm: string) => {
    if (!searchTerm.trim()) return options;
    const normalizedSearch = convertText(searchTerm).toLowerCase();
    return options.filter(option => 
      convertText(option).toLowerCase().includes(normalizedSearch)
    );
  };

  const renderCheckboxGrid = (category: keyof FilterState, options: string[]) => {
    return (
      <div className="space-y-1.5">
        {options.map((option) => {
          const isChecked = (filters[category] as string[])?.includes(option);
          return (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${category}-${option}`}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(category, option, checked as boolean)
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
      </div>
    );
  };

  const renderSponsoringBodyFilter = () => {
    const searchTerm = searchTerms['辦學團體'] || '';
    const filteredBodies = filterOptionsBySearch(filterOptions['辦學團體'], searchTerm);

    return (
      <>
        <div className="mb-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'tc' ? '搜尋辦學團體...' : '搜索办学团体...'}
              value={searchTerm}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, '辦學團體': e.target.value }))}
              className="h-7 pl-7 text-xs"
              data-testid="input-search-sponsoring-body"
            />
          </div>
        </div>
        {renderCheckboxGrid('辦學團體', filteredBodies)}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {(['學生性別', '宗教', '教學語言', '關聯學校'] as const).map((category) => (
        <Collapsible
          key={category}
          open={openSections[category]}
          onOpenChange={() => toggleSection(category)}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted/50 active:bg-muted rounded-md transition-colors" data-testid={`button-toggle-${category}`}>
            <span className="font-medium text-sm text-foreground">
              {(t as any)[category] || convertText(category)}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections[category] ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-1.5 pl-3">
            {renderCheckboxGrid(category, filterOptions[category])}
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* 辦學團體 filter with collapsible and search */}
      <Collapsible
        open={openSections['辦學團體']}
        onOpenChange={() => toggleSection('辦學團體')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted/50 active:bg-muted rounded-md transition-colors" data-testid="button-toggle-辦學團體">
          <span className="font-medium text-sm text-foreground">
            {t.sponsoringBody}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections['辦學團體'] ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-1.5 pl-3">
          {renderSponsoringBodyFilter()}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

