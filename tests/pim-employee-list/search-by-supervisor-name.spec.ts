// spec: specs/pim-employee-list-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("PIM Employee List Search", () => {
  test("Search by supervisor name", async ({ page }) => {
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

    // 2. Identify an employee with a populated Supervisor value. Enter that supervisor's name in Supervisor Name and select the exact autocomplete suggestion.
    const employmentStatus = page.locator(".oxd-select-text").nth(0);
    await employmentStatus.click();
    await page
      .getByRole("listbox")
      .getByText("Full-Time Permanent", { exact: true })
      .click();
    await page.getByRole("button", { name: "Search" }).click();

    const baselineRows = page.getByRole("table").getByRole("row");
    await expect(baselineRows.nth(1).getByRole("cell").nth(5)).toHaveText(
      "Full-Time Permanent",
    );
    const baselineRowCount = await baselineRows.count();
    let referenceEmployeeId = "";
    let referenceEmployeeFirstName = "";
    let referenceEmployeeLastName = "";
    let supervisorName = "";

    for (let index = 1; index < baselineRowCount; index += 1) {
      const cells = baselineRows.nth(index).getByRole("cell");
      const candidateSupervisor = (await cells.nth(7).innerText()).trim();
      if (candidateSupervisor) {
        referenceEmployeeId = (await cells.nth(1).innerText()).trim();
        referenceEmployeeFirstName = (await cells.nth(2).innerText()).trim();
        referenceEmployeeLastName = (await cells.nth(3).innerText()).trim();
        supervisorName = candidateSupervisor;
        break;
      }
    }
    expect(
      supervisorName,
      "A baseline employee with a supervisor should be available",
    ).not.toBe("");

    await page.getByRole("button", { name: "Reset" }).click();
    const supervisorInput = page.getByPlaceholder("Type for hints...").nth(1);
    await supervisorInput.fill(supervisorName.split(" ")[0]);
    const supervisorNameParts = supervisorName.split(" ");
    const supervisorSuggestion = page
      .locator(".oxd-autocomplete-option")
      .filter({ hasText: supervisorNameParts[0] })
      .filter({ hasText: supervisorNameParts[supervisorNameParts.length - 1] });
    await expect(supervisorSuggestion).toBeVisible();
    await supervisorSuggestion.click();

    // 3. Click Search.
    await page.getByRole("button", { name: "Search" }).click();
    const resultRows = page.getByRole("table").getByRole("row");
    const matchingEmployee = resultRows.filter({
      has: page.getByRole("cell", { name: referenceEmployeeId, exact: true }),
    });
    await expect(matchingEmployee.getByRole("cell").nth(2)).toHaveText(
      referenceEmployeeFirstName,
    );
    await expect(matchingEmployee.getByRole("cell").nth(3)).toHaveText(
      referenceEmployeeLastName,
    );

    const resultRowCount = await resultRows.count();
    for (let index = 1; index < resultRowCount; index += 1) {
      await expect(resultRows.nth(index).getByRole("cell").nth(7)).toHaveText(
        supervisorName,
      );
    }
  });
});
