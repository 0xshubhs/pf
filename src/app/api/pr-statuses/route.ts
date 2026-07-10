import { NextResponse } from 'next/server'
import CONTRIBUTIONS from '@/data/contributions'

// Cache the handler result and re-fetch from GitHub at most once an hour,
// so visitors never hit GitHub's unauthenticated rate limit directly.
export const revalidate = 3600

export type PrStatus = 'merged' | 'open' | 'closed'

export async function GET() {
  const urls = CONTRIBUTIONS.flatMap((c) => c.prs.map((pr) => pr.url))
  const statuses: Record<string, PrStatus> = {}

  await Promise.all(
    urls.map(async (url) => {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
      if (!match) return // non-PR links (e.g. search queries) keep their static status
      const [, owner, repo, number] = match
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}`, {
          headers: { Accept: 'application/vnd.github+json' },
          next: { revalidate: 3600 },
        })
        if (!res.ok) return
        const pr = await res.json()
        statuses[url] = pr.merged_at ? 'merged' : pr.state === 'closed' ? 'closed' : 'open'
      } catch {
        // network failure: leave it out, the client falls back to the static status
      }
    })
  )

  return NextResponse.json(statuses)
}
