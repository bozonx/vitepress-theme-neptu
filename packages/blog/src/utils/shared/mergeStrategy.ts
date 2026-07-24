import type { Author } from '../../types.d.ts'

/**
 * Merges two author arrays by `id`.
 *
 * Entries from `child` with the same `id` as `parent` override the parent
 * entry field-by-field (shallow merge). Entries with new ids are appended
 * at the end in the order they appear in `child`.
 *
 * Rationale: `authors` is the only theme array whose items have a stable,
 * meaningful identifier. Positional arrays such as `nav.links`,
 * `sidebar.links`, `footer.links`, `socialLinks` and `socialMediaShares`
 * continue to use the default replace-by-overwrite behavior of
 * {@link deepMerge} — order is part of the meaning there.
 */
export function mergeAuthorsById(
  parent: readonly Author[] | undefined,
  child: readonly Author[] | undefined
): Author[] {
  const parentList = parent ?? []
  const childList = child ?? []

  if (childList.length === 0) return parentList.slice()
  if (parentList.length === 0) return childList.slice()

  const byId = new Map<string, Author>()
  for (const item of parentList) {
    if (item?.id) byId.set(item.id, item)
  }

  const result: Author[] = []
  const consumed = new Set<string>()

  for (const parentItem of parentList) {
    if (!parentItem?.id) {
      result.push(parentItem)
      continue
    }
    const childItem = childList.find((item) => item?.id === parentItem.id)
    if (childItem) {
      result.push({ ...parentItem, ...childItem })
      consumed.add(parentItem.id)
    } else {
      result.push(parentItem)
    }
  }

  for (const childItem of childList) {
    if (!childItem?.id) {
      result.push(childItem)
      continue
    }
    if (consumed.has(childItem.id)) continue
    if (byId.has(childItem.id)) continue
    result.push(childItem)
  }

  return result
}
