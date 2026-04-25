import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly root: Locator;
  readonly rows: Locator;
  readonly cells: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.tce-table-root');
    this.rows = this.root.locator('.table-row');
    this.cells = this.root.locator('.table-cell');
  }
}
