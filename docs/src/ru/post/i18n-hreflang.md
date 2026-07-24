---
title: Локализация и hreflang
description: >
  Блог поставляется на английском и русском. Как связаны папки локалей,
  переключатель языка, поле translations и автоматические теги hreflang.
date: 2025-04-15T08:00:00Z
authorId: maria-editor
cover: https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Разноцветные флаги разных стран
tags:
  - seo
  - i18n
descrAsPreview: true
# Связываем этот пост с английской версией — для переключателя языка и hreflang.
translations:
  en: "/en/post/i18n-hreflang"
---

Этот пост есть и на **английском**. Нажмите **переключатель языка** в верхней
панели — и он приведёт вас именно к переведённому посту, а не на главную, потому
что версии связаны между собой.

## Как работают локали

Каждый язык — это папка в `src/` со своим `_site.yaml`. Тема находит их
автоматически, список локалей в коде вести не нужно:

```
src/
  en/   ← _site.yaml, посты, страницы-списки
  ru/   ← _site.yaml, посты, страницы-списки
```

## Связывание переводов

### Как это сделано

```yaml
# в src/ru/post/i18n-hreflang.md
translations:
  en: "/en/post/i18n-hreflang"
```

```yaml
# в src/en/post/i18n-hreflang.md
translations:
  ru: "/ru/post/i18n-hreflang"
```

Из этого тема автоматически делает две вещи:

1. **Переключатель языка** ведёт на соответствующий перевод.
2. **Теги hreflang** — `<link rel="alternate" hreflang="…">` для каждого
   связанного языка и `x-default`. Откройте `<head>`, чтобы их увидеть.

Полное описание — в английской версии поста.
