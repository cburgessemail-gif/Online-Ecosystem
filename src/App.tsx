import React, { useEffect, useMemo, useState } from "react";

type Role =
  | "Guest"
  | "Customer"
  | "Marketplace"
  | "Grower"
  | "Youth Workforce"
  | "Parent / Guardian"
  | "Supervisor / Staff"
  | "Partner"
  | "Value-Added Producer"
  | "Mission Control";

type Screen =
  | "portal"
  | "home"
  | "guest"
  | "customer"
  | "marketplace"
  | "grower"
  | "youth"
  | "parent"
  | "supervisor"
  | "partner"
  | "valueAdded"
  | "mission"
  | "journey"
  | "feedback";

type JourneyCategory =
  | "PATHWAY"
  | "RESOURCE"
  | "CAREER"
  | "FEEDBACK"
  | "ACHIEVEMENT"
  | "MARKETPLACE"
  | "PARTNER"
  | "REFLECTION"
  | "PARENT"
  | "SUPERVISOR";

type JourneyEvent = {
  id: string;
  timestamp: string;
  category: JourneyCategory;
  title: string;
  description: string;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
};

type OpportunityInterest = {
  id: string;
  category: string;
  name: string;
  notes?: string;
  createdAt: string;
};

type JourneyProfile = {
  userId: string;
  role: Role;
  startDate: string;
  pathwaysVisited: string[];
  resourcesViewed: string[];
  careersExplored: string[];
  opportunityInterests: OpportunityInterest[];
  achievements: Achievement[];
  reflections: string[];
  feedbackSubmitted: number;
  marketplaceVisits: number;
  partnerInquiries: number;
  parentActions: number;
  supervisorActions: number;
  timeline: JourneyEvent[];
};

const JOURNEY_KEY = "bff.demo.launch.journey.v1";

const roles: { role: Role; screen: Screen; description: string; icon: string }[] = [
  {
    role: "Guest",
    screen: "guest",
    icon: "🌲",
    description: "Explore the forest gate, farm story, airport history, and ways to participate.",
  },
  {
    role: "Customer",
    screen: "customer",
    icon: "🥕",
    description: "Access fresh food, SNAP information, nutrition, and GrownBy marketplace connection.",
  },
  {
    role: "Marketplace",
    screen: "marketplace",
    icon: "🧺",
    description: "View product categories, food destinations, vendors, and local food system activity.",
  },
  {
    role: "Grower",
    screen: "grower",
    icon: "🌱",
    description: "Join the grower network, training, market access, and Farm & Family Alliance supports.",
  },
  {
    role: "Youth Workforce",
    screen: "youth",
    icon: "💪",
    description: "Build skills, earn income, explore careers, use community resources, and grow opportunity.",
  },
  {
    role: "Parent / Guardian",
    screen: "parent",
    icon: "👨‍👩‍👧",
    description: "View parent-safe youth progress, achievements, attendance, and support actions.",
  },
  {
    role: "Supervisor / Staff",
    screen: "supervisor",
    icon: "📋",
    description: "Operate attendance, PPE, assessments, support flags, parent summaries, and daily reports.",
  },
  {
    role: "Partner",
    screen: "partner",
    icon: "🤝",
    description: "Explore collaboration, sponsorship, training, volunteers, equipment, and community impact.",
  },
  {
    role: "Value-Added Producer",
    screen: "valueAdded",
    icon: "🍯",
    description: "Develop Bubble Babies, honey, herbs, seeds, packaging, and marketplace products.",
  },
  {
    role: "Mission Control",
    screen: "mission",
    icon: "📡",
    description: "View ecosystem status, journey memory, pathway metrics, and launch readiness.",
  },
];

const proofPanels: Record<string, string[]> = {
  guest: [
    "Farm story and purpose",
    "Historic Lansdowne Airport context",
    "Regenerative agriculture explained",
    "Youngstown + Warren regional hubs",
    "Attend, volunteer, shop, partner, or receive updates",
  ],
  customer: [
    "Fresh food access",
    "SNAP and GrownBy connection",
    "Nutrition and healthy choices",
    "Produce alerts",
    "Marketplace pathway",
  ],
  marketplace: [
    "No image dependency for launch",
    "Products listed by words and categories",
    "GrownBy connection",
    "Food moves to families, schools, businesses, and marketplace",
    "Vendor and grower next steps",
  ],
  grower: [
    "Producer participation",
    "Farm & Family Alliance support",
    "Training and technical assistance",
    "Market access",
    "Grower intake actions",
  ],
  youth: [
    "8-week workforce identity",
    "Safety, PPE, attendance, and reflection",
    "Career pathways",
    "Future income and entrepreneurship",
    "Library tools and community resources",
  ],
  parent: [
    "Youth attendance",
    "Achievements",
    "Current team and project",
    "Supervisor-safe summary",
    "Parent feedback and encouragement",
  ],
  supervisor: [
    "Youth check-in",
    "Attendance",
    "PPE verification",
    "Support flags",
    "Assessments",
    "Parent summaries",
    "Daily report",
  ],
  partner: [
    "Youth served",
    "Families reached",
    "Food access",
    "Volunteer hours",
    "Resources contributed",
    "Site visit and sponsorship actions",
  ],
  valueAdded: [
    "Bubble Babies",
    "Honey",
    "Herbs",
    "Seeds",
    "Packaging",
    "Marketplace sales",
  ],
};

const youthTeams = [
  "Regenerative Agriculture",
  "Infrastructure & Site Development",
  "Apiary & Pollination",
  "Culinary & Nutrition",
  "Guest Services & Tourism",
  "Media & Storytelling",
  "Safety & Emergency Preparedness",
  "Program Management & Logistics",
];

const youthMoneyCards = [
  {
    title: "Make money with skills",
    icon: "💵",
    body:
      "Youth can increase income by learning skills people pay for: growing food, landscaping, construction help, media, cooking, selling, customer service, and technology.",
  },
  {
    title: "One job + multiple income streams",
    icon: "📈",
    body:
      "A job provides steady income. Extra skills can create more income through farm products, lawn care, market sales, photography, content creation, repairs, and small services.",
  },
  {
    title: "Food can become income",
    icon: "🥕",
    body:
      "Tomatoes, herbs, flowers, seedlings, honey, Bubble Babies, educational kits, and value-added products can become marketplace income when youth learn pricing, packaging, quality, and sales.",
  },
  {
    title: "Use community resources first",
    icon: "🏛️",
    body:
      "The local library can provide tools, equipment, technology, business resources, learning platforms, maker equipment, and support that help youth build skills before buying everything.",
  },
];

const communityResources = [
  "Local library tools and equipment",
  "Library makerspace and creative equipment",
  "Bronson Family Farm hands-on experience",
  "Choffin / career technical pathways",
  "Flying High / workforce training",
  "Central State agriculture learning",
  "Youngstown and Warren community resources",
];

const roleActions: Record<Role, string[]> = {
  Guest: ["Attend an Event", "Volunteer", "Become a Customer", "Become a Partner", "Receive Updates"],
  Customer: ["Shop Marketplace", "Learn SNAP Benefits", "Join Produce Alerts", "Visit GrownBy", "Attend a Farm Visit"],
  Marketplace: ["Shop Products", "Meet Growers", "Become a Vendor", "Visit GrownBy", "Learn Food Destinations"],
  Grower: ["Sell Products", "Join Farm & Family Alliance", "Access Training", "Join Marketplace", "Become a Mentor Grower"],
  "Youth Workforce": ["Earn Work Experience", "Learn Agriculture", "Explore Careers", "Build Leadership", "Make More Money", "Help My Community"],
  "Parent / Guardian": ["Track Progress", "Encourage My Youth", "Volunteer", "Attend Recognition Event", "Receive Updates"],
  "Supervisor / Staff": ["Take Attendance", "Review PPE", "Record Assessment", "Create Parent Summary", "Submit Daily Report", "Review Support Flags"],
  Partner: ["Offer Funding", "Offer Volunteers", "Offer Training", "Offer Internships", "Offer Equipment", "Support Food Access"],
  "Value-Added Producer": ["Develop Bubble Babies", "Develop Honey Products", "Develop Herbal Products", "Package Seeds", "Create Educational Products", "Sell Local Food Products"],
  "Mission Control": ["Review Launch Metrics", "Review Feedback", "Check Pathways", "View Journey Memory", "Confirm Soft Launch"],
};

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function createJourney(role: Role = "Guest"): JourneyProfile {
  return {
    userId: makeId(),
    role,
    startDate: new Date().toISOString(),
    pathwaysVisited: [],
    resourcesViewed: [],
    careersExplored: [],
    opportunityInterests: [],
    achievements: [],
    reflections: [],
    feedbackSubmitted: 0,
    marketplaceVisits: 0,
    partnerInquiries: 0,
    parentActions: 0,
    supervisorActions: 0,
    timeline: [],
  };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("portal");
  const [activeRole, setActiveRole] = useState<Role>("Guest");
  const [feedbackText, setFeedbackText] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [journey, setJourney] = useState<JourneyProfile>(() => {
    try {
      const saved = localStorage.getItem(JOURNEY_KEY);
      return saved ? JSON.parse(saved) : createJourney("Guest");
    } catch {
      return createJourney("Guest");
    }
  });

  useEffect(() => {
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(journey));
  }, [journey]);

  const journeyPercent = useMemo(() => {
    const total = 10;
    return Math.min(100, Math.round((journey.pathwaysVisited.length / total) * 100));
  }, [journey.pathwaysVisited.length]);

  const addEvent = (category: JourneyCategory, title: string, description: string) => {
    const event: JourneyEvent = {
      id: makeId(),
      timestamp: new Date().toISOString(),
      category,
      title,
      description,
    };

    setJourney((prev) => ({
      ...prev,
      role: activeRole,
      timeline: [event, ...prev.timeline].slice(0, 100),
    }));
  };

  const award = (title: string, description: string, icon: string) => {
    setJourney((prev) => {
      if (prev.achievements.some((a) => a.title === title)) return prev;
      const badge: Achievement = {
        id: makeId(),
        title,
        description,
        icon,
        earnedDate: new Date().toISOString(),
      };
      const event: JourneyEvent = {
        id: makeId(),
        timestamp: new Date().toISOString(),
        category: "ACHIEVEMENT",
        title,
        description,
      };
      return {
        ...prev,
        achievements: [badge, ...prev.achievements],
        timeline: [event, ...prev.timeline].slice(0, 100),
      };
    });
  };

  const recordPathway = (name: string) => {
    setJourney((prev) => ({
      ...prev,
      role: activeRole,
      pathwaysVisited: Array.from(new Set([...prev.pathwaysVisited, name])),
    }));
    addEvent("PATHWAY", name, `Visited ${name}.`);
    setTimeout(() => {
      setJourney((current) => {
        if (current.pathwaysVisited.length >= 3) {
          award("Ecosystem Explorer", "Visited at least 3 ecosystem pathways.", "🧭");
        }
        if (current.pathwaysVisited.length >= 5) {
          award("Ecosystem Builder", "Visited at least 5 ecosystem pathways.", "🌉");
        }
        if (current.pathwaysVisited.length >= 8) {
          award("Gold Ecosystem Explorer", "Visited most of the launch ecosystem.", "🏆");
        }
        return current;
      });
    }, 80);
  };

  const openScreen = (next: Screen, role: Role, pathwayName: string) => {
    setActiveRole(role);
    setScreen(next);
    recordPathway(pathwayName);
    if (next === "marketplace") {
      setJourney((prev) => ({ ...prev, marketplaceVisits: prev.marketplaceVisits + 1 }));
      addEvent("MARKETPLACE", "Marketplace Visit", "Viewed marketplace activity.");
    }
    if (next === "partner") {
      setJourney((prev) => ({ ...prev, partnerInquiries: prev.partnerInquiries + 1 }));
      addEvent("PARTNER", "Partner Interest", "Viewed partnership opportunities.");
    }
  };

  const recordResource = (resource: string) => {
    setJourney((prev) => ({
      ...prev,
      resourcesViewed: Array.from(new Set([...prev.resourcesViewed, resource])),
    }));
    addEvent("RESOURCE", resource, `Viewed resource: ${resource}.`);
    setTimeout(() => {
      setJourney((current) => {
        if (current.resourcesViewed.length >= 3) {
          award("Resource Explorer", "Explored community and library resources.", "🏛️");
        }
        return current;
      });
    }, 80);
  };

  const recordCareer = (name: string, category = "Opportunity") => {
    const interest: OpportunityInterest = {
      id: makeId(),
      category,
      name,
      createdAt: new Date().toISOString(),
    };
    setJourney((prev) => ({
      ...prev,
      careersExplored: Array.from(new Set([...prev.careersExplored, name])),
      opportunityInterests: [interest, ...prev.opportunityInterests].slice(0, 100),
    }));
    addEvent("CAREER", name, `Explored ${category}: ${name}.`);
    setTimeout(() => {
      setJourney((current) => {
        if (current.careersExplored.length >= 3) {
          award("Opportunity Builder", "Explored at least 3 careers, income ideas, or opportunity paths.", "💵");
        }
        return current;
      });
    }, 80);
  };

  const submitReflection = () => {
    if (!reflectionText.trim()) return;
    setJourney((prev) => ({
      ...prev,
      reflections: [reflectionText.trim(), ...prev.reflections].slice(0, 50),
    }));
    addEvent("REFLECTION", "Reflection Saved", reflectionText.trim());
    award("Workforce Reflection", "Saved a youth workforce reflection.", "✍️");
    setReflectionText("");
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) return;
    setJourney((prev) => ({
      ...prev,
      feedbackSubmitted: prev.feedbackSubmitted + 1,
    }));
    addEvent("FEEDBACK", "Feedback Submitted", feedbackText.trim());
    award("Community Connector", "Submitted feedback to help improve the ecosystem.", "🤝");
    setFeedbackText("");
  };

  const recordAction = (role: Role, action: string) => {
    recordCareer(action, role);
    if (role === "Parent / Guardian") {
      setJourney((prev) => ({ ...prev, parentActions: prev.parentActions + 1 }));
      addEvent("PARENT", action, `Parent selected: ${action}.`);
    }
    if (role === "Supervisor / Staff") {
      setJourney((prev) => ({ ...prev, supervisorActions: prev.supervisorActions + 1 }));
      addEvent("SUPERVISOR", action, `Supervisor selected: ${action}.`);
    }
  };

  const resetJourney = () => {
    const fresh = createJourney("Guest");
    setJourney(fresh);
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(fresh));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-stone-950 to-amber-950 text-white">
      <Header
        screen={screen}
        activeRole={activeRole}
        onHome={() => setScreen("home")}
        onPortal={() => setScreen("portal")}
        onJourney={() => setScreen("journey")}
        onMission={() => openScreen("mission", "Mission Control", "Mission Control")}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
        {screen === "portal" && (
          <Portal
            onEnter={() => {
              setScreen("home");
              recordPathway("Portal Entry");
            }}
          />
        )}

        {screen === "home" && (
          <Home
            journeyPercent={journeyPercent}
            roles={roles}
            openScreen={openScreen}
            journey={journey}
          />
        )}

        {screen === "guest" && (
          <PathwayShell
            title="Guest Pathway"
            subtitle="Enter through the forest gate and understand the story, land, purpose, and invitation."
            panelKey="guest"
            role="Guest"
            recordAction={recordAction}
            setScreen={setScreen}
          >
            <StoryCards
              cards={[
                ["Why Bronson Family Farm Exists", "Bronson Family Farm connects regenerative agriculture, healthy food access, agritourism, workforce development, and community partnerships in Youngstown and Warren."],
                ["Historic Lansdowne Airport", "The ecosystem is rooted at the historic Lansdowne Airport, where land, aviation history, family legacy, and community opportunity meet."],
                ["Regenerative Agriculture", "Regenerative farming means developing the land while improving soil health, protecting natural systems, reducing waste, and growing food in ways that build future capacity."],
                ["Ways to Participate", "Guests can become customers, volunteers, partners, event participants, supporters, or storytellers for the ecosystem."],
              ]}
            />
          </PathwayShell>
        )}

        {screen === "customer" && (
          <PathwayShell
            title="Customer Pathway"
            subtitle="Fresh food, nutrition, SNAP awareness, local purchasing, and repeat healthy choices."
            panelKey="customer"
            role="Customer"
            recordAction={recordAction}
            setScreen={setScreen}
          >
            <StoryCards
              cards={[
                ["Healthy Food Access", "Customers learn how fresh local food supports health, family meals, and community resilience."],
                ["SNAP + GrownBy", "The marketplace pathway connects customers to GrownBy and SNAP-aware purchasing where eligible products are available."],
                ["Produce Alerts", "Customers can express interest in updates for available produce, marketplace days, and food access opportunities."],
              ]}
            />
          </PathwayShell>
        )}

        {screen === "marketplace" && (
          <PathwayShell
            title="Marketplace Pathway"
            subtitle="No image dependency. Words, products, categories, growers, and GrownBy connection for launch."
            panelKey="marketplace"
            role="Marketplace"
            recordAction={recordAction}
            setScreen={setScreen}
          >
            <div className="grid gap-4 md:grid-cols-3">
              {["Tomatoes", "Greens", "Herbs", "Seeds", "Bubble Babies", "Honey", "Flowers", "Value-Added Products", "Grower Vendor Items"].map((item) => (
                <button
                  key={item}
                  onClick={() => recordCareer(item, "Marketplace Product Interest")}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5 text-left hover:bg-white/15"
                >
                  <p className="text-lg font-black">{item}</p>
                  <p className="mt-2 text-sm text-emerald-50/80">Track product interest and marketplace demand.</p>
                </button>
              ))}
            </div>
            <a
              href="https://grownby.com/farms/bronson-family-farm"
              target="_blank"
              rel="noreferrer"
              onClick={() => recordResource("GrownBy Bronson Family Farm Marketplace")}
              className="mt-5 inline-flex rounded-2xl bg-amber-300 px-5 py-3 font-black text-stone-950"
            >
              Open GrownBy Marketplace
            </a>
          </PathwayShell>
        )}

        {screen === "grower" && (
          <PathwayShell
            title="Grower Support System"
            subtitle="Market access, training, technical support, shared opportunity, and Farm & Family Alliance connection."
            panelKey="grower"
            role="Grower"
            recordAction={recordAction}
            setScreen={setScreen}
          >
            <StoryCards
              cards={[
                ["Producer Participation", "Growers can connect to marketplace opportunities, training, regional collaboration, and shared food access goals."],
                ["Farm & Family Alliance", "The nonprofit ecosystem supports growers, workforce development, education, food access, and collaborative regional participation."],
                ["Training Needs", "Growers may need support with soil, irrigation, crop planning, food safety, pricing, packaging, marketing, distribution, and grants."],
              ]}
            />
          </PathwayShell>
        )}

        {screen === "youth" && (
          <PathwayShell
            title="Youth Workforce Pathway"
            subtitle="Achievement, income, opportunity, leadership, safety, resource exploration, and future building."
            panelKey="youth"
            role="Youth Workforce"
            recordAction={recordAction}
            setScreen={setScreen}
          >
            <YouthOpportunity recordCareer={recordCareer} recordResource={recordResource} />
            <section className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200">Daily Reflection</p>
              <h2 className="mt-2 text-2xl font-black">What did you learn, build, or overcome today?</h2>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write a short reflection..."
                className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white placeholder:text-white/50"
              />
              <button onClick={submitReflection} className="mt-3 rounded-2xl bg-amber-300 px-5 py-3 font-black text-stone-950">
                Save My Reflection
              </button>
            </section>
          </PathwayShell>
        )}

        {screen === "parent" && (
          <PathwayShell
            title="Parent / Guardian Portal"
            subtitle="Complete parent-safe dashboard: attendance, achievements, current project, supervisor summary, and feedback."
            panelKey="parent"
            role="Parent / Guardian"
            recordAction={recordAction}
            setScreen={setScreen}
          >
            <ParentDashboard journey={journey} addEvent={addEvent} />
          </PathwayShell>
        )}

        {screen === "supervisor" && (
          <PathwayShell
            title="Supervisor Operations Center"
            subtitle="Corrected launch version: attendance, PPE, support flags, assessments, parent summaries, and reports."
            panelKey="supervisor"
            role="Supervisor / Staff"
            recordAction={recordAction}
            setScreen={setScreen}
          >
            <SupervisorCenter youthTeams={youthTeams} recordAction={recordAction} addEvent={addEvent} />
          </PathwayShell>
        )}

        {screen === "partner" && (
          <PathwayShell
            title="Partner Impact Pathway"
            subtitle="Collaboration, support, sponsorship, equipment, training, volunteers, and measurable community value."
            panelKey="partner"
            role="Partner"
            recordAction={recordAction}
            setScreen={setScreen}
          >
            <StoryCards
              cards={[
                ["Ways Partners Can Help", "Funding, volunteers, tools, equipment, training, internships, transportation, marketing, food access, and technical assistance."],
                ["Partner Impact", "Partners support youth served, families reached, food grown, skills developed, resources shared, and regional collaboration."],
                ["Next Step", "Create a partner profile, schedule a visit, identify resources, or support a specific youth, grower, marketplace, or infrastructure need."],
              ]}
            />
          </PathwayShell>
        )}

        {screen === "valueAdded" && (
          <PathwayShell
            title="Value-Added Producer Pathway"
            subtitle="Bubble Babies, honey, herbs, seeds, packaging, labeling, pricing, and marketplace sales."
            panelKey="valueAdded"
            role="Value-Added Producer"
            recordAction={recordAction}
            setScreen={setScreen}
          >
            <StoryCards
              cards={[
                ["Bubble Babies", "Seed roll products can teach packaging, pricing, inventory, marketing, production, and marketplace sales."],
                ["Honey, Herbs, Seeds", "Farm products can become branded educational, culinary, wellness, and gift items with proper planning and compliance."],
                ["Product Development Skills", "Youth and producers learn labeling, costing, pricing, customer value, storytelling, and sales channels."],
              ]}
            />
          </PathwayShell>
        )}

        {screen === "mission" && <MissionControl journey={journey} resetJourney={resetJourney} setScreen={setScreen} />}

        {screen === "journey" && <JourneyScreen journey={journey} journeyPercent={journeyPercent} resetJourney={resetJourney} />}

        {screen === "feedback" && (
          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200">Reviewer Feedback</p>
            <h1 className="mt-3 text-3xl font-black">Help improve the ecosystem</h1>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What worked? What was confusing? What is missing?"
              className="mt-5 min-h-40 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white placeholder:text-white/50"
            />
            <button onClick={submitFeedback} className="mt-3 rounded-2xl bg-emerald-300 px-5 py-3 font-black text-stone-950">
              Submit Feedback
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function Header({
  screen,
  activeRole,
  onHome,
  onPortal,
  onJourney,
  onMission,
}: {
  screen: Screen;
  activeRole: Role;
  onHome: () => void;
  onPortal: () => void;
  onJourney: () => void;
  onMission: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200">Bronson Family Farm</p>
          <h1 className="text-lg font-black">Online Ecosystem Launch Demo</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill>{activeRole}</Pill>
          <button onClick={onPortal} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15">Portal</button>
          <button onClick={onHome} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15">Home</button>
          <button onClick={onJourney} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15">My Journey</button>
          <button onClick={onMission} className="rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-stone-950">Mission Control</button>
        </div>
      </div>
    </header>
  );
}

function Portal({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="grid min-h-[78vh] place-items-center">
      <div className="w-full max-w-5xl rounded-[3rem] border border-white/10 bg-gradient-to-br from-emerald-900/70 via-stone-950 to-amber-900/70 p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-200">Forest Gate Entry</p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
          Enter the Bronson Family Farm Ecosystem
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/85">
          A launch-ready, no-image demo experience connecting regenerative agriculture, youth workforce development, healthy food access, marketplace opportunity, family engagement, and regional partnerships.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={onEnter} className="rounded-2xl bg-amber-300 px-6 py-4 text-lg font-black text-stone-950 shadow-lg">
            Enter Ecosystem
          </button>
          <span className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 font-bold">
            No images required for launch
          </span>
        </div>
      </div>
    </section>
  );
}

function Home({
  journeyPercent,
  roles,
  openScreen,
  journey,
}: {
  journeyPercent: number;
  roles: { role: Role; screen: Screen; description: string; icon: string }[];
  openScreen: (next: Screen, role: Role, pathwayName: string) => void;
  journey: JourneyProfile;
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200">Launch Home</p>
        <h1 className="mt-2 text-4xl font-black">Choose your pathway</h1>
        <p className="mt-3 max-w-4xl text-emerald-50/85">
          Every role now teaches, collects journey memory, creates conversion actions, and moves users toward participation.
        </p>
        <div className="mt-5 rounded-2xl bg-black/20 p-4">
          <div className="flex justify-between text-sm font-bold">
            <span>Journey Progress</span>
            <span>{journeyPercent}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-amber-300" style={{ width: `${journeyPercent}%` }} />
          </div>
          <p className="mt-2 text-xs text-emerald-50/70">
            {journey.pathwaysVisited.length} pathways visited • {journey.achievements.length} achievements earned
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((item) => (
          <button
            key={item.role}
            onClick={() => openScreen(item.screen, item.role, item.role)}
            className="rounded-[2rem] border border-white/10 bg-white/10 p-5 text-left shadow-lg transition hover:-translate-y-1 hover:bg-white/15"
          >
            <p className="text-4xl">{item.icon}</p>
            <h2 className="mt-3 text-2xl font-black">{item.role}</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50/80">{item.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function PathwayShell({
  title,
  subtitle,
  panelKey,
  role,
  recordAction,
  setScreen,
  children,
}: {
  title: string;
  subtitle: string;
  panelKey: string;
  role: Role;
  recordAction: (role: Role, action: string) => void;
  setScreen: (screen: Screen) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200">Launch Pathway</p>
          <h1 className="mt-2 text-4xl font-black">{title}</h1>
          <p className="mt-3 text-lg leading-8 text-emerald-50/85">{subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setScreen("home")} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15">
              Return Home
            </button>
            <button onClick={() => setScreen("feedback")} className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-stone-950">
              Comment on This Screen
            </button>
            <button onClick={() => setScreen("journey")} className="rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-stone-950">
              Record Achievement
            </button>
          </div>
        </div>
        <NoImageProofPanel title={title} items={proofPanels[panelKey] || []} />
      </div>

      {children}

      <RoleConversionPanel role={role} recordAction={recordAction} />
    </section>
  );
}

function NoImageProofPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-emerald-950/50 p-6">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200">Launch Proof Panel</p>
      <h2 className="mt-3 text-3xl font-black">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold">
            ✓ {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleConversionPanel({
  role,
  recordAction,
}: {
  role: Role;
  recordAction: (role: Role, action: string) => void;
}) {
  const actions = roleActions[role] || [];
  return (
    <section className="rounded-[2rem] border border-amber-200/20 bg-amber-100/10 p-6">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">Role-Based Launch Conversion</p>
      <h2 className="mt-2 text-2xl font-black">What would you like to do next?</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => recordAction(role, action)}
            className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left font-bold hover:bg-white/15"
          >
            ☐ {action}
          </button>
        ))}
      </div>
    </section>
  );
}

function StoryCards({ cards }: { cards: [string, string][] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {cards.map(([title, body]) => (
        <article key={title} className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
          <h3 className="text-xl font-black">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-emerald-50/80">{body}</p>
        </article>
      ))}
    </section>
  );
}

function YouthOpportunity({
  recordCareer,
  recordResource,
}: {
  recordCareer: (name: string, category?: string) => void;
  recordResource: (resource: string) => void;
}) {
  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-amber-200/20 bg-amber-100/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">Youth Opportunity Engine</p>
        <h2 className="mt-2 text-3xl font-black">How can I make more money and build my future?</h2>
        <p className="mt-3 text-amber-50/85">
          This pathway connects daily farm work to income, entrepreneurship, trades, media, technology, agriculture, community resources, and future wealth-building.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {youthMoneyCards.map((card) => (
            <button
              key={card.title}
              onClick={() => recordCareer(card.title, "Income")}
              className="rounded-[2rem] border border-white/10 bg-white/10 p-5 text-left hover:bg-white/15"
            >
              <p className="text-4xl">{card.icon}</p>
              <h3 className="mt-3 text-xl font-black">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-amber-50/80">{card.body}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-sky-200/20 bg-sky-100/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-200">Library + Community Resources</p>
        <h2 className="mt-2 text-2xl font-black">Use tools and equipment already available in the community.</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {communityResources.map((resource) => (
            <button
              key={resource}
              onClick={() => recordResource(resource)}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left font-bold hover:bg-white/15"
            >
              🏛️ {resource}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <h2 className="text-2xl font-black">Simple Farm Income Example</h2>
        <p className="mt-3 text-sm leading-6 text-emerald-50/80">
          100 tomato plants × 15 pounds each = 1,500 pounds. At $3 per pound, that equals $4,500 in possible revenue before expenses. Youth learn revenue, expenses, pricing, labor, quality, and marketing.
        </p>
        <button
          onClick={() => recordCareer("Farm Income Calculator", "Entrepreneurship")}
          className="mt-4 rounded-2xl bg-amber-300 px-5 py-3 font-black text-stone-950"
        >
          Save Farm Income Interest
        </button>
      </div>
    </section>
  );
}

function ParentDashboard({
  journey,
  addEvent,
}: {
  journey: JourneyProfile;
  addEvent: (category: JourneyCategory, title: string, description: string) => void;
}) {
  const metrics = [
    ["Attendance", "Tracked through supervisor check-in"],
    ["Achievements", `${journey.achievements.length} badges earned`],
    ["Career Interests", `${journey.careersExplored.length} explored`],
    ["Resources", `${journey.resourcesViewed.length} viewed`],
  ];

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">{label}</p>
            <p className="mt-2 text-lg font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
          <h3 className="text-xl font-black">Supervisor-Safe Summary</h3>
          <p className="mt-2 text-sm leading-6 text-emerald-50/80">
            Your youth is building workforce habits, teamwork, safety awareness, communication, problem-solving, leadership, and future opportunity interests. Private wellness responses remain staff-facing and are not displayed here.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
          <h3 className="text-xl font-black">Parent Actions</h3>
          {["Send Encouragement", "Ask Question", "Report Concern", "Volunteer Interest", "Receive Weekly Updates"].map((action) => (
            <button
              key={action}
              onClick={() => addEvent("PARENT", action, `Parent selected ${action}.`)}
              className="mr-2 mt-3 rounded-full bg-purple-200 px-3 py-2 text-xs font-black text-purple-950"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupervisorCenter({
  youthTeams,
  recordAction,
  addEvent,
}: {
  youthTeams: string[];
  recordAction: (role: Role, action: string) => void;
  addEvent: (category: JourneyCategory, title: string, description: string) => void;
}) {
  const quickActions = [
    "Check Attendance",
    "Verify PPE",
    "Review Mood / Support Flags",
    "Record Daily Observation",
    "Complete Weekly Rubric",
    "Create Parent Summary",
    "Submit Incident Report",
    "Submit Daily Report",
  ];

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-5">
        {[
          ["Youth Present", "0"],
          ["Youth Absent", "0"],
          ["Support Flags", "0"],
          ["Active Teams", String(youthTeams.length)],
          ["Weather", "Check onsite"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
        <h3 className="text-2xl font-black">Team Assignments</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {youthTeams.map((team) => (
            <button
              key={team}
              onClick={() => addEvent("SUPERVISOR", "Team Reviewed", `Reviewed ${team}.`)}
              className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left font-bold hover:bg-black/30"
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
        <h3 className="text-2xl font-black">Supervisor Quick Actions</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => recordAction("Supervisor / Staff", action)}
              className="rounded-2xl bg-emerald-300 p-4 text-left font-black text-stone-950 hover:bg-emerald-200"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionControl({
  journey,
  resetJourney,
  setScreen,
}: {
  journey: JourneyProfile;
  resetJourney: () => void;
  setScreen: (screen: Screen) => void;
}) {
  const stats = [
    ["Pathways Visited", journey.pathwaysVisited.length],
    ["Resources Accessed", journey.resourcesViewed.length],
    ["Career Explorations", journey.careersExplored.length],
    ["Marketplace Visits", journey.marketplaceVisits],
    ["Partner Inquiries", journey.partnerInquiries],
    ["Youth Reflections", journey.reflections.length],
    ["Feedback Responses", journey.feedbackSubmitted],
    ["Achievements Earned", journey.achievements.length],
    ["Parent Actions", journey.parentActions],
    ["Supervisor Actions", journey.supervisorActions],
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">Mission Control</p>
        <h1 className="mt-2 text-4xl font-black">Launch readiness and ecosystem activity</h1>
        <p className="mt-3 text-emerald-50/80">
          This no-image launch version closes the major blockers: Supervisor, Guest, Parent, Partner, Value-Added, Journey Memory, and Mission Control.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={String(label)} className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">{label}</p>
            <p className="mt-2 text-3xl font-black">{String(value)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <h2 className="text-2xl font-black">Launch Status</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "No broken image dependencies",
            "Supervisor Operations Center corrected",
            "Parent Portal completed for launch",
            "Guest pathway completed with story and conversion",
            "Partner and Value-Added panels filled",
            "Journey memory active",
            "Feedback capture active",
            "export default App included",
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-emerald-300/15 p-4 font-bold">
              ✅ {item}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => setScreen("feedback")} className="rounded-2xl bg-amber-300 px-5 py-3 font-black text-stone-950">
            Submit Reviewer Feedback
          </button>
          <button onClick={resetJourney} className="rounded-2xl bg-white/10 px-5 py-3 font-bold hover:bg-white/15">
            Reset Demo Journey
          </button>
        </div>
      </div>
    </section>
  );
}

function JourneyScreen({
  journey,
  journeyPercent,
  resetJourney,
}: {
  journey: JourneyProfile;
  journeyPercent: number;
  resetJourney: () => void;
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200">My Ecosystem Journey</p>
        <h1 className="mt-2 text-4xl font-black">Your visit is becoming a journey record.</h1>
        <p className="mt-3 text-emerald-50/80">
          Started {new Date(journey.startDate).toLocaleString()} • Progress {journeyPercent}%
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {[
          ["Pathways", journey.pathwaysVisited.length],
          ["Resources", journey.resourcesViewed.length],
          ["Careers", journey.careersExplored.length],
          ["Feedback", journey.feedbackSubmitted],
          ["Badges", journey.achievements.length],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">{label}</p>
            <p className="mt-2 text-3xl font-black">{String(value)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-black">Achievements</h2>
          <div className="mt-4 space-y-3">
            {journey.achievements.length === 0 ? (
              <p className="text-emerald-50/70">Achievements appear as users explore pathways, feedback, resources, and opportunities.</p>
            ) : (
              journey.achievements.map((badge) => (
                <div key={badge.id} className="rounded-2xl bg-amber-300/15 p-4">
                  <p className="font-black">{badge.icon} {badge.title}</p>
                  <p className="text-sm text-amber-50/80">{badge.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-black">Recent Timeline</h2>
          <div className="mt-4 space-y-3">
            {journey.timeline.length === 0 ? (
              <p className="text-emerald-50/70">No journey activity recorded yet.</p>
            ) : (
              journey.timeline.slice(0, 12).map((event) => (
                <div key={event.id} className="rounded-2xl bg-black/20 p-4">
                  <p className="font-black">{event.title}</p>
                  <p className="text-sm text-emerald-50/75">{event.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button onClick={resetJourney} className="rounded-2xl bg-white/10 px-5 py-3 font-bold hover:bg-white/15">
        Reset Journey
      </button>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-stone-950">{children}</span>;
}
