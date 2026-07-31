---
title: О демо
description: Что это за демо-блог и как использовать его как основу для своего сайта.
layout: page
translations:
  en: /en/page/about
---

# О демо

Этот сайт — одновременно демо и руководство по теме
[vitepress-theme-neptu](https://github.com/bozonx/vitepress-theme-neptu).
Каждый пост показывает реальную возможность темы, а рядом — frontmatter или конфиг,
который её создаёт. Читается как гайд — от запуска до продвинутой кастомизации.

## Разделы гайда

| Раздел | С чего начать |
| --- | --- |
| Быстрый старт | [Запуск за 5 минут](../post/getting-started) · [Структура проекта](../post/project-structure) · [Первый пост](../post/first-post) |
| Контент | [Все поля frontmatter](../post/full-featured), посты с тегом [`frontmatter`](../tags/frontmatter/1) |
| Настройка | [Уровни конфигурации](../post/config-layers) · [навигация и футер](../post/nav-sidebar-footer) · [темы и шрифты](../post/color-themes) · [списки и страницы](../post/lists-and-pages) |
| Мультиязычность | [Локали](../post/locales) · [переводы и hreflang](../post/i18n-hreflang) |
| Кастомизация | [Компоненты](../post/components) · [хуки и слоты](../post/advanced) · [правая колонка и реклама](../post/aside-and-ads) |
| SEO и деплой | [Обзор SEO](../post/seo-overview), посты с тегом [`seo`](../tags/seo/1) · [деплой](../post/deploy) |
| Типы списков | Сайдбар: Свежие · Популярные · Архив · Авторы · Теги |

## Сделать свой блог

Основа — стартовый шаблон из папки `template/` репозитория. Скопируйте его и
подставьте своё:

- задайте `siteUrl` в `.vitepress/config.ts`,
- отредактируйте `src/site.yaml` и `src/<локаль>/_site.yaml`,
- удалите демо-посты в `src/<локаль>/post/` и напишите свои.

Пошагово это описано в разделе [Запуск за 5 минут](../post/getting-started), а
какой файл за что отвечает — в [Структуре проекта](../post/project-structure).
