// e2e/utils/api-mocks.ts
// API mocking utilities for Playwright E2E tests

import { Page, Route } from '@playwright/test';
import { mockApiResponse } from '../fixtures/mock-data/forecast-response';

const API_URL_PATTERN = '**/forecasts/**';

export interface MockApiOptions {
  delay?: number;
  status?: number;
  response?: object;
}

/**
 * Mock successful API response
 */
export async function mockApiSuccess(
  page: Page,
  options: MockApiOptions = {},
): Promise<void> {
  const { delay = 0, response = mockApiResponse } = options;

  await page.route(API_URL_PATTERN, async (route: Route) => {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Mock API error response
 */
export async function mockApiError(
  page: Page,
  options: { status?: number; message?: string; delay?: number } = {},
): Promise<void> {
  const { status = 500, message = 'Internal Server Error', delay = 0 } = options;

  await page.route(API_URL_PATTERN, async (route: Route) => {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: message }),
    });
  });
}

/**
 * Mock API timeout (request hangs)
 */
export async function mockApiTimeout(page: Page): Promise<void> {
  await page.route(API_URL_PATTERN, async (route: Route) => {
    // Never respond - simulates timeout
    await new Promise(() => {});
  });
}

/**
 * Mock API to fail N times then succeed
 * Useful for testing retry logic
 */
export async function mockApiWithRetries(
  page: Page,
  failCount: number,
  options: MockApiOptions = {},
): Promise<{ getCallCount: () => number }> {
  let callCount = 0;
  const { delay = 0, response = mockApiResponse } = options;

  await page.route(API_URL_PATTERN, async (route: Route) => {
    callCount++;
    console.log(`[mockApiWithRetries] Call ${callCount}, failCount: ${failCount}`);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (callCount <= failCount) {
      // Fail the request
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: `Simulated failure ${callCount}` }),
      });
    } else {
      // Succeed
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    }
  });

  return {
    getCallCount: () => callCount,
  };
}

/**
 * Mock network offline by aborting all API requests
 */
export async function mockNetworkOffline(page: Page): Promise<void> {
  await page.route(API_URL_PATTERN, async (route: Route) => {
    await route.abort('failed');
  });
}

/**
 * Remove API mocks to restore normal behavior
 */
export async function clearApiMocks(page: Page): Promise<void> {
  await page.unroute(API_URL_PATTERN);
}

/**
 * Mock slow API response
 */
export async function mockApiSlow(
  page: Page,
  delayMs: number = 3000,
): Promise<void> {
  await mockApiSuccess(page, { delay: delayMs });
}

/**
 * Wait for API call to complete
 */
export async function waitForApiCall(page: Page): Promise<void> {
  await page.waitForResponse(
    (response) => response.url().includes('/forecasts/'),
    { timeout: 15000 },
  );
}

/**
 * Count API calls made during a test
 */
export async function trackApiCalls(
  page: Page,
): Promise<{ getCalls: () => string[] }> {
  const calls: string[] = [];

  page.on('request', (request) => {
    if (request.url().includes('/forecasts/')) {
      calls.push(request.url());
    }
  });

  return {
    getCalls: () => [...calls],
  };
}
