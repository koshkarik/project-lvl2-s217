import fs from 'fs';
import genDiff from './../src/';

describe('Flat file difference tests', () => {
  const expected = fs.readFileSync('./__tests__/__fixtures__/genDiffExpected', 'utf-8');
  it('json files', () => {
    expect(genDiff('./__tests__/__fixtures__/before.json', './__tests__/__fixtures__/after.json'))
      .toBe(expected);
  });
  it('yml files', () => {
    expect(genDiff('./__tests__/__fixtures__/before.yml', './__tests__/__fixtures__/after.yml'))
      .toBe(expected);
  });
  it('yml and json files', () => {
    expect(genDiff('./__tests__/__fixtures__/before.yml', './__tests__/__fixtures__/after.json'))
      .toBe(expected);
  });
  it('ini files', () => {
    expect(genDiff('./__tests__/__fixtures__/before.ini', './__tests__/__fixtures__/after.ini'))
      .toBe(expected);
  });
  const recExpected = fs.readFileSync('./__tests__/__fixtures__/genDiffComplExpected', 'utf-8');
  it('json recurse files', () => {
    expect(genDiff('./__tests__/__fixtures__/beforeRecStructure.json', './__tests__/__fixtures__/afterRecStructure.json'))
      .toBe(recExpected);
  });
  it('yaml recurse files', () => {
    expect(genDiff('./__tests__/__fixtures__/beforeRecStructure.yml', './__tests__/__fixtures__/afterRecStructure.yml'))
      .toBe(recExpected);
  });
  it('ini recurse files', () => {
    expect(genDiff('./__tests__/__fixtures__/beforeRecStructure.ini', './__tests__/__fixtures__/afterRecStructure.ini'))
      .toBe(recExpected);
  });
  it('ini and yaml recurse files', () => {
    expect(genDiff('./__tests__/__fixtures__/beforeRecStructure.ini', './__tests__/__fixtures__/afterRecStructure.yml'))
      .toBe(recExpected);
  });
});

describe('Plane difference', () => {
  const easyFlatExpected = fs.readFileSync('./__tests__/__fixtures__/easyPlainExpected', 'utf-8');
  const recursePlainExpected = fs.readFileSync('./__tests__/__fixtures__/recursePlainExpected', 'utf-8');
  it('easy files', () => {
    expect(genDiff('./__tests__/__fixtures__/before.yml', './__tests__/__fixtures__/after.json', 'plain')).toBe(easyFlatExpected);
  });
  it('recursive files', () => {
    expect(genDiff('./__tests__/__fixtures__/recursePlainBefore.json', './__tests__/__fixtures__/recursePlainAfter.json', 'plain')).toBe(recursePlainExpected);
  });
});
