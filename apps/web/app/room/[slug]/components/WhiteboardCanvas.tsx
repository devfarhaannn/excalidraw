"use client";

import {
    useCallback,
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
    type NoteEditingTarget,
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
import NoteEditorOverlay from "./NoteEditorOverlay";

import type {
    CanvasElement,
    ElementPropertyUpdater,
    ElementStylePatch,
    ToolId,
} from "../types/whiteboard";

type WhiteboardCanvasProps = {
    zoom: number;
    onZoomChange: (zoom: number) => void;
    background: string;
    dark: boolean;
    activeTool: ToolId;
    onToolChange: (tool: ToolId) => void;

    onSelectionChange?: (
        element: CanvasElement | null
    ) => void;

    onPropertyUpdaterReady?: (
        updater: ElementPropertyUpdater
    ) => void;
};

export default function WhiteboardCanvas({
    zoom,
    onZoomChange,
    background,
    dark,
    activeTool,
    onSelectionChange,
    onPropertyUpdaterReady,
    onToolChange,
}: WhiteboardCanvasProps) {
    const containerRef =
        useRef<HTMLDivElement | null>(null);

    const canvasRef =
        useRef<HTMLCanvasElement | null>(null);

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
    ] = useState<TextEditingTarget | null>(null);

    const [
        noteEditor,
        setNoteEditor,
    ] = useState<NoteEditingTarget | null>(null);

    // TEXT EDITING

    function startTextEditing(
        target: TextEditingTarget
    ) {
        setTextEditor(target);
    }

    function updateTextEditor(value: string) {
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

        const value = textEditor.text.trim();

        if (!value) {
            setTextEditor(null);
            return;
        }

        // Create new text.
        if (textEditor.elementId === null) {
            addElement({
                id:
                    Date.now() +
                    Math.floor(Math.random() * 1000),
                type: "text",
                x: textEditor.x,
                y: textEditor.y,
                text: value,
                fontSize: textEditor.fontSize,
            });
        } else {
            // Update existing text and record history.
            const beforeElements = beginHistory();

            updateElement(
                textEditor.elementId,
                (current) => {
                    if (current.type !== "text") {
                        return current;
                    }

                    return {
                        ...current,
                        text: value,
                        fontSize: textEditor.fontSize,
                    };
                }
            );

            commitHistory(beforeElements);
        }

        setTextEditor(null);
    }

    function cancelTextEditing() {
        setTextEditor(null);
    }

    // NOTE EDITING

    function startNoteEditing(
        target: NoteEditingTarget
    ) {
        setNoteEditor(target);
    }

    function updateNoteEditor(value: string) {
        setNoteEditor((current) => {
            if (!current) {
                return null;
            }

            return {
                ...current,
                text: value,
            };
        });
    }

    function commitNoteEditing() {
        if (!noteEditor) {
            return;
        }

        const value = noteEditor.text.trim();

        const beforeElements = beginHistory();

        const isNewNote =
            noteEditor.elementId === null;

        const noteId = isNewNote
            ? Date.now() + Math.floor(Math.random() * 1000)
            : noteEditor.elementId!;

        if (isNewNote) {
            addElement({
                id: noteId,
                type: "note",
                x: noteEditor.x,
                y: noteEditor.y,
                width: noteEditor.width,
                height: noteEditor.height,
                text: value,
            });
        } else {
            updateElement(
                noteId,
                (current) => {
                    if (current.type !== "note") {
                        return current;
                    }

                    return {
                        ...current,
                        text: value,
                    };
                }
            );
        }

        commitHistory(beforeElements);

        selectElement(noteId);

        setNoteEditor(null);

        // Return to selection after creating or editing a note.
        onToolChange("select");
    }

    function cancelNoteEditing() {
        setNoteEditor(null);
    }

    // PAN AND ZOOM

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

    // DRAWING AND SELECTION

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

        onStartTextEditing: startTextEditing,
        onStartNoteEditing: startNoteEditing,
        onToolChange
    });

    // UNDO / REDO KEYBOARD SHORTCUTS

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const target =
                event.target as HTMLElement | null;

            const typing =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.tagName === "SELECT" ||
                target?.isContentEditable;

            if (typing) {
                return;
            }

            const modifier =
                event.metaKey || event.ctrlKey;

            // Undo: Cmd/Ctrl + Z.
            if (
                modifier &&
                event.key.toLowerCase() === "z" &&
                !event.shiftKey
            ) {
                event.preventDefault();
                undo();
                return;
            }

            // Redo: Cmd/Ctrl + Shift + Z.
            if (
                modifier &&
                event.key.toLowerCase() === "z" &&
                event.shiftKey
            ) {
                event.preventDefault();
                redo();
                return;
            }

            // Redo: Ctrl + Y on Windows/Linux.
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
    }, [undo, redo]);

    // RENDER CANVAS

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) {
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

    // HANDLE CANVAS RESIZING

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) {
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

        resizeObserver.observe(container);

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

    // CURRENT SELECTION

    const selectedElement =
        selectedId === null
            ? null
            : elements.find(
                (element) =>
                    element.id === selectedId
            ) ?? null;

    // UPDATE SELECTED ELEMENT PROPERTIES

    const updateElementProperties =
        useCallback<ElementPropertyUpdater>(
            (
                id: number,
                patch: ElementStylePatch
            ) => {
                const beforeElements =
                    beginHistory();

                updateElement(
                    id,
                    (current) => ({
                        ...current,
                        ...patch,
                    }) as CanvasElement
                );

                commitHistory(beforeElements);
            },
            [
                beginHistory,
                updateElement,
                commitHistory,
            ]
        );

    // Notify page.tsx when selection changes.

    useEffect(() => {
        onSelectionChange?.(selectedElement);
    }, [
        selectedElement,
        onSelectionChange,
    ]);

    // Expose property updater to page.tsx.

    useEffect(() => {
        onPropertyUpdaterReady?.(
            updateElementProperties
        );
    }, [
        onPropertyUpdaterReady,
        updateElementProperties,
    ]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 select-none overflow-hidden"
            style={{
                cursor,
                touchAction: "none",
                overscrollBehavior: "none",
            }}
            onPointerDown={(event) => {
                // Ignore clicks on editor overlays, handles and toolbar controls.
                // Only a direct canvas click should finish an active editor.
                if (event.target !== canvasRef.current) {
                    return;
                }

                if (noteEditor) {
                    event.preventDefault();
                    event.stopPropagation();
                    commitNoteEditing();
                    return;
                }

                if (textEditor) {
                    event.preventDefault();
                    event.stopPropagation();
                    commitTextEditing();
                    return;
                }

                handlePointerDown(event);
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onContextMenu={(event) => {
                event.preventDefault();
            }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block h-full w-full"
            />

            {/* UNDO / REDO */}
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
                <button
                    type="button"
                    title="Undo"
                    aria-label="Undo"
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

                <button
                    type="button"
                    title="Redo"
                    aria-label="Redo"
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

            {/* SELECTION / RESIZE OVERLAY */}
            {selectedElement && (
                <SelectionOverlay
                    containerRef={containerRef}
                    element={selectedElement}
                    zoom={zoom}
                    pan={pan}
                    updateElement={updateElement}
                    beginHistory={beginHistory}
                    commitHistory={commitHistory}
                />
            )}

            {/* TEXT EDITOR */}
            {textEditor && (
                <TextEditorOverlay
                    x={textEditor.x}
                    y={textEditor.y}
                    text={textEditor.text}
                    fontSize={textEditor.fontSize}
                    zoom={zoom}
                    pan={pan}
                    dark={dark}
                    onChange={updateTextEditor}
                    onCommit={commitTextEditing}
                    onCancel={cancelTextEditing}
                />
            )}

            {/* NOTE EDITOR */}
            {noteEditor && (
                <NoteEditorOverlay
                    x={noteEditor.x}
                    y={noteEditor.y}
                    width={noteEditor.width}
                    height={noteEditor.height}
                    text={noteEditor.text}
                    zoom={zoom}
                    pan={pan}
                    dark={dark}
                    onChange={updateNoteEditor}
                    onCommit={commitNoteEditing}
                    onCancel={cancelNoteEditing}
                />
            )}
        </div>
    );
}