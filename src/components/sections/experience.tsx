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

export default function Experience() {
  const roles = [...PAST_ROLES].reverse()

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
