import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, tags, postTags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Handle database connection failure
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Handle database connection failure
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available', success: false },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, excerpt, published, featured, featuredImage, tags: postTagNames } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Update the post
    await db
      .update(posts)
      .set({
        title,
        slug: slug || slugify(title),
        content,
        excerpt,
        published: published || false,
        featured: featured || false,
        featuredImage,
        updatedAt: new Date(),
        publishedAt: published ? new Date() : null,
      })
      .where(eq(posts.id, id));

    // Handle tags update
    if (postTagNames) {
      // Remove existing tags
      await db.delete(postTags).where(eq(postTags.postId, id));
      
      // Add new tags
      if (postTagNames.length > 0) {
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
            const newTagId = `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await db.insert(tags).values({
              id: newTagId,
              name: tagName,
              slug: slugify(tagName),
              createdAt: new Date(),
            });
            tagId = newTagId;
          }

          // Link post to tag
          await db.insert(postTags).values({
            postId: id,
            tagId: tagId,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update post', details: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Handle database connection failure
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available', success: false },
        { status: 500 }
      );
    }

    const { id } = await params;
    // Delete the post (cascading deletes will handle postTags and postCategories)
    const result = await db
      .delete(posts)
      .where(eq(posts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete post', details: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}