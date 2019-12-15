import { Command, flags } from '@oclif/command';
import { CLIError } from '@oclif/errors';
import { Config, loadConfig, getDescriptor } from '../utils';
import { join } from 'path';
import { Contract, Method, Event } from '@lampajr/scdl-lib';

export default class Unsubscribe extends Command {
  static description = `Command used to stop live monitoring of a smart contract's function or event by unsubscribing a previous subscription.`;

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
    function: flags.string({ char: 'f', description: `name of the function to unsubscribe`, exclusive: ['event'] }),
    event: flags.string({ char: 'e', description: `name of the event to unsubscribe`, exclusive: ['function'] }),
    corrId: flags.string({ char: 'i', description: 'client-provided correlation identifier' }),
  };

  async run() {
    const { flags } = this.parse(Unsubscribe);

    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, flags.format);

    const filename: string = flags.contract + '.json';
    const descriptor = await getDescriptor(filename, descriptorsFolder);

    if (!flags.function && !flags.event) {
      throw new CLIError(`You MUST provide 'function' or 'event' flag!`);
    } else {
      try {
        // creates the contract object starting from the descriptor
        const contract: Contract = new Contract(descriptor, flags.auth);
        // retrieve the function/event to subscribe
        const attribute: Method | Event = flags.function
          ? contract.methods[flags.function]
          : contract.events[flags.event as string];

        if (attribute === undefined) {
          throw new CLIError(
            `${flags.function ? "Method name '" + flags.function : "Event named'" + flags.event}" not found in '${
              contract.descriptor.name
            }' contract\nThis contract has the following available ${
              flags.function ? 'methods: [' + Object.keys(contract.methods) : 'events: [' + Object.keys(contract.events)
            }]`,
          );
        }
        attribute
          .unsubscribe(flags.jsonrpc, flags.function ? flags.function : (flags.event as string), flags.corrId)
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.error(err);
          });
      } catch (err) {
        if (err instanceof CLIError) {
          throw err;
        }
        throw new CLIError(err.message);
      }
    }
  }
}
