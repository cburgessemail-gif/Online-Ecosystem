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

type EcosystemStep = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  containImage?: boolean;
};

type JourneyStep = {
  title: string;
  text: string;
  action?: string;
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

const ecosystemSteps: EcosystemStep[] = [
  {
    id: "enter",
    eyebrow: "ENTER THE ECOSYSTEM",
    title: "A Living Community Food Ecosystem",
    subtitle:
      "Bronson Family Farm is not just a farm. It is a connected operational ecosystem where youth, growers, families, supervisors, customers, and community partners work together to grow food, opportunity, healing, education, and local economic circulation.",
    bullets: [
      "50 youth workforce participants",
      "118+ acres of connected growing vision",
      "8 weeks of immersive workforce training",
      "1 connected community ecosystem",
    ],
    image: "/images/ConnectFoodEcosystem_withimages.png",
    imageAlt: "Connected Bronson Family Farm food ecosystem graphic",
    containImage: true,
  },
  {
    id: "why",
    eyebrow: "WHY THIS EXISTS",
    title: "Community Need Becomes Community Infrastructure",
    subtitle:
      "The farm responds to food insecurity, disconnected youth, limited grower infrastructure, underused land, and the need for healing-centered workforce pathways.",
    bullets: [
      "Food access and nutrition education",
      "Youth disconnected from opportunity",
      "Growers needing tools, visibility, and market support",
      "Families needing affordable healthy choices",
    ],
    image: "/images/GrowArea2.jpg",
    imageAlt: "Bronson Family Farm growing area",
  },
  {
    id: "who",
    eyebrow: "WHO ENTERS",
    title: "Every Role Has a Pathway",
    subtitle:
      "Guests, youth, parents, growers, customers, supervisors, partners, and marketplace participants each enter through their own pathway, but their actions connect inside one shared system.",
    bullets: [
      "Youth build skills and responsibility",
      "Supervisors guide, protect, assess, and encourage",
      "Parents stay connected to progress",
      "Growers and partners strengthen the food system",
    ],
    image: "/images/SAM_0405.JPG",
    imageAlt: "Youth and community pathway at the farm",
  },
  {
    id: "connects",
    eyebrow: "HOW EVERYTHING CONNECTS",
    title: "Pathways Create Movement",
    subtitle:
      "Assessments affect reports. Growers affect marketplace inventory. Weather affects scheduling. Supervisors affect youth outcomes. Parent engagement affects stability. Marketplace circulation affects community food access.",
    bullets: [
      "Youth ↔ Supervisors ↔ Reports",
      "Growers ↔ Crop Planning ↔ Marketplace",
      "Parents ↔ Encouragement ↔ Attendance",
      "Partners ↔ Resources ↔ Community impact",
    ],
    image: "/images/ConnectFoodEcosystem_withimages.png",
    imageAlt: "Ecosystem connection diagram",
    containImage: true,
  },
  {
    id: "control",
    eyebrow: "LIVE OPERATIONS",
    title: "Living Control Room",
    subtitle:
      "After the viewer understands the ecosystem, the control room shows the operational layer that keeps it alive today.",
    bullets: [
      "Approved supervisors have youth access",
      "Weather impacts outdoor scheduling",
      "Crop planning connects to inventory",
      "Reports connect to assessments and reflections",
    ],
    image: "/images/Compost_ElliottGarden.png",
    imageAlt: "Farm operations and infrastructure",
  },
];

const roleCards = [
  {
    key: "guest" as TabKey,
    label: "Guest",
    image: "/images/ConnectFoodEcosystem_withimages.png",
    text: "Walk in as a visitor. Leave understanding the vision, the land, and the reason the ecosystem exists.",
  },
  {
    key: "youth" as TabKey,
    label: "Youth Workforce",
    image: "/images/SAM_0405.JPG",
    text: "Youth move through safety, attendance, skill-building, crop work, reflection, teamwork, and progress tracking.",
  },
  {
    key: "supervisor" as TabKey,
    label: "Supervisor",
    image: "/images/Fence_volunteers.png",
    text: "Approved staff guide youth, document participation, support behavior, assess progress, and protect access.",
  },
  {
    key: "parent" as TabKey,
    label: "Parent / Guardian",
    image: "/images/Samaeera2.jpg",
    text: "Parents stay informed through attendance, updates, encouragement, safety notices, and youth progress summaries.",
  },
  {
    key: "grower" as TabKey,
    label: "Grower",
    image: "/images/Grow Area.png",
    text: "Growers receive tools, education, support, marketplace connection, and local food system visibility.",
  },
  {
    key: "marketplace" as TabKey,
    label: "Marketplace",
    image: "/images/CSU_MParker.png",
    text: "The marketplace connects produce, seedlings, Bubble Babies™, grower supplies, ordering, and community circulation.",
  },
];

const journeys: Record<string, JourneyStep[]> = {
  guest: [
    { title: "1. Arrive", text: "The guest enters through the forest gate and sees Bronson Family Farm as a living place, not a static website." },
    { title: "2. Understand", text: "The guest learns why food, youth, land, health, and opportunity are connected." },
    { title: "3. Choose", text: "The guest can continue into roles, marketplace, grower support, partner opportunities, or the guided overview." },
    { title: "4. Respond", text: "The guest leaves with a clear invitation to shop, volunteer, partner, support, or return." },
  ],
  youth: [
    { title: "1. Orientation", text: "Youth begin with safety, expectations, PPE, attendance rules, photo/media permissions, and supervisor assignment." },
    { title: "2. Daily Rhythm", text: "Each day includes check-in, farm task assignment, skill focus, hydration/safety breaks, reflection, and supervisor notes." },
    { title: "3. Skill Growth", text: "Youth build responsibility, communication, teamwork, crop knowledge, equipment awareness, and future readiness." },
    { title: "4. Progress", text: "Supervisors document attendance, participation, life skills progression, behavior support, and achievements." },
  ],
  supervisor: [
    { title: "1. Approved Staff Access", text: "Supervisors are approved staff. They are the only adults with assigned access to youth records and assessment tools." },
    { title: "2. Team Load", text: "Each supervisor supports no more than 15 youth, guiding safety, behavior, work assignments, and encouragement." },
    { title: "3. Mobile Assessment", text: "Supervisors use phone-friendly tools for attendance, daily checklist, skill rubric, observation notes, and incident flags." },
    { title: "4. Reporting", text: "Supervisor notes flow into reports for progress, parent updates, program review, and funder documentation." },
  ],
  parent: [
    { title: "1. Connection", text: "Parents and guardians understand where youth are, who supervises them, and what the program is building." },
    { title: "2. Updates", text: "Families receive attendance, milestones, safety notices, encouragement, and progress summaries." },
    { title: "3. Support", text: "The system helps families reinforce punctuality, responsibility, work readiness, and positive participation." },
    { title: "4. Celebration", text: "Parents see growth through badges, reflections, photos when approved, and completion summaries." },
  ],
  grower: [
    { title: "1. Enter as a Grower", text: "A grower comes looking for tools, knowledge, supplies, market access, or collaboration." },
    { title: "2. Plan", text: "The grower connects with crop planning, planting calendars, resource needs, and practical growing education." },
    { title: "3. Sell / Share", text: "The grower can connect to marketplace opportunities, community events, and local food distribution." },
    { title: "4. Strengthen", text: "The system builds a stronger regional network of growers and producers." },
  ],
  crop: [
    { title: "1. Crop Planning", text: "Crop plans connect seed starts, Bubble Babies™, growing areas, expected harvest windows, and market inventory." },
    { title: "2. Weather Awareness", text: "Weather affects watering, outdoor work, planting, transplanting, and youth task scheduling." },
    { title: "3. Harvest Readiness", text: "Harvest notes prepare the marketplace, reports, and customer communication." },
    { title: "4. Inventory Movement", text: "Crops move from planning to growing to harvest to marketplace to community access." },
  ],
  marketplace: [
    { title: "1. Products", text: "The marketplace includes produce, seedlings, Bubble Babies™, grower supplies, demonstrations, and seasonal offerings." },
    { title: "2. Access", text: "Families and customers connect to food, nutrition education, pickup, ordering, and community events." },
    { title: "3. Circulation", text: "Money, food, knowledge, and opportunity circulate locally instead of leaving the community." },
    { title: "4. Sustainability", text: "Marketplace activity helps sustain the farm, growers, youth workforce, and community programming." },
  ],
  operations: [
    { title: "1. Control Room", text: "Operations shows active teams, weather, harvest status, supervisor access, inventory, and reports." },
    { title: "2. Safety", text: "Youth access is limited to approved supervisors and staff roles. Random visitors do not access youth records." },
    { title: "3. Coordination", text: "Schedules, crop plans, assessments, parent updates, and marketplace inventory connect in one operational system." },
    { title: "4. Decisions", text: "Leadership can see what is happening and decide what needs attention today." },
  ],
  reports: [
    { title: "1. Daily Capture", text: "Attendance, participation, reflections, supervisor notes, and task completion are captured throughout the program." },
    { title: "2. Youth Progress", text: "Reports show growth in reliability, teamwork, responsibility, communication, safety, and skill development." },
    { title: "3. Program Evidence", text: "Reports support partner communication, funder documentation, board updates, and continuous improvement." },
    { title: "4. Story + Data", text: "The ecosystem preserves both human stories and operational data." },
  ],
  partners: [
    { title: "1. Alignment", text: "Partners understand where their resources fit inside the larger food, youth, health, and community system." },
    { title: "2. Contribution", text: "Partners can contribute supplies, expertise, demonstrations, funding, workforce support, or community visibility." },
    { title: "3. Collaboration", text: "The system shows how partners connect without duplicating effort." },
    { title: "4. Impact", text: "Partners can see outcomes through reports, participation, food access, youth progress, and regional growth." },
  ],
};

function imageFallback(src: string) {
  if (src.startsWith("/images/")) return src.replace("/images/", "/");
  return `/images${src}`;
}

function SmartImage({ src, alt, contain = false }: { src: string; alt: string; contain?: boolean }) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => setCurrentSrc(src), [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={() => setCurrentSrc((old) => (old === src ? imageFallback(src) : "/images/GrowArea2.jpg"))}
      className={contain ? "smart-image contain" : "smart-image"}
    />
  );
}

function StatusCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="status-card">
      <div className="status-label">{label}</div>
      <div className="status-value">{value}</div>
      <div className="status-note">{note}</div>
    </div>
  );
}

function JourneyPanel({ type }: { type: string }) {
  const steps = journeys[type] || journeys.guest;

  return (
    <div className="journey-grid">
      {steps.map((step, index) => (
        <div className="journey-card" key={step.title}>
          <div className="journey-number">{index + 1}</div>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
          {step.action && <button className="small-button">{step.action}</button>}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("portal");
  const [language, setLanguage] = useState<LangKey>("English");
  const [tourRunning, setTourRunning] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const activeStep = ecosystemSteps[tourIndex];
  const progress = useMemo(() => ((tourIndex + 1) / ecosystemSteps.length) * 100, [tourIndex]);
  const isRTL = language === "עברית";

  useEffect(() => {
    if (!tourRunning) return;
    const timer = window.setTimeout(() => {
      setTourIndex((prev) => {
        if (prev >= ecosystemSteps.length - 1) {
          setTourRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 7600);

    return () => window.clearTimeout(timer);
  }, [tourRunning, tourIndex]);

  const openJourney = (key: TabKey) => {
    setTab(key);
    setTourRunning(false);
  };

  const nextTour = () => {
    setTourIndex((prev) => Math.min(prev + 1, ecosystemSteps.length - 1));
  };

  const backTour = () => {
    setTourIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <main className="app" dir={isRTL ? "rtl" : "ltr"}>
      <style>{`
        * { box-sizing: border-box; }

        html, body, #root {
          margin: 0;
          min-height: 100%;
          background: #030503;
          color: white;
          font-family: Inter, Arial, Helvetica, sans-serif;
        }

        button, select { font-family: inherit; }

        .app {
          min-height: 100vh;
          background:
            radial-gradient(circle at 78% 20%, rgba(98, 135, 44, .18), transparent 35%),
            radial-gradient(circle at 18% 86%, rgba(172, 117, 45, .12), transparent 32%),
            linear-gradient(135deg, #050805 0%, #0c1209 42%, #060706 100%);
          overflow-x: hidden;
        }

        .forest-backdrop {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image: linear-gradient(90deg, rgba(0,0,0,.78), rgba(0,0,0,.42), rgba(0,0,0,.78)), url('/images/GrowArea2.jpg');
          background-size: cover;
          background-position: center;
          filter: saturate(1.06) contrast(1.08);
          opacity: .82;
        }

        .screen {
          position: relative;
          z-index: 1;
          width: min(1540px, calc(100vw - 36px));
          margin: 0 auto;
          padding: 18px 0 28px;
        }

        .topbar {
          position: sticky;
          top: 12px;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 14px 18px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 28px;
          background: rgba(16, 22, 17, .82);
          backdrop-filter: blur(22px);
          box-shadow: 0 20px 55px rgba(0,0,0,.32);
        }

        .brand {
          min-width: 208px;
        }

        .brand-kicker {
          font-size: 12px;
          letter-spacing: .32em;
          color: #bcd2a0;
          font-weight: 900;
        }

        .brand-title {
          font-size: 20px;
          line-height: 1.1;
          font-weight: 950;
          margin-top: 4px;
        }

        .nav {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 9px;
          flex: 1;
        }

        .nav button, .pill-button {
          border: 1px solid rgba(255,255,255,.16);
          color: white;
          cursor: pointer;
          border-radius: 999px;
          background: rgba(255,255,255,.11);
          padding: 12px 17px;
          font-size: 14px;
          font-weight: 900;
          transition: 180ms ease;
        }

        .nav button:hover, .pill-button:hover { transform: translateY(-1px); background: rgba(255,255,255,.18); }

        .nav button.active, .pill-button.active {
          background: linear-gradient(135deg, #53e28e, #27c875);
          color: #031005;
          border-color: rgba(255,255,255,.28);
          box-shadow: 0 0 20px rgba(63, 226, 139, .25);
        }

        .language {
          min-width: 130px;
          border: 1px solid rgba(255,255,255,.18);
          background: rgba(255,255,255,.10);
          color: white;
          border-radius: 999px;
          padding: 12px 15px;
          outline: none;
          font-weight: 800;
        }

        .language option { color: #111; }

        .hero-layout {
          display: grid;
          grid-template-columns: .92fr 1.08fr;
          gap: 28px;
          align-items: stretch;
          margin-top: 22px;
        }

        .hero-copy, .glass-panel {
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(7, 10, 8, .72);
          backdrop-filter: blur(16px);
          border-radius: 34px;
          box-shadow: 0 25px 70px rgba(0,0,0,.40);
        }

        .hero-copy {
          min-height: calc(100vh - 178px);
          padding: 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .eyebrow {
          color: #b7dc75;
          font-size: 12px;
          letter-spacing: .38em;
          font-weight: 950;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(42px, 4.6vw, 82px);
          line-height: .92;
          letter-spacing: -2px;
          font-weight: 950;
        }

        .hero-subtitle {
          margin: 22px 0 0;
          font-size: clamp(18px, 1.38vw, 24px);
          line-height: 1.42;
          color: rgba(255,255,255,.80);
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 28px;
        }

        .primary-button, .secondary-button, .small-button {
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 999px;
          padding: 14px 22px;
          color: white;
          cursor: pointer;
          font-weight: 950;
          background: rgba(255,255,255,.12);
        }

        .primary-button {
          background: linear-gradient(135deg, #83b63d, #4f8d25);
          box-shadow: 0 12px 30px rgba(87, 144, 42, .32);
        }

        .secondary-button { background: rgba(0,0,0,.32); }
        .small-button { padding: 10px 14px; font-size: 13px; }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
          margin-top: 28px;
        }

        .metric {
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 22px;
          background: rgba(255,255,255,.07);
          padding: 17px;
        }

        .metric strong {
          display: block;
          color: #bcf27c;
          font-size: 30px;
          line-height: 1;
          margin-bottom: 6px;
        }

        .metric span {
          color: rgba(255,255,255,.74);
          font-size: 13px;
          line-height: 1.25;
        }

        .visual-card {
          position: relative;
          min-height: calc(100vh - 178px);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 34px;
          overflow: hidden;
          background: #060806;
          box-shadow: 0 25px 70px rgba(0,0,0,.40);
        }

        .smart-image {
          width: 100%;
          height: 100%;
          min-height: 420px;
          object-fit: cover;
          object-position: center;
          display: block;
          filter: saturate(1.07) contrast(1.05) brightness(1.02);
        }

        .smart-image.contain {
          object-fit: contain;
          background: rgba(0,0,0,.72);
          padding: 16px;
        }

        .visual-card .smart-image { min-height: calc(100vh - 178px); }

        .visual-overlay {
          position: absolute;
          inset: auto 18px 18px 18px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 26px;
          background: rgba(0,0,0,.62);
          backdrop-filter: blur(14px);
          padding: 18px;
        }

        .visual-overlay h2 {
          margin: 0 0 7px;
          font-size: 28px;
          line-height: 1;
        }

        .visual-overlay p {
          margin: 0;
          color: rgba(255,255,255,.78);
          line-height: 1.35;
        }

        .progress-track {
          height: 8px;
          width: 100%;
          border-radius: 999px;
          background: rgba(255,255,255,.15);
          overflow: hidden;
          margin: 22px 0;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #7bb640, #d5b05e);
          transition: width 400ms ease;
        }

        .tour-strip {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .tour-dot {
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.08);
          border-radius: 18px;
          padding: 12px;
          color: rgba(255,255,255,.68);
          cursor: pointer;
          text-align: left;
          font-weight: 900;
          min-height: 74px;
        }

        .tour-dot.active {
          background: rgba(124, 183, 63, .24);
          color: white;
          border-color: rgba(188, 242, 124, .42);
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .status-card {
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 22px;
          padding: 18px;
          background: rgba(255,255,255,.10);
          min-height: 92px;
        }

        .status-label {
          color: #b7ccae;
          font-size: 11px;
          letter-spacing: .35em;
          font-weight: 950;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .status-value {
          font-size: 22px;
          font-weight: 950;
          line-height: 1;
          margin-bottom: 8px;
        }

        .status-note {
          color: rgba(255,255,255,.70);
          font-size: 13px;
        }

        .section {
          margin-top: 24px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(7, 10, 8, .72);
          backdrop-filter: blur(16px);
          border-radius: 34px;
          padding: 28px;
          box-shadow: 0 25px 70px rgba(0,0,0,.34);
        }

        .section-title {
          margin: 0 0 10px;
          font-size: clamp(32px, 3vw, 50px);
          line-height: 1;
          font-weight: 950;
        }

        .section-lead {
          max-width: 960px;
          margin: 0 0 24px;
          color: rgba(255,255,255,.76);
          font-size: 18px;
          line-height: 1.42;
        }

        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .role-card {
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.13);
          background: rgba(255,255,255,.07);
          border-radius: 28px;
        }

        .role-card .smart-image {
          height: 220px;
          min-height: 220px;
        }

        .role-content {
          padding: 20px;
        }

        .role-content h3 {
          margin: 0 0 10px;
          font-size: 24px;
        }

        .role-content p {
          margin: 0 0 18px;
          color: rgba(255,255,255,.73);
          line-height: 1.38;
        }

        .journey-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
        }

        .journey-card {
          position: relative;
          border: 1px solid rgba(255,255,255,.13);
          background: rgba(255,255,255,.07);
          border-radius: 26px;
          padding: 22px;
          min-height: 220px;
        }

        .journey-number {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(125, 181, 64, .28);
          border: 1px solid rgba(188, 242, 124, .34);
          color: #d5ff9f;
          font-weight: 950;
          margin-bottom: 14px;
        }

        .journey-card h3 {
          margin: 0 0 10px;
          font-size: 21px;
          line-height: 1.14;
        }

        .journey-card p {
          margin: 0;
          color: rgba(255,255,255,.73);
          line-height: 1.38;
          font-size: 15px;
        }

        .two-column {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 22px;
          align-items: stretch;
        }

        .feature-list {
          display: grid;
          gap: 12px;
        }

        .feature-item {
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.08);
          border-radius: 18px;
          padding: 15px 17px;
          font-weight: 850;
          line-height: 1.25;
        }

        .control-room {
          border: 1px solid rgba(64, 255, 180, .18);
          background: linear-gradient(135deg, rgba(17, 48, 37, .86), rgba(11, 19, 16, .92));
          border-radius: 32px;
          padding: 26px;
        }

        .control-room h2 {
          margin: 0 0 10px;
          font-size: 40px;
          line-height: 1;
        }

        .control-room p {
          color: rgba(255,255,255,.76);
          margin: 0 0 20px;
          line-height: 1.4;
        }

        .footer-space { height: 18px; }

        @media (max-width: 1200px) {
          .hero-layout, .two-column { grid-template-columns: 1fr; }
          .hero-copy, .visual-card, .visual-card .smart-image { min-height: auto; }
          .role-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .journey-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .status-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 720px) {
          .screen { width: min(100vw - 20px, 1540px); padding-top: 10px; }
          .topbar { position: relative; top: 0; align-items: flex-start; flex-direction: column; }
          .nav { justify-content: flex-start; }
          .nav button { padding: 10px 13px; font-size: 13px; }
          .hero-copy, .section { padding: 22px; border-radius: 26px; }
          .visual-card { border-radius: 26px; }
          .metric-grid, .tour-strip, .role-grid, .journey-grid, .status-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 42px; }
        }
      `}</style>

      <div className="forest-backdrop" />

      <div className="screen">
        <header className="topbar">
          <div className="brand">
            <div className="brand-kicker">BRONSON FAMILY FARM</div>
            <div className="brand-title">Online Ecosystem</div>
          </div>

          <nav className="nav" aria-label="Ecosystem navigation">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={tab === item.key ? "active" : ""}
                onClick={() => openJourney(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <select className="language" value={language} onChange={(event) => setLanguage(event.target.value as LangKey)}>
            {LANGS.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </header>

        {tab === "portal" && (
          <>
            <section className="hero-layout">
              <div className="hero-copy">
                <div>
                  <div className="eyebrow">{activeStep.eyebrow}</div>
                  <h1 className="hero-title">{activeStep.title}</h1>
                  <p className="hero-subtitle">{activeStep.subtitle}</p>

                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="metric-grid">
                    {activeStep.bullets.map((bullet, index) => (
                      <div className="metric" key={bullet}>
                        <strong>{index + 1}</strong>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="tour-strip">
                    {ecosystemSteps.map((step, index) => (
                      <button
                        key={step.id}
                        className={tourIndex === index ? "tour-dot active" : "tour-dot"}
                        onClick={() => {
                          setTourIndex(index);
                          setTourRunning(false);
                        }}
                      >
                        {step.eyebrow}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hero-actions">
                  <button className="primary-button" onClick={() => setTourRunning((value) => !value)}>
                    {tourRunning ? "Pause Tour" : "Guided Tour"}
                  </button>
                  <button className="secondary-button" onClick={backTour}>Back</button>
                  <button className="secondary-button" onClick={nextTour}>Next</button>
                  <button className="secondary-button" onClick={() => openJourney("guest")}>Enter Pathways</button>
                </div>
              </div>

              <div className="visual-card">
                <SmartImage src={activeStep.image} alt={activeStep.imageAlt} contain={activeStep.containImage} />
                <div className="visual-overlay">
                  <h2>{activeStep.id === "control" ? "Now the control room makes sense." : "The ecosystem explains itself first."}</h2>
                  <p>
                    {activeStep.id === "control"
                      ? "Operations appears after the viewer understands the people, purpose, movement, and connections."
                      : "This portal moves the viewer from why it exists, to who enters, to how everything connects."}
                  </p>
                </div>
              </div>
            </section>

            <div className="status-grid">
              <StatusCard label="Ecosystem" value="4 Active Teams" note="7 grow zones" />
              <StatusCard label="Weather" value="62° / mostly cloudy" note="Outdoor schedule awareness" />
              <StatusCard label="Harvest" value="Tomatoes approaching" note="Forecast open" />
              <StatusCard label="Reports" value="12 summaries ready" note="Documentation active" />
            </div>

            <section className="section">
              <div className="eyebrow">ROLE PATHWAYS</div>
              <h2 className="section-title">Choose a pathway. See how the ecosystem works.</h2>
              <p className="section-lead">
                The portal gives the overview. Each pathway gives depth. Every role has a journey, a purpose, a set of decisions, and a connection back to the living ecosystem.
              </p>

              <div className="role-grid">
                {roleCards.map((role) => (
                  <article className="role-card" key={role.key}>
                    <SmartImage src={role.image} alt={role.label} contain={role.image.includes("ConnectFoodEcosystem")} />
                    <div className="role-content">
                      <h3>{role.label}</h3>
                      <p>{role.text}</p>
                      <button className="pill-button" onClick={() => openJourney(role.key)}>Enter {role.label}</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {tab !== "portal" && (
          <section className="section">
            <div className="eyebrow">{navItems.find((item) => item.key === tab)?.label} PATHWAY</div>
            <h1 className="section-title">
              {tab === "operations"
                ? "Living Control Room"
                : tab === "roles"
                ? "Every Role Connects to the Whole"
                : `${navItems.find((item) => item.key === tab)?.label} Journey`}
            </h1>
            <p className="section-lead">
              {tab === "operations"
                ? "This is the operational layer that appears after the viewer understands the ecosystem. It shows active teams, weather, harvest, inventory, safety, supervisor access, parent connection, and reporting."
                : tab === "roles"
                ? "This page explains who enters the ecosystem and how each role strengthens the whole. No role stands alone. Each role connects back to food, learning, workforce, marketplace, family, and community impact."
                : "This pathway gives the viewer a direct experience of what happens in this part of the ecosystem."}
            </p>

            {tab === "roles" ? (
              <div className="role-grid">
                {roleCards.map((role) => (
                  <article className="role-card" key={role.key}>
                    <SmartImage src={role.image} alt={role.label} contain={role.image.includes("ConnectFoodEcosystem")} />
                    <div className="role-content">
                      <h3>{role.label}</h3>
                      <p>{role.text}</p>
                      <button className="pill-button" onClick={() => openJourney(role.key)}>Open Journey</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : tab === "operations" ? (
              <div className="two-column">
                <div className="control-room">
                  <h2>Today’s Operational View</h2>
                  <p>
                    The control room is not the first explanation. It is the proof that the ecosystem is alive after the viewer understands the journey.
                  </p>
                  <div className="feature-list">
                    <div className="feature-item">Active teams: 4</div>
                    <div className="feature-item">Supervisors are approved staff with youth access</div>
                    <div className="feature-item">62° / mostly cloudy</div>
                    <div className="feature-item">Tomatoes approaching</div>
                    <div className="feature-item">Marketplace inventory connected to crop planning</div>
                    <div className="feature-item">Reflections connect to encouragement and reports</div>
                  </div>
                </div>
                <JourneyPanel type="operations" />
              </div>
            ) : (
              <JourneyPanel type={tab} />
            )}
          </section>
        )}

        <div className="footer-space" />
      </div>
    </main>
  );
}
