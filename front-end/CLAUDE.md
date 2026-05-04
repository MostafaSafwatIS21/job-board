# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint across the project
- `npm run preview` — Preview production build locally

## Architecture

React 19 + TypeScript SPA for a job board platform. Built with Vite 8, Tailwind CSS 4, and shadcn/ui (Radix primitives + Phosphor icons).

### Routing (`src/routes.tsx`)

React Router v7 with `createBrowserRouter`. Two layout groups:
- **App layout** (`/`) — Navbar + Footer wrapping pages: HomePage, JobListingsPage, CompleteProfilePage, NotFoundPage
- **Auth layout** (`/auth`) — LoginPage, RegisterPage

### Route Guards (`src/guard/`)

Two-tier protection:
- `ProtectedRoute` — redirects unauthenticated users to `/auth/login`
- `IsCompleted` — redirects authenticated users with incomplete profiles to `/complete-profile`; waits for hydration before deciding

### State Management (`src/app/`)

Redux Toolkit with typed hooks (`useAppDispatch`, `useAppSelector` from `src/app/hooks.ts`).

- `authSlice` — user, token, isAuthenticated, hydration state, async thunks for login/register/logout/fetchCurrentUser/completeProfile
- Store configured in `src/app/store.ts`

### API Layer (`src/utils/api.ts`)

Axios instance pointing at `http://localhost:8000/api`. Bearer token stored in localStorage (`job_board_token`) and injected into headers. Handles 401 by clearing the token.

### Path Alias

`@/*` maps to `src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### UI Conventions

- shadcn/ui components live in `src/components/ui/`; app-level components in `src/components/`
- Page components in `src/screens/`
- Class merging via `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)
- shadcn config in `components.json` — style: radix-lyra, icons: phosphor
