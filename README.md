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
