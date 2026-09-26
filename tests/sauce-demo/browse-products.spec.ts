import { test, expect } from "@playwright/test";

test.describe("Core Shopper Operations", () => {
  test("Browse, sort, and inspect a product", async ({ page }) => {
    // 1. Sign in as standard_user from a fresh browser context.
    await page.goto("https://www.saucedemo.com/");
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    await expect(
      page.locator('[data-test="product-sort-container"]'),
    ).toBeVisible();

    // 2. Select Price (low to high) in Sort products.
    await page
      .getByRole("combobox", { name: "Sort products" })
      .selectOption("lohi");
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText([
      "Sauce Labs Onesie",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
      "Test.allTheThings() T-Shirt (Red)",
      "Sauce Labs Backpack",
      "Sauce Labs Fleece Jacket",
    ]);
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(
      ["$7.99", "$9.99", "$15.99", "$15.99", "$29.99", "$49.99"],
    );

    // 3. Open View details for Sauce Labs Backpack.
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(
      "Sauce Labs Backpack",
    );
    await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveText(
      "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.",
    );
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(
      "$29.99",
    );
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

    // 4. Return to the Products catalog.
    await page.getByRole("button", { name: "Back to products" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });
});
