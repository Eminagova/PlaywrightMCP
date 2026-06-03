import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  private readonly checkoutOverviewContainer = '[data-test="checkout-summary-container"]';
  private readonly paymentInfoLabel = '[data-test="payment-info-label"]';
  private readonly paymentInfoValue = '[data-test="payment-info-value"]';
  private readonly shippingInfoLabel = '[data-test="shipping-info-label"]';
  private readonly shippingInfoValue = '[data-test="shipping-info-value"]';
  private readonly totalLabel = '[data-test="total-label"]';
  private readonly totalValue = '.summary_total_label';
  private readonly finishButton = '[data-test="finish"]';

  constructor(page: Page) {
    super(page);
  }

  async isCheckoutOverviewPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.checkoutOverviewContainer);
  }

  async isPaymentInfoVisible(): Promise<boolean> {
    return await this.isElementVisible(this.paymentInfoLabel);
  }

  async isShippingInfoVisible(): Promise<boolean> {
    return await this.isElementVisible(this.shippingInfoLabel);
  }

  async isPriceTotalVisible(): Promise<boolean> {
    return await this.isElementVisible(this.totalLabel);
  }

  async getTotalPrice(): Promise<string> {
    return await this.getElementText(this.totalValue);
  }

  async clickFinish(): Promise<void> {
    await this.page.click(this.finishButton);
  }
}
