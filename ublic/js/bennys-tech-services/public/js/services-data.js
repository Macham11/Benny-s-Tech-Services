// BACKUP list of services.
// The website normally loads services from Supabase (through /api/services).
// This list is only used if the database cannot be reached.
// category: cyber-cafe | business-centre | scratch-cards | training
// section:  jamb | exam | docs | null  (which block on the home page)

const FALLBACK_SERVICES = [
  { id: 1, title: "JAMB Admission Acceptance", category: "cyber-cafe", section: "jamb", trending: true,
    description: "Get help accepting your JAMB admission on the portal." },
  { id: 2, title: "JAMB Online Registration", category: "cyber-cafe", section: "jamb", trending: false,
    description: "Online registration help for JAMB." },
  { id: 3, title: "JAMB Result Checking", category: "cyber-cafe", section: "jamb", trending: false,
    description: "Check your JAMB result online." },
  { id: 4, title: "WAEC Scratch Card", category: "scratch-cards", section: "exam", trending: true,
    description: "Buy your WAEC scratch card here." },
  { id: 5, title: "NECO Scratch Card", category: "scratch-cards", section: "exam", trending: true,
    description: "Buy your NECO scratch card here." },
  { id: 6, title: "NECO e-Verification Pin", category: "scratch-cards", section: "exam", trending: false,
    description: "Buy a NECO e-verification pin." },
  { id: 7, title: "NABTEB Scratch Card", category: "scratch-cards", section: "exam", trending: false,
    description: "Buy your NABTEB scratch card here." },
  { id: 8, title: "WAEC Result Checking", category: "cyber-cafe", section: "exam", trending: false,
    description: "Check your WAEC result online." },
  { id: 9, title: "NECO Result Checking", category: "cyber-cafe", section: "exam", trending: false,
    description: "Check your NECO result online." },
  { id: 10, title: "NABTEB Result Checking", category: "cyber-cafe", section: "exam", trending: false,
    description: "Check your NABTEB result online." },
  { id: 11, title: "Typing", category: "business-centre", section: "docs", trending: true,
    description: "Neat and accurate typing of your documents." },
  { id: 12, title: "CV / Resume Creation", category: "business-centre", section: "docs", trending: true,
    description: "A clean, professional CV or resume for your job search." },
  { id: 13, title: "Report Writing", category: "business-centre", section: "docs", trending: false,
    description: "Help with writing and arranging reports." },
  { id: 14, title: "Application Letter Writing", category: "business-centre", section: "docs", trending: false,
    description: "Application letters for jobs, schools and more." },
  { id: 15, title: "Typesetting", category: "business-centre", section: "docs", trending: false,
    description: "Neat typesetting and layout of your documents." },
  { id: 16, title: "Printing", category: "business-centre", section: "docs", trending: false,
    description: "Printing of your documents." },
  { id: 17, title: "Photocopying", category: "business-centre", section: "docs", trending: false,
    description: "Photocopying of your documents." },
  { id: 18, title: "Online Registrations", category: "cyber-cafe", section: null, trending: true,
    description: "Help with all kinds of online registrations." },
  { id: 19, title: "Computer Training", category: "training", section: null, trending: true,
    description: "Learn computer skills with practical training." }
];
