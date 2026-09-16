import { PageHeader } from '@/components/page-header'
import AUDITS, { type AuditEngagement } from '@/data/audits'

const AuditEntry = ({ audit, n }: { audit: AuditEngagement; n: string }) => (
  <article className="border-b border-rule py-8">
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 className="text-xl font-bold md:text-2xl">
        <span className="b-faint mr-3 text-sm">{n}</span>
        {audit.protocol}
      </h2>
      <p className="b-label">{audit.date}</p>
    </div>

    <p className="b-dim mt-1 text-base">
      {audit.platform}
      {audit.prizePool ? ` · ${audit.prizePool}` : ''} &middot; {audit.scope}
    </p>

    <p className="mt-4 max-w-2xl text-base leading-relaxed">{audit.description}</p>

    <ul className="mt-4 max-w-2xl space-y-1.5">
      {audit.highlights.map((point, i) => (
        <li key={i} className="b-dim flex gap-3 text-base">
          <span aria-hidden className="shrink-0">
            &mdash;
          </span>
          <span>{point}</span>
        </li>
      ))}
    </ul>

    <div className="mt-5 flex flex-wrap gap-1.5">
      {audit.tools.map((tool) => (
        <span key={tool} className="b-tag">
          {tool}
        </span>
      ))}
    </div>

    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
      <a
        href={audit.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="b-link text-base"
      >
        read the research &rarr;
      </a>
      <span className="b-label">{audit.status}</span>
    </div>
  </article>
)

export default function Audits() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <PageHeader label="05 / security research" title="Security Research">
        Competitive audit contests, fuzzing harnesses, and formal verification. No accepted
        findings on the board yet, but every engagement below ships with runnable PoCs,
        invariant suites, and specs, all public. The scoreboard will catch up.
      </PageHeader>

      <div>
        {AUDITS.map((audit, i) => (
          <AuditEntry
            key={audit.protocol}
            audit={audit}
            n={String(i).padStart(2, '0')}
          />
        ))}
      </div>

      <p className="b-dim mt-8 max-w-2xl text-base leading-relaxed">
        Also hardening contracts professionally: test suites, fuzz coverage, and security
        reviews at AttenomicsLabs &amp; Qoneqt.
      </p>
    </main>
  )
}
