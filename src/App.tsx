{/* =========================================================
   ADD THIS BELOW const IMG = { ... }
========================================================= */}

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
      {
        step: "Arrival Experience",
        detail:
          "Guests enter a cinematic ecosystem experience designed to create curiosity, inspiration, and connection.",
      },

      {
        step: "Explore The Farm",
        detail:
          "Visitors experience growers, youth workforce activities, marketplace systems, food production, and community participation.",
      },

      {
        step: "Engage With The Ecosystem",
        detail:
          "Guests interact with demonstrations, food systems, educational activities, wellness experiences, and marketplace participation.",
      },

      {
        step: "Discover Opportunities",
        detail:
          "Guests identify opportunities to volunteer, purchase, partner, return, or participate in future ecosystem activities.",
      },

      {
        step: "Return & Share",
        detail:
          "Guests become repeat participants who share the ecosystem with others and strengthen community visibility.",
      },
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
      {
        step: "Learn Growing Systems",
        detail:
          "Growers learn production systems, composting, infrastructure, protection, and sustainable agricultural concepts.",
      },

      {
        step: "Prepare Production Areas",
        detail:
          "Land preparation, infrastructure support, fencing, irrigation concepts, and soil-building systems are introduced.",
      },

      {
        step: "Participate In Production",
        detail:
          "Growers actively engage in ecosystem food production and collaborative growing systems.",
      },

      {
        step: "Connect To Marketplace",
        detail:
          "Food systems connect growers to customers, food access systems, and marketplace participation.",
      },

      {
        step: "Expand Ecosystem Participation",
        detail:
          "Growers become long-term ecosystem contributors and support future community production.",
      },
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
      {
        step: "Orientation & Expectations",
        detail:
          "Youth learn participation expectations, ecosystem standards, communication systems, and safety procedures.",
      },

      {
        step: "Hands-On Participation",
        detail:
          "Youth participate in production, marketplace systems, ecosystem support, teamwork, and operational activities.",
      },

      {
        step: "Leadership Development",
        detail:
          "Supervisors guide youth through teamwork, communication, leadership, responsibility, and workforce readiness.",
      },

      {
        step: "Growth & Reflection",
        detail:
          "Youth develop confidence, discipline, participation habits, and ecosystem understanding through structured engagement.",
      },

      {
        step: "Future Readiness",
        detail:
          "Youth complete the experience with stronger leadership, responsibility, and workforce confidence.",
      },
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
      {
        step: "Marketplace Entry",
        detail:
          "Customers enter a marketplace ecosystem designed around food access, participation, and community connection.",
      },

      {
        step: "Explore Products",
        detail:
          "Customers explore produce, seedlings, value-added products, and ecosystem participation opportunities.",
      },

      {
        step: "Learn & Participate",
        detail:
          "Nutrition education, demonstrations, and ecosystem engagement strengthen healthy participation.",
      },

      {
        step: "Support Ecosystem Growth",
        detail:
          "Marketplace participation supports growers, youth workforce systems, and local food movement.",
      },

      {
        step: "Return & Share",
        detail:
          "Customers become repeat ecosystem participants and expand community visibility.",
      },
    ],
  },

  partners: {
    title: "Partner Pathway",
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
      {
        step: "Connect To Mission",
        detail:
          "Partners explore ecosystem goals, community impact, and operational participation opportunities.",
      },

      {
        step: "Identify Collaboration",
        detail:
          "Educational systems, workforce collaboration, infrastructure, visibility, and operational opportunities are identified.",
      },

      {
        step: "Strengthen Ecosystem",
        detail:
          "Partners contribute resources, support, education, operational assistance, and ecosystem visibility.",
      },

      {
        step: "Expand Community Outcomes",
        detail:
          "Collaborative systems increase food access, visibility, participation, and ecosystem sustainability.",
      },

      {
        step: "Long-Term Participation",
        detail:
          "Partners continue strengthening the ecosystem through ongoing collaboration and visibility.",
      },
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
      {
        step: "Coordinate Daily Activities",
        detail:
          "Supervisors guide ecosystem participation, communication, assignments, and operational structure.",
      },

      {
        step: "Support Youth Development",
        detail:
          "Leadership, teamwork, responsibility, and communication development are actively supported.",
      },

      {
        step: "Monitor Participation",
        detail:
          "Participation, engagement, safety, communication, and operational involvement are monitored.",
      },

      {
        step: "Strengthen Ecosystem Structure",
        detail:
          "Supervisors maintain organization, workflow, participation quality, and operational consistency.",
      },

      {
        step: "Develop Future Readiness",
        detail:
          "Youth receive structured support that strengthens future leadership and workforce participation.",
      },
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
      {
        step: "Receive Program Information",
        detail:
          "Parents receive orientation information, participation expectations, and ecosystem visibility.",
      },

      {
        step: "Stay Connected",
        detail:
          "Communication systems support awareness of youth participation and ecosystem involvement.",
      },

      {
        step: "Monitor Participation",
        detail:
          "Families remain connected to youth growth, participation, leadership, and communication.",
      },

      {
        step: "Support Development",
        detail:
          "Parents support leadership growth, participation habits, and future readiness.",
      },

      {
        step: "Strengthen Community Participation",
        detail:
          "Families become active ecosystem supporters and strengthen long-term participation.",
      },
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

          <p className="mt-6 max-w-5xl text-lg leading-9 text-emerald-50/80">
            {role.purpose}
          </p>
        </div>

        {/* JOURNEY + RESOURCES */}
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

          {/* JOURNEY */}
          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-8 backdrop-blur-xl">

            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
              Guided Journey
            </div>

            <div className="mt-8 space-y-5">
              {role.journey.map((step, index) => (
                <div
                  key={step.step}
                  className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-100/60">
                    Step {index + 1}
                  </div>

                  <div className="mt-3 text-2xl font-bold leading-tight">
                    {step.step}
                  </div>

                  <div className="mt-4 text-base leading-8 text-emerald-50/80">
                    {step.detail}
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

            <div className="rounded-[2rem] border border-white/10 bg-black/25 p-8 backdrop-blur-xl">

              <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
                Ecosystem Resources
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
