import { useMemo, useState } from "react";

type LangKey =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "Patwa"
  | "Hebrew";

type SectionKey =
  | "entrance"
  | "youth"
  | "marketplace"
  | "growers"
  | "partners"
  | "nutrition"
  | "events";

type JourneyStep = {
  title: string;
  body: string;
  action: string;
};

type Section = {
  key: SectionKey;
  nav: string;
  eyebrow: string;
  description: string;
  image: string;
  imageLabel: string;
  need: string;
  benefit: string;
  destination: string;
  steps: JourneyStep[];
};

const LANGS: LangKey[] = [
  "English",
  "Español",
  "Tagalog",
  "Italiano",
  "Patwa",
  "Hebrew",
];

const img = (file: string) => `/images/${file}`;

const sections: Section[] = [
  {
    key: "entrance",
    nav: "Entrance",
    eyebrow: "LIVING ECOSYSTEM",
    description:
      "Bronson Family Farm is a living ecosystem connecting youth workforce development, growers, food movement, wellness, marketplace systems, partnerships, education, and community transformation.",
    image: img("SAM_0427.JPG"),
    imageLabel: "Farm entrance ecosystem experience",
    need:
      "People need a welcoming and understandable way to experience the ecosystem before deciding how to participate.",
    benefit:
      "The ecosystem creates visible pathways into food access, workforce development, community wellness, and local opportunity.",
    destination:
      "Choose a pathway and move from observer into participant.",
    steps: [
      {
        title: "The land introduces the story",
        body:
          "Visitors enter through a cinematic farm experience grounded in land, agriculture, youth development, and regional transformation.",
        action: "Understand the ecosystem purpose.",
      },
      {
        title: "The ecosystem becomes visible",
        body:
          "The visitor sees how growers, youth, wellness, markets, and community systems connect together.",
        action: "Choose a pathway.",
      },
      {
        title: "The visitor becomes part of the movement",
        body:
          "Every pathway leads toward participation, contribution, leadership, support, or continued engagement.",
        action: "Begin the journey.",
      },
    ],
  },

  {
    key: "youth",
    nav: "Youth Workforce",
    eyebrow: "8-WEEK CULTIVATOR PROGRAM",
    description:
      "The youth workforce pathway transforms agriculture into skill-building, responsibility, leadership, teamwork, and workforce readiness.",
    image: img("SAM_0417.JPG"),
    imageLabel: "Youth workforce development",
    need:
      "Youth need meaningful work that builds confidence, structure, discipline, and practical life skills.",
    benefit:
      "The ecosystem creates workforce development, leadership growth, and measurable progress through real-world experiences.",
    destination:
      "Youth complete the program and choose future roles as workers, growers, leaders, or entrepreneurs.",
    steps: [
      {
        title: "Safety and belonging",
        body:
          "Youth begin with PPE, expectations, structure, and understanding the deeper purpose of the ecosystem.",
        action: "Confirm readiness.",
      },
      {
        title: "Daily structure creates growth",
        body:
          "Each day includes assignments, supervision, teamwork, growing support, cleanup, and reflection.",
        action: "Build reliable habits.",
      },
      {
        title: "Growth becomes visible",
        body:
          "Youth begin understanding leadership, responsibility, and the impact of food systems on community wellness.",
        action: "Choose the next role.",
      },
    ],
  },

  {
    key: "marketplace",
    nav: "Marketplace",
    eyebrow: "CONNECTED FOOD MOVEMENT",
    description:
      "The marketplace connects seedlings, produce, Bubble Babies™, demonstrations, growers supply systems, QR engagement, and repeat customer participation.",
    image: img("ConnectFoodEcosystem_withimages.png"),
    imageLabel: "Connected ecosystem marketplace",
    need:
      "Customers and growers need easy access to food, supplies, education, and local participation.",
    benefit:
      "The marketplace creates repeat engagement, stronger food access, grower visibility, and ecosystem sustainability.",
    destination:
      "Shop, preorder, grow, volunteer, support youth, or join the ecosystem.",
    steps: [
      {
        title: "People encounter possibility",
        body:
          "Visitors experience seedlings, produce, demonstrations, wellness, and grower participation.",
        action: "Explore opportunities.",
      },
      {
        title: "Interest becomes participation",
        body:
          "QR systems and online ordering transform curiosity into purchasing and engagement.",
        action: "Place an order.",
      },
      {
        title: "The ecosystem grows through repetition",
        body:
          "Customers return because the ecosystem feels welcoming, educational, and community-centered.",
        action: "Stay connected.",
      },
    ],
  },

  {
    key: "growers",
    nav: "Growers",
    eyebrow: "GROWER SUPPORT PATHWAY",
    description:
      "The grower pathway supports home gardeners, new growers, small farms, and producers through practical demonstrations and market participation.",
    image: img("GrowArea2.jpg"),
    imageLabel: "Grow area ecosystem",
    need:
      "Growers need support, confidence, supplies, education, and pathways into local food systems.",
    benefit:
      "The ecosystem increases local production capacity and grower participation.",
    destination:
      "Growers evolve into educators, sellers, collaborators, and ecosystem partners.",
    steps: [
      {
        title: "Practical agriculture becomes approachable",
        body:
          "Growers learn soil preparation, transplanting, fencing, watering, and seasonal production strategies.",
        action: "Apply the lesson.",
      },
      {
        title: "Production becomes visible",
        body:
          "Growers use seedlings, demonstrations, and guidance to strengthen growing capacity.",
        action: "Increase production.",
      },
      {
        title: "The grower enters the ecosystem",
        body:
          "Growers become part of the local food movement through events, demonstrations, sales, or mentorship.",
        action: "Join the network.",
      },
    ],
  },

  {
    key: "partners",
    nav: "Partners",
    eyebrow: "COMMUNITY PARTNERSHIPS",
    description:
      "The partner pathway helps businesses, schools, foundations, health systems, and community organizations align with ecosystem outcomes.",
    image: img("Partners.png"),
    imageLabel: "Community partnership ecosystem",
    need:
      "Partners need visible and meaningful ways to support community transformation.",
    benefit:
      "Partnerships convert goodwill into measurable outcomes, infrastructure, and opportunities.",
    destination:
      "Partners support youth workforce, food access, wellness, infrastructure, and regional growth.",
    steps: [
      {
        title: "The mission becomes visible",
        body:
          "Partners understand how agriculture, workforce development, and wellness connect together.",
        action: "Identify alignment.",
      },
      {
        title: "Resources become operational",
        body:
          "Support turns into equipment, demonstrations, funding, education, wellness services, and infrastructure.",
        action: "Activate support.",
      },
      {
        title: "Community outcomes become visible",
        body:
          "The ecosystem demonstrates participation, education, wellness, and measurable transformation.",
        action: "Expand engagement.",
      },
    ],
  },

  {
    key: "nutrition",
    nav: "Nutrition",
    eyebrow: "HEALTH + WELLNESS",
    description:
      "Nutrition pathways connect fresh food, gardening, wellness education, family health, and community access.",
    image: img("Compost_ElliottGarden.png"),
    imageLabel: "Nutrition and wellness ecosystem",
    need:
      "Families need practical and affordable access to healthy food and wellness education.",
    benefit:
      "Nutrition becomes connected to local agriculture, family wellness, and healthier lifestyles.",
    destination:
      "Families grow, prepare, share, and experience healthier food choices together.",
    steps: [
      {
        title: "Fresh food becomes visible",
        body:
          "Visitors encounter produce, herbs, seedlings, and educational experiences.",
        action: "Choose healthier options.",
      },
      {
        title: "Food connects to wellness",
        body:
          "Nutrition education connects food to long-term health and family wellness.",
        action: "Apply the knowledge.",
      },
      {
        title: "Wellness spreads through families",
        body:
          "Healthy food and practical knowledge move through households and communities.",
        action: "Bring others into the ecosystem.",
      },
    ],
  },

  {
    key: "events",
    nav: "Events",
    eyebrow: "COMMUNITY EXPERIENCE",
    description:
      "Events activate the ecosystem through demonstrations, wellness, growers, seed giveaways, education, and marketplace participation.",
    image: img("Queens Village.png"),
    imageLabel: "Community ecosystem event",
    need:
      "Communities need welcoming and memorable entry points into the ecosystem.",
    benefit:
      "Events create visibility, trust, participation, registration, partnerships, and long-term engagement.",
    destination:
      "Visitors become growers, volunteers, customers, partners, or ecosystem supporters.",
    steps: [
      {
        title: "The invitation opens the gate",
        body:
          "Events create welcoming opportunities for the public to experience the ecosystem.",
        action: "Register or attend.",
      },
      {
        title: "The ecosystem becomes real",
        body:
          "Visitors encounter demonstrations, food, youth workforce, growers, wellness, and community participation.",
        action: "Engage with the ecosystem.",
      },
      {
        title: "The relationship continues",
        body:
          "Visitors return because the ecosystem creates belonging, purpose, and opportunity.",
        action: "Stay connected.",
      },
    ],
  },
];

export default function App() {
  const [lang, setLang] = useState<LangKey>("English");
  const [activeKey, setActiveKey] =
    useState<SectionKey>("entrance");

  const [stepIndex, setStepIndex] = useState(0);

  const active = useMemo(
    () =>
      sections.find((section) => section.key === activeKey) ??
      sections[0],
    [activeKey]
  );

  const currentStep = active.steps[stepIndex];

  const chooseSection = (key: SectionKey) => {
    setActiveKey(key);
    setStepIndex(0);
  };

  const next = () => {
    if (stepIndex < active.steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }

    const currentIndex = sections.findIndex(
      (section) => section.key === active.key
    );

    const nextSection =
      sections[(currentIndex + 1) % sections.length];

    chooseSection(nextSection.key);
  };

  const back = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      return;
    }

    const currentIndex = sections.findIndex(
      (section) => section.key === active.key
    );

    const previousSection =
      sections[
        (currentIndex - 1 + sections.length) %
          sections.length
      ];

    chooseSection(previousSection.key);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07140d] text-white">

      {/* BACKGROUND */}

      <div className="fixed inset-0 overflow-hidden">
        <img
          src={active.image}
          alt="Bronson Family Farm"
          className="h-full w-full object-cover object-center scale-[1.04] opacity-[0.72] transition-all duration-[12000ms]"
        />
      </div>

      <div
        className="fixed inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,.78) 0%, rgba(24,50,34,.38) 52%, rgba(0,0,0,.82) 100%)",
        }}
      />

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,.10),transparent_26%),radial-gradient(circle_at_78%_12%,rgba(255,233,168,.10),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,.14),transparent_32%)]" />

      {/* CONTENT */}

      <section className="relative z-10 min-h-screen">

        <div className="mx-auto flex w-full max-w-[1500px] flex-col px-5 py-6 md:px-8 lg:px-10">

          {/* HEADER */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs uppercase tracking-[.55em] text-lime-100/80">
                BRONSON FAMILY FARM
              </p>

              <h1 className="mt-5 max-w-7xl text-7xl font-black leading-[0.88] tracking-[-0.05em] text-white drop-shadow-2xl [text-shadow:0_8px_45px_rgba(0,0,0,.45)] md:text-8xl xl:text-[9rem]">

                Step Into The Farm.
                <br />
                Experience The Wonders Of Life.
              </h1>

              <div className="mt-5 text-2xl font-semibold text-emerald-100/90 md:text-3xl">
                Connected Food Ecosystem Experience
              </div>

              <p className="mt-8 max-w-4xl text-xl leading-9 text-white/84 md:text-2xl">
                {active.description}
              </p>
            </div>

            {/* LANGUAGES */}

            <div className="flex flex-wrap gap-2">

              {LANGS.map((item) => (
                <button
                  key={item}
                  onClick={() => setLang(item)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                    lang === item
                      ? "border-white bg-white text-[#092216]"
                      : "border-white/20 bg-white/10 text-white/80 backdrop-blur hover:bg-white/20"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2">

            {sections.map((section, index) => (
              <button
                key={section.key}
                onClick={() => chooseSection(section.key)}
                className={`shrink-0 rounded-full border px-5 py-3 text-sm font-bold transition ${
                  active.key === section.key
                    ? "border-lime-100 bg-lime-100 text-[#092216] shadow-[0_18px_45px_rgba(0,0,0,.28)]"
                    : "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20"
                }`}
              >
                <span className="mr-2 opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {section.nav}
              </button>
            ))}
          </nav>

          {/* MAIN EXPERIENCE */}

          <div className="mt-10 grid min-h-[940px] gap-8 lg:grid-cols-[1.02fr_.98fr]">

            {/* LEFT PANEL */}

            <div className="flex flex-col justify-center">

              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-5 py-3 text-xs font-black uppercase tracking-[.34em] text-lime-100 backdrop-blur-xl w-fit">

                <span className="h-2 w-2 rounded-full bg-lime-200 shadow-[0_0_18px_rgba(217,249,157,.85)]" />

                {active.eyebrow}
              </div>

              <div className="mt-8 grid gap-5">

                <InfoCard
                  title="Need Being Met"
                  value={active.need}
                />

                <InfoCard
                  title="Ecosystem Benefit"
                  value={active.benefit}
                />

                <InfoCard
                  title="Final Destination / Decision"
                  value={active.destination}
                />
              </div>
            </div>

            {/* RIGHT PANEL */}

            <div className="relative min-h-[760px]">

              {/* IMAGE CARD */}

              <div
                className="absolute right-0 top-0 h-[88%] w-[95%] overflow-hidden rounded-[4rem] border border-white/25 bg-cover bg-center shadow-[0_34px_90px_rgba(0,0,0,.45)]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.18)), url(${active.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#04110b]/38 via-transparent to-white/5" />

                <div className="absolute bottom-7 left-7 right-7">

                  <p className="text-xs uppercase tracking-[.3em] text-white/75">
                    {active.imageLabel}
                  </p>

                  <p className="mt-3 text-3xl font-black leading-tight">
                    {active.nav}
                  </p>
                </div>
              </div>

              {/* JOURNEY CARD */}

              <div className="absolute bottom-0 left-0 w-[92%] rounded-[3rem] border border-white/20 bg-[#f3f5e8]/88 p-6 text-[#092216] shadow-[0_30px_80px_rgba(0,0,0,.45)] md:p-8">

                <p className="text-xs font-black uppercase tracking-[.32em] text-emerald-900/65">
                  Pathway Journey
                </p>

                <h3 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                  {currentStep.title}
                </h3>

                <p className="mt-4 text-lg leading-8 text-[#244331]">
                  {currentStep.body}
                </p>

                {/* ACTION */}

                <div className="mt-5 rounded-[2rem] bg-[#0d3a26] p-5 text-white">

                  <p className="text-xs font-black uppercase tracking-[.28em] text-lime-100/75">
                    Next Action
                  </p>

                  <p className="mt-2 text-xl font-black">
                    {currentStep.action}
                  </p>
                </div>

                {/* ECOSYSTEM DECISION */}

                <div className="mt-6 rounded-[2rem] border border-emerald-900/10 bg-white p-5">

                  <p className="text-xs font-black uppercase tracking-[.28em] text-emerald-900/60">
                    Ecosystem Decision
                  </p>

                  <h3 className="mt-3 text-2xl font-black leading-tight">
                    What happens next?
                  </h3>

                  <p className="mt-4 text-lg leading-8 text-[#244331]">
                    Every participant eventually chooses whether to return,
                    contribute, grow, mentor, support, purchase, volunteer,
                    or become part of the long-term ecosystem.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">

                    <DecisionButton label="Become a Grower" />

                    <DecisionButton label="Support Youth Workforce" />

                    <DecisionButton label="Volunteer" />

                    <DecisionButton label="Marketplace" />
                  </div>
                </div>

                {/* NAVIGATION */}

                <div className="mt-6 flex flex-wrap gap-3">

                  <button
                    onClick={back}
                    className="rounded-full bg-[#0d3a26] px-6 py-3 font-black text-white shadow-lg"
                  >
                    Back
                  </button>

                  <button
                    onClick={next}
                    className="rounded-full bg-emerald-600 px-6 py-3 font-black text-white shadow-lg shadow-emerald-950/25"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/18 bg-white/12 p-6 shadow-xl backdrop-blur-2xl">

      <p className="text-[10px] font-black uppercase tracking-[.28em] text-lime-100/70">
        {title}
      </p>

      <p className="mt-3 text-lg leading-8 text-white/88">
        {value}
      </p>
    </div>
  );
}

function DecisionButton({
  label,
}: {
  label: string;
}) {
  return (
    <button className="rounded-full bg-[#0d3a26] px-5 py-3 font-black text-white">
      {label}
    </button>
  );
}
export default App;
