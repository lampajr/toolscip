import { Input } from '@oclif/parser';
import { Contract } from '@toolscip/scdl-lib';
import BaseCommand from './base';
import shared from './shared';
import Config from './config';
import scip, { types } from '@toolscip/scip-lib';

export default abstract class extends BaseCommand {
  static flags = {
    ...BaseCommand.flags,
    auth: shared.auth,
    jsonrpc: shared.jsonrpc,
    file: shared.file,
  };

  static args = [{ name: 'contract', description: `name of the contract to interact with`, required: true }];

  contract: Contract | undefined;

  handleResponse(data: any) {
    console.log(data);
    const response = scip.parseResponse(data);
    console.log(response);
    if (response instanceof types.ScipQueryResult) {
      console.log('query result');
      const queryResult = response.result as types.QueryResult;
      queryResult.occurrences.forEach(occurrence => {
        this.log('===========================');
        this.log(`Occurrence at ${occurrence.timestamp} produces the following values:`);
        let count = 0;
        occurrence.params.forEach(param => {
          this.log(`${param.name !== '' ? param.name : 'param' + count} => ${param.value}`);
          count += 1;
        });
      });
    } else if (response instanceof types.ScipSuccess) {
      console.log('success result');
      this.log(`Invoke request succeed with result : ${response.result}`);
    } else if (response instanceof types.ScipError) {
      console.log('error result');
      this.log(`Invoke request failed with error :`, 'err');
      this.log('Code: ' + response.error.code, 'err');
      this.log('Message: ' + response.error.message, 'err');
      this.log('Info: ' + response.error.data, 'err');
    }
  }

  async init() {
    const { args, flags } = this.parse(this.constructor as Input<any>);
    this.flags = flags;
    this.args = args;
    this.cliscConfig = await Config.loadConfig(flags.path);

    // retrieve the contract's information
    const filename: string = this.args.contract + '.json';
    const descriptor = await Config.getDescriptor(filename, this.cliscConfig.descriptorsFolder());
    // initialize the [[Contract]] object starting from its descriptor
    this.contract = new Contract(descriptor, this.flags.auth);
  }
}
