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

/* ==================================================
   REAL ECOSYSTEM IMAGES
================================================== */

const ecosystemHero =
  "/images/ConnectFoodEcosystem_withimages.png";

const pathwayImages: Record<PathwayKey, string> = {
  orientation: "/images/SAM_0417.JPG",

  supervisor: "/images/Fence_volunteers.png",

  tasks: "/images/SAM_0405.JPG",

  attendance: "/images/SAM_0410.JPG",

  assessments: "/images/SAM_0420.JPG",

  marketplace:
    "/images/ConnectFoodEcosystem_withimages.png",

  parents:
    "/images/Seeds_Jubilee Gardens.png",

  partners: "/images/Partners.png",
};

/* ==================================================
   LANGUAGE
================================================== */

const ui = {
  English: {
    title:
      "Summer 2026 Digital Training & Supervisor Management System",

    badge:
      "BRONSON FAMILY FARM YOUTH WORKFORCE PROGRAM",

    hero:
      "Welcome to the Youth Workforce Program",

    subtitle:
      "A guided digital training and supervisor management ecosystem for youth growers, supervisors, attendance, assessments, marketplace harvest flow, family connection, and regional food access.",

    guided:
      "Begin Guided Tour",

    pathways:
      "Workforce Pathways",

    back:
      "Back to Ecosystem",
  },

  Español: {
    title:
      "Sistema Digital de Supervisión 2026",

    badge:
      "PROGRAMA JUVENIL",

    hero:
      "Bienvenidos",

    subtitle:
      "Sistema digital para jóvenes, supervisores y familias.",

    guided:
      "Comenzar",

    pathways:
      "Rutas",

    back:
      "Regresar",
  },

  Tagalog: {
    title:
      "Digital Workforce System",

    badge:
      "YOUTH PROGRAM",

    hero:
      "Maligayang Pagdating",

    subtitle:
      "Digital ecosystem para sa kabataan.",

    guided:
      "Simulan",

    pathways:
      "Pathways",

    back:
      "Bumalik",
  },

  Italiano: {
    title:
      "Sistema Digitale",

    badge:
      "PROGRAMMA",

    hero:
      "Benvenuti",

    subtitle:
      "Sistema digitale per giovani.",

    guided:
      "Inizia",

    pathways:
      "Percorsi",

    back:
      "Indietro",
  },

  עברית: {
    title:
      "מערכת דיגיטלית",

    badge:
      "תוכנית",

    hero:
      "ברוכים הבאים",

    subtitle:
      "מערכת לנוער ומשפחות.",

    guided:
      "התחל",

    pathways:
      "מסלולים",

    back:
      "חזרה",
  },

  Français: {
    title:
      "Système Numérique",

    badge:
      "PROGRAMME",

    hero:
      "Bienvenue",

    subtitle:
      "Système numérique jeunesse.",

    guided:
      "Commencer",

    pathways:
      "Parcours",

    back:
      "Retour",
  },
};

/* ==================================================
   PATHWAYS
================================================== */

const pathways = {
  orientation: {
    title:
      "Youth Orientation",

    description:
      "Youth learn PPE, hydration, safety, teamwork, respect, field operations, marketplace purpose, and ecosystem responsibilities.",

    outcome:
      "Youth begin the summer ready for structured participation.",
  },

  supervisor: {
    title:
      "Supervisor Dashboard",

    description:
      "Supervisors track attendance, participation, assessments, teamwork, and field observations directly from mobile devices.",

    outcome:
      "Supervisors become operational ecosystem leaders.",
  },

  tasks: {
    title:
      "Daily Farm Tasks",

    description:
      "Youth complete planting, harvesting, composting, irrigation, cleanup, and distribution preparation.",

    outcome:
      "Youth connect labor to real food system outcomes.",
  },

  attendance: {
    title:
      "Attendance Tracking",

    description:
      "Track check-in, participation, rotation, consistency, and workforce readiness.",

    outcome:
      "Attendance becomes measurable accountability.",
  },

  assessments: {
    title:
      "Youth Assessments",

    description:
      "Measure growth in teamwork, leadership, safety, responsibility, and communication.",

    outcome:
      "Youth leave with visible growth and workforce readiness.",
  },

  marketplace: {
    title:
      "Marketplace Harvest Flow",

    description:
      "Produce moves from field to washing, sorting, labeling, storage, schools, and marketplace destinations.",

    outcome:
      "Youth understand how food becomes community impact.",
  },

  parents: {
    title:
      "Parent / Guardian Connection",

    description:
      "Parents remain connected to attendance, progress, reminders, and youth development.",

    outcome:
      "Families become connected stakeholders.",
  },

  partners: {
    title:
      "Partner Ecosystem",

    description:
      "Partners support workforce development, tools, seeds, fencing, health, food access, and operational sustainability.",

    outcome:
      "Community resources become integrated ecosystem infrastructure.",
  },
};

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

      <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,#6d7f47,transparent_30%),linear-gradient(135deg,#0f2314,#18361b,#4b5b2d)] px-6 py-8">

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

          <div className="flex items-center gap-4">

            <select
              value={lang}
              onChange={(e) =>
                setLang(e.target.value as LangKey)
              }
              className="rounded-full bg-white px-6 py-4 text-lg font-black text-[#102414]"
            >
              {LANGS.map((l) => (
                <option key={l}>
                  {l}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                setSelected("orientation")
              }
              className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-black text-white backdrop-blur-md"
            >
              {copy.guided}
            </button>
          </div>
        </header>

        {/* HERO */}

        {!selected && (
          <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-2">

            {/* LEFT */}

            <div className="rounded-[2.5rem] border border-white/15 bg-white/10 p-12 shadow-2xl backdrop-blur-md">

              <div className="text-sm uppercase tracking-[0.4em] text-white/60 font-black">
                Launch Ready
              </div>

              <h1 className="mt-8 text-7xl font-black leading-[0.92]">
                {copy.hero}
              </h1>

              <p className="mt-8 text-2xl leading-relaxed text-white/85">
                {copy.subtitle}
              </p>

              <div className="mt-10 grid gap-5 md:grid-cols-2">

                {Object.entries(pathways).map(
                  ([key, value]) => (
                    <button
                      key={key}
                      onClick={() =>
                        setSelected(
                          key as PathwayKey
                        )
                      }
                      className="rounded-2xl border border-white/15 bg-black/20 p-5 text-left transition hover:scale-[1.02] hover:bg-white/10"
                    >
                      <div className="text-xl font-black">
                        {value.title}
                      </div>

                      <div className="mt-3 text-sm text-white/70">
                        {value.outcome}
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* RIGHT */}

            <div className="overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl">

              <img
                src={ecosystemHero}
                alt="Bronson Family Farm Ecosystem"
                className="h-[760px] w-full object-cover"
              />

              <div className="p-6">

                <div className="rounded-2xl bg-black/35 px-6 py-5 text-xl font-black">
                  Bronson Family Farm real operational ecosystem
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PATHWAY */}

        {selected && active && (
          <section className="mx-auto mt-8 max-w-7xl">

            <div className="grid gap-6 lg:grid-cols-2">

              <div className="rounded-[2.5rem] border border-white/15 bg-white/10 p-12 shadow-2xl backdrop-blur-md">

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                  className="rounded-full border border-white/20 bg-black/20 px-6 py-3 text-sm font-black"
                >
                  {copy.back}
                </button>

                <h2 className="mt-8 text-6xl font-black leading-[0.95]">
                  {active.title}
                </h2>

                <p className="mt-8 text-2xl leading-relaxed text-white/85">
                  {active.description}
                </p>

                <div className="mt-10 rounded-3xl border border-white/15 bg-black/20 p-8">

                  <div className="text-sm uppercase tracking-[0.35em] text-white/60">
                    Ecosystem Outcome
                  </div>

                  <div className="mt-4 text-3xl font-black">
                    {active.outcome}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl">

                <img
                  src={
                    pathwayImages[selected]
                  }
                  alt={active.title}
                  className="h-[760px] w-full object-cover"
                />
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
