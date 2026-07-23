import { NextRequest, NextResponse } from 'next/server'

// Server-side proxy for the projects page. The GitHub token (if configured)
// stays in server env — never shipped to the browser — and responses are
// cached for an hour so visitors don't burn rate limit.
export interface RepoData {
  name: string
  description: string
  repoUrl: string
  liveLink: string
  topics: string[]
  lastUpdated: string | null
  stars: number
  isFeatured: boolean
  language: string | null
}

const PER_PAGE = 10
const GH_HEADERS: Record<string, string> = { Accept: 'application/vnd.github+json' }
if (process.env.GITHUB_TOKEN) {
  GH_HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
}

export async function GET(request: NextRequest) {
  const page = Math.max(1, Number(request.nextUrl.searchParams.get('page')) || 1)

  // /user/repos (owner affiliation) needs auth; fall back to the public
  // listing when no token is configured.
  const url = process.env.GITHUB_TOKEN
    ? `https://api.github.com/user/repos?affiliation=owner&sort=updated&direction=desc&per_page=${PER_PAGE}&page=${page}`
    : `https://api.github.com/users/0xshubhs/repos?type=owner&sort=updated&direction=desc&per_page=${PER_PAGE}&page=${page}`

  try {
    const res = await fetch(url, { headers: GH_HEADERS, next: { revalidate: 3600 } })
    if (!res.ok) {
      return NextResponse.json({ repos: [], hasMore: false }, { status: 200 })
    }

    const raw = (await res.json()) as any[]
    const repos: RepoData[] = raw
      .filter((repo) => !repo.topics?.includes('ignore'))
      .map((repo) => ({
        name: repo.name,
        description: repo.description || '',
        repoUrl: repo.html_url,
        liveLink: repo.homepage || repo.html_url,
        topics: repo.topics || [],
        lastUpdated: repo.pushed_at,
        stars: repo.stargazers_count,
        isFeatured: repo.topics?.includes('featured') || false,
        language: repo.language,
      }))

    return NextResponse.json({ repos, hasMore: raw.length === PER_PAGE })
  } catch {
    return NextResponse.json({ repos: [], hasMore: false }, { status: 200 })
  }
}
