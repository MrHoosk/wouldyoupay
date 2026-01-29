import Link from 'next/link'
import { getAllIdeas } from '@/data/ideas'

export default function Home() {
  const ideas = getAllIdeas()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Would You Pay?
            </span>
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed">
            Stop building things nobody wants.<br />
            Test demand before you code.
          </p>

          {/* Value Prop */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 text-left">
            <div className="bg-white/5 rounded-xl p-6">
              <span className="text-3xl mb-4 block">🎯</span>
              <h3 className="text-lg font-semibold mb-2">Validate First</h3>
              <p className="text-gray-400 text-sm">
                Launch a landing page in minutes. Collect signups. See if people actually want it.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <span className="text-3xl mb-4 block">📊</span>
              <h3 className="text-lg font-semibold mb-2">Real Signals</h3>
              <p className="text-gray-400 text-sm">
                Email signups beat surveys. If people give you their email, they are interested.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <span className="text-3xl mb-4 block">🚀</span>
              <h3 className="text-lg font-semibold mb-2">Build Winners</h3>
              <p className="text-gray-400 text-sm">
                Only invest time in ideas that have proven demand. Kill the losers fast.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Experiments Section */}
      {ideas.length > 0 && (
        <div className="bg-white/5 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Ideas Being Tested
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {ideas.map((idea) => (
                <Link
                  key={idea.slug}
                  href={`https://${idea.slug}.wouldyoupay.io`}
                  className="block bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">{idea.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{idea.subheadline}</p>
                  <span className="text-blue-400 text-sm">View idea →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Have an idea</h3>
                  <p className="text-gray-400">A product, service, or tool you think people might pay for.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Launch a landing page</h3>
                  <p className="text-gray-400">Describe the problem and solution. Add an email signup form.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Drive traffic</h3>
                  <p className="text-gray-400">Spend £10-50 on ads. Share on social. See who bites.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Measure demand</h3>
                  <p className="text-gray-400">100+ signups? Build it. &lt;10 signups? Kill it and move on.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/10">
        <p>© {new Date().getFullYear()} Would You Pay. Validate before you build.</p>
      </footer>
    </div>
  )
}
