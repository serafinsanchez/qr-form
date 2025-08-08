"use client"

import { useMemo, useState } from 'react'
import { FormSubmission } from '@/lib/types'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'

type SortKey = 'timestamp' | 'emailAddress' | 'npsScore' | 'purchaseLocation' | 'skinConcern' | 'joinedLoyalty'
type SortDir = 'asc' | 'desc'

interface SubmissionsTableProps {
  submissions: FormSubmission[]
}

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  const as = String(a ?? '')
  const bs = String(b ?? '')
  return as.localeCompare(bs)
}

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = useMemo(() => {
    const arr = [...submissions]
    arr.sort((a, b) => {
      let av: unknown
      let bv: unknown
      switch (sortKey) {
        case 'timestamp':
          av = new Date(a.timestamp).getTime() || 0
          bv = new Date(b.timestamp).getTime() || 0
          break
        case 'emailAddress':
          av = a.emailAddress
          bv = b.emailAddress
          break
        case 'npsScore':
          av = a.npsScore
          bv = b.npsScore
          break
        case 'purchaseLocation':
          av = a.purchaseLocation
          bv = b.purchaseLocation
          break
        case 'skinConcern':
          av = a.skinConcern
          bv = b.skinConcern
          break
        case 'joinedLoyalty':
          av = a.joinedLoyalty
          bv = b.joinedLoyalty
          break
        default:
          av = 0
          bv = 0
      }
      const cmp = compareValues(av, bv)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [submissions, sortDir, sortKey])

  const headerCell = (key: SortKey, label: string) => {
    const active = sortKey === key
    const nextDir: SortDir = active && sortDir === 'asc' ? 'desc' : 'asc'
    return (
      <th
        key={key}
        scope="col"
        className="px-3 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap cursor-pointer select-none"
        onClick={() => {
          if (active) setSortDir(nextDir)
          else {
            setSortKey(key)
            setSortDir('asc')
          }
        }}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          {active ? (
            sortDir === 'asc' ? (
              <ArrowUpNarrowWide className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ArrowDownWideNarrow className="w-3.5 h-3.5 text-gray-500" />
            )
          ) : null}
        </span>
      </th>
    )
  }

  return (
    <div className="w-full">
      {/* Mobile controls */}
      <div className="sm:hidden mb-3 flex items-center gap-2">
        <label className="text-xs text-gray-600">Sort by</label>
        <select
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="timestamp">Date</option>
          <option value="emailAddress">Email</option>
          <option value="npsScore">NPS</option>
          <option value="purchaseLocation">Location</option>
          <option value="skinConcern">Concern</option>
          <option value="joinedLoyalty">Loyalty</option>
        </select>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-gray-700 border border-gray-300 rounded-md px-2 py-1"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
        >
          {sortDir === 'asc' ? (
            <ArrowUpNarrowWide className="w-4 h-4" />
          ) : (
            <ArrowDownWideNarrow className="w-4 h-4" />
          )}
          <span>{sortDir === 'asc' ? 'Asc' : 'Desc'}</span>
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-[900px] w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headerCell('timestamp', 'Date')}
              {headerCell('emailAddress', 'Email')}
              {headerCell('npsScore', 'NPS')}
              {headerCell('purchaseLocation', 'Location')}
              {headerCell('skinConcern', 'Concern')}
              {headerCell('joinedLoyalty', 'Loyalty')}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((s, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                  {new Date(s.timestamp).toLocaleString() || s.timestamp}
                </td>
                <td className="px-3 py-2 text-sm text-gray-700 max-w-[280px] truncate">{s.emailAddress || '—'}</td>
                <td className="px-3 py-2 text-sm">
                  <span
                    className={
                      'text-xs px-2 py-1 rounded-md ' +
                      (s.npsScore <= 6
                        ? 'bg-red-100 text-red-700'
                        : s.npsScore <= 8
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-700')
                    }
                  >
                    {s.npsScore}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">{s.purchaseLocation || '—'}</td>
                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">{s.skinConcern || '—'}</td>
                <td className="px-3 py-2 text-sm">
                  <span
                    className={
                      'text-xs px-2 py-1 rounded-md ' +
                      (s.joinedLoyalty ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700')
                    }
                  >
                    {s.joinedLoyalty ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="sm:hidden space-y-2">
        {sorted.map((s, idx) => (
          <div key={idx} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-gray-500 truncate">
                  {new Date(s.timestamp).toLocaleString() || s.timestamp}
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">{s.emailAddress || '—'}</div>
              </div>
              <span
                className={
                  'text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap ' +
                  (s.npsScore <= 6
                    ? 'bg-red-100 text-red-700'
                    : s.npsScore <= 8
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-700')
                }
              >
                NPS {s.npsScore}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span className="px-2 py-0.5 rounded bg-gray-100">{s.purchaseLocation || '—'}</span>
              <span className="px-2 py-0.5 rounded bg-gray-100">{s.skinConcern || '—'}</span>
              <span className={`px-2 py-0.5 rounded ${s.joinedLoyalty ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                Loyalty {s.joinedLoyalty ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


