// Ambient module declarations for dependencies without bundled types.

declare module 'slug' {
  interface SlugOptions {
    replacement?: string
    remove?: RegExp | null
    lower?: boolean
    locale?: string
    trim?: boolean
    fallback?: boolean
    charmap?: Record<string, string>
    multicharmap?: Record<string, string>
  }
  function slug(input: string, opts?: SlugOptions | string): string
  export = slug
}
declare module '*.css' {
  const content: string;
  export default content;
}

