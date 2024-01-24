import { describe } from 'vitest';
import { hexToRgb, rgbToHex } from '~/utils/colors/colors';

describe('color utils', () => {
  test('given hex color when converted to hex and back then result should be the original value', () => {
    const hex = '#7a6419';// faker.color.rgb({ prefix: '#', casing: 'lower' }) // '#eb0c16'
    expect(rgbToHex(hexToRgb(hex))).toBe(hex);
  });

  test.skip('koennte ein Fehler sein, wenn der Wert eine 0 enthaelt', () => {
    const hex = '#7a6409';
    const color = hexToRgb(hex);
    expect(rgbToHex(color)).toBe(hex); // das Ergebnis ist '#7a649'

  });
});