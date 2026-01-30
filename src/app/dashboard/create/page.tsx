'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type IdeaFormData = {
  title: string
  tagline: string
  problem: string
  solution: string
  audience: string
  price_hint: string
}

type WizardStep = 'basics' | 'details' | 'audience' | 'preview'

export default function CreateIdeaPage() {
  const router = useRouter()
  const [step, setStep] = useState<WizardStep>('basics')
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    tagline: '',
    problem: '',
    solution: '',
    audience: '',
    price_hint: '',
  })
  const [slug, setSlug] = useState('')
  const [slugError, setSlugError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Character limits
  const limits = {
    title: 60,
    tagline: 120,
    audience: 100,
    price_hint: 50,
  }

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .slice(0, 60) // Max length
  }

  // Handle field updates
  const updateField = (field: keyof IdeaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from title
    if (field === 'title' && !slug) {
      setSlug(generateSlug(value))
    }
  }

  // Validate slug
  const validateSlug = (slugValue: string): boolean => {
    setSlugError('')
    
    if (slugValue.length < 3) {
      setSlugError('Slug must be at least 3 characters')
      return false
    }
    
    if (!/^[a-z0-9-]+$/.test(slugValue)) {
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens')
      return false
    }
    
    // Reserved words
    const reserved = ['www', 'api', 'app', 'admin', 'dashboard', 'login', 'signup', 'register', 'auth', 'logout', 'profile', 'settings', 'idea', 'ideas', 'help', 'support', 'contact', 'about', 'terms', 'privacy', 'blog']
    if (reserved.includes(slugValue)) {
      setSlugError('This slug is reserved')
      return false
    }
    
    return true
  }

  // Check if current step is valid
  const isStepValid = (): boolean => {
    switch (step) {
      case 'basics':
        return formData.title.length > 0 && 
               formData.tagline.length > 0 && 
               slug.length >= 3 &&
               !slugError
      case 'details':
        return formData.problem.length > 0 && formData.solution.length > 0
      case 'audience':
        return formData.audience.length > 0
      case 'preview':
        return true
      default:
        return false
    }
  }

  // Navigate steps
  const goToStep = (nextStep: WizardStep) => {
    if (isStepValid()) {
      setStep(nextStep)
    }
  }

  // Save draft
  const saveDraft = async () => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
          status: 'draft'
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save draft')
      }
      
      router.push('/dashboard?saved=draft')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Publish idea
  const publish = async () => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
          status: 'live'
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to publish idea')
      }
      
      router.push('/dashboard?published=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish idea')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render character counter
  const CharCounter = ({ current, max }: { current: number; max: number }) => (
    <span className={`text-sm ${current > max ? 'text-red-600' : 'text-gray-500'}`}>
      {current}/{max}
    </span>
  )

  // Step progress indicator
  const steps: { id: WizardStep; name: string; number: number }[] = [
    { id: 'basics', name: 'Basics', number: 1 },
    { id: 'details', name: 'Details', number: 2 },
    { id: 'audience', name: 'Audience', number: 3 },
    { id: 'preview', name: 'Preview', number: 4 },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === step)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Idea</h1>
          <p className="mt-2 text-gray-600">
            Launch your idea in minutes. We'll create a landing page to collect signups.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${idx <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {s.number}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${idx <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'}`}>
                    {s.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${idx < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          {/* Step 1: Basics */}
          {step === 'basics' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Idea Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  maxLength={limits.title}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., AI-Powered Recipe Generator"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-500">Keep it clear and concise</p>
                  <CharCounter current={formData.title.length} max={limits.title} />
                </div>
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug *
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{slug}.wouldyoupay.io</span>
                </div>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value.toLowerCase())
                    validateSlug(e.target.value.toLowerCase())
                  }}
                  maxLength={60}
                  className={`mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${slugError ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="ai-recipe-generator"
                />
                {slugError && <p className="mt-1 text-sm text-red-600">{slugError}</p>}
                <p className="mt-1 text-sm text-gray-500">Only lowercase letters, numbers, and hyphens</p>
              </div>

              <div>
                <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline *
                </label>
                <input
                  type="text"
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  maxLength={limits.tagline}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Turn ingredients into delicious meals with AI"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-500">One compelling sentence</p>
                  <CharCounter current={formData.tagline.length} max={limits.tagline} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
                  What problem does this solve? *
                </label>
                <textarea
                  id="problem"
                  value={formData.problem}
                  onChange={(e) => updateField('problem', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="People waste time browsing recipe sites, struggle with meal planning, and don't know how to use random ingredients..."
                />
                <p className="mt-1 text-sm text-gray-500">Describe the pain point your idea addresses</p>
              </div>

              <div>
                <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-1">
                  How does your idea solve it? *
                </label>
                <textarea
                  id="solution"
                  value={formData.solution}
                  onChange={(e) => updateField('solution', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="AI instantly generates personalized recipes based on what you have in your fridge, dietary needs, and cooking skill level..."
                />
                <p className="mt-1 text-sm text-gray-500">Explain your solution clearly</p>
              </div>

              <div>
                <label htmlFor="price_hint" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Hint (Optional)
                </label>
                <input
                  type="text"
                  id="price_hint"
                  value={formData.price_hint}
                  onChange={(e) => updateField('price_hint', e.target.value)}
                  maxLength={limits.price_hint}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Free, $9/month, $99 one-time"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-500">Give visitors a sense of pricing</p>
                  <CharCounter current={formData.price_hint.length} max={limits.price_hint} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Audience */}
          {step === 'audience' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
                  Who is this for? *
                </label>
                <input
                  type="text"
                  id="audience"
                  value={formData.audience}
                  onChange={(e) => updateField('audience', e.target.value)}
                  maxLength={limits.audience}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Busy professionals who want to cook healthy meals"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-500">Who will benefit most from this?</p>
                  <CharCounter current={formData.audience.length} max={limits.audience} />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Tip: Be Specific</h3>
                <p className="text-sm text-blue-800">
                  "Busy professionals" is better than "anyone who cooks."
                  Specific audiences convert better.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 'preview' && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h2>
                <p className="text-lg text-gray-700 mb-6">{formData.tagline}</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">The Problem</h3>
                    <p className="text-gray-700">{formData.problem}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">The Solution</h3>
                    <p className="text-gray-700">{formData.solution}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Who It's For</h3>
                    <p className="text-gray-700">{formData.audience}</p>
                  </div>
                  
                  {formData.price_hint && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Pricing</h3>
                      <p className="text-gray-700">{formData.price_hint}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-300">
                  <p className="text-sm text-gray-600">
                    Your landing page will be live at:
                  </p>
                  <p className="text-sm font-mono text-blue-600">
                    https://{slug}.wouldyoupay.io
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">⚡ Ready to Launch?</h3>
                <p className="text-sm text-yellow-800">
                  Publishing makes your landing page live immediately. You can save as draft if you want to come back later.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {step !== 'basics' && (
                <button
                  onClick={() => {
                    const prevStep = steps[currentStepIndex - 1]?.id
                    if (prevStep) setStep(prevStep)
                  }}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  ← Back
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveDraft}
                disabled={isSubmitting}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Save Draft
              </button>

              {step !== 'preview' ? (
                <button
                  onClick={() => {
                    const nextStep = steps[currentStepIndex + 1]?.id
                    if (nextStep) goToStep(nextStep)
                  }}
                  disabled={!isStepValid()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={publish}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : '🚀 Publish Idea'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
