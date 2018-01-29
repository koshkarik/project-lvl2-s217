#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import findDiff from '..';

const genDiff = (file1, file2) => {
  const obj1 = JSON.parse(fs.readFileSync(file1));
  const obj2 = JSON.parse(fs.readFileSync(file2));
  return `{\n${findDiff(obj1, obj2)}}`;
};

program
  .version('0.1.0')
  .option('-f, --format', 'Output format')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((first, second) => {
    if (typeof first === 'undefined' || typeof second === 'undefined') {
      console.log('You have to give two files as parameters');
      process.exit(1);
    }
    console.log(genDiff(first, second));
  });

program.parse(process.argv);

export default genDiff;

