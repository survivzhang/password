# 📅 Day 17 (+18) — Dashboard data fetching, routing, and CORS

*2026-06-21* · Covers plan Days 17 & 18, plus Day 13 (CORS).

### 🎯 What I was trying to do
Build the **Dashboard** to fetch the real vault list from the backend and show it,
then wire **routing** so login actually navigates there.

### 🐛 Issues I faced (and the fix)
1. **`.map()` printed as plain text** — wrote `passwords.map(...)` bare in JSX.
   → JSX needs `{ }` to switch into JavaScript: `{passwords.map(...)}`.
2. **Nothing rendered** — no component wrapper.
   → A page must be `function Dashboard() { return (...) }` + `export default`.
3. **`<Route ... />` syntax error** — missing the self-closing `/>`.
4. **`await` without `async`** — can't `await` in a plain `useEffect` callback.
   → Define an inner `async` function inside the effect, then call it.
5. **`setpasswords = data.password`** — wrong 3 ways.
   → Setters are **functions you call**, not variables you assign: `setPasswords(data.passwords)`.
   Backend returns `{ passwords: [...] }`, so take `data.passwords` (plural).
6. **Hooks outside the component** → "Invalid hook call".
   → `useState` / `useEffect` only work **inside** the component function.
7. **`Property 'id' does not exist on type 'never'`** — `useState([])` infers `never[]`.
   → `useState<PasswordItem[]>([])`.
8. **`PasswordItem must be a type-only import`** (ts1484, `verbatimModuleSyntax`).
   → `import type { PasswordItem } from "../types"`.
9. **Browser login failed but `curl` worked** = **CORS**. Frontend (:5173) → backend (:3000) is cross-origin.
   → Day 13: `npm install cors` + `app.use(cors())` in `server.ts`. (curl ignores CORS; only browsers enforce it.)
10. **Port 3000 was taken by my Coursebox (Next.js) work app** — backend couldn't bind.
    → Stopped the Coursebox server to free the port.

### 💡 What I learned
- **JSX:** `{ }` drops JavaScript into markup; a component is a function returning JSX.
- **`useState`:** never assign with `=`; always call the setter so React re-renders. Empty array needs a generic type.
- **`useEffect`:** callback can't be `async`; use an inner async function. `[]` deps = run once on mount.
- **Data shape matters:** frontend must match what the backend returns. `GET /passwords` returns **metadata only — no decrypted password**; plaintext comes only from `GET /passwords/:id` (least-exposure security).
- **TypeScript:** `import type` for interfaces; generics like `useState<T[]>` give autocomplete + catch typos.
- **Routing:** `useNavigate()` switches pages without a full reload (SPA); use it instead of `window.location`.
- **CORS:** browser-only rule; fixable only on the **backend**.
- **Auth pattern (already correct):** every vault route uses `authenticateToken`; frontend route protection is just UX — the real lock is the backend JWT check.

### ✅ What we actually did
- `Dashboard.tsx`: `useState<PasswordItem[]>([])` + `useEffect` + `passwordAPI.getAll()` → `setPasswords(data.passwords)`.
- `App.tsx`: added the `/dashboard` route.
- `Login.tsx`: (Day 18) `useNavigate()` to `/dashboard` after login. *(verify in place next session)*
- `server.ts`: added `import cors` + `app.use(cors())`.
- Verified the full **login → navigate → fetch** flow in the real browser with Playwright. ✅
- Committed + pushed (`a5bc860`) to `origin/master`; remote updated to renamed repo `password.git`.
- Reorganized the plan: added design lessons **Day 21b–21f** into `LEARNING_PLAN.md` (single source).

### 📍 Where I am
Done through **Day 18**. Login works end-to-end; Dashboard fetches real data.

### ⏭️ Next session
- **Day 17b** — Dashboard polish: `loading` state, empty state, Delete button, View button (decrypt one via `getOne`).
- Then **Day 19** (Axios 401 → redirect), **Day 20** (Register page), **Day 21+** (Tailwind + design 21b–21f).
- **Startup:** postgres → backend (`:3000`) → frontend (`:5173`). Test login: `test@test.com` / `TestPassword123!`. Watch the port-3000 clash with Coursebox.
