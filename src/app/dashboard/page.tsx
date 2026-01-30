import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {user.user_metadata?.name || user.email}!
          </h1>
          <p className="text-gray-600 mb-6">
            You&apos;re logged in and ready to validate your ideas.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 Next Steps
            </h2>
            <ul className="list-disc list-inside text-blue-800 space-y-2">
              <li>Create your first idea landing page</li>
              <li>Set up your analytics tracking</li>
              <li>Start collecting email signups</li>
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
