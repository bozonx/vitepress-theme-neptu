/**
 * Contract-parity test: the block prop contract is declared in three places and
 * used to drift silently. `landingBlocksSchema.test.ts` only checks that the
 * *type names* line up; this test goes deeper and verifies that, for every
 * built-in block, the set of prop keys (and which are required) matches between
 * the TypeScript `BuiltInBlockSpec` union and the JSON Schema.
 *
 * What this catches that the type-name test cannot:
 *  - a prop added to a component but forgotten in the schema (validator then
 *    silently rejects valid frontmatter);
 *  - a prop removed from the schema but still declared in types;
 *  - a required field enforced by the schema while the component treats it as
 *    optional (one contract, two strictness levels — audit problem #2).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const packageRoot = resolve(import.meta.dirname, '../../..')

/** Keys every block inherits via `SectionProps & HeadingProps` (BlockBase). */
const BASE_KEYS: string[] = [
  // SectionProps
  'id',
  'bg',
  'width',
  'padding',
  'align',
  'divider',
  'reveal',
  // HeadingProps
  'eyebrow',
  'title',
  'text',
]

type PropContract = {
  /** Literal value of the discriminating `type` field. */
  type: string
  /** All prop keys declared on the block (base + own), excluding `type`. */
  props: Set<string>
  /** Subset of `props` that are required (no `?`). */
  required: Set<string>
}

const typeAliasDeclarations = new Map<string, ts.TypeAliasDeclaration>()

function loadTypeChecker(): ts.TypeChecker {
  // The blocks module is self-contained apart from `vue` types, which the
  // landing config already resolves. We point the program at the single source
  // file and let TS pull in what it needs.
  const typesPath = resolve(packageRoot, 'src/blocks/types.ts')
  const program = ts.createProgram({
    rootNames: [typesPath],
    options: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      allowImportingTsExtensions: true,
      noEmit: true,
      strict: true,
      skipLibCheck: true,
    },
  })

  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isTypeAliasDeclaration(node)) {
        typeAliasDeclarations.set(node.name.text, node)
      }
    })
  }

  return program.getTypeChecker()
}

const checker = loadTypeChecker()

/** Reads the string literal of a `type` discriminator argument. */
function readTypeLiteralArg(node: ts.TypeNode): string | undefined {
  if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
    return node.literal.text
  }
  return undefined
}

/**
 * Collects prop keys (and which are required) from a single type node —
 * a type literal, an intersection, or a resolvable reference like `SourcedVideo`.
 */
function collectProps(
  node: ts.TypeNode,
  out: { props: Set<string>; required: Set<string> },
  visited: Set<ts.TypeNode> = new Set()
): void {
  if (visited.has(node)) return
  visited.add(node)

  if (ts.isParenthesizedTypeNode(node)) {
    collectProps(node.type, out, visited)
    return
  }

  if (ts.isIntersectionTypeNode(node)) {
    for (const member of node.types) collectProps(member, out, visited)
    return
  }

  if (ts.isTypeLiteralNode(node)) {
    for (const member of node.members) {
      if (ts.isPropertySignature(member) && member.name) {
        const name = member.name.getText()
        out.props.add(name)
        if (!member.questionToken) out.required.add(name)
      }
    }
    return
  }

  // A union (e.g. SourcedVideo: one of youtube|vimeo|src) means "any of these
  // keys may appear", not "all required". Track presence only — required-ness
  // of a discriminated source is checked by the dedicated video test.
  if (ts.isUnionTypeNode(node)) {
    for (const member of node.types) {
      const memberOut = { props: new Set<string>(), required: new Set<string>() }
      collectProps(member, memberOut, visited)
      for (const p of memberOut.props) out.props.add(p)
    }
    return
  }

  // Resolve type references (e.g. SourcedVideo) through the checker so union
  // members like "exactly one of youtube|vimeo|src" collapse into their keys.
  if (ts.isTypeReferenceNode(node) && node.typeName) {
    const alias = typeAliasDeclarations.get(node.typeName.getText())
    if (alias) {
      collectProps(alias.type, out, visited)
      return
    }
    const type = checker.getTypeFromTypeNode(node)
    for (const symbol of type.getProperties()) {
      const decl = symbol.valueDeclaration ?? symbol.declarations?.[0]
      out.props.add(symbol.name)
      if (decl && ts.isPropertySignature(decl) && !decl.questionToken) {
        out.required.add(symbol.name)
      }
    }
  }
}

/**
 * Handles one union member of `BuiltInBlockSpec`. The two shapes are:
 *   `BlockBase<'hero', { ... }>`                              (plain reference)
 *   `(BlockBase<'video', { ... }> & SourcedVideo)`            (parenthesised intersection)
 *
 * Returns the discriminator string and accumulates the block's own props
 * (the second type argument of `BlockBase`, plus any intersected references).
 * Base keys (SectionProps & HeadingProps) are added by the caller.
 */
function extractMember(
  member: ts.TypeNode,
  out: { props: Set<string>; required: Set<string> }
): string | undefined {
  const node = ts.isParenthesizedTypeNode(member) ? member.type : member

  // `(BlockBase<...> & SourcedVideo)` — walk the intersection, the `BlockBase`
  // arm yields the type literal and its own props; the other arms contribute
  // extra props (e.g. the youtube/vimeo/src source fields).
  if (ts.isIntersectionTypeNode(node)) {
    let typeLiteral: string | undefined
    for (const part of node.types) {
      const t = extractMember(part, out)
      if (t && !typeLiteral) typeLiteral = t
    }
    return typeLiteral
  }

  if (ts.isTypeReferenceNode(node) && node.typeName.getText() === 'BlockBase') {
    const args = node.typeArguments
    if (args && args.length >= 2) {
      // The second argument is the block's own prop bag — collect directly so
      // type-parameter substitution inside the alias does not drop it.
      collectProps(args[1], out)
      return readTypeLiteralArg(args[0])
    }
  }

  // A non-BlockBase reference inside an intersection (e.g. SourcedVideo).
  collectProps(node, out)
  return undefined
}

function readBuiltInBlocks(): PropContract[] {
  const alias = typeAliasDeclarations.get('BuiltInBlockSpec')
  if (!alias || !ts.isUnionTypeNode(alias.type)) {
    throw new Error('BuiltInBlockSpec is not a union type — types.ts layout changed.')
  }

  const contracts: PropContract[] = []
  for (const member of alias.type.types) {
    const out = { props: new Set<string>(), required: new Set<string>() }
    const type = extractMember(member, out)
    if (!type) continue

    out.props.delete('type')
    out.required.delete('type')

    contracts.push({
      type,
      props: new Set([...BASE_KEYS, ...out.props]),
      // Base keys (SectionProps & HeadingProps) are all optional in the types.
      required: new Set([...out.required]),
    })
  }
  return contracts
}

type SchemaContract = {
  type: string
  props: Set<string>
  required: Set<string>
  /** The video block uses `anyOf` instead of a flat `required` — track it. */
  videoSourceAnyOf?: Set<string>
}

function readSchemaBlocks(): Map<string, SchemaContract> {
  const schema = JSON.parse(
    readFileSync(resolve(packageRoot, 'schema/landing-blocks.schema.json'), 'utf8')
  )

  // Stage 1: per-type property bags. The first `allOf` entry is `#/definitions/section`,
  // the second is the `oneOf` of typed branches (plus a trailing `not` escape hatch).
  const block = schema.definitions.block
  const sectionProps = new Set(Object.keys(block.allOf[0].$ref ? schema.definitions.section.properties : {}))
  const branches = block.allOf[1].oneOf

  // Stage 2: the `if/then.required` rules that enforce per-type required fields.
  // A rule may target a single type (`type.const`) or a group (`type.enum`),
  // in which case the `then.required` applies to every type in the enum.
  const requiredByType = new Map<string, Set<string>>()
  const videoSources = new Set<string>()
  for (const rule of block.allOf[2].allOf) {
    const typeCond = rule.if?.properties?.type
    const typeNames = typeCond?.const
      ? [typeCond.const]
      : Array.isArray(typeCond?.enum)
        ? typeCond.enum
        : []
    const required = rule.then?.required
    for (const typeName of typeNames) {
      if (Array.isArray(required)) {
        const existing = requiredByType.get(typeName) ?? new Set<string>()
        required.forEach((k) => existing.add(k))
        requiredByType.set(typeName, existing)
      }
      // video → anyOf [youtube | vimeo | src]
      if (typeName === 'video' && Array.isArray(rule.then?.anyOf)) {
        for (const branch of rule.then.anyOf) {
          if (Array.isArray(branch.required)) branch.required.forEach((k: string) => videoSources.add(k))
        }
      }
    }
  }

  const byType = new Map<string, SchemaContract>()
  for (const branch of branches) {
    const typeName = branch.properties?.type?.const
    if (!typeName) continue // the trailing `not` escape hatch has no const
    const ownProps = new Set(Object.keys(branch.properties ?? {}))
    ownProps.delete('type')
    byType.set(typeName, {
      type: typeName,
      props: new Set([...sectionProps, ...ownProps]),
      required: new Set(requiredByType.get(typeName) ?? []),
      videoSourceAnyOf: typeName === 'video' ? videoSources : undefined,
    })
  }
  return byType
}

/**
 * Map of block `type` → component file. Kept explicit (not derived from the
 * registry) so a wrong-file drift also fails loudly here rather than silently
 * resolving to whatever the registry happens to point at.
 */
const COMPONENT_BY_TYPE: Record<string, string> = {
  hero: 'LnHero.vue',
  features: 'LnFeatureGrid.vue',
  'feature-split': 'LnFeatureSplit.vue',
  bento: 'LnBento.vue',
  carousel: 'LnCarousel.vue',
  logos: 'LnLogoCloud.vue',
  stats: 'LnStats.vue',
  steps: 'LnSteps.vue',
  testimonials: 'LnTestimonials.vue',
  pricing: 'LnPricing.vue',
  faq: 'LnFaq.vue',
  cta: 'LnCta.vue',
  timeline: 'LnTimeline.vue',
  team: 'LnTeam.vue',
  gallery: 'LnGallery.vue',
  code: 'LnCode.vue',
  tabs: 'LnTabs.vue',
  compare: 'LnCompare.vue',
  newsletter: 'LnNewsletter.vue',
  video: 'LnVideo.vue',
  banner: 'LnBanner.vue',
  content: 'LnContent.vue',
  collection: 'LnCollection.vue',
  embed: 'LnEmbed.vue',
}

/**
 * Reads the `defineProps<...>` type argument of a block component and returns
 * its *own* prop keys (the type-literal members), ignoring `SectionProps` and
 * `HeadingProps` references — those are the shared base set tracked separately.
 *
 * Components always declare props optional (`?:`) so they can render as a
 * placeholder; required-ness is therefore not compared at this layer. The
 * comparison that matters here is *which* keys exist.
 */
function readComponentOwnProps(type: string): Set<string> {
  const file = COMPONENT_BY_TYPE[type]
  if (!file) throw new Error(`no component mapped for type "${type}"`)
  const src = readFileSync(resolve(packageRoot, 'src/blocks', file), 'utf8')

  const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.ESNext, true)
  let typeArg: ts.TypeNode | undefined
  const visit = (node: ts.Node): void => {
    if (!typeArg && ts.isCallExpression(node) && node.expression.getText() === 'defineProps') {
      typeArg = node.typeArguments?.[0]
    }
    if (!typeArg) ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  if (!typeArg) throw new Error(`${file}: no defineProps type argument found`)

  const own = new Set<string>()
  const collect = (node: ts.TypeNode): void => {
    if (ts.isParenthesizedTypeNode(node)) return collect(node.type)
    if (ts.isIntersectionTypeNode(node)) {
      for (const member of node.types) collect(member)
      return
    }
    // `SectionProps`, `HeadingProps` references — base set, skip.
    if (ts.isTypeReferenceNode(node)) return
    if (ts.isTypeLiteralNode(node)) {
      for (const member of node.members) {
        if (ts.isPropertySignature(member) && member.name) own.add(member.name.getText())
      }
    }
  }
  collect(typeArg)
  return own
}

describe('block contract parity (types.ts ↔ JSON Schema)', () => {
  const tsContracts = readBuiltInBlocks()
  const schemaByType = readSchemaBlocks()

  it('covers every built-in block type on both sides', () => {
    const tsTypes = tsContracts.map((c) => c.type).sort()
    const schemaTypes = [...schemaByType.keys()].sort()
    expect(tsTypes).toEqual(schemaTypes)
  })

  it.each(tsContracts.map((c) => [c.type, c] as const))(
    '%s: declares the same prop keys in TS and in the schema',
    (_name, contract) => {
      const schema = schemaByType.get(contract.type)
      expect(schema, `schema missing branch for "${contract.type}"`).toBeDefined()
      const inTsNotSchema = [...contract.props].filter((p) => !schema!.props.has(p))
      const inSchemaNotTs = [...schema!.props].filter((p) => !contract.props.has(p))
      expect(
        { inTsNotSchema, inSchemaNotTs },
        `prop drift for "${contract.type}". Add the prop to both layers or record an intentional exception.`
      ).toEqual({ inTsNotSchema: [], inSchemaNotTs: [] })
    }
  )

  it.each(tsContracts.map((c) => [c.type, c] as const))(
    '%s: requires the same fields in TS and in the schema',
    (_name, contract) => {
      const schema = schemaByType.get(contract.type)!
      const tsRequired = [...contract.required].sort()
      const schemaRequired = [...schema.required].sort()
      // `type` is the discriminator; not part of the strictness comparison.
      expect(tsRequired.filter((r) => r !== 'type')).toEqual(schemaRequired)
    }
  )

  it('video: requires exactly one source across youtube | vimeo | src on both sides', () => {
    const tsVideo = tsContracts.find((c) => c.type === 'video')!
    const schemaVideo = schemaByType.get('video')!
    const tsSources = ['youtube', 'vimeo', 'src'].filter((s) => tsVideo.props.has(s))
    expect(tsSources.sort()).toEqual([...(schemaVideo.videoSourceAnyOf ?? [])].sort())
  })

  /**
   * Documented places where a block intentionally re-declares a base key with a
   * different meaning, so the contract parity check treats them as expected
   * rather than drift. Each entry: type → set of base-key names the component
   * shadows. Keep this list small and commented — it is a known wart, not a
   * license to let it grow.
   */
  const INTENTIONAL_BASE_SHADOW: Record<string, Set<string>> = {
    // `banner` reuses `HeadingProps.text` as its announcement body (it has no
    // title/eyebrow). The component declares `text` explicitly for the JSDoc;
    // the schema covers it via the inherited `section.text`.
    banner: new Set(['text']),
  }

  it.each(tsContracts.map((c) => [c.type, c] as const))(
    '%s: component declares the same own props as the TS contract',
    (type, contract) => {
      const componentProps = readComponentOwnProps(type)
      const baseKeys = new Set(BASE_KEYS)
      const shadowed = INTENTIONAL_BASE_SHADOW[type] ?? new Set<string>()
      // The component's own props = TS props minus the shared base set, plus any
      // base keys this block intentionally re-declares.
      const tsOwn = new Set([...contract.props].filter((p) => !baseKeys.has(p)))
      for (const key of shadowed) tsOwn.add(key)
      const inTsNotComponent = [...tsOwn].filter((p) => !componentProps.has(p))
      const inComponentNotTs = [...componentProps].filter((p) => !tsOwn.has(p))
      expect(
        { inTsNotComponent, inComponentNotTs },
        `component ↔ types drift for "${type}". ` +
          'If the component grew a prop, mirror it in BuiltInBlockSpec and the schema.'
      ).toEqual({ inTsNotComponent: [], inComponentNotTs: [] })
    }
  )
})
