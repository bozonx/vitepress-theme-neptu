---
title: Блоки
description: 'Справочник по всем блокам лендинга: параметры, ограничения и YAML-примеры'
---

# Блоки

Лендинг состоит из 24 полновесных секций. Блок сам задаёт фон, вертикальные
отступы и ширину контента; внешняя обёртка для него не нужна. Ниже приведены
параметры для YAML- и компонентного режима. В YAML `type` выбирает блок, а
остальные ключи становятся его пропсами.

Живые примеры: [русская главная](/ru/) в YAML-режиме и
[английская](/en/) в компонентном режиме.

## Общие пропсы

Каждый блок принимает следующие параметры.

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `id` | `string` | — | Уникальный якорь для внутренней ссылки. |
| `bg` | `base \| soft \| mute \| inverse \| brand \| transparent` | `base` | Фон секции. |
| `width` | `narrow \| default \| wide \| full` | `default` | Максимальная ширина контента. У отдельных блоков свой default. |
| `padding` | `none \| sm \| md \| lg` | `md` | Вертикальные отступы. |
| `align` | `start \| center` | зависит от блока | Выравнивание заголовка и действий. |
| `divider` | `boolean` | `false` | Тонкая линия перед секцией. |
| `noReveal` | `boolean` | `false` | Отключает анимацию появления, кроме hero: у него она всегда выключена. |

Большинство блоков также принимают `eyebrow`, `title` и `text`. В `title`,
`text`, FAQ и HTML-контенте допускается инлайновый HTML. Передавайте только
доверенный HTML: блоки не очищают его от небезопасной разметки.

### Повторяющиеся структуры

```ts
// action: text и link обязательны
{ text: 'Начать', link: '/ru/doc', variant?: 'brand'|'alt'|'ghost'|'outline'|'link',
  size?: 'sm'|'md'|'lg', icon?: string, target?: string, rel?: string }

// media: строка или полная спецификация
'/img/shot.png' | { src?, alt?, video?, poster?, width?, height?, ratio?,
  fit?: 'cover'|'contain', decorative?, autoplay?, controls? }

// icon: имя Iconify, эмодзи или картинка
'fa6-solid:rocket' | '🚀' | { src: '/img/icon.svg', alt?: 'Логотип' }
```

`link` у карточки делает кликабельной всю карточку. Если у той же карточки есть
`actions`, используйте действия вместо `link`: вложенные ссылки недопустимы.

## Каталог

| Тип | Компонент | Назначение |
|-----|-----------|------------|
| `hero` | `LnHero` | Первый экран |
| `features`, `feature-split`, `bento`, `tabs` | соответствующие `Ln*` | Возможности и сценарии |
| `carousel`, `collection`, `content`, `gallery` | соответствующие `Ln*` | Контент и ресурсы |
| `logos`, `stats`, `testimonials`, `team` | соответствующие `Ln*` | Доказательства и люди |
| `steps`, `timeline`, `code`, `video`, `embed` | соответствующие `Ln*` | Процесс, демо и встраивания |
| `pricing`, `compare`, `faq`, `newsletter`, `cta` | соответствующие `Ln*` | Конверсионные секции |
| `banner` | `LnBanner` | Объявление |

## `hero` — `LnHero`

Первый экран. На странице в режиме `layout: landing` нужен ровно один `hero`; до
него разрешён только `banner`. `hero` рендерит `h1`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `title` | `string` | — |
| `variant` | `split \| centered \| cover \| plain` | `split` |
| `actions`, `image`, `note` | `action[]`, media, `string` | — |
| `glow` | `boolean` | `false` |
| `overlay` | `boolean`, только `cover` | `true` |

```yaml
- type: hero
  variant: split
  title: Собирается из блоков
  image: /img/demo/shot-1.svg
  actions: [{ text: Начать, link: /ru/doc }]
```

`cover` принимает фото или видео через `image`; для видео укажите `video` и,
при необходимости, `poster`. Оверлей включён по умолчанию для читаемости текста.

## `features` — `LnFeatureGrid`

Сетка карточек. Элемент принимает общий `CardItem`: `icon`, `image`, `title`,
`text`, `badge`, `link`, `linkText`, `tags`, `meta`, `date` и `actions`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `CardItem[]` | обязательно |
| `cols` | `1 \| 2 \| 3 \| 4` | `3` |
| `variant` | `card \| plain \| bordered` | `card` |
| `iconPosition` | `top \| inline` | `top` |
| `iconSize` | CSS-размер | `1.75rem` |

```yaml
- type: features
  title: Возможности
  items: [{ icon: '🚀', title: Быстро, text: Статический сайт. }]
```

## `feature-split` — `LnFeatureSplit`

Чередующиеся строки «текст + медиа». Каждый элемент — `CardItem` плюс
`bullets?: string[]` и `actions?: action[]`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `SplitItem[]` | обязательно |
| `reverse` | `boolean` | `false` |
| `noAlternate` | `boolean` | `false` |
| `mediaRatio` | CSS aspect-ratio | — |

```yaml
- type: feature-split
  items: [{ title: YAML или Vue, text: Выберите способ сборки., image: /img/demo/shot-1.svg }]
```

## `bento` — `LnBento`

Сетка возможностей с плитками разного размера. Элемент — `CardItem` плюс
`span` и `rowSpan` со значением `1` или `2`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `FeatureItem[]` | обязательно |
| `cols` | `2 \| 3 \| 4` | `3` |

```yaml
- type: bento
  items: [{ title: Большая плитка, text: Занимает две колонки., span: 2 }]
```

## `carousel` — `LnCarousel`

Горизонтальный набор `CardItem`. Нативная прокрутка и scroll-snap остаются
доступны без JavaScript; стрелки, точки и автопрокрутка требуют JavaScript.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `CardItem[]` | обязательно |
| `perView` | `1 \| 2 \| 3 \| 4` | `3` |
| `arrows`, `dots` | `boolean` | `true` |
| `autoplay` | миллисекунды, `0` — выкл. | `0` |
| `peek` | `boolean` | `false` |
| `cardVariant` | `card \| plain \| bordered` | `card` |
| `ariaLabel` | `string` | заголовок или «Carousel» |

```yaml
- type: carousel
  title: Ресурсы
  items: [{ title: Быстрый старт, link: /ru/doc }]
```

Автопрокрутка останавливается при наведении и фокусе и не запускается при
`prefers-reduced-motion`. Слот `slide` заменяет разметку одного слайда.

## `collection` — `LnCollection`

Коллекция статей, проектов или товаров. Элементы — `CardItem`; у блока есть
также действия после сетки.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `CardItem[]` | обязательно |
| `actions` | `action[]` | — |
| `layout` | `grid \| list` | `grid` |
| `cols` | `1 \| 2 \| 3 \| 4` | `3` |
| `variant` | `card \| plain \| bordered` | `card` |
| `imageRatio` | CSS aspect-ratio | `16/9` |

```yaml
- type: collection
  items: [{ title: Руководство, date: '2026-07-27', link: /ru/doc, linkText: Читать }]
```

## `content` — `LnContent`

Секция для редакционного текста. `content` рендерится как HTML; для
компонентного режима вместо него можно передать обычный слот.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `content` | доверенный HTML | — |
| `image`, `actions` | media, `action[]` | — |
| `variant` | `prose \| split \| card` | `prose` |
| `reverse` | `boolean` | `false` |

```yaml
- type: content
  title: Подробнее
  content: '<p>Только доверенный HTML.</p>'
```

## `logos` — `LnLogoCloud`

Логотипы клиентов, партнёров или интеграций.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `{ src, alt?, link?, height? }[]` | обязательно |
| `variant` | `row \| grid \| marquee` | `row` |
| `monochrome` | `boolean` | `true` |
| `speed` | секунды, для `marquee` | `32` |
| `logoHeight` | CSS-размер | `2rem` |

```yaml
- type: logos
  variant: marquee
  items: [{ src: /img/demo/logo-1.svg, alt: Acme }]
```

## `stats` — `LnStats`

Ключевые цифры. Элемент: `value` (обязательно), `label`, `text`, `icon`,
`trend`, `trendDirection: up|down|neutral`, `source`, `note`, `link`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `StatItem[]` | обязательно |
| `cols` | `2 \| 3 \| 4` | `3` |
| `variant` | `plain \| card \| divided` | `plain` |

```yaml
- type: stats
  items: [{ value: '24', label: Блока, text: и 11 примитивов }]
```

## `steps` — `LnSteps`

Последовательность шагов. В маркере выводится `label`, затем `icon`, затем
порядковый номер.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `{ title, text?, icon?, image?, label? }[]` | обязательно |
| `variant` | `row \| column` | `row` |
| `connector` | `boolean` | `true` |

```yaml
- type: steps
  items: [{ title: Установить тему, text: Добавьте пакет. }]
```

## `testimonials` — `LnTestimonials`

Отзывы: `text` обязателен; доступны `author`, `role`, `avatar`, `logo`, `link`
и `rating`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `TestimonialItem[]` | обязательно |
| `cols` | `1 \| 2 \| 3` | `3` |
| `variant` | `grid \| masonry \| single` | `grid` |

```yaml
- type: testimonials
  items: [{ text: Понятный способ собрать сайт., author: Анна }]
```

## `pricing` — `LnPricing`

Тарифы. У плана `title` обязателен; используйте `price`, `period`, `features`,
`action`, `featured`, `badge`. Если хотя бы у одного плана есть `priceYearly`,
появится переключатель периода.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `PricingPlan[]` | обязательно |
| `cols` | `2 \| 3 \| 4` | `3` |
| `monthlyLabel`, `yearlyLabel`, `discountLabel` | `string` | локализованный текст |
| `toggle` | `{ monthlyLabel?, yearlyLabel?, discountLabel? }` | — |
| `currency`, `billingSuffix`, `note` | `string` | — |

```yaml
- type: pricing
  items:
    - title: Pro
      price: '9'
      period: / месяц
      priceYearly: '90'
      periodYearly: / год
      features: [Проекты без ограничений, { text: Приоритетная поддержка, included: false }]
      action: { text: Выбрать, link: /ru/page/donate }
```

## `faq` — `LnFaq`

Аккордеон на нативном `<details>`: ответы доступны без JavaScript и читаются
поисковыми роботами. Вопрос и ответ принимают HTML.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `{ question, answer, open? }[]` | обязательно |
| `cols` | `1 \| 2` | `1` |
| `exclusive` | `boolean` | `false` |
| `schema` | `boolean` | `true` |
| `actions` | `action[]` | — |

```yaml
- type: faq
  items: [{ question: Нужен ли Vue-код?, answer: Нет, можно использовать YAML. }]
```

`schema: false` отключает JSON-LD `FAQPage`.

## `cta` — `LnCta`

Призыв к действию. Для YAML обязательны `title` и хотя бы одно действие.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `variant` | `banner \| card \| split` | `banner` |
| `title`, `text`, `note`, `actions`, `image` | строка, `action[]`, media | — |
| `bg` | общий фон / фон панели | `brand` |
| `surface` | `SectionBg`, только `card` | `base` |

```yaml
- type: cta
  title: Готовы начать?
  actions: [{ text: Читать документацию, link: /ru/doc }]
```

Для `variant: card` `surface` задаёт фон секции, а `bg` — фон самой панели.

## `timeline` — `LnTimeline`

Дорожная карта или история. Элемент: `title`, `text`, `label`, `icon` и
`state: done|active|planned`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `TimelineItem[]` | обязательно |
| `variant` | `stacked \| side` | `stacked` |

```yaml
- type: timeline
  items: [{ label: v1.0, title: Первый релиз, state: done }]
```

## `team` — `LnTeam`

Команда. Участник требует `name`; доступны `role`, `text`, `avatar`,
`department`, `meta`, `group` и `links: [{ icon?, text?, link }]`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `TeamMember[]` | обязательно |
| `groups` | `{ id, title?, text? }[]` | — |
| `cols` | `2 \| 3 \| 4` | `4` |
| `variant` | `card \| plain` | `card` |
| `avatarShape` | `circle \| rounded` | `circle` |

```yaml
- type: team
  groups: [{ id: design, title: Дизайн }]
  items: [{ name: Анна, role: Дизайнер, group: design }]
```

Значение `group` у участника должно существовать в `groups` — это проверяет
валидатор.

## `gallery` — `LnGallery`

Галерея с нативным лайтбоксом `<dialog>`. Элемент требует `src`; дополнительно
поддерживаются `alt`, `caption`, `title`, `text`, `tags`, `actions`, `link` и
`ratio`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `GalleryItem[]` | обязательно |
| `cols` | `2 \| 3 \| 4` | `3` |
| `variant` | `grid \| masonry` | `grid` |
| `lightbox` | `boolean` | `true` |
| `ratio` | CSS aspect-ratio | `4/3` |

```yaml
- type: gallery
  items: [{ src: /img/demo/shot-1.svg, alt: Главный экран, caption: YAML-режим }]
```

Esc закрывает лайтбокс; управление фокусом обеспечивает браузер.

## `code` — `LnCode`

Вкладки с кодом и кнопкой копирования. В каждом элементе `code` обязателен;
`html` позволяет передать заранее подсвеченную разметку того же кода.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `{ code, label?, lang?, html?, caption? }[]` | обязательно |
| `copy`, `chrome` | `boolean` | `true` |
| `variant` | `stacked \| split` | `stacked` |
| `actions` | `action[]` | — |

```yaml
- type: code
  items: [{ label: pnpm, lang: bash, code: pnpm add vitepress-theme-neptu-landing }]
```

## `tabs` — `LnTabs`

Переключаемые сценарии. Элемент: `label` (иначе берётся `title`), `icon`,
`title`, `text`, `image`, `bullets`, `actions`, `badge`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `TabItem[]` | обязательно |
| `variant` | `top \| side` | `top` |
| `initial` | индекс первой вкладки | `0` |
| `mediaRatio` | CSS aspect-ratio | `16/9` |

```yaml
- type: tabs
  items: [{ label: YAML, title: Страница как данные, text: Без Vue-разметки. }]
```

## `compare` — `LnCompare`

Таблица сравнения. В YAML `columns` и `rows` обязательны; количество `values`
в каждой строке должно совпадать с числом колонок.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `columns` | `{ title, text?, featured?, badge?, action? }[]` | обязательно |
| `rows` | `{ label, text?, group?, values }[]` | обязательно |
| `rowsLabel`, `note` | `string` | — |
| `stickyHead` | `boolean` | `true` |

```yaml
- type: compare
  columns: [{ title: Free }, { title: Pro, featured: true }]
  rows: [{ label: Проекты, values: ['3', Без ограничений] }]
```

В `values` можно передавать строки, числа, `true` и `false`; булевы значения
отображаются как доступность функции.

## `newsletter` — `LnNewsletter`

Обычная HTML-форма. В YAML `action` обязателен и должен указывать endpoint
вашего обработчика (например, Netlify Forms или Formspree). В компонентном
режиме отсутствие `action` оставляет форму в режиме предпросмотра.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `action` | URL endpoint | обязательно в YAML |
| `method` | `post \| get` | `post` |
| `emailName`, `emailLabel`, `placeholder`, `submitText` | `string` | локализованный текст |
| `fields` | `{ name, label?, placeholder?, type?, value?, required? }[]` | — |
| `consent`, `note`, `successText`, `errorText` | `string` | — |
| `ajax` | `boolean` | `false` |
| `variant` | `card \| banner` | `card` |

```yaml
- type: newsletter
  title: Получать обновления
  action: https://example.com/subscribe
  consent: 'Согласен с <a href="/privacy">политикой</a>.'
```

При `ajax: false` форма отправляется нативно и работает без JavaScript. При
`ajax: true` endpoint должен корректно отвечать на `fetch` и CORS-запросы.

## `video` — `LnVideo`

Видео с ленивой фасадной загрузкой YouTube/Vimeo или нативный плеер для файла.
В YAML укажите хотя бы один источник: `youtube`, `vimeo` или `src`. Если
указать несколько, приоритет у `youtube`, затем у `vimeo`.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `youtube`, `vimeo`, `src` | id или URL / путь к файлу | хотя бы один обязателен |
| `poster`, `caption`, `ratio` | `string` | `ratio: 16/9` |
| `autoplay` | `boolean`, только `src` | `false` |
| `actions` | `action[]` | — |

```yaml
- type: video
  title: Демонстрация
  youtube: dQw4w9WgXcQ
  caption: Демонстрация продукта
```

YouTube загружается только после нажатия и использует домен `youtube-nocookie`.

## `embed` — `LnEmbed`

Ленивый iframe для карты, календаря или стороннего виджета. В YAML `src`
обязателен; задавайте `embedTitle`, если заголовок блока не объясняет содержимое.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `src` | URL | обязательно |
| `embedTitle`, `caption`, `ratio` | `string` | `ratio: 16/9` |
| `loading` | `lazy \| eager` | `lazy` |
| `allow`, `sandbox` | строка атрибутов iframe | — |
| `actions` | `action[]` | — |

```yaml
- type: embed
  title: Календарь
  src: https://calendar.example.com/embed
  embedTitle: Календарь встреч
  sandbox: allow-scripts allow-forms
```

Ограничения `sandbox` и `allow` подбирайте под конкретный сервис: слишком
строгий `sandbox` может лишить виджет нужных возможностей.

## `banner` — `LnBanner`

Полоса объявления. Это единственный блок, который разрешено поставить перед
`hero` в YAML-лендинге.

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `text` | строка или доверенный HTML | обязательно |
| `badge`, `icon`, `link`, `linkText` | строка, icon | — |
| `dismissible` | `boolean` | `false` |
| `storageKey` | `string` | `ln-banner` |
| `placement` | `inline \| top \| bottom` | `inline` |
| `sticky` | `boolean` | `false` |

```yaml
- type: banner
  badge: Новое
  text: Вышла версия 0.20.
  link: /ru/doc/blocks
  linkText: Смотреть изменения
  dismissible: true
  storageKey: landing-v0-20
```

Закрытие запоминается в `localStorage` по `storageKey`; меняйте ключ при новом
объявлении, чтобы снова показать баннер посетителям.

## Примитивы

Если готового блока недостаточно, соберите секцию из примитивов — она унаследует
те же токены и адаптивность.

| Компонент | Назначение |
|-----------|------------|
| `LnPage` | Корневая обёртка компонентного лендинга |
| `LnSection` | Фон, ритм и ширина |
| `LnContainer` | Ограничение ширины вне секции |
| `LnGrid` | Адаптивная сетка (`cols`, `gap`) |
| `LnHeading` | Надзаголовок, заголовок и лид |
| `LnButton`, `LnButtonGroup` | Кнопки и ряды действий |
| `LnCard` | Карточка; при `link` становится ссылкой |
| `LnMedia` | Изображение или видео с пропорцией |
| `LnIcon` | Iconify, эмодзи или картинка |
| `LnReveal` | Анимация появления |

```md
<LnSection bg="soft" width="narrow" padding="lg">
  <LnHeading title="Своя секция" text="Собрана из примитивов." align="center" />
  <LnGrid :cols="2">
    <LnCard>Любая вёрстка</LnCard>
    <LnCard>И она в теме</LnCard>
  </LnGrid>
</LnSection>
```
