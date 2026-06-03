import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import users from '../data/users.json';

const BASE_URL = 'https://www.saucedemo.com/';
const LOCKED_OUT_ERROR = 'Epic sadface: Sorry, this user has been locked out.';

test.describe('SauceDemo Login Tests - Data-Driven Approach', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate(BASE_URL);
  });

  // Test each user individually
  users.forEach((user) => {
    test(`Login with ${user.username} - ${user.description}`, async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);

      // Perform login
      await loginPage.login(user.username, user.password);

      // Validate based on expected behavior
      if (user.expectedBehavior === 'locked_out_error') {
        // Negative scenario: locked_out_user
        await expect(page).toHaveURL(BASE_URL);
        expect(await loginPage.isErrorMessageVisible()).toBe(true);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface');
        expect(errorMessage).toContain('locked out');
      } else if (user.expectedBehavior.includes('successful_login')) {
        // Positive scenarios: all other successful users
        await expect(page).toHaveURL(/.*inventory/);
        expect(await inventoryPage.isInventoryPageDisplayed()).toBe(true);
        
        // Verify products are loaded
        const productCount = await inventoryPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);
      }
    });
  });

  // Grouped test for all positive scenarios
  test('Login test - All positive users successfully access inventory', async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    const positiveUsers = users.filter(user => user.scenario === 'positive');

    for (const user of positiveUsers) {
      // Navigate back to login page
      await loginPage.navigate(BASE_URL);

      // Perform login
      await loginPage.login(user.username, user.password);

      // Verify successful login
      await expect(page).toHaveURL(/.*inventory/);
      expect(await inventoryPage.isInventoryPageDisplayed()).toBe(true);

      // Verify products are loaded
      const productCount = await inventoryPage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
    }
  });

  // Grouped test for negative scenario
  test('Login test - Negative scenario with locked_out_user', async ({ page }) => {
    loginPage = new LoginPage(page);

    const lockedOutUser = users.find(user => user.username === 'locked_out_user');
    expect(lockedOutUser).toBeDefined();

    if (lockedOutUser) {
      // Perform login
      await loginPage.login(lockedOutUser.username, lockedOutUser.password);

      // Verify error message is displayed
      await expect(page).toHaveURL(BASE_URL);
      expect(await loginPage.isErrorMessageVisible()).toBe(true);
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('locked out');
    }
  });
});
