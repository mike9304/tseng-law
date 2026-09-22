export function createLazyRead<T>(read: () => T | PromiseLike<T>): () => Promise<Awaited<T>>;
