'use client'

import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to LingoLeap</h2>
          {user && <p className="mt-2 text-center text-sm text-gray-600">Logged in as: {user.email}</p>}
        </div>
      </div>
    </div>
  )
}