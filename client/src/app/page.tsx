import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to LingoLeap</h2>
          <div className="mt-6 text-center">
            <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}