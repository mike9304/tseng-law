export class BuilderCmsValidationError extends Error {
  constructor(message: string, public readonly issues: readonly string[] = [message]) {
    super(message);
    this.name = 'BuilderCmsValidationError';
  }
}
