import React, { useState } from "react";

type Lang = "en" | "es" | "tl" | "it" | "he" | "fr";

type Screen =
  | "home"
  | "guided"
  | "guest"
  | "customer"
  | "marketplace"
  | "grower"
  | "youth"
  | "supervisor"
  | "partner"
  | "valueAdded"
  | "register"
  | "feedback"
  | "problem"
  | "events"
  | "media"
  | "june8"
  | "mission";

type Role =
  | "Guest"
  | "Customer"
  | "Marketplace"
  | "Grower"
  | "Youth Workforce"
  | "Supervisor"
  | "Partner"
  | "Value-Added Producer";

const grownByUrl = "https://grownby.com/farms/bronson-family-farm";

const images = {
  forest: "/GrowArea.png",
  farm: "/GrowArea.jpg",
  guest: "/SAM_0220.JPG",
  marketplace: "/SAM_0313.JPG",
  youth: "/SAM_0277.JPG",
  grower: "/SAM_0258.JPG",
  partner: "/SAM_0245.JPG",
};

const T: Record<Lang, any> = {
  en: {
    beta: "Community Beta Launch",
    title: "Bronson Family Farm Digital Ecosystem",
    welcome: "Welcome to Bronson Family Farm",
    subtitle:
      "A regenerative farm, youth workforce program, marketplace, grower network, agritourism destination, and community development platform at historic Lansdowne Airport in Youngstown, Ohio.",
    choose: "Choose Your Journey",
    tour: "Take Guided Tour",
    feedback: "Share Feedback",
    problem: "Report a Problem",
    home: "Home",
    register: "Register",
    marketplace: "Marketplace",
    grownby: "Shop on GrownBy",
    launchMessage:
      "You are exploring the first public release of the Bronson Family Farm Digital Ecosystem. Your feedback will help shape future improvements.",
    tagline: "We Grow Green to Harvest Dreams.",
    regenerative:
      "Regenerative agriculture improves soil health, protects water, increases biodiversity, restores the land, and creates opportunity for future generations.",
  },
  es: {
    beta: "Lanzamiento Beta Comunitario",
    title: "Ecosistema Digital de Bronson Family Farm",
    welcome: "Bienvenido a Bronson Family Farm",
    subtitle:
      "Una granja regenerativa, programa laboral juvenil, mercado, red de productores, destino agroturístico y plataforma comunitaria en el histórico Aeropuerto Lansdowne de Youngstown, Ohio.",
    choose: "Elija su camino",
    tour: "Recorrido Guiado",
    feedback: "Compartir Comentarios",
    problem: "Reportar un Problema",
    home: "Inicio",
    register: "Registrarse",
    marketplace: "Mercado",
    grownby: "Comprar en GrownBy",
    launchMessage:
      "Está explorando la primera versión pública del Ecosistema Digital de Bronson Family Farm. Sus comentarios ayudarán a mejorar futuras versiones.",
    tagline: "Cultivamos Verde para Cosechar Sueños.",
    regenerative:
      "La agricultura regenerativa mejora el suelo, protege el agua, aumenta la biodiversidad, restaura la tierra y crea oportunidades.",
  },
  tl: {
    beta: "Community Beta Launch",
    title: "Bronson Family Farm Digital Ecosystem",
    welcome: "Maligayang pagdating sa Bronson Family Farm",
    subtitle:
      "Isang regenerative farm, youth workforce program, marketplace, grower network, agritourism destination, at community platform sa historic Lansdowne Airport sa Youngstown, Ohio.",
    choose: "Piliin ang Iyong Landas",
    tour: "Guided Tour",
    feedback: "Magbigay ng Feedback",
    problem: "Mag-ulat ng Problema",
    home: "Home",
    register: "Magparehistro",
    marketplace: "Marketplace",
    grownby: "Mamili sa GrownBy",
    launchMessage:
      "Tinitingnan mo ang unang public release ng Bronson Family Farm Digital Ecosystem. Mahalaga ang iyong feedback.",
    tagline: "We Grow Green to Harvest Dreams.",
    regenerative:
      "Ang regenerative agriculture ay nagpapabuti ng lupa, tubig, biodiversity, at kinabukasan ng komunidad.",
  },
  it: {
    beta: "Lancio Beta Comunitario",
    title: "Ecosistema Digitale Bronson Family Farm",
    welcome: "Benvenuti a Bronson Family Farm",
    subtitle:
      "Una fattoria rigenerativa, programma giovanile, mercato, rete di coltivatori, agriturismo e piattaforma comunitaria presso lo storico Lansdowne Airport a Youngstown, Ohio.",
    choose: "Scegli il tuo percorso",
    tour: "Tour Guidato",
    feedback: "Condividi Feedback",
    problem: "Segnala un Problema",
    home: "Home",
    register: "Registrati",
    marketplace: "Mercato",
    grownby: "Acquista su GrownBy",
    launchMessage:
      "Stai esplorando la prima versione pubblica dell'Ecosistema Digitale Bronson Family Farm.",
    tagline: "Coltiviamo Verde per Raccogliere Sogni.",
    regenerative:
      "L'agricoltura rigenerativa migliora il suolo, protegge l'acqua, aumenta la biodiversità e crea opportunità.",
  },
  he: {
    beta: "השקת בטא קהילתית",
    title: "המערכת הדיגיטלית של Bronson Family Farm",
    welcome: "ברוכים הבאים ל-Bronson Family Farm",
    subtitle:
      "חווה מתחדשת, תוכנית נוער, שוק, רשת מגדלים, תיירות חקלאית ופלטפורמה קהילתית בשדה התעופה ההיסטורי Lansdowne ביאנגסטאון, אוהיו.",
    choose: "בחרו מסלול",
    tour: "סיור מודרך",
    feedback: "שליחת משוב",
    problem: "דיווח על בעיה",
    home: "בית",
    register: "הרשמה",
    marketplace: "שוק",
    grownby: "קנייה ב-GrownBy",
    launchMessage:
      "אתם צופים בגרסה הציבורית הראשונה של המערכת הדיגיטלית של Bronson Family Farm.",
    tagline: "We Grow Green to Harvest Dreams.",
    regenerative:
      "חקלאות מתחדשת משפרת את בריאות הקרקע, מגנה על מים, מגבירה מגוון ביולוגי ויוצרת הזדמנויות.",
  },
  fr: {
    beta: "Lancement bêta communautaire",
    title: "Écosystème numérique de Bronson Family Farm",
    welcome: "Bienvenue à Bronson Family Farm",
    subtitle:
      "Une ferme régénératrice, un programme jeunesse, un marché, un réseau de producteurs, une destination agrotouristique et une plateforme communautaire à l’historique aéroport Lansdowne de Youngstown, Ohio.",
    choose: "Choisissez votre parcours",
    tour: "Visite guidée",
    feedback: "Partager un retour",
    problem: "Signaler un problème",
    home: "Accueil",
    register: "S'inscrire",
    marketplace: "Marché",
    grownby: "Acheter sur GrownBy",
    launchMessage:
      "Vous explorez la première version publique de l’écosystème numérique de Bronson Family Farm.",
    tagline: "Nous cultivons le vert pour récolter des rêves.",
    regenerative:
      "L’agriculture régénératrice améliore les sols, protège l’eau, augmente la biodiversité et crée des opportunités.",
  },
};

const roleMap: { role: Role; screen: Screen; description: string }[] = [
  {
    role: "Guest",
    screen: "guest",
    description: "Explore the farm story, airport history, land, and mission.",
  },
  {
    role: "Customer",
    screen: "customer",
    description: "Find fresh food, nutrition, food access, and marketplace connection.",
  },
  {
    role: "Marketplace",
    screen: "marketplace",
    description: "View products and connect to the Bronson Family Farm GrownBy store.",
  },
  {
    role: "Grower",
    screen: "grower",
    description: "Access growing, training, market, and distribution opportunities.",
  },
  {
    role: "Youth Workforce",
    screen: "youth",
    description: "Check in, learn, reflect, build skills, and explore career pathways.",
  },
  {
    role: "Supervisor",
    screen: "supervisor",
    description: "Track attendance, assessments, reports, safety, and youth support.",
  },
  {
    role: "Partner",
    screen: "partner",
    description: "Collaborate, sponsor, invest, volunteer, and support community impact.",
  },
  {
    role: "Value-Added Producer",
    screen: "valueAdded",
    description: "Explore processing, packaging, branding, distribution, and sales.",
  },
];

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedRole, setSelectedRole] = useState<Role>("Guest");
  const [saved, setSaved] = useState("");

  const t = T[lang];
  const rtl = lang === "he";

  function go(target: Screen) {
    setSaved("");
    setScreen(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openRole(role: Role, target: Screen) {
    setSelectedRole(role);
    go(target);
  }

  function fakeSave(label: string) {
    setSaved(`${label} saved for launch review.`);
  }

  return (
    <main dir={rtl ? "rtl" : "ltr"} style={styles.app}>
      <header style={styles.header}>
        <strong>{t.title}</strong>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          style={styles.select}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="tl">Tagalog</option>
          <option value="it">Italiano</option>
          <option value="he">עברית</option>
          <option value="fr">Français</option>
        </select>
      </header>

      {screen !== "home" && (
        <nav style={styles.nav}>
          <button onClick={() => go("home")}>{t.home}</button>
          <button onClick={() => go("events")}>Events</button>
          <button onClick={() => go("media")}>Media</button>
          <button onClick={() => go("mission")}>Mission Control</button>
          <button onClick={() => go("feedback")}>{t.feedback}</button>
          <button onClick={() => go("problem")}>{t.problem}</button>
        </nav>
      )}

      {screen === "home" && (
        <section
          style={{
            ...styles.hero,
            backgroundImage: `linear-gradient(rgba(14,31,22,.35), rgba(14,31,22,.65)), url(${images.forest})`,
          }}
        >
          <div style={styles.heroCard}>
            <div style={styles.badge}>🌱 {t.beta}</div>

            <h1>{t.welcome}</h1>

            <p>{t.subtitle}</p>

            <p>
              <strong>{t.launchMessage}</strong>
            </p>

            <p>{t.regenerative}</p>

            <h2>{t.choose}</h2>

            <div style={styles.grid}>
              {roleMap.map((item) => (
                <button
                  key={item.role}
                  style={styles.roleButton}
                  onClick={() => openRole(item.role, item.screen)}
                >
                  <strong>{item.role}</strong>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>

            <div style={styles.actions}>
              <button onClick={() => go("guided")}>{t.tour}</button>
              <button onClick={() => go("events")}>Events & Orientation</button>
              <button onClick={() => go("media")}>Media Center</button>
              <button onClick={() => go("mission")}>Mission Control</button>
              <button onClick={() => go("feedback")}>{t.feedback}</button>
              <button onClick={() => go("problem")}>{t.problem}</button>
            </div>

            <h3>{t.tagline}</h3>
          </div>
        </section>
      )}

      {screen === "guided" && (
        <Page title="Guided Tour" image={images.farm}>
          <Step
            title="1. Forest Gate"
            text="Visitors enter through the story of the land, the farm, the family legacy, and historic Lansdowne Airport."
          />
          <Step
            title="2. Connected Ecosystem"
            text="The platform connects guests, customers, youth, supervisors, growers, value-added producers, partners, and the marketplace."
          />
          <Step
            title="3. Choose a Role"
            text="Every visitor follows a purposeful journey with a clear beginning, pathway, marketplace connection, feedback, and return home."
          />
          <Step
            title="4. Launch Feedback"
            text="This beta launch collects user confusion points, pathway issues, registration problems, translation gaps, and media documentation needs."
          />
          <PathButtons go={go} />
        </Page>
      )}

      {screen === "events" && (
        <Page title="Events & Orientation" image={images.farm}>
          <Step
            title="Staff & Supervisor Orientation"
            text="Friday, June 5, 2026 at 9:30 AM. This orientation prepares staff, supervisors, aides, and volunteers for youth safety, attendance, wellness monitoring, incident reporting, parent communication, daily assessments, emergency procedures, site rules, and platform use."
          />

          <Step
            title="Youth Workforce Program Launch"
            text="Monday, June 8, 2026 at 8:00 AM. Youth begin the Bronson Family Farm Cultivators experience with check-in, wellness awareness, safety review, team assignments, career pathway introduction, daily activity logging, and reflection."
          />

          <div style={styles.grid}>
            <button style={styles.roleButton} onClick={() => go("june8")}>
              <strong>June 8 Youth Activity Record</strong>
              <span>
                Open the first-day youth activity, attendance, wellness, release,
                and media log.
              </span>
            </button>

            <button style={styles.roleButton} onClick={() => go("media")}>
              <strong>Media Center</strong>
              <span>
                Open orientation videos, youth highlights, farm progress videos,
                and documentation.
              </span>
            </button>
          </div>

          <PathButtons go={go} />
        </Page>
      )}

      {screen === "june8" && (
        <Page title="June 8, 2026 Youth Activity Record" image={images.youth}>
          <Step
            title="Program Start"
            text="Youth Workforce Program begins Monday, June 8, 2026 at 8:00 AM at Bronson Family Farm, historic Lansdowne Airport."
          />

          <Step
            title="Required First-Day Records"
            text="Attendance, wellness check-in, PPE readiness, safety review, team assignment, emergency contact confirmation, parent/guardian connection, photo/video release status, first activity log, and end-of-day reflection."
          />

          <div style={styles.grid}>
            {[
              "Attendance Recorded",
              "Wellness Check-In Completed",
              "PPE Status Confirmed",
              "Safety Orientation Completed",
              "Team Assignment Recorded",
              "Career Pathway Introduced",
              "Parent/Guardian Contact Verified",
              "Photo/Video Release Verified",
              "Daily Activity Logged",
              "Youth Reflection Submitted",
            ].map((item) => (
              <button
                key={item}
                style={styles.roleButton}
                onClick={() => fakeSave(item)}
              >
                <strong>{item}</strong>
                <span>Tap to mark this launch-day item for review.</span>
              </button>
            ))}
          </div>

          <PathButtons go={go} marketplace />
        </Page>
      )}

      {screen === "media" && (
        <Page title="Media Center" image={images.farm}>
          <Step
            title="Purpose"
            text="The Media Center documents the Bronson Family Farm story, staff orientation, youth workforce activities, farm progress, testimonials, drone footage, workshops, and community impact."
          />

          <div style={styles.grid}>
            {[
              "Staff Orientation Video — June 5, 2026",
              "Youth Launch Video — June 8, 2026",
              "Daily Youth Highlights",
              "Supervisor Training Videos",
              "Farm Progress Videos",
              "Guest Tour Videos",
              "Drone Footage",
              "Youth Testimonials",
              "Partner Testimonials",
            ].map((item) => (
              <div key={item} style={styles.metric}>
                <strong>{item}</strong>
                <span>Video upload / archive placeholder</span>
              </div>
            ))}
          </div>

          <PathButtons go={go} />
        </Page>
      )}

      {screen === "guest" && (
        <Page title="Guest Journey" image={images.guest}>
          <Step
            title="Farm Story"
            text="Learn why Bronson Family Farm exists and how it connects food, family, land, workforce, and community."
          />
          <Step
            title="Historic Lansdowne Airport"
            text="Explore the significance of building a regenerative farm and agritourism destination on this historic Youngstown site."
          />
          <Step title="Regenerative Agriculture" text={t.regenerative} />
          <PathButtons go={go} marketplace />
        </Page>
      )}

      {screen === "customer" && (
        <Page title="Customer Journey" image={images.marketplace}>
          <Step
            title="Fresh Food"
            text="Customers can learn about produce, nutrition, healthy meals, and local food access."
          />
          <Step
            title="Food Access"
            text="Bronson Family Farm supports community-based access to fresh, locally grown food."
          />
          <PathButtons go={go} marketplace />
        </Page>
      )}

      {screen === "marketplace" && (
        <Page title="Marketplace" image={images.marketplace}>
          <Step
            title="Bronson Family Farm Marketplace"
            text="Products can be demonstrated here and sold through the connected GrownBy marketplace."
          />

          <div style={styles.cardRow}>
            {["Collards", "Tomatoes", "Peppers", "Cucumbers", "Squash", "Herbs"].map(
              (p) => (
                <div style={styles.smallCard} key={p}>
                  {p}
                </div>
              )
            )}
          </div>

          <a
            href={grownByUrl}
            target="_blank"
            rel="noreferrer"
            style={styles.linkButton}
          >
            {t.grownby}
          </a>

          <PathButtons go={go} />
        </Page>
      )}

      {screen === "grower" && (
        <Page title="Grower Journey" image={images.grower}>
          <Step
            title="Grower Resources"
            text="Training, soil health, crop planning, regenerative practices, and market participation."
          />
          <Step
            title="Food Moves, Not the Farmer"
            text="Growers can connect to marketplace, schools, businesses, distribution partners, and community food access."
          />
          <PathButtons go={go} marketplace />
        </Page>
      )}

      {screen === "youth" && (
        <Page title="Youth Workforce Journey" image={images.youth}>
          <Step
            title="Daily Check-In"
            text="Youth begin with attendance, wellness awareness, safety readiness, and assignment clarity."
          />
          <Step
            title="Career Pathways"
            text="Agriculture, culinary, forestry, drones, RC engineering, construction, tourism, marketing, entrepreneurship, environmental science, and public safety."
          />
          <Step
            title="Reflection"
            text="Youth end the day with reflection, skill growth, support needs, and next-step awareness."
          />

          <div style={styles.actions}>
            <button onClick={() => fakeSave("Youth check-in")}>
              Save Check-In
            </button>
            <button onClick={() => fakeSave("Youth reflection")}>
              Save Reflection
            </button>
            <button onClick={() => go("june8")}>June 8 Activity Record</button>
            <button onClick={() => go("media")}>Youth Media</button>
          </div>

          <PathButtons go={go} marketplace />
        </Page>
      )}

      {screen === "supervisor" && (
        <Page title="Supervisor Dashboard" image={images.partner}>
          <div style={styles.grid}>
            {[
              "Attendance",
              "Youth Profiles",
              "Assessments",
              "Wellness Alerts",
              "Incident Reports",
              "Daily Reports",
              "Team Assignments",
              "Parent Contacts",
              "Photo/Video Release Verification",
              "June 8 Youth Activity Record",
            ].map((x) => (
              <button
                key={x}
                style={styles.roleButton}
                onClick={() =>
                  x === "June 8 Youth Activity Record"
                    ? go("june8")
                    : fakeSave(`${x} review`)
                }
              >
                <strong>{x}</strong>
                <span>Supervisor-only launch tool.</span>
              </button>
            ))}
          </div>

          <PathButtons go={go} />
        </Page>
      )}

      {screen === "partner" && (
        <Page title="Partner Journey" image={images.partner}>
          <Step
            title="Mission Alignment"
            text="Partners can support food access, youth workforce, regenerative farming, education, agritourism, and community development."
          />
          <Step
            title="Collaboration"
            text="Organizations can sponsor, volunteer, invest, provide materials, teach workshops, or connect resources."
          />
          <PathButtons go={go} />
        </Page>
      )}

      {screen === "valueAdded" && (
        <Page title="Value-Added Producer Journey" image={images.marketplace}>
          <Step
            title="Processing & Packaging"
            text="Producers can explore how crops become packaged, branded, shelf-ready, and marketplace-connected products."
          />
          <Step
            title="Distribution"
            text="The ecosystem helps connect value-added goods to customers, events, and future market channels."
          />
          <PathButtons go={go} marketplace />
        </Page>
      )}

      {screen === "register" && (
        <FormPage
          title={`${selectedRole} Registration`}
          onSave={() => fakeSave(`${selectedRole} registration`)}
        >
          <input placeholder="Name" />
          <input placeholder="Email or phone" />
          <input placeholder="Organization / family / role" />
          <textarea placeholder="Tell us how you want to participate." />
        </FormPage>
      )}

      {screen === "feedback" && (
        <FormPage title={t.feedback} onSave={() => fakeSave("Feedback")}>
          <select>
            {roleMap.map((r) => (
              <option key={r.role}>{r.role}</option>
            ))}
          </select>
          <textarea placeholder="Where did you get confused?" />
          <textarea placeholder="What was most valuable?" />
          <textarea placeholder="What should be improved?" />
        </FormPage>
      )}

      {screen === "problem" && (
        <FormPage title={t.problem} onSave={() => fakeSave("Problem report")}>
          <select>
            <option>Broken Button</option>
            <option>Wrong Page</option>
            <option>Translation Issue</option>
            <option>Registration Issue</option>
            <option>Missing Image</option>
            <option>Media Upload Issue</option>
            <option>Other</option>
          </select>
          <textarea placeholder="Describe the problem." />
        </FormPage>
      )}

      {screen === "mission" && (
        <Page title="Bronson Family Farm Mission Control" image={images.farm}>
          <div style={styles.grid}>
            {[
              ["System Status", "ONLINE"],
              ["Launch Phase", "Community Beta"],
              ["Active Pathways", "8 of 8"],
              ["Registration", "Ready"],
              ["Feedback", "Ready"],
              ["Problem Reports", "Ready"],
              ["Staff Orientation", "June 5, 2026 - 9:30 AM"],
              ["Youth Workforce Launch", "June 8, 2026 - 8:00 AM"],
              ["June 8 Activity Record", "Ready"],
              ["Photo/Video Release Tracking", "Ready"],
              ["Media Center", "Ready"],
              ["Daily Youth Logs", "Ready"],
              ["Daily Reflections", "Ready"],
              ["Wellness Check-In", "Ready"],
              ["Attendance Tracking", "Ready"],
              ["Supervisor Assessments", "Ready"],
              ["Parent Contact Tracking", "Ready"],
              ["Youth Safety Records", "Ready"],
              ["Incident Reporting", "Ready"],
              ["Guest Pathway", "Ready"],
              ["Customer Pathway", "Ready"],
              ["Marketplace Pathway", "Ready"],
              ["Grower Pathway", "Ready"],
              ["Youth Pathway", "Needs Live Testing"],
              ["Supervisor Pathway", "Needs Live Testing"],
              ["Partner Pathway", "Ready"],
              ["Value-Added Pathway", "Ready"],
              ["Translation Coverage", "Audit In Progress"],
              ["Launch Decision", "Awaiting Final Validation"],
            ].map(([a, b]) => (
              <div style={styles.metric} key={a}>
                <strong>{a}</strong>
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div style={styles.readinessBox}>
            <h2>🚀 Launch-Day Readiness Status</h2>

            <div style={styles.grid}>
              {[
                ["Staff Orientation", "🟢 Scheduled"],
                ["Youth Launch", "🟢 Scheduled"],
                ["Registration System", "🟢 Ready"],
                ["Mission Control", "🟢 Active"],
                ["Media Documentation", "🟢 Ready"],
                ["Youth Operations", "🟢 Ready"],
                ["Supervisor Operations", "🟡 Validate Mapping"],
                ["Translations", "🟡 Continue Audit"],
              ].map(([a, b]) => (
                <div style={styles.metric} key={a}>
                  <strong>{a}</strong>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.launchBanner}>
            <h2>🌲 Bronson Family Farm Launch Command Center</h2>
            <p>Community Beta Launch Phase</p>
            <p>Staff Orientation: June 5, 2026 — 9:30 AM</p>
            <p>Youth Workforce Launch: June 8, 2026 — 8:00 AM</p>
            <h3>We Grow Green to Harvest Dreams.</h3>
          </div>
        </Page>
      )}

      {saved && <div style={styles.toast}>{saved}</div>}
    </main>
  );
}

function Page({
  title,
  image,
  children,
}: {
  title: string;
  image: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.page}>
      <div
        style={{
          ...styles.banner,
          backgroundImage: `linear-gradient(rgba(13,39,25,.25), rgba(13,39,25,.65)), url(${image})`,
        }}
      >
        <h1>{title}</h1>
      </div>

      <div style={styles.content}>{children}</div>
    </section>
  );
}

function Step({ title, text }: { title: string; text: string }) {
  return (
    <div style={styles.step}>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function PathButtons({
  go,
  marketplace = false,
}: {
  go: (s: Screen) => void;
  marketplace?: boolean;
}) {
  return (
    <div style={styles.actions}>
      {marketplace && <button onClick={() => go("marketplace")}>Marketplace</button>}
      <button onClick={() => go("register")}>Register</button>
      <button onClick={() => go("feedback")}>Share Feedback</button>
      <button onClick={() => go("problem")}>Report a Problem</button>
      <button onClick={() => go("home")}>Home</button>
    </div>
  );
}

function FormPage({
  title,
  children,
  onSave,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
}) {
  return (
    <section style={styles.page}>
      <div style={styles.content}>
        <h1>{title}</h1>
        <div style={styles.form}>{children}</div>
        <button onClick={onSave}>Submit</button>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    fontFamily: "Georgia, 'Times New Roman', serif",
    background: "#f6f1e7",
    color: "#17351f",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 18px",
    background: "#14351f",
    color: "white",
  },
  select: {
    padding: 8,
    borderRadius: 8,
  },
  nav: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    padding: 10,
    background: "#e6dcc8",
  },
  hero: {
    minHeight: "calc(100vh - 56px)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heroCard: {
    maxWidth: 1080,
    background: "rgba(255,248,232,.94)",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,.25)",
  },
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "#d8b45b",
    color: "#18351f",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 16,
  },
  roleButton: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    textAlign: "left",
    padding: 16,
    borderRadius: 16,
    border: "1px solid #cbbf9f",
    background: "#fffaf0",
    color: "#18351f",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 20,
  },
  page: {
    minHeight: "100vh",
  },
  banner: {
    minHeight: 230,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    display: "flex",
    alignItems: "end",
    padding: 28,
  },
  content: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: 24,
  },
  step: {
    background: "#fffaf0",
    border: "1px solid #d8c8a3",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
    margin: "16px 0",
  },
  smallCard: {
    padding: 18,
    background: "#fffaf0",
    borderRadius: 14,
    border: "1px solid #d8c8a3",
    fontWeight: 700,
  },
  linkButton: {
    display: "inline-block",
    marginTop: 10,
    padding: "12px 18px",
    borderRadius: 12,
    background: "#14351f",
    color: "white",
    textDecoration: "none",
  },
  form: {
    display: "grid",
    gap: 12,
    margin: "16px 0",
  },
  metric: {
    background: "#fffaf0",
    padding: 18,
    borderRadius: 16,
    border: "1px solid #d8c8a3",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  readinessBox: {
    marginTop: 30,
    background: "#fffaf0",
    borderRadius: 18,
    padding: 24,
    border: "1px solid #d8c8a3",
  },
  launchBanner: {
    marginTop: 30,
    background: "#14351f",
    color: "white",
    padding: 24,
    borderRadius: 18,
    textAlign: "center",
  },
  toast: {
    position: "fixed",
    right: 20,
    bottom: 20,
    background: "#14351f",
    color: "white",
    padding: "12px 16px",
    borderRadius: 14,
    boxShadow: "0 8px 30px rgba(0,0,0,.25)",
  },
};
