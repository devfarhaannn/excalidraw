"use client";

import { useRef } from "react";

import { useCanvasPan } from "../hooks/useCanvasPan";
import type { ToolId } from "../types/whiteboard";

type WhiteboardCanvasProps = {
    zoom: number;
    onZoomChange: (zoom: number) => void;
    background: string;
    dark: boolean;
    activeTool: ToolId;
};

export default function WhiteboardCanvas({
    background,
    activeTool,
}: WhiteboardCanvasProps) {
    const containerRef =
        useRef<HTMLDivElement | null>(null);

    const {
        cursor,
    } = useCanvasPan({
        containerRef,
        activeTool,
    });

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden select-none"
            style={{
                backgroundColor: background,
                cursor,
                touchAction: "none",
                overscrollBehavior: "none",
            }}
        />
    );
}