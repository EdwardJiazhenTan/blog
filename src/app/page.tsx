import { db } from "@/lib/db";
import { posts, profiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { PostCard } from "@/components/blog/PostCard";
import { StickyNotesContainer } from "@/components/layout/StickyNotesContainer";
import Link from "next/link";

async function getRecentPosts() {
  const recentPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      featuredImage: posts.featuredImage,
      featured: posts.featured,
      author: {
        username: profiles.username,
        fullName: profiles.fullName,
      },
    })
    .from(posts)
    .leftJoin(profiles, eq(posts.authorId, profiles.id))
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  return recentPosts;
}

async function getFeaturedPosts() {
  const featuredPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      featuredImage: posts.featuredImage,
      featured: posts.featured,
      author: {
        username: profiles.username,
        fullName: profiles.fullName,
      },
    })
    .from(posts)
    .leftJoin(profiles, eq(posts.authorId, profiles.id))
    .where(eq(posts.published, true))
    .where(eq(posts.featured, true))
    .orderBy(desc(posts.publishedAt))
    .limit(2);

  return featuredPosts;
}

export default async function Home() {
  const recentPosts = await getRecentPosts();
  const featuredPosts = await getFeaturedPosts();

  return (
    <div className="relative min-h-screen">
      {/* Sticky Notes - Positioned in margins and safe areas */}
      <StickyNotesContainer />

      {/* Main Content */}
      <div className="relative z-0 max-w-4xl mx-auto px-4 py-16 lg:px-8 xl:px-16">
        {/* Snoopy-style Hero */}
        <section className="text-center mb-30">
          <h1
            className="text-7xl font-bold mb-16 font-snoopy doodle-line"
            style={{ color: "var(--foreground)", paddingBottom: "0.5rem" }}
          >
            Ed&apos;s Blog
          </h1>
          <div className="thought-bubble inline-block max-w-2xl">
            <p
              className="text-xl font-handwriting"
              style={{ color: "var(--foreground)" }}
            >
              A cozy little space where thoughts come to life, one story at a
              time...
            </p>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-20">
            <h2
              className="text-4xl font-bold mb-12 text-center font-snoopy doodle-line"
              style={{ color: "var(--foreground)" }}
            >
              Featured Stories
            </h2>

            <div className="space-y-12">
              {featuredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`${index % 2 === 1 ? "ml-auto" : ""} max-w-lg`}
                >
                  <PostCard
                    id={post.id}
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt || ""}
                    author={{
                      username: post.author?.username || "Anonymous",
                      fullName: post.author?.fullName,
                    }}
                    publishedAt={new Date(post.publishedAt || Date.now())}
                    featuredImage={post.featuredImage || undefined}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts - Snoopy Style */}
        <section className="mb-20">
          <h2
            className="text-4xl font-bold mb-12 text-center font-snoopy doodle-line"
            style={{ color: "var(--foreground)" }}
          >
            Recent Adventures
          </h2>

          {recentPosts.length > 0 ? (
            <div className="space-y-12">
              {recentPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`${index % 2 === 1 ? "ml-auto" : ""} max-w-lg`}
                >
                  <PostCard
                    id={post.id}
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt || ""}
                    author={{
                      username: post.author?.username || "Anonymous",
                      fullName: post.author?.fullName,
                    }}
                    publishedAt={new Date(post.publishedAt || Date.now())}
                    featuredImage={post.featuredImage || undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="thought-bubble inline-block">
                <p
                  className="text-lg font-handwriting"
                  style={{ color: "var(--foreground)" }}
                >
                  Hmm... no posts yet! But don&apos;t worry, something wonderful is
                  coming soon! 🌟
                </p>
              </div>
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/blog" className="snoopy-button">
              Explore More Stories
            </Link>
          </div>
        </section>

        {/* Whimsical CTA */}
        <section className="text-center">
          <div className="thought-bubble inline-block">
            <p
              className="text-xl font-handwriting mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Want to know more about me and my adventures?
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/blog" className="snoopy-button">
                Read All Posts
              </Link>
              <Link href="/topics" className="snoopy-button green">
                Browse Topics
              </Link>
              <Link href="/about" className="snoopy-button red">
                About Me
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
