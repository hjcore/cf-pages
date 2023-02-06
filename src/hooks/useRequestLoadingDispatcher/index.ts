import { useCallback, useState } from 'react';

/**
 * use this hook, u can never manage loading status by urself
 * this hook will change the loading status automatically depending on the
 * state of the promise task that u gave
 *
 *
 * @returns [loading, executePromiseHandler]
 *
 */
export default function useRequestLoadingDispatcher<PromiseType = any>(
  defaultLoadingStatus: boolean = false
): [boolean, (promiseDispatcher: () => Promise<PromiseType>) => void] {
  const [loading, setLoading] = useState<boolean>(defaultLoadingStatus);

  // u can call this method anywhere, as u can see, it will mutate
  // the loading state automatically
  const executePromiseHandler = useCallback((promiseDispatcher: () => Promise<PromiseType>) => {
    setLoading(true);
    promiseDispatcher().finally(() => setLoading(false));
  }, []);

  return [loading, executePromiseHandler];
}
