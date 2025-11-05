/**
 * APIクライアント
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

/**
 * 認証ヘッダーを取得
 */
const getAuthHeaders = (): HeadersInit => {
  // TODO: 認証トークンを取得して設定
  // const token = getToken()
  // return { Authorization: `Bearer ${token}` }
  return {}
}

/**
 * リクエストを送信
 */
const fetchAPI = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    // Better Auth のエラーレスポンスを処理
    try {
      const errorData = await response.json()
      throw new Error(errorData.message || errorData.error || `API Error: ${response.statusText}`)
    } catch {
      // JSON パースに失敗した場合は通常のエラー
    throw new Error(`API Error: ${response.statusText}`)
    }
  }

  return response.json()
}

/**
 * GETリクエスト
 */
export const get = async <T>(endpoint: string): Promise<T> => {
  return fetchAPI<T>(endpoint, { method: "GET" })
}

/**
 * POSTリクエスト
 */
export const post = async <T>(endpoint: string, data?: unknown): Promise<T> => {
  return fetchAPI<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUTリクエスト
 */
export const put = async <T>(endpoint: string, data?: unknown): Promise<T> => {
  return fetchAPI<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETEリクエスト
 */
export const del = async <T>(endpoint: string): Promise<T> => {
  return fetchAPI<T>(endpoint, { method: "DELETE" })
}

