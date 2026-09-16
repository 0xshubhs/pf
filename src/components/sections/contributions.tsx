'use client'

import { useEffect, useState } from 'react'
import CONTRIBUTIONS from '@/data/contributions'
import type { OssSummary } from '@/lib/github'

type PrStatus = 'merged' | 'open' | 'closed'

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
  // Every merged PR against a repo I don't own, grouped by repo.
  const [oss, setOss] = useState<OssSummary | null>(null)
  // The full log is long, so it starts collapsed to the busiest repos.
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch('/api/pr-statuses')
      .then((res) => (res.ok ? res.json() : {}))
      .then(setLiveStatuses)
      .catch(() => {})
    fetch('/api/merged-prs')
      .then((res) => (res.ok ? res.json() : null))
      .then(setOss)
      .catch(() => {})
  }, [])

  const groups = oss?.groups ?? []
  const visible = showAll ? groups : groups.slice(0, 6)

  return (
    <div className="space-y-12">
      {/* ---- Live totals ---- */}
      {oss && oss.externalMerged > 0 && (
        <div className="b-grid grid-cols-2 md:grid-cols-3">
          <div className="px-4 py-5">
            <p className="text-2xl font-bold leading-none md:text-3xl">{oss.externalMerged}</p>
            <p className="b-label mt-2">merged into others&apos; projects</p>
          </div>
          <div className="px-4 py-5">
            <p className="text-2xl font-bold leading-none md:text-3xl">{oss.repoCount}</p>
            <p className="b-label mt-2">repositories</p>
          </div>
          <div className="col-span-2 px-4 py-5 md:col-span-1">
            <p className="text-2xl font-bold leading-none md:text-3xl">{oss.totalMerged}</p>
            <p className="b-label mt-2">merged prs, everywhere</p>
          </div>
        </div>
      )}

      {/* ---- Curated highlights ---- */}
      {CONTRIBUTIONS.map((c) => (
        <div key={c.project}>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
            <h3 className="text-base font-bold">{c.project}</h3>
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

      {/* ---- The complete log, grouped by repo ---- */}
      {groups.length > 0 && (
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
            <h3 className="text-base font-bold">Every merged PR</h3>
            <span className="b-label">live from github</span>
          </div>

          <div className="mt-4 space-y-6">
            {visible.map((g) => (
              <div key={g.repo}>
                <div className="flex items-baseline justify-between gap-3 border-b border-rule-soft pb-1">
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="b-link truncate text-sm font-bold"
                  >
                    {g.repo}
                  </a>
                  <span className="b-label shrink-0">
                    {g.count} {g.count === 1 ? 'pr' : 'prs'}
                  </span>
                </div>

                <ul>
                  {g.prs.map((pr) => (
                    <li key={pr.url}>
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="b-box-link flex items-baseline justify-between gap-3 border-0 px-1 py-1.5 text-sm"
                      >
                        <span className="min-w-0 truncate">{pr.title}</span>
                        <span className="b-faint shrink-0 text-[12px]">{pr.mergedAt}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {groups.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="b-btn mt-6"
              aria-expanded={showAll}
            >
              {showAll
                ? 'Show fewer'
                : `Show all ${groups.length} repositories`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Contributions
