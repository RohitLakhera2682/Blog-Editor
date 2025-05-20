import { useEffect } from "react";

/**
 * Runs a debounced effect only when the `shouldRun` flag is true.
 *
 * @param callback Function to execute after debounce delay
 * @param deps Dependency array for re-triggering
 * @param delay Delay in milliseconds
 * @param shouldRun Optional boolean to control execution (defaults to true)
 */
export function useDebouncedEffect(
  callback: () => void,
  deps: any[],
  delay: number,
  shouldRun: boolean = true
) {
  useEffect(() => {
    if (!shouldRun) return;

    const handler = setTimeout(() => callback(), delay);
    return () => clearTimeout(handler);
  }, [...deps, delay, shouldRun]);
}
