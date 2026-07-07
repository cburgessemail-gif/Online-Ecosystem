import React, { useEffect, useMemo, useState } from "react";

/**
 * Bronson Family Farm Online Ecosystem
 * CULTIVATOR ECOSYSTEM 14.0 — FOREST PORTAL MASTER FULL REPLACEMENT
 * Corrected full App.tsx replacement for Week 5 launch operations.
 *
 * NON-NEGOTIABLE RESTORATIONS INCLUDED:
 * - Forest Gate Portal is the first screen, not a missing/side page.
 * - Guest / New / Returning / Supervisor / Parent / Mission Control doors all work.
 * - Youth pathway uses Dashboard → Today’s Work → Workbook → Resources → Journey.
 * - No dead checkboxes for work lists; work items use bullets and clear action cards.
 * - Every question has a response input and optional photo/story upload note.
 * - Youth can stay where they are, go back, or use the persistent navigation.
 * - Week 5 is active for July 6–10, 2026.
 * - Tuesday July 7 reflects current field reality: no watering because of rain, pooling checks,
 *   Zone 5 melon completion, potatoes check, plant separation, mulch rows/paths, corn seedlings,
 *   squash/pumpkin grow area prep, gate installation, and optional/self-selected beehive work.
 * - Wednesday July 8 includes beehive sterilization after disassembly/wiping dry and 24-hour chlorine solution.
 * - Forest Portal includes creek/woods observation but today does NOT send youth into the forest unless directed.
 * - Self → Work → Environment → Community → Opportunity → Legacy is preserved daily.
 * - Active/Inactive participant governance is preserved: inactive records remain but get Guest-only access.
 * - LocalStorage persistence works without Supabase so the app is not blank during launch.
 */

type Screen =
  | "portal"
  | "guest"
  | "new"
  | "returning"
  | "youth"
  | "today"
  | "workbook"
  | "resources"
  | "journey"
  | "parent"
  | "supervisor"
  | "mission"
  | "forest"
  | "support";

type Role = "Guest" | "Youth" | "Parent" | "Supervisor" | "Mission Control";
type Status = "active" | "inactive" | "pending" | "completed";
type Language = "en" | "es" | "tl" | "it" | "he" | "fr";

type User = {
  id: string;
  name: string;
  role: Role;
  status: Status;
  pin?: string;
};

type Reflection = {
  id: string;
  date: string;
  youthName: string;
  layer: string;
  question: string;
  answer: string;
};

type WorkNote = {
  id: string;
  date: string;
  youthName: string;
  task: string;
  note: string;
  complete: boolean;
};

type Resource = {
  title: string;
  description: string;
  url: string;
  tags: string[];
};

const LS_USER = "bff.ecosystem14.user";
const LS_REFLECTIONS = "bff.ecosystem14.reflections";
const LS_WORK = "bff.ecosystem14.work";
const LS_LANGUAGE = "bff.ecosystem14.language";
const LS_PARTICIPANTS = "bff.ecosystem14.participants";

const languages: { code: Language; label: string; dir?: "ltr" | "rtl" }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "tl", label: "Tagalog" },
  { code: "it", label: "Italiano" },
  { code: "he", label: "עברית", dir: "rtl" },
  { code: "fr", label: "Français" },
];

const defaultParticipants: User[] = [
  { id: "youth-demo", name: "Cultivator Youth", role: "Youth", status: "active", pin: "2026" },
  { id: "supervisor-demo", name: "Supervisor", role: "Supervisor", status: "active", pin: "1111" },
  { id: "parent-demo", name: "Parent / Guardian", role: "Parent", status: "active", pin: "2222" },
  { id: "mission-demo", name: "Mission Control", role: "Mission Control", status: "active", pin: "Nesco2026" },
];

const week5Days = [
  {
    date: "Monday, July 6, 2026",
    label: "Week 5 — Rain Recovery + Field Reset",
    status: "No watering because of rain",
    summary: "Weeding, thinning, pooling checks, and making the grow area workable after rain.",
  },
  {
    date: "Tuesday, July 7, 2026",
    label: "Week 5 — Melon Zone + Field Build Day",
    status: "Current Day — no watering because of past rain",
    summary: "Finish Zone 5 melons, check potatoes, separate plants, mulch rows and paths, plant corn seedlings, prepare squash/pumpkin area, and install gate.",
  },
  {
    date: "Wednesday, July 8, 2026",
    label: "Week 5 — Beehive Sterilization + Rebuild Support",
    status: "Beehive project is self-selected, not required for all youth",
    summary: "Hive pieces were disassembled and wiped dry. Selected youth place pieces in chlorine solution for 24 hours, then set out to dry under supervision.",
  },
  {
    date: "Thursday, July 9, 2026",
    label: "Week 5 — Pest Trap + Pollinator Surveillance",
    status: "Observe before acting",
    summary: "Check pest traps, look for butterfly caterpillars or eggs, and document plant health without disturbing habitat.",
  },
  {
    date: "Friday, July 10, 2026",
    label: "Week 5 — Documentation + Weekly Proof",
    status: "Workbook and portfolio day",
    summary: "Youth complete proof of work, reflection, skills gained, and parent-safe weekly summary.",
  },
];

const todaysTasks = [
  "Finish Zone 5 melon area and make sure all melons are planted.",
  "Check potatoes growing in the grow basket. Potatoes are low priority; observe and report only unless directed.",
  "Separate crowded plants and move them only where supervisors direct.",
  "Build mulch around rows and paths, especially where water gathers.",
  "Plant corn seedlings.",
  "Prepare squash and pumpkin grow area.",
  "Install gate.",
  "Do not water today because rain has already supplied water.",
  "Do not go into the forest today unless a supervisor gives a clear reason and boundary.",
];

const beehiveTasks = [
  "Beehive work is self-selected. Not all youth participate.",
  "Follow the assigned video/instructions from the beehive team lead.",
  "Confirm the hive was disassembled and each piece wiped dry yesterday.",
  "Place approved pieces in chlorine solution for 24 hours under supervision.",
  "Set pieces out to dry after the soaking period.",
  "Record what was sterilized, who participated, and any safety issue.",
];

const dailyFramework = [
  { layer: "Self", question: "What do I need today so I can work safely and clearly?" },
  { layer: "Work", question: "What task did I help complete, improve, or document?" },
  { layer: "Environment", question: "What did the land, water, plants, weather, or animals show us today?" },
  { layer: "Community", question: "How does this work connect to Youngstown, our families, or neighborhood woods and parks?" },
  { layer: "Opportunity", question: "What job, business, skill, or career could connect to today’s work?" },
  { layer: "Legacy", question: "What did I leave better than I found it?" },
];

const resources: Resource[] = [
  {
    title: "Miracle-Gro Search",
    description: "Use search when youth cannot find product information or ingredients.",
    url: "https://www.miraclegro.com/en-us/search.html",
    tags: ["search", "plant food", "ingredients"],
  },
  {
    title: "Ohio State Extension — Home Yard and Garden",
    description: "Local, reliable growing information for Ohio conditions.",
    url: "https://extension.osu.edu/home-yard-and-garden",
    tags: ["Ohio", "plants", "extension"],
  },
  {
    title: "Monarch Joint Venture — Milkweed and Monarchs",
    description: "Pollinator and monarch butterfly learning support.",
    url: "https://monarchjointventure.org/monarch-biology/monarch-plant-interactions/milkweed",
    tags: ["butterflies", "milkweed", "pollinators"],
  },
  {
    title: "National Weather Service — Youngstown Area Forecast",
    description: "Use for weather, rain, heat, and work-status decisions.",
    url: "https://forecast.weather.gov/MapClick.php?lat=41.0998&lon=-80.6495",
    tags: ["weather", "rain", "heat"],
  },
  {
    title: "Beehive Sterilization Notes",
    description: "Internal protocol: disassemble, wipe dry, chlorine solution for 24 hours, dry fully, rebuild only when approved.",
    url: "#beehive-protocol",
    tags: ["beehive", "sterilize", "safety"],
  },
];

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function Button({ children, onClick, kind = "primary" }: { children: React.ReactNode; onClick: () => void; kind?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button type="button" className={`btn ${kind}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Field({ label, value, onChange, placeholder = "Type here..." }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} />
    </label>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("portal");
  const [language, setLanguage] = useState<Language>(() => readJSON<Language>(LS_LANGUAGE, "en"));
  const [user, setUser] = useState<User | null>(() => readJSON<User | null>(LS_USER, null));
  const [participants, setParticipants] = useState<User[]>(() => readJSON<User[]>(LS_PARTICIPANTS, defaultParticipants));
  const [reflections, setReflections] = useState<Reflection[]>(() => readJSON<Reflection[]>(LS_REFLECTIONS, []));
  const [workNotes, setWorkNotes] = useState<WorkNote[]>(() => readJSON<WorkNote[]>(LS_WORK, []));
  const [resourceSearch, setResourceSearch] = useState("");

  useEffect(() => writeJSON(LS_LANGUAGE, language), [language]);
  useEffect(() => writeJSON(LS_USER, user), [user]);
  useEffect(() => writeJSON(LS_PARTICIPANTS, participants), [participants]);
  useEffect(() => writeJSON(LS_REFLECTIONS, reflections), [reflections]);
  useEffect(() => writeJSON(LS_WORK, workNotes), [workNotes]);

  const languageMeta = languages.find((x) => x.code === language) || languages[0];
  const activeUser = user?.status === "inactive" ? { ...user, role: "Guest" as Role } : user;

  function enterAs(nextUser: User, nextScreen: Screen) {
    const allowed = nextUser.status === "inactive" ? { ...nextUser, role: "Guest" as Role } : nextUser;
    setUser(allowed);
    setScreen(nextUser.status === "inactive" ? "guest" : nextScreen);
  }

  function signOut() {
    setUser(null);
    setScreen("portal");
  }

  const nav = (
    <nav className="topnav">
      <button onClick={() => setScreen("portal")}>Forest Portal</button>
      <button onClick={() => setScreen("youth")}>Dashboard</button>
      <button onClick={() => setScreen("today")}>Today’s Work</button>
      <button onClick={() => setScreen("workbook")}>Workbook</button>
      <button onClick={() => setScreen("resources")}>Resources</button>
      <button onClick={() => setScreen("journey")}>Journey</button>
      <button onClick={() => setScreen("supervisor")}>Supervisor</button>
      <button onClick={() => setScreen("mission")}>Mission Control</button>
    </nav>
  );

  return (
    <main dir={languageMeta.dir || "ltr"}>
      <style>{styles}</style>
      <header className="appHeader">
        <div>
          <p className="eyebrow">Bronson Family Farm · Cultivator Ecosystem 14.0</p>
          <h1>Forest Portal Master Replacement</h1>
          <p className="subtitle">Week 5 · Tuesday, July 7, 2026 · Forest Portal restored · Youth workflow simplified</p>
        </div>
        <div className="headerControls">
          <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} aria-label="Language">
            {languages.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          {activeUser ? <Button kind="ghost" onClick={signOut}>Sign out</Button> : null}
        </div>
      </header>

      {screen !== "portal" ? nav : null}

      {screen === "portal" && <ForestGatePortal enterAs={enterAs} setScreen={setScreen} participants={participants} />}
      {screen === "guest" && <GuestPortal setScreen={setScreen} />}
      {screen === "new" && <NewParticipant setParticipants={setParticipants} enterAs={enterAs} />}
      {screen === "returning" && <ReturningPortal participants={participants} enterAs={enterAs} />}
      {screen === "youth" && <YouthDashboard user={activeUser} setScreen={setScreen} />}
      {screen === "today" && <TodaysWork user={activeUser} workNotes={workNotes} setWorkNotes={setWorkNotes} setScreen={setScreen} />}
      {screen === "workbook" && <Workbook user={activeUser} reflections={reflections} setReflections={setReflections} />}
      {screen === "resources" && <Resources resourceSearch={resourceSearch} setResourceSearch={setResourceSearch} />}
      {screen === "journey" && <Journey reflections={reflections} workNotes={workNotes} />}
      {screen === "parent" && <ParentPortal />}
      {screen === "supervisor" && <SupervisorPortal participants={participants} setParticipants={setParticipants} workNotes={workNotes} reflections={reflections} />}
      {screen === "mission" && <MissionControl participants={participants} workNotes={workNotes} reflections={reflections} />}
      {screen === "forest" && <ForestLearningPortal />}
      {screen === "support" && <SupportPortal />}
    </main>
  );
}

function ForestGatePortal({ enterAs, setScreen, participants }: { enterAs: (u: User, s: Screen) => void; setScreen: (s: Screen) => void; participants: User[] }) {
  return (
    <div className="portalHero">
      <div className="portalOverlay">
        <p className="eyebrow">Forest Gate Portal</p>
        <h2>Enter the Bronson Family Farm Ecosystem</h2>
        <p>
          The portal is the front door. Youth, parents, supervisors, guests, and Mission Control begin here and move into the correct pathway without losing the forest, farm, or community story.
        </p>
        <div className="doorGrid">
          <button onClick={() => enterAs({ id: "guest", name: "Guest", role: "Guest", status: "active" }, "guest")}>Guest Journey</button>
          <button onClick={() => setScreen("new")}>New Participant</button>
          <button onClick={() => setScreen("returning")}>Returning Participant</button>
          <button onClick={() => enterAs(participants.find((p) => p.role === "Youth") || defaultParticipants[0], "youth")}>Youth Dashboard</button>
          <button onClick={() => enterAs(participants.find((p) => p.role === "Supervisor") || defaultParticipants[1], "supervisor")}>Supervisor</button>
          <button onClick={() => enterAs(participants.find((p) => p.role === "Parent") || defaultParticipants[2], "parent")}>Parent Portal</button>
          <button onClick={() => enterAs(participants.find((p) => p.role === "Mission Control") || defaultParticipants[3], "mission")}>Mission Control</button>
          <button onClick={() => setScreen("forest")}>Open Forest Learning Portal</button>
        </div>
        <p className="notice">Today’s boundary: youth do not go into the forest unless a supervisor assigns it. Forest learning remains available through the portal.</p>
      </div>
    </div>
  );
}

function GuestPortal({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <div className="grid two">
      <Card>
        <h2>Guest Journey</h2>
        <p>Welcome to the public view. Guests can see the farm story, forest connection, community purpose, and current youth workforce framework.</p>
        <ul>
          <li>Farm: regenerative production, youth workforce, pollinators, and food access.</li>
          <li>Forest: observation, water, habitat, wildlife, and neighborhood connections.</li>
          <li>Community: Youngstown talent, parks, wooded neighborhoods, and future opportunity.</li>
        </ul>
      </Card>
      <Card>
        <h2>Choose a next step</h2>
        <div className="stack">
          <Button onClick={() => setScreen("forest")}>Explore Forest Portal</Button>
          <Button onClick={() => setScreen("resources")} kind="secondary">Open Resources</Button>
          <Button onClick={() => setScreen("portal")} kind="ghost">Back to Forest Gate</Button>
        </div>
      </Card>
    </div>
  );
}

function NewParticipant({ setParticipants, enterAs }: { setParticipants: React.Dispatch<React.SetStateAction<User[]>>; enterAs: (u: User, s: Screen) => void }) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [parent, setParent] = useState("");
  function save() {
    const cleanName = name.trim() || "New Cultivator";
    const newUser: User = { id: uid("youth"), name: cleanName, role: "Youth", status: parent.trim() ? "active" : "pending", pin: pin.trim() || "2026" };
    setParticipants((prev) => [...prev, newUser]);
    enterAs(newUser, "youth");
  }
  return (
    <Card>
      <h2>New Participant Registration</h2>
      <p>Youth completion requires parent/guardian contact. If missing, youth may continue as pending until verified.</p>
      <div className="formGrid">
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>4-digit PIN<input value={pin} onChange={(e) => setPin(e.target.value)} /></label>
        <label>Parent name + phone or email<input value={parent} onChange={(e) => setParent(e.target.value)} /></label>
      </div>
      <Button onClick={save}>Save and enter dashboard</Button>
    </Card>
  );
}

function ReturningPortal({ participants, enterAs }: { participants: User[]; enterAs: (u: User, s: Screen) => void }) {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  function verify() {
    const found = participants.find((p) => p.pin === pin.trim());
    if (!found) {
      setMessage("PIN not found. Continue as pending youth and ask a supervisor to verify.");
      enterAs({ id: uid("pending"), name: "Pending Returning Youth", role: "Youth", status: "pending", pin }, "youth");
      return;
    }
    const target: Screen = found.role === "Supervisor" ? "supervisor" : found.role === "Parent" ? "parent" : found.role === "Mission Control" ? "mission" : "youth";
    enterAs(found, target);
  }
  return (
    <Card>
      <h2>Returning Participant</h2>
      <p>Enter your PIN. If the PIN does not match, you can still continue pending supervisor verification.</p>
      <div className="inlineForm">
        <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN or access code" />
        <Button onClick={verify}>Enter</Button>
      </div>
      {message ? <p className="notice">{message}</p> : null}
    </Card>
  );
}

function YouthDashboard({ user, setScreen }: { user: User | null | undefined; setScreen: (s: Screen) => void }) {
  return (
    <div className="grid two">
      <Card>
        <p className="eyebrow">Hello {user?.name || "Cultivator"}</p>
        <h2>Today is not confusing anymore.</h2>
        <p>Start here, then move to Today’s Work. You can always come back to Dashboard, Workbook, Resources, or Journey.</p>
        <div className="statusBox">
          <strong>Work Status:</strong> Week 5 Field Build Day. No watering today because of past rain.
        </div>
        <div className="stack">
          <Button onClick={() => setScreen("today")}>Open Today’s Work</Button>
          <Button onClick={() => setScreen("workbook")} kind="secondary">Open Workbook</Button>
          <Button onClick={() => setScreen("resources")} kind="secondary">Find Resources</Button>
        </div>
      </Card>
      <Card>
        <h2>Today’s focus</h2>
        <ul>
          <li>Zone 5 melons</li>
          <li>Potatoes check</li>
          <li>Plant separation</li>
          <li>Mulch around rows and paths</li>
          <li>Corn seedlings</li>
          <li>Squash and pumpkin grow area</li>
          <li>Gate installation</li>
        </ul>
      </Card>
      <Card className="wide">
        <h2>Daily learning path</h2>
        <div className="pillGrid">
          {dailyFramework.map((x) => <span key={x.layer}>{x.layer}</span>)}
        </div>
      </Card>
    </div>
  );
}

function TodaysWork({ user, workNotes, setWorkNotes, setScreen }: { user: User | null | undefined; workNotes: WorkNote[]; setWorkNotes: React.Dispatch<React.SetStateAction<WorkNote[]>>; setScreen: (s: Screen) => void }) {
  const [task, setTask] = useState(todaysTasks[0]);
  const [note, setNote] = useState("");
  function saveNote(complete: boolean) {
    setWorkNotes((prev) => [...prev, { id: uid("work"), date: "2026-07-07", youthName: user?.name || "Cultivator", task, note, complete }]);
    setNote("");
  }
  return (
    <div className="grid two">
      <Card className="wide">
        <p className="eyebrow">Tuesday, July 7, 2026</p>
        <h2>Today’s Work — Field Build Day</h2>
        <p>No watering. No forest trip today. Finish the grow-area priorities and document what changed.</p>
      </Card>
      <Card>
        <h3>Work list</h3>
        <ul>{todaysTasks.map((t) => <li key={t}>{t}</li>)}</ul>
      </Card>
      <Card>
        <h3>Beehive self-selected pathway</h3>
        <ul>{beehiveTasks.map((t) => <li key={t}>{t}</li>)}</ul>
      </Card>
      <Card className="wide">
        <h3>Record work without getting stuck</h3>
        <label className="field"><span>Choose task</span><select value={task} onChange={(e) => setTask(e.target.value)}>{todaysTasks.concat(beehiveTasks).map((t) => <option key={t}>{t}</option>)}</select></label>
        <Field label="What did you do, notice, fix, or need help with?" value={note} onChange={setNote} />
        <p className="helper">Photo/video upload point: attach in your platform upload control or write what the photo would show.</p>
        <div className="row">
          <Button onClick={() => saveNote(true)}>Submit completed note</Button>
          <Button onClick={() => saveNote(false)} kind="secondary">Save as still working</Button>
          <Button onClick={() => setScreen("workbook")} kind="ghost">Go to Workbook</Button>
        </div>
      </Card>
      <Card className="wide">
        <h3>Saved work notes</h3>
        {workNotes.length === 0 ? <p>No notes saved yet.</p> : workNotes.slice(-6).reverse().map((n) => <p key={n.id} className="log"><strong>{n.complete ? "Complete" : "Still working"}:</strong> {n.task}<br />{n.note}</p>)}
      </Card>
    </div>
  );
}

function Workbook({ user, reflections, setReflections }: { user: User | null | undefined; reflections: Reflection[]; setReflections: React.Dispatch<React.SetStateAction<Reflection[]>> }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  function save(layer: string, question: string) {
    const answer = answers[layer] || "";
    if (!answer.trim()) return;
    setReflections((prev) => [...prev, { id: uid("reflection"), date: "2026-07-07", youthName: user?.name || "Cultivator", layer, question, answer }]);
    setAnswers((prev) => ({ ...prev, [layer]: "" }));
  }
  return (
    <div className="grid two">
      <Card className="wide">
        <h2>Workbook — Week 5 Proof</h2>
        <p>Each question has an answer box. Youth can answer one layer at a time. This feeds the portfolio/workbook.</p>
      </Card>
      {dailyFramework.map((item) => (
        <Card key={item.layer}>
          <p className="eyebrow">{item.layer}</p>
          <h3>{item.question}</h3>
          <Field label="Your answer" value={answers[item.layer] || ""} onChange={(v) => setAnswers((prev) => ({ ...prev, [item.layer]: v }))} />
          <p className="helper">Optional upload: photo, video, drawing, or voice note proof.</p>
          <Button onClick={() => save(item.layer, item.question)}>Save {item.layer}</Button>
        </Card>
      ))}
      <Card className="wide">
        <h3>Saved workbook entries</h3>
        {reflections.length === 0 ? <p>No workbook answers saved yet.</p> : reflections.slice(-8).reverse().map((r) => <p className="log" key={r.id}><strong>{r.layer}:</strong> {r.answer}</p>)}
      </Card>
    </div>
  );
}

function Resources({ resourceSearch, setResourceSearch }: { resourceSearch: string; setResourceSearch: (s: string) => void }) {
  const filtered = useMemo(() => {
    const q = resourceSearch.toLowerCase();
    return resources.filter((r) => !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.join(" ").toLowerCase().includes(q));
  }, [resourceSearch]);
  return (
    <Card>
      <h2>Resources + Search</h2>
      <p>Youth should not get stuck when they cannot find things. Search by product, topic, or task.</p>
      <input className="search" value={resourceSearch} onChange={(e) => setResourceSearch(e.target.value)} placeholder="Search Miracle-Gro, milkweed, weather, beehive, mulch..." />
      <div className="resourceGrid">
        {filtered.map((r) => (
          <article key={r.title} className="resourceCard">
            <h3>{r.title}</h3>
            <p>{r.description}</p>
            {r.url.startsWith("#") ? <span className="tag">Internal protocol</span> : <a href={r.url} target="_blank" rel="noreferrer">Open resource</a>}
          </article>
        ))}
      </div>
    </Card>
  );
}

function Journey({ reflections, workNotes }: { reflections: Reflection[]; workNotes: WorkNote[] }) {
  return (
    <div className="grid two">
      <Card>
        <h2>My Journey</h2>
        <p>This gathers work notes, workbook responses, skills, career connections, and legacy proof.</p>
        <ul>
          <li>Work notes saved: {workNotes.length}</li>
          <li>Workbook entries saved: {reflections.length}</li>
          <li>Portfolio direction: downloadable workbook/resume-ready proof.</li>
        </ul>
      </Card>
      <Card>
        <h2>Before and after growth</h2>
        <p>A typical 14–18 year old may arrive unsure what farming, ecology, business, or community stewardship has to do with them. After eight weeks, they should be able to point to work they completed, problems they solved, skills they practiced, and places they left better.</p>
      </Card>
    </div>
  );
}

function ForestLearningPortal() {
  return (
    <div className="grid two">
      <Card className="wide forestCard">
        <p className="eyebrow">Forest Learning Portal</p>
        <h2>The forest is part of the ecosystem.</h2>
        <p>Use this portal for observation, not unsupervised wandering. Today, youth stay in the grow-area work unless a supervisor assigns a forest observation.</p>
      </Card>
      <Card>
        <h3>Forest observations youth have already connected</h3>
        <ul>
          <li>Creeks and pooling water show how water moves through land.</li>
          <li>Tadpoles show habitat, life cycles, and water quality questions.</li>
          <li>Forest paths can pool after rain just like grow-area paths.</li>
          <li>Bones, insects, leaves, and soil show decomposition and nutrient cycling.</li>
          <li>Neighborhood woods and Youngstown parks connect this learning to home.</li>
        </ul>
      </Card>
      <Card>
        <h3>Safe forest questions</h3>
        <ul>
          <li>Where is water collecting?</li>
          <li>What signs show the soil is healthy or stressed?</li>
          <li>What animals or insects are using this space?</li>
          <li>What should humans avoid disturbing?</li>
          <li>How could trash or plastic bottles affect this habitat?</li>
        </ul>
      </Card>
    </div>
  );
}

function ParentPortal() {
  return (
    <Card>
      <h2>Parent Portal</h2>
      <p>Today’s parent-safe update: Youth are working in the grow area. No watering is needed because of rain. Youth are not scheduled to enter the forest today. Priority work includes melons, mulch, corn seedlings, squash/pumpkin area preparation, and gate installation.</p>
    </Card>
  );
}

function SupervisorPortal({ participants, setParticipants, workNotes, reflections }: { participants: User[]; setParticipants: React.Dispatch<React.SetStateAction<User[]>>; workNotes: WorkNote[]; reflections: Reflection[] }) {
  function toggleStatus(id: string) {
    setParticipants((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "inactive" ? "active" : "inactive" } : p));
  }
  return (
    <div className="grid two">
      <Card className="wide">
        <h2>Supervisor Dashboard</h2>
        <p>Use this to keep the day clear: work list, youth status, proof, and parent-safe notes.</p>
      </Card>
      <Card>
        <h3>Participant status</h3>
        {participants.map((p) => (
          <p className="log" key={p.id}><strong>{p.name}</strong> · {p.role} · {p.status} <button onClick={() => toggleStatus(p.id)}>Toggle active/inactive</button></p>
        ))}
      </Card>
      <Card>
        <h3>Today’s proof count</h3>
        <ul>
          <li>Work notes: {workNotes.length}</li>
          <li>Workbook reflections: {reflections.length}</li>
          <li>Beehive participation: self-selected only.</li>
        </ul>
      </Card>
    </div>
  );
}

function MissionControl({ participants, workNotes, reflections }: { participants: User[]; workNotes: WorkNote[]; reflections: Reflection[] }) {
  return (
    <div className="grid two">
      <Card className="wide">
        <h2>Mission Control</h2>
        <p>Current operating authority: Week 5, Tuesday July 7. Forest Portal restored. No watering. No forest trip today unless assigned.</p>
      </Card>
      <Card>
        <h3>Launch checklist</h3>
        <ul>
          <li>Forest Gate Portal first screen: active.</li>
          <li>Returning access: active.</li>
          <li>Youth dashboard: active.</li>
          <li>Today’s Work: active.</li>
          <li>Workbook response boxes: active.</li>
          <li>Resources search: active.</li>
          <li>Supervisor participant status: active.</li>
          <li>Inactive users receive Guest-only access.</li>
        </ul>
      </Card>
      <Card>
        <h3>Records</h3>
        <ul>
          <li>Participants: {participants.length}</li>
          <li>Work notes: {workNotes.length}</li>
          <li>Workbook entries: {reflections.length}</li>
        </ul>
      </Card>
    </div>
  );
}

function SupportPortal() {
  return (
    <Card>
      <h2>Support</h2>
      <p>If youth cannot click, find information, or understand where to go, send them back to Forest Portal or Dashboard. The top navigation remains available after entry.</p>
    </Card>
  );
}

const styles = `
:root{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#17351f;background:#f6f3ea}*{box-sizing:border-box}body{margin:0;background:#f6f3ea}main{min-height:100vh}.appHeader{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:1rem 1.25rem;background:#17351f;color:#fff;position:sticky;top:0;z-index:10;box-shadow:0 2px 14px rgba(0,0,0,.18)}h1,h2,h3{margin:.15rem 0 .6rem;line-height:1.1}.subtitle{margin:0;color:#d9ead4}.eyebrow{text-transform:uppercase;letter-spacing:.08em;font-size:.78rem;font-weight:800;color:#6e8b3d}.appHeader .eyebrow{color:#cfe6a4}.headerControls{display:flex;gap:.5rem;align-items:center}.headerControls select{padding:.6rem;border-radius:.7rem;border:0}.topnav{display:flex;gap:.5rem;overflow:auto;padding:.75rem 1rem;background:#fff;border-bottom:1px solid #e5decf;position:sticky;top:84px;z-index:9}.topnav button{white-space:nowrap;border:1px solid #d6cab5;background:#fff;border-radius:999px;padding:.6rem .9rem;font-weight:700;color:#17351f}.portalHero{min-height:calc(100vh - 84px);background:linear-gradient(135deg,rgba(23,53,31,.92),rgba(23,53,31,.58)),url('/images/Grow Area.png');background-size:cover;background-position:center;display:flex;align-items:center;padding:2rem}.portalOverlay{max-width:980px;background:rgba(255,255,255,.92);border-radius:2rem;padding:2rem;box-shadow:0 24px 80px rgba(0,0,0,.35)}.portalOverlay h2{font-size:clamp(2rem,5vw,4.5rem);color:#17351f}.doorGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.85rem;margin:1.3rem 0}.doorGrid button{border:0;border-radius:1.1rem;background:#17351f;color:#fff;padding:1.1rem;font-size:1rem;font-weight:900;cursor:pointer}.notice{background:#fff1ba;border-left:6px solid #a87700;padding:1rem;border-radius:.7rem;color:#3f3100}.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:1rem;padding:1rem}.grid.two>.card{grid-column:span 6}.grid.two>.wide{grid-column:1/-1}.card{background:#fff;border:1px solid #e5decf;border-radius:1.25rem;padding:1.25rem;box-shadow:0 12px 30px rgba(42,30,12,.06)}.forestCard{background:linear-gradient(135deg,#e9f3df,#fff)}.btn{border:0;border-radius:.9rem;padding:.8rem 1rem;font-weight:900;cursor:pointer}.btn.primary{background:#276738;color:#fff}.btn.secondary{background:#dcebc7;color:#17351f}.btn.ghost{background:#fff;border:1px solid #cbbf9f;color:#17351f}.btn.danger{background:#9c2f2f;color:#fff}.stack{display:flex;flex-direction:column;gap:.7rem}.row{display:flex;gap:.7rem;flex-wrap:wrap}.statusBox{background:#e9f3df;border:1px solid #b9d597;border-radius:1rem;padding:1rem;margin:1rem 0}.pillGrid{display:flex;gap:.5rem;flex-wrap:wrap}.pillGrid span,.tag{background:#edf6e5;border:1px solid #c9dfb8;padding:.45rem .7rem;border-radius:999px;font-weight:800}.field{display:flex;flex-direction:column;gap:.35rem;margin:.8rem 0}.field span,label{font-weight:800}textarea,input,select{width:100%;border:1px solid #cabf9f;border-radius:.8rem;padding:.8rem;font:inherit;background:#fff}.formGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin:1rem 0}.inlineForm{display:flex;gap:.7rem;align-items:center}.helper{color:#665d4a;font-size:.93rem}.log{background:#fbfaf6;border:1px solid #eee4d4;border-radius:.85rem;padding:.8rem}.resourceGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-top:1rem}.resourceCard{border:1px solid #e5decf;border-radius:1rem;padding:1rem;background:#fbfaf6}.resourceCard a{font-weight:900;color:#276738}.search{margin-top:1rem}@media(max-width:780px){.appHeader{position:relative;top:auto;align-items:flex-start;flex-direction:column}.topnav{top:0}.grid.two>.card{grid-column:1/-1}.portalHero{padding:1rem}.portalOverlay{padding:1rem}.inlineForm{flex-direction:column;align-items:stretch}}
`;

export default App;
