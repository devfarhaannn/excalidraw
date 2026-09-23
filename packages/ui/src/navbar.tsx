"use client";

import { Button } from "./button";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
            ✦
          </span>

          Draivo
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#collaboration"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Collaboration
          </a>

          <a
            href="#about"
            className="text-sm text-white/70 transition hover:text-white"
          >
            About
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/signin"
            className="hidden text-sm text-white/75 transition hover:text-white sm:block"
          >
            Sign in
          </a>

          <a href="/signup">
            <Button
              className="rounded-full px-5"
            >
              Get started
            </Button>
          </a>
        </div>

      </div>
    </header>
  );
}