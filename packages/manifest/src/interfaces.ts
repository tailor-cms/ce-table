import type * as common from '@tailor-cms/cek-common';

export enum Direction {
  Before = -1,
  After = 1,
}

export type Embed = any;
export type Embeds = Record<string, Embed>;

export interface Cell {
  id: string;
  data: Record<string, any>;
  position: number;
}
export type Cells = Record<string, Cell>;

export interface Row {
  id: string;
  position: number;
  cells: Cells;
}
export type Rows = Record<string, Row>;
export interface ElementData extends common.ElementConfig {
  tableId: string;
  embeds: Embeds;
  rows: Rows;
}

export type DataInitializer = common.DataInitializer<ElementData>;
export type Element = common.Element<ElementData>;
export type ElementManifest = common.ElementManifest<ElementData>;
