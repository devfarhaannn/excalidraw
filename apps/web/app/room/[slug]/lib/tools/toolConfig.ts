import {
    ArrowUpRight,
    Circle,
    Eraser,
    Hand,
    Lock,
    MousePointer2,
    Pencil,
    Shapes,
    Square,
    Type,
    FileImage,
    Link2,
    type LucideIcon,
} from "lucide-react";

import type { ToolId } from "../../types/whiteboard";

export type Tool = {
    id: ToolId;
    label: string;
    shortcut?: string;
    icon: LucideIcon;
};

export const TOOLS: Tool[] = [
    {
        id: "lock",
        label: "Lock",
        icon: Lock,
    },
    {
        id: "hand",
        label: "Hand",
        icon: Hand,
    },
    {
        id: "select",
        label: "Select",
        shortcut: "V",
        icon: MousePointer2,
    },
    {
        id: "rectangle",
        label: "Rectangle",
        shortcut: "R",
        icon: Square,
    },
    {
        id: "diamond",
        label: "Diamond",
        shortcut: "D",
        icon: Shapes,
    },
    {
        id: "ellipse",
        label: "Ellipse",
        shortcut: "O",
        icon: Circle,
    },
    {
        id: "arrow",
        label: "Arrow",
        shortcut: "A",
        icon: ArrowUpRight,
    },
    {
        id: "line",
        label: "Line",
        shortcut: "L",
        icon: Link2,
    },
    {
        id: "draw",
        label: "Draw",
        shortcut: "P",
        icon: Pencil,
    },
    {
        id: "text",
        label: "Text",
        shortcut: "T",
        icon: Type,
    },
    {
        id: "note",
        label: "Note",
        shortcut: "N",
        icon: FileImage,
    },
    {
        id: "eraser",
        label: "Eraser",
        shortcut: "E",
        icon: Eraser,
    },
];