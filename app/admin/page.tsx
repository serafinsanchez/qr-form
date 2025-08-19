import { fetchSubmissions } from '@/lib/instantdb-server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AdminSubmissionsClient from '@/components/AdminSubmissionsClient'

export const dynamic = 'force-dynamic'

function npsBadgeClasses(score: number | null): string {
  if (score === null) return 'bg-gray-100 text-gray-700'
  if (score <= 6) return 'bg-red-100 text-red-700'
  if (score <= 8) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-700'
}

export default async function AdminGalleryPage() {
  const submissions = await fetchSubmissions(200)

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/facewashing.png)' }}
      />
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-cream-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-serif font-semibold text-primary-600">EF</span>
            </div>
            <span className="text-sm font-medium text-gray-600">Elysian Fields</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div className="text-sm text-gray-500">Total: {submissions.length}</div>
          </div>
          <AdminSubmissionsClient submissions={submissions} />
        </div>
      </main>
    </div>
  )
}




