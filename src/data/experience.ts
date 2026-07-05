const PAST_ROLES: {
  id: string
  company: string
  role: string
  description: string
  startDate: string
  endDate: string
  link?: string
}[] = [
  
  {
    id: '1',
    company: 'What was that Meme?',
    role: 'Builder',
    description:
      `I helped build the website and the backend scraper and pagination stuff for What was that Meme? 
      It is a meme Aggregator Platfrom which basically scrapes over internet and get the memes to you.`
      ,
    startDate: 'September 2024',
    endDate: 'Now',
    link: 'https://whatwasthatmeme.org',
  },
  {
    id: '2',
    company: 'FOMO-Wallet',
    role: 'Frontend Developer && AI agent Integrator',
    description:
      `I helped build some of the frontend components and integrated the AI agent to the wallet for better user experience and make it easier to bet on our platform.`,
    startDate: 'December 2024',
    endDate: 'Now',
    link: 'https://fomo-wallet-frontend.vercel.app',
  },
  {
    id: '3',
    company: 'AttenomicsLabs',
    role: 'Solidity Engineer',
    description:
      `Wrote and maintained comprehensive test suites for smart contracts covering unit, integration, and fuzz testing.
       Identified and documented security edge cases including reentrancy, integer overflow, access control bypasses, and frontrunning vectors.
       Worked on hardening contract logic through rigorous testing and security-focused code reviews.`,
    startDate: 'Feb 2025',
    endDate: 'Now',
    link: '',
  },  
  {
    id: '4',
    company: 'Qoneqt (Human Quotient Pvt Ltd)',
    role: 'Blockchain Engineer',
    description:
      `Lead blockchain engineer on Maha Fraxn, the company's RWA (real-world asset) exchange — built it end to end with 700+ commits across all branches, ~89% of the repo's entire commit history.
       Built the on-chain audit trail in Solidity (bytes32 listing IDs, usernames, full trade metadata) and spun up the exchange's own custom EVM chain with a block explorer.
       Shipped the admin platform end-to-end: trade monitoring with buy/sell filters and exports, fee statistics, market-maker fee logic (side-aware fees, 0% for listing owners and assigned MMs), and KYC flows.
       Implemented an i18n system covering all 22 Indian scheduled languages, and hardened the stack with security fixes from parallel audit passes.
       Earlier: built Subgraph + NodeJS indexers for the Oboswap DEX, customised Avalanche Subnet L1s (precompiles for gas, reward managers, custom fees), and gasless transactions on Qoneqt via EIP-712 / EIP-2771 meta-transactions.`,
    startDate: 'April 2025',
    endDate: 'Now',
    link: 'https://qoneqt.com/profile/0xshubham',
  },
  // {
  //   id: '',
  //   company: '',
  //   role: '',
  //   description:
  //     '',
  //   startDate: '',
  //   endDate: '',
  //   link: '',
  // },
]

export default PAST_ROLES