import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateEmail } from '@/lib/validation'

// Simple in-memory rate limiter (for MVP - move to Redis for production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(email)

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(email, { count: 1, resetAt: now + 60 * 60 * 1000 }) // 1 hour window
    return true
  }

  if (limit.count >= 3) {
    // Max 3 reset requests per hour per email
    return false
  }

  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Rate limiting by email
    if (!checkRateLimit(email)) {
      console.log(`[Security Audit] Password reset rate limit exceeded for ${email}`)
      return NextResponse.json(
        { error: 'Too many reset requests. Please try again later.' },
        { status: 429 }
      )
    }

    const supabase = await createClient()

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.headers.get('origin')}/reset-password/confirm`,
    })

    if (error) {
      console.error('[Security Audit] Password reset error:', error.message)
      // Don't reveal whether email exists - always return success
    } else {
      console.log(`[Security Audit] Password reset requested for ${email}`)
    }

    // Always return success (don't reveal whether email exists)
    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset email has been sent',
    })
  } catch (error) {
    console.error('[Security Audit] Unexpected password reset error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
