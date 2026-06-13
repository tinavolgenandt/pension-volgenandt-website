type JsonLdNode = Record<string, unknown>

function isJsonLdGraph(value: unknown): value is JsonLdNode {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function useJsonLd(input: JsonLdNode | JsonLdNode[], key = 'json-ld') {
  const payload = Array.isArray(input)
    ? { '@context': 'https://schema.org', '@graph': input }
    : isJsonLdGraph(input) && input['@context']
      ? input
      : { '@context': 'https://schema.org', ...input }

  useHead({
    script: [
      {
        key,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(payload),
      },
    ],
  })
}
