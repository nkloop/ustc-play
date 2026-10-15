import { useEffect, useState, type ReactNode } from 'react'
import { Activity, ArrowLeft, ArrowRight, Bell, Check, ChevronRight, Clock3, Compass, Home, Info, MapPin, Navigation, Settings2, ShieldCheck, Star, Users, UserRound } from 'lucide-react'
import { conditions, courts, heatEmoji, heatLabels, sportLabel, statusLabel, statusOptions, type Condition, type Court, type Heat, type Sport, type Status } from './data'
import { cloudConfigured, getCurrentUser, readSharedData, requestEmailCode, saveSharedReport, saveSharedStatus, signOut, verifyEmailCode, type CloudUser, type SharedReport, type SharedStatus } from './cloudbase'

type Page = 'home' | 'discover' | 'status' | 'friends' | 'profile'
type Storage = { favorites: string[] }

const initial: Storage = {
  favorites: [],
}

function useLocalData() {
  const [data, setData] = useState<Storage>(() => {
    try {
      const saved = localStorage.getItem('ustc-play-v1')
      const local = saved ? JSON.parse(saved) as Partial<Storage> : null
      return { ...initial, favorites: Array.isArray(local?.favorites) ? local.favorites : [] }
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

function HeatBadge({ heat, empty = false }: { heat: Heat; empty?: boolean }) { return <span className={`heat-badge heat-${heat}`}><span>{empty ? '○' : heat >= 3 ? '♨' : heat === 0 ? '○' : '●'}</span>{empty ? '暂无数据' : heatLabels[heat]}</span> }

function Metric({ icon, value, label, color }: { icon: ReactNode; value: number; label: string; color: string }) {
  return <div className="metric"><span className={`metric-icon ${color}`}>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>
}

function CourtCard({ court, favorite, report, onOpen, onFavorite }: { court: Court; favorite: boolean; report?: SharedReport; onOpen: () => void; onFavorite: () => void }) {
  const heat = court.heat
  return <article className="court-card" onClick={onOpen}>
    <div className="court-card-top">
      <div className="court-thumb"><CourtScene sport={court.sport} variant={court.color}/></div>
      <div className="court-card-info"><div className="card-title-row"><h3>{court.name}</h3><button className={`star-button ${favorite ? 'is-favorite' : ''}`} aria-label={favorite ? '取消收藏' : '收藏球场'} onClick={e => { e.stopPropagation(); onFavorite() }}><Star size={18} fill={favorite ? 'currentColor' : 'none'}/></button></div><HeatBadge heat={heat} empty={court.reports === 0}/><p>{report ? '最近有人上报' : court.reports ? `${court.reports} 人近 2 小时上报` : '暂无同学上报'}</p></div>
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
  const [status, setStatus] = useState<Status>('hidden')
  const [statusSport, setStatusSport] = useState<Sport>('basketball')
  const [statusCourt, setStatusCourt] = useState('east-b')
  const [duration, setDuration] = useState('90')
  const [toast, setToast] = useState('')
  const [showAllHome, setShowAllHome] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [user, setUser] = useState<CloudUser | null>(null)
  const [sharedStatuses, setSharedStatuses] = useState<SharedStatus[]>([])
  const [sharedReports, setSharedReports] = useState<SharedReport[]>([])
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [verificationInfo, setVerificationInfo] = useState<{ verification_id: string; is_user: boolean } | null>(null)
  const [authBusy, setAuthBusy] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 30_000); return () => window.clearInterval(timer) }, [])
  const myStatus = sharedStatuses.find(s => s.uid === user?.uid)
  useEffect(() => { setStatus(myStatus?.status ?? 'hidden'); setStatusSport(myStatus?.sport ?? 'basketball'); setStatusCourt(myStatus?.courtId ?? 'east-b') }, [myStatus?.uid, myStatus?.updatedAt])
  const activeStatus = myStatus && myStatus.expiresAt > now ? myStatus.status : 'hidden'
  const latestReport = (id: string) => sharedReports.filter(r => r.courtId === id).sort((a, b) => b.at - a.at)[0]
  const refreshShared = async () => {
    if (!cloudConfigured) return
    try {
      const [current, shared] = await Promise.all([getCurrentUser(), readSharedData()])
      setUser(current); setSharedStatuses(shared.statuses); setSharedReports(shared.reports)
    } catch (error) { console.error(error); tell('共享数据暂时无法读取，请检查 CloudBase 配置') }
  }
  useEffect(() => { void refreshShared(); const timer = window.setInterval(() => { void refreshShared() }, 30_000); return () => window.clearInterval(timer) }, [])
  const tell = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  const go = (p: Page) => { setSelectedCourt(null); setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleFavorite = (id: string) => { setData(d => ({ ...d, favorites: d.favorites.includes(id) ? d.favorites.filter(x => x !== id) : [...d.favorites, id] })); tell(data.favorites.includes(id) ? '已取消收藏' : '已加入收藏') }
  const openCourt = (court: Court) => { setSelectedCourt(court); setHeat(null); setCondition(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const publishReport = () => {
    if (!selectedCourt || heat === null) { tell('请先选择球场热度'); return }
    if (!user) { tell('请先用邮箱验证码登录'); return }
    void saveSharedReport(user, { courtId: selectedCourt.id, heat, condition: condition ?? undefined, at: Date.now() }).then(() => { tell('上报成功，已同步给大家'); setSelectedCourt(null); void refreshShared() }).catch(e => tell(e instanceof Error ? e.message : '上报失败'))
  }
  const updateStatus = () => {
    if (!user) { tell('请先用邮箱验证码登录'); return }
    const expiresAt = Date.now() + Number(duration) * 60_000
    void saveSharedStatus(user, { name: 'USTC 球友', status, sport: statusSport, courtId: statusCourt, expiresAt }).then(() => { tell('状态已同步给大家'); void refreshShared() }).catch(e => tell(e instanceof Error ? e.message : '更新失败'))
    setNow(Date.now())
  }
  const currentCourt = courts.find(c => c.id === myStatus?.courtId)
  const statsFor = (court: Court) => {
    const live = sharedStatuses.filter(s => s.courtId === court.id && s.expiresAt > now)
    const reports = sharedReports.filter(r => r.courtId === court.id)
    const heat = reports.length ? Math.round(reports.reduce((sum, r) => sum + r.heat, 0) / reports.length) as Heat : 0
    return { heat, reports: reports.length, playing: live.filter(s => s.status === 'playing').length, going: live.filter(s => s.status === 'going').length, maybe: live.filter(s => s.status === 'maybe' || s.status === 'looking').length }
  }
  const visibleHomeCourts = courts.filter(c => c.sport === sport && (showAllHome || data.favorites.length === 0 || data.favorites.includes(c.id)))
  const sendCode = async () => { if (!email.trim()) { tell('请输入邮箱'); return }; setSendingCode(true); try { const result = await requestEmailCode(email.trim()); if (!result.verification_id) throw new Error('没有获取到验证码会话，请稍后重试'); setVerificationInfo({ verification_id: result.verification_id, is_user: Boolean(result.is_user) }); tell('验证码已发送，请查收邮箱') } catch (e) { tell(e instanceof Error ? e.message : '验证码发送失败') } finally { setSendingCode(false) } }
  const login = async () => { if (!verificationInfo || !code.trim()) { tell('请先获取验证码并输入'); return }; setAuthBusy(true); try { const current = await verifyEmailCode(email.trim(), code.trim(), verificationInfo); setUser(current); setCode(''); tell('登录成功'); void refreshShared() } catch (e) { tell(e instanceof Error ? e.message : '登录失败') } finally { setAuthBusy(false) } }

  return <div className="app-shell">
    {selectedCourt ? <>
      <header className="detail-header"><button className="icon-button" onClick={() => setSelectedCourt(null)} aria-label="返回"><ArrowLeft/></button><strong>{selectedCourt.name}</strong><div><button className={`icon-button ${data.favorites.includes(selectedCourt.id) ? 'fav-icon' : ''}`} onClick={() => toggleFavorite(selectedCourt.id)} aria-label="切换收藏"><Star size={21} fill={data.favorites.includes(selectedCourt.id) ? 'currentColor' : 'none'}/></button></div></header>
      <main className="detail-main"><div className="hero-scene"><CourtScene sport={selectedCourt.sport} variant={selectedCourt.color} large/><span className="scene-count">场地示意图</span></div>
        <section className="detail-intro"><div className="detail-title-line"><div><p className="eyebrow">{sportLabel(selectedCourt.sport)} · 校园球场</p><h1>{selectedCourt.name}</h1></div><span className="distance-pill">步行约{selectedCourt.walk}分钟</span></div><p className="muted detail-location"><MapPin size={15}/>{selectedCourt.area}</p><p className="court-description">{selectedCourt.description}</p><div className="facility-tags">{selectedCourt.facilities.map(f => <span key={f}>{f}</span>)}</div></section>
        <section className="detail-live"><div className="section-title"><div><span className="live-dot"/>实时热度 <small>近 2 小时</small></div><HeatBadge heat={statsFor(selectedCourt).heat} empty={statsFor(selectedCourt).reports === 0}/></div><p className="muted">{statsFor(selectedCourt).reports} 条同学上报</p><div className="detail-metrics"><Metric icon={<Users size={18}/>} value={statsFor(selectedCourt).playing} label="正在打球" color="teal"/><Metric icon={<Navigation size={18}/>} value={statsFor(selectedCourt).going} label="准备前往" color="blue"/><Metric icon={<Clock3 size={18}/>} value={statsFor(selectedCourt).maybe} label="今晚可能" color="blue"/></div></section>
        <section className="report-area"><h2>快捷上报当前情况</h2><p className="muted">让同学们知道这里的实时情况</p><div className="heat-choices">{heatLabels.map((label, i) => <button key={label} className={`heat-choice heat-choice-${i} ${heat === i ? 'chosen' : ''}`} onClick={() => setHeat(i as Heat)}><span>{heatEmoji[i]}</span><strong>{label}</strong></button>)}</div><h3>补充说明 <small>可选</small></h3><div className="condition-choices">{conditions.map(c => <button key={c.id} className={condition === c.id ? 'chosen' : ''} onClick={() => setCondition(condition === c.id ? null : c.id)}><span>{c.emoji}</span>{c.label}</button>)}</div><button className="primary-button" onClick={publishReport}>发布上报 <ArrowRight size={18}/></button><p className="privacy-note">登录后发布；每个账号每个球场保留一条上报</p></section>
      </main>
    </> : <>
      {page === 'home' && <main className="page home-page"><header className="home-header"><div><div className="brand">U-<em>Play</em></div><p>球场相见，一起运动 <span>✨</span></p></div><button className="round-tool" onClick={() => tell(user ? '通知功能稍后开放' : '登录后可以发布自己的状态')} aria-label="通知"><Bell size={21}/></button></header><SportSwitch value={sport} onChange={s => { setSport(s); setShowAllHome(false) }}/><section className="home-section"><div className="section-title"><div><h2>球场动态</h2><p>大家最近的运动状态</p></div><button className="text-link" onClick={() => setShowAllHome(!showAllHome)}>{showAllHome ? '只看收藏' : '查看全部'}<ChevronRight size={17}/></button></div><div className="court-list">{visibleHomeCourts.length ? visibleHomeCourts.map(c => <CourtCard key={c.id} court={{...c,...statsFor(c)}} favorite={data.favorites.includes(c.id)} report={latestReport(c.id)} onOpen={() => openCourt(c)} onFavorite={() => toggleFavorite(c.id)}/>) : <div className="empty-card"><Star size={25}/><strong>还没有收藏的{sportLabel(sport)}场</strong><button onClick={() => setShowAllHome(true)}>浏览全部球场</button></div>}</div></section><div className="home-footnote"><Info size={14}/> 独立制作，非学校官方服务；所有人数按已登录账号的有效状态计算</div></main>}
      {page === 'discover' && <main className="page discover-page"><header className="page-header"><p className="eyebrow">EXPLORE CAMPUS</p><h1>发现球场</h1><p>选个场地，开启今天的运动时刻。</p></header><SportSwitch value={sport} onChange={setSport}/><div className="discover-spotlight"><div className="spotlight-copy"><span>今日推荐</span><h2>{sport === 'basketball' ? '去东区，打一场好球' : '去东区，踢一场好球'}</h2><p>看看球场现在有多热闹</p><button onClick={() => openCourt(courts.find(c => c.id === (sport === 'basketball' ? 'east-b' : 'east-f'))!)}>查看场地 <ArrowRight size={16}/></button></div><div className="spotlight-ball">{sport === 'basketball' ? '🏀' : '⚽'}</div></div><div className="section-title discover-title"><div><h2>全部{sportLabel(sport)}场</h2><p>校园球场一览</p></div><span className="court-count">{courts.filter(c => c.sport === sport).length} 个场地</span></div><div className="court-list">{courts.filter(c => c.sport === sport).map(c => <CourtCard key={c.id} court={{...c,...statsFor(c)}} favorite={data.favorites.includes(c.id)} report={latestReport(c.id)} onOpen={() => openCourt(c)} onFavorite={() => toggleFavorite(c.id)}/>)}</div></main>}
      {page === 'status' && <main className="page status-page"><div className="profile-strip"><div className="avatar self-avatar">{user?.email?.[0]?.toUpperCase() ?? '?'}</div><div><strong>{user?.email ?? '尚未登录'}</strong><p>{user ? '邮箱已验证' : '登录后管理自己的运动状态'}</p></div><ChevronRight size={20}/></div><div className="status-heading"><div><h1>我的运动状态</h1><p>让朋友知道你今天的运动计划</p></div><span className="hint-badge"><Clock3 size={13}/> 到期自动过期</span></div><div className="status-grid">{statusOptions.map(option => <button className={`status-option ${option.color} ${status === option.id ? 'chosen' : ''}`} key={option.id} onClick={() => setStatus(option.id)}><span className="option-emoji">{option.icon}</span><strong>{option.label}</strong><small>{option.subtitle}</small>{status === option.id && <span className="option-check"><Check size={13}/></span>}</button>)}</div><div className="field-group"><h2>选择运动类型</h2><SportSwitch value={statusSport} onChange={s => { setStatusSport(s); setStatusCourt(courts.find(c => c.sport === s)!.id) }}/></div><div className="field-group"><h2>选择想去的球场 <small>可选</small></h2><div className="select-wrap"><MapPin size={19}/><select value={statusCourt} onChange={e => setStatusCourt(e.target.value)} aria-label="选择球场"><option value="">暂不选择球场</option>{courts.filter(c => c.sport === statusSport).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><ChevronRight size={18}/></div></div><div className="field-group"><h2>状态有效期</h2><div className="duration-row">{[['30', '30分钟'], ['90', '90分钟'], ['240', '4小时'], ['720', '今晚']].map(([value, label]) => <button key={value} className={duration === value ? 'selected' : ''} onClick={() => setDuration(value)}>{label}</button>)}</div></div><button className="primary-button green-button" onClick={updateStatus}>更新我的状态 <ArrowRight size={18}/></button><p className="privacy-note"><ShieldCheck size={14}/> {user ? '有效状态会与所有访问者共享，过期后自动移除' : '需要邮箱验证码登录才能保存状态'}</p></main>}
      {page === 'friends' && <main className="page friends-page"><header className="friends-header"><div><p className="eyebrow">YOUR CREW</p><h1>好友</h1></div><button className="round-tool" onClick={() => tell('好友关系功能后续加入')} aria-label="好友说明"><Users size={21}/></button></header><div className="empty-card"><Users size={25}/><strong>好友功能还没有开放</strong><span>目前球场数据和运动状态对所有访问者共享。</span></div><div className="privacy-banner"><ShieldCheck size={22}/><div><strong>状态由你自己控制</strong><p>状态会在设定时间后自动过期，也可以随时更新。</p></div></div></main>}
      {page === 'profile' && <main className="page profile-page"><header className="page-header"><p className="eyebrow">MY SPACE</p><h1>我的</h1></header><div className="my-hero"><div className="avatar self-avatar">{user?.email?.[0]?.toUpperCase() ?? '?'}</div><div><h2>{user?.email ?? '未登录'}</h2><p>{user ? '已通过邮箱验证码验证' : '登录后管理个人资料'}</p></div>{user && <button onClick={() => { void signOut().then(() => { setUser(null); tell('已退出登录') }) }} aria-label="退出登录"><Settings2 size={19}/></button>}</div><div className="current-state-card"><div><span className="mini-label">当前运动状态</span><strong>{statusOptions.find(s => s.id === activeStatus)?.icon} {statusLabel(activeStatus)}</strong><p>{activeStatus === 'hidden' ? '尚未发布有效状态' : `${sportLabel(myStatus!.sport)} · ${currentCourt?.name ?? '未选择球场'}`}</p></div><button onClick={() => go('status')}>编辑 <ArrowRight size={15}/></button></div><section className="profile-section"><div className="section-title"><div><h2>收藏球场</h2><p>只保存在当前浏览器</p></div><span className="court-count">{data.favorites.length} 个</span></div><div className="profile-list">{data.favorites.length ? data.favorites.map(id => courts.find(c => c.id === id)).filter((c): c is Court => !!c).map(c => <button key={c.id} onClick={() => openCourt(c)}><span className="profile-list-icon">{c.sport === 'basketball' ? '🏀' : '⚽'}</span><span><strong>{c.name}</strong><small>{c.area}</small></span><ChevronRight size={18}/></button>) : <div className="no-favorites">还没有收藏球场，去发现页看看吧。</div>}</div></section><div className="prototype-note"><Info size={17}/><p><strong>账号与共享数据</strong><br/>{user ? `当前账号：${user.email ?? user.uid}。邮箱验证码登录减少随意造数，但同一人仍可能注册多个邮箱。` : '浏览球场不需要登录；发布状态或热度时需要邮箱验证码登录。'}</p></div></main>}
      <div className="prototype-note auth-strip"><Info size={17}/><p><strong>{!cloudConfigured ? '共享服务待配置' : user ? `已登录：${user.email ?? '邮箱账号'}` : '浏览无需登录，参与互动需验证邮箱'}</strong><br/>{!cloudConfigured ? '完成 CloudBase 环境配置后，邮箱验证码和跨设备同步才会启用。' : user ? '状态和热度已与所有访问者共享。' : '登录后可以发布自己的运动状态和球场热度。'}</p>{!user && cloudConfigured && <button className="text-link" onClick={() => document.getElementById('email-login')?.scrollIntoView({ behavior: 'smooth' })}>去登录 <ArrowRight size={15}/></button>}</div>
      {cloudConfigured && !user && <section id="email-login" className="email-login"><div className="section-title"><div><h2>邮箱验证码登录</h2><p>用于保护每个人的个人状态和上报</p></div></div><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="你的邮箱地址" autoComplete="email"/><div className="email-code-row"><input inputMode="numeric" value={code} onChange={e => setCode(e.target.value)} placeholder="邮箱验证码"/><button className="text-link" onClick={() => void sendCode()} disabled={sendingCode}>{sendingCode ? '发送中…' : verificationInfo ? '重新发送' : '发送验证码'}</button></div><button className="primary-button" onClick={() => void login()} disabled={authBusy || !verificationInfo}>{authBusy ? '登录中…' : '验证并登录'}</button></section>}
      <Nav page={page} setPage={go}/>
    </>}
    {toast && <div className="toast" role="status"><Check size={16}/>{toast}</div>}
  </div>
}

export default App
