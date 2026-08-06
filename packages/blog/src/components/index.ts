// Public components barrel.
// Import from `vitepress-theme-neptu/components` in your blog markdown
// or theme overrides:
//
//   import { HomeHero, TagPostsList } from 'vitepress-theme-neptu/components'

export { default as LocaleSelector } from './LocaleSelector.vue'

// Ads and table of contents. `NeptuAd` is also registered globally by the
// theme, so markdown may reference it without importing anything.
export { default as NeptuAd } from './NeptuAd.vue'
export { default as TocAside } from './toc/TocAside.vue'
export { default as TocCollapsible } from './toc/TocCollapsible.vue'
export { default as TocLinks } from './toc/TocLinks.vue'
export { default as HomeHero } from './utility/HomeHero.vue'
export { default as HomeTags } from './utility/HomeTags.vue'
export { default as HomeCategories } from './utility/HomeCategories.vue'
export { default as HomePopularPosts } from './utility/HomePopularPosts.vue'
export { default as HomeFeaturedPosts } from './utility/HomeFeaturedPosts.vue'
export { default as HomeLatestPosts } from './utility/HomeLatestPosts.vue'
export { default as HomeSections } from './utility/HomeSections.vue'
export { default as AllTagsList } from './utility/AllTagsList.vue'
export { default as AuthorDetails } from './utility/AuthorDetails.vue'
export { default as NeptuAuthors } from './utility/NeptuAuthors.vue'
export { default as MonthPostsList } from './utility/MonthPostsList.vue'
export { default as MonthsOfYear } from './utility/MonthsOfYear.vue'
export { default as NavSearchButton } from './utility/NavSearchButton.vue'
export { default as PagefindSearch } from './utility/PagefindSearch.vue'
export { default as PopularPostsList } from './utility/PopularPostsList.vue'
export { default as FeaturedPostsList } from './utility/FeaturedPostsList.vue'
export { default as RecentPostsList } from './utility/RecentPostsList.vue'
export { default as TagPostsList } from './utility/TagPostsList.vue'
export { default as CategoryPostsList } from './utility/CategoryPostsList.vue'
export { default as AllCategoriesList } from './utility/AllCategoriesList.vue'
export { default as NeptuBreadcrumbs } from './utility/NeptuBreadcrumbs.vue'
export { default as UtilPageContent } from './utility/UtilPageContent.vue'
export { default as UtilPageHeader } from './utility/UtilPageHeader.vue'
export { default as UtilSubPageHeader } from './utility/UtilSubPageHeader.vue'
export { default as NeptuYears } from './utility/NeptuYears.vue'

export { default as AudioFile } from './doc-components/AudioFile.vue'
export { default as FileDownload } from './doc-components/FileDownload.vue'
export { default as YoutubeVideo } from './doc-components/YoutubeVideo.vue'
export { default as VideoFile } from './doc-components/VideoFile.vue'

// Post building blocks — use them to assemble custom post layouts.
export { default as PostAuthor } from './post/PostAuthor.vue'
export { default as PostComments } from './post/PostComments.vue'
export { default as PostDate } from './post/PostDate.vue'
export { default as PostDraftBadge } from './post/PostDraftBadge.vue'
export { default as PostReadingTime } from './post/PostReadingTime.vue'
export { default as PostDonateLink } from './post/PostDonateLink.vue'
export { default as PostFooter } from './post/PostFooter.vue'
export { default as PostImage } from './post/PostImage.vue'
export { default as PostSimilarList } from './post/PostSimilarList.vue'
export { default as PostSocialShare } from './post/PostSocialShare.vue'
export { default as PostTags } from './post/PostTags.vue'
export { default as PostCategories } from './post/PostCategories.vue'
export { default as PostTopBar } from './post/PostTopBar.vue'
export { default as PostVideoLink } from './post/PostVideoLink.vue'
export { default as PodcastDropdown } from './post/PodcastDropdown.vue'
export { default as PodcastIcon } from './post/PodcastIcon.vue'
export { default as SwitchLang } from './layout-parts/SwitchLang.vue'

// Theme controls. Shared with the landing theme, which registers them
// globally — they carry their own CSS and depend on no Tailwind utility.
export { default as ColorThemePicker } from './theme/ColorThemePicker.vue'
export { default as StylePresetPicker } from './theme/StylePresetPicker.vue'
export { default as SwitchAppearance } from './layout-parts/SwitchAppearance.vue'
