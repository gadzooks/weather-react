// retry.ts

// https://www.chrisarmstrong.dev/posts/retry-timeout-and-cancel-with-fetch

const throwOnTimeout = (timeout: number) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeout);
  });

export const fetchWithTimeout = (
  url: string,
  options: any = {},
): Promise<Response> => {
  const { timeout = 50000, ...remainingOptions } = options;
  console.log(`[fetchWithTimeout] URL: ${url}, timeout: ${timeout}ms`);
  // if the timeout option is specified, race the
  // fetch call
  if (timeout) {
    return Promise.race([
      fetch(url, remainingOptions),
      throwOnTimeout(timeout),
    ]) as Promise<Response>;
  }
  return fetch(url, options);
};

const fetchWithRetries = async (
  url: string,
  options: any,
  retryCount = 0,
): Promise<Response> => {
  // split out the maxRetries option from the remaining
  // options (with a default of 3 retries)
  const { maxRetries = 3, ...remainingOptions } = options;
  try {
    console.log(
      `[fetchWithRetries] Attempt ${retryCount + 1}/${maxRetries + 1} for ${url}`,
    );
    const response = await fetchWithTimeout(url, remainingOptions);
    console.log(
      `[fetchWithRetries] Success on attempt ${retryCount + 1}: status ${response.status}`,
    );
    return response;
  } catch (error) {
    console.error(
      `[fetchWithRetries] Attempt ${retryCount + 1} failed:`,
      error,
    );
    // if the retryCount has not been exceeded, call again
    if (retryCount < maxRetries) {
      return fetchWithRetries(url, options, retryCount + 1);
    }
    // max retries exceeded
    console.error(
      `[fetchWithRetries] All ${maxRetries + 1} attempts failed for ${url}`,
    );
    throw error;
  }
};

export default fetchWithRetries;
