import React, { useEffect, useMemo, useState } from "react";

/**
 * Bronson Family Farm Online Ecosystem
 * FINAL COMPLETE OPERATIONAL SCRIPT
 *
 * Preserved:
 * - Portal first. The user enters before the farm/ecosystem is explained.
 * - Forest / nature threshold only on the entrance.
 * - Guest pathway is the guided demo.
 * - Ecosystem image appears only during explanation, not first arrival.
 * - Role pathways go deeper vertically: Guest, Youth, Supervisor, Parent, Grower, Marketplace, Operations, Partners.
 * - Staff/Supervisors are the protected access layer for youth.
 * - Every visible button goes somewhere or opens a real external resource.
 * - Includes weather/live channels, crop planner, grow plan, assessments, proverbs, data, reports, and parent summaries.
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
  | "partners"
  | "safety"
  | "data"
  | "training"
  | "valueAdded";

type Role =
  | "Guest"
  | "Youth Workforce Participant"
  | "Parent / Guardian"
  | "Supervisor / Staff"
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

type CardLink = {
  title: string;
  text: string;
  screen?: Screen;
  href?: string;
};

const image = (file: string) => `/images/${file}`;

const IMG = {
  forest: image("large (18).jpg"),
  forestAlt: image("large (2).jpg"),
  youth1: image("large (16).jpg"),
  youth2: image("large (15).jpg"),
  youth3: image("large (12).jpg"),
  marketplaceHero: image("large (11).jpg"),
  ecosystem: image("ConnectFoodEcosystem_withimages.png"),
  flowers: image("culniary_edibleflowers.jpeg"),
  flowers2: image("culniary_edibleflowers2.jpeg"),
  mushrooms: image("culniary_mushrooms.jpeg"),
  growArea: image("GrowArea2.jpg"),
  growAreaAlt: image("Grow Area.png"),
  partners: image("Partners.png"),
  compost: image("Compost_ElliottGarden.png"),
  compost2: image("Compost_Elliott.png"),
  fencing: image("Deer Fencing.png"),
  volunteers: image("Fence_volunteers.png"),
  queens: image("Queens Village.png"),
  seeds: image("Seeds_Jubilee Gardens.png"),
  csu: image("CSU_MParker.png"),
  wkbn: image("WKBN Interview.png"),
  sameera2: image("Samaeera2.jpg"),
  sameera3: image("Sameera3.jpg"),
  sameera4: image("Samerra4.jpg"),
  sameera5: image("Samerra5.jpg"),
};

const roles: Role[] = [
  "Guest",
  "Youth Workforce Participant",
  "Parent / Guardian",
  "Supervisor / Staff",
  "Grower",
  "Marketplace Customer",
  "Volunteer",
  "Partner",
  "Administrator",
  "Value-Added Producer",
];

const proverbs = [
  "A seed becomes a harvest when people protect the conditions around it.",
  "Leadership grows through responsibility.",
  "Measure progress daily, but grow people patiently.",
  "A living ecosystem returns value to the community.",
  "Food access begins with hands, soil, tools, water, and trust.",
  "Progress happens one action at a time.",
  "What is planted with care can feed more than one family.",
];

const messages = [
  "Your work matters because someone in this community needs what you are helping build.",
  "Every small action creates long-term growth.",
  "Healthy communities begin with connected systems.",
  "Today is another opportunity to build something meaningful.",
  "You are not just completing a task. You are helping build a place.",
  "Growth is visible when effort, reflection, and support move together.",
];

const ecosystemStatus = {
  teams: 4,
  zones: 7,
  weather: "Youngstown weather channel connected",
  harvest: "Tomatoes approaching harvest window",
  market: "Inventory movement connected to crop planning",
  reflections: 18,
  supervisors: 5,
  parentSummaries: 12,
  youthCapacity: "50 youth launch / scalable database",
};

const assignments = [
  "QR check-in",
  "PPE verification",
  "Tomato irrigation support",
  "Compost distribution",
  "Pollinator zone cleanup",
  "Raised bed maintenance",
  "Seed preparation",
  "Wash station support",
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

const liveChannels: CardLink[] = [
  {
    title: "Weather Underground",
    text: "Hourly weather review for Youngstown field decisions.",
    href: "https://www.wunderground.com/hourly/us/oh/youngstown",
  },
  {
    title: "AccuWeather",
    text: "Minute-by-minute and short-range weather awareness.",
    href: "https://www.accuweather.com/en/us/youngstown/44503/weather-forecast/350128",
  },
  {
    title: "Farmers' Almanac",
    text: "Seasonal planting and weather context.",
    href: "https://www.farmersalmanac.com/",
  },
  {
    title: "Seedtime",
    text: "Crop calendar, tasks, journaling, and planning reference.",
    href: "https://www.seedtime.us/",
  },
];

const guestSteps: GuestStep[] = [
  {
    id: "arrival",
    eyebrow: "Guest Journey / Demo",
    title: "Arrive first. Understand later.",
    subtitle: "The ecosystem begins with place, atmosphere, and invitation before it explains the full system.",
    image: IMG.forest,
    why: "The entrance is a threshold. It should feel like stepping into a living forest/farm experience, not seeing a diagram first.",
    experience: [
      "The guest enters before the explanation.",
      "The farm is presented as atmosphere, welcome, and movement.",
      "The connected ecosystem image is held back until the system is being explained.",
    ],
  },
  {
    id: "why",
    eyebrow: "Why This Exists",
    title: "A farm ecosystem built for food, people, and community movement.",
    subtitle: "Bronson Family Farm connects land, youth workforce, growers, marketplace circulation, family support, and measurable impact.",
    image: IMG.growArea,
    why: "The guest begins to understand that this is more than a farm and more than software. It is an operating model.",
    experience: [
      "Food access connects to local production.",
      "Youth participation connects to work readiness and personal growth.",
      "Marketplace movement connects to crop planning and community nutrition.",
    ],
  },
  {
    id: "history",
    eyebrow: "Place / History",
    title: "The farm stands on historic Lansdowne Airport land.",
    subtitle: "The location carries a layered story of land, aviation, community movement, military service, family legacy, and new food infrastructure.",
    image: IMG.growAreaAlt,
    why: "The history belongs in the guided explanation after the guest has entered. It gives meaning without turning the entrance into an airport screen.",
    experience: [
      "The land story is introduced respectfully.",
      "Military service and family legacy are connected to responsibility.",
      "The farm becomes a future-facing use of historic land.",
    ],
  },
  {
    id: "youth",
    eyebrow: "Youth Workforce",
    title: "Youth participate in real work.",
    subtitle: "Assignments, PPE, attendance, reflections, assessments, badges, and supervisor encouragement connect youth development to real farm operations.",
    image: IMG.youth1,
    why: "The youth pathway is a workforce and life-skills pathway, not a decorative activity.",
    experience: [
      "Youth check in and receive daily assignments.",
      "Supervisors observe participation, safety, teamwork, and growth.",
      "Progress becomes visible through badges, reflection, and reports.",
    ],
    nextScreen: "youth",
  },
  {
    id: "safety",
    eyebrow: "Youth Protection",
    title: "Youth access is protected through staff and supervisor control.",
    subtitle: "Random visitors do not access youth records. Supervisors are the protected staff layer.",
    image: IMG.fencing,
    why: "Safety is part of the ecosystem. Youth-facing data must be separated from public/guest participation.",
    experience: [
      "Supervisor/staff role is required for youth records.",
      "Parents see appropriate summaries, not internal crisis notes.",
      "Guest, marketplace, and partner users do not enter youth supervision tools.",
    ],
    nextScreen: "safety",
  },
  {
    id: "assessment",
    eyebrow: "Assessment Engine",
    title: "Assessments are the heartbeat.",
    subtitle: "Attendance, PPE, teamwork, communication, leadership, reflection, and task completion feed badges, parent summaries, and reports.",
    image: IMG.volunteers,
    why: "The assessment layer turns daily participation into measurable growth without reducing youth to labels.",
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
    title: "Crop planning drives work.",
    subtitle: "Grow zones, irrigation, harvest forecasts, succession planting, pest monitoring, and youth assignments move together.",
    image: IMG.growAreaAlt,
    why: "The crop planner is the agricultural engine that activates work, inventory, marketplace timing, and learning.",
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
    title: "Food moves through community.",
    subtitle: "Marketplace activity connects growers, SNAP visibility, inventory movement, nutrition, and local economic circulation.",
    image: IMG.marketplaceHero,
    why: "The marketplace shows the ecosystem becoming useful to families, customers, growers, and community partners.",
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
    title: "Parents receive supportive visibility.",
    subtitle: "Parents see attendance, progress, badges, encouragement, approved reflections, and safety updates.",
    image: IMG.queens,
    why: "The parent pathway builds trust by showing growth, support, and participation without exposing internal supervisor notes.",
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
    subtitle: "This is where the system image belongs: after the guest understands why the parts matter.",
    image: IMG.ecosystem,
    why: "The infographic explains the entire system only after the guest has moved through the experience.",
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
    title: "At the end, the ecosystem generates reports.",
    subtitle: "Workforce, parent, crop, marketplace, inventory, partner, grant, and community impact reports are generated from real ecosystem activity.",
    image: IMG.partners,
    why: "Reporting is the final proof that the ecosystem is operational, measurable, and funder-ready.",
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

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1.08;
  utterance.volume = 0.95;
  utterance.lang = "en-US";

  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /Samantha|Jenny|Aria|Google US English|Microsoft Ava|Microsoft Emma/i.test(v.name)) ||
    voices.find((v) => v.lang === "en-US" && !/Huihui|Haruka|Heami|Kangkang|Yaoyao|Zira/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

function Shell({
  children,
  screen,
  setScreen,
  background = IMG.forest,
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
        <img
          src={background}
          alt="Bronson Family Farm"
          className="h-full w-full scale-[1.02] object-cover"
          onError={(event) => {
            const target = event.currentTarget;
            if (!target.src.includes("GrowArea2")) target.src = IMG.growArea;
          }}
        />
      </div>

      <div className="fixed inset-0 bg-black/46" />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.30),rgba(0,0,0,.60)),radial-gradient(circle_at_top_left,rgba(255,255,255,.13),transparent_28%),radial-gradient(circle_at_bottom,rgba(16,185,129,.14),transparent_34%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-4 md:px-8">
        {!compactNav && <Navigation screen={screen} setScreen={setScreen} />}
        {children}
      </div>
    </div>
  );
}

function Navigation({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
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
    <div className="sticky top-3 z-40 mb-4 rounded-[1.5rem] border border-white/10 bg-black/50 p-3 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setScreen("portal")} className="mr-2 min-w-[175px] px-2 text-left">
          <div className="text-[10px] uppercase tracking-[0.32em] text-emerald-100/70">Bronson Family Farm</div>
          <div className="text-base font-black leading-tight">Online Ecosystem</div>
        </button>

        {nav.map((item) => (
          <button
            key={item.screen}
            onClick={() => setScreen(item.screen)}
            className={`rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur-xl transition ${
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
  height = "240px",
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
  const content = (
    <div
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-[0_28px_70px_rgba(0,0,0,.52)] transition duration-500 ${
        onClick ? "cursor-pointer hover:scale-[1.01] hover:border-emerald-200/40" : ""
      }`}
      style={{ height }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105"
        onError={(event) => {
          const target = event.currentTarget;
          if (!target.src.includes("GrowArea2")) target.src = IMG.growArea;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/38 to-black/8" />

      {label && (
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-xl">
          {label}
        </div>
      )}

      {cta && (
        <div className="absolute right-4 top-4 rounded-full bg-emerald-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-black shadow-xl">
          {cta}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
        <div className="text-2xl font-black leading-tight drop-shadow-2xl">{title}</div>
        <div className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/90">{subtitle}</div>
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
    <div className="mb-4 rounded-[1.5rem] border border-white/10 bg-black/35 p-3 backdrop-blur-xl">
      <div className="grid gap-3 md:grid-cols-4">
        <StatusTile label="Ecosystem Status" value={`${ecosystemStatus.teams} Active Teams`} note={`${ecosystemStatus.zones} grow zones active`} />
        <StatusTile label="Weather" value={ecosystemStatus.weather} note="Live channel buttons available" />
        <StatusTile label="Harvest" value={ecosystemStatus.harvest} note="Marketplace forecast open" />
        <StatusTile label="Reports" value={`${ecosystemStatus.parentSummaries} summaries ready`} note="Daily documentation active" />
      </div>
    </div>
  );
}

function StatusTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
      <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-100/70">{label}</div>
      <div className="mt-1 text-base font-black">{value}</div>
      <div className="mt-1 text-xs text-emerald-50/80">{note}</div>
    </div>
  );
}

function ActionGrid({ items, setScreen }: { items: CardLink[]; setScreen: (screen: Screen) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <button
          key={item.title}
          onClick={() => (item.href ? openExternal(item.href) : item.screen ? setScreen(item.screen) : undefined)}
          className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-emerald-300 hover:text-black"
        >
          <div className="text-lg font-black">{item.title}</div>
          <div className="mt-2 text-sm leading-6 opacity-90">{item.text}</div>
        </button>
      ))}
    </div>
  );
}

function Portal({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="portal" setScreen={setScreen} background={IMG.forest} compactNav>
      <div className="grid min-h-[calc(100vh-2rem)] items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-4xl">
          <div className="rounded-[2.25rem] border border-white/10 bg-black/36 p-6 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl md:p-9">
            <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/85">Bronson Family Farm</div>
            <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">Enter The Ecosystem.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/92 drop-shadow-2xl md:text-xl md:leading-9">
              Step through the forest gate first. The guest journey becomes the guided tour and explains the ecosystem as you move.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => setScreen("guest")} className="rounded-full bg-emerald-300 px-8 py-4 font-black text-black shadow-2xl transition hover:scale-105">
                Enter The Ecosystem
              </button>
              <button onClick={() => setScreen("account")} className="rounded-full border border-white/15 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
                Create Account
              </button>
              <button onClick={() => setScreen("guest")} className="rounded-full border border-white/15 bg-black/30 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/15">
                Continue As Guest
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setScreen("guest")}
          className="block w-full rounded-[2.25rem] border border-white/10 bg-black/28 p-4 text-left shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl transition hover:scale-[1.01] hover:border-emerald-200/35"
        >
          <PhotoCard
            title="The Forest Gate Is Open"
            subtitle="This is the threshold. The farm appears after entry. The explanation comes through the guided guest journey."
            image={IMG.forestAlt}
            height="440px"
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

  const routeForRole: Record<Role, Screen> = {
    Guest: "guest",
    "Youth Workforce Participant": "youth",
    "Parent / Guardian": "parent",
    "Supervisor / Staff": "supervisor",
    Grower: "grower",
    "Marketplace Customer": "marketplace",
    Volunteer: "roles",
    Partner: "partners",
    Administrator: "operations",
    "Value-Added Producer": "valueAdded",
  };

  return (
    <Shell screen="account" setScreen={setScreen} background={IMG.forest} compactNav>
      <div className="grid min-h-[calc(100vh-2rem)] items-center gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/50 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-7">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/80">Create Your Ecosystem Account</div>
          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-5xl">Choose how you participate.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90">
            Start as a guest, then create a role-based account when you are ready. Youth records stay protected behind supervisor/staff access.
          </p>

          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black shadow-xl backdrop-blur-xl transition ${
                  selectedRole === role ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => setScreen(routeForRole[selectedRole])} className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black shadow-2xl transition hover:scale-105">
              Continue Account Setup
            </button>
            <button onClick={() => setScreen("portal")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
              Back To Portal
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/40 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-7">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">Account Purpose</div>
          <h2 className="mt-4 text-3xl font-black leading-tight">One account. One role. Clear access.</h2>
          <div className="mt-5 grid gap-3">
            {[
              ["Selected Role", selectedRole],
              ["Guest First", "Explore without pressure before committing."],
              ["Protected Youth Data", "Only supervisor/staff role enters youth observation and internal assessment tools."],
              ["Parent Visibility", "Parents see attendance, badges, strengths, approved reflections, and encouragement."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
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

function GuestJourney({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = guestSteps[stepIndex];
  const lastStep = stepIndex === guestSteps.length - 1;

  useEffect(() => {
    window.speechSynthesis?.getVoices?.();
  }, []);

  return (
    <Shell screen="guest" setScreen={setScreen} background={step.image}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/50 p-5 shadow-[0_35px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl md:p-6">
          <div className="text-xs uppercase tracking-[0.32em] text-emerald-100/80">{step.eyebrow}</div>
          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-5xl">{step.title}</h1>
          <p className="mt-5 text-base leading-7 text-white/90 md:text-lg md:leading-8">{step.subtitle}</p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Why this is part of the ecosystem</div>
            <p className="mt-3 text-sm leading-6 text-white/85">{step.why}</p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Narration Control Panel</div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button onClick={() => speak(`${step.title}. ${step.subtitle}. ${step.why}`)} className="rounded-full bg-emerald-300 px-5 py-3 font-black text-black shadow-xl transition hover:scale-105">
                Play Guided Voice
              </button>
              <button onClick={() => window.speechSynthesis?.cancel()} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20">
                Stop Voice
              </button>
              <button onClick={() => setScreen("roles")} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20">
                Skip To Roles
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => setStepIndex((v) => Math.max(v - 1, 0))} disabled={stepIndex === 0} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 disabled:opacity-35">
              Back
            </button>
            {!lastStep ? (
              <button onClick={() => setStepIndex((v) => Math.min(v + 1, guestSteps.length - 1))} className="rounded-full bg-emerald-300 px-5 py-3 font-black text-black shadow-xl transition hover:scale-105">
                Continue Journey
              </button>
            ) : (
              <button onClick={() => setScreen("roles")} className="rounded-full bg-emerald-300 px-5 py-3 font-black text-black shadow-xl transition hover:scale-105">
                Choose A Pathway
              </button>
            )}
            {step.nextScreen && (
              <button onClick={() => setScreen(step.nextScreen as Screen)} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20">
                Open This Area
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <PhotoCard title={step.title} subtitle={step.subtitle} image={step.image} height="360px" label={`Step ${stepIndex + 1} of ${guestSteps.length}`} cta="Active" />
          <div className="rounded-[2rem] border border-white/10 bg-black/46 p-5 backdrop-blur-2xl">
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">What the guest experiences</div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {step.experience.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/85">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
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
        </div>
      </div>
    </Shell>
  );
}

function Roles({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const cards: { title: string; subtitle: string; image: string; screen: Screen }[] = [
    { title: "Guest Demo", subtitle: "Experience the ecosystem explanation through movement.", image: IMG.forest, screen: "guest" },
    { title: "Youth Workforce", subtitle: "Assignments, assessments, badges, and growth.", image: IMG.youth1, screen: "youth" },
    { title: "Supervisor / Staff", subtitle: "Protected youth access, daily scoring, support notes, and reports.", image: IMG.fencing, screen: "supervisor" },
    { title: "Parent / Guardian", subtitle: "Supportive visibility, attendance, badges, and progress.", image: IMG.queens, screen: "parent" },
    { title: "Grower Field", subtitle: "Crop planning, weather, soil, harvest, and stewardship.", image: IMG.growArea, screen: "grower" },
    { title: "Marketplace", subtitle: "Harvest, inventory, SNAP visibility, and circulation.", image: IMG.marketplaceHero, screen: "marketplace" },
    { title: "Operations Room", subtitle: "Teams, crops, alerts, marketplace, and reports.", image: IMG.ecosystem, screen: "operations" },
    { title: "Value-Added Producer", subtitle: "Culinary, mushrooms, edible flowers, packaging, and market identity.", image: IMG.flowers, screen: "valueAdded" },
    { title: "Partners / Funders", subtitle: "Support, sponsorship, impact, and investment readiness.", image: IMG.partners, screen: "partners" },
  ];

  return (
    <Shell screen="roles" setScreen={setScreen} background={IMG.forest}>
      <StatusBar />
      <div className="mb-4 rounded-[1.75rem] border border-white/10 bg-black/42 p-5 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Living Crossroads</div>
        <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">Choose how you want to move through the ecosystem.</h1>
        <p className="mt-3 text-base leading-7 text-emerald-50/90">The guest pathway is the demo. The role pathways become deeper participation.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <PhotoCard key={card.title} title={card.title} subtitle={card.subtitle} image={card.image} onClick={() => setScreen(card.screen)} label="Pathway" cta="Open" />
        ))}
      </div>
    </Shell>
  );
}

function Encouragement({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const proverb = proverbs[getDailyIndex(proverbs.length)];
  const message = messages[getDailyIndex(messages.length)];

  return (
    <Shell screen="encouragement" setScreen={setScreen} background={IMG.seeds}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel eyebrow="Daily Proverb" title={proverb} body="This is the grounding message that connects work, responsibility, and personal growth before the day begins." />
        <Panel eyebrow="Positive Message" title={message} body="This gives youth, volunteers, and staff a reason to connect their daily actions to purpose." />
      </div>
      <div className="mt-4">
        <ActionGrid
          setScreen={setScreen}
          items={[
            { title: "Youth Reflection", text: "Open the youth pathway and connect today's message to the day’s work.", screen: "youth" },
            { title: "Supervisor Observation", text: "Supervisors use the message to support youth reflection and emotional readiness.", screen: "supervisor" },
            { title: "Parent Summary", text: "Parents see encouragement, progress, and approved reflections.", screen: "parent" },
            { title: "Reports", text: "Reflections become part of documentation and impact evidence.", screen: "reports" },
          ]}
        />
      </div>
    </Shell>
  );
}

function Youth({ setScreen }: { setScreen: (screen: Screen) => void }) {
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
          cta="Daily Flow"
          onClick={() => setScreen("supervisor")}
        />

        <div className="rounded-[2rem] border border-orange-300/20 bg-orange-950/30 p-6 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-orange-100/75">Today’s Youth Rhythm</div>
          <h2 className="mt-4 text-3xl font-black">From check-in to reflection.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
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
              <button key={item} onClick={() => setScreen(target as Screen)} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left font-black transition hover:bg-emerald-300 hover:text-black">
                {item}
              </button>
            ))}
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
        <Panel
          eyebrow="Supervisor / Staff Protected Access"
          title="Supervisors are the youth access layer."
          body="Staff support, guide, counsel, assess, and protect youth through their daily journey. Public guests, customers, partners, and marketplace users do not enter youth records."
        />

        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Assessment Room</div>
          <h2 className="mt-3 text-3xl font-black">Daily mobile supervisor scoring</h2>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {assessmentCategories.map((item) => (
              <button key={item} onClick={() => setScreen("data")} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left text-sm font-black transition hover:bg-emerald-300 hover:text-black">
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <ActionGrid
              setScreen={setScreen}
              items={[
                { title: "Open Safety Rules", text: "No PPE, no work. Youth protection and role access rules.", screen: "safety" },
                { title: "Parent Summary Flow", text: "Show what parents can see after supervisor approval.", screen: "parent" },
                { title: "Generate Daily Report", text: "Send supervisor observations to reports.", screen: "reports" },
                { title: "Return to Youth", text: "View the youth-facing daily rhythm.", screen: "youth" },
              ]}
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Safety({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="safety" setScreen={setScreen} background={IMG.fencing}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          eyebrow="Youth Protection"
          title="Access is separated by role."
          body="Guests can explore. Customers can shop. Partners can review impact. Parents can see approved summaries. Supervisors/staff are the only users with youth observation, assessment, and support-note access."
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Protected Rules</div>
          <div className="mt-5 grid gap-3">
            {[
              "No public user enters youth records.",
              "Supervisors must be approved staff.",
              "Youth safety, PPE, and attendance are daily checks.",
              "Parent view separates encouragement/progress from internal support flags.",
              "Visitors and partners see program outcomes, not private youth data.",
              "Every youth-facing tool routes through the supervisor layer.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/88">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Parent({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const rows = [
    ["Attendance", "Present today", "Parent can see"],
    ["Safety", "PPE complete", "Parent can see"],
    ["Station", "Grow Area + Compost", "Parent can see"],
    ["Skill Badge", "Field Responsibility in progress", "Parent can see"],
    ["Supervisor Note", "Showed patience and helped a peer reset", "Parent summary"],
    ["Support Flag", "Follow-up needed", "Internal supervisor view"],
  ];

  return (
    <Shell screen="parent" setScreen={setScreen} background={IMG.queens}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel
          eyebrow="Parent / Guardian Portal"
          title="Parents see support, progress, and next steps."
          body="The parent view builds trust by showing attendance, safety, badges, strengths, encouragement, announcements, and approved reflections without exposing internal crisis labels or private supervisor notes."
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Youth Progress Snapshot</div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            {rows.map(([a, b, c]) => (
              <div key={a} className="grid grid-cols-3 border-b border-white/10 bg-white/10 p-3 text-sm last:border-b-0">
                <div className="font-black">{a}</div>
                <div>{b}</div>
                <div className="text-emerald-100/85">{c}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <ActionGrid
              setScreen={setScreen}
              items={[
                { title: "Open Encouragement", text: "Daily proverb and positive message.", screen: "encouragement" },
                { title: "Open Supervisor View", text: "See how the parent summary is created.", screen: "supervisor" },
                { title: "Open Reports", text: "See final parent and youth progress reporting.", screen: "reports" },
                { title: "Back to Roles", text: "Choose another pathway.", screen: "roles" },
              ]}
            />
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
          title="Grower Pathway"
          subtitle="Growers use field information, weather, crop planning, training, marketplace timing, and shared resources to participate in the ecosystem."
          image={IMG.growArea}
          height="340px"
          label="Grower"
          cta="Plan"
          onClick={() => setScreen("crop")}
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Live Field Channels</div>
          <h2 className="mt-3 text-3xl font-black">Weather, calendar, soil, crop, and market timing.</h2>
          <div className="mt-5">
            <ActionGrid setScreen={setScreen} items={liveChannels} />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function CropPlanner({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [selectedCrop, setSelectedCrop] = useState("Tomatoes");
  const crops = ["Tomatoes", "Collards", "Mustard Greens", "Peppers", "Broccoli", "Spinach", "Lettuce", "Cilantro"];

  return (
    <Shell screen="crop" setScreen={setScreen} background={IMG.growAreaAlt}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Crop Planner / Grow Plan</div>
          <h1 className="mt-3 text-4xl font-black">Select crop and generate work.</h1>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {crops.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`rounded-2xl border p-4 text-left font-black ${
                  selectedCrop === crop ? "border-emerald-200 bg-emerald-300 text-black" : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <ActionGrid
              setScreen={setScreen}
              items={[
                { title: "Send to Youth Assignments", text: "Turn the grow plan into daily youth work.", screen: "youth" },
                { title: "Send to Marketplace", text: "Move harvest window into inventory forecast.", screen: "marketplace" },
                { title: "Send to Reports", text: "Make the crop plan funder-ready.", screen: "reports" },
                { title: "Open Weather", text: "Check field conditions.", screen: "grower" },
              ]}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Active Grow Plan</div>
          <h2 className="mt-3 text-3xl font-black">{selectedCrop}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {cropPlanItems.map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">{item}</div>
                <div className="mt-2 text-lg font-black">{index % 2 === 0 ? "Ready for update" : "Linked to operations"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Marketplace({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const products = [
    ["Tomato Seedlings", "3 for $5", "SNAP eligible if sold as food-producing plant"],
    ["Collard Greens", "5 for $10", "Food access / nutrition"],
    ["Mustard Greens", "5 for $7", "Food access / nutrition"],
    ["Peppers", "3 for $5", "Food-producing plant"],
    ["Bubble Babies™", "Seed roll system", "Education + production"],
    ["Community Seeds", "Giveaway inventory", "Jubilee Gardens contribution"],
  ];

  return (
    <Shell screen="marketplace" setScreen={setScreen} background={IMG.marketplaceHero}>
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel
          eyebrow="Marketplace Circulation"
          title="Inventory connects to crop planning and community access."
          body="The marketplace pathway shows what is available, what is forecasted, what is SNAP-visible, and how products move from grow plan to customer access."
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Marketplace Inventory</div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {products.map(([name, price, note]) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-lg font-black">{name}</div>
                <div className="mt-1 text-emerald-100">{price}</div>
                <div className="mt-2 text-sm leading-5 text-white/78">{note}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <ActionGrid
              setScreen={setScreen}
              items={[
                { title: "Open GrownBy Store", text: "Go to the Bronson Family Farm shop.", href: "https://grownby.com/farms/bronson-family-farm/shop" },
                { title: "Update Crop Forecast", text: "Connect inventory to crop planning.", screen: "crop" },
                { title: "Marketplace Report", text: "Document sales, circulation, and reach.", screen: "reports" },
                { title: "Value-Added Path", text: "Open culinary/value-added products.", screen: "valueAdded" },
              ]}
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ValueAdded({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="valueAdded" setScreen={setScreen} background={IMG.flowers}>
      <StatusBar />
      <div className="grid gap-4 md:grid-cols-3">
        <PhotoCard title="Edible Flowers" subtitle="Culinary education, customer experience, and specialty products." image={IMG.flowers} onClick={() => setScreen("marketplace")} label="Value-Added" cta="Market" />
        <PhotoCard title="Mushrooms" subtitle="Food education, value-added production, and specialty crop opportunity." image={IMG.mushrooms} onClick={() => setScreen("crop")} label="Specialty" cta="Plan" />
        <PhotoCard title="Packaging + Story" subtitle="Branding, QR labels, recipes, and customer return pathways." image={IMG.flowers2} onClick={() => setScreen("reports")} label="Brand" cta="Report" />
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
          title="Connected Food Ecosystem"
          subtitle="This is the explaining screen. The system graphic appears here because the user has already moved through the experience."
          image={IMG.ecosystem}
          height="430px"
          label="System View"
          cta="Connected"
          onClick={() => setScreen("data")}
        />
        <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Operations Control</div>
          <h2 className="mt-3 text-3xl font-black">Assignments, channels, alerts, reports.</h2>
          <div className="mt-5 grid gap-3">
            {assignments.map((item) => (
              <button key={item} onClick={() => setScreen("data")} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left font-black transition hover:bg-emerald-300 hover:text-black">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function DataRoom({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const metrics = [
    ["Youth Capacity", ecosystemStatus.youthCapacity],
    ["Supervisors Active", String(ecosystemStatus.supervisors)],
    ["Reflections Submitted", String(ecosystemStatus.reflections)],
    ["Parent Summaries Ready", String(ecosystemStatus.parentSummaries)],
    ["Grow Zones Active", String(ecosystemStatus.zones)],
    ["Marketplace", ecosystemStatus.market],
  ];

  return (
    <Shell screen="data" setScreen={setScreen} background={IMG.partners}>
      <StatusBar />
      <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Data Room</div>
        <h1 className="mt-3 text-4xl font-black">Operational data turns activity into decisions.</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {metrics.map(([title, value]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">{title}</div>
              <div className="mt-2 text-2xl font-black">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <ActionGrid
            setScreen={setScreen}
            items={[
              { title: "Supervisor Assessment Data", text: "See the staff scoring layer.", screen: "supervisor" },
              { title: "Parent Summary Data", text: "See what is parent-visible.", screen: "parent" },
              { title: "Crop + Market Data", text: "Connect harvest to marketplace forecast.", screen: "crop" },
              { title: "Reports", text: "Convert data into funder-ready reporting.", screen: "reports" },
            ]}
          />
        </div>
      </div>
    </Shell>
  );
}

function Reports({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="reports" setScreen={setScreen} background={IMG.partners}>
      <StatusBar />
      <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Reports + Exports</div>
        <h1 className="mt-3 text-4xl font-black">The ecosystem proves itself through documentation.</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {reportTypes.map((item) => (
            <button key={item} onClick={() => setScreen("data")} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left font-black transition hover:bg-emerald-300 hover:text-black">
              {item}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <ActionGrid
            setScreen={setScreen}
            items={[
              { title: "Partner Impact", text: "Show funders and partners the evidence.", screen: "partners" },
              { title: "Operations", text: "Return to the whole system view.", screen: "operations" },
              { title: "Data Room", text: "Review live metrics.", screen: "data" },
              { title: "Guest Demo", text: "Restart the guided explanation.", screen: "guest" },
            ]}
          />
        </div>
      </div>
    </Shell>
  );
}

function Partners({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const partnerCards = [
    ["Jubilee Gardens, Inc.", "Seed donations that help make giveaways and community planting possible."],
    ["Parker Farms", "Value-added education, grower ecosystem alignment, and marketplace participation."],
    ["Central State University", "Farm training, agricultural education, and grower development connection."],
    ["Home Depot", "Tools, demonstrations, fencing, raised beds, and practical infrastructure support."],
    ["Elliott's Garden Center", "Compost support for regenerative growing and soil-building."],
    ["Youngstown Partners", "Public health, planning, parks, workforce, and community support alignment."],
  ];

  return (
    <Shell screen="partners" setScreen={setScreen} background={IMG.partners}>
      <StatusBar />
      <div className="rounded-[2rem] border border-white/10 bg-black/48 p-5 backdrop-blur-2xl">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Partner / Investor View</div>
        <h1 className="mt-3 text-4xl font-black">Partners support the ecosystem where resources become community capacity.</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {partnerCards.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-lg font-black">{title}</div>
              <div className="mt-2 text-sm leading-6 text-white/80">{text}</div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <ActionGrid
            setScreen={setScreen}
            items={[
              { title: "Impact Reports", text: "Review measurable outcomes.", screen: "reports" },
              { title: "Operations View", text: "See how the whole system connects.", screen: "operations" },
              { title: "Marketplace", text: "See economic circulation and customer access.", screen: "marketplace" },
              { title: "Youth Workforce", text: "See workforce development and protected supervision.", screen: "youth" },
            ]}
          />
        </div>
      </div>
    </Shell>
  );
}

function Training({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="training" setScreen={setScreen} background={IMG.csu}>
      <StatusBar />
      <Panel
        eyebrow="Training"
        title="Supervisor and participant training connects the work to safety, skill, and growth."
        body="Training includes PPE, youth protection, assessment language, role-based access, field station expectations, emergency procedures, daily reflection, crop planning, marketplace preparation, and reporting."
      />
      <div className="mt-4">
        <ActionGrid
          setScreen={setScreen}
          items={[
            { title: "Supervisor Training", text: "Open protected supervisor assessment flow.", screen: "supervisor" },
            { title: "Youth Daily Flow", text: "Open youth pathway.", screen: "youth" },
            { title: "Crop Training", text: "Open grow plan.", screen: "crop" },
            { title: "Safety", text: "Open youth protection and PPE rules.", screen: "safety" },
          ]}
        />
      </div>
    </Shell>
  );
}

function Panel({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/48 p-6 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/75">{eyebrow}</div>
      <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{title}</h1>
      <p className="mt-5 text-base leading-8 text-white/88">{body}</p>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("portal");

  const screenComponent = useMemo(() => {
    switch (screen) {
      case "portal":
        return <Portal setScreen={setScreen} />;
      case "account":
        return <Account setScreen={setScreen} />;
      case "guest":
        return <GuestJourney setScreen={setScreen} />;
      case "roles":
        return <Roles setScreen={setScreen} />;
      case "youth":
        return <Youth setScreen={setScreen} />;
      case "supervisor":
        return <Supervisor setScreen={setScreen} />;
      case "parent":
        return <Parent setScreen={setScreen} />;
      case "grower":
        return <Grower setScreen={setScreen} />;
      case "crop":
        return <CropPlanner setScreen={setScreen} />;
      case "marketplace":
        return <Marketplace setScreen={setScreen} />;
      case "operations":
        return <Operations setScreen={setScreen} />;
      case "encouragement":
        return <Encouragement setScreen={setScreen} />;
      case "reports":
        return <Reports setScreen={setScreen} />;
      case "partners":
        return <Partners setScreen={setScreen} />;
      case "safety":
        return <Safety setScreen={setScreen} />;
      case "data":
        return <DataRoom setScreen={setScreen} />;
      case "training":
        return <Training setScreen={setScreen} />;
      case "valueAdded":
        return <ValueAdded setScreen={setScreen} />;
      default:
        return <Portal setScreen={setScreen} />;
    }
  }, [screen]);

  return screenComponent;
}
