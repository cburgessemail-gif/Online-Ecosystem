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

/* =========================================================
   IMAGE PATHS
========================================================= */

const FARM_IMAGE = "/images/GrowArea.jpg";

const GROWER_IMAGE = "/images/SAM_0384.JPG";
const MARKETPLACE_IMAGE = "/images/SAM_0407.JPG";
const YOUTH_IMAGE = "/images/SAM_0401.JPG";
const COMMUNITY_IMAGE = "/images/SAM_0415.JPG";
const HARVEST_IMAGE = "/images/SAM_0393.JPG";
const MORNING_IMAGE = "/images/SAM_0391.JPG";
const PREP_IMAGE = "/images/SAM_0412.JPG";
const FAMILY_IMAGE = "/images/SAM_0417.JPG";

/* =========================================================
   UI
========================================================= */

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
      className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
        active
          ? "border-emerald-300/40 bg-emerald-500/25 text-white"
          : "border-white/15 bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-black/35 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function PhotoCard({
  title,
  subtitle,
  image,
  height = "260px",
}: {
  title: string;
  subtitle?: string;
  image: string;
  height?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-emerald-950"
      style={{ height }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.82,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-2xl font-black">
          {title}
        </div>

        {subtitle && (
          <div className="mt-2 text-sm text-emerald-50/85">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   NAVIGATION
========================================================= */

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

/* =========================================================
   SHELL
========================================================= */

function Shell({
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
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${FARM_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.42,
        }}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-emerald-950/75 to-black/95" />

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

function Home({
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
    <Shell screen="home" setScreen={setScreen}>

      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">

        {/* LEFT HERO */}

        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/35 shadow-2xl backdrop-blur-xl">

          <div className="relative h-[560px] overflow-hidden">

            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${FARM_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.9,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-10">

              <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/75">
                Connected Food Ecosystem Experience
              </div>

              <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Bronson Family Farm
              </h1>

              <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/90">
                A living ecosystem connecting youth workforce development,
                growers, marketplace systems, schools, wellness,
                agritourism, food access, leadership,
                and community revitalization.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <button className="rounded-full bg-emerald-400 px-6 py-3 font-bold text-black">
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

          {/* LOWER PANELS */}

          <div className="grid gap-0 border-t border-white/10 md:grid-cols-3">

            <PhotoCard
              title="Grower Ecosystem"
              subtitle="Production, training, and local food access"
              image={GROWER_IMAGE}
              height="230px"
            />

            <PhotoCard
              title="Marketplace Movement"
              subtitle="Food moving toward families and destinations"
              image={MARKETPLACE_IMAGE}
              height="230px"
            />

            <PhotoCard
              title="Youth Workforce"
              subtitle="Leadership through participation"
              image={YOUTH_IMAGE}
              height="230px"
            />

          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="space-y-6">

          <Card className="p-7">

            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
              Living Ecosystem Overview
            </div>

            <h2 className="mt-5 text-4xl font-black leading-tight">
              A place people want to return to.
            </h2>

            <p className="mt-6 text-lg leading-9 text-emerald-50/85">
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
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 text-xl font-semibold"
                >
                  {item}
                </div>

              ))}

            </div>

            {/* LANGUAGE */}

            <div className="mt-8">

              <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">
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
          </Card>

          {/* STATUS */}

          <div className="grid gap-4 md:grid-cols-2">

            {[
              ["50 Youth Active", "Summer Workforce Active"],
              ["Marketplace Preparing", "Distribution & Inventory"],
              ["Warm Growing Conditions", "Weather & Irrigation Active"],
              ["Schools Supported", "Community Destinations Active"],
            ].map(([title, subtitle]) => (

              <Card key={title} className="p-5">

                <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/65">
                  Live Ecosystem
                </div>

                <div className="mt-3 text-2xl font-bold">
                  {title}
                </div>

                <div className="mt-2 text-sm text-emerald-50/70">
                  {subtitle}
                </div>

              </Card>

            ))}

          </div>

          <PhotoCard
            title="Schools & Community Support Active"
            subtitle="Food grown here moves toward the marketplace, schools, families, and community destinations."
            image={COMMUNITY_IMAGE}
            height="300px"
          />

        </div>
      </section>

      {/* DAILY RHYTHM */}

      <section className="mt-24">

        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
          Daily Ecosystem Rhythm
        </div>

        <h2 className="mt-5 text-5xl font-black">
          The ecosystem moves with purpose and structure.
        </h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-4">

          <PhotoCard
            title="Morning Activation"
            image={MORNING_IMAGE}
          />

          <PhotoCard
            title="Team Deployment"
            image={HARVEST_IMAGE}
          />

          <PhotoCard
            title="Motivational Activity Block"
            image={PREP_IMAGE}
          />

          <PhotoCard
            title="Marketplace Rotation"
            image={MARKETPLACE_IMAGE}
          />

        </div>
      </section>

      {/* FOOD FLOW */}

      <section className="mt-24">

        <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
          Food Destination Flow
        </div>

        <h2 className="mt-5 text-5xl font-black leading-tight">
          Grow → Harvest → Prepare → Marketplace → Schools → Families
        </h2>

        <p className="mt-8 max-w-5xl text-xl leading-10 text-emerald-50/85">
          Youth and growers are not simply gardening.
          Food grown through the ecosystem supports marketplaces,
          schools, wellness initiatives, community events,
          and families.
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-6">

          <PhotoCard title="Grow" image={GROWER_IMAGE} />

          <PhotoCard title="Harvest" image={HARVEST_IMAGE} />

          <PhotoCard title="Prepare" image={PREP_IMAGE} />

          <PhotoCard title="Marketplace" image={MARKETPLACE_IMAGE} />

          <PhotoCard title="Schools" image={COMMUNITY_IMAGE} />

          <PhotoCard title="Families" image={FAMILY_IMAGE} />

        </div>
      </section>

    </Shell>
  );
}

/* =========================================================
   ROLES
========================================================= */

function Roles({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell screen="roles" setScreen={setScreen}>

      <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
        Ecosystem Role Pathways
      </div>

      <h1 className="mt-5 text-5xl font-black leading-tight md:text-6xl">
        Every pathway moves through the ecosystem.
      </h1>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

        <Card className="overflow-hidden">

          <PhotoCard
            title="Youth Workforce Journey"
            subtitle="Youth participate in a real food ecosystem."
            image={YOUTH_IMAGE}
            height="520px"
          />

          <div className="p-8">

            <h2 className="text-5xl font-black leading-tight">
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
        </Card>

        <Card className="p-7">

          <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">
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

              <Card key={title} className="p-5">

                <div className="text-2xl font-bold">
                  {title}
                </div>

                <div className="mt-2 text-sm text-emerald-50/70">
                  {subtitle}
                </div>

              </Card>

            ))}

          </div>
        </Card>
      </div>

    </Shell>
  );
}

/* =========================================================
   PLACEHOLDER
========================================================= */

function Placeholder({
  title,
  screen,
  setScreen,
}: {
  title: string;
  screen: Screen;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell screen={screen} setScreen={setScreen}>

      <Card className="p-12 text-center">

        <div className="text-6xl font-black">
          {title}
        </div>

        <p className="mt-8 text-xl text-emerald-50/80">
          Additional ecosystem expansion continues here.
        </p>

      </Card>

    </Shell>
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
      <Home
        setScreen={setScreen}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  if (screen === "roles") {
    return (
      <Roles
        setScreen={setScreen}
      />
    );
  }

  if (screen === "marketplace") {
    return (
      <Placeholder
        title="Marketplace"
        screen="marketplace"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "events") {
    return (
      <Placeholder
        title="Events"
        screen="events"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "nutrition") {
    return (
      <Placeholder
        title="Nutrition & Wellness"
        screen="nutrition"
        setScreen={setScreen}
      />
    );
  }

  return null;
}
