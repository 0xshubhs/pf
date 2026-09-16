import React from 'react'

/**
 * Every page opens the same way: a small tracked label, a heading, an optional
 * standfirst, closed by a full-width rule. Consistency is the whole hierarchy —
 * there are no cards, shadows or colours doing that job any more.
 */
export function PageHeader({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <header className="mb-10 border-b border-rule pb-6">
      <p className="b-label mb-3">{label}</p>
      <h1 className="b-title">{title}</h1>
      {children && (
        <div className="b-dim mt-4 max-w-2xl text-base leading-relaxed">{children}</div>
      )}
    </header>
  )
}

/** Section title with a rule running out to an index number on the right. */
export function SectionHeading({ title, index }: { title: string; index?: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <h2 className="whitespace-nowrap text-lg font-bold md:text-xl">{title}</h2>
      <span aria-hidden className="h-px flex-1 bg-rule-soft" />
      {index && <span className="b-label shrink-0">{index}</span>}
    </div>
  )
}
