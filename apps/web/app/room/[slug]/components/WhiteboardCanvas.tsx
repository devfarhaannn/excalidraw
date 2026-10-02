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
        elements,
        selectedId,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
    } = useWhiteboard();



    const {
        pan,
        setPan,
        cursor,
        spacePressed,
    } = useCanvasPan({
        containerRef,
        activeTool,
    });



    useCanvasZoom({
        containerRef,
        zoom,
        onZoomChange,
        pan,
        onPanChange: setPan,
    });


    const {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    } = useCanvasDrawing({
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
            className="fixed inset-0 overflow-hidden select-none"
            style={{
                cursor,
                touchAction: "none",
                overscrollBehavior: "none",
            }}
            onPointerDown={
                handlePointerDown
            }
            onPointerMove={
                handlePointerMove
            }
            onPointerUp={
                handlePointerUp
            }
            onPointerCancel={
                handlePointerUp
            }
            onContextMenu={(event) => {
                event.preventDefault();
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