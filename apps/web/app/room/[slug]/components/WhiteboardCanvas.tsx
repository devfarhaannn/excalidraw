"use client";

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
}: WhiteboardCanvasProps) {
    return (
        <div
            className="fixed inset-0 overflow-hidden select-none"
            style={{
                backgroundColor: background,
                overscrollBehavior: "none",
                touchAction: "none",
            }}
        />
    );
}