"use client";

import {
    ArrowUpRight,
    Command,
    Download,
    FileImage,
    FolderOpen,
    HelpCircle,
    Languages,
    Link2,
    Lock,
    Menu,
    Minus,
    Palette,
    PanelRight,
    Plus,
    RotateCcw,
    Search,
    Settings,
    Share2,
    Sun,
    Users,
    X,
    Undo2,
    Redo2,
    type LucideIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
    useEffect,
    useState,
} from "react";

import WhiteboardCanvas from "./components/WhiteboardCanvas";
import WhiteboardToolbar from "./components/WhiteboardToolbar";

import type {
    ThemeMode,
    ToolId,
} from "./types/whiteboard";


const CANVAS_BACKGROUNDS = [
    "#ffffff",
    "#f5f5f5",
    "#f4f7ff",
    "#fff9df",
    "#fff3ef",
    "#eefbf5",
];

function MenuItem({
    icon: Icon,
    title,
    shortcut,
    onClick,
}: {
    icon: LucideIcon;
    title: string;
    shortcut?: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-left text-[12px] text-[#46464f] transition-colors hover:bg-[#f5f4fa]"
        >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[#72727c]">
                <Icon className="h-4 w-4" />
            </span>

            <span className="min-w-0 flex-1 truncate">
                {title}
            </span>

            {shortcut && (
                <span className="shrink-0 text-[10px] text-[#a1a1aa]">
                    {shortcut}
                </span>
            )}
        </button>
    );
}

function Divider() {
    return (
        <div className="my-1.5 h-px bg-black/[0.06]" />
    );
}

export default function RoomPage() {
    const params = useParams<{ slug: string }>();
    const router = useRouter();

    const slug = decodeURIComponent(
        params.slug
    );

    const [menuOpen, setMenuOpen] =
        useState(false);

    const [activeTool, setActiveTool] =
        useState<ToolId>("select");

    const [zoom, setZoom] =
        useState(100);

    const [theme, setTheme] =
        useState<ThemeMode>("light");

    const [systemDark, setSystemDark] =
        useState(false);

    const [
        canvasBackground,
        setCanvasBackground,
    ] = useState("#ffffff");

    const [
        menuSearchOpen,
        setMenuSearchOpen,
    ] = useState(false);

    const [locked, setLocked] =
        useState(false);

    const isDark =
        theme === "dark" ||
        (
            theme === "system" &&
            systemDark
        );

    useEffect(() => {
        const savedTheme =
            localStorage.getItem(
                "draivo-theme"
            ) as ThemeMode | null;

        const savedBackground =
            localStorage.getItem(
                "draivo-canvas-background"
            );

        if (
            savedTheme === "light" ||
            savedTheme === "dark" ||
            savedTheme === "system"
        ) {
            setTheme(savedTheme);
        }

        if (savedBackground) {
            setCanvasBackground(
                savedBackground
            );
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "draivo-theme",
            theme
        );
    }, [theme]);

    useEffect(() => {
        localStorage.setItem(
            "draivo-canvas-background",
            canvasBackground
        );
    }, [canvasBackground]);

    useEffect(() => {
        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );

        const updateSystemTheme = () => {
            setSystemDark(
                mediaQuery.matches
            );
        };

        updateSystemTheme();

        mediaQuery.addEventListener(
            "change",
            updateSystemTheme
        );

        return () => {
            mediaQuery.removeEventListener(
                "change",
                updateSystemTheme
            );
        };
    }, []);

    useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
        /*
         * Don't trigger shortcuts while typing.
         */
        const target =
            event.target as HTMLElement | null;

        const isTyping =
            target?.tagName === "INPUT" ||
            target?.tagName === "TEXTAREA" ||
            target?.tagName === "SELECT" ||
            target?.isContentEditable;

        if (isTyping) {
            return;
        }

        /*
         * Escape
         */
        if (event.key === "Escape") {
            setMenuOpen(false);
            setMenuSearchOpen(false);
            return;
        }

        /*
         * Tool shortcuts
         */
        switch (event.key.toLowerCase()) {
            case "v":
                setActiveTool("select");
                break;

            case "r":
                setActiveTool("rectangle");
                break;

            case "d":
                setActiveTool("diamond");
                break;

            case "o":
                setActiveTool("ellipse");
                break;

            case "a":
                setActiveTool("arrow");
                break;

            case "l":
                setActiveTool("line");
                break;

            case "p":
                setActiveTool("draw");
                break;

            case "t":
                setActiveTool("text");
                break;

            case "n":
                setActiveTool("note");
                break;

            case "e":
                setActiveTool("eraser");
                break;
        }
    }

    window.addEventListener(
        "keydown",
        handleKeyDown
    );

    return () => {
        window.removeEventListener(
            "keydown",
            handleKeyDown
        );
    };
}, []);

    function zoomIn() {
        setZoom((value) =>
            Math.min(value + 10, 500)
        );
    }

    function zoomOut() {
        setZoom((value) =>
            Math.max(value - 10, 10)
        );
    }

    function resetZoom() {
        setZoom(100);
    }

    function handleResetCanvas() {
        setZoom(100);
        setActiveTool("select");
        setCanvasBackground(
            "#ffffff"
        );
        setLocked(false);
        setMenuOpen(false);
    }

    function handleToolChange(
        tool: ToolId
    ) {
        setActiveTool(tool);
        setMenuOpen(false);
    }

    function handleThemeChange(
        nextTheme: ThemeMode
    ) {
        setTheme(nextTheme);
    }

    return (
        <main
            className={[
                "fixed inset-0 overflow-hidden transition-colors duration-200",
                isDark
                    ? "bg-[#17171b] text-white"
                    : "bg-white text-[#17171b]",
            ].join(" ")}
        >


            <WhiteboardCanvas
                zoom={zoom}
                onZoomChange={setZoom}
                background={canvasBackground}
                dark={isDark}
                activeTool={activeTool}
            />



            {menuOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => {
                        setMenuOpen(false);
                        setMenuSearchOpen(false);
                    }}
                    className="fixed inset-0 z-40 cursor-default bg-transparent"
                />
            )}



            <div className="absolute left-4 top-4 z-50">
                <div className="flex items-center">
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => {
                            setMenuOpen(
                                (value) =>
                                    !value
                            );

                            setMenuSearchOpen(
                                false
                            );
                        }}
                        className={[
                            "flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-all duration-150",
                            isDark
                                ? "border-white/10 bg-[#242429]/95 text-white/75 hover:bg-[#2b2b31]"
                                : "border-black/[0.07] bg-white/95 text-[#66666f] hover:bg-white",
                        ].join(" ")}
                    >
                        <Menu className="h-[18px] w-[18px]" />
                    </button>

                    <div
                        className={[
                            "ml-2 max-w-[260px] truncate px-2 text-[13px] font-medium",
                            isDark
                                ? "text-white/75"
                                : "text-[#4b4b53]",
                        ].join(" ")}
                    >
                        {slug}
                    </div>
                </div>


                {menuOpen && (
                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className={[
                            "absolute left-0 top-12 w-[258px] overflow-hidden rounded-2xl border p-2 shadow-[0_24px_70px_rgba(20,20,30,.16)] backdrop-blur-2xl",
                            isDark
                                ? "border-white/10 bg-[#242429]/95"
                                : "border-black/[0.08] bg-white/[0.97]",
                        ].join(" ")}
                    >
                        <div className="px-2.5 py-2">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#625DF5] text-xs font-semibold text-white">
                                    D
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className={[
                                            "text-[10px] font-semibold uppercase tracking-[0.16em]",
                                            isDark
                                                ? "text-white/35"
                                                : "text-[#a1a1aa]",
                                        ].join(" ")}
                                    >
                                        Draivo
                                    </p>

                                    <p
                                        className={[
                                            "mt-0.5 truncate text-[12px] font-medium",
                                            isDark
                                                ? "text-white/80"
                                                : "text-[#34343b]",
                                        ].join(" ")}
                                    >
                                        {slug}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <MenuItem
                            icon={FolderOpen}
                            title="Open"
                            shortcut="⌘O"
                            onClick={() =>
                                router.push(
                                    "/dashboard"
                                )
                            }
                        />

                        <MenuItem
                            icon={Download}
                            title="Save to..."
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <MenuItem
                            icon={FileImage}
                            title="Export image..."
                            shortcut="⌘⇧E"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <MenuItem
                            icon={Users}
                            title="Live collaboration..."
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <MenuItem
                            icon={Command}
                            title="Command palette"
                            shortcut="⌘/"
                            onClick={() =>
                                setMenuSearchOpen(
                                    true
                                )
                            }
                        />

                        <MenuItem
                            icon={Search}
                            title="Find on canvas"
                            shortcut="⌘F"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <MenuItem
                            icon={HelpCircle}
                            title="Help"
                            shortcut="?"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <MenuItem
                            icon={RotateCcw}
                            title="Reset the canvas"
                            onClick={
                                handleResetCanvas
                            }
                        />

                        <Divider />

                        <MenuItem
                            icon={Palette}
                            title="Draivo+"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <MenuItem
                            icon={Link2}
                            title="GitHub"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <MenuItem
                            icon={Users}
                            title="Follow us"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <MenuItem
                            icon={Share2}
                            title="Discord chat"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <MenuItem
                            icon={ArrowUpRight}
                            title="Sign up"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <Divider />

                        <MenuItem
                            icon={Settings}
                            title="Preferences"
                            shortcut="›"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />


                        <div className="px-2.5 py-2">
                            <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center text-[#72727c]">
                                    <Palette className="h-4 w-4" />
                                </span>

                                <span
                                    className={[
                                        "text-[12px]",
                                        isDark
                                            ? "text-white/75"
                                            : "text-[#46464f]",
                                    ].join(" ")}
                                >
                                    Theme
                                </span>
                            </div>

                            <div
                                className={[
                                    "mt-1.5 grid grid-cols-3 gap-1 rounded-lg border p-1",
                                    isDark
                                        ? "border-white/10 bg-white/[0.04]"
                                        : "border-black/[0.06] bg-[#f7f7f9]",
                                ].join(" ")}
                            >
                                <button
                                    type="button"
                                    title="Light"
                                    onClick={() =>
                                        handleThemeChange(
                                            "light"
                                        )
                                    }
                                    className={[
                                        "flex h-8 items-center justify-center rounded-md transition-colors",
                                        theme ===
                                            "light"
                                            ? "bg-white text-[#625DF5] shadow-sm"
                                            : isDark
                                                ? "text-white/40 hover:text-white/70"
                                                : "text-[#96969e] hover:text-[#55555d]",
                                    ].join(" ")}
                                >
                                    <Sun className="h-3.5 w-3.5" />
                                </button>

                                <button
                                    type="button"
                                    title="Dark"
                                    onClick={() =>
                                        handleThemeChange(
                                            "dark"
                                        )
                                    }
                                    className={[
                                        "flex h-8 items-center justify-center rounded-md transition-colors",
                                        theme ===
                                            "dark"
                                            ? "bg-[#34343b] text-white shadow-sm"
                                            : isDark
                                                ? "text-white/40 hover:text-white/70"
                                                : "text-[#96969e] hover:text-[#55555d]",
                                    ].join(" ")}
                                >
                                    <span className="text-[13px]">
                                        ◐
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    title="System"
                                    onClick={() =>
                                        handleThemeChange(
                                            "system"
                                        )
                                    }
                                    className={[
                                        "flex h-8 items-center justify-center rounded-md transition-colors",
                                        theme ===
                                            "system"
                                            ? isDark
                                                ? "bg-[#34343b] text-white shadow-sm"
                                                : "bg-white text-[#625DF5] shadow-sm"
                                            : isDark
                                                ? "text-white/40 hover:text-white/70"
                                                : "text-[#96969e] hover:text-[#55555d]",
                                    ].join(" ")}
                                >
                                    <span className="text-[12px]">
                                        ▣
                                    </span>
                                </button>
                            </div>
                        </div>

                        <MenuItem
                            icon={Languages}
                            title="English"
                            shortcut="›"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />


                        <div className="px-2.5 pb-2 pt-2">
                            <p
                                className={[
                                    "px-1 text-[11px] font-medium",
                                    isDark
                                        ? "text-white/50"
                                        : "text-[#777781]",
                                ].join(" ")}
                            >
                                Canvas background
                            </p>

                            <div className="mt-2 flex items-center gap-2 px-1">
                                {CANVAS_BACKGROUNDS.map(
                                    (color) => {
                                        const active =
                                            canvasBackground ===
                                            color;

                                        return (
                                            <button
                                                key={
                                                    color
                                                }
                                                type="button"
                                                title={`Canvas ${color}`}
                                                onClick={() =>
                                                    setCanvasBackground(
                                                        color
                                                    )
                                                }
                                                className={[
                                                    "h-7 w-7 rounded-lg border shadow-sm transition-all duration-150 hover:scale-105",
                                                    active
                                                        ? "border-[#625DF5] ring-2 ring-[#625DF5]/20"
                                                        : isDark
                                                            ? "border-white/10"
                                                            : "border-black/[0.08]",
                                                ].join(" ")}
                                                style={{
                                                    backgroundColor:
                                                        color,
                                                }}
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <WhiteboardToolbar
                activeTool={activeTool}
                isDark={isDark}
                onToolChange={handleToolChange}
            />


            <div className="absolute right-4 top-4 z-30 flex items-center gap-2">
                <button
                    type="button"
                    className={[
                        "hidden h-10 items-center rounded-xl border px-4 text-[11px] font-medium shadow-sm sm:flex",
                        isDark
                            ? "border-white/10 bg-[#242429]/95 text-white/70 hover:bg-[#2b2b31]"
                            : "border-black/[0.07] bg-white/95 text-[#56565f] hover:bg-white",
                    ].join(" ")}
                >
                    Upgrade
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setMenuOpen(false)
                    }
                    className="flex h-10 items-center gap-2 rounded-xl bg-[#625DF5] px-4 text-[11px] font-semibold text-white shadow-[0_8px_22px_rgba(98,93,245,.22)] transition-all hover:bg-[#554ff0]"
                >
                    <Users className="h-4 w-4" />

                    <span className="hidden sm:inline">
                        Share
                    </span>
                </button>

                <button
                    type="button"
                    title="Open panel"
                    onClick={() =>
                        setMenuOpen(false)
                    }
                    className={[
                        "flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-colors",
                        isDark
                            ? "border-white/10 bg-[#242429]/95 text-white/60 hover:bg-[#2b2b31]"
                            : "border-black/[0.07] bg-white/95 text-[#676770] hover:bg-white",
                    ].join(" ")}
                >
                    <PanelRight className="h-4 w-4" />
                </button>
            </div>


            <div
                className={[
                    "absolute bottom-4 left-4 z-30 flex items-center rounded-xl border p-1 shadow-[0_8px_30px_rgba(20,20,30,.08)] backdrop-blur-xl",
                    isDark
                        ? "border-white/10 bg-[#242429]/95"
                        : "border-black/[0.07] bg-white/[0.96]",
                ].join(" ")}
            >
                <button
                    type="button"
                    title="Undo"
                    className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        isDark
                            ? "text-white/35 hover:bg-white/[0.07]"
                            : "text-[#b0b0b8] hover:bg-[#f5f4fa]",
                    ].join(" ")}
                >
                    <Undo2 className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    title="Redo"
                    className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        isDark
                            ? "text-white/35 hover:bg-white/[0.07]"
                            : "text-[#b0b0b8] hover:bg-[#f5f4fa]",
                    ].join(" ")}
                >
                    <Redo2 className="h-4 w-4" />
                </button>
            </div>

            <div
                className={[
                    "absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center rounded-xl border p-1 shadow-[0_8px_30px_rgba(20,20,30,.08)] backdrop-blur-xl",
                    isDark
                        ? "border-white/10 bg-[#242429]/95"
                        : "border-black/[0.07] bg-white/[0.96]",
                ].join(" ")}
            >
                <button
                    type="button"
                    title="Zoom out"
                    onClick={zoomOut}
                    className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        isDark
                            ? "text-white/55 hover:bg-white/[0.07]"
                            : "text-[#696973] hover:bg-[#f5f4fa]",
                    ].join(" ")}
                >
                    <Minus className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    title="Reset zoom"
                    onClick={resetZoom}
                    className={[
                        "min-w-[62px] rounded-lg px-2 py-2 text-[11px] font-medium",
                        isDark
                            ? "text-white/75 hover:bg-white/[0.06]"
                            : "text-[#55555e] hover:bg-[#f5f4fa]",
                    ].join(" ")}
                >
                    {zoom}%
                </button>

                <button
                    type="button"
                    title="Zoom in"
                    onClick={zoomIn}
                    className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        isDark
                            ? "text-white/55 hover:bg-white/[0.07]"
                            : "text-[#696973] hover:bg-[#f5f4fa]",
                    ].join(" ")}
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
                <button
                    type="button"
                    title={
                        locked
                            ? "Unlock canvas"
                            : "Lock canvas"
                    }
                    onClick={() =>
                        setLocked(
                            (value) =>
                                !value
                        )
                    }
                    className={[
                        "flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm",
                        locked
                            ? "border-[#625DF5]/20 bg-[#625DF5] text-white"
                            : isDark
                                ? "border-white/10 bg-[#242429]/95 text-white/45"
                                : "border-black/[0.07] bg-white/95 text-[#8d8d96]",
                    ].join(" ")}
                >
                    <Lock className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    title="Help"
                    className={[
                        "hidden h-9 w-9 items-center justify-center rounded-xl border shadow-sm sm:flex",
                        isDark
                            ? "border-white/10 bg-[#242429]/95 text-white/45"
                            : "border-black/[0.07] bg-white/95 text-[#8d8d96]",
                    ].join(" ")}
                >
                    <HelpCircle className="h-4 w-4" />
                </button>
            </div>

            {menuSearchOpen && (
                <div
                    className="fixed inset-0 z-[70] flex items-start justify-center bg-black/20 px-4 pt-[18vh] backdrop-blur-[2px]"
                    onClick={() =>
                        setMenuSearchOpen(
                            false
                        )
                    }
                >
                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className={[
                            "w-full max-w-[520px] overflow-hidden rounded-2xl border shadow-[0_30px_100px_rgba(0,0,0,.20)]",
                            isDark
                                ? "border-white/10 bg-[#242429]"
                                : "border-black/[0.08] bg-white",
                        ].join(" ")}
                    >
                        <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3">
                            <Command className="h-4 w-4 text-[#777781]" />

                            <input
                                autoFocus
                                placeholder="Search commands..."
                                className={[
                                    "min-w-0 flex-1 bg-transparent text-sm outline-none",
                                    isDark
                                        ? "text-white placeholder:text-white/30"
                                        : "text-[#2f2f36] placeholder:text-[#aaaab2]",
                                ].join(" ")}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setMenuSearchOpen(
                                        false
                                    )
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-md text-[#888891] hover:bg-black/[0.05]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-2">
                            {[
                                {
                                    label: "Select tool",
                                    tool: "select" as ToolId,
                                },
                                {
                                    label: "Draw",
                                    tool: "draw" as ToolId,
                                },
                                {
                                    label: "Rectangle",
                                    tool: "rectangle" as ToolId,
                                },
                                {
                                    label: "Ellipse",
                                    tool: "ellipse" as ToolId,
                                },
                                {
                                    label: "Text",
                                    tool: "text" as ToolId,
                                },
                            ].map(
                                (
                                    commandItem
                                ) => (
                                    <button
                                        key={
                                            commandItem.label
                                        }
                                        type="button"
                                        onClick={() => {
                                            setActiveTool(
                                                commandItem.tool
                                            );

                                            setMenuSearchOpen(
                                                false
                                            );

                                            setMenuOpen(
                                                false
                                            );
                                        }}
                                        className={[
                                            "flex w-full items-center rounded-lg px-3 py-2.5 text-left text-xs",
                                            isDark
                                                ? "text-white/60 hover:bg-white/[0.06]"
                                                : "text-[#666670] hover:bg-[#f5f4fa]",
                                        ].join(" ")}
                                    >
                                        {
                                            commandItem.label
                                        }
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}