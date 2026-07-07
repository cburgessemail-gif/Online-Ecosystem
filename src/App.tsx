import React, { useMemo, useState } from 'react';

type Role = 'guest' | 'youth' | 'parent' | 'supervisor' | 'admin';
type Lang = 'en' | 'es' | 'fr' | 'ar' | 'he' | 'sw';
type View =
  | 'portal'
  | 'role'
  | 'dashboard'
  | 'start'
  | 'assignment'
  | 'resources'
  | 'workbook'
  | 'portfolio'
  | 'parent'
  | 'supervisor'
  | 'calendar'
  | 'reports'
  | 'guest';

type Activity = {
  id: string;
  title: string;
  priority: 'Required' | 'Choose if assigned' | 'Observation' | 'Low priority';
  location: string;
  time: string;
  tools: string[];
  steps: string[];
  evidence: string[];
  reflection: string[];
  layers: {
    self: string;
    work: string;
    environment: string;
    community: string;
    opportunity: string;
    legacy: string;
  };
};

type Resource = {
  id: string;
  title: string;
  category: string;
  summary: string;
  links: { label: string; url: string }[];
  keywords: string[];
};

type Youth = {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  pin: string;
  parent: string;
  last4: string;
  signedIn: boolean;
  ppe: boolean;
  mood: string;
  assignment: string;
  completed: boolean;
};

const languages: Record<Lang, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  he: 'עברית',
  sw: 'Kiswahili',
};

const t = (lang: Lang, key: string) => {
  const copy: Record<string, Record<Lang, string>> = {
    welcome: {
      en: 'Bronson Family Farm Cultivator Ecosystem',
      es: 'Ecosistema de Cultivadores de Bronson Family Farm',
      fr: 'Écosystème des cultivateurs de Bronson Family Farm',
      ar: 'نظام مزارعي مزرعة برونسون العائلية',
      he: 'מערכת המטפחים של Bronson Family Farm',
      sw: 'Mfumo wa Wakulima wa Bronson Family Farm',
    },
    startMyDay: {
      en: 'Start My Day',
      es: 'Comenzar mi día',
      fr: 'Commencer ma journée',
      ar: 'ابدأ يومي',
      he: 'התחל את היום שלי',
      sw: 'Anza Siku Yangu',
    },
    resources: {
      en: 'Resources',
      es: 'Recursos',
      fr: 'Ressources',
      ar: 'الموارد',
      he: 'משאבים',
      sw: 'Rasilimali',
    },
    workbook: {
      en: 'Workbook',
      es: 'Cuaderno de trabajo',
      fr: 'Cahier d’activités',
      ar: 'دفتر العمل',
      he: 'חוברת עבודה',
      sw: 'Kitabu cha kazi',
    },
    back: {
      en: 'Back',
      es: 'Atrás',
      fr: 'Retour',
      ar: 'رجوع',
      he: 'חזרה',
      sw: 'Rudi',
    },
    home: {
      en: 'Home',
      es: 'Inicio',
      fr: 'Accueil',
      ar: 'الرئيسية',
      he: 'בית',
      sw: 'Nyumbani',
    },
  };
  return copy[key]?.[lang] || copy[key]?.en || key;
};

const week5Activities: Activity[] = [
  {
    id: 'zone5-melons',
    title: 'Finish Zone 5 Melons',
    priority: 'Required',
    location: 'Zone 5, west of butterfly sanctuary',
    time: 'Morning work block',
    tools: ['Gloves', 'Hand shovel', 'Hoe', 'Mulch', 'Plant labels', 'Phone/camera for evidence'],
    steps: [
      'Stay inside the approved grow area and remain with your group.',
      'Remove weeds before placing supports or mulch.',
      'Confirm all melon plants are planted or positioned for vertical growing.',
      'Build mulch around rows and paths so youth can walk without stepping on plants.',
      'Do not water today because recent rain has already saturated the area.',
      'Take one photo of the finished section and one close-up of a healthy plant.',
    ],
    evidence: ['Before photo', 'After photo', 'One sentence explaining what changed'],
    reflection: [
      'What did you do to help the melons grow vertically?',
      'How did mulch help the plant, the path, or the soil?',
      'What should the next group check tomorrow?',
    ],
    layers: {
      self: 'I practiced focus, care, and finishing work that someone else can see.',
      work: 'I completed planting, weeding, and mulching in Zone 5.',
      environment: 'Mulch protects soil, slows runoff, and reduces weeds.',
      community: 'A stronger melon area can help feed families and teach visitors.',
      opportunity: 'This connects to farming, landscaping, food systems, and agritourism jobs.',
      legacy: 'The row I prepared can keep growing after I leave today.',
    },
  },
  {
    id: 'corn-seedlings',
    title: 'Plant Corn Seedlings',
    priority: 'Choose if assigned',
    location: 'Assigned grow zone',
    time: 'Morning work block',
    tools: ['Gloves', 'Hand shovel', 'Plant marker', 'Mulch'],
    steps: [
      'Confirm the planting location with a supervisor before digging.',
      'Separate seedlings carefully without tearing the roots.',
      'Plant seedlings at the assigned spacing.',
      'Press soil gently around the roots.',
      'Mulch lightly around the plant while keeping mulch away from the stem.',
      'Document the row with a photo and label.',
    ],
    evidence: ['Photo of planted seedling', 'Plant label or row note'],
    reflection: [
      'Why do roots need to stay protected?',
      'What could happen if seedlings are planted too close together?',
    ],
    layers: {
      self: 'I practiced patience and careful hands.',
      work: 'I planted seedlings correctly and documented the row.',
      environment: 'Healthy spacing helps plants use light, air, and soil nutrients.',
      community: 'Corn is a food crop that connects farms to family meals.',
      opportunity: 'This connects to crop production and agricultural science.',
      legacy: 'A seedling planted well can become food later.',
    },
  },
  {
    id: 'squash-pumpkin-area',
    title: 'Prepare Squash and Pumpkin Grow Area',
    priority: 'Required',
    location: 'Assigned squash/pumpkin area',
    time: 'Morning work block',
    tools: ['Gloves', 'Hoe', 'Hand shovel', 'Mulch', 'Scissors if assigned'],
    steps: [
      'Remove weeds and grass from the assigned area.',
      'Loosen the soil without disturbing nearby crop roots.',
      'Shape the grow area so water does not pool around the plants.',
      'Add mulch around rows and paths.',
      'Leave clear walking space so youth do not step on vines later.',
      'Record what is ready and what still needs work.',
    ],
    evidence: ['Photo of prepared area', 'Short note on soil or water condition'],
    reflection: [
      'Why do squash and pumpkin plants need space?',
      'How can paths protect plants?',
    ],
    layers: {
      self: 'I practiced planning before planting.',
      work: 'I prepared a grow area for future production.',
      environment: 'Good paths reduce soil compaction and plant damage.',
      community: 'Prepared beds can become food and learning spaces.',
      opportunity: 'This connects to farm planning, landscaping, and garden design.',
      legacy: 'A prepared area makes tomorrow’s work easier.',
    },
  },
  {
    id: 'gate-install',
    title: 'Install Gate',
    priority: 'Required',
    location: 'Assigned fence/gate area',
    time: 'Supervisor-led work block',
    tools: ['Gloves', 'Measuring tape', 'Post tools if assigned', 'Fasteners', 'Gate hardware'],
    steps: [
      'Only work on gate installation with direct supervisor instruction.',
      'Measure first; do not cut or fasten until the supervisor approves.',
      'Check that the gate opens and closes safely.',
      'Confirm the gate helps protect crops and directs foot traffic.',
      'Take a photo of the finished or partially finished gate.',
    ],
    evidence: ['Photo of gate area', 'Measurement or note about what was installed'],
    reflection: [
      'Why does a farm need gates?',
      'How does controlling entry protect people, plants, and the airport site?',
    ],
    layers: {
      self: 'I practiced safety and following instructions.',
      work: 'I helped build farm infrastructure.',
      environment: 'A gate helps protect planted areas and wildlife boundaries.',
      community: 'Safe access helps youth, visitors, parents, and supervisors.',
      opportunity: 'This connects to construction, maintenance, and site management.',
      legacy: 'A gate can serve the farm after this week ends.',
    },
  },
  {
    id: 'potatoes-check',
    title: 'Check Potatoes in Grow Basket',
    priority: 'Low priority',
    location: 'Potato grow basket',
    time: 'Short observation block',
    tools: ['Gloves', 'Camera', 'Notebook'],
    steps: [
      'Observe the potato basket without pulling plants out.',
      'Look for leaf health, moisture, pests, and crowding.',
      'Add notes only; do not water unless a supervisor says to water.',
      'Take one photo from above and one close-up if needed.',
    ],
    evidence: ['Photo of potato basket', 'Observation note'],
    reflection: ['What did the potato plants tell you about their condition today?'],
    layers: {
      self: 'I practiced observation before action.',
      work: 'I checked a lower-priority crop without disturbing it.',
      environment: 'Observation prevents overwatering and unnecessary disturbance.',
      community: 'Potatoes are a staple food crop.',
      opportunity: 'This connects to crop monitoring and food production.',
      legacy: 'Good notes help the next person know what changed.',
    },
  },
  {
    id: 'beehive-sterilize',
    title: 'Beehive Rebuild and Sterilization Check',
    priority: 'Choose if assigned',
    location: 'Beehive work area',
    time: 'Wednesday focus / assigned block',
    tools: ['Gloves', 'Eye protection', 'Drying area', 'Supervisor-approved chlorine solution only'],
    steps: [
      'Confirm the hive pieces were disassembled and wiped dry yesterday.',
      'Confirm pieces were placed in chlorine solution for 24 hours.',
      'Remove pieces only with supervisor direction.',
      'Set pieces out to dry fully before rebuilding.',
      'Do not touch face or clothing while handling sterilized pieces.',
      'Document the drying stage and any pieces that need attention.',
    ],
    evidence: ['Photo of drying hive pieces', 'Checklist note: soaked, rinsed if directed, drying, ready/not ready'],
    reflection: [
      'Why does hive equipment need to be sterilized?',
      'What safety steps protected you and the future bees?',
    ],
    layers: {
      self: 'I practiced safety, patience, and responsibility.',
      work: 'I helped prepare equipment for the apiary.',
      environment: 'Healthy hive equipment supports pollinators and crops.',
      community: 'Pollinators support food, flowers, and education.',
      opportunity: 'This connects to beekeeping, entomology, agriculture, and food systems.',
      legacy: 'A clean hive can become part of a long-term apiary.',
    },
  },
  {
    id: 'water-pooling',
    title: 'Observe Water Pooling and Build Mulch Protection',
    priority: 'Observation',
    location: 'Grow area and approved path only',
    time: 'After rain observation',
    tools: ['Gloves', 'Mulch', 'Camera', 'Notebook'],
    steps: [
      'Stay on approved paths and do not enter the forest today.',
      'Identify where water is pooling in the grow area or walking path.',
      'Add mulch where directed to protect paths and reduce muddy spots.',
      'Do not dig trenches unless a supervisor gives permission.',
      'Take before and after photos.',
    ],
    evidence: ['Before photo of pooling', 'After photo of mulch protection', 'One note about water movement'],
    reflection: [
      'Where did water collect?',
      'How can too much water affect crops or foot traffic?',
    ],
    layers: {
      self: 'I practiced noticing problems before they become bigger.',
      work: 'I helped protect the grow area after rain.',
      environment: 'Mulch can slow erosion and protect soil structure.',
      community: 'Safe paths help everyone move through the farm.',
      opportunity: 'This connects to conservation, drainage, and land management.',
      legacy: 'Fixing wet paths protects the site for future workdays.',
    },
  },
];

const resources: Resource[] = [
  {
    id: 'miracle-gro',
    title: 'Miracle-Gro / Plant Food Safety Search',
    category: 'Plant Nutrition',
    summary: 'Use this when youth need to learn what plant food is, what N-P-K means, and why supervisors control mixing and application.',
    keywords: ['miracle gro', 'fertilizer', 'plant food', 'npk', 'nitrogen', 'phosphorus', 'potassium'],
    links: [
      { label: 'Search: Miracle-Gro ingredients', url: 'https://www.google.com/search?q=Miracle-Gro+ingredients+NPK' },
      { label: 'Search: What does N-P-K mean?', url: 'https://www.google.com/search?q=what+does+NPK+mean+fertilizer' },
    ],
  },
  {
    id: 'mulch',
    title: 'Mulch, Soil Protection, and Wet Paths',
    category: 'Soil and Water',
    summary: 'Explains how mulch protects soil, reduces weeds, slows runoff, and helps create safer walking paths after rain.',
    keywords: ['mulch', 'water pooling', 'rain', 'soil', 'erosion', 'paths'],
    links: [
      { label: 'Search: mulch benefits garden paths', url: 'https://www.google.com/search?q=mulch+benefits+garden+paths+soil+erosion' },
    ],
  },
  {
    id: 'pollinators',
    title: 'Pollinators, Milkweed, Caterpillars, and Eggs',
    category: 'Pollinator Sanctuary',
    summary: 'Use for butterfly sanctuary observation, milkweed, monarch caterpillars, eggs, bees, and habitat protection.',
    keywords: ['pollinator', 'milkweed', 'butterfly', 'caterpillar', 'eggs', 'monarch', 'bees'],
    links: [
      { label: 'Search: monarch eggs on milkweed', url: 'https://www.google.com/search?q=monarch+eggs+on+milkweed+identification' },
      { label: 'Search: pollinator habitat youth garden', url: 'https://www.google.com/search?q=pollinator+habitat+youth+garden' },
    ],
  },
  {
    id: 'beehive',
    title: 'Beehive Rebuild and Sterilization',
    category: 'Apiary',
    summary: 'Supports the beehive project: cleaning, drying, safe handling, equipment rebuilding, and pollinator career pathways.',
    keywords: ['beehive', 'hive', 'sterilize', 'chlorine', 'apiary', 'beekeeper', 'bees'],
    links: [
      { label: 'Search: beehive equipment cleaning safety', url: 'https://www.google.com/search?q=beehive+equipment+cleaning+safety' },
      { label: 'Search: careers in beekeeping', url: 'https://www.google.com/search?q=careers+in+beekeeping+entomology+agriculture' },
    ],
  },
  {
    id: 'companion',
    title: 'Companion Planting',
    category: 'Grow Planning',
    summary: 'Helps youth understand why crops, herbs, flowers, and pollinator plants may be placed near each other.',
    keywords: ['companion planting', 'herbs', 'flowers', 'vegetables', 'pests'],
    links: [{ label: 'Search: companion planting guide vegetables flowers', url: 'https://www.google.com/search?q=companion+planting+guide+vegetables+flowers' }],
  },
  {
    id: 'careers',
    title: 'Career Pathways from Farm Work',
    category: 'Opportunity',
    summary: 'Connects daily farm tasks to careers: farmer, landscaper, carpenter, nurse, scientist, teacher, food entrepreneur, and agritourism operator.',
    keywords: ['career', 'jobs', 'opportunity', 'agriculture', 'landscape', 'construction', 'science', 'teacher'],
    links: [
      { label: 'Search: agricultural careers for youth', url: 'https://www.google.com/search?q=agricultural+careers+for+youth' },
      { label: 'Search: Youngstown agricultural training programs', url: 'https://www.google.com/search?q=Youngstown+Ohio+agriculture+workforce+training+programs' },
    ],
  },
];

const initialYouth: Youth[] = [
  { id: 'y1', name: 'Youth 1', status: 'Active', pin: '1001', parent: 'Parent/Guardian needed', last4: '0001', signedIn: false, ppe: false, mood: '', assignment: 'zone5-melons', completed: false },
  { id: 'y2', name: 'Youth 2', status: 'Active', pin: '1002', parent: 'Parent/Guardian needed', last4: '0002', signedIn: false, ppe: false, mood: '', assignment: 'squash-pumpkin-area', completed: false },
  { id: 'y3', name: 'Youth 3', status: 'Inactive', pin: '1003', parent: 'Historical record only', last4: '0003', signedIn: false, ppe: false, mood: '', assignment: '', completed: false },
];

function getProgramDay(now = new Date()) {
  const start = new Date('2026-06-08T00:00:00');
  const ms = now.getTime() - start.getTime();
  const day = Math.max(0, Math.floor(ms / 86400000));
  const week = Math.floor(day / 7) + 1;
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    week,
    dayName: names[now.getDay()],
    dateLabel: now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  };
}

const SectionCard = ({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) => (
  <section className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
    <div className="mb-3 flex items-start justify-between gap-3">
      <h2 className="text-xl font-bold text-green-950">{title}</h2>
      {right}
    </div>
    {children}
  </section>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-900">{children}</span>
);

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [role, setRole] = useState<Role>('youth');
  const [view, setView] = useState<View>('dashboard');
  const [history, setHistory] = useState<View[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('zone5-melons');
  const [resourceSearch, setResourceSearch] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [youth, setYouth] = useState<Youth[]>(initialYouth);
  const [notice, setNotice] = useState('No watering today due to recent rain. Stay out of the forest today unless a supervisor changes the plan.');

  const programDay = useMemo(() => getProgramDay(), []);
  const activeActivity = week5Activities.find((a) => a.id === selectedActivity) || week5Activities[0];
  const isRTL = lang === 'ar' || lang === 'he';

  const go = (next: View) => {
    setHistory((h) => [...h, view]);
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setHistory((h) => {
      const copy = [...h];
      const prior = copy.pop() || 'dashboard';
      setView(prior);
      return copy;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredResources = resources.filter((r) => {
    const q = resourceSearch.trim().toLowerCase();
    if (!q) return true;
    return [r.title, r.category, r.summary, ...r.keywords].join(' ').toLowerCase().includes(q);
  });

  const saveAnswer = (key: string, value: string) => setAnswers((prev) => ({ ...prev, [key]: value }));

  const updateYouth = (id: string, patch: Partial<Youth>) => {
    setYouth((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const Header = () => (
    <header className="sticky top-0 z-20 border-b border-green-200 bg-green-950 text-white shadow">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-black tracking-tight">{t(lang, 'welcome')}</div>
          <div className="text-sm text-green-100">Master Launch Replacement 14.0 · Curriculum opens first · Week {programDay.week} · {programDay.dateLabel}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="rounded-xl border border-green-700 bg-white px-3 py-2 text-sm text-green-950">
            {Object.entries(languages).map(([code, label]) => <option key={code} value={code}>{label}</option>)}
          </select>
          {view !== 'dashboard' && <button onClick={() => go('dashboard')} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-green-950">{t(lang, 'home')}</button>}
          <button onClick={() => go('role')} className="rounded-xl bg-green-800 px-3 py-2 text-sm font-bold">Switch Role</button>
          {history.length > 0 && <button onClick={back} className="rounded-xl bg-green-800 px-3 py-2 text-sm font-bold">{t(lang, 'back')}</button>}
        </div>
      </div>
    </header>
  );

  const Portal = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <SectionCard title="Restored Portal">
        <p className="mb-4 text-green-950">Choose the correct doorway first. This prevents youth, parents, supervisors, and guests from being sent to the wrong screen.</p>
        <div className="grid gap-3 md:grid-cols-3">
          <button onClick={() => go('role')} className="rounded-2xl bg-green-700 p-5 text-left font-bold text-white shadow">Returning User<br /><span className="text-sm font-normal">Continue with role selection</span></button>
          <button onClick={() => go('role')} className="rounded-2xl bg-lime-600 p-5 text-left font-bold text-green-950 shadow">New User<br /><span className="text-sm font-normal">Register and validate role</span></button>
          <button onClick={() => { setRole('guest'); go('guest'); }} className="rounded-2xl bg-amber-100 p-5 text-left font-bold text-amber-950 shadow">Guest Journey<br /><span className="text-sm font-normal">View public farm story</span></button>
        </div>
      </SectionCard>
      <SectionCard title="Launch Notice">
        <p className="rounded-xl bg-yellow-50 p-4 text-yellow-950">{notice}</p>
      </SectionCard>
    </main>
  );

  const RoleSelect = () => (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <SectionCard title="Select Your Role">
        <div className="grid gap-3 md:grid-cols-4">
          {(['youth', 'parent', 'supervisor', 'admin'] as Role[]).map((r) => (
            <button key={r} onClick={() => { setRole(r); go(r === 'parent' ? 'parent' : r === 'supervisor' || r === 'admin' ? 'supervisor' : 'dashboard'); }} className="rounded-2xl border border-green-200 bg-white p-5 text-left shadow hover:bg-green-50">
              <div className="text-lg font-black capitalize text-green-950">{r}</div>
              <p className="text-sm text-green-800">Open the correct dashboard.</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </main>
  );

  const Dashboard = () => (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
      <section className="rounded-3xl bg-gradient-to-br from-green-900 to-green-700 p-6 text-white shadow">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-green-100">Current curriculum slice</p>
            <h1 className="text-3xl font-black">Week 5: Restore, Weed, Plant, Mulch, Document</h1>
            <p className="mt-2 max-w-3xl text-green-50">Youth see only what they need for today, but can still return to resources, workbook, portfolio, and prior work.</p>
          </div>
          <Pill>{role.toUpperCase()}</Pill>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <button onClick={() => go('start')} className="rounded-2xl bg-lime-500 p-5 text-left font-black text-green-950 shadow">{t(lang, 'startMyDay')}</button>
        <button onClick={() => go('assignment')} className="rounded-2xl bg-white p-5 text-left font-black text-green-950 shadow">Today’s Project</button>
        <button onClick={() => go('resources')} className="rounded-2xl bg-white p-5 text-left font-black text-green-950 shadow">{t(lang, 'resources')}</button>
        <button onClick={() => go('workbook')} className="rounded-2xl bg-white p-5 text-left font-black text-green-950 shadow">{t(lang, 'workbook')}</button>
        <button onClick={() => go('portfolio')} className="rounded-2xl bg-white p-5 text-left font-black text-green-950 shadow">Portfolio</button>
        <button onClick={() => go('calendar')} className="rounded-2xl bg-white p-5 text-left font-black text-green-950 shadow">Calendar</button>
        <button onClick={() => go('parent')} className="rounded-2xl bg-white p-5 text-left font-black text-green-950 shadow">Parent Portal</button>
        <button onClick={() => go('supervisor')} className="rounded-2xl bg-white p-5 text-left font-black text-green-950 shadow">Supervisor</button>
      </div>

      <SectionCard title="Today’s Assignments">
        <div className="grid gap-3 md:grid-cols-2">
          {week5Activities.map((a) => (
            <button key={a.id} onClick={() => { setSelectedActivity(a.id); go('assignment'); }} className="rounded-2xl border border-green-200 p-4 text-left hover:bg-green-50">
              <div className="flex items-center justify-between gap-3"><h3 className="font-black text-green-950">{a.title}</h3><Pill>{a.priority}</Pill></div>
              <p className="mt-1 text-sm text-green-800">{a.location}</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </main>
  );

  const StartMyDay = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <SectionCard title="Start My Day: One Screen, No Hidden Steps">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-green-50 p-4">
            <h3 className="font-black text-green-950">1. Safety Check</h3>
            <label className="mt-3 flex gap-2"><input type="checkbox" /> I am with my group and know today’s approved work area.</label>
            <label className="mt-2 flex gap-2"><input type="checkbox" /> I understand we are not watering because of recent rain.</label>
            <label className="mt-2 flex gap-2"><input type="checkbox" /> I will not enter the forest today unless directed by a supervisor.</label>
          </div>
          <div className="rounded-2xl bg-green-50 p-4">
            <h3 className="font-black text-green-950">2. PPE Check</h3>
            <label className="mt-3 flex gap-2"><input type="checkbox" /> Gloves</label>
            <label className="mt-2 flex gap-2"><input type="checkbox" /> Closed-toe shoes</label>
            <label className="mt-2 flex gap-2"><input type="checkbox" /> Water bottle</label>
            <label className="mt-2 flex gap-2"><input type="checkbox" /> Sun/rain protection as needed</label>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="3. Choose or Confirm Assignment">
        <select value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)} className="w-full rounded-xl border border-green-300 p-3">
          {week5Activities.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => go('assignment')} className="rounded-xl bg-green-700 px-4 py-3 font-bold text-white">Open Assignment</button>
          <button onClick={() => go('resources')} className="rounded-xl bg-white px-4 py-3 font-bold text-green-950 shadow">Search Resources</button>
          <button onClick={() => go('workbook')} className="rounded-xl bg-white px-4 py-3 font-bold text-green-950 shadow">Answer Workbook</button>
        </div>
      </SectionCard>
    </main>
  );

  const Assignment = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <SectionCard title={activeActivity.title} right={<Pill>{activeActivity.priority}</Pill>}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-green-50 p-4"><b>Location:</b><br />{activeActivity.location}</div>
          <div className="rounded-xl bg-green-50 p-4"><b>Time:</b><br />{activeActivity.time}</div>
          <div className="rounded-xl bg-green-50 p-4"><b>Evidence:</b><br />{activeActivity.evidence.join(', ')}</div>
        </div>
      </SectionCard>
      <SectionCard title="Tools">
        <ul className="list-disc space-y-1 pl-6">{activeActivity.tools.map((item) => <li key={item}>{item}</li>)}</ul>
      </SectionCard>
      <SectionCard title="Steps">
        <ol className="list-decimal space-y-2 pl-6">{activeActivity.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </SectionCard>
      <SectionCard title="Self → Work → Environment → Community → Opportunity → Legacy">
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(activeActivity.layers).map(([k, v]) => <div key={k} className="rounded-xl border border-green-100 p-3"><b className="capitalize text-green-950">{k}</b><p>{v}</p></div>)}
        </div>
      </SectionCard>
      <SectionCard title="Answer and Upload Evidence Here">
        {activeActivity.reflection.map((q, index) => {
          const key = `${activeActivity.id}-${index}`;
          return <label key={key} className="mb-4 block"><span className="font-bold text-green-950">{q}</span><textarea value={answers[key] || ''} onChange={(e) => saveAnswer(key, e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-green-300 p-3" placeholder="Type your answer here." /></label>;
        })}
        <input type="file" multiple className="w-full rounded-xl border border-dashed border-green-300 p-4" />
        <button onClick={() => go('workbook')} className="mt-4 rounded-xl bg-green-700 px-4 py-3 font-bold text-white">Save to Workbook</button>
      </SectionCard>
    </main>
  );

  const Resources = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <SectionCard title="Searchable Resource Library">
        <input value={resourceSearch} onChange={(e) => setResourceSearch(e.target.value)} placeholder="Search Miracle Gro, mulch, beehive, pollinators, careers..." className="w-full rounded-xl border border-green-300 p-3" />
        <p className="mt-2 text-sm text-green-800">Youth can search, open a resource, and return without losing their place.</p>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2">
        {filteredResources.map((r) => <SectionCard key={r.id} title={r.title} right={<Pill>{r.category}</Pill>}>
          <p>{r.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">{r.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="rounded-xl bg-green-700 px-3 py-2 text-sm font-bold text-white">{l.label}</a>)}</div>
        </SectionCard>)}
      </div>
    </main>
  );

  const Workbook = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <SectionCard title="Professional Workbook: Visible, Answerable, Download-Ready">
        <p>No endless next buttons. No hidden workbook. Each activity has the question, answer box, upload, and save area together.</p>
      </SectionCard>
      {week5Activities.map((a) => <SectionCard key={a.id} title={a.title} right={<button onClick={() => { setSelectedActivity(a.id); go('assignment'); }} className="rounded-xl bg-green-700 px-3 py-2 text-sm font-bold text-white">Open</button>}>
        {a.reflection.map((q, index) => {
          const key = `${a.id}-${index}`;
          return <label key={key} className="mb-3 block"><span className="font-bold text-green-950">{q}</span><textarea value={answers[key] || ''} onChange={(e) => saveAnswer(key, e.target.value)} className="mt-2 min-h-20 w-full rounded-xl border border-green-300 p-3" /></label>;
        })}
        <input type="file" multiple className="w-full rounded-xl border border-dashed border-green-300 p-3" />
      </SectionCard>)}
    </main>
  );

  const Portfolio = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <SectionCard title="Portfolio Builder">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-green-50 p-4"><b>Skills Captured</b><p>Planting, weeding, mulching, observation, documentation, safety, teamwork, communication.</p></div>
          <div className="rounded-xl bg-green-50 p-4"><b>Career Pathways</b><p>Agriculture, landscaping, construction, beekeeping, entomology, environmental science, food entrepreneurship.</p></div>
          <div className="rounded-xl bg-green-50 p-4"><b>Evidence</b><p>Photos, written answers, supervisor notes, activity completion, parent-visible progress.</p></div>
          <div className="rounded-xl bg-green-50 p-4"><b>Download</b><p>Connect this section to PDF export when backend/export service is available.</p></div>
        </div>
      </SectionCard>
    </main>
  );

  const ParentPortal = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <SectionCard title="Parent Portal Daily Message">
        <textarea value={notice} onChange={(e) => setNotice(e.target.value)} className="min-h-28 w-full rounded-xl border border-green-300 p-3" />
      </SectionCard>
      <SectionCard title="What My Youth Is Doing Today">
        <ul className="list-disc space-y-2 pl-6">
          <li>No watering today because rain has saturated parts of the grow area.</li>
          <li>Youth are weeding, thinning, planting corn seedlings, finishing Zone 5 melons, preparing squash/pumpkin area, building mulch paths, checking potatoes, and installing the gate if assigned.</li>
          <li>Beehive pieces are being sterilized during the rebuild process and set out to dry.</li>
        </ul>
      </SectionCard>
    </main>
  );

  const Supervisor = () => (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
      <SectionCard title="Supervisor Dashboard">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead><tr className="bg-green-100 text-green-950"><th className="p-3">Youth</th><th className="p-3">Status</th><th className="p-3">PIN</th><th className="p-3">Parent</th><th className="p-3">Signed In</th><th className="p-3">PPE</th><th className="p-3">Assignment</th><th className="p-3">Complete</th></tr></thead>
            <tbody>{youth.map((y) => <tr key={y.id} className="border-b border-green-100">
              <td className="p-3"><input value={y.name} onChange={(e) => updateYouth(y.id, { name: e.target.value })} className="w-full rounded border p-2" /></td>
              <td className="p-3"><select value={y.status} onChange={(e) => updateYouth(y.id, { status: e.target.value as Youth['status'] })} className="rounded border p-2"><option>Active</option><option>Inactive</option></select></td>
              <td className="p-3"><input value={y.pin} onChange={(e) => updateYouth(y.id, { pin: e.target.value })} className="w-24 rounded border p-2" /></td>
              <td className="p-3"><input value={y.parent} onChange={(e) => updateYouth(y.id, { parent: e.target.value })} className="w-full rounded border p-2" /></td>
              <td className="p-3"><input type="checkbox" checked={y.signedIn} onChange={(e) => updateYouth(y.id, { signedIn: e.target.checked })} disabled={y.status === 'Inactive'} /></td>
              <td className="p-3"><input type="checkbox" checked={y.ppe} onChange={(e) => updateYouth(y.id, { ppe: e.target.checked })} disabled={y.status === 'Inactive'} /></td>
              <td className="p-3"><select value={y.assignment} onChange={(e) => updateYouth(y.id, { assignment: e.target.value })} disabled={y.status === 'Inactive'} className="rounded border p-2">{week5Activities.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}</select></td>
              <td className="p-3"><input type="checkbox" checked={y.completed} onChange={(e) => updateYouth(y.id, { completed: e.target.checked })} disabled={y.status === 'Inactive'} /></td>
            </tr>)}</tbody>
          </table>
        </div>
        <button onClick={() => setYouth((rows) => [...rows, { id: `y${rows.length + 1}`, name: 'New Youth', status: 'Active', pin: '', parent: '', last4: '', signedIn: false, ppe: false, mood: '', assignment: 'zone5-melons', completed: false }])} className="mt-4 rounded-xl bg-green-700 px-4 py-3 font-bold text-white">Add Youth</button>
      </SectionCard>
      <SectionCard title="Incident / Observation Notes">
        <textarea className="min-h-32 w-full rounded-xl border border-green-300 p-3" placeholder="Document safety, weather, pooling water, boundary, pest, or behavior notes here." />
      </SectionCard>
    </main>
  );

  const Calendar = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <SectionCard title="Calendar Engine">
        <p className="mb-4">The app calculates the program week from June 8, 2026 and advances automatically. The current computed week is <b>Week {programDay.week}</b>.</p>
        <div className="grid gap-3 md:grid-cols-5">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => <div key={d} className={`rounded-xl border p-4 ${d === programDay.dayName ? 'border-green-700 bg-green-100' : 'border-green-200 bg-white'}`}>
            <b>{d}</b>
            <p className="text-sm text-green-800">Week 5 curriculum card</p>
          </div>)}
        </div>
      </SectionCard>
    </main>
  );

  const Reports = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6"><SectionCard title="Reports"><p>Attendance, completion, workbook, parent, supervisor, and portfolio reports should all draw from the same saved evidence.</p></SectionCard></main>
  );

  const Guest = () => (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6"><SectionCard title="Guest Journey"><p>Welcome to Bronson Family Farm. Guests can learn about the farm, youth workforce, pollinator sanctuary, future tourism, recreation, camping, and zero-waste vision without accessing private youth data.</p><button onClick={() => go('role')} className="mt-4 rounded-xl bg-green-700 px-4 py-3 font-bold text-white">I am a returning user</button></SectionCard></main>
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-green-50 to-white text-green-950">
      <Header />
      {view === 'portal' && <Portal />}
      {view === 'role' && <RoleSelect />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'start' && <StartMyDay />}
      {view === 'assignment' && <Assignment />}
      {view === 'resources' && <Resources />}
      {view === 'workbook' && <Workbook />}
      {view === 'portfolio' && <Portfolio />}
      {view === 'parent' && <ParentPortal />}
      {view === 'supervisor' && <Supervisor />}
      {view === 'calendar' && <Calendar />}
      {view === 'reports' && <Reports />}
      {view === 'guest' && <Guest />}
      <footer className="mx-auto max-w-7xl px-4 py-8 text-sm text-green-800">
        Bronson Family Farm Cultivator Ecosystem · Master Launch Replacement 14.0 · Curriculum-centered stabilization release
      </footer>
    </div>
  );
}
