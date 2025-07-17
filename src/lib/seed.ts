import { db } from './db';
import { profiles, posts, categories, postCategories, tags, postTags } from './db/schema';
import { generateId, slugify } from './utils';

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Create a sample user profile
  const userId = generateId();
  await db.insert(profiles).values({
    id: userId,
    username: 'admin',
    fullName: 'Comic Blog Admin',
    bio: 'Welcome to my comic book styled blog! I write about technology, life, and everything in between.',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create sample categories
  const techCategory = generateId();
  const lifeCategory = generateId();
  
  await db.insert(categories).values([
    {
      id: techCategory,
      name: 'Technology',
      slug: 'technology',
      description: 'All things tech and programming',
      createdAt: new Date(),
    },
    {
      id: lifeCategory,
      name: 'Life',
      slug: 'life',
      description: 'Personal thoughts and experiences',
      createdAt: new Date(),
    },
  ]);

  // Create sample tags
  const reactTag = generateId();
  const nextjsTag = generateId();
  const thoughtsTag = generateId();
  
  await db.insert(tags).values([
    {
      id: reactTag,
      name: 'React',
      slug: 'react',
      createdAt: new Date(),
    },
    {
      id: nextjsTag,
      name: 'Next.js',
      slug: 'nextjs',
      createdAt: new Date(),
    },
    {
      id: thoughtsTag,
      name: 'Thoughts',
      slug: 'thoughts',
      createdAt: new Date(),
    },
  ]);

  // Create sample posts
  const post1 = generateId();
  const post2 = generateId();
  const post3 = generateId();

  const samplePosts = [
    {
      id: post1,
      title: 'Welcome to My Comic Blog!',
      slug: 'welcome-to-my-comic-blog',
      content: `# Welcome to Comic Blog! 🎨

Hello there, fellow comic enthusiasts and blog readers! Welcome to my brand new comic book styled blog. This is where I'll be sharing my thoughts, experiences, and adventures in the world of technology and life.

## What Makes This Blog Special?

This blog is designed with a **comic book aesthetic** in mind. Every element, from the fonts to the borders, is inspired by the vibrant world of comics. Here's what you can expect:

- **Bold, eye-catching design** that makes reading fun
- **Speech bubbles** for special callouts
- **Comic-style borders** and shadows
- **Colorful buttons** that feel interactive

## What I'll Be Writing About

I plan to cover a variety of topics:

### Technology 💻
- Web development tutorials
- React and Next.js tips
- Database design patterns
- DevOps adventures

### Life 🌟
- Personal reflections
- Learning experiences
- Creative projects
- Random thoughts

## Let's Get Started!

I'm excited to share this journey with you. Whether you're here for the tech content, the comic book styling, or just curious about what I have to say, I hope you'll find something valuable.

Feel free to explore, read, and let me know what you think!

**POW!** Let's make this blog awesome together! 💥`,
      excerpt: 'Welcome to my new comic book styled blog! Discover what makes this place special and what you can expect to read about.',
      authorId: userId,
      published: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: post2,
      title: 'Building a Blog with Next.js and SQLite',
      slug: 'building-blog-nextjs-sqlite',
      content: `# Building a Blog with Next.js and SQLite 🚀

Today I want to share the technical journey of building this very blog you're reading. It's been quite an adventure combining modern web technologies with a fun comic book aesthetic!

## The Tech Stack

Here's what powers this blog:

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Markdown** for content rendering

### Backend
- **Drizzle ORM** for database management
- **SQLite** for local development
- **PostgreSQL** for production (via Supabase)

## Key Features

### 🎨 Comic Book Styling
The entire design is inspired by comic books:
- Custom CSS classes for comic borders
- Speech bubble components
- Bold, colorful buttons
- Comic book fonts (Comic Neue & Bangers)

### 📝 Markdown Support
All blog posts are written in Markdown, making it easy to:
- Write formatted content
- Include code blocks
- Add images and links
- Focus on content, not formatting

### 🗄️ Flexible Database
Using Drizzle ORM allows us to:
- Use SQLite for fast local development
- Switch to PostgreSQL for production
- Maintain type safety throughout
- Handle migrations easily

## Lessons Learned

Building this blog taught me several valuable lessons:

1. **Design First**: Having a clear visual direction (comic book style) made all technical decisions easier
2. **Start Simple**: Beginning with SQLite allowed rapid prototyping
3. **Type Safety Matters**: TypeScript and Drizzle ORM caught many bugs early
4. **User Experience**: The comic book theme makes reading more engaging

## What's Next?

Future improvements I'm planning:
- Comment system
- Search functionality
- Dark mode support
- RSS feed
- Admin dashboard

Stay tuned for more technical deep dives and creative experiments!

**BOOM!** 💥 Thanks for reading!`,
      excerpt: 'A technical deep dive into building this blog with Next.js, SQLite, and a comic book aesthetic. Learn about the tech stack and design decisions.',
      authorId: userId,
      published: true,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: post3,
      title: 'The Power of Comic Book Design in Web Development',
      slug: 'comic-book-design-web-development',
      content: `# The Power of Comic Book Design in Web Development 🎭

Why did I choose a comic book aesthetic for this blog? It wasn't just because I love comics (though I do!). There are actually some fascinating design principles from comic books that translate beautifully to web development.

## Visual Hierarchy Through Bold Elements

Comic books excel at guiding the reader's eye through:

### Strong Borders and Frames
Just like comic panels, web elements with bold borders create clear boundaries and focus areas. Notice how our blog cards use thick black borders to separate content.

### Typography That Demands Attention
Comic books use varied fonts and sizes to convey emotion and importance. We're using:
- **Bangers** for headlines (dramatic impact)
- **Comic Neue** for body text (readable but playful)

### Color as Communication
Comics use color to convey mood and energy:
- **Blue (#3498db)** for primary actions and links
- **Red (#e74c3c)** for warnings or important elements  
- **Orange (#f39c12)** for highlights and accents

## Engagement Through Interactivity

Comic books are inherently interactive - readers engage with:

### Speech Bubbles
Perfect for callouts and important information! They naturally draw attention and feel conversational.

### Action Words
**POW!** **BOOM!** **ZAP!** These add energy and personality to otherwise dry content.

### Hover Effects
Just like how comic pages have motion lines, our hover effects add that sense of movement and responsiveness.

## Emotional Connection

Comics create emotional connections through:

### Personality in Design
Every element has character - from tilted cards to shadowed buttons. This makes the interface feel alive and friendly.

### Playful Interactions
Buttons that "punch" when clicked, cards that straighten when hovered - these micro-interactions bring joy to the user experience.

## Practical Benefits

Beyond the fun factor, comic book design offers real UX benefits:

1. **High Contrast**: Easy to read and accessible
2. **Clear Hierarchy**: Bold elements guide attention naturally  
3. **Memorable**: Distinctive visual style increases brand recall
4. **Universal Appeal**: Comics transcend age and cultural barriers

## Implementation Tips

If you want to try comic book styling:

\`\`\`css
.comic-card {
  border: 3px solid #2c3e50;
  border-radius: 15px;
  box-shadow: 6px 6px 0 #34495e;
  transform: rotate(-1deg);
  transition: all 0.3s ease;
}

.comic-card:hover {
  transform: rotate(0deg) scale(1.02);
}
\`\`\`

## The Result

This approach has made the blog:
- More engaging to read
- Easier to navigate
- Memorable for visitors
- Fun to maintain and update

**KAPOW!** 💥 Comic book design isn't just for comics anymore!

What do you think? Does the comic book aesthetic make reading more enjoyable? Let me know your thoughts!`,
      excerpt: 'Exploring how comic book design principles can enhance web development and user experience. Discover the psychology behind bold, playful interfaces.',
      authorId: userId,
      published: true,
      publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  ];

  await db.insert(posts).values(samplePosts);

  // Link posts to categories
  await db.insert(postCategories).values([
    { postId: post1, categoryId: lifeCategory },
    { postId: post2, categoryId: techCategory },
    { postId: post3, categoryId: techCategory },
  ]);

  // Link posts to tags
  await db.insert(postTags).values([
    { postId: post2, tagId: reactTag },
    { postId: post2, tagId: nextjsTag },
    { postId: post3, tagId: thoughtsTag },
  ]);

  console.log('✅ Database seeded successfully!');
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}