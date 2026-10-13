const routes = {
  home: '/pages/index/index',
  discover: '/pages/discover/discover',
  status: '/pages/status/status',
  friends: '/pages/friends/friends',
  profile: '/pages/profile/profile'
}

Component({
  properties: { active: { type: String, value: 'home' } },
  methods: {
    go(e) {
      const tab = e.currentTarget.dataset.tab
      if (tab !== this.properties.active && routes[tab]) wx.reLaunch({ url: routes[tab] })
    }
  }
})
