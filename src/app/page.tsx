import Link from 'next/link'
import { getAllIdeas } from '@/data/ideas'

export default function Home() {
  const ideas = getAllIdeas()
  const ideaCount = ideas.length
  
  return (
    <div className="min-h-screen bg-[var(--paper-white)] text-[var(--ink-black)]">
      
      {/* Navigation */}
      <nav className="border-b-2 border-[var(--ink-black)]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-pixel text-sm md:text-base tracking-tight">
            WYP?
          </Link>
          <div className="flex items-center gap-4">
            <Link href="#ideas" className="text-sm font-medium hover:underline underline-offset-4">
              Ideas
            </Link>
            <Link href="/login" className="btn-ghost text-xs py-2 px-4">
              Log In
            </Link>
            <Link href="/register" className="btn-primary text-xs py-2 px-4">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Pixel Headline */}
            <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed md:leading-relaxed mb-8">
              WOULD
              <br />
              THEY
              <br />
              PAY?
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-[var(--cool-grey)] mb-4 max-w-2xl mx-auto">
              Stop building things nobody wants.
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-xl mx-auto">
              Test your idea in 60 seconds. Get real signals before you write a single line of code.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/register" className="btn-primary text-sm px-8 py-4">
                Test Your Idea
              </Link>
              <button className="btn-ghost text-sm px-8 py-4">
                See How It Works
              </button>
            </div>
            
            {/* Social Proof */}
            <p className="text-sm text-[var(--cool-grey)]">
              <span className="font-semibold text-[var(--ink-black)]">{ideaCount} ideas</span> being validated by builders like you
            </p>
            
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 border-t-2 border-[var(--ink-black)]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            <div className="card">
              <div className="font-pixel text-2xl mb-4">01</div>
              <h3 className="font-pixel text-xs mb-3 uppercase">Validate First</h3>
              <p className="text-[var(--cool-grey)]">
                Launch a landing page in minutes. Collect signups. See if people actually want it before you build.
              </p>
            </div>
            
            <div className="card">
              <div className="font-pixel text-2xl mb-4">02</div>
              <h3 className="font-pixel text-xs mb-3 uppercase">Real Signals</h3>
              <p className="text-[var(--cool-grey)]">
                Email signups beat surveys. If someone gives you their email, they&apos;re interested. That&apos;s signal.
              </p>
            </div>
            
            <div className="card">
              <div className="font-pixel text-2xl mb-4">03</div>
              <h3 className="font-pixel text-xs mb-3 uppercase">Build Winners</h3>
              <p className="text-[var(--cool-grey)]">
                Only invest time in ideas with proven demand. Kill the losers fast. Ship the winners.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[var(--ink-black)] text-[var(--paper-white)]">
        <div className="container mx-auto px-6">
          <h2 className="font-pixel text-lg md:text-xl text-center mb-12 uppercase">
            How It Works
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--signal-yellow)] text-[var(--ink-black)] font-pixel text-sm flex items-center justify-center border-2 border-[var(--paper-white)]">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Have an idea</h3>
                <p className="text-[var(--warm-grey)]">
                  A product, service, or tool you think people might pay for. Doesn&apos;t need to be perfect.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--signal-yellow)] text-[var(--ink-black)] font-pixel text-sm flex items-center justify-center border-2 border-[var(--paper-white)]">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Create a landing page</h3>
                <p className="text-[var(--warm-grey)]">
                  Describe the problem and your solution. We generate a page with email capture in seconds.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--signal-yellow)] text-[var(--ink-black)] font-pixel text-sm flex items-center justify-center border-2 border-[var(--paper-white)]">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Share and measure</h3>
                <p className="text-[var(--warm-grey)]">
                  Post it. Run £20 in ads. Share on social. See who actually signs up.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--success-green)] text-[var(--ink-black)] font-pixel text-sm flex items-center justify-center border-2 border-[var(--paper-white)]">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Decide with data</h3>
                <p className="text-[var(--warm-grey)]">
                  100+ signups? Build it. &lt;10 signups? Kill it. No more guessing.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Ideas Being Tested */}
      {ideas.length > 0 && (
        <section id="ideas" className="py-16 border-t-2 border-[var(--ink-black)]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-pixel text-lg md:text-xl mb-4 uppercase">
                Ideas Being Tested
              </h2>
              <p className="text-[var(--cool-grey)]">
                Real ideas from real builders. Click to see their landing pages.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {ideas.slice(0, 9).map((idea) => (
                <Link
                  key={idea.slug}
                  href={`https://${idea.slug}.wouldyoupay.io`}
                  className="card-flat group hover:bg-[var(--signal-yellow)] transition-colors"
                >
                  <h3 className="font-pixel text-xs mb-2 uppercase group-hover:text-[var(--ink-black)]">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-[var(--cool-grey)] group-hover:text-[var(--ink-black)] line-clamp-2">
                    {idea.subheadline}
                  </p>
                </Link>
              ))}
            </div>
            
            {ideas.length > 9 && (
              <div className="text-center mt-8">
                <button className="btn-ghost text-xs">
                  View All {ideas.length} Ideas
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* For Builders Section */}
      <section className="py-16 bg-[var(--signal-yellow)] border-t-2 border-[var(--ink-black)]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-pixel text-lg md:text-xl mb-6 uppercase">
              Built for Builders
            </h2>
            <p className="text-lg mb-8">
              Whether you&apos;re shipping with AI, building solo, or testing ideas for clients — 
              validation should be the first step, not an afterthought.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="bg-[var(--ink-black)] text-[var(--paper-white)] px-4 py-2">Indie Hackers</span>
              <span className="bg-[var(--ink-black)] text-[var(--paper-white)] px-4 py-2">AI Builders</span>
              <span className="bg-[var(--ink-black)] text-[var(--paper-white)] px-4 py-2">Solo Founders</span>
              <span className="bg-[var(--ink-black)] text-[var(--paper-white)] px-4 py-2">Agencies</span>
              <span className="bg-[var(--ink-black)] text-[var(--paper-white)] px-4 py-2">Side Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t-2 border-[var(--ink-black)]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-pixel text-xl md:text-2xl mb-6 uppercase">
            Ready to Test?
          </h2>
          <p className="text-lg text-[var(--cool-grey)] mb-8 max-w-xl mx-auto">
            Your next idea could be your best one. Or it could be a waste of three months. Find out in 60 seconds.
          </p>
          <Link href="/register" className="btn-primary text-sm px-12 py-4">
            Test Your Idea Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t-2 border-[var(--ink-black)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-pixel text-xs">WYP?</div>
            <p className="text-sm text-[var(--cool-grey)]">
              © {new Date().getFullYear()} Would You Pay. Validate before you build.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:underline underline-offset-4">About</Link>
              <Link href="#" className="hover:underline underline-offset-4">Blog</Link>
              <Link href="#" className="hover:underline underline-offset-4">Twitter</Link>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  )
}
