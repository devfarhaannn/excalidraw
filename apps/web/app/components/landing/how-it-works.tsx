"use client";

const steps = [
  {
    number: "01",
    title: "Start with an idea",
    description:
      "Create a canvas and put your first idea on the board. Sketch, write, connect, and organize everything visually.",
    visual: (
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#f8f8ff]">
        <div className="absolute left-[18%] top-[22%] rotate-[-4deg] rounded-xl border border-[#e5d978] bg-[#fff6b8] px-6 py-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9b8c2e]">
            IDEA
          </p>
          <p className="mt-2 text-xl font-bold text-[#292922]">
            New project
          </p>
        </div>

        <div className="absolute right-[16%] top-[38%] h-24 w-32 rotate-[3deg] rounded-xl border-2 border-[#625df5] bg-white shadow-sm">
          <div className="flex h-full items-center justify-center">
            <span className="text-sm font-semibold text-[#625df5]">
              Sketch
            </span>
          </div>
        </div>

        <div className="absolute bottom-[20%] left-[38%] h-16 w-16 rounded-full border-2 border-dashed border-[#625df5]" />

        <div className="absolute left-[43%] top-[46%] h-[2px] w-24 rotate-[18deg] bg-[#c9c6ff]" />
      </div>
    ),
  },
  {
    number: "02",
    title: "Bring your team together",
    description:
      "Invite teammates and work on the same canvas together. Everyone can see ideas evolve in real time.",
    visual: (
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#f7fbf8]">
        <div className="absolute left-1/2 top-1/2 flex h-28 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-2 border-[#625df5] bg-white shadow-sm">
          <span className="text-sm font-semibold text-[#333]">
            Shared canvas
          </span>
        </div>

        <div className="absolute left-[14%] top-[22%]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#625df5] text-xs font-bold text-white">
            N
          </div>
          <span className="mt-1 block rounded-full bg-[#625df5] px-2 py-1 text-[9px] font-medium text-white">
            Neymar
          </span>
        </div>

        <div className="absolute right-[15%] top-[28%]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f08c36] text-xs font-bold text-white">
            B
          </div>
          <span className="mt-1 block rounded-full bg-[#f08c36] px-2 py-1 text-[9px] font-medium text-white">
            Bruna
          </span>
        </div>

        <div className="absolute bottom-[16%] left-[25%]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#36a96c] text-xs font-bold text-white">
            A
          </div>
          <span className="mt-1 block rounded-full bg-[#36a96c] px-2 py-1 text-[9px] font-medium text-white">
            Alex
          </span>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Turn ideas into action",
    description:
      "Organize your thinking, gather feedback, and turn your visual ideas into something your team can actually build.",
    visual: (
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#fffaf5]">
        <div className="absolute left-[17%] top-[22%] h-20 w-28 rotate-[-3deg] rounded-xl border border-[#f0c477] bg-[#fff0c7] p-3">
          <div className="h-2 w-12 rounded-full bg-[#e4c26b]" />
          <div className="mt-3 h-2 w-20 rounded-full bg-[#ead79d]" />
          <div className="mt-2 h-2 w-14 rounded-full bg-[#ead79d]" />
        </div>

        <div className="absolute right-[18%] top-[25%] flex h-16 w-16 items-center justify-center rounded-full bg-[#625df5] text-white shadow-lg">
          ✓
        </div>

        <div className="absolute bottom-[21%] left-[30%] h-3 w-40 rounded-full bg-[#dedcff]" />

        <div className="absolute bottom-[21%] left-[30%] h-3 w-28 rounded-full bg-[#625df5]" />
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-white px-6 py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-[#e8e8e8] bg-[#fafafa] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#625df5]">
            How it works
          </span>

          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-[#17171B] sm:text-5xl lg:text-6xl">
            From a blank canvas
            <span className="block text-[#625df5]">
              to a shared idea.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#666] sm:text-lg">
            Draivo keeps the process simple. Start with an idea,
            bring your team in, and turn your thinking into something
            everyone can understand.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`grid overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white shadow-[0_20px_70px_rgba(30,30,60,0.06)] md:grid-cols-2 ${
                index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Text */}
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <span className="text-sm font-bold tracking-[0.15em] text-[#625df5]">
                  {step.number}
                </span>

                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#17171B] sm:text-4xl">
                  {step.title}
                </h3>

                <p className="mt-5 max-w-lg text-base leading-7 text-[#666] sm:text-lg">
                  {step.description}
                </p>
              </div>

              {/* Visual */}
              <div className="min-h-[320px] bg-[#fafafa] p-5 sm:min-h-[400px] sm:p-8">
                {step.visual}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}