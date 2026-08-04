---
title: Навигация, сайдбар и футер
description: Как формируются верхняя панель, секции сайдбара и футер из конфигурации YAML.
authorId: ivan-k
date: 2026-07-18
category: { name: 'Настройка', slug: 'configuration' }
tags: [config]
descrAsPreview: true
---

Интерфейс вокруг вашего контента — верхняя панель, сайдбар и футер — полностью
формируется из YAML. Посмотрите на элементы этого демо: всё, что описано ниже, работает вживую.

## Верхняя панель (`nav`)

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

## Сайдбар

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

### Логотип сайдбара

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

## Футер

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
заменяется целиком через слот `footer` в вашем `Layout.vue` — см.
[Кастомизацию футера сайта](advanced#кастомизация-футера-сайта)
в разделе расширенных возможностей.

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
управляется ключом `donate` в `postFooter` — см. [Подвал поста и
кнопки «поделиться»](post-footer-and-sharing).

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

## Что где настраивается

| Элемент | Где | Статья |
| --- | --- | --- |
| Верхняя панель, сайдбар, футер сайта | `_site.yaml` | эта |
| Секции списков в сайдбаре | `sidebar.*` | [Списки, страницы и главная](lists-and-pages) |
| Облака тегов и категорий | `sidebar.tags`, `sidebar.categories` | [Категории и теги](categories-and-tags) |
| Блоки под статьёй и кнопки «поделиться» | `postFooter`, `socialMediaShares` | [Подвал поста и шеринг](post-footer-and-sharing) |
| Правая колонка и оглавление | `toc`, `asideLayouts` | [Оглавление и правая колонка](toc-and-aside) |
| Своя вёрстка вместо встроенной | слоты `Layout.vue` | [Хуки, слоты и свои макеты](advanced) |
