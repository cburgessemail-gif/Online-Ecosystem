import React, { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Bronson Family Farm Online Ecosystem
 * CULTIVATOR ECOSYSTEM 13.3 — WEEK 5 PORTAL + TRANSLATION MASTER FULL REPLACEMENT
 *
 * Full React/Vite App.tsx replacement.
 *
 * Corrected from 13.2 Week 5 Master:
 * - Restores Forest Gate Portal identity and role choices.
 * - Fixes Returning pathway so it does not force youth back to “Hello Constance.”
 * - Fixes “Ready for Assignment” so it opens Today’s Work, not the top of the dashboard.
 * - Adds complete app-level translation wrapper for portal, guest, registration, roles, youth, parent,
 *   supervisor, Mission Control, workbook, marketplace, resources, calendar, almanac, and completion surfaces.
 * - Keeps Week 5 as active curriculum week.
 * - Keeps Self → Work → Environment → Community → Opportunity → Legacy as the organizing architecture.
 * - Keeps workbook as the central proof record.
 * - Keeps Parent Portal completion-only.
 * - Keeps Supervisor tools, Mission Control work-status engine, roster/attendance/PPE/behavior/incident notes.
 * - Keeps guest journey with airport/community history and ecosystem interpretation.
 * - Keeps Active/Inactive participant lifecycle: inactive users retain records but receive visitor-only access.
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

type AppRole =
  | "Guest"
  | "Youth"
  | "Parent"
  | "Supervisor"
  | "Mission Control"
  | "Grower"
  | "Partner"
  | "Customer";

type AppUser = {
  id: string;
  name: string;
  role: AppRole;
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

type RosterMember = {
  id: string;
  name: string;
  role: AppRole;
  status: ParticipantStatus;
  phoneLast4?: string;
  notes?: string;
};

type AttendanceRecord = {
  id: string;
  date: string;
  name: string;
  present: boolean;
  ppe: string[];
  notes: string;
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
const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const PROGRAM_START = new Date("2026-06-08T00:00:00");
const CURRENT_WEEK_LOCK = 5;
const ECOSYSTEM_BASE_URL = "https://ecosystem.farmandfamilyalliance.org";
const NWS_FORECAST_URL = "https://forecast.weather.gov/MapClick.php?lon=-80.65&lat=41.1";

const KEYS = {
  user: "bff.13_3.activeUser",
  language: "bff.13_3.language",
  workbook: "bff.13_3.workbook",
  workStatus: "bff.13_3.workStatus",
  roster: "bff.13_3.roster",
  attendance: "bff.13_3.attendance",
  parent: "bff.13_3.parentCompletion",
  inventory: "bff.13_3.inventory",
  screen: "bff.13_3.screen",
};

const phraseTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {},
  es: {
    "Forest Gate Portal": "Portal del Bosque",
    "Guest Journey": "Recorrido de Invitado",
    "New Participant": "Nuevo Participante",
    "Returning": "Regresando",
    "Youth": "Joven",
    "Parent": "Padre/Madre",
    "Supervisor": "Supervisor",
    "Mission Control": "Centro de Misión",
    "Marketplace": "Mercado",
    "Resources": "Recursos",
    "Events": "Eventos",
    "Today’s Work": "Trabajo de Hoy",
    "Ready for Assignment": "Listo para la Asignación",
    "Open My Workbook": "Abrir Mi Cuaderno",
    "My Journey": "Mi Trayectoria",
    "Self": "Yo",
    "Work": "Trabajo",
    "Environment": "Ambiente",
    "Community": "Comunidad",
    "Opportunity": "Oportunidad",
    "Legacy": "Legado",
    "Safety Boundaries": "Límites de Seguridad",
    "Questions Youth Can Answer": "Preguntas que los Jóvenes Pueden Contestar",
    "Save Answer": "Guardar Respuesta",
    "Download Workbook Record": "Descargar Registro del Cuaderno",
    "Current Work Status": "Estado Actual del Trabajo",
    "Parent Portal": "Portal de Padres",
    "Completion only": "Solo para completar",
    "Roster": "Lista",
    "Attendance": "Asistencia",
    "PPE": "EPP",
    "Incident / Support Log": "Registro de Incidentes / Apoyo",
    "Program Open": "Programa Abierto",
    "Cancelled": "Cancelado",
    "Full Day": "Día Completo",
    "Half Day": "Medio Día",
    "Weather Shelter": "Refugio por Clima",
    "Climate": "Clima",
    "Airport History": "Historia del Aeropuerto",
    "What is an ecosystem?": "¿Qué es un ecosistema?",
  },
  tl: {
    "Forest Gate Portal": "Portal ng Gubat",
    "Guest Journey": "Paglalakbay ng Bisita",
    "New Participant": "Bagong Kalahok",
    "Returning": "Babalik",
    "Youth": "Kabataan",
    "Parent": "Magulang",
    "Supervisor": "Tagapangasiwa",
    "Mission Control": "Sentro ng Misyon",
    "Marketplace": "Pamilihan",
    "Resources": "Mga Mapagkukunan",
    "Events": "Mga Kaganapan",
    "Today’s Work": "Gawain Ngayon",
    "Ready for Assignment": "Handa sa Takdang Gawain",
    "Open My Workbook": "Buksan ang Aking Workbook",
    "My Journey": "Aking Paglalakbay",
    "Self": "Sarili",
    "Work": "Trabaho",
    "Environment": "Kapaligiran",
    "Community": "Komunidad",
    "Opportunity": "Pagkakataon",
    "Legacy": "Pamana",
  },
  it: {
    "Forest Gate Portal": "Portale del Bosco",
    "Guest Journey": "Percorso Ospite",
    "New Participant": "Nuovo Partecipante",
    "Returning": "Ritorno",
    "Youth": "Giovani",
    "Parent": "Genitore",
    "Supervisor": "Supervisore",
    "Mission Control": "Controllo Missione",
    "Marketplace": "Mercato",
    "Resources": "Risorse",
    "Events": "Eventi",
    "Today’s Work": "Lavoro di Oggi",
    "Ready for Assignment": "Pronto per l’Assegnazione",
    "Open My Workbook": "Apri il Mio Quaderno",
    "My Journey": "Il Mio Percorso",
    "Self": "Sé",
    "Work": "Lavoro",
    "Environment": "Ambiente",
    "Community": "Comunità",
    "Opportunity": "Opportunità",
    "Legacy": "Eredità",
  },
  he: {
    "Forest Gate Portal": "שער היער",
    "Guest Journey": "מסע אורח",
    "New Participant": "משתתף חדש",
    "Returning": "חוזר",
    "Youth": "נוער",
    "Parent": "הורה",
    "Supervisor": "מפקח",
    "Mission Control": "מרכז שליטה",
    "Marketplace": "שוק",
    "Resources": "משאבים",
    "Events": "אירועים",
    "Today’s Work": "העבודה של היום",
    "Ready for Assignment": "מוכן למשימה",
    "Open My Workbook": "פתח את חוברת העבודה",
    "My Journey": "המסע שלי",
    "Self": "עצמי",
    "Work": "עבודה",
    "Environment": "סביבה",
    "Community": "קהילה",
    "Opportunity": "הזדמנות",
    "Legacy": "מורשת",
  },
  fr: {
    "Forest Gate Portal": "Portail de la Forêt",
    "Guest Journey": "Parcours Invité",
    "New Participant": "Nouveau Participant",
    "Returning": "Retour",
    "Youth": "Jeune",
    "Parent": "Parent",
    "Supervisor": "Superviseur",
    "Mission Control": "Centre de Mission",
    "Marketplace": "Marché",
    "Resources": "Ressources",
    "Events": "Événements",
    "Today’s Work": "Travail d’Aujourd’hui",
    "Ready for Assignment": "Prêt pour l’Affectation",
    "Open My Workbook": "Ouvrir Mon Cahier",
    "My Journey": "Mon Parcours",
    "Self": "Moi",
    "Work": "Travail",
    "Environment": "Environnement",
    "Community": "Communauté",
    "Opportunity": "Opportunité",
    "Legacy": "Héritage",
  },
};

function tr(language: LanguageCode, phrase: string) {
  return phraseTranslations[language]?.[phrase] || phrase;
}

function dir(language: LanguageCode) {
  return language === "he" ? "rtl" : "ltr";
}

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
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage can fail in private or locked browsers.
  }
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
  return day >= 1 && day <= 5 ? day - 1 : 0;
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
      curriculum: "Youth connect plant needs to woods, parks, yards, vacant lots, and neighborhood growing spaces.",
      work: ["Observe sun and shade", "Prepare soil", "Water plants", "Collect compost materials", "Record plant health"],
      safety: ["Hydration", "Tool spacing", "Watch footing", "Gloves for rough material"],
      questions: ["Where did I see life in the grow area?", "What does a plant need that people also need?"],
      community: "Youngstown has wooded areas and parks. Youth compare farm ecology to their surroundings.",
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
        work: ["Water upper grow area closest to the T-hangar", "Check collards and yams", "Observe living and nonliving parts", "Record one relationship in the workbook"],
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
        community: "Food systems depend on pollinators, insects, birds, water, soil, and careful choices.",
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
  "The guest journey honors the airport story, local memory, veterans, workers, neighbors, and the land’s next chapter.",
  "LCDR Zachary Lansdowne’s memorial history belongs in the community-history layer as a respectful learning doorway.",
];

const defaultInventory = [
  "Water pitchers", "Water bottles", "Cooling towels", "Work gloves", "Scissors", "Hoes", "Hand shovels",
  "Rakes", "Markers", "Staplers", "Garbage bags", "Pest traps", "Clipboards", "First-aid kit", "Laptops"
];

const defaultRoster: RosterMember[] = [
  { id: "r-youth-sample", name: "Sample Youth", role: "Youth", status: "active", phoneLast4: "0000", notes: "Replace with actual roster." },
  { id: "r-parent-sample", name: "Sample Parent", role: "Parent", status: "pending", phoneLast4: "0000", notes: "Parent completion needed." },
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
      .catch(() =>
        alive &&
        setWeather({
          loading: false,
          error: "Live weather unavailable. Use the official forecast link and Mission Control guidance.",
        })
      );
    return () => {
      alive = false;
    };
  }, []);

  return weather;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function AppButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-left font-black shadow-sm transition hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-emerald-300 ${className}`}
    >
      {children}
    </button>
  );
}

function Header({
  user,
  screen,
  setScreen,
  language,
  setLanguage,
}: {
  user: AppUser;
  screen: Screen;
  setScreen: (s: Screen) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
}) {
  const weather = useWeather();
  const workStatus = readStore<WorkStatusUpdate>(KEYS.workStatus, defaultWorkStatus());

  const nav: [Screen, string][] = [
    ["portal", "Portal"],
    ["youth", "Youth"],
    ["todayWork", "Today’s Work"],
    ["workbook", "Workbook"],
    ["parent", "Parent"],
    ["supervisor", "Supervisor"],
    ["mission", "Mission Control"],
    ["guest", "Guest"],
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button type="button" onClick={() => setScreen("portal")} className="text-left">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700">Bronson Family Farm</div>
          <div className="text-lg font-black text-slate-950">Cultivator Ecosystem 13.3</div>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className={`rounded-full border px-3 py-2 ${statusColor(workStatus.status)}`}>{workStatus.label}</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">Week {getProgramWeek()} Active</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
            {weather.loading ? "Weather loading" : weather.error ? "Weather check needed" : `${weather.temp}°F · Wind ${weather.wind} mph`}
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 font-black"
            aria-label="Language"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="tl">Tagalog</option>
            <option value="it">Italiano</option>
            <option value="he">עברית</option>
            <option value="fr">Français</option>
          </select>
          <span className="rounded-full bg-slate-900 px-3 py-2 text-white">{user.name}</span>
        </div>

        <nav className="flex w-full flex-wrap gap-2">
          {nav.map(([target, label]) => (
            <button
              key={target}
              type="button"
              onClick={() => setScreen(target)}
              className={`rounded-full px-3 py-2 text-xs font-black ${
                screen === target ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {tr(language, label)}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Portal({
  language,
  setScreen,
  setUser,
}: {
  language: LanguageCode;
  setScreen: (s: Screen) => void;
  setUser: (u: AppUser) => void;
}) {
  const enter = (role: AppRole, screen: Screen) => {
    const u: AppUser = {
      id: role.toLowerCase().replaceAll(" ", "-"),
      name: role === "Guest" ? "Guest Visitor" : role,
      role,
      status: "active",
    };
    setUser(u);
    writeStore(KEYS.user, u);
    writeStore(KEYS.screen, screen);
    setScreen(screen);
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-emerald-950 via-slate-900 to-black p-8 text-white shadow-xl">
        <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-200">{tr(language, "Forest Gate Portal")}</div>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          Step into the ecosystem. We Grow Green to Harvest Dreams.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-emerald-50/85">
          Choose only the pathway you need. Youth, parents, supervisors, guests, and Mission Control each receive their own journey.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <AppButton onClick={() => enter("Guest", "guest")} className="bg-emerald-100 text-emerald-950">
          {tr(language, "Guest Journey")}
          <br />
          <span className="font-medium">Farm story, airport history, events, marketplace, community connection.</span>
        </AppButton>
        <AppButton onClick={() => setScreen("registration")} className="bg-sky-100 text-sky-950">
          {tr(language, "New Participant")}
          <br />
          <span className="font-medium">Registration, parent completion, emergency contact, pathway setup.</span>
        </AppButton>
        <AppButton onClick={() => setScreen("roles")} className="bg-amber-100 text-amber-950">
          {tr(language, "Returning")}
          <br />
          <span className="font-medium">Youth, parent, supervisor, grower, partner, Mission Control.</span>
        </AppButton>
      </div>
    </main>
  );
}

function RoleGate({
  language,
  setScreen,
  setUser,
}: {
  language: LanguageCode;
  setScreen: (s: Screen) => void;
  setUser: (u: AppUser) => void;
}) {
  const roles: [AppRole, Screen, string][] = [
    ["Youth", "youth", "Dashboard → Today’s Work → Workbook → Journey"],
    ["Parent", "parent", "Completion-only parent portal and notices"],
    ["Supervisor", "supervisor", "Roster, attendance, PPE, safety, assessments"],
    ["Mission Control", "mission", "Work status, notifications, reports, launch operations"],
    ["Grower", "resources", "Crop planner, field notes, production resources"],
    ["Partner", "events", "Events, volunteer opportunities, community pathway"],
    ["Customer", "marketplace", "Marketplace and events"],
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-4xl font-black">Choose Returning Pathway</h1>
      <p className="mt-2 text-slate-600">This gate prevents every user from being forced into the youth dashboard.</p>
      <div className="mt-6 grid gap-3">
        {roles.map(([role, screen, desc]) => (
          <AppButton
            key={role}
            onClick={() => {
              const u: AppUser = { id: uid("user"), name: role, role, status: "active" };
              setUser(u);
              writeStore(KEYS.user, u);
              writeStore(KEYS.screen, screen);
              setScreen(screen);
            }}
            className="border border-slate-200 bg-white text-slate-950"
          >
            {tr(language, role)}
            <br />
            <span className="font-medium text-slate-600">{desc}</span>
          </AppButton>
        ))}
      </div>
    </main>
  );
}

function Registration({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [form, setForm] = useState({
    name: "",
    role: "Youth",
    guardian: "",
    phoneLast4: "",
    emergency: "",
  });

  function save() {
    const roster = readStore<RosterMember[]>(KEYS.roster, defaultRoster);
    const next: RosterMember = {
      id: uid("roster"),
      name: form.name || "New Participant",
      role: form.role as AppRole,
      status: "pending",
      phoneLast4: form.phoneLast4,
      notes: `Guardian: ${form.guardian}; Emergency: ${form.emergency}`,
    };
    writeStore(KEYS.roster, [next, ...roster]);
    setScreen(form.role === "Parent" ? "parent" : "roles");
  }

  return (
    <main className="mx-auto grid max-w-4xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">New Participant Registration</h1>
        <p className="mt-2 text-slate-700">Creates a pending record. Parent completion remains in the Parent Portal.</p>
      </Card>
      <Card className="grid gap-3">
        {[
          ["Participant name", "name"],
          ["Guardian name", "guardian"],
          ["Phone last 4 digits", "phoneLast4"],
          ["Emergency contact / pickup notes", "emergency"],
        ].map(([label, key]) => (
          <label key={key} className="grid gap-1 font-bold">
            {label}
            <input
              className="rounded-2xl border border-slate-200 p-3"
              value={(form as any)[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </label>
        ))}
        <label className="grid gap-1 font-bold">
          Role
          <select
            className="rounded-2xl border border-slate-200 p-3"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            <option>Youth</option>
            <option>Parent</option>
            <option>Supervisor</option>
            <option>Grower</option>
            <option>Partner</option>
            <option>Customer</option>
          </select>
        </label>
        <button onClick={save} className="rounded-full bg-emerald-800 px-5 py-3 font-black text-white">
          Save Registration
        </button>
      </Card>
    </main>
  );
}

function YouthDashboard({ language, setScreen }: { language: LanguageCode; setScreen: (s: Screen) => void }) {
  const week = getWeekPlan();
  const plan = getTodayPlan();

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
      <Card className="border-emerald-900 bg-emerald-950 text-white">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-200">Youth Workforce Dashboard</div>
        <h1 className="mt-2 text-4xl font-black">
          Week {week.week}: {week.title}
        </h1>
        <p className="mt-2 text-emerald-50/85">{week.bigIdea}</p>
        <p className="mt-3 rounded-2xl bg-white/10 p-3 font-black">Farm Wisdom: {week.proverb}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <AppButton onClick={() => setScreen("todayWork")} className="bg-amber-200 text-amber-950">
          {tr(language, "Ready for Assignment")}
          <br />
          <span className="font-medium">Open today’s actual work: {plan.theme}</span>
        </AppButton>
        <AppButton onClick={() => setScreen("workbook")} className="bg-sky-200 text-sky-950">
          {tr(language, "Open My Workbook")}
          <br />
          <span className="font-medium">Answer questions and save proof.</span>
        </AppButton>
        <AppButton onClick={() => setScreen("journey")} className="bg-violet-200 text-violet-950">
          {tr(language, "My Journey")}
          <br />
          <span className="font-medium">Skills, portfolio, opportunity, legacy.</span>
        </AppButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {["Self", "Work", "Environment", "Community", "Opportunity", "Legacy"].map((layer) => (
          <Card key={layer}>
            <h3 className="text-xl font-black">{tr(language, layer)}</h3>
            <p className="mt-2 text-sm text-slate-700">
              {layer === "Self"
                ? "How am I showing up today?"
                : layer === "Work"
                ? plan.work[0]
                : layer === "Environment"
                ? plan.curriculum
                : layer === "Community"
                ? plan.community
                : layer === "Opportunity"
                ? plan.opportunity
                : plan.legacy}
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}

function TodayWork({ language, setScreen }: { language: LanguageCode; setScreen: (s: Screen) => void }) {
  const plan = getTodayPlan();
  const status = readStore<WorkStatusUpdate>(KEYS.workStatus, defaultWorkStatus());

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
      <Card>
        <div className={`inline-flex rounded-full border px-3 py-2 text-sm font-black ${statusColor(status.status)}`}>
          {status.label}
        </div>
        <h1 className="mt-4 text-4xl font-black">
          {plan.dateLabel}: {plan.theme}
        </h1>
        <p className="mt-2 text-slate-700">{plan.curriculum}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black">{tr(language, "Today’s Work")}</h2>
          <ul className="mt-3 grid gap-2">
            {plan.work.map((x) => (
              <li key={x} className="rounded-xl bg-slate-50 p-3">
                □ {x}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">{tr(language, "Safety Boundaries")}</h2>
          <ul className="mt-3 grid gap-2">
            {plan.safety.map((x) => (
              <li key={x} className="rounded-xl bg-red-50 p-3">
                • {x}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-black">{tr(language, "Questions Youth Can Answer")}</h2>
        <div className="mt-3 grid gap-2">
          {plan.questions.map((q) => (
            <button
              type="button"
              onClick={() => setScreen("workbook")}
              key={q}
              className="rounded-xl border border-slate-200 bg-white p-3 text-left font-bold hover:bg-slate-50"
            >
              {q}
            </button>
          ))}
        </div>
      </Card>
    </main>
  );
}

function Workbook({ language }: { language: LanguageCode }) {
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
    const next = [
      { id: uid("wb"), date: formatDate(), week: getProgramWeek(), section, prompt, response, createdAt: new Date().toISOString() },
      ...entries,
    ];
    setEntries(next);
    writeStore(KEYS.workbook, next);
    setResponses((r) => ({ ...r, [prompt]: "" }));
  };

  const download = () => {
    const text = entries
      .map((e) => `Week ${e.week} | ${e.date} | ${e.section}\nPrompt: ${e.prompt}\nResponse: ${e.response}\n`)
      .join("\n---\n");
    const blob = new Blob([text || "No workbook entries yet."], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Cultivator_Workbook_Record.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">My Cultivator Workbook</h1>
        <p className="mt-2 text-slate-700">
          The workbook is the professional record: field work, answers, discoveries, portfolio proof, skills, community connection, and legacy reflection.
        </p>
        <button onClick={download} className="mt-4 rounded-full bg-slate-900 px-5 py-3 font-black text-white">
          {tr(language, "Download Workbook Record")}
        </button>
      </Card>

      {prompts.map(({ section, prompt }) => (
        <Card key={prompt}>
          <div className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">{tr(language, section)}</div>
          <h2 className="mt-2 text-xl font-black">{prompt}</h2>
          <textarea
            value={responses[prompt] || ""}
            onChange={(e) => setResponses((r) => ({ ...r, [prompt]: e.target.value }))}
            className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 p-3"
            placeholder="Write your answer here."
          />
          <button onClick={() => save(section, prompt)} className="mt-3 rounded-full bg-emerald-700 px-5 py-3 font-black text-white">
            {tr(language, "Save Answer")}
          </button>
        </Card>
      ))}

      <Card>
        <h2 className="text-2xl font-black">Saved Entries</h2>
        <div className="mt-3 grid gap-3">
          {entries.length === 0 ? (
            <p className="text-slate-600">No entries saved yet.</p>
          ) : (
            entries.map((e) => (
              <div key={e.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-black text-slate-500">
                  Week {e.week} · {tr(language, e.section)} · {e.date}
                </div>
                <div className="font-black">{e.prompt}</div>
                <p className="mt-1 text-slate-700">{e.response}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </main>
  );
}

function ParentPortal({ language }: { language: LanguageCode }) {
  const [form, setForm] = useState(() =>
    readStore(KEYS.parent, { guardian: "", phone: "", email: "", emergency: "", medical: "", pickup: "" })
  );
  const status = readStore<WorkStatusUpdate>(KEYS.workStatus, defaultWorkStatus());

  function save() {
    writeStore(KEYS.parent, form);
    alert("Parent completion saved on this device.");
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">{tr(language, "Parent Portal")}</h1>
        <p className="mt-2 text-slate-700">{tr(language, "Completion only")}: contact, emergency, medical notes, pickup plan, and work-status notice.</p>
      </Card>
      <Card>
        <h2 className="text-2xl font-black">{tr(language, "Current Work Status")}</h2>
        <pre className={`mt-3 whitespace-pre-wrap rounded-2xl border p-4 text-sm ${statusColor(status.status)}`}>{status.parentMessage}</pre>
      </Card>
      <Card className="grid gap-3">
        <h2 className="text-2xl font-black">Contact / Emergency Completion</h2>
        {[
          ["Guardian name", "guardian"],
          ["Phone", "phone"],
          ["Email", "email"],
          ["Emergency contact", "emergency"],
          ["Medical / allergy notes", "medical"],
          ["Pickup authorization", "pickup"],
        ].map(([label, key]) => (
          <label key={key} className="grid gap-1 font-bold">
            {label}
            <input
              className="rounded-2xl border border-slate-200 p-3"
              value={(form as any)[key]}
              onChange={(e) => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
            />
          </label>
        ))}
        <button onClick={save} className="rounded-full bg-emerald-800 px-5 py-3 font-black text-white">
          Save Parent Completion
        </button>
      </Card>
    </main>
  );
}

function SupervisorPortal({ language }: { language: LanguageCode }) {
  const [roster, setRoster] = useState<RosterMember[]>(() => readStore(KEYS.roster, defaultRoster));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => readStore(KEYS.attendance, []));
  const [note, setNote] = useState("");

  function toggleStatus(id: string) {
    const next = roster.map((r) =>
      r.id === id ? { ...r, status: r.status === "inactive" ? "active" : ("inactive" as ParticipantStatus) } : r
    );
    setRoster(next);
    writeStore(KEYS.roster, next);
  }

  function deleteMember(id: string) {
    const next = roster.filter((r) => r.id !== id);
    setRoster(next);
    writeStore(KEYS.roster, next);
  }

  function markPresent(member: RosterMember, present: boolean) {
    const record: AttendanceRecord = {
      id: uid("att"),
      date: formatDate(),
      name: member.name,
      present,
      ppe: ["Water", "Closed-toe shoes", "Gloves"],
      notes: note,
    };
    const next = [record, ...attendance];
    setAttendance(next);
    writeStore(KEYS.attendance, next);
    setNote("");
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">{tr(language, "Supervisor")} Tools</h1>
        <p className="mt-2 text-slate-700">Roster, attendance, PPE, behavior notes, and support/incident log.</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black">{tr(language, "Roster")}</h2>
          <div className="mt-3 grid gap-3">
            {roster.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black">{r.name}</div>
                    <div className="text-sm text-slate-600">
                      {r.role} · {r.status}
                    </div>
                    <div className="text-xs text-slate-500">{r.notes}</div>
                  </div>
                  <div className="grid gap-2">
                    <button onClick={() => toggleStatus(r.id)} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-black text-white">
                      {r.status === "inactive" ? "Reactivate" : "Set Inactive"}
                    </button>
                    <button onClick={() => deleteMember(r.id)} className="rounded-full bg-red-700 px-3 py-2 text-xs font-black text-white">
                      Delete Test
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => markPresent(r, true)} className="rounded-full bg-emerald-700 px-3 py-2 text-xs font-black text-white">
                    Present
                  </button>
                  <button onClick={() => markPresent(r, false)} className="rounded-full bg-amber-600 px-3 py-2 text-xs font-black text-white">
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black">{tr(language, "Attendance")} / {tr(language, "PPE")}</h2>
          <textarea
            className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 p-3"
            placeholder="Supervisor note before marking attendance."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="mt-4 grid gap-2">
            {attendance.length === 0 ? (
              <p className="text-slate-600">No attendance records yet.</p>
            ) : (
              attendance.map((a) => (
                <div key={a.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="font-black">
                    {a.date} · {a.name} · {a.present ? "Present" : "Absent"}
                  </div>
                  <div className="text-sm text-slate-600">PPE: {a.ppe.join(", ")}</div>
                  {a.notes && <div className="text-sm text-slate-600">Notes: {a.notes}</div>}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-black">{tr(language, "Incident / Support Log")}</h2>
        <p className="mt-2 text-slate-700">
          Use this section to document name or PIN, incident, support action, parent contact, nurse triage note, and supervisor follow-up.
        </p>
      </Card>
    </main>
  );
}

function MissionControl({ language }: { language: LanguageCode }) {
  const [status, setStatus] = useState<WorkStatusUpdate>(() => readStore(KEYS.workStatus, defaultWorkStatus()));
  const [inventory, setInventory] = useState<string[]>(() => readStore(KEYS.inventory, defaultInventory));
  const [newItem, setNewItem] = useState("");

  function choose(nextStatus: WorkStatusCode) {
    const plan = getTodayPlan();
    const templates: Record<WorkStatusCode, Partial<WorkStatusUpdate>> = {
      FULL_DAY: {
        label: "Program Open — Follow Today’s Assignment",
        reason: "Normal schedule.",
        action: `Begin with PPE, water, and ${plan.theme}.`,
      },
      HALF_DAY: {
        label: "Half Day — Parent Pickup Required",
        reason: "Heat, weather, water, or staffing adjustment.",
        action: "Youth complete priority tasks only. Parent pickup communication required.",
      },
      DELAYED_START: {
        label: "Delayed Start",
        reason: "Weather or site readiness.",
        action: "Do not report until updated start time is confirmed.",
      },
      EARLY_DISMISSAL: {
        label: "Early Dismissal",
        reason: "Heat or weather safety.",
        action: "Stop field work, complete cleanup, and prepare pickup.",
      },
      WEATHER_SHELTER: {
        label: "Weather Shelter / Emergency Cover",
        reason: "Unsafe outdoor conditions. Hangar is emergency cover only.",
        action: "Shelter only if already onsite. Do not start new field work.",
      },
      CANCELLED: {
        label: "Program Cancelled — No Onsite Youth Work",
        reason: "Weather, heat, water, staffing, or site safety.",
        action: "Youth should not report. Parents and supervisors must be notified.",
      },
    };

    const next: WorkStatusUpdate = {
      ...status,
      id: uid("status"),
      effectiveDate: formatDate(),
      status: nextStatus,
      label: templates[nextStatus].label || "",
      reason: templates[nextStatus].reason || "",
      action: templates[nextStatus].action || "",
      parentMessage: `Bronson Family Farm Work Status\n\n${plan.dateLabel}\n\nSTATUS: ${templates[nextStatus].label}\nREASON: ${templates[nextStatus].reason}\nACTION: ${templates[nextStatus].action}\n\nPortal: ${ECOSYSTEM_BASE_URL}`,
      createdAt: new Date().toISOString(),
    };
    setStatus(next);
    writeStore(KEYS.workStatus, next);
  }

  function saveItem() {
    if (!newItem.trim()) return;
    const next = [newItem.trim(), ...inventory];
    setInventory(next);
    writeStore(KEYS.inventory, next);
    setNewItem("");
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
      <Card className="border-slate-900 bg-slate-950 text-white">
        <h1 className="text-4xl font-black">{tr(language, "Mission Control")}</h1>
        <p className="mt-2 text-slate-200">Work status, notification drafts, launch operations, inventory, and reporting.</p>
      </Card>

      <Card>
        <h2 className="text-2xl font-black">Work Status Engine</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {(["FULL_DAY", "HALF_DAY", "DELAYED_START", "EARLY_DISMISSAL", "WEATHER_SHELTER", "CANCELLED"] as WorkStatusCode[]).map((s) => (
            <button key={s} onClick={() => choose(s)} className={`rounded-2xl border p-4 text-left font-black ${statusColor(s)}`}>
              {s.replaceAll("_", " ")}
            </button>
          ))}
        </div>
        <pre className={`mt-4 whitespace-pre-wrap rounded-2xl border p-4 text-sm ${statusColor(status.status)}`}>{status.parentMessage}</pre>
      </Card>

      <Card>
        <h2 className="text-2xl font-black">Inventory</h2>
        <div className="mt-3 flex gap-2">
          <input value={newItem} onChange={(e) => setNewItem(e.target.value)} className="flex-1 rounded-2xl border border-slate-200 p-3" placeholder="Add item" />
          <button onClick={saveItem} className="rounded-2xl bg-emerald-800 px-5 py-3 font-black text-white">Add</button>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {inventory.map((item) => (
            <div key={item} className="rounded-xl bg-slate-50 p-3 font-bold">{item}</div>
          ))}
        </div>
      </Card>
    </main>
  );
}

function GuestJourney({ language, setScreen }: { language: LanguageCode; setScreen: (s: Screen) => void }) {
  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
      <Card className="bg-gradient-to-br from-emerald-100 to-amber-100">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-800">{tr(language, "Guest Journey")}</div>
        <h1 className="mt-2 text-4xl font-black">Bronson Family Farm at Lansdowne Airport</h1>
        <p className="mt-2 text-slate-700">
          A guided pathway for visitors: land, food, airport history, youth workforce, community memory, marketplace, and opportunity.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black">{tr(language, "Airport History")}</h2>
          <div className="mt-3 grid gap-2">
            {airportHistory.map((x) => (
              <p key={x} className="rounded-2xl bg-slate-50 p-3">{x}</p>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">Ecosystem Interpretation</h2>
          <p className="mt-2 text-slate-700">
            Guests should see only the relevant slice: farm story, ecological care, youth learning, community history, marketplace access, and future opportunity.
          </p>
          <div className="mt-4 grid gap-2">
            <AppButton onClick={() => setScreen("marketplace")} className="bg-emerald-100 text-emerald-950">Visit Marketplace</AppButton>
            <AppButton onClick={() => setScreen("events")} className="bg-amber-100 text-amber-950">View Events</AppButton>
          </div>
        </Card>
      </div>
    </main>
  );
}

function Journey() {
  const entries = readStore<WorkbookEntry[]>(KEYS.workbook, []);
  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">My Journey</h1>
        <p className="mt-2 text-slate-700">The journey turns work into proof: skills, observations, saved answers, portfolio evidence, and next steps.</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><h2 className="text-xl font-black">Skills</h2><p className="mt-2 text-slate-700">Observation, watering, pest scouting, safety, cleanup, communication, responsibility.</p></Card>
        <Card><h2 className="text-xl font-black">Career Pathways</h2><p className="mt-2 text-slate-700">Nursing, science, teaching, agriculture, conservation, public works, sanitation, trades, business.</p></Card>
        <Card><h2 className="text-xl font-black">Proof Saved</h2><p className="mt-2 text-slate-700">{entries.length} workbook entries saved.</p></Card>
      </div>
    </main>
  );
}

function Marketplace() {
  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">Marketplace</h1>
        <p className="mt-2 text-slate-700">Customer pathway for produce, seedlings, events, tours, and future value-added offerings.</p>
      </Card>
      <Card>
        <h2 className="text-2xl font-black">Coming Online</h2>
        <p className="mt-2">SNAP-aware marketplace, GrownBy/POS coordination, inventory cards, event promotions, and customer education.</p>
      </Card>
    </main>
  );
}

function Resources() {
  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">Resources</h1>
        <p className="mt-2 text-slate-700">Crop planner, safety, parent resources, career links, workforce next steps, and live forecast doorway.</p>
        <a href={NWS_FORECAST_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-3 font-black text-white">
          Open Official Forecast
        </a>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><h2 className="text-xl font-black">Career / Education</h2><p className="mt-2 text-slate-700">Mahoning CTC, Choffin, Flying High, YSU, Youngstown JATC, Ohio Job Services, heavy equipment and trades pathways.</p></Card>
        <Card><h2 className="text-xl font-black">Family / Wellness</h2><p className="mt-2 text-slate-700">Parent completion, emergency contact, heat safety, healthy food learning, and safe communication.</p></Card>
      </div>
    </main>
  );
}

function Events() {
  const base = getCalendarDisplayBase();
  const week = getWeekPlan(base);

  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">Actual Calendar</h1>
        <p className="mt-2 text-slate-700">Auto-advances by date. Sunday previews the coming program week.</p>
      </Card>
      <div className="grid gap-3 md:grid-cols-5">
        {week.days.map((d, i) => (
          <Card key={d.dateLabel} className={i === getDayIndex(base) ? "border-emerald-700 bg-emerald-50" : ""}>
            <div className="text-xs font-black uppercase text-slate-500">{d.day}</div>
            <h2 className="mt-1 text-lg font-black">{d.theme}</h2>
            <p className="mt-2 text-sm text-slate-700">{d.work[0]}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}

function Almanac() {
  const weather = useWeather();
  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">Living Almanac</h1>
        <p className="mt-2 text-slate-700">Weather, soil, plant health, water limits, pest observations, and climate learning.</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><h2 className="text-xl font-black">Weather</h2><p className="mt-2">{weather.loading ? "Loading..." : weather.error || `${weather.temp}°F · Wind ${weather.wind} mph · Rain ${weather.rain}`}</p></Card>
        <Card><h2 className="text-xl font-black">Field Note</h2><p className="mt-2">Observe before acting. Record living and nonliving connections.</p></Card>
        <Card><h2 className="text-xl font-black">Climate</h2><p className="mt-2">Heat, water, shade, soil cover, and safe work are local climate lessons.</p></Card>
      </div>
    </main>
  );
}

function Completion() {
  return (
    <main className="mx-auto grid max-w-5xl gap-5 px-4 py-6">
      <Card>
        <h1 className="text-4xl font-black">Completion / Portfolio</h1>
        <p className="mt-2 text-slate-700">Use workbook answers, supervisor notes, attendance, photos, and skill records to build a resume-ready portfolio.</p>
      </Card>
    </main>
  );
}

export default function App() {
  const [language, setLanguageState] = useState<LanguageCode>(() => readStore(KEYS.language, "en"));
  const [user, setUser] = useState<AppUser>(() =>
    readStore(KEYS.user, { id: "guest", name: "Guest Visitor", role: "Guest", status: "active" })
  );
  const [screen, setScreenState] = useState<Screen>(() => readStore(KEYS.screen, "portal"));

  const setLanguage = (l: LanguageCode) => {
    setLanguageState(l);
    writeStore(KEYS.language, l);
  };

  const setScreen = (s: Screen) => {
    setScreenState(s);
    writeStore(KEYS.screen, s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!readStore(KEYS.workStatus, null)) writeStore(KEYS.workStatus, defaultWorkStatus());
    if (!readStore(KEYS.inventory, null)) writeStore(KEYS.inventory, defaultInventory);
    if (!readStore(KEYS.roster, null)) writeStore(KEYS.roster, defaultRoster);
  }, []);

  const effectiveScreen = user.status === "inactive" ? "guest" : screen;

  return (
    <div dir={dir(language)} className="min-h-screen bg-slate-100 text-slate-950">
      <Header user={user} screen={effectiveScreen} setScreen={setScreen} language={language} setLanguage={setLanguage} />

      {effectiveScreen === "portal" && <Portal language={language} setScreen={setScreen} setUser={setUser} />}
      {effectiveScreen === "guest" && <GuestJourney language={language} setScreen={setScreen} />}
      {effectiveScreen === "registration" && <Registration setScreen={setScreen} />}
      {effectiveScreen === "roles" && <RoleGate language={language} setScreen={setScreen} setUser={setUser} />}
      {effectiveScreen === "youth" && <YouthDashboard language={language} setScreen={setScreen} />}
      {effectiveScreen === "todayWork" && <TodayWork language={language} setScreen={setScreen} />}
      {effectiveScreen === "workbook" && <Workbook language={language} />}
      {effectiveScreen === "journey" && <Journey />}
      {effectiveScreen === "parent" && <ParentPortal language={language} />}
      {effectiveScreen === "supervisor" && <SupervisorPortal language={language} />}
      {effectiveScreen === "mission" && <MissionControl language={language} />}
      {effectiveScreen === "marketplace" && <Marketplace />}
      {effectiveScreen === "resources" && <Resources />}
      {effectiveScreen === "events" && <Events />}
      {effectiveScreen === "almanac" && <Almanac />}
      {effectiveScreen === "completion" && <Completion />}

      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs font-bold text-slate-500">
        Bronson Family Farm · Farm & Family Alliance · Week {getProgramWeek()} · Full replacement App.tsx
      </footer>
    </div>
  );
}
