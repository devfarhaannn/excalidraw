"use client";

import Link from "next/link";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[32px] border border-[#e7e7e7] bg-[#fafaff] px-6 py-20 text-center shadow-[0_20px_70px_rgba(30,30,60,0.06)] sm:px-10 lg:px-16 lg:py-24">

        {/* Soft background decoration */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#625DF5]/[0.08] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-[#72E6A7]/[0.10] blur-3xl" />

        {/* Decorative dots */}
        <div className="pointer-events-none absolute left-[12%] top-[25%] h-2 w-2 rounded-full bg-[#72E6A7]" />

        <div className="pointer-events-none absolute right-[14%] top-[32%] h-2.5 w-2.5 rounded-full bg-[#FFD166]" />

        {/* Content */}
        <div className="relative mx-auto max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#625DF5]">
            Start creating
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#17171B] sm:text-5xl lg:text-6xl">
            Your next great idea
            <br />
            <span className="text-[#625DF5]">
              starts here.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#666] sm:text-lg">
            Open a canvas, bring your team together, and turn your
            ideas into something everyone can see.
          </p>

          {/* Actions */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              href="/signup"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#625DF5] px-7 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(98,93,245,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#554FF0] hover:shadow-[0_12px_30px_rgba(98,93,245,0.28)]"
            >
              Start drawing

              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center rounded-full border border-[#dedee8] bg-white px-7 text-sm font-semibold text-[#25252A] transition-all duration-200 hover:border-[#625DF5]/30 hover:bg-[#f9f8ff] hover:text-[#625DF5]"
            >
              See how it works
            </Link>

          </div>

          <p className="mt-5 text-xs text-[#999]">
            Free to use · No credit card required
          </p>

        </div>
      </div>
    </section>
  );
}