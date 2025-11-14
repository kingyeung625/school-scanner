import { z } from "zod";

export const schoolSchema = z.object({
  id: z.string(),
  學校名稱: z.string(),
  區域: z.string(),
  學校地址: z.string(),
  小一學校網: z.string(),
  學校電話: z.string(),
  學校傳真: z.string().optional(),
  學校電郵: z.string().optional(),
  學校網址: z.string().optional(),
  學校類別1: z.string(), // 資助/私立/官立
  學校類別2: z.string(), // 全日/上下午
  法團校董會: z.string().optional(),
  校監_校管會主席姓名: z.string().optional(),
  校監_校管會主席稱謂: z.string().optional(),
  校長姓名: z.string().optional(),
  校長稱謂: z.string().optional(),
  學生性別: z.string(), // 男女/男/女
  辦學團體: z.string().optional(),
  創校年份: z.string().optional(),
  宗教: z.string().optional(),
  校訓: z.string().optional(),
  學校佔地面積: z.string().optional(),
  教學語言: z.string().optional(),
  一條龍中學: z.string().optional(),
  直屬中學: z.string().optional(),
  聯繫中學: z.string().optional(),
  校車: z.string().optional(),
  保姆車: z.string().optional(),
  家長教師會: z.string().optional(),
  一般上學時間: z.string().optional(),
  一般放學時間: z.string().optional(),
  午膳開始時間: z.string().optional(),
  午膳結束時間: z.string().optional(),
  午膳安排: z.string().optional(),
  學費: z.string().optional(),
  堂費: z.string().optional(),
  家長教師會費: z.string().optional(),
  非標準項目的核准收費: z.string().optional(),
  課室數目: z.string().optional(),
  禮堂數目: z.string().optional(),
  操場數目: z.string().optional(),
  圖書館數目: z.string().optional(),
  特別室: z.string().optional(),
  其他學校設施: z.string().optional(),
  支援有特殊教育需要學生的設施: z.string().optional(),
  核准編制教師職位數目: z.string().optional(),
  教師總人數: z.string().optional(),
  已接受師資培訓人數百分率: z.string().optional(),
  學士人數百分率: z.string().optional(),
  碩士博士或以上人數百分率: z.string().optional(),
  特殊教育培訓人數百分率: z.string().optional(),
  "0至4年年資人數百分率": z.string().optional(),
  "5至9年年資人數百分率": z.string().optional(),
  "10年年資或以上人數百分率": z.string().optional(),
  上學年小一班數: z.string().optional(),
  上學年小二班數: z.string().optional(),
  上學年小三班數: z.string().optional(),
  上學年小四班數: z.string().optional(),
  上學年小五班數: z.string().optional(),
  上學年小六班數: z.string().optional(),
  上學年總班數: z.string().optional(),
  本學年小一班數: z.string().optional(),
  本學年小二班數: z.string().optional(),
  本學年小三班數: z.string().optional(),
  本學年小四班數: z.string().optional(),
  本學年小五班數: z.string().optional(),
  本學年小六班數: z.string().optional(),
  本學年總班數: z.string().optional(),
  辦學宗旨: z.string().optional(),
  校風: z.string().optional(),
  班級教學模式: z.string().optional(),
  班級結構備註: z.string().optional(),
  全年全科測驗次數_一年級: z.string().optional(),
  全年全科考試次數_一年級: z.string().optional(),
  小一上學期以多元化的進展性評估代替測驗及考試: z.string().optional(),
  全年全科測驗次數_二至六年級: z.string().optional(),
  全年全科考試次數_二至六年級: z.string().optional(),
  制定適切的校本課業政策_讓家長了解相關安排_並定期蒐集教師_學生和家長的意見: z.string().optional(),
  將校本評估政策上載至學校網頁_讓公眾及持份者知悉: z.string().optional(),
  將校本課業政策上載至學校網頁_讓公眾及持份者知悉: z.string().optional(),
  多元學習評估: z.string().optional(),
  避免緊接在長假期後安排測考_讓學生在假期有充分的休息: z.string().optional(),
  按校情靈活編排時間表_盡量在下午安排導修時段_讓學生能在教師指導下完成部分家課: z.string().optional(),
  分班安排: z.string().optional(),
});

export type School = z.infer<typeof schoolSchema>;

export interface FilterState {
  區域: string[];
  校網: string[];
  資助類型: string[];
  學生性別: string[];
  宗教: string[];
  教學語言: string[];
  關聯學校: string[];
  searchQuery: string;
}

export interface SortState {
  field: keyof School | null;
  direction: 'asc' | 'desc';
}
