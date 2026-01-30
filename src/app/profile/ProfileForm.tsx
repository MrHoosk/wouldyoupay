'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
}

interface ProfileFormProps {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<'name' | 'email' | 'password' | 'delete'>('name')
  
  // Name section state
  const [name, setName] = useState(user.name)
  const [nameError, setNameError] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)

  // Email section state
  const [email, setEmail] = useState(user.email)
  const [emailError, setEmailError] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)

  // Password section state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Delete section state
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || name.trim().length < 2) {
      setNameError('Name must be at least 2 characters')
      return
    }

    setNameLoading(true)
    setNameError('')
    setNameSuccess(false)

    try {
      const response = await fetch('/api/auth/profile/update-name', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setNameError(data.error || 'Failed to update name')
        setNameLoading(false)
        return
      }

      setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 3000)
      router.refresh()
    } catch (error) {
      setNameError('An unexpected error occurred')
    } finally {
      setNameLoading(false)
    }
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email address')
      return
    }

    setEmailLoading(true)
    setEmailError('')
    setEmailSuccess(false)

    try {
      const response = await fetch('/api/auth/profile/update-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setEmailError(data.error || 'Failed to update email')
        setEmailLoading(false)
        return
      }

      setEmailSuccess(true)
      router.refresh()
    } catch (error) {
      setEmailError('An unexpected error occurred')
    } finally {
      setEmailLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError('All fields are required')
      return
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwords.new.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess(false)

    try {
      const response = await fetch('/api/auth/profile/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.error || 'Failed to update password')
        setPasswordLoading(false)
        return
      }

      setPasswordSuccess(true)
      setPasswords({ current: '', new: '', confirm: '' })
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error) {
      setPasswordError('An unexpected error occurred')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAccountDeletion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (deleteConfirm !== 'DELETE') {
      setDeleteError('Type DELETE to confirm')
      return
    }

    setDeleteLoading(true)
    setDeleteError('')

    try {
      const response = await fetch('/api/auth/profile/delete-account', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        setDeleteError(data.error || 'Failed to delete account')
        setDeleteLoading(false)
        return
      }

      // Redirect to home after successful deletion
      router.push('/')
      router.refresh()
    } catch (error) {
      setDeleteError('An unexpected error occurred')
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['name', 'email', 'password', 'delete'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section as any)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeSection === section
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section === 'name' && 'Name'}
                {section === 'email' && 'Email'}
                {section === 'password' && 'Password'}
                {section === 'delete' && 'Delete Account'}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Name Section */}
          {activeSection === 'name' && (
            <form onSubmit={handleNameUpdate} className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Name</h3>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setNameError('')
                  }}
                  className={`w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    nameError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={nameLoading}
                />
                {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
                {nameSuccess && <p className="mt-1 text-sm text-green-600">Name updated successfully!</p>}
              </div>
              <button
                type="submit"
                disabled={nameLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {nameLoading ? 'Updating...' : 'Update Name'}
              </button>
            </form>
          )}

          {/* Email Section */}
          {activeSection === 'email' && (
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Email</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {user.emailVerified ? (
                    <span className="text-green-600">✓ Current email verified</span>
                  ) : (
                    <span className="text-orange-600">⚠ Please verify your current email</span>
                  )}
                </p>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError('')
                  }}
                  className={`w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={emailLoading}
                />
                {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                {emailSuccess && (
                  <p className="mt-1 text-sm text-green-600">
                    Verification email sent! Please check your new email address.
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={emailLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {emailLoading ? 'Updating...' : 'Change Email'}
              </button>
            </form>
          )}

          {/* Password Section */}
          {activeSection === 'password' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="current-password"
                  value={passwords.current}
                  onChange={(e) => {
                    setPasswords({ ...passwords, current: e.target.value })
                    setPasswordError('')
                  }}
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={passwordLoading}
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={passwords.new}
                  onChange={(e) => {
                    setPasswords({ ...passwords, new: e.target.value })
                    setPasswordError('')
                  }}
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={passwordLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  8+ characters, mixed case, include a number
                </p>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={passwords.confirm}
                  onChange={(e) => {
                    setPasswords({ ...passwords, confirm: e.target.value })
                    setPasswordError('')
                  }}
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={passwordLoading}
                />
              </div>

              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
              {passwordSuccess && <p className="text-sm text-green-600">Password updated successfully!</p>}

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* Delete Account Section */}
          {activeSection === 'delete' && (
            <form onSubmit={handleAccountDeletion} className="space-y-4">
              <h3 className="text-lg font-medium text-red-900 mb-4">Delete Account</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 mb-2">
                  <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  <li>All your ideas and landing pages will be deleted</li>
                  <li>All collected signups will be deleted</li>
                  <li>Your account will be permanently removed</li>
                </ul>
              </div>

              <div>
                <label htmlFor="delete-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  type="text"
                  id="delete-confirm"
                  value={deleteConfirm}
                  onChange={(e) => {
                    setDeleteConfirm(e.target.value)
                    setDeleteError('')
                  }}
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={deleteLoading}
                  placeholder="DELETE"
                />
                {deleteError && <p className="mt-1 text-sm text-red-600">{deleteError}</p>}
              </div>

              <button
                type="submit"
                disabled={deleteLoading || deleteConfirm !== 'DELETE'}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {deleteLoading ? 'Deleting...' : 'Delete My Account'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="text-center">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}
