<template>
  <VCard class="tce-table my-2" color="grey-lighten-5">
    <VToolbar class="px-4" color="primary-darken-2" height="36">
      <VIcon
        :icon="manifest.ui.icon"
        color="secondary-lighten-2"
        size="18"
        start
      />
      <span class="text-subtitle-2">{{ manifest.name }}</span>
    </VToolbar>
    <div class="body">
      <div :class="{ disabled: isDisabled }" class="table ma-4">
        <div v-for="row in table" :key="row.id" class="table-row">
          <div v-for="cell in cells(row)" :key="cell.id" class="table-cell">
            <TailorEmbeddedContainer
              :allowed-element-config="embedElementConfig"
              :container="{ embeds: { [cell.id]: cell } }"
              :enable-add="false"
              :is-disabled="isDisabled"
              @save="saveCell($event.embeds[cell.id])"
            />
          </div>
        </div>
      </div>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { computed, inject, reactive } from 'vue';
import manifest, {
  Cell,
  Cells,
  Direction,
  Element,
  ElementData,
  Row,
  Rows,
} from '@tailor-cms/ce-table-manifest';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import first from 'lodash/first';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';
import { v4 as uuid } from 'uuid';

import { addCell, addEmbed, removeCell, removeEmbed } from './utils';

const MIN_ROWS = 1;
const MIN_COLUMNS = 1;

const between = (pos1: number, pos2: number) => (pos2 + pos1) / 2;
const limit = (anchor: any, direction: number) => anchor.position + direction;

function sibling(arr: Cell[] | Row[], item: Cell | Row, direction: Direction) {
  if (direction === Direction.Before) {
    return last(arr.filter((it) => it.position < item.position));
  }
  return first(arr.filter((it) => it.position > item.position));
}

function calculateInsertPosition(
  collection: Cells | Rows,
  anchor: Cell | Row,
  direction: Direction,
) {
  const sorted = sortBy(collection, 'position') as Cell[] | Row[];
  const adjacent = sibling(sorted, anchor, direction);
  return between(
    anchor.position,
    (adjacent && adjacent.position) || limit(anchor, direction),
  );
}

function getFocusedItem(collection: Cells | Rows, current: Cell | Row) {
  const sorted = sortBy(collection, 'position') as Cell[] | Row[];
  return (
    sibling(sorted, current, Direction.Before) ||
    sibling(sorted, current, Direction.After)
  );
}

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isFocused: boolean;
  isDisabled: boolean;
}>();
const emit = defineEmits(['focus', 'save']);

const bus: any = inject('$elementBus');

const elementData = reactive<ElementData>(cloneDeep(props.element.data));
const table = computed(() => sortBy(props.element.data.rows, 'position'));
const rows = computed(() => props.element.data.rows);
// const embeds = computed(() => props.element.data.embeds);

const cells = (row: any) => sortBy(row.cells, 'position');

const findRow = (cellId: string) => {
  return find(rows.value, (row) => !!row.cells[cellId]);
};

const focusElement = (cell: any) => {
  emit('focus', {}, { ...cell, type: 'HTML' }, props.element);
};

const addRow = (cellId: string, direction = Direction.After) => {
  const row = findRow(cellId);
  if (!row) return;

  const element = cloneDeep(props.element);
  const { tableId, rows, embeds } = element.data;
  const position = calculateInsertPosition(rows, row, direction);
  const newRow = { id: uuid(), position, cells: {} };
  forEach(row.cells, ({ position }) => {
    const cellId = uuid();
    addCell(newRow, { id: cellId, position, data: {} });
    addEmbed(embeds, cellId, tableId);
  });
  rows[newRow.id] = newRow;
  emit('save', element.data);
};

const addColumn = (cellId: string, direction = Direction.After) => {
  const row = findRow(cellId);
  if (!row) return;
  const cell = row.cells[cellId];
  if (!cell) return;

  const element = cloneDeep(props.element);
  const { tableId, rows, embeds } = element.data;
  const position = calculateInsertPosition(row.cells, cell, direction);
  forEach(rows, (row) => {
    const cellId = uuid();
    addCell(row, { id: cellId, position, data: {} });
    addEmbed(embeds, cellId, tableId);
  });

  emit('save', element.data);
};

const removeRow = (cellId: string) => {
  const row = findRow(cellId);
  if (!row || size(props.element.data.rows) <= MIN_ROWS) return;

  const element = cloneDeep(props.element);
  const { rows, embeds } = element.data;
  forEach(row.cells, (cell) => removeEmbed(embeds, { id: cell.id }));
  delete rows[row.id];

  const focusedRow = getFocusedItem(rows, row);
  if (focusedRow) {
    const cell = first(cells(focusedRow));
    if (cell) focusElement(embeds[cell.id]);
  }

  emit('save', { embeds, rows });
};

const removeColumn = (cellId: string) => {
  const row = findRow(cellId);
  if (!row || size(row.cells) <= MIN_COLUMNS) return;
  const cell = row.cells[cellId];
  if (!cell) return;

  const element = cloneDeep(props.element);
  const { rows, embeds } = element.data;

  forEach(rows, (row) => {
    const deletedCell = removeCell(row, { position: cell.position });
    if (deletedCell) removeEmbed(embeds, { id: deletedCell.id });
  });

  const focusedCell = getFocusedItem(row.cells, cell);
  if (focusedCell) focusElement(embeds[focusedCell.id]);

  emit('save', { embeds, rows });
};

const saveCell = (element: any) => {
  elementData.embeds[element.id] = element;
  emit('save', elementData);
};

bus.on('addRowBefore', (id: string) => addRow(id, Direction.Before));
bus.on('addRowAfter', (id: string) => addRow(id, Direction.After));
bus.on('addColumnBefore', (id: string) => addColumn(id, Direction.Before));
bus.on('addColumnAfter', (id: string) => addColumn(id, Direction.After));
bus.on('removeRow', (id: string) => removeRow(id));
bus.on('removeColumn', (id: string) => removeColumn(id));
</script>

<style lang="scss" scoped>
.tce-accordion {
  text-align: left;
  margin: 1rem 0;
}

.body {
  overflow-y: auto;
}

.table {
  display: table;
  border-collapse: collapse;

  .table-row {
    display: table-row;
  }

  .table-cell {
    display: table-cell;
    border: 1px solid black;
    width: 312px;
    max-width: 312px;
    height: 100%;
  }
}

.disabled {
  pointer-events: none;
}
</style>
