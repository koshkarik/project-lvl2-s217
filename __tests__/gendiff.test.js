import fs from 'fs';
import genDiff from './../src/';
import { findDiff } from './../src/classes/FileComparator';

const object1 = { a: 1, b: 2, c: 3 };
const object2 = { a: 1, b: 4, d: 7 };

test('compare objects', () => {
  expect(findDiff(object1, object2)).toBe(fs.readFileSync('./__tests__/__fixtures__/expected.txt', 'utf-8'));
});

const fileDiffExpected = '{\n    host: hexlet.io\n  + timeout: 20\n  - timeout: 50\n  - proxy: 123.234.53.22\n  + verbose: true\n}';

test('compare files', () => {
  expect(genDiff('./__tests__/__fixtures__/before.json', './__tests__/__fixtures__/after.json'))
    .toBe(fileDiffExpected);
});

test('compare .yml files', () => {
  expect(genDiff('./__tests__/__fixtures__/before.yml', './__tests__/__fixtures__/after.yml'))
    .toBe(fileDiffExpected);
});

test('compare .yml and .json files', () => {
  expect(genDiff('./__tests__/__fixtures__/before.yml', './__tests__/__fixtures__/after.json'))
    .toBe(fileDiffExpected);
});
