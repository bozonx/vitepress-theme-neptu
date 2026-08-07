---
title: Диаграммы Mermaid и формулы KaTeX
description: Опциональное подключение Mermaid и KaTeX к блогу Neptu без увеличения bundle всех сайтов.
authorId: ivan-k
translations:
  en: /en/posts/mermaid-and-katex
date: 2026-07-25
category: advanced
tags: [guide, advanced]
descriptionAsPreview: true
---

Mermaid и KaTeX подключаются как опциональные Markdown-интеграции стандартным для VitePress образом.

## Mermaid

Установите в ваш блог renderer и сам Mermaid:

```bash
pnpm add -D vitepress-plugin-mermaid mermaid
```

В `.vitepress/config.ts` оберните уже собранный конфиг Neptu:

```ts
import { withMermaid } from 'vitepress-plugin-mermaid'
import { defineBlogConfig } from 'vitepress-theme-neptu/configs'

export default async () => {
  const config = {
    // существующий конфиг Neptu
  }

  return withMermaid(await defineBlogConfig(config))
}
```

После этого используйте обычный fenced block:

````md
```mermaid
flowchart LR
  Черновик --> Проверка --> Публикация
```
````

`withMermaid` должен оставаться внешней обёрткой, чтобы добавить свои хуки
VitePress. Параметры и совместимость версий приведены в [репозитории плагина](https://github.com/emersonbottero/vitepress-plugin-mermaid).

Настройки Mermaid — тему, направление диаграммы и другие опции — передаются
свойством `mermaid` внутри конфига:

```ts
return withMermaid({
  ...await defineBlogConfig(config),
  mermaid: {
    // MermaidConfig — см. https://mermaid.js.org/config/setup/modules/mermaidAPI.html
  },
})
```

Mermaid рендерится на клиенте: при SSR и в собранном HTML диаграммы пустые,
затем отрисовываются после гидратации. Это нормально и не требует
дополнительной настройки.

## KaTeX

Установите Markdown-it plugin (KaTeX устанавливается автоматически как зависимость):

```bash
pnpm add -D @mdit/plugin-katex
```

Зарегистрируйте его через существующий Markdown hook VitePress:

```ts
import { katex } from '@mdit/plugin-katex'

const config = {
  markdown: {
    config(md) {
      md.use(katex)
    },
  },
  // остальная конфигурация Neptu
}
```

Один раз импортируйте стили в `.vitepress/theme/index.ts`:

```ts
import 'katex/dist/katex.min.css'
```

Плагин принимает опции — например, чтобы не рвать рендеринг на ошибке:

```ts
md.use(katex, { throwOnError: false })
```

Строчные и блочные формулы используют разделители `$` и `$$`:

```md
Формула Эйлера: $e^{i\pi}+1=0$.

$$
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
$$
```

Полнотекстовый feed намеренно обрабатывает безопасный стандартный Markdown,
но не запускает произвольные плагины VitePress и Vue-компоненты. Поэтому без
собственного feed transformer диаграммы и формулы останутся в ленте исходным
текстом.

## Решение проблем

- **Формулы рендерятся как исходный текст** — проверьте, что CSS KaTeX
  импортирован в `theme/index.ts`, а плагин зарегистрирован в `markdown.config`.
- **`$` конфликтует с валютой** — символ доллара в тексте без формулы нужно
  экранировать: `\$`. Либо настройте другие разделители через опции плагина.
- **Диаграмма не появляется** — Mermaid рендерится только в браузере. Откройте
  консоль DevTools: ошибки синтаксиса диаграммы выводятся туда.

Рецепт KaTeX основан на
[документации `@mdit/plugin-katex`](https://mdit-plugins.github.io/katex.html).
Если KaTeX не обязателен, VitePress также документирует встроенное опциональное
[подключение MathJax](https://vitepress.dev/guide/markdown#math-equations).
