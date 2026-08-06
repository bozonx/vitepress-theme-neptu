/** Get intersection of two arrays. Preserves duplicates from the first array. */
export function arrayIntersection<T>(arr1: readonly T[] = [], arr2: readonly T[] = []): T[] {
  if (!arr1.length || !arr2.length) return []
  const set2 = new Set(arr2)
  return arr1.filter((x) => set2.has(x))
}
