import { MapPin, Users, ChevronRight, Newspaper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import type { School } from '@shared/school-schema';
import { useState, useEffect } from 'react';
import { fetchOGMetadata } from '@/lib/articlesParser';

interface SchoolListItemProps {
  school: School;
  onViewDetails: (school: School) => void;
  isSelected?: boolean;
  onToggleSelect?: (school: School) => void;
}

export default function SchoolListItem({ school, onViewDetails, isSelected, onToggleSelect }: SchoolListItemProps) {
  const { t, convertText } = useLanguage();
  const [ogImage, setOgImage] = useState<string | undefined>(school.articles?.[0]?.ogImage);

  // Lazy-load OG image after component renders
  useEffect(() => {
    if (school.articles && school.articles.length > 0 && !ogImage) {
      fetchOGMetadata(school.articles[0].url)
        .then(data => {
          if (data.ogImage) {
            setOgImage(data.ogImage);
          }
        })
        .catch(err => {
          console.warn(`Failed to fetch OG for school ${school.id}:`, err);
        });
    }
  }, [school.articles, school.id, ogImage]);

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
        </div>
        
        {/* Display first article if available */}
        {school.articles && school.articles.length > 0 && (
          <div className="mt-2 pt-2 border-t">
            <a
              href={school.articles[0].url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block hover-elevate rounded-md p-1.5 -m-1.5"
              data-testid={`link-article-${school.id}`}
            >
              {/* OG Image - large on desktop, full width on mobile */}
              {ogImage ? (
                <img
                  src={ogImage}
                  alt={school.articles[0].title}
                  className="w-full h-auto aspect-video object-cover rounded mb-2"
                  style={{ minHeight: '200px', maxHeight: '675px' }}
                  data-testid={`img-article-og-${school.id}`}
                />
              ) : (
                <div className="w-full aspect-video bg-muted rounded flex items-center justify-center mb-2" style={{ minHeight: '200px', maxHeight: '675px' }}>
                  <Newspaper className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              {/* Article info below image */}
              <div className="flex items-center gap-1 text-xs text-primary mb-1">
                <Newspaper className="h-3 w-3" />
                <span className="font-medium">新聞報導</span>
              </div>
              <p className="text-sm text-foreground line-clamp-2 leading-snug">
                {convertText(school.articles[0].title)}
              </p>
            </a>
          </div>
        )}
      </div>
      
      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
    </div>
  );
}
