# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack password manager monorepo with two packages:
- **`password-manager-frontend/`** — React 19 + TypeScript + Vite + Tailwind CSS
- **`secureault/`** — Express 5 + Node.js + TypeScript + PostgreSQL backend

## Commands

### Frontend (`password-manager-frontend/`)
```bash
npm run dev       # Dev server at http://localhost:5173
npm run build     # TypeScript compile + Vite bundle
npm run lint      # ESLint
npm run preview   # Preview production build
```

### Backend (`secureault/`)
```bash
npm run dev       # nodemon dev server at http://localhost:3000
npm run build     # tsc → dist/
npm start         # Run compiled dist/server.js
```

### Database Setup (run once before first backend start)
```bash
cd secureault && npx ts-node src/setup-database.ts
```

PostgreSQL must be running locally on port 5432 with database `securevault`.

## Architecture

### Backend (`secureault/src/`)
- **`server.ts`** — Express app, all route definitions, JWT middleware (`authenticateToken`)
- **`db.ts`** — PostgreSQL connection pool (hardcoded to localhost:5432, db: securevault)
- **`utils/crypto.ts`** — bcrypt helpers for master password hashing
- **`utils/encryption.ts`** — AES-256-GCM encrypt/decrypt; key derived via PBKDF2 from `(masterPassword, email)`
- **`setup-database.ts`** — Creates `users` and `vault_items` tables

**Security model:** Master passwords are bcrypt-hashed. Vault entries are AES-256-GCM encrypted using a PBKDF2-derived key from the user's master password + email. The IV and auth tag are stored alongside the ciphertext in `vault_items`.

**JWT secret** is currently hardcoded in `server.ts` as `"this-is-the-secure-key-for-test"` — not from env.

### Frontend (`password-manager-frontend/src/`)
- **`App.tsx`** — React Router setup; currently only `/login` route is active
- **`pages/`** — `Login.tsx` is implemented; `Register.tsx` and `Dashboard.tsx` are stubs
- **`services/api.ts`** — Axios client (base URL: `http://localhost:3000`), auth interceptor, `authAPI` and `passwordAPI` objects
- **`utils/auth.ts`** — LocalStorage token read/write helpers
- **`types/index.ts`** — Shared TypeScript interfaces (`User`, `LoginResponse`, `PasswordItem`, etc.)
- **`components/UI/`** — `Button.tsx` (primary/danger/secondary variants), `Input.tsx`

### API Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create user |
| POST | `/login` | No | Returns JWT |
| GET | `/me` | JWT | Current user profile |
| POST | `/passwords` | JWT | Create vault entry |
| GET | `/passwords` | JWT | List all entries |
| GET | `/passwords/:id` | JWT | Get decrypted entry |
| PUT | `/passwords/:id` | JWT | Update entry |
| DELETE | `/passwords/:id` | JWT | Delete entry |

### Database Schema
- **`users`**: `id`, `email` (UNIQUE), `master_password_hash`, `created_at`
- **`vault_items`**: `id`, `user_id` (FK), `website`, `username`, `encrypted_password`, `iv`, `auth_tag`, `notes`, `created_at`, `updated_at`
