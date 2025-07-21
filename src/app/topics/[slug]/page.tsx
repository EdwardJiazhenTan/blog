import { db } from '@/lib/db';
import { posts, profiles, tags, postTags } from '@/lib/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getTagWithPosts(slug: string) {
  // Get the tag
  const tag = await db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
    })
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);

  if (!tag[0]) return null;

  // Get unique post IDs for this tag first
  const postIds = await db
    .select({ postId: postTags.postId })
    .from(postTags)
    .where(eq(postTags.tagId, tag[0].id));

  if (postIds.length === 0) {
    return {
      tag: tag[0],
      posts: [],
    };
  }

  // Then get the actual posts with their details
  const tagPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      author: {
        username: profiles.username,
        fullName: profiles.fullName,
      },
    })
    .from(posts)
    .leftJoin(profiles, eq(posts.authorId, profiles.id))
    .where(eq(posts.published, true))
    .where(inArray(posts.id, postIds.map(p => p.postId)))
    .orderBy(desc(posts.publishedAt));

  const uniquePosts = tagPosts;
  
  return {
    tag: tag[0],
    posts: uniquePosts,
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getTagWithPosts(slug);

  if (!data) {
    notFound();
  }

  const { tag, posts } = data;

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Back Navigation */}
        <div className="mb-12">
          <Link 
            href="/topics"
            className="inline-flex items-center space-x-2 text-sm opacity-70 hover:opacity-100 transition-opacity font-handwriting"
            style={{color: 'var(--foreground)'}}
          >
            <span>←</span>
            <span>All topics</span>
          </Link>
        </div>

        {/* Topic Header */}
        <div className="mb-16 text-center">
          <div 
            className="inline-block px-4 py-2 rounded-lg border border-opacity-30 mb-6"
            style={{borderColor: 'var(--foreground)'}}
          >
            <h1 className="text-3xl font-bold font-handwriting" style={{color: 'var(--foreground)'}}>
              {tag.name}
            </h1>
          </div>
          <p className="text-xl opacity-70 font-handwriting" style={{color: 'var(--foreground)'}}>
            {posts.length} {posts.length === 1 ? 'story' : 'stories'} about {tag.name.toLowerCase()}
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-12">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <article 
                key={post.id} 
                className="group border-b border-opacity-20 pb-12 last:border-b-0"
                style={{borderColor: 'var(--foreground)'}}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="block group-hover:opacity-70 transition-opacity"
                    >
                      <h2 className="text-3xl font-bold mb-3 font-handwriting leading-tight" style={{color: 'var(--foreground)'}}>
                        {post.title}
                      </h2>
                    </Link>
                    
                    {post.excerpt && (
                      <p className="text-lg leading-relaxed mb-4 opacity-80 font-handwriting" style={{color: 'var(--foreground)'}}>
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm opacity-60 font-handwriting" style={{color: 'var(--foreground)'}}>
                      <span>
                        {post.author?.fullName || post.author?.username || 'Anonymous'}
                      </span>
                      <span>•</span>
                      <time dateTime={post.publishedAt?.toISOString()}>
                        {post.publishedAt?.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                  
                  <div className="ml-8 text-2xl opacity-30 group-hover:opacity-60 transition-opacity">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center space-x-2 text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity font-handwriting"
                  style={{color: 'var(--foreground)'}}
                >
                  <span>Read more</span>
                  <span>→</span>
                </Link>
              </article>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
                  No stories yet
                </h3>
                <p className="text-lg opacity-70 font-handwriting" style={{color: 'var(--foreground)'}}>
                  Stories tagged with &quot;{tag.name}&quot; will appear here
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {posts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-opacity-20 text-center" style={{borderColor: 'var(--foreground)'}}>
            <div className="flex items-center justify-center space-x-8">
              <Link 
                href="/topics"
                className="inline-flex items-center space-x-2 text-sm opacity-70 hover:opacity-100 transition-opacity font-handwriting"
                style={{color: 'var(--foreground)'}}
              >
                <span>Explore other topics</span>
                <span>→</span>
              </Link>
              
              <Link 
                href="/blog"
                className="inline-flex items-center space-x-2 text-sm opacity-70 hover:opacity-100 transition-opacity font-handwriting"
                style={{color: 'var(--foreground)'}}
              >
                <span>All stories</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}