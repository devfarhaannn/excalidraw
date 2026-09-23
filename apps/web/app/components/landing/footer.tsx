"use client";

import Link from "next/link";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#17171B] text-white">

            {/* Subtle Draivo background pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 12% 20%, #625DF5 0 2px, transparent 3px),
            radial-gradient(circle at 82% 30%, #72E6A7 0 2px, transparent 3px),
            radial-gradient(circle at 70% 75%, #FFD166 0 2px, transparent 3px),
            linear-gradient(120deg, transparent 49.5%, #ffffff 50%, transparent 50.5%),
            linear-gradient(35deg, transparent 49.5%, #ffffff 50%, transparent 50.5%)
          `,
                    backgroundSize: "180px 180px, 220px 220px, 260px 260px, 90px 90px, 120px 120px",
                }}
            />

            {/* Soft glow */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#625DF5]/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#72E6A7]/[0.06] blur-3xl" />

            <div className="relative mx-auto max-w-[1240px] px-6 py-16 lg:py-20">

                {/* Main footer content */}
                <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">

                    {/* Brand */}
                    <div>

                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center">
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

                            <span className="text-[21px] font-bold tracking-[-0.04em]">
                                Draivo
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
                            A simple visual workspace for turning ideas into
                            something everyone can see.
                        </p>

                        {/* Social icons */}
                        <div className="mt-5 flex items-center gap-3">
                            <a
                                href="https://x.com/farhanbhatt07"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:text-white"
                            >
                                <FaXTwitter size={17} />
                            </a>

                            <a
                                href="https://www.linkedin.com/in/farhanbhatt"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:text-white"
                            >
                                <FaLinkedinIn size={17} />
                            </a>

                            <a
                                href="https://github.com/devfarhaannn/excalidraw"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:text-white"
                            >
                                <FaGithub size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Product
                        </h3>

                        <div className="mt-5 space-y-4">

                            <a
                                href="#features"
                                className="block text-sm text-white/55 transition-colors hover:text-white"
                            >
                                Features
                            </a>

                            <a
                                href="#collaboration"
                                className="block text-sm text-white/55 transition-colors hover:text-white"
                            >
                                Collaboration
                            </a>

                            <a
                                href="#how-it-works"
                                className="block text-sm text-white/55 transition-colors hover:text-white"
                            >
                                How it works
                            </a>

                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Company
                        </h3>

                        <div className="mt-5 space-y-4">

                            <a
                                href="#about"
                                className="block text-sm text-white/55 transition-colors hover:text-white"
                            >
                                About
                            </a>

                            <a
                                href="mailto:hello@draivo.com"
                                className="block text-sm text-white/55 transition-colors hover:text-white"
                            >
                                Contact
                            </a>

                        </div>
                    </div>

                    {/* Get started */}
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Get started
                        </h3>

                        <div className="mt-5 space-y-4">

                            <Link
                                href="/signin"
                                className="block text-sm text-white/55 transition-colors hover:text-white"
                            >
                                Sign in
                            </Link>

                            <Link
                                href="/signup"
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#9a96ff] transition-colors hover:text-white"
                            >
                                Start drawing

                                <span className="transition-transform duration-200 group-hover:translate-x-1">
                                    →
                                </span>
                            </Link>

                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-12 h-px bg-white/10" />

                {/* Bottom */}
                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-white/40">
                        © 2026 Draivo. All rights reserved.
                    </p>

                    <p className="text-white/30">
                        Think visually. Build together.
                    </p>

                </div>
            </div>
        </footer>
    );
}