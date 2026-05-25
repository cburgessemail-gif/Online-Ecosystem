import { useMemo, useState } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "Patwa" | "Hebrew";
type SectionKey = "entrance" | "youth" | "marketplace" | "growers" | "partners" | "nutrition" | "events";

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

const image = (file: string) => `/images/${file}`;

const fallbackImages = {
  entrance: image("SAM_0427.JPG"),
  youth: image("SAM_0417.JPG"),
  marketplace: image("ConnectFoodEcosystem_withimages.png"),
  growers: image("GrowArea2.jpg"),
  partners: image("Partners.png"),
  nutrition: image("Compost_ElliottGarden.png"),
  events: image("Queens Village.png"),
};

const copy: Record<LangKey, {
  heading: string;
  subtitle: string;
  living: string;
  guided: string;
  back: string;
  next: string;
  choose: string;
  need: string;
  benefit: string;
  destination: string;
  journey: string;
  operations: string;
  feedback: string;
}> = {
  English: {
    heading: "Connected Ecosystem Experience",
    subtitle: "Bronson Family Farm is not a presentation. It is a living environment connecting youth workforce development, growers, food movement, schools, wellness, leadership, marketplace systems, and community transformation.",
    living: "Living Ecosystem",
    guided: "Guided Tour",
    back: "Back",
    next: "Next",
    choose: "Choose a pathway",
    need: "Need Being Met",
    benefit: "Ecosystem Benefit",
    destination: "Final Destination / Decision",
    journey: "Pathway Journey",
    operations: "Operational Ecosystem",
    feedback: "Share feedback / connect with us",
  },
  Español: {
    heading: "Experiencia de Ecosistema Conectado",
    subtitle: "Bronson Family Farm conecta jóvenes, agricultores, alimentos, escuelas, bienestar, liderazgo, mercados y transformación comunitaria.",
    living: "Ecosistema Vivo",
    guided: "Recorrido Guiado",
    back: "Atrás",
    next: "Siguiente",
    choose: "Elija una ruta",
    need: "Necesidad Atendida",
    benefit: "Beneficio del Ecosistema",
    destination: "Destino / Decisión Final",
    journey: "Ruta de Experiencia",
    operations: "Ecosistema Operativo",
    feedback: "Comparta comentarios / comuníquese",
  },
  Tagalog: {
    heading: "Konektadong Karanasan ng Ecosystem",
    subtitle: "Ang Bronson Family Farm ay nag-uugnay ng kabataan, growers, pagkain, paaralan, wellness, pamumuno, marketplace, at komunidad.",
    living: "Buhay na Ecosystem",
    guided: "Gabay na Paglalakbay",
    back: "Bumalik",
    next: "Susunod",
    choose: "Pumili ng pathway",
    need: "Pangangailangan",
    benefit: "Benepisyo",
    destination: "Huling Desisyon",
    journey: "Pathway Journey",
    operations: "Operational Ecosystem",
    feedback: "Magbigay ng feedback / kumonekta",
  },
  Italiano: {
    heading: "Esperienza Ecosistema Connesso",
    subtitle: "Bronson Family Farm collega giovani, coltivatori, cibo, scuole, benessere, leadership, mercati e trasformazione comunitaria.",
    living: "Ecosistema Vivo",
    guided: "Tour Guidato",
    back: "Indietro",
    next: "Avanti",
    choose: "Scegli un percorso",
    need: "Bisogno Soddisfatto",
    benefit: "Beneficio",
    destination: "Destinazione / Decisione",
    journey: "Percorso",
    operations: "Ecosistema Operativo",
    feedback: "Condividi feedback / contattaci",
  },
  Patwa: {
    heading: "Connected Ecosystem Experience",
    subtitle: "Bronson Family Farm bring youth, growers, food, school, wellness, leadership, market, an community together.",
    living: "Living Ecosystem",
    guided: "Guided Tour",
    back: "Back",
    next: "Next",
    choose: "Choose a pathway",
    need: "Need Being Met",
    benefit: "Ecosystem Benefit",
    destination: "Final Destination / Decision",
    journey: "Pathway Journey",
    operations: "Operational Ecosystem",
    feedback: "Share feedback / connect",
  },
  Hebrew: {
    heading: "חוויית אקוסיסטם מחובר",
    subtitle: "Bronson Family Farm מחברת נוער, מגדלים, מזון, בתי ספר, בריאות, מנהיגות, שווקים ושינוי קהילתי.",
    living: "אקוסיסטם חי",
    guided: "סיור מודרך",
    back: "חזרה",
    next: "הבא",
    choose: "בחר מסלול",
    need: "צורך שמקבל מענה",
    benefit: "תועלת לאקוסיסטם",
    destination: "יעד / החלטה",
    journey: "מסלול",
    operations: "אקוסיסטם תפעולי",
    feedback: "שתף משוב / צור קשר",
  },
};

const sections: Section[] = [
  {
    key: "entrance",
    nav: "Entrance",
    eyebrow: "Living Ecosystem",
    title: "Step Into The Ecosystem.",
    description:
      "Bronson Family Farm is a living environment connecting youth workforce development, growers, food movement, schools, wellness, leadership, marketplace systems, and community transformation.",
    image: fallbackImages.entrance,
    imageLabel: "SAM_0427.JPG",
    need: "People need a clear way to understand the farm as infrastructure, not just land or an event.",
    benefit: "The entrance experience shows how every role connects to food access, workforce, wellness, and regional opportunity.",
    destination: "Decide which pathway fits you: youth, customer, grower, partner, volunteer, producer, or supporter.",
    steps: [
      { label: "Arrive", title: "See the place", body: "The visitor enters through the farm story, land, airport history, and community purpose.", action: "Understand why this ecosystem exists." },
      { label: "Orient", title: "Choose a role", body: "The system presents pathways so each person can see where they belong.", action: "Select a pathway." },
      { label: "Move", title: "Enter the model", body: "The visitor moves from watching into participating.", action: "Begin a journey." },
    ],
  },
  {
    key: "youth",
    nav: "Youth Workforce",
    eyebrow: "8-Week Workforce Pathway",
    title: "Youth Learn By Building The Future.",
    description:
      "The youth workforce pathway turns farm work into skill-building: attendance, safety, teamwork, responsibility, communication, growing, harvesting, inventory, marketplace support, and leadership.",
    image: fallbackImages.youth,
    imageLabel: "SAM_0417.JPG",
    need: "Youth need meaningful work that builds discipline, confidence, real skills, and a connection to community.",
    benefit: "Supervisors can track growth, parents can understand progress, and youth can see their work become food, service, and opportunity.",
    destination: "Complete the program, earn progress evidence, and decide how to continue as a worker, grower, leader, volunteer, or entrepreneur.",
    steps: [
      { label: "Orientation", title: "Safety and belonging", body: "Youth begin with expectations, PPE, schedule, conduct, photo/media releases, and the purpose of the farm.", action: "Confirm readiness." },
      { label: "Daily Rhythm", title: "Show up and work", body: "Each day includes check-in, task assignment, teamwork, growing area support, cleanup, and reflection.", action: "Build reliable habits." },
      { label: "Supervisor Assessment", title: "Track growth", body: "Supervisors use mobile-friendly observations for attendance, participation, safety, communication, initiative, and skill progress.", action: "Record progress." },
      { label: "Reflection", title: "Know what changed", body: "Youth connect their work to food access, family, leadership, and future opportunity.", action: "Choose the next step." },
    ],
  },
  {
    key: "marketplace",
    nav: "Marketplace",
    eyebrow: "Food Movement + Sales",
    title: "Marketplace Converts Interest Into Local Food Power.",
    description:
      "The marketplace pathway connects seedlings, produce, Bubble Babies™, grower supplies, community demand, preorders, pickup, SNAP-aware purchasing, and vendor participation.",
    image: fallbackImages.marketplace,
    imageLabel: "ConnectFoodEcosystem_withimages.png",
    need: "Customers and growers need a simple way to find food, supplies, knowledge, and purchasing opportunities.",
    benefit: "The marketplace creates repeat engagement, revenue, food access, and a visible reason for growers and families to return.",
    destination: "Shop, preorder, become a grower, support youth workforce development, and strengthen the regional food ecosystem.",
    steps: [
      { label: "Browse", title: "See what is available", body: "Customers view seedlings, produce, supplies, and educational offerings.", action: "Choose items or services." },
      { label: "Order", title: "Move from interest to purchase", body: "QR codes and online store links help customers preorder or continue shopping after events.", action: "Place an order or request information." },
      { label: "Pickup", title: "Connect online to on-site", body: "Pickup windows, inventory logic, and event check-in connect digital interest to real farm activity.", action: "Receive food or supplies." },
      { label: "Return", title: "Build repeat behavior", body: "The customer becomes part of a cycle of healthy food, learning, and local support.", action: "Return, share, or join." },
    ],
  },
  {
    key: "growers",
    nav: "Growers",
    eyebrow: "Grower Pathway",
    title: "Growers Connect To Knowledge, Tools, And Market Access.",
    description:
      "The grower pathway helps small farms, gardeners, and community growers access practical education, supplies, demonstrations, seedlings, soil support, and market participation.",
    image: fallbackImages.growers,
    imageLabel: "GrowArea2.jpg",
    need: "Growers need more than encouragement. They need tools, training, inputs, confidence, and places to sell or share what they grow.",
    benefit: "The ecosystem strengthens local production capacity and helps community members move from interest to growing to market participation.",
    destination: "Decide whether to grow at home, sell through the ecosystem, join events, mentor youth, or become a formal grower partner.",
    steps: [
      { label: "Assess", title: "Where are you starting?", body: "The grower identifies land, containers, tools, soil needs, crop goals, and level of experience.", action: "Choose a starting point." },
      { label: "Learn", title: "Receive practical knowledge", body: "Demonstrations, partners, and farm examples teach growing, compost, fencing, watering, pest prevention, and harvest basics.", action: "Apply the lesson." },
      { label: "Produce", title: "Grow with support", body: "The grower uses supplies, seedlings, guidance, and seasonal planning to increase production.", action: "Bring produce or knowledge back into the system." },
      { label: "Participate", title: "Join the local food network", body: "Growers can sell, volunteer, mentor, demonstrate, or collaborate.", action: "Become part of the ecosystem." },
    ],
  },
  {
    key: "partners",
    nav: "Partners",
    eyebrow: "Partner + Investor Pathway",
    title: "Partners Align Resources With Community Outcomes.",
    description:
      "The partner pathway gives funders, schools, businesses, city departments, foundations, universities, and service providers a clear way to support the ecosystem.",
    image: fallbackImages.partners,
    imageLabel: "Partners.png",
    need: "Partners need specific, credible, visible ways to contribute without guessing what the farm needs.",
    benefit: "Partnerships convert goodwill into equipment, funding, demonstrations, workforce support, wellness services, infrastructure, and measurable outcomes.",
    destination: "Choose a support lane: funding, equipment, volunteers, training, health education, youth support, infrastructure, or marketplace participation.",
    steps: [
      { label: "Understand", title: "See the whole model", body: "Partners first understand that the farm connects food, workforce, wellness, education, and economic opportunity.", action: "Identify alignment." },
      { label: "Choose", title: "Select a contribution lane", body: "A partner may provide equipment, supplies, funding, demonstrations, youth support, transportation, health services, or communications.", action: "Commit to a lane." },
      { label: "Activate", title: "Turn support into action", body: "The support becomes part of operations, events, youth training, marketplace growth, or infrastructure.", action: "Implement support." },
      { label: "Measure", title: "Report impact", body: "The ecosystem shows how support created participation, learning, food access, or capacity.", action: "Continue or expand partnership." },
    ],
  },
  {
    key: "nutrition",
    nav: "Nutrition",
    eyebrow: "Health + Food Access",
    title: "Nutrition Becomes Practical, Visible, And Local.",
    description:
      "The nutrition pathway connects fresh food, gardening, wellness education, screenings, family health, cooking, value-added learning, and culturally relevant food access.",
    image: fallbackImages.nutrition,
    imageLabel: "Compost_ElliottGarden.png",
    need: "Families need access to fresh food and simple education that connects growing, eating, health, and household decisions.",
    benefit: "Nutrition becomes part of the ecosystem through produce, demonstrations, wellness partners, youth learning, and marketplace access.",
    destination: "Choose healthier food, learn how to grow it, share it with family, or connect to wellness partners and community resources.",
    steps: [
      { label: "Access", title: "Find fresh food", body: "Families encounter seedlings, produce, herbs, greens, and seasonal food opportunities.", action: "Choose food or plants." },
      { label: "Learn", title: "Understand the value", body: "Nutrition education connects food to blood pressure, diabetes, family meals, energy, and long-term wellness.", action: "Apply the lesson at home." },
      { label: "Prepare", title: "Make it usable", body: "Cooking, preservation, value-added demonstrations, and simple recipes turn produce into family practice.", action: "Use the food." },
      { label: "Share", title: "Spread the benefit", body: "Families share knowledge, food, and confidence across households and community networks.", action: "Return and bring others." },
    ],
  },
  {
    key: "events",
    nav: "Events",
    eyebrow: "Experience + Community Activation",
    title: "Events Turn The Ecosystem Into A Shared Experience.",
    description:
      "Events bring people onto the land for demonstrations, growers supply market activity, seed giveaways, youth visibility, music, wellness, education, vendors, and partner engagement.",
    image: fallbackImages.events,
    imageLabel: "Queens Village.png",
    need: "The community needs welcoming entry points where people can experience the farm before deciding how to participate.",
    benefit: "Events create trust, visibility, relationships, registrations, sales, volunteer interest, partner alignment, and repeat engagement.",
    destination: "Register, attend, volunteer, vend, sponsor, join a pathway, or invite others into the farm ecosystem.",
    steps: [
      { label: "Invite", title: "Bring people in", body: "Flyers, QR codes, Eventbrite, partners, and word of mouth invite the community into the experience.", action: "Register or share." },
      { label: "Check In", title: "Create a clean entry", body: "QR check-in helps the farm understand attendance, roles, interests, and follow-up needs.", action: "Scan and enter." },
      { label: "Experience", title: "Move through stations", body: "Visitors encounter demonstrations, food, growers, youth workforce, partners, music, wellness, and marketplace activity.", action: "Engage with the ecosystem." },
      { label: "Follow Up", title: "Keep the relationship alive", body: "After the event, participants receive next steps: shop, volunteer, partner, grow, sponsor, or return.", action: "Choose next action." },
    ],
  },
];

function App() {
  const [lang, setLang] = useState<LangKey>("English");
  const [activeKey, setActiveKey] = useState<SectionKey>("entrance");
  const [stepIndex, setStepIndex] = useState(0);

  const active = useMemo(
    () => sections.find((s) => s.key === activeKey) ?? sections[0],
    [activeKey]
  );

  const t = copy[lang];
  const isHebrew = lang === "Hebrew";

  const chooseSection = (key: SectionKey) => {
    setActiveKey(key);
    setStepIndex(0);
    const el = document.getElementById("experience");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    if (stepIndex < active.steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    const current = sections.findIndex((s) => s.key === active.key);
    const nextSection = sections[(current + 1) % sections.length];
    chooseSection(nextSection.key);
  };

  const back = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      return;
    }
    const current = sections.findIndex((s) => s.key === active.key);
    const prevSection = sections[(current - 1 + sections.length) % sections.length];
    chooseSection(prevSection.key);
  };

  return (
    <main dir={isHebrew ? "rtl" : "ltr"} className="min-h-screen bg-[#001b12] text-white">
      <section
        className="relative min-h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(0,20,13,.98), rgba(0,45,28,.86), rgba(0,0,0,.42)), url(${active.image})` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(137,197,146,.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(253,241,190,.12),transparent_25%)]" />

        <header className="relative z-10 flex flex-col gap-6 px-6 py-8 md:px-10 lg:px-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="tracking-[.42em] text-sm uppercase text-emerald-300/80">Bronson Family Farm</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">{t.heading}</h1>
            </div>

            <nav className="flex flex-wrap gap-3">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => chooseSection(section.key)}
                  className={`rounded-full border px-5 py-3 text-sm transition ${
                    active.key === section.key
                      ? "border-emerald-300 bg-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,.35)]"
                      : "border-white/15 bg-white/10 hover:bg-white/15"
                  }`}
                >
                  {section.nav}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap gap-3">
            {(Object.keys(copy) as LangKey[]).map((item) => (
              <button
                key={item}
                onClick={() => setLang(item)}
                className={`rounded-full border px-5 py-2 text-sm transition ${
                  lang === item ? "border-white bg-white text-[#042016]" : "border-white/15 bg-white/10 hover:bg-white/15"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <div id="experience" className="relative z-10 px-6 pb-12 md:px-10 lg:px-14">
          <section className="max-w-5xl pt-4 md:pt-8">
            <p className="tracking-[.45em] text-sm uppercase text-emerald-300/80">{active.eyebrow || t.living}</p>
            <h2 className="mt-7 max-w-5xl text-5xl font-black leading-[.95] tracking-tight md:text-7xl lg:text-8xl">
              {active.title}
            </h2>
            <p className="mt-8 max-w-4xl text-xl leading-9 text-white/82 md:text-2xl">
              {active.key === "entrance" ? t.subtitle : active.description}
            </p>
          </section>

          <section className="mt-16 overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1.1fr_.9fr]">
              <div
                className="min-h-[360px] bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(202,221,190,.10), rgba(0,0,0,.28)), url(${active.image})` }}
              >
                <div className="p-8 text-xs uppercase tracking-[.22em] text-white/80">{active.imageLabel}</div>
              </div>

              <div className="bg-[#0b3b25]/95 p-8 md:p-10">
                <p className="text-sm uppercase tracking-[.35em] text-emerald-200/80">{t.choose}</p>
                <h3 className="mt-4 text-3xl font-black md:text-4xl">{active.nav}</h3>

                <div className="mt-8 grid gap-4">
                  <InfoBlock label={t.need} value={active.need} />
                  <InfoBlock label={t.benefit} value={active.benefit} />
                  <InfoBlock label={t.destination} value={active.destination} />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/15 bg-[#eff8d8]/95 p-7 text-[#062318] shadow-2xl">
              <p className="text-sm uppercase tracking-[.3em] text-emerald-900/70">{t.journey}</p>
              <h3 className="mt-4 text-3xl font-black">{active.steps[stepIndex].title}</h3>
              <p className="mt-5 text-lg leading-8 text-[#163b2a]">{active.steps[stepIndex].body}</p>
              <div className="mt-7 rounded-3xl bg-[#0b3b25] p-5 text-white">
                <p className="text-xs uppercase tracking-[.28em] text-emerald-200/80">Next Action</p>
                <p className="mt-2 text-xl font-bold">{active.steps[stepIndex].action}</p>
              </div>

              <div className="mt-7 flex gap-3">
                <button onClick={back} className="rounded-full bg-[#0b3b25] px-6 py-3 font-bold text-white">
                  {t.back}
                </button>
                <button onClick={next} className="rounded-full bg-emerald-600 px-6 py-3 font-bold text-white">
                  {t.next}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[.3em] text-emerald-200/80">{t.guided}</p>
              <div className="mt-6 grid gap-4">
                {active.steps.map((step, index) => (
                  <button
                    key={step.label}
                    onClick={() => setStepIndex(index)}
                    className={`rounded-3xl border p-5 text-left transition ${
                      index === stepIndex
                        ? "border-emerald-300 bg-emerald-500/20"
                        : "border-white/10 bg-white/8 hover:bg-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm uppercase tracking-[.26em] text-emerald-200">{step.label}</span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs">{index + 1}/{active.steps.length}</span>
                    </div>
                    <h4 className="mt-3 text-xl font-black">{step.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-white/75">{step.body}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/15 bg-[#061f16]/90 p-7 shadow-2xl">
            <p className="text-sm uppercase tracking-[.3em] text-emerald-200/80">{t.operations}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Operation title="QR Check-In" body="Eventbrite-style entry, role identification, attendance, and follow-up." />
              <Operation title="Supervisor Mobile Tracking" body="Daily youth observations, participation, safety, skills, and notes." />
              <Operation title="Marketplace Flow" body="Preorders, pickup, inventory visibility, customer return, and grower supply movement." />
              <Operation title="Feedback Loop" body="Visitors, parents, partners, and youth choose next actions and share responses." />
            </div>
          </section>

          <section className="mt-8 mb-8 rounded-[2rem] border border-emerald-300/25 bg-emerald-600/15 p-7 shadow-2xl">
            <p className="text-sm uppercase tracking-[.3em] text-emerald-200/80">{t.feedback}</p>
            <h3 className="mt-3 text-3xl font-black">What do you want to do next?</h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Become a grower", "Support youth workforce", "Shop / preorder", "Volunteer", "Partner with us", "Attend an event"].map((item) => (
                <button key={item} className="rounded-full border border-white/15 bg-white px-5 py-3 font-bold text-[#073421] hover:bg-emerald-50">
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
      <p className="text-xs uppercase tracking-[.28em] text-emerald-100/75">{label}</p>
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
