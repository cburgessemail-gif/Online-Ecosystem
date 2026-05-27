import React, { useState } from "react";

type Screen =
  | "portal"
  | "home"
  | "pathways"
  | "guest"
  | "youth"
  | "supervisor"
  | "parent"
  | "assessment"
  | "grower"
  | "crop"
  | "marketplace"
  | "operations"
  | "encouragement"
  | "reports"
  | "partners";

const IMG = {
  portal: "/images/GrowArea2.jpg",
  portalAlt: "/images/large (18).jpg",
  hero: "/images/large (18).jpg",
  heroAlt: "/images/large (2).jpg",
  youth1: "/images/large (16).jpg",
  youth2: "/images/large (15).jpg",
  youth3: "/images/large (12).jpg",
  marketplaceHero: "/images/large (11).jpg",
  ecosystem: "/images/ConnectFoodEcosystem_withimages.png",
  culinaryFlowers: "/images/culniary_edibleflowers.jpeg",
  culinaryMushrooms: "/images/culniary_mushrooms.jpeg",
  growArea: "/images/GrowArea2.jpg",
  growAreaAlt: "/images/Grow Area.png",
  partners: "/images/Partners.png",
  compost: "/images/Compost_ElliottGarden.png",
  fencing: "/images/Deer Fencing.png",
  volunteers: "/images/Fence_volunteers.png",
  queens: "/images/Queens Village.png",
  seeds: "/images/Seeds_Jubilee Gardens.png",
};

const dailyProverbs = [
  "A seed becomes a harvest when people protect the conditions around it.",
  "Work teaches when the land, the adult, and the youth are all present.",
  "Measure progress daily, but grow people patiently.",
  "Food access begins with hands, soil, tools, water, and trust.",
  "A living ecosystem does not end at harvest; it returns to the community.",
];

const positiveMessages = [
  "Your work matters because someone in this community needs what you are helping build.",
  "Progress happens one responsible action at a time.",
  "Leadership grows when a young person is trusted with meaningful work.",
  "Today’s effort becomes tomorrow’s harvest.",
  "You are part of something bigger than one task.",
];

const atmosphere: Record<Screen, { background: string; overlay: string; label: string; feeling: string }> = {
  portal: { background: IMG.portalAlt, overlay: "bg-black/64", label: "Arrival Gate", feeling: "arriving at the farm" },
  home: { background: IMG.hero, overlay: "bg-black/50", label: "Home Arrival", feeling: "standing at the entrance" },
  pathways: { background: IMG.heroAlt, overlay: "bg-black/50", label: "Living Crossroads", feeling: "choosing a direction" },
  guest: { background: IMG.portal, overlay: "bg-black/42", label: "Guest Wonder", feeling: "invitation and discovery" },
  youth: { background: IMG.youth1, overlay: "bg-orange-950/45", label: "Youth Momentum", feeling: "energy, teamwork, urgency" },
  supervisor: { background: IMG.fencing, overlay: "bg-zinc-950/50", label: "Supervisor Field Station", feeling: "guidance and coordination" },
  parent: { background: IMG.queens, overlay: "bg-slate-950/48", label: "Family Support", feeling: "reassurance and progress" },
  assessment: { background: IMG.volunteers, overlay: "bg-indigo-950/48", label: "Assessment Engine", feeling: "measuring growth without labels" },
  grower: { background: IMG.growArea, overlay: "bg-emerald-950/45", label: "Grower Field", feeling: "standing in the field" },
  crop: { background: IMG.growAreaAlt, overlay: "bg-lime-950/45", label: "Crop Planning", feeling: "planning the season" },
  marketplace: { background: IMG.marketplaceHero, overlay: "bg-amber-950/45", label: "Marketplace Circulation", feeling: "food moving through community" },
  operations: { background: IMG.ecosystem, overlay: "bg-cyan-950/55", label: "Operations Control Room", feeling: "the farm operating today" },
  encouragement: { background: IMG.seeds, overlay: "bg-stone-950/42", label: "Encouragement Room", feeling: "reflection and restoration" },
  reports: { background: IMG.partners, overlay: "bg-black/54", label: "Reporting Center", feeling: "turning activity into evidence" },
  partners: { background: IMG.partners, overlay: "bg-emerald-950/42", label: "Partner Ecosystem", feeling: "shared stewardship" },
};

const cropPlans = [
  { crop: "Tomatoes", zone: "Grow Zone B", stage: "Approaching harvest", assignment: "Check moisture, support vines, prepare harvest bins", market: "Forecast for marketplace availability" },
  { crop: "Collards", zone: "Raised Bed 3", stage: "Leaf expansion", assignment: "Water, inspect pests, record leaf growth", market: "SNAP-eligible produce planning" },
  { crop: "Herbs", zone: "Culinary Bed", stage: "Succession planting", assignment: "Thin starts, label varieties, prep culinary education", market: "Bundle planning for marketplace" },
  { crop: "Pollinator Flowers", zone: "Forest Edge", stage: "Bloom support", assignment: "Remove debris, protect pollinator pathway", market: "Value-added education connection" },
];

const assessmentItems = ["Attendance", "PPE", "Participation", "Task Completion", "Teamwork", "Communication", "Leadership", "Initiative", "Reflection", "Support Flag"];
const reports = ["Youth Workforce Report", "Attendance Export", "Assessment Summary", "Parent Progress Summary", "Crop Planning Report", "Harvest Forecast", "Marketplace Movement", "Volunteer Hours", "Community Impact", "Grant / Funder Report", "PDF Export", "Excel Export"];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Shell({ screen, setScreen, children }: { screen: Screen; setScreen: (screen: Screen) => void; children: React.ReactNode }) {
  const mood = atmosphere[screen];
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0">
        <img src={mood.background} alt="Bronson Family Farm" className="h-full w-full object-cover scale-[1.02]" />
      </div>
      <div className={cx("fixed inset-0", mood.overlay)} />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,220,120,.08),transparent_24%),radial-gradient(circle_at_bottom,rgba(16,185,129,.12),transparent_32%)]" />
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-8 md:px-10">
        {screen !== "portal" && <Navigation screen={screen} setScreen={setScreen} />}
        {screen !== "portal" && <StatusRibbon screen={screen} />}
        {children}
      </div>
    </div>
  );
}

function Navigation({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  const items: Array<{ label: string; screen: Screen }> = [
    { label: "Portal", screen: "portal" }, { label: "Home", screen: "home" }, { label: "Pathways", screen: "pathways" }, { label: "Guest", screen: "guest" },
    { label: "Youth", screen: "youth" }, { label: "Supervisor", screen: "supervisor" }, { label: "Parent", screen: "parent" }, { label: "Assessment", screen: "assessment" },
    { label: "Grower", screen: "grower" }, { label: "Crop Planning", screen: "crop" }, { label: "Marketplace", screen: "marketplace" }, { label: "Operations", screen: "operations" },
    { label: "Reports", screen: "reports" }, { label: "Partners", screen: "partners" },
  ];
  return (
    <div className="mb-6 rounded-[2rem] border border-white/10 bg-black/35 p-4 shadow-[0_20px_70px_rgba(0,0,0,.35)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-4 min-w-[220px]"><div className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">Bronson Family Farm</div><div className="text-xl font-black">Online Ecosystem</div></div>
        {items.map((item) => <button key={item.screen} onClick={() => setScreen(item.screen)} className={cx("rounded-full px-5 py-3 text-sm font-black transition", screen === item.screen ? "bg-emerald-300 text-black" : "border border-white/10 bg-white/10 text-white hover:bg-white/20")}>{item.label}</button>)}
      </div>
    </div>
  );
}

function StatusRibbon({ screen }: { screen: Screen }) {
  const mood = atmosphere[screen];
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatusCard eyebrow={mood.label} title={mood.feeling} detail="Atmosphere active" />
      <StatusCard eyebrow="Weather" title="62° / mostly cloudy" detail="Temps drop tomorrow" />
      <StatusCard eyebrow="Today" title="4 youth teams active" detail="7 grow zones moving" />
      <StatusCard eyebrow="Harvest" title="Tomatoes approaching" detail="Marketplace forecast open" />
    </div>
  );
}

function StatusCard({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) {
  return <div className="rounded-2xl border border-white/15 bg-black/45 p-4 shadow-[0_18px_50px_rgba(0,0,0,.35)] backdrop-blur-2xl"><div className="text-xs uppercase tracking-[0.25em] text-emerald-100/90 drop-shadow">{eyebrow}</div><div className="mt-3 text-lg font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.85)]">{title}</div><div className="mt-2 text-sm text-emerald-50/90 drop-shadow">{detail}</div></div>;
}

function PhotoCard({ title, subtitle, image, height = "320px", children }: { title: string; subtitle?: string; image: string; height?: string; children?: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,.55)] transition duration-700 hover:scale-[1.01]" style={{ minHeight: height }}>
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
      <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.08),transparent_45%)]" />
      <div className="relative z-10 flex min-h-full flex-col justify-end p-6"><div className="text-3xl font-black leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,.95)]">{title}</div>{subtitle && <div className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50/95">{subtitle}</div>}{children && <div className="mt-5">{children}</div>}</div>
    </div>
  );
}

function GlassPanel({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return <div className="rounded-[2rem] border border-white/10 bg-black/38 p-7 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">{eyebrow && <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">{eyebrow}</div>}<h2 className="mt-3 text-4xl font-black leading-tight">{title}</h2><div className="mt-6">{children}</div></div>;
}

function PillButton({ children, onClick, variant = "dark" }: { children: React.ReactNode; onClick?: () => void; variant?: "dark" | "light" }) {
  return <button onClick={onClick} className={cx("rounded-full px-7 py-4 font-black shadow-2xl transition hover:scale-105", variant === "light" ? "bg-emerald-300 text-black" : "border border-white/10 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20")}>{children}</button>;
}

function MetricTile({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-2xl border border-white/15 bg-black/42 p-5 shadow-[0_18px_45px_rgba(0,0,0,.28)] backdrop-blur-2xl"><div className="text-xs uppercase tracking-[0.25em] text-emerald-100/90 drop-shadow">{label}</div><div className="mt-3 text-2xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.85)]">{value}</div><div className="mt-2 text-sm leading-6 text-emerald-50/90 drop-shadow">{note}</div></div>;
}

function Portal({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="portal" setScreen={setScreen}>
      <section className="grid min-h-[86vh] items-center gap-10 lg:grid-cols-[1fr_.95fr]">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-black/70 via-black/48 to-black/10 p-8 shadow-[0_40px_110px_rgba(0,0,0,.55)] backdrop-blur-[2px] md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(16,185,129,.14),transparent_40%)]" />
          <div className="relative z-10">
            <div className="text-xs uppercase tracking-[0.45em] text-emerald-100/95 drop-shadow-[0_2px_8px_rgba(0,0,0,.85)]">Bronson Family Farm Ecosystem</div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,.95)] md:text-7xl">Enter The Ecosystem</h1>
            <p className="mt-8 max-w-3xl text-xl font-semibold leading-10 text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.9)]">Every participant enters first as a guest and chooses how they want to experience the farm.</p>
            <div className="mt-10 flex flex-wrap gap-4"><PillButton variant="light" onClick={() => setScreen("home")}>Continue As Guest</PillButton><PillButton onClick={() => setScreen("pathways")}>Create Account</PillButton><PillButton onClick={() => setScreen("pathways")}>Login</PillButton></div>
          </div>
        </div>
        <div className="rounded-[2.2rem] border border-white/15 bg-black/35 p-2 shadow-[0_40px_110px_rgba(0,0,0,.55)] backdrop-blur-xl">
          <PhotoCard title="The Farm Is Open" subtitle="Step through the entrance first. The system will explain itself after the place has invited the person in." image={IMG.portal} height="390px"><div className="grid gap-3 sm:grid-cols-3"><MetricTile label="Feel" value="Wonder" note="Guest invitation" /><MetricTile label="Place" value="Farm" note="Real images first" /><MetricTile label="Next" value="Pathways" note="Choose a role" /></div></PhotoCard>
        </div>
      </section>
    </Shell>
  );
}

function Home({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <Shell screen="home" setScreen={setScreen}>
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl"><div className="relative min-h-[690px]"><img src={IMG.hero} alt="Bronson Family Farm entrance" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" /><div className="relative z-10 flex min-h-[690px] flex-col justify-end p-8 md:p-12"><div className="text-xs uppercase tracking-[0.4em] text-emerald-100/80">Arrival</div><h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">Step Into The Farm.<br />Experience The Wonders Of Life.</h1><p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/90">A living operational ecosystem connecting youth workforce development, growers, crop planning, marketplace systems, families, supervisors, partners, and community impact.</p><div className="mt-10 flex flex-wrap gap-4"><PillButton variant="light" onClick={() => setScreen("pathways")}>Choose A Pathway</PillButton><PillButton onClick={() => setScreen("operations")}>See Today’s Operations</PillButton><PillButton onClick={() => setScreen("encouragement")}>Daily Encouragement</PillButton></div></div></div><div className="grid border-t border-white/10 md:grid-cols-3"><PhotoCard title="Youth Workforce" subtitle="Energy, urgency, learning, and teamwork." image={IMG.youth1} height="260px" /><PhotoCard title="Grower Field" subtitle="Crop planning, weather, irrigation, and stewardship." image={IMG.growArea} height="260px" /><PhotoCard title="Marketplace Circulation" subtitle="Food moving toward families and destinations." image={IMG.marketplaceHero} height="260px" /></div></div>
        <div className="space-y-6"><GlassPanel eyebrow="Living Rhythm" title="The ecosystem is operating today."><div className="space-y-4"><MetricTile label="Morning" value="Prepare" note="Weather, proverbs, assignments, PPE." /><MetricTile label="Midday" value="Move" note="Crop activity, assessments, photos, observations." /><MetricTile label="Evening" value="Reflect" note="Youth reflection, parent summaries, reports." /></div></GlassPanel><PhotoCard title="Daily Proverb" subtitle={dailyProverbs[new Date().getDate() % dailyProverbs.length]} image={IMG.seeds} height="315px" /></div>
      </section>
    </Shell>
  );
}

function Pathways({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const pathways: Array<{ title: string; subtitle: string; image: string; screen: Screen }> = [
    { title: "Guest Wonder", subtitle: "Explore first without pressure or login.", image: IMG.portal, screen: "guest" }, { title: "Youth Workforce", subtitle: "Assignments, badges, reflection, and growth.", image: IMG.youth2, screen: "youth" }, { title: "Grower Field", subtitle: "Crop planning and production movement.", image: IMG.growArea, screen: "grower" }, { title: "Parent Connection", subtitle: "Progress without labels. Support without shame.", image: IMG.queens, screen: "parent" }, { title: "Operations Room", subtitle: "The coordination center for today’s ecosystem.", image: IMG.ecosystem, screen: "operations" }, { title: "Marketplace", subtitle: "Harvest, inventory, access, and circulation.", image: IMG.marketplaceHero, screen: "marketplace" },
  ];
  return <Shell screen="pathways" setScreen={setScreen}><GlassPanel eyebrow="Living Crossroads" title="Choose how you want to move through the ecosystem."><p className="max-w-4xl text-lg leading-9 text-emerald-50/95">This is not a menu. It is the center of the farm. Each pathway feels like a different place on the same land.</p></GlassPanel><div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{pathways.map((path) => <PhotoCard key={path.title} title={path.title} subtitle={path.subtitle} image={path.image}><PillButton variant="light" onClick={() => setScreen(path.screen)}>Enter</PillButton></PhotoCard>)}</div></Shell>;
}

function Guest({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="guest" setScreen={setScreen}><section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]"><GlassPanel eyebrow="Guest Experience" title="Wonder first. Understanding second."><p className="text-lg leading-9 text-emerald-50/95">Guests experience the farm as an invitation. They can explore the story, view pathways, see today’s activity, and decide whether to participate more deeply.</p><div className="mt-8 flex flex-wrap gap-4"><PillButton variant="light" onClick={() => setScreen("pathways")}>Explore Pathways</PillButton><PillButton onClick={() => setScreen("operations")}>See Today</PillButton><PillButton onClick={() => setScreen("marketplace")}>Visit Marketplace</PillButton></div></GlassPanel><div className="grid gap-6"><PhotoCard title="Look Around" subtitle="The farm explains itself through people, land, food, work, and community." image={IMG.portal} /><div className="grid gap-4 md:grid-cols-3"><MetricTile label="No Login" value="Guest" note="Explore freely." /><MetricTile label="Invitation" value="Open" note="Choose when ready." /><MetricTile label="Next Step" value="Role" note="Participate deeper." /></div></div></section></Shell>;
}

function Youth({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="youth" setScreen={setScreen}><section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]"><PhotoCard title="Youth Workforce Pathway" subtitle="Energy, urgency, teamwork, responsibility, daily assignments, reflections, and growth." image={IMG.youth1} height="570px"><div className="grid gap-3 md:grid-cols-3"><MetricTile label="Active" value="4 Teams" note="Field assignments open" /><MetricTile label="Today" value="PPE + Tasks" note="Supervisor check active" /><MetricTile label="Progress" value="Badges" note="Growth tracked daily" /></div></PhotoCard><GlassPanel eyebrow="Today’s Youth Flow" title="Assignments are live."><div className="space-y-3">{["QR check-in and attendance", "PPE verification", "Team placement", "Crop zone assignment", "Supervisor observation", "Youth reflection", "Daily score and badge progress"].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-lg font-semibold">{item}</div>)}</div><div className="mt-6 flex flex-wrap gap-3"><PillButton variant="light" onClick={() => setScreen("assessment")}>Connect To Assessment</PillButton><PillButton onClick={() => setScreen("parent")}>Parent View</PillButton></div></GlassPanel></section></Shell>;
}

function Supervisor({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const actions = ["PRESENT", "ABSENT", "PPE COMPLETE", "TASK COMPLETE", "NEED SUPPORT", "INCIDENT", "DAILY SCORE", "PARENT SUMMARY"];
  return <Shell screen="supervisor" setScreen={setScreen}><section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]"><GlassPanel eyebrow="Supervisor Field Station" title="Mobile-first guidance and assessment."><p className="text-lg leading-9 text-emerald-50/95">Supervisors support, guide, counsel, assess, and document youth progress from the field. Internal flags remain internal. Parent summaries show appropriate progress.</p><div className="mt-8 flex flex-wrap gap-3"><PillButton variant="light" onClick={() => setScreen("assessment")}>Open Daily Score</PillButton><PillButton onClick={() => setScreen("operations")}>Operations Room</PillButton></div></GlassPanel><div className="grid gap-4 md:grid-cols-2">{actions.map((action) => <div key={action} className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center text-xl font-black backdrop-blur-xl">{action}</div>)}</div></section></Shell>;
}

function Parent({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="parent" setScreen={setScreen}><section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]"><GlassPanel eyebrow="Parent / Guardian Connection" title="This is how the parent part connects."><p className="text-lg leading-9 text-emerald-50/95">The parent portal receives the appropriate pieces from attendance, assessments, reflections, announcements, badges, and supervisor messages.</p><div className="mt-8 space-y-4">{["1. Supervisor scores the day", "2. Parent sees the appropriate summary", "3. Internal support flags stay with staff", "4. Youth progress becomes visible without labels"].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-lg font-black">{item}</div>)}</div></GlassPanel><GlassPanel eyebrow="Parent View: Youth Daily Summary" title="Progress without labels."><p className="text-sm leading-7 text-emerald-50/80">Parents see encouragement, attendance, participation, skill growth, announcements, and approved supervisor notes.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><MetricTile label="Parent Can See" value="Attendance" note="Present today" /><MetricTile label="Parent Can See" value="Safety" note="PPE complete" /><MetricTile label="Parent Can See" value="Station" note="Grow Area + Compost" /><MetricTile label="Parent Can See" value="Skill Badge" note="Field responsibility in progress" /><MetricTile label="Parent Summary" value="Supervisor Note" note="Showed patience and helped a peer reset" /><MetricTile label="Internal Supervisor View" value="Support Flag" note="Follow-up needed" /></div><div className="mt-6"><PillButton variant="light" onClick={() => setScreen("assessment")}>View Assessment Connection</PillButton></div></GlassPanel></section></Shell>;
}

function Assessment({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="assessment" setScreen={setScreen}><section className="grid gap-6 lg:grid-cols-[1fr_1fr]"><GlassPanel eyebrow="Assessment Engine" title="The daily score connects everything."><p className="text-lg leading-9 text-emerald-50/95">This room feeds badges, parent summaries, progress timelines, operations, and reports. It measures growth, responsibility, and participation without labeling the young person.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{assessmentItems.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"><div className="text-lg font-black">{item}</div><div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 w-3/4 rounded-full bg-emerald-300" /></div></div>)}</div></GlassPanel><div className="space-y-6"><PhotoCard title="Youth Reflection" subtitle="Today I learned... Today I helped... Tomorrow I will..." image={IMG.youth3} height="270px" /><PhotoCard title="Supervisor Encouragement" subtitle="A short note helps the youth see progress and next steps." image={IMG.volunteers} height="270px" /><div className="grid gap-4 md:grid-cols-2"><PillButton variant="light" onClick={() => setScreen("parent")}>Update Parent Summary</PillButton><PillButton onClick={() => setScreen("reports")}>Generate Report</PillButton></div></div></section></Shell>;
}

function Grower({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="grower" setScreen={setScreen}><section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]"><PhotoCard title="Standing In The Field" subtitle="The grower pathway feels open, grounded, environmental, patient, and connected to weather." image={IMG.growArea} height="580px"><div className="grid gap-3 md:grid-cols-3"><MetricTile label="Soil" value="Active" note="Compost inputs tracked" /><MetricTile label="Water" value="Monitor" note="Irrigation connected" /><MetricTile label="Harvest" value="Forecast" note="Marketplace timing" /></div></PhotoCard><GlassPanel eyebrow="Grower Tools" title="Crop planning drives work."><div className="space-y-4">{["Crop plans", "Grow zones", "Irrigation notes", "Pest watch", "Harvest forecast", "Marketplace availability"].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-lg font-semibold">{item}</div>)}</div><div className="mt-6"><PillButton variant="light" onClick={() => setScreen("crop")}>Open Crop Planning</PillButton></div></GlassPanel></section></Shell>;
}

function CropPlanning({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="crop" setScreen={setScreen}><section className="space-y-6"><GlassPanel eyebrow="Crop Planning System" title="Crop planning becomes the assignment engine."><p className="max-w-5xl text-lg leading-9 text-emerald-50/95">Crop planning connects weather, irrigation, youth assignments, supervisor assessments, inventory, marketplace forecasting, and reports.</p></GlassPanel><div className="grid gap-6 md:grid-cols-2">{cropPlans.map((plan) => <div key={plan.crop} className="rounded-[2rem] border border-white/10 bg-black/40 p-6 backdrop-blur-xl"><div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">{plan.zone}</div><h3 className="mt-4 text-3xl font-black">{plan.crop}</h3><div className="mt-4 text-lg font-semibold text-emerald-50">{plan.stage}</div><div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-7"><strong>Assignment:</strong> {plan.assignment}</div><div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-7"><strong>Marketplace:</strong> {plan.market}</div></div>)}</div><div className="flex flex-wrap gap-4"><PillButton variant="light" onClick={() => setScreen("youth")}>Send To Youth Assignments</PillButton><PillButton onClick={() => setScreen("marketplace")}>Send To Marketplace Forecast</PillButton><PillButton onClick={() => setScreen("reports")}>Generate Crop Report</PillButton></div></section></Shell>;
}

function Marketplace({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="marketplace" setScreen={setScreen}><section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><PhotoCard title="Marketplace Circulation" subtitle="Food moves from crop planning to harvest, inventory, marketplace, families, nutrition, and community access." image={IMG.marketplaceHero} height="560px" /><GlassPanel eyebrow="Harvest To Community" title="Abundance with movement."><div className="space-y-4"><MetricTile label="Inventory" value="Updated" note="Crop plans feeding availability" /><MetricTile label="SNAP" value="Visible" note="Eligible produce can be marked" /><MetricTile label="Forecast" value="Open" note="Harvest windows connected" /><MetricTile label="Community" value="Circulating" note="Food, knowledge, money, and trust" /></div><div className="mt-6"><PillButton variant="light" onClick={() => setScreen("reports")}>Marketplace Report</PillButton></div></GlassPanel></section></Shell>;
}

function Operations({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="operations" setScreen={setScreen}><section className="space-y-6"><GlassPanel eyebrow="Operations Control Room" title="The ecosystem is alive today."><p className="max-w-5xl text-lg leading-9 text-emerald-50/95">This is not a corporate dashboard. This is a living agricultural coordination center: weather, teams, crops, assignments, marketplace movement, parent summaries, and reports.</p></GlassPanel><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><MetricTile label="Teams" value="4 Active" note="Youth teams are assigned to grow zones" /><MetricTile label="Supervisors" value="5 Active" note="Daily scoring and support open" /><MetricTile label="Reflections" value="18 Submitted" note="End-of-day reporting in progress" /><MetricTile label="Alerts" value="4 Open" note="Weather, harvest, inventory, and support" /></div><div className="grid gap-6 lg:grid-cols-3"><PhotoCard title="Weather Pulse" subtitle="Cloud movement expected at 3PM. Irrigation decisions should be reviewed." image={IMG.compost} height="300px" /><PhotoCard title="Active Grow Zones" subtitle="Tomatoes, collards, herbs, and pollinator flowers have active tasks." image={IMG.growArea} height="300px" /><PhotoCard title="Marketplace Movement" subtitle="Harvest forecasts are feeding marketplace availability." image={IMG.marketplaceHero} height="300px" /></div><div className="flex flex-wrap gap-4"><PillButton variant="light" onClick={() => setScreen("assessment")}>Open Assessment Engine</PillButton><PillButton onClick={() => setScreen("crop")}>Open Crop Planning</PillButton><PillButton onClick={() => setScreen("reports")}>Generate Reports</PillButton></div></section></Shell>;
}

function Encouragement({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const dayIndex = new Date().getDate() % dailyProverbs.length;
  return <Shell screen="encouragement" setScreen={setScreen}><section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]"><GlassPanel eyebrow="Daily Proverbs + Positive Messages" title="This is the daily encouragement room."><p className="text-lg leading-9 text-emerald-50/95">Each workday begins with a proverb, a positive message, a short youth reflection, and a supervisor encouragement note.</p><div className="mt-8 rounded-[2rem] bg-emerald-300 p-7 text-black"><div className="text-xs uppercase tracking-[0.3em]">Today’s Positive Message</div><div className="mt-5 text-3xl font-black leading-tight">{positiveMessages[dayIndex]}</div></div><div className="mt-6"><PillButton variant="light" onClick={() => setScreen("assessment")}>Connect to Daily Score</PillButton></div></GlassPanel><GlassPanel eyebrow="Daily Proverb Bank" title="Words that set the tone."><div className="grid gap-4 md:grid-cols-2">{dailyProverbs.map((quote, index) => <div key={quote} className="rounded-2xl border border-white/10 bg-white/10 p-5"><div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-200">Day {index + 1}</div><div className="mt-4 text-lg font-black leading-8">“{quote}”</div></div>)}</div><div className="mt-6 grid gap-4 md:grid-cols-2"><div><div className="mb-3 font-black">Youth Reflection</div><textarea className="h-28 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white placeholder:text-white/45" placeholder="Today I learned... Today I helped... Tomorrow I will..." /></div><div><div className="mb-3 font-black">Supervisor Encouragement</div><textarea className="h-28 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white placeholder:text-white/45" placeholder="A short note to help the youth see progress and next steps." /></div></div></GlassPanel></section></Shell>;
}

function Reports({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="reports" setScreen={setScreen}><section className="space-y-6"><GlassPanel eyebrow="Reporting + Analytics Layer" title="At the end, the ecosystem generates reports."><p className="max-w-5xl text-lg leading-9 text-emerald-50/95">Reports are generated from attendance, assessments, crop planning, marketplace movement, parent summaries, supervisor notes, volunteer hours, and community impact.</p></GlassPanel><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{reports.map((report) => <div key={report} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"><div className="text-xl font-black">{report}</div><div className="mt-3 text-sm leading-6 text-emerald-50/80">PDF / Excel / operational summary ready for export.</div></div>)}</div><div className="grid gap-6 lg:grid-cols-3"><PhotoCard title="Workforce Evidence" subtitle="Attendance, daily scores, badges, progress, and participation." image={IMG.youth2} height="280px" /><PhotoCard title="Agricultural Evidence" subtitle="Crop plans, irrigation, grow zones, harvest forecasts, and yield projections." image={IMG.growArea} height="280px" /><PhotoCard title="Community Evidence" subtitle="Marketplace movement, volunteer hours, partner engagement, and impact." image={IMG.partners} height="280px" /></div></section></Shell>;
}

function Partners({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <Shell screen="partners" setScreen={setScreen}><section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><PhotoCard title="Partner Ecosystem" subtitle="Partners, growers, youth, schools, foundations, businesses, volunteers, and community resources circulate together." image={IMG.partners} height="570px" /><div className="space-y-6"><GlassPanel eyebrow="Connected Support" title="Shared stewardship."><div className="space-y-4">{["Jubilee Gardens seed support", "Parker Farms value-added learning", "Central State University representation", "Home Depot tools and demonstrations", "Community growers and volunteers", "City and neighborhood collaboration"].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-lg font-semibold">{item}</div>)}</div></GlassPanel><PhotoCard title="Ecosystem Overview" subtitle="The connected food system image belongs here, where understanding follows invitation." image={IMG.ecosystem} height="320px" /></div></section></Shell>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("portal");
  if (screen === "portal") return <Portal setScreen={setScreen} />;
  if (screen === "home") return <Home setScreen={setScreen} />;
  if (screen === "pathways") return <Pathways setScreen={setScreen} />;
  if (screen === "guest") return <Guest setScreen={setScreen} />;
  if (screen === "youth") return <Youth setScreen={setScreen} />;
  if (screen === "supervisor") return <Supervisor setScreen={setScreen} />;
  if (screen === "parent") return <Parent setScreen={setScreen} />;
  if (screen === "assessment") return <Assessment setScreen={setScreen} />;
  if (screen === "grower") return <Grower setScreen={setScreen} />;
  if (screen === "crop") return <CropPlanning setScreen={setScreen} />;
  if (screen === "marketplace") return <Marketplace setScreen={setScreen} />;
  if (screen === "operations") return <Operations setScreen={setScreen} />;
  if (screen === "encouragement") return <Encouragement setScreen={setScreen} />;
  if (screen === "reports") return <Reports setScreen={setScreen} />;
  if (screen === "partners") return <Partners setScreen={setScreen} />;
  return <Portal setScreen={setScreen} />;
}
