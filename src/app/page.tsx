import { db } from '@/lib/db';
import { posts, profiles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { PostCard } from '@/components/blog/PostCard';
import { StickyNote } from '@/components/ui/StickyNote';
import Link from 'next/link';

async function getRecentPosts() {
  const recentPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      featuredImage: posts.featuredImage,
      author: {
        username: profiles.username,
        fullName: profiles.fullName,
      },
    })
    .from(posts)
    .leftJoin(profiles, eq(posts.authorId, profiles.id))
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  return recentPosts;
}

export default async function Home() {
  const recentPosts = await getRecentPosts();

  return (
    <div className="relative min-h-screen">
      {/* Sticky Notes - Floating overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="relative w-full h-full">
          <StickyNote
            id="welcome"
            content="Welcome to my little corner! ☀️

Pull up a chair and stay awhile..."
            color="yellow"
            initialPosition={{ x: 80, y: 160 }}
            rotation={-6}
            className="pointer-events-auto"
          />
          
          <StickyNote
            id="latest"
            content="Fresh stories below! 📖

Like warm cookies from the oven"
            color="peach"
            initialPosition={{ x: 720, y: 200 }}
            rotation={8}
            className="pointer-events-auto"
          />
          
          <StickyNote
            id="tip"
            content="Psst... I'm draggable! 🎭

Try moving me around!"
            color="mint"
            initialPosition={{ x: 150, y: 420 }}
            rotation={-4}
            className="pointer-events-auto"
          />
          
          <StickyNote
            id="thought"
            content="Sometimes the best ideas come from the simplest moments... 💭"
            color="lavender"
            initialPosition={{ x: 800, y: 500 }}
            rotation={12}
            className="pointer-events-auto"
          />
          
          <StickyNote
            id="tech"
            content="Built with curiosity & caffeinated dreams ☕"
            color="cream"
            initialPosition={{ x: 50, y: 600 }}
            rotation={-8}
            className="pointer-events-auto"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-0 max-w-4xl mx-auto px-4 py-16">
        {/* Snoopy-style Hero */}
        <section className="text-center mb-20">
          <h1 className="text-7xl font-bold mb-6 font-snoopy doodle-line" style={{color: 'var(--foreground)'}}>
            My Blog
          </h1>
          <div className="thought-bubble inline-block max-w-2xl">
            <p className="text-xl font-handwriting" style={{color: 'var(--foreground)'}}>
              A cozy little space where thoughts come to life, one story at a time...
            </p>
          </div>
        </section>

        {/* Recent Posts - Snoopy Style */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center font-snoopy doodle-line" style={{color: 'var(--foreground)'}}>
            Recent Adventures
          </h2>
          
          {recentPosts.length > 0 ? (
            <div className="space-y-12">
              {recentPosts.map((post, index) => (
                <div key={post.id} className={`${index % 2 === 1 ? 'ml-auto' : ''} max-w-lg`}>
                  <PostCard
                    id={post.id}
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt || ''}
                    author={{
                      username: post.author?.username || 'Anonymous',
                      fullName: post.author?.fullName,
                    }}
                    publishedAt={new Date(post.publishedAt || Date.now())}
                    featuredImage={post.featuredImage || undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="thought-bubble inline-block">
                <p className="text-lg font-handwriting" style={{color: 'var(--foreground)'}}>
                  Hmm... no posts yet! But don't worry, something wonderful is coming soon! 🌟
                </p>
              </div>
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/blog" className="snoopy-button">
              Explore More Stories
            </Link>
          </div>
        </section>

        {/* Whimsical CTA */}
        <section className="text-center">
          <div className="thought-bubble inline-block">
            <p className="text-xl font-handwriting mb-4" style={{color: 'var(--foreground)'}}>
              Want to know more about me and my adventures?
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/blog" className="snoopy-button">
                Read All Posts
              </Link>
              <Link href="/topics" className="snoopy-button green">
                Browse Topics
              </Link>
              <Link href="/about" className="snoopy-button red">
                About Me
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
