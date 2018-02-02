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
});

describe('Recursive files difference test', () => {
  const expected = fs.readFileSync('./__tests__/__fixtures__/genDiffComplExpected', 'utf-8');
  it('json files', () => {
    expect(genDiff('./__tests__/__fixtures__/beforeRecStructure.json', './__tests__/__fixtures__/afterRecStructure.json'))
      .toBe(expected);
  });
  it('yaml files', () => {
    expect(genDiff('./__tests__/__fixtures__/beforeRecStructure.yml', './__tests__/__fixtures__/afterRecStructure.yml'))
      .toBe(expected);
  });
  it('ini files', () => {
    expect(genDiff('./__tests__/__fixtures__/beforeRecStructure.ini', './__tests__/__fixtures__/afterRecStructure.ini'))
      .toBe(expected);
  });
  it('ini and yaml files', () => {
    expect(genDiff('./__tests__/__fixtures__/beforeRecStructure.ini', './__tests__/__fixtures__/afterRecStructure.yml'))
      .toBe(expected);
  });
});
