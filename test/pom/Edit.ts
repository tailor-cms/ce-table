import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly root: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly cells: Locator;
  readonly cellMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.tce-table');
    this.table = this.root.locator('.table').first();
    this.rows = this.table.locator('.table-row');
    this.cells = this.table.locator('.table-cell');
    // Scoped to the open overlay - a menu that is closing stays in the DOM.
    this.cellMenu = this.el.locator('.v-overlay--active').getByRole('menu');
  }

  cellAt(index: number): Locator {
    return this.cells.nth(index);
  }

  cellTriggerAt(index: number): Locator {
    return this.cellAt(index).locator('.cell-trigger');
  }

  cellActionBtn(label: string): Locator {
    return this.cellMenu.getByRole('menuitem', { name: label });
  }

  // A menu stays in the DOM while it animates out and swallows clicks on the
  // way, so wait for it to leave before opening the next one.
  async openCellMenu(index: number): Promise<void> {
    await expect(this.el.locator('.v-overlay__content')).toHaveCount(0);
    await this.cellTriggerAt(index).click();
    await expect(this.cellMenu).toBeVisible();
  }
}
