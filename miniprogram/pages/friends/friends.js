const mockFriends = [
  { id: 'akai', name: '阿凯', avatar: '凯', status: '前往球场', court: '东区篮球场', emoji: '🚶' },
  { id: 'ming', name: 'Ming', avatar: 'M', status: '今晚可能打球', court: '篮球', emoji: '🌙' },
  { id: 'yusuf', name: 'Yusuf', avatar: 'Y', status: '正在打球', court: '东区足球场', emoji: '🏃' },
  { id: 'kele', name: '可乐', avatar: '乐', status: '想打球，缺球友', court: '西区篮球场', emoji: '🙌' },
  { id: 'lily', name: 'Lily', avatar: 'L', status: '今天不打球', court: '篮球', emoji: '🛋️' }
]

Page({
  data: { friends: [], search: '', tab: 'all', following: [] },
  onShow() {
    const following = wx.getStorageSync('court-query-following') || ['akai', 'ming', 'yusuf']
    this.setData({ following }, () => this.refresh())
  },
  refresh() {
    const { following, search, tab } = this.data
    const term = search.trim().toLowerCase()
    this.setData({ friends: mockFriends.filter(f =>
      (tab === 'all' || following.includes(f.id)) && f.name.toLowerCase().includes(term)
    ).map(f => ({ ...f, followed: following.includes(f.id) })) })
  },
  searchInput(e) { this.setData({ search: e.detail.value }, () => this.refresh()) },
  chooseTab(e) { this.setData({ tab: e.currentTarget.dataset.tab }, () => this.refresh()) },
  toggleFollow(e) {
    const id = e.currentTarget.dataset.id
    const following = this.data.following.includes(id)
      ? this.data.following.filter(x => x !== id) : [...this.data.following, id]
    wx.setStorageSync('court-query-following', following)
    this.setData({ following }, () => this.refresh())
  }
})
