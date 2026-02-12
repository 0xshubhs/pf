'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Octokit } from '@octokit/core'
import { motion } from 'framer-motion'

const BATCH_SIZE = 10

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
})

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

// Section heading component (reused from About page)
const SectionHeading = ({ title }: { title: string }) => (
  <motion.h2
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="text-2xl md:text-3xl font-bold mb-6 relative inline-block"
  >
    <span>{title}</span>
    <motion.span
      initial={{ width: 0 }}
      whileInView={{ width: "100%" }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
      className="absolute bottom-0 left-0 h-[3px] bg-orange-400"
    />
  </motion.h2>
);

// Project card component
const ProjectCard = ({ project, index }: { project: ProjectData; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % BATCH_SIZE) * 0.05 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`h-full rounded-base border-2 border-border bg-main p-4 shadow-light dark:border-darkBorder dark:shadow-dark sm:p-5 ${
        project.isFeatured ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-white dark:ring-offset-secondaryBlack' : ''
      }`}
    >
      <div className="flex h-full flex-col font-base text-text">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-heading sm:text-2xl">
            {project.name}
          </h2>
          {project.stars > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {project.stars}
            </div>
          )}
        </div>

        <p className="mb-2 mt-2 flex-grow">{project.description}</p>

        {project.language && (
          <div className="mb-4 flex flex-wrap gap-2 dark:text-white">
            <span
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full font-medium"
            >
              {project.language}
            </span>
          </div>
        )}

        <div className="mt-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Last updated: {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : 'Unknown date'}
          </p>

          <div className="grid grid-cols-2 gap-5">
            <motion.a
              whileHover={{
                translateX: 3,
                translateY: -3,
                boxShadow: "0px 0px 0px rgba(0,0,0,0)"
              }}
              className="cursor-pointer rounded-base border-2 border-border bg-white px-4 py-2 text-center text-sm font-base shadow-light transition-all dark:border-darkBorder dark:bg-secondaryBlack dark:text-darkText dark:shadow-dark sm:text-base"
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
            </motion.a>
            <motion.a
              whileHover={{
                translateX: 3,
                translateY: -3,
                boxShadow: "0px 0px 0px rgba(0,0,0,0)"
              }}
              className="cursor-pointer rounded-base border-2 border-border bg-white px-4 py-2 text-center text-sm font-base shadow-light transition-all dark:border-darkBorder dark:bg-secondaryBlack dark:text-darkText dark:shadow-dark sm:text-base"
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  const mapRepo = (repo: any): ProjectData => ({
    name: repo.name,
    description: repo.description || '',
    repoUrl: repo.html_url,
    liveLink: repo.homepage || repo.html_url,
    topics: repo.topics || [],
    lastUpdated: repo.pushed_at,
    stars: repo.stargazers_count,
    isFeatured: repo.topics?.includes('featured') || false,
    language: repo.language,
  })

  // Fetch a single page of repos
  const fetchPage = useCallback(async (pageNum: number) => {
    const { data: repos } = await octokit.request('GET /user/repos', {
      per_page: BATCH_SIZE,
      page: pageNum,
      affiliation: 'owner',
      sort: 'updated',
      direction: 'desc',
    })

    const batch = repos
      .filter((repo: any) => !repo.topics?.includes('ignore'))
      .map(mapRepo)

    // If we got fewer than BATCH_SIZE, there are no more pages
    if (repos.length < BATCH_SIZE) {
      setHasMore(false)
    }

    return batch
  }, [])

  // Initial load — first batch
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const batch = await fetchPage(1)
        setProjects(batch)

        // Collect languages from first batch
        const langs = new Set<string>()
        batch.forEach((p: ProjectData) => { if (p.language) langs.add(p.language) })
        setAvailableTopics(Array.from(langs))
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

  // Fetch next page when page number changes
  useEffect(() => {
    if (page === 1) return // already loaded in init

    const loadMore = async () => {
      try {
        setIsLoadingMore(true)
        const batch = await fetchPage(page)
        setProjects((prev) => [...prev, ...batch])

        // Merge new languages into available topics
        const newLangs = new Set<string>()
        batch.forEach((p: ProjectData) => { if (p.language) newLangs.add(p.language) })
        setAvailableTopics((prev) => {
          const merged = new Set(prev)
          newLangs.forEach((l) => merged.add(l))
          return Array.from(merged)
        })
      } catch (err) {
        console.error('Failed to load more projects:', err)
      } finally {
        setIsLoadingMore(false)
      }
    }
    loadMore()
  }, [page, fetchPage])

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Filter projects client-side from what we've loaded so far
  const filteredProjects = activeFilter === 'all'
    ? projects
    : activeFilter === 'featured'
      ? projects.filter(p => p.isFeatured)
      : projects.filter(p => p.language === activeFilter)

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl px-6 pt-28 pb-10"
      >
        <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-10 min-h-[400px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
          <p className="text-gray-600 dark:text-gray-400">
            Fetching projects from GitHub...
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 p-5"
            >
              <div className="mb-4 h-7 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-2 h-4 w-full rounded-lg bg-gray-100 dark:bg-gray-800"></div>
              <div className="mb-8 h-4 w-5/6 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
              <div className="grid grid-cols-2 gap-5">
                <div className="h-9 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-9 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Separate featured projects
  const featuredProjects = filteredProjects.filter(project => project.isFeatured)
  const regularProjects = filteredProjects.filter(project => !project.isFeatured)

  return (
    <div className="mx-auto max-w-4xl px-6 pt-28 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="mb-4 text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 dark:from-white dark:to-orange-400 bg-clip-text text-transparent pb-2">
          Projects
        </h1>
        <div className="h-1 w-20 bg-orange-500 rounded-full mt-2 mb-8" />

        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
          things i&apos;ve built — some still standing.
        </p>

        {/* Filter buttons */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All Projects
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === 'featured'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveFilter('featured')}
          >
            Featured
          </button>
          {availableTopics.slice(0, 6).map(language => (
            <button
              key={language}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === language
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveFilter(language)}
            >
              {language}
            </button>
          ))}
          {availableTopics.length > 6 && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                More Languages...
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-base z-10">
                  {availableTopics.slice(6).map(language => (
                    <button
                      key={language}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        setActiveFilter(language);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Featured Projects Section (if any) */}
        {featuredProjects.length > 0 && activeFilter !== 'featured' && (
          <div className="mb-12">
            <SectionHeading title="Featured Projects" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Main Projects Grid */}
        <div className="mb-8">
          {activeFilter !== 'featured' && regularProjects.length > 0 && (
            <SectionHeading title={featuredProjects.length > 0 ? "More Projects" : "All Projects"} />
          )}

          {filteredProjects.length === 0 && !hasMore ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              No projects match the selected filter. Try a different category.
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {(activeFilter === 'featured' ? featuredProjects : regularProjects).map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} className="py-4">
          {isLoadingMore && (
            <div className="flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
            </div>
          )}
          {!hasMore && projects.length > 0 && (
            <p className="text-center text-sm text-gray-400">that&apos;s all of them.</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
