'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Idea = {
  id: string
  slug: string
  title: string
  tagline: string
  status: 'draft' | 'live' | 'paused' | 'archived'
  created_at: string
  updated_at: string
  signups: number
  views: number
}

type SortField = 'created_at' | 'updated_at' | 'title' | 'signups' | 'views'
type SortOrder = 'asc' | 'desc'

export default function IdeasList({ ideas }: { ideas: Idea[] }) {
  const router = useRouter()
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter and sort ideas
  const filteredIdeas = ideas
    .filter(idea => {
      // Status filter
      if (filterStatus !== 'all' && idea.status !== filterStatus) {
        return false
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          idea.title.toLowerCase().includes(query) ||
          idea.tagline.toLowerCase().includes(query) ||
          idea.slug.toLowerCase().includes(query)
        )
      }
      return true
    })
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      // Handle dates
      if (sortField === 'created_at' || sortField === 'updated_at') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      // Handle strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Toggle sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // Delete idea
  const deleteIdea = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return
    }
    
    setDeletingId(id)
    
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete idea')
      }
      
      // Refresh page to show updated list
      router.refresh()
    } catch (error) {
      alert('Failed to delete idea. Please try again.')
      setDeletingId(null)
    }
  }

  // Toggle pause/unpause
  const togglePause = async (idea: Idea) => {
    const newStatus = idea.status === 'paused' ? 'live' : 'paused'
    
    try {
      const response = await fetch(`/api/ideas/${idea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...idea,
          status: newStatus,
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update status')
      }
      
      router.refresh()
    } catch (error) {
      alert('Failed to update status. Please try again.')
    }
  }

  // Status badge
  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 border-gray-300',
      live: 'bg-green-100 text-green-800 border-green-300',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      archived: 'bg-red-100 text-red-800 border-red-300',
    }
    
    const icons = {
      draft: '📝',
      live: '🟢',
      paused: '⏸️',
      archived: '🗄️',
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors]}`}>
        {icons[status as keyof typeof icons]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (ideas.length === 0) {
    return null // Empty state handled by parent
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters and Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="live">Live</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          {/* Sort */}
          <div>
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortField(field as SortField)
                setSortOrder(order as SortOrder)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="updated_at-desc">Recently Updated</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="signups-desc">Most Signups</option>
              <option value="views-desc">Most Views</option>
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredIdeas.length} of {ideas.length} ideas
        </div>
      </div>

      {/* Ideas Table/List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort('title')}
              >
                Idea {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort('signups')}
              >
                Signups {sortField === 'signups' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort('views')}
              >
                Views {sortField === 'views' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort('updated_at')}
              >
                Last Updated {sortField === 'updated_at' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIdeas.map((idea) => (
              <tr key={idea.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {idea.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-md">
                      {idea.tagline}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {idea.slug}.wouldyoupay.io
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={idea.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {idea.signups}
                  </div>
                  {idea.signups > 0 && (
                    <div className="text-xs text-gray-500">
                      {((idea.signups / (idea.views || 1)) * 100).toFixed(1)}% conversion
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {idea.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(idea.updated_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {/* View Page */}
                    <a
                      href={`https://${idea.slug}.wouldyoupay.io`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                      title="View landing page"
                    >
                      👁️
                    </a>
                    
                    {/* Edit */}
                    <Link
                      href={`/dashboard/edit/${idea.id}`}
                      className="text-gray-600 hover:text-gray-900"
                      title="Edit idea"
                    >
                      ✏️
                    </Link>
                    
                    {/* Pause/Unpause */}
                    {idea.status === 'live' || idea.status === 'paused' ? (
                      <button
                        onClick={() => togglePause(idea)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title={idea.status === 'paused' ? 'Resume' : 'Pause'}
                      >
                        {idea.status === 'paused' ? '▶️' : '⏸️'}
                      </button>
                    ) : null}
                    
                    {/* Delete */}
                    <button
                      onClick={() => deleteIdea(idea.id, idea.title)}
                      disabled={deletingId === idea.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      title="Delete idea"
                    >
                      {deletingId === idea.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No results */}
      {filteredIdeas.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No ideas match your filters</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setFilterStatus('all')
            }}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
