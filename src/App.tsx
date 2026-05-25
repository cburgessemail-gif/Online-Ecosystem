{/* =========================================
   ADD THIS BELOW HOME()
   DO NOT CHANGE EXISTING LAYOUT
========================================= */}

function Pathways({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  const roles = [
    {
      id: "guest",
      title: "Guest Experience",
      image: IMG.heroAlt,
      description:
        "Enter the ecosystem through story, land, atmosphere, and purpose.",
      journey: [
        "Experience the cinematic farm entrance.",
        "Understand why the ecosystem exists.",
        "Discover food, youth, wellness, and growers connected together.",
        "Choose whether to return, volunteer, support, or participate.",
      ],
      decision:
        "Become connected to the ecosystem through participation or support.",
    },

    {
      id: "grower",
      title: "Grower Ecosystem",
      image: IMG.growArea,
      description:
        "Tools, training, production, soil systems, fencing, compost, and market connection.",
      journey: [
        "Learn growing methods and seasonal planning.",
        "Connect with compost, fencing, seeds, and irrigation systems.",
        "Understand marketplace participation.",
        "Scale from household growing toward production.",
      ],
      decision:
        "Join the grower network and move toward sustainable production.",
    },

    {
      id: "marketplace",
      title: "Marketplace Movement",
      image: IMG.marketplaceHero,
      description:
        "Food, seedlings, tools, demonstrations, and knowledge circulating through the community.",
      journey: [
        "Experience food and grower interaction.",
        "Connect to QR systems and ecosystem participation.",
        "Discover nutritional and culinary education.",
        "Support local growers and food access.",
      ],
      decision:
        "Return regularly and become part of the marketplace ecosystem.",
    },

    {
      id: "youth",
      title: "Youth Workforce Journey",
      image: IMG.youth2,
      description:
        "Leadership, responsibility, participation, and workforce readiness.",
      journey: [
        "Daily check-in and supervisor assignment.",
        "PPE, safety, structure, and participation.",
        "Hands-on production, teamwork, and marketplace engagement.",
        "Reflection, growth tracking, and future readiness.",
      ],
      decision:
        "Complete the program with measurable workforce growth and leadership development.",
    },

    {
      id: "partners",
      title: "Partnership Ecosystem",
      image: IMG.partners,
      description:
        "Community collaboration supporting long-term ecosystem sustainability.",
      journey: [
        "Understand operational ecosystem needs.",
        "Align resources, education, sponsorship, or infrastructure.",
        "Support visible community
