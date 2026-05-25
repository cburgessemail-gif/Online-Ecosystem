import { useEffect, useMemo, useState, type CSSProperties } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";

type ScreenKey =
  | "home"
  | "ecosystem"
  | "guest"
  | "story"
  | "customer"
  | "marketplace"
  | "grower"
  | "planner"
  | "valueAdded"
  | "youth"
  | "supervisor"
  | "partner"
  | "events"
  | "wellness"
  | "decision"
  | "feedback";

type Action = { label: string; to?: ScreenKey; href?: string; modal?: keyof typeof IMAGES };
type DetailBlock = { title: string; text: string };

type ScreenContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  mission: string;
  need: string;
  destination: string;
  details: DetailBlock[];
  actions: Action[];
};

const LANGS: LangKey[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const IMAGES = {
  entrance: "/images/GrowArea.jpg",
  ecosystem: "/images/GrowArea2.jpg",
  guest: "/images/SAM_0377.JPG",
  customer: "/images/SAM_0380.JPG",
  grower: "/images/SAM_0384.JPG",
  valueAdded: "/images/SAM_0391.JPG",
  youth: "/images/SAM_0393.JPG",
  supervisor: "/images/SAM_0396.JPG",
  partner: "/images/SAM_0401.JPG",
  story: "/images/SAM_0402.JPG",
  marketplace: "/images/SAM_0405.JPG",
  planner: "/images/SAM_0407.JPG",
  events: "/images/SAM_0410.JPG",
  wellness: "/images/SAM_0412.JPG",
  decision: "/images/SAM_0415.JPG",
  feedback: "/images/SAM_0417.JPG",
  community: "/images/SAM_0420.JPG",
  training: "/images/SAM_0423.JPG",
  produce: "/images/SAM_0425.JPG",
  nutrition: "/images/SAM_0427.JPG",
  legacy: "/images/SAM_0430.JPG",
};

const UI: Record<LangKey, Record<string, string>> = {
  English: {
    demo: "BRONSON FAMILY FARM ECOSYSTEM",
    mainTitle: "Connected Food Ecosystem Experience",
    back: "Back",
    next: "Next",
    guided: "Begin Guided Tour",
    pause: "Pause Tour",
    roles: "Choose a pathway",
    mission: "Mission",
    need: "Need being met",
    destination: "Destination / Decision",
    strongest: "Next strongest moves",
    gallery: "Image gallery",
    return: "Return to Ecosystem",
    feedback: "Feedback & Contact",
  },
  Español: {
    demo: "ECOSISTEMA DE BRONSON FAMILY FARM",
    mainTitle: "Experiencia de ecosistema alimentario conectado",
    back: "Atrás",
    next: "Siguiente",
    guided: "Iniciar recorrido guiado",
    pause: "Pausar recorrido",
    roles: "Elija un camino",
    mission: "Misión",
    need: "Necesidad atendida",
    destination: "Destino / Decisión",
    strongest: "Próximos pasos",
    gallery: "Galería de imágenes",
    return: "Volver al ecosistema",
    feedback: "Comentarios y contacto",
  },
  Tagalog: {
    demo: "ECOSYSTEM NG BRONSON FAMILY FARM",
    mainTitle: "Konektadong karanasan sa pagkain at komunidad",
    back: "Bumalik",
    next: "Susunod",
    guided: "Simulan ang gabay na tour",
    pause: "Ihinto muna ang tour",
    roles: "Pumili ng landas",
    mission: "Misyon",
    need: "Pangangailangang tinutugunan",
    destination: "Patutunguhan / Desisyon",
    strongest: "Susunod na pinakamalakas na hakbang",
    gallery: "Gallery ng larawan",
    return: "Bumalik sa ecosystem",
    feedback: "Feedback at contact",
  },
  Italiano: {
    demo: "ECOSISTEMA BRONSON FAMILY FARM",
    mainTitle: "Esperienza alimentare comunitaria connessa",
    back: "Indietro",
    next: "Avanti",
    guided: "Avvia tour guidato",
    pause: "Pausa tour",
    roles: "Scegli un percorso",
    mission: "Missione",
    need: "Bisogno servito",
    destination: "Destinazione / Decisione",
    strongest: "Prossime mosse",
    gallery: "Galleria immagini",
    return: "Ritorna all'ecosistema",
    feedback: "Feedback e contatto",
  },
  עברית: {
    demo: "המערכת של חוות משפחת ברונסון",
    mainTitle: "חוויה קהילתית מחוברת סביב מזון",
    back: "חזרה",
    next: "הבא",
    guided: "התחל סיור מודרך",
    pause: "השהה סיור",
    roles: "בחר מסלול",
    mission: "משימה",
    need: "הצורך שנענה",
    destination: "יעד / החלטה",
    strongest: "הצעדים הבאים",
    gallery: "גלריית תמונות",
    return: "חזרה למערכת",
    feedback: "משוב ויצירת קשר",
  },
  Français: {
    demo: "ÉCOSYSTÈME BRONSON FAMILY FARM",
    mainTitle: "Expérience alimentaire communautaire connectée",
    back: "Retour",
    next: "Suivant",
    guided: "Démarrer la visite guidée",
    pause: "Pause",
    roles: "Choisir un parcours",
    mission: "Mission",
    need: "Besoin comblé",
    destination: "Destination / Décision",
    strongest: "Prochaines étapes",
    gallery: "Galerie d'images",
    return: "Retour à l'écosystème",
    feedback: "Commentaires et contact",
  },
};

const SCREEN_ORDER: ScreenKey[] = [
  "home",
  "ecosystem",
  "guest",
  "story",
  "customer",
  "marketplace",
  "grower",
  "planner",
  "valueAdded",
  "youth",
  "supervisor",
  "partner",
  "events",
  "wellness",
  "decision",
  "feedback",
];

const ROLE_TILES: { key: ScreenKey; title: string; text: string; next: string[]; image: string }[] = [
  { key: "guest", title: "Guest", text: "Discover the farm, the story, events, and the airport-connected grow areas.", next: ["Story", "Events", "Gallery"], image: IMAGES.guest },
  { key: "customer", title: "Customer", text: "Move quickly to GrownBy, then return for recipes, nutrition, and fresh food guidance.", next: ["Marketplace", "Recipes", "Nutrition"], image: IMAGES.customer },
  { key: "grower", title: "Grower", text: "Access planning, seasonal guidance, training, and ecosystem coordination.", next: ["Planner", "Seasonal Guidance", "Coordination"], image: IMAGES.grower },
  { key: "valueAdded", title: "Value-Added Producer", text: "Explore branding, packaging, demonstrations, and local market opportunity.", next: ["Branding", "Packaging", "Market Access"], image: IMAGES.valueAdded },
  { key: "youth", title: "Youth Workforce", text: "Experience the farm as a living classroom for agriculture, STEAM, teamwork, and enterprise.", next: ["Learning", "STEAM", "Responsibilities"], image: IMAGES.youth },
  { key: "supervisor", title: "Supervisor", text: "Support youth workforce through scheduling, check-ins, wellness support, and accountability.", next: ["Scheduling", "Check-In", "Support"], image: IMAGES.supervisor },
  { key: "partner", title: "Partner / Investor", text: "See where resources, funding, sponsorship, and collaboration strengthen the ecosystem.", next: ["Support", "Investment", "Impact"], image: IMAGES.partner },
];

const CONTENT: Record<ScreenKey, ScreenContent> = {
  home: {
    eyebrow: "Welcome",
    title: "Step into the Farm. Experience the wonders of life.",
    subtitle: "A guided ecosystem for food access, growers, youth workforce, marketplace activity, health education, and community return.",
    image: IMAGES.entrance,
    imageAlt: "Bronson Family Farm entrance and growing area",
    mission: "Invite people into the farm through a warm, visual, intuitive entry point.",
    need: "People need to understand the story before they are asked to participate.",
    destination: "Begin the guided tour or choose a pathway.",
    details: [
      { title: "One connected system", text: "The farm is not a single event or slide. It is a living ecosystem connecting people, food, land, learning, and opportunity." },
      { title: "Built for action", text: "Every button leads somewhere specific: shop, learn, participate, supervise, volunteer, sponsor, or give feedback." },
      { title: "Youth launch ready", text: "The structure supports the June 8 through August 28, 2026 Youth Workforce Program with supervisor and pathway logic." },
    ],
    actions: [{ label: "Enter Ecosystem", to: "ecosystem" }, { label: "Begin Guided Tour", to: "ecosystem" }],
  },
  ecosystem: {
    eyebrow: "The Model",
    title: "Connected Food Ecosystem",
    subtitle: "Bronson Family Farm brings together growers, customers, youth, supervisors, partners, and community resources in one operational pathway system.",
    image: IMAGES.ecosystem,
    imageAlt: "Bronson Family Farm growing system",
    mission: "Show how the whole model works before a person chooses their role.",
    need: "The community needs more than food distribution. It needs tools, knowledge, people, training, and return pathways.",
    destination: "Choose a role pathway and move from interest to decision.",
    details: [
      { title: "Food access", text: "Fresh food moves toward families, marketplace customers, schools, and community destinations." },
      { title: "Grower supply market", text: "Tools, training, demonstrations, seeds, seedlings, planning, and sales channels support local growers." },
      { title: "Wraparound ecosystem", text: "Youth, families, growers, vendors, partners, and supervisors are connected instead of operating separately." },
    ],
    actions: [{ label: "Choose Guest Path", to: "guest" }, { label: "Go to Youth Workforce", to: "youth" }, { label: "Partner / Investor View", to: "partner" }],
  },
  guest: {
    eyebrow: "Guest Pathway",
    title: "Come experience the farm first.",
    subtitle: "Guests enter through story, place, events, beauty, and discovery before deciding how they want to participate.",
    image: IMAGES.guest,
    imageAlt: "Guest pathway farm image",
    mission: "Help visitors understand why Bronson Family Farm exists and why the land matters.",
    need: "Guests need a welcoming entry before they become customers, volunteers, donors, or advocates.",
    destination: "Decide whether to attend, share, volunteer, shop, or bring others.",
    details: [
      { title: "Story and place", text: "The airport-connected farm, the growing areas, and the family legacy create a memorable first experience." },
      { title: "Events as entry points", text: "Growers Supply Market and community events create natural reasons to return." },
      { title: "Share the invitation", text: "Guests should leave with a simple story they can tell someone else." },
    ],
    actions: [{ label: "Open Story", to: "story" }, { label: "See Events", to: "events" }, { label: "Open Gallery", modal: "community" }],
  },
  story: {
    eyebrow: "Story / Legacy",
    title: "The farm carries family, land, culture, and future opportunity.",
    subtitle: "The ecosystem honors the Bronson and Lorenzana legacy while building a practical food and workforce destination in Youngstown.",
    image: IMAGES.story,
    imageAlt: "Legacy pathway image",
    mission: "Ground the demo in purpose before asking people to act.",
    need: "People need meaning, trust, and context to understand why this work matters.",
    destination: "Return to a role pathway with a stronger reason to participate.",
    details: [
      { title: "Legacy", text: "Family history, faith, education, agriculture, and community responsibility shape the farm's purpose." },
      { title: "Place-based work", text: "The farm is rooted in Youngstown and speaks to food access, land use, workforce, and community revitalization." },
      { title: "Future-building", text: "The story points forward: youth, growers, marketplace systems, and regional collaboration." },
    ],
    actions: [{ label: "Enter as Guest", to: "guest" }, { label: "Choose a Pathway", to: "ecosystem" }, { label: "Leave Feedback", to: "feedback" }],
  },
  customer: {
    eyebrow: "Customer Pathway",
    title: "Fresh food, nutrition, recipes, and return visits.",
    subtitle: "Customers move quickly to the marketplace, then return for food guidance, nutrition education, and healthier choices.",
    image: IMAGES.customer,
    imageAlt: "Customer pathway image",
    mission: "Convert interest into fresh food access and repeat participation.",
    need: "Families need easier access to locally grown food and simple guidance for using it well.",
    destination: "Shop, learn how to use the food, return, and share with others.",
    details: [
      { title: "Marketplace first", text: "The customer path should make the store easy to find without burying the action." },
      { title: "Food guidance", text: "Recipes, nutrition notes, and produce education help customers feel confident." },
      { title: "Healthy return loop", text: "Customers come back for seasonal produce, events, demonstrations, and wellness education." },
    ],
    actions: [{ label: "Go to Marketplace", to: "marketplace" }, { label: "Recipes & Nutrition", to: "wellness" }, { label: "Open GrownBy Store", href: "https://grownby.com/farms/bronson-family-farm/shop" }],
  },
  marketplace: {
    eyebrow: "Marketplace",
    title: "Move food from farm to families, schools, and community destinations.",
    subtitle: "The marketplace connects products, preorders, SNAP-aware shopping logic, grower supply activity, and community-facing sales.",
    image: IMAGES.marketplace,
    imageAlt: "Marketplace pathway image",
    mission: "Turn growing activity into economic, nutritional, and community value.",
    need: "The ecosystem needs a sales channel so food, seedlings, and value-added products can move beyond the field.",
    destination: "Shop, preorder, become a
