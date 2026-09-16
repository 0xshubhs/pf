'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { PageHeader } from '@/components/page-header'

interface ProjectData {
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

const ProjectCard = ({ project, n }: { project: ProjectData; n: string }) => {
  // The API falls back to the repo URL when a repo has no homepage set, so
  // only offer "visit" when it actually points somewhere else.
  const hasLive = Boolean(project.liveLink) && project.liveLink !== project.repoUrl
  const topics = project.topics.filter((t) => t !== 'featured').slice(0, 3)

  return (
    <article
      className={clsx(
        'flex flex-col p-5',
        project.isFeatured ? 'b-invert sm:col-span-2' : 'hover:bg-surface'
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="b-faint text-sm">{n}</span>
        {project.isFeatured && <span className="b-label">featured</span>}
      </div>

      <h3 className="mt-3 break-words text-lg font-bold md:text-xl">{project.name}</h3>

      {/* Fixed-height body keeps every cell in the row aligned even though
          most repos on GitHub have no description at all. */}
      <div className="mt-2 min-h-[3.25rem] flex-1">
        {project.description ? (
          <p className="b-dim line-clamp-3 text-sm leading-relaxed">{project.description}</p>
        ) : topics.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <span key={t} className="b-tag">
                {t}
              </span>
            ))}
          </div>
        ) : (
          <p className="b-faint text-sm">no description</p>
        )}
      </div>

      <div className="b-label mt-4 flex items-baseline justify-between gap-2">
        <span>{project.language ?? '—'}</span>
        <span>
          {project.stars > 0 && `${project.stars}★ · `}
          {project.lastUpdated ? project.lastUpdated.slice(0, 10) : '—'}
        </span>
      </div>

      <div
        className={clsx(
          'mt-3 flex gap-4 border-t pt-3 text-sm',
          project.isFeatured ? 'border-paper/30' : 'border-rule-soft'
        )}
      >
        {hasLive && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="b-link"
          >
            visit &rarr;
          </a>
        )}
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="b-link"
        >
          source &rarr;
        </a>
      </div>
    </article>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [languages, setLanguages] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Fetch a single page of repos via our server-side proxy (token never
  // reaches the browser; responses are cached server-side for an hour)
  const fetchPage = useCallback(async (pageNum: number) => {
    const res = await fetch(`/api/repos?page=${pageNum}`)
    if (!res.ok) throw new Error('Failed to fetch projects')
    const { repos, hasMore: more } = (await res.json()) as {
      repos: ProjectData[]
      hasMore: boolean
    }
    if (!more) setHasMore(false)
    return repos
  }, [])

  const mergeLanguages = (batch: ProjectData[]) => {
    setLanguages((prev) => {
      const merged = new Set(prev)
      batch.forEach((p) => p.language && merged.add(p.language))
      return Array.from(merged)
    })
  }

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const batch = await fetchPage(1)
        setProjects(batch)
        mergeLanguages(batch)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [fetchPage])

  // Load more when scrolled to bottom (IntersectionObserver on sentinel)
  useEffect(() => {
    if (!loaderRef.current || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setPage((prev) => prev + 1)
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, isLoading, isLoadingMore])

  useEffect(() => {
    if (page === 1) return // already loaded in init

    const loadMore = async () => {
      try {
        setIsLoadingMore(true)
        const batch = await fetchPage(page)
        setProjects((prev) => [...prev, ...batch])
        mergeLanguages(batch)
      } catch (err) {
        console.error('Failed to load more projects:', err)
      } finally {
        setIsLoadingMore(false)
      }
    }
    loadMore()
  }, [page, fetchPage])

  const filtered =
    activeFilter === 'all'
      ? projects
      : activeFilter === 'featured'
        ? projects.filter((p) => p.isFeatured)
        : projects.filter((p) => p.language === activeFilter)

  // Only offer "featured" once something actually carries the topic, otherwise
  // it's a filter that can only ever return nothing.
  const hasFeatured = projects.some((p) => p.isFeatured)
  const filters = [
    'all',
    ...(hasFeatured ? ['featured'] : []),
    ...languages.slice(0, 8),
  ]

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <PageHeader label="04 / projects" title="Projects">
        Things I&apos;ve built — some still standing. Pulled live from GitHub.
      </PageHeader>

      {error ? (
        <p className="border border-rule px-4 py-3 text-base text-accent">{error}</p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={clsx(
                  'text-sm',
                  activeFilter === f ? 'text-accent' : 'b-dim hover:text-ink'
                )}
              >
                {activeFilter === f ? `[${f}]` : f}
              </button>
            ))}
            <span className="b-label ml-auto">
              {filtered.length} {filtered.length === 1 ? 'repo' : 'repos'}
            </span>
          </div>

          {isLoading ? (
            <div className="b-grid sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="b-hatch h-56" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="b-dim text-base">No projects match this filter.</p>
          ) : (
            <div className="b-grid sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.name}
                  project={project}
                  n={String(i).padStart(2, '0')}
                />
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={loaderRef} className="py-6">
            {isLoadingMore && <p className="b-dim text-sm">Loading more&hellip;</p>}
            {!hasMore && projects.length > 0 && (
              <p className="b-faint text-sm">That&apos;s all of them.</p>
            )}
          </div>
        </>
      )}
    </main>
  )
}
