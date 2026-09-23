"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/[0.08] bg-white/75 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[88px] w-full max-w-[1440px] items-center px-6 lg:px-10">

        {/* LOGO */}
        <a
          href="/"
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="relative flex h-11 w-11 items-center justify-center">
            <svg
              width="44"
              height="44"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:rotate-3"
            >
              <path
                d="M20 3L35 12V28L20 37L5 28V12L20 3Z"
                fill="#625DF5"
              />

              <path
                d="M13 13.5H21.5C25.1 13.5 27.5 16 27.5 20C27.5 24 25.1 26.5 21.5 26.5H13V13.5Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M13 17.5L20 22.5"
                stroke="#FFD166"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <circle
                cx="13"
                cy="17.5"
                r="1.5"
                fill="#72E6A7"
              />
            </svg>
          </div>

          <span className="text-[21px] font-bold tracking-[-0.04em] text-[#17171B]">
            Draivo
          </span>
        </a>

        {/* CENTER NAVIGATION */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">

          <a
            href="#features"
            className="rounded-lg px-5 py-3 text-[15px] font-medium text-[#45454D] transition-all duration-200 hover:bg-[#F5F4FF] hover:text-[#625DF5]"
          >
            Features
          </a>

          <a
            href="#collaboration"
            className="rounded-lg px-5 py-3 text-[15px] font-medium text-[#45454D] transition-all duration-200 hover:bg-[#F5F4FF] hover:text-[#625DF5]"
          >
            Collaboration
          </a>

          <a
            href="#how-it-works"
            className="rounded-lg px-5 py-3 text-[15px] font-medium text-[#45454D] transition-all duration-200 hover:bg-[#F5F4FF] hover:text-[#625DF5]"
          >
            How it works
          </a>

          <a
            href="#about"
            className="rounded-lg px-5 py-3 text-[15px] font-medium text-[#45454D] transition-all duration-200 hover:bg-[#F5F4FF] hover:text-[#625DF5]"
          >
            About
          </a>

        </nav>

        {/* RIGHT ACTIONS */}
        <div className="ml-auto flex items-center gap-5">

          {/* Sign in */}
          <a
            href="/signin"
            className="hidden px-3 py-3 text-[15px] font-semibold text-[#25252A] transition-colors hover:text-[#625DF5] sm:block"
          >
            Sign in
          </a>

          {/* Get started */}
          <a
            href="/signup"
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#625DF5] px-6 text-[15px] font-semibold text-white shadow-[0_7px_20px_rgba(98,93,245,0.20)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#554FF0] hover:shadow-[0_10px_28px_rgba(98,93,245,0.30)]"
          >
            <span>Get started</span>

            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M13 6L19 12L13 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

        </div>
      </div>
    </header>
  );
}