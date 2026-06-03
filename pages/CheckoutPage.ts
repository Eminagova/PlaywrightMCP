import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly firstNameInput = '[data-test="firstName"]';
  private readonly lastNameInput = '[data-test="lastName"]';
  private readonly postalCodeInput = '[data-test="postalCode"]';
  private readonly continueButton = '[data-test="continue"]';
  private readonly checkoutContainer = '[data-test="checkout-info-container"]';

  constructor(page: Page) {
    super(page);
  }

  async isCheckoutPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.checkoutContainer);
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.postalCodeInput, postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.page.click(this.continueButton);
  }

  async completeCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.clickContinue();
  }
}
