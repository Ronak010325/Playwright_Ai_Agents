import { test, expect } from "@playwright/test";

test.describe("Core Shopper Operations", () => {
  test("Sign in with a valid shopper account", async ({ page }) => {
    // 1. Start from a fresh browser context and navigate to https://www.saucedemo.com/.
    await page.goto("https://www.saucedemo.com/");
    await expect(page.getByRole("form", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Username" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();

    // 2. Enter standard_user as the username and secret_sauce as the password, then select Login.
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(
      0,
    );
  });

  test("Reject sign in for a locked-out shopper account", async ({ page }) => {
    // 1. Start from a fresh browser context and navigate to https://www.saucedemo.com/.
    await page.goto("https://www.saucedemo.com/");
    await expect(page.getByRole("form", { name: "Login" })).toBeVisible();

    // 2. Enter locked_out_user with password secret_sauce and select Login.
    await page
      .getByRole("textbox", { name: "Username" })
      .fill("locked_out_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      "locked out",
    );
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await expect(page.locator('[data-test="title"]')).toHaveCount(0);
  });
});
