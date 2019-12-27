import Command, { flags } from '@oclif/command';
import { Input } from '@oclif/parser';
import { Config, loadConfig } from './utils';
import shared from './shared';
import { join } from 'path';

export default abstract class extends Command {
  // base static flags
  static flags = {
    loglevel: flags.string({ options: ['error', 'warn', 'info', 'debug'] }),
    path: shared.path,
  };

  // base attributes
  flags: any;
  args: any;
  cliscConfig: Config | undefined;
  descriptorsFolder: string | undefined;

  // base methods
  log(msg: string, level: string) {
    switch (this.flags.loglevel) {
      case 'error':
        if (level === 'error') {
          console.error(msg);
        }
        break;
      // a complete example would need to have all the levels
    }
  }

  async init() {
    // do some initialization
    const { args, flags } = this.parse(this.constructor as Input<any>);
    this.flags = flags;
    this.args = args;
    this.cliscConfig = await loadConfig(flags.path);
    this.descriptorsFolder = join(this.cliscConfig.dir, Config.configFolder, Config.descriptorsFolder, 'scdl');
  }

  async catch(err: any) {
    // handle any error from the command
    console.log(err);
  }
  async finally(_err: any) {
    // called after run and catch regardless of whether or not the command errored
  }
}
