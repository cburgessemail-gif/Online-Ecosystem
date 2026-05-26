import { useEffect, useMemo, useState } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";
type ViewKey =
  | "home"
  | "tour"
  | "guest"
  | "customer"
  | "marketplace"
  | "grower"
  | "youth"
  | "supervisor"
  | "parent"
  | "partner"
  | "valueAdded"
  | "cropPlanner"
  | "growPlan"
  | "assessments"
  | "live"
  | "data"
  | "contact";

type Role = {
  id: ViewKey;
  title: string;
  subtitle: string;
  image: string;
  steps: string[];
  benefits: string[];
  resources: { label: string; view: ViewKey }[];
  decision: string;
  share: string;
};

const LANGS: LangKey[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const image = (name: string) => `/images/${name}`;

const IMG = {
  hero: image("ConnectFoodEcosystem_withimages.png"),
  growArea: image("Grow Area.png"),
  growArea2: image("GrowArea2.jpg"),
  fencing: image("Deer Fencing.png"),
  volunteers: image("Fence_volunteers.png"),
  compost: image("Compost_ElliottGarden.png"),
  seeds: image("Seeds_Jubilee Gardens.png"),
  parker: image("CSU_MParker.png"),
  queens: image("Queens Village.png"),
  market: image("large (12).jpg"),
  culinary: image("culniary_edibleflowers.jpeg"),
  mushrooms: image("culniary_mushrooms.jpeg"),
  wkbn: image("WKBN Interview.png"),
};

const ui: Record<LangKey, Record<string, string>> = {
  English: {
    title: "Bronson Family Farm Online Ecosystem",
    subtitle: "A living farm management system for food, youth workforce, growers, partners, and community health.",
    start: "Enter Ecosystem",
    tour: "Guided Tour",
    live: "Live Channels",
    data: "Data Dashboard",
    crop: "Crop Planner",
    grow: "Grow Plan",
    assess: "Assessments",
    back: "Back Home",
    next: "Next",
    contact: "Contact / Feedback",
  },
  Español: {
    title: "Ecosistema Digital de Bronson Family Farm",
    subtitle: "Sistema de gestión agrícola para alimentos, jóvenes, productores, socios y salud comunitaria.",
    start: "Entrar",
    tour: "Recorrido Guiado",
    live: "Canales en Vivo",
    data: "Datos",
    crop: "Planificador",
    grow: "Plan de Cultivo",
    assess: "Evaluaciones",
    back: "Inicio",
    next: "Siguiente",
    contact: "Contacto",
  },
  Tagalog: {
    title: "Bronson Family Farm Online Ecosystem",
    subtitle: "Sistema para sa pagkain, kabataan, growers, partners, at kalusugan ng komunidad.",
    start: "Pumasok",
    tour: "Gabay na Tour",
    live: "Live Channels",
    data: "Dashboard",
    crop: "Crop Planner",
    grow: "Grow Plan",
    assess: "Assessments",
    back: "Home",
    next: "Next",
    contact: "Contact",
  },
  Italiano: {
    title: "Ecosistema Online Bronson Family Farm",
    subtitle: "Sistema agricolo per cibo, giovani, coltivatori, partner e salute comunitaria.",
    start: "Entra",
    tour: "Tour Guidato",
    live: "Canali Live",
    data: "Dati",
    crop: "Pianificatore",
    grow: "Piano di Coltivazione",
    assess: "Valutazioni",
    back: "Home",
    next: "Avanti",
    contact: "Contatto",
  },
  עברית: {
    title: "המערכת המקוונת של Bronson Family Farm",
    subtitle: "מערכת לניהול מזון, נוער, מגדלים, שותפים ובריאות קהילתית.",
    start: "כניסה",
    tour: "סיור מודרך",
    live: "ערוצים חיים",
    data: "נתונים",
    crop: "תכנון גידולים",
    grow: "תוכנית גידול",
    assess: "הערכות",
    back: "בית",
    next: "הבא",
    contact: "יצירת קשר",
  },
  Français: {
    title: "Écosystème en ligne Bronson Family Farm",
    subtitle: "Système agricole pour l’alimentation, les jeunes, les producteurs, les partenaires et la santé communautaire.",
    start: "Entrer",
    tour: "Visite guidée",
    live: "Canaux en direct",
    data: "Données",
    crop: "Planificateur",
    grow: "Plan de culture",
    assess: "Évaluations",
    back: "Accueil",
    next: "Suivant",
    contact: "Contact",
  },
};

const roles: Role[] = [
  {
    id: "guest",
    title: "Guest Pathway",
    subtitle: "Experience the farm, understand the mission, and decide how to stay connected.",
    image: IMG.hero,
    steps: [
      "Arrive through the welcome screen and learn why the farm exists.",
      "Explore the land, history, community need, and food access mission.",
      "Visit live channels, marketplace, growers, youth workforce, and partner areas.",
      "Choose whether to attend, volunteer, donate, share, or request a tour.",
    ],
    benefits: ["Clear first impression", "Easy navigation", "Mission-based engagement", "Invitation to act"],
    resources: [
      { label: "Live Channels", view: "live" },
      { label: "Contact / Feedback", view: "contact" },
      { label: "Data Dashboard", view: "data" },
    ],
    decision: "Do I want to visit, share, volunteer, or support this ecosystem?",
    share: "Share the farm story, event link, or invitation with family, neighbors, churches, schools, and partners.",
  },
  {
    id: "customer",
    title: "Customer Pathway",
    subtitle: "Move from interest to healthy food choices and repeat participation.",
    image: IMG.market,
    steps: [
      "Learn what is fresh, seasonal, SNAP-aware, and community-centered.",
      "Explore produce, seedlings, Bubble Babies™, herbs, and value-added items.",
      "Use QR codes or marketplace links to order, reserve, or request pickup.",
      "Receive education about nutrition, preparation, and healthy choices.",
    ],
    benefits: ["Fresh local food", "Nutrition education", "Repeat access", "Community trust"],
    resources: [
      { label: "Marketplace", view: "marketplace" },
      { label: "Crop Planner", view: "cropPlanner" },
      { label: "Live Channels", view: "live" },
    ],
    decision: "Do I want to buy, pre-order, subscribe, or return as a customer?",
    share: "Share produce availability, QR store links, recipes, and nutrition information.",
  },
  {
    id: "grower",
    title: "Grower Pathway",
    subtitle: "Connect growers to tools, planning, market opportunity, and shared knowledge.",
    image: IMG.growArea2,
    steps: [
      "Identify what the grower wants to produce, sell, learn, or demonstrate.",
      "Use crop planning, seed tracking, soil notes, weather, and task lists.",
      "Connect to supply resources, compost, fencing, irrigation, seed starts, and training.",
      "Move toward market participation, shared distribution, or farm collaboration.",
    ],
    benefits: ["Planning support", "Market readiness", "Shared tools", "Regional grower network"],
    resources: [
      { label: "Crop Planner", view: "cropPlanner" },
      { label: "Grow Plan", view: "growPlan" },
      { label: "Data Dashboard", view: "data" },
    ],
    decision: "Do I want to become a participating grower, vendor, trainer, or supplier?",
    share: "Share crop plans, availability, needs, harvest timing, and market opportunities.",
  },
  {
    id: "youth",
    title: "Youth Workforce Pathway",
    subtitle: "An 8-week farm-based workforce experience: June 8 – August 28, 2026, 8:00 AM – 2:00 PM.",
    image: IMG.volunteers,
    steps: [
      "Complete orientation, safety expectations, media release, and role assignment.",
      "Begin daily check-in: PPE, attendance, task assignment, hydration, and team placement.",
      "Complete skill-building activities in planting, composting, harvesting, market prep, and stewardship.",
      "Receive supervisor observations, badges, daily reflections, and progress tracking.",
      "End with a portfolio of skills, participation record, and next-step recommendation.",
    ],
    benefits: ["Work readiness", "Responsibility", "Outdoor learning", "Life skills", "Career exposure"],
    resources: [
      { label: "Assessments", view: "assessments" },
      { label: "Grow Plan", view: "growPlan" },
      { label: "Parent Connection", view: "parent" },
    ],
    decision: "What skills did I build, and what pathway should I pursue next?",
    share: "Youth can share reflections, completed badges, pictures, produce work, and end-of-program progress.",
  },
  {
    id: "supervisor",
    title: "Supervisor Mobile Pathway",
    subtitle: "Designed for phone-based daily tracking of youth, safety, tasks, and progress.",
    image: IMG.fencing,
    steps: [
      "Check assigned youth group and daily attendance.",
      "Confirm PPE, safety, hydration, and work readiness.",
      "Assign tasks by team: planting, watering, compost, market, cleanup, harvest, records.",
      "Complete quick observations using life skills, participation, teamwork, and task completion.",
      "Flag concerns, recognize progress, and prepare parent/program updates.",
    ],
    benefits: ["Mobile-first tracking", "Consistent documentation", "Safety visibility", "Progress evidence"],
    resources: [
      { label: "Assessments", view: "assessments" },
      { label: "Data Dashboard", view: "data" },
      { label: "Youth Pathway", view: "youth" },
    ],
    decision: "Is each youth safe, engaged, progressing, and ready for the next responsibility?",
    share: "Supervisors share daily notes, alerts, completed rubrics, youth strengths, and support needs.",
  },
  {
    id: "parent",
    title: "Parent / Guardian Connection",
    subtitle: "Keeps families informed, respected, and connected to youth progress.",
    image: IMG.queens,
    steps: [
      "View program schedule, expectations, clothing/PPE reminders, and attendance notes.",
      "Receive youth progress summaries, strengths, and growth areas.",
      "Access parent messages, emergency updates, and celebration moments.",
      "Provide feedback and consent updates when needed.",
    ],
    benefits: ["Trust", "Transparency", "Family engagement", "Youth encouragement"],
    resources: [
      { label: "Youth Pathway", view: "youth" },
      { label: "Assessments", view: "assessments" },
      { label: "Contact / Feedback", view: "contact" },
    ],
    decision: "How can I support my youth’s growth, attendance, and confidence?",
    share: "Parents can share encouragement, concerns, availability, and permission-related updates.",
  },
  {
    id: "partner",
    title: "Partner Pathway",
    subtitle: "Align resources, education, sponsorship, workforce, tools, and community outcomes.",
    image: IMG.parker,
    steps: [
      "Understand the ecosystem need: food access, training, health, growers, youth, and land stewardship.",
      "Identify the partner role: sponsor, educator, donor, volunteer, workforce, health, media, or technical support.",
      "Connect partner support to measurable outcomes and visible community benefit.",
      "Decide on next action: meeting, donation, demonstration, grant support, or formal collaboration.",
    ],
    benefits: ["Clear role alignment", "Measurable outcomes", "Community visibility", "Mutual benefit"],
    resources: [
      { label: "Data Dashboard", view: "data" },
      { label: "Live Channels", view: "live" },
      { label: "Contact / Feedback", view: "contact" },
    ],
    decision: "What resource can we contribute, and what outcome will it support?",
    share: "Partners can share logos, commitments, resources, referrals, sponsorships, and impact stories.",
  },
  {
    id: "valueAdded",
    title: "Value-Added Producer Pathway",
    subtitle: "Move produce into education, culinary products, demonstrations, and enterprise opportunities.",
    image: IMG.culinary,
    steps: [
      "Identify available crops, herbs, edible flowers, mushrooms, or seasonal surplus.",
      "Explore food safety, packaging, labeling, recipe, and demonstration needs.",
      "Connect culinary education to marketplace opportunity.",
      "Decide whether to demonstrate, sell, train, or co-create a value-added product.",
    ],
    benefits: ["Less waste", "More revenue", "Culinary education", "Small business pathway"],
    resources: [
      { label: "Marketplace", view: "marketplace" },
      { label: "Crop Planner", view: "cropPlanner" },
      { label: "Grow Plan", view: "growPlan" },
    ],
    decision: "Can this crop become a product, class, tasting, recipe, or market item?",
    share: "Share recipes, demos, labels, product ideas, food safety notes, and pricing feedback.",
  },
];

const proverbs = [
  "A garden is grown one faithful task at a time.",
  "Teach the seed, feed the family, strengthen the future.",
  "Many hands make the harvest visible.",
  "The farm is not only land; it is a classroom, marketplace, and promise.",
  "What we plant in youth becomes the strength of the community.",
];

const cropRows = [
  ["Tomatoes", "Seedling / transplant", "May–June", "70–85 days", "Customer + market crop"],
  ["Collards", "Seedling / direct", "Spring + late summer", "60–80 days", "Nutrition education"],
  ["Mustard Greens", "Direct / seedling", "Spring + fall", "35–50 days", "Quick harvest"],
  ["Peppers", "Transplant", "May–June", "70–90 days", "High-value crop"],
  ["Cilantro", "Direct / seedling", "Cool season", "30–45 days", "Herb bundles"],
  ["Broccoli", "Transplant", "Spring + fall", "60–75 days", "Youth training crop"],
  ["Spinach", "Direct", "Cool season", "35–45 days", "SNAP-aware fresh food"],
  ["Lettuce", "Direct / seedling", "Succession", "30–55 days", "Fast market crop"],
  ["Watermelon", "Direct / transplant", "Late spring", "80–100 days", "Summer family crop"],
  ["Corn", "Direct", "Late spring", "70–100 days", "Community food crop"],
];

function App() {
  const [lang, setLang] = useState<LangKey>("English");
  const [view, setView] = useState<ViewKey>("home");
  const [tourIndex, setTourIndex] = useState(0);
  const [selectedYouth, setSelectedYouth] = useState("Youth 001");
  const [toast, setToast] = useState("");

  const t = ui[lang];
  const activeRole = roles.find((r) => r.id === view);
  const tourRole = roles[tourIndex % roles.length];

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  const dir = lang === "עברית" ? "rtl" : "ltr";

  const go = (target: ViewKey) => {
    setView(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main dir={dir} className="min-h-screen bg-[#f5f1e8] text-[#1f2d1f]">
      <style>{`
        .forest {
          background:
            linear-gradient(135deg, rgba(20,45,26,.92), rgba(90,113,57,.78)),
            url("${IMG.growArea2}") center/cover no-repeat;
        }
        .glass { background: rgba(255,255,255,.84); backdrop-filter: blur(12px); }
        .btn { border-radius: 999px; padding: .78rem 1.05rem; font-weight: 800; transition: .2s; }
        .btn:hover { transform: translateY(-1px); }
        .panel { border-radius: 1.5rem; box-shadow: 0 20px 60px rgba(30,45,25,.14); }
        .scrollbox { max-height: 54vh; overflow-y: auto; padding-right: .35rem; }
      `}</style>

      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-full bg-[#23351f] px-5 py-3 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-[#d8ccb5] bg-[#f5f1e8]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <button onClick={() => go("home")} className="text-left">
            <div className="text-xs font-black tracking-[.25em] text-[#6f7f38]">BRONSON FAMILY FARM</div>
            <div className="text-lg font-black">Online Ecosystem</div>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangKey)}
              className="rounded-full border border-[#bcae91] bg-white px-3 py-2 text-sm font-bold"
            >
              {LANGS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>

            {[
              ["tour", t.tour],
              ["live", t.live],
              ["cropPlanner", t.crop],
              ["growPlan", t.grow],
              ["assessments", t.assess],
              ["data", t.data],
            ].map(([key, label]) => (
              <button key={key} onClick={() => go(key as ViewKey)} className="btn bg-[#e8ddc7] text-[#26351f]">
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {view === "home" && (
        <section className="forest min-h-[calc(100vh-72px)] px-4 py-10">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="glass panel p-6 md:p-8">
              <div className="mb-4 inline-flex rounded-full bg-[#f3c95b] px-4 py-2 text-xs font-black tracking-[.18em]">
                REAL OPERATIONAL ECOSYSTEM
              </div>
              <h1 className="text-4xl font-black leading-tight md:text-6xl">{t.title}</h1>
              <p className="mt-5 max-w-3xl text-lg font-semibold leading-relaxed text-[#41513a]">{t.subtitle}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => go("tour")} className="btn bg-[#23351f] text-white">
                  {t.start}
                </button>
                <button onClick={() => go("live")} className="btn bg-white text-[#23351f]">
                  Weather + Live Channels
                </button>
                <button onClick={() => go("contact")} className="btn bg-[#f3c95b] text-[#23351f]">
                  {t.contact}
                </button>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => go(r.id)}
                    className="rounded-2xl border border-[#d8ccb5] bg-white/85 p-4 text-left hover:bg-[#fff8e8]"
                  >
                    <div className="text-sm font-black text-[#6f7f38]">PATHWAY</div>
                    <div className="text-xl font-black">{r.title}</div>
                    <p className="mt-1 text-sm font-semibold text-[#54604a]">{r.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel overflow-hidden bg-white">
              <img src={IMG.hero} className="h-[360px] w-full object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-black">Step into the Farm. Experience the wonders of life.</h2>
                <p className="mt-3 font-semibold text-[#52604b]">
                  This system connects guests, customers, growers, youth, supervisors, parents, value-added producers,
                  partners, live farm channels, crop planning, assessments, and measurable outcomes.
                </p>
                <div className="mt-5 rounded-2xl bg-[#edf3dc] p-4 font-bold">
                  Today’s proverb: {proverbs[new Date().getDate() % proverbs.length]}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "tour" && (
        <PageShell title="Guided Ecosystem Tour" image={tourRole.image} go={go}>
          <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <div className="panel bg-white p-5">
              <img src={tourRole.image} className="h-72 w-full rounded-3xl object-cover" />
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setTourIndex((i) => Math.max(0, i - 1))}
                  className="btn bg-[#e8ddc7]"
                >
                  Back
                </button>
                <div className="font-black">
                  {tourIndex + 1} / {roles.length}
                </div>
                <button
                  onClick={() => setTourIndex((i) => (i + 1) % roles.length)}
                  className="btn bg-[#23351f] text-white"
                >
                  Next
                </button>
              </div>
            </div>

            <RoleContent role={tourRole} go={go} />
          </div>
        </PageShell>
      )}

      {activeRole && (
        <PageShell title={activeRole.title} image={activeRole.image} go={go}>
          <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <div className="panel overflow-hidden bg-white">
              <img src={activeRole.image} className="h-[430px] w-full object-cover" />
              <div className="p-5">
                <div className="rounded-2xl bg-[#edf3dc] p-4">
                  <div className="text-xs font-black tracking-[.18em] text-[#6f7f38]">FINAL DECISION</div>
                  <div className="mt-2 text-xl font-black">{activeRole.decision}</div>
                </div>
              </div>
            </div>
            <RoleContent role={activeRole} go={go} />
          </div>
        </PageShell>
      )}

      {view === "live" && (
        <PageShell title="Weather, Live Channels, Alerts & Proverbs" image={IMG.growArea2} go={go}>
          <div className="grid gap-5 lg:grid-cols-3">
            <InfoCard title="Farm Weather Channel" items={["Youngstown, OH 44505", "Check heat, rain, wind, and lightning before work begins.", "Supervisor action: adjust tasks, hydration, shade, and PPE."]} />
            <InfoCard title="Daily Safety Channel" items={["No PPE, no work.", "Hydration check every work block.", "Lightning or unsafe weather moves youth to safe area."]} />
            <InfoCard title="Marketplace Channel" items={["Post available produce.", "Post seedlings and Bubble Babies™.", "Update pickup windows and sold-out items."]} />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="panel bg-white p-6">
              <h3 className="text-2xl font-black">Daily Proverbs</h3>
              <div className="mt-4 grid gap-3">
                {proverbs.map((p) => (
                  <div key={p} className="rounded-2xl bg-[#f5f1e8] p-4 font-bold">{p}</div>
                ))}
              </div>
            </div>
            <div className="panel bg-white p-6">
              <h3 className="text-2xl font-black">Live Channel Buttons</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {["Weather", "Soil", "Tasks", "Market", "Youth", "Partners", "Health", "Media"].map((x) => (
                  <button key={x} onClick={() => setToast(`${x} channel opened`)} className="btn bg-[#23351f] text-white">
                    Open {x}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PageShell>
      )}

      {view === "cropPlanner" && (
        <PageShell title="Crop Planner" image={IMG.seeds} go={go}>
          <div className="panel overflow-hidden bg-white">
            <div className="grid gap-4 p-5 md:grid-cols-4">
              <input className="rounded-2xl border p-3" placeholder="Crop search" />
              <select className="rounded-2xl border p-3"><option>Season</option><option>Spring</option><option>Summer</option><option>Fall</option></select>
              <select className="rounded-2xl border p-3"><option>Use</option><option>Market</option><option>Youth Training</option><option>SNAP-aware</option></select>
              <button onClick={() => setToast("Crop plan filter applied")} className="btn bg-[#23351f] text-white">Apply</button>
            </div>
            <div className="overflow-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#23351f] text-white">
                  <tr>{["Crop", "Method", "Planting Window", "Maturity", "Purpose"].map((h) => <th key={h} className="p-4">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {cropRows.map((r) => (
                    <tr key={r[0]} className="border-b">
                      {r.map((c) => <td key={c} className="p-4 font-semibold">{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PageShell>
      )}

      {view === "growPlan" && (
        <PageShell title="Grow Plan" image={IMG.growArea} go={go}>
          <div className="grid gap-5 lg:grid-cols-2">
            <InfoCard title="Weekly Grow Rhythm" items={["Monday: safety, planning, watering, task teams.", "Tuesday–Thursday: field work, crop care, youth skill development.", "Friday: harvest, reflection, data entry, cleanup, supervisor notes."]} />
            <InfoCard title="Farm Systems" items={["Water: totes, irrigation planning, hydration schedule.", "Soil: compost, mulch, leaves, wood ash, soil testing.", "Protection: deer fencing, chicken wire, pest monitoring."]} />
            <InfoCard title="Youth Teams" items={["Planting Team", "Compost Team", "Harvest Team", "Market Prep Team", "Data & Media Team"]} />
            <InfoCard title="
