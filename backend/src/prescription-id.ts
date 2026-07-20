/**
 * Returns the public prescription number used throughout every portal.
 * Existing UUID/legacy IDs remain valid database keys, but are never exposed
 * as the human-facing prescription number.
 */
export function formatPrescriptionId(value: unknown): string {
  const raw = String(value ?? '').trim().toUpperCase();
  const numericMatch = raw.match(/^RX-?(\d+)$/) || raw.match(/^(\d+)$/);

  if (numericMatch) {
    const numericValue = Number(numericMatch[1]);
    if (Number.isSafeInteger(numericValue) && numericValue >= 0 && numericValue <= 99999) {
      return `RX${String(numericValue).padStart(5, '0')}`;
    }
  }

  // Give legacy UUIDs and other historical values a stable five-digit public
  // number without changing their primary/foreign keys in MySQL.
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  return `RX${String(10000 + (hash % 90000)).padStart(5, '0')}`;
}

export function formatPrescriptionRecord<T extends Record<string, any>>(record: T): T {
  if (String(record?.type ?? record?.category ?? '').trim().toUpperCase() !== 'PRESCRIPTION') {
    return record;
  }

  return {
    ...record,
    title: formatPrescriptionId(record.title || record.id),
  };
}
