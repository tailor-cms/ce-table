import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Renders Edit component', async ({ page }) => {
  const editFrame = page.frameLocator('#editPanel>iframe')
  await expect(editFrame.getByText('Authoring component')).toBeVisible();
  await expect(editFrame.getByText('Top toolbar')).not.toBeVisible();
  await expect(editFrame.getByText('Side toolbar')).not.toBeVisible();
});

test('Renders Display component', async ({ page }) => {
  const displayFrame = page.frameLocator('#displayPanel>iframe')
  await expect(displayFrame.getByText('End-user component')).toBeVisible();
});

test('Renders server state panel', async ({ page }) => {
  const properties = ['uid', 'type', 'meta', 'data', 'contentId'];
  const bottomPanel = page.locator('#panelBottom');
  const authoringTab = bottomPanel.getByRole('tab', { name: 'Authoring history' });
  const userStateTab = bottomPanel.getByRole('tab', { name: 'End-user state history' });
  await expect(authoringTab).toBeVisible();
  await expect(userStateTab).toBeVisible();
  await authoringTab.click();
  for (const prop of properties) {
    await expect(bottomPanel.getByText(prop)).toBeVisible();
  }
});
