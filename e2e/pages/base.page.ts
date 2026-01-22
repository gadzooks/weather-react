// e2e/pages/base.page.ts
// Base page object with common utilities

import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the application
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Wait for initial page load
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    const count = await element.count();
    return count > 0;
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Get text content of element
   */
  async getText(selector: string): Promise<string | null> {
    return this.page.locator(selector).textContent();
  }

  /**
   * Click element
   */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Simulate going offline
   */
  async goOffline(): Promise<void> {
    await this.page.context().setOffline(true);
  }

  /**
   * Simulate coming back online
   */
  async goOnline(): Promise<void> {
    await this.page.context().setOffline(false);
  }

  /**
   * Get console logs
   */
  async getConsoleLogs(): Promise<string[]> {
    const logs: string[] = [];
    this.page.on('console', (msg) => {
      logs.push(msg.text());
    });
    return logs;
  }

  /**
   * Wait for specific console message
   */
  async waitForConsoleMessage(
    pattern: string | RegExp,
    timeout: number = 10000,
  ): Promise<void> {
    await this.page.waitForEvent('console', {
      predicate: (msg) => {
        const text = msg.text();
        if (typeof pattern === 'string') {
          return text.includes(pattern);
        }
        return pattern.test(text);
      },
      timeout,
    });
  }

  /**
   * Reload the page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Take screenshot
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `./playwright-report/${name}.png` });
  }
}
