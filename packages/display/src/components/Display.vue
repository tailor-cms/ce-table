<template>
  <div class="tce-table-root" tabindex="0">
    <table class="table">
      <tbody>
        <tr v-for="row in table" :key="row.id" class="table-row">
          <td v-for="cell in row.cells" :key="cell.id" class="table-cell">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="cell-content" v-html="cell.content"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Cell, Element, Row } from '@tailor-cms/ce-table-manifest';
import { get, sortBy } from 'lodash-es';
import { computed } from 'vue';

const props = defineProps<{ element: Element }>();

const mapCell = (cell: Cell, embeds: Record<string, any>) => {
  const content = get(embeds[cell.id], 'data.content');
  return { id: cell.id, content };
};

const mapRow = (row: Row, embeds: Record<string, any>) => {
  const cells = sortBy(row.cells, 'position').map((cell) =>
    mapCell(cell, embeds),
  );
  return { id: row.id, cells };
};

const table = computed(() => {
  return sortBy(props.element.data.rows, 'position').map((row) =>
    mapRow(row, props.element.data.embeds),
  );
});
</script>

<style scoped>
/* Wide tables scroll instead of compressing columns to unreadable slivers. */
.tce-table-root {
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
}

.table {
  border-collapse: collapse;
  inline-size: max-content;
  max-inline-size: 100%;
}

.table-cell {
  min-width: 12rem;
  padding: 0.75rem 1rem;
  /* The M3 `outline-*` roles are not defined in the display runtime's theme. */
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  vertical-align: top;
  text-align: left;
  overflow-wrap: break-word;
}

/* Keep the authored rich text's spacing, flush with the cell padding. */
.cell-content > :first-child {
  margin-block-start: 0;
}

.cell-content > :last-child {
  margin-block-end: 0;
}

.cell-content :where(ul, ol) {
  padding-inline-start: 1.25rem;
}
</style>
