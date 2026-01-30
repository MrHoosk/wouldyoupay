import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateEmail } from '@/lib/validation'

// Simple in-memory rate limiter and lockout tracker (for MVP - move to Redis for production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const failedLoginMap = new Map<string, { count: number; lockedUntil: number | null }>()

const MAX_LOGIN_ATTEMPTS = 10 // Max login attempts per hour per IP
const MAX_FAILED_ATTEMPTS = 5 // Failed attempts before account lockout
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes lockout

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }) // 1 hour window
    return true
  }

  if (limit.count >= MAX_LOGIN_ATTEMPTS) {
    return false
  }

  limit.count++
  return true
}

function checkAccountLockout(email: string): { locked: boolean; remainingTime?: number } {
  const now = Date.now()
  const failedAttempts = failedLoginMap.get(email)

  if (!failedAttempts) {
    return { locked: false }
  }

  if (failedAttempts.lockedUntil && now < failedAttempts.lockedUntil) {
    const remainingTime = Math.ceil((failedAttempts.lockedUntil - now) / 1000 / 60)
    return { locked: true, remainingTime }
  }

  // Lockout expired, reset
  if (failedAttempts.lockedUntil && now >= failedAttempts.lockedUntil) {
    failedLoginMap.delete(email)
    return { locked: false }
  }

  return { locked: false }
}

function recordFailedLogin(email: string) {
  const now = Date.now()
  const failedAttempts = failedLoginMap.get(email)

  if (!failedAttempts) {
    failedLoginMap.set(email, { count: 1, lockedUntil: null })
    console.log(`[Security Audit] Failed login attempt for ${email} (1/${MAX_FAILED_ATTEMPTS})`)
    return
  }

  failedAttempts.count++
  console.log(`[Security Audit] Failed login attempt for ${email} (${failedAttempts.count}/${MAX_FAILED_ATTEMPTS})`)

  if (failedAttempts.count >= MAX_FAILED_ATTEMPTS) {
    failedAttempts.lockedUntil = now + LOCKOUT_DURATION
    console.log(`[Security Audit] Account locked for ${email} (${LOCKOUT_DURATION / 60000} minutes)`)
  }
}

function clearFailedLogins(email: string) {
  failedLoginMap.delete(email)
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    if (!checkRateLimit(ip)) {
      console.log(`[Security Audit] Rate limit exceeded for IP ${ip}`)
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password, rememberMe = false } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check account lockout
    const lockoutStatus = checkAccountLockout(email)
    if (lockoutStatus.locked) {
      console.log(`[Security Audit] Login attempt on locked account ${email}`)
      return NextResponse.json(
        { 
          error: `Account temporarily locked due to multiple failed login attempts. Try again in ${lockoutStatus.remainingTime} minutes.` 
        },
        { status: 423 } // 423 Locked
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Record failed login attempt
      recordFailedLogin(email)

      // Generic error message (don't reveal whether email exists)
      console.error(`[Security Audit] Failed login for ${email}:`, error.message)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Clear failed login attempts on successful login
    clearFailedLogins(email)
    console.log(`[Security Audit] Successful login for ${email}`)

    // If "Remember me" is enabled, extend session duration
    // Note: Supabase handles this via the session token TTL
    // For more granular control, you can update the session settings

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
        emailVerified: !!data.user?.email_confirmed_at,
      },
      session: {
        expiresAt: data.session?.expires_at,
      },
    })
  } catch (error) {
    console.error('[Security Audit] Unexpected login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
