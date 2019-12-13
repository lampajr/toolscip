import { Command, flags } from '@oclif/command';
import { Contract, Method } from '@lampajr/scdl-lib';
import { Config, loadConfig, getDescriptor } from '../utils';
import { join } from 'path';
import { CLIError } from '@oclif/errors';

export default class Invoke extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
    path: flags.string({
      char: 'p',
      description: 'provide a path where the config files are located, if not set, the current dir is used',
    }),
    format: flags.string({ char: 'F', description: 'descriptor format', default: 'scdl' }),
    auth: flags.string({ char: 'a', description: 'authorization token' }),
    jsonrpc: flags.string({ char: 'j', description: 'jsonrpc request identifier', required: true }),
    contract: flags.string({ char: 'c', description: `contract's name`, required: true }),
    function: flags.string({ char: 'f', description: `name of the function to invoke`, required: true }),
    val: flags.string({
      char: 'v',
      description:
        'value to be passed as parameter to the function, if more than one value is required you can set this flag multiple times',
      multiple: true,
    }),
    callback: flags.string({
      char: 'u',
      description: 'callback URL to which the gateway will forward all asynchronous responses',
    }),
    corrId: flags.string({ char: 'i', description: 'client-provided correlation identifier' }),
    doc: flags.integer({ char: 'd', description: 'degree of confidence' }),
    timeout: flags.integer({
      char: 't',
      description: 'timeout that the gateway have to wait before block the operation',
    }),
  };

  async run() {
    const { flags } = this.parse(Invoke);

    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, flags.format);

    const filename: string = flags.contract + '.json';
    const descriptor: any = getDescriptor(filename, descriptorsFolder);

    try {
      // creates the contract object starting from the descriptor
      const contract: Contract = new Contract(descriptor, flags.auth);
      // retrieve the function/method to invoke
      const method: Method = contract.methods[flags.function];
      method
        .invoke(
          flags.jsonrpc,
          flags.function,
          flags.val,
          'abcdefgh',
          flags.callback,
          flags.corrId,
          flags.doc,
          flags.timeout,
        )
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    } catch (err) {
      throw new CLIError(`Error occurred creating the contract object: ${err.message}`);
    }
  }
}
