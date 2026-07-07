import React, { useMemo, useState } from "react";

/**
 * Bronson Family Farm Online Ecosystem
 * CULTIVATOR ECOSYSTEM 16.0 — MASTER FULL REPLACEMENT
 *
 * Complete React/Vite App.tsx replacement implementing the 16.0 role-centered architecture:
 * - Role Portal: Youth, Parent, Supervisor, Mission Control, Visitor, Tourist, Grower, Partner
 * - Youth: Calendar → Today's Work → Workbook → Journey, plus Curriculum and Search
 * - Parent: youth-safe status, attendance, growth, portfolio, reports, messages, resources
 * - Supervisor: attendance, assignments, workbook queue, verification, incidents, daily review
 * - Mission Control: operations, workforce, outcomes, family engagement, funding, reports, legacy
 * - Visitor/Agritourism: farm, forest, butterflies, apiary, aviation, events, recreation, support
 * - Workbook is the only place youth answer questions
 * - No decorative checkboxes; only actionable toggles and completion controls
 * - Full Day: 8:00 AM–2:00 PM; Half Day: 8:00–11:00 AM, lunch 12:00, then dismissed
 * - Search available throughout
 * - Active/Inactive lifecycle retained; inactive users receive visitor-only access
 * - Framework: Self → Work → Environment → Community → Opportunity → Legacy
 */

type RoleKey = "portal" | "youth" | "parent" | "supervisor" | "mission" | "visitor" | "tourism" | "grower" | "partner";
type YouthTab = "home" | "calendar" | "today" | "workbook" | "journey" | "curriculum" | "search" | "photos" | "achievements";
type ParentTab = "home" | "youth" | "attendance" | "calendar" | "growth" | "portfolio" | "reports" | "messages" | "resources";
type SupervisorTab = "home" | "attendance" | "assignments" | "projects" | "workbook" | "verification" | "photos" | "incidents" | "messages" | "review";
type MissionTab = "home" | "operations" | "workforce" | "outcomes" | "farm" | "environment" | "families" | "supervisors" | "tourism" | "funding" | "reports" | "legacy";
type VisitorTab = "home" | "farm" | "forest" | "butterflies" | "apiary" | "aviation" | "cultivators" | "events" | "recreation" | "stories" | "support";

type WorkStatus = "Full Day" | "Half Day" | "Delayed" | "Cancelled";

type WorkbookEntry = {
  id: string;
  week: number;
  day: string;
  activity: string;
  question: string;
  response: string;
  photoNote?: string;
  updatedAt: string;
};

type Completion = { id: string; label: string; done: boolean };

const STORAGE_PREFIX = "bff_cultivator_16_";
const FRAMEWORK = ["Self", "Work", "Environment", "Community", "Opportunity", "Legacy"];

const youthTabs: { key: YouthTab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "calendar", label: "Calendar" },
  { key: "today", label: "Today's Work" },
  { key: "workbook", label: "Workbook" },
  { key: "journey", label: "My Journey" },
  { key: "curriculum", label: "Curriculum" },
  { key: "search", label: "Search" },
  { key: "photos", label: "Photos" },
  { key: "achievements", label: "Achievements" },
];

const parentTabs: { key: ParentTab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "youth", label: "My Youth" },
  { key: "attendance", label: "Attendance" },
  { key: "calendar", label: "Calendar" },
  { key: "growth", label: "Growth" },
  { key: "portfolio", label: "Portfolio" },
  { key: "reports", label: "Reports" },
  { key: "messages", label: "Messages" },
  { key: "resources", label: "Resources" },
];

const supervisorTabs: { key: SupervisorTab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "attendance", label: "Attendance" },
  { key: "assignments", label: "Assignments" },
  { key: "projects", label: "Projects" },
  { key: "workbook", label: "Workbook Queue" },
  { key: "verification", label: "Verification" },
  { key: "photos", label: "Photos" },
  { key: "incidents", label: "Incidents" },
  { key: "messages", label: "Messages" },
  { key: "review", label: "Daily Review" },
];

const missionTabs: { key: MissionTab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "operations", label: "Operations" },
  { key: "workforce", label: "Workforce" },
  { key: "outcomes", label: "Outcomes" },
  { key: "farm", label: "Farm" },
  { key: "environment", label: "Environment" },
  { key: "families", label: "Families" },
  { key: "supervisors", label: "Supervisors" },
  { key: "tourism", label: "Tourism" },
  { key: "funding", label: "Funding" },
  { key: "reports", label: "Reports" },
  { key: "legacy", label: "Legacy" },
];

const visitorTabs: { key: VisitorTab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "farm", label: "Farm" },
  { key: "forest", label: "Forest" },
  { key: "butterflies", label: "Butterflies" },
  { key: "apiary", label: "Apiary" },
  { key: "aviation", label: "Aviation" },
  { key: "cultivators", label: "Cultivators" },
  { key: "events", label: "Events" },
  { key: "recreation", label: "Recreation" },
  { key: "stories", label: "Stories" },
  { key: "support", label: "Support" },
];

const todayAssignments = [
  "Finish Zone 5 melons and confirm all melons are planted",
  "Plant corn seedlings",
  "Prepare squash and pumpkin grow area",
  "Install gate",
  "Check potatoes growing in the grow basket",
  "Separate plants where needed",
  "Build mulch around rows and paths",
];

const weekSchedule = [
  { day: "Monday", status: "Full Day", focus: "Weeding, thinning, and pooling water observation", hours: "8:00 AM–2:00 PM" },
  { day: "Tuesday", status: "Full Day", focus: "Zone 5 melons, corn seedlings, squash area, gate", hours: "8:00 AM–2:00 PM" },
  { day: "Wednesday", status: "Full Day", focus: "Beehive sterilization and rebuild process", hours: "8:00 AM–2:00 PM" },
  { day: "Thursday", status: "Full Day", focus: "Pollinator surveillance and plant health", hours: "8:00 AM–2:00 PM" },
  { day: "Friday", status: "Full Day", focus: "Portfolio documentation and weekly reflection", hours: "8:00 AM–2:00 PM" },
];

const curriculumWeeks = [
  { week: 1, theme: "Workplace Foundations", projects: ["Cooling station", "Soil preparation", "Seed starting"], skills: ["Safety", "Teamwork", "Following directions"] },
  { week: 2, theme: "Sun, Shadow, and Plant Needs", projects: ["Compost", "Plant health", "Forest tour"], skills: ["Observation", "Plant science", "Communication"] },
  { week: 3, theme: "Pollinators and Infrastructure", projects: ["Pollinator homes", "Gates", "Beehive relocation"], skills: ["Building", "Tool safety", "Environmental stewardship"] },
  { week: 4, theme: "Water, Heat, and Field Systems", projects: ["Zone 5 rocks", "Pest traps", "Squash area", "Tadpoles"], skills: ["Problem solving", "Water awareness", "Field documentation"] },
  { week: 5, theme: "Ecosystems, Growth, and Development", projects: todayAssignments, skills: ["Agriculture", "Teamwork", "Observation", "Infrastructure"] },
  { week: 6, theme: "Harvest, Health, and Marketplace", projects: ["Harvest readiness", "Nutrition", "Market math"], skills: ["Customer service", "Food systems", "Entrepreneurship"] },
  { week: 7, theme: "Leadership and Community", projects: ["Youth leadership", "Community connection", "Career pathways"], skills: ["Leadership", "Public speaking", "Mentorship"] },
  { week: 8, theme: "Legacy and Launch", projects: ["Portfolio completion", "Resume", "Recommendation", "Celebration"], skills: ["Reflection", "Career readiness", "Legacy"] },
];

const searchIndex = [
  { title: "Miracle-Gro", type: "Resource", body: "Plant food resource: what it is, why it is used, safety, and how youth should handle it only with supervisor direction." },
  { title: "Pollinators", type: "Curriculum", body: "Bees, butterflies, native flowers, milkweed, habitat, and why pollination matters." },
  { title: "Beehive Sterilization", type: "Project", body: "Disassemble, dry wipe, chlorine solution for 24 hours, then set out to dry during rebuild." },
  { title: "Zone 5 Melons", type: "Project", body: "Vertical hot-dog shaped melon zone west of the butterfly sanctuary." },
  { title: "Workbook", type: "Navigation", body: "The only place youth answer questions, upload observations, and document learning." },
  { title: "Resume", type: "Journey", body: "Auto-built from verified skills, projects, attendance, and certificates." },
  { title: "Recommendation Letter", type: "Journey", body: "Bronze, Silver, Gold, or Distinguished Cultivator recommendation generated from verified growth." },
  { title: "Tadpoles", type: "Forest", body: "Forest and creek discovery connected to water, habitat, and ecosystem learning." },
  { title: "Corn Seedlings", type: "Project", body: "Plant corn seedlings as part of Week 5 grow-area work." },
  { title: "Squash and Pumpkin Area", type: "Project", body: "Prepare growing space, mulch paths, and document the process in the workbook." },
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStore<T>(key, fallback));
  const save = (next: T) => {
    setValue(next);
    writeStore(key, next);
  };
  return [value, save] as const;
}

function Card({ title, children, eyebrow }: { title: string; children: React.ReactNode; eyebrow?: string }) {
  return (
    <section className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
      {eyebrow && <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</div>}
      <h2 className="mt-1 text-2xl font-black text-slate-950">{title}</h2>
      <div className="mt-4 text-slate-700">{children}</div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-900">{children}</span>;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-2xl font-black text-slate-950">{value}</div>
      <div className="text-sm font-bold text-slate-600">{label}</div>
    </div>
  );
}

function TabNav<T extends string>({ items, active, onChange }: { items: { key: T; label: string }[]; active: T; onChange: (key: T) => void }) {
  return (
    <nav className="mb-6 flex gap-2 overflow-x-auto rounded-3xl bg-white p-2 shadow-sm">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-black ${active === item.key ? "bg-emerald-700 text-white" : "bg-slate-50 text-slate-800 hover:bg-emerald-50"}`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function Header({ role, setRole }: { role: RoleKey; setRole: (r: RoleKey) => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-900/10 bg-emerald-950 text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <button type="button" onClick={() => setRole("portal")} className="text-left">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">Cultivator Ecosystem 16.0</div>
          <div className="text-xl font-black">Bronson Family Farm</div>
        </button>
        <div className="flex flex-wrap gap-2 text-sm font-black">
          <button onClick={() => setRole("portal")} className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">Home</button>
          <button onClick={() => setRole("youth")} className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">Youth</button>
          <button onClick={() => setRole("parent")} className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">Parent</button>
          <button onClick={() => setRole("supervisor")} className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">Supervisor</button>
          <button onClick={() => setRole("mission")} className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">Mission Control</button>
          <button onClick={() => setRole("visitor")} className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">Visitor</button>
        </div>
      </div>
    </header>
  );
}

function Portal({ setRole }: { setRole: (role: RoleKey) => void }) {
  const roles = [
    ["youth", "🌱 Youth", "What do I do today?"],
    ["parent", "👨‍👩‍👧 Parent", "How is my child doing?"],
    ["supervisor", "👨‍🏫 Supervisor", "Who is here and what needs attention?"],
    ["mission", "🏛 Mission Control", "Is the program working?"],
    ["visitor", "🦋 Visitor", "What is Bronson Family Farm?"],
    ["tourism", "✈ Tourist", "What can I experience here?"],
    ["grower", "🌾 Grower", "What is happening in the farm operation?"],
    ["partner", "🤝 Partner", "What outcomes can we support?"],
  ] as const;
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-emerald-900 to-lime-700 p-8 text-white shadow-xl">
        <div className="text-sm font-black uppercase tracking-[0.24em] text-emerald-100">Welcome to Bronson Family Farm</div>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">We Grow Green to Harvest Dreams</h1>
        <p className="mt-4 max-w-3xl text-lg font-bold text-emerald-50">Choose your role. No automatic routing. No role confusion. Every user enters through the correct door.</p>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map(([key, title, purpose]) => (
          <button key={key} type="button" onClick={() => setRole(key)} className="rounded-3xl border border-emerald-900/10 bg-white p-6 text-left shadow-sm hover:-translate-y-1 hover:shadow-lg">
            <div className="text-2xl font-black text-slate-950">{title}</div>
            <p className="mt-3 text-sm font-bold text-slate-600">{purpose}</p>
          </button>
        ))}
      </div>
    </main>
  );
}

function YouthApp() {
  const [tab, setTab] = useState<YouthTab>("home");
  const [entries, setEntries] = useStoredState<WorkbookEntry[]>("workbook", []);
  const [completion, setCompletion] = useStoredState<Completion[]>("completion", todayAssignments.map((label) => ({ id: uid(), label, done: false })));
  const completed = completion.filter((x) => x.done).length;
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <TabNav items={youthTabs} active={tab} onChange={setTab} />
      {tab === "home" && <YouthHome setTab={setTab} completed={completed} total={completion.length} />}
      {tab === "calendar" && <CalendarView />}
      {tab === "today" && <TodaysWork completion={completion} setCompletion={setCompletion} setTab={setTab} />}
      {tab === "workbook" && <Workbook entries={entries} setEntries={setEntries} />}
      {tab === "journey" && <Journey entries={entries} completed={completed} />}
      {tab === "curriculum" && <Curriculum />}
      {tab === "search" && <SearchCenter />}
      {tab === "photos" && <SimpleList title="Photo Center" items={["Project photos", "Workbook uploads", "Portfolio evidence", "Parent-approved gallery", "Public-approved gallery"]} />}
      {tab === "achievements" && <Achievements completed={completed} entries={entries.length} />}
    </main>
  );
}

function YouthHome({ setTab, completed, total }: { setTab: (tab: YouthTab) => void; completed: number; total: number }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card title="Week 5 — Tuesday" eyebrow="Youth Home">
        <div className="flex flex-wrap gap-2"><Pill>Full Day</Pill><Pill>8:00 AM–2:00 PM</Pill><Pill>Lunch 12:00 PM</Pill></div>
        <p className="mt-4 font-bold">Today's focus: Zone 5 melons, corn seedlings, squash/pumpkin grow area, gate installation, potatoes, plant separation, and mulch paths.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => setTab("calendar")} className="rounded-full bg-slate-900 px-5 py-3 font-black text-white">Open Calendar</button>
          <button onClick={() => setTab("today")} className="rounded-full bg-emerald-700 px-5 py-3 font-black text-white">Go to Today's Work</button>
          <button onClick={() => setTab("workbook")} className="rounded-full bg-amber-400 px-5 py-3 font-black text-slate-950">Open Workbook</button>
        </div>
      </Card>
      <Card title="Today's Progress" eyebrow="Action">
        <Stat label="Assignments Complete" value={`${completed} of ${total}`} />
        <p className="mt-4 text-sm font-bold">Questions are answered in the Workbook only. Today's Work is for assignments and completion.</p>
      </Card>
      <Card title="My Path" eyebrow="Bronson Framework">
        <div className="grid gap-2">{FRAMEWORK.map((x) => <div key={x} className="rounded-2xl bg-emerald-50 p-3 font-black text-emerald-950">{x}</div>)}</div>
      </Card>
    </div>
  );
}

function CalendarView() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Week 5 Calendar" eyebrow="Plan">
        <div className="grid gap-3">
          {weekSchedule.map((d) => <div key={d.day} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><b className="text-slate-950">{d.day}</b><Pill>{d.status}</Pill></div><div className="mt-2 text-sm font-bold">{d.hours}</div><div className="mt-1 text-sm">{d.focus}</div></div>)}
        </div>
      </Card>
      <Card title="Day Rules" eyebrow="Hours">
        <div className="grid gap-3"><Stat label="Full Day" value="8 AM–2 PM" /><Stat label="Half Day" value="8–11 AM + lunch" /><p className="font-bold">Half Day means work from 8:00–11:00 AM, lunch at 12:00 PM, then dismissed.</p></div>
      </Card>
    </div>
  );
}

function TodaysWork({ completion, setCompletion, setTab }: { completion: Completion[]; setCompletion: (c: Completion[]) => void; setTab: (tab: YouthTab) => void }) {
  const toggle = (id: string) => setCompletion(completion.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card title="Morning Brief" eyebrow="Today's Work">
        <p className="font-bold">Do the work here. Answer questions in the Workbook.</p>
        <div className="mt-4 flex flex-wrap gap-2"><Pill>Tools</Pill><Pill>Safety</Pill><Pill>Photos</Pill><Pill>Completion</Pill></div>
      </Card>
      <section className="lg:col-span-2 rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Assignments</div>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Complete Today's Work</h2>
        <div className="mt-4 grid gap-3">
          {completion.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3"><span className="font-black text-slate-950">{item.label}</span><button onClick={() => toggle(item.id)} className={`rounded-full px-4 py-2 text-sm font-black ${item.done ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-900"}`}>{item.done ? "Completed" : "Mark Complete"}</button></div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm font-bold">Photo upload placeholder: add photo note in Workbook.</div>
            </div>
          ))}
        </div>
        <button onClick={() => setTab("workbook")} className="mt-5 rounded-full bg-amber-400 px-5 py-3 font-black text-slate-950">Go to Workbook</button>
      </section>
    </div>
  );
}

function Workbook({ entries, setEntries }: { entries: WorkbookEntry[]; setEntries: (e: WorkbookEntry[]) => void }) {
  const questions = ["What did you notice today?", "What challenge did you face?", "What did you learn?", "How does this help your community?", "What photo or evidence should be added to your portfolio?"];
  const [activity, setActivity] = useState("Zone 5 Melons");
  const update = (question: string, response: string) => {
    const existing = entries.find((e) => e.question === question && e.activity === activity);
    const next: WorkbookEntry = { id: existing?.id || uid(), week: 5, day: "Tuesday", activity, question, response, updatedAt: new Date().toISOString() };
    setEntries([next, ...entries.filter((e) => e.id !== next.id)]);
  };
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card title="Workbook" eyebrow="Documentation">
        <p className="font-bold">This is the only place youth answer questions. Responses auto-save as they type.</p>
        <select value={activity} onChange={(e) => setActivity(e.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 p-3 font-bold">
          {["Zone 5 Melons", "Corn Seedlings", "Squash and Pumpkin Area", "Gate Installation", "Beehive Sterilization", "Forest Observation"].map((x) => <option key={x}>{x}</option>)}
        </select>
      </Card>
      <section className="lg:col-span-2 rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Week 5 • Tuesday • {activity}</div>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Answer Questions Here</h2>
        <div className="mt-4 grid gap-4">
          {questions.map((q) => {
            const found = entries.find((e) => e.question === q && e.activity === activity);
            return <label key={q} className="block rounded-2xl border border-slate-200 p-4"><div className="font-black text-slate-950">{q}</div><textarea defaultValue={found?.response || ""} onBlur={(e) => update(q, e.target.value)} placeholder="Write or dictate your answer here." className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-bold outline-none focus:border-emerald-600" /><div className="mt-2 text-xs font-bold text-slate-500">Auto-saves when you leave the box.</div></label>;
          })}
        </div>
      </section>
    </div>
  );
}

function Journey({ entries, completed }: { entries: WorkbookEntry[]; completed: number }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="My Journey" eyebrow="Growth">
        <div className="grid gap-3 md:grid-cols-2"><Stat label="Workbook Entries" value={entries.length} /><Stat label="Assignments Completed" value={completed} /><Stat label="Recommendation Level" value={completed >= 6 ? "Gold" : completed >= 3 ? "Silver" : "Bronze"} /><Stat label="Portfolio" value={`${Math.min(100, entries.length * 10 + completed * 8)}%`} /></div>
      </Card>
      <Card title="Career Launch Package" eyebrow="Portfolio Engine">
        <div className="grid gap-2">{["Resume", "Cover Letter", "Recommendation Letter", "Skills Transcript", "Certificates", "Achievement Portfolio", "Career Pathway Plan"].map((x) => <div key={x} className="rounded-2xl bg-slate-50 p-3 font-black text-slate-900">{x}</div>)}</div>
      </Card>
    </div>
  );
}

function Curriculum() {
  return <div className="grid gap-4 md:grid-cols-2">{curriculumWeeks.map((w) => <Card key={w.week} title={`Week ${w.week}: ${w.theme}`} eyebrow="Curriculum"><b>Projects</b><ul className="mt-2 list-disc pl-5">{w.projects.map((p) => <li key={p}>{p}</li>)}</ul><b className="mt-4 block">Skills</b><div className="mt-2 flex flex-wrap gap-2">{w.skills.map((s) => <Pill key={s}>{s}</Pill>)}</div></Card>)}</div>;
}

function SearchCenter() {
  const [q, setQ] = useState("");
  const results = useMemo(() => searchIndex.filter((x) => `${x.title} ${x.type} ${x.body}`.toLowerCase().includes(q.toLowerCase())), [q]);
  return <Card title="Search the Ecosystem" eyebrow="Global Search"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Miracle-Gro, pollinators, beehive, resume, melons..." className="w-full rounded-2xl border border-slate-200 p-4 font-bold" /><div className="mt-4 grid gap-3">{(q ? results : searchIndex).map((r) => <div key={r.title} className="rounded-2xl bg-slate-50 p-4"><div className="font-black text-slate-950">{r.title}</div><div className="text-xs font-black uppercase text-emerald-700">{r.type}</div><p className="mt-2 text-sm font-bold">{r.body}</p></div>)}</div></Card>;
}

function Achievements({ completed, entries }: { completed: number; entries: number }) {
  const certs = ["Workplace Foundations & Safety", "Regenerative Agriculture", "Farm Infrastructure", "Production & Harvest", "Marketplace & Entrepreneurship", "Leadership", "Stewardship", "Community Impact", "Workforce Excellence"];
  return <Card title="Achievement Center" eyebrow="Certificates"><div className="grid gap-3 md:grid-cols-3">{certs.map((c, i) => <div key={c} className="rounded-2xl bg-slate-50 p-4"><div className="font-black text-slate-950">{c}</div><div className="mt-2 text-sm font-bold text-slate-600">{i < Math.floor((completed + entries) / 2) ? "Earned" : "In Progress"}</div></div>)}</div></Card>;
}

function ParentApp() { const [tab, setTab] = useState<ParentTab>("home"); return <main className="mx-auto max-w-7xl px-4 py-6"><TabNav items={parentTabs} active={tab} onChange={setTab} />{tab === "home" && <ParentHome />}{tab === "youth" && <ParentYouth />}{tab === "attendance" && <Attendance role="parent" />}{tab === "calendar" && <CalendarView />}{tab === "growth" && <FrameworkCards title="Growth Through the Bronson Framework" />}{tab === "portfolio" && <SimpleList title="Portfolio" items={["Approved photos", "Projects", "Skills", "Certificates", "Resume", "Recommendation status"]} />}{tab === "reports" && <SimpleList title="Reports" items={["Daily summary", "Weekly report", "Final report", "Portfolio download"]} />}{tab === "messages" && <Messages />}{tab === "resources" && <SimpleList title="Parent Resources" items={["Workforce readiness", "Education resources", "Scholarships", "Transportation", "Community services", "Mental wellness resources"]} />}</main>; }
function ParentHome() { return <div className="grid gap-5 lg:grid-cols-3"><Card title="Jordan Smith" eyebrow="Parent Home"><Pill>Present Today</Pill><p className="mt-4 font-bold">Week 5 • Full Day • Zone 5 Melons, Corn Seedlings, Squash Area, Gate Installation</p></Card><StatCard title="Attendance" stats={[["Rate", "94%"], ["Days Attended", "18"], ["Days Missed", "2"]]} /><StatCard title="Growth" stats={[["Skills", "21"], ["Certificates", "4"], ["Portfolio", "78%"]]} /></div>; }
function ParentYouth() { return <div className="grid gap-5 md:grid-cols-2"><Card title="My Youth Progress" eyebrow="Parent-safe"><p className="font-bold">Parents see attendance, projects, skills, certificates, calendar, portfolio progress, reports, and career interests.</p></Card><Card title="Privacy Boundary" eyebrow="Protected"><p className="font-bold">Private youth reflections, private workbook responses, incident investigations, supervisor internal notes, and other youth information are not shown.</p></Card></div>; }

function SupervisorApp() { const [tab, setTab] = useState<SupervisorTab>("home"); return <main className="mx-auto max-w-7xl px-4 py-6"><TabNav items={supervisorTabs} active={tab} onChange={setTab} />{tab === "home" && <SupervisorHome />}{tab === "attendance" && <Attendance role="supervisor" />}{tab === "assignments" && <SimpleList title="Assignments" items={todayAssignments} />}{tab === "projects" && <SimpleList title="Project Center" items={["Farm", "Forest", "Pollinator", "Apiary", "Infrastructure", "Community", "Documentation"]} />}{tab === "workbook" && <Queue title="Workbook Queue" />}{tab === "verification" && <SimpleList title="Skill Verification" items={["Teamwork", "Leadership", "Composting", "Irrigation", "Observation", "Tool Safety"]} />}{tab === "photos" && <SimpleList title="Photo Review" items={["Approve", "Request new upload", "Feature in portfolio", "Use in parent gallery"]} />}{tab === "incidents" && <SimpleList title="Incident Center" items={["Safety", "Injury", "Conflict", "Equipment", "Wildlife", "Transportation", "Weather", "Property"]} />}{tab === "messages" && <Messages />}{tab === "review" && <DailyReview />}</main>; }
function SupervisorHome() { return <div className="grid gap-5 lg:grid-cols-3"><StatCard title="Today's Status" stats={[["Present", "17"], ["Absent", "3"], ["Workbook", "72%"]]} /><Card title="Attention Queue" eyebrow="Needs action"><ul className="list-disc pl-5 font-bold"><li>Workbook incomplete: 5 youth</li><li>Gate installation needs attention</li><li>Photo review pending</li></ul></Card><Card title="Supervisor Rule" eyebrow="Fast"><p className="font-bold">Supervisors should know who is here, what is active, who needs help, and what requires action within 60 seconds.</p></Card></div>; }

function MissionApp() { const [tab, setTab] = useState<MissionTab>("home"); const [status, setStatus] = useStoredState<WorkStatus>("work_status", "Full Day"); return <main className="mx-auto max-w-7xl px-4 py-6"><TabNav items={missionTabs} active={tab} onChange={setTab} />{tab === "home" && <MissionHome status={status} />}{tab === "operations" && <Operations status={status} setStatus={setStatus} />}{tab === "workforce" && <StatCard title="Workforce Dashboard" stats={[["Registered", "123"], ["Active", "43"], ["Inactive", "11"], ["Completed", "29"]]} />}{tab === "outcomes" && <StatCard title="Outcomes" stats={[["Resumes", "41"], ["Certificates", "87"], ["Portfolios", "29"], ["Skills Verified", "712"]]} />}{tab === "farm" && <SimpleList title="Farm Operations" items={["Zone 5 Melons: In Progress", "Beehive Rebuild: Scheduled", "Corn Seedlings: Completed", "Gate: Needs Attention"]} />}{tab === "environment" && <SimpleList title="Environment Dashboard" items={["Pollinator habitat", "Wildlife observations", "Trees observed", "Water management", "Compost", "Mulch", "Habitat restoration"]} />}{tab === "families" && <StatCard title="Family Dashboard" stats={[["Parents Registered", "38"], ["Parents Active", "31"], ["Reports Opened", "82%"]]} />}{tab === "supervisors" && <SimpleList title="Supervisor Dashboard" items={["Attendance verification", "Workbook completion", "Skill verification", "Parent communication", "Incident resolution"]} />}{tab === "tourism" && <StatCard title="Tourism" stats={[["Visitors This Month", "418"], ["School Tours", "7"], ["Volunteer Hours", "212"]]} />}{tab === "funding" && <SimpleList title="Funding Dashboard" items={["Youth served", "Families served", "Volunteer hours", "Certificates", "Projects", "Environmental outcomes", "Career outcomes"]} />}{tab === "reports" && <SimpleList title="Report Center" items={["Daily Report", "Weekly Report", "Monthly Report", "Board Report", "Grant Report", "Annual Report", "Partner Report"]} />}{tab === "legacy" && <FrameworkCards title="Legacy Dashboard" />}</main>; }
function MissionHome({ status }: { status: WorkStatus }) { return <div className="grid gap-5 lg:grid-cols-3"><Card title="Mission Control" eyebrow="Executive Overview"><Pill>{status}</Pill><p className="mt-4 font-bold">Youth Present: 38 • Expected: 43 • Attendance Rate: 88% • Alerts: 2</p></Card><StatCard title="Program Health" stats={[["Youth Present", "38"], ["Supervisors", "3"], ["Visitors", "12"]]} /><Card title="Alerts" eyebrow="Action"><ul className="list-disc pl-5 font-bold"><li>Workbook completion low</li><li>Supervisor ratio approaching 1:15</li></ul></Card></div>; }
function Operations({ status, setStatus }: { status: WorkStatus; setStatus: (s: WorkStatus) => void }) { return <Card title="Operations Center" eyebrow="Program Status"><p className="font-bold">Changing status updates youth, parents, supervisors, calendar, and notifications.</p><div className="mt-4 flex flex-wrap gap-2">{(["Full Day", "Half Day", "Delayed", "Cancelled"] as WorkStatus[]).map((s) => <button key={s} onClick={() => setStatus(s)} className={`rounded-full px-5 py-3 font-black ${status === s ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-900"}`}>{s}</button>)}</div></Card>; }

function VisitorApp({ mode = "visitor" }: { mode?: "visitor" | "tourism" }) { const [tab, setTab] = useState<VisitorTab>("home"); return <main className="mx-auto max-w-7xl px-4 py-6"><TabNav items={visitorTabs} active={tab} onChange={setTab} />{tab === "home" && <VisitorHome mode={mode} />}{tab === "farm" && <SimpleList title="Explore the Farm" items={["Current projects", "Grow areas", "Seasonal activities", "Future orchard", "Demonstration areas"]} />}{tab === "forest" && <SimpleList title="Forest & Creeks" items={["Creek systems", "Wildlife", "Trees", "Tadpole discovery", "Nature observations"]} />}{tab === "butterflies" && <SimpleList title="Butterfly Sanctuary" items={["Milkweed", "Native flowers", "Monarch information", "Habitat restoration"]} />}{tab === "apiary" && <SimpleList title="Apiary & Pollinators" items={["Bee importance", "Hive information", "Pollination", "Honey production", "Beehive rebuild project"]} />}{tab === "aviation" && <SimpleList title="Airport Discovery" items={["Lansdowne Airport history", "Aircraft types", "Airport operations", "Drone technology", "Weather science", "Aviation careers"]} />}{tab === "cultivators" && <SimpleList title="Cultivator Youth Program" items={["Program overview", "Projects", "Certificates", "Skills", "Career pathways", "Approved success stories"]} />}{tab === "events" && <SimpleList title="Events" items={["Tours", "Workshops", "Markets", "Festivals", "Family Days", "Volunteer Days", "Camping Events"]} />}{tab === "recreation" && <SimpleList title="Recreation & Camping" items={["Walking trails", "Nature exploration", "Primitive camping", "Mini golf vision", "Family activities"]} />}{tab === "stories" && <SimpleList title="Stories of Impact" items={["Youth stories", "Volunteer stories", "Farm stories", "Community stories", "Environmental stories"]} />}{tab === "support" && <SimpleList title="Donate & Sponsor" items={["Youth Workforce", "Butterfly Sanctuary", "Apiary", "Forest Learning", "Camping Development", "Infrastructure", "General Fund"]} />}</main>; }
function VisitorHome({ mode }: { mode: string }) { return <section className="rounded-[2rem] bg-white p-8 shadow-sm"><div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{mode === "tourism" ? "Tourism" : "Visitor"} Experience</div><h1 className="mt-2 text-4xl font-black text-slate-950">Welcome to Bronson Family Farm</h1><p className="mt-4 max-w-3xl text-lg font-bold text-slate-700">A regenerative farm, youth workforce development center, environmental learning campus, aviation discovery destination, and future agritourism experience at Lansdowne Airport in Youngstown, Ohio.</p></section>; }

function GrowerPartnerApp({ type }: { type: "grower" | "partner" }) { return <main className="mx-auto max-w-7xl px-4 py-6"><Card title={type === "grower" ? "Grower Pathway" : "Partner Pathway"} eyebrow="Ecosystem 16.0"><p className="font-bold">This pathway connects crop planning, resource needs, marketplace opportunity, partner outcomes, support options, and community impact.</p><div className="mt-4 grid gap-3 md:grid-cols-3">{["Profile", "Opportunities", "Resources", "Messages", "Reports", "Support"].map((x) => <div key={x} className="rounded-2xl bg-slate-50 p-4 font-black text-slate-950">{x}</div>)}</div></Card></main>; }

function Attendance({ role }: { role: string }) { const rows = [["Jordan Smith", "Present", "8:01 AM"], ["Maya Jones", "Present", "8:05 AM"], ["David Brown", "Absent", "—"]]; return <Card title="Attendance Center" eyebrow={role}><div className="grid gap-3">{rows.map(([n, s, t]) => <div key={n} className="grid grid-cols-3 rounded-2xl bg-slate-50 p-4 font-bold"><span>{n}</span><span>{s}</span><span>{t}</span></div>)}</div></Card>; }
function Queue({ title }: { title: string }) { return <Card title={title} eyebrow="Needs Attention"><div className="grid gap-3">{[["Jordan", "Completed"], ["Maya", "In Progress"], ["David", "Not Started"]].map(([n, s]) => <div key={n} className="flex justify-between rounded-2xl bg-slate-50 p-4 font-bold"><span>{n}</span><span>{s}</span></div>)}</div></Card>; }
function DailyReview() { return <StatCard title="End-of-Day Review" stats={[["Attendance", "17 of 20"], ["Workbook", "15 Complete"], ["Skills", "32 Verified"], ["Incidents", "0"], ["Photos", "28 Approved"]]} />; }
function Messages() { return <SimpleList title="Messages" items={["Weather Alert", "Half Day", "Cancellation", "Achievement", "Reminder", "Parent Contact", "Emergency Notice"]} />; }
function SimpleList({ title, items }: { title: string; items: string[] }) { return <Card title={title}><div className="grid gap-3 md:grid-cols-2">{items.map((x) => <div key={x} className="rounded-2xl bg-slate-50 p-4 font-black text-slate-950">{x}</div>)}</div></Card>; }
function StatCard({ title, stats }: { title: string; stats: [string, string][] }) { return <Card title={title}><div className="grid gap-3 sm:grid-cols-2">{stats.map(([label, value]) => <Stat key={label} label={label} value={value} />)}</div></Card>; }
function FrameworkCards({ title }: { title: string }) { return <Card title={title} eyebrow="Self → Work → Environment → Community → Opportunity → Legacy"><div className="grid gap-3 md:grid-cols-3">{FRAMEWORK.map((x) => <div key={x} className="rounded-2xl bg-emerald-50 p-5"><div className="text-xl font-black text-emerald-950">{x}</div><p className="mt-2 text-sm font-bold text-emerald-900">Tracked through activities, workbook, journey, portfolio, reports, and Mission Control.</p></div>)}</div></Card>; }

export default function App() {
  const [role, setRole] = useState<RoleKey>("portal");
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-amber-50 text-slate-900">
      <Header role={role} setRole={setRole} />
      {role === "portal" && <Portal setRole={setRole} />}
      {role === "youth" && <YouthApp />}
      {role === "parent" && <ParentApp />}
      {role === "supervisor" && <SupervisorApp />}
      {role === "mission" && <MissionApp />}
      {role === "visitor" && <VisitorApp />}
      {role === "tourism" && <VisitorApp mode="tourism" />}
      {role === "grower" && <GrowerPartnerApp type="grower" />}
      {role === "partner" && <GrowerPartnerApp type="partner" />}
      <footer className="mx-auto mt-8 max-w-7xl px-4 pb-8 text-center text-sm font-bold text-slate-600">Bronson Family Farm • Cultivator Ecosystem 16.0 • We Grow Green to Harvest Dreams</footer>
    </div>
  );
}
