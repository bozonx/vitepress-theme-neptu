---
title: Справочник компонентов, composables и утилит
description: >
  Что тема экспортирует наружу: глобальные компоненты для markdown, блоки
  списков и постов для собственных макетов, composables и вспомогательные
  функции.
authorId: ivan-k
date: 2026-07-08
category: { name: 'Углубляемся в тему Neptu', slug: 'neptu-deep' }
tags: [advanced, components]
descrAsPreview: true
---

Это справочная страница: перечень всего, что тема отдаёт наружу. Как этим
пользоваться на практике, разбирается в [Кастомизации](customization).

## Четыре точки импорта

```ts
import { RecentList } from 'vitepress-theme-neptu/components'
import { useUiTheme } from 'vitepress-theme-neptu/composables'
import { isPost } from 'vitepress-theme-neptu/utils'
import { makeTagsList } from 'vitepress-theme-neptu/list-helpers'
```

## Глобальные компоненты

Пять компонентов тема регистрирует глобально — их можно писать в любом
`.md`-файле без `<script setup>` и импорта:

| Компонент | Назначение |
| --- | --- |
| `YoutubeVideo` | Адаптивный ролик YouTube |
| `VideoFile` | Плеер локального видео |
| `AudioFile` | Аудиоплеер со ссылкой на скачивание |
| `FileDownload` | Кнопка скачивания файла |
| `NeptuAd` | Рекламный блок в произвольном месте статьи |

Живые примеры первых четырёх и их props — в
[Обложках, картинках и медиа](covers-images-media#медиа-компоненты); `NeptuAd` описан в [Рекламных
блоках](ads).

## Списки и страницы

Компоненты, из которых собраны служебные страницы темы. Нужны, если вы делаете
свою страницу-список или меняете главную:

| Компонент | Что выводит |
| --- | --- |
| `RecentList` | Свежие посты с пагинацией |
| `PopularPostsList` | Популярные посты (требует `popularPosts.enabled`) |
| `FeaturedList` | Посты с `featured: true` |
| `TagPostsList` | Посты одного тега |
| `CategoryPostsList` | Посты одной категории |
| `MonthPostsList` | Посты одного месяца |
| `AllTagsList` | Облако всех тегов |
| `AllCategoriesList` | Список всех категорий |
| `NeptuAuthors` | Список авторов |
| `AuthorDetails` | Карточка одного автора |
| `NeptuYears` | Архив по годам |
| `MonthsOfYear` | Месяцы внутри года |

Все списки принимают `curPage` и рисуют свою пагинацию сами; страницы-шаблоны
в `recent/`, `tags/` и `archive/` показывают, как их подключать.

## Блоки главной страницы

| Компонент | Что выводит |
| --- | --- |
| `HomeHero` | Hero-блок из `home.hero` |
| `HomeSections` | Все секции из `home.sections` разом |
| `HomeFeaturedPosts` | Секция избранных постов |
| `HomeLatestPosts` | Секция последних постов |
| `HomePopularPosts` | Секция популярных постов |
| `HomeTags` | Облако тегов |
| `HomeCategories` | Список категорий |

Обычную главную настраивают через YAML — см. [Списки, страницы и
главную](lists-and-pages). Эти компоненты нужны, только если вы собираете
главную вручную.

## Части поста

Из них собран стандартный макет статьи; ими же собирают свой:

| Компонент | Назначение |
| --- | --- |
| `PostDate` | Дата публикации |
| `PostReadingTime` | Оценка времени чтения |
| `PostDraftBadge` | Бейдж «Черновик» |
| `PostImage` | Обложка с подписью и размерами |
| `PostTopBar` | Верхние действия: кнопка видео и подкасты |
| `PostVideoLink` | Кнопка внешнего видео |
| `PodcastDropdown`, `PodcastIcon` | Выпадающий список подкастов |
| `PostAuthor` | Карточка автора |
| `PostCategories` | Категории поста |
| `PostTags` | Теги поста |
| `PostSimilarList` | Похожие посты по тегам |
| `PostSocialShare` | Кнопки «поделиться» |
| `PostComments` | Ссылка на обсуждение |
| `PostDonateLink` | Призыв поддержать блог |
| `PostFooter` | Весь подвал поста целиком |

## Навигация и оформление

| Компонент | Назначение |
| --- | --- |
| `NeptuBreadcrumbs` | Хлебные крошки ([пример](categories-and-tags#хлебные-крошки)) |
| `PageFindSearch` | Модалка поиска |
| `NavSearchButton` | Кнопка вызова поиска |
| `SwitchLang`, `LocaleSelector` | Переключение локали |
| `SwitchAppearance` | Переключатель светлой / тёмной темы |
| `ColorThemePicker` | Выбор цветовой схемы |
| `StylePresetPicker` | Выбор стилевого пресета |
| `TocAside`, `TocCollapsible`, `TocLinks` | Оглавление статьи |

## Composables

```ts
import { useUiTheme, useBreakpoint } from 'vitepress-theme-neptu/composables'
```

| Composable | Описание |
| --- | --- |
| `useUiTheme()` | Типизированный доступ к объединённому `themeConfig` |
| `useTranslations()` | Строки `t` текущей локали |
| `useContentLangs()` | Текущая локаль и список доступных |
| `useBreakpoint()` | Реактивные проверки mobile / tablet / desktop |
| `useScrollY()` | Реактивный `window.scrollY` |
| `useToTheTop()` | Логика показа кнопки «наверх» |
| `useToc()` | Заголовки страницы для своего оглавления |
| `useLightbox()` | Управление лайтбоксом изображений |
| `useSwipeDrawer()` | Свайп-жесты мобильного сайдбара |
| `useOnClickOutside()` | Клик вне элемента |
| `useColorTheme()` | Чтение и смена цветовой схемы |
| `useStylePreset()` | Чтение и смена стилевого пресета |
| `useConsent()` | Согласие на куки — см. [Согласие и аналитику](consent-and-analytics) |
| `useDownloadFile()` | Логика скачивания для своих кнопок |

## Утилиты

```ts
import { isPost, resolvePreviewText } from 'vitepress-theme-neptu/utils'
```

| Утилита | Описание |
| --- | --- |
| `isPost(frontmatter)` | `true` для постов (`layout: post` или без layout) |
| `isPage(frontmatter)` | `true` для `layout: page` |
| `isUtilPage(frontmatter)` | `true` для `util`, `tag`, `category`, `archive`, `author` |
| `isHomePage(frontmatter)` | `true` для `layout: home` |
| `resolvePreviewText(frontmatter)` | Текст превью по правилам темы |
| `resolveBodyMarker(theme, frontmatter)` | Маркер тела для Pagefind |
| `isPopularRoute(path, theme)` | Маршрут списка популярных |
| `isAuthorPage(filePath, siteConfig)` | Путь страницы автора |

Функции, работающие с файловой системой, вынесены отдельно:
`vitepress-theme-neptu/utils/node` доступен только в конфиге и сборочных
скриптах, `…/utils/client` — только в браузере.

## Хелперы списков

`vitepress-theme-neptu/list-helpers` — то, чем пользуются страницы-шаблоны:
`makeTagsList`, `makeCategoriesList`, `makePostsOfTagList`,
`makePostsOfCategoryList`, `makeTagsParams`, `makeCategoriesParams` и их общие
формы `makeTaxonomy*`. Ветка `…/list-helpers/node` содержит
`loadPostsDataFromFiles` для собственных data-лоадеров — см. [Внешний
контент](external-content).
