const translations = {
  English: {
    beginJourney: "Begin Journey",
    continueJourney: "Continue Journey",
    completed: "Pathway Completed",
    nextStep: "Choose Your Next Step",
    becomeGrower: "Become A Grower",
    joinWorkforce: "Join Youth Workforce",
    volunteer: "Volunteer",
    sponsor: "Sponsor",
    marketplace: "Visit Marketplace",
    feedback: "Share Feedback",
    guestTitle: "Guest Pathway",
    growerTitle: "Grower Pathway",
    youthTitle: "Youth Workforce Pathway",
    marketplaceTitle: "Marketplace Pathway",
    partnerTitle: "Partner Ecosystem",
    parentTitle: "Parent & Guardian Pathway",
  },

  Español: {
    beginJourney: "Comenzar Camino",
    continueJourney: "Continuar Camino",
    completed: "Ruta Completada",
    nextStep: "Elige Tu Próximo Paso",
    becomeGrower: "Convertirse en Productor",
    joinWorkforce: "Unirse al Programa Juvenil",
    volunteer: "Voluntario",
    sponsor: "Patrocinar",
    marketplace: "Visitar Mercado",
    feedback: "Compartir Opinión",
    guestTitle: "Ruta del Invitado",
    growerTitle: "Ruta del Productor",
    youthTitle: "Ruta Juvenil",
    marketplaceTitle: "Ruta del Mercado",
    partnerTitle: "Ecosistema de Socios",
    parentTitle: "Ruta de Padres y Tutores",
  },
};

type JourneyStage =
  | "entry"
  | "experience"
  | "decision"
  | "action"
  | "complete";

type Pathway =
  | "guest"
  | "grower"
  | "youth"
  | "marketplace"
  | "partner"
  | "parent";

const pathwayData = {
  guest: {
    entry:
      "Step onto the farm and experience a living food ecosystem built around community, health, education, and opportunity.",

    experience: [
      "Explore the farm environment",
      "Learn the ecosystem vision",
      "Discover growers and food systems",
      "Experience marketplace connections",
      "Understand community impact",
    ],

    decisions: [
      "Become Volunteer",
      "Become Grower",
      "Visit Marketplace",
      "Support Youth Workforce",
    ],
  },

  grower: {
    entry:
      "Learn how growers connect to land, infrastructure, training, tools, and distribution systems.",

    experience: [
      "View growing systems",
      "Explore compost and fencing infrastructure",
      "Understand distribution pathways",
      "Connect to Growers Supply Market",
      "Access educational resources",
    ],

    decisions: [
      "Join Growers Supply Market",
      "Become Ecosystem Grower",
      "Connect to Marketplace",
      "Attend Training",
    ],
  },

  youth: {
    entry:
      "Youth move through a structured workforce experience centered around responsibility, leadership, and participation.",

    experience: [
      "Digital Orientation",
      "PPE Verification",
      "Supervisor Assignment",
      "Daily Attendance",
      "Skills Tracking",
      "Leadership Milestones",
      "Parent/Guardian Connection",
      "Reflection & Growth",
    ],

    decisions: [
      "Continue Workforce Path",
      "Become Team Leader",
      "Enter Grower Ecosystem",
      "Join Culinary Pathway",
    ],
  },

  marketplace: {
    entry:
      "The marketplace moves food, seedlings, education, demonstrations, and participation into the community.",

    experience: [
      "Browse seedlings and produce",
      "View SNAP-supported access",
      "Explore culinary demonstrations",
      "Connect with growers",
      "Participate in community distribution",
    ],

    decisions: [
      "Purchase Produce",
      "Preorder Seedlings",
      "Become Vendor",
      "Join Ecosystem",
    ],
  },

  partner: {
    entry:
      "Partnerships expand the ecosystem through education, infrastructure, workforce, wellness, and collaboration.",

    experience: [
      "Universities and schools",
      "Community wellness",
      "Compost and infrastructure",
      "Media and outreach",
      "Youth workforce support",
    ],

    decisions: [
      "Sponsor Ecosystem",
      "Develop Program",
      "Provide Resources",
      "Become Long-Term Partner",
    ],
  },

  parent: {
    entry:
      "Parents and guardians stay connected to youth progress, workforce participation, and growth.",

    experience: [
      "Monitor attendance",
      "Track milestones",
      "View supervisor feedback",
      "Support youth growth",
      "Participate in family ecosystem",
    ],

    decisions: [
      "Support Continuation",
      "Volunteer",
      "Join Ecosystem",
      "Attend Events",
    ],
  },
};

const [activePathway, setActivePathway] =
  useState<Pathway>("guest");

const [journeyStage, setJourneyStage] =
  useState<JourneyStage>("entry");

const [completedJourneys, setCompletedJourneys] =
  useState<string[]>([]);

const t = translations[language as keyof typeof translations];

function advanceJourney() {
  if (journeyStage === "entry") {
    setJourneyStage("experience");
    return;
  }

  if (journeyStage === "experience") {
    setJourneyStage("decision");
    return;
  }

  if (journeyStage === "decision") {
    setJourneyStage("action");
    return;
  }

  if (journeyStage === "action") {
    setJourneyStage("complete");

    if (!completedJourneys.includes(activePathway)) {
      setCompletedJourneys([
        ...completedJourneys,
        activePathway,
      ]);
    }
  }
}

const active = pathwayData[activePathway];

<div className="rounded-[2rem] border border-white/10 bg-black/35 p-8 backdrop-blur-md">
  <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">
    Ecosystem Journey
  </div>

  <h2 className="mt-4 text-5xl font-black leading-tight">
    {
      t[
        `${activePathway}Title` as keyof typeof t
      ] as string
    }
  </h2>

  {journeyStage === "entry" && (
    <div className="mt-8 text-xl leading-10 text-emerald-50/90">
      {active.entry}
    </div>
  )}

  {journeyStage === "experience" && (
    <div className="mt-8 grid gap-4">
      {active.experience.map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-white/10 bg-white/10 p-5 text-lg backdrop-blur-md"
        >
          {item}
        </div>
      ))}
    </div>
  )}

  {journeyStage === "decision" && (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {active.decisions.map((item) => (
        <button
          key={item}
          className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-6 text-left text-lg font-semibold transition hover:scale-[1.02] hover:bg-emerald-300/20"
        >
          {item}
        </button>
      ))}
    </div>
  )}

  {journeyStage === "action" && (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <button className="rounded-full bg-emerald-300 px-6 py-4 font-black text-black">
        {t.becomeGrower}
      </button>

      <button className="rounded-full border border-white/10 bg-white/10 px-6 py-4">
        {t.joinWorkforce}
      </button>

      <button className="rounded-full border border-white/10 bg-white/10 px-6 py-4">
        {t.marketplace}
      </button>

      <button className="rounded-full border border-white/10 bg-white/10 px-6 py-4">
        {t.feedback}
      </button>
    </div>
  )}

  {journeyStage === "complete" && (
    <div className="mt-8 rounded-[2rem] border border-emerald-300/30 bg-emerald-300/10 p-8">
      <div className="text-4xl font-black">
        {t.completed}
      </div>

      <div className="mt-4 text-lg leading-8 text-emerald-50/90">
        This participant has now moved deeper into the ecosystem experience.
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          onClick={() => {
            setJourneyStage("entry");
            setActivePathway("grower");
          }}
          className="rounded-full bg-white px-6 py-3 font-black text-black"
        >
          Continue Into Grower Ecosystem
        </button>

        <button
          onClick={() => {
            setJourneyStage("entry");
            setActivePathway("marketplace");
          }}
          className="rounded-full border border-white/10 bg-white/10 px-6 py-3"
        >
          Continue Into Marketplace
        </button>
      </div>
    </div>
  )}

  <div className="mt-10 flex flex-wrap gap-4">
    <button
      onClick={advanceJourney}
      className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black shadow-2xl transition hover:scale-105"
    >
      {journeyStage === "entry"
        ? t.beginJourney
        : t.continueJourney}
    </button>

    <button
      onClick={() => {
        setJourneyStage("entry");
      }}
      className="rounded-full border border-white/10 bg-white/10 px-7 py-4"
    >
      Restart Journey
    </button>
  </div>
</div>
