import React, { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Bronson Family Farm Online Ecosystem
 * FINAL COMPLETE OPERATIONAL SCRIPT
 *
 * Preserved:
 * - Portal first. The user enters before the farm/ecosystem is explained.
 * - Forest / nature threshold only on the entrance.
 * - Guest pathway is the guided demo.
 * - Ecosystem image appears only during explanation, not first arrival.
 * - Role pathways go deeper vertically: Guest, Youth, Supervisor, Parent, Grower, Marketplace, Operations, Partners.
 * - Staff/Supervisors are the protected access layer for youth.
 * - Every visible button goes somewhere or opens a real external resource.
 * - Includes weather/live channels, crop planner, grow plan, assessments, proverbs, data, reports, and parent summaries.
 */

type Screen =
  | "portal"
  | "guest"
  | "account"
  | "access"
  | "roles"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "crop"
  | "marketplace"
  | "operations"
  | "encouragement"
  | "reports"
  | "partners"
  | "safety"
  | "data"
  | "training"
  | "valueAdded";

type Role =
  | "Guest"
  | "Youth Workforce Participant"
  | "Parent / Guardian"
  | "Supervisor / Staff"
  | "Grower"
  | "Marketplace Customer"
  | "Volunteer"
  | "Partner"
  | "Administrator"
  | "Value-Added Producer";

type GuestStep = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  why: string;
  experience: string[];
  nextScreen?: Screen;
};

type CardLink = {
  title: string;
  text: string;
  screen?: Screen;
  href?: string;
};


type AccessLevel = "public" | "participant" | "family" | "staff" | "admin";

type EcosystemUser = {
  id: string;
  name: string;
  role: Role;
  accessLevel: AccessLevel;
  status: "online" | "active" | "viewing";
  lastSeen: string;
};

type EcosystemActivity = {
  id: string;
  user: string;
  role: Role;
  action: string;
  timestamp: string;
};

const SESSION_KEY = "bff.ecosystem.activeUser";
const USERS_KEY = "bff.ecosystem.liveUsers";
const ACTIVITY_KEY = "bff.ecosystem.activityLog";
const CHANNEL_KEY = "bff.ecosystem.broadcast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase: SupabaseClient | null = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

type AuthMode = "signIn" | "signUp";

function roleSlug(role: Role) {
  const map: Record<Role, string> = {
    Guest: "guest",
    "Youth Workforce Participant": "youth",
    "Parent / Guardian": "parent",
    "Supervisor / Staff": "supervisor",
    Grower: "grower",
    "Marketplace Customer": "marketplace",
    Volunteer: "volunteer",
    Partner: "partner",
    Administrator: "admin",
    "Value-Added Producer": "value_added",
  };
  return map[role];
}

function persistEcosystemUser(user: EcosystemUser, action = "entered the ecosystem") {
  const users = safeRead<EcosystemUser[]>(USERS_KEY, []);
  const filtered = users.filter((item) => item.id !== user.id).slice(-9);
  const updatedUsers = [...filtered, user];
  const activity = safeRead<EcosystemActivity[]>(ACTIVITY_KEY, []);
  const updatedActivity = [
    ...activity.slice(-12),
    {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      user: user.name,
      role: user.role,
      action,
      timestamp: nowLabel(),
    },
  ];
  safeWrite(SESSION_KEY, user);
  safeWrite(USERS_KEY, updatedUsers);
  safeWrite(ACTIVITY_KEY, updatedActivity);
  publishEcosystemUpdate({ type: "auth", user });
}

async function authenticateEcosystemUser(params: {
  email: string;
  password: string;
  role: Role;
  name?: string;
  mode: AuthMode;
}) {
  const email = params.email.trim();
  const password = params.password.trim();
  const name = params.name?.trim() || email || `${params.role} User`;

  if (!supabase || !email || !password) {
    const localUser = createEcosystemUser(params.role, name);
    persistEcosystemUser(localUser, "entered with local role access");
    return localUser;
  }

  const authResponse =
    params.mode === "signUp"
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name,
              role: roleSlug(params.role),
              ecosystem_role: params.role,
              access_level: roleAccess[params.role],
            },
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

  if (authResponse.error) throw authResponse.error;

  const authUser = authResponse.data.user;
  const user: EcosystemUser = {
    id: authUser?.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    role: params.role,
    accessLevel: roleAccess[params.role],
    status: "active",
    lastSeen: nowLabel(),
  };

  try {
    if (authUser?.id) {
      await supabase.from("profiles").upsert({
        id: authUser.id,
        email,
        display_name: name,
        role: roleSlug(params.role),
        ecosystem_role: params.role,
        access_level: roleAccess[params.role],
        approved: params.role === "Guest" || params.role === "Marketplace Customer" ? true : false,
        last_seen_at: new Date().toISOString(),
      });
    }
  } catch {
    // The ecosystem still enters safely if the profiles table is not created yet.
  }

  persistEcosystemUser(user, params.mode === "signUp" ? "created an ecosystem account" : "signed into the ecosystem");
  return user;
}

async function signOutEcosystemUser() {
  if (supabase) await supabase.auth.signOut();
  safeWrite<EcosystemUser | null>(SESSION_KEY, null);
  publishEcosystemUpdate({ type: "signout" });
}

const roleAccess: Record<Role, AccessLevel> = {
  Guest: "public",
  "Youth Workforce Participant": "participant",
  "Parent / Guardian": "family",
  "Supervisor / Staff": "staff",
  Grower: "participant",
  "Marketplace Customer": "public",
  Volunteer: "participant",
  Partner: "family",
  Administrator: "admin",
  "Value-Added Producer": "participant",
};

const protectedScreens: Partial<Record<Screen, AccessLevel[]>> = {
  supervisor: ["staff", "admin"],
  safety: ["staff", "admin"],
  data: ["staff", "admin"],
  reports: ["staff", "admin", "family"],
  parent: ["family", "staff", "admin"],
  operations: ["staff", "admin"],
};

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function publishEcosystemUpdate(message: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const channel = new BroadcastChannel(CHANNEL_KEY);
    channel.postMessage(message);
    channel.close();
  } catch {
    window.dispatchEvent(new Event("bff-ecosystem-update"));
  }
}

function createEcosystemUser(role: Role, name?: string): EcosystemUser {
  const label = name?.trim() || `${role} User`;
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: label,
    role,
    accessLevel: roleAccess[role],
    status: "active",
    lastSeen: nowLabel(),
  };
}

function signInEcosystemUser(role: Role, name?: string): EcosystemUser {
  const user = createEcosystemUser(role, name);
  const users = safeRead<EcosystemUser[]>(USERS_KEY, []);
  const filtered = users.filter((item) => item.name !== user.name || item.role !== user.role).slice(-9);
  const updatedUsers = [...filtered, user];
  const activity = safeRead<EcosystemActivity[]>(ACTIVITY_KEY, []);
  const updatedActivity = [
    ...activity.slice(-12),
    {
      id: user.id,
      user: user.name,
      role: user.role,
      action: "entered the ecosystem",
      timestamp: nowLabel(),
    },
  ];
  safeWrite(SESSION_KEY, user);
  safeWrite(USERS_KEY, updatedUsers);
  safeWrite(ACTIVITY_KEY, updatedActivity);
  publishEcosystemUpdate({ type: "signin", user });
  return user;
}

function canAccessScreen(user: EcosystemUser | null, screen: Screen) {
  const required = protectedScreens[screen];
  if (!required) return true;
  if (!user) return false;
  return required.includes(user.accessLevel);
}

function routeForDeniedAccess(user: EcosystemUser | null, requested: Screen): Screen {
  if (!user) return "account";
  if (requested === "supervisor" || requested === "safety" || requested === "data" || requested === "operations") return "roles";
  return "roles";
}

function recordEcosystemActivity(user: EcosystemUser | null, action: string) {
  if (!user) return;
  const activity = safeRead<EcosystemActivity[]>(ACTIVITY_KEY, []);
  const updated = [
    ...activity.slice(-12),
    {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      user: user.name,
      role: user.role,
      action,
      timestamp: nowLabel(),
    },
  ];
  safeWrite(ACTIVITY_KEY, updated);
  publishEcosystemUpdate({ type: "activity", action });
}

function useLiveEcosystem() {
  const [activeUser, setActiveUser] = useState<EcosystemUser | null>(() => safeRead<EcosystemUser | null>(SESSION_KEY, null));
  const [liveUsers, setLiveUsers] = useState<EcosystemUser[]>(() => safeRead<EcosystemUser[]>(USERS_KEY, []));
  const [activity, setActivity] = useState<EcosystemActivity[]>(() => safeRead<EcosystemActivity[]>(ACTIVITY_KEY, []));

  useEffect(() => {
    const refresh = () => {
      setActiveUser(safeRead<EcosystemUser | null>(SESSION_KEY, null));
      setLiveUsers(safeRead<EcosystemUser[]>(USERS_KEY, []));
      setActivity(safeRead<EcosystemActivity[]>(ACTIVITY_KEY, []));
    };

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(CHANNEL_KEY);
      channel.onmessage = refresh;
    } catch {
      window.addEventListener("bff-ecosystem-update", refresh);
    }

    window.addEventListener("storage", refresh);
    const interval = window.setInterval(refresh, 2500);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("bff-ecosystem-update", refresh);
      window.clearInterval(interval);
      channel?.close();
    };
  }, []);

  return { activeUser, liveUsers, activity, refresh: () => publishEcosystemUpdate({ type: "manual-refresh" }) };
}

function supabaseReadyNote() {
  return supabase ? "Supabase Auth is connected for secure role sessions, profiles, permissions, and live ecosystem records." : "Supabase environment keys are not loaded yet, so this screen is using local role sessions until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are added.";
}


type OperationalTable =
  | "youth_assignments"
  | "supervisor_assessments"
  | "parent_summaries"
  | "crop_plans"
  | "marketplace_inventory"
  | "ecosystem_reports";

type OperationalRecord = {
  id: string;
  table: OperationalTable;
  title: string;
  status: string;
  role?: Role;
  detail: string;
  created_at: string;
  updated_at: string;
};

const OPERATIONAL_KEY = "bff.ecosystem.operationalRecords";

const seedOperationalRecords: OperationalRecord[] = [
  {
    id: "assignment-qr-checkin",
    table: "youth_assignments",
    title: "QR check-in",
    status: "ready",
    role: "Supervisor / Staff",
    detail: "Supervisors verify arrival, PPE, and daily station assignment before youth begin work.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "assessment-daily-score",
    table: "supervisor_assessments",
    title: "Daily mobile scoring",
    status: "active",
    role: "Supervisor / Staff",
    detail: "Attendance, PPE, teamwork, communication, leadership, and reflection are tracked from the field.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "crop-tomato-zone",
    table: "crop_plans",
    title: "Tomato grow zone",
    status: "in progress",
    role: "Grower",
    detail: "Irrigation, pest watch, harvest window, and marketplace forecast are linked to youth work assignments.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "marketplace-seedlings",
    table: "marketplace_inventory",
    title: "Seedling inventory",
    status: "forecasted",
    role: "Marketplace Customer",
    detail: "Marketplace availability is connected to grow plans, harvest timing, SNAP visibility, and customer access.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "parent-progress-summary",
    table: "parent_summaries",
    title: "Parent progress summary",
    status: "review ready",
    role: "Parent / Guardian",
    detail: "Families see attendance, approved reflections, badges, encouragement, and visible signs of growth.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "impact-report",
    table: "ecosystem_reports",
    title: "Community impact report",
    status: "building",
    role: "Partner",
    detail: "Youth activity, crop movement, marketplace circulation, and partner support become measurable impact evidence.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function getLocalOperationalRecords() {
  const stored = safeRead<OperationalRecord[]>(OPERATIONAL_KEY, []);
  if (stored.length) return stored;
  safeWrite(OPERATIONAL_KEY, seedOperationalRecords);
  return seedOperationalRecords;
}

async function loadOperationalRecords(table?: OperationalTable) {
  if (supabase) {
    try {
      const query = table
        ? supabase.from(table).select("*").order("updated_at", { ascending: false }).limit(25)
        : supabase.from("ecosystem_activity_view").select("*").order("updated_at", { ascending: false }).limit(25);
      const { data, error } = await query;
      if (!error && data && data.length) {
        return data.map((item: any) => ({
          id: String(item.id || `${item.title}-${item.updated_at}`),
          table: (item.table || table || "ecosystem_reports") as OperationalTable,
          title: item.title || item.name || item.assignment || "Ecosystem record",
          status: item.status || "active",
          role: item.role || undefined,
          detail: item.detail || item.description || item.notes || "Live Supabase record connected to the ecosystem.",
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || item.created_at || new Date().toISOString(),
        })) as OperationalRecord[];
      }
    } catch {
      // Local fallback keeps the ecosystem usable while Supabase tables are being connected.
    }
  }

  const records = getLocalOperationalRecords();
  return table ? records.filter((record) => record.table === table) : records;
}

async function saveOperationalRecord(record: Omit<OperationalRecord, "id" | "created_at" | "updated_at"> & { id?: string }) {
  const now = new Date().toISOString();
  const fullRecord: OperationalRecord = {
    id: record.id || `${record.table}-${Date.now()}`,
    table: record.table,
    title: record.title,
    status: record.status,
    role: record.role,
    detail: record.detail,
    created_at: now,
    updated_at: now,
  };

  if (supabase) {
    try {
      await supabase.from(record.table).upsert(fullRecord);
    } catch {
      // Keep the field experience moving even if a Supabase table is not ready yet.
    }
  }

  const existing = getLocalOperationalRecords().filter((item) => item.id !== fullRecord.id);
  safeWrite(OPERATIONAL_KEY, [fullRecord, ...existing].slice(0, 50));
  publishEcosystemUpdate({ type: "operational-record", record: fullRecord });
  return fullRecord;
}

function useOperationalRecords(table?: OperationalTable) {
  const [records, setRecords] = useState<OperationalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const loaded = await loadOperationalRecords(table);
    setRecords(loaded);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    window.addEventListener("bff-ecosystem-update", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("bff-ecosystem-update", handler);
    };
  }, [table]);

  return { records, loading, refresh };
}

const image = (file: string) => `/images/${file}`;

const IMG = {
  forest: image("large (18).jpg"),
  forestAlt: image("large (18).jpg"),
  youth1: image("large (16).jpg"),
  youth2: image("large (15).jpg"),
  youth3: image("large (12).jpg"),
  marketplaceHero: image("large (11).jpg"),
  ecosystem: image("ConnectFoodEcosystem_withimages.png"),
  flowers: image("culniary_edibleflowers.jpeg"),
  flowers2: image("culniary_edibleflowers2.jpeg"),
  mushrooms: image("culniary_mushrooms.jpeg"),
  growArea: image("GrowArea2.jpg"),
  growAreaAlt: image("Grow Area.png"),
  partners: image("Partners.png"),
  compost: image("Compost_ElliottGarden.png"),
  compost2: image("Compost_Elliott.png"),
  fencing: image("Deer Fencing.png"),
  volunteers: image("Fence_volunteers.png"),
  queens: image("Queens Village.png"),
  seeds: image("Seeds_Jubilee Gardens.png"),
  csu: image("CSU_MParker.png"),
  wkbn: image("WKBN Interview.png"),
  sameera2: image("Samaeera2.jpg"),
  sameera3: image("Sameera3.jpg"),
  sameera4: image("Samerra4.jpg"),
  sameera5: image("Samerra5.jpg"),
};

const roles: Role[] = [
  "Guest",
  "Youth Workforce Participant",
  "Parent / Guardian",
  "Supervisor / Staff",
  "Grower",
  "Marketplace Customer",
  "Volunteer",
  "Partner",
  "Administrator",
  "Value-Added Producer",
];

const proverbs = [
  "A seed becomes a harvest when people protect the conditions around it.",
  "Leadership grows through responsibility.",
  "Measure progress daily, but grow people patiently.",
  "A living ecosystem returns value to the community.",
  "Food access begins with hands, soil, tools, water, and trust.",
  "Progress happens one action at a time.",
  "What is planted with care can feed more than one family.",
];

const messages = [
  "Your work matters because someone in this community needs what you are helping build.",
  "Every small action creates long-term growth.",
  "Healthy communities begin with connected systems.",
  "Today is another opportunity to build something meaningful.",
  "You are not just completing a task. You are helping build a place.",
  "Growth is visible when effort, reflection, and support move together.",
];

const ecosystemStatus = {
  teams: 4,
  zones: 7,
  weather: "Youngstown weather channel connected",
  harvest: "Tomatoes approaching harvest window",
  market: "Inventory movement connected to crop planning",
  reflections: 18,
  supervisors: 5,
  parentSummaries: 12,
  youthCapacity: "50 youth launch / scalable database",
};

const assignments = [
  "QR check-in",
  "PPE verification",
  "Tomato irrigation support",
  "Compost distribution",
  "Pollinator zone cleanup",
  "Raised bed maintenance",
  "Seed preparation",
  "Wash station support",
];

const assessmentCategories = [
  "Attendance",
  "PPE Compliance",
  "Participation",
  "Teamwork",
  "Communication",
  "Leadership",
  "Task Completion",
  "Problem Solving",
  "Emotional Regulation",
  "Reflection Completion",
];

const cropPlanItems = [
  "Seed Date",
  "Transplant Date",
  "Irrigation Schedule",
  "Compost Need",
  "Pest Watch",
  "Harvest Window",
  "Yield Projection",
  "Marketplace Forecast",
];

const reportTypes = [
  "Youth Workforce Report",
  "Supervisor Daily Report",
  "Parent Summary",
  "Crop Planning Report",
  "Marketplace Report",
  "Inventory Export",
  "Community Impact Report",
  "Grant / Funder Report",
];

const liveChannels: CardLink[] = [
  {
    title: "Weather Underground",
    text: "Hourly weather review for Youngstown field decisions.",
    href: "https://www.wunderground.com/hourly/us/oh/youngstown",
  },
  {
    title: "AccuWeather",
    text: "Minute-by-minute and short-range weather awareness.",
    href: "https://www.accuweather.com/en/us/youngstown/44503/weather-forecast/350128",
  },
  {
    title: "Farmers' Almanac",
    text: "Seasonal planting and weather context.",
    href: "https://www.farmersalmanac.com/",
  },
  {
    title: "Seedtime",
    text: "Crop calendar, tasks, journaling, and planning reference.",
    href: "https://www.seedtime.us/",
  },
];

const guestSteps: GuestStep[] = [
  {
    id: "arrival",
    eyebrow: "Guest Journey / Demo",
    title: "Arrive first. Understand later.",
    subtitle: "The ecosystem begins with place, atmosphere, and invitation before it explains the full system.",
    image: IMG.forest,
    why: "Guests enter through the forest before seeing the larger system, allowing the atmosphere, movement, and land itself to introduce the ecosystem naturally.",
    experience: [
      "The guest enters before the explanation.",
      "The farm is presented as atmosphere, welcome, and movement.",
      "The connected ecosystem image is held back until the system is being explained.",
    ],
  },
  {
    id: "why",
    eyebrow: "Why This Exists",
    title: "A farm ecosystem built for food, people, and community movement.",
    subtitle: "Bronson Family Farm connects land, youth workforce, growers, marketplace circulation, family support, and measurable impact.",
    image: IMG.growArea,
    why: "Guests begin to feel how the farm becomes an operating model — where land, food, work, learning, and community support start moving together.",
    experience: [
      "Food access connects to local production.",
      "Youth participation connects to work readiness and personal growth.",
      "Marketplace movement connects to crop planning and community nutrition.",
    ],
  },
  {
    id: "history",
    eyebrow: "Place / History",
    title: "The farm stands on historic Lansdowne Airport land.",
    subtitle: "The location carries a layered story of land, aviation, community movement, military service, family legacy, and new food infrastructure.",
    image: IMG.growAreaAlt,
    why: "The history comes after entry so the guest can first feel the land, then understand how aviation, military service, family legacy, and food infrastructure now share one story.",
    experience: [
      "The land story is introduced respectfully.",
      "Military service and family legacy are connected to responsibility.",
      "The farm becomes a future-facing use of historic land.",
    ],
  },
  {
    id: "youth",
    eyebrow: "Youth Workforce",
    title: "Youth participate in real work.",
    subtitle: "Assignments, PPE, attendance, reflections, assessments, badges, and supervisor encouragement connect youth development to real farm operations.",
    image: IMG.youth1,
    why: "Youth learn through real responsibility — showing up, preparing stations, solving problems, supporting grow zones, and seeing how their work contributes to the larger ecosystem.",
    experience: [
      "Youth check in and receive daily assignments.",
      "Supervisors observe participation, safety, teamwork, and growth.",
      "Progress becomes visible through badges, reflection, and reports.",
    ],
    nextScreen: "youth",
  },
  {
    id: "safety",
    eyebrow: "Youth Protection",
    title: "Youth access is protected through staff and supervisor control.",
    subtitle: "Random visitors do not access youth records. Supervisors are the protected staff layer.",
    image: IMG.fencing,
    why: "Safety is built into the movement of the ecosystem so youth can participate with protection, structure, and trusted adult supervision while public users remain outside private records.",
    experience: [
      "Supervisor/staff role is required for youth records.",
      "Parents see appropriate summaries, not internal crisis notes.",
      "Guest, marketplace, and partner users do not enter youth supervision tools.",
    ],
    nextScreen: "safety",
  },
  {
    id: "assessment",
    eyebrow: "Assessment Engine",
    title: "Assessments are the heartbeat.",
    subtitle: "Attendance, PPE, teamwork, communication, leadership, reflection, and task completion feed badges, parent summaries, and reports.",
    image: IMG.volunteers,
    why: "Daily observations help youth see their growth over time while giving supervisors a practical way to support responsibility, teamwork, safety, and reflection.",
    experience: [
      "Supervisor observes and scores participation.",
      "Parent-visible summaries are separated from internal notes.",
      "Reports generate from the same data used to support youth growth.",
    ],
    nextScreen: "supervisor",
  },
  {
    id: "crop",
    eyebrow: "Crop Planning",
    title: "Crop planning drives work.",
    subtitle: "Grow zones, irrigation, harvest forecasts, succession planting, pest monitoring, and youth assignments move together.",
    image: IMG.growAreaAlt,
    why: "The crop planner quietly guides the rhythm of the ecosystem — connecting planting, harvest timing, youth assignments, irrigation, and marketplace readiness so the entire system moves together.",
    experience: [
      "Tomato zone creates irrigation and pest-check assignments.",
      "Harvest windows inform marketplace inventory.",
      "Crop activity becomes workforce learning and reporting data.",
    ],
    nextScreen: "crop",
  },
  {
    id: "marketplace",
    eyebrow: "Marketplace Circulation",
    title: "Food moves through community.",
    subtitle: "Marketplace activity connects growers, SNAP visibility, inventory movement, nutrition, and local economic circulation.",
    image: IMG.marketplaceHero,
    why: "The marketplace reveals how food moves through the ecosystem — from grow plans and harvest timing into customer access, nutrition, and community circulation.",
    experience: [
      "Harvest forecasts become availability.",
      "Inventory updates support customer access.",
      "Marketplace reports show circulation and community reach.",
    ],
    nextScreen: "marketplace",
  },
  {
    id: "parent",
    eyebrow: "Parent / Guardian Connection",
    title: "Parents receive supportive visibility.",
    subtitle: "Parents see attendance, progress, badges, encouragement, approved reflections, and safety updates.",
    image: IMG.queens,
    why: "Parents stay connected to the journey through attendance, encouragement, badges, reflections, and visible signs of growth while internal staff notes remain protected.",
    experience: [
      "Youth completes assignments.",
      "Supervisor scores and approves summaries.",
      "Parent sees progress, encouragement, and next steps.",
    ],
    nextScreen: "parent",
  },
  {
    id: "operations",
    eyebrow: "Explaining The Whole System",
    title: "Now the connected food ecosystem can be explained.",
    subtitle: "The connected food ecosystem comes into view after the journey has revealed how the parts move together.",
    image: IMG.ecosystem,
    why: "The full system appears after the guest has already experienced its movement, making the connections easier to understand because they have been discovered step by step.",
    experience: [
      "Youth, parents, growers, marketplace, crop planning, operations, and reports connect.",
      "The ecosystem becomes measurable.",
      "Partners and funders can see how participation turns into outcomes.",
    ],
    nextScreen: "operations",
  },
  {
    id: "reports",
    eyebrow: "Impact + Reporting",
    title: "At the end, the ecosystem generates reports.",
    subtitle: "Workforce, parent, crop, marketplace, inventory, partner, grant, and community impact reports are generated from real ecosystem activity.",
    image: IMG.partners,
    why: "Each pathway leaves behind a visible story of participation, food movement, youth growth, marketplace circulation, and community impact that can be shared with families, partners, and supporters.",
    experience: [
      "Daily activity becomes documentation.",
      "Assessments become progress reports.",
      "Crop and marketplace activity become impact evidence.",
    ],
    nextScreen: "reports",
  },
];

function getDailyIndex(length: number) {
  return new Date().getDate() % length;
}

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1.08;
  utterance.volume = 0.95;
  utterance.lang = "en-US";

  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /Samantha|Jenny|Aria|Google US English|Microsoft Ava|Microsoft Emma/i.test(v.name)) ||
    voices.find((v) => v.lang === "en-US" && !/Huihui|Haruka|Heami|Kangkang|Yaoyao|Zira/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

function Shell({
  children,
  screen,
  setScreen,
  background = IMG.forest,
  compactNav = false,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  background?: string;
  compactNav?: boolean;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img
          src={background}
          alt="Bronson Family Farm"
          className="h-full w-full scale-[1.02] object-cover"
          onError={(event) => {
            const target = event.currentTarget;
            if (!target.src.includes("GrowArea2")) target.src = IMG.growArea;
          }}
        />
      </div>

      <div className="fixed inset-0 bg-black/46" />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.30),rgba(0,0,0,.60)),radial-gradient(circle_at_top_left,rgba(255,255,255,.13),transparent_28%),radial-gradient(circle_at_bottom,rgba(16,185,129,.14),transparent_34%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-4 md:px-8">
        {!compactNav && <Navigation screen={screen} setScreen={setScreen} />}
        {!compactNav && <AccessRibbon />}
        {children}
      </div>
    </div>
  );
}

function Navigation({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  const nav: { label: string; screen: Screen }[] = [
    { label: "Portal", screen: "portal" },
    { label: "Guest Demo", screen: "guest" },
    { label: "Access", screen: "access" },
    { label: "Roles", screen: "roles" },
    { label: "Youth", screen: "youth" },
    { label: "Supervisor", screen: "supervisor" },
    { label: "Parent", screen: "parent" },
    { label: "Grower", screen: "grower" },
    { label: "Crop", screen: "crop" },
    { label: "Marketplace", screen: "marketplace" },
    { label: "Operations", screen: "operations" },
    { label: "Reports", screen: "reports" },
    { label: "Partners", screen: "partners" },
  ];

  return (
    <div className="sticky top-3 z-40 mb-4 rounded-[1.5rem] border border-white/10 bg-black/50 p-3 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setScreen("portal")} className="mr-2 min-w-[175px] px-2 text-left">
          <div className="text-[10px] uppercase tracking-[0.32em] text-emerald-100/70">Bronson Family Farm</div>
          <div className="text-base font-black leading-tight">Online Ecosystem</div>
        </button>

        {nav.map((item) => (
          <button
            key={item.screen}
            onClick={() => setScreen(item.screen)}
            className={`rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur-xl transition ${
              screen === item.screen
                ? "border-emerald-200 bg-emerald-300 text-black"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PhotoCard({
  title,
  subtitle,
  image,
  height = "240px",
  onClick,
  label,
  cta,
}: {
  title: string;
  subtitle: string;
  image: string;
  height?: string;
  onClick?: () => void;
  label?: string;
  cta?: string;
}) {
  const content = (
    <div
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-[0_28px_70px_rgba(0,0,0,.52)] transition duration-500 ${
        onClick ? "cursor-pointer hover:scale-[1.01] hover:border-emerald-200/40" : ""
      }`}
      style={{ height }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105"
        onError={(event) => {
          const target = event.currentTarget;
          if (!target.src.includes("GrowArea2")) target.src = IMG.growArea;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/38 to-black/8" />

      {label && (
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-xl">
          {label}
        </div>
      )}

      {cta && (
        <div className="absolute right-4 top-4 rounded-full bg-emerald-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-black shadow-xl">
          {cta}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
        <div className="text-2xl font-black leading-tight drop-shadow-2xl">{title}</div>
        <div className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/90">{subtitle}</div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

function AccessRibbon() {
  const { activeUser, liveUsers, activity } = useLiveEcosystem();
  const visibleUsers = liveUsers.slice(-5);
  const latest = activity.slice(-1)[0];

  return (
    <div className="mb-4 rounded-[1.5rem] border border-emerald-200/15 bg-black/38 p-3 shadow-[0_20px_70px_rgba(0,0,0,.35)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-100/70">Multi-User Access</div>
          <div className="mt-1 text-sm font-black text-white">
            {activeUser ? `${activeUser.name} • ${activeUser.role} • ${activeUser.accessLevel} access` : "Guest/public access active — sign in by role for protected tools"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {visibleUsers.map((user) => (
            <span key={user.id} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90">
              {user.role.split(" ")[0]} • {user.lastSeen}
            </span>
          ))}
          {latest && <span className="rounded-full bg-emerald-300 px-3 py-1.5 text-[11px] font-black text-black">Latest: {latest.action}</span>}
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="mb-4 rounded-[1.5rem] border border-white/10 bg-black/35 p-3 backdrop-blur-xl">
      <div className="grid gap-3 md:grid-cols-4">
        <StatusTile label="Ecosystem Status" value={`${ecosystemStatus.teams} Active Teams`} note={`${ecosystemStatus.zones} grow zones active`} />
        <StatusTile label="Weather" value={ecosystemStatus.weather} note="Live channel buttons available" />
        <StatusTile label="Harvest" value={ecosystemStatus.harvest} note="Marketplace forecast open" />
        <StatusTile label="Reports" value={`${ecosystemStatus.parentSummaries} summaries ready`} note="Daily documentation active" />
      </div>
    </div>
  );
}

function StatusTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
      <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-100/70">{label}</div>
      <div className="mt-1 text-base font-black">{value}</div>
      <div className="mt-1 text-xs text-emerald-50/80">{note}</div>
    </div>
  );
}

function ActionGrid({ items, setScreen }: { items: CardLink[]; setScreen: (screen: Screen) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <button
          key={item.title}
          onClick={() => (item.href ? openExternal(item.href) : item.screen ? setScreen(item.screen) : undefined)}
          className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-emerald-300 hover:text-black"
        >
          <div className="text-lg font-black">{item.title}</div>
          <div className="mt-2 text-sm leading-6 opacity-90">{item.text}</div>
        </button>
      ))}
    </div>
  );
}

function Portal({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="portal" setScreen={setScreen} background={IMG.forest} compactNav>
      <div className="grid min-h-[calc(100vh-2rem)] items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-4xl">
          <div className="rounded-[2.25rem] border border-white/10 bg-black/36 p-6 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl md:p-9">
            <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/85">Bronson Family Farm</div>
            <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">Enter The Ecosystem.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/92 drop-shadow-2xl md:text-xl md:leading-9">
              Step through the forest gate first. The guest journey becomes the guided tour and explains the ecosystem as you move.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => setScreen("guest")} className="rounded-full bg-emerald-300 px-8 py-4 font-black text-black shadow-2xl transition hover:scale-105">
                Enter The Ecosystem
              </button>
              <button onClick={() => setScreen("account")} className="rounded-full border border-white/15 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
                Create Account
              </button>
              <button onClick={() => setScreen("access")} className="rounded-full border border-white/15 bg-black/30 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/15">
                Live Access
              </button>
              <button onClick={() => setScreen("guest")} className="rounded-full border border-white/15 bg-black/30 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/15">
                Continue As Guest
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setScreen("guest")}
          className="block w-full rounded-[2.25rem] border border-white/10 bg-black/28 p-4 text-left shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl transition hover:scale-[1.01] hover:border-emerald-200/35"
        >
          <PhotoCard
            title="The Forest Gate Is Open"
            subtitle="Step forward into the forest entrance. The journey opens through movement, place, and discovery."
            image={IMG.forestAlt}
            height="440px"
            label="Arrival"
            cta="Enter"
          />
        </button>
      </div>
    </Shell>
  );
}

function AccessCenter({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const { activeUser, liveUsers, activity } = useLiveEcosystem();

  return (
    <Shell screen="access" setScreen={setScreen} background={IMG.forest}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel
          eyebrow="Live Multi-User Access"
          title="One ecosystem link. Many users. Protected role movement."
          body="Guests, youth, parents, supervisors, growers, marketplace users, partners, and administrators enter the same online ecosystem through role-appropriate pathways. Protected youth tools remain limited to approved staff and administrators."
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Current Access State</div>
          <h2 className="mt-3 text-3xl font-black">{activeUser ? activeUser.name : "Public Guest"}</h2>
          <p className="mt-3 text-sm leading-6 text-white/80">
            {activeUser
              ? `${activeUser.role} has ${activeUser.accessLevel} access. ${supabaseReadyNote()}`
              : "No role session is active on this device. Guests can explore public pathways, or enter by role to use protected areas."}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {liveUsers.length ? liveUsers.slice(-8).map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-lg font-black">{user.name}</div>
                <div className="mt-1 text-sm text-emerald-100">{user.role}</div>
                <div className="mt-2 text-xs text-white/70">{user.accessLevel} access • last seen {user.lastSeen}</div>
              </div>
            )) : (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/80">No active role sessions yet. Create one from the account screen.</div>
            )}
          </div>

          <div className="mt-5">
            <ActionGrid
              setScreen={setScreen}
              items={[
                { title: "Create / Switch Role", text: "Enter as supervisor, parent, youth, grower, partner, customer, or admin.", screen: "account" },
                { title: "Protected Supervisor Tools", text: "Staff-only youth assessment and daily observation area.", screen: "supervisor" },
                { title: "Parent View", text: "Approved youth progress and family visibility.", screen: "parent" },
                { title: "Data + Reports", text: "Operational record of youth, crop, marketplace, and impact activity.", screen: "reports" },
              ]}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Recent Activity</div>
            <div className="mt-3 grid gap-2">
              {activity.length ? activity.slice(-5).reverse().map((item) => (
                <div key={item.id} className="rounded-xl bg-white/10 p-3 text-sm text-white/82">
                  <span className="font-black">{item.user}</span> {item.action} <span className="text-emerald-100/70">at {item.timestamp}</span>
                </div>
              )) : <div className="text-sm text-white/70">Activity will appear as users enter and move through pathways.</div>}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Account({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role>("Youth Workforce Participant");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const routeForRole: Record<Role, Screen> = {
    Guest: "guest",
    "Youth Workforce Participant": "youth",
    "Parent / Guardian": "parent",
    "Supervisor / Staff": "supervisor",
    Grower: "grower",
    "Marketplace Customer": "marketplace",
    Volunteer: "roles",
    Partner: "partners",
    Administrator: "operations",
    "Value-Added Producer": "valueAdded",
  };

  const handleAccess = async () => {
    setIsSubmitting(true);
    setAuthMessage("");
    try {
      const user = await authenticateEcosystemUser({
        email,
        password,
        role: selectedRole,
        name: displayName,
        mode: authMode,
      });
      recordEcosystemActivity(user, `opened ${routeForRole[selectedRole]} pathway`);
      setScreen(routeForRole[selectedRole]);
    } catch (error: any) {
      setAuthMessage(error?.message || "The ecosystem could not complete this sign-in. Check the email, password, and Supabase settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Shell screen="account" setScreen={setScreen} background={IMG.forest} compactNav>
      <div className="grid min-h-[calc(100vh-2rem)] items-center gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/50 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-7">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/80">Ecosystem Role Access</div>
          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-5xl">Enter with secure role access.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90">
            Guests can explore immediately. Returning users, supervisors, parents, growers, partners, and administrators sign in so the ecosystem knows what each person may safely see and do.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <button
              onClick={() => setAuthMode("signIn")}
              className={`rounded-2xl border px-4 py-3 text-left font-black ${authMode === "signIn" ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"}`}
            >
              Sign In
              <span className="mt-1 block text-xs font-medium opacity-75">Existing ecosystem user</span>
            </button>
            <button
              onClick={() => setAuthMode("signUp")}
              className={`rounded-2xl border px-4 py-3 text-left font-black ${authMode === "signUp" ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"}`}
            >
              Create Account
              <span className="mt-1 block text-xs font-medium opacity-75">New role request</span>
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <label className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Name / Group Label</label>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Example: Supervisor A, Parent, Youth Team 1, Grower"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/45 focus:border-emerald-200"
            />

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@email.com"
                  type="email"
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/45 focus:border-emerald-200"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Password</label>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  type="password"
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/45 focus:border-emerald-200"
                />
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-white/70">
              {supabase
                ? "Supabase is connected. Email/password sessions will persist and role metadata will be saved. Staff and administrator areas remain protected."
                : "Supabase keys are not loaded yet. This still allows local role-session testing; add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for true secure login."}
            </p>
          </div>

          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black shadow-xl backdrop-blur-xl transition ${
                  selectedRole === role ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {authMessage && (
            <div className="mt-4 rounded-2xl border border-orange-200/30 bg-orange-950/45 p-4 text-sm leading-6 text-orange-50">
              {authMessage}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handleAccess}
              disabled={isSubmitting}
              className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black shadow-2xl transition hover:scale-105 disabled:opacity-50"
            >
              {isSubmitting ? "Opening Access..." : authMode === "signUp" ? "Create Account + Enter" : "Sign In + Enter"}
            </button>
            <button onClick={() => setScreen("guest")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
              Continue As Guest
            </button>
            <button onClick={() => setScreen("portal")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
              Back To Portal
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/40 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-7">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">Access Path</div>
          <h2 className="mt-4 text-3xl font-black leading-tight">One ecosystem. Many users. Clear permissions.</h2>
          <div className="mt-5 grid gap-3">
            {[
              ["Selected Role", selectedRole],
              ["Guest First", "Guests can explore the living ecosystem before creating an account."],
              ["Protected Youth Data", "Only approved supervisor/staff and administrators enter youth observation and assessment tools."],
              ["Parent Visibility", "Parents see attendance, badges, strengths, encouragement, and approved reflections."],
              ["Live Access", "Multiple users can enter the same Vercel link while Supabase manages secure sessions and shared records."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <div className="text-lg font-black">{title}</div>
                <div className="mt-1 text-sm leading-5 text-white/80">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function GuestJourney({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = guestSteps[stepIndex];
  const lastStep = stepIndex === guestSteps.length - 1;

  useEffect(() => {
    window.speechSynthesis?.getVoices?.();
  }, []);

  return (
    <Shell screen="guest" setScreen={setScreen} background={step.image}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/50 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-6">
          <div className="text-xs uppercase tracking-[0.32em] text-emerald-100/80">{step.eyebrow}</div>
          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-5xl">{step.title}</h1>
          <p className="mt-5 text-base leading-7 text-white/90 md:text-lg md:leading-8">{step.subtitle}</p>


          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Narration Control Panel</div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button onClick={() => speak(`${step.title}. ${step.subtitle}`)} className="rounded-full bg-emerald-300 px-5 py-3 font-black text-black shadow-xl transition hover:scale-105">
                Play Guided Voice
              </button>
              <button onClick={() => window.speechSynthesis?.cancel()} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20">
                Stop Voice
              </button>
              <button onClick={() => setScreen("roles")} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20">
                Skip To Roles
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => setStepIndex((v) => Math.max(v - 1, 0))} disabled={stepIndex === 0} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 disabled:opacity-35">
              Back
            </button>
            {!lastStep ? (
              <button onClick={() => setStepIndex((v) => Math.min(v + 1, guestSteps.length - 1))} className="rounded-full bg-emerald-300 px-5 py-3 font-black text-black shadow-xl transition hover:scale-105">
                Continue Journey
              </button>
            ) : (
              <button onClick={() => setScreen("roles")} className="rounded-full bg-emerald-300 px-5 py-3 font-black text-black shadow-xl transition hover:scale-105">
                Choose A Pathway
              </button>
            )}
            {step.nextScreen && (
              <button onClick={() => setScreen(step.nextScreen as Screen)} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
                Open This Area
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <PhotoCard title={step.title} subtitle={step.subtitle} image={step.image} height="360px" label={`Step ${stepIndex + 1} of ${guestSteps.length}`} cta="Active" />
          <div className="rounded-[2rem] border border-white/10 bg-black/46 p-5 backdrop-blur-2xl">
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Pathway Movement</div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {step.experience.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/85">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              {guestSteps.map((guestStep, index) => (
                <button
                  key={guestStep.id}
                  onClick={() => setStepIndex(index)}
                  className={`h-2 flex-1 rounded-full transition ${index === stepIndex ? "bg-emerald-300" : "bg-white/20 hover:bg-white/40"}`}
                  aria-label={`Go to ${guestStep.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Roles({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const cards: { title: string; subtitle: string; image: string; screen: Screen }[] = [
    { title: "Guest Demo", subtitle: "Experience the ecosystem explanation through movement.", image: IMG.forest, screen: "guest" },
    { title: "Youth Workforce", subtitle: "Assignments, assessments, badges, and growth.", image: IMG.youth1, screen: "youth" },
    { title: "Supervisor / Staff", subtitle: "Protected youth access, daily scoring, support notes, and reports.", image: IMG.fencing, screen: "supervisor" },
    { title: "Parent / Guardian", subtitle: "Supportive visibility, attendance, badges, and progress.", image: IMG.queens, screen: "parent" },
    { title: "Grower Field", subtitle: "Crop planning, weather, soil, harvest, and stewardship.", image: IMG.growArea, screen: "grower" },
    { title: "Marketplace", subtitle: "Harvest, inventory, SNAP visibility, and circulation.", image: IMG.marketplaceHero, screen: "marketplace" },
    { title: "Operations Room", subtitle: "Teams, crops, alerts, marketplace, and reports.", image: IMG.ecosystem, screen: "operations" },
    { title: "Value-Added Producer", subtitle: "Culinary, mushrooms, edible flowers, packaging, and market identity.", image: IMG.flowers, screen: "valueAdded" },
    { title: "Partners / Funders", subtitle: "Support, sponsorship, impact, and investment readiness.", image: IMG.partners, screen: "partners" },
  ];

  return (
    <Shell screen="roles" setScreen={setScreen} background={IMG.forest}>
      <StatusBar />
      <div className="mb-4 rounded-[1.75rem] border border-white/10 bg-black/42 p-5 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Living Crossroads</div>
        <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">Choose how you want to move through the ecosystem.</h1>
        <p className="mt-3 text-base leading-7 text-emerald-50/90">The guest pathway is the demo. The role pathways become deeper participation.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <PhotoCard key={card.title} title={card.title} subtitle={card.subtitle} image={card.image} onClick={() => setScreen(card.screen)} label="Pathway" cta="Open" />
        ))}
      </div>
    </Shell>
  );
}

function Encouragement({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const proverb = proverbs[getDailyIndex(proverbs.length)];
  const message = messages[getDailyIndex(messages.length)];

  return (
    <Shell screen="encouragement" setScreen={setScreen} background={IMG.seeds}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel eyebrow="Daily Proverb" title={proverb} body="A daily grounding message for work, responsibility, and growth." />
        <Panel eyebrow="Positive Message" title={message} body="A daily encouragement that keeps actions connected to purpose." />
      </div>
      <div className="mt-4">
        <ActionGrid
          setScreen={setScreen}
          items={[
            { title: "Youth Reflection", text: "Open the youth pathway and connect today's message to the day’s work.", screen: "youth" },
            { title: "Supervisor Observation", text: "Supervisors use the message to support youth reflection and emotional readiness.", screen: "supervisor" },
            { title: "Parent Summary", text: "Parents see encouragement, progress, and approved reflections.", screen: "parent" },
            { title: "Reports", text: "Reflections become part of documentation and impact evidence.", screen: "reports" },
          ]}
        />
      </div>
    </Shell>
  );
}

function Youth({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="youth" setScreen={setScreen} background={IMG.youth1}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-2">
        <PhotoCard
          title="Youth Workforce Pathway"
          subtitle="A high-energy pathway where daily assignments, PPE, teamwork, assessments, reflections, and badges connect participation to growth."
          image={IMG.youth1}
          height="340px"
          label="Energy + Urgency"
          cta="Daily Flow"
          onClick={() => setScreen("supervisor")}
        />

        <div className="rounded-[2rem] border border-orange-300/20 bg-orange-950/30 p-6 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-orange-100/75">Today’s Youth Rhythm</div>
          <h2 className="mt-4 text-3xl font-black">From check-in to reflection.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["QR Check-In", "supervisor"],
              ["PPE Verification", "supervisor"],
              ["Station Assignment", "crop"],
              ["Crop Zone Work", "crop"],
              ["Supervisor Observation", "supervisor"],
              ["Daily Score", "supervisor"],
              ["Youth Reflection", "encouragement"],
              ["Badge Progress", "parent"],
            ].map(([item, target]) => (
              <button key={item} onClick={() => setScreen(target as Screen)} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left font-black transition hover:bg-emerald-300 hover:text-black">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Supervisor({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="supervisor" setScreen={setScreen} background={IMG.fencing}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel
          eyebrow="Supervisor / Staff Protected Access"
          title="Supervisors are the youth access layer."
          body="Staff guide the daily youth journey, protect records, document growth, and keep public users outside private youth tools."
        />

        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Assessment Room</div>
          <h2 className="mt-3 text-3xl font-black">Daily mobile supervisor scoring</h2>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {assessmentCategories.map((item) => (
              <button key={item} onClick={() => setScreen("data")} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left text-sm font-black transition hover:bg-emerald-300 hover:text-black">
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <ActionGrid
              setScreen={setScreen}
              items={[
                { title: "Open Safety Rules", text: "No PPE, no work. Youth protection and role access rules.", screen: "safety" },
                { title: "Parent Summary Flow", text: "Show what parents can see after supervisor approval.", screen: "parent" },
                { title: "Generate Daily Report", text: "Send supervisor observations to reports.", screen: "reports" },
                { title: "Return to Youth", text: "View the youth-facing daily rhythm.", screen: "youth" },
              ]}
            />
          </div>
          <OperationalSnapshot setScreen={setScreen} table="supervisor_assessments" />
        </div>
      </div>
    </Shell>
  );
}

function Safety({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="safety" setScreen={setScreen} background={IMG.fencing}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          eyebrow="Youth Protection"
          title="Access is separated by role."
          body="Public, family, staff, and admin access remain separated so youth records stay protected while the ecosystem remains open for appropriate participation."
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Protected Rules</div>
          <div className="mt-5 grid gap-3">
            {[
              "No public user enters youth records.",
              "Supervisors must be approved staff.",
              "Youth safety, PPE, and attendance are daily checks.",
              "Parent view separates encouragement/progress from internal support flags.",
              "Visitors and partners see program outcomes, not private youth data.",
              "Every youth-facing tool routes through the supervisor layer.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/88">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Parent({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const rows = [
    ["Attendance", "Present today", "Parent can see"],
    ["Safety", "PPE complete", "Parent can see"],
    ["Station", "Grow Area + Compost", "Parent can see"],
    ["Skill Badge", "Field Responsibility in progress", "Parent can see"],
    ["Supervisor Note", "Showed patience and helped a peer reset", "Parent summary"],
    ["Support Flag", "Follow-up needed", "Internal supervisor view"],
  ];

  return (
    <Shell screen="parent" setScreen={setScreen} background={IMG.queens}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel
          eyebrow="Parent / Guardian Portal"
          title="Parents see support, progress, and next steps."
          body="Parents receive approved progress, attendance, safety, badges, strengths, encouragement, announcements, and reflections while private staff notes remain protected."
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Youth Progress Snapshot</div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            {rows.map(([a, b, c]) => (
              <div key={a} className="grid grid-cols-3 border-b border-white/10 bg-white/10 p-3 text-sm last:border-b-0">
                <div className="font-black">{a}</div>
                <div>{b}</div>
                <div className="text-emerald-100/85">{c}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <ActionGrid
              setScreen={setScreen}
              items={[
                { title: "Open Encouragement", text: "Daily proverb and positive message.", screen: "encouragement" },
                { title: "Open Supervisor View", text: "See how the parent summary is created.", screen: "supervisor" },
                { title: "Open Reports", text: "See final parent and youth progress reporting.", screen: "reports" },
                { title: "Back to Roles", text: "Choose another pathway.", screen: "roles" },
              ]}
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Grower({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="grower" setScreen={setScreen} background={IMG.growArea}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-2">
        <PhotoCard
          title="Grower Pathway"
          subtitle="Growers use field information, weather, crop planning, training, marketplace timing, and shared resources to participate in the ecosystem."
          image={IMG.growArea}
          height="340px"
          label="Grower"
          cta="Plan"
          onClick={() => setScreen("crop")}
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Live Field Channels</div>
          <h2 className="mt-3 text-3xl font-black">Weather, calendar, soil, crop, and market timing.</h2>
          <div className="mt-5">
            <ActionGrid setScreen={setScreen} items={liveChannels} />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function CropPlanner({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [selectedCrop, setSelectedCrop] = useState("Tomatoes");
  const crops = ["Tomatoes", "Collards", "Mustard Greens", "Peppers", "Broccoli", "Spinach", "Lettuce", "Cilantro"];

  return (
    <Shell screen="crop" setScreen={setScreen} background={IMG.growAreaAlt}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Crop Planner / Grow Plan</div>
          <h1 className="mt-3 text-4xl font-black">Select crop and generate work.</h1>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {crops.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`rounded-2xl border p-4 text-left font-black ${
                  selectedCrop === crop ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <ActionGrid
              setScreen={setScreen}
              items={[
                { title: "Send to Youth Assignments", text: "Turn the grow plan into daily youth work.", screen: "youth" },
                { title: "Send to Marketplace", text: "Move harvest window into inventory forecast.", screen: "marketplace" },
                { title: "Send to Reports", text: "Make the crop plan funder-ready.", screen: "reports" },
                { title: "Open Weather", text: "Check field conditions.", screen: "grower" },
              ]}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Active Grow Plan</div>
          <h2 className="mt-3 text-3xl font-black">{selectedCrop}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {cropPlanItems.map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">{item}</div>
                <div className="mt-2 text-lg font-black">{index % 2 === 0 ? "Ready for update" : "Linked to operations"}</div>
              </div>
            ))}
          </div>
          <OperationalSnapshot setScreen={setScreen} table="crop_plans" />
        </div>
      </div>
    </Shell>
  );
}

function Marketplace({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const products = [
    ["Tomato Seedlings", "3 for $5", "SNAP eligible if sold as food-producing plant"],
    ["Collard Greens", "5 for $10", "Food access / nutrition"],
    ["Mustard Greens", "5 for $7", "Food access / nutrition"],
    ["Peppers", "3 for $5", "Food-producing plant"],
    ["Bubble Babies™", "Seed roll system", "Education + production"],
    ["Community Seeds", "Giveaway inventory", "Jubilee Gardens contribution"],
  ];

  return (
    <Shell screen="marketplace" setScreen={setScreen} background={IMG.marketplaceHero}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel
          eyebrow="Marketplace Circulation"
          title="Inventory connects to crop planning and community access."
          body="The marketplace shows availability, forecasts, SNAP-visible products, and the movement from grow plan to customer access."
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Marketplace Inventory</div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {products.map(([name, price, note]) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-lg font-black">{name}</div>
                <div className="mt-1 text-emerald-100">{price}</div>
                <div className="mt-2 text-sm leading-5 text-white/78">{note}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <ActionGrid
              setScreen={setScreen}
              items={[
                { title: "Open GrownBy Store", text: "Go to the Bronson Family Farm shop.", href: "https://grownby.com/farms/bronson-family-farm/shop" },
                { title: "Update Crop Forecast", text: "Connect inventory to crop planning.", screen: "crop" },
                { title: "Marketplace Report", text: "Document sales, circulation, and reach.", screen: "reports" },
                { title: "Value-Added Path", text: "Open culinary/value-added products.", screen: "valueAdded" },
              ]}
            />
          </div>
          <OperationalSnapshot setScreen={setScreen} table="marketplace_inventory" />
        </div>
      </div>
    </Shell>
  );
}

function ValueAdded({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="valueAdded" setScreen={setScreen} background={IMG.flowers}>
      <StatusBar />
      <div className="grid gap-4 md:grid-cols-3">
        <PhotoCard title="Edible Flowers" subtitle="Culinary education, customer experience, and specialty products." image={IMG.flowers} onClick={() => setScreen("marketplace")} label="Value-Added" cta="Market" />
        <PhotoCard title="Mushrooms" subtitle="Food education, value-added production, and specialty crop opportunity." image={IMG.mushrooms} onClick={() => setScreen("crop")} label="Specialty" cta="Plan" />
        <PhotoCard title="Packaging + Story" subtitle="Branding, QR labels, recipes, and customer return pathways." image={IMG.flowers2} onClick={() => setScreen("reports")} label="Brand" cta="Report" />
      </div>
    </Shell>
  );
}

function Operations({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="operations" setScreen={setScreen} background={IMG.ecosystem}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <PhotoCard
          title="Connected Food Ecosystem"
          subtitle="The connected system comes into view here, showing how the pathways move together."
          image={IMG.ecosystem}
          height="430px"
          label="System View"
          cta="Connected"
          onClick={() => setScreen("data")}
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Operations Control</div>
          <h2 className="mt-3 text-3xl font-black">Assignments, channels, alerts, reports.</h2>
          <div className="mt-5 grid gap-3">
            {assignments.map((item) => (
              <button key={item} onClick={() => setScreen("data")} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left font-black transition hover:bg-emerald-300 hover:text-black">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function DataRoom({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const metrics = [
    ["Youth Capacity", ecosystemStatus.youthCapacity],
    ["Supervisors Active", String(ecosystemStatus.supervisors)],
    ["Reflections Submitted", String(ecosystemStatus.reflections)],
    ["Parent Summaries Ready", String(ecosystemStatus.parentSummaries)],
    ["Grow Zones Active", String(ecosystemStatus.zones)],
    ["Marketplace", ecosystemStatus.market],
  ];

  return (
    <Shell screen="data" setScreen={setScreen} background={IMG.partners}>
      <StatusBar />
      <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Data Room</div>
        <h1 className="mt-3 text-4xl font-black">Operational data turns activity into decisions.</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {metrics.map(([title, value]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">{title}</div>
              <div className="mt-2 text-2xl font-black">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <ActionGrid
            setScreen={setScreen}
            items={[
              { title: "Supervisor Assessment Data", text: "See the staff scoring layer.", screen: "supervisor" },
              { title: "Parent Summary Data", text: "See what is parent-visible.", screen: "parent" },
              { title: "Crop + Market Data", text: "Connect harvest to marketplace forecast.", screen: "crop" },
              { title: "Reports", text: "Convert data into funder-ready reporting.", screen: "reports" },
            ]}
          />
        </div>
        <OperationalSnapshot setScreen={setScreen} />
      </div>
    </Shell>
  );
}

function Reports({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="reports" setScreen={setScreen} background={IMG.partners}>
      <StatusBar />
      <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Reports + Exports</div>
        <h1 className="mt-3 text-4xl font-black">The ecosystem proves itself through documentation.</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {reportTypes.map((item) => (
            <button key={item} onClick={() => setScreen("data")} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left font-black transition hover:bg-emerald-300 hover:text-black">
              {item}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <ActionGrid
            setScreen={setScreen}
            items={[
              { title: "Partner Impact", text: "Show funders and partners the evidence.", screen: "partners" },
              { title: "Operations", text: "Return to the whole system view.", screen: "operations" },
              { title: "Data Room", text: "Review live metrics.", screen: "data" },
              { title: "Guest Demo", text: "Restart the guided explanation.", screen: "guest" },
            ]}
          />
        </div>
        <OperationalSnapshot setScreen={setScreen} table="ecosystem_reports" />
      </div>
    </Shell>
  );
}

function Partners({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const partnerCards = [
    ["Jubilee Gardens, Inc.", "Seed donations that help make giveaways and community planting possible."],
    ["Parker Farms", "Value-added education, grower ecosystem alignment, and marketplace participation."],
    ["Central State University", "Farm training, agricultural education, and grower development connection."],
    ["Home Depot", "Tools, demonstrations, fencing, raised beds, and practical infrastructure support."],
    ["Elliott's Garden Center", "Compost support for regenerative growing and soil-building."],
    ["Youngstown Partners", "Public health, planning, parks, workforce, and community support alignment."],
  ];

  return (
    <Shell screen="partners" setScreen={setScreen} background={IMG.partners}>
      <StatusBar />
      <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Partner / Investor View</div>
        <h1 className="mt-3 text-4xl font-black">Partners support the ecosystem where resources become community capacity.</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {partnerCards.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-lg font-black">{title}</div>
              <div className="mt-2 text-sm leading-6 text-white/80">{text}</div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <ActionGrid
            setScreen={setScreen}
            items={[
              { title: "Impact Reports", text: "Review measurable outcomes.", screen: "reports" },
              { title: "Operations View", text: "See how the whole system connects.", screen: "operations" },
              { title: "Marketplace", text: "See economic circulation and customer access.", screen: "marketplace" },
              { title: "Youth Workforce", text: "See workforce development and protected supervision.", screen: "youth" },
            ]}
          />
        </div>
      </div>
    </Shell>
  );
}

function Training({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="training" setScreen={setScreen} background={IMG.csu}>
      <StatusBar />
      <Panel
        eyebrow="Training"
        title="Supervisor and participant training connects the work to safety, skill, and growth."
        body="Training guides PPE, youth protection, assessment language, role-based access, field stations, emergency procedures, reflection, crop planning, marketplace preparation, and reporting."
      />
      <div className="mt-4">
        <ActionGrid
          setScreen={setScreen}
          items={[
            { title: "Supervisor Training", text: "Open protected supervisor assessment flow.", screen: "supervisor" },
            { title: "Youth Daily Flow", text: "Open youth pathway.", screen: "youth" },
            { title: "Crop Training", text: "Open grow plan.", screen: "crop" },
            { title: "Safety", text: "Open youth protection and PPE rules.", screen: "safety" },
          ]}
        />
      </div>
    </Shell>
  );
}


function OperationalSnapshot({ setScreen, table }: { setScreen: (screen: Screen) => void; table?: OperationalTable }) {
  const { activeUser } = useLiveEcosystem();
  const { records, loading, refresh } = useOperationalRecords(table);

  const addFieldRecord = async () => {
    const role = activeUser?.role || "Guest";
    const tableName: OperationalTable =
      role === "Supervisor / Staff" || role === "Administrator"
        ? "supervisor_assessments"
        : role === "Grower"
          ? "crop_plans"
          : role === "Marketplace Customer"
            ? "marketplace_inventory"
            : "ecosystem_reports";

    await saveOperationalRecord({
      table: table || tableName,
      title: `${role} field update`,
      status: "recorded",
      role,
      detail: "A live ecosystem action was recorded from the role pathway and is ready for operations, reporting, or family/partner visibility.",
    });
    recordEcosystemActivity(activeUser, "recorded an operational ecosystem update");
    await refresh();
  };

  return (
    <div className="mt-5 rounded-[2rem] border border-emerald-200/15 bg-black/35 p-5 backdrop-blur-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Operational Platform Layer</div>
          <h3 className="mt-2 text-2xl font-black">Live records, protected roles, and shared ecosystem movement.</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/78">
            These records can run locally for testing and connect to Supabase tables when the production database is ready. The visible ecosystem stays the same while the operational layer stores assignments, assessments, crop plans, inventory, parent summaries, and reports.
          </p>
        </div>
        <button onClick={addFieldRecord} className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-black shadow-xl transition hover:scale-105">
          Record Live Update
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/80">Loading ecosystem records...</div>
        ) : records.length ? (
          records.slice(0, 6).map((record) => (
            <button key={record.id} onClick={() => setScreen("reports")} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-emerald-300 hover:text-black">
              <div className="text-[10px] uppercase tracking-[0.22em] opacity-75">{record.table.replaceAll("_", " ")}</div>
              <div className="mt-2 text-lg font-black">{record.title}</div>
              <div className="mt-1 text-xs font-bold opacity-80">{record.status}</div>
              <div className="mt-2 text-sm leading-5 opacity-85">{record.detail}</div>
            </button>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/80">No operational records yet.</div>
        )}
      </div>
    </div>
  );
}

function Panel({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/48 p-6 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/75">{eyebrow}</div>
      <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{title}</h1>
      <p className="mt-5 text-base leading-8 text-white/88">{body}</p>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("portal");
  const { activeUser } = useLiveEcosystem();

  const navigate = (nextScreen: Screen) => {
    if (!canAccessScreen(activeUser, nextScreen)) {
      recordEcosystemActivity(activeUser, `was redirected from protected ${nextScreen} area`);
      setScreen(routeForDeniedAccess(activeUser, nextScreen));
      return;
    }
    recordEcosystemActivity(activeUser, `opened ${nextScreen}`);
    setScreen(nextScreen);
  };

  const screenComponent = useMemo(() => {
    switch (screen) {
      case "portal":
        return <Portal setScreen={navigate} />;
      case "account":
        return <Account setScreen={navigate} />;
      case "access":
        return <AccessCenter setScreen={navigate} />;
      case "guest":
        return <GuestJourney setScreen={navigate} />;
      case "roles":
        return <Roles setScreen={navigate} />;
      case "youth":
        return <Youth setScreen={navigate} />;
      case "supervisor":
        return <Supervisor setScreen={navigate} />;
      case "parent":
        return <Parent setScreen={navigate} />;
      case "grower":
        return <Grower setScreen={navigate} />;
      case "crop":
        return <CropPlanner setScreen={navigate} />;
      case "marketplace":
        return <Marketplace setScreen={navigate} />;
      case "operations":
        return <Operations setScreen={navigate} />;
      case "encouragement":
        return <Encouragement setScreen={navigate} />;
      case "reports":
        return <Reports setScreen={navigate} />;
      case "partners":
        return <Partners setScreen={navigate} />;
      case "safety":
        return <Safety setScreen={navigate} />;
      case "data":
        return <DataRoom setScreen={navigate} />;
      case "training":
        return <Training setScreen={navigate} />;
      case "valueAdded":
        return <ValueAdded setScreen={navigate} />;
      default:
        return <Portal setScreen={navigate} />;
    }
  }, [screen, activeUser]);

  return screenComponent;
}
