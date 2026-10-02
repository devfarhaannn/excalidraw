"use client";

import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
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
    const inputRef =
        useRef<HTMLInputElement | null>(null);

    const [width, setWidth] =
        useState(80);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    useEffect(() => {
        const nextWidth =
            Math.max(
                80,
                text.length *
                    fontSize *
                    0.58 +
                    24
            );

        setWidth(nextWidth);
    }, [text, fontSize]);

    const scale = zoom / 100;

    const left =
        `calc(50% + ${pan.x + x * scale}px)`;

    const top =
        `calc(50% + ${pan.y + y * scale}px)`;

    function handleKeyDown(
        event: ReactKeyboardEvent<HTMLInputElement>
    ) {
        if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            onCommit();
        }
    }

    return (
        <input
            ref={inputRef}
            value={text}
            onChange={(event) =>
                onChange(event.target.value)
            }
            onKeyDown={handleKeyDown}
            onPointerDown={(event) => {
                event.stopPropagation();
            }}
            className={[
                "absolute z-50 rounded-md border px-1 py-0.5 outline-none",
                dark
                    ? "border-[#625DF5] bg-[#18181b] text-white"
                    : "border-[#625DF5] bg-white text-[#27272a]",
            ].join(" ")}
            style={{
                left,
                top,
                width,
                minWidth: 80,
                height:
                    fontSize * scale + 10,
                fontSize:
                    fontSize * scale,
                lineHeight: 1.2,
                fontFamily:
                    "Inter, Arial, sans-serif",
            }}
            placeholder="Type something..."
        />
    );
}