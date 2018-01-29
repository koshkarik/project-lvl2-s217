#!/usr/bin/env node

import program from 'commander';

program
  .version('0.1.0')
  .option('-f, --format [type]', 'Output format')
  .arguments('Usage: gendiff [options] <firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .parse(process.argv);
