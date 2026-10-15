const envId = import.meta.env.VITE_CLOUDBASE_ENV_ID
export const cloudConfigured = Boolean(envId)
async function createClient() {
  if (!envId) throw new Error('还没有配置 CloudBase 环境')
  const sdk = await import('@cloudbase/js-sdk')
  const app = sdk.init({ env: envId })
  return { auth: app.auth({ persistence: 'local' }), db: app.database() }
}
let clientPromise: ReturnType<typeof createClient> | null = null
const getClient = () => { clientPromise ??= createClient(); return clientPromise }

export type CloudUser = { uid: string; email?: string }
export type SharedStatus = {
  _id: string
  uid: string
  name: string
  sport: 'basketball' | 'football'
  status: 'playing' | 'going' | 'maybe' | 'looking' | 'resting' | 'hidden'
  courtId: string
  expiresAt: number
  updatedAt: number
}
export type SharedReport = {
  _id: string
  uid: string
  courtId: string
  heat: 0 | 1 | 2 | 3 | 4
  condition?: 'join' | 'full' | 'match' | 'unknown'
  at: number
}

export async function requestEmailCode(email: string) {
  const { auth } = await getClient()
  return auth.getVerification({ email })
}

export async function verifyEmailCode(email: string, code: string, verificationInfo: { verification_id: string; is_user: boolean }) {
  const { auth } = await getClient()
  const result = await auth.signInWithEmail({ email, verificationCode: code, verificationInfo })
  const loginState = await auth.getLoginState()
  const uid = loginState?.user?.uid ?? (result as { user?: { uid?: string } })?.user?.uid
  if (!uid) throw new Error('登录成功，但没有读取到账号 ID，请重新登录')
  return { uid, email } satisfies CloudUser
}

export async function getCurrentUser(): Promise<CloudUser | null> {
  if (!envId) return null
  const { auth } = await getClient()
  const state = await auth.getLoginState()
  const user = state?.user
  return user?.uid ? { uid: user.uid, email: user.email } : null
}

export async function signOut() { if (envId) { const { auth } = await getClient(); await auth.signOut() } }

export async function readSharedData() {
  if (!envId) return { statuses: [] as SharedStatus[], reports: [] as SharedReport[] }
  const { db } = await getClient()
  const [statusResult, reportResult] = await Promise.all([
    db.collection('play_status').where({ expiresAt: db.command.gt(Date.now()) }).limit(100).get(),
    db.collection('court_reports').limit(100).get(),
  ])
  const reports = (reportResult.data as Array<{ _id: string; uid: string; reports?: Record<string, Omit<SharedReport, '_id' | 'uid' | 'courtId'>> }>).flatMap((record) =>
    Object.entries(record.reports ?? {}).map(([courtId, report]) => ({ _id: `${record.uid}_${courtId}`, uid: record.uid, courtId, ...report } as SharedReport)),
  ).filter(report => report.at > Date.now() - 2 * 60 * 60_000)
  return { statuses: statusResult.data as SharedStatus[], reports }
}

export async function saveSharedStatus(user: CloudUser, value: Omit<SharedStatus, '_id' | 'uid' | 'updatedAt'>) {
  const { db } = await getClient()
  await db.collection('play_status').doc(user.uid).set({ ...value, uid: user.uid, updatedAt: Date.now() })
}

export async function saveSharedReport(user: CloudUser, value: Omit<SharedReport, '_id' | 'uid'>) {
  const { db } = await getClient()
  const ref = db.collection('court_reports').doc(user.uid)
  const existing = await ref.get().catch(() => ({ data: null }))
  const previous = (existing.data as { reports?: Record<string, unknown> } | null)?.reports ?? {}
  await ref.set({ uid: user.uid, reports: { ...previous, [value.courtId]: { heat: value.heat, condition: value.condition, at: value.at } } })
}
