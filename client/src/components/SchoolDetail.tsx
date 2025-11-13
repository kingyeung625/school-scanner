import { X, MapPin, Phone, Mail, Globe, Users, BookOpen, Building2, DollarSign, GraduationCap, Calendar } from 'lucide-react';
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
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-6">
              <TabsTrigger value="basic" data-testid="tab-basic" className="text-xs">{t.basicInfo}</TabsTrigger>
              <TabsTrigger value="contact" data-testid="tab-contact" className="text-xs">{t.contact}</TabsTrigger>
              <TabsTrigger value="facilities" data-testid="tab-facilities" className="text-xs">{t.facilities}</TabsTrigger>
              <TabsTrigger value="classes" data-testid="tab-classes" className="text-xs">{t.classDistribution}</TabsTrigger>
              <TabsTrigger value="teachers" data-testid="tab-teachers" className="text-xs">{t.teachers}</TabsTrigger>
              <TabsTrigger value="fees" data-testid="tab-fees" className="text-xs">{t.fees}</TabsTrigger>
              <TabsTrigger value="map" data-testid="tab-map" className="text-xs">{t.map}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-3">
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
                  <InfoRow label={t.supervisor} value={formatName(school.校監_校管會主席稱謂, school.校監_校管會主席姓名)} />
                  <Separator />
                  <InfoRow label={t.principal} value={formatName(school.校長稱謂, school.校長姓名)} />
                  <Separator />
                  <InfoRow label={t.gender} value={school.學生性別} icon={Users} />
                  <Separator />
                  <InfoRow label={t.language} value={school.教學語言} icon={BookOpen} />
                  <Separator />
                  <InfoRow label={t.religion} value={school.宗教} />
                  <Separator />
                  <InfoRow label={t.establishedYear} value={school.創校年份} icon={Calendar} />
                  <Separator />
                  <InfoRow label={t.sponsoringBody} value={school.辦學團體} />
                  <Separator />
                  <InfoRow label={t.schoolArea} value={school.學校佔地面積} />
                  <Separator />
                  <InfoRow label={t.schoolBoard} value={school.法團校董會} />
                  <Separator />
                  <InfoRow label={t.pta} value={school.家長教師會} />
                </CardContent>
              </Card>

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

              {((school.校訓 && school.校訓 !== '-') || (school.校風 && school.校風 !== '-') || (school.辦學宗旨 && school.辦學宗旨 !== '-')) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{language === 'tc' ? '辦學理念' : '办学理念'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {school.校訓 && school.校訓 !== '-' && (
                      <>
                        <div className="flex gap-3 py-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">{t.motto}</p>
                            <p className="text-sm leading-relaxed">{convertText(school.校訓)}</p>
                          </div>
                        </div>
                        {((school.校風 && school.校風 !== '-') || (school.辦學宗旨 && school.辦學宗旨 !== '-')) && <Separator />}
                      </>
                    )}
                    {school.辦學宗旨 && school.辦學宗旨 !== '-' && (
                      <>
                        <div className="flex gap-3 py-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">{t.mission}</p>
                            <p className="text-sm leading-relaxed">{convertText(school.辦學宗旨)}</p>
                          </div>
                        </div>
                        {(school.校風 && school.校風 !== '-') && <Separator />}
                      </>
                    )}
                    {school.校風 && school.校風 !== '-' && (
                      <div className="flex gap-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">{t.schoolCulture}</p>
                          <p className="text-sm leading-relaxed">{convertText(school.校風)}</p>
                        </div>
                      </div>
                    )}
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

            <TabsContent value="contact" className="space-y-3">
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
            </TabsContent>

            <TabsContent value="facilities" className="space-y-3">
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

            <TabsContent value="classes" className="space-y-3">
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

            <TabsContent value="teachers" className="space-y-3">
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

            <TabsContent value="fees" className="space-y-3">
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
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map" className="space-y-3">
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
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
