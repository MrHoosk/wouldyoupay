import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateName } from '@/lib/validation'

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
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!validateName(name)) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Update user metadata
    const { error } = await supabase.auth.updateUser({
      data: { name }
    })

    if (error) {
      console.error('Update name error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update name' },
        { status: 500 }
      )
    }

    console.log(`[Profile] Name updated for user ${user.id}`)

    return NextResponse.json({
      success: true,
      message: 'Name updated successfully',
    })
  } catch (error) {
    console.error('Unexpected update name error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
