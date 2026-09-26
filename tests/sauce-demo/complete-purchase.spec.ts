import { test, expect } from "@playwright/test";

test.describe("Core Shopper Operations", () => {
  test("Complete a purchase and verify the order", async ({ page }) => {
    // 1. Sign in as standard_user from a fresh browser context and add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99). Open the cart and select Checkout.
    await page.goto("https://www.saucedemo.com/");
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page
      .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .click();
    await page.getByRole("button", { name: "Cart, 2 items" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText("Your Cart");
    await expect(page.locator(".inventory_item_name")).toHaveText([
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
    ]);
    await expect(page.locator(".cart_quantity")).toHaveText(["1", "1"]);
    await page.getByRole("button", { name: "Checkout" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText(
      "Checkout: Your Information",
    );

    // 2. Enter Avery as First Name, Morgan as Last Name, and 10001 as Zip/Postal Code; select Continue.
    await page.getByRole("textbox", { name: "First Name" }).fill("Avery");
    await page.getByRole("textbox", { name: "Last Name" }).fill("Morgan");
    await page.getByRole("textbox", { name: "Zip/Postal Code" }).fill("10001");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText(
      "Checkout: Overview",
    );
    await expect(page.locator(".inventory_item_name")).toHaveText([
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
    ]);
    await expect(page.locator(".cart_quantity")).toHaveText(["1", "1"]);
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText(
      "Item total: $39.98",
    );
    await expect(page.locator('[data-test="tax-label"]')).toHaveText(
      "Tax: $3.20",
    );
    await expect(page.locator('[data-test="total-label"]')).toHaveText(
      "Total: $43.18",
    );

    // 3. Select Finish.
    await page.getByRole("button", { name: "Finish" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText(
      "Checkout: Complete!",
    );
    await expect(page.locator('[data-test="complete-header"]')).toHaveText(
      "Thank you for your order!",
    );
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(
      0,
    );
    await expect(page.getByRole("button", { name: "Back Home" })).toBeVisible();

    // 4. Select Back Home.
    await page.getByRole("button", { name: "Back Home" }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(
      0,
    );
  });
});
