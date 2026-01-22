// e2e/pages/offline-banner.page.ts
// Page object for OfflineStatusBanner component

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class OfflineBannerPage extends BasePage {
  // Banner container
  readonly banner: Locator;
  readonly bannerContent: Locator;

  // Banner elements
  readonly bannerIcon: Locator;
  readonly bannerText: Locator;
  readonly bannerTitle: Locator;
  readonly bannerSubtitle: Locator;
  readonly staleWarning: Locator;

  // Buttons
  readonly refreshButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);

    // Banner selectors
    this.banner = page.locator('.offline-banner');
    this.bannerContent = page.locator('.offline-banner__content');
    this.bannerIcon = page.locator('.offline-banner__icon');
    this.bannerText = page.locator('.offline-banner__text');
    this.bannerTitle = page.locator('.offline-banner__text strong');
    this.bannerSubtitle = page.locator('.offline-banner__text span').first();
    this.staleWarning = page.locator('.stale-warning');

    // Button selectors
    this.refreshButton = page.locator('.offline-banner__refresh');
    this.closeButton = page.locator('.offline-banner__close');
  }

  /**
   * Check if banner is visible
   */
  async isVisible(): Promise<boolean> {
    return this.banner.isVisible();
  }

  /**
   * Wait for banner to appear
   */
  async waitForBanner(timeout: number = 10000): Promise<void> {
    await this.banner.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for banner to disappear
   */
  async waitForBannerHidden(timeout: number = 10000): Promise<void> {
    await this.banner.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Get banner type (offline, stale, cached)
   */
  async getBannerType(): Promise<'offline' | 'stale' | 'cached' | null> {
    if (!(await this.isVisible())) return null;

    const classes = await this.banner.getAttribute('class');
    if (classes?.includes('offline')) return 'offline';
    if (classes?.includes('stale')) return 'stale';
    if (classes?.includes('cached')) return 'cached';
    return null;
  }

  /**
   * Get banner title text
   */
  async getTitle(): Promise<string | null> {
    if (!(await this.isVisible())) return null;
    return this.bannerTitle.textContent();
  }

  /**
   * Get banner subtitle/age text
   */
  async getSubtitle(): Promise<string | null> {
    if (!(await this.isVisible())) return null;
    return this.bannerSubtitle.textContent();
  }

  /**
   * Check if stale warning is shown
   */
  async hasStaleWarning(): Promise<boolean> {
    return this.staleWarning.isVisible();
  }

  /**
   * Get banner icon
   */
  async getIcon(): Promise<string | null> {
    if (!(await this.isVisible())) return null;
    return this.bannerIcon.textContent();
  }

  /**
   * Click refresh button
   */
  async clickRefresh(): Promise<void> {
    await this.refreshButton.click();
  }

  /**
   * Click close button to dismiss
   */
  async clickClose(): Promise<void> {
    await this.closeButton.click();
  }

  /**
   * Assert banner shows offline mode
   */
  async assertOfflineMode(): Promise<void> {
    await expect(this.banner).toBeVisible();
    await expect(this.banner).toHaveClass(/offline/);
    await expect(this.bannerTitle).toHaveText('Offline Mode');
    await expect(this.bannerIcon).toContainText('📡');
  }

  /**
   * Assert banner shows cached data
   */
  async assertCachedMode(): Promise<void> {
    await expect(this.banner).toBeVisible();
    await expect(this.banner).toHaveClass(/cached/);
    await expect(this.bannerTitle).toHaveText('Cached Data');
    await expect(this.bannerIcon).toContainText('💾');
  }

  /**
   * Assert banner shows stale data
   */
  async assertStaleMode(): Promise<void> {
    await expect(this.banner).toBeVisible();
    await expect(this.banner).toHaveClass(/stale/);
    await expect(this.staleWarning).toBeVisible();
    await expect(this.staleWarning).toContainText('Data may be outdated');
  }

  /**
   * Assert banner is not visible
   */
  async assertHidden(): Promise<void> {
    await expect(this.banner).not.toBeVisible();
  }

  /**
   * Assert refresh button has correct label
   */
  async assertRefreshButton(): Promise<void> {
    await expect(this.refreshButton).toBeVisible();
    await expect(this.refreshButton).toContainText('Refresh');
    await expect(this.refreshButton).toHaveAttribute('aria-label', 'Refresh forecast data');
  }

  /**
   * Assert close button has correct label
   */
  async assertCloseButton(): Promise<void> {
    await expect(this.closeButton).toBeVisible();
    await expect(this.closeButton).toHaveAttribute('aria-label', 'Close banner');
  }

  /**
   * Assert banner accessibility
   */
  async assertAccessibility(): Promise<void> {
    await this.assertRefreshButton();
    await this.assertCloseButton();
  }
}
