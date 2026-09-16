import clsx from 'clsx'
import HACKS from '@/data/hacks'
import { PageHeader } from '@/components/page-header'

// Some entries in hacks.ts omit the leading slash ("hackathons/x.png"), which
// only resolves correctly while the route has no trailing slash. Pin them to root.
const toSrc = (src: string) =>
  src.startsWith('http') || src.startsWith('/') ? src : `/${src}`

interface TeamMember {
  name: string
  link: string
}

interface Hack {
  name: string
  projectName: string
  description: string
  team: TeamMember[]
  prizes: string[] | null
  previewImage?: string
  dashboardImage?: string
  projectImage?: string
  liveLink?: string
  repoUrl?: string
}

const HackEntry = ({ hack, n }: { hack: Hack; n: string }) => {
  // No carousel, no autoplay, no arrows. Every shot is just on the page.
  const images = [hack.previewImage, hack.dashboardImage, hack.projectImage].filter(
    Boolean
  ) as string[]

  return (
    <article className="border-b border-rule py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-bold md:text-2xl">
          <span className="b-faint mr-3 text-sm">{n}</span>
          {hack.projectName}
        </h2>
        <p className="b-label">{hack.name}</p>
      </div>

      <p className="mt-3 max-w-2xl text-base leading-relaxed">{hack.description}</p>

      {hack.prizes && hack.prizes.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {hack.prizes.map((prize) => (
            // A win is a fact worth shouting — one of the few accent uses.
            <li key={prize} className="text-sm text-accent">
              {prize}
            </li>
          ))}
        </ul>
      )}

      {images.length > 0 && (
        // Column count follows the image count so a hack with one shot never
        // leaves empty tracks showing the grid's ink background as black cells.
        <div
          className={clsx(
            'b-grid mt-6',
            // A lone GitHub OG card at full column width swamps the entry.
            images.length === 1 && 'sm:max-w-xl',
            images.length === 2 && 'sm:grid-cols-2',
            images.length >= 3 && 'sm:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {images.map((src) => (
            // These range from 2:1 GitHub OG cards to square logos to wide
            // dashboard screenshots, so each sits contained in a fixed cell
            // rather than cropped to fill it.
            <div
              key={src}
              className="flex aspect-video items-center justify-center bg-surface p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={toSrc(src)}
                alt={`${hack.projectName} screenshot`}
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-[9rem_1fr]">
        <p className="b-label pt-1">team</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {hack.team.map((member) => (
            <a
              key={member.name}
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              className="b-link text-sm"
            >
              {member.name}
            </a>
          ))}
        </div>
      </div>

      {(hack.liveLink || hack.repoUrl) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {hack.liveLink && (
            <a href={hack.liveLink} target="_blank" rel="noopener noreferrer" className="b-btn">
              View project
            </a>
          )}
          {hack.repoUrl && (
            <a href={hack.repoUrl} target="_blank" rel="noopener noreferrer" className="b-btn">
              Source
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export default function Hacks() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <PageHeader label="03 / hackathons" title="Hackathons">
        48 hours, one idea, no sleep — that&apos;s where the best stuff gets built.
        Six paid wins and counting.
      </PageHeader>

      <div>
        {HACKS.map((hack, i) => (
          // Two entries share a hackathon name (SoSoValue Buildathon), so the
          // project name has to be part of the key.
          <HackEntry
            key={`${hack.name}-${hack.projectName}`}
            hack={hack}
            n={String(i).padStart(2, '0')}
          />
        ))}
      </div>
    </main>
  )
}
