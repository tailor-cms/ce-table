<template>
  <TailorContentElement
    :element="cell"
    :is-disabled="isDisabled"
    :parent="table"
    class="table-cell"
    @save="save"
  />
</template>

<script lang="ts" setup>
import cloneDeep from 'lodash/cloneDeep';
import type { Element } from '@tailor-cms/ce-table-manifest';

const props = defineProps<{
  cell: Element;
  table: Element;
  isDisabled: boolean;
}>();

const emit = defineEmits(['save']);

const save = (data: any) => {
  emit('save', { ...cloneDeep(props.cell), data });
};
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
