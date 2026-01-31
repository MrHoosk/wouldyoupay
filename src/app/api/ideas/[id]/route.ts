import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Reserved slugs that cannot be used
const RESERVED_SLUGS = [
  'www', 'api', 'app', 'admin', 'dashboard', 'login', 'signup', 'register',
  'auth', 'logout', 'profile', 'settings', 'idea', 'ideas', 'help', 'support',
  'contact', 'about', 'terms', 'privacy', 'blog', 'docs', 'pricing', 'features',
  'home', 'index', 'static', 'public', 'cdn', 'assets', 'images', 'img'
]

// Profanity filter (basic list - expand as needed)
const PROFANITY_LIST = [
  'fuck', 'shit', 'damn', 'ass', 'bitch', 'bastard', 'crap', 'hell',
  'dick', 'cock', 'pussy', 'cunt', 'whore', 'slut', 'fag', 'nigger'
]

function validateSlug(slug: string): { valid: boolean; error?: string } {
  // Length check
  if (slug.length < 3) {
    return { valid: false, error: 'Slug must be at least 3 characters' }
  }
  
  if (slug.length > 60) {
    return { valid: false, error: 'Slug must be 60 characters or less' }
  }
  
  // Format check
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { 
      valid: false, 
      error: 'Slug can only contain lowercase letters, numbers, and hyphens' 
    }
  }
  
  // Cannot start or end with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { valid: false, error: 'Slug cannot start or end with a hyphen' }
  }
  
  // Reserved words
  if (RESERVED_SLUGS.includes(slug)) {
    return { valid: false, error: 'This slug is reserved' }
  }
  
  // Profanity check
  if (PROFANITY_LIST.some(word => slug.includes(word))) {
    return { valid: false, error: 'Slug contains inappropriate content' }
  }
  
  return { valid: true }
}

// GET /api/ideas/[id] - Get single idea
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Fetch idea
    const { data: idea, error: fetchError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()
    
    if (fetchError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }
    
    return NextResponse.json({ idea })
  } catch (error) {
    console.error('Unexpected error in GET /api/ideas/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/ideas/[id] - Update idea
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Fetch existing idea
    const { data: existingIdea, error: fetchError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()
    
    if (fetchError || !existingIdea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }
    
    // Parse request body
    const body = await request.json()
    const {
      slug,
      title,
      tagline,
      problem,
      solution,
      audience,
      price_hint,
      status
    } = body
    
    // Validate required fields
    if (!slug || !title || !tagline || !problem || !solution || !audience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate status
    if (status && !['draft', 'live', 'paused', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    
    // Validate character limits
    if (title.length > 60) {
      return NextResponse.json({ error: 'Title too long (max 60 characters)' }, { status: 400 })
    }
    
    if (tagline.length > 120) {
      return NextResponse.json({ error: 'Tagline too long (max 120 characters)' }, { status: 400 })
    }
    
    if (audience.length > 100) {
      return NextResponse.json({ error: 'Audience too long (max 100 characters)' }, { status: 400 })
    }
    
    if (price_hint && price_hint.length > 50) {
      return NextResponse.json({ error: 'Price hint too long (max 50 characters)' }, { status: 400 })
    }
    
    // Validate slug
    const slugValidation = validateSlug(slug)
    if (!slugValidation.valid) {
      return NextResponse.json({ error: slugValidation.error }, { status: 400 })
    }
    
    // If slug changed, check uniqueness
    if (slug !== existingIdea.slug) {
      const { data: slugConflict } = await supabase
        .from('ideas')
        .select('id')
        .eq('slug', slug)
        .neq('id', params.id)
        .is('deleted_at', null)
        .single()
      
      if (slugConflict) {
        return NextResponse.json({ error: 'This slug is already taken' }, { status: 400 })
      }
      
      // Store old slug for potential redirect tracking
      // In a production app, you might want to create a slug_redirects table
      console.log(`[Slug Change] Idea ${params.id}: ${existingIdea.slug} → ${slug}`)
    }
    
    // Update idea
    const { data: updatedIdea, error: updateError } = await supabase
      .from('ideas')
      .update({
        slug,
        title,
        tagline,
        problem,
        solution,
        audience,
        price_hint: price_hint || null,
        status: status || existingIdea.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating idea:', updateError)
      return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      idea: updatedIdea,
      slug_changed: slug !== existingIdea.slug,
      old_slug: existingIdea.slug
    })
  } catch (error) {
    console.error('Unexpected error in PUT /api/ideas/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/ideas/[id] - Soft delete idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Soft delete idea (set deleted_at timestamp)
    const { error: deleteError } = await supabase
      .from('ideas')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', params.id)
      .eq('user_id', user.id)
    
    if (deleteError) {
      console.error('Error deleting idea:', deleteError)
      return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/ideas/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
