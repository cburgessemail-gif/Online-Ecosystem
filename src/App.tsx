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

const image = "/images/GrowArea.JPG";

const ui = {
  English: {
    badge: "BRONSON FAMILY FARM YOUTH WORKFORCE PROGRAM",
    title:
      "Summer 2026 Digital Training & Supervisor Management System",
    hero: "Welcome to the Youth Workforce Program",
    subtitle:
      "A guided digital training and supervisor management system for youth growers, supervisors, parents, partners, attendance, daily tasks, assessments, marketplace harvest flow, and program outcomes.",
    guided: "Begin Guided Tour",
    orientation: "Start Youth Orientation",
    choose: "Choose a Workforce Pathway",
    back: "Back to Pathways",
    nextMoves: "Next Strongest Moves",
  },

  Español: {
    badge: "PROGRAMA JUVENIL BRONSON FAMILY FARM",
    title: "Sistema Digital de Supervisión Verano 2026",
    hero: "Bienvenidos al Programa Juvenil",
    subtitle:
      "Sistema digital guiado para jóvenes agricultores y supervisores.",
    guided: "Iniciar Recorrido",
    orientation: "Comenzar Orientación",
    choose: "Seleccione una Ruta",
    back: "Volver",
    nextMoves: "Próximos Pasos",
  },

  Tagalog: {
    badge: "BRONSON FAMILY FARM YOUTH WORKFORCE PROGRAM",
    title: "Digital Supervisor System Tag-init 2026",
    hero: "Maligayang Pagdating",
    subtitle:
      "Digital training at supervision system para sa kabataan.",
    guided: "Simulan Tour",
    orientation: "Simulan Orientation",
    choose: "Pumili ng Pathway",
    back: "Bumalik",
    nextMoves: "Susunod na Hakbang",
  },

  Italiano: {
    badge: "PROGRAMMA GIOVANILE",
    title: "Sistema Digitale Estate 2026",
    hero: "Benvenuti",
    subtitle: "Sistema digitale guidato per giovani lavoratori.",
    guided: "Inizia Tour",
    orientation: "Avvia Orientamento",
    choose: "Scegli Percorso",
    back: "Indietro",
    nextMoves: "Prossimi Passi",
  },

  עברית: {
    badge: "תוכנית נוער",
    title: "מערכת דיגיטלית 2026",
    hero: "ברוכים הבאים",
    subtitle: "מערכת דיגיטלית לנוער ומפקחים.",
    guided: "התחל סיור",
    orientation: "התחל הדרכה",
    choose: "בחר מסלול",
    back: "חזרה",
    nextMoves: "הצעדים הבאים",
  },

  Français: {
    badge: "PROGRAMME JEUNESSE",
    title: "Système Numérique Été 2026",
    hero: "Bienvenue",
    subtitle: "Système numérique guidé pour les jeunes.",
    guided: "Commencer Visite",
    orientation: "Commencer Orientation",
    choose: "Choisir un Parcours",
    back: "Retour",
    nextMoves: "Prochaines Étapes",
  },
};

const pathways: Record<PathwayKey, any> = {
  orientation: {
    title: "Youth Orientation",
    need:
      "Youth need a safe and structured entry point into the workforce environment.",
    steps: [
      "Learn farm safety and PPE expectations.",
      "Understand attendance and daily responsibilities.",
      "Connect the farm to food access and community health.",
    ],
    outcome:
      "Youth begin the program with confidence, direction, and purpose.",
  },

  supervisor: {
    title: "Supervisor Dashboard",
    need:
      "Supervisors need a mobile-friendly operational management system.",
    steps: [
      "Track youth attendance and participation.",
      "Document safety, teamwork, and leadership.",
      "Manage groups and daily responsibilities.",
    ],
    outcome:
      "Supervisors become operational ecosystem leaders.",
  },

  tasks: {
    title: "Daily Farm Tasks",
    need:
      "Youth need meaningful daily assignments connected to real outcomes.",
    steps: [
      "Watering and field maintenance.",
      "Harvesting and sorting produce.",
      "Marketplace preparation and cleanup.",
    ],
    outcome:
      "Youth understand how their labor supports the community.",
  },

  attendance: {
    title: "Attendance Tracking",
    need:
      "Reliable attendance tracking supports workforce readiness.",
    steps: [
      "Daily check-in and check-out.",
      "Supervisor verification.",
      "Participation tracking and reporting.",
    ],
    outcome:
      "Youth develop accountability and consistency.",
  },

  assessments: {
    title: "Youth Assessments",
    need:
      "Growth must be documented throughout the program.",
    steps: [
      "Track leadership and participation.",
      "Evaluate teamwork and responsibility.",
      "Document growth and workforce readiness.",
    ],
    outcome:
      "Youth leave with measurable development.",
  },

  marketplace: {
    title: "Marketplace Harvest Flow",
    need:
      "Youth should see how food moves from farm to community.",
    steps: [
      "Harvest and wash produce.",
      "Label and prepare products.",
      "Move food toward marketplace destinations.",
    ],
    outcome:
      "Youth connect farming to health and sustainability.",
  },

  parents: {
    title: "Parent / Guardian Connection",
    need:
      "Families should remain connected to youth progress.",
    steps: [
      "Receive updates and attendance information.",
      "Understand youth progress and development.",
      "Support continued participation.",
    ],
    outcome:
      "Families become connected stakeholders.",
  },

  partners: {
    title: "Partner Support",
    need:
      "Partners should clearly understand ecosystem impact.",
    steps: [
      "View operational outcomes.",
      "Support youth and food systems.",
      "Identify opportunities for collaboration.",
    ],
    outcome:
      "Partners become active contributors to regional impact.",
  },
};

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

export default function App() {
  const [lang, setLang] = useState<LangKey>("English");
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
              onClick={() => setSelected("orientation")}
              className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-black text-white backdrop-blur-md transition hover:bg-white/20"
            >
              {copy.guided}
            </button>
          </div>
        </header>

        {!selected && (
          <>
            {/* HERO */}

            <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-2">

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

              {/* IMAGE PANEL */}

              <div className="overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl">

                <img
                  src={image}
                  alt="Bronson Family Farm Youth Workforce growing area"
                  className="h-[720px] w-full object-cover"
                  onError={(e) => {
                    console.error(
                      "IMAGE FAILED:",
                      image
                    );

                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop";
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

        {active && (

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

              <div className="mt-8 rounded-[2rem] bg-[#dce8c8] p-8 text-[#123018]">

                <div className="text-sm uppercase tracking-[0.3em]">
                  Outcome
                </div>

                <div className="mt-4 text-2xl font-black leading-relaxed">
                  {active.outcome}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}

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
                  Youth, supervisors, parents, growers, and partners can
                  contribute feedback to strengthen the ecosystem.
                </p>
              </div>
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}
