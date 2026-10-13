const { courts } = require('../../data')

const options = [
  { id: 'playing', label: '正在打球', emoji: '🏃' },
  { id: 'going', label: '前往球场', emoji: '🚶' },
  { id: 'maybe', label: '今晚可能打球', emoji: '🌙' },
  { id: 'looking', label: '想打球，缺球友', emoji: '🙌' },
  { id: 'resting', label: '今天不打球', emoji: '🛋️' },
  { id: 'hidden', label: '隐身', emoji: '◌' }
]
const durations = [
  { value: 30, label: '30分钟' }, { value: 90, label: '90分钟' },
  { value: 240, label: '4小时' }, { value: 720, label: '今晚' }
]

Page({
  data: { options, durations, status: 'playing', sport: 'basketball', courtId: 'east-b', duration: 90, sportCourts: [] },
  onShow() {
    const saved = wx.getStorageSync('court-query-my-status')
    if (saved && saved.expiresAt > Date.now()) {
      this.setData({ status: saved.status, sport: saved.sport, courtId: saved.courtId, duration: saved.duration })
    }
    this.updateCourts()
  },
  updateCourts() { this.setData({ sportCourts: courts.filter(c => c.sport === this.data.sport) }) },
  chooseStatus(e) { this.setData({ status: e.currentTarget.dataset.id }) },
  chooseSport(e) {
    const sport = e.currentTarget.dataset.sport
    this.setData({ sport, courtId: courts.find(c => c.sport === sport).id }, () => this.updateCourts())
  },
  chooseCourt(e) { this.setData({ courtId: e.currentTarget.dataset.id }) },
  chooseDuration(e) { this.setData({ duration: Number(e.currentTarget.dataset.value) }) },
  save() {
    const { status, sport, courtId, duration } = this.data
    wx.setStorageSync('court-query-my-status', { status, sport, courtId, duration, expiresAt: Date.now() + duration * 60000 })
    wx.showToast({ title: '仅保存到本机', icon: 'success' })
  }
})
