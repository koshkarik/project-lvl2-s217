import findDiff from './../src/';
import genDiff from '../src/bin/gendiff';

const object1 = { a: 1, b: 2, c: 3 };
const object2 = { a: 1, b: 4, d: 7 };

test('compare objects', () => {
  expect(findDiff(object1, object2)).toBe('    a: 1\n  + b: 4\n  - b: 2\n  - c: 3\n  + d: 7\n');
});

test('compare files', () => {
  expect(genDiff('./__tests__/__fixtures__/before.json', './__tests__/__fixtures__/after.json'))
    .toBe('{\n    host: hexlet.io\n  + timeout: 20\n  - timeout: 50\n  - proxy: 123.234.53.22\n  + verbose: true\n}');
});

