import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartContainer = '[data-test="cart-contents-container"]';
  private readonly cartItem = '.cart_item';
  private readonly inventoryItemName = '.inventory_item_name';
  private readonly checkoutButton = '[data-test="checkout"]';

  constructor(page: Page) {
    super(page);
  }

  async isCartPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.cartContainer);
  }

  async getCartItemCount(): Promise<number> {
    await this.waitForElement(this.cartItem);
    const items = await this.page.locator(this.cartItem).count();
    return items;
  }

  async getCartItemName(itemIndex: number = 0): Promise<string> {
    const itemName = this.page.locator(this.cartItem).nth(itemIndex).locator(this.inventoryItemName);
    return await itemName.textContent() ?? '';
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.click(this.checkoutButton);
  }

  async getAllCartItemNames(): Promise<string[]> {
    const items = this.page.locator(this.cartItem);
    const count = await items.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await items.nth(i).locator(this.inventoryItemName).textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    return names;
  }
}
