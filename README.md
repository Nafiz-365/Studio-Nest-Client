# StudioNest Client

StudioNest is a Next.js client for discovering, booking, and listing creative studios.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set the Better Auth and MongoDB values.
3. Start the Express API in `studio-nest-server` on port `8000`.
4. Start the frontend:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - serve the production build
- `npm run lint` - run ESLint

## Authentication

Email/password authentication is handled by Better Auth and persisted in MongoDB. Studio API requests use the Better Auth JWT. The API development fallback is restricted to local development and is not a production authentication mechanism.

Google OAuth requires these environment variables:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

In Google Cloud Console, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI for local development. Use your deployed application URL for production.

Keep `.env` private. If credentials were ever shared or committed, rotate the MongoDB password, Better Auth secret, and any image-host API key immediately.
