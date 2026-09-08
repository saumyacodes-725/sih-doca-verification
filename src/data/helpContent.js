// Knowledge base for the in-portal Help Assistant (src/components/common/HelpChatBot.jsx).
// Two parts: PAGE_HELP (contextual "what do I do here" guidance keyed by route)
// and FAQ_ENTRIES (keyword-matched answers for free-text questions).

// Ordered most-specific-first so dynamic segments (":id") match before their
// parent list route does.
export const PAGE_HELP = [
  {
    match: (path) => path === '/',
    title: 'Home',
    icon: 'bi-house-door-fill',
    summary: 'The public landing page for the Trust Scale portal.',
    steps: [
      'Use "Verify Certificate" to check if a shop\'s weighing/measuring instrument is legally certified.',
      'Use the QR Scan button in the top bar to scan a stamping QR code with your camera.',
      'Click "Portal Login / Role Switcher" to sign in as a Trader, LMO Officer, GATC Lab, or Admin.'
    ],
    links: [
      { label: 'Verify a certificate', path: '/verify' },
      { label: 'Login / switch role', path: '/login' }
    ]
  },
  {
    match: (path) => path === '/verify',
    title: 'Verify Certificate',
    icon: 'bi-shield-check',
    summary: 'Anyone can check whether an instrument\'s verification certificate is valid — no login needed.',
    steps: [
      'Type the certificate ID or stamping seal number printed on the instrument, or use QR Scan to read it with your camera.',
      'Submit to see live status: VALID (green), EXPIRED, or REVOKED.',
      'This is the only fully public, unauthenticated lookup in the portal — no other certificates are listable.'
    ]
  },
  {
    match: (path) => /^\/certificate\//.test(path),
    title: 'Certificate Result',
    icon: 'bi-patch-check-fill',
    summary: 'Shows the outcome of a certificate lookup — this is also where a scanned QR code lands.',
    steps: [
      'Green "VALID" means the instrument passed verification and is within its validity period.',
      'Check the instrument details, LMO officer, and issue/expiry dates shown on the card.',
      'If the result looks wrong, report it via the National Consumer Helpline (1915) shown in the header.'
    ]
  },
  {
    match: (path) => path === '/login',
    title: 'Login / Role Switcher',
    icon: 'bi-box-arrow-in-right',
    summary: 'Sign in with a real account, or use the one-click demo role cards to explore each portal.',
    steps: [
      'Pick a role card (Trader, LMO Officer, GATC Lab, Admin) to instantly log in with a seeded demo account.',
      'Or enter your own email/password if you already registered a business account.',
      'You can switch roles anytime from the ROLE buttons in the header, or the workflow guide bar at the top.'
    ]
  },

  // Business / Trader
  {
    match: (path) => path === '/business',
    title: 'Trader Dashboard',
    icon: 'bi-speedometer2',
    summary: 'Your overview as a business owner — instrument counts, pending applications, and recent certificates.',
    steps: [
      'Start with "Register Instrument" if this is a new weighing/measuring device you own.',
      'Already registered? Go to "Apply for Verification" to submit it for statutory inspection.',
      'Track progress under "Verification Applications", and download issued certificates under "Certificates & Stamping".'
    ],
    links: [
      { label: 'Register an instrument', path: '/business/register' },
      { label: 'Apply for verification', path: '/business/apply' }
    ]
  },
  {
    match: (path) => path === '/business/instruments',
    title: 'My Instruments',
    icon: 'bi-box-seam',
    summary: 'Every weighing/measuring instrument you\'ve registered, with its current certification status.',
    steps: [
      'Click any instrument row to see its full details and verification history.',
      'No instrument yet? Use "Register Instrument" to add one before applying for verification.'
    ]
  },
  {
    match: (path) => /^\/business\/instruments\//.test(path),
    title: 'Instrument Details',
    icon: 'bi-box-seam',
    summary: 'Full record for one instrument — specs, GPS location, and its verification/certificate history.',
    steps: [
      'If it needs verification, use "Apply for Verification" from the dashboard and select this instrument.',
      'Certificate history here links out to the full certificate view once issued.'
    ]
  },
  {
    match: (path) => path === '/business/register',
    title: 'Register Instrument',
    icon: 'bi-plus-circle',
    summary: 'Add a new weighing or measuring instrument to your business profile.',
    steps: [
      'Fill in the instrument type, make/model, capacity, and serial number exactly as printed on the device.',
      'Set the installation GPS location — the LMO uses this to plan the field inspection.',
      'Submit to save it under "My Instruments"; you can then apply for verification.'
    ]
  },
  {
    match: (path) => path === '/business/applications',
    title: 'Verification Applications',
    icon: 'bi-file-earmark-text',
    summary: 'All the verification requests you\'ve submitted and where each one stands.',
    steps: [
      'Status moves through: Submitted → Fee Paid → Scheduled → Inspected → Certified (or Rejected).',
      'Click an application to see assigned LMO, inspection date, and any inspection notes.'
    ]
  },
  {
    match: (path) => path === '/business/apply',
    title: 'Apply for Verification',
    icon: 'bi-patch-plus',
    summary: 'Submit a verification request for one of your registered instruments.',
    steps: [
      'Select the instrument you want verified.',
      'Review the statutory fee and confirm the simulated Bharatkosh payment.',
      'After submission, an admin will assign an LMO officer and confirm an inspection date — track it under "Verification Applications".'
    ]
  },
  {
    match: (path) => path === '/business/certificates',
    title: 'Certificates & Stamping',
    icon: 'bi-award',
    summary: 'Every certificate issued to your instruments, with QR codes for public verification.',
    steps: [
      'Download or print a certificate for display at your business premises.',
      'Share the QR code — anyone can scan it to confirm the instrument is currently valid.',
      'Watch expiry dates here so you can re-apply for verification before a certificate lapses.'
    ]
  },
  {
    match: (path) => path === '/business/profile',
    title: 'Profile & Alerts',
    icon: 'bi-person-badge',
    summary: 'Your business/trader account details and notification preferences.',
    steps: [
      'Keep your GSTIN, address, and contact details current — LMOs and admins use this for inspections.',
      'Check notification alerts here for upcoming inspections or expiring certificates.'
    ]
  },

  // LMO
  {
    match: (path) => path === '/lmo',
    title: 'LMO Officer Dashboard',
    icon: 'bi-speedometer2',
    summary: 'Your field enforcement overview — assigned inspections and roster at a glance.',
    steps: [
      '"Assigned Verifications" lists every inspection routed to you that still needs action.',
      '"My Inspection Roster" shows your scheduled visits by date.',
      'Open an assigned application and use the field checklist to record the inspection and issue a seal.'
    ]
  },
  {
    match: (path) => path === '/lmo/assigned',
    title: 'Assigned Verifications',
    icon: 'bi-list-check',
    summary: 'Instruments awaiting your field inspection.',
    steps: [
      'Click an entry to open the digital inspection checklist for that application.',
      'Applications disappear from this list once you complete and submit the inspection.'
    ]
  },
  {
    match: (path) => /^\/lmo\/inspect/.test(path),
    title: 'Field Digital Checklist & Stamping',
    icon: 'bi-tools',
    summary: 'Run the Maximum Permissible Error (MPE) test table and record the inspection outcome.',
    steps: [
      'Enter each test-point reading in the MPE table; the system flags any out-of-tolerance result automatically.',
      'Upload evidence photos of the instrument and the test setup.',
      'Mark PASS or FAIL — a PASS applies a stamping seal (e.g. LM-DL-2026-XXXX) and issues the certificate automatically.'
    ]
  },
  {
    match: (path) => path === '/lmo/schedule',
    title: 'My Inspection Roster',
    icon: 'bi-calendar3',
    summary: 'Your upcoming and past inspection appointments by date.',
    steps: [
      'Use this to plan field visits — each entry links back to that application\'s checklist.'
    ]
  },

  // GATC
  {
    match: (path) => path === '/gatc',
    title: 'GATC Lab Dashboard',
    icon: 'bi-speedometer2',
    summary: 'Overview for the Government Approved Test Centre lab.',
    steps: [
      'Open "Metrology Test Bench" for instruments routed to your lab for detailed testing.'
    ]
  },
  {
    match: (path) => /^\/gatc\/test/.test(path),
    title: 'Metrology Test Bench',
    icon: 'bi-cpu',
    summary: 'Record detailed lab test results for an instrument referred to GATC.',
    steps: [
      'Enter the precision test measurements requested for this instrument type.',
      'Submit the report — it feeds back into the application\'s verification record.'
    ]
  },

  // Admin
  {
    match: (path) => path === '/admin',
    title: 'National Admin Dashboard',
    icon: 'bi-speedometer2',
    summary: 'National-level overview: applications, instruments, certificates, and system health.',
    steps: [
      'Use "Applications Desk" to review new submissions and assign an LMO + inspection date.',
      '"Analytics" gives portal-wide trends; "Audit Ledger" gives a full activity trail.'
    ]
  },
  {
    match: (path) => path === '/admin/applications',
    title: 'Applications Desk',
    icon: 'bi-inbox-fill',
    summary: 'Review incoming verification applications and route them to the field.',
    steps: [
      'Open a pending application, assign an available LMO officer, and confirm an inspection date.',
      'Once scheduled, the trader and LMO are notified automatically.'
    ]
  },
  {
    match: (path) => path === '/admin/instruments',
    title: 'Instruments Registry',
    icon: 'bi-database',
    summary: 'The full national registry of every registered instrument.',
    steps: [
      'Use this to search/audit instruments across all traders, not just your own.'
    ]
  },
  {
    match: (path) => path === '/admin/stakeholders',
    title: 'Stakeholders',
    icon: 'bi-people-fill',
    summary: 'Directory of traders, LMO officers, and GATC labs registered in the system.',
    steps: [
      'Use this to look up contact details or check officer workload before assigning inspections.'
    ]
  },
  {
    match: (path) => path === '/admin/scheduling',
    title: 'Dispatch & Schedule',
    icon: 'bi-calendar-event',
    summary: 'Coordinate inspection scheduling across all LMO officers.',
    steps: [
      'Check officer availability here before confirming a date on the Applications Desk.'
    ]
  },
  {
    match: (path) => path === '/admin/certificates',
    title: 'Certificates & Revocation',
    icon: 'bi-award-fill',
    summary: 'Every certificate issued nationally — search, inspect, or revoke one if needed.',
    steps: [
      'Revoking a certificate immediately marks it invalid for the public QR-verification lookup.',
      'Use this only for confirmed compliance issues — revocation is visible in the audit ledger.'
    ]
  },
  {
    match: (path) => path === '/admin/analytics',
    title: 'Analytics',
    icon: 'bi-graph-up-arrow',
    summary: 'Portal-wide charts on verification volume, pass/fail rates, and certificate status.',
    steps: []
  },
  {
    match: (path) => path === '/admin/logs',
    title: 'Audit Ledger',
    icon: 'bi-journal-text',
    summary: 'A chronological record of every significant action taken in the portal.',
    steps: [
      'Use this to trace who assigned, inspected, certified, or revoked any given application or certificate.'
    ]
  }
];

export function getPageHelp(pathname) {
  return PAGE_HELP.find((entry) => entry.match(pathname)) || {
    title: 'This page',
    icon: 'bi-question-circle',
    summary: 'I don\'t have specific notes for this screen yet, but I can still help with general portal questions.',
    steps: []
  };
}

// Free-text FAQ, matched by keyword overlap in HelpChatBot's simple search.
export const FAQ_ENTRIES = [
  {
    keywords: ['register', 'add instrument', 'new instrument', 'new scale', 'new weighing'],
    question: 'How do I register a new instrument?',
    answer: 'Go to Business Dashboard → "Register Instrument", fill in the type, make/model, capacity, serial number, and installation GPS location, then submit.',
    links: [{ label: 'Register Instrument', path: '/business/register' }]
  },
  {
    keywords: ['apply', 'verification', 'submit application', 'apply for verification'],
    question: 'How do I apply for verification?',
    answer: 'From the Trader Dashboard, open "Apply for Verification", pick the instrument, confirm the fee payment, and submit. An admin will then assign an LMO and inspection date.',
    links: [{ label: 'Apply for Verification', path: '/business/apply' }]
  },
  {
    keywords: ['fee', 'payment', 'bharatkosh', 'pay', 'cost'],
    question: 'How does the verification fee work?',
    answer: 'The statutory fee is shown when you apply for verification, and payment is confirmed via a simulated Bharatkosh gateway in this demo portal before your application is submitted.'
  },
  {
    keywords: ['status', 'track', 'where is my application', 'application status'],
    question: 'How do I track my application status?',
    answer: 'Open "Verification Applications" from the Trader Dashboard. Status moves through Submitted → Fee Paid → Scheduled → Inspected → Certified (or Rejected).',
    links: [{ label: 'Verification Applications', path: '/business/applications' }]
  },
  {
    keywords: ['certificate', 'download certificate', 'print certificate', 'qr code'],
    question: 'Where do I find or download my certificate?',
    answer: 'Go to "Certificates & Stamping" under your Trader menu. Each issued certificate has a QR code you can print and display, and the public can scan it to verify validity.',
    links: [{ label: 'Certificates & Stamping', path: '/business/certificates' }]
  },
  {
    keywords: ['verify', 'check certificate', 'is this valid', 'scan qr', 'qr scan'],
    question: 'How do I verify someone else\'s certificate?',
    answer: 'Use "Verify Certificate" (or the QR Scan button in the header) — enter the certificate/seal ID or scan the QR code. No login is required for this.',
    links: [{ label: 'Verify Certificate', path: '/verify' }]
  },
  {
    keywords: ['inspect', 'inspection', 'mpe', 'checklist', 'stamping', 'seal'],
    question: 'How does the LMO field inspection work?',
    answer: 'An LMO opens the assigned application\'s "Field Digital Checklist", records MPE test-point readings and photo evidence, then marks PASS or FAIL. A PASS applies a stamping seal and auto-issues the certificate.',
    links: [{ label: 'Assigned Verifications', path: '/lmo/assigned' }]
  },
  {
    keywords: ['assign', 'schedule', 'dispatch', 'lmo officer'],
    question: 'How are applications assigned to an LMO?',
    answer: 'An admin reviews new submissions on the "Applications Desk", assigns an available LMO officer, and confirms the inspection date.',
    links: [{ label: 'Applications Desk', path: '/admin/applications' }]
  },
  {
    keywords: ['revoke', 'invalidate', 'cancel certificate'],
    question: 'How do I revoke a certificate?',
    answer: 'Admins can revoke a certificate from "Certificates & Revocation". Revoking it immediately marks the certificate invalid for public QR verification.',
    links: [{ label: 'Certificates & Revocation', path: '/admin/certificates' }]
  },
  {
    keywords: ['login', 'log in', 'sign in', 'role', 'switch role', 'demo account'],
    question: 'How do I log in or switch roles?',
    answer: 'Go to the Login page and pick a demo role card (Trader, LMO Officer, GATC Lab, Admin) for an instant demo login, or enter your own account credentials. You can also switch roles from the ROLE buttons in the header.',
    links: [{ label: 'Login / Role Switcher', path: '/login' }]
  },
  {
    keywords: ['gatc', 'lab test', 'lab bench', 'test bench'],
    question: 'What does the GATC lab do?',
    answer: 'GATC (Government Approved Test Centre) runs detailed precision lab tests for instruments referred to it, recorded on the "Metrology Test Bench" page.',
    links: [{ label: 'Metrology Test Bench', path: '/gatc' }]
  },
  {
    keywords: ['audit', 'log', 'history', 'who did this'],
    question: 'Where can I see a history of actions?',
    answer: 'The "Audit Ledger" (Admin menu) shows a chronological record of every significant action — assignments, inspections, certifications, and revocations.',
    links: [{ label: 'Audit Ledger', path: '/admin/logs' }]
  },
  {
    keywords: ['expire', 'expiry', 'renew', 'reapply'],
    question: 'What happens when a certificate expires?',
    answer: 'An expired certificate shows as EXPIRED on public verification. Re-apply for verification on the instrument before expiry to keep it continuously valid.',
    links: [{ label: 'Apply for Verification', path: '/business/apply' }]
  },
  {
    keywords: ['help', 'contact', 'support', 'complaint', 'helpline'],
    question: 'How do I get further help or file a complaint?',
    answer: 'Call the National Consumer Helpline at 1915 (shown in the top bar), or use "Verify Certificate" first to confirm an instrument\'s status before raising a complaint.'
  },
  {
    keywords: ['reset', 'demo data', 'restore data'],
    question: 'How do I reset the demo data?',
    answer: 'Use "Reset Portal Data" in the workflow guide bar at the very top of the screen — it restores the portal database to its default demo state.'
  }
];

export function searchFaq(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);

  const scored = FAQ_ENTRIES.map((entry) => {
    let score = 0;
    const haystack = [entry.question.toLowerCase(), ...entry.keywords].join(' ');
    entry.keywords.forEach((kw) => {
      if (q.includes(kw)) score += 3;
    });
    words.forEach((w) => {
      if (w.length > 2 && haystack.includes(w)) score += 1;
    });
    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.entry);
}
