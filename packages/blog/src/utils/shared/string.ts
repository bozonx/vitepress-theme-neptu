import slug from 'slug'
import { isPathValid, deepGet } from './object.ts'

/**
 * Scoped eval for template expressions. Uses `new Function()` with data injected
 * as named parameters — expressions cannot access outer scope or globals beyond
 * what is explicitly passed in `data`. Only called when `eval: true` is set by
 * the caller, so opt-in only.
 */
function scopedEval(expression: string, data: Record<string, unknown>): unknown {
  try {
    const trimmedExpr = expression.trim()
    if (!trimmedExpr) return ''

    const context = { ...data }
    const paramNames = Object.keys(context)
    const paramValues = Object.values(context)

    const func = new Function(...paramNames, `'use strict'; return (${trimmedExpr});`)
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
export function interpolateMustache(
  tmpl: string | null | undefined,
  data: Record<string, unknown> | null | undefined,
  options: TemplateOptions = { eval: false }
): string {
  if (tmpl === null || tmpl === undefined) return ''
  if (data === null || data === undefined) return tmpl

  let res = tmpl
  const mustacheRegex = /\{\{([^}]*)\}\}/g
  let match: RegExpExecArray | null
  const replaced = new Set<string>()

  while ((match = mustacheRegex.exec(tmpl)) !== null) {
    const fullMatch = match[0]
    if (replaced.has(fullMatch)) continue
    replaced.add(fullMatch)

    const originalKey = match[1] ?? ''
    const key = originalKey.trim()

    let stringValue: string
    if (options.eval) {
      if (!key) {
        stringValue = ''
      } else {
        const result = scopedEval(key, data)
        stringValue = result === null || result === undefined ? '' : String(result)
      }
    } else {
      if (!isPathValid(key)) {
        stringValue = fullMatch
      } else {
        const value = deepGet(data, key)
        stringValue = value === null || value === undefined ? '' : String(value)
      }
    }
    // Use split/join to avoid regex construction per placeholder
    res = res.split(fullMatch).join(stringValue)
  }
  return res
}

/** Dollar templates `${value.child}` */
export function interpolateDollarTemplate(
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
        const result = scopedEval(key, data)
        stringValue = result === null || result === undefined ? '' : String(result)
      }
    } else {
      if (!isPathValid(key)) {
        stringValue = match[0]
      } else {
        const value = deepGet(data, key)
        // Config files are parsed before their locale inheritance is merged.
        // Keep unresolved placeholders for the later, merged-config pass.
        stringValue = value === null || value === undefined ? match[0] : String(value)
      }
    }
    res = res.replace(replaceRegex, stringValue)
  }
  return res
}

export interface TruncateTextOptions {
  ellipsis?: string
  splitPosition?: number
  respectWords?: boolean
  removeReturns?: boolean
  appendEllipsis?: boolean
}

/** Truncate string with optional ellipsis and word-boundary respect */
export function truncateText(
  text: string,
  length: number,
  options: TruncateTextOptions = {}
): string {
  const {
    ellipsis = '\u2026',
    splitPosition = length - 1,
    respectWords = false,
    removeReturns = true,
    appendEllipsis = true,
  } = options

  if (typeof ellipsis !== 'string' || typeof text !== 'string' || length <= 4)
    return text

  let str = text
  if (removeReturns) {
    str = str.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  } else {
    str = str.replace(/[ \t]+/g, ' ').trim()
  }

  if (str.length < 4 || length >= str.length) return str
  if (!appendEllipsis) return str.substring(0, length)

  if (respectWords) {
    if (str.length <= length) return str
    const maxTextLength = length - ellipsis.length
    if (maxTextLength <= 0) return ellipsis
    const truncated = str.substring(0, maxTextLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + ellipsis
    }
    return truncated + ellipsis
  }

  if (splitPosition >= str.length || splitPosition >= length - ellipsis.length) {
    return str.substring(0, length - ellipsis.length) + ellipsis
  }

  const start = str.substring(0, splitPosition)
  const end = str.slice(splitPosition + ellipsis.length - length)
  return `${start}${ellipsis}${end}`
}

/** Trim extension from filename */
export function stripExtension(fileName: unknown): string {
  if (typeof fileName !== 'string') return ''
  if (fileName.indexOf('.') < 0) return fileName
  const parts = fileName.split('.')
  parts.pop()
  return parts.join('.')
}

/** Convert string to a URL-friendly slug */
export function slugify(rawStr: string, lang?: string): string {
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
