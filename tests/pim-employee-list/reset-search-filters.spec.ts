// spec: specs/pim-employee-list-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("PIM Employee List Search", () => {
  test("Reset Employee List search filters", async ({ page }) => {
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

    const defaultRows = page.getByRole("table").getByRole("row");
    await expect(defaultRows.nth(1)).toBeVisible();
    const defaultRowCount = await defaultRows.count();

    const employmentStatus = page.locator(".oxd-select-text").nth(0);
    await employmentStatus.click();
    await page
      .getByRole("listbox")
      .getByText("Full-Time Permanent", { exact: true })
      .click();
    await page.getByRole("button", { name: "Search" }).click();
    const referenceRow = page.getByRole("table").getByRole("row").nth(1);
    const referenceCells = referenceRow.getByRole("cell");
    await expect(referenceCells.nth(5)).toHaveText("Full-Time Permanent");
    const employeeId = (await referenceCells.nth(1).innerText()).trim();
    const employeeFirstName = (await referenceCells.nth(2).innerText()).trim();
    const employeeLastName = (await referenceCells.nth(3).innerText()).trim();

    // 2. Enter a known Employee Id and at least one other filter, then click Search and confirm the list is narrowed.
    await page.getByRole("button", { name: "Reset" }).click();
    const employeeIdInput = page.locator("input.oxd-input:not([placeholder])");
    await employeeIdInput.fill(employeeId);
    await page.locator(".oxd-select-text").nth(0).click();
    await page
      .getByRole("listbox")
      .getByText("Full-Time Permanent", { exact: true })
      .click();
    await page.getByRole("button", { name: "Search" }).click();
    await expect(employeeIdInput).toHaveValue(employeeId);
    await expect(page.locator(".oxd-select-text").nth(0)).toContainText(
      "Full-Time Permanent",
    );
    const narrowedRows = page.getByRole("table").getByRole("row");
    await expect(narrowedRows).toHaveCount(2);
    const narrowedCells = narrowedRows.nth(1).getByRole("cell");
    await expect(narrowedCells.nth(1)).toHaveText(employeeId);
    await expect(narrowedCells.nth(2)).toHaveText(employeeFirstName);
    await expect(narrowedCells.nth(3)).toHaveText(employeeLastName);

    // 3. Click Reset.
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(employeeIdInput).toHaveValue("");
    await expect(page.getByPlaceholder("Type for hints...").nth(0)).toHaveValue(
      "",
    );
    await expect(page.getByPlaceholder("Type for hints...").nth(1)).toHaveValue(
      "",
    );
    await expect(page.locator(".oxd-select-text").nth(0)).toContainText(
      "-- Select --",
    );
    await expect(page.locator(".oxd-select-text").nth(1)).toContainText(
      "Current Employees Only",
    );
    await expect(page.locator(".oxd-select-text").nth(2)).toContainText(
      "-- Select --",
    );
    await expect(page.locator(".oxd-select-text").nth(3)).toContainText(
      "-- Select --",
    );
    await expect(page.getByRole("table").getByRole("row")).toHaveCount(
      defaultRowCount,
    );
    await expect(page.getByText(/\(\d+\) Records Found/)).toBeVisible();
  });
});
