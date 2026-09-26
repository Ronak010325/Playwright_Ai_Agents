# PIM Employee List Search Test Plan

## Application Overview

Scope: OrangeHRM PIM > Employee List search only. Authenticate with the demo admin account (Admin / admin123), then exercise Employee Name, Employee Id, Employment Status, Include, Supervisor Name, Job Title, and Sub Unit filters and confirm matching employee records are visible in the result table. Shared assumptions: each scenario starts in a fresh browser session on the login page; the demo tenant has representative current and past employees with populated values for the filters under test. Use employee data from the baseline list or approved seeded test data rather than hard-coding names that can change. Do not test Add Employee, Reports, Configuration, editing, or deleting employees.

## Test Scenarios

### 1. PIM Employee List Search

**Seed:** `tests/seed.spec.ts`

#### 1.1. Search Employee List by employee name

**File:** `tests/pim-employee-list/search-by-employee-name.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the OrangeHRM login page. Sign in with Admin / admin123, open PIM, and go to Employee List.
    - expect: Employee Information search filters and the employee result table are displayed.
  2. Identify a current employee in the baseline list. Enter a distinctive part of that employee's name in Employee Name and wait for autocomplete suggestions.
    - expect: Autocomplete suggestions are shown and include the employee matching the entered name.
  3. Select the exact employee suggestion and click Search.
    - expect: The record count and result table update to matching records.
    - expect: The selected employee is visible in a result row with the expected name and employee ID.

#### 1.2. Search Employee List by employee ID

**File:** `tests/pim-employee-list/search-by-employee-id.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List.
    - expect: The Employee List filters and default result rows are displayed.
  2. Copy an exact Employee Id from a baseline result row, enter it in Employee Id, and click Search.
    - expect: A matching result row is visible with the exact entered ID and the same employee name as the baseline row.
    - expect: No row with a different employee ID is returned.

#### 1.3. Search by employment status

**File:** `tests/pim-employee-list/search-by-employment-status.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List.
    - expect: The Employee List filters and baseline records are displayed.
  2. Identify a current employee whose Employment Status is populated. Open Employment Status and select that employee's status from the available options.
    - expect: The selected status is shown in the filter.
  3. Click Search.
    - expect: At least the identified employee is visible in the result table.
    - expect: Every returned row with a populated Employment Status matches the selected status; the result count reflects the filtered records.

#### 1.4. Search using Include employee scope

**File:** `tests/pim-employee-list/search-by-include-scope.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List. Note an employee ID for a current employee and an employee ID for a past employee from approved test data.
    - expect: The Employee List page is displayed and both reference records are available in the demo tenant.
  2. For Current Employees Only, search by the current employee's exact ID and verify the target row. Reset the form between searches.
    - expect: The current employee is visible under Current Employees Only.
  3. For Current and Past Employees, search by the past employee's exact ID.
    - expect: The past employee is visible under Current and Past Employees.
  4. Reset, select Past Employees Only, and search by the past employee's exact ID.
    - expect: The past employee is visible under Past Employees Only and the result rows contain no current employees.

#### 1.5. Search by supervisor name

**File:** `tests/pim-employee-list/search-by-supervisor-name.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List.
    - expect: The Employee List filters and baseline records are displayed.
  2. Identify an employee with a populated Supervisor value. Enter that supervisor's name in Supervisor Name and select the exact autocomplete suggestion.
    - expect: Supervisor autocomplete suggestions appear and the intended supervisor is selected.
  3. Click Search.
    - expect: At least the identified employee is visible in the result table.
    - expect: Every returned record's Supervisor matches the selected supervisor.

#### 1.6. Search by job title

**File:** `tests/pim-employee-list/search-by-job-title.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List.
    - expect: The Employee List filters and baseline records are displayed.
  2. Identify a current employee with a populated Job Title. Select that employee's title in the Job Title dropdown and click Search.
    - expect: At least the identified employee is visible in the result table.
    - expect: Every returned row's Job Title matches the selected title.

#### 1.7. Search by sub unit

**File:** `tests/pim-employee-list/search-by-sub-unit.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List.
    - expect: The Employee List filters and baseline records are displayed.
  2. Identify a current employee with a populated Sub Unit. Select that employee's unit in the Sub Unit dropdown and click Search.
    - expect: At least the identified employee is visible in the result table.
    - expect: Every returned row's Sub Unit matches the selected unit.

#### 1.8. Search with multiple Employee List filters

**File:** `tests/pim-employee-list/search-with-combined-filters.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List.
    - expect: The Employee List filters and baseline records are displayed.
  2. Choose one current employee whose name, ID, employment status, job title, and sub unit are populated. Set two or more corresponding filters to values from that same employee, using exact autocomplete selections where applicable.
    - expect: All chosen filter values correspond to the same reference employee.
  3. Click Search.
    - expect: The reference employee is visible with the expected ID and name.
    - expect: Every returned record satisfies all selected criteria, demonstrating that filters are combined rather than applied independently.

#### 1.9. Search with criteria that match no employee

**File:** `tests/pim-employee-list/search-no-matching-employee.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List.
    - expect: The Employee List filters and baseline records are displayed.
  2. Enter a unique Employee Id confirmed not to exist in the baseline data and click Search.
    - expect: No employee result rows are displayed and the result count is zero or the page shows its empty-results state.
    - expect: No stale baseline rows remain visible.

#### 1.10. Reset Employee List search filters

**File:** `tests/pim-employee-list/reset-search-filters.spec.ts`

**Steps:**
  1. Start from a fresh browser session at the login page, sign in as Admin, and navigate to PIM > Employee List.
    - expect: The Employee List filters and default results are displayed.
  2. Enter a known Employee Id and at least one other filter, then click Search and confirm the list is narrowed.
    - expect: The filters retain their submitted values and matching records are shown.
  3. Click Reset.
    - expect: Text and autocomplete inputs are cleared; Employment Status, Job Title, and Sub Unit return to -- Select --; Include returns to Current Employees Only.
    - expect: The list returns to its default current-employee results and the narrowed criteria are no longer applied.
