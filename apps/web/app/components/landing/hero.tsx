"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";

export function Hero() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white pt-[88px]">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#625df5]/10 blur-3xl" />

        <div className="absolute left-[8%] top-[35%] h-40 w-40 rounded-full bg-[#72E6A7]/10 blur-3xl" />

        <div className="absolute right-[8%] top-[45%] h-52 w-52 rounded-full bg-[#FFD166]/10 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative mx-auto flex max-w-[1400px] flex-col items-center px-6 pb-24 pt-20 text-center">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e7e7e7] bg-white px-4 py-2 shadow-sm">
          <span className="text-[#625df5]">✦</span>

          <span className="text-sm font-medium text-[#555]">
            Collaborative whiteboarding, reimagined
          </span>
        </div>

        {/* Heading */}
        <h1 className="max-w-5xl text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-[#17171B]">
          Ideas become

          <span className="relative block text-[#625df5]">
            visual.

            {/* Hand drawn underline */}
            <svg
              className="absolute -bottom-5 left-1/2 w-[115%] -translate-x-1/2"
              viewBox="0 0 500 25"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 17C125 5 355 5 492 16"
                stroke="#625df5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 7"
              />
            </svg>
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-10 max-w-2xl text-base leading-7 text-[#666] sm:text-lg">
          Draivo is a collaborative digital whiteboard where teams
          sketch ideas, plan projects, and build together in real time.
        </p>

        {/* CTA */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

          {/* Start drawing */}
          <Link href="/signup">
            <Button
              size="lg"
              className="h-12 rounded-full bg-[#625df5] px-7 font-semibold text-white shadow-[0_10px_30px_rgba(98,93,245,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#514cf0] hover:shadow-[0_14px_35px_rgba(98,93,245,0.30)]"
            >
              Start drawing
              <span className="ml-2 text-lg">→</span>
            </Button>
          </Link>

          {/* See how it works */}
          <Link href="#product">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-[#d9d9d9] bg-white px-7 font-medium text-[#222] hover:bg-[#f8f8fc]"
            >
              See how it works
            </Button>
          </Link>

        </div>

        {/* Small text */}
        <p className="mt-4 text-xs text-[#999]">
          Free to use · No credit card required
        </p>

        {/* ================================================== */}
        {/* PEN / ARROW MARK */}
        {/* ================================================== */}

        <div className="relative mt-3 h-[100px] w-full max-w-[1180px]">

          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">

            <svg
              width="72"
              height="120"
              viewBox="0 0 72 120"
              fill="none"
              className="animate-[float_5s_ease-in-out_infinite]"
              aria-hidden="true"
            >
              {/* Pen body */}
              <path
                d="M25 2H48L51 82L37 105L22 82L25 2Z"
                fill="#F8F8FC"
                stroke="#4B4B55"
                strokeWidth="2.5"
              />

              {/* Pen button */}
              <circle
                cx="36.5"
                cy="73"
                r="7"
                fill="white"
                stroke="#4B4B55"
                strokeWidth="2.5"
              />

              {/* Pen tip */}
              <path
                d="M22 82L37 105L51 82"
                fill="#ECECFA"
                stroke="#4B4B55"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Small top line */}
              <path
                d="M28 8H45"
                stroke="#D7D7E8"
                strokeWidth="1.5"
              />
            </svg>

          </div>
        </div>

        {/* ================================================== */}
        {/* CANVAS PREVIEW */}
        {/* ================================================== */}

        <div
          id="product"
          className="relative w-full max-w-[1180px]"
        >

          {/* Application window */}
          <div className="overflow-hidden rounded-[24px] border border-[#dedede] bg-white text-left shadow-[0_30px_100px_rgba(40,35,100,0.14)]">

            {/* Toolbar */}
            <div className="flex h-14 items-center justify-between border-b border-[#eeeeee] px-4">

              {/* Left */}
              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#625df5] text-sm font-semibold text-white">
                  D
                </div>

                <span className="text-sm font-semibold text-[#333]">
                  Draivo canvas
                </span>

              </div>

              {/* Tools */}
              <div className="hidden items-center gap-1 rounded-xl border border-[#e8e8e8] bg-white p-1 shadow-sm sm:flex">

                {["↖", "□", "◇", "○", "→", "T", "✎", "▧"].map(
                  (tool, index) => (
                    <button
                      key={tool}
                      type="button"
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition ${
                        index === 0
                          ? "bg-black text-white"
                          : "text-[#555] hover:bg-[#f5f4ff]"
                      }`}
                    >
                      {tool}
                    </button>
                  )
                )}

              </div>

              {/* Users */}
              <div className="flex -space-x-2">

                {["F", "A", "S", "D"].map((letter, index) => (
                  <div
                    key={letter}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${
                      index === 0
                        ? "bg-[#625df5]"
                        : index === 1
                          ? "bg-[#f09b62]"
                          : index === 2
                            ? "bg-[#63a37c]"
                            : "bg-[#222]"
                    }`}
                  >
                    {letter}
                  </div>
                ))}

              </div>

            </div>

            {/* Canvas */}
            <div className="draivo-grid relative h-[420px] overflow-hidden sm:h-[500px]">

              {/* Left panel */}
              <div className="absolute left-5 top-5 hidden w-40 rounded-xl border border-[#e5e5e5] bg-white p-4 shadow-sm md:block">

                <p className="text-xs font-semibold text-[#555]">
                  Properties
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "#171717",
                    "#625df5",
                    "#ef4444",
                    "#22a35a",
                    "#f08c36",
                    "#315dcc",
                  ].map((color) => (
                    <span
                      key={color}
                      className="h-6 w-6 rounded-md border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="mt-6 h-1 rounded-full bg-[#eee]">
                  <div className="h-1 w-2/3 rounded-full bg-[#625df5]" />
                </div>

              </div>

              {/* Main board */}
              <div className="absolute left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2 sm:w-[44%]">

                <div className="relative aspect-[1.4] rotate-[-2deg] border-[3px] border-[#f3a14c] bg-[#fffefa] shadow-lg">

                  <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(135deg,transparent,transparent_5px,#eeeefa_5px,#eeeefa_7px)]" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888]">
                      Draivo
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-[#222] sm:text-4xl">
                      Build together.
                    </p>

                  </div>

                </div>

              </div>

              {/* Right comments */}
              <div className="absolute right-5 top-5 hidden w-52 rounded-xl border border-[#e5e5e5] bg-white shadow-sm md:block">

                <div className="border-b border-[#eee] p-3">
                  <p className="text-xs font-semibold text-[#333]">
                    Comments
                  </p>
                </div>

                {[
                  "Love this direction.",
                  "Let's explore this idea.",
                  "Looks good to me.",
                ].map((comment) => (
                  <div
                    key={comment}
                    className="border-b border-[#f1f1f1] p-3"
                  >
                    <div className="flex items-center gap-2">

                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#625df5] text-[9px] font-bold text-white">
                        A
                      </span>

                      <span className="text-[10px] font-semibold text-[#444]">
                        Teammate
                      </span>

                    </div>

                    <p className="mt-2 text-[10px] text-[#777]">
                      {comment}
                    </p>

                  </div>
                ))}

              </div>

              {/* Farhan cursor */}
              <div className="absolute left-[25%] top-[60%] animate-[cursorFloat_6s_ease-in-out_infinite]">

                <span className="text-2xl text-[#625df5]">
                  ↖
                </span>

                <span className="ml-1 rounded-full bg-[#625df5] px-2 py-1 text-[9px] text-white">
                  Farhan
                </span>

              </div>

            </div>
          </div>

        </div>

      </section>
    </main>
  );
}