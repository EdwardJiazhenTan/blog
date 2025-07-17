# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev                 # Start development server with Turbopack
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
```

### Database Operations
```bash
npm run db:generate        # Generate Drizzle migrations
npm run db:migrate         # Apply migrations to SQLite database
npm run db:studio          # Open Drizzle Studio (database GUI)
npm run db:seed            # Seed database with sample blog posts
```

## Architecture Overview

### Database Strategy
This blog uses a **dual database approach** for flexible deployment:

- **Development**: SQLite with Drizzle ORM (`./dev.db`)
- **Production**: PostgreSQL via Supabase (planned)
- **Migrations**: Shared Drizzle schema works for both databases

The database schema includes: `profiles`, `posts`, `categories`, `postCategories`, `tags`, `postTags`, and `comments` tables.

### Design System
The blog features a **Snoopy-inspired comic aesthetic**:

- **Typography**: Kalam (handwriting), Shrikhand (headlines), Fredoka (UI)
- **Color Palette**: Cream background (#fffef7), warm brown text (#2d1b17), soft pastels
- **Components**: Custom CSS classes like `.snoopy-button`, `.thought-bubble`, `.snoopy-card`
- **Interactive Elements**: Draggable sticky notes, curved borders, gentle animations

### Key Components

#### StickyNote (`src/components/ui/StickyNote.tsx`)
Fully draggable notes with:
- Mouse drag handling with position state
- Rotation effects and smooth animations
- Folded corner and tape visual effects
- Five pastel color variants

#### PostCard (`src/components/blog/PostCard.tsx`)
Blog post display with:
- Snoopy-style curved borders (`snoopy-card` class)
- Wavy image borders with animation
- Custom typography and spacing
- Hover effects with lift animation

### File Structure
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage with sticky notes
│   ├── layout.tsx         # Root layout with Header/Footer
│   └── globals.css        # Snoopy design system styles
├── components/
│   ├── blog/              # Blog-specific components
│   ├── layout/            # Header, Footer
│   └── ui/                # Reusable UI components
└── lib/
    ├── db/                # Drizzle schema and connection
    ├── seed.ts            # Database seeding script
    └── utils.ts           # Utility functions
```

### Development Notes

#### Styling Approach
- Tailwind CSS with custom component layers
- CSS custom properties for Snoopy color palette
- Google Fonts imported in globals.css (must be first import)
- Component-specific styles use `.snoopy-*` naming convention

#### Database Workflow
1. Modify schema in `src/lib/db/schema.ts`
2. Generate migrations: `npm run db:generate`
3. Apply to local DB: `npm run db:migrate`
4. Reseed if needed: `npm run db:seed`

#### Content Management
Blog posts are stored as markdown in the database `content` field. The seed script (`src/lib/seed.ts`) contains sample posts with full markdown content demonstrating the blog's tone and style.

## Environment Configuration

### Local Development
```env
DATABASE_URL=file:./dev.db
NODE_ENV=development
```

### Production (Planned)
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Design Philosophy

The blog embodies a **minimalist Snoopy aesthetic** emphasizing:
- Warm, cozy messaging over corporate tone
- Gentle curves and organic shapes over sharp edges
- Soft color palette over high contrast
- Playful interactions over static design
- Handwritten feel over digital precision

When adding new features, maintain this whimsical, thoughtful character that makes reading feel like visiting a friend's cozy corner of the internet.