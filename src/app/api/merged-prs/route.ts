import { NextResponse } from 'next/server'
import CONTRIBUTIONS from '@/data/contributions'

// Auto-discovered merged PRs across any public org, refreshed at most once an hour.
// PRs already featured in the curated contributions list are filtered out.
export const revalidate = 3600

export interface MergedPr {
  title: string
  url: string
  repo: string
  mergedAt: string
}

const SEARCH_URL =
  'https://api.github.com/search/issues?q=' +
  encodeURIComponent('is:pr author:0xshubhs is:merged -user:0xshubhs') +
  '&per_page=100&sort=updated&order=desc'

export async function GET() {
  const curated = new Set(CONTRIBUTIONS.flatMap((c) => c.prs.map((pr) => pr.url)))

  try {
    const res = await fetch(SEARCH_URL, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()

    const prs: MergedPr[] = (data.items ?? [])
      .filter((item: any) => item.pull_request?.merged_at && !curated.has(item.html_url))
      .map((item: any) => ({
        title: item.title,
        url: item.html_url,
        repo: item.repository_url.replace('https://api.github.com/repos/', ''),
        mergedAt: item.pull_request.merged_at.slice(0, 10),
      }))
      .sort((a: MergedPr, b: MergedPr) => b.mergedAt.localeCompare(a.mergedAt))
      .slice(0, 12)

    return NextResponse.json(prs)
  } catch {
    return NextResponse.json([])
  }
}
