// https://www.chrisarmstrong.dev/posts/retry-timeout-and-cancel-with-fetch

// eslint-disable-next-line no-promise-executor-return
const throwOnTimeout = (timeout: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout));

export const fetchWithTimeout = (url: string, options: any = {}) => {
  const { timeout = 3000, ...remainingOptions } = options;
  console.log(`timeout is ${timeout}`);
  // if the timeout option is specified, race the
  // fetch call
  if (timeout) {
    return Promise.race([fetch(url, remainingOptions), throwOnTimeout(timeout)]);
  }
  return fetch(url, remainingOptions);
};

const fetchWithRetries = async (url :string, options :any, retryCount = 0) : Promise<any> => {
  // split out the maxRetries option from the remaining
  // options (with a default of 3 retries)
  const { maxRetries = 3, ...remainingOptions } = options;
  try {
    console.log(`retry ${retryCount}`);
    return await fetchWithTimeout(url, remainingOptions);
  } catch (error) {
    // if the retryCount has not been exceeded, call again
    if (retryCount < maxRetries) {
      console.log(`retry ${retryCount}`);
      return fetchWithRetries(url, options, retryCount + 1);
    }
    // max retries exceeded
    throw error;
  }
};

export default fetchWithRetries;
