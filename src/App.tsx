import React, { useState } from "react";

type Screen = "home" | "roles" | "marketplace" | "events" | "nutrition";
type Language = "English" | "Español" | "Tagalog" | "Italiano" | "Patwa" | "Hebrew";

const FARM_IMAGE = "/GrowArea.jpg";

function PillButton({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-5 py-3 text-sm font-medium backdrop-blur-md transition hover:scale-[1.01] ${active ? "border-emerald-200/30 bg-emerald-400/20 text-white" : "border-white/10 bg-white/10 text-white hover:bg-white/15"}`}>
      {children}
    </button>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] border border-white/10 bg-black/25 shadow-2xl backdrop-blur-xl ${className}`}>{children}</div>;
}

function PhotoPanel({ title, subtitle, tall = false }: { title: string; subtitle?: string; tall?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 ${tall ? "h-[560px]" : "h-[260px]"}`}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${FARM_IMAGE})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-2xl font-black">{title}</div>
        {subtitle && <div className="mt-2 text-sm text-emerald-50/80">{subtitle}</div>}
      </div>
    </div>
  );
}

function Navigation({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <PillButton active={screen === "home"} onClick={() => setScreen("home")}>Entrance</PillButton>
      <PillButton active={screen === "roles"} onClick={() => setScreen("roles")}>Role Pathways</PillButton>
      <PillButton active={screen === "marketplace"} onClick={() => setScreen("marketplace")}>Marketplace</PillButton>
      <PillButton active={screen === "events"} onClick={() => setScreen("events")}>Events</PillButton>
      <PillButton active={screen === "nutrition"} onClick={() => setScreen("nutrition")}>Nutrition</PillButton>
    </div>
  );
}

function Shell({ children, screen, setScreen }: { children: React.ReactNode; screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${FARM_IMAGE})` }} />
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-emerald-950/75 to-black/95" />
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-8 md:px-10">
        <Navigation screen={screen} setScreen={setScreen} />
        {children}
      </div>
    </div>
  );
}

function Home({ setScreen, language, setLanguage }: { setScreen: (s: Screen) => void; language: Language; setLanguage: (l: Language) => void }) {
  const languages: Language[] = ["English", "Español", "Tagalog", "Italiano", "Patwa", "Hebrew"];

  return (
    <Shell screen="home" setScreen={setScreen}>
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/25 shadow-2xl backdrop-blur-xl">
          <div className="relative h-[560px]">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${FARM_IMAGE})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">Connected Food Ecosystem Experience</div>
              <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Bronson Family Farm</h1>
              <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/85">
                A living ecosystem connecting youth workforce development, growers, marketplace systems, schools, wellness, agritourism, food access, leadership, and community revitalization.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-full bg-emerald-400 px-6 py-3 font-bold text-black">Begin Guided Tour</button>
                <button onClick={() => setScreen("roles")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3">Enter Ecosystem</button>
                <button onClick={() => setScreen("marketplace")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3">Marketplace</button>
              </div>
            </div>
          </div>

          <div className="grid border-t border-white/10 md:grid-cols-3">
            <PhotoPanel title="Grower Ecosystem" subtitle="Production, training, and local food access" />
            <PhotoPanel title="Marketplace Movement" subtitle="Food moving toward families and destinations" />
            <PhotoPanel title="Youth Workforce" subtitle="Leadership through participation" />
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-7">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Living Ecosystem Overview</div>
            <h2 className="mt-5 text-4xl font-black leading-tight">A place people want to return to.</h2>
            <p className="mt-6 text-lg leading-9 text-emerald-50/82">
              Bronson Family Farm connects workforce, agriculture, schools, wellness, marketplace systems, growers, leadership, and community participation into one immersive ecosystem.
            </p>

            <div className="mt-8 space-y-4">
              {["Youth Workforce Development", "Marketplace & Distribution", "Schools & Community Food Access", "Grower Ecosystem", "Nutrition & Wellness", "Family Legacy & Land Restoration"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-xl font-semibold">{item}</div>
              ))}
            </div>

            <div className="mt-8">
              <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Language</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} className={`rounded-full px-4 py-2 text-sm transition ${language === lang ? "bg-white text-black" : "border border-white/10 bg-white/10 text-white"}`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["50 Youth Active", "Summer Workforce Active"],
              ["Marketplace Preparing", "Distribution & Inventory"],
              ["Warm Growing Conditions", "Weather & Irrigation Active"],
              ["Schools Supported", "Community Destinations Active"],
            ].map(([title, subtitle]) => (
              <GlassCard key={title} className="p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/65">Live Ecosystem</div>
                <div className="mt-3 text-2xl font-bold">{title}</div>
                <div className="mt-2 text-sm text-emerald-50/70">{subtitle}</div>
              </GlassCard>
            ))}
          </div>

          <PhotoPanel title="Schools & Community Support Active" subtitle="Food grown here moves toward the marketplace, schools, families, and community destinations." />
        </div>
      </section>

      <section className="mt-24">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Daily Ecosystem Rhythm</div>
        <h2 className="mt-5 text-5xl font-black">The ecosystem moves with purpose and structure.</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {["Morning Activation", "Team Deployment", "Motivational Activity Block", "Marketplace Rotation"].map((item) => <PhotoPanel key={item} title={item} />)}
        </div>
      </section>

      <section className="mt-24">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Food Destination Flow</div>
        <h2 className="mt-5 text-5xl font-black leading-tight">Grow → Harvest → Prepare → Marketplace → Schools → Families</h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          {["Grow", "Harvest", "Prepare", "Marketplace", "Schools", "Families"].map((item) => <PhotoPanel key={item} title={item} />)}
        </div>
      </section>
    </Shell>
  );
}

function Roles({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <Shell screen="roles" setScreen={setScreen}>
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Ecosystem Role Pathways</div>
      <h1 className="mt-5 text-5xl font-black leading-tight md:text-6xl">Every pathway moves through the ecosystem.</h1>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="overflow-hidden">
          <PhotoPanel title="Youth Workforce Journey" subtitle="Youth participate in a real food ecosystem." tall />
          <div className="p-8">
            <h2 className="text-5xl font-black leading-tight">Youth participate in a real food ecosystem.</h2>
            <p className="mt-6 text-lg leading-9 text-emerald-50/82">
              Youth cultivate, harvest, prepare, organize, reflect, lead, and help move food toward marketplaces, schools, community destinations, and families.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Workforce Command Center</div>
          <h2 className="mt-4 text-4xl font-black">Operational ecosystem activity</h2>
          <div className="mt-8 grid gap-4">
            {[
              ["50 Youth Active", "Summer workforce session active"],
              ["PPE Verified", "Safety & readiness checks complete"],
              ["Marketplace Prep", "Distribution preparation active"],
              ["Leadership Challenge", "Team-based ecosystem activity"],
            ].map(([title, subtitle]) => (
              <GlassCard key={title} className="p-5">
                <div className="text-2xl font-bold">{title}</div>
                <div className="mt-2 text-sm text-emerald-50/70">{subtitle}</div>
              </GlassCard>
            ))}
          </div>
        </GlassCard>
      </div>
    </Shell>
  );
}

function Placeholder({ title, screen, setScreen }: { title: string; screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <Shell screen={screen} setScreen={setScreen}>
      <GlassCard className="p-12 text-center">
        <div className="text-6xl font-black">{title}</div>
        <p className="mt-8 text-xl text-emerald-50/80">Additional ecosystem expansion continues here.</p>
      </GlassCard>
    </Shell>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [language, setLanguage] = useState<Language>("English");

  if (screen === "home") return <Home setScreen={setScreen} language={language} setLanguage={setLanguage} />;
  if (screen === "roles") return <Roles setScreen={setScreen} />;
  if (screen === "marketplace") return <Placeholder title="Marketplace" screen="marketplace" setScreen={setScreen} />;
  if (screen === "events") return <Placeholder title="Events" screen="events" setScreen={setScreen} />;
  if (screen === "nutrition") return <Placeholder title="Nutrition & Wellness" screen="nutrition" setScreen={setScreen} />;

  return null;
}
