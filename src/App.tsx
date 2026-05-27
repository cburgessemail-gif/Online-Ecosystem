// ======================================================
// BRONSON FAMILY FARM — FINAL ONLINE ECOSYSTEM
// IMMERSIVE GUIDED EXPERIENCE
// ======================================================

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
    id: "arrival",
    eyebrow: "STEP 1 · ARRIVAL",
    title: "Welcome To Bronson Family Farm",
    narration:
      "Welcome to Bronson Family Farm. Take your time. Look around carefully. You are entering a living ecosystem rooted in food, healing, youth, growers, and community opportunity.",
    bullets: [
      "Forest Entrance",
      "Living Ecosystem",
      "Guided Experience",
      "Community Vision",
    ],
    image: "/images/SAM_0396.JPG",
    imageAlt: "Forest entrance into Bronson Family Farm",
  },

  {
    id: "airport",
    eyebrow: "STEP 2 · HISTORIC LAND",
    title: "The Historic Lansdowne Airport",
    narration:
      "Long before this became a living food ecosystem, this land served aviation, movement, and regional connection through the historic Lansdowne Airport. Today, the property continues its story in a different way — connecting people through food, learning, healing, and community restoration.",
    bullets: [
      "Historic Airport",
      "Regional Connection",
      "Transformation",
      "Living Land",
    ],
    image: "/images/GrowArea2.jpg",
    imageAlt: "Historic Lansdowne Airport property",
  },

  {
    id: "military",
    eyebrow: "STEP 3 · SERVICE & LEGACY",
    title: "Service, Discipline, And Future Generations",
    narration:
      "This land also carries the spirit of service, leadership, and legacy. Parts of the Bronson family history include military service and public leadership. Today, that spirit continues through youth workforce development, stewardship, responsibility, and rebuilding community connection.",
    bullets: [
      "Military Legacy",
      "Youth Leadership",
      "Responsibility",
      "Future Generations",
    ],
    image: "/images/Fence_volunteers.png",
    imageAlt: "Community and workforce activity",
  },

  {
    id: "ecosystem",
    eyebrow: "STEP 4 · THE ECOSYSTEM",
    title: "Everything Connects Together",
    narration:
      "Food access, growers, youth workforce development, families, marketplace circulation, education, health, and operations all connect together through one place-based ecosystem.",
    bullets: [
      "Food Access",
      "Youth Workforce",
      "Grower Opportunity",
      "Community Healing",
    ],
    image: "/images/ConnectFoodEcosystem_withimages.png",
    imageAlt: "Connected Bronson Family Farm ecosystem",
    containImage: true,
  },

  {
    id: "pathways",
    eyebrow: "STEP 5 · PATHWAYS",
    title: "Every Person Has A Journey",
    narration:
      "Guests, youth, parents, supervisors, growers, customers, and partners each experience a different journey through the ecosystem. Every pathway connects back to the larger mission.",
    bullets: [
      "Guest Journey",
      "Youth Journey",
      "Grower Journey",
      "Operations Journey",
    ],
    image: "/images/SAM_0405.JPG",
    imageAlt: "Youth and community participants",
  },

  {
    id: "operations",
    eyebrow: "STEP 6 · OPERATIONS",
    title: "The Living Control Room",
    narration:
      "As your guided tour reaches the living control room, you begin to see how the ecosystem stays coordinated day by day. Weather, crop planning, youth safety, marketplace readiness, assessments, supervisors, and reports all connect together in one operational system.",
    bullets: [
      "Weather Awareness",
      "Youth Safety",
      "Marketplace Readiness",
      "Assessment Tracking",
    ],
    image: "/images/ConnectFoodEcosystem_withimages.png",
    imageAlt: "Operations overview",
    containImage: true,
  },
];

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 0.82;
  utterance.pitch = 1.0;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  const preferred =
    voices.find((voice) =>
      voice.name.toLowerCase().includes("google")
    ) || voices[0];

  if (preferred) {
    utterance.voice = preferred;
  }

  window.speechSynthesis.speak(utterance);
}

function SmartImage({
  src,
  alt,
  contain = false,
}: {
  src: string;
  alt: string;
  contain?: boolean;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() =>
        setCurrentSrc("/images/GrowArea2.jpg")
      }
      className={
        contain
          ? "smart-image contain"
          : "smart-image"
      }
    />
  );
}

export default function App() {
  const [tab, setTab] =
    useState<TabKey>("portal");

  const [tourOpen, setTourOpen] =
    useState(false);

  const [tourIndex, setTourIndex] =
    useState(0);

  const [tourRunning, setTourRunning] =
    useState(false);

  const step = tourSteps[tourIndex];

  const progress = useMemo(
    () =>
      ((tourIndex + 1) /
        tourSteps.length) *
      100,
    [tourIndex]
  );

  useEffect(() => {
    if (!tourRunning) return;

    speak(step.narration);

    const timer = window.setTimeout(() => {
      setTourIndex((prev) => {
        if (
          prev >=
          tourSteps.length - 1
        ) {
          setTourRunning(false);
          return prev;
        }

        return prev + 1;
      });
    }, 26000);

    return () => clearTimeout(timer);
  }, [tourIndex, tourRunning]);

  const startTour = () => {
    setTourOpen(true);
    setTourIndex(0);
    setTourRunning(false);

    speak(
      "Welcome to Bronson Family Farm. Take your time. Let the vision open slowly."
    );

    window.setTimeout(() => {
      setTourRunning(true);
    }, 9000);
  };

  const openTab = (key: TabKey) => {
    setTab(key);
    setTourOpen(false);
    setTourRunning(false);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
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
          background: #040704;
          color: white;
          font-family: Inter, Arial, sans-serif;
        }

        .app {
          min-height: 100vh;
          overflow-x: hidden;
        }

        .forest-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: #071006;
        }

        .forest-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter:
            brightness(.95)
            saturate(1.25)
            contrast(1.05);
        }

        .forest-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              180deg,
              rgba(0,0,0,.18),
              rgba(0,0,0,.42)
            );
        }

        .screen {
          position: relative;
          z-index: 1;
          width: min(
            1540px,
            calc(100vw - 36px)
          );
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

          background:
            rgba(5,8,6,.34);

          backdrop-filter: blur(8px);

          border:
            1px solid rgba(255,255,255,.12);

          box-shadow:
            0 30px 100px rgba(0,0,0,.45);

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

          font-size:
            clamp(56px, 7vw, 92px);

          line-height: .92;

          font-weight: 950;

          letter-spacing: -3px;
        }

        .portal p {
          margin: 26px auto 0;

          max-width: 640px;

          color:
            rgba(255,255,255,.88);

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

          cursor: pointer;
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

          background:
            rgba(255,255,255,.05);

          border:
            1px solid rgba(255,255,255,.08);

          font-size: 13px;

          font-weight: 700;

          color:
            rgba(255,255,255,.68);

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

          border:
            1px solid rgba(255,255,255,.12);

          border-radius: 28px;

          background:
            rgba(16,22,17,.82);

          backdrop-filter: blur(22px);
        }

        .tour-panel {
          margin-top: 24px;

          border:
            1px solid rgba(255,255,255,.12);

          background:
            rgba(7,10,8,.74);

          backdrop-filter: blur(18px);

          border-radius: 34px;

          padding: 28px;
        }

        .tour-layout {
          display: grid;

          grid-template-columns:
            .82fr 1.18fr;

          gap: 26px;
        }

        .eyebrow {
          color: #b7dc75;

          font-size: 12px;

          letter-spacing: .38em;

          font-weight: 950;

          text-transform: uppercase;

          margin-bottom: 15px;
        }

        .tour-copy h2 {
          margin: 0 0 12px;

          font-size:
            clamp(42px, 5vw, 74px);

          line-height: .94;

          font-weight: 950;
        }

        .tour-copy p {
          color:
            rgba(255,255,255,.82);

          font-size: 21px;

          line-height: 1.55;
        }

        .tour-bullets {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 12px;

          margin-top: 22px;
        }

        .tour-bullet {
          border:
            1px solid rgba(255,255,255,.12);

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

          background:
            rgba(0,0,0,.34);
        }

        .smart-image {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;
        }

        .contain {
          object-fit: contain;

          background:
            rgba(0,0,0,.65);

          padding: 12px;
        }

      `}</style>

      <div className="forest-bg">
        <img
          src="/images/SAM_0396.JPG"
          alt="Forest Background"
          className="forest-bg-image"
        />

        <div className="forest-overlay" />
      </div>

      <div className="screen">

        {tab !== "portal" && (
          <header className="topbar">

            <div>
              <div className="portal-kicker">
                BRONSON FAMILY FARM
              </div>

              <div
                style={{
                  fontWeight: 950,
                  fontSize: 20,
                }}
              >
                Online Ecosystem
              </div>
            </div>

          </header>
        )}

        {tab === "portal" &&
          !tourOpen && (
            <section className="portal">

              <div className="portal-card">

                <div className="portal-kicker">
                  FOREST GATE PORTAL
                </div>

                <h1>
                  Step Into
                  <br />
                  the Ecosystem
                </h1>

                <p>
                  Bronson Family Farm
                  is a living ecosystem
                  where food, learning,
                  healing, growers,
                  families, youth,
                  and community
                  opportunity come
                  together.
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
                          key={bullet}
                          className="tour-bullet"
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
