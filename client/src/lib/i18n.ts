import * as OpenCC from 'opencc-js';

export type Language = 'tc' | 'sc';

// Initialize OpenCC converter for Traditional to Simplified Chinese
// Using Hong Kong Traditional (hk) to Mainland Simplified (cn) conversion
const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });

export const translations = {
  tc: {
    // Header
    appTitle: '香港小學資料庫',
    searchPlaceholder: '搜索學校名稱或特色設施...',
    
    // Language toggle
    languageToggle: '简',
    
    // Filters
    filters: '篩選',
    clearFilters: '清除所有篩選',
    activeFilters: '已選篩選',
    region: '區域',
    schoolType: '學校類別',
    gender: '學生性別',
    religion: '宗教',
    language: '教學語言',
    schoolNetwork: '校網',
    schoolNet: '校網',
    fundingType: '資助類型',
    linkedSchool: '關聯學校',
    teacherQuality: '師資',
    applyFilters: '套用',
    
    // School list
    schoolsFound: '所學校',
    noSchools: '沒有找到學校',
    noSchoolsDesc: '請嘗試調整篩選條件',
    
    // School card
    viewDetails: '查看詳情',
    compare: '比較',
    selected: '已選',
    
    // Comparison
    compareSchools: '比較學校',
    comparing: '正在比較',
    removeFromComparison: '移除',
    clearComparison: '清除比較',
    maxComparison: '最多可比較4所學校',
    
    // School details
    basicInfo: '基本資料',
    contact: '聯絡資料',
    facilities: '設施',
    teachers: '教師資料',
    fees: '費用',
    about: '關於',
    
    // Fields
    schoolName: '學校名稱',
    address: '地址',
    phone: '電話',
    fax: '傳真',
    email: '電郵',
    website: '網址',
    establishedYear: '創校年份',
    motto: '校訓',
    area: '佔地面積',
    sponsoringBody: '辦學團體',
    linkedSchools: '聯繫中學',
    directSchools: '直屬中學',
    throughTrain: '一條龍中學',
    tuition: '學費',
    misc: '雜費',
    ptaFee: '家教會費',
    nonStandardFees: '非標準項目的核准收費',
    noData: '沒有',
    classrooms: '課室數目',
    halls: '禮堂數目',
    playgrounds: '操場數目',
    libraries: '圖書館數目',
    specialRooms: '特別室',
    otherFacilities: '其他設施',
    senSupportFacilities: '支援有特殊教育需要學生的設施',
    totalTeachers: '教師總人數',
    trainedRate: '已接受師資培訓百分率',
    degreeRate: '學士百分率',
    masterRate: '碩士/博士百分率',
    mission: '辦學宗旨',
    schoolCulture: '校風',
    trained: '已培訓',
    bachelor: '學士',
    master: '碩士',
    
    // Additional fields
    lastYearClasses: '上學年總班數',
    currentYearClasses: '本學年總班數',
    schoolBus: '校車服務',
    location: '位置',
    map: '地圖',
    teacherStats: '教師資歷統計',
    schoolInfo: '學校資訊',
    activities: '學習活動',
    approvedTeachers: '核准編制教師職位數目',
    schoolArea: '學校佔地面積',
    schoolBoard: '法團校董會',
    pta: '家長教師會',
    nannyBus: '保姆車',
    classTime: '上課時間',
    supervisor: '校監',
    principal: '校長',
    classDistribution: '開班總數',
    lastYear: '上學年',
    currentYear: '本學年',
    grade1: '小一',
    grade2: '小二',
    grade3: '小三',
    grade4: '小四',
    grade5: '小五',
    grade6: '小六',
    totalClasses: '總班數',
    experience: '年資',
    experience0to4: '0-4年',
    experience5to9: '5-9年',
    experience10plus: '10年以上',
    specialEducation: '特殊教育',
    generalArrivalTime: '一般上學時間',
    generalDismissalTime: '一般放學時間',
    lunchStartTime: '午膳開始時間',
    lunchEndTime: '午膳結束時間',
    lunchArrangement: '午膳安排',
    
    // Homework & Assessment
    homeworkArrangement: '課業安排',
    classTeachingMode: '班級教學模式',
    classStructureRemarks: '班級結構備註',
    testCountYear1: '全年全科測驗次數（一年級）',
    examCountYear1: '全年全科考試次數（一年級）',
    p1AlternativeAssessment: '小一上學期以多元化的進展性評估代替測驗及考試',
    testCountYear2to6: '全年全科測驗次數（二至六年級）',
    examCountYear2to6: '全年全科考試次數（二至六年級）',
    homeworkPolicyParents: '制定適切的校本課業政策，讓家長了解相關安排，並定期蒐集教師、學生和家長的意見',
    assessmentPolicyOnline: '將校本評估政策上載至學校網頁，讓公眾及持份者知悉',
    homeworkPolicyOnline: '將校本課業政策上載至學校網頁，讓公眾及持份者知悉',
    diverseLearningAssessment: '多元學習評估',
    avoidTestAfterHoliday: '避免緊接在長假期後安排測考，讓學生在假期有充分的休息',
    afternoonHomeworkTime: '按校情靈活編排時間表，盡量在下午安排導修時段，讓學生能在教師指導下完成部分家課',
    classArrangement: '分班安排',
    yes: '是',
    no: '否',
    
    // Categories
    categories: {
      資助: '資助',
      私立: '私立',
      官立: '官立',
      男女: '男女',
      男: '男',
      女: '女',
      基督教: '基督教',
      天主教: '天主教',
      佛教: '佛教',
      不適用: '無',
    },
    
    // Sort
    sort: '排序',
    sortBy: '排序方式',
    schoolNameAsc: '學校名稱 (A-Z)',
    schoolNameDesc: '學校名稱 (Z-A)',
    regionAsc: '區域 (A-Z)',
    establishedYearAsc: '創校年份 (舊→新)',
    establishedYearDesc: '創校年份 (新→舊)',
  },
  sc: {
    // Header
    appTitle: '香港小学资料库',
    searchPlaceholder: '搜索学校名称或特色设施...',
    
    // Language toggle
    languageToggle: '繁',
    
    // Filters
    filters: '筛选',
    clearFilters: '清除所有筛选',
    activeFilters: '已选筛选',
    region: '区域',
    schoolType: '学校类别',
    gender: '学生性别',
    religion: '宗教',
    language: '教学语言',
    schoolNetwork: '校网',
    schoolNet: '校网',
    fundingType: '资助类型',
    linkedSchool: '关联学校',
    teacherQuality: '师资',
    applyFilters: '套用',
    
    // School list
    schoolsFound: '所学校',
    noSchools: '没有找到学校',
    noSchoolsDesc: '请尝试调整筛选条件',
    
    // School card
    viewDetails: '查看详情',
    compare: '比较',
    selected: '已选',
    
    // Comparison
    compareSchools: '比较学校',
    comparing: '正在比较',
    removeFromComparison: '移除',
    clearComparison: '清除比较',
    maxComparison: '最多可比较4所学校',
    
    // School details
    basicInfo: '基本资料',
    contact: '联络资料',
    facilities: '设施',
    teachers: '教师资料',
    fees: '费用',
    about: '关于',
    
    // Fields
    schoolName: '学校名称',
    address: '地址',
    phone: '电话',
    fax: '传真',
    email: '电邮',
    website: '网址',
    establishedYear: '创校年份',
    motto: '校训',
    area: '占地面积',
    sponsoringBody: '办学团体',
    linkedSchools: '联系中学',
    directSchools: '直属中学',
    throughTrain: '一条龙中学',
    tuition: '学费',
    misc: '杂费',
    ptaFee: '家教会费',
    nonStandardFees: '非标准项目的核准收费',
    noData: '没有',
    classrooms: '课室数目',
    halls: '礼堂数目',
    playgrounds: '操场数目',
    libraries: '图书馆数目',
    specialRooms: '特别室',
    otherFacilities: '其他设施',
    senSupportFacilities: '支援有特殊教育需要学生的设施',
    totalTeachers: '教师总人数',
    trainedRate: '已接受师资培训百分率',
    degreeRate: '学士百分率',
    masterRate: '硕士/博士百分率',
    mission: '办学宗旨',
    schoolCulture: '校风',
    trained: '已培训',
    bachelor: '学士',
    master: '硕士',
    
    // Additional fields
    lastYearClasses: '上学年总班数',
    currentYearClasses: '本学年总班数',
    schoolBus: '校车服务',
    location: '位置',
    map: '地图',
    teacherStats: '教师资历统计',
    schoolInfo: '学校资讯',
    activities: '学习活动',
    approvedTeachers: '核准编制教师职位数目',
    schoolArea: '学校占地面积',
    schoolBoard: '法团校董会',
    pta: '家长教师会',
    nannyBus: '保姆车',
    classTime: '上课时间',
    supervisor: '校监',
    principal: '校长',
    classDistribution: '开班总数',
    lastYear: '上学年',
    currentYear: '本学年',
    grade1: '小一',
    grade2: '小二',
    grade3: '小三',
    grade4: '小四',
    grade5: '小五',
    grade6: '小六',
    totalClasses: '总班数',
    experience: '年资',
    experience0to4: '0-4年',
    experience5to9: '5-9年',
    experience10plus: '10年以上',
    specialEducation: '特殊教育',
    generalArrivalTime: '一般上学时间',
    generalDismissalTime: '一般放学时间',
    lunchStartTime: '午膳开始时间',
    lunchEndTime: '午膳结束时间',
    lunchArrangement: '午膳安排',
    
    // Homework & Assessment
    homeworkArrangement: '课业安排',
    classTeachingMode: '班级教学模式',
    classStructureRemarks: '班级结构备注',
    testCountYear1: '全年全科测验次数（一年级）',
    examCountYear1: '全年全科考试次数（一年级）',
    p1AlternativeAssessment: '小一上学期以多元化的进展性评估代替测验及考试',
    testCountYear2to6: '全年全科测验次数（二至六年级）',
    examCountYear2to6: '全年全科考试次数（二至六年级）',
    homeworkPolicyParents: '制定适切的校本课业政策，让家长了解相关安排，并定期搜集教师、学生和家长的意见',
    assessmentPolicyOnline: '将校本评估政策上载至学校网页，让公众及持份者知悉',
    homeworkPolicyOnline: '将校本课业政策上载至学校网页，让公众及持份者知悉',
    diverseLearningAssessment: '多元学习评估',
    avoidTestAfterHoliday: '避免紧接在长假期后安排测考，让学生在假期有充分的休息',
    afternoonHomeworkTime: '按校情灵活编排时间表，尽量在下午安排导修时段，让学生能在教师指导下完成部分家课',
    classArrangement: '分班安排',
    yes: '是',
    no: '否',
    
    // Categories
    categories: {
      資助: '资助',
      私立: '私立',
      官立: '官立',
      男女: '男女',
      男: '男',
      女: '女',
      基督教: '基督教',
      天主教: '天主教',
      佛教: '佛教',
      不適用: '无',
    },
    
    // Sort
    sort: '排序',
    sortBy: '排序方式',
    schoolNameAsc: '学校名称 (A-Z)',
    schoolNameDesc: '学校名称 (Z-A)',
    regionAsc: '区域 (A-Z)',
    establishedYearAsc: '创校年份 (旧→新)',
    establishedYearDesc: '创校年份 (新→旧)',
  },
};

/**
 * Converts any Chinese text (Traditional or Simplified) to Simplified Chinese
 * Uses opencc-js for comprehensive and reliable conversion
 * Used for bidirectional search matching - allows users to search with either TC or SC
 */
export function convertToSimplified(text: string): string {
  if (!text) return '';
  return converter(text);
}
