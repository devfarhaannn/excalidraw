"use client";

import {
    useEffect,
    useRef,
    useState,
    type RefObject,
} from "react";

type Pan = {
    x: number;
    y: number;
};

type UseCanvasPanProps = {
    containerRef: RefObject<HTMLDivElement | null>;
    activeTool: string;
};

export function useCanvasPan({
    containerRef,
    activeTool,
}: UseCanvasPanProps) {
    const [pan, setPan] = useState<Pan>({
        x: 0,
        y: 0,
    });

    const [isPanning, setIsPanning] =
        useState(false);

    const [spacePressed, setSpacePressed] =
        useState(false);

    const panRef = useRef<Pan>({
        x: 0,
        y: 0,
    });

    const dragRef = useRef({
        active: false,
        pointerId: -1,
        lastX: 0,
        lastY: 0,
    });

    /*
     * Keep the latest pan available
     * without waiting for a React render.
     */
    useEffect(() => {
        panRef.current = pan;
    }, [pan]);

    /*
     * SPACE KEY
     *
     * Space temporarily enables pan mode.
     */
    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            const target =
                event.target as HTMLElement | null;

            const isTyping =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.tagName === "SELECT" ||
                target?.isContentEditable;

            if (isTyping) {
                return;
            }

            if (event.code === "Space") {
                event.preventDefault();
                setSpacePressed(true);
            }
        };

        const handleKeyUp = (
            event: KeyboardEvent
        ) => {
            if (event.code === "Space") {
                event.preventDefault();
                setSpacePressed(false);
            }
        };

        const handleBlur = () => {
            setSpacePressed(false);
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        window.addEventListener(
            "keyup",
            handleKeyUp
        );

        window.addEventListener(
            "blur",
            handleBlur
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

            window.removeEventListener(
                "keyup",
                handleKeyUp
            );

            window.removeEventListener(
                "blur",
                handleBlur
            );
        };
    }, []);

    /*
     * Determine whether this pointer
     * interaction should pan.
     *
     * Middle mouse:
     *     button === 1
     *
     * Hand tool:
     *     left mouse + hand
     *
     * Space:
     *     left mouse + space
     */
    function shouldPan(
        event: PointerEvent
    ) {
        if (event.button === 1) {
            return true;
        }

        if (
            event.button === 0 &&
            (
                activeTool === "hand" ||
                spacePressed
            )
        ) {
            return true;
        }

        return false;
    }

    /*
     * Start panning.
     */
    function handlePointerDown(
        event: PointerEvent
    ) {
        if (!shouldPan(event)) {
            return false;
        }

        const container =
            containerRef.current;

        if (!container) {
            return false;
        }

        event.preventDefault();

        container.setPointerCapture(
            event.pointerId
        );

        dragRef.current = {
            active: true,
            pointerId: event.pointerId,
            lastX: event.clientX,
            lastY: event.clientY,
        };

        setIsPanning(true);

        return true;
    }

    /*
     * Move the canvas.
     */
    function handlePointerMove(
        event: PointerEvent
    ) {
        if (
            !dragRef.current.active
        ) {
            return;
        }

        if (
            dragRef.current.pointerId !==
            event.pointerId
        ) {
            return;
        }

        const deltaX =
            event.clientX -
            dragRef.current.lastX;

        const deltaY =
            event.clientY -
            dragRef.current.lastY;

        dragRef.current.lastX =
            event.clientX;

        dragRef.current.lastY =
            event.clientY;

        const nextPan = {
            x:
                panRef.current.x +
                deltaX,

            y:
                panRef.current.y +
                deltaY,
        };

        panRef.current = nextPan;
        setPan(nextPan);
    }

    /*
     * Stop panning.
     */
    function handlePointerUp(
        event: PointerEvent
    ) {
        if (
            !dragRef.current.active
        ) {
            return;
        }

        const container =
            containerRef.current;

        if (
            container?.hasPointerCapture(
                event.pointerId
            )
        ) {
            container.releasePointerCapture(
                event.pointerId
            );
        }

        dragRef.current = {
            active: false,
            pointerId: -1,
            lastX: 0,
            lastY: 0,
        };

        setIsPanning(false);
    }

    /*
     * Connect native pointer events
     * to the container.
     */
    useEffect(() => {
        const container =
            containerRef.current;

        if (!container) {
            return;
        }

        const pointerDown =
            (event: PointerEvent) => {
                handlePointerDown(event);
            };

        const pointerMove =
            (event: PointerEvent) => {
                handlePointerMove(event);
            };

        const pointerUp =
            (event: PointerEvent) => {
                handlePointerUp(event);
            };

        container.addEventListener(
            "pointerdown",
            pointerDown
        );

        container.addEventListener(
            "pointermove",
            pointerMove
        );

        container.addEventListener(
            "pointerup",
            pointerUp
        );

        container.addEventListener(
            "pointercancel",
            pointerUp
        );

        return () => {
            container.removeEventListener(
                "pointerdown",
                pointerDown
            );

            container.removeEventListener(
                "pointermove",
                pointerMove
            );

            container.removeEventListener(
                "pointerup",
                pointerUp
            );

            container.removeEventListener(
                "pointercancel",
                pointerUp
            );
        };
    }, [
        containerRef,
        activeTool,
        spacePressed,
    ]);

    const cursor =
        isPanning
            ? "grabbing"
            : activeTool === "hand" ||
                spacePressed
                ? "grab"
                : "default";

    return {
        pan,
        setPan,
        isPanning,
        spacePressed,
        cursor,
    };
}