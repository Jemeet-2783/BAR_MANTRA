/**
 * Barmantra — Master Mock Data & Service Catalogs
 */


import { Service, PortfolioItem, Testimonial, TeamMember, FAQItem, ProcessStep } from './types';

export const SERVICES: Service[] = [
  {
    slug: 'wedding-bar',
    title: 'Royal Wedding Bar Curation',
    iconName: 'Heart',
    description: 'Luxury wedding mobile bar styling, royal themed menus, and bespoke mixology for high-end celebrations.',
    longDescription: 'We transform your wedding beverage service into an exquisite, royal experience. Drawing inspiration from Jaipur\'s rich heritage, we infuse authentic Rajasthani royal ingredients—such as saffron, organic marigolds, cardamom, and local rose water—with international premium spirits. Every custom drink is styled to reflect your unique style, ensuring a flawless, premium bar experience that your guests will talk about for years.',
    features: [
      'Royal Palace & Heritage Venue Bar Curation',
      'Saffron & Local Herb Infused Signature Cocktails',
      'Personalized Laser-Etched Clear Ice Spheres',
      'Elite Uniformed Palace-Style Bartenders',
      'Bespoke Glassware & Antique Brass Bar Accents',
      'High-Velocity Service for 500+ Guests with Absolute Perfection'
    ],
    images: [
      'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=1200&q=80', // Royal wedding lighting/vibe
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'  // Wedding couple royal vibe
    ],
    timeline: [
      { title: 'Vision & Concept', description: 'Interactive design sessions to map out theme, colors, and signature drink palettes.' },
      { title: 'Spirit & Flavor Selection', description: 'Curating premium spirits and handcrafting native Rajasthani botanical infusions.' },
      { title: 'Bar Counter Design', description: 'Designing the custom bar facade (jaali screen or royal brass) to match your wedding decor.' },
      { title: 'On-Ground Execution', description: 'Flawless service delivery by our team of certified mixologists and bar backs.' }
    ]
  },
  {
    slug: 'corporate-bar',
    title: 'Corporate Lounges & Brand Bars',
    iconName: 'Briefcase',
    description: 'Sophisticated corporate cocktail lounges, branded ice-sculptures, and high-volume premium drink service.',
    longDescription: 'Where corporate professionalism meets Rajasthani hospitality. Whether launching a premium product, hosting an international delegation, or celebrating a major corporate milestone, Barmantra designs immersive bar experiences that align perfectly with your brand identity, incorporating custom company branded ice logos, state-of-the-art smoke-infusions, and rapid service.',
    features: [
      'Laser-Etched Corporate Logo Ice Blocks',
      'Sophisticated Smoke & Oak Infused Craft Bars',
      'Rapid-Pour Custom Draft Cocktail Stations',
      'Choreographed Premium Flair Bar Shows',
      'Premium Single-Malt & Cigar Lounge Pairings',
      'Interactive DIY Mixology Stations for Networking'
    ],
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', // Corporate event lighting
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80'  // Gala dinner
    ],
    timeline: [
      { title: 'Brand Briefing', description: 'Integrating your corporate identity and brand colors into the drink concepts.' },
      { title: 'Custom Ice & Tool Mockups', description: 'Designing custom logo molds for the clear ice blocks.' },
      { title: 'Menu Optimization', description: 'Selecting crowd-pleasing, high-speed recipes without compromising quality.' },
      { title: 'Flawless Execution', description: 'High-volume professional service delivering precision pours under pressure.' }
    ]
  },
  {
    slug: 'private-bar',
    title: 'Private Parties & Craft Cocktail Bars',
    iconName: 'GlassWater',
    description: 'From silver jubilees to high-profile soirées, we craft intimate and grand private bars that tell your personal story.',
    longDescription: 'Life\'s greatest milestones deserve an extraordinary beverage curation. We specialize in planning luxury private events—anniversaries, landmark birthdays, and theme dinners. With an emphasis on personalization and sophisticated drink lists, we curate custom mobile settings, gourmet garnish selections, and interactive cocktail pairings.',
    features: [
      'Bespoke Thematic Cocktail Menu Design',
      'Exclusive Villa, Haveli & Private Garden Sourcing',
      'Artisanal Garnishes and Native Herb Syrups',
      'Interactive DIY Cocktail Stations',
      'Discreet, Highly Attentive Butler-Style Service',
      'Sitar-Accompanied Traditional Welcome Aperitifs'
    ],
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', // Elegant table setup
      'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=1200&q=80'  // Fairy lights celebration
    ],
    timeline: [
      { title: 'Story Discovery', description: 'Defining a unique drink menu that highlights the celebrant\'s favorite flavors.' },
      { title: 'Venue Coordination', description: 'Adapting our mobile bar setups to private havelis, gardens, or modern hideaways.' },
      { title: 'Garnish & Prep', description: 'Preparing hand-cut organic garnishes and bespoke cocktail syrups.' },
      { title: 'The Soirée', description: 'Attentive, warm hospitality where guests receive bespoke, personalized drinks.' }
    ]
  },
  {
    slug: 'bar-styling',
    title: 'Mobile Bar Styling & Themes',
    iconName: 'Layers',
    description: 'Transforming raw bar counters into breathtaking visual masterpieces utilizing luxury silks, marigolds, and royal structures.',
    longDescription: 'Visual storytelling behind the bar. Our in-house design team styles immersive bar backdrops and facades that evoke specific emotions. Specializing in royal Rajasthani concepts—such as Sheesh Mahal mirror work, royal darbars, and elaborate floral installations using local marigolds and custom brass backdrops—we turn any beverage station into a dream-like royal oasis.',
    features: [
      'Handcrafted Rajasthani Jaali & Royal Arch Bar Facades',
      'Bespoke Floral Sculpting & Hanging Bar Installations',
      'Custom Luxury Textile Sourcing for Bar Skirting',
      'Traditional Vintage Brass Candleholders and Ornaments',
      'Thematic Glassware, Copper Vessels, and Custom Coasters',
      'Dynamic Ambient Lighting Tailored to the Bar Theme'
    ],
    images: [
      'https://images.unsplash.com/photo-1595188384244-c3a17412000e?auto=format&fit=crop&w=1200&q=80', // Golden arch palace decor
      'https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&w=1200&q=80'  // Floral elements
    ],
    timeline: [
      { title: 'Sketching & 3D Renders', description: 'Developing 3D mockups of the custom bar facade.' },
      { title: 'Floral & Prop Sourcing', description: 'Importing premium glassware and vintage brass accents.' },
      { title: 'Fabrication', description: 'Constructing custom bar screens in our Jaipur workshop.' },
      { title: 'Setup & Calibration', description: 'Assembling the bar backdrop and adjusting focal spot lighting.' }
    ]
  },
  {
    slug: 'flair-bar',
    title: 'Flair Bartending & Bar Shows',
    iconName: 'Sparkles',
    description: 'Bringing the soul of celebration alive with elite tandem flair shows, fire performance, and energetic craft showmanship.',
    longDescription: 'Showmanship is the heartbeat of any Barmantra experience. We boast an elite team of award-winning flair bartenders, tandem fire performers, and master mixologists. We coordinate the entire performance flow, music synchronization, and safety protocols, delivering an electrifying and unforgettable show behind the bar.',
    features: [
      'Award-Winning Tandem Flair Bartending',
      'Thrilling Liquid Nitrogen & Fire Bar Shows',
      'High-Energy Music Synchronized Pour Sequences',
      'Interactive Guest Pour & Cocktail Challenges',
      'Safety-Certified Indoor Pyrotechnic Effects',
      'Custom Branded Shakers & Light-Up Bar Elements'
    ],
    images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80', // Live performance singer
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'  // Sound & lights
    ],
    timeline: [
      { title: 'Choreography Mapping', description: 'Designing the show timing to match the peak energy of your party.' },
      { title: 'Music Sync', description: 'Coordinating sound cues and lighting sequences with the main DJ.' },
      { title: 'Safety Inspection', description: 'Auditing bar layout for safe fire-flair and pyro execution.' },
      { title: 'Showtime!', description: 'An electrifying performance that captures everyone\'s attention.' }
    ]
  },
  {
    slug: 'menu-curation',
    title: 'Bespoke Mixology & Menu Curations',
    iconName: 'Wine',
    description: 'Curating culinary beverage journeys that merge rich Rajasthani royal ingredients with international craft spirits.',
    longDescription: 'A royal welcome is central to Rajasthani culture. We partner with India\'s premier mixology consultants to curate a beverage menu that is both a visual art and a sensory masterpiece. From molecular gastronomy elements to traditional, slow-infused heritage recipes served in earthen kulhads, we customize every recipe to absolute perfection.',
    features: [
      'Authentic Saffron, Rose, & Cardamom Syrup Formulas',
      'Molecular Mixology, Foams, & Fruit Pearls',
      'Traditional Earthen Kulhad-Style Cocktail Pours',
      'Artisanal Clear Ice Block Carving',
      'Custom Handprinted Recipe Cards for Guests',
      'Organic & Edible Gold Leaf Drink Garnishes'
    ],
    images: [
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80', // Table spread high-end
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'  // Catering glassware setup
    ],
    timeline: [
      { title: 'Tasting & Development', description: 'Collaborative tasting sessions to perfect the flavor balances.' },
      { title: 'Recipe Calibration', description: 'Scaling formulas for consistent quality across hundreds of pours.' },
      { title: 'Ingredient Infusion', description: 'Pre-infusing spirits and crafting bespoke organic syrups.' },
      { title: 'The Pours', description: 'Serving beautifully garnished, conceptual drinks with a story.' }
    ]
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'The Saffron Court Bar at City Palace',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1542849187-5ec6ea5e6a27?auto=format&fit=crop&w=800&q=80',
    location: 'City Palace, Jaipur',
    date: 'December 2025',
    description: 'A royal wedding mobile bar featuring deep crimson styling, saffron-infused gin cocktails, and bespoke hand-engraved clear ice blocks for 500 elite guests.'
  },
  {
    id: 'port-2',
    title: 'Modern Royal Lounge at Rambagh Palace',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=800&q=80',
    location: 'Rambagh Palace, Jaipur',
    date: 'November 2025',
    description: 'An elite corporate banquet bar. Merged high-tech LED bar facades with custom whiskey infusions and premium crystal glassware.'
  },
  {
    id: 'port-3',
    title: 'The Marigold Canopy Beer & Cocktail Bar',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    location: 'Samode Palace, Jaipur',
    date: 'January 2026',
    description: 'An outdoor garden wedding mehendi bar decorated with 10,000 meters of hand-strung marigolds, serving traditional cardamom-infused aperitifs in earthen kulhads.'
  },
  {
    id: 'port-4',
    title: 'High-Velocity Car Launch Cocktail Bar',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    location: 'Jaipur Exhibition & Convention Centre',
    date: 'October 2025',
    description: 'A high-impact vehicle launch bar utilizing laser-lit backdrops, dry-ice smoked craft cocktails, and high-speed tandem flair bar shows.'
  },
  {
    id: 'port-5',
    title: 'A Golden Sitar Whiskey Tasting Lounge',
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    location: 'Private Heritage Haveli, Raja Park',
    date: 'February 2026',
    description: 'An intimate private haveli celebration featuring slow-aged single malt whiskey tastings paired with native Rajasthani spices and live classical sitar music.'
  },
  {
    id: 'port-6',
    title: 'Jaipur Literature Festival VIP Craft Bar',
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80',
    location: 'Diggi Palace, Jaipur',
    date: 'March 2026',
    description: 'A lively, premium VIP festival craft bar. Showcased local botanical distillates, organic marigold-honey syrups, and zero-waste edible flower garnishes.'
  },
  {
    id: 'port-7',
    title: 'Emerald Sufi Night Absinthe & Cocktail Bar',
    category: 'guest-experiences',
    image: 'https://images.unsplash.com/photo-1542849187-5ec6ea5e6a27?auto=format&fit=crop&w=800&q=80',
    location: 'Chomu Palace Resort, Jaipur',
    date: 'November 2025',
    description: 'A magical emerald-themed sangeet bar in a historic palace courtyard, filled with hundred brass lamps, serving premium signature rose-water cocktails.'
  },
  {
    id: 'port-8',
    title: 'Milestone Summit Golden Martini Bar',
    category: 'guest-experiences',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    location: 'Marriott Hotel, Jaipur',
    date: 'September 2025',
    description: 'An elegant award ceremony martini bar for 300 international delegates, featuring custom-carved floating ice logos and choreographed cocktail showmanship.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Aditya & Riya Singhania',
    eventType: 'Royal Wedding Bar Curation',
    rating: 5,
    quote: 'Choosing Barmantra was the best decision we made. They turned our Rambagh Palace wedding bar into an ethereal wonderland. The level of detail—from the saffron-infused cocktails to the custom laser-stamped clear ice spheres—was absolute royalty. Truly the gold standard of luxury bar experiences!',
    date: 'December 2025'
  },
  {
    id: 'test-2',
    name: 'Vikramjit Sahani',
    eventType: 'TechCorp India Corporate Bar',
    rating: 5,
    quote: 'Absolute precision and unmatched mixology. Barmantra executed our regional brand launch bar flawlessly. They understood our brand identity perfectly, integrating corporate logos into clear ice blocks and delivering high-volume service seamlessly.',
    date: 'November 2025'
  },
  {
    id: 'test-3',
    name: 'Meenakshi & Devendra Vyas',
    eventType: 'Sangeet Craft Cocktail Bar',
    rating: 5,
    quote: 'Our daughter\'s sangeet bar was a dream, and Barmantra was the architect. They handled the 400 guests with outstanding speed and hospitality. The dual-lane high-speed service and fire-flair show is still the talk of our social circles. Magnificent team!',
    date: 'January 2026'
  },
  {
    id: 'test-4',
    name: 'Rajesh & Pooja Khandelwal',
    eventType: 'Private Haveli Whiskey Soirée',
    rating: 5,
    quote: 'We wanted an intimate, traditional but ultra-luxurious 50th anniversary bar in our ancestral haveli. Barmantra created a breathtaking candlelit single-malt tasting lounge. The cardamom cocktail recipes were exceptionally curated.',
    date: 'February 2026'
  },
  {
    id: 'test-5',
    name: 'Siddharth Mehta',
    eventType: 'VIP Literature Festival Lounge',
    rating: 5,
    quote: 'Highly professional showrunners and bartenders. Managing dynamic guest arrival patterns and complex drink orders at a VIP festival is chaotic, but Barmantra\'s staff was calm, swift, and composed. Perfect drink consistency and stunning bar aesthetics.',
    date: 'March 2026'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Kartik Arora',
    role: 'Founder & Master Mixologist',
    image: '/images/team/kartik-arora.png',
    bio: 'Born into luxury heritage, Kartik is a visionary billionaire mixologist and founder of Barmantra. He holds master credentials in artisanal spirit formulation and curates high-net-worth royal wedding banquets worldwide.'
  },
  {
    id: 'team-2',
    name: 'Mohit Khanna',
    role: 'Chief Bar Operations Producer',
    image: '/images/team/mohit-khanna.png',
    bio: 'A distinguished billionaire industrialist and operations leader with over 15 years in high-end hospitality. Mohit commands Barmantra\'s mega-event logistics and global supply chain with military-grade luxury standards.'
  },
  {
    id: 'team-3',
    name: 'Rishabh Shahi',
    role: 'Director of VVIP Client Relations',
    image: '/images/team/rishabh-shahi.png',
    bio: 'A prominent private equity investor and luxury hospitality strategist. Rishabh personally acts as executive concierge for royal families, celebrity galas, and billionaire weddings across Rajasthan and internationally.'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: 'Discovery & Consultation',
    description: 'We host you in Jaipur (or jump on a virtual call) to understand your guest footprint, spirit preferences, and visual theme, establishing the bar concept.',
    iconName: 'PhoneCall'
  },
  {
    number: 2,
    title: 'Concept & 3D Bar Design',
    description: 'Our design team drafts custom mood boards, bespoke glassware pairings, and 3D mockups of your custom-fabricated mobile bar facades.',
    iconName: 'Compass'
  },
  {
    number: 3,
    title: 'Menu Curation & Mixology Tasting',
    description: 'We refine signature drink lists and host private tastings of our saffron, rose, and cardamom syrups, maintaining absolute ledger transparency.',
    iconName: 'Layers'
  },
  {
    number: 4,
    title: 'On-Ground Showrunning',
    description: 'Our mixologists execute the plan on-site, directing dual-lane setups, custom clear ice carving, and premium tandem flair shows for peak crowd energy.',
    iconName: 'Zap'
  },
  {
    number: 5,
    title: 'Post-Event Grace',
    description: 'We supervise bar teardown, coordinate vendor returns, and gather final client feedback to gracefully conclude the luxury experience.',
    iconName: 'CheckCircle'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How far in advance should we book Barmantra for a wedding bar?',
    answer: 'For large royal destination wedding bars, we recommend booking our services 6 to 12 months in advance. This ensures availability of our custom-fabricated mobile bars, elite staff, and sufficient time to prepare our native botanical infusions and hand-carved ice molds.'
  },
  {
    id: 'faq-2',
    question: 'Do you provide the alcohol or do we source it?',
    answer: 'Due to state liquor licensing laws, we provide full premium bar management, elite mixologists, custom mobile bar counters, glassware, artisanal syrups, custom clear ice, and garnish curations. The physical alcohol inventory is typically sourced by the client or the venue partners, which we help estimate and coordinate perfectly.'
  },
  {
    id: 'faq-3',
    question: 'How do you handle budgeting and financial transparency?',
    answer: 'Barmantra operates on a "strict transparent ledger" policy. We provide a fully detailed spreadsheet break-down of all ingredients, glassware rentals, and staffing costs. We do not collect hidden kickbacks, keeping our interests completely aligned with your financial comfort.'
  },
  {
    id: 'faq-4',
    question: 'What is your operational structure during the live event days?',
    answer: 'We assign a dedicated senior Bar Producer along with zone managers (such as a Prep Lead and Floor Supervisor). This core team is on-ground 24/7 during setup and main days, communicating in real-time to solve issues instantly without disturbing the hosts.'
  },
  {
    id: 'faq-5',
    question: 'Can you customize the bar facade to match our wedding theme?',
    answer: 'Absolutely. We specialize in bespoke mobile bar facades. Whether your wedding is traditional Rajputana (with custom brass jaali screens and marigold draping) or contemporary minimalist (with sleek LED backlighting), our in-house Jaipur workshop fabricates the bar facade to integrate flawlessly.'
  },
  {
    id: 'faq-6',
    question: 'Do you cater to non-alcoholic/mocktail requirements?',
    answer: 'Yes! We approach mocktails with the exact same artisanal precision. We curate a fully sophisticated, non-alcoholic drink menu using premium seed-lip distillates, fresh native cold-pressed juices, house-made floral cordials, and custom gold-leaf garnishes.'
  }
];
