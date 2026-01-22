// e2e/tests/data-loading.spec.ts
// Tests for initial data loading, 2-phase loading, and error handling

import { test, expect } from '@playwright/test';
import { SummaryTablePage } from '../pages/summary-table.page';
import { OfflineBannerPage } from '../pages/offline-banner.page';
import {
  mockApiSuccess,
  mockApiError,
  mockApiSlow,
} from '../utils/api-mocks';
import {
  seedFreshCache,
  cacheExists,
  getCache,
} from '../utils/cache-helpers';

test.describe('Data Loading', () => {
  let summaryTable: SummaryTablePage;
  let offlineBanner: OfflineBannerPage;

  test.beforeEach(async ({ page }) => {
    summaryTable = new SummaryTablePage(page);
    offlineBanner = new OfflineBannerPage(page);
  });

  test.describe('Initial Load (No Cache)', () => {
    test('should show loading state while fetching data', async ({ page }) => {
      // Mock slow API to see loading state
      await mockApiSlow(page, 2000);

      await summaryTable.goto();

      // Should show loading indicator
      await summaryTable.assertLoading();
    });

    test('should display table after successful fetch', async ({ page }) => {
      await mockApiSuccess(page);

      await summaryTable.goto();
      await summaryTable.waitForTable();

      // Table should be visible with data
      await summaryTable.assertTableHasData();
      const locationCount = await summaryTable.getLocationCount();
      expect(locationCount).toBe(3); // Mock data has 3 locations
    });

    test('should save data to cache after successful fetch', async ({ page }) => {
      await mockApiSuccess(page);

      await summaryTable.goto();
      await summaryTable.waitForTable();

      // Verify cache was created
      const hasCache = await cacheExists(page);
      expect(hasCache).toBe(true);

      const cache = await getCache(page) as { timestamp?: number; dataSource?: string; version?: string };
      expect(cache).not.toBeNull();
      expect(cache?.timestamp).toBeDefined();
      expect(cache?.dataSource).toBe('real');
      expect(cache?.version).toBe('1.0');
    });

    test('should show error when API fails with no cache', async ({ page }) => {
      await mockApiError(page, { status: 500, message: 'Server Error' });

      await summaryTable.goto();
      await summaryTable.waitForLoadingComplete();

      // Should show error state with retry button
      await summaryTable.assertError();
    });

    test('should display error message from API', async ({ page }) => {
      await mockApiError(page, { status: 500, message: 'Database connection failed' });

      await summaryTable.goto();
      await summaryTable.waitForLoadingComplete();

      const errorMessage = await summaryTable.getErrorMessage();
      expect(errorMessage).toContain('500');
    });
  });

  test.describe('Two-Phase Loading (With Cache)', () => {
    test('should immediately show cached data while fetching', async ({ page }) => {
      // Seed cache first
      await seedFreshCache(page, 2);
      // Mock slow API
      await mockApiSlow(page, 3000);

      await summaryTable.goto();

      // Table should appear immediately from cache (not waiting for API)
      await summaryTable.waitForTable(5000);
      await summaryTable.assertTableHasData();
    });

    test('should update with fresh data when API succeeds', async ({ page }) => {
      await seedFreshCache(page, 2);
      await mockApiSuccess(page, { delay: 500 });

      await summaryTable.goto();
      await summaryTable.waitForTable();

      // Wait for API response and state update
      await page.waitForTimeout(1000);

      // Banner should not be visible (fresh data from API)
      await offlineBanner.assertHidden();
    });

    test('should keep showing cached data when API fails', async ({ page }) => {
      await seedFreshCache(page, 2);
      await mockApiError(page);

      await summaryTable.goto();
      await summaryTable.waitForTable();

      // Table should still show (from cache)
      await summaryTable.assertTableHasData();

      // Banner should indicate cached/offline data
      await offlineBanner.waitForBanner();
      const bannerType = await offlineBanner.getBannerType();
      // Could be cached, stale, or offline depending on network status detection
      expect(['cached', 'stale', 'offline']).toContain(bannerType);
    });

    test('should not show error page when API fails but cache exists', async ({ page }) => {
      await seedFreshCache(page, 2);
      await mockApiError(page);

      await summaryTable.goto();
      await summaryTable.waitForLoadingComplete();

      // Should NOT show error state
      const isError = await summaryTable.isError();
      expect(isError).toBe(false);

      // Should show table from cache
      await summaryTable.assertTableHasData();
    });
  });

  test.describe('Cache Validation', () => {
    test('should display regions from cached data', async ({ page }) => {
      await seedFreshCache(page);
      await mockApiError(page); // Force cache usage

      await summaryTable.goto();
      await summaryTable.waitForTable();

      const regionCount = await summaryTable.getRegionCount();
      expect(regionCount).toBeGreaterThan(0);
    });

    test('should display locations from cached data', async ({ page }) => {
      await seedFreshCache(page);
      await mockApiError(page);

      await summaryTable.goto();
      await summaryTable.waitForTable();

      const locationCount = await summaryTable.getLocationCount();
      expect(locationCount).toBe(3); // Mock data has 3 locations
    });
  });
});
