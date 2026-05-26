import React, { useMemo, useState } from "react";

type Screen =
  | "home"
  | "story"
  | "roles"
  | "events"
  | "nutrition"
  | "marketplace"
  | "cropPlanner"
  | "growPlan"
  | "assessments"
  | "data"
  | "liveChannels"
  | "proverbs"
  | "feedback";

type Language =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "Français"
  | "Hebrew";

type PathwayKey =
  | "guest"
  | "customer"
  | "youth"
  | "grower"
  | "marketplace"
  | "partner"
  | "supervisor"
  | "parent"
  | "volunteer"
  | "valueAdded";

type Pathway = {
  label: string;
  title: string;
  subtitle: string;
  need: string;
  experience: string[];
  rhythm: string[];
  foodFlow?: string[];
  live: string[];
  decisions: { label: string; screen?: Screen; pathway?: PathwayKey }[];
  next: PathwayKey[];
  reflection: string;
};

const languages: Language[] = [
  "English",
  "Español",
  "Tagalog",
  "Italiano",
  "Français",
  "Hebrew",
];

const UI: Record<
  Language,
  {
    entrance: string;
    story: string;
    roles: string;
    events: string;
    nutrition: string;
    marketplace: string;
    cropPlanner: string;
    growPlan: string;
    assessments: string;
    data: string;
    liveChannels: string;
    proverbs: string;
    feedback: string;
    language: string;
    return: string;
    openRoles: string;
    nextJourney: string;
    decision: string;
  }
> = {
  English: {
    entrance: "Entrance",
    story: "Our Story",
    roles: "Role Pathways",
    events: "Events",
    nutrition: "Health & Nutrition",
    marketplace: "Marketplace",
    cropPlanner: "Crop Planner",
    growPlan: "Grow Plan",
    assessments: "Assessments",
    data: "Data",
    liveChannels: "Live Channels",
    proverbs: "Proverbs",
    feedback: "Feedback",
    language: "Choose language",
    return: "Return to Entrance",
    openRoles: "Open Role Pathways",
    nextJourney: "Continue your journey",
    decision: "Ending decision",
  },
  Español: {
    entrance: "Entrada",
    story: "Nuestra Historia",
    roles: "Caminos",
    events: "Eventos",
    nutrition: "Salud y Nutrición",
    marketplace: "Mercado",
    cropPlanner: "Plan de Cultivos",
    growPlan: "Plan de Siembra",
    assessments: "Evaluaciones",
    data: "Datos",
    liveChannels: "Canales en Vivo",
    proverbs: "Proverbios",
    feedback: "Comentarios",
    language: "Elegir idioma",
    return: "Volver a la entrada",
    openRoles: "Abrir caminos",
    nextJourney: "Continuar su camino",
    decision: "Decisión final",
  },
  Tagalog: {
    entrance: "Pasukan",
    story: "Kuwento",
    roles: "Mga Pathway",
    events: "Mga Event",
    nutrition: "Kalusugan at Nutrisyon",
    marketplace: "Marketplace",
    cropPlanner: "Crop Planner",
    growPlan: "Grow Plan",
    assessments: "Assessments",
    data: "Data",
    liveChannels: "Live Channels",
    proverbs: "Proverbs",
    feedback: "Feedback",
    language: "Pumili ng wika",
    return: "Bumalik sa simula",
    openRoles: "Buksan ang Pathways",
    nextJourney: "Ipagpatuloy ang journey",
    decision: "Final decision",
  },
  Italiano: {
    entrance: "Ingresso",
    story: "La Storia",
    roles: "Percorsi",
    events: "Eventi",
    nutrition: "Salute e Nutrizione",
    marketplace: "Mercato",
    cropPlanner: "Piano Colture",
    growPlan: "Piano di Crescita",
    assessments: "Valutazioni",
    data: "Dati",
    liveChannels: "Canali Live",
    proverbs: "Proverbi",
    feedback: "Feedback",
    language: "Scegli lingua",
    return: "Torna all’ingresso",
    openRoles: "Apri percorsi",
    nextJourney: "Continua il percorso",
    decision: "Decisione finale",
  },
  Français: {
    entrance: "Entrée",
    story: "Notre Histoire",
    roles: "Parcours",
    events: "Événements",
    nutrition: "Santé et Nutrition",
    marketplace: "Marché",
    cropPlanner: "Plan de Culture",
    growPlan: "Plan de Croissance",
    assessments: "Évaluations",
    data: "Données",
    liveChannels: "Canaux en Direct",
    proverbs: "Proverbes",
    feedback: "Retour",
    language: "Choisir la langue",
    return: "Retour à l’entrée",
    openRoles: "Ouvrir les parcours",
    nextJourney: "Continuer le parcours",
    decision: "Décision finale",
  },
  Hebrew: {
    entrance: "כניסה",
    story: "הסיפור",
    roles: "מסלולים",
    events: "אירועים",
    nutrition: "בריאות ותזונה",
    marketplace: "שוק",
    cropPlanner: "תכנון גידולים",
    growPlan: "תוכנית גידול",
    assessments: "הערכות",
    data: "נתונים",
    liveChannels: "ערוצים חיים",
    proverbs: "משלי",
    feedback: "משוב",
    language: "בחר שפה",
    return: "חזרה לכניסה",
    openRoles: "פתח מסלולים",
    nextJourney: "המשך מסלול",
    decision: "החלטה סופית",
  },
};

const image = (file: string) => `/images/${file}`;

const IMAGES = {
  background: image("GrowArea.jpg"),
  ecosystem: image("ConnectFoodEcosystem_withimages.png"),
  grow: image("GrowArea2.jpg"),
  fence: image("Fence_volunteers.png"),
  deer: image("Deer Fencing.png"),
  compost: image("Compost_ElliottGarden.png"),
  seeds: image("Seeds_Jubilee Gardens.png"),
  csu: image("CSU_MParker.png"),
  queens: image("Queens Village.png"),
  market: image("large (1).jpg"),
  culinary: image("culniary_edibleflowers.jpeg"),
  mushrooms: image("culniary_mushrooms.jpeg"),
  wkbn: image("WKBN Interview.png"),
};

function PillButton({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-3 text-sm font-medium backdrop-blur-md transition hover:scale-[1.01] ${
        active
          ? "border-emerald-200/30 bg-emerald-400/20 text-white"
          : "border-white/10 bg-white/10 text-white hover:bg-white/15"
      }`}
    >
      {children}
    </button>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-black/20 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

const pathwayData: Record<PathwayKey, Pathway> = {
  guest: {
    label: "Guest",
    title: "Guest Experience",
    subtitle: "Enter the farm, understand the place, and discover where you fit.",
    need: "Guests need a clear first experience that explains why Bronson Family Farm is more than a farm. It is a place-based food, education, workforce, wellness, marketplace, and community ecosystem.",
    experience: [
      "Arrive through the farm entrance and experience the Historic Lansdowne Airport setting.",
      "Learn how land, legacy, food access, workforce development, wellness, and marketplace activity connect.",
      "See how the farm becomes a destination for families, growers, schools, youth, partners, and community members.",
      "Choose whether to explore the marketplace, youth workforce, grower pathway, events, or partnership opportunities.",
    ],
    rhythm: [
      "Welcome and orientation",
      "Ecosystem overview",
      "Pathway selection",
      "Feedback and next step",
    ],
    live: [
      "Seasonal farm status",
      "Current event readiness",
      "Marketplace activity",
      "Community pathway interest",
    ],
    decisions: [
      { label: "Explore the Marketplace", screen: "marketplace" },
      { label: "Attend an event", screen: "events" },
      { label: "Learn about Youth Workforce", pathway: "youth" },
      { label: "Become a volunteer", pathway: "volunteer" },
      { label: "Share feedback", screen: "feedback" },
    ],
    next: ["marketplace", "youth", "grower", "partner"],
    reflection: "What part of the ecosystem made you want to learn more?",
  },
  customer: {
    label: "Customer",
    title: "Customer Experience",
    subtitle: "Connect fresh food, family wellness, local purchasing, and community impact.",
    need: "Customers need access to fresh local food, simple nutrition education, seasonal products, and a clear reason to support local growers and youth production.",
    experience: [
      "Explore seasonal produce, seedlings, Bubble Babies™, and value-added items.",
      "Understand how purchasing supports youth, growers, schools, families, and community destinations.",
      "Connect food choices to recipes, nutrition, wellness, and practical household health.",
      "Move from customer interest into marketplace participation, events, or grower learning.",
    ],
    rhythm: [
      "View seasonal products",
      "Learn the food story",
      "Choose purchase or preorder",
      "Share with family and friends",
    ],
    foodFlow: [
      "Youth and growers produce food",
      "Food is harvested and prepared",
      "Marketplace receives inventory",
      "Families, schools, and destinations are served",
    ],
    live: [
      "Available products",
      "Harvest movement",
      "Marketplace readiness",
      "Nutrition education moments",
    ],
    decisions: [
      { label: "Shop the Marketplace", screen: "marketplace" },
      { label: "Preorder seasonal items", screen: "marketplace" },
      { label: "Join a farm event", screen: "events" },
      { label: "Become a grower", pathway: "grower" },
      { label: "Share with family and friends", screen: "feedback" },
    ],
    next: ["marketplace", "grower", "guest", "partner"],
    reflection: "How can fresh local food improve your family or community?",
  },
  youth: {
    label: "Youth Workforce",
    title: "Youth Workforce Journey",
    subtitle: "Youth grow food with real destinations: marketplace, schools, and community.",
    need: "Youth need purposeful work, structure, motivation, leadership development, and a reason to stay engaged. Their work must visibly matter.",
    experience: [
      "Check in with supervisors and begin with weather, safety, hydration, PPE, and motivation.",
      "Join cultivation teams for planting, weeding, watering, harvesting, composting, and site stewardship.",
      "Participate in motivational activity blocks, team challenges, RC demonstrations, leadership moments, and reflection circles.",
      "Learn how harvested food moves to the marketplace, schools, events, families, and community destinations.",
      "Build badges in responsibility, teamwork, communication, safety, cultivation, marketplace exposure, and leadership.",
    ],
    rhythm: [
      "8:00 arrival, check-in, weather, PPE, and hydration",
      "Morning activation, proverb, goal, and team assignment",
      "Cultivation, infrastructure, harvest, and stewardship work",
      "Motivational activity block to refresh attention",
      "Marketplace exposure, reflection, documentation, and closing circle",
    ],
    foodFlow: [
      "Youth grow food",
      "Harvest and wash/prep",
      "Marketplace inventory",
      "Schools and youth-serving destinations",
      "Families and community wellness",
    ],
    live: [
      "Youth active today",
      "Attendance and PPE status",
      "Team assignments",
      "Harvest readiness",
      "Supervisor observations",
    ],
    decisions: [
      { label: "Complete enrollment", screen: "assessments" },
      { label: "Meet supervisors", pathway: "supervisor" },
      { label: "Explore leadership track", pathway: "youth" },
      { label: "Become a future mentor", pathway: "supervisor" },
      { label: "Continue to Grower Pathway", pathway: "grower" },
    ],
    next: ["supervisor", "marketplace", "grower", "parent"],
    reflection:
      "How did today’s work help feed families, schools, marketplaces, or the community?",
  },
  grower: {
    label: "Grower",
    title: "Grower Pathway",
    subtitle:
      "Grow more successfully with tools, training, market access, and ecosystem support.",
    need: "Growers need practical knowledge, shared infrastructure, education, market access, and a community system that helps production reach people.",
    experience: [
      "Learn companion planting, crop planning, seed starting, irrigation, harvest timing, and production basics.",
      "Connect to Bubble Babies™, demonstrations, grower education, and shared supply systems.",
      "Move produce and products toward marketplace channels, schools, events, and community destinations.",
      "Support youth learning by showing how growing connects to business, wellness, and community food systems.",
    ],
    rhythm: [
      "Assess growing needs",
      "Plan crops and timing",
      "Use farm knowledge and supplies",
      "Prepare for market and community destinations",
    ],
    foodFlow: [
      "Grower production",
      "Farm support systems",
      "Marketplace",
      "Schools and events",
      "Community food access",
    ],
    live: [
      "Grower interest",
      "Crop windows",
      "Supply needs",
      "Market readiness",
    ],
    decisions: [
      { label: "Join the Grower Network", screen: "cropPlanner" },
      { label: "Attend training", screen: "events" },
      { label: "Sell through Marketplace", screen: "marketplace" },
      { label: "Mentor Youth Workforce", pathway: "youth" },
      { label: "Become a partner grower", pathway: "partner" },
    ],
    next: ["marketplace", "partner", "youth", "customer"],
    reflection: "What would help you grow more successfully?",
  },
  marketplace: {
    label: "Marketplace",
    title: "Marketplace Pathway",
    subtitle:
      "The economic engine connecting growers, youth, customers, schools, and community.",
    need: "The marketplace needs to show how production becomes purchasing power, food access, education, and community sustainability.",
    experience: [
      "View seasonal produce, seedlings, Bubble Babies™, value-added products, and farm offerings.",
      "Understand how youth-grown and grower-produced food becomes real inventory.",
      "Connect purchasing to nutrition, schools, events, families, and community destinations.",
      "Move from shopping into customer loyalty, grower participation, vendor activity, or partnership support.",
    ],
    rhythm: [
      "Harvest received",
      "Inventory prepared",
      "Products displayed or listed",
      "Customers and destinations served",
    ],
    foodFlow: [
      "Field production",
      "Harvest records",
      "Marketplace display",
      "Customer purchase",
      "Community impact",
    ],
    live: [
      "Product availability",
      "Preorder activity",
      "Vendor participation",
      "Destination demand",
    ],
    decisions: [
      { label: "Shop the Marketplace", screen: "marketplace" },
      { label: "Become a vendor", pathway: "valueAdded" },
      { label: "Learn about SNAP access", screen: "marketplace" },
      { label: "Support youth production", pathway: "youth" },
      { label: "Return to Ecosystem", screen: "story" },
    ],
    next: ["customer", "grower", "partner", "youth"],
    reflection: "What products or services should the marketplace offer next?",
  },
  partner: {
    label: "Partner",
    title: "Partner Pathway",
    subtitle:
      "Partners expand capacity, infrastructure, workforce, food access, and community trust.",
    need: "Partners need to see where their support fits and how investment strengthens youth workforce, schools, marketplace activity, food access, and long-term revitalization.",
    experience: [
      "Support youth workforce development, supervisor capacity, training, and safety systems.",
      "Help connect food production to schools, families, events, and community destinations.",
      "Invest in irrigation, storage, transportation, marketplace systems, technology, and long-term operations.",
      "Collaborate through education, wellness, workforce, food access, and community development.",
    ],
    rhythm: [
      "Identify shared mission",
      "Select support area",
      "Connect resources to pathway needs",
      "Track outcomes and impact",
    ],
    live: [
      "Infrastructure needs",
      "Youth workforce support",
      "Event opportunities",
      "Community outcome tracking",
    ],
    decisions: [
      { label: "Schedule a meeting", screen: "feedback" },
      { label: "Sponsor Youth Workforce", pathway: "youth" },
      { label: "Support food distribution", screen: "marketplace" },
      { label: "Invest in infrastructure", screen: "data" },
      { label: "Become an ecosystem partner", screen: "feedback" },
    ],
    next: ["youth", "marketplace", "grower", "supervisor"],
    reflection: "Where could your organization strengthen this ecosystem?",
  },
  supervisor: {
    label: "Supervisor",
    title: "Supervisor Mobile Tracking",
    subtitle:
      "Phone-based oversight for attendance, PPE, daily tasks, youth progress, and pathway advancement.",
    need: "Supervisors need a simple mobile-first operating layer to manage 15 youth per aide, support safety, document progress, and keep the program measurable.",
    experience: [
      "Check attendance and assign youth to daily teams.",
      "Confirm PPE, hydration, safety readiness, and role assignments before work begins.",
      "Track task completion, teamwork, communication, leadership, participation, and safety awareness.",
      "Record observations from a phone while youth work in the field.",
      "Submit daily notes that support badges, parent updates, and final assessments.",
    ],
    rhythm: [
      "Morning roster and PPE check",
      "Team deployment and field observations",
      "Task completion and behavior notes",
      "End-of-day assessment and parent-ready summary",
    ],
    live: [
      "Attendance count",
      "PPE completion",
      "Team locations",
      "Youth progress notes",
    ],
    decisions: [
      { label: "Open daily attendance", screen: "assessments" },
      { label: "Complete PPE check", screen: "assessments" },
      { label: "Record youth observations", screen: "assessments" },
      { label: "Submit daily assessment", screen: "assessments" },
      { label: "Review pathway progress", screen: "data" },
    ],
    next: ["youth", "parent", "partner", "marketplace"],
    reflection: "What support does this youth need to succeed tomorrow?",
  },
  parent: {
    label: "Parent / Guardian",
    title: "Parent & Guardian Connection",
    subtitle:
      "Families see progress, participation, achievements, communication, and community contribution.",
    need: "Parents and guardians need confidence that youth are safe, growing, learning, contributing, and connected to meaningful opportunity.",
    experience: [
      "View attendance and participation summaries.",
      "See badges, growth moments, leadership progress, and supervisor notes.",
      "Understand how youth work connects to food for the marketplace, schools, and community destinations.",
      "Receive communication about events, milestones, and next opportunities.",
    ],
    rhythm: [
      "Daily participation summary",
      "Weekly progress update",
      "Achievement and badge review",
      "Family feedback and next opportunity",
    ],
    live: [
      "Youth attendance",
      "Badges earned",
      "Supervisor update",
      "Upcoming events",
    ],
    decisions: [
      { label: "View youth progress", screen: "data" },
      { label: "Read supervisor update", screen: "assessments" },
      { label: "Submit comment", screen: "feedback" },
      { label: "Attend farm event
