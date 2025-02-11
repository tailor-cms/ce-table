<template>
  <VMenu v-model="menu" location="top center" min-width="216">
    <template #activator="{ props: activatorProps }">
      <TailorContentElement
        v-bind="activatorProps"
        :element="cell"
        :is-disabled="isDisabled"
        :parent="table"
        class="table-cell"
        @click="openMenu"
        @save="save"
      />
    </template>
    <VBtnGroup density="comfortable" elevation="4" rounded="lg">
      <VBtn
        v-for="action in actions"
        :key="action.label"
        v-tooltip="action.label"
        :icon="action.icon"
        @click="emit(action.event, action.direction)"
      />
    </VBtnGroup>
  </VMenu>
</template>

<script lang="ts" setup>
import { Direction, type Element } from '@tailor-cms/ce-table-manifest';
import cloneDeep from 'lodash/cloneDeep';
import { ref } from 'vue';

enum Event {
  RowAdd = 'row:add',
  RowRemove = 'row:remove',
  ColAdd = 'col:add',
  ColRemove = 'col:remove',
}

interface Action {
  event: Event;
  direction?: Direction;
  label: string;
  icon: string;
}

const actions: Action[] = [
  {
    event: Event.RowAdd,
    direction: Direction.Before,
    label: 'Add row before',
    icon: 'mdi-table-row-plus-before',
  },
  {
    event: Event.RowAdd,
    direction: Direction.After,
    label: 'Add row after',
    icon: 'mdi-table-row-plus-after',
  },
  {
    event: Event.ColAdd,
    direction: Direction.Before,
    label: 'Add column before',
    icon: 'mdi-table-column-plus-before',
  },
  {
    event: Event.ColAdd,
    direction: Direction.After,
    label: 'Add column after',
    icon: 'mdi-table-column-plus-after',
  },
  {
    event: Event.RowRemove,
    label: 'Delete row',
    icon: 'mdi-table-row-remove',
  },
  {
    event: Event.ColRemove,
    label: 'Delete column',
    icon: 'mdi-table-column-remove',
  },
];

const props = defineProps<{
  cell: Element;
  table: Element;
  isDisabled: boolean;
}>();

const emit = defineEmits([
  'save',
  'col:add',
  'col:remove',
  'row:add',
  'row:remove',
]);

const menu = ref(false);

const openMenu = () => (menu.value = true);
const save = (data: any) => emit('save', { ...cloneDeep(props.cell), data });
</script>

<style lang="scss" scoped>
.table-cell {
  display: table-cell;
  border: 1px solid black;
  width: 312px;
  max-width: 312px;
  height: 100%;
}
</style>
