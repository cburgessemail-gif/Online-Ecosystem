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

const ROLE_CONTENT = {
  guest: {
    title: "Guest Pathway",
    image: IMG.queens,
    mission:
      "Guests experience the ecosystem through exploration, wellness, food systems, agritourism, and community participation.",
    purpose:
      "The guest pathway introduces visitors to the full ecosystem and encourages repeat participation, volunteering, marketplace engagement, and community connection.",
    resources: [
      "Guided Ecosystem Experience",
      "Marketplace Exploration",
      "Community Wellness Activities",
      "Food & Nutrition Education",
      "Agritourism Experiences",
      "Volunteer Participation",
      "Family Engagement Activities",
      "Community Events",
      "Youth Workforce Visibility",
      "Grower Demonstrations",
    ],
    journey: [
      [
        "Arrival Experience",
        "Guests enter a cinematic ecosystem experience designed to create curiosity, inspiration, and connection.",
      ],
      [
        "Explore The Farm",
        "Visitors experience growers, youth workforce activities, marketplace systems, food production, and community participation.",
      ],
      [
        "Engage With The Ecosystem",
        "Guests interact with demonstrations, food systems, educational activities, wellness experiences, and marketplace participation.",
      ],
      [
        "Discover Opportunities",
        "Guests identify opportunities to volunteer, purchase, partner, return, or participate in future ecosystem activities.",
      ],
      [
        "Return & Share",
        "Guests become repeat participants who share the ecosystem with others and strengthen community visibility.",
      ],
    ],
  },

  grower: {
    title: "Grower Pathway",
    image: IMG.growArea,
    mission:
      "Growers gain access to education, production systems, compost, protection systems, infrastructure, and marketplace participation.",
    purpose:
      "The grower pathway strengthens local food systems by helping growers produce successfully and connect to sustainable opportunities.",
    resources: [
      "Seeds & Seedlings",
      "Grower Education",
      "Compost & Soil Building",
      "Production Systems",
      "Infrastructure Support",
      "Fencing & Protection",
      "Marketplace Participation",
      "Distribution Opportunities",
      "Agricultural Collaboration",
      "Food Access Systems",
    ],
    journey: [
      [
        "Learn Growing Systems",
        "Growers learn production systems, composting, infrastructure, protection, and sustainable agricultural concepts.",
      ],
      [
        "Prepare Production Areas",
        "Land preparation, infrastructure support, fencing, irrigation concepts, and soil-building systems are introduced.",
      ],
      [
        "Participate In Production",
        "Growers actively engage in ecosystem food production and collaborative growing systems.",
      ],
      [
        "Connect To Marketplace",
        "Food systems connect growers to customers, food access systems, and marketplace participation.",
      ],
      [
        "Expand Ecosystem Participation",
        "Growers become long-term ecosystem contributors and support future community production.",
      ],
    ],
  },

  youth: {
    title: "Youth Workforce Pathway",
    image: IMG.youth1,
    mission:
      "Youth build leadership, responsibility, teamwork, confidence, and future readiness through ecosystem participation.",
    purpose:
      "The youth workforce pathway creates real-world participation that develops life skills, responsibility, leadership, and future opportunity.",
    resources: [
      "Supervisor Guidance",
      "Outdoor Learning",
      "Workforce Participation",
      "Leadership Development",
      "Team Building",
      "Daily Participation Tracking",
      "Safety Training",
      "Communication Development",
      "Parent / Guardian Connection",
      "Future Readiness",
    ],
    journey: [
      [
        "Orientation & Expectations",
        "Youth learn participation expectations, ecosystem standards, communication systems, and safety procedures.",
      ],
      [
        "Hands-On Participation",
        "Youth participate in production, marketplace systems, ecosystem support, teamwork, and operational activities.",
      ],
      [
        "Leadership Development",
        "Supervisors guide youth through teamwork, communication, leadership, responsibility, and workforce readiness.",
      ],
      [
        "Growth & Reflection",
        "Youth develop confidence, discipline, participation habits, and ecosystem understanding through structured engagement.",
      ],
      [
        "Future Readiness",
        "Youth complete the experience with stronger leadership, responsibility, and workforce confidence.",
      ],
    ],
  },

  customer: {
    title: "Customer Pathway",
    image: IMG.marketplaceHero,
    mission:
      "Customers gain access to fresh food, seedlings, nutrition education, marketplace systems, and healthy participation.",
    purpose:
      "The customer pathway strengthens repeat food access participation while supporting growers, marketplace systems, and community wellness.",
    resources: [
      "Fresh Produce",
      "Seedlings",
      "Marketplace Systems",
      "Nutrition Education",
      "Food Access",
      "Value Added Products",
      "Community Events",
      "Agritourism Participation",
      "Grower Support",
      "Ecosystem Participation",
    ],
    journey: [
      [
        "Marketplace Entry",
        "Customers enter a marketplace ecosystem designed around food access, participation, and community connection.",
      ],
      [
        "Explore Products",
        "Customers explore produce, seedlings, value-added products, and ecosystem participation opportunities.",
      ],
      [
        "Learn & Participate",
        "Nutrition education, demonstrations, and ecosystem engagement strengthen healthy participation.",
      ],
      [
        "Support Ecosystem Growth",
        "Marketplace participation supports growers, youth workforce systems, and local food movement.",
      ],
      [
        "Return & Share",
        "Customers become repeat ecosystem participants and expand community visibility.",
      ],
    ],
  },

  marketplace: {
    title: "Marketplace Ecosystem",
    image: IMG.marketplaceHero,
    mission:
      "The marketplace connects growers, customers, seedlings, food systems, wellness, and repeat participation.",
    purpose:
      "The marketplace pathway turns interest into food access, purchasing power, education, distribution, and long-term ecosystem sustainability.",
    resources: [
      "Growers Supply Market",
      "Fresh Produce",
      "Seedlings",
      "Value Added Learning",
      "Food Access Systems",
      "Marketplace Tables",
      "QR Engagement",
      "Community Buyers",
      "Grower Demonstrations",
      "Repeat Customer Pathways",
    ],
    journey: [
      [
        "Enter The Market",
        "Visitors enter the growers supply market and see the ecosystem in motion.",
      ],
      [
        "Explore Food & Tools",
        "Customers connect with produce, seedlings, supplies, demonstrations, and growers.",
      ],
      [
        "Learn Through Experience",
        "Marketplace participation includes food education, nutrition connection, and community learning.",
      ],
      [
        "Support Local Production",
        "Purchases and participation strengthen growers, youth workforce, and food access.",
      ],
      [
        "Return Again",
        "The marketplace becomes a repeat destination for families, growers, and partners.",
      ],
    ],
  },

  partners: {
    title: "Partner Ecosystem",
    image: IMG.partners,
    mission:
      "Partners strengthen the ecosystem through collaboration, education, infrastructure, wellness, workforce, and operational support.",
    purpose:
      "The partner pathway creates collaborative systems that strengthen long-term ecosystem sustainability and community outcomes.",
    resources: [
      "Educational Collaboration",
      "Infrastructure Support",
      "Media & Visibility",
      "Workforce Collaboration",
      "Food Access Support",
      "Operational Partnerships",
      "Community Collaboration",
      "Agricultural Support",
      "Wellness Integration",
      "Ecosystem Investment",
    ],
    journey: [
      [
        "Connect To Mission",
        "Partners explore ecosystem goals, community impact, and operational participation opportunities.",
      ],
      [
        "Identify Collaboration",
        "Educational systems, workforce collaboration, infrastructure, visibility, and operational opportunities are identified.",
      ],
      [
        "Strengthen Ecosystem",
        "Partners contribute resources, support, education, operational assistance, and ecosystem visibility.",
      ],
      [
        "Expand Community Outcomes",
        "Collaborative systems increase food access, visibility, participation, and ecosystem sustainability.",
      ],
      [
        "Long-Term Participation",
        "Partners continue strengthening the ecosystem through ongoing collaboration and visibility.",
      ],
    ],
  },

  supervisor: {
    title: "Supervisor Pathway",
    image: IMG.volunteers,
    mission:
      "Supervisors guide youth participation, leadership development, safety oversight, communication, and ecosystem engagement.",
    purpose:
      "The supervisor pathway supports youth workforce development through structured guidance, observation, and leadership support.",
    resources: [
      "Daily Participation Tracking",
      "Observation Systems",
      "Youth Communication",
      "Safety Oversight",
      "Leadership Support",
      "Participation Documentation",
      "Team Building",
      "Ecosystem Coordination",
      "Progress Monitoring",
      "Workforce Support",
    ],
    journey: [
      [
        "Coordinate Daily Activities",
        "Supervisors guide ecosystem participation, communication, assignments, and operational structure.",
      ],
      [
        "Support Youth Development",
        "Leadership, teamwork, responsibility, and communication development are actively supported.",
      ],
      [
        "Monitor Participation",
        "Participation, engagement, safety, communication, and operational involvement are monitored.",
      ],
      [
        "Strengthen Ecosystem Structure",
        "Supervisors maintain organization, workflow, participation quality, and operational consistency.",
      ],
      [
        "Develop Future Readiness",
        "Youth receive structured support that strengthens future leadership and workforce participation.",
      ],
    ],
  },

  parent: {
    title: "Parent / Guardian Pathway",
    image: IMG.sameera5,
    mission:
      "Parents and guardians remain connected to youth participation, communication, leadership, and development.",
    purpose:
      "The parent pathway strengthens family connection, communication, participation visibility, and youth support systems.",
    resources: [
      "Program Communication",
      "Participation Visibility",
      "Youth Progress Awareness",
      "Supervisor Communication",
      "Safety Communication",
      "Program Updates",
      "Family Engagement",
      "Community Participation",
      "Leadership Visibility",
      "Youth Development Support",
    ],
    journey: [
      [
        "Receive Program Information",
        "Parents receive orientation information, participation expectations, and ecosystem visibility.",
      ],
      [
        "Stay Connected",
        "Communication systems support awareness of youth participation and ecosystem involvement.",
      ],
      [
        "Monitor Participation",
        "Families remain connected to youth growth, participation, leadership, and communication.",
      ],
      [
        "Support Development",
        "Parents support leadership growth, participation habits, and future readiness.",
      ],
      [
        "Strengthen Community Participation",
        "Families become active ecosystem supporters and strengthen long-term participation.",
      ],
    ],
  },
};

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

      <div className="fixed inset-0 bg-black/22" />

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.05),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,220,120,.05),transparent_20%),radial-gradient(circle_at_bottom,rgba(16,185,129,.06),transparent_28%)]" />

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
      className="group relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,.45)] transition duration-700 hover:scale-[1.01]"
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-left">
        <div className="text-3xl font-black leading-tight">{title}</div>

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
        <div className="h-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/10 shadow-[0_40px_120px_rgba(0,0,0,.55)] backdrop-blur-md">
          <div className="relative h-[calc(100vh-170px)] min-h-[760px]">
            <img
              src={IMG.hero}
              alt="Bronson Family Farm"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />

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
                  className="rounded-full border border-white/10 bg-white/10 px-7 py-4 font-semibold backdrop-blur-md transition hover:bg-white/20"
                >
                  Marketplace
                </button>

                <button
                  onClick={() => setScreen("partners")}
                  className="rounded-full border border-white/10 bg-white/10 px-7 py-4 font-semibold backdrop-blur-md transition hover:bg-white/20"
                >
                  Partners
                </button>
              </div>
            </div>
          </div>

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

        <div className="flex h-full flex-col gap-6">
          <div className="flex-1 overflow-auto rounded-[2rem] border border-white/10 bg-black/8 p-7 shadow-[0_30px_80px_rgba(0,0,0,.35)] backdrop-blur-md">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
              Living Ecosystem Overview
            </div>

            <h2 className="mt-5 text-4xl font-black leading-tight">
              A place people want to return to.
            </h2>

            <p className="mt-6 text-lg leading-9 text-emerald-50/85">
              Bronson Family Farm connects workforce, agriculture, schools,
              wellness, marketplace systems, growers, leadership, and community
              participation into one immersive ecosystem.
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
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 text-xl font-semibold backdrop-blur-md"
                >
                  {item}
                </div>
              ))}
            </div>

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

function Roles({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="roles" setScreen={setScreen} background={IMG.ecosystem}>
      <section className="space-y-8">
        <div className="max-w-5xl">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">
            Guided Ecosystem Tour
          </div>

          <h1 className="mt-5 text-5xl font-black leading-[0.95] md:text-7xl">
            Every pathway leads somewhere meaningful.
          </h1>

          <p className="mt-8 text-xl leading-10 text-emerald-50/90">
            Guests, growers, youth, customers, partners, supervisors, and
            families move through connected ecosystem experiences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(
            [
              "guest",
              "grower",
              "youth",
              "customer",
              "marketplace",
              "partners",
              "supervisor",
              "parent",
            ] as Screen[]
          ).map((key) => {
            const role = ROLE_CONTENT[key as keyof typeof ROLE_CONTENT];

            return (
              <PhotoCard
                key={key}
                title={role.title}
                subtitle={role.mission}
                image={role.image}
                height="420px"
                onClick={() => setScreen(key)}
              />
            );
          })}
        </div>
      </section>
    </Shell>
  );
}

function RoleExperience({
  roleKey,
  setScreen,
}: {
  roleKey: keyof typeof ROLE_CONTENT;
  setScreen: (screen: Screen) => void;
}) {
  const role = ROLE_CONTENT[roleKey];

  return (
    <Shell
      screen={roleKey as Screen}
      setScreen={setScreen}
      background={role.image}
    >
      <section className="space-y-10">
        <div className="max-w-6xl">
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">
            Ecosystem Role Experience
          </div>

          <h1 className="mt-5 text-5xl font-black leading-[0.92] md:text-7xl">
            {role.title}
          </h1>

          <p className="mt-8 max-w-5xl text-xl leading-10 text-emerald-50/90">
            {role.mission}
          </p>

          <p className="mt-6 max-w-5xl text-lg leading-9 text-emerald-50/80">
            {role.purpose}
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-black/8 p-8 backdrop-blur-md">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
              Guided Journey
            </div>

            <div className="mt-8 space-y-5">
              {role.journey.map(([step, detail], index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-100/60">
                    Step {index + 1}
                  </div>

                  <div className="mt-3 text-2xl font-bold leading-tight">
                    {step}
                  </div>

                  <div className="mt-4 text-base leading-8 text-emerald-50/80">
                    {detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <PhotoCard
              title={role.title}
              subtitle={role.mission}
              image={role.image}
              height="320px"
            />

            <div className="rounded-[2rem] border border-white/10 bg-black/8 p-8 backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
                Ecosystem Resources
              </div>

              <div className="mt-8 grid gap-4">
                {role.resources.map((resource) => (
                  <div
                    key={resource}
                    className="rounded-2xl border border-white/10 bg-white/10 p-5 text-lg font-semibold backdrop-blur-md"
                  >
                    {resource}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
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

  if (
    screen === "guest" ||
    screen === "grower" ||
    screen === "youth" ||
    screen === "customer" ||
    screen === "marketplace" ||
    screen === "partners" ||
    screen === "supervisor" ||
    screen === "parent"
  ) {
    return (
      <RoleExperience
        roleKey={screen as keyof typeof ROLE_CONTENT}
        setScreen={setScreen}
      />
    );
  }

  return (
    <Home
      setScreen={setScreen}
      language={language}
      setLanguage={setLanguage}
    />
  );
}
