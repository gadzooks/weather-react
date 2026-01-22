// e2e/pages/summary-table.page.ts
// Page object for SummaryTable component

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SummaryTablePage extends BasePage {
  // Loading state
  readonly loadingIndicator: Locator;
  readonly loadingImage: Locator;
  readonly loadingText: Locator;

  // Error state
  readonly errorContainer: Locator;
  readonly errorMessage: Locator;
  readonly errorImage: Locator;
  readonly retryButton: Locator;

  // Table
  readonly tableWrapper: Locator;
  readonly summaryTable: Locator;
  readonly regionHeaders: Locator;
  readonly locationRows: Locator;

  constructor(page: Page) {
    super(page);

    // Loading selectors
    this.loadingIndicator = page.locator('.loading');
    this.loadingImage = page.locator('.loading img');
    this.loadingText = page.locator('.loading h2');

    // Error selectors
    this.errorContainer = page.locator('.error');
    this.errorMessage = page.locator('.error h2');
    this.errorImage = page.locator('.error-image img');
    this.retryButton = page.locator('.error-retry-button');

    // Table selectors
    this.tableWrapper = page.locator('.table-wrapper');
    this.summaryTable = page.locator('.summary-table');
    this.regionHeaders = page.locator('tr.region-details');
    this.locationRows = page.locator('tr.weather-cell');
  }

  /**
   * Check if loading state is displayed
   */
  async isLoading(): Promise<boolean> {
    return this.loadingIndicator.isVisible();
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete(timeout: number = 30000): Promise<void> {
    // Wait for either table or error to appear
    await Promise.race([
      this.tableWrapper.waitFor({ state: 'visible', timeout }),
      this.errorContainer.waitFor({ state: 'visible', timeout }),
    ]);
  }

  /**
   * Check if error state is displayed
   */
  async isError(): Promise<boolean> {
    return this.errorContainer.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.isError()) {
      return this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Click retry button
   */
  async clickRetry(): Promise<void> {
    await this.retryButton.click();
  }

  /**
   * Check if table is displayed
   */
  async isTableVisible(): Promise<boolean> {
    return this.tableWrapper.isVisible();
  }

  /**
   * Wait for table to be visible
   */
  async waitForTable(timeout: number = 30000): Promise<void> {
    await this.tableWrapper.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get number of regions
   */
  async getRegionCount(): Promise<number> {
    return this.regionHeaders.count();
  }

  /**
   * Get number of locations
   */
  async getLocationCount(): Promise<number> {
    return this.locationRows.count();
  }

  /**
   * Get all region names
   */
  async getRegionNames(): Promise<string[]> {
    const regions: string[] = [];
    const count = await this.regionHeaders.count();
    for (let i = 0; i < count; i++) {
      const text = await this.regionHeaders.nth(i).textContent();
      if (text) regions.push(text.trim());
    }
    return regions;
  }

  /**
   * Get all location names
   */
  async getLocationNames(): Promise<string[]> {
    const locations: string[] = [];
    const count = await this.locationRows.count();
    for (let i = 0; i < count; i++) {
      const nameElement = this.locationRows.nth(i).locator('.location-name');
      const text = await nameElement.textContent();
      if (text) locations.push(text.trim());
    }
    return locations;
  }

  /**
   * Click on a specific location
   */
  async clickLocation(locationName: string): Promise<void> {
    await this.page
      .locator('.location-row', { hasText: locationName })
      .click();
  }

  /**
   * Assert table has expected data
   */
  async assertTableHasData(): Promise<void> {
    await expect(this.tableWrapper).toBeVisible();
    const locationCount = await this.getLocationCount();
    expect(locationCount).toBeGreaterThan(0);
  }

  /**
   * Assert loading state
   */
  async assertLoading(): Promise<void> {
    await expect(this.loadingIndicator.first()).toBeVisible();
    await expect(this.loadingText).toContainText('Weather loading');
  }

  /**
   * Assert error state with retry button
   */
  async assertError(): Promise<void> {
    await expect(this.errorContainer).toBeVisible();
    await expect(this.retryButton).toBeVisible();
    await expect(this.retryButton).toHaveText('Retry');
  }
}
