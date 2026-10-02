import type { CanvasElement } from "../../types/whiteboard";

type RenderCanvasOptions = {
    canvas: HTMLCanvasElement;
    container: HTMLDivElement;
    elements: CanvasElement[];
    selectedId: number | null;
    pan: {
        x: number;
        y: number;
    };
    zoom: number;
    background: string;
    dark: boolean;
};

export function renderCanvas({
    canvas,
    container,
    elements,
    selectedId,
    pan,
    zoom,
    background,
    dark,
}: RenderCanvasOptions) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    const rect =
        container.getBoundingClientRect();

    const dpr =
        window.devicePixelRatio || 1;

    canvas.width =
        Math.round(rect.width * dpr);

    canvas.height =
        Math.round(rect.height * dpr);

    canvas.style.width =
        `${rect.width}px`;

    canvas.style.height =
        `${rect.height}px`;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );

    /*
     * Canvas background
     */
    ctx.fillStyle = background;

    ctx.fillRect(
        0,
        0,
        rect.width,
        rect.height
    );

    /*
     * Move into world coordinates.
     */
    ctx.save();

    ctx.translate(
        rect.width / 2 + pan.x,
        rect.height / 2 + pan.y
    );

    ctx.scale(
        zoom / 100,
        zoom / 100
    );

    /*
     * Draw every element.
     */
    for (const element of elements) {
        drawElement(
            ctx,
            element,
            dark
        );
    }

    /*
     * Draw selection box.
     */
    if (selectedId !== null) {
        const selectedElement =
            elements.find(
                (element) =>
                    element.id ===
                    selectedId
            );

        if (selectedElement) {
            drawSelection(
                ctx,
                selectedElement
            );
        }
    }

    ctx.restore();
}



function drawElement(
    ctx: CanvasRenderingContext2D,
    element: CanvasElement,
    dark: boolean
) {
    const strokeColor = dark
        ? "#f4f4f5"
        : "#27272a";

    ctx.save();

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    /*
     * RECTANGLE
     */
    if (
        element.type === "rectangle"
    ) {
        const x = Math.min(
            element.x1,
            element.x2
        );

        const y = Math.min(
            element.y1,
            element.y2
        );

        const width = Math.abs(
            element.x2 -
                element.x1
        );

        const height = Math.abs(
            element.y2 -
                element.y1
        );

        ctx.strokeRect(
            x,
            y,
            width,
            height
        );

        ctx.restore();

        return;
    }

    /*
     * DIAMOND
     */
    if (
        element.type === "diamond"
    ) {
        const left = Math.min(
            element.x1,
            element.x2
        );

        const right = Math.max(
            element.x1,
            element.x2
        );

        const top = Math.min(
            element.y1,
            element.y2
        );

        const bottom = Math.max(
            element.y1,
            element.y2
        );

        const centerX =
            (left + right) / 2;

        const centerY =
            (top + bottom) / 2;

        ctx.beginPath();

        ctx.moveTo(
            centerX,
            top
        );

        ctx.lineTo(
            right,
            centerY
        );

        ctx.lineTo(
            centerX,
            bottom
        );

        ctx.lineTo(
            left,
            centerY
        );

        ctx.closePath();

        ctx.stroke();

        ctx.restore();

        return;
    }

    /*
     * ELLIPSE
     */
    if (
        element.type === "ellipse"
    ) {
        const centerX =
            (element.x1 +
                element.x2) /
            2;

        const centerY =
            (element.y1 +
                element.y2) /
            2;

        const radiusX =
            Math.abs(
                element.x2 -
                    element.x1
            ) / 2;

        const radiusY =
            Math.abs(
                element.y2 -
                    element.y1
            ) / 2;

        ctx.beginPath();

        ctx.ellipse(
            centerX,
            centerY,
            Math.max(
                radiusX,
                1
            ),
            Math.max(
                radiusY,
                1
            ),
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();

        return;
    }

    /*
     * LINE
     */
    if (
        element.type === "line"
    ) {
        ctx.beginPath();

        ctx.moveTo(
            element.x1,
            element.y1
        );

        ctx.lineTo(
            element.x2,
            element.y2
        );

        ctx.stroke();

        ctx.restore();

        return;
    }

    /*
     * ARROW
     */
    if (
        element.type === "arrow"
    ) {
        ctx.beginPath();

        ctx.moveTo(
            element.x1,
            element.y1
        );

        ctx.lineTo(
            element.x2,
            element.y2
        );

        ctx.stroke();

        drawArrowHead(
            ctx,
            element.x1,
            element.y1,
            element.x2,
            element.y2
        );

        ctx.restore();

        return;
    }

    /*
     * FREEHAND DRAW
     */
    if (
        element.type === "draw"
    ) {
        const firstPoint =
            element.points[0];

        if (!firstPoint) {
            ctx.restore();
            return;
        }

        ctx.beginPath();

        ctx.moveTo(
            firstPoint.x,
            firstPoint.y
        );

        for (
            let i = 1;
            i < element.points.length;
            i++
        ) {
            const point =
                element.points[i];

            if (!point) {
                continue;
            }

            ctx.lineTo(
                point.x,
                point.y
            );
        }

        ctx.stroke();

        ctx.restore();

        return;
    }

    /*
     * TEXT
     */
    if (
        element.type === "text"
    ) {
        ctx.font =
            "18px Inter, Arial, sans-serif";

        ctx.textBaseline = "top";

        ctx.fillText(
            element.text,
            element.x,
            element.y
        );

        ctx.restore();

        return;
    }

    /*
     * NOTE
     */
    if (
        element.type === "note"
    ) {
        ctx.fillStyle =
            "#fff3a8";

        ctx.strokeStyle =
            "#d8c95f";

        ctx.fillRect(
            element.x,
            element.y,
            element.width,
            element.height
        );

        ctx.strokeRect(
            element.x,
            element.y,
            element.width,
            element.height
        );

        ctx.fillStyle =
            "#403d2e";

        ctx.font =
            "14px Inter, Arial, sans-serif";

        ctx.textBaseline = "top";

        drawWrappedText(
            ctx,
            element.text,
            element.x + 12,
            element.y + 12,
            element.width - 24
        );

        ctx.restore();

        return;
    }

    ctx.restore();
}



function drawArrowHead(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
    const angle =
        Math.atan2(
            y2 - y1,
            x2 - x1
        );

    const size = 10;

    ctx.beginPath();

    ctx.moveTo(
        x2,
        y2
    );

    ctx.lineTo(
        x2 -
            size *
                Math.cos(
                    angle -
                        Math.PI / 6
                ),
        y2 -
            size *
                Math.sin(
                    angle -
                        Math.PI / 6
                )
    );

    ctx.moveTo(
        x2,
        y2
    );

    ctx.lineTo(
        x2 -
            size *
                Math.cos(
                    angle +
                        Math.PI / 6
                ),
        y2 -
            size *
                Math.sin(
                    angle +
                        Math.PI / 6
                )
    );

    ctx.stroke();
}



function drawWrappedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number
) {
    const words =
        text.split(" ");

    let line = "";
    let lineY = y;

    const lineHeight = 20;

    for (const word of words) {
        const testLine = line
            ? `${line} ${word}`
            : word;

        const width =
            ctx.measureText(
                testLine
            ).width;

        if (
            width > maxWidth &&
            line
        ) {
            ctx.fillText(
                line,
                x,
                lineY
            );

            line = word;
            lineY += lineHeight;
        } else {
            line = testLine;
        }
    }

    if (line) {
        ctx.fillText(
            line,
            x,
            lineY
        );
    }
}


function getBounds(
    element: CanvasElement
) {
    switch (element.type) {
        case "rectangle":
        case "diamond":
        case "ellipse":
        case "line":
        case "arrow":
            return {
                minX: Math.min(
                    element.x1,
                    element.x2
                ),
                minY: Math.min(
                    element.y1,
                    element.y2
                ),
                maxX: Math.max(
                    element.x1,
                    element.x2
                ),
                maxY: Math.max(
                    element.y1,
                    element.y2
                ),
            };

        case "draw": {
            const firstPoint =
                element.points[0];

            if (!firstPoint) {
                return {
                    minX: 0,
                    minY: 0,
                    maxX: 0,
                    maxY: 0,
                };
            }

            let minX = firstPoint.x;
            let minY = firstPoint.y;
            let maxX = firstPoint.x;
            let maxY = firstPoint.y;

            for (
                let i = 1;
                i < element.points.length;
                i++
            ) {
                const point =
                    element.points[i];

                if (!point) {
                    continue;
                }

                minX = Math.min(
                    minX,
                    point.x
                );

                minY = Math.min(
                    minY,
                    point.y
                );

                maxX = Math.max(
                    maxX,
                    point.x
                );

                maxY = Math.max(
                    maxY,
                    point.y
                );
            }

            return {
                minX,
                minY,
                maxX,
                maxY,
            };
        }

        case "text":
            return {
                minX: element.x,
                minY: element.y,
                maxX:
                    element.x +
                    Math.max(
                        element.text.length *
                            10,
                        20
                    ),
                maxY:
                    element.y + 24,
            };

        case "note":
            return {
                minX: element.x,
                minY: element.y,
                maxX:
                    element.x +
                    element.width,
                maxY:
                    element.y +
                    element.height,
            };
    }
}


function drawSelection(
    ctx: CanvasRenderingContext2D,
    element: CanvasElement
) {
    const bounds =
        getBounds(element);

    const padding = 6;

    ctx.save();

    ctx.strokeStyle =
        "#625DF5";

    ctx.lineWidth = 1;

    ctx.setLineDash([
        5,
        4,
    ]);

    ctx.strokeRect(
        bounds.minX - padding,
        bounds.minY - padding,
        bounds.maxX -
            bounds.minX +
            padding * 2,
        bounds.maxY -
            bounds.minY +
            padding * 2
    );

    ctx.setLineDash([]);

    ctx.fillStyle =
        "#625DF5";

    const handleSize = 6;

    const handles = [
        {
            x:
                bounds.minX -
                padding,
            y:
                bounds.minY -
                padding,
        },
        {
            x:
                bounds.maxX +
                padding,
            y:
                bounds.minY -
                padding,
        },
        {
            x:
                bounds.minX -
                padding,
            y:
                bounds.maxY +
                padding,
        },
        {
            x:
                bounds.maxX +
                padding,
            y:
                bounds.maxY +
                padding,
        },
    ];

    for (const handle of handles) {
        ctx.beginPath();

        ctx.arc(
            handle.x,
            handle.y,
            handleSize / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.restore();
}