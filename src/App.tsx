import { useMemo, useState } from "react";

type PathwayKey =
  | "guest"
  | "customer"
  | "grower"
  | "youth"
  | "marketplace"
  | "value"
  | "partner"
  | "supervisor"
  | "parent";

type LangKey = "English" | "Español" | "Tagalog" | "Italiano" | "עברית" | "Français";

const LANGS: LangKey[] = ["English", "Español", "Tagalog", "Italiano", "עברית", "Français"];

const img = (name: string) => `/images/${encodeURIComponent(name).replaceAll("%2F", "/")}`;

const images = {
  ecosystem: img("ConnectFoodEcosystem_withimages.png"),
  growArea: img("Grow Area.png"),
  growArea2: img("GrowArea2.jpg"),
  fence: img("Deer Fencing.png"),
  volunteers: img("Fence_volunteers.png"),
  seeds: img("Seeds_Jubilee Gardens.png"),
  elliott: img("Compost_ElliottGarden.png"),
  compost: img("Compost_Elliott.png"),
  csu: img("CSU_MParker.png"),
  queens: img("Queens Village.png"),
  wkbn: img("WKBN Interview.png"),
  culinaryFlowers: img("culniary_edibleflowers.jpeg"),
  culinaryFlowers2: img("culniary_edibleflowers2.jpeg"),
  mushrooms: img("culniary_mushrooms.jpeg"),
  market: img("large (1).jpg"),
  market2: img("large (12).jpg"),
  produce: img("large (15).jpg"),
  youth: img("Samaeera2.jpg"),
  youth2: img("Sameera3.jpg"),
  youth3: img("Samerra4.jpg"),
  youth4: img("Samerra5.jpg"),
};

const ui: Record<LangKey, any> = {
  English: {
    demo: "BRONSON FAMILY FARM ECOSYSTEM",
    title: "Connected Food Ecosystem Experience",
    subtitle:
      "A living farm-based system connecting food, youth workforce, growers, marketplace, partners, health, and community.",
    guided: "Guided Tour",
    pathways: "Pathways",
    back: "Back",
    next: "Next",
    home: "Home",
    decide: "Final Decision",
    share: "Share / Invite",
    feedback: "Feedback",
    start: "Start Pathway",
  },
  Español: {
    demo: "ECOSISTEMA BRONSON FAMILY FARM",
    title: "Experiencia de Ecosistema Alimentario Conectado",
    subtitle: "Un sistema vivo que conecta alimentos, jóvenes, productores, mercado, aliados y comunidad.",
    guided: "Recorrido Guiado",
    pathways: "Caminos",
    back: "Atrás",
    next: "Siguiente",
    home: "Inicio",
    decide: "Decisión Final",
    share: "Compartir / Invitar",
    feedback: "Comentarios",
    start: "Iniciar Camino",
  },
  Tagalog: {
    demo: "BRONSON FAMILY FARM ECOSYSTEM",
    title: "Konektadong Karanasan sa Pagkain at Komunidad",
    subtitle: "Isang buhay na sistema ng sakahan, kabataan, growers, pamilihan, partners, at pamilya.",
    guided: "Guided Tour",
    pathways: "Pathways",
    back: "Balik",
    next: "Susunod",
    home: "Home",
    decide: "Final Decision",
    share: "Share / Invite",
    feedback: "Feedback",
    start: "Start Pathway",
  },
  Italiano: {
    demo: "ECOSISTEMA BRONSON FAMILY FARM",
    title: "Esperienza di Ecosistema Alimentare Connesso",
    subtitle: "Un sistema vivo che collega cibo, giovani, produttori, mercato, partner e comunità.",
    guided: "Tour Guidato",
    pathways: "Percorsi",
    back: "Indietro",
    next: "Avanti",
    home: "Home",
    decide: "Decisione Finale",
    share: "Condividi / Invita",
    feedback: "Feedback",
    start: "Avvia Percorso",
  },
  עברית: {
    demo: "BRONSON FAMILY FARM ECOSYSTEM",
    title: "חוויית מערכת מזון קהילתית מחוברת",
    subtitle: "מערכת חיה המחברת חווה, נוער, מגדלים, שוק, שותפים וקהילה.",
    guided: "סיור מודרך",
    pathways: "מסלולים",
    back: "חזרה",
    next: "הבא",
    home: "בית",
    decide: "החלטה סופית",
    share: "שתף / הזמן",
    feedback: "משוב",
    start: "התחל מסלול",
  },
  Français: {
    demo: "ÉCOSYSTÈME BRONSON FAMILY FARM",
    title: "Expérience d’un Écosystème Alimentaire Connecté",
    subtitle: "Un système vivant reliant ferme, jeunes, producteurs, marché, partenaires et communauté.",
    guided: "Visite Guidée",
    pathways: "Parcours",
    back: "Retour",
    next: "Suivant",
    home: "Accueil",
    decide: "Décision Finale",
    share: "Partager / Inviter",
    feedback: "Retour",
    start: "Commencer",
  },
};

const tour = [
  {
    title: "The Ecosystem",
    image: images.ecosystem,
    text:
      "Bronson Family Farm is not a single program. It is a connected food ecosystem where people enter through different pathways and leave with a clear next step.",
  },
  {
    title: "The Land",
    image: images.growArea,
    text:
      "The farm uses real land, real growing space, real infrastructure, and community participation to create food access, learning, and opportunity.",
  },
  {
    title: "Growers Supply Market",
    image: images.market,
    text:
      "The marketplace connects tools, seedlings, knowledge, demonstrations, growers, families, and partners into one shared community experience.",
  },
  {
    title: "Youth Workforce",
    image: images.youth,
    text:
      "Youth enter a structured work-based learning experience with daily rhythm, supervision, safety, skill-building, reflection, and progress tracking.",
  },
  {
    title: "Partner Network",
    image: images.csu,
    text:
      "Partners strengthen the system through education, food access, materials, training, demonstrations, sponsorship, workforce support, and community trust.",
  },
];

const pathways: Record<PathwayKey, any> = {
  guest: {
    label: "Guest",
    image: images.queens,
    question: "Do I understand the vision and want to experience the farm?",
    benefit: "Guests discover the story, purpose, beauty, and community value of the farm.",
    steps: [
      "Enter through the farm welcome experience.",
      "Learn why the ecosystem exists.",
      "See food, land, youth, growers, partners, and marketplace connected.",
      "Choose whether to return, volunteer, buy, donate, or invite others.",
    ],
    decision: "I want to visit, share, volunteer, or become part of the farm community.",
  },
  customer: {
    label: "Customer",
    image: images.produce,
    question: "Do I want fresh food, seedlings, nutrition support, or repeat access?",
    benefit: "Customers turn interest into healthy choices and repeat purchasing power.",
    steps: [
      "View available seedlings, produce, seed rolls, and community offerings.",
      "Learn what is SNAP-eligible or pickup-ready.",
      "Understand how fresh food supports nutrition and household wellness.",
      "Choose to purchase, pre-order, return, or refer another family.",
    ],
    decision: "I want to buy, pre-order, return to the marketplace, or share with another household.",
  },
  grower: {
    label: "Grower",
    image: images.growArea2,
    question: "Do I want to become a grower or improve what I already grow?",
    benefit: "Growers receive tools, education, market connection, and shared support.",
    steps: [
      "Identify current growing level: beginner, home gardener, community grower, or producer.",
      "Connect to seeds, seedlings, compost, fencing, tools, and demonstrations.",
      "Learn growing methods, pest protection, soil building, irrigation, and market readiness.",
      "Decide whether to grow for home, community, market, or partnership.",
    ],
    decision: "I want to grow food, join the grower network, sell through the ecosystem, or receive support.",
  },
  youth: {
    label: "Youth Workforce",
    image: images.youth2,
    question: "What will youth experience from June 8 through August 28, 2026?",
    benefit: "Youth build responsibility, work habits, outdoor skills, teamwork, confidence, and future readiness.",
    steps: [
      "Attend orientation and understand expectations.",
      "Use PPE, safety rules, and daily check-ins.",
      "Rotate through farm tasks, marketplace support, food system learning, and reflection.",
      "Receive supervisor observations, skill tracking, badges, and progress feedback.",
      "Complete the program with a record of growth, attendance, skills, and next-step readiness.",
    ],
    decision: "Youth complete the journey with documented skills, confidence, and a pathway to future work.",
  },
  marketplace: {
    label: "Marketplace",
    image: images.market2,
    question: "How does the marketplace convert interest into sustainability?",
    benefit: "The marketplace creates revenue, education, food access, and community connection.",
    steps: [
      "Showcase seedlings, produce, demonstrations, tools, compost, seeds, and value-added learning.",
      "Connect customers to growers and growers to market opportunity.",
      "Use QR codes, pre-orders, registration, and check-in to build repeat participation.",
      "Track interest, sales, feedback, and future demand.",
    ],
    decision: "The marketplace becomes a repeatable food access and revenue engine.",
  },
  value: {
    label: "Value-Added",
    image: images.culinaryFlowers,
    question: "Can food become education, enterprise, and experience?",
    benefit: "Value-added pathways turn farm products into demonstrations, culinary learning, and future enterprise.",
    steps: [
      "Introduce edible flowers, mushrooms, herbs, seedlings, and specialty crops.",
      "Connect culinary education with youth workforce and partner demonstrations.",
      "Explore products, workshops, tastings, and seasonal offerings.",
      "Decide what can become a future farm-based revenue stream.",
    ],
    decision: "I want to develop, teach, sponsor, or purchase value-added farm experiences.",
  },
  partner: {
    label: "Partner",
    image: images.fence,
    question: "How can partners strengthen the ecosystem?",
    benefit: "Partners help supply materials, knowledge, funding, demonstrations, health support, workforce, and visibility.",
    steps: [
      "Understand the farm’s mission and current operational needs.",
      "Choose a role: materials, education, funding, workforce, health, media, volunteers, or marketplace support.",
      "Align partner contribution with a visible community outcome.",
      "Receive follow-up, reporting, acknowledgment, and future collaboration opportunities.",
    ],
    decision: "I want to sponsor, donate, teach, volunteer, fund, or formally partner.",
  },
  supervisor: {
    label: "Supervisor",
    image: images.volunteers,
    question: "How do supervisors guide and track youth?",
    benefit: "Supervisors protect safety, structure the day, document growth, and keep youth moving forward.",
    steps: [
      "Check youth in daily using phone-friendly tools.",
      "Confirm PPE, attendance, task assignment, and safety readiness.",
      "Observe teamwork, responsibility, communication, initiative, and task completion.",
      "Record progress and concerns for parent/guardian and program follow-up.",
    ],
    decision: "Supervisors complete daily tracking and help youth build measurable work readiness.",
  },
  parent: {
    label: "Parent / Guardian",
    image: images.youth4,
    question: "How do families stay connected to youth progress?",
    benefit: "Parents and guardians see youth growth, expectations, attendance, achievements, and next steps.",
    steps: [
      "Receive orientation information and program expectations.",
      "Understand safety, attendance, communication, and youth responsibilities.",
      "View progress summaries, badges, supervisor notes, and accomplishments.",
      "Celebrate completion and support the youth’s next opportunity.",
    ],
    decision: "Families stay informed, encouraged, and connected to youth growth.",
  },
};

export default function App() {
  const [lang, setLang] = useState<LangKey>("English");
  const [mode, setMode] = useState<"home" | "tour" | "pathway">("home");
  const [tourIndex, setTourIndex] = useState(0);
  const [active, setActive] = useState<PathwayKey>("guest");

  const t = ui[lang];
  const activePath = pathways[active];

  const pathwayKeys = useMemo(() => Object.keys(pathways) as PathwayKey[], []);

  return (
    <main className="app">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #132016; font-family: Georgia, 'Times New Roman', serif; }
        .app {
          min-height: 100vh;
          color: #fff8ea;
          background:
            radial-gradient(circle at 20% 20%, rgba(248, 186, 96, .26), transparent 30%),
            radial-gradient(circle at 80% 10%, rgba(134, 174, 113, .28), transparent 35%),
            linear-gradient(135deg, #0f1e14 0%, #253b24 48%, #6b4e2e 100%);
          padding: 22px;
        }
        .shell {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          gap: 22px;
          min-height: calc(100vh - 44px);
        }
        .panel {
          border: 1px solid rgba(255,255,255,.18);
          background: rgba(20, 33, 20, .72);
          backdrop-filter: blur(12px);
          border-radius: 30px;
          box-shadow: 0 24px 70px rgba(0,0,0,.35);
          overflow: hidden;
        }
        .left { padding: 28px; display: flex; flex-direction: column; }
        .kicker {
          letter-spacing: .18em;
          font-size: 12px;
          color: #f3c273;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        h1 { font-size: clamp(38px, 5vw, 70px); line-height: .95; margin: 0 0 18px; }
        h2 { font-size: clamp(28px, 3vw, 46px); line-height: 1.02; margin: 0 0 14px; }
        p { font-size: 18px; line-height: 1.55; color: #f5ead6; }
        .topbar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
        select, button {
          border: 1px solid rgba(255,255,255,.22);
          background: rgba(255,255,255,.1);
          color: #fff8ea;
          border-radius: 999px;
          padding: 11px 15px;
          font-weight: 700;
          cursor: pointer;
        }
        select option { color: #132016; }
        button.primary { background: #f0b35b; color: #172016; border: none; }
        button.active { background: #fff8ea; color: #172016; }
        .heroImg, .sideImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .imagePanel { position: relative; min-height: 520px; }
        .caption {
          position: absolute;
          left: 20px; right: 20px; bottom: 20px;
          background: rgba(12, 24, 13, .72);
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 22px;
          padding: 16px;
        }
        .pathGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 22px 0;
        }
        .pathBtn { white-space: normal; min-height: 58px; }
        .steps {
          display: grid;
          gap: 10px;
          margin: 18px 0;
        }
        .step {
          padding: 13px 15px;
          border-radius: 18px;
          background: rgba(255,255,255,.09);
          border: 1px solid rgba(255,255,255,.12);
          font-size: 16px;
          line-height: 1.35;
        }
        .decision {
          margin-top: auto;
          padding: 18px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(240,179,91,.24), rgba(134,174,113,.22));
          border: 1px solid rgba(255,255,255,.2);
        }
        .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
        .mini {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 18px;
        }
        .mini div {
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 18px;
          padding: 13px;
          font-size: 14px;
          line-height: 1.35;
        }
        @media (max-width: 900px) {
          .shell { grid-template-columns: 1fr; }
          .imagePanel { min-height: 360px; }
          .pathGrid { grid-template-columns: repeat(2, 1fr); }
          .mini { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="shell">
        <div className="panel left">
          <div className="topbar">
            <select value={lang} onChange={(e) => setLang(e.target.value as LangKey)}>
              {LANGS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <button onClick={() => setMode("home")} className={mode === "home" ? "active" : ""}>
              {t.home}
            </button>
            <button onClick={() => setMode("tour")} className={mode === "tour" ? "active" : ""}>
              {t.guided}
            </button>
            <button onClick={() => setMode("pathway")} className={mode === "pathway" ? "active" : ""}>
              {t.pathways}
            </button>
          </div>

          {mode === "home" && (
            <>
              <div className="kicker">{t.demo}</div>
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
              <div className="mini">
                <div><b>Food Access</b><br />Fresh food, seedlings, seeds, tools, and nutrition education.</div>
                <div><b>Youth Workforce</b><br />June 8–August 28, 2026 with supervisor tracking and family connection.</div>
                <div><b>Marketplace</b><br />A growers supply market that creates repeat participation and sustainability.</div>
              </div>
              <div className="pathGrid">
                {pathwayKeys.map((key) => (
                  <button key={key} className="pathBtn" onClick={() => { setActive(key); setMode("pathway"); }}>
                    {pathways[key].label}
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === "tour" && (
            <>
              <div className="kicker">{t.guided}</div>
              <h2>{tour[tourIndex].title}</h2>
              <p>{tour[tourIndex].text}</p>
              <div className="actions">
                <button onClick={() => setTourIndex(Math.max(0, tourIndex - 1))}>{t.back}</button>
                <button className="primary" onClick={() => setTourIndex(Math.min(tour.length - 1, tourIndex + 1))}>
                  {t.next}
                </button>
                <button onClick={() => { setActive("guest"); setMode("pathway"); }}>{t.pathways}</button>
              </div>
            </>
          )}

          {mode === "pathway" && (
            <>
              <div className="kicker">{t.pathways}</div>
              <h2>{activePath.label}</h2>
              <p><b>{activePath.question}</b></p>
              <p>{activePath.benefit}</p>

              <div className="pathGrid">
                {pathwayKeys.map((key) => (
                  <button
                    key={key}
                    className={`pathBtn ${active === key ? "active" : ""}`}
                    onClick={() => setActive(key)}
                  >
                    {pathways[key].label}
                  </button>
                ))}
              </div>

              <div className="steps">
                {activePath.steps.map((s: string, i: number) => (
                  <div className="step" key={s}>
                    <b>{i + 1}.</b> {s}
                  </div>
                ))}
              </div>

              <div className="decision">
                <div className="kicker">{t.decide}</div>
                <p>{activePath.decision}</p>
                <div className="actions">
                  <button className="primary">{t.share}</button>
                  <button>{t.feedback}</button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="panel imagePanel">
          <img
            className="heroImg"
            src={
              mode === "home"
                ? images.ecosystem
                : mode === "tour"
                ? tour[tourIndex].image
                : activePath.image
            }
            alt="Bronson Family Farm ecosystem"
          />
          <div className="caption">
            <b>
              {mode === "home"
                ? "Farm + Food + Workforce + Marketplace + Partners"
                : mode === "tour"
                ? tour[tourIndex].title
                : activePath.label}
            </b>
            <br />
            <span>
              {mode === "pathway"
                ? activePath.question
                : "Step into the Farm. Experience the wonders of life."}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
