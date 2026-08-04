# site

## Run

Use Node.js 22 or later. This monorepo uses npm workspaces — run from the repo root:

- Install dependencies:

  ```bash
  npm install
  ```

- Run locally:

  ```bash
  npm run landing:dev
  ```

  Go to `http://localhost:5173/`

- Build and Preview

  ```bash
  npm run landing:build
  npm run landing:preview
  ```

  Go to `http://localhost:4173/`

  Local admin panel is on `http://localhost:4173/admin/`
