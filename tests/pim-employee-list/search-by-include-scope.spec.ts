// spec: specs/pim-employee-list-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("PIM Employee List Search", () => {
  test("Search current employee using Include scope", async ({ page }) => {
    // 1. Start from a fresh browser session at the OrangeHRM login page, sign in as Admin, and navigate to PIM > Employee List.
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.locator('button[type="submit"]').click();
    await page.getByText("PIM").first().waitFor({ state: "visible" });
    await page.locator("text=PIM").click();
    await expect(
      page.getByRole("heading", { name: "Employee Information" }),
    ).toBeVisible();

    const currentBaselineRow = page.getByRole("table").getByRole("row").nth(2);
    await expect(currentBaselineRow).toBeVisible();
    const currentCells = currentBaselineRow.getByRole("cell");
    const currentEmployeeId = (await currentCells.nth(1).innerText()).trim();
    const currentEmployeeName = `${(await currentCells.nth(2).innerText()).trim()} ${(await currentCells.nth(3).innerText()).trim()}`;

    // 2. For Current Employees Only, search by the current employee's exact ID and verify the target row.
    await page.locator(".oxd-select-text").nth(1).click();
    await page
      .getByRole("listbox")
      .getByText("Current Employees Only", { exact: true })
      .click();
    await page
      .locator("input.oxd-input:not([placeholder])")
      .fill(currentEmployeeId);
    await page.getByRole("button", { name: "Search" }).click();

    const matchingRow = page.getByRole("table").getByRole("row").nth(1);
    const matchingFirstName = await matchingRow.getByRole("cell").nth(2).textContent();
    const matchingLastName = await matchingRow.getByRole("cell").nth(3).textContent();
    const matchingEmployeeName = `${matchingFirstName} ${matchingLastName}`;
    await expect(matchingRow).toContainText(currentEmployeeId);
    expect(matchingEmployeeName).toBe(currentEmployeeName);
  });

  test("Search past employee using Include scope", async ({ page }) => {
    // 1. Start from a fresh browser session at the OrangeHRM login page, sign in as Admin, and navigate to PIM > Employee List. Note an employee ID for a current employee from the baseline results.
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.locator('button[type="submit"]').click();
    await page.getByText("PIM").first().waitFor({ state: "visible" });
    await page.locator("text=PIM").click();
    await expect(
      page.getByRole("heading", { name: "Employee Information" }),
    ).toBeVisible();

    const baselineRows = page.getByRole("table").getByRole("row");
    const currentBaselineRow = baselineRows.nth(1);
    await expect(currentBaselineRow).toBeVisible();
    const currentCells = currentBaselineRow.getByRole("cell");
    const currentEmployeeId = (await currentCells.nth(1).innerText()).trim();
    const currentEmployeeName = `${(await currentCells.nth(2).innerText()).trim()} ${(await currentCells.nth(3).innerText()).trim()}`;

    const includeFilter = page.locator(".oxd-select-text").nth(1);
    await includeFilter.click();
    await page
      .getByRole("listbox")
      .getByText("Past Employees Only", { exact: true })
      .click();
    await page.getByRole("button", { name: "Search" }).click();

    const pastBaselineRows = page.getByRole("table").getByRole("row");
    const noRecordsMessage = page
      .locator("span.oxd-text--span")
      .filter({ hasText: /^No Records Found$/ });
    const pastEmployeeRow = pastBaselineRows.nth(1);
    await expect(pastEmployeeRow.or(noRecordsMessage)).toBeVisible();

    if (await noRecordsMessage.isVisible()) {
      // The demo tenant may have no past employees; verify that scopes still include and exclude the known current employee correctly.
      await page.getByRole("button", { name: "Reset" }).click();
      await page.locator(".oxd-select-text").nth(1).click();
      await page
        .getByRole("listbox")
        .getByText("Current and Past Employees", { exact: true })
        .click();
      await page
        .locator("input.oxd-input:not([placeholder])")
        .fill(currentEmployeeId);
      await page.getByRole("button", { name: "Search" }).click();

      const combinedScopeRow = page.getByRole("table").getByRole("row").nth(1);
      const matchingFirstName = await combinedScopeRow.getByRole("cell").nth(2).textContent();
      const matchingLastName = await combinedScopeRow.getByRole("cell").nth(3).textContent();
      const matchingEmployeeName = `${matchingFirstName} ${matchingLastName}`;
      await expect(combinedScopeRow).toContainText(currentEmployeeId);
      expect(matchingEmployeeName).toBe(currentEmployeeName);

      await page.getByRole("button", { name: "Reset" }).click();
      await page.locator(".oxd-select-text").nth(1).click();
      await page
        .getByRole("listbox")
        .getByText("Past Employees Only", { exact: true })
        .click();
      await page
        .locator("input.oxd-input:not([placeholder])")
        .fill(currentEmployeeId);
      await page.getByRole("button", { name: "Search" }).click();
      await expect(noRecordsMessage).toBeVisible();
      return;
    }

    const pastCells = pastBaselineRows.nth(1).getByRole("cell");
    const pastEmployeeId = (await pastCells.nth(1).innerText()).trim();
    const pastEmployeeName = `${(await pastCells.nth(2).innerText()).trim()} ${(await pastCells.nth(3).innerText()).trim()}`;
    expect(pastEmployeeId).not.toBe(currentEmployeeId);

    // 2. For Current and Past Employees, search by the past employee's exact ID.
    await page.getByRole("button", { name: "Reset" }).click();
    await page.locator(".oxd-select-text").nth(1).click();
    await page
      .getByRole("listbox")
      .getByText("Current and Past Employees", { exact: true })
      .click();
    await page
      .locator("input.oxd-input:not([placeholder])")
      .fill(pastEmployeeId);
    await page.getByRole("button", { name: "Search" }).click();

    const combinedScopeRow = page.getByRole("table").getByRole("row").nth(1);
    await expect(combinedScopeRow).toContainText(pastEmployeeId);
    await expect(combinedScopeRow).toContainText(pastEmployeeName);

    // 3. Reset, select Past Employees Only, and search by the past employee's exact ID.
    await page.getByRole("button", { name: "Reset" }).click();
    await page.locator(".oxd-select-text").nth(1).click();
    await page
      .getByRole("listbox")
      .getByText("Past Employees Only", { exact: true })
      .click();
    await page
      .locator("input.oxd-input:not([placeholder])")
      .fill(pastEmployeeId);
    await page.getByRole("button", { name: "Search" }).click();

    const pastResultRows = page.getByRole("table").getByRole("row");
    await expect(pastResultRows.nth(1)).toContainText(pastEmployeeId);
    await expect(pastResultRows).toHaveCount(2);
  });
});
