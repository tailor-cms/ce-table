import type { Locator, Page } from '@playwright/test';
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
    this.cellMenu = this.el.locator('.v-overlay--active .v-btn-group');
  }

  cellAt(index: number): Locator {
    return this.cells.nth(index);
  }

  cellActionBtn(label: string): Locator {
    return this.cellMenu.getByRole('button', { name: label });
  }
}
