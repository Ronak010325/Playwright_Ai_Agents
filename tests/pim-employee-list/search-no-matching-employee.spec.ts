// spec: specs/pim-employee-list-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("PIM Employee List Search", () => {
  test("Search with criteria that match no employee", async ({ page }) => {
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
    await expect(page.getByRole("table").getByRole("row").nth(1)).toBeVisible();

    // 2. Enter a unique Employee Id confirmed not to exist in the baseline data and click Search.
    const uniqueMissingEmployeeId = String(Date.now());
    await page
      .locator("input.oxd-input:not([placeholder])")
      .fill(uniqueMissingEmployeeId);
    await page.getByRole("button", { name: "Search" }).click();

    const resultRows = page.getByRole("table").getByRole("row");
    await expect(resultRows).toHaveCount(1);
  });
});
