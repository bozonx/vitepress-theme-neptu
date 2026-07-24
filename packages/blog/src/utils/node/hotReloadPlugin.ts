import path from 'node:path'

// Inline interfaces so we do not need an explicit `vite` dependency.
// VitePress bundles vite, so at runtime the types match.
interface ViteDevServer {
  watcher: {
    add(pattern: string | string[]): void
    on(event: string, handler: (filePath: string) => void): void
  }
  config: {
    logger: {
      info(msg: string, options?: { timestamp?: boolean }): void
      error(msg: string): void
    }
  }
  restart(): Promise<void>
}

interface Plugin {
  name: string
  configureServer(server: ViteDevServer): void
}

/**
 * Vite plugin that watches the admin-editable site config files under
 * `srcDir` and triggers a dev-server restart when any of them changes.
 *
 * Files watched:
 *   - <srcDir>/site.{yaml,ts}
 *   - <srcDir>/<locale>/_site.{yaml,ts}
 *   - <srcDir>/<locale>/_authors.{yaml,ts}
 *
 * A restart is required (rather than HMR) because these files feed into
 * the VitePress config itself, which is resolved once at server startup.
 */
export function createSiteYamlHotReloadPlugin(srcDir: string): Plugin {
  const absSrcDir = path.resolve(srcDir)
  const watchedBaseNames = new Set([
    'site.yaml',
    'site.ts',
    '_site.yaml',
    '_site.ts',
    '_authors.yaml',
    '_authors.ts',
  ])

  function shouldHandle(changedPath: string): boolean {
    if (!changedPath.startsWith(absSrcDir)) return false
    return watchedBaseNames.has(path.basename(changedPath))
  }

  return {
    name: 'vitepress-theme-neptu-blog:site-yaml-hot-reload',
    configureServer(server: ViteDevServer) {
      // Register explicit watch patterns so additions are also caught on
      // platforms where the default recursive watch skips new files.
      server.watcher.add([
        path.join(absSrcDir, '**/site.yaml'),
        path.join(absSrcDir, '**/site.ts'),
        path.join(absSrcDir, '**/_site.yaml'),
        path.join(absSrcDir, '**/_site.ts'),
        path.join(absSrcDir, '**/_authors.yaml'),
        path.join(absSrcDir, '**/_authors.ts'),
      ])

      const onChange = (changedPath: string): void => {
        if (!shouldHandle(changedPath)) return
        server.config.logger.info(
          `\n[neptu-blog] Site config changed: ${path.relative(absSrcDir, changedPath)} — restarting dev server...`,
          { timestamp: true }
        )
        server.restart().catch((error: Error) => {
          server.config.logger.error(
            `[neptu-blog] Failed to restart dev server: ${error.message}`
          )
        })
      }

      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}
