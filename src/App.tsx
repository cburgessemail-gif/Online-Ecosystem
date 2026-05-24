import React, { useState } from "react";

type Screen = "home" | "roles" | "marketplace" | "events" | "nutrition" | "partners";
type Language = "English" | "Español" | "Tagalog" | "Italiano" | "Patwa" | "Hebrew";

const ASSET_BASE = "https://online-ecosystem.vercel.app/images";

const IMG = {
  hero: `${ASSET_BASE}/GrowArea.jpg`,
  hero2: `${ASSET_BASE}/GrowArea2.jpg`,
  ecosystem: `${ASSET_BASE}/ConnectFoodEcosystem_withimages.png`,
  partners: `${ASSET_BASE}/Partners.png`,
  grower: `${ASSET_BASE}/SAM_0384.JPG`,
  field: `${ASSET_BASE}/SAM_0380.JPG`,
  harvest: `${ASSET_BASE}/SAM_0393.JPG`,
  youth: `${ASSET_BASE}/SAM_0401.JPG`,
  market: `${ASSET_BASE}/SAM_0407.JPG`,
  prep: `${ASSET_BASE}/SAM_0412.JPG`,
  community: `${ASSET_BASE}/SAM_0415.JPG`,
  family: `${ASSET_BASE}/SAM_0417.JPG`,
  event: `${ASSET_BASE}/SAM_0420.JPG`,
  fencing: `${ASSET_BASE}/Deer%20Fencing.png`,
  fenceVolunteers: `${ASSET_BASE}/Fence_volunteers.png`,
  seeds: `${ASSET_BASE}/Seeds_Jubilee%20Gardens.png`,
  compost: `${ASSET_BASE}/Compost_ElliottGarden.png`,
  csu: `${ASSET_BASE}/CSU_MParker.png`,
  queens: `${ASSET_BASE}/Queens%20Village.png`,
  wkbn: `${ASSET_BASE}/WKBN%20Interview.png`,
};

function bg(image: string, position = "center") {
  return {
    backgroundImage: `linear-gradient(to top, rgba(0,0,0,.88), rgba(0,0,0,.32), rgba(0,0,0,.08)), url("${image}")`,
    backgroundSize: "cover",
    backgroundPosition: position,
  } as React.CSSProperties;
}

function PillButton({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
        active ? "border-emerald-300/40 bg-emerald-500/25 text-white" : "border-white/15 bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2rem] border border-white/10 bg-black/35 shadow-2xl backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function PhotoCard({ title, subtitle, image, height = "260px", position = "center" }: { title: string; subtitle?: string; image: string; height?: string; position?: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-emerald-950 shadow-xl" style={{ height, ...bg(image, position) }}>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-2xl font-black leading-tight">{title}</div>
        {subtitle ? <div className="mt-2 text-sm leading-6 text-emerald-50/85">{subtitle}</div> : null}
      </div>
    </div>
  );
}

function Navigation({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <PillButton active={screen === "home"} onClick={() => setScreen("home")}>Entrance</PillButton>
      <PillButton active={screen === "roles"} onClick={() => setScreen("roles")}>Role Pathways</PillButton>
      <PillButton active={screen === "marketplace"} onClick={() => setScreen("marketplace")}>Marketplace</PillButton>
      <PillButton active={screen === "partners"} onClick={() => setScreen("partners")}>Partners</PillButton>
      <PillButton active={screen === "events"} onClick={() => setScreen("events")}>Events</PillButton>
      <PillButton active={screen === "nutrition"} onClick={() => setScreen("nutrition")}>Nutrition</PillButton>
    </div>
  );
}

function Shell({ children, screen, setScreen }: { children: React.ReactNode; screen: Screen; setScreen: (screen: Screen) => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0" style={{ ...bg(IMG.hero), opacity: 0.55 }} />
      <div className="fixed inset-0 bg-gradient-to-br from-black/84 via-emerald-950/66 to-black/94" />
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-8 md:px-10">
        <Navigation screen={screen} setScreen={setScreen} />
        {children}
      </div>
    </div>
  );
}

function Home({ setScreen, language, setLanguage }: { setScreen: (screen: Screen) => void; language: Language; setLanguage: (language: Language) => void }) {
  const languages: Language[] = ["English", "Español", "Tagalog", "Italiano", "Patwa", "Hebrew"];

  return (
    <Shell screen="home" setScreen={setScreen}>
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/30 shadow-2xl backdrop-blur-xl">
          <div className="relative min-h-[620px]" style={bg(IMG.hero)}>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
              <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">Connected Food Ecosystem Experience</div>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Bronson Family Farm</h1>
              <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/90">
                A living ecosystem connecting youth workforce development, growers, marketplace systems, schools, wellness, agritourism, food access, leadership, and community revitalization.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-full bg-emerald-400 px-6 py-3 font-bold text-black">Begin Guided Tour</button>
                <button onClick={() => setScreen("roles")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold">Enter Ecosystem</button>
                <button onClick={() => setScreen("marketplace")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold">Marketplace</button>
              </div>
            </div>
          </div>

          <div className="grid border-t border-white/10 md:grid-cols-3">
            <PhotoCard title="Grower Ecosystem" subtitle="Production, training, and local food access" image={IMG.grower} height="250px" />
            <PhotoCard title="Marketplace Movement" subtitle="Food moving toward families and destinations" image={IMG.market} height="250px" />
            <PhotoCard title="Youth Workforce" subtitle="Leadership through participation" image={IMG.youth} height="250px" />
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-7">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Living Ecosystem Overview</div>
            <h2 className="mt-5 text-4xl font-black leading-tight">A place people want to return to.</h2>
            <p className="mt-6 text-lg leading-9 text-emerald-50/85">
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
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`rounded-full px-4 py-2 text-sm transition ${language === lang ? "bg-white text-black" : "border border-white/10 bg-white/10 text-white"}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {[["50 Youth Active", "Summer Workforce Active"], ["Marketplace Preparing", "Distribution & Inventory"], ["Warm Growing Conditions", "Weather & Irrigation Active"], ["Schools Supported", "Community Destinations Active"]].map(([title, subtitle]) => (
              <Card key={title} className="p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/65">Live Ecosystem</div>
                <div className="mt-3 text-2xl font-bold">{title}</div>
                <div className="mt-2 text-sm text-emerald-50/70">{subtitle}</div>
              </Card>
            ))}
          </div>

          <PhotoCard title="Schools & Community Support Active" subtitle="Food grown here moves toward the marketplace, schools, families, and community destinations." image={IMG.community} height="330px" />
        </div>
      </section>

      <section className="mt-24">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Daily Ecosystem Rhythm</div>
        <h2 className="mt-5 text-5xl font-black">The ecosystem moves with purpose and structure.</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          <PhotoCard title="Morning Activation" image={IMG.hero2} />
          <PhotoCard title="Team Deployment" image={IMG.harvest} />
          <PhotoCard title="Motivational Activity Block" image={IMG.prep} />
          <PhotoCard title="Marketplace Rotation" image={IMG.market} />
        </div>
      </section>

      <section className="mt-24">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Food Destination Flow</div>
        <h2 className="mt-5 text-5xl font-black leading-tight">Grow → Harvest → Prepare → Marketplace → Schools → Families</h2>
        <p className="mt-8 max-w-5xl text-xl leading-10 text-emerald-50/85">
          Youth and growers are not simply gardening. Food grown through the ecosystem supports marketplaces, schools, wellness initiatives, community events, and families.
        </p>
        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          <PhotoCard title="Grow" image={IMG.grower} />
          <PhotoCard title="Harvest" image={IMG.harvest} />
          <PhotoCard title="Prepare" image={IMG.prep} />
          <PhotoCard title="Marketplace" image={IMG.market} />
          <PhotoCard title="Schools" image={IMG.community} />
          <PhotoCard title="Families" image={IMG.family} />
        </div>
      </section>
    </Shell>
  );
}

function Roles({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="roles" setScreen={setScreen}>
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Ecosystem Role Pathways</div>
      <h1 className="mt-5 text-5xl font-black leading-tight md:text-6xl">Every pathway moves through the ecosystem.</h1>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden">
          <PhotoCard title="Youth Workforce Journey" subtitle="Youth participate in a real food ecosystem." image={IMG.youth} height="520px" />
          <div className="p-8">
            <h2 className="text-5xl font-black leading-tight">Youth participate in a real food ecosystem.</h2>
            <p className="mt-6 text-lg leading-9 text-emerald-50/82">
              Youth cultivate, harvest, prepare, organize, reflect, lead, and help move food toward marketplaces, schools, community destinations, and families.
            </p>
          </div>
        </Card>

        <Card className="p-7">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Workforce Command Center</div>
          <h2 className="mt-4 text-4xl font-black">Operational ecosystem activity</h2>
          <div className="mt-8 grid gap-4">
            {[["50 Youth Active", "Summer workforce session active"], ["PPE Verified", "Safety & readiness checks complete"], ["Marketplace Prep", "Distribution preparation active"], ["Leadership Challenge", "Team-based ecosystem activity"], ["Reflection Submitted", "Daily participation tracking"]].map(([title, subtitle]) => (
              <Card key={title} className="p-5">
                <div className="text-2xl font-bold">{title}</div>
                <div className="mt-2 text-sm text-emerald-50/70">{subtitle}</div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function Marketplace({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="marketplace" setScreen={setScreen}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <PhotoCard title="Marketplace & Distribution" subtitle="Food moves from field production into customers, schools, events, and community destinations." image={IMG.market} height="620px" />
        <Card className="p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Marketplace Pathway</div>
          <h1 className="mt-5 text-5xl font-black leading-tight">The marketplace is the ecosystem’s movement center.</h1>
          <p className="mt-6 text-xl leading-10 text-emerald-50/85">Youth-grown produce, grower products, value-added education, nutrition, and local purchasing connect here.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {["Fresh produce", "School destinations", "Community events", "Grower products", "SNAP-ready planning", "Family wellness"].map((item) => (
              <Card key={item} className="p-5 text-xl font-semibold">{item}</Card>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function Partners({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="partners" setScreen={setScreen}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <PhotoCard title="Partners & Community Support" subtitle="Partners help the ecosystem move from vision into infrastructure, education, and impact." image={IMG.partners} height="620px" />
        <Card className="p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Partner Pathway</div>
          <h1 className="mt-5 text-5xl font-black leading-tight">Partnership strengthens the whole ecosystem.</h1>
          <div className="mt-8 grid gap-4">
            {["Youth workforce support", "Infrastructure", "Food access", "Events", "Education", "Community wellness"].map((item) => <Card key={item} className="p-5 text-xl font-semibold">{item}</Card>)}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function Placeholder({ title, screen, setScreen }: { title: string; screen: Screen; setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen={screen} setScreen={setScreen}>
      <Card className="p-12 text-center">
        <div className="text-6xl font-black">{title}</div>
        <p className="mt-8 text-xl text-emerald-50/80">Additional ecosystem expansion continues here.</p>
      </Card>
    </Shell>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [language, setLanguage] = useState<Language>("English");

  if (screen === "home") return <Home setScreen={setScreen} language={language} setLanguage={setLanguage} />;
  if (screen === "roles") return <Roles setScreen={setScreen} />;
  if (screen === "marketplace") return <Marketplace setScreen={setScreen} />;
  if (screen === "partners") return <Partners setScreen={setScreen} />;
  if (screen === "events") return <Placeholder title="Events" screen="events" setScreen={setScreen} />;
  if (screen === "nutrition") return <Placeholder title="Nutrition & Wellness" screen="nutrition" setScreen={setScreen} />;

  return null;
}
