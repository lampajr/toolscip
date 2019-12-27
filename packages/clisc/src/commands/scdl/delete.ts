import { flags } from '@oclif/command';
import { CLIError } from '@oclif/errors';
import * as fs from 'fs-extra';
import { join } from 'path';
import BaseCommand from '../../base';

export default class ScdlDelete extends BaseCommand {
  static folderName = 'scdl';
  static description = `delete a specific descriptor from the local directory`;

  static flags = {
    ...BaseCommand.flags,
    help: flags.help({ char: 'h', description: `show scdl:list command help` }),
  };

  static args = [{ name: 'name', required: true, description: `name of the contract's descriptor to delete` }];

  async run() {
    if (this.cliscConfig === undefined || this.descriptorsFolder === undefined) {
      throw new CLIError('Unable to load the clisc configuration file!');
    }

    fs.remove(join(this.descriptorsFolder as string, this.args.name))
      .then(_ => {
        this.log(`Descriptor successfully removed at ${this.descriptorsFolder}`);
      })
      .catch(err => {
        throw new CLIError(`Delete operation exited with this error - ${err.message}`);
      });
  }
}
