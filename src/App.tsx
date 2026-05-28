import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";

type ScreenKey =
  | "home"
  | "ecosystem"
  | "guest"
  | "story"
  | "airport"
  | "regenerative"
  | "customer"
  | "marketplace"
  | "grower"
  | "planner"
  | "valueAdded"
  | "youth"
  | "supervisor"
  | "parent"
  | "partner"
  | "events"
  | "wellness"
  | "decision"
  | "feedback";

type Action = {
  label: string;
  to?: ScreenKey;
  href?: string;
};

type ScreenContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  narration: string;
  lesson: string;
  actions: Action[];
};

const image = (file: string) => `/images/${encodeURIComponent(file)}`;

const IMAGES = {
  entrance: image("Grow Area.png"),
  ecosystem: image("GrowArea2.jpg"),
  guest: image("SAM_0427.JPG"),
  story: image("SAM_0430.JPG"),
  airport: image("SAM_0377.JPG"),
  regenerative: image("Compost_ElliottGarden.png"),
  customer: image("SAM_0380.JPG"),
  marketplace: image("ConnectFoodEcosystem_withimages.png"),
  grower: image("GrowArea2.jpg"),
  planner: image("SAM_0407.JPG"),
  valueAdded: image("culniary_edibleflowers.jpeg"),
  youth: image("SAM_0393.JPG"),
  supervisor: image("SAM_0396.JPG"),
  parent: image("SAM_0417.JPG"),
  partner: image("SAM_0401.JPG"),
  events: image("Queens Village.png"),
  wellness: image("SAM_0412.JPG"),
  decision: image("SAM_0415.JPG"),
  feedback: image("SAM_0420.JPG"),
  fallback: image("GrowArea2.jpg"),
};

const LANGS: LangKey[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const UI: Record<LangKey, Record<string, string>> = {
  English: {
    demo: "BRONSON FAMILY FARM ECOSYSTEM",
    mainTitle: "Connected Food Ecosystem Experience",
    guided: "Begin Guided Tour",
    pause: "Pause Tour",
    back: "Back",
    stay: "Stay Here",
    forward: "Go Forward",
    language: "Language Access",
    return: "Return to Ecosystem",
    decision: "Decision",
    feedback: "Feedback",
  },
  Español: {
    demo: "ECOSISTEMA DE BRONSON FAMILY FARM",
    mainTitle: "Experiencia de ecosistema alimentario conectado",
    guided: "Iniciar recorrido guiado",
    pause: "Pausar recorrido",
    back: "Atrás",
    stay: "Quedarse aquí",
    forward: "Avanzar",
    language: "Acceso de idioma",
    return: "Volver al ecosistema",
    decision: "Decisión",
    feedback: "Comentarios",
  },
  Tagalog: {
    demo: "ECOSYSTEM NG BRONSON FAMILY FARM",
    mainTitle: "Konektadong karanasan sa pagkain at komunidad",
    guided: "Simulan ang gabay na tour",
    pause: "Ihinto muna ang tour",
    back: "Bumalik",
    stay: "Manatili Dito",
    forward: "Magpatuloy",
    language: "Wika",
    return: "Bumalik sa ecosystem",
    decision: "Desisyon",
    feedback: "Feedback",
  },
  Italiano: {
    demo: "ECOSISTEMA BRONSON FAMILY FARM",
    mainTitle: "Esperienza alimentare comunitaria connessa",
    guided: "Avvia tour guidato",
    pause: "Pausa tour",
    back: "Indietro",
    stay: "Resta qui",
    forward: "Vai avanti",
    language: "Lingua",
    return: "Ritorna all'ecosistema",
    decision: "Decisione",
    feedback: "Feedback",
  },
  עברית: {
    demo: "המערכת של חוות משפחת ברונסון",
    mainTitle: "חוויה קהילתית מחוברת סביב מזון",
    guided: "התחל סיור מודרך",
    pause: "השהה סיור",
    back: "חזרה",
    stay: "להישאר כאן",
    forward: "קדימה",
    language: "שפה",
    return: "חזרה למערכת",
    decision: "החלטה",
    feedback: "משוב",
  },
  Français: {
    demo: "ÉCOSYSTÈME BRONSON FAMILY FARM",
    mainTitle: "Expérience alimentaire communautaire connectée",
    guided: "Démarrer la visite guidée",
    pause: "Pause",
    back: "Retour",
    stay: "Rester ici",
    forward: "Avancer",
    language: "Langue",
    return: "Retour à l'écosystème",
    decision: "Décision",
    feedback: "Commentaires",
  },
};

const SCREEN_ORDER: ScreenKey[] = [
  "home",
  "ecosystem",
  "guest",
  "story",
  "airport",
  "regenerative",
  "customer",
  "marketplace",
  "grower",
  "planner",
  "valueAdded",
  "youth",
  "supervisor",
  "parent",
  "partner",
  "events",
  "wellness",
  "decision",
  "feedback",
];

const CONTENT: Record<ScreenKey, ScreenContent> = {
  home: {
    eyebrow: "Welcome",
    title: "Step into the Farm. Experience the wonders of life.",
    subtitle:
      "A living online ecosystem for food access, growers, youth workforce, marketplace activity, health education, airport history, regenerative farming, and community return.",
    image: IMAGES.entrance,
    imageAlt: "Forest entrance into Bronson Family Farm",
    narration:
      "Welcome to Bronson Family Farm. Take a moment to look around the screen first. This is the entrance into a living ecosystem where land, food, young people, growers, families, and community partners are connected.",
    lesson:
      "You are entering the farm experience. The screen will move slowly so every visitor can understand what they are seeing before the next layer appears.",
    actions: [
      { label: "Enter Ecosystem", to: "ecosystem" },
      { label: "Guest Journey", to: "guest" },
    ],
  },
  ecosystem: {
    eyebrow: "The Model",
    title: "Connected Food Ecosystem",
    subtitle:
      "Bronson Family Farm connects guests, customers, growers, youth, supervisors, parents, partners, wellness, marketplace systems, and community resources.",
    image: IMAGES.ecosystem,
    imageAlt: "Growing area at Bronson Family Farm",
    narration:
      "This is the whole ecosystem. Each role connects to another role. A guest can become a customer. A customer can become a volunteer. A youth worker can become a grower. A partner can strengthen the whole system.",
    lesson:
      "The ecosystem is the whole operating system. It is not one page. It is the connection between food, people, learning, work, land, health, and opportunity.",
    actions: [
      { label: "Guest Journey", to: "guest" },
      { label: "Youth Workforce", to: "youth" },
      { label: "Partner Pathway", to: "partner" },
    ],
  },
  guest: {
    eyebrow: "Guest Journey",
    title: "Come experience the farm first.",
    subtitle:
      "Guests enter through beauty, story, land, airport history, regenerative farming, events, and discovery before deciding how they want to participate.",
    image: IMAGES.guest,
    imageAlt: "Guest journey farm image",
    narration:
      "The guest journey starts slowly. A guest should not be rushed. First they see the land. Then they learn the story. Then they understand that the farm connects airport history, family legacy, food access, youth, and the future.",
    lesson:
      "A guest is not pushed immediately into action. The guest is invited to look, listen, learn, and then choose a pathway.",
    actions: [
      { label: "Farm Story", to: "story" },
      { label: "Airport History", to: "airport" },
      { label: "Regenerative Farming", to: "regenerative" },
    ],
  },
  story: {
    eyebrow: "Story / Legacy",
    title: "The farm carries family, land, culture, and future opportunity.",
    subtitle:
      "The ecosystem honors Bronson and Lorenzana family legacy while building a practical food and workforce destination in Youngstown.",
    image: IMAGES.story,
    imageAlt: "Farm legacy image",
    narration:
      "The story matters because people protect what they understand. Bronson Family Farm is rooted in family history, agriculture, faith, education, culture, and community responsibility.",
    lesson:
      "Legacy gives the farm meaning. It helps youth and visitors understand that this work belongs to a bigger story.",
    actions: [
      { label: "Airport History", to: "airport" },
      { label: "Regenerative Farming", to: "regenerative" },
      { label: "Return to Guest", to: "guest" },
    ],
  },
  airport: {
    eyebrow: "Youth-Accessible Airport History",
    title: "The farm grows at a historic airport.",
    subtitle:
      "Lansdowne Airport helps youth understand place, aviation, military service, land use, discipline, responsibility, and community history.",
    image: IMAGES.airport,
    imageAlt: "Historic airport-connected farm area",
    narration:
      "This land has a story before the farm. An airport is a place where people learn direction, safety, signals, teamwork, and responsibility. Youth can understand the airport as history and as a classroom. The same land that once supported flight can now support food, learning, and opportunity.",
    lesson:
      "For youth, airport history can be explained through direction, safety, signals, service, discipline, and responsibility.",
    actions: [
      { label: "Regenerative Farming", to: "regenerative" },
      { label: "Youth Workforce", to: "youth" },
      { label: "Return to Guest", to: "guest" },
    ],
  },
  regenerative: {
    eyebrow: "Regenerative Farming",
    title: "We are using regenerative farming to develop the land.",
    subtitle:
      "Regenerative farming means improving the soil, protecting the land, reducing waste, growing food, and leaving the place healthier over time.",
    image: IMAGES.regenerative,
    imageAlt: "Compost and soil-building image",
    narration:
      "Regenerative farming means the farm is not only taking from the land. It is giving back. We build soil, use compost, protect living systems, reduce waste, care for water, and grow in a way that helps the land become stronger over time.",
    lesson:
      "Regenerative farming is stewardship. The goal is healthier soil, stronger plants, less waste, and land that improves as people care for it.",
    actions: [
      { label: "Grower Pathway", to: "grower" },
      { label: "Youth Workforce", to: "youth" },
      { label: "Guest Journey", to: "guest" },
    ],
  },
  customer: {
    eyebrow: "Customer Pathway",
    title: "Fresh food, nutrition, recipes, and return visits.",
    subtitle:
      "Customers move to the marketplace, then return for food guidance, nutrition education, and healthier choices.",
    image: IMAGES.customer,
    imageAlt: "Customer food pathway",
    narration:
      "The customer pathway helps families move from interest to fresh food. Food access becomes stronger when people also receive recipes, nutrition support, and reasons to return.",
    lesson:
      "The customer pathway connects shopping to health, learning, family meals, and repeated community participation.",
    actions: [
      { label: "Marketplace", to: "marketplace" },
      { label: "Wellness / Nutrition", to: "wellness" },
      { label: "Open GrownBy Store", href: "https://grownby.com/farms/bronson-family-farm/shop" },
    ],
  },
  marketplace: {
    eyebrow: "Marketplace",
    title: "Move food from farm to families, schools, and community destinations.",
    subtitle:
      "The marketplace connects products, preorders, SNAP-aware shopping, grower supply activity, and community-facing sales.",
    image: IMAGES.marketplace,
    imageAlt: "Marketplace ecosystem image",
    narration:
      "The marketplace is where growing becomes movement. Produce, seedlings, Bubble Babies, and value-added products can move from the farm into homes, schools, and community destinations.",
    lesson:
      "The marketplace turns growing into access. It connects farm production to customers, events, growers, and community need.",
    actions: [
      { label: "Open GrownBy Store", href: "https://grownby.com/farms/bronson-family-farm/shop" },
      { label: "Customer Path", to: "customer" },
      { label: "Crop Planner", to: "planner" },
    ],
  },
  grower: {
    eyebrow: "Grower Pathway",
    title: "Tools, knowledge, planning, and support for growers.",
    subtitle:
      "Growers enter the ecosystem for seasonal planning, demonstrations, supplies, coordination, and access to market opportunity.",
    image: IMAGES.grower,
    imageAlt: "Grower growing area",
    narration:
      "The grower pathway helps people grow successfully. Growers need timing, tools, supplies, knowledge, weather awareness, and a place to connect what they grow to buyers and community needs.",
    lesson:
      "A grower needs more than seeds. A grower needs timing, tools, supplies, learning, weather awareness, and a pathway to market.",
    actions: [
      { label: "Crop Planner", to: "planner" },
      { label: "Marketplace", to: "marketplace" },
      { label: "Regenerative Farming", to: "regenerative" },
    ],
  },
  planner: {
    eyebrow: "Crop Planner",
    title: "Planning connects crops, weather, workforce, events, and market readiness.",
    subtitle:
      "The planner makes the ecosystem operational by connecting farm work to timing, staffing, inventory, and outcomes.",
    image: IMAGES.planner,
    imageAlt: "Crop planner pathway",
    narration:
      "The crop planner helps the farm make decisions. Farming depends on timing, weather, workers, crop stage, inventory, and where the food is going next.",
    lesson:
      "Planning keeps the farm from guessing. It connects planting, harvesting, youth work, inventory, events, and sales.",
    actions: [
      { label: "Grower Path", to: "grower" },
      { label: "Youth Workforce", to: "youth" },
      { label: "Marketplace", to: "marketplace" },
    ],
  },
  valueAdded: {
    eyebrow: "Value-Added Producer",
    title: "Turn products into demonstrations, packaging, branding, and income.",
    subtitle:
      "Value-added producers connect creativity, food safety, packaging, customer education, and market access.",
    image: IMAGES.valueAdded,
    imageAlt: "Value-added food image",
    narration:
      "Value-added work helps growers and producers create more value. A product needs a story, packaging, customer education, safety awareness, and a clear path to market.",
    lesson:
      "Value-added work helps produce become products, demonstrations, meals, education, and income.",
    actions: [
      { label: "Marketplace", to: "marketplace" },
      { label: "Events", to: "events" },
      { label: "Customer Path", to: "customer" },
    ],
  },
  youth: {
    eyebrow: "Youth Workforce",
    title: "More than a job. We are building our future.",
    subtitle:
      "Youth ages 14–18 experience agriculture, STEAM, teamwork, responsibility, enterprise, and community purpose.",
    image: IMAGES.youth,
    imageAlt: "Youth workforce pathway",
    narration:
      "Youth workforce is more than a summer job. Youth learn safety, attendance, teamwork, growing, harvesting, inventory, marketplace support, communication, and leadership. Staff supervisors guide youth. Random people do not get access to youth.",
    lesson:
      "Youth are protected through staff supervision, check-in, PPE, assignments, structure, and clear adult responsibility.",
    actions: [
      { label: "Supervisor Portal", to: "supervisor" },
      { label: "Parent / Guardian View", to: "parent" },
      { label: "Crop Planner", to: "planner" },
    ],
  },
  supervisor: {
    eyebrow: "Supervisor Portal",
    title: "Mobile-first support for youth workforce accountability.",
    subtitle:
      "Supervisors use phones to support attendance, assignments, PPE, wellness, observations, progress, and daily notes.",
    image: IMAGES.supervisor,
    imageAlt: "Supervisor pathway",
    narration:
      "The supervisor pathway is for staff. Supervisors support youth through check-in, safety, task assignments, observations, notes, and care. This protects the program and keeps youth connected to responsible adults.",
    lesson:
      "Supervisors are the staff layer. They support youth, protect the program, document progress, and communicate concerns.",
    actions: [
      { label: "Youth Workforce", to: "youth" },
      { label: "Parent / Guardian View", to: "parent" },
      { label: "Wellness Support", to: "wellness" },
    ],
  },
  parent: {
    eyebrow: "Parent / Guardian Connection",
    title: "Families can see progress, purpose, and support.",
    subtitle:
      "The parent pathway helps guardians understand youth progress, expectations, safety, attendance, and next steps.",
    image: IMAGES.parent,
    imageAlt: "Parent guardian connection",
    narration:
      "Parents and guardians need to know what youth are doing and why it matters. This pathway explains safety, daily rhythm, progress, expectations, and how the program supports growth.",
    lesson:
      "The parent portal builds trust by showing safety, structure, progress, communication, and next steps.",
    actions: [
      { label: "Youth Workforce", to: "youth" },
      { label: "Supervisor Portal", to: "supervisor" },
      { label: "Feedback", to: "feedback" },
    ],
  },
  partner: {
    eyebrow: "Partner / Investor",
    title: "Support the infrastructure that lets the ecosystem work.",
    subtitle:
      "Partners help with tools, fencing, water, solar, transportation, workforce, education, wellness, market access, and capacity.",
    image: IMAGES.partner,
    imageAlt: "Partner pathway",
    narration:
      "Partners strengthen the whole ecosystem. The farm needs practical support: water, solar, tools, fencing, storage, tables, canopies, transportation, education, and workforce support.",
    lesson:
      "Partners do not support one isolated activity. They strengthen the infrastructure that allows the whole ecosystem to function.",
    actions: [
      { label: "Events", to: "events" },
      { label: "Feedback", to: "feedback" },
      { label: "Return to Ecosystem", to: "ecosystem" },
    ],
  },
  events: {
    eyebrow: "Events",
    title: "Events bring people back into the ecosystem.",
    subtitle:
      "Growers Supply Market, seed giveaways, demonstrations, wellness education, and community days create repeated entry points.",
    image: IMAGES.events,
    imageAlt: "Community event pathway",
    narration:
      "Events help people return. They give guests, customers, growers, youth, partners, and families a reason to come back, learn, shop, volunteer, and connect.",
    lesson:
      "Events make the ecosystem visible. They help people see, learn, participate, and return.",
    actions: [
      { label: "Guest Journey", to: "guest" },
      { label: "Marketplace", to: "marketplace" },
      { label: "Wellness", to: "wellness" },
    ],
  },
  wellness: {
    eyebrow: "Wellness / Nutrition",
    title: "Food is health, learning, culture, and confidence.",
    subtitle:
      "The wellness path connects produce, recipes, nutrition education, screenings, family support, and healthier choices.",
    image: IMAGES.wellness,
    imageAlt: "Wellness and nutrition pathway",
    narration:
      "Food is more than something to buy. Food connects to health, culture, family, confidence, and community. Wellness helps people understand how to use fresh food well.",
    lesson:
      "Wellness connects fresh food to health, mental wellness, recipes, culture, family, and belonging.",
    actions: [
      { label: "Customer Path", to: "customer" },
      { label: "Marketplace", to: "marketplace" },
      { label: "Events", to: "events" },
    ],
  },
  decision: {
    eyebrow: "Decision",
    title: "What do you want to do next?",
    subtitle:
      "Every pathway ends with a clear choice so the visitor does not get lost.",
    image: IMAGES.decision,
    imageAlt: "Decision pathway",
    narration:
      "Now choose what comes next. You can become a guest, customer, grower, youth worker, supervisor, parent, partner, volunteer, or supporter. The ecosystem keeps moving forward.",
    lesson:
      "The ecosystem should never strand the visitor. Each role leads to a clear next step.",
    actions: [
      { label: "Become a Grower", to: "grower" },
      { label: "Support Youth", to: "youth" },
      { label: "Feedback & Contact", to: "feedback" },
    ],
  },
  feedback: {
    eyebrow: "Feedback / Contact",
    title: "Tell us how you want to connect.",
    subtitle:
      "The ecosystem closes with feedback, contact, sharing, and the next invitation back into the farm.",
    image: IMAGES.feedback,
    imageAlt: "Feedback and contact pathway",
    narration:
      "Thank you for entering the Bronson Family Farm ecosystem. You can return to the ecosystem, share the farm, shop, ask questions, or tell us how you want to connect.",
    lesson:
      "Contact: 330-275-1604. Website: bronsonfamilyfarm.com. The ecosystem does not end. It invites people back.",
    actions: [
      { label: "Return to Ecosystem", to: "ecosystem" },
      { label: "Shop GrownBy", href: "https://grownby.com/farms/bronson-family-farm/shop" },
      { label: "Decision Screen", to: "decision" },
    ],
  },
};

const ROLE_TILES: { key: ScreenKey; title: string; text: string; image: string }[] = [
  { key: "guest", title: "Guest", text: "Story, events, airport history, and discovery.", image: IMAGES.guest },
  { key: "customer", title: "Customer", text: "Fresh food, marketplace, recipes, and nutrition.", image: IMAGES.customer },
  { key: "grower", title: "Grower", text: "Planning, tools, training, supplies, and market connection.", image: IMAGES.grower },
  { key: "valueAdded", title: "Value-Added", text: "Packaging, demonstrations, branding, and enterprise.", image: IMAGES.valueAdded },
  { key: "youth", title: "Youth Workforce", text: "Safety, work, skill-building, agriculture, and STEAM.", image: IMAGES.youth },
  { key: "supervisor", title: "Supervisor", text: "Staff-only check-ins, support, observations, and accountability.", image: IMAGES.supervisor },
  { key: "parent", title: "Parent / Guardian", text: "Progress, communication, expectations, and support.", image: IMAGES.parent },
  { key: "partner", title: "Partner / Investor", text: "Funding, sponsorship, infrastructure, and impact.", image: IMAGES.partner },
];

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>("home");
  const [lang, setLang] = useState<LangKey>("English");
  const [guided, setGuided] = useState(false);
  const timerRef = useRef<number | null>(null);

  const t = UI[lang];
  const current = CONTENT[screen];
  const currentIndex = SCREEN_ORDER.indexOf(screen);
  const progress = Math.round(((currentIndex + 1) / SCREEN_ORDER.length) * 100);

  const stopSpeech = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /david|mark|daniel|alex|male/i.test(v.name)) ||
      voices.find((v) => /en/i.test(v.lang)) ||
      voices[0];

    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.78;
    utterance.pitch = 1.08;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const clearTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const goto = (next: ScreenKey, keepGuided = false) => {
    clearTimer();
    stopSpeech();
    setScreen(next);
    if (!keepGuided) setGuided(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goForward = (keepGuided = guided) => {
    const next = SCREEN_ORDER[(currentIndex + 1) % SCREEN_ORDER.length];
    goto(next, keepGuided);
  };

  const goBack = () => {
    const prev = SCREEN_ORDER[(currentIndex - 1 + SCREEN_ORDER.length) % SCREEN_ORDER.length];
    goto(prev);
  };

  const stayHere = () => {
    clearTimer();
    stopSpeech();
    setGuided(false);
  };

  const performAction = (action: Action) => {
    clearTimer();
    stopSpeech();
    if (action.href) {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (action.to) goto(action.to);
  };

  useEffect(() => {
    if (!guided) return;
    clearTimer();
    speak(current.narration);

    timerRef.current = window.setTimeout(() => {
      setScreen((prev) => {
        const i = SCREEN_ORDER.indexOf(prev);
        return SCREEN_ORDER[(i + 1) % SCREEN_ORDER.length];
      });
    }, 15000);

    return () => {
      clearTimer();
      stopSpeech();
    };
  }, [guided, screen]);

  return (
    <main style={styles.shell} dir={lang === "עברית" ? "rtl" : "ltr"}>
      <div style={styles.background} />

      <header style={styles.header}>
        <button style={styles.brand} onClick={() => goto("home")}>
          <span style={styles.brandMark}>BFF</span>
          <span>
            <span style={styles.brandTiny}>{t.demo}</span>
            <span style={styles.brandTitle}>{t.mainTitle}</span>
          </span>
        </button>

        <div style={styles.languageArea}>
          <div style={styles.languageLabel}>{t.language}</div>
          <div style={styles.languagePills}>
            {LANGS.map((item) => (
              <button
                key={item}
                style={item === lang ? styles.langActive : styles.langBtn}
                onClick={() => setLang(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <button style={styles.guidedButton} onClick={() => setGuided((v) => !v)}>
            {guided ? t.pause : t.guided}
          </button>
        </div>
      </header>

      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      </div>

      <section style={styles.hero}>
        <article style={styles.leftPanel}>
          <p style={styles.eyebrow}>{current.eyebrow}</p>
          <h1 style={styles.title}>{current.title}</h1>
          <p style={styles.subtitle}>{current.subtitle}</p>

          <div style={styles.actions}>
            {current.actions.map((action) => (
              <button key={action.label} style={styles.primaryBtn} onClick={() => performAction(action)}>
                {action.label}
              </button>
            ))}
          </div>

          <div style={styles.tourControls}>
            <button style={styles.secondaryBtn} onClick={goBack}>
              {t.back}
            </button>
            <button style={styles.secondaryBtn} onClick={stayHere}>
              {t.stay}
            </button>
            <button style={styles.secondaryBtn} onClick={() => goForward(guided)}>
              {t.forward}
            </button>
          </div>

          <p style={styles.lesson}>{current.lesson}</p>
        </article>

        <aside style={styles.rightPanel}>
          <img
            src={current.image}
            alt={current.imageAlt}
            style={styles.heroImage}
            onError={(event) => {
              event.currentTarget.src = IMAGES.fallback;
            }}
          />
          <div style={styles.imageShade} />
          <div style={styles.caption}>{current.imageAlt}</div>
        </aside>
      </section>

      {screen === "ecosystem" && (
        <section style={styles.roleGrid}>
          {ROLE_TILES.map((role) => (
            <button
              key={role.key}
              style={{
                ...styles.roleTile,
                backgroundImage: `linear-gradient(180deg, rgba(6,18,10,.10), rgba(6,18,10,.88)), url("${role.image}")`,
              }}
              onClick={() => goto(role.key)}
            >
              <span style={styles.roleTitle}>{role.title}</span>
              <span style={styles.roleText}>{role.text}</span>
            </button>
          ))}
        </section>
      )}

      <nav style={styles.fixedNav}>
        <button style={styles.navBtn} onClick={() => goto("ecosystem")}>
          {t.return}
        </button>
        <button style={styles.navBtn} onClick={() => goto("decision")}>
          {t.decision}
        </button>
        <button style={styles.navBtn} onClick={() => goto("feedback")}>
          {t.feedback}
        </button>
      </nav>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  shell: {
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial",
    position: "relative",
    overflowX: "hidden",
    padding: "22px clamp(14px, 3vw, 44px) 92px",
  },
  background: {
    position: "fixed",
    inset: 0,
    zIndex: -2,
    background:
      "radial-gradient(circle at 10% 5%, rgba(242,210,124,.18), transparent 30%), radial-gradient(circle at 90% 0%, rgba(143,179,106,.16), transparent 28%), linear-gradient(135deg, #172415 0%, #26351e 44%, #0b140d 100%)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.15)",
    borderRadius: 20,
    padding: "12px 16px",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
  },
  brandMark: {
    width: 50,
    height: 50,
    borderRadius: 15,
    display: "grid",
    placeItems: "center",
    background: "rgba(242,210,124,.25)",
    color: "#fff4cf",
    fontWeight: 950,
  },
  brandTiny: {
    display: "block",
    color: "#f2d27c",
    letterSpacing: ".18em",
    fontSize: 11,
    fontWeight: 950,
  },
  brandTitle: {
    display: "block",
    fontSize: 19,
    fontWeight: 950,
    lineHeight: 1.1,
  },
  languageArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  languageLabel: {
    color: "#f2d27c",
    letterSpacing: ".25em",
    fontSize: 12,
    fontWeight: 950,
    textTransform: "uppercase",
  },
  languagePills: {
    display: "flex",
    gap: 7,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  langBtn: {
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    borderRadius: 999,
    padding: "8px 11px",
    cursor: "pointer",
    fontWeight: 850,
    fontSize: 12,
  },
  langActive: {
    border: "1px solid rgba(242,210,124,.72)",
    background: "rgba(242,210,124,.24)",
    color: "#fff4cf",
    borderRadius: 999,
    padding: "8px 11px",
    cursor: "pointer",
    fontWeight: 950,
    fontSize: 12,
  },
  guidedButton: {
    border: "1px solid rgba(242,210,124,.55)",
    background: "rgba(242,210,124,.18)",
    color: "#fff4cf",
    borderRadius: 999,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 950,
    fontSize: 15,
  },
  progressTrack: {
    height: 9,
    background: "rgba(255,255,255,.11)",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 18,
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #f2d27c, #9ec06f)",
    borderRadius: 999,
    transition: "width .45s ease",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, .9fr) minmax(360px, 1.1fr)",
    gap: 18,
    alignItems: "stretch",
  },
  leftPanel: {
    minHeight: 470,
    borderRadius: 28,
    padding: "clamp(24px, 4vw, 48px)",
    background: "rgba(6,18,10,.63)",
    border: "1px solid rgba(255,255,255,.14)",
    boxShadow: "0 24px 70px rgba(0,0,0,.28)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightPanel: {
    position: "relative",
    minHeight: 470,
    borderRadius: 28,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(0,0,0,.18)",
    boxShadow: "0 24px 70px rgba(0,0,0,.30)",
  },
  heroImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imageShade: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.42))",
  },
  caption: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 16,
    background: "rgba(0,0,0,.38)",
    border: "1px solid rgba(255,255,255,.16)",
    borderRadius: 16,
    padding: "10px 12px",
    fontWeight: 850,
  },
  eyebrow: {
    color: "#f2d27c",
    letterSpacing: ".22em",
    fontSize: 12,
    fontWeight: 950,
    textTransform: "uppercase",
    margin: "0 0 14px",
  },
  title: {
    fontSize: "clamp(38px, 5vw, 76px)",
    lineHeight: .95,
    margin: "0 0 18px",
    color: "#fff4cf",
    letterSpacing: "-.045em",
  },
  subtitle: {
    fontSize: "clamp(18px, 2vw, 25px)",
    lineHeight: 1.32,
    margin: 0,
    color: "rgba(255,255,255,.91)",
    maxWidth: 850,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 28,
  },
  tourControls: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  primaryBtn: {
    border: "1px solid rgba(255,255,255,.22)",
    background: "rgba(255,255,255,.9)",
    color: "#112015",
    borderRadius: 999,
    padding: "13px 17px",
    fontWeight: 950,
    cursor: "pointer",
  },
  secondaryBtn: {
    border: "1px solid rgba(255,255,255,.20)",
    background: "rgba(255,255,255,.07)",
    color: "#fff4cf",
    borderRadius: 999,
    padding: "13px 17px",
    fontWeight: 950,
    cursor: "pointer",
  },
  lesson: {
    marginTop: 22,
    color: "rgba(255,255,255,.82)",
    fontSize: 16,
    lineHeight: 1.45,
    maxWidth: 780,
  },
  roleGrid: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
  },
  roleTile: {
    minHeight: 160,
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid rgba(255,255,255,.14)",
    borderRadius: 24,
    color: "#fff",
    padding: 18,
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    boxShadow: "0 18px 45px rgba(0,0,0,.24)",
  },
  roleTitle: {
    color: "#fff4cf",
    fontSize: 22,
    fontWeight: 950,
    marginBottom: 7,
  },
  roleText: {
    color: "rgba(255,255,255,.88)",
    fontSize: 14,
    lineHeight: 1.25,
    fontWeight: 750,
  },
  fixedNav: {
    position: "fixed",
    left: 18,
    right: 18,
    bottom: 18,
    display: "flex",
    justifyContent: "center",
    gap: 12,
    zIndex: 20,
    flexWrap: "wrap",
  },
  navBtn: {
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(8,20,12,.84)",
    backdropFilter: "blur(14px)",
    color: "#fff4cf",
    borderRadius: 999,
    padding: "13px 18px",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 12px 36px rgba(0,0,0,.25)",
  },
};
