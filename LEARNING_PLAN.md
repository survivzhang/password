# 🎓 Junior Developer Learning Plan — SecureVault Password Manager

A 28-day plan to turn this project into a **portfolio piece + interview prep**.
Each day = 1–2 hours. Pick the days that match what you already know.

---

## 📖 How to Use This Plan

Every day has 4 sections:

1. **🎯 Goal** — what you should be able to do by end of day
2. **📚 Learn** — concepts to read about (with keywords to Google)
3. **💻 Do** — concrete tasks to perform in this codebase
4. **❓ Interview Questions** — what real interviewers ask about this topic

Write your answers to interview questions in a notebook (or a `notes/` folder).
**Explaining out loud beats re-reading.** If you can teach it, you know it.

---

# 🗓️ WEEK 1 — Foundations (Web, HTTP, Node, Express)

## Day 1 — How the Web Works

### 🎯 Goal
Explain what happens when you type a URL and press Enter.

### 📚 Learn
- Client vs Server
- HTTP request / response cycle
- DNS, IP, ports (why backend runs on `:3000`, frontend on `:5173`)
- HTTP methods: `GET`, `POST`, `PUT`, `DELETE`
- HTTP status codes: 2xx, 3xx, 4xx, 5xx

### 💻 Do
- Open `secureault/src/server.ts`. Find every `app.get`, `app.post`, `app.put`, `app.delete`. List them in a notebook.
- Start the backend: `cd secureault && npm run dev`
- Open browser → `http://localhost:3000/health` → see the JSON response.

### ❓ Interview Questions
1. What is the difference between `GET` and `POST`?
2. What does status code `401` mean? `403`? `404`? `500`?
3. What happens when you type `google.com` in the browser?
4. What is the difference between frontend and backend?

---

## Day 2 — Node.js & npm

### 🎯 Goal
Understand what Node.js is and how dependencies work.

### 📚 Learn
- What is Node.js? (JavaScript runtime, V8 engine)
- `package.json` — `dependencies` vs `devDependencies`
- `package-lock.json` — why it exists
- `npm install`, `npm run <script>`
- What is `node_modules/`?

### 💻 Do
- Open `secureault/package.json`. Pick the **top 5** dependencies and write 1 sentence each: "What does it do?" (Suggested: `express`, `pg`, `bcrypt`, `jsonwebtoken`, `typescript`.)
- Same for `password-manager-frontend/package.json`. Top 5: `react`, `react-dom`, `react-router-dom`, `axios`, `tailwindcss`.
- Try: `cd secureault && npm list --depth=0`

### ❓ Interview Questions
1. What is Node.js? Why is it "single-threaded but non-blocking"?
2. What is the event loop?
3. Difference between `dependencies` and `devDependencies`?
4. What is `npm` vs `npx`?

---

## Day 3 — Express.js Basics

### 🎯 Goal
Understand routing and middleware in Express.

### 📚 Learn
- What is a web framework?
- Express routing (`app.get('/path', handler)`)
- Middleware: `app.use(express.json())` — why?
- `req` (request) and `res` (response) objects

### 💻 Do
- In `server.ts`, add a new route: `app.get("/hello/:name", ...)` that returns `{ greeting: "Hello, NAME" }`.
- Test it in the browser: `http://localhost:3000/hello/Zichen`.
- Read `app.use(express.json())` on line 12 — what happens if you delete it? Try it!

### ❓ Interview Questions
1. What is middleware in Express?
2. What is the order of middleware execution?
3. What does `next()` do?
4. How do you handle errors in Express?

---

## Day 4 — RESTful API Design

### 🎯 Goal
Understand REST principles by looking at this project's API.

### 📚 Learn
- What is REST?
- Resources vs actions (`/passwords` is a resource, not `/getPasswords`)
- URL design conventions
- Idempotency: `GET`, `PUT`, `DELETE` are idempotent; `POST` is not

### 💻 Do
- Make a table of all 5 password endpoints (`POST /passwords`, `GET /passwords`, `GET /passwords/:id`, `PUT /passwords/:id`, `DELETE /passwords/:id`). For each, write: method, URL, what it does, what it returns.
- Bonus: add the 3 auth/user endpoints (`/register`, `/login`, `/me`) to the same table — 8 total.
- Why is `GET /passwords/:id` used instead of `GET /password?id=5`? (REST style)

### ❓ Interview Questions
1. What is REST? What are RESTful principles?
2. When to use `PUT` vs `PATCH`?
3. What does "idempotent" mean?
4. What's the difference between `200 OK` and `201 Created`?

---

## Day 5 — Async JavaScript (THE most asked topic)

### 🎯 Goal
Master `async`/`await`, Promises, callbacks. **This is #1 in interviews.**

### 📚 Learn
- Synchronous vs asynchronous code
- Callbacks → Promises → async/await (the evolution)
- `try/catch` with `async`
- The event loop (rewatch — connects to Day 2)

### 💻 Do
- Find every `async` function in `server.ts`. Why is it async? (Hint: database calls)
- What happens if you remove `await` from line 73 `await pool.query(...)`? (Bug: user object is a Promise, not a row)
- Rewrite ONE `async/await` function using `.then()/.catch()` to see the difference.

### ❓ Interview Questions
1. What is a Promise? What are its three states?
2. Difference between `async/await` and Promises?
3. What is the event loop? Explain microtasks vs macrotasks.
4. What does `Promise.all` do? Difference from `Promise.allSettled`?
5. What does `Promise.race` do? When would you use it? (Hint: timeout patterns.)

---

## Day 6 — TypeScript Basics

### 🎯 Goal
Read and write basic TypeScript types.

### 📚 Learn
- Why TypeScript? (Catch errors before runtime)
- Basic types: `string`, `number`, `boolean`, `any`, `unknown`, `void`
- Interfaces vs types
- Generics (intro only)
- `Request`, `Response`, `NextFunction` types

### 💻 Do
- Look at `password-manager-frontend/src/types/index.ts`. Read every interface.
- In `server.ts` line 22, there is `(req as any).user`. Why `as any`? What's the better way? (Module augmentation — extend the `Request` type)
- Try: change `let plaintext` in `encryption.ts` to `let plaintext: number`. See the TS error.

### ❓ Interview Questions
1. What is TypeScript? Why use it over JavaScript?
2. Difference between `interface` and `type`?
3. What is a generic? Give an example.
4. What is `any` vs `unknown`?

---

## Day 7 — Review + Git Basics

### 🎯 Goal
Use git confidently for daily work.

### 📚 Learn
- `git status`, `git add`, `git commit`, `git push`, `git pull`
- Branches: `git checkout -b feature/x`
- Merge vs Rebase (read about, no need to master yet)
- `.gitignore` — why we ignore `node_modules` and `.env`

### 💻 Do
- Run `git log --oneline` in this repo. Read past commit messages.
- Create a branch: `git checkout -b learning/day-7`
- Add a comment to `server.ts`, commit it: `git commit -m "docs: my first learning commit"`
- Review Days 1–6 questions out loud.

### ❓ Interview Questions
1. Difference between `git merge` and `git rebase`?
2. What is `git stash`?
3. What is a merge conflict? How do you resolve one?
4. What is the difference between `git fetch` and `git pull`?

---

# 🗓️ WEEK 2 — Database, Security, Authentication

## Day 8 — SQL & PostgreSQL Basics

### 🎯 Goal
Read and write basic SQL queries.

### 📚 Learn
- What is a relational database?
- Tables, rows, columns, primary key, foreign key
- `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- `WHERE`, `ORDER BY`, `LIMIT`
- `JOIN` (INNER, LEFT)
- **Aggregates:** `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- **`GROUP BY` and `HAVING`** — `WHERE` filters rows before grouping, `HAVING` filters groups after

### 💻 Do
- Read `secureault/src/setup-database.ts`. List both tables and their columns.
- Open psql: `psql securevault`
- Try: `SELECT * FROM users;` and `SELECT * FROM vault_items;`
- Write a query: get all vault items for user with id = 1.
- Write a `GROUP BY` query: count how many vault entries each user has — `SELECT user_id, COUNT(*) FROM vault_items GROUP BY user_id;`
- Add a `HAVING` clause: only show users with more than 2 entries.

### ❓ Interview Questions
1. What is a primary key? Foreign key?
2. What is the difference between `INNER JOIN` and `LEFT JOIN`?
3. What is an index? When should you use one?
4. SQL vs NoSQL — when to use each?

---

## Day 9 — SQL Injection & Parameterized Queries

### 🎯 Goal
Understand the #1 web vulnerability and how this project prevents it.

### 📚 Learn
- What is SQL injection?
- Why string concatenation in SQL is dangerous
- Parameterized queries (`$1`, `$2` in `pg`)

### 💻 Do
- In `server.ts` line 74, see `WHERE email = $1`. Why `$1` instead of `WHERE email = '${email}'`?
- Write down: if we used string concatenation and someone enters `admin'; DROP TABLE users; --` as email, what would happen?

### ❓ Interview Questions
1. What is SQL injection? Give an example.
2. How does parameterized queries prevent injection?
3. What other OWASP Top 10 attacks do you know? (XSS, CSRF, etc.)

---

## Day 10 — Password Hashing (bcrypt)

### 🎯 Goal
Understand why we never store passwords as plain text.

### 📚 Learn
- Hashing vs Encryption (one-way vs two-way)
- Why MD5 / SHA-1 are bad for passwords
- bcrypt: salt, cost factor, rainbow tables
- Why we re-hash on login (timing attacks)

### 💻 Do
- Open `secureault/src/utils/crypto.ts`. Read the `PasswordHasher` class.
- In `server.ts` line 82: `PasswordHasher.hash(masterPassword)` — what's stored in DB?
- Try: `psql securevault -c "SELECT email, master_password_hash FROM users;"` — see the bcrypt hash.

### ❓ Interview Questions
1. Why do we hash passwords instead of encrypting them?
2. What is a salt? Why is it needed?
3. Why is bcrypt slow on purpose?
4. What is a rainbow table attack?

---

## Day 11 — Symmetric Encryption (AES-256-GCM)

### 🎯 Goal
Understand how the actual passwords (in the vault) are encrypted.

### 📚 Learn
- Symmetric vs Asymmetric encryption
- AES-256-GCM (block cipher, authenticated encryption)
- IV (Initialization Vector) — why random per encryption
- Auth Tag — how it prevents tampering
- PBKDF2 — turning a password into a 32-byte key

### 💻 Do
- Read `secureault/src/utils/encryption.ts` line-by-line.
- Trace one password through the system:
  - User logs in → `deriveKey(masterPassword, email)` → key
  - Save password → `encrypt(text, key)` → ciphertext + iv + authTag → DB
  - View password → `decrypt(...)` → original text
- Why is the encryption key stored in the JWT (line 141) and NEVER in the database?

### ❓ Interview Questions
1. Difference between symmetric and asymmetric encryption?
2. Why is AES-256 considered secure?
3. What is HTTPS? Where does encryption happen?
4. What is end-to-end encryption?

---

## Day 12 — JWT (JSON Web Tokens)

### 🎯 Goal
Understand how stateless authentication works.

### 📚 Learn
- Sessions (stateful) vs JWT (stateless)
- JWT structure: `header.payload.signature` (3 parts, base64)
- Signing vs Encrypting
- Where to store JWT: localStorage vs httpOnly cookie (trade-offs)
- Token expiration, refresh tokens

> 🔍 **What this project does:** stores the JWT in `localStorage` (see `utils/auth.ts`). This is pragmatic and common, but it's **vulnerable to XSS** — any injected script can read `localStorage`. The more secure choice is an **httpOnly cookie** (JS can't read it) plus CSRF protection. Production password managers (1Password, Bitwarden) use httpOnly cookies. Be ready to explain this trade-off in an interview.

### 💻 Do
- In `server.ts` line 137, see `jwt.sign(...)`. Read the payload — what's inside?
- After login, copy your token. Paste it into https://jwt.io — see the decoded payload.
- Read the `authenticateToken` middleware (line 14). Trace the flow:
  - Request comes in → check `Authorization: Bearer <token>` → verify → attach `user` to `req`

### ❓ Interview Questions
1. What is JWT? What does it stand for?
2. Difference between authentication and authorization?
3. JWT vs Session — pros and cons?
4. What happens if a JWT is stolen? How to mitigate?
5. Where should you store JWT on the frontend? Why?

---

## Day 13 — Express Middleware Deep Dive

### 🎯 Goal
Write your own middleware.

### 📚 Learn
- Middleware signature: `(req, res, next) => {...}`
- Built-in: `express.json()`, `express.static()`
- Third-party: `cors`, `helmet`, `morgan`
- Error-handling middleware (4 args)

### 💻 Do
- Add a logger middleware that prints `[METHOD] [URL]` for every request. (Right after `app.use(express.json())`)
- Notice the project has **no CORS** yet. The frontend at `:5173` can't call the backend at `:3000`. Install `cors` and add it.
  ```bash
  cd secureault && npm install cors @types/cors
  ```
  Then in `server.ts`: `app.use(cors())`

### ❓ Interview Questions
1. What is CORS? Why does it exist?
2. What is a preflight request?
3. How do you handle errors globally in Express?
4. What is `helmet` and why use it?

---

## Day 13b — Security Hardening (helmet + rate limiting)

### 🎯 Goal
Add the two security middlewares every production API needs — especially a password manager.

### 📚 Learn
- `helmet` — sets ~15 security headers in one line (CSP, HSTS, X-Frame-Options, etc.)
- `express-rate-limit` — limits how many requests an IP can make in a time window. Critical on `/login` to prevent brute-force attacks.
- Why rate-limit `/login` and `/register` specifically (auth endpoints are the highest-value target)

### 💻 Do
```bash
cd secureault && npm install helmet express-rate-limit
```

In `server.ts`:
```ts
import helmet from "helmet";
import rateLimit from "express-rate-limit";

app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 attempts per IP per window
  message: { error: "Too many attempts, try again in 15 minutes" },
});

app.post("/login", authLimiter, async (req, res) => { ... });
app.post("/register", authLimiter, async (req, res) => { ... });
```

Test it: hit `/login` 6 times in a row with wrong credentials. The 6th should return 429 Too Many Requests.

### ❓ Interview Questions
1. What is a brute-force attack? How does rate limiting stop it?
2. What is CSP (Content Security Policy)? What attack does it prevent?
3. What is HSTS? Why does it matter?
4. Why is the `X-Frame-Options` header important? (Hint: clickjacking)
5. Should you rate-limit per IP or per account? (Trade-off: per-IP can be defeated by botnets; per-account can lock real users out — best is both, layered.)

---

## Day 14 — Review + Refactor

### 🎯 Goal
Identify code smells in `server.ts`.

### 💻 Do
- The JWT secret is hardcoded (`server.ts:9`). **Note the smell** — we'll fix it properly on Day 26 when we cover `.env` files end-to-end. (If you're impatient, the answer is `process.env.JWT_SECRET` + the `dotenv` package.)
- Lots of validation logic is duplicated between `/register` and `/login` (email regex, length checks, type checks). Extract to a helper function `validateAuthInput(email, masterPassword)` that returns either `null` or `{ error: "..." }`.
- Review all Week 2 interview questions out loud.

### ❓ Interview Questions (combined)
1. Walk me through what happens when a user logs in (start to finish).
2. Walk me through how a vault password is saved (start to finish).
3. Why is the encryption key not stored in the database?

---

# 🗓️ WEEK 3 — Frontend (React, TypeScript, Tailwind)

## Day 15 — React Basics

### 🎯 Goal
Understand components, JSX, and props.

### 📚 Learn
- Component-based architecture
- JSX (syntactic sugar for `React.createElement`)
- Functional components
- Props
- Conditional rendering: `{condition && <X/>}`, ternary
- List rendering with `.map()` (and the `key` prop)

### 💻 Do
- Read `password-manager-frontend/src/App.tsx`.
- Read `pages/Login.tsx` — identify: components, props, JSX, conditional rendering.
- Read `components/UI/Button.tsx` and `Input.tsx`.

### ❓ Interview Questions
1. What is React? Why use it?
2. What is JSX? Is it required?
3. What is the Virtual DOM?
4. Why do we need a `key` when rendering lists?

---

## Day 16 — React Hooks: `useState`

### 🎯 Goal
Manage component state.

### 📚 Learn
- What is state? Why not just use variables?
- `useState` syntax
- State is asynchronous (batched)
- Functional updates: `setCount(c => c + 1)`

### 💻 Do
- Find all `useState` calls in `Login.tsx`. List them.
- In `Login.tsx`, add a `showPassword` state. Toggle the password input between `type="password"` and `type="text"`.

### ❓ Interview Questions
1. What is `useState`? Why not use a regular variable?
2. Why is state asynchronous?
3. What happens if you call `setState` inside the render?
4. Difference between props and state?

---

## Day 17 — React Hooks: `useEffect`

### 🎯 Goal
Handle side effects (API calls, subscriptions).

### 📚 Learn
- What is a "side effect"?
- `useEffect(fn, [deps])` — when does it run?
- Dependency array: `[]` (once), `[x]` (when x changes), no array (every render)
- Cleanup functions
- Common mistake: infinite loops

### 💻 Do
- Open `pages/Dashboard.tsx` (it's a stub — empty file).
- Render a hardcoded array first: `const passwords = [{id:1, website:"github.com", username:"me"}, ...]` → `passwords.map(p => <div key={p.id}>{p.website}</div>)`. Make sure that works.
- Then replace the hardcoded array with `useState([])` + `useEffect(() => { passwordAPI.getAll().then(...) }, [])`.
- Add a `console.log` inside the effect — confirm it runs **once** on mount, not on every render.

### ❓ Interview Questions
1. What is `useEffect`? When does it run?
2. What does an empty dependency array `[]` mean?
3. When do you need a cleanup function?
4. What is the React lifecycle? (mount, update, unmount — in functional components, all of this is `useEffect` with different dep arrays)

---

## Day 17b — Dashboard Polish (loading + empty + delete)

### 🎯 Goal
Turn yesterday's bare list into a usable dashboard.

### 📚 Learn
- The three-state pattern: `loading` / `error` / `data`
- Why empty state matters (UX, not just edge case)
- Optimistic UI updates vs refetch-after-mutate

### 💻 Do
- Add a `loading` boolean state — show "Loading..." while the fetch is in flight.
- Add an **empty state**: if `passwords.length === 0`, show "No passwords saved yet."
- Add a "Delete" button on each row that calls `passwordAPI.delete(id)` then refetches.
- Add a "View" button that calls `passwordAPI.getOne(id)` and `alert()`s the decrypted password (we'll make this prettier on Day 21).

### ❓ Interview Questions
1. What are the three states every async UI must handle?
2. What's the difference between optimistic update and refetch?
3. Why might calling `setState` inside `useEffect` cause an infinite loop?

---

## Day 18 — React Router

### 🎯 Goal
Build a multi-page app.

### 📚 Learn
- Client-side routing vs server-side routing (SPA)
- `<BrowserRouter>`, `<Routes>`, `<Route>`
- `useNavigate`, `useParams`, `<Link>`
- Protected routes pattern

### 💻 Do
- In `App.tsx`, the only page-rendering route is `/login` (the `/` route just redirects to it). Add routes for:
  - `/register` → `<Register />`
  - `/dashboard` → `<Dashboard />` (only if logged in!)
- After successful login in `Login.tsx`, navigate to `/dashboard`.
- Build a `ProtectedRoute` component that redirects to `/login` if no JWT in localStorage. (You'll refactor this to use Context on Day 23.)

### ❓ Interview Questions
1. What is a Single Page Application (SPA)?
2. SPA vs MPA — pros and cons?
3. Client-side routing vs server-side routing?
4. How do you implement protected routes?

---

## Day 19 — Axios & API Layer

### 🎯 Goal
Understand the frontend↔backend connection.

### 📚 Learn
- `fetch` vs `axios`
- Interceptors (request/response)
- HTTP headers (`Authorization`, `Content-Type`)
- Handling errors from API calls

### 💻 Do
- Read `services/api.ts` end to end.
- Find the **request interceptor** that adds the `Authorization: Bearer <token>` header.
- A **response interceptor** already exists (lines 22–39) but only `console.log`s errors. **Enhance the 401 branch**: clear localStorage (`authUtils.removeToken()`) and redirect the user to `/login` (use `window.location.href = "/login"` for a full reload, or import a navigate function).

### ❓ Interview Questions
1. Difference between `fetch` and `axios`?
2. What are HTTP headers? Give 5 examples.
3. How do you handle token expiration?
4. What is CORS error? How does frontend solve it? (Answer: backend must set headers, not frontend.)

---

## Day 20 — Forms & Validation

### 🎯 Goal
Build a controlled form with client-side validation.

### 📚 Learn
- Controlled vs Uncontrolled components
- `onChange`, `onSubmit`
- `e.preventDefault()` — why
- Validation: client-side (UX) + server-side (security)

### 💻 Do
- Build `Register.tsx`: email + master password + confirm password.
- Validate:
  - Email format
  - Master password ≥ 12 chars (match backend rule on `server.ts:69`)
  - Passwords match
- On submit, call `authAPI.register()`.

### ❓ Interview Questions
1. Controlled vs Uncontrolled components?
2. Why do we need both client-side AND server-side validation?
3. How do you handle form submission in React?

---

## Day 21 — Tailwind CSS

### 🎯 Goal
Style components without writing CSS files.

### 📚 Learn
- Utility-first CSS
- Responsive design: `sm:`, `md:`, `lg:` prefixes
- Flexbox & Grid (`flex`, `grid`)
- Hover/focus states: `hover:`, `focus:`
- **Accessibility basics:** semantic HTML (`<button>` not `<div onClick>`), `aria-label` for icon-only buttons, visible focus rings, sufficient color contrast.

### 💻 Do
- Make the Dashboard look nice:
  - Each password = a card with shadow + rounded corners
  - "Show" button toggles password visibility — use a real `<button>` with `aria-label="Show password"` (icon-only buttons need a label for screen readers)
  - "Delete" button with confirm dialog — `aria-label="Delete entry for github.com"` so screen-reader users know which row they're deleting
- Make it responsive (1 column on mobile, 2 on desktop).
- Run a Lighthouse accessibility audit in Chrome DevTools — aim for a score ≥ 90.

### ❓ Interview Questions
1. Flexbox vs Grid — when to use each?
2. What is the box model? (content, padding, border, margin)
3. What does `position: absolute` do? `relative`? `fixed`?
4. Difference between `display: none` and `visibility: hidden`?

---

# 🗓️ WEEK 4 — Integration, Polish, Interview Prep

## Day 22 — Error Handling (Frontend AND Backend)

### 🎯 Goal
Handle errors on both sides. Right now, **the backend has a real bug** — let's fix it.

### 🐛 The Backend Bug
Open `secureault/src/server.ts`. Look at any `async` handler — e.g., `/register` (line 53), `/login` (line 101), `/passwords` (line 158). **None of them have `try/catch`.**

If `pool.query(...)` throws (e.g., DB down, constraint violation), the rejected Promise goes nowhere useful. In Express 4 the request would hang forever. Express 5 auto-forwards to the default error handler, which returns an opaque 500 with a stack trace — bad UX and a security leak.

### 📚 Learn
- Express error-handling middleware: `(err, req, res, next) => {...}` — note the **4 args** (Express recognizes it by arity)
- `.catch(next)` pattern, or wrapping handlers in a `asyncHandler(fn)` helper
- Why you should never leak stack traces to the client in production

### 💻 Do (Backend)
1. Add an error middleware at the **end** of `server.ts` (after all routes, before `app.listen`):
   ```ts
   app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
     console.error(err);
     res.status(500).json({ error: "Internal server error" });
   });
   ```
2. Wrap one async route in `try { ... } catch (err) { next(err); }` — try `/register`.
3. Or write an `asyncHandler` helper and wrap all of them:
   ```ts
   const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
     Promise.resolve(fn(req, res, next)).catch(next);
   ```
4. Test it: stop PostgreSQL (`brew services stop postgresql`), call `/login`. You should get a clean `{ error: "Internal server error" }` instead of a hang or stack trace.

### 💻 Do (Frontend)
Add to Dashboard:
- `loading` state → show spinner
- `error` state → show error message
- `success` → show data
- Pattern:
  ```tsx
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <List items={data} />;
  ```

### ❓ Interview Questions
1. How do you handle errors in Express? Why does the error middleware need 4 arguments?
2. How do you handle errors in React?
3. What is an Error Boundary?
4. What's the difference between an error and an exception?
5. Why should you never send stack traces to the client?

---

## Day 23 — Context API (Global State)

### 🎯 Goal
Avoid prop drilling.

### 📚 Learn
- Prop drilling problem
- `createContext`, `useContext`, `Provider`
- When NOT to use Context (use local state when you can)

### 💻 Do
- Create an `AuthContext` that holds: `user`, `token`, `login()`, `logout()`.
- Wrap `App` in `<AuthProvider>`.
- Use `useAuth()` in Login, Dashboard, and **refactor** the `ProtectedRoute` you built on Day 18 — replace its raw `localStorage.getItem("token")` check with `const { token } = useAuth()`. Same behavior, but now state lives in one place.

### ❓ Interview Questions
1. What is prop drilling?
2. Context API vs Redux — when to use each?
3. What is the React state management ecosystem? (useState, useReducer, Context, Zustand, Redux, Jotai)

---

## Day 24 — Custom Hooks

### 🎯 Goal
Extract reusable logic.

### 📚 Learn
- Rules of hooks (only at top level, only in components/other hooks)
- Naming convention: `useXyz`

### 💻 Do
- Build `usePasswords()` that returns `{ passwords, loading, error, refetch, delete }`.
- Use it in Dashboard. Now Dashboard component is simple — all logic in the hook.

### ❓ Interview Questions
1. What is a custom hook?
2. What are the rules of hooks? Why?
3. Give an example of when you'd build a custom hook.

---

## Day 25 — Performance: `useMemo`, `useCallback`, `React.memo`

### 🎯 Goal
Know when (and when NOT) to optimize.

### 📚 Learn
- Re-renders: why they happen
- `useMemo` — cache computed values
- `useCallback` — cache function references
- `React.memo` — skip re-render if props don't change
- **Premature optimization is the root of all evil.** Don't add these by default.

### 💻 Do
- Add a search input to Dashboard. Filter the password list.
- Use `useMemo` to memoize the filtered list (only if list is large).
- Use React DevTools Profiler to measure renders.

### ❓ Interview Questions
1. What causes a React re-render?
2. Difference between `useMemo` and `useCallback`?
3. When should you NOT use them?
4. How does `React.memo` work?

---

## Day 26 — Environment Variables & Config

### 🎯 Goal
Don't hardcode secrets and URLs.

### 📚 Learn
- `.env` files
- Frontend: `VITE_*` prefix required
- Backend: `dotenv` package
- Never commit `.env` to git

### 💻 Do
- Backend: move `JWT_SECRET` and DB credentials to `.env`.
- Frontend: move API base URL (`http://localhost:3000`) to `VITE_API_URL`.
- Add both `.env` files to `.gitignore`. Add `.env.example` for docs.

### ❓ Interview Questions
1. Why don't we commit `.env` to git?
2. What is the difference between build-time and runtime env vars?
3. How do you manage secrets in production?

---

## Day 27 — Testing Basics

### 🎯 Goal
Write your first tests.

### 📚 Learn
- Unit tests vs Integration tests vs E2E
- Jest / Vitest basics: `describe`, `it`, `expect`
- React Testing Library: `render`, `screen`, `fireEvent`
- AAA pattern: Arrange, Act, Assert

### 💻 Do
**Frontend (Vitest + React Testing Library):**
- Install Vitest: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- Write 3 tests for the `Button` component (renders text, calls `onClick`, respects `disabled`).
- Write 1 test for `utils/auth.ts` (token save/get/remove round-trip).

**Backend (3 tests, not just 1):**
- Test 1 — `utils/encryption.ts`: `encrypt → decrypt` returns the original string.
- Test 2 — `utils/crypto.ts`: `PasswordHasher.hash → PasswordHasher.verify(correct password)` returns `true`; verify with wrong password returns `false`.
- Test 3 — `deriveKey(password, email)`: same inputs → same key; different email → different key. (Proves PBKDF2 is deterministic.)

**Stretch:** integration test on `/register` with `supertest` — POST with a short password, assert response is 400.

### ❓ Interview Questions
1. Difference between unit, integration, and E2E tests?
2. What is mocking? When to use it?
3. What is test coverage? Is 100% coverage the goal?
4. TDD vs BDD?

---

## Day 28 — Deployment & Production Concerns

### 🎯 Goal
Get the app online.

### 📚 Learn
- Frontend hosting: Vercel, Netlify
- Backend hosting: Railway, Render, Fly.io
- Database hosting: Neon, Supabase
- HTTPS, environment variables in production
- CORS in production (specific origins, not `*`)

### 💻 Do
- Deploy frontend to Vercel (drag-and-drop `dist/` folder, or connect repo).
- Deploy backend to Railway/Render.
- Move database to Neon (managed Postgres).
- Update `VITE_API_URL` to point to production backend.

### ❓ Interview Questions
1. What is CI/CD?
2. Difference between development, staging, production?
3. What happens during `npm run build`?
4. What is a Docker container? (Bonus — read for awareness)

---

# 🎯 BONUS: Top 30 Interview Questions (Cheat Sheet)

Practice answering these **out loud**. Time yourself: ≤ 2 min each.

### JavaScript / TypeScript
1. `var` vs `let` vs `const`?
2. `==` vs `===`?
3. What is hoisting?
4. What is closure? Give a real example.
5. What is `this` in JavaScript?
6. Arrow function vs regular function?
7. What is destructuring? Spread vs rest?
8. Deep copy vs shallow copy?

### React
9. Class components vs functional components?
10. Why is `key` important in lists?
11. Explain the React component lifecycle. (Modern functional components: mount = `useEffect(fn, [])`, update = `useEffect(fn, [deps])`, unmount = the cleanup function returned from `useEffect`.)
12. Controlled vs uncontrolled inputs?
13. What is `useEffect` cleanup for?
14. How do you optimize a slow React app?

### Backend / Node
15. What is the event loop?
16. Process vs Thread?
17. What is middleware in Express?
18. REST vs GraphQL?
19. How does Node handle concurrency?

### Database
20. SQL vs NoSQL?
21. What is ACID?
22. What is an index? Trade-offs?
23. Normalization vs denormalization?

### Security
24. SQL injection — what and how to prevent?
25. XSS — what and how to prevent?
26. CSRF — what and how to prevent?
27. JWT vs Session?
28. Hashing vs encryption?

### General / Behavioral
29. Tell me about a hard bug you solved. (Use STAR: Situation, Task, Action, Result)
30. How would you design a URL shortener? (System design intro)

---

# 📌 Daily Routine (Recommendation)

```
Morning  (30 min): Read the day's "Learn" section. Google keywords.
Midday   (60 min): Do the "Do" tasks in the codebase.
Evening  (30 min): Write answers to interview questions in your notebook.
Weekly   (Sat):    Review the week. Push to GitHub. Write README updates.
```

---

# 🚀 After Day 28 — What's Next?

1. **Build another project.** A todo app. A blog. Apply the same patterns.
2. **Add features here:**
   - Password generator (random secure passwords)
   - Categories / tags for vault items
   - Search by website
   - Import/export CSV
   - 2FA with TOTP
3. **Learn one new thing per week:** Docker, GraphQL, Redis, WebSockets, Next.js, Testing Library...
4. **Open source contributions.** Find a beginner-friendly issue on GitHub.
5. **Apply for jobs.** Don't wait until you "know everything." You never will.

---

**Good luck. Build things. Break things. Fix them. That's the job.** 🎓
