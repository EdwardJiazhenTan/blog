import Link from "next/link";

export function Header() {
  return (
    <header
      className="bg-white shadow-lg"
      style={{ borderBottom: "4px solid var(--foreground)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="thought-bubble">
              <h1
                className="text-3xl font-bold font-snoopy"
                style={{ color: "var(--foreground)" }}
              >
                My Blog
              </h1>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="font-bubble text-lg font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground)" }}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="font-bubble text-lg font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground)" }}
            >
              Stories
            </Link>
            <Link
              href="/topics"
              className="font-bubble text-lg font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground)" }}
            >
              Topics
            </Link>
            <Link
              href="/about"
              className="font-bubble text-lg font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground)" }}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

