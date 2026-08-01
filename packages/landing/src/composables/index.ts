/**
 * Both theme axes are owned by the blog package and re-exported here, so a
 * landing-only project never has to reach across packages for them.
 */
export {
  useColorTheme,
  COLOR_THEMES,
  COLOR_STORAGE_KEY,
  COLOR_ATTRIBUTE,
  DEFAULT_COLOR_THEME,
  type ColorThemeOption,
  useStylePreset,
  STYLE_PRESETS,
  STYLE_STORAGE_KEY,
  STYLE_ATTRIBUTE,
  DEFAULT_STYLE_PRESET,
  type StylePresetOption,
} from 'vitepress-theme-neptu/composables'
