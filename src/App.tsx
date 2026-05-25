import React, { useMemo, useState } from "react";

type Screen = "home" | "roles" | "marketplace" | "partners" | "events" | "nutrition";
type Language = "English" | "Español" | "Tagalog" | "Italiano" | "Patwa" | "Hebrew";

const IMG = {
  hero: "/images/large (18).jpg",
  heroAlt: "/images/large (2).jpg",
  youth1: "/images/large (16).jpg",
  youth2: "/images/large (15).jpg",
  youth3: "/images/large (12).jpg",
  market1: "/images/large (11).jpg",
  ecosystem: "/images/ConnectFoodEcosystem_withimages.png",
  culinaryFlowers: "/images/culniary_edibleflowers.jpeg",
  culinaryFlowers2: "/images/culniary_edibleflowers2.jpeg",
  culinaryMushrooms: "/images/culniary_mushrooms.jpeg",
  growArea: "/images/GrowArea2.jpg",
  growAreaAlt: "/images/Grow Area.png",
  partners: "/images/Partners.png",
  compost: "/images/Compost_ElliottGarden.png",
  compost2: "/images/Compost_Elliott.png",
  fencing: "/images/Deer Fencing.png",
  volunteers: "/images/Fence_volunteers.png",
  queens: "/images/Queens Village.png",
  seeds: "/images/Seeds_Jubilee Gardens.png",
  csu: "/images/CSU_MParker.png",
  wkbn: "/images/WKBN Interview.png",
  sameera2: "/images/Samaeera2.jpg",
  sameera3: "/images/Sameera3.jpg",
  sameera4: "/images/Samerra4.jpg",
  sameera5: "/images/Samerra5.jpg",
};

const languages: Language[] = ["English", "Español", "Tagalog", "Italiano", "Patwa", "Hebrew"];

const pathways = {
  youth: {
    image: IMG.youth1,
    title: "Youth Workforce Journey",
    subtitle: "Youth participate in a real food ecosystem.",
    need: "Young people need meaningful work, structure, safety, belonging, and visible proof that their effort matters.",
    benefit: "The farm turns summer work into skill evidence, responsibility, confidence, teamwork, reflection, and leadership.",
    destination: "Youth complete the program with experience they can carry into work, school, entrepreneurship, agriculture, and service.",
    steps: [
      ["Orientation", "Youth begin with PPE, expectations, safety, schedule, purpose, and belonging."],
      ["Daily Work", "Youth cultivate, move materials, prepare growing areas, support events, organize inventory, and work as teams."],
      ["Supervisor Tracking", "Supervisors document participation, safety, communication, initiative, and growth from mobile phones."],
      ["Reflection", "Youth connect farm work to food access, family wellness, leadership, and their future."],
    ],
  },
  growers: {
    image: IMG.growArea,
    title: "Grower Pathway",
    subtitle: "Tools, knowledge, and market access for growers.",
    need: "Growers need practical support, supplies, demonstrations, soil knowledge, confidence, and visible market pathways.",
    benefit: "The ecosystem increases local production capacity and helps gardeners, farmers, and producers participate together.",
    destination: "Growers can grow at home, sell, teach, mentor youth, demonstrate, or become formal ecosystem partners.",
    steps: [
      ["Assess", "Identify land, containers, soil, water, tools, crop goals, and experience level."],
      ["Learn", "Use demonstrations to understand compost, irrigation, fencing, pest prevention, planting, and harvest."],
      ["Produce", "Move from interest into growing through seedlings, supplies, and hands-on support."],
      ["Participate", "Bring food, skill, mentoring, or products back into the marketplace and events."],
    ],
  },
  marketplace: {
    image: IMG.market1,
    title: "Marketplace Movement",
    subtitle: "Food, seedlings, supplies, and community purchasing connect here.",
    need: "Customers and growers need a simple way to find food, supplies, education, QR ordering, preorders, and pickup.",
    benefit: "The marketplace creates revenue, repeat engagement, food access, grower visibility, and youth workforce learning.",
    destination: "Visitors shop, preorder, return, become growers, support youth, or join the regional food ecosystem.",
    steps: [
      ["Discover", "Visitors see seedlings, produce, Bubble Babies™, supplies, demonstrations, and food access pathways."],
      ["Order", "QR codes and online store links move interest into purchases and follow-up."],
      ["Pickup", "Inventory, pickup windows, and event activity connect digital demand to real farm operations."],
      ["Return", "Customers come back because the ecosystem feels useful, welcoming, and community-rooted."],
    ],
  },
  partners: {
    image: IMG.partners,
    title: "Partner Pathway",
    subtitle: "Partnership strengthens the whole ecosystem.",
    need: "Partners need clear, credible lanes to support food access, youth workforce, infrastructure, wellness, and education.",
    benefit: "Partnership turns goodwill into equipment, training, funding, health education, events, and measurable outcomes.",
    destination: "Partners choose a support lane and help build infrastructure for long-term community transformation.",
    steps: [
      ["Align", "Understand how food, workforce, land, wellness, and marketplace activity connect."],
      ["Choose", "Select a lane: equipment, funding, youth support, demonstrations, wellness, infrastructure, or volunteers."],
      ["Activate", "Move support into operations, events, youth training, marketplace, or site development."],
      ["Measure", "Show participation, learning, access, and visible community benefit."],
    ],
  },
  nutrition: {
    image: IMG.culinaryFlowers,
    title: "Nutrition & Culinary Wellness",
    subtitle: "Fresh food becomes practical, beautiful, local, and connected to family health.",
    need: "Families need practical access to fresh food, edible beauty, culinary learning, growing knowledge, and wellness education they can use.",
    benefit: "Nutrition becomes tied to local agriculture, family meals, diabetes prevention, energy, creativity, and healthier choices.",
    destination: "Families grow, prepare, share, purchase, and return with others.",
    steps: [
      ["Access", "Families encounter produce, herbs, greens, mushrooms, edible flowers, seedlings, and seasonal food opportunities."],
      ["Learn", "Food connects to wellness, blood pressure, diabetes, family meals, beauty, culture, and long-term health."],
      ["Prepare", "Cooking, preservation, edible flower education, mushrooms, and value-added learning make produce usable at home."],
      ["Share", "Healthier food habits move through households and community networks."],
    ],
  },
  events: {
    image: IMG.queens,
    title: "Events & Community Experience",
    subtitle: "Events let people feel the ecosystem before they join it.",
    need: "The community needs welcoming entry points where people can experience the farm before deciding how to participate.",
    benefit: "Events create trust, registrations, sales, volunteer interest, partner alignment, and repeat engagement.",
    destination: "Visitors register, attend, volunteer, vend, sponsor, shop, join a pathway, or invite others.",
    steps: [
      ["Invite", "Flyers, QR codes, Eventbrite, partners, and word of mouth open the gate."],
      ["Check In", "QR check-in identifies attendance, roles, interests, and follow-up needs."],
      ["Experience", "Visitors encounter demonstrations, food, youth workforce, growers, wellness, music, and marketplace activity."],
      ["Follow Up", "Participants choose next steps: shop, volunteer, partner, grow, sponsor, or return."],
    ],
  },
};

function PillButton({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
        active
          ? "border-emerald-200/40 bg-emerald-300/20 text-white shadow-[0_0_30px_rgba(110,231,183,.18)]"
          : "border-white/15 bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] border border-white/10 bg-black/35 shadow-2xl backdrop-blur-xl ${className}`}>{children}</div>;
}

function PhotoCard({ title, subtitle, image, height = "280px" }: { title: string; subtitle?: string; image: string; height?: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-xl" style={{ height }}>
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="text-3xl font-black leading-tight">{title}</div>
        {subtitle && <div className="mt-2 text-sm leading-6 text-emerald-50/85">{subtitle}</div>}
      </div>
    </div>
  );
}

function Navigation({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <PillButton active={screen === "home"} onClick={() => setScreen("home")}>Entrance</PillButton>
      <PillButton active={screen === "roles"} onClick={() => setScreen("roles")}>Role Pathways</PillButton>
      <PillButton active={screen === "marketplace"} onClick={() => setScreen("marketplace")}>Marketplace</PillButton>
      <PillButton active={screen === "partners"} onClick={() => setScreen("partners")}>Partners</PillButton>
      <PillButton active={screen === "events"} onClick={() => setScreen("events")}>Events</PillButton>
      <PillButton active={screen === "nutrition"} onClick={() => setScreen("nutrition")}>Nutrition</PillButton>
    </div>
  );
}

function Shell({ children, screen, setScreen, background = IMG.hero }: { children: React.ReactNode; screen: Screen; setScreen: (screen: Screen) => void; background?: string }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img src={background} alt="Bronson Family Farm background" className="h-full w-full object-cover opacity-55" />
      </div>
      <div className="fixed inset-0 bg-gradient-to-br from-black/68 via-emerald-950/34 to-black/72" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,.10),transparent_24%),radial-gradient(circle_at_82%_8%,rgba(255,232,170,.10),transparent_26%),radial-gradient(circle_at_48%_95%,rgba(16,185,129,.14),transparent_34%)]" />
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-8 md:px-10">
        <Navigation screen={screen} setScreen={setScreen} />
        {children}
      </div>
    </div>
  );
}

function Home({ setScreen, language, setLanguage }: { setScreen: (screen: Screen) => void; language: Language; setLanguage: (language: Language) => void }) {
  const overviewItems = useMemo(
    () => [
      ["Family legacy", "The farm carries Bronson and Lorenzana legacy into a future-focused Youngstown vision."],
      ["Land restoration", "The project restores land while creating food, education, youth workforce, and agritourism opportunity."],
      ["Community future", "This is an ecosystem for long-term return, shared learning, and regional growth."],
    ],
    []
  );

  return (
    <Shell screen="home" setScreen={setScreen} background={IMG.hero}>
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/25 shadow-2xl backdrop-blur-xl">
          <div className="relative min-h-[650px]">
            <img src={IMG.hero} alt="Bronson Family Farm" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/42 to-black/5" />
            <div className="relative z-10 flex min-h-[650px] flex-col justify-end p-8 md:p-10">
              <div className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">Connected Food Ecosystem Experience</div>
              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
                Step Into The Farm. Experience The Wonders Of Life.
              </h1>
              <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/90">
                A living ecosystem connecting youth workforce development, growers, marketplace systems, schools, wellness, agritourism, food access, leadership, and community revitalization.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => setScreen("roles")} className="rounded-full bg-emerald-300 px-6 py-3 font-bold text-black">Begin Guided Tour</button>
                <button onClick={() => setScreen("roles")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold">Enter Ecosystem</button>
                <button onClick={() => setScreen("marketplace")} className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold">Marketplace</button>
              </div>
            </div>
          </div>

          <div className="grid border-t border-white/10 md:grid-cols-3">
            <PhotoCard title="Grower Ecosystem" subtitle="Production, training, and local food access" image={IMG.growArea} height="260px" />
            <PhotoCard title="Marketplace Movement" subtitle="Food moving toward families and destinations" image={IMG.market1} height="260px" />
            <PhotoCard title="Youth Workforce" subtitle="Leadership through participation" image={IMG.youth1} height="260px" />
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-7">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Living Ecosystem Overview</div>
            <h2 className="mt-5 text-4xl font-black leading-tight">A place people want to return to.</h2>
            <p className="mt-6 text-lg leading-9 text-emerald-50/85">
              Bronson Family Farm connects workforce, agriculture, schools, wellness, marketplace systems, growers, leadership, and community participation into one immersive ecosystem.
            </p>
            <div className="mt-8 space-y-4">
              {["Youth Workforce Development", "Marketplace & Distribution", "Schools & Community Food Access", "Grower Ecosystem", "Nutrition & Culinary Wellness", "Family Legacy & Land Restoration"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-xl font-semibold">{item}</div>
              ))}
            </div>
            <div className="mt-8">
              <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Language</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} className={`rounded-full px-4 py-2 text-sm transition ${language === lang ? "bg-white text-black" : "border border-white/10 bg-white/10 text-white"}`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["50 Youth Active", "Summer workforce active"],
              ["Marketplace Preparing", "Distribution and inventory"],
              ["Seeds Donated", "Jubilee Gardens support"],
              ["Partners Engaged", "Community support active"],
            ].map(([title, subtitle]) => (
              <Card key={title} className="p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/65">Live Ecosystem</div>
                <div className="mt-3 text-2xl font-bold">{title}</div>
                <div className="mt-2 text-sm text-emerald-50/70">{subtitle}</div>
              </Card>
            ))}
          </div>

          <PhotoCard title="Seeds, compost, partners, and people make the ecosystem real." subtitle="The work is operational, visible, and community-rooted." image={IMG.seeds} height="330px" />
        </div>
      </section>
    </Shell>
  );
}

function JourneyPanel({ data }: { data: typeof pathways.youth }) {
  return (
    <Card className="p-7">
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Pathway Journey</div>
      <h2 className="mt-4 text-4xl font-black leading-tight">{data.title}</h2>
      <p className="mt-5 text-lg leading-9 text-emerald-50/85">{data.benefit}</p>
      <div className="mt-7 grid gap-4">
        {data.steps.map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <h3 className="text-2xl font-black">{title}</h3>
            <p className="mt-3 text-base leading-7 text-emerald-50/78">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-7 rounded-2xl bg-emerald-300 p-5 text-black">
        <div className="text-xs uppercase tracking-[0.25em] font-black">Final Decision</div>
        <p className="mt-3 text-xl font-black leading-tight">{data.destination}</p>
      </div>
    </Card>
  );
}

function Roles({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const roleCards = [pathways.youth, pathways.growers, pathways.marketplace];

  return (
    <Shell screen="roles" setScreen={setScreen} background={IMG.youth2}>
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Ecosystem Role Pathways</div>
      <h1 className="mt-5 max-w-5xl text-5xl font-black leading-tight md:text-6xl">Every pathway moves from arrival to participation to transformation.</h1>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {roleCards.map((role) => (
          <Card key={role.title} className="overflow-hidden">
            <PhotoCard title={role.title} subtitle={role.subtitle} image={role.image} height="340px" />
            <div className="p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Need</div>
              <p className="mt-3 text-base leading-7 text-emerald-50/85">{role.need}</p>
              <div className="mt-5 text-xs uppercase tracking-[0.25em] text-emerald-100/70">Destination</div>
              <p className="mt-3 text-base leading-7 text-emerald-50/85">{role.destination}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <JourneyPanel data={pathways.youth} />
        <Card className="p-7">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Supervisor Mobile Command Center</div>
          <h2 className="mt-4 text-4xl font-black">Operational youth workforce activity</h2>
          <div className="mt-8 grid gap-4">
            {[
              ["PPE Verified", "Safety and readiness checks"],
              ["Attendance Tracked", "Daily participation record"],
              ["Skill Observation", "Responsibility, communication, teamwork"],
              ["Reflection Submitted", "Youth connect work to future goals"],
              ["Parent Connection", "Progress can be shared with families"],
            ].map(([title, subtitle]) => (
              <Card key={title} className="p-5">
                <div className="text-2xl font-bold">{title}</div>
                <div className="mt-2 text-sm text-emerald-50/70">{subtitle}</div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function Marketplace({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="marketplace" setScreen={setScreen} background={IMG.market1}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <PhotoCard title="Marketplace & Distribution" subtitle="Food moves from field production into customers, schools, and community destinations." image={IMG.market1} height="620px" />
        <JourneyPanel data={pathways.marketplace} />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <PhotoCard title="Connected Ecosystem" subtitle="Marketplace movement ties growers, youth, customers, and partners together." image={IMG.ecosystem} />
        <PhotoCard title="Seed Support" subtitle="Jubilee Gardens seed donations help make community growing possible." image={IMG.seeds} />
        <PhotoCard title="Media Visibility" subtitle="Storytelling helps the community understand and join the food movement." image={IMG.wkbn} />
      </div>
    </Shell>
  );
}

function Partners({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="partners" setScreen={setScreen} background={IMG.partners}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <PhotoCard title="Partners & Community Support" subtitle="Partnership strengthens the ecosystem." image={IMG.partners} height="620px" />
        <JourneyPanel data={pathways.partners} />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <PhotoCard title="Central State Representation" subtitle="Training, agriculture, and technical knowledge strengthen the model." image={IMG.csu} />
        <PhotoCard title="Fence Support" subtitle="Infrastructure makes food production possible." image={IMG.fencing} />
        <PhotoCard title="Volunteer Power" subtitle="Community effort turns plans into visible progress." image={IMG.volunteers} />
      </div>
    </Shell>
  );
}

function Events({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="events" setScreen={setScreen} background={IMG.queens}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <PhotoCard title="Events & Experiences" subtitle="People feel the ecosystem before they join it." image={IMG.queens} height="620px" />
        <JourneyPanel data={pathways.events} />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <PhotoCard title="Community Welcome" subtitle="Events create trust, participation, and follow-up." image={IMG.sameera3} />
        <PhotoCard title="Farm Activity" subtitle="Visitors see work, learning, and land in motion." image={IMG.sameera4} />
        <PhotoCard title="Shared Experience" subtitle="People return when the farm feels alive and welcoming." image={IMG.sameera5} />
      </div>
    </Shell>
  );
}

function Nutrition({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="nutrition" setScreen={setScreen} background={IMG.culinaryFlowers}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <PhotoCard title="Nutrition & Culinary Wellness" subtitle="Fresh food, edible flowers, mushrooms, soil, health, and family decisions connect here." image={IMG.culinaryFlowers} height="620px" />
        <JourneyPanel data={pathways.nutrition} />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <PhotoCard title="Edible Flowers" subtitle="Beauty, food, and education come together." image={IMG.culinaryFlowers2} />
        <PhotoCard title="Mushrooms" subtitle="Culinary learning expands the farm’s food story." image={IMG.culinaryMushrooms} />
        <PhotoCard title="Soil Health" subtitle="Healthy soil supports healthy food." image={IMG.compost} />
      </div>
    </Shell>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [language, setLanguage] = useState<Language>("English");

  if (screen === "home") return <Home setScreen={setScreen} language={language} setLanguage={setLanguage} />;
  if (screen === "roles") return <Roles setScreen={setScreen} />;
  if (screen === "marketplace") return <Marketplace setScreen={setScreen} />;
  if (screen === "partners") return <Partners setScreen={setScreen} />;
  if (screen === "events") return <Events setScreen={setScreen} />;
  if (screen === "nutrition") return <Nutrition setScreen={setScreen} />;

  return null;
}
