# Repository Guide

## Layout

- `mac-pwa-frontend/` is the runnable React 19 + TypeScript + Vite app; its entrypoints are `src/main.tsx` and `src/App.tsx`.
- `mac-pwa-backend/` is not implemented yet. It currently contains only an Express dependency manifest and Prisma skill-sync configuration; do not assume an API entrypoint, database schema, or backend test suite exists.
- There is no root package manifest or workspace runner. Run frontend commands from `mac-pwa-frontend/` and backend dependency commands from `mac-pwa-backend/`.

## Commands

From `mac-pwa-frontend/`:

- `npm run dev` starts the Vite development server with HMR.
- `npm run lint` runs ESLint over the frontend.
- `npm run build` runs `tsc -b` and then creates the Vite production build in `dist/`.
- `npm run preview` serves the existing production build; build first.

The backend's `npm test` is the placeholder script and intentionally exits with an error because no tests are defined. Its `postinstall` runs `prisma skills sync` when dependencies are installed.

## Verification

- For frontend changes, run `npm run lint` and `npm run build` in `mac-pwa-frontend/`.
- TypeScript is configured with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`; unused code can therefore fail `npm run build`.
- Do not treat the root `docker-compose.yml` as an available development or service setup; it is currently empty.
