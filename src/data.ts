export type Sport = 'basketball' | 'football'
export type Heat = 0 | 1 | 2 | 3 | 4
export type Condition = 'join' | 'full' | 'match' | 'unknown'
export type Status = 'playing' | 'going' | 'maybe' | 'looking' | 'resting' | 'hidden'

export interface Court {
  id: string
  name: string
  sport: Sport
  area: string
  walk: number
  heat: Heat
  reports: number
  minutes: number
  playing: number
  going: number
  maybe: number
  color: string
  description: string
  facilities: string[]
}

export interface Friend {
  id: string
  name: string
  handle: string
  avatar: string
  avatarColor: string
  status: Status
  sport: Sport
  court?: string
  time: string
  following: boolean
}

export const courts: Court[] = [
  { id: 'east-b', name: '东区篮球场', sport: 'basketball', area: '东区 · 体育馆附近', walk: 3, heat: 0, reports: 0, minutes: 0, playing: 0, going: 0, maybe: 0, color: 'blue', description: '树荫环绕的室外篮球场，傍晚是最热闹的时段。', facilities: ['室外场地', '夜间照明', '饮水点附近'] },
  { id: 'west-b', name: '西区篮球场', sport: 'basketball', area: '西区 · 学生活动中心旁', walk: 8, heat: 0, reports: 0, minutes: 0, playing: 0, going: 0, maybe: 0, color: 'green', description: '空间宽敞，适合约上球友来一场半场对抗。', facilities: ['室外场地', '多个篮筐'] },
  { id: 'middle-b', name: '中区篮球场', sport: 'basketball', area: '中区 · 教学楼附近', walk: 6, heat: 0, reports: 0, minutes: 0, playing: 0, going: 0, maybe: 0, color: 'orange', description: '课间也能来投几个球的便利球场。', facilities: ['室外场地', '教学区附近'] },
  { id: 'east-f', name: '东区足球场', sport: 'football', area: '东区 · 田径场内', walk: 5, heat: 0, reports: 0, minutes: 0, playing: 0, going: 0, maybe: 0, color: 'green', description: '开阔的草地球场，适合和朋友们组队开踢。', facilities: ['草地球场', '跑道附近', '夜间照明'] },
  { id: 'west-f', name: '西区足球场', sport: 'football', area: '西区 · 体育中心旁', walk: 11, heat: 0, reports: 0, minutes: 0, playing: 0, going: 0, maybe: 0, color: 'blue', description: '一片适合练习和轻松友谊赛的足球场。', facilities: ['草地球场', '体育中心附近'] },
  { id: 'north-f', name: '北区足球场', sport: 'football', area: '北区 · 宿舍区附近', walk: 9, heat: 0, reports: 0, minutes: 0, playing: 0, going: 0, maybe: 0, color: 'orange', description: '离宿舍不远，适合随时约球。', facilities: ['室外场地', '宿舍区附近'] },
]

export const friends: Friend[] = []

export const heatLabels = ['空场', '较冷清', '一般', '较热闹', '很热闹'] as const
export const heatEmoji = ['😶', '🙂', '😊', '😄', '😆'] as const
export const conditions: { id: Condition; label: string; emoji: string }[] = [
  { id: 'join', label: '看起来可以加入', emoji: '👍' },
  { id: 'full', label: '场地已满', emoji: '👥' },
  { id: 'match', label: '正在比赛', emoji: '🏆' },
  { id: 'unknown', label: '不确定', emoji: '❔' },
]

export const statusOptions: { id: Status; label: string; subtitle: string; icon: string; color: string }[] = [
  { id: 'playing', label: '正在打球', subtitle: '我正在场上', icon: '🏃', color: 'green' },
  { id: 'going', label: '前往球场', subtitle: '正在路上', icon: '🚶', color: 'mint' },
  { id: 'maybe', label: '今晚可能打球', subtitle: '可能会去，待定', icon: '🌙', color: 'purple' },
  { id: 'looking', label: '想打球，缺球友', subtitle: '求队友一起打！', icon: '🙌', color: 'orange' },
  { id: 'resting', label: '今天不打球', subtitle: '今天先休息', icon: '🛋️', color: 'slate' },
  { id: 'hidden', label: '隐身', subtitle: '不向他人展示状态', icon: '🥷', color: 'slate' },
]

export function statusLabel(status: Status) { return statusOptions.find(s => s.id === status)!.label }
export function sportLabel(sport: Sport) { return sport === 'basketball' ? '篮球' : '足球' }
