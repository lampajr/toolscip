import { Command, flags } from '@oclif/command';
import { CLIError } from '@oclif/errors';
import { Config, loadConfig } from '../utils';
import Init from './init';
import fs from 'fs-extra';
import { join } from 'path';

export default class Descriptors extends Command {
  static description = 'manage local descriptors';

  static flags = {
    help: flags.help({ char: 'h' }),
    path: flags.string({
      char: 'p',
      description: 'find the configiguration file in a directory different from the current one',
    }),
    add: flags.string({ char: 'a', description: 'add a new descriptor' }),
    local: flags.boolean({
      char: 'l',
      description: 'add a new descriptor from a local file',
      dependsOn: ['add'],
      exclusive: ['remote'],
    }),
    remote: flags.boolean({
      char: 'r',
      description: 'add a new descriptor from a remote registry',
      dependsOn: ['add'],
      exclusive: ['local'],
    }),
    delete: flags.string({ char: 'd', description: 'delete a local descriptor' }),
    format: flags.string({
      char: 'f',
      description: 'which type of descriptors do you want to retrieve',
      default: Init.supportedFormats[0],
      options: Init.supportedFormats,
      exclusive: ['all'],
    }),
    all: flags.boolean({ description: 'list all loaded descriptors', exclusive: ['format', 'add', 'local', 'remote'] }),
  };

  async run() {
    const { args, flags } = this.parse(Descriptors);
    const formats = flags.format ? [flags.format] : Init.supportedFormats;
    const sciConfig: Config = await loadConfig(flags.path);
    const descriptorsDir = join(sciConfig.dir, Init.descriptors);

    if (flags.add) {
      // add a new descriptor
      if (!flags.local && !flags.remote) {
        throw new CLIError(`You must set exactly one of the following flags 'remote' and 'local'!`);
      }
    } else if (flags.delete) {
      // delete one or more local descriptors
    } else {
      // list one or more descriptors
      for (const format of formats) {
        fs.readdir(join(descriptorsDir, format))
          .then(files => {
            console.log(files);
          })
          .catch(err => {});
      }
    }
  }
}
