// Use this as the next full App.tsx replacement.
// It preserves the current one-file React structure and updates:
// Guest Journey images, visible languages, 15-second guided pacing,
// Stay Here / Go Forward behavior, youth-accessible airport history,
// and regenerative farming education.

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";

type ScreenKey =
  | "home"
  | "ecosystem"
  | "guest"
  | "story"
  | "airport"
  | "regenerative"
  | "customer"
  | "marketplace"
  | "grower"
  | "planner"
  | "valueAdded"
  | "youth"
  | "supervisor"
  | "parent"
  | "partner"
  | "events"
  | "wellness"
  | "decision"
  | "feedback";

type Action = {
  label: string;
  to?: ScreenKey;
  href?: string;
  modal?: keyof typeof IMAGES;
};

type DetailBlock = {
  title: string;
  text: string;
};

type ScreenContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  narration: string;
  details: DetailBlock[];
  actions: Action[];
};

const LANGS: LangKey[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const IMAGES = {
  entrance: "/images/GrowArea.jpg",
  ecosystem: "/images/GrowArea2.jpg",
  guest: "/images/SAM_0427.JPG",
  story: "/images/SAM_0430.JPG",
  airport: "/images/SAM_0377.JPG",
  regenerative: "/images/Compost_ElliottGarden.png",
  customer: "/images/SAM_0380.JPG",
  marketplace: "/images/ConnectFoodEcosystem_withimages.png",
  grower: "/images/GrowArea2.jpg",
  planner: "/images/SAM_0407.JPG",
  valueAdded: "/images/culniary_edibleflowers.jpeg",
  youth: "/images/SAM_0393.JPG",
  supervisor: "/images/SAM_0396.JPG",
  parent: "/images/SAM_0417.JPG",
  partner: "/images/SAM_0401.JPG",
  events: "/images/Queens Village.png",
  wellness: "/images/SAM_0412.JPG",
  decision: "/images/SAM_0415.JPG",
  feedback: "/images/SAM_0420.JPG",
  community: "/images/Fence_volunteers.png",
  training: "/images/Deer Fencing.png",
  produce: "/images/Seeds_Jubilee Gardens.png",
  nutrition: "/images/SAM_0425.JPG",
  legacy: "/images/SAM_0430.JPG",
};

const UI: Record<LangKey, Record<string, string>> = {
  English: {
    demo: "BRONSON FAMILY FARM ECOSYSTEM",
    mainTitle: "Connected Food Ecosystem Experience",
    start: "Start",
    back: "Back",
    next: "Go Forward",
    guided: "Begin Guided Tour",
    pause: "Pause Tour",
    stay: "Stay Here",
    forward: "Go Forward",
    language: "Language Access",
    choose: "Choose a pathway",
    return: "Return to Ecosystem",
    feedback: "Feedback & Contact",
    decision: "Ending Decision",
  },
  Español: {
    demo: "ECOSISTEMA DE BRONSON FAMILY FARM",
    mainTitle: "Experiencia de ecosistema alimentario conectado",
    start: "Comenzar",
    back: "Atrás",
    next: "Avanzar",
    guided: "Iniciar recorrido guiado",
    pause: "Pausar recorrido",
    stay: "Quedarse aquí",
    forward: "Avanzar",
    language: "Acceso de idioma",
    choose: "Elija un camino",
    return: "Volver al ecosistema",
    feedback: "Comentarios y contacto",
    decision: "Decisión final",
  },
  Tagalog: {
    demo: "ECOSYSTEM NG BRONSON FAMILY FARM",
    mainTitle: "Konektadong karanasan sa pagkain at komunidad",
    start: "Magsimula",
    back: "Bumalik",
    next: "Magpatuloy",
    guided: "Simulan ang gabay na tour",
    pause: "Ihinto muna ang tour",
    stay: "Manatili Dito",
    forward: "Magpatuloy",
    language: "Wika",
    choose: "Pumili ng landas",
    return: "Bumalik sa ecosystem",
    feedback: "Feedback at contact",
    decision: "Huling desisyon",
  },
  Italiano: {
    demo: "ECOSISTEMA BRONSON FAMILY FARM",
    mainTitle: "Esperienza alimentare comunitaria connessa",
    start: "Inizia",
    back: "Indietro",
    next: "Vai avanti",
    guided: "Avvia tour guidato",
    pause: "Pausa tour",
    stay: "Resta qui",
    forward: "Vai avanti",
    language: "Lingua",
    choose: "Scegli un percorso",
    return: "Ritorna all'ecosistema",
    feedback: "Feedback e contatto",
    decision: "Decisione finale",
  },
  עברית: {
    demo: "המערכת של חוות משפחת ברונסון",
    mainTitle: "חוויה קהילתית מחוברת סביב מזון",
    start: "התחלה",
    back: "חזרה",
    next: "קדימה",
    guided: "התחל סיור מודרך",
    pause: "השהה סיור",
    stay: "להישאר כאן",
    forward: "קדימה",
    language: "שפה",
    choose: "בחר מסלול",
    return: "חזרה למערכת",
    feedback: "משוב ויצירת קשר",
    decision: "החלטה מסכמת",
  },
  Français: {
    demo: "ÉCOSYSTÈME BRONSON FAMILY FARM",
    mainTitle: "Expérience alimentaire communautaire connectée",
    start: "Commencer",
    back: "Retour",
    next: "Avancer",
    guided: "Démarrer la visite guidée",
    pause: "Pause",
    stay: "Rester ici",
    forward: "Avancer",
    language: "Langue",
    choose: "Choisir un parcours",
    return: "Retour à l'écosystème",
    feedback: "Commentaires et contact",
    decision: "Décision finale",
  },
};

const SCREEN_ORDER: ScreenKey[] = [
  "home",
  "ecosystem",
  "guest",
  "story",
  "airport",
  "regenerative",
  "customer",
  "marketplace",
  "grower",
  "planner",
  "valueAdded",
  "youth",
  "supervisor",
  "parent",
  "partner",
  "events",
  "wellness",
  "decision",
  "feedback",
];

const CONTENT: Record<ScreenKey, ScreenContent> = {
  home: {
    eyebrow: "Welcome",
    title: "Step into the Farm. Experience the wonders of life.",
    subtitle:
      "A guided ecosystem for food access, growers, youth workforce, marketplace activity, health education, airport history, regenerative farming, and community return.",
    image: IMAGES.entrance,
    imageAlt: "Forest farm entrance",
    narration:
      "Welcome to Bronson Family Farm. Take a moment to look around the screen. This is not just a farm page. This is an entrance into a living ecosystem where land, food, young people, growers, families, and community partners are connected.",
    details: [
      { title: "Entrance", text: "A calm beginning before the visitor chooses a role." },
      { title: "Language", text: "Language access is visible immediately." },
      { title: "Pace", text: "The guided tour moves slowly so low readers and first-time visitors can follow." },
    ],
    actions: [
      { label: "Enter Ecosystem", to: "ecosystem" },
      { label: "Begin Guided Tour", to: "ecosystem" },
    ],
  },
  ecosystem: {
    eyebrow: "The Model",
    title: "Connected Food Ecosystem",
    subtitle:
      "Bronson Family Farm brings together guests, customers, growers, youth, supervisors, parents, partners, food movement, and community resources.",
    image: IMAGES.ecosystem,
    imageAlt: "Growing area at Bronson Family Farm",
    narration:
      "This is the whole ecosystem. Each role connects to another role. A guest can become a customer. A customer can become a volunteer. A youth worker can become a grower. A partner can strengthen the entire system.",
    details: [
      { title: "Food access", text: "Fresh food moves toward families, markets, schools, and community destinations." },
      { title: "Grower supply", text: "Tools, training, seeds, seedlings, demonstrations, and planning support local growers." },
      { title: "Workforce", text: "Youth learn through real farm responsibilities, safety, teamwork, and supervision." },
    ],
    actions: [
      { label: "Guest Journey", to: "guest" },
      { label: "Youth Workforce", to: "youth" },
      { label: "Partner / Investor", to: "partner" },
    ],
  },
  guest: {
    eyebrow: "Guest Journey",
    title: "Come experience the farm first.",
    subtitle:
      "Guests enter through beauty, story, land, airport history, regenerative farming, events, and discovery before deciding how they want to participate.",
    image: IMAGES.guest,
    imageAlt: "Welcoming farm image for guests",
    narration:
      "The guest journey starts slowly. A guest should not be rushed. First they see the land. Then they learn the story. Then they understand that this farm is connected to an airport, to family legacy, to food access, and to the future of young people.",
    details: [
      { title: "See", text: "Guests first become familiar with what is on the screen." },
      { title: "Learn", text: "The next layer explains the story, place, and purpose." },
      { title: "Choose", text: "Guests decide whether to attend, shop, volunteer, share, sponsor, or return." },
    ],
    actions: [
      { label: "Open Story", to: "story" },
      { label: "Airport History", to: "airport" },
      { label: "Regenerative Farming", to: "regenerative" },
    ],
  },
  story: {
    eyebrow: "Story / Legacy",
    title: "The farm carries family, land, culture, and future opportunity.",
    subtitle:
      "The ecosystem honors Bronson and Lorenzana family legacy while building a practical food and workforce destination in Youngstown.",
    image: IMAGES.story,
    imageAlt: "Family legacy and farm story",
    narration:
      "The story matters because people protect what they understand. Bronson Family Farm is rooted in family history, agriculture, faith, education, culture, and community responsibility.",
    details: [
      { title: "Legacy", text: "Family history and community responsibility shape the farm’s purpose." },
      { title: "Place", text: "The work is rooted in Youngstown and the East Side." },
      { title: "Future", text: "The story points toward youth, growers, food access, and regional opportunity." },
    ],
    actions: [
      { label: "Guest Journey", to: "guest" },
      { label: "Airport History", to: "airport" },
      { label: "Choose Pathway", to: "ecosystem" },
    ],
  },
  airport: {
    eyebrow: "Youth-Accessible Airport History",
    title: "The farm grows at a historic airport.",
    subtitle:
      "Lansdowne Airport helps youth understand place, aviation, military service, land use, discipline, responsibility, and community history.",
    image: IMAGES.airport,
    imageAlt: "Historic airport-connected farm area",
    narration:
      "This land has a story before the farm. An airport is a place where people learn direction, safety, signals, teamwork, and responsibility. Youth can understand the airport as history, but also as a classroom. The same land that once supported flight can now support food, learning, and opportunity.",
    details: [
      { title: "For youth", text: "Airport history is explained through direction, safety, teamwork, and responsibility." },
      { title: "Military connection", text: "Aviation and military history help youth understand service, discipline, and preparation." },
      { title: "Land use", text: "The farm shows how historic land can serve a new community purpose." },
    ],
    actions: [
      { label: "Regenerative Farming", to: "regenerative" },
      { label: "Youth Workforce", to: "youth" },
      { label: "Go Back to Guest", to: "guest" },
    ],
  },
  regenerative: {
    eyebrow: "Regenerative Farming",
    title: "We are using regenerative farming to develop the land.",
    subtitle:
      "Regenerative farming means improving the soil, protecting the land, reducing waste, growing food, and leaving the place healthier over time.",
    image: IMAGES.regenerative,
    imageAlt: "Compost and soil-building image",
    narration:
      "Regenerative farming means the farm is not only taking from the land. It is giving back. We build soil, use compost, protect living systems, reduce waste, care for water, and grow in a way that helps the land become stronger over time.",
    details: [
      { title: "Build soil", text: "Compost, leaves, mulch, and organic matter help create healthier soil." },
      { title: "Reduce waste", text: "The farm reuses natural materials and works toward off-grid, low-waste operations." },
      { title: "Teach stewardship", text: "Youth and growers learn that land must be cared for, not just used." },
    ],
    actions: [
      { label: "Grower Pathway", to: "grower" },
      { label: "Youth Workforce", to: "youth" },
      { label: "Guest Journey", to: "guest" },
    ],
  },
  customer: {
    eyebrow: "Customer Pathway",
    title: "Fresh food, nutrition, recipes, and return visits.",
    subtitle:
      "Customers move to the marketplace, then return for food guidance, nutrition education, and healthier choices.",
    image: IMAGES.customer,
    imageAlt: "Customer food pathway",
    narration:
      "The customer pathway helps families move from interest to fresh food. Food access becomes stronger when people also receive recipes, nutrition support, and reasons to return.",
    details: [
      { title: "Shop", text: "Customers can move directly to the Bronson Family Farm store." },
      { title: "Learn", text: "Recipes and nutrition notes help families use fresh food." },
      { title: "Return", text: "Customers come back for produce, events, demonstrations, and wellness education." },
    ],
    actions: [
      { label: "Marketplace", to: "marketplace" },
      { label: "Wellness / Nutrition", to: "wellness" },
      { label: "Open GrownBy Store", href: "https://grownby.com/farms/bronson-family-farm/shop" },
    ],
  },
  marketplace: {
    eyebrow: "Marketplace",
    title: "Move food from farm to families, schools, and community destinations.",
    subtitle:
      "The marketplace connects products, preorders, SNAP-aware shopping, grower supply activity, and community-facing sales.",
    image: IMAGES.marketplace,
    imageAlt: "Marketplace ecosystem image",
    narration:
      "The marketplace is where growing becomes movement. Produce, seedlings, Bubble Babies, and value-added products can move from the farm into homes, schools, and community destinations.",
    details: [
      { title: "Store", text: "The GrownBy store gives customers a place to shop." },
      { title: "Inventory", text: "Products need clear paths from field to sale." },
      { title: "Community", text: "Food can support families, schools, events, and partners." },
    ],
    actions: [
      { label: "Open GrownBy Store", href: "https://grownby.com/farms/bronson-family-farm/shop" },
      { label: "Customer Path", to: "customer" },
      { label: "Crop Planner", to: "planner" },
    ],
  },
  grower: {
    eyebrow: "Grower Pathway",
    title: "Tools, knowledge, planning, and support for growers.",
    subtitle:
      "Growers enter the ecosystem for seasonal planning, demonstrations, supplies, coordination, and access to market opportunity.",
    image: IMAGES.grower,
    imageAlt: "Grower growing area",
    narration:
      "The grower pathway helps people grow successfully. Growers need timing, tools, supplies, knowledge, weather awareness, and a place to connect what they grow to buyers and community needs.",
    details: [
      { title: "Planning", text: "Planting windows and crop timing keep the work practical." },
      { title: "Training", text: "Demonstrations help growers learn by seeing and doing." },
      { title: "Market", text: "Growers can connect to inventory, sales, and distribution." },
    ],
    actions: [
      { label: "Crop Planner", to: "planner" },
      { label: "Marketplace", to: "marketplace" },
      { label: "Regenerative Farming", to: "regenerative" },
    ],
  },
  planner: {
    eyebrow: "Crop Planner",
    title: "Planning connects crops, weather, workforce, events, and market readiness.",
    subtitle:
      "The planner makes the ecosystem operational by connecting farm work to timing, staffing, inventory, and outcomes.",
    image: IMAGES.planner,
    imageAlt: "Crop planner pathway",
    narration:
      "The crop planner helps the farm make decisions. Farming depends on timing, weather, workers, crop stage, inventory, and where the food is going next.",
    details: [
      { title: "Season", text: "Planting and harvest windows guide daily work." },
      { title: "Workforce", text: "Youth and supervisors can connect tasks to real outcomes." },
      { title: "Market", text: "Planning helps products move to customers and community destinations." },
    ],
    actions: [
      { label: "Grower Path", to: "grower" },
      { label: "Youth Workforce", to: "youth" },
      { label: "Marketplace", to: "marketplace" },
    ],
  },
  valueAdded: {
    eyebrow: "Value-Added Producer",
    title: "Turn products into demonstrations, packaging, branding, and income.",
    subtitle:
      "Value-added producers connect creativity, food safety, packaging, customer education, and market access.",
    image: IMAGES.valueAdded,
    imageAlt: "Value-added food image",
    narration:
      "Value-added work helps growers and producers create more value. A product needs a story, packaging, customer education, safety awareness, and a clear path to market.",
    details: [
      { title: "Branding", text: "Presentation helps customers understand the product." },
      { title: "Demonstration", text: "Live examples teach people how to use local food." },
      { title: "Income", text: "Products can create enterprise opportunity." },
    ],
    actions: [
      { label: "Marketplace", to: "marketplace" },
      { label: "Events", to: "events" },
      { label: "Open Produce Gallery", modal: "produce" },
    ],
  },
  youth: {
    eyebrow: "Youth Workforce",
    title: "More than a job. We are building our future.",
    subtitle:
      "Youth ages 14–18 experience agriculture, STEAM, teamwork, responsibility, enterprise, and community purpose.",
    image: IMAGES.youth,
    imageAlt: "Youth workforce pathway",
    narration:
      "Youth workforce is more than a summer job. Youth learn safety, attendance, teamwork, growing, harvesting, inventory, marketplace support, communication, and leadership. Staff supervisors guide youth. Random people do not get access to youth.",
    details: [
      { title: "Safety", text: "PPE, check-in, assignments, and supervisor structure protect the youth." },
      { title: "Skills", text: "Youth learn responsibility, teamwork, agriculture, STEAM, and enterprise." },
      { title: "Purpose", text: "Youth see how their work becomes food, service, and opportunity." },
    ],
    actions: [
      { label: "Supervisor Portal", to: "supervisor" },
      { label: "Parent / Guardian View", to: "parent" },
      { label: "Training Gallery", modal: "training" },
    ],
  },
  supervisor: {
    eyebrow: "Supervisor Portal",
    title: "Mobile-first support for youth workforce accountability.",
    subtitle:
      "Supervisors use phones to support attendance, assignments, PPE, wellness, observations, progress, and daily notes.",
    image: IMAGES.supervisor,
    imageAlt: "Supervisor pathway",
    narration:
      "The supervisor pathway is for staff. Supervisors support youth through check-in, safety, task assignments, observations, notes, and care. This protects the program and keeps youth connected to responsible adults.",
    details: [
      { title: "Check-in", text: "Attendance, PPE, assignments, and daily readiness." },
      { title: "Observation", text: "Task completion, teamwork, communication, and life skills." },
      { title: "Support", text: "Supervisors connect youth, parents, and program leadership." },
    ],
    actions: [
      { label: "Youth Workforce", to: "youth" },
      { label: "Parent / Guardian View", to: "parent" },
      { label: "Wellness Support", to: "wellness" },
    ],
  },
  parent: {
    eyebrow: "Parent / Guardian Connection",
    title: "Families can see progress, purpose, and support.",
    subtitle:
      "The parent pathway helps guardians understand youth progress, expectations, safety, attendance, and next steps.",
    image: IMAGES.parent,
    imageAlt: "Parent guardian connection",
    narration:
      "Parents and guardians need to know what youth are doing and why it matters. This pathway explains safety, daily rhythm, progress, expectations, and how the program supports growth.",
    details: [
      { title: "Progress", text: "Families can understand attendance, participation, and skill growth." },
      { title: "Communication", text: "Parents can receive updates and know who supervises youth." },
      { title: "Trust", text: "The program stays clear, structured, and protective." },
    ],
    actions: [
      { label: "Youth Workforce", to: "youth" },
      { label: "Supervisor Portal", to: "supervisor" },
      { label: "Feedback", to: "feedback" },
    ],
  },
  partner: {
    eyebrow: "Partner / Investor",
    title: "Support the infrastructure that lets the ecosystem work.",
    subtitle:
      "Partners help with tools, fencing, water, solar, transportation, workforce, education, wellness, market access, and capacity.",
    image: IMAGES.partner,
    imageAlt: "Partner pathway",
    narration:
      "Partners strengthen the whole ecosystem. The farm needs practical support: water, solar, tools, fencing, storage, tables, canopies, transportation, education, and workforce support.",
    details: [
      { title: "Specific asks", text: "Water, solar, fencing, tools, storage, transportation, wash stations, and workforce supports." },
      { title: "Impact", text: "Support strengthens youth, growers, customers, and food access." },
      { title: "Mutual benefit", text: "Strong partnerships create value for the community and the partner." },
    ],
    actions: [
      { label: "Events", to: "events" },
      { label: "Feedback", to: "feedback" },
      { label: "Return to Ecosystem", to: "ecosystem" },
    ],
  },
  events: {
    eyebrow: "Events",
    title: "Events bring people back into the ecosystem.",
    subtitle:
      "Growers Supply Market, seed giveaways, demonstrations, wellness education, and community days create repeated entry points.",
    image: IMAGES.events,
    imageAlt: "Community event pathway",
    narration:
      "Events help people return. They give guests, customers, growers, youth, partners, and families a reason to come back, learn, shop, volunteer, and connect.",
    details: [
      { title: "Entry", text: "Events are welcoming ways to enter the ecosystem." },
      { title: "Demonstration", text: "Partners, growers, and youth can show the work in real time." },
      { title: "Trust", text: "Events make the farm visible, useful, and memorable." },
    ],
    actions: [
      { label: "Guest Journey", to: "guest" },
      { label: "Marketplace", to: "marketplace" },
      { label: "Wellness", to: "wellness" },
    ],
  },
  wellness: {
    eyebrow: "Wellness / Nutrition",
    title: "Food is health, learning, culture, and confidence.",
    subtitle:
      "The wellness path connects produce, recipes, nutrition education, screenings, family support, and healthier choices.",
    image: IMAGES.wellness,
    imageAlt: "Wellness and nutrition pathway",
    narration:
      "Food is more than something to buy. Food connects to health, culture, family, confidence, and community. Wellness helps people understand how to use fresh food well.",
    details: [
      { title: "Nutrition", text: "Families learn what to do with seasonal produce." },
      { title: "Mental wellness", text: "Gardening and outdoor work support calm, connection, purpose, and belonging." },
      { title: "Family", text: "Wellness connects youth, parents, customers, volunteers, and partners." },
    ],
    actions: [
      { label: "Customer Path", to: "customer" },
      { label: "Marketplace", to: "marketplace" },
      { label: "Nutrition Gallery", modal: "nutrition" },
    ],
  },
  decision: {
    eyebrow: "Decision",
    title: "What do you want to do next?",
    subtitle:
      "Every pathway ends with a clear choice so the visitor does not get lost.",
    image: IMAGES.decision,
    imageAlt: "Decision pathway",
    narration:
      "Now choose what comes next. You can become a guest, customer, grower, youth worker, supervisor, parent, partner, volunteer, or supporter. The ecosystem keeps moving forward.",
    details: [
      { title: "Grow", text: "Become a grower or help with planning." },
      { title: "Support youth", text: "Support the workforce program." },
      { title: "Shop or partner", text: "Use the marketplace or become a partner." },
    ],
    actions: [
      { label: "Become a Grower", to: "grower" },
      { label: "Support Youth", to: "youth" },
      { label: "Feedback & Contact", to: "feedback" },
    ],
  },
  feedback: {
    eyebrow: "Feedback / Contact",
    title: "Tell us how you want to connect.",
    subtitle:
      "The ecosystem closes with feedback, contact, sharing, and the next invitation back into the farm.",
    image: IMAGES.feedback,
    imageAlt: "Feedback and contact pathway",
    narration:
      "Thank you for entering the Bronson Family Farm ecosystem. You can return to the ecosystem, share the farm, shop, ask questions, or tell us how you want to connect.",
    details: [
      { title: "Contact", text: "Phone: 330-275-1604. Website: bronsonfamilyfarm.com." },
      { title: "Share", text: "Invite a grower, family, youth supervisor, customer, partner, or supporter." },
      { title: "Return", text: "The ecosystem does not end. It invites people back." },
    ],
    actions: [
      { label: "Return to Ecosystem", to: "ecosystem" },
      { label: "Shop GrownBy", href: "https://grownby.com/farms/bronson-family-farm/shop" },
      { label: "Decision Screen", to: "decision" },
    ],
  },
};

const ROLE_TILES: { key: ScreenKey; title: string; text: string; image: string }[] = [
  { key: "guest", title: "Guest", text: "Story, events, beauty, airport history, and first discovery.", image: IMAGES.guest },
  { key: "customer", title: "Customer", text: "Fresh food, marketplace, recipes, and nutrition.", image: IMAGES.customer },
  { key: "grower", title: "Grower", text: "Planning, tools, training, supplies, and market connection.", image: IMAGES.grower },
  { key: "valueAdded", title: "Value-Added", text: "Packaging, demonstrations, branding, and enterprise.", image: IMAGES.valueAdded },
  { key: "youth", title: "Youth Workforce", text: "Safety, work, skill-building, agriculture, and STEAM.", image: IMAGES.youth },
  { key: "supervisor", title: "Supervisor", text: "Staff-only support, check-ins, assessments, and accountability.", image: IMAGES.supervisor },
  { key: "parent", title: "Parent / Guardian", text: "Progress, communication, expectations, and support.", image: IMAGES.parent },
  { key: "partner", title: "Partner / Investor", text: "Funding, sponsorship, infrastructure, and impact.", image: IMAGES.partner },
];

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>("home");
  const [lang, setLang] = useState<LangKey>("English");
  const [guided, setGuided] = useState(false);
  const [imageModal, setImageModal] = useState<string | null>(null);

  const t = UI[lang];
  const current = CONTENT[screen];
  const currentIndex = SCREEN_ORDER.indexOf(screen);

  const progress = useMemo(
    () => Math.round(((currentIndex + 1) / SCREEN_ORDER.length) * 100),
    [currentIndex]
  );

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const maleVoice =
      voices.find((voice) => /male|david|mark|daniel|alex/i.test(voice.name)) || voices[0];

    if (maleVoice) utterance.voice = maleVoice;
    utterance.rate = 0.82;
    utterance.pitch = 1.08;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const goto = (next: ScreenKey, keepGuided = false) => {
    window.speechSynthesis?.cancel();
    if (!keepGuided) setGuided(false);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goForward = (keepGuided = false) => {
    const next = SCREEN_ORDER[(currentIndex + 1) % SCREEN_ORDER.length];
    goto(next, keepGuided);
  };

  const goBack = () => {
    const prev = SCREEN_ORDER[(currentIndex - 1 + SCREEN_ORDER.length) % SCREEN_ORDER.length];
    goto(prev);
  };

  const stayHere = () => {
    setGuided(false);
    window.speechSynthesis?.cancel();
  };

  useEffect(() => {
    if (!guided) return;

    speak(current.narration);

    const timer = window.setTimeout(() => {
      setScreen((prev) => {
        const i = SCREEN_ORDER.indexOf(prev);
        return SCREEN_ORDER[(i + 1) % SCREEN_ORDER.length];
      });
    }, 15000);

    return () => {
      window.clearTimeout(timer);
      window.speechSynthesis?.cancel();
    };
  }, [guided, screen]);

  const performAction = (action: Action) => {
    window.speechSynthesis?.cancel();

    if (action.href) {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }

    if (action.modal) {
      setGuided(false);
      setImageModal(IMAGES[action.modal]);
      return;
    }

    if (action.to) goto(action.to);
  };

  return (
    <main style={styles.shell} dir={lang === "עברית" ? "rtl" : "ltr"}>
      <div style={styles.bg} />

      <header style={styles.topbar}>
        <button style={styles.brandButton} onClick={() => goto("home")}>
          <span style={styles.brandMark}>BFF</span>
          <span>
            <span style={styles.brandTiny}>{t.demo}</span>
            <span style={styles.brandTitle}>{t.mainTitle}</span>
          </span>
        </button>

        <div style={styles.topControls}>
          <div style={styles.languageLabel}>{t.language}</div>
          <div style={styles.languagePills}>
            {LANGS.map((item) => (
              <button
                key={item}
                style={item === lang ? styles.langActive : styles.langBtn}
                onClick={() => setLang(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <button style={styles.smallBtn} onClick={() => setGuided((v) => !v)}>
            {guided ? t.pause : t.guided}
          </button>
        </div>
      </header>

      <section style={styles.progressWrap}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      </section>

      <section style={styles.heroGrid}>
        <article style={styles.heroText}>
          <div style={styles.eyebrow}>{current.eyebrow}</div>
          <h1 style={styles.title}>{current.title}</h1>
          <p style={styles.subtitle}>{current.subtitle}</p>

          <div style={styles.actionRow}>
            {current.actions.map((action) => (
              <button key={action.label} style={styles.whiteBtn} onClick={() => performAction(action)}>
                {action.label}
              </button>
            ))}
          </div>

          <div style={styles.guidedRow}>
            <button style={styles.greenBtn} onClick={stayHere}>
              {t.stay}
            </button>
            <button style={styles.greenBtn} onClick={() => goForward(guided)}>
              {t.forward}
            </button>
          </div>
        </article>

        <aside style={styles.imagePanel}>
          <img
            src={current.image}
            alt={current.imageAlt}
            style={styles.heroImage}
            onError={(e) => {
              e.currentTarget.src = IMAGES.entrance;
            }}
          />
          <div style={styles.imageFade} />
          <div style={styles.imageCaption}>{current.imageAlt}</div>
        </aside>
      </section>

      {screen === "ecosystem" && (
        <section style={styles.rolesSection}>
          <div style={styles.sectionTitle}>{t.choose}</div>
          <div style={styles.roleGrid}>
            {ROLE_TILES.map((role) => (
              <button
                key={role.key}
                style={{
                  ...styles.roleTile,
                  backgroundImage: `linear-gradient(180deg, rgba(5,20,14,.10), rgba(5,20,14,.90)), url(${role.image})`,
                }}
                onClick={() => goto(role.key)}
              >
                <div style={styles.roleTitle}>{role.title}</div>
                <div style={styles.roleText}>{role.text}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section style={styles.educationStrip}>
        {current.details.map((block) => (
          <article key={block.title} style={styles.lessonCard}>
            <div style={styles.lessonTitle}>{block.title}</div>
            <p style={styles.lessonText}>{block.text}</p>
          </article>
        ))}
      </section>

      <aside style={styles.sideActions}>
        <button style={styles.ghostBtn} onClick={() => goto("ecosystem")}>
          {t.return}
        </button>
        <button style={styles.ghostBtn} onClick={() => goto("decision")}>
          {t.decision}
        </button>
        <button style={styles.ghostBtn} onClick={() => goto("feedback")}>
          {t.feedback}
        </button>
      </aside>

      <footer style={styles.footerNav}>
        <button style={styles.navBtn} onClick={goBack}>
          {t.back}
        </button>
        <button style={styles.navBtn} onClick={stayHere}>
          {t.stay}
        </button>
        <button style={styles.navBtn} onClick={() => goForward(guided)}>
          {t.forward}
        </button>
      </footer>

      {imageModal && (
        <div style={styles.modalBackdrop} onClick={() => setImageModal(null)}>
          <div style={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setImageModal(null)}>
              ×
            </button>
            <img
              src={imageModal}
              alt="Farm gallery"
              style={styles.modalImage}
              onError={(e) => {
                e.currentTarget.src = IMAGES.entrance;
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  shell: {
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial",
    position: "relative",
    overflowX: "hidden",
    padding: "20px clamp(14px, 3vw, 42px) 92px",
  },
  bg: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(circle at top left, rgba(185,138,72,.28), transparent 32%), radial-gradient(circle at top right, rgba(110,139,76,.24), transparent 30%), linear-gradient(135deg, #132116 0%, #24351f 48%, #0b140d 100%)",
    zIndex: -2,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  brandButton: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.16)",
    borderRadius: 18,
    padding: "12px 14px",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
  },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    background: "rgba(245,210,124,.22)",
    color: "#ffe6a4",
    fontWeight: 900,
  },
  brandTiny: {
    display: "block",
    fontSize: 11,
    letterSpacing: ".18em",
    color: "#f2d27c",
    fontWeight: 900,
  },
  brandTitle: {
    display: "block",
    fontSize: 18,
    fontWeight: 900,
    lineHeight: 1.1,
  },
  topControls: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "flex-end",
  },
  languageLabel: {
    fontSize: 12,
    letterSpacing: ".18em",
    color: "#f2d27c",
    fontWeight: 900,
    textTransform: "uppercase",
  },
  languagePills: {
    display: "flex",
    gap: 7,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  langBtn: {
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    borderRadius: 999,
    padding: "8px 10px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
  },
  langActive: {
    border: "1px solid rgba(245,210,124,.72)",
    background: "rgba(245,210,124,.24)",
    color: "#fff4cf",
    borderRadius: 999,
    padding: "8px 10px",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 12,
  },
  smallBtn: {
    border: "1px solid rgba(245,210,124,.55)",
    background: "rgba(245,210,124,.18)",
    color: "#fff4cf",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 900,
  },
  progressWrap: {
    height: 8,
    background: "rgba(255,255,255,.10)",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 18,
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #f2d27c, #8fb36a)",
    borderRadius: 999,
    transition: "width .45s ease",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, .9fr) minmax(360px, 1.1fr)",
    gap: 18,
    alignItems: "stretch",
  },
  heroText: {
    minHeight: 465,
    borderRadius: 28,
    padding: "clamp(22px, 4vw, 46px)",
    background: "rgba(6,18,10,.58)",
    border: "1px solid rgba(255,255,255,.14)",
    boxShadow: "0 24px 70px rgba(0,0,0,.28)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  eyebrow: {
    color: "#f2d27c",
    letterSpacing: ".20em",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    fontSize: "clamp(38px, 5vw, 76px)",
    lineHeight: .95,
    margin: "0 0 18px",
    color: "#fff4cf",
    letterSpacing: "-.04em",
  },
  subtitle: {
    fontSize: "clamp(18px, 2vw, 25px)",
    lineHeight: 1.32,
    margin: 0,
    maxWidth: 820,
    color: "rgba(255,255,255,.90)",
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 26,
  },
  guidedRow: {
    display: "flex",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
  whiteBtn: {
    border: "1px solid rgba(255,255,255,.24)",
    background: "rgba(255,255,255,.88)",
    color: "#142015",
    borderRadius: 999,
    padding: "12px 16px",
    fontWeight: 900,
    cursor: "pointer",
  },
  greenBtn: {
    border: "1px solid rgba(143,179,106,.5)",
    background: "rgba(143,179,106,.28)",
    color: "#f7ffe9",
    borderRadius: 999,
    padding: "12px 16px",
    fontWeight: 900,
    cursor: "pointer",
  },
  imagePanel: {
    position: "relative",
    minHeight: 465,
    borderRadius: 28,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(0,0,0,.18)",
    boxShadow: "0 24px 70px rgba(0,0,0,.30)",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    position: "absolute",
    inset: 0,
  },
  imageFade: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.44))",
  },
  imageCaption: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 16,
    color: "#fff",
    background: "rgba(0,0,0,.36)",
    border: "1px solid rgba(255,255,255,.16)",
    borderRadius: 16,
    padding: "10px 12px",
    fontWeight: 800,
  },
  rolesSection: {
    marginTop: 18,
    borderRadius: 28,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.13)",
    padding: 18,
  },
  sectionTitle: {
    color: "#f2d27c",
    fontWeight: 900,
    letterSpacing: ".16em",
    textTransform: "uppercase",
    fontSize: 13,
    marginBottom: 12,
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
  },
  roleTile: {
    minHeight: 150,
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid rgba(255,255,255,.14)",
    borderRadius: 22,
    color: "#fff",
    padding: 16,
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  roleTitle: {
    fontSize: 21,
    fontWeight: 950,
    color: "#fff4cf",
    marginBottom: 6,
  },
  roleText: {
    fontSize: 14,
    lineHeight: 1.25,
    color: "rgba(255,255,255,.88)",
    fontWeight: 700,
  },
  educationStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  lessonCard: {
    borderRadius: 22,
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.13)",
    padding: 16,
  },
  lessonTitle: {
    color: "#f2d27c",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: ".15em",
    fontWeight: 950,
    marginBottom: 8,
  },
  lessonText: {
    margin: 0,
    lineHeight: 1.35,
    color: "rgba(255,255,255,.88)",
    fontWeight: 650,
  },
  sideActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  ghostBtn: {
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    borderRadius: 999,
    padding: "12px 16px",
    fontWeight: 900,
    cursor: "pointer",
  },
  footerNav: {
    position: "fixed",
    left: 18,
    right: 18,
    bottom: 18,
    display: "flex",
    justifyContent: "center",
    gap: 12,
    zIndex: 20,
  },
  navBtn: {
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(8,20,12,.82)",
    backdropFilter: "blur(14px)",
    color: "#fff4cf",
    borderRadius: 999,
    padding: "13px 18px",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 12px 36px rgba(0,0,0,.25)",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.78)",
    display: "grid",
    placeItems: "center",
    zIndex: 60,
    padding: 22,
  },
  modalPanel: {
    width: "min(1050px, 94vw)",
    height: "min(720px, 86vh)",
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
    background: "#111",
    border: "1px solid rgba(255,255,255,.18)",
  },
  closeBtn: {
    position: "absolute",
    right: 14,
    top: 14,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.3)",
    background: "rgba(0,0,0,.55)",
    color: "#fff",
    fontSize: 28,
    cursor: "pointer",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    background: "#111",
  },
};
