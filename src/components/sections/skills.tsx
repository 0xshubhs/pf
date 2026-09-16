import SKILLS from '@/data/skills'

export default function Skills() {
  return (
    <div className="space-y-10">
      {SKILLS.map((item) => (
        <div key={item.field}>
          <h3 className="b-label mb-3">{item.field}</h3>
          <div className="flex flex-wrap gap-x-1.5 gap-y-1.5">
            {item.skills.map((skill) => (
              <span
                key={skill.skill}
                className="flex items-center gap-2 border border-rule-soft px-2.5 py-1.5 text-sm"
              >
                <skill.icon className="h-3.5 w-3.5 shrink-0" title="" />
                {skill.skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
