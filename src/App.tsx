// ===============================================
// BRONSON FAMILY FARM — ONLINE ECOSYSTEM
// FINAL IMMERSIVE PORTAL + ECOSYSTEM SCRIPT
// ===============================================

import { useEffect, useMemo, useState } from "react";

type TabKey =
  | "portal"
  | "guest"
  | "roles"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "crop"
  | "marketplace"
  | "operations"
  | "reports"
  | "partners";

type LangKey =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "עברית"
  | "Français";

type TourStep = {
  id: string;
  eyebrow: string;
  title: string;
  narration: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  containImage?: boolean;
};

const LANGS: LangKey[] = [
  "English",
  "Español",
  "Tagalog",
  "Italiano",
  "עברית",
  "Français",
];

const navItems: { key: TabKey; label: string }[] = [
  { key: "portal", label: "Portal" },
  { key: "guest", label: "Guest Demo" },
  { key: "roles", label: "Roles" },
  { key: "youth", label: "Youth" },
  { key: "supervisor", label: "Supervisor" },
  { key: "parent", label: "Parent" },
  { key: "grower", label: "Grower" },
  { key: "crop", label: "Crop" },
  { key: "marketplace", label: "Marketplace" },
  { key: "operations", label: "Operations" },
  { key: "reports", label: "Reports" },
  { key: "partners", label: "Partners" },
];

const tourSteps: TourStep[] = [
  {
    id: "threshold",
    eyebrow: "Step 1 · Arrival",
    title: "You Are Entering A Living Ecosystem",
    narration:
      "Welcome to Bronson Family Farm. Before you see operations, reports, or pathways, take a moment to arrive. This is not simply a website. It is a living ecosystem rooted in food, healing, youth, learning, growers, and community opportunity.",
    bullets: [
      "Forest Entrance",
      "Guided Arrival",
      "Community Purpose",
      "Living Ecosystem",
    ],
    image: "/SAM_0396.JPG",
    imageAlt: "Forest entrance",
  },

  {
    id: "purpose",
    eyebrow: "Step 2 · Why It Exists",
    title: "The Farm Connects What Communities Need",
    narration:
      "Food insecurity, youth opportunity, local growers, family stability, workforce development, and community wellness are connected. This ecosystem was designed to help those parts work together instead of separately.",
    bullets: [
      "Food Access",
      "Youth Workforce",
      "Grower Support",
      "Community Healing",
    ],
    image: "/ConnectFoodEcosystem_withimages.png",
    imageAlt: "Connected ecosystem",
    containImage: true,
  },

  {
    id: "pathways",
    eyebrow: "Step 3 · Pathways",
    title: "Every Person Enters Through A Different Doorway",
    narration:
      "Guests, youth, supervisors, parents, growers, customers, and partners each experience a different journey through the ecosystem. Every pathway connects back to the same living system.",
    bullets: [
      "Guest Journey",
      "Youth Journey",
      "Grower Journey",
      "Operations Journey",
    ],
    image: "/SAM_0405.JPG",
    imageAlt: "Youth and community",
  },

  {
    id: "operations",
    eyebrow: "Step 4 · Operations",
    title: "Now The Control Room Makes Sense",
    narration:
      "Only after understanding the people, purpose, and movement should visitors see the operational layer. This is where weather, teams, assessments, crop planning, reports, and marketplace coordination connect together.",
    bullets: [
      "Weather Awareness",
      "Assessment Tracking",
      "Marketplace Readiness",
      "Supervisor Access",
    ],
    image: "/Compost_ElliottGarden.png",
    imageAlt: "Operations",
  },
];

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 0.9;
  utterance.pitch = 1.02;
  utterance.volume = 1;

  const voices = speechSynthesis.getVoices();

  const preferred =
    voices.find((v) =>
      v.name.toLowerCase().includes("google")
    ) || voices[0];

  if (preferred) utterance.voice = preferred;

  speechSynthesis.speak(utterance);
}

function SmartImage({
  src,
  alt,
  contain,
}: {
  src: string;
  alt: string;
  contain?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      className={contain ? "smart-image contain" : "smart-image"}
    />
  );
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("portal");
  const [tourOpen, setTourOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [tourRunning, setTourRunning] = useState(false);
  const [language, setLanguage] =
    useState<LangKey>("English");

  const step = tourSteps[tourIndex];

  const progress = useMemo(
    () => ((tourIndex + 1) / tourSteps.length) * 100,
    [tourIndex]
  );

  useEffect(() => {
    if (!tourRunning) return;

    speak(step.narration);

    const timer = setTimeout(() => {
      setTourIndex((prev) => {
        if (prev >= tourSteps.length - 1) {
          setTourRunning(false);
          return prev;
        }

        return prev + 1;
      });
    }, 15000);

    return () => clearTimeout(timer);
  }, [tourIndex, tourRunning]);

  const startTour = () => {
    setTourOpen(true);
    setTourRunning(true);
    setTourIndex(0);
  };

  const openTab = (key: TabKey) => {
    setTab(key);
    setTourOpen(false);
    setTourRunning(false);
    speechSynthesis.cancel();
  };

  return (
    <main className="app">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
          background: #020402;
          color: white;
          font-family: Inter, Arial, sans-serif;
        }

        .app {
          min-height: 100vh;
          overflow-x: hidden;
          background: #020402;
        }

        .forest-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: #081007;
        }

        .forest-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .portal-forest img {
          filter:
            brightness(.95)
            saturate(1.25)
            contrast(1.05);
        }

        .portal-forest::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(0,0,0,.18),
              rgba(0,0,0,.38)
            );
        }

        .screen {
          position: relative;
          z-index: 1;
          width: min(1540px, calc(100vw - 36px));
          margin: 0 auto;
        }

        .portal {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .portal-card {
          width: min(760px, 100%);
          border-radius: 38px;
          padding: 56px;
          background: rgba(5,8,6,.34);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 30px 100px rgba(0,0,0,.45);
          text-align: center;
        }

        .portal-kicker {
          color: #c0e67d;
          font-size: 12px;
          letter-spacing: .42em;
          font-weight: 900;
          margin-bottom: 22px;
          text-transform: uppercase;
        }

        .portal h1 {
          margin: 0;
          font-size: clamp(56px, 7vw, 92px);
          line-height: .92;
          font-weight: 950;
          letter-spacing: -3px;
          text-shadow:
            0 4px 20px rgba(0,0,0,.65);
        }

        .portal p {
          margin: 26px auto 0;
          max-width: 640px;
          color: rgba(255,255,255,.88);
          font-size: 22px;
          line-height: 1.5;
        }

        .portal-actions {
          display: flex;
          justify-content: center;
          margin-top: 34px;
        }

        .primary-button {
          border: none;
          border-radius: 999px;
          padding: 18px 34px;
          color: white;
          font-weight: 950;
          font-size: 18px;
          background:
            linear-gradient(
              135deg,
              #8fc642,
              #5b9727
            );

          box-shadow:
            0 16px 36px rgba(91,151,39,.38);
        }

        .portal-tags {
          margin-top: 24px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .portal-tag {
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,.68);
          pointer-events: none;
        }

        .topbar {
          position: sticky;
          top: 12px;
          z-index: 30;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;

          margin-top: 18px;

          padding: 14px 18px;

          border: 1px solid rgba(255,255,255,.12);

          border-radius: 28px;

          background:
            rgba(16,22,17,.82);

          backdrop-filter: blur(22px);
        }

        .brand-kicker {
          font-size: 12px;
          letter-spacing: .32em;
          color: #bcd2a0;
          font-weight: 900;
        }

        .brand-title {
          font-size: 20px;
          font-weight: 950;
          margin-top: 4px;
        }

        .nav {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          flex: 1;
        }

        .nav button {
          border: 1px solid rgba(255,255,255,.16);

          color: white;

          border-radius: 999px;

          background:
            rgba(255,255,255,.11);

          padding: 12px 16px;

          font-size: 14px;
          font-weight: 900;
        }

        .nav button.active {
          background:
            linear-gradient(
              135deg,
              #53e28e,
              #27c875
            );

          color: #031005;
        }

        .tour-panel {
          margin-top: 24px;

          border: 1px solid rgba(255,255,255,.12);

          background:
            rgba(7,10,8,.74);

          backdrop-filter: blur(18px);

          border-radius: 34px;

          padding: 28px;
        }

        .tour-layout {
          display: grid;
          grid-template-columns: .82fr 1.18fr;
          gap: 26px;
        }

        .tour-copy h2 {
          margin: 0 0 12px;
          font-size: clamp(42px, 5vw, 74px);
          line-height: .94;
          font-weight: 950;
        }

        .eyebrow {
          color: #b7dc75;
          font-size: 12px;
          letter-spacing: .38em;
          font-weight: 950;
          text-transform: uppercase;
          margin-bottom: 15px;
        }

        .tour-copy p {
          color: rgba(255,255,255,.82);
          font-size: 21px;
          line-height: 1.55;
        }

        .tour-bullets {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 22px;
        }

        .tour-bullet {
          border: 1px solid rgba(255,255,255,.12);

          border-radius: 20px;

          background:
            rgba(255,255,255,.07);

          padding: 15px;

          font-weight: 850;
        }

        .tour-image {
          border-radius: 30px;
          overflow: hidden;
          min-height: 520px;
        }

        .smart-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .contain {
          object-fit: contain;
          background: rgba(0,0,0,.65);
          padding: 12px;
        }

        @media (max-width: 980px) {
          .tour-layout {
            grid-template-columns: 1fr;
          }

          .portal-card {
            padding: 32px;
          }

          .portal h1 {
            font-size: 58px;
          }
        }

      `}</style>

      <div className="forest-bg portal-forest">
        <img
          src="/SAM_0396.JPG"
          alt="Forest background"
          loading="eager"
        />
      </div>

      <div className="screen">

        {tab !== "portal" && (
          <header className="topbar">

            <div>
              <div className="brand-kicker">
                BRONSON FAMILY FARM
              </div>

              <div className="brand-title">
                Online Ecosystem
              </div>
            </div>

            <nav className="nav">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  className={
                    tab === item.key
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    openTab(item.key)
                  }
                >
                  {item.label}
                </button>
              ))}
            </nav>

          </header>
        )}

        {tab === "portal" && !tourOpen && (
          <section className="portal">
            <div className="portal-card">

              <div className="portal-kicker">
                Forest Gate Portal
              </div>

              <h1>
                Step Into
                <br />
                the Ecosystem
              </h1>

              <p>
                Bronson Family Farm is a living
                ecosystem where food, learning,
                healing, growers, families,
                youth, and community opportunity
                come together.
              </p>

              <div className="portal-actions">
                <button
                  className="primary-button"
                  onClick={startTour}
                >
                  Enter The Ecosystem
                </button>
              </div>

              <div className="portal-tags">
                <div className="portal-tag">
                  Food Access
                </div>

                <div className="portal-tag">
                  Youth Workforce
                </div>

                <div className="portal-tag">
                  Grower Opportunity
                </div>

                <div className="portal-tag">
                  Community Healing
                </div>
              </div>

            </div>
          </section>
        )}

        {tourOpen && (
          <section className="tour-panel">

            <div className="tour-layout">

              <div className="tour-copy">

                <div>

                  <div className="eyebrow">
                    {step.eyebrow}
                  </div>

                  <h2>
                    {step.title}
                  </h2>

                  <p>
                    {step.narration}
                  </p>

                  <div
                    style={{
                      height: 8,
                      width: "100%",
                      background:
                        "rgba(255,255,255,.14)",
                      borderRadius: 999,
                      overflow: "hidden",
                      marginTop: 20,
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg,#8fc642,#d7bb6a)",
                      }}
                    />
                  </div>

                  <div className="tour-bullets">
                    {step.bullets.map(
                      (bullet) => (
                        <div
                          className="tour-bullet"
                          key={bullet}
                        >
                          {bullet}
                        </div>
                      )
                    )}
                  </div>

                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    marginTop: 24,
                  }}
                >

                  <button
                    className="primary-button"
                    onClick={() =>
                      setTourRunning(
                        !tourRunning
                      )
                    }
                  >
                    {tourRunning
                      ? "Pause Narration"
                      : "Resume Narration"}
                  </button>

                  <button
                    className="primary-button"
                    onClick={() =>
                      openTab("guest")
                    }
                  >
                    Enter Ecosystem
                  </button>

                </div>

              </div>

              <div className="tour-image">
                <SmartImage
                  src={step.image}
                  alt={step.imageAlt}
                  contain={
                    step.containImage
                  }
                />
              </div>

            </div>

          </section>
        )}

      </div>

    </main>
  );
}
