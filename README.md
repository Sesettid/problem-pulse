# Surface

Discover what matters. Solve what counts.

Surface is a simple problem discovery platform where employees submit workplace problems and AI identifies common organizational themes.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Supabase Postgres
- OpenAI API

## Setup

1. Create a Supabase project.
2. Run the SQL in `supabase/migrations/001_initial_schema.sql`.
3. Copy `.env.example` to `.env.local` and fill in the values.
4. Install and run:

```bash
npm install
npm run dev
```

## Pages

- `/` landing page
- `/submit` problem submission flow
- `/explore` explore and upvote problems
- `/dashboard` executive insights dashboard
