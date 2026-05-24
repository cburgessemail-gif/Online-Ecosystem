export default function BronsonFamilyFarmEcosystemDemo() {
  return (
    <div className="min-h-screen bg-[#07120d] text-white overflow-hidden">
      {/* MASTER ECOSYSTEM FOUNDATION */}

      {/* HERO / ENTRANCE EXPERIENCE */}
      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/GrowArea.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-emerald-950/70 to-black/85" />

        <div className="relative z-10 px-6 py-8 md:px-12">
          {/* NAVIGATION */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              'Entrance',
              'Our Story',
              'Role Pathways',
              'Marketplace',
              'Youth Workforce',
              'Events',
              'Nutrition',
              'Partners',
            ].map((item) => (
              <button
                key={item}
                className="rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-md hover:bg-white/20 transition"
              >
                {item}
              </button>
            ))}
          </div>

          {/* MAIN HERO */}
          <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-xl p-8 md:p-10 shadow-2xl">
              <div className="uppercase tracking-[0.35em] text-emerald-100/70 text-xs">
                Connected Food Ecosystem Experience
              </div>

              <h1 className="mt-5 text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
                Bronson Family Farm
              </h1>

              <p className="mt-8 max-w-4xl text-xl leading-10 text-emerald-50/85">
                A living ecosystem connecting youth workforce development,
                growers, marketplace systems, schools, nutrition, agritourism,
                food access, leadership, and community wellness.
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

              {/* LIVE ECOSYSTEM STATUS */}
              <div className="mt-10 grid md:grid-cols-3 gap-4">
                {[
                  ['50 Youth Active', 'Summer Workforce Active'],
                  ['Marketplace Preparing', 'Distribution & Inventory'],
                  ['Warm Growing Conditions', 'Weather & Irrigation Active'],
                  ['Schools Supported', 'Community Destinations Active'],
                  ['118 Acres Activated', 'Ecosystem Production Active'],
                  ['Harvest Teams Deployed', 'Daily Rhythm Active'],
                ].map(([title, subtitle]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-lg"
                  >
                    <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">
                      Live Ecosystem
                    </div>
                    <div className="mt-3 text-2xl font-bold">{title}</div>
                    <div className="mt-2 text-sm text-emerald-50/75">
                      {subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVING ECOSYSTEM OVERVIEW */}
            <div className="rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-xl p-7 shadow-2xl">
              <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
                Living Ecosystem Overview
              </div>

              <h2 className="mt-5 text-4xl font-bold leading-tight">
                A place people want to return to.
              </h2>

              <p className="mt-6 text-lg leading-9 text-emerald-50/82">
                Bronson Family Farm is designed to connect workforce,
                agriculture, wellness, schools, growers, community
                revitalization, and marketplace systems into one immersive
                ecosystem.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Family Legacy',
                  'Youth Workforce Development',
                  'Marketplace & Distribution',
                  'Schools & Community Food Access',
                  'Grower Network',
                  'Health & Nutrition',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4"
                  >
                    <div className="font-semibold text-xl">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DAILY ECOSYSTEM RHYTHM */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-[#07120d] to-[#102218]">
        <div className="max-w-7xl mx-auto">
          <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
            Daily Ecosystem Rhythm
          </div>

          <h2 className="mt-5 text-5xl font-black">
            The ecosystem operates with movement, purpose, and structure.
          </h2>

          <div className="mt-12 grid lg:grid-cols-4 gap-5">
            {[
              'Arrival Experience',
              'Morning Activation',
              'Team Deployment',
              'Motivational Activity Block',
              'Deep Work Session',
              'Marketplace Rotation',
              'Reflection Session',
              'Closing Circle',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
              >
                <div className="text-2xl font-bold leading-tight">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOD DESTINATION FLOW */}
      <section className="px-6 md:px-12 py-20 bg-[#08110d]">
        <div className="max-w-7xl mx-auto">
          <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
            Where The Food Goes
          </div>

          <h2 className="mt-5 text-5xl font-black leading-tight">
            Grow → Harvest → Prepare → Marketplace → Schools → Community
            Destinations → Families
          </h2>

          <p className="mt-8 max-w-5xl text-xl leading-10 text-emerald-50/85">
            Youth and growers are not simply gardening. Food grown through the
            ecosystem supports marketplaces, schools, events, wellness
            initiatives, families, and community destinations.
          </p>

          <div className="mt-12 grid lg:grid-cols-7 gap-4">
            {[
              'Grow',
              'Harvest',
              'Prepare',
              'Marketplace',
              'Schools',
              'Community',
              'Families',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 text-center backdrop-blur-lg"
              >
                <div className="text-2xl font-bold">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLE PATHWAYS */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-[#08110d] to-[#102218]">
        <div className="max-w-7xl mx-auto">
          <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
            Ecosystem Role Pathways
          </div>

          <h2 className="mt-5 text-5xl font-black">
            Every pathway leads somewhere meaningful.
          </h2>

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            {[
              {
                title: 'Youth Workforce Journey',
                content:
                  'Youth participate in cultivation, leadership, marketplace preparation, reflection, wellness, and food distribution systems.',
                ending:
                  'Continue to Leadership • Become Mentor • Explore Marketplace',
              },
              {
                title: 'Grower Pathway',
                content:
                  'Growers connect to education, production systems, markets, and community support.',
                ending:
                  'Join Grower Network • Sell Through Marketplace • Mentor Youth',
              },
              {
                title: 'Marketplace Pathway',
                content:
                  'The marketplace connects customers, schools, food access, and economic activity.',
                ending:
                  'Shop Marketplace • Become Vendor • Support Youth Workforce',
              },
              {
                title: 'Partner Pathway',
                content:
                  'Partners strengthen infrastructure, schools, youth workforce systems, and food distribution.',
                ending:
                  'Become Sponsor • Schedule Meeting • Support Ecosystem',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-black/25 p-8 backdrop-blur-xl"
              >
                <div className="text-4xl font-black leading-tight">
                  {item.title}
                </div>

                <p className="mt-6 text-lg leading-9 text-emerald-50/85">
                  {item.content}
                </p>

                <div className="mt-8 uppercase tracking-[0.25em] text-xs text-emerald-100/70">
                  Ending Decision
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-5 text-base leading-8">
                  {item.ending}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPERATIONAL COMMAND CENTER */}
      <section className="px-6 md:px-12 py-20 bg-[#08110d]">
        <div className="max-w-7xl mx-auto">
          <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
            Ecosystem Command Center
          </div>

          <h2 className="mt-5 text-5xl font-black">
            Operational visibility across the ecosystem.
          </h2>

          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="text-3xl font-bold">Youth Workforce</div>
              <ul className="mt-5 space-y-3 text-lg leading-8 text-emerald-50/82">
                <li>50 Youth Active</li>
                <li>PPE Verification</li>
                <li>Leadership Challenges</li>
                <li>Badge Progress</li>
                <li>Reflection Submissions</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="text-3xl font-bold">Supervisor Layer</div>
              <ul className="mt-5 space-y-3 text-lg leading-8 text-emerald-50/82">
                <li>Participation Tracking</li>
                <li>Task Completion</li>
                <li>Leadership Scoring</li>
                <li>Daily Observations</li>
                <li>Pathway Advancement</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="text-3xl font-bold">Live Ecosystem Feed</div>
              <ul className="mt-5 space-y-3 text-lg leading-8 text-emerald-50/82">
                <li>Harvest Team active in Grow Zone 2</li>
                <li>Marketplace inventory updated</li>
                <li>School distribution preparing</li>
                <li>Leadership challenge completed</li>
                <li>Reflection submissions active</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK & COMMUNITY VOICE */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-[#08110d] to-black">
        <div className="max-w-6xl mx-auto">
          <div className="uppercase tracking-[0.3em] text-emerald-100/70 text-xs">
            Feedback & Community Voice
          </div>

          <h2 className="mt-5 text-5xl font-black">
            The ecosystem listens and responds.
          </h2>

          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
              <div className="text-2xl font-bold">
                What inspired you today?
              </div>

              <textarea
                className="mt-6 w-full h-44 rounded-2xl border border-white/10 bg-black/30 p-5 text-white outline-none resize-none"
                placeholder="Share your feedback, reflections, and ideas..."
              />

              <button className="mt-6 rounded-full bg-emerald-400 text-black px-6 py-3 font-bold">
                Submit Reflection
              </button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
              <div className="text-2xl font-bold">
                Continue Your Journey
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  'Join Workforce',
                  'Become Grower',
                  'Explore Marketplace',
                  'Attend Event',
                  'Become Partner',
                  'Volunteer',
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
      </section>
    </div>
  );
}
