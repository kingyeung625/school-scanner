import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import type { School } from '@shared/school-schema';
import AdBanner from './AdBanner';

interface ComparisonViewProps {
  schools: School[];
  onClose: () => void;
  onRemove: (school: School) => void;
}

export default function ComparisonView({ schools, onClose, onRemove }: ComparisonViewProps) {
  const { t, convertText } = useLanguage();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    
    const handleScroll = () => {
      if (scrollElement) {
        setShowBackToTop(scrollElement.scrollTop > 200);
      }
    };

    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
                <div 
                  className="text-sm leading-relaxed [&_br]:block [&_br]:my-1"
                  dangerouslySetInnerHTML={{ __html: value ? convertText(value) : '-' }}
                />
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

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* School Names Header */}
          <div className="border rounded-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] bg-muted/50">
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
          </div>

          {/* Ad banner before first accordion */}
          <div className="flex justify-center mb-6">
            <AdBanner />
          </div>

          <Accordion type="multiple" className="space-y-4">
            {/* Section 1: Basic Information */}
            <AccordionItem value="basic-info" className="border rounded-md px-4">
              <AccordionTrigger className="text-lg font-semibold" data-testid="accordion-basic-info">
                {t.comparisonBasicInfo}
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t">
                  <ComparisonRow label={t.region} getValue={(s) => s.區域} />
                  <ComparisonRow label={t.schoolNet} getValue={(s) => s.小一學校網} />
                  <ComparisonRow label={t.schoolType} getValue={(s) => s.學校類別1} />
                  <ComparisonRow label={t.classTime} getValue={(s) => s.學校類別2} />
                  <ComparisonRow label={t.gender} getValue={(s) => s.學生性別} />
                  <ComparisonRow label={t.language} getValue={(s) => s.教學語言} />
                  <ComparisonRow label={t.religion} getValue={(s) => s.宗教} />
                  <ComparisonRow label={t.establishedYear} getValue={(s) => s.創校年份} />
                  <ComparisonRow label={t.sponsoringBody} getValue={(s) => s.辦學團體} />
                  <ComparisonRow label={t.motto} getValue={(s) => s.校訓} />
                  <ComparisonRow label={t.throughTrain} getValue={(s) => s.一條龍中學} />
                  <ComparisonRow label={t.directSchools} getValue={(s) => s.直屬中學} />
                  <ComparisonRow label={t.linkedSchools} getValue={(s) => s.聯繫中學} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: School Operations */}
            <AccordionItem value="operations" className="border rounded-md px-4">
              <AccordionTrigger className="text-lg font-semibold" data-testid="accordion-operations">
                {t.comparisonOperations}
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t">
                  <ComparisonRow label={t.generalArrivalTime} getValue={(s) => s.一般上學時間} />
                  <ComparisonRow label={t.generalDismissalTime} getValue={(s) => s.一般放學時間} />
                  <ComparisonRow label={t.lunchStartTime} getValue={(s) => s.午膳開始時間} />
                  <ComparisonRow label={t.lunchEndTime} getValue={(s) => s.午膳結束時間} />
                  <ComparisonRow label={t.lunchArrangement} getValue={(s) => s.午膳安排} />
                  <ComparisonRow label={t.schoolBus} getValue={(s) => s.校車} />
                  <ComparisonRow label={t.nannyBus} getValue={(s) => s.保姆車} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 3: Fees */}
            <AccordionItem value="fees" className="border rounded-md px-4">
              <AccordionTrigger className="text-lg font-semibold" data-testid="accordion-fees">
                {t.comparisonFees}
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t">
                  <ComparisonRow label={t.tuition} getValue={(s) => s.學費} />
                  <ComparisonRow label={t.tuitionReduction} getValue={(s) => s.學費減免} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Ad banner after section 3 */}
            <div className="flex justify-center my-6">
              <AdBanner />
            </div>

            {/* Section 4: Philosophy */}
            <AccordionItem value="philosophy" className="border rounded-md px-4">
              <AccordionTrigger className="text-lg font-semibold" data-testid="accordion-philosophy">
                {t.comparisonPhilosophy}
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t">
                  <ComparisonRow label={t.mission} getValue={(s) => s.辦學宗旨} />
                  <ComparisonRow label={t.schoolCulture} getValue={(s) => s.校風} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 5: Teaching & Class Structure */}
            <AccordionItem value="teaching" className="border rounded-md px-4">
              <AccordionTrigger className="text-lg font-semibold" data-testid="accordion-teaching">
                {t.comparisonTeaching}
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t">
                  <ComparisonRow label={t.classTeachingMode} getValue={(s) => s.班級教學模式} />
                  <ComparisonRow label={t.classStructureRemarks} getValue={(s) => s.班級結構備註} />
                  <ComparisonRow label={t.classArrangement} getValue={(s) => s.分班安排} />
                  <ComparisonRow label={t.teachingStrategies} getValue={(s) => s.學習和教學策略} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 6: Assessment & Homework */}
            <AccordionItem value="assessment" className="border rounded-md px-4">
              <AccordionTrigger className="text-lg font-semibold" data-testid="accordion-assessment">
                {t.comparisonAssessment}
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t">
                  <ComparisonRow label={t.testCountYear1} getValue={(s) => s.全年全科測驗次數_一年級} />
                  <ComparisonRow label={t.examCountYear1} getValue={(s) => s.全年全科考試次數_一年級} />
                  <ComparisonRow label={t.p1AlternativeAssessment} getValue={(s) => s.小一上學期以多元化的進展性評估代替測驗及考試} />
                  <ComparisonRow label={t.testCountYear2to6} getValue={(s) => s.全年全科測驗次數_二至六年級} />
                  <ComparisonRow label={t.examCountYear2to6} getValue={(s) => s.全年全科考試次數_二至六年級} />
                  <ComparisonRow label={t.homeworkPolicyParents} getValue={(s) => s.制定適切的校本課業政策_讓家長了解相關安排_並定期蒐集教師_學生和家長的意見} />
                  <ComparisonRow label={t.assessmentPolicyOnline} getValue={(s) => s.將校本評估政策上載至學校網頁_讓公眾及持份者知悉} />
                  <ComparisonRow label={t.diverseLearningAssessment} getValue={(s) => s.多元學習評估} />
                  <ComparisonRow label={t.avoidTestAfterHoliday} getValue={(s) => s.避免緊接在長假期後安排測考_讓學生在假期有充分的休息} />
                  <ComparisonRow label={t.afternoonHomeworkTime} getValue={(s) => s.按校情靈活編排時間表_盡量在下午安排導修時段_讓學生能在教師指導下完成部分家課} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Ad banner after section 6 */}
            <div className="flex justify-center my-6">
              <AdBanner />
            </div>

            {/* Section 7: Curriculum Development */}
            <AccordionItem value="curriculum" className="border rounded-md px-4">
              <AccordionTrigger className="text-lg font-semibold" data-testid="accordion-curriculum">
                {t.comparisonCurriculum}
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t">
                  <ComparisonRow label={t.curriculumDevelopment} getValue={(s) => s.小學教育課程更新重點的發展} />
                  <ComparisonRow label={t.genericSkills} getValue={(s) => s.共通能力的培養} />
                  <ComparisonRow label={t.valuesEducation} getValue={(s) => s.正確價值觀_態度和行為的培養} />
                  <ComparisonRow label={t.curriculumAdaptation} getValue={(s) => s.課程剪裁及調適措施} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 8: Student Support */}
            <AccordionItem value="support" className="border rounded-md px-4">
              <AccordionTrigger className="text-lg font-semibold" data-testid="accordion-support">
                {t.comparisonSupport}
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t">
                  <ComparisonRow label={t.studentDiversity} getValue={(s) => s.全校參與照顧學生的多樣性} />
                  <ComparisonRow label={t.inclusiveEducation} getValue={(s) => s.全校參與模式融合教育} />
                  <ComparisonRow label={t.nonChineseSpeakingSupport} getValue={(s) => s.非華語學生的教育支援} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 9: School Life & Activities */}
            <AccordionItem value="school-life" className="border rounded-md px-4">
              <AccordionTrigger className="text-lg font-semibold" data-testid="accordion-school-life">
                {t.comparisonSchoolLife}
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t">
                  <ComparisonRow label={t.healthyCampusLife} getValue={(s) => s.健康校園生活} />
                  <ComparisonRow label={t.wholePerson} getValue={(s) => s.全方位學習} />
                  <ComparisonRow label={t.environmentalPolicy} getValue={(s) => s.環保政策} />
                  <ComparisonRow label={t.schoolFocusAreas} getValue={(s) => s.學校關注事項} />
                  <ComparisonRow label={t.homeSchoolCooperation} getValue={(s) => s.家校合作} />
                  <ComparisonRow label={t.schoolLifeRemarks} getValue={(s) => s.學校生活備註} />
                  <ComparisonRow label={t.schoolCharacteristics} getValue={(s) => s.學校特色_其他} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Ad banner at bottom of comparison */}
          <div className="flex justify-center mt-8 mb-4">
            <AdBanner />
          </div>
          
          {/* Disclaimer footer */}
          <div className="pt-4 pb-8 border-t text-center">
            <p className="text-xs text-muted-foreground">
              {convertText('以上資料取自《小學概覽》2025，只供參考，所有資訊應以學校官方公布作準')}
            </p>
          </div>
        </div>
      </ScrollArea>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-8 right-8 rounded-full shadow-lg z-50"
          onClick={scrollToTop}
          data-testid="button-back-to-top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
