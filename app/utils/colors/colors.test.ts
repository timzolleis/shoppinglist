import { describe } from 'vitest';
import { hexToRgb, rgbToHex } from '~/utils/colors/colors';
import { faker } from '@faker-js/faker';

describe('color utils', () => {
  test('given hex color when converted to hex and back then result should be the original value', () => {
    const hex = '#7a6419';
    expect(rgbToHex(hexToRgb(hex))).toBe(hex);
  });

  test('given number with one value less than 10, then conversion is done correct', () => {
    const hex = '#7a6409';
    const color = hexToRgb(hex);
    expect(rgbToHex(color)).toBe(hex);

  });

  test('given only zeros than conversion contains all zero values', () => {
    const hex = '#000000';
    const color = hexToRgb(hex);
    expect(rgbToHex(color)).toBe(hex);
  });

  test('given value is too short, then conversion is invalid', () => {
    const hex = '#0'; // valid hex value ?
    const color = hexToRgb(hex);
    expect(rgbToHex(color)).not.toBe(hex); // result is #00NaNNaN
  });

  test('given random hex value is converted then result is same as the original value', () => {
    const hex = faker.color.rgb({ prefix: '#', casing: 'lower' });
    const color = hexToRgb(hex);
    expect(rgbToHex(color)).toBe(hex);
  }, { repeats: 20 });
});