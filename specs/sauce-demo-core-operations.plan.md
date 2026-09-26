# SauceDemo Core Shopper Operations Test Plan

## Application Overview

Test plan for five core end-user operations on SauceDemo: sign in, browse and inspect products, manage the cart, validate checkout information, and complete a purchase. Tests use the standard_user demo account (password: secret_sauce) and should start from a fresh browser context with an empty cart. Product prices and tax below reflect the observed demo catalog state.

## Test Scenarios

### 1. Core Shopper Operations

**Seed:** `tests/seed.spec.ts`

#### 1.1. Sign in with a valid shopper account

**File:** `tests/sauce-demo/sign-in.spec.ts`

**Steps:**
  1. Start from a fresh browser context and navigate to https://www.saucedemo.com/.
    - expect: The Swag Labs login form is displayed with Username, Password, and Login controls.
  2. Enter standard_user as the username and secret_sauce as the password, then select Login.
    - expect: Navigation succeeds to /inventory.html.
    - expect: The Products catalog is displayed and the shopping cart is empty.
  3. In a separate fresh run, enter locked_out_user with password secret_sauce and select Login.
    - expect: Sign-in is rejected with a visible locked-out error.
    - expect: The user remains on the login page and is not shown the product catalog.

#### 1.2. Browse, sort, and inspect a product

**File:** `tests/sauce-demo/browse-products.spec.ts`

**Steps:**
  1. Sign in as standard_user from a fresh browser context.
    - expect: The Products page shows six products and a Sort products selector.
  2. Select Price (low to high) in Sort products.
    - expect: Products reorder from lowest to highest displayed price; Sauce Labs Onesie ($7.99) appears before Sauce Labs Bike Light ($9.99), and Sauce Labs Fleece Jacket ($49.99) appears last.
  3. Open View details for Sauce Labs Backpack.
    - expect: The product detail view shows the Sauce Labs Backpack name, description, and $29.99 price.
    - expect: An Add to cart control and a return-to-products control are available.
  4. Return to the Products catalog.
    - expect: The catalog is displayed again and product browsing can continue.

#### 1.3. Add and remove items in the shopping cart

**File:** `tests/sauce-demo/manage-cart.spec.ts`

**Steps:**
  1. Sign in as standard_user from a fresh browser context.
    - expect: The Products catalog is displayed with an empty cart.
  2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart.
    - expect: Each product's button changes to Remove.
    - expect: The cart badge displays 2.
  3. Open the cart.
    - expect: Your Cart lists exactly Sauce Labs Backpack and Sauce Labs Bike Light, each with quantity 1.
    - expect: Continue Shopping and Checkout controls are available.
  4. Remove Sauce Labs Bike Light from the cart.
    - expect: The Bike Light row is removed and the cart badge decreases to 1.
    - expect: The Backpack remains in the cart with quantity 1.
  5. Select Continue Shopping, then open the cart again.
    - expect: The catalog is displayed after Continue Shopping.
    - expect: The cart still contains only the Backpack.

#### 1.4. Validate required checkout information

**File:** `tests/sauce-demo/checkout-validation.spec.ts`

**Steps:**
  1. Sign in as standard_user, add Sauce Labs Backpack, open the cart, and select Checkout.
    - expect: Checkout: Your Information is displayed with First Name, Last Name, and Zip/Postal Code fields.
  2. Leave all fields blank and select Continue.
    - expect: The page remains on Checkout: Your Information.
    - expect: A visible validation error states Error: First Name is required.
  3. Enter Avery in First Name and Morgan in Last Name, leave Zip/Postal Code blank, and select Continue.
    - expect: The page remains on Checkout: Your Information.
    - expect: A visible validation error states Error: Postal Code is required.
  4. Select Cancel.
    - expect: The checkout flow is cancelled and the cart page is displayed.

#### 1.5. Complete a purchase and verify the order

**File:** `tests/sauce-demo/complete-purchase.spec.ts`

**Steps:**
  1. Sign in as standard_user from a fresh browser context and add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99). Open the cart and select Checkout.
    - expect: The cart contains exactly the two selected products, each at quantity 1.
    - expect: Checkout: Your Information is displayed.
  2. Enter Avery as First Name, Morgan as Last Name, and 10001 as Zip/Postal Code; select Continue.
    - expect: Checkout: Overview lists the Backpack and Bike Light, each at quantity 1.
    - expect: Item total is $39.98, tax is $3.20, and total is $43.18.
  3. Select Finish.
    - expect: Checkout: Complete! is displayed with the Thank you for your order! confirmation.
    - expect: The cart is empty.
    - expect: A Back Home control is available.
  4. Select Back Home.
    - expect: The Products catalog is displayed and the cart remains empty.
