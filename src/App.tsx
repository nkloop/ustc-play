import { useEffect, useState, type ReactNode } from 'react'
import { Activity, ArrowLeft, ArrowRight, Bell, Check, ChevronRight, Clock3, Compass, Home, Info, MapPin, Navigation, Search, Settings2, ShieldCheck, Star, Users, UserRound, X } from 'lucide-react'
import { conditions, courts, friends, heatEmoji, heatLabels, sportLabel, statusLabel, statusOptions, type Condition, type Court, type Heat, type Sport, type Status } from './data'

type Page = 'home' | 'discover' | 'status' | 'friends' | 'profile'
type SavedReport = { courtId: string; heat: Heat; condition?: Condition; at: number }
type SavedState = { sport: Sport; status: Status; courtId: string; expiresAt: number }
type Storage = { favorites: string[]; following: string[]; reports: SavedReport[]; state: SavedState; privacy: boolean; name: string }

const initial: Storage = {
  favorites: ['east-b', 'west-b', 'middle-b'],
  following: friends.filter(f => f.following).map(f => f.id),
  reports: [],
  state: { sport: 'basketball', status: 'playing', courtId: 'east-b', expiresAt: Date.now() + 90 * 60_000 },
  privacy: true,
  name: '小明同学',
}

function useLocalData() {
  const [data, setData] = useState<Storage>(() => {
    try {
      const saved = localStorage.getItem('ustc-play-v1')
      return saved ? { ...initial, ...JSON.parse(saved) as Partial<Storage> } : initial
    } catch { return initial }
  })
  useEffect(() => localStorage.setItem('ustc-play-v1', JSON.stringify(data)), [data])
  return [data, setData] as const
}

function CourtScene({ sport, variant = 'blue', large = false }: { sport: Sport; variant?: string; large?: boolean }) {
  const grass = variant === 'green' ? '#496f65' : variant === 'orange' ? '#487879' : '#456f78'
  const courtColor = sport === 'football' ? '#61a077' : '#cf765d'
  return <svg className={`court-scene ${large ? 'court-scene-large' : ''}`} viewBox="0 0 520 320" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${sportLabel(sport)}场地插画`}>
    <defs>
      <linearGradient id={`sky-${variant}-${sport}`} x2="0" y2="1"><stop stopColor="#bdd9e5"/><stop offset="1" stopColor="#f5e5c8"/></linearGradient>
      <linearGradient id={`floor-${variant}-${sport}`} x2="0" y2="1"><stop stopColor={grass}/><stop offset="1" stopColor="#2b555c"/></linearGradient>
      <filter id="blurTree"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <rect width="520" height="320" fill={`url(#sky-${variant}-${sport})`}/>
    <path d="M0 128Q100 100 202 128T520 112V215H0Z" fill="#7f9a7d" opacity=".55"/>
    <path d="M0 163Q112 130 208 158T520 146V235H0Z" fill="#315c52"/>
    <g fill="#294f47" opacity=".8"><circle cx="25" cy="131" r="67"/><circle cx="104" cy="122" r="53"/><circle cx="435" cy="126" r="69"/><circle cx="510" cy="100" r="82"/></g>
    <g fill="#608a62" opacity=".82" filter="url(#blurTree)"><circle cx="62" cy="105" r="60"/><circle cx="176" cy="119" r="39"/><circle cx="406" cy="107" r="58"/></g>
    <path d="M0 194L520 177V320H0Z" fill={`url(#floor-${variant}-${sport})`}/>
    <path d="M0 207L520 190" stroke="#cfdec9" strokeWidth="3" opacity=".65"/>
    {sport === 'basketball' ? <>
      <path d="M42 245L278 212L515 230L515 320H79Z" fill={courtColor}/><path d="M75 263L273 233L480 246M284 218L296 320M138 320Q163 248 278 253M420 320Q395 249 310 250" fill="none" stroke="#f4e2ca" strokeWidth="3" opacity=".85"/>
      <path d="M128 91V210M122 91H181V131H122Z" fill="none" stroke="#e6eee5" strokeWidth="5"/><path d="M150 133L151 142Q161 149 171 140V133" fill="none" stroke="#e7e0d2" strokeWidth="2"/><path d="M84 210L128 191" stroke="#d1dad4" strokeWidth="4"/>
      <path d="M414 121V210M409 121H449V151H409Z" fill="none" stroke="#e5eee5" strokeWidth="4"/><path d="M428 151V161" stroke="#e6ded4" strokeWidth="2"/>
    </> : <>
      <path d="M36 220L260 192L506 212L520 310L80 320Z" fill={courtColor}/><path d="M43 231L262 204L492 223L505 305L95 314ZM265 205L286 312M228 256A44 26 0 1 0 316 256A44 26 0 1 0 228 256M56 244L140 235L153 303L84 310M402 227L486 235L501 297L414 302" stroke="#dfeddc" strokeWidth="3" fill="none"/>
      <path d="M42 204V241L84 242V207M425 193V228L477 231V198" stroke="#f1f5eb" strokeWidth="4" fill="none"/>
    </>}
    <g fill="#173a41" opacity=".85"><path d="M34 143h3v68h-3zM219 148h3v61h-3zM362 138h3v67h-3zM493 125h3v87h-3z"/></g>
    <circle cx="352" cy="24" r="31" fill="#fff6dc" opacity=".32"/>
  </svg>
}

function SportSwitch({ value, onChange }: { value: Sport; onChange: (v: Sport) => void }) {
  return <div className="sport-switch" role="group" aria-label="运动类型">
    {(['basketball', 'football'] as Sport[]).map(s => <button key={s} className={value === s ? 'active' : ''} onClick={() => onChange(s)}><span className="sport-emoji">{s === 'basketball' ? '🏀' : '⚽'}</span>{sportLabel(s)}</button>)}
  </div>
}

function HeatBadge({ heat }: { heat: Heat }) { return <span className={`heat-badge heat-${heat}`}><span>{heat >= 3 ? '♨' : heat === 0 ? '○' : '●'}</span>{heatLabels[heat]}</span> }

function Metric({ icon, value, label, color }: { icon: ReactNode; value: number; label: string; color: string }) {
  return <div className="metric"><span className={`metric-icon ${color}`}>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>
}

function CourtCard({ court, favorite, report, onOpen, onFavorite }: { court: Court; favorite: boolean; report?: SavedReport; onOpen: () => void; onFavorite: () => void }) {
  const heat = report?.heat ?? court.heat
  return <article className="court-card" onClick={onOpen}>
    <div className="court-card-top">
      <div className="court-thumb"><CourtScene sport={court.sport} variant={court.color}/></div>
      <div className="court-card-info"><div className="card-title-row"><h3>{court.name}</h3><button className={`star-button ${favorite ? 'is-favorite' : ''}`} aria-label={favorite ? '取消收藏' : '收藏球场'} onClick={e => { e.stopPropagation(); onFavorite() }}><Star size={18} fill={favorite ? 'currentColor' : 'none'}/></button></div><HeatBadge heat={heat}/><p>{report ? '你刚刚上报了热度' : `${court.reports}人说${heatLabels[heat]}`} · {report ? '刚刚' : `${court.minutes}分钟前`}</p></div>
    </div>
    <div className="metric-row"><Metric icon={<Users size={17}/>} value={court.playing} label="正在打球" color="teal"/><Metric icon={<Navigation size={17}/>} value={court.going} label="准备前往" color="blue"/><Metric icon={<Activity size={17}/>} value={court.maybe} label="今晚可能" color="blue"/></div>
  </article>
}

function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const tabs: { page: Page; label: string; icon: ReactNode }[] = [
    { page: 'home', label: '首页', icon: <Home/> }, { page: 'discover', label: '发现', icon: <Compass/> }, { page: 'status', label: '我的状态', icon: <Activity/> }, { page: 'friends', label: '好友', icon: <Users/> }, { page: 'profile', label: '我的', icon: <UserRound/> },
  ]
  return <nav className="bottom-nav" aria-label="主要导航">{tabs.map(t => <button key={t.page} className={page === t.page ? 'selected' : ''} onClick={() => setPage(t.page)}>{t.icon}<span>{t.label}</span></button>)}</nav>
}

function App() {
  const [data, setData] = useLocalData()
  const [page, setPage] = useState<Page>('home')
  const [sport, setSport] = useState<Sport>('basketball')
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [heat, setHeat] = useState<Heat | null>(null)
  const [condition, setCondition] = useState<Condition | null>(null)
  const [status, setStatus] = useState<Status>(data.state.status)
  const [statusSport, setStatusSport] = useState<Sport>(data.state.sport)
  const [statusCourt, setStatusCourt] = useState(data.state.courtId)
  const [duration, setDuration] = useState('90')
  const [search, setSearch] = useState('')
  const [friendTab, setFriendTab] = useState<'all' | 'following' | 'followers'>('all')
  const [toast, setToast] = useState('')
  const [showAllHome, setShowAllHome] = useState(false)
  const [showNameEdit, setShowNameEdit] = useState(false)
  const [draftName, setDraftName] = useState(data.name)
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 30_000); return () => window.clearInterval(timer) }, [])
  const activeStatus = data.privacy && data.state.expiresAt > now ? data.state.status : 'hidden'
  const latestReport = (id: string) => [...data.reports].reverse().find(r => r.courtId === id)
  const tell = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  const go = (p: Page) => { setSelectedCourt(null); setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleFavorite = (id: string) => { setData(d => ({ ...d, favorites: d.favorites.includes(id) ? d.favorites.filter(x => x !== id) : [...d.favorites, id] })); tell(data.favorites.includes(id) ? '已取消收藏' : '已加入收藏') }
  const openCourt = (court: Court) => { setSelectedCourt(court); setHeat(null); setCondition(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const publishReport = () => {
    if (!selectedCourt || heat === null) { tell('请先选择球场热度'); return }
    setData(d => ({ ...d, reports: [...d.reports, { courtId: selectedCourt.id, heat, condition: condition ?? undefined, at: Date.now() }].slice(-30) }))
    tell('上报成功，已保存在此设备')
    setSelectedCourt(null)
  }
  const updateStatus = () => {
    const expiresAt = Date.now() + Number(duration) * 60_000
    setData(d => ({ ...d, state: { status, sport: statusSport, courtId: statusCourt, expiresAt } }))
    setNow(Date.now())
    tell('状态已更新，仅保存在此设备')
  }
  const currentCourt = courts.find(c => c.id === data.state.courtId)
  const visibleHomeCourts = courts.filter(c => c.sport === sport && (showAllHome || data.favorites.includes(c.id)))
  const visibleFriends = friends.filter(f => (friendTab === 'all' || (friendTab === 'following' ? data.following.includes(f.id) : ['akai', 'ming', 'kele', 'zihao'].includes(f.id))) && `${f.name} ${f.handle}`.toLowerCase().includes(search.trim().toLowerCase()))

  return <div className="app-shell">
    {selectedCourt ? <>
      <header className="detail-header"><button className="icon-button" onClick={() => setSelectedCourt(null)} aria-label="返回"><ArrowLeft/></button><strong>{selectedCourt.name}</strong><div><button className={`icon-button ${data.favorites.includes(selectedCourt.id) ? 'fav-icon' : ''}`} onClick={() => toggleFavorite(selectedCourt.id)} aria-label="切换收藏"><Star size={21} fill={data.favorites.includes(selectedCourt.id) ? 'currentColor' : 'none'}/></button></div></header>
      <main className="detail-main"><div className="hero-scene"><CourtScene sport={selectedCourt.sport} variant={selectedCourt.color} large/><span className="scene-count">场地示意图</span></div>
        <section className="detail-intro"><div className="detail-title-line"><div><p className="eyebrow">{sportLabel(selectedCourt.sport)} · 校园球场</p><h1>{selectedCourt.name}</h1></div><span className="distance-pill">步行约{selectedCourt.walk}分钟</span></div><p className="muted detail-location"><MapPin size={15}/>{selectedCourt.area}</p><p className="court-description">{selectedCourt.description}</p><div className="facility-tags">{selectedCourt.facilities.map(f => <span key={f}>{f}</span>)}</div></section>
        <section className="detail-live"><div className="section-title"><div><span className="live-dot"/>实时热度 <small>模拟数据</small></div><HeatBadge heat={latestReport(selectedCourt.id)?.heat ?? selectedCourt.heat}/></div><p className="muted">{latestReport(selectedCourt.id) ? '你刚刚在此设备上报' : `${selectedCourt.reports} 人最近 ${selectedCourt.minutes} 分钟上报`}</p><div className="detail-metrics"><Metric icon={<Users size={18}/>} value={selectedCourt.playing} label="正在打球" color="teal"/><Metric icon={<Navigation size={18}/>} value={selectedCourt.going} label="准备前往" color="blue"/><Metric icon={<Clock3 size={18}/>} value={selectedCourt.maybe} label="今晚可能" color="blue"/></div></section>
        <section className="report-area"><h2>快捷上报当前情况</h2><p className="muted">让同学们知道这里的实时情况</p><div className="heat-choices">{heatLabels.map((label, i) => <button key={label} className={`heat-choice heat-choice-${i} ${heat === i ? 'chosen' : ''}`} onClick={() => setHeat(i as Heat)}><span>{heatEmoji[i]}</span><strong>{label}</strong></button>)}</div><h3>补充说明 <small>可选</small></h3><div className="condition-choices">{conditions.map(c => <button key={c.id} className={condition === c.id ? 'chosen' : ''} onClick={() => setCondition(condition === c.id ? null : c.id)}><span>{c.emoji}</span>{c.label}</button>)}</div><button className="primary-button" onClick={publishReport}>发布上报 <ArrowRight size={18}/></button><p className="privacy-note">上报只会保存在当前浏览器中</p></section>
      </main>
    </> : <>
      {page === 'home' && <main className="page home-page"><header className="home-header"><div><div className="brand">U-<em>Play</em></div><p>球场相见，一起运动 <span>✨</span></p></div><button className="round-tool" onClick={() => tell('这是单设备演示版，暂无通知')} aria-label="通知"><Bell size={21}/></button></header><SportSwitch value={sport} onChange={s => { setSport(s); setShowAllHome(false) }}/><section className="home-section"><div className="section-title"><div><h2>我的球场</h2><p>关注的球场实时动态</p></div><button className="text-link" onClick={() => setShowAllHome(!showAllHome)}>{showAllHome ? '只看收藏' : '查看全部'}<ChevronRight size={17}/></button></div><div className="court-list">{visibleHomeCourts.length ? visibleHomeCourts.map(c => <CourtCard key={c.id} court={c} favorite={data.favorites.includes(c.id)} report={latestReport(c.id)} onOpen={() => openCourt(c)} onFavorite={() => toggleFavorite(c.id)}/>) : <div className="empty-card"><Star size={25}/><strong>还没有收藏的{sportLabel(sport)}场</strong><button onClick={() => setShowAllHome(true)}>浏览全部球场</button></div>}</div></section><div className="home-footnote"><Info size={14}/> 独立制作，非学校官方服务；热度与人数为模拟数据</div></main>}
      {page === 'discover' && <main className="page discover-page"><header className="page-header"><p className="eyebrow">EXPLORE CAMPUS</p><h1>发现球场</h1><p>选个场地，开启今天的运动时刻。</p></header><SportSwitch value={sport} onChange={setSport}/><div className="discover-spotlight"><div className="spotlight-copy"><span>今日推荐</span><h2>{sport === 'basketball' ? '去东区，打一场好球' : '去东区，踢一场好球'}</h2><p>看看球场现在有多热闹</p><button onClick={() => openCourt(courts.find(c => c.id === (sport === 'basketball' ? 'east-b' : 'east-f'))!)}>查看场地 <ArrowRight size={16}/></button></div><div className="spotlight-ball">{sport === 'basketball' ? '🏀' : '⚽'}</div></div><div className="section-title discover-title"><div><h2>全部{sportLabel(sport)}场</h2><p>校园球场一览</p></div><span className="court-count">{courts.filter(c => c.sport === sport).length} 个场地</span></div><div className="court-list">{courts.filter(c => c.sport === sport).map(c => <CourtCard key={c.id} court={c} favorite={data.favorites.includes(c.id)} report={latestReport(c.id)} onOpen={() => openCourt(c)} onFavorite={() => toggleFavorite(c.id)}/>)}</div></main>}
      {page === 'status' && <main className="page status-page"><div className="profile-strip"><div className="avatar self-avatar">明</div><div><strong>{data.name}</strong><p>热爱运动的球友</p></div><ChevronRight size={20}/></div><div className="status-heading"><div><h1>我的运动状态</h1><p>让朋友知道你今天的运动计划</p></div><span className="hint-badge"><Clock3 size={13}/> 到期自动过期</span></div><div className="status-grid">{statusOptions.map(option => <button className={`status-option ${option.color} ${status === option.id ? 'chosen' : ''}`} key={option.id} onClick={() => setStatus(option.id)}><span className="option-emoji">{option.icon}</span><strong>{option.label}</strong><small>{option.subtitle}</small>{status === option.id && <span className="option-check"><Check size={13}/></span>}</button>)}</div><div className="field-group"><h2>选择运动类型</h2><SportSwitch value={statusSport} onChange={s => { setStatusSport(s); setStatusCourt(courts.find(c => c.sport === s)!.id) }}/></div><div className="field-group"><h2>选择想去的球场 <small>可选</small></h2><div className="select-wrap"><MapPin size={19}/><select value={statusCourt} onChange={e => setStatusCourt(e.target.value)} aria-label="选择球场"><option value="">暂不选择球场</option>{courts.filter(c => c.sport === statusSport).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><ChevronRight size={18}/></div></div><div className="field-group"><h2>状态有效期</h2><div className="duration-row">{[['30', '30分钟'], ['90', '90分钟'], ['240', '4小时'], ['720', '今晚']].map(([value, label]) => <button key={value} className={duration === value ? 'selected' : ''} onClick={() => setDuration(value)}>{label}</button>)}</div></div><button className="primary-button green-button" onClick={updateStatus}>更新我的状态 <ArrowRight size={18}/></button><p className="privacy-note"><ShieldCheck size={14}/> 仅在这台设备上演示状态更新</p></main>}
      {page === 'friends' && <main className="page friends-page"><header className="friends-header"><div><p className="eyebrow">YOUR CREW</p><h1>好友</h1></div><button className="round-tool" onClick={() => { setFriendTab('all'); document.getElementById('friend-search')?.focus() }} aria-label="搜索好友"><Users size={21}/></button></header><label className="search-field"><Search size={19}/><input id="friend-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索学号 / ID / 昵称"/><span>{search && <button onClick={() => setSearch('')} aria-label="清空搜索"><X size={16}/></button>}</span></label><div className="friend-tabs">{([['all', '全部'], ['following', '我关注的'], ['followers', '关注我']] as const).map(([id, label]) => <button key={id} className={friendTab === id ? 'active' : ''} onClick={() => setFriendTab(id)}>{label}</button>)}</div><div className="friend-list">{visibleFriends.map(friend => <div className="friend-row" key={friend.id}><div className={`avatar avatar-${friend.avatarColor}`}>{friend.avatar}</div><div className="friend-info"><strong>{friend.name}</strong><div className="friend-status"><span>{statusOptions.find(s => s.id === friend.status)?.icon}</span><div><span>{friend.status === 'hidden' ? '隐身' : statusLabel(friend.status)}{friend.court && <span> · {friend.court}</span>}</span><small>{friend.time}</small></div></div></div><button className={`follow-button ${data.following.includes(friend.id) ? 'following' : ''}`} onClick={() => { setData(d => ({ ...d, following: d.following.includes(friend.id) ? d.following.filter(x => x !== friend.id) : [...d.following, friend.id] })); tell(data.following.includes(friend.id) ? '已取消关注' : '已关注') }}>{data.following.includes(friend.id) ? '已关注' : '+ 关注'}</button></div>)}{!visibleFriends.length && <div className="empty-card"><Search size={25}/><strong>没有找到符合条件的同学</strong><span>试试其他昵称或切换列表</span></div>}</div><div className="privacy-banner"><ShieldCheck size={22}/><div><strong>我们尊重每位同学的隐私</strong><p>好友状态为模拟演示数据；隐身状态不会展示运动计划。</p></div></div></main>}
      {page === 'profile' && <main className="page profile-page"><header className="page-header"><p className="eyebrow">MY SPACE</p><h1>我的</h1></header><div className="my-hero"><div className="avatar self-avatar">明</div><div><h2>{data.name}</h2><p>热爱运动的球友</p></div><button onClick={() => { setDraftName(data.name); setShowNameEdit(true) }} aria-label="编辑昵称"><Settings2 size={19}/></button></div><div className="current-state-card"><div><span className="mini-label">当前运动状态</span><strong>{statusOptions.find(s => s.id === activeStatus)?.icon} {statusLabel(activeStatus)}</strong><p>{activeStatus === 'hidden' ? '状态已隐身或过期' : `${sportLabel(data.state.sport)} · ${currentCourt?.name ?? '未选择球场'}`}</p></div><button onClick={() => go('status')}>编辑 <ArrowRight size={15}/></button></div><section className="profile-section"><div className="section-title"><div><h2>收藏球场</h2><p>你关注的运动场地</p></div><span className="court-count">{data.favorites.length} 个</span></div><div className="profile-list">{data.favorites.length ? data.favorites.map(id => courts.find(c => c.id === id)).filter((c): c is Court => !!c).map(c => <button key={c.id} onClick={() => openCourt(c)}><span className="profile-list-icon">{c.sport === 'basketball' ? '🏀' : '⚽'}</span><span><strong>{c.name}</strong><small>{c.area}</small></span><ChevronRight size={18}/></button>) : <div className="no-favorites">还没有收藏球场，去发现页看看吧。</div>}</div></section><section className="profile-section settings-section"><div className="section-title"><div><h2>隐私设置</h2><p>控制谁可以看到你的运动计划</p></div></div><div className="privacy-setting"><div className="profile-list-icon shield"><ShieldCheck size={20}/></div><div><strong>向好友展示运动状态</strong><small>关闭后，演示界面中将视为隐身</small></div><button role="switch" aria-checked={data.privacy} className={`toggle ${data.privacy ? 'on' : ''}`} onClick={() => { setData(d => ({ ...d, privacy: !d.privacy })); tell(data.privacy ? '已关闭状态展示' : '已开启状态展示') }}><span/></button></div></section><div className="prototype-note"><Info size={17}/><p><strong>关于这个原型</strong><br/>数据仅保存在当前浏览器。好友和球场人数都是模拟展示，不会在不同用户之间同步。</p></div></main>}
      <Nav page={page} setPage={go}/>
    </>}
    {toast && <div className="toast" role="status"><Check size={16}/>{toast}</div>}
    {showNameEdit && <div className="modal-backdrop" onClick={() => setShowNameEdit(false)}><div className="name-modal" onClick={e => e.stopPropagation()}><div className="modal-head"><h2>编辑昵称</h2><button onClick={() => setShowNameEdit(false)} aria-label="关闭"><X size={21}/></button></div><input value={draftName} maxLength={16} onChange={e => setDraftName(e.target.value)} placeholder="输入昵称"/><button className="primary-button" onClick={() => { if (!draftName.trim()) { tell('请输入昵称'); return } setData(d => ({ ...d, name: draftName.trim() })); setShowNameEdit(false); tell('昵称已保存') }}>保存昵称</button></div></div>}
  </div>
}

export default App
