type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * Inline JSON-LD script with `</script>` and line-terminator escaping. Without
 * this, a user-provided string containing `</script>` would break out of the
 * inline script element and enable HTML injection. U+2028 / U+2029 also need
 * escaping because they terminate JavaScript strings in older parsers.
 */
const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);

function safeJsonLd(payload: Record<string, unknown>): string {
  return JSON.stringify(payload)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split(LS).join('\\u2028')
    .split(PS).join('\\u2029');
}

export default function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />;
}
