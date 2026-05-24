{/* =========================================================
   ROLE PATHWAYS — FULL ECOSYSTEM JOURNEYS
   PRESERVE EXISTING ARCHITECTURE / ATMOSPHERE
========================================================= */}

<section className="px-6 md:px-12 py-24 bg-gradient-to-b from-[#07120d] to-[#102218]">
  <div className="max-w-7xl mx-auto">

    <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
      Ecosystem Role Pathways
    </div>

    <h2 className="mt-5 text-5xl md:text-6xl font-black leading-tight">
      Every pathway moves through the ecosystem.
    </h2>

    <p className="mt-8 max-w-5xl text-xl leading-10 text-emerald-50/82">
      Guests, youth, growers, supervisors, marketplace teams, schools,
      partners, and families all participate in one connected living system.
    </p>

    {/* =========================================================
       YOUTH WORKFORCE
    ========================================================= */}

    <div className="mt-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">

      <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl">
        <img
          src="/SAM_0401.JPG"
          className="h-[520px] w-full object-cover"
        />

        <div className="p-8">

          <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
            Youth Workforce Journey
          </div>

          <h3 className="mt-4 text-5xl font-black leading-tight">
            Youth participate in a real food ecosystem.
          </h3>

          <p className="mt-6 text-lg leading-9 text-emerald-50/82">
            Youth cultivate, harvest, prepare, organize, reflect,
            lead, and help move food toward marketplaces,
            schools, community destinations, and families.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-4">

            {[
              "Morning activation and ecosystem briefing",
              "Cultivation and harvest teams",
              "Marketplace preparation",
              "Leadership and teamwork challenges",
              "Motivational activity blocks",
              "Reflection and ecosystem participation",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 p-5"
              >
                {item}
              </div>
            ))}

          </div>

          {/* ENDING DECISION */}

          <div className="mt-10">

            <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
              Ending Decision
            </div>

            <div className="mt-4 flex flex-wrap gap-3">

              {[
                "Continue to Leadership",
                "Explore Marketplace",
                "Become Future Mentor",
                "Join Grower Pathway",
                "Return to Ecosystem",
              ].map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-white/10 bg-white/10 px-5 py-3 hover:bg-white/20 transition"
                >
                  {item}
                </button>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* YOUTH WORKFORCE COMMAND CENTER */}

      <div className="space-y-6">

        <div className="rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-xl p-7">

          <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
            Workforce Command Center
          </div>

          <h3 className="mt-4 text-4xl font-black">
            Operational ecosystem activity
          </h3>

          <div className="mt-8 grid gap-4">

            {[
              ["50 Youth Active", "Summer workforce session active"],
              ["PPE Verified", "Safety & readiness checks complete"],
              ["Marketplace Prep", "Distribution preparation active"],
              ["Leadership Challenge", "Team-based ecosystem activity"],
              ["Reflection Submitted", "Daily growth & participation"],
            ].map(([title, subtitle]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/10 p-5"
              >
                <div className="text-2xl font-bold">
                  {title}
                </div>

                <div className="mt-2 text-sm text-emerald-50/70">
                  {subtitle}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* DAILY RHYTHM */}

        <div className="rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-xl p-7">

          <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
            Daily Ecosystem Rhythm
          </div>

          <div className="mt-6 space-y-4">

            {[
              "Arrival Experience",
              "Morning Activation",
              "Team Deployment",
              "Motivational Activity Block",
              "Deep Work Session",
              "Marketplace Rotation",
              "Reflection Session",
              "Closing Circle",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 p-4"
              >
                {item}
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>

    {/* =========================================================
       FOOD DESTINATION FLOW
    ========================================================= */}

    <div className="mt-20">

      <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
        Food Destination Flow
      </div>

      <h2 className="mt-5 text-5xl font-black leading-tight">
        Grow → Harvest → Prepare → Marketplace → Schools → Community
      </h2>

      <p className="mt-8 max-w-5xl text-xl leading-10 text-emerald-50/82">
        Youth and growers are not simply gardening.
        Food produced through the ecosystem supports
        marketplaces, schools, wellness initiatives,
        community events, and families.
      </p>

      <div className="mt-12 grid lg:grid-cols-6 gap-4">

        {[
          ["/SAM_0384.JPG", "Grow"],
          ["/SAM_0393.JPG", "Harvest"],
          ["/SAM_0412.JPG", "Prepare"],
          ["/marketplace.jpg", "Marketplace"],
          ["/community-school.jpg", "Schools"],
          ["/community-family.jpg", "Families"],
        ].map(([img, title]) => (
          <div
            key={title}
            className="rounded-[1.75rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl"
          >
            <img
              src={img}
              className="h-[220px] w-full object-cover"
            />

            <div className="p-5">

              <div className="text-2xl font-bold">
                {title}
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>

    {/* =========================================================
       MARKETPLACE EXPERIENCE
    ========================================================= */}

    <div className="mt-24 grid lg:grid-cols-[0.95fr_1.05fr] gap-6">

      <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/25 backdrop-blur-xl">

        <img
          src="/marketplace.jpg"
          className="h-full w-full object-cover"
        />

      </div>

      <div className="rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-xl p-8">

        <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
          Marketplace Ecosystem
        </div>

        <h3 className="mt-4 text-5xl font-black leading-tight">
          The marketplace connects food, education, wellness, and community.
        </h3>

        <p className="mt-6 text-lg leading-9 text-emerald-50/82">
          Marketplace systems connect growers,
          youth workforce activity, schools,
          community distribution, wellness initiatives,
          and local purchasing into one living economy.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-4">

          {[
            "Youth-grown produce",
            "School support",
            "Community distribution",
            "SNAP-accessible food systems",
            "Seasonal produce",
            "Value-added products",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/10 p-5"
            >
              {item}
            </div>
          ))}

        </div>

        {/* MARKETPLACE ENDING */}

        <div className="mt-10">

          <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
            Ending Decision
          </div>

          <div className="mt-4 flex flex-wrap gap-3">

            {[
              "Shop Marketplace",
              "Become Vendor",
              "Support Workforce",
              "Explore Grower Pathway",
              "Return to Ecosystem",
            ].map((item) => (
              <button
                key={item}
                className="rounded-full border border-white/10 bg-white/10 px-5 py-3 hover:bg-white/20"
              >
                {item}
              </button>
            ))}

          </div>
        </div>

      </div>
    </div>

    {/* =========================================================
       LIVE ECOSYSTEM FEED
    ========================================================= */}

    <div className="mt-24 rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-xl p-8">

      <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
        Live Ecosystem Feed
      </div>

      <h3 className="mt-4 text-5xl font-black">
        Real ecosystem movement
      </h3>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {[
          "Harvest Team active in Grow Zone 2",
          "Marketplace inventory updated",
          "Leadership challenge completed",
          "Produce prepared for school destination",
          "Reflection submissions active",
          "Community distribution preparing",
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

    {/* =========================================================
       FEEDBACK / COMMUNITY VOICE
    ========================================================= */}

    <div className="mt-24 grid lg:grid-cols-2 gap-6">

      <div className="rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-xl p-8">

        <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
          Feedback & Reflection
        </div>

        <h3 className="mt-4 text-5xl font-black leading-tight">
          The ecosystem listens and evolves.
        </h3>

        <div className="mt-8 space-y-5">

          {[
            "What inspired you today?",
            "What pathway interests you most?",
            "How could this ecosystem strengthen the community?",
            "What role do you see yourself in?",
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

      <div className="rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-xl p-8">

        <div className="uppercase tracking-[0.25em] text-emerald-100/70 text-xs">
          Continue Your Journey
        </div>

        <h3 className="mt-4 text-5xl font-black leading-tight">
          Movement through the ecosystem never stops.
        </h3>

        <div className="mt-10 flex flex-wrap gap-4">

          {[
            "Join Workforce",
            "Become Grower",
            "Explore Marketplace",
            "Attend Event",
            "Become Partner",
            "Volunteer",
          ].map((item) => (
            <button
              key={item}
              className="rounded-full border border-white/10 bg-white/10 px-6 py-4 hover:bg-white/20"
            >
              {item}
            </button>
          ))}

        </div>

      </div>
    </div>

  </div>
</section>
