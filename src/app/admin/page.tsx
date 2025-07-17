'use client';

import { useState } from 'react';
import { generateId, slugify } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postData = {
        id: generateId(),
        title,
        slug: slugify(title),
        content,
        excerpt,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        authorId: 'admin',
        published,
        publishedAt: published ? new Date().toISOString() : null,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setExcerpt('');
        setTags('');
        setPublished(false);
        alert('Post saved successfully!');
      } else {
        alert('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Minimal Header */}
        <header className="mb-8 pb-6 border-b border-opacity-20 flex items-center justify-between" style={{borderColor: 'var(--foreground)'}}>
          <div>
            <h1 className="text-2xl font-handwriting" style={{color: 'var(--foreground)'}}>
              Write
            </h1>
            <p className="text-sm opacity-60 mt-1 font-handwriting" style={{color: 'var(--foreground)'}}>
              Draft • {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex space-x-2">
            {(['edit', 'split', 'preview'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className="text-sm px-3 py-1 border border-opacity-30 rounded-full hover:border-opacity-60 transition-all font-handwriting capitalize"
                style={{
                  color: 'var(--foreground)',
                  borderColor: 'var(--foreground)',
                  backgroundColor: viewMode === mode ? 'rgba(45, 27, 23, 0.1)' : 'transparent'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder-opacity-40 font-handwriting"
              style={{color: 'var(--foreground)'}}
              placeholder="Title"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full text-xl bg-transparent border-none outline-none placeholder-opacity-40 resize-none h-20 font-handwriting"
              style={{color: 'var(--foreground)'}}
              placeholder="Excerpt (optional)"
            />
          </div>

          {/* Tags */}
          <div>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full text-lg bg-transparent border-none outline-none placeholder-opacity-40 font-handwriting"
              style={{color: 'var(--foreground)'}}
              placeholder="Tags (comma-separated: tech, life, thoughts)"
            />
          </div>

          {/* Content */}
          <div className="border-t border-opacity-10 pt-8" style={{borderColor: 'var(--foreground)'}}>
            {viewMode === 'split' ? (
              /* Split Mode */
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm opacity-60 mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
                    Editor
                  </h3>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-base bg-transparent border border-opacity-20 rounded-lg p-4 outline-none placeholder-opacity-40 resize-none font-handwriting leading-relaxed"
                    style={{
                      color: 'var(--foreground)',
                      borderColor: 'var(--foreground)',
                      minHeight: '60vh',
                      lineHeight: '1.7'
                    }}
                    placeholder="Start writing..."
                    required
                  />
                </div>
                <div>
                  <h3 className="text-sm opacity-60 mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
                    Preview
                  </h3>
                  <div 
                    className="border border-opacity-20 rounded-lg p-4 overflow-y-auto"
                    style={{
                      borderColor: 'var(--foreground)',
                      minHeight: '60vh'
                    }}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold mt-4 mb-3 font-handwriting" style={{color: 'var(--foreground)'}}>
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-bold mt-3 mb-2 font-handwriting" style={{color: 'var(--foreground)'}}>
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-bold mt-2 mb-2 font-handwriting" style={{color: 'var(--foreground)'}}>
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-sm leading-relaxed mb-3 font-handwriting" style={{color: 'var(--foreground)'}}>
                              {children}
                            </p>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote 
                              className="border-l-2 pl-3 my-3 italic opacity-80 text-sm"
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
                                  className="px-1 py-0.5 rounded text-xs font-mono"
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
                              className="p-3 rounded text-xs overflow-x-auto my-3 border"
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
                            <ul className="list-disc list-inside space-y-1 mb-3 text-sm font-handwriting" style={{color: 'var(--foreground)'}}>
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 mb-3 text-sm font-handwriting" style={{color: 'var(--foreground)'}}>
                              {children}
                            </ol>
                          ),
                        }}
                      >
                        {content || '*Start writing to see preview...*'}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ) : viewMode === 'preview' ? (
              /* Preview Mode */
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-4xl font-bold mt-8 mb-6 font-handwriting" style={{color: 'var(--foreground)'}}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-3xl font-bold mt-6 mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-2xl font-bold mt-4 mb-3 font-handwriting" style={{color: 'var(--foreground)'}}>
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-lg leading-relaxed mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
                        {children}
                      </p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote 
                        className="border-l-4 pl-4 my-6 italic opacity-80"
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
                        className="p-4 rounded-lg overflow-x-auto my-6 border-2"
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
                      <ul className="list-disc list-inside space-y-1 mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 mb-4 font-handwriting" style={{color: 'var(--foreground)'}}>
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
                  {content || 'Start writing to see preview...'}
                </ReactMarkdown>
              </div>
            ) : (
              /* Edit Mode */
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-lg bg-transparent border-none outline-none placeholder-opacity-40 resize-none font-handwriting leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  minHeight: '60vh',
                  lineHeight: '1.8'
                }}
                placeholder="Start writing..."
                required
              />
            )}
          </div>

          {/* Controls */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-opacity-20 p-4" style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--foreground)'
          }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4"
                    style={{accentColor: 'var(--foreground)'}}
                  />
                  <span className="text-sm font-handwriting" style={{color: 'var(--foreground)'}}>
                    Publish
                  </span>
                </label>
                
                <div className="text-xs opacity-50 font-handwriting" style={{color: 'var(--foreground)'}}>
                  {content.length} characters • {Math.ceil(content.split(' ').length / 200)} min read
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setContent('');
                    setExcerpt('');
                    setTags('');
                    setPublished(false);
                  }}
                  className="text-sm px-4 py-2 opacity-60 hover:opacity-100 transition-opacity font-handwriting"
                  style={{color: 'var(--foreground)'}}
                >
                  Clear
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !title || !content}
                  className="text-sm px-6 py-2 border border-opacity-30 rounded-full hover:border-opacity-60 transition-all disabled:opacity-30 font-handwriting"
                  style={{
                    color: 'var(--foreground)',
                    borderColor: 'var(--foreground)'
                  }}
                >
                  {isSubmitting ? 'Saving...' : published ? 'Publish' : 'Save Draft'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}