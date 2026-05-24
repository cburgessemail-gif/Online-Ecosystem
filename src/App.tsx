import React, { useState } from "react";

type Screen =
  | "home"
  | "roles"
  | "events"
  | "nutrition"
  | "marketplace";

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

      <PillButton
        active={screen === "marketplace"}
        onClick={() => setScreen("marketplace")}
      >
        Marketplace
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
      <section className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr]">

        {/* HERO */}

        <div className="rounded-[2.25rem] border border-white/10 bg-black/25 p-8 shadow-2xl backdrop-blur-xl md:p-10">

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

            <PillButton active>
              Begin Guided Tour
            </PillButton>

            <PillButton onClick={() => setScreen("roles")}>
              Enter Ecosystem
            </PillButton>

            <PillButton onClick={() => setScreen("marketplace")}>
              Marketplace
            </PillButton>

          </div>

          {/* LIVE STATUS */}

          <div className="mt-10 grid md:grid-cols-3 gap-4">

            {[
              ["50 Youth Active", "Summer Workforce Active"],
              ["Marketplace Preparing", "Distribution & Inventory"],
              ["Warm Growing Conditions", "Weather & Irrigation Active"],
              ["Schools Supported", "Community Destinations Active"],
              ["118 Acres Activated", "Operational Ecosystem"],
              ["Harvest Teams Active", "Daily Rhythm Active"],
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
        </div>

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
              <GlassCard key={item} className="p-5">
                <div className="text-xl font-semibold">
                  {item}
                </div>
              </GlassCard>
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
      </section>

      {/* DAILY RHYTHM */}

      <section className="mt-20">

        <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
          Daily Ecosystem Rhythm
        </div>

        <h2 className="mt-5 text-5xl font-black">
          The ecosystem moves with purpose and structure.
        </h2>

        <div className="mt-10 grid lg:grid-cols-4 gap-5">

          {[
            "Arrival Experience",
            "Morning Activation",
            "Team Deployment",
            "Motivational Activity Block",
            "Deep Work Session",
            "Marketplace Rotation",
            "Reflection Session",
            "Closing Circle",
          ].map((item) => (
            <GlassCard key={item} className="p-6">
              <div className="text-2xl font-bold leading-tight">
                {item}
              </div>
            </GlassCard>
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

        <p className="mt-8 max-w-5xl text-xl leading-10 text-emerald-50/82">
          Youth and growers are not simply gardening.
          Food grown through the ecosystem supports marketplaces,
          schools, wellness initiatives, community events,
          and families.
        </p>

        <div className="mt-12 grid lg:grid-cols-6 gap-4">

          {[
            ["/SAM_0384.JPG", "Grow"],
            ["/SAM_0393.JPG", "Harvest"],
            ["/SAM_0412.JPG", "Prepare"],
            ["/SAM_0407.JPG", "Marketplace"],
            ["/SAM_0415.JPG", "Schools"],
            ["/SAM_0417.JPG", "Families"],
          ].map(([img, title]) => (
            <GlassCard
              key={title}
              className="overflow-hidden"
            >

              <img
                src={img}
                className="h-[220px] w-full object-cover"
              />

              <div className="p-5">

                <div className="text-2xl font-bold">
                  {title}
                </div>

              </div>

            </GlassCard>
          ))}

        </div>
      </section>
    </EcosystemShell>
  );
}

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

            <div className="mt-8 grid md:grid-cols-2 gap-4">

              {[
                "Morning activation",
                "Cultivation teams",
                "Marketplace preparation",
                "Leadership challenges",
                "Motivational activity blocks",
                "Reflection sessions",
              ].map((item) => (
                <GlassCard key={item} className="p-5">
                  {item}
                </GlassCard>
              ))}

            </div>

            {/* ENDING */}

            <div className="mt-10">

              <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
                Ending Decision
              </div>

              <div className="mt-4 flex flex-wrap gap-3">

                {[
                  "Continue to Leadership",
                  "Explore Marketplace",
                  "Become Future Mentor",
                  "Join Grower Pathway",
                  "Return to Ecosystem",
                ].map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-white/10 bg-white/10 px-5 py-3 hover:bg-white/20"
                  >
                    {item}
                  </button>
                ))}

              </div>
            </div>
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
                ["Reflection Submitted", "Daily participation tracking"],
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

          {/* LIVE FEED */}

          <GlassCard className="p-7">

            <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
              Live Ecosystem Feed
            </div>

            <div className="mt-6 space-y-4">

              {[
                "Harvest Team active in Grow Zone 2",
                "Marketplace inventory updated",
                "Leadership challenge completed",
                "Produce prepared for school destination",
                "Community distribution preparing",
              ].map((item) => (
                <GlassCard key={item} className="p-4">
                  {item}
                </GlassCard>
              ))}

            </div>
          </GlassCard>
        </div>
      </div>
    </EcosystemShell>
  );
}

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
