<div className="grid gap-6 lg:grid-cols-3">
  {operationalModules.map((module) => (
    <button
      key={module.id}
      onClick={() =>
        setScreen(module.id as Screen)
      }
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 text-left transition hover:scale-[1.01]"
    >
      <div className="relative h-[320px] overflow-hidden">
        <img
          src={module.image}
          alt={module.title}
          className="h-full w-full object-cover transition duration-[4000ms] group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-3xl font-black">
            {module.title}
          </div>

          <div className="mt-3 text-sm leading-7 text-emerald-50/85">
            {module.description}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-6">
        {module.tools.map((tool) => (
          <div
            key={tool}
            className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm"
          >
            {tool}
          </div>
        ))}
      </div>
    </button>
  ))}
</div>
