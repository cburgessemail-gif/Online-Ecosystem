import React, { useEffect, useMemo, useState } from "react";

type Screen =
  | "entrance"
  | "youth"
  | "marketplace"
  | "growers"
  | "partners"
  | "nutrition"
  | "events";

type Language =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "Patwa"
  | "Hebrew";

const IMG = {
  entrance: "/images/SAM_0427.JPG",
  entrance2: "/images/large (25).jpg",
  ecosystem: "/images/ConnectFoodEcosystem_withimages.png",

  youth: "/images/SAM_0412.JPG",
  youth2: "/images/SAM_0401.JPG",

  marketplace: "/images/SAM_0407.JPG",
  marketplace2: "/images/SAM_0405.JPG",

  growers: "/images/SAM_0415.JPG",
  growers2: "/images/SAM_0393.JPG",

  nutrition: "/images/culniary_edibleflowers.jpeg",

  events: "/images/WKBN Interview.png",

  partners: "/images/Partners.png",

  field: "/images/Grow Area.png",
  sunrise: "/images/GrowArea2.jpg",
};

const languages: Language[] = [
  "English",
  "Español",
  "Tagalog",
  "Italiano",
  "Patwa",
  "Hebrew",
];

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function AmbientBackground({
  images,
}: {
  images: string[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 9000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {images.map((img, i) => (
        <img
          key={img}
          src={img}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[4000ms] scale-105",
            index === i ? "opacity-100" : "opacity-0"
          )}
        />
      ))}

      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950/40 to-black" />

      <div className="absolute inset-0 backdrop-blur-[1px]" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-emerald-400 blur-[140px]" />
        <div className="absolute right-[8%] top-[55%] h-96 w-96 rounded-full bg-emerald-600 blur-[160px]" />
      </div>
    </div>
  );
}

function NavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-5 py-3 text-sm tracking-wide transition-all duration-500",
        active
          ? "border-emerald-300/50 bg-emerald-400/20 text-white shadow-lg shadow-emerald-500/20"
          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
      )}
    >
      {label}
    </button>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-5xl">
      <div className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
        {eyebrow}
      </div>

      <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
        {title}
      </h1>

      {text ? (
        <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/85">
          {text}
        </p>
      ) : null}
    </div>
  );
}

function CinematicPanel({
  image,
  title,
  text,
  height = "700px",
}: {
  image: string;
  title: string;
  text: string;
  height?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl"
      style={{ height }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/5" />

      <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12">
        <div className="max-w-4xl">
          <h2 className="text-4xl font-black md:text-6xl">
            {title}
          </h2>

          <p className="mt-6 text-lg leading-9 text-emerald-50/85 md:text-xl">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] =
    useState<Screen>("entrance");

  const [language, setLanguage] =
    useState<Language>("English");

  const backgroundImages = useMemo(() => {
    switch (screen) {
      case "youth":
        return [IMG.youth, IMG.youth2];

      case "marketplace":
        return [IMG.marketplace, IMG.marketplace2];

      case "growers":
        return [IMG.growers, IMG.growers2];

      default:
        return [IMG.entrance, IMG.entrance2];
    }
  }, [screen]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <AmbientBackground images={backgroundImages} />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
              Bronson Family Farm
            </div>

            <div className="mt-2 text-2xl font-black md:text-3xl">
              Connected Ecosystem Experience
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <NavButton
              label="Entrance"
              active={screen === "entrance"}
              onClick={() => setScreen("entrance")}
            />

            <NavButton
              label="Youth Workforce"
              active={screen === "youth"}
              onClick={() => setScreen("youth")}
            />

            <NavButton
              label="Marketplace"
              active={screen === "marketplace"}
              onClick={() => setScreen("marketplace")}
            />

            <NavButton
              label="Growers"
              active={screen === "growers"}
              onClick={() => setScreen("growers")}
            />

            <NavButton
              label="Partners"
              active={screen === "partners"}
              onClick={() => setScreen("partners")}
            />

            <NavButton
              label="Nutrition"
              active={screen === "nutrition"}
              onClick={() => setScreen("nutrition")}
            />

            <NavButton
              label="Events"
              active={screen === "events"}
              onClick={() => setScreen("events")}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "rounded-full px-4 py-2 text-xs transition-all",
                language === lang
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/80"
              )}
            >
              {lang}
            </button>
          ))}
        </div>

        {screen === "entrance" && (
          <div className="mt-10 space-y-20">
            <SectionTitle
              eyebrow="Living Ecosystem"
              title="Step Into The Ecosystem."
              text="Bronson Family Farm is not a presentation. It is a living environment connecting youth workforce development, growers, food movement, schools, wellness, leadership, marketplace systems, and community transformation."
            />

            <CinematicPanel
              image={IMG.entrance}
              title="A Living Food Ecosystem"
              text="The ecosystem connects workforce, agriculture, health, distribution, family engagement, grower participation, education, and community revitalization into one immersive experience."
            />

            <div className="grid gap-8 lg:grid-cols-3">
              <CinematicPanel
                image={IMG.youth}
                title="Youth Workforce"
                text="Youth move through real responsibilities, teamwork, leadership, and ecosystem participation."
                height="500px"
              />

              <CinematicPanel
                image={IMG.marketplace}
                title="Marketplace"
                text="Food moves from the field toward schools, families, wellness initiatives, and community destinations."
                height="500px"
              />

              <CinematicPanel
                image={IMG.growers}
                title="Grower Ecosystem"
                text="Growers connect to tools, infrastructure, education, and marketplace participation."
                height="500px"
              />
            </div>
          </div>
        )}

        {screen === "youth" && (
          <div className="mt-10 space-y-20">
            <SectionTitle
              eyebrow="Youth Workforce Journey"
              title="Youth Enter The Ecosystem."
              text="The youth workforce pathway is not simply employment. It is participation in a living ecosystem built around responsibility, leadership, agriculture, teamwork, wellness, and future readiness."
            />

            <CinematicPanel
              image={IMG.youth}
              title="Arrival & Orientation"
              text="Youth enter the environment through check-in, team formation, safety preparation, ecosystem expectations, and participation structure."
            />

            <CinematicPanel
              image={IMG.youth2}
              title="Field Participation"
              text="Youth cultivate, organize, harvest, prepare, move inventory, support the marketplace, and contribute to community food systems."
            />

            <CinematicPanel
              image={IMG.marketplace}
              title="Food Movement & Community Impact"
              text="The work produced through the ecosystem supports marketplaces, schools, families, and community wellness initiatives."
            />
          </div>
        )}

        {screen === "marketplace" && (
          <div className="mt-10 space-y-20">
            <SectionTitle
              eyebrow="Marketplace Movement"
              title="Food In Motion."
              text="The marketplace is the movement center of the ecosystem where production, distribution, wellness, and community connection meet."
            />

            <CinematicPanel
              image={IMG.marketplace}
              title="Marketplace Activation"
              text="Produce, value-added products, grower participation, and food distribution move together through one connected environment."
            />

            <CinematicPanel
              image={IMG.marketplace2}
              title="Distribution & Community Access"
              text="The ecosystem supports schools, families, wellness initiatives, and food accessibility through coordinated marketplace systems."
            />
          </div>
        )}

        {screen === "growers" && (
          <div className="mt-10 space-y-20">
            <SectionTitle
              eyebrow="Grower Ecosystem"
              title="Growers Build The Ecosystem."
              text="The ecosystem supports growers through education, participation, infrastructure, collaboration, marketplace access, and food movement."
            />

            <CinematicPanel
              image={IMG.growers}
              title="Production & Participation"
              text="Growers participate in collaborative production, ecosystem support, and local food movement."
            />

            <CinematicPanel
              image={IMG.growers2}
              title="Food System Infrastructure"
              text="The ecosystem creates pathways for local growers to participate in a larger connected food environment."
            />
          </div>
        )}

        {screen === "partners" && (
          <div className="mt-10 space-y-20">
            <SectionTitle
              eyebrow="Partnership"
              title="Partnership Expands The Ecosystem."
              text="Partnerships strengthen infrastructure, workforce development, wellness, education, and long-term community impact."
            />

            <CinematicPanel
              image={IMG.partners}
              title="Community Collaboration"
              text="Organizations, growers, educators, and supporters strengthen the ecosystem together."
            />
          </div>
        )}

        {screen === "nutrition" && (
          <div className="mt-10 space-y-20">
            <SectionTitle
              eyebrow="Nutrition & Wellness"
              title="Food Supports Wellness."
              text="Nutrition, wellness, education, and fresh food access are integrated directly into the ecosystem experience."
            />

            <CinematicPanel
              image={IMG.nutrition}
              title="Nutrition Pathway"
              text="Fresh food, culinary exploration, edible education, and wellness participation move together through the ecosystem."
            />
          </div>
        )}

        {screen === "events" && (
          <div className="mt-10 space-y-20">
            <SectionTitle
              eyebrow="Events & Storytelling"
              title="The Ecosystem Is Experienced Publicly."
              text="Events create participation, visibility, storytelling, marketplace activation, and community engagement."
            />

            <CinematicPanel
              image={IMG.events}
              title="Community Activation"
              text="The ecosystem becomes visible through events, demonstrations, education, media engagement, and marketplace participation."
            />
          </div>
        )}
      </div>
    </div>
  );
}
