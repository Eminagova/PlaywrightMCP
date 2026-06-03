import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  async waitForElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector);
  }

  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async getElementText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() ?? '';
  }
}
