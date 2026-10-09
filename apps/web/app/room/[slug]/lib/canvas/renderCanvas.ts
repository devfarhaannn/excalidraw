import type {
    CanvasElement,
} from "../../types/whiteboard";

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

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

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

    // Canvas background.
    ctx.fillStyle = background;

    ctx.fillRect(
        0,
        0,
        rect.width,
        rect.height
    );

    // Transform into whiteboard world coordinates.
    ctx.save();

    ctx.translate(
        rect.width / 2 + pan.x,
        rect.height / 2 + pan.y
    );

    ctx.scale(
        zoom / 100,
        zoom / 100
    );

    const darkCanvas = isDarkCanvasBackground(
        background,
        dark
    );

    for (const element of elements) {
        drawElement(ctx, element, darkCanvas);
    }

    ctx.restore();
}

function isDarkCanvasBackground(
    background: string,
    fallback: boolean
): boolean {
    const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(
        background.trim()
    );

    const rawHex = match?.[1];

    if (!rawHex) {
        return fallback;
    }

    const hex =
        rawHex.length === 3
            ? rawHex
                .split("")
                .map((character) => character + character)
                .join("")
            : rawHex;

    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);

    const luminance =
        (0.2126 * red +
            0.7152 * green +
            0.0722 * blue) /
        255;

    return luminance < 0.5;
}

function drawElement(
    ctx: CanvasRenderingContext2D,
    element: CanvasElement,
    dark: boolean
) {
    const defaultStrokeColor = dark
        ? "#f4f4f5"
        : "#27272a";

    const strokeColor =
        element.strokeColor ?? defaultStrokeColor;

    ctx.save();

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;
    ctx.lineWidth = element.strokeWidth ?? 2;
    ctx.globalAlpha = element.opacity ?? 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // RECTANGLE
    if (element.type === "rectangle") {
        const x = Math.min(element.x1, element.x2);
        const y = Math.min(element.y1, element.y2);
        const width = Math.abs(element.x2 - element.x1);
        const height = Math.abs(element.y2 - element.y1);

        if (element.fillColor) {
            ctx.fillStyle = element.fillColor;
            ctx.fillRect(x, y, width, height);
        }

        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(x, y, width, height);

        ctx.restore();
        return;
    }

    // DIAMOND
    if (element.type === "diamond") {
        const left = Math.min(element.x1, element.x2);
        const right = Math.max(element.x1, element.x2);
        const top = Math.min(element.y1, element.y2);
        const bottom = Math.max(element.y1, element.y2);

        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        ctx.beginPath();
        ctx.moveTo(centerX, top);
        ctx.lineTo(right, centerY);
        ctx.lineTo(centerX, bottom);
        ctx.lineTo(left, centerY);
        ctx.closePath();

        if (element.fillColor) {
            ctx.fillStyle = element.fillColor;
            ctx.fill();
        }

        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        ctx.restore();
        return;
    }

    // ELLIPSE
    if (element.type === "ellipse") {
        const centerX = (element.x1 + element.x2) / 2;
        const centerY = (element.y1 + element.y2) / 2;
        const radiusX = Math.abs(element.x2 - element.x1) / 2;
        const radiusY = Math.abs(element.y2 - element.y1) / 2;

        ctx.beginPath();

        ctx.ellipse(
            centerX,
            centerY,
            Math.max(radiusX, 1),
            Math.max(radiusY, 1),
            0,
            0,
            Math.PI * 2
        );

        if (element.fillColor) {
            ctx.fillStyle = element.fillColor;
            ctx.fill();
        }

        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        ctx.restore();
        return;
    }

    // LINE
    if (element.type === "line") {
        ctx.beginPath();
        ctx.moveTo(element.x1, element.y1);
        ctx.lineTo(element.x2, element.y2);
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        ctx.restore();
        return;
    }

    // ARROW
    if (element.type === "arrow") {
        ctx.beginPath();
        ctx.moveTo(element.x1, element.y1);
        ctx.lineTo(element.x2, element.y2);
        ctx.strokeStyle = strokeColor;
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

    // FREEHAND DRAWING
    if (element.type === "draw") {
        const firstPoint = element.points[0];

        if (!firstPoint) {
            ctx.restore();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);

        for (let i = 1; i < element.points.length; i++) {
            const point = element.points[i];

            if (!point) {
                continue;
            }

            ctx.lineTo(point.x, point.y);
        }

        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        ctx.restore();
        return;
    }

    // TEXT
    if (element.type === "text") {
        const fontSize = element.fontSize ?? 20;

        ctx.font =
            `${fontSize}px Inter, Arial, sans-serif`;

        ctx.textBaseline = "top";
        ctx.fillStyle = element.textColor ?? strokeColor;

        ctx.fillText(
            element.text,
            element.x,
            element.y
        );

        ctx.restore();
        return;
    }

    // NOTE
    if (element.type === "note") {
        ctx.fillStyle =
            element.fillColor ?? "#fff3a8";

        ctx.fillRect(
            element.x,
            element.y,
            element.width,
            element.height
        );

        ctx.strokeStyle =
            element.strokeColor ?? "#d8c95f";

        ctx.strokeRect(
            element.x,
            element.y,
            element.width,
            element.height
        );

        ctx.fillStyle =
            element.textColor ?? "#403d2e";

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
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const size = 10;

    ctx.beginPath();

    ctx.moveTo(x2, y2);

    ctx.lineTo(
        x2 - size * Math.cos(angle - Math.PI / 6),
        y2 - size * Math.sin(angle - Math.PI / 6)
    );

    ctx.moveTo(x2, y2);

    ctx.lineTo(
        x2 - size * Math.cos(angle + Math.PI / 6),
        y2 - size * Math.sin(angle + Math.PI / 6)
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
    const words = text.split(/\s+/);

    let line = "";
    let lineY = y;

    const lineHeight = 20;

    for (const word of words) {
        const testLine = line
            ? `${line} ${word}`
            : word;

        const width =
            ctx.measureText(testLine).width;

        if (width > maxWidth && line) {
            ctx.fillText(line, x, lineY);

            line = word;
            lineY += lineHeight;
        } else {
            line = testLine;
        }
    }

    if (line) {
        ctx.fillText(line, x, lineY);
    }
}