import Command from '@oclif/command';
import { Input } from '@oclif/parser';
import chalk = require('chalk');
import { textSync } from 'figlet';
import Config from './config';
import shared from './shared';
import { join } from 'path';

export default abstract class extends Command {
  // base static flags
  static flags = {
    path: shared.path,
  };

  // base attributes
  flags: any;
  args: any;
  cliscConfig?: Config;
  loggerFilename?: string;

  // base methods

  /**
   * Logs a specific message in the console, its appearence depends on the level of the message
   * @param msg message to print
   * @param level severity of the message
   */
  log(msg: any, level: string = 'log') {
    switch (level) {
      case 'success':
        console.log(chalk.green(msg));
        break;
      case 'fail':
        console.log(chalk.red(msg));
        break;
      case 'log':
        // console.log(chalk.green('> ') + msg);
        console.log(msg);
        break;
      case 'info':
        console.info(msg);
        break;
      case 'warn':
        console.warn(msg);
        break;
      case 'err':
        // console.error(chalk.red('> ') + msg);
        console.error(msg);
        break;
    }
  }

  errorMessage(msg: any) {
    this.log(chalk.red('Error: ') + msg, 'err');
  }

  /**
   * Print a string message as title, with a specified format
   * @param msg message to print
   * @param format chalk.Chalk format
   */
  banner(msg: string, format: chalk.Chalk) {
    console.log(format(textSync(msg, { horizontalLayout: 'full' })));
  }

  async init() {
    // do some initialization
    const { args, flags } = this.parse(this.constructor as Input<any>);
    this.flags = flags;
    this.args = args;
    if (this.constructor.name !== 'Init') {
      this.cliscConfig = await Config.load(flags.path);
      this.loggerFilename = join(this.cliscConfig.dir, this.cliscConfig.logger);
    }
  }

  async catch(err: any) {
    // handle any error from the command
    this.errorMessage(err.message);
  }

  async finally(_err: any) {
    // called after run and catch regardless of whether or not the command errored
  }
}
