// spec: specs/pim-employee-list-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("PIM Employee List Search", () => {
  test("Search by sub unit", async ({ page }) => {
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
    const employees = await page.evaluate(async () => {
      const response = await fetch(
        "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&empStatusId=3&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC",
      );
      const payload = await response.json();
      return payload.data ?? [];
    });

    const referenceEmployee = employees.find((employee: { employeeId: any; firstName: any; lastName: any; subunit: { name: any; }; empStatus: { name: string; }; }) => {
      return (
        employee.employeeId &&
        employee.firstName &&
        employee.lastName &&
        employee.subunit &&
        employee.subunit.name &&
        employee.empStatus &&
        employee.empStatus.name === "Full-Time Permanent"
      );
    });

    expect(
      referenceEmployee,
      "A current employee with a populated Sub Unit should be available in the employee API data",
    ).toBeTruthy();

    const employeeId = referenceEmployee.employeeId;
    const employeeFirstName = [
      referenceEmployee.firstName,
      referenceEmployee.middleName,
    ]
      .filter(Boolean)
      .join(" ");
    const employeeLastName = referenceEmployee.lastName;
    const subUnit = referenceEmployee.subunit.name;

    // 2. Identify a current employee with a populated Sub Unit. Select that employee's unit in the Sub Unit dropdown and click Search.
    await page.getByRole("button", { name: "Reset" }).click();
    const subUnitFilter = page.locator(".oxd-select-text").nth(3);
    await subUnitFilter.click();
    await page.getByRole("listbox").getByText(subUnit, { exact: true }).click();
    await expect(subUnitFilter).toContainText(subUnit);
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
      await expect(resultRows.nth(index).getByRole("cell").nth(6)).toHaveText(
        subUnit,
      );
    }
  });
});
