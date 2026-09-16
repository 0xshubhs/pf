import Image from 'next/image'
import meme from '../assets/meme.png'
import { PageHeader } from '@/components/page-header'

const CHANNELS = [
  { label: 'email', value: 'shubht3303@gmail.com', href: 'mailto:shubht3303@gmail.com' },
  { label: 'github', value: '0xshubhs', href: 'https://github.com/0xshubhs' },
  { label: 'x', value: 'shubhamtwtt', href: 'https://x.com/shubhamtwtt' },
  { label: 'telegram', value: 'DevShubhamm', href: 'https://t.me/DevShubhamm' },
  { label: 'medium', value: '0xShubham', href: 'https://medium.com/@0xShubham' },
]

export default function Contact() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <PageHeader label="06 / contact" title="Let's connect">
        Open to work, collaborations, audits, or a friendly hello. Email is fastest.
      </PageHeader>

      {/* Meme leads the page — no frame, no rules. Two bold captions sit side
          by side over the image, exactly as they did before. */}
      <div className="mx-auto flex h-[300px] select-none flex-col sm:h-[400px]">
        <div className="flex justify-around text-center">
          <p className="b-dim mx-2 mt-3 w-[120px] text-[11px] font-bold sm:mx-4 sm:mt-5 sm:w-[160px] sm:text-base">
            You looking for a gud developer
          </p>
          <p className="b-dim mx-2 mt-3 w-[120px] text-[11px] font-bold sm:mx-4 sm:mt-5 sm:w-[160px] sm:text-base">
            Me looking for a gud job
          </p>
        </div>
        <div className="relative m-auto h-[200px] w-full max-w-[280px] sm:h-[350px] sm:max-w-[400px] md:h-[450px] md:max-w-[450px]">
          <Image
            src={meme}
            alt="spiderman-meme"
            fill
            sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, 450px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <ul className="mt-12 border-t border-rule">
        {CHANNELS.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="b-box-link grid grid-cols-[6rem_1fr_auto] items-baseline gap-4 border-x-0 border-t-0 border-b border-rule px-1 py-4 md:px-3"
            >
              <span className="b-label">{c.label}</span>
              <span className="truncate text-base md:text-lg">{c.value}</span>
              <span aria-hidden className="text-base">
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Resume — the one inverted slab on the page. */}
      <div className="b-invert mt-10 flex flex-col gap-4 border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="b-label">resume</p>
          <p className="mt-1 text-lg font-bold">Full history, one page.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="b-btn b-btn-accent"
          >
            View
          </a>
          <a
            href="/resume.pdf"
            download
            className="b-btn border-paper bg-transparent text-paper hover:bg-paper hover:text-ink"
          >
            Download
          </a>
        </div>
      </div>
    </main>
  )
}
