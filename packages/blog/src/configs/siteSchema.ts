import { z } from 'zod'

/**
 * Zod schemas for the admin-editable site config files. Every object schema
 * is deliberately `loose` — unknown keys pass through so that future theme
 * additions do not break existing configs. Only well-known keys and clearly
 * incorrect shapes produce warnings.
 *
 * These schemas are used for best-effort validation with user-friendly
 * error messages (see {@link validateAndWarn}); they do not mutate the
 * loaded payload.
 */

const AuthorLinkSchema = z.looseObject({
  type: z.string().optional(),
  url: z.string().optional(),
  title: z.string().optional(),
})

export const AuthorSchema = z.looseObject({
  id: z.string().min(1, 'author `id` must be a non-empty string'),
  name: z.string().optional(),
  avatar: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  aboutUrl: z.string().optional(),
  twitterHandle: z.string().optional(),
  imageWidth: z.number().optional(),
  imageHeight: z.number().optional(),
  links: z.array(AuthorLinkSchema).optional(),
})

export const AuthorsListSchema = z.array(AuthorSchema)

const ThemeConfigSchema = z
  .looseObject({
    blogTitle: z.string().optional(),
    perPage: z.number().optional(),
    similarPostsCount: z.number().optional(),
    sidebarTagsCount: z.number().optional(),
    paginationMaxItems: z.number().optional(),
    postFooter: z.array(z.string()).optional(),
    authors: z.array(AuthorSchema).optional(),
  })
  .optional()

export const SiteYamlSchema = z.looseObject({
  lang: z.string().optional(),
  title: z.string().optional(),
  titleTemplate: z.string().optional(),
  description: z.string().optional(),
  extends: z.string().optional(),
  themeConfig: ThemeConfigSchema,
})

/**
 * Runs the schema against `value`. On failure, emits a `console.warn` for
 * every issue (with path and file label), but always returns the original
 * value — validation is advisory, not blocking, so that one typo in a YAML
 * file does not prevent the whole site from building.
 */
export function validateAndWarn<T>(
  schema: z.ZodType<T>,
  value: unknown,
  fileLabel: string
): unknown {
  if (value === undefined || value === null) return value
  const result = schema.safeParse(value)
  if (result.success) return value
  for (const issue of result.error.issues) {
    const pathStr = issue.path.length ? issue.path.join('.') : '(root)'
    console.warn(
      `[vitepress-theme-neptu-blog] ${fileLabel} — ${pathStr}: ${issue.message}`
    )
  }
  return value
}
