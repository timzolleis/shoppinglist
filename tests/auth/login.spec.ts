import { expect, test } from '@playwright/test';
import { LoginPage } from './loginPage';


test('has login input fields', async ({ page }) => {
  const loginPage = new LoginPage();
  await page.goto(loginPage.url);
  await expect(page.getByLabel('Password')).toBeVisible();

});