import { X, MapPin, Phone, Mail, Globe, Users, BookOpen, Building2, DollarSign, GraduationCap, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
      <div className="flex gap-3 py-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-sm leading-relaxed">{convertText(value)}</p>
        </div>
      </div>
    );
  };

  // Prepare teacher qualification chart data
  const getTeacherChartData = () => {
    const data = [];
    
    if (school.已接受師資培訓人數百分率 && school.已接受師資培訓人數百分率 !== '未有資料') {
      const value = parseFloat(school.已接受師資培訓人數百分率.replace('%', ''));
      if (!isNaN(value)) {
        data.push({ name: t.trained, value, color: '#10b981' });
      }
    }
    
    if (school.學士人數百分率 && school.學士人數百分率 !== '未有資料') {
      const value = parseFloat(school.學士人數百分率.replace('%', ''));
      if (!isNaN(value)) {
        data.push({ name: t.bachelor, value, color: '#3b82f6' });
      }
    }
    
    if (school.碩士博士或以上人數百分率 && school.碩士博士或以上人數百分率 !== '未有資料') {
      const value = parseFloat(school.碩士博士或以上人數百分率.replace('%', ''));
      if (!isNaN(value)) {
        data.push({ name: t.master, value, color: '#8b5cf6' });
      }
    }
    
    return data;
  };

  const teacherChartData = getTeacherChartData();

  // Generate Google Maps embed URL
  const getMapUrl = () => {
    if (!school.學校地址) return null;
    const address = encodeURIComponent(school.學校地址);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    
    if (apiKey) {
      // Use Maps Embed API if API key is available
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${address}`;
    } else {
      // Fallback to basic embed without API key
      return `https://www.google.com/maps?q=${address}&output=embed`;
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
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
              <TabsTrigger value="basic" data-testid="tab-basic" className="text-xs">{t.basicInfo}</TabsTrigger>
              <TabsTrigger value="contact" data-testid="tab-contact" className="text-xs">{t.contact}</TabsTrigger>
              <TabsTrigger value="facilities" data-testid="tab-facilities" className="text-xs">{t.facilities}</TabsTrigger>
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
                  <InfoRow label={t.motto} value={school.校訓} />
                  <Separator />
                  <InfoRow label={t.schoolArea} value={school.學校佔地面積} />
                  <Separator />
                  <InfoRow label={t.schoolBoard} value={school.法團校董會} />
                  <Separator />
                  <InfoRow label={t.schoolBus} value={school.校車} />
                  <Separator />
                  <InfoRow label={t.pta} value={school.家長教師會} />
                  <Separator />
                  <InfoRow label={t.language === 'tc' ? '學校類別2' : '学校类别2'} value={school.學校類別2} />
                </CardContent>
              </Card>

              {school.辦學宗旨&& (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.mission}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{convertText(school.辦學宗旨)}</p>
                  </CardContent>
                </Card>
              )}

              {school.校風 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.schoolCulture}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{convertText(school.校風)}</p>
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
                <CardContent className="space-y-1">
                  <InfoRow label={t.classrooms} value={school.課室數目} />
                  <Separator />
                  <InfoRow label={t.halls} value={school.禮堂數目} />
                  <Separator />
                  <InfoRow label={t.playgrounds} value={school.操場數目} />
                  <Separator />
                  <InfoRow label={t.libraries} value={school.圖書館數目} />
                  <Separator />
                  <InfoRow label={t.lastYearClasses} value={school.上學年總班數} />
                  <Separator />
                  <InfoRow label={t.currentYearClasses} value={school.本學年總班數} />
                  <Separator />
                  <InfoRow label={t.schoolBus} value={school.校車} />
                  <Separator />
                  <InfoRow label={t.language === 'tc' ? '保姆車' : '保姆车'} value={school.保姆車} />
                </CardContent>
              </Card>

              {school.特別室 && school.特別室 !== '-' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.specialRooms}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {school.特別室.split('、').map((room, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {convertText(room.trim())}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {school.其他學校設施 && school.其他學校設施 !== '-' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.otherFacilities}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {school.其他學校設施.split('、').map((facility, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {convertText(facility.trim())}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="teachers" className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.teachers}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow label={t.totalTeachers} value={school.教師總人數} icon={GraduationCap} />
                  <Separator />
                  <InfoRow label={t.approvedTeachers} value={school.核准編制教師職位數目} />
                  <Separator />
                  <InfoRow label={t.trainedRate} value={school.已接受師資培訓人數百分率 && school.已接受師資培訓人數百分率 !== '未有資料' ? `${school.已接受師資培訓人數百分率}${school.已接受師資培訓人數百分率.includes('%') ? '' : '%'}` : undefined} />
                  <Separator />
                  <InfoRow label={t.degreeRate} value={school.學士人數百分率 && school.學士人數百分率 !== '未有資料' ? `${school.學士人數百分率}${school.學士人數百分率.includes('%') ? '' : '%'}` : undefined} />
                  <Separator />
                  <InfoRow label={t.masterRate} value={school.碩士博士或以上人數百分率 && school.碩士博士或以上人數百分率 !== '未有資料' ? `${school.碩士博士或以上人數百分率}${school.碩士博士或以上人數百分率.includes('%') ? '' : '%'}` : undefined} />
                </CardContent>
              </Card>

              {teacherChartData.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.teacherStats}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={teacherChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {teacherChartData.map((entry, index) => (
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
                      {t.language === 'tc' ? '暫無教師資歷數據' : '暂无教师资历数据'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="fees" className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.fees}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow label={t.tuition} value={school.學費} icon={DollarSign} />
                  <Separator />
                  <InfoRow label={t.misc} value={school.堂費} />
                  <Separator />
                  <InfoRow label={t.ptaFee} value={school.家長教師會費} />
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
                        {t.language === 'tc' ? '提示：添加 Google Maps API 金鑰可獲得更好的地圖體驗' : '提示：添加 Google Maps API 金钥可获得更好的地图体验'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      {t.language === 'tc' ? '暫無地址資料' : '暂无地址资料'}
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
