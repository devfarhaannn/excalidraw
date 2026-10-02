"use client";

import { useRef } from "react";

import type {
    CanvasElement,
    ToolId,
} from "../types/whiteboard";

type Point = {
    x: number;
    y: number;
};

type Pan = {
    x: number;
    y: number;
};

type UseCanvasDrawingProps = {
    containerRef: React.RefObject<HTMLDivElement | null>;
    activeTool: ToolId;
    zoom: number;
    pan: Pan;
    addElement: (
        element: CanvasElement
    ) => void;
    updateElement: (
        id: number,
        update: (
            element: CanvasElement
        ) => CanvasElement
    ) => void;
};

type DrawingState =
    | {
          active: false;
      }
    | {
          active: true;
          elementId: number;
          tool: ToolId;
      };

export function useCanvasDrawing({
    containerRef,
    activeTool,
    zoom,
    pan,
    addElement,
    updateElement,
}: UseCanvasDrawingProps) {
    const drawingRef =
        useRef<DrawingState>({
            active: false,
        });

    function screenToWorld(
        clientX: number,
        clientY: number
    ): Point {
        const container =
            containerRef.current;

        if (!container) {
            return {
                x: 0,
                y: 0,
            };
        }

        const rect =
            container.getBoundingClientRect();

        const scale = zoom / 100;

        return {
            x:
                (clientX -
                    rect.left -
                    rect.width / 2 -
                    pan.x) /
                scale,

            y:
                (clientY -
                    rect.top -
                    rect.height / 2 -
                    pan.y) /
                scale,
        };
    }

    function createId() {
        return Date.now() + Math.floor(
            Math.random() * 1000
        );
    }

    function isShapeTool(
        tool: ToolId
    ): tool is
        | "rectangle"
        | "diamond"
        | "ellipse"
        | "line"
        | "arrow" {
        return (
            tool === "rectangle" ||
            tool === "diamond" ||
            tool === "ellipse" ||
            tool === "line" ||
            tool === "arrow"
        );
    }

    /*
     * POINTER DOWN
     */
    function handlePointerDown(
        event: React.PointerEvent<HTMLDivElement>
    ) {
        /*
         * Only left mouse button creates objects.
         */
        if (event.button !== 0) {
            return;
        }

        /*
         * Hand and lock are handled elsewhere.
         */
        if (
            activeTool === "hand" ||
            activeTool === "lock" ||
            activeTool === "select" ||
            activeTool === "eraser"
        ) {
            return;
        }

        const world =
            screenToWorld(
                event.clientX,
                event.clientY
            );

        /*
         * TEXT
         */
        if (
            activeTool === "text"
        ) {
            const text =
                window.prompt(
                    "Enter text"
                );

            if (
                !text ||
                !text.trim()
            ) {
                return;
            }

            addElement({
                id: createId(),
                type: "text",
                x: world.x,
                y: world.y,
                text: text.trim(),
            });

            return;
        }

        /*
         * NOTE
         */
        if (
            activeTool === "note"
        ) {
            const text =
                window.prompt(
                    "Enter note"
                );

            if (
                !text ||
                !text.trim()
            ) {
                return;
            }

            addElement({
                id: createId(),
                type: "note",
                x: world.x,
                y: world.y,
                width: 180,
                height: 120,
                text: text.trim(),
            });

            return;
        }

        /*
         * FREEHAND DRAW
         */
        if (
            activeTool === "draw"
        ) {
            const id = createId();

            addElement({
                id,
                type: "draw",
                points: [world],
            });

            drawingRef.current = {
                active: true,
                elementId: id,
                tool: "draw",
            };

            event.currentTarget.setPointerCapture(
                event.pointerId
            );

            return;
        }

        /*
         * SHAPES
         */
        if (
            isShapeTool(activeTool)
        ) {
            const id = createId();

            addElement({
                id,
                type: activeTool,
                x1: world.x,
                y1: world.y,
                x2: world.x,
                y2: world.y,
            });

            drawingRef.current = {
                active: true,
                elementId: id,
                tool: activeTool,
            };

            event.currentTarget.setPointerCapture(
                event.pointerId
            );
        }
    }

    /*
     * POINTER MOVE
     */
    function handlePointerMove(
        event: React.PointerEvent<HTMLDivElement>
    ) {
        const drawing =
            drawingRef.current;

        if (!drawing.active) {
            return;
        }

        const world =
            screenToWorld(
                event.clientX,
                event.clientY
            );

        /*
         * FREEHAND
         */
        if (
            drawing.tool === "draw"
        ) {
            updateElement(
                drawing.elementId,
                (element) => {
                    if (
                        element.type !==
                        "draw"
                    ) {
                        return element;
                    }

                    return {
                        ...element,
                        points: [
                            ...element.points,
                            world,
                        ],
                    };
                }
            );

            return;
        }

        /*
         * SHAPES
         */
        if (
            isShapeTool(
                drawing.tool
            )
        ) {
            updateElement(
                drawing.elementId,
                (element) => {
                    switch (
                        element.type
                    ) {
                        case "rectangle":
                        case "diamond":
                        case "ellipse":
                        case "line":
                        case "arrow":
                            return {
                                ...element,
                                x2: world.x,
                                y2: world.y,
                            };

                        default:
                            return element;
                    }
                }
            );
        }
    }

    /*
     * POINTER UP
     */
    function handlePointerUp(
        event: React.PointerEvent<HTMLDivElement>
    ) {
        const drawing =
            drawingRef.current;

        if (!drawing.active) {
            return;
        }

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId
            );
        }

        drawingRef.current = {
            active: false,
        };
    }

    return {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    };
}