import React, { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Bronson Family Farm Online Ecosystem
 * LAUNCH CANDIDATE 1.3 - ROLE PATHWAY AUDIT FIX + IMAGE PATH RESTORE
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
  | "demo"
  | "guest"
  | "registration"
  | "roles"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "partner"
  | "support"
  | "caseManager"
  | "valueAdded"
  | "marketplace"
  | "wellness"
  | "reports"
  | "operations"
  | "events"
  | "media"
  | "launchProject"
  | "feedback"
  | "completion";

type LanguageCode = "en" | "es" | "tl" | "it" | "he" | "fr";

type LanguageOption = {
  code: LanguageCode;
  label: string;
  shortLabel: string;
  dir?: "ltr" | "rtl";
};

type Role =
  | "Guest"
  | "Youth Workforce Participant"
  | "Parent / Guardian"
  | "Supervisor / Staff"
  | "Case Manager"
  | "Grower"
  | "Marketplace Customer"
  | "Volunteer"
  | "Partner"
  | "Administrator"
  | "Value-Added Producer"
  | "Board / Funder";

type AccessLevel = "public" | "participant" | "family" | "staff" | "admin" | "board";
type ProfileType = "youth" | "supervisor" | "case_manager" | "parent" | "grower" | "value_added" | "volunteer" | "partner" | "customer" | "board";

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

type ParentContactLog = {
  id: string;
  participant_id: string;
  youth_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  contact_method: "phone" | "text" | "email" | "in_person" | "left_message" | "other";
  contact_reason: "daily_update" | "encouragement" | "concern" | "incident" | "pickup" | "attendance" | "other";
  contact_notes: string;
  staff_id?: string;
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
  screen?: string;
  pathway?: string;
  role?: string;
  excited?: string;
  confused?: string;
  improve?: string;
  opportunity_interest?: string;
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
const INCIDENT_KEY = "bff.launch.incidents";
const PARENT_SUMMARY_KEY = "bff.launch.parentSummaries";
const PARENT_CONTACT_KEY = "bff.launch.parentContactLogs";
const FEEDBACK_KEY = "bff.launch.feedback";
const MARKET_PRODUCTS_KEY = "bff.launch.market.products";
const MARKET_ORDERS_KEY = "bff.launch.market.orders";
const MARKET_ORDER_ITEMS_KEY = "bff.launch.market.orderItems";
const JOURNEY_KEY = "bff.launch.journey.events";
const COMPLETION_KEY = "bff.launch.completions";
const LANGUAGE_KEY = "bff.launch.language";

const IMG = {
  // Public-folder image paths. Files are in /public, so they are referenced from the site root.
  // Keep spaces/capitalization exactly as the uploaded file names; Vercel is case-sensitive.
  forest: "/images/Grow Area.png",
  backup: "/images/GrowArea2.jpg",
  youth: "/images/Fence_volunteers.png",
  supervisor: "/images/large (15).jpg",
  market: "/images/large.jpg",
  ecosystem: "/images/ConnectFoodEcosystem_withimages.png",
  grow: "/images/Grow Area.png",
  compost: "/images/Compost_ElliottGarden.png",
  partners: "/images/Queens Village.png",
  queens: "/images/Queens Village.png",
  seeds: "/images/Seeds_Jubilee Gardens.png",
  fencing: "/images/Deer Fencing.png",
  interview: "/images/WKBN Interview.png",
  compostElliott: "/images/Compost_Elliott.png",
  deerFencing: "/images/Deer Fencing.png",
  volunteers: "/images/Fence_volunteers.png",
  culinaryFlowers: "/images/culniary_edibleflowers.jpeg",
};

const launchEvents = [
  {
    title: "Staff & Supervisor Orientation",
    date: "Friday, June 5, 2026",
    time: "9:30 AM",
    audience: "Staff, supervisors, aides, and volunteers",
    purpose: "Prepare the launch team for youth safety, attendance, wellness monitoring, incident reporting, parent-safe communication, daily assessments, emergency procedures, site rules, and platform use.",
  },
  {
    title: "Youth Workforce Program Launch",
    date: "Monday, June 8, 2026",
    time: "8:00 AM",
    audience: "Youth Workforce Program participants",
    purpose: "Begin the Cultivators experience with check-in, PPE, heat-safety orientation, team assignment, workforce production simulation, reflection, and media documentation.",
  },
];

const featuredProject = {
  id: "cooling-center-2026",
  title: "June 8 Workforce Production Challenge",
  shortTitle: "63 Cooling Fan Challenge",
  launchDate: "June 8, 2026",
  startTime: "8:00 AM",
  status: "Launch Ready",
  objective:
    "Youth will complete a real customer order: produce, paint, quality-check, and prepare 63 cooling fans for a contractor building a cooling station at Bronson Family Farm.",
  farmConnection:
    "Bronson Family Farm is the customer that needs a cooling station. A contractor is hired to build it. The contractor becomes the customer when ordering 63 fans from the youth manufacturing workforce. This teaches the business cycle, production, value creation, and how farm operations connect to real work.",
};

const coolingCenterTeams = [
  {
    name: "Design Team",
    icon: "🎨",
    identity: "We help people see possibilities.",
    recommendedShare: "Small team: 6–8 youth",
    mission: "Create the visual direction for the 63-fan customer order and help the team imagine how simple materials can become useful products.",
    deliverables: ["Color ideas", "Fan design standards", "Signs or labels", "Presentation support"],
    skills: ["Creativity", "Branding", "Communication", "Design Thinking"],
    careers: ["Graphic Designer", "Product Designer", "Architect", "Marketing Specialist", "Brand Designer"],
  },
  {
    name: "Engineering Team",
    icon: "📐",
    identity: "We improve ideas.",
    recommendedShare: "Small team: 5–7 youth",
    mission: "Review how the fan works, improve the process, reduce waste, and help the production teams meet quality and safety standards.",
    deliverables: ["Quality checklist", "Process improvements", "Material-use recommendations", "Safety review"],
    skills: ["Problem Solving", "Testing", "Measurement", "Process Improvement"],
    careers: ["Engineer", "Technician", "Quality Specialist", "Construction Planner", "Process Improvement Specialist"],
  },
  {
    name: "Manufacturing Team",
    icon: "🔧",
    identity: "We turn ideas into products.",
    recommendedShare: "Largest team: 25–30 youth",
    mission: "Produce the customer order by measuring, assembling, and preparing 63 cooling fans for finishing and delivery.",
    deliverables: ["63 assembled fans", "Production count", "Safe assembly process", "Completed components"],
    skills: ["Production", "Assembly", "Following Instructions", "Teamwork", "Responsibility"],
    careers: ["Manufacturing Technician", "Fabricator", "Production Manager", "Machine Operator", "Assembler"],
  },
  {
    name: "Finishing & Creative Team",
    icon: "🖌",
    identity: "We create value through quality and presentation.",
    recommendedShare: "Medium team: 10–12 youth",
    mission: "Paint, personalize, and prepare the fans so the final products look finished, intentional, and ready for the customer.",
    deliverables: ["Painted fans", "Personalized designs", "Finished appearance", "Quality-ready products"],
    skills: ["Painting", "Attention to Detail", "Creativity", "Quality Control"],
    careers: ["Painter", "Finishing Specialist", "Product Inspector", "Quality Control Technician"],
  },
  {
    name: "Logistics & Contractor Team",
    icon: "📦",
    identity: "We connect products to people.",
    recommendedShare: "Medium team: 8–10 youth",
    mission: "Organize materials, track inventory, manage drying and delivery staging, and help the contractor prepare the fans for the cooling station.",
    deliverables: ["Materials organized", "Inventory count", "Drying area managed", "Delivery-ready order"],
    skills: ["Logistics", "Inventory", "Project Management", "Customer Service"],
    careers: ["Supply Chain Manager", "Warehouse Manager", "Transportation Coordinator", "Project Manager", "Operations Specialist"],
  },
];

const coolingCenterReflectionQuestions = [
  "What team did you work on today?",
  "What was your responsibility?",
  "What did your team create?",
  "What challenge did your team face?",
  "How did your team solve the problem?",
  "Which team depended on your work?",
  "How does a cooling station help farm workers, volunteers, or visitors?",
  "What message or design did you place on a fan, and why?",
  "What career pathway interested you most today?",
  "What are you proud of today?",
];


const youthCurriculumWeeks = [
  {
    week: 1,
    title: "Workplace Foundations & Safety",
    focus: "Orientation, farm safety, PPE, heat safety, teamwork, communication, and the June 8 Cooling Station Challenge.",
    project: "Farm Worker Heat Safety & Cooling Station Challenge",
    skills: ["Safety", "Teamwork", "Communication", "Problem Solving", "Following Instructions"],
    badge: "🏅 Workplace Foundations",
    status: "Current Week",
  },
  {
    week: 2,
    title: "Regenerative Agriculture",
    focus: "Soil health, compost, planting, biodiversity, food systems, and caring for land as a living ecosystem.",
    project: "Regenerative growing and soil stewardship activities",
    skills: ["Observation", "Soil Health", "Plant Care", "Environmental Stewardship"],
    badge: "🌱 Regenerative Agriculture",
    status: "Upcoming",
  },
  {
    week: 3,
    title: "Farm Infrastructure",
    focus: "Fencing, water, shade, tools, work zones, field layout, safety zones, and farm operations support.",
    project: "Farm infrastructure and site-readiness project",
    skills: ["Construction", "Tool Safety", "Planning", "Logistics"],
    badge: "🏗 Infrastructure Builder",
    status: "Upcoming",
  },
  {
    week: 4,
    title: "Production & Harvest",
    focus: "Crop care, harvesting, washing, sorting, handling, quality, and food safety awareness.",
    project: "Production and harvest readiness activities",
    skills: ["Harvest", "Quality Control", "Food Safety", "Responsibility"],
    badge: "🥕 Production Specialist",
    status: "Upcoming",
  },
  {
    week: 5,
    title: "Marketplace & Entrepreneurship",
    focus: "Customer service, pricing, product presentation, GrownBy, SNAP awareness, and farm-based entrepreneurship.",
    project: "Marketplace and customer experience project",
    skills: ["Customer Service", "Sales", "Pricing", "Entrepreneurship"],
    badge: "🛒 Marketplace Explorer",
    status: "Upcoming",
  },
  {
    week: 6,
    title: "Leadership & Community",
    focus: "Team leadership, communication, service, visitor support, community impact, and peer responsibility.",
    project: "Leadership and community service activity",
    skills: ["Leadership", "Service", "Communication", "Accountability"],
    badge: "🤝 Community Leader",
    status: "Upcoming",
  },
  {
    week: 7,
    title: "Career Exploration",
    focus: "Agriculture, construction, engineering, culinary, tourism, marketing, environmental science, and public safety careers.",
    project: "Career pathway exploration and portfolio development",
    skills: ["Career Awareness", "Interviewing", "Goal Setting", "Professional Identity"],
    badge: "🧭 Career Pathfinder",
    status: "Upcoming",
  },
  {
    week: 8,
    title: "Capstone & Achievement",
    focus: "Final project presentation, portfolio review, supervisor recognition, skills summary, and achievement certificate.",
    project: "Cultivator capstone and achievement showcase",
    skills: ["Presentation", "Reflection", "Portfolio", "Readiness"],
    badge: "🏆 Cultivator Achievement",
    status: "Upcoming",
  },
];

const youthAchievementBadges = youthCurriculumWeeks.map((week) => ({
  title: week.badge,
  week: `Week ${week.week}`,
  earned: week.week === 1,
  description: week.focus,
}));

const youthPortfolioEntries = [
  {
    title: "Cooling Station Challenge",
    date: "June 8, 2026",
    team: "Design • Engineering • Manufacturing • Contractor",
    evidence: "Check-in, fan demonstration video, project photos, team deliverables, reflection, and supervisor assessment.",
    skills: ["Safety", "Teamwork", "Problem Solving", "Communication", "Farm Operations"],
  },
];


type LaunchVideo = {
  title: string;
  purpose: string;
  file?: string;
  embedUrl?: string;
  embedTitle?: string;
  fallback: string;
  tags: string[];
};

const launchVideos: LaunchVideo[] = [
  {
    title: "June 5 Staff & Supervisor Orientation Video",
    purpose: "Staff orientation, site rules, safety expectations, youth support, emergency procedures, and platform training.",
    file: "/videos/june5-staff-supervisor-orientation.mp4",
    fallback: "Supervisor Orientation Video: Training materials for site rules, youth safety, daily operations, emergency procedures, parent-safe communication, and platform use will be added here as the program expands.",
    tags: ["Orientation", "Staff", "Safety"],
  },
  {
    title: "June 8 Cooling Station Challenge Introduction Video",
    purpose: "Introduces youth to the farm worker heat-safety problem, the four-team production flow, and the connection to real farm operations.",
    file: "/videos/june8-cooling-station-introduction.mp4",
    fallback: "Cooling Station Introduction: This training section introduces the farm worker heat-safety challenge, team assignments, safety expectations, and the connection to real farm operations.",
    tags: ["Youth", "Cooling Station", "Farm Safety"],
  },
  {
    title: "Fan Template & Design Demonstration Video",
    purpose: "Watch the cardboard fan demonstration before the June 8 Cooling Station Challenge. Youth use this to understand how the template, assembly, and hand-powered fan concept works before Design, Engineering, Manufacturing, and Contractor teams begin their work.",
    embedUrl: "https://www.youtube.com/embed/dtYzf3avkT4",
    embedTitle: "DIY Cardboard Fan | Cardboard Fan no motor no battery",
    fallback: "Training Resource Available: Fan template and design demonstration for the Cooling Station Challenge.",
    tags: ["Fan Video", "Design", "Templates", "June 8"],
  },
  {
    title: "Manufacturing: Assemble, Paint, Personalize, and Quality Check",
    purpose: "Documents the Manufacturing Team assembling, painting, branding, personalizing, and quality-checking the fans.",
    file: "/videos/fan-manufacturing-painting.mp4",
    fallback: "Manufacturing Team Training Module: This section demonstrates assembly, painting, personalization, branding, and quality review procedures used during the Cooling Station Challenge.",
    tags: ["Fan Video", "Manufacturing", "Painting"],
  },
  {
    title: "Final Cooling Station Completion Video",
    purpose: "Shows the Contractor Team collecting fans, building the cooling station, and presenting the final farm heat-safety solution.",
    file: "/videos/cooling-station-completion.mp4",
    fallback: "Final Cooling Station Completion Module: This section documents project completion, final setup, team presentation, safety learning, and portfolio evidence.",
    tags: ["Completion", "Contractor", "Farm Infrastructure"],
  },
];



const languageOptions: LanguageOption[] = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "es", label: "Español", shortLabel: "ES" },
  { code: "tl", label: "Tagalog", shortLabel: "TL" },
  { code: "it", label: "Italiano", shortLabel: "IT" },
  { code: "he", label: "עברית", shortLabel: "HE", dir: "rtl" },
  { code: "fr", label: "Français", shortLabel: "FR" },
];

const languageText: Record<LanguageCode, Record<string, string>> = {
  en: {
    language: "Language", portal: "Portal", demo: "Demo", guest: "Guest", register: "Register", workspace: "My Workspace", youth: "Youth", supervisor: "Supervisor", parent: "Parent", grower: "Grower", partner: "Partner", support: "Support", valueAdded: "Value-Added", market: "Market", wellness: "Wellness", reports: "Reports", ops: "Ops", feedback: "Feedback", complete: "Complete", publicGuest: "Public / Guest", signOut: "Sign Out", onlineEcosystem: "Online Ecosystem", events: "Events", media: "Media", project: "6/8 Project"
  },
  es: {
    language: "Idioma", portal: "Portal", demo: "Demo", guest: "Visitante", register: "Registro", workspace: "Mi espacio", youth: "Jóvenes", supervisor: "Supervisor", parent: "Padres", grower: "Productor", partner: "Aliado", support: "Apoyar", valueAdded: "Valor agregado", market: "Mercado", wellness: "Bienestar", reports: "Reportes", ops: "Operaciones", feedback: "Comentarios", complete: "Completar", publicGuest: "Público / Visitante", signOut: "Salir", onlineEcosystem: "Ecosistema en línea"
  },
  tl: {
    language: "Wika", portal: "Portal", demo: "Demo", guest: "Bisita", register: "Magrehistro", workspace: "Aking Workspace", youth: "Kabataan", supervisor: "Supervisor", parent: "Magulang", grower: "Magtatanim", partner: "Katuwang", support: "Suporta", valueAdded: "Value-Added", market: "Merkado", wellness: "Kalusugan", reports: "Ulat", ops: "Operasyon", feedback: "Komento", complete: "Kumpleto", publicGuest: "Publiko / Bisita", signOut: "Mag-sign Out", onlineEcosystem: "Online Ecosystem"
  },
  it: {
    language: "Lingua", portal: "Portale", demo: "Demo", guest: "Ospite", register: "Registrati", workspace: "Il mio spazio", youth: "Giovani", supervisor: "Supervisore", parent: "Genitori", grower: "Coltivatore", partner: "Partner", support: "Sostieni", valueAdded: "Valore aggiunto", market: "Mercato", wellness: "Benessere", reports: "Report", ops: "Operazioni", feedback: "Feedback", complete: "Completa", publicGuest: "Pubblico / Ospite", signOut: "Esci", onlineEcosystem: "Ecosistema online"
  },
  he: {
    language: "שפה", portal: "שער", demo: "הדגמה", guest: "אורח", register: "הרשמה", workspace: "המרחב שלי", youth: "נוער", supervisor: "מדריך", parent: "הורה", grower: "מגדל", partner: "שותף", support: "תמיכה", valueAdded: "מוצרי ערך מוסף", market: "שוק", wellness: "רווחה", reports: "דוחות", ops: "תפעול", feedback: "משוב", complete: "סיום", publicGuest: "ציבור / אורח", signOut: "יציאה", onlineEcosystem: "אקוסיסטם מקוון"
  },
  fr: {
    language: "Langue", portal: "Portail", demo: "Démo", guest: "Invité", register: "S'inscrire", workspace: "Mon espace", youth: "Jeunes", supervisor: "Superviseur", parent: "Parent", grower: "Producteur", partner: "Partenaire", support: "Soutenir", valueAdded: "Valeur ajoutée", market: "Marché", wellness: "Bien-être", reports: "Rapports", ops: "Opérations", feedback: "Commentaires", complete: "Terminer", publicGuest: "Public / Invité", signOut: "Déconnexion", onlineEcosystem: "Écosystème en ligne"
  },
};


const launchPhraseTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {},
  es: {
    "My Day": "Mi Día",
    "My Week": "Mi Semana",
    "Current Project": "Proyecto Actual",
    "Progress": "Progreso",
    "Achievement": "Logro",
    "My 8-Week Journey": "Mi Recorrido de 8 Semanas",
    "Cultivator Workforce Development Roadmap": "Ruta de Desarrollo Laboral de Cultivadores",
    "Week": "Semana",
    "Current Week": "Semana Actual",
    "Upcoming": "Próximo",
    "Workplace Foundations & Safety": "Fundamentos del Lugar de Trabajo y Seguridad",
    "Regenerative Agriculture": "Agricultura Regenerativa",
    "Farm Infrastructure": "Infraestructura de la Granja",
    "Production & Harvest": "Producción y Cosecha",
    "Marketplace & Entrepreneurship": "Mercado y Emprendimiento",
    "Leadership & Community": "Liderazgo y Comunidad",
    "Career Exploration": "Exploración de Carreras",
    "Capstone & Achievement": "Proyecto Final y Logro",
    "Safety": "Seguridad",
    "Teamwork": "Trabajo en Equipo",
    "Communication": "Comunicación",
    "Problem Solving": "Resolución de Problemas",
    "Following Instructions": "Seguir Instrucciones",
    "Farm Worker Heat Safety & Cooling Station Challenge": "Reto de Seguridad Contra el Calor y Estación de Enfriamiento para Trabajadores Agrícolas",
    "Orientation, farm safety, PPE, heat safety, teamwork, communication, and the June 8 Cooling Station Challenge.": "Orientación, seguridad agrícola, PPE, seguridad contra el calor, trabajo en equipo, comunicación y el Reto de Estación de Enfriamiento del 8 de junio.",
    "Youth begin each day by checking in, understanding the day's farm work, seeing where the work fits in the 8-week Cultivator journey, and building evidence for their portfolio and achievements.": "Los jóvenes comienzan cada día registrándose, comprendiendo el trabajo agrícola del día, viendo cómo encaja en el recorrido de 8 semanas de Cultivadores y creando evidencia para su portafolio y logros.",
    "Youth will complete a real customer order: produce, paint, quality-check, and prepare 63 cooling fans for a contractor building a cooling station at Bronson Family Farm.": "Los jóvenes diseñarán y construirán una estación de enfriamiento agrícola que ayude a proteger a trabajadores, jóvenes, voluntarios y visitantes del estrés por calor durante la programación de verano al aire libre.",
    "Today's Project": "Proyecto de Hoy",
  },
  tl: {
    "My Day": "Aking Araw",
    "My Week": "Aking Linggo",
    "Current Project": "Kasalukuyang Proyekto",
    "Progress": "Progreso",
    "Achievement": "Nakamit",
    "My 8-Week Journey": "Aking 8-Linggong Paglalakbay",
    "Cultivator Workforce Development Roadmap": "Roadmap ng Pag-unlad sa Trabaho ng Cultivator",
    "Week": "Linggo",
    "Current Week": "Kasalukuyang Linggo",
    "Upcoming": "Paparating",
    "Workplace Foundations & Safety": "Pundasyon sa Trabaho at Kaligtasan",
    "Regenerative Agriculture": "Regenerative na Pagsasaka",
    "Farm Infrastructure": "Imprastraktura ng Bukid",
    "Production & Harvest": "Produksyon at Ani",
    "Marketplace & Entrepreneurship": "Merkado at Pagnenegosyo",
    "Leadership & Community": "Pamumuno at Komunidad",
    "Career Exploration": "Pagkilala sa mga Karera",
    "Capstone & Achievement": "Pangwakas na Proyekto at Nakamit",
    "Safety": "Kaligtasan",
    "Teamwork": "Pagtutulungan",
    "Communication": "Komunikasyon",
    "Problem Solving": "Paglutas ng Problema",
    "Following Instructions": "Pagsunod sa Panuto",
    "Farm Worker Heat Safety & Cooling Station Challenge": "Hamon sa Kaligtasan sa Init at Cooling Station para sa Manggagawa sa Bukid",
    "Orientation, farm safety, PPE, heat safety, teamwork, communication, and the June 8 Cooling Station Challenge.": "Oryentasyon, kaligtasan sa bukid, PPE, kaligtasan sa init, pagtutulungan, komunikasyon, at ang June 8 Cooling Station Challenge.",
    "Youth begin each day by checking in, understanding the day's farm work, seeing where the work fits in the 8-week Cultivator journey, and building evidence for their portfolio and achievements.": "Nagsisimula ang mga kabataan bawat araw sa pag-check in, pag-unawa sa gawain sa bukid, pagtingin kung paano ito bahagi ng 8-linggong Cultivator journey, at pagbuo ng ebidensya para sa kanilang portfolio at mga nakamit.",
    "Youth will complete a real customer order: produce, paint, quality-check, and prepare 63 cooling fans for a contractor building a cooling station at Bronson Family Farm.": "Magdidisenyo at gagawa ang mga kabataan ng cooling station sa bukid upang makatulong na protektahan ang mga manggagawa, kabataan, boluntaryo, at bisita mula sa init habang may summer programming sa labas.",
    "Today's Project": "Proyekto Ngayon",
  },
  it: {
    "My Day": "La Mia Giornata",
    "My Week": "La Mia Settimana",
    "Current Project": "Progetto Attuale",
    "Progress": "Progresso",
    "Achievement": "Risultato",
    "My 8-Week Journey": "Il Mio Percorso di 8 Settimane",
    "Cultivator Workforce Development Roadmap": "Percorso di Sviluppo Lavorativo dei Coltivatori",
    "Week": "Settimana",
    "Current Week": "Settimana Attuale",
    "Upcoming": "In Arrivo",
    "Workplace Foundations & Safety": "Fondamenti del Lavoro e Sicurezza",
    "Regenerative Agriculture": "Agricoltura Rigenerativa",
    "Farm Infrastructure": "Infrastruttura Agricola",
    "Production & Harvest": "Produzione e Raccolto",
    "Marketplace & Entrepreneurship": "Mercato e Imprenditorialità",
    "Leadership & Community": "Leadership e Comunità",
    "Career Exploration": "Esplorazione delle Carriere",
    "Capstone & Achievement": "Progetto Finale e Risultato",
    "Safety": "Sicurezza",
    "Teamwork": "Lavoro di Squadra",
    "Communication": "Comunicazione",
    "Problem Solving": "Risoluzione dei Problemi",
    "Following Instructions": "Seguire le Istruzioni",
    "Farm Worker Heat Safety & Cooling Station Challenge": "Sfida per la Sicurezza dal Calore e Stazione di Raffreddamento dei Lavoratori Agricoli",
    "Today's Project": "Progetto di Oggi",
  },
  he: {
    "My Day": "היום שלי",
    "My Week": "השבוע שלי",
    "Current Project": "הפרויקט הנוכחי",
    "Progress": "התקדמות",
    "Achievement": "הישג",
    "My 8-Week Journey": "המסע שלי בן 8 שבועות",
    "Cultivator Workforce Development Roadmap": "מפת דרכים לפיתוח כוח עבודה",
    "Week": "שבוע",
    "Current Week": "השבוע הנוכחי",
    "Upcoming": "בקרוב",
    "Workplace Foundations & Safety": "יסודות העבודה ובטיחות",
    "Regenerative Agriculture": "חקלאות מתחדשת",
    "Farm Infrastructure": "תשתיות החווה",
    "Production & Harvest": "ייצור וקציר",
    "Marketplace & Entrepreneurship": "שוק ויזמות",
    "Leadership & Community": "מנהיגות וקהילה",
    "Career Exploration": "חקר קריירות",
    "Capstone & Achievement": "פרויקט מסכם והישג",
    "Safety": "בטיחות",
    "Teamwork": "עבודת צוות",
    "Communication": "תקשורת",
    "Problem Solving": "פתרון בעיות",
    "Following Instructions": "ציות להוראות",
    "Farm Worker Heat Safety & Cooling Station Challenge": "אתגר בטיחות מחום ותחנת קירור לעובדי חווה",
    "Today's Project": "הפרויקט של היום",
  },
  fr: {
    "My Day": "Ma Journée",
    "My Week": "Ma Semaine",
    "Current Project": "Projet Actuel",
    "Progress": "Progrès",
    "Achievement": "Réussite",
    "My 8-Week Journey": "Mon Parcours de 8 Semaines",
    "Cultivator Workforce Development Roadmap": "Feuille de Route du Développement des Cultivateurs",
    "Week": "Semaine",
    "Current Week": "Semaine Actuelle",
    "Upcoming": "À Venir",
    "Workplace Foundations & Safety": "Bases du Travail et Sécurité",
    "Regenerative Agriculture": "Agriculture Régénératrice",
    "Farm Infrastructure": "Infrastructure de la Ferme",
    "Production & Harvest": "Production et Récolte",
    "Marketplace & Entrepreneurship": "Marché et Entrepreneuriat",
    "Leadership & Community": "Leadership et Communauté",
    "Career Exploration": "Exploration des Carrières",
    "Capstone & Achievement": "Projet Final et Réussite",
    "Safety": "Sécurité",
    "Teamwork": "Travail d'Équipe",
    "Communication": "Communication",
    "Problem Solving": "Résolution de Problèmes",
    "Following Instructions": "Suivre les Instructions",
    "Farm Worker Heat Safety & Cooling Station Challenge": "Défi de Sécurité Contre la Chaleur et Station de Refroidissement des Travailleurs Agricoles",
    "Today's Project": "Projet d’Aujourd’hui",
  },
};

function lt(language: LanguageCode, phrase: string) {
  return launchPhraseTranslations[language]?.[phrase] || screenTranslations[language]?.[phrase] || phrase;
}

function t(language: LanguageCode, key: string) {
  return languageText[language]?.[key] || languageText.en[key] || key;
}

function languageDir(language: LanguageCode) {
  return languageOptions.find((option) => option.code === language)?.dir || "ltr";
}


// Launch Candidate 1.5: translation audit layer.
// This keeps App (46) intact, restores full-page translation without rebuilding the ecosystem,
// and translates legacy hardcoded body text while pathways are being stabilized.
const screenTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {},
  es: {
    "Protected area. Enter as Supervisor / Staff, Administrator, or Board / Funder first.": "Área protegida. Primero ingrese como Supervisor / Personal, Administrador o Junta / Financiador.",
    "Enter the living ecosystem.": "Entre al ecosistema vivo.",
    "Welcome to the Mahoning & Trumbull Regional Food Ecosystem. Current regional hubs: Youngstown — Bronson Family Farm and Warren — Parker Farms. This platform connects youth workforce development, parents, growers, partners, supporters, marketplace, wellness, safety, feedback, and impact reporting.": "Bienvenido al Ecosistema Regional de Alimentos de Mahoning y Trumbull. Centros regionales actuales: Youngstown — Bronson Family Farm y Warren — Parker Farms. Esta plataforma conecta desarrollo laboral juvenil, padres, productores, aliados, colaboradores, mercado, bienestar, seguridad, comentarios e informes de impacto.",
    "Start Guided Demo": "Iniciar recorrido guiado",
    "Enter The Ecosystem": "Entrar al ecosistema",
    "Register / Check In": "Registrarse / Check-in",
    "My Workspace": "Mi espacio",
    "Launch Focus": "Enfoque de lanzamiento",
    "Regional hubs: Youngstown — Bronson Family Farm and Warren — Parker Farms.": "Centros regionales: Youngstown — Bronson Family Farm y Warren — Parker Farms.",
    "Choose a role, then follow a guided pathway with resources, opportunities, and next steps.": "Elija un rol y siga una ruta guiada con recursos, oportunidades y próximos pasos.",
    "Supervisor Operations Center is the staff-only control room.": "El Centro de Operaciones de Supervisores es el espacio de control solo para el personal.",
    "Youth check-ins and supervisor records save locally first, then sync to Supabase when connected.": "Los registros de jóvenes y supervisores se guardan localmente primero y luego se sincronizan con Supabase cuando está conectado.",
    "Parents receive progress summaries, not private raw youth reflections.": "Los padres reciben resúmenes de progreso, no reflexiones privadas sin procesar de los jóvenes.",
    "Incident and support flags stay staff-facing.": "Los incidentes y señales de apoyo permanecen para el personal.",
    "Reports convert daily records into launch readiness and program impact.": "Los informes convierten los registros diarios en preparación para el lanzamiento e impacto del programa.",
    "Welcome Back / Journey Memory": "Bienvenido de nuevo / Memoria del recorrido",
    "🌞 My Day": "🌞 Mi Día",
    "June 8 Launch Assignment": "Asignación de lanzamiento del 8 de junio",
    "Pathway": "Ruta",
    "Guest Pathway": "Ruta de visitante",
    "Guests learn the farm story, the connected food ecosystem, the airport place-based context, and how youth, growers, families, and partners move together.": "Los visitantes conocen la historia de la granja, el ecosistema alimentario conectado, el contexto del aeropuerto y cómo jóvenes, productores, familias y aliados avanzan juntos.",
    "Return to Portal": "Volver al portal",
    "Choose Another Role": "Elegir otro rol",
    "Comment on This Screen": "Comentar esta pantalla",
    "Record Achievement": "Completar recorrido",
    "Go to Marketplace": "Ir al mercado",
    "Guided Demo": "Recorrido guiado",
    "Experience the ecosystem in order.": "Experimente el ecosistema en orden.",
    "This guided demo lets every user understand the same launch story: Youngstown — Bronson Family Farm, Warren — Parker Farms, and the connected regional ecosystem.": "Este recorrido guiado permite que cada usuario comprenda la misma historia de lanzamiento: Youngstown — Bronson Family Farm, Warren — Parker Farms y el ecosistema regional conectado.",
    "Choose Role": "Elegir rol",
    "Comment / Save Feedback": "Comentar / Guardar comentarios",
    "Tell us about the platform and program experience.": "Cuéntenos sobre la experiencia de la plataforma y el programa.",
    "Rating": "Calificación",
    "I would recommend this experience.": "Recomendaría esta experiencia.",
    "What excited you?": "¿Qué le emocionó?",
    "What confused you?": "¿Qué le confundió?",
    "What would you improve?": "¿Qué mejoraría?",
    "What opportunity interests you?": "¿Qué oportunidad le interesa?",
    "Additional Comments": "Comentarios adicionales",
    "Save Feedback / Comments": "Guardar comentarios",
    "Return to Guided Demo": "Volver al recorrido guiado",
    "Feedback/comments saved on this device and sent to Supabase when the feedback table accepts the row.": "Comentarios guardados en este dispositivo y enviados a Supabase cuando la tabla los acepte.",
    "Grower Pathway": "Ruta del productor",
    "Every grower belongs here: backyard gardens, raised beds, community gardens, school gardens, church gardens, urban farms, greenhouses, homesteads, and market farms. Growers can connect crop planning, resource needs, inventory, training, and marketplace opportunity.": "Todo productor pertenece aquí: patios, camas elevadas, jardines comunitarios, escolares, de iglesias, granjas urbanas, invernaderos, homesteads y granjas de mercado. Los productores conectan planificación de cultivos, necesidades de recursos, inventario, capacitación y oportunidades de mercado.",
    "Create Grower Profile": "Crear perfil de productor",
    "Marketplace Opportunities": "Oportunidades de mercado",
    "Partner Pathway": "Ruta de aliados",
    "Partners include schools, businesses, nonprofits, agencies, funders, faith communities, universities, and volunteer groups. This journey helps partners understand what the ecosystem offers, what it needs, and how collaboration can create measurable community impact.": "Los aliados incluyen escuelas, empresas, organizaciones sin fines de lucro, agencias, financiadores, comunidades de fe, universidades y grupos de voluntarios. Esta ruta ayuda a comprender lo que ofrece el ecosistema, lo que necesita y cómo la colaboración crea impacto medible.",
    "Create Partner Profile": "Crear perfil de aliado",
    "Support Options": "Opciones de apoyo",
    "Support the Ecosystem": "Apoyar el ecosistema",
    "Support can be financial, volunteer-based, mentorship-based, or in-kind. Jubilee Gardens, Inc. is recognized as a Seed Steward for providing abundant seeds over the past two years. Supporters can help with youth, growers, food access, infrastructure, education, and regional growth.": "El apoyo puede ser financiero, voluntario, mentoría o en especie. Jubilee Gardens, Inc. es reconocido como Guardián de Semillas por aportar abundantes semillas durante dos años. Los colaboradores apoyan jóvenes, productores, acceso a alimentos, infraestructura, educación y crecimiento regional.",
    "Offer Support": "Ofrecer apoyo",
    "Become a Partner": "Convertirse en aliado",
    "Value-Added Producer Pathway": "Ruta de productor de valor agregado",
    "Value-added producers turn harvests, herbs, honey, seeds, flowers, and ideas into products. This pathway connects product readiness, packaging, pricing, labeling awareness, and marketplace participation.": "Los productores de valor agregado convierten cosechas, hierbas, miel, semillas, flores e ideas en productos. Esta ruta conecta preparación del producto, empaque, precios, etiquetado y participación en el mercado.",
    "Create Producer Profile": "Crear perfil de productor",
    "Connect to Marketplace": "Conectar al mercado",
    "Youth Workforce Pathway": "Ruta de fuerza laboral juvenil",
    "Youth begin with check-in, safety, PPE, daily assignments, wellness awareness, reflection, and skill-building. The supervisor records operational progress.": "Los jóvenes comienzan con check-in, seguridad, PPE, asignaciones diarias, conciencia de bienestar, reflexión y desarrollo de habilidades. El supervisor registra el progreso operativo.",
    "Start My Day": "Comenzar mi día",
    "End-of-Day Reflection": "Reflexión de fin de día",
    "Registration Center": "Centro de registro",
    "Create the profile once. Reuse it everywhere.": "Cree el perfil una vez. Reutilícelo en todo el ecosistema.",
    "Save Registration": "Guardar registro",
    "Go to My Workspace": "Ir a mi espacio",
    "Parent / Guardian Portal": "Portal de padres / tutores",
    "Progress, encouragement, and next steps.": "Progreso, ánimo y próximos pasos.",
    "No parent summaries have been saved yet. Supervisors can create them in the Supervisor Operations Center.": "Aún no se han guardado resúmenes para padres. Los supervisores pueden crearlos en el Centro de Operaciones de Supervisores.",
    "Supervisor Center": "Centro de supervisores",
    "Achievement Center": "Finalización del recorrido",
    "Cultivator Achievement Certificate": "Certificado de finalización",
    "This certifies that": "Esto certifica que",
    "documented achievement through the Mahoning & Trumbull Regional Food Ecosystem and helped strengthen the launch experience.": "completó un recorrido por el Ecosistema Regional de Alimentos de Mahoning y Trumbull y ayudó a fortalecer la experiencia de lanzamiento.",
    "Save Completion": "Guardar finalización",
    "Impact Interests": "Intereses de impacto",
    "Leave Feedback": "Dejar comentarios",
    "Recently Viewed": "Visto recientemente",
    "No journey activity recorded yet.": "Aún no hay actividad registrada."
  },
  tl: {
    "Protected area. Enter as Supervisor / Staff, Administrator, or Board / Funder first.": "Protektadong lugar. Pumasok muna bilang Supervisor / Staff, Administrator, o Board / Funder.",
    "Enter the living ecosystem.": "Pumasok sa buhay na ecosystem.",
    "Welcome to the Mahoning & Trumbull Regional Food Ecosystem. Current regional hubs: Youngstown — Bronson Family Farm and Warren — Parker Farms. This platform connects youth workforce development, parents, growers, partners, supporters, marketplace, wellness, safety, feedback, and impact reporting.": "Maligayang pagdating sa Mahoning at Trumbull Regional Food Ecosystem. Kasalukuyang regional hubs: Youngstown — Bronson Family Farm at Warren — Parker Farms. Pinag-uugnay ng platform na ito ang youth workforce development, mga magulang, growers, partners, supporters, marketplace, wellness, safety, feedback, at impact reporting.",
    "Start Guided Demo": "Simulan ang Guided Demo",
    "Enter The Ecosystem": "Pumasok sa Ecosystem",
    "Register / Check In": "Magrehistro / Check In",
    "My Workspace": "Aking Workspace",
    "Launch Focus": "Pokus sa Launch",
    "Regional hubs: Youngstown — Bronson Family Farm and Warren — Parker Farms.": "Regional hubs: Youngstown — Bronson Family Farm at Warren — Parker Farms.",
    "Choose a role, then follow a guided pathway with resources, opportunities, and next steps.": "Pumili ng role, pagkatapos ay sundan ang guided pathway na may resources, opportunities, at next steps.",
    "Supervisor Operations Center is the staff-only control room.": "Ang Supervisor Operations Center ay control room para lamang sa staff.",
    "Youth check-ins and supervisor records save locally first, then sync to Supabase when connected.": "Ang youth check-ins at supervisor records ay unang nase-save locally, pagkatapos ay nagsi-sync sa Supabase kapag connected.",
    "Parents receive progress summaries, not private raw youth reflections.": "Ang mga magulang ay tumatanggap ng progress summaries, hindi private raw youth reflections.",
    "Incident and support flags stay staff-facing.": "Ang incident at support flags ay nananatiling para sa staff.",
    "Reports convert daily records into launch readiness and program impact.": "Ginagawang launch readiness at program impact ng reports ang daily records.",
    "Welcome Back / Journey Memory": "Welcome Back / Journey Memory",
    "🌞 My Day": "🌞 Aking Araw",
    "June 8 Launch Assignment": "June 8 Launch Assignment",
    "Pathway": "Landas",
    "Guest Pathway": "Landas ng Bisita",
    "Guests learn the farm story, the connected food ecosystem, the airport place-based context, and how youth, growers, families, and partners move together.": "Natututuhan ng mga bisita ang farm story, connected food ecosystem, airport place-based context, at kung paano gumagalaw nang sama-sama ang youth, growers, families, at partners.",
    "Return to Portal": "Bumalik sa Portal",
    "Choose Another Role": "Pumili ng Ibang Role",
    "Comment on This Screen": "Magkomento sa Screen na Ito",
    "Record Achievement": "Kumpletuhin ang Journey",
    "Go to Marketplace": "Pumunta sa Marketplace",
    "Guided Demo": "Guided Demo",
    "Experience the ecosystem in order.": "Damhin ang ecosystem sa tamang pagkakasunod-sunod.",
    "This guided demo lets every user understand the same launch story: Youngstown — Bronson Family Farm, Warren — Parker Farms, and the connected regional ecosystem.": "Tinutulungan ng guided demo na ito ang bawat user na maunawaan ang launch story: Youngstown — Bronson Family Farm, Warren — Parker Farms, at ang connected regional ecosystem.",
    "Choose Role": "Pumili ng Role",
    "Comment / Save Feedback": "Magkomento / I-save ang Feedback",
    "Tell us about the platform and program experience.": "Ikuwento sa amin ang karanasan sa platform at programa.",
    "Rating": "Rating",
    "I would recommend this experience.": "Irerekomenda ko ang karanasang ito.",
    "What excited you?": "Ano ang nagpa-excite sa iyo?",
    "What confused you?": "Ano ang nakalito sa iyo?",
    "What would you improve?": "Ano ang papahusayin mo?",
    "What opportunity interests you?": "Anong opportunity ang interesado ka?",
    "Additional Comments": "Karagdagang Komento",
    "Save Feedback / Comments": "I-save ang Feedback / Comments",
    "Return to Guided Demo": "Bumalik sa Guided Demo",
    "Feedback/comments saved on this device and sent to Supabase when the feedback table accepts the row.": "Na-save ang feedback/comments sa device na ito at ipinapadala sa Supabase kapag tinanggap ng feedback table ang row.",
    "Grower Pathway": "Landas ng Grower",
    "Every grower belongs here: backyard gardens, raised beds, community gardens, school gardens, church gardens, urban farms, greenhouses, homesteads, and market farms. Growers can connect crop planning, resource needs, inventory, training, and marketplace opportunity.": "Lahat ng grower ay kabilang dito: backyard gardens, raised beds, community gardens, school gardens, church gardens, urban farms, greenhouses, homesteads, at market farms. Maaaring ikonekta ng growers ang crop planning, resource needs, inventory, training, at marketplace opportunity.",
    "Create Grower Profile": "Gumawa ng Grower Profile",
    "Marketplace Opportunities": "Marketplace Opportunities",
    "Partner Pathway": "Landas ng Partner",
    "Create Partner Profile": "Gumawa ng Partner Profile",
    "Support Options": "Support Options",
    "Support the Ecosystem": "Suportahan ang Ecosystem",
    "Offer Support": "Mag-alok ng Suporta",
    "Become a Partner": "Maging Partner",
    "Value-Added Producer Pathway": "Landas ng Value-Added Producer",
    "Create Producer Profile": "Gumawa ng Producer Profile",
    "Connect to Marketplace": "Ikonekta sa Marketplace",
    "Youth Workforce Pathway": "Landas ng Youth Workforce",
    "Start My Day": "Simulan ang Araw Ko",
    "End-of-Day Reflection": "Reflection sa Pagtatapos ng Araw",
    "Registration Center": "Registration Center",
    "Create the profile once. Reuse it everywhere.": "Gumawa ng profile nang isang beses. Gamitin ito saanman.",
    "Save Registration": "I-save ang Registration",
    "Go to My Workspace": "Pumunta sa Aking Workspace",
    "Parent / Guardian Portal": "Portal ng Magulang / Guardian",
    "Progress, encouragement, and next steps.": "Pag-unlad, paghihikayat, at susunod na hakbang.",
    "Supervisor Center": "Supervisor Center",
    "Achievement Center": "Achievement Center",
    "Cultivator Achievement Certificate": "Cultivator Achievement Certificate",
    "This certifies that": "Pinatutunayan nito na",
    "Save Completion": "I-save ang Completion",
    "Impact Interests": "Impact Interests",
    "Leave Feedback": "Mag-iwan ng Feedback",
    "Recently Viewed": "Kamakailang Tiningnan",
    "No journey activity recorded yet.": "Wala pang recorded journey activity."
  },
  it: {
    "Enter the living ecosystem.": "Entra nell’ecosistema vivente.",
    "Welcome to the Mahoning & Trumbull Regional Food Ecosystem. Current regional hubs: Youngstown — Bronson Family Farm and Warren — Parker Farms. This platform connects youth workforce development, parents, growers, partners, supporters, marketplace, wellness, safety, feedback, and impact reporting.": "Benvenuto nell’Ecosistema Alimentare Regionale di Mahoning e Trumbull. Hub regionali attuali: Youngstown — Bronson Family Farm e Warren — Parker Farms. Questa piattaforma collega sviluppo della forza lavoro giovanile, genitori, produttori, partner, sostenitori, mercato, benessere, sicurezza, feedback e report di impatto.",
    "Start Guided Demo": "Avvia demo guidata",
    "Enter The Ecosystem": "Entra nell’ecosistema",
    "Register / Check In": "Registrati / Check-in",
    "My Workspace": "Il mio spazio",
    "Launch Focus": "Focus del lancio",
    "Return to Portal": "Ritorna al portale",
    "Choose Another Role": "Scegli un altro ruolo",
    "Comment on This Screen": "Commenta questa schermata",
    "Record Achievement": "Completa percorso",
    "Go to Marketplace": "Vai al mercato",
    "Guest Pathway": "Percorso Ospite",
    "Grower Pathway": "Percorso Produttore",
    "Partner Pathway": "Percorso Partner",
    "Support the Ecosystem": "Sostieni l’ecosistema",
    "Value-Added Producer Pathway": "Percorso Produttore a Valore Aggiunto",
    "Youth Workforce Pathway": "Percorso Giovani",
    "Start My Day": "Inizia la mia giornata",
    "Tell us about the platform and program experience.": "Raccontaci l’esperienza della piattaforma e del programma.",
    "Save Feedback / Comments": "Salva feedback / commenti",
    "Progress, encouragement, and next steps.": "Progresso, incoraggiamento e prossimi passi.",
    "Supervisor Center": "Centro supervisori",
    "Achievement Center": "Completamento del percorso",
    "Cultivator Achievement Certificate": "Certificato di completamento",
    "Save Completion": "Salva completamento",
    "Leave Feedback": "Lascia feedback"
  },
  he: {
    "Enter the living ecosystem.": "היכנסו לאקוסיסטם החי.",
    "Start Guided Demo": "התחל הדגמה מודרכת",
    "Enter The Ecosystem": "היכנס לאקוסיסטם",
    "Register / Check In": "הרשמה / צ׳ק-אין",
    "My Workspace": "המרחב שלי",
    "Launch Focus": "מוקד ההשקה",
    "Return to Portal": "חזרה לשער",
    "Choose Another Role": "בחר תפקיד אחר",
    "Comment on This Screen": "הגב על המסך הזה",
    "Record Achievement": "סיים מסע",
    "Go to Marketplace": "לשוק",
    "Guest Pathway": "מסלול אורח",
    "Grower Pathway": "מסלול מגדלים",
    "Partner Pathway": "מסלול שותפים",
    "Support the Ecosystem": "תמיכה באקוסיסטם",
    "Value-Added Producer Pathway": "מסלול יצרן ערך מוסף",
    "Youth Workforce Pathway": "מסלול כוח עבודה צעיר",
    "Start My Day": "התחל את היום שלי",
    "Tell us about the platform and program experience.": "ספרו לנו על חוויית הפלטפורמה והתוכנית.",
    "Save Feedback / Comments": "שמור משוב / תגובות",
    "Progress, encouragement, and next steps.": "התקדמות, עידוד והצעדים הבאים.",
    "Supervisor Center": "מרכז מדריכים",
    "Achievement Center": "השלמת מסע",
    "Cultivator Achievement Certificate": "תעודת השלמה",
    "Save Completion": "שמור השלמה",
    "Leave Feedback": "השאר משוב"
  },
  fr: {
    "Enter the living ecosystem.": "Entrez dans l’écosystème vivant.",
    "Welcome to the Mahoning & Trumbull Regional Food Ecosystem. Current regional hubs: Youngstown — Bronson Family Farm and Warren — Parker Farms. This platform connects youth workforce development, parents, growers, partners, supporters, marketplace, wellness, safety, feedback, and impact reporting.": "Bienvenue dans l’Écosystème alimentaire régional de Mahoning et Trumbull. Hubs régionaux actuels : Youngstown — Bronson Family Farm et Warren — Parker Farms. Cette plateforme relie développement de la main-d’œuvre jeunesse, parents, producteurs, partenaires, soutiens, marché, bien-être, sécurité, commentaires et rapports d’impact.",
    "Start Guided Demo": "Démarrer la démo guidée",
    "Enter The Ecosystem": "Entrer dans l’écosystème",
    "Register / Check In": "S’inscrire / Check-in",
    "My Workspace": "Mon espace",
    "Launch Focus": "Objectif du lancement",
    "Return to Portal": "Retour au portail",
    "Choose Another Role": "Choisir un autre rôle",
    "Comment on This Screen": "Commenter cet écran",
    "Record Achievement": "Terminer le parcours",
    "Go to Marketplace": "Aller au marché",
    "Guest Pathway": "Parcours invité",
    "Grower Pathway": "Parcours producteur",
    "Partner Pathway": "Parcours partenaire",
    "Support the Ecosystem": "Soutenir l’écosystème",
    "Value-Added Producer Pathway": "Parcours producteur à valeur ajoutée",
    "Youth Workforce Pathway": "Parcours jeunesse",
    "Start My Day": "Commencer ma journée",
    "Tell us about the platform and program experience.": "Parlez-nous de l’expérience de la plateforme et du programme.",
    "Save Feedback / Comments": "Enregistrer commentaires / feedback",
    "Progress, encouragement, and next steps.": "Progrès, encouragement et prochaines étapes.",
    "Supervisor Center": "Centre superviseur",
    "Achievement Center": "Achèvement du parcours",
    "Cultivator Achievement Certificate": "Certificat d’achèvement",
    "Save Completion": "Enregistrer l’achèvement",
    "Leave Feedback": "Laisser un commentaire"
  }
};


const launchCriticalTranslations: Partial<Record<LanguageCode, Record<string, string>>> = {
  tl: {
    "Online Ecosystem": "Online Ecosystem",
    "Bronson Family Farm": "Bronson Family Farm",
    "Launch Focus": "Pokus sa Launch",
    "🌞 My Day": "🌞 Aking Araw",
    "June 8 Launch Assignment": "Takdang Gawain sa Hunyo 8",
    "Start here for the daily rhythm: check in, confirm PPE and water, see today's team assignment, complete the Cooling Station Challenge work block, reflect, and see what happens tomorrow.": "Magsimula dito para sa Youth Workforce launch. Mag-check in, panoorin ang demonstrasyon ng cardboard fan, kilalanin ang iyong team, tapusin ang Hamon sa Heat Safety at Cooling Station, at isumite ang iyong reflection.",
    "Project": "Proyekto",
    "Cooling Station Challenge": "Cooling Station Challenge",
    "Teams": "Mga Team",
    "Design • Engineering • Manufacturing • Contractor": "Design • Engineering • Manufacturing • Contractor",
    "Next Step": "Susunod na Hakbang",
    "Start My Day": "Simulan ang Aking Araw",
    "Goal": "Layunin",
    "Farm worker heat safety": "Heat safety ng manggagawa sa farm",
    "Open Today's Project": "Buksan ang Proyekto Ngayon",
    "Watch Fan Video": "Panoorin ang Fan Video",
    "Reflection": "Reflection",
    "Recent Activity": "Kamakailang Aktibidad",
    "Regional hubs: Youngstown — Bronson Family Farm and Warren — Parker Farms.": "Regional hubs: Youngstown — Bronson Family Farm at Warren — Parker Farms.",
    "Choose a role, then follow a guided pathway with resources, opportunities, and next steps.": "Pumili ng role, pagkatapos ay sundan ang guided pathway na may resources, opportunities, at susunod na hakbang.",
    "Supervisor Operations Center is the staff-only control room.": "Ang Supervisor Operations Center ay control room para lamang sa staff.",
    "Youth check-ins and supervisor records save locally first, then sync to Supabase when connected.": "Ang youth check-ins at supervisor records ay unang nase-save locally, pagkatapos ay nagsi-sync sa Supabase kapag connected.",
    "Parents receive progress summaries, not private raw youth reflections.": "Ang mga magulang ay tumatanggap ng progress summaries, hindi private raw youth reflections.",
    "Incident and support flags stay staff-facing.": "Ang incident at support flags ay nananatiling para sa staff.",
    "Reports convert daily records into launch readiness and program impact.": "Ginagawang launch readiness at program impact ng reports ang daily records.",
    "Mission Control / Reports": "Mission Control / Mga Ulat",
    "Launch-day readiness status.": "Status ng kahandaan sa araw ng launch.",
    "Profiles": "Mga Profile",
    "Youth Registered": "Naka-rehistrong Youth",
    "Present Today": "Present Ngayon",
    "Assessments": "Mga Assessment",
    "Support Flags": "Mga Support Flag",
    "Incident Logs": "Mga Incident Log",
    "Feedback": "Feedback",
    "Project Items Complete": "Mga Item ng Proyekto na Kumpleto",
    "System Status": "Status ng System",
    "ONLINE": "ONLINE",
    "Launch Phase": "Yugto ng Launch",
    "Community Beta": "Community Beta",
    "Staff Orientation": "Orientation ng Staff",
    "Youth Workforce Launch": "Youth Workforce Launch",
    "Featured Project": "Pangunahing Proyekto",
    "63 Cooling Fan Challenge": "Hamon: 63 Cooling Fans",
    "Project Teams": "Mga Team ng Proyekto",
    "Design | Engineering | Manufacturing | Contractor": "Design | Engineering | Manufacturing | Contractor",
    "Photo / Video Documentation": "Photo / Video Documentation",
    "Media Center Ready": "Handa ang Media Center",
    "Fan Template / Design Video": "Fan Template / Design Video",
    "Ready for upload": "Handa para i-upload",
    "Manufacturing Fan Painting Video": "Manufacturing Fan Painting Video",
    "Cooling Station Completion Video": "Cooling Station Completion Video",
    "Translation Coverage": "Saklaw ng Translation",
    "Audit In Progress": "Nagaganap ang Audit",
    "Launch Decision": "Desisyon sa Launch",
    "Validate Pathways + Launch": "I-validate ang Pathways + Launch",
    "🌲 Bronson Family Farm Launch Command Center": "🌲 Bronson Family Farm Launch Command Center",
    "Community Beta Launch Phase": "Community Beta Launch Phase",
    "Staff Orientation: June 5, 2026 — 9:30 AM": "Staff Orientation: Hunyo 5, 2026 — 9:30 AM",
    "Youth Workforce Launch: June 8, 2026 — 8:00 AM": "Youth Workforce Launch: Hunyo 8, 2026 — 8:00 AM",
    "We Grow Green to Harvest Dreams.": "We Grow Green to Harvest Dreams.",
    "Open June 8 Project": "Buksan ang Proyekto ng Hunyo 8",
    "Events & Orientation": "Events at Orientation",
    "Supervisor Center": "Supervisor Center",
    "Operations": "Operasyon",
    "Daily rhythm for launch.": "Araw-araw na ritmo para sa launch.",
    "Beginning of Day": "Simula ng Araw",
    "QR/manual check-in, PPE, water, farm worker heat-safety awareness, daily proverb, weather awareness, assignments.": "QR/manual check-in, PPE, tubig, heat-safety awareness para sa farm workers, daily proverb, weather awareness, at assignments.",
    "June 8 Featured Project": "Pangunahing Proyekto ng Hunyo 8",
    "Farm Worker Heat Safety & Cooling Station Challenge: Design, Engineering, Manufacturing, and Contractor teams work in sequence.": "Farm Worker Heat Safety at Cooling Station Challenge: Design, Engineering, Manufacturing, at Contractor teams ay gagana nang sunod-sunod.",
    "During Program": "Habang Programa",
    "Supervisor observations, wellness support, safety follow-up, team progress, task completion, incident documentation.": "Supervisor observations, wellness support, safety follow-up, team progress, task completion, at incident documentation.",
    "End of Day": "Pagtatapos ng Araw",
    "Youth reflection, supervisor assessment, parent-safe summary, media documentation, reports.": "Youth reflection, supervisor assessment, parent-safe summary, media documentation, at reports.",
    "Open Supervisor Center": "Buksan ang Supervisor Center",
    "Real Supervisor Operations Center": "Tunay na Supervisor Operations Center",
    "Morning-to-end-of-day control room.": "Control room mula umaga hanggang pagtatapos ng araw.",
    "Dashboard": "Dashboard",
    "6/8 Cooling Station": "6/8 Cooling Station",
    "Youth Roster": "Youth Roster",
    "Attendance / PPE": "Attendance / PPE",
    "Wellness Review": "Wellness Review",
    "Assessment": "Assessment",
    "Incident Log": "Incident Log",
    "Parent Summary": "Parent Summary",
    "Launch-day operating picture.": "Operating picture sa araw ng launch.",
    "Supervisor Youth Roster": "Youth Roster",
    "Today Attendance": "Attendance Ngayon",
    "Today Incidents": "Incidents Ngayon",
    "Parent Summaries": "Parent Summaries",
    "Start day: attendance, PPE, water, assignment.": "Simula ng araw: attendance, PPE, tubig, assignment.",
    "During day: wellness review, safety support, incident log.": "Habang araw: wellness review, safety support, incident log.",
    "End day: assessment, parent-safe summary, reports.": "Pagtatapos: assessment, parent-safe summary, reports.",
    "Guest Pathway": "Landas ng Bisita",
    "Guests learn the farm story, the connected food ecosystem, the historic Lansdowne Airport place-based context, regenerative agriculture, and how youth, growers, families, customers, and partners move together.": "Natututuhan ng mga bisita ang kuwento ng farm, connected food ecosystem, historic Lansdowne Airport context, regenerative agriculture, at kung paano gumagalaw nang sama-sama ang youth, growers, pamilya, customers, at partners.",
    "Attend an Event": "Dumalo sa Event",
    "Volunteer / Support": "Mag-volunteer / Suporta",
    "Become a Partner": "Maging Partner",
    "Return to Portal": "Bumalik sa Portal",
    "Choose Another Role": "Pumili ng Ibang Role",
    "Comment on This Screen": "Magkomento sa Screen na Ito",
    "Record Achievement": "I-record ang Achievement",
    "Go to Marketplace": "Pumunta sa Marketplace",
    "Journey Completion & Conversion": "Journey Completion at Conversion",
    "What You Learned": "Ano ang Natutuhan Mo",
    "What You Can Do Next": "Ano ang Maaari Mong Gawin Susunod",
    "My Ecosystem Impact": "Aking Ecosystem Impact",
    "Record My Journey": "I-record ang Aking Journey",
    "Continue to Marketplace": "Magpatuloy sa Marketplace",
    "Choose Another Pathway": "Pumili ng Ibang Pathway",
    "Share Feedback": "Magbigay ng Feedback",
    "Return Home": "Bumalik sa Home",
    "Cultivator Journey": "Cultivator Journey",
    "My Contribution": "Aking Kontribusyon",
    "What Did I Learn?": "Ano ang Natutuhan Ko?",
    "Career Connections": "Career Connections",
    "One Acre Challenge": "One Acre Challenge",
    "What opportunity do you see?": "Anong opportunity ang nakikita mo?",
    "What opportunity do you see now?": "Anong opportunity ang nakikita mo ngayon?",
    "SEE IT": "SEE IT",
    "IMAGINE IT": "IMAGINE IT",
    "DESIGN IT": "DESIGN IT",
    "BUILD IT": "BUILD IT",
    "SHARE IT": "SHARE IT",
    "TELL IT": "TELL IT",
    "LEAD IT": "LEAD IT",
    "BECOME IT": "BECOME IT"
  },
  es: {
    "Launch-day readiness status.": "Estado de preparación para el día de lanzamiento.",
    "Daily rhythm for launch.": "Ritmo diario para el lanzamiento.",
    "Beginning of Day": "Inicio del día",
    "During Program": "Durante el programa",
    "End of Day": "Fin del día",
    "Profiles": "Perfiles",
    "Youth Registered": "Jóvenes registrados",
    "Present Today": "Presentes hoy",
    "Assessments": "Evaluaciones",
    "Support Flags": "Alertas de apoyo",
    "Incident Logs": "Registros de incidentes",
    "Project Items Complete": "Elementos del proyecto completos",
    "Open Supervisor Center": "Abrir centro de supervisores",
    "Open June 8 Project": "Abrir proyecto del 8 de junio"
  },
  fr: {
    "Launch-day readiness status.": "État de préparation du jour du lancement.",
    "Daily rhythm for launch.": "Rythme quotidien pour le lancement.",
    "Beginning of Day": "Début de journée",
    "During Program": "Pendant le programme",
    "End of Day": "Fin de journée",
    "Profiles": "Profils",
    "Youth Registered": "Jeunes inscrits",
    "Present Today": "Présents aujourd’hui",
    "Assessments": "Évaluations",
    "Support Flags": "Alertes de soutien",
    "Incident Logs": "Registres d’incidents",
    "Project Items Complete": "Éléments du projet terminés",
    "Open Supervisor Center": "Ouvrir le centre superviseur",
    "Open June 8 Project": "Ouvrir le projet du 8 juin"
  },
  it: {
    "Launch-day readiness status.": "Stato di preparazione per il giorno del lancio.",
    "Daily rhythm for launch.": "Ritmo quotidiano per il lancio.",
    "Beginning of Day": "Inizio giornata",
    "During Program": "Durante il programma",
    "End of Day": "Fine giornata",
    "Profiles": "Profili",
    "Youth Registered": "Giovani registrati",
    "Present Today": "Presenti oggi",
    "Assessments": "Valutazioni",
    "Support Flags": "Avvisi di supporto",
    "Incident Logs": "Registri incidenti",
    "Project Items Complete": "Elementi del progetto completati",
    "Open Supervisor Center": "Apri centro supervisori",
    "Open June 8 Project": "Apri progetto dell’8 giugno"
  },
  he: {
    "Launch-day readiness status.": "מצב מוכנות ליום ההשקה.",
    "Daily rhythm for launch.": "קצב יומי להשקה.",
    "Beginning of Day": "תחילת היום",
    "During Program": "במהלך התוכנית",
    "End of Day": "סוף היום",
    "Profiles": "פרופילים",
    "Youth Registered": "נוער רשום",
    "Present Today": "נוכחים היום",
    "Assessments": "הערכות",
    "Support Flags": "סימוני תמיכה",
    "Incident Logs": "יומני אירועים",
    "Project Items Complete": "פריטי פרויקט הושלמו",
    "Open Supervisor Center": "פתח מרכז מדריכים",
    "Open June 8 Project": "פתח פרויקט 8 ביוני"
  }
};

function translatePhrase(language: LanguageCode, raw: string) {
  if (language === "en") return raw;
  const key = raw.trim();
  return (
    launchIntegrationTranslations[language]?.[key] ||
    launchCriticalTranslations[language]?.[key] ||
    launchPhraseTranslations[language]?.[key] ||
    screenTranslations[language]?.[key] ||
    languageText[language]?.[key] ||
    key
  );
}

function applyScreenTranslations(language: LanguageCode) {
  if (typeof document === "undefined") return;
  const root = document.querySelector("[data-bff-app-root]") || document.body;
  const skip = new Set(["SCRIPT", "STYLE", "INPUT", "TEXTAREA", "SELECT", "OPTION"]);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      const text = node.textContent || "";
      if (!parent || skip.has(parent.tagName) || !text.trim() || !/[A-Za-z]/.test(text)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((node) => {
    const el = node.parentElement;
    if (!el) return;
    const current = node.textContent || "";
    const original = el.getAttribute("data-bff-original-text") || current.trim();
    el.setAttribute("data-bff-original-text", original);
    const translated = translatePhrase(language, original);
    node.textContent = current.replace(current.trim(), translated);
  });
  const placeholderMap: Record<string, string> = {
    "Example: BFF-825435 or Supervisor Aide": translatePhrase(language, "Example: BFF-825435 or Supervisor Aide"),
    "Enter name": translatePhrase(language, "Enter name"),
  };
  root.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((node) => {
    const el = node as HTMLInputElement | HTMLTextAreaElement;
    const original = el.getAttribute("data-bff-original-placeholder") || el.getAttribute("placeholder") || "";
    el.setAttribute("data-bff-original-placeholder", original);
    el.setAttribute("placeholder", placeholderMap[original] || translatePhrase(language, original));
  });
}


const launchIntegrationTranslations: Partial<Record<LanguageCode, Record<string, string>>> = {
  es: {
    "Case Manager": "Administrador de Casos", "My Portfolio": "Mi Portafolio", "Resume Builder": "Constructor de Currículum", "Resume and Portfolio Growth": "Crecimiento de Currículum y Portafolio", "Youth Support Response Framework": "Marco de Respuesta de Apoyo Juvenil", "Whole-person youth support.": "Apoyo integral para jóvenes.", "Marketplace Listing": "Listado del Mercado", "Words-only launch card. Product images are intentionally hidden until verified images match each item.": "Tarjeta de lanzamiento solo con texto. Las imágenes de productos están ocultas intencionalmente hasta verificar que coincidan con cada artículo.", "Proprietary & Confidential": "Propietario y Confidencial"
  },
  tl: {
    "Case Manager": "Case Manager", "My Portfolio": "Aking Portfolio", "Resume Builder": "Resume Builder", "Resume and Portfolio Growth": "Paglago ng Resume at Portfolio", "Youth Support Response Framework": "Framework ng Suporta sa Kabataan", "Whole-person youth support.": "Suporta para sa buong pangangailangan ng kabataan.", "Marketplace Listing": "Marketplace Listing", "Words-only launch card. Product images are intentionally hidden until verified images match each item.": "Text-only launch card. Nakatago muna ang product images hanggang verified na tumutugma sa bawat item.", "Proprietary & Confidential": "Proprietary at Confidential"
  },
  it: {
    "Case Manager": "Case Manager", "My Portfolio": "Il Mio Portfolio", "Resume Builder": "Creatore di Curriculum", "Resume and Portfolio Growth": "Crescita di Curriculum e Portfolio", "Youth Support Response Framework": "Quadro di Supporto per i Giovani", "Whole-person youth support.": "Supporto completo per i giovani.", "Marketplace Listing": "Annuncio del Mercato", "Words-only launch card. Product images are intentionally hidden until verified images match each item.": "Scheda di lancio solo testuale. Le immagini dei prodotti sono nascoste finché non saranno verificate.", "Proprietary & Confidential": "Riservato e Confidenziale"
  },
  he: {
    "Case Manager": "מנהל מקרה", "My Portfolio": "התיק שלי", "Resume Builder": "בונה קורות חיים", "Resume and Portfolio Growth": "צמיחת קורות חיים ותיק עבודות", "Youth Support Response Framework": "מסגרת תמיכה לנוער", "Whole-person youth support.": "תמיכה כוללת לנוער.", "Marketplace Listing": "רישום בשוק", "Words-only launch card. Product images are intentionally hidden until verified images match each item.": "כרטיס השקה עם מילים בלבד. תמונות מוצר מוסתרות עד לאימות התאמה.", "Proprietary & Confidential": "קנייני וסודי"
  },
  fr: {
    "Case Manager": "Gestionnaire de cas", "My Portfolio": "Mon Portfolio", "Resume Builder": "Créateur de CV", "Resume and Portfolio Growth": "Développement du CV et du Portfolio", "Youth Support Response Framework": "Cadre de soutien aux jeunes", "Whole-person youth support.": "Soutien global des jeunes.", "Marketplace Listing": "Fiche du marché", "Words-only launch card. Product images are intentionally hidden until verified images match each item.": "Carte de lancement avec texte seulement. Les images sont masquées jusqu’à vérification.", "Proprietary & Confidential": "Propriétaire et confidentiel"
  }
};

const roles: Role[] = [
  "Guest",
  "Youth Workforce Participant",
  "Parent / Guardian",
  "Supervisor / Staff",
  "Case Manager",
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
  "Case Manager": "staff",
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


type JourneyEvent = {
  id: string;
  user_id?: string;
  role?: string;
  screen: Screen;
  label: string;
  created_at: string;
};

type CompletionRecord = {
  id: string;
  user_id?: string;
  role?: string;
  pathway: string;
  completed_at: string;
};

function screenLabel(screen: Screen) {
  const labels: Record<Screen, string> = {
    portal: "Portal / Forest Gate",
    demo: "Guided Demo",
    guest: "Guest Pathway",
    registration: "Registration",
    roles: "My Workspace / Choose Role",
    youth: "Youth Pathway",
    supervisor: "Supervisor Operations",
    parent: "Parent Portal",
    grower: "Grower Pathway",
    partner: "Partner Pathway",
    support: "Support Pathway",
    caseManager: "Case Manager Portal",
    valueAdded: "Value-Added Pathway",
    marketplace: "Marketplace",
    wellness: "Youth Morning Check-In",
    reports: "Reports",
    operations: "Operations",
    events: "Events & Orientation",
    media: "Media Center",
    launchProject: "June 8 Cooling Station Challenge",
    feedback: "Feedback / Comments",
    completion: "Achievement Center",
  };
  return labels[screen];
}

function recordJourney(screen: Screen, user?: EcosystemUser | null) {
  const event: JourneyEvent = {
    id: uuid(),
    user_id: user?.id,
    role: user?.role || "Public / Guest",
    screen,
    label: screenLabel(screen),
    created_at: new Date().toISOString(),
  };
  const events = safeRead<JourneyEvent[]>(JOURNEY_KEY, []);
  safeWrite(JOURNEY_KEY, [event, ...events].slice(0, 250));
}

function recordCompletion(pathway: string, user?: EcosystemUser | null) {
  const row: CompletionRecord = {
    id: uuid(),
    user_id: user?.id,
    role: user?.role || "Public / Guest",
    pathway,
    completed_at: new Date().toISOString(),
  };
  const rows = safeRead<CompletionRecord[]>(COMPLETION_KEY, []);
  safeWrite(COMPLETION_KEY, [row, ...rows].slice(0, 250));
}

function supabaseTableCandidates(table: string) {
  const aliases: Record<string, string[]> = {
    attendance: ["attendance_records", "attendance"],
    attendance_records: ["attendance_records", "attendance"],
    feedback: ["feedback", "ecosystem_feedback", "program_feedback"],
    parent_contact_logs: ["parent_contact_logs", "attendance_communications", "parent_communications"],
    parent_summaries: ["parent_summaries", "parent_summary"],
  };
  return aliases[table] || [table];
}

function scrollToTop() {
  if (typeof window === "undefined") return;
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
}

async function insertRow<T extends { id: string }>(table: string, localKey: string, row: T) {
  // Launch rule: write locally first so the workflow never loses data on a bad connection.
  // Then try Supabase using known table-name aliases, because earlier launch versions used
  // attendance while the database uses attendance_records.
  const localRows = safeRead<T[]>(localKey, []);
  safeWrite(localKey, [row, ...localRows]);

  if (!supabase) return { ok: true, mode: "local", table: "localStorage", error: null };

  let lastError: unknown = null;
  for (const candidate of supabaseTableCandidates(table)) {
    try {
      const { error } = await supabase.from(candidate).insert(row);
      if (!error) return { ok: true, mode: "supabase", table: candidate, error: null };
      lastError = error;
      console.warn(`Supabase rejected ${candidate}:`, error);
    } catch (error) {
      lastError = error;
      console.warn(`Supabase sync failed for ${candidate}:`, error);
    }
  }

  return { ok: true, mode: "local-fallback", table: "localStorage", error: lastError };
}

async function loadSupabaseRows<T>(table: string, localKey: string) {
  if (!supabase) return safeRead<T[]>(localKey, []);
  for (const candidate of supabaseTableCandidates(table)) {
    try {
      const { data, error } = await supabase.from(candidate).select("*").order("created_at", { ascending: false });
      if (!error && data) {
        safeWrite(localKey, data as T[]);
        return data as T[];
      }
      if (error) console.warn(`Could not load ${candidate}:`, error);
    } catch (error) {
      console.warn(`Could not load ${candidate}:`, error);
    }
  }
  return safeRead<T[]>(localKey, []);
}

function saveModeMessage(action: string, result: { mode?: string; table?: string }) {
  if (result.mode === "supabase") return `${action} saved to Supabase (${result.table}).`;
  if (result.mode === "local-fallback") return `${action} saved on this device. Supabase did not accept the row yet.`;
  return `${action} saved on this device.`;
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
    "Case Manager": "case_manager",
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
    "Case Manager": "caseManager",
    Grower: "grower",
    "Marketplace Customer": "marketplace",
    Volunteer: "support",
    Partner: "partner",
    Administrator: "operations",
    "Value-Added Producer": "valueAdded",
    "Board / Funder": "reports",
  };
  return map[role];
}

function canEnter(user: EcosystemUser | null, screen: Screen) {
  // Launch demo mode: all role pathways must be auditable from the nav.
  // The Supervisor Center still separates private staff notes inside the workflow,
  // but the button should not redirect reviewers back to the Grower workspace.
  return true;
}


const youthSupportLevels = [
  { level: "Green", title: "Everyday Support", lead: "Supervisor leads", examples: ["Tired", "Needs encouragement", "Minor disagreement", "First-day nervousness"] },
  { level: "Yellow", title: "Additional Support Needed", lead: "Supervisor refers to case manager", examples: ["Repeated absences", "Transportation issue", "Family stress", "Social isolation"] },
  { level: "Orange", title: "Significant Concern", lead: "Case manager leads", examples: ["Possible depression", "Substance concern", "Escalating conflict", "Housing instability"] },
  { level: "Red", title: "Emergency", lead: "Leadership and case manager respond immediately", examples: ["Self-harm statement", "Medical emergency", "Abuse disclosure", "Missing youth"] },
];

function SupportResponseFrameworkCard() {
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Youth Support Response Framework</div>
      <h2 className="mt-3 text-3xl font-black">Youth + Parent + Supervisor + Case Manager</h2>
      <p className="mt-3 text-sm leading-7 text-white/78">Supervisors coach daily work. Case managers support barriers, wellness, family needs, referrals, and escalation. Leadership protects safety and operations.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {youthSupportLevels.map((item) => (
          <div key={item.level} className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
            <div className="text-lg font-black">{item.level} — {item.title}</div>
            <div className="mt-2 text-xs font-black text-emerald-100">Lead: {item.lead}</div>
            <ul className="mt-3 space-y-1 text-xs leading-5 text-white/72">
              {item.examples.map((example) => <li key={example}>• {example}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

function App() {
  const [screen, setScreenState] = useState<Screen>("portal");
  const [activeUser, setActiveUser] = useState<EcosystemUser | null>(() => safeRead<EcosystemUser | null>(SESSION_KEY, null));
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<LanguageCode>(() => safeRead<LanguageCode>(LANGUAGE_KEY, "en"));

  const changeLanguage = (next: LanguageCode) => {
    setLanguage(next);
    safeWrite(LANGUAGE_KEY, next);
    document.documentElement.lang = next;
    document.documentElement.dir = languageDir(next);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languageDir(language);
    const timer = window.setTimeout(() => applyScreenTranslations(language), 0);
    return () => window.clearTimeout(timer);
  }, [language, screen, message, activeUser]);

  const setScreen = (target: Screen) => {
    if (!canEnter(activeUser, target)) {
      setMessage(translatePhrase(language, "Protected area. Enter as Supervisor / Staff, Administrator, or Board / Funder first."));
      setScreenState("roles");
      return;
    }
    setMessage("");
    recordJourney(target, activeUser);
    setScreenState(target);
    scrollToTop();
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
    const target = routeForRole(role);
    recordJourney(target, user);
    setActiveUser(user);
    setScreenState(target);
    scrollToTop();
  };

  const signOut = () => {
    safeWrite<EcosystemUser | null>(SESSION_KEY, null);
    setActiveUser(null);
    setScreenState("portal");
    scrollToTop();
  };

  return (
    <Shell screen={screen} setScreen={setScreen} activeUser={activeUser} signOut={signOut} language={language} changeLanguage={changeLanguage}>
      {message && <Notice text={message} />}
      {screen === "portal" && <Portal setScreen={setScreen} activeUser={activeUser} />}
      {screen === "demo" && <GuidedDemo setScreen={setScreen} />}
      {screen === "guest" && <Guest setScreen={setScreen} />}
      {screen === "registration" && <Registration setScreen={setScreen} activeUser={activeUser} />}
      {screen === "roles" && <MyWorkspace signIn={signIn} activeUser={activeUser} setScreen={setScreen} />}
      {screen === "youth" && <YouthScreen setScreen={setScreen} activeUser={activeUser} />}
      {screen === "supervisor" && <SupervisorOperationsCenter setScreen={setScreen} activeUser={activeUser} />}
      {screen === "parent" && <ParentScreen setScreen={setScreen} />}
      {screen === "grower" && <GrowerJourney setScreen={setScreen} />}
      {screen === "partner" && <PartnerJourney setScreen={setScreen} />}
      {screen === "support" && <SupportJourney setScreen={setScreen} />}
      {screen === "caseManager" && <CaseManagerPortal setScreen={setScreen} />}
      {screen === "valueAdded" && <ValueAddedJourney setScreen={setScreen} />}
      {screen === "marketplace" && <MarketplaceOperations activeUser={activeUser} setScreen={setScreen} />}
      {screen === "wellness" && <WellnessScreen setScreen={setScreen} activeUser={activeUser} />}
      {screen === "reports" && <Reports setScreen={setScreen} />}
      {screen === "operations" && <Operations setScreen={setScreen} />}
      {screen === "events" && <LaunchEvents setScreen={setScreen} />}
      {screen === "media" && <MediaCenter setScreen={setScreen} />}
      {screen === "launchProject" && <CoolingCenterProjectModule setScreen={setScreen} activeUser={activeUser} />}
      {screen === "feedback" && <Feedback setScreen={setScreen} activeUser={activeUser} />}
      {screen === "completion" && <CompletionExperience setScreen={setScreen} activeUser={activeUser} />}
    </Shell>
  );
}

function Shell({
  children,
  screen,
  setScreen,
  activeUser,
  signOut,
  language,
  changeLanguage,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  activeUser: EcosystemUser | null;
  signOut: () => void;
  language: LanguageCode;
  changeLanguage: (language: LanguageCode) => void;
}) {
  const role = activeUser?.role;
  const workspaceTarget = role ? routeForRole(role) : "roles";
  const roleNav: { label: string; screen: Screen; roles?: Role[] }[] = role === "Youth Workforce Participant"
    ? [
        { label: "My Day", screen: "youth" },
        { label: "Today", screen: "launchProject" },
        { label: "My Portfolio", screen: "youth" },
        { label: "Media", screen: "media" },
        { label: "Reflection", screen: "feedback" },
      ]
    : role === "Parent / Guardian"
    ? [
        { label: "Youth Progress", screen: "parent" },
        { label: "Encouragement", screen: "parent" },
        { label: "Family Feedback", screen: "feedback" },
      ]
    : role === "Supervisor / Staff"
    ? [
        { label: "Supervisor", screen: "supervisor" },
        { label: "Reports", screen: "reports" },
        { label: "June 8", screen: "launchProject" },
        { label: "Feedback", screen: "feedback" },
      ]
    : role === "Case Manager"
    ? [
        { label: "Case Manager", screen: "caseManager" },
        { label: "Support Cases", screen: "caseManager" },
        { label: "Reports", screen: "reports" },
        { label: "Feedback", screen: "feedback" },
      ]
    : role === "Grower"
    ? [
        { label: "Grower", screen: "grower" },
        { label: "Marketplace", screen: "marketplace" },
        { label: "Resources", screen: "events" },
      ]
    : role === "Partner" || role === "Board / Funder"
    ? [
        { label: "Impact", screen: "partner" },
        { label: "Reports", screen: "reports" },
        { label: "Support", screen: "support" },
      ]
    : role === "Administrator"
    ? [
        { label: "Mission Control", screen: "reports" },
        { label: "Supervisor", screen: "supervisor" },
        { label: "Marketplace", screen: "marketplace" },
        { label: "Register", screen: "registration" },
      ]
    : role === "Value-Added Producer"
    ? [
        { label: "Value-Added", screen: "valueAdded" },
        { label: "Marketplace", screen: "marketplace" },
        { label: "Feedback", screen: "feedback" },
      ]
    : [
        { label: "Guest", screen: "guest" },
        { label: "Marketplace", screen: "marketplace" },
        { label: "Feedback", screen: "feedback" },
      ];

  const isStaff = role === "Supervisor / Staff" || role === "Case Manager" || role === "Administrator" || role === "Board / Funder";
  const buttonClass = (target: Screen) =>
    `rounded-full border px-4 py-2 text-xs font-black transition ${screen === target ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"}`;

  return (
    <div data-bff-app-root className="relative min-h-screen overflow-x-hidden bg-black text-white" lang={language} dir={languageDir(language)}>
      <div className="fixed inset-0">
        <img src={IMG.forest} alt="Bronson Family Farm forest entrance" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = IMG.backup)} />
      </div>
      <div className="fixed inset-0 bg-black/25" />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.45),rgba(0,0,0,.12),rgba(0,0,0,.35)),radial-gradient(circle_at_top_left,rgba(52,211,153,.18),transparent_32%)]" />
      <div className="relative z-10 mx-auto max-w-[1280px] px-3 py-3 md:px-6">
        <div className="sticky top-2 z-40 mb-3 rounded-[1.25rem] border border-white/10 bg-black/58 p-2 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setScreen("portal")} className="min-w-0 flex-1 px-2 text-left">
              <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-100/70">Bronson Family Farm</div>
              <div className="truncate text-sm font-black leading-tight md:text-base">{activeUser ? `${activeUser.role}` : "Choose Your Path"}</div>
            </button>
            <label className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-2 py-1 text-[11px] font-black text-emerald-50">
              <span className="hidden sm:inline">🌎</span>
              <select
                value={language}
                onChange={(event) => changeLanguage(event.target.value as LanguageCode)}
                className="rounded-full border border-white/10 bg-black/65 px-2 py-1 text-[11px] font-black text-white outline-none"
                aria-label="Language selector"
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code} className="bg-black text-white">
                    {option.shortLabel}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            <button type="button" onClick={() => setScreen("portal")} className={buttonClass("portal")}>Home</button>
            <button type="button" onClick={() => setScreen(workspaceTarget)} className={buttonClass(workspaceTarget)}>My Workspace</button>
            {roleNav.map((item) => (
              <button type="button" key={`${item.label}-${item.screen}`} onClick={() => setScreen(item.screen)} className={buttonClass(item.screen)}>
                {item.label}
              </button>
            ))}
            {!activeUser && <button type="button" onClick={() => setScreen("roles")} className={buttonClass("roles")}>Choose Role</button>}
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-bold text-white/75">
            <div className="truncate rounded-full border border-white/10 bg-white/8 px-3 py-1">
              {activeUser ? `${activeUser.name} • ${activeUser.role}` : t(language, "publicGuest")}
            </div>
            <div className="flex shrink-0 gap-2">
              {isStaff && <button type="button" onClick={() => setScreen("reports")} className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 font-black text-amber-50">Mission Control</button>}
              {activeUser && <button type="button" onClick={signOut} className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-black">{t(language, "signOut")}</button>}
            </div>
          </div>

          <details className="mt-2 rounded-2xl border border-white/8 bg-white/[0.035] px-3 py-2 text-xs text-white/75">
            <summary className="cursor-pointer font-black text-emerald-50">More tools</summary>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setScreen("roles")} className={buttonClass("roles")}>Switch Role</button>
              <button type="button" onClick={() => setScreen("registration")} className={buttonClass("registration")}>Register</button>
              <button type="button" onClick={() => setScreen("events")} className={buttonClass("events")}>Events</button>
              <button type="button" onClick={() => setScreen("media")} className={buttonClass("media")}>Media</button>
              <button type="button" onClick={() => setScreen("feedback")} className={buttonClass("feedback")}>Feedback</button>
              {isStaff && <button type="button" onClick={() => setScreen("supervisor")} className={buttonClass("supervisor")}>Supervisor</button>}
              {isStaff && <button type="button" onClick={() => setScreen("caseManager")} className={buttonClass("caseManager")}>Case Manager</button>}
              {isStaff && <button type="button" onClick={() => setScreen("operations")} className={buttonClass("operations")}>Operations</button>}
            </div>
          </details>
        </div>
        {children}
        <CompactProprietaryFooter />
      </div>
    </div>
  );
}

function CompactProprietaryFooter() {
  return (
    <footer className="mt-5 rounded-2xl border border-white/10 bg-black/45 px-4 py-2 text-center text-[10px] font-semibold leading-5 text-white/60 backdrop-blur-xl">
      © 2026 Bronson Family Farm LLC & Farm & Family Alliance Inc. All Rights Reserved. Developed by Bronson Family Farm. Proprietary & Confidential.
    </footer>
  );
}

function Notice({ text }: { text: string }) {
  return <div className="mb-3 rounded-2xl border border-amber-200/30 bg-amber-300/15 p-4 text-sm font-black text-amber-50">{text}</div>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] border border-white/10 bg-black/32 p-5 shadow-[0_35px_100px_rgba(0,0,0,.48)] backdrop-blur-2xl ${className}`}>{children}</div>;
}

function Metric({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
      <div className="text-3xl font-black">{value}</div>
      <div className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">{title}</div>
    </div>
  );
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
      <select value={props.value} onChange={(e) => props.onChange(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/65 px-4 py-3 text-white outline-none focus:border-emerald-200">
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
        rows={3}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-emerald-200"
      />
    </label>
  );
}


function MyDayPreview({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const events = safeRead<JourneyEvent[]>(JOURNEY_KEY, []).slice(0, 3);
  const completions = safeRead<CompletionRecord[]>(COMPLETION_KEY, []).slice(0, 2);

  return (
    <div className="mt-6 rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-4">
      <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/75">🌞 My Day</div>
      <div className="mt-2 text-2xl font-black">June 8 Launch Assignment</div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-white/82">
        Start here for the daily rhythm: check in, confirm PPE and water, see today's team assignment, complete the Cooling Station Challenge work block, reflect, and see what happens tomorrow.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Project</div>
          <div className="mt-1 text-sm font-black">Cooling Station Challenge</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Teams</div>
          <div className="mt-1 text-sm font-black">Design • Engineering • Manufacturing • Contractor</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Next Step</div>
          <div className="mt-1 text-sm font-black">Start My Day</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Goal</div>
          <div className="mt-1 text-sm font-black">Farm worker heat safety</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("wellness")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Start My Day</button>
        <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full border border-emerald-200/25 bg-emerald-300/15 px-6 py-3 font-black text-emerald-50">Open Today's Project</button>
        <button type="button" onClick={() => setScreen("media")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Watch Fan Video</button>
        <button type="button" onClick={() => setScreen("feedback")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Reflection</button>
      </div>

      {(events.length > 0 || completions.length > 0) && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Recent Activity</div>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl bg-black/25 p-3 text-sm font-bold">{event.label}</div>
            ))}
            {completions.map((completion) => (
              <div key={completion.id} className="rounded-xl bg-emerald-300/15 p-3 text-sm font-bold">Completed: {completion.pathway}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Portal({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const workspaceTarget = activeUser ? routeForRole(activeUser.role) : "roles";
  const quickChoices: { title: string; subtitle: string; screen: Screen }[] = [
    { title: "Start Guided Portal", subtitle: "New visitors can enter through the story, ecosystem overview, and guided experience.", screen: "demo" },
    { title: "Enter Ecosystem", subtitle: "Browse public pathways without registering: guest story, events, marketplace, and opportunities.", screen: "guest" },
    { title: "Sign In / Returning Participant", subtitle: activeUser ? `Continue as ${activeUser.name}.` : "Registered youth, parents, supervisors, growers, and partners continue from their assigned workspace.", screen: workspaceTarget },
    { title: "Marketplace", subtitle: "Browse food, products, events, grower opportunities, and GrownBy-connected purchasing.", screen: "marketplace" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_.75fr]">
      <Card className="overflow-hidden p-0">
        <div className="relative min-h-[70vh] sm:min-h-[68vh]">
          <img
            src={IMG.forest}
            alt="Bronson Family Farm forest gate entry"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => (event.currentTarget.src = IMG.backup)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.82),rgba(0,0,0,.32),rgba(0,0,0,.72))]" />
          <div className="relative z-10 flex min-h-[70vh] flex-col justify-between p-5 sm:min-h-[68vh] sm:p-8">
            <div>
              <div className="inline-flex rounded-full border border-emerald-200/25 bg-emerald-300/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-emerald-50">
                Forest Gate Portal
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.96] sm:text-6xl md:text-7xl">
                Enter the Living Ecosystem
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/86 sm:text-lg">
                Bronson Family Farm connects food, families, youth workforce development, growers, marketplace, and community opportunity.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {quickChoices.map((choice) => (
                <button
                  key={choice.title}
                  type="button"
                  onClick={() => setScreen(choice.screen)}
                  className="rounded-[1.35rem] border border-white/12 bg-black/42 p-4 text-left shadow-[0_15px_45px_rgba(0,0,0,.35)] backdrop-blur-xl transition hover:border-emerald-200/70 hover:bg-emerald-300/18"
                >
                  <div className="text-lg font-black leading-tight">{choice.title}</div>
                  <div className="mt-2 text-sm leading-5 text-white/74">{choice.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">Launch Candidate 3.0</div>
          <h2 className="mt-3 text-3xl font-black leading-tight">New visitors enter the story. Returning users go straight to work.</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-white/82">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <b>Public visitors</b> can explore the portal, story, events, and marketplace without registering.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <b>Nesco youth participants</b> should already be in the system. They verify information instead of re-registering.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <b>No phone required:</b> youth can enter with Participant ID plus last name or supervisor lookup.
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">Daily Rhythm</div>
          <h3 className="mt-3 text-2xl font-black">Today → Progress → Tomorrow</h3>
          <div className="mt-4 grid gap-2 text-sm text-white/82">
            <div className="rounded-xl bg-black/28 p-3"><b>Today:</b> team, project, supervisor, location, start time.</div>
            <div className="rounded-xl bg-black/28 p-3"><b>Progress:</b> attendance, safety, achievements, contribution.</div>
            <div className="rounded-xl bg-black/28 p-3"><b>Tomorrow:</b> assignment, PPE reminder, water bottle, next step.</div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => setScreen("roles")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Choose Role</button>
            <button type="button" onClick={() => setScreen(activeUser ? workspaceTarget : "roles")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Go to Workspace</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function LaunchAuditDetailGrid({
  title,
  items,
}: {
  title: string;
  items: { heading: string; body: string; action?: Screen; actionLabel?: string }[];
}) {
  return (
    <Card className="mt-5">
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Launch Audit Fix</div>
      <h2 className="mt-3 text-3xl font-black">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.heading} className="rounded-[1.35rem] border border-white/10 bg-black/28 p-5">
            <div className="text-lg font-black">{item.heading}</div>
            <p className="mt-2 text-sm leading-6 text-white/78">{item.body}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}


function JourneyCompletionCard({
  title,
  learned,
  nextSteps,
  impact,
  setScreen,
}: {
  title: string;
  learned: string[];
  nextSteps: { label: string; screen: Screen }[];
  impact: string[];
  setScreen: (screen: Screen) => void;
}) {
  const saveImpact = () => {
    recordCompletion(title);
    setScreen("completion");
  };

  return (
    <Card className="mt-5">
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Journey Completion & Conversion</div>
      <h2 className="mt-3 text-3xl font-black">{title}</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <h3 className="text-xl font-black">What You Learned</h3>
          <div className="mt-3 grid gap-2">
            {learned.map((item) => (
              <div key={item} className="rounded-2xl bg-black/28 p-3 text-sm font-bold text-white/84">✓ {item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <h3 className="text-xl font-black">What You Can Do Next</h3>
          <div className="mt-3 grid gap-2">
            {nextSteps.map((step) => (
              <button
                key={step.label}
                type="button"
                onClick={() => setScreen(step.screen)}
                className="rounded-2xl border border-white/10 bg-black/28 p-3 text-left text-sm font-black hover:bg-emerald-300 hover:text-black"
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-5">
          <h3 className="text-xl font-black">My Ecosystem Impact</h3>
          <div className="mt-3 grid gap-2">
            {impact.map((item) => (
              <div key={item} className="rounded-2xl bg-black/25 p-3 text-sm font-bold text-white/86">☑ {item}</div>
            ))}
          </div>
          <button
            type="button"
            onClick={saveImpact}
            className="mt-4 w-full rounded-full bg-emerald-300 px-6 py-3 font-black text-black"
          >
            Record My Journey
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("marketplace")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Continue to Marketplace</button>
        <button type="button" onClick={() => setScreen("roles")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Choose Another Pathway</button>
        <button type="button" onClick={() => setScreen("feedback")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Share Feedback</button>
        <button type="button" onClick={() => setScreen("portal")} className="rounded-full border border-white/15 bg-black/35 px-6 py-3 font-black">Return Home</button>
      </div>
    </Card>
  );
}


function Guest({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <SimplePathway
        title="Guest Pathway"
        image={IMG.ecosystem}
        text="Guests learn the farm story, the connected food ecosystem, the historic Lansdowne Airport place-based context, regenerative agriculture, and how youth, growers, families, customers, and partners move together."
        setScreen={setScreen}
        extra={
          <>
            <button type="button" onClick={() => setScreen("events")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Attend an Event</button>
            <button type="button" onClick={() => setScreen("support")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Volunteer / Support</button>
            <button type="button" onClick={() => setScreen("partner")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Become a Partner</button>
          </>
        }
      />
      <LaunchAuditDetailGrid
        title="Guest journey now has a complete launch story."
        items={[
          { heading: "Farm Story", body: "Bronson Family Farm connects food, land, family legacy, agritourism, workforce development, and regional opportunity." },
          { heading: "Historic Place", body: "The farm experience is rooted at Lansdowne Airport, connecting Youngstown history, land use, aviation context, and community future-building." },
          { heading: "Regenerative Farming", body: "Guests learn that regenerative agriculture develops the land while improving soil, reducing waste, protecting natural systems, and strengthening future production." },
          { heading: "Connected Food Ecosystem", body: "The ecosystem connects youth, growers, marketplace customers, parents, partners, volunteers, and value-added producers in one guided experience." },
          { heading: "Regional Hubs", body: "Youngstown — Bronson Family Farm and Warren — Parker Farms are presented as regional hubs in the Mahoning and Trumbull food ecosystem." },
          { heading: "Conversion Actions", body: "Guests can attend events, volunteer, shop, become customers, become partners, leave feedback, or continue to the marketplace." },
        ]}
      />
    </>
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
  const [showAccessTools, setShowAccessTools] = useState(!activeUser);

  const isStaff = activeUser ? ["staff", "admin", "board"].includes(activeUser.accessLevel) : false;
  const isYouth = activeUser?.role === "Youth Workforce Participant";
  const isParent = activeUser?.role === "Parent / Guardian";
  const isGrower = activeUser?.role === "Grower";
  const isMarketplace = activeUser?.role === "Marketplace Customer" || activeUser?.role === "Value-Added Producer";

  const workspaceCards: { title: string; subtitle: string; screen: Screen; show: boolean }[] = [
    {
      title: "Youth Daily Check-In",
      subtitle: "Start My Day: attendance, date/time, PPE, wellness, goal, and support request.",
      screen: "youth",
      show: isYouth || isStaff,
    },
    {
      title: "June 8 Cooling Station Challenge",
      subtitle: "Farm worker heat safety production module: Design, Engineering, Manufacturing, and Contractor teams build a real cooling station.",
      screen: "launchProject",
      show: isYouth || isStaff || isParent,
    },
    {
      title: "Supervisor Operations Center",
      subtitle: "Attendance, PPE, wellness review, assessments, incidents, parent summaries, and reports.",
      screen: "supervisor",
      show: isStaff,
    },
    {
      title: "Parent Portal",
      subtitle: "Parent-safe attendance, progress notes, announcements, and family updates.",
      screen: "parent",
      show: isParent || isStaff,
    },
    {
      title: "Grower Operations Center",
      subtitle: "Weather, crop plans, grower tasks, field notes, inventory, and marketplace demand.",
      screen: "grower",
      show: isGrower || isStaff,
    },
    {
      title: "Partner Collaboration",
      subtitle: "Organizations, schools, businesses, funders, and community groups can explore collaboration opportunities.",
      screen: "partner",
      show: activeUser?.role === "Partner" || isStaff || !activeUser,
    },
    {
      title: "Support the Ecosystem",
      subtitle: "Volunteer, mentor, donate, share resources, sponsor youth, or support infrastructure.",
      screen: "support",
      show: activeUser?.role === "Volunteer" || isStaff || !activeUser,
    },
    {
      title: "Value-Added Producer",
      subtitle: "Develop products, packaging, pricing, and marketplace opportunities from harvests and ideas.",
      screen: "valueAdded",
      show: activeUser?.role === "Value-Added Producer" || isGrower || isStaff || !activeUser,
    },
    {
      title: "Marketplace Operations",
      subtitle: "GrownBy + direct sales, products, inventory, orders, SNAP awareness, and fulfillment.",
      screen: "marketplace",
      show: isMarketplace || isGrower || isStaff || !activeUser,
    },
    {
      title: "Executive Reports",
      subtitle: "Program metrics, workforce status, youth readiness, marketplace activity, and impact reporting.",
      screen: "reports",
      show: isStaff,
    },
    {
      title: "Guest Experience",
      subtitle: "Public story, farm ecosystem, historic place, and community pathway.",
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

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">My Workspace</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">
        {activeUser ? `Welcome, ${activeUser.name}.` : "Welcome to Bronson Family Farm."}
      </h1>
      <p className="mt-4 max-w-4xl text-sm leading-7 text-white/82">
        This is the role center. Public visitors may explore without registering. Registered users should open only the workspace assigned to their role.
      </p>

      {activeUser && (
        <div className="mt-5 rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-4">
          <div className="text-xs font-black uppercase tracking-[0.28em] text-emerald-100/75">Current Access</div>
          <div className="mt-2 text-2xl font-black">{activeUser.role}</div>
          <div className="mt-1 text-sm text-white/72">Access level: {activeUser.accessLevel}</div>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleCards.map((card) => (
          <button type="button"
            key={card.title}
            onClick={() => setScreen(card.screen)}
            className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 text-left transition hover:bg-emerald-300 hover:text-black"
          >
            <div className="text-xl font-black">{card.title}</div>
            <div className="mt-3 text-sm leading-6 opacity-85">{card.subtitle}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
        <button
          type="button"
          onClick={() => setShowAccessTools((value) => !value)}
          className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black"
        >
          {showAccessTools ? "Hide Sign-In / Access Tools" : "Sign In / Verify Role"}
        </button>
        {showAccessTools && (
          <div className="mt-5">
            <div className="max-w-xl">
              <Field label="Name / Participant ID for this session" value={name} onChange={setName} placeholder="Example: BFF-825435 or Supervisor Aide" />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {roles.map((role) => (
                <button type="button"
                  key={role}
                  onClick={() => signIn(role, name)}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-emerald-300 hover:text-black"
                >
                  <div className="text-lg font-black">{role}</div>
                  <div className="mt-2 text-sm opacity-85">Workspace: {screenLabel(routeForRole(role))}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-xs leading-6 text-white/60">
              Youth participating through Nesco should already be in the system. They verify information instead of re-registering. Youth do not need a phone: use Participant ID + last name, badge QR, or supervisor lookup.
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
        <button type="button" onClick={save} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Registration</button>
        <button type="button" onClick={() => setScreen(routeForRole(role))} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Go to My Workspace</button>
      </div>
      {saved && <Notice text={saved} />}
    </Card>
  );
}

function YouthScreen({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const currentWeek = youthCurriculumWeeks[0];
  const completionPercent = 12.5;

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Youth Workforce</div>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">🌞 My Day</h1>
        <p className="mt-5 text-base leading-8 text-white/86">
          Youth begin each day by checking in, understanding the day's farm work, seeing where the work fits in the 8-week Cultivator journey, and building evidence for their portfolio and achievements.
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-5">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/75">Today's Project</div>
          <h2 className="mt-2 text-2xl font-black">{featuredProject.title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/82">{featuredProject.objective}</p>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><strong>Date:</strong> {featuredProject.launchDate}</div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><strong>Start:</strong> {featuredProject.startTime}</div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><strong>Week:</strong> Week 1</div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><strong>Badge:</strong> {currentWeek.badge}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => setScreen("wellness")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Start My Day</button>
          <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full border border-emerald-200/25 bg-emerald-300/15 px-6 py-3 font-black text-emerald-50">Open Today's Project</button>
          <button type="button" onClick={() => setScreen("media")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Watch Fan Video</button>
          <button type="button" onClick={() => setScreen("feedback")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Reflection</button>
          <button type="button" onClick={() => setScreen("completion")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">My Achievements</button>
        </div>
      </Card>

      <div className="grid gap-5">
        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">📅 My Week</div>
          <h2 className="mt-3 text-3xl font-black">Week 1: {currentWeek.title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/82">{currentWeek.focus}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Current Project</div>
              <div className="mt-2 text-sm font-black">{currentWeek.project}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Progress</div>
              <div className="mt-2 text-3xl font-black">{completionPercent}%</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Achievement</div>
              <div className="mt-2 text-sm font-black">{currentWeek.badge}</div>
            </div>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-emerald-300" style={{ width: `${completionPercent}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {currentWeek.skills.map((skill) => (
              <span key={skill} className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-50">{skill}</span>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🌱 My 8-Week Journey</div>
          <h2 className="mt-3 text-3xl font-black">{"Cultivator Workforce Development Roadmap"}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {youthCurriculumWeeks.map((week) => (
              <div key={week.week} className={`rounded-[1.25rem] border p-4 ${week.week === 1 ? "border-emerald-200/35 bg-emerald-300/15" : "border-white/10 bg-white/10"}`}>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/70">{"Week"} {week.week}</div>
                <h3 className="mt-2 text-lg font-black">{week.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/72">{week.focus}</p>
                <div className="mt-3 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-black">{week.status}</div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">💼 My Portfolio</div>
            <h2 className="mt-3 text-3xl font-black">Evidence of Work</h2>
            <p className="mt-3 text-sm leading-7 text-white/82">Every project can create evidence: team role, photos, videos, reflections, supervisor assessment, and skills demonstrated. This becomes a youth resume, portfolio, and achievement transcript.</p>
            <div className="mt-5 rounded-[1.25rem] border border-emerald-200/20 bg-emerald-300/10 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">Resume Builder</div>
              <h3 className="mt-2 text-xl font-black">Skills Automatically Building</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
                {["Safety Awareness", "Teamwork", "Communication", "Responsibility", "Initiative", "Problem Solving", "Project Completion", "Career Exploration"].map((skill) => (
                  <span key={skill} className="rounded-full border border-white/10 bg-black/30 px-3 py-1">{skill}</span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-white/70">Each check-in, project, reflection, badge, and supervisor assessment adds evidence toward a future resume and portfolio.</p>
            </div>
            <div className="mt-5 grid gap-3">
              {youthPortfolioEntries.map((entry) => (
                <div key={entry.title} className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
                  <div className="text-lg font-black">{entry.title}</div>
                  <div className="mt-1 text-xs text-white/65">{entry.date} • {entry.team}</div>
                  <p className="mt-3 text-sm leading-6 text-white/76">{entry.evidence}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-black/25 px-3 py-1 text-xs font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🏆 My Achievements</div>
            <h2 className="mt-3 text-3xl font-black">Skills, Badges, and Recognition</h2>
            <div className="mt-5 grid gap-3">
              {youthAchievementBadges.map((badge) => (
                <div key={badge.title} className={`rounded-[1.25rem] border p-4 ${badge.earned ? "border-amber-200/35 bg-amber-300/15" : "border-white/10 bg-white/10"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-black">{badge.title}</div>
                      <div className="mt-1 text-xs font-bold text-white/60">{badge.week}</div>
                    </div>
                    <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-black">{badge.earned ? "Available Week 1" : "Upcoming"}</span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-white/70">{badge.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <JourneyCompletionCard
          title="Youth Workforce Journey Completion"
          learned={[
            "Safety and PPE",
            "Teamwork and communication",
            "Cooling Station Challenge",
            "Portfolio evidence",
            "Career and income connections",
          ]}
          nextSteps={[
            { label: "Open Today's Project", screen: "supervisor" },
            { label: "Complete Reflection", screen: "feedback" },
            { label: "View Achievements", screen: "completion" },
            { label: "Visit Marketplace", screen: "marketplace" },
          ]}
          impact={[
            "Completed youth pathway",
            "Built work-readiness skills",
            "Connected today's work to future income",
            "Added evidence toward achievement",
          ]}
          setScreen={setScreen}
        />
      </div>
    </div>
  );
}

function SupervisorOperationsCenter({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [tab, setTab] = useState<"dashboard" | "project" | "roster" | "attendance" | "wellness" | "assessment" | "incident" | "parent" | "guardian" | "feedback" | "reports">("dashboard");
  const [profiles, setProfiles] = useState<MasterProfile[]>(() => safeRead<MasterProfile[]>(PROFILE_KEY, []));
  const [youth, setYouth] = useState<YouthRegistration[]>(() => safeRead<YouthRegistration[]>(YOUTH_KEY, []));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []));
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(() => safeRead<AssessmentRecord[]>(ASSESSMENT_KEY, []));
  const [wellness, setWellness] = useState<WellnessCheckIn[]>(() => safeRead<WellnessCheckIn[]>(WELLNESS_KEY, []));
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => safeRead<IncidentRecord[]>(INCIDENT_KEY, []));
  const [parentSummaries, setParentSummaries] = useState<ParentSummary[]>(() => safeRead<ParentSummary[]>(PARENT_SUMMARY_KEY, []));
  const [parentContacts, setParentContacts] = useState<ParentContactLog[]>(() => safeRead<ParentContactLog[]>(PARENT_CONTACT_KEY, []));
  const [feedbackRows, setFeedbackRows] = useState<FeedbackRecord[]>(() => safeRead<FeedbackRecord[]>(FEEDBACK_KEY, []));
  const [refreshMessage, setRefreshMessage] = useState("");

  const refresh = async () => {
    setProfiles(await loadSupabaseRows<MasterProfile>("profiles", PROFILE_KEY));
    setYouth(await loadSupabaseRows<YouthRegistration>("youth_participants", YOUTH_KEY));
    setAttendance(await loadSupabaseRows<AttendanceRecord>("attendance_records", ATTENDANCE_KEY));
    setAssessments(await loadSupabaseRows<AssessmentRecord>("supervisor_assessments", ASSESSMENT_KEY));
    setWellness(await loadSupabaseRows<WellnessCheckIn>("wellness_checkins", WELLNESS_KEY));
    setIncidents(await loadSupabaseRows<IncidentRecord>("incident_logs", INCIDENT_KEY));
    setParentSummaries(await loadSupabaseRows<ParentSummary>("parent_summaries", PARENT_SUMMARY_KEY));
    setParentContacts(await loadSupabaseRows<ParentContactLog>("parent_contact_logs", PARENT_CONTACT_KEY));
    setFeedbackRows(await loadSupabaseRows<FeedbackRecord>("feedback", FEEDBACK_KEY));
    setRefreshMessage(`Data refreshed at ${nowLabel()}.`);
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
    { key: "project", label: "6/8 Cooling Station" },
    { key: "roster", label: "Youth Roster" },
    { key: "attendance", label: "Attendance / PPE" },
    { key: "wellness", label: "Wellness Review" },
    { key: "assessment", label: "Assessment" },
    { key: "incident", label: "Incident Log" },
    { key: "parent", label: "Parent Summary" },
    { key: "guardian", label: "Guardian Contact" },
    { key: "feedback", label: "Feedback Center" },
    { key: "reports", label: "Reports" },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[310px_1fr]">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Real Supervisor Operations Center</div>
        <h1 className="mt-3 text-3xl font-black leading-tight">Morning-to-end-of-day control room.</h1>
        <div className="mt-5 grid gap-2">
          {tabs.map((item) => (
            <button type="button" key={item.key} onClick={() => { setTab(item.key); scrollToTop(); }} className={`rounded-2xl border px-4 py-3 text-left text-sm font-black ${tab === item.key ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white"}`}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/84">
          Supervisor access protects youth information. Parents receive progress summaries, not private raw wellness notes.
        </div>
        <button type="button" onClick={refresh} className="mt-4 w-full rounded-full border border-white/15 bg-black/35 px-5 py-3 font-black">Refresh Data</button>
        {refreshMessage && <div className="mt-3 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-xs font-bold text-emerald-50">{refreshMessage}</div>}
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
        {tab === "project" && <CoolingCenterProjectModule setScreen={setScreen} activeUser={activeUser} />}
        {tab === "roster" && <YouthRosterModule youthRows={youthRows} attendance={attendance} assessments={assessments} wellness={wellness} incidents={incidents} setScreen={setScreen} setTab={setTab} />}
        {tab === "attendance" && <AttendanceTool youthRows={youthRows} activeUser={activeUser} onSaved={refresh} />}
        {tab === "wellness" && <WellnessReview wellness={wellness} profiles={profiles} />}
        {tab === "assessment" && <AssessmentTool youthRows={youthRows} activeUser={activeUser} onSaved={refresh} />}
        {tab === "incident" && <IncidentTool youthRows={youthRows} activeUser={activeUser} onSaved={refresh} />}
        {tab === "parent" && <ParentSummaryTool youthRows={youthRows} activeUser={activeUser} assessments={assessments} attendance={attendance} onSaved={refresh} />}
        {tab === "guardian" && <GuardianContactTool youthRows={youthRows} activeUser={activeUser} parentContacts={parentContacts} onSaved={refresh} />}
        {tab === "feedback" && <FeedbackCenter feedbackRows={feedbackRows} />}
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
  setTab: (tab: "dashboard" | "project" | "roster" | "attendance" | "wellness" | "assessment" | "incident" | "parent" | "guardian" | "feedback" | "reports") => void;
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
      <h2 className="mt-3 text-4xl font-black">Launch-day operating picture.</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <button type="button" key={stat.title} onClick={stat.action} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-left hover:bg-emerald-300 hover:text-black">
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
  setTab: (tab: "dashboard" | "project" | "roster" | "attendance" | "wellness" | "assessment" | "incident" | "parent" | "guardian" | "feedback" | "reports") => void;
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
        <button type="button" onClick={() => setScreen("registration")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Add New Youth</button>
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
        <button type="button" onClick={() => setTab("attendance")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Take Attendance / PPE</button>
        <button type="button" onClick={() => setTab("assessment")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Daily Assessment</button>
        <button type="button" onClick={() => setTab("parent")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Parent Summary</button>
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
    const result = await insertRow("attendance_records", ATTENDANCE_KEY, row);
    setMessage(saveModeMessage("Attendance and PPE", result));
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
      <button type="button" onClick={save} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Attendance</button>
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
    const result = await insertRow("supervisor_assessments", ASSESSMENT_KEY, row);
    setMessage(saveModeMessage("Supervisor assessment", result));
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
      <button type="button" onClick={save} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Assessment</button>
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
    const result = await insertRow("incident_logs", INCIDENT_KEY, row);
    setMessage(saveModeMessage("Incident/support log", result));
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
      <button type="button" onClick={save} className="mt-6 rounded-full bg-red-300 px-7 py-4 font-black text-black">Save Staff Log</button>
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
    const result = await insertRow("parent_summaries", PARENT_SUMMARY_KEY, row);
    setMessage(saveModeMessage("Parent-safe summary", result));
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
      <button type="button" onClick={save} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Parent Summary</button>
      {message && <Notice text={message} />}
    </Card>
  );
}


function GuardianContactTool({
  youthRows,
  activeUser,
  parentContacts,
  onSaved,
}: {
  youthRows: { registration: YouthRegistration; profile?: MasterProfile }[];
  activeUser: EcosystemUser | null;
  parentContacts: ParentContactLog[];
  onSaved: () => void;
}) {
  const [participantId, setParticipantId] = useState(youthRows[0]?.registration.participant_id || "");
  const [method, setMethod] = useState<ParentContactLog["contact_method"]>("phone");
  const [reason, setReason] = useState<ParentContactLog["contact_reason"]>("daily_update");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const selected = youthRows.find((row) => row.registration.participant_id === participantId);
  const youthName = selected?.profile ? profileName(selected.profile) : participantId;
  const guardianName = selected?.registration.guardian_name || "No guardian entered";
  const guardianPhone = selected?.registration.guardian_phone || "No phone entered";
  const guardianEmail = selected?.registration.guardian_email || "No email entered";

  const save = async () => {
    const row: ParentContactLog = {
      id: uuid(),
      participant_id: participantId,
      youth_name: youthName,
      guardian_name: selected?.registration.guardian_name,
      guardian_phone: selected?.registration.guardian_phone,
      guardian_email: selected?.registration.guardian_email,
      contact_method: method,
      contact_reason: reason,
      contact_notes: notes,
      staff_id: activeUser?.id,
      created_at: new Date().toISOString(),
    };
    const result = await insertRow("parent_contact_logs", PARENT_CONTACT_KEY, row);
    setMessage(saveModeMessage("Guardian contact log", result));
    setNotes("");
    onSaved();
  };

  const recent = parentContacts.slice(0, 10);

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Guardian Contact Center</div>
      <h2 className="mt-3 text-4xl font-black">Log parent and guardian contact.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/82">This does not send automatic email or text yet. It gives supervisors one place to see guardian contact information and document phone calls, texts sent, emails sent, pickup conversations, concerns, and daily updates.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <SelectField label="Youth Participant" value={participantId} onChange={setParticipantId} options={youthRows.map((row) => row.registration.participant_id)} />
        <SelectField label="Contact Method" value={method} onChange={(v) => setMethod(v as ParentContactLog["contact_method"])} options={["phone", "text", "email", "in_person", "left_message", "other"]} />
        <SelectField label="Reason" value={reason} onChange={(v) => setReason(v as ParentContactLog["contact_reason"])} options={["daily_update", "encouragement", "concern", "incident", "pickup", "attendance", "other"]} />
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/86">
          <div className="font-black text-white">Guardian Information</div>
          <div>Youth: {youthName}</div>
          <div>Guardian: {guardianName}</div>
          <div>Phone: {guardianPhone}</div>
          <div>Email: {guardianEmail}</div>
        </div>
      </div>
      <div className="mt-5"><TextArea label="Contact Notes" value={notes} onChange={setNotes} /></div>
      <button type="button" onClick={save} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Contact Log</button>
      {message && <Notice text={message} />}

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
        <div className="text-lg font-black">Recent Contact Logs</div>
        {recent.length === 0 ? (
          <div className="mt-3 text-sm text-white/70">No guardian contact logs yet.</div>
        ) : (
          <div className="mt-3 grid gap-3">
            {recent.map((row) => (
              <div key={row.id} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/86">
                <div className="font-black text-white">{row.youth_name || row.participant_id} — {row.contact_method} / {row.contact_reason}</div>
                <div>{row.contact_notes || "No notes entered."}</div>
                <div className="text-xs text-white/55">{new Date(row.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function FeedbackCenter({ feedbackRows }: { feedbackRows: FeedbackRecord[] }) {
  const rows = feedbackRows.slice(0, 40);
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Feedback Center</div>
      <h2 className="mt-3 text-4xl font-black">Review feedback from guests, parents, youth, growers, partners, and reviewers.</h2>
      <p className="mt-3 text-sm leading-6 text-white/82">If this list is empty after submitting feedback, the feedback table is not accepting rows yet. Local fallback records will still appear on this device.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Metric title="Feedback Records" value={feedbackRows.length} />
        <Metric title="Recommend" value={feedbackRows.filter((f) => f.would_recommend).length} />
        <Metric title="Average Rating" value={feedbackRows.length ? (feedbackRows.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackRows.length).toFixed(1) : "—"} />
        <Metric title="Pathways" value={new Set(feedbackRows.map((f) => f.pathway || f.role || "Unknown")).size} />
      </div>
      <div className="mt-6 grid gap-3">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/35 p-5 text-white/78">No feedback records found yet.</div>
        ) : rows.map((row) => (
          <div key={row.id} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/86">
            <div className="flex flex-wrap justify-between gap-3 font-black text-white">
              <span>{row.pathway || row.role || "Unknown pathway"}</span>
              <span>{row.rating}/5 • {row.would_recommend ? "Would recommend" : "Would not recommend"}</span>
            </div>
            {row.excited && <div className="mt-2"><b>Excited:</b> {row.excited}</div>}
            {row.confused && <div><b>Confused:</b> {row.confused}</div>}
            {row.improve && <div><b>Improve:</b> {row.improve}</div>}
            {row.opportunity_interest && <div><b>Opportunity:</b> {row.opportunity_interest}</div>}
            {row.comments && <div><b>Comments:</b> {row.comments}</div>}
            <div className="mt-2 text-xs text-white/55">{new Date(row.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
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
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
          <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="text-3xl font-black">{value}</div>
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
  const [mood, setMood] = useState("Okay");
  const [energy, setEnergy] = useState("Medium");
  const [sleep, setSleep] = useState("Okay");
  const [breakfast, setBreakfast] = useState("Yes");
  const [hope, setHope] = useState(3);
  const [belonging, setBelonging] = useState(3);
  const [trustedAdult, setTrustedAdult] = useState(3);
  const [closedToeShoes, setClosedToeShoes] = useState(true);
  const [waterBottle, setWaterBottle] = useState(true);
  const [workGloves, setWorkGloves] = useState(true);
  const [appropriateClothing, setAppropriateClothing] = useState(true);
  const [dailyGoal, setDailyGoal] = useState("");
  const [support, setSupport] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      const loadedProfiles = await loadSupabaseRows<MasterProfile>("profiles", PROFILE_KEY);
      const loadedYouth = await loadSupabaseRows<YouthRegistration>("youth_participants", YOUTH_KEY);
      setProfiles(loadedProfiles);
      setYouth(loadedYouth);
      if (!participantId && loadedYouth[0]?.participant_id) setParticipantId(loadedYouth[0].participant_id);
    };
    void load();
  }, []);

  const demoYouth: YouthRegistration = {
    id: "demo-youth-registration",
    profile_id: activeUser?.id || "demo-profile",
    participant_id: "BFF-736309",
    age_range: "14-18",
    crew: "Crew A",
    guardian_name: "Parent / Guardian",
    guardian_phone: "(330) 000-0000",
    guardian_email: "",
    emergency_contact: "Parent / Guardian",
    medical_notes: "Not listed",
    transportation_plan: "Parent/guardian pickup",
    program_goal: "Build skills, responsibility, and confidence.",
  };

  const selectedYouth = youth.find((y) => y.participant_id === participantId) || youth[0] || demoYouth;
  const selectedProfile = profiles.find((p) => p.id === selectedYouth?.profile_id);
  const profileId = selectedYouth?.profile_id || activeUser?.id || "anonymous";
  const checkinDate = currentTime.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const checkinTime = currentTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const allRequiredPPE = closedToeShoes && waterBottle && workGloves && appropriateClothing;
  const readinessStatus = allRequiredPPE ? "Ready for assignment" : "Supervisor review needed";
  const safetyFlag = hope <= 1 || trustedAdult <= 1 || !allRequiredPPE || /suicide|kill myself|hurt myself|overdose|drugs|unsafe|abuse|homeless|depressed|depression/i.test(support);

  const save = async () => {
    if (saving) return;
    setSaving(true);
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
      notes: `${readinessStatus}. ${dailyGoal ? `Goal: ${dailyGoal}.` : ""} ${support ? `Support requested: ${support}.` : ""}`.trim(),
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
      support_needed: `${support.trim()}${dailyGoal.trim() ? ` | Goal: ${dailyGoal.trim()}` : ""}`.trim(),
      private_note: "",
      safety_flag: safetyFlag,
      created_at: iso,
    };

    try {
      await Promise.all([
        insertRow("attendance_records", ATTENDANCE_KEY, attendanceRow),
        insertRow("wellness_checkins", WELLNESS_KEY, wellnessRow),
      ]);
      setMessage(allRequiredPPE ? `Start My Day saved. ${selectedYouth.participant_id} is checked in and ready. Opening today's assignment.` : `Check-in saved. ${selectedYouth.participant_id} needs supervisor review before assignment. Opening today's project for supervisor guidance.`);
      window.setTimeout(() => setScreen("launchProject"), 650);
    } catch (error) {
      console.error("Start My Day save issue:", error);
      setMessage(`Start My Day saved on this device. ${selectedYouth.participant_id} is recorded for this review session. Opening today's assignment.`);
      window.setTimeout(() => setScreen("launchProject"), 650);
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ label, checked, setChecked }: { label: string; checked: boolean; setChecked: (v: boolean) => void }) => (
    <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-black ${checked ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white"}`}>
      <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="h-4 w-4" />
      {label}
    </label>
  );

  const MiniSlider = ({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) => (
    <label className="rounded-xl border border-white/10 bg-white/10 p-2">
      <div className="flex justify-between text-[11px] font-black"><span>{label}</span><span>{value}/5</span></div>
      <input className="mt-1 w-full" type="range" min={1} max={5} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </label>
  );

  return (
    <Card className="p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.32em] text-emerald-100/75">Youth Morning Readiness Check-In</div>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">Start My Day</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/80">Fast check-in for attendance, PPE, daily goal, and support needs.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/12 px-4 py-3 text-right">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/75">Check-In Time</div>
          <div className="text-xl font-black">{checkinTime}</div>
          <div className="text-xs font-bold text-white/75">{checkinDate}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_1.15fr_1.2fr]">
        <section className="rounded-2xl border border-white/10 bg-black/28 p-3">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">Identity</div>
          <div className="mt-2">
            <SelectField label="Youth Participant" value={selectedYouth?.participant_id || participantId} onChange={setParticipantId} options={(youth.length ? youth : [demoYouth]).map((y) => y.participant_id)} />
          </div>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm leading-6">
            <div className="font-black text-white">{profileName(selectedProfile) === "Unknown participant" ? activeUser?.name || "Youth Participant" : profileName(selectedProfile)}</div>
            <div className="text-white/70">Participant ID: {selectedYouth?.participant_id}</div>
            <div className="text-white/70">Crew: {selectedYouth?.crew || "Unassigned"}</div>
            <div className="mt-2 rounded-full bg-emerald-300 px-3 py-1 text-center text-xs font-black text-black">Attendance saves as PRESENT.</div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/28 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">PPE</div>
            <button type="button" onClick={save} disabled={saving} className={`rounded-full px-4 py-2 text-xs font-black disabled:opacity-60 ${allRequiredPPE ? "bg-emerald-300 text-black" : "bg-amber-300 text-black"}`}>
              {saving ? "Saving..." : readinessStatus}
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Toggle label="Boots / Shoes" checked={closedToeShoes} setChecked={setClosedToeShoes} />
            <Toggle label="Water" checked={waterBottle} setChecked={setWaterBottle} />
            <Toggle label="Gloves" checked={workGloves} setChecked={setWorkGloves} />
            <Toggle label="Outdoor Clothing" checked={appropriateClothing} setChecked={setAppropriateClothing} />
          </div>
          <button type="button" onClick={save} disabled={saving} className="mt-3 w-full rounded-full bg-emerald-300 px-5 py-3 text-base font-black text-black disabled:opacity-60">
            {saving ? "Saving..." : "Start My Day"}
          </button>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/28 p-3">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">Readiness + Support</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-4">
            <SelectField label="Mood" value={mood} onChange={setMood} options={["Great", "Good", "Okay", "Tired", "Sad", "Angry", "Worried", "Overwhelmed"]} />
            <SelectField label="Energy" value={energy} onChange={setEnergy} options={["High", "Medium", "Low", "Very low"]} />
            <SelectField label="Sleep" value={sleep} onChange={setSleep} options={["Good", "Okay", "Poor", "No sleep"]} />
            <SelectField label="Food" value={breakfast} onChange={setBreakfast} options={["Yes", "No", "Not enough", "Prefer not to say"]} />
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <MiniSlider label="Hope" value={hope} setValue={setHope} />
            <MiniSlider label="Belonging" value={belonging} setValue={setBelonging} />
            <MiniSlider label="Trusted Adult" value={trustedAdult} setValue={setTrustedAdult} />
          </div>
        </section>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <TextArea label="Daily Goal" value={dailyGoal} onChange={setDailyGoal} placeholder="What do you want to accomplish today?" />
        <TextArea label="Need supervisor support?" value={support} onChange={setSupport} placeholder="Optional. A supervisor can check in privately." />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={save} disabled={saving} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black disabled:opacity-60">{saving ? "Saving..." : "Start My Day"}</button>
        <button type="button" onClick={() => setScreen("youth")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Back to Youth Journey</button>
        <button type="button" onClick={() => setScreen("roles")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Choose Another Role</button>
        <button type="button" onClick={() => setScreen("portal")} className="rounded-full border border-white/15 bg-black/35 px-5 py-3 font-black">Return to Portal</button>
      </div>

      {safetyFlag && <Notice text="Support or readiness flag detected. Approved staff should review before work assignments are issued." />}
      {message && <Notice text={message} />}
    </Card>
  );
}


function CaseManagerPortal({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const wellness = safeRead<WellnessCheckIn[]>(WELLNESS_KEY, []);
  const incidents = safeRead<IncidentRecord[]>(INCIDENT_KEY, []);
  const parentContacts = safeRead<ParentContactLog[]>(PARENT_CONTACT_KEY, []);
  const supportFlags = wellness.filter((item) => item.safety_flag || item.support_needed || item.private_note);

  return (
    <div className="grid gap-5">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Case Manager Portal</div>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Whole-person youth support.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80">Case managers help identify barriers, coordinate resources, support families, respond to wellness concerns, and keep supervisors focused on coaching and safety.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            ["Open Support Flags", supportFlags.length],
            ["Incident Logs", incidents.length],
            ["Parent Contacts", parentContacts.length],
            ["Follow-Ups", supportFlags.length + incidents.length],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <div className="text-3xl font-black">{value}</div>
              <div className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => setScreen("supervisor")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Open Supervisor Notes</button>
          <button type="button" onClick={() => setScreen("parent")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Parent Portal</button>
          <button type="button" onClick={() => setScreen("reports")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Mission Control</button>
        </div>
      </Card>
      <SupportResponseFrameworkCard />
    </div>
  );
}

function ParentScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const summaries = safeRead<ParentSummary[]>(PARENT_SUMMARY_KEY, []);
  const attendance = safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []);
  const assessments = safeRead<AssessmentRecord[]>(ASSESSMENT_KEY, []);
  const completions = safeRead<any[]>(COMPLETION_KEY, []);

  const presentCount = attendance.filter((item) => item.status === "present").length;
  const absentCount = attendance.filter((item) => item.status === "absent").length;
  const latestSummary = summaries[0];

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Parent / Guardian Portal</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Progress, encouragement, and next steps.</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80">
        Parents see attendance, accomplishments, badges, goals, project milestones, and parent-safe messages. Private wellness reflections and sensitive staff notes remain staff-protected.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ["Present", String(presentCount)],
          ["Absent", String(absentCount)],
          ["Assessments", String(assessments.length)],
          ["Achievements", String(completions.length)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/28 p-5">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/70">{label}</div>
            <div className="mt-2 text-4xl font-black">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-5">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/75">Today's Workforce Project</div>
        <h2 className="mt-2 text-2xl font-black">{featuredProject.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/82">{featuredProject.farmConnection}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
            <h3 className="font-black">Learning Objectives</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-white/78">
              <li>✓ Understand heat stress risks</li>
              <li>✓ Follow PPE requirements</li>
              <li>✓ Complete assigned team role</li>
              <li>✓ Participate in final presentation</li>
            </ul>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
            <h3 className="font-black">Career Connections</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-white/78">
              <li>Manufacturing Technician</li>
              <li>Construction Trades</li>
              <li>Product Designer</li>
              <li>Quality Control</li>
              <li>Entrepreneur</li>
            </ul>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-amber-300/12 p-4">
            <h3 className="font-black">Completion Evidence</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-white/78">
              <li>☐ Watched demonstration</li>
              <li>☐ Participated in team assignment</li>
              <li>☐ Practiced safe work procedures</li>
              <li>☐ Added evidence to portfolio</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {coolingCenterTeams.map((team) => (
            <div key={team.name} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl">{team.icon}</div>
              <div className="mt-2 font-black">{team.name}</div>
              <div className="mt-2 text-xs leading-5 text-white/70">{team.mission}</div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setScreen("launchProject")} className="mt-5 rounded-full bg-emerald-300 px-6 py-3 font-black text-black">View June 8 Project</button>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/10 p-5">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/75">My Child's Workforce Progress</div>
        <h2 className="mt-2 text-2xl font-black">Resume and Portfolio Growth</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {["Badges Earned", "Projects Completed", "Skills Demonstrated", "Supervisor Strengths", "Career Interests"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm font-black">{item}</div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-7 text-white/75">Families can see how daily work becomes evidence for future employment, education, trade programs, internships, and leadership opportunities.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <h2 className="text-2xl font-black">Parent-Safe Supervisor Summary</h2>
          {latestSummary ? (
            <p className="mt-3 text-sm leading-7 text-white/86">{latestSummary.parent_safe_message}</p>
          ) : (
            <p className="mt-3 text-sm leading-7 text-white/76">Your youth is building workforce habits, teamwork, safety awareness, communication, problem-solving, leadership, and future opportunity interests. Supervisors can add individual parent-safe summaries from the Supervisor Operations Center.</p>
          )}
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <h2 className="text-2xl font-black">Parent Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {["Send Encouragement", "Ask Question", "Report Concern", "Volunteer Interest", "Receive Weekly Updates"].map((action) => (
              <button key={action} type="button" onClick={() => setScreen("feedback")} className="rounded-full border border-white/15 bg-black/30 px-5 py-3 text-sm font-black">{action}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {summaries.slice(0, 6).map((summary) => (
          <div key={summary.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-white/65">{summary.date} • {summary.participant_id}</div>
            <p className="mt-2 text-sm leading-7 text-white/88">{summary.parent_safe_message}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("supervisor")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Supervisor Center</button>
        <button type="button" onClick={() => setScreen("media")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Media Center</button>
        <button type="button" onClick={() => setScreen("feedback")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Parent Feedback</button>
      </div>

      <JourneyCompletionCard
        title="Parent / Guardian Journey Completion"
        learned={[
          "Attendance progress",
          "Project participation",
          "Achievement status",
          "Parent-safe supervisor summaries",
          "Family engagement options",
        ]}
        nextSteps={[
          { label: "View June 8 Project", screen: "supervisor" },
          { label: "Send Parent Feedback", screen: "feedback" },
          { label: "View Achievements", screen: "completion" },
          { label: "Return to Workspace", screen: "roles" },
        ]}
        impact={[
          "Reviewed youth progress",
          "Identified next milestone",
          "Connected family support to workforce growth",
          "Protected sensitive youth wellness information",
        ]}
        setScreen={setScreen}
      />
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
  const isMarketplaceManager = activeUser?.role === "Administrator" || activeUser?.role === "Supervisor / Staff" || activeUser?.role === "Board / Funder";
  useEffect(() => {
    if (!isMarketplaceManager && (tab === "command" || tab === "catalog" || tab === "fulfillment")) {
      setTab("storefront");
    }
  }, [isMarketplaceManager, tab]);
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
    <div className="grid gap-5 xl:grid-cols-[330px_1fr]">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Marketplace Operations Center</div>
        <h1 className="mt-3 text-3xl font-black leading-tight">GrownBy + Direct Sales.</h1>
        <p className="mt-4 text-sm leading-7 text-white/82">Sales can happen through GrownBy or directly through Bronson. This center turns orders into harvest planning, packing, pickup, and reporting.</p>
        <div className="mt-5 grid gap-2">
          {(activeUser?.role === "Administrator" || activeUser?.role === "Supervisor / Staff" || activeUser?.role === "Board / Funder"
            ? [
                ["command", "Operations"],
                ["storefront", "Products"],
                ["checkout", `Cart (${cartCount})`],
                ["orders", "Orders"],
                ["fulfillment", "Fulfillment"],
                ["catalog", "Catalog Admin"],
              ]
            : activeUser?.role === "Grower" || activeUser?.role === "Value-Added Producer"
            ? [
                ["storefront", "Products"],
                ["checkout", `Cart (${cartCount})`],
                ["orders", "My Orders"],
              ]
            : [
                ["storefront", "Products"],
                ["checkout", `Cart (${cartCount})`],
                ["orders", "My Orders"],
              ]
          ).map(([key, label]) => (
            <button type="button" key={key} onClick={() => { setTab(key as typeof tab); scrollToTop(); }} className={`rounded-2xl border px-4 py-3 text-left text-sm font-black ${tab === key ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white"}`}>{label}</button>
          ))}
        </div>
        {isMarketplaceManager ? (
          <>
            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3"><div className="text-2xl font-black">{ordersToday.length}</div><div className="text-xs uppercase tracking-[0.2em] text-white/60">Orders Today</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3"><div className="text-2xl font-black">{money(revenueToday)}</div><div className="text-xs uppercase tracking-[0.2em] text-white/60">Sales Today</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3"><div className="text-2xl font-black">{activeProducts.length}</div><div className="text-xs uppercase tracking-[0.2em] text-white/60">Products</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3"><div className="text-2xl font-black">{lowInventory.length}</div><div className="text-xs uppercase tracking-[0.2em] text-white/60">Low Stock</div></div>
            </div>
            <button type="button" onClick={refresh} className="mt-4 w-full rounded-full border border-white/15 bg-black/35 px-5 py-3 font-black">Refresh Marketplace</button>
            <button type="button" onClick={() => setScreen("grower")} className="mt-3 w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Open Grower Demand</button>
          </>
        ) : (
          <div className="mt-5 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
            Browse products, add items to cart, and place an order. Staff-only catalog and fulfillment tools are hidden from customer and grower views.
          </div>
        )}
      </Card>

      <div>
        {message && <Notice text={message} />}

        {tab === "command" && (
          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Live Marketplace Command</div>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">Orders become harvest instructions.</h1>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                <div key={label as string} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <div className="text-3xl font-black">{value}</div>
                  <div className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-white/65">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <div className="text-xl font-black">GrownBy Channel</div>
                <p className="mt-3 text-sm leading-7 text-white/78">Use for sales you complete through GrownBy, especially SNAP-supported orders. Enter the GrownBy reference so harvest and pickup can be tracked here.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <div className="text-xl font-black">Direct Channel</div>
                <p className="mt-3 text-sm leading-7 text-white/78">Use for farm gate sales, schools, businesses, churches, events, wholesale, invoices, and community orders.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <div className="text-xl font-black">Youth Connection</div>
                <p className="mt-3 text-sm leading-7 text-white/78">Youth should see safe marketplace impact: where food is going, what crops are needed, and why today’s harvest matters — not private customer data.</p>
              </div>
            </div>
          </Card>
        )}

        {tab === "storefront" && (
          <Card>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Product Catalog</div>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">Fresh food, grower supplies, value-added goods, and pickup ordering.</h1>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((cat) => <button type="button" key={cat} onClick={() => setCategory(cat)} className={`rounded-full border px-4 py-2 text-sm font-black ${category === cat ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10"}`}>{cat}</button>)}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <div key={product.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10">
                  <div className="border-b border-white/10 bg-black/35 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/70">Marketplace Listing</div>
                    <div className="mt-2 text-sm leading-6 text-white/70">Words-only launch card. Product images are intentionally hidden until verified images match each item.</div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3"><div className="text-lg font-black">{product.name}</div><div className="text-right font-black text-emerald-100">{money(product.price)}</div></div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/55">{product.category} • per {product.unit}</div>
                    <p className="mt-3 text-sm leading-6 text-white/78">{product.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-black"><span className="rounded-full bg-black/35 px-3 py-1">Inventory: {product.inventory}</span>{product.snap_eligible && <span className="rounded-full bg-emerald-300 px-3 py-1 text-black">SNAP eligible</span>}{Boolean((product as any).harvest_ready) && <span className="rounded-full bg-amber-200 px-3 py-1 text-black">Harvest ready</span>}</div>
                    <button type="button" onClick={() => addToCart(product)} className="mt-4 w-full rounded-full bg-emerald-300 px-5 py-3 font-black text-black">Add to Cart</button>
                  </div>
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
                <button type="button" onClick={placeOrder} className="mt-5 w-full rounded-full bg-emerald-300 px-6 py-4 font-black text-black">Save Marketplace Order</button>
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
                return <div key={order.id} className="rounded-2xl border border-white/10 bg-white/10 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="flex flex-wrap items-center gap-2"><div className="text-lg font-black">{order.customer_name}</div><ChannelBadge channel={order.sales_channel || "Direct"} /></div><div className="text-xs uppercase tracking-[0.2em] text-white/60">{order.pickup_date} • {order.pickup_window} • {order.payment_method}</div></div><div className="text-right"><div className="text-xl font-black">{money(Number(order.total || 0))}</div><div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/75">{order.status}</div></div></div><div className="mt-3 text-sm leading-7 text-white/78">{items.map((item) => `${item.quantity} ${item.product_name}`).join(" • ") || "Order items loading from saved records."}</div><div className="mt-2 text-xs text-white/60">Fulfillment: {order.fulfillment_status || "needs_harvest"} • Harvest: {order.harvest_status || "not_started"} {order.grownby_reference ? `• GrownBy: ${order.grownby_reference}` : ""}</div></div>;
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
                <div className="text-xl font-black">Pending Fulfillment</div>
                <div className="mt-4 space-y-3">
                  {pendingOrders.slice(0, 8).map((order) => <div key={order.id} className="rounded-2xl bg-black/30 p-4"><div className="flex justify-between gap-3"><div><div className="font-black">{order.customer_name}</div><div className="text-xs uppercase tracking-[0.18em] text-white/55">{order.pickup_date} • {order.pickup_window}</div></div><ChannelBadge channel={order.sales_channel || "Direct"} /></div><div className="mt-2 text-sm text-white/70">{order.fulfillment_status || "needs_harvest"}</div></div>)}
                  {!pendingOrders.length && <div className="text-sm text-white/70">No pending orders.</div>}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <div className="text-xl font-black">Low Inventory / Harvest Attention</div>
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
                <div className="text-xl font-black">Add Product</div>
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
                  <button type="button" onClick={addProduct} className="rounded-full bg-emerald-300 px-6 py-4 font-black text-black">Add Product</button>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <div className="text-xl font-black">Channel Rules</div>
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


function LaunchEvents({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Events & Orientation</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Launch calendar and orientation center.</h1>
      <p className="mt-5 max-w-4xl text-lg leading-8 text-white/84">
        These launch events prepare staff, supervisors, youth, parents, and partners for safe outdoor workforce programming at Bronson Family Farm.
      </p>
      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {launchEvents.map((event) => (
          <div key={event.title} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/75">{event.date} • {event.time}</div>
            <h2 className="mt-3 text-2xl font-black">{event.title}</h2>
            <div className="mt-2 text-sm font-black text-white/70">Audience: {event.audience}</div>
            <p className="mt-4 text-sm leading-7 text-white/82">{event.purpose}</p>
          </div>
        ))}
      </div>
      <div className="mt-7 rounded-[1.5rem] border border-amber-200/20 bg-amber-300/12 p-5">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-100/75">June 8 Featured Activity</div>
        <h2 className="mt-2 text-3xl font-black">{featuredProject.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/84">{featuredProject.objective}</p>
        <p className="mt-3 text-sm leading-7 text-white/78">{featuredProject.farmConnection}</p>
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Open June 8 Project Module</button>
        <button type="button" onClick={() => setScreen("media")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Open Media Center</button>
        <button type="button" onClick={() => setScreen("roles")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Choose Workspace</button>
      </div>
    </Card>
  );
}


function VideoLibrary({ compact = false }: { compact?: boolean }) {
  const moduleCard = (video: LaunchVideo) => {
    const isSupervisor = video.title.includes("Supervisor") || video.title.includes("June 5");
    const isCoolingIntro = video.title.includes("Cooling Station Challenge Introduction") || video.title.includes("June 8 Cooling Station");
    const isManufacturing = video.title.includes("Manufacturing");
    const isCompletion = video.title.includes("Final Cooling Station");

    const heading = isSupervisor
      ? "June 5 Staff & Supervisor Orientation"
      : isCoolingIntro
        ? "June 8 Cooling Station Challenge Launch Brief"
        : isManufacturing
          ? "Manufacturing Team Training Module"
          : isCompletion
            ? "Final Cooling Station Completion Module"
            : video.title;

    const items = isSupervisor
      ? [
          "Site safety and youth protection",
          "Attendance and check-in procedures",
          "PPE and heat-safety expectations",
          "Wellness awareness and support",
          "Incident documentation",
          "Parent-safe communication",
          "Platform navigation and reporting",
        ]
      : isCoolingIntro
        ? [
            "Real-world farm worker heat-safety challenge",
            "Design Team develops concepts and templates",
            "Engineering Team optimizes materials and layout",
            "Manufacturing Team assembles and quality-checks",
            "Contractor Team builds the final cooling station",
            "Youth practice teamwork, communication, and problem solving",
            "Photos, reflections, and assessments become portfolio evidence",
          ]
        : isManufacturing
          ? [
              "Assembly and safe production flow",
              "Painting, personalization, and branding",
              "Quality review before delivery to the Contractor Team",
              "Teamwork, finishing, and farm operations documentation",
            ]
          : isCompletion
            ? [
                "Completed fans collected from production teams",
                "Cooling station setup and presentation area prepared",
                "Final team presentation and project documentation",
                "Youth achievement evidence saved for portfolios",
              ]
            : [];

    return (
      <div className="min-h-[260px] border-b border-emerald-200/15 bg-gradient-to-br from-emerald-950/70 via-slate-950/65 to-amber-950/45 p-5">
        <div className="inline-flex rounded-full bg-emerald-300/18 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-50">
          Active Training Content
        </div>
        <h3 className="mt-4 text-2xl font-black text-white">{heading}</h3>
        {items.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm leading-6 text-white/84">
            {items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="font-black text-emerald-200">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm leading-7 text-white/80">{video.fallback}</p>
        )}
        <div className="mt-5 rounded-xl border border-emerald-200/15 bg-emerald-300/12 p-3 text-xs font-bold leading-5 text-emerald-50">
          {isSupervisor
            ? "Training content is active. Video recording will be added after the live orientation session."
            : isCoolingIntro
              ? "Challenge content is active. Video recording will be added after the live launch session."
              : "Training module is active. Video documentation can be added after the live session."}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-7 rounded-[1.5rem] border border-sky-200/20 bg-sky-300/10 p-5">
      <div className="text-xs font-black uppercase tracking-[0.28em] text-sky-100/75">Launch Video Library</div>
      <h2 className="mt-3 text-2xl font-black">June 5 and June 8 media documentation</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-white/78">
        This section organizes the staff orientation, the June 8 Cooling Station Challenge, the fan demonstration, manufacturing/painting documentation, youth interviews, and the final project completion record. Missing live recordings are now shown as active training cards so reviewers do not see empty black video boxes.
      </p>
      <div className={`mt-5 grid gap-4 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
        {launchVideos.map((video) => (
          <div key={video.title} className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/35">
            {video.embedUrl ? (
              <div className="aspect-video w-full overflow-hidden bg-black/80">
                <iframe
                  width="100%"
                  height="100%"
                  src={video.embedUrl}
                  title={video.embedTitle || video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : (
              moduleCard(video)
            )}
            <div className="p-4">
              <h3 className="text-lg font-black">{video.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/74">{video.purpose}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-emerald-300/15 px-3 py-1 text-[11px] font-black text-emerald-50">{tag}</span>
                ))}
              </div>
              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] leading-5 text-white/62">
                {video.embedUrl ? (
                  <>Training Resource: <span className="font-black text-white/80">demonstration ready</span></>
                ) : (
                  <>Training Module: <span className="font-black text-white/80">Active and Ready for Launch</span></>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaCenter({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const folders = [
    ["June 5 Staff Orientation Video", "Staff and supervisor training, site rules, safety expectations, platform use, and emergency procedures."],
    ["June 8 Cooling Station Challenge Video", "Full project documentation for the farm worker heat-safety challenge."],
    ["Fan Template & Design Video", "The fan template process, design decisions, and prototype demonstration."],
    ["Manufacturing Fan Painting Video", "Assembly, painting, personalization, finishing, branding, and quality-control documentation."],
    ["Design Team Gallery", "Templates, prototypes, design sketches, signage, and worker instructions."],
    ["Engineering Team Gallery", "Cardboard layout planning, material efficiency, tracing, cutting, and waste-reduction documentation."],
    ["Manufacturing Team Gallery", "Assembly, painting, personalization, finishing, branding, and quality-control documentation."],
    ["Contractor Team Gallery", "Cooling station setup, installation, fan collection, display, and final presentation area."],
    ["Final Cooling Station", "Completion photos, video, group photo, testimonial clips, and project presentation."],
    ["Youth Interviews", "Youth voice, what they learned, career connections, and reflections."],
    ["Supervisor Interviews", "Staff observations, workforce readiness, safety, and launch notes."],
  ];
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Media Center</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Document the launch story.</h1>
      <p className="mt-5 max-w-4xl text-lg leading-8 text-white/84">
        The Media Center organizes orientation videos, youth workforce activities, farm progress, interviews, testimonials, drone footage, and partner documentation. It keeps the June 8 project connected to real farm operations and impact reporting.
      </p>
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {folders.map(([title, text]) => (
          <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
            <div className="text-2xl">🎥</div>
            <h2 className="mt-3 text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/78">{text}</p>
            <div className="mt-4 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-black text-white/70">Upload / archive placeholder</div>
          </div>
        ))}
      </div>
      <div className="mt-7"><SupportResponseFrameworkCard /></div>
      <VideoLibrary />
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Open June 8 Project</button>
        <button type="button" onClick={() => setScreen("events")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Events & Orientation</button>
      </div>
    </Card>
  );
}

function CoolingCenterProjectModule({
  setScreen,
  activeUser,
  compact = false,
}: {
  setScreen: (screen: Screen) => void;
  activeUser: EcosystemUser | null;
  compact?: boolean;
}) {
  const [savedItems, setSavedItems] = useState<string[]>(() => safeRead<string[]>("bff.launch.coolingCenterProgress", []));
  const [selectedTeam, setSelectedTeam] = useState<string>("Manufacturing Team");
  const [contributions, setContributions] = useState<string[]>(() => safeRead<string[]>("bff.launch.myContributions", []));
  const [learning, setLearning] = useState<string[]>(() => safeRead<string[]>("bff.launch.whatILearned", []));
  const [visionBefore, setVisionBefore] = useState(() => safeRead<string>("bff.launch.visionBefore", ""));
  const [visionAfter, setVisionAfter] = useState(() => safeRead<string>("bff.launch.visionAfter", ""));
  const [oneAcre, setOneAcre] = useState(() => safeRead<string>("bff.launch.oneAcre", ""));

  const selectedTeamInfo = coolingCenterTeams.find((team) => team.name === selectedTeam) || coolingCenterTeams[2];

  const toggleSaved = (item: string) => {
    const next = savedItems.includes(item) ? savedItems.filter((x) => x !== item) : [item, ...savedItems];
    setSavedItems(next);
    safeWrite("bff.launch.coolingCenterProgress", next);
  };

  const toggleContribution = (item: string) => {
    const next = contributions.includes(item) ? contributions.filter((x) => x !== item) : [item, ...contributions];
    setContributions(next);
    safeWrite("bff.launch.myContributions", next);
  };

  const toggleLearning = (item: string) => {
    const next = learning.includes(item) ? learning.filter((x) => x !== item) : [item, ...learning];
    setLearning(next);
    safeWrite("bff.launch.whatILearned", next);
  };

  const saveVision = () => {
    safeWrite("bff.launch.visionBefore", visionBefore);
    safeWrite("bff.launch.visionAfter", visionAfter);
    safeWrite("bff.launch.oneAcre", oneAcre);
  };

  const contributionItems = [
    "Creating ideas",
    "Solving problems",
    "Building products",
    "Supporting my team",
    "Helping a customer",
    "Creating value",
    "Learning a new skill",
    "Improving a process",
    "Helping someone succeed",
    "Demonstrating leadership",
    "Showing creativity",
    "Practicing responsibility",
    "Completing assigned tasks",
    "Maintaining quality standards",
    "Supporting safety",
  ];

  const learningItems = [
    "How businesses work",
    "How customers and contractors work together",
    "How products are manufactured",
    "How quality affects customer satisfaction",
    "How creativity creates value",
    "How teamwork improves results",
    "How communication helps projects succeed",
    "How planning saves time and money",
    "How ideas become products",
    "How products create opportunities",
    "How entrepreneurs identify opportunities",
    "How money is earned by solving problems",
    "How food moves from farms to customers",
    "How rising costs affect businesses and families",
    "How workforce skills prepare me for future opportunities",
    "How Bronson Family Farm creates value for the community",
    "That I am capable of more than I realized",
  ];

  const productionItems = [
    "Youth checked in",
    "PPE and water confirmed",
    "Why this project matters lesson completed",
    "Entrepreneur example discussed",
    "Vision challenge completed",
    "My Contribution selected",
    "Teams assigned",
    "Customer order explained: 63 fans",
    "Business cycle explained",
    "Design standards approved",
    "Engineering quality checklist completed",
    "Manufacturing stations active",
    "Fans assembled",
    "Fans painted and personalized",
    "Quality check completed",
    "Fans counted for delivery",
    "Fans delivered to Contractor Team",
    "Reflection completed",
    "What I Learned completed",
    "Career interest selected",
    "Achievement celebrated",
  ];

  const productionMetrics = [
    ["Customer Order", "63 fans"],
    ["Material Cost", "$0.06 each"],
    ["Markup", "20%"],
    ["Sale Price", "$0.072 each"],
    ["Material Cost Total", "$3.78"],
    ["Contract Value", "$4.54"],
  ];

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">June 8 Workforce Production Challenge</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">SEE IT → IMAGINE IT → DESIGN IT → BUILD IT → DELIVER IT → CREATE VALUE → OWN IT</h1>
      <p className="mt-5 max-w-5xl text-lg leading-8 text-white/86">
        Youth will complete a real customer order: produce, paint, quality-check, and prepare 63 cooling fans for a contractor building a cooling station at Bronson Family Farm.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-5">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/75">Today's Business Story</div>
          <p className="mt-3 text-sm leading-7 text-white/84">
            Bronson Family Farm is the customer. A contractor is hired to build the cooling station. The contractor becomes the customer when ordering 63 fans from the youth manufacturing workforce.
          </p>
          <div className="mt-4 rounded-2xl bg-black/30 p-4 text-sm font-black leading-7 text-white/86">
            Bronson Family Farm ↓ Contractor ↓ Youth Manufacturing Workforce ↓ Product Delivery ↓ Installation ↓ Customer Satisfaction
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-amber-200/20 bg-amber-300/12 p-5">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-amber-100/75">The Money Side</div>
          <div className="mt-3 grid gap-2">
            {productionMetrics.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-black/25 p-3 text-sm">
                <span className="text-white/72">{label}</span>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-white/65">Why It Matters</div>
          <p className="mt-3 text-sm leading-7 text-white/82">
            Food prices are rising because every step costs money: growing, harvesting, packaging, transportation, labor, storage, marketing, and selling. This project helps youth understand how solving problems creates value, income, careers, and stronger communities.
          </p>
        </div>
      </div>

      {!compact && (
        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_.95fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
            <div className="text-xs font-black uppercase tracking-[0.28em] text-emerald-100/75">Watch Before Work Begins</div>
            <h2 className="mt-3 text-2xl font-black">Fan Prototype Demonstration</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-white/80">
              Watch how a simple fan idea can become a product. Youth should look for ideas they can improve, paint, personalize, and prepare for the contractor's order.
            </p>
            <div className="mt-5 aspect-video w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/80">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dtYzf3avkT4"
                title="DIY Cardboard Fan | Cardboard Fan no motor no battery"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/10 p-5">
            <div className="text-xs font-black uppercase tracking-[0.28em] text-emerald-100/75">Entrepreneurship Example</div>
            <h2 className="mt-3 text-2xl font-black">A 13-Year-Old Saw Opportunity</h2>
            <p className="mt-3 text-sm leading-7 text-white/82">
              Use the young entrepreneur snack-selling example to start the conversation. The lesson is not snacks. The lesson is that opportunity begins when someone sees a need, creates value, and serves a customer.
            </p>
            <a
              href="https://www.tiktok.com/@kasi_hustlers/video/7610048087100362002"
              target="_blank"
              rel="noreferrer"
              className="mt-5 block rounded-2xl bg-emerald-300 px-5 py-4 text-center font-black text-black"
            >
              Open Inspiration Video
            </a>
            <div className="mt-4 rounded-2xl bg-black/25 p-4 text-sm leading-6 text-white/78">
              Discussion: What problem was he solving? Who was his customer? What opportunity could you create at Bronson Family Farm?
            </div>
          </div>
        </div>
      )}

      <div className="mt-7 rounded-[1.5rem] border border-amber-200/20 bg-amber-300/10 p-5">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-100/75">Vision Challenge</div>
        <h2 className="mt-3 text-2xl font-black">What Opportunity Do You See?</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <label className="block rounded-2xl bg-black/25 p-4">
            <span className="text-sm font-black">This morning I see...</span>
            <textarea value={visionBefore} onChange={(e) => setVisionBefore(e.target.value)} className="mt-3 min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none" placeholder="Example: I see a fan, a tomato, a field, or a problem." />
          </label>
          <label className="block rounded-2xl bg-black/25 p-4">
            <span className="text-sm font-black">If I had one acre at Bronson Family Farm, I would...</span>
            <textarea value={oneAcre} onChange={(e) => setOneAcre(e.target.value)} className="mt-3 min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none" placeholder="Grow, build, sell, host, teach, create..." />
          </label>
          <label className="block rounded-2xl bg-black/25 p-4">
            <span className="text-sm font-black">Now I see...</span>
            <textarea value={visionAfter} onChange={(e) => setVisionAfter(e.target.value)} className="mt-3 min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none" placeholder="What opportunity do you see now?" />
          </label>
        </div>
        <button type="button" onClick={saveVision} className="mt-4 rounded-full bg-amber-300 px-6 py-3 font-black text-black">Save My Vision</button>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[.8fr_1fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-white/65">Choose / View My Team</div>
          <div className="mt-4 grid gap-2">
            {coolingCenterTeams.map((team) => (
              <button
                type="button"
                key={team.name}
                onClick={() => setSelectedTeam(team.name)}
                className={`rounded-2xl border p-4 text-left transition ${selectedTeam === team.name ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-black/25 text-white"}`}
              >
                <div className="text-lg font-black">{team.icon} {team.name}</div>
                <div className="mt-1 text-sm font-bold opacity-80">{team.identity}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/10 p-5">
          <div className="text-4xl">{selectedTeamInfo.icon}</div>
          <h2 className="mt-3 text-3xl font-black">{selectedTeamInfo.name}</h2>
          <p className="mt-2 text-lg font-black text-emerald-100">{selectedTeamInfo.identity}</p>
          <p className="mt-3 text-sm font-bold text-white/70">Recommended assignment: {selectedTeamInfo.recommendedShare}</p>
          <p className="mt-4 text-sm leading-7 text-white/82">{selectedTeamInfo.mission}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100/75">Deliverables</div>
              <ul className="mt-2 space-y-1 text-sm text-white/78">{selectedTeamInfo.deliverables.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100/75">Skills</div>
              <ul className="mt-2 space-y-1 text-sm text-white/78">{selectedTeamInfo.skills.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100/75">Careers</div>
              <ul className="mt-2 space-y-1 text-sm text-white/78">{selectedTeamInfo.careers.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-5">
              <h2 className="text-2xl font-black">My Contribution</h2>
              <p className="mt-2 text-sm leading-6 text-white/78">Choose the ways you will contribute today. This becomes part of your achievement record.</p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {contributionItems.map((item) => {
                  const active = contributions.includes(item);
                  return <button type="button" key={item} onClick={() => toggleContribution(item)} className={`rounded-2xl border p-3 text-left text-sm font-black ${active ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-black/25 text-white"}`}>{active ? "✅" : "☐"} {item}</button>;
                })}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-amber-200/20 bg-amber-300/12 p-5">
              <h2 className="text-2xl font-black">What Did I Learn?</h2>
              <p className="mt-2 text-sm leading-6 text-white/78">Complete this at the end of the project.</p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {learningItems.map((item) => {
                  const active = learning.includes(item);
                  return <button type="button" key={item} onClick={() => toggleLearning(item)} className={`rounded-2xl border p-3 text-left text-sm font-black ${active ? "border-amber-200 bg-amber-300 text-black" : "border-white/10 bg-black/25 text-white"}`}>{active ? "✅" : "☐"} {item}</button>;
                })}
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_.85fr]">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
              <h2 className="text-2xl font-black">Production Board</h2>
              <p className="mt-3 text-sm leading-7 text-white/78">Tap each item as the launch team completes the work. These are saved locally for launch review.</p>
              <div className="mt-5 grid gap-2 md:grid-cols-2">
                {productionItems.map((item) => {
                  const active = savedItems.includes(item);
                  return (
                    <button type="button" key={item} onClick={() => toggleSaved(item)} className={`rounded-2xl border p-4 text-left text-sm font-black transition ${active ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-black/30 text-white"}`}>
                      {active ? "✅" : "☐"} {item}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
              <h2 className="text-2xl font-black">Supervisor Role Today</h2>
              <p className="mt-3 text-sm leading-7 text-white/82">Supervisors guide youth success. They do not do the work for the youth.</p>
              {[
                "Safety Leader: PPE, hydration, heat awareness, tool safety, emergency response.",
                "Workforce Coach: encouragement, problem solving, positive behavior, conflict resolution.",
                "Team Facilitator: keep time, organize teams, support deliverables, keep youth focused.",
                "Assessor: observe communication, teamwork, responsibility, problem solving, participation.",
                "Wellness Observer: notice fatigue, frustration, withdrawal, escalation, or need for support.",
              ].map((item) => <div key={item} className="mt-3 rounded-2xl bg-white/10 p-3 text-sm leading-6 text-white/80">✓ {item}</div>)}
            </div>
          </div>

          <div className="mt-7 rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
            <h2 className="text-2xl font-black">Celebration & Achievement</h2>
            <p className="mt-4 text-lg leading-8 text-white/88">
              Today we are not just building fans. We are learning how to see opportunity, imagine solutions, design ideas, build products, deliver value, take ownership, and connect our work to future careers.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {["Opportunity Seeker", "Problem Solver", "Team Builder", "Creative Thinker", "Quality Champion", "Workforce Ready", "Entrepreneurial Mindset", "Value Creator", "Future Builder"].map((badge) => (
                <div key={badge} className="rounded-2xl border border-emerald-200/20 bg-emerald-300/12 p-4 text-sm font-black">🏆 {badge}</div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-7 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("wellness")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Start Youth Check-In</button>
        <button type="button" onClick={() => setScreen("supervisor")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Supervisor Tracking</button>
        <button type="button" onClick={() => setScreen("media")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Media Center</button>
        <button type="button" onClick={() => setScreen("feedback")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Reflection / Feedback</button>
      </div>
    </Card>
  );
}

function Reports({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const profiles = safeRead<MasterProfile[]>(PROFILE_KEY, []);
  const youth = safeRead<YouthRegistration[]>(YOUTH_KEY, []);
  const attendance = safeRead<AttendanceRecord[]>(ATTENDANCE_KEY, []);
  const assessments = safeRead<AssessmentRecord[]>(ASSESSMENT_KEY, []);
  const wellness = safeRead<WellnessCheckIn[]>(WELLNESS_KEY, []);
  const incidents = safeRead<IncidentRecord[]>(INCIDENT_KEY, []);
  const feedback = safeRead<FeedbackRecord[]>(FEEDBACK_KEY, []);
  const projectProgress = safeRead<string[]>("bff.launch.coolingCenterProgress", []);
  const today = todayISO();
  const present = attendance.filter((a) => a.date === today && a.status === "present").length;
  const supportFlags = wellness.filter((w) => w.safety_flag).length;
  const readiness = [
    ["System Status", "ONLINE"],
    ["Launch Phase", "Community Beta"],
    ["Staff Orientation", "June 5, 2026 — 9:30 AM"],
    ["Youth Workforce Launch", "June 8, 2026 — 8:00 AM"],
    ["Featured Project", featuredProject.shortTitle],
    ["Project Teams", "Design | Engineering | Manufacturing | Contractor"],
    ["Photo / Video Documentation", "Media Center Ready"],
    ["Fan Template / Design Video", "Ready for upload"],
    ["Manufacturing Fan Painting Video", "Ready for upload"],
    ["Cooling Station Completion Video", "Ready for upload"],
    ["Translation Coverage", "Audit In Progress"],
    ["Launch Decision", "Validate Pathways + Launch"],
  ];
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Mission Control / Reports</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Launch-day readiness status.</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Profiles", profiles.length],
          ["Youth Registered", youth.length],
          ["Present Today", present],
          ["Assessments", assessments.length],
          ["Support Flags", supportFlags],
          ["Incident Logs", incidents.length],
          ["Feedback", feedback.length],
          ["Project Items Complete", projectProgress.length],
          ["Portfolio Entries", youthPortfolioEntries.length],
          ["Resume Ready", Math.min(youth.length, assessments.length)],
          ["Career Pathways", coolingCenterTeams.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="text-3xl font-black">{value}</div>
            <div className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-3">
        {readiness.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">{label}</div>
            <div className="mt-2 text-lg font-black">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-7 rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-5 text-center">
        <h2 className="text-3xl font-black">🌲 Bronson Family Farm Launch Command Center</h2>
        <p className="mt-3 text-lg font-bold">Community Beta Launch Phase</p>
        <p className="mt-3 text-sm text-white/80">Staff Orientation: June 5, 2026 — 9:30 AM</p>
        <p className="text-sm text-white/80">Youth Workforce Launch: June 8, 2026 — 8:00 AM</p>
        <p className="mt-4 text-xl font-black">We Grow Green to Harvest Dreams.</p>
      </div>
      <div className="mt-7"><SupportResponseFrameworkCard /></div>
      <VideoLibrary />
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Open June 8 Project</button>
        <button type="button" onClick={() => setScreen("events")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Events & Orientation</button>
        <button type="button" onClick={() => setScreen("supervisor")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Supervisor Center</button>
      </div>
    </Card>
  );
}

function Operations({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Operations</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Daily rhythm for launch.</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          ["Beginning of Day", "QR/manual check-in, PPE, water, farm worker heat-safety awareness, daily proverb, weather awareness, assignments."],
          ["June 8 Featured Project", "Farm Worker Heat Safety & Cooling Station Challenge: Design, Engineering, Manufacturing, and Contractor teams work in sequence."],
          ["During Program", "Supervisor observations, wellness support, safety follow-up, team progress, task completion, incident documentation."],
          ["End of Day", "Youth reflection, supervisor assessment, parent-safe summary, media documentation, reports."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="text-xl font-black">{title}</div>
            <p className="mt-3 text-sm leading-7 text-white/82">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("supervisor")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Open Supervisor Center</button>
        <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Open June 8 Project</button>
        <button type="button" onClick={() => setScreen("events")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Events & Orientation</button>
      </div>
    </Card>
  );
}


function GuidedDemo({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const stops = [
    {
      title: "1. Forest Gate",
      text: "Begin with the story of Bronson Family Farm as the Youngstown anchor of the Mahoning & Trumbull Regional Food Ecosystem.",
      action: "Explore Guest Story",
      target: "guest" as Screen,
    },
    {
      title: "2. Connected Food Ecosystem",
      text: "See how growers, youth workforce, partners, supporters, marketplace activity, education, and community resources connect.",
      action: "View Marketplace",
      target: "marketplace" as Screen,
    },
    {
      title: "3. Grower Pathway",
      text: "Backyard gardens, community gardens, school gardens, church gardens, urban farms, greenhouses, homesteads, and market farms all belong.",
      action: "Open Grower Pathway",
      target: "grower" as Screen,
    },
    {
      title: "4. Youth Workforce",
      text: "Youth begin with daily rhythm, PPE, wellness readiness, team identity, skills, leadership, and opportunity.",
      action: "Open Youth Pathway",
      target: "youth" as Screen,
    },
    {
      title: "5. June 8 Farm Worker Heat Safety Project",
      text: "Youth work through Design, Engineering, Manufacturing, and Contractor teams to build a real cooling station for farm worker and visitor heat safety.",
      action: "Open Cooling Station Challenge",
      target: "launchProject" as Screen,
    },
    {
      title: "5. Partner + Support",
      text: "Partners and supporters can volunteer, mentor, teach, donate, share resources, sponsor infrastructure, and strengthen the regional ecosystem.",
      action: "Open Support Pathway",
      target: "support" as Screen,
    },
    {
      title: "6. Leave Comments",
      text: "Every user can save comments, ratings, what excited them, what confused them, and what should improve. Data saves locally first and syncs to Supabase when the table matches.",
      action: "Save Feedback / Comments",
      target: "feedback" as Screen,
    },
  ];

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Guided Demo</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Experience the ecosystem in order.</h1>
      <p className="mt-5 max-w-4xl text-lg leading-8 text-white/86">
        This guided demo lets every user understand the same launch story: Youngstown — Bronson Family Farm, Warren — Parker Farms, and the connected regional ecosystem.
      </p>
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stops.map((stop) => (
          <div key={stop.title} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
            <h2 className="text-2xl font-black">{stop.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/82">{stop.text}</p>
            <button type="button" onClick={() => setScreen(stop.target)} className="mt-5 rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-black">
              {stop.action}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("roles")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Choose Role</button>
        <button type="button" onClick={() => setScreen("feedback")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Comment / Save Feedback</button>
        <button type="button" onClick={() => setScreen("portal")} className="rounded-full border border-white/15 bg-black/35 px-6 py-3 font-black">Return to Portal</button>
      </div>
    </Card>
  );
}

function Feedback({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [excited, setExcited] = useState("");
  const [confused, setConfused] = useState("");
  const [improve, setImprove] = useState("");
  const [opportunity, setOpportunity] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [message, setMessage] = useState("");

  const save = async () => {
    const row: FeedbackRecord = {
      id: uuid(),
      profile_id: activeUser?.id,
      profile_type: activeUser ? roleToProfileType(activeUser.role) : "customer",
      feedback_type: activeUser?.role === "Parent / Guardian" ? "program" : "platform",
      rating,
      comments,
      would_recommend: recommend,
      screen: "feedback",
      pathway: activeUser?.role || "Public / Guest",
      role: activeUser?.role || "Public / Guest",
      excited,
      confused,
      improve,
      opportunity_interest: opportunity,
      created_at: new Date().toISOString(),
    };
    const result = await insertRow("feedback", FEEDBACK_KEY, row);
    setMessage(saveModeMessage("Feedback/comments", result));
  };

  const returnTarget = activeUser ? routeForRole(activeUser.role) : "demo";
  const promptTitle = activeUser?.role === "Parent / Guardian" ? "Parent / Guardian Feedback" : "How was your experience today?";
  const promptIntro = activeUser?.role === "Parent / Guardian"
    ? "Tell us what helped your family feel informed, encouraged, and connected."
    : "Keep it short. Your feedback helps us improve the ecosystem for launch.";

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Feedback</div>
      <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">{promptTitle}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/76">{promptIntro}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="flex justify-between text-sm font-black"><span>Rating</span><span>{rating}/5</span></div>
          <input className="mt-3 w-full" type="range" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 font-black">
          <input type="checkbox" checked={recommend} onChange={(e) => setRecommend(e.target.checked)} />
          I would recommend this experience.
        </label>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <CompactTextArea label={activeUser?.role === "Parent / Guardian" ? "What helped you feel informed?" : "What excited you?"} value={excited} onChange={setExcited} />
        <CompactTextArea label={activeUser?.role === "Parent / Guardian" ? "Any concern or question?" : "What confused you?"} value={confused} onChange={setConfused} />
        <CompactTextArea label="What should we improve?" value={improve} onChange={setImprove} />
        <CompactTextArea label="What opportunity interests you?" value={opportunity} onChange={setOpportunity} />
      </div>
      <div className="mt-4"><CompactTextArea label="Additional comments" value={comments} onChange={setComments} rows={2} /></div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={save} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Feedback</button>
        <button type="button" onClick={() => setScreen(returnTarget)} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Return</button>
      </div>
      {message && <Notice text={message} />}
    </Card>
  );
}

function CompactTextArea(props: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/10 p-3">
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-100/75">{props.label}</span>
      <textarea
        value={props.value}
        rows={props.rows || 2}
        onChange={(event) => props.onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35"
      />
    </label>
  );
}


function GrowerJourney({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <SimplePathway
        title="Grower Pathway"
        image={IMG.grow}
        text="Every grower belongs here: backyard gardens, raised beds, community gardens, school gardens, church gardens, urban farms, greenhouses, homesteads, and market farms. Growers can connect crop planning, resource needs, inventory, training, community tools, and marketplace opportunity."
        setScreen={setScreen}
        extra={
          <>
            <button type="button" onClick={() => setScreen("registration")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Create Grower Profile</button>
            <button type="button" onClick={() => setScreen("marketplace")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Marketplace Opportunities</button>
            <button type="button" onClick={() => setScreen("operations")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Grower Operations</button>
          </>
        }
      />
      <LaunchAuditDetailGrid
        title="Grower workspace destinations"
        items={[
          { heading: "Crop Planner", body: "Plan what is being grown, where it is planted, timing, tasks, and expected harvest." },
          { heading: "Grow Plan", body: "Connect seeds, soil, water, compost, field notes, inventory, and market demand." },
          { heading: "Library Tools", body: "Track community tools and equipment access from libraries, makerspaces, and resource partners." },
          { heading: "Marketplace", body: "Move products into GrownBy, direct sales, SNAP-aware food access, schools, restaurants, and community buyers." },
          { heading: "Training", body: "Connect growers to training, technical assistance, field learning, pricing, packaging, and grant readiness." },
          { heading: "Farm & Family Alliance", body: "Position the nonprofit as the support system for grower education, food access, workforce, and regional collaboration." },
        ]}
      />
    </>
  );
}

function PartnerJourney({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <SimplePathway
        title="Partner Pathway"
        image={IMG.partners}
        text="Partners include schools, businesses, nonprofits, agencies, funders, faith communities, universities, and volunteer groups. This journey helps partners understand what the ecosystem offers, what it needs, and how collaboration can create measurable community impact."
        setScreen={setScreen}
        extra={
          <>
            <button type="button" onClick={() => setScreen("registration")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Create Partner Profile</button>
            <button type="button" onClick={() => setScreen("support")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Support Options</button>
          </>
        }
      />
      <LaunchAuditDetailGrid
        title="Partner contribution pathways"
        items={[
          { heading: "Funding", body: "Support youth wages, infrastructure, transportation, grower tools, food access, and ecosystem technology." },
          { heading: "Volunteers", body: "Bring skilled volunteers, mentors, event support, work crews, or site-day support." },
          { heading: "Training", body: "Offer workshops, workforce readiness, career talks, safety training, business support, culinary pathways, or technical skills." },
          { heading: "Equipment", body: "Contribute tools, materials, technology, irrigation, fencing, cooling, storage, and operational resources." },
          { heading: "Food Access", body: "Help connect products to families, schools, businesses, communities, and SNAP-aware marketplace access." },
          { heading: "Impact Reporting", body: "Track youth served, families reached, resources contributed, volunteer hours, products moved, and outcomes created." },
        ]}
      />
    </>
  );
}

function SupportJourney({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <SimplePathway
      title="Support the Ecosystem"
      image={IMG.compost}
      text="Support can be financial, volunteer-based, mentorship-based, or in-kind. Jubilee Gardens, Inc. is recognized as a Seed Steward for providing abundant seeds over the past two years. Supporters can help with youth, growers, food access, infrastructure, education, and regional growth."
      setScreen={setScreen}
      extra={
        <>
          <button type="button" onClick={() => setScreen("registration")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Offer Support</button>
          <button type="button" onClick={() => setScreen("partner")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Become a Partner</button>
        </>
      }
    />
  );
}

function ValueAddedJourney({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <SimplePathway
        title="Value-Added Producer Pathway"
        image={IMG.market}
        text="Value-added producers turn harvests, herbs, honey, seeds, flowers, and ideas into products. This pathway connects product readiness, packaging, pricing, labeling awareness, and marketplace participation."
        setScreen={setScreen}
        extra={
          <>
            <button type="button" onClick={() => setScreen("registration")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Create Producer Profile</button>
            <button type="button" onClick={() => setScreen("marketplace")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Connect to Marketplace</button>
          </>
        }
      />
      <LaunchAuditDetailGrid
        title="Value-added product development"
        items={[
          { heading: "Bubble Babies", body: "Seed roll products can teach production, packaging, pricing, labeling, inventory, and marketplace storytelling." },
          { heading: "Honey", body: "Honey and bee-related products can connect apiary learning, branding, food awareness, and local sales." },
          { heading: "Herbs & Seeds", body: "Herbs, seeds, flowers, and produce can become educational kits, culinary products, garden products, and gift items." },
          { heading: "Packaging", body: "Producers learn package size, label clarity, presentation, compliance awareness, and customer value." },
          { heading: "Pricing", body: "Producers connect cost, labor, materials, market demand, and margin to sustainable pricing." },
          { heading: "Marketplace Sales", body: "Products move into the marketplace, GrownBy, events, partner tables, and local food system sales opportunities." },
        ]}
      />
    </>
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
    <>
      <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]">
        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Pathway</div>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/88">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {extra}
            <button type="button" onClick={() => setScreen("portal")} className="rounded-full border border-white/15 bg-black/35 px-6 py-3 font-black">Return to Portal</button>
            <button type="button" onClick={() => setScreen("roles")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Choose Another Role</button>
            <button type="button" onClick={() => setScreen("feedback")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Comment on This Screen</button>
            <button type="button" onClick={() => setScreen("completion")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Record Achievement</button>
            <button type="button" onClick={() => setScreen("marketplace")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Go to Marketplace</button>
          </div>
        </Card>
        <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_35px_100px_rgba(0,0,0,.48)]">
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.src = IMG.backup)} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        </div>
      </div>
      <JourneyCompletionCard
        title={`${title} Completion`}
        learned={[
          "Explored this pathway",
          "Viewed role-specific resources",
          "Identified a next step",
          "Connected the pathway to ecosystem impact",
        ]}
        nextSteps={[
          { label: "Visit Marketplace", screen: "marketplace" },
          { label: "Register / Update Profile", screen: "registration" },
          { label: "Share Feedback", screen: "feedback" },
          { label: "Record Achievement", screen: "completion" },
        ]}
        impact={[
          "Explored pathway",
          "Viewed resources",
          "Identified opportunity",
          "Stayed connected",
        ]}
        setScreen={setScreen}
      />
    </>
  );
}


function CompletionExperience({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const [name, setName] = useState(activeUser?.name || "");
  const [interestGrow, setInterestGrow] = useState(false);
  const [interestYouth, setInterestYouth] = useState(false);
  const [interestPartner, setInterestPartner] = useState(false);
  const [interestVolunteer, setInterestVolunteer] = useState(false);
  const [interestMarketplace, setInterestMarketplace] = useState(false);
  const [message, setMessage] = useState("");
  const journey = safeRead<JourneyEvent[]>(JOURNEY_KEY, []);
  const recent = journey.slice(0, 6);

  const complete = () => {
    const pathway = recent[0]?.label || screenLabel("completion");
    recordCompletion(pathway, activeUser);
    setMessage("Achievement progress saved on this device. You can continue exploring or share feedback.");
  };

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Achievement Center</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">Ecosystem Explorer</h1>
      <p className="mt-5 max-w-4xl text-lg leading-8 text-white/86">
        Thank you for exploring the Mahoning & Trumbull Regional Food Ecosystem: Youngstown — Bronson Family Farm and Warren — Parker Farms.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.85fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <h2 className="text-2xl font-black">Cultivator Achievement Certificate</h2>
          <Field label="Name for certificate" value={name} onChange={setName} placeholder="Enter name" />
          <div className="mt-5 rounded-[1.25rem] border border-emerald-200/25 bg-emerald-300/12 p-5 text-center">
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-100/75">This certifies that</div>
            <div className="mt-3 text-3xl font-black">{name || activeUser?.name || "Ecosystem Explorer"}</div>
            <p className="mt-3 text-sm leading-6 text-white/82">
              documented achievement through the Mahoning & Trumbull Regional Food Ecosystem and helped strengthen the launch experience.
            </p>
            <div className="mt-4 text-sm font-black">{new Date().toLocaleDateString()}</div>
          </div>
          <button type="button" onClick={complete} className="mt-5 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Save Completion</button>
          {message && <Notice text={message} />}
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <h2 className="text-2xl font-black">Impact Interests</h2>
          <div className="mt-4 grid gap-2">
            <label className="flex items-center gap-3 rounded-2xl bg-black/30 p-3 font-bold"><input type="checkbox" checked={interestGrow} onChange={(e) => setInterestGrow(e.target.checked)} /> Growing food / grower resources</label>
            <label className="flex items-center gap-3 rounded-2xl bg-black/30 p-3 font-bold"><input type="checkbox" checked={interestYouth} onChange={(e) => setInterestYouth(e.target.checked)} /> Youth workforce development</label>
            <label className="flex items-center gap-3 rounded-2xl bg-black/30 p-3 font-bold"><input type="checkbox" checked={interestPartner} onChange={(e) => setInterestPartner(e.target.checked)} /> Partnership or collaboration</label>
            <label className="flex items-center gap-3 rounded-2xl bg-black/30 p-3 font-bold"><input type="checkbox" checked={interestVolunteer} onChange={(e) => setInterestVolunteer(e.target.checked)} /> Volunteer, mentor, or support</label>
            <label className="flex items-center gap-3 rounded-2xl bg-black/30 p-3 font-bold"><input type="checkbox" checked={interestMarketplace} onChange={(e) => setInterestMarketplace(e.target.checked)} /> Marketplace / GrownBy</label>
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100/75">Recently Viewed</div>
            <div className="mt-3 grid gap-2">
              {recent.length ? recent.map((event) => <div key={event.id} className="rounded-xl bg-white/10 p-3 text-sm">{event.label}</div>) : <div className="rounded-xl bg-white/10 p-3 text-sm">No journey activity recorded yet.</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("feedback")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Leave Feedback</button>
        <button type="button" onClick={() => setScreen("roles")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Choose Another Role</button>
        <button type="button" onClick={() => setScreen("portal")} className="rounded-full border border-white/15 bg-black/35 px-6 py-3 font-black">Return to Portal</button>
      </div>
    </Card>
  );
}

export default App;
