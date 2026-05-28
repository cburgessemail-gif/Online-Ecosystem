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

type TourStep = {
  id: string;
  eyebrow: string;
  title: string;
  narration: string;
  bullets: string[];
  image?: string;
  imageAlt?: string;
  containImage?: boolean;
  visual?: "forest" | "operations";
};

type JourneyStep = {
  title: string;
  text: string;
};

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
    title: "Enter The Forest Slowly",
    narration:
      "Before anyone sees the farm, you first enter a quiet forest threshold. Take your time. This is a guided journey into a living ecosystem, not simply a website.",
    bullets: ["Forest Entrance", "Guided Experience", "Spring And Summer Atmosphere", "Living Ecosystem"],
    visual: "forest",
  },
  {
    id: "history",
    eyebrow: "Step 2 · Historic Ground",
    title: "The Land Holds History",
    narration:
      "This property carries the history of the historic Lansdowne Airport. Long before the ecosystem existed, this land connected people through aviation, movement, and regional service.",
    bullets: ["Historic Airport", "Regional Legacy", "Movement", "Transformation"],
    image: "/images/GrowArea2.jpg",
    imageAlt: "Historic Lansdowne Airport property and land context",
  },
  {
    id: "service",
    eyebrow: "Step 3 · Service And Legacy",
    title: "Service Still Lives Here",
    narration:
      "The spirit of service continues through leadership, responsibility, youth development, and the military legacy connected to the Bronson family story and community stewardship.",
    bullets: ["Military Legacy", "Responsibility", "Leadership", "Future Generations"],
    image: "/images/Fence_volunteers.png",
    imageAlt: "Community volunteers and leadership activity",
  },
  {
    id: "purpose",
    eyebrow: "Step 4 · Why It Exists",
    title: "Why The Ecosystem Was Built",
    narration:
      "Bronson Family Farm was created to reconnect food, families, growers, health, workforce development, and community opportunity into one living place-based system.",
    bullets: ["Food Access", "Youth Workforce", "Community Healing", "Grower Opportunity"],
    image: "/images/SAM_0405.JPG",
    imageAlt: "Youth and community engagement at the farm",
  },
  {
    id: "ecosystem",
    eyebrow: "Step 5 · The System Opens",
    title: "Now The Ecosystem Appears",
    narration:
      "Only after you understand the history, service, purpose, and people does the ecosystem begin to fully reveal itself. The pathways connect food, youth, growers, families, marketplace activity, and community partners.",
    bullets: ["Connected Pathways", "Marketplace", "Operations", "Living Infrastructure"],
    image: "/images/ConnectFoodEcosystem_withimages.png",
    imageAlt: "Bronson Family Farm connected ecosystem overview",
    containImage: true,
  },
  {
    id: "operations",
    eyebrow: "Step 6 · Living Operations",
    title: "The Living Control Room",
    narration:
      "As your guided tour reaches the living control room, you begin to see how the ecosystem stays coordinated day by day. Weather, youth safety, crop planning, marketplace readiness, assessments, supervisors, and reports all connect together.",
    bullets: ["Weather", "Youth Safety", "Marketplace Readiness", "Operations"],
    visual: "operations",
  },
];

const journeys: Record<string, JourneyStep[]> = {
  guest: [
    { title: "Arrive", text: "The guest enters through a forest threshold and experiences the ecosystem gradually." },
    { title: "Discover", text: "The guest learns how forest, history, service, food, youth, land, and community opportunity connect." },
    { title: "Choose", text: "The guest may continue into youth, parent, grower, marketplace, partner, or operations pathways." },
    { title: "Respond", text: "The guest leaves with an invitation to shop, volunteer, partner, support, or return." },
  ],
  roles: [
    { title: "Guests", text: "Visitors experience the story, purpose, history, and doorway into the ecosystem." },
    { title: "Youth", text: "Youth build responsibility, confidence, teamwork, safety, and workforce readiness." },
    { title: "Supervisors", text: "Approved staff guide youth, protect access, document progress, and encourage growth." },
    { title: "Growers", text: "Growers connect to tools, planning, education, market opportunities, and local circulation." },
  ],
  youth: [
    { title: "Orientation", text: "Youth begin with safety, PPE, expectations, attendance, permissions, and supervisor assignment." },
    { title: "Daily Rhythm", text: "Each day includes check-in, farm tasks, hydration, skill focus, reflection, and supervisor notes." },
    { title: "Skill Growth", text: "Youth build responsibility, teamwork, communication, crop knowledge, and work readiness." },
    { title: "Progress", text: "Supervisors document participation, life skills progression, achievements, and support needs." },
  ],
  supervisor: [
    { title: "Approved Access", text: "Supervisors are approved staff. They are the adults with assigned access to youth tools and records." },
    { title: "Team Support", text: "Each supervisor supports no more than 15 youth and guides safety, work, behavior, and encouragement." },
    { title: "Mobile Assessment", text: "Supervisors use phone-friendly tools for attendance, checklists, rubric notes, observations, and flags." },
    { title: "Reports", text: "Supervisor notes flow into progress reports, parent updates, program review, and documentation." },
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
    { title: "Sell And Share", text: "The grower can connect to marketplace opportunities, community events, and food distribution." },
    { title: "Strengthen", text: "The system builds a stronger regional network of growers and producers." },
  ],
  crop: [
    { title: "Plan", text: "Crop plans connect seed starts, Bubble Babies, growing areas, harvest windows, and market inventory." },
    { title: "Weather", text: "Weather affects watering, outdoor work, planting, transplanting, and youth task scheduling." },
    { title: "Harvest", text: "Harvest notes prepare the marketplace, reports, and customer communication." },
    { title: "Move", text: "Crops move from planning to growing to harvest to marketplace to community access." },
  ],
  marketplace: [
    { title: "Products", text: "The marketplace includes produce, seedlings, Bubble Babies, grower supplies, demonstrations, and seasonal offerings." },
    { title: "Access", text: "Families and customers connect to food, nutrition education, pickup, ordering, and community events." },
    { title: "Circulation", text: "Money, food, knowledge, and opportunity circulate locally." },
    { title: "Sustainability", text: "Marketplace activity helps sustain the farm, growers, youth workforce, and programming." },
  ],
  operations: [
    { title: "Control Room", text: "Operations shows active teams, weather, harvest status, supervisor access, inventory, and reports." },
    { title: "Safety", text: "Youth access is limited to approved supervisors and staff roles. Random visitors do not access youth records." },
    { title: "Coordination", text: "Schedules, crop plans, assessments, parent updates, and marketplace inventory connect in one system." },
    { title: "Decisions", text: "Leadership can see what is happening and decide what needs attention today." },
  ],
  reports: [
    { title: "Capture", text: "Attendance, participation, reflections, supervisor notes, and task completion are captured throughout the program." },
    { title: "Progress", text: "Reports show growth in reliability, teamwork, responsibility, communication, safety, and skills." },
    { title: "Evidence", text: "Reports support partner communication, funder documentation, board updates, and improvement." },
    { title: "Story And Data", text: "The ecosystem preserves both human stories and operational data." },
  ],
  partners: [
    { title: "Alignment", text: "Partners understand where their resources fit inside the larger food, youth, health, and community system." },
    { title: "Contribution", text: "Partners can contribute supplies, expertise, demonstrations, funding, workforce support, or visibility." },
    { title: "Collaboration", text: "The system shows how partners connect without duplicating effort." },
    { title: "Impact", text: "Partners see outcomes through reports, participation, food access, youth progress, and regional growth." },
  ],
};

const roleCards = [
  { key: "guest" as TabKey, label: "Guest", text: "Experience the story, purpose, history, and entry into the ecosystem." },
  { key: "youth" as TabKey, label: "Youth", text: "Build skills, confidence, responsibility, and future readiness." },
  { key: "supervisor" as TabKey, label: "Supervisor", text: "Guide, protect, assess, encourage, and document youth progress." },
  { key: "parent" as TabKey, label: "Parent", text: "Stay connected to attendance, progress, safety, and encouragement." },
  { key: "grower" as TabKey, label: "Grower", text: "Connect to tools, knowledge, crop planning, and market opportunity." },
  { key: "marketplace" as TabKey, label: "Marketplace", text: "Move food, knowledge, products, and economic circulation." },
];

function buildImageCandidates(src: string) {
  const clean = src.replace(/^\//, "");
  const file = clean.split("/").pop() || clean;
  const encoded = encodeURIComponent(file);

  return Array.from(
    new Set([
      src,
      `/${clean}`,
      `/images/${file}`,
      `/${file}`,
      `/images/${encoded}`,
      `/${encoded}`,
      "/images/ConnectFoodEcosystem_withimages.png",
      "/ConnectFoodEcosystem_withimages.png",
      "/images/GrowArea2.jpg",
      "/GrowArea2.jpg",
    ])
  );
}

function SmartImage({ src, alt, contain = false }: { src: string; alt: string; contain?: boolean }) {
  const candidates = useMemo(() => buildImageCandidates(src), [src]);
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [src]);

  return (
    <img
      src={candidates[index]}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() => setIndex((value) => Math.min(value + 1, candidates.length - 1))}
      className={contain ? "smart-image contain" : "smart-image"}
    />
  );
}

function ForestThresholdVisual() {
  return (
    <div className="forest-threshold-visual" aria-label="Cinematic spring and summer forest threshold">
      <div className="forest-canopy canopy-one" />
      <div className="forest-canopy canopy-two" />
      <div className="forest-canopy canopy-three" />
      <div className="forest-path" />
      <div className="forest-light" />
      <div className="forest-caption">
        <span>Quiet forest threshold</span>
        <strong>The farm has not been revealed yet.</strong>
      </div>
    </div>
  );
}

function BackgroundAtmosphere() {
  return (
    <div className="forest-bg" aria-hidden="true">
      <div className="forest-sky" />
      <div className="forest-trunks trunks-back" />
      <div className="forest-trunks trunks-front" />
      <div className="forest-leaves leaves-left" />
      <div className="forest-leaves leaves-right" />
      <div className="forest-leaves leaves-top" />
      <div className="forest-pathway" />
      <div className="forest-overlay" />
    </div>
  );
}

function OperationsVisual() {
  return (
    <div className="operations-visual">
      <div className="operations-kicker">Living Control Room</div>
      <h3>Operations Connect the Ecosystem</h3>
      <div className="operations-grid">
        <div>Weather</div>
        <div>Teams</div>
        <div>Youth Safety</div>
        <div>Crop Planning</div>
        <div>Marketplace</div>
        <div>Reports</div>
      </div>
      <p>As a guest on the tour, this is where you begin to see how the farm stays coordinated day by day.</p>
    </div>
  );
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

export default function App() {
  const [tab, setTab] = useState<TabKey>("portal");
  const [tourOpen, setTourOpen] = useState(false);
  const [tourRunning, setTourRunning] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const step = tourSteps[tourIndex];
  const progress = useMemo(() => ((tourIndex + 1) / tourSteps.length) * 100, [tourIndex]);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82;
    utterance.pitch = 1.02;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => voice.name.toLowerCase().includes("google")) || voices[0];
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!tourOpen || !tourRunning) return;

    speak(step.narration);

    const timer = window.setTimeout(() => {
      setTourIndex((prev) => {
        if (prev >= tourSteps.length - 1) {
          setTourRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 26000);

    return () => window.clearTimeout(timer);
  }, [tourOpen, tourRunning, tourIndex]);

  const startTour = () => {
    setTourOpen(true);
    setTourIndex(0);
    setTourRunning(false);
    speak("Welcome to Bronson Family Farm. Take your time. Let the forest open slowly before the farm is revealed.");
    window.setTimeout(() => setTourRunning(true), 9000);
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

  const openTab = (key: TabKey) => {
    setTab(key);
    setTourOpen(false);
    setTourRunning(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  return (
    <main className="app">
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; min-height: 100%; background: #030603; color: white; font-family: Inter, Arial, Helvetica, sans-serif; }
        button { font-family: inherit; cursor: pointer; }
        .app { min-height: 100vh; overflow-x: hidden; background: #030603; }

        .forest-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; background: #071006; }
        .forest-sky { position: absolute; inset: 0; background: radial-gradient(circle at 50% 18%, rgba(196,225,126,.22), rgba(61,117,49,.22) 28%, rgba(9,28,14,.88) 66%, #020402 100%); }
        .forest-trunks { position: absolute; inset: -8% -4%; background-repeat: repeat-x; background-size: 180px 100%; opacity: .62; filter: blur(.6px); }
        .trunks-back { background-image: linear-gradient(90deg, transparent 0 18px, rgba(8,17,10,.78) 18px 29px, transparent 29px 82px, rgba(10,22,12,.62) 82px 96px, transparent 96px 180px); transform: scale(1.08); opacity: .38; }
        .trunks-front { background-image: linear-gradient(90deg, transparent 0 44px, rgba(3,8,4,.92) 44px 62px, transparent 62px 130px, rgba(5,12,6,.86) 130px 146px, transparent 146px 180px); opacity: .50; }
        .forest-leaves { position: absolute; border-radius: 999px; filter: blur(24px); mix-blend-mode: screen; }
        .leaves-left { width: 48vw; height: 60vh; left: -16vw; top: -8vh; background: radial-gradient(circle, rgba(94,156,65,.44), rgba(41,92,40,.22) 48%, transparent 72%); }
        .leaves-right { width: 52vw; height: 64vh; right: -18vw; top: -4vh; background: radial-gradient(circle, rgba(117,174,76,.38), rgba(35,84,38,.20) 50%, transparent 74%); }
        .leaves-top { width: 76vw; height: 32vh; left: 12vw; top: -14vh; background: radial-gradient(ellipse, rgba(126,184,76,.34), rgba(52,102,43,.18) 45%, transparent 74%); }
        .forest-pathway { position: absolute; left: 34%; bottom: -18%; width: 32%; height: 78%; background: radial-gradient(ellipse at bottom, rgba(77,61,39,.30), rgba(53,69,39,.13) 45%, transparent 72%); clip-path: polygon(42% 0, 58% 0, 100% 100%, 0 100%); filter: blur(8px); opacity: .72; }
        .forest-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(127,188,82,.12), rgba(0,0,0,.28) 43%, rgba(0,0,0,.78) 100%), linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.58)); }

        .screen { position: relative; z-index: 1; width: min(1540px, calc(100vw - 36px)); margin: 0 auto; }
        .portal { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
        .portal-card { width: min(760px, 100%); border-radius: 38px; padding: clamp(32px, 4vw, 56px); background: rgba(5,8,6,.36); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.12); box-shadow: 0 30px 100px rgba(0,0,0,.45); text-align: center; }
        .portal-kicker, .eyebrow { color: #c0e67d; font-size: 12px; letter-spacing: .38em; font-weight: 900; margin-bottom: 18px; text-transform: uppercase; }
        .portal h1 { margin: 0; font-size: clamp(54px, 7vw, 92px); line-height: .92; font-weight: 950; letter-spacing: -3px; text-shadow: 0 4px 22px rgba(0,0,0,.68); }
        .portal p { margin: 26px auto 0; max-width: 640px; color: rgba(255,255,255,.88); font-size: clamp(17px, 1.35vw, 22px); line-height: 1.5; }
        .portal-actions { display: flex; justify-content: center; margin-top: 34px; }
        .primary-button, .secondary-button { border: 1px solid rgba(255,255,255,.16); border-radius: 999px; padding: 15px 24px; color: white; font-weight: 950; font-size: 16px; background: rgba(255,255,255,.10); }
        .primary-button { border: none; background: linear-gradient(135deg, #8fc642, #5b9727); box-shadow: 0 16px 36px rgba(91,151,39,.38); }
        .portal-tags { margin-top: 24px; display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; }
        .portal-tag { padding: 10px 16px; border-radius: 999px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); font-size: 13px; font-weight: 700; color: rgba(255,255,255,.68); pointer-events: none; }

        .topbar { position: sticky; top: 12px; z-index: 30; display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 18px; padding: 14px 18px; border: 1px solid rgba(255,255,255,.12); border-radius: 28px; background: rgba(16,22,17,.82); backdrop-filter: blur(22px); }
        .brand-kicker { color: #c0e67d; font-size: 12px; letter-spacing: .30em; font-weight: 950; }
        .brand-title { font-size: 20px; line-height: 1.1; font-weight: 950; margin-top: 4px; }
        .nav { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; flex: 1; }
        .nav button { border: 1px solid rgba(255,255,255,.16); color: white; border-radius: 999px; background: rgba(255,255,255,.11); padding: 12px 16px; font-size: 14px; font-weight: 900; }
        .nav button.active { background: linear-gradient(135deg, #53e28e, #27c875); color: #031005; }

        .tour-panel, .section { margin-top: 24px; border: 1px solid rgba(255,255,255,.12); background: rgba(7,10,8,.74); backdrop-filter: blur(18px); border-radius: 34px; padding: 28px; box-shadow: 0 25px 70px rgba(0,0,0,.34); }
        .tour-layout { display: grid; grid-template-columns: .82fr 1.18fr; gap: 26px; align-items: stretch; }
        .tour-copy { display: flex; flex-direction: column; justify-content: space-between; gap: 24px; }
        .tour-copy h2, .section-title { margin: 0 0 12px; font-size: clamp(38px, 5vw, 74px); line-height: .94; font-weight: 950; letter-spacing: -1px; }
        .tour-copy p, .section-lead { color: rgba(255,255,255,.82); font-size: 21px; line-height: 1.55; max-width: 900px; }
        .progress-track { height: 8px; width: 100%; background: rgba(255,255,255,.14); border-radius: 999px; overflow: hidden; margin-top: 20px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #8fc642, #d7bb6a); transition: width 350ms ease; }
        .tour-bullets { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 22px; }
        .tour-bullet { border: 1px solid rgba(255,255,255,.12); border-radius: 20px; background: rgba(255,255,255,.07); padding: 15px; font-weight: 850; }
        .tour-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .tour-step-buttons { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 9px; margin-top: 14px; }
        .tour-step-buttons button { border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.08); color: rgba(255,255,255,.74); border-radius: 16px; padding: 10px; min-height: 58px; text-align: left; font-weight: 900; font-size: 12px; }
        .tour-step-buttons button.active { background: rgba(124,183,63,.25); color: white; border-color: rgba(188,242,124,.42); }
        .tour-image { border-radius: 30px; overflow: hidden; min-height: 520px; background: rgba(0,0,0,.34); }
        .smart-image { width: 100%; height: 100%; min-height: 520px; object-fit: cover; object-position: center; display: block; }
        .smart-image.contain { object-fit: contain; background: rgba(0,0,0,.65); padding: 12px; }

        .forest-threshold-visual { position: relative; min-height: 520px; height: 100%; overflow: hidden; background: linear-gradient(180deg, #142814, #050905 72%); }
        .forest-threshold-visual::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at top center, rgba(143,198,66,.28), transparent 38%), linear-gradient(90deg, rgba(0,0,0,.72), transparent 40%, rgba(0,0,0,.72)); }
        .forest-canopy { position: absolute; border-radius: 999px; filter: blur(28px); opacity: .78; }
        .canopy-one { width: 60%; height: 58%; left: -18%; top: -5%; background: rgba(49,102,47,.55); }
        .canopy-two { width: 62%; height: 60%; right: -20%; top: -3%; background: rgba(61,116,54,.52); }
        .canopy-three { width: 80%; height: 45%; left: 10%; bottom: -12%; background: rgba(19,52,25,.68); }
        .forest-path { position: absolute; width: 46%; height: 100%; left: 27%; bottom: -18%; background: radial-gradient(ellipse at bottom, rgba(128,101,67,.34), rgba(51,69,37,.12) 45%, transparent 70%); clip-path: polygon(40% 0, 60% 0, 100% 100%, 0 100%); opacity: .65; }
        .forest-light { position: absolute; width: 24%; height: 92%; left: 38%; top: 0; background: linear-gradient(180deg, rgba(201,239,139,.20), rgba(108,170,78,.06), transparent); filter: blur(18px); opacity: .8; }
        .forest-caption { position: absolute; left: 28px; right: 28px; bottom: 28px; padding: 18px; border-radius: 22px; background: rgba(0,0,0,.42); border: 1px solid rgba(255,255,255,.10); backdrop-filter: blur(10px); }
        .forest-caption span { display: block; color: #c0e67d; font-size: 12px; text-transform: uppercase; letter-spacing: .24em; font-weight: 900; margin-bottom: 8px; }
        .forest-caption strong { display: block; font-size: 24px; line-height: 1.1; }

        .journey-grid, .role-grid { display: grid; gap: 18px; }
        .journey-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .journey-card, .role-card { border: 1px solid rgba(255,255,255,.13); background: rgba(255,255,255,.07); border-radius: 28px; padding: 22px; }
        .journey-number { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: rgba(125,181,64,.28); border: 1px solid rgba(188,242,124,.34); color: #d5ff9f; font-weight: 950; margin-bottom: 14px; }
        .journey-card h3, .role-card h3 { margin: 0 0 10px; font-size: 24px; line-height: 1.12; }
        .journey-card p, .role-card p { margin: 0; color: rgba(255,255,255,.76); line-height: 1.4; }

        .operations-visual { min-height: 520px; height: 100%; padding: 34px; display: flex; flex-direction: column; justify-content: center; background: radial-gradient(circle at top right, rgba(83,226,142,.20), transparent 38%), linear-gradient(135deg, rgba(11,35,24,.94), rgba(5,8,6,.96)); border: 1px solid rgba(83,226,142,.24); color: white; }
        .operations-kicker { color: #b7dc75; font-size: 12px; letter-spacing: .36em; font-weight: 950; text-transform: uppercase; margin-bottom: 14px; }
        .operations-visual h3 { margin: 0 0 20px; font-size: clamp(34px, 4vw, 58px); line-height: .95; font-weight: 950; }
        .operations-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 18px 0 22px; }
        .operations-grid div { border: 1px solid rgba(255,255,255,.14); border-radius: 18px; background: rgba(255,255,255,.08); padding: 16px; font-weight: 900; }
        .operations-visual p { margin: 0; color: rgba(255,255,255,.78); line-height: 1.45; font-size: 18px; }

        @media (max-width: 1100px) { .tour-layout { grid-template-columns: 1fr; } .journey-grid, .role-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .tour-step-buttons { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (max-width: 720px) { .screen { width: min(100vw - 20px, 1540px); } .portal-card, .tour-panel, .section { padding: 22px; border-radius: 26px; } .portal h1 { font-size: 52px; } .tour-bullets, .journey-grid, .role-grid, .tour-step-buttons { grid-template-columns: 1fr; } .smart-image, .tour-image, .forest-threshold-visual { min-height: 330px; } }
      `}</style>

      <BackgroundAtmosphere />

      <div className="screen">
        {tab !== "portal" && (
          <header className="topbar">
            <div>
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
          </header>
        )}

        {tab === "portal" && !tourOpen && (
          <section className="portal">
            <div className="portal-card">
              <div className="portal-kicker">Forest Gate Portal</div>
              <h1>Step Into<br />the Ecosystem</h1>
              <p>Enter slowly. This is a guided journey through a living ecosystem. The farm will reveal itself when the story is ready.</p>
              <div className="portal-actions">
                <button className="primary-button" onClick={startTour}>Begin Guided Experience</button>
              </div>
              <div className="portal-tags">
                <div className="portal-tag">Forest Threshold</div>
                <div className="portal-tag">Guided Story</div>
                <div className="portal-tag">Place-Based Legacy</div>
                <div className="portal-tag">Community Future</div>
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
                    <button className="primary-button" onClick={() => openTab("guest")}>Enter Ecosystem</button>
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
                {step.visual === "forest" ? <ForestThresholdVisual /> : step.visual === "operations" ? <OperationsVisual /> : <SmartImage src={step.image || "/images/ConnectFoodEcosystem_withimages.png"} alt={step.imageAlt || step.title} contain={step.containImage} />}
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
                ? "This operational layer appears after the guest understands the people, history, service, purpose, and pathway movement."
                : tab === "roles"
                ? "Each role has its own doorway, but no role stands alone. Every role connects back to food, learning, workforce, marketplace, family, and community impact."
                : "This pathway lets the viewer experience what happens in this part of the ecosystem."}
            </p>

            {tab === "roles" ? (
              <div className="role-grid">
                {roleCards.map((role) => (
                  <article className="role-card" key={role.key}>
                    <h3>{role.label}</h3>
                    <p>{role.text}</p>
                    <div style={{ height: 18 }} />
                    <button className="primary-button" onClick={() => openTab(role.key)}>Open Journey</button>
                  </article>
                ))}
              </div>
            ) : tab === "operations" ? (
              <div className="tour-layout">
                <JourneyPanel type="operations" />
                <OperationsVisual />
              </div>
            ) : (
              <JourneyPanel type={tab} />
            )}
          </section>
        )}
      </div>
    </main>
  );
}
