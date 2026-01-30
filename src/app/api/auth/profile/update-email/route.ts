import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateEmail } from '@/lib/validation'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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

    // Update user email (will send verification email)
    const { error } = await supabase.auth.updateUser(
      { email },
      {
        emailRedirectTo: `${request.headers.get('origin')}/auth/callback`,
      }
    )

    if (error) {
      console.error('Update email error:', error)
      
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'This email is already in use' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: error.message || 'Failed to update email' },
        { status: 500 }
      )
    }

    console.log(`[Profile] Email change requested for user ${user.id}: ${user.email} → ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Verification email sent. Please check your new email address.',
      requiresVerification: true,
    })
  } catch (error) {
    console.error('Unexpected update email error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
