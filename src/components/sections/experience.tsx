import PAST_ROLES from '@/data/experience'

interface Role {
  id: string
  company: string
  role: string
  description: string
  startDate: string
  endDate: string
  link?: string
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// "April 2025" / "Feb 2025" -> a sortable month index. Matching on the first
// three letters handles both the full and abbreviated month names in the data.
const startedAt = (role: Role) => {
  const [month, year] = role.startDate.toLowerCase().split(' ')
  return Number(year) * 12 + MONTHS.findIndex((m) => month.startsWith(m))
}

export default function Experience() {
  // Most recent role first. Sorting on the dates rather than reversing the array
  // means the order survives someone adding a role in the wrong place.
  const roles = [...PAST_ROLES].sort((a, b) => startedAt(b) - startedAt(a))

  return (
    <ol className="border-t border-rule">
      {roles.map((role: Role) => (
        <li
          key={role.id}
          className="grid gap-2 border-b border-rule py-5 md:grid-cols-[9rem_1fr] md:gap-6"
        >
          <p className="b-label pt-1">
            {role.startDate} &rarr; {role.endDate}
          </p>

          <div>
            <h3 className="text-lg font-bold md:text-xl">{role.role}</h3>
            <p className="b-dim mt-0.5 text-base">{role.company}</p>

            {role.description && (
              <p className="b-dim mt-3 whitespace-pre-line text-base leading-relaxed">
                {role.description}
              </p>
            )}

            {role.link && (
              <a
                href={role.link}
                target="_blank"
                rel="noopener noreferrer"
                className="b-link mt-3 inline-block text-sm"
              >
                visit &rarr;
              </a>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
