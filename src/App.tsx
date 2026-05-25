import { useMemo, useState } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "Patwa" | "Hebrew";
type SectionKey =
  | "entrance"
  | "youth"
  | "marketplace"
  | "growers"
  | "partners"
  | "nutrition"
  | "events";

type JourneyStep = {
  label: string;
  title: string;
  body: string;
  action: string;
};

type Section = {
  key: SectionKey;
  nav: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageLabel: string;
  need: string;
  benefit: string;
  destination: string;
  steps: JourneyStep[];
};

const img = (file: string) => `/images/${file}`;

const sections: Section[] = [
  {
    key: "entrance",
    nav: "Entrance",
    eyebrow: "LIVING ECOSYSTEM",
    title: "Step Into The Ecosystem.",
    description:
      "Bronson Family Farm is not a presentation. It is a living environment connecting youth workforce development, growers, food movement, schools, wellness, leadership, marketplace systems, and community transformation.",
    image: img("SAM_0427.JPG"),
    imageLabel: "SAM_0427.JPG",
    need: "People need a clear way to understand the farm as infrastructure, not just land or an event.",
    benefit:
      "The entrance experience shows how every role connects to food access, workforce, wellness, and regional opportunity.",
    destination:
      "Choose the role that fits you: youth, customer, grower, partner, volunteer, producer, or supporter.",
    steps: [
      {
        label: "Arrive",
        title: "See the place",
        body: "The visitor enters through the farm story, the land, the historic airport setting, and the community purpose.",
        action: "Understand why this ecosystem exists.",
      },
      {
        label: "Orient",
        title: "Choose a role",
        body: "The system presents pathways so each person can see where they belong and how they can participate.",
        action: "Select a pathway.",
      },
      {
        label: "Move",
        title: "Enter the model",
        body: "The visitor moves from watching into participating through a specific decision and next step.",
        action: "Begin a journey.",
      },
    ],
  },
  {
    key: "youth",
    nav: "Youth Workforce",
    eyebrow: "8-WEEK WORKFORCE PATHWAY",
    title: "Youth Learn By Building The Future.",
    description:
      "The youth workforce pathway turns farm work into skill-building: attendance, safety, teamwork, responsibility, communication, growing, harvesting, inventory, marketplace support, and leadership.",
    image: img("SAM_0417.JPG"),
    imageLabel: "SAM_0417.JPG",
    need: "Youth need meaningful work that builds discipline, confidence, real skills, and a connection to community.",
    benefit:
      "Supervisors can track growth, parents can understand progress, and youth can see their work become food, service, and opportunity.",
    destination:
      "Complete the program, earn progress evidence, and decide how to continue as a worker, grower, leader, volunteer, or entrepreneur.",
    steps: [
      {
        label: "Orientation",
        title: "Safety and belonging",
        body: "Youth begin with expectations, PPE, schedule, conduct, media releases, and the purpose of the farm.",
        action: "Confirm readiness.",
      },
      {
        label: "Daily Rhythm",
        title: "Show up and work",
        body: "Each day includes check-in, task assignment, teamwork, growing area support, cleanup, and reflection.",
        action: "Build reliable habits.",
      },
      {
        label: "Supervisor Assessment",
        title: "Track growth",
        body: "Supervisors use mobile-friendly observations for attendance, participation, safety, communication, initiative, and skill progress.",
        action: "Record progress.",
      },
      {
        label: "Reflection",
        title: "Know what changed",
        body: "Youth connect their work to food access, family, leadership, and future opportunity.",
        action: "Choose the next step.",
      },
    ],
  },
  {
    key: "marketplace",
    nav: "Marketplace",
    eyebrow: "FOOD MOVEMENT + SALES",
    title: "Marketplace Converts Interest Into Local Food Power.",
    description:
      "The marketplace pathway connects seedlings, produce, Bubble Babies™, grower supplies, community demand, preorders, pickup, SNAP-aware purchasing, and vendor participation.",
    image: img("ConnectFoodEcosystem_withimages.png"),
    imageLabel: "ConnectFoodEcosystem_withimages.png",
    need: "Customers and growers need a simple way to find food, supplies, knowledge, and purchasing opportunities.",
    benefit:
      "The marketplace creates repeat engagement, revenue, food access, and a visible reason for growers and families to return.",
    destination:
      "Shop, preorder, become a grower, support youth workforce development, and strengthen the regional food ecosystem.",
    steps: [
      {
        label: "Browse",
        title: "See what is available",
        body: "Customers view seedlings, produce, supplies, and educational offerings.",
        action: "Choose items or services.",
      },
      {
        label: "Order",
        title: "Move from interest to purchase",
        body: "QR codes and online store links help customers preorder or continue shopping after events.",
        action: "Place an order or request information.",
      },
      {
        label: "Pickup",
        title: "Connect online to on-site",
        body: "Pickup windows, inventory logic, and event check-in connect digital interest to real farm activity.",
        action: "Receive food or supplies.",
      },
      {
        label: "Return",
        title: "Build repeat behavior",
        body: "The customer becomes part of a cycle of healthy food, learning, and local support.",
        action: "Return, share, or join.",
      },
    ],
  },
  {
    key: "growers",
    nav: "Growers",
    eyebrow: "GROWER PATHWAY",
    title: "Growers Connect To Knowledge, Tools, And Market Access.",
    description:
      "The grower pathway helps small farms, gardeners, and community growers access practical education, supplies, demonstrations, seedlings, soil support, and market participation.",
    image: img("GrowArea2.jpg"),
    imageLabel: "GrowArea2.jpg",
    need: "Growers need more than encouragement. They need tools, training, inputs, confidence, and places to sell or share what they grow.",
    benefit:
      "The ecosystem strengthens local production capacity and helps community members move from interest to growing to market participation.",
    destination:
      "Decide whether to grow at home, sell through the ecosystem, join events, mentor youth, or become a formal grower partner.",
    steps: [
      {
        label: "Assess",
        title: "Where are you starting?",
        body: "The grower identifies land, containers, tools, soil needs, crop goals, and level of experience.",
        action: "Choose a starting point.",
      },
      {
        label: "Learn",
        title: "Receive practical knowledge",
        body: "Demonstrations, partners, and farm examples teach growing, compost, fencing, watering, pest prevention, and harvest basics.",
        action: "Apply the lesson.",
      },
      {
        label: "Produce",
        title: "Grow with support",
        body: "The grower uses supplies, seedlings, guidance, and seasonal planning to increase production.",
        action: "Bring produce or knowledge back into the system.",
      },
      {
        label: "Participate",
        title: "Join the local food network",
        body: "Growers can sell, volunteer, mentor, demonstrate, or collaborate.",
        action: "Become part of the ecosystem.",
      },
    ],
  },
  {
    key: "partners",
    nav: "Partners",
    eyebrow: "PARTNER + INVESTOR PATHWAY",
    title: "Partners Align Resources With Community Outcomes.",
    description:
      "The partner pathway gives funders, schools, businesses, city departments, foundations, universities, and service providers a clear way to support the ecosystem.",
    image: img("Partners.png"),
    imageLabel: "Partners.png",
    need: "Partners need specific, credible, visible ways to contribute without guessing what the farm needs.",
    benefit:
      "Partnerships convert goodwill into equipment, funding, demonstrations, workforce support, wellness services, infrastructure, and measurable outcomes.",
    destination:
      "Choose a support lane: funding, equipment, volunteers, training, health education, youth support, infrastructure, or marketplace participation.",
    steps: [
      {
        label: "Understand",
        title: "See the whole model",
        body: "Partners first understand that the farm connects food, workforce, wellness, education, and economic opportunity.",
        action: "Identify alignment.",
      },
      {
        label: "Choose",
        title: "Select a contribution lane",
        body: "A partner may provide equipment, supplies, funding, demonstrations, youth support, transportation, health services, or communications.",
        action: "Commit to a lane.",
      },
      {
        label: "Activate",
        title: "Turn support into action",
        body: "The support becomes part of operations, events, youth training, marketplace growth, or infrastructure.",
        action: "Implement support.",
      },
      {
        label: "Measure",
        title: "Report impact",
        body: "The ecosystem shows how support created participation, learning, food access, or capacity.",
        action: "Continue or expand partnership.",
      },
    ],
  },
  {
    key: "nutrition",
    nav: "Nutrition",
    eyebrow: "HEALTH + FOOD ACCESS",
    title: "Nutrition Becomes Practical, Visible, And Local.",
    description:
      "The nutrition pathway connects fresh food, gardening, wellness education, screenings, family health, cooking, value-added learning, and culturally relevant food access.",
    image: img("Compost_ElliottGarden.png"),
    imageLabel: "Compost_ElliottGarden.png",
    need: "Families need access to fresh food and simple education that connects growing, eating, health, and household decisions.",
    benefit:
      "Nutrition becomes part of the ecosystem through produce, demonstrations, wellness partners, youth learning, and marketplace access.",
    destination:
      "Choose healthier food, learn how to grow it, share it with family, or connect to wellness partners and community resources.",
    steps: [
      {
        label: "Access",
        title: "Find fresh food",
        body: "Families encounter seedlings, produce, herbs, greens, and seasonal food opportunities.",
        action: "Choose food or plants.",
      },
      {
        label: "Learn",
        title: "Understand the value",
        body: "Nutrition education connects food to blood pressure, diabetes, family meals, energy, and long-term wellness.",
        action: "Apply the lesson at home.",
      },
      {
        label: "Prepare",
        title: "Make it usable",
        body: "Cooking, preservation, value-added demonstrations, and simple recipes turn produce into family practice.",
        action: "Use the food.",
      },
      {
        label: "Share",
        title: "Spread the benefit",
        body: "Families share knowledge, food, and confidence across households and community networks.",
        action: "Return and bring others.",
      },
    ],
  },
  {
    key: "events",
    nav: "Events",
    eyebrow: "EXPERIENCE + COMMUNITY ACTIVATION",
    title: "Events Turn The Ecosystem Into A Shared Experience.",
    description:
      "Events bring people onto the land for demonstrations, growers supply market activity, seed giveaways, youth visibility, music, wellness, education, vendors, and partner engagement.",
    image: img("Queens Village.png"),
    imageLabel: "Queens Village.png",
    need: "The community needs welcoming entry points where people can experience the farm before deciding how to participate.",
    benefit:
      "Events create trust, visibility, relationships, registrations, sales, volunteer interest, partner alignment, and repeat engagement.",
    destination:
      "Register, attend, volunteer, vend, sponsor, join a pathway, or invite others into the farm ecosystem.",
    steps: [
      {
        label: "Invite",
        title: "Bring people in",
        body: "Flyers, QR codes, Eventbrite, partners, and word of mouth invite the community into the experience.",
        action: "Register or share.",
      },
      {
        label: "Check In",
        title: "Create a clean entry",
        body: "QR check-in helps the farm understand attendance, roles, interests, and follow-up needs.",
        action: "Scan and enter.",
      },
      {
        label: "Experience",
        title: "Move through stations",
        body: "Visitors encounter demonstrations, food, growers, youth workforce, partners, music, wellness, and marketplace activity.",
        action: "Engage with the ecosystem.",
      },
      {
        label: "Follow Up",
        title: "Keep the relationship alive",
        body: "After the event, participants receive next steps: shop, volunteer, partner, grow, sponsor, or return.",
        action: "Choose next action.",
      },
    ],
  },
];

const ui: Record<
  LangKey,
  {
    demo: string;
    choose: string;
    need: string;
    benefit: string;
    destination: string;
    journey: string;
    nextAction: string;
    guided: string;
    back: string;
    next: string;
    operations: string;
    feedback: string;
    feedbackTitle: string;
  }
> = {
  English: {
    demo: "BRONSON FAMILY FARM",
    choose: "Choose a pathway",
    need: "Need Being Met",
    benefit: "Ecosystem Benefit",
    destination: "Final Destination / Decision",
    journey: "Pathway Journey",
    nextAction: "Next Action",
    guided: "Guided Tour",
    back: "Back",
    next: "Next",
    operations: "Operational Ecosystem",
    feedback: "Share feedback / connect with us",
    feedbackTitle: "What do you want to do next?",
  },
  Español: {
    demo: "BRONSON FAMILY FARM",
    choose: "Elija una ruta",
    need: "Necesidad Atendida",
    benefit: "Beneficio del Ecosistema",
    destination: "Destino / Decisión Final",
    journey: "Ruta de Experiencia",
    nextAction: "Próxima Acción",
    guided: "Recorrido Guiado",
    back: "Atrás",
    next: "Siguiente",
    operations: "Ecosistema Operativo",
    feedback: "Comparta comentarios / comuníquese",
    feedbackTitle: "¿Qué desea hacer ahora?",
  },
  Tagalog: {
    demo: "BRONSON FAMILY FARM",
    choose: "Pumili ng pathway",
    need: "Pangangailangan",
    benefit: "Benepisyo ng Ecosystem",
    destination: "Huling Desisyon",
    journey: "Pathway Journey",
    nextAction: "Susunod na Gawin",
    guided: "Gabay na Paglalakbay",
    back: "Bumalik",
    next: "Susunod",
    operations: "Operational Ecosystem",
    feedback: "Magbigay ng feedback / kumonekta",
    feedbackTitle: "Ano ang gusto mong gawin sunod?",
  },
  Italiano: {
    demo: "BRONSON FAMILY FARM",
    choose: "Scegli un percorso",
    need: "Bisogno Soddisfatto",
    benefit: "Beneficio dell'Ecosistema",
    destination: "Destinazione / Decisione",
    journey: "Percorso",
    nextAction: "Prossima Azione",
    guided: "Tour Guidato",
    back: "Indietro",
    next: "Avanti",
    operations: "Ecosistema Operativo",
    feedback: "Condividi feedback / contattaci",
    feedbackTitle: "Cosa vuoi fare dopo?",
  },
  Patwa: {
    demo: "BRONSON FAMILY FARM",
    choose: "Choose a pathway",
    need: "Need Being Met",
    benefit: "Ecosystem Benefit",
    destination: "Final Destination / Decision",
    journey: "Pathway Journey",
    nextAction: "Next Action",
    guided: "Guided Tour",
    back: "Back",
    next: "Next",
    operations: "Operational Ecosystem",
    feedback: "Share feedback / connect",
    feedbackTitle: "What do you want to do next?",
  },
  Hebrew: {
    demo: "BRONSON FAMILY FARM",
    choose: "בחר מסלול",
    need: "צורך שמקבל מענה",
    benefit: "תועלת לאקוסיסטם",
    destination: "יעד / החלטה",
    journey: "מסלול",
    nextAction: "הפעולה הבאה",
    guided: "סיור מודרך",
    back: "חזרה",
    next: "הבא",
    operations: "אקוסיסטם תפעולי",
    feedback: "שתף משוב / צור קשר",
    feedbackTitle: "מה תרצה לעשות עכשיו?",
  },
};

function App() {
  const [lang, setLang] = useState<LangKey>("English");
  const [activeKey, setActiveKey] = useState<SectionKey>("entrance");
  const [stepIndex, setStepIndex] = useState(0);

  const active = useMemo(
    () => sections.find((section) => section.key === activeKey) ?? sections[0],
    [activeKey]
  );

  const words = ui[lang];
  const rtl = lang === "Hebrew";

  const chooseSection = (key: SectionKey) => {
    setActiveKey(key);
    setStepIndex(0);
  };

  const goNext = () => {
    if (stepIndex < active.steps.length - 1) {
      setStepIndex((value) => value + 1);
      return;
    }

    const currentIndex = sections.findIndex((section) => section.key === active.key);
    const nextSection = sections[(currentIndex + 1) % sections.length];
    chooseSection(nextSection.key);
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((value) => value - 1);
      return;
    }

    const currentIndex = sections.findIndex((section) => section.key === active.key);
    const previousSection = sections[(currentIndex - 1 + sections.length) % sections.length];
    chooseSection(previousSection.key);
  };

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-[#001b12] text-white">
      <section
        className="relative min-h-screen overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,18,12,.88), rgba(0,46,29,.70), rgba(0,0,0,.28)), url("${active.image}")`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(155,207,147,.16),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(255,236,179,.12),transparent_24%)]" />

        <header className="relative z-10 flex flex-col gap-6 px-6 py-8 md:px-10 lg:px-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[.42em] text-emerald-300/85">
                {words.demo}
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Connected Ecosystem Experience
              </h1>
            </div>

            <nav className="flex flex-wrap gap-3">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => chooseSection(section.key)}
                  className={`rounded-full border px-5 py-3 text-sm transition ${
                    active.key === section.key
                      ? "border-emerald-300 bg-emerald-500/25 shadow-[0_0_25px_rgba(16,185,129,.35)]"
                      : "border-white/15 bg-white/10 hover:bg-white/15"
                  }`}
                >
                  {section.nav}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap gap-3">
            {(Object.keys(ui) as LangKey[]).map((item) => (
              <button
                key={item}
                onClick={() => setLang(item)}
                className={`rounded-full border px-5 py-2 text-sm transition ${
                  lang === item
                    ? "border-white bg-white text-[#042016]"
                    : "border-white/15 bg-white/10 hover:bg-white/15"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <div className="relative z-10 px-6 pb-12 md:px-10 lg:px-14">
          <section className="max-w-5xl pt-4 md:pt-8">
            <p className="text-sm uppercase tracking-[.45em] text-emerald-300/85">
              {active.eyebrow}
            </p>
            <h2 className="mt-7 max-w-5xl text-5xl font-black leading-[.95] tracking-tight md:text-7xl lg:text-8xl">
              {active.title}
            </h2>
            <p className="mt-8 max-w-4xl text-xl leading-9 text-white/86 md:text-2xl">
              {active.description}
            </p>
          </section>

          <section className="mt-14 overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1.12fr_.88fr]">
              <div
                className="min-h-[380px] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.10)), url("${active.image}")`,
                }}
              >
                <div className="p-8 text-xs uppercase tracking-[.22em] text-white/90 drop-shadow">
                  {active.imageLabel}
                </div>
              </div>

              <div className="bg-[#0b3b25]/95 p-8 md:p-10">
                <p className="text-sm uppercase tracking-[.35em] text-emerald-200/80">
                  {words.choose}
                </p>
                <h3 className="mt-4 text-3xl font-black md:text-4xl">{active.nav}</h3>

                <div className="mt-8 grid gap-4">
                  <InfoBlock label={words.need} value={active.need} />
                  <InfoBlock label={words.benefit} value={active.benefit} />
                  <InfoBlock label={words.destination} value={active.destination} />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/15 bg-[#eff8d8]/95 p-7 text-[#062318] shadow-2xl">
              <p className="text-sm uppercase tracking-[.3em] text-emerald-900/70">
                {words.journey}
              </p>
              <h3 className="mt-4 text-3xl font-black">
                {active.steps[stepIndex].title}
              </h3>
              <p className="mt-5 text-lg leading-8 text-[#163b2a]">
                {active.steps[stepIndex].body}
              </p>

              <div className="mt-7 rounded-3xl bg-[#0b3b25] p-5 text-white">
                <p className="text-xs uppercase tracking-[.28em] text-emerald-200/80">
                  {words.nextAction}
                </p>
                <p className="mt-2 text-xl font-bold">
                  {active.steps[stepIndex].action}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={goBack}
                  className="rounded-full bg-[#0b3b25] px-6 py-3 font-bold text-white"
                >
                  {words.back}
                </button>
                <button
                  onClick={goNext}
                  className="rounded-full bg-emerald-600 px-6 py-3 font-bold text-white"
                >
                  {words.next}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[.3em] text-emerald-200/80">
                {words.guided}
              </p>

              <div className="mt-6 grid gap-4">
                {active.steps.map((step, index) => (
                  <button
                    key={step.label}
                    onClick={() => setStepIndex(index)}
                    className={`rounded-3xl border p-5 text-left transition ${
                      index === stepIndex
                        ? "border-emerald-300 bg-emerald-500/25"
                        : "border-white/10 bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm uppercase tracking-[.26em] text-emerald-200">
                        {step.label}
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                        {index + 1}/{active.steps.length}
                      </span>
                    </div>
                    <h4 className="mt-3 text-xl font-black">{step.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-white/75">
                      {step.body}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/15 bg-[#061f16]/92 p-7 shadow-2xl">
            <p className="text-sm uppercase tracking-[.3em] text-emerald-200/80">
              {words.operations}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Operation
                title="QR Check-In"
                body="Eventbrite-style entry, role identification, attendance, and follow-up."
              />
              <Operation
                title="Supervisor Mobile Tracking"
                body="Daily youth observations, participation, safety, skills, and notes."
              />
              <Operation
                title="Marketplace Flow"
                body="Preorders, pickup, inventory visibility, customer return, and grower supply movement."
              />
              <Operation
                title="Feedback Loop"
                body="Visitors, parents, partners, and youth choose next actions and share responses."
              />
            </div>
          </section>

          <section className="mt-8 mb-8 rounded-[2rem] border border-emerald-300/25 bg-emerald-600/15 p-7 shadow-2xl">
            <p className="text-sm uppercase tracking-[.3em] text-emerald-200/80">
              {words.feedback}
            </p>
            <h3 className="mt-3 text-3xl font-black">{words.feedbackTitle}</h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "Become a grower",
                "Support youth workforce",
                "Shop / preorder",
                "Volunteer",
                "Partner with us",
                "Attend an event",
              ].map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-white/15 bg-white px-5 py-3 font-bold text-[#073421] hover:bg-emerald-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
      <p className="text-xs uppercase tracking-[.28em] text-emerald-100/75">
        {label}
      </p>
      <p className="mt-3 text-base leading-7 text-white/88">{value}</p>
    </div>
  );
}

function Operation({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
      <h4 className="text-xl font-black">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-white/75">{body}</p>
    </div>
  );
}

export default App;
