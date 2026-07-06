export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { enforceBlobEnvIsolation } = await import('@/lib/builder/storage/blob-env-guard');
    enforceBlobEnvIsolation();
  }
}
