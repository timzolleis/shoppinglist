import { DateTime } from 'luxon';

export function getNowAsISO() {
  return parseToISO(DateTime.now());
}

export function parseToISO(dateTime: DateTime) {
  const iso = dateTime.toISO();
  if (!iso) throw new Error('Could not parse to ISO');
  return iso;
}
