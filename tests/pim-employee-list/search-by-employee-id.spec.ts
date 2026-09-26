// spec: specs/pim-employee-list-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("PIM Employee List Search", () => {
  test("Search Employee List by employee ID", async ({ page }) => {
    // 1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List.
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();
    await page.getByRole("link", { name: "PIM" }).click();
    await expect(
      page.getByRole("heading", { name: "Employee Information" }),
    ).toBeVisible();
    const rows = page.getByRole("table").getByRole("row");
    await expect(rows.nth(1)).toBeVisible();

    // 2. Copy an exact Employee Id from a baseline result row, enter it in Employee Id, and click Search.
    const baselineRow = rows.nth(1);
    const baselineCells = baselineRow.getByRole("cell");
    const employeeId = (await baselineCells.nth(1).innerText()).trim();
    const baselineFirstName = (await baselineCells.nth(2).innerText()).trim();
    const baselineLastName = (await baselineCells.nth(3).innerText()).trim();
    await page.locator("input.oxd-input:not([placeholder])").fill(employeeId);
    await page.getByRole("button", { name: "Search" }).click();

    const resultRows = page.getByRole("table").getByRole("row");
    await expect(resultRows).toHaveCount(2);
    const resultCells = resultRows.nth(1).getByRole("cell");
    await expect(resultCells.nth(1)).toHaveText(employeeId);
    await expect(resultCells.nth(2)).toHaveText(baselineFirstName);
    await expect(resultCells.nth(3)).toHaveText(baselineLastName);
  });
});
