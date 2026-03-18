# Framework-Specific Layouts

Detailed folder structures for popular frameworks. Read the section that matches the user's stack.

---

## React (Vite / CRA)

```
src/
├── features/
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       ├── context/           # Feature-scoped React context
│       ├── store/             # Feature-scoped state (Zustand slice, Redux slice)
│       └── index.ts
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── constants/
├── pages/                     # Route-level components
├── layouts/                   # Layout wrappers (MainLayout, AuthLayout)
├── router/                    # Route definitions
│   └── index.tsx
├── styles/
│   ├── global.css
│   └── tokens.css
├── lib/                       # Third-party wrappers (axios instance, Supabase client)
├── App.tsx
└── main.tsx
```

### React Component Folder

```
Button/
├── Button.tsx                 # Component
├── Button.test.tsx            # Tests
├── Button.stories.tsx         # Storybook
├── Button.module.css          # Styles
├── Button.types.ts            # Props interface (optional, can inline)
└── index.ts                   # Re-export
```

---

## Next.js (App Router)

```
project-root/
├── app/                       # App Router — file-system routing
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── loading.tsx            # Loading UI
│   ├── error.tsx              # Error boundary
│   ├── not-found.tsx          # 404 page
│   ├── (marketing)/           # Route group (no URL segment)
│   │   ├── about/page.tsx
│   │   └── pricing/page.tsx
│   ├── (app)/                 # Authenticated route group
│   │   ├── layout.tsx         # App layout with sidebar
│   │   ├── dashboard/page.tsx
│   │   └── settings/page.tsx
│   └── api/                   # API routes
│       └── users/route.ts
├── components/                # Shared UI components
├── lib/                       # Server-side utilities, DB clients
├── hooks/                     # Client-side hooks
├── types/                     # Shared types
├── styles/
├── public/
└── middleware.ts               # Edge middleware
```

### Key Next.js Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Makes a route publicly accessible |
| `layout.tsx` | Shared UI wrapper (persists across navigation) |
| `loading.tsx` | Suspense fallback for the route segment |
| `error.tsx` | Error boundary for the route segment |
| `route.ts` | API endpoint (in `app/api/`) |
| `(groupName)/` | Route group — organizes without affecting URL |
| `[param]/` | Dynamic route segment |
| `[...slug]/` | Catch-all route |

---

## Vue 3

```
src/
├── features/
│   └── [feature]/
│       ├── components/
│       ├── composables/       # Vue composables (equivalent of hooks)
│       ├── services/
│       ├── types/
│       ├── stores/            # Pinia stores
│       └── index.ts
├── shared/
│   ├── components/
│   ├── composables/
│   ├── utils/
│   └── types/
├── views/                     # Route-level components
├── layouts/
├── router/
│   └── index.ts               # Vue Router config
├── stores/                    # Global Pinia stores
├── plugins/                   # Vue plugins
├── styles/
├── App.vue
└── main.ts
```

### Vue Component File

Single-file components (`.vue`) keep template, script, and style together — no need for separate style files:

```
UserCard/
├── UserCard.vue               # Template + script + scoped styles
├── UserCard.test.ts
└── index.ts
```

---

## Svelte / SvelteKit

```
src/
├── routes/                    # File-based routing (SvelteKit)
│   ├── +layout.svelte         # Root layout
│   ├── +page.svelte           # Home page
│   ├── about/
│   │   └── +page.svelte
│   ├── dashboard/
│   │   ├── +page.svelte
│   │   ├── +page.server.ts    # Server load function
│   │   └── +layout.svelte
│   └── api/
│       └── users/+server.ts   # API endpoint
├── lib/                       # Shared code (aliased as $lib)
│   ├── components/
│   ├── stores/                # Svelte stores
│   ├── utils/
│   └── types/
├── params/                    # Route param matchers
├── app.html                   # HTML shell
├── app.css                    # Global styles
└── hooks.server.ts            # Server hooks (middleware)
```

---

## Astro

```
src/
├── pages/                     # File-based routing
│   ├── index.astro
│   ├── about.astro
│   └── blog/
│       ├── index.astro
│       └── [slug].astro
├── layouts/
│   └── BaseLayout.astro
├── components/
│   ├── Header.astro           # Astro components (no JS by default)
│   ├── Counter.tsx             # React island
│   └── Search.vue              # Vue island
├── content/                   # Content collections (Markdown/MDX)
│   ├── config.ts
│   └── blog/
│       ├── post-one.md
│       └── post-two.md
├── styles/
└── lib/
```

---

## Static Site / Vanilla HTML

```
project-root/
├── src/
│   ├── pages/
│   │   ├── index.html
│   │   ├── about.html
│   │   └── contact.html
│   ├── css/
│   │   ├── reset.css
│   │   ├── tokens.css         # Design tokens / variables
│   │   ├── layout.css
│   │   └── components/
│   │       ├── button.css
│   │       └── card.css
│   ├── js/
│   │   ├── main.js
│   │   ├── components/        # Web components or modules
│   │   └── utils/
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   └── partials/              # Reusable HTML fragments (if using a build tool)
├── public/
│   ├── favicon.ico
│   └── robots.txt
└── dist/                      # Build output
```

---

## Node.js / Express API

```
src/
├── modules/                   # Feature-based (recommended)
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.middleware.ts
│   │   ├── auth.validation.ts
│   │   ├── auth.types.ts
│   │   └── auth.test.ts
│   ├── users/
│   └── products/
├── shared/
│   ├── middleware/             # Global middleware (error handler, logger)
│   ├── utils/
│   ├── types/
│   └── database/              # DB client, migrations, seeds
│       ├── client.ts
│       ├── migrations/
│       └── seeds/
├── config/                    # Environment config, constants
├── app.ts                     # Express app setup
└── server.ts                  # Entry point (listen)
```
