import { Input } from '@oclif/parser';
import { CLIError } from '@oclif/errors';
import { Contract } from '@toolscip/scdl-lib';
import BaseCommand from './base';
import shared from './shared';
import Config from './config';
import scip, { types, ScipRequest } from '@toolscip/scip-lib';
import { AxiosResponse } from 'axios';
import * as fs from 'fs-extra';

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
   * Generates a SCIP request from command line parameters
   * and send it to the target gateway
   */
  abstract fromFlags(): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>>;

  /**
   * Generates a SCIP request from a JSON file
   * and send it to the target gateway
   */
  abstract fromFile(): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>>;

  /**
   * Parses a generic data into a ScipRequest object, if valid.
   * @param data JSON data to parse
   * @returns a Proomis of a ScipRequest
   */
  async parseRequest(): Promise<ScipRequest> {
    let data: any = null;
    let request: ScipRequest;

    if (this.contract === undefined) {
      throw new CLIError(`Contract has not been initialized. Fatal error!`);
    }

    try {
      data = await fs.readJSON(this.flags.file);
    } catch (err) {
      throw new CLIError(`Unable to find a file at '${this.flags.file}'`);
    }

    try {
      request = scip.parseRequest(data);
    } catch (err) {
      throw new CLIError(`Malformed request - ${err.data}`);
    }

    if (request === undefined) {
      throw new CLIError(`Unexpected error!`);
    }

    return request;
  }

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
      try {
        await this.fromFile()
          .then(res => {
            this.handleResponse(res.data);
          })
          .catch(err => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    } else {
      if (!this.flags.jsonrpc) {
        throw new CLIError(`Missing required flag: -j --jsonrpc`);
      }
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
