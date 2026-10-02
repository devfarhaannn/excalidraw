"use client";

import {
    useEffect,
    useState,
    type PointerEvent as ReactPointerEvent,
    type RefObject,
} from "react";

import {
    useSelectionResize,
    type Handle,
} from "../hooks/useSelectionResize";

import type {
    CanvasElement,
} from "../types/whiteboard";

type Pan = {
    x: number;
    y: number;
};

type SelectionOverlayProps = {
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

type Bounds = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};

export default function SelectionOverlay({
    containerRef,
    element,
    zoom,
    pan,
    updateElement,
}: SelectionOverlayProps) {
    const [
        viewport,
        setViewport,
    ] = useState({
        width: 0,
        height: 0,
    });

    const {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    } = useSelectionResize({
        containerRef,
        element,
        zoom,
        pan,
        updateElement,
    });

    useEffect(() => {
        function updateViewport() {
            const container =
                containerRef.current;

            if (!container) {
                return;
            }

            const rect =
                container.getBoundingClientRect();

            setViewport({
                width: rect.width,
                height: rect.height,
            });
        }

        updateViewport();

        window.addEventListener(
            "resize",
            updateViewport
        );

        return () => {
            window.removeEventListener(
                "resize",
                updateViewport
            );
        };
    }, [containerRef]);

    const bounds =
        getElementBounds(element);

    const scale = zoom / 100;

    const padding = 6;

    const left =
        viewport.width / 2 +
        pan.x +
        bounds.minX * scale -
        padding;

    const top =
        viewport.height / 2 +
        pan.y +
        bounds.minY * scale -
        padding;

    const width =
        (bounds.maxX -
            bounds.minX) *
            scale +
        padding * 2;

    const height =
        (bounds.maxY -
            bounds.minY) *
            scale +
        padding * 2;

    if (
        viewport.width === 0 ||
        viewport.height === 0
    ) {
        return null;
    }

    return (
        <div
            className="pointer-events-none absolute z-20"
            style={{
                left,
                top,
                width: Math.max(
                    width,
                    12
                ),
                height: Math.max(
                    height,
                    12
                ),
            }}
        >
            <div className="absolute inset-0 rounded-[2px] border border-dashed border-[#625DF5]" />

            <ResizeHandle
                handle="nw"
                className="-left-[4px] -top-[4px] cursor-nwse-resize"
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
            />

            <ResizeHandle
                handle="ne"
                className="-right-[4px] -top-[4px] cursor-nesw-resize"
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
            />

            <ResizeHandle
                handle="sw"
                className="-bottom-[4px] -left-[4px] cursor-nesw-resize"
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
            />

            <ResizeHandle
                handle="se"
                className="-bottom-[4px] -right-[4px] cursor-nwse-resize"
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
            />
        </div>
    );
}

function ResizeHandle({
    handle,
    className,
    onPointerDown,
    onPointerMove,
    onPointerUp,
}: {
    handle: Handle;
    className: string;
    onPointerDown: (
        handle: Handle,
        event: ReactPointerEvent<HTMLDivElement>
    ) => void;
    onPointerMove: (
        event: ReactPointerEvent<HTMLDivElement>
    ) => void;
    onPointerUp: (
        event: ReactPointerEvent<HTMLDivElement>
    ) => void;
}) {
    return (
        <div
            data-handle={handle}
            className={[
                "pointer-events-auto absolute h-2.5 w-2.5 rounded-[2px] border border-white bg-[#625DF5] shadow-sm",
                className,
            ].join(" ")}
            onPointerDown={(event) =>
                onPointerDown(
                    handle,
                    event
                )
            }
            onPointerMove={
                onPointerMove
            }
            onPointerUp={
                onPointerUp
            }
        />
    );
}

function getElementBounds(
    element: CanvasElement
): Bounds {
    switch (element.type) {
        case "rectangle":
        case "diamond":
        case "ellipse":
        case "line":
        case "arrow":
            return {
                minX: Math.min(
                    element.x1,
                    element.x2
                ),
                minY: Math.min(
                    element.y1,
                    element.y2
                ),
                maxX: Math.max(
                    element.x1,
                    element.x2
                ),
                maxY: Math.max(
                    element.y1,
                    element.y2
                ),
            };

        case "draw": {
            const first =
                element.points[0];

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
                i < element.points.length;
                i++
            ) {
                const point =
                    element.points[i];

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
                element.fontSize ?? 20;

            const textWidth =
                Math.max(
                    element.text.length *
                        fontSize *
                        0.55,
                    fontSize
                );

            return {
                minX: element.x,
                minY: element.y,
                maxX:
                    element.x +
                    textWidth,
                maxY:
                    element.y +
                    fontSize * 1.2,
            };
        }

        case "note":
            return {
                minX: element.x,
                minY: element.y,
                maxX:
                    element.x +
                    element.width,
                maxY:
                    element.y +
                    element.height,
            };
    }
}