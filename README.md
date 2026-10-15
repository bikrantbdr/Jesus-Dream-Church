# Jesus Dream Church

A modern, responsive, and secure web application for **Jesus Dream Church** in Frankfurt, Germany. The platform is designed to welcome visitors, share community information, showcase service recaps with rich media, and provide real-time updates via a protected administration portal.

---

## Features

- **Modern Editorial Aesthetic**: Bespoke responsive layouts featuring high-readability typography, fluid navigation, and warm community styling.
- **Service Recaps & Media Feed**: Interactive event feed supporting multi-media carousels (photos and videos) with responsive previews.
- **Real-Time Live Updates**: Server-Sent Events (SSE) integration that automatically syncs the events board across connected clients when new recaps are published.
- **Protected Administration Panel**: Secure portal for administrators to create, manage, and delete church events and media recaps.
- **Dual-Engine Media Storage**: Cloud CDN media hosting via Vercel Blob with an automatic local filesystem fallback for development.
- **Built-in Security Hardening**: Cryptographic session verification, strict file extension validation, restricted admin initialization, and secure HTTP response headers.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) primitives |
| **Database ORM** | [Prisma ORM](https://www.prisma.io/) with native PostgreSQL TCP adapter (`pg`) |
| **Database Host** | [Neon Serverless PostgreSQL](https://neon.tech/) |
| **Media Storage** | [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) / Local disk fallback |
| **Real-Time Sync** | Server-Sent Events (SSE) via Web Streams API |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |

---

## Getting Started

### 1. Prerequisites

- **Node.js**: v20 or higher
- **npm**, **pnpm**, or **yarn**
- A PostgreSQL database instance (local or hosted, e.g. Neon)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/bikrantbdr/Jesus-Dream-Church.git
cd Jesus-Dream-Church
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Connection (Neon PostgreSQL or local PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-sample-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Session Signing Secret (Must be a secure 32+ character string)
# If omitted during local development, the app will generate one automatically.
SESSION_SECRET="your-secure-random-32-byte-hex-string"

# Cloud Storage (Optional - falls back to /public/uploads if empty)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_here"
```

### 4. Database Initialization

Generate the Prisma Client and synchronize the database schema:

```bash
# Push schema to database
npx prisma db push

# (Optional) Seed the database with initial event recaps
node prisma/seed.js
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## Application Structure

```text
├── prisma/
│   ├── schema.prisma          # Database models (User, Event, Media)
│   ├── seed.js                # Database seeding script
│   └── seed.ts                # TypeScript seed script
├── public/                    # Static assets, logos, and local upload fallback
├── src/
│   ├── app/
│   │   ├── about/             # About page & mission statements
│   │   ├── actions/           # Next.js Server Actions (auth, events)
│   │   ├── admin/             # Admin login & initialization routes
│   │   ├── api/               # API routes (SSE live stream, blob upload)
│   │   ├── events/            # Events & media recap feed
│   │   ├── layout.tsx         # Root layout with responsive navigation & footer
│   │   └── page.tsx           # Homepage hero and feature sections
│   ├── components/            # UI components (EventFeed, Navbar, Carousel)
│   └── lib/                   # Shared utilities (db, storage, sse, schemas)
```

---

## Security Architecture

1. **HMAC-SHA256 Signed Sessions**: Administrative sessions are verified using cryptographic signatures. Any client-side cookie tampering automatically invalidates the session.
2. **Admin Signup Lockdown**: Initial admin creation is open for first-time system setup. Once an administrator account exists, subsequent accounts can only be created by an authenticated administrator.
3. **MIME & Extension Whitelisting**: Uploads are strictly validated against both MIME headers and safe file extensions (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.mp4`, `.mov`, `.webm`, `.m4v`) to prevent stored script injection (XSS).
4. **Hardened HTTP Headers**: Configured in `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`).

---

## Deployment on Vercel

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Under project **Settings > Environment Variables**, configure:
   - `DATABASE_URL` (from Neon / Vercel Postgres)
   - `SESSION_SECRET` (generate with `openssl rand -hex 32`)
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Blob store)
4. Synchronize the production schema from your terminal:
   ```bash
   DATABASE_URL="<your_production_connection_string>" npx prisma db push
   ```
5. Deploy and access `/admin/secret-setup-page` to register your primary administrator account. Once created, direct setup locks down automatically.

---

## License

This project is maintained for **Jesus Dream Church**. All rights reserved.
