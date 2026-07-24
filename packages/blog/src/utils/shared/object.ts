export type DeepPathPart = string | number

/** Split deep path to paths E.g "aa[0].bb[1].cc" => ['aa', 0, 'bb', 1, 'cc'] */
export function splitDeepPath(pathTo: unknown): Array<DeepPathPart | '__NEGATIVE_INDEX__'> {
  if (!pathTo || typeof pathTo !== 'string') return []

  const res: Array<DeepPathPart | '__NEGATIVE_INDEX__'> = []
  const DEEP_PATH_SEPARATOR = '.'
  const preparedPath = pathTo.replace(/\[/g, DEEP_PATH_SEPARATOR + '[')
  const splatDots = preparedPath.startsWith(DEEP_PATH_SEPARATOR)
    ? preparedPath.slice(1).split(DEEP_PATH_SEPARATOR)
    : preparedPath.split(DEEP_PATH_SEPARATOR)

  for (const el of splatDots) {
    if (el.indexOf('[') === 0) {
      const match = el.match(/^\[(-?\d+)\]$/)
      if (match && match[1]) {
        const index = Number(match[1])
        if (index >= 0) {
          res.push(index)
        } else {
          res.push('__NEGATIVE_INDEX__')
        }
      } else {
        return []
      }
    } else {
      res.push(el)
    }
  }

  return res
}

/** Join deep path parts to string E.g ['aa', 0, 'bb', 1, 'cc'] => "aa[0].bb[1].cc" */
export function joinDeepPath(pathParts: unknown): string {
  if (!Array.isArray(pathParts) || !pathParts.length) return ''

  let result = ''
  const DEEP_PATH_SEPARATOR = '.'

  for (const item of pathParts) {
    if (typeof item === 'number') {
      result += `[${item}]`
    } else if (typeof item === 'string' && item) {
      result += DEEP_PATH_SEPARATOR + item
    }
  }

  return result.startsWith(DEEP_PATH_SEPARATOR) ? result.slice(1) : result
}

/** Check if path is valid (can be parsed correctly) */
export function isPathValid(pathTo: unknown): boolean {
  if (!pathTo || typeof pathTo !== 'string') return false
  const splatPath = splitDeepPath(pathTo)
  return splatPath.length > 0
}

/** Get value deeply from object or array. */
export function deepGet(src: unknown, pathTo: unknown, defaultValue?: unknown): unknown {
  if (src === null || src === undefined) return defaultValue
  if (typeof pathTo !== 'string') return defaultValue

  const splatPath = splitDeepPath(pathTo)
  if (splatPath.length === 0) return defaultValue

  const firstKey = splatPath[0]
  const restPath = joinDeepPath(splatPath.slice(1))

  if (Array.isArray(src)) {
    if (typeof firstKey !== 'number' || (firstKey as unknown) === '__NEGATIVE_INDEX__')
      return defaultValue

    const value = src[firstKey]
    if (restPath) {
      return deepGet(value, restPath, defaultValue)
    }
    return typeof value !== 'undefined' ? value : defaultValue
  } else if (src && typeof src === 'object') {
    if (typeof firstKey !== 'string') return defaultValue

    const value = (src as Record<string, unknown>)[firstKey]
    if (restPath) {
      return deepGet(value, restPath, defaultValue)
    }
    return Object.prototype.hasOwnProperty.call(src, firstKey) ? value : defaultValue
  }

  return defaultValue
}

/** Omit undefined values from object */
export function omitUndefined<T extends Record<string, unknown>>(obj: T | null | undefined): Partial<T> {
  if (!obj || Array.isArray(obj) || typeof obj !== 'object') return {}

  const result: Partial<T> = {}
  for (const key of Object.keys(obj) as Array<keyof T>) {
    if (typeof obj[key] !== 'undefined') {
      result[key] = obj[key]
    }
  }
  return result
}
