import { Command, flags } from '@oclif/command';
import { CLIError } from '@oclif/errors';
import { Config, loadConfig } from '../utils';
import Init from './init';
import fs from 'fs-extra';
import { join } from 'path'

export default class Descriptors extends Command {
  static description = 'Show the loaded descriptors';

  static flags = {
    help: flags.help({ char: 'h' }),
    path: flags.string({char: 'p', description: 'find the config file in a directory different from the current one'}),
    format: flags.string({ char: 'f', description: 'which type of descriptors do you want to retrieve' }),
    all: flags.boolean({ char: 'a' }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(Descriptors);
    if (
      (flags.format === undefined && flags.all === undefined) ||
      (flags.format !== undefined && flags.all !== undefined)
    ) {
      throw new CLIError(`You must provide exactly one flag between 'format' and 'all'`);
    }
    const formats = flags.format ? [flags.format] : Init.supportedFormats;
    const sciConfig: Config = await loadConfig(flags.path);

    for (const format of formats) {
      fs.readdir(join(sciConfig.dir, Init.descriptors, format))
        .then( files => {

        })
        .catch( err => {
          
        })
    }
  }
}
