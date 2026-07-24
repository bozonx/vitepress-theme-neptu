/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*/loadPosts.data' {
  import type { PostLite } from 'vitepress-theme-neptu-blog'

  export const data: { posts: PostLite[] }
}

declare module '*/loadPosts.data.js' {
  import type { PostLite } from 'vitepress-theme-neptu-blog'

  export const data: { posts: PostLite[] }
}

declare module '*/loadPosts.data.ts' {
  import type { PostLite } from 'vitepress-theme-neptu-blog'

  export const data: { posts: PostLite[] }
}

