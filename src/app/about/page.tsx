import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <ScrollReveal animation="fade" duration={800}>
          <section className="text-center mb-20">
            <div className="thought-bubble inline-block mb-8">
              <h1
                className="text-6xl font-bold font-snoopy"
                style={{ color: "var(--foreground)" }}
              >
                About Me
              </h1>
            </div>

            <div className="max-w-2xl mx-auto">
              <p
                className="text-2xl font-handwriting leading-relaxed"
                style={{ color: "var(--foreground)" }}
              >
                Software engineer passionate about technology, clean code, and
                continuous learning.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* About Me */}
          <ScrollReveal animation="slide-left" duration={1000} delay={200}>
            <div className="snoopy-card">
              <h2
                className="text-3xl font-bold mb-6 font-snoopy doodle-line"
                style={{ color: "var(--foreground)" }}
              >
                Who I Am
              </h2>
              <div
                className="space-y-4 font-handwriting text-lg"
                style={{ color: "var(--foreground)" }}
              >
                <p>
                  I'm a software engineer and University of Rochester graduate
                  (Class of 2025) with a double major in Computer Science and
                  Business.
                </p>
                <p>
                  I'm passionate about building efficient, scalable solutions
                  and exploring the intersection of technology and user
                  experience. Always eager to learn new technologies and tackle
                  challenging problems.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Hobbies */}
          <ScrollReveal animation="slide-right" duration={1000} delay={400}>
            <div className="snoopy-card">
              <h2
                className="text-3xl font-bold mb-6 font-snoopy doodle-line"
                style={{ color: "var(--foreground)" }}
              >
                Hobbies & Interests
              </h2>
              <ul
                className="space-y-2 font-handwriting text-lg"
                style={{ color: "var(--foreground)" }}
              >
                <li>Video Games</li>
                <li>Cooking</li>
                <li>Reading</li>
                <li>Music</li>
                <li>Car Modification</li>
                <li>Arch Linux</li>
                <li>Neovim</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* What I Post About */}
        <ScrollReveal animation="bounce" duration={1200} delay={600}>
          <section className="mb-20">
            <div className="snoopy-card">
              <h2
                className="text-3xl font-bold mb-8 font-snoopy doodle-line text-center"
                style={{ color: "var(--foreground)" }}
              >
                What I Write About
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="thought-bubble mb-4">
                    <h3
                      className="text-xl font-bold font-bubble"
                      style={{ color: "var(--foreground)" }}
                    >
                      Tech
                    </h3>
                  </div>
                  <p
                    className="font-handwriting opacity-80"
                    style={{ color: "var(--foreground)" }}
                  >
                    Technical tutorials, programming insights, and technology
                    trends
                  </p>
                </div>

                <div className="text-center">
                  <div className="thought-bubble mb-4">
                    <h3
                      className="text-xl font-bold font-bubble"
                      style={{ color: "var(--foreground)" }}
                    >
                      Dev Config
                    </h3>
                  </div>
                  <p
                    className="font-handwriting opacity-80"
                    style={{ color: "var(--foreground)" }}
                  >
                    Development environment setups, dotfiles, and productivity
                    tips
                  </p>
                </div>

                <div className="text-center">
                  <div className="thought-bubble mb-4">
                    <h3
                      className="text-xl font-bold font-bubble"
                      style={{ color: "var(--foreground)" }}
                    >
                      Dev Blog
                    </h3>
                  </div>
                  <p
                    className="font-handwriting opacity-80"
                    style={{ color: "var(--foreground)" }}
                  >
                    Project walkthroughs, coding challenges, and development
                    stories
                  </p>
                </div>

                <div className="text-center">
                  <div className="thought-bubble mb-4">
                    <h3
                      className="text-xl font-bold font-bubble"
                      style={{ color: "var(--foreground)" }}
                    >
                      Life
                    </h3>
                  </div>
                  <p
                    className="font-handwriting opacity-80"
                    style={{ color: "var(--foreground)" }}
                  >
                    Personal reflections, design principles, and creative
                    projects
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Social Links */}
        <ScrollReveal animation="fade" duration={1000} delay={800}>
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-4xl font-bold font-snoopy doodle-line"
                style={{ color: "var(--foreground)" }}
              >
                Connect With Me
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="snoopy-card hover:scale-105 transition-transform duration-300">
                  <h3
                    className="text-xl font-bold font-bubble mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    LinkedIn
                  </h3>
                  <p
                    className="font-handwriting mb-4 opacity-80"
                    style={{ color: "var(--foreground)" }}
                  >
                    Professional network and career updates
                  </p>
                  <a
                    href="https://linkedin.com/in/edward-j-tan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="snoopy-button"
                  >
                    View Profile
                  </a>
                </div>
              </div>

              <div className="text-center">
                <div className="snoopy-card hover:scale-105 transition-transform duration-300">
                  <h3
                    className="text-xl font-bold font-bubble mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    GitHub
                  </h3>
                  <p
                    className="font-handwriting mb-4 opacity-80"
                    style={{ color: "var(--foreground)" }}
                  >
                    Code repositories and open source projects
                  </p>
                  <a
                    href="https://github.com/EdwardJiazhenTan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="snoopy-button green"
                  >
                    View Code
                  </a>
                </div>
              </div>

              <div className="text-center">
                <div className="snoopy-card hover:scale-105 transition-transform duration-300">
                  <h3
                    className="text-xl font-bold font-bubble mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    Portfolio
                  </h3>
                  <p
                    className="font-handwriting mb-4 opacity-80"
                    style={{ color: "var(--foreground)" }}
                  >
                    Showcase of projects and work experience
                  </p>
                  <a
                    href="https://edwardjtan.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="snoopy-button red"
                  >
                    View Work
                  </a>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Contact/Connect */}
        <ScrollReveal animation="bounce" duration={1000} delay={1000}>
          <section className="text-center">
            <div className="thought-bubble inline-block mb-8">
              <h2
                className="text-3xl font-bold font-snoopy"
                style={{ color: "var(--foreground)" }}
              >
                Let's Connect
              </h2>
              <p
                className="text-lg font-handwriting mt-4"
                style={{ color: "var(--foreground)" }}
              >
                Always open to discussing tech, sharing ideas, or collaborating
                on projects
              </p>
            </div>

            <div className="flex gap-6 justify-center flex-wrap">
              <Link href="/blog" className="snoopy-button">
                Read My Posts
              </Link>
              <Link href="/topics" className="snoopy-button green">
                Browse Topics
              </Link>
              <Link href="/" className="snoopy-button red">
                Back Home
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}

