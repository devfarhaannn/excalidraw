"use client";

import {
    useCallback,
    useRef,
    useState,
} from "react";

export function useWhiteboardHistory<T>(
    limit = 100
) {
    const pastRef = useRef<T[][]>([]);
    const futureRef = useRef<T[][]>([]);

    // Forces the component using this hook to re-render
    // when undo/redo availability changes.
    const [, setVersion] = useState(0);

    const refresh = useCallback(() => {
        setVersion((value) => value + 1);
    }, []);

    const record = useCallback(
        (snapshot: T[]) => {
            pastRef.current = [
                ...pastRef.current,
                snapshot,
            ].slice(-limit);

            // Any new edit invalidates the redo stack.
            futureRef.current = [];

            refresh();
        },
        [limit, refresh]
    );

    const undo = useCallback(
        (current: T[]) => {
            const previous =
                pastRef.current.pop();

            if (!previous) {
                return null;
            }

            futureRef.current.unshift(current);

            refresh();

            return previous;
        },
        [refresh]
    );

    const redo = useCallback(
        (current: T[]) => {
            const next =
                futureRef.current.shift();

            if (!next) {
                return null;
            }

            pastRef.current.push(current);

            refresh();

            return next;
        },
        [refresh]
    );

    const clearHistory = useCallback(() => {
        pastRef.current = [];
        futureRef.current = [];

        refresh();
    }, [refresh]);

    return {
        record,
        undo,
        redo,
        clearHistory,

        canUndo:
            pastRef.current.length > 0,

        canRedo:
            futureRef.current.length > 0,
    };
}