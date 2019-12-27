import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { join } from 'path';
import { Config, loadConfig, box } from '../../utils';
import shared from '../../shared';

export default class ScdlList extends Command {
  static folderName = 'scdl';
  static description = `list saved SCDL smart contract's descriptors`;
  static limit = 5; // if 'extended' is not set returns only 5 descriptors

  static flags = {
    help: flags.help({ char: 'h', description: `show scdl:list command help` }),
    path: shared.path,
    extended: flags.boolean({
      char: 'e',
      description: 'retrieve ALL saved SCDL descriptors',
      default: false,
    }),
  };

  static args = [{ name: 'keyword', description: 'keyword search' }];

  async run() {
    const { flags } = this.parse(ScdlList);

    // loads configuration file
    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, ScdlList.folderName);

    fs.readdir(descriptorsFolder)
      .then(files => {
        box(files, 'descriptors');
      })
      .catch(err => {
        console.error(err);
      });
  }
}
