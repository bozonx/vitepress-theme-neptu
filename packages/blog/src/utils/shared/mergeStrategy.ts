import type { Author, SocialMediaShare } from '../../types.d.ts'

/**
 * Merges two arrays of objects by a shared key field.
 *
 * Entries from `child` with the same key as `parent` override the parent
 * entry field-by-field (shallow merge). Entries with new keys are appended
 * at the end in the order they appear in `child`.
 */
function mergeByKey<T>(
  parent: readonly T[] | undefined,
  child: readonly T[] | undefined,
  keyField: keyof T
): T[] {
  const parentList = parent ?? []
  const childList = child ?? []

  if (childList.length === 0) return parentList.slice()
  if (parentList.length === 0) return childList.slice()

  const byKey = new Map<unknown, T>()
  for (const item of parentList) {
    const key = item?.[keyField]
    if (key != null) byKey.set(key, item)
  }

  const result: T[] = []
  const consumed = new Set<unknown>()

  for (const parentItem of parentList) {
    const key = parentItem?.[keyField]
    if (key == null) {
      result.push(parentItem)
      continue
    }
    const childItem = childList.find((item) => item?.[keyField] === key)
    if (childItem) {
      result.push({ ...parentItem, ...childItem })
      consumed.add(key)
    } else {
      result.push(parentItem)
    }
  }

  for (const childItem of childList) {
    const key = childItem?.[keyField]
    if (key == null) {
      result.push(childItem)
      continue
    }
    if (consumed.has(key)) continue
    if (byKey.has(key)) continue
    result.push(childItem)
  }

  return result
}

/**
 * Merges two author arrays by `id`.
 *
 * Rationale: `authors` is the only theme array whose items have a stable,
 * meaningful identifier. Positional arrays such as `nav.links`,
 * `sidebar.links`, `footer.links` and `socialLinks` continue to use the
 * default replace-by-overwrite behavior of {@link deepMerge} — order is
 * part of the meaning there.
 */
export function mergeAuthorsById(
  parent: readonly Author[] | undefined,
  child: readonly Author[] | undefined
): Author[] {
  return mergeByKey(parent, child, 'id')
}

/**
 * Merges two `socialMediaShares` arrays by `name`.
 *
 * Set `enabled: false` on a child entry to disable (hide) a built-in button
 * without removing it from the config — the component filters out items
 * where `enabled === false`.
 */
export function mergeSocialMediaSharesByName(
  parent: readonly SocialMediaShare[] | undefined,
  child: readonly SocialMediaShare[] | undefined
): SocialMediaShare[] {
  return mergeByKey(parent, child, 'name')
}
