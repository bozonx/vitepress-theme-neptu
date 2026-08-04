---
title: Обложки и лайтбокс
description: >
  Техническая информация о лайтбоксе: ленивая загрузка, зум, навигация с
  клавиатуры и CSS-классы для стилизации.
authorId: ivan-k
cover: https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Горный пейзаж на закате
coverDescr: "Закат над горными вершинами. Фото [Jeremy Bishop](https://unsplash.com/@jeremybishop) на Unsplash."
date: 2026-07-23
category: { name: 'Углубляемся в тему Neptu', slug: 'neptu-deep' }
tags: [media, components]
descrAsPreview: true
---

Изображения в тексте статьи открываются в **лайтбоксе** — нажмите на одно из
них, чтобы проверить. Общая информация про обложки постов — в статье
[Обложки, картинки и медиа](covers-images-media).

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

## CSS-классы

Для тонкой стилизации лайтбокса используются классы: `.neptu-lightbox`,
`.neptu-lightbox__overlay`, `.neptu-lightbox__image`, `.neptu-lightbox__nav`.

Ленивая загрузка применяется через атрибут `loading="lazy"` на теге `<img>`.
Тема добавляет его автоматически ко всем изображениям в тексте статьи.
