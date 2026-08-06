/** Remove the first H1 title from Markdown, supporting ATX and Setext styles. */
export function removeTitleFromMarkdown(rawMd: string | null | undefined): string {
  if (!rawMd) return ''

  const normalized = rawMd.trim()

  if (/^#\s+.+/.test(normalized)) {
    return normalized.replace(/^#\s+.+/, '')
  }

  if (/^.+\n=+/.test(normalized)) {
    return normalized.replace(/^.+\n=+/, '')
  }

  return normalized
}
