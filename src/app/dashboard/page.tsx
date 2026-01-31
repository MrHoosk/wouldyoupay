import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'
import IdeasList from './IdeasList'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { saved?: string; published?: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's ideas
  const { data: ideas, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  // Fetch signup counts for each idea
  // TODO: This will be replaced with actual signup data from signups table
  const ideasWithMetrics = (ideas || []).map(idea => ({
    ...idea,
    signups: 0, // Placeholder - will be real data once Epic 4 is complete
    views: 0,   // Placeholder - will be real data once analytics are added
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Ideas
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and track your idea landing pages
                </p>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/profile"
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                >
                  Profile
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* Success Messages */}
          {searchParams.saved === 'draft' && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-200">
              <p className="text-sm text-green-800">✅ Idea saved as draft!</p>
            </div>
          )}
          {searchParams.published === 'true' && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-200">
              <p className="text-sm text-green-800">🚀 Idea published successfully!</p>
            </div>
          )}
          {searchParams.saved === 'true' && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-200">
              <p className="text-sm text-green-800">✅ Changes saved successfully!</p>
            </div>
          )}

          {/* Stats Summary */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Ideas</p>
                <p className="text-2xl font-bold text-gray-900">{ideas?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Live</p>
                <p className="text-2xl font-bold text-green-600">
                  {ideas?.filter(i => i.status === 'live').length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">
                  {ideas?.filter(i => i.status === 'draft').length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Signups</p>
                <p className="text-2xl font-bold text-blue-600">
                  {ideasWithMetrics.reduce((sum, idea) => sum + idea.signups, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="px-6 py-4">
            <Link
              href="/dashboard/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              + Create New Idea
            </Link>
            {ideas && ideas.length === 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Get started by creating your first idea landing page
              </p>
            )}
          </div>
        </div>

        {/* Ideas List */}
        {error ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-600">Error loading ideas: {error.message}</p>
          </div>
        ) : (
          <IdeasList ideas={ideasWithMetrics} />
        )}

        {/* Empty State */}
        {ideas && ideas.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">💡</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Ideas Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Create your first idea landing page to start validating your concepts.
              </p>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                + Create Your First Idea
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
