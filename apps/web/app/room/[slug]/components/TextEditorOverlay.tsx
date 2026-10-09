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

type TextEditorOverlayProps = {
    x: number;
    y: number;
    text: string;
    fontSize: number;
    zoom: number;
    pan: Pan;
    dark: boolean;
    onChange: (value: string) => void;
    onCommit: () => void;
    onCancel: () => void;
};

export default function TextEditorOverlay({
    x,
    y,
    text,
    fontSize,
    zoom,
    pan,
    dark,
    onChange,
    onCommit,
    onCancel,
}: TextEditorOverlayProps) {
    const textareaRef =
        useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.focus();

        // Place the caret at the end of existing text.
        textarea.setSelectionRange(
            textarea.value.length,
            textarea.value.length
        );
    }, []);

    const scale = Math.max(zoom / 100, 0.01);

    const lines = text.split("\n");

    const longestLine = Math.max(
        1,
        ...lines.map((line) => line.length)
    );

    const editorWidth = Math.max(
        120,
        Math.min(
            560,
            longestLine * fontSize * 0.58 + 12
        )
    );

    const editorHeight = Math.max(
        fontSize * 1.5,
        lines.length * fontSize * 1.35
    );

    const left =
        `calc(50% + ${pan.x + x * scale}px)`;

    const top =
        `calc(50% + ${pan.y + y * scale}px)`;

    function handleKeyDown(
        event: ReactKeyboardEvent<HTMLTextAreaElement>
    ) {
        // Don't let the canvas keyboard shortcuts run
        // while the user is typing.
        event.stopPropagation();

        if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
            return;
        }

        // Enter creates a new line.
        // Cmd/Ctrl + Enter commits the text.
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
            rows={1}
            value={text}
            spellCheck={false}
            aria-label="Edit canvas text"
            placeholder="Type something..."
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
                "absolute z-[60] resize-none overflow-hidden",
                "m-0 rounded-none border-0 bg-transparent p-0",
                "outline-none ring-0",
                dark
                    ? "text-[#f4f4f5] placeholder:text-white/30"
                    : "text-[#27272a] placeholder:text-black/30",
            ].join(" ")}
            style={{
                left,
                top,
                width: `${editorWidth * scale}px`,
                minWidth: `${100 * scale}px`,
                height: `${editorHeight * scale}px`,
                fontSize: `${fontSize * scale}px`,
                lineHeight: `${fontSize * 1.35 * scale}px`,
                fontFamily: "Inter, Arial, sans-serif",
                color: dark ? "#f4f4f5" : "#27272a",
                caretColor: "#625DF5",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                zIndex: 60,
            }}
        />
    );
}