import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="thought-bubble inline-block mb-8">
            <h1 className="text-6xl font-bold font-snoopy" style={{color: 'var(--foreground)'}}>
              Hello There!
            </h1>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-2xl font-handwriting leading-relaxed" style={{color: 'var(--foreground)'}}>
              Welcome to my cozy corner of the internet, where thoughts become stories 
              and code becomes creativity.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* About Me */}
          <div className="snoopy-card">
            <h2 className="text-3xl font-bold mb-6 font-snoopy doodle-line" style={{color: 'var(--foreground)'}}>
              Who I Am
            </h2>
            <div className="space-y-4 font-handwriting text-lg" style={{color: 'var(--foreground)'}}>
              <p>
                I'm a curious soul who finds joy in the intersection of technology and storytelling. 
                By day, I craft code and solve puzzles. By evening, I write about the discoveries 
                and insights that shape my journey.
              </p>
              <p>
                This blog is my digital garden - a place where ideas can grow, thoughts can wander, 
                and stories can unfold naturally. Sometimes serious, sometimes whimsical, always authentic.
              </p>
              <p>
                I believe the best learning happens when we share our experiences, celebrate our 
                curiosities, and embrace the beautiful messiness of growth.
              </p>
            </div>
          </div>

          {/* What I Write About */}
          <div className="snoopy-card">
            <h2 className="text-3xl font-bold mb-6 font-snoopy doodle-line" style={{color: 'var(--foreground)'}}>
              What You'll Find Here
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 font-bubble" style={{color: 'var(--foreground)'}}>
                  💻 Technical Adventures
                </h3>
                <p className="font-handwriting opacity-80" style={{color: 'var(--foreground)'}}>
                  Code discoveries, learning journeys, and the occasional debugging story
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 font-bubble" style={{color: 'var(--foreground)'}}>
                  🌱 Life Reflections
                </h3>
                <p className="font-handwriting opacity-80" style={{color: 'var(--foreground)'}}>
                  Personal thoughts, growth moments, and observations about the world
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 font-bubble" style={{color: 'var(--foreground)'}}>
                  🎨 Creative Experiments
                </h3>
                <p className="font-handwriting opacity-80" style={{color: 'var(--foreground)'}}>
                  Design projects, writing experiments, and playful explorations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-snoopy doodle-line" style={{color: 'var(--foreground)'}}>
              My Writing Philosophy
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="thought-bubble mb-4">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="text-xl font-bold font-bubble" style={{color: 'var(--foreground)'}}>
                  Authentic
                </h3>
              </div>
              <p className="font-handwriting opacity-80" style={{color: 'var(--foreground)'}}>
                Real experiences, honest reflections, genuine insights
              </p>
            </div>
            
            <div className="text-center">
              <div className="thought-bubble mb-4">
                <div className="text-3xl mb-2">🌟</div>
                <h3 className="text-xl font-bold font-bubble" style={{color: 'var(--foreground)'}}>
                  Curious
                </h3>
              </div>
              <p className="font-handwriting opacity-80" style={{color: 'var(--foreground)'}}>
                Always learning, questioning, exploring new perspectives
              </p>
            </div>
            
            <div className="text-center">
              <div className="thought-bubble mb-4">
                <div className="text-3xl mb-2">☕</div>
                <h3 className="text-xl font-bold font-bubble" style={{color: 'var(--foreground)'}}>
                  Cozy
                </h3>
              </div>
              <p className="font-handwriting opacity-80" style={{color: 'var(--foreground)'}}>
                Warm, welcoming, like a conversation with a friend
              </p>
            </div>
          </div>
        </section>

        {/* Fun Facts */}
        <section className="mb-20">
          <div className="snoopy-card wavy-border" style={{backgroundColor: 'var(--snoopy-yellow)'}}>
            <h2 className="text-3xl font-bold mb-6 font-snoopy text-center" style={{color: 'var(--foreground)'}}>
              Random Fun Facts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-handwriting text-lg" style={{color: 'var(--foreground)'}}>
              <ul className="space-y-3">
                <li>☕ Powered by curiosity and caffeinated dreams</li>
                <li>📚 Always have 3+ books in progress</li>
                <li>🎵 Code better with lo-fi beats playing</li>
              </ul>
              <ul className="space-y-3">
                <li>🌱 Believe in learning something new every day</li>
                <li>🎨 Love designing things that feel warm and human</li>
                <li>✨ Think the best ideas come from simple moments</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact/Connect */}
        <section className="text-center">
          <div className="thought-bubble inline-block mb-8">
            <h2 className="text-3xl font-bold font-snoopy" style={{color: 'var(--foreground)'}}>
              Let's Connect!
            </h2>
            <p className="text-lg font-handwriting mt-4" style={{color: 'var(--foreground)'}}>
              I'd love to hear your thoughts, share stories, or just say hello
            </p>
          </div>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/blog" className="snoopy-button">
              Read My Stories
            </Link>
            <button className="snoopy-button red">
              Say Hello
            </button>
            <Link href="/" className="snoopy-button green">
              Back Home
            </Link>
          </div>
          
          <div className="mt-12">
            <p className="text-sm opacity-60 font-handwriting" style={{color: 'var(--foreground)'}}>
              This little corner of the web was built with Next.js, SQLite, and lots of love ✨
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}