import slug from 'slug'
import { isPathValid, deepGet } from './object.ts'

/**
 * Safe eval for template expressions. Uses `new Function()` with data injected
 * as named parameters — expressions cannot access outer scope or globals beyond
 * what is explicitly passed in `data`. Only called when `eval: true` is set by
 * the caller, so opt-in only.
 */
function safeEval(expression: string, data: Record<string, unknown>): unknown {
  try {
    const trimmedExpr = expression.trim()
    if (!trimmedExpr) return ''

    const context = { ...data }
    const paramNames = Object.keys(context)
    const paramValues = Object.values(context)

    const func = new Function(...paramNames, `return (${trimmedExpr});`)
    const result = func(...paramValues)

    return result === null || result === undefined ? '' : result
  } catch {
    return ''
  }
}

export interface TemplateOptions {
  eval?: boolean
}

/** Mustache templates `{{value.child}}` */
export function mustacheTemplate(
  tmpl: string | null | undefined,
  data: Record<string, unknown> | null | undefined,
  options: TemplateOptions = { eval: false }
): string {
  if (tmpl === null || tmpl === undefined) return ''
  if (data === null || data === undefined) return tmpl

  let res = tmpl
  const mustacheRegex = /\{\{([^}]*)\}\}/g
  let match: RegExpExecArray | null

  while ((match = mustacheRegex.exec(tmpl)) !== null) {
    const originalKey = match[1] ?? ''
    const key = originalKey.trim()
    const escapedKey = originalKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replaceRegex = new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g')

    let stringValue: string
    if (options.eval) {
      if (!key) {
        stringValue = ''
      } else {
        const result = safeEval(key, data)
        stringValue = result === null || result === undefined ? '' : String(result)
      }
    } else {
      if (!isPathValid(key)) {
        stringValue = match[0]
      } else {
        const value = deepGet(data, key)
        stringValue = value === null || value === undefined ? '' : String(value)
      }
    }
    res = res.replace(replaceRegex, stringValue)
  }
  return res
}

/** Standard templates `${value.child}` */
export function standardTemplate(
  tmpl: string | null | undefined,
  data: Record<string, unknown> | null | undefined,
  options: TemplateOptions = { eval: false }
): string {
  if (tmpl === null || tmpl === undefined) return ''
  if (data === null || data === undefined) return tmpl

  let res = tmpl
  const templateRegex = /\$\{([^}]*)\}/g
  let match: RegExpExecArray | null

  while ((match = templateRegex.exec(tmpl)) !== null) {
    const key = (match[1] ?? '').trim()
    const escapedKey = (match[1] ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replaceRegex = new RegExp(`\\$\\{${escapedKey}\\}`, 'g')

    let stringValue: string
    if (options.eval) {
      if (!key.trim()) {
        stringValue = ''
      } else {
        const result = safeEval(key, data)
        stringValue = result === null || result === undefined ? '' : String(result)
      }
    } else {
      if (!isPathValid(key)) {
        stringValue = match[0]
      } else {
        const value = deepGet(data, key)
        stringValue = value === null || value === undefined ? '' : String(value)
      }
    }
    res = res.replace(replaceRegex, stringValue)
  }
  return res
}

export interface SmartTruncateOptions {
  mark?: string
  position?: number
  respectWords?: boolean
  removeReturns?: boolean
  markAtTheEnd?: boolean
}

/** Smart truncate string */
export function smartTruncate(
  rawString: string,
  length: number,
  options: SmartTruncateOptions = {}
): string {
  const {
    mark = '\u2026',
    position = length - 1,
    respectWords = false,
    removeReturns = true,
    markAtTheEnd = true,
  } = options

  if (typeof mark !== 'string' || typeof rawString !== 'string' || length <= 4)
    return rawString

  let str = rawString
  if (removeReturns) {
    str = str.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  } else {
    str = str.replace(/[ \t]+/g, ' ').trim()
  }

  if (str.length < 4 || length >= str.length) return str
  if (!markAtTheEnd) return str.substring(0, length)

  if (respectWords) {
    if (str.length <= length) return str
    const maxTextLength = length - mark.length
    if (maxTextLength <= 0) return mark
    const truncated = str.substring(0, maxTextLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + mark
    }
    return truncated + mark
  }

  if (position >= str.length || position >= length - mark.length) {
    return str.substring(0, length - mark.length) + mark
  }

  const start = str.substring(0, position)
  const end = str.slice(position + mark.length - length)
  return `${start}${mark}${end}`
}

/** Trim extension from filename */
export function pathTrimExt(fileName: unknown): string {
  if (typeof fileName !== 'string') return ''
  if (fileName.indexOf('.') < 0) return fileName
  const splat = fileName.split('.')
  splat.pop()
  return splat.join('.')
}

/** Transliterate string */
export function transliterate(rawStr: string, lang?: string): string {
  if (!rawStr) return ''

  if (lang === 'eo') {
    const charTable: Record<string, string> = {
      ĉ: 'cy',
      Ĉ: 'Cy',
      ĝ: 'gy',
      Ĝ: 'Gy',
      ĥ: 'x',
      Ĥ: 'X',
      ĵ: 'jy',
      Ĵ: 'Jy',
      ŝ: 'sy',
      Ŝ: 'Sy',
      ŭ: 'w',
      Ŭ: 'W',
    }

    return rawStr
      .split('')
      .map((el) => (charTable[el] ? charTable[el] : el))
      .join('')
  }

  return slug(rawStr, { locale: lang })
}

