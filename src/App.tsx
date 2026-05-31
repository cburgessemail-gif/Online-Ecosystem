import React, { useEffect, useMemo, useState } from "react";

type EcosystemScreen =
  | "home"
  | "guest"
  | "customer"
  | "marketplace"
  | "grower"
  | "youth"
  | "partner"
  | "valueAdded"
  | "support"
  | "supervisor"
  | "missionControl";

type PathwayCard = {
  id: EcosystemScreen;
  eyebrow: string;
  title: string;
  invitation: string;
  purpose: string;
  bullets: string[];
  primaryLabel: string;
  secondaryLabel?: string;
  secondaryTarget?: EcosystemScreen;
  colors: string;
  icon: string;
  image: string;
};

const pathwayCards: PathwayCard[] = [
  {
    id: "guest",
    eyebrow: "Explore the Story",
    title: "Guest Experience",
    invitation: "Walk into the story of the land, the airport, and the vision.",
    purpose: "A welcoming pathway for visitors to understand Bronson Family Farm, the historic Lansdowne Airport setting, media coverage, and the larger regional ecosystem being formed.",
    bullets: ["Historic Lansdowne Airport context", "WKBN and Business Journal story layer", "Tours, guest visits, and first-time discovery"],
    primaryLabel: "Begin Exploration",
    secondaryLabel: "Support the Ecosystem",
    secondaryTarget: "support",
    colors: "from-emerald-900 via-sky-900 to-amber-800",
    icon: "🌲",
    image: "/SAM_0220.JPG",
  },
  {
    id: "customer",
    eyebrow: "Fresh Food & Healthy Choices",
    title: "Customer Pathway",
    invitation: "Find food, learn what is available, and connect to marketplace options.",
    purpose: "A pathway for families and community members seeking fresh produce, healthy choices, local food access, GrownBy purchasing, and ways to support regional growers.",
    bullets: ["Fresh produce and seasonal availability", "Nutrition and healthy food choices", "Connection to Marketplace and GrownBy"],
    primaryLabel: "Visit Marketplace",
    secondaryLabel: "Learn to Grow",
    secondaryTarget: "grower",
    colors: "from-red-700 via-amber-600 to-lime-700",
    icon: "🥗",
    image: "/SAM_0232.JPG",
  },
  {
    id: "marketplace",
    eyebrow: "Harvest, Sales & Food Movement",
    title: "Marketplace",
    invitation: "Connect products, growers, customers, and community food access.",
    purpose: "The marketplace connects Bronson Family Farm, partner growers, value-added products, SNAP-aware purchasing, and GrownBy so food can move through the community.",
    bullets: ["GrownBy connection", "SNAP-aware sales pathway", "Products from Bronson Family Farm and partners"],
    primaryLabel: "Open GrownBy",
    secondaryLabel: "Enter Grower Pathway",
    secondaryTarget: "grower",
    colors: "from-amber-700 via-orange-700 to-red-800",
    icon: "🛒",
    image: "/SAM_0241.JPG",
  },
  {
    id: "grower",
    eyebrow: "Regional Grower Network",
    title: "Grower Pathway",
    invitation: "Backyard, community garden, school garden, urban farm, or market farm — all growers belong.",
    purpose: "A practical pathway for growers of every size to register, describe their growing space, list crops, request resources, share resources, and connect to marketplace opportunities.",
    bullets: ["Growing space type instead of acres only", "Crop and inventory planning", "Resource exchange and market participation"],
    primaryLabel: "Start Grower Profile",
    secondaryLabel: "Go to Marketplace",
    secondaryTarget: "marketplace",
    colors: "from-stone-900 via-amber-900 to-lime-900",
    icon: "🌱",
    image: "/GrowArea.jpg",
  },
  {
    id: "youth",
    eyebrow: "Cultivators Youth Workforce",
    title: "Youth Workforce",
    invitation: "Start the day with purpose, safety, teamwork, and growth.",
    purpose: "The youth pathway should guide participants through daily rhythm, proverbs, check-in, wellness, team assignment, learning, reflection, and progress — not send youth into the supervisor dashboard.",
    bullets: ["Today’s proverb and reflection", "Morning check-in and safety readiness", "Team assignment, learning, and end-of-day reflection"],
    primaryLabel: "Start My Day",
    secondaryLabel: "View My Progress",
    secondaryTarget: "youth",
    colors: "from-blue-800 via-cyan-700 to-amber-600",
    icon: "🧑‍🌾",
    image: "/SAM_0313.JPG",
  },
  {
    id: "partner",
    eyebrow: "Resource & Collaboration Portal",
    title: "Partner Pathway",
    invitation: "Offer resources, request support, collaborate, and measure community impact.",
    purpose: "A professional pathway for schools, businesses, agencies, funders, nonprofits, faith communities, and volunteers to participate in the regional ecosystem.",
    bullets: ["Organization profile", "What we offer / what we need", "Collaboration opportunities and shared outcomes"],
    primaryLabel: "Enter Partner Portal",
    secondaryLabel: "Support the Ecosystem",
    secondaryTarget: "support",
    colors: "from-slate-900 via-teal-900 to-blue-900",
    icon: "🤝",
    image: "/SAM_0281.JPG",
  },
  {
    id: "valueAdded",
    eyebrow: "Innovation & Product Development",
    title: "Value-Added Producer",
    invitation: "Turn harvests, seeds, herbs, honey, and ideas into products.",
    purpose: "A pathway for product development, packaging, labeling, market readiness, and connecting value-added goods to the marketplace.",
    bullets: ["Product readiness", "Packaging, labeling, and pricing needs", "Marketplace connection"],
    primaryLabel: "Develop Product",
    secondaryLabel: "Go to Marketplace",
    secondaryTarget: "marketplace",
    colors: "from-purple-950 via-rose-900 to-amber-800",
    icon: "🏭",
    image: "/SAM_0275.JPG",
  },
  {
    id: "support",
    eyebrow: "Give, Volunteer, Mentor, Share",
    title: "Support the Ecosystem",
    invitation: "Support youth, growers, food access, infrastructure, education, and the regional ecosystem.",
    purpose: "A pathway for donors, volunteers, mentors, and in-kind contributors. This is where seeds, compost, equipment, professional services, volunteer time, and financial gifts are recognized as ecosystem support.",
    bullets: ["Donate or sponsor an outcome", "Volunteer, mentor, or teach", "Share resources such as seeds, compost, tools, and services"],
    primaryLabel: "Choose Support Type",
    secondaryLabel: "View Partner Pathway",
    secondaryTarget: "partner",
    colors: "from-rose-900 via-emerald-900 to-amber-700",
    icon: "💚",
    image: "/SAM_0257.JPG",
  },
  {
    id: "supervisor",
    eyebrow: "Staff Operations",
    title: "Supervisor Dashboard",
    invitation: "Support youth safely, privately, and responsibly.",
    purpose: "A staff-only workspace for attendance, PPE, wellness, safety, skills, private notes, parent-visible summaries, and incident follow-up.",
    bullets: ["Attendance and PPE", "Wellness and safety", "Parent-visible summaries and private staff notes"],
    primaryLabel: "Enter Supervisor Dashboard",
    secondaryLabel: "Mission Control",
    secondaryTarget: "missionControl",
    colors: "from-slate-800 via-slate-700 to-emerald-900",
    icon: "👨‍🏫",
    image: "/SAM_0300.JPG",
  },
  {
    id: "missionControl",
    eyebrow: "Leadership View",
    title: "Mission Control",
    invitation: "See the ecosystem pulse, launch priorities, feedback, and operations.",
    purpose: "A leadership workspace for daily launch awareness: people, growers, youth, partners, marketplace, support, recognition, and feedback priorities.",
    bullets: ["Launch dashboard", "Feedback command center", "Ecosystem operations and recognition"],
    primaryLabel: "Open Mission Control",
    secondaryLabel: "Return Home",
    secondaryTarget: "home",
    colors: "from-slate-950 via-blue-950 to-teal-900",
    icon: "📊",
    image: "/SAM_0220.JPG",
  },
];

const navItems: { id: EcosystemScreen; label: string }[] = [
  { id: "home", label: "Forest Gate" },
  { id: "guest", label: "Guest" },
  { id: "customer", label: "Customer" },
  { id: "marketplace", label: "Marketplace" },
  { id: "grower", label: "Grower" },
  { id: "youth", label: "Youth" },
  { id: "partner", label: "Partner" },
  { id: "valueAdded", label: "Value-Added" },
  { id: "support", label: "Support" },
  { id: "supervisor", label: "Supervisor" },
  { id: "missionControl", label: "Mission Control" },
];

function labelFor(screen: EcosystemScreen) {
  const found = pathwayCards.find((p) => p.id === screen);
  return found?.title || "Forest Gate";
}

function getCard(screen: EcosystemScreen) {
  return pathwayCards.find((p) => p.id === screen) || pathwayCards[0];
}

function EcosystemNav({ current, navigate }: { current: EcosystemScreen; navigate: (screen: EcosystemScreen) => void }) {
  return (
    <div className="sticky top-0 z-50 border-b border-stone-200/70 bg-stone-50/95 px-4 py-3 text-stone-950 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <button
          onClick={() => navigate("home")}
          className="w-fit rounded-full bg-stone-900 px-4 py-2 text-sm font-black text-amber-100 shadow hover:bg-stone-800"
        >
          🌲 Forest Gate
        </button>
        <div className="flex flex-wrap gap-2">
          {navItems.slice(1).map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                current === item.id
                  ? "border-amber-400 bg-amber-200 text-stone-950"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-amber-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<EcosystemScreen>("home");
  const [entered, setEntered] = useState(false);

  function navigate(next: EcosystemScreen) {
    setEntered(true);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (screen === "supervisor") {
    return <SupervisorDashboard current={screen} navigate={navigate} />;
  }

  return (
    <section className="min-h-screen bg-stone-950 text-white">
      {entered && <EcosystemNav current={screen} navigate={navigate} />}
      {screen === "home" ? <ForestGate navigate={navigate} /> : <PathwayPage screen={screen} navigate={navigate} />}
      {entered && <FeedbackPanel />}
    </section>
  );
}

function ForestGate({ navigate }: { navigate: (screen: EcosystemScreen) => void }) {
  return (
    <main
      className="min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(110deg, rgba(16,35,27,.94) 0%, rgba(16,35,27,.86) 45%, rgba(74,47,26,.72) 72%, rgba(17,24,39,.88) 100%), url('/GrowArea.jpg')",
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6">
        <header className="flex items-center justify-between gap-4 text-sm text-amber-100/90">
          <div className="font-black tracking-[0.25em]">BRONSON FAMILY FARM</div>
          <button onClick={() => navigate("missionControl")} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-bold hover:bg-white/15">
            Mission Control
          </button>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-amber-200/30 bg-amber-100/10 px-4 py-2 text-sm font-bold text-amber-100">
              Historic Lansdowne Airport • Youngstown, Ohio
            </p>
            <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Welcome to the Bronson Family Farm Ecosystem.
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-stone-100/90">
              A regional ecosystem connecting people, food, growers, youth workforce development, marketplace opportunities, supporters, and community partners.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setTimeout(() => navigate("guest"), 0)} className="rounded-full bg-amber-300 px-7 py-4 text-lg font-black text-stone-950 shadow-2xl hover:bg-amber-200">
                Enter Ecosystem
              </button>
              <button onClick={() => navigate("support")} className="rounded-full border border-white/25 bg-white/10 px-7 py-4 text-lg font-black text-white hover:bg-white/15">
                Support the Ecosystem
              </button>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/15 bg-stone-50/95 p-5 text-stone-950 shadow-2xl md:p-7">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-700">Choose Your Journey</p>
            <div className="mt-5 grid gap-3">
              <JourneyButton icon="👣" title="Explore" text="Story, place, media, and vision" onClick={() => navigate("guest")} />
              <JourneyButton icon="🥗" title="Access Food" text="Fresh food, marketplace, and healthy choices" onClick={() => navigate("customer")} />
              <JourneyButton icon="🌱" title="Grow Food" text="Backyard, community garden, school garden, urban farm, or market farm" onClick={() => navigate("grower")} />
              <JourneyButton icon="🧑‍🌾" title="Learn & Work" text="Youth Workforce daily rhythm, teams, and progress" onClick={() => navigate("youth")} />
              <JourneyButton icon="🤝" title="Collaborate" text="Partners, resources, volunteers, and shared outcomes" onClick={() => navigate("partner")} />
              <JourneyButton icon="💚" title="Support" text="Donate, volunteer, mentor, or share resources" onClick={() => navigate("support")} />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function JourneyButton({ icon, title, text, onClick }: { icon: string; title: string; text: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group rounded-3xl border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50">
      <div className="flex gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="text-lg font-black text-stone-950">{title}</h3>
          <p className="text-sm leading-5 text-stone-600">{text}</p>
        </div>
      </div>
    </button>
  );
}

function PathwayPage({ screen, navigate }: { screen: EcosystemScreen; navigate: (screen: EcosystemScreen) => void }) {
  const card = getCard(screen);
  const isMarketplace = screen === "marketplace";
  const isYouth = screen === "youth";
  const isGrower = screen === "grower";
  const isMission = screen === "missionControl";
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => setDetailOpen(false), [screen]);

  function handlePrimary() {
    if (screen === "customer") navigate("marketplace");
    else if (screen === "supervisor") navigate("supervisor");
    else if (screen === "missionControl") setDetailOpen(true);
    else setDetailOpen(true);
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br ${card.colors}`}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[1fr_.85fr]">
            <div className="p-6 md:p-10">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-100">{card.eyebrow}</p>
              <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-white/20 bg-black/20 shadow-xl">
                <img
                  src={card.image}
                  alt={`${card.title} visual`}
                  className="h-52 w-full object-cover md:h-64"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="mt-5 text-6xl">{card.icon}</div>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">{card.title}</h1>
              <p className="mt-5 max-w-3xl text-xl leading-8 text-white/90">{card.invitation}</p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">{card.purpose}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {isMarketplace ? (
                  <a href="https://grownby.com/farms/bronson-family-farm" target="_blank" rel="noreferrer" className="rounded-full bg-amber-300 px-6 py-3 font-black text-stone-950 shadow hover:bg-amber-200">
                    {card.primaryLabel}
                  </a>
                ) : (
                  <button onClick={handlePrimary} className="rounded-full bg-amber-300 px-6 py-3 font-black text-stone-950 shadow hover:bg-amber-200">
                    {card.primaryLabel}
                  </button>
                )}
                {card.secondaryTarget && (
                  <button onClick={() => navigate(card.secondaryTarget!)} className="rounded-full border border-white/25 bg-white/10 px-6 py-3 font-black text-white hover:bg-white/15">
                    {card.secondaryLabel || `Go to ${labelFor(card.secondaryTarget)}`}
                  </button>
                )}
                <button onClick={() => navigate("home")} className="rounded-full border border-white/25 bg-white/10 px-6 py-3 font-black text-white hover:bg-white/15">
                  Return to Forest Gate
                </button>
              </div>
            </div>

            <div className="bg-stone-50 p-5 text-stone-950 md:p-8">
              <h2 className="text-2xl font-black">What you can do here</h2>
              <div className="mt-5 grid gap-3">
                {card.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
                    <p className="font-bold">✓ {bullet}</p>
                  </div>
                ))}
              </div>

              {detailOpen && <PathwayDetail screen={screen} navigate={navigate} />}

              {isYouth && <YouthRhythm />}
              {isGrower && <GrowerPortalPreview />}
              {screen === "partner" && <PartnerPortalPreview />}
              {screen === "support" && <SupportPreview />}
              {isMission && <MissionPreview />}
              {isMarketplace && (
                <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-stone-800">
                  <b>Marketplace connection:</b> Reviewers can use this button to reach the Bronson Family Farm GrownBy marketplace while the full product catalog continues to mature.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


function PathwayDetail({ screen, navigate }: { screen: EcosystemScreen; navigate: (screen: EcosystemScreen) => void }) {
  const detail: Record<string, { title: string; text: string; steps: string[]; action?: string; target?: EcosystemScreen }> = {
    guest: {
      title: "Begin Exploration",
      text: "Start with the story of the land, the historic Lansdowne Airport setting, the media coverage, and the regional food ecosystem being formed.",
      steps: ["Learn why Bronson Family Farm exists", "Understand the airport-to-farm transformation", "See how growers, youth, partners, and customers connect"],
      action: "Continue to Customer Pathway",
      target: "customer",
    },
    grower: {
      title: "Start Grower Profile",
      text: "This pathway welcomes growers at every scale: backyard, containers, raised beds, community gardens, school gardens, church gardens, urban farms, greenhouses, homesteads, and market farms.",
      steps: ["Identify your growing space type", "List what you grow or want to grow", "Share what you need and what you can offer", "Connect to marketplace opportunities"],
      action: "Continue to Marketplace",
      target: "marketplace",
    },
    youth: {
      title: "Start My Day",
      text: "The youth pathway begins with daily rhythm, not a supervisor screen. Young people should see purpose, safety, team assignment, encouragement, and reflection.",
      steps: ["Today's proverb", "Morning check-in", "Safety and PPE readiness", "Team assignment", "End-of-day reflection"],
      action: "View Supervisor Support Layer",
      target: "supervisor",
    },
    partner: {
      title: "Enter Partner Portal",
      text: "Partners can identify how they want to collaborate, what they can offer, what they need, and how their organization can support the ecosystem.",
      steps: ["Create organization profile", "Offer volunteers, resources, training, or funding", "Request collaboration or community connection", "View shared impact"],
      action: "Support the Ecosystem",
      target: "support",
    },
    valueAdded: {
      title: "Develop Product",
      text: "This is the innovation space for turning harvests, seeds, herbs, honey, and ideas into value-added products and marketplace opportunities.",
      steps: ["Name the product", "Identify ingredients and supply needs", "Plan packaging, pricing, and readiness", "Connect to marketplace"],
      action: "Go to Marketplace",
      target: "marketplace",
    },
    support: {
      title: "Choose Support Type",
      text: "Support can be financial, volunteer-based, mentorship-based, or in-kind. Jubilee Gardens, Inc. is a seed steward example of in-kind support.",
      steps: ["Donate", "Volunteer", "Mentor", "Share seeds, compost, tools, services, or equipment"],
      action: "View Partner Pathway",
      target: "partner",
    },
    missionControl: {
      title: "Open Mission Control",
      text: "Mission Control is the leadership view for launch activity, reviewer feedback, people, resources, marketplace movement, recognition, and ecosystem operations.",
      steps: ["Track launch readiness", "Review feedback", "Monitor youth, growers, partners, and supporters", "Identify priorities"],
      action: "Return to Forest Gate",
      target: "home",
    },
  };

  const current = detail[screen] || detail.guest;

  return (
    <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-stone-900 shadow-sm">
      <h3 className="text-2xl font-black">{current.title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-700">{current.text}</p>
      <div className="mt-4 grid gap-2">
        {current.steps.map((step) => (
          <p key={step} className="rounded-2xl bg-white p-3 text-sm font-bold shadow-sm">✓ {step}</p>
        ))}
      </div>
      {current.action && current.target && (
        <button onClick={() => navigate(current.target!)} className="mt-4 rounded-full bg-stone-900 px-5 py-3 font-black text-amber-100 hover:bg-stone-800">
          {current.action}
        </button>
      )}
    </div>
  );
}

function YouthRhythm() {
  return (
    <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50 p-4">
      <h3 className="text-xl font-black">Today’s Youth Rhythm</h3>
      <p className="mt-2 text-sm text-stone-700"><b>Proverb:</b> Those who work their land will have abundant food.</p>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <p className="rounded-2xl bg-white p-3">Morning Check-In</p>
        <p className="rounded-2xl bg-white p-3">Safety & PPE</p>
        <p className="rounded-2xl bg-white p-3">Team Assignment</p>
        <p className="rounded-2xl bg-white p-3">End-of-Day Reflection</p>
      </div>
    </div>
  );
}

function GrowerPortalPreview() {
  return (
    <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4">
      <h3 className="text-xl font-black">Grower Profile Starts Here</h3>
      <p className="mt-2 text-sm text-stone-700">Not just acres. The ecosystem welcomes backyard gardens, raised beds, community gardens, school gardens, church gardens, urban lots, greenhouses, homesteads, and farms.</p>
    </div>
  );
}

function PartnerPortalPreview() {
  return (
    <div className="mt-5 rounded-3xl border border-teal-200 bg-teal-50 p-4">
      <h3 className="text-xl font-black">Resource & Collaboration Portal</h3>
      <p className="mt-2 text-sm text-stone-700">Partners identify what they can offer, what they need, and how they want to collaborate in the ecosystem.</p>
    </div>
  );
}

function SupportPreview() {
  return (
    <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4">
      <h3 className="text-xl font-black">Support Can Be Financial or In-Kind</h3>
      <p className="mt-2 text-sm text-stone-700">Jubilee Gardens, Inc. is an example of ecosystem support through abundant seed contributions over the past two years.</p>
    </div>
  );
}

function MissionPreview() {
  return (
    <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-100 p-4">
      <h3 className="text-xl font-black">Launch Dashboard</h3>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <p className="rounded-2xl bg-white p-3">Reviewer Feedback</p>
        <p className="rounded-2xl bg-white p-3">Youth Workforce</p>
        <p className="rounded-2xl bg-white p-3">Growers</p>
        <p className="rounded-2xl bg-white p-3">Partners & Supporters</p>
      </div>
    </div>
  );
}

function FeedbackPanel() {
  return (
    <div className="fixed bottom-4 right-4 z-50 hidden max-w-xs rounded-3xl border border-stone-200 bg-stone-50 p-4 text-stone-950 shadow-2xl md:block">
      <p className="font-black">Reviewer Feedback</p>
      <p className="mt-1 text-xs text-stone-600">What excited you? What confused you? What would you improve?</p>
    </div>
  );
}

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

function SupervisorDashboard({ current, navigate }: { current: EcosystemScreen; navigate: (screen: EcosystemScreen) => void }) {
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
      <EcosystemNav current={current} navigate={navigate} />
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
