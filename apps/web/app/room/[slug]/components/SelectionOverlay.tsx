"use client";

import {
    useEffect,
    useState,
    type RefObject,
} from "react";

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
}: SelectionOverlayProps) {
    const [
        viewport,
        setViewport,
    ] = useState({
        width: 0,
        height: 0,
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
        (bounds.maxX - bounds.minX) *
            scale +
        padding * 2;

    const height =
        (bounds.maxY - bounds.minY) *
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
                width: Math.max(width, 12),
                height: Math.max(height, 12),
            }}
        >
            {/* Selection border */}
            <div className="absolute inset-0 rounded-[2px] border border-[#625DF5] border-dashed" />

            {/* Top-left handle */}
            <Handle
                className="-left-[4px] -top-[4px]"
            />

            {/* Top-right handle */}
            <Handle
                className="-right-[4px] -top-[4px]"
            />

            {/* Bottom-left handle */}
            <Handle
                className="-bottom-[4px] -left-[4px]"
            />

            {/* Bottom-right handle */}
            <Handle
                className="-bottom-[4px] -right-[4px]"
            />
        </div>
    );
}

function Handle({
    className,
}: {
    className: string;
}) {
    return (
        <div
            className={[
                "absolute h-2 w-2 rounded-[2px] border border-white bg-[#625DF5] shadow-sm",
                className,
            ].join(" ")}
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
            const firstPoint =
                element.points[0];

            if (!firstPoint) {
                return {
                    minX: 0,
                    minY: 0,
                    maxX: 0,
                    maxY: 0,
                };
            }

            let minX = firstPoint.x;
            let minY = firstPoint.y;
            let maxX = firstPoint.x;
            let maxY = firstPoint.y;

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

        case "text":
            return {
                minX: element.x,
                minY: element.y,
                maxX:
                    element.x +
                    Math.max(
                        element.text.length *
                            10,
                        20
                    ),
                maxY:
                    element.y + 24,
            };

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