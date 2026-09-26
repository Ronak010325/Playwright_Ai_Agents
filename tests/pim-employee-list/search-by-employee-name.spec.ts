// spec: specs/pim-employee-list-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("PIM Employee List Search", () => {
  test("Search Employee List by employee name", async ({ page }) => {
    // 1. Start from a fresh browser session at the OrangeHRM login page. Sign in with Admin / admin123, open PIM, and go to Employee List.
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

    const rows = page.getByRole("table").getByRole("row");
    await expect(rows.nth(1)).toBeVisible();
    const rowCount = await rows.count();
    let employeeFirstName = "";
    let employeeLastName = "";
    const employeeNameInput = page
      .getByPlaceholder("Type for hints...")
      .first();

    for (let index = 1; index < rowCount; index += 1) {
      const cells = rows.nth(index).getByRole("cell");
      const firstName = (await cells.nth(2).innerText()).trim();
      const lastName = (await cells.nth(3).innerText()).trim();
      if (
        /^[A-Za-z][A-Za-z .'-]*$/.test(firstName) &&
        /^[A-Za-z][A-Za-z .'-]*$/.test(lastName)
      ) {
        employeeFirstName = firstName;
        employeeLastName = lastName;
        break;
      }
    }

    expect(
      employeeFirstName,
      "A named current employee should be available in the baseline results",
    ).not.toBe("");

    // 2. Enter the baseline employee name and wait for matching autocomplete suggestions.
    await employeeNameInput.fill(employeeFirstName);
    const employeeSuggestion = page
      .getByRole("option", {
        name: `${employeeFirstName} ${employeeLastName}`,
        exact: true,
      })
      .first();
    await expect(employeeSuggestion).toBeVisible();

    // 3. Select the first exact-name suggestion and click Search.
    await employeeSuggestion.click();
    await page.getByRole("button", { name: "Search" }).click();
    const resultRows = page.getByRole("table").getByRole("row");
    const matchingRows = resultRows
      .filter({
        has: page.getByRole("cell", {
          name: employeeFirstName,
          exact: true,
        }),
      })
      .filter({
        has: page.getByRole("cell", {
          name: employeeLastName,
          exact: true,
        }),
      });
    await expect(page.getByText(/\(\d+\) Record(?:s)? Found/)).toBeVisible();
    await expect(matchingRows.first()).toBeVisible();
    await expect(matchingRows.first().getByRole("cell").nth(2)).toHaveText(
      employeeFirstName,
    );
    await expect(matchingRows.first().getByRole("cell").nth(3)).toHaveText(
      employeeLastName,
    );
  });
});
