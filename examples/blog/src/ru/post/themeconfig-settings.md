---
title: Настройки themeConfig — 2 и 3 уровень конфигурации
description: >
  Все не системные настройки themeConfig второго и третьего уровня: навигация,
  сайдбар, футер, подвал поста, оглавление, иконки и переводы. Остальные
  параметры вынесены в отдельные статьи.
authorId: ivan-k
date: 2026-08-04
category: { name: 'Настройка', slug: 'configuration' }
tags: [config]
descrAsPreview: true
---

Здесь описываются настройки `themeConfig`, которые задаются в `site.yaml`
(уровень 2) и `_site.yaml` (уровень 3).
Системные настройки и общая схема уровней — в [Уровни конфигурации, конфиг первого уровня и шаблоны строк](config-layers).

Часть параметров описана в отдельных статьях:

| Параметр | Где описан |
| --- | --- |
| `home` | [Домашняя страница](home-page) |
| `publisher` | [Микроразметка JSON-LD](seo-json-ld) |
| `readingTime`, `drafts` | [Черновики, время чтения, видео и подкасты](drafts-video-podcasts) |
| `postList` | [Списки, страницы](lists-and-pages#карточки-постов-в-списках) |
| `socialMediaShares` | см. раздел [Кнопки «поделиться»](#кнопки-поделиться) ниже |
| `feeds` | [SEO-механизмы](seo-features) |
| `seo`, `twitterSite` | [SEO — обзор и механизмы](seo-features) |
| `search` | [Поиск Pagefind](search-pagefind) |
| `popularPosts` | [Популярные посты через GA4](popular-posts) |
| `defaultColorTheme`, `defaultStylePreset`, `colorPicker`, `stylePicker` | [Кастомизация](customization) |
| `i18nRouting` | [Локали и мультиязычность](locales) |
| `perPage`, `repo` | [Уровни конфигурации](config-layers) |
| `paginationMaxItems` | [Списки, страницы](lists-and-pages) |
| Стили (CSS-переменные) и слоты | [Кастомизация](customization) |

## Параметры 2го и 3го уровня

Ниже — полный пример конфигурации обоих уровней. Поля, разобранные в отдельных
статьях, закомментированы со ссылкой. Расширенные пояснения к каждой секции —
в разделах ниже.

### Уровень 2 — `src/site.yaml`

```yaml
# yaml-language-server: $schema=../node_modules/vitepress-theme-neptu/schema/site.schema.json

themeConfig:
  # --- Общие ---
  externalLinkIcon: true  # иконка ↗ на внешних ссылках в markdown (по умолчанию true)

  # → см. Кастомизация (customization)
  # defaultColorTheme: 'blue'     # blue | green | purple | amber | teal | rose | magenta | monochrome
  # defaultStylePreset: 'soft'    # soft | sharp | brutal | glass | editorial | mono
  # colorPicker: false            # переключатель тем в UI (по умолчанию выключен)
  # stylePicker: false            # переключатель стилей в UI (по умолчанию выключен)

  # → см. Локали и мультиязычность (locales)
  # i18nRouting: true             # редирект на язык посетителя при наличии перевода

  # → см. Уровни конфигурации (config-layers) — задаются в config.ts
  # perPage: 15
  # repo: 'https://github.com/user/repo'

  # --- Главная страница ---
  # → см. Домашняя страница (home-page)
  # home:
  #   appearance: auto            # auto | light | dark
  #   maxWidth: 800
  #   background:
  #     type: none                # none | parallax
  #     # image: /img/home.jpg
  #     # parallaxOffset: 300
  #   # hero: ...                 # тексты hero — в _site.yaml (локализованные)
  #   sections:
  #     - type: featured
  #       enabled: true
  #       # limit: 3
  #     - type: latest
  #       enabled: false
  #     - type: popular
  #       enabled: false
  #     - type: tags
  #       enabled: true
  #     - type: categories
  #       enabled: true

  # --- Сайдбар ---
  sidebar:
    # Логотип над навигацией
    # logoSrc: '/img/sidebar-logo.webp'   # строка — одна картинка для обеих тем
    # logoSrc:                            # объект — разные файлы для light/dark
    #   light: '/img/logo-light.svg'
    #   dark: '/img/logo-dark.svg'
    #   alt: 'Название блога'
    # logoHeight: 180                     # высота в px для резервирования места (по умолчанию 158)

    # Флаги секций (все по умолчанию false)
    recent: true
    featured: true          # посты с featured: true в frontmatter
    popular: false          # требует popularPosts.enabled
    archive: true           # по годам → месяцам
    authors: true
    tags: true              # облако тегов
    categories: true        # облако категорий (по умолчанию false)
    donate: true
    rssFeed: true
    atomFeed: true

    # blogTitle: 'Мой блог'  # заголовок сайдбара; false — скрыть (обычно в _site.yaml)
    # links:                 # свои ссылки над секциями (обычно в _site.yaml — локализованные)
    #   - text: 'Главная'
    #     href: '/'
    #     icon: 'fa6-solid:house'
    # bottomLinks:           # ссылки внизу сайдбара (обычно в _site.yaml)
    #   - { header: '${t.links.links}' }
    #   - text: 'YouTube'
    #     href: 'https://youtube.com/'
    #     icon: '${theme.youtubeIcon}'
    socialLinks:            # иконки соцсетей
      - icon: 'fa6-brands:github'
        link: '${theme.repo}'

  # --- Верхняя панель (nav) ---
  nav:
    donate: true            # кнопка «Поддержать» (нужен donate.url)
    # links:                # ссылки навигации (обычно в _site.yaml — локализованные)
    #   - text: 'О блоге'
    #     href: 'page/about'
    #     icon: 'solar:document-linear'
    #     desktopOnly: true  # скрывать на мобильных
    #     mobileOnly: false  # только на мобильных
    socialLinks:
      - icon: 'fa6-brands:github'
        link: '${theme.repo}'
        desktopOnly: true

  # --- Кнопка «Поддержать» (donate) ---
  donate:
    url: 'page/donate'      # обязательный — без него кнопок не будет
    # icon: 'fa6-solid:hand-holding-heart'  # по умолчанию donateIcon
    # postDonateCall: 'Поддержите блог'     # текст призыва под статьёй (обычно в _site.yaml)

  # --- Ссылка «Редактировать» (editLink) ---
  # pattern авто-генерируется из repo; переопределяйте только для нестандартной ветки/пути
  editLink:
    # pattern: 'https://github.com/user/repo/edit/main/src/:path'
    # text: 'Редактировать на GitHub'  # обычно в _site.yaml

  # --- Подвал поста (postFooter) ---
  # Массив заменяется целиком между уровнями — в _site.yaml нужно перечислять полностью
  postFooter:
    - author        # карточка автора (нужен authorId)
    - donate        # призыв поддержать (нужен donate.url)
    - comments      # ссылка на обсуждение (нужен commentLink)
    - social-share  # кнопки «поделиться»
    - edit-link     # «Редактировать» (нужен repo)
    - categories    # категории поста
    - tags          # теги поста
    - navigation    # предыдущий / следующий пост
    - similar       # похожие посты

  # --- Числовые параметры списков и сайдбара ---
  # sidebarTagsCount: 15       # максимум тегов в облаке сайдбара
  # sidebarCategoriesCount: 10 # максимум категорий до ссылки «Все категории»
  # similarPostsCount: 5       # количество похожих постов в подвале
  # → см. Списки, страницы (lists-and-pages)
  # paginationMaxItems: 5      # максимум кнопок пагинации

  # --- Футер сайта (footer) ---
  # message, copyright, links — локализованные, обычно в _site.yaml
  # Общие для всех локалей — только иконки:
  # footer:
  #   rssFeed: true
  #   atomFeed: true
  #   github: true             # использует repo из config.ts

  # --- Иконки (переопределение умолчаний, Iconify) ---
  # donateIcon: 'fa6-solid:hand-holding-heart'
  # recentIcon: 'fa6-solid:bolt'
  # featuredIcon: 'fa6-solid:certificate'
  # popularIcon: 'fa6-solid:star'
  # byDateIcon: 'fa6-solid:calendar-days'
  # authorsIcon: 'mdi:users'
  # rssIcon: 'bi:rss-fill'
  # atomIcon: 'vscode-icons:file-type-atom'
  # youtubeIcon: 'fa6-brands:youtube'
  # tagsIcon: 'fa6-solid:tag'
  # categoriesIcon: 'fa6-solid:folder-open'

  # --- Оглавление (toc) ---
  toc:
    # enabled: true
    minHeadings: 3          # не показывать при меньшем числе заголовков; 0 — отключить порог
    position: auto          # auto | aside | top
    collapsed: true         # стартовое состояние сворачиваемого блока на узких экранах
    level: [2, 3]           # уровни заголовков: число, [min, max] или 'deep'
    layouts: ['post']       # на каких макетах показывать
    # label: 'Содержание'   # заголовок оглавления (обычно в _site.yaml)

  # --- Правая колонка (asideLayouts) ---
  # Макеты, у которых есть правая колонка. Заменяет умолчание целиком.
  # Колонка видна только от 1550px ширины окна.
  # asideLayouts: ['post', 'util', 'tag', 'archive', 'author']

  # --- Параметры из других статей ---
  # → см. Микроразметка JSON-LD (json-ld)
  # publisher:
  #   name: 'My Blog'
  #   url: 'https://example.com'
  #   logo: '/img/logo.png'

  # → см. Списки, страницы (lists-and-pages#карточки-постов-в-списках)
  # postList:
  #   showDate: true
  #   showTags: true
  #   showThumbnail: true
  #   showPreview: true
  #   showAuthor: true
  #   showReadingTime: false
  #   maxPreviewLength: 300

  # → см. Черновики, время чтения, видео и подкасты (drafts-video-podcasts)
  # readingTime:
  #   enabled: true
  #   wpm: 200
  #   layouts: ['post']
  # drafts:
  #   showDrafts: false       # true в dev, false в build

  # → см. раздел «Кнопки поделиться» ниже
  # socialMediaShares:
  #   - name: x
  #     icon: 'fa6-brands:x-twitter'
  #     title: 'Share on X'
  #     urlTemplate: 'https://twitter.com/intent/tweet?url={url}&text={title}'
  #   - name: vk
  #     enabled: false         # скрыть встроенную кнопку
  # feeds:
  #   maxPosts: 50
  #   formats: ['rss', 'atom', 'json']
  #   fullContent: false       # полный HTML в элементах ленты
  # seo:
  #   og: true
  #   jsonLd: true
  #   hreflang: true
  #   canonical: true
  #   autoCanonical: true
  #   rss: true
  #   maxDescriptionLength: 300
  # twitterSite: 'myblog'     # @handle для SEO-мета
  # search:
  #   enabled: true            # Pagefind, бандлится с темой
  # popularPosts:
  #   enabled: false           # по умолчанию выключен; без данных GA4 списки пустые
  #   sortBy: 'pageviews'      # pageviews | uniquePageviews | avgTimeOnPage
  #   dataSource:
  #     provider: 'ga4'
  #     propertyId: null
  #     credentialsJson: null
  #     dataPeriodDays: 30
  #     dataLimit: 100

  # → см. Реклама (ads)
  # ads:
  #   enabled: true

  # → см. Consent и аналитика (consent-and-analytics)
  # consent:
  #   ...

  # → см. Переводы интерфейса и страница выбора языка (i18n-translations) — полный справочник ключей t
  # t:
  #   popularPosts: 'Популярное'
  #   similarPosts: 'Похожие посты'
  #   postsCountForms: [пост, поста, постов]  # формы множественного числа
  #   links:
  #     donate: 'Поддержать'
  #     aboutBlog: 'О блоге'
```

### Уровень 3 — `src/<locale>/_site.yaml`

```yaml
# yaml-language-server: $schema=../../node_modules/vitepress-theme-neptu/schema/site.schema.json

# --- Поля локали (не themeConfig) ---
lang: 'ru-RU'
# label: 'Русский'             # только для языков без встроенного перевода
title: 'Мой блог'              # заголовок вкладки, SEO, сайдбар
# titleTemplate: ':title | ${site.title}'
description: 'Описание блога для SEO и лент'
# extends: 'ru'                # наследовать конфиг от другой локали

themeConfig:
  # --- Локализованные тексты главной страницы ---
  # → см. Домашняя страница (home-page)
  # home:
  #   hero:
  #     title: 'Добро пожаловать'
  #     description: 'Описание блога'
  #     image: '/img/hero.png'           # строка, { src, alt } или { light, dark, alt }
  #     actions:
  #       - text: 'Все посты'
  #         href: 'recent/1'
  #         primary: true                # заполненная кнопка акцентного цвета

  # --- Локализованные надписи сайдбара ---
  sidebar:
    # blogTitle: 'Мой блог'    # false — скрыть
    # links:                   # ссылки над секциями
    #   - text: '${t.links.recent}'
    #     href: 'recent/1'
    #     icon: '${theme.recentIcon}'
    # bottomLinks:             # ссылки внизу
    #   - { header: '${t.links.links}' }
    #   - text: 'О блоге'
    #     href: 'page/about'
    #     icon: 'mdi:information-outline'

  # --- Локализованная навигация ---
  nav:
    # links:
    #   - text: 'О блоге'
    #     href: 'page/about'
    #     icon: 'solar:document-linear'

  # --- Локализованный футер сайта ---
  footer:
    message: 'Копирование со ссылкой на источник.'
    copyright: '© 2026 Ваше Имя'
    # rssFeed: true            # иконки в футере
    # atomFeed: true
    # github: true
    links:
      - text: '${t.links.aboutBlog}'
        href: 'page/about'

  # --- Локализованный призыв к донату ---
  donate:
    # postDonateCall: 'Если статья полезной оказалась — поддержите блог.'

  # --- Локализованная подпись ссылки на правку ---
  editLink:
    text: 'Редактировать на GitHub'

  # --- Локализованный заголовок оглавления ---
  # toc:
  #   label: 'Содержание'

  # --- Локализованные переводы UI ---
  # → см. Переводы интерфейса и страница выбора языка (i18n-translations) — полный справочник ключей
  # t:
  #   search: 'Поиск по блогу'
  #   previousPost: 'Ранее'
  #   nextPost: 'Далее'
  #   draftLabel: 'Черновик'
  #   links:
  #     donate: 'Поддержать'
  #     aboutBlog: 'О блоге'

  # --- Локализованные UI-подписи (aria-labels, tooltips) ---
  # → см. Переводы интерфейса и страница выбора языка (i18n-translations)
  # sidebarMenuLabel: 'Меню'
  # colorThemeMenuLabel: 'Тема'
  # langMenuLabel: 'Язык интерфейса'
  # stylePresetMenuLabel: 'Стиль'
  # returnToTopLabel: 'Наверх'
  # lightModeSwitchTitle: 'Светлая тема'
  # darkModeSwitchTitle: 'Тёмная тема'
  # notFound:
  #   title: 'Страница не найдена'
  #   linkText: 'На главную'

  # → см. Авторы (authors) — обычно в _authors.yaml, можно инлайн
  # authors:
  #   - id: ivan-k
  #     name: 'Иван К.'
  #     image: /authors/ivan.jpg
  #     imageWidth: 400
  #     imageHeight: 200
  #     description: 'Технический писатель'
  #     twitterHandle: ivan_k
  #     links:
  #       - type: twitter
  #         url: 'https://twitter.com/ivan_k'
  #         title: 'Иван в Twitter'
```





## Навигация, сайдбар и футер

### Верхняя панель (`nav`)

Панель в самом верху. Содержит произвольные ссылки, иконки соцсетей, кнопку
«Поддержать», кнопку поиска, переключатель языка и переключатель темы оформления.

```yaml
# src/<locale>/_site.yaml
themeConfig:
  nav:
    donate: true            # показывать кнопку «Поддержать» в панели (нужен donate.url)
    links:
      - text: 'Внешняя ссылка'
        href: 'https://example.org/'
        icon: 'solar:document-linear'
        desktopOnly: true   # скрывать на мобильных (где работает сайдбар)
    socialLinks:
      - icon: 'fa6-brands:github'
        link: '${theme.repo}'
```

Каждая ссылка поддерживает параметры `icon`, `iconClass`, `class`, а также флаги видимости
`desktopOnly` / `mobileOnly`.

### Сайдбар

Включайте или отключайте встроенные секции и добавляйте свои группы ссылок:

```yaml
themeConfig:
  sidebar:
    blogTitle: 'Мой блог'  # заголовок сайдбара; false — скрыть
    recent: true
    featured: true   # посты с featured: true
    popular: true    # требуется popularPosts.enabled (по умолчанию выключен)
    archive: true    # по годам → месяцам
    authors: true
    tags: true       # облако тегов
    categories: true # облако категорий (по умолчанию выключено)
    donate: true
    rssFeed: true
    atomFeed: true
    links:           # свои ссылки над встроенными секциями
      - text: 'Главная'
        href: '/'
        icon: 'fa6-solid:house'
    bottomLinks:
      - { header: '${t.links.links}' }        # заголовок секции
      - text: 'Наш YouTube-канал'
        href: 'https://www.youtube.com/'
        icon: '${theme.youtubeIcon}'
      - text: 'Мы в соцсетях'
        href: 'page/links'
        icon: 'fa6-solid:share-nodes'
```

Каждый флаг включает готовую страницу-список — все они видны в сайдбаре этого
демо. Размер облаков ограничивают `sidebarTagsCount` (по умолчанию 15) и
`sidebarCategoriesCount` (10); за порогом появляется ссылка «Все теги» /
«Все категории».

#### Логотип сайдбара

Над навигацией выводится логотип — ссылка на главную страницу локали:

```yaml
# src/site.yaml
themeConfig:
  sidebar:
    logoSrc: '/img/sidebar-logo.webp'
    logoHeight: 180
```

Если для светлой и тёмной темы нужны разные файлы, вместо строки задайте объект:

```yaml
themeConfig:
  sidebar:
    logoSrc:
      light: '/img/logo-light.svg'
      dark: '/img/logo-dark.svg'
      alt: 'Название блога'   # необязательно; по умолчанию пустой alt
    logoHeight: 180
```

В HTML попадают оба изображения, а лишнее скрывается стилями по классу `.dark`,
который VitePress выставляет до первой отрисовки. Поэтому при загрузке
страницы не мелькает логотип не от той темы. Классы `.sidebar-logo-light` и
`.sidebar-logo-dark` появляются только в объектной форме — обычная строка
по-прежнему даёт одну картинку без классов.

`logoSrc` и `logoHeight` живут внутри секции `sidebar` — рядом с флагами
видимости секций и навигационными ссылками.

Пути, начинающиеся с `/`, автоматически дополняются значением `base`.
В RSS-ленту попадает светлый вариант: у читалки нет своей темы оформления.

### Футер

```yaml
themeConfig:
  footer:
    message: 'Копирование разрешено только со ссылкой на источник.'
    copyright: 'Copyright © 2026 Your Name.'
    links:
      - text: '${t.links.aboutBlog}'
        href: 'page/about'
```

Если нужен не набор ссылок, а собственная вёрстка футера, встроенный футер
заменяется целиком через слот `footer` — см. [Кастомизация](customization#кастомизация-футера-сайта).

## Иконки

Каждое поле `icon:` принимает строку [Iconify](https://icones.es) вида `prefix:name`,
например `fa6-solid:hand-holding-heart`. Иконки по умолчанию («Поддержать», свежие,
популярное, RSS и т.д.) можно переопределить глобально в `src/site.yaml`:

```yaml
themeConfig:
  donateIcon: 'fa6-solid:hand-holding-heart'
  recentIcon: 'fa6-solid:bolt'
  featuredIcon: 'fa6-solid:certificate'
  popularIcon: 'fa6-solid:star'
  byDateIcon: 'fa6-solid:calendar-days'
  authorsIcon: 'mdi:users'
  tagsIcon: 'fa6-solid:tag'
  categoriesIcon: 'fa6-solid:folder-open'
  rssIcon: 'bi:rss-fill'
  atomIcon: 'vscode-icons:file-type-atom'
```

## Внешние ссылки в контенте постов

К внешним ссылкам внутри вашей markdown-разметки (не в навигации) по умолчанию
добавляется иконка перехода, чтобы читатели видели уход с сайта. Эту иконку можно отключить глобально:

```yaml
# src/site.yaml
themeConfig:
  externalLinkIcon: true   # установите false, чтобы убрать иконку ↗ на внешних ссылках
```

Под капотом тема открывает внешние ссылки в новой вкладке (`target="_blank"`).
Если вам нужно изменить атрибут `rel` (VitePress добавляет `rel="noreferrer"` по умолчанию),
переопределите `markdown.externalLinks` в `.vitepress/config.ts`:

```ts
markdown: {
  externalLinks: { target: '_blank', rel: [] }, // например, убрать rel="noreferrer"
}
```

## Относительные URL подстраиваются под локаль

Относительный `href`, такой как `page/about`, автоматически дополняется префиксом текущей
локали (`/en/page/about`, `/ru/page/about`). Для внешних ссылок используйте абсолютные URL (`https://…`).

---

## Подвал поста

Прокрутите к нижней части этой страницы — весь набор блоков подвала работает
там вживую: **карточка автора**, **ссылка на обсуждение**, **кнопки шеринга**,
**ссылка на редактирование**, **категории и теги**, хронологическая
**навигация** и список **похожих постов**.

### Состав и порядок блоков

Подвал — это упорядоченный массив имён блоков. Порядок в массиве и есть порядок
на странице; чтобы убрать блок, удалите его строку:

```yaml
# src/site.yaml
themeConfig:
  postFooter:
    - author        # карточка автора из authorId
    - donate        # призыв поддержать блог
    - comments      # кнопка commentLink
    - social-share  # кнопки «поделиться»
    - edit-link     # «Редактировать эту страницу»
    - categories    # категории поста
    - tags          # теги поста
    - navigation    # предыдущий / следующий пост
    - similar       # похожие посты
```

| Ключ | Блок | Условие показа |
| --- | --- | --- |
| `author` | Карточка автора | у поста задан `authorId` |
| `donate` | Призыв поддержать | задан `donate.url` |
| `comments` | Ссылка на обсуждение | у поста задан `commentLink` |
| `social-share` | Кнопки «поделиться» | есть включённые сети |
| `edit-link` | Ссылка на правку | задан `repo` |
| `categories` | Категории поста | у поста есть категория |
| `tags` | Теги поста | у поста есть теги |
| `navigation` | Предыдущий / следующий | есть соседний пост |
| `similar` | Похожие посты | нашлись посты с общими тегами |

Массив заменяется целиком между уровнями конфигурации, поэтому в
`_site.yaml` его нужно перечислять полностью, а не дописывать. Список можно
задать и для одной локали — например, чтобы в другом языке блок шеринга шёл
выше.

Для `edit-link` достаточно задать `themeConfig.repo` в `.vitepress/config.ts` —
адрес правки тема соберёт сама для GitHub, GitLab, Bitbucket, Gitea, Forgejo и
Codeberg. `editLink.text` меняет только подпись, `editLink.pattern` нужен лишь
для нестандартной ветки или пути к исходникам.

### Кнопки «поделиться»

Блок `social-share` в подвале поста выводит кнопки шерингa соцсетей. Каждая
локаль приносит свой готовый набор — для русской это Telegram, WhatsApp, VK, X,
Facebook и LinkedIn. Они работают без настройки.

Список из `site.yaml` и `_site.yaml` **объединяется со встроенным по ключу
`name`**, а не заменяет его. Из этого следуют три приёма:

```yaml
# src/site.yaml
themeConfig:
  socialMediaShares:
    # 1. Поменять оформление встроенной кнопки — совпало имя, поля перекрылись
    - name: telegram
      icon: 'logos:telegram'
      title: 'Телеграм'

    # 2. Добавить свою сеть — новое имя дописывается в конец
    - name: bluesky
      icon: 'simple-icons:bluesky'
      title: 'Bluesky'
      urlTemplate: 'https://bsky.app/intent/compose?text={title}%20{url}'

    # 3. Убрать встроенную кнопку
    - name: vk
      enabled: false
```

Поля записи:

| Поле | Описание |
| --- | --- |
| `name` | Ключ объединения — по нему запись находит встроенную |
| `icon` | Имя иконки [Iconify](https://icones.es), например `logos:telegram` |
| `title` | Подпись и tooltip |
| `urlTemplate` | Ссылка шеринга с плейсхолдерами `{url}` и `{title}` |
| `class` | Необязательные CSS-классы кнопки |
| `enabled` | `false` скрывает кнопку, не удаляя её из конфигурации |

`{url}` и `{title}` подставляются из текущей страницы. UTM-метки пишутся прямо в
шаблон:

```yaml
urlTemplate: 'https://x.com/intent/tweet?text={title}&url={url}%3Futm_source%3Dshare'
```

::: warning Пустой массив не скрывает блок
`socialMediaShares: []` не выключает шеринг: пустой список означает «нечего
объединять», и остаётся встроенный набор. Чтобы убрать блок, уберите
`social-share` из `postFooter` — либо пометьте каждую кнопку `enabled: false`.
:::

Порядок блоков подвала поста (включая `social-share`) задаётся массивом
`postFooter` — см. [выше](#состав-и-порядок-блоков).

### Предыдущий и следующий пост

Блок `navigation` строит хронологические переходы: **предыдущий** — более
старая публикация, **следующий** — более новая. У самой первой и самой
последней статьи выводится только одна ссылка. За пределы текущей локали
переходы не выходят, черновики в цепочку не попадают.

Подписи задаются переводами:

```yaml
# src/<локаль>/_site.yaml
themeConfig:
  t:
    previousPost: Ранее
    nextPost: Далее
```

`navigation` и `similar` решают разные задачи и хорошо работают вместе: первый
ведёт по времени, второй — по смыслу.

### Похожие посты

Блок `similar` подбирает статьи с общими тегами — настраивать его для каждого
поста не нужно. Чем больше совпавших тегов, тем выше пост в списке:

```yaml
# src/site.yaml
themeConfig:
  similarPostsCount: 5
```

Полная замена подвала — через слот `post-footer` или именованные слоты
отдельных блоков — описана в [Кастомизация](customization#кастомизация-подвала-поста).

---

## Оглавление и правая колонка

Правая колонка макета поста — третья колонка справа от текста. В ней живёт
оглавление статьи, а под ним — всё, что вы туда положите: [рекламный
блок](ads), форма подписки, промо.

### Как устроена колонка

Колонка появляется **только с ширины окна 1550px**. Порог высокий не случайно:
боковое меню занимает 320px, а колонка текста — до 840px, так что даже на
1280px третьей колонке уже негде поместиться, не сжимая статью.

Ниже порога ничего не теряется — у каждого блока есть запасное место:

| Блок | ≥ 1550px | Уже |
| --- | --- | --- |
| Оглавление | правая колонка, липкое | сворачиваемый блок над статьёй |
| Реклама | правая колонка | блоки внутри текста и под статьёй |
| Слот `aside` | правая колонка | не показывается |

Внутри колонка прилипает при прокрутке (`position: sticky`), ширина по
умолчанию — **300px**, стандартный размер рекламного баннера. Если показывать
нечего, колонка не рендерится вовсе — статья занимает всю ширину, пустое место
не резервируется.

### Оглавление

Оглавление строится из заголовков страницы автоматически: ничего писать в
markdown не нужно. По умолчанию оно включено **только в постах** — на страницах
тегов, архива и авторов навигировать нечего, а `layout: page` обычно короткая
самостоятельная страница, где оглавление выглядит шумом.

#### Порог по количеству заголовков

Оглавление из двух пунктов пересказывает структуру статьи, но никому не
помогает по ней перемещаться — оно читается как элемент оформления, а не как
инструмент. Поэтому по умолчанию оглавление **не показывается, если заголовков
меньше трёх**:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    toc: {
      minHeadings: 3, // по умолчанию; 0 отключает порог
    },
  },
})
```

Это и есть ответ на «а если в статье всего пара заголовков» — такая статья
просто не получит оглавления, и специально сворачивать его не нужно.

#### Где показывать

Параметр `position` управляет тем, как оглавление ведёт себя на разной ширине:

| Значение | Поведение |
| --- | --- |
| `auto` (по умолчанию) | колонка на широких экранах, сворачиваемый блок на узких |
| `aside` | только колонка; на узких экранах оглавления нет |
| `top` | только сворачиваемый блок, на любой ширине — колонка остаётся рекламе |

Сворачиваемый блок построен на `<details>`, поэтому работа с клавиатуры и
скринридерами достаётся бесплатно от браузера. По умолчанию он **закрыт**:
развёрнутое оглавление на телефоне — это экран прокрутки перед первым абзацем.

```ts
themeConfig: {
  toc: {
    position: 'auto',
    collapsed: true, // стартовое состояние сворачиваемого блока
    level: [2, 3],   // какие заголовки включать
    layouts: ['post'],
    label: 'Содержание', // иначе берётся из переводов
  },
}
```

`level` принимает те же значения, что `outline` стандартной темы VitePress:
число, пару `[min, max]` или `'deep'` (h2–h6).

#### На отдельной странице

```yaml
---
title: Длинная справочная страница
layout: page
toc: true # включить там, где по умолчанию выключено
---
```

`toc: false` работает в обратную сторону. Порог по количеству заголовков
действует и здесь: `toc: true` не покажет оглавление из одного пункта.

CSS-переменные геометрии колонки, классы для стилизации и слот `aside` — в
[Кастомизации](customization#правая-колонка-и-оглавление).

### На каких страницах есть колонка

Список макетов задаётся `asideLayouts`. По умолчанию это
`['post', 'util', 'tag', 'archive', 'author']` — то есть всё, кроме главной,
`layout: page` и страниц категорий. Список задаётся целиком и заменяет
умолчание, а не дополняет его:

```ts
// .vitepress/config.ts
themeConfig: {
  // как по умолчанию, плюс страницы категорий
  asideLayouts: ['post', 'util', 'tag', 'category', 'archive', 'author'],
}
```

Отдельная страница переопределяет список через frontmatter `aside: true` или
`aside: false`.

---

## i18n Translations

Встроенные переводы интерфейса поставляются для 21 локали (`en`, `ru`, `es`,
`zh`, `sr`, `pt`, `fr`, `de`, `tr`, `ja`, `ko`, `it`, `pl`, `lv`, `nl`, `sv`,
`cs`, `hi`, `th`, `he`, `ar`). Переопределить строки можно через `themeConfig.t`
на любом уровне конфигурации — deep-merge дополняет встроенный слой, указывайте
только нужные ключи.

```yaml
# src/ru/_site.yaml
themeConfig:
  t:
    search: 'Поиск по блогу'
    links:
      donate: 'Поддержать'
```

Полный справочник ключей `t`, формы множественного числа, вложенные группы
(`links`, `months`, `podcasts`, `audioFile`, `videoFile`, `fileDownload`,
`lightbox`) и правила разрешения локалей — в [Переводы интерфейса и страница
выбора языка](i18n-translations#строки-переводов-от-администратора).

---

## Рекомендации по уровням

Настройки `themeConfig` можно задавать на уровне 2 (`site.yaml`) или уровне 3
(`_site.yaml`). Вот что куда рекомендуется помещать.

### Уровень 2 — `site.yaml` (общее для всех локалей)

- `sidebar.*` — флаги секций (`recent`, `featured`, `popular`, `archive`, `authors`, `tags`, `categories`, `donate`, `rssFeed`, `atomFeed`)
- `sidebar.logoSrc`, `sidebar.logoHeight` — логотип сайдбара
- `donate.url`, `donate.icon` — общий адрес поддержки
- `postFooter` — порядок блоков подвала (если не отличается по локалям)
- `similarPostsCount` — количество похожих постов
- `externalLinkIcon` — иконка внешних ссылок
- Иконки по умолчанию (`donateIcon`, `recentIcon`, `featuredIcon` и т.д.)
- `toc` — настройки оглавления (порог, уровень, position)
- `asideLayouts` — список макетов с правой колонкой

### Уровень 3 — `_site.yaml` (отличия одной локали)

- `nav.links` — локализованные ссылки навигации
- `footer.message`, `footer.copyright` — локализованный текст футера
- `footer.links` — локализованные ссылки футера
- `editLink.text` — локализованная подпись ссылки на правку
- `donate.postDonateCall` — локализованный текст призыва
- `t.*` — переводы подписей (`previousPost`, `nextPost`, `draftLabel` и т.д.)
- `sidebar.blogTitle` — локализованный заголовок сайдбара
- `sidebar.links`, `sidebar.bottomLinks` — локализованные ссылки сайдбара
- `toc.label` — локализованный заголовок оглавления

Общее правило: если значение одинаковое для всех языков — оставляйте на уровне 2.
Если отличается — переопределяйте на уровне 3, указывая только то, что отличается.











## Кнопка «Поддержать»

Флаги `nav.donate` и `sidebar.donate` только показывают кнопку — куда она ведёт,
задаёт отдельная секция `donate`:

```yaml
# src/site.yaml — общий адрес для всех локалей
themeConfig:
  donate:
    url: 'page/donate'   # относительный путь дополняется локалью, либо внешний https://…
    icon: 'fa6-solid:hand-holding-heart'   # необязательно, по умолчанию donateIcon
```

```yaml
# src/<locale>/_site.yaml — текст призыва под статьёй
themeConfig:
  donate:
    postDonateCall: 'Если статья оказалась полезной — поддержите блог.'
```

Без `donate.url` кнопки не будет, даже если флаги включены. Блок под статьёй
управляется ключом `donate` в `postFooter` — см. ниже.
