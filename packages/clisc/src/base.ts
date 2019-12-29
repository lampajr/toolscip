import Command from '@oclif/command';
import { Input } from '@oclif/parser';
import chalk = require('chalk');
import { textSync } from 'figlet';
import Config from './config';
import shared from './shared';

export default abstract class extends Command {
  // base static flags
  static flags = {
    path: shared.path,
  };

  // base attributes
  flags: any;
  args: any;
  cliscConfig: Config | undefined;

  // base methods

  /**
   * Logs a specific message in the console, its appearence depends on the level of the message
   * @param msg message to print
   * @param level severity of the message
   */
  log(msg: any, level: string = 'log') {
    switch (level) {
      case 'log':
        console.log(chalk.green('> ') + msg);
        break;
      case 'info':
        console.info(msg);
        break;
      case 'warn':
        console.warn(msg);
        break;
      case 'err':
        console.error(chalk.red('> ') + msg);
        break;
    }
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
      this.cliscConfig = await Config.loadConfig(flags.path);
    }
  }

  async catch(err: any) {
    // handle any error from the command
    this.log(err.message, 'err');
  }

  async finally(_err: any) {
    // called after run and catch regardless of whether or not the command errored
  }
}
