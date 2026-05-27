import React, { useState } from "react";

/**
 * Bronson Family Farm Online Ecosystem
 * Fully updated operational ecosystem script.
 *
 * Intentional rules preserved:
 * - Portal first: emotional threshold, not explanation.
 * - Guest pathway is the demo.
 * - Ecosystem graphic appears in the explaining process, not first arrival.
 * - Supervisors are the protected staff layer with youth access.
 * - Every visible card has an action.
 * - Content is compressed to fit the first operational screen better.
 */

type Screen =
  | "portal"
  | "guest"
  | "account"
  | "roles"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "crop"
  | "marketplace"
  | "operations"
  | "encouragement"
  | "reports"
  | "partners";

type Role =
  | "Youth Workforce Participant"
  | "Parent / Guardian"
  | "Supervisor"
  | "Grower"
  | "Marketplace Customer"
  | "Volunteer"
  | "Partner"
  | "Administrator"
  | "Value-Added Producer";

type GuestStep = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  why: string;
  experience: string[];
  nextScreen?: Screen;
};

const IMG = {
  hero: "/images/large (18).jpg",
  heroAlt: "/images/large (2).jpg",
  youth1: "/images/large (16).jpg",
  youth2: "/images/large (15).jpg",
  youth3: "/images/large (12).jpg",
  marketplaceHero: "/images/large (11).jpg",
  ecosystem: "/images/ConnectFoodEcosystem_withimages.png",
  culinaryFlowers: "/images/culniary_edibleflowers.jpeg",
  culinaryFlowers2: "/images/culniary_edibleflowers2.jpeg",
  culinaryMushrooms: "/images/culniary_mushrooms.jpeg",
  growArea: "/images/GrowArea2.jpg",
  growAreaAlt: "/images/Grow Area.png",
  partners: "/images/Partners.png",
  compost: "/images/Compost_ElliottGarden.png",
  compost2: "/images/Compost_Elliott.png",
  fencing: "/images/Deer Fencing.png",
  volunteers: "/images/Fence_volunteers.png",
  queens: "/images/Queens Village.png",
  seeds: "/images/Seeds_Jubilee Gardens.png",
  csu: "/images/CSU_MParker.png",
  wkbn: "/images/WKBN Interview.png",
  sameera2: "/images/Samaeera2.jpg",
  sameera3: "/images/Sameera3.jpg",
  sameera4: "/images/Samerra4.jpg",
  sameera5: "/images/Samerra5.jpg",
};

const roles: Role[] = [
  "Youth Workforce Participant",
  "Parent / Guardian",
  "Supervisor",
  "Grower",
  "Marketplace Customer",
  "Volunteer",
  "Partner",
  "Administrator",
  "Value-Added Producer",
];

const dailyProverbs = [
  "A seed becomes a harvest when people protect the conditions around it.",
  "Leadership grows through responsibility.",
  "Measure progress daily, but grow people patiently.",
  "A living ecosystem returns value to the community.",
  "Food access begins with hands, soil, tools, water, and trust.",
  "Progress happens one action at a time.",
  "What is planted with care can feed more than one family.",
];

const positiveMessages = [
  "Your work matters because someone in this community needs what you are helping build.",
  "Every small action creates long-term growth.",
  "Healthy communities begin with connected systems.",
  "Today is another opportunity to build something meaningful.",
  "You are not just completing a task. You are helping build a place.",
  "Growth is visible when effort, reflection, and support move together.",
];

const ecosystemStatus = {
  activeTeams: 4,
  activeGrowZones: 7,
  weatherStatus: "62° / mostly cloudy",
  weatherNote: "Temps drop tomorrow",
  harvestWindow: "Tomatoes approaching",
  harvestNote: "Forecast open",
  summariesReady: 12,
};

const assessmentCategories = [
  "Attendance",
  "PPE",
  "Participation",
  "Teamwork",
  "Communication",
  "Leadership",
  "Task Completion",
  "Reflection",
];

const cropPlanItems = [
  "Seed Date",
  "Transplant",
  "Irrigation",
  "Compost",
  "Pest Watch",
  "Harvest",
  "Yield",
  "Marketplace",
];

const reportTypes = [
  "Youth Workforce",
  "Supervisor Daily",
  "Parent Summary",
  "Crop Planning",
  "Marketplace",
  "Inventory",
  "Community Impact",
  "Grant / Funder",
];

const guestSteps: GuestStep[] = [
  {
    id: "arrival",
    eyebrow: "Guest Journey / Demo",
    title: "Arrive first. Understand later.",
    subtitle:
      "The ecosystem begins with place, atmosphere, and invitation before it explains the full system.",
    image: IMG.hero,
    why:
      "The portal invites the person into a living farm environment before the system explains itself.",
    experience: [
      "Cross the threshold.",
      "Sense weather, people, and purpose.",
      "Explanation comes after arrival.",
    ],
  },
  {
    id: "why",
    eyebrow: "Why This Exists",
    title: "A farm ecosystem built for food, people, and community movement.",
    subtitle:
      "Bronson Family Farm connects land, youth workforce, growers, marketplace circulation, family support, and measurable community impact.",
    image: IMG.growArea,
    why:
      "The guest begins to understand this is more than a farm and more than software.",
    experience: [
      "Food access connects to production.",
      "Youth growth connects to work.",
      "Marketplace movement connects to crops.",
    ],
  },
  {
    id: "youth",
    eyebrow: "Youth Workforce",
    title: "Youth participate in real work.",
    subtitle:
      "Assignments, PPE, attendance, reflections, assessments, badges, and supervisor encouragement connect youth development to farm operations.",
    image: IMG.youth1,
    why:
      "The youth pathway is a protected workforce and life-skills pathway.",
    experience: [
      "Youth check in.",
      "Supervisors observe growth.",
      "Progress becomes visible.",
    ],
    nextScreen: "youth",
  },
  {
    id: "encouragement",
    eyebrow: "Human Sustainability",
    title: "Daily proverbs and positive messages belong here.",
    subtitle:
      "They create mindset, emotional grounding, reflection, and purpose before the work begins.",
    image: IMG.seeds,
    why:
      "The ecosystem supports human growth, emotional regulation, accountability, and encouragement.",
    experience: [
      "Proverb sets the tone.",
      "Message connects effort to purpose.",
      "Reflection turns activity into learning.",
    ],
    nextScreen: "encouragement",
  },
  {
    id: "assessment",
    eyebrow: "Assessment Engine",
    title: "Assessments are the heartbeat.",
    subtitle:
      "Attendance, PPE, teamwork, communication, leadership, reflection, and task completion feed badges, parent summaries, and reports.",
    image: IMG.fencing,
    why:
      "Assessments turn daily participation into measurable growth without labeling youth.",
    experience: [
      "Supervisor scores.",
      "Parent summaries stay appropriate.",
      "Reports grow from the same activity.",
    ],
    nextScreen: "supervisor",
  },
  {
    id: "crop",
    eyebrow: "Crop Planning",
    title: "Crop planning drives work.",
    subtitle:
      "Grow zones, irrigation, harvest forecasts, succession planting, pest monitoring, and youth assignments move together.",
    image: IMG.growAreaAlt,
    why:
      "Crop planning activates work, inventory, marketplace timing, and learning.",
    experience: [
      "Grow zone creates assignments.",
      "Harvest informs inventory.",
      "Crop activity becomes data.",
    ],
    nextScreen: "crop",
  },
  {
    id: "marketplace",
    eyebrow: "Marketplace Circulation",
    title: "Food moves through community.",
    subtitle:
      "Marketplace activity connects growers, SNAP visibility, inventory movement, nutrition, and local economic circulation.",
    image: IMG.marketplaceHero,
    why:
      "Marketplace shows the ecosystem becoming useful to families and community partners.",
    experience: [
      "Forecasts become availability.",
      "Inventory supports access.",
      "Reports show circulation.",
    ],
    nextScreen: "marketplace",
  },
  {
    id: "parent",
    eyebrow: "Parent / Guardian Connection",
    title: "Parents receive supportive visibility.",
    subtitle:
      "Parents see attendance, progress, badges, encouragement, approved reflections, and safety updates.",
    image: IMG.queens,
    why:
      "The parent pathway builds trust without exposing internal supervisor notes.",
    experience: [
      "Youth completes assignments.",
      "Supervisor approves summaries.",
      "Parent sees progress.",
    ],
    nextScreen: "parent",
  },
  {
    id: "operations",
    eyebrow: "Explaining The Whole System",
    title: "Now the connected food ecosystem can be explained.",
    subtitle:
      "This is where the system image belongs: after the guest understands why the parts matter.",
    image: IMG.ecosystem,
    why:
      "The infographic explains the entire system after the guest has moved through the experience.",
    experience: [
      "Youth, parents, growers, crops, marketplace, and reports connect.",
      "The ecosystem becomes measurable.",
      "Partners see how outcomes are created.",
    ],
    nextScreen: "operations",
  },
  {
    id: "reports",
    eyebrow: "Impact + Reporting",
    title: "At the end, the ecosystem generates reports.",
    subtitle:
      "Workforce, parent, crop, marketplace, inventory, partner, grant, and community impact reports are generated from real ecosystem activity.",
    image: IMG.partners,
    why:
      "Reporting proves that the ecosystem is operational, measurable, and funder-ready.",
    experience: [
      "Activity becomes documentation.",
      "Assessments become progress reports.",
      "Crop and marketplace movement become impact evidence.",
    ],
    nextScreen: "reports",
  },
];

const dailyIndex = (length: number) => new Date().getDate() % length;

function Shell({
  children,
  screen,
  setScreen,
  background = IMG.hero,
  compactNav = false,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  background?: string;
  compactNav?: boolean;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img src={background} alt="Bronson Family Farm" className="h-full w-full object-cover scale-[1.02]" />
      </div>
      <div className="fixed inset-0 bg-black/58" />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.38),rgba(0,0,0,.68)),radial-gradient(circle_at_top_left,rgba(255,255,255,.10),transparent_28%),radial-gradient(circle_at_bottom,rgba(16,185,129,.12),transparent_34%)]" />
      <main className="relative z-10 mx-auto max-w-[1500px] px-4 py-3 md:px-7">
        {!compactNav && <Navigation screen={screen} setScreen={setScreen} />}
        {children}
      </main>
    </div>
  );
}

function Navigation({
  screen,
  setScreen,
}: {
  screen: Screen;
  setScreen: (screen: Screen) => void;
}) {
  const nav: { label: string; screen: Screen }[] = [
    { label: "Portal", screen: "portal" },
    { label: "Guest Demo", screen: "guest" },
    { label: "Roles", screen: "roles" },
    { label: "Youth", screen: "youth" },
    { label: "Supervisor", screen: "supervisor" },
    { label: "Parent", screen: "parent" },
    { label: "Grower", screen: "grower" },
    { label: "Crop", screen: "crop" },
    { label: "Marketplace", screen: "marketplace" },
    { label: "Operations", screen: "operations" },
    { label: "Reports", screen: "reports" },
    { label: "Partners", screen: "partners" },
  ];

  return (
    <nav className="sticky top-2 z-40 mb-3 rounded-[1.4rem] border border-white/10 bg-black/52 p-2.5 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-2 min-w-[170px] px-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-100/70">Bronson Family Farm</div>
          <div className="text-base font-black leading-tight">Online Ecosystem</div>
        </div>
        {nav.map((item) => (
          <button
            key={item.screen}
            onClick={() => setScreen(item.screen)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl transition ${
              screen === item.screen
                ? "border-emerald-200 bg-emerald-300 text-black"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function PhotoCard({
  title,
  subtitle,
  image,
  height = "220px",
  onClick,
  label,
  cta,
}: {
  title: string;
  subtitle: string;
  image: string;
  height?: string;
  onClick?: () => void;
  label?: string;
  cta?: string;
}) {
  const card = (
    <div
      className={`group relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-black shadow-[0_24px_62px_rgba(0,0,0,.52)] transition duration-500 ${
        onClick ? "cursor-pointer hover:scale-[1.01] hover:border-emerald-200/40" : ""
      }`}
      style={{ height }}
    >
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/44 to-black/12" />
      {label && (
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl">
          {label}
        </div>
      )}
      {cta && (
        <div className="absolute right-4 top-4 rounded-full bg-emerald-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-black shadow-xl">
          {cta}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="text-xl font-black leading-tight drop-shadow-2xl md:text-2xl">{title}</div>
        <div className="mt-1.5 max-w-xl text-sm leading-5 text-emerald-50/90">{subtitle}</div>
      </div>
    </div>
  );

  return onClick ? (
    <button onClick={onClick} className="block w-full text-left">
      {card}
    </button>
  ) : (
    card
  );
}

function StatusBar() {
  return (
    <section className="mb-3 rounded-[1.4rem] border border-white/10 bg-black/35 p-2.5 backdrop-blur-xl">
      <div className="grid gap-2 md:grid-cols-4">
        <StatusTile label="Ecosystem" main={`${ecosystemStatus.activeTeams} Active Teams`} sub={`${ecosystemStatus.activeGrowZones} grow zones`} />
        <StatusTile label="Weather" main={ecosystemStatus.weatherStatus} sub={ecosystemStatus.weatherNote} />
        <StatusTile label="Harvest" main={ecosystemStatus.harvestWindow} sub={ecosystemStatus.harvestNote} />
        <StatusTile label="Reports" main={`${ecosystemStatus.summariesReady} summaries ready`} sub="Documentation active" />
      </div>
    </section>
  );
}

function StatusTile({ label, main, sub }: { label: string; main: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-2.5">
      <div className="text-[9px] uppercase tracking-[0.25em] text-emerald-100/70">{label}</div>
      <div className="mt-1 text-base font-black md:text-lg">{main}</div>
      <div className="mt-0.5 text-xs text-emerald-50/80">{sub}</div>
    </div>
  );
}

function Portal({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="portal" setScreen={setScreen} background={IMG.hero} compactNav>
      <div className="grid min-h-[calc(100vh-1.5rem)] items-center gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2.15rem] border border-white/10 bg-black/38 p-6 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl md:p-9">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/85">Bronson Family Farm</div>
          <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">Enter The Ecosystem.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/92 drop-shadow-2xl md:text-xl md:leading-9">
            Step through the farm first. The guest journey becomes the demo and explains the ecosystem as you move.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => setScreen("guest")} className="rounded-full bg-emerald-300 px-7 py-3.5 font-black text-black shadow-2xl transition hover:scale-105">
              Enter The Ecosystem
            </button>
            <button onClick={() => setScreen("account")} className="rounded-full border border-white/15 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
              Create Account
            </button>
            <button onClick={() => setScreen("guest")} className="rounded-full border border-white/15 bg-black/30 px-7 py-3.5 font-semibold text-white backdrop-blur-xl transition hover:bg-white/15">
              Continue As Guest
            </button>
          </div>
        </section>
        <button onClick={() => setScreen("guest")} className="block w-full rounded-[2.15rem] border border-white/10 bg-black/28 p-3 text-left shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl transition hover:scale-[1.01] hover:border-emerald-200/35">
          <PhotoCard
            title="The Farm Is Open"
            subtitle="This is the threshold. The explaining process begins after the guest enters."
            image={IMG.growArea}
            height="400px"
            label="Arrival"
            cta="Enter"
          />
        </button>
      </div>
    </Shell>
  );
}

function Account({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role>("Youth Workforce Participant");
  return (
    <Shell screen="account" setScreen={setScreen} background={IMG.hero} compactNav>
      <div className="grid min-h-[calc(100vh-1.5rem)] items-center gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[1.8rem] border border-white/10 bg-black/50 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-6">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">Create Your Ecosystem Account</div>
          <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-5xl">Choose how you want to participate.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/90 drop-shadow-xl">
            Start as a guest, then create a role-based account when you are ready to participate more deeply.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`rounded-2xl border px-4 py-2.5 text-left text-sm font-black shadow-xl backdrop-blur-xl transition ${
                  selectedRole === role ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => setScreen("guest")} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black shadow-2xl transition hover:scale-105">
              Continue Account Setup
            </button>
            <button onClick={() => setScreen("portal")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
              Back To Portal
            </button>
          </div>
        </section>
        <section className="rounded-[1.8rem] border border-white/10 bg-black/40 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/80">Account Purpose</div>
          <h2 className="mt-3 text-3xl font-black leading-tight">One account. One role. Clear next step.</h2>
          <p className="mt-3 text-base leading-7 text-white/88">
            This screen stays focused. The guest demo explains the whole ecosystem. Account creation helps a participant choose their protected role.
          </p>
          <div className="mt-4 grid gap-2">
            {[
              ["Selected Role", selectedRole],
              ["Guest First", "Explore without pressure before committing."],
              ["Protected Participation", "Only supervisors are approved staff with youth access."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-xl">
                <div className="text-base font-black">{title}</div>
                <div className="mt-1 text-sm leading-5 text-white/80">{text}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function GuestJourney({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = guestSteps[stepIndex];
  const lastStep = stepIndex === guestSteps.length - 1;

  return (
    <Shell screen="guest" setScreen={setScreen} background={step.image}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[1.8rem] border border-white/10 bg-black/50 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/80">{step.eyebrow}</div>
          <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-5xl">{step.title}</h1>
          <p className="mt-4 text-base leading-7 text-white/90 md:text-lg md:leading-8">{step.subtitle}</p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Why this is part of the ecosystem</div>
            <p className="mt-2 text-sm leading-6 text-white/85">{step.why}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setStepIndex((value) => Math.max(value - 1, 0))}
              disabled={stepIndex === 0}
              className="rounded-full border border-white/10 bg-white/10 px-5 py-2.5 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 disabled:opacity-35"
            >
              Back
            </button>
            {!lastStep ? (
              <button
                onClick={() => setStepIndex((value) => Math.min(value + 1, guestSteps.length - 1))}
                className="rounded-full bg-emerald-300 px-5 py-2.5 font-black text-black shadow-xl transition hover:scale-105"
              >
                Continue Journey
              </button>
            ) : (
              <button onClick={() => setScreen("roles")} className="rounded-full bg-emerald-300 px-5 py-2.5 font-black text-black shadow-xl transition hover:scale-105">
                Choose A Pathway
              </button>
            )}
            {step.nextScreen && (
              <button onClick={() => setScreen(step.nextScreen as Screen)} className="rounded-full border border-white/10 bg-white/10 px-5 py-2.5 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
                Open This Area
              </button>
            )}
          </div>
        </section>
        <section className="space-y-3">
          <PhotoCard title={step.title} subtitle={step.subtitle} image={step.image} height="330px" label={`Step ${stepIndex + 1} of ${guestSteps.length}`} cta="Active" />
          <div className="rounded-[1.8rem] border border-white/10 bg-black/46 p-4 backdrop-blur-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">What the guest experiences</div>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {step.experience.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm leading-5 text-white/85">{item}</div>
              ))}
            </div>
            <div className="mt-4 flex gap-1.5">
              {guestSteps.map((guestStep, index) => (
                <button
                  key={guestStep.id}
                  onClick={() => setStepIndex(index)}
                  className={`h-2 flex-1 rounded-full transition ${index === stepIndex ? "bg-emerald-300" : "bg-white/20 hover:bg-white/40"}`}
                  aria-label={`Go to ${guestStep.title}`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Roles({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const cards: { title: string; subtitle: string; image: string; screen: Screen }[] = [
    ["Guest Demo", "Experience the ecosystem explanation through movement.", IMG.hero, "guest"],
    ["Youth Workforce", "Energy, urgency, assignments, assessments, badges, and growth.", IMG.youth1, "youth"],
    ["Grower Field", "Crop planning, weather, soil, harvest, and stewardship.", IMG.growArea, "grower"],
    ["Parent Support", "Supportive visibility, attendance, badges, and progress.", IMG.queens, "parent"],
    ["Operations Room", "Teams, crops, alerts, marketplace, and reports.", IMG.ecosystem, "operations"],
    ["Marketplace", "Harvest, inventory, SNAP visibility, and circulation.", IMG.marketplaceHero, "marketplace"],
  ].map(([title, subtitle, image, screen]) => ({ title, subtitle, image, screen: screen as Screen }));

  return (
    <Shell screen="roles" setScreen={setScreen} background={IMG.hero}>
      <StatusBar />
      <section className="mb-3 rounded-[1.5rem] border border-white/10 bg-black/42 p-4 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Living Crossroads</div>
        <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">Choose how you want to move through the ecosystem.</h1>
        <p className="mt-2 text-sm leading-6 text-emerald-50/90">The guest pathway is the demo. The role pathways become deeper participation.</p>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {cards.map((card) => (
          <PhotoCard key={card.title} {...card} height="190px" onClick={() => setScreen(card.screen)} label="Pathway" cta="Open" />
        ))}
      </section>
    </Shell>
  );
}

function Home({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const proverb = dailyProverbs[dailyIndex(dailyProverbs.length)];
  const positive = positiveMessages[dailyIndex(positiveMessages.length)];
  return (
    <Shell screen="portal" setScreen={setScreen} background={IMG.hero}>
      <StatusBar />
      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <PhotoCard title="Step Into The Farm" subtitle="The ecosystem is alive through weather, youth workforce, crop planning, marketplace movement, family support, and measurable community impact." image={IMG.hero} height="380px" label="Arrival" cta="Enter" onClick={() => setScreen("guest")} />
        <div className="grid gap-3">
          <PhotoCard title="Daily Proverb" subtitle={proverb} image={IMG.seeds} height="182px" label="Morning Focus" cta="Open" onClick={() => setScreen("encouragement")} />
          <PhotoCard title="Positive Message" subtitle={positive} image={IMG.compost} height="182px" label="Encouragement" cta="Open" onClick={() => setScreen("encouragement")} />
        </div>
      </div>
    </Shell>
  );
}

function Youth({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="youth" setScreen={setScreen} background={IMG.youth1}>
      <StatusBar />
      <div className="grid gap-3 lg:grid-cols-2">
        <PhotoCard title="Youth Workforce Pathway" subtitle="Daily assignments, PPE, teamwork, assessments, reflections, and badges connect participation to growth." image={IMG.youth1} height="330px" label="Energy + Urgency" cta="Daily Flow" onClick={() => setScreen("supervisor")} />
        <section className="rounded-[1.8rem] border border-orange-300/20 bg-orange-950/30 p-5 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.28em] text-orange-100/75">Today’s Youth Rhythm</div>
          <h2 className="mt-3 text-3xl font-black">From check-in to reflection.</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {[
              ["QR Check-In", "supervisor"],
              ["PPE Verification", "supervisor"],
              ["Station Assignment", "crop"],
              ["Crop Zone Work", "crop"],
              ["Supervisor Observation", "supervisor"],
              ["Daily Score", "supervisor"],
              ["Youth Reflection", "encouragement"],
              ["Badge Progress", "parent"],
            ].map(([item, target]) => (
              <button key={item} onClick={() => setScreen(target as Screen)} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left font-black transition hover:bg-emerald-300 hover:text-black">{item}</button>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Supervisor({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="supervisor" setScreen={setScreen} background={IMG.fencing}>
      <StatusBar />
      <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
        <PhotoCard title="Protected Supervisor Operations" subtitle="Supervisors are the approved staff layer with youth access. They manage attendance, PPE, assessments, incidents, support flags, and encouragement." image={IMG.fencing} height="330px" label="Approved Staff" cta="Assess" onClick={() => setScreen("reports")} />
        <section className="rounded-[1.8rem] border border-cyan-300/20 bg-cyan-950/25 p-5 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">Assessment Engine</h2>
          <p className="mt-2 text-sm leading-6 text-white/85">Scores feed badges, parent summaries, reporting, and workforce growth.</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {assessmentCategories.map((item) => (
              <button key={item} onClick={() => setScreen("reports")} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left text-sm font-black transition hover:bg-emerald-300 hover:text-black">{item}</button>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function ParentPortal({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="parent" setScreen={setScreen} background={IMG.queens}>
      <StatusBar />
      <div className="grid gap-3 lg:grid-cols-2">
        <PhotoCard title="Parent / Guardian Portal" subtitle="Families see progress, attendance, badges, encouragement, approved reflections, and safety notices." image={IMG.queens} height="330px" label="Support + Reassurance" cta="Progress" onClick={() => setScreen("reports")} />
        <section className="rounded-[1.8rem] border border-sky-300/20 bg-sky-950/25 p-5 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">What parents see</h2>
          <div className="mt-4 space-y-2 text-sm leading-6 text-white/88">
            {[
              ["Youth completes assignment → supervisor scores → parent-safe summary updates.", "supervisor"],
              ["Internal supervisor notes stay protected. Parents see encouragement and approved visibility.", "encouragement"],
              ["Attendance, PPE, reflection, and badge progress become a supportive growth story.", "reports"],
            ].map(([item, target]) => (
              <button key={item} onClick={() => setScreen(target as Screen)} className="block w-full rounded-2xl border border-white/10 bg-white/10 p-3 text-left transition hover:bg-emerald-300 hover:text-black">{item}</button>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Grower({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="grower" setScreen={setScreen} background={IMG.growArea}>
      <StatusBar />
      <div className="grid gap-3 lg:grid-cols-2">
        <PhotoCard title="Grower Field Experience" subtitle="A field-centered pathway with weather, crops, soil, irrigation, pests, compost, stewardship, and harvest planning." image={IMG.growArea} height="330px" label="Field + Stewardship" cta="Plan" onClick={() => setScreen("crop")} />
        <PhotoCard title="Value-Added Agriculture" subtitle="Edible flowers, mushrooms, culinary education, preservation, nutrition, and wellness connect growing to value." image={IMG.culinaryFlowers} height="330px" label="Culinary Layer" cta="Market" onClick={() => setScreen("marketplace")} />
      </div>
    </Shell>
  );
}

function CropPlanning({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="crop" setScreen={setScreen} background={IMG.growAreaAlt}>
      <StatusBar />
      <div className="space-y-3">
        <PhotoCard title="Crop Planning Engine" subtitle="Crop planning drives youth assignments, irrigation, harvest timing, marketplace inventory, grower reporting, and impact documentation." image={IMG.growAreaAlt} height="280px" label="Agricultural Engine" cta="Assign" onClick={() => setScreen("youth")} />
        <div className="grid gap-2 md:grid-cols-4">
          {cropPlanItems.map((item) => (
            <button key={item} onClick={() => setScreen(item === "Marketplace" ? "marketplace" : "operations")} className="rounded-2xl border border-white/10 bg-emerald-950/25 p-4 text-left backdrop-blur-xl transition hover:bg-emerald-300 hover:text-black">
              <div className="text-lg font-black">{item}</div>
              <div className="mt-1 text-sm leading-5 opacity-85">Connected to assignments, operations, inventory, and reporting.</div>
            </button>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function Marketplace({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="marketplace" setScreen={setScreen} background={IMG.marketplaceHero}>
      <StatusBar />
      <div className="grid gap-3 lg:grid-cols-2">
        <PhotoCard title="Marketplace Circulation" subtitle="Harvest, inventory, growers, SNAP visibility, customer access, and nutrition move through the ecosystem." image={IMG.marketplaceHero} height="330px" label="Circulation + Abundance" cta="Reports" onClick={() => setScreen("reports")} />
        <section className="rounded-[1.8rem] border border-amber-300/20 bg-amber-950/25 p-5 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">Harvest To Community</h2>
          <div className="mt-4 grid gap-2">
            {[
              ["Crop forecast creates expected inventory.", "crop"],
              ["Harvest updates marketplace availability.", "operations"],
              ["Marketplace movement becomes food access reporting.", "reports"],
              ["Youth workforce can support wash, pack, prep, and market learning.", "youth"],
            ].map(([item, target]) => (
              <button key={item} onClick={() => setScreen(target as Screen)} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left text-sm leading-6 transition hover:bg-emerald-300 hover:text-black">{item}</button>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Operations({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="operations" setScreen={setScreen} background={IMG.ecosystem}>
      <StatusBar />
      <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
        <PhotoCard title="Connected Food Ecosystem Overview" subtitle="This is where the system explains how youth, parents, growers, crop planning, marketplace circulation, assessments, operations, and reports move together." image={IMG.ecosystem} height="390px" label="Explaining Process" cta="Reports" onClick={() => setScreen("reports")} />
        <section className="rounded-[1.8rem] border border-cyan-300/20 bg-cyan-950/25 p-5 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">Living Control Room</h2>
          <p className="mt-2 text-sm leading-6 text-white/85">The coordination layer that shows the farm is alive today.</p>
          <div className="mt-4 grid gap-2">
            {[
              [`Active teams: ${ecosystemStatus.activeTeams}`, "youth"],
              ["Supervisors are approved staff with youth access", "supervisor"],
              [ecosystemStatus.weatherStatus, "crop"],
              [ecosystemStatus.harvestWindow, "marketplace"],
              ["Marketplace inventory connected to crop planning", "marketplace"],
              ["Reflections connect to encouragement and reports", "encouragement"],
            ].map(([item, target]) => (
              <button key={item} onClick={() => setScreen(target as Screen)} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left font-black transition hover:bg-emerald-300 hover:text-black">{item}</button>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Encouragement({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const proverb = dailyProverbs[dailyIndex(dailyProverbs.length)];
  const positive = positiveMessages[dailyIndex(positiveMessages.length)];
  return (
    <Shell screen="encouragement" setScreen={setScreen} background={IMG.seeds}>
      <StatusBar />
      <div className="grid gap-3 lg:grid-cols-3">
        <PhotoCard title="Daily Proverb" subtitle={proverb} image={IMG.seeds} label="Morning Focus" cta="Score" onClick={() => setScreen("supervisor")} />
        <PhotoCard title="Positive Message" subtitle={positive} image={IMG.compost} label="Encouragement" cta="Parent" onClick={() => setScreen("parent")} />
        <section className="rounded-[1.8rem] border border-white/10 bg-black/42 p-5 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">Why this belongs</h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            Encouragement is part of the ecosystem because this model measures human growth, not just labor.
          </p>
          <button onClick={() => setScreen("supervisor")} className="mt-4 rounded-full bg-emerald-300 px-6 py-3 font-black text-black">Connect To Daily Score</button>
        </section>
      </div>
    </Shell>
  );
}

function Reports({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="reports" setScreen={setScreen} background={IMG.partners}>
      <StatusBar />
      <div className="space-y-3">
        <PhotoCard title="Reporting + Impact Center" subtitle="The ecosystem generates workforce, parent, crop, marketplace, inventory, partner, grant, and community impact reports." image={IMG.partners} height="280px" label="Measured Outcomes" cta="Export" onClick={() => setScreen("operations")} />
        <div className="grid gap-2 md:grid-cols-4">
          {reportTypes.map((item) => (
            <button key={item} onClick={() => setScreen("operations")} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left backdrop-blur-xl transition hover:bg-emerald-300 hover:text-black">
              <div className="text-lg font-black">{item}</div>
              <div className="mt-1 text-sm leading-5 opacity-85">PDF / Excel / operational summary from ecosystem activity.</div>
            </button>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function Partners({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="partners" setScreen={setScreen} background={IMG.partners}>
      <StatusBar />
      <div className="grid gap-3 lg:grid-cols-2">
        <PhotoCard title="Partner Ecosystem" subtitle="Partners support education, sponsorship, materials, workforce, food access, and community engagement." image={IMG.partners} height="330px" label="Community Infrastructure" cta="Impact" onClick={() => setScreen("reports")} />
        <PhotoCard title="Seeds, Compost, People, and Place" subtitle="Shared resources make the ecosystem real." image={IMG.seeds} height="330px" label="Shared Resources" cta="Operations" onClick={() => setScreen("operations")} />
      </div>
    </Shell>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("portal");

  if (screen === "portal") return <Portal setScreen={setScreen} />;
  if (screen === "account") return <Account setScreen={setScreen} />;
  if (screen === "guest") return <GuestJourney setScreen={setScreen} />;
  if (screen === "roles") return <Roles setScreen={setScreen} />;
  if (screen === "youth") return <Youth setScreen={setScreen} />;
  if (screen === "supervisor") return <Supervisor setScreen={setScreen} />;
  if (screen === "parent") return <ParentPortal setScreen={setScreen} />;
  if (screen === "grower") return <Grower setScreen={setScreen} />;
  if (screen === "crop") return <CropPlanning setScreen={setScreen} />;
  if (screen === "marketplace") return <Marketplace setScreen={setScreen} />;
  if (screen === "operations") return <Operations setScreen={setScreen} />;
  if (screen === "encouragement") return <Encouragement setScreen={setScreen} />;
  if (screen === "reports") return <Reports setScreen={setScreen} />;
  if (screen === "partners") return <Partners setScreen={setScreen} />;

  return <Portal setScreen={setScreen} />;
}
