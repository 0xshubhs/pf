import CONTRIBUTIONS from '@/data/contributions'

// Shared GitHub fetching for the open-source sections. Kept out of the route
// handler so server components (the home stat line, the about page) can call it
// directly instead of fetching our own API over HTTP.
//
// Everything is cached for an hour: unauthenticated search allows only 10
// requests/minute, and GITHUB_TOKEN — when configured — never leaves the server.

const HEADERS: Record<string, string> = { Accept: 'application/vnd.github+json' }
if (process.env.GITHUB_TOKEN) {
  HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
}

const HOURLY = { next: { revalidate: 3600 } } as const
const USER = '0xshubhs'

// Orgs I'm a member of with private membership, so the API can't tell us.
const EXCLUDED_OWNERS = new Set(
  ['GDSCltce', 'SizzlingDev-s', 'CodeXcelerate', 'OpenSource-Communities', 'NinjasDojo', '0xtoools'].map(
    (o) => o.toLowerCase()
  )
)

export interface MergedPr {
  title: string
  url: string
  repo: string
  mergedAt: string
}

export interface RepoGroup {
  repo: string
  url: string
  count: number
  prs: MergedPr[]
}

export interface OssSummary {
  /**
   * Merged PRs into other people's projects — the headline number, and exactly
   * the set listed on the page. GitHub's own "-user:0xshubhs" count is higher
   * (it still includes repos belonging to orgs I'm a member of), so quoting
   * that would claim more than the list can show.
   */
  externalMerged: number
  /** GitHub's raw count of merged PRs in repos not under my personal account. */
  notMyRepos: number
  /** Merged PRs anywhere, including my own repos. */
  totalMerged: number
  /** Distinct external repos contributed to. */
  repoCount: number
  /** Every external merged PR, newest first. */
  prs: MergedPr[]
  /** The same PRs grouped by repo, busiest first. */
  groups: RepoGroup[]
}

const EMPTY: OssSummary = {
  externalMerged: 0,
  notMyRepos: 0,
  totalMerged: 0,
  repoCount: 0,
  prs: [],
  groups: [],
}

const search = (q: string, page = 1) =>
  fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100&page=${page}` +
      '&sort=updated&order=desc',
    { headers: HEADERS, ...HOURLY }
  )

/**
 * Every merged pull request against a repo I don't own, plus the headline
 * counts. Returns zeroed data rather than throwing, so a GitHub outage or a
 * rate limit degrades the section instead of breaking the page.
 */
export async function getOssSummary(): Promise<OssSummary> {
  try {
    const [firstRes, allRes, orgsRes] = await Promise.all([
      search(`is:pr author:${USER} is:merged -user:${USER}`),
      search(`is:pr author:${USER} is:merged`),
      fetch(`https://api.github.com/users/${USER}/orgs`, { headers: HEADERS, ...HOURLY }),
    ])
    if (!firstRes.ok) return EMPTY

    const first = await firstRes.json()
    const notMyRepos: number = first.total_count ?? 0
    const totalMerged: number = allRes.ok ? ((await allRes.json()).total_count ?? 0) : notMyRepos

    // Search caps at 100 per page; pull the rest (GitHub allows 1000 results).
    const pages = Math.min(Math.ceil(notMyRepos / 100), 10)
    const rest = await Promise.all(
      Array.from({ length: Math.max(pages - 1, 0) }, (_, i) =>
        search(`is:pr author:${USER} is:merged -user:${USER}`, i + 2)
          .then((r) => (r.ok ? r.json() : { items: [] }))
          .catch(() => ({ items: [] }))
      )
    )

    const myOrgs = new Set<string>(
      orgsRes.ok ? (await orgsRes.json()).map((o: { login: string }) => o.login.toLowerCase()) : []
    )

    const items = [first, ...rest].flatMap((p) => p.items ?? [])
    const prs: MergedPr[] = items
      .filter((item: any) => {
        if (!item.pull_request?.merged_at) return false
        const owner = item.repository_url.split('/repos/')[1].split('/')[0].toLowerCase()
        return !myOrgs.has(owner) && !EXCLUDED_OWNERS.has(owner)
      })
      .map((item: any) => ({
        title: item.title,
        url: item.html_url,
        repo: item.repository_url.replace('https://api.github.com/repos/', ''),
        mergedAt: item.pull_request.merged_at.slice(0, 10),
      }))
      .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))

    const byRepo = new Map<string, MergedPr[]>()
    for (const pr of prs) {
      const list = byRepo.get(pr.repo)
      if (list) list.push(pr)
      else byRepo.set(pr.repo, [pr])
    }

    const groups: RepoGroup[] = [...byRepo.entries()]
      .map(([repo, list]) => ({
        repo,
        url: `https://github.com/${repo}`,
        count: list.length,
        prs: list,
      }))
      // Busiest repo first, then most recent, so the biggest work leads.
      .sort((a, b) => b.count - a.count || b.prs[0].mergedAt.localeCompare(a.prs[0].mergedAt))

    // The headline is the size of the list itself, so the number and the
    // evidence below it can never disagree.
    return {
      externalMerged: prs.length,
      notMyRepos,
      totalMerged,
      repoCount: groups.length,
      prs,
      groups,
    }
  } catch {
    return EMPTY
  }
}

/** URLs already featured in the hand-written contributions list. */
export const curatedUrls = () =>
  new Set(CONTRIBUTIONS.flatMap((c) => c.prs.map((pr) => pr.url)))
