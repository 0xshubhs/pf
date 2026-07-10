import { NextResponse } from 'next/server'
import CONTRIBUTIONS from '@/data/contributions'

// Auto-discovered merged PRs across public orgs, refreshed at most once an hour.
// Filtered to genuine external open source:
//  - repos owned by personal accounts (friends' projects) are dropped
//  - orgs I'm a public member of are dropped (fetched live)
//  - orgs I'm part of with private membership can't be detected via the API, so
//    they're listed in EXCLUDED_OWNERS manually
//  - PRs already featured in the curated contributions list are dropped
export const revalidate = 3600

export interface MergedPr {
  title: string
  url: string
  repo: string
  mergedAt: string
}

const GH = { Accept: 'application/vnd.github+json' }
const NEXT_HOURLY = { next: { revalidate: 3600 } }

const EXCLUDED_OWNERS = new Set(
  ['GDSCltce', 'SizzlingDev-s', 'CodeXcelerate', 'OpenSource-Communities', 'NinjasDojo', '0xtoools'].map((o) =>
    o.toLowerCase()
  )
)

const SEARCH_URL =
  'https://api.github.com/search/issues?q=' +
  encodeURIComponent('is:pr author:0xshubhs is:merged -user:0xshubhs') +
  '&per_page=100&sort=updated&order=desc'

export async function GET() {
  const curated = new Set(CONTRIBUTIONS.flatMap((c) => c.prs.map((pr) => pr.url)))

  try {
    const [searchRes, orgsRes] = await Promise.all([
      fetch(SEARCH_URL, { headers: GH, ...NEXT_HOURLY }),
      fetch('https://api.github.com/users/0xshubhs/orgs', { headers: GH, ...NEXT_HOURLY }),
    ])
    if (!searchRes.ok) return NextResponse.json([])

    const myOrgs = new Set<string>(
      orgsRes.ok ? (await orgsRes.json()).map((o: any) => o.login.toLowerCase()) : []
    )

    const items = ((await searchRes.json()).items ?? []).filter(
      (item: any) => item.pull_request?.merged_at && !curated.has(item.html_url)
    )

    // Keep only repos owned by organizations (not personal accounts). Owner type
    // isn't in the search response, so look each unique owner up once.
    const owners = [...new Set<string>(items.map((i: any) => i.repository_url.split('/repos/')[1].split('/')[0]))]
    const ownerType = new Map<string, string>()
    await Promise.all(
      owners.map(async (owner) => {
        try {
          const res = await fetch(`https://api.github.com/users/${owner}`, { headers: GH, ...NEXT_HOURLY })
          if (res.ok) ownerType.set(owner.toLowerCase(), (await res.json()).type)
        } catch {
          // lookup failed: owner stays unknown and the repo is filtered out
        }
      })
    )

    const prs: MergedPr[] = items
      .filter((item: any) => {
        const owner = item.repository_url.split('/repos/')[1].split('/')[0].toLowerCase()
        return (
          ownerType.get(owner) === 'Organization' &&
          !myOrgs.has(owner) &&
          !EXCLUDED_OWNERS.has(owner)
        )
      })
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
