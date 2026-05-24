{/* =========================================================
   ECOSYSTEM VISUAL STORY SECTION
   ADD DIRECTLY BELOW HERO SECTION
========================================================= */}

<section className="mt-24">

  <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
    Living Ecosystem Experience
  </div>

  <h2 className="mt-5 text-5xl font-black leading-tight">
    Experience the movement of the ecosystem.
  </h2>

  <p className="mt-8 max-w-5xl text-xl leading-10 text-emerald-50/82">
    Bronson Family Farm is a connected living system where youth,
    growers, marketplace activity, food access, leadership,
    and community participation work together every day.
  </p>

  <div className="mt-14 grid lg:grid-cols-3 gap-6">

    {/* GROWERS */}

    <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl">

      <img
        src="/SAM_0384.JPG"
        alt="Growers"
        className="h-[360px] w-full object-cover"
      />

      <div className="p-7">

        <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
          Grower Ecosystem
        </div>

        <h3 className="mt-4 text-3xl font-black">
          Cultivation and food production
        </h3>

        <p className="mt-5 text-lg leading-8 text-emerald-50/80">
          Growers prepare soil, cultivate crops,
          expand production, and contribute
          to regional food access systems.
        </p>

      </div>
    </div>

    {/* MARKETPLACE */}

    <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl">

      <img
        src="/SAM_0407.JPG"
        alt="Marketplace"
        className="h-[360px] w-full object-cover"
      />

      <div className="p-7">

        <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
          Marketplace Movement
        </div>

        <h3 className="mt-4 text-3xl font-black">
          Food moving toward community destinations
        </h3>

        <p className="mt-5 text-lg leading-8 text-emerald-50/80">
          The marketplace connects growers,
          youth workforce activity,
          schools, distribution systems,
          and families seeking healthy food access.
        </p>

      </div>
    </div>

    {/* YOUTH */}

    <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl">

      <img
        src="/SAM_0401.JPG"
        alt="Youth Workforce"
        className="h-[360px] w-full object-cover"
      />

      <div className="p-7">

        <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
          Youth Workforce
        </div>

        <h3 className="mt-4 text-3xl font-black">
          Leadership through participation
        </h3>

        <p className="mt-5 text-lg leading-8 text-emerald-50/80">
          Youth develop leadership,
          responsibility, teamwork,
          marketplace readiness,
          and ecosystem awareness through real participation.
        </p>

      </div>
    </div>

  </div>
</section>

{/* =========================================================
   DAILY ACTIVITY VISUAL FLOW
   ADD BELOW DAILY RHYTHM SECTION
========================================================= */}

<section className="mt-24">

  <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
    Daily Ecosystem Activity
  </div>

  <h2 className="mt-5 text-5xl font-black">
    The ecosystem stays active throughout the day.
  </h2>

  <div className="mt-14 grid lg:grid-cols-4 gap-5">

    {[
      ["/SAM_0391.JPG", "Morning Activation"],
      ["/SAM_0393.JPG", "Harvest Teams"],
      ["/SAM_0410.JPG", "Marketplace Preparation"],
      ["/SAM_0415.JPG", "Community Support"],
    ].map(([img, title]) => (

      <div
        key={title}
        className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl"
      >

        <img
          src={img}
          alt={title}
          className="h-[260px] w-full object-cover"
        />

        <div className="p-6">

          <div className="text-2xl font-bold">
            {title}
          </div>

        </div>

      </div>

    ))}

  </div>
</section>

{/* =========================================================
   MARKETPLACE DESTINATION EXPERIENCE
   ADD TO MARKETPLACE SCREEN
========================================================= */}

<section className="mt-24 grid lg:grid-cols-[1fr_1fr] gap-6">

  <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl">

    <img
      src="/SAM_0402.JPG"
      alt="Marketplace Distribution"
      className="h-full w-full object-cover"
    />

  </div>

  <div className="rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-xl p-8">

    <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
      Marketplace Destination System
    </div>

    <h2 className="mt-4 text-5xl font-black leading-tight">
      Food moving into the community.
    </h2>

    <p className="mt-6 text-lg leading-9 text-emerald-50/82">
      Bronson Family Farm connects production,
      youth workforce activity,
      growers, marketplace systems,
      schools, wellness initiatives,
      and food access into one operational ecosystem.
    </p>

    <div className="mt-10 grid md:grid-cols-2 gap-4">

      {[
        "Youth-grown produce",
        "Community food access",
        "Marketplace readiness",
        "School destinations",
        "Nutrition initiatives",
        "Seasonal produce systems",
      ].map((item) => (

        <div
          key={item}
          className="rounded-2xl border border-white/10 bg-white/10 p-5"
        >
          {item}
        </div>

      ))}

    </div>
  </div>
</section>
