import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly inventoryContainer = '[data-test="inventory-container"]';
  private readonly inventoryList = '.inventory_list';
  private readonly inventoryItem = '.inventory_item';
  private readonly cartBadge = '[data-test="shopping-cart-badge"]';
  private readonly cartLink = '[data-test="shopping-cart-link"]';
  private readonly hamburgerMenuButton = '#react-burger-menu-btn';
  private readonly logoutLink = '#logout_sidebar_link';

  constructor(page: Page) {
    super(page);
  }

  async isInventoryPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.inventoryContainer);
  }

  async getProductCount(): Promise<number> {
    await this.waitForElement(this.inventoryItem);
    const items = await this.page.locator(this.inventoryItem).count();
    return items;
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async addProductToCart(productIndex: number = 0): Promise<void> {
    const addButtons = this.page.locator('button.btn_primary:has-text("Add to cart")');
    await addButtons.nth(productIndex).click();
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.getElementText(this.cartBadge);
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cartBadge);
  }

  async goToCart(): Promise<void> {
    await this.page.click(this.cartLink);
  }

  async openMenu(): Promise<void> {
    const menuButton = this.page.locator(this.hamburgerMenuButton);
    // Check if menu is already open, if not open it
    const isOpen = await this.page.locator('.bm-menu-wrap[aria-hidden="false"]').isVisible().catch(() => false);
    if (!isOpen) {
      await menuButton.click({ force: true });
      await this.page.waitForTimeout(800); // Wait for menu animation
    }
  }

  async logout(): Promise<void> {
    await this.openMenu();
    // Use data-test attribute instead of ID for better reliability
    const logoutButton = this.page.locator('[data-test="logout-sidebar-link"]');
    await logoutButton.click({ force: true });
  }

  async getFirstProductName(): Promise<string> {
    const firstProduct = this.page.locator('.inventory_item_name').first();
    return await firstProduct.textContent() ?? '';
  }
}
