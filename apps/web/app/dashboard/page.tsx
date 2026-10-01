"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";



type Accent = "purple" | "orange" | "green";

type Board = {
  id: number;
  name: string;
  updated: string;
  collaborators: number;
  starred: boolean;
  shared: boolean;
  accent: Accent;
};

type IconProps = {
  className?: string;
};


function IconGrid({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconClock({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconUsers({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M17 11a4 4 0 0 0 0-8" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  );
}

function IconStar({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3z" />
    </svg>
  );
}

function IconSettings({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56v.1h-2.55v-.1A1.7 1.7 0 0 0 11.45 18a1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.1 15a1.7 1.7 0 0 0-1.56-1.03h-.1v-2.54h.1A1.7 1.7 0 0 0 8.1 10.4a1.7 1.7 0 0 0-.34-1.88L7.7 8.46l1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.47 5.5v-.1h2.55v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.1v2.54h-.1A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

function IconLogout({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function IconSearch({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function IconPlus({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconArrowUpRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function IconArrowRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function IconMore({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

function IconMenu({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function IconClose({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function IconChevronLeft({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconSparkles({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.2 4.1a2.7 2.7 0 0 1-1.7 1.7L5 10l4.1 1.2a2.7 2.7 0 0 1 1.7 1.7L12 17l1.2-4.1a2.7 2.7 0 0 1 1.7-1.7L19 10l-4.1-1.2a2.7 2.7 0 0 1-1.7-1.7L12 3Z" />
      <path d="m19 16-.55 1.9a1.3 1.3 0 0 1-.85.85L15.7 19l1.9.55a1.3 1.3 0 0 1 .85.85L19 22l.55-1.6a1.3 1.3 0 0 1 .85-.85L22 19l-1.6-.65a1.3 1.3 0 0 1-.85-.85L19 16Z" />
    </svg>
  );
}


const boards: Board[] = [
  {
    id: 1,
    name: "Product Flow",
    updated: "2 hours ago",
    collaborators: 4,
    starred: true,
    shared: true,
    accent: "purple",
  },
  {
    id: 2,
    name: "Website Architecture",
    updated: "Yesterday",
    collaborators: 2,
    starred: false,
    shared: true,
    accent: "orange",
  },
  {
    id: 3,
    name: "Sprint Planning",
    updated: "2 days ago",
    collaborators: 6,
    starred: true,
    shared: true,
    accent: "green",
  },
  {
    id: 4,
    name: "Mobile App",
    updated: "4 days ago",
    collaborators: 3,
    starred: false,
    shared: false,
    accent: "purple",
  },
  {
    id: 5,
    name: "Database Design",
    updated: "5 days ago",
    collaborators: 2,
    starred: true,
    shared: false,
    accent: "orange",
  },
  {
    id: 6,
    name: "Hackathon Ideas",
    updated: "1 week ago",
    collaborators: 5,
    starred: false,
    shared: true,
    accent: "green",
  },
];

/* ============================================================
   SIDEBAR NAVIGATION
============================================================ */

const navigation: {
  label: string;
  icon: ComponentType<IconProps>;
}[] = [
  {
    label: "Home",
    icon: IconGrid,
  },
  {
    label: "Recent",
    icon: IconClock,
  },
  {
    label: "Shared",
    icon: IconUsers,
  },
  {
    label: "Starred",
    icon: IconStar,
  },
];


export default function DashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Home");
  const [search, setSearch] = useState("");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pageKey, setPageKey] = useState(0);



  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/signin");
      return;
    }

    setCheckingAuth(false);
  }, [router]);



  const visibleBoards = useMemo(() => {
    let result = boards;

    if (activeTab === "Shared") {
      result = boards.filter((board) => board.shared);
    }

    if (activeTab === "Starred") {
      result = boards.filter((board) => board.starred);
    }

    if (activeTab === "Recent") {
      result = boards;
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((board) =>
        board.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeTab, search]);


  function changeSection(section: string) {
    setActiveTab(section);
    setPageKey((value) => value + 1);
    setMobileSidebar(false);
  }


  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/signin");
  }


  function handleCreateBoard() {
    // Temporary.
    // This will later call POST /room.
    console.log("Create board");
  }



  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f6f8]">
        <div className="flex items-center gap-3 text-sm text-[#777783]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#625DF5]/20 border-t-[#625DF5]" />
          Loading workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f6f8] text-[#17171b]">
  
      <div className="dashboard-background">
        <div className="dashboard-grid" />

        <div className="dashboard-orb dashboard-orb-purple" />
        <div className="dashboard-orb dashboard-orb-orange" />
        <div className="dashboard-orb dashboard-orb-green" />

        <div className="dashboard-glow-line dashboard-glow-line-one" />
        <div className="dashboard-glow-line dashboard-glow-line-two" />
      </div>

    

      {mobileSidebar && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebar(false)}
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
        />
      )}



      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-black/[0.07] bg-white/[0.92] backdrop-blur-xl",
          "transition-[width,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          mobileSidebar ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          sidebarCollapsed ? "w-[76px]" : "w-[252px]",
        ].join(" ")}
      >


        <div
          className={[
            "relative flex h-[82px] shrink-0 items-center border-b border-black/[0.06]",
            sidebarCollapsed
              ? "justify-center px-3"
              : "justify-between px-5",
          ].join(" ")}
        >
          <div
            className={[
              "flex min-w-0 items-center transition-all duration-300",
              sidebarCollapsed ? "gap-0" : "gap-3",
            ].join(" ")}
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#625DF5] text-sm font-bold text-white shadow-[0_8px_22px_rgba(98,93,245,.22)]">
              D

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#FFD166]" />
            </div>

            <div
              className={[
                "overflow-hidden whitespace-nowrap transition-all duration-300",
                sidebarCollapsed
                  ? "ml-0 w-0 translate-x-[-10px] opacity-0"
                  : "w-[150px] translate-x-0 opacity-100",
              ].join(" ")}
            >
              <p className="text-[15px] font-semibold tracking-tight">
                Draivo
              </p>

              <p className="mt-0.5 text-[10px] text-[#9a9aa4]">
                Visual workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileSidebar(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8d8d96] hover:bg-black/[0.04] lg:hidden"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        
        <button
          type="button"
          onClick={() => setSidebarCollapsed((value) => !value)}
          aria-label={
            sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          className="absolute -right-3 top-[92px] z-[60] hidden h-7 w-7 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#777783] shadow-[0_4px_12px_rgba(20,20,30,.10)] transition-all duration-200 hover:scale-110 hover:text-[#625DF5] lg:flex"
        >
          {sidebarCollapsed ? (
            <IconChevronRight className="h-3.5 w-3.5" />
          ) : (
            <IconChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        
        <nav
          className={[
            "pt-7",
            sidebarCollapsed ? "px-2" : "px-3",
          ].join(" ")}
        >
          <p
            className={[
              "mb-2 overflow-hidden whitespace-nowrap px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#aaaab2] transition-all duration-300",
              sidebarCollapsed
                ? "h-0 translate-x-[-8px] opacity-0"
                : "h-auto translate-x-0 opacity-100",
            ].join(" ")}
          >
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  title={sidebarCollapsed ? item.label : undefined}
                  onClick={() => changeSection(item.label)}
                  className={[
                    "group relative flex h-10 w-full items-center overflow-hidden rounded-xl text-sm transition-all duration-200",
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "gap-3 px-3",
                    active
                      ? "bg-[#625DF5]/[0.08] font-medium text-[#514cf0]"
                      : "text-[#777783] hover:bg-black/[0.035] hover:text-[#28282f]",
                  ].join(" ")}
                >
                  {active && (
                    <span className="sidebar-active-bar absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#625DF5]" />
                  )}

                  <Icon
                    className={[
                      "relative h-[17px] w-[17px] shrink-0 transition-transform duration-200",
                      "group-hover:scale-110",
                      active
                        ? "text-[#625DF5]"
                        : "text-[#92929b] group-hover:text-[#55555e]",
                    ].join(" ")}
                  />

                  <span
                    className={[
                      "overflow-hidden whitespace-nowrap transition-all duration-300",
                      sidebarCollapsed
                        ? "w-0 translate-x-[-8px] opacity-0"
                        : "w-auto translate-x-0 opacity-100",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div
          className={[
            "mx-4 mt-7 overflow-hidden rounded-2xl border border-black/[0.06] bg-gradient-to-br from-[#f7f6ff] to-white transition-all duration-300",
            sidebarCollapsed
              ? "mx-2 max-h-0 scale-95 p-0 opacity-0"
              : "max-h-[180px] scale-100 p-4 opacity-100",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#625DF5]/10 text-[#625DF5]">
              <IconSparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#383840]">
                Draivo workspace
              </p>

              <p className="text-[10px] text-[#a0a0a8]">
                Personal
              </p>
            </div>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#ebeaf1]">
            <div className="h-full w-[68%] rounded-full bg-[#625DF5]" />
          </div>

          <p className="mt-2 text-[10px] text-[#9999a2]">
            68% of your workspace storage used
          </p>
        </div>

        <div
          className={[
            "mt-auto border-t border-black/[0.06] py-4",
            sidebarCollapsed ? "px-2" : "px-3",
          ].join(" ")}
        >
          <button
            type="button"
            title={sidebarCollapsed ? "Settings" : undefined}
            onClick={() => changeSection("Settings")}
            className={[
              "flex h-10 w-full items-center rounded-xl text-sm transition-all duration-200",
              sidebarCollapsed
                ? "justify-center px-0"
                : "gap-3 px-3",
              activeTab === "Settings"
                ? "bg-[#625DF5]/[0.08] font-medium text-[#514cf0]"
                : "text-[#777783] hover:bg-black/[0.035] hover:text-[#28282f]",
            ].join(" ")}
          >
            <IconSettings className="h-[17px] w-[17px] shrink-0" />

            <span
              className={[
                "overflow-hidden whitespace-nowrap transition-all duration-300",
                sidebarCollapsed
                  ? "w-0 translate-x-[-8px] opacity-0"
                  : "w-auto translate-x-0 opacity-100",
              ].join(" ")}
            >
              Settings
            </span>
          </button>

          <button
            type="button"
            title={sidebarCollapsed ? "Logout" : undefined}
            onClick={handleLogout}
            className={[
              "mt-1 flex h-10 w-full items-center rounded-xl text-sm transition-all duration-200",
              sidebarCollapsed
                ? "justify-center px-0"
                : "gap-3 px-3",
              "text-[#777783] hover:bg-red-50 hover:text-red-600",
            ].join(" ")}
          >
            <IconLogout className="h-[17px] w-[17px] shrink-0" />

            <span
              className={[
                "overflow-hidden whitespace-nowrap transition-all duration-300",
                sidebarCollapsed
                  ? "w-0 translate-x-[-8px] opacity-0"
                  : "w-auto translate-x-0 opacity-100",
              ].join(" ")}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

     
      <div
        className={[
          "relative z-10 min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-[252px]",
        ].join(" ")}
      >
       
        <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/[0.76] backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-4 px-5 sm:px-7">
            <button
              type="button"
              onClick={() => setMobileSidebar(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#777783] hover:bg-black/[0.04] lg:hidden"
            >
              <IconMenu className="h-5 w-5" />
            </button>

            {/* Search */}
            <div className="relative w-full max-w-[430px]">
              <IconSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a0a0a9]" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Search your boards..."
                className="h-10 w-full rounded-xl border border-black/[0.07] bg-white/[0.72] pl-10 pr-14 text-sm text-[#202027] outline-none shadow-[0_2px_8px_rgba(30,30,40,.018)] transition-all duration-200 placeholder:text-[#aaaab2] focus:border-[#625DF5]/35 focus:bg-white focus:shadow-[0_4px_16px_rgba(98,93,245,.07)]"
              />

              <span className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-black/[0.07] bg-white px-2 py-1 text-[10px] text-[#aaaab2] sm:block">
                ⌘ K
              </span>
            </div>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                className="hidden h-9 items-center gap-2 rounded-lg border border-black/[0.07] bg-white/[0.8] px-3 text-xs font-medium text-[#666671] transition-colors hover:bg-white sm:flex"
              >
                <IconUsers className="h-4 w-4" />
                Invite
              </button>

              <div className="hidden h-6 w-px bg-black/[0.07] sm:block" />

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-black/[0.035]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ecebf9] text-[10px] font-semibold text-[#514cf0]">
                  FB
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-xs font-medium text-[#28282e]">
                    Farhan
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#a0a0a9]">
                    Personal workspace
                  </p>
                </div>
              </button>
            </div>
          </div>
        </header>

       
        <div key={pageKey} className="dashboard-page-enter">
          <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-7 sm:py-10">
           
            <section>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-[#9898a1]">
                    <span>Workspace</span>
                    <span className="text-[#d0d0d5]">/</span>
                    <span className="text-[#5f5f68]">
                      {activeTab}
                    </span>
                  </div>

                  <h1 className="text-[34px] font-semibold tracking-[-0.045em] text-[#18181d] sm:text-[42px]">
                    {getPageTitle(activeTab)}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#85858f]">
                    {getPageDescription(activeTab)}
                  </p>
                </div>

                {activeTab !== "Settings" && (
                  <button
                    type="button"
                    onClick={handleCreateBoard}
                    className="flex h-11 w-fit items-center gap-2 rounded-xl bg-[#17171b] px-5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(23,23,27,.11)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#28282d] hover:shadow-[0_12px_28px_rgba(23,23,27,.14)]"
                  >
                    <IconPlus className="h-4 w-4" />
                    Create board
                  </button>
                )}
              </div>
            </section>

            {activeTab === "Settings" ? (
              <SettingsPanel />
            ) : (
              <>
                
                <section className="mt-8">
                  <div className="relative overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#17171b] shadow-[0_18px_50px_rgba(25,25,30,.08)]">
                    {/* grid */}
                    <div
                      className="absolute inset-0 opacity-[0.12]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.55) 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                      }}
                    />

                    {/* moving glow */}
                    <div className="dashboard-banner-glow absolute right-[-130px] top-[-190px] h-[500px] w-[500px] rounded-full" />

                    {/* content */}
                    <div className="relative z-10 grid min-h-[310px] xl:grid-cols-[1.15fr_0.85fr]">
                      <div className="flex flex-col justify-center px-6 py-10 sm:px-9 sm:py-12 lg:px-12">
                        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                          <IconSparkles className="h-5 w-5 text-[#9b97ff]" />
                        </div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b97ff]">
                          Draivo workspace
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-3xl lg:text-[38px]">
                          Turn your ideas
                          <br />
                          into{" "}
                          <span className="text-[#9b97ff]">
                            something visual.
                          </span>
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
                          Create diagrams, plan projects and collaborate with
                          your team on one infinite visual canvas.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={handleCreateBoard}
                            className="flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-[#17171b] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f1f1f3]"
                          >
                            <IconPlus className="h-4 w-4" />
                            New board
                          </button>

                          <button
                            type="button"
                            className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/65 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
                          >
                            Join a board
                            <IconArrowUpRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* decorative canvas */}
                      <div className="relative hidden min-h-[310px] xl:block">
                        <div className="absolute inset-y-8 left-5 right-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                          <div className="absolute inset-0 dashboard-mini-grid" />

                          <MiniNode
                            className="left-[13%] top-[25%] rotate-[-5deg]"
                            accent="#625DF5"
                          />

                          <MiniNode
                            className="left-[46%] top-[13%] rotate-[4deg]"
                            accent="#F08C36"
                          />

                          <MiniNode
                            className="right-[10%] top-[46%] rotate-[2deg]"
                            accent="#72E6A7"
                          />

                          <div className="absolute left-[34%] top-[39%] h-px w-[21%] bg-[#625DF5]/40" />

                          <div className="absolute left-[60%] top-[31%] h-px w-[20%] rotate-[28deg] bg-[#F08C36]/35" />

                          <div className="absolute left-[52%] top-[51%] h-px w-[19%] rotate-[-18deg] bg-[#72E6A7]/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <StatCard
                    label="Total boards"
                    value={boards.length.toString()}
                    icon={<IconGrid className="h-[17px] w-[17px]" />}
                  />

                  <StatCard
                    label="Shared boards"
                    value={boards.filter((board) => board.shared).length.toString()}
                    icon={<IconUsers className="h-[17px] w-[17px]" />}
                  />

                  <StatCard
                    label="Starred boards"
                    value={boards.filter((board) => board.starred).length.toString()}
                    icon={<IconStar className="h-[17px] w-[17px]" />}
                  />

                  <StatCard
                    label="Recent activity"
                    value="2h"
                    icon={<IconClock className="h-[17px] w-[17px]" />}
                  />
                </section>


                <section className="mt-12">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold tracking-[-0.025em] text-[#1b1b20]">
                        {activeTab === "Home"
                          ? "Recent boards"
                          : `${activeTab} boards`}
                      </h2>

                      <p className="mt-1 text-xs text-[#96969f]">
                        {activeTab === "Shared"
                          ? "Boards shared with you"
                          : activeTab === "Starred"
                            ? "Your favourite workspaces"
                            : "Your latest visual workspaces"}
                      </p>
                    </div>

                    <div className="flex w-fit rounded-xl border border-black/[0.07] bg-white/[0.85] p-1 shadow-sm">
                      {["Home", "Recent", "Shared", "Starred"].map(
                        (tab) => {
                          const active = activeTab === tab;

                          return (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => changeSection(tab)}
                              className={[
                                "rounded-lg px-3 py-1.5 text-xs transition-all duration-200",
                                active
                                  ? "bg-[#17171b] font-medium text-white shadow-sm"
                                  : "text-[#85858e] hover:text-[#303038]",
                              ].join(" ")}
                            >
                              {tab}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <BoardGrid boards={visibleBoards} />
                  </div>
                </section>
              </>
            )}

            <footer className="mt-14 border-t border-black/[0.07] py-6">
              <div className="flex flex-col gap-2 text-[11px] text-[#a2a2aa] sm:flex-row sm:items-center sm:justify-between">
                <span>Draivo Workspace</span>
                <span>Collaborative visual workspace</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}


function getPageTitle(section: string) {
  switch (section) {
    case "Recent":
      return "Recent boards";

    case "Shared":
      return "Shared boards";

    case "Starred":
      return "Starred boards";

    case "Settings":
      return "Workspace settings";

    default:
      return "Your boards";
  }
}


function getPageDescription(section: string) {
  switch (section) {
    case "Recent":
      return "Pick up where you left off with your latest visual work.";

    case "Shared":
      return "Access boards that are shared and ready for collaboration.";

    case "Starred":
      return "Keep the work that matters most close at hand.";

    case "Settings":
      return "Manage your Draivo workspace and account preferences.";

    default:
      return "A focused place to create diagrams, ideas and collaborative visual workspaces.";
  }
}


function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-black/[0.07] bg-white/[0.82] p-5 shadow-[0_4px_18px_rgba(20,20,30,.025)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_30px_rgba(20,20,30,.07)]">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f2f1fd] text-[#625DF5]">
          {icon}
        </div>

        <IconArrowUpRight className="h-3.5 w-3.5 text-[#c3c3ca] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#625DF5]" />
      </div>

      <div className="mt-5">
        <p className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1b20]">
          {value}
        </p>

        <p className="mt-1 text-[11px] text-[#9898a1]">
          {label}
        </p>
      </div>
    </div>
  );
}



function BoardGrid({ boards }: { boards: Board[] }) {
  if (boards.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/[0.09] bg-white/[0.75] py-20 text-center backdrop-blur-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2f1fd] text-[#625DF5]">
          <IconSearch className="h-5 w-5" />
        </div>

        <p className="mt-4 text-sm font-medium text-[#3a3a42]">
          No boards found
        </p>

        <p className="mt-1 text-xs text-[#9b9ba4]">
          Try another search or create a new board.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
}


function BoardCard({ board }: { board: Board }) {
  const accent =
    board.accent === "purple"
      ? "#625DF5"
      : board.accent === "orange"
        ? "#F08C36"
        : "#48B77D";

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-white/[0.84] shadow-[0_4px_16px_rgba(20,20,30,.025)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.1] hover:bg-white hover:shadow-[0_14px_34px_rgba(20,20,30,.08)]">
      {/* Preview */}
      <div className="relative h-[190px] overflow-hidden border-b border-black/[0.06] bg-[#f3f3f5]">
        <BoardPreview accent={accent} />

        {board.starred && (
          <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.05] bg-white/[0.88] text-[#625DF5] shadow-sm backdrop-blur">
            <IconStar className="h-3.5 w-3.5" />
          </div>
        )}

        <button
          type="button"
          aria-label={`More options for ${board.name}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.06] bg-white/[0.88] text-[#90909a] opacity-0 shadow-sm backdrop-blur transition-opacity duration-150 group-hover:opacity-100 hover:text-[#33333a]"
        >
          <IconMore className="h-4 w-4" />
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[#26262d]">
              {board.name}
            </h3>

            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#9999a2]">
              <IconClock className="h-3 w-3" />
              Updated {board.updated}
            </p>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7f7f8] text-[#8f8f98]">
            <IconUsers className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3">
          <span className="text-[11px] text-[#96969f]">
            {board.collaborators} collaborators
          </span>

          <button
            type="button"
            className="flex items-center gap-1 text-[11px] font-medium text-[#625DF5] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
          >
            Open
            <IconArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}


function BoardPreview({ accent }: { accent: string }) {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,30,40,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,40,.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* connector */}
      <div
        className="absolute left-[28%] top-[48%] h-px w-[32%]"
        style={{ backgroundColor: `${accent}50` }}
      />

      {/* first node */}
      <div className="absolute left-[14%] top-[31%] h-[72px] w-[98px] rounded-xl border border-black/[0.07] bg-white shadow-[0_6px_18px_rgba(30,30,40,.07)]">
        <div className="p-3.5">
          <div
            className="h-2 w-8 rounded-full"
            style={{ backgroundColor: `${accent}cc` }}
          />

          <div className="mt-4 h-1.5 w-16 rounded-full bg-[#e7e7ea]" />
          <div className="mt-2 h-1.5 w-11 rounded-full bg-[#eeeeef]" />
        </div>
      </div>

      {/* second node */}
      <div className="absolute left-[48%] top-[23%] h-[82px] w-[110px] rounded-xl border border-black/[0.07] bg-white shadow-[0_6px_18px_rgba(30,30,40,.07)]">
        <div className="p-3.5">
          <div className="h-2 w-11 rounded-full bg-[#d8d8dc]" />
          <div className="mt-4 h-1.5 w-20 rounded-full bg-[#e8e8eb]" />
          <div className="mt-2 h-1.5 w-14 rounded-full bg-[#eeeeef]" />
        </div>
      </div>

      {/* vertical connector */}
      <div
        className="absolute left-[68%] top-[50%] h-[28px] w-px"
        style={{ backgroundColor: `${accent}50` }}
      />

      {/* third node */}
      <div className="absolute right-[11%] top-[53%] h-[68px] w-[94px] rounded-xl border border-black/[0.07] bg-white shadow-[0_6px_18px_rgba(30,30,40,.07)]">
        <div className="p-3.5">
          <div className="h-2 w-7 rounded-full bg-[#dedee1]" />
          <div className="mt-4 h-1.5 w-14 rounded-full bg-[#e8e8eb]" />
          <div className="mt-2 h-1.5 w-9 rounded-full bg-[#eeeeef]" />
        </div>
      </div>

      {/* central accent point */}
      <div
        className="absolute left-[44%] top-[46%] h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm"
        style={{ backgroundColor: accent }}
      />

      {/* tiny lines */}
      <div
        className="absolute bottom-[18%] left-[18%] h-1.5 w-20 rounded-full"
        style={{ backgroundColor: `${accent}30` }}
      />

      <div className="absolute bottom-[18%] left-[40%] h-1.5 w-12 rounded-full bg-black/[0.07]" />

      <div className="absolute bottom-[18%] left-[57%] h-1.5 w-16 rounded-full bg-black/[0.05]" />
    </div>
  );
}


function MiniNode({
  className,
  accent,
}: {
  className: string;
  accent: string;
}) {
  return (
    <div
      className={[
        "absolute h-[82px] w-[112px] rounded-xl border border-white/10 bg-white/[0.035] shadow-xl",
        className,
      ].join(" ")}
    >
      <div className="p-4">
        <div
          className="h-2 w-9 rounded-full"
          style={{ backgroundColor: accent }}
        />

        <div className="mt-4 h-1.5 w-16 rounded-full bg-white/10" />
        <div className="mt-2 h-1.5 w-12 rounded-full bg-white/[0.07]" />
      </div>
    </div>
  );
}


function SettingsPanel() {
  return (
    <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-black/[0.07] bg-white/[0.82] p-6 shadow-[0_4px_18px_rgba(20,20,30,.025)] backdrop-blur-sm sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#625DF5]">
            Workspace
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#202027]">
            General settings
          </h2>

          <p className="mt-1 text-sm text-[#8d8d96]">
            Manage the basics of your Draivo workspace.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <SettingRow
            title="Workspace name"
            description="The name displayed across your workspace."
          >
            <input
              defaultValue="Draivo"
              className="h-10 w-full max-w-[320px] rounded-lg border border-black/[0.08] bg-[#fafafd] px-3 text-sm outline-none focus:border-[#625DF5]/40"
            />
          </SettingRow>

          <SettingRow
            title="Workspace visibility"
            description="Control who can access workspace content."
          >
            <select className="h-10 w-full max-w-[320px] rounded-lg border border-black/[0.08] bg-[#fafafd] px-3 text-sm outline-none focus:border-[#625DF5]/40">
              <option>Private</option>
              <option>Team</option>
              <option>Public</option>
            </select>
          </SettingRow>

          <SettingRow
            title="Email notifications"
            description="Receive updates about shared boards."
          >
            <div className="flex h-6 w-11 items-center rounded-full bg-[#625DF5] p-1">
              <div className="ml-auto h-4 w-4 rounded-full bg-white shadow-sm" />
            </div>
          </SettingRow>
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.07] bg-[#17171b] p-6 text-white shadow-[0_12px_35px_rgba(20,20,30,.08)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#625DF5]/20 text-[#9b97ff]">
          <IconSettings className="h-5 w-5" />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          Draivo preferences
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/40">
          More workspace controls will be connected here as the collaboration
          system grows.
        </p>

        <div className="mt-8 space-y-3">
          <InfoLine label="Boards" value="12" />
          <InfoLine label="Members" value="8" />
          <InfoLine label="Storage" value="68%" />
        </div>
      </div>
    </section>
  );
}


function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-black/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-[#303038]">
          {title}
        </p>

        <p className="mt-1 max-w-md text-xs leading-5 text-[#96969f]">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
      <span className="text-xs text-white/40">{label}</span>

      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}