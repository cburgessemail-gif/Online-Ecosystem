import React, { useMemo, useState } from "react";

type Lang = "en" | "es" | "tl" | "it" | "he" | "fr";
type Role =
  | "home"
  | "guest"
  | "customer"
  | "marketplace"
  | "grower"
  | "youth"
  | "parent"
  | "supervisor"
  | "caseManager"
  | "partner"
  | "mission";

type SupportLevel = "Green" | "Yellow" | "Orange" | "Red";

const year = new Date().getFullYear();

const labels: Record<Lang, any> = {
  en: {
    title: "Bronson Family Farm Digital Ecosystem",
    subtitle: "Cultivating People. Cultivating Land. Cultivating Community.",
    enter: "Enter the Ecosystem",
    home: "Home",
    guest: "Guest",
    customer: "Customer",
    marketplace: "Marketplace",
    grower: "Grower",
    youth: "Youth Workforce",
    parent: "Parent / Guardian",
    supervisor: "Supervisor",
    caseManager: "Case Manager",
    partner: "Partner",
    mission: "Mission Control",
    support: "Concern & Support Center",
    footer: `© ${year} Bronson Family Farm LLC and Farm & Family Alliance Inc. Developed by Bronson Family Farm. All rights reserved.`,
  },
  es: {
    title: "Ecosistema Digital de Bronson Family Farm",
    subtitle: "Cultivando Personas. Cultivando Tierra. Cultivando Comunidad.",
    enter: "Entrar al Ecosistema",
    home: "Inicio",
    guest: "Invitado",
    customer: "Cliente",
    marketplace: "Mercado",
    grower: "Productor",
    youth: "Fuerza Laboral Juvenil",
    parent: "Padre / Tutor",
    supervisor: "Supervisor",
    caseManager: "Administrador de Casos",
    partner: "Socio",
    mission: "Centro de Control",
    support: "Centro de Apoyo",
    footer: `© ${year} Bronson Family Farm LLC y Farm & Family Alliance Inc. Desarrollado por Bronson Family Farm. Todos los derechos reservados.`,
  },
  tl: {
    title: "Bronson Family Farm Digital Ecosystem",
    subtitle: "Naglilinang ng Tao. Lupa. Komunidad.",
    enter: "Pumasok sa Ecosystem",
    home: "Home",
    guest: "Bisita",
    customer: "Customer",
    marketplace: "Marketplace",
    grower: "Grower",
    youth: "Youth Workforce",
    parent: "Magulang / Guardian",
    supervisor: "Supervisor",
    caseManager: "Case Manager",
    partner: "Partner",
    mission: "Mission Control",
    support: "Support Center",
    footer: `© ${year} Bronson Family Farm LLC at Farm & Family Alliance Inc. Developed by Bronson Family Farm. All rights reserved.`,
  },
  it: {
    title: "Ecosistema Digitale Bronson Family Farm",
    subtitle: "Coltiviamo Persone. Terra. Comunità.",
    enter: "Entra nell’Ecosistema",
    home: "Home",
    guest: "Ospite",
    customer: "Cliente",
    marketplace: "Mercato",
    grower: "Coltivatore",
    youth: "Forza Lavoro Giovanile",
    parent: "Genitore / Tutore",
    supervisor: "Supervisore",
    caseManager: "Case Manager",
    partner: "Partner",
    mission: "Centro di Controllo",
    support: "Centro di Supporto",
    footer: `© ${year} Bronson Family Farm LLC e Farm & Family Alliance Inc. Sviluppato da Bronson Family Farm. Tutti i diritti riservati.`,
  },
  he: {
    title: "המערכת הדיגיטלית של Bronson Family Farm",
    subtitle: "מטפחים אנשים. אדמה. קהילה.",
    enter: "כניסה למערכת",
    home: "בית",
    guest: "אורח",
    customer: "לקוח",
    marketplace: "שוק",
    grower: "מגדל",
    youth: "כוח עבודה לנוער",
    parent: "הורה / אפוטרופוס",
    supervisor: "מפקח",
    caseManager: "מנהל מקרה",
    partner: "שותף",
    mission: "מרכז בקרה",
    support: "מרכז תמיכה",
    footer: `© ${year} Bronson Family Farm LLC ו-Farm & Family Alliance Inc. פותח על ידי Bronson Family Farm. כל הזכויות שמורות.`,
  },
  fr: {
    title: "Écosystème Numérique Bronson Family Farm",
    subtitle: "Cultiver les personnes. La terre. La communauté.",
    enter: "Entrer dans l’écosystème",
    home: "Accueil",
    guest: "Invité",
    customer: "Client",
    marketplace: "Marché",
    grower: "Producteur",
    youth: "Jeunesse au Travail",
    parent: "Parent / Tuteur",
    supervisor: "Superviseur",
    caseManager: "Gestionnaire de Cas",
    partner: "Partenaire",
    mission: "Centre de Mission",
    support: "Centre de Soutien",
    footer: `© ${year} Bronson Family Farm LLC et Farm & Family Alliance Inc. Développé par Bronson Family Farm. Tous droits réservés.`,
  },
};

const roleOrder: Role[] = [
  "home",
  "guest",
  "customer",
  "marketplace",
  "grower",
  "youth",
  "parent",
  "supervisor",
  "caseManager",
  "partner",
  "mission",
];

const teamNames = [
  "Regenerative Agriculture",
  "Infrastructure",
  "Apiary & Pollination",
  "Culinary & Nutrition",
  "Guest Services & Tourism",
  "Media & Storytelling",
  "Safety / Security / Emergency Prep",
  "Program Management & Logistics",
];

const levelInfo: Record<SupportLevel, { title: string; lead: string; examples: string[] }> = {
  Green: {
    title: "Everyday Support",
    lead: "Supervisor leads",
    examples: ["Tired", "Needs encouragement", "Minor disagreement", "First-day nerves"],
  },
  Yellow: {
    title: "Additional Support Needed",
    lead: "Supervisor refers to Case Manager",
    examples: ["Repeated absences", "Transportation concern", "Family stress", "Social isolation"],
  },
  Orange: {
    title: "Significant Concern",
    lead: "Case Manager leads",
    examples: ["Possible depression", "Substance concern", "Escalating conflict", "Housing instability"],
  },
  Red: {
    title: "Emergency",
    lead: "Leadership + Case Manager lead immediately",
    examples: ["Self-harm statement", "Medical emergency", "Abuse disclosure", "Missing youth"],
  },
};

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [role, setRole] = useState<Role>("home");
  const [supportLevel, setSupportLevel] = useState<SupportLevel>("Green");
  const [youthMood, setYouthMood] = useState("Ready");
  const [parentNote, setParentNote] = useState("");
  const [supportRequest, setSupportRequest] = useState("");

  const t = labels[lang];

  const direction = lang === "he" ? "rtl" : "ltr";

  const missionMetrics = useMemo(
    () => ({
      scheduled: 50,
      checkedIn: 42,
      absent: 5,
      late: 3,
      ppeReady: 39,
      supportRequests: 4,
      yellow: 2,
      orange: 1,
      red: 0,
    }),
    []
  );

  return (
    <main dir={direction} className="min-h-screen bg-[#10281f] text-white font-sans">
      <div className="min-h-screen bg-gradient-to-br from-[#10281f] via-[#173d2d] to-[#2f5b3c]">
        <header className="sticky top-0 z-40 backdrop-blur bg-black/35 border-b border-white/15">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{t.title}</h1>
              <p className="text-sm text-amber-100">{t.subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="text-black rounded-lg px-3 py-2"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="tl">Tagalog</option>
                <option value="it">Italiano</option>
                <option value="he">עברית</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </header>

        <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-2">
          {roleOrder.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-2 rounded-full text-sm border transition ${
                role === r
                  ? "bg-amber-300 text-black border-amber-200"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              {t[r]}
            </button>
          ))}
        </nav>

        <section className="max-w-7xl mx-auto px-4 pb-10">
          {role === "home" && (
            <Panel title={t.title} subtitle={t.subtitle}>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <p className="text-lg leading-8">
                    The Bronson Family Farm ecosystem connects youth, parents, supervisors,
                    case managers, growers, customers, partners, and community supporters through
                    regenerative agriculture, workforce development, education, and agritourism.
                  </p>
                  <button
                    onClick={() => setRole("guest")}
                    className="mt-6 px-5 py-3 bg-amber-300 text-black rounded-xl font-semibold"
                  >
                    {t.enter}
                  </button>
                </div>
                <FeatureCard
                  title="Connected Food Ecosystem"
                  items={[
                    "Food moves, not the farmer.",
                    "Youth learn through real work.",
                    "Parents and guardians stay connected.",
                    "Supervisors coach and protect.",
                    "Case managers support whole-person needs.",
                    "Mission Control tracks safety, wellness, and operations.",
                  ]}
                />
              </div>
            </Panel>
          )}

          {role === "guest" && (
            <Panel title="Guest Pathway" subtitle="Experience the story, land, and purpose.">
              <Grid>
                <FeatureCard title="The Visit" items={["Forest Gate entry", "Farm story", "Airport history", "Regenerative agriculture", "Community transformation"]} />
                <FeatureCard title="What Guests Learn" items={["Why the farm exists", "How the ecosystem works", "How youth are developing", "How the marketplace supports sustainability"]} />
              </Grid>
            </Panel>
          )}

          {role === "customer" && (
            <Panel title="Customer Pathway" subtitle="Fresh food, nutrition, and repeat healthy choices.">
              <Grid>
                <FeatureCard title="Customer Experience" items={["Fresh produce", "Chemical-free growing practices", "Nutrition education", "Marketplace connection", "GrownBy purchasing pathway"]} />
                <FeatureCard title="Community Benefit" items={["Supports local food access", "Supports youth workforce", "Strengthens farm sustainability", "Keeps food dollars local"]} />
              </Grid>
            </Panel>
          )}

          {role === "marketplace" && (
            <Panel title="Marketplace" subtitle="Where interest becomes purchasing power.">
              <Grid>
                <FeatureCard title="Available Marketplace Functions" items={["Produce listings", "GrownBy connection", "SNAP-eligible items where applicable", "Value-added producer visibility", "Grower opportunity pathway"]} />
                <FeatureCard title="Marketplace Principle" items={["The marketplace helps the farm become sustainable while connecting community members to fresh food."]} />
              </Grid>
            </Panel>
          )}

          {role === "grower" && (
            <Panel title="Grower Pathway" subtitle="Connect producers to opportunity and market participation.">
              <Grid>
                <FeatureCard title="Grower Supports" items={["Market access", "Technical support", "Shared learning", "Value-added opportunities", "Community food ecosystem participation"]} />
                <FeatureCard title="Grower Teams" items={["Farmers", "Gardeners", "Value-added producers", "Food entrepreneurs", "Community growers"]} />
              </Grid>
            </Panel>
          )}

          {role === "youth" && (
            <Panel title="Youth Workforce Pathway" subtitle="Cultivators: skills, responsibility, confidence, and future readiness.">
              <Grid>
                <FeatureCard title="My Support Team" items={["Supervisor: daily coaching and safety", "Parent/Guardian: encouragement and communication", "Case Manager: support when barriers arise", "Program Leadership: resources and opportunity"]} />

                <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                  <h3 className="text-xl font-bold mb-3">Daily Youth Check-In</h3>
                  <label className="block mb-2 text-sm text-amber-100">How are you feeling today?</label>
                  <select value={youthMood} onChange={(e) => setYouthMood(e.target.value)} className="text-black rounded-lg px-3 py-2 w-full">
                    <option>Ready</option>
                    <option>Excited</option>
                    <option>Tired</option>
                    <option>Stressed</option>
                    <option>Worried</option>
                    <option>Need to Speak With Someone</option>
                  </select>
                  <p className="mt-4 text-sm">Current selection: <strong>{youthMood}</strong></p>
                </div>

                <FeatureCard title="Daily Reflection" items={["Today I am proud of something I learned.", "Today I helped someone.", "Today I improved a skill.", "Tomorrow I want to grow further."]} />
                <SupportCenter supportLevel={supportLevel} setSupportLevel={setSupportLevel} supportRequest={supportRequest} setSupportRequest={setSupportRequest} />
              </Grid>
            </Panel>
          )}

          {role === "parent" && (
            <Panel title="Parent / Guardian Portal" subtitle="Families are part of the youth support network.">
              <Grid>
                <FeatureCard title="What Your Child Is Learning" items={["Workforce readiness", "Teamwork", "Leadership", "Problem solving", "Communication", "Agriculture", "Environmental stewardship", "Responsibility"]} />
                <FeatureCard title="Understanding Teen Development" items={["The teen brain is still developing.", "Peer influence matters.", "Confidence grows through success.", "Youth need safety, belonging, competence, and purpose."]} />

                <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                  <h3 className="text-xl font-bold mb-3">Parent Strengths Note</h3>
                  <p className="text-sm mb-3 text-amber-100">
                    What is one strength you see in your child that you hope this program helps grow?
                  </p>
                  <textarea
                    value={parentNote}
                    onChange={(e) => setParentNote(e.target.value)}
                    className="w-full min-h-[110px] rounded-lg text-black p-3"
                    placeholder="Example: leadership, creativity, kindness, confidence, responsibility..."
                  />
                </div>

                <SupportCenter supportLevel={supportLevel} setSupportLevel={setSupportLevel} supportRequest={supportRequest} setSupportRequest={setSupportRequest} />
              </Grid>
            </Panel>
          )}

          {role === "supervisor" && (
            <Panel title="Supervisor Dashboard & Learning Center" subtitle="Supervisors are coaches, mentors, and safety guides.">
              <Grid>
                <FeatureCard title="Daily Supervisor Responsibilities" items={["Attendance", "PPE verification", "Team assignments", "Safety monitoring", "Skill coaching", "Observation notes", "End-of-day reflection"]} />
                <FeatureCard title="Teen Development" items={["Decision-making is still developing.", "Emotions may move faster than judgment.", "Behavior is communication.", "Youth need safety, belonging, competence, and purpose."]} />
                <FeatureCard title="Positive Youth Development" items={["Confidence", "Character", "Competence", "Connection", "Contribution"]} />
                <FeatureCard title="Trauma-Informed Supervision" items={["Use respectful redirection.", "Ask what support is needed.", "Avoid public embarrassment.", "Build trust through consistency."]} />
                <FeatureCard title="Mental Health Awareness" items={["Notice withdrawal.", "Notice hopeless statements.", "Notice sudden behavior changes.", "Escalate concerns beyond supervision."]} />
                <SupportCenter supportLevel={supportLevel} setSupportLevel={setSupportLevel} supportRequest={supportRequest} setSupportRequest={setSupportRequest} />
              </Grid>
            </Panel>
          )}

          {role === "caseManager" && (
            <Panel title="Case Manager Portal" subtitle="Case managers support barriers, wellness, family needs, and referrals.">
              <Grid>
                <FeatureCard title="Case Manager Role" items={["Barrier identification", "Resource coordination", "Wellness support", "Family support", "Crisis response", "Referral coordination"]} />
                <FeatureCard title="Support Request Sources" items={["Youth request", "Parent request", "Supervisor referral", "Mission Control alert", "Leadership concern"]} />
                <FeatureCard title="Follow-Up Tracker" items={["Open", "In progress", "Resolved", "Referral made", "Parent contacted", "Leadership notified"]} />
                <SupportLevelCard level={supportLevel} />
              </Grid>
            </Panel>
          )}

          {role === "partner" && (
            <Panel title="Partner Pathway" subtitle="Align resources, collaboration, and community benefit.">
              <Grid>
                <FeatureCard title="Partner Opportunities" items={["Youth workforce support", "Education", "Food access", "Workshops", "Sponsorship", "Equipment and supplies", "Career pathways"]} />
                <FeatureCard title="Community Outcomes" items={["Fresh food access", "Youth employment", "Family engagement", "Grower participation", "Neighborhood revitalization", "Workforce development"]} />
              </Grid>
            </Panel>
          )}

          {role === "mission" && (
            <Panel title="Mission Control Operations Center" subtitle="The farm’s operational command center.">
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Metric label="Scheduled" value={missionMetrics.scheduled} />
                <Metric label="Checked In" value={missionMetrics.checkedIn} />
                <Metric label="PPE Ready" value={missionMetrics.ppeReady} />
                <Metric label="Support Requests" value={missionMetrics.supportRequests} />
              </div>

              <Grid>
                <FeatureCard title="Daily Startup Sequence" items={["Youth check-in", "Wellness check", "PPE verification", "Team assignment", "Supervisor review", "Case manager follow-up"]} />
                <FeatureCard title="End-of-Day Sequence" items={["Youth reflection", "Supervisor assessment", "Case manager notes", "Parent update", "Leadership review"]} />
                <FeatureCard title="Need-to-Know Access" items={["Youth see only their information.", "Parents see only their child.", "Supervisors see assigned youth.", "Case managers see assigned support cases.", "Leadership sees program-wide information."]} />
                <SupportLevelCard level={supportLevel} />
              </Grid>

              <h3 className="text-2xl font-bold mt-8 mb-4">Team Command Board</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamNames.map((team, idx) => (
                  <div key={team} className="bg-white/10 rounded-xl p-4 border border-white/15">
                    <h4 className="font-bold text-amber-100">{team}</h4>
                    <p className="text-sm mt-2">Supervisor: Assigned</p>
                    <p className="text-sm">Youth Present: {5 + (idx % 4)}</p>
                    <p className="text-sm">Current Task: Daily field operation</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </section>

        <footer className="border-t border-white/15 bg-black/35">
          <div className="max-w-7xl mx-auto px-4 py-4 text-xs md:text-sm text-amber-100">
            {t.footer}
          </div>
        </footer>
      </div>
    </main>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="bg-black/25 border border-white/15 rounded-3xl p-5 md:p-8 shadow-2xl">
      <h2 className="text-3xl md:text-5xl font-extrabold mb-2">{title}</h2>
      {subtitle && <p className="text-lg md:text-xl text-amber-100 mb-6">{subtitle}</p>}
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-5">{children}</div>;
}

function FeatureCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
      <h3 className="text-xl font-bold mb-3 text-amber-100">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="leading-7">
            <span className="text-amber-200">•</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/10 rounded-2xl p-5 border border-white/15 text-center">
      <div className="text-4xl font-extrabold text-amber-200">{value}</div>
      <div className="text-sm uppercase tracking-wide">{label}</div>
    </div>
  );
}

function SupportCenter({
  supportLevel,
  setSupportLevel,
  supportRequest,
  setSupportRequest,
}: {
  supportLevel: SupportLevel;
  setSupportLevel: (level: SupportLevel) => void;
  supportRequest: string;
  setSupportRequest: (value: string) => void;
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
      <h3 className="text-xl font-bold mb-3 text-amber-100">Concern & Support Center</h3>
      <p className="text-sm mb-3">
        Use this area when a youth, parent, supervisor, or case manager needs help or wants to report a concern.
      </p>

      <label className="block mb-2 text-sm text-amber-100">Concern Level</label>
      <select value={supportLevel} onChange={(e) => setSupportLevel(e.target.value as SupportLevel)} className="text-black rounded-lg px-3 py-2 w-full mb-4">
        <option>Green</option>
        <option>Yellow</option>
        <option>Orange</option>
        <option>Red</option>
      </select>

      <textarea
        value={supportRequest}
        onChange={(e) => setSupportRequest(e.target.value)}
        className="w-full min-h-[110px] rounded-lg text-black p-3"
        placeholder="Describe the support need or concern..."
      />

      <SupportLevelCard level={supportLevel} />
    </div>
  );
}

function SupportLevelCard({ level }: { level: SupportLevel }) {
  const info = levelInfo[level];

  const color =
    level === "Green"
      ? "bg-green-900/50 border-green-300/40"
      : level === "Yellow"
      ? "bg-yellow-900/50 border-yellow-300/40"
      : level === "Orange"
      ? "bg-orange-900/50 border-orange-300/40"
      : "bg-red-900/50 border-red-300/40";

  return (
    <div className={`mt-4 rounded-xl p-4 border ${color}`}>
      <h4 className="font-bold">
        {level} Level — {info.title}
      </h4>
      <p className="text-sm mt-1">
        <strong>Lead:</strong> {info.lead}
      </p>
      <ul className="text-sm mt-2 space-y-1">
        {info.examples.map((example) => (
          <li key={example}>• {example}</li>
        ))}
      </ul>
    </div>
  );
}
