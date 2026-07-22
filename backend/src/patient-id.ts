import { randomInt } from 'crypto';

type SqlExecutor = {
  execute(sql: string, params?: any[]): Promise<any>;
};

export function patientInitials(name: string): string {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'PX';
  const first = words[0].replace(/[^a-zA-Z]/g, '').charAt(0) || 'P';
  const lastWord = words.length > 1 ? words[words.length - 1] : words[0];
  const second = words.length > 1
    ? lastWord.replace(/[^a-zA-Z]/g, '').charAt(0)
    : words[0].replace(/[^a-zA-Z]/g, '').charAt(1) || 'X';
  return `${first}${second}`.toUpperCase();
}

/** Format: two name initials + a unique three-digit number + registration year suffix. */
export async function allocatePatientId(executor: SqlExecutor, name: string, registeredAt = new Date()): Promise<string> {
  const initials = patientInitials(name);
  const yearSuffix = String(registeredAt.getFullYear()).slice(-2);
  const [rows]: any = await executor.execute(
    `SELECT id FROM patient WHERE id LIKE ?`,
    [`${initials}___${yearSuffix}`],
  );
  const used = new Set(
    (rows || [])
      .map((row: any) => String(row.id || ''))
      .filter((id: string) => new RegExp(`^${initials}\\d{3}${yearSuffix}$`).test(id))
      .map((id: string) => Number(id.slice(2, 5))),
  );
  if (used.size >= 900) throw new Error(`Patient ID range is exhausted for ${initials}${yearSuffix}.`);

  const start = randomInt(100, 1000);
  for (let offset = 0; offset < 900; offset += 1) {
    const number = 100 + ((start - 100 + offset) % 900);
    if (!used.has(number)) return `${initials}${number}${yearSuffix}`;
  }
  throw new Error('Unable to allocate a unique patient ID.');
}

export function isFormattedPatientId(id: string): boolean {
  return /^[A-Z]{2}\d{5}$/.test(String(id || '').toUpperCase());
}
