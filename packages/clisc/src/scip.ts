import { CLIError } from '@oclif/errors';
import { Contract } from '@toolscip/scdl-lib';
import BaseCommand from './base';
import shared from './shared';
import Config from './config';

export default abstract class extends BaseCommand {
  static flags = {
    ...BaseCommand.flags,
    auth: shared.auth,
    jsonrpc: shared.jsonrpc,
    file: shared.file,
  };

  static args = [{ name: 'contract', description: `name of the contract to interact with`, required: true }];

  contract: Contract | undefined;

  async init() {
    super.init();

    if (this.cliscConfig === undefined) {
      throw new CLIError('Unable to load the clisc configuration file!');
    }

    // retrieve the contract's information
    const filename: string = this.args.contract + '.json';
    const descriptor = await Config.getDescriptor(filename, this.cliscConfig.descriptorsFolder());
    // initialize the [[Contract]] object starting from its descriptor
    this.contract = new Contract(descriptor, this.flags.auth);
  }
}
