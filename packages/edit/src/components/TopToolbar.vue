<template>
  <VToolbar class="tce-table-toolbar elevation-0" color="transparent">
    <VToolbarItems>
      <VMenu bottom>
        <template #activator="{ props: activatorProps }">
          <VBtn v-bind="activatorProps" variant="text">
            Table options
            <VIcon>mdi-chevron-down</VIcon>
          </VBtn>
        </template>
        <VList class="text-left">
          <VListItem
            v-for="action in actions"
            :key="action.name"
            @click="trigger(action.name)"
          >
            <VListItemTitle>{{ action.label }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </VToolbarItems>
  </VToolbar>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
const props = defineProps<{ element: Element }>();

const elementBus = inject<any>('$elementBus');

const actions = computed(() => [
  { name: 'addRowBefore', label: 'Add row before' },
  { name: 'addRowAfter', label: 'Add row after' },
  { name: 'addColumnBefore', label: 'Add column before' },
  { name: 'addColumnAfter', label: 'Add column after' },
  { name: 'removeRow', label: 'Delete row' },
  { name: 'removeColumn', label: 'Delete column' },
]);

const trigger = (action: string) => {
  elementBus.emit(action, props.element?.id);
};
</script>

<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  padding-left: 0;
}

.tce-table-toolbar.ql-toolbar.ql-snow {
  border: none;
  padding: 0;
  font-family: inherit;
}
</style>
