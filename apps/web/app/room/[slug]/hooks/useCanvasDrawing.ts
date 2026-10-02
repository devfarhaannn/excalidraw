"use client";

import {
    useRef,
    type PointerEvent as ReactPointerEvent,
    type RefObject,
} from "react";

import type {
    CanvasElement,
    Point,
    ToolId,
} from "../types/whiteboard";

import { hitTest } from "../lib/canvas/hitTest";

type Pan = {
    x: number;
    y: number;
};

type UseCanvasDrawingProps = {
    containerRef: RefObject<HTMLDivElement | null>;

    activeTool: ToolId;

    zoom: number;

    pan: Pan;

    elements: CanvasElement[];

    selectedId: number | null;

    addElement: (
        element: CanvasElement
    ) => void;

    updateElement: (
        id: number,
        update: (
            element: CanvasElement
        ) => CanvasElement
    ) => void;

    selectElement: (
        id: number | null
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
    elements,
    addElement,
    updateElement,
    selectElement,
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
        return (
            Date.now() +
            Math.floor(
                Math.random() * 1000
            )
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


    function handlePointerDown(
        event: ReactPointerEvent<HTMLDivElement>
    ) {
        /*
         * Only left mouse button
         * creates/selects objects.
         */
        if (event.button !== 0) {
            return;
        }

        /*
         * Hand and lock are handled
         * by the pan layer / future lock logic.
         */
        if (
            activeTool === "hand" ||
            activeTool === "lock"
        ) {
            return;
        }

        const world =
            screenToWorld(
                event.clientX,
                event.clientY
            );



        if (
            activeTool === "select"
        ) {
            const selected =
                hitTest(
                    world,
                    elements
                );

            if (!selected) {
                selectElement(null);
                return;
            }

            selectElement(
                selected.id
            );

            return;
        }


        if (
            activeTool === "eraser"
        ) {
            /*
             * Eraser movement/removal will
             * be completed after selection.
             */
            return;
        }



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



    function handlePointerMove(
        event: ReactPointerEvent<HTMLDivElement>
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


    function handlePointerUp(
        event: ReactPointerEvent<HTMLDivElement>
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