import Link from 'next/link';
import { clsx } from 'clsx';

interface PostCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    username: string;
    fullName?: string;
  };
  publishedAt: Date;
  featuredImage?: string;
  categories?: Array<{ name: string; slug: string }>;
  className?: string;
}

export function PostCard({
  title,
  slug,
  excerpt,
  author,
  publishedAt,
  featuredImage,
  categories = [],
  className
}: PostCardProps) {
  return (
    <article className={clsx('snoopy-card', className)}>
      {featuredImage && (
        <div className="mb-4 overflow-hidden wavy-border border-2" style={{borderColor: 'var(--foreground)'}}>
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      {categories.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="inline-block bg-yellow-300 px-3 py-1 text-sm font-semibold rounded-full border-2 border-gray-800 hover:bg-yellow-400 transition-colors font-bubble"
              style={{backgroundColor: 'var(--snoopy-yellow)', borderColor: 'var(--foreground)'}}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-3 font-snoopy doodle-line" style={{color: 'var(--foreground)'}}>
        <Link 
          href={`/blog/${slug}`}
          className="hover:opacity-80 transition-opacity"
        >
          {title}
        </Link>
      </h2>
      
      <p className="mb-4 leading-relaxed font-handwriting" style={{color: 'var(--foreground)'}}>
        {excerpt}
      </p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 font-bubble" style={{color: 'var(--foreground)'}}>
          <span className="font-semibold">
            {author.fullName || author.username}
          </span>
          <span>•</span>
          <time dateTime={publishedAt.toISOString()}>
            {publishedAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        
        <Link
          href={`/blog/${slug}`}
          className="snoopy-button text-sm"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}