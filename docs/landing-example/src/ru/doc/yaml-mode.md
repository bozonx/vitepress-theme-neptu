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
      - { text: Начать, link: /ru/doc }

  - type: features
    cols: 3
    items:
      - { icon: 🚀, title: Быстро, text: Статика на выходе. }
      - { icon: 🎨, title: Темизируемо, text: Две оси темы. }
      - { icon: 🧩, title: Собирается, text: Двадцать четыре блока. }

  - type: cta
    bg: brand
    title: Готовы?
    actions:
      - { text: Читать документацию, link: /ru/doc }
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
- **CMS.** Формат удобно хранить в CMS как коллекцию блоков с разными типами.
  Для визуального редактора всё равно понадобятся его интерфейс и правила
  проверки данных.
- **Генерация.** Скрипт или ИИ-агент может подготовить YAML, а JSON-схема и
  валидатор проверят структуру до публикации. Они не проверяют смысл текста,
  работоспособность URL и доступность внешних сервисов.

## Смешанный режим

`LandingRenderer` принимает и явный список, так что блоки можно вычислять и
дополнять ручными секциями:

```md
<script setup>
const blocks = [{ type: 'hero', title: 'Вычисленный' }]
</script>

<LandingRenderer :blocks="blocks">
  <template #before>
    <LnBanner text="Короткое объявление" />
  </template>

  <LnSection bg="soft">Своя секция после сгенерированных</LnSection>
</LandingRenderer>
```

## Свои типы блоков

Зарегистрируйте собственный компонент до монтирования рендерера:

```ts
// .vitepress/theme/index.ts
import LandingTheme from 'vitepress-theme-neptu-landing'
import { registerBlockTypes } from 'vitepress-theme-neptu-landing/blocks'
import PricingCalculator from './PricingCalculator.vue'

registerBlockTypes({ 'pricing-calculator': PricingCalculator })

export default LandingTheme
```

Дальше в любой странице доступен `- type: pricing-calculator`. Чтобы намеренно
заменить встроенный блок, передайте второй аргумент:

```ts
registerBlockTypes({ pricing: CustomPricing }, { override: true })
```

## Проверка

Неизвестный `type` показывает заметную заглушку в dev-режиме. CI-валидатор
проверяет структуру по JSON-схеме, уникальность `id`, порядок `hero`, известные
типы, группы команды и длину строк сравнения. Каждый зарегистрированный тип
разрешайте явно:

```sh
pnpm validate:blocks -- --allow-type=pricing-calculator
```
