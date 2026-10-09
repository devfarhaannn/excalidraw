"use client";

import { useState } from "react";

import {
    ArrowUpRight,
    Circle,
    Diamond,
    Eraser,
    Hand,
    Lock,
    Minus,
    MoreHorizontal,
    MousePointer2,
    Pencil,
    Square,
    StickyNote,
    Type,
    X,
    type LucideIcon,
} from "lucide-react";

import type { ToolId } from "../types/whiteboard";

type ToolbarTool = {
    id: ToolId;
    label: string;
    shortcut?: string;
    icon: LucideIcon;
};

type WhiteboardToolbarProps = {
    activeTool: ToolId;
    isDark: boolean;
    onToolChange: (tool: ToolId) => void;
};

const TOOL_GROUPS: ToolbarTool[][] = [
    [
        {
            id: "lock",
            label: "Lock",
            icon: Lock,
        },
        {
            id: "hand",
            label: "Hand",
            icon: Hand,
        },
    ],
    [
        {
            id: "select",
            label: "Selection",
            shortcut: "V",
            icon: MousePointer2,
        },
    ],
    [
        {
            id: "rectangle",
            label: "Rectangle",
            shortcut: "R",
            icon: Square,
        },
        {
            id: "diamond",
            label: "Diamond",
            shortcut: "D",
            icon: Diamond,
        },
        {
            id: "ellipse",
            label: "Ellipse",
            shortcut: "O",
            icon: Circle,
        },
        {
            id: "arrow",
            label: "Arrow",
            shortcut: "A",
            icon: ArrowUpRight,
        },
        {
            id: "line",
            label: "Line",
            shortcut: "L",
            icon: Minus,
        },
        {
            id: "draw",
            label: "Draw",
            shortcut: "P",
            icon: Pencil,
        },
        {
            id: "text",
            label: "Text",
            shortcut: "T",
            icon: Type,
        },
        {
            id: "note",
            label: "Note",
            shortcut: "N",
            icon: StickyNote,
        },
        {
            id: "eraser",
            label: "Eraser",
            shortcut: "E",
            icon: Eraser,
        },
    ],
];

const SHORTCUTS = TOOL_GROUPS.flat().filter(
    (tool) => tool.shortcut
);

export default function WhiteboardToolbar({
    activeTool,
    isDark,
    onToolChange,
}: WhiteboardToolbarProps) {
    const [moreOpen, setMoreOpen] = useState(false);

    const surfaceClass = isDark
        ? "border-white/10 bg-[#242429]/95 text-white"
        : "border-black/[0.07] bg-white/[0.96] text-[#55555f]";

    return (
        <div
            className="fixed left-1/2 top-4 z-30 -translate-x-1/2"
            onPointerDown={(event) =>
                event.stopPropagation()
            }
        >
            <div
                className={[
                    "flex w-max max-w-[calc(100vw-2rem)] items-center gap-1 overflow-x-auto rounded-xl border p-1 shadow-[0_8px_30px_rgba(20,20,30,.08)] backdrop-blur-xl",
                    surfaceClass,
                ].join(" ")}
            >
                {TOOL_GROUPS.map((group, groupIndex) => (
                    <div
                        key={`tool-group-${groupIndex}`}
                        className="flex shrink-0 items-center gap-1"
                    >
                        {group.map((tool) => {
                            const Icon = tool.icon;
                            const active =
                                activeTool === tool.id;

                            return (
                                <button
                                    key={tool.id}
                                    type="button"
                                    title={
                                        tool.shortcut
                                            ? `${tool.label} (${tool.shortcut})`
                                            : tool.label
                                    }
                                    aria-label={tool.label}
                                    aria-pressed={active}
                                    onClick={() => {
                                        onToolChange(tool.id);
                                        setMoreOpen(false);
                                    }}
                                    className={[
                                        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#625DF5]/40",
                                        active
                                            ? "bg-[#625DF5] text-white shadow-sm"
                                            : isDark
                                                ? "text-white/65 hover:bg-white/[0.07] hover:text-white"
                                                : "text-[#676770] hover:bg-[#f2f1f7] hover:text-[#27272a]",
                                    ].join(" ")}
                                >
                                    <Icon className="h-[17px] w-[17px]" />

                                    {tool.shortcut && (
                                        <span
                                            className={[
                                                "absolute bottom-[1px] right-[4px] text-[8px] leading-none",
                                                active
                                                    ? "text-white/75"
                                                    : isDark
                                                        ? "text-white/35"
                                                        : "text-[#a1a1aa]",
                                            ].join(" ")}
                                        >
                                            {tool.shortcut}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}

                <div
                    className={[
                        "mx-1 h-6 w-px shrink-0",
                        isDark
                            ? "bg-white/10"
                            : "bg-black/[0.07]",
                    ].join(" ")}
                />

                <button
                    type="button"
                    title="More tools and shortcuts"
                    aria-label="More tools and shortcuts"
                    aria-expanded={moreOpen}
                    onClick={() =>
                        setMoreOpen((value) => !value)
                    }
                    className={[
                        "flex h-9 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        moreOpen
                            ? "bg-[#625DF5]/10 text-[#625DF5]"
                            : isDark
                                ? "text-white/65 hover:bg-white/[0.07]"
                                : "text-[#676770] hover:bg-[#f2f1f7]",
                    ].join(" ")}
                >
                    {moreOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <MoreHorizontal className="h-4 w-4" />
                    )}
                </button>
            </div>

            {moreOpen && (
                <div
                    className={[
                        "absolute right-0 top-12 w-52 rounded-xl border p-3 shadow-[0_12px_40px_rgba(0,0,0,.14)]",
                        surfaceClass,
                    ].join(" ")}
                    onPointerDown={(event) =>
                        event.stopPropagation()
                    }
                >
                    <p
                        className={[
                            "mb-2 text-[11px] font-semibold",
                            isDark
                                ? "text-white/45"
                                : "text-[#9999a2]",
                        ].join(" ")}
                    >
                        KEYBOARD SHORTCUTS
                    </p>

                    <div className="space-y-1.5">
                        {SHORTCUTS.map((tool) => (
                            <div
                                key={tool.id}
                                className="flex items-center justify-between gap-3 text-xs"
                            >
                                <span>{tool.label}</span>

                                <kbd
                                    className={[
                                        "min-w-6 rounded border px-1.5 py-0.5 text-center text-[10px]",
                                        isDark
                                            ? "border-white/10 bg-white/[0.05] text-white/60"
                                            : "border-black/[0.08] bg-[#f7f7f9] text-[#777781]",
                                    ].join(" ")}
                                >
                                    {tool.shortcut}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}