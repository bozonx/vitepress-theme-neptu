export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && !Array.isArray(value) && typeof value === 'object'
}

export function deepMerge<T>(base: T, patch: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return (patch ?? base) as T
  }

  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(patch)) {
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
