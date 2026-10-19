export type Sport = "basketball" | "football" | "badminton";
export type Heat = 0 | 1 | 2 | 3 | 4;
export type Condition = "join" | "full" | "match" | "unknown";
export type Status =
  | "playing"
  | "going"
  | "maybe"
  | "looking"
  | "resting"
  | "hidden";

export interface Court {
  id: string;
  name: string;
  sport: Sport;
  area: string;
  heat: Heat;
  reports: number;
  minutes: number;
  playing: number;
  going: number;
  maybe: number;
  color: string;
  description: string;
  facilities: string[];
}

// 场地位置参考：中国科大校园地图 https://weixine.ustc.edu.cn/ustcqy/mobile/newMappro/
// 体育教学中心场地介绍 https://www.tj.ustc.edu.cn/1441/list.htm
// 西区两处球场具体方位参考校内社区记录 https://ustcforum.com/d/405/3
// 旧 west-b 上报未区分两处西区球场，不归入任一新场地，避免误导。
export const courts: Court[] = [
  {
    id: "east-b",
    name: "东区篮球场",
    sport: "basketball",
    area: "东区 · 体育馆附近",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "blue",
    description: "树荫环绕的室外篮球场，傍晚是最热闹的时段。",
    facilities: ["室外场地", "夜间照明", "饮水点附近"],
  },
  {
    id: "west-track-b",
    name: "西区操场篮球场",
    sport: "basketball",
    area: "西区 · 操场南侧",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "green",
    description: "位于西区操场南侧。请与同步辐射实验室东侧的篮球场区分上报。",
    facilities: ["室外场地", "西区操场南侧"],
  },
  {
    id: "west-synchrotron-b",
    name: "西区同步辐射篮球场",
    sport: "basketball",
    area: "西区 · 国家同步辐射实验室东侧",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "blue",
    description: "位于国家同步辐射实验室东侧，与西区操场南侧篮球场是两处不同场地。",
    facilities: ["室外场地", "同步辐射实验室东侧"],
  },
  {
    id: "middle-b",
    name: "中区篮球场",
    sport: "basketball",
    area: "中区 · 综合体育馆旁",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "orange",
    description: "位于中区综合体育馆旁的室外篮球场。",
    facilities: ["室外场地", "综合体育馆旁"],
  },
  {
    id: "middle-indoor-b",
    name: "中区室内篮球馆",
    sport: "basketball",
    area: "中区 · 体育中心篮球训练馆",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "orange",
    description: "中区体育中心内的室内篮球场地；开放及预约情况以学校通知为准。",
    facilities: ["室内场地", "体育中心"],
  },
  {
    id: "middle-badminton",
    name: "中区综合体育馆羽毛球场",
    sport: "badminton",
    area: "中区 · 综合体育馆内",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "orange",
    description: "位于中区综合体育馆内；开放及预约情况以学校通知为准。",
    facilities: ["室内场地", "综合体育馆"],
  },
  {
    id: "east-badminton",
    name: "东区羽毛球馆",
    sport: "badminton",
    area: "东区 · 体育教学楼旁",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "blue",
    description: "位于东区体育教学楼旁；开放情况以学校通知为准。",
    facilities: ["室内场地", "体育教学楼旁"],
  },
  {
    id: "west-badminton",
    name: "西区气膜馆羽毛球场",
    sport: "badminton",
    area: "西区 · 研究生公寓旁气膜馆",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "green",
    description: "位于西区研究生公寓旁的气膜馆内；开放情况以学校通知为准。",
    facilities: ["室内场地", "气膜馆"],
  },
  {
    id: "east-f",
    name: "东区足球场",
    sport: "football",
    area: "东区 · 田径场内",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "green",
    description: "开阔的草地球场，适合和朋友们组队开踢。",
    facilities: ["草地球场", "跑道附近", "夜间照明"],
  },
  {
    id: "west-f",
    name: "西区足球场",
    sport: "football",
    area: "西区 · 体育中心旁",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "blue",
    description: "一片适合练习和轻松友谊赛的足球场。",
    facilities: ["草地球场", "体育中心附近"],
  },
  {
    id: "north-f",
    name: "北区足球场",
    sport: "football",
    area: "北区 · 宿舍区附近",
    heat: 0,
    reports: 0,
    minutes: 0,
    playing: 0,
    going: 0,
    maybe: 0,
    color: "orange",
    description: "离宿舍不远，适合随时约球。",
    facilities: ["室外场地", "宿舍区附近"],
  },
];

export const heatLabels = [
  "空场",
  "较冷清",
  "一般",
  "较热闹",
  "很热闹",
] as const;
export const heatEmoji = ["😶", "🙂", "😊", "😄", "😆"] as const;
export const conditions: { id: Condition; label: string; emoji: string }[] = [
  { id: "join", label: "看起来可以加入", emoji: "👍" },
  { id: "full", label: "场地已满", emoji: "👥" },
  { id: "match", label: "正在比赛", emoji: "🏆" },
  { id: "unknown", label: "不确定", emoji: "❔" },
];

export const statusOptions: {
  id: Status;
  label: string;
  subtitle: string;
  icon: string;
  color: string;
}[] = [
  {
    id: "playing",
    label: "正在打球",
    subtitle: "我正在场上",
    icon: "🏃",
    color: "green",
  },
  {
    id: "going",
    label: "前往球场",
    subtitle: "正在路上",
    icon: "🚶",
    color: "mint",
  },
  {
    id: "maybe",
    label: "今晚可能打球",
    subtitle: "可能会去，待定",
    icon: "🌙",
    color: "purple",
  },
  {
    id: "looking",
    label: "想打球，缺球友",
    subtitle: "求队友一起打！",
    icon: "🙌",
    color: "orange",
  },
  {
    id: "resting",
    label: "今天不打球",
    subtitle: "今天先休息",
    icon: "🛋️",
    color: "slate",
  },
  {
    id: "hidden",
    label: "隐身",
    subtitle: "不向他人展示状态",
    icon: "🥷",
    color: "slate",
  },
];

export function statusLabel(status: Status) {
  return statusOptions.find((s) => s.id === status)!.label;
}
export function sportLabel(sport: Sport) {
  return sport === "basketball" ? "篮球" : sport === "football" ? "足球" : "羽毛球";
}
