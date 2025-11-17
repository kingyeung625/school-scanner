import { MapPin, Users, ChevronRight, Newspaper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import type { School } from '@shared/school-schema';

interface SchoolListItemProps {
  school: School;
  onViewDetails: (school: School) => void;
  isSelected?: boolean;
  onToggleSelect?: (school: School) => void;
}

export default function SchoolListItem({ school, onViewDetails, isSelected, onToggleSelect }: SchoolListItemProps) {
  const { t, convertText } = useLanguage();

  return (
    <div
      className="flex items-center gap-3 p-3 border-b hover-elevate active-elevate-2 cursor-pointer"
      onClick={() => onViewDetails(school)}
      data-testid={`list-item-school-${school.id}`}
    >
      {onToggleSelect && (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(school)}
            data-testid={`checkbox-select-school-${school.id}`}
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm leading-tight line-clamp-1" data-testid={`text-school-name-${school.id}`}>
          {convertText(school.學校名稱)}
        </h3>
        
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{convertText(school.區域)}</span>
          </div>
          {school.學生性別 && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{convertText(school.學生性別)}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <Badge variant="secondary" className="text-xs py-0 h-5">
            {convertText(school.學校類別1)}
          </Badge>
          {school.宗教 && school.宗教 !== '不適用' && (
            <Badge variant="outline" className="text-xs py-0 h-5">
              {convertText(school.宗教)}
            </Badge>
          )}
          {school.小一學校網 && school.小一學校網 !== '/' && (
            <Badge variant="outline" className="text-xs py-0 h-5">
              {t.schoolNetwork} {school.小一學校網}
            </Badge>
          )}
          {school.articles && school.articles.length > 0 && (
            <Badge variant="default" className="text-xs py-0 h-5 gap-1" data-testid={`badge-articles-${school.id}`}>
              <Newspaper className="h-3 w-3" />
              <span>{convertText('新聞')} ({school.articles.length})</span>
            </Badge>
          )}
        </div>
      </div>
      
      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
    </div>
  );
}
