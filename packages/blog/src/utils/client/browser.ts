export function handleFastRedirectToRecentPosts(window: Window): void {
  const urlParams = new URLSearchParams(window.location.search)
  const isRedirect = urlParams.get('recent')

  if (isRedirect === '1') {
    const cleanUrl = window.location.pathname
    window.history.replaceState({}, '', cleanUrl)
  }
}

export function resolveNavigatorLang(
  navigator: Navigator,
  locales: string[] = []
): string | undefined {
  const navLang =
    navigator.language ||
    ((navigator as unknown as Record<string, unknown>).userLanguage as string | undefined)
  if (!navLang) return undefined

  const shortLang = navLang.split('-')[0]
  return locales.find((l) => l === navLang) || locales.find((l) => l === shortLang)
}
