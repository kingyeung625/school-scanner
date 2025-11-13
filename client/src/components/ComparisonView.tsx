import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import type { School } from '@shared/school-schema';

interface ComparisonViewProps {
  schools: School[];
  onClose: () => void;
  onRemove: (school: School) => void;
}

export default function ComparisonView({ schools, onClose, onRemove }: ComparisonViewProps) {
  const { t, convertText } = useLanguage();

  const ComparisonRow = ({ label, getValue }: { label: string; getValue: (school: School) => string | undefined }) => (
    <div className="border-b last:border-b-0">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
        <div className="p-4 bg-muted/30 font-medium text-sm">
          {label}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {schools.map((school, index) => {
            const value = getValue(school);
            return (
              <div
                key={school.id}
                className={`p-4 ${index !== schools.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}`}
              >
                <p className="text-sm leading-relaxed">
                  {value ? convertText(value) : '-'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="p-4 md:p-6 border-b">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-back-comparison"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {t.compareSchools}
          </h1>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {schools.map((school) => (
            <Badge
              key={school.id}
              variant="default"
              className="gap-2 py-2 px-4 flex-shrink-0"
              data-testid={`badge-comparing-${school.id}`}
            >
              <span>{convertText(school.學校名稱)}</span>
              <button
                onClick={() => onRemove(school)}
                className="hover-elevate active-elevate-2 rounded-sm"
                data-testid={`button-remove-comparing-${school.id}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="border-l border-r">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] border-b bg-muted/50">
            <div className="p-4 font-semibold">
              {t.schoolName}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {schools.map((school, index) => (
                <div
                  key={school.id}
                  className={`p-4 font-medium ${index !== schools.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}`}
                >
                  {convertText(school.學校名稱)}
                </div>
              ))}
            </div>
          </div>

          <ComparisonRow label={t.region} getValue={(s) => s.區域} />
          <ComparisonRow label={t.schoolType} getValue={(s) => s.學校類別1} />
          <ComparisonRow label={t.gender} getValue={(s) => s.學生性別} />
          <ComparisonRow label={t.language} getValue={(s) => s.教學語言} />
          <ComparisonRow label={t.religion} getValue={(s) => s.宗教} />
          <ComparisonRow label={t.establishedYear} getValue={(s) => s.創校年份} />
          <ComparisonRow label={t.sponsoringBody} getValue={(s) => s.辦學團體} />
          <ComparisonRow label={t.motto} getValue={(s) => s.校訓} />
          <ComparisonRow label={t.address} getValue={(s) => s.學校地址} />
          <ComparisonRow label={t.phone} getValue={(s) => s.學校電話} />
          <ComparisonRow label={t.tuition} getValue={(s) => s.學費} />
          <ComparisonRow label={t.classrooms} getValue={(s) => s.課室數目} />
          <ComparisonRow label={t.totalTeachers} getValue={(s) => s.教師總人數} />
          <ComparisonRow
            label={t.trainedRate}
            getValue={(s) => s.已接受師資培訓人數百分率 ? `${s.已接受師資培訓人數百分率}%` : undefined}
          />
          <ComparisonRow
            label={t.degreeRate}
            getValue={(s) => s.學士人數百分率 ? `${s.學士人數百分率}%` : undefined}
          />
          <ComparisonRow
            label={t.masterRate}
            getValue={(s) => s.碩士博士或以上人數百分率 ? `${s.碩士博士或以上人數百分率}%` : undefined}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
