// spec: specs/pim-employee-list-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('PIM Employee List Search', () => {
  test('Search by employment status', async ({ page }) => {
    // 1. Start from a fresh browser session on the login page, sign in as Admin, and navigate to PIM > Employee List.
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'PIM' }).click();
    await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();

    // 2. Identify a current employee whose Employment Status is populated. Open Employment Status and select that employee's status from the available options.
    const employmentStatus = page.locator('.oxd-select-text').nth(0);
    await employmentStatus.click();
    await page.getByRole('listbox').getByText('Full-Time Permanent', { exact: true }).click();
    await expect(employmentStatus).toContainText('Full-Time Permanent');

    // 3. Click Search.
    await page.getByRole('button', { name: 'Search' }).click();
    const resultRows = page.getByRole('table').getByRole('row');
    await expect(resultRows.nth(1)).toBeVisible();
    await expect(page.getByText(/\(\d+\) Records Found/)).toBeVisible();
    const matchingEmployee = resultRows.nth(1);
    await expect(matchingEmployee.getByRole('cell').nth(5)).toHaveText('Full-Time Permanent');

    const resultRowCount = await resultRows.count();
    for (let index = 1; index < resultRowCount; index += 1) {
      const statusCell = resultRows.nth(index).getByRole('cell').nth(5);
      const statusText = (await statusCell.innerText()).trim();
      if (statusText) {
        expect(statusText).toBe('Full-Time Permanent');
      }
    }
  });
});
