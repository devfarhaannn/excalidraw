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

    addElement: (
        element: CanvasElement
    ) => void;

    updateElement: (
        id: number,
        update: (
            element: CanvasElement
        ) => CanvasElement
    ) => void;

    deleteElement: (
        id: number
    ) => void;

    selectElement: (
        id: number | null
    ) => void;

    spacePressed: boolean;
};

type DrawingState =
    | {
        active: false;
    }
    | {
        active: true;
        mode:
        | "draw"
        | "move"
        | "erase";
        elementId: number;
        tool: ToolId;
        lastWorld: Point;
    };

export function useCanvasDrawing({
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
         * Middle mouse and right mouse are not
         * drawing actions.
         */
        if (event.button !== 0) {
            return;
        }

        /*
         * Hand / Lock are handled elsewhere.
         */
        if (
            activeTool === "hand" ||
            activeTool === "lock"
        ) {
            return;
        }

        /*
         * Space temporarily turns the canvas
         * into pan mode.
         */
        if (spacePressed) {
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

            /*
             * Click empty canvas.
             */
            if (!selected) {
                selectElement(null);
                return;
            }

            /*
             * Select object.
             */
            selectElement(
                selected.id
            );

            /*
             * Start moving selected object.
             */
            event.currentTarget.setPointerCapture(
                event.pointerId
            );

            drawingRef.current = {
                active: true,
                mode: "move",
                elementId:
                    selected.id,
                tool: "select",
                lastWorld: world,
            };

            return;
        }


        if (
            activeTool === "eraser"
        ) {
            const selected =
                hitTest(
                    world,
                    elements
                );

            if (!selected) {
                return;
            }

            /*
             * Delete immediately.
             */
            deleteElement(
                selected.id
            );

            /*
             * Continue erasing while dragging.
             */
            event.currentTarget.setPointerCapture(
                event.pointerId
            );

            drawingRef.current = {
                active: true,
                mode: "erase",
                elementId:
                    selected.id,
                tool: "eraser",
                lastWorld: world,
            };

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
                fontSize: 20,
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
                mode: "draw",
                elementId: id,
                tool: "draw",
                lastWorld: world,
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
                mode: "draw",
                elementId: id,
                tool: activeTool,
                lastWorld: world,
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
            drawing.mode === "move"
        ) {
            const deltaX =
                world.x -
                drawing.lastWorld.x;

            const deltaY =
                world.y -
                drawing.lastWorld.y;

            if (
                deltaX === 0 &&
                deltaY === 0
            ) {
                return;
            }

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
                                x1:
                                    element.x1 +
                                    deltaX,
                                y1:
                                    element.y1 +
                                    deltaY,
                                x2:
                                    element.x2 +
                                    deltaX,
                                y2:
                                    element.y2 +
                                    deltaY,
                            };

                        case "draw":
                            return {
                                ...element,
                                points:
                                    element.points.map(
                                        (
                                            point
                                        ) => ({
                                            x:
                                                point.x +
                                                deltaX,
                                            y:
                                                point.y +
                                                deltaY,
                                        })
                                    ),
                            };

                        case "text":
                            return {
                                ...element,
                                x:
                                    element.x +
                                    deltaX,
                                y:
                                    element.y +
                                    deltaY,
                            };

                        case "note":
                            return {
                                ...element,
                                x:
                                    element.x +
                                    deltaX,
                                y:
                                    element.y +
                                    deltaY,
                            };

                        default:
                            return element;
                    }
                }
            );

            drawing.lastWorld =
                world;

            return;
        }

        if (
            drawing.mode === "erase"
        ) {
            const target =
                hitTest(
                    world,
                    elements
                );

            if (target) {
                deleteElement(
                    target.id
                );
            }

            drawing.lastWorld =
                world;

            return;
        }


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

            drawing.lastWorld =
                world;

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

            drawing.lastWorld =
                world;
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