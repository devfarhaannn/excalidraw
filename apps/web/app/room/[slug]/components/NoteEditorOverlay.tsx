"use client";

import {
    useEffect,
    useRef,
    type KeyboardEvent as ReactKeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from "react";

type Pan = {
    x: number;
    y: number;
};

type NoteEditorOverlayProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    zoom: number;
    pan: Pan;
    dark: boolean;
    onChange: (value: string) => void;
    onCommit: () => void;
    onCancel: () => void;
};

export default function NoteEditorOverlay({
    x,
    y,
    width,
    height,
    text,
    zoom,
    pan,
    dark,
    onChange,
    onCommit,
    onCancel,
}: NoteEditorOverlayProps) {
    const textareaRef =
        useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.focus();

        textarea.setSelectionRange(
            textarea.value.length,
            textarea.value.length
        );
    }, []);

    const scale = Math.max(zoom / 100, 0.01);

    const left =
        `calc(50% + ${pan.x + x * scale}px)`;

    const top =
        `calc(50% + ${pan.y + y * scale}px)`;

    function handleKeyDown(
        event: ReactKeyboardEvent<HTMLTextAreaElement>
    ) {
        event.stopPropagation();

        if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
            return;
        }

        // Enter creates a new line.
        // Cmd/Ctrl + Enter saves the note.
        if (
            event.key === "Enter" &&
            (event.metaKey || event.ctrlKey)
        ) {
            event.preventDefault();
            onCommit();
        }
    }

    function stopPointer(
        event: ReactPointerEvent<HTMLTextAreaElement>
    ) {
        event.stopPropagation();
    }

    return (
        <textarea
            ref={textareaRef}
            autoFocus
            value={text}
            spellCheck={false}
            aria-label="Edit note"
            placeholder="Write a note..."
            onChange={(event) =>
                onChange(event.currentTarget.value)
            }
            onKeyDown={handleKeyDown}
            onPointerDown={stopPointer}
            onPointerMove={stopPointer}
            onPointerUp={stopPointer}
            onClick={(event) =>
                event.stopPropagation()
            }
            className={[
                "absolute z-[60] resize-none",
                "m-0 border-0 bg-transparent outline-none",
                "ring-0",
            ].join(" ")}
            style={{
                left,
                top,
                width: `${Math.max(width, 80) * scale}px`,
                height: `${Math.max(height, 60) * scale}px`,
                boxSizing: "border-box",
                padding: `${12 * scale}px`,
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: `${14 * scale}px`,
                lineHeight: `${20 * scale}px`,
                color: "#403d2e",
                caretColor: "#625DF5",
                background: "transparent",
                border: "none",
                outline: "none",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                overflow: "auto",
                zIndex: 60,
            }}
        />
    );
}