import { flags } from '@oclif/command';
import { CLIError } from '@oclif/errors';
import * as fs from 'fs-extra';
import Command from '../../base';
import { box } from '../../utils';

export default class ScdlList extends Command {
  static folderName = 'scdl';
  static limit = 5; // if 'extended' is not set returns only 5 descriptors

  static description = `list saved SCDL smart contract's descriptors`;
  static aliases = ['scdl:list', 'scdl:index', 'scdl:get'];

  static flags = {
    ...Command.flags,
    help: flags.help({ char: 'h', description: `show scdl:list command help` }),
    extended: flags.boolean({
      char: 'e',
      description: 'retrieve ALL saved SCDL descriptors',
      default: false,
    }),
  };

  static args = [{ name: 'keyword', description: 'keyword search' }];

  async run() {
    // const { args } = this.parse(ScdlList);

    if (this.cliscConfig === undefined || this.descriptorsFolder === undefined) {
      throw new CLIError('Unable to load the clisc configuration file!');
    }

    fs.readdir(this.descriptorsFolder as string)
      .then(files => {
        box(files, 'descriptors');
      })
      .catch(err => {
        console.error(err);
      });
  }
}
