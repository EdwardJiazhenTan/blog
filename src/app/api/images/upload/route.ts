import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verify } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    const sessionSecret = process.env.SESSION_SECRET;
    
    if (!token || !sessionSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      const payload = verify(token, sessionSecret) as { admin: boolean; exp: number };
      if (!payload.admin) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No media file provided' },
        { status: 400 }
      );
    }

    // Validate file type - support images and videos
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      // Videos
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: JPEG, PNG, GIF, WebP, MP4, WebM, MOV, AVI.' },
        { status: 400 }
      );
    }

    // Validate file size - larger limit for videos
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for videos, 5MB for images
    
    if (file.size > maxSize) {
      const maxSizeLabel = isVideo ? '50MB' : '5MB';
      return NextResponse.json(
        { error: `File size too large. Maximum size is ${maxSizeLabel}.` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const folder = isVideo ? 'blog-videos' : 'blog-images';
    const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      url: blob.url,
      filename: filename,
      size: file.size,
      type: file.type,
      isVideo: isVideo,
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}