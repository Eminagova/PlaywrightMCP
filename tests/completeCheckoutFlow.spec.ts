import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { OrderCompletionPage } from '../pages/OrderCompletionPage';

const BASE_URL = 'https://www.saucedemo.com/';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Complete E2E Checkout Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let orderCompletionPage: OrderCompletionPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    orderCompletionPage = new OrderCompletionPage(page);
  });

  test('Complete purchase flow: Login -> Add to Cart -> Checkout -> Verify Order', async ({ page }) => {
    // Step 1: Navigate to SauceDemo application
    console.log('Step 1: Navigating to SauceDemo application');
    await loginPage.navigate(BASE_URL);
    expect(await loginPage.isLoginPageDisplayed()).toBe(true);
    console.log('✓ Login page displayed successfully');

    // Step 2: Log in with standard user
    console.log('\nStep 2: Logging in with standard user');
    await loginPage.login(STANDARD_USER, PASSWORD);
    console.log('✓ Login credentials submitted');

    // Step 3: Validate that login is successful
    console.log('\nStep 3: Validating successful login');
    await expect(page).toHaveURL(/.*inventory/);
    expect(await inventoryPage.isInventoryPageDisplayed()).toBe(true);
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    console.log(`✓ Login successful! ${productCount} products loaded on inventory page`);

    // Step 4: Add a product to the cart
    console.log('\nStep 4: Adding first product to cart');
    const selectedProduct = await inventoryPage.getFirstProductName();
    console.log(`✓ Selected product: ${selectedProduct}`);
    await inventoryPage.addProductToCart(0);
    console.log('✓ Add to cart button clicked');

    // Step 5: Validate that the selected product has been added to the cart
    console.log('\nStep 5: Validating product added to cart');
    const cartBadgeVisible = await inventoryPage.isCartBadgeVisible();
    expect(cartBadgeVisible).toBe(true);
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toBe('1');
    console.log(`✓ Cart badge displays correct count: ${cartCount}`);

    // Step 6: Proceed to Checkout
    console.log('\nStep 6: Navigating to cart');
    await inventoryPage.goToCart();
    expect(await cartPage.isCartPageDisplayed()).toBe(true);
    console.log('✓ Cart page displayed');

    // Verify product in cart
    console.log('\nVerifying product in cart');
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
    const cartItemName = await cartPage.getCartItemName(0);
    expect(cartItemName).toBe(selectedProduct);
    console.log(`✓ Product confirmed in cart: ${cartItemName}`);

    // Step 7: Proceed to checkout information page
    console.log('\nStep 7: Proceeding to checkout');
    await cartPage.proceedToCheckout();
    expect(await checkoutPage.isCheckoutPageDisplayed()).toBe(true);
    console.log('✓ Checkout information page displayed');

    // Step 8: Fill in checkout information
    console.log('\nStep 8: Filling checkout information');
    const firstName = 'John';
    const lastName = 'Doe';
    const postalCode = '12345';
    await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);
    console.log(`✓ Entered: First Name: ${firstName}, Last Name: ${lastName}, Postal Code: ${postalCode}`);

    // Step 9: Click Continue
    console.log('\nStep 9: Clicking Continue button');
    await checkoutPage.clickContinue();
    expect(await checkoutOverviewPage.isCheckoutOverviewPageDisplayed()).toBe(true);
    console.log('✓ Checkout overview page displayed');

    // Step 10: Verify payment, shipping, and price information
    console.log('\nStep 10: Verifying payment, shipping, and price information');
    expect(await checkoutOverviewPage.isPaymentInfoVisible()).toBe(true);
    console.log('✓ Payment information is visible');

    expect(await checkoutOverviewPage.isShippingInfoVisible()).toBe(true);
    console.log('✓ Shipping information is visible');

    expect(await checkoutOverviewPage.isPriceTotalVisible()).toBe(true);
    const totalPrice = await checkoutOverviewPage.getTotalPrice();
    expect(totalPrice).toBeTruthy();
    console.log(`✓ Price total is visible: ${totalPrice}`);

    // Step 11: Click Finish to complete the order
    console.log('\nStep 11: Clicking Finish button to complete order');
    await checkoutOverviewPage.clickFinish();
    expect(await orderCompletionPage.isOrderCompletionPageDisplayed()).toBe(true);
    console.log('✓ Order completion page displayed');

    // Step 12: Verify success messages
    console.log('\nStep 12: Verifying success messages');
    expect(await orderCompletionPage.isTitleVisible()).toBe(true);
    const successTitle = await orderCompletionPage.getSuccessTitle();
    expect(successTitle).toBeTruthy();
    console.log(`✓ Success title: "${successTitle}"`);

    expect(await orderCompletionPage.isMessageVisible()).toBe(true);
    const successMessage = await orderCompletionPage.getSuccessMessage();
    expect(successMessage).toBeTruthy();
    console.log(`✓ Success message: "${successMessage}"`);

    expect(await orderCompletionPage.isPonyImageVisible()).toBe(true);
    console.log('✓ Pony express image is visible');

    // Step 13: Go back to home page
    console.log('\nStep 13: Going back to home page');
    await orderCompletionPage.goBackToHome();
    console.log('✓ Back to home button clicked');

    // Step 14: Verify that the user is returned to the home page
    console.log('\nStep 14: Verifying return to home page');
    await expect(page).toHaveURL(/.*inventory/);
    expect(await inventoryPage.isInventoryPageDisplayed()).toBe(true);
    console.log('✓ User successfully returned to inventory/home page');

    // Step 15: Open application menu and Sign out
    console.log('\nStep 15: Opening menu and signing out');
    await inventoryPage.openMenu();
    await inventoryPage.logout();
    console.log('✓ Logout action executed');

    // Step 16: Verify that the user is redirected to login page
    console.log('\nStep 16: Verifying redirect to login page');
    await expect(page).toHaveURL(BASE_URL);
    expect(await loginPage.isLoginPageDisplayed()).toBe(true);
    console.log('✓ User successfully redirected to login page');

    console.log('\n✅ Complete E2E checkout flow test passed successfully!');
  });
});
