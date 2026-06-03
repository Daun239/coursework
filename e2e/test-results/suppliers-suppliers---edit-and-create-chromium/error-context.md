# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: suppliers.spec.ts >> suppliers - edit and create
- Location: tests\suppliers.spec.ts:7:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByTestId('supplier-card')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByTestId('supplier-card')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - paragraph [ref=e5]: The Panorama
      - link "Delivery Orders" [ref=e6] [cursor=pointer]:
        - /url: /deliveryOrders
      - link "Products" [ref=e7] [cursor=pointer]:
        - /url: /products
      - link "Clients" [ref=e8] [cursor=pointer]:
        - /url: /clientsPage
      - link "Suppliers" [ref=e9] [cursor=pointer]:
        - /url: /suppliersPage
      - link "Employees" [ref=e10] [cursor=pointer]:
        - /url: /employeesPage
      - link "Cinemas" [ref=e11] [cursor=pointer]:
        - /url: /cinemasPage
    - generic [ref=e12]:
      - generic [ref=e13] [cursor=pointer]:
        - checkbox [checked]
        - img [ref=e14]
        - img [ref=e16]
      - generic [ref=e18]:
        - button "EN" [ref=e19] [cursor=pointer]
        - button "UA" [ref=e20] [cursor=pointer]
      - generic [ref=e21]:
        - generic [ref=e22] [cursor=pointer]: LW
        - generic [ref=e23]: Manager
      - button [ref=e24] [cursor=pointer]:
        - img [ref=e25]
  - generic [ref=e28]:
    - generic [ref=e31]:
      - heading "Suppliers Found 1" [level=2] [ref=e32]
      - generic [ref=e33]:
        - img [ref=e34]
        - searchbox [active] [ref=e38]: elissa
      - generic [ref=e39]:
        - generic [ref=e40]: Items per page
        - combobox [ref=e41]:
          - option "5"
          - option "10"
          - option "20"
          - option "50" [selected]
          - option "100"
          - option "250"
      - generic [ref=e43]:
        - button "<" [disabled]
        - generic [ref=e44]:
          - text: Page
          - spinbutton [ref=e45]: "1"
          - generic [ref=e46]: of1
        - button ">" [disabled]
    - generic [ref=e47]:
      - generic [ref=e48]:
        - button "Hide Filters" [ref=e49] [cursor=pointer]:
          - img [ref=e50]
          - text: Hide Filters
        - button "Add" [ref=e52]
        - heading "Suppliers" [level=2] [ref=e53]
      - generic [ref=e54]:
        - generic [ref=e56]:
          - generic [ref=e57]:
            - button [ref=e58]:
              - img [ref=e59]
            - button [ref=e61] [cursor=pointer]:
              - img [ref=e62]
          - img [ref=e65]
          - generic [ref=e67]: Elissa Murray
          - generic [ref=e68]:
            - img [ref=e69]
            - text: 666-954-2707 x39460
          - generic [ref=e70]:
            - img [ref=e71]
            - text: Enrico99@gmail.com
        - generic [ref=e73]:
          - button "<" [disabled]
          - generic [ref=e74]:
            - text: Page
            - spinbutton [ref=e75]: "1"
            - generic [ref=e76]: of1
          - button ">" [disabled]
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.use({
  4  |   storageState: "auth.json",
  5  | });
  6  | 
  7  | test("suppliers - edit and create", async ({ page }) => {
  8  |   await page.goto("https://brave-mud-09dfae60f.7.azurestaticapps.net/");
  9  |   await page.getByRole("link", { name: "Suppliers" }).click();
  10 | 
  11 |   // Редагування існуючого
  12 |   await page.getByRole("button").filter({ hasText: /^$/ }).nth(1).click();
  13 |   await page.locator('input[name="name"]').fill("TestName");
  14 |   await page.getByRole("button", { name: "Save" }).click();
  15 |   expect(page.getByText("TestName"));
  16 | 
  17 |   // Пошук
  18 |   await page.getByPlaceholder("Search suppliers...").click();
  19 |   await page
  20 |     .getByPlaceholder("Search suppliers...")
  21 |     .pressSequentially("elissa", { delay: 100 });
  22 | 
  23 |   // Зачекай поки фільтр спрацює
  24 |   await page.waitForTimeout(500);
> 25 |   await expect(page.getByTestId("supplier-card")).toHaveCount(1);
     |                                                   ^ Error: expect(locator).toHaveCount(expected) failed
  26 | 
  27 |   await page.getByPlaceholder("Search suppliers...").fill("");
  28 |   await expect(page.getByTestId("supplier-card")).toHaveCount(0);
  29 | 
  30 |   // Створення нового
  31 |   await page.getByRole("button", { name: "Add" }).click();
  32 |   await page.locator('input[name="name"]').fill("John");
  33 |   await page.locator('input[name="surname"]').fill("Kramer");
  34 |   await page.locator('input[name="email"]').fill("whatver@gmail.com");
  35 |   await page.locator('input[name="cellNumber"]').fill("+380123341");
  36 |   await page.getByRole("button", { name: "Create Supplier" }).click();
  37 |   await expect(page.getByText("John Kramer", { exact: false })).toBeVisible();
  38 | });
  39 | 
```