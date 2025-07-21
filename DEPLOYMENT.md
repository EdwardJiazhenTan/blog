# Blog Deployment Guide

## 🚀 Complete Setup Checklist

### Phase 1: Supabase Database Setup

- [ ] **Create Supabase Project**
  - Go to [https://supabase.com](https://supabase.com)
  - Create new project: "edwardj-blog"
  - Choose region: US East (closest to users)
  - Save credentials: Project URL, Anon Key, Service Role Key

- [ ] **Setup Database Schema**
  - Open Supabase SQL Editor
  - Run the SQL from `supabase-schema.sql`
  - Verify tables are created: profiles, posts, categories, tags, etc.

- [ ] **Configure Row Level Security**
  - Policies are included in the schema file
  - Test with a sample query

### Phase 2: Vercel Deployment

- [ ] **Install Dependencies**
  ```bash
  npm install postgres
  ```

- [ ] **Environment Variables**
  Set these in Vercel Dashboard → Settings → Environment Variables:
  ```
  DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/postgres
  JWT_SECRET=your-random-jwt-secret
  NODE_ENV=production
  ```

- [ ] **Update Production Files**
  For production deployment, you'll need to:
  1. Replace `src/lib/db/index.ts` content with `src/lib/db/index.prod.ts`
  2. Replace `drizzle.config.ts` content with `drizzle.config.prod.ts`
  3. Update imports to use PostgreSQL schema

- [ ] **Deploy to Vercel**
  ```bash
  # Push to GitHub
  git add .
  git commit -m "Add production configuration"
  git push origin main
  
  # Deploy via Vercel CLI or GitHub integration
  npx vercel --prod
  ```

### Phase 3: Domain Configuration

**Option A: Add to Existing Project**
- [ ] Go to existing `edwardjtan.com` Vercel project
- [ ] Settings → Domains → Add `blog.edwardjtan.com`
- [ ] Add CNAME record in DNS: `blog` → `cname.vercel-dns.com`

**Option B: Separate Project (Recommended)**
- [ ] Create new Vercel project for blog
- [ ] Set domain to `blog.edwardjtan.com`
- [ ] Configure DNS as above

### Phase 4: Post-Deployment

- [ ] **Test the site**
  - Visit `https://blog.edwardjtan.com`
  - Verify database connection
  - Test admin functionality

- [ ] **Create first content**
  - Access admin panel: `/admin`
  - Create your first blog post
  - Test publishing workflow

- [ ] **Setup monitoring**
  - Vercel Analytics (automatic)
  - Supabase monitoring dashboard

## 🔧 Environment Variables Reference

### Local Development (.env.local)
```env
DATABASE_URL=file:./dev.db
NODE_ENV=development
JWT_SECRET=your-local-secret
```

### Production (Vercel)
```env
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/postgres
NODE_ENV=production
JWT_SECRET=your-production-secret-key
```

## 📝 Database Schema Commands

### Run Schema in Supabase
1. Copy content from `supabase-schema.sql`
2. Paste in Supabase SQL Editor
3. Execute

### Test Database Connection
```bash
# Test locally with PostgreSQL URL
DATABASE_URL="postgresql://..." npm run dev
```

## 🚦 CI/CD Pipeline

### Automatic Deployment
- Push to `main` branch → Automatic Vercel deployment
- Environment: Production
- Domain: `blog.edwardjtan.com`

### Manual Deployment
```bash
npx vercel --prod
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check Supabase project is active
- Test connection from local environment

### Build Failures
- Check Node.js version compatibility
- Verify all environment variables are set
- Review build logs in Vercel dashboard

### Domain Issues
- Verify DNS propagation (use DNS checker tools)
- Check domain configuration in Vercel
- Ensure SSL certificate is active

## 📚 Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Database operations
npm run db:studio    # Open database GUI
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
```