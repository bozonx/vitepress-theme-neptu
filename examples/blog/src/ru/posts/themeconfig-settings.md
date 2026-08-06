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
descriptionAsPreview: true
---

Здесь описываются настройки `themeConfig`, которые задаются в `site.yaml`
(уровень 2) и `_site.yaml` (уровень 3).
Системные настройки и общая схема уровней описаны в [Уровни конфигурации, конфиг первого уровня и шаблоны строк](config-layers).

Часть параметров конфигов 2 и 3 уровней описана в отдельных статьях:

| Параметр | Где описан |
| --- | --- |
| `home` | [Домашняя страница](home-page) |
| `i18nRouting` | [Локали и мультиязычность](locales) |
| `authors` | [Авторы](authors) |
| `readingTime`, `drafts` | [Черновики, время чтения, видео и подкасты](drafts-video-podcasts) |
| `search` | [Поиск Pagefind](search-pagefind) |
| `popularPosts` | [Популярные посты через GA4](popular-posts) |
| `ads` | [Рекламные блоки](ads) |
| `consent` | [Согласие на куки и аналитика](consent-and-analytics) |
| `feeds`, `seo`, `twitterSite`  | [SEO-механизмы](seo-features) |
| `publisher` | [Микроразметка JSON-LD](seo-json-ld) |
| `paginationMaxItems`, `postList` | [Списки, страницы](lists-and-pages) |
| `defaultColorTheme`, `defaultStylePreset`, `colorPicker`, `stylePicker` | [Кастомизация](customization) |

::: tip
Пример полного конфига 2 уровня можете посмотреть [здесь](https://github.com/bozonx/vitepress-theme-neptu/blob/main/packages/blog/template/src/site.yaml)

Пример полного конфига 3 уровня можете посмотреть [здесь](https://github.com/bozonx/vitepress-theme-neptu/blob/main/packages/blog/template/src/en/_site.yaml)
:::

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
      - text: 'Только в сайдбаре'
        href: 'pages/mobile-info'
        icon: 'solar:phone-linear'
        mobileOnly: true    # скрывать на десктопе (показывать только в сайдбаре)
    socialLinks:
      - icon: 'fa6-brands:github'
        link: '${theme.repo}'
```

Поля ссылок (`text`, `href`, `icon`, `desktopOnly` и др.) описаны в [Поля ссылок](#поля-ссылок).

### Сайдбар

Включайте или отключайте встроенные секции и добавляйте свои группы ссылок:

```yaml
themeConfig:
  sidebar:
    sidebarTitle: 'Мой блог'  # заголовок сайдбара; false — скрыть
    logoSrc: '/img/sidebar-logo.webp'  # логотип над навигацией; можно объект { light, dark, alt }
    logoHeight: 180
    tagsCount: 15       # максимум тегов в облаке сайдбара
    categoriesCount: 10 # максимум категорий в облаке сайдбара
    recent: true        # Показывать ли ссылку на последние посты
    featured: true      # Показывать ли ссылку на посты с featured: true
    popular: true       # Показывать ли ссылку на популярные посты. Требуется popularPosts.enabled (по умолчанию выключен)
    archive: true       # Показывать ли ссылку на архив по годам → месяцам
    authors: true       # Показывать ли ссылку на авторов
    tags: true          # Показывать ли облако тегов
    categories: true    # Показывать ли облако категорий (по умолчанию выключено)
    donate: true        # Показывать ли ссылку на донат
    rssFeed: true       # Показывать ли ссылку на RSS-ленту
    atomFeed: true      # Показывать ли ссылку на Atom-ленту
    links:              # свои ссылки над встроенными секциями
      - text: 'Главная'
        href: '/'
        icon: 'fa6-solid:house'
        # desktopOnly: true  # скрывать на мобильных (где работает сайдбар)
        # mobileOnly: true   # скрывать на десктопе
        # mobile: true       # синоним mobileOnly (устаревший алиас)
    bottomLinks:
      - { header: '${t.links.links}' }        # заголовок секции
      - text: 'Наш YouTube-канал'
        href: 'https://www.youtube.com/'
        icon: '${theme.youtubeIcon}'
        # desktopOnly: true  # скрывать на мобильных
        # mobileOnly: true   # скрывать на десктопе
      - text: 'Мы в соцсетях'
        href: 'pages/links'
        icon: 'fa6-solid:share-nodes'
    socialLinks:
      - icon: 'fa6-brands:telegram'
        link: 'https://t.me/yourchannel'
        # desktopOnly: true  # скрывать на мобильных
        # mobileOnly: true   # скрывать на десктопе
```

Поля `links`, `bottomLinks` и `socialLinks` описаны в [Поля ссылок](#поля-ссылок).

Если для светлой и тёмной темы нужны разные логотипы, вместо строки задайте объект:

```yaml
themeConfig:
  sidebar:
    logoSrc:
      light: '/img/logo-light.svg'
      dark: '/img/logo-dark.svg'
      alt: 'Название блога'   # необязательно; по умолчанию пустой alt
    logoHeight: 180
```

Пути, начинающиеся с `/`, автоматически дополняются значением `base`.
В RSS-ленту попадает светлый вариант: у читалки нет своей темы оформления.

::: tip
Чтобы не дублировать URL в `socialLinks` или `links` вы можете задать переменную в `themeConfig` и использовать её в ссылках. Подробней в [Пользовательские поля в themeConfig](config-layers#пользовательские-поля-в-themeconfig).
:::

### Футер

```yaml
themeConfig:
  footer:
    rssFeed: true    # ссылка на RSS-ленту (по умолчанию true)
    atomFeed: true   # ссылка на Atom-ленту (по умолчанию true)
    socialLinks:     # социальные ссылки (тот же формат, что в sidebar.socialLinks)
      - icon: 'fa6-brands:github'
        link: '${theme.repo}'
        title: 'GitHub'
    message: 'Копирование разрешено только со ссылкой на источник.'
    copyright: 'Copyright 2026 Your Name.'
    links:
      - text: '${t.links.aboutBlog}'
        href: 'pages/about'
        # desktopOnly: true  # скрывать на мобильных
        # mobileOnly: true   # скрывать на десктопе
```

Поля ссылок в `footer.links` описаны в [Поля ссылок](#поля-ссылок).
Поля социальных ссылок в `footer.socialLinks` — там же, ниже.

Флаги `rssFeed` и `atomFeed` включены по умолчанию и показываются
только при наличии соответствующей ленты.

::: tip
Вы можете полностью заменить стандартный футер на свой, подробней в разделе [Кастомизация](customization#кастомизация-футера-сайта).
:::

### Поля ссылок

Ссылки в `nav.links`, `sidebar.links`, `sidebar.bottomLinks` и `footer.links` используют одинаковый набор полей:

| Поле | Назначение |
| --- | --- |
| `text` | Текст ссылки. Кроме socialLinks, так как это просто иконки, не содержащие текста|
| `title` | Текст подсказки |
| `href` | URL; относительный дополняется префиксом локали, абсолютный (`https://…`) — как есть |
| `icon` | Имя иконки [Iconify](https://icones.es), например `solar:document-linear` |
| `iconClass` | CSS-класс для иконки |
| `class` | CSS-класс для всего элемента ссылки |
| `desktopOnly` | `true` — скрывать на мобильных (где работает сайдбар) |
| `mobileOnly` | `true` — скрывать на десктопе (показывать только в сайдбаре) |

## Кнопка «Поддержать» (donate)

Флаги `nav.donate` и `sidebar.donate` только показывают кнопку — куда она ведёт,
а задаёт параметры отдельная секция `donate`:

```yaml
themeConfig:
  donate:
    url: 'pages/donate'   # относительный путь дополняется локалью, либо внешний https://
    icon: 'fa6-solid:hand-holding-heart'   # необязательно, по умолчанию donateIcon
    postDonateCall: 'Если статья оказалась полезной — поддержите блог.'
```

::: tip
Без `donate.url` не будут выводиться кнопки пожертвования в топбаре, сайдбаре и в футере поста, даже если они включены.
:::

## Ссылка на правку (editLink)

Блок `edit-link` в подвале поста выводит ссылку «Редактировать эту страницу».
Тема сама собирает URL правки из `themeConfig.repo` для GitHub, GitLab,
Bitbucket, Gitea, Forgejo и Codeberg — достаточно задать `repo` в
`.vitepress/config.ts`. Переопределять `pattern` вручную нужно только для
нестандартной ветки или пути к исходникам:

```yaml
themeConfig:
  editLink:
    text: 'Редактировать на GitHub' 
    pattern: 'https://github.com/user/repo/edit/main/src/:path'
```

::: tip
Если `repo` не задан, блок не выводится. Текст по умолчанию берётся из
переводов (`t.editLink`) — переопределяйте только если стандартная фраза
не подходит.
:::

## Иконки

Каждое поле `icon:` принимает строку [Iconify](https://icones.es) вида `prefix:name`,
например `fa6-solid:hand-holding-heart`. Иконки по умолчанию («Поддержать», свежие,
популярное, RSS и т.д.) можно переопределить глобально в `src/site.yaml`:

```yaml
themeConfig:
  donateIcon: 'fa6-solid:hand-holding-heart'
  recentIcon: 'fa6-solid:bolt'
  featuredIcon: 'fa6-solid:bookmark'
  popularIcon: 'fa6-solid:star'
  byDateIcon: 'fa6-solid:calendar-days'
  authorsIcon: 'mdi:users'
  tagsIcon: 'fa6-solid:tag'
  categoriesIcon: 'fa6-solid:folder-open'  # по умолчанию нет — fallback на tagsIcon
  rssIcon: 'bi:rss-fill'
  atomIcon: 'vscode-icons:file-type-atom'
  youtubeIcon: 'fa6-brands:youtube'
```

`categoriesIcon` не имеет собственного умолчания: если поле не задано,
используется `tagsIcon`. `youtubeIcon` применяется в кнопке видео-ссылки поста.

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

Относительный `href`, такой как `pages/about`, автоматически дополняется префиксом текущей
локали (`/en/pages/about`, `/ru/pages/about`). Для внешних ссылок используйте абсолютные URL (`https://…`).

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
| `similar` | Похожие посты | нашлись посты с общими тегами |

Массив заменяется целиком между уровнями конфигурации, поэтому в
`_site.yaml` его нужно перечислять полностью, а не дописывать. Список можно
задать и для одной локали — например, чтобы в другом языке блок шеринга шёл
выше.

Для `edit-link` достаточно задать `themeConfig.repo` в `.vitepress/config.ts` —
адрес правки тема соберёт сама для GitHub, GitLab, Bitbucket, Gitea, Forgejo и
Codeberg. Подробности и переопределение — в [Ссылка на правку](#ссылка-на-правку-editlink).

### Кнопки «поделиться»

Блок `social-share` в подвале поста выводит кнопки шеринга соцсетей. Каждая
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

Мастер-выключатель `toc.enabled` (по умолчанию `true`) полностью отключает
оглавление на всех страницах — удобнее, чем перечислять пустые `layouts`:

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
      enabled: false,  // полностью отключить оглавление
      minHeadings: 3,  // по умолчанию; 0 отключает порог
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

## Переводы интерфейса

Встроенные переводы для 21 локали. Переопределения — через `themeConfig.t` на любом уровне (deep-merge дополняет встроенный слой). Полный справочник ключей — в [Переводы интерфейса и страница выбора языка](i18n-translations#строки-переводов-от-администратора).

Переводы модального окна поиска Pagefind вынесены в подобъект `t.searchUI` —
`noResultsText`, `resetButtonTitle`, `displayDetails`, `backButtonTitle` и
`footer.*` (подсказки клавиатуры). Они локализуются тем же способом, что и
остальные ключи `t`:

```yaml
# src/<locale>/_site.yaml
themeConfig:
  t:
    searchUI:
      noResultsText: 'Ничего не найдено'
      resetButtonTitle: 'Сбросить'
```

### Лейблы доступности и страница 404

Помимо `t`, `themeConfig` содержит отдельные поля для accessibility-лейблов
UI-контролов и текстов системных страниц. Они не входят в объект переводов,
но локализуются per-locale через `_site.yaml`:

| Поле | Назначение |
| --- | --- |
| `sidebarMenuLabel` | tooltip кнопки открытия сайдбара на мобильных |
| `langMenuLabel` | aria-label и tooltip переключателя языка |
| `colorThemeMenuLabel` | aria-label и tooltip переключателя цветовой темы |
| `stylePresetMenuLabel` | aria-label и tooltip переключателя стилевого пресета |
| `returnToTopLabel` | текст кнопки «Наверх» |
| `lightModeSwitchTitle` | tooltip переключателя на светлую тему |
| `darkModeSwitchTitle` | tooltip переключателя на тёмную тему |
| `notFound.title` | заголовок страницы 404 |
| `notFound.linkText` | текст ссылки «на главную» на странице 404 |

```yaml
# src/<locale>/_site.yaml
themeConfig:
  sidebarMenuLabel: 'Меню'
  langMenuLabel: 'Сменить язык'
  returnToTopLabel: 'Наверх'
  lightModeSwitchTitle: 'Светлая тема'
  darkModeSwitchTitle: 'Тёмная тема'
  notFound:
    title: 'Страница не найдена'
    linkText: 'На главную'
```

Встроенные локали уже содержат переводы этих полей — переопределяйте только
при необходимости.

## Рекомендации по уровням

Настройки `themeConfig` можно задавать на уровне 2 (`site.yaml`) или уровне 3
(`_site.yaml`). Вот что куда рекомендуется помещать.

### Уровень 2 — `site.yaml` (общее для всех локалей)

- `sidebar.*` — флаги секций (`recent`, `featured`, `popular`, `archive`, `authors`, `tags`, `categories`, `donate`, `rssFeed`, `atomFeed`)
- `sidebar.logoSrc`, `sidebar.logoHeight` — логотип сайдбара
- `sidebar.socialLinks` — иконки соцсетей (если одинаковы для всех локалей)
- `sidebar.tagsCount`, `sidebar.categoriesCount` — размеры облаков
- `donate.url`, `donate.icon` — общий адрес поддержки
- `postFooter` — порядок блоков подвала (если не отличается по локалям)
- `similarPostsCount` — количество похожих постов
- `externalLinkIcon` — иконка внешних ссылок
- Иконки по умолчанию (`donateIcon`, `recentIcon`, `featuredIcon` и т.д.)
- `toc` — настройки оглавления (порог, уровень, position)
- `asideLayouts` — список макетов с правой колонкой
- `footer.rssFeed`, `footer.atomFeed` — флаги ссылок на ленты в футере
- `footer.socialLinks` — социальные ссылки в футере
- `editLink.pattern` — шаблон ссылки на правку (если нестандартный; иначе авто-генерируется из `repo`)

### Уровень 3 — `_site.yaml` (отличия одной локали)

- `nav.links` — локализованные ссылки навигации
- `nav.socialLinks` — локализованные иконки соцсетей (если отличаются)
- `footer.message`, `footer.copyright` — локализованный текст футера
- `footer.links` — локализованные ссылки футера
- `footer.socialLinks` — локализованные иконки соцсетей в футере (если отличаются)
- `editLink.text` — локализованная подпись ссылки на правку
- `donate.postDonateCall` — локализованный текст призыва
- `t.*` — переводы подписей (`draftLabel` и т.д.)
- `sidebar.sidebarTitle` — локализованный заголовок сайдбара
- `sidebar.links`, `sidebar.bottomLinks` — локализованные ссылки сайдбара
- `sidebar.socialLinks` — локализованные иконки соцсетей (если отличаются)
- `toc.label` — локализованный заголовок оглавления
- `sidebarMenuLabel`, `langMenuLabel`, `colorThemeMenuLabel`, `stylePresetMenuLabel` — локализованные лейблы доступности
- `returnToTopLabel`, `lightModeSwitchTitle`, `darkModeSwitchTitle` — локализованные подписи кнопок темы и «наверх»
- `notFound.title`, `notFound.linkText` — локализованные тексты страницы 404
- `t.searchUI.*` — переводы модального окна поиска Pagefind

Общее правило: если значение одинаковое для всех языков — оставляйте на уровне 2.
Если отличается — переопределяйте на уровне 3, указывая только то, что отличается.
