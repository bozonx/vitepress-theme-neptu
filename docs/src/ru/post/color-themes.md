---
title: Оформление — цветовые схемы, стили, шрифты и печать
description: >
  Восемь цветовых схем и шесть стилевых пресетов, собственный оттенок через
  CSS-переменные, светлая и тёмная темы, свои шрифты и печатная версия статьи.
authorId: ivan-k
date: 2026-07-15
category: { name: 'Настройка', slug: 'configuration' }
tags: [theme, config]
descrAsPreview: true
---

Тема поставляется с **восемью** готовыми цветовыми схемами. Вы выбираете одну из них, импортируя её
CSS в `.vitepress/theme/index.ts`. В данном демо сейчас используется **синяя тема (blue)**.

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin:1.5rem 0;">
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(213,66%,46%)"></div><small>blue · hue 213</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(115,70%,37%)"></div><small>green · hue 115</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(270,66%,46%)"></div><small>purple · hue 270</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(30,66%,46%)"></div><small>amber · hue 30</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(180,66%,46%)"></div><small>teal · hue 180</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(345,66%,46%)"></div><small>rose · hue 345</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(320,66%,46%)"></div><small>magenta · hue 320</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(0,0%,30%)"></div><small>monochrome</small></div>
</div>

## Выбор схемы

Цветовая схема задаётся в файле конфигурации `site.yaml` (или в `themeConfig` в `.vitepress/config.ts`):

```yaml
# site.yaml
themeConfig:
  defaultColorTheme: 'teal' # blue | green | purple | amber | teal | rose | magenta | monochrome
  defaultStylePreset: 'editorial' # soft | sharp | brutal | glass | editorial | mono
```

При этом импортировать дополнительные CSS-файлы тем в `.vitepress/theme/index.ts` **не требуется** — базовая тема загружает все пресеты автоматически, а выбор схемы применяется инлайн-скриптом без мигания страницы.

## Пикеры темы (`colorPicker`, `stylePicker`)

В теме два рантайм-переключателя — по одному на ось — и оба **выключены по
умолчанию**: блог обычно поставляется с одним выбранным видом, а пикеры нужны
демо-сайтам вроде этого. Включаются независимо:

```ts
// .vitepress/config.ts
export default {
  themeConfig: {
    // Применяется к тем, кто зашёл впервые; сохранённый выбор всегда важнее.
    defaultColorTheme: 'blue',
    defaultStylePreset: 'soft',

    colorPicker: true, // иконка палитры в верхней панели
    stylePicker: true, // иконка форм в верхней панели
  },
}
```

Выбор посетителя пишется в `localStorage` и восстанавливается инлайн-скриптом в
`<head>` до первой отрисовки — мигания чужой темы нет.

Задать `defaultColorTheme` / `defaultStylePreset` достаточно само по себе:
чтобы поменять вид сайта, пикер не нужен.

## Стилевые пресеты (`data-style`)

Цвет — только одна ось. Вторая, **форма**, живёт в отдельном атрибуте
`data-style`, и они свободно комбинируются: `blue` + `brutal` — совсем другой
блог, чем `blue` + `soft`, при тех же постах и компонентах.

| Пресет | Как выглядит |
|--------|--------------|
| `soft` | По умолчанию. Скругления, мягкие тени — обычный вид блога |
| `sharp` | Прямые углы, плоские поверхности |
| `brutal` | Жёсткие рамки 2px, смещённые тени, кнопки капсом |
| `glass` | Полупрозрачные поверхности, блюр, глубокие тени |
| `editorial` | Serif-заголовки, карточки без обвязки, широкий интерлиньяж |
| `mono` | Моноширинный шрифт всюду, тонкие рамки, никаких теней |

Пресеты **общие с темой лендинга** — один и тот же файл
`vitepress-theme-neptu/style-presets.css` одевает оба пакета, поэтому блог и
лендинг на одном домене читаются как один сайт.

Пресет никогда не называет цвет. Он читает мостовые токены, которые тема
определяет под свою палитру (`--neptu-c-ink`, `--neptu-c-surface`,
`--neptu-shadow-*`, …) — именно это позволяет одному файлу обслуживать две
цветовые системы. Чтобы сделать свой, скопируйте встроенный блок и поменяйте
токены формы:

```css
[data-style='compact'] {
  --neptu-radius-md: 0.25rem;
  --neptu-card-shadow: none;
  --neptu-card-shadow-hover: none;
  --neptu-lift: 0px;
  /* … задайте остальной набор токенов, см. комментарий в шапке файла */
}
```

Свои id работают как `defaultStylePreset` или как атрибут `data-style`, который
вы выставляете сами; встроенный пикер показывает только встроенные пресеты.

## Собственный оттенок (Hue)

Каждая схема управляется двумя CSS-переменными. Чтобы задать собственный оттенок, пропустите импорт темы
и укажите переменные в `.vitepress/theme/styles.css`:

```css
:root {
  --primary-hue: 115; /* акцентный цвет: кнопки, ссылки, активные состояния */
  --layout-hue: 200;  /* нейтральный оттенок интерфейса: рамки, поверхности */
}
```

`--primary-hue` и `--layout-hue` независимы, поэтому вы можете сочетать яркий
акцентный цвет с иначе оттонированным нейтральным интерфейсом.

## Светлое / тёмное оформление

Независимо от цветовой схемы, тема поддерживают светлую и тёмную темы «из коробки»
— попробуйте переключатель солнце/луна в верхней панели. Каждая схема содержит
описание обоих вариантов, поэтому дополнительная настройка не требуется.

## Пользовательские шрифты

По умолчанию тема использует безопасный веб-стек шрифтов (`Arial, 'Helvetica Neue',
Helvetica, sans-serif` — быстрая загрузка, без сдвига верстки). Чтобы использовать свой шрифт,
подключите его в `head` и переопределите две CSS-переменные — ничего больше не требуется,
вся тема применит их автоматически:

```ts
// .vitepress/config.ts — загрузка шрифта
head: [
  ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Fira+Code&display=swap', rel: 'stylesheet' }],
],
```

```css
/* .vitepress/theme/styles.css — применение */
:root {
  --font-body: 'Roboto', ui-sans-serif, system-ui, sans-serif;   /* текст, заголовки, кнопки */
  --vp-font-family-mono: 'Fira Code', ui-monospace, monospace;   /* блоки кода, аудиоплеер */
}
```

Если шрифт нужен только для заголовков, не меняйте `--font-body`, а переопределите `h1…h6`
в `styles.css`.

## Фоновое изображение главной страницы

В данном демо также задан фоновый рисунок на главной странице. Это обычный CSS в
`styles.css`, а не часть цветовой схемы:

```css
.home-layout {
  background-image: url('https://images.unsplash.com/photo-...');
  background-color: #000000;
}
```

## Печать

Настраивать нечего: при печати страницы тема сама скрывает сайдбар, верхнюю
панель, футер сайта, интерактивные блоки под статьёй и кнопки возврата наверх.
Статья занимает всю ширину листа, длинные строки кода переносятся, крупные
медиа-блоки не разрываются между страницами, а у внешних ссылок печатается их
адрес.

Чтобы убрать с печатной версии собственный элемент, добавьте атрибут
`data-print-ignore`:

```html
<aside data-print-ignore>Этот блок нужен только на экране.</aside>
```
