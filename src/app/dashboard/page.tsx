import { ideas } from '@/data/ideas'

// Supabase config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface Signup {
  id: string
  email: string
  source: string
  created_at: string
  metadata: Record<string, any>
}

interface IdeaStats {
  source: string
  title: string
  total: number
  last24h: number
  last7d: number
  status: 'hot' | 'watch' | 'dead'
  firstSignup: string | null
  lastSignup: string | null
}

async function fetchSignups(): Promise<Signup[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured')
    return []
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/signups?select=*&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: 'no-store', // Always fetch fresh data
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch signups:', response.status)
      return []
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching signups:', error)
    return []
  }
}

function calculateStats(signups: Signup[]): IdeaStats[] {
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Group signups by source
  const bySource: Record<string, Signup[]> = {}
  
  signups.forEach(signup => {
    if (!bySource[signup.source]) {
      bySource[signup.source] = []
    }
    bySource[signup.source].push(signup)
  })

  // Calculate stats for each source
  const stats: IdeaStats[] = Object.entries(bySource).map(([source, sourceSignups]) => {
    const total = sourceSignups.length
    const last24h = sourceSignups.filter(s => new Date(s.created_at) > yesterday).length
    const last7d = sourceSignups.filter(s => new Date(s.created_at) > lastWeek).length

    // Determine status
    let status: 'hot' | 'watch' | 'dead' = 'dead'
    if (total > 100) status = 'hot'
    else if (total >= 10) status = 'watch'

    // Get idea title
    const idea = ideas[source]
    const title = idea ? idea.title : source

    // Get first and last signup dates
    const dates = sourceSignups.map(s => new Date(s.created_at))
    const firstSignup = new Date(Math.min(...dates.map(d => d.getTime()))).toISOString()
    const lastSignup = new Date(Math.max(...dates.map(d => d.getTime()))).toISOString()

    return {
      source,
      title,
      total,
      last24h,
      last7d,
      status,
      firstSignup,
      lastSignup,
    }
  })

  // Sort by total signups (descending)
  return stats.sort((a, b) => b.total - a.total)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function DashboardPage() {
  const signups = await fetchSignups()
  const stats = calculateStats(signups)
  const totalSignups = signups.length
  const uniqueIdeas = stats.length

  // Calculate overall metrics
  const hotIdeas = stats.filter(s => s.status === 'hot').length
  const watchIdeas = stats.filter(s => s.status === 'watch').length
  const deadIdeas = stats.filter(s => s.status === 'dead').length

  const configured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔥 Hellfire Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor signup performance across all landing pages
          </p>
        </div>

        {/* Configuration Warning */}
        {!configured && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-900">Supabase Not Configured</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables to enable data collection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overall Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Signups</div>
            <div className="text-3xl font-bold text-gray-900">{totalSignups}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Active Ideas</div>
            <div className="text-3xl font-bold text-gray-900">{uniqueIdeas}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Status Breakdown</div>
            <div className="text-sm mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-green-600">🔥 Hot (&gt;100)</span>
                <span className="font-semibold">{hotIdeas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600">👀 Watch (10-100)</span>
                <span className="font-semibold">{watchIdeas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">💀 Dead (&lt;10)</span>
                <span className="font-semibold">{deadIdeas}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Latest Signup</div>
            <div className="text-sm font-medium text-gray-900">
              {signups.length > 0 ? formatDateTime(signups[0].created_at) : 'N/A'}
            </div>
            {signups.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {ideas[signups[0].source]?.title || signups[0].source}
              </div>
            )}
          </div>
        </div>

        {/* Ideas Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Ideas Performance
            </h2>
          </div>

          {stats.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No signups yet
              </h3>
              <p className="text-gray-600">
                Deploy your landing pages and start driving traffic to see data here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Idea
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      24h
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      7d
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Signup
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Signup
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.map((stat) => (
                    <tr key={stat.source} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {stat.status === 'hot' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            🔥 Hot
                          </span>
                        )}
                        {stat.status === 'watch' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            👀 Watch
                          </span>
                        )}
                        {stat.status === 'dead' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            💀 Dead
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {stat.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          /{stat.source}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                        {stat.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {stat.last24h > 0 ? (
                          <span className="text-green-600 font-medium">+{stat.last24h}</span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {stat.last7d > 0 ? (
                          <span className="text-blue-600 font-medium">+{stat.last7d}</span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(stat.firstSignup)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(stat.lastSignup)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Signups */}
        {signups.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Signups
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Idea
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {signups.slice(0, 10).map((signup) => (
                    <tr key={signup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {signup.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ideas[signup.source]?.title || signup.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(signup.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleString('en-GB')}</p>
          <p className="mt-2">
            <a href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Landing Pages
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
