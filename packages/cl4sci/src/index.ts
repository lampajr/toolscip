#!/usr/bin/env node

import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';
import commander from 'commander'; // command-line library
import inquirer from 'inquirer'; // collection of common interactive command line user interfaces
import ora from 'ora'; // nodejs terminal spinner
import scip from '@lampajr/scip-lib';
import scdl from '@lampajr/scdl-lib';

let myValue = 0;

commander.version('1.0.0').description('Command Line for heterogeneous Smart Contracts interaction');

commander
  .command('print')
  .alias('p')
  .description('print the string passed as <value>')
  .arguments('<val>')
  .action(val => {
    console.log(chalk.red(figlet.textSync(val, { horizontalLayout: 'full' })));
    myValue = myValue + 1;
  });

commander.parse(process.argv);
