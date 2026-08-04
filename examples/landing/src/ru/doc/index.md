---
title: Введение
description: 'Знакомство с темой Neptu Landing для VitePress'
prev: false
---

# Введение

**Neptu Landing** превращает VitePress в сайт проекта: лендинг из готовых блоков
на главной, документация рядом и отдельные страницы там, где нужно.
Документация необязательна — удалите папку `doc/`, и останется просто лендинг с
дополнительными страницами.

Тема расширяет дефолтную тему VitePress, поэтому привычные шапка, сайдбар
документации, оглавление и поиск продолжают работать. Сверху добавляются
библиотека блоков, двухосевая система тем и декларативный формат страницы.

## Установка

```bash
npm install vitepress-theme-neptu-landing vitepress-theme-neptu
# или: pnpm add vitepress-theme-neptu-landing vitepress-theme-neptu
# или: yarn add vitepress-theme-neptu-landing vitepress-theme-neptu
```

`.vitepress/theme/index.ts`:

```ts
import LandingTheme from 'vitepress-theme-neptu-landing'

export default LandingTheme
```

`.vitepress/config.ts`:

```ts
import { defineLandingConfig } from 'vitepress-theme-neptu-landing/configs'
import type { LandingUserConfig } from 'vitepress-theme-neptu-landing'

export default async () => {
  const config: LandingUserConfig = {
    srcDir: 'src',
    siteUrl: 'https://example.com',
    themeConfig: {
      logo: '/img/logo.svg',
      defaultColorTheme: 'blue',
      defaultStylePreset: 'soft',
      colorPicker: false, // включайте только для демо-пикера
      stylePicker: false,
      search: { provider: 'local' },
    },
  }

  return defineLandingConfig(config)
}
```

После этого блоки и примитивы зарегистрированы глобально, поэтому в markdown их
можно использовать без импортов. В примерах ниже `/ru/` — префикс локали этого
демо; в своём проекте замените его на нужный маршрут.

## Первая страница

```md
---
layout: home
markdownStyles: false
---

<LnPage>

<LnHero
  variant="split"
  title="Страница проекта за вечер"
  text="Блоки, темы и документация в одной теме VitePress."
  image="/img/hero.svg"
  :actions="[
    { text: 'Начать', link: '/ru/doc' },
    { text: 'GitHub', link: 'https://github.com/…', variant: 'alt' },
  ]"
/>

<LnFeatureGrid
  align="center"
  title="Чем отличается"
  :items="[
    { icon: '🚀', title: 'Быстро', text: 'Статика, без рантайм-зависимостей.' },
    { icon: '🎨', title: 'Темизируемо', text: 'Две независимые оси темы.' },
    { icon: '🧩', title: 'Собирается', text: 'Двадцать четыре блока, один контракт.' },
  ]"
/>

<LnCta
  bg="brand"
  title="Готовы?"
  :actions="[{ text: 'Читать документацию', link: '/ru/doc' }]"
/>

</LnPage>
```

Важны два ключа frontmatter:

| Ключ | Зачем |
|------|-------|
| `layout: home` | Страница без сайдбара документации. |
| `markdownStyles: false` | Блоки идут во всю ширину, а не внутри текстовой колонки. |

`<LnPage>` — обёртка, которая помечает страницу как лендинг; держите блоки
внутри неё.

## Второй режим сборки

Ту же страницу можно описать данными. Смотрите
[Блоки](./blocks) и [Страницу как данные](./yaml-mode).

## Структура сайта

```
src/
├── site.yaml            # общий слой конфига (меню, футер)
├── ru/
│   ├── _site.yaml       # слой локали (заголовок, сайдбар)
│   ├── index.md         # лендинг
│   ├── doc/             # документация — необязательна
│   └── page/            # отдельные страницы
└── public/img/          # ассеты
```

Папки локалей находятся автоматически: добавьте `en/` рядом с `ru/` со своим
`_site.yaml`, и локаль появится в языковом меню.

Папка локали обязательна даже для одноязычного сайта. Одна папка `ru/` — уже
полная конфигурация, переводы не требуются. `src/index.md` зарезервирован для
выбора языка: страница может рекомендовать язык браузера, но не перенаправляет
автоматически.

Внутри `doc/` и `page/` вложенность не ограничена: страницу можно оформить
папкой с `index.md` и подпапкой `media/`. Подробности — в разделе
[Структура и медиа](./structure).

## Поиск

Тема лендинга не несёт собственного поиска — строка поиска в шапке приходит из
дефолтной темы VitePress и настраивается ровно так, как описано в её
документации: [VitePress → Search](https://vitepress.dev/reference/default-theme-search).

Локальный поиск (MiniSearch) не требует внешних сервисов и подходит для лендинга
с несколькими страницами документации:

```ts
// .vitepress/config.ts
themeConfig: {
  search: { provider: 'local' },
}
```

Индекс целиком отдаётся в браузер, поэтому на небольшом сайте это дёшево. Для
крупной документации переключитесь на `provider: 'algolia'` со своими ключами
DocSearch.

Нужно что-то другое — Pagefind, Orama, хостовый движок? Не задавайте
`themeConfig.search` (тогда штатная строка не отрисуется) и вставьте свой
компонент в слот `nav-bar-content-before`. Разводка описана в
[README лендинга](https://github.com/bozonx/vitepress-theme-neptu/blob/main/packages/landing/README.md#search),
а рабочий пример интеграции Pagefind — компонент `PageFindSearch.vue` из темы
блога. В отличие от лендинга, тема блога поставляется с уже встроенным
Pagefind — см. [Поиск в теме блога](https://bozonx.github.io/vitepress-theme-neptu/blog/ru/post/seo-feeds-search).
