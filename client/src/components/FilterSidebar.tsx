import { useState } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FilterState } from '@shared/school-schema';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
}

const filterOptions = {
  區域: ['香港東區', '南區', '灣仔區', '中西區', '九龍城區', '觀塘區', '深水埗區', '油尖旺區', '黃大仙區', '沙田區', '大埔區', '北區', '元朗區', '屯門區', '荃灣區', '葵青區', '離島區', '西貢區'],
  校網: ['11', '12', '14', '16', '18', '31', '32', '34', '35', '40', '41', '43', '45', '46', '48', '62', '65', '66', '70', '72', '74', '80', '81', '83', '84', '88', '89', '91', '95', '97', '98'],
  資助類型: ['資助', '官立', '私立', '直資'],
  學生性別: ['男女', '男', '女'],
  宗教: ['基督教', '天主教', '佛教', '道教', '伊斯蘭教', '不適用'],
  教學語言: ['中文', '中文及英文', '中文（包括：普通話）', '中文（包括：普通話）及英文'],
  關聯學校: ['一條龍', '直屬', '聯繫'],
  辦學團體: ['天主教香港教區', '聖公宗（香港）小學監理委員會有限公司', '政府', '保良局', '中華基督教會香港區會', '東華三院', '嘉諾撒仁愛女修會', '基督教香港信義會', '香港佛教聯合會', '耶穌寶血女修會', '鮑思高慈幼會', '香港浸信會聯會', '香港九龍塘基督教中華宣道會', '香港道教聯合會', '香港路德會有限公司', '香港基督教循道衞理聯合教會', '順德聯誼總會', '救世軍', '仁濟醫院', '九龍樂善堂', '香海正覺蓮社', '基督教香港崇真會', '嗇色園', '鳳溪公立學校', '香港天主教方濟會會長', '香港喇沙修士會', '香港五邑工商總會', '青松觀有限公司', '無玷聖母獻主會', '港澳信義會有限公司'],
};

export default function FilterSidebar({ filters, onFilterChange, onClose }: FilterSidebarProps) {
  const { t, convertText, language } = useLanguage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    資助類型: true,
    學生性別: true,
    宗教: false,
    教學語言: false,
    關聯學校: false,
    辦學團體: false,
  });

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({
    區域: '',
    校網: '',
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

  const clearFilters = () => {
    onFilterChange({
      區域: [],
      校網: [],
      資助類型: [],
      學生性別: [],
      宗教: [],
      教學語言: [],
      關聯學校: [],
      辦學團體: [],
      searchQuery: '',
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'searchQuery' && Array.isArray(value) && value.length > 0
  );

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

  const filterOptionsBySearch = (options: string[], searchTerm: string) => {
    if (!searchTerm.trim()) return options;
    // Normalize both search term and options to ensure bilingual search works
    const normalizedSearch = convertText(searchTerm).toLowerCase();
    return options.filter(option => 
      convertText(option).toLowerCase().includes(normalizedSearch)
    );
  };

  const renderCheckboxGrid = (category: keyof FilterState, options: string[], columns: number = 1) => {
    const gridClass = columns === 2 ? 'grid grid-cols-2 gap-x-3 gap-y-1.5' : 'space-y-1.5';
    
    return (
      <div className={gridClass}>
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

  const renderRegionFilter = () => {
    const searchTerm = searchTerms['區域'] || '';
    const filteredRegions = filterOptionsBySearch(filterOptions['區域'], searchTerm);

    return (
      <>
        <div className="mb-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'tc' ? '搜尋區域...' : '搜索区域...'}
              value={searchTerm}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, '區域': e.target.value }))}
              className="h-7 pl-7 text-xs"
              data-testid="input-search-region"
            />
          </div>
        </div>
        {renderCheckboxGrid('區域', filteredRegions)}
      </>
    );
  };

  const renderSchoolNetFilter = () => {
    const searchTerm = searchTerms['校網'] || '';
    const filteredNets = filterOptionsBySearch(filterOptions['校網'], searchTerm);

    return (
      <>
        <div className="mb-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'tc' ? '搜尋校網...' : '搜索校网...'}
              value={searchTerm}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, '校網': e.target.value }))}
              className="h-7 pl-7 text-xs"
              data-testid="input-search-school-net"
            />
          </div>
        </div>
        {renderCheckboxGrid('校網', filteredNets, 2)}
      </>
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

  const activeChips = getActiveFilterChips();

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

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="p-3 border-b bg-muted/30">
          <div className="flex flex-wrap gap-1.5">
            {activeChips.map((chip, idx) => (
              <Badge
                key={`${chip.category}-${chip.value}-${idx}`}
                variant="secondary"
                className="text-xs pl-2 pr-1 py-0.5 gap-1"
              >
                <span>{chip.label}</span>
                <button
                  onClick={() => removeFilter(chip.category, chip.value)}
                  className="hover-elevate rounded-full p-0.5"
                  data-testid={`button-remove-filter-${chip.category}-${chip.value}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-4">
          {/* 區域 filter with flat list */}
          <div>
            <div className="px-2 py-1.5 mb-2">
              <span className="font-medium text-xs">{t.region}</span>
            </div>
            <div className="pl-2">
              {renderRegionFilter()}
            </div>
          </div>

          {/* 校網 filter with flat list */}
          <div>
            <div className="px-2 py-1.5 mb-2">
              <span className="font-medium text-xs">{t.schoolNet}</span>
            </div>
            <div className="pl-2">
              {renderSchoolNetFilter()}
            </div>
          </div>

          {/* Other filters with simple layout */}
          {(['資助類型', '學生性別', '宗教', '教學語言', '關聯學校'] as const).map((category) => (
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
                {renderCheckboxGrid(category, filterOptions[category])}
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* 辦學團體 filter with collapsible and search */}
          <Collapsible
            open={openSections['辦學團體']}
            onOpenChange={() => toggleSection('辦學團體')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 hover-elevate active-elevate-2 rounded-md" data-testid="button-toggle-辦學團體">
              <span className="font-medium text-xs">
                {t.sponsoringBody}
              </span>
              <ChevronDown className={`h-3 w-3 transition-transform ${openSections['辦學團體'] ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-1.5 pl-2">
              {renderSponsoringBodyFilter()}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

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
