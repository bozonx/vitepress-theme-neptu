---
title: О демо
description: Что это за демо-блог и как использовать его как основу для своего сайта.
layout: page
translations:
  en: /en/page/about
---

# О демо

Это демонстрационный сайт темы
[vitepress-theme-neptu-blog](https://github.com/bozonx/vitepress-theme-neptu-blog).
Каждый пост и страница показывают реальную возможность темы, а рядом — исходный
frontmatter или конфиг.

## Как устроены страницы

| Раздел | Где смотреть |
| --- | --- |
| Frontmatter постов | Посты с тегом [`frontmatter`](../tags/frontmatter/1) |
| Медиа-компоненты | [Медиа в постах](../post/media-components) |
| SEO (OG, JSON-LD, canonical, hreflang) | Посты с тегом [`seo`](../tags/seo/1) |
| Конфигурация | [Уровни конфигурации](config-layers), [темы и шрифты](color-themes), [навигация и футер](nav-sidebar-footer), [ленты и SEO](seo-feeds-search), [локали](locales), [компоненты](components), [расширенные возможности](advanced) |
| Типы списков | Сайдбар: Свежие · Популярные · Архив · Авторы · Теги |

## Запуск локально

```bash
git clone https://github.com/bozonx/vitepress-theme-neptu-blog
cd vitepress-theme-neptu-blog
pnpm install
pnpm example:dev
```

Затем откройте напечатанный URL. Редактируйте любой файл в `docs/src` —
страница горячо перезагружается.

## Создание своего блога

Скопируйте `docs/` в новое место, затем:

- замените `siteUrl` в `.vitepress/config.ts`,
- отредактируйте `src/site.yaml` и каждый `src/<locale>/_site.yaml`,
- удалите демо-посты в `src/<locale>/post/` и напишите свои.

См. [Уровни конфигурации](config-layers) — какой файл для чего редактировать.
