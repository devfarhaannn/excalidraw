"use client";

import Link from "next/link";

export function About() {
    return (
        <section
            id="about"
            className="relative overflow-hidden bg-white px-6 py-28 lg:py-36"
        >
            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#625DF5]/[0.06] blur-3xl" />

            <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#72E6A7]/[0.07] blur-3xl" />

            <div className="relative mx-auto max-w-[1240px]">

                {/* Top label */}
                <div className="max-w-3xl">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#625DF5]">
                        About Draivo
                    </p>

                    <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#17171B] sm:text-5xl lg:text-6xl">
                        A simpler way to
                        <br />
                        <span className="text-[#625DF5]">
                            think together.
                        </span>
                    </h2>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-[#666] sm:text-lg">
                        Draivo is built around one simple idea: teams should be able
                        to see their ideas as they build them. Instead of switching
                        between documents, chats, and diagrams, bring everything into
                        one shared visual workspace.
                    </p>
                </div>

                {/* Main content */}
                <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

                    {/* Large visual card */}
                    <div className="relative min-h-[430px] overflow-hidden rounded-[28px] border border-[#e7e7e7] bg-[#fafaff] p-7 shadow-[0_20px_70px_rgba(30,30,60,0.06)] sm:p-10">

                        {/* Grid */}
                        <div className="draivo-grid absolute inset-0 opacity-70" />

                        <div className="relative h-full">

                            {/* Small label */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#e4e4ef] bg-white px-3 py-2 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-[#72E6A7]" />
                                <span className="text-xs font-semibold text-[#555]">
                                    One shared workspace
                                </span>
                            </div>

                            {/* Central idea */}
                            <div className="absolute left-1/2 top-[52%] w-[210px] -translate-x-1/2 -translate-y-1/2 sm:w-[250px]">

                                <div className="rounded-2xl border-2 border-[#625DF5] bg-white p-6 text-center shadow-[0_18px_45px_rgba(98,93,245,0.12)]">

                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#625DF5]">
                                        Draivo
                                    </p>

                                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#222] sm:text-2xl">
                                        Think visually.
                                    </h3>

                                </div>
                            </div>

                            {/* Connecting line 1 */}
                            <div className="absolute left-[20%] top-[40%] h-[2px] w-[27%] rotate-[18deg] bg-[#625DF5]/25" />

                            {/* Connecting line 2 */}
                            <div className="absolute right-[18%] top-[42%] h-[2px] w-[25%] rotate-[-18deg] bg-[#625DF5]/25" />

                            {/* Idea card */}
                            <div className="absolute left-[7%] top-[25%] w-[130px] rotate-[-5deg] rounded-xl border border-[#e8d98d] bg-[#fff8bd] p-4 shadow-sm sm:w-[145px]">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-[#9a8b32]">
                                    Idea
                                </p>

                                <p className="mt-2 text-xs font-semibold leading-5 text-[#45401c]">
                                    New product concept
                                </p>
                            </div>

                            {/* Team card */}
                            <div className="absolute right-[7%] top-[27%] w-[130px] rotate-[4deg] rounded-xl border border-[#b8e4c9] bg-[#eafff0] p-4 shadow-sm sm:w-[145px]">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-[#4d9667]">
                                    Team
                                </p>

                                <p className="mt-2 text-xs font-semibold leading-5 text-[#315d40]">
                                    Everyone contributes
                                </p>
                            </div>

                            {/* Bottom note */}
                            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#e3e3e3] bg-white px-4 py-2 text-xs font-medium text-[#666] shadow-sm">
                                From idea → to something real
                            </div>

                            {/* Cursor */}
                            <div className="absolute bottom-[22%] left-[24%] animate-[cursorFloat_6s_ease-in-out_infinite]">
                                <span className="text-2xl text-[#625DF5]">
                                    ↖
                                </span>

                                <span className="ml-1 rounded-full bg-[#625DF5] px-2 py-1 text-[9px] font-medium text-white">
                                    Johnn
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Right information */}
                    <div className="flex flex-col gap-5">

                        {/* Mission */}
                        <div className="rounded-[24px] border border-[#e7e7e7] bg-white p-7 shadow-[0_15px_50px_rgba(30,30,60,0.05)] sm:p-8">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#625DF5]/10 text-lg text-[#625DF5]">
                                ✦
                            </div>

                            <h3 className="mt-6 text-2xl font-semibold tracking-[-0.035em] text-[#17171B]">
                                Made for ideas in motion.
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-[#707070]">
                                Whether you're brainstorming a product, planning a
                                project, or explaining a complex idea, Draivo keeps
                                the visual thinking process simple and connected.
                            </p>
                        </div>

                        {/* Principles */}
                        <div className="rounded-[24px] border border-[#e7e7e7] bg-[#fafafa] p-7 sm:p-8">

                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#999]">
                                What we believe
                            </p>

                            <div className="mt-6 space-y-5">

                                <div className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#625DF5]/10 text-sm font-semibold text-[#625DF5]">
                                        1
                                    </span>

                                    <div>
                                        <h4 className="font-semibold text-[#222]">
                                            Visual thinking should feel natural.
                                        </h4>

                                        <p className="mt-1 text-sm leading-6 text-[#777]">
                                            Tools should help ideas flow instead of slowing
                                            people down.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#72E6A7]/15 text-sm font-semibold text-[#32925c]">
                                        2
                                    </span>

                                    <div>
                                        <h4 className="font-semibold text-[#222]">
                                            Collaboration belongs in the canvas.
                                        </h4>

                                        <p className="mt-1 text-sm leading-6 text-[#777]">
                                            Ideas become clearer when everyone can contribute
                                            to the same space.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFD166]/20 text-sm font-semibold text-[#b17a00]">
                                        3
                                    </span>

                                    <div>
                                        <h4 className="font-semibold text-[#222]">
                                            Keep things simple.
                                        </h4>

                                        <p className="mt-1 text-sm leading-6 text-[#777]">
                                            The best workspace is one that gets out of the
                                            way and lets the team focus.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom statement */}
                <div className="mt-16 border-t border-[#e8e8e8] pt-8">
                    <p className="max-w-2xl text-sm leading-6 text-[#777]">
                        Ready to turn your next idea into something everyone can see?
                    </p>
                </div>
            </div>
        </section>
    );
}