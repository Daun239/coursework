import { test, expect } from "@playwright/test";

test("should show valid form", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("textbox", { name: "/email/i" })).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "/password/i" }),
  ).toBeVisible();
});

test("should login correctly", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("textbox", { name: "/email/i" })
    .fill("Richard_OKeefe@yahoo.com");
  await page.getByRole("textbox", { name: "/password/i" }).fill("HuNHUWcGjZ");
  await page.getByRole("button", { name: "/login/i" }).click();
  await expect(page).toHaveURL("movies");
});

test("should show error with invalid credentials", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: '/email/i' }).fill("wrong@test.com");
  await page.getByRole("textbox", { name: '/password/i' }).fill("wrongpass");
  await page.getByRole("button", { name: '/login/i' }).click();
  await expect(page.getByText('/invalid/i')).toBeVisible();
});
