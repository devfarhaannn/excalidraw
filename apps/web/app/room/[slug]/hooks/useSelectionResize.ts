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

export type Handle = "nw" | "ne" | "sw" | "se";

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

    beginHistory: () => CanvasElement[];

    commitHistory: (
        beforeElements: CanvasElement[]
    ) => void;
};

type ResizeState = {
    active: boolean;
    handle: Handle | null;
    startBounds: Bounds;
    startElement: CanvasElement | null;
    changed: boolean;
};

const MIN_SIZE = 12;

const EMPTY_BOUNDS: Bounds = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
};

function getEmptyResizeState(): ResizeState {
    return {
        active: false,
        handle: null,
        startBounds: EMPTY_BOUNDS,
        startElement: null,
        changed: false,
    };
}

export function useSelectionResize({
    containerRef,
    element,
    zoom,
    pan,
    updateElement,
    beginHistory,
    commitHistory,
}: UseSelectionResizeProps) {
    const resizeRef = useRef<ResizeState>(
        getEmptyResizeState()
    );

    const historyBeforeRef =
        useRef<CanvasElement[] | null>(null);

    function screenToWorld(
        clientX: number,
        clientY: number
    ): Point {
        const container = containerRef.current;

        if (!container) {
            return { x: 0, y: 0 };
        }

        const rect = container.getBoundingClientRect();
        const scale = Math.max(zoom / 100, 0.01);

        return {
            x:
                (
                    clientX -
                    rect.left -
                    rect.width / 2 -
                    pan.x
                ) / scale,

            y:
                (
                    clientY -
                    rect.top -
                    rect.height / 2 -
                    pan.y
                ) / scale,
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
                    minX: Math.min(current.x1, current.x2),
                    minY: Math.min(current.y1, current.y2),
                    maxX: Math.max(current.x1, current.x2),
                    maxY: Math.max(current.y1, current.y2),
                };

            case "draw": {
                const first = current.points[0];

                if (!first) {
                    return EMPTY_BOUNDS;
                }

                let minX = first.x;
                let minY = first.y;
                let maxX = first.x;
                let maxY = first.y;

                for (const point of current.points) {
                    minX = Math.min(minX, point.x);
                    minY = Math.min(minY, point.y);
                    maxX = Math.max(maxX, point.x);
                    maxY = Math.max(maxY, point.y);
                }

                return { minX, minY, maxX, maxY };
            }

            case "text": {
                const fontSize = current.fontSize ?? 20;

                const width = Math.max(
                    current.text.length * fontSize * 0.55,
                    fontSize
                );

                return {
                    minX: current.x,
                    minY: current.y,
                    maxX: current.x + width,
                    maxY: current.y + fontSize * 1.2,
                };
            }

            case "note":
                return {
                    minX: current.x,
                    minY: current.y,
                    maxX: current.x + current.width,
                    maxY: current.y + current.height,
                };
        }
    }

    /*
     * Always resize from the original element snapshot.
     * Never resize the result of the previous pointer move.
     */
    function applyResize(
        clientX: number,
        clientY: number
    ) {
        const resize = resizeRef.current;
        const original = resize.startElement;
        const handle = resize.handle;

        if (
            !resize.active ||
            !original ||
            !handle
        ) {
            return;
        }

        const pointer = screenToWorld(clientX, clientY);
        const start = resize.startBounds;

        let minX = start.minX;
        let minY = start.minY;
        let maxX = start.maxX;
        let maxY = start.maxY;

        switch (handle) {
            case "nw":
                minX = Math.min(
                    pointer.x,
                    start.maxX - MIN_SIZE
                );

                minY = Math.min(
                    pointer.y,
                    start.maxY - MIN_SIZE
                );
                break;

            case "ne":
                maxX = Math.max(
                    pointer.x,
                    start.minX + MIN_SIZE
                );

                minY = Math.min(
                    pointer.y,
                    start.maxY - MIN_SIZE
                );
                break;

            case "sw":
                minX = Math.min(
                    pointer.x,
                    start.maxX - MIN_SIZE
                );

                maxY = Math.max(
                    pointer.y,
                    start.minY + MIN_SIZE
                );
                break;

            case "se":
                maxX = Math.max(
                    pointer.x,
                    start.minX + MIN_SIZE
                );

                maxY = Math.max(
                    pointer.y,
                    start.minY + MIN_SIZE
                );
                break;
        }

        const nextBounds: Bounds = {
            minX,
            minY,
            maxX,
            maxY,
        };

        resizeRef.current.changed =
            Math.abs(nextBounds.minX - start.minX) > 0.001 ||
            Math.abs(nextBounds.minY - start.minY) > 0.001 ||
            Math.abs(nextBounds.maxX - start.maxX) > 0.001 ||
            Math.abs(nextBounds.maxY - start.maxY) > 0.001;

        updateElement(
            original.id,
            () => resizeElement(
                original,
                start,
                nextBounds
            )
        );
    }

    function handlePointerDown(
        handle: Handle,
        event: ReactPointerEvent<HTMLDivElement>
    ) {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        historyBeforeRef.current = beginHistory();

        resizeRef.current = {
            active: true,
            handle,
            startBounds: getElementBounds(element),
            startElement: element,
            changed: false,
        };

        event.currentTarget.setPointerCapture(
            event.pointerId
        );
    }

    function handlePointerMove(
        event: ReactPointerEvent<HTMLDivElement>
    ) {
        if (!resizeRef.current.active) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        applyResize(
            event.clientX,
            event.clientY
        );
    }

    function handlePointerUp(
        event: ReactPointerEvent<HTMLDivElement>
    ) {
        if (!resizeRef.current.active) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        // Apply the exact mouse/touch release position.
        applyResize(
            event.clientX,
            event.clientY
        );

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId
            );
        }

        const before = historyBeforeRef.current;

        if (
            before &&
            resizeRef.current.changed
        ) {
            commitHistory(before);
        }

        historyBeforeRef.current = null;
        resizeRef.current = getEmptyResizeState();
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
    const oldWidth = Math.max(
        oldBounds.maxX - oldBounds.minX,
        1
    );

    const oldHeight = Math.max(
        oldBounds.maxY - oldBounds.minY,
        1
    );

    const newWidth = Math.max(
        newBounds.maxX - newBounds.minX,
        MIN_SIZE
    );

    const newHeight = Math.max(
        newBounds.maxY - newBounds.minY,
        MIN_SIZE
    );

    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;

    function transformX(value: number) {
        return (
            newBounds.minX +
            (value - oldBounds.minX) * scaleX
        );
    }

    function transformY(value: number) {
        return (
            newBounds.minY +
            (value - oldBounds.minY) * scaleY
        );
    }

    if (
        element.type === "rectangle" ||
        element.type === "diamond" ||
        element.type === "ellipse" ||
        element.type === "line" ||
        element.type === "arrow"
    ) {
        return {
            ...element,
            x1: transformX(element.x1),
            y1: transformY(element.y1),
            x2: transformX(element.x2),
            y2: transformY(element.y2),
        };
    }

    if (element.type === "draw") {
        return {
            ...element,
            points: element.points.map((point) => ({
                x: transformX(point.x),
                y: transformY(point.y),
            })),
        };
    }

    if (element.type === "text") {
        const oldFontSize = element.fontSize ?? 20;

        const newFontSize = Math.max(
            8,
            Math.min(
                120,
                oldFontSize * scaleX
            )
        );

        return {
            ...element,
            x: newBounds.minX,
            y: newBounds.minY,
            fontSize: newFontSize,
        };
    }

    if (element.type === "note") {
        return {
            ...element,
            x: newBounds.minX,
            y: newBounds.minY,
            width: newWidth,
            height: newHeight,
        };
    }

    return element;
}