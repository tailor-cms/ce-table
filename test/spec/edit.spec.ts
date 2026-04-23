import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-table-edit';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Initial render', () => {
  test('Renders a 2x3 grid by default', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.rows).toHaveCount(2);
    await expect(edit.cells).toHaveCount(6);
  });
});

test.describe('Cell actions', () => {
  test('Adds a column after the current one', async ({ page }) => {
    const edit = new Edit(page);
    await edit.cellAt(0).click();
    await edit.cellActionBtn('Add column after').click();
    await expect(edit.cells).toHaveCount(8);
  });

  test('Adds a row after the current one', async ({ page }) => {
    const edit = new Edit(page);
    await edit.cellAt(0).click();
    await edit.cellActionBtn('Add row after').click();
    await expect(edit.rows).toHaveCount(3);
    await expect(edit.cells).toHaveCount(9);
  });

  test('Removes a row', async ({ page }) => {
    const edit = new Edit(page);
    await edit.cellAt(0).click();
    await edit.cellActionBtn('Delete row').click();
    await expect(edit.rows).toHaveCount(1);
    await expect(edit.cells).toHaveCount(3);
  });

  test('Removes a column', async ({ page }) => {
    const edit = new Edit(page);
    await edit.cellAt(0).click();
    await edit.cellActionBtn('Delete column').click();
    await expect(edit.cells).toHaveCount(4);
  });
});

test.describe('Readonly mode', () => {
  test('Applies readonly class to the table', async ({ page }) => {
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.table).toHaveClass(/readonly/);
  });
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
