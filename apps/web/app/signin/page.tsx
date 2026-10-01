"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { SigninSchema } from "@repo/common/types";
import { Button } from "@repo/ui/components/ui/button";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type FieldErrors = {
  username?: string;
  password?: string;
};

export default function SigninPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setFieldErrors({});

    // Validate using shared SigninSchema
    const result = SigninSchema.safeParse({
      username,
      password,
    });

    if (!result.success) {
      const errors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field === "username" || field === "password") {
          if (!errors[field]) {
            errors[field] = issue.message;
          }
        }
      }

      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Invalid email or password"
        );
      }

      // Save JWT
      localStorage.setItem("token", data.token);

      // Go to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070B] text-white">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(98,93,245,0.24),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(98,93,245,0.14),transparent_25%),radial-gradient(circle_at_75%_90%,rgba(240,140,54,0.10),transparent_28%),radial-gradient(circle_at_20%_90%,rgba(114,230,167,0.08),transparent_25%)]" />

        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:64px_64px]" />

        <motion.div
          className="absolute -left-32 top-[-100px] h-[460px] w-[460px] rounded-full bg-[#625DF5]/15 blur-[130px]"
          animate={{
            x: [0, 90, 20, 0],
            y: [0, 50, 100, 0],
            scale: [1, 1.12, 0.94, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -right-40 top-[35%] h-[420px] w-[420px] rounded-full bg-[#7C65FF]/12 blur-[120px]"
          animate={{
            x: [0, -70, 20, 0],
            y: [0, -40, 60, 0],
            scale: [1, 0.92, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-[-180px] left-[34%] h-[380px] w-[380px] rounded-full bg-[#F08C36]/10 blur-[120px]"
          animate={{
            x: [0, 60, -20, 0],
            y: [0, -40, -10, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d="M-100 270 C180 150 330 360 550 245 C760 135 860 310 1060 210 C1230 125 1320 215 1540 100"
          stroke="#625DF5"
          strokeWidth="1.5"
          strokeDasharray="12 18"
          initial={{
            pathLength: 0,
            opacity: 0,
          }}
          animate={{
            pathLength: 1,
            opacity: 0.55,
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
          }}
        />

        <motion.path
          d="M-80 760 C150 650 300 820 510 710 C720 600 860 760 1030 650 C1220 525 1350 690 1530 575"
          stroke="#F08C36"
          strokeWidth="1"
          strokeDasharray="8 16"
          initial={{
            pathLength: 0,
            opacity: 0,
          }}
          animate={{
            pathLength: 1,
            opacity: 0.4,
          }}
          transition={{
            duration: 3.5,
            delay: 0.4,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1fr_430px]">
          
          <section className="hidden lg:block">
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="mb-16 flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 40 40"
                  fill="none"
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

              <span className="text-[22px] font-bold tracking-[-0.04em]">
                Draivo
              </span>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#625DF5]/20 bg-[#625DF5]/[0.06] px-4 py-2 text-xs font-medium text-[#A9A5FF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#72E6A7] shadow-[0_0_10px_#72E6A7]" />
                Welcome back
              </div>

              <h1 className="max-w-2xl text-6xl font-semibold leading-[0.98] tracking-[-0.06em] xl:text-7xl">
                Pick up
                <br />

                <span className="bg-gradient-to-r from-[#8B86FF] via-[#625DF5] to-[#AFAAFF] bg-clip-text text-transparent">
                  where you left off.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/45">
                Your boards, ideas and collaborations are waiting
                for you.
              </p>
            </motion.div>

            {/* Canvas */}
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.9,
                delay: 0.25,
              }}
              className="relative mt-12 h-[270px] max-w-[650px]"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-white/[0.10] bg-white/[0.035] shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:42px_42px]" />

                {/* Board */}
                <motion.div
                  className="absolute left-[12%] top-[23%] flex h-[75px] w-[120px] rotate-[-7deg] items-center justify-center rounded-2xl bg-[#625DF5] text-sm font-medium text-white shadow-[0_15px_35px_rgba(98,93,245,0.25)]"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [-7, -5, -7],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Your board
                </motion.div>

                {/* Notes */}
                <motion.div
                  className="absolute right-[14%] top-[25%] flex h-[75px] w-[120px] rotate-[5deg] items-center justify-center rounded-2xl bg-[#FFD166] text-sm font-semibold text-[#30280B]"
                  animate={{
                    y: [0, 8, 0],
                    rotate: [5, 7, 5],
                  }}
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                >
                  Team notes
                </motion.div>

                {/* Center */}
                <motion.div
                  className="absolute left-1/2 top-1/2 flex h-[82px] w-[175px] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] items-center justify-center rounded-2xl border border-white/10 bg-[#171722]/90 px-4 text-center shadow-2xl"
                  animate={{
                    y: [
                      "-50%",
                      "calc(-50% - 6px)",
                      "-50%",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                      Draivo
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      Welcome back.
                    </p>
                  </div>
                </motion.div>

                {/* Cursor 1 */}
                <motion.div
                  className="absolute bottom-[18%] left-[29%]"
                  animate={{
                    x: [0, 45, 10, 0],
                    y: [0, -15, 6, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    width="23"
                    height="29"
                    viewBox="0 0 24 30"
                    fill="none"
                  >
                    <path
                      d="M3 2L20.5 20.5L12.5 21.5L17 28L13.5 30L9 23L3 28V2Z"
                      fill="#625DF5"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </motion.div>

                {/* Cursor 2 */}
                <motion.div
                  className="absolute bottom-[21%] right-[28%]"
                  animate={{
                    x: [0, -40, -10, 0],
                    y: [0, -18, 5, 0],
                  }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                >
                  <svg
                    width="23"
                    height="29"
                    viewBox="0 0 24 30"
                    fill="none"
                  >
                    <path
                      d="M3 2L20.5 20.5L12.5 21.5L17 28L13.5 30L9 23L3 28V2Z"
                      fill="#F08C36"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1.2,
              }}
              className="mt-5 flex items-center gap-3 text-xs text-white/30"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#72E6A7]" />

              Your workspace

              <span>•</span>

              Your ideas

              <span>•</span>

              Your team
            </motion.div>
          </section>

          
          <section>
            {/* Mobile logo */}
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="mb-8 flex items-center justify-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M20 3L35 12V28L20 37L5 28V12L20 3Z"
                    fill="#625DF5"
                  />

                  <path
                    d="M13 13.5H21.5C25.1 13.5 27.5 16 27.5 20C27.5 24 25.1 26.5 21.5 26.5H13V13.5Z"
                    stroke="white"
                    strokeWidth="2"
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

              <span className="text-[22px] font-bold">
                Draivo
              </span>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="relative overflow-hidden rounded-[30px] border border-white/[0.12] bg-white/[0.065] p-6 shadow-[0_35px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8"
            >
              {/* Top glow */}
              <motion.div
                className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#8B86FF] to-transparent"
                animate={{
                  opacity: [0.35, 1, 0.35],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Corner glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#625DF5]/15 blur-[80px]" />

              <div className="relative">
                <div className="mb-8">
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/30">
                    Welcome back
                  </p>

                  <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white">
                    Sign in to
                    <span className="block bg-gradient-to-r from-[#A9A5FF] via-[#817CFF] to-[#625DF5] bg-clip-text text-transparent">
                      Draivo.
                    </span>
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    Continue creating, collaborating and
                    bringing ideas to life.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
                >
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      Email address
                    </label>

                    <input
                      id="username"
                      type="email"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        clearFieldError("username");
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`h-12 w-full rounded-xl border bg-black/20 px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 hover:border-white/[0.18] focus:bg-black/25 focus:ring-4 ${
                        fieldErrors.username
                          ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/10"
                          : "border-white/[0.10] focus:border-[#817CFF] focus:ring-[#625DF5]/10"
                      }`}
                    />

                    {fieldErrors.username && (
                      <motion.p
                        initial={{
                          opacity: 0,
                          y: -4,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="mt-2 text-xs text-red-300"
                      >
                        {fieldErrors.username}
                      </motion.p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearFieldError("password");
                      }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`h-12 w-full rounded-xl border bg-black/20 px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 hover:border-white/[0.18] focus:bg-black/25 focus:ring-4 ${
                        fieldErrors.password
                          ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/10"
                          : "border-white/[0.10] focus:border-[#817CFF] focus:ring-[#625DF5]/10"
                      }`}
                    />

                    {fieldErrors.password && (
                      <motion.p
                        initial={{
                          opacity: 0,
                          y: -4,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="mt-2 text-xs text-red-300"
                      >
                        {fieldErrors.password}
                      </motion.p>
                    )}
                  </div>

                  {/* API error */}
                  {error && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Sign in */}
                  <motion.div
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="group h-13 w-full rounded-xl bg-[#625DF5] text-white shadow-[0_12px_35px_rgba(98,93,245,0.30)] transition-all hover:bg-[#716CFF] hover:shadow-[0_18px_45px_rgba(98,93,245,0.38)]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Sign in

                          <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.08]" />

                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/20">
                    New to Draivo?
                  </span>

                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                {/* Signup */}
                <p className="text-center text-sm text-white/40">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-[#A9A5FF] transition hover:text-white"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </motion.div>

            <p className="mt-6 text-center text-[11px] text-white/20">
              Your workspace is waiting for you.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}