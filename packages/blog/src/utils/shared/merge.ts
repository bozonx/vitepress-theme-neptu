export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

export function deepMerge<T>(base: T, patch: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return (patch ?? base) as T
  }

  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    if (DANGEROUS_KEYS.has(key)) continue
    const prev = result[key]
    if (Array.isArray(value)) {
      result[key] = value.slice()
    } else if (isPlainObject(prev) && isPlainObject(value)) {
      result[key] = deepMerge(prev, value)
    } else if (typeof value !== 'undefined') {
      result[key] = value
    }
  }

  return result as T
}
