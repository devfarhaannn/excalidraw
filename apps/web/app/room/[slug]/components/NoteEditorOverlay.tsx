"use client";

import {
    useEffect,
    useRef,
    type KeyboardEvent as ReactKeyboardEvent,
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

    onChange: (
        value: string
    ) => void;

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
        useRef<HTMLTextAreaElement | null>(
            null
        );

    useEffect(() => {
        const textarea =
            textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.focus();

        textarea.setSelectionRange(
            textarea.value.length,
            textarea.value.length
        );
    }, []);

    function handleKeyDown(
        event: ReactKeyboardEvent<HTMLTextAreaElement>
    ) {
        /*
         * Escape = cancel
         */
        if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
            return;
        }

        /*
         * Cmd + Enter = save on Mac
         * Ctrl + Enter = save on Windows/Linux
         */
        if (
            event.key === "Enter" &&
            (event.metaKey || event.ctrlKey)
        ) {
            event.preventDefault();
            onCommit();
        }
    }

    const scale =
        zoom / 100;

    const left =
        `calc(50% + ${
            pan.x + x * scale
        }px)`;

    const top =
        `calc(50% + ${
            pan.y + y * scale
        }px)`;

    return (
        <textarea
            ref={textareaRef}
            value={text}
            onChange={(event) =>
                onChange(
                    event.target.value
                )
            }
            onKeyDown={
                handleKeyDown
            }
            onPointerDown={(event) =>
                event.stopPropagation()
            }
            onPointerMove={(event) =>
                event.stopPropagation()
            }
            onPointerUp={(event) =>
                event.stopPropagation()
            }
            placeholder="Write a note..."
            className={[
                "absolute z-50 resize-none rounded-xl border px-4 py-3 text-sm leading-6 outline-none",
                "shadow-[0_12px_35px_rgba(20,20,30,.16)]",
                dark
                    ? "border-[#625DF5] bg-[#2d2b21] text-white placeholder:text-white/30"
                    : "border-[#d9c86a] bg-[#fff7bf] text-[#27272a] placeholder:text-black/35",
            ].join(" ")}
            style={{
                left,
                top,
                width:
                    width * scale,
                height:
                    height * scale,
                fontFamily:
                    "Inter, Arial, sans-serif",
            }}
        />
    );
}