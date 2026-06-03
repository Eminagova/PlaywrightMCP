import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = '[data-test="username"]';
  private readonly passwordInput = '[data-test="password"]';
  private readonly loginButton = '[data-test="login-button"]';
  private readonly errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getElementText(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.loginButton);
  }
}
