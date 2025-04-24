export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return function (...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      result = fn(...args);
      called = true;
    }
    return result;
  } as T;
}
