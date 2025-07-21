import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return false;
    }

    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      return false;
    }

    try {
      const payload = verify(token, sessionSecret) as any;
      return payload.admin === true;
    } catch (jwtError) {
      return false;
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

export async function requireAdminAuth() {
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }
}