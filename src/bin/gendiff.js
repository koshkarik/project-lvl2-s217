#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';

program
  .version('0.1.0')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format')
  .description('Compares two configuration files and shows a difference.')
  .action((first, second) => {
    console.log(genDiff(first, second, program.format));
  });

program.parse(process.argv);

