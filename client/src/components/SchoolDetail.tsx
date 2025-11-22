import { X, MapPin, Phone, Mail, Globe, Users, BookOpen, Building2, DollarSign, GraduationCap, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import type { School } from '@shared/school-schema';
import ArticleCarousel from './ArticleCarousel';

interface SchoolDetailProps {
  school: School;
  onClose: () => void;
}

// Color palette for charts
const CHART_COLORS = {
  trained: '#10b981',    // green
  bachelor: '#3b82f6',   // blue
  master: '#8b5cf6',     // purple
  special: '#f59e0b',    // amber
  exp0to4: '#06b6d4',    // cyan
  exp5to9: '#8b5cf6',    // purple
  exp10plus: '#10b981',  // green
};

export default function SchoolDetail({ school, onClose }: SchoolDetailProps) {
  const { t, convertText, language } = useLanguage();

  // Helper: Parse percentage string safely
  const parsePercent = (value?: string) => {
    if (!value || value === '未有資料' || value === '-') return null;
    const num = parseFloat(value.replace('%', ''));
    return isNaN(num) ? null : num;
  };

  // Helper: Format supervisor/principal name with title
  const formatName = (title?: string, name?: string): string | undefined => {
    if (!name || name === '-') return undefined;
    if (!title || title === '-') return name;
    return `${name}${title}`;
  };

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string; icon?: any }) => {
    if (!value || value === '-') return null;
    
    return (
      <div className="flex gap-3 py-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-sm leading-relaxed">{convertText(value)}</p>
        </div>
      </div>
    );
  };

  // Helper: Render HTML content safely
  const HtmlContent = ({ content }: { content: string }) => {
    return (
      <div 
        className="text-sm leading-relaxed [&_br]:block [&_br]:my-1"
        dangerouslySetInnerHTML={{ __html: convertText(content) }}
      />
    );
  };

  // Prepare teacher qualification chart data (4 bars)
  const getQualificationChartData = () => {
    const data = [];
    
    const trainedPercent = parsePercent(school.已接受師資培訓人數百分率);
    if (trainedPercent !== null) {
      data.push({ name: t.trained, value: trainedPercent, color: CHART_COLORS.trained });
    }
    
    const bachelorPercent = parsePercent(school.學士人數百分率);
    if (bachelorPercent !== null) {
      data.push({ name: t.bachelor, value: bachelorPercent, color: CHART_COLORS.bachelor });
    }
    
    const masterPercent = parsePercent(school.碩士博士或以上人數百分率);
    if (masterPercent !== null) {
      data.push({ name: t.master, value: masterPercent, color: CHART_COLORS.master });
    }
    
    const specialPercent = parsePercent(school.特殊教育培訓人數百分率);
    if (specialPercent !== null) {
      data.push({ name: t.specialEducation, value: specialPercent, color: CHART_COLORS.special });
    }
    
    return data;
  };

  // Prepare teacher experience pie chart data (3 segments)
  const getExperienceChartData = () => {
    const data = [];
    
    const exp0to4 = parsePercent(school["0至4年年資人數百分率"]);
    if (exp0to4 !== null) {
      data.push({ name: t.experience0to4, value: exp0to4, color: CHART_COLORS.exp0to4 });
    }
    
    const exp5to9 = parsePercent(school["5至9年年資人數百分率"]);
    if (exp5to9 !== null) {
      data.push({ name: t.experience5to9, value: exp5to9, color: CHART_COLORS.exp5to9 });
    }
    
    const exp10plus = parsePercent(school["10年年資或以上人數百分率"]);
    if (exp10plus !== null) {
      data.push({ name: t.experience10plus, value: exp10plus, color: CHART_COLORS.exp10plus });
    }
    
    return data;
  };

  const qualificationChartData = getQualificationChartData();
  const experienceChartData = getExperienceChartData();

  // Generate Google Maps embed URL
  const getMapUrl = () => {
    if (!school.學校名稱) return null;
    const schoolName = encodeURIComponent(school.學校名稱);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    
    if (apiKey) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${schoolName}`;
    } else {
      return `https://www.google.com/maps?q=${schoolName}&output=embed`;
    }
  };

  const mapUrl = getMapUrl();

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 md:p-6 border-b">
        <div className="flex-1 min-w-0 pr-4">
          <h1 className="text-xl md:text-2xl font-semibold leading-relaxed" data-testid="text-school-detail-name">
            {convertText(school.學校名稱)}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">{convertText(school.學校類別1)}</Badge>
            <Badge variant="outline">{convertText(school.區域)}</Badge>
            {school.宗教 && school.宗教 !== '不適用' && (
              <Badge variant="outline">{convertText(school.宗教)}</Badge>
            )}
            {school.小一學校網 && school.小一學校網 !== '/' && (
              <Badge variant="outline">{t.schoolNetwork} {school.小一學校網}</Badge>
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
        {/* Article Carousel - Full-width responsive display */}
        {school.articles && school.articles.length > 0 && (
          <div className="w-full">
            <ArticleCarousel articles={school.articles} />
          </div>
        )}
        
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="sticky top-0 z-50 grid w-full grid-cols-3 [@media(min-width:768px)]:grid-cols-9 gap-1 mb-6 bg-card border-b shadow-sm p-2 h-auto min-h-fit">
              <TabsTrigger value="basic" data-testid="tab-basic" className="text-xs">{t.basicInfo}</TabsTrigger>
              <TabsTrigger value="philosophy" data-testid="tab-philosophy" className="text-xs">{t.schoolPhilosophy}</TabsTrigger>
              <TabsTrigger value="homework" data-testid="tab-homework" className="text-xs">{t.homeworkArrangement}</TabsTrigger>
              <TabsTrigger value="teaching-features" data-testid="tab-teaching" className="text-xs">{t.teachingFeatures}</TabsTrigger>
              <TabsTrigger value="facilities" data-testid="tab-facilities" className="text-xs">{t.facilities}</TabsTrigger>
              <TabsTrigger value="classes" data-testid="tab-classes" className="text-xs">{t.classDistribution}</TabsTrigger>
              <TabsTrigger value="teachers" data-testid="tab-teachers" className="text-xs">{t.teachers}</TabsTrigger>
              <TabsTrigger value="fees" data-testid="tab-fees" className="text-xs">{t.fees}</TabsTrigger>
              <TabsTrigger value="contact" data-testid="tab-contact" className="text-xs">{t.contactAndLocation}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-3 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.schoolInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
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
                  <InfoRow label={t.establishedYear} value={school.創校年份} icon={Calendar} />
                  <Separator />
                  <InfoRow label={t.schoolArea} value={school.學校佔地面積} />
                </CardContent>
              </Card>

              {/* Management Body Card */}
              {(() => {
                const hasManagementData = 
                  formatName(school.校監_校管會主席稱謂, school.校監_校管會主席姓名) ||
                  formatName(school.校長稱謂, school.校長姓名) ||
                  (school.辦學團體 && school.辦學團體 !== '-') ||
                  (school.法團校董會 && school.法團校董會 !== '-') ||
                  (school.家長教師會 && school.家長教師會 !== '-') ||
                  (school.校監和校董_校管會主席和成員的培訓達標率 && school.校監和校董_校管會主席和成員的培訓達標率 !== '-') ||
                  (school.學校管理架構 && school.學校管理架構 !== '-') ||
                  (school.法團校董會_校管會_校董會 && school.法團校董會_校管會_校董會 !== '-') ||
                  (school.舊生會_校友會 && school.舊生會_校友會 !== '-');

                if (!hasManagementData) return null;

                return (
                  <Card data-testid="card-management-body">
                    <CardHeader>
                      <CardTitle className="text-base">{t.managementBody}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <InfoRow label={t.sponsoringBody} value={school.辦學團體} />
                      {(school.辦學團體 && school.辦學團體 !== '-') && 
                        (formatName(school.校監_校管會主席稱謂, school.校監_校管會主席姓名) || formatName(school.校長稱謂, school.校長姓名) || 
                         (school.學校管理架構 && school.學校管理架構 !== '-') || (school.法團校董會_校管會_校董會 && school.法團校董會_校管會_校董會 !== '-') ||
                         (school.法團校董會 && school.法團校董會 !== '-') || (school.校監和校董_校管會主席和成員的培訓達標率 && school.校監和校董_校管會主席和成員的培訓達標率 !== '-') ||
                         (school.家長教師會 && school.家長教師會 !== '-') || (school.舊生會_校友會 && school.舊生會_校友會 !== '-')) && <Separator />}
                      <InfoRow label={t.supervisor} value={formatName(school.校監_校管會主席稱謂, school.校監_校管會主席姓名)} />
                      {formatName(school.校監_校管會主席稱謂, school.校監_校管會主席姓名) && 
                        (formatName(school.校長稱謂, school.校長姓名) || (school.學校管理架構 && school.學校管理架構 !== '-') || 
                         (school.法團校董會_校管會_校董會 && school.法團校董會_校管會_校董會 !== '-') || (school.法團校董會 && school.法團校董會 !== '-') || 
                         (school.校監和校董_校管會主席和成員的培訓達標率 && school.校監和校董_校管會主席和成員的培訓達標率 !== '-') ||
                         (school.家長教師會 && school.家長教師會 !== '-') || (school.舊生會_校友會 && school.舊生會_校友會 !== '-')) && <Separator />}
                      <InfoRow label={t.principal} value={formatName(school.校長稱謂, school.校長姓名)} />
                      {formatName(school.校長稱謂, school.校長姓名) && 
                        ((school.學校管理架構 && school.學校管理架構 !== '-') || (school.法團校董會_校管會_校董會 && school.法團校董會_校管會_校董會 !== '-') || 
                         (school.法團校董會 && school.法團校董會 !== '-') || (school.校監和校董_校管會主席和成員的培訓達標率 && school.校監和校董_校管會主席和成員的培訓達標率 !== '-') ||
                         (school.家長教師會 && school.家長教師會 !== '-') || (school.舊生會_校友會 && school.舊生會_校友會 !== '-')) && <Separator />}
                      <InfoRow label={t.managementStructure} value={school.學校管理架構} />
                      {(school.學校管理架構 && school.學校管理架構 !== '-') &&
                        ((school.法團校董會_校管會_校董會 && school.法團校董會_校管會_校董會 !== '-') || (school.法團校董會 && school.法團校董會 !== '-') || 
                         (school.校監和校董_校管會主席和成員的培訓達標率 && school.校監和校董_校管會主席和成員的培訓達標率 !== '-') ||
                         (school.家長教師會 && school.家長教師會 !== '-') || (school.舊生會_校友會 && school.舊生會_校友會 !== '-')) && <Separator />}
                      <InfoRow label={t.schoolBoardDetail} value={school.法團校董會_校管會_校董會} />
                      {(school.法團校董會_校管會_校董會 && school.法團校董會_校管會_校董會 !== '-') &&
                        ((school.法團校董會 && school.法團校董會 !== '-') || (school.校監和校董_校管會主席和成員的培訓達標率 && school.校監和校董_校管會主席和成員的培訓達標率 !== '-') ||
                         (school.家長教師會 && school.家長教師會 !== '-') || (school.舊生會_校友會 && school.舊生會_校友會 !== '-')) && <Separator />}
                      <InfoRow label={t.schoolBoard} value={school.法團校董會} />
                      {(school.法團校董會 && school.法團校董會 !== '-') && 
                        ((school.校監和校董_校管會主席和成員的培訓達標率 && school.校監和校董_校管會主席和成員的培訓達標率 !== '-') ||
                         (school.家長教師會 && school.家長教師會 !== '-') || (school.舊生會_校友會 && school.舊生會_校友會 !== '-')) && <Separator />}
                      <InfoRow label={t.supervisorTrainingRate} value={school.校監和校董_校管會主席和成員的培訓達標率} />
                      {(school.校監和校董_校管會主席和成員的培訓達標率 && school.校監和校董_校管會主席和成員的培訓達標率 !== '-') &&
                        ((school.家長教師會 && school.家長教師會 !== '-') || (school.舊生會_校友會 && school.舊生會_校友會 !== '-')) && <Separator />}
                      <InfoRow label={t.pta} value={school.家長教師會} />
                      {(school.家長教師會 && school.家長教師會 !== '-') && 
                        (school.舊生會_校友會 && school.舊生會_校友會 !== '-') && <Separator />}
                      <InfoRow label={t.alumniAssociation} value={school.舊生會_校友會} />
                    </CardContent>
                  </Card>
                );
              })()}

              {((school.學校類別2 && school.學校類別2 !== '-') ||
                (school.一般上學時間 && school.一般上學時間 !== '-') || 
                (school.一般放學時間 && school.一般放學時間 !== '-') || 
                (school.校車 && school.校車 !== '-') || 
                (school.保姆車 && school.保姆車 !== '-')) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{language === 'tc' ? '上課時間及交通' : '上课时间及交通'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <InfoRow label={t.classTime} value={school.學校類別2} />
                    {(school.學校類別2 && school.學校類別2 !== '-' && 
                      ((school.一般上學時間 && school.一般上學時間 !== '-') || 
                       (school.一般放學時間 && school.一般放學時間 !== '-') || 
                       (school.校車 && school.校車 !== '-') || 
                       (school.保姆車 && school.保姆車 !== '-'))) && <Separator />}
                    <InfoRow label={t.generalArrivalTime} value={school.一般上學時間} />
                    {(school.一般上學時間 && school.一般上學時間 !== '-' && 
                      ((school.一般放學時間 && school.一般放學時間 !== '-') || 
                       (school.校車 && school.校車 !== '-') || 
                       (school.保姆車 && school.保姆車 !== '-'))) && <Separator />}
                    <InfoRow label={t.generalDismissalTime} value={school.一般放學時間} />
                    {(school.一般放學時間 && school.一般放學時間 !== '-' && 
                      ((school.校車 && school.校車 !== '-') || 
                       (school.保姆車 && school.保姆車 !== '-'))) && <Separator />}
                    <InfoRow label={t.schoolBus} value={school.校車} />
                    {(school.校車 && school.校車 !== '-' && 
                      (school.保姆車 && school.保姆車 !== '-')) && <Separator />}
                    <InfoRow label={t.nannyBus} value={school.保姆車} />
                  </CardContent>
                </Card>
              )}

              {((school.午膳開始時間 && school.午膳開始時間 !== '-') || 
                (school.午膳結束時間 && school.午膳結束時間 !== '-') || 
                (school.午膳安排 && school.午膳安排 !== '-')) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{language === 'tc' ? '午膳安排' : '午膳安排'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <InfoRow label={t.lunchStartTime} value={school.午膳開始時間} />
                    {(school.午膳開始時間 && school.午膳開始時間 !== '-' && 
                      ((school.午膳結束時間 && school.午膳結束時間 !== '-') || 
                       (school.午膳安排 && school.午膳安排 !== '-'))) && <Separator />}
                    <InfoRow label={t.lunchEndTime} value={school.午膳結束時間} />
                    {(school.午膳結束時間 && school.午膳結束時間 !== '-' && 
                      (school.午膳安排 && school.午膳安排 !== '-')) && <Separator />}
                    <InfoRow label={t.lunchArrangement} value={school.午膳安排} />
                  </CardContent>
                </Card>
              )}

              {(school.一條龍中學 && school.一條龍中學 !== '-' || 
                school.直屬中學 && school.直屬中學 !== '-' || 
                school.聯繫中學 && school.聯繫中學 !== '-') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.linkedSchools}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {school.一條龍中學 && school.一條龍中學 !== '-' && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t.throughTrain}</p>
                        <p className="text-sm">{convertText(school.一條龍中學)}</p>
                      </div>
                    )}
                    {school.直屬中學 && school.直屬中學 !== '-' && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t.directSchools}</p>
                        <p className="text-sm">{convertText(school.直屬中學)}</p>
                      </div>
                    )}
                    {school.聯繫中學 && school.聯繫中學 !== '-' && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t.linkedSchools}</p>
                        <p className="text-sm">{convertText(school.聯繫中學)}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="philosophy" className="space-y-3 pt-4">
              {((school.校訓 && school.校訓 !== '-') || (school.辦學宗旨 && school.辦學宗旨 !== '-') || (school.校風 && school.校風 !== '-') || (school.學校發展計劃 && school.學校發展計劃 !== '-')) && (
                <Card data-testid="card-philosophy">
                  <CardHeader>
                    <CardTitle className="text-base">{language === 'tc' ? '辦學理念' : '办学理念'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {school.校訓 && school.校訓 !== '-' && (
                      <>
                        <div className="flex gap-3 py-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">{t.motto}</p>
                            <HtmlContent content={school.校訓} />
                          </div>
                        </div>
                        {((school.辦學宗旨 && school.辦學宗旨 !== '-') || (school.校風 && school.校風 !== '-') || (school.學校發展計劃 && school.學校發展計劃 !== '-')) && <Separator />}
                      </>
                    )}
                    {school.辦學宗旨 && school.辦學宗旨 !== '-' && (
                      <>
                        <div className="flex gap-3 py-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">{t.mission}</p>
                            <HtmlContent content={school.辦學宗旨} />
                          </div>
                        </div>
                        {((school.校風 && school.校風 !== '-') || (school.學校發展計劃 && school.學校發展計劃 !== '-')) && <Separator />}
                      </>
                    )}
                    {school.校風 && school.校風 !== '-' && (
                      <>
                        <div className="flex gap-3 py-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">{t.schoolCulture}</p>
                            <HtmlContent content={school.校風} />
                          </div>
                        </div>
                        {(school.學校發展計劃 && school.學校發展計劃 !== '-') && <Separator />}
                      </>
                    )}
                    {school.學校發展計劃 && school.學校發展計劃 !== '-' && (
                      <div className="flex gap-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">{t.schoolDevelopmentPlan}</p>
                          <HtmlContent content={school.學校發展計劃} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="homework" className="space-y-3 pt-4">
              {(() => {
                const hasHomeworkData = 
                  (school.班級教學模式 && school.班級教學模式 !== '-') ||
                  (school.班級結構備註 && school.班級結構備註 !== '-') ||
                  (school.分班安排 && school.分班安排 !== '-') ||
                  (school.全年全科測驗次數_一年級 && school.全年全科測驗次數_一年級 !== '-') ||
                  (school.全年全科考試次數_一年級 && school.全年全科考試次數_一年級 !== '-') ||
                  (school.全年全科測驗次數_二至六年級 && school.全年全科測驗次數_二至六年級 !== '-') ||
                  (school.全年全科考試次數_二至六年級 && school.全年全科考試次數_二至六年級 !== '-') ||
                  (school.小一上學期以多元化的進展性評估代替測驗及考試 && school.小一上學期以多元化的進展性評估代替測驗及考試 !== '-') ||
                  (school.制定適切的校本課業政策_讓家長了解相關安排_並定期蒐集教師_學生和家長的意見 && school.制定適切的校本課業政策_讓家長了解相關安排_並定期蒐集教師_學生和家長的意見 !== '-') ||
                  (school.將校本評估政策上載至學校網頁_讓公眾及持份者知悉 && school.將校本評估政策上載至學校網頁_讓公眾及持份者知悉 !== '-') ||
                  (school.將校本課業政策上載至學校網頁_讓公眾及持份者知悉 && school.將校本課業政策上載至學校網頁_讓公眾及持份者知悉 !== '-') ||
                  (school.多元學習評估 && school.多元學習評估 !== '-') ||
                  (school.避免緊接在長假期後安排測考_讓學生在假期有充分的休息 && school.避免緊接在長假期後安排測考_讓學生在假期有充分的休息 !== '-') ||
                  (school.按校情靈活編排時間表_盡量在下午安排導修時段_讓學生能在教師指導下完成部分家課 && school.按校情靈活編排時間表_盡量在下午安排導修時段_讓學生能在教師指導下完成部分家課 !== '-');

                if (!hasHomeworkData) return null;

                return (
                  <Card data-testid="card-homework-arrangement">
                    <CardHeader>
                      <CardTitle className="text-base">{t.homeworkArrangement}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {((school.班級教學模式 && school.班級教學模式 !== '-') ||
                        (school.班級結構備註 && school.班級結構備註 !== '-') ||
                        (school.分班安排 && school.分班安排 !== '-')) && (
                        <>
                          <div className="space-y-2">
                            {school.班級教學模式 && school.班級教學模式 !== '-' && (
                              <div data-testid="text-class-teaching-mode">
                                <p className="text-xs text-muted-foreground mb-1">{t.classTeachingMode}</p>
                                <HtmlContent content={school.班級教學模式} />
                              </div>
                            )}
                            {school.班級結構備註 && school.班級結構備註 !== '-' && (
                              <div data-testid="text-class-structure-remarks">
                                <p className="text-xs text-muted-foreground mb-1">{t.classStructureRemarks}</p>
                                <HtmlContent content={school.班級結構備註} />
                              </div>
                            )}
                            {school.分班安排 && school.分班安排 !== '-' && (
                              <div data-testid="text-class-arrangement">
                                <p className="text-xs text-muted-foreground mb-1">{t.classArrangement}</p>
                                <HtmlContent content={school.分班安排} />
                              </div>
                            )}
                          </div>
                          {((school.全年全科測驗次數_一年級 && school.全年全科測驗次數_一年級 !== '-') ||
                            (school.全年全科考試次數_一年級 && school.全年全科考試次數_一年級 !== '-') ||
                            (school.全年全科測驗次數_二至六年級 && school.全年全科測驗次數_二至六年級 !== '-') ||
                            (school.全年全科考試次數_二至六年級 && school.全年全科考試次數_二至六年級 !== '-') ||
                            (school.小一上學期以多元化的進展性評估代替測驗及考試 && school.小一上學期以多元化的進展性評估代替測驗及考試 === '是')) && <Separator />}
                        </>
                      )}

                      {((school.全年全科測驗次數_一年級 && school.全年全科測驗次數_一年級 !== '-') ||
                        (school.全年全科考試次數_一年級 && school.全年全科考試次數_一年級 !== '-') ||
                        (school.全年全科測驗次數_二至六年級 && school.全年全科測驗次數_二至六年級 !== '-') ||
                        (school.全年全科考試次數_二至六年級 && school.全年全科考試次數_二至六年級 !== '-')) && (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">{language === 'tc' ? '測考次數' : '测考次数'}</p>
                            <Table data-testid="table-testing-schedule">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs font-medium">{language === 'tc' ? '年級' : '年级'}</TableHead>
                                  <TableHead className="text-xs font-medium text-right">{language === 'tc' ? '測驗' : '测验'}</TableHead>
                                  <TableHead className="text-xs font-medium text-right">{language === 'tc' ? '考試' : '考试'}</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="text-sm">{t.grade1}</TableCell>
                                  <TableCell className="text-sm text-right">
                                    {convertText(school.全年全科測驗次數_一年級 && school.全年全科測驗次數_一年級 !== '-' ? school.全年全科測驗次數_一年級 : '-')}
                                  </TableCell>
                                  <TableCell className="text-sm text-right">
                                    {convertText(school.全年全科考試次數_一年級 && school.全年全科考試次數_一年級 !== '-' ? school.全年全科考試次數_一年級 : '-')}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-sm">{language === 'tc' ? '小二至六' : '小二至六'}</TableCell>
                                  <TableCell className="text-sm text-right">
                                    {convertText(school.全年全科測驗次數_二至六年級 && school.全年全科測驗次數_二至六年級 !== '-' ? school.全年全科測驗次數_二至六年級 : '-')}
                                  </TableCell>
                                  <TableCell className="text-sm text-right">
                                    {convertText(school.全年全科考試次數_二至六年級 && school.全年全科考試次數_二至六年級 !== '-' ? school.全年全科考試次數_二至六年級 : '-')}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          {(school.小一上學期以多元化的進展性評估代替測驗及考試 && school.小一上學期以多元化的進展性評估代替測驗及考試 === '是') && <Separator />}
                        </>
                      )}

                      {(school.小一上學期以多元化的進展性評估代替測驗及考試 && school.小一上學期以多元化的進展性評估代替測驗及考試 === '是') && (
                        <div className="flex items-start gap-2" data-testid="badge-policy-p1-alternative">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm leading-relaxed">{convertText(t.p1AlternativeAssessment)}</p>
                        </div>
                      )}

                      {(school.將校本評估政策上載至學校網頁_讓公眾及持份者知悉 && school.將校本評估政策上載至學校網頁_讓公眾及持份者知悉 === '是') && (
                        <div className="flex items-start gap-2" data-testid="badge-policy-assessment-online">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm leading-relaxed">{convertText(t.assessmentPolicyOnline)}</p>
                        </div>
                      )}

                      {(school.避免緊接在長假期後安排測考_讓學生在假期有充分的休息 && school.避免緊接在長假期後安排測考_讓學生在假期有充分的休息 === '是') && (
                        <div className="flex items-start gap-2" data-testid="badge-policy-avoid-test-holiday">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm leading-relaxed">{convertText(t.avoidTestAfterHoliday)}</p>
                        </div>
                      )}

                      {(() => {
                        const policyItems = [
                          { key: 'afternoon-homework', field: school.按校情靈活編排時間表_盡量在下午安排導修時段_讓學生能在教師指導下完成部分家課, label: t.afternoonHomeworkTime },
                          { key: 'diverse-assessment', field: school.多元學習評估, label: t.diverseLearningAssessment },
                          { key: 'homework-parents', field: school.制定適切的校本課業政策_讓家長了解相關安排_並定期蒐集教師_學生和家長的意見, label: t.homeworkPolicyParents },
                          { key: 'homework-online', field: school.將校本課業政策上載至學校網頁_讓公眾及持份者知悉, label: t.homeworkPolicyOnline },
                        ].filter(item => item.field === '是');

                        if (policyItems.length === 0) return null;

                        return (
                          <>
                            {((school.小一上學期以多元化的進展性評估代替測驗及考試 === '是') || 
                              (school.將校本評估政策上載至學校網頁_讓公眾及持份者知悉 === '是') ||
                              (school.避免緊接在長假期後安排測考_讓學生在假期有充分的休息 === '是')) && <Separator />}
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">{language === 'tc' ? '教學政策' : '教学政策'}</p>
                              <div className="space-y-2">
                                {policyItems.map(item => (
                                  <div key={item.key} className="flex items-start gap-2" data-testid={`badge-policy-${item.key}`}>
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm leading-relaxed">{convertText(item.label)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Student Support Section */}
              {(() => {
                const hasStudentSupportData = 
                  (school.全校參與照顧學生的多樣性 && school.全校參與照顧學生的多樣性 !== '-') ||
                  (school.全校參與模式融合教育 && school.全校參與模式融合教育 !== '-') ||
                  (school.非華語學生的教育支援 && school.非華語學生的教育支援 !== '-');

                if (!hasStudentSupportData) return null;

                return (
                  <Card data-testid="card-student-support">
                    <CardHeader>
                      <CardTitle className="text-base">{language === 'tc' ? '學生支援' : '学生支援'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {school.全校參與照顧學生的多樣性 && school.全校參與照顧學生的多樣性 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.studentDiversity}</p>
                          <HtmlContent content={school.全校參與照顧學生的多樣性} />
                        </div>
                      )}
                      {school.全校參與模式融合教育 && school.全校參與模式融合教育 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.inclusiveEducation}</p>
                          <HtmlContent content={school.全校參與模式融合教育} />
                        </div>
                      )}
                      {school.非華語學生的教育支援 && school.非華語學生的教育支援 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.nonChineseSpeakingSupport}</p>
                          <HtmlContent content={school.非華語學生的教育支援} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}
            </TabsContent>

            <TabsContent value="teaching-features" className="space-y-3 pt-4">
              {/* School Life & Activities Section */}
              {(() => {
                const hasSchoolLifeData = 
                  (school.健康校園生活 && school.健康校園生活 !== '-') ||
                  (school.學校生活備註 && school.學校生活備註 !== '-') ||
                  (school.全方位學習 && school.全方位學習 !== '-') ||
                  (school.環保政策 && school.環保政策 !== '-') ||
                  (school.學校關注事項 && school.學校關注事項 !== '-') ||
                  (school.家校合作 && school.家校合作 !== '-') ||
                  (school.學校特色_其他 && school.學校特色_其他 !== '-');

                if (!hasSchoolLifeData) return null;

                return (
                  <Card data-testid="card-school-life">
                    <CardHeader>
                      <CardTitle className="text-base">{language === 'tc' ? '學校生活與活動' : '学校生活与活动'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {school.健康校園生活 && school.健康校園生活 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.healthyCampusLife}</p>
                          <HtmlContent content={school.健康校園生活} />
                        </div>
                      )}
                      {school.全方位學習 && school.全方位學習 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.wholePerson}</p>
                          <HtmlContent content={school.全方位學習} />
                        </div>
                      )}
                      {school.環保政策 && school.環保政策 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.environmentalPolicy}</p>
                          <HtmlContent content={school.環保政策} />
                        </div>
                      )}
                      {school.學校關注事項 && school.學校關注事項 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.schoolFocusAreas}</p>
                          <HtmlContent content={school.學校關注事項} />
                        </div>
                      )}
                      {school.家校合作 && school.家校合作 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.homeSchoolCooperation}</p>
                          <HtmlContent content={school.家校合作} />
                        </div>
                      )}
                      {school.學校生活備註 && school.學校生活備註 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.schoolLifeRemarks}</p>
                          <HtmlContent content={school.學校生活備註} />
                        </div>
                      )}
                      {school.學校特色_其他 && school.學校特色_其他 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.schoolCharacteristics}</p>
                          <HtmlContent content={school.學校特色_其他} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Curriculum & Teaching Section */}
              {(() => {
                const hasCurriculumData = 
                  (school.學習和教學策略 && school.學習和教學策略 !== '-') ||
                  (school.小學教育課程更新重點的發展 && school.小學教育課程更新重點的發展 !== '-') ||
                  (school.共通能力的培養 && school.共通能力的培養 !== '-') ||
                  (school.正確價值觀_態度和行為的培養 && school.正確價值觀_態度和行為的培養 !== '-') ||
                  (school.課程剪裁及調適措施 && school.課程剪裁及調適措施 !== '-');

                if (!hasCurriculumData) return null;

                return (
                  <Card data-testid="card-curriculum">
                    <CardHeader>
                      <CardTitle className="text-base">{language === 'tc' ? '課程與教學' : '课程与教学'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {school.學習和教學策略 && school.學習和教學策略 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.teachingStrategies}</p>
                          <HtmlContent content={school.學習和教學策略} />
                        </div>
                      )}
                      {school.小學教育課程更新重點的發展 && school.小學教育課程更新重點的發展 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.curriculumDevelopment}</p>
                          <HtmlContent content={school.小學教育課程更新重點的發展} />
                        </div>
                      )}
                      {school.共通能力的培養 && school.共通能力的培養 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.genericSkills}</p>
                          <HtmlContent content={school.共通能力的培養} />
                        </div>
                      )}
                      {school.正確價值觀_態度和行為的培養 && school.正確價值觀_態度和行為的培養 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.valuesEducation}</p>
                          <HtmlContent content={school.正確價值觀_態度和行為的培養} />
                        </div>
                      )}
                      {school.課程剪裁及調適措施 && school.課程剪裁及調適措施 !== '-' && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.curriculumAdaptation}</p>
                          <HtmlContent content={school.課程剪裁及調適措施} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}
            </TabsContent>

            <TabsContent value="contact" className="space-y-3 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.contact}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow label={t.address} value={school.學校地址} icon={MapPin} />
                  <Separator />
                  <InfoRow label={t.phone} value={school.學校電話} icon={Phone} />
                  <Separator />
                  <InfoRow label={t.fax} value={school.學校傳真} />
                  <Separator />
                  <InfoRow label={t.email} value={school.學校電郵} icon={Mail} />
                  <Separator />
                  {school.學校網址 && (
                    <div className="flex gap-3 py-2">
                      <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">{t.website}</p>
                        <a
                          href={school.學校網址}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline break-all"
                          data-testid="link-school-website"
                        >
                          {school.學校網址}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {mapUrl ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.location}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {convertText(school.學校地址)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[400px] md:h-[500px] rounded-md overflow-hidden border">
                      <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map of ${school.學校名稱}`}
                      />
                    </div>
                    {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {language === 'tc' ? '提示：添加 Google Maps API 金鑰可獲得更好的地圖體驗' : '提示：添加 Google Maps API 金钥可获得更好的地图体验'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      {language === 'tc' ? '暫無地址資料' : '暂无地址资料'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="facilities" className="space-y-3 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.facilities}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const numericFacilities = [
                      { label: t.classrooms, value: school.課室數目 },
                      { label: t.halls, value: school.禮堂數目 },
                      { label: t.playgrounds, value: school.操場數目 },
                      { label: t.libraries, value: school.圖書館數目 },
                    ].filter(f => f.value && f.value !== '-');
                    
                    return numericFacilities.length > 0 ? (
                      <div className="space-y-1">
                        {numericFacilities.map((facility, idx) => (
                          <div key={idx}>
                            <InfoRow label={facility.label} value={facility.value} />
                            {idx < numericFacilities.length - 1 && <Separator />}
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  {school.特別室 && school.特別室 !== '-' && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{t.specialRooms}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {school.特別室.split('、').map((room, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {convertText(room.trim())}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {school.其他學校設施 && school.其他學校設施 !== '-' && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{t.otherFacilities}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {school.其他學校設施.split('、').map((facility, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {convertText(facility.trim())}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {school.支援有特殊教育需要學生的設施 && school.支援有特殊教育需要學生的設施 !== '-' && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{t.senSupportFacilities}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {school.支援有特殊教育需要學生的設施.split('、').map((facility, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {convertText(facility.trim())}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="classes" className="space-y-3 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.classDistribution}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-medium">{language === 'tc' ? '學年' : '学年'}</TableHead>
                          <TableHead className="text-xs text-center font-medium">{t.grade1}</TableHead>
                          <TableHead className="text-xs text-center font-medium">{t.grade2}</TableHead>
                          <TableHead className="text-xs text-center font-medium">{t.grade3}</TableHead>
                          <TableHead className="text-xs text-center font-medium">{t.grade4}</TableHead>
                          <TableHead className="text-xs text-center font-medium">{t.grade5}</TableHead>
                          <TableHead className="text-xs text-center font-medium">{t.grade6}</TableHead>
                          <TableHead className="text-xs text-center font-medium">{t.totalClasses}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-xs font-medium">{t.lastYear}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-last-year-p1">{convertText(school.上學年小一班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-last-year-p2">{convertText(school.上學年小二班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-last-year-p3">{convertText(school.上學年小三班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-last-year-p4">{convertText(school.上學年小四班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-last-year-p5">{convertText(school.上學年小五班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-last-year-p6">{convertText(school.上學年小六班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center font-medium" data-testid="cell-last-year-total">{convertText(school.上學年總班數 || '—')}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-xs font-medium">{t.currentYear}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-current-year-p1">{convertText(school.本學年小一班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-current-year-p2">{convertText(school.本學年小二班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-current-year-p3">{convertText(school.本學年小三班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-current-year-p4">{convertText(school.本學年小四班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-current-year-p5">{convertText(school.本學年小五班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center" data-testid="cell-current-year-p6">{convertText(school.本學年小六班數 || '—')}</TableCell>
                          <TableCell className="text-xs text-center font-medium" data-testid="cell-current-year-total">{convertText(school.本學年總班數 || '—')}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teachers" className="space-y-3 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.teachers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm py-2">
                    <span className="text-muted-foreground">{t.approvedTeachers} / {t.totalTeachers}: </span>
                    <span className="font-medium">
                      {school.核准編制教師職位數目 || '—'} / {school.教師總人數 || '—'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {qualificationChartData.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.teacherStats}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={qualificationChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {qualificationChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      {language === 'tc' ? '暫無教師資歷數據' : '暂无教师资历数据'}
                    </p>
                  </CardContent>
                </Card>
              )}

              {experienceChartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.experience}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={experienceChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {experienceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="fees" className="space-y-3 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.fees}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-medium">{language === 'tc' ? '費用項目' : '费用项目'}</TableHead>
                        <TableHead className="text-xs font-medium text-right">{language === 'tc' ? '金額' : '金额'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">{t.tuition}</TableCell>
                        <TableCell className="text-sm text-right">
                          {convertText(school.學費 && school.學費 !== '-' ? school.學費 : t.noData)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">{t.ptaFee}</TableCell>
                        <TableCell className="text-sm text-right">
                          {convertText(school.家長教師會費 && school.家長教師會費 !== '-' ? school.家長教師會費 : t.noData)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">{t.nonStandardFees}</TableCell>
                        <TableCell className="text-sm text-right">
                          {convertText(school.非標準項目的核准收費 && school.非標準項目的核准收費 !== '-' ? school.非標準項目的核准收費 : t.noData)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">{t.hallFee}</TableCell>
                        <TableCell className="text-sm text-right">
                          {convertText(school.堂費 && school.堂費 !== '-' ? school.堂費 : t.noData)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">{t.otherFees}</TableCell>
                        <TableCell className="text-sm text-right">
                          {convertText(school.其他收費_費用 && school.其他收費_費用 !== '-' ? school.其他收費_費用 : t.noData)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">{t.tuitionReduction}</TableCell>
                        <TableCell className="text-sm text-right">
                          {convertText(school.學費減免 && school.學費減免 !== '-' ? school.學費減免 : t.noData)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
