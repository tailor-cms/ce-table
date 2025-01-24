import type { Cell, Embeds, Row } from '@tailor-cms/ce-table-manifest';
import find from 'lodash/find';

export function addCell(row: Row, cell: Cell) {
  if (!row.cells) row.cells = {};
  row.cells[cell.id] = cell;
  return cell;
}

export function removeCell(row: Row, predicate = {}) {
  const cell = find(row.cells, predicate);
  if (!cell) return;
  delete row.cells[cell.id];
  return cell;
}

export function addEmbed(embeds: Embeds, cellId: string, tableId: string) {
  const embed = {
    id: cellId,
    type: 'JODIT_HTML',
    embedded: true,
    data: { tableId, cellId },
  };
  embeds[cellId] = embed;
  return embed;
}

export function removeEmbed(embeds: Embeds, predicate = {}) {
  const embed = find(embeds, predicate);
  if (!embed) return;
  delete embeds[embed.id];
  return embed;
}
