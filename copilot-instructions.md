# Copilot Instructions for DevFlow

## Overview

DevFlow is a fullstack project for team development management with:
- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts
- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Architecture:** Full separation between Front/ and Back/ directories with independent package.json files

## Running Commands

### Frontend (React + Vite)
```bash
cd Front  # or stay in root if package.json is there
npm install
npm run dev      # Start dev server on http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build locally
```

### Backend (Express + TypeScript)
```bash
cd Back/prisma
npm install
npm run dev              # Start dev server with hot reload on http://localhost:3001
npm run build            # Compile TypeScript to dist/
npm start                # Run compiled version
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Populate with seed data
npm run prisma:studio    # Open Prisma Studio (database UI)
```

**Docker (recommended for backend):**
```bash
cd Back/prisma
docker-compose up --build
docker-compose exec api npx ts-node prisma/seed.ts
```

## Architecture

### Frontend Structure
- **src/App.jsx** - Main app composition with authentication provider
- **src/components/** - React components (pages, UI components)
- **src/data/mockData.js** - Mock data (being replaced with API calls)
- **src/api/** - API client modules (when implemented, one per resource)
- **src/contexts/AuthContext.jsx** - Authentication state (when implemented)
- **src/hooks/useApi.js** - Generic data fetching hook (when implemented)
- **src/icons/SidebarIcons.jsx** - SVG icons for navigation
- **tailwind.config.js** - Tailwind CSS configuration
- **vite.config.js** - Vite build configuration

### Backend Structure
- **src/controllers/** - HTTP request handlers
- **src/routes/** - Express route definitions
- **src/services/** - Business logic layer
- **src/middlewares/** - Auth, validation, error handling
- **src/validators/** - Zod schemas for input validation
- **src/config/** - Environment and database configuration
- **src/utils/** - Helper functions and custom errors
- **prisma/schema.prisma** - Database schema
- **prisma/seed.ts** - Initial database seed data

## Key Conventions

### Frontend
- **Page Layout:** Each main page (Kanban, Dashboard, etc.) is a component that imports from `src/api/` and manages loading/error states
- **API Integration Pattern:** Use the `useApi` hook or call API modules directly, wrap with `LoadingSpinner` during loading
- **Data Fetching:** Replace `mockData.js` imports with `src/api/` module imports gradually; pages continue working with mock data until migrated
- **Authentication:** `AuthContext` provides `user`, `login()`, `logout()`, and auth state is persisted in localStorage
- **Token Refresh:** The API client automatically refreshes expired tokens on 401; if refresh fails, dispatch `devflow:logout` event

### Backend
- **Error Handling:** Use `AsyncHandler` wrapper for route handlers; throw custom errors via utils
- **Validation:** All routes use Zod schemas (validators/) for input validation before reaching handlers
- **Authentication:** JWT-based; `authMiddleware` checks token and attaches user to request
- **Role-based Access:** Some endpoints require role checks (e.g., GERENTE for user deletion)
- **Database:** Prisma handles all queries; migrations are version-controlled
- **Environment Variables:** Required for JWT secrets, database URL, CORS origin, etc. (see Back/prisma/README.md)

### API Response Format
All endpoints return JSON with standard patterns:
- **Success:** `{ data: {...}, message?: "..." }` (or list `[{...}]`)
- **Errors:** `{ error: "message", details?: {...} }` with appropriate HTTP status codes
- **Auth Errors:** 401 Unauthorized triggers token refresh; 403 Forbidden for insufficient roles

### Seed Data
**Credentials after running seed:**
- João Vitor Franze (GERENTE): joao.vitor@pucpr.edu.br / 123456
- Leander Reblin Hallu (DESENVOLVEDOR): leander.hallu@pucpr.edu.br / 123456

## Task Status Values
When creating or updating tasks via API, use these enum values:
- **Status:** `BACKLOG`, `AFAZER`, `PROGRESSO`, `REVISAO`, `CONCLUIDO`
- **Priority:** `CRITICA`, `ALTA`, `MEDIA`, `BAIXA`
- **Quadrants (prioritization):** `FAZER`, `AGENDAR`, `DELEGAR`, `ELIMINAR`

## Frontend-to-API Migration
The README in Front/ documents the migration from mock data to real API. Key pattern:

**Before:**
```jsx
import { components } from "../data/mockData";
```

**After:**
```jsx
import { useApi } from "../hooks/useApi";
import * as componentsApi from "../api/components";

const { data, loading, error } = useApi(componentsApi.getComponents);
```

## Environment Variables

### Backend (Back/prisma/.env)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for access tokens
- `JWT_EXPIRES_IN` - Access token TTL (default: 1h)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `JWT_REFRESH_EXPIRES_IN` - Refresh token TTL (default: 7d)
- `CORS_ORIGIN` - Frontend origin (default: http://localhost:5173)

## Important Notes

- The project is split into **two independent Node projects**: Front/ and Back/prisma/, each with its own package.json
- Frontend runs on port **5173** (Vite default), backend on **3001**
- CORS is configured for the frontend; adjust `CORS_ORIGIN` env var if needed
- Database is PostgreSQL (required for production; Docker includes it)
- The frontend README documents the complete API integration pattern with mock-to-real transitions
