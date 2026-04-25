import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Display } from '../pom';

const ELEMENT_ID = 'test-table-display';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.resetState(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Default state', () => {
  test('Renders a 2x3 grid', async ({ page }) => {
    const display = new Display(page);
    await expect(display.rows).toHaveCount(2);
    await expect(display.cells).toHaveCount(6);
  });
});

test.describe('With cell content', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      tableId: 't1',
      embeds: {
        c1: {
          id: 'c1',
          data: { content: '<p>Hello</p>' },
          type: 'JODIT_HTML',
        },
      },
      rows: {
        r1: {
          id: 'r1',
          position: 0,
          cells: { c1: { id: 'c1', position: 0, data: {} } },
        },
      },
    });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Renders cell content via v-html', async ({ page }) => {
    const display = new Display(page);
    await expect(display.cells.first().locator('p')).toHaveText('Hello');
  });
});
