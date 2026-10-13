const { courts, heatLabels, heatColors } = require('../../data')

Page({
  data: { sport: 'basketball', filtered: [], favorites: [], demo: true },
  onLoad() { this.refresh() },
  onShow() { this.refresh() },
  refresh() {
    const favorites = wx.getStorageSync('court-query-favorites') || []
    const filtered = courts.filter(c => c.sport === this.data.sport).map(c => ({
      ...c,
      emoji: c.sport === 'basketball' ? '🏀' : '⚽',
      heatLabel: heatLabels[c.heat],
      heatColor: heatColors[c.heat],
      favorite: favorites.includes(c.id)
    }))
    this.setData({ filtered, favorites })
  },
  chooseSport(e) { this.setData({ sport: e.currentTarget.dataset.sport }, () => this.refresh()) },
  openDetail(e) { wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` }) },
  toggleFavorite(e) {
    const id = e.currentTarget.dataset.id
    const favorites = this.data.favorites.includes(id)
      ? this.data.favorites.filter(item => item !== id)
      : [...this.data.favorites, id]
    wx.setStorageSync('court-query-favorites', favorites)
    this.refresh()
  }
})
