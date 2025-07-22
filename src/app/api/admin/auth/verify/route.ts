import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      return NextResponse.json({ authenticated: false }, { status: 500 });
    }

    try {
      const payload = verify(token, sessionSecret) as { admin: boolean; exp: number };
      
      // Check if token is valid and not expired
      if (payload.admin) {
        return NextResponse.json({ authenticated: true });
      } else {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }
    } catch (jwtError) {
      // Token is invalid or expired
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}