import { db } from '@/lib/db';
import { tags, postTags, posts } from '@/lib/db/schema-postgres';
import { eq, desc, count, and, inArray } from 'drizzle-orm';
import Link from 'next/link';

async function getAllTags() {
  if (!db) {
    console.error('Database not available');
    return [];
  }
  
  // Get all tags first
  const allTags = await db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
      createdAt: tags.createdAt,
    })
    .from(tags)
    .orderBy(tags.name);

  // Get post counts for each tag using the same two-step approach
  const tagsWithCounts = await Promise.all(
    allTags.map(async (tag) => {
      // Step 1: Get post IDs for this tag
      if (!db) return { ...tag, postCount: 0 };
      const postIds = await db
        .select({ postId: postTags.postId })
        .from(postTags)
        .where(eq(postTags.tagId, tag.id));

      if (postIds.length === 0) {
        return {
          ...tag,
          postCount: 0,
        };
      }

      // Step 2: Count published posts with those IDs
      const publishedPosts = await db
        .select({ id: posts.id })
        .from(posts)
        .where(and(eq(posts.published, true), inArray(posts.id, postIds.map(p => p.postId))));

      return {
        ...tag,
        postCount: publishedPosts.length,
      };
    })
  );

  // Only return tags that have at least one published post
  return tagsWithCounts.filter(tag => tag.postCount > 0);
}

export default async function TopicsPage() {
  const allTags = await getAllTags();

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Minimal Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
            Topics
          </h1>
          <p className="text-xl opacity-70 font-handwriting max-w-2xl mx-auto" style={{color: 'var(--foreground)'}}>
            Explore stories organized by themes and interests
          </p>
        </div>

        {/* Topics Grid */}
        {allTags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/topics/${tag.slug}`}
                className="group block"
              >
                <div 
                  className="p-6 border border-opacity-20 rounded-lg hover:border-opacity-40 transition-all duration-300 text-center group-hover:transform group-hover:scale-105"
                  style={{borderColor: 'var(--foreground)'}}
                >
                  <h3 className="text-2xl font-bold mb-2 font-handwriting" style={{color: 'var(--foreground)'}}>
                    {tag.name}
                  </h3>
                  <p className="text-sm opacity-60 font-handwriting" style={{color: 'var(--foreground)'}}>
                    {tag.postCount} {tag.postCount === 1 ? 'story' : 'stories'}
                  </p>
                  
                  {/* Decorative element */}
                  <div 
                    className="w-8 h-0.5 mx-auto mt-4 rounded opacity-30 group-hover:opacity-60 transition-opacity"
                    style={{backgroundColor: 'var(--foreground)'}}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
                No topics yet
              </h3>
              <p className="text-lg opacity-70 font-handwriting" style={{color: 'var(--foreground)'}}>
                Topics will appear here as stories are published with tags
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        {allTags.length > 0 && (
          <div className="mt-20 pt-12 border-t border-opacity-20 text-center" style={{borderColor: 'var(--foreground)'}}>
            <p className="text-lg opacity-60 font-handwriting" style={{color: 'var(--foreground)'}}>
              {allTags.length} {allTags.length === 1 ? 'topic' : 'topics'} • {allTags.reduce((sum, tag) => sum + tag.postCount, 0)} total stories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}