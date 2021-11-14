const MAX_INT_32_BITS = 2147483647; // 2^32 - 1

const setTimeoutWithOverflow = <Args extends unknown[] = []>(
  callback: (...args: Args) => void,
  ms = 0,
  ...args: Args
): NodeJS.Timeout => {
  return ms > MAX_INT_32_BITS
    ? setTimeout(
        () => setTimeoutWithOverflow(callback, ms - MAX_INT_32_BITS, ...args),
        MAX_INT_32_BITS
      )
    : setTimeout(callback, ms, ...args);
};

export default setTimeoutWithOverflow;
