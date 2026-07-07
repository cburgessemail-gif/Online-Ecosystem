import React, { useMemo, useState } from 'react';
import './App.css';

type SectionKey = 'today' | 'resources' | 'workbook' | 'portfolio' | 'parent' | 'supervisor' | 'calendar';
type RoleKey = 'Youth' | 'Parent' | 'Supervisor' | 'Guest';

type Assignment = {
  title: string;
  location: string;
  priority: 'Required' | 'Choose if assigned' | 'Low priority';
  bullets: string[];
  self: string;
  work: string;
  environment: string;
  community: string;
  opportunity: string;
  legacy: string;
  evidence: string;
};

type Resource = {
  title: string;
  keywords: string[];
  summary: string;
  linkText: string;
  url: string;
};

const TODAY = {
  title: 'Today at Bronson Family Farm',
  date: 'Tuesday, July 7, 2026',
  week: 'Week 5',
  subtitle: 'Restore, Weed, Plant, Mulch, Document',
  notice:
    'No watering today because of recent rain. Stay out of the forest today unless a supervisor changes the plan. Watch for pooling water in the grow area and on paths.',
  weather: 'Rain-soaked ground. Humid conditions. Move carefully. No unnecessary watering.',
};

const assignments: Assignment[] = [
  {
    title: 'Finish Zone 5 Melons',
    location: 'Zone 5, west of the butterfly sanctuary',
    priority: 'Required',
    bullets: [
      'Confirm all melon seedlings are planted.',
      'Keep paths clear so youth do not step into planting rows.',
      'Use mulch to protect rows and reduce mud.',
      'Document what is finished and what still needs support.',
    ],
    self: 'Practice patience, careful movement, and finishing what was started.',
    work: 'Complete melon planting and protect the vertical melon area.',
    environment: 'Mulch reduces splashing, compaction, and runoff after rain.',
    community: 'A finished melon zone can become food, learning, and pride for families.',
    opportunity: 'Connects to produce farming, irrigation planning, farm design, and food business.',
    legacy: 'This work leaves a growing food area that future youth can maintain and harvest.',
    evidence: 'Photo of finished melon rows or a written note describing what was completed.',
  },
  {
    title: 'Plant Corn Seedlings',
    location: 'Assigned grow zone',
    priority: 'Choose if assigned',
    bullets: [
      'Handle seedlings gently by the soil, not the stem.',
      'Plant at supervisor-approved spacing.',
      'Firm soil around roots without crushing the plant.',
      'Add mulch only where it helps protect soil and paths.',
    ],
    self: 'Practice responsibility with living plants.',
    work: 'Move corn seedlings into the grow area.',
    environment: 'Healthy roots help stabilize soil and support future growth.',
    community: 'Corn connects farm work to food traditions and shared meals.',
    opportunity: 'Connects to crop science, food systems, seedling production, and agribusiness.',
    legacy: 'Each seedling becomes part of the farm record youth can point back to.',
    evidence: 'Photo of planted seedlings or count of seedlings planted.',
  },
  {
    title: 'Prepare Squash and Pumpkin Grow Area',
    location: 'Assigned squash and pumpkin area',
    priority: 'Required',
    bullets: [
      'Clear weeds and debris from the assigned area.',
      'Separate useful plants from weeds when a supervisor identifies them.',
      'Shape rows and walking paths so youth know where to step.',
      'Use mulch to protect soil from pooling and mud.',
    ],
    self: 'Practice seeing order in a messy area.',
    work: 'Prepare a clear, safe growing space for squash and pumpkins.',
    environment: 'Good paths reduce trampling and protect soil structure.',
    community: 'Squash and pumpkins can support food, events, and seasonal learning.',
    opportunity: 'Connects to horticulture, landscaping, site preparation, and farm operations.',
    legacy: 'A prepared area gives the next group a stronger starting point.',
    evidence: 'Before and after photo, or written description of what changed.',
  },
  {
    title: 'Install Gate',
    location: 'Assigned fence or gate area',
    priority: 'Required',
    bullets: [
      'Work only under supervisor direction.',
      'Keep tools organized and away from walking paths.',
      'Check that the gate opens, closes, and does not block safe movement.',
      'Document what was installed or what still needs materials.',
    ],
    self: 'Practice teamwork and listening before using tools.',
    work: 'Improve farm access and safety through gate installation.',
    environment: 'A good gate helps protect growing areas from unnecessary disturbance.',
    community: 'Safe entry points help youth, visitors, and supervisors move responsibly.',
    opportunity: 'Connects to construction, fencing, landscaping, and site operations.',
    legacy: 'A working gate becomes permanent infrastructure for the farm.',
    evidence: 'Photo of gate area or note explaining installation status.',
  },
  {
    title: 'Check Potatoes in Grow Basket',
    location: 'Potato grow basket',
    priority: 'Low priority',
    bullets: [
      'Observe plant condition without disturbing roots unnecessarily.',
      'Check whether soil or mulch needs support after rain.',
      'Record plant height, color, and any concerns.',
      'Do not make potatoes the main priority today.',
    ],
    self: 'Practice observation without rushing to interfere.',
    work: 'Check potato health and note what is needed later.',
    environment: 'Container growing shows another way to produce food in limited space.',
    community: 'Small-space growing can be used at home, school, or community sites.',
    opportunity: 'Connects to container gardening, urban farming, and food access work.',
    legacy: 'The record helps youth compare growth over time.',
    evidence: 'Photo or short observation note.',
  },
  {
    title: 'Beehive Rebuild and Sterilization Check',
    location: 'Beehive work area',
    priority: 'Choose if assigned',
    bullets: [
      'Confirm pieces were disassembled and wiped dry yesterday.',
      'Confirm the 24-hour chlorine solution soak is complete when ready.',
      'Set pieces out to dry before rebuild continues.',
      'Document condition of pieces before reassembly.',
    ],
    self: 'Practice careful handling and respect for a future pollinator home.',
    work: 'Support safe beehive rebuild and sterilization.',
    environment: 'A clean hive supports future pollinator health.',
    community: 'Pollinators support food, flowers, education, and the farm story.',
    opportunity: 'Connects to beekeeping, entomology, agriculture, sanitation, and ecology.',
    legacy: 'A properly prepared hive can support pollination for years.',
    evidence: 'Photo of drying pieces or checklist note from supervisor.',
  },
  {
    title: 'Build Mulch Around Rows and Paths',
    location: 'Grow rows, paths, and pooling areas',
    priority: 'Required',
    bullets: [
      'Use mulch where water gathers or mud makes walking unsafe.',
      'Keep mulch out of plant crowns and stems unless directed.',
      'Build clear walking paths so rows are protected.',
      'Record where pooling water is seen.',
    ],
    self: 'Practice problem-solving with what the farm already has.',
    work: 'Use mulch to stabilize rows and paths after rain.',
    environment: 'Mulch helps reduce erosion, mud, and soil splash.',
    community: 'Safer paths help everyone move through the grow area.',
    opportunity: 'Connects to conservation, landscaping, stormwater work, and regenerative farming.',
    legacy: 'Better paths protect future crops and future workers.',
    evidence: 'Photo of mulched row/path or written location of pooling water.',
  },
  {
    title: 'Pest Trap and Butterfly Survey',
    location: 'Grow area and butterfly sanctuary edge',
    priority: 'Choose if assigned',
    bullets: [
      'Check pest traps without touching unknown insects unless directed.',
      'Look for butterfly eggs or caterpillars on host plants.',
      'Do not remove eggs or caterpillars without supervisor approval.',
      'Record what was observed and where.',
    ],
    self: 'Practice slowing down enough to notice small living things.',
    work: 'Observe pest pressure and pollinator activity.',
    environment: 'Observation helps protect beneficial insects while managing pests.',
    community: 'A healthy sanctuary supports education, beauty, and food production.',
    opportunity: 'Connects to ecology, entomology, environmental education, and farm scouting.',
    legacy: 'Today’s observations become part of the farm’s living record.',
    evidence: 'Photo or written observation with location.',
  },
];

const resources: Resource[] = [
  {
    title: 'Miracle-Gro / Plant Food Safety',
    keywords: ['miracle gro', 'fertilizer', 'plant food', 'nutrients'],
    summary: 'Use only with supervisor direction. Youth should know what fertilizer is, why plants need nutrients, and why overuse can harm plants and soil.',
    linkText: 'Open plant food guidance',
    url: 'https://www.miraclegro.com/en-us',
  },
  {
    title: 'Mulching After Rain',
    keywords: ['mulch', 'mud', 'water pooling', 'paths', 'rain'],
    summary: 'Mulch can reduce mud, protect soil, and make walking paths clearer after rain. Keep mulch away from plant crowns unless directed.',
    linkText: 'Open mulching resource',
    url: 'https://extension.umn.edu/planting-and-growing-guides/mulching-landscape-plants',
  },
  {
    title: 'Pollinators and Butterfly Eggs',
    keywords: ['pollinator', 'butterfly', 'caterpillar', 'eggs', 'milkweed'],
    summary: 'Butterfly eggs and caterpillars are small. Observe carefully before touching or removing anything from host plants.',
    linkText: 'Open pollinator resource',
    url: 'https://www.fs.usda.gov/managing-land/wildflowers/pollinators',
  },
  {
    title: 'Beehive Cleaning and Rebuild',
    keywords: ['beehive', 'hive', 'bees', 'sterilize', 'chlorine'],
    summary: 'Hive parts should be cleaned, sterilized as directed, dried, inspected, and reassembled under supervision.',
    linkText: 'Open beekeeping resource',
    url: 'https://extension.psu.edu/beekeeping',
  },
  {
    title: 'Companion Planting',
    keywords: ['companion planting', 'squash', 'pumpkin', 'corn', 'melons'],
    summary: 'Companion planting helps youth understand plant relationships, spacing, pests, pollinators, and crop planning.',
    linkText: 'Open companion planting resource',
    url: 'https://extension.umn.edu/planting-and-growing-guides/companion-planting-home-gardens',
  },
  {
    title: 'Career Pathways',
    keywords: ['career', 'job', 'opportunity', 'resume', 'skills'],
    summary: 'Today’s work connects to agriculture, construction, ecology, landscaping, food systems, environmental education, and entrepreneurship.',
    linkText: 'Open career resource',
    url: 'https://www.onetonline.org/find/career?c=1',
  },
];

const tabs: { key: SectionKey; label: string }[] = [
  { key: 'today', label: 'Today / Start My Day' },
  { key: 'resources', label: 'Resource Search' },
  { key: 'workbook', label: 'Workbook' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'parent', label: 'Parent Portal' },
  { key: 'supervisor', label: 'Supervisor Tools' },
];

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="pill">{children}</span>;
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea placeholder={placeholder || 'Type here...'} rows={3} />
    </label>
  );
}

function AssignmentCard({ item }: { item: Assignment }) {
  return (
    <article className="assignment-card" id={item.title.toLowerCase().replaceAll(' ', '-')}> 
      <div className="card-top">
        <div>
          <h3>{item.title}</h3>
          <p className="muted">{item.location}</p>
        </div>
        <Pill>{item.priority}</Pill>
      </div>
      <h4>What to do</h4>
      <ul>{item.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      <div className="six-grid">
        <div><strong>Self</strong><p>{item.self}</p></div>
        <div><strong>Work</strong><p>{item.work}</p></div>
        <div><strong>Environment</strong><p>{item.environment}</p></div>
        <div><strong>Community</strong><p>{item.community}</p></div>
        <div><strong>Opportunity</strong><p>{item.opportunity}</p></div>
        <div><strong>Legacy</strong><p>{item.legacy}</p></div>
      </div>
      <div className="evidence-box">
        <strong>Evidence:</strong> {item.evidence}
        <input type="file" aria-label={`Upload evidence for ${item.title}`} />
      </div>
      <Field label="Youth note for this assignment" placeholder="What did you do, notice, build, plant, or fix?" />
    </article>
  );
}

export default function App() {
  const [section, setSection] = useState<SectionKey>('today');
  const [role, setRole] = useState<RoleKey>('Youth');
  const [query, setQuery] = useState('');

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter((r) =>
      [r.title, r.summary, ...r.keywords].join(' ').toLowerCase().includes(q)
    );
  }, [query]);

  const jump = (key: SectionKey) => {
    setSection(key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Bronson Family Farm Cultivator Ecosystem</h1>
          <p>Master Launch Replacement 14.0 · Curriculum opens first · {TODAY.week} · {TODAY.date}</p>
        </div>
        <div className="top-actions">
          <select aria-label="Language">
            <option>English</option>
            <option>Spanish</option>
            <option>Arabic</option>
            <option>Hebrew</option>
            <option>French</option>
            <option>Swahili</option>
          </select>
          <select aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as RoleKey)}>
            <option>Youth</option>
            <option>Parent</option>
            <option>Supervisor</option>
            <option>Guest</option>
          </select>
        </div>
      </header>

      <section className="today-hero">
        <p className="eyebrow">{TODAY.week} · {TODAY.date}</p>
        <h2>{TODAY.title}</h2>
        <h3>{TODAY.subtitle}</h3>
        <p>{TODAY.notice}</p>
        <div className="quick-row">
          <Pill>Role: {role}</Pill>
          <Pill>{TODAY.weather}</Pill>
          <Pill>Workbook visible today</Pill>
          <Pill>Resources searchable</Pill>
        </div>
      </section>

      <nav className="tab-grid" aria-label="Main navigation">
        {tabs.map((tab) => (
          <button key={tab.key} className={section === tab.key ? 'active' : ''} onClick={() => jump(tab.key)}>
            {tab.label}
          </button>
        ))}
      </nav>

      {section === 'today' && (
        <section className="panel">
          <div className="panel-heading">
            <h2>Start My Day</h2>
            <button onClick={() => jump('workbook')}>Go to Workbook</button>
          </div>

          <div className="three-col">
            <div className="notice-card">
              <h3>Safety and PPE</h3>
              <ul>
                <li>Closed-toe shoes.</li>
                <li>Gloves when handling mulch, tools, hive pieces, or weeds.</li>
                <li>Ask before using scissors, hoes, shovels, or gate tools.</li>
                <li>No forest work today unless a supervisor changes the plan.</li>
              </ul>
            </div>
            <div className="notice-card">
              <h3>Today’s Work Order</h3>
              <ul>
                <li>Finish Zone 5 melons.</li>
                <li>Plant corn seedlings if assigned.</li>
                <li>Prepare squash and pumpkin grow area.</li>
                <li>Install gate.</li>
                <li>Check potatoes only as low priority.</li>
              </ul>
            </div>
            <div className="notice-card">
              <h3>Document Before Leaving</h3>
              <ul>
                <li>Write what you did.</li>
                <li>Upload at least one evidence photo if available.</li>
                <li>Answer the workbook questions on this same page.</li>
                <li>Save supervisor notes before dismissal.</li>
              </ul>
            </div>
          </div>

          <h2>Today’s Assignment Cards</h2>
          <div className="assignment-list">
            {assignments.map((a) => <AssignmentCard key={a.title} item={a} />)}
          </div>
        </section>
      )}

      {section === 'resources' && (
        <section className="panel">
          <div className="panel-heading">
            <h2>Searchable Resource Library</h2>
            <button onClick={() => jump('today')}>Back to Today</button>
          </div>
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Miracle Gro, mulch, pollinators, beehive, careers, squash..."
          />
          <div className="resource-grid">
            {filteredResources.map((r) => (
              <article className="resource-card" key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.summary}</p>
                <p className="muted">Keywords: {r.keywords.join(', ')}</p>
                <a href={r.url} target="_blank" rel="noreferrer">{r.linkText}</a>
              </article>
            ))}
          </div>
        </section>
      )}

      {section === 'workbook' && (
        <section className="panel">
          <div className="panel-heading">
            <h2>Workbook: Week 5, Tuesday</h2>
            <button onClick={() => jump('today')}>Back to Assignments</button>
          </div>
          <p className="large-text">Everything youth need to answer is visible here. No hidden question screens. No endless next buttons.</p>
          <Field label="1. What work did you do today?" placeholder="List the tasks you personally helped with." />
          <Field label="2. What did you notice about the soil, water, plants, insects, or paths?" placeholder="Use your own words. Example: water pooled near..." />
          <Field label="3. What tool, skill, or safety habit did you practice?" />
          <Field label="4. Who benefits from this work: you, the farm, your family, the neighborhood, or future youth? Choose all that apply and explain." />
          <Field label="5. What career or business could use this kind of work?" />
          <Field label="6. Legacy reflection: What will remain because you showed up today?" />
          <div className="upload-row">
            <label><strong>Upload photo, note, or evidence</strong><input type="file" multiple /></label>
            <button>Save Workbook Entry</button>
          </div>
        </section>
      )}

      {section === 'portfolio' && (
        <section className="panel">
          <h2>Portfolio Builder</h2>
          <div className="three-col">
            <div className="notice-card"><h3>Skills Captured</h3><p>Planting, mulching, observation, tool safety, teamwork, documentation, problem-solving.</p></div>
            <div className="notice-card"><h3>Resume Language</h3><p>Participated in a youth workforce agriculture program focused on regenerative growing, site preparation, pollinator support, and farm documentation.</p></div>
            <div className="notice-card"><h3>Download Packet</h3><p>Workbook, photos, reflections, skills, supervisor notes, and certificate should feed one professional portfolio.</p></div>
          </div>
        </section>
      )}

      {section === 'calendar' && (
        <section className="panel">
          <h2>Calendar Engine</h2>
          <div className="calendar-grid">
            <div><strong>Mon 7/6</strong><p>No watering. Weed, thin, observe pooling.</p></div>
            <div className="today"><strong>Tue 7/7</strong><p>Finish melons, corn, squash/pumpkin area, gate, mulch.</p></div>
            <div><strong>Wed 7/8</strong><p>Beehive sterilization/rebuild check, documentation, assigned grow work.</p></div>
            <div><strong>Thu 7/9</strong><p>Continue grow stabilization, pest trap review, portfolio evidence.</p></div>
            <div><strong>Fri 7/10</strong><p>Week 5 completion, reflection, parent/supervisor report.</p></div>
          </div>
        </section>
      )}

      {section === 'parent' && (
        <section className="panel">
          <h2>Parent Portal</h2>
          <div className="two-col">
            <div className="notice-card"><h3>Today’s Parent Summary</h3><p>Youth are completing farm restoration work after rain: planting, mulching, gate installation, pest observation, and documentation.</p></div>
            <div className="notice-card"><h3>What Parents Can Ask</h3><ul><li>What did you build, plant, or fix?</li><li>What did you notice after the rain?</li><li>What career used today’s skill?</li></ul></div>
          </div>
        </section>
      )}

      {section === 'supervisor' && (
        <section className="panel">
          <h2>Supervisor Tools</h2>
          <div className="three-col">
            <div className="notice-card"><h3>Attendance</h3><p>Record youth present, late, absent, active, or inactive.</p></div>
            <div className="notice-card"><h3>Assignments</h3><p>Assign youth to melons, corn, squash/pumpkins, gate, mulch, beehive, pest survey, potatoes.</p></div>
            <div className="notice-card"><h3>Reports</h3><p>Capture PPE, incident notes, evidence, completion, parent updates, and supervisor observations.</p></div>
          </div>
          <Field label="Supervisor note for today" placeholder="What changed, what was completed, who needs follow-up?" />
          <button>Save Supervisor Report</button>
        </section>
      )}

      <footer>
        <button onClick={() => jump('today')}>Home / Today</button>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to Top</button>
        <span>Bronson Family Farm Cultivator Ecosystem · Master 14.0 TRUE full replacement</span>
      </footer>
    </main>
  );
}
