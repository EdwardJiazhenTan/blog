'use client';

import { useState } from 'react';
import { generateId, slugify } from '@/lib/utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useMarkdownPreview } from '@/hooks/useMarkdownPreview';
import { ProtectedAdmin } from '@/components/admin/ProtectedAdmin';

function WritePageContent() {
  const { logout } = useAdminAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [featuredImage] = useState(''); // Removed featured image functionality
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  // Use markdown preview hook after content state is declared
  const { html: previewHtml, loading: previewLoading, error: previewError } = useMarkdownPreview(content);

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
        featured,
        featuredImage,
        publishedAt: published ? new Date().toISOString() : null,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setTitle('');
        setContent('');
        setExcerpt('');
        setTags('');
        setPublished(false);
        setFeatured(false);
        // setFeaturedImage(''); // Removed featured image
        alert(`Post saved successfully with ID: ${data.id}!`);
      } else {
        console.error('Failed to save post:', data);
        const errorMsg = data.error || data.details || 'Unknown error';
        alert(`Failed to save post: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Network error saving post: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with logout */}
        <header className="mb-8 pb-6 border-b border-opacity-20 flex items-center justify-between" style={{borderColor: 'var(--foreground)'}}>
          <div>
            <h1 className="text-2xl font-handwriting" style={{color: 'var(--foreground)'}}>
              Write New Post
            </h1>
            <p className="text-sm opacity-60 mt-1 font-handwriting" style={{color: 'var(--foreground)'}}>
              Draft • {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {(['edit', 'preview'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className="text-sm px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting capitalize"
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
            
            <button
              onClick={logout}
              className="text-sm px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting text-red-600 border-red-600"
            >
              Logout
            </button>
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
              placeholder="Post Title"
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
              placeholder="Brief excerpt (optional)"
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

          {/* Featured Image - Removed, use markdown instead */}

          {/* Content Editor */}
          <div className="border-t border-opacity-10 pt-8" style={{borderColor: 'var(--foreground)'}}>
            {viewMode === 'preview' ? (
              <div className="max-w-none">
                <div className="markdown-content">
                  {previewLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-lg opacity-60 font-handwriting" style={{color: 'var(--foreground)'}}>
                        Rendering preview...
                      </p>
                    </div>
                  ) : previewError ? (
                    <div className="p-4 border border-red-300 rounded-lg bg-red-50">
                      <p className="text-red-600 font-handwriting">
                        Error: {previewError}
                      </p>
                    </div>
                  ) : previewHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  ) : (
                    <p className="text-lg opacity-60 font-handwriting" style={{color: 'var(--foreground)'}}>
                      Start writing to see preview...
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-lg bg-transparent border-none outline-none placeholder-opacity-40 resize-none font-handwriting leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  minHeight: '60vh',
                  lineHeight: '1.8'
                }}
                placeholder="Start writing your post content..."
                required
              />
            )}
          </div>

          {/* Bottom Controls */}
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
                    Publish immediately
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4"
                    style={{accentColor: 'var(--foreground)'}}
                  />
                  <span className="text-sm font-handwriting" style={{color: 'var(--foreground)'}}>
                    Featured post
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
                    setFeatured(false);
                    // setFeaturedImage(''); // Removed featured image
                  }}
                  className="text-sm px-4 py-2 opacity-60 hover:opacity-100 transition-opacity font-handwriting"
                  style={{color: 'var(--foreground)'}}
                >
                  Clear
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !title || !content}
                  className="snoopy-button disabled:opacity-50"
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

export default function WritePage() {
  return (
    <ProtectedAdmin>
      <WritePageContent />
    </ProtectedAdmin>
  );
}