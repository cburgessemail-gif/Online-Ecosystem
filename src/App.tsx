import React, { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Bronson Family Farm Online Ecosystem
 * REAL SUPERVISOR + MARKETPLACE OPERATIONS CENTER
 *
 * Complete React/Vite App.tsx replacement focused on launch operations.
 * Preserves the ecosystem concept while making the Supervisor pathway operational:
 * - Role access
 * - Youth roster
 * - Attendance and PPE
 * - Morning wellness review
 * - Daily supervisor assessment
 * - Incident/support log
 * - Parent-safe summary generator
 * - Reports
 * - Real Marketplace Operations: catalog, cart, checkout, orders, marketplace reports
 * - Supabase writes with localStorage fallback
 */

type Screen =
  | "portal"
  | "guest"
  | "registration"
  | "roles"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "valueAdded"
  | "marketplace"
  | "wellness"
  | "myDayStatus"
  | "reports"
  | "operations"
  | "feedback";

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
  | "Value-Added Producer"
  | "Board / Funder";

type AccessLevel = "public" | "participant" | "family" | "staff" | "admin" | "board";
type ProfileType = "youth" | "supervisor" | "parent" | "grower" | "value_added" | "volunteer" | "partner" | "customer" | "board";

type EcosystemUser = {
  id: string;
  name: string;
  role: Role;
  accessLevel: AccessLevel;
  status: "online" | "active" | "viewing";
  lastSeen: string;
};

type MasterProfile = {
  id: string;
  profile_type: ProfileType;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  organization_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
  active: boolean;
  created_at: string;
};

type EcosystemRegistration = {
  id: string;
  role: Role;
  full_name: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  email?: string;
  phone?: string;
  profile_type: ProfileType;
  active: boolean;
  created_at: string;
};

type YouthRegistration = {
  id: string;
  profile_id: string;
  participant_id: string;
  age_range: string;
  crew: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  emergency_contact: string;
  medical_notes: string;
  transportation_plan: string;
  program_goal: string;
};

type AttendanceRecord = {
  id: string;
  participant_id: string;
  supervisor_id?: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  status: "present" | "absent" | "late" | "excused";
  ppe_status: "complete" | "missing_gloves" | "missing_shoes" | "missing_water" | "needs_review";
  qr_method?: "manual" | "qr" | "supervisor";
  notes?: string;
  created_at: string;
};

type AssessmentRecord = {
  id: string;
  participant_id: string;
  supervisor_id?: string;
  date: string;
  safety: number;
  teamwork: number;
  communication: number;
  responsibility: number;
  initiative: number;
  problem_solving: number;
  notes?: string;
  created_at: string;
};

type WellnessCheckIn = {
  id: string;
  profile_id: string;
  profile_type: ProfileType;
  checkin_type: "baseline" | "morning" | "midday" | "end_day" | "weekly";
  mood?: string;
  energy?: string;
  sleep?: string;
  breakfast?: string;
  hope_score?: number;
  belonging_score?: number;
  trusted_adult_score?: number;
  confidence_score?: number;
  stress_score?: number;
  support_needed?: string;
  private_note?: string;
  safety_flag?: boolean;
  created_at: string;
};



type PPECheckIn = {
  id: string;
  participant_id: string;
  profile_id?: string;
  checkin_date: string;
  checkin_time: string;
  closed_toe_shoes: boolean;
  water_bottle: boolean;
  work_gloves: boolean;
  appropriate_clothing: boolean;
  sunscreen: boolean;
  hat_weather_protection: boolean;
  equipment_needed?: string;
  ready_for_assignment: boolean;
  notes?: string;
  created_at: string;
};

type YouthEncouragement = {
  id: string;
  message: string;
  theme: "growing" | "confidence" | "learning" | "teamwork" | "responsibility" | "resilience" | "self_discovery";
  active: boolean;
  created_at: string;
};

type IncidentRecord = {
  id: string;
  participant_id?: string;
  staff_id?: string;
  incident_type: "injury" | "behavior" | "conflict" | "wellness" | "safety" | "transportation" | "parent_contact" | "other";
  urgency: "low" | "medium" | "high" | "emergency";
  summary: string;
  action_taken: string;
  parent_contacted: boolean;
  created_at: string;
};

type ParentSummary = {
  id: string;
  participant_id: string;
  supervisor_id?: string;
  date: string;
  strengths: string;
  progress: string;
  needs: string;
  parent_safe_message: string;
  private_staff_notes?: string;
  created_at: string;
};

type FeedbackRecord = {
  id: string;
  profile_id?: string;
  profile_type: ProfileType;
  feedback_type: "platform" | "program" | "event" | "weekly" | "end_program";
  rating: number;
  comments: string;
  would_recommend: boolean;
  created_at: string;
};

type MarketplaceProduct = {
  id: string;
  name: string;
  category: "Produce" | "Seeds & Plants" | "Value-Added" | "Grower Marketplace" | "Events";
  description: string;
  price: number;
  unit: string;
  inventory: number;
  snap_eligible: boolean;
  image_url?: string;
  active: boolean;
  created_at: string;
};

type MarketplaceOrder = {
  id: string;
  customer_name: string;
  email?: string;
  phone?: string;
  payment_method: "SNAP" | "Cash" | "Card" | "Invoice" | "Sponsor";
  pickup_date: string;
  pickup_window: string;
  total: number;
  status: "pending" | "confirmed" | "packed" | "picked_up" | "cancelled";
  notes?: string;
  created_at: string;
};

type MarketplaceOrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type CartItem = {
  product: MarketplaceProduct;
  quantity: number;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const SESSION_KEY = "bff.launch.activeUser";
const PROFILE_KEY = "bff.launch.profiles";
const REGISTRATION_KEY = "bff.launch.ecosystem_registrations";
const YOUTH_KEY = "bff.launch.youth";
const ATTENDANCE_KEY = "bff.launch.attendance";
const ASSESSMENT_KEY = "bff.launch.assessments";
const WELLNESS_KEY = "bff.launch.wellness";
const PPE_KEY = "bff.launch.ppeCheckins";
const YOUTH_ENCOURAGEMENT_KEY = "bff.launch.youthEncouragements";
const INCIDENT_KEY = "bff.launch.incidents";
const PARENT_SUMMARY_KEY = "bff.launch.parentSummaries";
const FEEDBACK_KEY = "bff.launch.feedback";
const MARKET_PRODUCTS_KEY = "bff.launch.market.products";
const MARKET_ORDERS_KEY = "bff.launch.market.orders";
const MARKET_ORDER_ITEMS_KEY = "bff.launch.market.orderItems";

const IMG = {
  forest: "/images/SAM_0384.JPG",
  backup: "/images/GrowArea2.jpg",
  youth: "/images/large (16).jpg",
  supervisor: "/images/large (15).jpg",
  market: "/images/large (11).jpg",
  ecosystem: "/images/ConnectFoodEcosystem_withimages.png",
  grow: "/images/Grow Area.png",
  compost: "/images/Compost_ElliottGarden.png",
  partners: "/images/Partners.png",
  queens: "/images/Queens Village.png",
};

const DEFAULT_YOUTH_ENCOURAGEMENTS: YouthEncouragement[] = [
  { id: "enc-001", theme: "growing", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "Good morning, Cultivator. Today is another chance to grow food, grow skills, and grow yourself." },
  { id: "enc-002", theme: "learning", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "Every row, seed, and task can teach you something. Stay curious and keep learning." },
  { id: "enc-003", theme: "confidence", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "You do not have to know everything today. Show up, ask questions, and grow stronger one step at a time." },
  { id: "enc-004", theme: "responsibility", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "Your work matters. The food you help grow can feed families, build community, and open doors." },
  { id: "enc-005", theme: "self_discovery", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "As you learn the land, also learn yourself: your strengths, your choices, your voice, and your future." },
  { id: "enc-006", theme: "teamwork", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "Great farms are built by teams. Encourage someone today and let someone encourage you." },
  { id: "enc-007", theme: "resilience", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "Growth takes patience. Plants grow little by little, and so do people." },
  { id: "enc-008", theme: "growing", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "We Grow Green to Harvest Dreams. Today, you are part of that dream becoming real." },
  { id: "enc-009", theme: "learning", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "Pay attention to the weather, the soil, the plants, and your own growth. All of them are speaking." },
  { id: "enc-010", theme: "confidence", active: true, created_at: "2026-06-08T00:00:00.000Z", message: "You belong here. Your effort, your questions, and your ideas are part of this farm." },
];

function encouragementForYouth(entries: YouthEncouragement[], participantId: string, dateSeed: string) {
  const active = entries.filter((entry) => entry.active && entry.message.trim());
  const source = active.length ? active : DEFAULT_YOUTH_ENCOURAGEMENTS;
  const seed = `${participantId || "cultivator"}-${dateSeed}`;
  const index = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0) % source.length;
  return source[index];
}

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
  "Board / Funder",
];

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
  "Board / Funder": "board",
};

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function money(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

async function insertRow<T extends { id: string }>(table: string, localKey: string, row: T) {
  const localRows = safeRead<T[]>(localKey, []);
  safeWrite(localKey, [row, ...localRows]);

  if (!supabase) return { ok: true, mode: "local", error: null };

  try {
    const { error } = await supabase.from(table).insert(row);
    if (error) return { ok: false, mode: "local-fallback", error };
    return { ok: true, mode: "supabase", error: null };
  } catch (error) {
    return { ok: false, mode: "local-fallback", error };
  }
}

async function loadSupabaseRows<T>(table: string, localKey: string) {
  if (!supabase) return safeRead<T[]>(localKey, []);
  try {
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (error || !data) return safeRead<T[]>(localKey, []);
    safeWrite(localKey, data as T[]);
    return data as T[];
  } catch {
    return safeRead<T[]>(localKey, []);
  }
}

function profileName(profile?: MasterProfile) {
  if (!profile) return "Unknown participant";
  return `${profile.preferred_name || profile.first_name} ${profile.last_name}`.trim();
}

function roleToProfileType(role: Role): ProfileType {
  const map: Record<Role, ProfileType> = {
    Guest: "customer",
    "Youth Workforce Participant": "youth",
    "Parent / Guardian": "parent",
    "Supervisor / Staff": "supervisor",
    Grower: "grower",
    "Marketplace Customer": "customer",
    Volunteer: "volunteer",
    Partner: "partner",
    Administrator: "partner",
    "Value-Added Producer": "value_added",
    "Board / Funder": "board",
  };
  return map[role];
}

function routeForRole(role: Role): Screen {
  const map: Record<Role, Screen> = {
    Guest: "guest",
    "Youth Workforce Participant": "youth",
    "Parent / Guardian": "parent",
    "Supervisor / Staff": "supervisor",
    Grower: "grower",
    "Marketplace Customer": "marketplace",
    Volunteer: "feedback",
    Partner: "operations",
    Administrator: "operations",
    "Value-Added Producer": "valueAdded",
    "Board / Funder": "reports",
  };
  return map[role];
}

function canEnter(user: EcosystemUser | null, screen: Screen) {
  if (!["supervisor", "operations", "reports"].includes(screen)) return true;
  if (!user) return false;
  return ["staff", "admin", "board"].includes(user.accessLevel);
}

function App() {
  const [screen, setScreenState] = useState<Screen>("portal");
  const [activeUser, setActiveUser] = useState<EcosystemUser | null>(() => safeRead<EcosystemUser | null>(SESSION_KEY, null));
  const [message, setMessage] = useState("");

  const setScreen = (target: Screen) => {
    if (!canEnter(activeUser, target)) {
      setMessage("Protected area. Enter as Supervisor / Staff, Administrator, or Board / Funder first.");
      setScreenState("roles");
      return;
    }
    setMessage("");
    setScreenState(target);
  };

  const signIn = (role: Role, name?: string) => {
    const user: EcosystemUser = {
      id: uuid(),
      name: name?.trim() || `${role} User`,
      role,
      accessLevel: roleAccess[role],
      status: "active",
      lastSeen: nowLabel(),
    };
    safeWrite(SESSION_KEY, user);
    setActiveUser(user);
    setScreenState(routeForRole(role));
  };

  const signOut = () => {
    safeWrite<EcosystemUser | null>(SESSION_KEY, null);
    setActiveUser(null);
    setScreenState("portal");
  };

  return (
    <Shell screen={screen} setScreen={setScreen} activeUser={activeUser} signOut={signOut}>
      {message && <div className="mt-2"><Notice text={message} /></div>}
      {screen === "portal" && <Portal setScreen={setScreen} activeUser={activeUser} />}
      {screen === "guest" && <Guest setScreen={setScreen} />}
      {screen === "registration" && <Registration setScreen={setScreen} activeUser={activeUser} />}
      {screen === "roles" && <MyWorkspace signIn={signIn} activeUser={activeUser} setScreen={setScreen} />}
      {screen === "youth" && <YouthScreen setScreen={setScreen} activeUser={activeUser} />}
      {screen === "supervisor" && <SupervisorOperationsCenter setScreen={setScreen} activeUser={activeUser} />}
      {screen === "parent" && <ParentScreen setScreen={setScreen} />}
      {screen === "grower" && <GrowerOperationsCenter setScreen={setScreen} activeUser={activeUser} />}
      {screen === "valueAdded" && <SimplePathway title="Value-Added Producer Pathway" image={IMG.market} setScreen={setScreen} text="Value-added producers connect products, kitchen readiness, licensing awareness, and marketplace participation." />}
      {screen === "marketplace" && <MarketplaceOperations activeUser={activeUser} setScreen={setScreen} />}
      {screen === "wellness" && <WellnessScreen setScreen={setScreen} activeUser={activeUser} />}
      {screen === "myDayStatus" && <MyDayStatus setScreen={setScreen} activeUser={activeUser} />}
      {screen === "reports" && <Reports setScreen={setScreen} />}
      {screen === "operations" && <Operations setScreen={setScreen} />}
      {screen === "feedback" && <Feedback setScreen={setScreen} activeUser={activeUser} />}
    </Shell>
  );
}

function Shell({
  children,
  screen,
  setScreen,
  activeUser,
  signOut,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  activeUser: EcosystemUser | null;
  signOut: () => void;
}) {
  const nav: { label: string; screen: Screen }[] = [
    { label: "Portal", screen: "portal" },
    { label: "Guest", screen: "guest" },
    { label: "Register", screen: "registration" },
    { label: "My Workspace", screen: "roles" },
    { label: "Youth", screen: "youth" },
    { label: "Supervisor", screen: "supervisor" },
    { label: "Parent", screen: "parent" },
    { label: "Grower", screen: "grower" },
    { label: "Market", screen: "marketplace" },
    { label: "Wellness", screen: "wellness" },
    { label: "Reports", screen: "reports" },
    { label: "Ops", screen: "operations" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img src={IMG.forest} alt="Bronson Family Farm forest entrance" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = IMG.backup)} />
      </div>
      <div className="fixed inset-0 bg-black/54" />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.34),rgba(0,0,0,.68)),radial-gradient(circle_at_top_left,rgba(52,211,153,.22),transparent_32%)]" />
      <div className="relative z-10 mx-auto max-w-[1540px] px-2 py-2 md:px-4">
        <div className="sticky top-2 z-40 mb-2 rounded-[1.1rem] border border-white/10 bg-black/55 p-1.5 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setScreen("portal")} className="mr-1 min-w-[170px] px-2 text-left">
              <div className="text-[9px] uppercase tracking-[0.28em] text-emerald-100/70">Bronson Family Farm</div>
              <div className="text-sm font-black leading-tight">Online Ecosystem</div>
            </button>
            {nav.map((item) => (
              <button
                key={item.screen}
                onClick={() => setScreen(item.screen)}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition ${
                  screen === item.screen ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <div className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-bold">
                {activeUser ? `${activeUser.name} • ${activeUser.role}` : "Public / Guest"}
              </div>
              {activeUser && (
                <button onClick={signOut} className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-black">
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return <div className="mb-3 rounded-2xl border border-amber-200/30 bg-amber-300/15 p-4 text-sm font-black text-amber-50">{text}</div>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[1.35rem] border border-white/10 bg-black/46 p-3 shadow-[0_35px_100px_rgba(0,0,0,.48)] backdrop-blur-2xl ${className}`}>{children}</div>;
}

function Field(props: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">{props.label}</span>
      <input
        value={props.value}
        type={props.type || "text"}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-white outline-none placeholder:text-white/35 focus:border-emerald-200"
      />
    </label>
  );
}

function SelectField(props: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">{props.label}</span>
      <select value={props.value} onChange={(e) => props.onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-white outline-none focus:border-emerald-200">
        {props.options.map((option) => (
          <option key={option} value={option} className="bg-black">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea(props: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">{props.label}</span>
      <textarea
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        rows={2}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-white outline-none placeholder:text-white/35 focus:border-emerald-200"
      />
    </label>
  );
}

function Portal({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Bronson Family Farm</div>
        <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">Enter the living ecosystem.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/88">
          This platform connects youth workforce development, supervisors, parents, growers, marketplace, wellness, safety, feedback, and impact reporting.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button onClick={() => setScreen(activeUser ? routeForRole(activeUser.role) : "guest")} className="rounded-full bg-emerald-300 px-8 py-4 font-black text-black shadow-2xl">Enter The Ecosystem</button>
          <button onClick={() => setScreen("registration")} className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-black">Register / Check In</button>
          <button onClick={() => setScreen("roles")} className="rounded-full border border-white/20 bg-black/35 px-8 py-4 font-black">My Workspace</button>
        </div>
      </Card>
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">Launch Focus</div>
        {[
          "Supervisor Operations Center is now the working control room.",
          "Youth check-ins and supervisor records save to Supabase when connected.",
          "Parents receive progress summaries, not private raw youth reflections.",
          "Incident and support flags stay staff-facing.",
          "Reports convert daily records into launch readiness and program impact.",
        ].map((item) => (
          <div key={item} className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/86">{item}</div>
        ))}
      </Card>
    </div>
  );
}

function Guest({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <SimplePathway
      title="Guest Pathway"
      image={IMG.ecosystem}
      text="Guests learn the farm story, the connected food ecosystem, the airport place-based context, and how youth, growers, families, and partners move together."
      setScreen={setScreen}
    />
  );
}

function MyWorkspace({
  signIn,
  activeUser,
  setScreen,
}: {
  signIn: (role: Role, name?: string) => void;
  activeUser: EcosystemUser | null;
  setScreen: (screen: Screen) => void;
}) {
  const [name, setName] = useState("");

  const isStaff = activeUser ? ["staff", "admin", "board"].includes(activeUser.accessLevel) : false;
  const isYouth = activeUser?.role === "Youth Workforce Participant";
  const isParent = activeUser?.role === "Parent / Guardian";
  const isGrower = activeUser?.role === "Grower";
  const isMarketplace = activeUser?.role === "Marketplace Customer" || activeUser?.role === "Value-Added Producer";

  const workspaceCards: { title: string; subtitle: string; screen: Screen; show: boolean }[] = [
    {
      title: "Youth Daily Check-In",
      subtitle: "Attendance, PPE, wellness, goal, encouragement, and Start My Day.",
      screen: "youth",
      show: isYouth || isStaff,
    },
    {
      title: "Supervisor Operations Center",
      subtitle: "Attendance, PPE exceptions, support flags, assessments, parent summaries, and reports.",
      screen: "supervisor",
      show: isStaff,
    },
    {
      title: "Parent Portal",
      subtitle: "Parent-safe attendance, progress notes, messages, and achievements.",
      screen: "parent",
      show: isParent || isStaff,
    },
    {
      title: "Grower Operations Center",
      subtitle: "Weather, tasks, crop plans, grow notes, inventory, marketplace demand, and proverb.",
      screen: "grower",
      show: isGrower || isStaff,
    },
    {
      title: "Marketplace Operations",
      subtitle: "GrownBy + direct sales, text-only products, cart, orders, pickup, and fulfillment.",
      screen: "marketplace",
      show: isMarketplace || isGrower || isStaff || !activeUser,
    },
    {
      title: "Executive Reports",
      subtitle: "Program metrics, workforce status, marketplace activity, and impact reporting.",
      screen: "reports",
      show: isStaff,
    },
    {
      title: "Guest Experience",
      subtitle: "Public story, full connected food ecosystem diagram, and community pathway.",
      screen: "guest",
      show: !activeUser,
    },
    {
      title: "Registration / Profile",
      subtitle: "Create one profile once, then reuse it across every workspace.",
      screen: "registration",
      show: true,
    },
  ];

  const visibleCards = workspaceCards.filter((card) => card.show);

  const snapshot = isGrower
    ? [
        ["Weather", "Live / fallback"],
        ["Tasks Due", "4"],
        ["Inventory", "Connected"],
        ["Demand", "Marketplace"],
        ["Harvest", "Ready"],
        ["Orders", "GrownBy + Direct"],
      ]
    : isYouth
      ? [["Today", "Check in"], ["PPE", "Required"], ["Assignment", "After check-in"], ["Reflection", "End day"]]
      : isStaff
        ? [["Attendance", "Live"], ["PPE", "Exceptions"], ["Support", "Flags"], ["Reports", "Daily"]]
        : [["Access", "Choose once"], ["Profile", "Reusable"], ["Market", "Available"], ["Guest", "Open"]];

  return (
    <Card className="h-[calc(100vh-92px)] overflow-hidden">
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0">
          <div className="text-[11px] uppercase tracking-[0.32em] text-emerald-100/75">My Workspace</div>
          <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
            {activeUser ? `Welcome, ${activeUser.name}.` : "Welcome to Bronson Family Farm."}
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-white/78">
            Roles stay in the background as permissions. This page shows only the workspaces available for the person signed in.
          </p>
        </div>

        {activeUser ? (
          <>
            <div className="mt-3 shrink-0 rounded-[1.25rem] border border-emerald-200/20 bg-emerald-300/12 p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-100/75">Current Access</div>
              <div className="mt-1 text-xl font-black">{activeUser.role}</div>
              <div className="text-xs text-white/70">Access level: {activeUser.accessLevel}</div>
            </div>

            <div className="mt-3 grid shrink-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleCards.map((card) => (
                <button
                  key={card.title}
                  onClick={() => setScreen(card.screen)}
                  className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 text-left transition hover:bg-emerald-300 hover:text-black"
                >
                  <div className="text-lg font-black">{card.title}</div>
                  <div className="mt-2 text-sm leading-5 opacity-85">{card.subtitle}</div>
                </button>
              ))}
            </div>

            <div className="mt-3 shrink-0 rounded-[1.25rem] border border-white/10 bg-black/32 p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-100/75">
                {isGrower ? "Today's Grower Snapshot" : isYouth ? "Youth Daily Snapshot" : isStaff ? "Supervisor Snapshot" : "Workspace Snapshot"}
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {snapshot.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/10 p-2.5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">{label}</div>
                    <div className="mt-1 text-sm font-black">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 min-h-0 flex-1 rounded-[1.25rem] border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-black">First-Time / Testing Access</div>
            <div className="mt-3 max-w-xl">
              <Field label="Name for this session" value={name} onChange={setName} placeholder="Example: Supervisor Aide" />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => signIn(role, name)}
                  className="rounded-xl border border-white/10 bg-white/10 p-3 text-left transition hover:bg-emerald-300 hover:text-black"
                >
                  <div className="text-base font-black">{role}</div>
                  <div className="mt-1 text-xs opacity-85">Opens: {routeForRole(role)}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function Registration({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [role, setRole] = useState<Role>(activeUser?.role || "Youth Workforce Participant");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [crew, setCrew] = useState("Crew A");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [programGoal, setProgramGoal] = useState("");
  const [saved, setSaved] = useState("");

  const save = async () => {
    setSaved("Saving...");

    const profileType = roleToProfileType(role);
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanPreferred = preferredName.trim();
    const fullName = `${cleanPreferred || cleanFirst} ${cleanLast}`.trim();

    if (!cleanFirst || !cleanLast) {
      setSaved("Please enter first and last name before saving.");
      return;
    }

    const profile: MasterProfile = {
      id: uuid(),
      profile_type: profileType,
      first_name: cleanFirst,
      last_name: cleanLast,
      preferred_name: cleanPreferred,
      email: email.trim(),
      phone: phone.trim(),
      active: true,
      created_at: new Date().toISOString(),
    };

    const registration: EcosystemRegistration = {
      id: profile.id,
      role,
      full_name: fullName,
      first_name: cleanFirst,
      last_name: cleanLast,
      preferred_name: cleanPreferred,
      email: email.trim(),
      phone: phone.trim(),
      profile_type: profileType,
      active: true,
      created_at: profile.created_at,
    };

    const registrationResult = await insertRow("ecosystem_registrations", REGISTRATION_KEY, registration);
    const profileResult = await insertRow("profiles", PROFILE_KEY, profile);
    const errors: string[] = [];

    if (!registrationResult.ok) errors.push(`ecosystem_registrations: ${String((registrationResult.error as any)?.message || registrationResult.error)}`);
    if (!profileResult.ok) errors.push(`profiles: ${String((profileResult.error as any)?.message || profileResult.error)}`);

    if (profileType === "youth") {
      const youth: YouthRegistration = {
        id: uuid(),
        profile_id: profile.id,
        participant_id: `BFF-${Math.floor(100000 + Math.random() * 899999)}`,
        age_range: "14-18",
        crew,
        guardian_name: guardianName.trim(),
        guardian_phone: guardianPhone.trim(),
        guardian_email: guardianEmail.trim(),
        emergency_contact: guardianPhone.trim(),
        medical_notes: medicalNotes.trim(),
        transportation_plan: "Parent/guardian pickup",
        program_goal: programGoal.trim(),
      };
      const youthResult = await insertRow("youth_participants", YOUTH_KEY, youth);
      if (!youthResult.ok) errors.push(`youth_participants: ${String((youthResult.error as any)?.message || youthResult.error)}`);
    }

    if (errors.length) {
      setSaved(`Saved locally, but Supabase did not accept all records. ${errors.join(" | ")}`);
      return;
    }

    setSaved("Saved to Supabase. This profile is now available for supervisor autofill.");
  };

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Registration Center</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Create the profile once. Reuse it everywhere.</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <SelectField label="Role / Registration Type" value={role} onChange={(v) => setRole(v as Role)} options={roles} />
        <Field label="Preferred Name" value={preferredName} onChange={setPreferredName} />
        <Field label="First Name" value={firstName} onChange={setFirstName} />
        <Field label="Last Name" value={lastName} onChange={setLastName} />
        <Field label="Email" value={email} onChange={setEmail} />
        <Field label="Phone" value={phone} onChange={setPhone} />
      </div>

      {role === "Youth Workforce Participant" && (
        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <div className="text-lg font-black">Youth Workforce Details</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SelectField label="Crew" value={crew} onChange={setCrew} options={["Crew A", "Crew B", "Crew C", "Crew D", "Not assigned"]} />
            <Field label="Guardian Name" value={guardianName} onChange={setGuardianName} />
            <Field label="Guardian Phone" value={guardianPhone} onChange={setGuardianPhone} />
            <Field label="Guardian Email" value={guardianEmail} onChange={setGuardianEmail} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextArea label="Medical / allergy notes" value={medicalNotes} onChange={setMedicalNotes} />
            <TextArea label="Youth program goal" value={programGoal} onChange={setProgramGoal} />
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={save} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Registration</button>
        <button onClick={() => setScreen("supervisor")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Go to Supervisor Center</button>
      </div>
      {saved && <Notice text={saved} />}
    </Card>
  );
}

function YouthScreen({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [profiles, setProfiles] = useState<MasterProfile[]>(() => safeRead<MasterProfile[]>(PROFILE_KEY, []));
  const [youth, setYouth] = useState<YouthRegistration[]>(() => safeRead<YouthRegistration[]>(YOUTH_KEY, []));
  const [wellness, setWellness] = useState<WellnessCheckIn[]>(() => safeRead<WellnessCheckIn[]>(WELLNESS_KEY, []));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []));
  const [encouragements, setEncouragements] = useState<YouthEncouragement[]>(() => safeRead<YouthEncouragement[]>(YOUTH_ENCOURAGEMENT_KEY, DEFAULT_YOUTH_ENCOURAGEMENTS));

  useEffect(() => {
    const load = async () => {
      setProfiles(await loadSupabaseRows<MasterProfile>("profiles", PROFILE_KEY));
      setYouth(await loadSupabaseRows<YouthRegistration>("youth_participants", YOUTH_KEY));
      setWellness(await loadSupabaseRows<WellnessCheckIn>("wellness_checkins", WELLNESS_KEY));
      setAttendance(await loadSupabaseRows<AttendanceRecord>("attendance", ATTENDANCE_KEY));
      const loadedEncouragements = await loadSupabaseRows<YouthEncouragement>("youth_encouragements", YOUTH_ENCOURAGEMENT_KEY);
      setEncouragements(loadedEncouragements.length ? loadedEncouragements : DEFAULT_YOUTH_ENCOURAGEMENTS);
    };
    void load();
  }, []);

  const currentYouth = youth[0];
  const currentProfile = profiles.find((p) => p.id === currentYouth?.profile_id);
  const name = activeUser?.name || profileName(currentProfile) || "Cultivator";
  const today = todayISO();
  const todayAttendance = currentYouth ? attendance.find((a) => a.participant_id === currentYouth.participant_id && a.date === today) : undefined;
  const todayWellness = currentYouth ? wellness.find((w) => w.profile_id === currentYouth.profile_id && w.created_at.slice(0, 10) === today) : undefined;
  const encouragement = encouragementForYouth(encouragements, currentYouth?.participant_id || activeUser?.id || "youth", today);

  const ActionCard = ({ title, text, button, target, primary = false }: { title: string; text: string; button: string; target: Screen; primary?: boolean }) => {
    const openTarget = (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      setScreen(target);
    };

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={openTarget}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openTarget(e as unknown as React.MouseEvent);
        }}
        className={`rounded-[1.5rem] border p-4 text-left transition hover:-translate-y-0.5 ${primary ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/18"}`}
      >
        <div className="text-lg font-black leading-tight">{title}</div>
        <p className="mt-2 min-h-[42px] text-xs leading-5 opacity-85">{text}</p>
        <button
          type="button"
          onClick={openTarget}
          className={`mt-3 rounded-full px-4 py-2 text-xs font-black ${primary ? "bg-black text-white" : "bg-emerald-300 text-black"}`}
        >
          {button}
        </button>
      </div>
    );
  };

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Youth Workspace</div>
      <div className="mt-3 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">Good morning, {name}.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/84">
            Start your day, learn what the farm needs, see where the food is going, and share your voice before you leave.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-emerald-200/25 bg-emerald-300/14 p-4">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-100/80">Cultivator Encouragement</div>
          <div className="mt-2 text-xl font-black leading-snug text-white">{encouragement.message}</div>
          <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">Theme: {encouragement.theme.replaceAll("_", " ")}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/32 p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">Attendance</div>
          <div className="mt-1 text-xl font-black">{todayAttendance ? "Checked In" : "Not Checked In"}</div>
          <div className="mt-1 text-sm text-white/70">{todayAttendance?.check_in_time || "Press Start My Day first."}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/32 p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">PPE</div>
          <div className="mt-2 text-2xl font-black capitalize">{todayAttendance?.ppe_status?.replaceAll("_", " ") || "Pending"}</div>
          <div className="mt-1 text-sm text-white/70">Shoes, water, gloves, clothing.</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/32 p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">Readiness</div>
          <div className="mt-1 text-xl font-black">{todayWellness ? "Submitted" : "Pending"}</div>
          <div className="mt-1 text-sm text-white/70">Mood, energy, goal, support.</div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard primary title="Start My Day" text="Attendance, PPE, readiness, wellness, goal, and support request in one screen." button="Open Check-In" target="wellness" />
        <ActionCard title="Farm Information" text="See grower information: weather, daily field word, farm conditions, and field priorities." button="Open Grower Info" target="grower" />
        <ActionCard title="Marketplace Impact" text="See how food moves to customers, GrownBy, direct sales, pickups, and community access." button="Open Marketplace" target="marketplace" />
        <ActionCard title="Youth Voice" text="Share feedback, reflection, and what would make tomorrow better." button="Share Feedback" target="feedback" />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-7 text-white/84">
        Youth do not need supervisor-only buttons here. Supervisor notes, incident logs, parent summaries, and private wellness review stay in the Supervisor Center.
      </div>
    </Card>
  );
}

function SupervisorOperationsCenter({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [tab, setTab] = useState<"dashboard" | "roster" | "attendance" | "wellness" | "assessment" | "incident" | "parent" | "reports">("dashboard");
  const [profiles, setProfiles] = useState<MasterProfile[]>(() => safeRead<MasterProfile[]>(PROFILE_KEY, []));
  const [youth, setYouth] = useState<YouthRegistration[]>(() => safeRead<YouthRegistration[]>(YOUTH_KEY, []));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []));
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(() => safeRead<AssessmentRecord[]>(ASSESSMENT_KEY, []));
  const [wellness, setWellness] = useState<WellnessCheckIn[]>(() => safeRead<WellnessCheckIn[]>(WELLNESS_KEY, []));
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => safeRead<IncidentRecord[]>(INCIDENT_KEY, []));
  const [parentSummaries, setParentSummaries] = useState<ParentSummary[]>(() => safeRead<ParentSummary[]>(PARENT_SUMMARY_KEY, []));

  const refresh = async () => {
    setProfiles(await loadSupabaseRows<MasterProfile>("profiles", PROFILE_KEY));
    setYouth(await loadSupabaseRows<YouthRegistration>("youth_participants", YOUTH_KEY));
    setAttendance(await loadSupabaseRows<AttendanceRecord>("attendance", ATTENDANCE_KEY));
    setAssessments(await loadSupabaseRows<AssessmentRecord>("supervisor_assessments", ASSESSMENT_KEY));
    setWellness(await loadSupabaseRows<WellnessCheckIn>("wellness_checkins", WELLNESS_KEY));
    setIncidents(await loadSupabaseRows<IncidentRecord>("incident_logs", INCIDENT_KEY));
    setParentSummaries(await loadSupabaseRows<ParentSummary>("parent_summaries", PARENT_SUMMARY_KEY));
  };

  useEffect(() => {
    refresh();
  }, []);

  const youthRows = youth.map((y) => ({ registration: y, profile: profiles.find((p) => p.id === y.profile_id) }));
  const todayAttendance = attendance.filter((a) => a.date === todayISO());
  const supportFlags = wellness.filter((w) => w.safety_flag);
  const todayIncidents = incidents.filter((i) => i.created_at.slice(0, 10) === todayISO());

  const tabs: { key: typeof tab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "roster", label: "Youth Roster" },
    { key: "attendance", label: "Attendance / PPE" },
    { key: "wellness", label: "Wellness Review" },
    { key: "assessment", label: "Assessment" },
    { key: "incident", label: "Incident Log" },
    { key: "parent", label: "Parent Summary" },
    { key: "reports", label: "Reports" },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[310px_1fr]">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Real Supervisor Operations Center</div>
        <h1 className="mt-3 text-3xl font-black leading-tight">Morning-to-end-of-day control room.</h1>
        <div className="mt-3 grid gap-1.5">
          {tabs.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} className={`rounded-xl border px-3 py-2 text-left text-xs font-black ${tab === item.key ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white"}`}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/84">
          Supervisor access protects youth information. Parents receive progress summaries, not private raw wellness notes.
        </div>
        <button onClick={refresh} className="mt-3 w-full rounded-full border border-white/15 bg-black/35 px-4 py-2 text-sm font-black">Refresh Data</button>
      </Card>

      <div>
        {tab === "dashboard" && (
          <SupervisorDashboard
            youthCount={youth.length}
            attendanceCount={todayAttendance.length}
            supportFlags={supportFlags.length}
            incidentCount={todayIncidents.length}
            parentSummaryCount={parentSummaries.length}
            setTab={setTab}
            setScreen={setScreen}
          />
        )}
        {tab === "roster" && <YouthRosterModule youthRows={youthRows} attendance={attendance} assessments={assessments} wellness={wellness} incidents={incidents} setScreen={setScreen} setTab={setTab} />}
        {tab === "attendance" && <AttendanceTool youthRows={youthRows} activeUser={activeUser} onSaved={refresh} />}
        {tab === "wellness" && <WellnessReview wellness={wellness} profiles={profiles} />}
        {tab === "assessment" && <AssessmentTool youthRows={youthRows} activeUser={activeUser} onSaved={refresh} />}
        {tab === "incident" && <IncidentTool youthRows={youthRows} activeUser={activeUser} onSaved={refresh} />}
        {tab === "parent" && <ParentSummaryTool youthRows={youthRows} activeUser={activeUser} assessments={assessments} attendance={attendance} onSaved={refresh} />}
        {tab === "reports" && <SupervisorReports profiles={profiles} youth={youth} attendance={attendance} assessments={assessments} wellness={wellness} incidents={incidents} parentSummaries={parentSummaries} />}
      </div>
    </div>
  );
}

function SupervisorDashboard({
  youthCount,
  attendanceCount,
  supportFlags,
  incidentCount,
  parentSummaryCount,
  setTab,
  setScreen,
}: {
  youthCount: number;
  attendanceCount: number;
  supportFlags: number;
  incidentCount: number;
  parentSummaryCount: number;
  setTab: (tab: "dashboard" | "roster" | "attendance" | "wellness" | "assessment" | "incident" | "parent" | "reports") => void;
  setScreen: (screen: Screen) => void;
}) {
  const stats = [
    { title: "Youth Roster", value: youthCount, action: () => setTab("roster") },
    { title: "Today Attendance", value: attendanceCount, action: () => setTab("attendance") },
    { title: "Support Flags", value: supportFlags, action: () => setTab("wellness") },
    { title: "Today Incidents", value: incidentCount, action: () => setTab("incident") },
    { title: "Parent Summaries", value: parentSummaryCount, action: () => setTab("parent") },
  ];

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Dashboard</div>
      <h2 className="mt-3 text-4xl font-black">Orientation-day operating picture.</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <button key={stat.title} onClick={stat.action} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-left hover:bg-emerald-300 hover:text-black">
            <div className="text-4xl font-black">{stat.value}</div>
            <div className="mt-2 text-sm font-bold opacity-85">{stat.title}</div>
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          "Start day: attendance, PPE, water, assignment.",
          "During day: wellness review, safety support, incident log.",
          "End day: assessment, parent-safe summary, reports.",
        ].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/86">{item}</div>
        ))}
      </div>
    </Card>
  );
}


function YouthRosterModule({
  youthRows,
  attendance,
  assessments,
  wellness,
  incidents,
  setScreen,
  setTab,
}: {
  youthRows: { registration: YouthRegistration; profile?: MasterProfile }[];
  attendance: AttendanceRecord[];
  assessments: AssessmentRecord[];
  wellness: WellnessCheckIn[];
  incidents: IncidentRecord[];
  setScreen: (screen: Screen) => void;
  setTab: (tab: "dashboard" | "roster" | "attendance" | "wellness" | "assessment" | "incident" | "parent" | "reports") => void;
}) {
  const today = todayISO();
  const nameFor = (row: { registration: YouthRegistration; profile?: MasterProfile }) =>
    row.profile ? `${row.profile.first_name} ${row.profile.last_name}`.trim() : row.registration.participant_id;

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Youth Roster</div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black">Active youth participants.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/82">This is the supervisor-facing roster. Use it to see who is active, assigned to a crew, checked in today, and ready for assessment or parent-safe updates.</p>
        </div>
        <button onClick={() => setScreen("registration")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Add New Youth</button>
      </div>

      {youthRows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-5 text-white/84">No youth are registered yet. Add the first youth profile from Registration, then return here to manage attendance, wellness review, assessments, and parent summaries.</div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          <div className="grid grid-cols-[1.3fr_0.9fr_0.8fr_0.8fr_0.8fr_0.9fr] gap-0 bg-black/45 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-100/80">
            <div>Youth</div><div>Participant ID</div><div>Crew</div><div>Age</div><div>Today</div><div>Status</div>
          </div>
          <div className="divide-y divide-white/10">
            {youthRows.map((row) => {
              const participantId = row.registration.participant_id;
              const todayStatus = attendance.find((a) => a.participant_id === participantId && a.date === today)?.status || "not checked in";
              const lastAssessment = assessments.filter((a) => a.participant_id === participantId).sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
              const hasFlag = wellness.some((w) => w.profile_id === row.registration.profile_id && w.safety_flag) || incidents.some((i) => i.participant_id === participantId && i.urgency !== "low");
              return (
                <div key={row.registration.id} className="grid grid-cols-[1.3fr_0.9fr_0.8fr_0.8fr_0.8fr_0.9fr] items-center gap-0 px-4 py-4 text-sm text-white/88">
                  <div>
                    <div className="font-black text-white">{nameFor(row)}</div>
                    <div className="text-xs text-white/60">Guardian: {row.registration.guardian_name || "not entered"}</div>
                  </div>
                  <div>{participantId}</div>
                  <div>{row.registration.crew || "Unassigned"}</div>
                  <div>{row.registration.age_range || "—"}</div>
                  <div className="capitalize">{todayStatus.replaceAll("_", " ")}</div>
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${hasFlag ? "bg-amber-300 text-black" : "bg-emerald-300 text-black"}`}>{hasFlag ? "Review" : "Clear"}</span>
                    {lastAssessment && <div className="mt-1 text-xs text-white/60">Safety {lastAssessment.safety}/5</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => setTab("attendance")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Take Attendance / PPE</button>
        <button onClick={() => setTab("assessment")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Daily Assessment</button>
        <button onClick={() => setTab("parent")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Parent Summary</button>
      </div>
    </Card>
  );
}

function AttendanceTool({
  youthRows,
  activeUser,
  onSaved,
}: {
  youthRows: { registration: YouthRegistration; profile?: MasterProfile }[];
  activeUser: EcosystemUser | null;
  onSaved: () => void;
}) {
  const [participantId, setParticipantId] = useState(youthRows[0]?.registration.participant_id || "");
  const [status, setStatus] = useState<AttendanceRecord["status"]>("present");
  const [ppe, setPpe] = useState<AttendanceRecord["ppe_status"]>("complete");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const save = async () => {
    const row: AttendanceRecord = {
      id: uuid(),
      participant_id: participantId,
      supervisor_id: activeUser?.id,
      date: todayISO(),
      check_in_time: nowLabel(),
      status,
      ppe_status: ppe,
      qr_method: "supervisor",
      notes,
      created_at: new Date().toISOString(),
    };
    await insertRow("attendance", ATTENDANCE_KEY, row);
    setMessage("Attendance and PPE saved.");
    onSaved();
  };

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Attendance / PPE</div>
      <h2 className="mt-3 text-4xl font-black">Check youth in and document readiness.</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <SelectField label="Youth Participant" value={participantId} onChange={setParticipantId} options={youthRows.map((row) => row.registration.participant_id)} />
        <SelectField label="Attendance Status" value={status} onChange={(v) => setStatus(v as AttendanceRecord["status"])} options={["present", "absent", "late", "excused"]} />
        <SelectField label="PPE / Readiness" value={ppe} onChange={(v) => setPpe(v as AttendanceRecord["ppe_status"])} options={["complete", "missing_gloves", "missing_shoes", "missing_water", "needs_review"]} />
        <TextArea label="Notes" value={notes} onChange={setNotes} />
      </div>
      <button onClick={save} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Attendance</button>
      {message && <Notice text={message} />}
    </Card>
  );
}

function WellnessReview({ wellness, profiles }: { wellness: WellnessCheckIn[]; profiles: MasterProfile[] }) {
  const flags = wellness.filter((w) => w.safety_flag);
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Wellness Review</div>
      <h2 className="mt-3 text-4xl font-black">Staff-facing support awareness.</h2>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-white/80">
        This is not a diagnosis. It is a staff-only way to notice urgent need, isolation, food insecurity, stress, or safety concerns.
      </p>
      <div className="mt-6 grid gap-3">
        {(flags.length ? flags : wellness.slice(0, 8)).map((w) => (
          <div key={w.id} className={`rounded-2xl border p-4 ${w.safety_flag ? "border-red-200/40 bg-red-500/18" : "border-white/10 bg-white/10"}`}>
            <div className="flex flex-wrap justify-between gap-2">
              <div className="font-black">{profileName(profiles.find((p) => p.id === w.profile_id))}</div>
              <div className="text-xs font-black uppercase tracking-[0.2em]">{w.checkin_type} • {new Date(w.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-sm leading-6 text-white/84">
              Mood: {w.mood || "n/a"} • Energy: {w.energy || "n/a"} • Hope: {w.hope_score ?? "n/a"} • Trusted adult: {w.trusted_adult_score ?? "n/a"} • Stress: {w.stress_score ?? "n/a"}
            </div>
            {(w.support_needed || w.private_note) && <div className="mt-3 rounded-xl bg-black/28 p-3 text-sm leading-6">{w.support_needed} {w.private_note}</div>}
          </div>
        ))}
      </div>
    </Card>
  );
}

function AssessmentTool({
  youthRows,
  activeUser,
  onSaved,
}: {
  youthRows: { registration: YouthRegistration; profile?: MasterProfile }[];
  activeUser: EcosystemUser | null;
  onSaved: () => void;
}) {
  const [participantId, setParticipantId] = useState(youthRows[0]?.registration.participant_id || "");
  const [safety, setSafety] = useState(3);
  const [teamwork, setTeamwork] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [responsibility, setResponsibility] = useState(3);
  const [initiative, setInitiative] = useState(3);
  const [problemSolving, setProblemSolving] = useState(3);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const save = async () => {
    const row: AssessmentRecord = {
      id: uuid(),
      participant_id: participantId,
      supervisor_id: activeUser?.id,
      date: todayISO(),
      safety,
      teamwork,
      communication,
      responsibility,
      initiative,
      problem_solving: problemSolving,
      notes,
      created_at: new Date().toISOString(),
    };
    await insertRow("supervisor_assessments", ASSESSMENT_KEY, row);
    setMessage("Supervisor assessment saved.");
    onSaved();
  };

  const Slider = ({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) => (
    <label className="block rounded-2xl border border-white/10 bg-white/10 p-4">
      <div className="flex justify-between text-sm font-black"><span>{label}</span><span>{value}/5</span></div>
      <input className="mt-3 w-full" type="range" min={1} max={5} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </label>
  );

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Daily Assessment</div>
      <h2 className="mt-3 text-4xl font-black">Track skill growth, responsibility, and readiness.</h2>
      <div className="mt-6">
        <SelectField label="Youth Participant" value={participantId} onChange={setParticipantId} options={youthRows.map((row) => row.registration.participant_id)} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Slider label="Safety" value={safety} setValue={setSafety} />
        <Slider label="Teamwork" value={teamwork} setValue={setTeamwork} />
        <Slider label="Communication" value={communication} setValue={setCommunication} />
        <Slider label="Responsibility" value={responsibility} setValue={setResponsibility} />
        <Slider label="Initiative" value={initiative} setValue={setInitiative} />
        <Slider label="Problem Solving" value={problemSolving} setValue={setProblemSolving} />
      </div>
      <div className="mt-5">
        <TextArea label="Supervisor Notes" value={notes} onChange={setNotes} />
      </div>
      <button onClick={save} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Assessment</button>
      {message && <Notice text={message} />}
    </Card>
  );
}

function IncidentTool({
  youthRows,
  activeUser,
  onSaved,
}: {
  youthRows: { registration: YouthRegistration; profile?: MasterProfile }[];
  activeUser: EcosystemUser | null;
  onSaved: () => void;
}) {
  const [participantId, setParticipantId] = useState(youthRows[0]?.registration.participant_id || "");
  const [incidentType, setIncidentType] = useState<IncidentRecord["incident_type"]>("wellness");
  const [urgency, setUrgency] = useState<IncidentRecord["urgency"]>("medium");
  const [summary, setSummary] = useState("");
  const [action, setAction] = useState("");
  const [parentContacted, setParentContacted] = useState(false);
  const [message, setMessage] = useState("");

  const save = async () => {
    const row: IncidentRecord = {
      id: uuid(),
      participant_id: participantId,
      staff_id: activeUser?.id,
      incident_type: incidentType,
      urgency,
      summary,
      action_taken: action,
      parent_contacted: parentContacted,
      created_at: new Date().toISOString(),
    };
    await insertRow("incident_logs", INCIDENT_KEY, row);
    setMessage("Incident/support log saved for staff follow-up.");
    onSaved();
  };

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-red-100/75">Staff-Only Incident / Support Log</div>
      <h2 className="mt-3 text-4xl font-black">Document safety, behavior, conflict, wellness, or parent contact.</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <SelectField label="Youth Participant" value={participantId} onChange={setParticipantId} options={youthRows.map((row) => row.registration.participant_id)} />
        <SelectField label="Incident Type" value={incidentType} onChange={(v) => setIncidentType(v as IncidentRecord["incident_type"])} options={["injury", "behavior", "conflict", "wellness", "safety", "transportation", "parent_contact", "other"]} />
        <SelectField label="Urgency" value={urgency} onChange={(v) => setUrgency(v as IncidentRecord["urgency"])} options={["low", "medium", "high", "emergency"]} />
        <label className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 font-black">
          <input type="checkbox" checked={parentContacted} onChange={(e) => setParentContacted(e.target.checked)} />
          Parent / guardian contacted
        </label>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TextArea label="What happened?" value={summary} onChange={setSummary} />
        <TextArea label="Action taken / next step" value={action} onChange={setAction} />
      </div>
      <button onClick={save} className="mt-6 rounded-full bg-red-300 px-7 py-4 font-black text-black">Save Staff Log</button>
      {message && <Notice text={message} />}
    </Card>
  );
}

function ParentSummaryTool({
  youthRows,
  activeUser,
  assessments,
  attendance,
  onSaved,
}: {
  youthRows: { registration: YouthRegistration; profile?: MasterProfile }[];
  activeUser: EcosystemUser | null;
  assessments: AssessmentRecord[];
  attendance: AttendanceRecord[];
  onSaved: () => void;
}) {
  const [participantId, setParticipantId] = useState(youthRows[0]?.registration.participant_id || "");
  const [strengths, setStrengths] = useState("");
  const [progress, setProgress] = useState("");
  const [needs, setNeeds] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [message, setMessage] = useState("");

  const selectedYouth = youthRows.find((row) => row.registration.participant_id === participantId);
  const participantAssessments = assessments.filter((a) => a.participant_id === participantId);
  const participantAttendance = attendance.filter((a) => a.participant_id === participantId);
  const latestAssessment = participantAssessments[0];

  const generated = useMemo(() => {
    const name = profileName(selectedYouth?.profile);
    const presentDays = participantAttendance.filter((a) => a.status === "present" || a.status === "late").length;
    const safety = latestAssessment?.safety ? `Safety score today: ${latestAssessment.safety}/5.` : "Safety progress is being observed.";
    return `${name} participated in the Bronson Family Farm Youth Workforce Program. Attendance records show ${presentDays} active day(s) recorded. ${safety} Today’s parent-safe update: ${progress || "The participant continued building responsibility, teamwork, and outdoor work readiness."} Strength noticed: ${strengths || "continued participation and willingness to learn."} Next area of support: ${needs || "continued encouragement, punctuality, hydration, PPE readiness, and teamwork."}`;
  }, [selectedYouth, participantAttendance, latestAssessment, progress, strengths, needs]);

  const save = async () => {
    const row: ParentSummary = {
      id: uuid(),
      participant_id: participantId,
      supervisor_id: activeUser?.id,
      date: todayISO(),
      strengths,
      progress,
      needs,
      parent_safe_message: generated,
      private_staff_notes: privateNotes,
      created_at: new Date().toISOString(),
    };
    await insertRow("parent_summaries", PARENT_SUMMARY_KEY, row);
    setMessage("Parent-safe summary saved.");
    onSaved();
  };

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Parent-Safe Summary Generator</div>
      <h2 className="mt-3 text-4xl font-black">Share progress without exposing private youth reflection.</h2>
      <div className="mt-6">
        <SelectField label="Youth Participant" value={participantId} onChange={setParticipantId} options={youthRows.map((row) => row.registration.participant_id)} />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TextArea label="Strengths to share with parent" value={strengths} onChange={setStrengths} />
        <TextArea label="Progress today" value={progress} onChange={setProgress} />
        <TextArea label="Support / next goal parent can encourage" value={needs} onChange={setNeeds} />
        <TextArea label="Private staff notes — not parent-facing" value={privateNotes} onChange={setPrivateNotes} />
      </div>
      <div className="mt-5 rounded-2xl border border-emerald-200/25 bg-emerald-300/12 p-4">
        <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100">Generated Parent Message</div>
        <p className="mt-3 text-sm leading-7 text-white/88">{generated}</p>
      </div>
      <button onClick={save} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Parent Summary</button>
      {message && <Notice text={message} />}
    </Card>
  );
}

function SupervisorReports({
  profiles,
  youth,
  attendance,
  assessments,
  wellness,
  incidents,
  parentSummaries,
}: {
  profiles: MasterProfile[];
  youth: YouthRegistration[];
  attendance: AttendanceRecord[];
  assessments: AssessmentRecord[];
  wellness: WellnessCheckIn[];
  incidents: IncidentRecord[];
  parentSummaries: ParentSummary[];
}) {
  const today = todayISO();
  const todayAttendance = attendance.filter((a) => a.date === today);
  const present = todayAttendance.filter((a) => a.status === "present").length;
  const late = todayAttendance.filter((a) => a.status === "late").length;
  const absent = todayAttendance.filter((a) => a.status === "absent").length;
  const supportFlags = wellness.filter((w) => w.safety_flag).length;
  const avgSafety = assessments.length ? (assessments.reduce((sum, a) => sum + a.safety, 0) / assessments.length).toFixed(1) : "n/a";

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Reports</div>
      <h2 className="mt-3 text-4xl font-black">Supervisor report snapshot.</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-4">
        {[
          ["Youth Registered", youth.length],
          ["Profiles", profiles.length],
          ["Present Today", present],
          ["Late Today", late],
          ["Absent Today", absent],
          ["Assessments", assessments.length],
          ["Avg Safety", avgSafety],
          ["Support Flags", supportFlags],
          ["Incident Logs", incidents.length],
          ["Parent Summaries", parentSummaries.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/10 p-3">
            <div className="text-2xl font-black">{value}</div>
            <div className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-5 text-sm leading-7 text-white/84">
        This report is designed for launch operations, staff briefings, parent-safe updates, partner accountability, and future funder reporting.
      </div>
    </Card>
  );
}

function WellnessScreen({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [profiles, setProfiles] = useState<MasterProfile[]>(() => safeRead<MasterProfile[]>(PROFILE_KEY, []));
  const [youth, setYouth] = useState<YouthRegistration[]>(() => safeRead<YouthRegistration[]>(YOUTH_KEY, []));
  const [participantId, setParticipantId] = useState("");
  const [mood, setMood] = useState("Select mood");
  const [energy, setEnergy] = useState("Select energy");
  const [sleep, setSleep] = useState("Select sleep");
  const [breakfast, setBreakfast] = useState("Select food status");
  const [hope, setHope] = useState(3);
  const [belonging, setBelonging] = useState(3);
  const [trustedAdult, setTrustedAdult] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [stress, setStress] = useState(3);
  const [closedToeShoes, setClosedToeShoes] = useState(false);
  const [waterBottle, setWaterBottle] = useState(false);
  const [workGloves, setWorkGloves] = useState(false);
  const [appropriateClothing, setAppropriateClothing] = useState(false);
  const [sunscreen, setSunscreen] = useState(false);
  const [hatWeatherProtection, setHatWeatherProtection] = useState(false);
  const [equipmentNeeded, setEquipmentNeeded] = useState("None");
  const [ppeReviewed, setPpeReviewed] = useState(false);
  const [dailyGoal, setDailyGoal] = useState("");
  const [support, setSupport] = useState("");
  const [privateNote, setPrivateNote] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [encouragements, setEncouragements] = useState<YouthEncouragement[]>(() => safeRead<YouthEncouragement[]>(YOUTH_ENCOURAGEMENT_KEY, DEFAULT_YOUTH_ENCOURAGEMENTS));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      const loadedProfiles = await loadSupabaseRows<MasterProfile>("profiles", PROFILE_KEY);
      const loadedYouth = await loadSupabaseRows<YouthRegistration>("youth_participants", YOUTH_KEY);
      const loadedEncouragements = await loadSupabaseRows<YouthEncouragement>("youth_encouragements", YOUTH_ENCOURAGEMENT_KEY);
      setProfiles(loadedProfiles);
      setYouth(loadedYouth);
      setEncouragements(loadedEncouragements.length ? loadedEncouragements : DEFAULT_YOUTH_ENCOURAGEMENTS);
      if (!participantId && loadedYouth[0]?.participant_id) setParticipantId(loadedYouth[0].participant_id);
    };
    void load();
  }, []);

  const youthForActiveUser = youth.find((y) => {
    const p = profiles.find((profile) => profile.id === y.profile_id);
    const activeName = (activeUser?.name || "").trim().toLowerCase();
    const profileFullName = p ? `${p.first_name} ${p.last_name}`.trim().toLowerCase() : "";
    return activeUser?.role === "Youth Workforce Participant" && activeName && profileFullName && activeName === profileFullName;
  });
  const selectedYouth = youthForActiveUser || youth.find((y) => y.participant_id === participantId) || youth[0];
  const selectedProfile = profiles.find((p) => p.id === selectedYouth?.profile_id);
  const profileId = selectedYouth?.profile_id || activeUser?.id || "anonymous";
  const checkinDate = currentTime.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const checkinTime = currentTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const selectedEncouragement = encouragementForYouth(encouragements, selectedYouth?.participant_id || participantId, currentTime.toISOString().slice(0, 10));
  const allRequiredPPE = closedToeShoes && waterBottle && workGloves && appropriateClothing;
  const readinessStatus = allRequiredPPE ? "Ready for assignment" : "Hold for supervisor review";
  const requiredComplete = Boolean(
    selectedYouth?.participant_id &&
    ppeReviewed &&
    mood !== "Select mood" &&
    energy !== "Select energy" &&
    sleep !== "Select sleep" &&
    breakfast !== "Select food status" &&
    dailyGoal.trim().length > 0
  );

  const safetyFlag =
    hope <= 1 ||
    trustedAdult <= 1 ||
    stress >= 5 ||
    !allRequiredPPE ||
    /suicide|kill myself|hurt myself|overdose|drugs|unsafe|abuse|homeless|depressed|depression/i.test(`${support} ${privateNote}`);

  const checkboxClass = "flex min-h-[34px] items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-black";

  const save = async () => {
    if (saving) return;
    if (!selectedYouth?.participant_id) {
      setMessage("No youth participant is connected to this login. Register the youth profile before starting the day.");
      return;
    }
    if (!requiredComplete) {
      setMessage("Complete the required questions first: PPE review, mood, energy, sleep, food today, and daily goal. Attendance will not save until those are complete.");
      return;
    }

    setSaving(true);
    setMessage("Saving attendance, PPE, and readiness...");

    try {
      const now = new Date();
      const iso = now.toISOString();
      const date = iso.slice(0, 10);
      const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
      const ppeStatus: AttendanceRecord["ppe_status"] = allRequiredPPE ? "complete" : !workGloves ? "missing_gloves" : !closedToeShoes ? "missing_shoes" : !waterBottle ? "missing_water" : "needs_review";

      const attendanceRow: AttendanceRecord = {
        id: uuid(),
        participant_id: selectedYouth.participant_id,
        supervisor_id: activeUser?.id,
        date,
        check_in_time: time,
        status: "present",
        ppe_status: ppeStatus,
        qr_method: "manual",
        notes: `${readinessStatus}. Encouragement: ${selectedEncouragement.message} ${dailyGoal ? `Goal: ${dailyGoal}. ` : ""}${equipmentNeeded && equipmentNeeded !== "None" ? `Equipment needed: ${equipmentNeeded}.` : ""}`,
        created_at: iso,
      };

      const ppeRow: PPECheckIn = {
        id: uuid(),
        participant_id: selectedYouth.participant_id,
        profile_id: profileId,
        checkin_date: date,
        checkin_time: time,
        closed_toe_shoes: closedToeShoes,
        water_bottle: waterBottle,
        work_gloves: workGloves,
        appropriate_clothing: appropriateClothing,
        sunscreen,
        hat_weather_protection: hatWeatherProtection,
        equipment_needed: equipmentNeeded,
        ready_for_assignment: allRequiredPPE,
        notes: dailyGoal,
        created_at: iso,
      };

      const wellnessRow: WellnessCheckIn = {
        id: uuid(),
        profile_id: profileId,
        profile_type: "youth",
        checkin_type: "morning",
        mood,
        energy,
        sleep,
        breakfast,
        hope_score: hope,
        belonging_score: belonging,
        trusted_adult_score: trustedAdult,
        confidence_score: confidence,
        stress_score: stress,
        support_needed: `${support.trim()}${dailyGoal.trim() ? ` | Goal: ${dailyGoal.trim()}` : ""}`.trim(),
        private_note: privateNote.trim(),
        safety_flag: safetyFlag,
        created_at: iso,
      };

      const [attendanceResult, ppeResult, wellnessResult] = await Promise.all([
        insertRow("attendance", ATTENDANCE_KEY, attendanceRow),
        insertRow("ppe_checkins", PPE_KEY, ppeRow),
        insertRow("wellness_checkins", WELLNESS_KEY, wellnessRow),
      ]);

      const errors: string[] = [];
      if (!attendanceResult.ok) errors.push(`attendance: ${String((attendanceResult.error as any)?.message || attendanceResult.error)}`);
      if (!ppeResult.ok) errors.push(`ppe_checkins: ${String((ppeResult.error as any)?.message || ppeResult.error)}`);
      if (!wellnessResult.ok) errors.push(`wellness_checkins: ${String((wellnessResult.error as any)?.message || wellnessResult.error)}`);

      if (errors.length) {
        setMessage(`Saved on this device, but Supabase rejected part of the check-in. ${errors.join(" | ")}`);
        return;
      }

      setMessage(
        allRequiredPPE
          ? `Start My Day saved. ${selectedYouth.participant_id} checked in at ${time}. Attendance, PPE, and readiness are recorded.`
          : `Check-in saved at ${time}. PPE is incomplete, so supervisor review is required before assignment.`
      );

      window.setTimeout(() => setScreen("myDayStatus"), 650);
    } catch (error) {
      console.error("Start My Day save failed:", error);
      setMessage("The Start My Day button ran, but an app error stopped the live save. Check Console for the exact error.");
    } finally {
      setSaving(false);
    }
  };

  const runStartMyDay = (e?: React.MouseEvent | React.PointerEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    void save();
  };

  const Toggle = ({ label, checked, setChecked }: { label: string; checked: boolean; setChecked: (v: boolean) => void }) => (
    <label className={checkboxClass}>
      <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="h-5 w-5" />
      <span>{label}</span>
    </label>
  );

  const Slider = ({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) => (
    <label className="rounded-xl border border-white/10 bg-white/10 p-2">
      <div className="flex justify-between text-[11px] font-black leading-tight"><span>{label}</span><span>{value}/5</span></div>
      <input className="mt-1 w-full" type="range" min={1} max={5} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </label>
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Youth Morning Readiness Check-In</div>
          <h1 className="mt-1 text-3xl font-black md:text-4xl">Start My Day</h1>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-white/78">Attendance, PPE, wellness, goal, and support needs are recorded together.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/12 p-3 text-right">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/75">Check-In Time</div>
          <div className="mt-1 text-xl font-black">{checkinTime}</div>
          <div className="text-xs font-bold text-white/75">{checkinDate}</div>
        </div>
      </div>

      <div className="mt-3 rounded-[1.25rem] border border-emerald-200/25 bg-emerald-300/14 p-3">
        <div className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-100/80">Cultivator Encouragement</div>
        <div className="mt-1 text-base font-black leading-snug text-white">{selectedEncouragement.message}</div>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">Theme: {selectedEncouragement.theme.replaceAll("_", " ")}</div>
      </div>

      <div className="mt-3 grid gap-2 lg:grid-cols-[0.95fr_0.95fr_1.1fr]">
        <div className="rounded-[1.25rem] border border-white/10 bg-black/28 p-3">
          <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100/75">Identity + Attendance</div>
          <div className="mt-2 grid gap-2">
            <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-xs leading-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">This youth only</div>
              <div className="mt-1 font-black text-white">{profileName(selectedProfile)}</div>
              <div className="text-white/70">Participant ID: {selectedYouth?.participant_id || "No youth connected"}</div>
              <div className="text-white/70">Crew: {selectedYouth?.crew || "Unassigned"}</div>
              <div className="mt-2 rounded-full bg-black/35 px-3 py-2 text-center text-[11px] font-black text-white/85">
                Attendance saves only after all required questions are complete.
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-white/10 bg-black/28 p-3">
          <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100/75">PPE Check</div>
          <div className="mt-2 grid gap-1.5">
            <Toggle label="Closed-toe shoes / boots" checked={closedToeShoes} setChecked={setClosedToeShoes} />
            <Toggle label="Water bottle" checked={waterBottle} setChecked={setWaterBottle} />
            <Toggle label="Work gloves" checked={workGloves} setChecked={setWorkGloves} />
            <Toggle label="Appropriate outdoor clothing" checked={appropriateClothing} setChecked={setAppropriateClothing} />
          </div>
          <div className="mt-2 grid gap-1.5 md:grid-cols-2">
            <Toggle label="Sunscreen" checked={sunscreen} setChecked={setSunscreen} />
            <Toggle label="Hat / weather protection" checked={hatWeatherProtection} setChecked={setHatWeatherProtection} />
          </div>
          <div className={`mt-2 rounded-xl p-2 text-center text-xs font-black ${allRequiredPPE ? "bg-emerald-300/85 text-black" : "bg-amber-300/85 text-black"}`}>PPE Status: {readinessStatus}</div>
          <label className="mt-2 flex min-h-[34px] items-center gap-2 rounded-xl border border-emerald-200/20 bg-emerald-300/10 px-3 py-2 text-xs font-black">
            <input type="checkbox" checked={ppeReviewed} onChange={(e) => setPpeReviewed(e.target.checked)} className="h-5 w-5" />
            <span>I reviewed my PPE honestly.</span>
          </label>
        </div>

        <div className="rounded-[1.25rem] border border-white/10 bg-black/28 p-3">
          <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100/75">Readiness + Support</div>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <SelectField label="Mood" value={mood} onChange={setMood} options={["Select mood", "Great", "Good", "Okay", "Tired", "Sad", "Angry", "Worried", "Overwhelmed"]} />
            <SelectField label="Energy" value={energy} onChange={setEnergy} options={["Select energy", "High", "Medium", "Low", "Very low"]} />
            <SelectField label="Sleep" value={sleep} onChange={setSleep} options={["Select sleep", "Good", "Okay", "Poor", "No sleep"]} />
            <SelectField label="Food today" value={breakfast} onChange={setBreakfast} options={["Select food status", "Yes", "No", "Not enough", "Prefer not to say"]} />
          </div>
          <div className="mt-2 grid gap-1.5 md:grid-cols-5">
            <Slider label="Hope" value={hope} setValue={setHope} />
            <Slider label="Belonging" value={belonging} setValue={setBelonging} />
            <Slider label="Trusted Adult" value={trustedAdult} setValue={setTrustedAdult} />
            <Slider label="Confidence" value={confidence} setValue={setConfidence} />
            <Slider label="Stress" value={stress} setValue={setStress} />
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-4">
        <Field label="Equipment Needed" value={equipmentNeeded} onChange={setEquipmentNeeded} placeholder="None, gloves, water bottle, etc." />
        <label className="block md:col-span-1">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">Daily Goal</span>
          <textarea value={dailyGoal} placeholder="Goal for today" onChange={(e) => setDailyGoal(e.target.value)} rows={2} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-2 text-white outline-none placeholder:text-white/35 focus:border-emerald-200" />
        </label>
        <label className="block md:col-span-1">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">Supervisor Support</span>
          <textarea value={support} placeholder="Optional" onChange={(e) => setSupport(e.target.value)} rows={2} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-2 text-white outline-none placeholder:text-white/35 focus:border-emerald-200" />
        </label>
        <label className="block md:col-span-1">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">Private Staff Note</span>
          <textarea value={privateNote} placeholder="Approved staff only" onChange={(e) => setPrivateNote(e.target.value)} rows={2} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-2 text-white outline-none placeholder:text-white/35 focus:border-emerald-200" />
        </label>
      </div>

      {!requiredComplete && <Notice text="Complete required questions before check-in: PPE review, mood, energy, sleep, food today, and daily goal." />}
      {safetyFlag && <Notice text="Support or readiness flag detected. Approved staff should review before work assignments are issued." />}
      <button
        type="button"
        onClick={runStartMyDay}
        disabled={saving || !requiredComplete}
        className="mt-3 w-full rounded-full bg-emerald-300 px-7 py-3 text-base font-black text-black disabled:opacity-60"
      >
        {saving ? "Saving..." : requiredComplete ? "Start My Day" : "Complete Required Questions"}
      </button>
      {message && <Notice text={message} />}
    </Card>
  );
}


function MyDayStatus({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [profiles, setProfiles] = useState<MasterProfile[]>(() => safeRead<MasterProfile[]>(PROFILE_KEY, []));
  const [youth, setYouth] = useState<YouthRegistration[]>(() => safeRead<YouthRegistration[]>(YOUTH_KEY, []));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []));
  const [wellness, setWellness] = useState<WellnessCheckIn[]>(() => safeRead<WellnessCheckIn[]>(WELLNESS_KEY, []));
  const [ppeRows, setPpeRows] = useState<any[]>(() => safeRead<any[]>(PPE_KEY, []));

  useEffect(() => {
    const load = async () => {
      setProfiles(await loadSupabaseRows<MasterProfile>("profiles", PROFILE_KEY));
      setYouth(await loadSupabaseRows<YouthRegistration>("youth_participants", YOUTH_KEY));
      setAttendance(await loadSupabaseRows<AttendanceRecord>("attendance", ATTENDANCE_KEY));
      setWellness(await loadSupabaseRows<WellnessCheckIn>("wellness_checkins", WELLNESS_KEY));
      setPpeRows(await loadSupabaseRows<any>("ppe_checkins", PPE_KEY));
    };
    void load();
  }, []);

  const today = todayISO();
  const selectedYouth = youth[0];
  const selectedProfile = profiles.find((p) => p.id === selectedYouth?.profile_id);
  const participantId = selectedYouth?.participant_id || "No participant selected";
  const todayAttendance = attendance.find((a) => a.participant_id === participantId && a.date === today);
  const todayWellness = wellness.find((w) => w.profile_id === selectedYouth?.profile_id && w.created_at.slice(0, 10) === today);
  const todayPpe = ppeRows.find((p) => p.participant_id === participantId && String(p.checkin_date || p.date || p.created_at || "").slice(0, 10) === today);
  const ready = todayAttendance && todayPpe && todayWellness && todayAttendance.ppe_status === "complete";

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">My Day Status</div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black md:text-6xl">You are checked in.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/82">
            This is your next screen after Start My Day. Stay here until your supervisor gives the crew assignment.
          </p>
        </div>
        <div className={`rounded-2xl px-5 py-4 text-center font-black ${ready ? "bg-emerald-300 text-black" : "bg-amber-300 text-black"}`}>
          {ready ? "READY FOR ASSIGNMENT" : "SUPERVISOR REVIEW"}
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">Participant</div>
          <div className="mt-2 text-xl font-black">{profileName(selectedProfile)}</div>
          <div className="mt-1 text-sm text-white/70">{participantId}</div>
          <div className="text-sm text-white/70">{selectedYouth?.crew || "Crew not assigned"}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">Attendance</div>
          <div className="mt-2 text-xl font-black capitalize">{todayAttendance?.status || "Not recorded"}</div>
          <div className="mt-1 text-sm text-white/70">{todayAttendance?.check_in_time || "No time recorded"}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">PPE</div>
          <div className="mt-2 text-xl font-black capitalize">{todayAttendance?.ppe_status?.replaceAll("_", " ") || "Pending"}</div>
          <div className="mt-1 text-sm text-white/70">Shoes, water, gloves, outdoor clothing</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">Readiness</div>
          <div className="mt-2 text-xl font-black">{todayWellness ? "Submitted" : "Pending"}</div>
          <div className="mt-1 text-sm text-white/70">Mood, energy, goal, support</div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <button onClick={() => setScreen("youth")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Back to Youth Home</button>
        <button onClick={() => setScreen("grower")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">See Farm Information</button>
        <button onClick={() => setScreen("feedback")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Youth Voice / Reflection</button>
      </div>
    </Card>
  );
}

function ParentScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const summaries = safeRead<ParentSummary[]>(PARENT_SUMMARY_KEY, []);
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Parent / Guardian Portal</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Progress, encouragement, and next steps.</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80">
        Parents see attendance, accomplishments, badges, goals, and parent-safe messages. Private wellness reflections remain staff-protected.
      </p>
      <div className="mt-6 grid gap-3">
        {summaries.slice(0, 6).map((summary) => (
          <div key={summary.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-white/65">{summary.date} • {summary.participant_id}</div>
            <p className="mt-2 text-sm leading-7 text-white/88">{summary.parent_safe_message}</p>
          </div>
        ))}
        {!summaries.length && <Notice text="No parent summaries have been saved yet. Supervisors can create them in the Supervisor Operations Center." />}
      </div>
      <button onClick={() => setScreen("supervisor")} className="mt-6 rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Supervisor Center</button>
    </Card>
  );
}

const DEFAULT_MARKET_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "seed-produce-greens",
    name: "Seasonal Greens Bundle",
    category: "Produce",
    description: "Fresh chemical-free greens prepared for farm pickup while supplies last.",
    price: 6,
    unit: "bundle",
    inventory: 25,
    snap_eligible: true,
    image_url: "/images/Grow Area.png",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-produce-tomatoes",
    name: "Tomato Harvest Pack",
    category: "Produce",
    description: "Mixed tomatoes from Bronson Family Farm seasonal production.",
    price: 8,
    unit: "pack",
    inventory: 20,
    snap_eligible: true,
    image_url: "/images/SAM_0420.JPG",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-bubble-babies",
    name: "Bubble Babies Seed Roll",
    category: "Seeds & Plants",
    description: "Seed roll starter for easy planting, education, and grower supply demonstrations.",
    price: 5,
    unit: "packet",
    inventory: 100,
    snap_eligible: true,
    image_url: "/images/Seeds_Jubilee Gardens.png",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-grower-table",
    name: "Grower Marketplace Table",
    category: "Grower Marketplace",
    description: "Vendor/grower table reservation for marketplace participation and supply demonstrations.",
    price: 25,
    unit: "space",
    inventory: 12,
    snap_eligible: false,
    image_url: "/images/ConnectFoodEcosystem_withimages.png",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-value-added-sampler",
    name: "Value-Added Product Sampler",
    category: "Value-Added",
    description: "Placeholder product for approved shelf-stable or kitchen-ready value-added goods.",
    price: 10,
    unit: "item",
    inventory: 15,
    snap_eligible: false,
    image_url: "/images/large (11).jpg",
    active: true,
    created_at: new Date().toISOString(),
  },
];


function MarketplaceOperations({ activeUser, setScreen }: { activeUser: EcosystemUser | null; setScreen: (screen: Screen) => void }) {
  const [tab, setTab] = useState<"command" | "storefront" | "checkout" | "orders" | "fulfillment" | "catalog">("command");
  const [products, setProducts] = useState<MarketplaceProduct[]>(() => {
    const saved = safeRead<MarketplaceProduct[]>(MARKET_PRODUCTS_KEY, []);
    return saved.length ? saved : DEFAULT_MARKET_PRODUCTS;
  });
  const [orders, setOrders] = useState<(MarketplaceOrder & Record<string, any>)[]>(() => safeRead<(MarketplaceOrder & Record<string, any>)[]>(MARKET_ORDERS_KEY, []));
  const [orderItems, setOrderItems] = useState<MarketplaceOrderItem[]>(() => safeRead<MarketplaceOrderItem[]>(MARKET_ORDER_ITEMS_KEY, []));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState(activeUser?.name || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<MarketplaceOrder["payment_method"]>("SNAP");
  const [salesChannel, setSalesChannel] = useState("Direct");
  const [grownByReference, setGrownByReference] = useState("");
  const [pickupDate, setPickupDate] = useState(todayISO());
  const [pickupWindow, setPickupWindow] = useState("9:00 AM - 11:00 AM");
  const [pickupLocation, setPickupLocation] = useState("Bronson Family Farm / Lansdowne");
  const [notes, setNotes] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<MarketplaceProduct["category"]>("Produce");
  const [newPrice, setNewPrice] = useState("5");
  const [newInventory, setNewInventory] = useState("10");
  const [newUnit, setNewUnit] = useState("item");
  const [newDescription, setNewDescription] = useState("");
  const [newSnap, setNewSnap] = useState(true);
  const [newGrownByEnabled, setNewGrownByEnabled] = useState(true);
  const [newDirectEnabled, setNewDirectEnabled] = useState(true);
  const [newHarvestReady, setNewHarvestReady] = useState(false);

  const refresh = async () => {
    const loadedProducts = await loadSupabaseRows<MarketplaceProduct>("marketplace_products", MARKET_PRODUCTS_KEY);
    const productRows = loadedProducts.length ? loadedProducts : safeRead<MarketplaceProduct[]>(MARKET_PRODUCTS_KEY, DEFAULT_MARKET_PRODUCTS);
    setProducts(productRows.length ? productRows : DEFAULT_MARKET_PRODUCTS);
    setOrders(await loadSupabaseRows<MarketplaceOrder & Record<string, any>>("marketplace_orders", MARKET_ORDERS_KEY));
    setOrderItems(await loadSupabaseRows<MarketplaceOrderItem>("marketplace_order_items", MARKET_ORDER_ITEMS_KEY));
  };

  useEffect(() => {
    if (!safeRead<MarketplaceProduct[]>(MARKET_PRODUCTS_KEY, []).length) safeWrite(MARKET_PRODUCTS_KEY, DEFAULT_MARKET_PRODUCTS);
    refresh();
  }, []);

  const categories = ["All", "Produce", "Seeds & Plants", "Value-Added", "Grower Marketplace", "Events"];
  const visibleProducts = products.filter((p) => p.active && (category === "All" || p.category === category));
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const snapTotal = cart.filter((item) => item.product.snap_eligible).reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const nonSnapTotal = Math.max(0, total - snapTotal);
  const ordersToday = orders.filter((order) => order.created_at?.slice(0, 10) === todayISO());
  const directOrders = orders.filter((order) => (order.sales_channel || "Direct") === "Direct");
  const grownByOrders = orders.filter((order) => (order.sales_channel || "Direct") === "GrownBy");
  const pendingOrders = orders.filter((order) => !["picked_up", "cancelled"].includes(order.status));
  const lowInventory = products.filter((p) => p.active && p.inventory <= Number((p as any).low_inventory_threshold || 5));
  const harvestReady = products.filter((p) => p.active && Boolean((p as any).harvest_ready));
  const activeProducts = products.filter((p) => p.active);
  const revenueToday = ordersToday.reduce((s, o) => s + Number(o.total || 0), 0);
  const snapProductCount = products.filter((p) => p.active && p.snap_eligible).length;
  const fulfillmentNeeds = pendingOrders.filter((o) => (o.fulfillment_status || "needs_harvest") !== "picked_up");

  const addToCart = (product: MarketplaceProduct) => {
    if (product.inventory <= 0) {
      setMessage("This item is currently unavailable.");
      return;
    }
    setMessage("");
    setCart((items) => {
      const found = items.find((item) => item.product.id === product.id);
      if (found) return items.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.inventory) } : item);
      return [...items, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((items) => items.flatMap((item) => {
      if (item.product.id !== productId) return [item];
      if (quantity <= 0) return [];
      return [{ ...item, quantity: Math.min(quantity, item.product.inventory) }];
    }));
  };

  const placeOrder = async () => {
    if (!cart.length) {
      setMessage("Add at least one marketplace item first.");
      return;
    }
    if (!customerName.trim()) {
      setMessage("Customer name is required before checkout.");
      return;
    }

    const order: MarketplaceOrder & Record<string, any> = {
      id: uuid(),
      customer_name: customerName.trim(),
      email,
      phone,
      payment_method: paymentMethod,
      pickup_date: pickupDate,
      pickup_window: pickupWindow,
      total,
      status: "pending",
      notes,
      created_at: new Date().toISOString(),
      sales_channel: salesChannel,
      grownby_reference: salesChannel === "GrownBy" ? grownByReference.trim() : "",
      pickup_location: pickupLocation,
      fulfillment_status: "needs_harvest",
      harvest_status: "not_started",
      snap_amount: paymentMethod === "SNAP" ? snapTotal : 0,
      direct_amount: paymentMethod === "SNAP" ? nonSnapTotal : total,
      customer_type: salesChannel === "GrownBy" ? "grownby_customer" : "direct_customer",
    };

    const items: MarketplaceOrderItem[] = cart.map((item) => ({
      id: uuid(),
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      line_total: item.product.price * item.quantity,
    }));

    const orderResult = await insertRow("marketplace_orders", MARKET_ORDERS_KEY, order);
    for (const item of items) await insertRow("marketplace_order_items", MARKET_ORDER_ITEMS_KEY, item);

    const updatedProducts = products.map((product) => {
      const purchased = cart.find((item) => item.product.id === product.id);
      return purchased ? { ...product, inventory: Math.max(0, product.inventory - purchased.quantity) } : product;
    });
    safeWrite(MARKET_PRODUCTS_KEY, updatedProducts);
    setProducts(updatedProducts);
    setOrders([order, ...orders]);
    setOrderItems([...items, ...orderItems]);
    setCart([]);
    setMessage(orderResult.ok ? `Order saved for ${order.customer_name}. Channel: ${salesChannel}. Pickup: ${order.pickup_date}, ${order.pickup_window}.` : `Order saved locally but Supabase rejected it. Run the Marketplace Operations V2 SQL, then try again.`);
    setTab("orders");
  };

  const addProduct = async () => {
    if (!newName.trim()) {
      setMessage("Product name is required.");
      return;
    }
    const product: MarketplaceProduct & Record<string, any> = {
      id: uuid(),
      name: newName.trim(),
      category: newCategory,
      description: newDescription || "Marketplace item for Bronson Family Farm operations.",
      price: Number(newPrice) || 0,
      unit: newUnit || "item",
      inventory: Number(newInventory) || 0,
      snap_eligible: newSnap,
      image_url: "",
      active: true,
      created_at: new Date().toISOString(),
      grownby_sales_enabled: newGrownByEnabled,
      direct_sales_enabled: newDirectEnabled,
      harvest_ready: newHarvestReady,
      low_inventory_threshold: 5,
    };
    const result = await insertRow("marketplace_products", MARKET_PRODUCTS_KEY, product);
    setProducts([product, ...products]);
    setNewName("");
    setNewDescription("");
    setMessage(result.ok ? "Product added to marketplace catalog." : "Product saved locally. Run Marketplace Operations V2 SQL if Supabase rejected extra marketplace columns.");
  };

  const ChannelBadge = ({ channel }: { channel: string }) => (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${channel === "GrownBy" ? "bg-blue-200 text-black" : "bg-emerald-300 text-black"}`}>{channel}</span>
  );

  return (
    <div className="grid h-[calc(100vh-82px)] min-h-0 gap-3 xl:grid-cols-[285px_1fr]">
      <Card className="h-full overflow-hidden">
        <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-100/75">Marketplace Operations Center</div>
        <h1 className="mt-2 text-2xl font-black leading-tight">GrownBy + Direct Sales.</h1>
        <p className="mt-2 text-xs leading-5 text-white/82">Sales can happen through GrownBy or directly through Bronson. This center turns orders into harvest planning, packing, pickup, and reporting.</p>
        <div className="mt-3 grid gap-1.5">
          {[
            ["command", "Operations Dashboard"],
            ["storefront", "Product Catalog"],
            ["checkout", `Cart / Checkout (${cartCount})`],
            ["orders", "Orders"],
            ["fulfillment", "Harvest / Fulfillment"],
            ["catalog", "Catalog Admin"],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as typeof tab)} className={`rounded-xl border px-3 py-2 text-left text-xs font-black ${tab === key ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white"}`}>{label}</button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/10 p-2"><div className="text-lg font-black">{ordersToday.length}</div><div className="text-xs uppercase tracking-[0.2em] text-white/60">Orders Today</div></div>
          <div className="rounded-xl border border-white/10 bg-white/10 p-2"><div className="text-lg font-black">{money(revenueToday)}</div><div className="text-xs uppercase tracking-[0.2em] text-white/60">Sales Today</div></div>
          <div className="rounded-xl border border-white/10 bg-white/10 p-2"><div className="text-lg font-black">{activeProducts.length}</div><div className="text-xs uppercase tracking-[0.2em] text-white/60">Products</div></div>
          <div className="rounded-xl border border-white/10 bg-white/10 p-2"><div className="text-lg font-black">{lowInventory.length}</div><div className="text-xs uppercase tracking-[0.2em] text-white/60">Low Stock</div></div>
        </div>
        <button onClick={refresh} className="mt-3 w-full rounded-full border border-white/15 bg-black/35 px-4 py-2 text-sm font-black">Refresh Marketplace</button>
        <button onClick={() => setScreen("grower")} className="mt-2 w-full rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black">Open Grower Demand</button>
      </Card>

      <div className="min-h-0 overflow-hidden">
        {message && <Notice text={message} />}

        {tab === "command" && (
          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Live Marketplace Command</div>
            <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">Orders become harvest instructions.</h1>
            <div className="mt-4 rounded-[1.2rem] border border-emerald-200/25 bg-emerald-300/12 p-3">
              <div className="text-xs font-black uppercase tracking-[0.28em] text-emerald-100/80">GrownBy Market Connection</div>
              <div className="mt-1 text-xl font-black">Bronson sells through GrownBy and direct sales.</div>
              <p className="mt-1 text-xs leading-5 text-white/82">Use GrownBy for online/SNAP-supported ordering and use this ecosystem for planning, direct sales, fulfillment, pickup, youth-safe marketplace impact, and grower demand. Food moves, not the farmer.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a href="https://grownby.com" target="_blank" rel="noreferrer" className="rounded-full bg-emerald-300 px-3 py-1.5 text-xs font-black text-black">Open GrownBy</a>
                <button onClick={() => setTab("storefront")} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black">Bronson Direct Catalog</button>
                <button onClick={() => setTab("fulfillment")} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black">Harvest / Fulfillment</button>
              </div>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-4">
              {[
                ["GrownBy Orders", grownByOrders.length],
                ["Direct Orders", directOrders.length],
                ["Pending Pickups", pendingOrders.length],
                ["SNAP Products", snapProductCount],
                ["Harvest Ready", harvestReady.length],
                ["Needs Fulfillment", fulfillmentNeeds.length],
                ["Inventory Alerts", lowInventory.length],
                ["Revenue Today", money(revenueToday)],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <div className="text-2xl font-black">{value}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/65">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <div className="rounded-[1.1rem] border border-white/10 bg-black/35 p-3">
                <div className="text-lg font-black">GrownBy Channel</div>
                <p className="mt-2 text-xs leading-5 text-white/78">Use for sales you complete through GrownBy, especially SNAP-supported orders. Enter the GrownBy reference so harvest and pickup can be tracked here.</p>
              </div>
              <div className="rounded-[1.1rem] border border-white/10 bg-black/35 p-3">
                <div className="text-lg font-black">Direct Channel</div>
                <p className="mt-2 text-xs leading-5 text-white/78">Use for farm gate sales, schools, businesses, churches, events, wholesale, invoices, and community orders.</p>
              </div>
              <div className="rounded-[1.1rem] border border-white/10 bg-black/35 p-3">
                <div className="text-lg font-black">Youth Connection</div>
                <p className="mt-2 text-xs leading-5 text-white/78">Youth should see safe marketplace impact: where food is going, what crops are needed, and why today’s harvest matters — not private customer data.</p>
              </div>
            </div>
          </Card>
        )}

        {tab === "storefront" && (
          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Product Catalog</div>
            <h1 className="mt-2 text-2xl font-black leading-tight md:text-3xl">Text-only launch catalog connected to Bronson direct sales and GrownBy-supported fulfillment.</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat) => <button key={cat} onClick={() => setCategory(cat)} className={`rounded-full border px-4 py-2 text-sm font-black ${category === cat ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10"}`}>{cat}</button>)}
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <div key={product.id} className="rounded-[1.1rem] border border-white/10 bg-white/10 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/70">{product.category}</div>
                      <div className="mt-1 text-xl font-black uppercase leading-tight">{product.name}</div>
                    </div>
                    <div className="text-right text-xl font-black text-emerald-100">{money(product.price)}</div>
                  </div>
                  <p className="mt-2 min-h-[38px] text-xs leading-5 text-white/78">{product.description}</p>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] font-black">
                    <span className="rounded-xl bg-black/35 px-3 py-2">Inventory: {product.inventory}</span>
                    <span className="rounded-xl bg-black/35 px-3 py-2">Unit: {product.unit}</span>
                    <span className={`rounded-xl px-3 py-2 ${product.snap_eligible ? "bg-emerald-300 text-black" : "bg-white/10 text-white"}`}>{product.snap_eligible ? "SNAP Eligible" : "Non-SNAP"}</span>
                    <span className={`rounded-xl px-3 py-2 ${Boolean((product as any).harvest_ready) ? "bg-amber-200 text-black" : "bg-white/10 text-white"}`}>{Boolean((product as any).harvest_ready) ? "Harvest Ready" : "Available"}</span>
                  </div>
                  <button onClick={() => addToCart(product)} className="mt-3 w-full rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-black">Add to Cart</button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "checkout" && (
          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Cart / Checkout</div>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">Record GrownBy or Direct orders.</h1>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_.9fr]">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center justify-between gap-4"><div><div className="font-black">{item.product.name}</div><div className="text-sm text-white/65">{money(item.product.price)} / {item.product.unit}</div></div><input type="number" min={0} max={item.product.inventory} value={item.quantity} onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))} className="w-24 rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-white" /></div>
                    <div className="mt-2 text-right font-black">{money(item.product.price * item.quantity)}</div>
                  </div>
                ))}
                {!cart.length && <Notice text="Your cart is empty. Add produce, seeds, plants, value-added items, or grower marketplace items first." />}
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <div className="grid gap-4">
                  <SelectField label="Sales Channel" value={salesChannel} onChange={setSalesChannel} options={["Direct", "GrownBy", "Sponsor", "Wholesale"]} />
                  {salesChannel === "GrownBy" && <Field label="GrownBy Order / Reference" value={grownByReference} onChange={setGrownByReference} placeholder="Paste GrownBy order number/reference" />}
                  <Field label="Customer Name" value={customerName} onChange={setCustomerName} />
                  <Field label="Email" value={email} onChange={setEmail} />
                  <Field label="Phone" value={phone} onChange={setPhone} />
                  <SelectField label="Payment Method" value={paymentMethod} onChange={(v) => setPaymentMethod(v as MarketplaceOrder["payment_method"])} options={["SNAP", "Cash", "Card", "Invoice", "Sponsor"]} />
                  <Field label="Pickup Date" type="date" value={pickupDate} onChange={setPickupDate} />
                  <SelectField label="Pickup Window" value={pickupWindow} onChange={setPickupWindow} options={["9:00 AM - 11:00 AM", "11:00 AM - 1:00 PM", "1:00 PM - 2:00 PM", "Event pickup", "By appointment"]} />
                  <Field label="Pickup Location" value={pickupLocation} onChange={setPickupLocation} />
                  <TextArea label="Order Notes" value={notes} onChange={setNotes} />
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-7"><div className="flex justify-between"><span>SNAP eligible estimate</span><b>{money(snapTotal)}</b></div><div className="flex justify-between"><span>Non-SNAP estimate</span><b>{money(nonSnapTotal)}</b></div><div className="mt-2 flex justify-between text-xl"><span className="font-black">Total</span><b>{money(total)}</b></div></div>
                <button onClick={placeOrder} className="mt-5 w-full rounded-full bg-emerald-300 px-6 py-4 font-black text-black">Save Marketplace Order</button>
              </div>
            </div>
          </Card>
        )}

        {tab === "orders" && (
          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Marketplace Orders</div>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">Pickup and order tracking.</h1>
            <div className="mt-6 grid gap-3">
              {orders.map((order) => {
                const items = orderItems.filter((item) => item.order_id === order.id);
                return <div key={order.id} className="rounded-2xl border border-white/10 bg-white/10 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="flex flex-wrap items-center gap-2"><div className="text-lg font-black">{order.customer_name}</div><ChannelBadge channel={order.sales_channel || "Direct"} /></div><div className="text-xs uppercase tracking-[0.2em] text-white/60">{order.pickup_date} • {order.pickup_window} • {order.payment_method}</div></div><div className="text-right"><div className="text-lg font-black">{money(Number(order.total || 0))}</div><div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">{order.status}</div></div></div><div className="mt-2 text-xs leading-5 text-white/78">{items.map((item) => `${item.quantity} ${item.product_name}`).join(" • ") || "Order items loading from saved records."}</div><div className="mt-2 text-xs text-white/60">Fulfillment: {order.fulfillment_status || "needs_harvest"} • Harvest: {order.harvest_status || "not_started"} {order.grownby_reference ? `• GrownBy: ${order.grownby_reference}` : ""}</div></div>;
              })}
              {!orders.length && <Notice text="No marketplace orders have been saved yet." />}
            </div>
          </Card>
        )}

        {tab === "fulfillment" && (
          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-amber-100/75">Harvest / Fulfillment</div>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">What must be harvested, packed, and picked up?</h1>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <div className="text-lg font-black">Pending Fulfillment</div>
                <div className="mt-4 space-y-3">
                  {pendingOrders.slice(0, 8).map((order) => <div key={order.id} className="rounded-2xl bg-black/30 p-4"><div className="flex justify-between gap-3"><div><div className="font-black">{order.customer_name}</div><div className="text-xs uppercase tracking-[0.18em] text-white/55">{order.pickup_date} • {order.pickup_window}</div></div><ChannelBadge channel={order.sales_channel || "Direct"} /></div><div className="mt-2 text-sm text-white/70">{order.fulfillment_status || "needs_harvest"}</div></div>)}
                  {!pendingOrders.length && <div className="text-sm text-white/70">No pending orders.</div>}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <div className="text-lg font-black">Low Inventory / Harvest Attention</div>
                <div className="mt-4 space-y-3">
                  {lowInventory.concat(harvestReady).slice(0, 10).map((product) => <div key={product.id} className="rounded-2xl bg-black/30 p-4"><div className="flex justify-between gap-3"><div className="font-black">{product.name}</div><div className="font-black">{product.inventory} {product.unit}</div></div><div className="mt-2 text-xs uppercase tracking-[0.18em] text-white/55">{product.category} {Boolean((product as any).harvest_ready) ? "• Harvest ready" : ""}</div></div>)}
                  {!lowInventory.length && !harvestReady.length && <div className="text-sm text-white/70">No current harvest alerts.</div>}
                </div>
              </div>
            </div>
          </Card>
        )}

        {tab === "catalog" && (
          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Catalog Admin</div>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">Add products and monitor marketplace readiness.</h1>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <div className="text-lg font-black">Add Product</div>
                <div className="mt-4 grid gap-4">
                  <Field label="Product Name" value={newName} onChange={setNewName} />
                  <SelectField label="Category" value={newCategory} onChange={(v) => setNewCategory(v as MarketplaceProduct["category"])} options={["Produce", "Seeds & Plants", "Value-Added", "Grower Marketplace", "Events"]} />
                  <Field label="Price" type="number" value={newPrice} onChange={setNewPrice} />
                  <Field label="Inventory" type="number" value={newInventory} onChange={setNewInventory} />
                  <Field label="Unit" value={newUnit} onChange={setNewUnit} />
                  <TextArea label="Description" value={newDescription} onChange={setNewDescription} />
                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 font-black"><input type="checkbox" checked={newSnap} onChange={(e) => setNewSnap(e.target.checked)} /> SNAP eligible</label>
                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 font-black"><input type="checkbox" checked={newGrownByEnabled} onChange={(e) => setNewGrownByEnabled(e.target.checked)} /> Available through GrownBy</label>
                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 font-black"><input type="checkbox" checked={newDirectEnabled} onChange={(e) => setNewDirectEnabled(e.target.checked)} /> Available for Direct Sales</label>
                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 font-black"><input type="checkbox" checked={newHarvestReady} onChange={(e) => setNewHarvestReady(e.target.checked)} /> Harvest ready</label>
                  <button onClick={addProduct} className="rounded-full bg-emerald-300 px-6 py-4 font-black text-black">Add Product</button>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <div className="text-lg font-black">Channel Rules</div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-white/82">
                  <div className="rounded-2xl bg-black/30 p-4"><b>GrownBy:</b> sales channel for GrownBy orders and SNAP-supported order tracking. Enter order references here for harvest planning.</div>
                  <div className="rounded-2xl bg-black/30 p-4"><b>Direct:</b> Bronson direct sales for farm gate, events, schools, churches, businesses, wholesale, and invoice customers.</div>
                  <div className="rounded-2xl bg-black/30 p-4"><b>Youth visible:</b> safe aggregate impact only — harvest goals, product demand, and destinations. No customer private data.</div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function Operations({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Operations</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Daily rhythm for launch.</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          ["Beginning of Day", "QR/manual check-in, PPE, water, daily proverb, weather awareness, assignments."],
          ["During Program", "Supervisor observations, wellness support, safety follow-up, task completion, incident documentation."],
          ["End of Day", "Youth reflection, supervisor assessment, parent-safe summary, reports."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-xl border border-white/10 bg-white/10 p-3">
            <div className="text-lg font-black">{title}</div>
            <p className="mt-3 text-sm leading-7 text-white/82">{text}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setScreen("supervisor")} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Open Supervisor Center</button>
    </Card>
  );
}

function Feedback({ activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [message, setMessage] = useState("");

  const save = async () => {
    const row: FeedbackRecord = {
      id: uuid(),
      profile_id: activeUser?.id,
      profile_type: activeUser ? roleToProfileType(activeUser.role) : "customer",
      feedback_type: "platform",
      rating,
      comments,
      would_recommend: recommend,
      created_at: new Date().toISOString(),
    };
    await insertRow("feedback", FEEDBACK_KEY, row);
    setMessage("Feedback saved.");
  };

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Feedback</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Tell us about the platform and program experience.</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="flex justify-between text-sm font-black"><span>Rating</span><span>{rating}/5</span></div>
          <input className="mt-3 w-full" type="range" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        </label>
        <label className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 font-black">
          <input type="checkbox" checked={recommend} onChange={(e) => setRecommend(e.target.checked)} />
          I would recommend this experience.
        </label>
      </div>
      <div className="mt-5"><TextArea label="Comments" value={comments} onChange={setComments} /></div>
      <button onClick={save} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Feedback</button>
      {message && <Notice text={message} />}
    </Card>
  );
}

function SimplePathway({
  title,
  text,
  image,
  setScreen,
  extra,
}: {
  title: string;
  text: string;
  image: string;
  setScreen: (screen: Screen) => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Pathway</div>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/88">{text}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {extra}
          <button onClick={() => setScreen("roles")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Switch Workspace</button>
          <button onClick={() => setScreen("marketplace")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Go to Marketplace</button>
        </div>
      </Card>
      <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 p-3 shadow-[0_35px_100px_rgba(0,0,0,.48)]">
        <img src={image} alt={title} className="max-h-[72vh] w-full object-contain" onError={(e) => (e.currentTarget.src = IMG.backup)} />
      </div>
    </div>
  );
}


type GrowerWeather = {
  currentTemp?: number;
  currentWind?: number;
  currentPrecip?: number;
  todayHigh?: number;
  todayLow?: number;
  rainChance?: number;
  source: "live" | "fallback";
};

const DEFAULT_PROVERBS = [
  "A garden grows where attention goes.",
  "The best fertilizer is the grower's shadow.",
  "Plant in hope, tend with patience, harvest with gratitude.",
  "Food moves, not the farmer.",
  "Small daily care becomes a season of abundance.",
];

const DEFAULT_GROWER_TASKS = [
  { title: "Walk the grow area", priority: "High", detail: "Check water, pests, fencing, crop stress, and safety before assigning crews." },
  { title: "Review marketplace demand", priority: "High", detail: "Compare available products with orders and likely pickup needs." },
  { title: "Assign youth crews", priority: "Medium", detail: "Match harvest, weeding, irrigation, and packing tasks to crew readiness." },
  { title: "Document crop notes", priority: "Medium", detail: "Record what changed today so the farm can learn over time." },
];


function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-[0_20px_60px_rgba(0,0,0,.25)]">
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">{label}</div>
    </div>
  );
}

function GrowerOperationsCenter({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [weather, setWeather] = useState<GrowerWeather>({ source: "fallback" });
  const [weatherMessage, setWeatherMessage] = useState("Loading Youngstown farm weather...");
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [wisdom, setWisdom] = useState<any[]>([]);
  const [cropPlans, setCropPlans] = useState<any[]>([]);
  const [seeds, setSeeds] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const loadGrowerData = async () => {
    const [loadedProducts, loadedOrders] = await Promise.all([
      loadSupabaseRows<MarketplaceProduct>("marketplace_products", MARKET_PRODUCTS_KEY),
      loadSupabaseRows<MarketplaceOrder>("marketplace_orders", MARKET_ORDERS_KEY),
    ]);
    setProducts(loadedProducts.filter((p) => p.active !== false));
    setOrders(loadedOrders);

    if (supabase) {
      const loadOptional = async (table: string) => {
        try {
          const { data, error } = await supabase.from(table).select("*").limit(20);
          if (error || !data) return [];
          return data;
        } catch {
          return [];
        }
      };
      const [loadedAnnouncements, loadedWisdom, loadedCropPlans, loadedSeeds] = await Promise.all([
        loadOptional("program_announcements"),
        loadOptional("wisdom_entries"),
        loadOptional("crop_plans"),
        loadOptional("daily_seeds"),
      ]);
      setAnnouncements(loadedAnnouncements);
      setWisdom(loadedWisdom);
      setCropPlans(loadedCropPlans);
      setSeeds(loadedSeeds);
    }
  };

  const loadWeather = async () => {
    try {
      const url = "https://api.open-meteo.com/v1/forecast?latitude=41.0998&longitude=-80.6495&current=temperature_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York&forecast_days=3";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather request failed");
      const data = await res.json();
      setWeather({
        currentTemp: Math.round(data.current?.temperature_2m ?? 0),
        currentWind: Math.round(data.current?.wind_speed_10m ?? 0),
        currentPrecip: data.current?.precipitation ?? 0,
        todayHigh: Math.round(data.daily?.temperature_2m_max?.[0] ?? 0),
        todayLow: Math.round(data.daily?.temperature_2m_min?.[0] ?? 0),
        rainChance: Math.round(data.daily?.precipitation_probability_max?.[0] ?? 0),
        source: "live",
      });
      setWeatherMessage("Live weather for Youngstown / Lansdowne area.");
    } catch {
      setWeather({ currentTemp: 72, currentWind: 6, todayHigh: 78, todayLow: 58, rainChance: 25, source: "fallback" });
      setWeatherMessage("Weather service unavailable. Showing planning fallback until live feed responds.");
    }
  };

  useEffect(() => {
    loadGrowerData();
    loadWeather();
  }, []);

  const todaysOrders = orders.filter((o) => (o.pickup_date || "").slice(0, 10) === todayISO());
  const pendingOrders = orders.filter((o) => ["pending", "confirmed"].includes(o.status));
  const lowInventory = products.filter((p) => Number(p.inventory || 0) <= 5);
  const availableProduce = products.filter((p) => p.category === "Produce");
  const dailyProverb = (wisdom[0]?.text || wisdom[0]?.proverb || wisdom[0]?.message || DEFAULT_PROVERBS[new Date().getDate() % DEFAULT_PROVERBS.length]) as string;

  const demandRows = products.slice(0, 6).map((p) => {
    const requested = pendingOrders.length ? pendingOrders.length * 3 : 0;
    const available = Number(p.inventory || 0);
    return { name: p.name, available, requested, gap: Math.max(0, requested - available), surplus: Math.max(0, available - requested) };
  });

  const weatherRisk = weather.rainChance && weather.rainChance >= 60
    ? "Rain risk: prioritize harvest, covers, drainage checks, and safe footing."
    : weather.todayHigh && weather.todayHigh >= 85
      ? "Heat risk: prioritize water, shade breaks, and lighter crew rotations."
      : "Normal field conditions: complete walk-through, water check, weed pressure, and harvest readiness.";

  const saveGrowerNote = async () => {
    if (!note.trim()) {
      setSaveStatus("Add a grower note before saving.");
      return;
    }
    setSaveStatus("Saving grower note...");
    const row = {
      id: uuid(),
      note_date: todayISO(),
      author: activeUser?.name || "Grower / Staff",
      note_type: "daily_field_note",
      note: note.trim(),
      created_at: new Date().toISOString(),
    };
    const result = await insertRow("grower_notes", "bff.launch.grower.notes", row);
    setSaveStatus(result.ok ? `Saved grower note to ${result.mode}.` : `Could not save to Supabase. Saved locally. ${String((result.error as any)?.message || "")}`);
    setNote("");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <Card className="lg:sticky lg:top-28 lg:self-start">
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Live Grower Operations Center</div>
        <h1 className="mt-5 text-3xl font-black leading-tight md:text-4xl">What does the land need today?</h1>
        <p className="mt-2 text-xs leading-5 text-white/82">Weather, proverbs, crop plans, inventory, marketplace demand, and daily field notes for farm operations.</p>
        <div className="mt-6 grid gap-3">
          <button onClick={loadGrowerData} className="rounded-2xl bg-emerald-300 px-5 py-3 font-black text-black">Refresh Grower Data</button>
          <button onClick={() => setScreen("marketplace")} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-left font-black">Open Marketplace</button>
          <button onClick={() => setScreen("supervisor")} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-left font-black">Crew / Supervisor Center</button>
          <button onClick={() => setScreen("reports")} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-left font-black">Reports</button>
        </div>
      </Card>

      <div className="space-y-5">
        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Morning Farm Briefing</div>
          <h2 className="mt-3 text-4xl font-black leading-tight md:text-6xl">Grower live dashboard.</h2>
          <p className="mt-4 max-w-4xl text-white/82">Food moves, not the farmer. This screen connects today’s field decisions to youth crews, product availability, marketplace demand, and community food access.</p>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Current Temp" value={weather.currentTemp !== undefined ? `${weather.currentTemp}°F` : "—"} />
          <Metric label="Rain Chance" value={weather.rainChance !== undefined ? `${weather.rainChance}%` : "—"} />
          <Metric label="Products Available" value={String(products.length)} />
          <Metric label="Pending Orders" value={String(pendingOrders.length)} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/75">Live Weather</div>
                <h3 className="mt-1 text-xl font-black">Youngstown / Lansdowne field conditions</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase">{weather.source}</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4"><div className="text-xs uppercase tracking-[0.2em] text-white/55">High / Low</div><div className="mt-1 text-xl font-black">{weather.todayHigh ?? "—"}° / {weather.todayLow ?? "—"}°</div></div>
              <div className="rounded-2xl bg-white/10 p-4"><div className="text-xs uppercase tracking-[0.2em] text-white/55">Wind</div><div className="mt-1 text-xl font-black">{weather.currentWind ?? "—"} mph</div></div>
              <div className="rounded-2xl bg-white/10 p-4"><div className="text-xs uppercase tracking-[0.2em] text-white/55">Rain Now</div><div className="mt-1 text-xl font-black">{weather.currentPrecip ?? 0}</div></div>
            </div>
            <Notice text={`${weatherMessage} ${weatherRisk}`} />
          </Card>

          <Card>
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/75">Daily Wisdom / Proverbs</div>
            <h3 className="mt-1 text-xl font-black">Today’s field word</h3>
            <p className="mt-5 rounded-3xl border border-emerald-200/20 bg-emerald-200/10 p-5 text-xl font-black leading-8">“{dailyProverb}”</p>
            <p className="mt-4 text-sm leading-6 text-white/72">Use this for youth crew motivation, grower reflection, and morning huddle focus.</p>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/75">Today’s Priorities</div>
            <h3 className="mt-1 text-xl font-black">Field task guidance</h3>
            <div className="mt-5 grid gap-3">
              {(cropPlans.length ? cropPlans.slice(0, 5).map((p: any) => ({ title: p.task || p.crop || p.title || "Crop plan item", priority: p.priority || p.status || "Review", detail: p.notes || p.description || p.location || "Review crop plan and assign crew action." })) : DEFAULT_GROWER_TASKS).map((task: any, idx: number) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                  <div className="flex items-center justify-between gap-3"><div className="font-black">{task.title}</div><span className="rounded-full bg-black/35 px-3 py-1 text-xs font-black">{task.priority}</span></div>
                  <div className="mt-2 text-sm leading-6 text-white/74">{task.detail}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/75">Marketplace Demand</div>
            <h3 className="mt-1 text-xl font-black">What the market may need</h3>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-xs uppercase tracking-[0.18em] text-white/60"><tr><th className="p-3">Item</th><th className="p-3">Available</th><th className="p-3">Need</th><th className="p-3">Status</th></tr></thead>
                <tbody>
                  {demandRows.length ? demandRows.map((row) => (
                    <tr key={row.name} className="border-t border-white/10"><td className="p-3 font-bold">{row.name}</td><td className="p-3">{row.available}</td><td className="p-3">{row.requested}</td><td className="p-3 font-black">{row.gap > 0 ? `Short ${row.gap}` : `Surplus ${row.surplus}`}</td></tr>
                  )) : <tr><td className="p-4 text-white/70" colSpan={4}>No marketplace products loaded yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/75">Inventory / Seeds</div>
            <h3 className="mt-1 text-xl font-black">Available products and grower supply</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {products.slice(0, 8).map((p) => (
                <div key={p.id} className="rounded-2xl bg-white/8 p-4"><div className="font-black">{p.name}</div><div className="mt-1 text-sm text-white/65">{p.category} • {p.inventory} {p.unit}</div></div>
              ))}
              {seeds.slice(0, 4).map((s: any, idx: number) => (
                <div key={s.id || idx} className="rounded-2xl bg-white/8 p-4"><div className="font-black">{s.seed_name || s.name || "Seed item"}</div><div className="mt-1 text-sm text-white/65">{s.quantity || s.status || "Review inventory"}</div></div>
              ))}
              {!products.length && !seeds.length && <div className="text-white/70">No inventory loaded yet.</div>}
            </div>
            {lowInventory.length > 0 && <Notice text={`Inventory alert: ${lowInventory.map((p) => p.name).join(", ")} need review.`} />}
          </Card>

          <Card>
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/75">Announcements</div>
            <h3 className="mt-1 text-xl font-black">Program messages for growers</h3>
            <div className="mt-5 grid gap-3">
              {(announcements.length ? announcements.slice(0, 5) : [{ title: "Launch operations", message: "Use this center for weather, field tasks, marketplace readiness, and daily notes." }]).map((a: any, idx: number) => (
                <div key={a.id || idx} className="rounded-2xl border border-white/10 bg-white/8 p-4"><div className="font-black">{a.title || a.subject || "Announcement"}</div><div className="mt-2 text-sm leading-6 text-white/74">{a.message || a.body || a.description || "Review program update."}</div></div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/75">Daily Field Note</div>
          <h3 className="mt-1 text-xl font-black">Record what changed today</h3>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <TextArea label="Grower note" value={note} onChange={setNote} placeholder="Example: North row needs water; collards ready for harvest; youth crew handled mulching well." />
            <button onClick={saveGrowerNote} className="rounded-2xl bg-emerald-300 px-8 py-4 font-black text-black">Save Grower Note</button>
          </div>
          {saveStatus && <Notice text={saveStatus} />}
        </Card>
      </div>
    </div>
  );
}


export default App;
