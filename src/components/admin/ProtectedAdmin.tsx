'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface ProtectedAdminProps {
  children: React.ReactNode;
}

export function ProtectedAdmin({ children }: ProtectedAdminProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--background)'}}>
        <div className="text-center">
          <div className="snoopy-card">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
            <p className="text-sm opacity-60 mt-4 font-handwriting" style={{color: 'var(--foreground)'}}>
              Checking authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}