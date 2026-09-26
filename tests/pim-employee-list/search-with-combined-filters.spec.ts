// spec: specs/pim-employee-list-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("PIM Employee List Search", () => {
  test("Search with multiple Employee List filters", async ({ page }) => {
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
    await expect(page.getByRole("table")).toBeVisible();

    const employmentStatus = page.locator(".oxd-select-text").nth(0);
    await employmentStatus.click();
    await page
      .getByRole("listbox")
      .getByText("Full-Time Permanent", { exact: true })
      .click();
    await page.getByRole("button", { name: "Search" }).click();
    const referenceRow = page.getByRole("table").getByRole("row").nth(1);
    await expect(referenceRow).toBeVisible();
    const referenceCells = referenceRow.getByRole("cell");
    const employeeId = (await referenceCells.nth(1).innerText()).trim();
    const employeeFirstName = (await referenceCells.nth(2).innerText()).trim();
    const employeeLastName = (await referenceCells.nth(3).innerText()).trim();

    // 2. Combine the selected employee's ID with the employment status filter.
    await page.getByRole("button", { name: "Reset" }).click();
    await page.locator("input.oxd-input:not([placeholder])").fill(employeeId);
    await employmentStatus.click();
    await page
      .getByRole("listbox")
      .getByText("Full-Time Permanent", { exact: true })
      .click();
    await page.getByRole("button", { name: "Search" }).click();

    const resultRows = page.getByRole("table").getByRole("row");
    const matchingEmployee = resultRows.filter({
      has: page.getByRole("cell", { name: employeeId, exact: true }),
    });
    await expect(matchingEmployee.getByRole("cell").nth(2)).toHaveText(
      employeeFirstName,
    );
    await expect(matchingEmployee.getByRole("cell").nth(3)).toHaveText(
      employeeLastName,
    );
    const resultRowCount = await resultRows.count();
    for (let index = 1; index < resultRowCount; index += 1) {
      const cells = resultRows.nth(index).getByRole("cell");
      await expect(cells.nth(1)).toHaveText(employeeId);
      await expect(cells.nth(5)).toHaveText("Full-Time Permanent");
    }
  });
});
