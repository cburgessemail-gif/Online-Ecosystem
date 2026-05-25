import React, { useEffect, useState } from "react";

type Screen =
  | "home"
  | "roles"
  | "guest"
  | "grower"
  | "youth"
  | "customer"
  | "marketplace"
  | "partners"
  | "supervisor"
  | "parent";

type Language =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "עברית"
  | "Français";

const languages: Language[] = [
  "English",
  "Español",
  "Tagalog",
  "Italiano",
  "עברית",
  "Français",
];

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

function preloadAllImages() {
  Object.values(IMG).forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function Navigation({
  screen,
  setScreen,
}: {
  screen: Screen;
  setScreen: (screen: Screen) => void;
}) {
  const items: { key: Screen; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "roles", label: "Guided Tour" },
    { key: "guest", label: "Guest" },
    { key: "grower", label: "Grower" },
    { key: "youth", label: "Youth" },
    { key: "customer", label: "Customer" },
    { key: "marketplace", label: "Marketplace" },
    { key: "partners", label: "Partners" },
  ];

  return (
    <div className="mb-5 flex flex-wrap gap-3">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => setScreen(item.key)}
          className={`rounded-full px-6 py-3 font-black transition duration-300 ${
            screen === item.key
              ? "bg-white text-black"
              : "border border-white/10 bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {item.label}
        </button>
      ))}
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
      {/* BACKGROUND */}
      <div className="fixed inset-0">
        <img
          src={background}
          alt="Bronson Family Farm"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover scale-[1.02]"
        />
      </div>

      {/* DARK CINEMATIC OVERLAY */}
      <div className="fixed inset-0 bg-black/62" />

      {/* ATMOSPHERIC LIGHT */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.05),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,220,120,.05),transparent_20%),radial-gradient(circle_at_bottom,rgba(16,185,129,.06),transparent_28%)]" />

      {/* CONTENT */}
      <div className="relative z-10 w-full px-4 py-4 md:px-6 lg:px-8">
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
      className="group relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,.55)] transition duration-700 hover:scale-[1.01]"
      style={{ height }}
    >
      <img
        src={image}
        alt={title}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-left">
        <div className="text-3xl font-black leading-tight">
          {title}
        </div>

        {subtitle && (
          <div className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/85">
            {subtitle}
          </div>
        )}
      </div>
    </button>
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
      <section className="grid min-h-[calc(100vh-120px)] gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        {/* HERO */}
        <div className="h-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl">
          <div className="relative h-[calc(100vh-170px)] min-h-[760px]">
            <img
              src={IMG.hero}
              alt="Bronson Family Farm"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />

            <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12">
              <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/80">
                Connected Food Ecosystem Experience
              </div>

              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">
                Step Into The Farm.
                <br />
                Experience The Wonders Of Life.
              </h1>

              <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/90">
                A living ecosystem connecting youth workforce development,
                growers, marketplace systems, schools, wellness,
                agritourism, food access, leadership, and community revitalization.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => setScreen("roles")}
                  className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black shadow-2xl transition hover:scale-105"
                >
                  Begin Guided Tour
                </button>

                <button
                  onClick={() => setScreen("marketplace")}
                  className="rounded-full border border-white/10 bg-white/10 px-7 py-4 font-semibold backdrop-blur-xl transition hover:bg-white/20"
                >
                  Marketplace
                </button>

                <button
                  onClick={() => setScreen("partners")}
                  className="rounded-full border border-white/10 bg-white/10 px-7 py-4 font-semibold backdrop-blur-xl transition hover:bg-white/20"
                >
                  Partners
                </button>
              </div>
            </div>
          </div>

          {/* LOWER EXPERIENCE */}
          <div className="grid border-t border-white/10 md:grid-cols-3">
            <PhotoCard
              title="Grower Ecosystem"
              subtitle="Production, training, and local food access"
              image={IMG.growArea}
              height="270px"
              onClick={() => setScreen("grower")}
            />

            <PhotoCard
              title="Marketplace Movement"
              subtitle="Food moving toward families and destinations"
              image={IMG.marketplaceHero}
              height="270px"
              onClick={() => setScreen("marketplace")}
            />

            <PhotoCard
              title="Youth Workforce"
              subtitle="Leadership through participation"
              image={IMG.youth1}
              height="270px"
              onClick={() => setScreen("youth")}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex h-full flex-col gap-6">
          <div className="flex-1 overflow-auto rounded-[2rem] border border-white/10 bg-black/38 p-7 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
              Living Ecosystem Overview
            </div>

            <h2 className="mt-5 text-4xl font-black leading-tight">
              A place people want to return to.
            </h2>

            <p className="mt-6 text-lg leading-9 text-emerald-50/85">
              Bronson Family Farm connects workforce, agriculture,
              schools, wellness, marketplace systems, growers,
              leadership, and community participation into one immersive ecosystem.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Youth Workforce Development",
                "Marketplace & Distribution",
                "Schools & Community Food Access",
                "Grower Ecosystem",
                "Nutrition & Culinary Wellness",
                "Family Legacy & Land Restoration",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 text-xl font-semibold backdrop-blur-xl"
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
                        : "border border-white/10 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <PhotoCard
            title="Seeds, compost, partners, and people make the ecosystem real."
            subtitle="The work is operational, visible, and community-rooted."
            image={IMG.seeds}
            height="320px"
            onClick={() => setScreen("partners")}
          />
        </div>
      </section>
    </Shell>
  );
}

function Roles({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell
      screen="roles"
      setScreen={setScreen}
      background={IMG.ecosystem}
    >
      <div className="space-y-8">
        <div className="max-w-5xl">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">
            Guided Ecosystem Tour
          </div>

          <h1 className="mt-5 text-5xl font-black leading-[0.95] md:text-7xl">
            Every pathway leads somewhere meaningful.
          </h1>

          <p className="mt-8 text-xl leading-10 text-emerald-50/90">
            Guests, growers, youth, customers, partners, supervisors,
            and families all move through different experiences while strengthening the same ecosystem.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <PhotoCard
            title="Guest Pathway"
            subtitle="Explore the vision, purpose, and future of the farm."
            image={IMG.queens}
            height="460px"
            onClick={() => setScreen("guest")}
          />

          <PhotoCard
            title="Grower Pathway"
            subtitle="Learn how food production connects to opportunity."
            image={IMG.growAreaAlt}
            height="460px"
            onClick={() => setScreen("grower")}
          />

          <PhotoCard
            title="Youth Workforce"
            subtitle="Hands-on learning, responsibility, and leadership."
            image={IMG.youth2}
            height="460px"
            onClick={() => setScreen("youth")}
          />

          <PhotoCard
            title="Marketplace Journey"
            subtitle="Food moving through systems that support families."
            image={IMG.marketplaceHero}
            height="460px"
            onClick={() => setScreen("marketplace")}
          />

          <PhotoCard
            title="Partner Ecosystem"
            subtitle="Organizations and community building together."
            image={IMG.partners}
            height="460px"
            onClick={() => setScreen("partners")}
          />

          <PhotoCard
            title="Family Connection"
            subtitle="Parents and guardians connected to youth growth."
            image={IMG.sameera4}
            height="460px"
            onClick={() => setScreen("parent")}
          />
        </div>
      </div>
    </Shell>
  );
}

function Guest({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell
      screen="guest"
      setScreen={setScreen}
      background={IMG.queens}
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex min-h-[760px] flex-col justify-end rounded-[2.5rem] border border-white/10 bg-black/25 p-10 backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">
            Guest Journey
          </div>

          <h1 className="mt-5 text-6xl font-black leading-[0.9]">
            Experience the ecosystem before becoming part of it.
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-10 text-emerald-50/90">
            Guests explore the farm, wellness activities, marketplace,
            food systems, partnerships, and community participation.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => setScreen("marketplace")}
              className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black"
            >
              Enter Marketplace
            </button>

            <button
              onClick={() => setScreen("grower")}
              className="rounded-full border border-white/10 bg-white/10 px-7 py-4 font-semibold"
            >
              Become A Grower
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <PhotoCard
            title="Wellness & Reflection"
            subtitle="People reconnecting through shared experiences."
            image={IMG.queens}
            height="360px"
          />

          <PhotoCard
            title="Community Participation"
            subtitle="The ecosystem grows through engagement."
            image={IMG.sameera3}
            height="360px"
          />
        </div>
      </section>
    </Shell>
  );
}

function Grower({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell
      screen="grower"
      setScreen={setScreen}
      background={IMG.growArea}
    >
      <div className="space-y-8">
        <div className="max-w-5xl">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">
            Grower Ecosystem
          </div>

          <h1 className="mt-5 text-6xl font-black leading-[0.9]">
            Grow food. Build opportunity.
          </h1>

          <p className="mt-8 text-xl leading-10 text-emerald-50/90">
            Production, training, compost, fencing, tools,
            seedlings, education, and marketplace participation all connect together.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <PhotoCard
            title="Growing Systems"
            subtitle="Food production and land restoration."
            image={IMG.growArea}
            height="520px"
          />

          <PhotoCard
            title="Compost & Soil"
            subtitle="Healthy soil supports healthy food."
            image={IMG.compost}
            height="520px"
          />

          <PhotoCard
            title="Protection & Infrastructure"
            subtitle="Fencing, labor, and ecosystem support."
            image={IMG.fencing}
            height="520px"
          />
        </div>
      </div>
    </Shell>
  );
}

function Youth({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell
      screen="youth"
      setScreen={setScreen}
      background={IMG.youth1}
    >
      <div className="space-y-8">
        <div className="max-w-5xl">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">
            Youth Workforce Development
          </div>

          <h1 className="mt-5 text-6xl font-black leading-[0.9]">
            Leadership through participation.
          </h1>

          <p className="mt-8 text-xl leading-10 text-emerald-50/90">
            Youth build responsibility, teamwork, confidence,
            communication, and work readiness through real ecosystem participation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <PhotoCard
            title="Outdoor Learning"
            subtitle="Hands-on participation and leadership."
            image={IMG.youth1}
            height="520px"
          />

          <PhotoCard
            title="Supervisor Guidance"
            subtitle="Observation, coaching, and growth."
            image={IMG.volunteers}
            height="520px"
          />

          <PhotoCard
            title="Family Connection"
            subtitle="Parents and guardians remain connected."
            image={IMG.sameera5}
            height="520px"
          />
        </div>
      </div>
    </Shell>
  );
}

function Marketplace({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell
      screen="marketplace"
      setScreen={setScreen}
      background={IMG.marketplaceHero}
    >
      <div className="space-y-8">
        <div className="max-w-5xl">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">
            Marketplace Ecosystem
          </div>

          <h1 className="mt-5 text-6xl font-black leading-[0.9]">
            A growers supply market built for movement.
          </h1>

          <p className="mt-8 text-xl leading-10 text-emerald-50/90">
            The marketplace connects growers, customers, seedlings,
            food systems, wellness, and repeat participation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <PhotoCard
            title="Food Access"
            subtitle="Fresh produce and healthy choices."
            image={IMG.youth3}
            height="520px"
          />

          <PhotoCard
            title="Value Added Learning"
            subtitle="Flowers, mushrooms, herbs, and culinary exploration."
            image={IMG.culinaryFlowers}
            height="520px"
          />

          <PhotoCard
            title="Community Marketplace"
            subtitle="Connecting neighborhoods and growers."
            image={IMG.marketplaceHero}
            height="520px"
          />
        </div>
      </div>
    </Shell>
  );
}

function Partners({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <Shell
      screen="partners"
      setScreen={setScreen}
      background={IMG.csu}
    >
      <div className="space-y-8">
        <div className="max-w-5xl">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">
            Partner Ecosystem
          </div>

          <h1 className="mt-5 text-6xl font-black leading-[0.9]">
            Community collaboration powers the ecosystem.
          </h1>

          <p className="mt-8 text-xl leading-10 text-emerald-50/90">
            Schools, growers, universities, wellness organizations,
            media, compost, fencing, and volunteers strengthen the system together.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <PhotoCard
            title="Central State University"
            subtitle="Agriculture and workforce collaboration."
            image={IMG.csu}
            height="520px"
          />

          <PhotoCard
            title="Community Infrastructure"
            subtitle="Compost, fencing, volunteers, and restoration."
            image={IMG.compost2}
            height="520px"
          />

          <PhotoCard
            title="Media & Visibility"
            subtitle="Sharing the ecosystem story."
            image={IMG.wkbn}
            height="520px"
          />
        </div>
      </div>
    </Shell>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [language, setLanguage] = useState<Language>("English");

  useEffect(() => {
    preloadAllImages();
  }, []);

  if (screen === "roles") {
    return <Roles setScreen={setScreen} />;
  }

  if (screen === "guest") {
    return <Guest setScreen={setScreen} />;
  }

  if (screen === "grower") {
    return <Grower setScreen={setScreen} />;
  }

  if (screen === "youth") {
    return <Youth setScreen={setScreen} />;
  }

  if (screen === "marketplace") {
    return <Marketplace setScreen={setScreen} />;
  }

  if (screen === "partners") {
    return <Partners setScreen={setScreen} />;
  }

  return (
    <Home
      setScreen={setScreen}
      language={language}
      setLanguage={setLanguage}
    />
  );
}
