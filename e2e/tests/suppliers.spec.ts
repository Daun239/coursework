import { test, expect } from "@playwright/test";

test.use({
  storageState: "auth.json",
});

test("suppliers - edit", async ({ page }) => {
  await page.goto("https://brave-mud-09dfae60f.7.azurestaticapps.net/");
  await page.getByRole("link", { name: "Suppliers" }).click();

  // Редагування існуючого
  await page.getByRole("button").filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('input[name="name"]').fill("TestName");
  await page.getByRole("button", { name: "Save" }).click();
  expect(page.getByText("TestName"));

  // Пошук
  await page.getByPlaceholder("Search suppliers...").click();
  await page
    .getByPlaceholder("Search suppliers...")
    .pressSequentially("elissa", { delay: 100 });

  // Зачекай поки фільтр спрацює
  // await page.waitForTimeout(1000);
  await expect(page.getByTestId("supplier-card")).toHaveCount(1);

  await page.getByPlaceholder("Search suppliers...").fill("qweqweqweqweqwe");
  await expect(page.getByTestId("supplier-card")).toHaveCount(0);
});

test("suppliers - create", async ({ page }) => {
  await page.goto("https://brave-mud-09dfae60f.7.azurestaticapps.net/");
  await page.getByRole("link", { name: "Suppliers" }).click();

  // Створення нового
  await page.getByPlaceholder("Search suppliers...").click();
  await page.getByRole("button", { name: "Add" }).click();
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill("John");
  await page.locator('input[name="surname"]').click();
  await page.locator('input[name="surname"]').fill("Kramer");
  await page.locator('input[name="email"]').click();
  await page.locator('input[name="email"]').fill("whatver@gmail.com");
  await page.locator('input[name="cellNumber"]').click();
  await page.locator('input[name="cellNumber"]').fill("+380qwe123");
  await page.getByRole("button", { name: "Create Supplier" }).click();
  await expect(page.getByText("John Kramer", { exact: false })).toBeVisible();

  // Cleanup — знайти і видалити
  await page.getByPlaceholder("Search suppliers...").click();
  await page.getByPlaceholder("Search suppliers...").fill("john");
  await page.getByRole("button").filter({ hasText: /^$/ }).nth(2).click();
  await page.getByRole("button", { name: "Delete" }).click();
});