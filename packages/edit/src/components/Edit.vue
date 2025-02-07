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
          <TableCell
            v-for="cell in cells(row)"
            :key="cell.id"
            :cell="embeds[cell.id]"
            :is-disabled="isDisabled"
            :table="element"
            @add-col-after="addColumn($event, Direction.After)"
            @add-col-before="addColumn($event, Direction.Before)"
            @add-row-after="addRow($event, Direction.After)"
            @add-row-before="addRow($event, Direction.Before)"
            @remove-col="removeColumn"
            @remove-row="removeRow"
            @save="saveCell"
          />
        </div>
      </div>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import manifest, {
  Cell,
  Cells,
  Direction,
  Element,
  ElementData,
  Row,
  Rows,
  utils,
} from '@tailor-cms/ce-table-manifest';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import first from 'lodash/first';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';
import { v4 as uuid } from 'uuid';

import TableCell from './TableCell.vue';

const MIN_ROWS = 1;
const MIN_COLUMNS = 1;

const { addCell, addEmbed, removeCell, removeEmbed } = utils;

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

const elementData = reactive<ElementData>(cloneDeep(props.element.data));
const table = computed(() => sortBy(elementData.rows, 'position'));
const rows = computed(() => elementData.rows);
const embeds = computed(() => elementData.embeds);

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

  const { tableId, rows, embeds } = elementData;
  const position = calculateInsertPosition(rows, row, direction);
  const newRow = { id: uuid(), position, cells: {} };
  forEach(row.cells, ({ position }) => {
    const cellId = uuid();
    addCell(newRow, { id: cellId, position, data: {} });
    addEmbed(embeds, cellId, tableId);
  });
  rows[newRow.id] = newRow;
  emit('save', elementData);
};

const addColumn = (cellId: string, direction = Direction.After) => {
  const row = findRow(cellId);
  if (!row) return;
  const cell = row.cells[cellId];
  if (!cell) return;

  const { tableId, rows, embeds } = elementData;
  const position = calculateInsertPosition(row.cells, cell, direction);
  forEach(rows, (row) => {
    const cellId = uuid();
    addCell(row, { id: cellId, position, data: {} });
    addEmbed(embeds, cellId, tableId);
  });

  emit('save', elementData);
};

const removeRow = (cellId: string) => {
  const row = findRow(cellId);
  if (!row || size(props.element.data.rows) <= MIN_ROWS) return;

  const { rows, embeds } = elementData;
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

  const { rows, embeds } = elementData;

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
}

.disabled {
  pointer-events: none;
}
</style>
