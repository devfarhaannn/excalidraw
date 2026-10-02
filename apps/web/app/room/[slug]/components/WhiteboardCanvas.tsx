"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Redo2,
    Undo2,
} from "lucide-react";

import {
    useCanvasDrawing,
    type TextEditingTarget,
} from "../hooks/useCanvasDrawing";

import {
    useCanvasPan,
} from "../hooks/useCanvasPan";

import {
    useCanvasZoom,
} from "../hooks/useCanvasZoom";

import {
    useWhiteboard,
} from "../hooks/useWhiteBoard";

import {
    renderCanvas,
} from "../lib/canvas/renderCanvas";

import SelectionOverlay from "./SelectionOverlay";
import TextEditorOverlay from "./TextEditorOverlay";

import type {
    ToolId,
} from "../types/whiteboard";

type WhiteboardCanvasProps = {
    zoom: number;
    onZoomChange: (
        zoom: number
    ) => void;
    background: string;
    dark: boolean;
    activeTool: ToolId;
};

export default function WhiteboardCanvas({
    zoom,
    onZoomChange,
    background,
    dark,
    activeTool,
}: WhiteboardCanvasProps) {
    const containerRef =
        useRef<HTMLDivElement | null>(
            null
        );

    const canvasRef =
        useRef<HTMLCanvasElement | null>(
            null
        );

    const {
        elements,
        selectedId,

        addElement,
        updateElement,
        deleteElement,
        selectElement,

        beginHistory,
        commitHistory,

        undo,
        redo,

        canUndo,
        canRedo,
    } = useWhiteboard();

    const [
        textEditor,
        setTextEditor,
    ] = useState<TextEditingTarget | null>(
        null
    );

    function startTextEditing(
        target: TextEditingTarget
    ) {
        setTextEditor(target);
    }

    function updateTextEditor(
        value: string
    ) {
        setTextEditor((current) => {
            if (!current) {
                return null;
            }

            return {
                ...current,
                text: value,
            };
        });
    }

    function commitTextEditing() {
        if (!textEditor) {
            return;
        }

        const value =
            textEditor.text.trim();

        /*
         * Empty text = cancel
         */
        if (!value) {
            setTextEditor(null);
            return;
        }

        /*
         * New text
         */
        if (
            textEditor.elementId === null
        ) {
            addElement({
                id:
                    Date.now() +
                    Math.floor(
                        Math.random() * 1000
                    ),

                type: "text",

                x: textEditor.x,

                y: textEditor.y,

                text: value,

                fontSize:
                    textEditor.fontSize,
            });
        }

        /*
         * Edit existing text
         */
        else {
            const beforeElements =
                beginHistory();

            updateElement(
                textEditor.elementId,
                (current) => {
                    if (
                        current.type !==
                        "text"
                    ) {
                        return current;
                    }

                    return {
                        ...current,
                        text: value,
                        fontSize:
                            textEditor.fontSize,
                    };
                }
            );

            commitHistory(
                beforeElements
            );
        }

        setTextEditor(null);
    }

    function cancelTextEditing() {
        setTextEditor(null);
    }

    const {
        pan,
        setPan,
        cursor,
        spacePressed,
    } = useCanvasPan({
        containerRef,
        activeTool,
    });

    useCanvasZoom({
        containerRef,
        zoom,
        onZoomChange,
        pan,
        onPanChange: setPan,
    });

    const {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    } = useCanvasDrawing({
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

        onStartTextEditing:
            startTextEditing,
    });

    /*
     * ------------------------------------------
     * UNDO / REDO KEYBOARD SHORTCUTS
     * ------------------------------------------
     *
     * Mac:
     * Cmd + Z       → Undo
     * Cmd + Shift Z → Redo
     *
     * Windows/Linux:
     * Ctrl + Z       → Undo
     * Ctrl + Shift Z → Redo
     * Ctrl + Y       → Redo
     */
    useEffect(() => {
        function handleKeyDown(
            event: KeyboardEvent
        ) {
            const target =
                event.target as HTMLElement | null;

            const typing =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.tagName === "SELECT" ||
                target?.isContentEditable;

            /*
             * Don't intercept shortcuts while
             * typing into an input/editor.
             */
            if (typing) {
                return;
            }

            const modifier =
                event.metaKey ||
                event.ctrlKey;

            /*
             * Undo
             */
            if (
                modifier &&
                event.key.toLowerCase() === "z" &&
                !event.shiftKey
            ) {
                event.preventDefault();

                undo();

                return;
            }

            /*
             * Redo:
             * Cmd/Ctrl + Shift + Z
             */
            if (
                modifier &&
                event.key.toLowerCase() === "z" &&
                event.shiftKey
            ) {
                event.preventDefault();

                redo();

                return;
            }

            /*
             * Windows/Linux:
             * Ctrl + Y
             */
            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "y"
            ) {
                event.preventDefault();

                redo();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        undo,
        redo,
    ]);


    useEffect(() => {
        const canvas =
            canvasRef.current;

        const container =
            containerRef.current;

        if (
            !canvas ||
            !container
        ) {
            return;
        }

        renderCanvas({
            canvas,
            container,
            elements,
            pan,
            zoom,
            background,
            dark,
        });
    }, [
        elements,
        pan,
        zoom,
        background,
        dark,
    ]);

    /*
     */
    useEffect(() => {
        const canvas =
            canvasRef.current;

        const container =
            containerRef.current;

        if (
            !canvas ||
            !container
        ) {
            return;
        }

        const resizeObserver =
            new ResizeObserver(() => {
                renderCanvas({
                    canvas,
                    container,
                    elements,
                    pan,
                    zoom,
                    background,
                    dark,
                });
            });

        resizeObserver.observe(
            container
        );

        return () => {
            resizeObserver.disconnect();
        };
    }, [
        elements,
        pan,
        zoom,
        background,
        dark,
    ]);

    const selectedElement =
        selectedId === null
            ? null
            : elements.find(
                  (element) =>
                      element.id ===
                      selectedId
              );

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden select-none"
            style={{
                cursor,
                touchAction: "none",
                overscrollBehavior: "none",
            }}
            onPointerDown={
                handlePointerDown
            }
            onPointerMove={
                handlePointerMove
            }
            onPointerUp={
                handlePointerUp
            }
            onPointerCancel={
                handlePointerUp
            }
            onContextMenu={(event) => {
                event.preventDefault();
            }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block h-full w-full"
            />


            <div
                className={[
                    "absolute bottom-4 left-4 z-50 flex items-center rounded-xl border p-1 shadow-[0_8px_30px_rgba(20,20,30,.08)] backdrop-blur-xl",
                    dark
                        ? "border-white/10 bg-[#242429]/95"
                        : "border-black/[0.07] bg-white/[0.96]",
                ].join(" ")}
                onPointerDown={(event) => {
                    event.stopPropagation();
                }}
                onPointerUp={(event) => {
                    event.stopPropagation();
                }}
            >
                {/* UNDO */}
                <button
                    type="button"
                    title="Undo"
                    disabled={!canUndo}
                    onPointerDown={(event) => {
                        event.stopPropagation();
                    }}
                    onPointerUp={(event) => {
                        event.stopPropagation();
                    }}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        undo();
                    }}
                    className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                        !canUndo
                            ? dark
                                ? "cursor-not-allowed text-white/20"
                                : "cursor-not-allowed text-[#c6c6cc]"
                            : dark
                                ? "text-white/55 hover:bg-white/[0.07] hover:text-white"
                                : "text-[#696973] hover:bg-[#f5f4fa]",
                    ].join(" ")}
                >
                    <Undo2 className="h-4 w-4" />
                </button>

                {/* REDO */}
                <button
                    type="button"
                    title="Redo"
                    disabled={!canRedo}
                    onPointerDown={(event) => {
                        event.stopPropagation();
                    }}
                    onPointerUp={(event) => {
                        event.stopPropagation();
                    }}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        redo();
                    }}
                    className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                        !canRedo
                            ? dark
                                ? "cursor-not-allowed text-white/20"
                                : "cursor-not-allowed text-[#c6c6cc]"
                            : dark
                                ? "text-white/55 hover:bg-white/[0.07] hover:text-white"
                                : "text-[#696973] hover:bg-[#f5f4fa]",
                    ].join(" ")}
                >
                    <Redo2 className="h-4 w-4" />
                </button>
            </div>

            {selectedElement && (
                <SelectionOverlay
                    containerRef={
                        containerRef
                    }
                    element={
                        selectedElement
                    }
                    zoom={zoom}
                    pan={pan}
                    updateElement={
                        updateElement
                    }
                    beginHistory={
                        beginHistory
                    }
                    commitHistory={
                        commitHistory
                    }
                />
            )}

            {textEditor && (
                <TextEditorOverlay
                    x={textEditor.x}
                    y={textEditor.y}
                    text={textEditor.text}
                    fontSize={
                        textEditor.fontSize
                    }
                    zoom={zoom}
                    pan={pan}
                    dark={dark}
                    onChange={
                        updateTextEditor
                    }
                    onCommit={
                        commitTextEditing
                    }
                    onCancel={
                        cancelTextEditing
                    }
                />
            )}
        </div>
    );
}