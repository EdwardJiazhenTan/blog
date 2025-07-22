'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ProtectedAdmin } from '@/components/admin/ProtectedAdmin';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  author: {
    username: string;
    fullName: string;
  };
}

function DashboardContent() {
  const { logout } = useAdminAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const handleToggleFeatured = async (postId: string, currentFeatured: boolean) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          featured: !currentFeatured,
        }),
      });

      if (response.ok) {
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, featured: !currentFeatured } : p
        ));
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    }
  };

  const handleTogglePublished = async (postId: string, currentPublished: boolean) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          published: !currentPublished,
        }),
      });

      if (response.ok) {
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, published: !currentPublished } : p
        ));
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    }
  };

  const filteredPosts = posts.filter(post => {
    switch (filter) {
      case 'published':
        return post.published;
      case 'draft':
        return !post.published;
      case 'featured':
        return post.featured;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--background)'}}>
        <div className="text-center">
          <div className="snoopy-card">
            <p className="text-lg font-handwriting" style={{color: 'var(--foreground)'}}>
              Loading posts...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-opacity-20 flex items-center justify-between" style={{borderColor: 'var(--foreground)'}}>
          <div>
            <h1 className="text-3xl font-bold font-snoopy" style={{color: 'var(--foreground)'}}>
              Admin Dashboard
            </h1>
            <p className="text-sm opacity-60 mt-1 font-handwriting" style={{color: 'var(--foreground)'}}>
              Manage your blog posts and content
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/admin/write" className="snoopy-button">
              New Post
            </Link>
            <button
              onClick={logout}
              className="text-sm px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting text-red-600 border-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Posts' },
              { key: 'published', label: 'Published' },
              { key: 'draft', label: 'Drafts' },
              { key: 'featured', label: 'Featured' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as 'all' | 'published' | 'draft')}
                className="px-4 py-2 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting"
                style={{
                  color: 'var(--foreground)',
                  borderColor: 'var(--foreground)',
                  backgroundColor: filter === key ? 'rgba(45, 27, 23, 0.1)' : 'transparent'
                }}
              >
                {label} ({posts.filter(post => {
                  switch (key) {
                    case 'published': return post.published;
                    case 'draft': return !post.published;
                    case 'featured': return post.featured;
                    default: return true;
                  }
                }).length})
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="snoopy-card inline-block">
                <p className="text-lg font-handwriting" style={{color: 'var(--foreground)'}}>
                  No posts found for this filter.
                </p>
              </div>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="snoopy-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold font-handwriting" style={{color: 'var(--foreground)'}}>
                        {post.title}
                      </h3>
                      <div className="flex space-x-2">
                        {post.published && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-lg font-handwriting">
                            Published
                          </span>
                        )}
                        {!post.published && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-lg font-handwriting">
                            Draft
                          </span>
                        )}
                        {post.featured && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-lg font-handwriting">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm opacity-70 mb-3 font-handwriting" style={{color: 'var(--foreground)'}}>
                      {post.excerpt}
                    </p>
                    
                    <div className="text-xs opacity-50 font-handwriting" style={{color: 'var(--foreground)'}}>
                      Created: {new Date(post.createdAt).toLocaleDateString()} • 
                      Updated: {new Date(post.updatedAt).toLocaleDateString()}
                      {post.publishedAt && ` • Published: ${new Date(post.publishedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-xs px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting"
                      style={{
                        color: 'var(--foreground)',
                        borderColor: 'var(--foreground)'
                      }}
                    >
                      View
                    </Link>
                    
                    <Link 
                      href={`/admin/edit/${post.id}`}
                      className="text-xs px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting"
                      style={{
                        color: 'var(--foreground)',
                        borderColor: 'var(--foreground)'
                      }}
                    >
                      Edit
                    </Link>
                    
                    <button
                      onClick={() => handleTogglePublished(post.id, post.published)}
                      className="text-xs px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting"
                      style={{
                        color: post.published ? 'var(--foreground)' : 'green',
                        borderColor: post.published ? 'var(--foreground)' : 'green'
                      }}
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    
                    <button
                      onClick={() => handleToggleFeatured(post.id, post.featured)}
                      className="text-xs px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting"
                      style={{
                        color: post.featured ? 'orange' : 'var(--foreground)',
                        borderColor: post.featured ? 'orange' : 'var(--foreground)'
                      }}
                    >
                      {post.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs px-3 py-1 border border-red-600 rounded-lg hover:bg-red-50 transition-all font-handwriting text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedAdmin>
      <DashboardContent />
    </ProtectedAdmin>
  );
}