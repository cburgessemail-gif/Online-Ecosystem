import React, { useEffect, useMemo, useState } from "react";

type EcosystemScreen =
  | "home"
  | "guest"
  | "customer"
  | "marketplace"
  | "grower"
  | "youth"
  | "partner"
  | "valueAdded"
  | "supervisor"
  | "missionControl";

type PathwayCard = {
  id: EcosystemScreen;
  title: string;
  subtitle: string;
  purpose: string;
  bullets: string[];
};

const pathwayCards: PathwayCard[] = [
  {
    id: "guest",
    title: "Guest",
    subtitle: "Enter the story, land, and purpose.",
    purpose: "Help visitors understand why Bronson Family Farm exists and how the historic Lansdowne Airport site is being transformed.",
    bullets: ["Guided farm story", "Historic place-based context", "Tours, events, and invitations"],
  },
  {
    id: "customer",
    title: "Customer",
    subtitle: "Fresh food, nutrition, and repeat healthy choices.",
    purpose: "Connect families to chemical-free produce, practical food education, and purchasing pathways.",
    bullets: ["Fresh produce access", "Nutrition education", "Return to Marketplace"],
  },
  {
    id: "marketplace",
    title: "Marketplace",
    subtitle: "Food moves, not the farmer.",
    purpose: "Show how produce, value-added goods, vendors, schools, and community buyers connect through the ecosystem.",
    bullets: ["GrownBy connection", "SNAP-aware sales pathway", "Products from BFF and partners"],
  },
  {
    id: "grower",
    title: "Grower",
    subtitle: "Connect producers to opportunity.",
    purpose: "Support growers with market access, supply coordination, training, and ecosystem participation.",
    bullets: ["Grower registration", "Crop and inventory planning", "Market participation"],
  },
  {
    id: "youth",
    title: "Youth Workforce",
    subtitle: "Skills, responsibility, and future readiness.",
    purpose: "Guide Cultivators through attendance, safety, teamwork, daily rhythm, reflection, and work-based learning.",
    bullets: ["Morning check-in", "Daily assignments", "End-of-day reflection"],
  },
  {
    id: "partner",
    title: "Partner",
    subtitle: "Align resources and collaboration.",
    purpose: "Help funders, schools, agencies, and sponsors understand where they fit and how to contribute.",
    bullets: ["Program alignment", "Support requests", "Shared outcomes"],
  },
  {
    id: "valueAdded",
    title: "Value-Added Producer",
    subtitle: "Turn harvest into products.",
    purpose: "Support producers making sauces, herbs, teas, prepared foods, bundles, and community food products.",
    bullets: ["Product readiness", "Kitchen and labeling needs", "Marketplace connection"],
  },
  {
    id: "supervisor",
    title: "Supervisor",
    subtitle: "Track youth safely and responsibly.",
    purpose: "Give aides and supervisors one place to monitor attendance, wellness, safety, skills, parent summaries, and incidents.",
    bullets: ["Attendance and PPE", "Wellness and safety", "Parent-visible summaries"],
  },
  {
    id: "missionControl",
    title: "Mission Control",
    subtitle: "Launch-day operating view.",
    purpose: "Give leadership a fast view of attendance, alerts, program flow, teams, and follow-up priorities.",
    bullets: ["Daily counts", "Wellness alerts", "Team readiness"],
  },
];

function labelFor(screen: EcosystemScreen) {
  const found = pathwayCards.find((p) => p.id === screen);
  return found?.title || "Home";
}

function EcosystemNav({ current, navigate }: { current: EcosystemScreen; navigate: (screen: EcosystemScreen) => void }) {
  const navItems: { id: EcosystemScreen; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "guest", label: "Guest" },
    { id: "customer", label: "Customer" },
    { id: "marketplace", label: "Marketplace" },
    { id: "grower", label: "Grower" },
    { id: "youth", label: "Youth Workforce" },
    { id: "partner", label: "Partner" },
    { id: "valueAdded", label: "Value-Added" },
    { id: "supervisor", label: "Supervisor" },
    { id: "missionControl", label: "Mission Control" },
  ];

  return (
    <div className="sticky top-0 z-50 border-b border-emerald-200/70 bg-white/95 px-4 py-3 text-emerald-950 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <button
          onClick={() => navigate("home")}
          className="w-fit rounded-2xl bg-emerald-800 px-4 py-2 text-sm font-black text-white shadow hover:bg-emerald-700"
        >
          ← Return to Ecosystem
        </button>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                current === item.id
                  ? "border-amber-300 bg-amber-200 text-emerald-950"
                  : "border-emerald-200 bg-emerald-50 text-emerald-950 hover:bg-emerald-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<EcosystemScreen>("home");

  function navigate(next: EcosystemScreen) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (screen === "supervisor") {
    return <SupervisorDashboard current={screen} navigate={navigate} />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-lime-950 text-white">
      <EcosystemNav current={screen} navigate={navigate} />

      {screen === "home" ? (
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur md:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Bronson Family Farm</p>
            <h1 className="mt-3 text-3xl font-black md:text-6xl">Online Ecosystem Launch Hub</h1>
            <p className="mt-4 max-w-4xl text-lg text-emerald-50">
              Enter the connected food ecosystem through any role. No pathway should trap the user. Every pathway can return home, move to Marketplace, connect to Growers, or enter Supervisor operations.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <LaunchMetric label="Core Navigation" value="Restored" />
              <LaunchMetric label="Supervisor" value="Connected" />
              <LaunchMetric label="Role Pathways" value="Open" />
              <LaunchMetric label="Launch Status" value="Testing" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pathwayCards.map((card) => (
              <button
                key={card.id}
                onClick={() => navigate(card.id)}
                className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left shadow-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-amber-200">{card.subtitle}</p>
                <h2 className="mt-2 text-2xl font-black">{card.title}</h2>
                <p className="mt-3 text-sm text-emerald-50/90">{card.purpose}</p>
                <div className="mt-4 space-y-2">
                  {card.bullets.map((bullet) => (
                    <p key={bullet} className="rounded-2xl bg-white/10 px-3 py-2 text-sm">✓ {bullet}</p>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </main>
      ) : (
        <PathwayPage screen={screen} navigate={navigate} />
      )}
    </section>
  );
}

function LaunchMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">{label}</p>
      <p className="mt-1 text-2xl font-black text-amber-200">{value}</p>
    </div>
  );
}

function PathwayPage({ screen, navigate }: { screen: EcosystemScreen; navigate: (screen: EcosystemScreen) => void }) {
  const card = pathwayCards.find((p) => p.id === screen);
  if (!card) return null;

  const actionMap: Record<EcosystemScreen, { primary: EcosystemScreen; secondary: EcosystemScreen; note: string }> = {
    home: { primary: "guest", secondary: "marketplace", note: "Choose a pathway to begin." },
    guest: { primary: "marketplace", secondary: "partner", note: "Guests learn the story, then move toward buying, volunteering, or partnering." },
    customer: { primary: "marketplace", secondary: "grower", note: "Customers can purchase produce or learn where food comes from." },
    marketplace: { primary: "customer", secondary: "grower", note: "Marketplace connects buyers, produce, growers, value-added products, and GrownBy." },
    grower: { primary: "marketplace", secondary: "valueAdded", note: "Growers connect inventory, crops, supply, and market participation." },
    youth: { primary: "supervisor", secondary: "missionControl", note: "Youth Workforce connects daily rhythm to supervisor tracking and mission control." },
    partner: { primary: "missionControl", secondary: "marketplace", note: "Partners see needs, outcomes, support opportunities, and shared impact." },
    valueAdded: { primary: "marketplace", secondary: "grower", note: "Value-added producers connect products to growers and marketplace opportunities." },
    supervisor: { primary: "missionControl", secondary: "youth", note: "Supervisors track safety, attendance, wellness, and progress." },
    missionControl: { primary: "supervisor", secondary: "marketplace", note: "Mission Control watches daily operations, alerts, teams, and launch readiness." },
  };

  const actions = actionMap[screen];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur md:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Bronson Family Farm Pathway</p>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">{card.title}</h1>
        <p className="mt-2 text-xl text-emerald-100">{card.subtitle}</p>
        <p className="mt-4 max-w-4xl text-base text-emerald-50/90">{card.purpose}</p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl bg-white p-5 text-emerald-950">
            <h2 className="text-2xl font-black">What this pathway does</h2>
            <div className="mt-4 grid gap-3">
              {card.bullets.map((bullet) => (
                <div key={bullet} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 font-bold">✓ {bullet}</div>
              ))}
            </div>
            {screen === "marketplace" && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
                <b>GrownBy connection:</b> Use this pathway to direct customers to Bronson Family Farm products and SNAP-aware purchasing.
                <div className="mt-3">
                  <a
                    href="https://grownby.com/farms/bronson-family-farm"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-xl bg-emerald-800 px-4 py-2 font-black text-white"
                  >
                    Open Bronson Family Farm on GrownBy
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
            <h2 className="text-2xl font-black">Next Move</h2>
            <p className="mt-3 text-sm text-emerald-50/90">{actions.note}</p>
            <div className="mt-5 grid gap-3">
              <button onClick={() => navigate(actions.primary)} className="rounded-2xl bg-amber-300 px-5 py-3 font-black text-emerald-950 shadow hover:bg-amber-200">
                Continue to {labelFor(actions.primary)}
              </button>
              <button onClick={() => navigate(actions.secondary)} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-black text-white hover:bg-white/15">
                Go to {labelFor(actions.secondary)}
              </button>
              <button onClick={() => navigate("home")} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 font-black text-emerald-950 hover:bg-white">
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



type YouthStatus = "Present" | "Absent" | "Late" | "Excused";
type MoodStatus = "Ready" | "Okay" | "Tired" | "Concerned" | "Needs Support";
type SafetyStatus = "Cleared" | "Needs PPE" | "Needs Water" | "Medical Attention" | "Supervisor Review";
type AlertLevel = "Green" | "Yellow" | "Red";
type TransportStatus = "Parent Drop-Off" | "Bus/Van" | "Walked" | "Staff Pickup" | "Unknown";
type LunchStatus = "Not Started" | "Out" | "Returned";

type YouthRecord = {
  id: string;
  name: string;
  age: number;
  team: string;
  guardian: string;
  guardianPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  transportation: TransportStatus;
  allergies?: string;
  medications?: string;
  notes?: string;
};

type DailyRecord = {
  id: string;
  date: string;
  youthId: string;
  supervisor: string;
  attendance: YouthStatus;
  arrivalTime: string;
  clockIn: string;
  lunchStatus: LunchStatus;
  lunchOut: string;
  lunchIn: string;
  clockOut: string;
  totalHours: number;
  mood: MoodStatus;
  safety: SafetyStatus;
  alertLevel: AlertLevel;
  ppe: boolean;
  water: boolean;
  meal: boolean;
  slept: boolean;
  feelsSafe: boolean;
  needsStaff: boolean;
  wellnessNote: string;
  transportationToday: TransportStatus;
  taskArea: string;
  dailyGoal: string;
  goalCompleted: boolean;
  skillsObserved: string[];
  badges: string[];
  supervisorNote: string;
  parentSummary: string;
  parentVisible: boolean;
  incident: boolean;
  incidentNote: string;
  parentContactNeeded: boolean;
  followUpNeeded: boolean;
};

const STORAGE_KEY = "bff_supervisor_dashboard_records_launch_v2";

const defaultYouth: YouthRecord[] = [
  {
    id: "y-001",
    name: "Youth Participant 1",
    age: 15,
    team: "Regenerative Agriculture",
    guardian: "Parent/Guardian",
    guardianPhone: "(330) 000-0000",
    emergencyContact: "Emergency Contact",
    emergencyPhone: "(330) 000-0000",
    transportation: "Parent Drop-Off",
    allergies: "Not listed",
    medications: "Not listed",
    notes: "Demo record. Replace with registered youth from Supabase registration.",
  },
  {
    id: "y-002",
    name: "Youth Participant 2",
    age: 16,
    team: "Guest Services & Tourism",
    guardian: "Parent/Guardian",
    guardianPhone: "(330) 000-0000",
    emergencyContact: "Emergency Contact",
    emergencyPhone: "(330) 000-0000",
    transportation: "Bus/Van",
    allergies: "Not listed",
    medications: "Not listed",
    notes: "Demo record. Replace with registered youth from Supabase registration.",
  },
  {
    id: "y-003",
    name: "Youth Participant 3",
    age: 14,
    team: "Infrastructure & Safety",
    guardian: "Parent/Guardian",
    guardianPhone: "(330) 000-0000",
    emergencyContact: "Emergency Contact",
    emergencyPhone: "(330) 000-0000",
    transportation: "Parent Drop-Off",
    allergies: "Not listed",
    medications: "Not listed",
    notes: "Demo record. Replace with registered youth from Supabase registration.",
  },
];

const skillOptions = [
  "Arrived prepared",
  "Used PPE correctly",
  "Followed safety directions",
  "Worked with team",
  "Completed assigned task",
  "Asked for help appropriately",
  "Showed leadership",
  "Supported another youth",
  "Improved focus",
  "Learned new farm skill",
  "Customer service",
  "Communication",
];

const badgeOptions = [
  "Reliability",
  "Safety",
  "Teamwork",
  "Leadership",
  "Communication",
  "Agriculture Skills",
  "Customer Service",
  "Problem Solving",
  "Initiative",
  "Care for the Land",
];

const taskAreas = [
  "Morning Circle",
  "Regenerative Agriculture",
  "Grow Area",
  "Infrastructure",
  "Apiary & Pollination",
  "Culinary / Nutrition",
  "Guest Services",
  "Marketplace",
  "Media / Storytelling",
  "Safety & Logistics",
];

const transports: TransportStatus[] = ["Parent Drop-Off", "Bus/Van", "Walked", "Staff Pickup", "Unknown"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function currentTime() {
  return new Date().toTimeString().slice(0, 5);
}

function timeToMinutes(value: string) {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function calculateHours(clockIn: string, clockOut: string, lunchOut: string, lunchIn: string) {
  const start = timeToMinutes(clockIn);
  const end = timeToMinutes(clockOut);
  if (start === null || end === null || end <= start) return 0;
  let lunch = 0;
  const lOut = timeToMinutes(lunchOut);
  const lIn = timeToMinutes(lunchIn);
  if (lOut !== null && lIn !== null && lIn > lOut) lunch = lIn - lOut;
  return Math.max(0, Math.round(((end - start - lunch) / 60) * 100) / 100);
}

function inferAlert(record: DailyRecord): AlertLevel {
  if (record.incident || record.safety === "Medical Attention" || record.mood === "Needs Support" || record.parentContactNeeded) return "Red";
  if (record.safety !== "Cleared" || record.mood === "Concerned" || record.needsStaff || !record.water || !record.meal || !record.feelsSafe || record.followUpNeeded) return "Yellow";
  return "Green";
}

function makeRecord(youthId: string, supervisor: string): DailyRecord {
  const youth = defaultYouth.find((y) => y.id === youthId);
  return {
    id: `${todayISO()}-${youthId}`,
    date: todayISO(),
    youthId,
    supervisor,
    attendance: "Present",
    arrivalTime: "",
    clockIn: "",
    lunchStatus: "Not Started",
    lunchOut: "",
    lunchIn: "",
    clockOut: "",
    totalHours: 0,
    mood: "Ready",
    safety: "Cleared",
    alertLevel: "Green",
    ppe: false,
    water: false,
    meal: false,
    slept: false,
    feelsSafe: true,
    needsStaff: false,
    wellnessNote: "",
    transportationToday: youth?.transportation || "Unknown",
    taskArea: youth?.team || "Morning Circle",
    dailyGoal: "",
    goalCompleted: false,
    skillsObserved: [],
    badges: [],
    supervisorNote: "",
    parentSummary: "",
    parentVisible: true,
    incident: false,
    incidentNote: "",
    parentContactNeeded: false,
    followUpNeeded: false,
  };
}

function loadRecords(): DailyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecords(records: DailyRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function toCSV(records: DailyRecord[]) {
  const header = [
    "date", "youth", "team", "supervisor", "attendance", "arrivalTime", "clockIn", "lunchOut", "lunchIn", "clockOut", "totalHours", "mood", "safety", "alertLevel", "ppe", "water", "meal", "slept", "feelsSafe", "needsStaff", "transportationToday", "taskArea", "dailyGoal", "goalCompleted", "skillsObserved", "badges", "supervisorNote", "parentSummary", "parentVisible", "incident", "incidentNote", "parentContactNeeded", "followUpNeeded"
  ];

  const rows = records.map((r) => {
    const youth = defaultYouth.find((y) => y.id === r.youthId);
    return [
      r.date, youth?.name || r.youthId, youth?.team || "", r.supervisor, r.attendance, r.arrivalTime, r.clockIn, r.lunchOut, r.lunchIn, r.clockOut, r.totalHours, r.mood, r.safety, r.alertLevel, r.ppe ? "Yes" : "No", r.water ? "Yes" : "No", r.meal ? "Yes" : "No", r.slept ? "Yes" : "No", r.feelsSafe ? "Yes" : "No", r.needsStaff ? "Yes" : "No", r.transportationToday, r.taskArea, r.dailyGoal, r.goalCompleted ? "Yes" : "No", r.skillsObserved.join("; "), r.badges.join("; "), r.supervisorNote, r.parentSummary, r.parentVisible ? "Yes" : "No", r.incident ? "Yes" : "No", r.incidentNote, r.parentContactNeeded ? "Yes" : "No", r.followUpNeeded ? "Yes" : "No"
    ];
  });

  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

function SupervisorDashboard({ current, navigate }: { current: EcosystemScreen; navigate: (screen: EcosystemScreen) => void }) {
  const [supervisor, setSupervisor] = useState("Supervisor Aide");
  const [selectedYouthId, setSelectedYouthId] = useState(defaultYouth[0].id);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [filterTeam, setFilterTeam] = useState("All Teams");

  useEffect(() => setRecords(loadRecords()), []);
  useEffect(() => saveRecords(records), [records]);

  const teams = useMemo(() => ["All Teams", ...Array.from(new Set(defaultYouth.map((y) => y.team)))], []);
  const visibleYouth = useMemo(() => (filterTeam === "All Teams" ? defaultYouth : defaultYouth.filter((y) => y.team === filterTeam)), [filterTeam]);
  const selectedYouth = defaultYouth.find((y) => y.id === selectedYouthId) || defaultYouth[0];
  const todayRecord = records.find((r) => r.date === todayISO() && r.youthId === selectedYouth.id) || makeRecord(selectedYouth.id, supervisor);
  const todayRecords = records.filter((r) => r.date === todayISO());
  const weeklyHours = records.filter((r) => r.youthId === selectedYouth.id).reduce((sum, r) => sum + (r.totalHours || 0), 0);

  const stats = {
    present: todayRecords.filter((r) => r.attendance === "Present").length,
    absent: todayRecords.filter((r) => r.attendance === "Absent").length,
    late: todayRecords.filter((r) => r.attendance === "Late").length,
    yellow: todayRecords.filter((r) => r.alertLevel === "Yellow").length,
    red: todayRecords.filter((r) => r.alertLevel === "Red").length,
    hours: Math.round(todayRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0) * 100) / 100,
  };

  function updateRecord(next: DailyRecord) {
    const recalculated = {
      ...next,
      supervisor,
      totalHours: calculateHours(next.clockIn, next.clockOut, next.lunchOut, next.lunchIn),
    };
    recalculated.alertLevel = inferAlert(recalculated);
    const exists = records.some((r) => r.id === recalculated.id);
    setRecords(exists ? records.map((r) => (r.id === recalculated.id ? recalculated : r)) : [...records, recalculated]);
  }

  function stamp(field: "clockIn" | "lunchOut" | "lunchIn" | "clockOut" | "arrivalTime") {
    const time = currentTime();
    const lunchStatus: LunchStatus = field === "lunchOut" ? "Out" : field === "lunchIn" ? "Returned" : todayRecord.lunchStatus;
    updateRecord({ ...todayRecord, [field]: time, lunchStatus } as DailyRecord);
  }

  function toggleArray(field: "skillsObserved" | "badges", value: string) {
    const list = todayRecord[field];
    const nextList = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
    updateRecord({ ...todayRecord, [field]: nextList } as DailyRecord);
  }

  function exportCSV() {
    const blob = new Blob([toCSV(records)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bff-supervisor-records-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="min-h-screen w-full bg-emerald-950 text-white">
      <EcosystemNav current={current} navigate={navigate} />
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="mb-4 rounded-3xl border border-emerald-300/20 bg-white/10 p-4 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">Bronson Family Farm</p>
              <h1 className="text-2xl font-bold md:text-4xl">Launch-Ready Supervisor Dashboard</h1>
              <p className="mt-1 max-w-4xl text-sm text-emerald-50/90">Track attendance, clock-in/out, wellness, safety, work assignments, skills badges, parent-visible summaries, private notes, follow-up flags, and incident records.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input className="rounded-2xl border border-white/20 bg-white/90 px-4 py-2 text-sm text-emerald-950 outline-none" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} aria-label="Supervisor name" />
              <button onClick={exportCSV} className="rounded-2xl bg-amber-300 px-4 py-2 text-sm font-bold text-emerald-950 shadow-lg hover:bg-amber-200">Export Records</button>
            </div>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-6">
          <StatCard label="Present" value={stats.present} />
          <StatCard label="Absent" value={stats.absent} />
          <StatCard label="Late" value={stats.late} />
          <StatCard label="Yellow Alerts" value={stats.yellow} alert={stats.yellow > 0} tone="yellow" />
          <StatCard label="Red Alerts" value={stats.red} alert={stats.red > 0} tone="red" />
          <StatCard label="Hours Today" value={stats.hours} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-3xl border border-emerald-300/20 bg-white/10 p-4 shadow-xl backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Assigned Youth</h2>
              <select className="rounded-xl bg-white px-3 py-2 text-xs text-emerald-950" value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}>
                {teams.map((team) => <option key={team}>{team}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              {visibleYouth.map((youth) => {
                const rec = records.find((r) => r.date === todayISO() && r.youthId === youth.id);
                return (
                  <button key={youth.id} onClick={() => setSelectedYouthId(youth.id)} className={`w-full rounded-2xl border p-3 text-left transition ${selectedYouthId === youth.id ? "border-amber-300 bg-amber-200 text-emerald-950" : "border-white/15 bg-white/10 hover:bg-white/15"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold">{youth.name}</p>
                        <p className="text-xs opacity-80">Age {youth.age} • {youth.team}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs ${rec?.alertLevel === "Red" ? "bg-red-600 text-white" : rec?.alertLevel === "Yellow" ? "bg-amber-300 text-emerald-950" : "bg-white/20"}`}>{rec?.attendance || "Not checked"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="space-y-4">
            <div className="rounded-3xl border border-emerald-300/20 bg-white p-4 text-emerald-950 shadow-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">{selectedYouth.name}</h2>
                  <p className="text-sm text-emerald-800">{selectedYouth.team} • Guardian: {selectedYouth.guardian} • {selectedYouth.guardianPhone}</p>
                  <p className="text-xs text-emerald-700">Emergency: {selectedYouth.emergencyContact} • {selectedYouth.emergencyPhone} • Allergies: {selectedYouth.allergies} • Medications: {selectedYouth.medications}</p>
                </div>
                <div className={`rounded-2xl px-4 py-2 text-sm font-black ${todayRecord.alertLevel === "Red" ? "bg-red-600 text-white" : todayRecord.alertLevel === "Yellow" ? "bg-amber-300 text-emerald-950" : "bg-emerald-100 text-emerald-950"}`}>{todayRecord.alertLevel} Alert • {todayISO()}</div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <Panel title="Clock In / Hours">
                <div className="grid gap-2 sm:grid-cols-2">
                  <TimeButton label="Arrival" value={todayRecord.arrivalTime} onClick={() => stamp("arrivalTime")} />
                  <TimeButton label="Clock In" value={todayRecord.clockIn} onClick={() => stamp("clockIn")} />
                  <TimeButton label="Lunch Out" value={todayRecord.lunchOut} onClick={() => stamp("lunchOut")} />
                  <TimeButton label="Lunch In" value={todayRecord.lunchIn} onClick={() => stamp("lunchIn")} />
                  <TimeButton label="Clock Out" value={todayRecord.clockOut} onClick={() => stamp("clockOut")} />
                  <div className="rounded-2xl bg-emerald-50 p-3 text-sm font-black">Today: {todayRecord.totalHours || 0} hrs<br />Youth Total: {Math.round(weeklyHours * 100) / 100} hrs</div>
                </div>
                <Label text="Attendance"><select className="input" value={todayRecord.attendance} onChange={(e) => updateRecord({ ...todayRecord, attendance: e.target.value as YouthStatus })}>{["Present", "Absent", "Late", "Excused"].map((v) => <option key={v}>{v}</option>)}</select></Label>
              </Panel>

              <Panel title="Daily Wellness Check">
                <Label text="Mood / Readiness"><select className="input" value={todayRecord.mood} onChange={(e) => updateRecord({ ...todayRecord, mood: e.target.value as MoodStatus })}>{["Ready", "Okay", "Tired", "Concerned", "Needs Support"].map((v) => <option key={v}>{v}</option>)}</select></Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Check label="Ate / Food OK" checked={todayRecord.meal} onChange={(v) => updateRecord({ ...todayRecord, meal: v })} />
                  <Check label="Has Water" checked={todayRecord.water} onChange={(v) => updateRecord({ ...todayRecord, water: v })} />
                  <Check label="Slept Last Night" checked={todayRecord.slept} onChange={(v) => updateRecord({ ...todayRecord, slept: v })} />
                  <Check label="Feels Safe Today" checked={todayRecord.feelsSafe} onChange={(v) => updateRecord({ ...todayRecord, feelsSafe: v })} />
                  <Check label="Needs Staff Support" checked={todayRecord.needsStaff} onChange={(v) => updateRecord({ ...todayRecord, needsStaff: v })} />
                  <Check label="Follow-Up Needed" checked={todayRecord.followUpNeeded} onChange={(v) => updateRecord({ ...todayRecord, followUpNeeded: v })} />
                </div>
                <textarea className="input min-h-[84px]" placeholder="Wellness note for staff only..." value={todayRecord.wellnessNote} onChange={(e) => updateRecord({ ...todayRecord, wellnessNote: e.target.value })} />
              </Panel>

              <Panel title="Safety / Emergency">
                <Label text="Safety Status"><select className="input" value={todayRecord.safety} onChange={(e) => updateRecord({ ...todayRecord, safety: e.target.value as SafetyStatus })}>{["Cleared", "Needs PPE", "Needs Water", "Medical Attention", "Supervisor Review"].map((v) => <option key={v}>{v}</option>)}</select></Label>
                <Label text="Transportation Today"><select className="input" value={todayRecord.transportationToday} onChange={(e) => updateRecord({ ...todayRecord, transportationToday: e.target.value as TransportStatus })}>{transports.map((v) => <option key={v}>{v}</option>)}</select></Label>
                <Check label="PPE Ready" checked={todayRecord.ppe} onChange={(v) => updateRecord({ ...todayRecord, ppe: v })} />
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-950"><b>Emergency:</b> {selectedYouth.emergencyContact}<br />{selectedYouth.emergencyPhone}<br /><b>Allergies:</b> {selectedYouth.allergies}</div>
              </Panel>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Panel title="Work Assignment & Daily Goal">
                <Label text="Team / Task Area"><select className="input" value={todayRecord.taskArea} onChange={(e) => updateRecord({ ...todayRecord, taskArea: e.target.value })}>{taskAreas.map((v) => <option key={v}>{v}</option>)}</select></Label>
                <Label text="Daily Goal"><input className="input" placeholder="What should this youth accomplish today?" value={todayRecord.dailyGoal} onChange={(e) => updateRecord({ ...todayRecord, dailyGoal: e.target.value })} /></Label>
                <Check label="Goal Completed" checked={todayRecord.goalCompleted} onChange={(v) => updateRecord({ ...todayRecord, goalCompleted: v })} />
                <p className="mb-2 text-sm font-bold text-emerald-900">Skills Observed</p>
                <div className="grid gap-2 sm:grid-cols-2">{skillOptions.map((skill) => <TogglePill key={skill} label={skill} active={todayRecord.skillsObserved.includes(skill)} onClick={() => toggleArray("skillsObserved", skill)} />)}</div>
              </Panel>

              <Panel title="Workforce Skills Badges">
                <p className="text-sm text-emerald-800">Select badges earned or demonstrated today. These can feed certificates and progress reports.</p>
                <div className="grid gap-2 sm:grid-cols-2">{badgeOptions.map((badge) => <TogglePill key={badge} label={badge} active={todayRecord.badges.includes(badge)} onClick={() => toggleArray("badges", badge)} />)}</div>
              </Panel>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Panel title="Private Supervisor Notes">
                <textarea className="input min-h-[150px]" placeholder="Private staff note: behavior, progress, needs, strengths, follow-up. This should NOT go to the parent portal." value={todayRecord.supervisorNote} onChange={(e) => updateRecord({ ...todayRecord, supervisorNote: e.target.value })} />
              </Panel>
              <Panel title="Parent / Guardian Feed">
                <textarea className="input min-h-[118px]" placeholder="Parent-visible: attendance, hours, accomplishments, reminders. Avoid private concerns or investigative notes." value={todayRecord.parentSummary} onChange={(e) => updateRecord({ ...todayRecord, parentSummary: e.target.value })} />
                <Check label="Publish to Parent Portal" checked={todayRecord.parentVisible} onChange={(v) => updateRecord({ ...todayRecord, parentVisible: v })} />
              </Panel>
            </div>

            <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-950 shadow-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div><h3 className="text-xl font-black">Incident / Support Flag</h3><p className="text-sm">Use for immediate follow-up, safety review, parent contact, medical attention, behavioral support, or transportation concern.</p></div>
                <div className="grid gap-2 sm:grid-cols-2"><Check label="Flag Incident" checked={todayRecord.incident} onChange={(v) => updateRecord({ ...todayRecord, incident: v })} /><Check label="Parent Contact Needed" checked={todayRecord.parentContactNeeded} onChange={(v) => updateRecord({ ...todayRecord, parentContactNeeded: v })} /></div>
              </div>
              <textarea className="mt-3 w-full rounded-2xl border border-red-200 bg-white p-3 text-sm outline-none" placeholder="Incident details, action taken, who was notified, next step..." value={todayRecord.incidentNote} onChange={(e) => updateRecord({ ...todayRecord, incidentNote: e.target.value })} />
            </div>

            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-900 p-4 text-white shadow-xl">
              <h3 className="text-xl font-black">Today’s Parent-Visible Snapshot</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-4"><Snapshot label="Attendance" value={todayRecord.attendance} /><Snapshot label="Hours" value={`${todayRecord.totalHours || 0}`} /><Snapshot label="Task" value={todayRecord.taskArea} /><Snapshot label="Safety" value={todayRecord.safety} /></div>
              <p className="mt-3 rounded-2xl bg-white/10 p-3 text-sm">{todayRecord.parentVisible ? todayRecord.parentSummary || "No parent summary has been entered yet." : "This record is currently hidden from the parent portal."}</p>
            </div>
          </main>
        </div>
      </div>
      <style>{`.input{width:100%;border-radius:1rem;border:1px solid rgba(6,95,70,.2);background:white;padding:.75rem;font-size:.875rem;color:#064e3b;outline:none}.input:focus{border-color:#047857;box-shadow:0 0 0 3px rgba(4,120,87,.15)}`}</style>
    </section>
  );
}

function StatCard({ label, value, alert = false, tone = "green" }: { label: string; value: number; alert?: boolean; tone?: "green" | "yellow" | "red" }) {
  const alertClass = tone === "red" ? "border-red-200 bg-red-100 text-red-950" : tone === "yellow" ? "border-amber-200 bg-amber-100 text-emerald-950" : "border-emerald-300/20 bg-white/10 text-white";
  return <div className={`rounded-3xl border p-4 shadow-xl ${alert ? alertClass : "border-emerald-300/20 bg-white/10 text-white"}`}><p className="text-xs uppercase tracking-[0.2em] opacity-75">{label}</p><p className="mt-1 text-3xl font-black">{value}</p></div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-emerald-200 bg-white p-4 text-emerald-950 shadow-xl"><h3 className="mb-3 text-xl font-black">{title}</h3><div className="space-y-3">{children}</div></section>;
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-sm font-bold text-emerald-900">{text}</span>{children}</label>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-950"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}</label>;
}

function TogglePill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold ${active ? "border-emerald-700 bg-emerald-700 text-white" : "border-emerald-200 bg-emerald-50 text-emerald-950"}`}>{label}</button>;
}

function TimeButton({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-left text-sm font-bold text-emerald-950 hover:bg-emerald-100"><span className="block text-xs uppercase tracking-[0.15em] text-emerald-700">{label}</span>{value || "Tap to record"}</button>;
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/10 p-3"><p className="text-xs uppercase tracking-[0.2em] text-emerald-100">{label}</p><p className="mt-1 font-bold">{value}</p></div>;
}
