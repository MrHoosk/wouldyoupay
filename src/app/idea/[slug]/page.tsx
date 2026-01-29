import { notFound } from 'next/navigation'
import { getIdea, getAllIdeas } from '@/data/ideas'
import SignupForm from '@/components/SignupForm'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for known ideas
export async function generateStaticParams() {
  const ideas = getAllIdeas()
  return ideas.map((idea) => ({
    slug: idea.slug,
  }))
}

// Dynamic metadata based on idea
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const idea = getIdea(slug)
  
  if (!idea) {
    return { title: 'Not Found | Would You Pay' }
  }

  return {
    title: `${idea.title} | Would You Pay`,
    description: idea.subheadline,
  }
}

const colorClasses: Record<string, { bg: string; button: string; accent: string }> = {
  blue: {
    bg: 'from-blue-600 to-blue-800',
    button: 'bg-blue-500 hover:bg-blue-400',
    accent: 'text-blue-400'
  },
  green: {
    bg: 'from-green-600 to-green-800',
    button: 'bg-green-500 hover:bg-green-400',
    accent: 'text-green-400'
  },
  purple: {
    bg: 'from-purple-600 to-purple-800',
    button: 'bg-purple-500 hover:bg-purple-400',
    accent: 'text-purple-400'
  },
  orange: {
    bg: 'from-orange-600 to-orange-800',
    button: 'bg-orange-500 hover:bg-orange-400',
    accent: 'text-orange-400'
  },
  red: {
    bg: 'from-red-600 to-red-800',
    button: 'bg-red-500 hover:bg-red-400',
    accent: 'text-red-400'
  },
  teal: {
    bg: 'from-teal-600 to-teal-800',
    button: 'bg-teal-500 hover:bg-teal-400',
    accent: 'text-teal-400'
  }
}

export default async function IdeaPage({ params }: PageProps) {
  const { slug } = await params
  const idea = getIdea(slug)

  if (!idea) {
    notFound()
  }

  const colors = colorClasses[idea.color] || colorClasses.blue

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} text-white`}>
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <span className="inline-block px-4 py-1 mb-6 text-sm font-semibold bg-white/20 rounded-full">
            🚀 Coming Soon
          </span>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {idea.headline}
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
            {idea.subheadline}
          </p>

          {/* Signup Form */}
          <div className="max-w-md mx-auto mb-16">
            <SignupForm 
              source={idea.slug} 
              cta={idea.cta}
              buttonClass={colors.button}
            />
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-black/20 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              The Problem
            </h2>
            <p className="text-lg text-white/80 leading-relaxed text-center">
              {idea.problem}
            </p>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              The Solution
            </h2>
            <p className="text-lg text-white/80 leading-relaxed text-center mb-12">
              {idea.solution}
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4">
              {idea.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-white/10 rounded-lg p-4"
                >
                  <span className={`text-2xl ${colors.accent}`}>✓</span>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-16 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Would you pay for this?
            </h2>
            <p className="text-white/80 mb-8">
              Join the waitlist. If enough people sign up, we will build it.
            </p>
            <SignupForm 
              source={idea.slug} 
              cta={idea.cta}
              buttonClass={colors.button}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-white/60 text-sm">
        <p>A <a href="https://wouldyoupay.io" className="underline hover:text-white">Would You Pay</a> experiment</p>
      </footer>
    </div>
  )
}
