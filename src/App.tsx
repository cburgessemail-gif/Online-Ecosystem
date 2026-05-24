import React, { useState } from "react";

type Screen =
  | "home"
  | "roles"
  | "marketplace"
  | "events"
  | "nutrition";

type Language =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "Patwa"
  | "Hebrew";

function PillButton({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-3 text-sm font-medium backdrop-blur-md transition hover:scale-[1.01] ${
        active
          ? "border-emerald-200/30 bg-emerald-400/20 text-white"
          : "border-white/10 bg-white/10 text-white hover:bg-white/15"
      }`}
    >
      {children}
    </button>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-black/25 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {children}
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
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <PillButton
        active={screen === "home"}
        onClick={() => setScreen("home")}
      >
        Entrance
      </PillButton>

      <PillButton
        active={screen === "roles"}
        onClick={() => setScreen("roles")}
      >
        Role Pathways
      </PillButton>

      <PillButton
        active={screen === "marketplace"}
        onClick={() => setScreen("marketplace")}
      >
        Marketplace
      </PillButton>

      <PillButton
        active={screen === "events"}
        onClick={() => setScreen("events")}
      >
        Events
      </PillButton>

      <PillButton
        active={screen === "nutrition"}
        onClick={() => setScreen("nutrition")}
      >
        Nutrition
      </PillButton>
    </div>
  );
}

function EcosystemShell({
  children,
  screen,
  setScreen,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* BACKGROUND */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/GrowArea.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-emerald-950/70 to-black/90" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-8 md:px-10">

        <Navigation screen={screen} setScreen={setScreen} />

        {children}

      </div>
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function HomeScreen({
  setScreen,
  language,
  setLanguage,
}: {
  setScreen: (screen: Screen) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  const languages: Language[] = [
    "English",
    "Español",
    "Tagalog",
    "Italiano",
    "Patwa",
    "Hebrew",
  ];

  return (
    <EcosystemShell screen="home" setScreen={setScreen}>

      {/* HERO */}

      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">

        {/* LEFT */}

        <div className="rounded-[2.25rem] overflow-hidden border border-white/10 bg-black/25 shadow-2xl backdrop-blur-xl">

          {/* HERO IMAGE */}

          <div className="relative h-[560px]">

            <img
              src="/GrowArea.jpg"
              alt="Bronson Family Farm"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-10">

              <div className="uppercase tracking-[0.35em] text-emerald-100/70 text-xs">
                Connected Food Ecosystem Experience
              </div>

              <h1 className="mt-5 text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
                Bronson Family Farm
              </h1>

              <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/85">
                A living ecosystem connecting youth workforce development,
                growers, marketplace systems, schools, wellness,
                agritourism, food access, leadership,
                and community revitalization.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <button className="rounded-full bg-emerald-400 text-black px-6 py-3 font-bold">
                  Begin Guided Tour
                </button>

                <button
                  onClick={() => setScreen("roles")}
                  className="rounded-full border border-white/10 bg-white/10 px-6 py-3"
                >
                  Enter Ecosystem
                </button>

                <button
                  onClick={() => setScreen("marketplace")}
                  className="rounded-full border border-white/10 bg-white/10 px-6 py-3"
                >
                  Marketplace
                </button>

              </div>
            </div>
          </div>

          {/* IMAGE STRIP */}

          <div className="grid md:grid-cols-3 gap-0 border-t border-white/10">

            {[
              ["/SAM_0384.JPG", "Grower Ecosystem"],
              ["/SAM_0407.JPG", "Marketplace Movement"],
              ["/SAM_0401.JPG", "Youth Workforce"],
            ].map(([img, title]) => (

              <div
                key={title}
                className="relative h-[220px] overflow-hidden border-r border-white/10"
              >

                <img
                  src={img}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">

                  <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
                    Live Ecosystem
                  </div>

                  <div className="mt-2 text-2xl font-bold">
                    {title}
                  </div>

                </div>
              </div>

            ))}

          </div>
        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          {/* OVERVIEW */}

          <GlassCard className="p-7">

            <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
              Living Ecosystem Overview
            </div>

            <h2 className="mt-5 text-4xl font-black leading-tight">
              A place people want to return to.
            </h2>

            <p className="mt-6 text-lg leading-9 text-emerald-50/82">
              Bronson Family Farm connects workforce,
              agriculture, schools, wellness,
              marketplace systems, growers,
              leadership, and community participation
              into one immersive ecosystem.
            </p>

            <div className="mt-8 space-y-4">

              {[
                "Youth Workforce Development",
                "Marketplace & Distribution",
                "Schools & Community Food Access",
                "Grower Ecosystem",
                "Nutrition & Wellness",
                "Family Legacy & Land Restoration",
              ].map((item) => (

                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5"
                >
                  <div className="text-xl font-semibold">
                    {item}
                  </div>
                </div>

              ))}

            </div>

            {/* LANGUAGE */}

            <div className="mt-8">

              <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
                Language
              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                {languages.map((lang) => (

                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      language === lang
                        ? "bg-white text-black"
                        : "border border-white/10 bg-white/10 text-white"
                    }`}
                  >
                    {lang}
                  </button>

                ))}

              </div>
            </div>
          </GlassCard>

          {/* LIVE STATUS */}

          <div className="grid md:grid-cols-2 gap-4">

            {[
              ["50 Youth Active", "Summer Workforce Active"],
              ["Marketplace Preparing", "Distribution & Inventory"],
              ["Warm Growing Conditions", "Weather & Irrigation Active"],
              ["Schools Supported", "Community Destinations Active"],
            ].map(([title, subtitle]) => (

              <GlassCard key={title} className="p-5">

                <div className="uppercase tracking-[0.25em] text-emerald-100/65 text-xs">
                  Live Ecosystem
                </div>

                <div className="mt-3 text-2xl font-bold">
                  {title}
                </div>

                <div className="mt-2 text-sm text-emerald-50/70">
                  {subtitle}
                </div>

              </GlassCard>

            ))}

          </div>

          {/* COMMUNITY */}

          <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl">

            <div className="relative h-[300px]">

              <img
                src="/SAM_0415.JPG"
                alt="Community Support"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">

                <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
                  Ecosystem Movement
                </div>

                <div className="mt-3 text-3xl font-black">
                  Schools & Community Support Active
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* DAILY RHYTHM */}

      <section className="mt-24">

        <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
          Daily Ecosystem Rhythm
        </div>

        <h2 className="mt-5 text-5xl font-black">
          The ecosystem moves with purpose and structure.
        </h2>

        <div className="mt-12 grid lg:grid-cols-4 gap-5">

          {[
            ["/SAM_0391.JPG", "Morning Activation"],
            ["/SAM_0393.JPG", "Harvest Teams"],
            ["/SAM_0410.JPG", "Marketplace Preparation"],
            ["/SAM_0415.JPG", "Community Support"],
          ].map(([img, title]) => (

            <div
              key={title}
              className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl"
            >

              <img
                src={img}
                alt={title}
                className="h-[260px] w-full object-cover"
              />

              <div className="p-6">

                <div className="text-2xl font-bold">
                  {title}
                </div>

              </div>
            </div>

          ))}

        </div>
      </section>

      {/* FOOD FLOW */}

      <section className="mt-24">

        <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
          Food Destination Flow
        </div>

        <h2 className="mt-5 text-5xl font-black leading-tight">
          Grow → Harvest → Prepare → Marketplace → Schools → Families
        </h2>

        <div className="mt-12 grid lg:grid-cols-6 gap-4">

          {[
            ["/SAM_0384.JPG", "Grow"],
            ["/SAM_0393.JPG", "Harvest"],
            ["/SAM_0412.JPG", "Prepare"],
            ["/SAM_0407.JPG", "Marketplace"],
            ["/SAM_0415.JPG", "Schools"],
            ["/SAM_0417.JPG", "Families"],
          ].map(([img, title]) => (

            <div
              key={title}
              className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl"
            >

              <img
                src={img}
                alt={title}
                className="h-[220px] w-full object-cover"
              />

              <div className="p-5">

                <div className="text-2xl font-bold">
                  {title}
                </div>

              </div>
            </div>

          ))}

        </div>
      </section>

    </EcosystemShell>
  );
}

/* =========================================================
   ROLE PATHWAYS
========================================================= */

function RolePathwaysScreen({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <EcosystemShell screen="roles" setScreen={setScreen}>

      <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
        Ecosystem Role Pathways
      </div>

      <h1 className="mt-5 text-5xl md:text-6xl font-black leading-tight">
        Every pathway moves through the ecosystem.
      </h1>

      <div className="mt-14 grid lg:grid-cols-[1.05fr_0.95fr] gap-6">

        {/* YOUTH */}

        <GlassCard className="overflow-hidden">

          <img
            src="/SAM_0401.JPG"
            alt="Youth Workforce"
            className="h-[430px] w-full object-cover"
          />

          <div className="p-8">

            <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
              Youth Workforce Journey
            </div>

            <h2 className="mt-4 text-5xl font-black leading-tight">
              Youth participate in a real food ecosystem.
            </h2>

            <p className="mt-6 text-lg leading-9 text-emerald-50/82">
              Youth cultivate, harvest, prepare,
              organize, reflect, lead,
              and help move food toward marketplaces,
              schools, community destinations,
              and families.
            </p>

          </div>
        </GlassCard>

        {/* COMMAND CENTER */}

        <div className="space-y-6">

          <GlassCard className="p-7">

            <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
              Workforce Command Center
            </div>

            <h2 className="mt-4 text-4xl font-black">
              Operational ecosystem activity
            </h2>

            <div className="mt-8 grid gap-4">

              {[
                ["50 Youth Active", "Summer workforce session active"],
                ["PPE Verified", "Safety & readiness checks complete"],
                ["Marketplace Prep", "Distribution preparation active"],
                ["Leadership Challenge", "Team-based ecosystem activity"],
              ].map(([title, subtitle]) => (

                <GlassCard key={title} className="p-5">

                  <div className="text-2xl font-bold">
                    {title}
                  </div>

                  <div className="mt-2 text-sm text-emerald-50/70">
                    {subtitle}
                  </div>

                </GlassCard>

              ))}

            </div>
          </GlassCard>

        </div>
      </div>

    </EcosystemShell>
  );
}

/* =========================================================
   PLACEHOLDER
========================================================= */

function PlaceholderScreen({
  title,
  screen,
  setScreen,
}: {
  title: string;
  screen: Screen;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <EcosystemShell screen={screen} setScreen={setScreen}>

      <GlassCard className="p-12 text-center">

        <div className="text-6xl font-black">
          {title}
        </div>

        <p className="mt-8 text-xl text-emerald-50/80">
          Additional ecosystem expansion continues here.
        </p>

      </GlassCard>

    </EcosystemShell>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [language, setLanguage] = useState<Language>("English");

  if (screen === "home") {
    return (
      <HomeScreen
        setScreen={setScreen}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  if (screen === "roles") {
    return (
      <RolePathwaysScreen
        setScreen={setScreen}
      />
    );
  }

  if (screen === "events") {
    return (
      <PlaceholderScreen
        title="Events"
        screen="events"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "nutrition") {
    return (
      <PlaceholderScreen
        title="Nutrition & Wellness"
        screen="nutrition"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "marketplace") {
    return (
      <PlaceholderScreen
        title="Marketplace"
        screen="marketplace"
        setScreen={setScreen}
      />
    );
  }

  return null;
}
