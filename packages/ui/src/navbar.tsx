"use client";

export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-[100] h-[72px] border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-6 lg:px-10">

        {/* =====================================================
            LEFT
        ====================================================== */}
        <div className="flex flex-1 items-center">
          <a
            href="/"
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              <svg
                width="40"
                height="40"
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

            <span className="whitespace-nowrap text-[21px] font-bold tracking-[-0.04em] text-[#17171B]">
              Draivo
            </span>
          </a>
        </div>


        {/* =====================================================
            CENTER
        ====================================================== */}
        <nav className="hidden shrink-0 items-center gap-1 md:flex">

          <a
            href="#features"
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#45454D] transition-all duration-200 hover:bg-[#F5F4FF] hover:text-[#625DF5]"
          >
            Features
          </a>

          <a
            href="#collaboration"
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#45454D] transition-all duration-200 hover:bg-[#F5F4FF] hover:text-[#625DF5]"
          >
            Collaboration
          </a>

          <a
            href="#how-it-works"
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#45454D] transition-all duration-200 hover:bg-[#F5F4FF] hover:text-[#625DF5]"
          >
            How it works
          </a>

          <a
            href="#about"
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#45454D] transition-all duration-200 hover:bg-[#F5F4FF] hover:text-[#625DF5]"
          >
            About
          </a>

        </nav>


        {/* =====================================================
            RIGHT
        ====================================================== */}
        <div className="flex flex-1 items-center justify-end gap-2">

          {/* Sparkle */}
          <button
            type="button"
            aria-label="Explore Draivo"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#55555D] transition-all hover:bg-[#F5F4FF] hover:text-[#625DF5] lg:flex"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3L14.2 9.8L21 12L14.2 14.2L12 21L9.8 14.2L3 12L9.8 9.8L12 3Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </button>


          {/* Sign in */}
          <a
            href="/signin"
            className="whitespace-nowrap rounded-lg px-3 py-2.5 text-[14px] font-semibold text-[#25252A] transition-colors hover:text-[#625DF5]"
          >
            Sign in
          </a>


          {/* Get started */}
          <a
            href="/signup"
            className="group inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#625DF5] px-5 text-[14px] font-semibold text-white shadow-[0_7px_20px_rgba(98,93,245,0.20)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#554FF0] hover:shadow-[0_10px_28px_rgba(98,93,245,0.30)]"
          >
            <span>Get started</span>

            <svg
              width="15"
              height="15"
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