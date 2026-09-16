import { NextResponse } from 'next/server'
import { getOssSummary } from '@/lib/github'

// Full open-source contribution summary: live counts plus every merged PR
// against a repo I don't own, grouped by repository. Cached for an hour so
// visitors never hit GitHub's rate limit directly.
export const revalidate = 3600

export async function GET() {
  return NextResponse.json(await getOssSummary())
}
