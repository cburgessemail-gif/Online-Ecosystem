import { useEffect, useMemo, useState } from "react";

type TabKey =
  | "portal"
  | "guest"
  | "roles"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "crop"
  | "marketplace"
  | "operations"
  | "reports"
  | "partners";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";

type TourStep = {
  id: string;
  eyebrow: string;
  title: string;
  narration: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  containImage?: boolean;
};

type JourneyStep = {
  title: string;
  text: string;
};

const LANGS: LangKey[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const navItems: { key: TabKey; label: string }[] = [
  { key: "portal", label: "Portal" },
  { key: "guest", label: "Guest Demo" },
  { key: "roles", label: "Roles" },
  { key: "youth", label: "Youth" },
  { key: "supervisor", label: "Supervisor" },
  { key: "parent", label: "Parent" },
  { key: "grower", label: "Grower" },
  { key: "crop", label: "Crop" },
  { key: "marketplace", label: "Marketplace" },
  { key: "operations", label: "Operations" },
  { key: "reports", label: "Reports" },
  { key: "partners", label: "Partners" },
];

const tourSteps: TourStep[] = [
  {
    id: "threshold",
    eyebrow: "Step 1 · The Threshold",
    title: "Enter the Farm Slowly",
    narration:
      "Before anyone sees the full farm, they arrive at a quiet forest gate. This gives the visitor time to understand that they are entering a living ecosystem, not just opening a website.",
    bullets: ["A calm entrance", "A sense of place", "A guided beginning"],
    image: "/images/SAM_0396.JPG",
    imageAlt: "Spring and summer forest entrance into Bronson Family Farm",
  },
  {
    id: "why",
    eyebrow: "Step 2 · Why It Exists",
    title: "The Need Becomes the Mission",
    narration:
      "The ecosystem exists because food, youth, family stability, land, health, and local opportunity are connected. Bronson Family Farm brings these pieces together in one place-based model.",
    bullets: ["Food access", "Youth opportunity", "Healing-centered work", "Local circulation"],
    image: "/images/ConnectFoodEcosystem_withimages.png",
    imageAlt: "Bronson Family Farm connected ecosystem overview",
    containImage: true,
  },
  {
    id: "who",
    eyebrow: "Step 3 · Who Enters",
    title: "Every Person Has a Pathway",
    narration:
      "Guests, youth, parents, supervisors, growers, customers, and partners each enter through a different pathway. Their journeys are different, but they all connect to the same ecosystem.",
    bullets: ["Guest pathway", "Youth pathway", "Supervisor pathway", "Parent pathway", "Grower pathway"],
    image: "/images/SAM_0405.JPG",
    imageAlt: "Youth and community participants at the farm",
  },
  {
    id: "movement",
    eyebrow: "Step 4 · How It Moves",
    title: "The Pathways Connect",
    narration:
      "The ecosystem works because one pathway affects another. Crop planning connects to the marketplace. Supervisors connect to youth progress. Parents connect to stability. Reports connect the story to data.",
    bullets: ["Youth to supervisors", "Growers to marketplace", "Crop plans to harvest", "Reflections to reports"],
    image: "/images/Grow Area.png",
    imageAlt: "Growing area showing pathway movement",
  },
  {
    id: "operations",
    eyebrow: "Step 5 · Live Operations",
    title: "Now the Control Room Makes Sense",
    narration:
      "Only after the visitor understands the people, purpose, and movement should they see the living control room. This is where weather, teams, crop planning, marketplace inventory, assessments, and reports come together.",
    bullets: ["Weather awareness", "Supervisor access", "Assessment tracking", "Marketplace readiness"],
    image: "/images/Compost_ElliottGarden.png",
    imageAlt: "Farm operations and infrastructure",
  },
];

const journeys: Record<string, JourneyStep[]> = {
  guest: [
    { title: "Arrive", text: "The guest enters through the forest portal and understands this is a place-based ecosystem." },
    { title: "Discover", text: "The guest learns how food, youth, land, health, and community opportunity connect." },
    { title: "Choose", text: "The guest may enter the youth, parent, grower, marketplace, partner, or operations pathway." },
    { title: "Respond", text: "The guest leaves with a clear invitation to shop, volunteer, partner, support, or return." },
  ],
  youth: [
    { title: "Orientation", text: "Youth begin with safety, PPE, expectations, attendance, photo/media permissions, and supervisor assignment." },
    { title: "Daily Rhythm", text: "Each day includes check-in, farm tasks, hydration, skill focus, reflection, and supervisor notes." },
    { title: "Skill Growth", text: "Youth build responsibility, teamwork, communication, crop knowledge, and work readiness." },
    { title: "Progress", text: "Supervisors document participation, life skills progression, achievements, and support needs." },
  ],
  supervisor: [
    { title: "Approved Staff Access", text: "Supervisors are approved staff. They are the adults with assigned youth access." },
    { title: "Team Support", text: "Each supervisor supports no more than 15 youth and guides safety, work, behavior, and encouragement." },
    { title: "Mobile Assessment", text: "Supervisors use phone-friendly tools for attendance, checklist, rubric, observations, and flags." },
    { title: "Reports", text: "Supervisor notes flow into progress reports, parent updates, program review, and funder documentation." },
  ],
  parent: [
    { title: "Connection", text: "Parents understand where youth are, who supervises them, and what the program is building." },
    { title: "Updates", text: "Families receive attendance, milestones, safety notices, encouragement, and progress summaries." },
    { title: "Support", text: "The system helps families reinforce punctuality, responsibility, and positive participation." },
    { title: "Celebration", text: "Parents see growth through badges, reflections, approved photos, and completion summaries." },
  ],
  grower: [
    { title: "Enter", text: "A grower comes looking for tools, knowledge, supplies, market access, or collaboration." },
    { title: "Plan", text: "The grower connects with crop planning, planting calendars, resource needs, and growing education." },
    { title: "Sell / Share", text: "The grower can connect to marketplace opportunities, community events, and local food distribution." },
    { title: "Strengthen", text: "The system builds a stronger regional network of growers and producers." },
  ],
  crop: [
    { title: "Plan", text: "Crop plans connect seed starts, Bubble Babies™, growing areas, harvest windows, and market inventory." },
    { title: "Watch Weather", text: "Weather affects watering, outdoor work, planting, transplanting, and youth task scheduling." },
    { title: "Track Harvest", text: "Harvest notes prepare the marketplace, reports, and customer communication." },
    { title: "Move Inventory", text: "Crops move from planning to growing to harvest to marketplace to community access." },
  ],
  marketplace: [
    { title: "Products", text: "The marketplace includes produce, seedlings, Bubble Babies™, grower supplies, demonstrations, and seasonal offerings." },
    { title: "Access", text: "Families and customers connect to food, nutrition education, pickup, ordering, and community events." },
    { title: "Circulation", text: "Money, food, knowledge, and opportunity circulate locally." },
    { title: "Sustainability", text: "Marketplace activity helps sustain the farm, growers, youth workforce, and community programming." },
  ],
  operations: [
    { title: "Control Room", text: "Operations shows active teams, weather, harvest status, supervisor access, inventory, and reports." },
    { title: "Safety", text: "Youth access is limited to approved supervisors and staff roles. Random visitors do not access youth records." },
    { title: "Coordination", text: "Schedules, crop plans, assessments, parent updates, and marketplace inventory connect in one system." },
    { title: "Decisions", text: "Leadership can see what is happening and decide what needs attention today." },
  ],
  reports: [
    { title: "Daily Capture", text: "Attendance, participation, reflections, supervisor notes, and task completion are captured throughout the program." },
    { title: "Youth Progress", text: "Reports show growth in reliability, teamwork, responsibility, communication, safety, and skill development." },
    { title: "Program Evidence", text: "Reports support partner communication, funder documentation, board updates, and continuous improvement." },
    { title: "Story + Data", text: "The ecosystem preserves both human stories and operational data." },
  ],
  partners: [
    { title: "Alignment", text: "Partners understand where their resources fit inside the larger food, youth, health, and community system." },
    { title: "Contribution", text: "Partners can contribute supplies, expertise, demonstrations, funding, workforce support, or visibility." },
    { title: "Collaboration", text: "The system shows how partners connect without duplicating effort." },
    { title: "Impact", text: "Partners see outcomes through reports, participation, food access, youth progress, and regional growth." },
  ],
};

const roleCards = [
  { key: "guest" as TabKey, label: "Guest", image: "/images/ConnectFoodEcosystem_withimages.png", text: "Experience the story, purpose, and entry into the ecosystem." },
  { key: "youth" as TabKey, label: "Youth", image: "/images/SAM_0405.JPG", text: "Build skills, confidence, responsibility, and future readiness." },
  { key: "supervisor" as TabKey, label: "Supervisor", image: "/images/Fence_volunteers.png", text: "Guide, protect, assess, encourage, and document youth progress." },
  { key: "parent" as TabKey, label: "Parent", image: "/images/Samaeera2.jpg", text: "Stay connected to attendance, progress, safety, and encouragement." },
  { key: "grower" as TabKey, label: "Grower", image: "/images/Grow Area.png", text: "Connect to tools, knowledge, crop planning, and market opportunity." },
  { key: "marketplace" as TabKey, label: "Marketplace", image: "/images/CSU_MParker.png", text: "Move food, knowledge, products, and economic circulation." },
];

function imageFallback(src: string) {
  if (src.startsWith("/images/")) return src.replace("/images/", "/");
  return "/images/GrowArea2.jpg";
}

function SmartImage({ src, alt, contain = false }: { src: string; alt: string; contain?: boolean }) {
  const [current, setCurrent] = useState(src);
  useEffect(() => setCurrent(src), [src]);
  return <img src={current} alt={alt} onError={() => setCurrent(imageFallback(src))} className={contain ? "smart-image contain" : "smart-image"} />;
}

function JourneyPanel({ type }: { type: string }) {
  const steps = journeys[type] || journeys.guest;
  return (
    <div className="journey-grid">
      {steps.map((step, index) => (
        <article className="journey-card" key={step.title}>
          <div className="journey-number">{index + 1}</div>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </article>
      ))}
    </div>
  );
}

function BackgroundImage({ portal }: { portal: boolean }) {
  const portalImages = [
    "/images/SAM_0396.JPG",
    "/SAM_0396.JPG",
    "/images/SAM_0391.JPG",
    "/SAM_0391.JPG",
    "/images/Grow Area.png",
    "/Grow Area.png",
    "/images/GrowArea2.jpg",
    "/GrowArea2.jpg",
  ];

  const ecosystemImages = [
    "/images/GrowArea2.jpg",
    "/GrowArea2.jpg",
    "/images/Grow Area.png",
    "/Grow Area.png",
  ];

  const images = portal ? portalImages : ecosystemImages;
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [portal]);

  return (
    <div className={`forest-bg ${portal ? "portal-forest" : "ecosystem-forest"}`}>
      <img
        src={images[index]}
        alt="Bronson Family Farm forest background"
        className="forest-bg-image"
        onError={() => setIndex((value) => Math.min(value + 1, images.length - 1))}
      />
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("portal");
  const [language, setLanguage] = useState<LangKey>("English");
  const [tourOpen, setTourOpen] = useState(false);
  const [tourRunning, setTourRunning] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const step = tourSteps[tourIndex];
  const progress = useMemo(() => ((tourIndex + 1) / tourSteps.length) * 100, [tourIndex]);
  const isRTL = language === "עברית";

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.76;
    utterance.pitch = 0.92;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!tourOpen || !tourRunning) return;
    speak(`${step.title}. ${step.narration}`);
    const timer = window.setTimeout(() => {
      setTourIndex((prev) => {
        if (prev >= tourSteps.length - 1) {
          setTourRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 17000);
    return () => window.clearTimeout(timer);
  }, [tourOpen, tourRunning, tourIndex]);

  const openTab = (key: TabKey) => {
    setTab(key);
    setTourOpen(false);
    setTourRunning(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const startTour = () => {
    setTourOpen(true);
    setTourRunning(true);
    setTourIndex(0);
    setTimeout(() => {
      speak("Welcome to Bronson Family Farm. You are entering a living ecosystem. Please take your time. Look around. Listen carefully. This is more than a farm.");
    }, 400);
  };

  const pauseTour = () => {
    setTourRunning(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const resumeTour = () => setTourRunning(true);

  const nextTour = () => {
    pauseTour();
    setTourIndex((prev) => Math.min(prev + 1, tourSteps.length - 1));
  };

  const backTour = () => {
    pauseTour();
    setTourIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <main className="app" dir={isRTL ? "rtl" : "ltr"}>
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; min-height: 100%; background: #030503; color: white; font-family: Inter, Arial, Helvetica, sans-serif; }
        button, select { font-family: inherit; }
        button { cursor: pointer; }
        .app { min-height: 100vh; overflow-x: hidden; background: #030503; }

        .forest-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: #071006;
        }

        .forest-bg-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          opacity: 1;
        }

        .forest-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .portal-forest .forest-bg-image {
          filter: brightness(.95) saturate(1.25) contrast(1.05);
          transform: scale(1.01);
        }

        .portal-forest::after {
          background: linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.38));
        }

        .ecosystem-forest .forest-bg-image {
          filter: blur(3px) brightness(.82) saturate(1.18) contrast(1.02);
          transform: scale(1.04);
        }

        .ecosystem-forest::after {
          background:
            radial-gradient(circle at center, rgba(122,166,70,.14), rgba(0,0,0,.40) 58%, rgba(0,0,0,.78) 100%),
            linear-gradient(90deg, rgba(0,0,0,.48), rgba(62,111,45,.16), rgba(0,0,0,.58));
        }

        .screen { position: relative; z-index: 1; width: min(1540px, calc(100vw - 36px)); margin: 0 auto; padding: 18px 0 32px; }
        .screen.portal-screen { padding-top: 0; }

        .topbar { position: sticky; top: 12px; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 18px; border: 1px solid rgba(255,255,255,.12); border-radius: 28px; background: rgba(16,22,17,.82); backdrop-filter: blur(22px); box-shadow: 0 20px 55px rgba(0,0,0,.32); }
        .brand { min-width: 205px; }
        .brand-kicker { font-size: 12px; letter-spacing: .32em; color: #bcd2a0; font-weight: 900; }
        .brand-title { font-size: 20px; line-height: 1.1; font-weight: 950; margin-top: 4px; }
        .nav { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; flex: 1; }
        .nav button, .pill-button { border: 1px solid rgba(255,255,255,.16); color: white; border-radius: 999px; background: rgba(255,255,255,.11); padding: 12px 16px; font-size: 14px; font-weight: 900; transition: 180ms ease; }
        .nav button:hover, .pill-button:hover { transform: translateY(-1px); background: rgba(255,255,255,.18); }
        .nav button.active, .pill-button.active { background: linear-gradient(135deg, #53e28e, #27c875); color: #031005; border-color: rgba(255,255,255,.28); box-shadow: 0 0 20px rgba(63,226,139,.25); }
        .language { min-width: 130px; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.10); color: white; border-radius: 999px; padding: 12px 15px; outline: none; font-weight: 800; }
        .language option { color: #111; }

        .portal { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 28px 20px; position: relative; }
        .portal-card { width: min(760px, 100%); border-radius: 38px; padding: clamp(30px, 4vw, 56px); background: rgba(5,8,6,.38); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.16); box-shadow: 0 30px 100px rgba(0,0,0,.45); text-align: center; animation: portalFloat 7s ease-in-out infinite; }
        @keyframes portalFloat { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
        .portal-kicker { color: #b7dc75; font-size: 12px; letter-spacing: .42em; font-weight: 900; margin-bottom: 22px; text-transform: uppercase; }
        .portal h1 { margin: 0; font-size: clamp(46px, 5.8vw, 82px); line-height: .92; letter-spacing: -2px; font-weight: 950; text-shadow: 0 4px 22px rgba(0,0,0,.72); }
        .portal p { margin: 22px auto 0; max-width: 640px; color: rgba(255,255,255,.90); font-size: clamp(16px, 1.25vw, 21px); line-height: 1.45; text-shadow: 0 2px 14px rgba(0,0,0,.65); }
        .portal-actions { display: flex; justify-content: center; margin-top: 26px; }
        .portal-tag {
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.08);
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,.68);
          letter-spacing: .02em;
          backdrop-filter: blur(4px);
          cursor: default;
          pointer-events: none;
          box-shadow: none;
        }

        .primary-button, .secondary-button { border: 1px solid rgba(255,255,255,.16); border-radius: 999px; padding: 15px 24px; color: white; font-weight: 950; background: rgba(255,255,255,.12); }
        .primary-button { background: linear-gradient(135deg, #83b63d, #4f8d25); box-shadow: 0 12px 30px rgba(87,144,42,.32); }
        .secondary-button { background: rgba(0,0,0,.34); }

        .tour-panel, .section { margin-top: 24px; border: 1px solid rgba(255,255,255,.12); background: rgba(7,10,8,.74); backdrop-filter: blur(18px); border-radius: 34px; padding: 28px; box-shadow: 0 25px 70px rgba(0,0,0,.34); }
        .tour-layout { display: grid; grid-template-columns: .82fr 1.18fr; gap: 26px; align-items: stretch; }
        .tour-copy { display: flex; flex-direction: column; justify-content: space-between; gap: 22px; }
        .tour-copy h2, .section-title { margin: 0 0 12px; font-size: clamp(34px, 4vw, 62px); line-height: .95; font-weight: 950; letter-spacing: -1px; }
        .tour-copy p, .section-lead { margin: 0; color: rgba(255,255,255,.78); font-size: 18px; line-height: 1.5; }
        .eyebrow { color: #b7dc75; font-size: 12px; letter-spacing: .38em; font-weight: 950; text-transform: uppercase; margin-bottom: 15px; }
        .tour-bullets { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; margin-top: 22px; }
        .tour-bullet { border: 1px solid rgba(255,255,255,.12); border-radius: 20px; background: rgba(255,255,255,.07); padding: 15px; font-weight: 850; color: rgba(255,255,255,.86); }
        .progress-track { height: 8px; width: 100%; border-radius: 999px; background: rgba(255,255,255,.15); overflow: hidden; margin: 20px 0 0; }
        .progress-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #7bb640, #d5b05e); transition: width 400ms ease; }
        .tour-actions { display: flex; flex-wrap: wrap; gap: 12px; }
        .tour-image { position: relative; min-height: 520px; border: 1px solid rgba(255,255,255,.11); border-radius: 30px; overflow: hidden; background: rgba(0,0,0,.55); }
        .smart-image { width: 100%; height: 100%; min-height: 260px; object-fit: cover; object-position: center; display: block; filter: saturate(1.07) contrast(1.05) brightness(1.02); }
        .smart-image.contain { object-fit: contain; background: rgba(0,0,0,.74); padding: 16px; }
        .tour-image .smart-image { min-height: 520px; }
        .tour-step-buttons { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 9px; margin-top: 15px; }
        .tour-step-buttons button { border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.08); color: rgba(255,255,255,.72); border-radius: 17px; padding: 10px; min-height: 58px; text-align: left; font-weight: 900; font-size: 12px; }
        .tour-step-buttons button.active { background: rgba(124,183,63,.25); color: white; border-color: rgba(188,242,124,.42); }
        .role-grid, .journey-grid { display: grid; gap: 18px; }
        .role-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
        .journey-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
        .role-card, .journey-card { overflow: hidden; border: 1px solid rgba(255,255,255,.13); background: rgba(255,255,255,.07); border-radius: 28px; }
        .role-card .smart-image { height: 220px; min-height: 220px; }
        .role-content, .journey-card { padding: 20px; }
        .role-content h3, .journey-card h3 { margin: 0 0 10px; font-size: 24px; line-height: 1.12; }
        .role-content p, .journey-card p { margin: 0 0 18px; color: rgba(255,255,255,.73); line-height: 1.4; }
        .journey-number { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: rgba(125,181,64,.28); border: 1px solid rgba(188,242,124,.34); color: #d5ff9f; font-weight: 950; margin-bottom: 14px; }
        .control-list { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
        .control-item { border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.08); border-radius: 20px; padding: 18px; font-weight: 850; }
        @media (max-width: 1200px) { .tour-layout { grid-template-columns: 1fr; } .role-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } .journey-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 760px) { .screen { width: min(100vw - 20px, 1540px); padding-top: 10px; } .topbar { position: relative; top: 0; align-items: flex-start; flex-direction: column; } .nav { justify-content: flex-start; } .nav button { padding: 10px 13px; font-size: 13px; } .portal-card, .tour-panel, .section { padding: 22px; border-radius: 26px; } .portal h1 { font-size: 54px; } .tour-bullets, .tour-step-buttons, .role-grid, .journey-grid, .control-list { grid-template-columns: 1fr; } .tour-image, .tour-image .smart-image { min-height: 330px; } }
      `}</style>

      <BackgroundImage portal={tab === "portal"} />

      <div className={tab === "portal" ? "screen portal-screen" : "screen"}>
        {tab !== "portal" && (
          <header className="topbar">
            <div className="brand">
              <div className="brand-kicker">BRONSON FAMILY FARM</div>
              <div className="brand-title">Online Ecosystem</div>
            </div>

            <nav className="nav" aria-label="Ecosystem navigation">
              {navItems.map((item) => (
                <button key={item.key} className={tab === item.key ? "active" : ""} onClick={() => openTab(item.key)}>
                  {item.label}
                </button>
              ))}
            </nav>

            <select className="language" value={language} onChange={(event) => setLanguage(event.target.value as LangKey)}>
              {LANGS.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </header>
        )}

        {tab === "portal" && !tourOpen && (
          <section className="portal">
            <div className="portal-card">
              <div className="portal-kicker">Forest Gate Portal</div>
              <h1>Step Into<br />the Ecosystem</h1>
              <p>
                Bronson Family Farm is a living ecosystem where food, learning, healing, growers, families, youth, and community opportunity come together.
              </p>
              <div className="portal-actions">
                <button className="primary-button" onClick={startTour}>Enter The Ecosystem</button>
              </div>
              <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", opacity: 0.9 }}>
                <div className="portal-tag">Food Access</div>
                <div className="portal-tag">Youth Workforce</div>
                <div className="portal-tag">Grower Opportunity</div>
                <div className="portal-tag">Community Healing</div>
              </div>
            </div>
          </section>
        )}

        {tab === "portal" && tourOpen && (
          <section className="tour-panel">
            <div className="tour-layout">
              <div className="tour-copy">
                <div>
                  <div className="eyebrow">{step.eyebrow}</div>
                  <h2>{step.title}</h2>
                  <p>{step.narration}</p>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                  <div className="tour-bullets">
                    {step.bullets.map((bullet) => <div className="tour-bullet" key={bullet}>{bullet}</div>)}
                  </div>
                </div>
                <div>
                  <div className="tour-actions">
                    {tourRunning ? <button className="primary-button" onClick={pauseTour}>Pause Narration</button> : <button className="primary-button" onClick={resumeTour}>Resume Narration</button>}
                    <button className="secondary-button" onClick={backTour}>Back</button>
                    <button className="secondary-button" onClick={nextTour}>Next</button>
                    <button className="secondary-button" onClick={() => openTab("guest")}>Enter Ecosystem</button>
                  </div>
                  <div className="tour-step-buttons">
                    {tourSteps.map((tourStep, index) => (
                      <button key={tourStep.id} className={tourIndex === index ? "active" : ""} onClick={() => { pauseTour(); setTourIndex(index); }}>
                        {tourStep.eyebrow}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="tour-image">
                <SmartImage src={step.image} alt={step.imageAlt} contain={step.containImage} />
              </div>
            </div>
          </section>
        )}

        {tab !== "portal" && (
          <section className="section">
            <div className="eyebrow">{navItems.find((item) => item.key === tab)?.label} Pathway</div>
            <h1 className="section-title">
              {tab === "operations" ? "Living Control Room" : tab === "roles" ? "Every Role Connects to the Whole" : `${navItems.find((item) => item.key === tab)?.label} Journey`}
            </h1>
            <p className="section-lead">
              {tab === "operations"
                ? "This operational layer appears after the visitor understands the people, purpose, and pathway movement."
                : tab === "roles"
                ? "Each role has its own doorway, but no role stands alone. Every role connects back to food, learning, workforce, marketplace, family, and community impact."
                : "This pathway lets the viewer experience what happens in this part of the ecosystem."}
            </p>

            {tab === "roles" ? (
              <div className="role-grid">
                {roleCards.map((role) => (
                  <article className="role-card" key={role.key}>
                    <SmartImage src={role.image} alt={role.label} contain={role.image.includes("ConnectFoodEcosystem")} />
                    <div className="role-content">
                      <h3>{role.label}</h3>
                      <p>{role.text}</p>
                      <button className="pill-button" onClick={() => openTab(role.key)}>Open Journey</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : tab === "operations" ? (
              <>
                <div className="control-list">
                  <div className="control-item">Active teams: 4</div>
                  <div className="control-item">Supervisors are approved staff with youth access</div>
                  <div className="control-item">Weather affects outdoor scheduling</div>
                  <div className="control-item">Crop planning connects to inventory</div>
                  <div className="control-item">Reports connect to assessments and reflections</div>
                  <div className="control-item">Marketplace inventory connects to harvest readiness</div>
                </div>
                <div style={{ height: 20 }} />
                <JourneyPanel type="operations" />
              </>
            ) : (
              <JourneyPanel type={tab} />
            )}
          </section>
        )}
      </div>
    </main>
  );
}
