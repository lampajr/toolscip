import Command, { flags } from '@oclif/command';
import { Config, loadConfig } from './utils';
import shared from './shared';
import { join } from 'path';

export default abstract class extends Command {
  static flags = {
    loglevel: flags.string({ options: ['error', 'warn', 'info', 'debug'] }),
    path: shared.path,
  };

  public flags: any;
  public cliscConfig: Config | undefined;
  public descriptorsFolder: string | undefined;

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
    const { flags } = this.parse(this.constructor.prototype);
    this.flags = flags;
    this.cliscConfig = await loadConfig(flags.path);
    this.descriptorsFolder = join(this.cliscConfig.dir, Config.configFolder, Config.descriptorsFolder, 'scdl');
  }

  async catch(err: any) {
    // handle any error from the command
    console.log(err);
  }
  async finally(_err: any) {
    // called after run and catch regardless of whether or not the command errored
    console.log('===== END =====');
  }
}
