"use client";

import {
    useRef,
    type PointerEvent as ReactPointerEvent,
    type RefObject,
} from "react";

import type {
    CanvasElement,
    Point,
} from "../types/whiteboard";

type Pan = {
    x: number;
    y: number;
};

export type Handle =
    | "nw"
    | "ne"
    | "sw"
    | "se";

type Bounds = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};

type UseSelectionResizeProps = {
    containerRef: RefObject<HTMLDivElement | null>;

    element: CanvasElement;

    zoom: number;

    pan: Pan;

    updateElement: (
        id: number,
        update: (
            element: CanvasElement
        ) => CanvasElement
    ) => void;
};

type ResizeState = {
    active: boolean;

    handle: Handle | null;

    startBounds: Bounds;
};

const MIN_SIZE = 10;

export function useSelectionResize({
    containerRef,
    element,
    zoom,
    pan,
    updateElement,
}: UseSelectionResizeProps) {
    const resizeRef =
        useRef<ResizeState>({
            active: false,

            handle: null,

            startBounds: {
                minX: 0,
                minY: 0,
                maxX: 0,
                maxY: 0,
            },
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

    function getElementBounds(
        current: CanvasElement
    ): Bounds {
        switch (current.type) {
            case "rectangle":
            case "diamond":
            case "ellipse":
            case "line":
            case "arrow":
                return {
                    minX: Math.min(
                        current.x1,
                        current.x2
                    ),

                    minY: Math.min(
                        current.y1,
                        current.y2
                    ),

                    maxX: Math.max(
                        current.x1,
                        current.x2
                    ),

                    maxY: Math.max(
                        current.y1,
                        current.y2
                    ),
                };

            case "draw": {
                const first =
                    current.points[0];

                if (!first) {
                    return {
                        minX: 0,
                        minY: 0,
                        maxX: 0,
                        maxY: 0,
                    };
                }

                let minX = first.x;
                let minY = first.y;
                let maxX = first.x;
                let maxY = first.y;

                for (
                    let i = 1;
                    i <
                    current.points.length;
                    i++
                ) {
                    const point =
                        current.points[i];

                    if (!point) {
                        continue;
                    }

                    minX = Math.min(
                        minX,
                        point.x
                    );

                    minY = Math.min(
                        minY,
                        point.y
                    );

                    maxX = Math.max(
                        maxX,
                        point.x
                    );

                    maxY = Math.max(
                        maxY,
                        point.y
                    );
                }

                return {
                    minX,
                    minY,
                    maxX,
                    maxY,
                };
            }

            case "text": {
                const fontSize =
                    current.fontSize ?? 20;

                const width =
                    Math.max(
                        current.text.length *
                            fontSize *
                            0.55,
                        fontSize
                    );

                return {
                    minX: current.x,

                    minY: current.y,

                    maxX:
                        current.x +
                        width,

                    maxY:
                        current.y +
                        fontSize * 1.2,
                };
            }

            case "note":
                return {
                    minX: current.x,

                    minY: current.y,

                    maxX:
                        current.x +
                        current.width,

                    maxY:
                        current.y +
                        current.height,
                };
        }
    }

    function handlePointerDown(
        handle: Handle,
        event: ReactPointerEvent<HTMLDivElement>
    ) {
        event.preventDefault();

        event.stopPropagation();

        resizeRef.current = {
            active: true,

            handle,

            startBounds:
                getElementBounds(
                    element
                ),
        };

        event.currentTarget.setPointerCapture(
            event.pointerId
        );
    }

    function handlePointerMove(
        event: ReactPointerEvent<HTMLDivElement>
    ) {
        const resize =
            resizeRef.current;

        if (
            !resize.active ||
            !resize.handle
        ) {
            return;
        }

        event.preventDefault();

        event.stopPropagation();

        const currentWorld =
            screenToWorld(
                event.clientX,
                event.clientY
            );

        let minX =
            resize.startBounds.minX;

        let minY =
            resize.startBounds.minY;

        let maxX =
            resize.startBounds.maxX;

        let maxY =
            resize.startBounds.maxY;

        switch (resize.handle) {
            case "nw":
                minX = Math.min(
                    currentWorld.x,
                    maxX - MIN_SIZE
                );

                minY = Math.min(
                    currentWorld.y,
                    maxY - MIN_SIZE
                );

                break;

            case "ne":
                maxX = Math.max(
                    currentWorld.x,
                    minX + MIN_SIZE
                );

                minY = Math.min(
                    currentWorld.y,
                    maxY - MIN_SIZE
                );

                break;

            case "sw":
                minX = Math.min(
                    currentWorld.x,
                    maxX - MIN_SIZE
                );

                maxY = Math.max(
                    currentWorld.y,
                    minY + MIN_SIZE
                );

                break;

            case "se":
                maxX = Math.max(
                    currentWorld.x,
                    minX + MIN_SIZE
                );

                maxY = Math.max(
                    currentWorld.y,
                    minY + MIN_SIZE
                );

                break;
        }

        const newBounds: Bounds = {
            minX,
            minY,
            maxX,
            maxY,
        };

        updateElement(
            element.id,
            (current) =>
                resizeElement(
                    current,
                    resize.startBounds,
                    newBounds
                )
        );
    }

    function handlePointerUp(
        event: ReactPointerEvent<HTMLDivElement>
    ) {
        event.preventDefault();

        event.stopPropagation();

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId
            );
        }

        resizeRef.current = {
            active: false,

            handle: null,

            startBounds: {
                minX: 0,
                minY: 0,
                maxX: 0,
                maxY: 0,
            },
        };
    }

    return {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    };
}

function resizeElement(
    element: CanvasElement,
    oldBounds: Bounds,
    newBounds: Bounds
): CanvasElement {
    const oldWidth =
        Math.max(
            oldBounds.maxX -
                oldBounds.minX,
            1
        );

    const oldHeight =
        Math.max(
            oldBounds.maxY -
                oldBounds.minY,
            1
        );

    const newWidth =
        Math.max(
            newBounds.maxX -
                newBounds.minX,
            MIN_SIZE
        );

    const newHeight =
        Math.max(
            newBounds.maxY -
                newBounds.minY,
            MIN_SIZE
        );

    const scaleX =
        newWidth / oldWidth;

    const scaleY =
        newHeight / oldHeight;

    function transformX(
        value: number
    ) {
        return (
            newBounds.minX +
            (value -
                oldBounds.minX) *
                scaleX
        );
    }

    function transformY(
        value: number
    ) {
        return (
            newBounds.minY +
            (value -
                oldBounds.minY) *
                scaleY
        );
    }

    /*
     * Rectangle
     * Diamond
     * Ellipse
     * Line
     * Arrow
     */
    if (
        element.type === "rectangle" ||
        element.type === "diamond" ||
        element.type === "ellipse" ||
        element.type === "line" ||
        element.type === "arrow"
    ) {
        return {
            ...element,

            x1: transformX(
                element.x1
            ),

            y1: transformY(
                element.y1
            ),

            x2: transformX(
                element.x2
            ),

            y2: transformY(
                element.y2
            ),
        };
    }

    /*
     * Freehand drawing
     */
    if (element.type === "draw") {
        return {
            ...element,

            points:
                element.points.map(
                    (point) => ({
                        x: transformX(
                            point.x
                        ),

                        y: transformY(
                            point.y
                        ),
                    })
                ),
        };
    }

    /*
     * Text
     */
    if (element.type === "text") {
        const oldFontSize =
            element.fontSize ?? 20;

        const oldTextWidth =
            Math.max(
                oldBounds.maxX -
                    oldBounds.minX,
                1
            );

        const newTextWidth =
            Math.max(
                newBounds.maxX -
                    newBounds.minX,
                1
            );

        const scale =
            newTextWidth /
            oldTextWidth;

        const newFontSize =
            Math.max(
                8,
                Math.min(
                    120,
                    oldFontSize *
                        scale
                )
            );

        return {
            ...element,

            x: newBounds.minX,

            y: newBounds.minY,

            fontSize:
                newFontSize,
        };
    }

    /*
     * Note
     */
    if (element.type === "note") {
        return {
            ...element,

            x: newBounds.minX,

            y: newBounds.minY,

            width: Math.max(
                newBounds.maxX -
                    newBounds.minX,
                MIN_SIZE
            ),

            height: Math.max(
                newBounds.maxY -
                    newBounds.minY,
                MIN_SIZE
            ),
        };
    }

    return element;
}