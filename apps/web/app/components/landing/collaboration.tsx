"use client";

export function Collaboration() {
  return (
    <section
      id="collaboration"
      className="relative overflow-hidden bg-[#fafaff] px-6 py-28 lg:py-36"
    >
      <div className="mx-auto grid max-w-[1240px] items-center gap-16 lg:grid-cols-2 lg:gap-20">

        {/* LEFT — Text */}
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#625DF5]">
            Built for teams
          </p>

          <h2 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#17171B] sm:text-5xl lg:text-6xl">
            Great ideas get
            <br />
            <span className="text-[#625DF5]">
              better together.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#666] sm:text-lg">
            Bring everyone into the same visual space. Sketch ideas,
            leave feedback, move things around, and watch the canvas
            evolve together.
          </p>

          {/* Points */}
          <div className="mt-9 space-y-5">

            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#625DF5]/10 text-[#625DF5]">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-[#222]">
                  Real-time collaboration
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#777]">
                  Everyone can work on the same canvas at the same time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#72E6A7]/15 text-[#32925c]">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-[#222]">
                  See who's working
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#777]">
                  Follow teammates as they move around the canvas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD166]/20 text-[#b17a00]">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-[#222]">
                  Keep the conversation visual
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#777]">
                  Comments and ideas stay connected to the work.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT — Collaboration visual */}
        <div className="relative">

          {/* Glow */}
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#625DF5]/10 blur-3xl" />

          {/* Canvas */}
          <div className="relative overflow-hidden rounded-[28px] border border-[#dedee8] bg-white shadow-[0_30px_90px_rgba(50,45,120,0.12)]">

            {/* Top bar */}
            <div className="flex h-14 items-center justify-between border-b border-[#eeeeee] px-5">

              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#72E6A7]" />

                <span className="text-xs font-semibold text-[#555]">
                  Product brainstorm
                </span>
              </div>

              {/* Avatars */}
              <div className="flex -space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#625DF5] text-[9px] font-bold text-white">
                  F
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#f09b62] text-[9px] font-bold text-white">
                  N
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#63a37c] text-[9px] font-bold text-white">
                  C
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#333] text-[9px] font-bold text-white">
                  +
                </div>
              </div>

            </div>

            {/* Board */}
            <div className="draivo-grid relative h-[430px] overflow-hidden">

              {/* Sticky note 1 */}
              <div className="absolute left-[12%] top-[15%] w-[145px] rotate-[-4deg] rounded-lg border border-[#e8d98d] bg-[#fff8bd] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9a8b32]">
                  Idea
                </p>

                <p className="mt-2 text-sm font-semibold leading-5 text-[#45401c]">
                  Make onboarding simpler
                </p>
              </div>

              {/* Sticky note 2 */}
              <div className="absolute right-[12%] top-[18%] w-[150px] rotate-[3deg] rounded-lg border border-[#b8e4c9] bg-[#eafff0] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4d9667]">
                  Feedback
                </p>

                <p className="mt-2 text-sm font-semibold leading-5 text-[#315d40]">
                  Could we reduce the steps?
                </p>
              </div>

              {/* Center diagram */}
              <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2">

                <div className="flex h-28 w-40 items-center justify-center rounded-2xl border-2 border-[#625DF5] bg-white shadow-[0_10px_30px_rgba(98,93,245,0.12)]">
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#625DF5]">
                      Core idea
                    </p>

                    <p className="mt-2 text-lg font-semibold text-[#222]">
                      Better onboarding
                    </p>
                  </div>
                </div>

              </div>

              {/* Connecting lines */}
              <div className="absolute left-[30%] top-[37%] h-[2px] w-[22%] rotate-[24deg] bg-[#625DF5]/30" />

              <div className="absolute right-[30%] top-[38%] h-[2px] w-[20%] rotate-[-22deg] bg-[#625DF5]/30" />

              {/* Farhan cursor */}
              <div className="absolute bottom-[18%] left-[24%] animate-[cursorFloat_6s_ease-in-out_infinite]">
                <span className="text-2xl text-[#625DF5]">
                  ↖
                </span>

                <span className="ml-1 rounded-full bg-[#625DF5] px-2 py-1 text-[9px] font-medium text-white">
                  Critiano
                </span>
              </div>

              {/* Sarah cursor */}
              <div className="absolute bottom-[25%] right-[22%] animate-[cursorFloat_7s_ease-in-out_infinite]">
                <span className="text-2xl text-[#f08c36]">
                  ↖
                </span>

                <span className="ml-1 rounded-full bg-[#f08c36] px-2 py-1 text-[9px] font-medium text-white">
                  Georgina
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}