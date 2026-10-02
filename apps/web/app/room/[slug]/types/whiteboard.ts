export type ToolId =
    | "lock"
    | "hand"
    | "select"
    | "rectangle"
    | "diamond"
    | "ellipse"
    | "arrow"
    | "line"
    | "draw"
    | "text"
    | "note"
    | "eraser";

export type Point = {
    x: number;
    y: number;
};

export type BaseElement = {
    id: number;
};

export type ShapeElement = BaseElement & {
    type:
        | "rectangle"
        | "diamond"
        | "ellipse"
        | "line"
        | "arrow";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type DrawElement = BaseElement & {
    type: "draw";
    points: Point[];
};

export type TextElement = BaseElement & {
    type: "text";
    x: number;
    y: number;
    text: string;
};

export type NoteElement = BaseElement & {
    type: "note";
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
};

export type CanvasElement =
    | ShapeElement
    | DrawElement
    | TextElement
    | NoteElement;

export type ThemeMode =
    | "light"
    | "dark"
    | "system";