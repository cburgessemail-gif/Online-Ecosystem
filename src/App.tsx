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
  deck: string;
  image: string;
  imageLabel: string;
  accent: string;
  question: string;
  need: string;
  benefit: string;
  destination: string;
  steps: JourneyStep[];
};

const image = (file: string) => `/images/${file}`;

const sections: Section[] = [
  {
    key: "entrance",
    nav: "Entrance",
    eyebrow: "Living Ecosystem",
    title: "Step into the farm. Experience the wonders of life.",
    deck:
      "Bronson Family Farm is a living food ecosystem where land, youth, growers, wellness, markets, culture, family, and community infrastructure move together.",
    image: image("SAM_0427.JPG"),
    imageLabel: "Farm entrance / land experience",
    accent: "from-emerald-300/35 via-lime-200/20 to-amber-100/20",
    question: "Where do I belong in this ecosystem?",
    need: "People need a clear, welcoming way to understand the farm as infrastructure, not just land or an event.",
    benefit:
      "The entrance shows how every role connects to food access, workforce development, wellness, enterprise, and regional opportunity.",
    destination:
      "Choose a pathway and move from observer into participant: youth, customer, grower, partner, volunteer, producer, or supporter.",
    steps: [
      {
        label: "Arrive",
        title: "The land introduces the story",
        body:
          "The visitor enters through a sense of place: the farm, the historic airport setting, and the purpose of rebuilding food access from the ground up.",
        action: "Understand why the ecosystem exists.",
      },
      {
        label: "Orient",
        title: "The model becomes visible",
        body:
          "The experience shows that food, workforce, education, markets, wellness, and partnerships are not separate programs. They are one connected system.",
        action: "Choose a role.",
      },
      {
        label: "Enter",
        title: "The visitor becomes part of the work",
        body:
          "Every pathway ends with a decision: learn, shop, grow, volunteer, partner, sponsor, employ, teach, or return with others.",
        action: "Begin a pathway.",
      },
    ],
  },
  {
    key: "youth",
    nav: "Youth Workforce",
    eyebrow: "8-Week Cultivator Pathway",
    title: "Young people do not watch the future. They help build it.",
    deck:
      "The youth workforce pathway turns farm work into skill evidence: safety, attendance, teamwork, communication, growing, harvesting, inventory, marketplace support, reflection, and leadership.",
    image: image("SAM_0417.JPG"),
    imageLabel: "Youth workforce / field learning",
    accent: "from-yellow-200/35 via-emerald-200/25 to-sky-100/15",
    question: "Can this youth see themselves as capable, needed, and prepared?",
    need:
      "Youth need meaningful work that builds confidence, discipline, practical skills, and a reason to care about their community.",
    benefit:
      "Supervisors track growth, parents see progress, partners see impact, and youth see their labor become food, service, leadership, and opportunity.",
    destination:
      "Complete the program with progress evidence and choose the next role: worker, grower, mentor, volunteer, youth leader, or entrepreneur.",
    steps: [
      {
        label: "Orientation",
        title: "Safety, belonging, and expectations",
        body:
          "Youth begin with schedule, PPE, conduct, media releases, team expectations, and the deeper purpose of the farm.",
        action: "Confirm readiness for work.",
      },
      {
        label: "Daily Rhythm",
        title: "Work becomes structure",
        body:
          "Each day moves through check-in, assignment, supervised work, growing area support, cleanup, and reflection.",
        action: "Build reliable habits.",
      },
      {
        label: "Supervisor View",
        title: "Growth is observed, not guessed",
        body:
          "Supervisors capture mobile observations for attendance, safety, effort, communication, initiative, responsibility, and skill growth.",
        action: "Record progress.",
      },
      {
        label: "Reflection",
        title: "Youth connect work to future",
        body:
          "Youth reflect on what changed in their confidence, knowledge, leadership, and understanding of food and community.",
        action: "Choose a next step.",
      },
    ],
  },
  {
    key: "marketplace",
    nav: "Marketplace",
    eyebrow: "Growers Supply Market",
    title: "Marketplace turns community interest into local food power.",
    deck:
      "The marketplace connects seedlings, produce, Bubble Babies™, grower supplies, preorders, pickup, SNAP-aware access, demonstrations, vendors, and repeat customer engagement.",
    image: image("ConnectFoodEcosystem_withimages.png"),
    imageLabel: "Connected food ecosystem / marketplace",
    accent: "from-orange-200/30 via-lime-200/25 to-emerald-200/20",
    question: "How does interest become a purchase, a habit, and a relationship?",
    need:
      "Customers and growers need a simple way to find food, supplies, knowledge, and purchasing opportunities.",
    benefit:
      "The marketplace creates revenue, repeat engagement, food access, grower participation, youth learning, and visible community momentum.",
    destination:
      "Shop, preorder, become a grower, support youth workforce development, or strengthen the regional food ecosystem.",
    steps: [
      {
        label: "Discover",
        title: "The customer sees what is possible",
        body:
          "Seedlings, produce, supplies, demonstrations, and story-driven signs help visitors understand what they can buy, grow, or support.",
        action: "Browse the opportunity.",
      },
      {
        label: "Order",
        title: "Interest becomes action",
        body:
          "QR codes and online links support preorders, pickup, event follow-up, and future purchases.",
        action: "Shop or request details.",
      },
      {
        label: "Pickup",
        title: "Digital demand meets real farm activity",
        body:
          "Inventory, pickup windows, youth support, and grower supply movement connect the online system to physical operations.",
        action: "Receive food or supplies.",
      },
      {
        label: "Return",
        title: "A one-time visitor becomes part of the cycle",
        body:
          "The customer returns to shop, volunteer, learn, bring family, or support youth and growers.",
        action: "Stay connected.",
      },
    ],
  },
  {
    key: "growers",
    nav: "Growers",
    eyebrow: "Grower Pathway",
    title: "Growers need tools, knowledge, confidence, and a market.",
    deck:
      "The grower pathway supports home gardeners, small farms, new growers, and community producers with practical education, seedlings, soil knowledge, supplies, demonstrations, and market access.",
    image: image("GrowArea2.jpg"),
    imageLabel: "Grow area / production capacity",
    accent: "from-green-200/35 via-emerald-300/25 to-stone-100/15",
    question: "Am I ready to grow, sell, teach, or collaborate?",
    need:
      "Growers need more than encouragement. They need practical support, inputs, skill-building, and pathways to sell or share what they produce.",
    benefit:
      "The ecosystem increases local production capacity and helps people move from curiosity to growing to marketplace participation.",
    destination:
      "Decide whether to grow at home, sell through the ecosystem, attend events, mentor youth, or become a grower partner.",
    steps: [
      {
        label: "Assess",
        title: "Start with what the grower has",
        body:
          "The grower identifies land, containers, soil needs, water access, crops, tools, experience, and goals.",
        action: "Choose a starting point.",
      },
      {
        label: "Learn",
        title: "Knowledge becomes practical",
        body:
          "Demonstrations and farm examples teach compost, fencing, watering, pest prevention, transplanting, harvesting, and seasonal planning.",
        action: "Apply the lesson.",
      },
      {
        label: "Produce",
        title: "Growing becomes visible capacity",
        body:
          "The grower uses supplies, guidance, seedlings, and planning to increase production.",
        action: "Bring food or knowledge back.",
      },
      {
        label: "Participate",
        title: "The grower joins the local food network",
        body:
          "Growers can sell, volunteer, teach, mentor, demonstrate, or collaborate with the market.",
        action: "Join the ecosystem.",
      },
    ],
  },
  {
    key: "partners",
    nav: "Partners",
    eyebrow: "Partner + Investor Pathway",
    title: "Partners turn goodwill into visible community outcomes.",
    deck:
      "The partner pathway gives funders, schools, businesses, city departments, foundations, universities, and service providers a clear lane to support food access, youth workforce, infrastructure, and community health.",
    image: image("Partners.png"),
    imageLabel: "Partner alignment / community support",
    accent: "from-sky-200/30 via-emerald-200/25 to-amber-100/15",
    question: "Which support lane creates the strongest outcome?",
    need:
      "Partners need specific, credible, visible ways to contribute without guessing what the farm needs.",
    benefit:
      "Partnerships convert resources into equipment, funding, demonstrations, workforce support, wellness services, infrastructure, and measurable impact.",
    destination:
      "Choose a support lane: funding, equipment, volunteers, training, wellness services, youth support, infrastructure, or marketplace participation.",
    steps: [
      {
        label: "Understand",
        title: "See the whole system",
        body:
          "Partners see the farm as a connected model for food, workforce, wellness, education, culture, and economic opportunity.",
        action: "Identify alignment.",
      },
      {
        label: "Choose",
        title: "Select a contribution lane",
        body:
          "A partner chooses equipment, funding, volunteers, demonstrations, health education, youth support, transportation, communications, or infrastructure.",
        action: "Commit to a lane.",
      },
      {
        label: "Activate",
        title: "Support becomes operational",
        body:
          "The contribution enters events, training, marketplace activity, youth work, wellness, or site development.",
        action: "Implement support.",
      },
      {
        label: "Measure",
        title: "Impact becomes visible",
        body:
          "The ecosystem shows how support created participation, learning, food access, capacity, and community trust.",
        action: "Continue or expand.",
      },
    ],
  },
  {
    key: "nutrition",
    nav: "Nutrition",
    eyebrow: "Health + Food Access",
    title: "Nutrition becomes local, practical, and connected to daily life.",
    deck:
      "The nutrition pathway connects fresh food, gardening, wellness education, screenings, family health, cooking, value-added learning, and culturally relevant food access.",
    image: image("Compost_ElliottGarden.png"),
    imageLabel: "Compost / soil / nourishment",
    accent: "from-lime-200/30 via-yellow-100/25 to-emerald-200/15",
    question: "How does fresh food become a healthier household decision?",
    need:
      "Families need access to fresh food and simple education that connects growing, eating, health, and household choices.",
    benefit:
      "Nutrition becomes part of the ecosystem through produce, demonstrations, wellness partners, youth learning, and marketplace access.",
    destination:
      "Choose healthier food, learn how to grow it, share it with family, or connect to wellness partners and community resources.",
    steps: [
      {
        label: "Access",
        title: "Fresh food becomes visible",
        body:
          "Families encounter seedlings, produce, herbs, greens, and seasonal food opportunities.",
        action: "Choose food or plants.",
      },
      {
        label: "Learn",
        title: "Food connects to wellness",
        body:
          "Nutrition education connects fresh food to blood pressure, diabetes, family meals, energy, and long-term wellness.",
        action: "Apply the lesson at home.",
      },
      {
        label: "Prepare",
        title: "Food becomes usable",
        body:
          "Cooking, preservation, value-added demonstrations, and simple recipes turn produce into family practice.",
        action: "Use the food.",
      },
      {
        label: "Share",
        title: "The benefit moves through families",
        body:
          "Families share knowledge, food, confidence, and healthier habits across households and community networks.",
        action: "Return and bring others.",
      },
    ],
  },
  {
    key: "events",
    nav: "Events",
    eyebrow: "Community Activation",
    title: "Events let people feel the ecosystem before they join it.",
    deck:
      "Events bring people onto the land for demonstrations, Growers Supply Market activity, seed giveaways, youth visibility, music, wellness, education, vendors, and partner engagement.",
    image: image("Queens Village.png"),
    imageLabel: "Community experience / event activation",
    accent: "from-fuchsia-200/20 via-amber-200/25 to-emerald-200/20",
    question: "How do visitors become participants after one experience?",
    need:
      "The community needs welcoming entry points where people can experience the farm before deciding how to participate.",
    benefit:
      "Events create trust, visibility, relationships, registrations, sales, volunteer interest, partner alignment, and repeat engagement.",
    destination:
      "Register, attend, volunteer, vend, sponsor, join a pathway, or invite others into the farm ecosystem.",
    steps: [
      {
        label: "Invite",
        title: "The invitation opens the gate",
        body:
          "Flyers, QR codes, Eventbrite, partners, and word of mouth invite the community into a guided experience.",
        action: "Register or share.",
      },
      {
        label: "Check In",
        title: "Entry becomes organized",
        body:
          "QR check-in helps the farm understand attendance, roles, interests, and follow-up needs.",
        action: "Scan and enter.",
      },
      {
        label: "Experience",
        title: "Visitors move through living stations",
        body:
          "People encounter demonstrations, food, growers, youth workforce, partners, music, wellness, and marketplace activity.",
        action: "Engage with the ecosystem.",
      },
      {
        label: "Follow Up",
        title: "The relationship continues",
        body:
          "After the event, participants receive next steps: shop, volunteer, partner, grow, sponsor, or return.",
        action: "Choose next action.",
      },
    ],
  },
];

const ui: Record<
  LangKey,
  {
    title: string;
    start: string;
    overview: string;
    need: string;
    benefit: string;
    destination: string;
    question: string;
    journey: string;
    nextAction: string;
    back: string;
    next: string;
    operations: string;
    choose: string;
    feedback: string;
  }
> = {
  English: {
    title: "Connected Food Ecosystem Experience",
    start: "Begin the experience",
    overview: "Guided ecosystem overview",
    need: "Need Being Met",
    benefit: "Ecosystem Benefit",
    destination: "Final Destination / Decision",
    question: "Pathway Question",
    journey: "Pathway Journey",
    nextAction: "Next Action",
    back: "Back",
    next: "Next",
    operations: "Operational Layers",
    choose: "Choose your next move",
    feedback: "Share feedback / connect with us",
  },
  Español: {
    title: "Experiencia de Ecosistema Alimentario Conectado",
    start: "Comenzar",
    overview: "Vista guiada",
    need: "Necesidad Atendida",
    benefit: "Beneficio del Ecosistema",
    destination: "Destino / Decisión Final",
    question: "Pregunta de Ruta",
    journey: "Ruta de Experiencia",
    nextAction: "Próxima Acción",
    back: "Atrás",
    next: "Siguiente",
    operations: "Capas Operativas",
    choose: "Elija su próximo paso",
    feedback: "Comparta comentarios / comuníquese",
  },
  Tagalog: {
    title: "Konektadong Food Ecosystem Experience",
    start: "Simulan",
    overview: "Gabay na overview",
    need: "Pangangailangan",
    benefit: "Benepisyo",
    destination: "Huling Desisyon",
    question: "Tanong ng Pathway",
    journey: "Pathway Journey",
    nextAction: "Susunod na Gawin",
    back: "Bumalik",
    next: "Susunod",
    operations: "Operational Layers",
    choose: "Piliin ang susunod",
    feedback: "Magbigay ng feedback / kumonekta",
  },
  Italiano: {
    title: "Esperienza Ecosistema Alimentare Connesso",
    start: "Inizia",
    overview: "Panoramica guidata",
    need: "Bisogno Soddisfatto",
    benefit: "Beneficio",
    destination: "Destinazione / Decisione",
    question: "Domanda del Percorso",
    journey: "Percorso",
    nextAction: "Prossima Azione",
    back: "Indietro",
    next: "Avanti",
    operations: "Livelli Operativi",
    choose: "Scegli il prossimo passo",
    feedback: "Condividi feedback / contattaci",
  },
  Patwa: {
    title: "Connected Food Ecosystem Experience",
    start: "Begin",
    overview: "Guided overview",
    need: "Need Being Met",
    benefit: "Ecosystem Benefit",
    destination: "Final Destination / Decision",
    question: "Pathway Question",
    journey: "Pathway Journey",
    nextAction: "Next Action",
    back: "Back",
    next: "Next",
    operations: "Operational Layers",
    choose: "Choose your next move",
    feedback: "Share feedback / connect",
  },
  Hebrew: {
    title: "חוויית אקוסיסטם מזון מחובר",
    start: "התחל",
    overview: "סקירה מודרכת",
    need: "צורך שמקבל מענה",
    benefit: "תועלת לאקוסיסטם",
    destination: "יעד / החלטה",
    question: "שאלת מסלול",
    journey: "מסלול",
    nextAction: "הפעולה הבאה",
    back: "חזרה",
    next: "הבא",
    operations: "שכבות תפעוליות",
    choose: "בחר את הצעד הבא",
    feedback: "שתף משוב / צור קשר",
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

  const activeIndex = sections.findIndex((section) => section.key === active.key);
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

    const nextSection = sections[(activeIndex + 1) % sections.length];
    chooseSection(nextSection.key);
  };

  const back = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      return;
    }

    const previousSection =
      sections[(activeIndex - 1 + sections.length) % sections.length];
    chooseSection(previousSection.key);
  };

  return (
    <main
      dir={rtl ? "rtl" : "ltr"}
      className="min-h-screen overflow-x-hidden bg-[#07140d] text-white"
    >
      <section className="relative min-h-screen">
        <div
          className="fixed inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `linear-gradient(110deg, rgba(4,18,11,.92) 0%, rgba(6,43,25,.72) 42%, rgba(4,18,11,.34) 100%), url("${active.image}")`,
          }}
        />
        <div className={`fixed inset-0 bg-gradient-to-br ${active.accent}`} />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,.22),transparent_22%),radial-gradient(circle_at_70%_18%,rgba(255,232,180,.17),transparent_24%),radial-gradient(circle_at_42%_90%,rgba(41,174,112,.22),transparent_28%)]" />

        <div className="relative z-10">
          <header className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-5 py-6 md:px-8 lg:px-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[.55em] text-lime-100/80">
                  Bronson Family Farm
                </p>
                <h1 className="mt-2 max-w-3xl text-2xl font-black tracking-tight text-white md:text-4xl">
                  {words.title}
                </h1>
              </div>

              <div className="flex flex-wrap gap-2">
                {(Object.keys(ui) as LangKey[]).map((item) => (
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

            <nav className="flex gap-2 overflow-x-auto pb-2">
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
                  <span className="mr-2 opacity-60">{String(index + 1).padStart(2, "0")}</span>
                  {section.nav}
                </button>
              ))}
            </nav>
          </header>

          <section className="mx-auto grid min-h-[calc(100vh-180px)] w-full max-w-[1500px] items-center gap-8 px-5 pb-10 md:px-8 lg:grid-cols-[1.02fr_.98fr] lg:px-10">
            <div className="max-w-5xl py-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-5 py-3 text-xs font-black uppercase tracking-[.34em] text-lime-100 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-lime-200 shadow-[0_0_18px_rgba(217,249,157,.85)]" />
                {active.eyebrow}
              </div>

              <h2 className="mt-8 text-5xl font-black leading-[.88] tracking-[-.06em] text-white drop-shadow-2xl md:text-7xl lg:text-8xl xl:text-9xl">
                {active.title}
              </h2>

              <p className="mt-8 max-w-4xl text-xl leading-9 text-white/86 md:text-2xl">
                {active.deck}
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <GlassMetric label={words.question} value={active.question} />
                <GlassMetric label={words.destination} value={active.destination} />
                <GlassMetric label="Current Pathway" value={`${active.nav} • Step ${stepIndex + 1}`} />
              </div>
            </div>

            <div className="relative min-h-[660px]">
              <div className="absolute -left-5 top-10 h-[76%] w-[86%] rounded-[4rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl" />
              <div
                className="absolute right-0 top-0 h-[74%] w-[88%] overflow-hidden rounded-[4rem] border border-white/25 bg-cover bg-center shadow-[0_34px_90px_rgba(0,0,0,.45)]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.18)), url("${active.image}")`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#06140d]/55 via-transparent to-white/5" />
                <div className="absolute bottom-7 left-7 right-7">
                  <p className="text-xs uppercase tracking-[.3em] text-white/75">
                    {active.imageLabel}
                  </p>
                  <p className="mt-3 text-3xl font-black leading-tight">
                    {active.nav}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-[92%] rounded-[3rem] border border-white/20 bg-[#f4f7df]/95 p-6 text-[#092216] shadow-[0_30px_80px_rgba(0,0,0,.45)] md:p-8">
                <p className="text-xs font-black uppercase tracking-[.32em] text-emerald-900/65">
                  {words.journey}
                </p>
                <h3 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                  {currentStep.title}
                </h3>
                <p className="mt-4 text-lg leading-8 text-[#244331]">
                  {currentStep.body}
                </p>
                <div className="mt-5 rounded-[2rem] bg-[#0d3a26] p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-[.28em] text-lime-100/75">
                    {words.nextAction}
                  </p>
                  <p className="mt-2 text-xl font-black">{currentStep.action}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={back}
                    className="rounded-full bg-[#0d3a26] px-6 py-3 font-black text-white shadow-lg"
                  >
                    {words.back}
                  </button>
                  <button
                    onClick={next}
                    className="rounded-full bg-emerald-600 px-6 py-3 font-black text-white shadow-lg shadow-emerald-950/25"
                  >
                    {words.next}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto grid w-full max-w-[1500px] gap-6 px-5 pb-12 md:px-8 lg:grid-cols-[.95fr_1.05fr] lg:px-10">
            <div className="rounded-[3rem] border border-white/20 bg-black/25 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
              <p className="text-xs font-black uppercase tracking-[.34em] text-lime-100/75">
                {words.overview}
              </p>
              <div className="mt-6 grid gap-3">
                {active.steps.map((step, index) => (
                  <button
                    key={step.label}
                    onClick={() => setStepIndex(index)}
                    className={`group rounded-[2rem] border p-5 text-left transition ${
                      stepIndex === index
                        ? "border-lime-100 bg-lime-100 text-[#092216]"
                        : "border-white/15 bg-white/10 text-white hover:bg-white/18"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-black uppercase tracking-[.28em] opacity-70">
                        {step.label}
                      </span>
                      <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-black">
                        {index + 1}/{active.steps.length}
                      </span>
                    </div>
                    <h4 className="mt-3 text-2xl font-black">{step.title}</h4>
                    <p
                      className={`mt-2 text-sm leading-6 ${
                        stepIndex === index ? "text-[#244331]" : "text-white/72"
                      }`}
                    >
                      {step.body}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[3rem] border border-white/20 bg-white/12 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
                <p className="text-xs font-black uppercase tracking-[.34em] text-lime-100/75">
                  {words.need}
                </p>
                <p className="mt-4 text-2xl font-black leading-tight">{active.need}</p>
              </div>
              <div className="rounded-[3rem] border border-white/20 bg-white/12 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
                <p className="text-xs font-black uppercase tracking-[.34em] text-lime-100/75">
                  {words.benefit}
                </p>
                <p className="mt-4 text-2xl font-black leading-tight">
                  {active.benefit}
                </p>
              </div>
              <div className="rounded-[3rem] border border-lime-100/30 bg-[#062216]/92 p-6 shadow-2xl md:p-8">
                <p className="text-xs font-black uppercase tracking-[.34em] text-lime-100/75">
                  {words.operations}
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Operation title="QR Check-In" body="Eventbrite-style entry, role identification, attendance, and follow-up." />
                  <Operation title="Supervisor Mobile Tracking" body="Daily youth observations, safety, participation, skill growth, and notes." />
                  <Operation title="Marketplace Flow" body="Preorders, pickup, inventory visibility, customer return, and grower supply movement." />
                  <Operation title="Feedback Loop" body="Visitors, parents, partners, and youth choose next actions and share responses." />
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-[1500px] px-5 pb-16 md:px-8 lg:px-10">
            <div className="overflow-hidden rounded-[3rem] border border-white/20 bg-[#f4f7df] text-[#092216] shadow-2xl">
              <div className="grid lg:grid-cols-[.85fr_1.15fr]">
                <div
                  className="min-h-[320px] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,.08), rgba(0,0,0,.12)), url("${active.image}")`,
                  }}
                />
                <div className="p-8 md:p-10">
                  <p className="text-xs font-black uppercase tracking-[.34em] text-emerald-900/60">
                    {words.feedback}
                  </p>
                  <h3 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                    {words.choose}
                  </h3>
                  <div className="mt-7 flex flex-wrap gap-3">
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
                        className="rounded-full border border-emerald-950/10 bg-[#0d3a26] px-5 py-3 font-black text-white shadow-lg hover:bg-emerald-700"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function GlassMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-white/18 bg-white/12 p-5 shadow-xl backdrop-blur-2xl">
      <p className="text-[10px] font-black uppercase tracking-[.28em] text-lime-100/70">
        {label}
      </p>
      <p className="mt-3 text-base font-bold leading-6 text-white/90">{value}</p>
    </div>
  );
}

function Operation({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
      <h4 className="text-xl font-black">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-white/72">{body}</p>
    </div>
  );
}

export default App;
