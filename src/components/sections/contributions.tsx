'use client'

import { useEffect, useState } from 'react'
import CONTRIBUTIONS from '@/data/contributions'

type PrStatus = 'merged' | 'open' | 'closed'

interface MergedPr {
  title: string
  url: string
  repo: string
  mergedAt: string
}

// Status is live data, so it earns colour. Everything else stays monochrome.
const STATUS_CLASS: Record<PrStatus, string> = {
  merged: 'text-ok',
  open: 'text-info',
  closed: 'b-faint',
}

const Status = ({ status }: { status: PrStatus }) => (
  <span className={`shrink-0 text-[12px] ${STATUS_CLASS[status]}`}>[{status}]</span>
)

const Contributions = () => {
  // Live statuses from /api/pr-statuses (cached server-side, revalidated hourly).
  // Until it loads — or if it fails — the static status from data/contributions.ts is shown.
  const [liveStatuses, setLiveStatuses] = useState<Record<string, PrStatus>>({})
  // Auto-discovered merged PRs from any public org (not in the curated list above).
  const [mergedFeed, setMergedFeed] = useState<MergedPr[]>([])

  useEffect(() => {
    fetch('/api/pr-statuses')
      .then((res) => (res.ok ? res.json() : {}))
      .then(setLiveStatuses)
      .catch(() => {})
    fetch('/api/merged-prs')
      .then((res) => (res.ok ? res.json() : []))
      .then(setMergedFeed)
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-10">
      {CONTRIBUTIONS.map((c) => (
        <div key={c.project}>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
            <h3 className="text-lg font-bold">{c.project}</h3>
            <span className="b-label">{c.org}</span>
          </div>

          <p className="b-dim mt-3 text-base leading-relaxed">{c.blurb}</p>

          <ul className="mt-4">
            {c.prs.map((pr) => (
              <li key={pr.url}>
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="b-box-link flex items-baseline justify-between gap-3 border-x-0 border-t-0 border-b border-rule-soft px-1 py-2 text-base"
                >
                  <span>{pr.title}</span>
                  <Status status={liveStatuses[pr.url] ?? pr.status} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {mergedFeed.length > 0 && (
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
            <h3 className="text-lg font-bold">Recently merged</h3>
            <span className="b-label">live from github</span>
          </div>

          <ul className="mt-4">
            {mergedFeed.map((pr) => (
              <li key={pr.url}>
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="b-box-link flex items-baseline justify-between gap-3 border-x-0 border-t-0 border-b border-rule-soft px-1 py-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-base">{pr.title}</span>
                    <span className="b-faint block text-[12px]">
                      {pr.repo} &middot; {pr.mergedAt}
                    </span>
                  </span>
                  <Status status="merged" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Contributions
