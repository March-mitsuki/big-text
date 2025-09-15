export function waitUntil(condition: () => boolean, interval = 100, timeout = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = setInterval(() => {
      if (condition()) {
        clearInterval(check);
        resolve();
      } else if (Date.now() - start > timeout) {
        clearInterval(check);
        reject(new Error("Wait Timeout exceeded"));
      }
    }, interval);
  });
}
