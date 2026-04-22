import { find } from 'lodash-es';

import type { Cell, Embed, Embeds, Row } from './interfaces';

export function addCell(row: Row, cell: Cell): Cell {
  if (!row.cells) row.cells = {};
  row.cells[cell.id] = cell;
  return cell;
}

export function removeCell(row: Row, predicate: object = {}): Cell | undefined {
  const cell = find(row.cells, predicate);
  if (!cell) return;
  delete row.cells[cell.id];
  return cell;
}

export function addEmbed(
  embeds: Embeds,
  cellId: string,
  tableId: string,
): Embed {
  const embed: Embed = {
    id: cellId,
    type: 'JODIT_HTML',
    embedded: true,
    data: { tableId, cellId },
  };
  embeds[cellId] = embed;
  return embed;
}

export function removeEmbed(
  embeds: Embeds,
  predicate: object = {},
): Embed | undefined {
  const embed = find(embeds, predicate);
  if (!embed) return;
  delete embeds[embed.id];
  return embed;
}
