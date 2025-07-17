# Blog System Design

## Overview

A modern blog platform built with Next.js, deployed on Vercel, using Supabase for backend services and PostgreSQL for data persistence.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Supabase (production), Drizzle ORM
- **Database:** 
  - **Local/Development:** SQLite with Drizzle ORM
  - **Production:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (production), simple auth for local
- **Deployment:** Vercel
- **Storage:** Supabase Storage (for images)

## Database Schema

### Core Tables

```sql
-- Users table (Supabase Auth handles this)
-- We'll extend with a profiles table

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post categories (many-to-many)
CREATE TABLE post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Tags
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post tags (many-to-many)
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security Policies

```sql
-- Posts: Public can read published, authors can CRUD own posts
CREATE POLICY "Public can read published posts" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authors can manage own posts" ON posts
  FOR ALL USING (auth.uid() = author_id);

-- Comments: Public can read approved, authors can manage own
CREATE POLICY "Public can read approved comments" ON comments
  FOR SELECT USING (approved = true);

CREATE POLICY "Authors can manage own comments" ON comments
  FOR ALL USING (auth.uid() = author_id);

-- Profiles: Users can read all, manage own
CREATE POLICY "Public can read profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);
```

## Application Architecture

### Directory Structure

```
blog/
├── src/
│   ├── app/                          # App Router (Next.js 13+)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   │   ├── posts/
│   │   │   │   ├── categories/
│   │   │   │   └── comments/
│   │   │   └── profile/
│   │   ├── blog/
│   │   │   ├── [slug]/              # Individual post pages
│   │   │   ├── category/[slug]/     # Category pages
│   │   │   └── tag/[slug]/          # Tag pages
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── posts/
│   │   │   ├── categories/
│   │   │   ├── tags/
│   │   │   └── comments/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   ├── blog/                    # Blog-specific components
│   │   ├── forms/                   # Form components
│   │   └── layout/                  # Layout components
│   ├── lib/
│   │   ├── db/                      # Database schema and connection
│   │   ├── validations/             # Zod schemas
│   │   ├── utils.ts                 # Utility functions
│   │   └── constants.ts
│   └── types/
│       └── database.ts              # TypeScript types
├── drizzle.config.ts                # Drizzle configuration
└── middleware.ts                    # Auth middleware
```

### API Routes Structure

```typescript
/api/
├── auth/
│   ├── callback           # Supabase auth callback
│   └── logout            # Logout handler
├── posts/
│   ├── route.ts          # GET (list), POST (create)
│   ├── [id]/
│   │   └── route.ts      # GET, PUT, DELETE
│   └── slug/[slug]/
│       └── route.ts      # GET by slug
├── categories/
│   ├── route.ts          # GET, POST
│   └── [id]/route.ts     # GET, PUT, DELETE
├── tags/
│   ├── route.ts          # GET, POST
│   └── [id]/route.ts     # GET, PUT, DELETE
└── comments/
    ├── route.ts          # GET, POST
    └── [id]/route.ts     # PUT, DELETE
```

## Data Flow

### Pattern
1. Client → API Route → Drizzle ORM → SQLite/PostgreSQL
2. Server Components fetch data directly via Drizzle
3. Client Components use React Query for API calls
4. Real-time updates via Supabase subscriptions (production)

### Authentication Flow
1. User signs up/logs in via Supabase Auth (production)
2. JWT token stored in httpOnly cookie
3. Middleware validates token on protected routes
4. Database policies enforce data access rules

## Authentication & Authorization

### Strategy
- **Local Development:** Simple session-based auth
- **Production:** Supabase Auth with OAuth providers
- Row Level Security (RLS) policies in production
- JWT tokens for API authentication

### Authorization Levels
- **Public:** Read published posts
- **Authenticated:** Comment on posts
- **Author:** Create/edit own posts
- **Admin:** Manage all content, users, comments

## Database Strategy

### Local Development (SQLite + Drizzle)
- Fast setup with no external dependencies
- File-based database (`./dev.db`)
- Drizzle ORM for type-safe queries
- Database migrations with Drizzle Kit
- Seed scripts for test data

### Production (PostgreSQL + Supabase)
- Managed PostgreSQL instance
- Row Level Security policies
- Real-time subscriptions
- Built-in authentication
- File storage integration

### Migration Strategy
- Drizzle schema definitions work for both SQLite and PostgreSQL
- Environment-based database configuration
- Shared ORM layer for consistent data access
- Production migration via Supabase dashboard

## Deployment Configuration

### Environment Variables

```env
# Database
DATABASE_URL=file:./dev.db  # Local SQLite
# DATABASE_URL=postgresql://... # Production PostgreSQL

# Supabase (Production only)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Next.js
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://yourdomain.com

# Environment
NODE_ENV=development|production
```

### Vercel Setup
- Automatic deployments from main branch
- Preview deployments for PRs
- Environment variables configured in Vercel dashboard
- Build command: `npm run build`
- Output directory: `.next`

## Key Features

### Content Management
- Markdown editor for posts
- Draft/publish workflow
- Featured images via Supabase Storage
- SEO-friendly URLs with slugs
- Categories and tags for organization

### User Experience
- Server-side rendering for SEO
- Real-time comments (production)
- Responsive design
- Fast page loads with App Router
- Search functionality

### Admin Features
- Content moderation
- User management
- Analytics dashboard
- Comment approval system

## Performance Considerations

- Static generation for published posts
- Incremental Static Regeneration (ISR)
- Image optimization with Next.js Image
- Database connection pooling via Supabase
- CDN delivery through Vercel Edge Network

## Security Features

- Row Level Security policies (production)
- CSRF protection
- Input validation with Zod
- Sanitized HTML output
- Rate limiting on API routes
- Secure authentication flow

## Development Commands

```bash
# Database operations
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
npm run db:studio    # Open database studio

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```