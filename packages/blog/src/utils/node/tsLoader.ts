import fs from 'node:fs'
import { createJiti } from 'jiti'

let jitiInstance: ReturnType<typeof createJiti> | null = null

function getJiti(): ReturnType<typeof createJiti> {
  if (!jitiInstance) {
    jitiInstance = createJiti(import.meta.url, {
      // Always re-read in dev; VitePress hot reload handles restart anyway.
      moduleCache: false,
      interopDefault: true,
    })
  }
  return jitiInstance
}

/**
 * Dynamically imports a `.ts` / `.mjs` config file and returns its default
 * export.
 *
 * Returns `undefined` if the file does not exist. Logs and returns
 * `undefined` on import errors so that loaders can gracefully fall back to
 * the YAML variant instead of crashing the whole build.
 */
export async function importConfigModule<T = unknown>(
  absPath: string
): Promise<T | undefined> {
  if (!fs.existsSync(absPath)) return undefined
  try {
    const mod = await getJiti().import(absPath, { default: true })
    return mod as T
  } catch (error) {
    console.warn(
      `[vitepress-theme-neptu-blog] Failed to load TS config ${absPath}:`,
      (error as Error)?.message
    )
    return undefined
  }
}
