const { courts, heatLabels, heatColors } = require('../../data')

Page({
  data: { court: null, heatLabel: '', heatColor: '', emoji: '' },
  onLoad(options) {
    const court = courts.find(item => item.id === options.id)
    if (!court) { wx.showToast({ title: '未找到球场', icon: 'none' }); wx.navigateBack(); return }
    this.setData({ court, heatLabel: heatLabels[court.heat], heatColor: heatColors[court.heat], emoji: court.sport === 'basketball' ? '🏀' : '⚽' })
    wx.setNavigationBarTitle({ title: court.name })
  }
})
