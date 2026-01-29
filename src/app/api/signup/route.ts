import { NextRequest, NextResponse } from 'next/server'

// Supabase configuration - set these in environment variables
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json()

    // Validate input
    if (!email || !source) {
      return NextResponse.json(
        { error: 'Email and source are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // If Supabase is configured, save to database
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/signups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email,
          source,
          created_at: new Date().toISOString(),
          metadata: {
            user_agent: request.headers.get('user-agent'),
            referer: request.headers.get('referer'),
          }
        }),
      })

      if (!response.ok) {
        // Check if it's a duplicate
        if (response.status === 409) {
          return NextResponse.json(
            { error: 'This email is already on the list!' },
            { status: 409 }
          )
        }
        
        console.error('Supabase error:', await response.text())
        return NextResponse.json(
          { error: 'Failed to save signup' },
          { status: 500 }
        )
      }
    } else {
      // No Supabase configured - log for debugging
      console.log('📧 New signup (Supabase not configured):', { email, source, timestamp: new Date().toISOString() })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
