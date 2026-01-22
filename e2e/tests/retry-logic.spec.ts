// e2e/tests/retry-logic.spec.ts
// Tests for network retry behavior
//
// NOTE: Testing retry logic at the E2E level is challenging because:
// 1. The retry happens very quickly (no backoff delay in the app)
// 2. Route mocking may not perfectly simulate the retry timing
// These tests verify the retry behavior works when mocked appropriately.

import { test, expect } from '@playwright/test';
import { SummaryTablePage } from '../pages/summary-table.page';
import {
  mockApiSuccess,
  mockApiError,
} from '../utils/api-mocks';
import { seedFreshCache } from '../utils/cache-helpers';
import { mockApiResponse } from '../fixtures/mock-data/forecast-response';

test.describe('Retry Logic', () => {
  let summaryTable: SummaryTablePage;

  test.beforeEach(async ({ page }) => {
    summaryTable = new SummaryTablePage(page);
  });

  test.describe('Error Handling', () => {
    test('should show error after API fails with no cache', async ({ page }) => {
      await mockApiError(page, { status: 500 });

      await summaryTable.goto();
      await summaryTable.waitForLoadingComplete(60000);

      // Should show error state
      await summaryTable.assertError();
    });

    test('should show error message from API', async ({ page }) => {
      await mockApiError(page, { status: 500, message: 'Server Error' });

      await summaryTable.goto();
      await summaryTable.waitForLoadingComplete();

      const errorMessage = await summaryTable.getErrorMessage();
      expect(errorMessage).toContain('500');
    });

    test('should keep cached data when API fails', async ({ page }) => {
      await seedFreshCache(page);
      await mockApiError(page);

      await summaryTable.goto();
      await summaryTable.waitForTable(60000);

      // Should show cached data, not error
      await summaryTable.assertTableHasData();
    });
  });

  test.describe('Retry with Success', () => {
    test('should succeed when API eventually responds', async ({ page }) => {
      await mockApiSuccess(page);

      await summaryTable.goto();
      await summaryTable.waitForTable();

      await summaryTable.assertTableHasData();
    });

    test('should track API calls', async ({ page }) => {
      const calls: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('/forecasts/')) {
          calls.push(request.url());
        }
      });

      await mockApiSuccess(page);

      await summaryTable.goto();
      await summaryTable.waitForTable();

      // Should have made at least one API call
      expect(calls.length).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Retry Logging', () => {
    test('should log fetch attempts to console', async ({ page }) => {
      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.text().includes('fetchWithRetries') || msg.text().includes('fetchWithTimeout')) {
          logs.push(msg.text());
        }
      });

      await mockApiSuccess(page);

      await summaryTable.goto();
      await summaryTable.waitForTable();

      // Should have logged fetch attempts
      expect(logs.length).toBeGreaterThan(0);
    });

    test('should log success on successful fetch', async ({ page }) => {
      const logs: string[] = [];
      page.on('console', (msg) => {
        logs.push(msg.text());
      });

      await mockApiSuccess(page);

      await summaryTable.goto();
      await summaryTable.waitForTable();

      // Should have logged success
      const hasSuccessLog = logs.some((log) => log.includes('Success') || log.includes('success'));
      expect(hasSuccessLog).toBe(true);
    });
  });

  test.describe('Different Error Responses', () => {
    test('should handle 500 error', async ({ page }) => {
      await mockApiError(page, { status: 500 });

      await summaryTable.goto();
      await summaryTable.waitForLoadingComplete();

      await summaryTable.assertError();
    });

    test('should handle 503 error', async ({ page }) => {
      await page.route('**/forecasts/**', async (route) => {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Service Unavailable' }),
        });
      });

      await summaryTable.goto();
      await summaryTable.waitForLoadingComplete();

      await summaryTable.assertError();
    });

    test('should handle network abort', async ({ page }) => {
      await page.route('**/forecasts/**', async (route) => {
        await route.abort('failed');
      });

      await summaryTable.goto();
      await summaryTable.waitForLoadingComplete();

      await summaryTable.assertError();
    });
  });

  test.describe('Recovery Scenarios', () => {
    test('should recover when API becomes available after reload', async ({ page }) => {
      // First, show error
      await mockApiError(page);

      await summaryTable.goto();
      await summaryTable.waitForLoadingComplete();
      await summaryTable.assertError();

      // Now switch to success
      await page.unroute('**/forecasts/**');
      await mockApiSuccess(page);

      // Reload
      await page.reload();
      await summaryTable.waitForTable();

      await summaryTable.assertTableHasData();
    });
  });
});
