<!-- eslint-disable vue/no-undef-components -->
<template>
  <div class="table-cell">
    <TailorContentElement
      :element="cell"
      :is-disabled="isReadonly"
      :parent="table"
      :show-placeholder="false"
      class="cell-content"
      variant="field"
      @save="save"
    />
    <VBtn
      v-if="!isReadonly"
      :id="`cell-menu-${cell.id}`"
      :class="{ 'is-visible': isMenuOpen }"
      aria-label="Row and column actions"
      class="cell-trigger"
      density="comfortable"
      icon="mdi-dots-vertical"
      size="small"
      variant="text"
    />
    <VMenu
      v-model="isMenuOpen"
      :activator="`#cell-menu-${cell.id}`"
      location="bottom end"
      min-width="216"
    >
      <VList density="compact" role="menu" nav>
        <VListItem
          v-for="action in actions"
          :key="action.label"
          :base-color="action.destructive ? 'error' : undefined"
          :prepend-icon="action.icon"
          :title="action.label"
          role="menuitem"
          @click="(emit as any)(action.event, action.direction)"
        />
      </VList>
    </VMenu>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { Direction } from '@tailor-cms/ce-table-manifest';
import type { Element } from '@tailor-cms/ce-table-manifest';

interface Action {
  event: 'row:add' | 'col:add' | 'row:remove' | 'col:remove';
  direction?: Direction;
  label: string;
  icon: string;
  destructive?: boolean;
  visible?: boolean;
}

const props = defineProps<{
  cell: Element;
  table: Element;
  isReadonly: boolean;
  canRemoveRow: boolean;
  canRemoveColumn: boolean;
}>();

const actions = computed<Action[]>(() => {
  const items: Action[] = [
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
      destructive: true,
      visible: props.canRemoveRow,
    },
    {
      event: 'col:remove',
      label: 'Delete column',
      icon: 'mdi-table-column-remove',
      destructive: true,
      visible: props.canRemoveColumn,
    },
  ];
  return items.filter(({ visible = true }) => visible);
});

const emit = defineEmits<{
  save: [element: Element];
  'col:add': [direction?: Direction];
  'col:remove': [];
  'row:add': [direction?: Direction];
  'row:remove': [];
}>();

const isMenuOpen = ref(false);

const save = (data: any) =>
  emit('save', { ...cloneDeep(props.cell), data } as Element);
</script>

<style lang="scss" scoped>
.table-cell {
  position: relative;
  display: table-cell;
  width: 24rem;
  min-width: 12rem;
  max-width: 24rem;
  height: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  vertical-align: top;
}

.table-cell .cell-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 0;
  cursor: text;
}

.table-cell .cell-content:not(.focused) {
  border-color: transparent;
}

// Stretch the editor to fill the cell. The host may wrap the element body in a
// transition element, so match the body or its wrapper - but not sibling
// headers or overlays.
.table-cell :deep(.cell-content) {
  > .card-body,
  > div:has(> .card-body) {
    flex: 1 1 auto;
    min-height: 0;
  }

  > div > .card-body,
  .tce-jodit-html,
  .jodit-wrapper {
    height: 100%;
  }

  // Jodit sets height and min-width inline at runtime.
  .jodit-container {
    height: 100% !important;
    min-width: 0 !important;
  }
}

.table-cell :deep(.cell-content) .jodit-status-bar {
  display: none;
}

.cell-trigger {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  opacity: 0;
  transition: opacity 0.15s linear;

  .table-cell:hover &,
  &:focus-visible,
  &.is-visible {
    opacity: 1;
  }
}
</style>
