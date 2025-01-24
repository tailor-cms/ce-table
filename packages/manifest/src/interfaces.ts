export enum Direction {
  Before = -1,
  After = 1,
}

export type Embed = any;
export type Embeds = Record<string, Embed>;

export interface Cell {
  id: string;
  position: number;
}
export type Cells = Record<string, Cell>;

export interface Row {
  id: string;
  position: number;
  cells: Cells;
}
export type Rows = Record<string, Row>;

export interface ElementData {
  tableId: string;
  embeds: Embeds;
  rows: Rows;
}

export interface Element {
  id: number;
  uid: string;
  activityId: number;
  repositoryId: number;
  contentId: string;
  contentSignature: string;
  type: string;
  position: number;
  data: ElementData;
  meta: { [key: string]: unknown };
  refs: { [key: string]: unknown };
  linked: boolean;
  detached: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type DataInitializer = () => ElementData;

export interface ElementManifest {
  type: string;
  version: string;
  name: string;
  ssr: boolean;
  isComposite?: boolean;
  initState: DataInitializer;
  Edit?: object;
  TopToolbar?: object;
  SideToolbar?: object;
  Display?: object;
  ui: {
    icon: string;
    forceFullWidth: boolean;
  };
  mocks?: {
    displayContexts: Array<{ name: string; data: any }>;
  };
}
