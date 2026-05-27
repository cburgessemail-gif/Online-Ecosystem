import React, { useState } from "react";

type Screen =
  | "portal"
  | "guest"
  | "account"
  | "roles"
  | "home"
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
  weatherStatus: "Youngstown field conditions monitored today",
  harvestWindow: "Greens and tomatoes approaching next harvest review",
  marketplaceStatus: "Inventory movement connected to crop planning",
  reflectionsSubmitted: 18,
  supervisorsActive: 5,
  parentSummariesReady: 12,
};

const activeAssignments = [
  "Tomato irrigation support",
  "Compost distribution",
  "Marketplace wash station",
  "Pollinator zone cleanup",
  "Raised bed maintenance",
  "Seed preparation",
];

const assessmentCategories = [
  "Attendance",
  "PPE Compliance",
  "Participation",
  "Teamwork",
  "Communication",
  "Leadership",
  "Task Completion",
  "Problem Solving",
  "Emotional Regulation",
  "Reflection Completion",
];

const cropPlanItems = [
  "Seed Date",
  "Transplant Date",
  "Irrigation Schedule",
  "Compost Need",
  "Pest Watch",
  "Harvest Window",
  "Yield Projection",
  "Marketplace Forecast",
];

const reportTypes = [
  "Youth Workforce Report",
  "Supervisor Daily Report",
  "Parent Summary",
  "Crop Planning Report",
  "Marketplace Report",
  "Inventory Export",
  "Community Impact Report",
  "Grant / Funder Report",
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
      "The first job of the portal is not to explain the whole model. It is to help the person feel they have entered a living farm environment.",
    experience: [
      "The guest crosses the threshold into the farm experience.",
      "The system reveals movement, weather, people, and purpose gradually.",
      "The connected food system image is intentionally held back until the explaining process.",
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
      "The guest begins to understand that this is more than a farm and more than software. It is a living operating model.",
    experience: [
      "Food access is connected to local production.",
      "Youth participation is connected to work readiness and personal growth.",
      "Marketplace movement is connected to crop planning and community nutrition.",
    ],
  },
  {
    id: "youth",
    eyebrow: "Youth Workforce",
    title: "Youth do not just visit the farm. They participate in the work.",
    subtitle:
      "Assignments, PPE, attendance, reflections, assessments, badges, and supervisor encouragement connect youth development to real farm operations.",
    image: IMG.youth1,
    why:
      "The youth pathway is a workforce and life-skills pathway, not a decorative activity.",
    experience: [
      "Youth check in and receive daily assignments.",
      "Supervisors observe participation, safety, teamwork, and growth.",
      "Progress becomes visible through badges, reflection, and reports.",
    ],
    nextScreen: "youth",
  },
  {
    id: "encouragement",
    eyebrow: "Human Sustainability",
    title: "Daily proverbs and positive messages are part of the operating system.",
    subtitle:
      "They create mindset, emotional grounding, reflection, and purpose before the work begins.",
    image: IMG.seeds,
    why:
      "The ecosystem is not only measuring labor. It is supporting human growth, emotional regulation, accountability, and encouragement.",
    experience: [
      "The proverb sets the tone for the day.",
      "The positive message connects effort to purpose.",
      "Youth reflection turns activity into learning.",
    ],
    nextScreen: "encouragement",
  },
  {
    id: "assessment",
    eyebrow: "Assessment Engine",
    title: "Assessments are the heartbeat of the youth workforce system.",
    subtitle:
      "Attendance, PPE, teamwork, communication, leadership, reflection, and task completion feed badges, parent summaries, and reports.",
    image: IMG.fencing,
    why:
      "The assessment layer turns daily participation into measurable growth without reducing youth to labels.",
    experience: [
      "Supervisor observes and scores participation.",
      "Parent-visible summaries are separated from internal notes.",
      "Reports generate from the same data used to support youth growth.",
    ],
    nextScreen: "supervisor",
  },
  {
    id: "crop",
    eyebrow: "Crop Planning",
    title: "Crop planning drives assignments, inventory, marketplace flow, and reports.",
    subtitle:
      "Grow zones, irrigation, harvest forecasts, succession planting, pest monitoring, and youth assignments move together.",
    image: IMG.growAreaAlt,
    why:
      "The crop planner is not an isolated tool. It is the agricultural engine that activates work, inventory, marketplace timing, and learning.",
    experience: [
      "Tomato zone creates irrigation and pest-check assignments.",
      "Harvest windows inform marketplace inventory.",
      "Crop activity becomes workforce learning and reporting data.",
    ],
    nextScreen: "crop",
  },
  {
    id: "marketplace",
    eyebrow: "Marketplace Circulation",
    title: "Food moves from planning, to harvest, to families and community.",
    subtitle:
      "Marketplace activity connects growers, SNAP visibility, inventory movement, nutrition, and local economic circulation.",
    image: IMG.marketplaceHero,
    why:
      "The marketplace shows the ecosystem becoming useful to families, customers, growers, and community partners.",
    experience: [
      "Harvest forecasts become availability.",
      "Inventory updates support customer access.",
      "Marketplace reports show circulation and community reach.",
    ],
    nextScreen: "marketplace",
  },
  {
    id: "parent",
    eyebrow: "Parent / Guardian Connection",
    title: "Parents receive supportive visibility, not a disciplinary dashboard.",
    subtitle:
      "Parents see attendance, progress, badges, encouragement, approved reflections, and safety updates.",
    image: IMG.queens,
    why:
      "The parent pathway builds trust by showing growth, support, and participation without exposing internal supervisor notes.",
    experience: [
      "Youth completes assignments.",
      "Supervisor scores and approves summaries.",
      "Parent sees progress, encouragement, and next steps.",
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
      "The infographic explains the entire system only after the guest has moved through the experience.",
    experience: [
      "Youth, parents, growers, marketplace, crop planning, operations, and reports connect.",
      "The ecosystem becomes measurable.",
      "Partners and funders can see how participation turns into outcomes.",
    ],
    nextScreen: "operations",
  },
  {
    id: "reports",
    eyebrow: "Impact + Reporting",
    title: "At the end, the ecosystem can generate reports.",
    subtitle:
      "Workforce, parent, crop, marketplace, inventory, partner, grant, and community impact reports are generated from real ecosystem activity.",
    image: IMG.partners,
    why:
      "Reporting is the final proof that the ecosystem is operational, measurable, and funder-ready.",
    experience: [
      "Daily activity becomes documentation.",
      "Assessments become progress reports.",
      "Crop and marketplace activity become impact evidence.",
    ],
    nextScreen: "reports",
  },
];

function getDailyIndex(length: number) {
  return new Date().getDate() % length;
}

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
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img
          src={background}
          alt="Bronson Family Farm"
          className="h-full w-full object-cover scale-[1.02]"
        />
      </div>

      <div className="fixed inset-0 bg-black/55" />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.70),rgba(0,0,0,.35),rgba(0,0,0,.62)),radial-gradient(circle_at_top_left,rgba(255,255,255,.10),transparent_28%),radial-gradient(circle_at_bottom,rgba(16,185,129,.12),transparent_34%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-4 md:px-8">
        {!compactNav && <Navigation screen={screen} setScreen={setScreen} />}
        {children}
      </div>
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
  ];

  return (
    <div className="sticky top-3 z-40 mb-4 rounded-[1.75rem] border border-white/10 bg-black/50 p-3 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-3 min-w-[190px] px-2">
          <div className="text-[10px] uppercase tracking-[0.35em] text-emerald-100/70">
            Bronson Family Farm
          </div>
          <div className="text-lg font-black leading-tight">
            Online Ecosystem
          </div>
        </div>

        {nav.map((item) => (
          <button
            key={item.screen}
            onClick={() => setScreen(item.screen)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-xl transition ${
              screen === item.screen
                ? "border-emerald-200 bg-emerald-300 text-black"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PhotoCard({
  title,
  subtitle,
  image,
  height = "260px",
  onClick,
  label,
}: {
  title: string;
  subtitle: string;
  image: string;
  height?: string;
  onClick?: () => void;
  label?: string;
}) {
  const content = (
    <div
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,.55)] transition duration-700 hover:scale-[1.01]"
      style={{ height }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
      <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.08),transparent_45%)]" />

      {label && (
        <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-xl">
          {label}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
        <div className="text-2xl font-black leading-tight drop-shadow-2xl">
          {title}
        </div>
        <div className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/90">
          {subtitle}
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

function StatusBar() {
  return (
    <div className="mb-4 rounded-[1.75rem] border border-white/10 bg-black/35 p-3 backdrop-blur-xl">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-100/70">
            Ecosystem Status
          </div>
          <div className="mt-2 text-xl font-black">
            {ecosystemStatus.activeTeams} Active Teams
          </div>
          <div className="mt-1 text-xs text-emerald-50/80">
            {ecosystemStatus.activeGrowZones} grow zones active
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="text-[10px] uppercase tracking-[0.25em] text-sky-100/70">
            Weather Layer
          </div>
          <div className="mt-2 text-base font-black">
            {ecosystemStatus.weatherStatus}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="text-[10px] uppercase tracking-[0.25em] text-amber-100/70">
            Harvest Window
          </div>
          <div className="mt-2 text-base font-black">
            {ecosystemStatus.harvestWindow}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-100/70">
            Reporting
          </div>
          <div className="mt-2 text-base font-black">
            {ecosystemStatus.parentSummariesReady} summaries ready
          </div>
        </div>
      </div>
    </div>
  );
}

function Portal({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell screen="portal" setScreen={setScreen} background={IMG.hero} compactNav>
      <div className="grid min-h-[calc(100vh-2rem)] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-4xl">
          <div className="rounded-[2.5rem] border border-white/10 bg-black/35 p-7 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl md:p-10">
            <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/85">
              Bronson Family Farm
            </div>

            <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">
              Enter The Ecosystem.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/92 drop-shadow-2xl md:text-xl md:leading-9">
              Step through the farm first. The system will explain itself as you move through the guest journey.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setScreen("guest")}
                className="rounded-full bg-emerald-300 px-8 py-4 font-black text-black shadow-2xl transition hover:scale-105"
              >
                Enter The Ecosystem
              </button>

              <button
                onClick={() => setScreen("account")}
                className="rounded-full border border-white/15 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
              >
                Create Account
              </button>

              <button
                onClick={() => setScreen("guest")}
                className="rounded-full border border-white/15 bg-black/30 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/15"
              >
                Continue As Guest
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-black/25 p-5 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl">
          <PhotoCard
            title="The Farm Is Open"
            subtitle="The first screen invites. The explaining process begins after the guest crosses the threshold."
            image={IMG.growArea}
            height="520px"
            label="Arrival"
          />
        </div>
      </div>
    </Shell>
  );
}

function Account({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  const [selectedRole, setSelectedRole] = useState<Role>("Youth Workforce Participant");

  return (
    <Shell screen="account" setScreen={setScreen} background={IMG.hero} compactNav>
      <div className="grid min-h-[calc(100vh-2rem)] items-center gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/50 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-7">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/80">
            Create Your Ecosystem Account
          </div>

          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-5xl">
            Choose how you want to participate.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 drop-shadow-xl">
            Start as a guest, then create a role-based account when you are ready to participate more deeply in the farm ecosystem.
          </p>

          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black shadow-xl backdrop-blur-xl transition ${
                  selectedRole === role
                    ? "border-emerald-200 bg-emerald-300 text-black"
                    : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setScreen("guest")}
              className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black shadow-2xl transition hover:scale-105"
            >
              Continue Account Setup
            </button>

            <button
              onClick={() => setScreen("portal")}
              className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              Back To Portal
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/40 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-7">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">
            Account Purpose
          </div>

          <h2 className="mt-4 text-3xl font-black leading-tight">
            One account. One role. Clear next step.
          </h2>

          <p className="mt-4 text-base leading-7 text-white/88">
            This screen stays quiet and focused. The guest demo explains the whole ecosystem. Account creation only helps a participant choose their protected role.
          </p>

          <div className="mt-5 grid gap-3">
            {[
              ["Selected Role", selectedRole],
              ["Guest First", "Explore without pressure before committing."],
              ["Protected Participation", "Parents, youth, supervisors, and growers see different information."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
              >
                <div className="text-lg font-black">{title}</div>
                <div className="mt-1 text-sm leading-5 text-white/80">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function GuestJourney({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = guestSteps[stepIndex];
  const lastStep = stepIndex === guestSteps.length - 1;

  const goNext = () => setStepIndex((value) => Math.min(value + 1, guestSteps.length - 1));
  const goBack = () => setStepIndex((value) => Math.max(value - 1, 0));

  return (
    <Shell screen="guest" setScreen={setScreen} background={step.image}>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-6 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">
            {step.eyebrow}
          </div>

          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-5xl">
            {step.title}
          </h1>

          <p className="mt-5 text-base leading-7 text-white/90 md:text-lg md:leading-8">
            {step.subtitle}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
              Why this is part of the ecosystem
            </div>
            <p className="mt-3 text-sm leading-6 text-white/85">{step.why}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={goBack}
              disabled={stepIndex === 0}
              className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 disabled:opacity-35"
            >
              Back
            </button>

            {!lastStep ? (
              <button
                onClick={goNext}
                className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black shadow-xl transition hover:scale-105"
              >
                Continue Guest Journey
              </button>
            ) : (
              <button
                onClick={() => setScreen("roles")}
                className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black shadow-xl transition hover:scale-105"
              >
                Choose A Pathway
              </button>
            )}

            {step.nextScreen && (
              <button
                onClick={() => setScreen(step.nextScreen as Screen)}
                className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
              >
                Open This Area
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <PhotoCard
            title={step.title}
            subtitle={step.subtitle}
            image={step.image}
            height="410px"
            label={`Step ${stepIndex + 1} of ${guestSteps.length}`}
          />

          <div className="rounded-[2rem] border border-white/10 bg-black/42 p-5 backdrop-blur-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
              What the guest experiences
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {step.experience.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/85"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              {guestSteps.map((guestStep, index) => (
                <button
                  key={guestStep.id}
                  onClick={() => setStepIndex(index)}
                  className={`h-2 flex-1 rounded-full transition ${
                    index === stepIndex ? "bg-emerald-300" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to ${guestStep.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Roles({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  const cards: { title: string; subtitle: string; image: string; screen: Screen }[] = [
    {
      title: "Guest Demo",
      subtitle: "Experience the ecosystem explanation through movement.",
      image: IMG.hero,
      screen: "guest",
    },
    {
      title: "Youth Workforce",
      subtitle: "Energy, urgency, assignments, assessments, badges, and growth.",
      image: IMG.youth1,
      screen: "youth",
    },
    {
      title: "Grower",
      subtitle: "Standing in the field with crop planning, weather, and stewardship.",
      image: IMG.growArea,
      screen: "grower",
    },
    {
      title: "Parent / Guardian",
      subtitle: "Supportive visibility, encouragement, attendance, badges, and progress.",
      image: IMG.queens,
      screen: "parent",
    },
    {
      title: "Operations",
      subtitle: "The living control room coordinating teams, crops, alerts, and reports.",
      image: IMG.ecosystem,
      screen: "operations",
    },
    {
      title: "Marketplace",
      subtitle: "Harvest, inventory, nutrition, SNAP visibility, and circulation.",
      image: IMG.marketplaceHero,
      screen: "marketplace",
    },
  ];

  return (
    <Shell screen="roles" setScreen={setScreen} background={IMG.hero}>
      <StatusBar />
      <div className="mb-4 rounded-[1.75rem] border border-white/10 bg-black/42 p-6 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">
          Living Crossroads
        </div>
        <h1 className="mt-4 text-4xl font-black leading-tight">
          Choose how you want to move through the ecosystem.
        </h1>
        <p className="mt-4 text-base leading-7 text-emerald-50/90">
          The guest pathway is the demo. The role pathways become deeper participation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <PhotoCard
            key={card.title}
            title={card.title}
            subtitle={card.subtitle}
            image={card.image}
            onClick={() => setScreen(card.screen)}
            label="Pathway"
          />
        ))}
      </div>
    </Shell>
  );
}

function Youth({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  const proverb = dailyProverbs[getDailyIndex(dailyProverbs.length)];

  return (
    <Shell screen="youth" setScreen={setScreen} background={IMG.youth1}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-2">
        <PhotoCard
          title="Youth Workforce Pathway"
          subtitle="A high-energy pathway where daily assignments, PPE, teamwork, assessments, reflections, and badges connect participation to growth."
          image={IMG.youth1}
          height="340px"
          label="Energy + Urgency"
        />

        <div className="rounded-[2rem] border border-orange-300/20 bg-orange-950/30 p-6 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-orange-100/75">
            Today’s Youth Rhythm
          </div>
          <h2 className="mt-4 text-3xl font-black">From check-in to reflection.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              "QR Check-In",
              "PPE Verification",
              "Station Assignment",
              "Crop Zone Work",
              "Supervisor Observation",
              "Daily Score",
              "Youth Reflection",
              "Badge Progress",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 font-black">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/85">
            Daily proverb: {proverb}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Supervisor({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="supervisor" setScreen={setScreen} background={IMG.fencing}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <PhotoCard
          title="Supervisor Mobile Operations"
          subtitle="Built for phone use: attendance, PPE, task completion, assessment scoring, incident notes, support flags, and encouragement."
          image={IMG.fencing}
          height="360px"
          label="Coordination"
        />

        <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-950/25 p-6 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">Assessment Engine</h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            These scores feed badges, parent summaries, reporting, and workforce growth.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {assessmentCategories.map((item) => (
              <button
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left text-sm font-black transition hover:bg-emerald-300 hover:text-black"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ParentPortal({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="parent" setScreen={setScreen} background={IMG.queens}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-2">
        <PhotoCard
          title="Parent / Guardian Portal"
          subtitle="A calm, supportive place where families see progress, attendance, badges, encouragement, approved reflections, and safety notices."
          image={IMG.queens}
          height="360px"
          label="Support + Reassurance"
        />

        <div className="rounded-[2rem] border border-sky-300/20 bg-sky-950/25 p-6 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">What parents see</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-white/88">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              Youth completes assignment → supervisor scores → parent-safe summary updates.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              Internal supervisor notes stay protected. Parents see encouragement, progress, and approved visibility.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              Attendance, PPE, reflection, and badge progress become a supportive growth story.
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Grower({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="grower" setScreen={setScreen} background={IMG.growArea}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-2">
        <PhotoCard
          title="Grower Field Experience"
          subtitle="This pathway should feel like standing in the field: weather, crops, soil, irrigation, pests, compost, stewardship, and harvest planning."
          image={IMG.growArea}
          height="360px"
          label="Field + Stewardship"
        />

        <PhotoCard
          title="Value-Added Agriculture"
          subtitle="Edible flowers, mushrooms, culinary education, preservation, nutrition, and wellness connect growing to learning and market value."
          image={IMG.culinaryFlowers}
          height="360px"
          label="Culinary Layer"
        />
      </div>
    </Shell>
  );
}

function CropPlanning({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="crop" setScreen={setScreen} background={IMG.growAreaAlt}>
      <StatusBar />
      <div className="space-y-4">
        <PhotoCard
          title="Crop Planning Engine"
          subtitle="Crop planning drives youth assignments, irrigation, harvest timing, marketplace inventory, grower reporting, and impact documentation."
          image={IMG.growAreaAlt}
          height="330px"
          label="Agricultural Engine"
        />

        <div className="grid gap-3 md:grid-cols-4">
          {cropPlanItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-emerald-950/25 p-5 backdrop-blur-xl"
            >
              <div className="text-lg font-black">{item}</div>
              <div className="mt-2 text-sm leading-6 text-white/80">
                Connected to assignments, operations, inventory, and reporting.
              </div>
            </div>
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
      <div className="grid gap-4 lg:grid-cols-2">
        <PhotoCard
          title="Marketplace Circulation"
          subtitle="Harvest, inventory, growers, SNAP visibility, customer access, and nutrition move through the ecosystem."
          image={IMG.marketplaceHero}
          height="360px"
          label="Circulation + Abundance"
        />

        <div className="rounded-[2rem] border border-amber-300/20 bg-amber-950/25 p-6 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">Harvest To Community</h2>
          <div className="mt-5 grid gap-3">
            {[
              "Crop forecast creates expected inventory.",
              "Harvest updates marketplace availability.",
              "Marketplace movement becomes sales and food access reporting.",
              "Youth workforce can support wash, pack, prep, and market learning.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Operations({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="operations" setScreen={setScreen} background={IMG.ecosystem}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <PhotoCard
          title="Connected Food Ecosystem Overview"
          subtitle="This is where the system explains how youth workforce, parents, growers, crop planning, marketplace circulation, assessments, operations, and reports move together."
          image={IMG.ecosystem}
          height="430px"
          label="Explaining Process"
        />

        <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-950/25 p-6 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">Living Control Room</h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            This is not a corporate dashboard. It is the coordination layer that shows the farm is alive today.
          </p>

          <div className="mt-5 grid gap-3">
            {[
              `Active teams: ${ecosystemStatus.activeTeams}`,
              `Supervisors active: ${ecosystemStatus.supervisorsActive}`,
              ecosystemStatus.weatherStatus,
              ecosystemStatus.harvestWindow,
              ecosystemStatus.marketplaceStatus,
              `${ecosystemStatus.reflectionsSubmitted} reflections submitted`,
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 font-black">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Encouragement({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const proverb = dailyProverbs[getDailyIndex(dailyProverbs.length)];
  const positive = positiveMessages[getDailyIndex(positiveMessages.length)];

  return (
    <Shell screen="encouragement" setScreen={setScreen} background={IMG.seeds}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-3">
        <PhotoCard
          title="Daily Proverb"
          subtitle={proverb}
          image={IMG.seeds}
          label="Morning Focus"
        />

        <PhotoCard
          title="Positive Message"
          subtitle={positive}
          image={IMG.compost}
          label="Encouragement"
        />

        <div className="rounded-[2rem] border border-white/10 bg-black/42 p-6 backdrop-blur-2xl">
          <h2 className="text-3xl font-black">Why this belongs</h2>
          <p className="mt-4 text-sm leading-6 text-white/85">
            Encouragement is part of the ecosystem because this model measures human growth, not just labor. Proverbs, reflection, and positive messages help connect mindset, participation, accountability, and emotional development to the daily work.
          </p>
          <button className="mt-5 rounded-full bg-emerald-300 px-6 py-3 font-black text-black">
            Connect To Daily Score
          </button>
        </div>
      </div>
    </Shell>
  );
}

function Reports({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="reports" setScreen={setScreen} background={IMG.partners}>
      <StatusBar />
      <div className="space-y-4">
        <PhotoCard
          title="Reporting + Impact Center"
          subtitle="At the end, the ecosystem generates workforce, parent, crop, marketplace, inventory, partner, grant, and community impact reports."
          image={IMG.partners}
          height="330px"
          label="Measured Outcomes"
        />

        <div className="grid gap-3 md:grid-cols-4">
          {reportTypes.map((item) => (
            <button
              key={item}
              className="rounded-2xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl transition hover:bg-emerald-300 hover:text-black"
            >
              <div className="text-lg font-black">{item}</div>
              <div className="mt-2 text-sm leading-5 opacity-85">
                PDF / Excel / operational summary generated from ecosystem activity.
              </div>
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
      <div className="grid gap-4 lg:grid-cols-2">
        <PhotoCard
          title="Partner Ecosystem"
          subtitle="Partners become part of the operating model through education, sponsorship, materials, workforce support, food access, and community engagement."
          image={IMG.partners}
          height="360px"
          label="Community Infrastructure"
        />

        <PhotoCard
          title="Seeds, Compost, People, and Place"
          subtitle="Jubilee Gardens, Parker Farms, Central State University representation, compost partners, city partners, growers, and volunteers make the ecosystem real."
          image={IMG.seeds}
          height="360px"
          label="Shared Resources"
        />
      </div>
    </Shell>
  );
}

function Home({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell screen="home" setScreen={setScreen} background={IMG.hero}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <PhotoCard
          title="Step Into The Farm"
          subtitle="The ecosystem is alive through weather, youth workforce, crop planning, marketplace movement, family support, and measurable community impact."
          image={IMG.hero}
          height="420px"
          label="Arrival"
          onClick={() => setScreen("guest")}
        />
        <div className="space-y-4">
          <PhotoCard
            title="Guest Journey Is The Demo"
            subtitle="The guest pathway explains the full ecosystem gradually through movement, not information overload."
            image={IMG.growArea}
            onClick={() => setScreen("guest")}
          />
          <PhotoCard
            title="Connected System Explained Later"
            subtitle="The ecosystem graphic belongs in the explaining process, not the first arrival screen."
            image={IMG.ecosystem}
            onClick={() => setScreen("operations")}
          />
        </div>
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
  if (screen === "home") return <Home setScreen={setScreen} />;
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
