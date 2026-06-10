import React, { useMemo, useState } from "react";
import "./App.css";

type Role = "youth" | "parent" | "supervisor" | "mission" | "guest";
type Lang = "en" | "es";

const TOPIC_CAP = 15;

const topicAreas = [
  "Agriculture",
  "Infrastructure",
  "Apiary & Pollination",
  "Culinary & Nutrition",
  "Guest Services & Tourism",
  "Media & Storytelling",
  "Safety & Emergency Prep",
  "Program Logistics",
];

const resources: Record<string, string[]> = {
  Agriculture: [
    "Companion planting guide",
    "How to read a seed packet",
    "Plant spacing and watering basics",
    "Soil health and observation checklist",
  ],
  Infrastructure: [
    "Tool safety basics",
    "Site setup checklist",
    "Shade, hydration, and cooling station guide",
  ],
  "Apiary & Pollination": [
    "Pollinator protection basics",
    "Bee observation safety",
    "Flower and habitat guide",
  ],
  "Culinary & Nutrition": [
    "Harvest handling basics",
    "Food safety overview",
    "Produce-to-plate reflection prompts",
  ],
  "Guest Services & Tourism": [
    "Welcoming guests",
    "Farm story talking points",
    "Respectful communication guide",
  ],
  "Media & Storytelling": [
    "Photo/video consent reminder",
    "Storytelling prompts",
    "Before-and-after documentation guide",
  ],
  "Safety & Emergency Prep": [
    "PPE checklist",
    "Heat safety and cooling station rules",
    "Nurse line and emergency response reminder",
  ],
  "Program Logistics": [
    "Attendance expectations",
    "Team rotation overview",
    "Daily closeout checklist",
  ],
};

const translations = {
  en: {
    title: "Bronson Family Farm Youth Workforce Portal",
    subtitle: "Cultivators: Learn. Work. Grow. Lead.",
    nurse: "Nurse Line",
    start: "Start My Day",
    returning: "Returning Youth",
    parent: "Parent / Guardian",
    supervisor: "Supervisor",
    mission: "Mission Control",
    guest: "Guest / Reviewer",
    chooseTopic: "Choose Your Topic Area",
    saveTopic: "Save Topic Choice",
    full: "Full",
    spots: "spots left",
    tools: "Tools & Resources",
    parentInfo: "Parent / Guardian Information",
    supervisorTools: "Supervisor Tools",
    attendance: "Attendance & Safety",
    reflection: "Daily Reflection",
    launchReady: "Launch Ready",
  },
  es: {
    title: "Portal de Trabajo Juvenil de Bronson Family Farm",
    subtitle: "Cultivadores: Aprender. Trabajar. Crecer. Liderar.",
    nurse: "Línea de Enfermería",
    start: "Comenzar Mi Día",
    returning: "Joven que Regresa",
    parent: "Padre / Tutor",
    supervisor: "Supervisor",
    mission: "Control de Misión",
    guest: "Invitado / Revisor",
    chooseTopic: "Elige Tu Área de Tema",
    saveTopic: "Guardar Selección",
    full: "Lleno",
    spots: "lugares disponibles",
    tools: "Herramientas y Recursos",
    parentInfo: "Información del Padre / Tutor",
    supervisorTools: "Herramientas del Supervisor",
    attendance: "Asistencia y Seguridad",
    reflection: "Reflexión Diaria",
    launchReady: "Listo para Lanzamiento",
  },
};

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [role, setRole] = useState<Role | null>(null);

  const [youthName, setYouthName] = useState("");
  const [pin, setPin] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const [selectedTopic, setSelectedTopic] = useState("");
  const [savedTopic, setSavedTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const t = translations[lang];

  const topicCounts = useMemo(
    () => ({
      Agriculture: 11,
      Infrastructure: 9,
      "Apiary & Pollination": 15,
      "Culinary & Nutrition": 7,
      "Guest Services & Tourism": 4,
      "Media & Storytelling": 6,
      "Safety & Emergency Prep": 5,
      "Program Logistics": 8,
    }),
    []
  );

  // Example history: this would later come from the youth record/database.
  const youthHistory = ["Agriculture"];

  const alreadySignedUpThisWeek = Boolean(savedTopic);

  function canYouthChooseTopic(topic: string) {
    const count = topicCounts[topic as keyof typeof topicCounts];
    const isFull = count >= TOPIC_CAP;
    const alreadyCompleted = youthHistory.includes(topic);

    return !isFull && !alreadyCompleted && !alreadySignedUpThisWeek;
  }

  function getTopicStatus(topic: string) {
    const count = topicCounts[topic as keyof typeof topicCounts];
    const isFull = count >= TOPIC_CAP;
    const alreadyCompleted = youthHistory.includes(topic);

    if (alreadySignedUpThisWeek) return "You already selected a topic this week.";
    if (alreadyCompleted) return "Already completed — choose a new area.";
    if (isFull) return t.full;

    return `${TOPIC_CAP - count} ${t.spots}`;
  }

  const topicCanBeSaved =
    selectedTopic && canYouthChooseTopic(selectedTopic);

  const missingFields: string[] = [];

  if (!youthName.trim()) missingFields.push("Youth name is required.");
  if (!pin.trim()) missingFields.push("Assigned PIN number is required.");
  if (!parentName.trim()) missingFields.push("Parent / guardian name is required.");
  if (!parentEmail.trim()) missingFields.push("Parent / guardian email is required.");
  if (parentEmail.trim() && !parentEmail.includes("@")) {
    missingFields.push("Enter a valid parent / guardian email.");
  }
  if (!selectedTopic) missingFields.push("Choose a topic area.");

  if (selectedTopic && !canYouthChooseTopic(selectedTopic)) {
    missingFields.push(
      "This topic cannot be selected for weekly sign-up. Youth may review it, but must choose an available area."
    );
  }

  const canSave = missingFields.length === 0 && Boolean(topicCanBeSaved);

  function resetHome() {
    setRole(null);
    setSubmitted(false);
  }

  function saveYouthDay() {
    if (!canSave) return;

    setSavedTopic(selectedTopic);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#f7f3e8] text-[#18392b]">
      <section className="sticky top-0 z-50 bg-red-700 text-white px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <strong>{t.nurse}: Visible At All Times</strong>
          <span>Emergency / Health Concern: Contact site lead immediately.</span>
          <button className="bg-white text-red-700 px-4 py-2 rounded-xl font-bold">
            Call / Report
          </button>
        </div>
      </section>

      <header className="bg-[#18392b] text-white px-5 py-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-lg opacity-90">{t.subtitle}</p>
          </div>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="text-[#18392b] rounded-xl px-4 py-2"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </header>

      {!role && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">{t.launchReady}</h2>
            <p>
              Welcome to the Bronson Family Farm Youth Workforce Program.
              Youth should use their assigned PIN number as their password.
              Parents and supervisors have separate access.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <PortalButton label={t.start} onClick={() => setRole("youth")} />
            <PortalButton label={t.returning} onClick={() => setRole("youth")} />
            <PortalButton label={t.parent} onClick={() => setRole("parent")} />
            <PortalButton label={t.supervisor} onClick={() => setRole("supervisor")} />
            <PortalButton label={t.mission} onClick={() => setRole("mission")} />
            <PortalButton label={t.guest} onClick={() => setRole("guest")} />
          </div>
        </section>
      )}

      {role === "youth" && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <BackButton onClick={resetHome} />

          {!submitted ? (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card title="Youth Check-In">
                <label>Youth Name</label>
                <input value={youthName} onChange={(e) => setYouthName(e.target.value)} />

                <label>Assigned PIN Number / Password</label>
                <input value={pin} onChange={(e) => setPin(e.target.value)} />

                <label>Parent / Guardian Name</label>
                <input value={parentName} onChange={(e) => setParentName(e.target.value)} />

                <label>Parent / Guardian Email</label>
                <input value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
              </Card>

              <Card title={t.chooseTopic}>
                <p className="mb-4">
                  Click any curriculum category to learn about it. Your official
                  weekly sign-up is not final until you save. Full categories,
                  completed categories, and weekly duplicate choices cannot be saved.
                </p>

                <div className="space-y-3">
                  {topicAreas.map((topic) => {
                    const available = canYouthChooseTopic(topic);

                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setSelectedTopic(topic)}
                        className={`w-full text-left p-4 rounded-2xl border ${
                          selectedTopic === topic
                            ? "bg-[#d8a23a] border-[#8a5a00]"
                            : "bg-[#f7f3e8]"
                        } ${!available ? "opacity-75" : ""}`}
                      >
                        <strong>{topic}</strong>
                        <br />
                        <span>{getTopicStatus(topic)}</span>
                        <br />
                        <small>
                          Click to learn what this category does before signing up.
                        </small>
                      </button>
                    );
                  })}
                </div>

                {selectedTopic && (
                  <div className="mt-5 bg-[#f7f3e8] rounded-2xl p-4">
                    <h3 className="font-bold mb-2">{selectedTopic}</h3>
                    <p className="mb-2">
                      This category includes the following tools and resources:
                    </p>
                    <ul className="list-disc list-inside">
                      {(resources[selectedTopic] || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {missingFields.length > 0 && (
                  <div className="mt-5 bg-red-50 border border-red-400 text-red-800 rounded-2xl p-4">
                    <strong>Please fix before saving:</strong>
                    <ul className="mt-2 list-disc list-inside">
                      {missingFields.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  disabled={!canSave}
                  onClick={saveYouthDay}
                  className="mt-5 w-full bg-[#18392b] text-white p-4 rounded-2xl font-bold disabled:opacity-40"
                >
                  {t.saveTopic}
                </button>
              </Card>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card title="You Are Checked In">
                <p>
                  Welcome, <strong>{youthName}</strong>.
                </p>
                <p>
                  This week’s topic area: <strong>{savedTopic}</strong>
                </p>
                <p>
                  Your supervisor will confirm attendance, PPE, safety, and
                  daily assignment.
                </p>
              </Card>

              <Card title={t.tools}>
                <ul>
                  {(resources[savedTopic] || []).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </Card>

              <Card title={t.attendance}>
                <Checklist
                  items={[
                    "I checked in with my supervisor.",
                    "I know where the cooling station is.",
                    "I have proper shoes and PPE.",
                    "I know the nurse line is visible at the top of the screen.",
                    "I understand I cannot leave the site without approved pickup.",
                  ]}
                />
              </Card>

              <Card title={t.reflection}>
                <textarea
                  placeholder="What did you learn today? What skill did you practice? What question do you still have?"
                  className="min-h-[160px]"
                />
              </Card>
            </div>
          )}
        </section>
      )}

      {role === "parent" && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <BackButton onClick={resetHome} />

          <Card title={t.parentInfo}>
            <p>
              Parents and guardians can review safety expectations, proper
              attire, pickup rules, program contacts, and youth orientation
              information.
            </p>

            <Checklist
              items={[
                "Closed-toe shoes required.",
                "Hat or head covering recommended.",
                "Youth should dress for outdoor farm work.",
                "Water, cooling station, and nurse line information are available.",
                "Youth may not leave the private airport site until approved pickup.",
                "Parent email is collected so the portal can send updates.",
              ]}
            />
          </Card>
        </section>
      )}

      {role === "supervisor" && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <BackButton onClick={resetHome} />

          <div className="grid lg:grid-cols-2 gap-6">
            <Card title={t.supervisorTools}>
              <Checklist
                items={[
                  "Confirm youth attendance.",
                  "Confirm PPE and proper shoes.",
                  "Assign youth to topic area supervisor.",
                  "Monitor 15 youth per aide.",
                  "Report safety concerns immediately.",
                  "Use daily assessment to track teamwork, effort, skill growth, and readiness.",
                ]}
              />
            </Card>

            <Card title="Supervisor Daily Assessment">
              <label>Youth Name</label>
              <input />

              <label>Topic Area</label>
              <select>
                {topicAreas.map((topic) => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>

              <label>Today’s Notes</label>
              <textarea className="min-h-[140px]" />

              <button className="mt-4 bg-[#18392b] text-white px-5 py-3 rounded-xl font-bold">
                Save Assessment
              </button>
            </Card>
          </div>
        </section>
      )}

      {role === "mission" && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <BackButton onClick={resetHome} />

          <div className="grid md:grid-cols-3 gap-5">
            <StatusCard label="Youth Expected" value="70+" />
            <StatusCard label="Topic Capacity" value="15 each" />
            <StatusCard label="Supervisor Ratio" value="1:15" />
            <StatusCard label="Nurse Line" value="Visible" />
            <StatusCard label="Parent Portal" value="Active" />
            <StatusCard label="Launch Status" value="Ready" />
          </div>
        </section>
      )}

      {role === "guest" && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <BackButton onClick={resetHome} />

          <Card title="Guest / Reviewer View">
            <p>
              Guests can experience the youth workforce ecosystem, understand
              the role of each topic area, and observe how Bronson Family Farm
              connects youth development, agriculture, safety, workforce
              learning, and community food systems.
            </p>

            <Checklist
              items={[
                "Youth choose a topic area weekly.",
                "Youth can browse curriculum before committing.",
                "Full topic areas cannot be saved.",
                "Youth cannot repeat an area they already completed.",
                "Youth receive tools and resources for the work they are doing.",
                "Parents have access to program expectations.",
                "Supervisors can track attendance, safety, and skill development.",
                "Mission Control can monitor launch readiness.",
              ]}
            />
          </Card>
        </section>
      )}

      <footer className="bg-[#18392b] text-white text-center py-5 mt-8">
        © 2026 Bronson Family Farm LLC / Farm & Family Alliance Inc. All rights reserved.
        Proprietary ecosystem platform. Do not copy, distribute, or reproduce without written permission.
      </footer>
    </main>
  );
}

function PortalButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-3xl shadow-xl p-6 text-left hover:scale-[1.02] transition"
    >
      <h3 className="text-xl font-bold">{label}</h3>
      <p className="mt-2">Open pathway</p>
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="bg-[#f7f3e8] rounded-xl p-3">
          □ {item}
        </li>
      ))}
    </ul>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-5 bg-[#d8a23a] text-[#18392b] px-5 py-3 rounded-xl font-bold"
    >
      ← Back to Portal
    </button>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <p className="text-sm uppercase tracking-wide opacity-70">{label}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}
