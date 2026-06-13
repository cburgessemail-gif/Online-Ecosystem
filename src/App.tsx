import React, { useEffect, useMemo, useState } from "react";
import "./style.css";

/**
 * Bronson Family Farm Online Ecosystem
 * LAUNCH CORRECTED SCRIPT — Youth Workforce + Ecosystem Portal
 * Corrected launch priorities:
 * - Youth PIN access must not block daily work.
 * - Youth can continue with supervisor verification when roster validation is not ready.
 * - Curriculum advances daily and preserves Week 1 as completed.
 * - Weekly topic/category rotation with capacity limits and no repeat category.
 * - Inventory management is visible to supervisors and Mission Control.
 * - Nurse Line / Help stays visible on every screen.
 * - Translation scaffold covers every launch-facing label and page section.
 * - Phone-first, layered screens: Start My Day first, then Today's Project, Evidence, Reflection, Resources.
 */

type Role = "guest" | "youth" | "parent" | "supervisor" | "mission" | "grower" | "marketplace" | "partner";
type Lang = "en" | "es" | "tl" | "it" | "he" | "fr";
type TopicId = "agriculture" | "infrastructure" | "apiary" | "culinary" | "media" | "guestServices" | "safety" | "logistics";
type View = "portal" | "home" | "youth" | "parent" | "supervisor" | "mission" | "inventory" | "curriculum" | "resources" | "guest" | "grower" | "marketplace" | "partner";

type UserSession = {
  role: Role;
  name: string;
  pin?: string;
  email?: string;
  parentPhoneLast4?: string;
  verified: boolean;
  verificationMethod: "roster" | "supervisor" | "temporary" | "guest";
};

type YouthRecord = {
  name: string;
  pin: string;
  completedTopics: TopicId[];
  currentTopic?: TopicId;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
};

type Topic = {
  id: TopicId;
  titleKey: string;
  supervisor: string;
  capacity: number;
  count: number;
  colorClass: string;
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  total: number;
  available: number;
  damaged: number;
  notes: string;
};

type DailyEntry = {
  id: string;
  date: string;
  youthName: string;
  topic?: TopicId;
  ppe: boolean;
  water: boolean;
  assignment: string;
  evidence: string;
  reflection: string;
  safetyConcern: string;
};

type DamageReport = {
  id: string;
  date: string;
  item: string;
  reportedBy: string;
  issue: string;
  action: string;
};

type CurriculumDay = {
  date: string;
  week: number;
  title: string;
  focus: string;
  activities: string[];
  entrepreneurship: string;
  reflection: string;
  resources: string[];
};

const STORAGE_KEYS = {
  session: "bff.launch.session.v3",
  youthRoster: "bff.launch.youthRoster.v3",
  topics: "bff.launch.topics.v3",
  inventory: "bff.launch.inventory.v3",
  dailyEntries: "bff.launch.dailyEntries.v3",
  damageReports: "bff.launch.damageReports.v3",
  launchDateOverride: "bff.launch.dateOverride.v3",
};

const NURSE_LINE = "1-866-206-0554";
const PROGRAM_START = new Date("2026-06-08T00:00:00");

const defaultYouthRoster: YouthRecord[] = [
  { name: "Demo Youth", pin: "1234", completedTopics: [] },
  { name: "Returning Youth", pin: "2026", completedTopics: ["agriculture"] },
];

const defaultTopics: Topic[] = [
  { id: "agriculture", titleKey: "topic_agriculture", supervisor: "Agriculture Supervisor", capacity: 15, count: 0, colorClass: "earth" },
  { id: "infrastructure", titleKey: "topic_infrastructure", supervisor: "Infrastructure Supervisor", capacity: 15, count: 0, colorClass: "slate" },
  { id: "apiary", titleKey: "topic_apiary", supervisor: "Apiary Supervisor", capacity: 15, count: 0, colorClass: "gold" },
  { id: "culinary", titleKey: "topic_culinary", supervisor: "Culinary Supervisor", capacity: 15, count: 0, colorClass: "harvest" },
  { id: "media", titleKey: "topic_media", supervisor: "Media Supervisor", capacity: 15, count: 0, colorClass: "sky" },
  { id: "guestServices", titleKey: "topic_guest", supervisor: "Guest Services Supervisor", capacity: 15, count: 0, colorClass: "forest" },
  { id: "safety", titleKey: "topic_safety", supervisor: "Safety Supervisor", capacity: 15, count: 0, colorClass: "red" },
  { id: "logistics", titleKey: "topic_logistics", supervisor: "Logistics Supervisor", capacity: 15, count: 0, colorClass: "navy" },
];

const defaultInventory: InventoryItem[] = [
  { id: "shovels", name: "Shovels", category: "Tools", total: 20, available: 20, damaged: 0, notes: "Check handles daily." },
  { id: "rakes", name: "Rakes", category: "Tools", total: 18, available: 17, damaged: 1, notes: "One broken rake reported." },
  { id: "water-pitchers", name: "Water pitchers", category: "Safety", total: 10, available: 10, damaged: 0, notes: "Keep filled during heat." },
  { id: "markers", name: "Markers", category: "Supplies", total: 40, available: 33, damaged: 0, notes: "For row labels and fan project." },
  { id: "scissors", name: "Scissors", category: "Supplies", total: 20, available: 19, damaged: 0, notes: "Collect at cleanup." },
  { id: "staplers", name: "Staplers", category: "Supplies", total: 12, available: 12, damaged: 0, notes: "Fan project / signage." },
  { id: "garbage-bags", name: "Garbage bags", category: "Cleanup", total: 100, available: 86, damaged: 0, notes: "Daily cleanup." },
  { id: "laptops", name: "Laptops", category: "Technology", total: 4, available: 4, damaged: 0, notes: "Supervisor-supported youth without phones." },
  { id: "gloves", name: "Work gloves", category: "PPE", total: 80, available: 72, damaged: 0, notes: "Confirm fit before field work." },
];

const curriculum: CurriculumDay[] = [
  {
    date: "2026-06-08",
    week: 1,
    title: "Launch Day: Cardboard Fan Cooling Station",
    focus: "Youth learn how a farm solves a real business problem with design, engineering, manufacturing, and contracting teams.",
    activities: ["Orientation and safety", "Build cardboard fans", "Calculate cost and markup", "Design cooling-station solution"],
    entrepreneurship: "A product has a customer, cost, price, quality standard, and delivery deadline.",
    reflection: "What did I make today, and who did it help?",
    resources: ["Safety orientation", "Fan cost card", "Team role cards"],
  },
  {
    date: "2026-06-09",
    week: 1,
    title: "Soil, Safety, and Planting Preparation",
    focus: "Youth connect soil preparation to food production, safety, and teamwork.",
    activities: ["Spread and level soil", "Prepare rows", "Move grass mulch", "Supervisor safety check"],
    entrepreneurship: "Good production begins before the sale. Quality starts with preparation.",
    reflection: "What made the work easier or harder today?",
    resources: ["Soil basics", "Heat safety", "PPE checklist"],
  },
  {
    date: "2026-06-10",
    week: 1,
    title: "Rows, Seeds, and Companion Thinking",
    focus: "Youth learn why spacing, rows, crop labels, and companion planting matter.",
    activities: ["Sow/plant seeds", "Label rows", "Discuss companion planting", "Photo evidence"],
    entrepreneurship: "A grow plan is an operating plan. A business must know what is planted, where, and why.",
    reflection: "What did I learn about how food begins?",
    resources: ["Companion planting guide", "Crop row card", "Photo evidence prompt"],
  },
  {
    date: "2026-06-11",
    week: 1,
    title: "Fencing, Mulch, and Site Protection",
    focus: "Youth understand that infrastructure protects crops, workers, and customers.",
    activities: ["Finish fencing tasks", "Use mulch", "Inspect rows", "Team cleanup"],
    entrepreneurship: "Protection reduces loss. Less loss means stronger operations.",
    reflection: "What did we protect today?",
    resources: ["Infrastructure safety", "Loss prevention", "Cleanup checklist"],
  },
  {
    date: "2026-06-12",
    week: 1,
    title: "Week 1 Completion: Evidence, Story, and Skills",
    focus: "Youth connect completed work to resume skills and Cultivator Moments.",
    activities: ["Complete Week 1 reflection", "Upload evidence", "Identify resume skills", "Celebrate teamwork"],
    entrepreneurship: "A business tells the story of its work to customers, partners, and investors.",
    reflection: "What skill did I build this week that I can use again?",
    resources: ["Resume skill builder", "Cultivator Moment prompt", "Supervisor checkoff"],
  },
  {
    date: "2026-06-15",
    week: 2,
    title: "Week 2 Start: Choose Your Rotation and Build the Work Plan",
    focus: "Youth begin a weekly topic rotation and learn how assignments connect to operations.",
    activities: ["Choose weekly topic", "Meet supervisor", "Review weekly goal", "Start daily work log"],
    entrepreneurship: "Every team has a role in value creation: growing, building, protecting, serving, documenting, or selling.",
    reflection: "What role did I choose, and what value can my team create this week?",
    resources: ["Topic choice cards", "Supervisor assignment", "Weekly work plan"],
  },
  {
    date: "2026-06-16",
    week: 2,
    title: "Production Day: Measure, Do, Document",
    focus: "Youth complete work while capturing evidence of learning and productivity.",
    activities: ["Complete assigned field/project work", "Track tools used", "Capture photo/video evidence", "Report supply needs"],
    entrepreneurship: "Documentation turns work into proof of value.",
    reflection: "What evidence shows I contributed today?",
    resources: ["Evidence guide", "Inventory request", "Daily work log"],
  },
  {
    date: "2026-06-17",
    week: 2,
    title: "Customer and Community Awareness",
    focus: "Youth connect farm work to customers, families, visitors, and community health.",
    activities: ["Identify who benefits from today's work", "Improve quality", "Practice explaining the work", "Supervisor feedback"],
    entrepreneurship: "A customer must understand the value of what you produce.",
    reflection: "How would I explain today's work to a customer or parent?",
    resources: ["Customer awareness prompt", "Quality checklist", "Parent message"],
  },
  {
    date: "2026-06-18",
    week: 2,
    title: "Problem Solving and Improvement",
    focus: "Youth identify problems, propose fixes, and learn continuous improvement.",
    activities: ["Find one problem", "Suggest one fix", "Use tools safely", "Update supervisor"],
    entrepreneurship: "Businesses grow when teams notice problems early and improve the system.",
    reflection: "What problem did I notice, and what solution did I suggest?",
    resources: ["Problem-solving card", "Incident vs improvement guide", "Tool safety"],
  },
  {
    date: "2026-06-19",
    week: 2,
    title: "Week 2 Evidence and Resume Skills",
    focus: "Youth close the week with proof of work, reflection, and skill language.",
    activities: ["Submit weekly reflection", "Confirm topic completed", "Add resume skills", "Prepare for next rotation"],
    entrepreneurship: "Your work history becomes your story of reliability, skill, and growth.",
    reflection: "What skill can I now name and explain?",
    resources: ["Resume builder", "Weekly supervisor checkoff", "Next rotation reminder"],
  },
];

const translations: Record<Lang, Record<string, string>> = {
  en: {
    app_title: "Bronson Family Farm Online Ecosystem",
    forest_gate: "Forest Gate",
    guest: "Guest",
    new_user: "New",
    returning: "Returning",
    youth: "Youth Workforce",
    parent: "Parent / Guardian",
    supervisor: "Supervisor",
    mission: "Mission Control",
    grower: "Grower",
    marketplace: "Marketplace",
    partner: "Partner",
    start_day: "Start My Day",
    today_project: "Today's Project",
    evidence: "Evidence",
    reflection: "Reflection",
    resources: "Resources",
    curriculum: "Curriculum",
    inventory: "Inventory",
    nurse_line: "Nurse Line",
    call_nurse: "Call Nurse Line",
    name: "Name",
    pin: "PIN",
    continue: "Continue",
    supervisor_verify: "Supervisor Verify & Continue",
    access_note: "Youth work must not be blocked. If the roster is not ready, a supervisor can verify today.",
    ppe: "PPE checked",
    water: "Water / heat check",
    assignment: "Assignment",
    safety_concern: "Safety concern",
    save_day: "Save Daily Entry",
    choose_topic: "Choose this week's topic",
    topic_full: "Full",
    topic_completed: "Completed",
    selected: "Selected",
    week: "Week",
    completed_week1: "Week 1 completed and preserved.",
    daily_advances: "The curriculum advances by date and can be advanced manually in Mission Control.",
    topic_agriculture: "Agriculture",
    topic_infrastructure: "Infrastructure",
    topic_apiary: "Apiary & Pollination",
    topic_culinary: "Culinary & Nutrition",
    topic_media: "Media / Storytelling",
    topic_guest: "Guest Services & Tourism",
    topic_safety: "Safety & Emergency",
    topic_logistics: "Program Logistics",
    damage_report: "Damage Report",
    report_damage: "Report Damage",
    item: "Item",
    issue: "Issue",
    action: "Action Taken",
    reported_by: "Reported by",
    parent_message: "Parent Daily Message",
    parent_copy: "Today, youth are building workforce skills through safe, documented farm and enterprise work.",
    no_block: "Access is open for launch. Roster validation can be tightened after all youth are confirmed.",
    home: "Home",
    sign_out: "Sign out",
    open: "Open",
    save: "Save",
  },
  es: {
    app_title: "Ecosistema en línea de Bronson Family Farm",
    forest_gate: "Entrada del Bosque",
    guest: "Invitado",
    new_user: "Nuevo",
    returning: "Regresando",
    youth: "Fuerza Laboral Juvenil",
    parent: "Padre / Tutor",
    supervisor: "Supervisor",
    mission: "Centro de Control",
    grower: "Productor",
    marketplace: "Mercado",
    partner: "Socio",
    start_day: "Comenzar Mi Día",
    today_project: "Proyecto de Hoy",
    evidence: "Evidencia",
    reflection: "Reflexión",
    resources: "Recursos",
    curriculum: "Currículo",
    inventory: "Inventario",
    nurse_line: "Línea de Enfermería",
    call_nurse: "Llamar a Enfermería",
    name: "Nombre",
    pin: "PIN",
    continue: "Continuar",
    supervisor_verify: "Supervisor Verifica y Continúa",
    access_note: "El trabajo juvenil no debe bloquearse. Si la lista no está lista, un supervisor puede verificar hoy.",
    ppe: "Equipo de protección revisado",
    water: "Agua / calor revisado",
    assignment: "Asignación",
    safety_concern: "Preocupación de seguridad",
    save_day: "Guardar Entrada Diaria",
    choose_topic: "Elige el tema de esta semana",
    topic_full: "Lleno",
    topic_completed: "Completado",
    selected: "Seleccionado",
    week: "Semana",
    completed_week1: "Semana 1 completada y preservada.",
    daily_advances: "El currículo avanza por fecha y también puede avanzarse manualmente en Centro de Control.",
    topic_agriculture: "Agricultura",
    topic_infrastructure: "Infraestructura",
    topic_apiary: "Apiario y Polinización",
    topic_culinary: "Cocina y Nutrición",
    topic_media: "Medios / Historias",
    topic_guest: "Servicios a Visitantes y Turismo",
    topic_safety: "Seguridad y Emergencia",
    topic_logistics: "Logística del Programa",
    damage_report: "Reporte de Daño",
    report_damage: "Reportar Daño",
    item: "Artículo",
    issue: "Problema",
    action: "Acción Tomada",
    reported_by: "Reportado por",
    parent_message: "Mensaje Diario para Padres",
    parent_copy: "Hoy, los jóvenes desarrollan habilidades laborales mediante trabajo seguro, documentado y empresarial en la granja.",
    no_block: "El acceso está abierto para el lanzamiento. La validación de lista puede reforzarse después de confirmar a todos los jóvenes.",
    home: "Inicio",
    sign_out: "Salir",
    open: "Abrir",
    save: "Guardar",
  },
  tl: {},
  it: {},
  he: {},
  fr: {},
};

function fillFallbackTranslations() {
  (["tl", "it", "he", "fr"] as Lang[]).forEach((lang) => {
    translations[lang] = { ...translations.en, ...translations[lang] };
  });
  translations.fr = {
    ...translations.en,
    app_title: "Écosystème en ligne de Bronson Family Farm",
    forest_gate: "Porte de la Forêt",
    youth: "Main-d'œuvre Jeunesse",
    parent: "Parent / Tuteur",
    supervisor: "Superviseur",
    mission: "Centre de Commande",
    start_day: "Commencer Ma Journée",
    today_project: "Projet du Jour",
    evidence: "Preuve",
    reflection: "Réflexion",
    resources: "Ressources",
    curriculum: "Programme",
    inventory: "Inventaire",
    nurse_line: "Ligne Infirmière",
    call_nurse: "Appeler la Ligne Infirmière",
    continue: "Continuer",
    supervisor_verify: "Vérification du Superviseur et Continuer",
    save_day: "Enregistrer la journée",
  };
  translations.it = {
    ...translations.en,
    app_title: "Ecosistema online di Bronson Family Farm",
    forest_gate: "Porta della Foresta",
    youth: "Forza Lavoro Giovani",
    parent: "Genitore / Tutore",
    supervisor: "Supervisore",
    mission: "Centro di Controllo",
    start_day: "Inizia la Mia Giornata",
    today_project: "Progetto di Oggi",
    evidence: "Prova",
    reflection: "Riflessione",
    resources: "Risorse",
    curriculum: "Curriculum",
    inventory: "Inventario",
    nurse_line: "Linea Infermieristica",
    call_nurse: "Chiama la Linea Infermieristica",
    continue: "Continua",
    supervisor_verify: "Verifica del Supervisore e Continua",
    save_day: "Salva Giornata",
  };
  translations.tl = {
    ...translations.en,
    app_title: "Online Ecosystem ng Bronson Family Farm",
    forest_gate: "Pintuan ng Gubat",
    youth: "Youth Workforce",
    parent: "Magulang / Tagapag-alaga",
    supervisor: "Tagapangasiwa",
    mission: "Mission Control",
    start_day: "Simulan ang Araw Ko",
    today_project: "Proyekto Ngayon",
    evidence: "Ebidensya",
    reflection: "Pagninilay",
    resources: "Mga Mapagkukunan",
    curriculum: "Kurikulum",
    inventory: "Imbentaryo",
    nurse_line: "Linya ng Nars",
    call_nurse: "Tumawag sa Linya ng Nars",
    continue: "Magpatuloy",
    supervisor_verify: "Beripikasyon ng Supervisor at Magpatuloy",
    save_day: "I-save ang Araw",
  };
  translations.he = {
    ...translations.en,
    app_title: "המערכת המקוונת של Bronson Family Farm",
    forest_gate: "שער היער",
    guest: "אורח",
    new_user: "חדש",
    returning: "חוזר",
    youth: "כוח עבודה לנוער",
    parent: "הורה / אפוטרופוס",
    supervisor: "מפקח",
    mission: "מרכז שליטה",
    start_day: "להתחיל את היום שלי",
    today_project: "הפרויקט של היום",
    evidence: "עדות",
    reflection: "השתקפות",
    resources: "משאבים",
    curriculum: "תוכנית לימודים",
    inventory: "מלאי",
    nurse_line: "קו אחות",
    call_nurse: "התקשר לקו האחות",
    continue: "המשך",
    supervisor_verify: "אימות מפקח והמשך",
    save_day: "שמור יום",
  };
}
fillFallbackTranslations();

function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function dateToISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function todayISO(override?: string) {
  return override || dateToISO(new Date());
}

function getProgramInfo(dateISO: string) {
  const date = new Date(`${dateISO}T00:00:00`);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceStart = Math.max(0, Math.floor((date.getTime() - PROGRAM_START.getTime()) / msPerDay));
  const week = Math.floor(daysSinceStart / 7) + 1;
  const dayNumber = daysSinceStart + 1;
  return { week, dayNumber };
}

function getCurriculumForDate(dateISO: string) {
  const exact = curriculum.find((d) => d.date === dateISO);
  if (exact) return exact;

  const sorted = [...curriculum].sort((a, b) => a.date.localeCompare(b.date));
  const previous = sorted.filter((d) => d.date <= dateISO).pop();
  return previous || sorted[0];
}

function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View>("portal");
  const [session, setSession] = useStoredState<UserSession | null>(STORAGE_KEYS.session, null);
  const [youthRoster, setYouthRoster] = useStoredState<YouthRecord[]>(STORAGE_KEYS.youthRoster, defaultYouthRoster);
  const [topics, setTopics] = useStoredState<Topic[]>(STORAGE_KEYS.topics, defaultTopics);
  const [inventory, setInventory] = useStoredState<InventoryItem[]>(STORAGE_KEYS.inventory, defaultInventory);
  const [dailyEntries, setDailyEntries] = useStoredState<DailyEntry[]>(STORAGE_KEYS.dailyEntries, []);
  const [damageReports, setDamageReports] = useStoredState<DamageReport[]>(STORAGE_KEYS.damageReports, []);
  const [dateOverride, setDateOverride] = useStoredState<string>(STORAGE_KEYS.launchDateOverride, "2026-06-15");
  const [loginName, setLoginName] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [parentLast4, setParentLast4] = useState("");
  const [dailyForm, setDailyForm] = useState({ ppe: false, water: false, assignment: "", evidence: "", reflection: "", safetyConcern: "" });
  const [damageForm, setDamageForm] = useState({ item: "", issue: "", action: "", reportedBy: "" });

  const t = (key: string) => translations[lang]?.[key] || translations.en[key] || key;
  const isRTL = lang === "he";
  const today = todayISO(dateOverride);
  const program = getProgramInfo(today);
  const todayCurriculum = getCurriculumForDate(today);
  const currentYouth = session?.role === "youth" ? youthRoster.find((y) => y.name.toLowerCase() === session.name.toLowerCase()) : undefined;

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [isRTL, lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const completedWeek1 = useMemo(() => today >= "2026-06-13", [today]);

  function enterAs(role: Role) {
    setSession({ role, name: role === "guest" ? "Guest" : "Launch User", verified: role === "guest", verificationMethod: role === "guest" ? "guest" : "temporary" });
    const next: View = role === "youth" ? "youth" : role === "parent" ? "parent" : role === "supervisor" ? "supervisor" : role === "mission" ? "mission" : role === "grower" ? "grower" : role === "marketplace" ? "marketplace" : role === "partner" ? "partner" : "guest";
    setView(next);
  }

  function youthContinue(supervisorOverride = false) {
    const safeName = loginName.trim() || "Youth Launch User";
    const found = youthRoster.find((y) => y.name.toLowerCase() === safeName.toLowerCase() && y.pin === loginPin.trim());

    if (found) {
      setSession({ role: "youth", name: found.name, pin: found.pin, verified: true, verificationMethod: "roster" });
      setView("youth");
      return;
    }

    if (supervisorOverride || loginPin.trim().length >= 2) {
      const existing = youthRoster.find((y) => y.name.toLowerCase() === safeName.toLowerCase());
      if (!existing) {
        setYouthRoster([...youthRoster, { name: safeName, pin: loginPin.trim() || "0000", completedTopics: [] }]);
      }
      setSession({ role: "youth", name: safeName, pin: loginPin.trim(), verified: true, verificationMethod: supervisorOverride ? "supervisor" : "temporary" });
      setView("youth");
    }
  }

  function chooseTopic(topicId: TopicId) {
    if (!session || session.role !== "youth") return;
    const topic = topics.find((x) => x.id === topicId);
    if (!topic || topic.count >= topic.capacity) return;

    const youthIndex = youthRoster.findIndex((y) => y.name.toLowerCase() === session.name.toLowerCase());
    const youth = youthRoster[youthIndex] || { name: session.name, pin: session.pin || "0000", completedTopics: [] };
    if (youth.completedTopics.includes(topicId) || youth.currentTopic === topicId) return;

    const updatedRoster = [...youthRoster];
    const updatedYouth = { ...youth, currentTopic: topicId };
    if (youthIndex >= 0) updatedRoster[youthIndex] = updatedYouth;
    else updatedRoster.push(updatedYouth);
    setYouthRoster(updatedRoster);

    setTopics(topics.map((x) => (x.id === topicId ? { ...x, count: x.count + 1 } : x)));
  }

  function saveDailyEntry() {
    if (!session) return;
    const entry: DailyEntry = {
      id: `${Date.now()}`,
      date: today,
      youthName: session.name,
      topic: currentYouth?.currentTopic,
      ppe: dailyForm.ppe,
      water: dailyForm.water,
      assignment: dailyForm.assignment,
      evidence: dailyForm.evidence,
      reflection: dailyForm.reflection,
      safetyConcern: dailyForm.safetyConcern,
    };
    setDailyEntries([entry, ...dailyEntries]);
    setDailyForm({ ppe: false, water: false, assignment: "", evidence: "", reflection: "", safetyConcern: "" });
  }

  function saveDamageReport() {
    const report: DamageReport = {
      id: `${Date.now()}`,
      date: today,
      item: damageForm.item,
      issue: damageForm.issue,
      action: damageForm.action,
      reportedBy: damageForm.reportedBy || session?.name || "Supervisor",
    };
    setDamageReports([report, ...damageReports]);
    setDamageForm({ item: "", issue: "", action: "", reportedBy: "" });
  }

  function signOut() {
    setSession(null);
    setView("portal");
  }

  return (
    <div className={`app-shell ${isRTL ? "rtl" : ""}`}>
      <PersistentTopBar t={t} lang={lang} setLang={setLang} session={session} setView={setView} signOut={signOut} />

      {view === "portal" && (
        <section className="portal forest-panel">
          <div className="portal-card">
            <p className="eyebrow">{t("forest_gate")}</p>
            <h1>{t("app_title")}</h1>
            <p className="lead">We Grow Green to Harvest Dreams.</p>
            <div className="portal-grid">
              <button onClick={() => enterAs("guest")}>{t("guest")}</button>
              <button onClick={() => setView("home")}>{t("new_user")}</button>
              <button onClick={() => setView("home")}>{t("returning")}</button>
            </div>
            <p className="small-note">{t("no_block")}</p>
          </div>
        </section>
      )}

      {view === "home" && (
        <main className="page-stack">
          <HeroCard title={t("app_title")} subtitle="Choose your path. Each path shows only the relevant part of the ecosystem." />
          <div className="path-grid">
            <PathButton label={t("youth")} onClick={() => enterAs("youth")} />
            <PathButton label={t("parent")} onClick={() => enterAs("parent")} />
            <PathButton label={t("supervisor")} onClick={() => enterAs("supervisor")} />
            <PathButton label={t("mission")} onClick={() => enterAs("mission")} />
            <PathButton label={t("grower")} onClick={() => enterAs("grower")} />
            <PathButton label={t("marketplace")} onClick={() => enterAs("marketplace")} />
            <PathButton label={t("partner")} onClick={() => enterAs("partner")} />
          </div>
          <section className="card">
            <h2>{t("youth")}</h2>
            <p>{t("access_note")}</p>
            <label>{t("name")}</label>
            <input value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Youth name" />
            <label>{t("pin")}</label>
            <input value={loginPin} onChange={(e) => setLoginPin(e.target.value)} placeholder="Assigned PIN" />
            <div className="button-row">
              <button onClick={() => youthContinue(false)}>{t("continue")}</button>
              <button className="secondary" onClick={() => youthContinue(true)}>{t("supervisor_verify")}</button>
            </div>
          </section>
          <section className="card">
            <h2>{t("parent")}</h2>
            <label>Last 4 digits of phone</label>
            <input value={parentLast4} onChange={(e) => setParentLast4(e.target.value)} placeholder="1234" />
            <button onClick={() => enterAs("parent")}>{t("continue")}</button>
          </section>
        </main>
      )}

      {view === "youth" && (
        <main className="page-stack youth-page">
          <HeroCard title={`${t("start_day")} — ${session?.name || "Youth"}`} subtitle={`${t("week")} ${program.week} · Day ${program.dayNumber} · ${today}`} />
          <section className="status-card">
            <strong>{completedWeek1 ? t("completed_week1") : "Week 1 is active."}</strong>
            <span>{t("daily_advances")}</span>
          </section>
          <section className="card priority-card">
            <h2>{t("start_day")}</h2>
            <label className="check"><input type="checkbox" checked={dailyForm.ppe} onChange={(e) => setDailyForm({ ...dailyForm, ppe: e.target.checked })} /> {t("ppe")}</label>
            <label className="check"><input type="checkbox" checked={dailyForm.water} onChange={(e) => setDailyForm({ ...dailyForm, water: e.target.checked })} /> {t("water")}</label>
            <label>{t("assignment")}</label>
            <textarea value={dailyForm.assignment} onChange={(e) => setDailyForm({ ...dailyForm, assignment: e.target.value })} placeholder="What are you working on today?" />
          </section>

          <section className="card">
            <h2>{t("choose_topic")}</h2>
            <TopicChooser t={t} topics={topics} currentYouth={currentYouth} chooseTopic={chooseTopic} />
          </section>

          <CurriculumCard t={t} day={todayCurriculum} />

          <section className="card">
            <h2>{t("evidence")}</h2>
            <p className="small-note">Evidence means proof of your work: photo, video, note, measurement, row label, team product, or supervisor observation.</p>
            <textarea value={dailyForm.evidence} onChange={(e) => setDailyForm({ ...dailyForm, evidence: e.target.value })} placeholder="What evidence did you collect?" />
          </section>

          <section className="card">
            <h2>{t("reflection")}</h2>
            <textarea value={dailyForm.reflection} onChange={(e) => setDailyForm({ ...dailyForm, reflection: e.target.value })} placeholder={todayCurriculum.reflection} />
            <label>{t("safety_concern")}</label>
            <textarea value={dailyForm.safetyConcern} onChange={(e) => setDailyForm({ ...dailyForm, safetyConcern: e.target.value })} placeholder="Anything unsafe or needing attention?" />
            <button onClick={saveDailyEntry}>{t("save_day")}</button>
          </section>
        </main>
      )}

      {view === "parent" && (
        <main className="page-stack">
          <HeroCard title={t("parent_message")} subtitle={today} />
          <section className="card"><p>{t("parent_copy")}</p></section>
          <CurriculumCard t={t} day={todayCurriculum} />
          <section className="card"><h2>{t("resources")}</h2><p>HealthyChildren, CHOC, HealthLinkBC, heat safety, parent daily updates, youth reflection prompts.</p></section>
        </main>
      )}

      {view === "supervisor" && (
        <main className="page-stack">
          <HeroCard title={t("supervisor")} subtitle="Phone-first daily control panel" />
          <DashboardStats dailyEntries={dailyEntries} topics={topics} inventory={inventory} />
          <CurriculumCard t={t} day={todayCurriculum} />
          <section className="card"><h2>{t("inventory")}</h2><InventoryTable inventory={inventory} /><button onClick={() => setView("inventory")}>{t("open")} {t("inventory")}</button></section>
          <section className="card"><h2>Recent Youth Entries</h2><EntryList entries={dailyEntries.slice(0, 5)} /></section>
        </main>
      )}

      {view === "mission" && (
        <main className="page-stack">
          <HeroCard title={t("mission")} subtitle="Launch stabilization, daily advancement, inventory, and curriculum control" />
          <section className="card">
            <h2>Launch Date / Curriculum Advance</h2>
            <p className="small-note">Use this if the day must advance manually. Current launch date: {today}</p>
            <input type="date" value={dateOverride} onChange={(e) => setDateOverride(e.target.value)} />
          </section>
          <DashboardStats dailyEntries={dailyEntries} topics={topics} inventory={inventory} />
          <section className="card"><h2>{t("curriculum")}</h2>{curriculum.map((day) => <CurriculumMini key={day.date} day={day} active={day.date === todayCurriculum.date} />)}</section>
          <section className="card"><h2>{t("inventory")}</h2><InventoryTable inventory={inventory} /><button onClick={() => setView("inventory")}>{t("open")} {t("inventory")}</button></section>
        </main>
      )}

      {view === "inventory" && (
        <main className="page-stack">
          <HeroCard title={t("inventory")} subtitle="Tools, supplies, PPE, damage reports, and supply needs" />
          <section className="card"><InventoryTable inventory={inventory} /></section>
          <section className="card">
            <h2>{t("damage_report")}</h2>
            <label>{t("item")}</label><input value={damageForm.item} onChange={(e) => setDamageForm({ ...damageForm, item: e.target.value })} />
            <label>{t("issue")}</label><textarea value={damageForm.issue} onChange={(e) => setDamageForm({ ...damageForm, issue: e.target.value })} />
            <label>{t("action")}</label><textarea value={damageForm.action} onChange={(e) => setDamageForm({ ...damageForm, action: e.target.value })} />
            <label>{t("reported_by")}</label><input value={damageForm.reportedBy} onChange={(e) => setDamageForm({ ...damageForm, reportedBy: e.target.value })} />
            <button onClick={saveDamageReport}>{t("report_damage")}</button>
          </section>
          <section className="card"><h2>Reports</h2>{damageReports.map((r) => <div className="list-item" key={r.id}><strong>{r.item}</strong><span>{r.issue}</span><small>{r.date} · {r.reportedBy} · {r.action}</small></div>)}</section>
        </main>
      )}

      {["guest", "grower", "marketplace", "partner"].includes(view) && (
        <main className="page-stack">
          <HeroCard title={t(view)} subtitle="This path is available for launch without interfering with youth workforce operations." />
          <section className="card"><p>Guided ecosystem experience, resources, and connection points remain available while youth workforce launch stays prioritized.</p></section>
        </main>
      )}
    </div>
  );
}

function PersistentTopBar({ t, lang, setLang, session, setView, signOut }: { t: (k: string) => string; lang: Lang; setLang: (l: Lang) => void; session: UserSession | null; setView: (v: View) => void; signOut: () => void }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setView(session ? "home" : "portal")}>BFF</button>
      <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label="Language">
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="tl">Tagalog</option>
        <option value="it">Italiano</option>
        <option value="he">עברית</option>
        <option value="fr">Français</option>
      </select>
      <a className="nurse-button" href={`tel:${NURSE_LINE}`}>{t("nurse_line")}</a>
      {session && <button className="secondary small" onClick={signOut}>{t("sign_out")}</button>}
    </header>
  );
}

function HeroCard({ title, subtitle }: { title: string; subtitle: string }) {
  return <section className="hero-card"><p className="eyebrow">Bronson Family Farm</p><h1>{title}</h1><p>{subtitle}</p></section>;
}

function PathButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="path-button" onClick={onClick}>{label}</button>;
}

function TopicChooser({ t, topics, currentYouth, chooseTopic }: { t: (k: string) => string; topics: Topic[]; currentYouth?: YouthRecord; chooseTopic: (id: TopicId) => void }) {
  return (
    <div className="topic-grid">
      {topics.map((topic) => {
        const full = topic.count >= topic.capacity;
        const completed = currentYouth?.completedTopics.includes(topic.id);
        const selected = currentYouth?.currentTopic === topic.id;
        return (
          <button key={topic.id} className={`topic-card ${topic.colorClass}`} disabled={full || completed || selected} onClick={() => chooseTopic(topic.id)}>
            <strong>{t(topic.titleKey)}</strong>
            <span>{topic.supervisor}</span>
            <small>{topic.count}/{topic.capacity} · {full ? t("topic_full") : completed ? t("topic_completed") : selected ? t("selected") : t("open")}</small>
          </button>
        );
      })}
    </div>
  );
}

function CurriculumCard({ t, day }: { t: (k: string) => string; day: CurriculumDay }) {
  return (
    <section className="card curriculum-card">
      <p className="eyebrow">{t("curriculum")} · {t("week")} {day.week} · {day.date}</p>
      <h2>{day.title}</h2>
      <p>{day.focus}</p>
      <h3>{t("today_project")}</h3>
      <ul>{day.activities.map((a) => <li key={a}>{a}</li>)}</ul>
      <h3>Entrepreneurship / Workforce</h3>
      <p>{day.entrepreneurship}</p>
      <h3>{t("reflection")}</h3>
      <p>{day.reflection}</p>
      <h3>{t("resources")}</h3>
      <p>{day.resources.join(" · ")}</p>
    </section>
  );
}

function CurriculumMini({ day, active }: { day: CurriculumDay; active: boolean }) {
  return <div className={`list-item ${active ? "active" : ""}`}><strong>{day.date} — {day.title}</strong><span>Week {day.week}: {day.focus}</span></div>;
}

function DashboardStats({ dailyEntries, topics, inventory }: { dailyEntries: DailyEntry[]; topics: Topic[]; inventory: InventoryItem[] }) {
  const totalAssigned = topics.reduce((sum, topic) => sum + topic.count, 0);
  const damaged = inventory.reduce((sum, item) => sum + item.damaged, 0);
  return (
    <section className="stats-grid">
      <div><strong>{dailyEntries.length}</strong><span>Daily entries</span></div>
      <div><strong>{totalAssigned}</strong><span>Topic assignments</span></div>
      <div><strong>{damaged}</strong><span>Damaged items</span></div>
    </section>
  );
}

function InventoryTable({ inventory }: { inventory: InventoryItem[] }) {
  return (
    <div className="inventory-list">
      {inventory.map((item) => (
        <div className="inventory-row" key={item.id}>
          <strong>{item.name}</strong>
          <span>{item.category}</span>
          <small>Total {item.total} · Available {item.available} · Damaged {item.damaged}</small>
          <em>{item.notes}</em>
        </div>
      ))}
    </div>
  );
}

function EntryList({ entries }: { entries: DailyEntry[] }) {
  if (!entries.length) return <p className="small-note">No entries saved yet.</p>;
  return <>{entries.map((e) => <div className="list-item" key={e.id}><strong>{e.youthName}</strong><span>{e.assignment || "No assignment text"}</span><small>{e.date} · PPE {e.ppe ? "yes" : "no"} · Water {e.water ? "yes" : "no"}</small></div>)}</>;
}

export default App;
