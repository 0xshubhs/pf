// data/contributions.ts

export interface ContributionPR {
  title: string
  url: string
  status: 'merged' | 'open'
}

export interface Contribution {
  project: string
  org: string
  blurb: string
  prs: ContributionPR[]
}

const CONTRIBUTIONS: Contribution[] = [
  {
    project: 'DefiLlama',
    org: 'DefiLlama/DefiLlama-Adapters · dimension-adapters',
    blurb:
      "DeFi's canonical TVL and metrics aggregator. Adapter fixes and new integrations keeping protocol metrics accurate.",
    prs: [
      {
        title: 'fix(mainstreet): stop valuing depegged msUSD at the USDC peg (~$51M overstated)',
        url: 'https://github.com/DefiLlama/DefiLlama-Adapters/pull/19974',
        status: 'merged',
      },
      {
        title: 'fix(quickswap-v2): migrate polygon volume from dead subgraph to onchain log adapter',
        url: 'https://github.com/DefiLlama/dimension-adapters/pull/8006',
        status: 'merged',
      },
      {
        title: 'fix(onixswap): update methodology for Onix.Finance rebrand',
        url: 'https://github.com/DefiLlama/dimension-adapters/pull/8005',
        status: 'merged',
      },
      {
        title: 'feat(turboflow): track fees and revenue in dimension-adapters',
        url: 'https://github.com/DefiLlama/dimension-adapters/pull/7928',
        status: 'merged',
      },
      {
        title: 'fix(felix): add two missing Felix Metamorpho vaults',
        url: 'https://github.com/DefiLlama/DefiLlama-Adapters/pull/19905',
        status: 'merged',
      },
      {
        title: 'fix(t3tris-finance): read grossTVL so TVL is not reported as 0',
        url: 'https://github.com/DefiLlama/DefiLlama-Adapters/pull/19880',
        status: 'merged',
      },
    ],
  },
  {
    project: 'Foundry',
    org: 'foundry-rs/book',
    blurb:
      'Official documentation for the Foundry smart contract toolchain used by most of the EVM ecosystem.',
    prs: [
      {
        title: 'docs(cheatcodes): correct vm.parseJsonKeys behaviour',
        url: 'https://github.com/foundry-rs/book/pull/1260',
        status: 'merged',
      },
    ],
  },
  {
    project: 'Starknet Quest',
    org: 'lfglabs-dev/api.starknet.quest',
    blurb:
      "LFG Labs' quest platform API on Starknet, written in Rust. Production backend serving the Starknet Quest app.",
    prs: [
      {
        title: 'perf: optimize analytics/get_quest_activity endpoint',
        url: 'https://github.com/lfglabs-dev/api.starknet.quest/pull/392',
        status: 'merged',
      },
    ],
  },
  {
    project: 'Witnet',
    org: 'witnet/elliptic-curve-solidity',
    blurb:
      'Elliptic curve arithmetic library in pure Solidity, used for on-chain secp256k1 operations.',
    prs: [
      {
        title: 'fix: typo in EllipticCurve.sol helper functions',
        url: 'https://github.com/witnet/elliptic-curve-solidity/pull/39',
        status: 'merged',
      },
    ],
  },
  {
    project: 'GDSC LTCE',
    org: 'GDSCltce/AIML',
    blurb:
      "Google Developer Student Clubs chapter. Built out the AI/ML learning track: regression, classification, deep learning, and reinforcement learning resources.",
    prs: [
      {
        title: '15 merged PRs building the AIML curriculum',
        url: 'https://github.com/GDSCltce/AIML/pulls?q=is%3Apr+author%3A0xshubhs+is%3Amerged',
        status: 'merged',
      },
    ],
  },
  {
    project: 'OpenSauced',
    org: 'open-sauced/docs',
    blurb: 'Open source contribution analytics platform. Improved contributor and maintainer documentation.',
    prs: [
      {
        title: 'docs: contributing guidelines for PRs with unassigned issues',
        url: 'https://github.com/open-sauced/docs/pull/252',
        status: 'merged',
      },
      {
        title: 'fix: maintainers guide Activity subsection screenshot',
        url: 'https://github.com/open-sauced/docs/pull/303',
        status: 'merged',
      },
    ],
  },
]

export default CONTRIBUTIONS
