/**
 * 認証関連のドメイン型定義
 * better-authのスキーマに基づく
 */

/**
 * ユーザー型
 */
export type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * 新規ユーザー作成時の型
 */
export type NewUser = {
  name: string
  email: string
  emailVerified?: boolean
  image?: string | null
}

/**
 * セッション型
 */
export type Session = {
  id: string
  expiresAt: Date
  token: string
  createdAt: Date
  updatedAt: Date
  ipAddress: string | null
  userAgent: string | null
  userId: string
}

/**
 * 新規セッション作成時の型
 */
export type NewSession = {
  expiresAt: Date
  token: string
  ipAddress?: string | null
  userAgent?: string | null
  userId: string
}

/**
 * アカウント型
 */
export type Account = {
  id: string
  accountId: string
  providerId: string
  userId: string
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  expiresAt: Date | null
  password: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * 新規アカウント作成時の型
 */
export type NewAccount = {
  accountId: string
  providerId: string
  userId: string
  accessToken?: string | null
  refreshToken?: string | null
  idToken?: string | null
  expiresAt?: Date | null
  password?: string | null
}

/**
 * 認証トークン型
 */
export type Verification = {
  id: string
  identifier: string
  value: string
  expiresAt: Date
  createdAt: Date | null
  updatedAt: Date | null
}

/**
 * 新規認証トークン作成時の型
 */
export type NewVerification = {
  identifier: string
  value: string
  expiresAt: Date
  createdAt?: Date | null
  updatedAt?: Date | null
}

