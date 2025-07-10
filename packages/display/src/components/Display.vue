<template>
  <div class="tce-root">
    <div class="table">
      <div v-for="row in table" :key="row.id" class="table-row">
        <div v-for="cell in row.cells" :key="cell.id" class="table-cell">
          <div class="cell col-xs-12">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="cell-content" v-html="cell.content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cell, Element, Row } from '@tailor-cms/ce-table-manifest';
import { get, sortBy } from 'lodash-es';
import { computed } from 'vue';

const props = defineProps<{ element: Element; userState: any }>();
defineEmits(['interaction']);

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
.tce-root {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}

.table {
  display: table;
  border-collapse: collapse;

  .table-row {
    display: table-row;
  }

  .table-cell {
    display: table-cell;
    width: 312px;
    border: 1px solid black;

    .cell {
      padding: 0;

      .cell-content {
        min-height: 42px;
        padding: 12px 15px;

        * {
          margin: 0;
          padding: 0;
        }
      }
    }
  }
}
</style>
