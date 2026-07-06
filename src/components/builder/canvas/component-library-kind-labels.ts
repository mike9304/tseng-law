export function getComponentLibraryKindLabel(
  labels: Readonly<Record<string, string>>,
  fallback: string,
  rootKind: string,
): string {
  return labels[rootKind] ?? fallback;
}
