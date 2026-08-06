/** Get intersection of two arrays */
export function arrayIntersection<T>(arr1: readonly T[] = [], arr2: readonly T[] = []): T[] {
  return arr1.filter((x) => arr2.includes(x))
}
