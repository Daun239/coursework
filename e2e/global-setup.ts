import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ path: '../Frontend/.env' });

async function login(email: string, password: string, path: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://brave-mud-09dfae60f.7.azurestaticapps.net/login');
  await page.getByRole('textbox', { name: 'Електронна пошта' }).fill(email);
  await page.getByRole('textbox', { name: 'Пароль' }).fill(password);
  await page.getByRole('button', { name: 'Увійти' }).click();
  await page.context().storageState({ path });
  await browser.close();
}

export default async function globalSetup() {
  await login(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!, 'auth/admin.json');
  await login(process.env.MANAGER_EMAIL!, process.env.MANAGER_PASSWORD!, 'auth/manager.json');
  await login(process.env.CASHIER_EMAIL!, process.env.CASHIER_PASSWORD!, 'auth/cashier.json');
  await login(process.env.WAREHOUSE_WORKER_EMAIL!, process.env.WAREHOUSE_WORKER_PASSWORD!, 'auth/warehouse-worker.json');
}