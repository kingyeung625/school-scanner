import { X, MapPin, Phone, Mail, Globe, Users, BookOpen, Building2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import type { School } from '@shared/school-schema';

interface SchoolDetailProps {
  school: School;
  onClose: () => void;
}

export default function SchoolDetail({ school, onClose }: SchoolDetailProps) {
  const { t, convertText } = useLanguage();

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string; icon?: any }) => {
    if (!value || value === '-') return null;
    
    return (
      <div className="flex gap-3 py-3">
        {Icon && <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="leading-relaxed">{convertText(value)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 md:p-6 border-b">
        <div className="flex-1 min-w-0 pr-4">
          <h1 className="text-2xl md:text-3xl font-semibold leading-relaxed" data-testid="text-school-detail-name">
            {convertText(school.學校名稱)}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary">{convertText(school.學校類別1)}</Badge>
            <Badge variant="outline">{convertText(school.區域)}</Badge>
            {school.宗教 && school.宗教 !== '不適用' && (
              <Badge variant="outline">{convertText(school.宗教)}</Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-detail"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-6">
              <TabsTrigger value="basic" data-testid="tab-basic">{t.basicInfo}</TabsTrigger>
              <TabsTrigger value="contact" data-testid="tab-contact">{t.contact}</TabsTrigger>
              <TabsTrigger value="facilities" data-testid="tab-facilities">{t.facilities}</TabsTrigger>
              <TabsTrigger value="teachers" data-testid="tab-teachers">{t.teachers}</TabsTrigger>
              <TabsTrigger value="fees" data-testid="tab-fees">{t.fees}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-2">
              <InfoRow label={t.schoolName} value={school.學校名稱} />
              <Separator />
              <InfoRow label={t.region} value={school.區域} icon={MapPin} />
              <Separator />
              <InfoRow label={t.schoolType} value={school.學校類別1} icon={Building2} />
              <Separator />
              <InfoRow label={t.gender} value={school.學生性別} icon={Users} />
              <Separator />
              <InfoRow label={t.language} value={school.教學語言} icon={BookOpen} />
              <Separator />
              <InfoRow label={t.religion} value={school.宗教} />
              <Separator />
              <InfoRow label={t.establishedYear} value={school.創校年份} />
              <Separator />
              <InfoRow label={t.sponsoringBody} value={school.辦學團體} />
              <Separator />
              <InfoRow label={t.motto} value={school.校訓} />
              <Separator />
              {school.辦學宗旨 && (
                <>
                  <div className="py-3">
                    <p className="text-sm text-muted-foreground mb-2">{t.mission}</p>
                    <p className="leading-relaxed">{convertText(school.辦學宗旨)}</p>
                  </div>
                  <Separator />
                </>
              )}
              {school.校風 && (
                <div className="py-3">
                  <p className="text-sm text-muted-foreground mb-2">{t.schoolCulture}</p>
                  <p className="leading-relaxed">{convertText(school.校風)}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contact" className="space-y-2">
              <InfoRow label={t.address} value={school.學校地址} icon={MapPin} />
              <Separator />
              <InfoRow label={t.phone} value={school.學校電話} icon={Phone} />
              <Separator />
              <InfoRow label={t.fax} value={school.學校傳真} />
              <Separator />
              <InfoRow label={t.email} value={school.學校電郵} icon={Mail} />
              <Separator />
              {school.學校網址 && (
                <div className="flex gap-3 py-3">
                  <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">{t.website}</p>
                    <a
                      href={school.學校網址}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                      data-testid="link-school-website"
                    >
                      {school.學校網址}
                    </a>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="facilities" className="space-y-2">
              <InfoRow label={t.classrooms} value={school.課室數目} />
              <Separator />
              <InfoRow label={t.halls} value={school.禮堂數目} />
              <Separator />
              <InfoRow label={t.playgrounds} value={school.操場數目} />
              <Separator />
              <InfoRow label={t.libraries} value={school.圖書館數目} />
              <Separator />
              <InfoRow label={t.specialRooms} value={school.特別室} />
              <Separator />
              <InfoRow label={t.otherFacilities} value={school.其他學校設施} />
            </TabsContent>

            <TabsContent value="teachers" className="space-y-2">
              <InfoRow label={t.totalTeachers} value={school.教師總人數} />
              <Separator />
              <InfoRow label={t.trainedRate} value={school.已接受師資培訓人數百分率 ? `${school.已接受師資培訓人數百分率}%` : undefined} />
              <Separator />
              <InfoRow label={t.degreeRate} value={school.學士人數百分率 ? `${school.學士人數百分率}%` : undefined} />
              <Separator />
              <InfoRow label={t.masterRate} value={school.碩士博士或以上人數百分率 ? `${school.碩士博士或以上人數百分率}%` : undefined} />
            </TabsContent>

            <TabsContent value="fees" className="space-y-2">
              <InfoRow label={t.tuition} value={school.學費} icon={DollarSign} />
              <Separator />
              <InfoRow label={t.misc} value={school.堂費} />
              <Separator />
              <InfoRow label={t.ptaFee} value={school.家長教師會費} />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
