#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';

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

