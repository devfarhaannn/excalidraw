import type { CanvasElement } from "../../types/whiteboard";

type RenderCanvasOptions = {
    canvas: HTMLCanvasElement;
    container: HTMLDivElement;
    elements: CanvasElement[];
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

    /*
     * Set canvas resolution for Retina / high-DPI displays.
     */
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

    /*
     * Clear previous frame.
     */
    ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );

    /*
     * Draw canvas background.
     */
    ctx.fillStyle = background;

    ctx.fillRect(
        0,
        0,
        rect.width,
        rect.height
    );

    /*
     * Move into whiteboard world coordinates.
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
     * Draw all whiteboard elements.
     */
    for (const element of elements) {
        drawElement(
            ctx,
            element,
            dark
        );
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

    ctx.strokeStyle =
        strokeColor;

    ctx.fillStyle =
        strokeColor;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";


    if (
        element.type === "rectangle"
    ) {
        const x =
            Math.min(
                element.x1,
                element.x2
            );

        const y =
            Math.min(
                element.y1,
                element.y2
            );

        const width =
            Math.abs(
                element.x2 -
                    element.x1
            );

        const height =
            Math.abs(
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



    if (
        element.type === "diamond"
    ) {
        const left =
            Math.min(
                element.x1,
                element.x2
            );

        const right =
            Math.max(
                element.x1,
                element.x2
            );

        const top =
            Math.min(
                element.y1,
                element.y2
            );

        const bottom =
            Math.max(
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

    if (
        element.type === "text"
    ) {
        ctx.font =
            "18px Inter, Arial, sans-serif";

        ctx.textBaseline =
            "top";

        ctx.fillText(
            element.text,
            element.x,
            element.y
        );

        ctx.restore();

        return;
    }


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

        ctx.textBaseline =
            "top";

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

    /*
     * First wing
     */
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

    /*
     * Second wing
     */
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