# site

## Run

Use Node.js 22 or later. This monorepo uses pnpm workspaces — run from the repo root:

- Install dependencies:

  ```bash
  pnpm install
  ```

- Run locally:

  ```bash
  pnpm landing:dev
  ```

  Go to `http://localhost:5173/`

- Build and Preview

  ```bash
  pnpm landing:build
  pnpm landing:preview
  ```

  Go to `http://localhost:4173/`

  Local admin panel is on `http://localhost:4173/admin/`
