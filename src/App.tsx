import React, { useEffect, useMemo, useState } from "react";

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

export default function RealSupervisorDashboard() {
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
