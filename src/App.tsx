import React, { useMemo, useState } from "react";

type Screen =
  | "home"
  | "roles"
  | "marketplace"
  | "partners"
  | "journey"
  | "weather"
  | "cropPlanner"
  | "growPlan"
  | "assessments"
  | "parentConnect"
  | "liveChannels"
  | "proverbs"
  | "data"
  | "contact";

type Language =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "עברית"
  | "Français";

type RoleKey =
  | "guest"
  | "grower"
  | "youth"
  | "customer"
  | "marketplace"
  | "partner"
  | "supervisor"
  | "parent"
  | "volunteer"
  | "valueAdded"
  | "admin";

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

const copy: Record<
  Language,
  {
    homeTitle: string;
    homeSubtitle: string;
    begin: string;
    marketplace: string;
    partners: string;
    roleIntro: string;
  }
> = {
  English: {
    homeTitle: "Step Into The Farm.\nExperience The Wonders Of Life.",
    homeSubtitle:
      "A living ecosystem connecting youth workforce development, growers, marketplace systems, schools, wellness, agritourism, food access, leadership, and community revitalization.",
    begin: "Begin Guided Tour",
    marketplace: "Marketplace",
    partners: "Partners",
    roleIntro:
      "Guests, growers, youth, customers, partners, supervisors, and families all move through different experiences while strengthening the same ecosystem.",
  },
  Español: {
    homeTitle: "Entre a la granja.\nExperimente las maravillas de la vida.",
    homeSubtitle:
      "Un ecosistema vivo que conecta desarrollo juvenil, agricultores, mercado, escuelas, bienestar, acceso a alimentos, liderazgo y revitalización comunitaria.",
    begin: "Comenzar recorrido",
    marketplace: "Mercado",
    partners: "Socios",
    roleIntro:
      "Invitados, agricultores, jóvenes, clientes, socios, supervisores y familias avanzan por experiencias distintas mientras fortalecen el mismo ecosistema.",
  },
  Tagalog: {
    homeTitle: "Pumasok Sa Bukid.\nMaranasan Ang Ganda Ng Buhay.",
    homeSubtitle:
      "Isang buhay na ecosystem na nag-uugnay sa youth workforce, growers, marketplace, paaralan, wellness, food access, leadership, at community revitalization.",
    begin: "Simulan Ang Tour",
    marketplace: "Marketplace",
    partners: "Partners",
    roleIntro:
      "Ang guests, growers, kabataan, customers, partners, supervisors, at pamilya ay may sariling landas na nagpapalakas sa iisang ecosystem.",
  },
  Italiano: {
    homeTitle: "Entra Nella Fattoria.\nVivi Le Meraviglie Della Vita.",
    homeSubtitle:
      "Un ecosistema vivente che collega giovani, coltivatori, mercato, scuole, benessere, accesso al cibo, leadership e rinascita comunitaria.",
    begin: "Inizia il tour",
    marketplace: "Mercato",
    partners: "Partner",
    roleIntro:
      "Ospiti, coltivatori, giovani, clienti, partner, supervisori e famiglie seguono percorsi diversi rafforzando lo stesso ecosistema.",
  },
  עברית: {
    homeTitle: "היכנסו אל החווה.\nחוו את פלאי החיים.",
    homeSubtitle:
      "מערכת חיה המחברת נוער, מגדלים, שוק, בתי ספר, בריאות, גישה למזון, מנהיגות והתחדשות קהילתית.",
    begin: "התחל סיור",
    marketplace: "שוק",
    partners: "שותפים",
    roleIntro:
      "אורחים, מגדלים, נוער, לקוחות, שותפים, מפקחים ומשפחות נעים במסלולים שונים ומחזקים את אותה מערכת.",
  },
  Français: {
    homeTitle: "Entrez Dans La Ferme.\nDécouvrez Les Merveilles De La Vie.",
    homeSubtitle:
      "Un écosystème vivant qui relie jeunes, producteurs, marché, écoles, bien-être, accès alimentaire, leadership et revitalisation communautaire.",
    begin: "Commencer la visite",
    marketplace: "Marché",
    partners: "Partenaires",
    roleIntro:
      "Invités, producteurs, jeunes, clients, partenaires, superviseurs et familles suivent des parcours différents tout en renforçant le même écosystème.",
  },
};

const roleData: Record<
  RoleKey,
  {
    label: string;
    image: string;
    purpose: string;
    need: string;
    experience: string[];
    tools: string[];
    decision: string;
    share: string;
  }
> = {
  guest: {
    label: "Guest Pathway",
    image: IMG.queens,
    purpose: "Experience the farm story, land, people, and invitation before choosing how to participate.",
    need: "A visitor needs a welcoming, clear, beautiful first entry into the ecosystem.",
    experience: [
      "Arrive through the farm welcome experience.",
      "Understand the place, purpose, and community vision.",
      "See how food, youth, growers, and partners connect.",
      "Choose a next step: return, shop, volunteer, donate, invite, or partner.",
    ],
    tools: ["Welcome screen", "Farm story", "Event information", "Feedback form"],
    decision: "Do I want to return, invite someone, volunteer, shop, or support the farm?",
    share: "Invite another family, community member, organization, school, grower, or funder to experience the farm.",
  },
  grower: {
    label: "Grower Pathway",
    image: IMG.growArea,
    purpose: "Help growers plan crops, track tasks, learn production, and connect to market opportunity.",
    need: "Growers need tools, timing, education, supplies, weather awareness, and market access.",
    experience: [
      "Identify growing space and production goals.",
      "Use the crop planner to select crops.",
      "Build a grow plan by week and task.",
      "Track weather, watering, pests, harvest, and market readiness.",
      "Decide whether to sell, teach, volunteer, or join the growers supply market.",
    ],
    tools: ["Crop planner", "Grow plan", "Weather checks", "Task journal", "Market readiness checklist"],
    decision: "Do I want to become a grower, vendor, learner, partner grower, or food producer?",
    share: "Share crop plans, growing needs, available produce, and learning opportunities with the ecosystem.",
  },
  youth: {
    label: "Youth Workforce Pathway",
    image: IMG.youth2,
    purpose: "Build responsibility, skills, confidence, teamwork, leadership, and future readiness through real work.",
    need: "Youth need structure, safety, meaningful work, encouragement, and visible progress.",
    experience: [
      "Complete orientation before the first workday.",
      "Check in daily by crew and supervisor.",
      "Review PPE, safety, weather, and assignment.",
      "Complete farm, market, learning, or operations tasks.",
      "Reflect on what was learned and receive supervisor feedback.",
      "Earn badges and progress toward leadership.",
    ],
    tools: ["Daily checklist", "Skills checklist", "Attendance", "Reflection", "Badges", "Supervisor assessment"],
    decision: "What skill did I build today, and what responsibility am I ready to take next?",
    share: "Share approved progress, achievements, badges, photos, reflections, and program outcomes with family.",
  },
  customer: {
    label: "Customer Pathway",
    image: IMG.marketplaceHero,
    purpose: "Connect families to fresh food, seedlings, seeds, nutrition education, and repeat healthy choices.",
    need: "Customers need access, clarity, pricing, ordering, pickup, nutrition support, and trust.",
    experience: [
      "Explore what is fresh, growing, or available.",
      "Review produce, seedlings, seeds, bundles, and value-added options.",
      "Use QR links for ordering or event participation.",
      "Choose pickup, market visit, or future order.",
      "Receive education that supports household food decisions.",
    ],
    tools: ["Marketplace", "GrownBy ordering", "SNAP-aware item notes", "Product labels", "QR codes"],
    decision: "What do I want to buy, grow, cook, learn, or share with my household?",
    share: "Share the market link, product availability, recipes, seedlings, and nutrition education with others.",
  },
  marketplace: {
    label: "Marketplace Pathway",
    image: IMG.marketplaceHero,
    purpose: "Move food, seedlings, seeds, value-added goods, and education into community purchasing power.",
    need: "The marketplace needs inventory visibility, vendor flow, customer trust, payment direction, and repeat engagement.",
    experience: [
      "View available products and grower offerings.",
      "Identify what is SNAP-eligible or household-ready.",
      "Connect to ordering, pickup, or event booth activity.",
      "Track what is sold, requested, donated, or needed.",
    ],
    tools: ["Inventory board", "Product cards", "Vendor list", "QR ordering", "Pickup notes"],
    decision: "Am I buying, selling, reserving, donating, or becoming a marketplace participant?",
    share: "Share product links, event links, vendor opportunities, and marketplace needs.",
  },
  partner: {
    label: "Partner Pathway",
    image: IMG.partners,
    purpose: "Align schools, funders, agencies, businesses, educators, growers, and community partners around shared outcomes.",
    need: "Partners need to know where they fit, what is needed, and what impact their support creates.",
    experience: [
      "Review ecosystem priorities and current needs.",
      "Choose a support area: youth, food, supplies, infrastructure, education, wellness, media, or funding.",
      "Connect contribution to measurable outcomes.",
      "Receive follow-up and impact reporting.",
    ],
    tools: ["Partner menu", "Needs list", "Impact dashboard", "Contact form", "Report summary"],
    decision: "What can my organization sponsor, donate, teach, fund, build, or support?",
    share: "Share the opportunity with leadership, staff, funders, board members, and community networks.",
  },
  supervisor: {
    label: "Supervisor Pathway",
    image: IMG.fencing,
    purpose: "Give supervisors and aides a phone-friendly system to track youth progress, safety, attendance, and growth.",
    need: "Supervisors need fast daily tools that work in the field without confusion.",
    experience: [
      "Open the supervisor dashboard on a phone.",
      "Take attendance and assign crews.",
      "Review PPE and safety readiness.",
      "Observe participation, teamwork, effort, and skills.",
      "Submit daily notes, incidents, and progress.",
      "Flag youth needing support, celebration, redirection, or leadership opportunity.",
    ],
    tools: ["Mobile assessment", "Attendance", "Crew assignment", "Incident log", "Progress dashboard"],
    decision: "Which youth needs support, recognition, redirection, or advancement today?",
    share: "Share progress summaries with admin and approved updates with parents or guardians.",
  },
  parent: {
    label: "Parent / Guardian Pathway",
    image: IMG.sameera4,
    purpose: "Keep families connected to youth safety, schedule, growth, expectations, and accomplishments.",
    need: "Parents and guardians need trust, visibility, reminders, communication, and celebration.",
    experience: [
      "Review program dates, hours, expectations, and safety rules.",
      "Receive weekly progress and schedule updates.",
      "View badges, skills, and supervisor notes when approved.",
      "Send questions, concerns, or absence notes.",
      "Celebrate youth growth and completion.",
    ],
    tools: ["Parent connection", "Schedule", "Progress summary", "Message form", "Celebration notes"],
    decision: "How can I support my youth’s growth and help them succeed this summer?",
    share: "Share youth achievements, program updates, and invitations with family and trusted supporters.",
  },
  volunteer: {
    label: "Volunteer Pathway",
    image: IMG.volunteers,
    purpose: "Match community members to useful farm, event, market, youth, and infrastructure tasks.",
    need: "Volunteers need simple instructions, clear tasks, safe conditions, and appreciation.",
    experience: [
      "Choose an area of interest.",
      "Review workday, clothing, and safety expectations.",
      "Check in on arrival.",
      "Complete assigned task with a crew or lead.",
      "Log volunteer contribution and next availability.",
    ],
    tools: ["Volunteer sign-up", "Workday calendar", "Task list", "Safety notes", "Contribution log"],
    decision: "When can I serve, and what task am I prepared to do?",
    share: "Invite friends, family, service groups, churches, clubs, or coworkers to volunteer.",
  },
  valueAdded: {
    label: "Value-Added Producer Pathway",
    image: IMG.culinaryFlowers,
    purpose: "Turn crops, herbs, mushrooms, flowers, and farm products into education, food, demonstrations, and revenue.",
    need: "Value-added producers need product ideas, safety awareness, labels, ingredients, and market connection.",
    experience: [
      "Review available crops and farm products.",
      "Choose a product, recipe, demonstration, or educational activity.",
      "Review food safety, labeling, and presentation needs.",
      "Prepare for market, workshop, or tasting.",
      "Connect product to revenue and community wellness.",
    ],
    tools: ["Recipe planner", "Product worksheet", "Food safety checklist", "Label guide", "Market booth planner"],
    decision: "What can I create from farm products that serves families and builds sustainability?",
    share: "Share recipes, demos, product ideas, photos, classes, and marketplace opportunities.",
  },
  admin: {
    label: "Admin / Operations Pathway",
    image: IMG.wkbn,
    purpose: "Operate the full ecosystem through data, scheduling, reporting, communications, and accountability.",
    need: "Admin needs one command center for youth, crops, market, partners, volunteers, and reports.",
    experience: [
      "Review daily dashboard.",
      "Check attendance, assignments, weather, and safety.",
      "Monitor crops, inventory, harvest, and marketplace needs.",
      "Track partners, donations, volunteers, and follow-up.",
      "Prepare weekly reports and next-step decisions.",
    ],
    tools: ["Operations dashboard", "Inventory", "Reports", "Partner tracker", "Program metrics", "Contact log"],
    decision: "What must be handled today to keep the ecosystem safe, productive, and moving?",
    share: "Share reports, dashboards, needs, outcomes, and invitations with leadership and partners.",
  },
};

const cropRows = [
  ["Tomatoes", "Seedling / transplant", "Warm season", "Stake, prune, water consistently, track harvest."],
  ["Collards", "Seedling / transplant", "Cool + warm tolerant", "Harvest outer leaves and track bundle volume."],
  ["Mustard Greens", "Seed / transplant", "Cool season", "Fast-growing crop for market and food access."],
  ["Peppers", "Transplant", "Warm season", "Needs heat, steady moisture, and harvest tracking."],
  ["Cabbage", "Transplant", "Cool season", "Monitor pests, spacing, and head formation."],
  ["Corn", "Direct seed", "Warm season", "Plant in blocks for pollination and youth learning."],
  ["Cucumbers", "Direct / transplant", "Warm season", "Trellis if possible and monitor water."],
  ["Watermelon", "Direct / transplant", "Warm season", "Needs space, heat, water, and timing."],
  ["Cantaloupe", "Direct / transplant", "Warm season", "Track vines, fruit set, and harvest window."],
  ["Herbs", "Seed / transplant", "Flexible", "Good for bundles, culinary education, and value-added products."],
];

const proverbs = [
  "Where there is no vision, the people perish. — Proverbs 29:18",
  "The plans of the diligent lead surely to abundance. — Proverbs 21:5",
  "Let us not grow weary in doing good. — Galatians 6:9",
  "By wisdom a house is built, and by understanding it is established. — Proverbs 24:3",
  "Whatever your hand finds to do, do it with your might. — Ecclesiastes 9:10",
];

function Navigation({
  screen,
  setScreen,
}: {
  screen: Screen;
  setScreen: (screen: Screen) => void;
}) {
  const navItems: { key: Screen; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "roles", label: "Guided Tour" },
    { key: "marketplace", label: "Marketplace" },
    { key: "partners", label: "Partners" },
    { key: "weather", label: "Weather" },
    { key: "cropPlanner", label: "Crop Planner" },
    { key: "assessments", label: "Assessments" },
    { key: "data", label: "Data" },
  ];

  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setScreen(item.key)}
          className={`rounded-full px-6 py-3 font-black transition ${
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
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  background?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img
          src={background}
          alt="Bronson Family Farm"
          className="h-full w-full object-cover scale-[1.02]"
        />
      </div>

      <div className="fixed inset-0 bg-black/50" />

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,220,120,.08),transparent_24%),radial-gradient(circle_at_bottom,rgba(16,185,129,.10),transparent_32%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-8 md:px-10">
        <Navigation screen={screen} setScreen={setScreen} />
        {children}
      </div>
    </div>
  );
}

function PhotoCard({
  title,
  subtitle,
  image,
  height = "320px",
  onClick,
}: {
  title: string;
  subtitle?: string;
  image: string;
  height?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black text-left shadow-[0_30px_80px_rgba(0,0,0,.55)] transition duration-700 hover:scale-[1.01]"
      style={{ height }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

      <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.08),transparent_45%)]" />

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="text-3xl font-black leading-tight drop-shadow-2xl">
          {title}
        </div>

        {subtitle && (
          <div className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/85">
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
}

function GlassPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/38 p-7 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 text-4xl font-black leading-tight">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ToolCard({
  title,
  value,
  body,
  onClick,
}: {
  title: string;
  value: string;
  body: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[2rem] border border-white/10 bg-white/10 p-6 text-left shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur-xl transition hover:bg-white/20"
    >
      <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">
        {title}
      </div>
      <div className="mt-3 text-3xl font-black text-white">{value}</div>
      <p className="mt-4 text-sm leading-7 text-emerald-50/85">{body}</p>
    </button>
  );
}

function Home({
  setScreen,
  language,
  setLanguage,
  setSelectedRole,
}: {
  setScreen: (screen: Screen) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  setSelectedRole: (role: RoleKey) => void;
}) {
  const c = copy[language];

  return (
    <
