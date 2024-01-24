import { describe } from 'vitest';
import { parseToISO } from '~/utils/date/date';
import { DateTime } from 'luxon';

describe('date utils', () => {
  test('given valid date then parsing returns iso date', () => {
    const now = DateTime.now();
    const dateAsIso = parseToISO(now);
    expect(dateAsIso).not.toBeNull();
    expect(DateTime.fromISO(dateAsIso).toMillis()).toBe(now.toMillis());
  });

  test('given invalid date then parsing throws Error', () => {
    const invalid: DateTime = DateTime.fromISO('bla');
    expect(() => parseToISO(invalid)).toThrowError(/.*parse.*/i);

  });
});
