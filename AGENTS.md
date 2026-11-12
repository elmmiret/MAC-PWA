# Repository Guide

## Layout

- Root `package.json` defines an npm workspace with `apps/*` and `packages/*`.
- `mac-pwa-frontend/` is the runnable React 19 + TypeScript + Vite app; its entrypoints are `src/main.tsx` and `src/App.tsx`.
- `mac-pwa-backend/` is an Express 5 + TypeScript backend. Its entrypoint is `src/index.ts` and it uses Prisma (PostgreSQL), Firebase Admin, and Swagger. Code is organized under `src/routes/`, `src/controllers/`, `src/services/`, `src/repositories/`, `src/interfaces/`, `src/config/`, `src/middlewares/`, and `src/utils/`.
- `packages/shared/` contains shared DTOs/types consumed by both the frontend and the backend (`main: src/index.ts`).

## Commands

From root:

- `npm run dev:all` starts both the backend and frontend dev servers concurrently with `concurrently`.

From `mac-pwa-frontend/`:

- `npm run dev` starts the Vite development server with HMR.
- `npm run lint` runs ESLint over the frontend.
- `npm run build` runs `tsc -b` and then creates the Vite production build in `dist/`.
- `npm run preview` serves the existing production build; build first.

From `mac-pwa-backend/`:

- `npm run dev` starts the server with `tsx watch src/index.ts`.
- `npm run build` compiles TypeScript with `tsc`.
- `npm run start` runs the compiled server from `dist/src/index.js`.
- `npm run set-admin-claim` runs `scripts/set-admin-claim.ts`.
- `npm test` is a placeholder and intentionally exits with an error because no tests are defined.
- `postinstall` runs `prisma skills sync` when dependencies are installed.

## Backend specifics

- Prisma uses `prisma.config.ts` to load `DATABASE_URL` from `.env`; the `datasource` block in `schema.prisma` does **not** contain a hardcoded URL.
- Migrations already exist under `apps/mac-pwa-backend/prisma/migrations/`. Use `npx prisma migrate dev --name <name>` for schema changes, not `db push`.
- Swagger schemas are manually maintained in `src/config/swagger.ts`. Adding a DTO to `shared` does **not** automatically expose it in Swagger.
- Shared DTO imports use a `.js` extension (e.g., `'./dtos/usuari.dto.js'`) because the backend compiles with NodeNext module resolution.
- Backend TypeScript enables `verbatimModuleSyntax`. Prisma model types (e.g., `Pagament`, `Usuari`) must be imported with `import type`; enums (e.g., `TEstat`, `TQuota`) are values and import normally.
- Admin-only endpoints follow the `[verifyFirebaseToken, isAdmin]` middleware pattern.


## Verification

- For frontend changes, run `npm run lint` and `npm run build` in `mac-pwa-frontend/`.
- For backend changes, run `npm run build` in `mac-pwa-backend/`.
- Frontend TypeScript is configured with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`; unused code can therefore fail the frontend build.
- The root `docker-compose.yml` provides a local PostgreSQL 17 service on host port `5433` for backend development.
