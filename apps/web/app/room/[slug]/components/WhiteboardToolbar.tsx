"use client";

import { MoreHorizontal } from "lucide-react";

import { TOOLS } from "../lib/tools/toolConfig";
import type { ToolId } from "../types/whiteboard";

type WhiteboardToolbarProps = {
    activeTool: ToolId;
    isDark: boolean;
    onToolChange: (tool: ToolId) => void;
};

export default function WhiteboardToolbar({
    activeTool,
    isDark,
    onToolChange,
}: WhiteboardToolbarProps) {
    return (
        <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2">
            <div
                className={[
                    "pointer-events-auto flex items-center gap-0.5 rounded-xl border p-1.5 shadow-[0_10px_35px_rgba(20,20,30,.10)] backdrop-blur-xl",
                    isDark
                        ? "border-white/10 bg-[#242429]/95"
                        : "border-black/[0.08] bg-white/[0.97]",
                ].join(" ")}
            >
                {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    const active =
                        activeTool === tool.id;

                    return (
                        <button
                            key={tool.id}
                            type="button"
                            title={`${tool.label}${
                                tool.shortcut
                                    ? ` (${tool.shortcut})`
                                    : ""
                            }`}
                            onClick={() =>
                                onToolChange(tool.id)
                            }
                            className={[
                                "relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-150",
                                active
                                    ? "bg-[#625DF5] text-white shadow-[0_5px_14px_rgba(98,93,245,.24)]"
                                    : isDark
                                        ? "text-white/55 hover:bg-white/[0.07] hover:text-white"
                                        : "text-[#60606a] hover:bg-[#f3f2f8] hover:text-[#25252c]",
                            ].join(" ")}
                        >
                            <Icon className="h-4 w-4" />

                            {tool.shortcut && (
                                <span
                                    className={[
                                        "absolute bottom-[2px] right-[4px] text-[7px] font-semibold",
                                        active
                                            ? "text-white/65"
                                            : isDark
                                                ? "text-white/25"
                                                : "text-[#aaaab2]",
                                    ].join(" ")}
                                >
                                    {tool.shortcut}
                                </span>
                            )}
                        </button>
                    );
                })}

                <div
                    className={[
                        "mx-1 h-6 w-px",
                        isDark
                            ? "bg-white/10"
                            : "bg-black/[0.08]",
                    ].join(" ")}
                />

                <button
                    type="button"
                    title="More tools"
                    className={[
                        "flex h-9 w-9 items-center justify-center rounded-lg",
                        isDark
                            ? "text-white/55 hover:bg-white/[0.07] hover:text-white"
                            : "text-[#666670] hover:bg-[#f3f2f8]",
                    ].join(" ")}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}