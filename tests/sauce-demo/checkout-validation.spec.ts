import { test, expect } from "@playwright/test";

test.describe("Core Shopper Operations", () => {
  test("Validate required checkout information", async ({ page }) => {
    // 1. Sign in as standard_user, add Sauce Labs Backpack, open the cart, and select Checkout.
    await page.goto("https://www.saucedemo.com/");
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.getByRole("button", { name: "Cart, 1 items" }).click();
    await page.getByRole("button", { name: "Checkout" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText(
      "Checkout: Your Information",
    );
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();

    // 2. Leave all fields blank and select Continue.
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText(
      "Checkout: Your Information",
    );
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Error: First Name is required",
    );

    // 3. Enter Avery in First Name and Morgan in Last Name, leave Zip/Postal Code blank, and select Continue.
    await page.getByRole("textbox", { name: "First Name" }).fill("Avery");
    await page.getByRole("textbox", { name: "Last Name" }).fill("Morgan");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText(
      "Checkout: Your Information",
    );
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Error: Postal Code is required",
    );

    // 4. Select Cancel.
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText("Your Cart");
  });
});
