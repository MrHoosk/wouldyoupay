export interface Idea {
  slug: string
  title: string
  headline: string
  subheadline: string
  problem: string
  solution: string
  cta: string
  features: string[]
  color: string // Tailwind color class
}

// Ideas configuration - add new ideas here
export const ideas: Record<string, Idea> = {
  // Example ideas - replace/expand as needed
  landlord: {
    slug: 'landlord',
    title: 'LandlordComply',
    headline: 'Landlord Compliance, Simplified',
    subheadline: 'Never miss a safety certificate, license renewal, or MTD deadline again.',
    problem: 'Managing rental properties means drowning in compliance paperwork. Gas safety certs, EICRs, HMO licenses, deposit protection, Right to Rent checks, and now Making Tax Digital. Miss one deadline and face fines—or worse.',
    solution: 'One dashboard that tracks every compliance requirement across all your properties. Automated reminders. Document storage. MTD-ready tax submissions. Peace of mind.',
    cta: 'Get Early Access',
    features: [
      'Automated compliance calendar',
      'Certificate expiry alerts',
      'Document vault',
      'MTD tax integration',
      'Multi-property support'
    ],
    color: 'blue'
  },
  mtdbridge: {
    slug: 'mtdbridge',
    title: 'MTD Bridge',
    headline: 'Making Tax Digital Without the Headache',
    subheadline: 'Connect your spreadsheets to HMRC in minutes. No accounting software required.',
    problem: "HMRC's Making Tax Digital mandate is here. You're forced to either buy expensive accounting software or manually enter data into clunky government portals. There has to be a better way.",
    solution: 'MTD Bridge connects your existing spreadsheets directly to HMRC. Keep working the way you always have. We handle the digital submission.',
    cta: 'Join the Waitlist',
    features: [
      'Excel & Google Sheets compatible',
      'Direct HMRC submission',
      'VAT & Income Tax support',
      'No accounting software needed',
      'Audit-ready records'
    ],
    color: 'green'
  },
  aiagent: {
    slug: 'aiagent',
    title: 'AgentForge',
    headline: 'Your Custom AI Agent, Built in Days',
    subheadline: 'Stop waiting months for enterprise AI. Get a tailored assistant that knows your business.',
    problem: "You've seen what AI can do. ChatGPT is impressive but generic. Enterprise AI projects take months and cost millions. You need something in between—powerful but fast.",
    solution: 'We build custom AI agents trained on your data, integrated with your tools, deployed in days not months. Your own AI team member.',
    cta: 'Request a Build',
    features: [
      'Trained on your data',
      'Integrated with your tools',
      'Deployed in days',
      'Ongoing refinement',
      'Full ownership'
    ],
    color: 'purple'
  }
}

export function getIdea(slug: string): Idea | null {
  return ideas[slug] || null
}

export function getAllIdeas(): Idea[] {
  return Object.values(ideas)
}
