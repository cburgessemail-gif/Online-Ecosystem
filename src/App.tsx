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

function Shell({
  children,
  screen,
  setScreen,
  background = IMG.hero,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  background?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* CINEMATIC IMAGE */}
      <div className="fixed inset-0">
        <img
          src={background}
          alt="Bronson Family Farm"
          className="h-full w-full object-cover scale-[1.02]"
        />
      </div>

      {/* DARK FILM OVERLAY */}
      <div className="fixed inset-0 bg-black/48" />

      {/* CINEMATIC LIGHT */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,220,120,.08),transparent_24%),radial-gradient(circle_at_bottom,rgba(16,185,129,.10),transparent_32%)]" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-8 md:px-10">
        <Navigation screen={screen} setScreen={setScreen} />
        {children}
      </div>
    </div>
  );
}

function PhotoCard({
  title,
  subtitle,
  image,
  height = "320px",
}: {
  title: string;
  subtitle?: string;
  image: string;
  height?: string;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,.55)] transition duration-700 hover:scale-[1.01]"
      style={{ height }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-[4000ms] group-hover:scale-105"
      />

      {/* DEPTH OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

      {/* GLOW */}
      <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.08),transparent_45%)]" />

      {/* CONTENT */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="text-3xl font-black leading-tight drop-shadow-2xl">
          {title}
        </div>

        {subtitle && (
          <div className="mt-3 text-sm leading-6 text-emerald-50/85 max-w-xl">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

function Home({
  setScreen,
  language,
  setLanguage,
}: {
  setScreen: (screen: Screen) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  return (
    <Shell
      screen="home"
      setScreen={setScreen}
      background={IMG.hero}
    >
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        {/* MAIN HERO */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl">

          <div className="relative min-h-[720px]">
            <img
              src={IMG.hero}
              alt="Bronson Family Farm"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* FILM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />

            {/* CONTENT */}
            <div className="relative z-10 flex min-h-[720px] flex-col justify-end p-8 md:p-12">

              <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/80">
                Connected Food Ecosystem Experience
              </div>

              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">
                Step Into The Farm.
                <br />
                Experience The Wonders Of Life.
              </h1>

              <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/90">
                A living ecosystem connecting youth workforce development,
                growers, marketplace systems, schools, wellness,
                agritourism, food access, leadership, and community revitalization.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => setScreen("roles")}
                  className="rounded-full bg-emerald-300 px-7 py-4 font-black text-black shadow-2xl transition hover:scale-105"
                >
                  Begin Guided Tour
                </button>

                <button
                  onClick={() => setScreen("marketplace")}
                  className="rounded-full border border-white/10 bg-white/10 px-7 py-4 font-semibold backdrop-blur-xl transition hover:bg-white/20"
                >
                  Marketplace
                </button>

                <button
                  onClick={() => setScreen("partners")}
                  className="rounded-full border border-white/10 bg-white/10 px-7 py-4 font-semibold backdrop-blur-xl transition hover:bg-white/20"
                >
                  Partners
                </button>
              </div>
            </div>
          </div>

          {/* LOWER EXPERIENCE CARDS */}
          <div className="grid border-t border-white/10 md:grid-cols-3">

            <PhotoCard
              title="Grower Ecosystem"
              subtitle="Production, training, and local food access"
              image={IMG.growArea}
              height="270px"
            />

            <PhotoCard
              title="Marketplace Movement"
              subtitle="Food moving toward families and destinations"
              image={IMG.marketplaceHero}
              height="270px"
            />

            <PhotoCard
              title="Youth Workforce"
              subtitle="Leadership through participation"
              image={IMG.youth1}
              height="270px"
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          <div className="rounded-[2rem] border border-white/10 bg-black/38 p-7 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">

            <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
              Living Ecosystem Overview
            </div>

            <h2 className="mt-5 text-4xl font-black leading-tight">
              A place people want to return to.
            </h2>

            <p className="mt-6 text-lg leading-9 text-emerald-50/85">
              Bronson Family Farm connects workforce, agriculture,
              schools, wellness, marketplace systems, growers,
              leadership, and community participation into one immersive ecosystem.
            </p>

            <div className="mt-8 space-y-4">

              {[
                "Youth Workforce Development",
                "Marketplace & Distribution",
                "Schools & Community Food Access",
                "Grower Ecosystem",
                "Nutrition & Culinary Wellness",
                "Family Legacy & Land Restoration",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 text-xl font-semibold backdrop-blur-xl"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* LANGUAGES */}
            <div className="mt-8">
              <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">
                Language
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      language === lang
                        ? "bg-white text-black"
                        : "border border-white/10 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SEED CARD */}
          <PhotoCard
            title="Seeds, compost, partners, and people make the ecosystem real."
            subtitle="The work is operational, visible, and community-rooted."
            image={IMG.seeds}
            height="360px"
          />
        </div>
      </section>
    </Shell>
  );
}
