// https://www.chrisarmstrong.dev/posts/retry-timeout-and-cancel-with-fetch

// eslint-disable-next-line no-promise-executor-return
const throwOnTimeout = (timeout: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout));

export const fetchWithTimeout = (url: string, options: any = {}) => {
  const { timeout = 10000, ...remainingOptions } = options;
  console.log(`[fetchWithTimeout] URL: ${url}, timeout: ${timeout}ms`);
  // if the timeout option is specified, race the
  // fetch call
  if (timeout) {
    return Promise.race([fetch(url, remainingOptions), throwOnTimeout(timeout)]);
  }
  return fetch(url, options);
};

const fetchWithRetries = async (url :string, options :any, retryCount = 0) : Promise<any> => {
  // split out the maxRetries option from the remaining
  // options (with a default of 3 retries)
  const { maxRetries = 6, ...remainingOptions } = options;
  try {
    console.log(`[fetchWithRetries] Attempt ${retryCount + 1}/${maxRetries + 1} for ${url}`);
    const response = await fetchWithTimeout(url, remainingOptions);
    console.log(`[fetchWithRetries] Success on attempt ${retryCount + 1}: status ${response.status}`);
    return response;
  } catch (error) {
    console.error(`[fetchWithRetries] Attempt ${retryCount + 1} failed:`, error);
    // if the retryCount has not been exceeded, call again
    if (retryCount < maxRetries) {
      console.log(`[fetchWithRetries] Retrying... (${retryCount + 1}/${maxRetries})`);
      return fetchWithRetries(url, options, retryCount + 1);
    }
    // max retries exceeded
    console.error(`[fetchWithRetries] All ${maxRetries + 1} attempts failed for ${url}`);
    throw error;
  }
};

export default fetchWithRetries;
