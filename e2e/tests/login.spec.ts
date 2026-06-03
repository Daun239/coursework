import { test, expect } from "@playwright/test";

test("should show valid form", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("textbox", { name: /Електронна пошта/i })).toBeVisible();
  await expect(page.getByRole("textbox", { name: /Пароль/i })).toBeVisible();
});

test("should login correctly", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("textbox", { name: /Електронна пошта/i }).fill("Richard_OKeefe@yahoo.com");
  await page.getByRole("textbox", { name: /Пароль/i }).fill("HuNHUWcGjZ");
  await page.getByRole("button", { name: /Увійти/i }).click();
  await expect(page).toHaveURL(/deliveryOrders/);
});

test("should show error with no credentials", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: /Електронна пошта/i }).fill("");
  await page.getByRole("textbox", { name: /Пароль/i }).fill("");
  await page.getByRole("button", { name: /Увійти/i }).click();
  await expect(page.getByText(/Будь ласка, введіть електронну пошту та пароль/i)).toBeVisible();
});



test("should show error with invalid credentials", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: /Електронна пошта/i }).fill("wrong@test.com");
  await page.getByRole("textbox", { name: /Пароль/i }).fill("wrongpass");
  await page.getByRole("button", { name: /Увійти/i }).click();
  await expect(page.getByText(/Невірний логін або пароль. Спробуйте ще раз/i)).toBeVisible();
});