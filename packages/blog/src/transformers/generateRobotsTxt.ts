import fs from 'node:fs'
import path from 'node:path'
import { normalizeSiteUrl } from '../utils/shared/index.ts'
import type { ExtendedSiteConfig } from '../types.d.ts'

/**
 * Generates a basic robots.txt in the output directory if the user has not
 * provided their own via public/robots.txt.
 */
export function generateRobotsTxt(config: ExtendedSiteConfig): void {
  const siteUrl = normalizeSiteUrl(config.userConfig?.siteUrl)

  if (!siteUrl) return

  const publicRobotsPath = path.join(config.srcDir || '', 'public', 'robots.txt')
  const outRobotsPath = path.join(config.outDir || '', 'robots.txt')

  // If the user placed a custom robots.txt in public/, VitePress will copy it
  // to outDir automatically. We only warn if it lacks a Sitemap directive.
  if (fs.existsSync(publicRobotsPath)) {
    const content = fs.readFileSync(publicRobotsPath, 'utf-8')
    const hasSitemap = content
      .split('\n')
      .some((line) => /^Sitemap:/i.test(line.trim()))

    if (!hasSitemap) {
      console.warn(
        `[neptu-blog] Custom robots.txt detected, but Sitemap directive is missing.\n` +
          `             Add: Sitemap: ${siteUrl}/sitemap.xml`
      )
    }

    return
  }

  const robotsContent = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

  fs.mkdirSync(path.dirname(outRobotsPath), { recursive: true })
  fs.writeFileSync(outRobotsPath, robotsContent, 'utf-8')
}
