import React, { useEffect, useMemo, useState } from "react";

type YouthStatus = "Present" | "Absent" | "Late" | "Excused";
type MoodStatus = "Ready" | "Okay" | "Tired" | "Concerned" | "Needs Support";
type SafetyStatus = "Cleared" | "Needs PPE" | "Needs Water" | "Medical Attention" | "Supervisor Review";

type YouthRecord = {
  id: string;
  name: string;
  age: number;
  team: string;
  guardian: string;
  guardianPhone: string;
  emergencyContact: string;
  allergies?: string;
  notes?: string;
};

type DailyRecord = {
  id: string;
  date: string;
  youthId: string;
  supervisor: string;
  attendance: YouthStatus;
  arrivalTime: string;
  mood: MoodStatus;
  safety: SafetyStatus;
  ppe: boolean;
  water: boolean;
  meal: boolean;
  taskArea: string;
  skillsObserved: string[];
  supervisorNote: string;
  parentSummary: string;
  incident: boolean;
  incidentNote: string;
};

const STORAGE_KEY = "bff_supervisor_dashboard_records_v1";

const defaultYouth: YouthRecord[] = [
  {
    id: "y-001",
    name: "Youth Participant 1",
    age: 15,
    team: "Regenerative Agriculture",
    guardian: "Parent/Guardian",
    guardianPhone: "(330) 000-0000",
    emergencyContact: "Emergency Contact",
    allergies: "Not listed",
    notes: "Demo record. Replace with registered youth.",
  },
  {
    id: "y-002",
    name: "Youth Participant 2",
    age: 16,
    team: "Guest Services & Tourism",
    guardian: "Parent/Guardian",
    guardianPhone: "(330) 000-0000",
    emergencyContact: "Emergency Contact",
    allergies: "Not listed",
    notes: "Demo record. Replace with registered youth.",
  },
  {
    id: "y-003",
    name: "Youth Participant 3",
    age: 14,
    team: "Infrastructure & Safety",
    guardian: "Parent/Guardian",
    guardianPhone: "(330) 000-0000",
    emergencyContact: "Emergency Contact",
    allergies: "Not listed",
    notes: "Demo record. Replace with registered youth.",
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

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function makeRecord(youthId: string, supervisor: string): DailyRecord {
  return {
    id: `${todayISO()}-${youthId}`,
    date: todayISO(),
    youthId,
    supervisor,
    attendance: "Present",
    arrivalTime: "",
    mood: "Ready",
    safety: "Cleared",
    ppe: false,
    water: false,
    meal: false,
    taskArea: "Morning Circle",
    skillsObserved: [],
    supervisorNote: "",
    parentSummary: "",
    incident: false,
    incidentNote: "",
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

export default function RealSupervisorDashboard() {
  const [supervisor, setSupervisor] = useState("Supervisor Aide");
  const [selectedYouthId, setSelectedYouthId] = useState(defaultYouth[0].id);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [filterTeam, setFilterTeam] = useState("All Teams");

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const teams = useMemo(() => ["All Teams", ...Array.from(new Set(defaultYouth.map((y) => y.team)))], []);

  const visibleYouth = useMemo(() => {
    if (filterTeam === "All Teams") return defaultYouth;
    return defaultYouth.filter((y) => y.team === filterTeam);
  }, [filterTeam]);

  const selectedYouth = defaultYouth.find((y) => y.id === selectedYouthId) || defaultYouth[0];

  const todayRecord =
    records.find((r) => r.date === todayISO() && r.youthId === selectedYouth.id) ||
    makeRecord(selectedYouth.id, supervisor);

  const todayRecords = records.filter((r) => r.date === todayISO());

  const stats = {
    present: todayRecords.filter((r) => r.attendance === "Present").length,
    absent: todayRecords.filter((r) => r.attendance === "Absent").length,
    late: todayRecords.filter((r) => r.attendance === "Late").length,
    incidents: todayRecords.filter((r) => r.incident).length,
  };

  function updateRecord(next: DailyRecord) {
    const existing = records.some((r) => r.id === next.id);
    setRecords(existing ? records.map((r) => (r.id === next.id ? next : r)) : [...records, next]);
  }

  function toggleSkill(skill: string) {
    const exists = todayRecord.skillsObserved.includes(skill);
    updateRecord({
      ...todayRecord,
      skillsObserved: exists
        ? todayRecord.skillsObserved.filter((s) => s !== skill)
        : [...todayRecord.skillsObserved, skill],
    });
  }

  function exportCSV() {
    const header = [
      "date",
      "youth",
      "team",
      "supervisor",
      "attendance",
      "arrivalTime",
      "mood",
      "safety",
      "ppe",
      "water",
      "meal",
      "taskArea",
      "skillsObserved",
      "supervisorNote",
      "parentSummary",
      "incident",
      "incidentNote",
    ];

    const rows = records.map((r) => {
      const youth = defaultYouth.find((y) => y.id === r.youthId);
      return [
        r.date,
        youth?.name || r.youthId,
        youth?.team || "",
        r.supervisor,
        r.attendance,
        r.arrivalTime,
        r.mood,
        r.safety,
        r.ppe ? "Yes" : "No",
        r.water ? "Yes" : "No",
        r.meal ? "Yes" : "No",
        r.taskArea,
        r.skillsObserved.join("; "),
        r.supervisorNote,
        r.parentSummary,
        r.incident ? "Yes" : "No",
        r.incidentNote,
      ];
    });

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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
              <h1 className="text-2xl font-bold md:text-4xl">Real Supervisor Dashboard</h1>
              <p className="mt-1 max-w-3xl text-sm text-emerald-50/90">
                Track youth attendance, safety, daily progress, support needs, parent-visible summaries, and incident notes from one supervisor screen.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className="rounded-2xl border border-white/20 bg-white/90 px-4 py-2 text-sm text-emerald-950 outline-none"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                aria-label="Supervisor name"
              />
              <button
                onClick={exportCSV}
                className="rounded-2xl bg-amber-300 px-4 py-2 text-sm font-bold text-emerald-950 shadow-lg hover:bg-amber-200"
              >
                Export Records
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <StatCard label="Present Today" value={stats.present} />
          <StatCard label="Absent" value={stats.absent} />
          <StatCard label="Late" value={stats.late} />
          <StatCard label="Incidents" value={stats.incidents} alert={stats.incidents > 0} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-3xl border border-emerald-300/20 bg-white/10 p-4 shadow-xl backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Assigned Youth</h2>
              <select
                className="rounded-xl bg-white px-3 py-2 text-xs text-emerald-950"
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
              >
                {teams.map((team) => (
                  <option key={team}>{team}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {visibleYouth.map((youth) => {
                const rec = records.find((r) => r.date === todayISO() && r.youthId === youth.id);
                return (
                  <button
                    key={youth.id}
                    onClick={() => setSelectedYouthId(youth.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      selectedYouthId === youth.id
                        ? "border-amber-300 bg-amber-200 text-emerald-950"
                        : "border-white/15 bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold">{youth.name}</p>
                        <p className="text-xs opacity-80">Age {youth.age} • {youth.team}</p>
                      </div>
                      <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                        {rec?.attendance || "Not checked"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="space-y-4">
            <div className="rounded-3xl border border-emerald-300/20 bg-white p-4 text-emerald-950 shadow-xl">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">{selectedYouth.name}</h2>
                  <p className="text-sm text-emerald-800">
                    {selectedYouth.team} • Guardian: {selectedYouth.guardian} • {selectedYouth.guardianPhone}
                  </p>
                  <p className="text-xs text-emerald-700">
                    Emergency: {selectedYouth.emergencyContact} • Allergies/medical notes: {selectedYouth.allergies || "Not listed"}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-bold">
                  {todayISO()}
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Panel title="Morning Attendance & Safety">
                <Label text="Attendance">
                  <select
                    className="input"
                    value={todayRecord.attendance}
                    onChange={(e) => updateRecord({ ...todayRecord, attendance: e.target.value as YouthStatus, supervisor })}
                  >
                    {["Present", "Absent", "Late", "Excused"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Label>

                <Label text="Arrival Time">
                  <input
                    className="input"
                    type="time"
                    value={todayRecord.arrivalTime}
                    onChange={(e) => updateRecord({ ...todayRecord, arrivalTime: e.target.value, supervisor })}
                  />
                </Label>

                <Label text="Mood / Readiness">
                  <select
                    className="input"
                    value={todayRecord.mood}
                    onChange={(e) => updateRecord({ ...todayRecord, mood: e.target.value as MoodStatus, supervisor })}
                  >
                    {["Ready", "Okay", "Tired", "Concerned", "Needs Support"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Label>

                <Label text="Safety Status">
                  <select
                    className="input"
                    value={todayRecord.safety}
                    onChange={(e) => updateRecord({ ...todayRecord, safety: e.target.value as SafetyStatus, supervisor })}
                  >
                    {["Cleared", "Needs PPE", "Needs Water", "Medical Attention", "Supervisor Review"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Label>

                <div className="grid gap-2 sm:grid-cols-3">
                  <Check label="PPE Ready" checked={todayRecord.ppe} onChange={(v) => updateRecord({ ...todayRecord, ppe: v, supervisor })} />
                  <Check label="Has Water" checked={todayRecord.water} onChange={(v) => updateRecord({ ...todayRecord, water: v, supervisor })} />
                  <Check label="Food/Meal OK" checked={todayRecord.meal} onChange={(v) => updateRecord({ ...todayRecord, meal: v, supervisor })} />
                </div>
              </Panel>

              <Panel title="Daily Work Assignment">
                <Label text="Task Area">
                  <select
                    className="input"
                    value={todayRecord.taskArea}
                    onChange={(e) => updateRecord({ ...todayRecord, taskArea: e.target.value, supervisor })}
                  >
                    {taskAreas.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Label>

                <div>
                  <p className="mb-2 text-sm font-bold text-emerald-900">Skills Observed</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold ${
                          todayRecord.skillsObserved.includes(skill)
                            ? "border-emerald-700 bg-emerald-700 text-white"
                            : "border-emerald-200 bg-emerald-50 text-emerald-950"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Panel title="Supervisor Notes">
                <textarea
                  className="input min-h-[150px]"
                  placeholder="Private staff note: behavior, progress, needs, strengths, follow-up..."
                  value={todayRecord.supervisorNote}
                  onChange={(e) => updateRecord({ ...todayRecord, supervisorNote: e.target.value, supervisor })}
                />
              </Panel>

              <Panel title="Parent / Guardian Summary">
                <textarea
                  className="input min-h-[150px]"
                  placeholder="Parent-visible summary: what youth did today, positive progress, reminders..."
                  value={todayRecord.parentSummary}
                  onChange={(e) => updateRecord({ ...todayRecord, parentSummary: e.target.value, supervisor })}
                />
              </Panel>
            </div>

            <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-950 shadow-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-xl font-black">Incident / Support Flag</h3>
                  <p className="text-sm">
                    Use this when a youth needs immediate follow-up, safety review, parent contact, medical attention, or behavioral support.
                  </p>
                </div>
                <Check
                  label="Flag Incident"
                  checked={todayRecord.incident}
                  onChange={(v) => updateRecord({ ...todayRecord, incident: v, supervisor })}
                />
              </div>
              <textarea
                className="mt-3 w-full rounded-2xl border border-red-200 bg-white p-3 text-sm outline-none"
                placeholder="Incident details, action taken, who was notified, next step..."
                value={todayRecord.incidentNote}
                onChange={(e) => updateRecord({ ...todayRecord, incidentNote: e.target.value, supervisor })}
              />
            </div>

            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-900 p-4 text-white shadow-xl">
              <h3 className="text-xl font-black">Today’s Parent-Visible Snapshot</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <Snapshot label="Attendance" value={todayRecord.attendance} />
                <Snapshot label="Task Area" value={todayRecord.taskArea} />
                <Snapshot label="Safety" value={todayRecord.safety} />
              </div>
              <p className="mt-3 rounded-2xl bg-white/10 p-3 text-sm">
                {todayRecord.parentSummary || "No parent summary has been entered yet."}
              </p>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(6, 95, 70, 0.2);
          background: white;
          padding: 0.75rem;
          font-size: 0.875rem;
          color: #064e3b;
          outline: none;
        }
        .input:focus {
          border-color: #047857;
          box-shadow: 0 0 0 3px rgba(4, 120, 87, 0.15);
        }
      `}</style>
    </section>
  );
}

function StatCard({ label, value, alert = false }: { label: string; value: number; alert?: boolean }) {
  return (
    <div className={`rounded-3xl border p-4 shadow-xl ${alert ? "border-red-200 bg-red-100 text-red-950" : "border-emerald-300/20 bg-white/10 text-white"}`}>
      <p className="text-xs uppercase tracking-[0.2em] opacity-75">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-emerald-200 bg-white p-4 text-emerald-950 shadow-xl">
      <h3 className="mb-3 text-xl font-black">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-emerald-900">{text}</span>
      {children}
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-950">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
