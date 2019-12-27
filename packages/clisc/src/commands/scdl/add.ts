import { Command, flags } from '@oclif/command';
import { ISCDL } from '@toolscip/scdl-lib';
import { CLIError } from '@oclif/errors';
import * as fs from 'fs-extra';
import { join } from 'path';
import axios from 'axios';
import { Config, loadConfig, write } from '../../utils';
import shared from '../../shared';

export default class ScdlAdd extends Command {
  static folderName = 'scdl';
  static description = 'add a new SCDL descriptor in the local directory.';

  static flags = {
    help: flags.help({ char: 'h', description: `show scdl:add command help` }),
    path: shared.path,
    local: flags.boolean({
      char: 'l',
      description: 'add a new descriptor from a local file path',
      exclusive: ['remote'],
      default: false,
    }),
    remote: flags.boolean({
      char: 'r',
      description: 'add a new descriptor from a remote online registry',
      exclusive: ['local'],
      default: false,
    }),
  };

  static args = [
    {
      name: 'id',
      required: true,
      description: 'path to a local SCDL file or a unique identifier inside the online registry',
    },
  ];

  async run() {
    const { args, flags } = this.parse(ScdlAdd);

    // loads configuration file
    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, ScdlAdd.folderName);

    if (!flags.local && !flags.remote) {
      throw new CLIError(`You MUST set one of the following flags 'remote' or 'local'!`);
    }

    if (flags.local) {
      // save a new descriptor from a local path
      const filename: string = args.id.substring(args.id.lastIndexOf('/') + 1);
      fs.copyFile(join(config.dir, args.id), join(descriptorsFolder, filename))
        .then(val => {
          write(`Descriptor successfully saved at ${val}`);
        })
        .catch(err => {
          console.error(err.message);
        });
    } else {
      // download the descriptor from a remote registry
      if (config.registry) {
        const endpoint: string = `${config.registry}/${args.id}`;
        try {
          const descriptor: ISCDL = (await axios.get(endpoint)).data;
          write(`${descriptor.name} contract's descriptor downloaded`);
          fs.writeJSON(join(descriptorsFolder, descriptor.name + '.json'), descriptor, {
            spaces: '\t',
          })
            .then(_ => {
              write(`Descriptor successfully saved at ${descriptorsFolder}`);
            })
            .catch(err => {
              throw new CLIError(`Saving operation exited with this error - ${err.message}`);
            });
        } catch (err) {
          throw new CLIError(`The online registry request failed with this error - ${err.message}`);
        }
      } else {
        throw new CLIError("Missing online registry's url");
      }
    }
  }
}
