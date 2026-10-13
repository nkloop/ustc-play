const { courts } = require('../../data')

Page({
  data: { name: '运动同学', initial: '运', favorites: [], statusLabel: '未设置', privacy: true },
  onShow() { this.refresh() },
  refresh() {
    const ids = wx.getStorageSync('court-query-favorites') || []
    const state = wx.getStorageSync('court-query-my-status')
    const statusLabels = { playing: '正在打球', going: '前往球场', maybe: '今晚可能打球', looking: '想打球，缺球友', resting: '今天不打球', hidden: '隐身' }
    const privacy = wx.getStorageSync('court-query-privacy') !== false
    const name = wx.getStorageSync('court-query-name') || '运动同学'
    this.setData({
      name, initial: name.slice(0, 1),
      favorites: courts.filter(c => ids.includes(c.id)),
      statusLabel: !privacy ? '隐身' : state && state.expiresAt > Date.now() ? statusLabels[state.status] : '未设置',
      privacy
    })
  },
  nameInput(e) { this.setData({ name: e.detail.value }) },
  saveName() {
    const name = this.data.name.trim().slice(0, 16)
    if (!name) { wx.showToast({ title: '请输入昵称', icon: 'none' }); return }
    wx.setStorageSync('court-query-name', name)
    this.setData({ name, initial: name.slice(0, 1) })
    wx.showToast({ title: '已保存到本机' })
  },
  togglePrivacy(e) {
    wx.setStorageSync('court-query-privacy', e.detail.value)
    this.refresh()
  },
  openDetail(e) { wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` }) }
})
