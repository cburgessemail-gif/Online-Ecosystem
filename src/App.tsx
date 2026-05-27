export default function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* FOREST PORTAL */}
      <section
        className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/GrowArea2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wide mb-6">
            Bronson Family Farm
          </h1>

          <p className="text-xl md:text-2xl leading-relaxed mb-8 text-gray-200">
            Enter the online ecosystem experience.
            A living farm, workforce, marketplace, grower, wellness,
            and community development system.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-2xl bg-green-700 hover:bg-green-600 text-lg">
              Enter Ecosystem
            </button>

            <button className="px-8 py-4 rounded-2xl border border-white hover:bg-white hover:text-black text-lg">
              Guided Tour
            </button>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="px-6 md:px-12 py-16 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            The Bronson Family Farm Ecosystem
          </h2>

          <p className="text-lg leading-relaxed text-gray-300 mb-12 max-w-4xl">
            This ecosystem connects agriculture, youth workforce development,
            education, health, food access, marketplace systems, grower support,
            volunteers, technology, and family engagement into one operational model.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="bg-[#161616] rounded-3xl overflow-hidden border border-[#2b2b2b]">
              <img
                src="/images/SAM_0405.JPG"
                alt="Youth Workforce"
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Youth Workforce Pathway
                </h3>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Youth ages 14–18 participate in an 8‑week immersive outdoor workforce program.
                  Supervisors guide participants through agriculture, responsibility,
                  leadership, nutrition, safety, teamwork, and personal growth.
                </p>

                <button className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600">
                  Enter Youth Journey
                </button>
              </div>
            </div>

            <div className="bg-[#161616] rounded-3xl overflow-hidden border border-[#2b2b2b]">
              <img
                src="/images/ConnectFoodEcosystem_withimages.png"
                alt="Marketplace"
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Marketplace Pathway
                </h3>

                <p className="text-gray-300 leading-relaxed mb-6">
                  The marketplace connects growers, families, and community food access.
                  Includes produce distribution, SNAP integration, Bubble Babies™,
                  educational sales, and local agriculture support.
                </p>

                <button className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600">
                  Enter Marketplace
                </button>
              </div>
            </div>

            <div className="bg-[#161616] rounded-3xl overflow-hidden border border-[#2b2b2b]">
              <img
                src="/images/Fence_volunteers.png"
                alt="Growers"
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Grower Pathway
                </h3>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Growers receive support, supplies, guidance, educational tools,
                  planning systems, and regional collaboration opportunities.
                </p>

                <button className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600">
                  Enter Grower Journey
                </button>
              </div>
            </div>

            <div className="bg-[#161616] rounded-3xl overflow-hidden border border-[#2b2b2b]">
              <img
                src="/images/Queens Village.png"
                alt="Wellness"
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Wellness Pathway
                </h3>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Nature-based wellness experiences include meditation,
                  nutrition education, sensory engagement, healing circles,
                  music, and mental health support.
                </p>

                <button className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600">
                  Enter Wellness Journey
                </button>
              </div>
            </div>

            <div className="bg-[#161616] rounded-3xl overflow-hidden border border-[#2b2b2b]">
              <img
                src="/images/CSU_MParker.png"
                alt="Partners"
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Partner Pathway
                </h3>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Regional institutions, foundations, educators, growers,
                  nonprofits, and businesses collaborate to strengthen
                  the ecosystem and community impact.
                </p>

                <button className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600">
                  Enter Partner Journey
                </button>
              </div>
            </div>

            <div className="bg-[#161616] rounded-3xl overflow-hidden border border-[#2b2b2b]">
              <img
                src="/images/Compost_ElliottGarden.png"
                alt="Operations"
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Operations Pathway
                </h3>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Inventory systems, supervisor dashboards, assessments,
                  crop planning, QR check‑in systems, scheduling,
                  logistics, and ecosystem coordination.
                </p>

                <button className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600">
                  Enter Operations
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
