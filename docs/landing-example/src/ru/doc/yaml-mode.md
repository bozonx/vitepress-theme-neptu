---
title: Страница как данные
description: 'Описать лендинг в YAML и отрендерить одним компонентом'
---

# Страница как данные

Лендинг можно описать массивом `blocks:` во frontmatter вместо компонентов. Один
рендерер превращает его в тот же результат:

```md
---
layout: landing
blocks:
  - type: hero
    variant: centered
    title: Всё в YAML
    text: В этом файле нет Vue.
    actions:
      - { text: Начать, link: /doc }

  - type: features
    cols: 3
    items:
      - { icon: 🚀, title: Быстро, text: Статика на выходе. }
      - { icon: 🎨, title: Темизируемо, text: Две оси темы. }
      - { icon: 🧩, title: Собирается, text: Пятнадцать блоков. }

  - type: cta
    bg: brand
    title: Готовы?
    actions:
      - { text: Читать документацию, link: /doc }
---

```

[Русская главная](/ru/) этого сайта написана именно так — откройте её исходник
рядом с [английской](/en/) и сравните два режима.

`type` выбирает блок, все остальные ключи передаются ему как пропсы. Имена и
значения совпадают с компонентным режимом, поэтому
[справочник по блокам](./blocks) действует для обоих.

## Зачем это нужно

- **Переводы.** Контент лежит в данных, а не в разметке: переводчик копирует
  YAML-файл, а не правит Vue.
- **CMS.** Типы блоков ложатся на коллекцию с вариативными типами — это прямой
  путь к визуальному конструктору для нетехнических редакторов.
- **Генерация.** Скрипт или ИИ-агент надёжнее выдаёт валидный YAML, чем шаблон
  Vue.

## Смешанный режим

`LandingRenderer` принимает и явный список, так что блоки можно вычислять и
дополнять ручными секциями:

```md
<script setup>
const blocks = [{ type: 'hero', title: 'Вычисленный' }]
</script>

<LandingRenderer :blocks="blocks">
  <template #before>
    <LnAnnouncement />
  </template>

  <LnSection bg="soft">Своя секция после сгенерированных</LnSection>
</LandingRenderer>
```

## Свои типы блоков

Зарегистрируйте собственный компонент — или подмените встроенный тип — до
монтирования рендерера:

```ts
// .vitepress/theme/index.ts
import LandingTheme from 'vitepress-theme-neptu-landing'
import { registerBlockTypes } from 'vitepress-theme-neptu-landing/blocks'
import PricingCalculator from './PricingCalculator.vue'

registerBlockTypes({ 'pricing-calculator': PricingCalculator })

export default LandingTheme
```

Дальше в любой странице доступен `- type: pricing-calculator`.

## Проверка

Неизвестный `type` показывает заметную заглушку в dev-режиме. Запускайте
`pnpm validate:blocks` в CI: команда ловит неизвестные свойства встроенных
блоков, но оставляет зарегистрированные пользовательские типы расширяемыми.
