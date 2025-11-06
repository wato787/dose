/**
 * TanStack RouterのsearchParamsと互換性のある型定義
 * searchParamsは通常、文字列として扱われるため、数値に変換する必要がある場合がある
 */

/**
 * 検索パラメータを正規化（文字列を数値に変換）
 */
export function normalizeSearchParams<T extends Record<string, unknown>>(
  params: T
): {
  [K in keyof T]: T[K] extends string
    ? K extends 'isActive'
      ? boolean
      : K extends 'medicineId' | 'customItemId' | 'scheduleId' | 'limit' | 'offset'
      ? number
      : T[K]
    : T[K]
} {
  const normalized = { ...params } as any
  
  if ('medicineId' in normalized && typeof normalized.medicineId === 'string') {
    normalized.medicineId = parseInt(normalized.medicineId, 10)
  }
  if ('customItemId' in normalized && typeof normalized.customItemId === 'string') {
    normalized.customItemId = parseInt(normalized.customItemId, 10)
  }
  if ('scheduleId' in normalized && typeof normalized.scheduleId === 'string') {
    normalized.scheduleId = parseInt(normalized.scheduleId, 10)
  }
  if ('limit' in normalized && typeof normalized.limit === 'string') {
    normalized.limit = parseInt(normalized.limit, 10)
  }
  if ('offset' in normalized && typeof normalized.offset === 'string') {
    normalized.offset = parseInt(normalized.offset, 10)
  }
  if ('isActive' in normalized && typeof normalized.isActive === 'string') {
    normalized.isActive = normalized.isActive === 'true'
  }
  
  return normalized
}

