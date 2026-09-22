export function createLazyRead(read) {
  let cached;
  let started = false;
  return function () {
    if (!started) {
      started = true;
      cached = new Promise((resolve, reject) => {
        try {
          Promise.resolve(read()).then(resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
    return cached;
  };
}
