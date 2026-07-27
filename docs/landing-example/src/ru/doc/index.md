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
pnpm add vitepress-theme-neptu-landing vitepress-theme-neptu-blog
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
      defaultLandingStyle: 'soft',
      themePicker: false, // включайте только для демо-пикера
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
