"use client";

import { useState } from "react";

import type {
    CanvasElement,
} from "../types/whiteboard";

export function useWhiteboard() {
    const [
        elements,
        setElements,
    ] = useState<CanvasElement[]>([]);

    const [
        selectedId,
        setSelectedId,
    ] = useState<number | null>(null);

    function addElement(
    element: CanvasElement
) {
    setElements((current) => [
        ...current,
        element,
    ]);

    setSelectedId(element.id);
}

function updateElement(
    id: number,
    update: (
        element: CanvasElement
    ) => CanvasElement
) {
    setElements((current) =>
        current.map((element) =>
            element.id === id
                ? update(element)
                : element
        )
    );
}

    function deleteElement(
        id: number
    ) {
        setElements((current) =>
            current.filter(
                (element) =>
                    element.id !== id
            )
        );

        setSelectedId((current) =>
            current === id
                ? null
                : current
        );
    }

    function selectElement(
        id: number | null
    ) {
        setSelectedId(id);
    }

    function clearSelection() {
        setSelectedId(null);
    }

    function clearBoard() {
        setElements([]);
        setSelectedId(null);
    }

    return {
        elements,
        selectedId,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        clearSelection,
        clearBoard,
    };
}