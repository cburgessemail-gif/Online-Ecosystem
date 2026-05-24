import { useMemo, useState } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";

type PathwayKey =
  | "orientation"
  | "supervisor"
  | "tasks"
  | "attendance"
  | "assessments"
  | "marketplace"
  | "parents"
  | "partners";

const LANGS: LangKey[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const t = {
  English: {
    badge: "BRONSON FAMILY FARM YOUTH WORKFORCE PROGRAM",
    system: "Summer 2026 Digital Training & Supervisor Management System",
    heroTitle: "Welcome to the Youth Workforce Program",
    heroText:
      "A guided digital training and supervisor management system for youth growers, supervisors, parents, partners, attendance, daily tasks, assessments, marketplace harvest flow, and program outcomes.",
    enter: "Start Youth Orientation",
    guided: "Begin Guided Tour",
    dates: "Program Dates",
    datesValue: "June 8 – August 28, 2026",
    schedule: "Schedule",
    scheduleValue: "Monday–Friday • 8:00 AM–2:00 PM",
    orientation: "Online Orientation",
    orientationValue: "June 5, 2026",
    capacity: "Youth Capacity",
    capacityValue: "50 Youth",
    choose: "Choose a Workforce Pathway",
    nextMoves: "Next Strongest Moves",
    back: "Back to Pathways",
    finalDecision: "Final Decision",
    share: "Share / Feedback",
  },
  Español: {
    badge: "PROGRAMA JUVENIL DE BRONSON FAMILY FARM",
    system: "Sistema Digital de Capacitación y Supervisión Verano 2026",
    heroTitle: "Bienvenidos al Programa Juvenil de Trabajo",
    heroText:
      "Un sistema digital guiado para jóvenes agricultores, supervisores, padres, socios, asistencia, tareas diarias, evaluaciones, flujo de cosecha al mercado y resultados del programa.",
    enter: "Comenzar Orientación Juvenil",
    guided: "Iniciar Recorrido Guiado",
    dates: "Fechas del Programa",
    datesValue: "8 de junio – 28 de agosto de 2026",
    schedule: "Horario",
    scheduleValue: "Lunes–Viernes • 8:00 AM–2:00 PM",
    orientation: "Orientación en Línea",
    orientationValue: "5 de junio de 2026",
    capacity: "Capacidad Juvenil",
    capacityValue: "50 Jóvenes",
    choose: "Elija una Ruta Laboral",
    nextMoves: "Próximos Pasos",
    back: "Volver a Rutas",
    finalDecision: "Decisión Final",
    share: "Compartir / Comentarios",
  },
  Tagalog: {
    badge: "BRONSON FAMILY FARM YOUTH WORKFORCE PROGRAM",
    system: "Digital Training at Supervisor Management System Tag-init 2026",
    heroTitle: "Maligayang Pagdating sa Youth Workforce Program",
    heroText:
      "Isang gabay na digital system para sa kabataan, supervisors, magulang, partners, attendance, araw-araw na gawain, assessments, ani para sa marketplace, at resulta ng programa.",
    enter: "Simulan ang Youth Orientation",
    guided: "Simulan ang Guided Tour",
    dates: "Petsa ng Programa",
    datesValue: "Hunyo 8 – Agosto 28, 2026",
    schedule: "Iskedyul",
    scheduleValue: "Lunes–Biyernes • 8:00 AM–2:00 PM",
    orientation: "Online Orientation",
    orientationValue: "Hunyo 5, 2026",
    capacity: "Bilang ng Kabataan",
    capacityValue: "50 Kabataan",
    choose: "Pumili ng Workforce Pathway",
    nextMoves: "Susunod na Malakas na Hakbang",
    back: "Bumalik sa Pathways",
    finalDecision: "Panghuling Desisyon",
    share: "Ibahagi / Feedback",
  },
  Italiano: {
    badge: "PROGRAMMA GIOVANILE BRONSON FAMILY FARM",
    system: "Sistema Digitale di Formazione e Supervisione Estate 2026",
    heroTitle: "Benvenuti al Programma Giovani Lavoratori",
    heroText:
      "Un sistema digitale guidato per giovani coltivatori, supervisori, genitori, partner, presenze, attività quotidiane, valutazioni, raccolto per il mercato e risultati del programma.",
    enter: "Avvia Orientamento Giovani",
    guided: "Inizia Tour Guidato",
    dates: "Date del Programma",
    datesValue: "8 giugno – 28 agosto 2026",
    schedule: "Orario",
    scheduleValue: "Lunedì–Venerdì • 8:00–14:00",
    orientation: "Orientamento Online",
    orientationValue: "5 giugno 2026",
    capacity: "Capacità Giovani",
    capacityValue: "50 Giovani",
    choose: "Scegli un Percorso",
    nextMoves: "Prossime Azioni",
    back: "Torna ai Percorsi",
    finalDecision: "Decisione Finale",
    share: "Condividi / Feedback",
  },
  עברית: {
    badge: "תוכנית כוח העבודה לנוער של ברונסון פמילי פארם",
    system: "מערכת דיגיטלית להכשרה וניהול קיץ 2026",
    heroTitle: "ברוכים הבאים לתוכנית הנוער",
    heroText:
      "מערכת דיגיטלית מודרכת לנוער, מפקחים, הורים, שותפים, נוכחות, משימות יומיות, הערכות, זרימת יבול לשוק ותוצאות התוכנית.",
    enter: "התחל הדרכת נוער",
    guided: "התחל סיור מודרך",
    dates: "תאריכי התוכנית",
    datesValue: "8 ביוני – 28 באוגוסט 2026",
    schedule: "לוח זמנים",
    scheduleValue: "שני–שישי • 8:00–14:00",
    orientation: "הדרכה מקוונת",
    orientationValue: "5 ביוני 2026",
    capacity: "קיבולת נוער",
    capacityValue: "50 משתתפים",
    choose: "בחר מסלול",
    nextMoves: "הצעדים הבאים",
    back: "חזרה למסלולים",
    finalDecision: "החלטה סופית",
    share: "שיתוף / משוב",
  },
  Français: {
    badge: "PROGRAMME JEUNESSE BRONSON FAMILY FARM",
    system: "Système Numérique de Formation et Supervision Été 2026",
    heroTitle: "Bienvenue au Programme Jeunesse",
    heroText:
      "Un système numérique guidé pour les jeunes cultivateurs, superviseurs, parents, partenaires, présence, tâches quotidiennes, évaluations, récolte vers le marché et résultats du programme.",
    enter: "Commencer l’Orientation",
    guided: "Commencer la Visite Guidée",
    dates: "Dates du Programme",
    datesValue: "8 juin – 28 août 2026",
    schedule: "Horaire",
    scheduleValue: "Lundi–Vendredi • 8h00–14h00",
    orientation: "Orientation en Ligne",
    orientationValue: "5 juin 2026",
    capacity: "Capacité Jeunesse",
    capacityValue: "50 Jeunes",
    choose: "Choisir un Parcours",
    nextMoves: "Prochaines Étapes",
    back: "Retour aux Parcours",
    finalDecision: "Décision Finale",
    share: "Partager / Commentaires",
  },
};

const image = "/images/GrowArea.jpg";

const pathways: Record<PathwayKey, any> = {
  orientation: {
    title: "Youth Orientation",
    need: "Youth need a clear, calm starting point before entering the farm work environment.",
    experience: [
      "Welcome to Bronson Family Farm and the Youth Workforce Program.",
      "Understand safety, PPE, hydration, respect, attendance, and daily expectations.",
      "Learn how farm work connects to food access, marketplace activity, and community service.",
    ],
    destination: "Youth are ready to begin the program with confidence and purpose.",
    decision: "I am ready to participate, follow safety expectations, and grow with the team.",
  },
  supervisor: {
    title: "Supervisor Dashboard",
    need: "Supervisors need a simple phone-friendly system for managing youth in the field.",
    experience: [
      "View assigned youth groups and daily responsibilities.",
      "Track attendance, task completion, behavior, leadership, safety, and participation.",
      "Record notes that support progress reports and partner accountability.",
    ],
    destination: "Supervisors become ecosystem operators, not just monitors.",
    decision: "I am ready to supervise, document, support, and report youth progress.",
  },
  tasks: {
    title: "Daily Farm Tasks",
    need: "Youth need structure so every workday has meaning and measurable progress.",
    experience: [
      "Receive daily assignments such as watering, weeding, harvesting, sorting, labeling, composting, and cleanup.",
      "Understand how each task supports the farm, marketplace, schools, and community food destinations.",
      "Build work habits, responsibility, teamwork, and focus away from social media distractions.",
    ],
    destination: "Daily work becomes visible skill development.",
    decision: "I understand my daily role and how my work supports the larger food system.",
  },
  attendance: {
    title: "Attendance",
    need: "The program needs reliable records for youth participation, staffing, and reporting.",
    experience: [
      "Check youth in and out each day.",
      "Track absences, late arrivals, early departures, and rotating participation.",
      "Support up to 50 youth first round, with capacity to track larger databases over time.",
    ],
    destination: "Attendance becomes part of workforce readiness and accountability.",
    decision: "I will show up on time, communicate clearly, and respect the schedule.",
  },
  assessments: {
    title: "Youth Assessments",
    need: "Youth growth must be observed, documented, and encouraged throughout the program.",
    experience: [
      "Supervisors track life skills, task skills, safety habits, teamwork, leadership, and reliability.",
      "Youth can earn visible progress through badges, notes, reflections, and completed activities.",
      "Assessment supports youth development, parent communication, and program outcomes.",
    ],
    destination: "Youth leave with evidence of growth, responsibility, and work readiness.",
    decision: "I want my growth to be seen, supported, and documented.",
  },
  marketplace: {
    title: "Marketplace Harvest Flow",
    need: "Food grown by youth must move toward real destinations and community value.",
    experience: [
      "Track harvest from field to sorting, washing, labeling, storage, and marketplace readiness.",
      "Connect produce to marketplace customers, schools, partners, and community food access.",
      "Understand how farm labor becomes nutrition, income, learning, and sustainability.",
    ],
    destination: "Youth see the real result of what they grow.",
    decision: "I understand how growing food connects to the marketplace and community health.",
  },
  parents: {
    title: "Parent / Guardian Connection",
    need: "Parents and guardians need visibility into youth participation and progress.",
    experience: [
      "Receive program updates, attendance notes, progress highlights, and reminders.",
      "Understand how the farm supports responsibility, confidence, teamwork, and future readiness.",
      "Stay connected to the youth workforce experience without interrupting field operations.",
    ],
    destination: "Families become connected stakeholders in youth growth.",
    decision: "I want to stay informed and support my youth’s progress.",
  },
  partners: {
    title: "Partner Support",
    need: "Partners need to understand where their support fits inside the operating system.",
    experience: [
      "See how labor, supplies, education, food access, health, transportation, and funding connect.",
      "Support youth workforce, growers, marketplace flow, nutrition education, and community outcomes.",
      "Use the system to identify clear needs and next contributions.",
    ],
    destination: "Partners become resource contributors to a living ecosystem.",
    decision: "I want to support the Youth Workforce Program and the regional food ecosystem.",
  },
};

export default function App() {
  const [lang, setLang] = useState<LangKey>("English");
  const [selected, setSelected] = useState<PathwayKey | null>(null);

  const copy = t[lang];

  const activePathway = useMemo(() => {
    if (!selected) return null;
    return pathways[selected];
  }, [selected]);

  return (
    <main className="min-h-screen bg-[#142615] text-white overflow-x-hidden">
      <section className="min-h-screen px-6 py-8 bg-[radial-gradient(circle_at_top_left,#5f7040,transparent_35%),linear-gradient(135deg,#102414,#32431d,#6f5a34)]">
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 shadow-xl backdrop-blur-md">
            <div className="h-12 w-12 rounded-xl bg-white/25 flex items-center justify-center font-black">
              BFF
            </div>
            <div>
              <div className="text-xs tracking-[0.25em] uppercase text-white/70">{copy.badge}</div>
              <div className="font-black text-lg">{copy.system}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangKey)}
              className="rounded-full px-5 py-3 text-[#142615] font-bold"
            >
              {LANGS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <button
              onClick={() => setSelected("orientation")}
              className="rounded-full border border-white/25 bg-white/10 px-5 py-3 font-bold"
            >
              {copy.guided}
            </button>
          </div>
        </header>

        {!selected && (
          <>
            <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 mt-8">
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-md">
                <div className="text-sm uppercase tracking-[0.35em] font-black text-white/70">Launch Ready</div>
                <h1 className="mt-6 text-5xl md:text-7xl font-black leading-[0.95]">{copy.heroTitle}</h1>
                <p className="mt-7 text-xl text-white/85 leading-relaxed">{copy.heroText}</p>

                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <Info label={copy.dates} value={copy.datesValue} />
                  <Info label={copy.schedule} value={copy.scheduleValue} />
                  <Info label={copy.orientation} value={copy.orientationValue} />
                  <Info label={copy.capacity} value={copy.capacityValue} />
                </div>

                <div className="flex flex-wrap gap-4 mt-9">
                  <button
                    onClick={() => setSelected("orientation")}
                    className="rounded-full bg-white text-[#123018] px-7 py-4 font-black shadow-xl"
                  >
                    {copy.enter}
                  </button>
                  <button
                    onClick={() => setSelected("supervisor")}
                    className="rounded-full bg-[#dce8c8] text-[#123018] px-7 py-4 font-black shadow-xl"
                  >
                    Supervisor Dashboard
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/15 bg-white/10 overflow-hidden shadow-2xl">
                <img
                  src={image}
                  alt="Bronson Family Farm entrance and growing area"
                  className="h-[520px] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="p-5">
                  <div className="rounded-2xl bg-black/35 px-5 py-4 font-black">
                    Bronson Family Farm Youth Workforce growing area
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto mt-6">
              <h2 className="text-2xl font-black mb-4">{copy.choose}</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                {(Object.keys(pathways) as PathwayKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className="text-left rounded-3xl border border-white/15 bg-white/10 p-6 hover:bg-white/20 transition shadow-xl"
                  >
                    <div className="text-sm uppercase tracking-[0.25em] text-white/60">Pathway</div>
                    <div className="mt-3 text-2xl font-black">{pathways[key].title}</div>
                    <p className="mt-4 text-white/75 leading-relaxed">{pathways[key].need}</p>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {activePathway && (
          <section className="max-w-7xl mx-auto mt-8 grid lg:grid-cols-[1fr_420px] gap-6">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-md">
              <button
                onClick={() => setSelected(null)}
                className="mb-8 rounded-full bg-white text-[#123018] px-6 py-3 font-black"
              >
                ← {copy.back}
              </button>

              <div className="text-sm uppercase tracking-[0.35em] text-white/60 font-black">Youth Workforce Pathway</div>
              <h1 className="mt-4 text-5xl md:text-7xl font-black leading-tight">{activePathway.title}</h1>

              <div className="mt-8 rounded-3xl bg-black/25 p-6">
                <h3 className="text-xl font-black">Need Being Met</h3>
                <p className="mt-3 text-white/80 text-lg leading-relaxed">{activePathway.need}</p>
              </div>

              <div className="mt-6 rounded-3xl bg-white/10 p-6">
                <h3 className="text-xl font-black">Experience</h3>
                <div className="mt-4 grid gap-4">
                  {activePathway.experience.map((item: string, index: number) => (
                    <div key={index} className="rounded-2xl bg-black/20 p-5">
                      <div className="text-sm uppercase tracking-[0.25em] text-white/50">Step {index + 1}</div>
                      <p className="mt-2 text-lg leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mt-6">
                <div className="rounded-3xl bg-[#dce8c8] text-[#123018] p-6">
                  <h3 className="text-xl font-black">Destination</h3>
                  <p className="mt-3 font-semibold leading-relaxed">{activePathway.destination}</p>
                </div>

                <div className="rounded-3xl bg-white text-[#123018] p-6">
                  <h3 className="text-xl font-black">{copy.finalDecision}</h3>
                  <p className="mt-3 font-semibold leading-relaxed">{activePathway.decision}</p>
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/15 bg-black/20 p-6 shadow-2xl h-fit">
              <h2 className="text-xl font-black">{copy.nextMoves}</h2>
              <div className="mt-5 grid gap-3">
                {[
                  "Confirm supervisor assignments",
                  "Prepare online orientation",
                  "Load youth roster",
                  "Prepare attendance tracker",
                  "Prepare daily task checklist",
                  "Prepare assessment categories",
                  "Connect harvest flow to marketplace",
                  "Prepare parent / guardian communication",
                ].map((move) => (
                  <div key={move} className="rounded-2xl bg-white/10 p-4 font-semibold">
                    {move}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-white text-[#123018] p-5">
                <h3 className="font-black">{copy.share}</h3>
                <p className="mt-2 text-sm font-semibold">
                  Collect feedback from youth, supervisors, parents, partners, and marketplace users.
                </p>
              </div>
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/20 p-5">
      <div className="text-xs uppercase tracking-[0.25em] text-white/55 font-black">{label}</div>
      <div className="mt-2 text-lg font-black">{value}</div>
    </div>
  );
}
