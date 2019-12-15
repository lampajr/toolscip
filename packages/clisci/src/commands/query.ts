import { Command, flags } from '@oclif/command';
import { CLIError } from '@oclif/errors';
import { Config, loadConfig, getDescriptor } from '../utils';
import { join } from 'path';
import { Contract, Method, Event } from '@lampajr/scdl-lib';

export default class Query extends Command {
  static description = 'Command used to query past event occurences or function invocations';

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
    function: flags.string({ char: 'f', description: `name of the function to query`, exclusive: ['event'] }),
    event: flags.string({ char: 'e', description: `name of the event to query`, exclusive: ['function'] }),
    val: flags.string({
      char: 'v',
      description:
        'value to be passed as parameter to the function, if more than one value is required you can set this flag multiple times',
      multiple: true,
      required: true,
    }),
    filter: flags.string({ char: 'l', description: 'C-style boolean expression over function/event parameters' }),
    startTime: flags.string({
      char: 's',
      description: 'start time from which start considering event occurrences or function invocations',
    }),
    endTime: flags.string({
      char: 'd',
      description: 'end time until which stop considering event occurrences or function invocations',
    }),
  };

  async run() {
    const { args, flags } = this.parse(Query);

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
            `'${flags.function ? 'Method name ' + flags.function : 'Event named' + flags.event}' not found in '${
              contract.descriptor.name
            }' contract\nThis contract has the following available ${
              flags.function ? 'methods: [' + Object.keys(contract.methods) : 'events: [' + Object.keys(contract.events)
            }]`,
          );
        }
        attribute
          .query(
            flags.jsonrpc,
            flags.function ? flags.function : (flags.event as string),
            flags.val !== undefined ? flags.val : [],
            flags.filter,
            flags.startTime,
            flags.endTime,
          )
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
        throw new CLIError(`During contract creation - ${err.message}`);
      }
    }
  }
}
