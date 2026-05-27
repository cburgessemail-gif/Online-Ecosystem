import React, { useMemo, useState } from "react";

// =========================================================
// BRONSON FAMILY FARM — FULL ECOSYSTEM MASTER SCRIPT
// PRESERVES CINEMATIC STRUCTURE / EXTENDS OPERATIONAL DEPTH
// =========================================================

const IMG = {
  hero: "/images/large (18).jpg",
  ecosystem: "/images/ConnectFoodEcosystem_withimages.png",
  growArea: "/images/GrowArea2.jpg",
  marketplace: "/images/large (11).jpg",
  youth: "/images/large (16).jpg",
  flowers: "/images/culniary_edibleflowers.jpeg",
  mushrooms: "/images/culniary_mushrooms.jpeg",
  partners: "/images/Partners.png",
  seeds: "/images/Seeds_Jubilee Gardens.png",
  compost: "/images/Compost_ElliottGarden.png",
  fencing: "/images/Deer Fencing.png",
  queens: "/images/Queens Village.png",
};

type Screen =
  | "portal"
  | "home"
  | "roles"
  | "youth"
  | "supervisor"
  | "parent"
  | "grower"
  | "crop"
  | "marketplace"
  | "weather"
  | "encouragement"
  | "reports"
  | "partners";

const dailyProverbs = [
  "A seed becomes a harvest when people protect the conditions around it.",
  "Leadership grows through responsibility.",
  "A living ecosystem returns value to the community.",
  "Progress happens one action at a time.",
];

const positiveMessages = [
  "Your work matters to this community.",
  "Every small action creates long-term growth.",
  "Healthy communities begin with connected systems.",
  "Today is another opportunity to build something meaningful.",
];

function Shell({
  children,
  background,
}: {
  children: React.ReactNode;
  background: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img
          src={background}
          className="h-full w-full object-cover"
          alt="Bronson Family Farm"
        />
      </div>

      <div className="fixed inset-0 bg-black/55" />

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.08),transparent_30%),radial-gradient(circle_at_bottom,rgba(16,185,129,.12),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-6">
        {children}
      </div>
    </div>
  );
}

function NavButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/20"
    >
      {label}
    </button>
  );
}

function Card({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,.55)] min-h-[320px]">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <h2 className="text-3xl font-black">{title}</h2>
        <p className="mt-3 text-emerald-50/85 leading-7">{subtitle}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("portal");

  const proverb = useMemo(() => {
    return dailyProverbs[new Date().getDate() % dailyProverbs.length];
  }, []);

  const positive = useMemo(() => {
    return positiveMessages[new Date().getDate() % positiveMessages.length];
  }, []);

  // =========================================================
  // PORTAL GATEWAY
  // =========================================================

  if (screen === "portal") {
    return (
      <Shell background={IMG.hero}>
        <div className="grid min-h-[90vh] items-center lg:grid-cols-2 gap-10">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/80">
              Bronson Family Farm Ecosystem
            </div>

            <h1 className="mt-6 text-6xl font-black leading-[0.9]">
              Enter The Ecosystem
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-10 text-emerald-50/90">
              Every participant enters first as a guest and chooses how they want to experience the ecosystem.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => setScreen("home")}
                className="rounded-full bg-emerald-300 px-8 py-4 font-black text-black"
              >
                Continue As Guest
              </button>

              <button className="rounded-full border border-white/10 bg-white/10 px-8 py-4 font-semibold backdrop-blur-xl">
                Create Account
              </button>

              <button className="rounded-full border border-white/10 bg-white/10 px-8 py-4 font-semibold backdrop-blur-xl">
                Login
              </button>
            </div>
          </div>

          <Card
            title="Connected Food Ecosystem"
            subtitle="Youth workforce, crop planning, marketplace systems, education, growers, wellness, and community participation connected inside one immersive operational ecosystem."
            image={IMG.ecosystem}
          />
        </div>
      </Shell>
    );
  }

  // =========================================================
  // ATMOSPHERIC DIFFERENTIATION ENGINE
  // Each pathway must feel like a different place
  // on the same living ecosystem.
  // =========================================================

  const atmosphere = {
    home: {
      background: IMG.hero,
      overlay: "bg-black/50",
      mood: "arrival",
    },
    youth: {
      background: IMG.youth,
      overlay: "bg-orange-950/40",
      mood: "energy",
    },
    grower: {
      background: IMG.growArea,
      overlay: "bg-emerald-950/40",
      mood: "field",
    },
    marketplace: {
      background: IMG.marketplace,
      overlay: "bg-amber-950/40",
      mood: "circulation",
    },
    parent: {
      background: IMG.queens,
      overlay: "bg-slate-950/40",
      mood: "support",
    },
    supervisor: {
      background: IMG.fencing,
      overlay: "bg-zinc-950/45",
      mood: "coordination",
    },
    operations: {
      background: IMG.ecosystem,
      overlay: "bg-cyan-950/40",
      mood: "control-room",
    },
    encouragement: {
      background: IMG.seeds,
      overlay: "bg-stone-950/35",
      mood: "reflection",
    },
  };

  // =========================================================
  // HOME EXPERIENCE
  // =========================================================

  return (
    <Shell background={IMG.hero}>
      <div className="flex flex-wrap gap-3 pb-6">
        <NavButton label="Home" onClick={() => setScreen("home")} />
        <NavButton label="Roles" onClick={() => setScreen("roles")} />
        <NavButton label="Youth" onClick={() => setScreen("youth")} />
        <NavButton label="Supervisor" onClick={() => setScreen("supervisor")} />
        <NavButton label="Parent" onClick={() => setScreen("parent")} />
        <NavButton label="Grower" onClick={() => setScreen("grower")} />
        <NavButton label="Crop Planning" onClick={() => setScreen("crop")} />
        <NavButton label="Marketplace" onClick={() => setScreen("marketplace")} />
        <NavButton label="Weather" onClick={() => setScreen("weather")} />
        <NavButton label="Encouragement" onClick={() => setScreen("encouragement")} />
        <NavButton label="Reports" onClick={() => setScreen("reports")} />
        <NavButton label="Partners" onClick={() => setScreen("partners")} />
      </div>

      {screen === "home" && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card
            title="Step Into The Farm"
            subtitle="A living operational ecosystem connecting youth workforce, agriculture, wellness, crop planning, marketplace systems, education, and community revitalization."
            image={IMG.hero}
          />

          <div className="space-y-6">
            <Card
              title="Daily Proverb"
              subtitle={proverb}
              image={IMG.seeds}
            />

            <Card
              title="Positive Message"
              subtitle={positive}
              image={IMG.compost}
            />
          </div>
        </div>
      )}

      {screen === "roles" && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card title="Youth Workforce" subtitle="Leadership through participation." image={IMG.youth} />
          <Card title="Growers" subtitle="Production and food access systems." image={IMG.growArea} />
          <Card title="Marketplace" subtitle="Harvest connected to community." image={IMG.marketplace} />
          <Card title="Parents" subtitle="Connected family visibility." image={IMG.queens} />
          <Card title="Supervisors" subtitle="Operational workforce management." image={IMG.fencing} />
          <Card title="Partners" subtitle="Community ecosystem support." image={IMG.partners} />
        </div>
      )}

      {screen === "youth" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="absolute top-8 right-8 rounded-full border border-orange-300/30 bg-orange-300/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-orange-100 backdrop-blur-xl">
              ACTIVE YOUTH TEAMS
            </div>

            <Card
            title="Youth Workforce Pathway"
            subtitle="Daily assignments, assessments, PPE, reflections, badge progression, leadership development, and workforce growth."
            image={IMG.youth}
          />

          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 backdrop-blur-xl">
            <h2 className="text-4xl font-black">Daily Operations</h2>

            <div className="mt-8 space-y-4 text-lg text-emerald-50/90">
              <div>• QR Attendance Check-In</div>
              <div>• PPE Verification</div>
              <div>• Daily Assignments</div>
              <div>• Crop Zone Participation</div>
              <div>• Reflection Submission</div>
              <div>• Supervisor Scoring</div>
              <div>• Badge Progression</div>
            </div>
          </div>
        </div>
      )}

      {screen === "supervisor" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            title="Supervisor Mobile System"
            subtitle="Attendance, PPE tracking, youth scoring, incidents, assignments, and encouragement."
            image={IMG.fencing}
          />

          <div className="grid grid-cols-2 gap-4">
            {[
              "PRESENT",
              "ABSENT",
              "PPE COMPLETE",
              "TASK COMPLETE",
              "INCIDENT",
              "DAILY SCORE",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center font-black backdrop-blur-xl"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === "parent" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="absolute top-8 right-8 rounded-full border border-sky-300/30 bg-sky-300/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-sky-100 backdrop-blur-xl">
              FAMILY SUPPORT CONNECTED
            </div>

            <Card
            title="Parent / Guardian Portal"
            subtitle="Connected visibility into attendance, progress, encouragement, reflections, badges, and notifications."
            image={IMG.queens}
          />

          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 backdrop-blur-xl">
            <h2 className="text-3xl font-black">Connected Ecosystem Flow</h2>

            <div className="mt-8 space-y-4 text-lg leading-8 text-emerald-50/90">
              <div>Youth completes assignment →</div>
              <div>Supervisor scores participation →</div>
              <div>System updates daily progress →</div>
              <div>Parent visibility updates →</div>
              <div>Badge progression generated →</div>
              <div>Encouragement sent</div>
            </div>
          </div>
        </div>
      )}

      {screen === "grower" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="absolute top-8 right-8 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-emerald-100 backdrop-blur-xl">
              FIELD CONDITIONS ACTIVE
            </div>

            <Card
            title="Grower Ecosystem"
            subtitle="Production planning, irrigation, composting, harvest forecasting, and grow zone management."
            image={IMG.growArea}
          />

          <Card
            title="Value Added Agriculture"
            subtitle="Edible flowers, mushrooms, culinary education, preservation, nutrition, and wellness."
            image={IMG.flowers}
          />
        </div>
      )}

      {screen === "crop" && (
        <div className="space-y-6">
          <Card
            title="Crop Planning System"
            subtitle="Visual crop planning connected to youth assignments, weather, irrigation, inventory, and marketplace forecasting."
            image={IMG.growArea}
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Seed Date",
              "Transplant Date",
              "Irrigation Schedule",
              "Harvest Forecast",
              "Pest Monitoring",
              "Yield Projection",
              "Marketplace Connection",
              "Succession Planning",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
              >
                <div className="text-xl font-black">{item}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === "marketplace" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="absolute top-8 right-8 rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-amber-100 backdrop-blur-xl">
              COMMUNITY CIRCULATION ACTIVE
            </div>

            <Card
            title="Marketplace Movement"
            subtitle="Produce availability, SNAP visibility, harvest windows, grower participation, and inventory movement."
            image={IMG.marketplace}
          />

          <Card
            title="Harvest To Community"
            subtitle="Connecting crops, growers, workforce, nutrition, and families through marketplace systems."
            image={IMG.ecosystem}
          />
        </div>
      )}

      {screen === "weather" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            title="Youngstown Weather Layer"
            subtitle="Rainfall, temperature, frost risk, severe weather, humidity, and operational scheduling."
            image={IMG.compost}
          />

          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 backdrop-blur-xl">
            <h2 className="text-4xl font-black">Connected Systems</h2>

            <div className="mt-8 space-y-4 text-lg text-emerald-50/90">
              <div>• Crop Planning</div>
              <div>• Irrigation</div>
              <div>• Youth Safety</div>
              <div>• Harvest Timing</div>
              <div>• Outdoor Scheduling</div>
            </div>
          </div>
        </div>
      )}

      {screen === "encouragement" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Daily Proverbs" subtitle={proverb} image={IMG.seeds} />
          <Card title="Positive Messages" subtitle={positive} image={IMG.compost} />
          <Card title="Youth Reflection" subtitle="What did I learn today? Who did I help?" image={IMG.youth} />
        </div>
      )}

      {screen === "reports" && (
        <div className="space-y-6">
          <div className="absolute top-8 right-8 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100 backdrop-blur-xl">
              LIVE OPERATIONS ACTIVE
            </div>

            <Card
            title="Operational Reporting Layer"
            subtitle="Generate youth workforce, crop planning, inventory, marketplace, parent, supervisor, and community impact reports."
            image={IMG.partners}
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Youth Reports",
              "Supervisor Reports",
              "Parent Reports",
              "Crop Reports",
              "Marketplace Reports",
              "Inventory Reports",
              "Impact Reports",
              "Export Center",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
              >
                <div className="text-xl font-black">{item}</div>
                <div className="mt-3 text-sm text-emerald-50/80">
                  PDF / Excel / Operational Summaries
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === "partners" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            title="Community Ecosystem Partners"
            subtitle="Growers, educators, foundations, volunteers, sponsors, and food system collaborators."
            image={IMG.partners}
          />

          <Card
            title="Connected Community"
            subtitle="The ecosystem becomes stronger through participation, shared resources, and community stewardship."
            image={IMG.ecosystem}
          />
        </div>
      )}
    </Shell>
  );
}
