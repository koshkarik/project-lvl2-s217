import fs from 'fs';
import genDiff, { findDiff } from './../src/';

const object1 = { a: 1, b: 2, c: 3 };
const object2 = { a: 1, b: 4, d: 7 };

test('compare objects', () => {
  expect(findDiff(object1, object2)).toBe(fs.readFileSync('./__tests__/__fixtures__/expected.txt', 'utf-8'));
});

test('compare files', () => {
  expect(genDiff('./__tests__/__fixtures__/before.json', './__tests__/__fixtures__/after.json'))
    .toBe('{\n    host: hexlet.io\n  + timeout: 20\n  - timeout: 50\n  - proxy: 123.234.53.22\n  + verbose: true\n}');
});

