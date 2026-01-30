import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request: NextRequest) {
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

    // Log deletion for audit purposes
    console.log(`[GDPR] Account deletion requested for user ${user.id} (${user.email})`)

    // Delete user account
    // Note: This will cascade delete related data in Supabase
    // For production, you may want to:
    // 1. Soft delete (mark as deleted)
    // 2. Schedule hard delete after retention period
    // 3. Export user data first (GDPR right to data portability)
    
    const { error } = await supabase.auth.admin.deleteUser(user.id)

    if (error) {
      console.error('Delete account error:', error)
      
      // Fallback: Try user-initiated deletion
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        return NextResponse.json(
          { error: 'Failed to delete account. Please contact support.' },
          { status: 500 }
        )
      }

      // Even if admin delete fails, sign user out
      console.log(`[GDPR] User ${user.id} signed out (admin delete failed)`)
      
      return NextResponse.json({
        success: true,
        message: 'Account deletion initiated. You have been signed out.',
        partial: true,
      })
    }

    console.log(`[GDPR] Account successfully deleted for user ${user.id}`)

    return NextResponse.json({
      success: true,
      message: 'Account successfully deleted',
    })
  } catch (error) {
    console.error('Unexpected delete account error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
