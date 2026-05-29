import React, { useEffect, useState } from "react";

type Screen =
  | "portal"
  | "guest"
  | "access"
  | "roles"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "crop"
  | "marketplace"
  | "operations"
  | "reports"
  | "partners"
  | "training"
  | "safety"
  | "valueAdded"
  | "wellness";

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

type AccessLevel = "public" | "participant" | "family" | "staff" | "admin";

type UserSession = {
  id: string;
  displayName: string;
  role: Role;
  accessLevel: AccessLevel;
  lastSeen: string;
};

type YouthRecord = {
  participantId: string;
  protectedName: string;
  crew: string;
  ageRange: string;
  attendance: "Present" | "Absent" | "Late";
  ppe: "Verified" | "Missing" | "Pending";
  assignment: string;
  skillsCompleted: number;
  assessmentAverage: number;
  badge: string;
  supervisorNote: string;
  parentSummary: string;
};

type CropRecord = {
  crop: string;
  variety: string;
  zone: string;
  planted: string;
  harvestWindow: string;
  assignedCrew: string;
  destination: string;
  status: string;
};

type GuestStep = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  narration: string;
  actions: { label: string; screen?: Screen; href?: string }[];
};

const image = (file: string) => `/images/${file}`;

const IMG = {
  portal: image("SAM_0384.JPG"),
  portalAlt: image("SAM_0391.JPG"),
  fallback: image("GrowArea2.jpg"),
  ecosystem: image("ConnectFoodEcosystem_withimages.png"),
  growArea: image("GrowArea2.jpg"),
  growAreaAlt: image("Grow Area.png"),
  compost: image("Compost_ElliottGarden.png"),
  fencing: image("Deer Fencing.png"),
  volunteers: image("Fence_volunteers.png"),
  seeds: image("Seeds_Jubilee Gardens.png"),
  marketplace: image("large (11).jpg"),
  youth: image("large (16).jpg"),
  youth2: image("large (15).jpg"),
  youth3: image("large (12).jpg"),
  flowers: image("culniary_edibleflowers.jpeg"),
  flowers2: image("culniary_edibleflowers2.jpeg"),
  mushrooms: image("culniary_mushrooms.jpeg"),
  partners: image("Partners.png"),
  queens: image("Queens Village.png"),
  wkbn: image("WKBN Interview.png"),
  csu: image("CSU_MParker.png"),
};

const SESSION_KEY = "bff.ecosystem.session";

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

const roleAccess: Record<Role, AccessLevel> = {
  Guest: "public",
  "Youth Workforce Participant": "participant",
  "Parent / Guardian": "family",
  "Supervisor / Staff": "staff",
  Grower: "participant",
  "Marketplace Customer": "public",
  Volunteer: "participant",
  Partner: "family",
  Administrator: "admin",
  "Value-Added Producer": "participant",
};

const protectedScreens: Partial<Record<Screen, AccessLevel[]>> = {
  supervisor: ["staff", "admin"],
  operations: ["staff", "admin"],
  reports: ["staff", "admin", "family"],
  safety: ["staff", "admin"],
  parent: ["family", "staff", "admin"],
};

const youthRecords: YouthRecord[] = [
  {
    participantId: "BFF-2026-001",
    protectedName: "Protected Youth Record",
    crew: "Green Crew",
    ageRange: "14–15",
    attendance: "Present",
    ppe: "Verified",
    assignment: "Compost distribution and grow-zone cleanup",
    skillsCompleted: 14,
    assessmentAverage: 4.4,
    badge: "Safety Ready",
    supervisorNote: "Demonstrated teamwork and followed PPE expectations.",
    parentSummary: "Your youth participated, followed safety steps, and completed assigned farm work.",
  },
  {
    participantId: "BFF-2026-002",
    protectedName: "Protected Youth Record",
    crew: "Market Crew",
    ageRange: "16–18",
    attendance: "Present",
    ppe: "Verified",
    assignment: "Inventory support and marketplace preparation",
    skillsCompleted: 12,
    assessmentAverage: 4.1,
    badge: "Market Helper",
    supervisorNote: "Supported inventory organization and showed initiative.",
    parentSummary: "Your youth helped prepare products for marketplace movement.",
  },
  {
    participantId: "BFF-2026-003",
    protectedName: "Protected Youth Record",
    crew: "Grow Crew",
    ageRange: "14–15",
    attendance: "Late",
    ppe: "Pending",
    assignment: "Irrigation observation and transplant support",
    skillsCompleted: 10,
    assessmentAverage: 3.7,
    badge: "Growing Steward",
    supervisorNote: "Arrived late but rejoined work with support.",
    parentSummary: "Your youth participated after arrival and continued working with the crew.",
  },
];

const cropRecords: CropRecord[] = [
  {
    crop: "Tomatoes",
    variety: "Mixed heirloom and slicer",
    zone: "Grow Zone A",
    planted: "Spring 2026",
    harvestWindow: "Mid-season",
    assignedCrew: "Grow Crew",
    destination: "Marketplace / Community",
    status: "Approaching harvest window",
  },
  {
    crop: "Collards",
    variety: "Greens",
    zone: "Grow Zone B",
    planted: "Spring 2026",
    harvestWindow: "Rolling harvest",
    assignedCrew: "Green Crew",
    destination: "Nutrition education / Marketplace",
    status: "Active",
  },
  {
    crop: "Bubble Babies™",
    variety: "Seedling rolls",
    zone: "Seedling Station",
    planted: "Ongoing",
    harvestWindow: "Transplant ready",
    assignedCrew: "Market Crew",
    destination: "Growers Supply / Customers",
    status: "In production",
  },
];

const guestSteps: GuestStep[] = [
  {
    eyebrow: "Portal",
    title: "Step into the Farm. Experience the wonders of life.",
    subtitle: "Bronson Family Farm begins as an experience before it becomes an explanation.",
    image: IMG.portal,
    narration:
      "Welcome to Bronson Family Farm. Take a moment to look around. You are entering a living ecosystem where food, land, youth, families, growers, and partners are connected.",
    actions: [
      { label: "Go Forward", screen: "guest" },
      { label: "Choose Access", screen: "access" },
    ],
  },
  {
    eyebrow: "Guest Journey",
    title: "Arrive first. Understand later.",
    subtitle: "Guests follow the path, experience the land, then discover the full food ecosystem.",
    image: IMG.portalAlt,
    narration:
      "The guest journey moves slowly. First, people see the land. Then they learn the story. Then they understand how food, work, youth, health, and community move together.",
    actions: [
      { label: "Airport History", screen: "training" },
      { label: "Regenerative Farming", screen: "grower" },
      { label: "Go Forward", screen: "roles" },
    ],
  },
  {
    eyebrow: "History",
    title: "The farm grows at historic Lansdowne Airport.",
    subtitle:
      "Youth can learn place, direction, safety, service, responsibility, and land use through airport history.",
    image: IMG.growAreaAlt,
    narration:
      "This land has a story before the farm. An airport teaches direction, safety, signals, teamwork, and responsibility. The same land that supported flight can now support food, learning, and opportunity.",
    actions: [
      { label: "Youth Workforce", screen: "youth" },
      { label: "Safety Layer", screen: "safety" },
    ],
  },
  {
    eyebrow: "Regenerative Farming",
    title: "We are using regenerative farming to develop the land.",
    subtitle:
      "Regenerative farming means building soil, protecting water, reducing waste, growing food, and leaving land healthier over time.",
    image: IMG.compost,
    narration:
      "Regenerative farming means the farm is not only taking from the land. It is giving back. We build soil, use compost, protect living systems, reduce waste, and grow in a way that helps land become stronger.",
    actions: [
      { label: "Grower Tools", screen: "grower" },
      { label: "Crop Planner", screen: "crop" },
    ],
  },
];

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /david|mark|daniel|alex|male/i.test(v.name)) ||
    voices.find((v) => v.lang === "en-US") ||
    voices[0];

  if (preferred) utterance.voice = preferred;
  utterance.rate = 0.78;
  utterance.pitch = 1.08;
  utterance.volume = 1;
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

function canAccess(session: UserSession | null, screen: Screen) {
  const required = protectedScreens[screen];
  if (!required) return true;
  if (!session) return false;
  return required.includes(session.accessLevel);
}

export default function App() {
  const [screen, setScreenState] = useState<Screen>("portal");
  const [session, setSession] = useState<UserSession | null>(() =>
    safeRead<UserSession | null>(SESSION_KEY, null)
  );

  const setScreen = (next: Screen) => {
    if (!canAccess(session, next)) {
      setScreenState("access");
      return;
    }
    window.speechSynthesis?.cancel();
    setScreenState(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const signIn = (role: Role, displayName = role) => {
    const user: UserSession = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      displayName,
      role,
      accessLevel: roleAccess[role],
      lastSeen: nowLabel(),
    };
    setSession(user);
    safeWrite(SESSION_KEY, user);

    if (role === "Supervisor / Staff" || role === "Administrator") setScreenState("supervisor");
    else if (role === "Parent / Guardian") setScreenState("parent");
    else if (role === "Youth Workforce Participant") setScreenState("youth");
    else if (role === "Grower") setScreenState("grower");
    else setScreenState("roles");
  };

  const signOut = () => {
    window.speechSynthesis?.cancel();
    setSession(null);
    safeWrite<UserSession | null>(SESSION_KEY, null);
    setScreenState("portal");
  };

  return (
    <Shell screen={screen} setScreen={setScreen} session={session} signOut={signOut}>
      {screen === "portal" && <Portal setScreen={setScreen} />}
      {screen === "guest" && <GuestJourney setScreen={setScreen} />}
      {screen === "access" && <Access signIn={signIn} session={session} />}
      {screen === "roles" && <Roles setScreen={setScreen} />}
      {screen === "youth" && <Youth />}
      {screen === "supervisor" && <Supervisor />}
      {screen === "parent" && <Parent />}
      {screen === "grower" && <Grower setScreen={setScreen} />}
      {screen === "crop" && <CropPlanner />}
      {screen === "marketplace" && <Marketplace setScreen={setScreen} />}
      {screen === "operations" && <Operations setScreen={setScreen} />}
      {screen === "reports" && <Reports />}
      {screen === "partners" && <Partners />}
      {screen === "training" && <Training setScreen={setScreen} />}
      {screen === "safety" && <Safety />}
      {screen === "valueAdded" && <ValueAdded setScreen={setScreen} />}
      {screen === "wellness" && <Wellness />}
    </Shell>
  );
}

function Shell({
  children,
  screen,
  setScreen,
  session,
  signOut,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  session: UserSession | null;
  signOut: () => void;
}) {
  const compact = screen === "portal";

  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img
          src={screen === "portal" ? IMG.portal : IMG.growArea}
          alt="Bronson Family Farm"
          className="h-full w-full scale-[1.02] object-cover"
          onError={(event) => {
            event.currentTarget.src = IMG.fallback;
          }}
        />
      </div>

      <div className="fixed inset-0 bg-black/55" />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.82),rgba(0,0,0,.28),rgba(0,0,0,.72)),radial-gradient(circle_at_top_left,rgba(255,255,255,.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(16,185,129,.14),transparent_34%)]" />

      <div className="relative z-10 mx-auto flex h-screen max-w-[1500px] flex-col px-3 py-3 md:px-5">
        {!compact && (
          <>
            <Navigation screen={screen} setScreen={setScreen} />
            <AccessRibbon session={session} signOut={signOut} />
          </>
        )}

        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </main>
  );
}

function Navigation({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  const nav: { label: string; screen: Screen }[] = [
    { label: "Portal", screen: "portal" },
    { label: "Guest", screen: "guest" },
    { label: "Access", screen: "access" },
    { label: "Roles", screen: "roles" },
    { label: "Youth", screen: "youth" },
    { label: "Supervisor", screen: "supervisor" },
    { label: "Parent", screen: "parent" },
    { label: "Grower", screen: "grower" },
    { label: "Crop", screen: "crop" },
    { label: "Market", screen: "marketplace" },
    { label: "Ops", screen: "operations" },
    { label: "Reports", screen: "reports" },
    { label: "Partners", screen: "partners" },
  ];

  return (
    <nav className="mb-2 shrink-0 rounded-[1.15rem] border border-white/10 bg-black/55 p-2 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center gap-1.5">
        <button onClick={() => setScreen("portal")} className="mr-2 min-w-[160px] px-2 text-left">
          <div className="text-[9px] uppercase tracking-[0.28em] text-emerald-100/70">
            Bronson Family Farm
          </div>
          <div className="text-sm font-black leading-tight">Online Ecosystem</div>
        </button>

        {nav.map((item) => (
          <button
            key={item.screen}
            onClick={() => setScreen(item.screen)}
            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-xl transition ${
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

function AccessRibbon({ session, signOut }: { session: UserSession | null; signOut: () => void }) {
  return (
    <div className="mb-2 shrink-0 rounded-[1.15rem] border border-emerald-200/15 bg-black/40 p-2 shadow-[0_20px_70px_rgba(0,0,0,.35)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] text-emerald-100/70">
            Role-Based Access
          </div>
          <div className="mt-0.5 text-xs font-black text-white">
            {session
              ? `${session.displayName} • ${session.role} • ${session.accessLevel} access`
              : "Public access active — sign in by role for protected tools"}
          </div>
        </div>
        {session && (
          <button
            onClick={signOut}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-black hover:bg-white hover:text-black"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}

function Portal({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="grid h-full min-h-0 items-center gap-4 overflow-hidden lg:grid-cols-[1.05fr_.95fr]">
      <div className="max-h-full overflow-y-auto rounded-[2rem] border border-white/10 bg-black/38 p-5 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl md:p-8">
        <div className="text-[11px] uppercase tracking-[0.34em] text-emerald-100/85">
          Bronson Family Farm
        </div>
        <h1 className="mt-4 text-4xl font-black leading-[0.92] tracking-tight md:text-6xl">
          Enter The Ecosystem.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-white/92 md:text-lg">
          Step through the forest gate. Follow the path. Discover how food, people,
          work, learning, and community move together.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setScreen("guest")}
            className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black shadow-2xl transition hover:scale-105"
          >
            Enter The Ecosystem
          </button>
          <button
            onClick={() => setScreen("access")}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-black text-white backdrop-blur-xl transition hover:bg-white hover:text-black"
          >
            Staff / Parent / Program Access
          </button>
        </div>

        <div className="mt-6 grid gap-2 text-xs text-white/75 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">Language Access</div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">15-Second Guided Pace</div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">Stay Here / Go Forward</div>
        </div>
      </div>

      <div className="hidden h-full min-h-0 lg:block">
        <PhotoCard
          title="Step into the Farm"
          subtitle="The first view is a threshold, not a presentation."
          image={IMG.portalAlt}
          height="100%"
          label="Portal"
          cta="Enter"
          onClick={() => setScreen("guest")}
        />
      </div>
    </section>
  );
}

function GuestJourney({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [index, setIndex] = useState(0);
  const [guided, setGuided] = useState(false);
  const current = guestSteps[index];

  const goForward = () => {
    window.speechSynthesis?.cancel();
    if (index >= guestSteps.length - 1) {
      setScreen("roles");
      return;
    }
    setIndex((value) => Math.min(value + 1, guestSteps.length - 1));
  };

  const stayHere = () => {
    setGuided(false);
    window.speechSynthesis?.cancel();
  };

  useEffect(() => {
    if (!guided) return;
    speak(current.narration);
    const timer = window.setTimeout(() => {
      setIndex((value) => {
        if (value >= guestSteps.length - 1) return value;
        return value + 1;
      });
    }, 15000);

    return () => {
      window.clearTimeout(timer);
      window.speechSynthesis?.cancel();
    };
  }, [guided, index]);

  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[.92fr_1.08fr]">
      <div className="flex min-h-0 flex-col justify-center overflow-y-auto rounded-[2rem] border border-white/10 bg-black/55 p-4 shadow-2xl backdrop-blur-2xl md:p-6">
        <div className="text-[11px] uppercase tracking-[0.28em] text-emerald-100/75">
          {current.eyebrow}
        </div>
        <h1 className="mt-3 text-3xl font-black leading-[.96] tracking-tight text-white md:text-5xl">
          {current.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-white/86 md:text-base">
          {current.subtitle}
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            onClick={() => setGuided((value) => !value)}
            className="rounded-full bg-emerald-300 px-4 py-2.5 text-sm font-black text-black"
          >
            {guided ? "Pause Guided Tour" : "Begin Guided Tour"}
          </button>
          <button onClick={stayHere} className="rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-black">
            Stay Here
          </button>
          <button onClick={goForward} className="rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-black">
            Go Forward
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {current.actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                if (action.href) window.open(action.href, "_blank", "noopener,noreferrer");
                if (action.screen) setScreen(action.screen);
              }}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-black hover:bg-white hover:text-black"
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-300 transition-all"
            style={{ width: `${((index + 1) / guestSteps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="min-h-0 overflow-hidden">
        <PhotoCard
          title={current.eyebrow}
          subtitle={current.title}
          image={current.image}
          height="100%"
          label={`Step ${index + 1} of ${guestSteps.length}`}
          cta="Guest"
        />
      </div>
    </section>
  );
}

function Access({
  signIn,
  session,
}: {
  signIn: (role: Role, displayName?: string) => void;
  session: UserSession | null;
}) {
  const [selectedRole, setSelectedRole] = useState<Role>("Supervisor / Staff");
  const [displayName, setDisplayName] = useState("");

  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[.9fr_1.1fr]">
      <Panel eyebrow="Access" title="Choose your role to enter the correct part of the platform.">
        <p className="text-sm leading-6 text-white/80">
          Public guests can explore. Staff, parents, and administrators receive protected access.
          Reports use Participant ID only.
        </p>

        <div className="mt-4 grid gap-3">
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Display name or staff label"
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/50"
          />

          <select
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value as Role)}
            className="rounded-2xl border border-white/10 bg-black/70 px-4 py-2.5 text-white"
          >
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          <button
            onClick={() => signIn(selectedRole, displayName || selectedRole)}
            className="rounded-full bg-emerald-300 px-5 py-3 font-black text-black"
          >
            Enter as {selectedRole}
          </button>
        </div>

        {session && (
          <div className="mt-4 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-sm">
            Current session: <strong>{session.displayName}</strong> — {session.role}
          </div>
        )}
      </Panel>

      <div className="grid min-h-0 gap-3 overflow-y-auto pr-1 md:grid-cols-2">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => signIn(role, role)}
            className="rounded-[1.35rem] border border-white/10 bg-black/45 p-4 text-left shadow-xl backdrop-blur-xl transition hover:bg-emerald-300 hover:text-black"
          >
            <div className="text-base font-black">{role}</div>
            <div className="mt-1 text-xs opacity-85">{roleAccess[role]} access</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function Roles({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const items: { title: string; text: string; image: string; screen: Screen }[] = [
    { title: "Guest", text: "Public journey, story, airport history, and regenerative farming.", image: IMG.portalAlt, screen: "guest" },
    { title: "Youth Workforce", text: "Daily assignments, skills, badges, reflections, and learning.", image: IMG.youth, screen: "youth" },
    { title: "Supervisor", text: "Attendance, PPE, assessments, notes, safety, and reports.", image: IMG.fencing, screen: "supervisor" },
    { title: "Parent", text: "Approved progress, attendance, badges, calendar, and summaries.", image: IMG.queens, screen: "parent" },
    { title: "Grower", text: "Planning, soil, supplies, regenerative education, and market access.", image: IMG.growArea, screen: "grower" },
    { title: "Crop Planner", text: "Planting, harvest windows, crew assignments, and destinations.", image: IMG.growAreaAlt, screen: "crop" },
    { title: "Marketplace", text: "Food movement, Bubble Babies™, inventory, and customers.", image: IMG.marketplace, screen: "marketplace" },
    { title: "Partners", text: "Infrastructure, investment, sponsorship, and community support.", image: IMG.partners, screen: "partners" },
  ];

  return (
    <section className="grid h-full min-h-0 gap-3 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <PhotoCard
          key={item.title}
          title={item.title}
          subtitle={item.text}
          image={item.image}
          height="255px"
          label="Pathway"
          cta="Open"
          onClick={() => setScreen(item.screen)}
        />
      ))}
    </section>
  );
}

function Youth() {
  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[1fr_1fr]">
      <Panel eyebrow="Youth Workforce" title="Today’s youth dashboard">
        <div className="grid gap-3">
          <Metric label="Schedule" value="Monday–Friday • 8 AM–2 PM" />
          <Metric label="Today’s Goal" value="Learn how farm work connects to food access." />
          <Metric label="Assignment" value="Check in, PPE, crew station, task completion, reflection." />
        </div>
      </Panel>

      <Panel eyebrow="Progress" title="Youth progress view">
        <div className="grid gap-3">
          {youthRecords.map((item) => (
            <div key={item.participantId} className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-100/70">
                {item.participantId}
              </div>
              <div className="mt-1 text-lg font-black">{item.badge}</div>
              <div className="mt-1 text-xs text-white/75">
                {item.crew} • Skills Completed: {item.skillsCompleted}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Supervisor() {
  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden xl:grid-cols-[1.05fr_.95fr]">
      <Panel eyebrow="Supervisor / Staff" title="Phone-first daily supervision dashboard">
        <div className="grid gap-3 md:grid-cols-2">
          {["QR Check-In", "Attendance", "PPE Verification", "Daily Assignment", "Observation Notes", "Incident Report", "Assessment", "Progress Badge"].map((item) => (
            <button key={item} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left text-sm font-black hover:bg-emerald-300 hover:text-black">
              {item}
            </button>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Protected Youth Records" title="Names stay inside protected staff view only.">
        <div className="grid gap-3">
          {youthRecords.map((item) => (
            <div key={item.participantId} className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-100/70">
                {item.participantId}
              </div>
              <div className="mt-1 text-base font-black">{item.protectedName}</div>
              <div className="mt-1 text-xs text-white/78">
                {item.crew} • {item.attendance} • PPE: {item.ppe}
              </div>
              <div className="mt-2 text-xs text-white/70">{item.supervisorNote}</div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Parent() {
  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[.95fr_1.05fr]">
      <Panel eyebrow="Parent / Guardian Portal" title="Approved family visibility">
        <p className="text-sm leading-6 text-white/80">
          Parents see attendance, progress, badges, announcements, and approved summaries.
          Internal staff notes remain protected.
        </p>
        <div className="mt-4 grid gap-3">
          <Metric label="Program Dates" value="June 8 – August 28, 2026" />
          <Metric label="Daily Time" value="Monday–Friday • 8 AM–2 PM" />
          <Metric label="Contact" value="330-275-1604" />
        </div>
      </Panel>

      <Panel eyebrow="Progress Summaries" title="Parent-safe summaries">
        <div className="grid gap-3">
          {youthRecords.map((item) => (
            <div key={item.participantId} className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <div className="font-black">{item.participantId}</div>
              <div className="mt-1 text-xs text-white/75">
                {item.attendance} • {item.badge} • {item.skillsCompleted} skills completed
              </div>
              <div className="mt-2 text-xs text-white/70">{item.parentSummary}</div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Grower({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[1fr_1fr]">
      <PhotoCard
        title="Regenerative Farming"
        subtitle="Build soil, protect water, reduce waste, and leave the land healthier over time."
        image={IMG.compost}
        height="100%"
        label="Grower Education"
        cta="Learn"
        onClick={() => setScreen("training")}
      />

      <Panel eyebrow="Grower Tools" title="Growers need timing, supplies, weather, and market connection.">
        <ActionGrid
          items={[
            { title: "Crop Planner", text: "Planting windows, harvest timing, zones, and crew assignments.", screen: "crop" },
            { title: "Marketplace", text: "Connect harvest and products to customers.", screen: "marketplace" },
            { title: "Weather Channel", text: "Open hourly Youngstown weather.", href: "https://www.wunderground.com/hourly/us/oh/youngstown" },
            { title: "Seedtime", text: "Planning, calendar, and grow journal reference.", href: "https://www.seedtime.us/" },
          ]}
          setScreen={setScreen}
        />
      </Panel>
    </section>
  );
}

function CropPlanner() {
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <Panel eyebrow="Crop Planner" title="Crop planning connects field work to youth assignments and marketplace movement.">
        <div className="overflow-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead className="bg-white/10 text-[10px] uppercase tracking-[0.18em] text-emerald-100/80">
              <tr>
                <th className="p-3">Crop</th>
                <th className="p-3">Variety</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Planted</th>
                <th className="p-3">Harvest Window</th>
                <th className="p-3">Crew</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {cropRecords.map((row) => (
                <tr key={`${row.crop}-${row.zone}`} className="border-t border-white/10">
                  <td className="p-3 font-black">{row.crop}</td>
                  <td className="p-3">{row.variety}</td>
                  <td className="p-3">{row.zone}</td>
                  <td className="p-3">{row.planted}</td>
                  <td className="p-3">{row.harvestWindow}</td>
                  <td className="p-3">{row.assignedCrew}</td>
                  <td className="p-3">{row.destination}</td>
                  <td className="p-3">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}

function Marketplace({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[1fr_1fr]">
      <PhotoCard
        title="Marketplace Movement"
        subtitle="Produce, seedlings, Bubble Babies™, value-added products, and grower supply activity move through this layer."
        image={IMG.marketplace}
        height="100%"
        label="Marketplace"
        cta="Shop"
        onClick={() => window.open("https://grownby.com/farms/bronson-family-farm/shop", "_blank", "noopener,noreferrer")}
      />

      <Panel eyebrow="Marketplace" title="Food access becomes operational here.">
        <ActionGrid
          items={[
            { title: "Open GrownBy Store", text: "Shop Bronson Family Farm online.", href: "https://grownby.com/farms/bronson-family-farm/shop" },
            { title: "Crop Planner", text: "Review what is growing and where it is going.", screen: "crop" },
            { title: "Value-Added Producer", text: "Packaging, demos, edible flowers, mushrooms, and product education.", screen: "valueAdded" },
            { title: "Wellness / Nutrition", text: "Recipes, education, health, and family use.", screen: "wellness" },
          ]}
          setScreen={setScreen}
        />
      </Panel>
    </section>
  );
}

function Operations({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[1fr_1fr]">
      <Panel eyebrow="Operations Control" title="Daily program operations">
        <div className="grid gap-3 md:grid-cols-2">
          {["QR Check-In", "Daily Announcements", "Weather Alert", "Crew Assignments", "Harvest Log", "Volunteer Log", "Supervisor Reports", "Emergency Notes"].map((item) => (
            <button key={item} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left text-sm font-black hover:bg-emerald-300 hover:text-black">
              {item}
            </button>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Live Channels" title="Open external live supports">
        <ActionGrid
          items={[
            { title: "Weather Underground", text: "Hourly Youngstown weather.", href: "https://www.wunderground.com/hourly/us/oh/youngstown" },
            { title: "AccuWeather", text: "Youngstown forecast reference.", href: "https://www.accuweather.com/en/us/youngstown/44503/weather-forecast/350128" },
            { title: "Farmers’ Almanac", text: "Seasonal grow context.", href: "https://www.farmersalmanac.com/" },
            { title: "Reports", text: "Open privacy-safe reporting.", screen: "reports" },
          ]}
          setScreen={setScreen}
        />
      </Panel>
    </section>
  );
}

function Reports() {
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <Panel eyebrow="Reports" title="Privacy-safe reporting — Participant ID only">
        <div className="mb-3 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-3 text-xs text-amber-50">
          Reporting rule: do not use youth names in public reports, partner reports, grant reports,
          dashboards, or demo views. Use Participant ID only.
        </div>

        <div className="overflow-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-white/10 text-[10px] uppercase tracking-[0.18em] text-emerald-100/80">
              <tr>
                <th className="p-3">Participant ID</th>
                <th className="p-3">Crew</th>
                <th className="p-3">Age Range</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Skills</th>
                <th className="p-3">Assessment Avg.</th>
                <th className="p-3">Badge</th>
              </tr>
            </thead>
            <tbody>
              {youthRecords.map((row) => (
                <tr key={row.participantId} className="border-t border-white/10">
                  <td className="p-3 font-black">{row.participantId}</td>
                  <td className="p-3">{row.crew}</td>
                  <td className="p-3">{row.ageRange}</td>
                  <td className="p-3">{row.attendance}</td>
                  <td className="p-3">{row.skillsCompleted}</td>
                  <td className="p-3">{row.assessmentAverage}</td>
                  <td className="p-3">{row.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}

function Partners() {
  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[1fr_1fr]">
      <PhotoCard
        title="Partner Infrastructure"
        subtitle="Partners support the infrastructure that lets the ecosystem function."
        image={IMG.partners}
        height="100%"
        label="Partner"
        cta="Impact"
      />

      <Panel eyebrow="Partner Pathway" title="Specific support areas">
        <div className="grid gap-3">
          {["Water access", "Solar equipment", "Fencing", "Storage", "Wash station", "Youth workforce support", "Tools and supplies", "Transportation"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm font-black">
              {item}
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Training({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[1fr_1fr]">
      <Panel eyebrow="Airport History / Youth Education" title="Youth-accessible place-based learning">
        <p className="text-sm leading-6 text-white/82">
          Lansdowne Airport can help youth understand direction, signals, safety,
          responsibility, service, aviation, military connection, and land reuse.
        </p>
        <div className="mt-4 grid gap-3">
          <Metric label="Direction" value="Learning where you are and where you are going." />
          <Metric label="Safety" value="Signals, boundaries, rules, and responsibility." />
          <Metric label="Service" value="Military and aviation history connect discipline and purpose." />
        </div>
      </Panel>

      <PhotoCard
        title="Historic Land, New Purpose"
        subtitle="The same land that carried aviation history now supports food, youth learning, and community renewal."
        image={IMG.growAreaAlt}
        height="100%"
        label="History"
        cta="Learn"
        onClick={() => setScreen("guest")}
      />
    </section>
  );
}

function Safety() {
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <Panel eyebrow="Youth Protection" title="Staff access protects youth">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "No random public access to youth records",
            "Supervisor / Staff access required",
            "Parent sees only approved youth summary",
            "Reports use Participant ID only",
            "Incident notes remain staff/admin protected",
            "Public demo uses aggregate data only",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm font-black">
              {item}
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function ValueAdded({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-3">
      <PhotoCard title="Edible Flowers" subtitle="Product education and culinary creativity." image={IMG.flowers} height="100%" label="Value-Added" cta="Product" />
      <PhotoCard title="Mushrooms" subtitle="Specialty product education and market opportunity." image={IMG.mushrooms} height="100%" label="Value-Added" cta="Product" />
      <Panel eyebrow="Value-Added" title="Turn farm products into demonstrations, packaging, and enterprise.">
        <ActionGrid
          items={[
            { title: "Marketplace", text: "Move products to customers.", screen: "marketplace" },
            { title: "Reports", text: "Track product and impact reporting.", screen: "reports" },
          ]}
          setScreen={setScreen}
        />
      </Panel>
    </section>
  );
}

function Wellness() {
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <Panel eyebrow="Wellness / Nutrition" title="Food is health, culture, learning, and confidence.">
        <div className="grid gap-3 md:grid-cols-3">
          <Metric label="Nutrition" value="Families learn how to use seasonal produce." />
          <Metric label="Mental Wellness" value="Gardening supports calm, connection, belonging, and purpose." />
          <Metric label="Community" value="Food access strengthens families and neighborhoods." />
        </div>
      </Panel>
    </section>
  );
}

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="h-full min-h-0 overflow-y-auto rounded-[2rem] border border-white/10 bg-black/55 p-4 shadow-[0_28px_80px_rgba(0,0,0,.42)] backdrop-blur-2xl md:p-5">
      <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-100/70">{eyebrow}</div>
      <h1 className="mt-2 text-2xl font-black leading-tight md:text-3xl">{title}</h1>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
      <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-100/70">{label}</div>
      <div className="mt-1 text-sm font-black md:text-base">{value}</div>
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
      className={`group relative min-h-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-[0_28px_70px_rgba(0,0,0,.52)] transition duration-500 ${
        onClick ? "cursor-pointer hover:scale-[1.01] hover:border-emerald-200/40" : ""
      }`}
      style={{ height }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105"
        onError={(event) => {
          event.currentTarget.src = IMG.fallback;
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

      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="text-xl font-black leading-tight drop-shadow-2xl md:text-2xl">{title}</div>
        <div className="mt-1 max-w-xl text-xs leading-5 text-emerald-50/90 md:text-sm">{subtitle}</div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="block h-full w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

function ActionGrid({
  items,
  setScreen,
}: {
  items: { title: string; text: string; screen?: Screen; href?: string }[];
  setScreen: (screen: Screen) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <button
          key={item.title}
          onClick={() => {
            if (item.href) window.open(item.href, "_blank", "noopener,noreferrer");
            if (item.screen) setScreen(item.screen);
          }}
          className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left transition hover:bg-emerald-300 hover:text-black"
        >
          <div className="text-sm font-black md:text-base">{item.title}</div>
          <div className="mt-1 text-xs leading-5 opacity-90">{item.text}</div>
        </button>
      ))}
    </div>
  );
}
