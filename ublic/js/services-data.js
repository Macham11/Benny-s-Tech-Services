// Built-in list of services (moves to Supabase in Stage 4)
// category: jamb | exam | docs | other
// trending: true means it also shows in "Trending Services"

const SERVICES = [
  // JAMB
  { id: 1, title: "JAMB Admission Acceptance", category: "jamb", trending: true,
    description: "Get help accepting your JAMB admission on the portal." },
  { id: 2, title: "JAMB Online Registration", category: "jamb", trending: false,
    description: "Online registration help for JAMB." },
  { id: 3, title: "JAMB Result Checking", category: "jamb", trending: true,
    description: "Check your JAMB result online." },

  // Exam cards and results
  { id: 4, title: "WAEC Scratch Card", category: "exam", trending: true,
    description: "Buy your WAEC scratch card here." },
  { id: 5, title: "NECO Scratch Card", category: "exam", trending: true,
    description: "Buy your NECO scratch card here." },
  { id: 6, title: "NECO e-Verification Pin", category: "exam", trending: false,
    description: "Buy a NECO e-verification pin." },
  { id: 7, title: "NABTEB Scratch Card", category: "exam", trending: true,
    description: "Buy your NABTEB scratch card here." },
  { id: 8, title: "WAEC Result Checking", category: "exam", trending: true,
    description: "Check your WAEC result online." },
  { id: 9, title: "NECO Result Checking", category: "exam", trending: true,
    description: "Check your NECO result online." },
  { id: 10, title: "NABTEB Result Checking", category: "exam", trending: true,
    description: "Check your NABTEB result online." },

  // Documents and printing
  { id: 11, title: "Typing", category: "docs", trending: true,
    description: "Neat and accurate typing of your documents." },
  { id: 12, title: "CV / Resume Creation", category: "docs", trending: true,
    description: "A clean, professional CV or resume for your job search." },
  { id: 13, title: "Report Writing", category: "docs", trending: false,
    description: "Help with writing and arranging reports." },
  { id: 14, title: "Application Letter Writing", category: "docs", trending: true,
    description: "Application letters for jobs, schools and more." },
  { id: 15, title: "Typesetting", category: "docs", trending: true,
    description: "Neat typesetting and layout of your documents." },
  { id: 16, title: "Printing", category: "docs", trending: true,
    description: "Printing of your documents." },
  { id: 17, title: "Photocopying", category: "docs", trending: false,
    description: "Photocopying of your documents." },

  // Other
  { id: 18, title: "Online Registrations", category: "other", trending: true,
    description: "Help with all kinds of online registrations." },
  { id: 19, title: "Computer Training", category: "other", trending: true,
    description: "Learn computer skills with practical training." }
];
