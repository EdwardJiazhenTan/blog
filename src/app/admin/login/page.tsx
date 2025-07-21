'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    fetch('/api/admin/auth/verify')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          router.push('/admin/dashboard');
        }
      })
      .catch(() => {
        // Not authenticated, stay on login page
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-md w-full mx-4">
        <div className="snoopy-card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-snoopy" style={{color: 'var(--foreground)'}}>
              Admin Access
            </h1>
            <p className="text-sm opacity-60 mt-2 font-handwriting" style={{color: 'var(--foreground)'}}>
              Enter your password to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 font-handwriting" style={{color: 'var(--foreground)'}}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-opacity-50 font-handwriting"
                style={{
                  borderColor: 'var(--foreground)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                }}
                placeholder="Enter admin password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center font-handwriting bg-red-50 p-3 rounded-2xl border-2 border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full snoopy-button"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs opacity-50 font-handwriting" style={{color: 'var(--foreground)'}}>
              Protected area • Authorized access only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}