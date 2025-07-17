import { db } from '@/lib/db';
import { posts, profiles, tags, postTags } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

async function getAllPosts() {
  const allPosts = await db
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
    .orderBy(desc(posts.publishedAt));

  // Get tags for each post
  const postsWithTags = await Promise.all(
    allPosts.map(async (post) => {
      const postTagsData = await db
        .select({
          name: tags.name,
          slug: tags.slug,
        })
        .from(postTags)
        .leftJoin(tags, eq(postTags.tagId, tags.id))
        .where(eq(postTags.postId, post.id));

      return {
        ...post,
        tags: postTagsData,
      };
    })
  );

  return postsWithTags;
}

export default async function BlogPage() {
  const allPosts = await getAllPosts();

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Minimal Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
            Stories
          </h1>
          <p className="text-xl opacity-70 font-handwriting max-w-2xl mx-auto" style={{color: 'var(--foreground)'}}>
            Thoughts, experiences, and discoveries from my journey through code and life
          </p>
        </div>

        {/* Posts List - Minimal Design */}
        <div className="space-y-12">
          {allPosts.length > 0 ? (
            allPosts.map((post, index) => (
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

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Link
                            key={tag.slug}
                            href={`/topics/${tag.slug}`}
                            className="text-xs px-3 py-1 rounded-full border border-opacity-30 hover:border-opacity-60 transition-all font-handwriting"
                            style={{
                              color: 'var(--foreground)',
                              borderColor: 'var(--foreground)'
                            }}
                          >
                            {tag.name}
                          </Link>
                        ))}
                      </div>
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
                  The first chapter is yet to be written. Check back soon for thoughtful content and discoveries.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        {allPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-opacity-20 text-center" style={{borderColor: 'var(--foreground)'}}>
            <p className="text-lg opacity-60 font-handwriting" style={{color: 'var(--foreground)'}}>
              {allPosts.length} {allPosts.length === 1 ? 'story' : 'stories'} and counting...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}