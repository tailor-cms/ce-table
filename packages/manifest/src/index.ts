import type { AiConfig } from '@tailor-cms/cek-common';
import { times } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import { addCell, addEmbed } from './utils';
import type {
  DataInitializer,
  ElementData,
  ElementManifest,
  Embeds,
  Rows,
} from './interfaces';

// Element unique id within the target system (e.g. Tailor)
export const type = 'TABLE';

// Display name (e.g. shown to the author)
export const name = 'Table';

// Function which inits element state (data property on the Content Element
// entity)
export const initState: DataInitializer = (): ElementData => {
  const tableId = uuid();
  const embeds: Embeds = {};
  const rows: Rows = {};
  times(2, (position) => {
    const rowId = uuid();
    const row = { id: rowId, position, cells: {} };
    rows[rowId] = row;
    times(3, (position) => {
      const cellId = uuid();
      addCell(row, { id: cellId, position, data: {} });
      addEmbed(embeds, cellId, tableId);
    });
  });
  return { tableId, embeds, rows };
};

// Can be loaded from package.json
export const version = '1.0';

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-table',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

export const isEmpty = (data: ElementData): boolean =>
  !data?.rows || Object.keys(data.rows).length === 0;

export const ai: AiConfig = {
  Schema: {
    type: 'json_schema',
    name: 'ce_table',
    schema: {
      type: 'object',
      properties: {
        rows: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              cells: {
                type: 'array',
                minItems: 1,
                items: { type: 'string' },
              },
            },
            required: ['cells'],
            additionalProperties: false,
          },
        },
      },
      required: ['rows'],
      additionalProperties: false,
    },
  },
  getPrompt: () => `
    Generate a table content element as an object with the following
    properties:
    {
      "rows": [
        { "cells": ["", ""] }
      ]
    }
    where:
    - 'rows' is an array of row objects.
    - each row has a 'cells' array of plain text strings (one per cell).
      Every row must have the same number of cells.
  `,
  processResponse: (val: any) => {
    const tableId = uuid();
    const rows: Rows = {};
    const embeds: Embeds = {};
    val.rows.forEach((row: { cells: string[] }, rowPosition: number) => {
      const rowId = uuid();
      rows[rowId] = { id: rowId, position: rowPosition, cells: {} };
      row.cells.forEach((content: string, cellPosition: number) => {
        const cellId = uuid();
        addCell(rows[rowId], {
          id: cellId,
          position: cellPosition,
          data: {},
        });
        const embed = addEmbed(embeds, cellId, tableId);
        embed.data.content = content;
      });
    });
    return { tableId, rows, embeds };
  },
};

const manifest: ElementManifest = {
  type,
  version,
  name,
  ssr: false,
  isComposite: true,
  initState,
  isEmpty,
  ui,
  ai,
};

export default manifest;
export * from './interfaces';
export * as utils from './utils';
