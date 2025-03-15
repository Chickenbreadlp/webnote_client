// Connection Status
export interface ConnectionStatusConfig {
    [key: string]: {
        color: string;
        title: string;
    }
}

// Checklist Types
export interface ChecklistEntry {
    id: number;
    text: string;
    crossed: boolean;
}

// Documents
interface CommonDocument {
    id: string;
    title: string;
}
export interface TextDocument extends CommonDocument {
    locked: boolean;
    text: string;
}
export interface ChecklistDocument extends CommonDocument {
    entries: ChecklistEntry[];
}

export type DocumentPage = TextDocument | ChecklistDocument;

// Changes
interface CommonChange {
    document: string;
    timestamp: string;
}
interface DeleteChange extends CommonChange {
    type: 'delete';
}
interface UpdateChange extends CommonChange {
    type: 'update';
    textChange?: string;
    entryChange?: {
        id: number;
        newCrossedState?: boolean;
        newText?: string;
    };
    entryAdd?: {
        id: number;
        crossedState: boolean;
        text: string;
        atTop: boolean;
    }
    entryReorder?: number[];
}
interface CreateChange extends CommonChange {
    type: 'create';
    title: string;
    content: string | ChecklistEntry[];
}

export type DocumentChange = DeleteChange | UpdateChange | CreateChange;
