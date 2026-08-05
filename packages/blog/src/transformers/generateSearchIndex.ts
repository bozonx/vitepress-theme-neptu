import type { ExtendedSiteConfig } from '../types.d.ts'

const LOG_PREFIX = '[neptu-blog]'

/**
 * Builds the Pagefind search index from the freshly rendered site.
 *
 * Pagefind ships as a dependency of the theme, so a plain `vitepress build` is
 * enough — no extra CLI step or devDependency on the user side. The index is
 * written to `<outDir>/pagefind`, which is exactly where the search modal
 * loads its bundle from.
 *
 * Disable with `themeConfig.search.enabled: false` (e.g. when you prefer
 * to run the `pagefind` CLI yourself with custom flags).
 */
export async function generateSearchIndex(
  config: ExtendedSiteConfig
): Promise<void> {
  const search = config.userConfig?.themeConfig?.search
  const outDir = config.outDir

  if (search?.enabled === false) return

  if (!outDir) {
    console.warn(`${LOG_PREFIX} Cannot build the search index: outDir is unknown.`)
    return
  }

  let pagefind: typeof import('pagefind')

  try {
    pagefind = await import('pagefind')
  } catch (error) {
    console.warn(
      `${LOG_PREFIX} Pagefind is not available, search index was not built.\n` +
        `             ${(error as Error).message}`
    )
    return
  }

  try {
    const { index, errors } = await pagefind.createIndex()

    if (!index) {
      console.warn(
        `${LOG_PREFIX} Failed to create the Pagefind index: ${errors.join(', ')}`
      )
      return
    }

    // `page_count` is the number of files handed to Pagefind; the index itself
    // only keeps the pages carrying the body marker.
    const { page_count: scannedFiles } = await index.addDirectory({
      path: outDir,
    })
    const { outputPath } = await index.writeFiles({
      outputPath: `${outDir}/pagefind`,
    })

    console.log(
      `${LOG_PREFIX} Pagefind search index written to ${outputPath} ` +
        `(${scannedFiles} files scanned).`
    )
  } catch (error) {
    console.warn(
      `${LOG_PREFIX} Failed to build the Pagefind search index.\n` +
        `             ${(error as Error).message}`
    )
  } finally {
    await pagefind.close()
  }
}
