<!-- eslint-disable vue/no-undef-components -->
<template>
  <TailorContentElement
    :id="`cell-menu-${cell.id}`"
    :element="cell"
    :is-disabled="isReadonly"
    :parent="table"
    :show-placeholder="false"
    class="table-cell"
    @save="save"
  />
  <VMenu
    :activator="`#cell-menu-${cell.id}`"
    location="top center"
    min-width="216"
  >
    <VBtnGroup density="comfortable" elevation="4" rounded="lg" divided>
      <VBtn
        v-for="action in actions"
        :key="action.label"
        v-tooltip="action.label"
        :aria-label="action.label"
        :icon="action.icon"
        size="large"
        @click="(emit as any)(action.event, action.direction)"
      />
    </VBtnGroup>
  </VMenu>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import { Direction } from '@tailor-cms/ce-table-manifest';
import type { Element } from '@tailor-cms/ce-table-manifest';

interface Action {
  event: 'row:add' | 'col:add' | 'row:remove' | 'col:remove';
  direction?: Direction;
  label: string;
  icon: string;
}

const actions: Action[] = [
  {
    event: 'row:add',
    direction: Direction.Before,
    label: 'Add row before',
    icon: 'mdi-table-row-plus-before',
  },
  {
    event: 'row:add',
    direction: Direction.After,
    label: 'Add row after',
    icon: 'mdi-table-row-plus-after',
  },
  {
    event: 'col:add',
    direction: Direction.Before,
    label: 'Add column before',
    icon: 'mdi-table-column-plus-before',
  },
  {
    event: 'col:add',
    direction: Direction.After,
    label: 'Add column after',
    icon: 'mdi-table-column-plus-after',
  },
  {
    event: 'row:remove',
    label: 'Delete row',
    icon: 'mdi-table-row-remove',
  },
  {
    event: 'col:remove',
    label: 'Delete column',
    icon: 'mdi-table-column-remove',
  },
];

const props = defineProps<{
  cell: Element;
  table: Element;
  isReadonly: boolean;
}>();

const emit = defineEmits<{
  save: [element: Element];
  'col:add': [direction?: Direction];
  'col:remove': [];
  'row:add': [direction?: Direction];
  'row:remove': [];
}>();

const save = (data: any) =>
  emit('save', { ...cloneDeep(props.cell), data } as Element);
</script>

<style lang="scss" scoped>
.table-cell {
  display: table-cell;
  border: 1px solid black;
  width: 312px;
  max-width: 312px;
  height: 100%;
  vertical-align: top;
}
</style>
