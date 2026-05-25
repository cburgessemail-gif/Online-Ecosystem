/* =========================================================
   ROLE CONTENT + RESOURCES SECTION
   ADD THIS BELOW const IMG = { ... }
========================================================= */

const ROLE_CONTENT = {
  guest: {
    title: "Guest Pathway",
    image: IMG.queens,
    mission:
      "Guests experience the farm ecosystem through exploration, wellness, learning, food, and community participation.",

    resources: [
      "Guided Farm Experience",
      "Community Wellness Activities",
      "Marketplace Access",
      "Food & Nutrition Education",
      "Volunteer Opportunities",
      "Event Participation",
      "Agritourism Experiences",
      "Family Activities",
    ],

    journey: [
      "Arrive at the farm ecosystem",
      "Explore food systems and community spaces",
      "Participate in activities and demonstrations",
      "Connect with growers and youth workforce",
      "Decide whether to return, volunteer, purchase, or participate further",
    ],
  },

  grower: {
    title: "Grower Pathway",
    image: IMG.growArea,
    mission:
      "Growers gain access to production knowledge, tools, soil-building systems, market participation, and community support.",

    resources: [
      "Seeds & Seedlings",
      "Compost & Soil Building",
      "Grower Education",
      "Irrigation Concepts",
      "Fencing & Protection",
      "Marketplace Participation",
      "Distribution Opportunities",
      "Agricultural Training",
    ],

    journey: [
      "Learn growing systems",
      "Prepare land and production space",
      "Connect to compost and infrastructure",
      "Participate in food production",
      "Connect products to marketplace opportunities",
    ],
  },

  youth: {
    title: "Youth Workforce Pathway",
    image: IMG.youth1,
    mission:
      "Youth participate in hands-on learning, responsibility, teamwork, and leadership through real ecosystem participation.",

    resources: [
      "Supervisor Support",
      "Outdoor Learning",
      "Workforce Readiness",
      "Team Building",
      "Leadership Development",
      "Safety Training",
      "Daily Participation Tracking",
      "Parent/Guardian Connection",
    ],

    journey: [
      "Attend orientation",
      "Learn safety and participation standards",
      "Participate in ecosystem activities",
      "Develop responsibility and teamwork",
      "Build future readiness and leadership confidence",
    ],
  },

  customer: {
    title: "Customer Pathway",
    image: IMG.marketplaceHero,
    mission:
      "Customers gain access to fresh food, seedlings, nutrition education, marketplace systems, and repeat healthy participation.",

    resources: [
      "Fresh Produce",
      "Seedlings",
      "Grower Supply Market",
      "Nutrition Education",
      "Value Added Products",
      "Food Access Systems",
      "Marketplace Participation",
      "Community Events",
    ],

    journey: [
      "Enter marketplace ecosystem",
      "Explore products and growers",
      "Learn about food and nutrition",
      "Participate in purchasing and events",
      "Return through repeat ecosystem engagement",
    ],
  },

  partners: {
    title: "Partner Pathway",
    image: IMG.partners,
    mission:
      "Partners strengthen the ecosystem through collaboration, education, infrastructure, visibility, and community investment.",

    resources: [
      "Education Partnerships",
      "Community Collaboration",
      "Infrastructure Support",
      "Media & Visibility",
      "Workforce Collaboration",
      "Wellness Integration",
      "Food Access Support",
      "Operational Partnerships",
    ],

    journey: [
      "Connect with ecosystem mission",
      "Identify partnership opportunities",
      "Support operational ecosystem needs",
      "Strengthen community outcomes",
      "Expand long-term collaboration",
    ],
  },

  supervisor: {
    title: "Supervisor Pathway",
    image: IMG.volunteers,
    mission:
      "Supervisors guide, observe, support, and document youth workforce participation and development.",

    resources: [
      "Daily Tracking",
      "Observation Support",
      "Participation Documentation",
      "Safety Oversight",
      "Leadership Development",
      "Communication Tools",
      "Progress Monitoring",
      "Youth Support Systems",
    ],

    journey: [
      "Coordinate youth activities",
      "Track participation and engagement",
      "Support leadership and teamwork",
      "Document growth and progress",
      "Strengthen workforce readiness",
    ],
  },

  parent: {
    title: "Parent / Guardian Pathway",
    image: IMG.sameera5,
    mission:
      "Parents and guardians remain connected to youth development, participation, communication, and growth.",

    resources: [
      "Program Communication",
      "Participation Awareness",
      "Youth Progress Visibility",
      "Safety Communication",
      "Supervisor Connection",
      "Family Engagement",
      "Program Updates",
      "Community Participation",
    ],

    journey: [
      "Receive orientation information",
      "Understand ecosystem participation",
      "Monitor youth involvement",
      "Stay connected to communication systems",
      "Support youth development and leadership",
    ],
  },
};

/* =========================================================
   ADD THIS COMPONENT BELOW PhotoCard()
========================================================= */

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

        {/* HERO */}
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
        </div>

        {/* JOURNEY + RESOURCES */}
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

          {/* JOURNEY */}
          <div className="rounded-[2rem] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
              Guided Journey
            </div>

            <div className="mt-8 space-y-5">
              {role.journey.map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-100/60">
                    Step {index + 1}
                  </div>

                  <div className="mt-3 text-2xl font-bold leading-tight">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RESOURCES */}
          <div className="space-y-6">

            <PhotoCard
              title={role.title}
              subtitle={role.mission}
              image={role.image}
              height="320px"
            />

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
                Resources
              </div>

              <div className="mt-8 grid gap-4">
                {role.resources.map((resource) => (
                  <div
                    key={resource}
                    className="rounded-2xl border border-white/10 bg-white/10 p-5 text-lg font-semibold backdrop-blur-xl"
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

/* =========================================================
   REPLACE export default function App()
========================================================= */

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
    return (
      <RoleExperience
        roleKey="guest"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "grower") {
    return (
      <RoleExperience
        roleKey="grower"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "youth") {
    return (
      <RoleExperience
        roleKey="youth"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "customer") {
    return (
      <RoleExperience
        roleKey="customer"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "partners") {
    return (
      <RoleExperience
        roleKey="partners"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "supervisor") {
    return (
      <RoleExperience
        roleKey="supervisor"
        setScreen={setScreen}
      />
    );
  }

  if (screen === "parent") {
    return (
      <RoleExperience
        roleKey="parent"
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
