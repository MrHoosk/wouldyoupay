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

// GET /api/ideas - List user's ideas
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Fetch user's ideas
    const { data: ideas, error: fetchError } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      console.error('Error fetching ideas:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 })
    }
    
    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Unexpected error in GET /api/ideas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/ideas - Create new idea
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      status = 'draft'
    } = body
    
    // Validate required fields
    if (!slug || !title || !tagline || !problem || !solution || !audience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate status
    if (!['draft', 'live', 'paused', 'archived'].includes(status)) {
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
    
    // Check if user has reached idea limit (Free tier: 2 active ideas)
    const { count: activeIdeasCount } = await supabase
      .from('ideas')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['live', 'paused'])
      .is('deleted_at', null)
    
    // TODO: Check user's subscription tier
    // For now, enforce free tier limit (2 active ideas)
    const MAX_FREE_IDEAS = 2
    if (status !== 'draft' && (activeIdeasCount || 0) >= MAX_FREE_IDEAS) {
      return NextResponse.json({
        error: `Free tier allows up to ${MAX_FREE_IDEAS} active ideas. Upgrade to Pro for unlimited ideas.`,
        upgrade_required: true
      }, { status: 403 })
    }
    
    // Check slug uniqueness
    const { data: existingIdea } = await supabase
      .from('ideas')
      .select('id')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single()
    
    if (existingIdea) {
      return NextResponse.json({ error: 'This slug is already taken' }, { status: 400 })
    }
    
    // Insert idea
    const { data: newIdea, error: insertError } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
        slug,
        title,
        tagline,
        problem,
        solution,
        audience,
        price_hint: price_hint || null,
        status
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error creating idea:', insertError)
      return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 })
    }
    
    return NextResponse.json({ idea: newIdea }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/ideas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
