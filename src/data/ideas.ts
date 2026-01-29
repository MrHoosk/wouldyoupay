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
  // ============================================
  // EXISTING IDEAS
  // ============================================
  
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
  },

  // ============================================
  // COMPLIANCE / REGULATORY
  // ============================================

  carehome: {
    slug: 'carehome',
    title: 'CQC Ready',
    headline: 'CQC Compliance Without the Panic',
    subheadline: 'Stay inspection-ready every day, not just when the CQC calls.',
    problem: 'Care home managers spend more time on paperwork than on residents. Staff training records scattered across folders. Medication logs incomplete. When CQC inspects, it is a scramble to prove compliance you know you have.',
    solution: 'CQC Ready centralizes all your compliance documentation. Automated training reminders. Medication audit trails. Real-time inspection readiness scores. Sleep well before inspections.',
    cta: 'Book a Demo',
    features: [
      'Staff training tracker',
      'Medication audit logs',
      'Inspection readiness score',
      'Document management',
      'Multi-site dashboard'
    ],
    color: 'rose'
  },

  ir35: {
    slug: 'ir35',
    title: 'IR35 Shield',
    headline: 'IR35 Compliance, Sorted',
    subheadline: 'Protect your business and your contractors from HMRC investigations.',
    problem: 'The IR35 rules shifted liability to you. Get the status determination wrong and face backdated tax bills, NI, and penalties. CEST is confusing. Legal opinions are expensive. You need certainty.',
    solution: 'IR35 Shield assesses every engagement against current legislation. Clear determinations with reasoning. Audit trail for HMRC. Update assessments when regulations change.',
    cta: 'Assess Your Contractors',
    features: [
      'Automated status assessments',
      'HMRC-defensible reasoning',
      'Bulk contractor processing',
      'Regulation change alerts',
      'Full audit trail'
    ],
    color: 'amber'
  },

  gdpr: {
    slug: 'gdpr',
    title: 'GDPR Keeper',
    headline: 'GDPR Compliance Made Simple',
    subheadline: 'Know exactly what data you hold, where it lives, and when to delete it.',
    problem: 'GDPR fines are real and growing. You have customer data scattered across spreadsheets, CRMs, email inboxes, and forgotten Dropbox folders. A subject access request would take weeks. Deletion requests? Impossible to verify.',
    solution: 'GDPR Keeper maps your data landscape. Automated data discovery. SAR response workflows. Retention policy enforcement. Prove compliance when regulators ask.',
    cta: 'Start Your Data Audit',
    features: [
      'Data mapping & discovery',
      'SAR workflow automation',
      'Retention policy engine',
      'Consent management',
      'Breach response toolkit'
    ],
    color: 'indigo'
  },

  foodhygiene: {
    slug: 'foodhygiene',
    title: 'HygieneHub',
    headline: 'Five-Star Food Hygiene, Every Day',
    subheadline: 'Digital HACCP logs and temperature monitoring that inspectors love.',
    problem: 'Paper temperature logs get lost. Staff forget to sign. Fridge probes fail overnight and nobody notices. When the EHO visits, you are scrambling for clipboards instead of running your kitchen.',
    solution: 'HygieneHub digitizes your entire HACCP system. Wireless temperature sensors with alerts. Staff sign-off on tablets. Supplier due diligence tracking. Impress inspectors, protect customers.',
    cta: 'Get Kitchen Ready',
    features: [
      'Digital HACCP logs',
      'Wireless temp monitoring',
      'Alert escalation',
      'Supplier management',
      'EHO report generation'
    ],
    color: 'lime'
  },

  // ============================================
  // AI-ADJACENT
  // ============================================

  aimeetings: {
    slug: 'aimeetings',
    title: 'MeetingMind',
    headline: 'AI Meeting Notes That Actually Work',
    subheadline: 'Stop typing. Start deciding. Every meeting summarized, action items extracted.',
    problem: 'You spend meetings typing notes instead of participating. Action items get lost in transcripts. Follow-ups fall through cracks. By Friday, nobody remembers what was agreed on Monday.',
    solution: 'MeetingMind joins your calls invisibly. Real-time transcription. Automatic summary generation. Action items extracted and assigned. Integrates with your task manager. Never miss a follow-up.',
    cta: 'Try Free for 14 Days',
    features: [
      'Automatic transcription',
      'AI-generated summaries',
      'Action item extraction',
      'Task manager integration',
      'Searchable meeting archive'
    ],
    color: 'cyan'
  },

  aisupport: {
    slug: 'aisupport',
    title: 'SupportBot Pro',
    headline: 'AI Customer Support That Sounds Human',
    subheadline: 'Handle 80% of tickets automatically. Escalate the rest intelligently.',
    problem: 'Your support queue grows faster than your team. Customers wait hours for answers that are already in your docs. Good agents spend time on repetitive questions instead of complex problems.',
    solution: 'SupportBot Pro learns from your existing tickets and documentation. Answers common questions instantly. Gathers context before escalating. Your agents focus on cases that need humans.',
    cta: 'See It In Action',
    features: [
      'Trained on your docs',
      'Natural conversation flow',
      'Smart escalation',
      'Multi-channel support',
      'Analytics dashboard'
    ],
    color: 'teal'
  },

  aiwriter: {
    slug: 'aiwriter',
    title: 'ContentCraft',
    headline: 'AI Content That Sounds Like You',
    subheadline: 'Blog posts, emails, and social content in your brand voice. Not generic AI slop.',
    problem: 'You know content marketing works. You do not have time to write. Generic AI content reads like... generic AI content. Hiring writers is expensive and slow.',
    solution: 'ContentCraft learns your brand voice from existing content. Generates drafts that sound authentically you. Built-in editing workflow. From brief to published in hours, not weeks.',
    cta: 'Generate Your First Post',
    features: [
      'Brand voice training',
      'Multiple content types',
      'SEO optimization',
      'Editing workflow',
      'Publishing integrations'
    ],
    color: 'fuchsia'
  },

  // ============================================
  // SME TOOLS
  // ============================================

  invoicechaser: {
    slug: 'invoicechaser',
    title: 'ChaseBot',
    headline: 'Get Paid Without the Awkward Emails',
    subheadline: 'Automated invoice reminders that preserve relationships and improve cash flow.',
    problem: 'Late payments kill small businesses. Chasing invoices feels uncomfortable. You either send embarrassing reminder emails or let cash flow suffer while waiting awkwardly.',
    solution: 'ChaseBot sends professionally worded reminders on a schedule you set. Escalates tone gradually. Tracks payment promises. You get paid without straining relationships.',
    cta: 'Chase Smarter',
    features: [
      'Automated reminder sequences',
      'Customizable tone escalation',
      'Payment promise tracking',
      'Accounting software sync',
      'Cash flow forecasting'
    ],
    color: 'emerald'
  },

  expenses: {
    slug: 'expenses',
    title: 'SnapExpense',
    headline: 'Expense Reports in 30 Seconds',
    subheadline: 'Snap a receipt. Done. No spreadsheets, no lost paper, no month-end panic.',
    problem: 'Receipts pile up in wallets and glove boxes. Month-end means hours matching faded paper to bank statements. Half your claims get rejected for missing documentation.',
    solution: 'SnapExpense extracts data from receipt photos automatically. Categorizes expenses. Matches to bank transactions. Generates HMRC-compliant reports. Expense claims in seconds, not hours.',
    cta: 'Snap Your First Receipt',
    features: [
      'Receipt photo scanning',
      'Auto-categorization',
      'Bank feed matching',
      'Mileage tracking',
      'HMRC-ready exports'
    ],
    color: 'orange'
  },

  stockmanager: {
    slug: 'stockmanager',
    title: 'StockSense',
    headline: 'Inventory Management That Makes Sense',
    subheadline: 'Know what you have, what you need, and when to order. No spreadsheet acrobatics.',
    problem: 'You have stock in the warehouse, some in the van, more on backorder. Spreadsheets cannot keep up. You either over-order and tie up cash or run out and lose sales.',
    solution: 'StockSense tracks inventory across all locations in real-time. Automatic reorder alerts. Supplier lead time learning. Demand forecasting. Right stock, right place, right time.',
    cta: 'Take Control of Stock',
    features: [
      'Multi-location tracking',
      'Barcode/QR scanning',
      'Reorder point alerts',
      'Supplier management',
      'Demand forecasting'
    ],
    color: 'sky'
  },

  // ============================================
  // PRODUCTIZED SERVICES
  // ============================================

  websiteweek: {
    slug: 'websiteweek',
    title: 'Website in a Week',
    headline: 'Your Professional Website, Live in 7 Days',
    subheadline: 'No endless design rounds. No scope creep. One week, one price, one beautiful website.',
    problem: 'Web projects drag on for months. Designers ask endless questions. Developers miss deadlines. You just need a professional site that converts visitors to customers. This should not be hard.',
    solution: 'We have built hundreds of sites. We know what works. Pick a style. Send your content. In 7 days, you have a fast, mobile-optimized site that makes you look professional.',
    cta: 'See the Process',
    features: [
      'Fixed 7-day timeline',
      'Fixed transparent pricing',
      'Mobile-optimized design',
      'Basic SEO included',
      'Training & handover'
    ],
    color: 'violet'
  },

  seoaudit: {
    slug: 'seoaudit',
    title: 'SEO Audit Pro',
    headline: 'Know Exactly Why You Are Not Ranking',
    subheadline: 'Comprehensive SEO audit with prioritized fixes. Not a generic automated report.',
    problem: 'Your competitors outrank you and you do not know why. Automated SEO tools generate hundreds of warnings without context. You need someone who understands search to tell you what actually matters.',
    solution: 'A senior SEO analyst reviews your site manually. Technical issues, content gaps, backlink profile, competitor analysis. You get a prioritized action plan, not a data dump.',
    cta: 'Request Your Audit',
    features: [
      'Manual expert review',
      'Technical SEO analysis',
      'Content gap identification',
      'Competitor benchmarking',
      'Prioritized action plan'
    ],
    color: 'red'
  },

  // ============================================
  // ADDITIONAL IDEAS
  // ============================================

  fleetcheck: {
    slug: 'fleetcheck',
    title: 'FleetCheck',
    headline: 'Fleet Compliance Without the Paperwork',
    subheadline: 'MOTs, insurance, tachographs, driver hours—all tracked automatically.',
    problem: 'Managing a vehicle fleet means juggling expiry dates across MOTs, insurance, tax, and driver certifications. One missed deadline means vehicles off the road, drivers unable to work, and potential VOSA fines.',
    solution: 'FleetCheck consolidates all vehicle and driver compliance in one dashboard. Automated renewal reminders. Digital walk-around checks. Tachograph integration. Never get caught out.',
    cta: 'Track Your Fleet',
    features: [
      'Expiry date tracking',
      'Digital defect reporting',
      'Driver license checks',
      'Tachograph integration',
      'Multi-depot support'
    ],
    color: 'slate'
  },

  bookkeeper: {
    slug: 'bookkeeper',
    title: 'BookkeeperBox',
    headline: 'Bookkeeping on Autopilot',
    subheadline: 'Bank transactions categorized automatically. Your accountant will love you.',
    problem: 'End of year means a shoebox of receipts and a bank statement you have not looked at for months. Your accountant charges extra for the mess. You swear next year will be different. It never is.',
    solution: 'BookkeeperBox connects to your bank and learns your spending patterns. Transactions categorized automatically. Receipts matched by amount and date. Quarterly packs ready for your accountant.',
    cta: 'Connect Your Bank',
    features: [
      'Automatic bank sync',
      'AI categorization',
      'Receipt matching',
      'Accountant export packs',
      'Tax estimate tracking'
    ],
    color: 'stone'
  },

  appointmentpro: {
    slug: 'appointmentpro',
    title: 'AppointmentPro',
    headline: 'Online Booking That Just Works',
    subheadline: 'Let clients book themselves. No more phone tag. No more double bookings.',
    problem: 'Your phone rings during appointments. Clients play voicemail tennis. You double-book because the diary is in three places. Admin eats into billable time.',
    solution: 'AppointmentPro gives clients a booking page that syncs with your calendar. Automated reminders reduce no-shows. Payment collection at booking. Reclaim your admin time.',
    cta: 'Set Up Your Booking Page',
    features: [
      'Online self-booking',
      'Calendar sync',
      'SMS/email reminders',
      'Payment collection',
      'No-show protection'
    ],
    color: 'pink'
  },

  reviewboost: {
    slug: 'reviewboost',
    title: 'ReviewBoost',
    headline: 'More 5-Star Reviews on Autopilot',
    subheadline: 'Happy customers leave reviews. You just need to ask them at the right time.',
    problem: 'You have hundreds of satisfied customers but only a handful of reviews. Competitors with worse service outrank you because they have more Google stars. Asking for reviews feels pushy.',
    solution: 'ReviewBoost sends perfectly timed review requests after positive interactions. Unhappy customers get routed to support instead. Watch your ratings climb while you focus on service.',
    cta: 'Start Collecting Reviews',
    features: [
      'Automated review requests',
      'Smart timing engine',
      'Sentiment filtering',
      'Multi-platform support',
      'Review monitoring'
    ],
    color: 'yellow'
  },

  contractsafe: {
    slug: 'contractsafe',
    title: 'ContractSafe',
    headline: 'Never Miss a Contract Renewal Again',
    subheadline: 'All your contracts in one place. Renewal alerts before auto-renew traps.',
    problem: 'Software subscriptions, leases, supplier contracts—all with different renewal dates. You find out about auto-renewals when the invoice hits. Renegotiation windows pass unnoticed.',
    solution: 'ContractSafe stores all your contracts with key dates extracted automatically. Alerts before renewal windows close. Track spend by category. Cancel or renegotiate in time.',
    cta: 'Upload Your Contracts',
    features: [
      'Contract repository',
      'Auto date extraction',
      'Renewal alerts',
      'Spend tracking',
      'Team access controls'
    ],
    color: 'zinc'
  },

  hireright: {
    slug: 'hireright',
    title: 'HireRight',
    headline: 'Reference Checks in Hours, Not Weeks',
    subheadline: 'Automated reference collection with fraud detection. Hire with confidence.',
    problem: 'Your top candidate is waiting while you chase referees by phone. References take weeks. Some are fake—friends posing as managers. Bad hires cost thousands.',
    solution: 'HireRight sends digital reference requests that referees complete on any device. Identity verification flags suspicious responses. Standardized questions enable comparison. Decide faster.',
    cta: 'Verify Your Candidates',
    features: [
      'Automated outreach',
      'Digital reference forms',
      'Fraud detection',
      'Completion tracking',
      'ATS integration'
    ],
    color: 'blue'
  },

  safetyinduct: {
    slug: 'safetyinduct',
    title: 'SafetyInduct',
    headline: 'Site Inductions That Scale',
    subheadline: 'Contractors complete safety training before they arrive. Every time.',
    problem: 'Every new contractor means 30 minutes of site induction. Multiply by dozens of visitors per week. Records scattered across sign-in sheets. HSE asks who was trained when—you cannot answer.',
    solution: 'SafetyInduct delivers site-specific safety videos and quizzes before arrival. Digital certificates prove completion. Visitor logs with training status. HSE-ready records instantly.',
    cta: 'Build Your Induction',
    features: [
      'Video induction courses',
      'Knowledge quizzes',
      'Digital certificates',
      'Visitor pre-registration',
      'Compliance reporting'
    ],
    color: 'orange'
  },

  quotecraft: {
    slug: 'quotecraft',
    title: 'QuoteCraft',
    headline: 'Quotes That Win More Work',
    subheadline: 'Professional proposals in minutes. Track opens. Know when to follow up.',
    problem: 'You spend hours on quotes that disappear into email voids. No idea if prospects even opened them. Following up feels like guessing. You lose work to faster competitors.',
    solution: 'QuoteCraft generates professional, branded quotes from templates. Track when they are viewed. Automatic follow-up reminders. E-signature built in. Close deals faster.',
    cta: 'Create Your First Quote',
    features: [
      'Branded templates',
      'View tracking',
      'Follow-up automation',
      'E-signature',
      'CRM integration'
    ],
    color: 'emerald'
  }
}

export function getIdea(slug: string): Idea | null {
  return ideas[slug] || null
}

export function getAllIdeas(): Idea[] {
  return Object.values(ideas)
}
