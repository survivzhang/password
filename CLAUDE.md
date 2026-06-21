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

---

## Working Context (synced from memory)

### Learning Plan
This repo doubles as a junior-dev learning project — see `LEARNING_PLAN.md` (28-day plan). The owner (Zichen) is working through it for portfolio + interview prep.

**Teaching style (important):** When helping with a plan day, **guide — do not write the learner's code.** Explain *why* at each step, give skeletons with `// TODO` markers, and let them type it. Match their style: Chinese inline comments (e.g. `// 你的代码`), functional components, the patterns in `Login.tsx` / `Button.tsx`. Tie lessons back to the plan's interview questions.

**📓 Progress journal — READ THIS FIRST each session:** `doc/PROGRESS_LOG.md` is a one-line-per-day index linking to per-day detail files `doc/day-NN.md`. Read the index, then open the latest `day-NN.md` to resume exactly where the learner left off. After finishing a day, write a new `doc/day-NN.md` and add its one-line row to the top of the index. (This is separate from `LEARNING_PLAN.md`, which is the curriculum. Design lessons live in the plan as Days 21b–21f.)

**Progress (as of 2026-06-21):**
- ✅ Backend Weeks 1–2 (login, JWT, pg pool, bcrypt, AES encryption, full passwords CRUD), Day 15 React basics, Day 16 `useState`, Day 17 (Dashboard fetch), Day 18 (routing — `useNavigate` to `/dashboard`), Day 13 (CORS). Login works end-to-end (browser-verified).
- ⬜ Not done: Day 17b (loading/empty/delete + View), Day 19 (Axios 401 redirect), Day 20 `Register.tsx` (empty stub), Day 21+ (Tailwind + design 21b–21f), plus skipped backend items — helmet/rate-limit (Day 13b), global error middleware (Day 22), `.env` (Day 26), tests (Day 27).

### Local Dev Setup
- **PostgreSQL:** `brew services start postgresql@18` (binaries: `/opt/homebrew/opt/postgresql@18/bin`). DB `securevault` with tables `users`, `vault_items` already exist.
- **Start order:** postgres → `cd secureault && npm run dev` (:3000) → `cd password-manager-frontend && npm run dev` (:5173).
- **Test account (LOCAL TEST DATA only — not a real secret):** `test@test.com` / `TestPassword123!` (user id 1).
- **⚠️ Port 3000 conflict:** The owner's Coursebox work app (Next.js `next-server`) also uses port 3000 — same as the SecureVault backend and the frontend `api.ts` baseURL. If a `curl localhost:3000` returns a Coursebox 404 page, the wrong server has the port. Resolve by stopping one or moving SecureVault to another port — confirm with the owner first.
