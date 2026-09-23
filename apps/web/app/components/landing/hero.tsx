"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { CanvasPreview } from "./canvas-preview";

export function Hero() {
  return (
    <main className="relative overflow-hidden bg-white pt-[128px]">

      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, rgba(98,93,245,0.07), transparent 45%)",
        }}
      />

      <section className="relative mx-auto max-w-[1400px] px-6 text-center">

        {/* Announcement */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-[#e7e7e7] bg-white px-4 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <span className="text-[#625df5]">✦</span>

          <span className="text-xs font-medium text-[#555] sm:text-sm">
            Collaborative whiteboarding, reimagined
          </span>
        </div>

        {/* Hero heading */}
        <h1 className="mx-auto max-w-5xl text-[clamp(3.5rem,7vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-[#111]">
          Ideas become
          <br />

          <span className="relative inline-block text-[#625df5]">
            visual.

            <svg
              className="absolute -bottom-4 left-1/2 hidden w-[115%] -translate-x-1/2 sm:block"
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
        <p className="mx-auto mt-9 max-w-2xl text-base leading-7 text-[#666] sm:text-lg">
          Draivo is a collaborative digital whiteboard where teams
          sketch ideas, plan projects, and build together in real time.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link href="/signup">
            <Button
              size="lg"
              className="h-12 rounded-full bg-[#625df5] px-7 font-semibold text-white shadow-[0_8px_24px_rgba(98,93,245,0.20)] transition-all hover:-translate-y-[1px] hover:bg-[#514cf0]"
            >
              Start drawing
              <span className="ml-2">→</span>
            </Button>
          </Link>

          <Link href="#product">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-[#d9d9d9] bg-white px-7 text-black transition-all hover:bg-[#f7f7f7]"
            >
              See how it works
            </Button>
          </Link>
        </div>

        {/* Supporting text */}
        <p className="mt-4 text-xs text-[#999]">
          Free to use · No credit card required
        </p>

        {/* Product preview */}
        <CanvasPreview />

      </section>

      <div className="h-32" />
    </main>
  );
}