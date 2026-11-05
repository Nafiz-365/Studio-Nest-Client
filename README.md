# StudioNest Client

StudioNest is a responsive marketplace for discovering, booking, and hosting
creative workspaces, including photo studios, film stages, podcast rooms, music
suites, and workshops.

**Live demo:** [studio-nest-client.vercel.app](https://studio-nest-client.vercel.app/)

## What you can do

- Search and browse studios by category, location, budget, capacity, and listing
  details; sort by featured status, newest, rating, or price.
- View studio galleries, rates, amenities, host information, rules, and reviews.
- Create an account with email and password, or use Google sign-in when OAuth is
  configured.
- Request a booking, review the rate, service fee, and deposit, and manage
  pending bookings. Hosts can review and respond to booking requests.
- Create, edit, and manage studio listings, save studios to a wishlist, and
  download booking invoices as PDFs.
- Switch between light and dark themes; layouts adapt to mobile and desktop.

Booking requests and invoices do not process payments.

## Technology

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4 and Base UI-based components
- Better Auth with MongoDB and the JWT plugin
- Express API in the companion StudioNest server
- Swiper, Framer Motion, Lucide React, Sonner, and jsPDF

## Application routes

| Route                               | Purpose                            |
| ----------------------------------- | ---------------------------------- |
| `/`                                 | Home page and featured studios     |
| `/studios`                          | Searchable studio directory        |
| `/studios/[id]`                     | Studio details and booking request |
| `/about`, `/how-it-works`, `/terms` | Informational pages                |
| `/login`, `/register`               | Authentication                     |
| `/dashboard`                        | Account overview                   |
| `/add-studio`, `/studios/edit/[id]` | Create or edit a listing           |
| `/my-listings`                      | Manage hosted studios              |
| `/my-bookings`                      | Manage booking requests            |
| `/host-bookings`                    | Review incoming requests           |
| `/wishlist`                         | Saved studios                      |
| `/profile`                          | Profile settings                   |

Account and listing-management routes require a signed-in user.

## Project structure

```text
src/
├── app/          App Router pages, API handlers, and loading/error boundaries
├── components/   Shared layout, forms, cards, dialogs, and UI primitives
├── data/         Categories, sample studios, and seed booking data
├── lib/          App state, auth clients/configuration, API helpers, invoices
├── views/        Feature page UI used by the route wrappers
└── types.ts      Shared domain types
```

The global `AppProvider` manages the authenticated user, theme, studios,
bookings, and wishlist. Theme and client-side app data are persisted in
`localStorage`; authentication is handled by Better Auth. Studio data for the
home, directory, and detail pages is fetched from the Express API.

Authenticated browser API requests go through the same-origin
`/api/backend/*` route. That route checks the Better Auth session and forwards
the request to the API with a server-side JWT, rather than exposing the JWT to
the browser.

## Local development

### Prerequisites

- Node.js and npm
- MongoDB, for Better Auth
- The companion StudioNest Express API, for studio data and account actions

### Configure and run

1. Install frontend dependencies and copy the environment template:

    ```bash
    npm install
    cp .env.example .env.local
    ```

    In PowerShell, `Copy-Item .env.example .env.local` is equivalent to the
    `cp` command.

2. Edit `.env.local` and provide at least `MONGODB_URI` and
   `BETTER_AUTH_SECRET`. Set the API URL to the running Express server (the
   default is `http://localhost:8000`).

3. Start the frontend:

    ```bash
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000).

Start the companion API separately and make sure it listens at the configured
API URL. The home, directory, and studio detail pages fetch data on the server
and require that API to be reachable. The client also initializes sample data
and persists selected state locally, but this is not a substitute for the API
for authentication, booking, wishlist, or listing actions.

### Environment variables

| Variable                    | Required    | Description                                                                                                             |
| --------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`               | Yes         | MongoDB connection string used by Better Auth.                                                                          |
| `BETTER_AUTH_SECRET`        | Yes         | Long, random secret used by Better Auth.                                                                                |
| `BETTER_AUTH_URL`           | Recommended | Canonical frontend origin used by Better Auth, such as `http://localhost:3000`.                                         |
| `NEXT_PUBLIC_APP_URL`       | No          | Browser auth client origin; defaults to `http://localhost:3000`.                                                        |
| `NEXT_PUBLIC_API_BASE_URL`  | No          | Express API origin used by studio data requests; defaults to `http://localhost:8000`.                                   |
| `API_BASE_URL`              | No          | Server-only API origin for the authenticated proxy; defaults to `NEXT_PUBLIC_API_BASE_URL` or `http://localhost:8000`.  |
| `NEXT_PUBLIC_IMGBB_API_KEY` | No          | Enables direct ImgBB uploads in the studio listing form. Without it, small supported images can be stored as data URLs. |
| `GOOGLE_CLIENT_ID`          | No          | Google OAuth client ID; configure with the secret to enable Google sign-in.                                             |
| `GOOGLE_CLIENT_SECRET`      | No          | Google OAuth client secret.                                                                                             |

Set both API URL variables when server-side page requests and the authenticated
proxy need different API origins. Variables prefixed with `NEXT_PUBLIC_` are
available to browser code; do not put server secrets in them. Environment files
are ignored by Git except for `.env.example`.

## Available commands

```bash
npm run dev       # Start the Next.js development server
npx tsc --noEmit  # Check TypeScript types
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run start     # Serve the production build
```

There is currently no test script in `package.json`.

## Security and deployment notes

- Keep MongoDB credentials, Better Auth secrets, and OAuth secrets out of source
  control. Use your hosting provider's environment-variable settings in
  production.
- Configure `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to match the deployed
  frontend origin, and configure both API origins for the deployed API.
- Google sign-in is available only when both Google OAuth credentials are set
  and the provider is configured for the deployed application.
- Treat the ImgBB key as a browser-visible upload key, not as a server secret.
