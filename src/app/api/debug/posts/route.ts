import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, profiles } from '@/lib/db/schema-postgres';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not available', posts: [] });
    }

    // Get all posts (published and unpublished) for debugging
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        published: posts.published,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        author: {
          username: profiles.username,
          fullName: profiles.fullName,
        },
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.authorId, profiles.id))
      .orderBy(desc(posts.createdAt));

    return NextResponse.json({
      totalPosts: allPosts.length,
      publishedPosts: allPosts.filter(p => p.published).length,
      posts: allPosts,
      databaseInfo: {
        environment: process.env.NODE_ENV,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch debug info',
      details: error instanceof Error ? error.message : 'Unknown error',
      posts: []
    });
  }
}