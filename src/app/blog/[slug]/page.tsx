import { db } from '@/lib/db';
import { posts, profiles, tags, postTags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      author: {
        username: profiles.username,
        fullName: profiles.fullName,
      },
    })
    .from(posts)
    .leftJoin(profiles, eq(posts.authorId, profiles.id))
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!post[0]) return null;

  // Get tags for this post
  const postTagsData = await db
    .select({
      name: tags.name,
      slug: tags.slug,
    })
    .from(postTags)
    .leftJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post[0].id));

  return {
    ...post[0],
    tags: postTagsData,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  if (!post || !post.publishedAt) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Back Navigation */}
        <div className="mb-12">
          <Link 
            href="/blog"
            className="inline-flex items-center space-x-2 text-sm opacity-70 hover:opacity-100 transition-opacity font-handwriting"
            style={{color: 'var(--foreground)'}}
          >
            <span>←</span>
            <span>Back to stories</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-6 leading-tight font-handwriting" style={{color: 'var(--foreground)'}}>
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl leading-relaxed mb-6 opacity-80 font-handwriting" style={{color: 'var(--foreground)'}}>
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/topics/${tag.slug}`}
                  className="text-sm px-4 py-2 rounded-full border border-opacity-30 hover:border-opacity-60 transition-all font-handwriting"
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
              By {post.author?.fullName || post.author?.username || 'Anonymous'}
            </span>
            <span>•</span>
            <time dateTime={post.publishedAt.toISOString()}>
              {post.publishedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            className="markdown-content"
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mt-12 mb-6 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold mt-10 mb-5 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold mt-8 mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-relaxed mb-6 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <blockquote 
                  className="border-l-4 pl-6 my-8 italic opacity-80"
                  style={{borderColor: 'var(--foreground)', color: 'var(--foreground)'}}
                >
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code 
                      className="px-2 py-1 rounded text-sm font-mono"
                      style={{
                        backgroundColor: 'rgba(45, 27, 23, 0.1)',
                        color: 'var(--foreground)'
                      }}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={className} style={{color: 'var(--foreground)'}}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre 
                  className="p-6 rounded-lg overflow-x-auto my-8 border-2"
                  style={{
                    backgroundColor: 'rgba(45, 27, 23, 0.05)',
                    borderColor: 'var(--foreground)',
                    color: 'var(--foreground)'
                  }}
                >
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-6 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-6 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {children}
                </ol>
              ),
              strong: ({ children }) => (
                <strong className="font-bold" style={{color: 'var(--foreground)'}}>
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic" style={{color: 'var(--foreground)'}}>
                  {children}
                </em>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Article Footer */}
        <footer className="mt-16 pt-12 border-t border-opacity-20" style={{borderColor: 'var(--foreground)'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-60 font-handwriting" style={{color: 'var(--foreground)'}}>
                Published on {post.publishedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <Link 
              href="/blog"
              className="inline-flex items-center space-x-2 text-sm opacity-70 hover:opacity-100 transition-opacity font-handwriting"
              style={{color: 'var(--foreground)'}}
            >
              <span>More stories</span>
              <span>→</span>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}