"use client";

const features = [
  {
    number: "01",
    title: "Infinite canvas",
    description:
      "Start anywhere and give your ideas room to grow. Sketch, connect, organize, and explore without limits.",
    visual: "canvas",
  },
  {
    number: "02",
    title: "Real-time collaboration",
    description:
      "Work with your team on the same canvas in real time. See who's there and build ideas together.",
    visual: "people",
  },
  {
    number: "03",
    title: "Simple visual tools",
    description:
      "Draw shapes, arrows, notes, and connections with tools that stay simple and out of your way.",
    visual: "tools",
  },
  {
    number: "04",
    title: "Share ideas instantly",
    description:
      "Bring teammates into your workspace and turn conversations into visual ideas in just a few clicks.",
    visual: "share",
  },
];

function FeatureIcon({ type }: { type: string }) {
  if (type === "canvas") {
    return (
      <svg
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 19L9 18L19 8L16 5L6 15L4 19Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 7L17 10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "people") {
    return (
      <svg
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="9"
          cy="8"
          r="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="17"
          cy="9"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M3.5 19C3.8 15.8 6 14 9 14C12 14 14.2 15.8 14.5 19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M14.5 14.5C17 14.5 19.5 16 20 18.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "tools") {
    return (
      <svg
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="4"
          width="6"
          height="6"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="17"
          cy="7"
          r="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5 17H11"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M14 16L20 16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M17 13V19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureVisual({ type }: { type: string }) {
  if (type === "canvas") {
    return (
      <div className="relative h-32 overflow-hidden rounded-2xl border border-[#eeeeee] bg-[#fbfaff]">
        <div className="draivo-grid absolute inset-0 opacity-70" />

        <div className="absolute left-[18%] top-[28%] h-11 w-20 rotate-[-5deg] rounded-lg border-2 border-[#625df5] bg-white" />

        <div className="absolute left-[42%] top-[48%] h-9 w-24 rotate-[3deg] rounded-lg border-2 border-[#f3a14c] bg-[#fffaf2]" />

        <div className="absolute right-[17%] top-[20%] h-8 w-8 rounded-full border-2 border-[#63a37c] bg-[#72e6a7]/20" />

        <div className="absolute bottom-[18%] left-[29%] h-2 w-14 rotate-[-8deg] rounded-full bg-[#625df5]/30" />
      </div>
    );
  }

  if (type === "people") {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border border-[#eeeeee] bg-[#f9fbfa]">
        <div className="flex -space-x-3">
          {[
            ["F", "#625df5"],
            ["S", "#f08c36"],
            ["A", "#36a96c"],
            ["P", "#e7478b"],
          ].map(([letter, color]) => (
            <div
              key={letter}
              className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "tools") {
    return (
      <div className="flex h-32 items-center justify-center gap-3 rounded-2xl border border-[#eeeeee] bg-[#fffaf5]">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#625df5] bg-white text-[#625df5]">
          □
        </div>

        <span className="text-[#625df5]">→</span>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#f08c36] bg-white text-[#f08c36]">
          ◇
        </div>

        <span className="text-[#625df5]">→</span>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#36a96c] bg-white text-[#36a96c]">
          ○
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-32 items-center justify-center rounded-2xl border border-[#eeeeee] bg-[#f8f7ff]">
      <div className="flex items-center gap-3 rounded-full border border-[#dddddd] bg-white px-5 py-3 shadow-sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#625df5] text-[9px] font-bold text-white">
          F
        </span>

        <span className="text-xs font-medium text-[#555]">
          Invite your team
        </span>

        <span className="text-[#625df5]">→</span>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#fafafa] px-6 py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Heading */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#625df5]">
            Features
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#17171B] sm:text-5xl lg:text-6xl">
            Everything you need
            <span className="block text-[#625df5]">
              to think visually.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#666] sm:text-lg">
            A focused set of tools that helps your team turn rough
            thoughts into clear, visual ideas.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group relative overflow-hidden rounded-[28px] border border-[#e7e7e7] bg-white p-8 shadow-[0_12px_40px_rgba(30,30,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d8d5ff] hover:shadow-[0_24px_60px_rgba(98,93,245,0.10)] sm:p-10"
            >
              {/* Soft glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#625df5]/[0.05] blur-3xl transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">

                {/* Top */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.16em] text-[#999]">
                    {feature.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f4ff] text-[#625df5] transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <FeatureIcon type={feature.visual} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-10 text-2xl font-semibold tracking-[-0.035em] text-[#17171B] sm:text-3xl">
                  {feature.title}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-[#666] sm:text-base">
                  {feature.description}
                </p>

                {/* Visual */}
                <div className="mt-10">
                  <FeatureVisual type={feature.visual} />
                </div>

              </div>
            </article>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-20 flex flex-col justify-between gap-5 border-t border-[#e5e5e5] pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-6 text-[#777]">
            From the first rough sketch to the final plan, keep your
            team's ideas in one shared visual space.
          </p>

          <a
            href="#collaboration"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#625df5]"
          >
            See collaboration
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}