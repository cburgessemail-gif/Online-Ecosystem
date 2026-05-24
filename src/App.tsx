import { useEffect, useMemo, useState, type CSSProperties } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";
type ScreenKey =
  | "home"
  | "ecosystem"
  | "guest"
  | "customer"
  | "grower"
  | "valueAdded"
  | "youth"
  | "supervisor"
  | "partner"
  | "story"
  | "marketplace"
  | "planner"
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
    start: "Start",
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
    start: "Comenzar",
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
    start: "Magsimula",
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
    start: "Inizia",
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
    start: "התחלה",
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
    start: "Commencer",
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
    destination: "Shop, preorder, become a vendor, or connect production to a buyer destination.",
    details: [
      { title: "GrownBy connection", text: "Customers should be able to move directly to the Bronson Family Farm store." },
      { title: "Inventory to market", text: "Produce, seedlings, Bubble Babies, and value-added products need a visible path to purchase." },
      { title: "Community destinations", text: "Food grown by youth and growers can support marketplace customers, schools, and other destinations." },
    ],
    actions: [{ label: "Open GrownBy Store", href: "https://grownby.com/farms/bronson-family-farm/shop" }, { label: "Back to Customer", to: "customer" }, { label: "Inventory to Planner", to: "planner" }],
  },
  grower: {
    eyebrow: "Grower Pathway",
    title: "Tools, knowledge, planning, and support for growers.",
    subtitle: "Growers enter the ecosystem for seasonal planning, demonstrations, supplies, coordination, and access to market opportunity.",
    image: IMAGES.grower,
    imageAlt: "Grower pathway image",
    mission: "Help more people grow successfully and connect what they grow to community value.",
    need: "Small growers need timing, tools, guidance, supplies, and a place to connect with buyers and other producers.",
    destination: "Plan, grow, coordinate, sell, teach, or become part of the supply market.",
    details: [
      { title: "Seasonal guidance", text: "Planting windows, weather awareness, and crop timing keep the ecosystem practical." },
      { title: "Shared knowledge", text: "Workshops and demonstrations help growers learn by seeing and doing." },
      { title: "Market connection", text: "The grower path should lead naturally to inventory, marketplace, and community distribution." },
    ],
    actions: [{ label: "Open Crop Planner", to: "planner" }, { label: "Seasonal Events", to: "events" }, { label: "Marketplace Access", to: "marketplace" }],
  },
  planner: {
    eyebrow: "Planner",
    title: "Planning connects crops, weather, workforce, events, and market readiness.",
    subtitle: "The planner makes the ecosystem operational instead of decorative by connecting farm work to timing and outcomes.",
    image: IMAGES.planner,
    imageAlt: "Crop planner image",
    mission: "Give growers, supervisors, and operators one place to think through readiness.",
    need: "Farming decisions depend on timing, people, crop stage, weather, inventory, and destinations.",
    destination: "Move from planning to growing, harvesting, event readiness, or marketplace delivery.",
    details: [
      { title: "Season status", text: "Warm season planning is active, with field prep, seedling movement, and event readiness underway." },
      { title: "Next planting window", text: "Upcoming planting windows align production timing, volunteers, youth workforce, and grower activity." },
      { title: "Harvest and event readiness", text: "The planner connects crops, staffing, weather, and community-facing events." },
    ],
    actions: [{ label: "Grower Path", to: "grower" }, { label: "Event Readiness", to: "events" }, { label: "Inventory to Market", to: "marketplace" }],
  },
  valueAdded: {
    eyebrow: "Value-Added Producer Pathway",
    title: "Turn products into demonstrations, packaging, branding, and income.",
    subtitle: "Value-added producers connect creativity, food safety, packaging, customer education, and market access.",
    image: IMAGES.valueAdded,
    imageAlt: "Value-added producer image",
    mission: "Help growers and producers increase value while teaching the community how local food can become local enterprise.",
    need: "Producers need a pathway for product presentation, demonstrations, branding, packaging, and sales readiness.",
    destination: "Prepare a product, demonstrate it, sell it, or partner with the marketplace.",
    details: [
      { title: "Product presentation", text: "Packaging, labeling, story, and shelf-readiness help products move from idea to customer." },
      { title: "Demonstrations", text: "Live demos help customers understand how to use, cook, preserve, and value local food." },
      { title: "Market access", text: "The pathway connects producers to events, customers, and the marketplace." },
    ],
    actions: [{ label: "Demonstrations", to: "events" }, { label: "Market Access", to: "marketplace" }, { label: "Product Presentation", modal: "produce" }],
  },
  youth: {
    eyebrow: "Youth Workforce Pathway",
    title: "More than a job. We are building our future.",
    subtitle: "Youth ages 14–18 experience agriculture, STEAM, teamwork, responsibility, enterprise, and community purpose from June 8 through August 28, 2026.",
    image: IMAGES.youth,
    imageAlt: "Youth workforce pathway image",
    mission: "Build responsibility, confidence, skills, and real work experience through a living farm environment.",
    need: "Youth need structured work, caring supervision, meaningful activity, less social media distraction, and a reason to see themselves in the future.",
    destination: "Complete daily responsibilities, grow food for the marketplace and community, earn progress, and reflect on next steps.",
    details: [
      { title: "Daily rhythm", text: "Check-in, PPE, assignments, field work, learning blocks, motivational activities, supervisor observations, and reflection." },
      { title: "Food with purpose", text: "The food youth grow supports the marketplace, schools, and other community destinations." },
      { title: "Motivational activity", text: "Short daily challenges, proverbs, farm missions, and team reflection create healthy focus away from social media." },
    ],
    actions: [{ label: "Supervisor Support", to: "supervisor" }, { label: "Learning Schedule", to: "planner" }, { label: "STEAM & Training", modal: "training" }],
  },
  supervisor: {
    eyebrow: "Supervisor Pathway",
    title: "Mobile-first support for youth workforce accountability.",
    subtitle: "Supervisors use phones to support attendance, assignments, PPE, wellness, observations, progress, and daily notes.",
    image: IMAGES.supervisor,
    imageAlt: "Supervisor pathway image",
    mission: "Give aides and supervisors a simple, reliable structure for supporting 50 youth without confusion.",
    need: "Supervisors need quick check-ins, clear assignments, safety reminders, and a way to document progress from the field.",
    destination: "Track attendance, support youth, complete observations, flag needs, and close the day with notes.",
    details: [
      { title: "Phone-first assessment", text: "The supervisor view is designed for mobile use: quick taps, simple forms, clear statuses, and no office dependency." },
      { title: "Accountability", text: "Attendance, PPE, task completion, behavior, teamwork, and Life Skills Progression observations belong here." },
      { title: "Support loop", text: "Supervisors connect youth, parents/guardians, program leadership, and daily operations." },
    ],
    actions: [{ label: "Back to Youth Workforce", to: "youth" }, { label: "Scheduling", to: "planner" }, { label: "Support Resources", to: "wellness" }],
  },
  partner: {
    eyebrow: "Partner / Investor Pathway",
    title: "Support the infrastructure that lets the ecosystem work.",
    subtitle: "Partners help with tools, fencing, water, solar, transportation, workforce, education, wellness, market access, and operating capacity.",
    image: IMAGES.partner,
    imageAlt: "Partner pathway image",
    mission: "Make it easy for supporters to understand where their resources create direct impact.",
    need: "The farm needs reliable infrastructure, equipment, funding, technical support, and long-term collaboration.",
    destination: "Choose a sponsorship, partnership, donation, technical support role, or investment conversation.",
    details: [
      { title: "Specific asks", text: "Water, solar, fencing, storage, tools, tables, canopies, transportation, wash stations, and workforce supports are practical needs." },
      { title: "Measurable impact", text: "Partners should see how their support strengthens youth, growers, food access, and local enterprise." },
      { title: "Mutual benefit", text: "The strongest partnerships create value for the community and for the organizations involved." },
    ],
    actions: [{ label: "See Events", to: "events" }, { label: "Leave Feedback", to: "feedback" }, { label: "Return to Ecosystem", to: "ecosystem" }],
  },
  events: {
    eyebrow: "Events",
    title: "Events bring people back into the ecosystem.",
    subtitle: "Growers Supply Market, seed giveaways, demonstrations, wellness education, and community days create repeated entry points.",
    image: IMAGES.events,
    imageAlt: "Events image",
    mission: "Use events as living demonstrations of the food ecosystem.",
    need: "The community needs repeated, welcoming reasons to learn, shop, volunteer, and connect.",
    destination: "Attend, register, volunteer, sponsor, demonstrate, sell, or invite others.",
    details: [
      { title: "Return engine", text: "Events create repeated entry into the ecosystem for learning, shopping, and connection." },
      { title: "Demonstration space", text: "Partners, growers, youth, and value-added producers can show the work in real time." },
      { title: "Community trust", text: "Events make the farm visible, welcoming, useful, and memorable." },
    ],
    actions: [{ label: "Guest Experiences", to: "guest" }, { label: "Vendor & Market Flow", to: "marketplace" }, { label: "Health Education", to: "wellness" }],
  },
  wellness: {
    eyebrow: "Wellness / Nutrition",
    title: "Food is health, learning, culture, and confidence.",
    subtitle: "The wellness path connects produce, recipes, nutrition education, screenings, family support, and healthier daily choices.",
    image: IMAGES.wellness,
    imageAlt: "Wellness image",
    mission: "Help people use fresh food in practical, healthy, culturally meaningful ways.",
    need: "Fresh food access must be paired with confidence, recipes, nutrition knowledge, and supportive community experiences.",
    destination: "Shop, cook, learn, share, return, and improve family health habits.",
    details: [
      { title: "Nutrition education", text: "Customers and families can learn what to do with seasonal produce." },
      { title: "Mental wellness", text: "Gardening and outdoor participation support connection, calm, purpose, and belonging." },
      { title: "Family return loop", text: "Wellness connects customers, youth, parents, volunteers, and community partners." },
    ],
    actions: [{ label: "Customer Food Path", to: "customer" }, { label: "Shop Fresh Food", to: "marketplace" }, { label: "Nutrition View", modal: "nutrition" }],
  },
  decision: {
    eyebrow: "Ending Decision",
    title: "What do you want to do next?",
    subtitle: "Every pathway ends with a clear choice so the user does not get lost in the demo.",
    image: IMAGES.decision,
    imageAlt: "Decision image",
    mission: "Convert the experience into action.",
    need: "A demo must not only explain. It must help people decide how they belong in the ecosystem.",
    destination: "Choose a role, take action, share the farm, or leave feedback.",
    details: [
      { title: "I want to become a grower", text: "Move to planning, training, supplies, and marketplace coordination." },
      { title: "I want to support youth", text: "Move to the youth workforce and supervisor support pathways." },
      { title: "I want to shop, sponsor, or partner", text: "Move to marketplace, partner, or feedback/contact." },
    ],
    actions: [{ label: "Become a Grower", to: "grower" }, { label: "Support Youth", to: "youth" }, { label: "Feedback & Contact", to: "feedback" }],
  },
  feedback: {
    eyebrow: "Feedback / Contact",
    title: "Tell us how you want to connect.",
    subtitle: "The ecosystem closes with feedback, contact, sharing, and the next invitation back into the farm.",
    image: IMAGES.feedback,
    imageAlt: "Feedback image",
    mission: "Give every viewer a respectful way to respond, share, ask questions, or offer support.",
    need: "People need a clear final step after they understand the model.",
    destination: "Contact Bronson Family Farm, share the ecosystem, or return to a pathway.",
    details: [
      { title: "Contact", text: "Phone: 330-275-1604. Website: bronsonfamilyfarm.com." },
      { title: "Share", text: "Invite a grower, family, youth supervisor, partner, customer, or supporter to experience the farm." },
      { title: "Return", text: "The demo should always allow people to return to the ecosystem instead of ending abruptly." },
    ],
    actions: [{ label: "Return to Ecosystem", to: "ecosystem" }, { label: "Shop GrownBy", href: "https://grownby.com/farms/bronson-family-farm/shop" }, { label: "Decision Screen", to: "decision" }],
  },
};

function App() {
  const [screen, setScreen] = useState<ScreenKey>("home");
  const [lang, setLang] = useState<LangKey>("English");
  const [guided, setGuided] = useState(false);
  const [imageModal, setImageModal] = useState<string | null>(null);
  const t = UI[lang];
  const currentIndex = SCREEN_ORDER.indexOf(screen);
  const current = CONTENT[screen];

  const progress = useMemo(() => Math.round(((currentIndex + 1) / SCREEN_ORDER.length) * 100), [currentIndex]);

  const goto = (next: ScreenKey) => {
    setGuided(false);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextScreen = () => goto(SCREEN_ORDER[(currentIndex + 1) % SCREEN_ORDER.length]);
  const prevScreen = () => goto(SCREEN_ORDER[(currentIndex - 1 + SCREEN_ORDER.length) % SCREEN_ORDER.length]);

  useEffect(() => {
    if (!guided) return;
    const timer = window.setTimeout(() => {
      setScreen((prev) => {
        const i = SCREEN_ORDER.indexOf(prev);
        return SCREEN_ORDER[(i + 1) % SCREEN_ORDER.length];
      });
    }, 6800);
    return () => window.clearTimeout(timer);
  }, [guided, screen]);

  const performAction = (action: Action) => {
    if (action.href) window.open(action.href, "_blank", "noopener,noreferrer");
    if (action.modal) setImageModal(IMAGES[action.modal]);
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
          <select value={lang} onChange={(e) => setLang(e.target.value as LangKey)} style={styles.select}>
            {LANGS.map((item) => <option key={item}>{item}</option>)}
          </select>
          <button style={styles.smallBtn} onClick={() => setGuided((v) => !v)}>{guided ? t.pause : t.guided}</button>
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
              <button key={action.label} style={styles.whiteBtn} onClick={() => performAction(action)}>{action.label}</button>
            ))}
          </div>
        </article>
        <aside style={styles.imagePanel}>
          <img src={current.image} alt={current.imageAlt} style={styles.heroImage} onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGES.entrance; }} />
          <div style={styles.imageFade} />
          <div style={styles.imageCaption}>{current.imageAlt}</div>
        </aside>
      </section>

      {screen === "ecosystem" && (
        <section style={styles.rolesSection}>
          <div style={styles.sectionTitle}>{t.roles}</div>
          <div style={styles.roleGrid}>
            {ROLE_TILES.map((role) => (
              <button key={role.key} style={{ ...styles.roleTile, backgroundImage: `linear-gradient(180deg, rgba(5,20,14,.12), rgba(5,20,14,.88)), url(${role.image})` }} onClick={() => goto(role.key)}>
                <div style={styles.roleTitle}>{role.title}</div>
                <div style={styles.roleText}>{role.text}</div>
                <div style={styles.chips}>{role.next.map((item) => <span style={styles.chip} key={item}>{item}</span>)}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section style={styles.contentGrid}>
        <article style={styles.cardLarge}>
          <div style={styles.threeCol}>
            <InfoCard label={t.mission} text={current.mission} />
            <InfoCard label={t.need} text={current.need} />
            <InfoCard label={t.destination} text={current.destination} />
          </div>
          <div style={styles.detailGrid}>
            {current.details.map((block) => (
              <div key={block.title} style={styles.detailBlock}>
                <div style={styles.detailIcon}>✦</div>
                <div>
                  <h3 style={styles.detailTitle}>{block.title}</h3>
                  <p style={styles.detailText}>{block.text}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside style={styles.sideCard}>
          <div style={styles.miniLabel}>{t.strongest}</div>
          <div style={styles.sideActions}>{current.actions.map((action) => <button key={action.label} style={styles.ghostBtn} onClick={() => performAction(action)}>{action.label}</button>)}</div>
          <button style={styles.greenBtn} onClick={() => goto("decision")}>Ending Decision</button>
          <button style={styles.ghostBtn} onClick={() => goto("feedback")}>{t.feedback}</button>
          <div style={styles.miniLabel}>{t.gallery}</div>
          <div style={styles.galleryGrid}>
            {(["community", "training", "produce", "nutrition", "legacy"] as (keyof typeof IMAGES)[]).map((img) => (
              <button key={img} style={styles.galleryBtn} onClick={() => setImageModal(IMAGES[img])}>
                <img src={IMAGES[img]} alt={img} style={styles.galleryImg} onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGES.entrance; }} />
              </button>
            ))}
          </div>
        </aside>
      </section>

      <footer style={styles.footerNav}>
        <button style={styles.navBtn} onClick={prevScreen}>{t.back}</button>
        <button style={styles.navBtn} onClick={() => goto("ecosystem")}>{t.return}</button>
        <button style={styles.navBtn} onClick={nextScreen}>{t.next}</button>
      </footer>

      {imageModal && (
        <div style={styles.modalBackdrop} onClick={() => setImageModal(null)}>
          <div style={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setImageModal(null)}>×</button>
            <img src={imageModal} alt="Farm gallery" style={styles.modalImage} onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGES.entrance; }} />
          </div>
        </div>
      )}
    </main>
  );
}

function InfoCard({ label, text }: { label: string; text: string }) {
  return (
    <div style={styles.infoCard}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoText}>{text}</div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  shell: { minHeight: "100vh", color: "#fff", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial", position: "relative", overflowX: "hidden", padding: "20px clamp(16px, 3vw, 44px) 28px" },
  bg: { position: "fixed", inset: 0, background: "radial-gradient(circle at top left, rgba(185,138,72,.34), transparent 32%), radial-gradient(circle at top right, rgba(110,139,76,.30), transparent 30%), linear-gradient(135deg, #112016 0%, #1e3a25 40%, #4d3a1f 100%)", zIndex: -2 },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 14 },
  brandButton: { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.18)", color: "#fff", borderRadius: 18, padding: "10px 14px", cursor: "pointer" },
  brandMark: { width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: "rgba(255,255,255,.18)", fontWeight: 900 },
  brandTiny: { display: "block", fontSize: 11, letterSpacing: ".12em", opacity: .78, textAlign: "left" },
  brandTitle: { display: "block", fontSize: 16, fontWeight: 800, textAlign: "left" },
  topControls: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" },
  select: { borderRadius: 999, padding: "10px 14px", border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.92)", color: "#162314", fontWeight: 700 },
  smallBtn: { borderRadius: 999, padding: "10px 14px", border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.12)", color: "#fff", fontWeight: 800, cursor: "pointer" },
  progressWrap: { height: 7, background: "rgba(255,255,255,.12)", borderRadius: 999, overflow: "hidden", marginBottom: 20 },
  progressBar: { height: "100%", background: "rgba(255,255,255,.72)", borderRadius: 999, transition: "width .4s ease" },
  heroGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1.03fr) minmax(320px, .97fr)", gap: 22, alignItems: "stretch" },
  heroText: { minHeight: 430, borderRadius: 30, padding: "clamp(24px, 4vw, 56px)", background: "linear-gradient(135deg, rgba(255,255,255,.15), rgba(255,255,255,.07))", border: "1px solid rgba(255,255,255,.18)", boxShadow: "0 24px 80px rgba(0,0,0,.24)", display: "flex", flexDirection: "column", justifyContent: "center" },
  eyebrow: { fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 900, color: "rgba(255,255,255,.76)", marginBottom: 14 },
  title: { fontSize: "clamp(34px, 6vw, 72px)", lineHeight: .95, margin: 0, maxWidth: 900, fontWeight: 900, letterSpacing: "-.04em" },
  subtitle: { fontSize: "clamp(17px, 2vw, 22px)", lineHeight: 1.55, color: "rgba(255,255,255,.84)", maxWidth: 780, marginTop: 18 },
  actionRow: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 },
  whiteBtn: { border: 0, borderRadius: 999, padding: "13px 18px", background: "#fff", color: "#18301f", fontWeight: 900, cursor: "pointer", boxShadow: "0 10px 24px rgba(0,0,0,.16)" },
  imagePanel: { minHeight: 430, borderRadius: 30, overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,.18)", boxShadow: "0 24px 80px rgba(0,0,0,.26)" },
  heroImage: { width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 },
  imageFade: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.36))" },
  imageCaption: { position: "absolute", left: 18, right: 18, bottom: 18, padding: "12px 14px", borderRadius: 18, background: "rgba(0,0,0,.35)", backdropFilter: "blur(10px)", fontWeight: 800 },
  rolesSection: { marginTop: 22, borderRadius: 30, padding: 22, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.18)" },
  sectionTitle: { fontSize: 24, fontWeight: 900, marginBottom: 16 },
  roleGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 },
  roleTile: { minHeight: 220, textAlign: "left", color: "#fff", borderRadius: 24, border: "1px solid rgba(255,255,255,.18)", backgroundSize: "cover", backgroundPosition: "center", padding: 20, cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" },
  roleTitle: { fontSize: 24, fontWeight: 900, marginBottom: 8 },
  roleText: { lineHeight: 1.55, color: "rgba(255,255,255,.88)", marginBottom: 12 },
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "7px 10px", borderRadius: 999, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.18)", fontSize: 12, fontWeight: 800 },
  contentGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 22, marginTop: 22, alignItems: "start" },
  cardLarge: { borderRadius: 30, padding: 22, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.18)" },
  threeCol: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 18 },
  infoCard: { borderRadius: 22, padding: 18, background: "rgba(255,255,255,.11)", border: "1px solid rgba(255,255,255,.14)" },
  infoLabel: { fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", opacity: .75, fontWeight: 900, marginBottom: 10 },
  infoText: { lineHeight: 1.6, color: "rgba(255,255,255,.88)", fontWeight: 650 },
  detailGrid: { display: "grid", gap: 12 },
  detailBlock: { display: "grid", gridTemplateColumns: "38px 1fr", gap: 12, borderRadius: 22, padding: 16, background: "rgba(0,0,0,.14)", border: "1px solid rgba(255,255,255,.12)" },
  detailIcon: { width: 38, height: 38, borderRadius: 14, display: "grid", placeItems: "center", background: "rgba(255,255,255,.13)", fontWeight: 900 },
  detailTitle: { margin: 0, fontSize: 18 },
  detailText: { margin: "6px 0 0", lineHeight: 1.6, color: "rgba(255,255,255,.82)" },
  sideCard: { borderRadius: 30, padding: 18, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.18)", position: "sticky", top: 16 },
  miniLabel: { margin: "4px 0 12px", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", opacity: .74, fontWeight: 900 },
  sideActions: { display: "grid", gap: 10, marginBottom: 12 },
  ghostBtn: { width: "100%", borderRadius: 999, padding: "12px 14px", background: "rgba(255,255,255,.10)", color: "#fff", border: "1px solid rgba(255,255,255,.18)", fontWeight: 850, cursor: "pointer" },
  greenBtn: { width: "100%", borderRadius: 999, padding: "12px 14px", background: "rgba(210,236,161,.90)", color: "#18301f", border: 0, fontWeight: 950, cursor: "pointer", marginBottom: 10 },
  galleryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 },
  galleryBtn: { border: 0, padding: 0, borderRadius: 14, overflow: "hidden", background: "transparent", cursor: "pointer", aspectRatio: "1" },
  galleryImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  footerNav: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 22 },
  navBtn: { borderRadius: 999, padding: "12px 18px", background: "rgba(255,255,255,.12)", color: "#fff", border: "1px solid rgba(255,255,255,.18)", fontWeight: 900, cursor: "pointer" },
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 },
  modalPanel: { width: "min(980px, 96vw)", height: "min(720px, 88vh)", borderRadius: 28, overflow: "hidden", position: "relative", background: "#111", boxShadow: "0 24px 80px rgba(0,0,0,.45)" },
  modalImage: { width: "100%", height: "100%", objectFit: "contain", background: "#111" },
  closeBtn: { position: "absolute", right: 12, top: 12, zIndex: 2, width: 42, height: 42, borderRadius: 999, border: 0, background: "rgba(255,255,255,.92)", color: "#162314", fontSize: 28, cursor: "pointer" },
};

export default App;
