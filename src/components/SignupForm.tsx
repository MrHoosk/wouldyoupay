'use client'

import { useState, FormEvent } from 'react'

interface SignupFormProps {
  source: string
  cta?: string
  buttonClass?: string
}

export default function SignupForm({ 
  source, 
  cta = 'Get Early Access',
  buttonClass = 'bg-white text-gray-900 hover:bg-gray-100'
}: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!email) return

    setStatus('loading')

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage("You're on the list! We'll be in touch.")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center p-6 bg-white/10 rounded-xl">
        <span className="text-4xl mb-4 block">🎉</span>
        <p className="text-lg font-semibold">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${buttonClass}`}
      >
        {status === 'loading' ? 'Signing up...' : cta}
      </button>
      {status === 'error' && (
        <p className="text-red-300 text-sm mt-2 sm:absolute sm:mt-14">{message}</p>
      )}
    </form>
  )
}
