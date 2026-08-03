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

Панель в самом верху. Содержит произвольные ссылки, иконки соцсетей, опциональную кнопку
пожертвования, кнопку поиска, переключатель языка и переключатель темы оформления.

```yaml
# src/<locale>/_site.yaml
themeConfig:
  nav:
    donate: true            # показывать кнопку пожертвования в панели
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
    popular: true   # требуется popularPosts.enabled
    recent: true
    archive: true   # по годам → месяцам
    authors: true
    tags: true      # облако тегов
    categories: true # облако категорий (по умолчанию выключено)
    donate: true
    rssFeed: true
    atomFeed: true
    bottomLinks:
      - { header: '${t.links.links}' }        # заголовок секции
      - text: 'Наш YouTube-канал'
        href: 'https://www.youtube.com/'
        icon: '${theme.youtubeIcon}'
      - text: 'Мы в соцсетях'
        href: 'page/links'
        icon: 'fa6-solid:share-nodes'
```

Каждая встроенная секция соответствует сгенерированному макету — их можно посмотреть в сайдбаре:
**Свежие посты**, **Популярное**, **Архив**, **Авторы**, **Теги**.

### Логотип сайдбара

Над навигацией выводится логотип — ссылка на главную страницу локали:

```yaml
# src/site.yaml
themeConfig:
  sidebarLogoSrc: '/img/sidebar-logo.jpg'
  sidebarLogoHeight: 180
```

Если для светлой и тёмной темы нужны разные файлы, вместо строки задайте объект:

```yaml
themeConfig:
  sidebarLogoSrc:
    light: '/img/logo-light.svg'
    dark: '/img/logo-dark.svg'
    alt: 'Название блога'   # необязательно; по умолчанию пустой alt
  sidebarLogoHeight: 180
```

В HTML попадают оба изображения, а лишнее скрывается стилями по классу `.dark`,
который VitePress выставляет до первой отрисовки. Поэтому при загрузке
страницы не мелькает логотип не от той темы. Классы `.sidebar-logo-light` и
`.sidebar-logo-dark` появляются только в объектной форме — обычная строка
по-прежнему даёт одну картинку без классов.

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

## Иконки

Каждое поле `icon:` принимает строку [Iconify](https://icones.es) вида `prefix:name`,
например `fa6-solid:hand-holding-heart`. Иконки по умолчанию (пожертвование, свежие,
популярное, RSS и т.д.) можно переопределить глобально в `src/site.yaml`:

```yaml
themeConfig:
  donateIcon: 'fa6-solid:hand-holding-heart'
  recentIcon: 'fa6-solid:bolt'
  popularIcon: 'fa6-solid:star'
  rssIcon: 'bi:rss-fill'
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

## Социальные кнопки поделиться

Тема выводит блок кнопок «поделиться» под каждым постом. Набор сетей и их порядок
задаются через `themeConfig.socialMediaShares` — массив объектов:

```ts
interface SocialMediaShare {
  name: string
  icon: string
  title: string
  urlTemplate: string
  class?: string
}
```

| Поле | Описание |
|------|----------|
| `name` | Машинный идентификатор (для справки) |
| `icon` | Имя иконки Iconify (например `'logos:telegram'`) |
| `title` | Доступная подпись / tooltip |
| `urlTemplate` | URL поделиться с плейсхолдерами `{url}` и `{title}` |
| `class` | Опциональные CSS-классы для кнопки |

### Сети по умолчанию

Встроенные конфигурации локалей уже включают шесть сетей: Telegram, WhatsApp, VK,
X (Twitter), Facebook, LinkedIn. Можно переопределить весь массив для конкретной локали
или глобально.

### Добавление своих сетей

Любой сервис с URL поделиться работает. Подставьте `{url}` и `{title}` в шаблон:

```yaml
# src/ru/_site.yaml
themeConfig:
  socialMediaShares:
    - name: vk
      icon: 'cib:vk'
      title: 'ВКонтакте'
      urlTemplate: 'https://vk.com/share.php?url={url}&title={title}'
      class: 'text-[#0077ff] hover:text-[#0077ff]'
    - name: telegram
      icon: 'logos:telegram'
      title: 'Телеграм'
      urlTemplate: 'https://t.me/share/url?url={url}&text={title}'
    - name: odnoklassniki
      icon: 'simple-icons:odnoklassniki'
      title: 'Одноклассники'
      urlTemplate: 'https://connect.ok.ru/offer?url={url}&title={title}'
```

> UTM-метки можно добавить прямо в `urlTemplate`:
> `urlTemplate: 'https://x.com/intent/tweet?text={title}&url={url}%3Futm_source%3Dshare'`

### Скрытие блока

Уберите `socialMediaShares` целиком или задайте пустой массив:

```yaml
themeConfig:
  socialMediaShares: []
```

В обоих случаях блок кнопок не выводится.

### Переопределение для локали

Локаль-специфичный список помещается в `src/<locale>/_site.yaml` — это высший уровень
в стеке слияния, поэтому он заменяет общий `socialMediaShares` из `src/site.yaml`
и любые встроенные значения по умолчанию.

## Подвал поста (`postFooter`)

Подвал каждого поста управляется через `themeConfig.postFooter` — упорядоченный массив ключей.
Уберите ключ, чтобы скрыть блок; измените порядок, чтобы поменять расположение:

```yaml
# src/site.yaml
themeConfig:
  postFooter:
    - author
    - donate
    - comments
    - social-share
    - edit-link
    - categories
    - tags
    - navigation
    - similar
    - popular-link
```

| Ключ | Блок |
|------|------|
| `author` | `PostAuthor` |
| `donate` | `PostDonateLink` |
| `comments` | `PostComments` |
| `social-share` | `PostSocialShare` |
| `edit-link` | `EditLink` |
| `categories` | `PostCategories` |
| `tags` | `PostTags` |
| `navigation` | `PostNavigation` |
| `similar` | `PostSimilarList` |
| `popular-link` | Ссылка на популярные посты (только если `popularPosts.enabled: true`) |

Полная кастомизация подвала поста (слоты, замена компонента) описана на странице
[Расширенные возможности](advanced#кастомизация-подвала-поста).
