import React, { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Bronson Family Farm Online Ecosystem
 * MASTER ECOSYSTEM VERSION
 *
 * Complete React/Vite App.tsx replacement.
 *
 * Integrated ecosystem layers:
 * - Forest portal entrance
 * - Guided guest demo
 * - Role-based registration and autofill-ready profiles
 * - Youth Workforce program
 * - Supervisor mobile tools
 * - Parent/guardian portal
 * - Wellness baseline and daily check-ins
 * - Depression/suicide/substance-use-sensitive support flagging
 * - Attendance, PPE, daily tasks, rubrics, LSP-style life skills tracking
 * - 8-week curriculum/activity engine
 * - Badges, milestones, certifications
 * - Crop planner, grow plan, regenerative learning
 * - Inventory/Bubble Babies/marketplace starter engine
 * - Grower and value-added producer pathways
 * - Volunteer, partner, staff, operations, board/funder reports
 * - Feedback and experience surveys
 * - Airport, military, legacy, land, and regenerative education pathways
 * - Multi-language content scaffold
 * - Guided narration scaffold
 * - Supabase-ready writes with localStorage fallback
 */

type Screen =
  | "portal"
  | "guest"
  | "registration"
  | "account"
  | "roles"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "valueAdded"
  | "marketplace"
  | "crop"
  | "inventory"
  | "curriculum"
  | "wellness"
  | "feedback"
  | "reports"
  | "operations"
  | "partners"
  | "safety"
  | "data"
  | "history"
  | "regenerative"
  | "volunteer"
  | "board"
  | "grant"
  | "staff";

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
type Lang = "en" | "es" | "tl" | "it" | "he" | "fr";

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

type YouthRegistration = {
  id: string;
  profile_id: string;
  participant_id: string;
  age_range: string;
  crew: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  trusted_adult: string;
  emergency_contact: string;
  medical_notes: string;
  media_release: boolean;
  transportation_plan: string;
  program_goal: string;
};

type SupervisorRegistration = {
  id: string;
  profile_id: string;
  crew: string;
  role_title: string;
  training_completed: boolean;
  background_check_status: string;
  emergency_contact: string;
  support_needed: string;
};

type GrowerRegistration = {
  id: string;
  profile_id: string;
  farm_name: string;
  growing_area: string;
  crops_grown: string;
  water_source: string;
  equipment_available: string;
  market_interest: string;
};

type ValueAddedRegistration = {
  id: string;
  profile_id: string;
  business_name: string;
  product_categories: string;
  license_status: string;
  kitchen_type: string;
  insurance_status: string;
  capacity: string;
};

type RelationshipRecord = {
  id: string;
  primary_profile_id: string;
  related_profile_id: string;
  relationship_type:
    | "parent_to_youth"
    | "supervisor_to_youth"
    | "grower_to_market"
    | "producer_to_market"
    | "partner_to_program"
    | "volunteer_to_program";
  status: "active" | "pending" | "inactive";
  notes?: string;
  created_at: string;
};

type ParentMessage = {
  id: string;
  participant_id: string;
  sender_role: "supervisor" | "parent" | "admin";
  message_type: "progress" | "attendance" | "badge" | "support" | "general";
  subject: string;
  body: string;
  parent_safe: boolean;
  created_at: string;
};

type AttendanceRecord = {
  id: string;
  participant_id: string;
  supervisor_id?: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  status: string;
  ppe_status: string;
  qr_method?: string;
  notes?: string;
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

type CropPlan = {
  id: string;
  crop: string;
  variety: string;
  zone: string;
  planted: string;
  expected_harvest?: string;
  grower_profile_id?: string;
  regenerative_practice?: string;
  notes?: string;
};

type InventoryItem = {
  id: string;
  item_type: "seed" | "seedling" | "produce" | "bubble_baby" | "tool" | "supply" | "value_added";
  category: string;
  name: string;
  variety?: string;
  quantity: number;
  unit: string;
  price?: number;
  snap_eligible?: boolean;
  location?: string;
  status: "available" | "reserved" | "sold" | "planted" | "needs_review";
};

type ActivityLog = {
  id: string;
  user: string;
  role: Role;
  action: string;
  timestamp: string;
};

type YouthBadge = {
  id: string;
  participant_id: string;
  badge: string;
  description: string;
  date_awarded: string;
};

type IncidentRecord = {
  id: string;
  participant_id?: string;
  staff_id?: string;
  incident_type: string;
  urgency: "low" | "medium" | "high" | "emergency";
  summary: string;
  action_taken: string;
  parent_contacted: boolean;
  created_at: string;
};

type DailyTask = {
  id: string;
  week: number;
  day: string;
  title: string;
  pathway: string;
  description: string;
  skill: string;
  evidence: string;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const SESSION_KEY = "bff.master.activeUser";
const PROFILE_KEY = "bff.master.profiles";
const YOUTH_KEY = "bff.master.youth";
const SUPERVISOR_KEY = "bff.master.supervisors";
const GROWER_KEY = "bff.master.growers";
const VALUE_ADDED_KEY = "bff.master.valueAdded";
const ATTENDANCE_KEY = "bff.master.attendance";
const ASSESSMENT_KEY = "bff.master.assessments";
const WELLNESS_KEY = "bff.master.wellness";
const FEEDBACK_KEY = "bff.master.feedback";
const CROP_KEY = "bff.master.cropPlans";
const INVENTORY_KEY = "bff.master.inventory";
const ACTIVITY_KEY = "bff.master.activity";
const BADGE_KEY = "bff.master.badges";
const INCIDENT_KEY = "bff.master.incidents";
const RELATIONSHIP_KEY = "bff.master.relationships";
const PARENT_MESSAGE_KEY = "bff.master.parentMessages";
const LANG_KEY = "bff.master.lang";

const image = (file: string) => `/images/${file}`;

const IMG = {
  forest: image("SAM_0384.JPG"),
  forestBackup: image("GrowArea2.jpg"),
  growArea: image("Grow Area.png"),
  growArea2: image("GrowArea2.jpg"),
  ecosystem: image("ConnectFoodEcosystem_withimages.png"),
  youth: image("large (16).jpg"),
  youth2: image("large (15).jpg"),
  market: image("large (11).jpg"),
  fencing: image("Deer Fencing.png"),
  volunteers: image("Fence_volunteers.png"),
  compost: image("Compost_ElliottGarden.png"),
  seeds: image("Seeds_Jubilee Gardens.png"),
  partners: image("Partners.png"),
  queens: image("Queens Village.png"),
  csu: image("CSU_MParker.png"),
  wkbn: image("WKBN Interview.png"),
  flowers: image("culniary_edibleflowers.jpeg"),
  mushrooms: image("culniary_mushrooms.jpeg"),
  airport: image("SAM_0391.JPG"),
  military: image("SAM_0401.JPG"),
};

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

const protectedScreens: Partial<Record<Screen, AccessLevel[]>> = {
  supervisor: ["staff", "admin"],
  safety: ["staff", "admin"],
  data: ["staff", "admin", "board"],
  operations: ["staff", "admin"],
  staff: ["staff", "admin"],
  reports: ["staff", "admin", "family", "board"],
  parent: ["family", "staff", "admin"],
  board: ["board", "admin"],
  grant: ["board", "admin", "staff"],
};

const languageNames: Record<Lang, string> = {
  en: "English",
  es: "Español",
  tl: "Tagalog",
  it: "Italiano",
  he: "Hebrew",
  fr: "Français",
};

const copy: Record<Lang, { enter: string; register: string; roles: string; welcome: string }> = {
  en: { enter: "Enter The Ecosystem", register: "Register / Check In", roles: "Choose A Role", welcome: "Step into the Farm. Experience the wonders of life." },
  es: { enter: "Entrar al Ecosistema", register: "Registrarse / Llegada", roles: "Elegir un Rol", welcome: "Entre a la granja. Experimente las maravillas de la vida." },
  tl: { enter: "Pumasok sa Ecosystem", register: "Magparehistro / Check In", roles: "Pumili ng Gampanin", welcome: "Pumasok sa bukid. Damhin ang hiwaga ng buhay." },
  it: { enter: "Entra nell’Ecosistema", register: "Registrati / Check In", roles: "Scegli un Ruolo", welcome: "Entra nella fattoria. Vivi le meraviglie della vita." },
  he: { enter: "כניסה למערכת", register: "הרשמה / כניסה", roles: "בחרו תפקיד", welcome: "היכנסו לחווה. חוו את פלאי החיים." },
  fr: { enter: "Entrer dans l’écosystème", register: "S’inscrire / Arrivée", roles: "Choisir un rôle", welcome: "Entrez dans la ferme. Découvrez les merveilles de la vie." },
};

const proverbs = [
  "A seed becomes a harvest when people protect the conditions around it.",
  "Leadership grows through responsibility.",
  "Measure progress daily, but grow people patiently.",
  "A living ecosystem returns value to the community.",
  "Food access begins with hands, soil, tools, water, and trust.",
  "The first crop is trust.",
  "Youth grow stronger when adults listen before correcting.",
];

const curriculum: DailyTask[] = [
  { id: "w1d1", week: 1, day: "Day 1", title: "Orientation, safety, and belonging", pathway: "Youth Workforce", description: "Tour the farm, review PPE, understand rules, and begin the baseline check-in.", skill: "Safety and belonging", evidence: "Completed check-in, PPE review, orientation reflection" },
  { id: "w1d2", week: 1, day: "Day 2", title: "Regenerative land walk", pathway: "Regenerative Farming", description: "Observe soil, water, mulch, compost, trees, and signs of ecosystem health.", skill: "Observation", evidence: "Field notes and group discussion" },
  { id: "w2d1", week: 2, day: "Day 1", title: "Tools, gloves, and work readiness", pathway: "Workforce", description: "Practice safe tool use and jobsite expectations.", skill: "Responsibility", evidence: "Tool checklist" },
  { id: "w2d3", week: 2, day: "Day 3", title: "Seeds and Bubble Babies", pathway: "Production", description: "Prepare seed rolls, labels, and inventory records.", skill: "Production accuracy", evidence: "Labeled Bubble Babies batch" },
  { id: "w3d2", week: 3, day: "Day 2", title: "Crop planning and zones", pathway: "Grower", description: "Map crops to zones and connect tasks to expected harvest.", skill: "Planning", evidence: "Crop plan entry" },
  { id: "w4d1", week: 4, day: "Day 1", title: "Marketplace readiness", pathway: "Marketplace", description: "Understand customer service, product display, pricing, SNAP awareness, and food access.", skill: "Communication", evidence: "Mock market setup" },
  { id: "w5d2", week: 5, day: "Day 2", title: "Compost, mulch, and zero-waste thinking", pathway: "Regenerative Farming", description: "Study compost inputs, wood ash, mulch, leaves, cardboard, and soil-building practices.", skill: "Systems thinking", evidence: "Regenerative practice log" },
  { id: "w6d1", week: 6, day: "Day 1", title: "Leadership and teamwork", pathway: "Life Skills", description: "Practice crew leadership, communication, conflict resolution, and responsibility.", skill: "Teamwork", evidence: "Supervisor rubric" },
  { id: "w7d3", week: 7, day: "Day 3", title: "Value-added products", pathway: "Enterprise", description: "Learn how food can become products while respecting safety, licensing, kitchen, and insurance needs.", skill: "Enterprise awareness", evidence: "Product pathway note" },
  { id: "w8d5", week: 8, day: "Day 5", title: "Reflection, badges, and next step", pathway: "Graduation", description: "Review progress, award badges, and identify next opportunity.", skill: "Reflection", evidence: "Final reflection and badge record" },
];

const badges = [
  "PPE Ready",
  "Safety Steward",
  "Regenerative Observer",
  "Bubble Babies Producer",
  "Crop Planner",
  "Marketplace Helper",
  "Team Builder",
  "Tool Care",
  "Community Food Access",
  "Youth Leader",
];

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
  } catch {
    // browser storage may be unavailable
  }
}

function addLocal<T extends { id: string }>(key: string, row: T) {
  const rows = safeRead<T[]>(key, []);
  safeWrite(key, [row, ...rows]);
}

async function insertRow<T extends { id: string }>(table: string, localKey: string, row: T) {
  addLocal(localKey, row);
  if (!supabase) return { data: row, error: null, mode: "local" as const };
  try {
    const { data, error } = await supabase.from(table).insert(row).select().single();
    if (error) return { data: row, error, mode: "local-fallback" as const };
    return { data, error: null, mode: "supabase" as const };
  } catch (error) {
    return { data: row, error, mode: "local-fallback" as const };
  }
}

function updateActivity(user: EcosystemUser | null, action: string) {
  if (!user) return;
  const rows = safeRead<ActivityLog[]>(ACTIVITY_KEY, []);
  const item: ActivityLog = { id: uuid(), user: user.name, role: user.role, action, timestamp: nowLabel() };
  safeWrite(ACTIVITY_KEY, [item, ...rows].slice(0, 60));
}

function canAccessScreen(user: EcosystemUser | null, screen: Screen) {
  const required = protectedScreens[screen];
  if (!required) return true;
  if (!user) return false;
  return required.includes(user.accessLevel);
}

function routeForRole(role: Role): Screen {
  const map: Record<Role, Screen> = {
    Guest: "guest",
    "Youth Workforce Participant": "youth",
    "Parent / Guardian": "parent",
    "Supervisor / Staff": "supervisor",
    Grower: "grower",
    "Marketplace Customer": "marketplace",
    Volunteer: "volunteer",
    Partner: "partners",
    Administrator: "operations",
    "Value-Added Producer": "valueAdded",
    "Board / Funder": "board",
  };
  return map[role];
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

function latestProfileByName(firstName: string, lastName: string) {
  const profiles = safeRead<MasterProfile[]>(PROFILE_KEY, []);
  return profiles.find(
    (p) =>
      p.first_name.trim().toLowerCase() === firstName.trim().toLowerCase() &&
      p.last_name.trim().toLowerCase() === lastName.trim().toLowerCase()
  );
}

function profilesByType(profileType: ProfileType) {
  return safeRead<MasterProfile[]>(PROFILE_KEY, []).filter((p) => p.profile_type === profileType);
}

function profileLabel(profile: MasterProfile) {
  return `${profile.preferred_name || profile.first_name} ${profile.last_name}`.trim() || profile.organization_name || profile.id;
}

function findYouthByProfile(profileId: string) {
  return safeRead<YouthRegistration[]>(YOUTH_KEY, []).find((y) => y.profile_id === profileId);
}

function getParentSafeProgress(participantId?: string) {
  const attendance = safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []).filter((a) => !participantId || a.participant_id === participantId);
  const assessments = safeRead<AssessmentRecord[]>(ASSESSMENT_KEY, []).filter((a) => !participantId || a.participant_id === participantId);
  const badges = safeRead<YouthBadge[]>(BADGE_KEY, []).filter((b) => !participantId || b.participant_id === participantId);
  const messages = safeRead<ParentMessage[]>(PARENT_MESSAGE_KEY, []).filter((m) => !participantId || m.participant_id === participantId);
  return { attendance, assessments, badges, messages };
}

function useActiveUser() {
  const [activeUser, setActiveUser] = useState<EcosystemUser | null>(() => safeRead<EcosystemUser | null>(SESSION_KEY, null));

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
    updateActivity(user, "entered the ecosystem");
    return user;
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    safeWrite<EcosystemUser | null>(SESSION_KEY, null);
    setActiveUser(null);
  };

  return { activeUser, signIn, signOut };
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.08;
  utterance.volume = 0.95;
  utterance.lang = "en-US";
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /George|Guy|David|Daniel|Microsoft Mark|Google US English/i.test(v.name)) ||
    voices.find((v) => v.lang === "en-US" && !/Huihui|Haruka|Heami|Kangkang|Yaoyao|Zira/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

function stopSpeak() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
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
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-emerald-200"
      />
    </label>
  );
}

function SelectField(props: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">{props.label}</span>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-emerald-200"
      >
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
        rows={4}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-emerald-200"
      />
    </label>
  );
}

function Shell({
  children,
  screen,
  setScreen,
  background = IMG.forest,
  compactNav = false,
  lang,
  setLang,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  background?: string;
  compactNav?: boolean;
  lang: Lang;
  setLang: (lang: Lang) => void;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img src={background} alt="Bronson Family Farm" className="h-full w-full scale-[1.02] object-cover" onError={(e) => (e.currentTarget.src = IMG.forestBackup)} />
      </div>
      <div className="fixed inset-0 bg-black/48" />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.28),rgba(0,0,0,.64)),radial-gradient(circle_at_top_left,rgba(255,255,255,.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(16,185,129,.14),transparent_34%)]" />
      <div className="relative z-10 mx-auto max-w-[1560px] px-3 py-3 md:px-6">
        {!compactNav && <Navigation screen={screen} setScreen={setScreen} lang={lang} setLang={setLang} />}
        {!compactNav && <AccessRibbon />}
        {children}
      </div>
    </div>
  );
}

function Navigation({ screen, setScreen, lang, setLang }: { screen: Screen; setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  const nav: { label: string; screen: Screen }[] = [
    { label: "Portal", screen: "portal" },
    { label: "Guest", screen: "guest" },
    { label: "Register", screen: "registration" },
    { label: "Roles", screen: "roles" },
    { label: "Youth", screen: "youth" },
    { label: "Curriculum", screen: "curriculum" },
    { label: "Supervisor", screen: "supervisor" },
    { label: "Parent", screen: "parent" },
    { label: "Grower", screen: "grower" },
    { label: "Value-Added", screen: "valueAdded" },
    { label: "Crop", screen: "crop" },
    { label: "Inventory", screen: "inventory" },
    { label: "Market", screen: "marketplace" },
    { label: "Wellness", screen: "wellness" },
    { label: "Feedback", screen: "feedback" },
    { label: "Reports", screen: "reports" },
    { label: "Ops", screen: "operations" },
    { label: "History", screen: "history" },
  ];

  return (
    <div className="sticky top-2 z-40 mb-3 rounded-[1.25rem] border border-white/10 bg-black/50 p-2 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setScreen("portal")} className="mr-2 min-w-[175px] px-2 text-left">
          <div className="text-[10px] uppercase tracking-[0.32em] text-emerald-100/70">Bronson Family Farm</div>
          <div className="text-base font-black leading-tight">Master Ecosystem</div>
        </button>
        {nav.map((item) => (
          <button
            key={item.screen}
            onClick={() => setScreen(item.screen)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold backdrop-blur-xl transition ${
              screen === item.screen ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {item.label}
          </button>
        ))}
        <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="ml-auto rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs font-black text-white">
          {(Object.keys(languageNames) as Lang[]).map((key) => (
            <option key={key} value={key} className="bg-black">{languageNames[key]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function AccessRibbon() {
  const user = safeRead<EcosystemUser | null>(SESSION_KEY, null);
  const activity = safeRead<ActivityLog[]>(ACTIVITY_KEY, []);
  const latest = activity[0];

  return (
    <div className="mb-3 rounded-[1.25rem] border border-emerald-200/15 bg-black/38 p-2.5 shadow-[0_20px_70px_rgba(0,0,0,.35)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-100/70">Secure Role Access</div>
          <div className="mt-1 text-sm font-black text-white">
            {user ? `${user.name} • ${user.role} • ${user.accessLevel} access` : "Guest/public access active — register or enter by role for protected tools"}
          </div>
        </div>
        {latest && <div className="rounded-full bg-emerald-300 px-3 py-1.5 text-[11px] font-black text-black">Latest: {latest.action}</div>}
      </div>
    </div>
  );
}

function HeroCard({ eyebrow, title, text, image, children }: { eyebrow: string; title: string; text: string; image?: string; children?: React.ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-[0_35px_100px_rgba(0,0,0,.48)] backdrop-blur-2xl md:p-8">
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">{eyebrow}</div>
        <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/85 md:text-lg">{text}</p>
        {children && <div className="mt-6">{children}</div>}
      </div>
      <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_35px_100px_rgba(0,0,0,.48)]">
        <img src={image || IMG.growArea2} alt={title} className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.src = IMG.growArea2)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      </div>
    </div>
  );
}

function ActionGrid({ items, setScreen }: { items: { title: string; text: string; screen?: Screen; href?: string }[]; setScreen: (screen: Screen) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.title}
          onClick={() => (item.href ? window.open(item.href, "_blank", "noopener,noreferrer") : item.screen && setScreen(item.screen))}
          className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-emerald-300 hover:text-black"
        >
          <div className="text-lg font-black">{item.title}</div>
          <div className="mt-2 text-sm leading-6 opacity-90">{item.text}</div>
        </button>
      ))}
    </div>
  );
}

function StatGrid() {
  const profiles = safeRead<MasterProfile[]>(PROFILE_KEY, []);
  const youth = safeRead<YouthRegistration[]>(YOUTH_KEY, []);
  const attendance = safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []);
  const assessments = safeRead<AssessmentRecord[]>(ASSESSMENT_KEY, []);
  const wellness = safeRead<WellnessCheckIn[]>(WELLNESS_KEY, []);
  const feedback = safeRead<FeedbackRecord[]>(FEEDBACK_KEY, []);
  const inventory = safeRead<InventoryItem[]>(INVENTORY_KEY, []);
  const incidents = safeRead<IncidentRecord[]>(INCIDENT_KEY, []);
  const relationships = safeRead<RelationshipRecord[]>(RELATIONSHIP_KEY, []);
  const parentMessages = safeRead<ParentMessage[]>(PARENT_MESSAGE_KEY, []);

  const stats = [
    ["Profiles", profiles.length.toString(), "Registration hub"],
    ["Youth", youth.length.toString(), "Participants"],
    ["Attendance", attendance.length.toString(), "Daily records"],
    ["Assessments", assessments.length.toString(), "Supervisor records"],
    ["Wellness", wellness.length.toString(), "Private check-ins"],
    ["Feedback", feedback.length.toString(), "Experience responses"],
    ["Inventory", inventory.length.toString(), "Market items"],
    ["Incidents", incidents.length.toString(), "Staff-only reports"],
    ["Links", relationships.length.toString(), "Profile relationships"],
    ["Messages", parentMessages.length.toString(), "Parent-safe notes"],
  ];

  return (
    <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-5">
      {stats.map(([label, value, note]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-100/70">{label}</div>
          <div className="mt-2 text-3xl font-black">{value}</div>
          <div className="mt-1 text-xs text-white/70">{note}</div>
        </div>
      ))}
    </div>
  );
}

function Portal({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="portal" setScreen={setScreen} background={IMG.forest} compactNav lang={lang} setLang={setLang}>
      <div className="grid min-h-[calc(100vh-2rem)] items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-4xl">
          <div className="rounded-[2.25rem] border border-white/10 bg-black/36 p-6 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl md:p-9">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(languageNames) as Lang[]).map((key) => (
                <button key={key} onClick={() => setLang(key)} className={`rounded-full border px-3 py-1.5 text-xs font-black ${lang === key ? "bg-emerald-300 text-black" : "bg-white/10 text-white border-white/15"}`}>
                  {languageNames[key]}
                </button>
              ))}
            </div>
            <div className="mt-5 text-xs uppercase tracking-[0.4em] text-emerald-100/85">Bronson Family Farm</div>
            <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">Enter The Ecosystem.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/92 md:text-xl md:leading-9">{copy[lang].welcome}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => setScreen("guest")} className="rounded-full bg-emerald-300 px-8 py-4 font-black text-black shadow-2xl transition hover:scale-105">{copy[lang].enter}</button>
              <button onClick={() => setScreen("registration")} className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-black text-white backdrop-blur-xl transition hover:bg-white/20">{copy[lang].register}</button>
              <button onClick={() => setScreen("roles")} className="rounded-full border border-white/20 bg-black/35 px-8 py-4 font-black text-white backdrop-blur-xl transition hover:bg-white/20">{copy[lang].roles}</button>
            </div>
          </div>
        </div>
        <div className="rounded-[2.25rem] border border-white/10 bg-black/32 p-5 shadow-[0_40px_120px_rgba(0,0,0,.62)] backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">Master Version</div>
          <div className="mt-4 grid gap-3">
            {[
              "Registration feeds autofill across forms.",
              "Morning check-ins establish baseline for youth and supervisors.",
              "Private wellness stays internal and staff-only when sensitive.",
              "Parents see progress, skills, badges, and encouragement — not private raw reflections.",
              "Supervisor tools collect attendance, PPE, assessments, LSP-style growth, and incidents.",
              "Crop, inventory, marketplace, and reporting connect the full food ecosystem.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/85">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Guest({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  const [step, setStep] = useState(0);
  const [narrationOn, setNarrationOn] = useState(false);
  const steps = [
    { title: "Arrive first. Understand later.", text: "The farm begins as a threshold. Guests enter the land before the ecosystem is fully explained.", image: IMG.forest },
    { title: "The land becomes a system.", text: "Food, youth work, grower support, wellness, marketplace movement, and reporting connect into one living ecosystem.", image: IMG.growArea2 },
    { title: "The airport story matters.", text: "Bronson Family Farm operates in a place with history, land, aviation, service, and community memory. Youth should learn the place while they work the land.", image: IMG.airport },
    { title: "Regenerative farming restores land.", text: "Regenerative work means improving soil, conserving water, using compost and mulch, protecting biodiversity, reducing waste, and growing in relationship with the land.", image: IMG.compost },
    { title: "The youth pathway is protected.", text: "Youth reflections are not automatically sent to parents. Staff see wellness patterns. Parents see progress, skills, and encouragement.", image: IMG.youth },
    { title: "Registration powers autofill.", text: "Once a person registers, future forms pull the right profile information automatically.", image: IMG.ecosystem },
    { title: "The ecosystem reports impact.", text: "Attendance, PPE, assessments, wellness trends, crop plans, feedback, inventory, marketplace activity, and parent progress become reports.", image: IMG.partners },
  ];
  const current = steps[step];

  useEffect(() => {
    if (narrationOn) speak(`${current.title}. ${current.text}`);
    return () => stopSpeak();
  }, [step, narrationOn]);

  return (
    <Shell screen="guest" setScreen={setScreen} background={current.image} lang={lang} setLang={setLang}>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-[0_35px_100px_rgba(0,0,0,.48)] backdrop-blur-2xl md:p-8">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Guided Guest Journey</div>
          <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">{current.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/88">{current.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setStep(Math.max(0, step - 1))} className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-black">Back</button>
            <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className="rounded-full bg-emerald-300 px-5 py-3 font-black text-black">Go Forward</button>
            <button onClick={() => setNarrationOn((v) => !v)} className="rounded-full border border-white/20 bg-black/35 px-5 py-3 font-black">{narrationOn ? "Stop Narration" : "Start Narration"}</button>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/80">
            Step {step + 1} of {steps.length}. The guided journey moves slowly so people can see the screen first, then receive the next layer.
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-black/45 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Next Actions</div>
          <ActionGrid
            setScreen={setScreen}
            items={[
              { title: "Register", text: "Enter the system as youth, supervisor, grower, producer, parent, volunteer, partner, customer, or board/funder.", screen: "registration" },
              { title: "Youth Pathway", text: "Protected youth check-in, wellness, attendance, badges, tasks, and reflection.", screen: "youth" },
              { title: "Supervisor Tools", text: "Mobile workflow for attendance, PPE, assessment, LSP growth, and support alerts.", screen: "supervisor" },
              { title: "Curriculum", text: "Eight-week program engine with tasks and evidence.", screen: "curriculum" },
              { title: "Reports", text: "Outcome data, parent progress, wellness trends, and ecosystem health.", screen: "reports" },
              { title: "History", text: "Airport, military, legacy, and land-learning path.", screen: "history" },
            ]}
          />
        </div>
      </div>
    </Shell>
  );
}

function Account({ setScreen, signIn, lang, setLang }: { setScreen: (screen: Screen) => void; signIn: (role: Role, name?: string) => EcosystemUser; lang: Lang; setLang: (lang: Lang) => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("Supervisor / Staff");
  const enter = () => {
    const user = signIn(role, name);
    setScreen(routeForRole(user.role));
  };

  return (
    <Shell screen="account" setScreen={setScreen} background={IMG.growArea2} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Access" title="Enter by role." text="Use this access screen to test protected pathways. Full registration lives in the Registration Hub." image={IMG.ecosystem}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Display name" value={name} onChange={setName} placeholder="Supervisor, youth, grower, parent..." />
          <SelectField label="Role" value={role} onChange={(value) => setRole(value as Role)} options={roles} />
        </div>
        <button onClick={enter} className="mt-5 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Enter Role Pathway</button>
      </HeroCard>
    </Shell>
  );
}

function RegistrationHub({ setScreen, activeUser, lang, setLang }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; lang: Lang; setLang: (lang: Lang) => void }) {
  const [profileType, setProfileType] = useState<ProfileType>("youth");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Youngstown");
  const [state, setState] = useState("OH");
  const [zip, setZip] = useState("");
  const [message, setMessage] = useState("");

  const [crew, setCrew] = useState("Crew A");
  const [ageRange, setAgeRange] = useState("14-18");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [trustedAdult, setTrustedAdult] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [programGoal, setProgramGoal] = useState("");

  const [farmName, setFarmName] = useState("");
  const [cropsGrown, setCropsGrown] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [marketInterest, setMarketInterest] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [productCategories, setProductCategories] = useState("");
  const [licenseStatus, setLicenseStatus] = useState("Need guidance");
  const [kitchenType, setKitchenType] = useState("Home kitchen");
  const [insuranceStatus, setInsuranceStatus] = useState("Need guidance");
  const [relationshipTarget, setRelationshipTarget] = useState("");
  const [parentYouthName, setParentYouthName] = useState("");
  const [supervisorCrewLimit, setSupervisorCrewLimit] = useState("15");
  const [volunteerInterest, setVolunteerInterest] = useState("");
  const [partnerSupport, setPartnerSupport] = useState("");
  const [customerInterest, setCustomerInterest] = useState("");

  const submit = async () => {
    const profile: MasterProfile = {
      id: uuid(),
      profile_type: profileType,
      first_name: firstName,
      last_name: lastName,
      preferred_name: preferredName,
      organization_name: organizationName,
      email,
      phone,
      city,
      state,
      zip,
      active: true,
      created_at: new Date().toISOString(),
    };
    await insertRow("profiles", PROFILE_KEY, profile);

    if (profileType === "youth") {
      const youth: YouthRegistration = {
        id: uuid(),
        profile_id: profile.id,
        participant_id: `YTH-${Date.now().toString().slice(-5)}`,
        age_range: ageRange,
        crew,
        guardian_name: guardianName,
        guardian_phone: guardianPhone,
        guardian_email: guardianEmail,
        trusted_adult: trustedAdult,
        emergency_contact: emergencyContact,
        medical_notes: "",
        media_release: false,
        transportation_plan: "",
        program_goal: programGoal,
      };
      await insertRow("youth_registrations", YOUTH_KEY, youth);
    }

    if (profileType === "supervisor") {
      const supervisor: SupervisorRegistration = {
        id: uuid(),
        profile_id: profile.id,
        crew,
        role_title: "Supervisor Aide",
        training_completed: false,
        background_check_status: "Pending",
        emergency_contact: emergencyContact,
        support_needed: "",
      };
      await insertRow("supervisor_registrations", SUPERVISOR_KEY, supervisor);
    }

    if (profileType === "grower") {
      const grower: GrowerRegistration = {
        id: uuid(),
        profile_id: profile.id,
        farm_name: farmName || organizationName,
        growing_area: "",
        crops_grown: cropsGrown,
        water_source: waterSource,
        equipment_available: "",
        market_interest: marketInterest,
      };
      await insertRow("grower_registrations", GROWER_KEY, grower);
    }

    if (profileType === "value_added") {
      const valueAdded: ValueAddedRegistration = {
        id: uuid(),
        profile_id: profile.id,
        business_name: businessName || organizationName,
        product_categories: productCategories,
        license_status: licenseStatus,
        kitchen_type: kitchenType,
        insurance_status: insuranceStatus,
        capacity: "",
      };
      await insertRow("value_added_registrations", VALUE_ADDED_KEY, valueAdded);
    }

    if (profileType === "parent" && parentYouthName.trim()) {
      const relationship: RelationshipRecord = {
        id: uuid(),
        primary_profile_id: profile.id,
        related_profile_id: parentYouthName.trim(),
        relationship_type: "parent_to_youth",
        status: "pending",
        notes: "Parent/guardian linked by youth name or participant ID. Staff should verify.",
        created_at: new Date().toISOString(),
      };
      await insertRow("relationship_records", RELATIONSHIP_KEY, relationship);
    }

    if (profileType === "supervisor" && relationshipTarget.trim()) {
      const relationship: RelationshipRecord = {
        id: uuid(),
        primary_profile_id: profile.id,
        related_profile_id: relationshipTarget.trim(),
        relationship_type: "supervisor_to_youth",
        status: "pending",
        notes: `Supervisor crew assignment. Max youth target: ${supervisorCrewLimit}`,
        created_at: new Date().toISOString(),
      };
      await insertRow("relationship_records", RELATIONSHIP_KEY, relationship);
    }

    if (profileType === "partner" && partnerSupport.trim()) {
      const relationship: RelationshipRecord = {
        id: uuid(),
        primary_profile_id: profile.id,
        related_profile_id: "Bronson Family Farm / Farm & Family Alliance",
        relationship_type: "partner_to_program",
        status: "active",
        notes: partnerSupport,
        created_at: new Date().toISOString(),
      };
      await insertRow("relationship_records", RELATIONSHIP_KEY, relationship);
    }

    if (profileType === "volunteer" && volunteerInterest.trim()) {
      const relationship: RelationshipRecord = {
        id: uuid(),
        primary_profile_id: profile.id,
        related_profile_id: "Volunteer Program",
        relationship_type: "volunteer_to_program",
        status: "pending",
        notes: volunteerInterest,
        created_at: new Date().toISOString(),
      };
      await insertRow("relationship_records", RELATIONSHIP_KEY, relationship);
    }

    updateActivity(activeUser, `registered ${profileType}`);
    setMessage("Registration saved. This profile now feeds role dashboards, autofill, reports, and protected access relationships.");
  };

  return (
    <Shell screen="registration" setScreen={setScreen} background={IMG.ecosystem} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Registration Hub" title="One intake. Many pathways." text="This is the shared profile and relationship layer. Youth, supervisors, parents, growers, value-added producers, volunteers, partners, customers, and board/funders register here so future forms, dashboards, parent-safe reports, and role tools can autofill." image={IMG.growArea}>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Registration type" value={profileType} onChange={(v) => setProfileType(v as ProfileType)} options={["youth", "supervisor", "parent", "grower", "value_added", "volunteer", "partner", "customer", "board"]} />
          <Field label="First name" value={firstName} onChange={setFirstName} />
          <Field label="Last name" value={lastName} onChange={setLastName} />
          <Field label="Preferred name" value={preferredName} onChange={setPreferredName} />
          <Field label="Organization / farm / business" value={organizationName} onChange={setOrganizationName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="Phone" value={phone} onChange={setPhone} />
          <Field label="City" value={city} onChange={setCity} />
          <Field label="State" value={state} onChange={setState} />
          <Field label="ZIP" value={zip} onChange={setZip} />
        </div>

        {(profileType === "youth" || profileType === "supervisor") && (
          <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 md:grid-cols-2">
            <SelectField label="Crew" value={crew} onChange={setCrew} options={["Crew A", "Crew B", "Crew C", "Crew D", "Floating / Support"]} />
            {profileType === "youth" && <SelectField label="Age range" value={ageRange} onChange={setAgeRange} options={["14-15", "16-18", "18+", "Other"]} />}
            <Field label="Guardian name" value={guardianName} onChange={setGuardianName} />
            <Field label="Guardian phone" value={guardianPhone} onChange={setGuardianPhone} />
            <Field label="Guardian email" value={guardianEmail} onChange={setGuardianEmail} />
            <Field label="Trusted adult" value={trustedAdult} onChange={setTrustedAdult} />
            <Field label="Emergency contact" value={emergencyContact} onChange={setEmergencyContact} />
            <Field label="Program goal" value={programGoal} onChange={setProgramGoal} />
          </div>
        )}

        {profileType === "grower" && (
          <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 md:grid-cols-2">
            <Field label="Farm name" value={farmName} onChange={setFarmName} />
            <Field label="Crops grown" value={cropsGrown} onChange={setCropsGrown} />
            <Field label="Water source" value={waterSource} onChange={setWaterSource} />
            <Field label="Market interest" value={marketInterest} onChange={setMarketInterest} />
          </div>
        )}

        {profileType === "value_added" && (
          <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 md:grid-cols-2">
            <Field label="Business name" value={businessName} onChange={setBusinessName} />
            <Field label="Product categories" value={productCategories} onChange={setProductCategories} />
            <SelectField label="License status" value={licenseStatus} onChange={setLicenseStatus} options={["Licensed", "In process", "Need guidance", "Not applicable"]} />
            <SelectField label="Kitchen type" value={kitchenType} onChange={setKitchenType} options={["Home kitchen", "Shared commercial kitchen", "Commercial kitchen", "Need kitchen access"]} />
            <SelectField label="Insurance status" value={insuranceStatus} onChange={setInsuranceStatus} options={["Insured", "In process", "Need guidance", "Not applicable"]} />
          </div>
        )}

        {profileType === "parent" && (
          <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 md:grid-cols-2">
            <Field label="Youth name or participant ID to link" value={parentYouthName} onChange={setParentYouthName} />
            <TextArea label="Parent/guardian notes" value={customerInterest} onChange={setCustomerInterest} placeholder="Transportation, communication preference, family support needs..." />
            <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4 text-sm leading-7 md:col-span-2">
              Parent accounts link to youth progress, attendance, badges, and supervisor-approved updates. Private youth wellness reflections remain staff-only.
            </div>
          </div>
        )}

        {profileType === "supervisor" && (
          <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 md:grid-cols-2">
            <Field label="Assigned youth / crew / group" value={relationshipTarget} onChange={setRelationshipTarget} />
            <Field label="Maximum youth target" value={supervisorCrewLimit} onChange={setSupervisorCrewLimit} />
            <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4 text-sm leading-7 md:col-span-2">
              Supervisor access is for approved staff only. Supervisors can enter attendance, PPE, assessments, badges, parent-safe updates, and safety/support records.
            </div>
          </div>
        )}

        {profileType === "volunteer" && (
          <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 md:grid-cols-2">
            <TextArea label="Volunteer interests" value={volunteerInterest} onChange={setVolunteerInterest} placeholder="Planting, setup, teardown, event support, market support, supplies..." />
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7">
              Volunteers support the farm and events but do not receive access to protected youth records.
            </div>
          </div>
        )}

        {profileType === "partner" && (
          <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 md:grid-cols-2">
            <TextArea label="Partner support area" value={partnerSupport} onChange={setPartnerSupport} placeholder="Water, tools, education, wellness, market access, youth workforce, transportation..." />
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7">
              Partner records help convert support into visible outcomes and grant/funder reporting.
            </div>
          </div>
        )}

        {profileType === "customer" && (
          <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 md:grid-cols-2">
            <TextArea label="Customer interest" value={customerInterest} onChange={setCustomerInterest} placeholder="Seedlings, Bubble Babies, produce, events, nutrition, SNAP-eligible products..." />
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7">
              Customer registration prepares marketplace follow-up, pickup communication, and repeat healthy food choices.
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={submit} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Registration</button>
          <button onClick={() => setScreen("account")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black text-white">Enter Role</button>
        </div>
        {message && <div className="mt-4 rounded-2xl bg-emerald-300/20 p-4 font-black text-emerald-50">{message}</div>}
      </HeroCard>
    </Shell>
  );
}

function YouthScreen({ setScreen, activeUser, lang, setLang }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="youth" setScreen={setScreen} background={IMG.youth} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Youth Workforce" title="Begin the day with awareness." text="Youth start with a simple baseline. This helps supervisors understand feelings, energy, needs, food readiness, and support without turning private reflection into parent-facing information." image={IMG.youth2}>
        <ActionGrid
          setScreen={setScreen}
          items={[
            { title: "Morning Wellness Check-In", text: "Mood, energy, sleep, breakfast, hope, belonging, trusted adult, confidence, stress, and support needs.", screen: "wellness" },
            { title: "Daily Curriculum", text: "Eight-week program with daily tasks, skill evidence, badges, and reflection.", screen: "curriculum" },
            { title: "Crop + Grow Work", text: "Attendance, PPE, tasks, crop learning, safety, responsibility, and teamwork.", screen: "crop" },
            { title: "End-of-Day Reflection", text: "What was learned, what was hard, what support is needed, and what improved.", screen: "feedback" },
            { title: "Parent-Safe Progress", text: "Parents see attendance, badges, supervisor notes, and growth — not private mental health entries.", screen: "parent" },
            { title: "Regenerative Learning", text: "Understand soil, water, compost, mulch, land restoration, and zero-waste practices.", screen: "regenerative" },
          ]}
        />
      </HeroCard>
    </Shell>
  );
}

function SupervisorScreen({ setScreen, activeUser, lang, setLang }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; lang: Lang; setLang: (lang: Lang) => void }) {
  const [participantId, setParticipantId] = useState("");
  const [status, setStatus] = useState("Present");
  const [ppeStatus, setPpeStatus] = useState("Complete");
  const [notes, setNotes] = useState("");
  const [safety, setSafety] = useState(3);
  const [teamwork, setTeamwork] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [responsibility, setResponsibility] = useState(3);
  const [initiative, setInitiative] = useState(3);
  const [problemSolving, setProblemSolving] = useState(3);
  const [message, setMessage] = useState("");

  const saveAttendance = async () => {
    const row: AttendanceRecord = { id: uuid(), participant_id: participantId || "unknown", supervisor_id: activeUser?.id, date: todayISO(), check_in_time: nowLabel(), status, ppe_status: ppeStatus, qr_method: "manual_or_qr_ready", notes };
    await insertRow("attendance_records", ATTENDANCE_KEY, row);
    updateActivity(activeUser, "saved attendance");
    setMessage("Attendance saved.");
  };

  const saveAssessment = async () => {
    const row: AssessmentRecord = { id: uuid(), participant_id: participantId || "unknown", supervisor_id: activeUser?.id, date: todayISO(), safety, teamwork, communication, responsibility, initiative, problem_solving: problemSolving, notes };
    await insertRow("assessment_records", ASSESSMENT_KEY, row);
    updateActivity(activeUser, "saved assessment");
    setMessage("Assessment saved.");
  };

  const awardBadge = async (badge: string) => {
    const row: YouthBadge = { id: uuid(), participant_id: participantId || "unknown", badge, description: `${badge} awarded by supervisor`, date_awarded: todayISO() };
    await insertRow("youth_badges", BADGE_KEY, row);
    updateActivity(activeUser, `awarded ${badge}`);
    setMessage(`${badge} badge saved.`);
  };

  return (
    <Shell screen="supervisor" setScreen={setScreen} background={IMG.volunteers} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Supervisor Mobile Workflow" title="Supervisors protect, guide, observe, and record." text="Supervisors handle daily start, PPE, attendance, support observation, skill scoring, LSP-style growth, badges, and safety routing. Each supervisor should work with no more than 15 youth." image={IMG.fencing}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Participant ID or name" value={participantId} onChange={setParticipantId} />
          <SelectField label="Attendance" value={status} onChange={setStatus} options={["Present", "Late", "Absent", "Excused", "Left Early"]} />
          <SelectField label="PPE status" value={ppeStatus} onChange={setPpeStatus} options={["Complete", "Missing gloves", "Missing shoes", "Missing water", "Not cleared to work"]} />
          <TextArea label="Supervisor notes" value={notes} onChange={setNotes} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {[["Safety", safety, setSafety], ["Teamwork", teamwork, setTeamwork], ["Communication", communication, setCommunication], ["Responsibility", responsibility, setResponsibility], ["Initiative", initiative, setInitiative], ["Problem Solving", problemSolving, setProblemSolving]].map(([label, value, setter]) => (
            <label key={label as string} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-sm font-black">{label as string}</div>
              <input type="range" min={1} max={5} value={value as number} onChange={(e) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value))} className="mt-4 w-full" />
              <div className="mt-2 text-2xl font-black">{value as number}/5</div>
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <button key={badge} onClick={() => awardBadge(badge)} className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black">{badge}</button>
          ))}
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Parent-safe update</div>
          <p className="mt-2 text-sm leading-7 text-white/75">Use this only for progress, attendance, badges, encouragement, or general updates. Do not place private youth wellness reflections here.</p>
          <button
            onClick={async () => {
              const row: ParentMessage = {
                id: uuid(),
                participant_id: participantId || "unknown",
                sender_role: "supervisor",
                message_type: "progress",
                subject: "Progress update",
                body: notes || "Youth participated in today's farm workforce activities.",
                parent_safe: true,
                created_at: new Date().toISOString(),
              };
              await insertRow("parent_messages", PARENT_MESSAGE_KEY, row);
              updateActivity(activeUser, "sent parent-safe progress update");
              setMessage("Parent-safe progress update saved.");
            }}
            className="mt-4 rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black"
          >
            Save Parent-Safe Update
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={saveAttendance} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Attendance</button>
          <button onClick={saveAssessment} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black text-white">Save Assessment</button>
          <button onClick={() => setScreen("safety")} className="rounded-full border border-red-200/30 bg-red-500/20 px-7 py-4 font-black text-white">Safety / Support Flag</button>
          <button onClick={() => setScreen("curriculum")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black text-white">Daily Curriculum</button>
        </div>
        {message && <div className="mt-4 rounded-2xl bg-emerald-300/20 p-4 font-black">{message}</div>}
      </HeroCard>
    </Shell>
  );
}

function CurriculumScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  const [week, setWeek] = useState(1);
  const filtered = curriculum.filter((task) => task.week === week);
  return (
    <Shell screen="curriculum" setScreen={setScreen} background={IMG.growArea2} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="8-Week Youth Workforce Program" title="Daily activities become tracked evidence." text="This curriculum engine connects each lesson to skills, task evidence, badges, supervisor scoring, crop/inventory work, and parent-safe progress." image={IMG.youth2}>
        <div className="flex flex-wrap gap-2">
          {[1,2,3,4,5,6,7,8].map((n) => (
            <button key={n} onClick={() => setWeek(n)} className={`rounded-full px-4 py-2 text-sm font-black ${week === n ? "bg-emerald-300 text-black" : "bg-white/10 text-white border border-white/10"}`}>Week {n}</button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {filtered.length ? filtered.map((task) => (
            <div key={task.id} className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">{task.day} • {task.pathway}</div>
              <div className="mt-2 text-2xl font-black">{task.title}</div>
              <p className="mt-3 text-sm leading-7 text-white/80">{task.description}</p>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="rounded-2xl bg-black/30 p-3"><b>Skill:</b> {task.skill}</div>
                <div className="rounded-2xl bg-black/30 p-3"><b>Evidence:</b> {task.evidence}</div>
              </div>
            </div>
          )) : (
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">This week is ready for additional lessons.</div>
          )}
        </div>
      </HeroCard>
    </Shell>
  );
}

function WellnessScreen({ setScreen, activeUser, lang, setLang }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; lang: Lang; setLang: (lang: Lang) => void }) {
  const [profileId, setProfileId] = useState(activeUser?.id || "guest");
  const [profileType, setProfileType] = useState<ProfileType>(activeUser ? roleToProfileType(activeUser.role) : "youth");
  const [checkinType, setCheckinType] = useState<WellnessCheckIn["checkin_type"]>("morning");
  const [mood, setMood] = useState("Okay");
  const [energy, setEnergy] = useState("Medium");
  const [sleep, setSleep] = useState("Okay");
  const [breakfast, setBreakfast] = useState("Yes");
  const [hope, setHope] = useState(3);
  const [belonging, setBelonging] = useState(3);
  const [trustedAdult, setTrustedAdult] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [stress, setStress] = useState(3);
  const [support, setSupport] = useState("");
  const [privateNote, setPrivateNote] = useState("");
  const [message, setMessage] = useState("");

  const safetyFlag = hope <= 1 || trustedAdult <= 1 || stress >= 5 || /suicide|kill myself|hurt myself|overdose|drugs|unsafe|abuse|homeless|can't go on|die/i.test(`${support} ${privateNote}`);

  const save = async () => {
    const row: WellnessCheckIn = {
      id: uuid(),
      profile_id: profileId,
      profile_type: profileType,
      checkin_type: checkinType,
      mood,
      energy,
      sleep,
      breakfast,
      hope_score: hope,
      belonging_score: belonging,
      trusted_adult_score: trustedAdult,
      confidence_score: confidence,
      stress_score: stress,
      support_needed: support,
      private_note: privateNote,
      safety_flag: safetyFlag,
      created_at: new Date().toISOString(),
    };
    await insertRow("wellness_checkins", WELLNESS_KEY, row);
    updateActivity(activeUser, safetyFlag ? "submitted wellness support flag" : "submitted wellness check-in");
    setMessage(safetyFlag ? "Saved. This should be routed privately to approved staff for immediate support." : "Saved. Thank you for checking in.");
  };

  return (
    <Shell screen="wellness" setScreen={setScreen} background={IMG.queens} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Wellness Baseline" title="Private check-in before work begins." text="These questions are not a diagnosis. They help identify immediate needs, emotional stress, food needs, belonging, and whether approved staff should follow up. Parent-facing summaries should not expose private youth answers." image={IMG.queens}>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Profile ID / name" value={profileId} onChange={setProfileId} />
          <SelectField label="Profile type" value={profileType} onChange={(v) => setProfileType(v as ProfileType)} options={["youth", "supervisor", "parent", "grower", "value_added", "volunteer", "partner", "customer", "board"]} />
          <SelectField label="Check-in type" value={checkinType} onChange={(v) => setCheckinType(v as WellnessCheckIn["checkin_type"])} options={["baseline", "morning", "midday", "end_day", "weekly"]} />
          <SelectField label="Mood" value={mood} onChange={setMood} options={["Great", "Good", "Okay", "Low", "Angry", "Anxious", "Sad", "Overwhelmed"]} />
          <SelectField label="Energy" value={energy} onChange={setEnergy} options={["High", "Medium", "Low", "Exhausted"]} />
          <SelectField label="Sleep" value={sleep} onChange={setSleep} options={["Great", "Okay", "Poor", "Very little"]} />
          <SelectField label="Breakfast / food today" value={breakfast} onChange={setBreakfast} options={["Yes", "No", "Some", "Need food"]} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-5">
          {[["Hope", hope, setHope], ["Belonging", belonging, setBelonging], ["Trusted adult", trustedAdult, setTrustedAdult], ["Confidence", confidence, setConfidence], ["Stress", stress, setStress]].map(([label, value, setter]) => (
            <label key={label as string} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-sm font-black">{label as string}</div>
              <input type="range" min={1} max={5} value={value as number} onChange={(e) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value))} className="mt-4 w-full" />
              <div className="mt-2 text-2xl font-black">{value as number}/5</div>
            </label>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextArea label="What support would help you today?" value={support} onChange={setSupport} />
          <TextArea label="Private note for approved staff" value={privateNote} onChange={setPrivateNote} />
        </div>

        {safetyFlag && (
          <div className="mt-5 rounded-2xl border border-red-200/30 bg-red-500/20 p-4 text-sm leading-7">
            Safety-sensitive response detected. This should be visible only to approved supervisors/administrators and should trigger immediate human follow-up using the program’s safety protocol.
          </div>
        )}

        <button onClick={save} className="mt-5 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Check-In</button>
        {message && <div className="mt-4 rounded-2xl bg-emerald-300/20 p-4 font-black">{message}</div>}
      </HeroCard>
    </Shell>
  );
}

function FeedbackScreen({ setScreen, activeUser, lang, setLang }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; lang: Lang; setLang: (lang: Lang) => void }) {
  const [rating, setRating] = useState(4);
  const [feedbackType, setFeedbackType] = useState<FeedbackRecord["feedback_type"]>("platform");
  const [comments, setComments] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [message, setMessage] = useState("");

  const save = async () => {
    const row: FeedbackRecord = {
      id: uuid(),
      profile_id: activeUser?.id,
      profile_type: activeUser ? roleToProfileType(activeUser.role) : "customer",
      feedback_type: feedbackType,
      rating,
      comments,
      would_recommend: recommend,
      created_at: new Date().toISOString(),
    };
    await insertRow("feedback_records", FEEDBACK_KEY, row);
    updateActivity(activeUser, "submitted feedback");
    setMessage("Feedback saved. This helps improve the platform and the program experience.");
  };

  return (
    <Shell screen="feedback" setScreen={setScreen} background={IMG.wkbn} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Experience Feedback" title="Let users tell us what worked." text="Collect feedback on the platform, youth program, events, weekly experience, and final program experience. This becomes part of program improvement and funder reporting." image={IMG.wkbn}>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Feedback type" value={feedbackType} onChange={(v) => setFeedbackType(v as FeedbackRecord["feedback_type"])} options={["platform", "program", "event", "weekly", "end_program"]} />
          <label className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-sm font-black">Rating</div>
            <input type="range" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mt-4 w-full" />
            <div className="mt-2 text-2xl font-black">{rating}/5</div>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
            <input type="checkbox" checked={recommend} onChange={(e) => setRecommend(e.target.checked)} />
            <span className="font-black">Would recommend</span>
          </label>
        </div>
        <div className="mt-5">
          <TextArea label="Comments" value={comments} onChange={setComments} placeholder="What was helpful, confusing, missing, or meaningful?" />
        </div>
        <button onClick={save} className="mt-5 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Feedback</button>
        {message && <div className="mt-4 rounded-2xl bg-emerald-300/20 p-4 font-black">{message}</div>}
      </HeroCard>
    </Shell>
  );
}

function ParentScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  const attendance = safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []);
  const assessments = safeRead<AssessmentRecord[]>(ASSESSMENT_KEY, []);
  const earned = safeRead<YouthBadge[]>(BADGE_KEY, []);
  const messages = safeRead<ParentMessage[]>(PARENT_MESSAGE_KEY, []);
  const relationships = safeRead<RelationshipRecord[]>(RELATIONSHIP_KEY, []).filter((r) => r.relationship_type === "parent_to_youth");
  const avgResponsibility = assessments.length ? (assessments.reduce((s, a) => s + a.responsibility, 0) / assessments.length).toFixed(1) : "—";

  return (
    <Shell screen="parent" setScreen={setScreen} background={IMG.growArea} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Parent / Guardian Portal" title="Progress without exposing private reflections." text="Parents receive attendance, badges, skills, supervisor encouragement, family opportunities, and support notices when appropriate — not raw youth mental health responses." image={IMG.growArea}>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><div className="text-3xl font-black">{attendance.length}</div><div className="mt-1 text-sm">Attendance entries</div></div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><div className="text-3xl font-black">{assessments.length}</div><div className="mt-1 text-sm">Skill observations</div></div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><div className="text-3xl font-black">{earned.length}</div><div className="mt-1 text-sm">Badges awarded</div></div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><div className="text-3xl font-black">{avgResponsibility}</div><div className="mt-1 text-sm">Responsibility average</div></div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Linked youth records</div>
            <div className="mt-3 space-y-2">
              {relationships.slice(0, 6).map((r) => (
                <div key={r.id} className="rounded-2xl bg-black/30 p-3 text-sm">
                  {r.related_profile_id} • {r.status}
                </div>
              ))}
              {!relationships.length && <div className="rounded-2xl bg-black/30 p-3 text-sm">No parent/youth link saved yet. Register as parent and enter youth name or participant ID.</div>}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Parent-safe messages</div>
            <div className="mt-3 space-y-2">
              {messages.slice(0, 5).map((m) => (
                <div key={m.id} className="rounded-2xl bg-black/30 p-3 text-sm">
                  <b>{m.subject}</b>
                  <div className="mt-1 text-white/75">{m.body}</div>
                </div>
              ))}
              {!messages.length && <div className="rounded-2xl bg-black/30 p-3 text-sm">No parent-safe messages yet.</div>}
            </div>
          </div>
        </div>

        <ActionGrid
          setScreen={setScreen}
          items={[
            { title: "Register / Link Youth", text: "Create or update family connection.", screen: "registration" },
            { title: "Badges", text: "Safety, responsibility, teamwork, communication, cultivation, and marketplace exposure." },
            { title: "Family Feedback", text: "Families can share what growth they noticed.", screen: "feedback" },
            { title: "Reports", text: "Review parent-safe progress summaries.", screen: "reports" },
          ]}
        />
      </HeroCard>
    </Shell>
  );
}

function GrowerScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="grower" setScreen={setScreen} background={IMG.csu} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Grower Pathway" title="Connect growers to tools, market access, and production planning." text="Growers can register crops, needs, water source, market goals, and interest in the Growers Supply Market and broader marketplace." image={IMG.csu}>
        <ActionGrid setScreen={setScreen} items={[
          { title: "Grower Registration", text: "Farm name, crops, market interest, water and equipment needs.", screen: "registration" },
          { title: "Crop Planner", text: "Plan crop, variety, zone, and planting date.", screen: "crop" },
          { title: "Inventory", text: "Track seeds, seedlings, produce, Bubble Babies, and supplies.", screen: "inventory" },
          { title: "Marketplace", text: "Connect products to customers, events, and partner opportunities.", screen: "marketplace" },
        ]} />
      </HeroCard>
    </Shell>
  );
}

function ValueAddedScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="valueAdded" setScreen={setScreen} background={IMG.flowers} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Value-Added Producer" title="Turn harvest into products, enterprise, and learning." text="Value-added producers can register product categories, licensing status, kitchen needs, insurance status, capacity, and marketplace goals." image={IMG.mushrooms}>
        <ActionGrid setScreen={setScreen} items={[
          { title: "Producer Registration", text: "Business, product category, kitchen, license, insurance, and capacity.", screen: "registration" },
          { title: "Inventory", text: "Track value-added product readiness.", screen: "inventory" },
          { title: "Marketplace Path", text: "Connect food products, demos, sales, events, and youth learning.", screen: "marketplace" },
          { title: "Feedback", text: "Share what support helps producers succeed.", screen: "feedback" },
        ]} />
      </HeroCard>
    </Shell>
  );
}

function CropScreen({ setScreen, activeUser, lang, setLang }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; lang: Lang; setLang: (lang: Lang) => void }) {
  const [crop, setCrop] = useState("");
  const [variety, setVariety] = useState("");
  const [zone, setZone] = useState("Grow Area");
  const [planted, setPlanted] = useState(todayISO());
  const [expectedHarvest, setExpectedHarvest] = useState("");
  const [practice, setPractice] = useState("Mulch / compost");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const save = async () => {
    const row: CropPlan = { id: uuid(), crop, variety, zone, planted, expected_harvest: expectedHarvest, grower_profile_id: activeUser?.id, regenerative_practice: practice, notes };
    await insertRow("crop_plans", CROP_KEY, row);
    updateActivity(activeUser, "saved crop plan");
    setMessage("Crop plan saved.");
  };

  return (
    <Shell screen="crop" setScreen={setScreen} background={IMG.growArea2} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Crop Planner" title="Plan what grows, where it grows, and when it started." text="This connects production, youth workforce tasks, grower coordination, market readiness, regenerative practice, and reporting." image={IMG.seeds}>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Crop" value={crop} onChange={setCrop} />
          <Field label="Variety" value={variety} onChange={setVariety} />
          <Field label="Zone" value={zone} onChange={setZone} />
          <Field label="Planted date" value={planted} onChange={setPlanted} type="date" />
          <Field label="Expected harvest" value={expectedHarvest} onChange={setExpectedHarvest} type="date" />
          <SelectField label="Regenerative practice" value={practice} onChange={setPractice} options={["Mulch / compost", "Wood ash", "Cardboard mulch", "Leaf compost", "Pollinator support", "Water conservation", "No-till / low-till", "Soil test follow-up"]} />
        </div>
        <div className="mt-4">
          <TextArea label="Notes" value={notes} onChange={setNotes} />
        </div>
        <button onClick={save} className="mt-5 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Crop Plan</button>
        {message && <div className="mt-4 rounded-2xl bg-emerald-300/20 p-4 font-black">{message}</div>}
      </HeroCard>
    </Shell>
  );
}

function InventoryScreen({ setScreen, activeUser, lang, setLang }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; lang: Lang; setLang: (lang: Lang) => void }) {
  const [itemType, setItemType] = useState<InventoryItem["item_type"]>("seedling");
  const [category, setCategory] = useState("Vegetable");
  const [name, setName] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("each");
  const [price, setPrice] = useState("");
  const [snap, setSnap] = useState(true);
  const [location, setLocation] = useState("Farm");
  const [status, setStatus] = useState<InventoryItem["status"]>("available");
  const [message, setMessage] = useState("");

  const save = async () => {
    const row: InventoryItem = {
      id: uuid(),
      item_type: itemType,
      category,
      name,
      variety,
      quantity: Number(quantity) || 0,
      unit,
      price: price ? Number(price) : undefined,
      snap_eligible: snap,
      location,
      status,
    };
    await insertRow("inventory_items", INVENTORY_KEY, row);
    updateActivity(activeUser, "saved inventory item");
    setMessage("Inventory item saved.");
  };

  return (
    <Shell screen="inventory" setScreen={setScreen} background={IMG.market} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Inventory + Bubble Babies" title="Track seeds, seedlings, produce, supplies, and marketplace readiness." text="This starter engine connects production, Bubble Babies, SNAP eligibility, marketplace display, and reporting. It is designed to later receive imports from the Excel inventory ecosystem." image={IMG.market}>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Item type" value={itemType} onChange={(v) => setItemType(v as InventoryItem["item_type"])} options={["seed", "seedling", "produce", "bubble_baby", "tool", "supply", "value_added"]} />
          <Field label="Category" value={category} onChange={setCategory} />
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Variety" value={variety} onChange={setVariety} />
          <Field label="Quantity" value={quantity} onChange={setQuantity} />
          <Field label="Unit" value={unit} onChange={setUnit} />
          <Field label="Price" value={price} onChange={setPrice} />
          <Field label="Location" value={location} onChange={setLocation} />
          <SelectField label="Status" value={status} onChange={(v) => setStatus(v as InventoryItem["status"])} options={["available", "reserved", "sold", "planted", "needs_review"]} />
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
            <input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} />
            <span className="font-black">SNAP eligible</span>
          </label>
        </div>
        <button onClick={save} className="mt-5 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Inventory</button>
        {message && <div className="mt-4 rounded-2xl bg-emerald-300/20 p-4 font-black">{message}</div>}
      </HeroCard>
    </Shell>
  );
}

function MarketplaceScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  const inventory = safeRead<InventoryItem[]>(INVENTORY_KEY, []);
  return (
    <Shell screen="marketplace" setScreen={setScreen} background={IMG.market} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Marketplace" title="Move interest into purchasing, learning, and repeat participation." text="The marketplace connects Bubble Babies, seedlings, produce, growers, value-added products, events, youth learning, and community food access." image={IMG.market}>
        <ActionGrid
          setScreen={setScreen}
          items={[
            { title: "Shop on GrownBy", text: "Open the Bronson Family Farm store.", href: "https://grownby.com/farms/bronson-family-farm/shop" },
            { title: "Register as Customer", text: "Build the customer profile for future autofill.", screen: "registration" },
            { title: "Inventory", text: "Add marketplace-ready items and SNAP status.", screen: "inventory" },
            { title: "Grower Supply Market", text: "Use events to connect people to supplies, food, demos, and education.", screen: "partners" },
            { title: "Feedback", text: "Capture customer and vendor experience.", screen: "feedback" },
          ]}
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {inventory.slice(0, 6).map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">{item.item_type}</div>
              <div className="mt-2 text-xl font-black">{item.name || "Untitled item"}</div>
              <div className="mt-2 text-sm text-white/75">{item.quantity} {item.unit} • {item.status} {item.snap_eligible ? "• SNAP" : ""}</div>
            </div>
          ))}
        </div>
      </HeroCard>
    </Shell>
  );
}

function ReportsScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  const feedback = safeRead<FeedbackRecord[]>(FEEDBACK_KEY, []);
  const wellness = safeRead<WellnessCheckIn[]>(WELLNESS_KEY, []);
  const safetyFlags = wellness.filter((w) => w.safety_flag).length;
  const avgRating = feedback.length ? (feedback.reduce((sum, row) => sum + row.rating, 0) / feedback.length).toFixed(1) : "—";

  return (
    <Shell screen="reports" setScreen={setScreen} background={IMG.partners} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Reports" title="Turn daily activity into leadership and funder evidence." text="Reports summarize registration, attendance, assessments, wellness trends, feedback, crop plans, inventory, market activity, and parent-safe progress." image={IMG.partners}>
        <StatGrid />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Wellness-sensitive routing</div>
            <div className="mt-2 text-4xl font-black">{safetyFlags}</div>
            <p className="mt-2 text-sm leading-6 text-white/75">Private safety/support flags for approved staff review only.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Feedback rating</div>
            <div className="mt-2 text-4xl font-black">{avgRating}</div>
            <p className="mt-2 text-sm leading-6 text-white/75">Average user experience rating from saved feedback.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Grant-ready evidence</div>
            <div className="mt-2 text-4xl font-black">Live</div>
            <p className="mt-2 text-sm leading-6 text-white/75">Data can support board, funder, and program reporting.</p>
          </div>
        </div>
      </HeroCard>
    </Shell>
  );
}

function OperationsScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="operations" setScreen={setScreen} background={IMG.compost} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Operations" title="Manage the working ecosystem." text="Operations connects people, produce, safety, water, tools, compost, supplies, work crews, market activity, partners, and reports." image={IMG.compost}>
        <ActionGrid setScreen={setScreen} items={[
          { title: "Data Dashboard", text: "Review records and local fallback data.", screen: "data" },
          { title: "Staff Management", text: "Coordinate supervisors, roles, staff readiness, and access boundaries.", screen: "staff" },
          { title: "Safety Protocol", text: "Route support and safety concerns to approved staff.", screen: "safety" },
          { title: "Reports", text: "Review impact and readiness data.", screen: "reports" },
          { title: "Board / Funder View", text: "Translate daily ecosystem movement into oversight and investment evidence.", screen: "board" },
          { title: "Partners", text: "Coordinate support and infrastructure asks.", screen: "partners" },
        ]} />
      </HeroCard>
    </Shell>
  );
}

function PartnersScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="partners" setScreen={setScreen} background={IMG.partners} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Partners" title="Align support with visible ecosystem needs." text="Partners can support water, solar, fencing, tools, canopies, tables, chairs, wash stations, transportation, wellness, education, market access, and youth workforce." image={IMG.partners}>
        <ActionGrid setScreen={setScreen} items={[
          { title: "Register as Partner", text: "Create a partner profile for follow-up.", screen: "registration" },
          { title: "Marketplace Support", text: "Help connect growers, customers, vendors, and events.", screen: "marketplace" },
          { title: "Reports", text: "See how support converts into outcomes.", screen: "reports" },
        ]} />
      </HeroCard>
    </Shell>
  );
}

function SafetyScreen({ setScreen, activeUser, lang, setLang }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; lang: Lang; setLang: (lang: Lang) => void }) {
  const [participantId, setParticipantId] = useState("");
  const [incidentType, setIncidentType] = useState("Wellness concern");
  const [urgency, setUrgency] = useState<IncidentRecord["urgency"]>("medium");
  const [summary, setSummary] = useState("");
  const [actionTaken, setActionTaken] = useState("");
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
      action_taken: actionTaken,
      parent_contacted: parentContacted,
      created_at: new Date().toISOString(),
    };
    await insertRow("incident_records", INCIDENT_KEY, row);
    updateActivity(activeUser, "saved safety incident");
    setMessage("Staff-only safety/support record saved.");
  };

  return (
    <Shell screen="safety" setScreen={setScreen} background={IMG.fencing} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Safety + Support" title="Protect youth first." text="This screen is for approved staff. It separates support routing from public and parent-facing screens. It should connect to your real emergency protocol, staff contacts, incident forms, and mandated reporting procedures." image={IMG.fencing}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Participant ID / name" value={participantId} onChange={setParticipantId} />
          <SelectField label="Incident type" value={incidentType} onChange={setIncidentType} options={["Wellness concern", "PPE / safety", "Conflict", "Substance concern", "Transportation", "Medical", "Emergency", "Other"]} />
          <SelectField label="Urgency" value={urgency} onChange={(v) => setUrgency(v as IncidentRecord["urgency"])} options={["low", "medium", "high", "emergency"]} />
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
            <input type="checkbox" checked={parentContacted} onChange={(e) => setParentContacted(e.target.checked)} />
            <span className="font-black">Parent/guardian contacted when appropriate</span>
          </label>
          <TextArea label="Summary" value={summary} onChange={setSummary} />
          <TextArea label="Action taken" value={actionTaken} onChange={setActionTaken} />
        </div>
        <button onClick={save} className="mt-5 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Staff-Only Record</button>
        {message && <div className="mt-4 rounded-2xl bg-emerald-300/20 p-4 font-black">{message}</div>}
      </HeroCard>
    </Shell>
  );
}

function DataScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  const rows = [
    ["Profiles", safeRead<MasterProfile[]>(PROFILE_KEY, []).length],
    ["Youth registrations", safeRead<YouthRegistration[]>(YOUTH_KEY, []).length],
    ["Supervisors", safeRead<SupervisorRegistration[]>(SUPERVISOR_KEY, []).length],
    ["Growers", safeRead<GrowerRegistration[]>(GROWER_KEY, []).length],
    ["Value-added", safeRead<ValueAddedRegistration[]>(VALUE_ADDED_KEY, []).length],
    ["Attendance", safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []).length],
    ["Assessments", safeRead<AssessmentRecord[]>(ASSESSMENT_KEY, []).length],
    ["Wellness", safeRead<WellnessCheckIn[]>(WELLNESS_KEY, []).length],
    ["Feedback", safeRead<FeedbackRecord[]>(FEEDBACK_KEY, []).length],
    ["Crop plans", safeRead<CropPlan[]>(CROP_KEY, []).length],
    ["Inventory", safeRead<InventoryItem[]>(INVENTORY_KEY, []).length],
    ["Badges", safeRead<YouthBadge[]>(BADGE_KEY, []).length],
    ["Incidents", safeRead<IncidentRecord[]>(INCIDENT_KEY, []).length],
    ["Relationships", safeRead<RelationshipRecord[]>(RELATIONSHIP_KEY, []).length],
    ["Parent messages", safeRead<ParentMessage[]>(PARENT_MESSAGE_KEY, []).length],
  ];

  return (
    <Shell screen="data" setScreen={setScreen} background={IMG.ecosystem} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Data" title="Every form writes into the ecosystem." text={supabase ? "Supabase environment variables are present. Records also keep a local fallback." : "Supabase is not connected yet. Records are saving locally in this browser as a fallback."} image={IMG.ecosystem}>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {rows.map(([label, count]) => (
            <div key={label as string} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">{label}</div>
              <div className="mt-2 text-3xl font-black">{count as number}</div>
            </div>
          ))}
        </div>
      </HeroCard>
    </Shell>
  );
}

function RolesScreen({ setScreen, signIn, lang, setLang }: { setScreen: (screen: Screen) => void; signIn: (role: Role, name?: string) => EcosystemUser; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="roles" setScreen={setScreen} background={IMG.growArea2} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Role Pathways" title="Choose how you enter the ecosystem." text="Each role has a different mission and destination. Protected youth tools are only for approved staff and administrators." image={IMG.ecosystem}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => {
                const user = signIn(role, role);
                setScreen(routeForRole(user.role));
              }}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-emerald-300 hover:text-black"
            >
              <div className="text-base font-black">{role}</div>
              <div className="mt-2 text-xs leading-5 opacity-80">{roleAccess[role]} access</div>
            </button>
          ))}
        </div>
      </HeroCard>
    </Shell>
  );
}

function HistoryScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="history" setScreen={setScreen} background={IMG.airport} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Place-Based Learning" title="Airport, military, land, and family legacy." text="Youth and guests should understand that the farm is not only a food project. It is land stewardship, community memory, agricultural legacy, service, aviation history, and future workforce development in one place." image={IMG.airport}>
        <ActionGrid setScreen={setScreen} items={[
          { title: "Airport History", text: "Teach youth where they are standing and why the site matters." },
          { title: "Military Service", text: "Connect family service, discipline, protection, and responsibility." },
          { title: "Family Legacy", text: "Honor Bronson and Lorenzana agricultural, spiritual, educational, and service roots." },
          { title: "Regenerative Farming", text: "Explain how farming can restore soil, water, biodiversity, and community.", screen: "regenerative" },
        ]} />
      </HeroCard>
    </Shell>
  );
}

function RegenerativeScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="regenerative" setScreen={setScreen} background={IMG.compost} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Regenerative Farming" title="Regenerative means the land gets better because we are here." text="Regenerative farming protects soil, water, insects, trees, compost, food access, people, and future harvests. It is not only growing food. It is restoring the conditions that allow life to thrive." image={IMG.compost}>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Build soil with compost, leaves, mulch, and organic matter.",
            "Conserve water and use storage wisely.",
            "Use cardboard and mulch to suppress weeds and protect soil.",
            "Support pollinators and biodiversity.",
            "Reduce waste by turning local materials into growing resources.",
            "Teach youth to observe before they act.",
          ].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-7">{item}</div>)}
        </div>
      </HeroCard>
    </Shell>
  );
}

function VolunteerScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="volunteer" setScreen={setScreen} background={IMG.volunteers} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Volunteer Pathway" title="Volunteers support the farm without accessing protected youth records." text="Volunteers can support planting, setup, teardown, supplies, market days, community events, and land stewardship. Youth data remains staff-only." image={IMG.volunteers}>
        <ActionGrid setScreen={setScreen} items={[
          { title: "Register", text: "Create a volunteer profile.", screen: "registration" },
          { title: "Event Feedback", text: "Share what worked and what support is needed.", screen: "feedback" },
          { title: "Marketplace", text: "Help community members find products and information.", screen: "marketplace" },
        ]} />
      </HeroCard>
    </Shell>
  );
}

function StaffScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="staff" setScreen={setScreen} background={IMG.fencing} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Staff Management" title="Only approved staff supervise youth." text="This area keeps the boundary clear: supervisors and staff are the adults with access to youth tools. Volunteers, guests, partners, and public users do not get youth records." image={IMG.fencing}>
        <ActionGrid setScreen={setScreen} items={[
          { title: "Supervisor Registration", text: "Register staff and assign crew.", screen: "registration" },
          { title: "Supervisor Dashboard", text: "Use attendance, PPE, assessment, and badges.", screen: "supervisor" },
          { title: "Safety / Incident", text: "Staff-only documentation and escalation.", screen: "safety" },
          { title: "Reports", text: "Review activity and outcome records.", screen: "reports" },
        ]} />
      </HeroCard>
    </Shell>
  );
}

function BoardScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="board" setScreen={setScreen} background={IMG.partners} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Board / Funder Dashboard" title="Show the ecosystem as infrastructure." text="This view helps leadership and funders understand how land, youth workforce, growers, inventory, marketplace, wellness, and partners create measurable community value." image={IMG.partners}>
        <StatGrid />
        <ActionGrid setScreen={setScreen} items={[
          { title: "Grant Outcomes", text: "View outcome categories and evidence streams.", screen: "grant" },
          { title: "Reports", text: "Review live activity and participant data.", screen: "reports" },
          { title: "Operations", text: "See operational needs and capacity gaps.", screen: "operations" },
        ]} />
      </HeroCard>
    </Shell>
  );
}

function GrantScreen({ setScreen, lang, setLang }: { setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen="grant" setScreen={setScreen} background={IMG.partners} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Grant Outcomes" title="Translate the work into evidence." text="The system can support reporting on youth served, attendance, work readiness, skill gains, wellness support, growers supported, crops planned, marketplace inventory, feedback, and partner engagement." image={IMG.partners}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Youth workforce participation",
            "Supervisor observation and skill progression",
            "Attendance and PPE compliance",
            "Wellness support routing",
            "Crop planning and production activity",
            "Inventory and marketplace readiness",
            "Grower and value-added producer participation",
            "Family engagement and parent-safe progress",
            "Community partner support",
          ].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-black">{item}</div>)}
        </div>
      </HeroCard>
    </Shell>
  );
}

function LockedScreen({ screen, setScreen, lang, setLang }: { screen: Screen; setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <Shell screen={screen} setScreen={setScreen} background={IMG.forest} lang={lang} setLang={setLang}>
      <HeroCard eyebrow="Protected Access" title="This area is protected." text="This screen requires staff, admin, board, or approved family access. Enter by role before opening protected youth data or operational screens." image={IMG.forest}>
        <button onClick={() => setScreen("account")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Enter Role Access</button>
      </HeroCard>
    </Shell>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("portal");
  const [lang, setLangState] = useState<Lang>(() => safeRead<Lang>(LANG_KEY, "en"));
  const { activeUser, signIn } = useActiveUser();

  const setLang = (next: Lang) => {
    safeWrite(LANG_KEY, next);
    setLangState(next);
  };

  const guardedSetScreen = (next: Screen) => {
    if (!canAccessScreen(activeUser, next)) {
      setScreen(next);
      return;
    }
    setScreen(next);
  };

  const currentProverb = useMemo(() => proverbs[new Date().getDay() % proverbs.length], []);

  if (!canAccessScreen(activeUser, screen)) return <LockedScreen screen={screen} setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;

  switch (screen) {
    case "portal":
      return <Portal setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "guest":
      return <Guest setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "registration":
      return <RegistrationHub setScreen={guardedSetScreen} activeUser={activeUser} lang={lang} setLang={setLang} />;
    case "account":
      return <Account setScreen={guardedSetScreen} signIn={signIn} lang={lang} setLang={setLang} />;
    case "roles":
      return <RolesScreen setScreen={guardedSetScreen} signIn={signIn} lang={lang} setLang={setLang} />;
    case "youth":
      return <YouthScreen setScreen={guardedSetScreen} activeUser={activeUser} lang={lang} setLang={setLang} />;
    case "supervisor":
      return <SupervisorScreen setScreen={guardedSetScreen} activeUser={activeUser} lang={lang} setLang={setLang} />;
    case "parent":
      return <ParentScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "grower":
      return <GrowerScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "valueAdded":
      return <ValueAddedScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "marketplace":
      return <MarketplaceScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "crop":
      return <CropScreen setScreen={guardedSetScreen} activeUser={activeUser} lang={lang} setLang={setLang} />;
    case "inventory":
      return <InventoryScreen setScreen={guardedSetScreen} activeUser={activeUser} lang={lang} setLang={setLang} />;
    case "curriculum":
      return <CurriculumScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "wellness":
      return <WellnessScreen setScreen={guardedSetScreen} activeUser={activeUser} lang={lang} setLang={setLang} />;
    case "feedback":
      return <FeedbackScreen setScreen={guardedSetScreen} activeUser={activeUser} lang={lang} setLang={setLang} />;
    case "reports":
      return <ReportsScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "operations":
      return <OperationsScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "partners":
      return <PartnersScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "safety":
      return <SafetyScreen setScreen={guardedSetScreen} activeUser={activeUser} lang={lang} setLang={setLang} />;
    case "data":
      return <DataScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "history":
      return <HistoryScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "regenerative":
      return <RegenerativeScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "volunteer":
      return <VolunteerScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "staff":
      return <StaffScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "board":
      return <BoardScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    case "grant":
      return <GrantScreen setScreen={guardedSetScreen} lang={lang} setLang={setLang} />;
    default:
      return (
        <Shell screen="portal" setScreen={guardedSetScreen} background={IMG.forest} lang={lang} setLang={setLang}>
          <HeroCard eyebrow="Daily proverb" title={currentProverb} text="Return to the portal and continue the guided ecosystem." image={IMG.forest}>
            <button onClick={() => setScreen("portal")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Return</button>
          </HeroCard>
        </Shell>
      );
  }
}
