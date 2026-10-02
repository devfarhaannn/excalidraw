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

export type TextEditingTarget = {
    x: number;
    y: number;
    text: string;
    fontSize: number;
    elementId: number | null;
};
export type NoteEditingTarget = {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    elementId: number | null;
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

    beginHistory: () => CanvasElement[];

    commitHistory: (
        beforeElements: CanvasElement[]
    ) => void;

    spacePressed: boolean;

    onStartTextEditing: (
        target: TextEditingTarget
    ) => void;

    onStartNoteEditing: (
        target: NoteEditingTarget
    ) => void;
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
        beforeElements: CanvasElement[];
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
    beginHistory,
    commitHistory,
    spacePressed,
    onStartTextEditing,
    onStartNoteEditing,
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

        const scale =
            zoom / 100;

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
         * Only left mouse button draws/selects.
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
             * Empty canvas.
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
             * Double-click existing text
             * to edit it.
             */
            if (
                selected.type === "text" &&
                event.detail === 2
            ) {
                onStartTextEditing({
                    x: selected.x,
                    y: selected.y,
                    text: selected.text,
                    fontSize:
                        selected.fontSize ??
                        20,
                    elementId:
                        selected.id,
                });

                return;
            }
            if (
                selected.type === "note" &&
                event.detail === 2
            ) {
                onStartNoteEditing({
                    x: selected.x,
                    y: selected.y,
                    width: selected.width,
                    height: selected.height,
                    text: selected.text,
                    elementId:
                        selected.id,
                });

                return;
            }

            /*
             * Begin moving selected object.
             *
             * We capture the complete state BEFORE
             * the movement begins. This lets Undo
             * restore the object in one operation
             * instead of creating history entries
             * for every pointer movement.
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
                beforeElements:
                    beginHistory(),
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
             *
             * deleteElement() already records
             * the previous state in history.
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
                beforeElements: [],
            };

            return;
        }


        if (
            activeTool === "text"
        ) {
            onStartTextEditing({
                x: world.x,
                y: world.y,
                text: "",
                fontSize: 20,
                elementId: null,
            });

            return;
        }


        if (
            activeTool === "note"
        ) {
            onStartNoteEditing({
                x: world.x,
                y: world.y,
                width: 180,
                height: 120,
                text: "",
                elementId: null,
            });

            return;
        }


        if (
            activeTool === "draw"
        ) {
            const id =
                createId();

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
                beforeElements: [],
            };

            event.currentTarget.setPointerCapture(
                event.pointerId
            );

            return;
        }


        if (
            isShapeTool(activeTool)
        ) {
            const id =
                createId();

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
                beforeElements: [],
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

        /*
         * Release pointer capture.
         */
        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId
            );
        }

        /*
         * Record a single history entry
         * for the entire move operation.
         */
        if (
            drawing.mode === "move" &&
            drawing.beforeElements.length > 0
        ) {
            commitHistory(
                drawing.beforeElements
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