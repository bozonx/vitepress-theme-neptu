---
title: Обложки и лайтбокс для изображений
description: >
  Локальные и внешние изображения обложек, coverAlt / coverDescr / coverWidth / coverHeight,
  и просмотр изображений в статье через лайтбокс с зумом.
authorId: ivan-k
cover: https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Горный пейзаж на закате
coverDescr: "Закат над горными вершинами. Фото [Jeremy Bishop](https://unsplash.com/@jeremybishop) на Unsplash."
translations:
  en: /en/post/cover-and-images
date: 2026-07-23
category: { name: 'Медиа', slug: 'media' }
tags: [media, frontmatter]
descrAsPreview: true
---

Изображение выше — это **обложка** поста, полностью заданная из фронтматера. Ниже
изображения в тексте статьи открываются в **лайтбоксе** — нажмите на одно из них, чтобы проверить.

## Внешняя обложка

Для внешнего URL тема не может измерить файл, поэтому вы укажете
`coverWidth` / `coverHeight` самостоятельно во избежание сдвига верстки.

### Как это сделать

```yaml
cover: https://images.unsplash.com/photo-1501785888041-...
coverWidth: 1200
coverHeight: 800
coverAlt: Горный пейзаж на закате
coverDescr: "Подпись с **markdown** и [ссылками](https://example.com)."
```

## Локальная обложка

Поместите файл в `src/public/img/` и сошлитесь на него с префиксом `/img/`. Тема
читает файл во время сборки и определяет размеры автоматически.

```yaml
cover: /img/my-post-cover.jpg
# coverWidth/coverHeight не нужны — измеряются автоматически
```

Обложку можно также положить рядом с markdown-файлом или в папку на статью —
см. [Где хранить изображения и медиа](media-asset-placement) для всех трёх
способов.

```yaml
# рядом с .md-файлом
cover: ./cover.jpg

# или в подпапке media (папка на статью)
cover: ./media/cover.jpg
```

## Изображения в тексте и лайтбокс

Обычные картинки в markdown в любом месте текста статьи лениво загружаются и становятся
кликабельными — нажатие открывает полноэкранный лайтбокс с возможностью зума и навигацией с клавиатуры.
Попробуйте сами:

![Уютный домик в лесу](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop)

![Тихое озеро с отражением неба](https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000&auto=format&fit=crop)

### Как это сделать

Ничего лишнего — обычный markdown. Лайтбокс и ленивая загрузка (lazy-loading) работают по умолчанию:

```md
![Уютный домик в лесу](https://images.unsplash.com/photo-...)
```

Используйте <kbd>Esc</kbd> для закрытия, стрелки для перемещения между изображениями и прокрутку или
двойной клик для зума.
