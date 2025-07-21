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
      featuredImage: posts.featuredImage,
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

  // Calculate read time (roughly 200 words per minute)
  const wordCount = post[0].content.split(' ').length;
  const readTime = Math.ceil(wordCount / 200);

  return {
    ...post[0],
    tags: postTagsData,
    readTime,
    wordCount,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

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
        <header className="mb-16">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12 overflow-hidden rounded-2xl border-2" style={{borderColor: 'var(--foreground)'}}>
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Title with clean styling */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-snoopy" style={{color: 'var(--foreground)'}}>
              {post.title}
            </h1>
            
            {post.excerpt && (
              <div className="max-w-3xl mx-auto mb-8">
                <p className="text-xl leading-relaxed font-handwriting opacity-80" style={{color: 'var(--foreground)'}}>
                  {post.excerpt}
                </p>
              </div>
            )}
          </div>

          {/* Meta Info Card */}
          <div className="snoopy-card max-w-2xl mx-auto mb-8">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-handwriting" style={{color: 'var(--foreground)'}}>
              <div className="flex items-center space-x-2">
                <span className="opacity-60">By</span>
                <span className="font-semibold">
                  {post.author?.fullName || post.author?.username || 'Anonymous'}
                </span>
              </div>
              <span className="opacity-40">•</span>
              <time dateTime={post.publishedAt.toISOString()}>
                {post.publishedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="opacity-40">•</span>
              <span className="opacity-60">
                {post.readTime} min read
              </span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/topics/${tag.slug}`}
                  className="snoopy-button"
                  style={{
                    backgroundColor: 'var(--snoopy-yellow)',
                    color: 'var(--foreground)',
                    borderColor: 'var(--foreground)'
                  }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mt-16 mb-8 font-snoopy text-center" style={{color: 'var(--foreground)'}}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold mt-12 mb-6 font-snoopy relative" style={{color: 'var(--foreground)'}}>
                  {children}
                  <div className="absolute -bottom-1 left-0 w-12 h-0.5 opacity-60" style={{backgroundColor: 'var(--snoopy-yellow)'}}></div>
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold mt-10 mb-5 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-relaxed mb-8 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <div className="border-l-4 pl-6 my-8 italic bg-gray-50 py-4 rounded-r-lg" style={{borderColor: 'var(--snoopy-yellow)', color: 'var(--foreground)'}}>
                  <div className="font-handwriting text-lg">
                    {children}
                  </div>
                </div>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code 
                      className="px-2 py-1 rounded-lg text-sm font-mono border"
                      style={{
                        backgroundColor: 'rgba(45, 27, 23, 0.1)',
                        color: 'var(--foreground)',
                        borderColor: 'var(--foreground)'
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
                <div className="snoopy-card my-10">
                  <pre 
                    className="p-6 rounded-lg overflow-x-auto font-mono text-sm"
                    style={{
                      backgroundColor: 'rgba(45, 27, 23, 0.05)',
                      color: 'var(--foreground)'
                    }}
                  >
                    {children}
                  </pre>
                </div>
              ),
              ul: ({ children }) => (
                <ul className="space-y-4 mb-8 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-4 mb-8 font-handwriting counter-reset" style={{color: 'var(--foreground)'}}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-current mt-2.5 flex-shrink-0 opacity-60"></span>
                  <span className="text-lg leading-relaxed">{children}</span>
                </li>
              ),
              img: ({ src, alt }) => (
                <div className="my-12">
                  <div className="snoopy-card overflow-hidden">
                    <img
                      src={src}
                      alt={alt}
                      className="w-full h-auto rounded-lg"
                      loading="lazy"
                    />
                    {alt && (
                      <p className="text-center text-sm opacity-70 mt-4 font-handwriting" style={{color: 'var(--foreground)'}}>
                        {alt}
                      </p>
                    )}
                  </div>
                </div>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href}
                  className="font-semibold hover:underline transition-all duration-200 hover:opacity-80"
                  style={{color: 'var(--snoopy-blue)'}}
                  target={href?.startsWith('http') ? '_blank' : '_self'}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
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
          </div>
        </article>

        {/* Article Footer */}
        <footer className="mt-20">
          {/* Closing message */}
          <div className="text-center mb-12">
            <div className="max-w-2xl mx-auto border-t-2 pt-8" style={{borderColor: 'var(--snoopy-yellow)'}}>
              <p className="text-lg font-handwriting opacity-80" style={{color: 'var(--foreground)'}}>
                Thanks for reading! Hope you enjoyed this little adventure through words and ideas. 
                {post.tags && post.tags.length > 0 && (
                  <span> Found this interesting? Check out more stories about {post.tags.map(t => t.name).join(', ')}!</span>
                )}
              </p>
            </div>
          </div>

          {/* Post Meta */}
          <div className="snoopy-card mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6 text-sm font-handwriting" style={{color: 'var(--foreground)'}}>
                <span className="opacity-60">
                  Published {post.publishedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="opacity-40">•</span>
                <span className="opacity-60">
                  {post.wordCount} words
                </span>
                <span className="opacity-40">•</span>
                <span className="opacity-60">
                  {post.readTime} min read
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link 
                  href="/blog"
                  className="snoopy-button text-sm px-4 py-2"
                >
                  More Stories
                </Link>
                
                {post.tags && post.tags.length > 0 && (
                  <Link 
                    href="/topics"
                    className="snoopy-button text-sm px-4 py-2"
                    style={{
                      backgroundColor: 'var(--snoopy-green)',
                      color: 'white'
                    }}
                  >
                    Explore Topics
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Back to top */}
          <div className="text-center">
            <a 
              href="#top"
              className="inline-flex items-center space-x-2 text-sm opacity-70 hover:opacity-100 transition-opacity font-handwriting"
              style={{color: 'var(--foreground)'}}
            >
              <span>Back to top</span>
              <span>↑</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}