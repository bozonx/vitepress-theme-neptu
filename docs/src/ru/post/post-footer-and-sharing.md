---
title: Футер поста, шеринг и похожие посты
description: >
  Что отображается под постом — кнопки шеринга в соцсетях, настраиваемые блоки
  postFooter и автоматический список «похожие посты» — и как всё это настроить.
authorId: ivan-k
cover: https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Руки команды, сложенные вместе
commentLink: https://github.com/bozonx/vitepress-theme-neptu/discussions
translations:
  en: /en/post/post-footer-and-sharing
date: 2026-07-17
category: { name: 'Настройка', slug: 'configuration' }
tags: [config]
descrAsPreview: true
---

Прокрутите к нижней части этого поста, и вы увидите весь набор блоков футера в действии:
**карточку автора**, **ссылку на обсуждение**, **кнопки шеринга**, **ссылку на редактирование**,
**теги**, хронологическую **навигацию** и список **похожих постов**. Каждый из этих блоков настраивается — вот как это работает.

## Блоки postFooter

Футер представляет собой упорядоченный список именованных блоков. Меняйте порядок или удаляйте их
в `src/site.yaml` (или в файле конкретной локали):

### Как это сделать

```yaml
# src/site.yaml
themeConfig:
  postFooter:
    - author        # карточка автора (из authorId)
    - donate        # призыв поддержать блог
    - comments      # кнопка commentLink
    - social-share  # кнопки шеринга (см. ниже)
    - edit-link     # "Редактировать эту страницу" (достаточно repo: URL создаётся автоматически)
    - tags          # теги данного поста
    - navigation    # более старый / более новый пост по дате
    - similar       # список похожих постов
    - popular-link  # ссылка на список Популярное
```

Удалите любую строку, чтобы скрыть соответствующий блок; измените порядок, чтобы переставить блоки.

Задайте `themeConfig.repo` один раз в `.vitepress/config.ts`, и тема сама получит URL
редактирования для поддерживаемого git-хостинга. `editLink.text` меняет только
подпись; `editLink.pattern` указывайте лишь для нестандартной ветки или пути к исходникам.

## Кнопки шеринга в соцсетях

Блок `social-share` отображает кнопки шеринга. Тема включает 6 вариантов по умолчанию
(Telegram, WhatsApp, VK, X, Facebook, LinkedIn) — их вы видите ниже под статьей без дополнительной настройки.
Переопределите список, чтобы выбрать собственные соцсети:

```yaml
# src/<locale>/_site.yaml
themeConfig:
  socialMediaShares:
    - name: telegram
      icon: 'logos:telegram'
      title: 'Telegram'
      urlTemplate: 'https://t.me/share/url?url={url}&text={title}'
    - name: bluesky
      icon: 'simple-icons:bluesky'
      title: 'Bluesky'
      urlTemplate: 'https://bsky.app/intent/compose?text={title}%20{url}'
```

`{url}` и `{title}` автоматически заменяются на URL и заголовок текущей страницы. Чтобы скрыть
блок полностью, укажите `socialMediaShares: []`.

## Похожие посты

Блок `similar` автоматически формирует список статей со схожими тегами — настройки для конкретного
поста не требуются. Управляйте количеством выводимых постов глобально:

```yaml
# src/site.yaml
themeConfig:
  similarPostsCount: 5
```

Поскольку этот пост имеет теги `frontmatter` и `guide`, список похожих статей ниже заполняется
другими материалами с этими тегами. Добавляйте теги к постам, и они начнут выводиться
в списках похожих материалов.
