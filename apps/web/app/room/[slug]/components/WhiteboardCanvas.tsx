"use client";

import {
    useEffect,
    useRef,
} from "react";

import {
    useCanvasDrawing,
} from "../hooks/useCanvasDrawing";

import {
    useCanvasPan,
} from "../hooks/useCanvasPan";

import {
    useCanvasZoom,
} from "../hooks/useCanvasZoom";

import {
    useWhiteboard,
} from "../hooks/useWhiteBoard";

import {
    renderCanvas,
} from "../lib/canvas/renderCanvas";

import SelectionOverlay from "./SelectionOverlay";

import type {
    ToolId,
} from "../types/whiteboard";

type Pan = {
    x: number;
    y: number;
};

type WhiteboardCanvasProps = {
    zoom: number;
    onZoomChange: (
        zoom: number
    ) => void;
    background: string;
    dark: boolean;
    activeTool: ToolId;
};

export default function WhiteboardCanvas({
    zoom,
    onZoomChange,
    background,
    dark,
    activeTool,
}: WhiteboardCanvasProps) {
    const containerRef =
        useRef<HTMLDivElement | null>(
            null
        );

    const canvasRef =
        useRef<HTMLCanvasElement | null>(
            null
        );

    const {
        pan,
        setPan,
        cursor,
        spacePressed,
    } = useCanvasPan({
        containerRef,
        activeTool,
    });

    const {
        elements,
        selectedId,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
    } = useWhiteboard();

    useCanvasZoom({
        containerRef,
        zoom,
        onZoomChange,
        pan,
        onPanChange: setPan,
    });

    useCanvasDrawing({
        containerRef,
        activeTool,
        zoom,
        pan,
        elements,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        spacePressed,
    });

    useEffect(() => {
        const canvas =
            canvasRef.current;

        const container =
            containerRef.current;

        if (
            !canvas ||
            !container
        ) {
            return;
        }

        renderCanvas({
            canvas,
            container,
            elements,
            pan,
            zoom,
            background,
            dark,
        });
    }, [
        elements,
        pan,
        zoom,
        background,
        dark,
    ]);

    useEffect(() => {
        const canvas =
            canvasRef.current;

        const container =
            containerRef.current;

        if (
            !canvas ||
            !container
        ) {
            return;
        }

        const resizeObserver =
            new ResizeObserver(() => {
                renderCanvas({
                    canvas,
                    container,
                    elements,
                    pan,
                    zoom,
                    background,
                    dark,
                });
            });

        resizeObserver.observe(
            container
        );

        return () => {
            resizeObserver.disconnect();
        };
    }, [
        elements,
        pan,
        zoom,
        background,
        dark,
    ]);

    const selectedElement =
        selectedId === null
            ? null
            : elements.find(
                  (element) =>
                      element.id ===
                      selectedId
              );

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden"
            style={{
                cursor,
                touchAction: "none",
            }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block h-full w-full"
            />

            {selectedElement && (
                <SelectionOverlay
                    containerRef={
                        containerRef
                    }
                    element={
                        selectedElement
                    }
                    zoom={zoom}
                    pan={pan}
                    updateElement={
                        updateElement
                    }
                />
            )}
        </div>
    );
}