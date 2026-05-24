import React, { useState } from "react";

type Screen = "home" | "roles" | "marketplace" | "events" | "nutrition";
type Language = "English" | "Español" | "Tagalog" | "Italiano" | "Patwa" | "Hebrew";

const IMG = {
  hero: "/images/GrowArea.jpg",
  hero2: "/images/GrowArea2.jpg",
  grower: "/images/SAM_0384.JPG",
  harvest: "/images/SAM_0393.JPG",
  youth: "/images/SAM_0401.JPG",
  market: "/images/SAM_0407.JPG",
  prep: "/images/SAM_0412.JPG",
  community: "/images/SAM_0415.JPG",
  family: "/images/SAM_0417.JPG",
};

function bg(image: string) {
  return {
    backgroundImage: `linear-gradient(to top, rgba(0,0,0,.88), rgba(0,0,0,.3), rgba(0,0,0,.08)), url("${image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

function PillButton({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${active ? "border-emerald-300/40 bg-emerald-500/25 text-white" : "border-white/15 bg-white/10 text-white hover:bg-white/20"}`}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] border border-white/10 bg-black/35 shadow-2xl backdrop-blur-xl ${className}`}>{children}</div>;
}

function PhotoCard({ title, subtitle, image, height = "260px" }: { title: string; subtitle?: string; image: string; height?: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-emerald-950 shadow-xl" style={{ height, ...bg(image) }}>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-2xl font-black leading-tight">{title}</div>
        {subtitle && <div className="mt-2 text-sm leading-6 text-emerald-50/85">{subtitle}</div>}
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
      <PillButton active={screen === "events"} onClick={() => setScreen("events")}>Events</PillButton>
      <PillButton active={screen === "nutrition"} onClick={() => setScreen("nutrition")}>Nutrition</PillButton>
    </div>
  );
}

function Shell({ children, screen, setScreen }: { children: React.ReactNode; screen: Screen; setScreen: (screen: Screen) => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0" style={{ ...bg(IMG.hero), opacity: 0.55 }} />
      <div className="fixed inset-0 bg-gradient-to-br from-black/85 via-emerald-950/70 to-black/95" />
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
                  <button key={lang} onClick={() => setLanguage(lang)} className={`rounded-full px-4 py-2 text-sm transition ${language === lang ? "bg-white text-black" : "border border-white/10 bg-white/10 text-white"}`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["50 Youth Active", "Summer Workforce Active"],
              ["Marketplace Preparing", "Distribution & Inventory"],
              ["Warm Growing Conditions", "Weather & Irrigation Active"],
              ["Schools Supported", "Community Destinations Active"],
            ].map(([title, subtitle]) => (
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
        <div className="text
