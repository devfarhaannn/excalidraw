import type {
    CanvasElement,
    Point,
} from "../../types/whiteboard";

const HIT_TOLERANCE = 10;

function distanceToSegment(
    point: Point,
    a: Point,
    b: Point
) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    if (dx === 0 && dy === 0) {
        return Math.hypot(
            point.x - a.x,
            point.y - a.y
        );
    }

    const t =
        ((point.x - a.x) * dx +
            (point.y - a.y) * dy) /
        (dx * dx + dy * dy);

    const clamped = Math.max(
        0,
        Math.min(1, t)
    );

    const x = a.x + clamped * dx;
    const y = a.y + clamped * dy;

    return Math.hypot(
        point.x - x,
        point.y - y
    );
}

function isInsideBounds(
    point: Point,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
) {
    return (
        point.x >= minX - HIT_TOLERANCE &&
        point.x <= maxX + HIT_TOLERANCE &&
        point.y >= minY - HIT_TOLERANCE &&
        point.y <= maxY + HIT_TOLERANCE
    );
}

export function hitTest(
    point: Point,
    elements: CanvasElement[]
): CanvasElement | null {
    /*
     * Check from top to bottom so the most
     * recently created object is selected first.
     */
    for (
        let i = elements.length - 1;
        i >= 0;
        i--
    ) {
        const element = elements[i];

        if (!element) {
            continue;
        }

        /*
         * Line / Arrow
         */
        if (
            element.type === "line" ||
            element.type === "arrow"
        ) {
            const distance =
                distanceToSegment(
                    point,
                    {
                        x: element.x1,
                        y: element.y1,
                    },
                    {
                        x: element.x2,
                        y: element.y2,
                    }
                );

            if (
                distance <= HIT_TOLERANCE
            ) {
                return element;
            }

            continue;
        }

        /*
         * Freehand drawing
         */
        if (
            element.type === "draw"
        ) {
            for (
                let j = 1;
                j < element.points.length;
                j++
            ) {
                const previous =
                    element.points[j - 1];

                const current =
                    element.points[j];

                if (
                    !previous ||
                    !current
                ) {
                    continue;
                }

                const distance =
                    distanceToSegment(
                        point,
                        previous,
                        current
                    );

                if (
                    distance <=
                    HIT_TOLERANCE
                ) {
                    return element;
                }
            }

            continue;
        }

        /*
         * Rectangle / Diamond / Ellipse
         */
        if (
            element.type ===
                "rectangle" ||
            element.type ===
                "diamond" ||
            element.type ===
                "ellipse"
        ) {
            const minX = Math.min(
                element.x1,
                element.x2
            );

            const minY = Math.min(
                element.y1,
                element.y2
            );

            const maxX = Math.max(
                element.x1,
                element.x2
            );

            const maxY = Math.max(
                element.y1,
                element.y2
            );

            if (
                isInsideBounds(
                    point,
                    minX,
                    minY,
                    maxX,
                    maxY
                )
            ) {
                return element;
            }

            continue;
        }

        /*
         * Text
         */
        if (
            element.type === "text"
        ) {
            const width = Math.max(
                element.text.length * 10,
                20
            );

            if (
                isInsideBounds(
                    point,
                    element.x,
                    element.y,
                    element.x + width,
                    element.y + 24
                )
            ) {
                return element;
            }

            continue;
        }

        /*
         * Note
         */
        if (
            element.type === "note"
        ) {
            if (
                isInsideBounds(
                    point,
                    element.x,
                    element.y,
                    element.x +
                        element.width,
                    element.y +
                        element.height
                )
            ) {
                return element;
            }
        }
    }

    return null;
}