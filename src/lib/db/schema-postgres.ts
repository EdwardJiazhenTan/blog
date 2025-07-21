import { sql } from 'drizzle-orm';
import { text, timestamp, boolean, pgTable, uuid } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  username: text('username').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  authorId: uuid('author_id').notNull().references(() => profiles.id),
  published: boolean('published').default(false),
  featured: boolean('featured').default(false),
  featuredImage: text('featured_image'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`),
});

export const postCategories = pgTable('post_categories', {
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`),
});

export const postTags = pgTable('post_tags', {
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').references(() => profiles.id),
  content: text('content').notNull(),
  approved: boolean('approved').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`),
});