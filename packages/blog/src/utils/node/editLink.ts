/**
 * Supported git hosting platforms and their edit-link path patterns.
 */
const HOSTING_PATTERNS: Record<string, string> = {
  // GitHub and Bitbucket share the same /edit/ segment
  github: '/edit/',
  bitbucket: '/edit/',
  // GitLab uses /-/edit/
  gitlab: '/-/edit/',
  // Gitea / Forgejo / Codeberg use /_edit/
  gitea: '/_edit/',
  forgejo: '/_edit/',
  codeberg: '/_edit/',
}

/**
 * Determine the edit-link path pattern for a given repository URL.
 *
 * @param repoUrl - Full repository URL (e.g. https://github.com/user/repo)
 * @param branch - Target branch (defaults to 'main')
 * @param srcDir - Source directory inside the repo (defaults to 'src')
 * @returns Pattern string compatible with EditLink.vue (:path placeholder)
 */
export function resolveEditLinkPattern(
  repoUrl: string,
  branch = 'main',
  srcDir = 'src'
): string {
  let normalizedUrl = repoUrl.trim()

  if (!normalizedUrl) {
    return ''
  }

  // Remove trailing slash and .git suffix
  normalizedUrl = normalizedUrl.replace(/\.git$/i, '').replace(/\/+$/, '')

  let hostname: string

  try {
    const url = new URL(normalizedUrl)
    hostname = url.hostname.toLowerCase()
  } catch {
    // Fallback for plain strings like "github.com/owner/repo"
    const parts = normalizedUrl.split('/')
    hostname = parts[0].toLowerCase()
    normalizedUrl = `https://${normalizedUrl}`
  }

  const editSegment = Object.entries(HOSTING_PATTERNS).find(([key]) =>
    hostname.includes(key)
  )?.[1] || HOSTING_PATTERNS.github

  // srcDir may be empty or '.' for repo-root docs
  const pathPrefix = srcDir && srcDir !== '.' ? `${srcDir}/:path` : ':path'

  return `${normalizedUrl}${editSegment}${branch}/${pathPrefix}`
}
