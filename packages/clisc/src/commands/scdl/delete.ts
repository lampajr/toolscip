import { flags } from '@oclif/command';
import { CLIError } from '@oclif/errors';
import * as fs from 'fs-extra';
import { join } from 'path';
import Command from '../../base';
import { Config, loadConfig, write } from '../../utils';

export default class ScdlDelete extends Command {
  static folderName = 'scdl';
  static description = `delete a specific descriptor from the local directory`;

  static flags = {
    ...Command.flags,
    help: flags.help({ char: 'h', description: `show scdl:list command help` }),
  };

  static args = [{ name: 'name', required: true, description: `name of the contract's descriptor to delete` }];

  async run() {
    const { args, flags } = this.parse(ScdlDelete);

    // loads configuration file
    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, ScdlDelete.folderName);
    fs.remove(join(descriptorsFolder, args.name))
      .then(_ => {
        write(`Descriptor successfully saved at ${descriptorsFolder}`);
      })
      .catch(err => {
        throw new CLIError(`Saving operation exited with this error - ${err.message}`);
      });
  }
}
