import { MapPin, Users, BookOpen, Phone } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import type { School } from '@shared/school-schema';

interface SchoolCardProps {
  school: School;
  onViewDetails: (school: School) => void;
  isSelected?: boolean;
  onToggleSelect?: (school: School) => void;
}

export default function SchoolCard({ school, onViewDetails, isSelected, onToggleSelect }: SchoolCardProps) {
  const { t, convertText } = useLanguage();

  return (
    <Card className="h-full flex flex-col hover-elevate">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg leading-relaxed line-clamp-2" data-testid={`text-school-name-${school.id}`}>
            {convertText(school.學校名稱)}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {convertText(school.學校類別1)}
            </Badge>
            {school.宗教 && school.宗教 !== '不適用' && (
              <Badge variant="outline" className="text-xs">
                {convertText(school.宗教)}
              </Badge>
            )}
          </div>
        </div>
        {onToggleSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(school)}
            data-testid={`checkbox-select-school-${school.id}`}
            className="mt-1"
          />
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="text-muted-foreground line-clamp-2 leading-relaxed">
            {convertText(school.區域)}
          </span>
        </div>

        {school.學生性別 && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">
              {convertText(school.學生性別)}
            </span>
          </div>
        )}

        {school.教學語言 && (
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground line-clamp-2 leading-relaxed">
              {convertText(school.教學語言)}
            </span>
          </div>
        )}

        {school.學校電話 && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">
              {school.學校電話}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => onViewDetails(school)}
          data-testid={`button-view-details-${school.id}`}
        >
          {t.viewDetails}
        </Button>
      </CardFooter>
    </Card>
  );
}
