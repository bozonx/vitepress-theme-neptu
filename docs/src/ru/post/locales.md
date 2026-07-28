---
title: Локали и мультиязычность
description: Модель локалей темы — маршрутизация, встроенные переводы, переключение языка и сопоставление переведённых страниц.
date: 2025-04-20T09:00:00Z
authorId: ivan-k
tags:
  - i18n
  - guide
---

# Локали и мультиязычность

Тема изначально спроектирована мультиязычной. Поддерживаются как короткие, так и
дефисные локали: `en`, `ru`, `en-US`, `en-GB`, `pt-BR`, `zh-CN`.

## Термины

### Локаль

В теме единое понятие локали, управляющее и контентом, и интерфейсом.
Оно определяется URL и папкой контента:

```text
src/
  en/
  ru/
  en-US/
```

Тема всегда использует маршрутизацию с префиксом локали. Даже одноязычный сайт
хранит контент в папке локали, например `src/en/`.

Когда пользователь находится на `/ru/post/hello`, дерево контента, метаданные языка
страницы, альтернативные ссылки и все строки интерфейса берутся из локали `ru`.

Отдельного «UI-локаль» в `localStorage` или переключателя в верхней панели нет.

## Основные правила

### 1. Локаль определяется из URL

Текущая локаль извлекается из маршрута.

Примеры:

- `/en/post/hello` → локаль `en`
- `/en-GB/post/hello` → локаль `en-GB`
- `/ru/page/about` → локаль `ru`

URL — источник истины.

### 2. Префикс локали всегда включён

Тема не поддерживает отключение мультиязычной маршрутизации. Внутренние ссылки
всегда разрешаются относительно текущей локали.

## Поведение при первом посещении

Когда пользователь открывает `/`, сайт определяет предпочтительную локаль и
перенаправляет на главную страницу локали.

Порядок разрешения:

1. Точное совпадение языка браузера с поддерживаемыми локалями.
2. Совпадение базового языка (часть до `-`).
3. Локаль по умолчанию, заданная сайтом.

Примеры:

- `navigator.language = en-GB`, поддерживается `en-GB` → перенаправление на `/en-GB/`
- `navigator.language = en-US`, поддерживается `en`, но не `en-US` → перенаправление на `/en/`
- ничего не совпало → перенаправление на локаль по умолчанию

## Встроенные переводы

Тема поставляет встроенные переводы для локалей в
`src/configs/blogLocalesBase/<locale>.ts` (включая `en`, `ru`, `es`, `zh`, `sr`, `pt`,
`fr`, `de`, `tr`, `ja`, `ko`, `it`, `pl`, `lv`, `nl`, `sv`, `cs`, `hi`, `th`, `he`, `ar`).
Каждый файл — `LocaleDefinition` с `themeConfig` (UI-подписи: `langMenuLabel`,
`sidebarMenuLabel`) и `t` (строки переводов).

Правило разрешения для встроенного слоя:

1. Точное совпадение ключа с текущей локалью (например `en-GB`, `es-419`, `zh-CN`).
2. Совпадение базового языка — часть до `-` (например `en` для `en-GB`).
3. Специальный региональный fallback (например `es-*` → `es-419`, `zh-*` → `zh-CN`).
4. Встроенный английский fallback `en`.

## Строки переводов от администратора

Администраторы переопределяют строки переводов через `themeConfig.t` на любом
уровне: `config.ts`, `site.yaml` (кросс-локальный) или `_site.yaml` (для одной
локали). Deep-merge: указываются только нужные ключи, остальные наследуются из
встроенного слоя.

```yaml
# src/ru/_site.yaml
themeConfig:
  langMenuLabel: 'Сменить язык'
  t:
    search: 'Поиск по блогу'
    links:
      donate: 'Поддержать'
```

### Полный список ключей `t`

**Строковые ключи верхнего уровня:**

| Ключ | Значение по умолчанию (en) |
| --- | --- |
| `popularPosts` | Popular Posts |
| `similarPosts` | Similar Posts |
| `shareSocialMedia` | Share on Social Media |
| `currentLang` | Current language |
| `tagBadgeCount` | The number of posts on this tag |
| `tagPageHeader` | All Posts by Tag |
| `tags` | Tags |
| `allTags` | All Tags |
| `paginationToStart` | First Page |
| `paginationToEnd` | Last Page |
| `toHome` | Go to the home page |
| `toBlog` | Go to blog |
| `author` | Author |
| `year` | Year |
| `showMorePosts` | Load More |
| `listenPodcast` | Listen to podcast |
| `commentLink` | Discuss this post |
| `allTagsCall` | View All Tags |
| `popularPostsCall` | View All Popular Posts |
| `viewInAnotherLanguage` | View in another language |
| `postVideoButton` | Watch Video |
| `allPostsOfAuthor` | Posts of the author |
| `closeMenu` | Close menu |
| `allPostsOfYear` | All posts of the year |
| `pageNotFound` | 404 not found |
| `postsCount` | Publications |
| `editLink` | Found an error? Suggest an edit |
| `search` | Search |
| `searchInBlog` | Search in this blog |

**`postsCountForms`** — массив форм множественного числа. Английский: `['Publication', 'Publications']` (2 формы). Русский: `['статья', 'статьи', 'статей']` (3 формы).

**`months`** — массив из 12 названий месяцев, с января по декабрь.

**`links`** — подписи навигации и сайдбара: `aboutBlog`, `donate`, `recent`, `popular`, `byDate`, `links`, `authors`, `aboutUs`, `rssFeed`, `atomFeed`.

**`podcasts`** — подписи платформ подкастов: `site`, `rss`, `castbox`, `soundstream`, `spotify`, `youtube`, `amazonmusic`, `iheartradio`, `tunein`, `vk`, `yandexmusic`, `deezer`, `pocketcasts`, `applepodcasts`, `overcast`, `zvuk`, `podcastaddiction`.

**`audioFile`** — подписи аудиоплеера: `downloadFile`, `playAudio`, `pauseAudio`, `startAudioPlayback`, `pauseAudioPlayback`, `resumeAudioPlayback`, `stopAudio`, `stopAudioPlayback`, `hidePlayer`, `hidePlayerTitle`, `audioFile`, `downloadAudioFile`, `currentTime`, `audioProgress`, `volumeControl`, `volumePercent`, `retryWithValidUrl`, `retry`, `invalidUrlProvided`, `invalidAudioUrlProvided`, `errorDownloadingFile`, `errorPlayingAudioFile`, `audioPlaybackAborted`, `networkErrorLoadingAudio`, `audioDecodingError`, `audioFormatNotSupported`, `unknownAudioError`, `errorLoadingAudioFile`.

**`fileDownload`** — подписи скачивания файлов: `fileDownload`, `downloadFile`, `downloadFileWithName`, `fileType`, `fileSize`, `downloadStarted`, `downloadError`, `invalidUrlProvided`, `retryDownload`, `retry`.

**`videoFile`** — подписи видеоплеера: `downloadFile`, `videoFile`, `downloadVideoFile`, `retry`, `videoPlaybackAborted`, `networkErrorLoadingVideo`, `videoDecodingError`, `videoFormatNotSupported`, `unknownVideoError`, `errorLoadingVideoFile`.

**`lightbox`** — подписи лайтбокса изображений: `prev`, `next`, `close`, `resetZoom`, `dialogTitle`, `loadingIndicatorLabel`.

Полные значения по умолчанию для каждой локали — в `src/configs/blogLocalesBase/<locale>.ts` и `src/configs/sharedLocalesBase/<locale>.ts`. В стартовом шаблоне [`src/site.yaml`](https://github.com/bozonx/vitepress-theme-neptu/tree/main/packages/blog/template/src/site.yaml) все ключи закомментированы как справочник.

## Переключение языка

Переключатель языка в верхней панели (`SwitchLang.vue`) переключает **контент-локаль**:
он переводит пользователя на ту же страницу в дереве другой локали.

### Сопоставление переведённых страниц

Тема поддерживает два способа сопоставления переведённых версий одной страницы.

Приоритет:

1. Явный `frontmatter.translations`.
2. Fallback на тот же относительный путь в другой локали.

#### 1. Явные переводы в frontmatter

Когда `translations` задан, он используется как источник истины:

```yaml
---
title: Привет, мир
translations:
  en: /en/post/hello-world
  'en-US': /en-US/post/hello-world
  'pt-BR': /pt-BR/artigos/ola-mundo
---
```

Это позволяет:

- разные локализованные slug'и
- разную структуру папок для локалей
- явное исключение некоторых локалей для конкретной страницы

#### 2. Fallback по относительному пути

Если `frontmatter.translations` не задан, тема сохраняет тот же относительный путь,
заменяя только сегмент локали:

```text
en/post/hello-world.md
ru/post/hello-world.md
de/post/hello-world.md
```

Этот fallback предполагает, что переведённые страницы используют то же имя файла
и ту же структуру папок в каждом дереве локали. Локализованные slug'и с разными
именами файлов не поддерживаются в этом режиме.

## Форматирование

При необходимости форматирования по локали браузера тема использует тег `lang`
страницы, а не ключ папки контента.

Примеры:

- форматирование дат использует разрешённый `lang` страницы
- SEO-теги используют значение `lang` локали, где доступно
