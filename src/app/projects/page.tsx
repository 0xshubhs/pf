'use client'
import { useEffect, useState, useRef } from 'react'
import { Octokit } from '@octokit/core'
import { motion } from 'framer-motion'

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
})

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  topics?: string[]
  pushed_at: string
  stargazers_count: number
  language: string | null
}

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
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)

        const { data: repos } = await octokit.request('GET /user/repos', {
          per_page: 400,
          affiliation: 'owner',
          sort: 'updated',
          direction: 'desc',
        })

        const projectsList = repos
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
          }));

        const allLanguages = new Set<string>();
        projectsList.forEach(project => {
          if (project.language) {
            allLanguages.add(project.language);
          }
        });

        setAvailableTopics(Array.from(allLanguages));
        setProjects(projectsList);
        setFilteredProjects(projectsList);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch projects',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

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
  
  
    // Filter projects when active filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects)
    } else if (activeFilter === 'featured') {
      setFilteredProjects(projects.filter(project => project.isFeatured))
    } else {
      setFilteredProjects(
        projects.filter(project => project.language === activeFilter)
      )
    }
  }, [activeFilter, projects]);;

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
    <div ref={projectsRef} className="mx-auto max-w-4xl px-6 pt-28 pb-10">
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
          
          {filteredProjects.length === 0 ? (
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
      </motion.div>
    </div>
  )
}