import Skills from '@/components/sections/skills'
import Experience from '@/components/sections/experience'
import Contributions from '@/components/sections/contributions'
import { PageHeader, SectionHeading } from '@/components/page-header'

const INTRO = [
  'Blockchain engineer, two-plus years deep in Web3. I build the whole stack: Solidity and FHE contracts, custom EVM chains, indexers, and the frontends that make them usable.',
  "By day I'm the lead blockchain engineer on Maha Fraxn at Qoneqt, an RWA exchange running on its own custom chain, where I built the on-chain audit trail, the admin and fee systems, and i18n for all 22 Indian scheduled languages. 700+ commits, over 90% of the codebase's entire history.",
  'By night I ship hackathon projects that keep winning: private FHE checkouts on Fhenix (Sigill), sealed-bid ZK auctions on Aleo (SilentBid), sign-once-settle-many x402 payment sessions on Base and Solana, and AI trading agents on SoSoValue. Six paid wins and counting.',
  "When something upstream is broken I fix it there too: DefiLlama's TVL adapters, the Foundry book, Starknet Quest's Rust API, Witnet's elliptic curve library.",
  "Privacy tech is my lane: FHE (Zama, Fhenix, Inco), zero-knowledge (Aleo), stealth addresses, confidential payments. If a transaction can leak something, I've probably built a way to seal it. Off the keyboard: music, meditation, and the gym.",
]

export default function About() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <PageHeader label="01 / about" title="Gm, I'm Shubham." />

      <div className="max-w-2xl space-y-4 text-base leading-relaxed md:text-lg">
        {INTRO.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <section className="mt-16">
        <SectionHeading title="Skills & technologies" index="02" />
        <p className="b-dim mb-8 max-w-2xl text-base">
          Technologies I&apos;ve worked with across web development and Web3.
        </p>
        <Skills />
      </section>

      <section className="mt-16">
        <SectionHeading title="Work experience" index="03" />
        <p className="b-dim mb-8 max-w-2xl text-base">
          My professional journey in Web3 and development.
        </p>
        <Experience />
      </section>

      <section className="mt-16">
        <SectionHeading title="Open source" index="04" />
        <p className="b-dim mb-8 max-w-2xl text-base">
          When something upstream is broken, I fix it there. Counts and the full log
          below are pulled live from GitHub; every link goes to real merged work.
        </p>
        <Contributions />
      </section>
    </main>
  )
}
