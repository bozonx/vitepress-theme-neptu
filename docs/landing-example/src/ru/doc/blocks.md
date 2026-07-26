---
title: Блоки
description: 'Справочник по всем блокам лендинга: пропсы, варианты и примеры'
---

# Блоки

Пятнадцать блоков и один контракт. Каждый блок — это `<section>`, которая сама
рисует свою подложку, задаёт вертикальный ритм и ограничивает ширину контента.
Вёрстку вокруг блоков писать не нужно.

Живые примеры: [английская главная](/en/) (компонентный режим) и
[русская](/ru/) (декларативный).

## Общие пропсы

Есть у каждого блока:

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `id` | `string` | — | Якорь, он же цель внутренних ссылок. |
| `bg` | `base \| soft \| mute \| inverse \| brand \| transparent` | `base` | Подложка секции. |
| `width` | `narrow \| default \| wide \| full` | `default` | Максимальная ширина контента. |
| `padding` | `none \| sm \| md \| lg` | `md` | Вертикальные отступы. |
| `align` | `start \| center` | зависит | Выравнивание заголовка секции. |
| `divider` | `boolean` | `false` | Линия сверху секции. |
| `noReveal` | `boolean` | `false` | Отключить анимацию появления. |

Почти у всех блоков есть тройка заголовка — `eyebrow`, `title`, `text` — и
список `items`. В `title` и `text` можно писать инлайновый HTML.

Небазовые подложки (`soft`, `inverse`, `brand`) сами переопределяют внутри себя
токены текста и карточек, поэтому контент остаётся читаемым без лишних пропсов.

## Каталог

| Тип (YAML) | Компонент | Для чего |
|------------|-----------|----------|
| `hero` | `LnHero` | Первый экран |
| `features` | `LnFeatureGrid` | Сетка возможностей |
| `feature-split` | `LnFeatureSplit` | Чередующиеся строки текст + медиа |
| `bento` | `LnBento` | Плитки разного размера |
| `carousel` | `LnCarousel` | Прокручиваемый набор карточек |
| `logos` | `LnLogoCloud` | Клиенты, спонсоры, интеграции |
| `stats` | `LnStats` | Ключевые цифры |
| `steps` | `LnSteps` | Последовательность «как это работает» |
| `testimonials` | `LnTestimonials` | Отзывы |
| `pricing` | `LnPricing` | Тарифы с переключателем периода |
| `faq` | `LnFaq` | Аккордеон вопросов |
| `cta` | `LnCta` | Призыв к действию |
| `timeline` | `LnTimeline` | Дорожная карта или история |
| `team` | `LnTeam` | Люди |
| `gallery` | `LnGallery` | Скриншоты с лайтбоксом |

## Общие структуры

```ts
// action — используется в hero, cta, faq, feature-split, pricing
{ text, link?, variant?: 'brand'|'alt'|'ghost'|'outline'|'link', size?, icon?, target? }

// media — везде, где принимается изображение
'/img/shot.png' | { src?, alt?, video?, poster?, ratio?, fit?: 'cover'|'contain' }

// icon — имя Iconify, эмодзи или путь к картинке
'fa6-solid:rocket' | '🚀' | '/img/icon.svg'
```

---

## hero — `LnHero`

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `variant` | `split \| centered \| cover \| plain` | `split` |
| `eyebrow`, `title`, `text`, `note` | `string` | — |
| `actions` | `action[]` | — |
| `image` | media | — |
| `glow` | `boolean` | `false` |
| `overlay` | `boolean` (для `cover`) | `true` |

Слоты: `before`, `title`, `text`, `after`, `media`.

::: code-group

```md [Компонент]
<LnHero
  variant="split"
  glow
  eyebrow="Тема для VitePress"
  title='Собирается из <span class="ln-accent">блоков</span>'
  text="Лендинг, документация и страницы в одном месте."
  image="/img/demo/shot-1.svg"
  :actions="[{ text: 'Начать', link: '/doc' }]"
/>
```

```yaml [Данные]
- type: hero
  variant: split
  glow: true
  eyebrow: Тема для VitePress
  title: Собирается из блоков
  text: Лендинг, документация и страницы в одном месте.
  image: /img/demo/shot-1.svg
  actions:
    - { text: Начать, link: /doc }
```

:::

Вариант `cover` — для фонового фото или видео: текст центрируется, а оверлей
сохраняет читаемость. Hero на странице должен быть один: он рендерит `h1`.

## features — `LnFeatureGrid`

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `{ icon?, image?, title, text?, link?, linkText?, badge? }[]` | — |
| `cols` | `1 \| 2 \| 3 \| 4` | `3` |
| `variant` | `card \| plain \| bordered` | `card` |
| `iconPosition` | `top \| inline` | `top` |
| `iconSize` | CSS-размер | `1.75rem` |

Если у элемента есть `link`, вся карточка становится ссылкой.

## feature-split — `LnFeatureSplit`

Строки «текст + медиа» с чередованием сторон.
Пропсы: `items` (элемент features плюс `bullets?: string[]` и
`actions?: action[]`), `reverse`, `noAlternate`, `mediaRatio`.

## bento — `LnBento`

Те же элементы, что у `features`, плюс `span` и `rowSpan` (`1` или `2`) —
плитка занимает две колонки или две строки.

## carousel — `LnCarousel`

| Проп | Тип | По умолчанию |
|------|-----|--------------|
| `items` | `{ image?, icon?, badge?, eyebrow?, title?, text?, link?, linkText? }[]` | — |
| `perView` | `1 \| 2 \| 3 \| 4` | `3` |
| `arrows`, `dots` | `boolean` | `true` |
| `autoplay` | мс, `0` — выкл. | `0` |
| `peek` | `boolean` | `false` |

Внутри — CSS scroll-snap: прокрутка пальцем и с клавиатуры работает без JS.
Автопрокрутка останавливается на наведении и фокусе и не запускается при
`prefers-reduced-motion`. Свой слайд — через скоуп-слот `slide`.

## logos — `LnLogoCloud`

`items: { src, alt?, link?, height? }[]`, `variant: row | grid | marquee`,
`monochrome`, `speed` (секунды для бегущей строки), `logoHeight`.

## stats — `LnStats`

`items: { value, label?, text?, icon? }[]`, `cols` 2–4,
`variant: plain | card | divided`.

## steps — `LnSteps`

`items: { title, text?, icon?, image?, label? }[]`,
`variant: row | column`, `connector: boolean`.
В маркере выводится `label`, иконка или порядковый номер.

## testimonials — `LnTestimonials`

`items: { text, author?, role?, avatar?, logo?, rating?, link? }[]`,
`cols` 1–3, `variant: grid | masonry | single`.

## pricing — `LnPricing`

```ts
// план
{
  title, text?, badge?, featured?,
  price, period?,                 // показывается на вкладке «месяц»
  priceYearly?, periodYearly?,    // наличие включает переключатель периода
  features: (string | { text, included?: false })[],
  action: { text, link, variant? },
}
```

Плюс `cols` 2–4, `monthlyLabel`, `yearlyLabel`, `note`.

## faq — `LnFaq`

`items: { question, answer, open? }[]`, `cols` 1–2, `exclusive`, `actions`.
Построен на `<details>`: работает без JavaScript и индексируется поиском.
В `question` и `answer` можно писать HTML.

## cta — `LnCta`

`variant: banner | card | split`, плюс `title`, `text`, `note`, `actions`,
`image`. На `bg="brand"` цвета кнопок инвертируются автоматически.

## timeline — `LnTimeline`

`items: { label?, title, text?, icon?, state?: 'done' | 'active' | 'planned' }[]`,
`variant: stacked | side`.

## team — `LnTeam`

`items: { name, role?, text?, avatar?, links?: { icon?, text?, link }[] }[]`,
`cols` 2–4, `variant: card | plain`, `avatarShape: circle | rounded`.

## gallery — `LnGallery`

`items: { src, alt?, caption?, link?, ratio? }[]`, `cols` 2–4,
`variant: grid | masonry`, `lightbox`, `ratio`.
Лайтбокс — нативный `<dialog>`: Esc закрывает, фокус удерживает браузер.

---

## Примитивы

Из них собраны блоки; используйте их напрямую для своих секций — тогда ваша
вёрстка наследует те же токены.

| Компонент | Назначение |
|-----------|------------|
| `LnPage` | Корневая обёртка страницы-лендинга |
| `LnSection` | Подложка + ритм + ширина |
| `LnContainer` | Ограничение ширины вне секции |
| `LnGrid` | Адаптивная сетка (`cols`, `gap`) |
| `LnHeading` | Надзаголовок + заголовок + лид |
| `LnButton`, `LnButtonGroup` | Кнопки и ряды действий |
| `LnCard` | Карточка, кликабельная при наличии `link` |
| `LnMedia` | Кадр изображения или видео с пропорцией |
| `LnIcon` | Iconify, эмодзи или картинка |
| `LnReveal` | Обёртка для анимации появления |

```md
<LnSection bg="soft" width="narrow" padding="lg">
  <LnHeading title="Своя секция" text="Собрана из примитивов." align="center" />
  <LnGrid :cols="2">
    <LnCard>Любая вёрстка</LnCard>
    <LnCard>И она в теме</LnCard>
  </LnGrid>
</LnSection>
```
