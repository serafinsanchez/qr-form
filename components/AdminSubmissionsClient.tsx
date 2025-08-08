"use client"

import { useMemo, useState } from 'react'
import SubmissionsTable from './SubmissionsTable'
import { FormSubmission } from '@/lib/types'
import { getViewUrlForGcs } from '@/lib/gcs-url'

type ViewMode = 'grid' | 'list'

interface AdminSubmissionsClientProps {
  submissions: FormSubmission[]
}

export default function AdminSubmissionsClient({ submissions }: AdminSubmissionsClientProps) {
  const [view, setView] = useState<ViewMode>('grid')

  const content = useMemo(() => {
    if (view === 'list') {
      return <SubmissionsTable submissions={submissions} />
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {submissions.map((s, idx) => {
          const beforeUrl = s.beforeUrl ? getViewUrlForGcs(s.beforeUrl) : null
          const afterUrl = s.afterUrl ? getViewUrlForGcs(s.afterUrl) : null
          const nps = Number.isFinite(s.npsScore) ? s.npsScore : null

        return (
          <section key={idx} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500">{new Date(s.timestamp).toLocaleString() || s.timestamp}</div>
                <div className="text-base font-medium text-gray-900 truncate">{s.emailAddress || 'No email provided'}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-md ${nps === null ? 'bg-gray-100 text-gray-700' : nps <= 6 ? 'bg-red-100 text-red-700' : nps <= 8 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'}`}>NPS: {s.npsScore}</span>
                <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700">{s.purchaseLocation || 'Unknown location'}</span>
                <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700">{s.skinConcern || 'No concern'}</span>
                <span className={`text-xs px-2 py-1 rounded-md ${s.joinedLoyalty ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{s.joinedLoyalty ? 'Loyalty: Yes' : 'Loyalty: No'}</span>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-2">Before</div>
                {beforeUrl ? (
                  <a href={beforeUrl} target="_blank" rel="noreferrer" className="block">
                    <img src={beforeUrl} alt="Before" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                  </a>
                ) : (
                  <div className="w-full h-48 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">After</div>
                {afterUrl ? (
                  <a href={afterUrl} target="_blank" rel="noreferrer" className="block">
                    <img src={afterUrl} alt="After" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                  </a>
                ) : (
                  <div className="w-full h-48 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="text-xs text-gray-500 mb-1">Feedback</div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-md p-3 border border-gray-100">
                {s.feedbackDetail || '—'}
              </div>
            </div>
          </section>
        )
        })}
      </div>
    )
  }, [submissions, view])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-serif font-medium text-gray-900">Submissions</h1>
          <p className="text-sm text-gray-600">Latest entries with details and photos.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`text-sm px-3 py-1.5 rounded-md border ${view === 'grid' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`text-sm px-3 py-1.5 rounded-md border ${view === 'list' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            List
          </button>
        </div>
      </div>

      {content}
    </div>
  )
}


