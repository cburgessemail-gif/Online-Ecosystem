import React, { useMemo, useState } from "react";

type Screen = "home" | "roles" | "journey" | "marketplace" | "partners" | "workforce" | "feedback";

type Language =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "עברית"
  | "Français";

type PathwayKey =
  | "guest"
  | "grower"
  | "youth"
  | "customer"
  | "marketplace"
  | "partner"
  | "volunteer"
  | "valueAdded"
  | "supervisor"
  | "parent";

type JourneyStage = "entry" | "experience" | "decision" | "action" | "share";

type WorkforceTab = "checkin" | "attendance" | "ppe" | "skills" | "rubric" | "parent";

const languages: Language[] = [
  "English",
  "Español",
  "Tagalog",
  "Italiano",
  "עברית",
  "Français",
];

const IMG = {
  hero: "/images/large (18).jpg",
  heroAlt: "/images/large (2).jpg",

  youth1: "/images/large (16).jpg",
  youth2: "/images/large (15).jpg",
  youth3: "/images/large (12).jpg",

  marketplaceHero: "/images/large (11).jpg",
  ecosystem: "/images/ConnectFoodEcosystem_withimages.png",

  culinaryFlowers: "/images/culniary_edibleflowers.jpeg",
  culinaryFlowers2: "/images/culniary_edibleflowers2.jpeg",
  culinaryMushrooms: "/images/culniary_mushrooms.jpeg",

  growArea: "/images/GrowArea2.jpg",
  growAreaAlt: "/images/Grow Area.png",

  partners: "/images/Partners.png",
  compost: "/images/Compost_ElliottGarden.png",
  compost2: "/images/Compost_Elliott.png",

  fencing: "/images/Deer Fencing.png",
  volunteers: "/images/Fence_volunteers.png",

  queens: "/images/Queens Village.png",
  seeds: "/images/Seeds_Jubilee Gardens.png",
  csu: "/images/CSU_MParker.png",
  wkbn: "/images/WKBN Interview.png",

  sameera2: "/images/Samaeera2.jpg",
  sameera3: "/images/Sameera3.jpg",
  sameera4: "/images/Samerra4.jpg",
  sameera5: "/images/Samerra5.jpg",
};

const ui: Record<Language, Record<string, string>> = {
  English: {
    home: "Home",
    tour: "Guided Tour",
    marketplace: "Marketplace",
    partners: "Partners",
    workforce: "Workforce",
    feedback: "Feedback",
    begin: "Begin Guided Tour",
    continue: "Continue Journey",
    next: "Next",
    back: "Back",
    complete: "Complete Step",
    explore: "Explore Pathway",
    decision: "Make Decision",
    share: "Share Feedback",
    operational: "Open Workforce Tools",
  },
  Español: {
    home: "Inicio",
    tour: "Recorrido Guiado",
    marketplace: "Mercado",
    partners: "Socios",
    workforce: "Fuerza Laboral",
    feedback: "Comentarios",
    begin: "Comenzar Recorrido",
    continue: "Continuar Camino",
    next: "Siguiente",
    back: "Atrás",
    complete: "Completar Paso",
    explore: "Explorar Camino",
    decision: "Tomar Decisión",
    share: "Compartir Comentarios",
    operational: "Abrir Herramientas",
  },
  Tagalog: {
    home: "Home",
    tour: "Gabay na Tour",
    marketplace: "Marketplace",
    partners: "Partners",
    workforce: "Workforce",
    feedback: "Feedback",
    begin: "Simulan ang Tour",
    continue: "Ipagpatuloy",
    next: "Susunod",
    back: "Bumalik",
    complete: "Kumpletuhin",
    explore: "Tuklasin",
    decision: "Magpasya",
    share: "Magbigay ng Feedback",
    operational: "Buksan ang Tools",
  },
  Italiano: {
    home: "Home",
    tour: "Tour Guidato",
    marketplace: "Mercato",
    partners: "Partner",
    workforce: "Forza Lavoro",
    feedback: "Feedback",
    begin: "Inizia Tour",
    continue: "Continua Percorso",
    next: "Avanti",
    back: "Indietro",
    complete: "Completa Passo",
    explore: "Esplora Percorso",
    decision: "Prendi Decisione",
    share: "Condividi Feedback",
    operational: "Apri Strumenti",
  },
  עברית: {
    home: "בית",
    tour: "סיור מודרך",
    marketplace: "שוק",
    partners: "שותפים",
    workforce: "כוח עבודה",
    feedback: "משוב",
    begin: "התחל סיור",
    continue: "המשך מסלול",
    next: "הבא",
    back: "חזור",
    complete: "השלם שלב",
    explore: "חקור מסלול",
    decision: "קבל החלטה",
    share: "שתף משוב",
    operational: "פתח כלים",
  },
  Français: {
    home: "Accueil",
    tour: "Visite Guidée",
    marketplace: "Marché",
    partners: "Partenaires",
    workforce: "Main-d’œuvre",
    feedback: "Retour",
    begin: "Commencer",
    continue: "Continuer",
    next: "Suivant",
    back: "Retour",
    complete: "Compléter",
    explore: "Explorer",
    decision: "Décider",
    share: "Partager",
    operational: "Ouvrir Outils",
  },
};

const pathwayData: Record<
  PathwayKey,
  {
    label: string;
    short: string;
    image: string;
    outcome: string;
    destination: string;
    stages: Record<JourneyStage, { title: string; body: string; bullets: string[] }>;
    connections: PathwayKey[];
  }
> = {
  guest: {
    label: "Guest Pathway",
    short: "Understand the vision, story, place, and purpose.",
    image: IMG.queens,
    outcome: "A guest leaves knowing why the farm matters and where they fit.",
    destination: "Choose a next role: customer, volunteer, partner, or grower.",
    connections: ["customer", "volunteer", "partner", "grower"],
    stages: {
      entry: {
        title: "Arrive at the farm story.",
        body: "The guest enters through legacy, land, food access, youth development, wellness, and community restoration.",
        bullets: ["See the farm purpose", "Understand the location", "Meet the ecosystem roles"],
      },
      experience: {
        title: "Experience the living model.",
        body: "The guest sees that the farm is not only a place to visit. It is a system people can participate in.",
        bullets: ["Walk through growers", "See youth workforce", "View marketplace movement"],
      },
      decision: {
        title: "Decide how to participate.",
        body: "The guest is invited to move from observation into belonging.",
        bullets: ["Visit marketplace", "Volunteer", "Become a partner", "Share feedback"],
      },
      action: {
        title: "Take the first action.",
        body: "The pathway leads to clear next steps instead of ending with information.",
        bullets: ["Register interest", "Join an event", "Explore another pathway"],
      },
      share: {
        title: "Share the experience.",
        body: "The guest can invite others, offer feedback, and continue through the ecosystem.",
        bullets: ["Share with family", "Send feedback", "Continue journey"],
      },
    },
  },
  grower: {
    label: "Grower Pathway",
    short: "Connect producers to tools, knowledge, market access, and support.",
    image: IMG.growArea,
    outcome: "A grower understands how to produce, prepare, sell, and collaborate.",
    destination: "Become a participating grower or join the Growers Supply Market.",
    connections: ["marketplace", "valueAdded", "partner", "volunteer"],
    stages: {
      entry: {
        title: "Enter through growing capacity.",
        body: "The grower pathway begins with land, soil, seeds, water, tools, and practical knowledge.",
        bullets: ["Assess growing needs", "Review supplies", "Understand production goals"],
      },
      experience: {
        title: "Move from growing to readiness.",
        body: "Growers connect to training, demonstrations, product planning, harvesting, packaging, and marketplace access.",
        bullets: ["Production planning", "Food safety basics", "Packaging and labeling"],
      },
      decision: {
        title: "Choose market participation.",
        body: "The grower decides whether to sell, demonstrate, collaborate, teach, or receive technical support.",
        bullets: ["Sell products", "Host a demonstration", "Join shared distribution"],
      },
      action: {
        title: "Activate the grower relationship.",
        body: "The system turns interest into a concrete grower profile, product list, and market pathway.",
        bullets: ["Create grower profile", "Add products", "Select market channel"],
      },
      share: {
        title: "Growers strengthen the network.",
        body: "Growers share what works, support new growers, and help build regional food access.",
        bullets: ["Share lessons", "Refer another grower", "Continue to marketplace"],
      },
    },
  },
  youth: {
    label: "Youth Workforce",
    short: "Build skills, responsibility, confidence, and future readiness.",
    image: IMG.youth1,
    outcome: "Youth complete real work, earn skills, and see progress.",
    destination: "Join the 8-week youth workforce experience with supervisor tracking.",
    connections: ["supervisor", "parent", "marketplace", "volunteer"],
    stages: {
      entry: {
        title: "Begin with orientation and belonging.",
        body: "Youth enter with structure, safety expectations, PPE, roles, and daily rhythm.",
        bullets: ["Orientation", "PPE expectations", "Daily check-in"],
      },
      experience: {
        title: "Practice real work in a real ecosystem.",
        body: "Youth participate in growing, market preparation, site care, teamwork, service, and reflection.",
        bullets: ["Farm tasks", "Team assignments", "Leadership habits"],
      },
      decision: {
        title: "Choose growth goals.",
        body: "Youth see their progress and choose which skills they want to strengthen.",
        bullets: ["Attendance", "Responsibility", "Communication", "Work quality"],
      },
      action: {
        title: "Track progress with supervisors.",
        body: "Supervisors record participation, PPE, skills, rubrics, and milestones on mobile phones.",
        bullets: ["Skill tracking", "Daily rubric", "Progress badges"],
      },
      share: {
        title: "Connect family and future.",
        body: "Parents and guardians can understand youth growth, milestones, and next steps.",
        bullets: ["Parent updates", "Youth reflection", "Completion pathway"],
      },
    },
  },
  customer: {
    label: "Customer Pathway",
    short: "Connect families to fresh food, nutrition, seedlings, and repeat healthy choices.",
    image: IMG.seeds,
    outcome: "Customers understand what they can buy, grow, learn, and return for.",
    destination: "Shop marketplace, pre-order seedlings, attend demos, or join nutrition education.",
    connections: ["marketplace", "guest", "valueAdded", "grower"],
    stages: {
      entry: {
        title: "Enter through food access.",
        body: "Customers are welcomed through fresh food, seedlings, practical education, and community trust.",
        bullets: ["Fresh produce", "Seedlings", "Nutrition education"],
      },
      experience: {
        title: "Learn what supports the household.",
        body: "The customer pathway connects purchases to cooking, growing, wellness, and repeat participation.",
        bullets: ["Healthy choices", "Simple growing options", "Family-friendly learning"],
      },
      decision: {
        title: "Decide how to use the marketplace.",
        body: "Customers can shop, pre-order, attend demonstrations, or share what their household needs.",
        bullets: ["Buy", "Pre-order", "Attend demo", "Request support"],
      },
      action: {
        title: "Move into marketplace access.",
        body: "The experience should lead to a store, pickup, event, or contact decision.",
        bullets: ["Open marketplace", "Save pickup reminder", "Share needs"],
      },
      share: {
        title: "Bring others into healthy choices.",
        body: "Customers help expand community participation by sharing the farm with neighbors and family.",
        bullets: ["Invite family", "Share feedback", "Return to marketplace"],
      },
    },
  },
  marketplace: {
    label: "Marketplace Pathway",
    short: "Convert interest into purchasing power, distribution, and sustainability.",
    image: IMG.marketplaceHero,
    outcome: "The marketplace becomes the movement point for food, growers, customers, and partners.",
    destination: "Access the marketplace system and connect products to people.",
    connections: ["customer", "grower", "valueAdded", "partner"],
    stages: {
      entry: {
        title: "Enter the growers supply market.",
        body: "The marketplace brings together seedlings, produce, tools, education, demonstrations, and food access.",
        bullets: ["Products", "Growers", "Education", "Community access"],
      },
      experience: {
        title: "See food moving through the ecosystem.",
        body: "Marketplace participation connects production, ordering, pickup, demonstrations, nutrition, and community learning.",
        bullets: ["Pre-orders", "Pickup flow", "Product education"],
      },
      decision: {
        title: "Choose a market action.",
        body: "The user decides whether to shop, sell, demonstrate, sponsor, or refer others.",
        bullets: ["Shop", "Sell", "Demonstrate", "Sponsor"],
      },
      action: {
        title: "Activate marketplace movement.",
        body: "The pathway should never dead-end. It should route the user to the next action.",
        bullets: ["Open store", "Create product list", "Join event"],
      },
      share: {
        title: "Share market opportunity.",
        body: "The marketplace grows when customers, growers, and partners share the opportunity.",
        bullets: ["Share product", "Invite grower", "Send feedback"],
      },
    },
  },
  partner: {
    label: "Partner Pathway",
    short: "Align resources, collaboration, education, wellness, and community benefit.",
    image: IMG.partners,
    outcome: "Partners see clear roles, benefits, and next steps.",
    destination: "Select partnership type and identify the next collaboration action.",
    connections: ["workforce" as PathwayKey, "marketplace", "volunteer", "grower"].filter(Boolean) as PathwayKey[],
    stages: {
      entry: {
        title: "Enter through shared purpose.",
        body: "Partners connect through food access, workforce, wellness, education, infrastructure, and revitalization.",
        bullets: ["Shared mission", "Community benefit", "Visible impact"],
      },
      experience: {
        title: "Match resources to ecosystem needs.",
        body: "The partner experience clarifies how each contribution strengthens operations.",
        bullets: ["Tools", "Training", "Funding", "Promotion", "Volunteers"],
      },
      decision: {
        title: "Choose a partnership lane.",
        body: "Partners decide whether to sponsor, provide supplies, train youth, host demos, or support food access.",
        bullets: ["Sponsor", "Donate supplies", "Train", "Refer", "Promote"],
      },
      action: {
        title: "Move into a partner action plan.",
        body: "The partner pathway converts goodwill into a specific ask, timeline, and next meeting.",
        bullets: ["Define role", "Confirm support", "Schedule next step"],
      },
      share: {
        title: "Tell the impact story.",
        body: "Partners help show the community that the ecosystem is real and supported.",
        bullets: ["Share report", "Invite collaborators", "Continue partnership"],
      },
    },
  },
  volunteer: {
    label: "Volunteer Pathway",
    short: "Turn community willingness into meaningful service.",
    image: IMG.volunteers,
    outcome: "Volunteers know where they are needed and how to serve safely.",
    destination: "Sign up for a service role, event shift, or farm workday.",
    connections: ["guest", "youth", "marketplace", "partner"],
    stages: {
      entry: {
        title: "Enter through service.",
        body: "Volunteers are welcomed into practical tasks that support the farm and community.",
        bullets: ["Farm workdays", "Event support", "Youth support"],
      },
      experience: {
        title: "Serve with structure.",
        body: "Volunteers receive clear roles, safety expectations, tools, and a purpose for the day.",
        bullets: ["Role assignment", "Safety", "Team support"],
      },
      decision: {
        title: "Choose a service lane.",
        body: "Volunteers can support growing, events, marketplace, youth, setup, cleanup, or outreach.",
        bullets: ["Grow", "Build", "Teach", "Welcome", "Support"],
      },
      action: {
        title: "Commit to a shift.",
        body: "The volunteer pathway leads to scheduling and communication.",
        bullets: ["Select shift", "Confirm availability", "Receive instructions"],
      },
      share: {
        title: "Invite others to serve.",
        body: "Volunteers expand capacity by bringing others into meaningful work.",
        bullets: ["Invite a friend", "Share experience", "Return for next day"],
      },
    },
  },
  valueAdded: {
    label: "Value-Added Producer",
    short: "Connect culinary, herbs, mushrooms, flowers, and product development.",
    image: IMG.culinaryFlowers,
    outcome: "Value-added producers see how raw products become education, revenue, and wellness.",
    destination: "Develop a product, demonstration, class, or market offering.",
    connections: ["marketplace", "grower", "customer", "partner"],
    stages: {
      entry: {
        title: "Enter through product possibility.",
        body: "Value-added production connects growing to cooking, wellness, education, and small enterprise.",
        bullets: ["Herbs", "Mushrooms", "Edible flowers", "Culinary learning"],
      },
      experience: {
        title: "Turn farm output into learning and products.",
        body: "The pathway links production to recipes, demonstrations, packaging, and sales.",
        bullets: ["Recipe ideas", "Demo planning", "Packaging basics"],
      },
      decision: {
        title: "Choose a product or learning format.",
        body: "The user decides whether to demonstrate, sell, teach, or collaborate.",
        bullets: ["Demo", "Product", "Workshop", "Collaboration"],
      },
      action: {
        title: "Build a value-added offer.",
        body: "The system turns the idea into a market-ready action.",
        bullets: ["Define offer", "Set date", "Connect to marketplace"],
      },
      share: {
        title: "Share knowledge and taste.",
        body: "Value-added producers help families use fresh food in daily life.",
        bullets: ["Share recipes", "Invite customers", "Support nutrition"],
      },
    },
  },
  supervisor: {
    label: "Supervisor Pathway",
    short: "Track youth attendance, PPE, skills, behavior, rubrics, and milestones by phone.",
    image: IMG.sameera3,
    outcome: "Supervisors can manage youth progress clearly and consistently.",
    destination: "Open supervisor tools and record daily progress.",
    connections: ["youth", "parent", "volunteer", "partner"],
    stages: {
      entry: {
        title: "Enter through daily responsibility.",
        body: "Supervisors begin with attendance, role assignments, PPE, safety, and the day’s work plan.",
        bullets: ["Daily roster", "Check-in", "PPE verification"],
      },
      experience: {
        title: "Observe work in real time.",
        body: "Supervisors track participation, teamwork, communication, initiative, and skill development.",
        bullets: ["Observe", "Coach", "Record", "Encourage"],
      },
      decision: {
        title: "Identify youth support needs.",
        body: "Supervisors decide when youth need coaching, recognition, redirection, or parent communication.",
        bullets: ["Co
