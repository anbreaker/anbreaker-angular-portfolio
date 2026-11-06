/** Resolves a dotted translation key to plain text (markup stripped); falls back to the key itself. */
export function translationText(translations: object, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      translations
    );

  return (typeof value === 'string' ? value : key).replace(/<[^>]*>/g, '');
}
