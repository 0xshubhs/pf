import Image from 'next/image'
import Link from 'next/link'
import avatar from './assets/itachi.gif'
import { getOssSummary } from '@/lib/github'

// Revalidate hourly so the PR count stays current without rebuilding.
export const revalidate = 3600

// No 'use client', no state, no effects. The landing page is now fully static
// HTML — it renders on the server and ships zero JavaScript of its own.

// The PR count is fetched, not hard-coded — it was stale at 148 while the real
// number had climbed well past it. Falls back if GitHub is unreachable.
const statsFor = (mergedPrs: number) => [
  { value: mergedPrs ? String(mergedPrs) : '115+', label: 'merged oss prs' },
  { value: '700+', label: 'commits on maha fraxn' },
  { value: '6', label: 'hackathon wins' },
  { value: '22', label: 'languages shipped' },
]

const INDEX = [
  { n: '00', text: 'FHE', note: 'Zama · Fhenix · Inco', href: '/hacks' },
  { n: '01', text: 'ZK', note: 'Aleo · sealed-bid auctions', href: '/hacks' },
  { n: '02', text: 'AUDITS', note: 'contests · fuzzing · formal', href: '/audits' },
  { n: '03', text: 'CHAINS', note: 'custom EVM · indexers', href: '/projects' },
  { n: '04', text: 'DEFI', note: 'RWA exchange · CLOBs', href: '/projects' },
  { n: '05', text: 'PAYMENTS', note: 'x402 · Base · Solana', href: '/hacks' },
  { n: '06', text: 'OSS', note: 'DefiLlama · Foundry', href: '/about' },
  { n: '07', text: 'CONTACT', note: 'open to work', href: '/contact' },
]

export default async function Home() {
  const { externalMerged } = await getOssSummary()
  const STATS = statsFor(externalMerged)

  return (
    <main className="mx-auto max-w-5xl px-5">
      {/* ---- Masthead ---- */}
      {/* The gif is FIRST in the DOM so it stacks on top on phones. On desktop
          the grid order is flipped back: name on the left, gif on the right. */}
      <section className="grid gap-8 border-b border-rule py-10 md:grid-cols-[1fr_auto] md:items-start md:gap-12 md:py-16">
        {/* 42x82 natural, portrait — the source gif was cropped to its content
            box (it carried ~55% dead transparent padding). Width stays auto so
            it scales by height without being squashed. No frame. */}
        <figure className="shrink-0 text-center md:order-2">
          <Image
            src={avatar}
            alt=""
            width={42}
            height={82}
            className="mx-auto block h-[190px] w-auto md:h-[250px]"
            loading="eager"
            unoptimized
          />
          <figcaption className="mt-3 text-lg font-bold md:text-xl">
            gmeow anon ;)
          </figcaption>
        </figure>

        <div className="min-w-0 md:order-1">
          <p className="b-label mb-5">
            blockchain engineer &middot; security researcher &middot; india
          </p>

          <h1 className="b-display">
            Shubham
            <br />
            Tiwari
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed md:text-lg">
            I build privacy tech — FHE, ZK, confidential payments — and the chains it runs
            on. Currently lead engineer on{' '}
            <span className="font-bold">Maha Fraxn</span>, an RWA exchange on its own custom
            EVM chain.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link href="/projects" className="b-btn b-btn-accent">
              View work
            </Link>
            <Link href="/audits" className="b-btn">
              Security research
            </Link>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="b-btn">
              Resume
            </a>
          </div>
        </div>
      </section>

      {/* ---- Numbers ---- */}
      <section className="border-b border-rule py-10">
        <div className="b-grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="px-4 py-6">
              <p className="text-3xl font-bold leading-none md:text-4xl">{s.value}</p>
              <p className="b-label mt-3">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Index ---- */}
      <section className="py-10 md:py-14">
        <p className="b-label mb-5">index</p>

        <ul className="border-t border-rule-soft">
          {INDEX.map((item) => (
            <li key={item.n}>
              <Link
                href={item.href}
                className="b-box-link flex items-baseline gap-4 border-x-0 border-t-0 border-b border-rule-soft px-1 py-4 md:gap-6 md:px-3"
              >
                <span className="b-faint shrink-0 text-sm">{item.n}</span>
                <span className="text-xl font-bold md:text-2xl">{item.text}</span>
                {/* Note + arrow travel together, so the arrow stays pinned right
                    even at widths where the note is hidden. */}
                <span className="ml-auto flex shrink-0 items-baseline gap-4">
                  <span className="b-dim hidden text-sm sm:block">{item.note}</span>
                  <span aria-hidden className="text-base">
                    &rarr;
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
