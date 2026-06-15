import React, { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * MASTER INTEGRATION NOTE — Almanac access + inventory visibility are launch-critical.
 * Required launch behavior:
 * - Youth with unmatched Tuesday 4-digit PIN may continue pending verification.
 * - Send/record unmatched PIN verification for bhchatman@gmail.com.
 * - Almanac is a daily operating layer, not a hidden resource.
 * - Inventory is visible on Supervisor, Mission Control, and Today's Work screens.
 */

/**
 * Bronson Family Farm Online Ecosystem
 * LAUNCH CANDIDATE 4.0 - MONDAY WEEK 2 LAUNCH FREEZE
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
 * - Restores Forest Gate Portal: window into ecosystem with Guest / New / Returning doors
 * - Keeps returning youth on PIN, supervisors on PIN 2350, parents on email/youth access, and growers/partners/Mission Control on temporary password Nesco2026
 * - Layers youth curriculum by week and day
 * - Reframes uploads as Tell Your Cultivator Story instead of evidence
 * - Adds simple Cultivator Moment: “All of that food comes from this skinny plant?” with Explore the Connections
 * - Adds Minimum Launch Standard scorecard to Mission Control
 * - Defines OperationsInventoryPanel so inventory is visible and usable instead of referenced only
 * - Removes static Almanac placeholder guidance from the live Almanac layer
 * - Promotes live weather, work status, assignment, and Cultivator Moment to the youth launch dashboard
 * - Adds Cultivator Reflection: Skills Used Today, Who Am I Becoming, and Cultivator Wisdom
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
  | "almanac"
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
  participant_id?: string;
  profile_id?: string;
  needs_supervisor_verification?: boolean;
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
const OPERATIONS_INVENTORY_KEY = "bff.launch.operations.inventory";
const OPERATIONS_INVENTORY_LOG_KEY = "bff.launch.operations.inventoryLog";
const JOURNEY_KEY = "bff.launch.journey.events";
const COMPLETION_KEY = "bff.launch.completions";
const LANGUAGE_KEY = "bff.launch.language";
const MEDIA_ASSETS_KEY = "bff.launch.media.assets";
const MEDIA_BUCKET = "bff-media";
const FARM_STATUS_KEY = "bff.launch.farmStatus";
const NOTIFICATION_KEY = "bff.launch.notifications";

type FarmOperationStatus = {
  level: "Open" | "Modified Operations" | "Closed";
  color: "green" | "amber" | "red";
  title: string;
  summary: string;
  action: string;
  updated_at: string;
};

type EcosystemNotification = {
  id: string;
  audience: "Youth" | "Parent" | "Supervisor" | "Mission Control" | "All";
  priority: "Info" | "Action" | "Safety" | "Urgent";
  title: string;
  body: string;
  created_at: string;
};

const defaultFarmStatus: FarmOperationStatus = {
  level: "Open",
  color: "green",
  title: "Normal Operations — Follow Today’s Farm Conditions",
  summary: "Begin with today’s assignment, check hydration, review conditions, and follow supervisor direction before outdoor work.",
  action: "Check the live farm conditions card, bring water, confirm PPE, and listen for any Mission Control updates.",
  updated_at: new Date().toISOString(),
};

const launchAlmanacSnapshot = {
  label: "Today’s Farm Conditions",
  note: "Live weather appears on the workday screen. The official Almanac is opened through the live Youngstown Almanac links instead of being replaced by static text.",
  weather: {
    location: "Youngstown, Ohio / Bronson Family Farm",
    current: "LIVE weather pulls from Open-Meteo for Youngstown when the browser is online",
    temperature: "Loading live weather",
    heatIndex: "Monitor heat index before outdoor work",
    rainChance: "Check before planting, watering, or tool setup",
    wind: "Observe wind before spraying, lifting covers, or using loose materials",
  },
  operationsByDay: {
    Sunday: "Weekend preview: check Mission Control before arriving onsite.",
    Monday: "Weekly topic selection, supervisor assignment, PPE, and work-plan confirmation.",
    Tuesday: "Field production, observation, documentation, and skill practice.",
    Wednesday: "Onsite Water cleans and services porta potties. Keep service access clear.",
    Thursday: "Production, maintenance, problem solving, and project completion.",
    Friday: "Water totes are filled. Verify tote locations, access, and refill needs.",
    Saturday: "Weekend operations may differ. Check Mission Control before farm activity.",
  } as Record<string, string>,
};

const defaultNotifications: EcosystemNotification[] = [
  { id: "farm-status", audience: "All", priority: "Info", title: "Check Today’s Farm Conditions", body: "Begin with the live farm conditions card. Mission Control will change status if heat, weather, water, or site conditions affect work.", created_at: new Date().toISOString() },
  { id: "today-assignment", audience: "Youth", priority: "Action", title: "Start with Safety, Then Today’s Assignment", body: "Check the Nurse Line, farm conditions, and current week activity before starting work.", created_at: new Date().toISOString() },
  { id: "cultivator-story", audience: "Youth", priority: "Info", title: "Tell Your Cultivator Story", body: "Take photos or videos of what you learned, built, helped with, or accomplished today. You are becoming more capable than you were yesterday.", created_at: new Date().toISOString() },
  { id: "parent-notice", audience: "Parent", priority: "Info", title: "Parent Updates Follow Farm Status", body: "Parents should check program status, early shutdown notes, and supervisor announcements when heat or weather changes the day.", created_at: new Date().toISOString() },
];


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


const youthWeekOneDailyPlan = [
  {
    day: "Monday",
    date: "June 8, 2026",
    curriculum: "Workplace Foundations, Safety, PPE, and Cooling Station Challenge launch",
    focus: "Youth learn the daily rhythm, confirm PPE and water, understand heat safety, and begin the 63 Cooling Fan customer order.",
    work: ["Check in with supervisor", "Confirm PPE and water", "Watch fan demonstration", "Join Design, Engineering, Manufacturing, Finishing, or Logistics team", "Begin fan production work"],
    resources: ["Nurse line reminder", "Heat safety checklist", "Fan template / design video", "Team assignment card"],
    reflection: "What team did you join, and how does your work help create a cooling station?",
  },
  {
    day: "Tuesday",
    date: "June 9, 2026",
    curriculum: "Production flow, teamwork, measurement, and quality standards",
    focus: "Youth continue production while learning how one team depends on another team in a real work system.",
    work: ["Review yesterday's count", "Continue assembly / finishing", "Check quality standards", "Track completed fans", "Document evidence for portfolio"],
    resources: ["Quality checklist", "Production count sheet", "Tool safety reminder", "Team communication prompts"],
    reflection: "Which team depended on your work today?",
  },
  {
    day: "Wednesday",
    date: "June 10, 2026",
    curriculum: "Farm infrastructure, cooling station purpose, safety zones, and customer needs",
    focus: "Youth connect the fan project to farm operations, worker protection, guest safety, and outdoor heat awareness.",
    work: ["Review cooling station purpose", "Support staging and logistics", "Identify shade / water / safety zones", "Continue production or quality check", "Record lessons learned"],
    resources: ["Cooling station safety map", "Water and shade checklist", "Infrastructure vocabulary", "Supervisor observation prompts"],
    reflection: "How does a cooling station help farm workers, volunteers, or visitors?",
  },
  {
    day: "Thursday",
    date: "June 11, 2026",
    curriculum: "Career pathways, customer order completion, presentation, and responsibility",
    focus: "Youth connect their team role to real careers in design, engineering, manufacturing, logistics, construction, agriculture, and operations.",
    work: ["Finish assigned production tasks", "Prepare customer-ready items", "Identify career skills used", "Update portfolio evidence", "Practice explaining team contribution"],
    resources: ["Career pathway cards", "Portfolio evidence checklist", "Customer service language", "Presentation prompts"],
    reflection: "What career pathway did you see in today's work?",
  },
  {
    day: "Friday",
    date: "June 12, 2026",
    curriculum: "Reflection, achievement, supervisor feedback, portfolio evidence, and next-week readiness",
    focus: "Youth close the week by reviewing what they built, what they learned, and what evidence belongs in their workforce portfolio.",
    work: ["Complete weekly reflection", "Review supervisor feedback", "Record achievement evidence", "Prepare for next week's agriculture rotation", "Celebrate team progress"],
    resources: ["Weekly reflection guide", "Achievement badge checklist", "Parent-safe summary prompt", "Next week preview"],
    reflection: "What are you proud of this week, and what do you want to learn next?",
  },
];


const youthWeekTwoDailyPlan = [
  {
    day: "Monday",
    date: "Week 2 Monday",
    curriculum: "Soil health, compost, and living systems observation",
    focus: "Youth observe soil as a living system, compare compost and field soil, and identify what healthy soil needs before planting.",
    work: ["Observe soil texture and smell", "Compare compost and field soil", "Identify what seedlings need", "Record one thing that surprised you"],
    resources: ["Soil health checklist", "Compost observation guide", "Seedling care basics"],
    reflection: "How did today’s soil work help you understand what plants need to grow?",
  },
  {
    day: "Tuesday",
    date: "Week 2 Tuesday",
    curriculum: "Seedlings, planting, companion planting, and crop care",
    focus: "Youth plant or care for seedlings and connect small beginnings to future harvest, food access, and marketplace opportunity.",
    work: ["Plant or check seedlings", "Water carefully", "Look for plant stress", "Explore companion planting connections"],
    resources: ["Companion planting guide", "Seedling care card", "Watering basics"],
    reflection: "What small thing did you do today that could grow into something bigger?",
  },
  {
    day: "Wednesday",
    date: "Week 2 Wednesday",
    curriculum: "Farm operations, sanitation, water access, and site readiness",
    focus: "Youth learn that farm work depends on invisible systems: sanitation, water, access lanes, safety, and coordination.",
    work: ["Keep porta-potty service access clear", "Check work zones", "Review hydration plan", "Support site readiness tasks"],
    resources: ["Wednesday operations note", "Hydration checklist", "Site access and safety guide"],
    reflection: "What farm system did you notice today that helps everyone work safely?",
  },
  {
    day: "Thursday",
    date: "Week 2 Thursday",
    curriculum: "Plant growth, pollinators, observation, and ecosystem connections",
    focus: "Youth observe how plants, flowers, insects, water, soil, and people connect in the farm ecosystem.",
    work: ["Observe plant growth", "Look for pollinator activity", "Identify one connection", "Document a Cultivator Moment"],
    resources: ["Pollinator basics", "Plant observation prompts", "Explore the Connections"],
    reflection: "What connection did you discover between plants, people, and the ecosystem?",
  },
  {
    day: "Friday",
    date: "Week 2 Friday",
    curriculum: "Water operations, stewardship, weekly reflection, and Cultivator Story",
    focus: "Youth connect water tote filling, crop health, planning, and responsibility to the larger farm system.",
    work: ["Verify water tote access", "Support watering plan", "Review the week", "Tell your Cultivator Story"],
    resources: ["Friday water operations note", "Weekly reflection guide", "Cultivator Story prompt"],
    reflection: "How did this week help you become more capable than you were yesterday?",
  },
];

const youthDailyPlansByWeek: Record<number, typeof youthWeekOneDailyPlan> = {
  1: youthWeekOneDailyPlan,
  2: youthWeekTwoDailyPlan,
};

const PROGRAM_START_DATE = new Date("2026-06-08T00:00:00");
const LAUNCH_MINIMUM_ACTIVE_WEEK = 2;

function getCurrentProgramWeek(date = new Date()) {
  const start = new Date(PROGRAM_START_DATE);
  start.setHours(0, 0, 0, 0);
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((current.getTime() - start.getTime()) / 86400000);
  const computed = Math.max(1, Math.floor(diffDays / 7) + 1);
  return Math.min(8, Math.max(LAUNCH_MINIMUM_ACTIVE_WEEK, computed));
}

function getProgramDayIndex(date = new Date()) {
  const day = date.getDay();
  if (day === 0 || day === 6) return 0; // Weekend preview shows Monday's activity.
  return Math.max(0, Math.min(4, day - 1));
}

function getCurrentYouthWeek() {
  const weekNumber = getCurrentProgramWeek();
  return youthCurriculumWeeks.find((week) => week.week === weekNumber) || youthCurriculumWeeks[0];
}

function getCurrentYouthPlan(date = new Date()) {
  const weekNumber = getCurrentProgramWeek(date);
  const plans = youthDailyPlansByWeek[weekNumber] || youthWeekOneDailyPlan;
  return plans[getProgramDayIndex(date)] || plans[0];
}

function getAlmanacDayName(date = new Date()) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function getTodayOperation(date = new Date()) {
  const dayName = getAlmanacDayName(date);
  return launchAlmanacSnapshot.operationsByDay[dayName] || "Check Mission Control for today’s operation note.";
}

type LiveFarmWeather = {
  temperature?: number;
  apparent?: number;
  humidity?: number;
  wind?: number;
  precipitation?: number;
  rainChance?: number;
  sunrise?: string;
  sunset?: string;
  uv?: number;
  tomorrowHigh?: number;
  tomorrowLow?: number;
  weekHighs?: number[];
  weekLows?: number[];
  updated?: string;
  error?: string;
};

const FARM_LATITUDE = 41.0998;
const FARM_LONGITUDE = -80.6495;
const FARM_TIME_ZONE = "America/New_York";

function formatLiveTime(value?: string) {
  if (!value) return "Loading";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Loading";
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatLiveNumber(value?: number, suffix = "") {
  return typeof value === "number" && Number.isFinite(value) ? `${Math.round(value)}${suffix}` : "Loading";
}

function getLiveWeatherGuidance(weather: LiveFarmWeather | null) {
  if (!weather) return "Loading live farm conditions…";
  if (weather.error) return "Live weather is unavailable right now. Use supervisor observation and Mission Control status.";
  const apparent = weather.apparent ?? weather.temperature ?? 0;
  const rainChance = weather.rainChance ?? 0;
  const wind = weather.wind ?? 0;
  const guidance: string[] = [];
  if (apparent >= 90) guidance.push("Heat review required: increase shade, water, and breaks.");
  else if (apparent >= 82) guidance.push("Hydration watch: check water before outdoor work.");
  else guidance.push("Normal heat watch: keep water visible.");
  if (rainChance >= 50) guidance.push("Rain likely: protect tools/materials and review planting plans.");
  if (wind >= 15) guidance.push("Wind watch: secure loose materials.");
  return guidance.join(" ");
}

function getTodayAlmanacCards(date = new Date(), farmStatus = getFarmStatus(), weather: LiveFarmWeather | null = null) {
  const temp = weather?.temperature;
  const apparent = weather?.apparent;
  return [
    ["LIVE Weather", weather?.error ? weather.error : `${launchAlmanacSnapshot.weather.location} · ${formatLiveNumber(temp, "°F")} · feels ${formatLiveNumber(apparent, "°F")}`],
    ["Heat / Hydration", getLiveWeatherGuidance(weather)],
    ["Rain Chance", weather?.rainChance !== undefined ? `${Math.round(weather.rainChance)}%` : "Loading rain chance"],
    ["Wind", weather?.wind !== undefined ? `${Math.round(weather.wind)} mph` : "Loading wind"],
    ["Sunrise / Sunset", `${formatLiveTime(weather?.sunrise)} / ${formatLiveTime(weather?.sunset)}`],
    ["UV / Sun", weather?.uv !== undefined ? `UV max ${Math.round(weather.uv)}` : "Loading UV"],
    ["Tomorrow", weather?.tomorrowHigh !== undefined ? `${Math.round(weather.tomorrowHigh)}°F / ${Math.round(weather.tomorrowLow || 0)}°F` : "Loading tomorrow forecast"],
    ["Week Ahead", weather?.weekHighs?.length ? `Highs ${Math.round(Math.min(...weather.weekHighs.slice(0, 7)))}°–${Math.round(Math.max(...weather.weekHighs.slice(0, 7)))}°F` : "Loading week ahead"],
    ["Work Status", `${farmStatus.level}: ${farmStatus.summary}`],
    ["Today’s Operations", getTodayOperation(date)],
  ];
}

const YOUNGSTOWN_ALMANAC_FORECAST_URL = "https://www.almanac.com/weather/forecast/OH/Youngstown";
const YOUNGSTOWN_ALMANAC_PLANTING_URL = "https://www.almanac.com/gardening/planting-calendar/zipcode/44505";
const ALMANAC_GROWING_GUIDES_URL = "https://www.almanac.com/gardening/growing-guides";

function LiveAlmanacResourceLinks() {
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <a className="rounded-2xl border border-emerald-200/35 bg-emerald-300/18 px-4 py-3 text-sm font-black text-white hover:bg-emerald-300/25" href={YOUNGSTOWN_ALMANAC_FORECAST_URL} target="_blank" rel="noreferrer">
        Open LIVE Youngstown Almanac Forecast ↗
      </a>
      <a className="rounded-2xl border border-emerald-200/25 bg-emerald-300/12 px-4 py-3 text-sm font-black text-white hover:bg-emerald-300/20" href={YOUNGSTOWN_ALMANAC_PLANTING_URL} target="_blank" rel="noreferrer">
        44505 Planting Calendar ↗
      </a>
      <a className="rounded-2xl border border-emerald-200/25 bg-emerald-300/12 px-4 py-3 text-sm font-black text-white hover:bg-emerald-300/20" href={ALMANAC_GROWING_GUIDES_URL} target="_blank" rel="noreferrer">
        Almanac Growing Guides ↗
      </a>
    </div>
  );
}

function FarmConditionsCard({ compact = false }: { compact?: boolean }) {
  const farmStatus = getFarmStatus();
  const [liveWeather, setLiveWeather] = useState<LiveFarmWeather | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadLiveWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${FARM_LATITUDE}&longitude=${FARM_LONGITUDE}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m&daily=sunrise,sunset,uv_index_max,precipitation_probability_max,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=${encodeURIComponent(FARM_TIME_ZONE)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Weather service returned ${response.status}`);
        const data = await response.json();
        if (cancelled) return;
        setLiveWeather({
          temperature: data.current?.temperature_2m,
          apparent: data.current?.apparent_temperature,
          humidity: data.current?.relative_humidity_2m,
          wind: data.current?.wind_speed_10m,
          precipitation: data.current?.precipitation ?? data.current?.rain,
          rainChance: data.daily?.precipitation_probability_max?.[0],
          sunrise: data.daily?.sunrise?.[0],
          sunset: data.daily?.sunset?.[0],
          uv: data.daily?.uv_index_max?.[0],
          tomorrowHigh: data.daily?.temperature_2m_max?.[1],
          tomorrowLow: data.daily?.temperature_2m_min?.[1],
          weekHighs: data.daily?.temperature_2m_max,
          weekLows: data.daily?.temperature_2m_min,
          updated: data.current?.time,
        });
      } catch (error) {
        if (!cancelled) setLiveWeather({ error: "Live weather could not load" });
      }
    }
    loadLiveWeather();
    const timer = window.setInterval(loadLiveWeather, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const almanacCards = getTodayAlmanacCards(new Date(), farmStatus, liveWeather);
  const visibleCards = compact ? almanacCards.slice(0, 6) : almanacCards;
  const statusClass = farmStatus.color === "red" ? "border-red-200/40 bg-red-700/35" : farmStatus.color === "amber" ? "border-amber-200/35 bg-amber-300/14" : "border-emerald-200/30 bg-emerald-300/12";

  if (compact) {
    return (
      <div className="rounded-[1.25rem] border border-emerald-200/25 bg-emerald-300/12 p-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/75">🌤 LIVE Farm Conditions</div>
            <div className="mt-1 text-lg font-black">{farmStatus.level} • {formatLiveNumber(liveWeather?.temperature, "°F")}</div>
            <div className="mt-1 text-[11px] font-bold text-white/58">Updates every 15 minutes when online.</div>
          </div>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${statusClass}`}>{farmStatus.color === "red" ? "Stop / Review" : farmStatus.color === "amber" ? "Monitor" : "Full Day"}</span>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {visibleCards.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-2">
              <div className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-100/65">{label}</div>
              <div className="mt-1 text-xs font-bold leading-4 text-white/82">{value}</div>
            </div>
          ))}
        </div>
        <LiveAlmanacResourceLinks />
      </div>
    );
  }

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🌤 LIVE Farm Conditions</div>
      <h2 className="mt-3 text-2xl font-black">Live Weather + Work Status</h2>
      <p className="mt-3 text-sm leading-6 text-white/82">Live Youngstown weather appears here. The official Almanac opens through the Youngstown Almanac links; this screen does not replace the live Almanac with static guidance.</p>

      <div className={`mt-4 rounded-[1.35rem] border p-4 ${statusClass}`}>
        <div className="text-[11px] font-black uppercase tracking-[0.24em] text-white/72">{farmStatus.level}</div>
        <div className="mt-1 text-xl font-black">{farmStatus.title}</div>
        <div className="mt-2 text-sm font-bold leading-6 text-white/84">Action: {farmStatus.action}</div>
        <div className="mt-2 text-xs font-bold text-white/56">Live weather refreshes every 15 minutes. Last update: {liveWeather?.updated || "loading"}</div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {visibleCards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">{label}</div>
            <div className="mt-1 text-sm font-bold leading-5 text-white/82">{value}</div>
          </div>
        ))}
      </div>

      <LiveAlmanacResourceLinks />

      <div className="mt-4 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 text-sm font-bold leading-6 text-white/86">
        Live weather is pulled automatically. The official Youngstown Almanac forecast opens from the live Almanac link; it is not replaced with static text.
      </div>
    </Card>
  );
}

const youthTopicRotationAreas = [
  {
    title: "Regenerative Agriculture",
    week: "Week 2",
    description: "Soil health, planting, watering, crop care, companion planting, compost, and observation.",
    resources: ["Companion planting guide", "Soil health checklist", "Planting and watering basics", "Crop observation prompts"],
  },
  {
    title: "Infrastructure",
    week: "Week 3",
    description: "Fencing, water systems, shade, work zones, tools, site setup, and safety planning.",
    resources: ["Tool safety basics", "Site setup checklist", "Cooling station map", "Infrastructure vocabulary"],
  },
  {
    title: "Apiary & Pollination",
    week: "Rotation Week",
    description: "Pollinator awareness, habitat, bee observation safety, flowers, and food-system connections.",
    resources: ["Pollinator protection basics", "Bee observation safety", "Flower and habitat guide"],
  },
  {
    title: "Culinary & Nutrition",
    week: "Rotation Week",
    description: "Harvest handling, food safety awareness, produce-to-plate thinking, and nutrition connections.",
    resources: ["Harvest handling basics", "Food safety overview", "Produce-to-plate reflection"],
  },
  {
    title: "Guest Services & Tourism",
    week: "Rotation Week",
    description: "Welcoming guests, telling the farm story, customer service, tours, and respectful communication.",
    resources: ["Farm story talking points", "Welcoming guests", "Respectful communication"],
  },
  {
    title: "Media & Storytelling",
    week: "Rotation Week",
    description: "Documenting progress, before-and-after photos, consent reminders, and positive storytelling.",
    resources: ["Photo/video consent reminder", "Storytelling prompts", "Before-and-after documentation"],
  },
  {
    title: "Safety & Emergency Prep",
    week: "Every Week",
    description: "PPE, hydration, heat safety, nurse line visibility, site boundaries, and emergency readiness.",
    resources: ["PPE checklist", "Heat safety", "Nurse line reminder", "Emergency procedure card"],
  },
  {
    title: "Program Logistics",
    week: "Every Week",
    description: "Attendance, rotations, daily closeout, supervisor communication, and team accountability.",
    resources: ["Attendance expectations", "Team rotation overview", "Daily closeout checklist"],
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

type MediaAsset = {
  id: string;
  title: string;
  category: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by?: string;
  storage_path?: string;
  created_at: string;
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
    language: "Language", portal: "Portal", demo: "Demo", guest: "Guest", register: "Register", workspace: "My Day", youth: "Youth", supervisor: "Supervisor", parent: "Parent", grower: "Grower", partner: "Partner", support: "Support", valueAdded: "Value-Added", market: "Market", wellness: "Wellness", reports: "Reports", ops: "Ops", feedback: "Feedback", complete: "Complete", publicGuest: "Public / Guest", signOut: "Sign Out", onlineEcosystem: "Online Ecosystem", events: "Events", media: "Media", project: "6/8 Project"
  },
  es: {
    language: "Idioma", portal: "Portal", demo: "Demo", guest: "Visitante", register: "Registro", workspace: "Mi Día", youth: "Jóvenes", supervisor: "Supervisor", parent: "Padres", grower: "Productor", partner: "Aliado", support: "Apoyar", valueAdded: "Valor agregado", market: "Mercado", wellness: "Bienestar", reports: "Reportes", ops: "Operaciones", feedback: "Comentarios", complete: "Completar", publicGuest: "Público / Visitante", signOut: "Salir", onlineEcosystem: "Ecosistema en línea"
  },
  tl: {
    language: "Wika", portal: "Portal", demo: "Demo", guest: "Bisita", register: "Magrehistro", workspace: "Aking Araw", youth: "Kabataan", supervisor: "Supervisor", parent: "Magulang", grower: "Magtatanim", partner: "Katuwang", support: "Suporta", valueAdded: "Value-Added", market: "Merkado", wellness: "Kalusugan", reports: "Ulat", ops: "Operasyon", feedback: "Komento", complete: "Kumpleto", publicGuest: "Publiko / Bisita", signOut: "Mag-sign Out", onlineEcosystem: "Online Ecosystem"
  },
  it: {
    language: "Lingua", portal: "Portale", demo: "Demo", guest: "Ospite", register: "Registrati", workspace: "La Mia Giornata", youth: "Giovani", supervisor: "Supervisore", parent: "Genitori", grower: "Coltivatore", partner: "Partner", support: "Sostieni", valueAdded: "Valore aggiunto", market: "Mercato", wellness: "Benessere", reports: "Report", ops: "Operazioni", feedback: "Feedback", complete: "Completa", publicGuest: "Pubblico / Ospite", signOut: "Esci", onlineEcosystem: "Ecosistema online"
  },
  he: {
    language: "שפה", portal: "שער", demo: "הדגמה", guest: "אורח", register: "הרשמה", workspace: "היום שלי", youth: "נוער", supervisor: "מדריך", parent: "הורה", grower: "מגדל", partner: "שותף", support: "תמיכה", valueAdded: "מוצרי ערך מוסף", market: "שוק", wellness: "רווחה", reports: "דוחות", ops: "תפעול", feedback: "משוב", complete: "סיום", publicGuest: "ציבור / אורח", signOut: "יציאה", onlineEcosystem: "אקוסיסטם מקוון"
  },
  fr: {
    language: "Langue", portal: "Portail", demo: "Démo", guest: "Invité", register: "S'inscrire", workspace: "Ma Journée", youth: "Jeunes", supervisor: "Superviseur", parent: "Parent", grower: "Producteur", partner: "Partenaire", support: "Soutenir", valueAdded: "Valeur ajoutée", market: "Marché", wellness: "Bien-être", reports: "Rapports", ops: "Opérations", feedback: "Commentaires", complete: "Terminer", publicGuest: "Public / Invité", signOut: "Déconnexion", onlineEcosystem: "Écosystème en ligne"
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
    "My Day": "Mi espacio",
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
    "Cultivator Reflection": "Reflexión de fin de día",
    "Registration Center": "Centro de registro",
    "Create the profile once. Reuse it everywhere.": "Cree el perfil una vez. Reutilícelo en todo el ecosistema.",
    "Save Registration": "Guardar registro",
    "Go to My Day": "Ir a mi espacio",
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
    "My Day": "Aking Araw",
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
    "Cultivator Reflection": "Reflection sa Pagtatapos ng Araw",
    "Registration Center": "Registration Center",
    "Create the profile once. Reuse it everywhere.": "Gumawa ng profile nang isang beses. Gamitin ito saanman.",
    "Save Registration": "I-save ang Registration",
    "Go to My Day": "Pumunta sa Aking Araw",
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
    "My Day": "Il mio spazio",
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
    "My Day": "המרחב שלי",
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
    "My Day": "Mon espace",
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



const commonWordTranslations: Partial<Record<LanguageCode, Record<string, string>>> = {
  es: {
    "Youth Workforce": "Fuerza Laboral Juvenil", "Youth": "Jóvenes", "Parent / Guardian": "Padre / Tutor", "Parent": "Padres", "Supervisor": "Supervisor", "Case Manager": "Administrador de Casos", "Mission Control": "Centro de Control", "Marketplace": "Mercado", "Portfolio": "Portafolio", "Resume": "Currículum", "Achievement": "Logro", "Achievements": "Logros", "Career Pathways": "Rutas Profesionales", "Support": "Apoyo", "Wellness": "Bienestar", "Attendance": "Asistencia", "Safety": "Seguridad", "PPE": "PPE", "Teamwork": "Trabajo en Equipo", "Communication": "Comunicación", "Problem Solving": "Resolución de Problemas", "Responsibility": "Responsabilidad", "Leadership": "Liderazgo", "Reflection": "Reflexión", "Check In": "Registrarse", "Check-in": "Registro", "Project": "Proyecto", "Team": "Equipo", "Skills": "Habilidades", "Badge": "Insignia", "Badges": "Insignias", "Growth": "Crecimiento", "Workforce": "Fuerza Laboral", "Development": "Desarrollo", "Family": "Familia", "Guardian": "Tutor", "Concern": "Preocupación", "Emergency": "Emergencia", "Referral": "Referencia", "Incident": "Incidente", "Report": "Informe", "Reports": "Informes", "Cooling Station": "Estación de Enfriamiento", "Challenge": "Reto", "Design": "Diseño", "Engineering": "Ingeniería", "Manufacturing": "Fabricación", "Logistics": "Logística", "Contractor": "Contratista", "Customer": "Cliente", "Grower": "Productor", "Partner": "Aliado", "Volunteer": "Voluntario", "Guest": "Visitante", "Launch": "Lanzamiento", "Today": "Hoy", "Week": "Semana"
  },
  tl: {
    "Youth Workforce": "Youth Workforce", "Youth": "Kabataan", "Parent / Guardian": "Magulang / Guardian", "Parent": "Magulang", "Supervisor": "Supervisor", "Case Manager": "Case Manager", "Mission Control": "Mission Control", "Marketplace": "Merkado", "Portfolio": "Portfolio", "Resume": "Resume", "Achievement": "Nakamit", "Achievements": "Mga Nakamit", "Career Pathways": "Career Pathways", "Support": "Suporta", "Wellness": "Kalusugan", "Attendance": "Attendance", "Safety": "Kaligtasan", "PPE": "PPE", "Teamwork": "Pagtutulungan", "Communication": "Komunikasyon", "Problem Solving": "Paglutas ng Problema", "Responsibility": "Responsibilidad", "Leadership": "Pamumuno", "Reflection": "Reflection", "Check In": "Check In", "Check-in": "Check-in", "Project": "Proyekto", "Team": "Team", "Skills": "Skills", "Badge": "Badge", "Badges": "Badges", "Growth": "Paglago", "Workforce": "Workforce", "Development": "Development", "Family": "Pamilya", "Guardian": "Guardian", "Concern": "Concern", "Emergency": "Emergency", "Referral": "Referral", "Incident": "Incident", "Report": "Ulat", "Reports": "Mga Ulat", "Cooling Station": "Cooling Station", "Challenge": "Challenge", "Design": "Design", "Engineering": "Engineering", "Manufacturing": "Manufacturing", "Logistics": "Logistics", "Contractor": "Contractor", "Customer": "Customer", "Grower": "Grower", "Partner": "Partner", "Volunteer": "Volunteer", "Guest": "Bisita", "Launch": "Launch", "Today": "Ngayon", "Week": "Linggo"
  },
  it: {
    "Youth Workforce": "Forza Lavoro Giovanile", "Youth": "Giovani", "Parent / Guardian": "Genitore / Tutore", "Parent": "Genitori", "Supervisor": "Supervisore", "Case Manager": "Case Manager", "Mission Control": "Centro di Controllo", "Marketplace": "Mercato", "Portfolio": "Portfolio", "Resume": "Curriculum", "Achievement": "Risultato", "Achievements": "Risultati", "Career Pathways": "Percorsi di Carriera", "Support": "Supporto", "Wellness": "Benessere", "Attendance": "Presenze", "Safety": "Sicurezza", "PPE": "DPI", "Teamwork": "Lavoro di Squadra", "Communication": "Comunicazione", "Problem Solving": "Risoluzione dei Problemi", "Responsibility": "Responsabilità", "Leadership": "Leadership", "Reflection": "Riflessione", "Check In": "Check-in", "Check-in": "Check-in", "Project": "Progetto", "Team": "Team", "Skills": "Competenze", "Badge": "Badge", "Badges": "Badge", "Growth": "Crescita", "Workforce": "Forza Lavoro", "Development": "Sviluppo", "Family": "Famiglia", "Guardian": "Tutore", "Concern": "Preoccupazione", "Emergency": "Emergenza", "Referral": "Invio", "Incident": "Incidente", "Report": "Rapporto", "Reports": "Rapporti", "Cooling Station": "Stazione di Raffreddamento", "Challenge": "Sfida", "Design": "Design", "Engineering": "Ingegneria", "Manufacturing": "Produzione", "Logistics": "Logistica", "Contractor": "Appaltatore", "Customer": "Cliente", "Grower": "Coltivatore", "Partner": "Partner", "Volunteer": "Volontario", "Guest": "Ospite", "Launch": "Lancio", "Today": "Oggi", "Week": "Settimana"
  },
  he: {
    "Youth Workforce": "כוח עבודה לנוער", "Youth": "נוער", "Parent / Guardian": "הורה / אפוטרופוס", "Parent": "הורה", "Supervisor": "מפקח", "Case Manager": "מנהל מקרה", "Mission Control": "מרכז בקרה", "Marketplace": "שוק", "Portfolio": "תיק עבודות", "Resume": "קורות חיים", "Achievement": "הישג", "Achievements": "הישגים", "Career Pathways": "מסלולי קריירה", "Support": "תמיכה", "Wellness": "רווחה", "Attendance": "נוכחות", "Safety": "בטיחות", "PPE": "ציוד מגן", "Teamwork": "עבודת צוות", "Communication": "תקשורת", "Problem Solving": "פתרון בעיות", "Responsibility": "אחריות", "Leadership": "מנהיגות", "Reflection": "רפלקציה", "Check In": "צ׳ק-אין", "Check-in": "צ׳ק-אין", "Project": "פרויקט", "Team": "צוות", "Skills": "כישורים", "Badge": "תג", "Badges": "תגים", "Growth": "צמיחה", "Workforce": "כוח עבודה", "Development": "פיתוח", "Family": "משפחה", "Guardian": "אפוטרופוס", "Concern": "דאגה", "Emergency": "חירום", "Referral": "הפניה", "Incident": "אירוע", "Report": "דוח", "Reports": "דוחות", "Cooling Station": "תחנת קירור", "Challenge": "אתגר", "Design": "עיצוב", "Engineering": "הנדסה", "Manufacturing": "ייצור", "Logistics": "לוגיסטיקה", "Contractor": "קבלן", "Customer": "לקוח", "Grower": "מגדל", "Partner": "שותף", "Volunteer": "מתנדב", "Guest": "אורח", "Launch": "השקה", "Today": "היום", "Week": "שבוע"
  },
  fr: {
    "Youth Workforce": "Jeunesse au Travail", "Youth": "Jeunes", "Parent / Guardian": "Parent / Tuteur", "Parent": "Parent", "Supervisor": "Superviseur", "Case Manager": "Gestionnaire de cas", "Mission Control": "Centre de Mission", "Marketplace": "Marché", "Portfolio": "Portfolio", "Resume": "CV", "Achievement": "Réussite", "Achievements": "Réussites", "Career Pathways": "Parcours Professionnels", "Support": "Soutien", "Wellness": "Bien-être", "Attendance": "Présence", "Safety": "Sécurité", "PPE": "EPI", "Teamwork": "Travail d'Équipe", "Communication": "Communication", "Problem Solving": "Résolution de Problèmes", "Responsibility": "Responsabilité", "Leadership": "Leadership", "Reflection": "Réflexion", "Check In": "Check-in", "Check-in": "Check-in", "Project": "Projet", "Team": "Équipe", "Skills": "Compétences", "Badge": "Badge", "Badges": "Badges", "Growth": "Croissance", "Workforce": "Main-d’œuvre", "Development": "Développement", "Family": "Famille", "Guardian": "Tuteur", "Concern": "Préoccupation", "Emergency": "Urgence", "Referral": "Orientation", "Incident": "Incident", "Report": "Rapport", "Reports": "Rapports", "Cooling Station": "Station de Refroidissement", "Challenge": "Défi", "Design": "Conception", "Engineering": "Ingénierie", "Manufacturing": "Fabrication", "Logistics": "Logistique", "Contractor": "Entrepreneur", "Customer": "Client", "Grower": "Producteur", "Partner": "Partenaire", "Volunteer": "Bénévole", "Guest": "Invité", "Launch": "Lancement", "Today": "Aujourd’hui", "Week": "Semaine"
  }
};

function applyCommonTranslations(language: LanguageCode, phrase: string) {
  if (language === "en") return phrase;
  const replacements = commonWordTranslations[language] || {};
  let output = phrase;
  Object.entries(replacements)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([english, translated]) => {
      output = output.replaceAll(english, translated);
    });
  return output;
}

function translatePhrase(language: LanguageCode, raw: string) {
  if (language === "en") return raw;
  const key = raw.trim();
  const exact =
    launchIntegrationTranslations[language]?.[key] ||
    launchCriticalTranslations[language]?.[key] ||
    launchPhraseTranslations[language]?.[key] ||
    screenTranslations[language]?.[key] ||
    languageText[language]?.[key];
  if (exact) return exact;
  return applyCommonTranslations(language, key);
}

function applyScreenTranslations(language: LanguageCode) {
  if (typeof document === "undefined") return;
  const root = document.querySelector("[data-bff-app-root]") || document.body;
  const skip = new Set(["SCRIPT", "STYLE", "INPUT", "TEXTAREA", "SELECT", "OPTION"]);
  root.setAttribute("data-bff-language", language);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      const text = node.textContent || "";
      if (!parent || skip.has(parent.tagName) || !text.trim()) return NodeFilter.FILTER_REJECT;
      if (!/[A-Za-z]/.test(text) && !parent.getAttribute("data-bff-original-text")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  nodes.forEach((node) => {
    const el = node.parentElement;
    if (!el) return;
    const current = node.textContent || "";
    const trimmed = current.trim();
    if (!trimmed) return;
    const original = el.getAttribute("data-bff-original-text") || trimmed;
    if (!el.getAttribute("data-bff-original-text") && /[A-Za-z]/.test(trimmed)) {
      el.setAttribute("data-bff-original-text", original);
    }
    const translated = translatePhrase(language, original);
    node.textContent = current.replace(trimmed, translated);
  });

  root.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((node) => {
    const el = node as HTMLInputElement | HTMLTextAreaElement;
    const original = el.getAttribute("data-bff-original-placeholder") || el.getAttribute("placeholder") || "";
    if (!el.getAttribute("data-bff-original-placeholder")) el.setAttribute("data-bff-original-placeholder", original);
    el.setAttribute("placeholder", translatePhrase(language, original));
  });

  root.querySelectorAll("[title]").forEach((node) => {
    const el = node as HTMLElement;
    const original = el.getAttribute("data-bff-original-title") || el.getAttribute("title") || "";
    if (!el.getAttribute("data-bff-original-title")) el.setAttribute("data-bff-original-title", original);
    el.setAttribute("title", translatePhrase(language, original));
  });
}

let activeTranslationRun = 0;

function startTranslationObserver(language: LanguageCode) {
  if (typeof document === "undefined") return () => undefined;
  const runId = ++activeTranslationRun;
  const root = document.querySelector("[data-bff-app-root]") || document.body;
  let scheduled = false;
  let scheduledTimer: number | undefined;
  const run = () => {
    scheduled = false;
    if (runId !== activeTranslationRun) return;
    const currentLanguage = document.querySelector("[data-bff-app-root]")?.getAttribute("data-current-language");
    if (currentLanguage && currentLanguage !== language) return;
    applyScreenTranslations(language);
  };
  const schedule = () => {
    if (scheduled || runId !== activeTranslationRun) return;
    scheduled = true;
    scheduledTimer = window.setTimeout(run, 0);
  };
  run();
  const observer = new MutationObserver(schedule);
  observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "title"] });
  const retryTimers = [50, 150, 350, 750].map((ms) => window.setTimeout(run, ms));
  return () => {
    activeTranslationRun++;
    observer.disconnect();
    if (scheduledTimer !== undefined) window.clearTimeout(scheduledTimer);
    retryTimers.forEach((timer) => window.clearTimeout(timer));
  };
}


const launchIntegrationTranslations: Partial<Record<LanguageCode, Record<string, string>>> = {
  es: {
    'Forest Gate Portal': 'Portal Puerta del Bosque',
    'Enter the Living Ecosystem': 'Entrar al Ecosistema Vivo',
    'Bronson Family Farm connects food, families, youth workforce development, growers, marketplace, and community opportunity.': 'Bronson Family Farm conecta alimentos, familias, desarrollo laboral juvenil, productores, mercado y oportunidades comunitarias.',
    'Start Guided Portal': 'Iniciar portal guiado',
    'New visitors can enter through the story, ecosystem overview, and guided experience.': 'Los nuevos visitantes pueden entrar por la historia, la vista general del ecosistema y la experiencia guiada.',
    'Enter Ecosystem': 'Entrar al ecosistema',
    'Browse public pathways without registering: guest story, events, marketplace, and opportunities.': 'Explore rutas públicas sin registrarse: historia para visitantes, eventos, mercado y oportunidades.',
    'Sign In / Returning Participant': 'Ingresar / Participante que regresa',
    'Continue as': 'Continuar como',
    'Registered youth, parents, supervisors, growers, and partners continue from their assigned workspace.': 'Jóvenes, padres, supervisores, productores y aliados registrados continúan desde su espacio asignado.',
    'Marketplace': 'Mercado',
    'Browse food, products, events, grower opportunities, and GrownBy-connected purchasing.': 'Explore alimentos, productos, eventos, oportunidades para productores y compras conectadas con GrownBy.',
    'Launch Candidate 3.0': 'Candidato de lanzamiento 3.0',
    'New visitors enter the story. Returning users go straight to work.': 'Los nuevos visitantes entran en la historia. Los usuarios que regresan van directo al trabajo.',
    'Public visitors can explore the portal, story, events, and marketplace without registering.': 'Los visitantes públicos pueden explorar el portal, la historia, los eventos y el mercado sin registrarse.',
    'Nesco youth participants should already be in the system. They verify information instead of re-registering.': 'Los jóvenes participantes de Nesco ya deben estar en el sistema. Verifican su información en lugar de registrarse nuevamente.',
    'No phone required: youth can enter with Participant ID plus last name or supervisor lookup.': 'No se requiere teléfono: los jóvenes pueden entrar con ID de participante más apellido o búsqueda del supervisor.',
    'Daily Rhythm': 'Ritmo diario',
    'Today → Progress → Tomorrow': 'Hoy → Progreso → Mañana',
    'Today: team, project, supervisor, location, start time.': 'Hoy: equipo, proyecto, supervisor, ubicación y hora de inicio.',
    'Progress: attendance, safety, achievements, contribution.': 'Progreso: asistencia, seguridad, logros y contribución.',
    'Tomorrow: assignment, PPE reminder, water bottle, next step.': 'Mañana: asignación, recordatorio de PPE, botella de agua y próximo paso.',
    'Choose Role': 'Elegir rol',
    'Go to My Day': 'Ir a mi espacio',
    "Case Manager": "Administrador de Casos", "My Portfolio": "Mi Portafolio", "Resume Builder": "Constructor de Currículum", "Resume and Portfolio Growth": "Crecimiento de Currículum y Portafolio", "Youth Support Response Framework": "Marco de Respuesta de Apoyo Juvenil", "Whole-person youth support.": "Apoyo integral para jóvenes.", "Marketplace Listing": "Listado del Mercado", "Words-only launch card. Product images are intentionally hidden until verified images match each item.": "Tarjeta de lanzamiento solo con texto. Las imágenes de productos están ocultas intencionalmente hasta verificar que coincidan con cada artículo.", "Proprietary & Confidential": "Propietario y Confidencial"
  },
  tl: {
    'Forest Gate Portal': 'Forest Gate Portal',
    'Enter the Living Ecosystem': 'Pumasok sa Buhay na Ecosystem',
    'Bronson Family Farm connects food, families, youth workforce development, growers, marketplace, and community opportunity.': 'Bronson Family Farm conecta alimentos, familias, desarrollo laboral juvenil, productores, mercado y oportunidades comunitarias.',
    'Start Guided Portal': 'Simulan ang Guided Portal',
    'New visitors can enter through the story, ecosystem overview, and guided experience.': 'Los nuevos visitantes pueden entrar por la historia, la vista general del ecosistema y la experiencia guiada.',
    'Enter Ecosystem': 'Pumasok sa Ecosystem',
    'Browse public pathways without registering: guest story, events, marketplace, and opportunities.': 'Explore rutas públicas sin registrarse: historia para visitantes, eventos, mercado y oportunidades.',
    'Sign In / Returning Participant': 'Ingresar / Participante que regresa',
    'Continue as': 'Continuar como',
    'Registered youth, parents, supervisors, growers, and partners continue from their assigned workspace.': 'Jóvenes, padres, supervisores, productores y aliados registrados continúan desde su espacio asignado.',
    'Marketplace': 'Marketplace',
    'Browse food, products, events, grower opportunities, and GrownBy-connected purchasing.': 'Explore alimentos, productos, eventos, oportunidades para productores y compras conectadas con GrownBy.',
    'Launch Candidate 3.0': 'Launch Candidate 3.0',
    'New visitors enter the story. Returning users go straight to work.': 'Los nuevos visitantes entran en la historia. Los usuarios que regresan van directo al trabajo.',
    'Public visitors can explore the portal, story, events, and marketplace without registering.': 'Los visitantes públicos pueden explorar el portal, la historia, los eventos y el mercado sin registrarse.',
    'Nesco youth participants should already be in the system. They verify information instead of re-registering.': 'Los jóvenes participantes de Nesco ya deben estar en el sistema. Verifican su información en lugar de registrarse nuevamente.',
    'No phone required: youth can enter with Participant ID plus last name or supervisor lookup.': 'No se requiere teléfono: los jóvenes pueden entrar con ID de participante más apellido o búsqueda del supervisor.',
    'Daily Rhythm': 'Daily Rhythm',
    'Today → Progress → Tomorrow': 'Hoy → Progreso → Mañana',
    'Today: team, project, supervisor, location, start time.': 'Hoy: equipo, proyecto, supervisor, ubicación y hora de inicio.',
    'Progress: attendance, safety, achievements, contribution.': 'Progreso: asistencia, seguridad, logros y contribución.',
    'Tomorrow: assignment, PPE reminder, water bottle, next step.': 'Mañana: asignación, recordatorio de PPE, botella de agua y próximo paso.',
    'Choose Role': 'Pumili ng Role',
    'Go to My Day': 'Pumunta sa Aking Araw',
    "Case Manager": "Case Manager", "My Portfolio": "Aking Portfolio", "Resume Builder": "Resume Builder", "Resume and Portfolio Growth": "Paglago ng Resume at Portfolio", "Youth Support Response Framework": "Framework ng Suporta sa Kabataan", "Whole-person youth support.": "Suporta para sa buong pangangailangan ng kabataan.", "Marketplace Listing": "Marketplace Listing", "Words-only launch card. Product images are intentionally hidden until verified images match each item.": "Text-only launch card. Nakatago muna ang product images hanggang verified na tumutugma sa bawat item.", "Proprietary & Confidential": "Proprietary at Confidential"
  },
  it: {
    'Forest Gate Portal': 'Portale del Cancello Forestale',
    'Enter the Living Ecosystem': 'Entra nell’ecosistema vivente',
    'Bronson Family Farm connects food, families, youth workforce development, growers, marketplace, and community opportunity.': 'Bronson Family Farm conecta alimentos, familias, desarrollo laboral juvenil, productores, mercado y oportunidades comunitarias.',
    'Start Guided Portal': 'Avvia portale guidato',
    'New visitors can enter through the story, ecosystem overview, and guided experience.': 'Los nuevos visitantes pueden entrar por la historia, la vista general del ecosistema y la experiencia guiada.',
    'Enter Ecosystem': 'Entra nell’ecosistema',
    'Browse public pathways without registering: guest story, events, marketplace, and opportunities.': 'Explore rutas públicas sin registrarse: historia para visitantes, eventos, mercado y oportunidades.',
    'Sign In / Returning Participant': 'Ingresar / Participante que regresa',
    'Continue as': 'Continuar como',
    'Registered youth, parents, supervisors, growers, and partners continue from their assigned workspace.': 'Jóvenes, padres, supervisores, productores y aliados registrados continúan desde su espacio asignado.',
    'Marketplace': 'Mercato',
    'Browse food, products, events, grower opportunities, and GrownBy-connected purchasing.': 'Explore alimentos, productos, eventos, oportunidades para productores y compras conectadas con GrownBy.',
    'Launch Candidate 3.0': 'Candidato di lancio 3.0',
    'New visitors enter the story. Returning users go straight to work.': 'Los nuevos visitantes entran en la historia. Los usuarios que regresan van directo al trabajo.',
    'Public visitors can explore the portal, story, events, and marketplace without registering.': 'Los visitantes públicos pueden explorar el portal, la historia, los eventos y el mercado sin registrarse.',
    'Nesco youth participants should already be in the system. They verify information instead of re-registering.': 'Los jóvenes participantes de Nesco ya deben estar en el sistema. Verifican su información en lugar de registrarse nuevamente.',
    'No phone required: youth can enter with Participant ID plus last name or supervisor lookup.': 'No se requiere teléfono: los jóvenes pueden entrar con ID de participante más apellido o búsqueda del supervisor.',
    'Daily Rhythm': 'Ritmo quotidiano',
    'Today → Progress → Tomorrow': 'Hoy → Progreso → Mañana',
    'Today: team, project, supervisor, location, start time.': 'Hoy: equipo, proyecto, supervisor, ubicación y hora de inicio.',
    'Progress: attendance, safety, achievements, contribution.': 'Progreso: asistencia, seguridad, logros y contribución.',
    'Tomorrow: assignment, PPE reminder, water bottle, next step.': 'Mañana: asignación, recordatorio de PPE, botella de agua y próximo paso.',
    'Choose Role': 'Scegli ruolo',
    'Go to My Day': 'Vai al mio spazio',
    "Case Manager": "Case Manager", "My Portfolio": "Il Mio Portfolio", "Resume Builder": "Creatore di Curriculum", "Resume and Portfolio Growth": "Crescita di Curriculum e Portfolio", "Youth Support Response Framework": "Quadro di Supporto per i Giovani", "Whole-person youth support.": "Supporto completo per i giovani.", "Marketplace Listing": "Annuncio del Mercato", "Words-only launch card. Product images are intentionally hidden until verified images match each item.": "Scheda di lancio solo testuale. Le immagini dei prodotti sono nascoste finché non saranno verificate.", "Proprietary & Confidential": "Riservato e Confidenziale"
  },
  he: {
    'Forest Gate Portal': 'שער היער',
    'Enter the Living Ecosystem': 'כניסה לאקוסיסטם החי',
    'Bronson Family Farm connects food, families, youth workforce development, growers, marketplace, and community opportunity.': 'Bronson Family Farm מחברת מזון, משפחות, פיתוח כוח עבודה לנוער, מגדלים, שוק והזדמנות קהילתית.',
    'Start Guided Portal': 'התחל שער מודרך',
    'New visitors can enter through the story, ecosystem overview, and guided experience.': 'מבקרים חדשים יכולים להיכנס דרך הסיפור, סקירת האקוסיסטם והחוויה המודרכת.',
    'Enter Ecosystem': 'כניסה לאקוסיסטם',
    'Browse public pathways without registering: guest story, events, marketplace, and opportunities.': 'עיינו במסלולים ציבוריים ללא הרשמה: סיפור אורחים, אירועים, שוק והזדמנויות.',
    'Sign In / Returning Participant': 'כניסה / משתתף חוזר',
    'Continue as': 'המשך בתור',
    'Registered youth, parents, supervisors, growers, and partners continue from their assigned workspace.': 'נוער, הורים, מדריכים, מגדלים ושותפים רשומים ממשיכים מהמרחב שהוקצה להם.',
    'Marketplace': 'שוק',
    'Browse food, products, events, grower opportunities, and GrownBy-connected purchasing.': 'עיינו במזון, מוצרים, אירועים, הזדמנויות למגדלים ורכישה דרך GrownBy.',
    'Launch Candidate 3.0': 'מועמד השקה 3.0',
    'New visitors enter the story. Returning users go straight to work.': 'מבקרים חדשים נכנסים לסיפור. משתמשים חוזרים ניגשים ישר לעבודה.',
    'Public visitors can explore the portal, story, events, and marketplace without registering.': 'מבקרים ציבוריים יכולים לחקור את השער, הסיפור, האירועים והשוק ללא הרשמה.',
    'Nesco youth participants should already be in the system. They verify information instead of re-registering.': 'משתתפי הנוער של Nesco אמורים כבר להיות במערכת. הם מאמתים מידע במקום להירשם מחדש.',
    'No phone required: youth can enter with Participant ID plus last name or supervisor lookup.': 'אין צורך בטלפון: בני נוער יכולים להיכנס עם מזהה משתתף ושם משפחה או באמצעות חיפוש מדריך.',
    'Daily Rhythm': 'קצב יומי',
    'Today → Progress → Tomorrow': 'היום → התקדמות → מחר',
    'Today: team, project, supervisor, location, start time.': 'היום: צוות, פרויקט, מדריך, מיקום ושעת התחלה.',
    'Progress: attendance, safety, achievements, contribution.': 'התקדמות: נוכחות, בטיחות, הישגים ותרומה.',
    'Tomorrow: assignment, PPE reminder, water bottle, next step.': 'מחר: משימה, תזכורת ציוד מגן, בקבוק מים והצעד הבא.',
    'Choose Role': 'בחר תפקיד',
    'Go to My Day': 'עבור למרחב העבודה',
    "Case Manager": "מנהל מקרה", "My Portfolio": "התיק שלי", "Resume Builder": "בונה קורות חיים", "Resume and Portfolio Growth": "צמיחת קורות חיים ותיק עבודות", "Youth Support Response Framework": "מסגרת תמיכה לנוער", "Whole-person youth support.": "תמיכה כוללת לנוער.", "Marketplace Listing": "רישום בשוק", "Words-only launch card. Product images are intentionally hidden until verified images match each item.": "כרטיס השקה עם מילים בלבד. תמונות מוצר מוסתרות עד לאימות התאמה.", "Proprietary & Confidential": "קנייני וסודי"
  },
  fr: {
    'Forest Gate Portal': 'Portail de la Forêt',
    'Enter the Living Ecosystem': 'Entrer dans l’écosystème vivant',
    'Bronson Family Farm connects food, families, youth workforce development, growers, marketplace, and community opportunity.': 'Bronson Family Farm conecta alimentos, familias, desarrollo laboral juvenil, productores, mercado y oportunidades comunitarias.',
    'Start Guided Portal': 'Démarrer le portail guidé',
    'New visitors can enter through the story, ecosystem overview, and guided experience.': 'Los nuevos visitantes pueden entrar por la historia, la vista general del ecosistema y la experiencia guiada.',
    'Enter Ecosystem': 'Entrer dans l’écosystème',
    'Browse public pathways without registering: guest story, events, marketplace, and opportunities.': 'Explore rutas públicas sin registrarse: historia para visitantes, eventos, mercado y oportunidades.',
    'Sign In / Returning Participant': 'Ingresar / Participante que regresa',
    'Continue as': 'Continuar como',
    'Registered youth, parents, supervisors, growers, and partners continue from their assigned workspace.': 'Jóvenes, padres, supervisores, productores y aliados registrados continúan desde su espacio asignado.',
    'Marketplace': 'Marché',
    'Browse food, products, events, grower opportunities, and GrownBy-connected purchasing.': 'Explore alimentos, productos, eventos, oportunidades para productores y compras conectadas con GrownBy.',
    'Launch Candidate 3.0': 'Candidat de lancement 3.0',
    'New visitors enter the story. Returning users go straight to work.': 'Los nuevos visitantes entran en la historia. Los usuarios que regresan van directo al trabajo.',
    'Public visitors can explore the portal, story, events, and marketplace without registering.': 'Los visitantes públicos pueden explorar el portal, la historia, los eventos y el mercado sin registrarse.',
    'Nesco youth participants should already be in the system. They verify information instead of re-registering.': 'Los jóvenes participantes de Nesco ya deben estar en el sistema. Verifican su información en lugar de registrarse nuevamente.',
    'No phone required: youth can enter with Participant ID plus last name or supervisor lookup.': 'No se requiere teléfono: los jóvenes pueden entrar con ID de participante más apellido o búsqueda del supervisor.',
    'Daily Rhythm': 'Rythme quotidien',
    'Today → Progress → Tomorrow': 'Hoy → Progreso → Mañana',
    'Today: team, project, supervisor, location, start time.': 'Hoy: equipo, proyecto, supervisor, ubicación y hora de inicio.',
    'Progress: attendance, safety, achievements, contribution.': 'Progreso: asistencia, seguridad, logros y contribución.',
    'Tomorrow: assignment, PPE reminder, water bottle, next step.': 'Mañana: asignación, recordatorio de PPE, botella de agua y próximo paso.',
    'Choose Role': 'Choisir un rôle',
    'Go to My Day': 'Aller à mon espace',
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

function normalizeLaunchText(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeLaunchPin(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function mergeRowsById<T extends { id?: string; created_at?: string }>(localRows: T[], remoteRows: T[]) {
  const map = new Map<string, T>();
  [...localRows, ...remoteRows].forEach((row, index) => {
    const key = row.id || `row-${index}`;
    map.set(key, { ...(map.get(key) || {}), ...row });
  });
  return Array.from(map.values()).sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
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


type OperationsInventoryItem = {
  id: string;
  name: string;
  category: "Tools" | "Supplies" | "Technology" | "Safety" | "Water" | "Office" | "Cleaning";
  total: number;
  available: number;
  location: string;
  assigned_to?: string;
  status: "Ready" | "Checked Out" | "Low" | "Needs Replacement" | "Missing";
  notes?: string;
  managed_by: "Supervisor / Staff Lead" | "Administrator";
  youth_team_role?: "Logistics & Inventory Team";
  supervisor_approval_required: boolean;
  last_updated: string;
};

type OperationsInventoryLog = {
  id: string;
  item_id: string;
  item_name: string;
  action: "Checked Out" | "Returned" | "Count Adjusted" | "Needs Replacement" | "Marked Missing";
  quantity: number;
  person?: string;
  notes?: string;
  approved_by?: string;
  youth_lead?: string;
  team?: string;
  created_at: string;
};

const defaultOperationsInventory: OperationsInventoryItem[] = [
  { id: "tool-shovels", name: "Shovels", category: "Tools", total: 12, available: 12, location: "Tool area / trailer", status: "Ready", notes: "Count before youth arrive and again at end of day.", managed_by: "Supervisor / Staff Lead", youth_team_role: "Logistics & Inventory Team", supervisor_approval_required: true, last_updated: new Date().toISOString() },
  { id: "tool-rakes", name: "Rakes", category: "Tools", total: 12, available: 12, location: "Tool area / trailer", status: "Ready", notes: "Separate garden rakes from leaf rakes if needed.", managed_by: "Supervisor / Staff Lead", youth_team_role: "Logistics & Inventory Team", supervisor_approval_required: true, last_updated: new Date().toISOString() },
  { id: "water-pitchers", name: "Water pitchers", category: "Water", total: 8, available: 8, location: "Water station / shade station", status: "Ready", notes: "Use for hydration station and heat-safety support.", managed_by: "Supervisor / Staff Lead", youth_team_role: "Logistics & Inventory Team", supervisor_approval_required: true, last_updated: new Date().toISOString() },
  { id: "office-markers", name: "Markers", category: "Office", total: 24, available: 24, location: "Supervisor supply bin", status: "Ready", notes: "For name tags, team signs, fan design work, and daily boards.", managed_by: "Supervisor / Staff Lead", youth_team_role: "Logistics & Inventory Team", supervisor_approval_required: true, last_updated: new Date().toISOString() },
  { id: "office-scissors", name: "Scissors", category: "Office", total: 10, available: 10, location: "Supervisor supply bin", status: "Ready", notes: "Use for paper, cardboard, labels, and project preparation.", managed_by: "Supervisor / Staff Lead", youth_team_role: "Logistics & Inventory Team", supervisor_approval_required: true, last_updated: new Date().toISOString() },
  { id: "office-staplers", name: "Staplers", category: "Office", total: 4, available: 4, location: "Supervisor supply bin", status: "Ready", notes: "Include extra staples in same bin.", managed_by: "Supervisor / Staff Lead", youth_team_role: "Logistics & Inventory Team", supervisor_approval_required: true, last_updated: new Date().toISOString() },
  { id: "clean-garbage-bags", name: "Garbage bags", category: "Cleaning", total: 100, available: 100, location: "Cleanup / sanitation bin", status: "Ready", notes: "Track when boxes are opened so replacement can be purchased early.", managed_by: "Supervisor / Staff Lead", youth_team_role: "Logistics & Inventory Team", supervisor_approval_required: true, last_updated: new Date().toISOString() },
  { id: "tech-timeclock-laptops", name: "Laptops for TimeClock Wizard sign-in", category: "Technology", total: 3, available: 3, location: "Check-in table / supervisor control", status: "Ready", notes: "Charge nightly. Use for TimeClock Wizard sign-in and backup attendance support.", managed_by: "Supervisor / Staff Lead", youth_team_role: "Logistics & Inventory Team", supervisor_approval_required: true, last_updated: new Date().toISOString() },
];

function inventoryStatus(total: number, available: number): OperationsInventoryItem["status"] {
  if (available <= 0) return "Missing";
  if (available < total) return "Checked Out";
  if (available <= Math.max(1, Math.floor(total * 0.25))) return "Low";
  return "Full Day";
}

function screenLabel(screen: Screen) {
  const labels: Record<Screen, string> = {
    portal: "Portal / Forest Gate",
    demo: "Guided Demo",
    guest: "Guest Pathway",
    registration: "Registration",
    roles: "My Day / Choose Role",
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
    almanac: "Today’s Farm Almanac",
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

async function loadSupabaseRows<T extends { id?: string; created_at?: string }>(table: string, localKey: string) {
  const localRows = safeRead<T[]>(localKey, []);
  if (!supabase) return localRows;

  for (const candidate of supabaseTableCandidates(table)) {
    try {
      const { data, error } = await supabase.from(candidate).select("*").order("created_at", { ascending: false });
      if (!error && data) {
        // Launch fix: never let an empty or partial Supabase response erase local check-ins.
        const remoteRows = data as T[];
        const mergedRows = mergeRowsById(localRows, remoteRows);
        safeWrite(localKey, mergedRows);
        return mergedRows;
      }
      if (error) console.warn(`Could not load ${candidate}:`, error);
    } catch (error) {
      console.warn(`Could not load ${candidate}:`, error);
    }
  }
  return localRows;
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
    document.documentElement.dir = "ltr";
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    if (language === "en") {
      activeTranslationRun++;
      return () => undefined;
    }
    return startTranslationObserver(language);
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

  const signIn = (role: Role, name?: string, options?: Partial<EcosystemUser>) => {
    const user: EcosystemUser = {
      id: options?.id || uuid(),
      name: name?.trim() || options?.name || `${role} User`,
      role,
      accessLevel: roleAccess[role],
      status: "active",
      lastSeen: nowLabel(),
      participant_id: options?.participant_id,
      profile_id: options?.profile_id,
      needs_supervisor_verification: options?.needs_supervisor_verification,
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
      {screen === "portal" && <Portal setScreen={setScreen} activeUser={activeUser} language={language} />}
      {screen === "demo" && <GuidedDemo setScreen={setScreen} />}
      {screen === "guest" && <Guest setScreen={setScreen} />}
      {screen === "registration" && <Registration setScreen={setScreen} activeUser={activeUser} />}
      {screen === "roles" && <MyWorkspace signIn={signIn} activeUser={activeUser} setScreen={setScreen} language={language} />}
      {screen === "youth" && <YouthScreen setScreen={setScreen} activeUser={activeUser} language={language} />}
      {screen === "supervisor" && <SupervisorOperationsCenter setScreen={setScreen} activeUser={activeUser} language={language} />}
      {screen === "parent" && <ParentScreen setScreen={setScreen} language={language} />}
      {screen === "grower" && <GrowerJourney setScreen={setScreen} />}
      {screen === "partner" && <PartnerJourney setScreen={setScreen} />}
      {screen === "support" && <SupportJourney setScreen={setScreen} />}
      {screen === "caseManager" && <CaseManagerPortal setScreen={setScreen} />}
      {screen === "valueAdded" && <ValueAddedJourney setScreen={setScreen} />}
      {screen === "marketplace" && <MarketplaceOperations activeUser={activeUser} setScreen={setScreen} />}
      {screen === "wellness" && <WellnessScreen setScreen={setScreen} activeUser={activeUser} />}
      {screen === "reports" && <Reports setScreen={setScreen} language={language} />}
      {screen === "operations" && <Operations setScreen={setScreen} />}
      {screen === "almanac" && <FullAlmanacScreen setScreen={setScreen} activeUser={activeUser} />}
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
  const [showNurseLine, setShowNurseLine] = useState(false);
  const role = activeUser?.role;
  const workspaceTarget: Screen = role && role !== "Guest" ? routeForRole(role) : "roles";
  const isStaff = role === "Supervisor / Staff" || role === "Case Manager" || role === "Administrator" || role === "Board / Funder";

  const primaryNav: { label: string; screen: Screen }[] = role === "Youth Workforce Participant"
    ? [
        { label: "Calendar", screen: "events" },
        { label: "My Story", screen: "media" },
        { label: "My Growth", screen: "completion" },
      ]
    : role === "Supervisor / Staff" || role === "Administrator" || role === "Board / Funder"
    ? [
        { label: "Supervisor", screen: "supervisor" },
        { label: "Mission Control", screen: "reports" },
      ]
    : role === "Parent / Guardian"
    ? [
        { label: "Parent", screen: "parent" },
        { label: "Updates", screen: "feedback" },
      ]
    : role === "Grower"
    ? [
        { label: "Grower", screen: "grower" },
        { label: "Market", screen: "marketplace" },
      ]
    : role === "Partner"
    ? [
        { label: "Partner", screen: "partner" },
        { label: "Support", screen: "support" },
      ]
    : [
        { label: "Explore", screen: "guest" },
        { label: "Market", screen: "marketplace" },
      ];

  const buttonClass = (target: Screen) =>
    `rounded-full border px-4 py-2 text-xs font-black transition ${screen === target ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"}`;

  return (
    <div data-bff-app-root data-current-language={language} key={language} className="relative min-h-screen overflow-x-hidden bg-black text-white" lang={language} dir="ltr">
      <div className="fixed inset-0">
        <img src={IMG.forest} alt="Bronson Family Farm forest entrance" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = IMG.backup)} />
      </div>
      <div className="fixed inset-0 bg-black/25" />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.45),rgba(0,0,0,.12),rgba(0,0,0,.35)),radial-gradient(circle_at_top_left,rgba(52,211,153,.18),transparent_32%)]" />
      <div className="relative z-10 mx-auto max-w-[1280px] px-3 py-3 pb-8 md:px-6">
        <NurseLineBanner onOpen={() => setShowNurseLine(true)} />
        {showNurseLine && <NurseLineModal onClose={() => setShowNurseLine(false)} />}

        <div className="sticky top-[4.2rem] z-40 mb-3 rounded-[1.15rem] border border-white/10 bg-black/60 p-2 shadow-[0_18px_55px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={() => setScreen("portal")} className="min-w-[180px] flex-1 px-2 text-left">
              <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-100/70">Bronson Family Farm</div>
              <div className="truncate text-sm font-black leading-tight md:text-base">
                {screen === "portal" ? "🌲 Forest Gate Portal" : activeUser?.role === "Youth Workforce Participant" ? "🌱 Cultivator | Week 2" : activeUser ? `${activeUser.name} • ${activeUser.role}` : "Choose Your Path"}
              </div>
            </button>
            {screen !== "portal" && (
            <div className="flex shrink-0 items-center gap-2 overflow-x-auto">
              <button type="button" onClick={() => setScreen(activeUser?.role ? routeForRole(activeUser.role) : "portal")} className={buttonClass(activeUser?.role ? routeForRole(activeUser.role) : "portal")}>Home</button>
              <button type="button" onClick={() => setScreen(workspaceTarget)} className={buttonClass(workspaceTarget)}>{role && role !== "Guest" ? "My Day" : "Choose Role"}</button>
              <button type="button" onClick={() => setScreen("almanac")} className={buttonClass("almanac")}>📚 Resources</button>
              {primaryNav.map((item) => (
                <button type="button" key={`${item.label}-${item.screen}`} onClick={() => setScreen(item.screen)} className={buttonClass(item.screen)}>
                  {item.label}
                </button>
              ))}

            </div>
            )}

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

            {activeUser && <button type="button" onClick={signOut} className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-black text-white/80">Sign Out</button>}
          </div>
          {screen !== "portal" && (
          <details className="mt-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-white/72">
            <summary className="cursor-pointer font-black text-emerald-50">🧰 Quick Tools</summary>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setScreen("registration")} className={buttonClass("registration")}>Register</button>
              <button type="button" onClick={() => setScreen("almanac")} className={buttonClass("almanac")}>📚 Resources</button>
              <button type="button" onClick={() => setScreen("events")} className={buttonClass("events")}>📅 Calendar</button>
              <button type="button" onClick={() => setScreen("media")} className={buttonClass("media")}>Media</button>
              <button type="button" onClick={() => setScreen("feedback")} className={buttonClass("feedback")}>Feedback</button>
              {isStaff && <button type="button" onClick={() => setScreen("supervisor")} className={buttonClass("supervisor")}>Supervisor</button>}
              {isStaff && <button type="button" onClick={() => setScreen("operations")} className={buttonClass("operations")}>Operations</button>}
            </div>
          </details>
          )}
        </div>
        {children}
        <CompactProprietaryFooter />
      </div>
    </div>
  );
}


function NurseLineBanner({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="sticky top-0 z-[60] mb-3 rounded-[1rem] border border-red-200/35 bg-red-700/92 px-3 py-2 text-white shadow-[0_14px_45px_rgba(0,0,0,.38)] backdrop-blur-xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-red-50/85">Nurse Line • Visible At All Times</div>
          <div className="text-sm font-black leading-snug sm:text-base">Health, heat, injury, medication, or urgent support: tell your supervisor/site lead immediately.</div>
        </div>
        <button type="button" onClick={onOpen} className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-black text-red-700 sm:text-sm">Nurse Line</button>
      </div>
    </div>
  );
}

function NurseLineModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Nurse Line Contact Information">
      <div className="w-full max-w-md rounded-[2rem] border border-red-200/35 bg-[#1d1513] p-5 text-white shadow-[0_35px_110px_rgba(0,0,0,.7)]">
        <div className="text-[11px] font-black uppercase tracking-[0.24em] text-red-100/80">Nurse Line</div>
        <h2 className="mt-2 text-3xl font-black leading-tight">Registered Nurse Triage</h2>
        <p className="mt-3 text-sm font-bold leading-6 text-white/82">For health, heat-related illness, injury, medication questions, or urgent support.</p>

        <div className="mt-4 rounded-2xl border border-red-200/20 bg-red-700/30 p-4">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-red-100/80">Call</div>
          <a href="tel:18553896699" className="mt-1 block text-3xl font-black tracking-tight text-white">855-389-6699</a>
          <div className="mt-2 text-sm font-black text-white/82">Available 24/7/365</div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/82">
          <strong className="text-white">Youth:</strong> tell your supervisor or site lead immediately. The supervisor completes the injury report when documentation is required.
          <br />
          <strong className="text-white">Emergency:</strong> call 911 for life-threatening emergencies.
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a href="tel:18553896699" className="rounded-full bg-white px-5 py-3 text-sm font-black text-red-700">Call Nurse Line</a>
          <button type="button" onClick={onClose} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white">Close</button>
        </div>
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


function getFarmStatus() {
  return safeRead<FarmOperationStatus>(FARM_STATUS_KEY, defaultFarmStatus);
}

function getLaunchNotifications(audience?: EcosystemNotification["audience"]) {
  const rows = safeRead<EcosystemNotification[]>(NOTIFICATION_KEY, defaultNotifications);
  if (!audience) return rows;
  return rows.filter((item) => item.audience === audience || item.audience === "All");
}

function DailyOperationsCommandCenter({ setScreen, compact = false }: { setScreen: (screen: Screen) => void; compact?: boolean }) {
  const farmStatus = getFarmStatus();
  const notifications = getLaunchNotifications().slice(0, compact ? 3 : 4);
  const statusClass = farmStatus.color === "red" ? "border-red-200/40 bg-red-700/35" : farmStatus.color === "amber" ? "border-amber-200/35 bg-amber-300/14" : "border-emerald-200/30 bg-emerald-300/12";

  return (
    <Card className={compact ? "p-4" : ""}>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Safety • Almanac • Notifications</div>
      <h2 className="mt-3 text-3xl font-black">Bronson Daily Operating Status</h2>
      <div className={`mt-4 rounded-[1.35rem] border p-4 ${statusClass}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-white/72">{farmStatus.level}</div>
            <div className="mt-1 text-2xl font-black">{farmStatus.title}</div>
            <p className="mt-2 text-sm leading-6 text-white/84">{farmStatus.summary}</p>
          </div>
          <button type="button" onClick={() => setScreen("supervisor")} className="rounded-full border border-white/20 bg-black/28 px-4 py-2 text-sm font-black">Supervisor View</button>
        </div>
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm font-bold leading-6 text-white/86">Action: {farmStatus.action}</div>
      </div>

      {!compact && (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {getTodayAlmanacCards(new Date(), farmStatus).map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">{label}</div>
              <div className="mt-2 text-sm font-black leading-5">{value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 text-sm font-bold leading-6 text-white/86">
        <strong>{launchAlmanacSnapshot.label}:</strong> Live weather + official Almanac access.
        <div className="mt-2 text-xs font-semibold text-white/62">{launchAlmanacSnapshot.note}</div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {notifications.map((note) => (
          <div key={note.id} className="rounded-2xl border border-white/10 bg-black/28 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/72">{note.audience}</span>
              <span className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-2 py-1 text-[10px] font-black text-emerald-50">{note.priority}</span>
            </div>
            <div className="mt-2 text-lg font-black">{note.title}</div>
            <p className="mt-1 text-sm leading-6 text-white/76">{note.body}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EcosystemImageContextCard() {
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Where Today’s Work Fits</div>
      <h2 className="mt-3 text-3xl font-black">Connected Food Ecosystem</h2>
      <p className="mt-3 text-sm leading-7 text-white/82">Youth are not only completing tasks. Youth are contributing to a system where food, safety, customers, growers, partners, marketplace, families, and opportunity connect.</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_.9fr]">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35">
          <img src={IMG.ecosystem} alt="Connected Food Ecosystem map" className="h-full max-h-[420px] w-full object-contain p-3" onError={(event) => (event.currentTarget.src = IMG.forest)} />
        </div>
        <div className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/10 p-5">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-100/75">You Are Here</div>
          <div className="mt-2 text-2xl font-black">📍 Youth Workforce</div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-black">
            {["Farm Need", "Youth Workforce", "Project", "Customer", "Marketplace", "Community Impact"].map((item, index) => (
              <React.Fragment key={item}>
                <span className={item === "Youth Workforce" ? "rounded-full bg-emerald-300 px-3 py-2 text-black" : "rounded-full border border-white/10 bg-white/10 px-3 py-2 text-white"}>{item}</span>
                {index < 5 && <span className="text-emerald-100/70">→</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-white/82">This map keeps the ecosystem and entrepreneurship together: the work solves real farm needs, creates value, builds evidence, and prepares youth for future opportunity.</p>
        </div>
      </div>
    </Card>
  );
}

function ThreePartDailyRhythmCard({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const stages = [
    { title: "Beginning of Day", icon: "🌞", body: "Check in, read the Nurse Line, review weather, heat index, farm status, PPE, water, today’s assignment, and daily inspiration.", actions: ["Attendance", "PPE", "Almanac", "Assignment"] },
    { title: "During Program", icon: "🚜", body: "Do the work, use resources, ask supervisors, tell your Cultivator Story, connect the task to skills, career pathways, and entrepreneurship.", actions: ["Project", "Resources", "Career", "Evidence"] },
    { title: "End of Day", icon: "🌙", body: "Reflect, save portfolio evidence, receive supervisor feedback, prepare parent-safe summary, and preview tomorrow’s work.", actions: ["Reflection", "Assessment", "Portfolio", "Tomorrow"] },
  ];
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Daily Rhythm in Threes</div>
      <h2 className="mt-3 text-3xl font-black">Beginning • During • End</h2>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {stages.map((stage) => (
          <div key={stage.title} className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4">
            <div className="text-3xl">{stage.icon}</div>
            <h3 className="mt-2 text-xl font-black">{stage.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/76">{stage.body}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {stage.actions.map((action) => <span key={action} className="rounded-full bg-black/25 px-2 py-1 text-[10px] font-bold text-white/75">{action}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("wellness")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Start My Day</button>
        <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full border border-emerald-200/25 bg-emerald-300/15 px-6 py-3 font-black text-emerald-50">Open Current Project</button>
        <button type="button" onClick={() => setScreen("feedback")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Cultivator Reflection</button>
      </div>
    </Card>
  );
}

function EntrepreneurshipValueCard() {
  const items = [
    ["Customer", "Bronson Family Farm and the contractor need a safer cooling area for summer outdoor operations."],
    ["Problem", "Heat stress can harm youth, workers, volunteers, and visitors and can shut down production."],
    ["Solution", "Youth teams produce, finish, document, and stage cooling-fan work that supports the cooling station."],
    ["Value", "The project protects people, supports operations, creates portfolio evidence, and teaches how work becomes service and economic opportunity."],
    ["Opportunity", "Design, engineering, manufacturing, logistics, agriculture, construction, public safety, customer service, and entrepreneurship."],
  ];
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Entrepreneurship Layer</div>
      <h2 className="mt-3 text-3xl font-black">Problem → Customer → Solution → Value</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {items.map(([label, body]) => (
          <div key={label} className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">{label}</div>
            <p className="mt-2 text-xs font-bold leading-5 text-white/78">{body}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}


function CultivatorMomentSkinnyPlantCard() {
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🌱 Cultivator Moment</div>
      <h2 className="mt-3 text-2xl font-black">“All of that food comes from this skinny plant?”</h2>
      <details className="mt-4 rounded-[1.25rem] border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white/82">
        <summary className="cursor-pointer font-black text-emerald-50">Explore the Connections</summary>
        <p className="mt-3">Small beginnings can grow into something much bigger.</p>
        <p className="mt-3">A seedling can become food for families, income for farmers, and seeds for the future.</p>
        <p className="mt-3">Just like the plant, Cultivators grow with time, care, practice, and support.</p>
        <div className="mt-4 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-3 font-black text-emerald-50">
          Reflection: What small thing did you do today that could grow into something bigger?
        </div>
      </details>
    </Card>
  );
}


const cultivatorSkillOptions = ["Teamwork", "Observation", "Communication", "Leadership", "Problem Solving", "Entrepreneurship", "Stewardship", "Safety Awareness"];
const cultivatorBecomingOptions = ["Grower", "Builder", "Leader", "Entrepreneur", "Steward", "Teacher", "Team Builder", "Problem Solver"];

function CultivatorMomentShadowCard() {
  return (
    <Card className="p-4 md:p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">🌅 Today’s Cultivator Moment</div>
      <h2 className="mt-2 text-2xl font-black">Following the Sun</h2>
      <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <iframe
          className="h-full w-full"
          src="https://www.youtube.com/embed/1SN1BOpLZAs"
          title="Following the Sun: Crash Course Kids #8.2"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="mt-4 rounded-2xl border border-amber-200/25 bg-amber-300/12 p-4">
        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-100/80">📜 Today’s Proverb</div>
        <p className="mt-2 text-lg font-black leading-7 text-white">The gardener’s shadow is the best fertilizer.</p>
        <p className="mt-2 text-sm font-bold leading-6 text-white/82">Things grow when someone is present enough to notice what they need.</p>
      </div>
    </Card>
  );
}

function CultivatorReflectionLaunchCard({ knowledgePack }: { knowledgePack: ReturnType<typeof getActivityKnowledgePack> }) {
  const questions = [
    "What did I notice today?",
    "What did it mean?",
    "What did I do?",
    knowledgePack.reflectionPrompt,
    "What is one thing future cultivators should know?",
  ];
  return (
    <Card className="p-4 md:p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">🌱 Cultivator Reflection</div>
      <h2 className="mt-2 text-2xl font-black">Notice → Decide → Act → Reflect → Become</h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/10 p-3">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/70">Skills Used Today</div>
          <div className="mt-2 flex flex-wrap gap-1">
            {cultivatorSkillOptions.map((skill) => <span key={skill} className="rounded-full bg-black/25 px-2 py-1 text-[11px] font-bold">☐ {skill}</span>)}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/10 p-3">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/70">Who Am I Becoming?</div>
          <div className="mt-2 flex flex-wrap gap-1">
            {cultivatorBecomingOptions.map((item) => <span key={item} className="rounded-full bg-black/25 px-2 py-1 text-[11px] font-bold">☐ {item}</span>)}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200/20 bg-emerald-300/10 p-3">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/70">Cultivator Wisdom</div>
          <p className="mt-2 text-sm font-bold leading-6 text-emerald-50">What is one thing future cultivators should know?</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {questions.map((q) => <div key={q} className="rounded-xl border border-white/10 bg-black/25 p-3 text-sm font-black">{q}</div>)}
      </div>
    </Card>
  );
}

function YouthEvidenceUploadCard({ activeUser }: { activeUser: EcosystemUser | null }) {
  const [assets, setAssets] = useState<MediaAsset[]>(() => safeRead<MediaAsset[]>(MEDIA_ASSETS_KEY, []));
  const [notice, setNotice] = useState("");
  const saveLocalFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const row: MediaAsset = {
        id: uuid(),
        title: file.name,
        category: "Cultivator Story",
        file_name: file.name,
        file_url: String(reader.result || ""),
        file_type: file.type || "file",
        file_size: file.size,
        uploaded_by: activeUser?.name || "Youth Workforce Participant",
        storage_path: `local/cultivator-story/${file.name}`,
        created_at: new Date().toISOString(),
      };
      const next = [row, ...assets].slice(0, 80);
      setAssets(next);
      safeWrite(MEDIA_ASSETS_KEY, next);
      setNotice("Your Cultivator Story was saved. Keep showing what you learned, built, helped with, or accomplished.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🌱 Tell Your Cultivator Story</div>
      <h2 className="mt-3 text-3xl font-black">Show What You Did Today</h2>
      <p className="mt-3 text-sm leading-7 text-white/82">Every day you are learning something new, building new skills, helping your team, solving problems, and becoming more capable than you were yesterday.</p>
      <p className="mt-2 text-sm leading-7 text-white/76">Take photos or videos of something you learned, built, discovered, helped with, or accomplished today.</p>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-emerald-200/35 bg-emerald-300/10 p-6 text-center hover:bg-emerald-300/18">
        <span className="text-2xl font-black">📷 Add Photo or Video</span>
        <span className="mt-2 text-sm font-bold text-white/72">Saved now as part of your Cultivator Journey.</span>
        <input className="hidden" type="file" accept="image/*,video/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) saveLocalFile(file); e.currentTarget.value = ""; }} />
      </label>
      {notice && <div className="mt-4 rounded-2xl border border-emerald-200/25 bg-emerald-300/12 p-3 text-sm font-bold text-emerald-50">{notice}</div>}
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {assets.slice(0, 4).map((asset) => (
          <div key={asset.id} className="rounded-2xl border border-white/10 bg-black/28 p-3">
            <div className="truncate text-sm font-black">{asset.file_name}</div>
            <div className="mt-1 text-[11px] font-bold text-white/60">{asset.category}</div>
            <div className="mt-1 text-[11px] font-bold text-white/60">Uploaded by {asset.uploaded_by || "Youth"}</div>
          </div>
        ))}
      </div>
    </Card>
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

function Portal({ setScreen, activeUser, language }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; language: LanguageCode }) {
  const portalText = {
    en: { eyebrow: "Window Into The Ecosystem", title: "Enter the Ecosystem", subtitle: "Look through the window. Choose how you would like to enter.", guest: "Guest", guestBody: "Explore.", next: "New", nextBody: "Request access.", returning: "Returning", returningBody: "Enter your workspace." },
    es: { eyebrow: "Ventana al ecosistema", title: "Entrar al Ecosistema", subtitle: "Mire por la ventana. Elija cómo desea entrar.", guest: "Visitante", guestBody: "Explorar.", next: "Nuevo", nextBody: "Solicitar acceso.", returning: "Regresar", returningBody: "Entrar a mi espacio." },
    tl: { eyebrow: "Bintana sa Ecosystem", title: "Pumasok sa Ecosystem", subtitle: "Tumingin sa bintana. Piliin kung paano papasok.", guest: "Bisita", guestBody: "Mag-explore.", next: "Bago", nextBody: "Humingi ng access.", returning: "Bumabalik", returningBody: "Pumasok sa workspace." },
    it: { eyebrow: "Finestra sull’ecosistema", title: "Entra nell’Ecosistema", subtitle: "Guarda attraverso la finestra. Scegli come entrare.", guest: "Ospite", guestBody: "Esplora.", next: "Nuovo", nextBody: "Richiedi accesso.", returning: "Di ritorno", returningBody: "Entra nel tuo spazio." },
    he: { eyebrow: "חלון לאקוסיסטם", title: "כניסה לאקוסיסטם", subtitle: "הביטו דרך החלון. בחרו כיצד להיכנס.", guest: "אורח", guestBody: "חקירה.", next: "חדש", nextBody: "בקשת גישה.", returning: "חוזר", returningBody: "כניסה למרחב שלי." },
    fr: { eyebrow: "Fenêtre sur l’écosystème", title: "Entrer dans l’Écosystème", subtitle: "Regardez par la fenêtre. Choisissez comment entrer.", guest: "Invité", guestBody: "Explorer.", next: "Nouveau", nextBody: "Demander l’accès.", returning: "Retour", returningBody: "Entrer dans mon espace." },
  }[language];
  const TT = (phrase: string) => translatePhrase(language, phrase);

  const doors: { icon: string; title: string; body: string; screen: Screen }[] = [
    { icon: "🌲", title: portalText.guest, body: portalText.guestBody, screen: "guest" },
    { icon: "✨", title: portalText.next, body: portalText.nextBody, screen: "registration" },
    { icon: "🔑", title: portalText.returning, body: portalText.returningBody, screen: "roles" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr] lg:items-stretch">
      <Card className="overflow-hidden p-0">
        <div className="relative min-h-[62vh] bg-black/35">
          <img
            src={IMG.ecosystem}
            alt="Bronson Family Farm connected food ecosystem map"
            className="absolute inset-0 h-full w-full object-contain p-3 sm:p-5"
            onError={(event) => (event.currentTarget.src = IMG.forest)}
          />
          <div className="absolute left-4 top-4 rounded-full border border-emerald-200/25 bg-black/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-emerald-50 backdrop-blur-xl">
            {TT("Forest Gate Portal")}
          </div>
        </div>
      </Card>

      <Card className="flex flex-col justify-center">
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">{portalText.eyebrow}</div>
        <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">{portalText.title}</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-white/82">
          {portalText.subtitle}
        </p>

        <div className="mt-6 grid gap-3">
          {doors.map((door) => (
            <button
              key={door.title}
              type="button"
              onClick={() => setScreen(door.screen)}
              className="rounded-[1.5rem] border border-white/14 bg-black/35 p-5 text-left transition hover:border-emerald-200/70 hover:bg-emerald-300/14 focus:border-emerald-200 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{door.icon}</span>
                <span className="text-2xl font-black">{door.title}</span>
              </div>
              <div className="mt-2 text-sm leading-6 text-white/72">{door.body}</div>
            </button>
          ))}
        </div>

        {activeUser && (
          <div className="mt-5 rounded-[1.25rem] border border-emerald-200/20 bg-emerald-300/10 p-4 text-sm leading-6 text-white/78">
            Signed in as <strong className="text-white">{activeUser.name}</strong>. Choose Returning to enter your workspace, or Sign Out to change users.
          </div>
        )}
      </Card>
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


type LargerPictureLayer = {
  roleTitle: string;
  identity: string;
  today: string[];
  largerPicture: string;
  route: string[];
};

const largerPictureLayers: Record<string, LargerPictureLayer> = {
  "Guest Pathway": {
    roleTitle: "Guest Journey",
    identity: "You are exploring the Bronson Family Farm ecosystem as a guest.",
    today: ["Learn the farm story", "See how the food ecosystem connects", "Discover events, volunteer opportunities, marketplace access, and partnership pathways"],
    largerPicture: "In the larger picture, guests often become volunteers, customers, growers, advocates, supporters, or partners who help the ecosystem grow.",
    route: ["Guest", "Farm Story", "Event / Volunteer / Partner", "Marketplace", "Community Impact"],
  },
  "Youth Workforce Pathway": {
    roleTitle: "Youth Workforce Journey",
    identity: "You are a paid contributor to the ecosystem.",
    today: ["Earn money", "Build workforce skills", "Solve a real business challenge", "Support customers and farm operations", "Create evidence for your portfolio and resume"],
    largerPicture: "In the larger picture, your work strengthens local food systems, workforce development, economic opportunity, and community health.",
    route: ["Youth Workforce", "Today's Project", "Production Team", "Skills + Earnings", "Portfolio", "Community Impact"],
  },
  "Parent / Guardian Portal": {
    roleTitle: "Parent / Guardian Journey",
    identity: "You are supporting a young person as they participate in the ecosystem.",
    today: ["See progress", "Encourage attendance and readiness", "Celebrate achievement", "Understand parent-safe updates"],
    largerPicture: "In the larger picture, families help build the next generation of workers, leaders, entrepreneurs, and community members.",
    route: ["Parent / Guardian", "Youth Progress", "Encouragement", "Achievement", "Future Opportunity"],
  },
  "Grower Pathway": {
    roleTitle: "Grower Journey",
    identity: "You help produce food and opportunity.",
    today: ["Connect crop planning to market demand", "Identify resource needs", "Use training and tools", "Move products toward customers"],
    largerPicture: "In the larger picture, growers strengthen food security, local economies, healthy food access, and regional food movement.",
    route: ["Grower", "Crop Plan", "Resources + Training", "Marketplace", "Families / Schools / Businesses"],
  },
  "Marketplace Operations Center": {
    roleTitle: "Marketplace Journey",
    identity: "You help move food through the ecosystem.",
    today: ["Browse or manage products", "Support local growers", "Connect SNAP-aware food access", "Turn orders into harvest, packing, pickup, and reporting"],
    largerPicture: "In the larger picture, food moves to families, schools, organizations, businesses, and community tables. Food moves, not the farmer.",
    route: ["Marketplace", "Products", "Orders", "Harvest / Packing", "Pickup", "Food Access"],
  },
  "Partner Pathway": {
    roleTitle: "Partner Journey",
    identity: "You help create opportunity across the ecosystem.",
    today: ["Offer resources", "Share expertise", "Support youth workforce development", "Connect programs, funding, equipment, or volunteers"],
    largerPicture: "In the larger picture, partners connect people, resources, education, infrastructure, and opportunity so the ecosystem can serve more families and growers.",
    route: ["Partner", "Resource / Expertise", "Project Support", "Measured Impact", "Regional Growth"],
  },
  "Support the Ecosystem": {
    roleTitle: "Supporter Journey",
    identity: "You help strengthen the ecosystem through resources, time, encouragement, mentorship, or in-kind support.",
    today: ["Offer support", "Volunteer", "Mentor", "Contribute materials or funding", "Help youth, growers, food access, and infrastructure"],
    largerPicture: "In the larger picture, supporters help turn vision into practical capacity and community benefit.",
    route: ["Supporter", "Contribution", "Youth / Growers / Infrastructure", "Food Access", "Community Impact"],
  },
  "Value-Added Producer Pathway": {
    roleTitle: "Value-Added Producer Journey",
    identity: "You transform harvests, seeds, herbs, honey, flowers, and ideas into higher-value products.",
    today: ["Develop products", "Package and price offerings", "Prepare for marketplace participation", "Build small-business opportunity"],
    largerPicture: "In the larger picture, value-added production increases farm sustainability, entrepreneurship, local sales, and economic opportunity.",
    route: ["Value-Added Producer", "Product Idea", "Packaging + Pricing", "Marketplace", "Economic Opportunity"],
  },
};

function LargerPictureCard({ layerKey }: { layerKey: string }) {
  const layer = largerPictureLayers[layerKey];
  if (!layer) return null;

  return (
    <div className="mt-6 rounded-[1.5rem] border border-amber-200/25 bg-amber-300/12 p-5">
      <div className="text-xs font-black uppercase tracking-[0.28em] text-amber-100/80">My Role in the Larger Picture</div>
      <h2 className="mt-2 text-2xl font-black">{layer.roleTitle}</h2>
      <p className="mt-3 text-sm leading-7 text-white/84">{layer.identity}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_.9fr]">
        <div className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-amber-100/75">Today I</div>
          <div className="mt-3 grid gap-2">
            {layer.today.map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 p-3 text-sm font-bold text-white/84">✓ {item}</div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-amber-100/75">Where Am I in the Larger Picture?</div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-black">
            {layer.route.map((stop, index) => (
              <React.Fragment key={stop}>
                <span className={index === 0 ? "rounded-full bg-emerald-300 px-3 py-2 text-black" : "rounded-full border border-white/10 bg-white/10 px-3 py-2 text-white"}>
                  {index === 0 ? "📍 " : ""}{stop}
                </span>
                {index < layer.route.length - 1 && <span className="text-amber-100/70">→</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-white/82">{layer.largerPicture}</p>
        </div>
      </div>
    </div>
  );
}



type CultureCopy = {
  seedThoughts: string[];
  todaysThoughts: string[];
  harvestReflections: string[];
  supervisorEncouragement: string[];
  parentEncouragement: string[];
  missionBanner: { title: string; subtitle: string };
  teamWisdom: Record<string, string>;
};

const cultureCopy: Record<LanguageCode, CultureCopy> = {
  en: {
    seedThoughts: [
      "A seed never becomes a harvest the day it is planted. Growth takes time.",
      "Your future is built by the choices you make today.",
      "Strong foundations create strong futures.",
      "What you practice today becomes part of who you become tomorrow.",
      "Preparation creates opportunity.",
    ],
    todaysThoughts: [
      "Strong teams are built by people who help one another succeed.",
      "Every expert was once a beginner.",
      "Leadership begins with taking responsibility for yourself.",
      "Progress is often hidden inside difficult work.",
      "Your work matters in the larger picture.",
    ],
    harvestReflections: [
      "What did I learn today?",
      "Who helped me today?",
      "How did I help someone else?",
      "What am I proud of?",
      "What will I improve tomorrow?",
    ],
    supervisorEncouragement: [
      "You are growing people, not just managing tasks.",
      "Young people often remember the adults who believed in them.",
      "Expectations and encouragement belong together.",
    ],
    parentEncouragement: [
      "Growth happens through challenge, practice, and encouragement.",
      "Thank you for supporting your youth's journey.",
      "Confidence grows through experience, responsibility, and encouragement.",
    ],
    missionBanner: { title: "We Grow Green to Harvest Dreams™", subtitle: "Growing Food. Growing People. Growing Community." },
    teamWisdom: {
      Agriculture: "Healthy soil grows healthy food. Healthy food strengthens communities.",
      Infrastructure: "The strongest structures begin with work most people never see.",
      Apiary: "Small actions, repeated consistently, create extraordinary results.",
      Culinary: "Food is one of the ways we care for people.",
      "Guest Services": "People may forget what you say. They often remember how you made them feel.",
      Media: "Stories help people understand what matters.",
      Safety: "Safety is not slowing down. Safety helps us continue.",
      "Project Management & Logistics": "Preparation creates opportunity.",
    },
  },
  es: {
    seedThoughts: [
      "Una semilla no se convierte en cosecha el mismo día que se planta. El crecimiento toma tiempo.",
      "Tu futuro se construye con las decisiones que tomas hoy.",
      "Las bases fuertes crean futuros fuertes.",
      "Lo que practicas hoy se vuelve parte de quien serás mañana.",
      "La preparación crea oportunidad.",
    ],
    todaysThoughts: [
      "Los equipos fuertes se forman con personas que ayudan a otros a tener éxito.",
      "Toda persona experta alguna vez fue principiante.",
      "El liderazgo comienza con hacerte responsable de ti mismo.",
      "El progreso muchas veces está escondido dentro del trabajo difícil.",
      "Tu trabajo importa en el panorama más grande.",
    ],
    harvestReflections: ["¿Qué aprendí hoy?", "¿Quién me ayudó hoy?", "¿Cómo ayudé a otra persona?", "¿De qué estoy orgulloso/a?", "¿Qué mejoraré mañana?"],
    supervisorEncouragement: ["Estás cultivando personas, no solo administrando tareas.", "Los jóvenes suelen recordar a los adultos que creyeron en ellos.", "Las expectativas y el ánimo deben ir juntos."],
    parentEncouragement: ["El crecimiento ocurre con desafío, práctica y ánimo.", "Gracias por apoyar el camino de su joven.", "La confianza crece con experiencia, responsabilidad y apoyo."],
    missionBanner: { title: "Cultivamos Verde para Cosechar Sueños™", subtitle: "Cultivando Alimentos. Cultivando Personas. Cultivando Comunidad." },
    teamWisdom: { Agriculture: "La tierra sana produce alimentos sanos. Los alimentos sanos fortalecen comunidades.", Infrastructure: "Las estructuras fuertes comienzan con trabajo que muchos no ven.", Apiary: "Pequeñas acciones repetidas crean grandes resultados.", Culinary: "La comida es una forma de cuidar a las personas.", "Guest Services": "Las personas pueden olvidar lo que dices, pero recuerdan cómo las hiciste sentir.", Media: "Las historias ayudan a las personas a entender lo que importa.", Safety: "La seguridad no nos retrasa. La seguridad nos permite continuar.", "Project Management & Logistics": "La preparación crea oportunidad." },
  },
  tl: {
    seedThoughts: ["Ang binhi ay hindi agad nagiging ani sa araw na itinanim. Kailangan ng panahon ang paglago.", "Ang kinabukasan mo ay binubuo ng mga desisyon mo ngayon.", "Matibay na pundasyon ang gumagawa ng matibay na kinabukasan.", "Ang inuulit mong pagsasanay ngayon ay nagiging bahagi ng pagkatao mo bukas.", "Ang paghahanda ay lumilikha ng oportunidad."],
    todaysThoughts: ["Ang matatag na team ay binubuo ng mga taong tumutulong sa isa't isa magtagumpay.", "Bawat eksperto ay minsang naging baguhan.", "Nagsisimula ang pamumuno sa pananagutan sa sarili.", "Madalas nakatago ang progreso sa mahirap na trabaho.", "Mahalaga ang iyong trabaho sa mas malaking larawan."],
    harvestReflections: ["Ano ang natutuhan ko ngayon?", "Sino ang tumulong sa akin ngayon?", "Paano ako tumulong sa iba?", "Ano ang ipinagmamalaki ko?", "Ano ang papahusayin ko bukas?"],
    supervisorEncouragement: ["Nagpapalago ka ng tao, hindi lamang namamahala ng gawain.", "Madalas maalala ng kabataan ang mga adultong naniwala sa kanila.", "Magkasama dapat ang expectations at encouragement."],
    parentEncouragement: ["Ang paglago ay nangyayari sa hamon, pagsasanay, at encouragement.", "Salamat sa pagsuporta sa journey ng inyong youth.", "Lumalaki ang kumpiyansa sa experience, responsibilidad, at encouragement."],
    missionBanner: { title: "We Grow Green to Harvest Dreams™", subtitle: "Nagpapalago ng Pagkain. Nagpapalago ng Tao. Nagpapalago ng Komunidad." },
    teamWisdom: { Agriculture: "Malusog na lupa ang nagpapalago ng malusog na pagkain. Malusog na pagkain ang nagpapalakas ng komunidad.", Infrastructure: "Ang pinakamatibay na estruktura ay nagsisimula sa trabahong madalas hindi nakikita.", Apiary: "Maliliit na aksyon na inuulit ay lumilikha ng malaking resulta.", Culinary: "Ang pagkain ay isang paraan ng pag-aalaga sa tao.", "Guest Services": "Maaaring makalimutan ng tao ang sinabi mo, pero maaalala nila kung paano mo sila pinadama.", Media: "Tinutulungan ng mga kuwento ang tao na maunawaan kung ano ang mahalaga.", Safety: "Ang safety ay hindi pagpapabagal. Tinutulungan tayo nitong magpatuloy.", "Project Management & Logistics": "Ang paghahanda ay lumilikha ng oportunidad." },
  },
  it: {
    seedThoughts: ["Un seme non diventa raccolto il giorno in cui viene piantato. La crescita richiede tempo.", "Il tuo futuro si costruisce con le scelte che fai oggi.", "Fondamenta forti creano futuri forti.", "Ciò che pratichi oggi diventa parte di chi sarai domani.", "La preparazione crea opportunità."],
    todaysThoughts: ["Le squadre forti nascono da persone che aiutano gli altri ad avere successo.", "Ogni esperto è stato un principiante.", "La leadership inizia assumendosi la responsabilità di sé.", "Il progresso spesso è nascosto nel lavoro difficile.", "Il tuo lavoro conta nel quadro più grande."],
    harvestReflections: ["Che cosa ho imparato oggi?", "Chi mi ha aiutato oggi?", "Come ho aiutato qualcun altro?", "Di cosa sono orgoglioso/a?", "Che cosa migliorerò domani?"],
    supervisorEncouragement: ["Stai facendo crescere persone, non solo gestendo compiti.", "I giovani spesso ricordano gli adulti che hanno creduto in loro.", "Aspettative e incoraggiamento devono stare insieme."],
    parentEncouragement: ["La crescita avviene attraverso sfida, pratica e incoraggiamento.", "Grazie per sostenere il percorso del vostro giovane.", "La fiducia cresce con esperienza, responsabilità e incoraggiamento."],
    missionBanner: { title: "Coltiviamo Verde per Raccogliere Sogni™", subtitle: "Coltivare Cibo. Coltivare Persone. Coltivare Comunità." },
    teamWisdom: { Agriculture: "Un suolo sano fa crescere cibo sano. Il cibo sano rafforza le comunità.", Infrastructure: "Le strutture più forti iniziano con un lavoro che molti non vedono.", Apiary: "Piccole azioni ripetute creano risultati straordinari.", Culinary: "Il cibo è uno dei modi in cui ci prendiamo cura delle persone.", "Guest Services": "Le persone possono dimenticare ciò che dici, ma ricordano come le hai fatte sentire.", Media: "Le storie aiutano le persone a capire ciò che conta.", Safety: "La sicurezza non rallenta. La sicurezza ci permette di continuare.", "Project Management & Logistics": "La preparazione crea opportunità." },
  },
  he: {
    seedThoughts: ["זרע אינו הופך לקציר ביום שבו נשתל. צמיחה דורשת זמן.", "העתיד שלך נבנה מהבחירות שאתה עושה היום.", "יסודות חזקים יוצרים עתיד חזק.", "מה שאתה מתרגל היום הופך לחלק ממי שתהיה מחר.", "הכנה יוצרת הזדמנות."],
    todaysThoughts: ["צוותים חזקים נבנים מאנשים שעוזרים זה לזה להצליח.", "כל מומחה היה פעם מתחיל.", "מנהיגות מתחילה בלקיחת אחריות על עצמך.", "התקדמות לעיתים מסתתרת בתוך עבודה קשה.", "העבודה שלך חשובה בתמונה הגדולה."],
    harvestReflections: ["מה למדתי היום?", "מי עזר לי היום?", "איך עזרתי למישהו אחר?", "במה אני גאה?", "מה אשפר מחר?"],
    supervisorEncouragement: ["אתם מצמיחים אנשים, לא רק מנהלים משימות.", "צעירים זוכרים לעיתים את המבוגרים שהאמינו בהם.", "ציפיות ועידוד שייכים יחד."],
    parentEncouragement: ["צמיחה מתרחשת דרך אתגר, תרגול ועידוד.", "תודה שאתם תומכים במסע של הצעיר/ה שלכם.", "ביטחון גדל דרך ניסיון, אחריות ועידוד."],
    missionBanner: { title: "We Grow Green to Harvest Dreams™", subtitle: "מגדלים מזון. מגדלים אנשים. מגדלים קהילה." },
    teamWisdom: { Agriculture: "אדמה בריאה מגדלת מזון בריא. מזון בריא מחזק קהילות.", Infrastructure: "המבנים החזקים ביותר מתחילים בעבודה שרבים לא רואים.", Apiary: "פעולות קטנות שחוזרות על עצמן יוצרות תוצאות גדולות.", Culinary: "אוכל הוא דרך לדאוג לאנשים.", "Guest Services": "אנשים עשויים לשכוח מה אמרת, אך יזכרו איך גרמת להם להרגיש.", Media: "סיפורים עוזרים לאנשים להבין מה חשוב.", Safety: "בטיחות אינה האטה. בטיחות מאפשרת לנו להמשיך.", "Project Management & Logistics": "הכנה יוצרת הזדמנות." },
  },
  fr: {
    seedThoughts: ["Une graine ne devient pas une récolte le jour où elle est plantée. La croissance prend du temps.", "Ton avenir se construit avec les choix que tu fais aujourd’hui.", "Des bases solides créent des avenirs solides.", "Ce que tu pratiques aujourd’hui devient une partie de qui tu seras demain.", "La préparation crée l’opportunité."],
    todaysThoughts: ["Les équipes fortes sont formées par des personnes qui s’aident à réussir.", "Chaque expert a été débutant.", "Le leadership commence par la responsabilité personnelle.", "Le progrès est souvent caché dans le travail difficile.", "Ton travail compte dans l’ensemble."],
    harvestReflections: ["Qu’ai-je appris aujourd’hui ?", "Qui m’a aidé aujourd’hui ?", "Comment ai-je aidé quelqu’un d’autre ?", "De quoi suis-je fier/fière ?", "Que vais-je améliorer demain ?"],
    supervisorEncouragement: ["Vous faites grandir des personnes, pas seulement des tâches.", "Les jeunes se souviennent souvent des adultes qui ont cru en eux.", "Les attentes et l’encouragement vont ensemble."],
    parentEncouragement: ["La croissance vient du défi, de la pratique et de l’encouragement.", "Merci de soutenir le parcours de votre jeune.", "La confiance grandit avec l’expérience, la responsabilité et l’encouragement."],
    missionBanner: { title: "Nous Cultivons le Vert pour Récolter les Rêves™", subtitle: "Cultiver la Nourriture. Cultiver les Personnes. Cultiver la Communauté." },
    teamWisdom: { Agriculture: "Un sol sain produit une nourriture saine. Une nourriture saine renforce les communautés.", Infrastructure: "Les structures les plus fortes commencent par un travail que beaucoup ne voient jamais.", Apiary: "De petites actions répétées créent des résultats extraordinaires.", Culinary: "La nourriture est une façon de prendre soin des autres.", "Guest Services": "Les gens peuvent oublier ce que tu dis, mais ils se souviennent de ce que tu leur as fait ressentir.", Media: "Les histoires aident les gens à comprendre ce qui compte.", Safety: "La sécurité ne ralentit pas. Elle nous permet de continuer.", "Project Management & Logistics": "La préparation crée l’opportunité." },
  },
};

function dailyCultureItem(items: string[]) {
  if (!items.length) return "";
  const dayIndex = Math.floor(Date.now() / 86400000);
  return items[dayIndex % items.length];
}

function CultureCard({ language, variant = "seed" }: { language: LanguageCode; variant?: "seed" | "today" | "harvest" }) {
  const copy = cultureCopy[language] || cultureCopy.en;
  const title = variant === "harvest" ? "Harvest Reflection" : variant === "today" ? "Today's Thought" : "Seed of Thought";
  const text = variant === "harvest" ? copy.harvestReflections.join(" • ") : dailyCultureItem(variant === "today" ? copy.todaysThoughts : copy.seedThoughts);
  return (
    <div className="rounded-[1.5rem] border border-amber-200/25 bg-amber-300/12 p-5">
      <div className="text-xs font-black uppercase tracking-[0.28em] text-amber-100/80">{translatePhrase(language, title)}</div>
      <p className="mt-3 text-lg font-black leading-8 text-white/92">{text}</p>
    </div>
  );
}

function SupervisorEncouragementCard({ language }: { language: LanguageCode }) {
  const copy = cultureCopy[language] || cultureCopy.en;
  return <CultureMiniCard label={translatePhrase(language, "Supervisor Encouragement")} text={dailyCultureItem(copy.supervisorEncouragement)} />;
}

function ParentEncouragementCard({ language }: { language: LanguageCode }) {
  const copy = cultureCopy[language] || cultureCopy.en;
  return <CultureMiniCard label={translatePhrase(language, "Parent Encouragement")} text={dailyCultureItem(copy.parentEncouragement)} />;
}

function MissionCultureBanner({ language }: { language: LanguageCode }) {
  const copy = cultureCopy[language] || cultureCopy.en;
  return (
    <div className="mt-7 rounded-[1.5rem] border border-amber-200/25 bg-amber-300/12 p-5 text-center">
      <h2 className="text-3xl font-black">🌱 {copy.missionBanner.title}</h2>
      <p className="mt-3 text-lg font-bold text-white/88">{copy.missionBanner.subtitle}</p>
    </div>
  );
}

function TeamWisdomGrid({ language }: { language: LanguageCode }) {
  const copy = cultureCopy[language] || cultureCopy.en;
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {Object.entries(copy.teamWisdom).map(([team, wisdom]) => (
        <div key={team} className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">{translatePhrase(language, team)}</div>
          <p className="mt-2 text-sm font-bold leading-6 text-white/86">{wisdom}</p>
        </div>
      ))}
    </div>
  );
}

function CultureMiniCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-5 rounded-[1.35rem] border border-amber-200/20 bg-amber-300/10 p-4">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-100/75">{label}</div>
      <p className="mt-2 text-sm font-black leading-6 text-white/88">{text}</p>
    </div>
  );
}

/*
SCIENTIST FEEDBACK INTEGRATION

Users understood that the ecosystem was rich and promising, but needed help
understanding where they were within it. The ecosystem image functions as a map.
The pathway functions as the journey. This layer connects the two by explaining:
1. why the user is here,
2. what they do today,
3. how their action connects to the larger picture, and
4. what route they are traveling through the ecosystem.
*/

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
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Your Journey Continues</div>
      <h2 className="mt-3 text-3xl font-black">{title}</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-white/82">You entered a pathway, made a contribution, and identified what can happen next. The ecosystem continues because people like you participate in the larger picture.</p>
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
    <div className="grid gap-4 lg:grid-cols-[1.05fr_.75fr]">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Guest Pathway</div>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Explore the farm.</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-white/84">
          Guests see the farm story, events, marketplace, volunteer options, and ways to connect. Youth workforce operations stay in the youth pathway.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setScreen("events")} className="rounded-[1.35rem] bg-emerald-300 p-4 text-left font-black text-black">Attend an Event</button>
          <button type="button" onClick={() => setScreen("marketplace")} className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 text-left font-black">Visit Marketplace</button>
          <button type="button" onClick={() => setScreen("support")} className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 text-left font-black">Volunteer / Support</button>
          <button type="button" onClick={() => setScreen("partner")} className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 text-left font-black">Become a Partner</button>
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="relative min-h-[340px]">
          <img src={IMG.forest} alt="Bronson Family Farm guest exploration" className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.src = IMG.backup)} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
          <div className="relative z-10 flex min-h-[340px] flex-col justify-end p-5">
            <div className="rounded-[1.25rem] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
              <h2 className="text-2xl font-black">What visitors can do</h2>
              <p className="mt-2 text-sm leading-6 text-white/80">Explore the story, learn about the land, attend events, shop, volunteer, or connect as a partner.</p>
            </div>
          </div>
        </div>
      </Card>
      <details className="lg:col-span-2 rounded-[1.35rem] border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
        <summary className="cursor-pointer text-lg font-black text-emerald-50">Learn more about the guest journey</summary>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {["Farm Story", "Historic Lansdowne Airport", "Regenerative Agriculture", "Events", "Marketplace", "Volunteer Path"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-black">{item}</div>
          ))}
        </div>
      </details>
    </div>
  );
}

function MyWorkspace({
  signIn,
  activeUser,
  setScreen,
  language,
}: {
  signIn: (role: Role, name?: string, options?: Partial<EcosystemUser>) => void;
  activeUser: EcosystemUser | null;
  setScreen: (screen: Screen) => void;
  language: LanguageCode;
}) {
  type ReturningChoice = "Youth" | "Supervisor" | "Parent" | "Grower" | "Partner" | "Mission Control";
  const L = (phrase: string) => translatePhrase(language, phrase);
  const [returningChoice, setReturningChoice] = useState<ReturningChoice>("Youth");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessMessage, setAccessMessage] = useState("");

  const verifyYouthAndStart = () => {
    const profiles = safeRead<MasterProfile[]>(PROFILE_KEY, []);
    const youthRows = safeRead<YouthRegistration[]>(YOUTH_KEY, []);
    const enteredName = normalizeLaunchText(name);
    const enteredPin = normalizeLaunchPin(pin);

    const matchedYouth = youthRows.find((youth) => {
      const profile = profiles.find((item) => item.id === youth.profile_id);
      const fullName = normalizeLaunchText(`${profile?.first_name || ""} ${profile?.last_name || ""}`);
      const preferredName = normalizeLaunchText(`${profile?.preferred_name || ""} ${profile?.last_name || ""}`);
      const participant = normalizeLaunchPin(youth.participant_id);
      const lastName = normalizeLaunchText(profile?.last_name || "");
      const nameMatches = !enteredName || fullName === enteredName || preferredName === enteredName || (lastName && enteredName.endsWith(lastName));
      const pinMatches = !!enteredPin && (participant === enteredPin || participant.endsWith(enteredPin) || enteredPin.endsWith(participant));
      return nameMatches && pinMatches;
    });

    if (matchedYouth) {
      const profile = profiles.find((item) => item.id === matchedYouth.profile_id);
      const displayName = profileName(profile) === "Unknown participant" ? name || matchedYouth.participant_id : profileName(profile);
      signIn("Youth Workforce Participant", displayName, {
        participant_id: matchedYouth.participant_id,
        profile_id: matchedYouth.profile_id,
        needs_supervisor_verification: false,
      });
      return;
    }

    const fallbackParticipantId = enteredPin || `BFF-${Math.floor(100000 + Math.random() * 899999)}`;
    setAccessMessage("Youth access opened with supervisor-assisted verification. Your work can continue while staff verifies the record.");
    signIn("Youth Workforce Participant", name || "Youth Workforce Participant", {
      participant_id: fallbackParticipantId,
      needs_supervisor_verification: true,
    });
  };

  const returningLogin = () => {
    setAccessMessage("");
    if (returningChoice === "Youth") {
      if (!pin.trim()) {
        setAccessMessage("Please enter the youth PIN.");
        return;
      }
      verifyYouthAndStart();
      return;
    }

    if (returningChoice === "Supervisor") {
      if (normalizeLaunchPin(pin) !== "2350") {
        setAccessMessage("Supervisor PIN not recognized. Use the supervisor launch PIN or check with Mission Control.");
        return;
      }
      signIn("Supervisor / Staff", name || "Supervisor / Staff");
      return;
    }

    if (returningChoice === "Parent") {
      const displayName = name || email || "Parent / Guardian";
      if (!email.trim() && !name.trim()) {
        setAccessMessage("Please enter parent email or youth name so we can open the parent view.");
        return;
      }
      signIn("Parent / Guardian", displayName);
      return;
    }

    if (!password.trim()) {
      setAccessMessage("Please enter your temporary password.");
      return;
    }
    if (password.trim() !== "Nesco2026") {
      setAccessMessage("Temporary password not recognized. For launch, growers, partners, and Mission Control use Nesco2026 until changed.");
      return;
    }

    const displayName = name || email || returningChoice;
    if (returningChoice === "Grower") signIn("Grower", displayName);
    if (returningChoice === "Partner") signIn("Partner", displayName);
    if (returningChoice === "Mission Control") signIn("Administrator", displayName);
  };

  const activeWorkspace = activeUser ? routeForRole(activeUser.role) : null;
  const choices: ReturningChoice[] = ["Youth", "Supervisor", "Parent", "Grower", "Partner", "Mission Control"];

  if (activeUser?.role === "Youth Workforce Participant") {
    return (
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🌱 Cultivator Access</div>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Open My Day</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/82">You are signed in as a Cultivator. Youth do not choose another role during the workday.</p>
        <button type="button" onClick={() => setScreen("youth")} className="mt-6 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Open My Day</button>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🔑 {L("Returning")}</div>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">{L("Enter My Day")}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/82">
          {L("Choose your role first. The screen will show only the access fields you need.")}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {choices.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => { setReturningChoice(choice); setAccessMessage(""); }}
              className={`rounded-[1.25rem] border p-4 text-left font-black transition ${returningChoice === choice ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/15"}`}
            >
              {L(choice)}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
          {(returningChoice === "Youth" || returningChoice === "Supervisor") ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={returningChoice === "Youth" ? L("Youth Name") : L("Supervisor Name")} value={name} onChange={setName} placeholder={L("First and last name")} />
              <Field label={returningChoice === "Supervisor" ? L("Supervisor PIN") : L("Assigned Youth PIN")} value={pin} onChange={setPin} placeholder={returningChoice === "Supervisor" ? "2350" : L("PIN number")} />
            </div>
          ) : returningChoice === "Parent" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={L("Parent Email")} value={email} onChange={setEmail} placeholder={L("Parent or guardian email")} />
              <Field label={L("Youth Name")} value={name} onChange={setName} placeholder={L("Youth first and last name")} />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={L("Username / Email")} value={email} onChange={setEmail} placeholder={L("Email or assigned access ID")} />
              <Field label={L("Temporary Password")} value={password} onChange={setPassword} placeholder="Nesco2026" />
            </div>
          )}

          {returningChoice === "Parent" && <p className="mt-3 text-xs leading-5 text-white/62">{L("Parents use email and youth name for launch access. No Nesco2026 password is required for parents.")}</p>}
          {returningChoice !== "Youth" && returningChoice !== "Supervisor" && returningChoice !== "Parent" && (
            <p className="mt-3 text-xs leading-5 text-white/62">{L("Growers, partners, and Mission Control use temporary password")} <strong className="text-white">Nesco2026</strong> {L("until changed.")}</p>
          )}
          {returningChoice === "Youth" && <p className="mt-3 text-xs leading-5 text-white/62">{L("Returning youth use their assigned PIN. No temporary password is needed.")}</p>}
          {returningChoice === "Supervisor" && <p className="mt-3 text-xs leading-5 text-white/62">{L("Supervisor launch PIN")}: <strong className="text-white">2350</strong>.</p>}

          <button type="button" onClick={returningLogin} className="mt-5 rounded-full bg-emerald-300 px-7 py-4 font-black text-black">{L("Enter My Day")}</button>
          {accessMessage && <Notice text={accessMessage} />}
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">{returningChoice === "Supervisor" ? L("Supervisor Notes") : L("Welcome")}</div>
        <h2 className="mt-3 text-3xl font-black">{returningChoice === "Supervisor" ? L("Supervisor Access") : L("Open the correct daily space")}</h2>
        {returningChoice === "Supervisor" ? (
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4"><strong>{L("Supervisor")}:</strong> {L("use name + PIN 2350, then manage attendance, safety, and reports.")}</div>
          </div>
        ) : (
          <p className="mt-5 text-sm font-bold leading-6 text-white/76">{L("Only the selected role's access information appears here. Youth, parents, guests, growers, and supervisors should not see each other's instructions.")}</p>
        )}
        {activeUser && activeWorkspace && (
          <div className="mt-5 rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-4">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/75">Current Access</div>
            <div className="mt-2 text-2xl font-black">{activeUser.name}</div>
            <div className="mt-1 text-sm text-white/72">{activeUser.role}</div>
            <button type="button" onClick={() => setScreen(activeWorkspace)} className="mt-4 rounded-full bg-emerald-300 px-6 py-3 font-black text-black">{L("Open My Day")}</button>
          </div>
        )}
      </Card>
    </div>
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
        <button type="button" onClick={() => setScreen(routeForRole(role))} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Go to My Day</button>
      </div>
      {saved && <Notice text={saved} />}
    </Card>
  );
}




type ActivityRegistryEntry = {
  label: string;
  match: RegExp;
  knowledge: string[];
  skills: string[];
  competencies: string[];
  careers: string[];
  entrepreneurship: string[];
  resources: { title: string; type: "Uploaded" | "Link" | "Visual" | "Internal"; url?: string; note: string }[];
  evidence: string[];
  resumeStatement: string;
  reflectionPrompt: string;
};

const bronsonActivityRegistry: ActivityRegistryEntry[] = [
  {
    label: "Planting Seedlings & Crop Care",
    match: /seedling|plant|crop|transplant|companion/i,
    knowledge: ["Plant biology", "Root systems", "Soil health", "Food systems", "Companion planting"],
    skills: ["Observation", "Attention to detail", "Following procedures", "Responsibility", "Patience"],
    competencies: ["Technical Agriculture", "Stewardship", "Critical Thinking", "Personal Effectiveness"],
    careers: ["Farmer", "Horticulturist", "Greenhouse Technician", "Plant Scientist", "Extension Educator"],
    entrepreneurship: ["Crop production", "Inventory development", "Customer demand", "Marketplace readiness"],
    resources: [
      { title: "Crop Planning", type: "Link", url: "https://urbanagriculture.horticulture.wisc.edu/crop-planning/", note: "Use when planning what to plant, when to plant, and how harvest timing connects to customers." },
      { title: "Companion Planting Guide", type: "Internal", note: "Connect seedlings to pollinators, pest control, bed layout, and crop relationships." },
      { title: "Seedling Care Basics", type: "Internal", note: "Water gently, observe stress, protect roots, and track growth over time." },
    ],
    evidence: ["Photo of planted seedlings", "Growth observation", "Supervisor observation", "End-of-day reflection"],
    resumeStatement: "Assisted with crop establishment by planting, watering, and monitoring seedlings while following production and safety procedures.",
    reflectionPrompt: "What small thing did you do today that could grow into something bigger?",
  },
  {
    label: "Soil Health, Compost & Bed Preparation",
    match: /soil|compost|mulch|bed|row|nutrient|living system/i,
    knowledge: ["Soil structure", "Compost", "Nutrient cycling", "Water retention", "Regenerative agriculture"],
    skills: ["Observation", "Physical work", "Planning", "Tool use", "Problem solving"],
    competencies: ["Technical Agriculture", "Stewardship", "Safety", "Critical Thinking"],
    careers: ["Soil Scientist", "Agronomist", "Conservation Technician", "Farm Manager"],
    entrepreneurship: ["Improving yield", "Reducing waste", "Managing inputs", "Protecting future production"],
    resources: [
      { title: "Soil Health Checklist", type: "Internal", note: "Look at texture, smell, moisture, organic matter, and living activity." },
      { title: "Compost Observation Guide", type: "Internal", note: "Compare compost and field soil to understand living systems." },
      { title: "Cooking Water Fertilizer Visual", type: "Visual", note: "Connect reuse, nutrients, and resource conservation." },
    ],
    evidence: ["Before/after bed photo", "Soil observation note", "Team work photo", "Supervisor note"],
    resumeStatement: "Supported soil preparation and compost application activities to improve growing conditions for vegetable production.",
    reflectionPrompt: "How did today’s soil work help you understand what plants need to grow?",
  },
  {
    label: "Water Operations & Irrigation",
    match: /water|tote|irrigation|hydration/i,
    knowledge: ["Water systems", "Irrigation", "Hydration", "Farm logistics", "Resource management"],
    skills: ["Planning", "Systems thinking", "Dependability", "Safety awareness", "Recordkeeping"],
    competencies: ["Farm Operations", "Safety", "Stewardship", "Personal Effectiveness"],
    careers: ["Farm Manager", "Irrigation Technician", "Water Resource Specialist", "Environmental Technician"],
    entrepreneurship: ["Operations planning", "Resource cost awareness", "Production reliability"],
    resources: [
      { title: "Friday Water Operations Note", type: "Internal", note: "Water totes are filled Fridays; keep access clear and verify locations." },
      { title: "Hydroponic Crop Production", type: "Uploaded", note: "Use later to connect water quality, EC, pH, and plant production systems." },
      { title: "Hydration Checklist", type: "Internal", note: "People need water before heat becomes a problem." },
    ],
    evidence: ["Water tote access photo", "Operations checklist", "Reflection", "Supervisor observation"],
    resumeStatement: "Supported farm water operations by helping maintain access to water systems and following safety and hydration procedures.",
    reflectionPrompt: "What farm system did you notice today that helps people or plants stay healthy?",
  },
  {
    label: "Apiary & Pollinator Observation",
    match: /bee|apiary|pollinator|hive|flower|insect/i,
    knowledge: ["Bee biology", "Colony structure", "Pollination", "Biodiversity", "Habitat"],
    skills: ["Observation", "Data collection", "Risk awareness", "Patience", "Environmental awareness"],
    competencies: ["Technical Agriculture", "Critical Thinking", "Stewardship", "Safety"],
    careers: ["Beekeeper", "Apiary Inspector", "Entomologist", "Pollination Specialist", "Extension Educator"],
    entrepreneurship: ["Pollination services", "Honey products", "Beeswax products", "Value-added products"],
    resources: [
      { title: "Beekeeping for Beginners", type: "Uploaded", note: "Honey bee basics, equipment, hive placement, inspections, pests, and seasonal management." },
      { title: "Pollinator Habitat Guide", type: "Internal", note: "Connect flowers, food production, insects, and biodiversity." },
      { title: "Ohio Apiary Registration", type: "Internal", note: "Connect apiary work to real-world rules and responsibilities." },
    ],
    evidence: ["Pollinator observation", "Photo of flowers or habitat", "Safety reflection", "Supervisor observation"],
    resumeStatement: "Participated in pollinator observation and apiary support activities while documenting environmental conditions and safety considerations.",
    reflectionPrompt: "What connection did you discover between pollinators, plants, and food?",
  },
  {
    label: "Hydroponics & Controlled Environment Agriculture",
    match: /hydroponic|nutrient film|NFT|deep water|ebb|flow|aeroponic|greenhouse|CEA/i,
    knowledge: ["Hydroponic systems", "Water quality", "Nutrient solution", "EC", "pH", "Greenhouse production"],
    skills: ["Monitoring", "Troubleshooting", "Recordkeeping", "Measurement", "Systems management"],
    competencies: ["Technical Agriculture", "Critical Thinking", "STEM", "Operations"],
    careers: ["Hydroponics Technician", "CEA Specialist", "Greenhouse Manager", "Agricultural Engineer", "Urban Farmer"],
    entrepreneurship: ["High-value crops", "Year-round production", "Customer-driven production", "Controlled production systems"],
    resources: [
      { title: "6 Types of Hydroponic Systems", type: "Uploaded", note: "Wicking, DWC, NFT, Ebb & Flow, Drip Systems, and Aeroponics." },
      { title: "Basics of Hydroponic Crop Production", type: "Uploaded", note: "Hydroponics, substrates, water tests, EC, pH, nutrient solutions, crops, and greenhouse systems." },
    ],
    evidence: ["System observation", "Measurement record", "Photo/video", "Reflection"],
    resumeStatement: "Monitored hydroponic and controlled-environment growing concepts, including water quality, nutrient management, and plant production systems.",
    reflectionPrompt: "What did you learn about how water, nutrients, and plants work together?",
  },
  {
    label: "Foraging & Plant Identification",
    match: /forag|wild edible|plant identification|edible plant|trail/i,
    knowledge: ["Wild edible plants", "Plant identification", "Habitat", "Responsible harvesting", "Food safety"],
    skills: ["Research", "Observation", "Identification", "Risk assessment", "Documentation"],
    competencies: ["Critical Thinking", "Stewardship", "Food Systems", "Safety"],
    careers: ["Naturalist", "Park Ranger", "Conservation Technician", "Environmental Educator", "Culinary Educator"],
    entrepreneurship: ["Value-added teas", "Culinary products", "Educational tours", "Specialty products"],
    resources: [
      { title: "Forager Chef Wild Plant Species", type: "Link", url: "https://foragerchef.com/category/wild-plant-species/", note: "Use for wild edible plant learning and responsible identification." },
      { title: "Edible Plants on Trails", type: "Link", url: "https://www.kuhl.com/borninthemountains/edible-plants-on-the-trails-in-usa?srsltid=AfmBOopolLjrk7_jX-_vkOR5Mr2NVDkr4Mq05PBKwaqYE52zb56B4KNM", note: "Connect trails, plant ID, and outdoor learning." },
    ],
    evidence: ["Plant photo", "Identification note", "Safety reflection", "Story entry"],
    resumeStatement: "Assisted with plant identification and research activities while practicing safety, observation, and documentation skills.",
    reflectionPrompt: "What did you learn about identifying plants safely before using them?",
  },
  {
    label: "Infrastructure, Tools & Equipment",
    match: /mow|lawn|equipment|tool|fenc|build|construction|cooling|station|repair/i,
    knowledge: ["Tool safety", "Equipment operation", "Infrastructure", "Maintenance", "Worksite safety"],
    skills: ["Equipment operation", "Safety awareness", "Time management", "Teamwork", "Problem solving"],
    competencies: ["Technical Skills", "Safety", "Personal Effectiveness", "Teamwork"],
    careers: ["Equipment Operator", "Landscape Technician", "Grounds Manager", "Construction Trades", "Farm Operations Manager"],
    entrepreneurship: ["Property maintenance services", "Customer service", "Cost of materials", "Value creation"],
    resources: [
      { title: "Tool Safety Basics", type: "Internal", note: "Use before operating or carrying tools and equipment." },
      { title: "Cooling Station Project", type: "Internal", note: "Connect problem-solving, design, manufacturing, and customer needs." },
      { title: "Equipment First-Time Reflection", type: "Internal", note: "Capture confidence gained from first-time equipment operation." },
    ],
    evidence: ["Before/after photo", "Supervisor observation", "Safety checklist", "Youth reflection"],
    resumeStatement: "Safely operated or supported the use of outdoor tools and equipment while maintaining farm work areas and following safety procedures.",
    reflectionPrompt: "What did you learn by using or working around equipment today?",
  },
  {
    label: "Marketplace, Customer Service & Entrepreneurship",
    match: /market|customer|price|pricing|sell|sales|inventory|value|entrepreneur|product/i,
    knowledge: ["Customer needs", "Pricing", "Inventory", "Product presentation", "Business cycle"],
    skills: ["Communication", "Customer service", "Math", "Organization", "Financial literacy"],
    competencies: ["Entrepreneurship", "Communication", "Critical Thinking", "Professionalism"],
    careers: ["Entrepreneur", "Market Manager", "Sales Representative", "Operations Manager", "Small Business Owner"],
    entrepreneurship: ["Problem → Customer → Solution → Value", "Pricing", "Revenue", "Customer relationships"],
    resources: [
      { title: "Marketplace Operations", type: "Internal", note: "Connect products, inventory, customers, and sales." },
      { title: "Pricing and Value Creation", type: "Internal", note: "Use youth-friendly examples before abstract business language." },
    ],
    evidence: ["Product photo", "Customer service note", "Sales or inventory record", "Reflection"],
    resumeStatement: "Supported marketplace and entrepreneurship activities by assisting with product presentation, customer service, pricing, or inventory tasks.",
    reflectionPrompt: "What problem did today’s work help solve for a customer or community member?",
  },
];

function getActivityKnowledgePack(plan: { curriculum: string; focus: string; work: string[] }) {
  const combined = `${plan.curriculum} ${plan.focus} ${plan.work.join(" ")}`;
  return bronsonActivityRegistry.find((entry) => entry.match.test(combined)) || bronsonActivityRegistry[0];
}

function whyAreWeDoingThis(plan: { curriculum: string; focus: string; work: string[] }) {
  const text = `${plan.curriculum} ${plan.focus}`.toLowerCase();
  if (/soil|compost|seedling|plant|crop|water|pollinator|growth/.test(text)) {
    return [
      "Healthy soil helps plants grow.",
      "Healthy plants produce food.",
      "Food supports families and communities.",
    ];
  }
  if (/water|tote|hydration/.test(text)) {
    return [
      "Water keeps people safe and plants alive.",
      "Good farm operations make the work possible.",
      "Planning today protects tomorrow’s harvest.",
    ];
  }
  if (/infrastructure|fencing|tool|build|construction|cooling/.test(text)) {
    return [
      "Strong infrastructure keeps the farm safe and useful.",
      "Building and maintaining systems helps everyone work better.",
      "Solving problems creates value for the farm and community.",
    ];
  }
  return [
    "Today’s work helps the farm grow.",
    "The work helps your team learn and contribute.",
    "Every task is a chance to become more capable.",
  ];
}

function connectionPathForPlan(plan: { curriculum: string; focus: string; work: string[] }) {
  const text = `${plan.curriculum} ${plan.focus}`.toLowerCase();
  if (/seedling|plant|crop|soil|compost/.test(text)) return ["Seedling", "Healthy Soil", "Food", "Family", "Community"];
  if (/water|tote|hydration/.test(text)) return ["Water", "Healthy Plants", "Harvest", "Food Access"];
  if (/infrastructure|fencing|tool|cooling|build/.test(text)) return ["Tools", "Safety", "Problem Solving", "Value Created"];
  return ["Daily Work", "Learning", "Responsibility", "Growth"];
}


function FullAlmanacScreen({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const farmStatus = getFarmStatus();
  const todayPlan = getCurrentYouthPlan();
  const almanacCards = getTodayAlmanacCards(new Date(), farmStatus);
  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🌾 Live Almanac + Grower Resources</div>
        <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">Today’s Farm Almanac</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/82">
          This page separates the Almanac from weather. Weather supports the day. The Almanac helps growers decide what to plant, protect, observe, and prepare.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => setScreen(activeUser?.role ? routeForRole(activeUser.role) : "roles")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Return to My Day</button>
          <a href={YOUNGSTOWN_ALMANAC_PLANTING_URL} target="_blank" rel="noreferrer" className="rounded-full border border-emerald-200/30 bg-emerald-300/12 px-6 py-3 font-black text-emerald-50">Open 44505 Planting Calendar ↗</a>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🌱 What should growers know today?</div>
          <h2 className="mt-3 text-2xl font-black">Planting + Protection Guidance</h2>
          <div className="mt-4 grid gap-2">
            {[
              ["Plant", "Seedlings and potatoes are priority planting work today."],
              ["Prepare", "Complete grow area preparation and secure the second deer-deterrent fence."],
              ["Protect", "Check all plants for health, stress, insects, moisture, and deer pressure."],
              ["Build Soil", "Mow grass and create compost to support future soil health."],
              ["Observe", "Watch sun, shadow, wind, moisture, pollinator activity, and plant response."],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">{label}</div>
                <div className="mt-1 text-sm font-bold leading-6 text-white/82">{value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">🌤 Weather Support</div>
          <h2 className="mt-3 text-2xl font-black">Conditions still matter</h2>
          <div className="mt-4 grid gap-2">
            {almanacCards.slice(0, 8).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">{label}</div>
                <div className="mt-1 text-sm font-bold leading-5 text-white/82">{value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <TodayFarmOperationsBoard />

      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Official Live Sources</div>
        <h2 className="mt-3 text-2xl font-black">Open the actual Almanac</h2>
        <p className="mt-3 text-sm leading-6 text-white/78">The ecosystem does not replace the Almanac. These links open the live source pages for the farm location and growing guidance.</p>
        <LiveAlmanacResourceLinks />
      </Card>

      <CurriculumWeekViewCard />
    </div>
  );
}

function CurriculumWeekViewCard({ compact = false }: { compact?: boolean }) {
  const currentWeek = getCurrentYouthWeek();
  const todayPlan = getCurrentYouthPlan();
  const currentWeekPlans = youthDailyPlansByWeek[currentWeek.week] || youthWeekOneDailyPlan;
  const nextWeek = youthCurriculumWeeks.find((week) => week.week === currentWeek.week + 1);
  const todayIndex = currentWeekPlans.findIndex((day) => day.day === todayPlan.day);
  return (
    <Card className={compact ? "p-4 md:p-5" : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">📅 Curriculum Calendar</div>
          <h2 className="mt-2 text-2xl font-black">Week {currentWeek.week}: {currentWeek.title}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-white/78">Today: {todayPlan.day} — {todayPlan.curriculum}</p>
        </div>
        <div className="rounded-full border border-emerald-200/25 bg-emerald-300/12 px-4 py-2 text-xs font-black text-emerald-50">Week {currentWeek.week} of 8</div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-5">
        {currentWeekPlans.map((day, index) => {
          const isToday = day.day === todayPlan.day;
          const isPast = index < todayIndex;
          return (
            <div key={day.day} className={`rounded-2xl border p-3 ${isToday ? "border-emerald-200 bg-emerald-300 text-black" : isPast ? "border-white/10 bg-white/12 text-white/80" : "border-white/10 bg-black/25 text-white/76"}`}>
              <div className="text-sm font-black">{isPast ? "✓ " : isToday ? "● " : ""}{day.day}</div>
              <div className="mt-1 text-xs font-black leading-4 opacity-85">{day.curriculum}</div>
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {currentWeekPlans.map((day) => (
            <details key={day.day} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <summary className="cursor-pointer text-sm font-black">{day.day}: {day.curriculum}</summary>
              <p className="mt-3 text-sm leading-6 text-white/78">{day.focus}</p>
              <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-emerald-100/70">Work</div>
              <ul className="mt-2 space-y-1 text-sm font-bold text-white/80">
                {day.work.map((item) => <li key={item}>• {item}</li>)}
              </ul>
              <div className="mt-3 text-sm font-bold text-white/82">Reflection: {day.reflection}</div>
            </details>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/25 p-3 text-sm font-bold">Week 1: Completed ✅</div>
        <div className="rounded-xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-sm font-bold">Current: {currentWeek.title}</div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-3 text-sm font-bold">Next: {nextWeek ? nextWeek.title : "Completion"}</div>
      </div>
    </Card>
  );
}

function QuickReturnBar({ setScreen, activeUser }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null }) {
  const home = activeUser?.role ? routeForRole(activeUser.role) : "portal";
  const label = activeUser?.role === "Youth Workforce Participant" ? "🌱 Return to My Day" : activeUser?.role === "Parent / Guardian" ? "← Back to My Youth" : activeUser?.role === "Supervisor / Staff" ? "← Back to Supervisor" : "← Back to My Day";
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <button type="button" onClick={() => setScreen(home)} className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-50">{label}</button>
      <button type="button" onClick={() => setScreen("portal")} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black text-white/85">🏠 Home</button>
      <button type="button" onClick={() => setScreen("almanac")} className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-50">📚 Resources</button>
    </div>
  );
}



const todayFarmPriorityGroups = [
  {
    title: "🌾 Soil & Compost Team",
    mission: "Build healthy soil.",
    tasks: ["Mow grass", "Create compost", "Move grass clippings to compost areas"],
    tools: ["Mower", "Rakes", "Pitchforks", "Wheelbarrows", "Gloves"],
  },
  {
    title: "🌱 Plant Health Team",
    mission: "Help plants thrive.",
    tasks: ["Check all plants for health", "Plant seedlings", "Plant potatoes", "Report plant stress"],
    tools: ["Water pitchers", "Plant markers", "Trowels", "Gloves"],
  },
  {
    title: "🔨 Infrastructure Team",
    mission: "Protect and secure the grow area.",
    tasks: ["Complete preparing the grow area", "Make second deer-deterrent fence", "Secure grow area", "Restack wood"],
    tools: ["Fence supplies", "Stakes", "Ropes/ties", "Work gloves"],
  },
  {
    title: "♻️ Materials Recovery Team",
    mission: "Prepare materials for the next project.",
    tasks: ["Begin collecting water bottles", "Sort usable bottles", "Store bottles for next project"],
    tools: ["Bins", "Bags", "Labels", "Gloves"],
  },
  {
    title: "🫧 Bubble Babies Team",
    mission: "Continue production and quality check.",
    tasks: ["Make more Bubble Babies", "Check quality", "Document production"],
    tools: ["Production materials", "Labels", "Storage containers"],
  },
];

function TodayFarmOperationsBoard({ compact = false }: { compact?: boolean }) {
  const topTasks = todayFarmPriorityGroups.flatMap((group) => group.tasks).slice(0, compact ? 6 : 20);
  return (
    <Card className={compact ? "p-4 md:p-5" : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">🚜 Today's Farm Priorities</div>
          <h2 className="mt-2 text-2xl font-black">Week 2: Regenerative Agriculture in action</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-white/78">This board turns today's farm needs into clear team assignments for youth and supervisors.</p>
        </div>
        <div className="rounded-full border border-emerald-200/25 bg-emerald-300/12 px-4 py-2 text-xs font-black text-emerald-50">Monday Operations</div>
      </div>

      {compact ? (
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {topTasks.map((task) => (
            <div key={task} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-bold text-white/84">• {task}</div>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {todayFarmPriorityGroups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-lg font-black">{group.title}</div>
              <div className="mt-1 text-sm font-black text-emerald-50">Mission: {group.mission}</div>
              <div className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/70">Tasks</div>
              <ul className="mt-2 space-y-1 text-sm font-bold text-white/80">
                {group.tasks.map((task) => <li key={task}>• {task}</li>)}
              </ul>
              <div className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/70">Tools</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.tools.map((tool) => <span key={tool} className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-black text-white/78">{tool}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 text-sm font-bold leading-6 text-white/84">
        Cultivator question: Where did your presence help something grow, improve, or become safer today?
      </div>
    </Card>
  );
}

const june2026CalendarDays = Array.from({ length: 30 }, (_, index) => index + 1);
const june2026CalendarEvents: Record<number, string[]> = {
  5: ["🧑‍🏫 Supervisor Orientation"],
  8: ["🚜 Week 1 Launch", "📚 Workplace Foundations"],
  9: ["🚜 Production Flow"],
  10: ["🚜 Infrastructure", "🚻 Onsite Water"],
  11: ["🚜 Career Pathways"],
  12: ["🚜 Week 1 Closeout", "💧 Water Totes"],
  15: ["📚 Week 2", "🌱 Regenerative Agriculture", "🚚 Delivery / Services"],
  16: ["🌱 Seedlings + Companion Planting"],
  17: ["🚻 Onsite Water", "💧 Site Readiness"],
  18: ["🐝 Pollinators + Connections"],
  19: ["💧 Water Totes", "🌾 Week 2 Reflection"],
  22: ["📚 Week 3", "🔨 Infrastructure"],
  24: ["🚻 Onsite Water"],
  26: ["👥 Board Meeting", "💧 Water Totes"],
  29: ["📚 Week 4", "🥕 Production + Harvest"],
};

function June2026CalendarGrid() {
  const leadingBlanks = 1; // June 1, 2026 is Monday.
  const cells = [...Array.from({ length: leadingBlanks }, () => null), ...june2026CalendarDays];
  while (cells.length % 7 !== 0) cells.push(null);
  const today = new Date();
  const isJune2026 = today.getFullYear() === 2026 && today.getMonth() === 5;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">📅 Real Calendar Grid</div>
          <h2 className="mt-3 text-3xl font-black">June 2026</h2>
          <p className="mt-2 text-sm leading-6 text-white/78">Dates show workdays, curriculum milestones, services, deliveries, visitors, and farm operations.</p>
        </div>
        <div className="rounded-full border border-emerald-200/25 bg-emerald-300/12 px-4 py-2 text-xs font-black text-emerald-50">Month View</div>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[11px] font-black uppercase tracking-[0.16em] text-emerald-100/70">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          const events = day ? june2026CalendarEvents[day] || [] : [];
          const isToday = Boolean(day && isJune2026 && today.getDate() === day);
          return (
            <div key={`${day || 'blank'}-${index}`} className={`min-h-[92px] rounded-xl border p-2 text-left ${day ? isToday ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10" : "border-white/5 bg-black/20"}`}>
              {day && <div className="text-sm font-black">{day}</div>}
              <div className="mt-1 space-y-1">
                {events.slice(0, 3).map((event) => <div key={event} className="rounded-lg bg-black/25 px-2 py-1 text-[10px] font-black leading-3 text-white/86">{event}</div>)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-white/78">
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">🚜 Workday</span>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">📚 Curriculum</span>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">🚚 Delivery / Services</span>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">👥 Visitors / Meetings</span>
      </div>
    </Card>
  );
}

function WorkStatusMiniCard() {
  const farmStatus = getFarmStatus();
  const label = farmStatus.level === "Open" ? "Full Day" : farmStatus.level === "Modified Operations" ? "Half Day" : "Work Cancelled";
  const className = farmStatus.color === "red" ? "border-red-200/40 bg-red-700/35" : farmStatus.color === "amber" ? "border-amber-200/35 bg-amber-300/14" : "border-emerald-200/30 bg-emerald-300/12";
  return (
    <div className={`rounded-[1.15rem] border p-4 ${className}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70">🟢 Work Status</div>
      <div className="mt-2 text-2xl font-black">{label}</div>
      <p className="mt-2 text-xs font-bold leading-5 text-white/72">Bring water. Confirm PPE. Follow supervisor direction.</p>
    </div>
  );
}

function TodaysAssignmentLaunchCard({ todayPlan, currentWeek }: { todayPlan: typeof youthWeekOneDailyPlan[number]; currentWeek: typeof youthCurriculumWeeks[number] }) {
  return (
    <div className="rounded-[1.15rem] border border-white/10 bg-white/10 p-4">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/70">📋 Today's Assignment</div>
      <div className="mt-2 text-xl font-black">Week {currentWeek.week}: {currentWeek.title}</div>
      <div className="mt-1 text-sm font-black text-emerald-50">{todayPlan.day}: {todayPlan.curriculum}</div>
      <p className="mt-2 line-clamp-3 text-xs font-bold leading-5 text-white/76">{todayPlan.focus}</p>
    </div>
  );
}

function ToolStewardshipLaunchCard({ endOfDay = false }: { endOfDay?: boolean }) {
  const tools = ["Rake", "Shovel", "Water Pitcher", "Gloves"];
  const options = ["Returned", "Need Help", "Damaged", "Missing"];
  return (
    <Card className="p-4 md:p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">🧰 Tool Stewardship</div>
      <h2 className="mt-2 text-2xl font-black">{endOfDay ? "Return Check" : "My Tools Today"}</h2>
      <p className="mt-2 text-sm leading-6 text-white/78">A Cultivator cares for tools, resources, people, and opportunities.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {(endOfDay ? options : tools).map((item) => (
          <div key={item} className="rounded-xl border border-white/10 bg-white/10 p-3 text-sm font-black">☐ {item}</div>
        ))}
      </div>
    </Card>
  );
}

function WhyTodaysWorkMattersCard({ whyLines, connections }: { whyLines: string[]; connections: string[] }) {
  return (
    <Card className="p-4 md:p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">🌱 Why Today's Work Matters</div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {whyLines.slice(0, 4).map((line) => (
          <div key={line} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-bold text-white/84">{line}</div>
        ))}
      </div>
      <details className="mt-3 rounded-xl border border-white/10 bg-white/10 p-3 text-sm leading-6 text-white/82">
        <summary className="cursor-pointer font-black text-emerald-50">Today's Connection</summary>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-black text-white/86">
          {connections.map((item, index) => (
            <React.Fragment key={item}>
              <span className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-2">{item}</span>
              {index < connections.length - 1 && <span className="text-emerald-100/65">→</span>}
            </React.Fragment>
          ))}
        </div>
      </details>
    </Card>
  );
}

function CultivatorIdentityLaunchCard() {
  return (
    <Card className="p-4 md:p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">🌱 What Is A Cultivator?</div>
      <h2 className="mt-2 text-2xl font-black">Cultivators grow more than crops.</h2>
      <p className="mt-2 text-sm leading-6 text-white/82">Cultivators grow opportunities, communities, and futures. A Cultivator learns, observes, contributes, reflects, and leaves things better than they found them.</p>
    </Card>
  );
}

function TomorrowBeginsTodayCard({ todayPlan }: { todayPlan: typeof youthWeekOneDailyPlan[number] }) {
  return (
    <Card className="p-4 md:p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">🌦 Tomorrow Begins Today</div>
      <h2 className="mt-2 text-2xl font-black">Prepare before leaving.</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/10 p-3"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/70">Tomorrow Readiness</div><div className="mt-1 text-sm font-bold">Water bottle • closed-toe shoes • gloves • hat</div></div>
        <div className="rounded-xl border border-white/10 bg-white/10 p-3"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/70">Tomorrow Question</div><div className="mt-1 text-sm font-bold">What should we watch next based on what we observed today?</div></div>
      </div>
    </Card>
  );
}

function YouthScreen({ setScreen, activeUser, language }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; language: LanguageCode }) {
  const currentWeek = getCurrentYouthWeek();
  const todayPlan = getCurrentYouthPlan();
  const currentWeekPlans = youthDailyPlansByWeek[currentWeek.week] || youthWeekOneDailyPlan;
  const whyLines = whyAreWeDoingThis(todayPlan);
  const connections = connectionPathForPlan(todayPlan);
  const knowledgePack = getActivityKnowledgePack(todayPlan);

  return (
    <div className="grid gap-3">
      <Card className="p-4 md:p-5">
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">🌱 My Day</div>
        <h1 className="mt-2 text-2xl font-black leading-tight md:text-3xl">Week {currentWeek.week}: {currentWeek.title}</h1>
        <p className="mt-2 text-sm leading-6 text-white/78">Four things first: status, conditions, assignment, start.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-[.8fr_1.1fr_1fr]">
          <WorkStatusMiniCard />
          <FarmConditionsCard compact />
          <TodaysAssignmentLaunchCard todayPlan={todayPlan} currentWeek={currentWeek} />
        </div>
        <button type="button" onClick={() => setScreen("wellness")} className="mt-4 w-full rounded-full bg-emerald-300 px-6 py-4 text-lg font-black text-black shadow-lg shadow-emerald-950/25 hover:bg-emerald-200">▶ Begin Today's Work</button>
      </Card>

      <CultivatorMomentShadowCard />
      <TodayFarmOperationsBoard compact />
      <CurriculumWeekViewCard compact />

      <details className="rounded-[1.25rem] border border-white/10 bg-black/35 p-4 text-white/82 backdrop-blur-xl">
        <summary className="cursor-pointer text-base font-black text-emerald-50">Open after Begin Today's Work: Tools + Why It Matters</summary>
        <div className="mt-4 grid gap-3">
          <ToolStewardshipLaunchCard />
          <WhyTodaysWorkMattersCard whyLines={whyLines} connections={connections} />
        </div>
      </details>

      <details className="rounded-[1.25rem] border border-white/10 bg-black/35 p-4 text-white/82 backdrop-blur-xl">
        <summary className="cursor-pointer text-base font-black text-emerald-50">End My Day: Story, Reflection, Stewardship, Tomorrow</summary>
        <div className="mt-4 grid gap-3">
          <YouthEvidenceUploadCard activeUser={activeUser} />
          <CultivatorReflectionLaunchCard knowledgePack={knowledgePack} />
          <ToolStewardshipLaunchCard endOfDay />
          <TomorrowBeginsTodayCard todayPlan={todayPlan} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setScreen("media")} className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-black">Open Cultivator Stories</button>
            <button type="button" onClick={() => setScreen("feedback")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black">Save Cultivator Reflection</button>
          </div>
        </div>
      </details>

      <details className="rounded-[1.25rem] border border-white/10 bg-black/35 p-4 text-white/82 backdrop-blur-xl">
        <summary className="cursor-pointer text-base font-black text-emerald-50">Cultivator Resources + Journey</summary>
        <div className="mt-4 grid gap-3">
          <CultivatorIdentityLaunchCard />
          <CurrentWeekStrip />
          <Card className="p-4 md:p-5">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100/75">Monday–Friday Curriculum</div>
            <div className="mt-3 grid gap-2">
              {currentWeekPlans.map((day) => (
                <details key={day.day} className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <summary className="cursor-pointer text-sm font-black">{day.day} • {day.curriculum}</summary>
                  <p className="mt-2 text-sm leading-6 text-white/78">{day.focus}</p>
                  <div className="mt-2 text-sm font-bold text-white/82">Reflection: {day.reflection}</div>
                </details>
              ))}
            </div>
          </Card>
        </div>
      </details>
    </div>
  );
}

function CurrentWeekActivityModule({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const currentWeek = getCurrentYouthWeek();
  const todayPlan = getCurrentYouthPlan();
  const knowledgePack = getActivityKnowledgePack(todayPlan);
  return (
    <div className="grid gap-5">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Current Week Activity</div>
        <h2 className="mt-3 text-4xl font-black">Week {currentWeek.week}: {currentWeek.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/82">{currentWeek.focus}</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Today’s Activity</div>
            <div className="mt-2 text-xl font-black">{todayPlan.day}: {todayPlan.curriculum}</div>
            <p className="mt-2 text-sm leading-6 text-white/78">{todayPlan.focus}</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Today’s Work</div>
            <ul className="mt-2 space-y-1 text-sm font-bold text-white/80">
              {todayPlan.work.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">Cultivator Reflection</div>
            <p className="mt-2 text-sm font-bold leading-6 text-white/82">{todayPlan.reflection}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => setScreen("youth")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Open My Day</button>
          <button type="button" onClick={() => setScreen("wellness")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Start My Day</button>
        </div>
      </Card>
      <FarmConditionsCard />
      <CultivatorMomentSkinnyPlantCard />
    </div>
  );
}

function SupervisorOperationsCenter({ setScreen, activeUser, language }: { setScreen: (screen: Screen) => void; activeUser: EcosystemUser | null; language: LanguageCode }) {
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
    { key: "project", label: "Current Week Activity" },
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
        <SupervisorEncouragementCard language={language} />
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
        {tab === "project" && <CurrentWeekActivityModule setScreen={setScreen} />}
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
      <h2 className="mt-3 text-4xl font-black">Current operating picture.</h2>
      <div className="mt-5">
        <DailyOperationsCommandCenter setScreen={setScreen} compact />
      </div>
      <div className="mt-4 rounded-[1.25rem] border border-emerald-200/20 bg-emerald-300/10 p-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/75">Current Week Activity</div>
        <div className="mt-1 text-xl font-black">Week {getCurrentYouthWeek().week}: {getCurrentYouthWeek().title}</div>
        <div className="mt-1 text-sm font-bold text-white/78">Today: {getCurrentYouthPlan().day} — {getCurrentYouthPlan().curriculum}</div>
        <button type="button" onClick={() => setTab("project")} className="mt-3 rounded-full bg-emerald-300 px-5 py-2 text-sm font-black text-black">Open Current Week Activity</button>
      </div>
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
      <div className="text-xs uppercase tracking-[0.35em] text-red-100/75">Supervisor-Only Incident / Support Log</div>
      <h2 className="mt-3 text-4xl font-black">Document safety, behavior, conflict, wellness, injury, or parent contact.</h2>
      <div className="mt-4 rounded-2xl border border-red-200/20 bg-red-700/20 p-4 text-sm font-bold leading-6 text-white/82">
        Injury workflow: youth notify the supervisor/site lead first. Registered Nurse Triage is available at <a className="font-black text-white underline" href="tel:18553896699">855-389-6699</a> 24/7/365. Supervisors complete the injury investigation/report when documentation is required.
      </div>
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
  const [participantId, setParticipantId] = useState(activeUser?.participant_id || "");
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
      if (!participantId) {
        if (activeUser?.participant_id) setParticipantId(activeUser.participant_id);
        else if (loadedYouth[0]?.participant_id) setParticipantId(loadedYouth[0].participant_id);
      }
    };
    void load();
  }, []);

  const demoYouth: YouthRegistration = {
    id: "demo-youth-registration",
    profile_id: activeUser?.profile_id || activeUser?.id || "demo-profile",
    participant_id: activeUser?.participant_id || "BFF-736309",
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

  const selectedYouth = youth.find((y) => y.participant_id === participantId) || (activeUser?.participant_id ? demoYouth : youth[0]) || demoYouth;
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
      window.setTimeout(() => setScreen("youth"), 650);
    } catch (error) {
      console.error("Start My Day save issue:", error);
      setMessage(`Start My Day saved on this device. ${selectedYouth.participant_id} is recorded for this review session. Opening today's assignment.`);
      window.setTimeout(() => setScreen("youth"), 650);
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
          {activeUser?.needs_supervisor_verification && (
            <div className="mt-3 rounded-2xl border border-amber-300/40 bg-amber-300/14 p-3 text-sm font-bold text-amber-50">
              Supervisor-assisted access is active. This check-in will still save, and staff can verify the youth record later.
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/12 px-4 py-3 text-right">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/75">Check-In Time</div>
          <div className="text-xl font-black">{checkinTime}</div>
          <div className="text-xs font-bold text-white/75">{checkinDate}</div>
        </div>
      </div>

      <div className="mt-4"><FarmConditionsCard compact /></div>

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
            <span className={`rounded-full px-4 py-2 text-xs font-black ${allRequiredPPE ? "bg-emerald-300 text-black" : "bg-amber-300 text-black"}`}>
              {readinessStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Toggle label="Boots / Shoes" checked={closedToeShoes} setChecked={setClosedToeShoes} />
            <Toggle label="Water" checked={waterBottle} setChecked={setWaterBottle} />
            <Toggle label="Gloves" checked={workGloves} setChecked={setWorkGloves} />
            <Toggle label="Outdoor Clothing" checked={appropriateClothing} setChecked={setAppropriateClothing} />
          </div>
          <button type="button" onClick={save} disabled={saving} className="mt-3 w-full rounded-full bg-emerald-300 px-5 py-3 text-base font-black text-black disabled:opacity-60">
            {saving ? "Saving..." : "Begin Today's Work"}
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
        <button type="button" onClick={() => setScreen("youth")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">Back to My Day</button>
        <button type="button" onClick={() => setScreen("completion")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black">My Growth</button>
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

function ParentScreen({ setScreen, language }: { setScreen: (screen: Screen) => void; language: LanguageCode }) {
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

      <LargerPictureCard layerKey="Parent / Guardian Portal" />

      <ParentEncouragementCard language={language} />

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
          { label: "Return to My Day", screen: "roles" },
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
        <LargerPictureCard layerKey="Marketplace Operations Center" />
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
  const currentWeek = getCurrentYouthWeek();
  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Calendar</div>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Farm Calendar</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-white/84">
          This is the real operating calendar: workdays, curriculum, visitors, deliveries, service access, weather changes, and weekly progression.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => setScreen("youth")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Open My Day</button>
          <button type="button" onClick={() => setScreen("almanac")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black">Open Almanac</button>
        </div>
      </Card>

      <June2026CalendarGrid />

      <TodayFarmOperationsBoard compact />

      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Upcoming Operations</div>
        <h2 className="mt-3 text-3xl font-black">Week {currentWeek.week} operations</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Monday", "Weekly topic, supervisor assignment, PPE, work-plan confirmation, farm priorities."],
            ["Wednesday", "Onsite Water service. Keep service access clear."],
            ["Friday", "Water totes filled. Verify tote access and refill needs."],
            ["Weather", "Mission Control may change Full Day, Half Day, or Work Cancelled."],
          ].map(([label, note]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-lg font-black">{label}</div>
              <p className="mt-2 text-sm font-bold leading-6 text-white/76">{note}</p>
            </div>
          ))}
        </div>
      </Card>

      <CurriculumWeekViewCard />

      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Events & Visitors</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {launchEvents.map((event) => (
            <div key={event.title} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
              <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/75">{event.date} • {event.time}</div>
              <h2 className="mt-3 text-2xl font-black">{event.title}</h2>
              <div className="mt-2 text-sm font-black text-white/70">Audience: {event.audience}</div>
              <p className="mt-4 text-sm leading-7 text-white/82">{event.purpose}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
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

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => safeRead<MediaAsset[]>(MEDIA_ASSETS_KEY, []));
  const [uploadingCategory, setUploadingCategory] = useState<string>("");
  const [mediaNotice, setMediaNotice] = useState<string>("");
  const [quickCategory, setQuickCategory] = useState<string>("Cultivator Story");

  const saveMediaAsset = async (asset: MediaAsset) => {
    const next = [asset, ...mediaAssets];
    setMediaAssets(next);
    safeWrite(MEDIA_ASSETS_KEY, next);

    if (supabase) {
      try {
        await supabase.from("media_assets").insert({
          id: asset.id,
          title: asset.title,
          category: asset.category,
          file_name: asset.file_name,
          file_url: asset.file_url,
          file_type: asset.file_type,
          file_size: asset.file_size,
          uploaded_by: asset.uploaded_by || "Launch Team",
          storage_path: asset.storage_path || null,
          created_at: asset.created_at,
        });
      } catch {
        // Upload should still succeed even if the optional media_assets table is not created yet.
      }
    }
  };

  const handleMediaUpload = async (category: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const id = crypto.randomUUID ? crypto.randomUUID() : `media-${Date.now()}`;
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const folderName = category.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const storagePath = `${folderName}/${todayISO()}-${id}-${cleanName}`;

    setUploadingCategory(category);
    setMediaNotice(`Uploading ${file.name}...`);

    try {
      let fileUrl = URL.createObjectURL(file);

      if (supabase) {
        const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) throw error;

        const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
        fileUrl = data.publicUrl;
      }

      await saveMediaAsset({
        id,
        title: category,
        category,
        file_name: file.name,
        file_url: fileUrl,
        file_type: file.type || "unknown",
        file_size: file.size,
        uploaded_by: "Launch Team",
        storage_path: storagePath,
        created_at: new Date().toISOString(),
      });

      setMediaNotice(supabase ? `Uploaded to Supabase Storage: ${file.name}` : `Saved on this device for demo: ${file.name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      setMediaNotice(`Upload issue: ${message}. Confirm the Supabase Storage bucket '${MEDIA_BUCKET}' exists and allows uploads.`);
    } finally {
      setUploadingCategory("");
      event.target.value = "";
    }
  };

  const assetsFor = (category: string) => mediaAssets.filter((asset) => asset.category === category).slice(0, 3);
  const recentAssets = mediaAssets.slice(0, 4);

  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Cultivator Stories</div>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">My Story</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-white/84">
          Upload a photo, video, or commentary from your day. This is your Cultivator Story.
        </p>
        {mediaNotice && <div className="mt-4 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-bold text-white/80">{mediaNotice}</div>}
        <div className="mt-6 grid gap-3 md:grid-cols-1">
          <button type="button" onClick={() => setQuickCategory("Cultivator Story")} className="rounded-[1.25rem] border border-emerald-200 bg-emerald-300 p-4 text-left text-black">
            <div className="text-lg font-black">My Story</div>
            <div className="mt-1 text-xs font-bold opacity-75">Photo • Video • Commentary</div>
          </button>
        </div>
        <div className="mt-5 rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/10 p-5">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/75">Selected Story Area</div>
          <h2 className="mt-2 text-2xl font-black">{quickCategory}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center rounded-full bg-emerald-300 px-6 py-3 text-sm font-black text-black shadow-lg shadow-emerald-950/25 hover:bg-emerald-200">
              {uploadingCategory === quickCategory ? "Uploading..." : "Upload Photo / Video"}
              <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx" className="sr-only" disabled={uploadingCategory === quickCategory} onChange={(event) => handleMediaUpload(quickCategory, event)} />
            </label>
            <button type="button" onClick={() => setScreen("youth")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white hover:bg-white/20">Back to My Day</button>
          </div>
        </div>
      </Card>

      {recentAssets.length > 0 && (
        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Recent Cultivator Stories</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {recentAssets.map((asset) => (
              <a key={asset.id} href={asset.file_url} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white/78 hover:bg-white/10">
                <div className="font-black text-white">{asset.file_name}</div>
                <div className="mt-1 text-white/55">{asset.category} • {new Date(asset.created_at).toLocaleString()} • {(asset.file_size / 1024 / 1024).toFixed(2)} MB</div>
              </a>
            ))}
          </div>
        </Card>
      )}

      <details className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-white/82 backdrop-blur-xl">
        <summary className="cursor-pointer text-lg font-black text-emerald-50">Open all media folders</summary>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {folders.map(([title, text]) => {
            const folderAssets = assetsFor(title);
            return (
              <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <div className="text-2xl">🎥</div>
                <h2 className="mt-3 text-xl font-black">{title}</h2>
                <details className="mt-3 text-sm leading-6 text-white/78">
                  <summary className="cursor-pointer font-black text-emerald-50">Details</summary>
                  <p className="mt-2">{text}</p>
                </details>
                <label className="mt-4 block cursor-pointer rounded-full border border-emerald-200/30 bg-emerald-300 px-4 py-2 text-center text-xs font-black text-black shadow-lg shadow-emerald-950/25">
                  {uploadingCategory === title ? "Uploading..." : "Choose File / Upload"}
                  <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx" className="hidden" disabled={uploadingCategory === title} onChange={(event) => handleMediaUpload(title, event)} />
                </label>
                {folderAssets.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {folderAssets.map((asset) => (
                      <a key={asset.id} href={asset.file_url} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white/78 hover:bg-white/10">
                        <div className="font-black text-white">{asset.file_name}</div>
                        <div className="mt-1 text-white/55">{new Date(asset.created_at).toLocaleString()} • {(asset.file_size / 1024 / 1024).toFixed(2)} MB</div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </details>

      <details className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-white/82 backdrop-blur-xl">
        <summary className="cursor-pointer text-lg font-black text-emerald-50">Open training videos and support framework</summary>
        <div className="mt-5 grid gap-5">
          <SupportResponseFrameworkCard />
          <VideoLibrary />
        </div>
      </details>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Open June 8 Project</button>
        <button type="button" onClick={() => setScreen("youth")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Back to My Day</button>
      </div>
    </div>
  );
}

function Reports({ setScreen, language }: { setScreen: (screen: Screen) => void; language: LanguageCode }) {
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
  const inventory = safeRead<OperationsInventoryItem[]>(OPERATIONS_INVENTORY_KEY, defaultOperationsInventory);
  const inventoryLogs = safeRead<OperationsInventoryLog[]>(OPERATIONS_INVENTORY_LOG_KEY, []);
  const farmStatus = getFarmStatus();
  const unassignedYouth = youth.filter((item) => !item.crew || /unassigned/i.test(item.crew)).length;
  const ppeNeedsReview = attendance.filter((a) => a.date === today && a.ppe_status !== "complete").length;
  const urgentIncidents = incidents.filter((i) => i.urgency === "high" || i.urgency === "emergency").length;
  const inventoryAlerts = inventory.filter((item) => item.status === "Low" || item.status === "Needs Replacement" || item.status === "Missing" || item.available <= 0).length;
  const spanishReady = Boolean(languageText.es?.youth && languageText.es?.parent && languageText.es?.supervisor);
  const launchScorecard = [
    { area: "Youth Login", status: "🟢 Ready", detail: "PIN access includes supervisor-assisted continuation for unmatched launch PINs.", action: "Test with 2 known PINs and 1 unmatched PIN." },
    { area: "Start My Day", status: present > 0 ? "🟢 Ready" : "🟡 Monitor", detail: present > 0 ? `${present} youth checked in today.` : "Check-in workflow is present; test when youth arrive.", action: "Confirm attendance saves on phone." },
    { area: "Supervisor Verification", status: "🟢 Ready", detail: "Unmatched youth may continue pending verification and staff follow-up.", action: "Route unmatched 4-digit PIN issues to bhchatman@gmail.com." },
    { area: "Assignments", status: unassignedYouth > 0 ? "🔴 Blocker" : "🟢 Ready", detail: unassignedYouth > 0 ? `${unassignedYouth} youth still show unassigned crew.` : "No unassigned youth detected in local roster.", action: "Assign category / supervisor before relying on daily work routing." },
    { area: "Safety / Nurse Line", status: ppeNeedsReview || urgentIncidents ? "🟡 Monitor" : "🟢 Ready", detail: `${ppeNeedsReview} PPE reviews today; ${urgentIncidents} urgent incidents logged.`, action: "Keep Nurse Line visible and incident form one tap away." },
    { area: "Inventory", status: inventoryAlerts ? "🟡 Monitor" : "🟢 Ready", detail: `${inventory.length} items loaded; ${inventoryAlerts} alerts; ${inventoryLogs.length} inventory log entries.`, action: "Check out, return, and damage-report one item before youth start." },
    { area: "Almanac + Weather", status: farmStatus.color === "red" ? "🔴 Blocker" : farmStatus.color === "amber" ? "🟡 Monitor" : "🟢 Ready", detail: `${farmStatus.level}: ${farmStatus.title}`, action: "Set work status before assignments are released." },
    { area: "Parent Portal", status: "🟡 Monitor", detail: "Parent-safe summaries and attendance visibility are present.", action: "Test with one parent on phone, including Spanish access." },
    { area: "Translation", status: spanishReady ? "🟢 Ready" : "🟡 Monitor", detail: "English and Spanish are launch-critical; other languages remain available.", action: "Audit buttons, forms, and error messages in Spanish." },
    { area: "Mission Control", status: "🟢 Ready", detail: "Workforce, safety, project, readiness, inventory, and almanac are centralized.", action: "Use this scorecard only until blockers are green." },
  ];
  const statusClass = (status: string) => status.includes("🔴") ? "border-red-300/35 bg-red-700/28" : status.includes("🟡") ? "border-amber-200/35 bg-amber-300/14" : "border-emerald-200/30 bg-emerald-300/12";
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
  const keyStats = [
    ["Youth Registered", youth.length],
    ["Present Today", present],
    ["Support Flags", supportFlags],
    ["Project Items", projectProgress.length],
  ];
  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">Mission Control</div>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Monitor operations.</h1>
        <MissionCultureBanner language={language} />
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {keyStats.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <div className="text-3xl font-black">{value}</div>
              <div className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-[1.5rem] border border-amber-200/25 bg-amber-300/10 p-5">
          <div className="text-xs font-black uppercase tracking-[0.28em] text-amber-100/80">Minimum Launch Standard</div>
          <h2 className="mt-2 text-2xl font-black">Launch Readiness Scorecard</h2>
          <p className="mt-2 text-sm leading-6 text-white/76">No new features until red launch blockers are cleared. Green means launch ready. Yellow means launch with monitoring. Red means fix before relying on that workflow.</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {launchScorecard.map((item) => (
              <div key={item.area} className={`rounded-2xl border p-4 ${statusClass(item.status)}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="text-lg font-black">{item.area}</div>
                  <div className="rounded-full bg-black/30 px-3 py-1 text-xs font-black">{item.status}</div>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/82">{item.detail}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-white/64">Next action: {item.action}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => setScreen("supervisor")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Supervisor Center</button>
          <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Open Project</button>
          <button type="button" onClick={() => setScreen("media")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Cultivator Stories</button>
        </div>
      </Card>
      <details className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-white/82 backdrop-blur-xl">
        <summary className="cursor-pointer text-lg font-black text-emerald-50">Open all metrics</summary>
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
      </details>
      <details className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-white/82 backdrop-blur-xl">
        <summary className="cursor-pointer text-lg font-black text-emerald-50">Open readiness checklist</summary>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {readiness.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/70">{label}</div>
              <div className="mt-2 text-lg font-black">{value}</div>
            </div>
          ))}
        </div>
      </details>
      <details className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-white/82 backdrop-blur-xl">
        <summary className="cursor-pointer text-lg font-black text-emerald-50">Open videos and support framework</summary>
        <div className="mt-5 grid gap-5">
          <SupportResponseFrameworkCard />
          <VideoLibrary />
        </div>
      </details>
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
      <OperationsInventoryPanel />
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => setScreen("supervisor")} className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black">Open Supervisor Center</button>
        <button type="button" onClick={() => setScreen("launchProject")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Open June 8 Project</button>
        <button type="button" onClick={() => setScreen("events")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Events & Orientation</button>
      </div>
    </Card>
  );
}



function OperationsInventoryPanel() {
  const [items, setItems] = useState<OperationsInventoryItem[]>(() => {
    const saved = safeRead<OperationsInventoryItem[]>(OPERATIONS_INVENTORY_KEY, []);
    return saved.length ? saved : defaultOperationsInventory;
  });
  const [logs, setLogs] = useState<OperationsInventoryLog[]>(() => safeRead<OperationsInventoryLog[]>(OPERATIONS_INVENTORY_LOG_KEY, []));
  const [selectedId, setSelectedId] = useState(items[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [person, setPerson] = useState("Supervisor / Logistics Lead");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    safeWrite(OPERATIONS_INVENTORY_KEY, items);
  }, [items]);

  useEffect(() => {
    safeWrite(OPERATIONS_INVENTORY_LOG_KEY, logs);
  }, [logs]);

  const selectedItem = items.find((item) => item.id === selectedId) || items[0];
  const inventoryAlerts = items.filter((item) => item.status === "Low" || item.status === "Needs Replacement" || item.status === "Missing" || item.available <= 0);
  const checkedOut = items.reduce((sum, item) => sum + Math.max(0, item.total - item.available), 0);

  const writeLog = (item: OperationsInventoryItem, action: OperationsInventoryLog["action"], qty: number, extraNotes?: string) => {
    const row: OperationsInventoryLog = {
      id: uuid(),
      item_id: item.id,
      item_name: item.name,
      action,
      quantity: qty,
      person,
      notes: extraNotes || notes,
      approved_by: "Supervisor / Staff Lead",
      youth_lead: person,
      team: "Logistics & Inventory Team",
      created_at: new Date().toISOString(),
    };
    setLogs((current) => [row, ...current].slice(0, 150));
    setMessage(`${item.name}: ${action} recorded.`);
  };

  const updateItem = (action: OperationsInventoryLog["action"]) => {
    if (!selectedItem) return;
    const qty = Math.max(1, Number(quantity) || 1);
    setItems((current) => current.map((item) => {
      if (item.id !== selectedItem.id) return item;
      let nextAvailable = item.available;
      if (action === "Checked Out") nextAvailable = Math.max(0, item.available - qty);
      if (action === "Returned") nextAvailable = Math.min(item.total, item.available + qty);
      const nextStatus = action === "Needs Replacement" || action === "Marked Missing" ? (action === "Marked Missing" ? "Missing" : "Needs Replacement") : inventoryStatus(item.total, nextAvailable);
      return { ...item, available: nextAvailable, status: nextStatus, notes: notes || item.notes, last_updated: new Date().toISOString() };
    }));
    writeLog(selectedItem, action, qty, notes);
  };

  return (
    <div className="mt-6 rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/10 p-5">
      <div className="text-xs font-black uppercase tracking-[0.28em] text-emerald-100/75">Launch-Critical Inventory</div>
      <h2 className="mt-2 text-2xl font-black">Inventory Check Out / Return / Damage Report</h2>
      <p className="mt-2 text-sm leading-6 text-white/76">Inventory is visible in Operations and Mission Control so supervisors can document tools immediately instead of searching for a separate system.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {[
          ["Items", items.length],
          ["Checked Out", checkedOut],
          ["Alerts", inventoryAlerts.length],
          ["Log Entries", logs.length],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-2xl border border-white/10 bg-black/28 p-4">
            <div className="text-3xl font-black">{value}</div>
            <div className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-white/60">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-100/75">Item</span>
              <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/45 px-3 py-3 text-white">
                {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-100/75">Quantity</span>
              <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-white/10 bg-black/45 px-3 py-3 text-white" />
            </label>
            <label className="block">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-100/75">Person / Team</span>
              <input value={person} onChange={(event) => setPerson(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/45 px-3 py-3 text-white" />
            </label>
          </div>
          <label className="mt-3 block">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-100/75">Notes / Damage Description</span>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={2} placeholder="Example: rake handle cracked near the head." className="mt-2 w-full rounded-xl border border-white/10 bg-black/45 px-3 py-3 text-white placeholder:text-white/35" />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => updateItem("Checked Out")} className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-black">Check Out</button>
            <button type="button" onClick={() => updateItem("Returned")} className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black">Return</button>
            <button type="button" onClick={() => updateItem("Needs Replacement")} className="rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-black">Damage Report</button>
            <button type="button" onClick={() => updateItem("Marked Missing")} className="rounded-full bg-red-300 px-5 py-3 text-sm font-black text-black">Mark Missing</button>
          </div>
          {message && <div className="mt-3 rounded-2xl border border-emerald-200/30 bg-emerald-300/12 p-3 text-sm font-bold text-white/86">{message}</div>}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100/75">Current Inventory</div>
          <div className="mt-3 grid max-h-[28rem] gap-2 overflow-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black">{item.name}</div>
                    <div className="mt-1 text-xs leading-5 text-white/62">{item.location}</div>
                  </div>
                  <div className="rounded-full bg-black/35 px-3 py-1 text-xs font-black">{item.available}/{item.total}</div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/65">
                  <span>{item.category}</span><span>•</span><span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {inventoryAlerts.length > 0 && (
        <div className="mt-4 rounded-2xl border border-amber-200/30 bg-amber-300/12 p-4">
          <div className="font-black">Inventory alerts needing review</div>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {inventoryAlerts.map((item) => <div key={item.id} className="rounded-xl bg-black/25 p-3 text-sm font-bold">{item.name}: {item.status}</div>)}
          </div>
        </div>
      )}
    </div>
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
          <LargerPictureCard layerKey={title} />
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
        <button type="button" onClick={() => setScreen("feedback")} className="rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black">Cultivator Reflection</button>
      </div>
    </Card>
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
