{/* =========================================================
   REPLACE THE ENTIRE HERO SECTION WITH THIS
========================================================= */}

<section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">

  {/* LEFT HERO */}

  <div className="rounded-[2.25rem] overflow-hidden border border-white/10 bg-black/25 shadow-2xl backdrop-blur-xl">

    {/* HERO IMAGE */}

    <div className="relative h-[560px]">

      <img
        src="/GrowArea.jpg"
        alt="Bronson Family Farm"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-10">

        <div className="uppercase tracking-[0.35em] text-emerald-100/70 text-xs">
          Connected Food Ecosystem Experience
        </div>

        <h1 className="mt-5 text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
          Bronson Family Farm
        </h1>

        <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/85">
          A living ecosystem connecting youth workforce development,
          growers, marketplace systems, schools, wellness,
          agritourism, food access, leadership,
          and community revitalization.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">

          <button className="rounded-full bg-emerald-400 text-black px-6 py-3 font-bold">
            Begin Guided Tour
          </button>

          <button className="rounded-full border border-white/10 bg-white/10 px-6 py-3">
            Enter Ecosystem
          </button>

          <button className="rounded-full border border-white/10 bg-white/10 px-6 py-3">
            Marketplace
          </button>

        </div>
      </div>
    </div>

    {/* LIVE IMAGE STRIP */}

    <div className="grid md:grid-cols-3 gap-0 border-t border-white/10">

      {[
        ["/SAM_0384.JPG", "Grower Ecosystem"],
        ["/SAM_0407.JPG", "Marketplace Movement"],
        ["/SAM_0401.JPG", "Youth Workforce"],
      ].map(([img, title]) => (

        <div
          key={title}
          className="relative h-[220px] overflow-hidden border-r border-white/10"
        >

          <img
            src={img}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5">

            <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
              Live Ecosystem
            </div>

            <div className="mt-2 text-2xl font-bold">
              {title}
            </div>

          </div>
        </div>

      ))}

    </div>
  </div>

  {/* RIGHT COMMAND CENTER */}

  <div className="space-y-6">

    {/* OVERVIEW */}

    <div className="rounded-[2rem] border border-white/10 bg-black/25 p-7 backdrop-blur-xl">

      <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
        Living Ecosystem Overview
      </div>

      <h2 className="mt-5 text-4xl font-black leading-tight">
        A place people want to return to.
      </h2>

      <p className="mt-6 text-lg leading-9 text-emerald-50/82">
        Bronson Family Farm connects workforce,
        agriculture, schools, wellness,
        marketplace systems, growers,
        leadership, and community participation
        into one immersive ecosystem.
      </p>

      <div className="mt-8 space-y-4">

        {[
          "Youth Workforce Development",
          "Marketplace & Distribution",
          "Schools & Community Food Access",
          "Grower Ecosystem",
          "Nutrition & Wellness",
          "Family Legacy & Land Restoration",
        ].map((item) => (

          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-white/10 p-5"
          >
            <div className="text-xl font-semibold">
              {item}
            </div>
          </div>

        ))}

      </div>
    </div>

    {/* LIVE STATUS */}

    <div className="grid md:grid-cols-2 gap-4">

      {[
        ["50 Youth Active", "Summer Workforce Active"],
        ["Marketplace Preparing", "Distribution & Inventory"],
        ["Warm Growing Conditions", "Weather & Irrigation Active"],
        ["Schools Supported", "Community Destinations Active"],
      ].map(([title, subtitle]) => (

        <div
          key={title}
          className="rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl"
        >

          <div className="uppercase tracking-[0.25em] text-emerald-100/65 text-xs">
            Live Ecosystem
          </div>

          <div className="mt-3 text-2xl font-bold">
            {title}
          </div>

          <div className="mt-2 text-sm text-emerald-50/70">
            {subtitle}
          </div>

        </div>

      ))}

    </div>

    {/* LIVE ACTIVITY IMAGE */}

    <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl">

      <div className="relative h-[300px]">

        <img
          src="/SAM_0415.JPG"
          alt="Community Support"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">

          <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
            Ecosystem Movement
          </div>

          <div className="mt-3 text-3xl font-black">
            Schools & Community Support Active
          </div>

        </div>
      </div>
    </div>

  </div>
</section>
