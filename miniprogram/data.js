// 仅供界面体验的内置数据；不得作为球场当前情况发布。
const courts = [
  { id: 'east-b', name: '东区篮球场', sport: 'basketball', area: '东区', walk: '体育馆附近', heat: 4, reports: 3, minutes: 5, playing: 12, going: 8, color: 'orange', description: '室外篮球场地。下方热度和人数均为演示数据，请以现场情况为准。', facilities: ['室外场地', '体育馆附近'] },
  { id: 'west-b', name: '西区篮球场', sport: 'basketball', area: '西区', walk: '学生活动中心附近', heat: 2, reports: 2, minutes: 8, playing: 6, going: 4, color: 'blue', description: '室外篮球场地。下方热度和人数均为演示数据，请以现场情况为准。', facilities: ['室外场地', '学生活动中心附近'] },
  { id: 'middle-b', name: '中区篮球场', sport: 'basketball', area: '中区', walk: '教学区附近', heat: 1, reports: 1, minutes: 12, playing: 2, going: 3, color: 'green', description: '室外篮球场地。下方热度和人数均为演示数据，请以现场情况为准。', facilities: ['室外场地', '教学区附近'] },
  { id: 'east-f', name: '东区足球场', sport: 'football', area: '东区', walk: '田径场附近', heat: 3, reports: 4, minutes: 6, playing: 18, going: 7, color: 'green', description: '足球运动场地。下方热度和人数均为演示数据，请以现场情况为准。', facilities: ['室外场地', '田径场附近'] },
  { id: 'west-f', name: '西区足球场', sport: 'football', area: '西区', walk: '体育中心附近', heat: 2, reports: 2, minutes: 9, playing: 10, going: 5, color: 'blue', description: '足球运动场地。下方热度和人数均为演示数据，请以现场情况为准。', facilities: ['室外场地', '体育中心附近'] },
  { id: 'north-f', name: '北区足球场', sport: 'football', area: '北区', walk: '宿舍区附近', heat: 0, reports: 1, minutes: 16, playing: 0, going: 2, color: 'orange', description: '足球运动场地。下方热度和人数均为演示数据，请以现场情况为准。', facilities: ['室外场地', '宿舍区附近'] }
]
const heatLabels = ['空场', '较冷清', '一般', '较热闹', '很热闹']
const heatColors = ['#8c9ab0', '#2ca877', '#e5a42d', '#f2873d', '#f25843']
module.exports = { courts, heatLabels, heatColors }
