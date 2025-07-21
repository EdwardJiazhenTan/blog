'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login page
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--background)'}}>
      <div className="text-center">
        <p className="text-lg font-handwriting" style={{color: 'var(--foreground)'}}>
          Redirecting to admin login...
        </p>
      </div>
    </div>
  );
}