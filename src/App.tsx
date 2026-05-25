{/* =========================
   CINEMATIC HERO BACKGROUND
   REPLACE YOUR CURRENT HERO
========================= */}

<div className="fixed inset-0 overflow-hidden">
  <img
    src={active.image}
    alt="Bronson Family Farm"
    className="h-full w-full object-cover scale-[1.04] opacity-40 transition-all duration-[12000ms]"
  />
</div>

<div className="fixed inset-0 bg-gradient-to-br from-black/78 via-emerald-950/52 to-black/82" />

<div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,.10),transparent_26%),radial-gradient(circle_at_78%_12%,rgba(255,233,168,.10),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,.14),transparent_32%)]" />

{/* =========================
   HERO CONTENT
========================= */}

<section className="relative z-10 min-h-screen">
  <div className="mx-auto flex w-full max-w-[1500px] flex-col px-5 py-6 md:px-8 lg:px-10">

    {/* HEADER */}

    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <p className="text-xs uppercase tracking-[.55em] text-lime-100/80">
          BRONSON FAMILY FARM
        </p>

        <h1 className="mt-5 max-w-5xl text-6xl font-black leading-[0.88] tracking-[-0.05em] text-white drop-shadow-2xl md:text-8xl xl:text-[7rem]">
          Step Into The Ecosystem.
        </h1>

        <div className="mt-5 text-2xl font-semibold text-emerald-100/90 md:text-3xl">
          Connected Food Ecosystem Experience
        </div>

        <p className="mt-8 max-w-4xl text-xl leading-9 text-white/84 md:text-2xl">
          Bronson Family Farm is a living ecosystem connecting youth workforce
          development, growers, food movement, wellness, marketplace systems,
          partnerships, education, and community transformation.
        </p>
      </div>

      {/* LANGUAGE BUTTONS */}

      <div className="flex flex-wrap gap-2">
        {LANGS.map((item) => (
          <button
            key={item}
            onClick={() => setLang(item)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              lang === item
                ? "border-white bg-white text-[#092216]"
                : "border-white/20 bg-white/10 text-white/80 backdrop-blur hover:bg-white/20"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>

    {/* NAVIGATION */}

    <nav className="mt-8 flex gap-2 overflow-x-auto pb-2">
      {sections.map((section, index) => (
        <button
          key={section.key}
          onClick={() => chooseSection(section.key)}
          className={`shrink-0 rounded-full border px-5 py-3 text-sm font-bold transition ${
            active.key === section.key
              ? "border-lime-100 bg-lime-100 text-[#092216] shadow-[0_18px_45px_rgba(0,0,0,.28)]"
              : "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20"
          }`}
        >
          <span className="mr-2 opacity-60">
            {String(index + 1).padStart(2, "0")}
          </span>

          {section.nav}
        </button>
      ))}
    </nav>

    {/* MAIN CINEMATIC LAYOUT */}

    <div className="mt-10 grid min-h-[720px] gap-8 lg:grid-cols-[1.02fr_.98fr]">

      {/* LEFT SIDE */}

      <div className="flex flex-col justify-center">

        <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-5 py-3 text-xs font-black uppercase tracking-[.34em] text-lime-100 backdrop-blur-xl w-fit">
          <span className="h-2 w-2 rounded-full bg-lime-200 shadow-[0_0_18px_rgba(217,249,157,.85)]" />

          {active.eyebrow}
        </div>

        <div className="mt-8 grid gap-5">

          <div className="rounded-[2rem] border border-white/18 bg-white/12 p-6 shadow-xl backdrop-blur-2xl">
            <p className="text-[10px] font-black uppercase tracking-[.28em] text-lime-100/70">
              Need Being Met
            </p>

            <p className="mt-3 text-lg leading-8 text-white/88">
              {active.need}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/18 bg-white/12 p-6 shadow-xl backdrop-blur-2xl">
            <p className="text-[10px] font-black uppercase tracking-[.28em] text-lime-100/70">
              Ecosystem Benefit
            </p>

            <p className="mt-3 text-lg leading-8 text-white/88">
              {active.benefit}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/18 bg-white/12 p-6 shadow-xl backdrop-blur-2xl">
            <p className="text-[10px] font-black uppercase tracking-[.28em] text-lime-100/70">
              Final Destination / Decision
            </p>

            <p className="mt-3 text-lg leading-8 text-white/88">
              {active.destination}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE + JOURNEY */}

      <div className="relative min-h-[700px]">

        <div
          className="absolute right-0 top-0 h-[74%] w-[88%] overflow-hidden rounded-[4rem] border border-white/25 bg-cover bg-center shadow-[0_34px_90px_rgba(0,0,0,.45)]"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.18)), url(${active.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#06140d]/55 via-transparent to-white/5" />

          <div className="absolute bottom-7 left-7 right-7">
            <p className="text-xs uppercase tracking-[.3em] text-white/75">
              {active.imageLabel}
            </p>

            <p className="mt-3 text-3xl font-black leading-tight">
              {active.nav}
            </p>
          </div>
        </div>

        {/* JOURNEY CARD */}

        <div className="absolute bottom-0 left-0 w-[92%] rounded-[3rem] border border-white/20 bg-[#f4f7df]/95 p-6 text-[#092216] shadow-[0_30px_80px_rgba(0,0,0,.45)] md:p-8">

          <p className="text-xs font-black uppercase tracking-[.32em] text-emerald-900/65">
            Pathway Journey
          </p>

          <h3 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
            {currentStep.title}
          </h3>

          <p className="mt-4 text-lg leading-8 text-[#244331]">
            {currentStep.body}
          </p>

          <div className="mt-5 rounded-[2rem] bg-[#0d3a26] p-5 text-white">

            <p className="text-xs font-black uppercase tracking-[.28em] text-lime-100/75">
              Next Action
            </p>

            <p className="mt-2 text-xl font-black">
              {currentStep.action}
            </p>
          </div>

          {/* FINAL ECOSYSTEM DECISION */}

          <div className="mt-6 rounded-[2rem] border border-emerald-900/10 bg-white p-5">

            <p className="text-xs font-black uppercase tracking-[.28em] text-emerald-900/60">
              Ecosystem Decision
            </p>

            <h3 className="mt-3 text-2xl font-black leading-tight">
              What happens next?
            </h3>

            <p className="mt-4 text-lg leading-8 text-[#244331]">
              Every participant eventually chooses whether to return,
              contribute, grow, mentor, support, purchase, volunteer,
              or become part of the long-term ecosystem.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <button className="rounded-full bg-[#0d3a26] px-5 py-3 font-black text-white">
                Become a Grower
              </button>

              <button className="rounded-full bg-[#0d3a26] px-5 py-3 font-black text-white">
                Support Youth Workforce
              </button>

              <button className="rounded-full bg-[#0d3a26] px-5 py-3 font-black text-white">
                Volunteer
              </button>

              <button className="rounded-full bg-[#0d3a26] px-5 py-3 font-black text-white">
                Marketplace
              </button>
            </div>
          </div>

          {/* NAVIGATION */}

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={back}
              className="rounded-full bg-[#0d3a26] px-6 py-3 font-black text-white shadow-lg"
            >
              Back
            </button>

            <button
              onClick={next}
              className="rounded-full bg-emerald-600 px-6 py-3 font-black text-white shadow-lg shadow-emerald-950/25"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
