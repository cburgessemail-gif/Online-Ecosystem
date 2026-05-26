import { useEffect, useMemo, useState } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";
type RoleKey =
  | "guest"
  | "customer"
  | "marketplace"
  | "grower"
  | "youth"
  | "supervisor"
  | "parent"
  | "partner"
  | "volunteer"
  | "valueAdded"
  | "admin";

type PanelKey =
  | "home"
  | "journey"
  | "weather"
  | "cropPlanner"
  | "growPlan"
  | "assessments"
  | "parentConnect"
  | "data"
  | "channels"
  | "proverbs"
  | "contact";

const LANGS: LangKey[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const roleLabels: Record<RoleKey, string> = {
  guest: "Guest",
  customer: "Customer",
  marketplace: "Marketplace",
  grower: "Grower",
  youth: "Youth Workforce",
  supervisor: "Supervisor",
  parent: "Parent / Guardian",
  partner: "Partner",
  volunteer: "Volunteer",
  valueAdded: "Value-Added Producer",
  admin: "Admin / Operations",
};

const translations: Record<LangKey, any> = {
  English: {
    title: "Bronson Family Farm Online Ecosystem",
    subtitle: "A live operating system for growers, youth workforce, families, partners, and community food access.",
    start: "Enter Ecosystem",
    guided: "Guided Tour",
    back: "Back",
    next: "Next",
    home: "Home",
    chooseRole: "Choose Your Pathway",
    tools: "Live Tools",
    decision: "Final Decision",
    share: "Share / Invite",
    feedback: "Feedback",
    contact: "Contact Us",
  },
  Español: {
    title: "Ecosistema Digital de Bronson Family Farm",
    subtitle: "Un sistema operativo vivo para agricultores, jóvenes, familias, socios y acceso comunitario a alimentos.",
    start: "Entrar",
    guided: "Recorrido Guiado",
    back: "Atrás",
    next: "Siguiente",
    home: "Inicio",
    chooseRole: "Elija su camino",
    tools: "Herramientas",
    decision: "Decisión Final",
    share: "Compartir",
    feedback: "Comentarios",
    contact: "Contáctenos",
  },
  Tagalog: {
    title: "Bronson Family Farm Online Ecosystem",
    subtitle: "Isang buhay na sistema para sa growers, kabataan, pamilya, partners, at access sa pagkain.",
    start: "Pumasok",
    guided: "Gabay na Tour",
    back: "Bumalik",
    next: "Susunod",
    home: "Home",
    chooseRole: "Piliin ang Pathway",
    tools: "Live Tools",
    decision: "Final Decision",
    share: "Ibahagi",
    feedback: "Feedback",
    contact: "Contact Us",
  },
  Italiano: {
    title: "Ecosistema Online di Bronson Family Farm",
    subtitle: "Un sistema operativo vivo per coltivatori, giovani, famiglie, partner e accesso al cibo.",
    start: "Entra",
    guided: "Tour Guidato",
    back: "Indietro",
    next: "Avanti",
    home: "Home",
    chooseRole: "Scegli il percorso",
    tools: "Strumenti",
    decision: "Decisione Finale",
    share: "Condividi",
    feedback: "Feedback",
    contact: "Contattaci",
  },
  עברית: {
    title: "המערכת הדיגיטלית של Bronson Family Farm",
    subtitle: "מערכת חיה למגדלים, נוער, משפחות, שותפים וגישה קהילתית למזון.",
    start: "כניסה",
    guided: "סיור מודרך",
    back: "חזור",
    next: "הבא",
    home: "בית",
    chooseRole: "בחר מסלול",
    tools: "כלים חיים",
    decision: "החלטה סופית",
    share: "שתף",
    feedback: "משוב",
    contact: "צור קשר",
  },
  Français: {
    title: "Écosystème numérique de Bronson Family Farm",
    subtitle: "Un système vivant pour producteurs, jeunes, familles, partenaires et accès alimentaire.",
    start: "Entrer",
    guided: "Visite guidée",
    back: "Retour",
    next: "Suivant",
    home: "Accueil",
    chooseRole: "Choisir votre parcours",
    tools: "Outils",
    decision: "Décision finale",
    share: "Partager",
    feedback: "Retour",
    contact: "Nous contacter",
  },
};

const images = {
  hero: "/images/ConnectFoodEcosystem_withimages.png",
  grow: "/images/GrowArea2.jpg",
  growAlt: "/images/Grow Area.png",
  fence: "/images/Fence_volunteers.png",
  deer: "/images/Deer Fencing.png",
  compost: "/images/Compost_Elliott.png",
  seeds: "/images/Seeds_Jubilee Gardens.png",
  queen: "/images/Queens Village.png",
  csu: "/images/CSU_MParker.png",
  market: "/images/large (1).jpg",
  culinary: "/images/culniary_edibleflowers.jpeg",
  mushrooms: "/images/culniary_mushrooms.jpeg",
  wkbn: "/images/WKBN Interview.png",
  sam1: "/images/SAM_0384.JPG",
  sam2: "/images/SAM_0391.JPG",
  sam3: "/images/SAM_0401.JPG",
};

const roleJourneys: Record<RoleKey, any> = {
  guest: {
    image: images.hero,
    purpose: "Understand the vision, story, land, food access mission, and community invitation.",
    need: "Guests need a clear first experience that explains why the farm exists and how they can participate.",
    steps: [
      "Arrive through the welcome screen.",
      "Learn the farm story and place-based purpose.",
      "Explore pathways without pressure.",
      "Choose whether to visit, volunteer, donate, shop, or share.",
    ],
    tools: ["Event check-in", "Farm map", "Language access", "Feedback form"],
    decision: "Do I want to return, invite someone, volunteer, or support the farm?",
  },
  customer: {
    image: images.market,
    purpose: "Connect families to fresh food, nutrition, seedlings, seed rolls, and repeat healthy choices.",
    need: "Customers need easy access to food, pricing, ordering, pickup, nutrition education, and SNAP-aware options.",
    steps: [
      "View seasonal products.",
      "Learn what is fresh and available.",
      "Check SNAP-eligible items.",
      "Place or plan an order.",
      "Receive reminders and nutrition tips.",
    ],
    tools: ["Marketplace", "GrownBy link", "SNAP filter", "Pickup reminders"],
    decision: "What do I want to buy, grow, cook, or share with my household?",
  },
  marketplace: {
    image: images.market,
    purpose: "Convert interest into purchasing power and sustainable local food activity.",
    need: "The marketplace needs product visibility, inventory awareness, vendor coordination, and simple checkout direction.",
    steps: [
      "Browse produce, seedlings, seeds, and value-added items.",
      "Compare availability.",
      "Select pickup or event purchase.",
      "Invite others to shop.",
    ],
    tools: ["Inventory board", "Vendor list", "QR ordering", "Product labels"],
    decision: "Am I ready to buy, sell, reserve, or become a market participant?",
  },
  grower: {
    image: images.grow,
    purpose: "Connect growers to tools, knowledge, planning, supplies, mentorship, and market opportunity.",
    need: "Growers need planning tools, growing calendars, crop records, weather awareness, pest notes, and access to buyers.",
    steps: [
      "Identify growing space.",
      "Select crops.",
      "Create a grow plan.",
      "Track tasks and weather.",
      "Prepare for market participation.",
    ],
    tools: ["Crop planner", "Grow plan", "Weather panel", "Task journal", "Market readiness checklist"],
    decision: "Do I want to become a grower, vendor, partner grower, or learner?",
  },
  youth: {
    image: images.fence,
    purpose: "Build skills, responsibility, teamwork, safety, food knowledge, confidence, and future readiness.",
    need: "Youth need clear daily expectations, meaningful work, encouragement, badges, progress tracking, and adult guidance.",
    steps: [
      "Complete orientation.",
      "Check in daily.",
      "Review PPE and safety.",
      "Receive daily assignment.",
      "Complete activity and reflection.",
      "Earn badges and supervisor feedback.",
    ],
    tools: ["Daily checklist", "Skills checklist", "Attendance", "Reflection", "Badges"],
    decision: "What skill did I build today, and what responsibility am I ready for next?",
  },
  supervisor: {
    image: images.deer,
    purpose: "Give aides and supervisors a phone-friendly system to track youth progress and safety.",
    need: "Supervisors need fast tools for attendance, assignments, observations, incidents, scoring, and daily notes.",
    steps: [
      "Open supervisor dashboard.",
      "Take attendance.",
      "Assign crews.",
      "Complete safety check.",
      "Score participation.",
      "Submit daily notes.",
    ],
    tools: ["Mobile assessment", "Attendance", "Crew assignments", "Incident log", "Progress dashboard"],
    decision: "Which youth needs support, recognition, redirection, or advancement?",
  },
  parent: {
    image: images.queen,
    purpose: "Keep parents and guardians connected to youth growth, schedules, expectations, and accomplishments.",
    need: "Families need trust, communication, visibility, reminders, and proof that youth are learning real skills.",
    steps: [
      "View program schedule.",
      "Review youth expectations.",
      "Receive updates.",
      "See badges and progress.",
      "Send questions or concerns.",
    ],
    tools: ["Parent portal", "Progress summary", "Message form", "Schedule reminders"],
    decision: "How can I support my youth’s growth and celebrate their progress?",
  },
  partner: {
    image: images.csu,
    purpose: "Align resources, education, funding, demonstrations, workforce, and community benefit.",
    need: "Partners need clarity on what is needed, where they fit, and what outcomes their support creates.",
    steps: [
      "Review mission and current needs.",
      "Choose support area.",
      "Connect to event, workforce, food, or infrastructure needs.",
      "Track partnership outcomes.",
    ],
    tools: ["Partner menu", "Needs list", "Impact report", "Contact form"],
    decision: "What can my organization contribute, sponsor, teach, donate, or help build?",
  },
  volunteer: {
    image: images.fence,
    purpose: "Match willing community members to useful tasks without confusion.",
    need: "Volunteers need simple sign-up, clear workdays, task expectations, safety notes, and appreciation.",
    steps: [
      "Choose volunteer interest.",
      "Review safety and clothing needs.",
      "Select workday.",
      "Check in on arrival.",
      "Log contribution.",
    ],
    tools: ["Volunteer sign-up", "Workday calendar", "Task list", "Safety notes"],
    decision: "When can I serve, and what task am I prepared to do?",
  },
  valueAdded: {
    image: images.culinary,
    purpose: "Help producers transform farm products into food, education, demonstrations, and marketable goods.",
    need: "Value-added producers need product ideas, food safety awareness, kitchen planning, labels, and sales pathways.",
    steps: [
      "Explore available crops.",
      "Choose a product idea.",
      "Review safety and labeling needs.",
      "Plan a demo or product launch.",
      "Connect to the marketplace.",
    ],
    tools: ["Recipe planner", "Product worksheet", "Label checklist", "Market booth planner"],
    decision: "What can I create from farm produce that serves families and builds revenue?",
  },
  admin: {
    image: images.wkbn,
    purpose: "Operate the ecosystem with data, scheduling, reporting, communications, and accountability.",
    need: "Admin needs one place for program visibility, inventory, youth metrics, partner follow-up, and reports.",
    steps: [
      "Review dashboard.",
      "Check attendance and tasks.",
      "Monitor inventory and crop status.",
      "Review partner actions.",
      "Export reports.",
    ],
    tools: ["Operations dashboard", "Inventory", "Reports", "Partner tracker", "Program metrics"],
    decision: "What must be handled today to keep the ecosystem moving?",
  },
};

const proverbs = [
  "Where there is no vision, the people perish — Proverbs 29:18",
  "The plans of the diligent lead surely to abundance — Proverbs 21:5",
  "Let us not grow weary in doing good — Galatians 6:9",
  "By wisdom a house is built, and by understanding it is established — Proverbs 24:3",
  "Whatever your hand finds to do, do it with your might — Ecclesiastes 9:10",
];

const cropRows = [
  ["Tomatoes", "Start seedlings / transplant", "Warm season", "Stake, prune, monitor water"],
  ["Collards", "Direct or transplant", "Cool + warm tolerant", "Harvest outer leaves"],
  ["Peppers", "Transplant", "Warm season", "Needs warmth and steady moisture"],
  ["Cabbage", "Transplant", "Cool season", "Watch pests and spacing"],
  ["Corn", "Direct seed", "Warm season", "Plant in blocks for pollination"],
  ["Cucumbers", "Direct or transplant", "Warm season", "Trellis if possible"],
  ["Melons", "Direct or transplant", "Warm season", "Needs space, heat, and water"],
  ["Herbs", "Seed or transplant", "Flexible", "Great for bundles and value-added"],
];

function App() {
  const [lang, setLang] = useState<LangKey>("English");
  const [panel, setPanel] = useState<PanelKey>("home");
  const [role, setRole] = useState<RoleKey>("guest");
  const [journeyStep, setJourneyStep] = useState(0);
  const [guided, setGuided] = useState(false);

  const t = translations[lang];
  const current = roleJourneys[role];
  const isRTL = lang === "עברית";

  const guidePanels: PanelKey[] = ["home", "journey", "weather", "cropPlanner", "growPlan", "assessments", "parentConnect", "data", "channels", "proverbs", "contact"];

  useEffect(() => {
    if (!guided) return;
    const timer = window.setInterval(() => {
      setPanel((p) => {
        const index = guidePanels.indexOf(p);
        return guidePanels[(index + 1) % guidePanels.length];
      });
    }, 6500);
    return () => window.clearInterval(timer);
  }, [guided]);

  const nextStep = () => setJourneyStep((s) => Math.min(s + 1, current.steps.length - 1));
  const prevStep = () => setJourneyStep((s) => Math.max(s - 1, 0));

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f5f1e8] text-[#20351f]">
      <div className="min-h-screen bg-gradient-to-br from-[#eef3df] via-[#f7eddc] to-[#dce8cf]">
        <header className="sticky top-0 z-30 border-b border-[#d8c8a8] bg-[#f8f3e9]/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#6b7d3f]">Bronson Family Farm</div>
              <h1 className="text-xl font-black md:text-2xl">{t.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select value={lang} onChange={(e) => setLang(e.target.value as LangKey)} className="rounded-full border border-[#c8b98d] bg-white px-3 py-2 text-sm font-semibold">
                {LANGS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>

              <button onClick={() => setGuided(!guided)} className="rounded-full bg-[#20351f] px-4 py-2 text-sm font-bold text-white shadow">
                {guided ? "Pause Tour" : t.guided}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-7xl gap-4 px-4 py-5 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[2rem] border border-[#d8c8a8] bg-white/70 p-4 shadow-sm">
            <button onClick={() => setPanel("home")} className="mb-3 w-full rounded-2xl bg-[#314d2d] px-4 py-3 text-left font-black text-white">
              {t.home}
            </button>

            <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#7b6a40]">{t.chooseRole}</div>
            <div className="grid gap-2">
              {(Object.keys(roleLabels) as RoleKey[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setPanel("journey");
                    setJourneyStep(0);
                  }}
                  className={`rounded-2xl px-3 py-2 text-left text-sm font-bold transition ${
                    role === r ? "bg-[#e4b95b] text-[#1f2d1d] shadow" : "bg-[#f5efe2] hover:bg-[#eadcbd]"
                  }`}
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>

            <div className="mt-5 mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#7b6a40]">{t.tools}</div>
            <div className="grid gap-2">
              {[
                ["weather", "Weather / Field Conditions"],
                ["cropPlanner", "Crop Planner"],
                ["growPlan", "Grow Plan"],
                ["assessments", "Assessments"],
                ["parentConnect", "Parent Connection"],
                ["data", "Data Dashboard"],
                ["channels", "Live Channels"],
                ["proverbs", "Proverbs"],
                ["contact", "Contact / Feedback"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPanel(key as PanelKey)}
                  className={`rounded-2xl px-3 py-2 text-left text-sm font-bold transition ${
                    panel === key ? "bg-[#314d2d] text-white" : "bg-white hover:bg-[#f5efe2]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          <section className="min-h-[720px] rounded-[2rem] border border-[#d8c8a8] bg-white/80 p-4 shadow-sm md:p-6">
            {panel === "home" && (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="flex flex-col justify-center">
                  <div className="mb-3 rounded-full bg-[#e4b95b] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] w-fit">Operating Ecosystem</div>
                  <h2 className="text-4xl font-black leading-tight md:text-6xl">{t.title}</h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4a5a37]">{t.subtitle}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={() => setPanel("journey")} className="rounded-full bg-[#20351f] px-6 py-3 font-black text-white shadow">
                      {t.start}
                    </button>
                    <button onClick={() => setPanel("cropPlanner")} className="rounded-full bg-[#e4b95b] px-6 py-3 font-black text-[#1f2d1d] shadow">
                      Open Crop Planner
                    </button>
                    <button onClick={() => setPanel("assessments")} className="rounded-full bg-white px-6 py-3 font-black text-[#20351f] shadow">
                      Open Supervisor Tools
                    </button>
                  </div>
                </div>

                <ImageCard src={images.hero} title="Connected Food Ecosystem" />
              </div>
            )}

            {panel === "journey" && (
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <ImageCard src={current.image} title={roleLabels[role]} />
                <div>
                  <div className="rounded-full bg-[#e4b95b] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] w-fit">Pathway Journey</div>
                  <h2 className="mt-4 text-4xl font-black">{roleLabels[role]}</h2>

                  <InfoBlock title="Purpose" body={current.purpose} />
                  <InfoBlock title="Need Being Met" body={current.need} />

                  <div className="mt-4 rounded-[1.5rem] bg-[#f4ead7] p-5">
                    <div className="text-sm font-black uppercase tracking-[0.16em] text-[#7b6a40]">Current Step</div>
                    <div className="mt-2 text-2xl font-black">{journeyStep + 1}. {current.steps[journeyStep]}</div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={prevStep} className="rounded-full bg-white px-4 py-2 font-bold">{t.back}</button>
                      <button onClick={nextStep} className="rounded-full bg-[#20351f] px-4 py-2 font-bold text-white">{t.next}</button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <InfoList title="Tools Used" items={current.tools} />
                    <InfoBlock title={t.decision} body={current.decision} />
                  </div>
                </div>
              </div>
            )}

            {panel === "weather" && (
              <Dashboard title="Weather / Field Conditions" subtitle="Field readiness view for off-grid farm operations in Youngstown.">
                <Metric label="Current Condition" value="51°F" detail="Partly sunny" />
                <Metric label="Field Status" value="Check soil" detail="Clay-heavy soil requires moisture review before equipment." />
                <Metric label="Water Priority" value="High" detail="Review totes, irrigation, and youth hydration plan." />
                <Metric label="Safety Note" value="PPE first" detail="No PPE, no work. Gloves, closed shoes, weather-ready clothing." />
              </Dashboard>
            )}

            {panel === "cropPlanner" && (
              <div>
                <h2 className="text-4xl font-black">Crop Planner</h2>
                <p className="mt-2 text-[#4a5a37]">Plan what to grow, when to plant, what to monitor, and how each crop connects to market, youth learning, and food access.</p>
                <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#d8c8a8]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#314d2d] text-white">
                      <tr>
                        <th className="p-3">Crop</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Season</th>
                        <th className="p-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cropRows.map((row, i) => (
                        <tr key={row[0]} className={i % 2 ? "bg-[#f8f3e9]" : "bg-white"}>
                          {row.map((cell) => <td key={cell} className="p-3 font-semibold">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {panel === "growPlan" && (
              <Dashboard title="Grow Plan" subtitle="Daily rhythm for growers, youth workforce, supervisors, and operations.">
                <Metric label="Morning" value="8:00 AM" detail="Check-in, PPE, hydration, daily assignments." />
                <Metric label="Field Work" value="Crew Tasks" detail="Planting, watering, weeding, mulching, harvesting, pest checks." />
                <Metric label="Learning" value="Skill Block" detail="Crop knowledge, food safety, tool safety, teamwork, reflection." />
                <Metric label="Closeout" value="Daily Log" detail="Supervisor notes, youth reflection, inventory update, tomorrow’s needs." />
              </Dashboard>
            )}

            {panel === "assessments" && (
              <Dashboard title="Supervisor Assessments" subtitle="Phone-friendly tracking for the youth workforce program.">
                <Metric label="Attendance" value="Daily" detail="Present, late, absent, early departure, reason." />
                <Metric label="Safety" value="Required" detail="PPE, tool use, hydration, listening, site awareness." />
                <Metric label="Participation" value="1–5" detail="Effort, teamwork, focus, responsibility, completion." />
                <Metric label="Skills" value="Badges" detail="Planting, watering, harvesting, compost, market prep, leadership." />
                <Metric label="Incidents" value="Log" detail="Document safety, behavior, injury, redirection, parent contact." />
                <Metric label="Progress" value="Weekly" detail="Growth summary for youth, supervisor, admin, and parent connection." />
              </Dashboard>
            )}

            {panel === "parentConnect" && (
              <Dashboard title="Parent / Guardian Connection" subtitle="Keeps families connected to safety, schedule, progress, and celebration.">
                <Metric label="Schedule" value="June 8 – Aug 28, 2026" detail="Monday–Friday, 8:00 AM–2:00 PM." />
                <Metric label="Updates" value="Weekly" detail="Youth progress, badges, reminders, and program notes." />
                <Metric label="Support" value="Message" detail="Parents can send questions, concerns, or availability updates." />
                <Metric label="Celebration" value="Growth" detail="Share accomplishments, photos when approved, and end-of-program recognition." />
              </Dashboard>
            )}

            {panel === "data" && (
              <Dashboard title="Ecosystem Data Dashboard" subtitle="Operational visibility for farm, youth workforce, marketplace, and partners.">
                <Metric label="Youth Capacity" value="50" detail="Initial program size, with ability to track a larger database over time." />
                <Metric label="Supervisor Ratio" value="15:1" detail="Aides/supervisors support youth crews and daily progress." />
                <Metric label="Inventory" value="Live" detail="Produce, seedlings, Bubble Babies™, seeds, supplies, and market items." />
                <Metric label="Partners" value="Active" detail="Track donations, demonstrations, sponsorships, and follow-up." />
                <Metric label="Reports" value="Export" detail="Attendance, skills, outcomes, market activity, volunteer hours." />
                <Metric label="Decisions" value="Daily" detail="What needs water, labor, harvest, communication, repair, or funding?" />
              </Dashboard>
            )}

            {panel === "channels" && (
              <Dashboard title="Live Channels" subtitle="Connections that keep the ecosystem moving.">
                <Metric label="Marketplace" value="GrownBy" detail="Online ordering, product visibility, SNAP-aware customer pathway." />
                <Metric label="Events" value="Eventbrite" detail="QR registration, gate check-in, visitor tracking, event communication." />
                <Metric label="Website" value="BronsonFamilyFarm.com" detail="Main portal entry for the farm experience." />
                <Metric label="Media" value="Stories" detail="Press, WKBN, farm updates, partner visibility, community education." />
                <Metric label="Weather" value="Field Check" detail="Weather-informed work plans and safety decisions." />
                <Metric label="Feedback" value="Forms" detail="Guests, growers, youth, partners, and parents can respond." />
              </Dashboard>
            )}

            {panel === "proverbs" && (
              <div>
                <h2 className="text-4xl font-black">Proverbs & Encouragement</h2>
                <p className="mt-2 text-[#4a5a37]">Spiritual grounding for youth, families, growers, and the work of building together.</p>
                <div className="mt-5 grid gap-4">
                  {proverbs.map((p) => (
                    <div key={p} className="rounded-[1.5rem] bg-[#f4ead7] p-5 text-xl font-black shadow-sm">{p}</div>
                  ))}
                </div>
              </div>
            )}

            {panel === "contact" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h2 className="text-4xl font-black">Contact / Feedback</h2>
                  <p className="mt-3 text-[#4a5a37]">Use this pathway to invite support, ask questions, share feedback, or request partnership discussion.</p>
                  <div className="mt-5 grid gap-3">
                    <InfoBlock title="Bronson Family Farm" body="2350 Lansdowne Blvd., Youngstown, OH 44505" />
                    <InfoBlock title="Website" body="www.bronsonfamilyfarm.com" />
                    <InfoBlock title="Email" body="cburgess@bronsonfamilyfarm.com" />
                    <InfoBlock title="Phone" body="330-275-1604" />
                  </div>
                </div>

                <form className="rounded-[1.5rem] bg-[#f4ead7] p-5">
                  <label className="block text-sm font-black">Name</label>
                  <input className="mt-1 mb-3 w-full rounded-xl border border-[#c8b98d] p-3" placeholder="Your name" />
                  <label className="block text-sm font-black">Role / Interest</label>
                  <input className="mt-1 mb-3 w-full rounded-xl border border-[#c8b98d] p-3" placeholder="Grower, parent, partner, volunteer..." />
                  <label className="block text-sm font-black">Message</label>
                  <textarea className="mt-1 mb-3 h-32 w-full rounded-xl border border-[#c8b98d] p-3" placeholder="How would you like to connect?" />
                  <button type="button" className="rounded-full bg-[#20351f] px-6 py-3 font-black text-white">Prepare Message</button>
                </form>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function ImageCard({ src, title }: { src: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#d8c8a8] bg-[#eadcbd] shadow-sm">
      <img
        src={src}
        alt={title}
        className="h-[420px] w-full object-cover"
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.includes("GrowArea2.jpg")) img.src = "/images/GrowArea2.jpg";
        }}
      />
      <div className="p-4">
        <div className="text-sm font-black uppercase tracking-[0.18em] text-[#7b6a40]">{title}</div>
      </div>
    </div>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-4 rounded-[1.5rem] bg-white p-5 shadow-sm">
      <div className="text-sm font-black uppercase tracking-[0.16em] text-[#7b6a40]">{title}</div>
      <p className="mt-2 text-base font-semibold leading-7 text-[#3f4d31]">{body}</p>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
      <div className="text-sm font-black uppercase tracking-[0.16em] text-[#7b6a40]">{title}</div>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-[#f8f3e9] px-3 py-2 font-bold">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Dashboard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-4xl font-black">{title}</h2>
      <p className="mt-2 text-[#4a5a37]">{subtitle}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#d8c8a8] bg-white p-5 shadow-sm">
      <div className="text-sm font-black uppercase tracking-[0.16em] text-[#7b6a40]">{label}</div>
      <div className="mt-2 text-3xl font-black text-[#20351f]">{value}</div>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#4a5a37]">{detail}</p>
    </div>
  );
}

export default App;
