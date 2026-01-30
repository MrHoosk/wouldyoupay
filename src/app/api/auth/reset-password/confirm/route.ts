import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validatePassword } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update user password
    // Supabase automatically validates the reset token from the URL
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error('[Security Audit] Password update error:', error.message)
      
      if (error.message.includes('expired') || error.message.includes('invalid')) {
        return NextResponse.json(
          { error: 'Reset link expired or invalid. Please request a new one.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: error.message || 'Failed to reset password' },
        { status: 500 }
      )
    }

    console.log('[Security Audit] Password successfully reset')

    return NextResponse.json({
      success: true,
      message: 'Password successfully reset',
    })
  } catch (error) {
    console.error('[Security Audit] Unexpected password reset confirm error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
