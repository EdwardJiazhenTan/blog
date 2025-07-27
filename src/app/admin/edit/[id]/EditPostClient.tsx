"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useMarkdownPreview } from "@/hooks/useMarkdownPreview";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface EditPostClientProps {
  params: { id: string };
}

export function EditPostClient({ params }: EditPostClientProps) {
  const { logout } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [featuredImage, setFeaturedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use markdown preview hook after content state is declared
  const {
    html: previewHtml,
    loading: previewLoading,
    error: previewError,
  } = useMarkdownPreview(content);

  const handleImageInsert = (
    mediaUrl: string,
    altText: string,
    isVideo?: boolean,
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    let mediaHtml: string;

    if (isVideo) {
      mediaHtml = `<video controls style="max-width: 100%; height: auto;" class="img-medium">
  <source src="${mediaUrl}" type="video/mp4">
  Your browser does not support the video tag.
</video>`;
    } else {
      mediaHtml = `<img src="${mediaUrl}" alt="${altText}" class="img-medium" />`;
    }

    const currentPosition = textarea.selectionStart;
    const newContent =
      content.substring(0, currentPosition) +
      mediaHtml +
      content.substring(currentPosition);

    setContent(newContent);

    // Focus back to textarea and set cursor after inserted media
    setTimeout(() => {
      textarea.focus();
      const newPosition = currentPosition + mediaHtml.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if (response.ok) {
        const post = await response.json();
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt || "");
        setPublished(post.published);
        setFeatured(post.featured);
        setFeaturedImage(post.featuredImage || "");
        // TODO: Fetch tags for this post
        setTags("");
      } else {
        alert("Post not found");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Error loading post");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postData = {
        title,
        slug: slugify(title),
        content,
        excerpt,
        published,
        featured,
        featuredImage,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      const response = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert("Post updated successfully!");
        router.push("/admin/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Failed to update post: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="text-center">
          <div className="snoopy-card">
            <p
              className="text-lg font-handwriting"
              style={{ color: "var(--foreground)" }}
            >
              Loading post...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header
          className="mb-8 pb-6 border-b border-opacity-20 flex items-center justify-between"
          style={{ borderColor: "var(--foreground)" }}
        >
          <div>
            <h1
              className="text-2xl font-handwriting"
              style={{ color: "var(--foreground)" }}
            >
              Edit Post
            </h1>
            <p
              className="text-sm opacity-60 mt-1 font-handwriting"
              style={{ color: "var(--foreground)" }}
            >
              Modify your blog post
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {(["edit", "preview"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className="text-sm px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting capitalize"
                  style={{
                    color: "var(--foreground)",
                    borderColor: "var(--foreground)",
                    backgroundColor:
                      viewMode === mode
                        ? "rgba(45, 27, 23, 0.1)"
                        : "transparent",
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            <Link
              href="/admin/dashboard"
              className="text-sm px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--foreground)",
              }}
            >
              Back to Dashboard
            </Link>

            <button
              onClick={logout}
              className="text-sm px-3 py-1 border border-opacity-30 rounded-lg hover:border-opacity-60 transition-all font-handwriting text-red-600 border-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder-opacity-40 font-handwriting"
              style={{ color: "var(--foreground)" }}
              placeholder="Post Title"
              required
            />
          </div>

          {/* Meta fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2 font-handwriting"
                style={{ color: "var(--foreground)" }}
              >
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full text-base bg-transparent border border-opacity-20 rounded-lg p-3 outline-none placeholder-opacity-40 resize-none font-handwriting"
                style={{
                  color: "var(--foreground)",
                  borderColor: "var(--foreground)",
                }}
                placeholder="Brief description of the post"
                rows={3}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2 font-handwriting"
                style={{ color: "var(--foreground)" }}
              >
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full text-base bg-transparent border border-opacity-20 rounded-lg p-3 outline-none placeholder-opacity-40 font-handwriting"
                style={{
                  color: "var(--foreground)",
                  borderColor: "var(--foreground)",
                }}
                placeholder="Tags (comma-separated: tech, life, thoughts)"
              />
            </div>
          </div>

          {/* Image Upload */}
          {viewMode === "edit" && (
            <ImageUpload onImageInsert={handleImageInsert} />
          )}

          {/* Content Editor */}
          <div
            className="border-t border-opacity-10 pt-8"
            style={{ borderColor: "var(--foreground)" }}
          >
            {viewMode === "preview" ? (
              <div className="max-w-none">
                <div className="markdown-content">
                  {previewLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <p
                        className="text-lg opacity-60 font-handwriting"
                        style={{ color: "var(--foreground)" }}
                      >
                        Rendering preview...
                      </p>
                    </div>
                  ) : previewError ? (
                    <div className="p-4 border border-red-300 rounded-lg bg-red-50">
                      <p className="text-red-600 font-handwriting">
                        Error: {previewError}
                      </p>
                    </div>
                  ) : previewHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  ) : (
                    <p
                      className="text-lg opacity-60 font-handwriting"
                      style={{ color: "var(--foreground)" }}
                    >
                      Start writing to see preview...
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-lg bg-transparent border-none outline-none placeholder-opacity-40 resize-none font-handwriting leading-relaxed"
                style={{
                  color: "var(--foreground)",
                  minHeight: "60vh",
                  lineHeight: "1.8",
                }}
                placeholder="Start writing your post content..."
                required
              />
            )}
          </div>

          {/* Bottom Controls */}
          <div
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-opacity-20 p-4"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--foreground)",
            }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4"
                    style={{ accentColor: "var(--foreground)" }}
                  />
                  <span
                    className="text-sm font-handwriting"
                    style={{ color: "var(--foreground)" }}
                  >
                    Published
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4"
                    style={{ accentColor: "var(--foreground)" }}
                  />
                  <span
                    className="text-sm font-handwriting"
                    style={{ color: "var(--foreground)" }}
                  >
                    Featured
                  </span>
                </label>

                <div
                  className="text-xs opacity-50 font-handwriting"
                  style={{ color: "var(--foreground)" }}
                >
                  {content.length} characters •{" "}
                  {Math.ceil(content.split(" ").length / 200)} min read
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  href="/admin/dashboard"
                  className="text-sm px-4 py-2 opacity-60 hover:opacity-100 transition-opacity font-handwriting"
                  style={{ color: "var(--foreground)" }}
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || !title || !content}
                  className="snoopy-button disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

