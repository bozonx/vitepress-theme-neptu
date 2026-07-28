---
title: Цветовые темы и шрифты
description: Восемь готовых цветовых схем, собственный оттенок через CSS-переменные, светлая и тёмная темы и подключение своих шрифтов.
date: 2025-05-10T10:00:00Z
authorId: ivan-k
tags:
  - guide
  - theme
---

# Цветовые темы

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

## Переключение схемы

Импортируйте ровно одну темы CSS в верхней части `.vitepress/theme/index.ts`:

```ts
// .vitepress/theme/index.ts
import 'vitepress-theme-neptu/blue-theme.css'
// import 'vitepress-theme-neptu/green-theme.css'
// import 'vitepress-theme-neptu/purple-theme.css'
// import 'vitepress-theme-neptu/amber-theme.css'
// import 'vitepress-theme-neptu/teal-theme.css'
// import 'vitepress-theme-neptu/rose-theme.css'
// import 'vitepress-theme-neptu/magenta-theme.css'
// import 'vitepress-theme-neptu/monochrome-theme.css'
```

## Динамическое переключение темы (`themeSwitcher`)

Тема поддерживает интерактивный контрол для смены цветовых пресетов в реальном времени (попробуйте иконку палитры в верхнем меню). Выбранная тема автоматически сохраняется в `localStorage`.

Чтобы включить контрол в вашем блоге, установите `themeSwitcher: true` в `themeConfig`:

```ts
// .vitepress/config.ts
export default {
  themeConfig: {
    themeSwitcher: true, // Включает переключатель палитры в верхней панели
  }
}
```

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
