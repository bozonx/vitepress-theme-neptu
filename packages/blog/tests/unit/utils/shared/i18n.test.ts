import { describe, it, expect } from 'vitest'
import { resolveTranslationsByFilePath } from '../../../../src/utils/shared/i18n.ts'

describe('resolveTranslationsByFilePath', () => {
  it('returns en for undefined path', () => {
    const result = resolveTranslationsByFilePath(undefined)
    expect(result).toBeDefined()
    expect(result.t).toBeDefined()
  })

  it('returns en for empty string', () => {
    const result = resolveTranslationsByFilePath('')
    expect(result).toBeDefined()
  })

  it('returns en for unknown locale', () => {
    const result = resolveTranslationsByFilePath('unknown/page.md')
    expect(result).toBeDefined()
  })

  it('returns specific locale when first segment matches', () => {
    const ru = resolveTranslationsByFilePath('ru/page.md')
    expect(ru).toBeDefined()
    expect(ru.t).toBeDefined()
  })

  it('handles nested paths', () => {
    const result = resolveTranslationsByFilePath('en/post/hello.md')
    expect(result).toBeDefined()
  })

  it('falls back from locale variant to base interface locale', () => {
    const result = resolveTranslationsByFilePath('en-US/post/hello.md')
    expect(result).toBeDefined()
    expect(result.label).toBe('English')
  })

  it('resolves Spanish locales (es, es-419, es-MX, es-ES) to Spanish base locale', () => {
    const es = resolveTranslationsByFilePath('es/page.md')
    expect(es).toBeDefined()
    expect(es.label).toBe('Español')
    expect(es.t.search).toBe('Buscar')

    const es419 = resolveTranslationsByFilePath('es-419/page.md')
    expect(es419).toBeDefined()
    expect(es419.label).toBe('Español')

    const esMX = resolveTranslationsByFilePath('es-MX/page.md')
    expect(esMX).toBeDefined()
    expect(esMX.label).toBe('Español')

    const esES = resolveTranslationsByFilePath('es-ES/page.md')
    expect(esES).toBeDefined()
    expect(esES.label).toBe('Español')
  })

  it('resolves Chinese locales (zh, zh-CN, zh-Hans, zh-TW, zh-HK) to Simplified Chinese base locale', () => {
    const zh = resolveTranslationsByFilePath('zh/page.md')
    expect(zh).toBeDefined()
    expect(zh.label).toBe('简体中文')
    expect(zh.t.search).toBe('搜索')

    const zhCN = resolveTranslationsByFilePath('zh-CN/page.md')
    expect(zhCN).toBeDefined()
    expect(zhCN.label).toBe('简体中文')

    const zhHans = resolveTranslationsByFilePath('zh-Hans/page.md')
    expect(zhHans).toBeDefined()
    expect(zhHans.label).toBe('简体中文')

    const zhTW = resolveTranslationsByFilePath('zh-TW/page.md')
    expect(zhTW).toBeDefined()
    expect(zhTW.label).toBe('简体中文')

    const zhHK = resolveTranslationsByFilePath('zh-HK/page.md')
    expect(zhHK).toBeDefined()
    expect(zhHK.label).toBe('简体中文')
  })

  it('resolves Serbian, Portuguese, French, German, Turkish, Japanese, and Korean locales', () => {
    const sr = resolveTranslationsByFilePath('sr/page.md')
    expect(sr.label).toBe('Српски')
    expect(sr.t.search).toBe('Претрага')

    const pt = resolveTranslationsByFilePath('pt-BR/page.md')
    expect(pt.label).toBe('Português')
    expect(pt.t.search).toBe('Buscar')

    const fr = resolveTranslationsByFilePath('fr-FR/page.md')
    expect(fr.label).toBe('Français')
    expect(fr.t.search).toBe('Rechercher')

    const de = resolveTranslationsByFilePath('de-DE/page.md')
    expect(de.label).toBe('Deutsch')
    expect(de.t.search).toBe('Suchen')

    const tr = resolveTranslationsByFilePath('tr-TR/page.md')
    expect(tr.label).toBe('Türkçe')
    expect(tr.t.search).toBe('Ara')

    const ja = resolveTranslationsByFilePath('ja-JP/page.md')
    expect(ja.label).toBe('日本語')
    expect(ja.t.search).toBe('検索')

    const ko = resolveTranslationsByFilePath('ko-KR/page.md')
    expect(ko.label).toBe('한국어')
    expect(ko.t.search).toBe('검색')
  })

  it('resolves Italian, Polish, Latvian, Dutch, Swedish, Czech, Hindi, Thai, and Hebrew locales', () => {
    const it = resolveTranslationsByFilePath('it-IT/page.md')
    expect(it.label).toBe('Italiano')
    expect(it.t.search).toBe('Cerca')

    const pl = resolveTranslationsByFilePath('pl-PL/page.md')
    expect(pl.label).toBe('Polski')
    expect(pl.t.search).toBe('Szukaj')

    const lv = resolveTranslationsByFilePath('lv-LV/page.md')
    expect(lv.label).toBe('Latviešu')
    expect(lv.t.search).toBe('Meklēt')

    const nl = resolveTranslationsByFilePath('nl-NL/page.md')
    expect(nl.label).toBe('Nederlands')
    expect(nl.t.search).toBe('Zoeken')

    const sv = resolveTranslationsByFilePath('sv-SE/page.md')
    expect(sv.label).toBe('Svenska')
    expect(sv.t.search).toBe('Sök')

    const cs = resolveTranslationsByFilePath('cs-CZ/page.md')
    expect(cs.label).toBe('Čeština')
    expect(cs.t.search).toBe('Hledat')

    const hi = resolveTranslationsByFilePath('hi-IN/page.md')
    expect(hi.label).toBe('हिन्दी')
    expect(hi.t.search).toBe('खोजें')

    const th = resolveTranslationsByFilePath('th-TH/page.md')
    expect(th.label).toBe('ไทย')
    expect(th.t.search).toBe('ค้นหา')

    const he = resolveTranslationsByFilePath('he-IL/page.md')
    expect(he.label).toBe('עברית')
    expect(he.t.search).toBe('חיפוש')

    const ar = resolveTranslationsByFilePath('ar-SA/page.md')
    expect(ar.label).toBe('العربية')
    expect(ar.t.search).toBe('بحث')
  })
})

