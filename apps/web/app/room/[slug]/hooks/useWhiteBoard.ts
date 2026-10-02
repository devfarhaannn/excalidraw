"use client";

import { useCallback, useRef, useState } from "react";

import type { CanvasElement } from "../types/whiteboard";

import { useWhiteboardHistory } from "./useWhiteboardHistory";

export function useWhiteboard() {
    const [elements, setElements] =
        useState<CanvasElement[]>([]);

    const [selectedId, setSelectedId] =
        useState<number | null>(null);

    const elementsRef =
        useRef<CanvasElement[]>([]);

    const {
        record,
        undo: undoHistory,
        redo: redoHistory,
        clearHistory,
        canUndo,
        canRedo,
    } = useWhiteboardHistory<CanvasElement>(100);

    function setCurrentElements(
        nextElements: CanvasElement[]
    ) {
        elementsRef.current = nextElements;
        setElements(nextElements);
    }

    function addElement(
        element: CanvasElement
    ) {
        const current =
            elementsRef.current;

        record(current);

        setCurrentElements([
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
        const current =
            elementsRef.current;

        const next = current.map(
            (element) =>
                element.id === id
                    ? update(element)
                    : element
        );

        setCurrentElements(next);
    }

    function deleteElement(
        id: number
    ) {
        const current =
            elementsRef.current;

        const next = current.filter(
            (element) =>
                element.id !== id
        );

        if (
            next.length ===
            current.length
        ) {
            return;
        }

        record(current);

        setCurrentElements(next);

        setSelectedId(
            (currentSelectedId) =>
                currentSelectedId === id
                    ? null
                    : currentSelectedId
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
        const current =
            elementsRef.current;

        if (!current.length) {
            return;
        }

        record(current);

        setCurrentElements([]);

        setSelectedId(null);
    }

    const beginHistory = useCallback(() => {
        return elementsRef.current;
    }, []);

    const commitHistory = useCallback(
        (beforeElements: CanvasElement[]) => {
            const current =
                elementsRef.current;

            if (
                JSON.stringify(
                    beforeElements
                ) ===
                JSON.stringify(current)
            ) {
                return;
            }

            record(beforeElements);
        },
        [record]
    );

    function undo() {
        const previous =
            undoHistory(
                elementsRef.current
            );

        if (!previous) {
            return false;
        }

        setCurrentElements(previous);
        setSelectedId(null);

        return true;
    }

    function redo() {
        const next =
            redoHistory(
                elementsRef.current
            );

        if (!next) {
            return false;
        }

        setCurrentElements(next);
        setSelectedId(null);

        return true;
    }

    function replaceElements(
        nextElements: CanvasElement[]
    ) {
        setCurrentElements(nextElements);
        setSelectedId(null);
        clearHistory();
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

        beginHistory,
        commitHistory,

        undo,
        redo,

        canUndo,
        canRedo,

        replaceElements,
    };
}