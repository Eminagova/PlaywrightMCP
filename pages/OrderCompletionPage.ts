import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderCompletionPage extends BasePage {
  private readonly checkoutCompleteContainer = '[data-test="checkout-complete-container"]';
  private readonly successTitle = '[data-test="complete-header"]';
  private readonly successMessage = '[data-test="complete-text"]';
  private readonly backHomeButton = '[data-test="back-to-products"]';
  private readonly ponyImage = '.pony_express';

  constructor(page: Page) {
    super(page);
  }

  async isOrderCompletionPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.checkoutCompleteContainer);
  }

  async getSuccessTitle(): Promise<string> {
    return await this.getElementText(this.successTitle);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getElementText(this.successMessage);
  }

  async isTitleVisible(): Promise<boolean> {
    return await this.isElementVisible(this.successTitle);
  }

  async isMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  async isPonyImageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.ponyImage);
  }

  async goBackToHome(): Promise<void> {
    await this.page.click(this.backHomeButton);
  }
}
