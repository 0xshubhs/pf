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
    company: 'Qoneqt',
    role: 'Blockchain Engineer',
    description:
      `Started as a Blockchain Intern Developer at Human Qoutient Pvt Ltd .    
       Built Subgraph ( Customised Graph Protocol's Indexer ) / NodeJS Indexer For the Oboswap DEX .
       Created Customised ( Precompiles like Gas , Reward Managers , Custom Fees, Difficulties, etc ) L1's on Avalanche Subnets  .
       Implemented Gasless Transactions for users on Qoneqt ( EIP712 , EIP2771 ) .
      `,
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