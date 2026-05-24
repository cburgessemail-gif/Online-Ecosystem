import { useMemo, useState } from "react";

type LangKey =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "עברית"
  | "Français";

type PathwayKey =
  | "orientation"
  | "supervisor"
  | "tasks"
  | "attendance"
  | "assessments"
  | "marketplace"
  | "parents"
  | "partners";

const LANGS: LangKey[] = [
  "English",
  "Español",
  "Tagalog",
  "Italiano",
  "עברית",
  "Français",
];

/* =========================
   HERO IMAGE
========================= */

const heroImage = "/images/GrowArea.jpg?v=2";

/* =========================
   PATHWAY IMAGES
========================= */

const pathwayImages: Record<PathwayKey, string> = {
  orientation: "/images/GrowArea2.jpg?v=2",
  supervisor: "/images/Fence_volunteers.png?v=2",
  tasks: "/images/SAM_0410.JPG?v=2",
  attendance: "/images/SAM_0405.JPG?v=2",
  assessments: "/images/SAM_0420.JPG?v=2",
  marketplace:
    "/images/ConnectFoodEcosystem_withimages.png?v=2",
  parents: "/images/Seeds_Jubilee Gardens.png?v=2",
  partners: "/images/Partners.png?v=2",
};

/* =========================
   UI LANGUAGE
========================= */

const ui = {
  English: {
    badge:
      "BRONSON FAMILY FARM YOUTH WORKFORCE PROGRAM",
    title:
      "Summer 2026 Digital Training & Supervisor Management System",

    hero:
      "Welcome to the Youth Workforce Program",

    subtitle:
      "A guided digital training and supervisor management system for youth growers, supervisors, parents, partners, attendance, daily tasks, assessments, marketplace harvest flow, and program outcomes.",

    guided: "Begin Guided Tour",

    orientation:
      "Start Youth Orientation",

    choose:
      "Choose a Workforce Pathway",

    back:
      "Back to Pathways",

    nextMoves:
      "Next Strongest Moves",
  },

  Español: {
    badge:
      "PROGRAMA JUVENIL BRONSON FAMILY FARM",

    title:
      "Sistema Digital de Supervisión Verano 2026",

    hero:
      "Bienvenidos al Programa Juvenil",

    subtitle:
      "Sistema digital guiado para jóvenes, supervisores, padres, socios y resultados del programa.",

    guided:
      "Iniciar Recorrido",

    orientation:
      "Comenzar Orientación",

    choose:
      "Seleccione una Ruta",

    back:
      "Volver",

    nextMoves:
      "Próximos Pasos",
  },

  Tagalog: {
    badge:
      "BRONSON FAMILY FARM YOUTH WORKFORCE PROGRAM",

    title:
      "Digital Supervisor System Tag-init 2026",

    hero:
      "Maligayang Pagdating",

    subtitle:
      "Digital training at supervision system para sa kabataan, supervisors, pamilya, at partners.",

    guided:
      "Simulan Tour",

    orientation:
      "Simulan Orientation",

    choose:
      "Pumili ng Pathway",

    back:
      "Bumalik",

    nextMoves:
      "Susunod na Hakbang",
  },

  Italiano: {
    badge:
      "PROGRAMMA GIOVANILE",

    title:
      "Sistema Digitale Estate 2026",

    hero:
      "Benvenuti",

    subtitle:
      "Sistema digitale guidato per giovani lavoratori, supervisori, famiglie e partner.",

    guided:
      "Inizia Tour",

    orientation:
      "Avvia Orientamento",

    choose:
      "Scegli Percorso",

    back:
      "Indietro",

    nextMoves:
      "Prossimi Passi",
  },

  עברית: {
    badge:
      "תוכנית נוער",

    title:
      "מערכת דיגיטלית 2026",

    hero:
      "ברוכים הבאים",

    subtitle:
      "מערכת דיגיטלית לנוער, מפקחים, משפחות ושותפים.",

    guided:
      "התחל סיור",

    orientation:
      "התחל הדרכה",

    choose:
      "בחר מסלול",

    back:
      "חזרה",

    nextMoves:
      "הצעדים הבאים",
  },

  Français: {
    badge:
      "PROGRAMME JEUNESSE",

    title:
      "Système Numérique Été 2026",

    hero:
      "Bienvenue",

    subtitle:
      "Système numérique guidé pour les jeunes, superviseurs, familles et partenaires.",

    guided:
      "Commencer Visite",

    orientation:
      "Commencer Orientation",

    choose:
      "Choisir un Parcours",

    back:
      "Retour",

    nextMoves:
      "Prochaines Étapes",
  },
};

/* =========================
   PATHWAYS
========================= */

const pathways: Record<PathwayKey, any> = {
  orientation: {
    title:
      "Youth Orientation",

    need:
      "Youth need a safe, structured, and inspiring entry point before beginning work on the farm.",

    steps: [
      "Learn safety, PPE, hydration, respect, attendance, and field expectations.",
      "Understand how the farm connects to food access, marketplace activity, schools, and community health.",
      "Begin the summer with purpose, responsibility, teamwork, and pride.",
    ],

    outcome:
      "Youth begin the program ready to work, learn, grow, and contribute.",
  },

  supervisor: {
    title:
      "Supervisor Dashboard",

    need:
      "Supervisors need a phone-friendly system to manage youth groups in real time.",

    steps: [
      "Track youth attendance, task completion, safety, teamwork, and behavior.",
      "Document observations and progress for each youth.",
      "Support daily accountability while keeping the farm day organized.",
    ],

    outcome:
      "Supervisors become the operating leaders of the youth workforce ecosystem.",
  },

  tasks: {
    title:
      "Daily Farm Tasks",

    need:
      "Youth need daily assignments that connect real labor to real community outcomes.",

    steps: [
      "Complete watering, weeding, harvesting, sorting, labeling, composting, and cleanup.",
      "Understand why each task matters to the farm and marketplace.",
      "Build focus, responsibility, teamwork, and confidence away from social media distractions.",
    ],

    outcome:
      "Daily farm work becomes measurable youth skill development.",
  },

  attendance: {
    title:
      "Attendance Tracking",

    need:
      "The program needs reliable daily records for participation, staffing, and reporting.",

    steps: [
      "Check youth in and out each day.",
      "Track absences, late arrivals, early departures, and rotating participation.",
      "Support workforce readiness through consistency and accountability.",
    ],

    outcome:
      "Attendance becomes part of youth workforce discipline and program reporting.",
  },

  assessments: {
    title:
      "Youth Assessments",

    need:
      "Youth growth must be observed, documented, and encouraged throughout the summer.",

    steps: [
      "Track safety habits, teamwork, leadership, reliability, and task skills.",
      "Record supervisor notes and progress observations.",
      "Use assessments to support youth, parents, partners, and final outcomes.",
    ],

    outcome:
      "Youth leave with visible evidence of growth and workforce readiness.",
  },

  marketplace: {
    title:
      "Marketplace Harvest Flow",

    need:
      "Food grown by youth must move toward real destinations and community value.",

    steps: [
      "Move harvest from growing area to sorting, washing, labeling, and storage.",
      "Connect produce to marketplace customers, schools, partners, and community food access.",
      "Show youth how food production becomes nutrition, learning, revenue, and sustainability.",
    ],

    outcome:
      "Youth see how their work feeds people and supports the regional food ecosystem.",
  },

  parents: {
    title:
      "Parent / Guardian Connection",

    need:
      "Parents and guardians need visibility into youth participation and progress.",

    steps: [
      "Share updates, reminders, attendance notes, and progress highlights.",
      "Help families understand the youth workforce experience.",
      "Connect parents to the purpose, structure, and impact of the program.",
    ],

    outcome:
      "Families become connected stakeholders in youth growth.",
  },

  partners: {
    title:
      "Partner Support",

    need:
      "Partners need to see where their support fits inside the operating system.",

    steps: [
      "Connect labor, supplies, education, food access, health, and funding to program outcomes.",
      "Show how partner resources support youth, growers, marketplace flow, and community impact.",
      "Identify next opportunities for contribution and collaboration.",
    ],

    outcome:
      "Partners become active contributors to a living community food ecosystem.",
  },
};

/* =========================
   INFO CARD
========================= */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/20 p-5">
      <div className="text-xs uppercase tracking-[0.25em] text-white/60 font-black">
        {label}
      </div>

      <div className="mt-2 text-lg font-black text-white">
        {value}
      </div>
    </div>
  );
}

/* =========================
   APP
========================= */

export default function App() {
  const [lang, setLang] =
    useState<LangKey>("English");

  const [selected, setSelected] =
    useState<PathwayKey | null>(null);

  const copy = ui[lang];

  const active = useMemo(() => {
    if (!selected) return null;
    return pathways[selected];
  }, [selected]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#102414] text-white">

      <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,#6c7b42,transparent_30%),linear-gradient(135deg,#0e2213,#1f3d1d,#5b4a2d)] px-6 py-8">

        {/* HEADER */}

        <header className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4 rounded-[2rem] border border-white/15 bg-white/10 px-5 py-5 shadow-2xl backdrop-blur-md">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black">
              BFF
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-white/70">
                {copy.badge}
              </div>

              <div className="mt-2 text-2xl font-black leading-tight">
                {copy.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <select
              value={lang}
              onChange={(e) =>
                setLang(e.target.value as LangKey)
              }
              className="rounded-full bg-white px-6 py-4 text-lg font-black text-[#102414] shadow-xl"
            >
              {LANGS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>

            <button
              onClick={() =>
                setSelected("orientation")
              }
              className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-black text-white backdrop-blur-md transition hover:bg-white/20"
            >
              {copy.guided}
            </button>
          </div>
        </header>

        {/* HERO */}

        {!selected && (
          <>
            <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-2">

              {/* LEFT */}

              <div className="rounded-[2.5rem] border border-white/15 bg-white/10 p-12 shadow-2xl backdrop-blur-md">

                <div className="text-sm uppercase tracking-[0.4em] text-white/60 font-black">
                  Launch Ready
                </div>

                <h1 className="mt-8 text-6xl font-black leading-[0.95] md:text-8xl">
                  {copy.hero}
                </h1>

                <p className="mt-8 max-w-2xl text-2xl leading-relaxed text-white/85">
                  {copy.subtitle}
                </p>

                <div className="mt-10 grid gap-5 md:grid-cols-2">

                  <InfoCard
                    label="Program Dates"
                    value="June 8 – August 28, 2026"
                  />

                  <InfoCard
                    label="Schedule"
                    value="Monday–Friday • 8AM–2PM"
                  />

                  <InfoCard
                    label="Orientation"
                    value="June 5, 2026"
                  />

                  <InfoCard
                    label="Youth Capacity"
                    value="50 Participants"
                  />
                </div>

                <div className="mt-10 flex flex-wrap gap-4">

                  <button
                    onClick={() =>
                      setSelected("orientation")
                    }
                    className="rounded-full bg-white px-8 py-5 text-xl font-black text-[#123018] shadow-2xl transition hover:scale-[1.02]"
                  >
                    {copy.orientation}
                  </button>

                  <button
                    onClick={() =>
                      setSelected("supervisor")
                    }
                    className="rounded-full border border-white/20 bg-[#dce8c8] px-8 py-5 text-xl font-black text-[#123018] shadow-2xl transition hover:scale-[1.02]"
                  >
                    Supervisor Dashboard
                  </button>
                </div>
              </div>

              {/* RIGHT IMAGE */}

              <div className="overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl">

                <img
                  src={heroImage}
                  alt="Bronson Family Farm growing area"
                  className="h-[720px] w-full object-cover bg-[#dce8c8]"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/GrowArea2.jpg?v=2";
                  }}
                />

                <div className="p-6">

                  <div className="rounded-2xl bg-black/35 px-6 py-5 text-xl font-black">
                    Bronson Family Farm Youth Workforce growing area
                  </div>
                </div>
              </div>
            </section>

            {/* PATHWAYS */}

            <section className="mx-auto mt-10 max-w-7xl">

              <h2 className="mb-6 text-3xl font-black">
                {copy.choose}
              </h2>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {(Object.keys(pathways) as PathwayKey[]).map(
                  (key) => (
                    <button
                      key={key}
                      onClick={() =>
                        setSelected(key)
                      }
                      className="rounded-[2rem] border border-white/15 bg-white/10 p-7 text-left shadow-2xl backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/15"
                    >
                      <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                        Workforce Pathway
                      </div>

                      <div className="mt-4 text-3xl font-black">
                        {pathways[key].title}
                      </div>

                      <p className="mt-5 text-lg leading-relaxed text-white/80">
                        {pathways[key].need}
                      </p>
                    </button>
                  )
                )}
              </div>
            </section>
          </>
        )}

        {/* PATHWAY DETAIL */}

        {active && selected && (

          <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[1fr_420px]">

            <div className="rounded-[2.5rem] border border-white/15 bg-white/10 p-10 shadow-2xl backdrop-blur-md">

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="mb-8 rounded-full bg-white px-6 py-3 text-lg font-black text-[#123018]"
              >
                ← {copy.back}
              </button>

              <div className="grid gap-8 xl:grid-cols-[1fr_420px]">

                <div>

                  <div className="text-sm uppercase tracking-[0.35em] text-white/60">
                    Youth Workforce Pathway
                  </div>

                  <h1 className="mt-5 text-6xl font-black leading-tight">
                    {active.title}
                  </h1>

                  <div className="mt-8 rounded-[2rem] bg-black/20 p-8">

                    <h2 className="text-2xl font-black">
                      Need Being Met
                    </h2>

                    <p className="mt-4 text-xl leading-relaxed text-white/85">
                      {active.need}
                    </p>
                  </div>
                </div>

                {/* PATHWAY IMAGE */}

                <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-black/20">

                  <img
                    src={pathwayImages[selected]}
                    alt={active.title}
                    className="h-[360px] w-full object-cover"
                  />

                  <div className="p-4 text-lg font-black">
                    {active.title}
                  </div>
                </div>
              </div>

              {/* STEPS */}

              <div className="mt-8 grid gap-5">

                {active.steps.map(
                  (
                    step: string,
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="rounded-[2rem] bg-white/10 p-7"
                    >
                      <div className="text-sm uppercase tracking-[0.3em] text-white/60">
                        Step {index + 1}
                      </div>

                      <div className="mt-4 text-xl leading-relaxed">
                        {step}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* OUTCOME */}

              <div className="mt-8 rounded-[2rem] bg-[#dce8c8] p-8 text-[#123018]">

                <div className="text-sm uppercase tracking-[0.3em]">
                  Outcome
                </div>

                <div className="mt-4 text-2xl font-black leading-relaxed">
                  {active.outcome}
                </div>
              </div>
            </div>

            {/* SIDEBAR */}

            <aside className="h-fit rounded-[2.5rem] border border-white/15 bg-black/20 p-8 shadow-2xl">

              <h2 className="text-3xl font-black">
                {copy.nextMoves}
              </h2>

              <div className="mt-6 grid gap-4">

                {[
                  "Prepare supervisor teams",
                  "Finalize youth roster",
                  "Complete orientation",
                  "Prepare digital attendance",
                  "Prepare assessments",
                  "Prepare marketplace tracking",
                  "Connect parent communication",
                  "Prepare partner reporting",
                ].map((move) => (
                  <div
                    key={move}
                    className="rounded-2xl bg-white/10 p-5 text-lg font-semibold"
                  >
                    {move}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] bg-white p-6 text-[#123018]">

                <div className="text-sm uppercase tracking-[0.3em]">
                  Feedback & Reflection
                </div>

                <p className="mt-4 text-lg font-semibold leading-relaxed">
                  Youth, supervisors, parents, growers, and partners can contribute feedback to strengthen the ecosystem.
                </p>
              </div>
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}
