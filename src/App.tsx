import { useMemo, useState } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";
type RoleKey =
  | "guest"
  | "customer"
  | "grower"
  | "marketplace"
  | "youth"
  | "supervisor"
  | "parent"
  | "partner"
  | "valueAdded";

const LANGS: LangKey[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const t = {
  English: {
    title: "Bronson Family Farm",
    subtitle: "A Connected Food Ecosystem Experience",
    start: "Enter the Farm",
    guided: "Guided Tour",
    pathways: "Choose a Pathway",
    back: "Back",
    next: "Next",
    home: "Home",
    decision: "Final Decision",
    contact: "Share Feedback / Contact Us",
  },
  Español: {
    title: "Bronson Family Farm",
    subtitle: "Una experiencia de ecosistema alimentario conectado",
    start: "Entrar a la granja",
    guided: "Recorrido guiado",
    pathways: "Elegir un camino",
    back: "Atrás",
    next: "Siguiente",
    home: "Inicio",
    decision: "Decisión final",
    contact: "Compartir comentarios / Contactarnos",
  },
  Tagalog: {
    title: "Bronson Family Farm",
    subtitle: "Isang konektadong karanasan sa sistemang pagkain",
    start: "Pumasok sa Bukid",
    guided: "Gabay na Paglalakbay",
    pathways: "Pumili ng Daan",
    back: "Bumalik",
    next: "Susunod",
    home: "Simula",
    decision: "Panghuling Desisyon",
    contact: "Magbigay ng Feedback / Makipag-ugnayan",
  },
  Italiano: {
    title: "Bronson Family Farm",
    subtitle: "Un’esperienza di ecosistema alimentare connesso",
    start: "Entra nella fattoria",
    guided: "Tour guidato",
    pathways: "Scegli un percorso",
    back: "Indietro",
    next: "Avanti",
    home: "Home",
    decision: "Decisione finale",
    contact: "Condividi feedback / Contattaci",
  },
  עברית: {
    title: "Bronson Family Farm",
    subtitle: "חוויית מערכת מזון קהילתית מחוברת",
    start: "כניסה לחווה",
    guided: "סיור מודרך",
    pathways: "בחרו מסלול",
    back: "חזרה",
    next: "הבא",
    home: "בית",
    decision: "החלטה סופית",
    contact: "משוב / יצירת קשר",
  },
  Français: {
    title: "Bronson Family Farm",
    subtitle: "Une expérience d’écosystème alimentaire connecté",
    start: "Entrer dans la ferme",
    guided: "Visite guidée",
    pathways: "Choisir un parcours",
    back: "Retour",
    next: "Suivant",
    home: "Accueil",
    decision: "Décision finale",
    contact: "Partager un avis / Nous contacter",
  },
};

const img = {
  hero: "/GrowArea2.jpg",
  ecosystem: "/ConnectFoodEcosystem_withimages.png",
  grow: "/GrowArea.jpg",
  fence: "/Deer Fencing.png",
  volunteers: "/Fence_volunteers.png",
  compost: "/Compost_ElliottGarden.png",
  queen: "/Queens Village.png",
  partner: "/Partners.png",
  parker: "/CSU_MParker.png",
  market: "/SAM_0410.JPG",
  youth: "/SAM_0396.JPG",
  value: "/SAM_0407.JPG",
};

const guidedSlides = [
  {
    title: "The Farm as Infrastructure",
    text:
      "Bronson Family Farm is not only a farm. It is a place-based food ecosystem connecting land, growers, youth, partners, customers, and community wellness.",
    image: img.hero,
  },
  {
    title: "The Ecosystem Model",
    text:
      "Each role has a pathway. Guests learn the vision, customers support food access, growers enter the market, youth build skills, and partners strengthen infrastructure.",
    image: img.ecosystem,
  },
  {
    title: "From Experience to Decision",
    text:
      "Every person is guided toward a meaningful next step: visit, shop, grow, volunteer, supervise, invest, partner, or share feedback.",
    image: img.market,
  },
];

const roleData: Record<
  RoleKey,
  {
    label: string;
    image: string;
    hook: string;
    need: string;
    journey: string[];
    benefits: string[];
    decision: string;
  }
> = {
  guest: {
    label: "Guest",
    image: img.hero,
    hook: "Experience something different.",
    need: "Guests need to understand why this farm exists and how land can become a community resource.",
    journey: [
      "Arrive through the farm entrance and learn the story.",
      "See the growing area, partner spaces, and community gathering points.",
      "Understand how food, wellness, youth workforce, and local enterprise connect.",
      "Choose how to stay connected.",
    ],
    benefits: ["Clear first impression", "Connection to purpose", "Invitation to return"],
    decision: "Do I want to visit again, share this with others, or support the farm?",
  },
  customer: {
    label: "Customer",
    image: img.market,
    hook: "Fresh food becomes a repeat healthy choice.",
    need: "Customers need convenient access to local produce, seedlings, supplies, and nutrition-centered information.",
    journey: [
      "Explore seasonal products and farm offerings.",
      "Use QR codes or online ordering to shop or preorder.",
      "Learn how purchases support growers and youth workforce.",
      "Return as a repeat customer.",
    ],
    benefits: ["Fresh local food", "Simple purchasing", "Health-centered choices"],
    decision: "Do I want to shop, preorder, or become a returning customer?",
  },
  grower: {
    label: "Grower",
    image: img.grow,
    hook: "Growers need tools, knowledge, and market connection.",
    need: "New and small growers need support, supplies, training, shared visibility, and practical pathways into the local food economy.",
    journey: [
      "Identify growing goals and current needs.",
      "Connect with supplies, demonstrations, and technical support.",
      "Learn how to bring products into the marketplace.",
      "Join the regional grower network.",
    ],
    benefits: ["Practical education", "Market access", "Peer support"],
    decision: "Do I want to become a grower in this ecosystem?",
  },
  marketplace: {
    label: "Marketplace",
    image: img.market,
    hook: "The marketplace converts interest into purchasing power.",
    need: "The community needs a coordinated place where local food, growers, supplies, education, and customers can meet.",
    journey: [
      "View farm products and grower offerings.",
      "Connect inventory, preorders, pickup, and events.",
      "Support SNAP-eligible food access where available.",
      "Strengthen regional food circulation.",
    ],
    benefits: ["Revenue flow", "Customer connection", "Regional food access"],
    decision: "Do I want to shop, sell, sponsor, or help expand the marketplace?",
  },
  youth: {
    label: "Youth Workforce",
    image: img.youth,
    hook: "More than a summer job — we are building our future.",
    need: "Youth need structured work, responsibility, outdoor skill-building, mentorship, and visible progress.",
    journey: [
      "Complete orientation and safety expectations.",
      "Check in daily and receive role-based assignments.",
      "Build skills through farm tasks, teamwork, and reflection.",
      "Earn progress recognition through supervisor tracking.",
      "Complete the program with documented growth.",
    ],
    benefits: ["Work readiness", "Responsibility", "Confidence", "Documented skill progress"],
    decision: "Am I ready to show up, work safely, grow skills, and complete the program?",
  },
  supervisor: {
    label: "Supervisor",
    image: img.volunteers,
    hook: "Supervisors turn daily work into measurable growth.",
    need: "Supervisors need a phone-friendly system to track attendance, tasks, safety, participation, and youth progress.",
    journey: [
      "Open the supervisor dashboard on a phone.",
      "Check youth in and confirm PPE readiness.",
      "Assign daily tasks by group or role.",
      "Record observations, rubric scores, and concerns.",
      "Share progress with leadership and families.",
    ],
    benefits: ["Simple tracking", "Consistent records", "Better youth support"],
    decision: "Can I supervise 15 youth with structure, safety, and clear documentation?",
  },
  parent: {
    label: "Parent / Guardian",
    image: img.queen,
    hook: "Families need connection, confidence, and visibility.",
    need: "Parents and guardians need to know where youth are, what they are learning, and how the program supports growth.",
    journey: [
      "Receive orientation and program expectations.",
      "Understand schedule, safety, and communication points.",
      "View progress updates and youth milestones.",
      "Support attendance, attitude, and completion.",
    ],
    benefits: ["Confidence", "Communication", "Youth encouragement"],
    decision: "How will I help my youth complete the program successfully?",
  },
  partner: {
    label: "Partner / Investor",
    image: img.partner,
    hook: "Partners help turn vision into infrastructure.",
    need: "The ecosystem needs aligned investment in water, solar, fencing, storage, education, workforce, equipment, and operations.",
    journey: [
      "Understand the farm’s infrastructure needs.",
      "Identify alignment with health, workforce, food access, youth, or economic development.",
      "Choose a sponsorship, grant, donation, or investment lane.",
      "Receive reporting, visibility, and community impact outcomes.",
    ],
    benefits: ["Visible impact", "Community alignment", "Measurable outcomes"],
    decision: "Do I want to fund, sponsor, donate, volunteer, or become a strategic partner?",
  },
  valueAdded: {
    label: "Value-Added Producer",
    image: img.value,
    hook: "Value-added work creates enterprise from local harvest.",
    need: "Producers need pathways for food safety, preparation, packaging, education, and market participation.",
    journey: [
      "Identify product ideas connected to local produce.",
      "Learn preparation, compliance, packaging, and pricing basics.",
      "Connect with marketplace opportunities.",
      "Build a small enterprise pathway.",
    ],
    benefits: ["Enterprise skills", "Product development", "Market readiness"],
    decision: "Do I want to develop a value-added product for the ecosystem?",
  },
};

function App() {
  const [lang, setLang] = useState<LangKey>("English");
  const [screen, setScreen] = useState<"home" | "guided" | "pathways" | "role" | "operations">("home");
  const [slide, setSlide] = useState(0);
  const [role, setRole] = useState<RoleKey>("guest");

  const ui = t[lang];
  const activeRole = roleData[role];

  const roleKeys = useMemo(() => Object.keys(roleData) as RoleKey[], []);

  const nextSlide = () => setSlide((s) => Math.min(s + 1, guidedSlides.length - 1));
  const prevSlide = () => setSlide((s) => Math.max(s - 1, 0));

  return (
    <main className="min-h-screen bg-[#132016] text-[#fff8e8] overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <img src={img.hero} className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d160f] via-[#1d301e]/90 to-[#50391c]/85" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#132016]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <button onClick={() => setScreen("home")} className="text-left">
            <div className="text-xs uppercase tracking-[0.35em] text-[#e8c27a]">Bronson Family Farm</div>
            <div className="text-lg font-semibold">Connected Ecosystem</div>
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangKey)}
              className="rounded-full border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
            >
              {LANGS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>

            <button onClick={() => setScreen("guided")} className="rounded-full bg-[#e8c27a] px-4 py-2 text-sm font-bold text-[#132016]">
              {ui.guided}
            </button>

            <button onClick={() => setScreen("pathways")} className="rounded-full border border-white/20 px-4 py-2 text-sm">
              {ui.pathways}
            </button>
          </div>
        </div>
      </header>

      {screen === "home" && (
        <section className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-8 px-5 py-10 md:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-4 inline-flex
