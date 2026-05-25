import React, { useMemo, useState } from "react";

type Screen = "home" | "roles" | "marketplace" | "partners";
type Stage = "entry" | "experience" | "decision" | "action" | "complete";

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

const UI: Record<Language, Record<string, string>> = {
  English: {
    home: "Home",
    guided: "Guided Tour",
    marketplace: "Marketplace",
    partners: "Partners",
    language: "Language",
    begin: "Begin Journey",
    continue: "Continue Journey",
    restart: "Restart Journey",
    complete: "Complete Pathway",
    completed: "Pathway Completed",
    next: "Choose Next Pathway",
    feedback: "Share Feedback",
    contact: "Contact Us",
    dashboard: "Open Dashboard",
    return: "Return To Ecosystem",
    explore: "Explore Pathways",
    stageEntry: "Entry",
    stageExperience: "Experience",
    stageDecision: "Decision",
    stageAction: "Action",
    stageComplete: "Complete",
    progress: "Ecosystem Progress",
  },
  Español: {
    home: "Inicio",
    guided: "Recorrido Guiado",
    marketplace: "Mercado",
    partners: "Socios",
    language: "Idioma",
    begin: "Comenzar Camino",
    continue: "Continuar Camino",
    restart: "Reiniciar Camino",
    complete: "Completar Ruta",
    completed: "Ruta Completada",
    next: "Elegir Próxima Ruta",
    feedback: "Compartir Opinión",
    contact: "Contáctenos",
    dashboard: "Abrir Panel",
    return: "Volver Al Ecosistema",
    explore: "Explorar Rutas",
    stageEntry: "Entrada",
    stageExperience: "Experiencia",
    stageDecision: "Decisión",
    stageAction: "Acción",
    stageComplete: "Completo",
    progress: "Progreso Del Ecosistema",
  },
  Tagalog: {
    home: "Home",
    guided: "Gabay Na Tour",
    marketplace: "Pamilihan",
    partners: "Mga Kasosyo",
    language: "Wika",
    begin: "Simulan Ang Landas",
    continue: "Ipagpatuloy",
    restart: "Ulitin Ang Landas",
    complete: "Tapusin Ang Landas",
    completed: "Natapos Ang Landas",
    next: "Pumili Ng Susunod",
    feedback: "Magbigay Ng Puna",
    contact: "Makipag-ugnayan",
    dashboard: "Buksan Ang Dashboard",
    return: "Bumalik Sa Ecosystem",
    explore: "Tingnan Ang Mga Landas",
    stageEntry: "Pasok",
    stageExperience: "Karanasan",
    stageDecision: "Desisyon",
    stageAction: "Aksyon",
    stageComplete: "Tapos",
    progress: "Progreso Ng Ecosystem",
  },
  Italiano: {
    home: "Home",
    guided: "Tour Guidato",
    marketplace: "Mercato",
    partners: "Partner",
    language: "Lingua",
    begin: "Inizia Percorso",
    continue: "Continua Percorso",
    restart: "Ricomincia",
    complete: "Completa Percorso",
    completed: "Percorso Completato",
    next: "Scegli Prossimo Percorso",
    feedback: "Condividi Feedback",
    contact: "Contattaci",
    dashboard: "Apri Dashboard",
    return: "Torna All'Ecosistema",
    explore: "Esplora Percorsi",
    stageEntry: "Ingresso",
    stageExperience: "Esperienza",
    stageDecision: "Decisione",
    stageAction: "Azione",
    stageComplete: "Completo",
    progress: "Progresso Ecosistema",
  },
  עברית: {
    home: "בית",
    guided: "סיור מודרך",
    marketplace: "שוק",
    partners: "שותפים",
    language: "שפה",
    begin: "התחל מסלול",
    continue: "המשך מסלול",
    restart: "התחל מחדש",
    complete: "סיים מסלול",
    completed: "המסלול הושלם",
    next: "בחר מסלול הבא",
    feedback: "שתף משוב",
    contact: "צור קשר",
    dashboard: "פתח לוח בקרה",
    return: "חזור לאקוסיסטם",
    explore: "חקור מסלולים",
    stageEntry: "כניסה",
    stageExperience: "חוויה",
    stageDecision: "החלטה",
    stageAction: "פעולה",
    stageComplete: "הושלם",
    progress: "התקדמות אקוסיסטם",
  },
  Français: {
    home: "Accueil",
    guided: "Visite Guidée",
    marketplace: "Marché",
    partners: "Partenaires",
    language: "Langue",
    begin: "Commencer Le Parcours",
    continue: "Continuer",
    restart: "Recommencer",
    complete: "Terminer Le Parcours",
    completed: "Parcours Terminé",
    next: "Choisir Le Prochain Parcours",
    feedback: "Partager Un Avis",
    contact: "Nous Contacter",
    dashboard: "Ouvrir Le Tableau",
    return: "Retour À L'Écosystème",
    explore: "Explorer Les Parcours",
    stageEntry: "Entrée",
    stageExperience: "Expérience",
    stageDecision: "Décision",
    stageAction: "Action",
    stageComplete: "Terminé",
    progress: "Progrès De L'Écosystème",
  },
};

function tx(language: Language, key: string) {
  return UI[language][key] || UI.English[key] || key;
}

type Pathway = {
  key: PathwayKey;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  image: string;
  need: Record<Language, string>;
  entry: Record<Language, string>;
  experience: Record<Language, string[]>;
  decisions: Record<Language, string[]>;
  actions: Record<Language, string[]>;
  next: PathwayKey[];
};

const en = (v: string) => ({
  English: v,
  Español: v,
  Tagalog: v,
  Italiano: v,
  עברית: v,
  Français: v,
});

const arr = (v: string[]) => ({
  English: v,
  Español: v,
  Tagalog: v,
  Italiano: v,
  עברית: v,
  Français: v,
});

const pathways: Record<PathwayKey, Pathway> = {
  guest: {
    key: "guest",
    title: {
      English: "Guest Pathway",
      Español: "Ruta Del Invitado",
      Tagalog: "Landas Ng Bisita",
      Italiano: "Percorso Ospite",
      עברית: "מסלול אורח",
      Français: "Parcours Invité",
    },
    subtitle: en("Understand the farm, the story, the purpose, and where you belong."),
    image: IMG.queens,
    need: en("People need an easy first doorway into the farm without confusion."),
    entry: en("You enter the farm as a visitor and discover that this is more than land. It is a living system for food, health, youth, families, growers, and community restoration."),
    experience: arr([
      "See the farm story and why the land matters.",
      "Understand how food access, workforce, wellness, and marketplace systems connect.",
      "Explore which role fits you best: customer, volunteer, grower, partner, sponsor, or family supporter.",
      "Move from curiosity into participation.",
    ]),
    decisions: arr([
      "Do I want to visit the marketplace?",
      "Do I want to volunteer?",
      "Do I want to support youth workforce?",
      "Do I want to become a grower or partner?",
    ]),
    actions: arr([
      "Choose a role pathway.",
      "Share feedback.",
      "Register interest.",
      "Return to the ecosystem with a clear next step.",
    ]),
    next: ["customer", "volunteer", "grower", "partner"],
  },
  grower: {
    key: "grower",
    title: {
      English: "Grower Pathway",
      Español: "Ruta Del Productor",
      Tagalog: "Landas Ng Grower",
      Italiano: "Percorso Coltivatore",
      עברית: "מסלול מגדל",
      Français: "Parcours Cultivateur",
    },
    subtitle: en("Connect growers to tools, knowledge, land, market access, and support."),
    image: IMG.growArea,
    need: en("Growers need infrastructure, training, visibility, and a path to market."),
    entry: en("The grower enters the ecosystem to learn how production, soil, fencing, seedlings, tools, training, and marketplace access work together."),
    experience: arr([
      "Review growing areas, crop planning, compost, fencing, and seasonal production.",
      "Connect to training, demonstrations, and support from experienced growers.",
      "Understand how produce moves into the marketplace and community distribution.",
      "Identify what the grower needs next: land, tools, seeds, market access, mentorship, or sales support.",
    ]),
    decisions: arr([
      "Do I want to become a grower in the ecosystem?",
      "Do I need supplies, training, or infrastructure support?",
      "Do I want to sell through the marketplace?",
      "Do I want to mentor youth or new growers?",
    ]),
    actions: arr([
      "Submit grower interest.",
      "Join Growers Supply Market.",
      "Request resources or training.",
      "Continue to marketplace or partner pathway.",
    ]),
    next: ["marketplace", "valueAdded", "partner", "youth"],
  },
  youth: {
    key: "youth",
    title: {
      English: "Youth Workforce Pathway",
      Español: "Ruta Laboral Juvenil",
      Tagalog: "Landas Ng Kabataang Manggagawa",
      Italiano: "Percorso Giovani Lavoratori",
      עברית: "מסלול נוער עובד",
      Français: "Parcours Jeunesse Travail",
    },
    subtitle: en("A structured farm-based workforce journey from orientation to leadership."),
    image: IMG.youth1,
    need: en("Youth need responsibility, structure, encouragement, skills, and visible progress."),
    entry: en("The youth participant begins with orientation, expectations, safety, team assignment, and a clear understanding that work on the farm builds real-world readiness."),
    experience: arr([
      "Complete orientation and media/participation releases.",
      "Check in daily with attendance and PPE verification.",
      "Receive supervisor assignment and daily work zone.",
      "Practice farm tasks, teamwork, communication, and responsibility.",
      "Earn skills through rubrics, checklists, milestones, and reflection.",
      "Connect progress to parents, guardians, supervisors, and future opportunities.",
    ]),
    decisions: arr([
      "Am I ready to work safely today?",
      "What skill am I building?",
      "Do I need supervisor support?",
      "Do I want to become a youth leader, grower, culinary participant, or mentor?",
    ]),
    actions: arr([
      "Complete daily check-in.",
      "Review PPE and assignment.",
      "Submit reflection.",
      "Advance to next milestone.",
      "Share progress with parent or guardian.",
    ]),
    next: ["supervisor", "parent", "grower", "valueAdded"],
  },
  customer: {
    key: "customer",
    title: {
      English: "Customer Pathway",
      Español: "Ruta Del Cliente",
      Tagalog: "Landas Ng Customer",
      Italiano: "Percorso Cliente",
      עברית: "מסלול לקוח",
      Français: "Parcours Client",
    },
    subtitle: en("Help families find fresh food, seedlings, nutrition, and repeat access."),
    image: IMG.marketplaceHero,
    need: en("Customers need simple access to food, seedlings, information, and healthy choices."),
    entry: en("The customer enters through food, seedlings, nutrition, events, and marketplace access, then discovers how each purchase supports local growers and youth workforce."),
    experience: arr([
      "Browse produce, seedlings, Bubble Babies™, herbs, greens, and seasonal items.",
      "Learn what is fresh, local, SNAP-eligible where applicable, and ready for pickup or event access.",
      "Receive nutrition, growing, and food-use information.",
      "Move from one purchase into repeat healthy participation.",
    ]),
    decisions: arr([
      "Do I want to buy food or seedlings?",
      "Do I want to learn how to grow?",
      "Do I want to attend the next market event?",
      "Do I want to share this with family or neighbors?",
    ]),
    actions: arr([
      "Visit marketplace.",
      "Preorder items.",
      "Save event information.",
      "Share feedback or request support.",
    ]),
    next: ["marketplace", "guest", "volunteer", "grower"],
  },
  marketplace: {
    key: "marketplace",
    title: {
      English: "Marketplace Pathway",
      Español: "Ruta Del Mercado",
      Tagalog: "Landas Ng Pamilihan",
      Italiano: "Percorso Mercato",
      עברית: "מסלול שוק",
      Français: "Parcours Marché",
    },
    subtitle: en("Move food, supplies, education, vendors, and growers into one system."),
    image: IMG.seeds,
    need: en("The community needs a place where food, growers, tools, and education connect."),
    entry: en("The marketplace is where food access becomes visible. It connects seedlings, produce, demonstrations, wellness, vendors, growers, and community purchasing power."),
    experience: arr([
      "Show seedlings, produce, seeds, growing supplies, and demonstrations.",
      "Connect customers to growers and value-added producers.",
      "Support preorders, event participation, SNAP-aware shopping, and community distribution.",
      "Use the marketplace as a repeat entry point into the ecosystem.",
    ]),
    decisions: arr([
      "Do I want to buy?",
      "Do I want to sell?",
      "Do I want to demonstrate or teach?",
      "Do I want to sponsor access for families?",
    ]),
    actions: arr([
      "Open marketplace access.",
      "Join as vendor or grower.",
      "Connect to customer pathway.",
      "Continue to value-added or partner pathway.",
    ]),
    next: ["customer", "grower", "valueAdded", "partner"],
  },
  partner: {
    key: "partner",
    title: {
      English: "Partner Pathway",
      Español: "Ruta De Socios",
      Tagalog: "Landas Ng Kasosyo",
      Italiano: "Percorso Partner",
      עברית: "מסלול שותפים",
      Français: "Parcours Partenaire",
    },
    subtitle: en("Align schools, sponsors, universities, agencies, and community organizations."),
    image: IMG.partners,
    need: en("Partners need clear ways to contribute resources, programs, funding, and expertise."),
    entry: en("Partners enter the ecosystem by identifying how their mission aligns with food access, youth workforce, wellness, education, land restoration, and community revitalization."),
    experience: arr([
      "Review partnership lanes: education, health, workforce, infrastructure, funding, media, logistics, and volunteers.",
      "Match resources to ecosystem needs.",
      "Support youth, growers, marketplace events, or land restoration.",
      "Create visible community benefit through shared action.",
    ]),
    decisions: arr([
      "Do we want to sponsor?",
      "Do we want to provide materials or training?",
      "Do we want to host or support programming?",
      "Do we want to become a long-term ecosystem partner?",
    ]),
    actions: arr([
      "Select partnership lane.",
      "Define contribution.",
      "Connect with farm leadership.",
      "Move into sponsor, workforce, grower, or marketplace support.",
    ]),
    next: ["supervisor", "marketplace", "grower", "volunteer"],
  },
  volunteer: {
    key: "volunteer",
    title: {
      English: "Volunteer Pathway",
      Español: "Ruta Del Voluntario",
      Tagalog: "Landas Ng Volunteer",
      Italiano: "Percorso Volontario",
      עברית: "מסלול מתנדב",
      Français: "Parcours Bénévole",
    },
    subtitle: en("Turn community goodwill into useful, safe, organized action."),
    image: IMG.volunteers,
    need: en("Volunteers need clear tasks, safety expectations, and a way to see impact."),
    entry: en("The volunteer joins the farm through organized service that supports growing, events, setup, youth, distribution, beautification, and community care."),
    experience: arr([
      "Choose service area: farm work, events, youth support, outreach, setup, teardown, or beautification.",
      "Review safety and site expectations.",
      "Receive task assignment and time commitment.",
      "See how volunteer work supports food access and youth development.",
    ]),
    decisions: arr([
      "What can I help with?",
      "How much time can I give?",
      "Do I want to support events, youth, growers, or land care?",
      "Do I want to become a regular volunteer?",
    ]),
    actions: arr([
      "Select volunteer role.",
      "Confirm availability.",
      "Join event or weekly service schedule.",
      "Share feedback after service.",
    ]),
    next: ["guest", "youth", "marketplace", "partner"],
  },
  valueAdded: {
    key: "valueAdded",
    title: {
      English: "Value-Added Producer Pathway",
      Español: "Ruta De Producto Con Valor Agregado",
      Tagalog: "Landas Ng Value-Added Producer",
      Italiano: "Percorso Produttore Trasformato",
      עברית: "מסלול יצרן ערך מוסף",
      Français: "Parcours Producteur À Valeur Ajoutée",
    },
    subtitle: en("Connect culinary, herbs, mushrooms, flowers, preservation, and product ideas."),
    image: IMG.culinaryFlowers,
    need: en("Producers need a bridge from raw food to education, products, demonstrations, and sales."),
    entry: en("The value-added pathway helps participants imagine what produce can become through cooking, herbs, edible flowers, mushrooms, preservation, teaching, and product development."),
    experience: arr([
      "Explore culinary education, edible flowers, mushrooms, herbs, and preserved foods.",
      "Connect production to demonstrations and youth learning.",
      "Identify products suitable for events, marketplace, and partner programs.",
      "Build a bridge between growing, wellness, culture, and revenue.",
    ]),
    decisions: arr([
      "Do I want to teach or demonstrate?",
      "Do I want to develop a product?",
      "Do I need kitchen, food safety, or packaging support?",
      "Do I want to sell through the marketplace?",
    ]),
    actions: arr([
      "Choose product concept.",
      "Connect to marketplace.",
      "Request training or demonstration space.",
      "Continue to grower or partner pathway.",
    ]),
    next: ["marketplace", "grower", "customer", "partner"],
  },
  supervisor: {
    key: "supervisor",
    title: {
      English: "Supervisor Pathway",
      Español: "Ruta Del Supervisor",
      Tagalog: "Landas Ng Supervisor",
      Italiano: "Percorso Supervisore",
      עברית: "מסלול מדריך",
      Français: "Parcours Superviseur",
    },
    subtitle: en("Support youth safely through attendance, PPE, assignments, skills, and feedback."),
    image: IMG.youth2,
    need: en("Supervisors need a simple phone-friendly system for daily management."),
    entry: en("The supervisor pathway turns the youth program into a trackable daily operation with attendance, PPE, work zones, skills, behavior notes, milestones, and parent connection."),
    experience: arr([
      "Confirm youth attendance and arrival.",
      "Verify PPE before work begins.",
      "Assign work zones and daily tasks.",
      "Observe teamwork, communication, safety, and responsibility.",
      "Record skill progress and daily notes.",
      "Flag support needs and parent/guardian updates.",
    ]),
    decisions: arr([
      "Is this youth ready to work today?",
      "What task or zone should they receive?",
      "What skill did they practice?",
      "Does a parent, guardian, or program leader need an update?",
    ]),
    actions: arr([
      "Open supervisor dashboard.",
      "Complete attendance and PPE check.",
      "Submit skill observation.",
      "Send progress note.",
      "Advance youth milestone.",
    ]),
    next: ["youth", "parent", "partner", "volunteer"],
  },
  parent: {
    key: "parent",
    title: {
      English: "Parent & Guardian Pathway",
      Español: "Ruta De Padres Y Tutores",
      Tagalog: "Landas Ng Magulang At Guardian",
      Italiano: "Percorso Genitori E Tutori",
      עברית: "מסלול הורים ואפוטרופוסים",
      Français: "Parcours Parent Et Tuteur",
    },
    subtitle: en("Keep families connected to youth progress, safety, growth, and opportunity."),
    image: IMG.sameera4,
    need: en("Families need visibility, trust, communication, and pride in youth development."),
    entry: en("Parents and guardians enter the ecosystem to see how youth are growing through work, responsibility, safety, teamwork, nutrition, leadership, and community participation."),
    experience: arr([
      "View attendance and participation.",
      "See milestones and skills earned.",
      "Receive supervisor feedback and support notes.",
      "Understand how the farm experience builds confidence and readiness.",
      "Connect family participation to events, volunteering, and continued opportunities.",
    ]),
    decisions: arr([
      "How is my youth progressing?",
      "What support does my youth need?",
      "Do I want to volunteer or attend an event?",
      "Do I want my family to continue in the ecosystem?",
    ]),
    actions: arr([
      "Review youth progress.",
      "Respond to supervisor note.",
      "Register for family engagement.",
      "Continue into volunteer, customer, or guest pathway.",
    ]),
    next: ["youth", "supervisor", "volunteer", "customer"],
  },
};

const order: PathwayKey[] = [
  "guest",
  "customer",
  "grower",
  "marketplace",
  "youth",
  "supervisor",
  "parent",
  "valueAdded",
  "volunteer",
  "partner",
];

const stageOrder: Stage[] = ["entry", "experience", "decision", "action", "complete"];

function Navigation({
  screen,
  setScreen,
  language,
}: {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  language: Language;
}) {
  const nav: { key: Screen; label: string }[] = [
    { key: "home", label: tx(language, "home") },
    { key: "roles", label: tx(language, "guided") },
    { key: "marketplace", label: tx(language, "marketplace") },
    { key: "partners", label: tx(language, "partners") },
  ];

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {nav.map((item) => (
        <button
          key={item.key}
          onClick={() => setScreen(item.key)}
          className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
            screen === item.key
              ? "bg-white text-black"
              : "border border-white/10 bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function Shell({
  children,
  screen,
  setScreen,
  background = IMG.hero,
  language,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  background?: string;
  language: Language;
}) {
  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-black text-white ${
        language === "עברית" ? "text-right" : "text-left"
      }`}
      dir={language === "עברית" ? "rtl" : "ltr"}
    >
      <div className="fixed inset-0">
        <img
          src={background}
          alt="Bronson Family Farm"
          className="h-full w-full scale-[1.02] object-cover brightness-[1.02] contrast-[1.08] saturate-[1.08]"
        />
      </div>

      <div className="fixed inset-0 bg-black/42" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,220,120,.09),transparent_24%),radial-gradient(circle_at_bottom,rgba(16,185,129,.12),transparent_32%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-5 md:px-8">
        <Navigation screen={screen} setScreen={setScreen} language={language} />
        {children}
      </div>
    </div>
  );
}

function LanguagePicker({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">
        {tx(language, "language")}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              language === lang
                ? "bg-white text-black"
                : "border border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}

function
