# StudioNest Client

StudioNest is a responsive Next.js marketplace for discovering, booking, and
hosting creative studios, production stages, podcast rooms, music suites, and
workshops.

## Live application

[StudioNest Live URL](https://studio-nest-client.vercel.app/)

## Highlights

- Responsive App Router experience for mobile, tablet, and desktop.
- Interactive Swiper hero, featured studio discovery, category filtering, and
  detailed studio galleries.
- Better Auth email/password authentication with optional Google OAuth.
- Protected dashboards for adding, editing, and managing studio listings,
  bookings, and saved studios.
- Server-backed booking requests with pending status, validation, cancellation,
  collision prevention, and downloadable PDF invoices.
- Sonner toast notifications, confirmation dialogs, loading skeletons, empty
  states, custom error handling, and a branded not-found page.
- Light/dark theme switching with accessible shadcn-compatible UI primitives.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4 and shadcn-compatible components
- Better Auth with MongoDB adapter and JWT plugin
- Swiper, Framer Motion, Lucide React, Sonner, and jsPDF
- Express/MongoDB API in the companion `studio-nest-server` repository

## Project structure

```text
src/
├── app/          Next.js routes, auth handler, loading and error boundaries
├── components/   Shared layout, forms, modals, cards, and UI components
├── lib/          Auth, API, application state, invoice, and utility helpers
├── views/        Feature page views
├── data/         Local fallback and seed-compatible data
└── types.ts      Shared frontend domain types
```

## Local development

### Prerequisites

- Node.js 20 or newer
- MongoDB connection string
- The StudioNest API running on port `8000`

### Setup

```bash
npm install
Copy-Item .env.example -> .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Start the backend separately from the sibling `studio-nest-server` directory:

```bash
npm install
npm run dev
```

### Environment variables

Copy `.env.example` to `.env` and configure:

| Variable                    | Purpose                             |
| --------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`  | Express API base URL                |
| `NEXT_PUBLIC_APP_URL`       | Frontend URL used by Better Auth    |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Optional ImgBB image upload key     |
| `BETTER_AUTH_SECRET`        | Long random Better Auth secret      |
| `BETTER_AUTH_URL`           | Better Auth application URL         |
| `MONGODB_URI`               | MongoDB database connection string  |
| `GOOGLE_CLIENT_ID`          | Optional Google OAuth client ID     |
| `GOOGLE_CLIENT_SECRET`      | Optional Google OAuth client secret |

Never commit `.env` files, API keys, database credentials, or auth secrets.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create an optimized production build
npm run start    # Serve the production build
npm run lint     # Run ESLint
```

## Authentication notes

Email/password authentication is handled by Better Auth and stored through the
MongoDB adapter. Authenticated API mutations obtain a Better Auth JWT and send
it to the Express API. Private routes are protected by Next.js proxy checks and
the API independently verifies the JWT through the Better Auth JWKS endpoint.

Google OAuth is optional. Configure the Google credentials and add the matching
callback URL in Google Cloud Console before enabling it in a deployed
environment.

## Submission checklist

- Replace the live application placeholder above with the real deployed URL.
- Add examiner credentials only if they have been created for the deployment.
- Verify frontend and backend deployment environment variables.
- Keep all secrets private and rotate any credential that was accidentally
  exposed.
