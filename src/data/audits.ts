// data/audits.ts

export interface AuditEngagement {
  protocol: string
  platform: string
  date: string
  prizePool?: string
  scope: string
  description: string
  tools: string[]
  highlights: string[]
  repoUrl: string
  status: string
}

const AUDITS: AuditEngagement[] = [
  {
    protocol: 'Chainlink Payment Abstraction V2',
    platform: 'Code4rena · Competitive Audit',
    date: 'March 2026',
    prizePool: '$65,000 USDC pool',
    scope: '1,060 nSLOC across 13 contracts',
    description:
      'A permissionless Dutch auction system converting protocol fee tokens into LINK, with CowSwap (GPv2) settlement integration. I ran a full multi-layer review: threat modeling and trust-boundary mapping, static analysis triage, property-based and stateful fuzzing, formal verification specs, and manual review of the auction curve, rounding direction, and privileged-role escalation paths.',
    tools: ['Manual Review', 'Foundry Invariant Fuzzing', 'Medusa', 'Certora', 'Slither', 'Threat Modeling'],
    highlights: [
      '8 Foundry invariant tests + 48 Medusa stateful assertion tests over the auction curve and settlement flows',
      'Certora specs for BaseAuction, GPV2CompatibleAuction, and PriceManager',
      'Triaged 50 Slither findings; consolidated report covering CowSwap dust-fill vectors, price-staleness edge cases, and role centralization risks',
    ],
    repoUrl: 'https://github.com/0xshubhs/security-audits/tree/main/chainlink',
    status: 'Submissions judged duplicate / out of scope. Full research, PoCs, and specs are public',
  },
  {
    protocol: 'Kuru Labs On-chain CLOB',
    platform: 'Cantina · Competitive Audit',
    date: '2026',
    scope: 'Full contracts directory: order book, margin account, router, forwarder',
    description:
      'A fully on-chain central limit order book with backstop AMM liquidity: bitmap-tree price discovery, price-time priority matching over linked lists, and a margin account handling all maker credits. I dug into the order-matching math, flip-order rounding accumulation, the meta-transaction forwarder\'s non-sequential nonce scheme, and market-parameter misconfiguration as a DoS surface.',
    tools: ['Manual Review', 'Foundry', 'Hardhat', 'Deployment & Benchmark Scripting'],
    highlights: [
      'Deep-dive on TreeMath bitmap price tree and O(n) linked-list matching for ordering and rounding faults',
      'Analyzed KuruForwarder EIP-712 flows: replay surface of timestamp-as-nonce cancel requests',
      'Built deploy + benchmark harnesses to measure storage-orderbook gas behavior under fragmented fills',
    ],
    repoUrl: 'https://github.com/0xshubhs/security-audits/tree/main/kuru-labs',
    status: 'Submissions not accepted. Full analysis and harnesses are public',
  },
]

export default AUDITS
