import { test, expect } from "@playwright/test";

test.describe("Core Shopper Operations", () => {
  test("Add and remove items in the shopping cart", async ({ page }) => {
    // 1. Sign in as standard_user from a fresh browser context.
    await page.goto("https://www.saucedemo.com/");
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(
      0,
    );

    // 2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page
      .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .click();
    await expect(
      page.locator('[data-test="remove-sauce-labs-backpack"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-test="remove-sauce-labs-bike-light"]'),
    ).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
      "2",
    );

    // 3. Open the cart.
    await page.getByRole("button", { name: "Cart, 2 items" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText("Your Cart");
    await expect(page.locator(".inventory_item_name")).toHaveText([
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
    ]);
    await expect(page.locator(".cart_quantity")).toHaveText(["1", "1"]);
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();

    // 4. Remove Sauce Labs Bike Light from the cart.
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(page.locator(".inventory_item_name")).toHaveText([
      "Sauce Labs Backpack",
    ]);
    await expect(page.locator(".cart_quantity")).toHaveText(["1"]);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
      "1",
    );

    // 5. Select Continue Shopping, then open the cart again.
    await page.getByRole("button", { name: "Continue Shopping" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    await page.getByRole("button", { name: "Cart, 1 items" }).click();
    await expect(page.locator(".inventory_item_name")).toHaveText([
      "Sauce Labs Backpack",
    ]);
    await expect(page.locator(".cart_quantity")).toHaveText(["1"]);
  });
});
