import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, profiles, tags, postTags } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId, slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    let query = db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
        author: {
          username: profiles.username,
          fullName: profiles.fullName,
        },
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.authorId, profiles.id))
      .orderBy(desc(posts.createdAt));

    if (published === 'true') {
      query = query.where(eq(posts.published, true));
    }

    const allPosts = await query;
    
    return NextResponse.json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, slug, content, excerpt, tags: postTagNames, authorId, published, publishedAt } = body;

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: 'Title, content, and authorId are required' },
        { status: 400 }
      );
    }

    // Create the post
    await db.insert(posts).values({
      id,
      title,
      slug,
      content,
      excerpt,
      authorId,
      published: published || false,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Handle tags if provided
    if (postTagNames && postTagNames.length > 0) {
      for (const tagName of postTagNames) {
        // Check if tag exists, create if not
        const existingTag = await db
          .select()
          .from(tags)
          .where(eq(tags.name, tagName))
          .limit(1);

        let tagId;
        if (existingTag.length > 0) {
          tagId = existingTag[0].id;
        } else {
          // Create new tag
          tagId = generateId();
          await db.insert(tags).values({
            id: tagId,
            name: tagName,
            slug: slugify(tagName),
            createdAt: new Date(),
          });
        }

        // Link post to tag
        await db.insert(postTags).values({
          postId: id,
          tagId: tagId,
        });
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}