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

    beginHistory: () => CanvasElement[];

    commitHistory: (
        beforeElements: CanvasElement[]
    ) => void;
};

type Bounds = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};

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

            const width =
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
                    element.x + width,
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

export default function SelectionOverlay({
    containerRef,
    element,
    zoom,
    pan,
    updateElement,
    beginHistory,
    commitHistory,
}: SelectionOverlayProps) {
    const [
        bounds,
        setBounds,
    ] = useState<Bounds>(() =>
        getElementBounds(element)
    );

    useEffect(() => {
        setBounds(
            getElementBounds(element)
        );
    }, [element]);

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
        beginHistory,
        commitHistory,
    });

    const scale = zoom / 100;

    /*
     * Convert world coordinates to
     * screen coordinates.
     */
    const left =
        `calc(50% + ${
            pan.x +
            bounds.minX * scale
        }px)`;

    const top =
        `calc(50% + ${
            pan.y +
            bounds.minY * scale
        }px)`;

    const width =
        Math.max(
            (bounds.maxX -
                bounds.minX) *
                scale,
            10
        );

    const height =
        Math.max(
            (bounds.maxY -
                bounds.minY) *
                scale,
            10
        );

    const handleSize = 10;

    const handles: {
        id: Handle;
        className: string;
    }[] = [
        {
            id: "nw",
            className:
                "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
        },
        {
            id: "ne",
            className:
                "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize",
        },
        {
            id: "sw",
            className:
                "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
        },
        {
            id: "se",
            className:
                "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
        },
    ];

    return (
        <div
            className="pointer-events-none absolute z-30"
            style={{
                left,
                top,
                width,
                height,
            }}
        >
            {/* Selection border */}
            <div className="absolute inset-0 rounded-[2px] border border-[#625DF5]" />

            {/* Resize handles */}
            {handles.map(
                ({ id, className }) => (
                    <div
                        key={id}
                        className={[
                            "pointer-events-auto absolute rounded-[3px] border border-[#625DF5] bg-white shadow-sm",
                            className,
                        ].join(" ")}
                        style={{
                            width:
                                handleSize,
                            height:
                                handleSize,
                        }}
                        onPointerDown={(
                            event
                        ) =>
                            handlePointerDown(
                                id,
                                event as ReactPointerEvent<HTMLDivElement>
                            )
                        }
                        onPointerMove={(
                            event
                        ) =>
                            handlePointerMove(
                                event as ReactPointerEvent<HTMLDivElement>
                            )
                        }
                        onPointerUp={(
                            event
                        ) =>
                            handlePointerUp(
                                event as ReactPointerEvent<HTMLDivElement>
                            )
                        }
                        onPointerCancel={(
                            event
                        ) =>
                            handlePointerUp(
                                event as ReactPointerEvent<HTMLDivElement>
                            )
                        }
                    />
                )
            )}
        </div>
    );
}