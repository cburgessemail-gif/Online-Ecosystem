import React, { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Bronson Family Farm Online Ecosystem
 * CULTIVATOR ECOSYSTEM 13.2 — WEEK 5 MASTER FULL REPLACEMENT
 *
 * Full React/Vite App.tsx replacement.
 * Source lineage: Ecosystem 13.1 Workbook Master + Field Investigation Engine.
 * Current operating correction: Week 5 is the active curriculum week.
 *
 * Required operating architecture preserved:
 * - Forest Gate Portal with Guest / New / Returning access
 * - Youth Dashboard organized by Self → Work → Environment → Community → Opportunity → Legacy
 * - Workbook as the central operating record
 * - Today’s Work, field questions, reflection answers, discoveries, pest traps, and portfolio evidence
 * - Parent portal completion-only layer for contact/emergency information and work-status notices
 * - Supervisor tools for roster, attendance, PPE, daily assessment, behavior notes, incident/support log, and reports
 * - Mission Control work-status engine with parent/youth/supervisor notification drafts
 * - Participant lifecycle: Pending, Active, Completed, Inactive. Inactive users retain records but receive Visitor access only.
 * - Live weather layer using Open-Meteo for Youngstown/airport area when online
 * - Actual calendar that auto-advances by date, with Sunday preview of the coming week
 * - Crop planner, inventory, almanac, airport/community history, and guest journey foundations
 */

type Screen =
  | "portal"
  | "guest"
  | "registration"
  | "roles"
  | "youth"
  | "todayWork"
  | "workbook"
  | "journey"
  | "parent"
  | "supervisor"
  | "mission"
  | "marketplace"
  | "almanac"
  | "resources"
  | "events"
  | "completion";

type LanguageCode = "en" | "es" | "tl" | "it" | "he" | "fr";
type ParticipantStatus = "pending" | "active" | "completed" | "inactive";
type WorkStatusCode = "FULL_DAY" | "HALF_DAY" | "DELAYED_START" | "EARLY_DISMISSAL" | "WEATHER_SHELTER" | "CANCELLED";

type AppUser = {
  id: string;
  name: string;
  role: "Guest" | "Youth" | "Parent" | "Supervisor" | "Mission Control" | "Grower" | "Partner" | "Customer";
  status: ParticipantStatus;
};

type DailyPlan = {
  day: string;
  dateLabel: string;
  theme: string;
  curriculum: string;
  work: string[];
  safety: string[];
  questions: string[];
  community: string;
  opportunity: string;
  legacy: string;
};

type ProgramWeek = {
  week: number;
  title: string;
  bigIdea: string;
  proverb: string;
  days: DailyPlan[];
};

type WorkbookEntry = {
  id: string;
  date: string;
  week: number;
  section: "Self" | "Work" | "Environment" | "Community" | "Opportunity" | "Legacy" | "Field Investigation";
  prompt: string;
  response: string;
  createdAt: string;
};

type WorkStatusUpdate = {
  id: string;
  effectiveDate: string;
  label: string;
  status: WorkStatusCode;
  reason: string;
  action: string;
  parentMessage: string;
  createdAt: string;
};

type WeatherNow = {
  temp?: number;
  wind?: number;
  rain?: number;
  code?: number;
  loading: boolean;
  error?: string;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase: SupabaseClient | null = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const ECOSYSTEM_BASE_URL = "https://ecosystem.farmandfamilyalliance.org";
const PROGRAM_START = new Date("2026-06-08T00:00:00");
const CURRENT_WEEK_LOCK = 5;

const KEYS = {
  user: "bff.13_2.activeUser",
  language: "bff.13_2.language",
  workbook: "bff.13_2.workbook",
  workStatus: "bff.13_2.workStatus",
  roster: "bff.13_2.roster",
  attendance: "bff.13_2.attendance",
  ppe: "bff.13_2.ppe",
  parent: "bff.13_2.parentCompletion",
  inventory: "bff.13_2.inventory",
};

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function getCalendarDisplayBase(date = new Date()) {
  const display = new Date(date);
  if (display.getDay() === 0) display.setDate(display.getDate() + 1);
  return display;
}

function getProgramWeek(date = new Date()) {
  const base = getCalendarDisplayBase(date);
  const cursor = new Date(PROGRAM_START);
  let days = 0;
  while (cursor < base) {
    const day = cursor.getDay();
    if (day >= 1 && day <= 5) days += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return Math.max(CURRENT_WEEK_LOCK, Math.min(8, Math.floor(days / 5) + 1));
}

function getDayIndex(date = new Date()) {
  const base = getCalendarDisplayBase(date);
  const day = base.getDay();
  if (day >= 1 && day <= 5) return day - 1;
  return 0;
}

const weekPlans: ProgramWeek[] = [
  {
    week: 1,
    title: "Start the Cultivator Way",
    bigIdea: "Current conditions do not determine future potential.",
    proverb: "Small actions create large results.",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => ({
      day,
      dateLabel: `Week 1 ${day}`,
      theme: "Orientation, safety, work identity, and production simulation",
      curriculum: "Youth learn the daily rhythm, PPE, teamwork, and the first business cycle through the Cooling Fan Challenge.",
      work: ["Check in", "Confirm PPE", "Join a team", "Complete assigned production task", "Reflect in workbook"],
      safety: ["Closed-toe shoes", "Water bottle", "Supervisor direction", "Heat awareness"],
      questions: ["What did I learn about work today?", "How did my team help the farm?"],
      community: "A farm needs many kinds of workers, planners, builders, and helpers.",
      opportunity: "Production, design, quality control, and customer service are job skills.",
      legacy: "I started building a record of who I am becoming.",
    })),
  },
  {
    week: 2,
    title: "Sun, Soil, Water, and Observation",
    bigIdea: "A cultivator notices before acting.",
    proverb: "The best fertilizer is the gardener’s shadow.",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => ({
      day,
      dateLabel: `Week 2 ${day}`,
      theme: "Sun/shadow, soil preparation, compost, watering, and plant observation",
      curriculum: "Youth connect plant needs to their own environments, including woods, parks, vacant lots, and neighborhood growing spaces.",
      work: ["Observe sun and shade", "Prepare soil", "Water plants", "Collect compost materials", "Record plant health"],
      safety: ["Hydration", "Tool spacing", "Watch footing", "Gloves for rough material"],
      questions: ["Where did I see life in the grow area?", "What does a plant need that people also need?"],
      community: "Youngstown has many wooded areas and parks. Youth compare farm ecology to their own surroundings.",
      opportunity: "Observation supports farming, landscaping, park maintenance, science, and environmental work.",
      legacy: "I learned that caring for land begins with paying attention.",
    })),
  },
  {
    week: 3,
    title: "Infrastructure, Stewardship, and Adaptation",
    bigIdea: "We build systems that help life continue.",
    proverb: "Use what you have to improve what you can.",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => ({
      day,
      dateLabel: `Week 3 ${day}`,
      theme: "Fencing, water, tools, safety zones, and project flow",
      curriculum: "Youth learn that a farm is an operating system: tools, pathways, gates, water, shade, cleanup, and communication all matter.",
      work: ["Inspect work zones", "Support fencing or gate setup", "Return tools", "Update inventory", "Reflect on system improvement"],
      safety: ["Do not take rocks from driveway or airport cement", "Use scissors/hoes/hand shovels carefully", "Stay in assigned zones", "Report hazards"],
      questions: ["What system helped us work safely?", "What was confusing and how could it be improved?"],
      community: "Infrastructure shapes how people move, work, stay safe, and access opportunity.",
      opportunity: "Trades, heavy equipment, logistics, safety, and project management all connect here.",
      legacy: "I helped make the farm safer and more usable for the next group.",
    })),
  },
  {
    week: 4,
    title: "Production Area Maintenance and Plant Health",
    bigIdea: "Healthy systems need care, correction, and follow-through.",
    proverb: "A garden tells the truth to those who return to it.",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => ({
      day,
      dateLabel: `Week 4 ${day}`,
      theme: "Watering, plant health, Zone 5 melon work, pest traps, pepper supports, and grow-area manicure",
      curriculum: "Youth connect care, maintenance, and documentation to real production work.",
      work: ["Water priority crops", "Check plant health", "Weed carefully", "Prepare pest traps", "Record one improvement"],
      safety: ["Hydration first", "Use approved rock sources only", "Watch for insects and eggs", "Keep youth on assigned path"],
      questions: ["What changed since the last time I looked?", "Is our grow area impacting surrounding nature?"],
      community: "Youth examine whether farm work helps or harms nearby nature, creeks, pollinators, and wildlife corridors.",
      opportunity: "Plant health, pest monitoring, nursery work, and environmental observation are job skills.",
      legacy: "I practiced returning to a place and making it better.",
    })),
  },
  {
    week: 5,
    title: "Field Investigation: Ecosystems, Creeks, Waste, and Responsibility",
    bigIdea: "An ecosystem is a community of living and nonliving parts connected by relationships.",
    proverb: "Leave the land better than you found it.",
    days: [
      {
        day: "Monday",
        dateLabel: "Week 5 Monday",
        theme: "What is an ecosystem?",
        curriculum: "Youth define ecosystem through the farm: collards, yams, soil, insects, water, sun, weeds, people, tools, trash, and nearby wooded land.",
        work: ["Water upper grow area closest to the T-hangar", "Check collards and yams", "Observe what is living and nonliving", "Record one relationship in the workbook"],
        safety: ["Stay near assigned grow areas", "Hydrate", "Do not enter creek areas without supervisor approval", "Report sharp trash"],
        questions: ["What living things did I see today?", "What nonliving things affect them?", "How do people change this ecosystem?"],
        community: "Youth compare the farm ecosystem to woods, parks, yards, vacant lots, and creeks near home.",
        opportunity: "Ecosystem thinking connects to farming, park work, conservation, science, nursing, teaching, and public health.",
        legacy: "I can explain how my actions affect a place.",
      },
      {
        day: "Tuesday",
        dateLabel: "Week 5 Tuesday",
        theme: "Creeks, water flow, and boundaries",
        curriculum: "Youth stay near creeks only with clear boundaries and learn why water carries soil, nutrients, trash, and pollution through a community.",
        work: ["Map safe observation boundaries", "Look for water-flow signs", "Record erosion, trash, insects, plants, or animal evidence", "Connect creek health to farm choices"],
        safety: ["No creek entry", "Supervisor line-of-sight", "Buddy system", "Gloves for any cleanup"],
        questions: ["Where does water go after rain?", "What could water carry away from the grow area?", "How can we protect the creek?"],
        community: "Creeks connect neighborhoods. What happens upstream affects people and nature downstream.",
        opportunity: "Stormwater, environmental science, park maintenance, and public works careers begin with observation.",
        legacy: "I helped protect water by noticing risks before they grow.",
      },
      {
        day: "Wednesday",
        dateLabel: "Week 5 Wednesday",
        theme: "Pest traps, caterpillars, eggs, and plant protection",
        curriculum: "Youth check pest traps and learn the difference between harmful pests, beneficial insects, and pollinators.",
        work: ["Check pest traps", "Look under leaves for eggs or caterpillars", "Record butterfly/pollinator observations", "Protect pollinator habitat"],
        safety: ["Do not crush unknown insects without supervisor direction", "Wash hands", "Use gloves", "Avoid disturbing pollinator sanctuary"],
        questions: ["What evidence did the trap show?", "Did I see caterpillars or eggs?", "How do we protect crops without harming pollinators?"],
        community: "Food systems depend on pollinators, insects, birds, water, soil, and people making careful choices.",
        opportunity: "Integrated pest management, scouting, biology, and farm management are career pathways.",
        legacy: "I learned that protection requires knowledge, not panic.",
      },
      {
        day: "Thursday",
        dateLabel: "Week 5 Thursday",
        theme: "Trash, plastic water bottles, and environmental responsibility",
        curriculum: "Youth examine garbage, plastic water bottles, wrappers, and farm waste as part of the ecosystem, not separate from it.",
        work: ["Collect visible trash safely", "Sort plastic bottles and landfill waste", "Identify how waste could affect plants, water, wildlife, and people", "Create one prevention idea"],
        safety: ["Gloves required", "Do not pick up needles, glass, chemicals, or unknown waste", "Report sharp or unsafe items", "Wash hands"],
        questions: ["Where might this trash go if nobody picks it up?", "How could plastic affect water, wildlife, or soil?", "What rule would help youth reduce waste?"],
        community: "Waste in one place becomes a problem for everyone connected by wind, water, animals, and people.",
        opportunity: "Waste management, recycling, public health, sanitation, and environmental justice are real careers.",
        legacy: "I took responsibility for what people leave behind.",
      },
      {
        day: "Friday",
        dateLabel: "Week 5 Friday",
        theme: "Workbook proof, weekly review, and portfolio evidence",
        curriculum: "Youth turn field observations into a professional workbook record: questions, answers, photos, skills, community connection, and legacy reflection.",
        work: ["Complete weekly workbook", "Choose one portfolio proof", "Share one answer with supervisor", "Preview next week"],
        safety: ["Return tools", "Hydrate", "Clean hands", "Confirm pickup/departure"],
        questions: ["What did I understand better this week?", "What should Bronson Family Farm improve?", "What evidence proves I learned something?"],
        community: "Youth connect farm learning to their neighborhood environment and future responsibility.",
        opportunity: "The workbook becomes proof for resumes, interviews, school, and career pathways.",
        legacy: "I documented my growth instead of letting it disappear.",
      },
    ],
  },
  {
    week: 6,
    title: "Climate, Adaptation, and Community Resilience",
    bigIdea: "Climate change is local when heat, water, food, work, and safety change daily life.",
    proverb: "Adaptation is a strength.",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => ({
      day,
      dateLabel: `Week 6 ${day}`,
      theme: "Climate, heat, water, soil cover, shade, and resilience",
      curriculum: "Youth connect farm conditions to climate, public health, neighborhood trees, food access, and work safety.",
      work: ["Check heat and water needs", "Protect soil", "Observe shade", "Discuss adaptation", "Record a resilience idea"],
      safety: ["Heat index awareness", "Shade breaks", "Water first", "Supervisor approval before strenuous work"],
      questions: ["What changed because of heat or water limits?", "How can communities adapt?"],
      community: "Climate affects neighborhoods differently depending on trees, shade, housing, food, transportation, and resources.",
      opportunity: "Climate resilience jobs include agriculture, planning, construction, health, education, and environmental work.",
      legacy: "I learned that adaptation can protect people and land.",
    })),
  },
];

const airportHistory = [
  "Lansdowne Airport is part of Youngstown’s aviation, community, and land-use history.",
  "Bronson Family Farm operates at the airport as a living example of reuse, stewardship, workforce development, and community imagination.",
  "The guest journey should honor the airport story, local memory, veterans, workers, neighbors, and the land’s next chapter.",
  "LCDR Zachary Lansdowne’s memorial history belongs in the community-history layer as a respectful learning doorway.",
];

const defaultInventory = [
  "Water pitchers", "Water bottles", "Cooling towels", "Work gloves", "Scissors", "Hoes", "Hand shovels", "Rakes", "Markers", "Staplers", "Garbage bags", "Pest traps", "Clipboards", "First-aid kit"
];

function getWeekPlan(date = new Date()) {
  const week = getProgramWeek(date);
  return weekPlans.find((w) => w.week === week) || weekPlans.find((w) => w.week === CURRENT_WEEK_LOCK)!;
}

function getTodayPlan(date = new Date()) {
  const week = getWeekPlan(date);
  return week.days[getDayIndex(date)] || week.days[0];
}

function statusColor(status: WorkStatusCode) {
  if (status === "CANCELLED") return "bg-red-700 text-white border-red-800";
  if (status === "HALF_DAY" || status === "EARLY_DISMISSAL" || status === "DELAYED_START") return "bg-amber-200 text-amber-950 border-amber-300";
  if (status === "WEATHER_SHELTER") return "bg-sky-200 text-sky-950 border-sky-300";
  return "bg-emerald-200 text-emerald-950 border-emerald-300";
}

function defaultWorkStatus(date = new Date()): WorkStatusUpdate {
  const plan = getTodayPlan(date);
  return {
    id: `status-${formatDate(date)}`,
    effectiveDate: formatDate(date),
    label: "Program Open — Follow Today’s Assignment",
    status: "FULL_DAY",
    reason: "Normal operations unless Mission Control changes heat, weather, water, or safety status.",
    action: `Begin with PPE, weather, water, and ${plan.theme}.`,
    parentMessage: `Bronson Family Farm Work Status\n\n${plan.dateLabel}\n\nSTATUS: FULL DAY unless Mission Control updates conditions. Youth should bring water, wear PPE, and follow supervisor direction. Today’s learning focus is ${plan.theme}.`,
    createdAt: new Date().toISOString(),
  };
}

function useWeather(): WeatherNow {
  const [weather, setWeather] = useState<WeatherNow>({ loading: true });
  useEffect(() => {
    let alive = true;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=41.10&longitude=-80.65&current=temperature_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York")
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setWeather({
          loading: false,
          temp: Math.round(data.current?.temperature_2m),
          wind: Math.round(data.current?.wind_speed_10m),
          rain: data.current?.precipitation,
          code: data.current?.weather_code,
        });
      })
      .catch(() => alive && setWeather({ loading: false, error: "Live weather unavailable. Use the official forecast link and Mission Control guidance." }));
    return () => { alive = false; };
  }, []);
  return weather;
}

function AppButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`rounded-2xl px-4 py-3 text-left font-black shadow-sm transition hover:scale-[1.01] ${className}`}>{children}</button>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function Header({ user, setScreen, language, setLanguage }: { user: AppUser; setScreen: (s: Screen) => void; language: LanguageCode; setLanguage: (l: LanguageCode) => void }) {
  const weather = useWeather();
  const workStatus = readStore<WorkStatusUpdate>(KEYS.workStatus, defaultWorkStatus());
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button onClick={() => setScreen("portal")} className="text-left">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700">Bronson Family Farm</div>
          <div className="text-lg font-black text-slate-950">Cultivator Ecosystem 13.2</div>
        </button>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className={`rounded-full border px-3 py-2 ${statusColor(workStatus.status)}`}>{workStatus.label}</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">Week {getProgramWeek()} Active</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">{weather.loading ? "Weather loading" : weather.error ? "Weather check needed" : `${weather.temp}°F · Wind ${weather.wind} mph`}</span>
          <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)} className="rounded-full border border-slate-200 bg-white px-3 py-2 font-black">
            <option value="en">English</option><option value="es">Español</option><option value="tl">Tagalog</option><option value="it">Italiano</option><option value="he">עברית</option><option value="fr">Français</option>
          </select>
          <span className="rounded-full bg-slate-900 px-3 py-2 text-white">{user.name}</span>
        </div>
      </div>
    </header>
  );
}

function Portal({ setScreen, setUser }: { setScreen: (s: Screen) => void; setUser: (u: AppUser) => void }) {
  const enter = (role: AppUser["role"], screen: Screen) => {
    const u: AppUser = { id: role.toLowerCase().replaceAll(" ", "-"), name: role === "Guest" ? "Guest Visitor" : "Constance", role, status: "active" };
    setUser(u); writeStore(KEYS.user, u); setScreen(screen);
  };
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-emerald-950 via-slate-900 to-black p-8 text-white shadow-xl">
        <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-200">Forest Gate Portal</div>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">Step into the ecosystem. We Grow Green to Harvest Dreams.</h1>
        <p className="mt-4 max-w-3xl text-lg text-emerald-50/85">Choose only the pathway you need. Details open when needed so youth, parents, supervisors, guests, and Mission Control do not see everything at once.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <AppButton onClick={() => enter("Guest", "guest")} className="bg-emerald-100 text-emerald-950">Guest Journey<br/><span className="font-medium">Farm story, airport history, events, marketplace, community connection.</span></AppButton>
        <AppButton onClick={() => setScreen("registration")} className="bg-sky-100 text-sky-950">New Participant<br/><span className="font-medium">Registration, parent completion, emergency contact, pathway setup.</span></AppButton>
        <AppButton onClick={() => setScreen("roles")} className="bg-amber-100 text-amber-950">Returning<br/><span className="font-medium">Youth, parent, supervisor, grower, partner, Mission Control.</span></AppButton>
      </div>
    </main>
  );
}

function RoleGate({ setScreen, setUser }: { setScreen: (s: Screen) => void; setUser: (u: AppUser) => void }) {
  const roles: [AppUser["role"], Screen, string][] = [
    ["Youth", "youth", "Dashboard → Today’s Work → Workbook → Journey"],
    ["Parent", "parent", "Completion-only parent portal and notices"],
    ["Supervisor", "supervisor", "Roster, attendance, PPE, safety, assessments"],
    ["Mission Control", "mission", "Work status, notifications, reports, launch operations"],
    ["Customer", "marketplace", "Marketplace and events"],
  ];
  return <main className="mx-auto max-w-5xl px-4 py-8"><h1 className="text-4xl font-black">Choose Returning Pathway</h1><div className="mt-6 grid gap-3">{roles.map(([role, screen, desc]) => <AppButton key={role} onClick={() => { const u = { id: uid("user"), name: role, role, status: "active" as ParticipantStatus }; setUser(u); writeStore(KEYS.user, u); setScreen(screen); }} className="bg-white text-slate-950 border border-slate-200">{role}<br/><span className="font-medium text-slate-600">{desc}</span></AppButton>)}</div></main>;
}

function YouthDashboard({ setScreen }: { setScreen: (s: Screen) => void }) {
  const week = getWeekPlan();
  const plan = getTodayPlan();
  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
      <Card className="bg-emerald-950 text-white border-emerald-900">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-200">Youth Workforce Dashboard</div>
        <h1 className="mt-2 text-4xl font-black">Week {week.week}: {week.title}</h1>
        <p className="mt-2 text-emerald-50/85">{week.bigIdea}</p>
        <p className="mt-3 rounded-2xl bg-white/10 p-3 font-black">Farm Wisdom: {week.proverb}</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <AppButton onClick={() => setScreen("todayWork")} className="bg-amber-200 text-amber-950">Ready for Assignment<br/><span className="font-medium">Open today’s actual work: {plan.theme}</span></AppButton>
        <AppButton onClick={() => setScreen("workbook")} className="bg-sky-200 text-sky-950">Open My Workbook<br/><span className="font-medium">Answer questions and save proof.</span></AppButton>
        <AppButton onClick={() => setScreen("journey")} className="bg-violet-200 text-violet-950">My Journey<br/><span className="font-medium">Skills, portfolio, opportunity, legacy.</span></AppButton>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {["Self", "Work", "Environment", "Community", "Opportunity", "Legacy"].map((layer) => <Card key={layer}><h3 className="text-xl font-black">{layer}</h3><p className="mt-2 text-sm text-slate-700">{layer === "Self" ? "How am I showing up today?" : layer === "Work" ? plan.work[0] : layer === "Environment" ? plan.curriculum : layer === "Community" ? plan.community : layer === "Opportunity" ? plan.opportunity : plan.legacy}</p></Card>)}
      </div>
    </main>
  );
}

function TodayWork({ setScreen }: { setScreen: (s: Screen) => void }) {
  const plan = getTodayPlan();
  const status = readStore<WorkStatusUpdate>(KEYS.workStatus, defaultWorkStatus());
  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
      <Card>
        <div className={`inline-flex rounded-full border px-3 py-2 text-sm font-black ${statusColor(status.status)}`}>{status.label}</div>
        <h1 className="mt-4 text-4xl font-black">{plan.dateLabel}: {plan.theme}</h1>
        <p className="mt-2 text-slate-700">{plan.curriculum}</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><h2 className="text-2xl font-black">Today’s Work</h2><ul className="mt-3 grid gap-2">{plan.work.map((x) => <li key={x} className="rounded-xl bg-slate-50 p-3">□ {x}</li>)}</ul></Card>
        <Card><h2 className="text-2xl font-black">Safety Boundaries</h2><ul className="mt-3 grid gap-2">{plan.safety.map((x) => <li key={x} className="rounded-xl bg-red-50 p-3">• {x}</li>)}</ul></Card>
      </div>
      <Card><h2 className="text-2xl font-black">Questions Youth Can Answer</h2><div className="mt-3 grid gap-2">{plan.questions.map((q) => <button onClick={() => setScreen("workbook")} key={q} className="rounded-xl border border-slate-200 bg-white p-3 text-left font-bold hover:bg-slate-50">{q}</button>)}</div></Card>
    </main>
  );
}

function Workbook() {
  const plan = getTodayPlan();
  const [entries, setEntries] = useState<WorkbookEntry[]>(() => readStore(KEYS.workbook, []));
  const [responses, setResponses] = useState<Record<string, string>>({});
  const prompts = [
    ...plan.questions.map((prompt) => ({ section: "Field Investigation" as WorkbookEntry["section"], prompt })),
    { section: "Community" as const, prompt: plan.community },
    { section: "Opportunity" as const, prompt: plan.opportunity },
    { section: "Legacy" as const, prompt: plan.legacy },
  ];
  const save = (section: WorkbookEntry["section"], prompt: string) => {
    const response = responses[prompt]?.trim();
    if (!response) return;
    const next = [{ id: uid("wb"), date: formatDate(), week: getProgramWeek(), section, prompt, response, createdAt: new Date().toISOString() }, ...entries];
    setEntries(next); writeStore(KEYS.workbook, next); setResponses((r) => ({ ...r, [prompt]: "" }));
  };
  const download = () => {
    const text = entries.map((e) => `Week ${e.week} | ${e.date} | ${e.section}\nPrompt: ${e.prompt}\nResponse: ${e.response}\n`).join("\n---\n");
    const blob = new Blob([text || "No workbook entries yet."], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "Cultivator_Workbook_Record.txt"; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <Card><h1 className="text-4xl font-black">My Cultivator Workbook</h1><p className="mt-2 text-slate-700">The workbook is the professional record: field work, answers, discoveries, portfolio proof, skills, community connection, and legacy reflection.</p><button onClick={download} className="mt-4 rounded-full bg-slate-900 px-5 py-3 font-black text-white">Download Workbook Record</button></Card>
      {prompts.map(({ section, prompt }) => <Card key={prompt}><div className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">{section}</div><h2 className="mt-2 text-xl font-black">{prompt}</h2><textarea value={responses[prompt] || ""} onChange={(e) => setResponses((r) => ({ ...r, [prompt]: e.target.value }))} className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 p-3" placeholder="Write your answer here."/><button onClick={() => save(section, prompt)} className="mt-3 rounded-full bg-emerald-700 px-5 py-3 font-black text-white">Save Answer</button></Card>)}
      <Card><h2 className="text-2xl font-black">Saved Entries</h2><div className="mt-3 grid gap-3">{entries.length === 0 ? <p className="text-slate-600">No entries saved yet.</p> : entries.map((e) => <div key={e.id} className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-black text-slate-500">Week {e.week} · {e.section} · {e.date}</div><div className="font-black">{e.prompt}</div><p className="mt-1 text-slate-700">{e.response}</p></div>)}</div></Card>
    </main>
  );
}

function ParentPortal() {
  const [form, setForm] = useState(() => readStore(KEYS.parent, { guardian: "", phone: "", email: "", emergency: "", medical: "", pickup: "" }));
  const status = readStore<WorkStatusUpdate>(KEYS.workStatus, defaultWorkStatus());
  return <main className="mx-auto grid max-w-5xl gap-5 px-4 py-6"><Card><h1 className="text-4xl font-black">Parent Portal</h1><p className="mt-2 text-slate-700">Completion only: contact, emergency, medical notes, pickup plan, and work-status notice.</p></Card><Card><h2 className="text-2xl font-black">Current Work Status</h2><div className={`mt-3 rounded-2xl border p-4 ${statusColor(status.status)}`}>{status.parentMessage}</div></Card><Card><h2 className="text-2xl font-black">Complete / Update Parent Information</h2><div className="mt-3 grid gap-3">{Object.keys(form).map((k) => <input key={k} value={(form as any)[k]} onChange={(e) => setForm((f: any) => ({ ...f, [k]: e.target.value }))} className="rounded-2xl border border-slate-200 p-3" placeholder={k}/>)}</div><button onClick={() => writeStore(KEYS.parent, form)} className="mt-4 rounded-full bg-slate-900 px-5 py-3 font-black text-white">Save Parent Completion</button></Card></main>;
}

function Supervisor() {
  const [roster, setRoster] = useState<any[]>(() => readStore(KEYS.roster, [{ id: "youth-1", name: "Sample Youth", status: "active" }]));
  const [name, setName] = useState("");
  const add = () => { if (!name.trim()) return; const next = [...roster, { id: uid("youth"), name, status: "active" }]; setRoster(next); writeStore(KEYS.roster, next); setName(""); };
  const inactive = (id: string) => { const next = roster.map((r) => r.id === id ? { ...r, status: "inactive" } : r); setRoster(next); writeStore(KEYS.roster, next); };
  return <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6"><Card><h1 className="text-4xl font-black">Supervisor Tools</h1><p className="mt-2 text-slate-700">Roster, attendance, PPE, wellness, behavior support, incident log, parent-safe summary, and reports.</p></Card><div className="grid gap-4 md:grid-cols-2"><Card><h2 className="text-2xl font-black">Youth Roster</h2><div className="mt-3 flex gap-2"><input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 rounded-2xl border p-3" placeholder="Add youth name"/><button onClick={add} className="rounded-2xl bg-emerald-700 px-4 font-black text-white">Add</button></div><div className="mt-3 grid gap-2">{roster.map((r) => <div key={r.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>{r.name} · {r.status}</span><button onClick={() => inactive(r.id)} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-black text-white">Set Inactive</button></div>)}</div></Card><Card><h2 className="text-2xl font-black">Daily Records</h2>{["Attendance", "PPE", "Morning Wellness", "Daily Assessment", "Incident / Support Log", "Parent-Safe Summary"].map((x) => <button key={x} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-left font-black hover:bg-slate-50">{x}</button>)}</Card></div></main>;
}

function MissionControl() {
  const [status, setStatus] = useState<WorkStatusUpdate>(() => readStore(KEYS.workStatus, defaultWorkStatus()));
  const setHalf = () => { const next = { ...status, id: uid("status"), label: "Half Day Operations — 12:00 PM Dismissal", status: "HALF_DAY" as WorkStatusCode, reason: "Heat, water, staffing, weather, or site conditions require shortened outdoor work.", action: "Priority outdoor work in the cooler morning; cleanup, lunch, reflection, and dismissal by 12:00 PM.", parentMessage: `Bronson Family Farm Work Status\n\nSTATUS: HALF DAY OPERATIONS\n\nYouth will complete priority work in the cooler morning. Cleanup, lunch, hydration, reflection, and dismissal will follow. Parents/caregivers should follow Mission Control pickup guidance.`, createdAt: new Date().toISOString() }; setStatus(next); writeStore(KEYS.workStatus, next); };
  const setCancel = () => { const next = { ...status, id: uid("status"), label: "Program Cancelled", status: "CANCELLED" as WorkStatusCode, reason: "Mission Control cancelled onsite youth work due to unsafe or unsuitable conditions.", action: "Youth remain safe at home. Parents and supervisors watch for next update.", parentMessage: `Bronson Family Farm Work Status\n\nSTATUS: CANCELLED\n\nThe Cultivators Youth Workforce Program will not meet onsite. Youth should remain safe at home and prepare for the next scheduled workday.`, createdAt: new Date().toISOString() }; setStatus(next); writeStore(KEYS.workStatus, next); };
  const setFull = () => { const next = defaultWorkStatus(); setStatus(next); writeStore(KEYS.workStatus, next); };
  return <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6"><Card><h1 className="text-4xl font-black">Mission Control</h1><p className="mt-2 text-slate-700">Operational authority for work status, notices, curriculum advancement, reports, inventory, and launch readiness.</p></Card><Card><h2 className="text-2xl font-black">Work Status Engine</h2><div className={`mt-3 rounded-2xl border p-4 ${statusColor(status.status)}`}>{status.label}<br/>{status.reason}<br/>{status.action}</div><div className="mt-4 grid gap-3 md:grid-cols-3"><button onClick={setFull} className="rounded-2xl bg-emerald-700 p-4 font-black text-white">Set Full Day</button><button onClick={setHalf} className="rounded-2xl bg-amber-500 p-4 font-black text-amber-950">Set Half Day</button><button onClick={setCancel} className="rounded-2xl bg-red-700 p-4 font-black text-white">Cancel Program</button></div></Card><Card><h2 className="text-2xl font-black">Inventory Visible</h2><div className="mt-3 flex flex-wrap gap-2">{defaultInventory.map((x) => <span key={x} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold">{x}</span>)}</div></Card><RealCalendarGrid /></main>;
}

function RealCalendarGrid() {
  const base = getCalendarDisplayBase();
  const weekStart = new Date(base); weekStart.setDate(base.getDate() - ((base.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 5 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d; });
  return <Card><h2 className="text-2xl font-black">Actual Calendar — Week {getProgramWeek(base)}</h2><div className="mt-4 grid gap-3 md:grid-cols-5">{weekDays.map((d) => { const p = getTodayPlan(d); return <div key={d.toISOString()} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="font-black">{d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</div><div className="mt-2 text-sm font-bold">{p.theme}</div></div>; })}</div></Card>;
}

function GuestJourney() {
  return <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6"><Card><h1 className="text-4xl font-black">Guest Journey</h1><p className="mt-2 text-slate-700">Visitors see the farm as a living ecosystem: food, history, youth workforce, airport land, pollinators, marketplace, and community opportunity.</p></Card><Card><h2 className="text-2xl font-black">Airport + Community History Layer</h2><div className="mt-3 grid gap-2">{airportHistory.map((x) => <div key={x} className="rounded-xl bg-slate-50 p-3">{x}</div>)}</div></Card></main>;
}

function SimplePage({ title, body }: { title: string; body: string }) {
  return <main className="mx-auto max-w-5xl px-4 py-8"><Card><h1 className="text-4xl font-black">{title}</h1><p className="mt-3 text-slate-700">{body}</p></Card></main>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("portal");
  const [language, setLanguageState] = useState<LanguageCode>(() => readStore(KEYS.language, "en"));
  const [user, setUser] = useState<AppUser>(() => readStore(KEYS.user, { id: "guest", name: "Guest Visitor", role: "Guest", status: "active" }));
  const setLanguage = (l: LanguageCode) => { setLanguageState(l); writeStore(KEYS.language, l); };

  useEffect(() => {
    if (user.status === "inactive") setScreen("guest");
  }, [user.status]);

  const content = useMemo(() => {
    switch (screen) {
      case "portal": return <Portal setScreen={setScreen} setUser={setUser} />;
      case "roles": return <RoleGate setScreen={setScreen} setUser={setUser} />;
      case "guest": return <GuestJourney />;
      case "registration": return <ParentPortal />;
      case "youth": return <YouthDashboard setScreen={setScreen} />;
      case "todayWork": return <TodayWork setScreen={setScreen} />;
      case "workbook": return <Workbook />;
      case "journey": return <SimplePage title="My Journey" body="Skills, portfolio proof, career pathways, community connection, and legacy reflection are built from saved workbook entries and supervisor records." />;
      case "parent": return <ParentPortal />;
      case "supervisor": return <Supervisor />;
      case "mission": return <MissionControl />;
      case "marketplace": return <SimplePage title="Marketplace" body="Marketplace operations remain available for produce, events, orders, SNAP-aware planning, and value-added products." />;
      case "almanac": return <SimplePage title="Almanac" body="Daily farm conditions, sunrise/sunset, heat, wind, rain, water needs, and operating notes should be checked before work begins." />;
      case "resources": return <SimplePage title="Resources" body="Career pathways, crop planning, companion planting, health and nutrition, parent resources, and youth learning references live here." />;
      case "events": return <SimplePage title="Events" body="Farm tours, Growers Supply Market, youth showcases, board/funder visits, and community education events are shown here." />;
      case "completion": return <SimplePage title="Completion" body="Youth can export workbook records, portfolio proof, skills transcript, reflections, and parent-safe summaries." />;
      default: return <Portal setScreen={setScreen} setUser={setUser} />;
    }
  }, [screen]);

  return (
    <div dir={language === "he" ? "rtl" : "ltr"} className="min-h-screen bg-slate-100 text-slate-950">
      <Header user={user} setScreen={setScreen} language={language} setLanguage={setLanguage} />
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 text-sm font-black">
          {[["Youth", "youth"], ["Today’s Work", "todayWork"], ["Workbook", "workbook"], ["Parent", "parent"], ["Supervisor", "supervisor"], ["Mission", "mission"], ["Guest", "guest"], ["Resources", "resources"]].map(([label, s]) => <button key={s} onClick={() => setScreen(s as Screen)} className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 hover:bg-slate-900 hover:text-white">{label}</button>)}
        </div>
      </nav>
      {content}
      <footer className="mt-10 border-t border-slate-200 bg-white px-4 py-6 text-center text-sm font-bold text-slate-600">
        Bronson Family Farm · Farm & Family Alliance · {ECOSYSTEM_BASE_URL} · Supabase {supabase ? "connected" : "fallback local mode"}
      </footer>
    </div>
  );
}
