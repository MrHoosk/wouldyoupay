import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.user_metadata?.name || user.email}!
            </h1>
            <div className="flex gap-3">
              <Link 
                href="/profile"
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              >
                Profile Settings
              </Link>
              <LogoutButton />
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            You&apos;re logged in and ready to validate your ideas.
          </p>
          
          <div className="mb-6">
            <Link
              href="/dashboard/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              + Create New Idea
            </Link>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 Quick Start
            </h2>
            <ul className="list-disc list-inside text-blue-800 space-y-2">
              <li>Create your first idea landing page</li>
              <li>Share your unique URL to collect signups</li>
              <li>Track interest and validate your idea</li>
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">User ID: {user.id}</p>
            <p className="text-sm text-gray-500">Email: {user.email}</p>
            <p className="text-sm text-gray-500">
              Email Verified: {user.email_confirmed_at ? '✅ Yes' : '❌ No'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
