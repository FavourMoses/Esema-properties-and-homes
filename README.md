# Esema Properties & Homes

A real estate + property-verification website for Esema Properties & Homes:
a public site for browsing and inquiring about properties (owned by Esema,
or third-party properties Esema verifies and brokers anywhere in Nigeria),
and a password-protected admin dashboard where every word, image, property,
service, and bank account on the site can be edited — nothing is hardcoded.

## What's inside

- **Public site**: Home, Properties (browse/filter/detail), Services (Land
  Verification, Site Inspection Reports, Construction Monitoring, Vetted
  Builders Network), Projects, About, Contact.
- **Admin dashboard** (`/admin`): Properties, Services, Projects,
  Testimonials, Team, Bank Accounts, Leads inbox, and Site Settings
  (hero text, logo, about page, contact details, social links).
- **No payment gateway** — bank account details are simply displayed on a
  verified property's page, with a warning telling buyers to confirm by
  phone/WhatsApp before paying anything.

## Tech stack (and why)

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | One codebase for the public site and the admin dashboard |
| Database | PostgreSQL via **Supabase** | Generous free tier, includes file storage too |
| ORM | **Drizzle** (not Prisma) | No native binary download step — simpler and more reliable to deploy on Vercel's serverless functions |
| Auth | **Auth.js (NextAuth) v5** | Credentials login for staff, JWT sessions, works natively with the App Router |
| File storage | Supabase Storage | Property/project/testimonial photos, uploaded straight from the admin dashboard |
| Styling | Tailwind CSS v4 | Fast to theme, no separate CSS build step |
| Fonts | Self-hosted via `@fontsource` (Sora + Inter) | No runtime request to Google Fonts — faster, more private, and never breaks if that request fails |

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

You'll fill in `.env.local` in the next two steps — it's already in
`.gitignore` so it's never committed.

## 2. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick a
   region close to your users (e.g. closest available to Nigeria).
2. **Project Settings → Database → Connection string → URI.** Copy the
   **Transaction pooler** connection string (port `6543`) — this is the one
   that works from serverless hosting like Vercel. Paste it into
   `DATABASE_URL` in `.env.local`, replacing `[YOUR-PASSWORD]` with your
   database password.
3. **Project Settings → API.** Copy the **Project URL** and **anon public**
   key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   Copy the **service_role** key into `SUPABASE_SERVICE_ROLE_KEY` — this
   key is secret and must never be shared or committed; it's only ever used
   on the server.
4. **Storage → Create a new bucket** named `esema-media` (matches
   `SUPABASE_STORAGE_BUCKET` in `.env.example`). Make it a **public** bucket
   — property photos need to be viewable without logging in.
5. Generate an auth secret and paste it into `AUTH_SECRET`:
   ```bash
   npx auth secret
   ```

## 3. Set up the database

```bash
npm run db:migrate   # creates all the tables in your Supabase database
npm run db:seed      # adds starting content + your first admin login
```

The seed script prints an admin email/password to your terminal — **log in
and change it immediately** (there's no self-service password reset yet;
see "Adding more admin users" below for how to change it).

By default the seed creates `admin@esemaproperties.com` / `ChangeMe123!`.
To use your own on first seed, set these before running `db:seed`:

```bash
SEED_ADMIN_EMAIL="you@yourdomain.com" SEED_ADMIN_PASSWORD="a-strong-password" npm run db:seed
```

## 4. Run it

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## 5. Deploying (Vercel)

1. Push this project to a GitHub repository (private is fine).
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Add every variable from `.env.local` to Vercel's **Environment
   Variables** settings — except set `NEXTAUTH_URL` to your real domain
   once you have one (e.g. `https://esemaproperties.com`).
4. Deploy. Vercel builds the site directly from your database, so make
   sure steps 2–3 above are done first.
5. Add a custom domain under **Project Settings → Domains** whenever you're
   ready.

Every edit made in `/admin` after that takes effect immediately — pages are
rendered fresh on every request rather than cached, so there's never a
"why isn't my change showing up" delay.

## Adding more admin users / changing a password

There's intentionally no public sign-up page for `/admin` — it's staff-only.
To add a user or reset a password, run this once via `npm run db:studio`
(opens a local database browser) or a one-off script:

```ts
import bcrypt from "bcryptjs";
console.log(await bcrypt.hash("the-new-password", 12));
```

Then insert/update a row in `admin_users` with that hash via `db:studio`.

## Security notes

- Admin passwords are hashed with bcrypt (cost factor 12) — never stored in
  plain text.
- An account is temporarily locked for 15 minutes after 5 failed login
  attempts in a row.
- All of `/admin/*` is blocked by middleware unless logged in, and every
  admin action re-checks the session on the server independently of that
  middleware — so even a direct request can't bypass it.
- The Supabase **service role key** (which can bypass all storage
  permissions) is only ever used in server-only code, never sent to the
  browser.
- Every form is validated on the server with Zod, not just in the browser.
- Security headers (clickjacking/MIME-sniffing protection) are set for
  every response in `next.config.ts`.
- Owner contact details for third-party ("partner-verified") properties are
  stored but **never rendered on the public site** — they're for your team
  only.

Run `npm audit` periodically and update dependencies — no software stays
secure forever without maintenance.

## Project structure

```
app/
  (site)/            → public pages (home, properties, services, ...)
  admin/
    login/           → admin sign-in (outside the dashboard chrome)
    (dashboard)/      → everything behind login: properties, services, ...
  api/auth/          → Auth.js route handler
components/
  site/              → public-site components (navbar, footer, cards, ...)
  admin/             → admin-only components (forms, image uploaders, ...)
  ui/                → shared primitives (buttons, layout, icons)
lib/
  db/                → Drizzle schema + client
  actions/           → server actions (one file per content type)
  auth.ts            → Auth.js configuration
  data.ts            → read queries used by the public site
  storage.ts         → Supabase Storage upload/delete helpers
  validations.ts     → Zod schemas, shared by forms and server actions
drizzle/             → generated SQL migrations
scripts/seed.ts      → starter content + first admin user
```

## Extending it

Every content type follows the same pattern: a Drizzle table in
`lib/db/schema.ts`, a Zod schema in `lib/validations.ts`, server actions in
`lib/actions/<type>.ts`, a form component in `components/admin/`, and three
admin pages (list, new, edit). Copying an existing one (e.g. Testimonials,
which is the simplest) is the fastest way to add a new content type.
