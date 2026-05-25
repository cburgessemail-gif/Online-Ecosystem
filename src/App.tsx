import React, { useMemo, useState } from "react";

type Screen = "home" | "roles" | "journey" | "marketplace" | "partners" | "workforce" | "feedback";

type Language =
  | "English"
  | "Español"
  | "Tagalog"
  | "Italiano"
  | "עברית"
  | "Français";

type PathKey =
  | "guest"
  | "grower"
  | "youth"
  | "customer"
  | "marketplace"
  | "partner"
  | "volunteer"
  | "valueAdded"
  | "supervisor"
  | "parent";

type JourneyStep = {
  label: string;
  title: string;
  text: string;
  points: string[];
  decision: string;
  action: string;
};

type Journey = {
  key: PathKey;
  nav: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
  needMet: string;
  benefit: string;
  destination: string;
  share: string;
  steps: JourneyStep[];
};

const languages: Language[] = [
  "English",
  "Español",
  "Tagalog",
  "Italiano",
  "עברית",
  "Français",
];

const IMG = {
  hero: "/images/large (18).jpg",
  heroAlt: "/images/large (2).jpg",

  youth1: "/images/large (16).jpg",
  youth2: "/images/large (15).jpg",
  youth3: "/images/large (12).jpg",

  marketplaceHero: "/images/large (11).jpg",
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

const t: Record<
  Language,
  {
    home: string;
    guided: string;
    marketplace: string;
    partners: string;
    workforce: string;
    feedback: string;
    title: string;
    subtitle: string;
    start: string;
    continue: string;
    choose: string;
    completed: string;
    language: string;
  }
> = {
  English: {
    home: "Home",
    guided: "Guided Tour",
    marketplace: "Marketplace",
    partners: "Partners",
    workforce: "Workforce",
    feedback: "Feedback",
    title: "Step Into The Farm. Experience The Wonders Of Life.",
    subtitle:
      "A living ecosystem connecting youth workforce development, growers, marketplace systems, schools, wellness, agritourism, food access, leadership, and community revitalization.",
    start: "Begin Guided Tour",
    continue: "Continue Journey",
    choose: "Choose Your Pathway",
    completed: "Completed",
    language: "Language",
  },
  Español: {
    home: "Inicio",
    guided: "Recorrido",
    marketplace: "Mercado",
    partners: "Aliados",
    workforce: "Jóvenes",
    feedback: "Comentarios",
    title: "Entre a la finca. Experimente las maravillas de la vida.",
    subtitle:
      "Un ecosistema vivo que conecta jóvenes, agricultores, mercado, escuelas, bienestar, acceso a alimentos y revitalización comunitaria.",
    start: "Comenzar Recorrido",
    continue: "Continuar",
    choose: "Elija Su Camino",
    completed: "Completado",
    language: "Idioma",
  },
  Tagalog: {
    home: "Home",
    guided: "Gabay",
    marketplace: "Pamilihan",
    partners: "Kasosyo",
    workforce: "Kabataan",
    feedback: "Puna",
    title: "Pumasok sa sakahan. Damhin ang hiwaga ng buhay.",
    subtitle:
      "Isang buhay na ekosistema na nag-uugnay sa kabataan, growers, pamilihan, paaralan, kalusugan, pagkain, pamumuno, at komunidad.",
    start: "Simulan ang Gabay",
    continue: "Magpatuloy",
    choose: "Piliin ang Daan",
    completed: "Tapos",
    language: "Wika",
  },
  Italiano: {
    home: "Home",
    guided: "Tour",
    marketplace: "Mercato",
    partners: "Partner",
    workforce: "Giovani",
    feedback: "Riscontro",
    title: "Entra nella fattoria. Vivi le meraviglie della vita.",
    subtitle:
      "Un ecosistema vivo che collega giovani, produttori, mercato, scuole, benessere, accesso al cibo, leadership e comunità.",
    start: "Inizia il Tour",
    continue: "Continua",
    choose: "Scegli il Percorso",
    completed: "Completato",
    language: "Lingua",
  },
  עברית: {
    home: "בית",
    guided: "סיור",
    marketplace: "שוק",
    partners: "שותפים",
    workforce: "נוער",
    feedback: "משוב",
    title: "היכנסו לחווה. חוו את פלאי החיים.",
    subtitle:
      "מערכת חיה המחברת נוער, מגדלים, שוק, בתי ספר, בריאות, מזון, מנהיגות וקהילה.",
    start: "התחל סיור",
    continue: "המשך",
    choose: "בחר מסלול",
    completed: "הושלם",
    language: "שפה",
  },
  Français: {
    home: "Accueil",
    guided: "Visite",
    marketplace: "Marché",
    partners: "Partenaires",
    workforce: "Jeunesse",
    feedback: "Retour",
    title: "Entrez dans la ferme. Découvrez les merveilles de la vie.",
    subtitle:
      "Un écosystème vivant reliant les jeunes, les producteurs, le marché, les écoles, le bien-être, l'accès alimentaire, le leadership et la communauté.",
    start: "Commencer",
    continue: "Continuer",
    choose: "Choisir un Parcours",
    completed: "Terminé",
    language: "Langue",
  },
};

const journeys: Journey[] = [
  {
    key: "guest",
    nav: "Guest",
    title: "Guest Pathway",
    subtitle: "Understand the vision, story, place, and purpose.",
    image: IMG.queens,
    accent: "from-emerald-200 to-lime-100",
    needMet: "People need a clear first experience that explains why the farm matters.",
    benefit: "Guests leave with language, context, and confidence to invite others.",
    destination: "Decide whether to visit, share, volunteer, sponsor, or become part of the ecosystem.",
    share: "Share the farm story with a family member, school, church, funder, or neighbor.",
    steps: [
      {
        label: "Enter",
        title: "Welcome Into The Living Farm",
        text: "The guest begins with the land, the people, the food access need, and the promise of a community-centered destination.",
        points: ["Legacy and land story", "Food access and wellness", "A real farm people can enter"],
        decision: "Do I understand why Bronson Family Farm exists?",
        action: "Continue to the role pathways.",
      },
      {
        label: "Experience",
        title: "See The Ecosystem In Motion",
        text: "Guests see youth, growers, partners, marketplace, wellness, and family connection as one operating model.",
        points: ["Youth workforce", "Grower supply market", "Community partnerships"],
        decision: "Which part of the ecosystem connects with me?",
        action: "Choose a pathway to explore deeper.",
      },
      {
        label: "Decide",
        title: "Choose A Meaningful Next Step",
        text: "The guest is not left watching a presentation. The experience ends with a clear invitation to participate.",
        points: ["Visit", "Share", "Volunteer", "Sponsor", "Partner"],
        decision: "How do I want to support or participate?",
        action: "Send feedback or select another pathway.",
      },
    ],
  },
  {
    key: "grower",
    nav: "Grower",
    title: "Grower Pathway",
    subtitle: "Move from interest to production support, market readiness, and regional food participation.",
    image: IMG.growArea,
    accent: "from-green-200 to-emerald-100",
    needMet: "Small growers need tools, knowledge, market access, and support systems.",
    benefit: "Growers can learn, produce, connect, and participate in a shared food system.",
    destination: "Decide whether to become a grower, join market activity, request support, or collaborate.",
    share: "Share with another backyard gardener, small farmer, school garden, or food producer.",
    steps: [
      {
        label: "Assess",
        title: "Start With What You Can Grow",
        text: "The grower identifies land, containers, seedlings, season, labor, tools, and learning needs.",
        points: ["Growing space", "Crop interests", "Tools and supplies", "Training needs"],
        decision: "Do I want to grow for home, community, or market?",
        action: "Select grower support resources.",
      },
      {
        label: "Prepare",
        title: "Connect To Supplies And Knowledge",
        text: "The grower connects to seeds, seedlings, Bubble Babies, soil, compost, demonstrations, and peer learning.",
        points: ["Seeds and seedlings", "Compost and soil building", "Demonstrations", "Mentorship"],
        decision: "What do I need to become ready?",
        action: "Build a grower readiness list.",
      },
      {
        label: "Participate",
        title: "Join The Food Movement",
        text: "The grower can supply produce, attend market activity, teach others, or join cooperative production opportunities.",
        points: ["Marketplace access", "Food distribution", "Community education", "Repeat growing cycles"],
        decision: "Am I ready to become part of the ecosystem?",
        action: "Request grower onboarding.",
      },
    ],
  },
  {
    key: "youth",
    nav: "Youth",
    title: "Youth Workforce Pathway",
    subtitle: "An 8-week summer journey of responsibility, outdoor work, life skills, and future readiness.",
    image: IMG.youth2,
    accent: "from-yellow-100 to-emerald-100",
    needMet: "Youth need structured work, caring supervision, skill-building, and visible progress.",
    benefit: "Youth build responsibility, confidence, teamwork, safety habits, and leadership.",
    destination: "Complete the summer experience with documented skills, supervisor feedback, and growth evidence.",
    share: "Youth can share progress with parents, guardians, supervisors, partners, and future employers.",
    steps: [
      {
        label: "Orient",
        title: "Enter With Safety And Purpose",
        text: "Youth begin with orientation, PPE expectations, media releases, daily rhythm, and clear worksite rules.",
        points: ["No PPE, no work", "Attendance expectations", "Team assignments", "Farm safety"],
        decision: "Am I ready to work safely and show up consistently?",
        action: "Complete orientation checklist.",
      },
      {
        label: "Work",
        title: "Learn By Doing Real Farm Tasks",
        text: "Youth participate in growing, watering, weeding, compost, setup, marketplace support, cleanup, and reflection.",
        points: ["Daily check-in", "Assigned tasks", "Skill practice", "Team communication"],
        decision: "What skill am I improving today?",
        action: "Log daily work and supervisor observation.",
      },
      {
        label: "Grow",
        title: "Build A Visible Record Of Progress",
        text: "The supervisor tracks attendance, PPE, participation, teamwork, skills, reflection, and milestone growth.",
        points: ["Badges", "Rubrics", "Life skills progression", "Parent connection"],
        decision: "What evidence shows that I am growing?",
        action: "Complete progress review.",
      },
    ],
  },
  {
    key: "customer",
    nav: "Customer",
    title: "Customer Pathway",
    subtitle: "Move from interest to healthy food choices, marketplace access, and repeat participation.",
    image: IMG.marketplaceHero,
    accent: "from-orange-100 to-emerald-100",
    needMet: "Families need fresh food, nutrition education, and simple ways to return.",
    benefit: "Customers can discover produce, seedlings, demonstrations, and food knowledge in one place.",
    destination: "Decide what to buy, learn, pre-order, share, or return for next.",
    share: "Share marketplace access with families, neighbors, and wellness partners.",
    steps: [
      {
        label: "Discover",
        title: "Find Food, Seedlings, And Support",
        text: "Customers see fresh produce, seedlings, Bubble Babies, demonstrations, wellness education, and practical food options.",
        points: ["Fresh produce", "Seedlings", "Nutrition", "Demonstrations"],
        decision: "What do I want to take home or learn today?",
        action: "Open marketplace options.",
      },
      {
        label: "Choose",
        title: "Make Healthy Repeat Choices",
        text: "The system supports repeat food decisions, seasonal education, and connection to future market dates.",
        points: ["Seasonal availability", "Pre-orders", "SNAP-aware shopping", "Cooking ideas"],
        decision: "What healthy choice can I repeat?",
        action: "Save or share marketplace access.",
      },
      {
        label: "Return",
        title: "Become Part Of The Customer Community",
        text: "Customers can return as shoppers, volunteers, growers, family supporters, or event participants.",
        points: ["Return visits", "Community events", "Feedback", "Family invitations"],
        decision: "How will I stay connected?",
        action: "Send feedback or join another pathway.",
      },
    ],
  },
  {
    key: "marketplace",
    nav: "Marketplace",
    title: "Marketplace Pathway",
    subtitle: "Convert interest into purchasing power, sustainability, and coordinated food movement.",
    image: IMG.seeds,
    accent: "from-lime-100 to-yellow-100",
    needMet: "The ecosystem needs a visible place where food, tools, education, and relationships move together.",
    benefit: "The marketplace becomes a destination for growers, customers, youth, partners, and community food access.",
    destination: "Decide what moves through the market: produce, seedlings, supplies, learning, sponsorship, or distribution.",
    share: "Share the marketplace with customers, vendors, growers, schools, and funders.",
    steps: [
      {
        label: "Connect",
        title: "Bring The Market Together",
        text: "The market connects growers, seedlings, food, supplies, demonstrations, nutrition, and community partners.",
        points: ["Vendors", "Growers", "Seedlings", "Food education"],
        decision: "What belongs in this market experience?",
        action: "Review marketplace categories.",
      },
      {
        label: "Operate",
        title: "Support Real Movement",
        text: "The marketplace is not just a display. It supports ordering, pickup, demos, check-in, engagement, and follow-up.",
        points: ["QR entry", "Orders", "Pickup", "Education", "Follow-up"],
        decision: "How does this market become sustainable?",
        action: "Select a marketplace action.",
      },
      {
        label: "Sustain",
        title: "Build Repeat Participation",
        text: "The system invites customers and growers back into recurring cycles of growing, buying, learning, and sharing.",
        points: ["Return customers", "Recurring growers", "Community data", "Sponsor visibility"],
        decision: "What should continue after the event?",
        action: "Share or sponsor the market.",
      },
    ],
  },
  {
    key: "partner",
    nav: "Partner",
    title: "Partner Pathway",
    subtitle: "Align resources, collaboration, visibility, and community benefit.",
    image: IMG.partners,
    accent: "from-sky-100 to-emerald-100",
    needMet: "Partners need clarity on where their resources fit and what benefit they help create.",
    benefit: "Partners see specific contribution lanes tied to outcomes, visibility, and community impact.",
    destination: "Decide whether to support youth, tools, food access, infrastructure, education, wellness, or sponsorship.",
    share: "Share the ecosystem with funders, agencies, churches, schools, businesses, and civic leaders.",
    steps: [
      {
        label: "Align",
        title: "Find The Right Contribution Lane",
        text: "Partners identify whether they support workforce, infrastructure, education, wellness, supplies, outreach, or funding.",
        points: ["Workforce", "Infrastructure", "Education", "Wellness", "Funding"],
        decision: "Which contribution matches our mission?",
        action: "Select a partner lane.",
      },
      {
        label: "Activate",
        title: "Make Support Visible And Useful",
        text: "Partner support becomes practical: fencing, compost, seeds, volunteers, training, media, food education, or youth support.",
        points: ["Donations", "Technical assistance", "In-kind support", "Program support"],
        decision: "What can we provide now?",
        action: "Submit partner interest.",
      },
      {
        label: "Strengthen",
        title: "Build A Mutually Beneficial Relationship",
        text: "The partnership continues through shared outcomes, reports, visibility, referrals, and future planning.",
        points: ["Reports", "Recognition", "Ongoing collaboration", "Shared outcomes"],
        decision: "How do we continue together?",
        action: "Schedule follow-up.",
      },
    ],
  },
  {
    key: "volunteer",
    nav: "Volunteer",
    title: "Volunteer Pathway",
    subtitle: "Turn willingness into useful work, community connection, and visible impact.",
