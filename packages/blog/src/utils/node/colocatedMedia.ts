import fs from 'node:fs'
import path from 'node:path'

/**
 * File extensions treated as content media and mirrored into the build
 * output when they live next to Markdown files.
 */
export const COLOCATED_MEDIA_EXTENSIONS = [
  // images
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'webp',
  'avif',
  'ico',
  'bmp',
  // video
  'mp4',
  'webm',
  'ogv',
  'mov',
  'm4v',
  // audio
  'mp3',
  'wav',
  'ogg',
  'oga',
  'm4a',
  'flac',
  'aac',
  // documents
  'pdf',
] as const

/** Directories inside `srcDir` that never contain co-located media. */
const IGNORED_DIRS = new Set(['public', 'node_modules'])

// Inline interfaces so we do not need an explicit `vite` dependency.
// VitePress bundles vite, so at runtime the types match.
interface WriteBundleOptions {
  dir?: string
}

interface ColocatedMediaPlugin {
  name: string
  apply: 'build'
  enforce: 'post'
  writeBundle(options: WriteBundleOptions): void
}

export interface ColocatedMediaOptions {
  /** Extensions to mirror, without a leading dot. Defaults to {@link COLOCATED_MEDIA_EXTENSIONS}. */
  extensions?: readonly string[]
}

/**
 * Collects every media file that lives inside the content tree (next to a
 * Markdown file or in a subfolder such as `media/`).
 *
 * Returns paths relative to `srcDir`, using forward slashes.
 */
export function collectColocatedMedia(
  srcDir: string,
  options: ColocatedMediaOptions = {}
): string[] {
  const extensions = new Set(
    (options.extensions ?? COLOCATED_MEDIA_EXTENSIONS).map((ext) =>
      ext.toLowerCase()
    )
  )

  if (!srcDir || !fs.existsSync(srcDir)) return []

  const collected: string[] = []

  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      // Skip `.vitepress` (build output lives there), `public` (VitePress
      // copies it verbatim already) and dependency folders.
      if (entry.name.startsWith('.') || IGNORED_DIRS.has(entry.name)) continue

      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        walk(fullPath)
        continue
      }

      const ext = path.extname(entry.name).slice(1).toLowerCase()
      if (!extensions.has(ext)) continue

      collected.push(path.relative(srcDir, fullPath).split(path.sep).join('/'))
    }
  }

  walk(srcDir)

  return collected.sort()
}

/**
 * Vite plugin that mirrors co-located content media into the build output,
 * preserving the path relative to `srcDir`.
 *
 * The dev server already serves these files straight from `srcDir`, so this
 * plugin makes a production build behave exactly like `vitepress dev`:
 * a relative reference such as `./media/cover.jpg` resolves for covers,
 * landing block data, media components and image lightbox links alike —
 * not only for Markdown body images (which Vite bundles on its own).
 */
export function createColocatedMediaPlugin(
  srcDir: string,
  options: ColocatedMediaOptions = {}
): ColocatedMediaPlugin {
  const absSrcDir = path.resolve(srcDir)

  return {
    name: 'vitepress-theme-neptu:colocated-media',
    apply: 'build',
    enforce: 'post',
    writeBundle(outputOptions: WriteBundleOptions) {
      const outDir = outputOptions.dir
      // VitePress builds an SSR bundle into `.temp` before rendering pages.
      // Media only belongs in the client output.
      if (!outDir || path.basename(outDir) === '.temp') return

      for (const relativePath of collectColocatedMedia(absSrcDir, options)) {
        const from = path.join(absSrcDir, relativePath)
        const to = path.join(outDir, relativePath)

        // Never clobber generated pages or `public/` assets.
        if (fs.existsSync(to)) continue

        fs.mkdirSync(path.dirname(to), { recursive: true })
        fs.copyFileSync(from, to)
      }
    },
  }
}
