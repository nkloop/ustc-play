import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Home,
  Info,
  MapPin,
  Navigation,
  Settings2,
  ShieldCheck,
  Star,
  Users,
  UserRound,
  X,
} from "lucide-react";
import {
  conditions,
  courts,
  heatEmoji,
  heatLabels,
  sportLabel,
  statusLabel,
  statusOptions,
  type Condition,
  type Court,
  type Heat,
  type Sport,
  type Status,
} from "./data";
import { auth, db } from "./cloudbase";

type Page = "home" | "discover" | "status" | "friends" | "profile";
type SavedState = {
  sport: Sport;
  status: Status;
  courtId: string;
  expiresAt: number;
};
type Storage = { favorites: string[]; state: SavedState; name: string };
type CloudUser = { id: string; email?: string | null };
type VerifyOtp = (params: {
  token: string;
}) => Promise<{ data: { user?: CloudUser | null }; error: Error | null }>;
type CourtReport = {
  _openid?: string;
  courtId: string;
  heat: Heat;
  condition?: Condition;
  createdAt: number;
};
type PublicStatus = {
  _openid?: string;
  ownerId?: string;
  sport: Sport;
  status: Status;
  courtId: string;
  expiresAt: number;
  name: string;
  updatedAt: number;
};

function errorText(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const details = error as { message?: unknown; error_description?: unknown };
    if (typeof details.message === "string" && details.message) return details.message;
    if (typeof details.error_description === "string" && details.error_description)
      return details.error_description;
  }
  return fallback;
}

const initial: Storage = {
  favorites: [],
  state: { sport: "basketball", status: "resting", courtId: "", expiresAt: 0 },
  name: "未登录用户",
};

function useLocalData() {
  const [data, setData] = useState<Storage>(() => {
    try {
      const saved = localStorage.getItem("ustc-play-v3");
      return saved
        ? { ...initial, ...(JSON.parse(saved) as Partial<Storage>) }
        : initial;
    } catch {
      return initial;
    }
  });
  useEffect(
    () => localStorage.setItem("ustc-play-v3", JSON.stringify(data)),
    [data],
  );
  return [data, setData] as const;
}

function CourtScene({
  sport,
  variant = "blue",
  large = false,
}: {
  sport: Sport;
  variant?: string;
  large?: boolean;
}) {
  const grass =
    variant === "green"
      ? "#496f65"
      : variant === "orange"
        ? "#487879"
        : "#456f78";
  const courtColor = sport === "football" ? "#61a077" : "#cf765d";
  return (
    <svg
      className={`court-scene ${large ? "court-scene-large" : ""}`}
      viewBox="0 0 520 320"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${sportLabel(sport)}场地插画`}
    >
      <defs>
        <linearGradient id={`sky-${variant}-${sport}`} x2="0" y2="1">
          <stop stopColor="#bdd9e5" />
          <stop offset="1" stopColor="#f5e5c8" />
        </linearGradient>
        <linearGradient id={`floor-${variant}-${sport}`} x2="0" y2="1">
          <stop stopColor={grass} />
          <stop offset="1" stopColor="#2b555c" />
        </linearGradient>
        <filter id="blurTree">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect width="520" height="320" fill={`url(#sky-${variant}-${sport})`} />
      <path
        d="M0 128Q100 100 202 128T520 112V215H0Z"
        fill="#7f9a7d"
        opacity=".55"
      />
      <path d="M0 163Q112 130 208 158T520 146V235H0Z" fill="#315c52" />
      <g fill="#294f47" opacity=".8">
        <circle cx="25" cy="131" r="67" />
        <circle cx="104" cy="122" r="53" />
        <circle cx="435" cy="126" r="69" />
        <circle cx="510" cy="100" r="82" />
      </g>
      <g fill="#608a62" opacity=".82" filter="url(#blurTree)">
        <circle cx="62" cy="105" r="60" />
        <circle cx="176" cy="119" r="39" />
        <circle cx="406" cy="107" r="58" />
      </g>
      <path
        d="M0 194L520 177V320H0Z"
        fill={`url(#floor-${variant}-${sport})`}
      />
      <path d="M0 207L520 190" stroke="#cfdec9" strokeWidth="3" opacity=".65" />
      {sport === "basketball" ? (
        <>
          <path d="M42 245L278 212L515 230L515 320H79Z" fill={courtColor} />
          <path
            d="M75 263L273 233L480 246M284 218L296 320M138 320Q163 248 278 253M420 320Q395 249 310 250"
            fill="none"
            stroke="#f4e2ca"
            strokeWidth="3"
            opacity=".85"
          />
          <path
            d="M128 91V210M122 91H181V131H122Z"
            fill="none"
            stroke="#e6eee5"
            strokeWidth="5"
          />
          <path
            d="M150 133L151 142Q161 149 171 140V133"
            fill="none"
            stroke="#e7e0d2"
            strokeWidth="2"
          />
          <path d="M84 210L128 191" stroke="#d1dad4" strokeWidth="4" />
          <path
            d="M414 121V210M409 121H449V151H409Z"
            fill="none"
            stroke="#e5eee5"
            strokeWidth="4"
          />
          <path d="M428 151V161" stroke="#e6ded4" strokeWidth="2" />
        </>
      ) : (
        <>
          <path d="M36 220L260 192L506 212L520 310L80 320Z" fill={courtColor} />
          <path
            d="M43 231L262 204L492 223L505 305L95 314ZM265 205L286 312M228 256A44 26 0 1 0 316 256A44 26 0 1 0 228 256M56 244L140 235L153 303L84 310M402 227L486 235L501 297L414 302"
            stroke="#dfeddc"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M42 204V241L84 242V207M425 193V228L477 231V198"
            stroke="#f1f5eb"
            strokeWidth="4"
            fill="none"
          />
        </>
      )}
      <g fill="#173a41" opacity=".85">
        <path d="M34 143h3v68h-3zM219 148h3v61h-3zM362 138h3v67h-3zM493 125h3v87h-3z" />
      </g>
      <circle cx="352" cy="24" r="31" fill="#fff6dc" opacity=".32" />
    </svg>
  );
}

function SportSwitch({
  value,
  onChange,
}: {
  value: Sport;
  onChange: (v: Sport) => void;
}) {
  return (
    <div className="sport-switch" role="group" aria-label="运动类型">
      {(["basketball", "football"] as Sport[]).map((s) => (
        <button
          key={s}
          className={value === s ? "active" : ""}
          onClick={() => onChange(s)}
        >
          <span className="sport-emoji">
            {s === "basketball" ? "🏀" : "⚽"}
          </span>
          {sportLabel(s)}
        </button>
      ))}
    </div>
  );
}

function HeatBadge({ heat }: { heat: Heat }) {
  return (
    <span className={`heat-badge heat-${heat}`}>
      <span>{heat >= 3 ? "♨" : heat === 0 ? "○" : "●"}</span>
      {heatLabels[heat]}
    </span>
  );
}

function Metric({
  icon,
  value,
  label,
  color,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  color: string;
}) {
  return (
    <div className="metric">
      <span className={`metric-icon ${color}`}>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

function CourtCard({
  court,
  favorite,
  report,
  onOpen,
  onFavorite,
}: {
  court: Court;
  favorite: boolean;
  report?: CourtReport;
  onOpen: () => void;
  onFavorite: () => void;
}) {
  const heat = court.heat;
  return (
    <article className="court-card" onClick={onOpen}>
      <div className="court-card-top">
        <div className="court-thumb">
          <CourtScene sport={court.sport} variant={court.color} />
        </div>
        <div className="court-card-info">
          <div className="card-title-row">
            <h3>{court.name}</h3>
            <button
              className={`star-button ${favorite ? "is-favorite" : ""}`}
              aria-label={favorite ? "取消收藏" : "收藏球场"}
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
            >
              <Star size={18} fill={favorite ? "currentColor" : "none"} />
            </button>
          </div>
          {court.reports > 0 ? (
            <HeatBadge heat={heat} />
          ) : (
            <span className="muted">暂无热度数据</span>
          )}
          <p>
            {report && Date.now() - report.createdAt < 60_000
              ? "你刚刚上报 · "
              : ""}
            {court.reports > 0
              ? `${court.reports} 条最近 1 小时内的上报 · ${court.minutes} 分钟前更新`
              : "等待第一条真实上报"}
          </p>
        </div>
      </div>
      <div className="metric-row">
        <Metric
          icon={<Users size={17} />}
          value={court.playing || "暂无"}
          label="正在打球"
          color="teal"
        />
        <Metric
          icon={<Navigation size={17} />}
          value={court.going || "暂无"}
          label="准备前往"
          color="blue"
        />
        <Metric
          icon={<Activity size={17} />}
          value={court.maybe || "暂无"}
          label="今晚可能"
          color="blue"
        />
      </div>
    </article>
  );
}

function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const tabs: { page: Page; label: string; icon: ReactNode }[] = [
    { page: "home", label: "首页", icon: <Home /> },
    { page: "discover", label: "发现", icon: <Compass /> },
    { page: "status", label: "我的状态", icon: <Activity /> },
    { page: "friends", label: "好友", icon: <Users /> },
    { page: "profile", label: "我的", icon: <UserRound /> },
  ];
  return (
    <nav className="bottom-nav" aria-label="主要导航">
      {tabs.map((t) => (
        <button
          key={t.page}
          className={page === t.page ? "selected" : ""}
          onClick={() => setPage(t.page)}
        >
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState<CloudUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register" | "verify">(
    "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [verifyOtp, setVerifyOtp] = useState<VerifyOtp | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [courtReports, setCourtReports] = useState<CourtReport[]>([]);
  const [publicStatuses, setPublicStatuses] = useState<PublicStatus[]>([]);
  const [sharedDataError, setSharedDataError] = useState("");
  const [data, setData] = useLocalData();
  const [page, setPage] = useState<Page>("home");
  const [sport, setSport] = useState<Sport>("basketball");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [heat, setHeat] = useState<Heat | null>(null);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [status, setStatus] = useState<Status>(data.state.status);
  const [statusSport, setStatusSport] = useState<Sport>(data.state.sport);
  const [statusCourt, setStatusCourt] = useState(data.state.courtId);
  const [duration, setDuration] = useState("90");
  const [toast, setToast] = useState("");
  const [showAllHome, setShowAllHome] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [draftName, setDraftName] = useState(data.name);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    auth
      .getSession()
      .then((result) => {
        const current = result.error ? null : result.data.user;
        if (current?.id) {
          setUser({
            id: String(current.id),
            email: current.email ? String(current.email) : null,
          });
          setData((previous) => ({
            ...previous,
            name: current.email ? String(current.email) : previous.name,
          }));
        }
      })
      .catch((error) => console.warn("登录状态读取失败", error))
      .finally(() => setAuthLoading(false));
  }, [setData]);

  const refreshSharedData = async () => {
    if (!user) {
      setCourtReports([]);
      setPublicStatuses([]);
      setSharedDataError("");
      return;
    }
    const cutoff = Date.now() - 60 * 60_000;
    const reportResult = await db
      .collection("court_reports")
      .where({ createdAt: db.command.gt(cutoff) })
      .get();
    const validReports = (reportResult.data as CourtReport[]).filter(
      (item) =>
        typeof item._openid === "string" &&
        item._openid.length > 0 &&
        courts.some((court) => court.id === item.courtId) &&
        Number.isInteger(item.heat) &&
        item.heat >= 0 &&
        item.heat <= 4 &&
        Number.isFinite(item.createdAt),
    );
    const latestReports = new Map<string, CourtReport>();
    for (const report of validReports) {
      const key = `${report._openid}:${report.courtId}`;
      if (!latestReports.has(key) || latestReports.get(key)!.createdAt < report.createdAt) {
        latestReports.set(key, report);
      }
    }
    setCourtReports([...latestReports.values()]);
    const statusResult = await db
      .collection("play_status")
      .where({ expiresAt: db.command.gt(Date.now()) })
      .get();
    const validStatuses = (statusResult.data as PublicStatus[]).filter(
      (item) =>
        typeof item._openid === "string" &&
        item._openid.length > 0 &&
        statusOptions.some((option) => option.id === item.status) &&
        item.status !== "hidden" &&
        Number.isFinite(item.expiresAt),
    );
    const latestStatuses = new Map<string, PublicStatus>();
    for (const entry of validStatuses) {
      const key = entry._openid!;
      if (!latestStatuses.has(key) || latestStatuses.get(key)!.updatedAt < entry.updatedAt) {
        latestStatuses.set(key, entry);
      }
    }
    setPublicStatuses([...latestStatuses.values()]);
    setSharedDataError("");
  };

  useEffect(() => {
    refreshSharedData().catch((error) =>
      setSharedDataError(errorText(error, "共享数据读取失败")),
    );
    const timer = window.setInterval(
      () =>
        refreshSharedData().catch((error) =>
          setSharedDataError(errorText(error, "共享数据读取失败")),
        ),
      30_000,
    );
    return () => window.clearInterval(timer);
  }, [user]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const ownStatus = publicStatuses.find((item) => item._openid === user?.id);
  const activeStatus =
    ownStatus?.expiresAt && ownStatus.expiresAt > now
      ? ownStatus.status
      : "hidden";
  const latestReport = (id: string) =>
    courtReports
      .filter((report) => report.courtId === id && report._openid === user?.id)
      .sort((a, b) => b.createdAt - a.createdAt)[0];
  const tell = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };
  const go = (p: Page) => {
    setSelectedCourt(null);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleFavorite = (id: string) => {
    setData((d) => ({
      ...d,
      favorites: d.favorites.includes(id)
        ? d.favorites.filter((x) => x !== id)
        : [...d.favorites, id],
    }));
    tell(data.favorites.includes(id) ? "已取消收藏" : "已加入收藏");
  };
  const openCourt = (court: Court) => {
    setSelectedCourt(court);
    setHeat(null);
    setCondition(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const authenticate = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError("");
    setAuthBusy(true);
    try {
      if (authMode === "register") {
        const result = await auth.signUp({ email: email.trim(), password });
        if (result.error) throw result.error;
        if (!result.data.verifyOtp)
          throw new Error("未收到验证码确认步骤，请检查邮箱登录配置");
        setVerifyOtp(() => result.data.verifyOtp as VerifyOtp);
        setAuthMode("verify");
        return;
      }
      if (authMode === "verify") {
        if (!verifyOtp) throw new Error("验证码会话已失效，请重新注册");
        const result = await verifyOtp({ token: otp.trim() });
        if (result.error) throw result.error;
        const signedInUser = result.data.user;
        if (!signedInUser?.id)
          throw new Error("验证成功但未取得用户身份，请刷新后重试");
        setUser(signedInUser);
        setData((previous) => ({
          ...previous,
          name: signedInUser.email || email.trim(),
        }));
        tell("注册并登录成功");
        return;
      }
      const result = await auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (result.error) throw result.error;
      const signedInUser = result.data.user;
      if (!signedInUser?.id) throw new Error("登录成功但未取得用户身份");
      setUser(signedInUser);
      setData((previous) => ({
        ...previous,
        name: signedInUser.email || email.trim(),
      }));
      tell("登录成功");
    } catch (error) {
      setAuthError(errorText(error, "认证失败，请稍后重试"));
    } finally {
      setAuthBusy(false);
    }
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
    setData((previous) => ({ ...previous, name: "未登录用户" }));
    setAuthMode("login");
    setPassword("");
  };

  const publishReport = async () => {
    if (!selectedCourt || heat === null) {
      tell("请先选择球场热度");
      return;
    }
    if (!user) {
      tell("请先登录");
      return;
    }
    try {
      await db
        .collection("court_reports")
        .doc(`${user.id}_${selectedCourt.id}`)
        .set({
          courtId: selectedCourt.id,
          heat,
          condition: condition ?? undefined,
          createdAt: Date.now(),
        });
      await refreshSharedData();
      tell("上报成功，已同步到服务器");
      setSelectedCourt(null);
    } catch (error) {
      tell(errorText(error, "上报失败"));
    }
  };
  const updateStatus = async () => {
    if (!user) {
      tell("请先登录");
      return;
    }
    const expiresAt = Date.now() + Number(duration) * 60_000;
    try {
      await db
        .collection("play_status")
        .doc(user.id)
        .set({
          status,
          sport: statusSport,
          courtId: statusCourt,
          expiresAt,
          updatedAt: Date.now(),
        });
      setData((d) => ({
        ...d,
        state: { status, sport: statusSport, courtId: statusCourt, expiresAt },
      }));
      setNow(Date.now());
      await refreshSharedData();
      tell("状态已更新，其他用户可见");
    } catch (error) {
      tell(errorText(error, "状态更新失败"));
    }
  };
  const liveCourts = courts.map((court) => {
    const reports = courtReports.filter(
      (report) => report.courtId === court.id,
    );
    const statuses = publicStatuses.filter((item) => item.courtId === court.id);
    const latest = reports.reduce(
      (value, item) => Math.max(value, item.createdAt),
      0,
    );
    return {
      ...court,
      heat: (reports.length
        ? Math.round(
            reports.reduce((sum, item) => sum + item.heat, 0) / reports.length,
          )
        : 0) as Heat,
      reports: reports.length,
      minutes: latest
        ? Math.max(0, Math.round((Date.now() - latest) / 60_000))
        : 0,
      playing: statuses.filter((item) => item.status === "playing").length,
      going: statuses.filter((item) => item.status === "going").length,
      maybe: statuses.filter(
        (item) => item.status === "maybe" || item.status === "looking",
      ).length,
    };
  });
  const currentCourt = liveCourts.find((c) => c.id === ownStatus?.courtId);
  const selectedLiveCourt = selectedCourt
    ? liveCourts.find((c) => c.id === selectedCourt.id)
    : null;
  const visibleHomeCourts = liveCourts.filter(
    (c) => c.sport === sport && (showAllHome || data.favorites.includes(c.id)),
  );

  if (authLoading)
    return (
      <div className="app-shell">
        <main className="page" style={{ paddingTop: 72, textAlign: "center" }}>
          正在检查登录状态…
        </main>
      </div>
    );

  if (!user && page === "profile")
    return (
      <div className="app-shell">
        <main className="page" style={{ paddingTop: 56 }}>
          <header className="page-header">
            <p className="eyebrow">USTC PLAY</p>
            <h1>球场相见</h1>
            <p>登录后可上报球场情况，并与其他用户共享运动状态。</p>
          </header>
          <form
            onSubmit={authenticate}
            style={{
              marginTop: 28,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="邮箱地址"
              value={email}
              disabled={authMode === "verify"}
              onChange={(event) => setEmail(event.target.value)}
              style={{
                height: 46,
                border: "1px solid #dfe7f0",
                borderRadius: 10,
                padding: "0 12px",
                fontSize: 14,
              }}
            />
            {authMode !== "verify" && (
              <input
                type="password"
                autoComplete={
                  authMode === "register" ? "new-password" : "current-password"
                }
                required
                minLength={8}
                placeholder="密码（至少 8 位）"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                style={{
                  height: 46,
                  border: "1px solid #dfe7f0",
                  borderRadius: 10,
                  padding: "0 12px",
                  fontSize: 14,
                }}
              />
            )}
            {authMode === "verify" && (
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                placeholder="邮箱中的验证码"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                style={{
                  height: 46,
                  border: "1px solid #dfe7f0",
                  borderRadius: 10,
                  padding: "0 12px",
                  fontSize: 14,
                }}
              />
            )}
            {authError && (
              <p
                role="alert"
                style={{ color: "#c73f32", fontSize: 13, margin: 0 }}
              >
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="primary-button"
              disabled={authBusy}
            >
              {authBusy
                ? "处理中…"
                : authMode === "login"
                  ? "登录"
                  : authMode === "register"
                    ? "发送邮箱验证码"
                    : "验证并完成注册"}
            </button>
          </form>
          <p
            style={{
              textAlign: "center",
              marginTop: 16,
              fontSize: 13,
              color: "#6f7d8d",
            }}
          >
            {authMode === "login"
              ? "还没有账号？"
              : authMode === "register"
                ? "已有账号？"
                : "没有收到或验证码已失效？"}{" "}
            <button
              type="button"
              onClick={() => {
                setAuthMode(
                  authMode === "login"
                    ? "register"
                    : authMode === "register"
                      ? "login"
                      : "register",
                );
                setAuthError("");
                setOtp("");
                setVerifyOtp(null);
              }}
              style={{
                background: "none",
                border: 0,
                color: "#2f7df5",
                cursor: "pointer",
              }}
            >
              {authMode === "login"
                ? "去注册"
                : authMode === "register"
                  ? "去登录"
                  : "重新发送"}
            </button>
          </p>
          <div className="prototype-note" style={{ marginTop: 36 }}>
            <Info size={17} />
            <p>
              <strong>注册说明</strong>
              <br />
              注册会先向邮箱发送验证码；输入验证码并通过后，账号才真正创建。若无法收到邮件，需要在
              CloudBase 控制台确认“邮箱验证码登录”已开启并完成邮件服务配置。
            </p>
          </div>
        </main>
        <Nav page={page} setPage={go} />
      </div>
    );

  return (
    <div className="app-shell">
      {sharedDataError && (
        <div role="alert" className="prototype-note" style={{ margin: 12 }}>
          <Info size={17} />
          <p>
            共享数据暂时读取失败：{sharedDataError}
            。请稍后重试，当前空白不代表球场无人。
          </p>
        </div>
      )}
      {selectedCourt ? (
        <>
          <header className="detail-header">
            <button
              className="icon-button"
              onClick={() => setSelectedCourt(null)}
              aria-label="返回"
            >
              <ArrowLeft />
            </button>
            <strong>{selectedCourt.name}</strong>
            <div>
              <button
                className={`icon-button ${data.favorites.includes(selectedCourt.id) ? "fav-icon" : ""}`}
                onClick={() => toggleFavorite(selectedCourt.id)}
                aria-label="切换收藏"
              >
                <Star
                  size={21}
                  fill={
                    data.favorites.includes(selectedCourt.id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>
          </header>
          <main className="detail-main">
            <div className="hero-scene">
              <CourtScene
                sport={selectedCourt.sport}
                variant={selectedCourt.color}
                large
              />
              <span className="scene-count">场地示意图</span>
            </div>
            <section className="detail-intro">
              <div className="detail-title-line">
                <div>
                  <p className="eyebrow">
                    {sportLabel(selectedCourt.sport)} · 校园球场
                  </p>
                  <h1>{selectedCourt.name}</h1>
                </div>
                <span className="distance-pill">
                  步行约{selectedCourt.walk}分钟
                </span>
              </div>
              <p className="muted detail-location">
                <MapPin size={15} />
                {selectedCourt.area}
              </p>
              <p className="court-description">{selectedCourt.description}</p>
              <div className="facility-tags">
                {selectedCourt.facilities.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            </section>
            <section className="detail-live">
              <div className="section-title">
                <div>
                  <span className="live-dot" />
                  最近一小时上报 <small>共享数据</small>
                </div>
                {selectedLiveCourt && selectedLiveCourt.reports > 0 ? (
                  <HeatBadge heat={selectedLiveCourt.heat} />
                ) : (
                  <span className="muted">暂无数据</span>
                )}
              </div>
              <p className="muted">
                {selectedLiveCourt && selectedLiveCourt.reports > 0
                  ? `${selectedLiveCourt.reports} 条上报 · ${selectedLiveCourt.minutes} 分钟前更新`
                  : user ? "等待第一条真实上报" : "登录后查看实时上报；此处暂无数据不代表球场无人"}
              </p>
              <div className="detail-metrics">
                <Metric
                  icon={<Users size={18} />}
                  value={selectedLiveCourt?.playing || "暂无"}
                  label="正在打球"
                  color="teal"
                />
                <Metric
                  icon={<Navigation size={18} />}
                  value={selectedLiveCourt?.going || "暂无"}
                  label="准备前往"
                  color="blue"
                />
                <Metric
                  icon={<Clock3 size={18} />}
                  value={selectedLiveCourt?.maybe || "暂无"}
                  label="今晚可能"
                  color="blue"
                />
              </div>
            </section>
            <section className="report-area">
              <h2>快捷上报当前情况</h2>
              <p className="muted">让同学们知道这里的实时情况</p>
              <div className="heat-choices">
                {heatLabels.map((label, i) => (
                  <button
                    key={label}
                    className={`heat-choice heat-choice-${i} ${heat === i ? "chosen" : ""}`}
                    onClick={() => setHeat(i as Heat)}
                  >
                    <span>{heatEmoji[i]}</span>
                    <strong>{label}</strong>
                  </button>
                ))}
              </div>
              <h3>
                补充说明 <small>可选</small>
              </h3>
              <div className="condition-choices">
                {conditions.map((c) => (
                  <button
                    key={c.id}
                    className={condition === c.id ? "chosen" : ""}
                    onClick={() =>
                      setCondition(condition === c.id ? null : c.id)
                    }
                  >
                    <span>{c.emoji}</span>
                    {c.label}
                  </button>
                ))}
              </div>
              <button className="primary-button" onClick={publishReport}>
                发布上报 <ArrowRight size={18} />
              </button>
              <p className="privacy-note">
                上报会保存到 CloudBase，其他用户可见
              </p>
            </section>
          </main>
        </>
      ) : (
        <>
          {page === "home" && (
            <main className="page home-page">
              <header className="home-header">
                <div>
                  <div className="brand">
                    U-<em>Play</em>
                  </div>
                  <p>
                    球场相见，一起运动 <span>✨</span>
                  </p>
                </div>
                <button
                  className="round-tool"
                  onClick={() => tell("暂无新通知")}
                  aria-label="通知"
                >
                  <Bell size={21} />
                </button>
              </header>
              <SportSwitch
                value={sport}
                onChange={(s) => {
                  setSport(s);
                  setShowAllHome(false);
                }}
              />
              <section className="home-section">
                <div className="section-title">
                  <div>
                    <h2>我的球场</h2>
                    <p>同学们共享的最新动态</p>
                  </div>
                  <button
                    className="text-link"
                    onClick={() => setShowAllHome(!showAllHome)}
                  >
                    {showAllHome ? "只看收藏" : "查看全部"}
                    <ChevronRight size={17} />
                  </button>
                </div>
                <div className="court-list">
                  {visibleHomeCourts.length ? (
                    visibleHomeCourts.map((c) => (
                      <CourtCard
                        key={c.id}
                        court={c}
                        favorite={data.favorites.includes(c.id)}
                        report={latestReport(c.id)}
                        onOpen={() => openCourt(c)}
                        onFavorite={() => toggleFavorite(c.id)}
                      />
                    ))
                  ) : (
                    <div className="empty-card">
                      <Star size={25} />
                      <strong>还没有收藏的{sportLabel(sport)}场</strong>
                      <button onClick={() => setShowAllHome(true)}>
                        浏览全部球场
                      </button>
                    </div>
                  )}
                </div>
              </section>
              <div className="home-footnote">
                <Info size={14} />{" "}
                {user ? "独立制作，非学校官方服务；没有上报时显示“暂无数据”" : "游客可浏览球场；登录后查看实时数据。暂无数据不代表球场无人。"}
              </div>
            </main>
          )}
          {page === "discover" && (
            <main className="page discover-page">
              <header className="page-header">
                <p className="eyebrow">EXPLORE CAMPUS</p>
                <h1>发现球场</h1>
                <p>{user ? "选个场地，查看同学们提交的真实状态。" : "选个场地；登录后可查看实时上报。"}</p>
              </header>
              <SportSwitch value={sport} onChange={setSport} />
              <div className="discover-spotlight">
                <div className="spotlight-copy">
                  <span>球场入口</span>
                  <h2>
                    {sport === "basketball"
                      ? "查看东区篮球场"
                      : "查看东区足球场"}
                  </h2>
                  <p>没有上报时会明确显示暂无数据</p>
                  <button
                    onClick={() =>
                      openCourt(
                        liveCourts.find(
                          (c) =>
                            c.id ===
                            (sport === "basketball" ? "east-b" : "east-f"),
                        )!,
                      )
                    }
                  >
                    查看场地 <ArrowRight size={16} />
                  </button>
                </div>
                <div className="spotlight-ball">
                  {sport === "basketball" ? "🏀" : "⚽"}
                </div>
              </div>
              <div className="section-title discover-title">
                <div>
                  <h2>全部{sportLabel(sport)}场</h2>
                  <p>校园球场一览</p>
                </div>
                <span className="court-count">
                  {liveCourts.filter((c) => c.sport === sport).length} 个场地
                </span>
              </div>
              <div className="court-list">
                {liveCourts
                  .filter((c) => c.sport === sport)
                  .map((c) => (
                    <CourtCard
                      key={c.id}
                      court={c}
                      favorite={data.favorites.includes(c.id)}
                      report={latestReport(c.id)}
                      onOpen={() => openCourt(c)}
                      onFavorite={() => toggleFavorite(c.id)}
                    />
                  ))}
              </div>
            </main>
          )}
          {page === "status" && !user && (
            <main className="page status-page">
              <h1>我的运动状态</h1>
              <p>登录后可以发布自己的运动状态。</p>
              <button className="primary-button" onClick={() => go("profile")}>去登录或注册</button>
            </main>
          )}
          {page === "status" && user && (
            <main className="page status-page">
              <div className="profile-strip">
                <div className="avatar self-avatar">我</div>
                <div>
                  <strong>{data.name}</strong>
                  <p>当前登录用户</p>
                </div>
                <ChevronRight size={20} />
              </div>
              <div className="status-heading">
                <div>
                  <h1>我的运动状态</h1>
                  <p>发布后，其他用户可以看到你的状态</p>
                </div>
                <span className="hint-badge">
                  <Clock3 size={13} /> 到期自动过期
                </span>
              </div>
              <div className="status-grid">
                {statusOptions
                  .filter((option) => option.id !== "hidden")
                  .map((option) => (
                    <button
                      className={`status-option ${option.color} ${status === option.id ? "chosen" : ""}`}
                      key={option.id}
                      onClick={() => setStatus(option.id)}
                    >
                      <span className="option-emoji">{option.icon}</span>
                      <strong>{option.label}</strong>
                      <small>{option.subtitle}</small>
                      {status === option.id && (
                        <span className="option-check">
                          <Check size={13} />
                        </span>
                      )}
                    </button>
                  ))}
              </div>
              <div className="field-group">
                <h2>选择运动类型</h2>
                <SportSwitch
                  value={statusSport}
                  onChange={(s) => {
                    setStatusSport(s);
                    setStatusCourt(courts.find((c) => c.sport === s)!.id);
                  }}
                />
              </div>
              <div className="field-group">
                <h2>
                  选择想去的球场 <small>可选</small>
                </h2>
                <div className="select-wrap">
                  <MapPin size={19} />
                  <select
                    value={statusCourt}
                    onChange={(e) => setStatusCourt(e.target.value)}
                    aria-label="选择球场"
                  >
                    <option value="">暂不选择球场</option>
                    {courts
                      .filter((c) => c.sport === statusSport)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                  <ChevronRight size={18} />
                </div>
              </div>
              <div className="field-group">
                <h2>状态有效期</h2>
                <div className="duration-row">
                  {[
                    ["30", "30分钟"],
                    ["90", "90分钟"],
                    ["240", "4小时"],
                    ["720", "今晚"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      className={duration === value ? "selected" : ""}
                      onClick={() => setDuration(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="primary-button green-button"
                onClick={updateStatus}
              >
                更新我的状态 <ArrowRight size={18} />
              </button>
              <p className="privacy-note">
                <ShieldCheck size={14} /> 每个账号只能覆盖自己的状态记录
              </p>
            </main>
          )}
          {page === "friends" && (
            <main className="page friends-page">
              <header className="friends-header">
                <div>
                  <p className="eyebrow">LIVE STATUS</p>
                  <h1>公开状态</h1>
                </div>
              </header>
              <div className="friend-list">
                {publicStatuses.length ? (
                  publicStatuses.map((item) => (
                    <div className="friend-row" key={item._openid}>
                      <div className="avatar avatar-slate">球</div>
                      <div className="friend-info">
                        <strong>球友 #{item._openid?.slice(0, 8)}</strong>
                        <div className="friend-status">
                          <span>
                            {
                              statusOptions.find(
                                (option) => option.id === item.status,
                              )?.icon
                            }
                          </span>
                          <div>
                            <span>
                              {statusLabel(item.status)}
                              {item.courtId && (
                                <span>
                                  {" "}
                                  ·{" "}
                                  {liveCourts.find(
                                    (court) => court.id === item.courtId,
                                  )?.name ?? "未选择球场"}
                                </span>
                              )}
                            </span>
                            <small>
                              {Math.max(
                                0,
                                Math.round((item.expiresAt - now) / 60_000),
                              )}{" "}
                              分钟后过期
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-card">
                    <Users size={25} />
                    <strong>{user ? "暂无公开状态" : "登录后查看公开状态"}</strong>
                    <span>{user ? "还没有用户发布有效的运动状态" : "游客可浏览球场，实时状态需要登录后查看"}</span>
                  </div>
                )}
              </div>
              <div className="privacy-banner">
                <ShieldCheck size={22} />
                <div>
                  <strong>这里只展示用户主动发布的状态</strong>
                  <p>已移除所有模拟好友和模拟状态。</p>
                </div>
              </div>
            </main>
          )}
          {page === "profile" && user && (
            <main className="page profile-page">
              <header className="page-header">
                <p className="eyebrow">MY SPACE</p>
                <h1>我的</h1>
              </header>
              <div className="my-hero">
                <div className="avatar self-avatar">我</div>
                <div>
                  <h2>{data.name}</h2>
                  <p>{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setDraftName(data.name);
                    setShowNameEdit(true);
                  }}
                  aria-label="编辑昵称"
                >
                  <Settings2 size={19} />
                </button>
              </div>
              <div className="current-state-card">
                <div>
                  <span className="mini-label">当前运动状态</span>
                  <strong>
                    {statusOptions.find((s) => s.id === activeStatus)?.icon}{" "}
                    {statusLabel(activeStatus)}
                  </strong>
                  <p>
                    {activeStatus === "hidden"
                      ? "尚未发布或状态已过期"
                      : `${sportLabel(data.state.sport)} · ${currentCourt?.name ?? "未选择球场"}`}
                  </p>
                </div>
                <button onClick={() => go("status")}>
                  编辑 <ArrowRight size={15} />
                </button>
              </div>
              <section className="profile-section">
                <div className="section-title">
                  <div>
                    <h2>收藏球场</h2>
                    <p>收藏只保存在当前浏览器</p>
                  </div>
                  <span className="court-count">
                    {data.favorites.length} 个
                  </span>
                </div>
                <div className="profile-list">
                  {data.favorites.length ? (
                    data.favorites
                      .map((id) => liveCourts.find((c) => c.id === id))
                      .filter((c): c is Court => !!c)
                      .map((c) => (
                        <button key={c.id} onClick={() => openCourt(c)}>
                          <span className="profile-list-icon">
                            {c.sport === "basketball" ? "🏀" : "⚽"}
                          </span>
                          <span>
                            <strong>{c.name}</strong>
                            <small>{c.area}</small>
                          </span>
                          <ChevronRight size={18} />
                        </button>
                      ))
                  ) : (
                    <div className="no-favorites">
                      还没有收藏球场，去发现页看看吧。
                    </div>
                  )}
                </div>
              </section>
              <div className="prototype-note">
                <Info size={17} />
                <p>
                  <strong>数据说明</strong>
                  <br />
                  球场上报与运动状态来自 CloudBase
                  共享数据库；昵称与收藏仍保存在当前浏览器。
                </p>
              </div>
              <button className="primary-button" onClick={signOut}>
                退出登录
              </button>
            </main>
          )}
          <Nav page={page} setPage={go} />
        </>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
      {showNameEdit && (
        <div className="modal-backdrop" onClick={() => setShowNameEdit(false)}>
          <div className="name-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>编辑昵称</h2>
              <button onClick={() => setShowNameEdit(false)} aria-label="关闭">
                <X size={21} />
              </button>
            </div>
            <input
              value={draftName}
              maxLength={16}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="输入昵称"
            />
            <button
              className="primary-button"
              onClick={() => {
                if (!draftName.trim()) {
                  tell("请输入昵称");
                  return;
                }
                setData((d) => ({ ...d, name: draftName.trim() }));
                setShowNameEdit(false);
                tell("昵称已保存");
              }}
            >
              保存昵称
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
