import { Input } from '@oclif/parser';
import { Contract } from '@toolscip/scdl-lib';
import BaseCommand from './base';
import shared from './shared';
import Config from './config';
import scip, { types } from '@toolscip/scip-lib';
import { AxiosResponse } from 'axios';

export default abstract class extends BaseCommand {
  static flags = {
    ...BaseCommand.flags,
    auth: shared.auth,
    jsonrpc: shared.jsonrpc,
    file: shared.file,
  };

  static args = [{ name: 'contract', description: `name of the contract to interact with`, required: true }];

  contract: Contract | undefined;

  /**
   * Checks whether the params object is a valid one
   * @param params JSON object to check
   */
  // tslint:disable-next-line:no-empty
  checkParams(_params: any) {}

  /**
   * Handle synchronous SCIP response
   * @param data response body
   */
  handleResponse(data: any) {
    try {
      const response = scip.parseResponse(data);
      if (response instanceof types.ScipQueryResult) {
        const queryResult = response.result as types.QueryResult;
        queryResult.occurrences.forEach(occurrence => {
          this.log('=========================================================================');
          this.log(`Occurrence at ${occurrence.timestamp} produces the following values:`);
          let count = 0;
          occurrence.params.forEach(param => {
            this.log(`${param.name !== '' ? param.name : 'param' + count} => ${param.value}`);
            count += 1;
          });
        });
      } else if (response instanceof types.ScipSuccess) {
        this.log(`Invoke request succeed with result : ${response.result}`);
      } else if (response instanceof types.ScipError) {
        this.log(`Invoke request failed with error :`, 'err');
        this.log('Code: ' + response.error.code, 'err');
        this.log('Message: ' + response.error.message, 'err');
        this.log('Info: ' + response.error.data, 'err');
      }
    } catch (err) {
      this.log(JSON.stringify(err), 'err');
    }
  }

  /**
   * Generates a SCIP request from command line parameters
   * and send it to the target gateway
   */
  abstract fromFlags(): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>>;

  /**
   * Generates a SCIP request from a JSON file
   * and send it to the target gateway
   */
  abstract fromFile(): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>>;

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

  async run() {
    if (this.flags.file) {
      this.fromFile()
        .then(res => {
          this.handleResponse(res.data);
        })
        .catch(err => {
          throw err;
        });
    } else {
      this.fromFlags()
        .then(res => {
          this.handleResponse(res.data);
        })
        .catch(err => {
          throw err;
        });
    }
  }
}
