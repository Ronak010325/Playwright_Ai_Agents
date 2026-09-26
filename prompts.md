# Playwright Agents Prompts

## Agent 1 - playwright-test-planner

Select the agent:

```
playwright-test-planner
```

#### Prompt 1 : If the Application is Ready
```
Explore the user interfrace of the web application at

URL: "https://www.saucedemo.com/"

Based on your exploration, create a test plan covering 5 core user operations that a typical end user would perform on this ecommerce site.
```

#### Prompt 2 : If the Application is Not Ready but you have BRD
```
Analyze the attached BRD and generate a complete playwright test plan.
```

## Agent 2 - playwright-test-generator

Select the agent:

```
playwright-test-generator
```

#### Prompt 1 : To Generate all scenarios

```
Generate Playwright tests for all the scenarios provided in the test plan.
```

#### Prompt 2 : To Generate specific scenario

```
Generate Playwright tests for scenario 1.1 provided in the test plan using the playwright-test-generator agent.
```

#### Prompt 3 : To Generate scenario in POM(Page Object Model)

```
Generate Playwright tests for all the scenarios provided in the test plan.

Requirements:

Generate Playwright tests for all the test scenarios provided in the test
plan.

Requirements:

    - Use TypeScript.
    - Follow the Page Object Model (POM) design pattern.
    - Create a separate Page Object class for each application page.
    - Keep page locators and reusable page actions inside the Page Object classes.
    - Keep test assertions and business scenarios inside the test (.spec.ts) files.
    - Use Playwright's built-in locators (getByRole, getByLabel, getByText, getByPlaceholder, etc.) whenever possible.
    - Avoid XPath unless absolutely necessary.
    - Write clean, readable, and maintainable code.
    - Organize the generated files using the following structure:

pages/
    LoginPage.ts

tests/
    login.spec.ts

    - Reuse Page Object methods across multiple tests.
    - Generate meaningful method names and comments where appropriate.
    - Follow Playwright and TypeScript best practices.
```

## Agent 3 - playwright-test-healer

Select the agent:

```
playwright-test-healer
```

#### Prompt 1 : To Heal The Test File

```
Run all the tests untill every test passes.
```