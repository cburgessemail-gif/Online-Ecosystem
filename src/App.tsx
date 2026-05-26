import React, { useEffect, useMemo, useState } from "react";

type Language = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";

type Screen =
  | "home"
  | "roles"
  | "guest"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "marketplace"
  | "valueadded"
  | "partners"
  | "volunteer"
  | "operations"
  | "weather"
  | "inventory"
  | "cropplanner"
  | "announcements"
  | "assessment"
  | "reflection"
  | "resources";

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

const languages: Language[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const navItems: { label: string; screen: Screen }[] = [
  { label: "Home", screen: "home" },
  { label: "Pathways", screen: "roles" },
  { label: "Youth", screen: "youth" },
  { label: "Supervisor", screen: "supervisor" },
  { label: "Grower", screen: "grower" },
  { label: "Marketplace", screen: "marketplace" },
  { label: "Operations", screen: "operations" },
  { label: "Partners", screen: "partners" },
];

const proverbBank = [
  "A seed becomes a harvest when people protect the conditions around it.",
  "Work teaches when the land, the adult, and the youth are all present.",
  "Measure progress daily, but grow people patiently.",
  "Food access begins with hands, soil, tools, water, and trust.",
  "A living ecosystem does not end at harvest; it returns to the community.",
];

function Navigation({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-black/35 px-5 py-3 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-xl">
      <button onClick={() => setScreen("home")} className="text-left">
        <div className="text-xs uppercase tracking-[0.32em] text-emerald-100/70">Bronson Family Farm</div>
        <div className="text-lg font-black leading-tight">Online Ecosystem</div>
      </button>
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => setScreen(item.screen)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              screen === item.screen
                ? "bg-emerald-300 text-black shadow-xl"
                : "border border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Shell({
  children,
  screen,
  setScreen,
  background = IMG.hero,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  background?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* CINEMATIC IMAGE */}
      <div className="fixed inset-0">
        <img src={background} alt="Bronson Family Farm" className="h-full w-full object-cover scale-[1.02]" />
      </div>

      {/* DARK FILM OVERLAY */}
      <div className="fixed inset-0 bg-black/48" />

      {/* CINEMATIC LIGHT */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,220,120,.08),transparent_24%),radial-gradient(circle_at_bottom,rgba(16,185,129,.10),transparent_32%)]" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-8 md:px-10">
        <Navigation screen={screen} setScreen={setScreen} />
        {children}
      </div>
    </div>
  );
}

function PhotoCard({
  title,
  subtitle,
  image,
  height = "320px",
  onClick,
}: {
  title: string;
  subtitle?: string;
  image: string;
  height?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black text-left shadow-[0_30px_80px_rgba(0,0,0,.55)] transition duration-700 hover:scale-[1.01]"
      style={{ height }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
      <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.08),transparent_45%)]" />
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="text-3xl font-black leading-tight drop-shadow-2xl">{title}</div>
        {subtitle && <div className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/85">{subtitle}</div>}
      </div>
    </button>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2rem] border border-white/10 bg-black/38 p-7 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function PillButton({ children, onClick, strong = false }: { children: React.ReactNode; onClick: () => void; strong?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={
        strong
          ? "rounded-full bg-emerald-300 px-7 py-4 font-black text-black shadow-2xl transition hover:scale-105"
          : "rounded-full border border-white/10 bg-white/10 px-7 py-4 font-semibold backdrop-blur-xl transition hover:bg-white/20"
      }
    >
      {children}
    </button>
  );
}

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">{eyebrow}</div>
      <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">{title}</h1>
      {body && <p className="mt-6 max-w-4xl text-lg leading-9 text-emerald-50/85">{body}</p>}
    </div>
  );
}



const fieldStations = [
  { station: "Grow Area", focus: "Planting, watering, scouting, harvest", pathway: "Youth + Grower", status: "Active" },
  { station: "Compost & Soil", focus: "Compost movement, soil health, circular inputs", pathway: "Youth + Volunteer", status: "Active" },
  { station: "Marketplace Prep", focus: "Sorting, labeling, QR/product readiness", pathway: "Marketplace", status: "Ready" },
  { station: "Culinary / Wellness", focus: "Edible flowers, mushrooms, nutrition education", pathway: "Value-Added", status: "Learning" },
  { station: "Fencing & Site Safety", focus: "Deer fencing, tool safety, perimeter checks", pathway: "Operations", status: "Priority" },
  { station: "Media & Reflection", focus: "Story capture, youth reflection, proverbs", pathway: "Parent + Partner", status: "Daily" },
];

const pathwayDecisions: { label: string; target: Screen; note: string }[] = [
  { label: "I am a youth worker", target: "youth", note: "Check in, receive assignment, reflect, and build skills." },
  { label: "I supervise youth", target: "supervisor", note: "Use attendance, PPE, scoring, support notes, and incident tools." },
  { label: "I am a parent/guardian", target: "parent", note: "Review attendance, alerts, badges, messages, and growth." },
  { label: "I grow food", target: "grower", note: "Plan crops, watch weather, track inventory, and move harvest." },
  { label: "I want food or seedlings", target: "marketplace", note: "Browse, learn, order, scan QR, and return." },
  { label: "I can help", target: "volunteer", note: "Choose a work area and connect to the next farm need." },
];

const weatherFallback = {
  temp: "--",
  wind: "--",
  rain: "Check live",
  summary: "Live Youngstown weather will load here when the browser can reach the weather service.",
};

function LiveWeatherCard({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [weather, setWeather] = useState(weatherFallback);
  const [status, setStatus] = useState("Connecting to live Youngstown field conditions...");

  useEffect(() => {
    let alive = true;
    async function loadWeather() {
      try {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=41.0998&longitude=-80.6495&current=temperature_2m,precipitation,wind_speed_10m&daily=sunrise,sunset,precipitation_probability_max,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather service unavailable");
        const data = await res.json();
        if (!alive) return;
        const current = data.current || {};
        const daily = data.daily || {};
        setWeather({
          temp: `${Math.round(current.temperature_2m ?? 0)}°F`,
          wind: `${Math.round(current.wind_speed_10m ?? 0)} mph`,
          rain: `${current.precipitation ?? 0} in now / ${daily.precipitation_probability_max?.[0] ?? "--"}% chance`,
          summary: `Sunrise ${daily.sunrise?.[0]?.slice(11) ?? "--"} · Sunset ${daily.sunset?.[0]?.slice(11) ?? "--"}`,
        });
        setStatus("Live field conditions loaded for Youngstown, Ohio.");
      } catch {
        if (!alive) return;
        setWeather(weatherFallback);
        setStatus("Weather fallback is showing. Live data can attach when deployed online.");
      }
    }
    loadWeather();
    const id = window.setInterval(loadWeather, 1000 * 60 * 20);
    return () => { alive = false; window.clearInterval(id); };
  }, []);

  return (
    <GlassCard className="!p-6">
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Live Weather</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/10 p-4"><div className="text-xs text-emerald-100/70">Temp</div><div className="text-3xl font-black">{weather.temp}</div></div>
        <div className="rounded-2xl bg-white/10 p-4"><div className="text-xs text-emerald-100/70">Wind</div><div className="text-3xl font-black">{weather.wind}</div></div>
        <div className="rounded-2xl bg-white/10 p-4"><div className="text-xs text-emerald-100/70">Rain</div><div className="text-lg font-black">{weather.rain}</div></div>
      </div>
      <p className="mt-4 text-sm leading-7 text-emerald-50/85">{weather.summary}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-emerald-100/60">{status}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <PillButton strong onClick={() => setScreen("weather")}>Open Weather Room</PillButton>
        <PillButton onClick={() => setScreen("cropplanner")}>Apply to Grow Plan</PillButton>
      </div>
    </GlassCard>
  );
}

function ProverbsTicker({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIndex((current) => (current + 1) % proverbBank.length), 7000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <GlassCard className="!p-6">
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Proverb of the Moment</div>
      <div className="mt-4 text-2xl font-black leading-tight">“{proverbBank[index]}”</div>
      <button onClick={() => setScreen("reflection")} className="mt-5 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold hover:bg-white/20">Open Reflection Room</button>
    </GlassCard>
  );
}

function FieldStationGrid({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {fieldStations.map((item) => (
        <button key={item.station} onClick={() => setScreen(item.pathway.includes("Grower") ? "grower" : item.pathway.includes("Marketplace") ? "marketplace" : item.pathway.includes("Value") ? "valueadded" : item.pathway.includes("Parent") ? "parent" : "operations")} className="rounded-[2rem] border border-white/10 bg-black/38 p-6 text-left shadow-[0_30px_80px_rgba(0,0,0,.35)] backdrop-blur-xl transition hover:bg-white/10">
          <div className="flex items-start justify-between gap-3"><div className="text-2xl font-black">{item.station}</div><div className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-black">{item.status}</div></div>
          <p className="mt-4 text-sm leading-7 text-emerald-50/85">{item.focus}</p>
          <div className="mt-4 text-xs uppercase tracking-[0.24em] text-emerald-100/60">{item.pathway}</div>
        </button>
      ))}
    </div>
  );
}

function DecisionGrid({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {pathwayDecisions.map((item) => (
        <button key={item.label} onClick={() => setScreen(item.target)} className="rounded-[2rem] border border-white/10 bg-white/10 p-6 text-left backdrop-blur-xl transition hover:bg-emerald-300 hover:text-black">
          <div className="text-2xl font-black">{item.label}</div>
          <p className="mt-3 text-sm leading-7 opacity-85">{item.note}</p>
        </button>
      ))}
    </div>
  );
}

function TextAreaBlock({ label, placeholder }: { label: string; placeholder: string }) {
  const [value, setValue] = useState("");
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/10 p-5">
      <div className="text-lg font-black">{label}</div>
      <textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className="mt-4 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none placeholder:text-white/40" />
    </label>
  );
}

function Home({
  setScreen,
  language,
  setLanguage,
}: {
  setScreen: (screen: Screen) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  return (
    <Shell screen="home" setScreen={setScreen} background={IMG.hero}>
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        {/* MAIN HERO */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl">
          <div className="relative min-h-[720px]">
            <img src={IMG.hero} alt="Bronson Family Farm" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
            <div className="relative z-10 flex min-h-[720px] flex-col justify-end p-8 md:p-12">
              <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/80">Connected Food Ecosystem Experience</div>
              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">
                Step Into The Farm.
                <br />
                Experience The Wonders Of Life.
              </h1>
              <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/90">
                A living ecosystem connecting youth workforce development, growers, marketplace systems, schools, wellness,
                agritourism, food access, leadership, and community revitalization.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <PillButton strong onClick={() => setScreen("roles")}>Begin Guided Tour</PillButton>
                <PillButton onClick={() => setScreen("marketplace")}>Marketplace</PillButton>
                <PillButton onClick={() => setScreen("partners")}>Partners</PillButton>
              </div>
            </div>
          </div>

          {/* LOWER EXPERIENCE CARDS */}
          <div className="grid border-t border-white/10 md:grid-cols-3">
            <PhotoCard title="Grower Ecosystem" subtitle="Production, training, and local food access" image={IMG.growArea} height="270px" onClick={() => setScreen("grower")} />
            <PhotoCard title="Marketplace Movement" subtitle="Food moving toward families and destinations" image={IMG.marketplaceHero} height="270px" onClick={() => setScreen("marketplace")} />
            <PhotoCard title="Youth Workforce" subtitle="Leadership through participation" image={IMG.youth1} height="270px" onClick={() => setScreen("youth")} />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <GlassCard>
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Living Ecosystem Overview</div>
            <h2 className="mt-5 text-4xl font-black leading-tight">A place people want to return to.</h2>
            <p className="mt-6 text-lg leading-9 text-emerald-50/85">
              Bronson Family Farm connects workforce, agriculture, schools, wellness, marketplace systems, growers,
              leadership, and community participation into one immersive ecosystem.
            </p>
            <div className="mt-8 space-y-4">
              {[
                ["Youth Workforce Development", "youth"],
                ["Marketplace & Distribution", "marketplace"],
                ["Schools & Community Food Access", "guest"],
                ["Grower Ecosystem", "grower"],
                ["Nutrition & Culinary Wellness", "valueadded"],
                ["Family Legacy & Land Restoration", "partners"],
              ].map(([item, target]) => (
                <button
                  key={item}
                  onClick={() => setScreen(target as Screen)}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 p-5 text-left text-xl font-semibold backdrop-blur-xl transition hover:bg-white/20"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-8">
              <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Language</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      language === lang ? "bg-white text-black" : "border border-white/10 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
          <PhotoCard title="Seeds, compost, partners, and people make the ecosystem real." subtitle="The work is operational, visible, and community-rooted." image={IMG.seeds} height="300px" onClick={() => setScreen("operations")} />
          <LiveWeatherCard setScreen={setScreen} />
          <ProverbsTicker setScreen={setScreen} />
        </div>
      </section>
    </Shell>
  );
}

function Roles({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const roles: { title: string; text: string; screen: Screen; image: string }[] = [
    { title: "Guest", text: "Enter the story, understand the place, and choose how to participate.", screen: "guest", image: IMG.heroAlt },
    { title: "Youth Workforce", text: "Check in, learn safely, complete tasks, reflect, and grow through the season.", screen: "youth", image: IMG.youth1 },
    { title: "Supervisor", text: "Guide up to 15 youth with phone-ready attendance, PPE checks, scoring, and support notes.", screen: "supervisor", image: IMG.youth2 },
    { title: "Parent / Guardian", text: "See progress, attendance, badges, messages, and program updates.", screen: "parent", image: IMG.sameera2 },
    { title: "Grower", text: "Plan crops, track tasks, watch weather, and connect harvest to market.", screen: "grower", image: IMG.growArea },
    { title: "Marketplace Customer", text: "Find produce, seedlings, supply bundles, SNAP notes, and pickup information.", screen: "marketplace", image: IMG.marketplaceHero },
    { title: "Value-Added Producer", text: "Connect edible flowers, mushrooms, recipes, preservation, and culinary education.", screen: "valueadded", image: IMG.culinaryFlowers },
    { title: "Volunteer / Partner", text: "Contribute time, tools, education, funding, materials, and community support.", screen: "volunteer", image: IMG.volunteers },
  ];

  return (
    <Shell screen="roles" setScreen={setScreen} background={IMG.ecosystem}>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <GlassCard>
          <SectionTitle
            eyebrow="Guided Ecosystem Tour"
            title="Choose a pathway. Every pathway now moves."
            body="Each role has an entry point, daily actions, tracking tools, resources, and a next step. This keeps the existing experience while completing the operational depth."
          />
          <div className="mt-8 grid gap-3">
            <PillButton strong onClick={() => setScreen("youth")}>Start Youth Workforce Journey</PillButton>
            <PillButton onClick={() => setScreen("operations")}>Open Operations Center</PillButton>
            <PillButton onClick={() => setScreen("weather")}>Open Weather & Alerts</PillButton>
          </div>
        </GlassCard>
        <div className="space-y-6">
          <GlassCard><div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Decision Point</div><div className="mt-5"><DecisionGrid setScreen={setScreen} /></div></GlassCard>
          <div className="grid gap-5 md:grid-cols-2">
          {roles.map((role) => (
            <PhotoCard key={role.title} title={role.title} subtitle={role.text} image={role.image} height="280px" onClick={() => setScreen(role.screen)} />
          ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function JourneyScreen({
  screen,
  setScreen,
  background,
  eyebrow,
  title,
  body,
  steps,
  actions,
  imageCards,
}: {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  background: string;
  eyebrow: string;
  title: string;
  body: string;
  steps: string[];
  actions: { label: string; target: Screen; strong?: boolean }[];
  imageCards?: { title: string; subtitle: string; image: string; target: Screen }[];
}) {
  return (
    <Shell screen={screen} setScreen={setScreen} background={background}>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1.25fr]">
        <GlassCard>
          <SectionTitle eyebrow={eyebrow} title={title} body={body} />
          <div className="mt-8 flex flex-wrap gap-3">
            {actions.map((action) => (
              <PillButton key={action.label} strong={action.strong} onClick={() => setScreen(action.target)}>{action.label}</PillButton>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Journey Flow</div>
          <div className="mt-6 grid gap-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <div className="text-sm font-black text-emerald-200">{String(index + 1).padStart(2, "0")}</div>
                <div className="mt-2 text-xl font-bold leading-tight">{step}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      {imageCards && (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {imageCards.map((card) => (
            <PhotoCard key={card.title} {...card} height="310px" onClick={() => setScreen(card.target)} />
          ))}
        </div>
      )}
    </Shell>
  );
}

function Operations({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const modules: { title: string; text: string; target: Screen }[] = [
    { title: "Attendance & QR Check-In", text: "Daily check-in, youth roster, supervisor confirmation, and late/absent status.", target: "supervisor" },
    { title: "Daily Assessment", text: "PPE, task completion, teamwork, communication, leadership, and support flags.", target: "assessment" },
    { title: "Crop Planner", text: "Planting, watering, pest checks, harvest windows, and crop responsibility.", target: "cropplanner" },
    { title: "Inventory", text: "Seedlings, produce, tools, donations, marketplace quantities, and supply movement.", target: "inventory" },
    { title: "Weather & Alerts", text: "Rain, heat, severe weather, irrigation guidance, and field readiness.", target: "weather" },
    { title: "Announcements", text: "Program updates, volunteer requests, market notices, and urgent field messages.", target: "announcements" },
  ];
  return (
    <Shell screen="operations" setScreen={setScreen} background={IMG.compost}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
        <GlassCard>
          <SectionTitle
            eyebrow="Operations Center"
            title="The ecosystem now has working rooms."
            body="This layer connects youth, supervisors, growers, marketplace, partners, inventory, weather, and communications without changing the visual build."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <PillButton strong onClick={() => setScreen("assessment")}>Open Assessment</PillButton>
            <PillButton onClick={() => setScreen("cropplanner")}>Open Crop Planner</PillButton>
          </div>
        </GlassCard>
        <div className="grid gap-5 md:grid-cols-2">
          {modules.map((m) => (
            <button key={m.title} onClick={() => setScreen(m.target)} className="rounded-[2rem] border border-white/10 bg-black/38 p-6 text-left shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl transition hover:bg-white/10">
              <div className="text-2xl font-black">{m.title}</div>
              <p className="mt-4 text-sm leading-7 text-emerald-50/85">{m.text}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6"><FieldStationGrid setScreen={setScreen} /></div>
    </Shell>
  );
}

function SupervisorPanel({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const controls = ["PRESENT", "ABSENT", "PPE CHECK", "TASK COMPLETE", "NEED SUPPORT", "INCIDENT", "DAILY SCORE", "PARENT NOTE"];
  const roster = [
    ["Youth A", "Present", "PPE complete", "Needs irrigation station"],
    ["Youth B", "Present", "Task complete", "Strong teamwork"],
    ["Youth C", "Late", "Check in required", "Supervisor follow-up"],
    ["Youth D", "Present", "Reflection due", "Ready for badge review"],
  ];
  return (
    <Shell screen="supervisor" setScreen={setScreen} background={IMG.youth2}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
        <GlassCard>
          <SectionTitle
            eyebrow="Supervisor Mobile Pathway"
            title="Guide. Assess. Protect. Document."
            body="Phone-ready controls help each supervisor support no more than 15 youth through attendance, PPE, tasks, wellness flags, notes, and daily scoring."
          />
          <div className="mt-8 grid grid-cols-2 gap-3">
            {controls.map((c) => (
              <button key={c} onClick={() => setScreen(c === "DAILY SCORE" ? "assessment" : c === "PARENT NOTE" ? "parent" : "supervisor")} className="rounded-2xl bg-emerald-300 px-4 py-5 text-center text-sm font-black text-black shadow-xl transition hover:scale-[1.02]">
                {c}
              </button>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Youth Roster Snapshot</div>
          <div className="mt-6 grid gap-4">
            {roster.map(([name, status, task, note]) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-2xl font-black">{name}</div>
                  <div className="rounded-full bg-white px-4 py-1 text-xs font-black text-black">{status}</div>
                </div>
                <div className="mt-3 text-sm leading-7 text-emerald-50/85">{task} · {note}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <PillButton strong onClick={() => setScreen("assessment")}>Score Today</PillButton>
            <PillButton onClick={() => setScreen("reflection")}>Open Reflection</PillButton>
          </div>
        </GlassCard>
      </div>
    </Shell>
  );
}

function Assessment({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const areas = ["Attendance", "PPE", "Safety", "Task Completion", "Teamwork", "Communication", "Leadership", "Emotional Readiness", "Reflection", "Next Support Step"];
  return (
    <Shell screen="assessment" setScreen={setScreen} background={IMG.youth3}>
      <GlassCard>
        <SectionTitle eyebrow="Digital Assessment" title="Daily scoring without leaving the field." body="Supervisors can record progress from a phone. The youth journey connects daily actions to badges, readiness, and parent-visible growth." />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {areas.map((area) => (
            <div key={area} className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <div className="text-lg font-black">{area}</div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((score) => <button key={score} className="rounded-xl bg-white/10 py-3 font-black hover:bg-emerald-300 hover:text-black">{score}</button>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <TextAreaBlock label="Supervisor Observation" placeholder="What did you observe today?" />
          <TextAreaBlock label="Support / Follow-Up Needed" placeholder="Note any concern, encouragement, incident, or parent message." />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <PillButton strong onClick={() => setScreen("supervisor")}>Save & Return to Supervisor</PillButton>
          <PillButton onClick={() => setScreen("parent")}>Send Parent Update</PillButton>
        </div>
      </GlassCard>
    </Shell>
  );
}

function CropPlanner({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const crops = [
    ["Tomatoes", "Transplant / stake / water check", "Harvest window: summer"],
    ["Collards", "Succession planting / pest scan", "CSA and market bundles"],
    ["Mustard Greens", "Moisture and flea beetle check", "Fast harvest crop"],
    ["Peppers", "Warm weather spacing", "Marketplace bundles"],
    ["Corn", "Block planting and water demand", "Education + harvest"],
    ["Cucumbers", "Trellis, pest check, harvest frequently", "Fresh market"],
  ];
  return (
    <Shell screen="cropplanner" setScreen={setScreen} background={IMG.growArea}>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <GlassCard>
          <SectionTitle eyebrow="Crop Planner" title="Field work becomes a guided grow plan." body="The crop planner keeps planting, watering, scouting, harvesting, education, and marketplace movement connected inside the ecosystem." />
          <div className="mt-8 flex flex-wrap gap-3">
            <PillButton strong onClick={() => setScreen("weather")}>Check Weather</PillButton>
            <PillButton onClick={() => setScreen("inventory")}>Open Inventory</PillButton>
          </div>
        </GlassCard>
        <div className="grid gap-4 md:grid-cols-2">
          {crops.map(([crop, task, note]) => (
            <GlassCard key={crop} className="!p-6">
              <div className="text-2xl font-black">{crop}</div>
              <p className="mt-3 text-sm leading-7 text-emerald-50/85">{task}</p>
              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm font-semibold">{note}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function Inventory({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const rows = [
    ["Bubble Babies™", "Seed rolls / seedlings", "Marketplace ready"],
    ["Jubilee Seeds", "Giveaway and production", "Donor-powered"],
    ["Compost", "Elliott Garden Center", "Soil building"],
    ["Fence Materials", "Posts / wire / tools", "Site protection"],
    ["Produce", "Harvest quantities", "GrownBy / market"],
    ["PPE", "Gloves / safety items", "Youth workforce"],
  ];
  return (
    <Shell screen="inventory" setScreen={setScreen} background={IMG.seeds}>
      <GlassCard>
        <SectionTitle eyebrow="Inventory Movement" title="Supplies, produce, and donations stay connected." body="This operational layer tracks what comes in, what moves to the field, what becomes food, and what enters the marketplace." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {rows.map(([item, category, status]) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <div className="text-2xl font-black">{item}</div>
              <div className="mt-3 text-sm text-emerald-50/80">{category}</div>
              <div className="mt-4 rounded-full bg-emerald-300 px-4 py-2 text-center text-xs font-black text-black">{status}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <PillButton strong onClick={() => setScreen("marketplace")}>Move to Marketplace</PillButton>
          <PillButton onClick={() => setScreen("cropplanner")}>Return to Crop Planner</PillButton>
        </div>
      </GlassCard>
    </Shell>
  );
}

function WeatherAlerts({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="weather" setScreen={setScreen} background={IMG.growAreaAlt}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <GlassCard>
          <SectionTitle eyebrow="Weather & Field Readiness" title="Youngstown field decisions in one place." body="Use this room for rain, heat, irrigation, sunrise, sunset, severe weather, and field-readiness notes. Live API connections can be attached here without changing the design." />
          <div className="mt-8 flex flex-wrap gap-3">
            <PillButton strong onClick={() => setScreen("cropplanner")}>Apply to Crop Plan</PillButton>
            <PillButton onClick={() => setScreen("announcements")}>Post Weather Notice</PillButton>
          </div>
        </GlassCard>
        <div className="space-y-4">
          <LiveWeatherCard setScreen={setScreen} />
          <div className="grid gap-4 md:grid-cols-2">
            {["Rain Watch", "Heat Safety", "Irrigation Need", "Field Access", "Sunrise / Sunset", "Severe Weather"].map((item, i) => (
              <GlassCard key={item} className="!p-6">
                <div className="text-2xl font-black">{item}</div>
                <p className="mt-4 text-sm leading-7 text-emerald-50/85">{i % 2 === 0 ? "Review before crews enter the field." : "Use supervisor alerts and youth safety reminders."}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Announcements({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const notes = ["Youth Workforce begins June 8, 2026.", "Supervisor orientation and role training required before field work.", "Seed giveaways and marketplace updates appear here.", "Weather delays and safety notices appear here first."];
  return (
    <Shell screen="announcements" setScreen={setScreen} background={IMG.wkbn}>
      <GlassCard>
        <SectionTitle eyebrow="Live Announcements" title="One message center for the farm ecosystem." body="Program notices, field alerts, partner requests, marketplace updates, and event messages can live here for each pathway." />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {notes.map((n) => <div key={n} className="rounded-2xl border border-white/10 bg-white/10 p-6 text-xl font-bold">{n}</div>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <PillButton strong onClick={() => setScreen("roles")}>Return to Pathways</PillButton>
          <PillButton onClick={() => setScreen("operations")}>Open Operations</PillButton>
        </div>
      </GlassCard>
    </Shell>
  );
}

function Reflection({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="reflection" setScreen={setScreen} background={IMG.queens}>
      <GlassCard>
        <SectionTitle eyebrow="Reflection & Motivation" title="The work has a heart, not just a checklist." body="Youth and supervisors can use this space for daily reflection, proverbs, encouragement, wellness notes, and next-step commitments." />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {proverbBank.map((p) => <div key={p} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-lg font-semibold leading-7">{p}</div>)}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <TextAreaBlock label="Youth Reflection" placeholder="Today I learned... Today I helped... Tomorrow I will..." />
          <TextAreaBlock label="Supervisor Encouragement" placeholder="A short note to help the youth see progress and next steps." />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <PillButton strong onClick={() => setScreen("youth")}>Return to Youth Journey</PillButton>
          <PillButton onClick={() => setScreen("assessment")}>Open Daily Score</PillButton>
        </div>
      </GlassCard>
    </Shell>
  );
}

function Resources({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="resources" setScreen={setScreen} background={IMG.ecosystem}>
      <JourneyScreen
        screen="resources"
        setScreen={setScreen}
        background={IMG.ecosystem}
        eyebrow="Resource Library"
        title="Tools, knowledge, and people in one ecosystem."
        body="This room organizes curriculum, safety, grower guidance, marketplace information, partner materials, nutrition, and family resources."
        steps={["Youth curriculum and activity guides", "Supervisor checklists and assessment rubrics", "Grower crop and market resources", "Parent/guardian program updates", "Partner and volunteer contribution guides"]}
        actions={[{ label: "Open Youth", target: "youth", strong: true }, { label: "Open Grower", target: "grower" }, { label: "Open Partners", target: "partners" }]}
      />
    </Shell>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [language, setLanguage] = useState<Language>("English");
  const direction = language === "עברית" ? "rtl" : "ltr";

  const current = useMemo(() => {
    switch (screen) {
      case "home": return <Home setScreen={setScreen} language={language} setLanguage={setLanguage} />;
      case "roles": return <Roles setScreen={setScreen} />;
      case "guest": return <JourneyScreen screen="guest" setScreen={setScreen} background={IMG.heroAlt} eyebrow="Guest Pathway" title="Arrive. Understand. Choose your place." body="Guests enter the farm story, see why the ecosystem matters, learn how food access and youth development connect, and choose a next pathway." steps={["Welcome to the farm and the Historic Lansdowne Airport setting", "See the ecosystem map and the people involved", "Experience marketplace, grower, youth, and partner rooms", "Choose to become a customer, volunteer, donor, grower, or partner"]} actions={[{ label: "Choose Pathway", target: "roles", strong: true }, { label: "Marketplace", target: "marketplace" }, { label: "Volunteer", target: "volunteer" }]} imageCards={[{ title: "Farm Story", subtitle: "Place, land, legacy, and food access.", image: IMG.hero, target: "resources" }, { title: "Marketplace", subtitle: "Food moving toward families.", image: IMG.marketplaceHero, target: "marketplace" }, { title: "Partners", subtitle: "Support the work visibly.", image: IMG.partners, target: "partners" }]} />;
      case "youth": return <JourneyScreen screen="youth" setScreen={setScreen} background={IMG.youth1} eyebrow="Youth Workforce Pathway" title="Check in. Work safely. Build skills." body="Youth move through orientation, PPE, daily assignments, farm tasks, reflection, supervisor assessment, badges, and next-step growth." steps={["QR or supervisor check-in", "PPE and safety confirmation", "Station assignment: grow, compost, market, culinary, fencing, or media", "Task completion with photo or supervisor evidence", "Daily reflection and proverb", "Supervisor score and support note", "Badge progress and parent-visible update"]} actions={[{ label: "Daily Check-In", target: "supervisor", strong: true }, { label: "Reflection", target: "reflection" }, { label: "Assessment", target: "assessment" }]} imageCards={[{ title: "Field Work", subtitle: "Youth learn by participating.", image: IMG.youth2, target: "assessment" }, { title: "Skill Growth", subtitle: "Progress is observed daily.", image: IMG.youth3, target: "reflection" }, { title: "Parent Connection", subtitle: "Growth can be shared home.", image: IMG.sameera3, target: "parent" }]} />;
      case "supervisor": return <SupervisorPanel setScreen={setScreen} />;
      case "parent": return <JourneyScreen screen="parent" setScreen={setScreen} background={IMG.sameera2} eyebrow="Parent / Guardian Portal" title="See the youth journey without being in the field." body="Families can follow attendance, safety status, badges, photos, announcements, messages, and growth notes." steps={["Confirm contact and permissions", "Review attendance and daily participation", "See badges and progress areas", "Receive supervisor messages and alerts", "Support youth reflection and next-step growth"]} actions={[{ label: "View Announcements", target: "announcements", strong: true }, { label: "Youth Journey", target: "youth" }, { label: "Reflection", target: "reflection" }]} imageCards={[{ title: "Growth Timeline", subtitle: "Every day builds the record.", image: IMG.sameera3, target: "assessment" }, { title: "Support Notes", subtitle: "Families remain connected.", image: IMG.sameera4, target: "announcements" }, { title: "Celebration", subtitle: "Badges and milestones matter.", image: IMG.sameera5, target: "resources" }]} />;
      case "grower": return <JourneyScreen screen="grower" setScreen={setScreen} background={IMG.growArea} eyebrow="Grower Pathway" title="Plan crops. Track work. Move harvest." body="Growers connect planting schedules, weather, crop tasks, compost, pest checks, inventory, and marketplace movement." steps={["Choose crop or growing focus", "Review weather and field readiness", "Plan planting, watering, scouting, and harvest", "Track inventory and supplies", "Move harvest or seedlings into marketplace", "Share learning with youth and community"]} actions={[{ label: "Crop Planner", target: "cropplanner", strong: true }, { label: "Weather", target: "weather" }, { label: "Inventory", target: "inventory" }]} imageCards={[{ title: "Grow Area", subtitle: "Field activity and production.", image: IMG.growAreaAlt, target: "cropplanner" }, { title: "Compost", subtitle: "Soil building and circular inputs.", image: IMG.compost, target: "inventory" }, { title: "Seeds", subtitle: "Production begins here.", image: IMG.seeds, target: "inventory" }]} />;
      case "marketplace": return <JourneyScreen screen="marketplace" setScreen={setScreen} background={IMG.marketplaceHero} eyebrow="Marketplace Pathway" title="Food, seedlings, supplies, and education move together." body="The marketplace connects produce, Bubble Babies™, grower supply bundles, nutrition education, SNAP notes, QR access, and pickup flow." steps={["Browse seasonal produce and seedlings", "Check SNAP-eligible notes where applicable", "Scan QR or route to GrownBy/storefront", "Reserve pickup or market availability", "Meet the grower and learn how the food was produced", "Return for education, events, and repeat healthy choices"]} actions={[{ label: "Inventory", target: "inventory", strong: true }, { label: "Value-Added", target: "valueadded" }, { label: "Grower", target: "grower" }]} imageCards={[{ title: "Marketplace Movement", subtitle: "Food moving toward families.", image: IMG.marketplaceHero, target: "inventory" }, { title: "Bubble Babies™", subtitle: "Seed rolls and seedlings.", image: IMG.seeds, target: "resources" }, { title: "Nutrition", subtitle: "Food as wellness education.", image: IMG.culinaryFlowers2, target: "valueadded" }]} />;
      case "valueadded": return <JourneyScreen screen="valueadded" setScreen={setScreen} background={IMG.culinaryFlowers} eyebrow="Value-Added Pathway" title="Culinary education brings the harvest to life." body="This pathway connects edible flowers, mushrooms, recipes, preservation, food safety, nutrition, and value-added learning." steps={["Select culinary learning focus", "Connect crop or harvest source", "Review recipe, nutrition, and safety guidance", "Prepare demonstration or product idea", "Connect to marketplace, youth education, or partner activity"]} actions={[{ label: "Marketplace", target: "marketplace", strong: true }, { label: "Resources", target: "resources" }, { label: "Youth", target: "youth" }]} imageCards={[{ title: "Edible Flowers", subtitle: "Beauty, nutrition, and culinary learning.", image: IMG.culinaryFlowers, target: "marketplace" }, { title: "Mushrooms", subtitle: "Value-added education.", image: IMG.culinaryMushrooms, target: "resources" }, { title: "Wellness", subtitle: "Food and health together.", image: IMG.culinaryFlowers2, target: "partners" }]} />;
      case "partners": return <JourneyScreen screen="partners" setScreen={setScreen} background={IMG.partners} eyebrow="Partner Pathway" title="Support becomes visible inside the ecosystem." body="Partners can align materials, education, funding, media, workforce, wellness, food access, trees, compost, tools, and market support." steps={["Identify contribution area", "Connect to program need", "Track visible impact", "Support youth, growers, market, or field operations", "Receive reporting, recognition, and next-step opportunities"]} actions={[{ label: "Operations", target: "operations", strong: true }, { label: "Volunteer", target: "volunteer" }, { label: "Announcements", target: "announcements" }]} imageCards={[{ title: "Central State Representation", subtitle: "Training, agriculture, and workforce connection.", image: IMG.csu, target: "resources" }, { title: "Compost Support", subtitle: "Partner inputs strengthen soil.", image: IMG.compost2, target: "inventory" }, { title: "Media & Story", subtitle: "Public visibility builds momentum.", image: IMG.wkbn, target: "announcements" }]} />;
      case "volunteer": return <JourneyScreen screen="volunteer" setScreen={setScreen} background={IMG.volunteers} eyebrow="Volunteer Pathway" title="Hands, tools, time, and care move the farm forward." body="Volunteers can help with fencing, planting, sorting seeds, setting up events, supporting youth stations, market flow, and land restoration." steps={["Choose volunteer area", "Review safety and site expectations", "Check in and receive assignment", "Complete task with supervisor confirmation", "Record hours and next availability", "Move into partner, grower, or community ambassador role"]} actions={[{ label: "Announcements", target: "announcements", strong: true }, { label: "Operations", target: "operations" }, { label: "Partners", target: "partners" }]} imageCards={[{ title: "Fence Support", subtitle: "Protect the growing area.", image: IMG.fencing, target: "operations" }, { title: "Volunteer Teams", subtitle: "People make the ecosystem real.", image: IMG.volunteers, target: "announcements" }, { title: "Land Restoration", subtitle: "Work becomes visible.", image: IMG.growAreaAlt, target: "grower" }]} />;
      case "operations": return <Operations setScreen={setScreen} />;
      case "weather": return <WeatherAlerts setScreen={setScreen} />;
      case "inventory": return <Inventory setScreen={setScreen} />;
      case "cropplanner": return <CropPlanner setScreen={setScreen} />;
      case "announcements": return <Announcements setScreen={setScreen} />;
      case "assessment": return <Assessment setScreen={setScreen} />;
      case "reflection": return <Reflection setScreen={setScreen} />;
      case "resources": return <Resources setScreen={setScreen} />;
      default: return <Home setScreen={setScreen} language={language} setLanguage={setLanguage} />;
    }
  }, [screen, language]);

  return <main dir={direction}>{current}</main>;
}

export default App;
