"use client";

import { useEffect, useRef, type RefObject } from "react";

type Pan = {
    x: number;
    y: number;
};

type UseCanvasZoomProps = {
    containerRef: RefObject<HTMLDivElement | null>;
    zoom: number;
    onZoomChange: (zoom: number) => void;
    pan: Pan;
    onPanChange: (pan: Pan) => void;
};

const MIN_ZOOM = 10;
const MAX_ZOOM = 500;

export function useCanvasZoom({
    containerRef,
    zoom,
    onZoomChange,
    pan,
    onPanChange,
}: UseCanvasZoomProps) {
    const zoomRef = useRef(zoom);
    const panRef = useRef(pan);

    useEffect(() => {
        zoomRef.current = zoom;
    }, [zoom]);

    useEffect(() => {
        panRef.current = pan;
    }, [pan]);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            event.stopPropagation();

            const rect =
                container.getBoundingClientRect();

            const currentZoom = zoomRef.current;
            const currentScale = currentZoom / 100;

            const factor = Math.exp(
                -event.deltaY * 0.0015
            );

            let nextZoom =
                currentZoom * factor;

            nextZoom = Math.max(
                MIN_ZOOM,
                Math.min(MAX_ZOOM, nextZoom)
            );

            nextZoom =
                Math.round(nextZoom / 5) * 5;

            if (nextZoom === currentZoom) {
                return;
            }

            const nextScale = nextZoom / 100;

            const mouseX =
                event.clientX - rect.left;

            const mouseY =
                event.clientY - rect.top;

            /*
             * Find the world point currently
             * underneath the mouse.
             */
            const worldX =
                (mouseX -
                    rect.width / 2 -
                    panRef.current.x) /
                currentScale;

            const worldY =
                (mouseY -
                    rect.height / 2 -
                    panRef.current.y) /
                currentScale;

            /*
             * Keep that same world point
             * underneath the mouse after zoom.
             */
            const nextPan = {
                x:
                    mouseX -
                    rect.width / 2 -
                    worldX * nextScale,

                y:
                    mouseY -
                    rect.height / 2 -
                    worldY * nextScale,
            };

            panRef.current = nextPan;

            onPanChange(nextPan);

            zoomRef.current = nextZoom;

            onZoomChange(nextZoom);
        };

        container.addEventListener(
            "wheel",
            handleWheel,
            { passive: false }
        );

        return () => {
            container.removeEventListener(
                "wheel",
                handleWheel
            );
        };
    }, [
        containerRef,
        onPanChange,
        onZoomChange,
    ]);
}