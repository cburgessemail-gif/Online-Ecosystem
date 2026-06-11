import React, { useMemo, useState } from "react";
import "./App.css";

type Role = "youth" | "parent" | "supervisor" | "mission" | "guest";
type Lang = "en" | "es";
type YouthStep = "checkin" | "topic" | "submitted";

type YouthRecord = {
  id: string;
  firstName: string;
  lastName: string;
  pin: string;
  worksite: string;
  completedTopics: string[];
  currentWeekTopic: string;
};

const TOPIC_CAP = 15;
const WORKSITE_NAME = "Bronson Family Farm";

const employerYouthList: YouthRecord[] = [
  { id: "y001", firstName: "Jordan", lastName: "Smith", pin: "1234", worksite: WORKSITE_NAME, completedTopics: ["Agriculture"], currentWeekTopic: "" },
  { id: "y002", firstName: "Taylor", lastName: "Brown", pin: "5678", worksite: WORKSITE_NAME, completedTopics: [], currentWeekTopic: "" },
];

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
  Agriculture: ["Companion planting guide", "Bubble Babies", "Soil health checklist", "Planting and watering basics"],
  Infrastructure: ["Tool safety basics", "Site setup checklist", "Shade and cooling station guide"],
  "Apiary & Pollination": ["Pollinator protection basics", "Bee observation safety", "Flower and habitat guide"],
  "Culinary & Nutrition": ["Harvest handling basics", "Food safety overview", "Produce-to-plate reflection"],
  "Guest Services & Tourism": ["Welcoming guests", "Farm story talking points", "Respectful communication"],
  "Media & Storytelling": ["Photo/video consent reminder", "Storytelling prompts", "Before-and-after documentation"],
  "Safety & Emergency Prep": ["PPE checklist", "Heat safety", "Nurse line and emergency reminder"],
  "Program Logistics": ["Attendance expectations", "Team rotation overview", "Daily closeout checklist"],
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
    submitPin: "Submit PIN",
    submit: "Submit / Open Today’s Work",
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
    submitPin: "Enviar PIN",
    submit: "Enviar / Abrir Trabajo de Hoy",
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
  const [step, setStep] = useState<YouthStep>("checkin");

  const [youthName, setYouthName] = useState("");
  const [pin, setPin] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const [selectedTopic, setSelectedTopic] = useState("");
  const [savedTopic, setSavedTopic] = useState("");
  const [validatedYouth, setValidatedYouth] = useState<YouthRecord | null>(null);
  const [message, setMessage] = useState("");

  const t = translations[lang];

  const topicCounts = useMemo(() => ({
    Agriculture: 11,
    Infrastructure: 9,
    "Apiary & Pollination": 15,
    "Culinary & Nutrition": 7,
    "Guest Services & Tourism": 4,
    "Media & Storytelling": 6,
    "Safety & Emergency Prep": 5,
    "Program Logistics": 8,
  }), []);

  function findYouthByPin() {
    return employerYouthList.find(
      (youth) => youth.pin.trim() === pin.trim() && youth.worksite === WORKSITE_NAME
    );
  }

  function topicIsFull(topic: string) {
    return topicCounts[topic as keyof typeof topicCounts] >= TOPIC_CAP;
  }

  function submitPinAndContinue() {
    setMessage("");

    const match = findYouthByPin();

    if (match) {
      setValidatedYouth(match);
      setYouthName(`${match.firstName} ${match.lastName}`);
    } else {
      setValidatedYouth(null);
    }

    setStep("topic");
  }

  function submitTodayWork() {
    setMessage("");

    if (!selectedTopic) {
      setMessage("Choose a topic area before submitting.");
      return;
    }

    if (topicIsFull(selectedTopic)) {
      setMessage("This topic area is full. Please choose another available area.");
      return;
    }

    if (validatedYouth?.currentWeekTopic) {
      setMessage(`You are already signed up for ${validatedYouth.currentWeekTopic} this week.`);
      return;
    }

    if (validatedYouth?.completedTopics.includes(selectedTopic)) {
      setMessage("You have already completed this topic area. Please choose a new area.");
      return;
    }

    setSavedTopic(selectedTopic);
    setStep("submitted");
  }

  function resetHome() {
    setRole(null);
    setStep("checkin");
    setMessage("");
    setSelectedTopic("");
    setSavedTopic("");
    setValidatedYouth(null);
  }

  const youthHistory = validatedYouth?.completedTopics || [];

  return (
    <main className="min-h-screen bg-[#f7f3e8] text-[#18392b]">
      <section className="sticky top-0 z-50 bg-red-700 text-white px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <strong>{t.nurse}: Visible At All Times</strong>
          <span>Emergency / Health Concern: Contact site lead immediately.</span>
          <button className="bg-white text-red-700 px-4 py-2 rounded-xl font-bold">Call / Report</button>
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
            <p>Youth may enter today with PIN-first launch access. Records can be verified after work begins.</p>
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

          {step === "checkin" && (
            <Card title="Youth PIN Check-In">
              <p>Enter your PIN if you have it. For launch today, access will not be blocked.</p>

              <label>Youth Full Name</label>
              <input value={youthName} onChange={(e) => setYouthName(e.target.value)} placeholder="Optional today" />

              <label>Assigned PIN Number / Password</label>
              <input value={pin} onChange={(e) => { setPin(e.target.value); setMessage(""); }} placeholder="PIN number" />

              <label>Parent / Guardian Name</label>
              <input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Optional today" />

              <label>Parent / Guardian Email</label>
              <input value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="Optional today" />

              {message && <div className="bg-yellow-50 border border-yellow-500 text-yellow-900 rounded-2xl p-4">{message}</div>}

              <button
                type="button"
                onClick={submitPinAndContinue}
                className="mt-5 w-full bg-[#18392b] text-white p-4 rounded-2xl font-bold"
              >
                {t.submitPin}
              </button>
            </Card>
          )}

          {step === "topic" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card title="Access Status">
                <div className="bg-green-50 border border-green-500 text-green-900 rounded-2xl p-4">
                  Access approved for launch. Continue to topic selection and today’s work.
                </div>

                <p>Youth: <strong>{validatedYouth ? `${validatedYouth.firstName} ${validatedYouth.lastName}` : youthName || "Cultivator"}</strong></p>
              </Card>

              <Card title={t.chooseTopic}>
                <p>Click a curriculum category to learn about it. Then submit to open today’s work.</p>

                <div className="space-y-3">
                  {topicAreas.map((topic) => {
                    const count = topicCounts[topic as keyof typeof topicCounts];
                    const full = topicIsFull(topic);
                    const completed = youthHistory.includes(topic);
                    const isSelected = selectedTopic === topic;

                    return (
                      <button
                        key={topic}
                        type="button"
                        disabled={full || completed}
                        onClick={() => setSelectedTopic(topic)}
                        className={`w-full text-left p-4 rounded-2xl border ${isSelected ? "bg-[#d8a23a] border-[#8a5a00]" : "bg-[#f7f3e8]"} ${full || completed ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <strong>{topic}</strong><br />
                        <span>{completed ? "Already completed — choose a new area." : full ? t.full : `${TOPIC_CAP - count} ${t.spots}`}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedTopic && (
                  <div className="mt-5 bg-[#f7f3e8] rounded-2xl p-4">
                    <h3 className="font-bold mb-2">{selectedTopic}</h3>
                    <ul className="list-disc list-inside">
                      {(resources[selectedTopic] || []).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                )}

                {message && <div className="mt-5 bg-red-50 border border-red-400 text-red-800 rounded-2xl p-4">{message}</div>}

                <button
                  type="button"
                  disabled={!selectedTopic}
                  onClick={submitTodayWork}
                  className="mt-5 w-full bg-[#18392b] text-white p-4 rounded-2xl font-bold disabled:opacity-40"
                >
                  {t.submit}
                </button>
              </Card>
            </div>
          )}

          {step === "submitted" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card title="Submission Received">
                <p>Welcome, <strong>{validatedYouth ? `${validatedYouth.firstName} ${validatedYouth.lastName}` : youthName || "Cultivator"}</strong>.</p>

                <div className="bg-green-50 border border-green-500 text-green-900 rounded-2xl p-4">
                  Today’s work is now open. Verification can be completed later.
                </div>

                <p>This week’s topic area: <strong>{savedTopic}</strong></p>
              </Card>

              <Card title={t.tools}>
                <ul>{(resources[savedTopic] || []).map((item) => <li key={item}>• {item}</li>)}</ul>
              </Card>

              <Card title={t.attendance}>
                <Checklist items={[
                  "I checked in with my supervisor.",
                  "I know where the cooling station is.",
                  "I have proper shoes and PPE.",
                  "I know the nurse line is visible at the top of the screen.",
                  "I understand I cannot leave the site without approved pickup.",
                ]} />
              </Card>

              <Card title={t.reflection}>
                <textarea placeholder="What did you learn today?" className="min-h-[160px]" />
              </Card>
            </div>
          )}
        </section>
      )}

      {role === "parent" && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <BackButton onClick={resetHome} />
          <Card title={t.parentInfo}>
            <Checklist items={[
              "Closed-toe shoes required.",
              "Hat or head covering recommended.",
              "Youth should dress for outdoor farm work.",
              "Water, cooling station, and nurse line information are available.",
              "Youth may not leave the private airport site until approved pickup.",
            ]} />
          </Card>
        </section>
      )}

      {role === "supervisor" && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <BackButton onClick={resetHome} />
          <Card title={t.supervisorTools}>
            <Checklist items={[
              "Confirm youth attendance.",
              "Confirm PPE and proper shoes.",
              "Assign youth to topic area supervisor.",
              "Monitor 15 youth per aide.",
              "Report safety concerns immediately.",
            ]} />
          </Card>
        </section>
      )}

      {role === "mission" && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <BackButton onClick={resetHome} />
          <div className="grid md:grid-cols-3 gap-5">
            <StatusCard label="Youth Expected" value="70+" />
            <StatusCard label="Topic Capacity" value="15 each" />
            <StatusCard label="PIN Access" value="Launch Open" />
            <StatusCard label="Validation" value="After Access" />
            <StatusCard label="Nurse Line" value="Visible" />
            <StatusCard label="Launch Status" value="Ready" />
          </div>
        </section>
      )}

      {role === "guest" && (
        <section className="max-w-6xl mx-auto px-5 py-8">
          <BackButton onClick={resetHome} />
          <Card title="Guest / Reviewer View">
            <Checklist items={[
              "Youth enter with launch access first.",
              "Name mismatch does not block access.",
              "Youth choose a weekly topic area.",
              "Full topic areas cannot be saved.",
              "Youth receive tools and resources for the work they are doing.",
            ]} />
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
    <button onClick={onClick} className="bg-white rounded-3xl shadow-xl p-6 text-left hover:scale-[1.02] transition">
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
      {items.map((item) => <li key={item} className="bg-[#f7f3e8] rounded-xl p-3">□ {item}</li>)}
    </ul>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mb-5 bg-[#d8a23a] text-[#18392b] px-5 py-3 rounded-xl font-bold">
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
